/**
 * ============================================================================
 * Black & White: UI Engineering
 * LocaleManager - Internationalization Handler
 * ============================================================================
 *
 * Manages locale-based month/day names using Intl API
 * Supports custom names override
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * Default English month names (fallback)
 */
const DEFAULT_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Default English month names short (fallback)
 */
const DEFAULT_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Default English day names (fallback)
 */
const DEFAULT_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Default English day names short (fallback)
 */
const DEFAULT_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Default English day names narrow (fallback)
 */
const DEFAULT_DAYS_NARROW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export class LocaleManager {
  #locale;
  #customMonthNames;
  #customMonthNamesShort;
  #customDayNames;
  #customDayNamesShort;
  #customDayNamesNarrow;
  #useIntl;
  #cache = {};

  /**
   * @param {Object} options
   * @param {string} [options.locale='en-US'] - BCP 47 locale string
   * @param {boolean} [options.useIntl=true] - Use Intl API
   * @param {Array<string>} [options.monthNames] - Custom month names (12 items)
   * @param {Array<string>} [options.monthNamesShort] - Custom short month names
   * @param {Array<string>} [options.dayNames] - Custom day names (7 items, starting Sunday)
   * @param {Array<string>} [options.dayNamesShort] - Custom short day names
   * @param {Array<string>} [options.dayNamesNarrow] - Custom narrow day names (single letter)
   */
  constructor(options = {}) {
    this.#locale = options.locale || 'en-US';
    this.#useIntl = options.useIntl !== false;
    this.#customMonthNames = options.monthNames || null;
    this.#customMonthNamesShort = options.monthNamesShort || null;
    this.#customDayNames = options.dayNames || null;
    this.#customDayNamesShort = options.dayNamesShort || null;
    this.#customDayNamesNarrow = options.dayNamesNarrow || null;
  }

  /**
   * Get current locale
   * @returns {string}
   */
  getLocale() {
    return this.#locale;
  }

  /**
   * Set locale
   * @param {string} locale - BCP 47 locale string
   */
  setLocale(locale) {
    this.#locale = locale;
    this.#cache = {}; // Clear cache
  }

  /**
   * Get month name
   * @param {number} month - Month index (0-11)
   * @param {string} [format='long'] - 'long', 'short', 'narrow'
   * @returns {string}
   */
  getMonthName(month, format = 'long') {
    // Priority 1: Custom names
    if (format === 'long' && this.#customMonthNames?.[month]) {
      return this.#customMonthNames[month];
    }
    if (format === 'short' && this.#customMonthNamesShort?.[month]) {
      return this.#customMonthNamesShort[month];
    }

    // Priority 2: Intl API
    if (this.#useIntl && this.#isIntlSupported()) {
      const cacheKey = `month_${month}_${format}`;
      if (!this.#cache[cacheKey]) {
        try {
          const formatter = new Intl.DateTimeFormat(this.#locale, { month: format });
          this.#cache[cacheKey] = formatter.format(new Date(2000, month, 1));
        } catch (e) {
          // Fallback on error
          this.#cache[cacheKey] = format === 'short' ? DEFAULT_MONTHS_SHORT[month] : DEFAULT_MONTHS[month];
        }
      }
      return this.#cache[cacheKey];
    }

    // Priority 3: Fallback
    return format === 'short' ? DEFAULT_MONTHS_SHORT[month] : DEFAULT_MONTHS[month];
  }

  /**
   * Get all month names
   * @param {string} [format='long'] - 'long', 'short', 'narrow'
   * @returns {Array<string>}
   */
  getMonthNames(format = 'long') {
    // Priority 1: Custom names
    if (format === 'long' && this.#customMonthNames?.length === 12) {
      return [...this.#customMonthNames];
    }
    if (format === 'short' && this.#customMonthNamesShort?.length === 12) {
      return [...this.#customMonthNamesShort];
    }

    // Priority 2: Intl API
    if (this.#useIntl && this.#isIntlSupported()) {
      const cacheKey = `months_${format}`;
      if (!this.#cache[cacheKey]) {
        try {
          const formatter = new Intl.DateTimeFormat(this.#locale, { month: format });
          this.#cache[cacheKey] = Array.from({ length: 12 }, (_, i) => 
            formatter.format(new Date(2000, i, 1))
          );
        } catch (e) {
          this.#cache[cacheKey] = format === 'short' ? [...DEFAULT_MONTHS_SHORT] : [...DEFAULT_MONTHS];
        }
      }
      return [...this.#cache[cacheKey]];
    }

    // Priority 3: Fallback
    return format === 'short' ? [...DEFAULT_MONTHS_SHORT] : [...DEFAULT_MONTHS];
  }

  /**
   * Get day name
   * @param {number} day - Day index (0-6, 0=Sunday)
   * @param {string} [format='short'] - 'long', 'short', 'narrow'
   * @returns {string}
   */
  getDayName(day, format = 'short') {
    // Priority 1: Custom names
    if (format === 'long' && this.#customDayNames?.[day]) {
      return this.#customDayNames[day];
    }
    if (format === 'short' && this.#customDayNamesShort?.[day]) {
      return this.#customDayNamesShort[day];
    }
    if (format === 'narrow' && this.#customDayNamesNarrow?.[day]) {
      return this.#customDayNamesNarrow[day];
    }

    // Priority 2: Intl API
    if (this.#useIntl && this.#isIntlSupported()) {
      const cacheKey = `day_${day}_${format}`;
      if (!this.#cache[cacheKey]) {
        try {
          const formatter = new Intl.DateTimeFormat(this.#locale, { weekday: format });
          // Jan 1, 2023 is Sunday
          this.#cache[cacheKey] = formatter.format(new Date(2023, 0, 1 + day));
        } catch (e) {
          this.#cache[cacheKey] = this.#getDayFallback(day, format);
        }
      }
      return this.#cache[cacheKey];
    }

    // Priority 3: Fallback
    return this.#getDayFallback(day, format);
  }

  /**
   * Get all day names
   * @param {string} [format='short'] - 'long', 'short', 'narrow'
   * @param {number} [firstDayOfWeek=0] - First day (0=Sunday, 1=Monday)
   * @returns {Array<string>}
   */
  getDayNames(format = 'short', firstDayOfWeek = 0) {
    // Priority 1: Custom names
    if (format === 'long' && this.#customDayNames?.length === 7) {
      return this.#rotateArray([...this.#customDayNames], firstDayOfWeek);
    }
    if (format === 'short' && this.#customDayNamesShort?.length === 7) {
      return this.#rotateArray([...this.#customDayNamesShort], firstDayOfWeek);
    }
    if (format === 'narrow' && this.#customDayNamesNarrow?.length === 7) {
      return this.#rotateArray([...this.#customDayNamesNarrow], firstDayOfWeek);
    }

    // Priority 2: Intl API
    if (this.#useIntl && this.#isIntlSupported()) {
      const cacheKey = `days_${format}_${firstDayOfWeek}`;
      if (!this.#cache[cacheKey]) {
        try {
          const formatter = new Intl.DateTimeFormat(this.#locale, { weekday: format });
          const days = Array.from({ length: 7 }, (_, i) =>
            formatter.format(new Date(2023, 0, 1 + i))
          );
          this.#cache[cacheKey] = this.#rotateArray(days, firstDayOfWeek);
        } catch (e) {
          this.#cache[cacheKey] = this.#rotateArray(this.#getDaysFallback(format), firstDayOfWeek);
        }
      }
      return [...this.#cache[cacheKey]];
    }

    // Priority 3: Fallback
    return this.#rotateArray(this.#getDaysFallback(format), firstDayOfWeek);
  }

  /**
   * Format date using locale
   * @param {Date} date
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string}
   */
  formatDate(date, options = {}) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    if (this.#useIntl && this.#isIntlSupported()) {
      try {
        return new Intl.DateTimeFormat(this.#locale, options).format(date);
      } catch (e) {
        // Fallback
      }
    }

    // Simple fallback
    return date.toLocaleDateString();
  }

  /**
   * Get relative time string
   * @param {Date} date
   * @returns {string}
   */
  getRelativeTime(date) {
    if (!date || !(date instanceof Date)) return '';

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (this.#useIntl && this.#isRelativeTimeSupported()) {
      try {
        const rtf = new Intl.RelativeTimeFormat(this.#locale, { numeric: 'auto' });
        
        if (Math.abs(diffDays) < 1) return rtf.format(0, 'day');
        if (Math.abs(diffDays) < 7) return rtf.format(diffDays, 'day');
        if (Math.abs(diffDays) < 30) return rtf.format(Math.round(diffDays / 7), 'week');
        if (Math.abs(diffDays) < 365) return rtf.format(Math.round(diffDays / 30), 'month');
        return rtf.format(Math.round(diffDays / 365), 'year');
      } catch (e) {
        // Fallback
      }
    }

    // Simple fallback
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    return this.formatDate(date, { dateStyle: 'medium' });
  }

  /**
   * Check if Intl.DateTimeFormat is supported
   * @private
   * @returns {boolean}
   */
  #isIntlSupported() {
    return typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function';
  }

  /**
   * Check if Intl.RelativeTimeFormat is supported
   * @private
   * @returns {boolean}
   */
  #isRelativeTimeSupported() {
    return typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function';
  }

  /**
   * Rotate array by offset
   * @private
   * @param {Array} arr
   * @param {number} offset
   * @returns {Array}
   */
  #rotateArray(arr, offset) {
    if (offset === 0) return arr;
    return [...arr.slice(offset), ...arr.slice(0, offset)];
  }

  /**
   * Get day fallback
   * @private
   * @param {number} day
   * @param {string} format
   * @returns {string}
   */
  #getDayFallback(day, format) {
    if (format === 'long') return DEFAULT_DAYS[day];
    if (format === 'narrow') return DEFAULT_DAYS_NARROW[day];
    return DEFAULT_DAYS_SHORT[day];
  }

  /**
   * Get days fallback array
   * @private
   * @param {string} format
   * @returns {Array<string>}
   */
  #getDaysFallback(format) {
    if (format === 'long') return [...DEFAULT_DAYS];
    if (format === 'narrow') return [...DEFAULT_DAYS_NARROW];
    return [...DEFAULT_DAYS_SHORT];
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.#cache = {};
  }
}

export default LocaleManager;
