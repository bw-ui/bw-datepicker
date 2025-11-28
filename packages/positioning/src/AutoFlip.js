/**
 * AutoFlip - Automatically flips position when there's insufficient space
 * Part of Black & White UI DatePicker positioning system
 */

import { ViewportDetector } from './ViewportDetector.js';
import { Collision } from './Collision.js';
const DATA_ATTRIBUTES = { THEME: 'data-bw-theme', INSTANCE: 'data-bw-instance' };

export class AutoFlip {
  /**
   * Calculate flipped vertical position
   * @param {HTMLElement} triggerElement - The element that triggers the picker
   * @param {HTMLElement} pickerElement - The picker element
   * @param {string} currentPlacement - Current placement ('top' or 'bottom')
   * @param {number} offset - Offset from trigger
   * @returns {{placement: string, top: number}}
   */
  static flipVertical(
    triggerElement,
    pickerElement,
    currentPlacement = 'bottom',
    offset = 4
  ) {
    const triggerRect = triggerElement.getBoundingClientRect();
    const pickerRect = pickerElement.getBoundingClientRect();
    const viewport = ViewportDetector.getViewportDimensions();

    let newPlacement = currentPlacement;
    let top;

    if (currentPlacement === 'bottom') {
      // Try bottom first
      top = triggerRect.bottom + offset + viewport.scrollY;

      // Check if it fits
      if (top + pickerRect.height > viewport.height + viewport.scrollY) {
        // Flip to top
        newPlacement = 'top';
        top = triggerRect.top - pickerRect.height - offset + viewport.scrollY;
      }
    } else {
      // Try top first
      top = triggerRect.top - pickerRect.height - offset + viewport.scrollY;

      // Check if it fits
      if (top < viewport.scrollY) {
        // Flip to bottom
        newPlacement = 'bottom';
        top = triggerRect.bottom + offset + viewport.scrollY;
      }
    }

    return { placement: newPlacement, top };
  }

  /**
   * Calculate flipped horizontal position
   * @param {HTMLElement} triggerElement
   * @param {HTMLElement} pickerElement
   * @param {string} currentAlignment - Current alignment ('left', 'right', 'center')
   * @param {number} offset - Horizontal offset
   * @returns {{alignment: string, left: number}}
   */
  static flipHorizontal(
    triggerElement,
    pickerElement,
    currentAlignment = 'left',
    offset = 0
  ) {
    const triggerRect = triggerElement.getBoundingClientRect();
    const pickerRect = pickerElement.getBoundingClientRect();
    const viewport = ViewportDetector.getViewportDimensions();

    let newAlignment = currentAlignment;
    let left;

    if (currentAlignment === 'left') {
      // Align left edge
      left = triggerRect.left + offset + viewport.scrollX;

      // Check if it overflows right
      if (left + pickerRect.width > viewport.width + viewport.scrollX) {
        // Try right alignment
        newAlignment = 'right';
        left = triggerRect.right - pickerRect.width - offset + viewport.scrollX;
      }
    } else if (currentAlignment === 'right') {
      // Align right edge
      left = triggerRect.right - pickerRect.width - offset + viewport.scrollX;

      // Check if it overflows left
      if (left < viewport.scrollX) {
        // Try left alignment
        newAlignment = 'left';
        left = triggerRect.left + offset + viewport.scrollX;
      }
    } else {
      // Center alignment
      const centerOffset = (pickerRect.width - triggerRect.width) / 2;
      left = triggerRect.left - centerOffset + viewport.scrollX;

      // Check overflow
      if (left < viewport.scrollX) {
        newAlignment = 'left';
        left = triggerRect.left + viewport.scrollX;
      } else if (left + pickerRect.width > viewport.width + viewport.scrollX) {
        newAlignment = 'right';
        left = triggerRect.right - pickerRect.width + viewport.scrollX;
      }
    }

    return { alignment: newAlignment, left };
  }

