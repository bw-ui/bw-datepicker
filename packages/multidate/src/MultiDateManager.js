/**
 * MultiDateManager
 * Handles multiple date selection, toggle, and validation
 *
 * @version 1.0.0
 * @license MIT
 */

export class MultiDateManager {
  #selectedDates = new Map(); // dateKey -> Date object
  #options;

  constructor(options = {}) {
    this.#options = {
      maxDates: null, // Maximum number of dates (null = unlimited)
      minDates: null, // Minimum required dates
      allowDuplicates: false, // Should always be false for dates
      sortDates: true, // Keep dates sorted
      ...options,
    };
  }

  /**
   * Toggle date selection (add if not selected, remove if selected)
   * @param {Date} date
   * @returns {Object} { dates, added, removed, count, error }
   */
  toggle(date) {
    const key = this.#dateToKey(date);

    if (this.#selectedDates.has(key)) {
      // Remove date
      this.#selectedDates.delete(key);
      return {
        dates: this.getDates(),
        added: null,
        removed: date,
        count: this.#selectedDates.size,
        error: null,
      };
    } else {
      // Add date - check max limit
      if (
        this.#options.maxDates &&
        this.#selectedDates.size >= this.#options.maxDates
      ) {
        return {
          dates: this.getDates(),
          added: null,
          removed: null,
          count: this.#selectedDates.size,
          error: `Maximum ${this.#options.maxDates} dates allowed`,
        };
      }

      this.#selectedDates.set(key, new Date(date));
      return {
        dates: this.getDates(),
        added: date,
        removed: null,
        count: this.#selectedDates.size,
        error: null,
      };
    }
  }

  /**
   * Add a date (doesn't remove if exists)
   * @param {Date} date
   * @returns {Object} { dates, added, count, error }
   */
  add(date) {
    const key = this.#dateToKey(date);

    if (this.#selectedDates.has(key)) {
      return {
        dates: this.getDates(),
        added: null,
        count: this.#selectedDates.size,
        error: null,
      };
    }

    if (
      this.#options.maxDates &&
      this.#selectedDates.size >= this.#options.maxDates
    ) {
      return {
        dates: this.getDates(),
        added: null,
        count: this.#selectedDates.size,
        error: `Maximum ${this.#options.maxDates} dates allowed`,
      };
    }

    this.#selectedDates.set(key, new Date(date));
    return {
      dates: this.getDates(),
      added: date,
      count: this.#selectedDates.size,
      error: null,
    };
  }

  /**
   * Remove a date
   * @param {Date} date
   * @returns {Object} { dates, removed, count }
   */
  remove(date) {
    const key = this.#dateToKey(date);
    const existed = this.#selectedDates.has(key);
    this.#selectedDates.delete(key);

    return {
      dates: this.getDates(),
      removed: existed ? date : null,
      count: this.#selectedDates.size,
    };
  }

  /**
   * Set dates directly (replaces all)
   * @param {Date[]} dates
   * @returns {Object} { dates, count, error }
   */
  setDates(dates) {
    if (this.#options.maxDates && dates.length > this.#options.maxDates) {
      return {
        dates: this.getDates(),
        count: this.#selectedDates.size,
        error: `Maximum ${this.#options.maxDates} dates allowed`,
      };
    }

    this.#selectedDates.clear();
    dates.forEach((date) => {
      const key = this.#dateToKey(date);
      this.#selectedDates.set(key, new Date(date));
    });

    return {
      dates: this.getDates(),
      count: this.#selectedDates.size,
      error: null,
    };
  }

  /**
   * Get all selected dates
   * @returns {Date[]}
   */
  getDates() {
    const dates = Array.from(this.#selectedDates.values());

    if (this.#options.sortDates) {
      dates.sort((a, b) => a.getTime() - b.getTime());
    }

    return dates;
  }

  /**
   * Get count of selected dates
   * @returns {number}
   */
  getCount() {
    return this.#selectedDates.size;
  }

  /**
   * Check if date is selected
   * @param {Date} date
   * @returns {boolean}
   */
  isSelected(date) {
    const key = this.#dateToKey(date);
    return this.#selectedDates.has(key);
  }

  /**
   * Check if selection meets minimum requirement
   * @returns {Object} { valid, error }
   */
  validate() {
    if (
      this.#options.minDates &&
      this.#selectedDates.size < this.#options.minDates
    ) {
      return {
        valid: false,
        error: `Minimum ${this.#options.minDates} dates required`,
      };
    }
    return { valid: true, error: null };
  }

  /**
   * Get first selected date
   * @returns {Date|null}
   */
  getFirst() {
    const dates = this.getDates();
    return dates.length > 0 ? dates[0] : null;
  }

  /**
   * Get last selected date
   * @returns {Date|null}
   */
  getLast() {
    const dates = this.getDates();
    return dates.length > 0 ? dates[dates.length - 1] : null;
  }

  /**
   * Clear all selections
   */
  clear() {
    this.#selectedDates.clear();
  }

  /**
   * Reset (alias for clear)
   */
  reset() {
    this.clear();
  }

  /**
   * Convert date to unique key (YYYY-MM-DD)
   * @param {Date} date
   * @returns {string}
   */
  #dateToKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Update options
   * @param {Object} options
   */
  setOptions(options) {
    Object.assign(this.#options, options);
  }

  /**
   * Get current options
   * @returns {Object}
   */
  getOptions() {
    return { ...this.#options };
  }

  /**
   * Destroy
   */
  destroy() {
    this.#selectedDates.clear();
  }
}

export default MultiDateManager;
