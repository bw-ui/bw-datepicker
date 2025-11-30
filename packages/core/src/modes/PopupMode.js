/**
 * ============================================================================
 * Black & White: UI Engineering
 * PopupMode - Basic Popup Positioning
 * ============================================================================
 *
 * Handles basic popup positioning without advanced features.
 * Advanced positioning (auto-flip, collision) is in bw-positioning plugin.
 *
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

export class PopupMode {
  #pickerElement;
  #inputElement;
  #options;
  #scrollHandler;
  #resizeHandler;

  /**
   * @param {HTMLElement} pickerElement
   * @param {HTMLElement} inputElement
   * @param {Object} options
   */
  constructor(pickerElement, inputElement, options = {}) {
    this.#pickerElement = pickerElement;
    this.#inputElement = inputElement;
    this.#options = {
      offset: { x: 0, y: 4 },
      placement: 'top', // bottom-start | bottom-end | top-start | top-end
      ...options,
    };
  }

  /**
   * Initialize popup mode
   */
  init() {
    // Set popup-specific classes
    this.#pickerElement.classList.add('bw-datepicker--popup');

    // Append to body for proper stacking
    if (
      !this.#pickerElement.parentNode ||
      this.#pickerElement.parentNode !== document.body
    ) {
      document.body.appendChild(this.#pickerElement);
    }
  }

  /**
   * Position the picker relative to input
   */
  position() {
    const inputRect = this.#inputElement.getBoundingClientRect();
    const { offset } = this.#options;

    this.#pickerElement.style.position = 'absolute';
    this.#pickerElement.style.left = `${
      inputRect.left + window.scrollX + offset.x
    }px`;
    this.#pickerElement.style.top = `${
      inputRect.bottom + window.scrollY + offset.y
    }px`;
  }

  /**
   * Show the picker
   */
  show() {
    this.#pickerElement.removeAttribute('hidden');
    this.#pickerElement.style.display = '';
    this.position();
  }

  /**
   * Hide the picker
   */
  hide() {
    this.#pickerElement.setAttribute('hidden', '');

    // Remove listeners
    if (this.#scrollHandler) {
      window.removeEventListener('scroll', this.#scrollHandler);
      this.#scrollHandler = null;
    }
    if (this.#resizeHandler) {
      window.removeEventListener('resize', this.#resizeHandler);
      this.#resizeHandler = null;
    }
  }

  /**
   * Destroy popup mode
   */
  destroy() {
    this.hide();
    this.#pickerElement = null;
    this.#inputElement = null;
  }
}

export default PopupMode;