  /**
   * Smart flip - determines best position based on available space
   * @param {HTMLElement} triggerElement
   * @param {HTMLElement} pickerElement
   * @param {Object} preferences - {placement: string, alignment: string}
   * @param {Object} offsets - {x: number, y: number}
   * @returns {{placement: string, alignment: string, top: number, left: number}}
   */
  static smartFlip(
    triggerElement,
    pickerElement,
    preferences = {},
    offsets = {}
  ) {
    const { placement = 'bottom', alignment = 'left' } = preferences;
    const { x = 0, y = 4 } = offsets;

    // Get available space
    const space = ViewportDetector.getAvailableSpace(triggerElement);
    const pickerRect = pickerElement.getBoundingClientRect();

    // Determine best vertical placement
    let finalPlacement = placement;
    if (
      placement === 'bottom' &&
      space.bottom < pickerRect.height &&
      space.top > space.bottom
    ) {
      finalPlacement = 'top';
    } else if (
      placement === 'top' &&
      space.top < pickerRect.height &&
      space.bottom > space.top
    ) {
      finalPlacement = 'bottom';
    }

    // Calculate vertical position
    const verticalResult = this.flipVertical(
      triggerElement,
      pickerElement,
      finalPlacement,
      y
    );

    // Determine best horizontal alignment
    let finalAlignment = alignment;
    const triggerRect = triggerElement.getBoundingClientRect();

    if (
      alignment === 'left' &&
      triggerRect.left + pickerRect.width >
        space.left + triggerRect.width + space.right
    ) {
      finalAlignment = 'right';
    } else if (
      alignment === 'right' &&
      triggerRect.right - pickerRect.width < 0
    ) {
      finalAlignment = 'left';
    }

    // Calculate horizontal position
    const horizontalResult = this.flipHorizontal(
      triggerElement,
      pickerElement,
      finalAlignment,
      x
    );

    return {
      placement: verticalResult.placement,
      alignment: horizontalResult.alignment,
      top: verticalResult.top,
      left: horizontalResult.left,
    };
  }

  /**
   * Check if flip is needed
   * @param {HTMLElement} pickerElement
   * @param {Object} currentPosition - {top, left}
   * @returns {{vertical: boolean, horizontal: boolean}}
   */
  static shouldFlip(pickerElement, currentPosition) {
    const position = {
      top: currentPosition.top,
      left: currentPosition.left,
      width: pickerElement.offsetWidth,
      height: pickerElement.offsetHeight,
    };

    const collision = Collision.detectPotential(position);

    return {
      vertical: collision.top || collision.bottom,
      horizontal: collision.left || collision.right,
    };
  }

  /**
   * Apply flip with transition
   * @param {HTMLElement} pickerElement
   * @param {Object} newPosition - {top, left, placement, alignment}
   * @param {boolean} animate - Whether to animate the flip
   */
  static applyFlip(pickerElement, newPosition, animate = true) {
    if (animate) {
      pickerElement.style.transition = 'top 0.2s ease, left 0.2s ease';
    }

    pickerElement.style.top = `${newPosition.top}px`;
    pickerElement.style.left = `${newPosition.left}px`;

    // Update data attributes for styling
    if (newPosition.placement) {
      // pickerElement.setAttribute('data-placement', newPosition.placement);
      pickerElement.setAttribute(
        DATA_ATTRIBUTES.PLACEMENT,
        newPosition.placement
      );
    }
    if (newPosition.alignment) {
      // pickerElement.setAttribute('data-alignment', newPosition.alignment);
      pickerElement.setAttribute(
        DATA_ATTRIBUTES.ALIGNMENT,
        newPosition.alignment
      );
    }

    if (animate) {
      // Remove transition after animation
      setTimeout(() => {
        pickerElement.style.transition = '';
      }, 200);
    }
  }

  /**
   * Get all possible positions and their scores
   * @param {HTMLElement} triggerElement
   * @param {HTMLElement} pickerElement
   * @returns {Array<{placement: string, alignment: string, score: number, position: Object}>}
   */
  static getAllPositions(triggerElement, pickerElement) {
    const positions = [];
    const placements = ['top', 'bottom'];
    const alignments = ['left', 'center', 'right'];
    const pickerRect = pickerElement.getBoundingClientRect();

    for (const placement of placements) {
      for (const alignment of alignments) {
        const verticalResult = this.flipVertical(
          triggerElement,
          pickerElement,
          placement,
          4
        );
        const horizontalResult = this.flipHorizontal(
          triggerElement,
          pickerElement,
          alignment,
          0
        );

        const position = {
          top: verticalResult.top,
          left: horizontalResult.left,
          width: pickerRect.width,
          height: pickerRect.height,
        };

        // Score based on collision severity
        const severity = Collision.calculateSeverity(position);
        const score = -(
          severity.top +
          severity.bottom +
          severity.left +
          severity.right
        );

        positions.push({
          placement,
          alignment,
          score,
          position,
        });
      }
    }

    // Sort by score (highest first)
    return positions.sort((a, b) => b.score - a.score);
  }

  /**
   * Get best position from all possibilities
   * @param {HTMLElement} triggerElement
   * @param {HTMLElement} pickerElement
   * @returns {{placement: string, alignment: string, top: number, left: number}}
   */
  static getBestPosition(triggerElement, pickerElement) {
    const allPositions = this.getAllPositions(triggerElement, pickerElement);
    const best = allPositions[0];

    return {
      placement: best.placement,
      alignment: best.alignment,
      top: best.position.top,
      left: best.position.left,
    };
  }
}
