/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Comparator: Date Comparison Utilities
 * ============================================================================
 *
 * Compare dates in various ways
 * All functions are pure - no side effects
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if two dates are in the same month
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isSameMonth(date1, date2) {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * Check if two dates are in the same year
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isSameYear(date1, date2) {
  if (!date1 || !date2) return false;

  return date1.getFullYear() === date2.getFullYear();
}

/**
 * Check if two dates are in the same week (Sun-Sat)
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isSameWeek(date1, date2) {
  if (!date1 || !date2) return false;

  const startOfWeek1 = new Date(date1);
  startOfWeek1.setDate(date1.getDate() - date1.getDay());
  startOfWeek1.setHours(0, 0, 0, 0);

  const startOfWeek2 = new Date(date2);
  startOfWeek2.setDate(date2.getDate() - date2.getDay());
  startOfWeek2.setHours(0, 0, 0, 0);

  return startOfWeek1.getTime() === startOfWeek2.getTime();
}

/**
 * Check if two dates are in the same quarter
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isSameQuarter(date1, date2) {
  if (!date1 || !date2) return false;

  const quarter1 = Math.floor(date1.getMonth() / 3);
  const quarter2 = Math.floor(date2.getMonth() / 3);

  return date1.getFullYear() === date2.getFullYear() && quarter1 === quarter2;
}

/**
 * Check if date1 is before date2
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isBefore(date1, date2) {
  if (!date1 || !date2) return false;
  return date1.getTime() < date2.getTime();
}

/**
 * Check if date1 is after date2
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean}
 */
export function isAfter(date1, date2) {
  if (!date1 || !date2) return false;
  return date1.getTime() > date2.getTime();
}

/**
 * Check if date is between start and end (inclusive)
 * @param {Date} date - Date to check
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {boolean}
 */
export function isBetween(date, start, end) {
  if (!date || !start || !end) return false;

  const timestamp = date.getTime();
  return timestamp >= start.getTime() && timestamp <= end.getTime();
}

/**
 * Compare two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compare(date1, date2) {
  if (!date1 || !date2) return 0;

  const time1 = date1.getTime();
  const time2 = date2.getTime();

  if (time1 < time2) return -1;
  if (time1 > time2) return 1;
  return 0;
}

/**
 * Get minimum date from array
 * @param {Array<Date>} dates - Array of dates
 * @returns {Date|null} Minimum date or null
 */
export function min(dates) {
  if (!dates || dates.length === 0) return null;

  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

/**
 * Get maximum date from array
 * @param {Array<Date>} dates - Array of dates
 * @returns {Date|null} Maximum date or null
 */
export function max(dates) {
  if (!dates || dates.length === 0) return null;

  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

/**
 * Sort dates array (ascending by default)
 * @param {Array<Date>} dates - Array of dates
 * @param {boolean} descending - Sort descending if true
 * @returns {Array<Date>} Sorted array
 */
export function sort(dates, descending = false) {
  if (!dates || dates.length === 0) return [];

  const sorted = [...dates].sort((a, b) => compare(a, b));
  return descending ? sorted.reverse() : sorted;
}

/**
 * Find closest date to target from array
 * @param {Date} target - Target date
 * @param {Array<Date>} dates - Array of dates to search
 * @returns {Date|null} Closest date or null
 */
export function closest(target, dates) {
  if (!target || !dates || dates.length === 0) return null;

  let closestDate = dates[0];
  let minDiff = Math.abs(target.getTime() - dates[0].getTime());

  for (let i = 1; i < dates.length; i++) {
    const diff = Math.abs(target.getTime() - dates[i].getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestDate = dates[i];
    }
  }

  return closestDate;
}

export default {
  isSameDay,
  isSameMonth,
  isSameYear,
  isSameWeek,
  isSameQuarter,
  isBefore,
  isAfter,
  isBetween,
  compare,
  min,
  max,
  sort,
  closest,
};
