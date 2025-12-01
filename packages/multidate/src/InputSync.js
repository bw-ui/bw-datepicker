/**
 * InputSync (Multi-Date)
 * Syncs selected dates with input element(s)
 *
 * @version 1.0.0
 * @license MIT
 */

export class InputSync {
  #mainInput = null;
  #options;

  constructor(options = {}) {
    this.#options = {
      format: 'YYYY-MM-DD',
      separator: ', ',
      maxDisplayDates: 3, // Show "3 dates selected" after this
      placeholder: 'Select dates...',
      ...options,
    };
  }

  /**
   * Set main input element
   * @param {HTMLElement|string} input
   */
  setMainInput(input) {
    this.#mainInput =
      typeof input === 'string' ? document.querySelector(input) : input;
  }

  /**
   * Update input with selected dates
   * @param {Date[]} dates
   */
  update(dates) {
    if (!this.#mainInput) return;

    if (dates.length === 0) {
      this.#mainInput.value = '';
      return;
    }

    if (dates.length <= this.#options.maxDisplayDates) {
      // Show all dates
      const formatted = dates.map((d) => this.#formatDate(d));
      this.#mainInput.value = formatted.join(this.#options.separator);
    } else {
      // Show count
      this.#mainInput.value = `${dates.length} dates selected`;
    }
  }

  /**
   * Clear input
   */
  clear() {
    if (this.#mainInput) {
      this.#mainInput.value = '';
    }
  }

  /**
   * Format date according to format option
   * @param {Date} date
   * @returns {string}
   */
  #formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return this.#options.format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('M', date.getMonth() + 1)
      .replace('D', date.getDate());
  }

  /**
   * Parse dates from input value
   * @returns {Date[]}
   */
  parseDates() {
    if (!this.#mainInput || !this.#mainInput.value) return [];

    const value = this.#mainInput.value.trim();

    // Check if it's "X dates selected" format
    if (value.match(/^\d+ dates selected$/)) {
      return []; // Can't parse this, return empty
    }

    const dateStrings = value.split(this.#options.separator);
    const dates = [];

    dateStrings.forEach((str) => {
      const date = this.#parseDate(str.trim());
      if (date) dates.push(date);
    });

    return dates;
  }

  /**
   * Parse a single date string
   * @param {string} str
   * @returns {Date|null}
   */
  #parseDate(str) {
    // Try YYYY-MM-DD format
    const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    // Try other common formats
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Update options
   * @param {Object} options
   */
  setOptions(options) {
    Object.assign(this.#options, options);
  }

  /**
   * Destroy
   */
  destroy() {
    this.#mainInput = null;
  }
}

export default InputSync;
