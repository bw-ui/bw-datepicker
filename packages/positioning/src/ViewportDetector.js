/**
 * ViewportDetector - Detects viewport boundaries and calculates available space
 * Part of Black & White UI DatePicker positioning system
 */

export class ViewportDetector {
  /**
   * Get viewport dimensions
   * @returns {{width: number, height: number, scrollX: number, scrollY: number}}
   */
  static getViewportDimensions() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight,
      scrollX: window.pageXOffset || document.documentElement.scrollLeft,
      scrollY: window.pageYOffset || document.documentElement.scrollTop,
    };
  }

  /**
   * Get element's bounding rectangle with scroll offset
   * @param {HTMLElement} element
   * @returns {DOMRect}
   */
  static getElementBounds(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const viewport = this.getViewportDimensions();

    return {
      top: rect.top + viewport.scrollY,
      left: rect.left + viewport.scrollX,
      right: rect.right + viewport.scrollX,
      bottom: rect.bottom + viewport.scrollY,
      width: rect.width,
      height: rect.height,
      x: rect.x + viewport.scrollX,
      y: rect.y + viewport.scrollY,
    };
  }

  /**
   * Calculate available space around an element
   * @param {HTMLElement} element - Reference element (typically input/trigger)
   * @returns {{top: number, bottom: number, left: number, right: number}}
   */
  static getAvailableSpace(element) {
    const rect = element.getBoundingClientRect();
    const viewport = this.getViewportDimensions();

    return {
      top: rect.top,
      bottom: viewport.height - rect.bottom,
      left: rect.left,
      right: viewport.width - rect.right,
    };
  }

  /**
   * Check if element fits in viewport
   * @param {number} width - Element width
   * @param {number} height - Element height
   * @param {Object} position - {top, left}
   * @returns {boolean}
   */
  static fitsInViewport(width, height, position) {
    const viewport = this.getViewportDimensions();
    const rect = position || {};

    const fitsHorizontally = (rect.left || 0) + width <= viewport.width;
    const fitsVertically = (rect.top || 0) + height <= viewport.height;

    return fitsHorizontally && fitsVertically;
  }

  /**
   * Get best vertical placement (top or bottom)
   * @param {HTMLElement} triggerElement
   * @param {number} pickerHeight
   * @returns {'top'|'bottom'}
   */
  static getBestVerticalPlacement(triggerElement, pickerHeight) {
    const space = this.getAvailableSpace(triggerElement);

    // Prefer bottom if there's enough space
    if (space.bottom >= pickerHeight) {
      return 'bottom';
    }

    // Otherwise use top if there's more space
    if (space.top >= pickerHeight) {
      return 'top';
    }

    // Use whichever has more space
    return space.bottom >= space.top ? 'bottom' : 'top';
  }

  /**
   * Get best horizontal placement (left or right)
   * @param {HTMLElement} triggerElement
   * @param {number} pickerWidth
   * @returns {'left'|'right'|'center'}
   */
  static getBestHorizontalPlacement(triggerElement, pickerWidth) {
    const space = this.getAvailableSpace(triggerElement);
    const triggerRect = triggerElement.getBoundingClientRect();

    // Check if picker can be centered on trigger
    const centerOffset = (pickerWidth - triggerRect.width) / 2;
    const centerLeft = triggerRect.left - centerOffset;
    const centerRight = centerLeft + pickerWidth;

    const viewport = this.getViewportDimensions();

    if (centerLeft >= 0 && centerRight <= viewport.width) {
      return 'center';
    }

    // Check if it fits aligned left
    if (space.left + triggerRect.width >= pickerWidth) {
      return 'left';
    }

    // Check if it fits aligned right
    if (space.right + triggerRect.width >= pickerWidth) {
      return 'right';
    }

    // Use whichever has more space
    return space.left >= space.right ? 'left' : 'right';
  }

  /**
   * Check if position would cause viewport overflow
   * @param {Object} position - {top, left, width, height}
   * @returns {{horizontal: boolean, vertical: boolean}}
   */
  static checkOverflow(position) {
    const viewport = this.getViewportDimensions();

    return {
      horizontal:
        position.left + position.width > viewport.width || position.left < 0,
      vertical:
        position.top + position.height > viewport.height || position.top < 0,
    };
  }

  /**
   * Constrain position to viewport bounds
   * @param {Object} position - {top, left, width, height}
   * @param {number} margin - Safety margin in pixels
   * @returns {{top: number, left: number}}
   */
  static constrainToViewport(position, margin = 8) {
    const viewport = this.getViewportDimensions();

    let { top, left, width, height } = position;

    // Constrain horizontally
    if (left < margin) {
      left = margin;
    } else if (left + width > viewport.width - margin) {
      left = viewport.width - width - margin;
    }

    // Constrain vertically
    if (top < margin) {
      top = margin;
    } else if (top + height > viewport.height - margin) {
      top = viewport.height - height - margin;
    }

    return { top, left };
  }

  /**
   * Check if device is mobile (small viewport)
   * @returns {boolean}
   */
  static isMobileViewport() {
    const viewport = this.getViewportDimensions();
    return viewport.width <= 768;
  }

  /**
   * Get safe area insets (for iOS notch support)
   * @returns {{top: number, right: number, bottom: number, left: number}}
   */
  static getSafeAreaInsets() {
    const style = getComputedStyle(document.documentElement);

    return {
      top: parseInt(
        style.getPropertyValue('--sat') ||
          style.getPropertyValue('env(safe-area-inset-top)') ||
          '0',
        10
      ),
      right: parseInt(
        style.getPropertyValue('--sar') ||
          style.getPropertyValue('env(safe-area-inset-right)') ||
          '0',
        10
      ),
      bottom: parseInt(
        style.getPropertyValue('--sab') ||
          style.getPropertyValue('env(safe-area-inset-bottom)') ||
          '0',
        10
      ),
      left: parseInt(
        style.getPropertyValue('--sal') ||
          style.getPropertyValue('env(safe-area-inset-left)') ||
          '0',
        10
      ),
    };
  }
}
