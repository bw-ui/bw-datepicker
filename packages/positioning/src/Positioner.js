/**
 * Positioner - Main positioning controller for BW DatePicker
 * Handles inline, popup, and modal positioning with smart collision detection
 */

import { ViewportDetector } from './ViewportDetector.js';
import { Collision } from './Collision.js';
import { AutoFlip } from './AutoFlip.js';

export class Positioner {
  constructor(config = {}) {
    this.config = {
      mode: 'popup', // 'inline' | 'popup' | 'modal'
      placement: 'bottom', // 'top' | 'bottom'
      alignment: 'left', // 'left' | 'center' | 'right'
      autoFlip: true, // Enable automatic flipping
      constrainToViewport: true, // Constrain to viewport bounds
      appendTo: null, // Element to append picker to (null = next to trigger)
      offset: { x: 0, y: 4 }, // Offset from trigger
      margin: 8, // Margin from viewport edges
      zIndex: 1000, // Base z-index
      onPosition: null, // Callback after positioning
      ...config,
    };

    this.triggerElement = null;
    this.pickerElement = null;
    this.isPositioned = false;
    this.currentPosition = null;

    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * Initialize positioner
   * @param {HTMLElement} triggerElement
   * @param {HTMLElement} pickerElement
   */
  init(triggerElement, pickerElement) {
    this.triggerElement = triggerElement;
    this.pickerElement = pickerElement;

    // Set up initial positioning based on mode
    this.setupMode();

    // Add event listeners for repositioning
    if (this.config.mode === 'popup') {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('scroll', this.handleScroll, true);
    }
  }

  /**
   * Set up positioning based on display mode
   */
  setupMode() {
    const { mode } = this.config;

    if (mode === 'inline') {
      this.setupInlineMode();
    } else if (mode === 'popup') {
      this.setupPopupMode();
    } else if (mode === 'modal') {
      this.setupModalMode();
    }
  }

  /**
   * Set up inline mode (embedded in page)
   */
  setupInlineMode() {
    this.pickerElement.style.position = 'relative';
    this.pickerElement.style.display = 'block';
    this.isPositioned = true;
  }

  /**
   * Set up popup mode (dropdown from trigger)
   */
  setupPopupMode() {
    // Append to specified container or body
    const container = this.config.appendTo || document.body;

    if (this.pickerElement.parentElement !== container) {
      container.appendChild(this.pickerElement);
    }

    // Set positioning style
    this.pickerElement.style.position = 'absolute';
    this.pickerElement.style.zIndex = this.config.zIndex;

    // Calculate and apply position
    this.position();
  }

  /**
   * Set up modal mode (fullscreen overlay)
   */
  setupModalMode() {
    // Append to body
    if (this.pickerElement.parentElement !== document.body) {
      document.body.appendChild(this.pickerElement);
    }

    // Set modal styles
    this.pickerElement.style.position = 'fixed';
    this.pickerElement.style.zIndex = this.config.zIndex + 100;

    // Center on screen
    this.centerOnViewport();
  }

  /**
   * Calculate and apply position
   * @returns {{top: number, left: number, placement: string, alignment: string}}
   */
  position() {
    if (!this.triggerElement || !this.pickerElement) {
      console.warn('Positioner: Missing trigger or picker element');
      return null;
    }

    const { placement, alignment, autoFlip, offset } = this.config;

    let position;

    if (autoFlip) {
      // Use smart positioning with auto-flip
      position = AutoFlip.smartFlip(
        this.triggerElement,
        this.pickerElement,
        { placement, alignment },
        offset
      );
    } else {
      // Use manual positioning without flip
      position = this.calculatePosition(placement, alignment);
    }

    // Constrain to viewport if enabled
    if (this.config.constrainToViewport) {
      const constrained = ViewportDetector.constrainToViewport(
        {
          top: position.top,
          left: position.left,
          width: this.pickerElement.offsetWidth,
          height: this.pickerElement.offsetHeight,
        },
        this.config.margin
      );
      position.top = constrained.top;
      position.left = constrained.left;
    }

    // Apply position
    this.applyPosition(position);

    // Store current position
    this.currentPosition = position;
    this.isPositioned = true;

    // Trigger callback
    if (this.config.onPosition) {
      this.config.onPosition(position);
    }

    return position;
  }

  /**
   * Calculate position without auto-flip
   * @param {string} placement
   * @param {string} alignment
   * @returns {{top: number, left: number, placement: string, alignment: string}}
   */
  calculatePosition(placement, alignment) {
    const triggerRect = this.triggerElement.getBoundingClientRect();
    const pickerRect = this.pickerElement.getBoundingClientRect();
    const viewport = ViewportDetector.getViewportDimensions();
    const { offset } = this.config;

    let top, left;

    // Calculate vertical position
    if (placement === 'top') {
      top = triggerRect.top - pickerRect.height - offset.y + viewport.scrollY;
    } else {
      top = triggerRect.bottom + offset.y + viewport.scrollY;
    }

    // Calculate horizontal position
    if (alignment === 'left') {
      left = triggerRect.left + offset.x + viewport.scrollX;
    } else if (alignment === 'right') {
      left = triggerRect.right - pickerRect.width - offset.x + viewport.scrollX;
    } else {
      // Center
      const centerOffset = (pickerRect.width - triggerRect.width) / 2;
      left = triggerRect.left - centerOffset + viewport.scrollX;
    }

    return { top, left, placement, alignment };
  }

  /**
   * Apply calculated position to picker element
   * @param {Object} position - {top, left, placement, alignment}
   */
  applyPosition(position) {
    this.pickerElement.style.top = `${position.top}px`;
    this.pickerElement.style.left = `${position.left}px`;

    // Set data attributes for CSS styling hooks
    this.pickerElement.setAttribute(
      'data-placement',
      position.placement || 'bottom'
    );
    this.pickerElement.setAttribute(
      'data-alignment',
      position.alignment || 'left'
    );
  }

  /**
   * Center picker on viewport (for modal mode)
   */
  centerOnViewport() {
    const viewport = ViewportDetector.getViewportDimensions();
    const pickerRect = this.pickerElement.getBoundingClientRect();

    const top = (viewport.height - pickerRect.height) / 2;
    const left = (viewport.width - pickerRect.width) / 2;

    this.pickerElement.style.top = `${top}px`;
    this.pickerElement.style.left = `${left}px`;

    this.isPositioned = true;
  }

  /**
   * Update configuration
   * @param {Object} newConfig
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Reposition if already positioned
    if (this.isPositioned) {
      this.position();
    }
  }

  /**
   * Reposition (useful when picker size changes)
   */
  reposition() {
    if (this.config.mode === 'popup' && this.isPositioned) {
      this.position();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      if (ViewportDetector.isMobileViewport() && this.config.mode !== 'modal') {
        // Switch to modal on mobile
        this.config.mode = 'modal';
        this.setupModalMode();
      } else if (this.isPositioned) {
        this.reposition();
      }
    }, 100);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    // Debounce scroll events
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      if (this.isPositioned) {
        this.reposition();
      }
    }, 50);
  }

  /**
   * Get current z-index and suggest next available
   * @param {HTMLElement} element
   * @returns {number}
   */
  static getNextZIndex(element = document.body) {
    const elements = element.querySelectorAll('*');
    let maxZIndex = 1000;

    elements.forEach((el) => {
      const zIndex = parseInt(window.getComputedStyle(el).zIndex, 10);
      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    return maxZIndex + 1;
  }

  /**
   * Check if picker is visible in viewport
   * @returns {boolean}
   */
  isVisible() {
    if (!this.pickerElement) return false;

    const rect = this.pickerElement.getBoundingClientRect();
    const viewport = ViewportDetector.getViewportDimensions();

    return (
      rect.top < viewport.height &&
      rect.bottom > 0 &&
      rect.left < viewport.width &&
      rect.right > 0
    );
  }

  /**
   * Cleanup and remove event listeners
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll, true);

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.triggerElement = null;
    this.pickerElement = null;
    this.isPositioned = false;
    this.currentPosition = null;
  }
}
