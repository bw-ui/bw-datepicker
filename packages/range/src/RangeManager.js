/**
 * RangeManager
 * Handles start/end date selection and validation
 */

export class RangeManager {
  #startDate = null;
  #endDate = null;
  #options;
  #selecting = 'start'; // 'start' | 'end'

  constructor(options = {}) {
    this.#options = {
      minRange: 1,
      maxRange: null,
      autoClose: true,
      ...options,
    };
  }

  /**
   * Handle date selection
   * @param {Date} date
   * @returns {Object} { startDate, endDate, selecting, complete }
   */
  select(date) {
    if (this.#selecting === 'start') {
      this.#startDate = date;
      this.#endDate = null;
      this.#selecting = 'end';
      return {
        startDate: this.#startDate,
        endDate: null,
        selecting: 'end',
        complete: false,
      };
    } else {
      // Selecting end date
      if (date < this.#startDate) {
        // Clicked before start - swap
        this.#endDate = this.#startDate;
        this.#startDate = date;
      } else {
        this.#endDate = date;
      }

      // Validate range
      const validation = this.#validateRange();
      if (!validation.valid) {
        // Reset end date on invalid range
        this.#endDate = null;
        return {
          startDate: this.#startDate,
          endDate: null,
          selecting: 'end',
          complete: false,
          error: validation.error,
        };
      }

      this.#selecting = 'start';
      return {
        startDate: this.#startDate,
        endDate: this.#endDate,
        selecting: 'start',
        complete: true,
      };
    }
  }

  /**
   * Set range directly
   * @param {Date} start
   * @param {Date} end
   */
  setRange(start, end) {
    this.#startDate = start;
    this.#endDate = end;
    this.#selecting = 'start';
  }

  /**
   * Get current range
   */
  getRange() {
    return {
      startDate: this.#startDate,
      endDate: this.#endDate,
    };
  }

  /**
   * Get days in range
   */
  getRangeDays() {
    if (!this.#startDate || !this.#endDate) return 0;
    const diff = this.#endDate.getTime() - this.#startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Get nights in range (for hotel booking)
   */
  getRangeNights() {
    return Math.max(0, this.getRangeDays() - 1);
  }

  /**
   * Check if date is in range
   * @param {Date} date
   */
  isInRange(date) {
    if (!this.#startDate || !this.#endDate) return false;
    const time = date.getTime();
    return time >= this.#startDate.getTime() && time <= this.#endDate.getTime();
  }

  /**
   * Check if date is start
   * @param {Date} date
   */
  isStart(date) {
    if (!this.#startDate) return false;
    return this.#isSameDay(date, this.#startDate);
  }

  /**
   * Check if date is end
   * @param {Date} date
   */
  isEnd(date) {
    if (!this.#endDate) return false;
    return this.#isSameDay(date, this.#endDate);
  }

  /**
   * Get current selecting state
   */
  getSelecting() {
    return this.#selecting;
  }

  /**
   * Reset selection
   */
  reset() {
    this.#startDate = null;
    this.#endDate = null;
    this.#selecting = 'start';
  }

  /**
   * Validate range constraints
   */
  #validateRange() {
    const days = this.getRangeDays();

    if (this.#options.minRange && days < this.#options.minRange) {
      return {
        valid: false,
        error: `Minimum ${this.#options.minRange} days required`,
      };
    }

    if (this.#options.maxRange && days > this.#options.maxRange) {
      return {
        valid: false,
        error: `Maximum ${this.#options.maxRange} days allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Check if same day
   */
  #isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Update options
   */
  setOptions(options) {
    Object.assign(this.#options, options);
  }

  /**
   * Destroy
   */
  destroy() {
    this.reset();
  }
}

export default RangeManager;
