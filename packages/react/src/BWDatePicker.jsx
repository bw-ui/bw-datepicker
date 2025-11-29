/**
 * @bw-ui/datepicker-react
 * React wrapper for BW DatePicker
 *
 * @version 1.0.0
 * @license MIT
 */

import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
  memo,
} from 'react';

/**
 * BWDatePicker React Component
 *
 * @example
 * ```jsx
 * import { BWDatePicker } from '@bw-ui/datepicker-react';
 * import { ThemingPlugin } from '@bw-ui/datepicker-theming';
 *
 * function App() {
 *   const [date, setDate] = useState(null);
 *
 *   return (
 *     <BWDatePicker
 *       value={date}
 *       onChange={setDate}
 *       plugins={[ThemingPlugin]}
 *       pluginOptions={{ theming: { theme: 'dark' } }}
 *     />
 *   );
 * }
 * ```
 */
const BWDatePicker = forwardRef(function BWDatePicker(props, ref) {
  const {
    // Value & Change
    value,
    defaultValue,
    onChange,

    // Core options
    mode = 'popup',
    format = 'YYYY-MM-DD',
    placeholder = 'Select date',
    disabled = false,
    readOnly = false,

    // Date constraints
    minDate,
    maxDate,
    disabledDates,

    // Display options
    firstDayOfWeek = 0,
    showWeekNumbers = false,
    showOtherMonths = true,
    numberOfMonths = 1,

    // Plugins
    plugins = [],
    pluginOptions = {},

    // Event callbacks
    onOpen,
    onClose,
    onMonthChange,
    onYearChange,
    onFocus,
    onBlur,

    // Input props
    className,
    inputClassName,
    style,
    inputStyle,
    id,
    name,
    autoComplete = 'off',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,

    // Rest props passed to input
    ...restProps
  } = props;

  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      // Core methods
      open: () => pickerRef.current?.open(),
      close: () => pickerRef.current?.close(),
      toggle: () => {
        const picker = pickerRef.current;
        if (picker) {
          const state = picker.getStateManager()?.getState();
          state?.isOpen ? picker.close() : picker.open();
        }
      },
      clear: () => pickerRef.current?.clear(),
      setDate: (date) => pickerRef.current?.setDate(date),
      getDate: () => pickerRef.current?.getDate(),

      // Navigation
      prevMonth: () => pickerRef.current?.prevMonth(),
      nextMonth: () => pickerRef.current?.nextMonth(),
      prevYear: () => pickerRef.current?.prevYear(),
      nextYear: () => pickerRef.current?.nextYear(),
      today: () => pickerRef.current?.today(),

      // Plugin access
      getPlugin: (name) => pickerRef.current?.getPlugin(name),
      hasPlugin: (name) => pickerRef.current?.hasPlugin(name),

      // DOM access
      getInputElement: () => inputRef.current,
      getPickerElement: () => pickerRef.current?.getPickerElement(),

      // Instance access
      getInstance: () => pickerRef.current,
    }),
    []
  );

  // Initialize picker
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    let DatePickerCore;

    const initPicker = async () => {
      if (!inputRef.current || isInitializedRef.current) return;

      try {
        // Import core dynamically
        const module = await import('@bw-ui/datepicker');
        DatePickerCore = module.DatePickerCore || module.default;

        if (!DatePickerCore) {
          console.error('BWDatePicker: Could not load @bw-ui/datepicker');
          return;
        }

        // Build options
        const options = {
          mode,
          format,
          firstDayOfWeek,
          showWeekNumbers,
          showOtherMonths,
          numberOfMonths,
          defaultDate: value || defaultValue || null,
        };

        // Add constraints
        if (minDate) options.minDate = minDate;
        if (maxDate) options.maxDate = maxDate;
        if (disabledDates) options.disabledDates = disabledDates;

        // Create instance
        pickerRef.current = new DatePickerCore(inputRef.current, options);
        isInitializedRef.current = true;

        // Register plugins
        plugins.forEach((plugin) => {
          const pluginName =
            typeof plugin === 'object' ? plugin.name : plugin.name;
          const options = pluginOptions[pluginName] || {};
          pickerRef.current.use(plugin, options);
        });

        // Setup event listeners
        const eventBus = pickerRef.current.getEventBus();

        if (onChange) {
          eventBus.on('date:select', (data) => {
            onChange(data.date, data);
          });
        }

        if (onOpen) {
          eventBus.on('picker:open', onOpen);
        }

        if (onClose) {
          eventBus.on('picker:close', onClose);
        }

        if (onMonthChange) {
          eventBus.on('month:change', onMonthChange);
        }

        if (onYearChange) {
          eventBus.on('year:change', onYearChange);
        }
      } catch (error) {
        console.error('BWDatePicker: Initialization error', error);
      }
    };

    initPicker();

    // Cleanup
    return () => {
      if (pickerRef.current) {
        pickerRef.current.destroy();
        pickerRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Only run once on mount

  // Sync value changes
  useEffect(() => {
    if (!pickerRef.current || !isInitializedRef.current) return;

    const currentDate = pickerRef.current.getDate();
    const currentTime = currentDate?.getTime();

    // Convert value to Date if needed
    let newDate = null;
    if (value instanceof Date) {
      newDate = value;
    } else if (typeof value === 'string' && value) {
      newDate = new Date(value);
    }

    const newTime = newDate?.getTime();

    // Only update if different
    if (currentTime !== newTime) {
      if (newDate && !isNaN(newDate.getTime())) {
        pickerRef.current.setDate(newDate);
      } else if (value === null || value === undefined) {
        pickerRef.current.clear();
      }
    }
  }, [value]);

  // Sync disabled state
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.disabled = disabled;
    }
  }, [disabled]);

  // Sync readOnly state
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = readOnly;
    }
  }, [readOnly]);

  // Handle focus
  const handleFocus = useCallback(
    (e) => {
      onFocus?.(e);
    },
    [onFocus]
  );

  // Handle blur
  const handleBlur = useCallback(
    (e) => {
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <div className={className} style={style}>
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={inputClassName}
        style={inputStyle}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...restProps}
      />
    </div>
  );
});

// Memoize to prevent unnecessary re-renders
export default memo(BWDatePicker);
export { BWDatePicker };
