/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Parser: Parse Strings to Date Objects
 * ============================================================================
 *
 * Parse various date string formats to Date objects
 * Support multiple input formats
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * Parse ISO format date string (YYYY-MM-DD)
 * @param {string} dateStr - Date string
 * @returns {Date|null} Parsed date or null
 */
export function parseISO(dateStr) {
  if (typeof dateStr !== 'string') return null;

  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Validate the date is real
  if (isNaN(date.getTime())) return null;
  if (date.getDate() !== parseInt(day)) return null;
  if (date.getMonth() !== parseInt(month) - 1) return null;

  return date;
}

/**
 * Parse US format date string (MM/DD/YYYY or M/D/YYYY)
 * @param {string} dateStr - Date string
 * @returns {Date|null} Parsed date or null
 */
export function parseUSFormat(dateStr) {
  if (typeof dateStr !== 'string') return null;

  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const [, month, day, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Validate
  if (isNaN(date.getTime())) return null;
  if (date.getDate() !== parseInt(day)) return null;
  if (date.getMonth() !== parseInt(month) - 1) return null;

  return date;
}

/**
 * Parse EU format date string (DD/MM/YYYY or D/M/YYYY)
 * @param {string} dateStr - Date string
 * @returns {Date|null} Parsed date or null
 */
export function parseEUFormat(dateStr) {
  if (typeof dateStr !== 'string') return null;

  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Validate
  if (isNaN(date.getTime())) return null;
  if (date.getDate() !== parseInt(day)) return null;
  if (date.getMonth() !== parseInt(month) - 1) return null;

  return date;
}

/**
 * Parse timestamp (milliseconds since epoch)
 * @param {number|string} timestamp - Unix timestamp
 * @returns {Date|null} Parsed date or null
 */
export function parseTimestamp(timestamp) {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;

  if (isNaN(ts)) return null;

  const date = new Date(ts);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Parse native Date string (uses Date constructor)
 * @param {string} dateStr - Date string
 * @returns {Date|null} Parsed date or null
 */
export function parseNative(dateStr) {
  if (typeof dateStr !== 'string') return null;

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Parse date with custom format
 * Supported tokens: YYYY, YY, MM, M, DD, D, MMM
 * @param {string} dateStr - Date string (e.g., "15-Jan-2025")
 * @param {string} format - Format pattern (e.g., "DD-MMM-YYYY")
 * @returns {Date|null} Parsed date or null
 */
export function parseWithFormat(dateStr, format) {
  if (typeof dateStr !== 'string' || typeof format !== 'string') return null;

  dateStr = dateStr.trim();
  format = format.trim();
  if (!dateStr || !format) return null;

  // Month names lookup
  const MONTHS_SHORT = [
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

  // Build regex pattern by replacing tokens (longest first to avoid conflicts)
  let regexStr = format
    .replace(/YYYY/g, '(\\d{4})') // 4-digit year
    .replace(/MMM/g, '([A-Za-z]{3})') // 3-letter month name
    .replace(/MM/g, '(\\d{2})') // 2-digit month
    .replace(/DD/g, '(\\d{2})') // 2-digit day
    .replace(/YY/g, '(\\d{2})') // 2-digit year
    .replace(/M/g, '(\\d{1,2})') // 1-2 digit month
    .replace(/D/g, '(\\d{1,2})') // 1-2 digit day
    .replace(/\//g, '\\/') // Escape /
    .replace(/\./g, '\\.') // Escape .
    .replace(/-/g, '\\-') // Escape -
    .replace(/\s/g, '\\s'); // Escape space

  const regex = new RegExp('^' + regexStr + '$');
  const match = dateStr.match(regex);

  if (!match) return null;

  // Track token order to extract values correctly
  const tokens = [];
  format.replace(/YYYY|MMM|MM|DD|YY|M|D/g, (token) => {
    tokens.push(token);
    return token;
  });

  // Extract year, month, day from capture groups
  let year = 0;
  let month = 0;
  let day = 0;

  tokens.forEach((token, i) => {
    const value = match[i + 1]; // i+1 because match[0] is full match

    if (token === 'YYYY') {
      year = parseInt(value, 10);
    } else if (token === 'YY') {
      // Convert 2-digit year to 4-digit (assume 2000s)
      const y = parseInt(value, 10);
      year = y >= 0 && y <= 99 ? 2000 + y : y;
    } else if (token === 'MM' || token === 'M') {
      month = parseInt(value, 10) - 1; // zero-based month
    } else if (token === 'MMM') {
      month = MONTHS_SHORT.indexOf(value);
    } else if (token === 'DD' || token === 'D') {
      day = parseInt(value, 10);
    }
  });

  // Validate month and day ranges
  if (month < 0 || month > 11) return null;
  if (day < 1 || day > 31) return null;

  // Create date object
  const date = new Date(year, month, day);

  // Validate date is real (avoid Feb 31 becoming Mar 3)
  if (date.getFullYear() !== year) return null;
  if (date.getMonth() !== month) return null;
  if (date.getDate() !== day) return null;

  return date;
}

/**
 * Smart date parser - tries multiple formats
 * @param {string|Date|number} input - Input to parse
 * @returns {Date|null} Parsed date or null
 */
export function smartParse(input) {
  // Already a Date object
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  // Number (timestamp)
  if (typeof input === 'number') {
    return parseTimestamp(input);
  }

  // Not a string
  if (typeof input !== 'string') {
    return null;
  }

  // Empty string
  if (!input.trim()) {
    return null;
  }

  // Try ISO format first (most common)
  let date = parseISO(input);
  if (date) return date;

  // Try US format (MM/DD/YYYY)
  date = parseUSFormat(input);
  if (date) return date;

  // Try EU format (DD/MM/YYYY)
  date = parseEUFormat(input);
  if (date) return date;

  // Try common formats with separators
  const formats = [
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'MM-DD-YYYY',
    'YYYY/MM/DD',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD.MM.YYYY',
    'MM.DD.YYYY',
  ];

  for (const format of formats) {
    date = parseWithFormat(input, format);
    if (date) return date;
  }

  // Last resort: native Date parser
  date = parseNative(input);
  if (date) return date;

  return null;
}

/**
 * Main parse function (alias for smartParse)
 * @param {string|Date|number} input - Input to parse
 * @returns {Date|null} Parsed date or null
 */
export function parseDate(input) {
  return smartParse(input);
}

/**
 * Parse date string and return ISO string
 * @param {string} dateStr - Date string
 * @returns {string|null} ISO string or null
 */
export function parseToISO(dateStr) {
  const date = parseDate(dateStr);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Parse and validate date string
 * @param {string} dateStr - Date string
 * @returns {Object} { valid: boolean, date: Date|null, error: string|null }
 */
export function parseAndValidate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return {
      valid: false,
      date: null,
      error: 'Invalid input',
    };
  }

  const date = parseDate(dateStr);

  if (!date) {
    return {
      valid: false,
      date: null,
      error: 'Could not parse date',
    };
  }

  // Check if parsed date is reasonable (not too far in past/future)
  const year = date.getFullYear();
  if (year < 1900 || year > 2200) {
    return {
      valid: false,
      date: null,
      error: 'Year out of reasonable range',
    };
  }

  return {
    valid: true,
    date,
    error: null,
  };
}

/**
 * Parse relative date strings (today, tomorrow, yesterday)
 * @param {string} input - Relative date string
 * @returns {Date|null} Parsed date or null
 */
export function parseRelative(input) {
  if (typeof input !== 'string') return null;

  const normalized = input.toLowerCase().trim();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (normalized) {
    case 'today':
      return today;

    case 'tomorrow':
      return new Date(today.getTime() + 24 * 60 * 60 * 1000);

    case 'yesterday':
      return new Date(today.getTime() - 24 * 60 * 60 * 1000);

    default:
      return null;
  }
}

export default {
  parseDate,
  parseISO,
  parseUSFormat,
  parseEUFormat,
  parseTimestamp,
  parseNative,
  parseWithFormat,
  smartParse,
  parseToISO,
  parseAndValidate,
  parseRelative,
};
