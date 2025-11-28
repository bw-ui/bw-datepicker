/**
 * ============================================================================
 * Black & White: UI Engineering
 * InlineMode - Always Visible Inline Display
 * ============================================================================
 *
 * Handles inline display mode (always visible, no popup).
 *
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

export class InlineMode {
  #pickerElement;
  #inputElement;
  #containerElement;
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
      insertAfterInput: true,
      container: null, // Custom container selector
      ...options,
    };
  }

  /**
   * Initialize inline mode
   */
  init() {
    // Set inline-specific classes
    this.#pickerElement.classList.add('bw-datepicker--inline');
    
    // Remove dialog role for inline mode
    this.#pickerElement.removeAttribute('role');
    this.#pickerElement.removeAttribute('aria-modal');
    
    // Position in DOM
    if (this.#options.container) {
      // Use custom container
      this.#containerElement = typeof this.#options.container === 'string'
        ? document.querySelector(this.#options.container)
        : this.#options.container;
      
      if (this.#containerElement) {
        this.#containerElement.appendChild(this.#pickerElement);
      }
    } else if (this.#options.insertAfterInput && this.#inputElement) {
      // Insert after input element
      this.#inputElement.parentNode.insertBefore(
        this.#pickerElement,
        this.#inputElement.nextSibling
      );
    }

    // Set inline styles
    this.#pickerElement.style.position = 'relative';
    this.#pickerElement.style.display = 'block';
  }

  /**
   * Show the picker (inline is always visible, this just ensures it)
   */
  show() {
    this.#pickerElement.removeAttribute('hidden');
    this.#pickerElement.style.display = 'block';
  }

  /**
   * Hide is a no-op for inline mode (always visible)
   * But we provide it for API consistency
   */
  hide() {
    // Inline mode doesn't hide
    // This method exists for API consistency
  }

  /**
   * Destroy inline mode
   */
  destroy() {
    this.#pickerElement = null;
    this.#inputElement = null;
    this.#containerElement = null;
  }
}

export default InlineMode;
