/**
 * HighContrast - High contrast mode detection and support
 * Part of Black & White UI DatePicker accessibility system
 */

export class HighContrast {
  constructor(pickerElement, config = {}) {
    this.pickerElement = pickerElement;
    this.config = {
      autoDetect: config.autoDetect !== false,
      applyStyles: config.applyStyles !== false,
      respectSystemPreference: config.respectSystemPreference !== false,
      onModeChange: config.onModeChange || null,
      ...config,
    };

    this.currentMode = null;
    this.mediaQueries = {};
    this.boundHandlers = {};

    if (this.config.autoDetect) {
      this.init();
    }
  }

  /**
   * Initialize high contrast detection
   */
  init() {
    // Detect current high contrast mode
    this.detectMode();

    // Set up media query listeners
    this.setupMediaQueryListeners();

    // Apply initial styles if needed
    if (this.config.applyStyles) {
      this.applyHighContrastStyles();
    }
  }

  /**
   * Detect high contrast mode
   * @returns {string|null} 'high-contrast-active', 'high-contrast-black-on-white', 'high-contrast-white-on-black', or null
   */
  detectMode() {
    // Check for Windows High Contrast Mode
    const isHighContrast = this.isWindowsHighContrast();

    if (isHighContrast) {
      // Detect which high contrast theme (black-on-white or white-on-black)
      const theme = this.detectHighContrastTheme();
      this.currentMode = theme;

      if (this.config.applyStyles) {
        this.pickerElement.setAttribute('data-high-contrast', theme);
      }

      return theme;
    }

    // Check for CSS media query support (newer method)
    if (this.supportsContrastMediaQuery()) {
      const preferredContrast = this.getPreferredContrast();

      if (preferredContrast === 'more' || preferredContrast === 'high') {
        this.currentMode = 'high-contrast-active';

        if (this.config.applyStyles) {
          this.pickerElement.setAttribute('data-high-contrast', 'active');
        }

        return 'high-contrast-active';
      }
    }

    this.currentMode = null;
    return null;
  }

  /**
   * Check if Windows High Contrast Mode is active
   * @returns {boolean}
   */
  isWindowsHighContrast() {
    // Method 1: Check for specific background image (Windows High Contrast indicator)
    const testDiv = document.createElement('div');
    testDiv.style.backgroundImage =
      'url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)';
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-9999px';
    document.body.appendChild(testDiv);

    const computedStyle = window.getComputedStyle(testDiv);
    const bgImage = computedStyle.backgroundImage;

    document.body.removeChild(testDiv);

    // In high contrast mode, background images are removed
    const isHighContrast = bgImage === 'none';

    // Method 2: Check media query if available
    if (window.matchMedia) {
      const highContrastQuery = window.matchMedia(
        '(-ms-high-contrast: active)'
      );
      if (highContrastQuery.matches) {
        return true;
      }
    }

    return isHighContrast;
  }

  /**
   * Detect high contrast theme (black-on-white or white-on-black)
   * @returns {string} 'high-contrast-black-on-white' or 'high-contrast-white-on-black'
   */
  detectHighContrastTheme() {
    // Create test element to check colors
    const testDiv = document.createElement('div');
    testDiv.style.color = 'rgb(0, 0, 0)';
    testDiv.style.backgroundColor = 'rgb(255, 255, 255)';
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-9999px';
    document.body.appendChild(testDiv);

    const computedStyle = window.getComputedStyle(testDiv);
    const textColor = computedStyle.color;
    const bgColor = computedStyle.backgroundColor;

    document.body.removeChild(testDiv);

    // Check if colors are inverted (indicating white-on-black theme)
    const isWhiteOnBlack =
      this.isLightColor(textColor) && this.isDarkColor(bgColor);

    // Check media query for specific themes
    if (window.matchMedia) {
      const blackOnWhite = window.matchMedia(
        '(-ms-high-contrast: black-on-white)'
      );
      const whiteOnBlack = window.matchMedia(
        '(-ms-high-contrast: white-on-black)'
      );

      if (blackOnWhite.matches) {
        return 'high-contrast-black-on-white';
      }
      if (whiteOnBlack.matches) {
        return 'high-contrast-white-on-black';
      }
    }

    return isWhiteOnBlack
      ? 'high-contrast-white-on-black'
      : 'high-contrast-black-on-white';
  }

  /**
   * Check if prefers-contrast media query is supported
   * @returns {boolean}
   */
  supportsContrastMediaQuery() {
    if (!window.matchMedia) return false;

    try {
      const query = window.matchMedia('(prefers-contrast)');
      return query.media === '(prefers-contrast)';
    } catch (e) {
      return false;
    }
  }

  /**
   * Get preferred contrast level from CSS media query
   * @returns {string|null} 'no-preference', 'more', 'less', 'high', or null
   */
  getPreferredContrast() {
    if (!window.matchMedia) return null;

    const queries = ['no-preference', 'more', 'less', 'high'];

    for (const value of queries) {
      const query = window.matchMedia(`(prefers-contrast: ${value})`);
      if (query.matches) {
        return value;
      }
    }

    return null;
  }

