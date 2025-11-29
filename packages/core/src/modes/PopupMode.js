/**
 * ============================================================================
 * Black & White: UI Engineering
 * PopupMode - Basic Popup Setup
 * ============================================================================
 *
 * Handles popup setup only. Positioning is handled by positioning plugin.
 *
 * @version 0.3.0
 * @license MIT
 * ============================================================================
 */

export class PopupMode {
  #pickerElement;
  #inputElement;
  #options;

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
      ...options,
    };
  }

  /**
   * Initialize popup mode
   */
  init() {
    this.#pickerElement.classList.add('bw-datepicker--popup');

    if (
      !this.#pickerElement.parentNode ||
      this.#pickerElement.parentNode !== document.body
    ) {
      document.body.appendChild(this.#pickerElement);
    }
  }

  /**
   * Position - no-op, handled by positioning plugin
   */
  position() {
    // Positioning handled by @bw-ui/datepicker-positioning plugin
  }

  /**
   * Show the picker
   */
  show() {
    this.#pickerElement.removeAttribute('hidden');
    this.#pickerElement.style.display = '';
  }

  /**
   * Hide the picker
   */
  hide() {
    this.#pickerElement.setAttribute('hidden', '');
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
