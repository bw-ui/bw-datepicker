/**
 * MultiDateRenderer
 * Renders selected date highlights on day cells
 *
 * @version 1.1.0
 * @license MIT
 */

export class MultiDateRenderer {
  #multiDateManager;
  #options;

  constructor(multiDateManager, options = {}) {
    this.#multiDateManager = multiDateManager;
    this.#options = {
      selectedClass: 'bw-multidate-selected',
      ...options,
    };
  }

  /**
   * Apply selected classes to calendar
   * @param {HTMLElement} pickerEl
   */
  render(pickerEl) {
    if (!pickerEl) return;

    const dayCells = pickerEl.querySelectorAll('[data-date]');

    dayCells.forEach((cell) => {
      const dateStr = cell.getAttribute('data-date');
      const date = this.#parseDate(dateStr);
      if (!date) return;

      // Remove previous class
      cell.classList.remove(this.#options.selectedClass);

      // Add class if selected
      if (this.#multiDateManager.isSelected(date)) {
        cell.classList.add(this.#options.selectedClass);
      }
    });
  }

  /**
   * Clear all rendering
   * @param {HTMLElement} pickerEl
   */
  clear(pickerEl) {
    if (!pickerEl) return;

    const dayCells = pickerEl.querySelectorAll('[data-date]');
    dayCells.forEach((cell) => {
      cell.classList.remove(this.#options.selectedClass);
    });
  }

  /**
   * Parse date string (YYYY-MM-DD)
   * @param {string} dateStr
   * @returns {Date|null}
   */
  #parseDate(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Update options
   * @param {Object} options
   */
  setOptions(options) {
    Object.assign(this.#options, options);
  }

  /**
   * Destroy
   */
  destroy() {
    this.#multiDateManager = null;
  }
}

export default MultiDateRenderer;
