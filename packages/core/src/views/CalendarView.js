/**
 * ============================================================================
 * Black & White: UI Engineering
 * CalendarView - Days Grid View (Default)
 * ============================================================================
 *
 * Renders the standard calendar days grid.
 * Emits render:day for each day cell (plugins can customize).
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

import { toISO, isSameDay, DAY_NAMES } from '../date-utils.js';

export class CalendarView {
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
   * Render calendar grid
   * @param {Object} data - Render data (weeks, selectedDate, currentMonth, options)
   * @returns {string} HTML
   */
  render(data) {
    const { weeks, selectedDate, currentMonth, options = {} } = data;

    const weekdaysHtml = this.renderWeekdays(options);

    const rows = weeks
      .map((week) => {
        const cells = week
          .map((dayData) =>
            this.renderDay(dayData, selectedDate, currentMonth, options)
          )
          .join('');
        return `<div class="bw-datepicker__week" role="row">${cells}</div>`;
      })
      .join('');

    return `
      ${weekdaysHtml}
      <div class="bw-datepicker__calendar bw-datepicker__view--calendar" role="grid">
        ${rows}
      </div>
    `;
  }

  /**
   * Render single day cell
   * @param {Object} dayData - Day data
   * @param {Date|null} selectedDate - Currently selected date
   * @param {number} currentMonth - Current month
   * @param {Object} options - Picker options
   * @returns {string} HTML
   */
  renderDay(dayData, selectedDate, currentMonth, options) {
    const { date, isDisabled, isCurrentMonth } = dayData;

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

    // Enriched data for plugins
    const enrichedData = {
      ...dayData,
      dateISO: dateStr,
      day,
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      isToday,
      isSelected,
      isWeekend,
    };

    // Emit render:day - plugins can provide custom HTML
    if (this.#eventBus) {
      const eventData = { dayData: enrichedData, html: null };
      this.#eventBus.emit('render:day', eventData);
      if (eventData.html) return eventData.html;
    }

    // Default rendering
    const classes = ['bw-datepicker__day'];
    if (!isCurrentMonth) classes.push('bw-datepicker__day--other-month');
    if (isToday) classes.push('bw-datepicker__day--today');
    if (isSelected) classes.push('bw-datepicker__day--selected');
    if (isDisabled) classes.push('bw-datepicker__day--disabled');
    if (isWeekend) classes.push('bw-datepicker__day--weekend');

    const isClickable =
      !isDisabled && (isCurrentMonth || options.selectOtherMonths !== false);

    if (isClickable) {
      return `<button type="button" class="${classes.join(
        ' '
      )}" data-date="${dateStr}" data-action="select-date" role="gridcell" tabindex="-1">${day}</button>`;
    }
    return `<span class="${classes.join(
      ' '
    )}" role="gridcell" aria-disabled="true">${day}</span>`;
  }
}

export default CalendarView;
