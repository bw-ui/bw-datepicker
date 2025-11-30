/**
 * ============================================================================
 * Black & White: UI Engineering
 * WeekView - Single Week View
 * ============================================================================
 *
 * Renders only the current week (7 days).
 * Useful for compact displays or week-based selection.
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

import { toISO, isSameDay, DAY_NAMES } from '../date-utils.js';

export class WeekView {
  #eventBus = null;

  /**
   * Set event bus for emitting render events
   * @param {EventBus} eventBus
   */
  setEventBus(eventBus) {
    this.#eventBus = eventBus;
  }

  /**
   * Render weekdays row
   * @param {Object} options - Picker options
   * @returns {string} HTML
   */
  renderWeekdays(options) {
    const dayNames = options.dayNames || DAY_NAMES;
    const firstDayOfWeek = options.firstDayOfWeek || 0;
    const orderedDayNames = [
      ...dayNames.slice(firstDayOfWeek),
      ...dayNames.slice(0, firstDayOfWeek),
    ];

    if (options.showWeekdays === false) return '';

    // Emit render:weekdays - plugins can customize
    if (this.#eventBus) {
      const eventData = { dayNames: orderedDayNames, html: null };
      this.#eventBus.emit('render:weekdays', eventData);
      if (eventData.html) return eventData.html;
    }

    return `
      <div class="bw-datepicker__weekdays">
        ${orderedDayNames
          .map((n) => `<div class="bw-datepicker__weekday">${n}</div>`)
          .join('')}
      </div>
    `;
  }

  /**
   * Render week view
   * @param {Object} data - Render data
   * @returns {string} HTML
   */
  render(data) {
    const { selectedDate, currentMonth, currentYear, options = {} } = data;

    // Get weekReferenceDate from state, fallback to selectedDate or today
    const weekReferenceDate =
      data.weekReferenceDate || selectedDate || new Date();
    const week = this.#getWeek(weekReferenceDate, options.firstDayOfWeek || 0);

    const weekdaysHtml = this.renderWeekdays(options);

    const cells = week
      .map((date) => this.renderDay(date, selectedDate, currentMonth, options))
      .join('');

    return `
      ${weekdaysHtml}
      <div class="bw-datepicker__calendar bw-datepicker__view--week" role="grid">
        <div class="bw-datepicker__week" role="row">
          ${cells}
        </div>
      </div>
    `;
  }

  /**
   * Get the week containing a date
   * @param {Date} date - Reference date
   * @param {number} firstDayOfWeek - First day of week (0 = Sunday)
   * @returns {Date[]} Array of 7 dates
   */
  #getWeek(date, firstDayOfWeek) {
    const result = [];
    const day = date.getDay();

    // Calculate offset to first day of week
    let diff = day - firstDayOfWeek;
    if (diff < 0) diff += 7;

    // Get first day of week
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - diff);

    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      result.push(d);
    }

    return result;
  }

  /**
   * Render single day cell
   * @param {Date} date - Date to render
   * @param {Date|null} selectedDate - Currently selected date
   * @param {number} currentMonth - Current month
   * @param {Object} options - Picker options
   * @returns {string} HTML
   */
  renderDay(date, selectedDate, currentMonth, options) {
    const isCurrentMonth = date.getMonth() === currentMonth;

    // If showOtherMonths is false, render empty cell for other month days
    if (!isCurrentMonth && options.showOtherMonths === false) {
      return `<span class="bw-datepicker__day bw-datepicker__day--empty" role="gridcell"></span>`;
    }

    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const dateStr = toISO(date);
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isDisabled = this.#isDateDisabled(date, options);

    // Enriched data for plugins
    const enrichedData = {
      date,
      dateISO: dateStr,
      day,
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      isToday,
      isSelected,
      isWeekend,
      isCurrentMonth,
      isDisabled,
    };

    // Emit render:day - plugins can provide custom HTML
    if (this.#eventBus) {
      const eventData = { dayData: enrichedData, html: null };
      this.#eventBus.emit('render:day', eventData);
      if (eventData.html) return eventData.html;
    }

    const classes = ['bw-datepicker__day'];
    if (!isCurrentMonth) classes.push('bw-datepicker__day--other-month');
    if (isToday) classes.push('bw-datepicker__day--today');
    if (isSelected) classes.push('bw-datepicker__day--selected');
    if (isDisabled) classes.push('bw-datepicker__day--disabled');
    if (isWeekend) classes.push('bw-datepicker__day--weekend');

    if (isDisabled) {
      return `<span class="${classes.join(
        ' '
      )}" role="gridcell" aria-disabled="true">${day}</span>`;
    }

    return `<button type="button" class="${classes.join(
      ' '
    )}" data-date="${dateStr}" data-action="select-date" role="gridcell" tabindex="-1">${day}</button>`;
  }

  /**
   * Check if date is disabled
   * @param {Date} date - Date to check
   * @param {Object} options - Picker options
   * @returns {boolean}
   */
  #isDateDisabled(date, options) {
    const { minDate, maxDate, disabledDates = [] } = options;

    if (minDate) {
      const min = minDate instanceof Date ? minDate : new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }

    if (maxDate) {
      const max = maxDate instanceof Date ? maxDate : new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (date > max) return true;
    }

    // Check disabled dates array
    if (disabledDates.length > 0) {
      const dateStr = toISO(date);
      return disabledDates.some((d) => {
        if (typeof d === 'string') return d === dateStr;
        if (d instanceof Date) return isSameDay(d, date);
        return false;
      });
    }

    return false;
  }
}

export default WeekView;