  /**
   * Set up media query listeners for changes
   */
  setupMediaQueryListeners() {
    if (!window.matchMedia) return;

    // Listen for high contrast mode changes (Windows)
    if (this.supportsHighContrastMediaQuery()) {
      this.mediaQueries.highContrast = window.matchMedia(
        '(-ms-high-contrast: active)'
      );
      this.boundHandlers.highContrast = this.handleModeChange.bind(this);
      this.mediaQueries.highContrast.addListener(
        this.boundHandlers.highContrast
      );
    }

    // Listen for contrast preference changes (CSS)
    if (this.supportsContrastMediaQuery()) {
      this.mediaQueries.prefersContrast = window.matchMedia(
        '(prefers-contrast: more)'
      );
      this.boundHandlers.prefersContrast = this.handleModeChange.bind(this);
      this.mediaQueries.prefersContrast.addListener(
        this.boundHandlers.prefersContrast
      );
    }
  }

  /**
   * Check if -ms-high-contrast media query is supported
   * @returns {boolean}
   */
  supportsHighContrastMediaQuery() {
    if (!window.matchMedia) return false;

    try {
      const query = window.matchMedia('(-ms-high-contrast: active)');
      return query.media === '(-ms-high-contrast: active)';
    } catch (e) {
      return false;
    }
  }

  /**
   * Handle mode change
   */
  handleModeChange() {
    const previousMode = this.currentMode;
    this.detectMode();

    if (this.config.applyStyles) {
      this.applyHighContrastStyles();
    }

    // Trigger callback if mode changed
    if (this.config.onModeChange && previousMode !== this.currentMode) {
      this.config.onModeChange(this.currentMode, previousMode);
    }
  }

  /**
   * Apply high contrast styles
   */
  applyHighContrastStyles() {
    if (!this.currentMode) {
      // Remove high contrast classes
      this.pickerElement.classList.remove(
        'bw-high-contrast',
        'bw-high-contrast-black-on-white',
        'bw-high-contrast-white-on-black'
      );
      this.pickerElement.removeAttribute('data-high-contrast');
      return;
    }

    // Add high contrast class
    this.pickerElement.classList.add('bw-high-contrast');

    // Add specific theme class
    if (this.currentMode === 'high-contrast-black-on-white') {
      this.pickerElement.classList.add('bw-high-contrast-black-on-white');
      this.pickerElement.classList.remove('bw-high-contrast-white-on-black');
    } else if (this.currentMode === 'high-contrast-white-on-black') {
      this.pickerElement.classList.add('bw-high-contrast-white-on-black');
      this.pickerElement.classList.remove('bw-high-contrast-black-on-white');
    }
  }

  /**
   * Check if color is light (for theme detection)
   * @param {string} color - RGB color string
   * @returns {boolean}
   */
  isLightColor(color) {
    const rgb = this.parseRgb(color);
    if (!rgb) return false;

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  }

  /**
   * Check if color is dark (for theme detection)
   * @param {string} color - RGB color string
   * @returns {boolean}
   */
  isDarkColor(color) {
    return !this.isLightColor(color);
  }

  /**
   * Parse RGB color string
   * @param {string} color - RGB color string
   * @returns {Object|null} {r, g, b} or null
   */
  parseRgb(color) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;

    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (RGB)
   * @param {string} color2 - Second color (RGB)
   * @returns {number} Contrast ratio (1-21)
   */
  calculateContrastRatio(color1, color2) {
    const rgb1 = this.parseRgb(color1);
    const rgb2 = this.parseRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const l1 = this.calculateLuminance(rgb1);
    const l2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculate relative luminance
   * @param {Object} rgb - {r, g, b}
   * @returns {number}
   */
  calculateLuminance(rgb) {
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Check if element meets WCAG contrast requirements
   * @param {HTMLElement} element
   * @param {string} level - 'AA' or 'AAA'
   * @returns {boolean}
   */
  meetsContrastRequirement(element, level = 'AA') {
    const style = window.getComputedStyle(element);
    const textColor = style.color;
    const bgColor = style.backgroundColor;

    const ratio = this.calculateContrastRatio(textColor, bgColor);

    // WCAG requirements
    const fontSize = parseFloat(style.fontSize);
    const isBold = parseInt(style.fontWeight, 10) >= 700;
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);

    if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }

    // AA level
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * Get current high contrast mode
   * @returns {string|null}
   */
  getMode() {
    return this.currentMode;
  }

  /**
   * Check if high contrast mode is active
   * @returns {boolean}
   */
  isActive() {
    return this.currentMode !== null;
  }

  /**
   * Force enable high contrast mode
   * @param {string} theme - 'black-on-white' or 'white-on-black'
   */
  enable(theme = 'black-on-white') {
    this.currentMode = `high-contrast-${theme}`;

    if (this.config.applyStyles) {
      this.applyHighContrastStyles();
    }
  }

  /**
   * Force disable high contrast mode
   */
  disable() {
    this.currentMode = null;

    if (this.config.applyStyles) {
      this.applyHighContrastStyles();
    }
  }

  /**
   * Cleanup - remove event listeners
   */
  destroy() {
    // Remove media query listeners
    if (this.mediaQueries.highContrast && this.boundHandlers.highContrast) {
      this.mediaQueries.highContrast.removeListener(
        this.boundHandlers.highContrast
      );
    }

    if (
      this.mediaQueries.prefersContrast &&
      this.boundHandlers.prefersContrast
    ) {
      this.mediaQueries.prefersContrast.removeListener(
        this.boundHandlers.prefersContrast
      );
    }

    this.mediaQueries = {};
    this.boundHandlers = {};
  }
}
