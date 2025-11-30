/**
 * DayRenderer
 * Injects content and classes into day cells
 */

export class DayRenderer {
  #dataManager;
  #options;

  constructor(dataManager, options = {}) {
    this.#dataManager = dataManager;
    this.#options = {
      renderDay: null,
      dayClass: null,
      dataAttribute: 'data-bw-data',
      contentClass: 'bw-day-data',
      ...options,
    };
  }

  /**
   * Render data into day cells
   * @param {HTMLElement} calendarEl
   */
  render(calendarEl) {
    if (!calendarEl) return;

    const dayCells = calendarEl.querySelectorAll('[data-date]');

    dayCells.forEach((cell) => {
      const dateKey = cell.getAttribute('data-date');
      if (!dateKey) return;

      const data = this.#dataManager.get(dateKey);
      this.#renderCell(cell, dateKey, data);
    });
  }

  /**
   * Render single cell
   */
  #renderCell(cell, dateKey, data) {
    // Remove previous data content
    const existingContent = cell.querySelector(
      `.${this.#options.contentClass}`
    );
    if (existingContent) {
      existingContent.remove();
    }

    // Remove previous data classes
    this.#removeDataClasses(cell);

    if (!data) {
      cell.removeAttribute(this.#options.dataAttribute);
      return;
    }

    // Set data attribute
    cell.setAttribute(this.#options.dataAttribute, JSON.stringify(data));

    // Add custom class
    if (this.#options.dayClass) {
      const customClass = this.#options.dayClass(dateKey, data);
      if (customClass) {
        const classes = customClass.split(' ').filter(Boolean);
        classes.forEach((cls) => {
          cell.classList.add(cls);
          cell.setAttribute('data-bw-data-class', customClass);
        });
      }
    }

    // Render custom content
    if (this.#options.renderDay) {
      const content = this.#options.renderDay(dateKey, data);
      if (content) {
        const wrapper = document.createElement('div');
        wrapper.className = this.#options.contentClass;
        wrapper.innerHTML = content;
        cell.appendChild(wrapper);
      }
    }
  }

  /**
   * Remove data classes from cell
   */
  #removeDataClasses(cell) {
    const prevClasses = cell.getAttribute('data-bw-data-class');
    if (prevClasses) {
      prevClasses.split(' ').forEach((cls) => {
        if (cls) cell.classList.remove(cls);
      });
      cell.removeAttribute('data-bw-data-class');
    }
  }

  /**
   * Update options
   */
  setOptions(options) {
    Object.assign(this.#options, options);
  }

  /**
   * Destroy renderer
   */
  destroy() {
    this.#dataManager = null;
  }
}

export default DayRenderer;
