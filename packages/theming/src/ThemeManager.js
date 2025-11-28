/**
 * ============================================================================
 * Black & White UI – Engineered with Precision
 * Theme Manager: Central Theme Orchestrator
 * ============================================================================
 *
 * Manages theme state, switching, and persistence
 * Coordinates with DarkMode, CSSVariables, and StyleInjector
 * Handles localStorage persistence and system preference detection
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

import { DarkMode } from './DarkMode.js';
import { CSSVariables } from './CSSVariables.js';
import { StyleInjector } from './StyleInjector.js';
const STORAGE_KEYS = { THEME: 'bw-datepicker-theme' };
const DATA_ATTRIBUTES = { THEME: 'data-bw-theme' };

/**
 * @class ThemeManager
 * @description Central theme management system with persistence and auto-detection
 */
export class ThemeManager {
  /**
   * @private
   * @type {string}
   */
  #currentTheme = 'auto';

  /**
   * @private
   * @type {DarkMode}
   */
  #darkMode;

  /**
   * @private
   * @type {CSSVariables}
   */
  #cssVariables;

  /**
   * @private
   * @type {StyleInjector}
   */
  #styleInjector;

  /**
   * @private
   * @type {HTMLElement}
   */
  #targetElement;

  /**
   * @private
   * @type {Map<string, Function>}
   */
  #listeners = new Map();

  /**
   * @private
   * @type {string}
   */
  // #storageKey = 'bw-datepicker-theme';
  #storageKey = STORAGE_KEYS.THEME;

  /**
   * Valid theme values
   * @private
   * @type {Set<string>}
   */
  #validThemes = new Set(['light', 'dark', 'auto']);

