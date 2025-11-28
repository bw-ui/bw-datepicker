/**
 * ============================================================================
 * Black & White: UI Engineering
 * Core Date Utilities (Minimal)
 * ============================================================================
 *
 * Only essential date functions for core functionality.
 * Advanced date features are in the bw-date-utils plugin.
 *
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

/**
 * Check if a value is a valid Date object
 * @param {*} date
 * @returns {boolean}
 */
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Check if two dates are the same day
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  if (!isValidDate(date1) || !isValidDate(date2)) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Parse ISO date string (YYYY-MM-DD)
 * @param {string} str
 * @returns {Date|null}
 */
export function parseISO(str) {
  if (!str || typeof str !== 'string') return null;
  
  // Handle ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
  const day = parseInt(match[3], 10);
  
  const date = new Date(year, month, day);
  
  // Validate the date is real
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  
  return date;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param {Date} date
 * @returns {string}
 */
export function toISO(date) {
  if (!isValidDate(date)) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display (basic format)
 * @param {Date} date
 * @param {string} format - 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY'
 * @returns {string}
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!isValidDate(date)) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Generate calendar month grid (6 weeks x 7 days)
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} firstDayOfWeek - 0=Sunday, 1=Monday
 * @returns {Date[][]} 6x7 grid of dates
 */
export function generateCalendarMonth(year, month, firstDayOfWeek = 0) {
  const weeks = [];
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  
  // Find the start date (may be in previous month)
  let dayOfWeek = firstDay.getDay();
  let diff = dayOfWeek - firstDayOfWeek;
  if (diff < 0) diff += 7;
  
  const startDate = new Date(year, month, 1 - diff);
  
  // Generate 6 weeks
  let currentDate = new Date(startDate);
  
  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(weekDays);
  }
  
  return weeks;
}

/**
 * Check if date is within range
 * @param {Date} date
 * @param {Date|null} minDate
 * @param {Date|null} maxDate
 * @returns {boolean}
 */
export function isWithinRange(date, minDate, maxDate) {
  if (!isValidDate(date)) return false;
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  if (minDate) {
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    if (checkDate < min) return false;
  }
  
  if (maxDate) {
    const max = new Date(maxDate);
    max.setHours(0, 0, 0, 0);
    if (checkDate > max) return false;
  }
  
  return true;
}

/**
 * Check if date is disabled
 * @param {Date} date
 * @param {Object} constraints
 * @returns {boolean}
 */
export function isDisabled(date, constraints = {}) {
  const { minDate, maxDate, disabledDates = [] } = constraints;
  
  // Check range
  if (!isWithinRange(date, minDate, maxDate)) {
    return true;
  }
  
  // Check disabled dates array
  if (disabledDates.length > 0) {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    for (const disabled of disabledDates) {
      const disabledDate = disabled instanceof Date ? disabled : new Date(disabled);
      disabledDate.setHours(0, 0, 0, 0);
      
      if (checkDate.getTime() === disabledDate.getTime()) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if date is a weekend
 * @param {Date} date
 * @returns {boolean}
 */
export function isWeekend(date) {
  if (!isValidDate(date)) return false;
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Default month names
 */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Default day names (short)
 */
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
