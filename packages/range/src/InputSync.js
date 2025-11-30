/**
 * InputSync
 * Syncs range with input elements
 */

export class InputSync {
  #startInput = null;
  #endInput = null;
  #mainInput = null;
  #options;

  constructor(options = {}) {
    this.#options = {
      format: 'YYYY-MM-DD',
      startPlaceholder: 'Start date',
      endPlaceholder: 'End date',
      rangeSeparator: ' → ',
      ...options,
    };
  }

  /**
   * Initialize with input elements
   * @param {HTMLElement|string} startInput
   * @param {HTMLElement|string} endInput
   * @param {HTMLElement|string} mainInput - Optional main input for combined display
   */
  init(startInput, endInput, mainInput = null) {
    this.#startInput = this.#getElement(startInput);
    this.#endInput = this.#getElement(endInput);
    this.#mainInput = this.#getElement(mainInput);

    if (this.#startInput && !this.#startInput.placeholder) {
      this.#startInput.placeholder = this.#options.startPlaceholder;
    }
    if (this.#endInput && !this.#endInput.placeholder) {
      this.#endInput.placeholder = this.#options.endPlaceholder;
    }
  }

  /**
   * Set main input element
   * @param {HTMLElement|string} mainInput
   */
  setMainInput(mainInput) {
    this.#mainInput = this.#getElement(mainInput);
  }

  /**
   * Update input values
   * @param {Date|null} startDate
   * @param {Date|null} endDate
   */
  update(startDate, endDate) {
    // Update separate inputs if provided
    if (this.#startInput) {
      this.#startInput.value = startDate ? this.#formatDate(startDate) : '';
    }
    if (this.#endInput) {
      this.#endInput.value = endDate ? this.#formatDate(endDate) : '';
    }

    // Update main input with combined range
    if (this.#mainInput) {
      if (startDate && endDate) {
        this.#mainInput.value = `${this.#formatDate(startDate)}${
          this.#options.rangeSeparator
        }${this.#formatDate(endDate)}`;
      } else if (startDate) {
        this.#mainInput.value = `${this.#formatDate(startDate)}${
          this.#options.rangeSeparator
        }`;
      } else {
        this.#mainInput.value = '';
      }
    }
  }

  /**
   * Get start input element
   */
  getStartInput() {
    return this.#startInput;
  }

  /**
   * Get end input element
   */
  getEndInput() {
    return this.#endInput;
  }

  /**
   * Get main input element
   */
  getMainInput() {
    return this.#mainInput;
  }

  /**
   * Clear inputs
   */
  clear() {
    if (this.#startInput) this.#startInput.value = '';
    if (this.#endInput) this.#endInput.value = '';
    if (this.#mainInput) this.#mainInput.value = '';
  }

  /**
   * Format date to string
   */
  #formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return this.#options.format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Get element from selector or element
   */
  #getElement(el) {
    if (!el) return null;
    if (typeof el === 'string') {
      return document.querySelector(el);
    }
    return el;
  }

  /**
   * Destroy
   */
  destroy() {
    this.#startInput = null;
    this.#endInput = null;
    this.#mainInput = null;
  }
}

export default InputSync;
