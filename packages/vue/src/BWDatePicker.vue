/** * @bw-ui/datepicker-vue * Vue wrapper for BW DatePicker * * Updated for
slot-based architecture (v1.1.0): * - Fixed event names to match core v0.3.0 * -
Works with all plugins (DualCalendar, Range, Data, etc.) * * @version 1.1.0 *
@license MIT */

<template>
  <div
    :class="containerClass"
    :style="{ position: 'relative', ...containerStyle }"
  >
    <input
      ref="inputRef"
      type="text"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :autocomplete="autoComplete"
      :class="inputClassName"
      :style="inputStyle"
      :aria-label="ariaLabel"
      :aria-describedby="ariaDescribedBy"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, defineComponent } from 'vue';

export default defineComponent({
  name: 'BWDatePicker',

  props: {
    // Value & v-model
    modelValue: {
      type: [Date, String, null],
      default: null,
    },
    defaultValue: {
      type: [Date, String],
      default: null,
    },

    // Core options
    mode: {
      type: String,
      default: 'popup',
      validator: (v) => ['popup', 'modal', 'inline'].includes(v),
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    placeholder: {
      type: String,
      default: 'Select date',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },

    // Date constraints
    minDate: {
      type: Date,
      default: null,
    },
    maxDate: {
      type: Date,
      default: null,
    },
    disabledDates: {
      type: Array,
      default: () => [],
    },

    // Display options
    firstDayOfWeek: {
      type: Number,
      default: 0,
    },
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    showOtherMonths: {
      type: Boolean,
      default: true,
    },
    numberOfMonths: {
      type: Number,
      default: 1,
    },

    // Plugins
    plugins: {
      type: Array,
      default: () => [],
    },
    pluginOptions: {
      type: Object,
      default: () => ({}),
    },

    // Input props
    containerClass: {
      type: String,
      default: '',
    },
    containerStyle: {
      type: Object,
      default: () => ({}),
    },
    inputClassName: {
      type: String,
      default: '',
    },
    inputStyle: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    autoComplete: {
      type: String,
      default: 'off',
    },
    ariaLabel: {
      type: String,
      default: null,
    },
    ariaDescribedBy: {
      type: String,
      default: null,
    },
  },

  emits: [
    'update:modelValue',
    'change',
    'open',
    'close',
    'month-change',
    'year-change',
    'focus',
    'blur',
  ],

  setup(props, { emit, expose }) {
    const inputRef = ref(null);
    let picker = null;
    let isInitialized = false;

    // Initialize picker
    const initPicker = async () => {
      if (!inputRef.value || isInitialized) return;

      try {
        const module = await import('@bw-ui/datepicker');
        const DatePickerCore =
          module.BWDatePicker || module.DatePickerCore || module.default;

        if (!DatePickerCore) {
          console.error('BWDatePicker: Could not load @bw-ui/datepicker');
          return;
        }

        // Build options
        const options = {
          mode: props.mode,
          format: props.format,
          firstDayOfWeek: props.firstDayOfWeek,
          showWeekNumbers: props.showWeekNumbers,
          showOtherMonths: props.showOtherMonths,
          numberOfMonths: props.numberOfMonths,
          defaultDate: props.modelValue || props.defaultValue || null,
        };

        if (props.minDate) options.minDate = props.minDate;
        if (props.maxDate) options.maxDate = props.maxDate;
        if (props.disabledDates?.length)
          options.disabledDates = props.disabledDates;

        // Create instance
        picker = new DatePickerCore(inputRef.value, options);
        isInitialized = true;

        // Register plugins
        props.plugins.forEach((plugin) => {
          const pluginName =
            typeof plugin === 'object' ? plugin.name : plugin.name;
          const opts = props.pluginOptions[pluginName] || {};
          picker.use(plugin, opts);
        });

        // Setup event listeners (using correct core v0.3.0 event names)
        const eventBus = picker.getEventBus();

        eventBus.on('date:selected', (data) => {
          emit('update:modelValue', data.date);
          emit('change', data.date, data);
        });

        eventBus.on('picker:opened', (data) => {
          emit('open', data);
        });

        eventBus.on('picker:closed', (data) => {
          emit('close', data);
        });

        eventBus.on('nav:monthChanged', (data) => {
          emit('month-change', data);
        });

        eventBus.on('nav:yearChanged', (data) => {
          emit('year-change', data);
        });
      } catch (error) {
        console.error('BWDatePicker: Initialization error', error);
      }
    };

    // Watch for value changes
    watch(
      () => props.modelValue,
      (newValue) => {
        if (!picker || !isInitialized) return;

        const currentDate = picker.getDate();
        const currentTime = currentDate?.getTime();

        let newDate = null;
        if (newValue instanceof Date) {
          newDate = newValue;
        } else if (typeof newValue === 'string' && newValue) {
          newDate = new Date(newValue);
        }

        const newTime = newDate?.getTime();

        if (currentTime !== newTime) {
          if (newDate && !isNaN(newDate.getTime())) {
            picker.setDate(newDate);
          } else if (newValue === null || newValue === undefined) {
            picker.clear();
          }
        }
      }
    );

    // Event handlers
    const handleFocus = (e) => {
      emit('focus', e);
    };

    const handleBlur = (e) => {
      emit('blur', e);
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

    // Expose methods
    expose({
      open: () => picker?.open(),
      close: () => picker?.close(),
      toggle: () => {
        if (picker) {
          const state = picker.getStateManager()?.getState();
          state?.isOpen ? picker.close() : picker.open();
        }
      },
      clear: () => picker?.clear(),
      setDate: (date) => picker?.setDate(date),
      getDate: () => picker?.getDate(),
      prevMonth: () => picker?.prevMonth(),
      nextMonth: () => picker?.nextMonth(),
      prevYear: () => picker?.prevYear(),
      nextYear: () => picker?.nextYear(),
      today: () => picker?.today(),
      getPlugin: (name) => picker?.getPlugin(name),
      hasPlugin: (name) => picker?.hasPlugin(name),
      getInputElement: () => inputRef.value,
      getPickerElement: () => picker?.getPickerElement(),
      getInstance: () => picker,
    });

    return {
      inputRef,
      handleFocus,
      handleBlur,
    };
  },
});
</script>
