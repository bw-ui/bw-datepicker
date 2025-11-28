/**
 * ============================================================================
 * Black & White UI – Engineered with Precision
 * Dark Mode: System Preference Detection
 * ============================================================================
 *
 * Detects and monitors system dark mode preference
 * Provides event-driven updates when system preference changes
 * Respects user's operating system theme settings
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * @class DarkMode
 * @description System dark mode preference detector with change notifications
 */
export class DarkMode {
  /**
   * @private
   * @type {MediaQueryList|null}
   */
  #mediaQuery = null;

  /**
   * @private
   * @type {Map<string, Function>}
   */
  #listeners = new Map();

  /**
   * @private
   * @type {Function|null}
   */
  #boundHandler = null;

  /**
   * Initialize dark mode detector
   */
  constructor() {
    this.#initialize();
  }

  /**
   * Check if dark mode is preferred
   * @returns {boolean} True if dark mode is preferred
   */
  isDark() {
    if (!this.#mediaQuery) {
      return false;
    }
    return this.#mediaQuery.matches;
  }

  /**
   * Check if light mode is preferred
   * @returns {boolean} True if light mode is preferred
   */
  isLight() {
    return !this.isDark();
  }

  /**
   * Get current color scheme preference
   * @returns {string} 'dark' or 'light'
   */
  getPreference() {
    return this.isDark() ? 'dark' : 'light';
  }

  /**
   * Listen to dark mode preference changes
   * @param {Function} callback - Callback function (isDark: boolean) => void
   * @returns {Function} Unsubscribe function
   */
  onChange(callback) {
    const id = `listener-${Date.now()}-${Math.random()}`;
    this.#listeners.set(id, callback);

    // Return unsubscribe function
    return () => {
      this.#listeners.delete(id);
    };
  }

  /**
   * Check if browser supports dark mode detection
   * @returns {boolean} True if supported
   */
  isSupported() {
    return this.#mediaQuery !== null;
  }

  /**
   * Destroy dark mode detector and cleanup
   */
  destroy() {
    if (this.#mediaQuery && this.#boundHandler) {
      // Modern browsers
      if (this.#mediaQuery.removeEventListener) {
        this.#mediaQuery.removeEventListener('change', this.#boundHandler);
      }
      // Legacy browsers
      else if (this.#mediaQuery.removeListener) {
        this.#mediaQuery.removeListener(this.#boundHandler);
      }
    }

    this.#listeners.clear();
    this.#mediaQuery = null;
    this.#boundHandler = null;
  }

  /**
   * Initialize media query and event listeners
   * @private
   */
  #initialize() {
    // Check for matchMedia support
    if (!window.matchMedia) {
      console.warn('matchMedia not supported, dark mode detection unavailable');
      return;
    }

    try {
      this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.#boundHandler = this.#handleChange.bind(this);

      // Modern browsers use addEventListener
      if (this.#mediaQuery.addEventListener) {
        this.#mediaQuery.addEventListener('change', this.#boundHandler);
      }
      // Legacy browsers use addListener
      else if (this.#mediaQuery.addListener) {
        this.#mediaQuery.addListener(this.#boundHandler);
      }
    } catch (error) {
      console.warn('Failed to initialize dark mode detection:', error);
      this.#mediaQuery = null;
    }
  }

  /**
   * Handle media query change
   * @private
   * @param {MediaQueryListEvent} event - Media query change event
   */
  #handleChange(event) {
    const isDark = event.matches;
    this.#notifyListeners(isDark);
  }

  /**
   * Notify all listeners of preference change
   * @private
   * @param {boolean} isDark - Whether dark mode is active
   */
  #notifyListeners(isDark) {
    this.#listeners.forEach((callback) => {
      try {
        callback(isDark);
      } catch (error) {
        console.error('Dark mode listener error:', error);
      }
    });
  }
}
