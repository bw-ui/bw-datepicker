/**
 * ============================================================================
 * Black & White UI – Engineered with Precision
 * Style Injector: Dynamic CSS Injection
 * ============================================================================
 *
 * Dynamically inject CSS into the document
 * Manages style elements with unique IDs for easy removal
 * Provides utilities for injecting CSS variables and custom styles
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

/**
 * @class StyleInjector
 * @description Dynamic CSS injection and management
 */

const DATA_ATTRIBUTES = { THEME: 'data-bw-theme', INSTANCE: 'data-bw-instance' };

export class StyleInjector {
  /**
   * @private
   * @type {Map<string, HTMLStyleElement>}
   */
  #injectedStyles = new Map();

  /**
   * @private
   * @type {string}
   */
  #prefix = 'bw-injected-style';

  /**
   * @private
   * @type {number}
   */
  #counter = 0;

  /**
   * Initialize style injector
   * @param {Object} [options] - Configuration options
   * @param {string} [options.prefix='bw-injected-style'] - ID prefix for injected styles
   */
  constructor(options = {}) {
    this.#prefix = options.prefix || this.#prefix;
  }

  /**
   * Inject CSS into the document
   * @param {string} css - CSS string to inject
   * @param {string} [id] - Optional ID for the style element (auto-generated if not provided)
   * @returns {string} The ID of the injected style element
   */
  inject(css, id) {
    const styleId = id || this.#generateId();

    // Remove existing style with same ID if it exists
    if (this.#injectedStyles.has(styleId)) {
      this.remove(styleId);
    }

    // Create and inject style element
    const styleElement = this.#createStyleElement(styleId, css);
    this.#injectedStyles.set(styleId, styleElement);

    return styleId;
  }

  /**
   * Inject CSS variables as a stylesheet
   * @param {Object} variables - Key-value pairs of CSS variables
   * @param {string} [id] - Optional ID for the style element
   * @param {string} [selector=':root'] - CSS selector for variables
   * @returns {string} The ID of the injected style element
   */
  injectVariables(variables, id, selector = ':root') {
    const css = this.#variablesToCSS(variables, selector);
    return this.inject(css, id);
  }

  /**
   * Update existing injected CSS
   * @param {string} id - ID of the style element
   * @param {string} css - New CSS content
   * @returns {boolean} True if updated, false if not found
   */
  update(id, css) {
    const styleElement = this.#injectedStyles.get(id);

    if (!styleElement) {
      return false;
    }

    styleElement.textContent = css;
    return true;
  }

  /**
   * Update existing injected CSS variables
   * @param {string} id - ID of the style element
   * @param {Object} variables - New variables
   * @param {string} [selector=':root'] - CSS selector for variables
   * @returns {boolean} True if updated, false if not found
   */
  updateVariables(id, variables, selector = ':root') {
    const css = this.#variablesToCSS(variables, selector);
    return this.update(id, css);
  }

  /**
   * Remove injected CSS by ID
   * @param {string} id - ID of the style element to remove
   * @returns {boolean} True if removed, false if not found
   */
  remove(id) {
    const styleElement = this.#injectedStyles.get(id);

    if (!styleElement) {
      return false;
    }

    // Remove from DOM
    if (styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }

    // Remove from tracking
    this.#injectedStyles.delete(id);
    return true;
  }

