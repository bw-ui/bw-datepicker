/**
 * ============================================================================
 * Black & White UI – Engineered with Precision
 * Focus Trap - Focus Management
 * ============================================================================
 *
 * Traps focus within the datepicker modal
 * Handles Tab/Shift+Tab to cycle through focusable elements
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

export class FocusTrap {
  #container = null;
  #firstFocusable = null;
  #lastFocusable = null;
  #previousFocus = null;
  #isActive = false;
  #handleKeydown = null;

  /**
   * Activate focus trap
   * @param {HTMLElement} container - Container element to trap focus in
   */
  activate(container) {
    if (!container) return;

    this.#container = container;
    this.#isActive = true;

    // Store element that had focus before opening
    this.#previousFocus = document.activeElement;

    // Setup trap
    this.#updateFocusableElements();
    this.#attachListeners();
  }

  /**
   * Deactivate focus trap
   */
  deactivate() {
    if (!this.#isActive) return;

    this.#isActive = false;
    this.#detachListeners();

    // Restore focus to element that opened picker
    if (this.#previousFocus && this.#previousFocus.focus) {
      this.#previousFocus.focus();
    }

    this.#container = null;
    this.#firstFocusable = null;
    this.#lastFocusable = null;
    this.#previousFocus = null;
  }

  /**
   * Update list of focusable elements
   */
  #updateFocusableElements() {
    if (!this.#container) return;

    const focusableSelector = [
      'button:not(:disabled)',
      'a[href]',
      'input:not(:disabled)',
      'select:not(:disabled)',
      'textarea:not(:disabled)',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = Array.from(
      this.#container.querySelectorAll(focusableSelector)
    ).filter((el) => {
      // Filter out hidden elements
      return el.offsetParent !== null;
    });

    this.#firstFocusable = focusableElements[0];
    this.#lastFocusable = focusableElements[focusableElements.length - 1];
  }

  /**
   * Attach keyboard listeners
   */
  #attachListeners() {
    this.#handleKeydown = (e) => {
      if (e.key !== 'Tab') return;

      this.#updateFocusableElements();

      // Shift+Tab on first element -> go to last
      if (e.shiftKey && document.activeElement === this.#firstFocusable) {
        e.preventDefault();
        this.#lastFocusable?.focus();
      }
      // Tab on last element -> go to first
      else if (!e.shiftKey && document.activeElement === this.#lastFocusable) {
        e.preventDefault();
        this.#firstFocusable?.focus();
      }
    };

    document.addEventListener('keydown', this.#handleKeydown);
  }

  /**
   * Detach keyboard listeners
   */
  #detachListeners() {
    if (this.#handleKeydown) {
      document.removeEventListener('keydown', this.#handleKeydown);
      this.#handleKeydown = null;
    }
  }

  /**
   * Check if focus trap is active
   * @returns {boolean}
   */
  isActive() {
    return this.#isActive;
  }
}

export default FocusTrap;