  /**
   * Initialize theme manager
   * @param {Object} options - Configuration options
   * @param {HTMLElement} [options.element=document.documentElement] - Target element for theme
   * @param {string} [options.defaultTheme='auto'] - Default theme ('light' | 'dark' | 'auto')
   * @param {boolean} [options.persist=true] - Persist theme to localStorage
   * @param {string} [options.storageKey='bw-datepicker-theme'] - localStorage key
   * @param {Object} [options.customVariables={}] - Custom CSS variables to inject
   */
  constructor(options = {}) {
    this.#targetElement = options.element || document.documentElement;
    this.#storageKey = options.storageKey || this.#storageKey;

    // Initialize modules
    this.#darkMode = new DarkMode();
    this.#cssVariables = new CSSVariables(this.#targetElement);
    this.#styleInjector = new StyleInjector();

    // Load persisted theme or use default
    if (options.persist !== false) {
      this.#currentTheme =
        this.#loadPersistedTheme() || options.defaultTheme || 'auto';
    } else {
      this.#currentTheme = options.defaultTheme || 'auto';
    }

    // Inject custom variables if provided
    if (
      options.customVariables &&
      Object.keys(options.customVariables).length > 0
    ) {
      this.#styleInjector.injectVariables(options.customVariables);
    }

    // Apply initial theme
    this.#applyTheme(this.#currentTheme);

    // Listen to system preference changes
    this.#darkMode.onChange((isDark) => {
      if (this.#currentTheme === 'auto') {
        this.#notifyListeners(isDark ? 'dark' : 'light');
      }
    });
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' | 'dark' | 'auto')
   */
  getTheme() {
    return this.#currentTheme;
  }

  /**
   * Get effective theme (resolves 'auto' to 'light' or 'dark')
   * @returns {string} Effective theme ('light' | 'dark')
   */
  getEffectiveTheme() {
    if (this.#currentTheme === 'auto') {
      return this.#darkMode.isDark() ? 'dark' : 'light';
    }
    return this.#currentTheme;
  }

  /**
   * Set theme
   * @param {string} theme - Theme to set ('light' | 'dark' | 'auto')
   * @param {boolean} [persist=true] - Persist to localStorage
   * @throws {Error} If invalid theme provided
   */
  setTheme(theme, persist = true) {
    if (!this.#validThemes.has(theme)) {
      throw new Error(
        `Invalid theme: ${theme}. Must be one of: ${Array.from(
          this.#validThemes
        ).join(', ')}`
      );
    }

    const oldTheme = this.#currentTheme;
    this.#currentTheme = theme;

    this.#applyTheme(theme);

    if (persist) {
      this.#persistTheme(theme);
    }

    // Notify listeners
    this.#notifyListeners(this.getEffectiveTheme(), oldTheme);
  }

  /**
   * Toggle between light and dark themes
   * @param {boolean} [persist=true] - Persist to localStorage
   */
  toggle(persist = true) {
    const currentEffective = this.getEffectiveTheme();
    const newTheme = currentEffective === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, persist);
  }

  /**
   * Check if dark mode is active
   * @returns {boolean} True if dark theme is active
   */
  isDark() {
    return this.getEffectiveTheme() === 'dark';
  }

  /**
   * Check if light mode is active
   * @returns {boolean} True if light theme is active
   */
  isLight() {
    return this.getEffectiveTheme() === 'light';
  }

  /**
   * Check if auto mode is enabled
   * @returns {boolean} True if theme is set to auto
   */
  isAuto() {
    return this.#currentTheme === 'auto';
  }

  /**
   * Get system preference for dark mode
   * @returns {boolean} True if system prefers dark mode
   */
  getSystemPreference() {
    return this.#darkMode.isDark();
  }

  /**
   * Get CSS variable value
   * @param {string} name - Variable name (with or without --)
   * @returns {string} Variable value
   */
  getVariable(name) {
    return this.#cssVariables.get(name);
  }

  /**
   * Set CSS variable value
   * @param {string} name - Variable name (with or without --)
   * @param {string} value - Variable value
   */
  setVariable(name, value) {
    this.#cssVariables.set(name, value);
  }

  /**
   * Set multiple CSS variables
   * @param {Object} variables - Key-value pairs of variables
   */
  setVariables(variables) {
    this.#cssVariables.setMultiple(variables);
  }

  /**
   * Inject custom CSS
   * @param {string} css - CSS string to inject
   * @param {string} [id] - Optional ID for the style element
   */
  injectCSS(css, id) {
    this.#styleInjector.inject(css, id);
  }

  /**
   * Inject CSS variables
   * @param {Object} variables - Key-value pairs of variables
   * @param {string} [id] - Optional ID for the style element
   */
  injectVariables(variables, id) {
    this.#styleInjector.injectVariables(variables, id);
  }

  /**
   * Remove injected CSS by ID
   * @param {string} id - Style element ID
   */
  removeCSS(id) {
    this.#styleInjector.remove(id);
  }

  /**
   * Listen to theme changes
   * @param {Function} callback - Callback function (newTheme, oldTheme) => void
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
   * Clear persisted theme from storage
   */
  clearStorage() {
    try {
      localStorage.removeItem(this.#storageKey);
    } catch (error) {
      console.warn('Failed to clear theme storage:', error);
    }
  }

  /**
   * Reset theme to default
   * @param {boolean} [persist=true] - Persist reset to localStorage
   */
  reset(persist = true) {
    this.setTheme('auto', persist);
  }

  /**
   * Destroy theme manager and cleanup
   */
  destroy() {
    this.#darkMode.destroy();
    this.#listeners.clear();
    this.#targetElement.removeAttribute('data-bw-theme');
  }

  /**
   * Apply theme to target element
   * @private
   * @param {string} theme - Theme to apply
   */
  #applyTheme(theme) {
    // this.#targetElement.setAttribute('data-bw-theme', theme);
    this.#targetElement.setAttribute(DATA_ATTRIBUTES.THEME, theme);
  }

  /**
   * Load persisted theme from localStorage
   * @private
   * @returns {string|null} Persisted theme or null
   */
  #loadPersistedTheme() {
    try {
      const stored = localStorage.getItem(this.#storageKey);
      if (stored && this.#validThemes.has(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to load persisted theme:', error);
    }
    return null;
  }

  /**
   * Persist theme to localStorage
   * @private
   * @param {string} theme - Theme to persist
   */
  #persistTheme(theme) {
    try {
      localStorage.setItem(this.#storageKey, theme);
    } catch (error) {
      console.warn('Failed to persist theme:', error);
    }
  }

  /**
   * Notify all listeners of theme change
   * @private
   * @param {string} newTheme - New theme
   * @param {string} [oldTheme] - Previous theme
   */
  #notifyListeners(newTheme, oldTheme) {
    this.#listeners.forEach((callback) => {
      try {
        callback(newTheme, oldTheme);
      } catch (error) {
        console.error('Theme change listener error:', error);
      }
    });
  }
}
