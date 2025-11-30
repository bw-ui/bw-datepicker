/**
 * @bw-ui/datepicker-react
 * useBWDatePicker Hook
 *
 * Hook for programmatic control of BW DatePicker
 *
 * Updated for slot-based architecture (v1.1.0):
 * - Fixed event names to match core v0.3.0
 *
 * @version 1.1.0
 * @license MIT
 */

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * useBWDatePicker - Hook for creating and controlling a datepicker instance
 *
 * @example
 * ```jsx
 * import { useBWDatePicker } from '@bw-ui/datepicker-react';
 * import { ThemingPlugin } from '@bw-ui/datepicker-theming';
 *
 * function App() {
 *   const { ref, date, open, close, setDate } = useBWDatePicker({
 *     onChange: (date) => console.log('Selected:', date),
 *     plugins: [ThemingPlugin],
 *     pluginOptions: { theming: { theme: 'dark' } }
 *   });
 *
 *   return (
 *     <div>
 *       <input ref={ref} placeholder="Select date" />
 *       <button onClick={open}>Open</button>
 *       <button onClick={() => setDate(new Date())}>Today</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Hook return value with ref and control methods
 */
export function useBWDatePicker(options = {}) {
  const {
    // Core options
    mode = 'popup',
    format = 'YYYY-MM-DD',
    defaultDate,
    minDate,
    maxDate,
    disabledDates,
    firstDayOfWeek = 0,
    showWeekNumbers = false,
    showOtherMonths = true,
    numberOfMonths = 1,

    // Plugins
    plugins = [],
    pluginOptions = {},

    // Callbacks
    onChange,
    onOpen,
    onClose,
    onMonthChange,
    onYearChange,
  } = options;

  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Track selected date in state for reactivity
  const [date, setDateState] = useState(defaultDate || null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize picker
  useEffect(() => {
    const initPicker = async () => {
      if (!inputRef.current || isInitializedRef.current) return;

      try {
        const module = await import('@bw-ui/datepicker');
        const DatePickerCore =
          module.BWDatePicker || module.DatePickerCore || module.default;

        if (!DatePickerCore) {
          console.error('useBWDatePicker: Could not load @bw-ui/datepicker');
          return;
        }

        // Build options
        const pickerOptions = {
          mode,
          format,
          firstDayOfWeek,
          showWeekNumbers,
          showOtherMonths,
          numberOfMonths,
          defaultDate: defaultDate || null,
        };

        if (minDate) pickerOptions.minDate = minDate;
        if (maxDate) pickerOptions.maxDate = maxDate;
        if (disabledDates) pickerOptions.disabledDates = disabledDates;

        // Create instance
        pickerRef.current = new DatePickerCore(inputRef.current, pickerOptions);
        isInitializedRef.current = true;

        // Register plugins
        plugins.forEach((plugin) => {
          const pluginName =
            typeof plugin === 'object' ? plugin.name : plugin.name;
          const opts = pluginOptions[pluginName] || {};
          pickerRef.current.use(plugin, opts);
        });

        // Setup event listeners (using correct core v0.3.0 event names)
        const eventBus = pickerRef.current.getEventBus();

        eventBus.on('date:selected', (data) => {
          setDateState(data.date);
          onChange?.(data.date, data);
        });

        eventBus.on('picker:opened', (data) => {
          setIsOpen(true);
          onOpen?.(data);
        });

        eventBus.on('picker:closed', (data) => {
          setIsOpen(false);
          onClose?.(data);
        });

        if (onMonthChange) {
          eventBus.on('nav:monthChanged', onMonthChange);
        }

        if (onYearChange) {
          eventBus.on('nav:yearChanged', onYearChange);
        }
      } catch (error) {
        console.error('useBWDatePicker: Initialization error', error);
      }
    };

    initPicker();

    return () => {
      if (pickerRef.current) {
        pickerRef.current.destroy();
        pickerRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // Control methods
  const open = useCallback(() => {
    pickerRef.current?.open();
  }, []);

  const close = useCallback(() => {
    pickerRef.current?.close();
  }, []);

  const toggle = useCallback(() => {
    const picker = pickerRef.current;
    if (picker) {
      const state = picker.getStateManager()?.getState();
      state?.isOpen ? picker.close() : picker.open();
    }
  }, []);

  const setDate = useCallback((newDate) => {
    pickerRef.current?.setDate(newDate);
    setDateState(newDate);
  }, []);

  const clear = useCallback(() => {
    pickerRef.current?.clear();
    setDateState(null);
  }, []);

  const prevMonth = useCallback(() => {
    pickerRef.current?.prevMonth();
  }, []);

  const nextMonth = useCallback(() => {
    pickerRef.current?.nextMonth();
  }, []);

  const prevYear = useCallback(() => {
    pickerRef.current?.prevYear();
  }, []);

  const nextYear = useCallback(() => {
    pickerRef.current?.nextYear();
  }, []);

  const today = useCallback(() => {
    pickerRef.current?.today();
  }, []);

  const getPlugin = useCallback((name) => {
    return pickerRef.current?.getPlugin(name) || null;
  }, []);

  const hasPlugin = useCallback((name) => {
    return pickerRef.current?.hasPlugin(name) || false;
  }, []);

  const getInstance = useCallback(() => {
    return pickerRef.current;
  }, []);

  const getPickerElement = useCallback(() => {
    return pickerRef.current?.getPickerElement() || null;
  }, []);

  return {
    // Ref to attach to input
    ref: inputRef,

    // State
    date,
    isOpen,

    // Core methods
    open,
    close,
    toggle,
    setDate,
    clear,

    // Navigation
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    today,

    // Plugin access
    getPlugin,
    hasPlugin,

    // Instance access
    getInstance,
    getPickerElement,
  };
}

export default useBWDatePicker;
