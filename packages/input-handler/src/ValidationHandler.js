/**
 * ============================================================================
 * Black & White UI — Validation Handler
 * Validates and auto-corrects date input
 * ============================================================================
 */

const ERRORS = {
  INVALID_DATE: 'Invalid date',
  INCOMPLETE_DATE: 'Incomplete date',
  DATE_DISABLED: 'This date is not available',
};

const RANGE_ERRORS = {
  MIN_DATE: (date) => `Date must be after ${date}`,
  MAX_DATE: (date) => `Date must be before ${date}`,
};

/**
 * Check if date is valid
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Check if date is within range
 */
function isWithinRange(date, minDate, maxDate) {
  if (!isValidDate(date)) return false;
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
}

export class ValidationHandler {
  #minDate;
  #maxDate;
  #disabledDates;

  constructor(options = {}) {
    this.#minDate = options.minDate || null;
    this.#maxDate = options.maxDate || null;
    this.#disabledDates = options.disabledDates || [];
  }

  /**
   * Validate date parts and auto-correct
   */
  validate(parts) {
    if (!parts) return null;

    let { day, month, year } = parts;

    // Convert to numbers
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    // Validate ranges
    if (month < 1) month = 1;
    if (month > 12) month = 12;
    if (day < 1) day = 1;

    // Get days in month
    const daysInMonth = this.#getDaysInMonth(month, year);
    if (day > daysInMonth) day = daysInMonth;

    // Create date
    const date = new Date(year, month - 1, day);

    if (!isValidDate(date)) return null;

    // Check min/max using isWithinRange
    if (!isWithinRange(date, this.#minDate, this.#maxDate)) {
      return null;
    }

    // Check disabled dates
    if (this.#isDateDisabled(date)) return null;

    return date;
  }

  /**
   * Get days in month
   */
  #getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Check if date is disabled
   */
  #isDateDisabled(date) {
    if (!this.#disabledDates || this.#disabledDates.length === 0) {
      return false;
    }

    return this.#disabledDates.some((disabledDate) => {
      if (disabledDate instanceof Date) {
        return this.#isSameDay(date, disabledDate);
      }
      if (typeof disabledDate === 'function') {
        return disabledDate(date);
      }
      return false;
    });
  }

  /**
   * Check if two dates are same day
   */
  #isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Auto-correct common mistakes
   */
  autoCorrect(input) {
    const parts = this.#parseInput(input);
    if (!parts) return input;

    let { day, month, year } = parts;

    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    // Correct month
    if (month > 12) month = 12;
    if (month < 1) month = 1;

    // Correct day for month
    const daysInMonth = this.#getDaysInMonth(month, year);
    if (day > daysInMonth) day = daysInMonth;
    if (day < 1) day = 1;

    return `${String(day).padStart(2, '0')}/${String(month).padStart(
      2,
      '0'
    )}/${year}`;
  }

  /**
   * Parse input string to parts
   */
  #parseInput(input) {
    const parts = input.split(/[\/\-\.]/);
    if (parts.length !== 3) return null;

    return {
      day: parts[0],
      month: parts[1],
      year: parts[2],
    };
  }

  /**
   * Validate partial input (as user types)
   */
  validatePartial(input) {
    const cleaned = input.replace(/\D/g, '');

    if (cleaned.length >= 2) {
      const day = parseInt(cleaned.slice(0, 2), 10);
      if (day > 31) return false;
    }

    if (cleaned.length >= 4) {
      const month = parseInt(cleaned.slice(2, 4), 10);
      if (month > 12) return false;
    }

    if (cleaned.length >= 8) {
      const year = parseInt(cleaned.slice(4, 8), 10);
      if (year < 1900 || year > 2100) return false;
    }

    return true;
  }

  /**
   * Get validation error message
   */
  getErrorMessage(date) {
    if (!date) return ERRORS.INVALID_DATE;

    if (this.#minDate && date < this.#minDate) {
      return RANGE_ERRORS.MIN_DATE(this.#formatDate(this.#minDate));
    }

    if (this.#maxDate && date > this.#maxDate) {
      return RANGE_ERRORS.MAX_DATE(this.#formatDate(this.#maxDate));
    }

    if (this.#isDateDisabled(date)) {
      return ERRORS.DATE_DISABLED;
    }

    return null;
  }

  /**
   * Format date for error message
   */
  #formatDate(date) {
    return date.toLocaleDateString();
  }

  /**
   * Update options
   */
  updateOptions(options) {
    if (options.minDate !== undefined) this.#minDate = options.minDate;
    if (options.maxDate !== undefined) this.#maxDate = options.maxDate;
    if (options.disabledDates !== undefined)
      this.#disabledDates = options.disabledDates;
  }
}

export default ValidationHandler;