  /**
   * Remove all injected styles
   */
  removeAll() {
    this.#injectedStyles.forEach((styleElement, id) => {
      this.remove(id);
    });
  }

  /**
   * Check if style with given ID exists
   * @param {string} id - ID to check
   * @returns {boolean} True if exists
   */
  has(id) {
    return this.#injectedStyles.has(id);
  }

  /**
   * Get style element by ID
   * @param {string} id - ID of the style element
   * @returns {HTMLStyleElement|null} Style element or null
   */
  get(id) {
    return this.#injectedStyles.get(id) || null;
  }

  /**
   * Get all injected style IDs
   * @returns {string[]} Array of style IDs
   */
  getIds() {
    return Array.from(this.#injectedStyles.keys());
  }

  /**
   * Get count of injected styles
   * @returns {number} Number of injected styles
   */
  count() {
    return this.#injectedStyles.size;
  }

  /**
   * Inject CSS for a specific component instance
   * @param {string} instanceId - Component instance ID
   * @param {string} css - CSS to inject (with placeholders)
   * @returns {string} The ID of the injected style element
   */
  injectForInstance(instanceId, css) {
    const id = `${this.#prefix}-instance-${instanceId}`;
    // Scope CSS to the instance
    const scopedCSS = this.#scopeCSS(css, `[data-bw-instance="${instanceId}"]`);
    return this.inject(scopedCSS, id);
  }

  /**
   * Clear all injected styles and reset
   */
  reset() {
    this.removeAll();
    this.#counter = 0;
  }

  /**
   * Create style element
   * @private
   * @param {string} id - Element ID
   * @param {string} css - CSS content
   * @returns {HTMLStyleElement} Created style element
   */
  #createStyleElement(id, css) {
    const style = document.createElement('style');
    style.id = id;
    // style.setAttribute('data-bw-injected', 'true');
    style.setAttribute(DATA_ATTRIBUTES.INJECTED, 'true');
    style.textContent = css;

    // Append to head
    document.head.appendChild(style);

    return style;
  }

  /**
   * Convert variables object to CSS string
   * @private
   * @param {Object} variables - Variables object
   * @param {string} selector - CSS selector
   * @returns {string} CSS string
   */
  #variablesToCSS(variables, selector) {
    const declarations = Object.entries(variables)
      .map(([name, value]) => {
        const varName = name.startsWith('--') ? name : `--${name}`;
        return `  ${varName}: ${value};`;
      })
      .join('\n');

    return `${selector} {\n${declarations}\n}`;
  }

  /**
   * Scope CSS to a specific selector
   * Production-ready implementation with proper CSS parsing
   * @private
   * @param {string} css - Original CSS
   * @param {string} scope - Scope selector
   * @returns {string} Scoped CSS
   */
  #scopeCSS(css, scope) {
    // Step 1: Remove CSS comments to prevent false matches
    let processed = css.replace(/\/\*[\s\S]*?\*\//g, '');

    // Step 2: Process all selectors
    processed = processed.replace(/([^{}]+)\{/g, (match, selectorGroup) => {
      const trimmed = selectorGroup.trim();

      // Skip @import, @charset, @namespace
      if (
        trimmed.startsWith('@import') ||
        trimmed.startsWith('@charset') ||
        trimmed.startsWith('@namespace')
      ) {
        return match;
      }

      // Skip @keyframes, @font-face, @page (don't scope their content)
      if (
        trimmed.startsWith('@keyframes') ||
        trimmed.startsWith('@-webkit-keyframes') ||
        trimmed.startsWith('@-moz-keyframes') ||
        trimmed.startsWith('@font-face') ||
        trimmed.startsWith('@page')
      ) {
        return match;
      }

      // Allow @media, @supports, @container, @layer (but keep the @rule itself)
      if (
        trimmed.startsWith('@media') ||
        trimmed.startsWith('@supports') ||
        trimmed.startsWith('@container') ||
        trimmed.startsWith('@layer')
      ) {
        return match; // Keep the @rule as-is, content will be processed recursively
      }

      // If it starts with @, we don't know what it is, skip it
      if (trimmed.startsWith('@')) {
        return match;
      }

      // Step 3: Split comma-separated selectors
      const selectors = trimmed.split(',').map((s) => s.trim());

      // Step 4: Scope each selector individually
      const scopedSelectors = selectors
        .map((selector) => {
          // Don't scope if already scoped
          if (selector.includes(scope)) {
            return selector;
          }

          // Don't scope global selectors
          if (
            selector === ':root' ||
            selector === 'html' ||
            selector === 'body' ||
            selector.startsWith('html ') ||
            selector.startsWith('body ') ||
            selector.startsWith('html:') ||
            selector.startsWith('body:')
          ) {
            return selector;
          }

          // Don't scope keyframe percentages
          if (
            /^\d+%$/.test(selector) ||
            selector === 'from' ||
            selector === 'to'
          ) {
            return selector;
          }

          // Add scope prefix
          return `${scope} ${selector}`;
        })
        .join(', ');

      return `${scopedSelectors} {`;
    });

    return processed;
  }

  /**
   * Generate unique ID
   * @private
   * @returns {string} Generated ID
   */
  #generateId() {
    this.#counter++;
    return `${this.#prefix}-${this.#counter}`;
  }
}
