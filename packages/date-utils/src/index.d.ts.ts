/**
 * @bw-ui/datepicker-date-utils - TypeScript Definitions
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Date Utils Instance
// ============================================================================

export interface DateUtilsInstance {
  /** Calculator module */
  calculator: typeof calculator;
  /** Comparator module */
  comparator: typeof comparator;
  /** Formatter module */
  formatter: typeof formatter;
  /** Generator module */
  generator: typeof generator;
  /** Parser module */
  parser: typeof parser;
  /** Validator module */
  validator: typeof validator;
}

// ============================================================================
// Calculator
// ============================================================================

export declare namespace calculator {
  /** Clone a date */
  function cloneDate(date: Date): Date;
  /** Add days to date */
  function addDays(date: Date, days: number): Date;
  /** Add weeks to date */
  function addWeeks(date: Date, weeks: number): Date;
  /** Add months to date */
  function addMonths(date: Date, months: number): Date;
  /** Add years to date */
  function addYears(date: Date, years: number): Date;
  /** Subtract days from date */
  function subtractDays(date: Date, days: number): Date;
  /** Subtract weeks from date */
  function subtractWeeks(date: Date, weeks: number): Date;
  /** Subtract months from date */
  function subtractMonths(date: Date, months: number): Date;
  /** Subtract years from date */
  function subtractYears(date: Date, years: number): Date;
  /** Get start of day (00:00:00.000) */
  function startOfDay(date: Date): Date;
  /** Get end of day (23:59:59.999) */
  function endOfDay(date: Date): Date;
  /** Get start of week */
  function startOfWeek(date: Date, weekStartsOn?: number): Date;
  /** Get end of week */
  function endOfWeek(date: Date, weekStartsOn?: number): Date;
  /** Get start of month */
  function startOfMonth(date: Date): Date;
  /** Get end of month */
  function endOfMonth(date: Date): Date;
  /** Get start of year */
  function startOfYear(date: Date): Date;
  /** Get end of year */
  function endOfYear(date: Date): Date;
  /** Get number of days in month */
  function getDaysInMonth(date: Date): number;
  /** Get number of days in year */
  function getDaysInYear(date: Date): number;
  /** Check if leap year */
  function isLeapYear(year: number): boolean;
  /** Get difference in days */
  function diffInDays(date1: Date, date2: Date): number;
  /** Get difference in weeks */
  function diffInWeeks(date1: Date, date2: Date): number;
  /** Get difference in months */
  function diffInMonths(date1: Date, date2: Date): number;
  /** Get difference in years */
  function diffInYears(date1: Date, date2: Date): number;
  /** Set day of week */
  function setDayOfWeek(date: Date, dayOfWeek: number): Date;
}

// ============================================================================
// Comparator
// ============================================================================

export declare namespace comparator {
  /** Check if same day */
  function isSameDay(date1: Date, date2: Date): boolean;
  /** Check if same month */
  function isSameMonth(date1: Date, date2: Date): boolean;
  /** Check if same year */
  function isSameYear(date1: Date, date2: Date): boolean;
  /** Check if same week */
  function isSameWeek(date1: Date, date2: Date): boolean;
  /** Check if same quarter */
  function isSameQuarter(date1: Date, date2: Date): boolean;
  /** Check if date1 is before date2 */
  function isBefore(date1: Date, date2: Date): boolean;
  /** Check if date1 is after date2 */
  function isAfter(date1: Date, date2: Date): boolean;
  /** Check if date is between start and end */
  function isBetween(date: Date, start: Date, end: Date): boolean;
  /** Compare two dates */
  function compare(date1: Date, date2: Date): -1 | 0 | 1;
  /** Get minimum date from array */
  function min(dates: Date[]): Date | null;
  /** Get maximum date from array */
  function max(dates: Date[]): Date | null;
  /** Sort dates array */
  function sort(dates: Date[], descending?: boolean): Date[];
  /** Find closest date to target */
  function closest(target: Date, dates: Date[]): Date | null;
}

// ============================================================================
// Formatter
// ============================================================================

export declare namespace formatter {
  /** Format date using tokens */
  function formatDate(date: Date, format?: string): string;
  /** Format to ISO (YYYY-MM-DD) */
  function toISO(date: Date): string;
  /** Format to US (MM/DD/YYYY) */
  function toUS(date: Date): string;
  /** Format to EU (DD/MM/YYYY) */
  function toEU(date: Date): string;
  /** Format to long (January 15, 2025) */
  function toLong(date: Date): string;
  /** Format to short (Jan 15, 2025) */
  function toShort(date: Date): string;
  /** Format to medium (Jan 15, 25) */
  function toMedium(date: Date): string;
  /** Format to datetime (YYYY-MM-DD HH:mm:ss) */
  function toDateTime(date: Date): string;
  /** Format to relative (Today, Yesterday, etc.) */
  function toRelative(date: Date): string;
  /** Format for input based on locale */
  function toInputFormat(date: Date, locale?: string): string;
  /** Get ordinal suffix (st, nd, rd, th) */
  function getOrdinalSuffix(day: number): string;
  /** Format with ordinal (January 15th, 2025) */
  function toOrdinal(date: Date): string;
  /** Format for ARIA label */
  function toAriaLabel(date: Date): string;
  /** Format date range */
  function toRange(startDate: Date, endDate: Date): string;
}

// ============================================================================
// Generator
// ============================================================================

export interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dayOfWeek: number;
}

export declare namespace generator {
  /** Generate calendar month grid */
  function generateMonth(year: number, month: number, options?: {
    firstDayOfWeek?: number;
  }): CalendarDay[][];
  /** Generate week dates */
  function generateWeek(date: Date, firstDayOfWeek?: number): Date[];
  /** Generate year months */
  function generateYear(year: number): Date[];
  /** Generate decade years */
  function generateDecade(year: number): number[];
}

// ============================================================================
// Parser
// ============================================================================

export declare namespace parser {
  /** Smart parse various date formats */
  function smartParse(value: string): Date | null;
  /** Parse with specific format */
  function parse(value: string, format: string): Date | null;
  /** Parse ISO date string */
  function parseISO(value: string): Date | null;
  /** Parse US format (MM/DD/YYYY) */
  function parseUS(value: string): Date | null;
  /** Parse EU format (DD/MM/YYYY) */
  function parseEU(value: string): Date | null;
  /** Try multiple formats */
  function tryParse(value: string, formats: string[]): Date | null;
}

// ============================================================================
// Validator
// ============================================================================

export declare namespace validator {
  /** Check if valid date */
  function isValidDate(value: unknown): value is Date;
  /** Check if valid date string */
  function isValidDateString(value: string, format?: string): boolean;
  /** Check if date is in range */
  function isInRange(date: Date, min: Date | null, max: Date | null): boolean;
  /** Check if date is disabled */
  function isDisabled(date: Date, disabledDates: Date[]): boolean;
  /** Check if weekend */
  function isWeekend(date: Date): boolean;
  /** Check if weekday */
  function isWeekday(date: Date): boolean;
  /** Check if today */
  function isToday(date: Date): boolean;
  /** Check if past */
  function isPast(date: Date): boolean;
  /** Check if future */
  function isFuture(date: Date): boolean;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const DateUtilsPlugin: Plugin<DateUtilsInstance> & {
  name: 'date-utils';
  init(api: unknown, options?: {}): DateUtilsInstance;
  destroy(instance: DateUtilsInstance): void;
};

// ============================================================================
// Direct Exports
// ============================================================================

export { calculator, comparator, formatter, generator, parser, validator };

// ============================================================================
// Default Export
// ============================================================================

export default DateUtilsPlugin;
