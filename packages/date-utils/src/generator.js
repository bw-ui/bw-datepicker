/**
 * ============================================================================
 * Black & White: UI Engineering
 * Date Generator: Generate Date Ranges & Sequences
 * ============================================================================
 *
 * Generate arrays of dates, calendar grids, date ranges
 * Useful for rendering calendars and date pickers
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

import {
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
} from './calculator.js';

/**
 * Generate a range of dates between start and end
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Array<Date>} Array of dates
 */
export function dateRange(start, end) {
  if (!start || !end) return [];

  const dates = [];
  let current = new Date(start);
  current.setHours(0, 0, 0, 0);

  const endTime = new Date(end);
  endTime.setHours(0, 0, 0, 0);

  while (current <= endTime) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Generate calendar month grid (6 weeks x 7 days = 42 days)
 * Includes previous/next month padding days
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} firstDayOfWeek - First day of week (0=Sunday, 1=Monday)
 * @returns {Array<Array<Date>>} 2D array of weeks containing dates
 */
export function calendarMonth(year, month, firstDayOfWeek = 0) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Calculate padding needed at start
  let startingDayOfWeek = firstDay.getDay() - firstDayOfWeek;
  if (startingDayOfWeek < 0) startingDayOfWeek += 7;

  // Previous month info
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

  const weeks = [];
  let currentWeek = [];

  // Previous month padding days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    currentWeek.push(new Date(prevYear, prevMonth, day));
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month padding days
  if (currentWeek.length > 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    let day = 1;

    while (currentWeek.length < 7) {
      currentWeek.push(new Date(nextYear, nextMonth, day));
      day++;
    }

    weeks.push(currentWeek);
  }

  // Ensure 6 weeks (standard calendar grid)
  while (weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1];
    const lastDate = lastWeek[lastWeek.length - 1];
    const nextWeek = [];

    for (let i = 1; i <= 7; i++) {
      nextWeek.push(addDays(lastDate, i));
    }

    weeks.push(nextWeek);
  }

  return weeks;
}

/**
 * Generate all months in a year
 * @param {number} year - Year
 * @returns {Array<Object>} Array of month objects { month, name, days }
 */
export function monthsInYear(year) {
  const monthNames = [
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

  return monthNames.map((name, index) => {
    const date = new Date(year, index, 1);
    return {
      month: index,
      name,
      days: getDaysInMonth(date),
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  });
}

/**
 * Generate range of years
 * @param {number} startYear - Start year
 * @param {number} endYear - End year
 * @returns {Array<number>} Array of years
 */
export function yearRange(startYear, endYear) {
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

/**
 * Generate years between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Array<number>} Array of years
 */
export function yearsBetween(start, end) {
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  return yearRange(startYear, endYear);
}

/**
 * Generate all weekdays in a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} weekday - Weekday (0=Sunday, 6=Saturday)
 * @returns {Array<Date>} Array of dates
 */
export function weekdaysInMonth(year, month, weekday) {
  const dates = [];
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === weekday) {
      dates.push(date);
    }
  }

  return dates;
}

/**
 * Generate all Mondays in a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Array<Date>} Array of Mondays
 */
export function mondays(year, month) {
  return weekdaysInMonth(year, month, 1);
}

/**
 * Generate weekdays (Mon-Fri) in a date range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Array<Date>} Array of weekday dates
 */
export function weekdays(start, end) {
  return dateRange(start, end).filter((date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday or Saturday
  });
}

/**
 * Generate weekends (Sat-Sun) in a date range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Array<Date>} Array of weekend dates
 */
export function weekends(start, end) {
  return dateRange(start, end).filter((date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });
}

/**
 * Generate weekdays in a range (Mon-Fri only)
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Array<Date>} Array of weekday dates
 */
export function weekdaysInRange(start, end) {
  return weekdays(start, end);
}

/**
 * Get first N days of a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} count - Number of days
 * @returns {Array<Date>} Array of dates
 */
export function firstNDays(year, month, count) {
  const dates = [];

  for (let day = 1; day <= count; day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
}

/**
 * Get last N days of a month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} count - Number of days
 * @returns {Array<Date>} Array of dates
 */
export function lastNDays(year, month, count) {
  const dates = [];
  const totalDays = getDaysInMonth(new Date(year, month, 1));
  const startDay = totalDays - count + 1;

  for (let day = startDay; day <= totalDays; day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
}

/**
 * Get next N days from a date
 * @param {Date} date - Starting date
 * @param {number} count - Number of days
 * @returns {Array<Date>} Array of dates
 */
export function nextNDays(date, count) {
  const dates = [];

  for (let i = 1; i <= count; i++) {
    dates.push(addDays(date, i));
  }

  return dates;
}

/**
 * Get previous N days from a date
 * @param {Date} date - Starting date
 * @param {number} count - Number of days
 * @returns {Array<Date>} Array of dates
 */
export function previousNDays(date, count) {
  const dates = [];

  for (let i = count; i >= 1; i--) {
    dates.push(addDays(date, -i));
  }

  return dates;
}

/**
 * Generate quarters in a year
 * @param {number} year - Year
 * @returns {Array<Object>} Array of quarter objects
 */
export function quartersInYear(year) {
  return [
    {
      quarter: 1,
      name: 'Q1',
      months: [0, 1, 2],
      start: new Date(year, 0, 1),
      end: new Date(year, 2, 31),
    },
    {
      quarter: 2,
      name: 'Q2',
      months: [3, 4, 5],
      start: new Date(year, 3, 1),
      end: new Date(year, 5, 30),
    },
    {
      quarter: 3,
      name: 'Q3',
      months: [6, 7, 8],
      start: new Date(year, 6, 1),
      end: new Date(year, 8, 30),
    },
    {
      quarter: 4,
      name: 'Q4',
      months: [9, 10, 11],
      start: new Date(year, 9, 1),
      end: new Date(year, 11, 31),
    },
  ];
}

/**
 * Generate date range with step
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @param {number} step - Step in days
 * @returns {Array<Date>} Array of dates
 */
export function dateRangeWithStep(start, end, step = 1) {
  const dates = [];
  let current = new Date(start);
  current.setHours(0, 0, 0, 0);

  const endTime = new Date(end);
  endTime.setHours(0, 0, 0, 0);

  while (current <= endTime) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + step);
  }

  return dates;
}

export default {
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
};
