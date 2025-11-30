/**
 * @bw-ui/datepicker-vue
 * useBWDatePicker Composable
 *
 * Composable for programmatic control of BW DatePicker
 *
 * Updated for slot-based architecture (v1.1.0):
 * - Fixed event names to match core v0.3.0
 *
 * @version 1.1.0
 * @license MIT
 */

import { ref, onMounted, onUnmounted } from 'vue';

/**
 * useBWDatePicker - Composable for creating and controlling a datepicker instance
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBWDatePicker } from '@bw-ui/datepicker-vue';
 * import { ThemingPlugin } from '@bw-ui/datepicker-theming';
 *
 * const { inputRef, date, open, close, setDate } = useBWDatePicker({
 *   onChange: (date) => console.log('Selected:', date),
 *   plugins: [ThemingPlugin],
 *   pluginOptions: { theming: { theme: 'dark' } }
 * });
 * </script>
 *
 * <template>
 *   <input ref="inputRef" placeholder="Select date" />
 *   <button @click="open">Open</button>
 *   <button @click="setDate(new Date())">Today</button>
 * </template>
 * ```
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Composable return value with ref and control methods
 */
export function useBWDatePicker(options = {}) {
  const {
    // Core options
    mode = 'popup',
    format = 'YYYY-MM-DD',
    defaultDate = null,
    minDate = null,
    maxDate = null,
    disabledDates = [],
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

  const inputRef = ref(null);
  let picker = null;
  let isInitialized = false;

  // Reactive state
  const date = ref(defaultDate);
  const isOpen = ref(false);

  // Initialize picker
  const initPicker = async () => {
    if (!inputRef.value || isInitialized) return;

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
      if (disabledDates?.length) pickerOptions.disabledDates = disabledDates;

      // Create instance
      picker = new DatePickerCore(inputRef.value, pickerOptions);
      isInitialized = true;

      // Register plugins
      plugins.forEach((plugin) => {
        const pluginName =
          typeof plugin === 'object' ? plugin.name : plugin.name;
        const opts = pluginOptions[pluginName] || {};
        picker.use(plugin, opts);
      });

      // Setup event listeners (using correct core v0.3.0 event names)
      const eventBus = picker.getEventBus();

      eventBus.on('date:selected', (data) => {
        date.value = data.date;
        onChange?.(data.date, data);
      });

      eventBus.on('picker:opened', (data) => {
        isOpen.value = true;
        onOpen?.(data);
      });

      eventBus.on('picker:closed', (data) => {
        isOpen.value = false;
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

  // Lifecycle
  onMounted(() => {
    initPicker();
  });

  onUnmounted(() => {
    if (picker) {
      picker.destroy();
      picker = null;
      isInitialized = false;
    }
  });

  // Control methods
  const open = () => {
    picker?.open();
  };

  const close = () => {
    picker?.close();
  };

  const toggle = () => {
    if (picker) {
      const state = picker.getStateManager()?.getState();
      state?.isOpen ? picker.close() : picker.open();
    }
  };

  const setDate = (newDate) => {
    picker?.setDate(newDate);
    date.value = newDate;
  };

  const clear = () => {
    picker?.clear();
    date.value = null;
  };

  const prevMonth = () => {
    picker?.prevMonth();
  };

  const nextMonth = () => {
    picker?.nextMonth();
  };

  const prevYear = () => {
    picker?.prevYear();
  };

  const nextYear = () => {
    picker?.nextYear();
  };

  const today = () => {
    picker?.today();
  };

  const getPlugin = (name) => {
    return picker?.getPlugin(name) || null;
  };

  const hasPlugin = (name) => {
    return picker?.hasPlugin(name) || false;
  };

  const getInstance = () => {
    return picker;
  };

  const getPickerElement = () => {
    return picker?.getPickerElement() || null;
  };

  return {
    // Ref to attach to input
    inputRef,

    // State (reactive)
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
