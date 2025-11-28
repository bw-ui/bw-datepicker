/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Calculator: Date Math & Manipulation
 * ============================================================================
 *
 * Add, subtract, and calculate dates
 * All functions return new Date objects (immutable)
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * Clone a date (create copy)
 * @param {Date} date - Date to clone
 * @returns {Date} New date instance
 */
export function cloneDate(date) {
  return new Date(date.getTime());
}

/**
 * Add days to a date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export function addDays(date, days) {
  const result = cloneDate(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add weeks to a date
 * @param {Date} date - Starting date
 * @param {number} weeks - Number of weeks to add
 * @returns {Date} New date
 */
export function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}

/**
 * Add months to a date
 * @param {Date} date - Starting date
 * @param {number} months - Number of months to add
 * @returns {Date} New date
 */
export function addMonths(date, months) {
  const result = cloneDate(date);
  const day = result.getDate();

  result.setMonth(result.getMonth() + months);

  // Handle month overflow (e.g., Jan 31 + 1 month = Feb 28/29, not Mar 3)
  if (result.getDate() !== day) {
    result.setDate(0); // Go to last day of previous month
  }

  return result;
}

/**
 * Add years to a date
 * @param {Date} date - Starting date
 * @param {number} years - Number of years to add
 * @returns {Date} New date
 */
export function addYears(date, years) {
  const result = cloneDate(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Subtract days from a date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to subtract
 * @returns {Date} New date
 */
export function subtractDays(date, days) {
  return addDays(date, -days);
}

/**
 * Subtract weeks from a date
 * @param {Date} date - Starting date
 * @param {number} weeks - Number of weeks to subtract
 * @returns {Date} New date
 */
export function subtractWeeks(date, weeks) {
  return addWeeks(date, -weeks);
}

/**
 * Subtract months from a date
 * @param {Date} date - Starting date
 * @param {number} months - Number of months to subtract
 * @returns {Date} New date
 */
export function subtractMonths(date, months) {
  return addMonths(date, -months);
}

/**
 * Subtract years from a date
 * @param {Date} date - Starting date
 * @param {number} years - Number of years to subtract
 * @returns {Date} New date
 */
export function subtractYears(date, years) {
  return addYears(date, -years);
}

/**
 * Get start of day (00:00:00.000)
 * @param {Date} date - Date
 * @returns {Date} New date at start of day
 */
export function startOfDay(date) {
  const result = cloneDate(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day (23:59:59.999)
 * @param {Date} date - Date
 * @returns {Date} New date at end of day
 */
export function endOfDay(date) {
  const result = cloneDate(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of week (Sunday at 00:00:00.000)
 * @param {Date} date - Date
 * @param {number} weekStartsOn - 0 = Sunday, 1 = Monday
 * @returns {Date} New date at start of week
 */
export function startOfWeek(date, weekStartsOn = 0) {
  const result = cloneDate(date);
  const day = result.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of week (Saturday at 23:59:59.999)
 * @param {Date} date - Date
 * @param {number} weekStartsOn - 0 = Sunday, 1 = Monday
 * @returns {Date} New date at end of week
 */
export function endOfWeek(date, weekStartsOn = 0) {
  const result = startOfWeek(date, weekStartsOn);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of month (1st at 00:00:00.000)
 * @param {Date} date - Date
 * @returns {Date} New date at start of month
 */
export function startOfMonth(date) {
  const result = cloneDate(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of month (last day at 23:59:59.999)
 * @param {Date} date - Date
 * @returns {Date} New date at end of month
 */
export function endOfMonth(date) {
  const result = cloneDate(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0); // Last day of previous month
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of year (Jan 1 at 00:00:00.000)
 * @param {Date} date - Date
 * @returns {Date} New date at start of year
 */
export function startOfYear(date) {
  const result = cloneDate(date);
  result.setMonth(0);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of year (Dec 31 at 23:59:59.999)
 * @param {Date} date - Date
 * @returns {Date} New date at end of year
 */
export function endOfYear(date) {
  const result = cloneDate(date);
  result.setMonth(11);
  result.setDate(31);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get number of days in a month
 * @param {Date} date - Date in the month
 * @returns {number} Number of days (28-31)
 */
export function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get number of days in a year
 * @param {Date} date - Date in the year
 * @returns {number} Number of days (365 or 366)
 */
export function getDaysInYear(date) {
  const year = date.getFullYear();
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Check if year is a leap year
 * @param {number} year - Year to check
 * @returns {boolean}
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculate difference in days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in days (can be negative)
 */
export function diffInDays(date1, date2) {
  const start = startOfDay(date1);
  const end = startOfDay(date2);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * Calculate difference in weeks between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in weeks
 */
export function diffInWeeks(date1, date2) {
  return Math.floor(diffInDays(date1, date2) / 7);
}

/**
 * Calculate difference in months between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in months
 */
export function diffInMonths(date1, date2) {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  return yearDiff * 12 + monthDiff;
}

/**
 * Calculate difference in years between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in years
 */
export function diffInYears(date1, date2) {
  return date2.getFullYear() - date1.getFullYear();
}

/**
 * Set day of week for a date
 * @param {Date} date - Date to modify
 * @param {number} dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 * @returns {Date} New date
 */
export function setDayOfWeek(date, dayOfWeek) {
  const result = cloneDate(date);
  const currentDay = result.getDay();
  const diff = dayOfWeek - currentDay;
  result.setDate(result.getDate() + diff);
  return result;
}

export default {
  cloneDate,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subtractDays,
  subtractWeeks,
  subtractMonths,
  subtractYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getDaysInMonth,
  getDaysInYear,
  isLeapYear,
  diffInDays,
  diffInWeeks,
  diffInMonths,
  diffInYears,
  setDayOfWeek,
};
