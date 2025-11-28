/**
 * ============================================================================
 * Black & White UI – Engineered with Precision
 * CSS Variables: Programmatic Variable Management
 * ============================================================================
 *
 * Get and set CSS custom properties programmatically
 * Provides convenient API for reading and writing CSS variables
 * Supports both element-scoped and document-wide variables
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * @class CSSVariables
 * @description Programmatic CSS custom property management
 */
export class CSSVariables {
  /**
   * @private
   * @type {HTMLElement}
   */
  #element;

  /**
   * @private
   * @type {Map<string, string>}
   */
  #cache = new Map();

  /**
   * @private
   * @type {boolean}
   */
  #useCache = true;

  /**
   * Initialize CSS variables manager
   * @param {HTMLElement} [element=document.documentElement] - Target element
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.cache=true] - Enable variable caching
   */
  constructor(element = document.documentElement, options = {}) {
    this.#element = element;
    this.#useCache = options.cache !== false;
  }

  /**
   * Get CSS variable value
   * @param {string} name - Variable name (with or without --)
   * @param {boolean} [fresh=false] - Skip cache and get fresh value
   * @returns {string} Variable value (empty string if not found)
   */
  get(name, fresh = false) {
    const varName = this.#normalizeVarName(name);

    // Return cached value if available and not requesting fresh
    if (!fresh && this.#useCache && this.#cache.has(varName)) {
      return this.#cache.get(varName);
    }

    // Get computed value
    const value = this.#getComputedValue(varName);

    // Cache the value
    if (this.#useCache) {
      this.#cache.set(varName, value);
    }

    return value;
  }

  /**
   * Set CSS variable value
   * @param {string} name - Variable name (with or without --)
   * @param {string} value - Variable value
   */
  set(name, value) {
    const varName = this.#normalizeVarName(name);
    this.#element.style.setProperty(varName, value);

    // Update cache
    if (this.#useCache) {
      this.#cache.set(varName, value);
    }
  }

  /**
   * Set multiple CSS variables at once
   * @param {Object} variables - Key-value pairs of variables
   */
  setMultiple(variables) {
    Object.entries(variables).forEach(([name, value]) => {
      this.set(name, value);
    });
  }

  /**
   * Remove CSS variable
   * @param {string} name - Variable name (with or without --)
   */
  remove(name) {
    const varName = this.#normalizeVarName(name);
    this.#element.style.removeProperty(varName);

    // Remove from cache
    if (this.#useCache) {
      this.#cache.delete(varName);
    }
  }

  /**
   * Check if CSS variable exists
   * @param {string} name - Variable name (with or without --)
   * @returns {boolean} True if variable exists
   */
  has(name) {
    const value = this.get(name);
    return value !== '';
  }

  /**
   * Get all CSS variables from the element
   * @param {string} [prefix] - Optional prefix filter (e.g., '--bw-')
   * @returns {Object} Object with variable names as keys and values
   */
  getAll(prefix = '') {
    const styles = getComputedStyle(this.#element);
    const variables = {};

    // Iterate through all properties
    for (let i = 0; i < styles.length; i++) {
      const name = styles[i];

      // Filter by prefix if provided
      if (name.startsWith('--') && (!prefix || name.startsWith(prefix))) {
        variables[name] = styles.getPropertyValue(name).trim();
      }
    }

    return variables;
  }

  /**
   * Get all BW DatePicker variables (--bw- prefix)
   * @returns {Object} Object with variable names as keys and values
   */
  getBWVariables() {
    return this.getAll('--bw-');
  }

  /**
   * Clear the variable cache
   */
  clearCache() {
    this.#cache.clear();
  }

  /**
   * Change target element
   * @param {HTMLElement} element - New target element
   */
  setElement(element) {
    this.#element = element;
    this.clearCache();
  }

  /**
   * Get target element
   * @returns {HTMLElement} Target element
   */
  getElement() {
    return this.#element;
  }

  /**
   * Export current variables as object
   * @param {string} [prefix='--bw-'] - Variable prefix to export
   * @returns {Object} Variables object
   */
  export(prefix = '--bw-') {
    return this.getAll(prefix);
  }

  /**
   * Import variables from object
   * @param {Object} variables - Variables to import
   * @param {boolean} [clear=false] - Clear existing variables first
   */
  import(variables, clear = false) {
    if (clear) {
      const existing = this.getAll('--bw-');
      Object.keys(existing).forEach((name) => {
        this.remove(name);
      });
    }

    this.setMultiple(variables);
  }

  /**
   * Normalize variable name to ensure -- prefix
   * @private
   * @param {string} name - Variable name
   * @returns {string} Normalized name with -- prefix
   */
  #normalizeVarName(name) {
    return name.startsWith('--') ? name : `--${name}`;
  }

  /**
   * Get computed CSS variable value
   * @private
   * @param {string} varName - Variable name (must have -- prefix)
   * @returns {string} Computed value (trimmed)
   */
  #getComputedValue(varName) {
    const styles = getComputedStyle(this.#element);
    return styles.getPropertyValue(varName).trim();
  }
}
