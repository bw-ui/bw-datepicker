/**
 * ============================================================================
 * Black & White: UI Engineering
 * ModalMode - Centered Modal with Backdrop
 * ============================================================================
 *
 * Handles modal display mode with backdrop.
 *
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

export class ModalMode {
  #pickerElement;
  #backdropElement;
  #options;
  #onBackdropClick;
  #originalBodyOverflow;

  /**
   * @param {HTMLElement} pickerElement
   * @param {Object} options
   */
  constructor(pickerElement, options = {}) {
    this.#pickerElement = pickerElement;
    this.#options = {
      closeOnBackdropClick: true,
      lockScroll: true,
      zIndex: 2000,
      ...options,
    };
    this.#onBackdropClick = options.onBackdropClick || null;
  }

  /**
   * Initialize modal mode
   */
  init() {
    // Set modal-specific classes
    this.#pickerElement.classList.add('bw-datepicker--modal');
    this.#pickerElement.setAttribute('aria-modal', 'true');
    
    // Create backdrop
    this.#createBackdrop();
    
    // Append to body
    if (!this.#pickerElement.parentNode || this.#pickerElement.parentNode !== document.body) {
      document.body.appendChild(this.#pickerElement);
    }
  }

  /**
   * Create backdrop element
   */
  #createBackdrop() {
    this.#backdropElement = document.createElement('div');
    this.#backdropElement.className = 'bw-datepicker__backdrop';
    this.#backdropElement.setAttribute('hidden', '');
    this.#backdropElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: ${this.#options.zIndex - 1};
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    // Handle backdrop click
    if (this.#options.closeOnBackdropClick) {
      this.#backdropElement.addEventListener('click', (e) => {
        if (e.target === this.#backdropElement && this.#onBackdropClick) {
          this.#onBackdropClick();
        }
      });
    }

    document.body.appendChild(this.#backdropElement);
  }

  /**
   * Show the modal
   */
  show() {
    // Lock body scroll
    if (this.#options.lockScroll) {
      this.#originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    // Show backdrop
    this.#backdropElement.removeAttribute('hidden');
    requestAnimationFrame(() => {
      this.#backdropElement.style.opacity = '1';
    });

    // Show and center picker
    this.#pickerElement.removeAttribute('hidden');
    this.#pickerElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: ${this.#options.zIndex};
    `;
  }

  /**
   * Hide the modal
   */
  hide() {
    // Restore body scroll
    if (this.#options.lockScroll) {
      document.body.style.overflow = this.#originalBodyOverflow || '';
    }

    // Fade out backdrop
    this.#backdropElement.style.opacity = '0';
    setTimeout(() => {
      this.#backdropElement.setAttribute('hidden', '');
    }, 200);

    // Hide picker
    this.#pickerElement.setAttribute('hidden', '');
  }

  /**
   * Destroy modal mode
   */
  destroy() {
    this.hide();
    
    // Remove backdrop
    if (this.#backdropElement && this.#backdropElement.parentNode) {
      this.#backdropElement.parentNode.removeChild(this.#backdropElement);
    }
    
    this.#backdropElement = null;
    this.#pickerElement = null;
  }
}

export default ModalMode;
