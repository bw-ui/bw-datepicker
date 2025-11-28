/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Validator: Validation & Checking Utilities
 * ============================================================================
 *
 * Validate dates against various rules
 * Check date properties and constraints
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

import { isSameDay, isBefore, isAfter, isBetween } from './comparator.js';
import { startOfDay } from './calculator.js';

/**
 * Check if value is a valid Date object
 * @param {*} date - Value to check
 * @returns {boolean}
 */
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Check if date is within a range
 * @param {Date} date - Date to check
 * @param {Date|null} minDate - Minimum date (null = no limit)
 * @param {Date|null} maxDate - Maximum date (null = no limit)
 * @returns {boolean}
 */
export function isWithinRange(date, minDate, maxDate) {
  if (!isValidDate(date)) return false;

  const dateTime = startOfDay(date).getTime();

  if (minDate) {
    const minTime = startOfDay(minDate).getTime();
    if (dateTime < minTime) return false;
  }

  if (maxDate) {
    const maxTime = startOfDay(maxDate).getTime();
    if (dateTime > maxTime) return false;
  }

  return true;
}

/**
 * Check if date is disabled based on rules
 * @param {Date} date - Date to check
 * @param {Object} options - Disable options
 * @param {Date} [options.minDate] - Minimum date
 * @param {Date} [options.maxDate] - Maximum date
 * @param {Array<Date>} [options.disabledDates] - Array of disabled dates
 * @param {Array<number>} [options.disabledDaysOfWeek] - Disabled weekdays (0-6)
 * @param {Function} [options.customDisabled] - Custom validator function
 * @returns {boolean}
 */
export function isDisabled(date, options = {}) {
  if (!isValidDate(date)) return true;

  const {
    minDate,
    maxDate,
    disabledDates = [],
    disabledDaysOfWeek = [],
    customDisabled,
  } = options;

  // Check min/max range
  if (!isWithinRange(date, minDate, maxDate)) {
    return true;
  }

  // Check disabled dates array
  if (disabledDates.length > 0) {
    const isInDisabledList = disabledDates.some((disabledDate) =>
      isSameDay(date, disabledDate)
    );
    if (isInDisabledList) return true;
  }

  // Check disabled days of week
  if (disabledDaysOfWeek.length > 0) {
    const dayOfWeek = date.getDay();
    if (disabledDaysOfWeek.includes(dayOfWeek)) {
      return true;
    }
  }

  // Check custom validator
  if (typeof customDisabled === 'function') {
    return customDisabled(date);
  }

  return false;
}

/**
 * Check if date is a weekend (Saturday or Sunday)
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
export function isWeekend(date) {
  if (!isValidDate(date)) return false;
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Check if date is today
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
export function isToday(date) {
  if (!isValidDate(date)) return false;
  return isSameDay(date, new Date());
}

/**
 * Check if date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
export function isPast(date) {
  if (!isValidDate(date)) return false;
  const today = startOfDay(new Date());
  const dateToCheck = startOfDay(date);
  return isBefore(dateToCheck, today);
}

/**
 * Check if date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
export function isFuture(date) {
  if (!isValidDate(date)) return false;
  const today = startOfDay(new Date());
  const dateToCheck = startOfDay(date);
  return isAfter(dateToCheck, today);
}

/**
 * Check if year is a leap year
 * @param {number|Date} yearOrDate - Year number or Date object
 * @returns {boolean}
 */
export function isLeapYear(yearOrDate) {
  const year =
    typeof yearOrDate === 'number' ? yearOrDate : yearOrDate.getFullYear();

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Check if date string matches a format pattern
 * @param {string} dateStr - Date string
 * @param {string} format - Format pattern (e.g., 'YYYY-MM-DD')
 * @returns {boolean}
 */
export function matchesFormat(dateStr, format) {
  if (typeof dateStr !== 'string') return false;

  // Convert format to regex pattern
  let pattern = format
    .replace(/YYYY/g, '\\d{4}')
    .replace(/YY/g, '\\d{2}')
    .replace(/MM/g, '\\d{2}')
    .replace(/M/g, '\\d{1,2}')
    .replace(/DD/g, '\\d{2}')
    .replace(/D/g, '\\d{1,2}');

  pattern = `^${pattern}$`;
  const regex = new RegExp(pattern);

  return regex.test(dateStr);
}

/**
 * Validate date with comprehensive checks
 * @param {Date} date - Date to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result { valid: boolean, errors: Array<string> }
 */
export function validate(date, rules = {}) {
  const errors = [];

  // Check if valid Date object
  if (!isValidDate(date)) {
    errors.push('Invalid date object');
    return { valid: false, errors };
  }

  // Check required
  if (rules.required && !date) {
    errors.push('Date is required');
  }

  // Check min date
  if (rules.minDate && isBefore(date, rules.minDate)) {
    errors.push(`Date must be after ${rules.minDate.toLocaleDateString()}`);
  }

  // Check max date
  if (rules.maxDate && isAfter(date, rules.maxDate)) {
    errors.push(`Date must be before ${rules.maxDate.toLocaleDateString()}`);
  }

  // Check disabled dates
  if (rules.disabledDates && rules.disabledDates.length > 0) {
    const isInDisabledList = rules.disabledDates.some((disabledDate) =>
      isSameDay(date, disabledDate)
    );
    if (isInDisabledList) {
      errors.push('This date is not available');
    }
  }

  // Check disabled weekdays
  if (rules.disabledDaysOfWeek && rules.disabledDaysOfWeek.length > 0) {
    const dayOfWeek = date.getDay();
    if (rules.disabledDaysOfWeek.includes(dayOfWeek)) {
      errors.push('This day of week is not available');
    }
  }

  // Check if weekend (if weekends disabled)
  if (rules.disableWeekends && isWeekend(date)) {
    errors.push('Weekends are not available');
  }

  // Check if past (if past disabled)
  if (rules.disablePast && isPast(date)) {
    errors.push('Past dates are not available');
  }

  // Check if future (if future disabled)
  if (rules.disableFuture && isFuture(date)) {
    errors.push('Future dates are not available');
  }

  // Custom validator
  if (typeof rules.customValidator === 'function') {
    const customResult = rules.customValidator(date);
    if (customResult !== true) {
      errors.push(
        typeof customResult === 'string'
          ? customResult
          : 'Custom validation failed'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  isValidDate,
  isWithinRange,
  isDisabled,
  isWeekend,
  isToday,
  isPast,
  isFuture,
  isLeapYear,
  matchesFormat,
  validate,
};
