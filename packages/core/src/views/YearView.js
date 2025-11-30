/**
 * ============================================================================
 * Black & White: UI Engineering
 * YearView - Years Grid View
 * ============================================================================
 *
 * Renders a 4x3 grid of years (12 years at a time).
 * User clicks year → viewMode changes to 'month' with that year.
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

export class YearView {
  /**
   * Render years grid
   * @param {Object} data - Render data
   * @returns {string} HTML
   */
  render(data) {
    const { currentYear, selectedDate, options = {} } = data;

    // Check selected date's year
    const selectedYear = selectedDate ? selectedDate.getFullYear() : -1;

    // Show 12 years centered around current year
    // Range: currentYear - 4 to currentYear + 7 (12 total)
    const startYear = currentYear - 4;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    const cells = years
      .map((year) => {
        const isCurrent = year === currentYear;
        const isSelected = year === selectedYear;
        const isDisabled = this.#isYearDisabled(year, options);

        const classes = ['bw-datepicker__year-cell'];
        if (isCurrent) classes.push('bw-datepicker__year-cell--current');
        if (isSelected) classes.push('bw-datepicker__year-cell--selected');
        if (isDisabled) classes.push('bw-datepicker__year-cell--disabled');

        if (isDisabled) {
          return `<span class="${classes.join(
            ' '
          )}" aria-disabled="true">${year}</span>`;
        }

        return `<button type="button" class="${classes.join(
          ' '
        )}" data-action="select-year" data-year="${year}" tabindex="-1">${year}</button>`;
      })
      .join('');

    return `
      <div class="bw-datepicker__years bw-datepicker__view--year" role="grid">
        ${cells}
      </div>
    `;
  }

  /**
   * Get the year range being displayed
   * @param {number} currentYear - Current year
   * @returns {Object} { start, end }
   */
  getYearRange(currentYear) {
    const startYear = currentYear - 4;
    return {
      start: startYear,
      end: startYear + 11,
    };
  }

  /**
   * Check if year is disabled (based on min/max)
   * @param {number} year - Year
   * @param {Object} options - Picker options
   * @returns {boolean}
   */
  #isYearDisabled(year, options) {
    const { minDate, maxDate } = options;

    if (minDate) {
      const min = minDate instanceof Date ? minDate : new Date(minDate);
      // Last day of year
      const lastDayOfYear = new Date(year, 11, 31);
      if (lastDayOfYear < min) return true;
    }

    if (maxDate) {
      const max = maxDate instanceof Date ? maxDate : new Date(maxDate);
      // First day of year
      const firstDayOfYear = new Date(year, 0, 1);
      if (firstDayOfYear > max) return true;
    }

    return false;
  }
}

export default YearView;
