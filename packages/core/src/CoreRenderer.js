/**
 * ============================================================================
 * Black & White: UI Engineering
 * CoreRenderer - Minimal Calendar Rendering with Hooks
 * ============================================================================
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

import { toISO, isSameDay, MONTH_NAMES, DAY_NAMES } from './date-utils.js';

export class CoreRenderer {
  #eventBus = null;

  setEventBus(eventBus) {
    this.#eventBus = eventBus;
  }

  #emit(event, data) {
    if (this.#eventBus) this.#eventBus.emit(event, data);
    return data;
  }

  render(data) {
    const { currentMonth, currentYear, selectedDate, weeks, options = {} } = data;

    const monthName = options.monthNames?.[currentMonth] || MONTH_NAMES[currentMonth];
    const dayNames = options.dayNames || DAY_NAMES;
    const firstDayOfWeek = options.firstDayOfWeek || 0;
    const orderedDayNames = [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];

    // Emit render:before
    const beforeData = this.#emit('render:before', { html: '', data });

    // Get each section (plugins can modify via events)
    const headerData = this.#emit('render:header', {
      month: currentMonth,
      year: currentYear,
      monthName,
      html: this.#renderHeader(monthName, currentYear)
    });

    const weekdaysData = this.#emit('render:weekdays', {
      dayNames: orderedDayNames,
      html: options.showWeekdays !== false ? this.#renderWeekdays(orderedDayNames) : ''
    });

    const calendarData = this.#emit('render:calendar', {
      weeks,
      selectedDate,
      currentMonth,
      html: this.#renderCalendar(weeks, selectedDate, currentMonth, options)
    });

    const footerData = this.#emit('render:footer', {
      html: options.showFooter !== false ? this.#renderFooter(options) : ''
    });

    const finalHtml = beforeData?.html || `
      <div class="bw-datepicker__container">
        ${headerData.html}
        ${weekdaysData.html}
        ${calendarData.html}
        ${footerData.html}
      </div>
    `;

    return finalHtml;
  }

  renderDay(dayData, selectedDate, currentMonth, options) {
    const { date, isDisabled, isCurrentMonth } = dayData;
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const dateStr = toISO(date);
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    const enrichedData = {
      ...dayData,
      dateISO: dateStr,
      day,
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      isToday,
      isSelected,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6
    };

    // Emit render:day - plugins can override html
    const dayRenderData = this.#emit('render:day', {
      dayData: enrichedData,
      html: null
    });

    // If plugin provided HTML, use it
    if (dayRenderData.html) return dayRenderData.html;

    // Default rendering
    const classes = ['bw-datepicker__day'];
    if (!isCurrentMonth) classes.push('bw-datepicker__day--other-month');
    if (isToday) classes.push('bw-datepicker__day--today');
    if (isSelected) classes.push('bw-datepicker__day--selected');
    if (isDisabled) classes.push('bw-datepicker__day--disabled');
    if (enrichedData.isWeekend) classes.push('bw-datepicker__day--weekend');

    const isClickable = !isDisabled && (isCurrentMonth || options.selectOtherMonths !== false);

    if (isClickable) {
      return `<button type="button" class="${classes.join(' ')}" data-date="${dateStr}" data-action="select-date" role="gridcell" tabindex="-1">${day}</button>`;
    }
    return `<span class="${classes.join(' ')}" role="gridcell" aria-disabled="true">${day}</span>`;
  }

  #renderHeader(monthName, year) {
    return `<div class="bw-datepicker__header">
      <button type="button" class="bw-datepicker__nav-btn" data-action="prev-year" aria-label="Previous year">«</button>
      <button type="button" class="bw-datepicker__nav-btn" data-action="prev-month" aria-label="Previous month">‹</button>
      <div class="bw-datepicker__title"><span class="bw-datepicker__month">${monthName}</span> <span class="bw-datepicker__year">${year}</span></div>
      <button type="button" class="bw-datepicker__nav-btn" data-action="next-month" aria-label="Next month">›</button>
      <button type="button" class="bw-datepicker__nav-btn" data-action="next-year" aria-label="Next year">»</button>
    </div>`;
  }

  #renderWeekdays(dayNames) {
    return `<div class="bw-datepicker__weekdays">${dayNames.map(n => `<div class="bw-datepicker__weekday">${n}</div>`).join('')}</div>`;
  }

  #renderCalendar(weeks, selectedDate, currentMonth, options) {
    const rows = weeks.map(week => {
      const cells = week.map(dayData => this.renderDay(dayData, selectedDate, currentMonth, options)).join('');
      return `<div class="bw-datepicker__week" role="row">${cells}</div>`;
    }).join('');
    return `<div class="bw-datepicker__calendar" role="grid">${rows}</div>`;
  }

  #renderFooter(options) {
    const showToday = options.showTodayButton !== false;
    const showClear = options.showClearButton !== false;
    if (!showToday && !showClear) return '';
    return `<div class="bw-datepicker__footer">
      ${showToday ? '<button type="button" class="bw-datepicker__btn" data-action="today">Today</button>' : ''}
      ${showClear ? '<button type="button" class="bw-datepicker__btn" data-action="clear">Clear</button>' : ''}
    </div>`;
  }
}

export default CoreRenderer;
