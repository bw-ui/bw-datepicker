/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Utils Module - Main Export
 * ============================================================================
 *
 * Complete date utility library for the DatePicker
 * Zero dependencies, pure functions, immutable operations
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

// ============================================================================
// PARSER - Parse strings to Date objects
// ============================================================================
export {
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
} from './parser.js';

// ============================================================================
// FORMATTER - Format Date objects to strings
// ============================================================================
export {
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
} from './formatter.js';

// ============================================================================
// VALIDATOR - Validate dates and check properties
// ============================================================================
export {
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
} from './validator.js';

// ============================================================================
// CALCULATOR - Date math and manipulation
// ============================================================================
export {
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
  diffInDays,
  diffInWeeks,
  diffInMonths,
  diffInYears,
  setDayOfWeek,
} from './calculator.js';

// ============================================================================
// COMPARATOR - Compare dates
// ============================================================================
export {
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
} from './comparator.js';

// ============================================================================
// GENERATOR - Generate date ranges and sequences
// ============================================================================
export {
  dateRange,
  calendarMonth,
  monthsInYear,
  yearRange,
  yearsBetween,
  weekdaysInMonth,
  mondays,
  weekdays,
  weekends,
  weekdaysInRange,
  firstNDays,
  lastNDays,
  nextNDays,
  previousNDays,
  quartersInYear,
  dateRangeWithStep,
} from './generator.js';

// ============================================================================
// DEFAULT EXPORT - Namespace object with all utilities
// ============================================================================
import * as parser from './parser.js';
import * as formatter from './formatter.js';
import * as validator from './validator.js';
import * as calculator from './calculator.js';
import * as comparator from './comparator.js';
import * as generator from './generator.js';

export default {
  // Grouped by category
  parser,
  formatter,
  validator,
  calculator,
  comparator,
  generator,

  // Most commonly used functions at top level for convenience
  parseDate: parser.parseDate,
  formatDate: formatter.formatDate,
  isValidDate: validator.isValidDate,
  isSameDay: comparator.isSameDay,
  addDays: calculator.addDays,
  dateRange: generator.dateRange,
};
