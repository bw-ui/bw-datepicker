/**
 * Collision - Detects and handles collisions with viewport edges
 * Part of Black & White UI DatePicker positioning system
 */

import { ViewportDetector } from './ViewportDetector.js';

export class Collision {
  /**
   * Detect collision with viewport edges
   * @param {HTMLElement} element - Element to check
   * @param {HTMLElement} container - Container element (usually document.body)
   * @returns {{top: boolean, bottom: boolean, left: boolean, right: boolean, any: boolean}}
   */
  static detect(element, container = document.body) {
    const rect = element.getBoundingClientRect();
    const viewport = ViewportDetector.getViewportDimensions();

    const collision = {
      top: rect.top < 0,
      bottom: rect.bottom > viewport.height,
      left: rect.left < 0,
      right: rect.right > viewport.width,
      any: false,
    };

    collision.any =
      collision.top || collision.bottom || collision.left || collision.right;

    return collision;
  }

  /**
   * Detect potential collision before positioning
   * @param {Object} position - {top, left, width, height}
   * @param {number} margin - Safety margin
   * @returns {{top: boolean, bottom: boolean, left: boolean, right: boolean, any: boolean}}
   */
  static detectPotential(position, margin = 8) {
    const viewport = ViewportDetector.getViewportDimensions();

    const collision = {
      top: position.top < margin,
      bottom: position.top + position.height > viewport.height - margin,
      left: position.left < margin,
      right: position.left + position.width > viewport.width - margin,
      any: false,
    };

    collision.any =
      collision.top || collision.bottom || collision.left || collision.right;

    return collision;
  }

  /**
   * Calculate collision severity (how much overflow)
   * @param {Object} position - {top, left, width, height}
   * @returns {{top: number, bottom: number, left: number, right: number}}
   */
  static calculateSeverity(position) {
    const viewport = ViewportDetector.getViewportDimensions();

    return {
      top: Math.max(0, -position.top),
      bottom: Math.max(0, position.top + position.height - viewport.height),
      left: Math.max(0, -position.left),
      right: Math.max(0, position.left + position.width - viewport.width),
    };
  }

  /**
   * Get collision-free position adjustments
   * @param {Object} position - {top, left, width, height}
   * @param {number} margin - Safety margin
   * @returns {{top: number, left: number}}
   */
  static getAdjustments(position, margin = 8) {
    const viewport = ViewportDetector.getViewportDimensions();
    const adjustments = { top: 0, left: 0 };

    // Adjust horizontal
    if (position.left < margin) {
      adjustments.left = margin - position.left;
    } else if (position.left + position.width > viewport.width - margin) {
      adjustments.left =
        viewport.width - margin - (position.left + position.width);
    }

    // Adjust vertical
    if (position.top < margin) {
      adjustments.top = margin - position.top;
    } else if (position.top + position.height > viewport.height - margin) {
      adjustments.top =
        viewport.height - margin - (position.top + position.height);
    }

    return adjustments;
  }

  /**
   * Check if element collides with another element
   * @param {HTMLElement} element1
   * @param {HTMLElement} element2
   * @returns {boolean}
   */
  static checkElementCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  /**
   * Find all colliding elements
   * @param {HTMLElement} element
   * @param {string} selector - CSS selector for potential collision targets
   * @returns {HTMLElement[]}
   */
  static findCollidingElements(element, selector = '.bw-datepicker') {
    const elements = document.querySelectorAll(selector);
    const colliding = [];

    for (const target of elements) {
      if (target !== element && this.checkElementCollision(element, target)) {
        colliding.push(target);
      }
    }

    return colliding;
  }

  /**
   * Get recommended flip direction based on collision
   * @param {Object} collision - Collision detection result
   * @returns {{vertical: 'flip'|'none', horizontal: 'flip'|'none'}}
   */
  static getRecommendedFlip(collision) {
    return {
      vertical: collision.bottom || collision.top ? 'flip' : 'none',
      horizontal: collision.left || collision.right ? 'flip' : 'none',
    };
  }

  /**
   * Check if position is safe (no collision)
   * @param {Object} position - {top, left, width, height}
   * @param {number} margin - Safety margin
   * @returns {boolean}
   */
  static isSafePosition(position, margin = 8) {
    const collision = this.detectPotential(position, margin);
    return !collision.any;
  }

  /**
   * Get collision priority (which edge is most problematic)
   * @param {Object} severity - Collision severity from calculateSeverity()
   * @returns {'top'|'bottom'|'left'|'right'|null}
   */
  static getPriority(severity) {
    let maxSeverity = 0;
    let priority = null;

    for (const [edge, value] of Object.entries(severity)) {
      if (value > maxSeverity) {
        maxSeverity = value;
        priority = edge;
      }
    }

    return priority;
  }
}
