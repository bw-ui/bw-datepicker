/**
 * ============================================================================
 * Black & White: UI Engineering
 * MonthView - Months Grid View
 * ============================================================================
 *
 * Renders a 4x3 grid of months for quick month selection.
 * User clicks month → viewMode changes to 'calendar' with that month.
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

import { MONTH_NAMES } from '../date-utils.js';

export class MonthView {
  /**
   * Render months grid
   * @param {Object} data - Render data
   * @returns {string} HTML
   */
  render(data) {
    const { currentMonth, currentYear, selectedDate, options = {} } = data;
    const monthNames = options.monthNames || MONTH_NAMES;

    // Check if selected date is in current year
    const selectedMonth = selectedDate ? selectedDate.getMonth() : -1;
    const selectedYear = selectedDate ? selectedDate.getFullYear() : -1;
    const isSelectedYear = selectedYear === currentYear;

    // Short month names (3 letters)
    const shortMonths = monthNames.map((m) => m.substring(0, 3));

    const cells = shortMonths
      .map((name, index) => {
        const isCurrent = index === currentMonth;
        const isSelected = isSelectedYear && index === selectedMonth;
        const isDisabled = this.#isMonthDisabled(index, currentYear, options);

        const classes = ['bw-datepicker__month-cell'];
        if (isCurrent) classes.push('bw-datepicker__month-cell--current');
        if (isSelected) classes.push('bw-datepicker__month-cell--selected');
        if (isDisabled) classes.push('bw-datepicker__month-cell--disabled');

        if (isDisabled) {
          return `<span class="${classes.join(
            ' '
          )}" aria-disabled="true">${name}</span>`;
        }

        return `<button type="button" class="${classes.join(
          ' '
        )}" data-action="select-month" data-month="${index}" tabindex="-1">${name}</button>`;
      })
      .join('');

    return `
      <div class="bw-datepicker__months bw-datepicker__view--month" role="grid">
        ${cells}
      </div>
    `;
  }

  /**
   * Check if month is disabled (based on min/max)
   * @param {number} month - Month index
   * @param {number} year - Year
   * @param {Object} options - Picker options
   * @returns {boolean}
   */
  #isMonthDisabled(month, year, options) {
    const { minDate, maxDate } = options;

    if (minDate) {
      const min = minDate instanceof Date ? minDate : new Date(minDate);
      // Last day of month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      if (lastDayOfMonth < min) return true;
    }

    if (maxDate) {
      const max = maxDate instanceof Date ? maxDate : new Date(maxDate);
      // First day of month
      const firstDayOfMonth = new Date(year, month, 1);
      if (firstDayOfMonth > max) return true;
    }

    return false;
  }
}

export default MonthView;
