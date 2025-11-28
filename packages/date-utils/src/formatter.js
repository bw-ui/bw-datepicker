/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Formatter: Format Dates to Strings
 * ============================================================================
 *
 * Format Date objects using tokens like YYYY-MM-DD
 * Support multiple output formats
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Format a date using tokens
 * @param {Date} date - Date to format
 * @param {string} format - Format string with tokens
 * @returns {string} Formatted date string
 *
 * Supported tokens:
 * - YYYY: 4-digit year (2025)
 * - YY: 2-digit year (25)
 * - MMMM: Full month name (January)
 * - MMM: Short month name (Jan)
 * - MM: 2-digit month (01-12)
 * - M: Month without padding (1-12)
 * - DD: 2-digit day (01-31)
 * - D: Day without padding (1-31)
 * - dddd: Full day name (Monday)
 * - ddd: Short day name (Mon)
 * - HH: 2-digit hours (00-23)
 * - mm: 2-digit minutes (00-59)
 * - ss: 2-digit seconds (00-59)
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const tokens = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(-2),
    MMMM: MONTH_NAMES[date.getMonth()],
    MMM: MONTH_NAMES_SHORT[date.getMonth()],
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: (date.getMonth() + 1).toString(),
    DD: String(date.getDate()).padStart(2, '0'),
    D: date.getDate().toString(),
    dddd: DAY_NAMES[date.getDay()],
    ddd: DAY_NAMES_SHORT[date.getDay()],
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };

  let formatted = format;

  // Replace tokens (longest first to avoid partial matches)
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

  for (const token of sortedTokens) {
    formatted = formatted.replace(new RegExp(token, 'g'), tokens[token]);
  }

  return formatted;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param {Date} date - Date to format
 * @returns {string} ISO format string
 */
export function toISO(date) {
  return formatDate(date, 'YYYY-MM-DD');
}

/**
 * Format date to US format (MM/DD/YYYY)
 * @param {Date} date - Date to format
 * @returns {string} US format string
 */
export function toUS(date) {
  return formatDate(date, 'MM/DD/YYYY');
}

/**
 * Format date to EU format (DD/MM/YYYY)
 * @param {Date} date - Date to format
 * @returns {string} EU format string
 */
export function toEU(date) {
  return formatDate(date, 'DD/MM/YYYY');
}

/**
 * Format date to long format (January 15, 2025)
 * @param {Date} date - Date to format
 * @returns {string} Long format string
 */
export function toLong(date) {
  return formatDate(date, 'MMMM D, YYYY');
}

/**
 * Format date to short format (Jan 15, 2025)
 * @param {Date} date - Date to format
 * @returns {string} Short format string
 */
export function toShort(date) {
  return formatDate(date, 'MMM D, YYYY');
}

/**
 * Format date to medium format (Jan 15, 25)
 * @param {Date} date - Date to format
 * @returns {string} Medium format string
 */
export function toMedium(date) {
  return formatDate(date, 'MMM D, YY');
}

/**
 * Format date to date-time format (YYYY-MM-DD HH:mm:ss)
 * @param {Date} date - Date to format
 * @returns {string} Date-time format string
 */
export function toDateTime(date) {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
}

/**
 * Format date to relative time (Today, Yesterday, etc.)
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
export function toRelative(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  const diffTime = dateToCheck.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return toLong(date);
}

/**
 * Format date for input display (based on locale)
 * @param {Date} date - Date to format
 * @param {string} locale - Locale (e.g., 'en-US', 'en-GB')
 * @returns {string} Formatted string
 */
export function toInputFormat(date, locale = 'en-US') {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  if (locale.startsWith('en-US')) {
    return toUS(date);
  } else if (locale.startsWith('en-GB') || locale.startsWith('en-EU')) {
    return toEU(date);
  }

  return toISO(date);
}

/**
 * Get ordinal suffix for day (st, nd, rd, th)
 * @param {number} day - Day of month (1-31)
 * @returns {string} Ordinal suffix
 */
export function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Format date with ordinal (January 15th, 2025)
 * @param {Date} date - Date to format
 * @returns {string} Formatted string with ordinal
 */
export function toOrdinal(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const suffix = getOrdinalSuffix(day);

  return `${month} ${day}${suffix}, ${year}`;
}

/**
 * Format date for ARIA label (January 15, 2025)
 * @param {Date} date - Date to format
 * @returns {string} ARIA-friendly format
 */
export function toAriaLabel(date) {
  return toLong(date);
}

/**
 * Format date range (Jan 15 - Jan 20, 2025)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} Formatted range
 */
export function toRange(startDate, endDate) {
  if (!startDate || !endDate) return '';

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    // Same month: Jan 15 - 20, 2025
    return `${formatDate(startDate, 'MMM D')} - ${formatDate(
      endDate,
      'D, YYYY'
    )}`;
  } else if (sameYear) {
    // Same year: Jan 15 - Feb 20, 2025
    return `${formatDate(startDate, 'MMM D')} - ${formatDate(
      endDate,
      'MMM D, YYYY'
    )}`;
  } else {
    // Different years: Jan 15, 2025 - Feb 20, 2026
    return `${formatDate(startDate, 'MMM D, YYYY')} - ${formatDate(
      endDate,
      'MMM D, YYYY'
    )}`;
  }
}

export default {
  formatDate,
  toISO,
  toUS,
  toEU,
  toLong,
  toShort,
  toMedium,
  toDateTime,
  toRelative,
  toInputFormat,
  getOrdinalSuffix,
  toOrdinal,
  toAriaLabel,
  toRange,
};
