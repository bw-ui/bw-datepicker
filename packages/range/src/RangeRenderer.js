/**
 * RangeRenderer
 * Renders range highlight classes on day cells
 */

export class RangeRenderer {
  #rangeManager;
  #options;
  #hoverDate = null;

  constructor(rangeManager, options = {}) {
    this.#rangeManager = rangeManager;
    this.#options = {
      highlightRange: true,
      startClass: 'bw-range-start',
      endClass: 'bw-range-end',
      inRangeClass: 'bw-range-in',
      hoverClass: 'bw-range-hover',
      ...options,
    };
  }

  /**
   * Apply range classes to calendar
   * @param {HTMLElement} pickerEl
   */
  render(pickerEl) {
    if (!pickerEl) return;

    const dayCells = pickerEl.querySelectorAll('[data-date]');
    const { startDate, endDate } = this.#rangeManager.getRange();
    const selecting = this.#rangeManager.getSelecting();

    dayCells.forEach((cell) => {
      const dateStr = cell.getAttribute('data-date');
      const date = this.#parseDate(dateStr);
      if (!date) return;

      // Remove previous classes
      cell.classList.remove(
        this.#options.startClass,
        this.#options.endClass,
        this.#options.inRangeClass,
        this.#options.hoverClass
      );

      // Start date
      if (startDate && this.#isSameDay(date, startDate)) {
        cell.classList.add(this.#options.startClass);
      }

      // End date
      if (endDate && this.#isSameDay(date, endDate)) {
        cell.classList.add(this.#options.endClass);
      }

      // In range
      if (this.#options.highlightRange && startDate && endDate) {
        if (
          this.#rangeManager.isInRange(date) &&
          !this.#isSameDay(date, startDate) &&
          !this.#isSameDay(date, endDate)
        ) {
          cell.classList.add(this.#options.inRangeClass);
        }
      }

      // Hover preview (when selecting end date)
      if (selecting === 'end' && startDate && this.#hoverDate) {
        if (this.#isInHoverRange(date, startDate, this.#hoverDate)) {
          cell.classList.add(this.#options.hoverClass);
        }
      }
    });
  }

  /**
   * Set hover date for preview
   * @param {Date|null} date
   */
  setHoverDate(date) {
    this.#hoverDate = date;
  }

  /**
   * Get hover date
   */
  getHoverDate() {
    return this.#hoverDate;
  }

  /**
   * Check if date is in hover range
   */
  #isInHoverRange(date, start, hover) {
    if (!start || !hover) return false;

    const dateTime = date.getTime();
    const startTime = start.getTime();
    const hoverTime = hover.getTime();

    if (hoverTime >= startTime) {
      return dateTime > startTime && dateTime <= hoverTime;
    } else {
      return dateTime >= hoverTime && dateTime < startTime;
    }
  }

  /**
   * Parse date string (YYYY-MM-DD)
   */
  #parseDate(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Check if same day
   */
  #isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Destroy
   */
  destroy() {
    this.#rangeManager = null;
    this.#hoverDate = null;
  }
}

export default RangeRenderer;
