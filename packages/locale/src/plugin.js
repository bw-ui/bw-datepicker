/**
 * @bw-ui/datepicker-locale
 * Locale Plugin - Internationalization support
 */

import { LocaleManager } from './LocaleManager.js';
import { PRESETS, getPreset } from './LocalePresets.js';

export const LocalePlugin = {
  name: 'locale',

  init(api, options = {}) {
    const eventBus = api.getEventBus();
    const pickerEl = api.getPickerElement();

    // Check if preset locale provided
    let config = { ...options };
    if (typeof options.locale === 'string' && PRESETS[options.locale]) {
      const preset = PRESETS[options.locale];
      config = { ...preset, ...options };
    }

    // Create locale manager
    const localeManager = new LocaleManager({
      locale: config.locale || 'en-US',
      useIntl: config.useIntl !== false,
      monthNames: config.monthNames || null,
      monthNamesShort: config.monthNamesShort || null,
      dayNames: config.dayNames || null,
      dayNamesShort: config.dayNamesShort || null,
      dayNamesNarrow: config.dayNamesNarrow || null,
    });

    // Set firstDayOfWeek if provided by preset
    if (config.firstDayOfWeek !== undefined) {
      // Try to update core options
      try {
        const coreOpts = api.getOptions();
        if (coreOpts) {
          coreOpts.firstDayOfWeek = config.firstDayOfWeek;
        }
      } catch (e) {
        // Ignore if can't access
      }
    }

    // Set RTL if needed
    if (config.rtl) {
      pickerEl.setAttribute('dir', 'rtl');
      pickerEl.classList.add('bw-datepicker--rtl');
    }

    // Inject locale data into core options immediately
    const coreOpts = api.getOptions();
    if (coreOpts) {
      coreOpts.dayNames = localeManager.getDayNames('short', 0);
      coreOpts.monthNames = localeManager.getMonthNames('long');
    }

    // Hook into render:header event to override month name
    eventBus.on('render:header', (data) => {
      if (data.month !== undefined) {
        data.monthName = localeManager.getMonthName(data.month, 'long');
      }
      return data;
    });

    // Hook into render:before to ensure locale data is always present
    eventBus.on('render:before', (data) => {
      if (data.data && data.data.options) {
        data.data.options.dayNames = localeManager.getDayNames('short', 0);
        data.data.options.monthNames = localeManager.getMonthNames('long');
      }
      return data;
    });

    // Return instance with methods
    const instance = {
      // Get locale manager
      getManager: () => localeManager,

      // Get current locale
      getLocale: () => localeManager.getLocale(),

      // Set locale
      setLocale: (locale) => {
        // Check if preset
        if (PRESETS[locale]) {
          const preset = PRESETS[locale];
          localeManager.setLocale(preset.locale);
          if (preset.rtl) {
            pickerEl.setAttribute('dir', 'rtl');
            pickerEl.classList.add('bw-datepicker--rtl');
          } else {
            pickerEl.removeAttribute('dir');
            pickerEl.classList.remove('bw-datepicker--rtl');
          }
        } else {
          localeManager.setLocale(locale);
        }

        // Re-render picker
        if (api.datepicker?.refresh) {
          api.datepicker.refresh();
        }
      },

      // Get month name
      getMonthName: (month, format) =>
        localeManager.getMonthName(month, format),

      // Get all month names
      getMonthNames: (format) => localeManager.getMonthNames(format),

      // Get day name
      getDayName: (day, format) => localeManager.getDayName(day, format),

      // Get all day names
      getDayNames: (format, firstDay) =>
        localeManager.getDayNames(format, firstDay),

      // Format date
      formatDate: (date, options) => localeManager.formatDate(date, options),

      // Get relative time
      getRelativeTime: (date) => localeManager.getRelativeTime(date),

      // Destroy
      destroy: () => localeManager.destroy(),

      // Expose options
      options: config,
    };

    // Emit locale applied event
    eventBus.emit('locale:applied', { locale: config.locale });
    // Force refresh to apply locale on first render
    setTimeout(() => {
      if (api.datepicker?.refresh) {
        api.datepicker.refresh();
      }
    }, 0);
    return instance;
  },

  destroy(instance) {
    if (instance?.destroy) instance.destroy();
  },
};

export { LocaleManager } from './LocaleManager.js';
export { PRESETS, getPreset, getAvailableLocales } from './LocalePresets.js';
export default LocalePlugin;
