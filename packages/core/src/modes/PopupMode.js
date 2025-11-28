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
      placement: 'bottom-start', // bottom-start | bottom-end | top-start | top-end
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
    if (!this.#pickerElement.parentNode || this.#pickerElement.parentNode !== document.body) {
      document.body.appendChild(this.#pickerElement);
    }
  }

  /**
   * Position the picker relative to input
   */
  position() {
    const inputRect = this.#inputElement.getBoundingClientRect();
    const pickerRect = this.#pickerElement.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top, left;

    // Calculate position based on placement
    const placement = this.#options.placement;
    const offset = this.#options.offset;

    if (placement.startsWith('top')) {
      top = inputRect.top + scrollY - pickerRect.height - offset.y;
    } else {
      top = inputRect.bottom + scrollY + offset.y;
    }

    if (placement.endsWith('end')) {
      left = inputRect.right + scrollX - pickerRect.width + offset.x;
    } else {
      left = inputRect.left + scrollX + offset.x;
    }

    // Basic viewport boundary check
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prevent horizontal overflow
    if (left + pickerRect.width > viewportWidth + scrollX) {
      left = viewportWidth + scrollX - pickerRect.width - 8;
    }
    if (left < scrollX) {
      left = scrollX + 8;
    }

    // Flip to top if not enough space below
    if (top + pickerRect.height > viewportHeight + scrollY && placement.startsWith('bottom')) {
      const topPosition = inputRect.top + scrollY - pickerRect.height - offset.y;
      if (topPosition >= scrollY) {
        top = topPosition;
      }
    }

    // Apply position
    this.#pickerElement.style.position = 'absolute';
    this.#pickerElement.style.top = `${Math.max(0, top)}px`;
    this.#pickerElement.style.left = `${Math.max(0, left)}px`;
  }

  /**
   * Show the picker
   */
  show() {
    this.#pickerElement.removeAttribute('hidden');
    this.#pickerElement.style.display = '';
    
    // Position after showing (needs dimensions)
    requestAnimationFrame(() => {
      this.position();
    });

    // Add scroll/resize listeners for repositioning
    this.#scrollHandler = () => this.position();
    this.#resizeHandler = () => this.position();
    
    window.addEventListener('scroll', this.#scrollHandler, { passive: true });
    window.addEventListener('resize', this.#resizeHandler, { passive: true });
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
