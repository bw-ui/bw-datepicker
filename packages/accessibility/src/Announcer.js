/**
 * ============================================================================
 * Black & White UI – Engineered with Precision
 * Announcer - ARIA Live Region
 * ============================================================================
 *
 * Announces changes to screen readers
 * Uses ARIA live regions for accessibility
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

const DOM_IDS = { ANNOUNCER: 'bw-datepicker-announcer' };
const ARIA_ATTRIBUTES = { LIVE: 'aria-live', ATOMIC: 'aria-atomic' };

export class Announcer {
  #liveRegion = null;
  #timeout = null;

  constructor() {
    this.#createLiveRegion();
  }

  /**
   * Create ARIA live region
   */
  #createLiveRegion() {
    // Check if already exists
    let existing = document.getElementById(DOM_IDS.ANNOUNCER);
    if (existing) {
      this.#liveRegion = existing;
      return;
    }

    // Create new live region
    const region = document.createElement('div');
    region.id = DOM_IDS.ANNOUNCER;
    region.setAttribute('role', 'status');
    region.setAttribute(ARIA_ATTRIBUTES.LIVE, 'polite');
    region.setAttribute(ARIA_ATTRIBUTES.ATOMIC, 'true');

    // Visually hidden but available to screen readers
    region.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    `;

    document.body.appendChild(region);
    this.#liveRegion = region;
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {number} delay - Delay before announcing (ms)
   */
  announce(message, delay = 100) {
    if (!this.#liveRegion || !message) return;

    // Clear previous timeout
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }

    // Clear previous message first (force re-announcement)
    this.#liveRegion.textContent = '';

    // Set new message after delay
    this.#timeout = setTimeout(() => {
      this.#liveRegion.textContent = message;
    }, delay);
  }

  /**
   * Announce immediately (assertive)
   * @param {string} message - Message to announce
   */
  announceImmediate(message) {
    if (!this.#liveRegion || !message) return;

    // Change to assertive for immediate announcement
    this.#liveRegion.setAttribute(ARIA_ATTRIBUTES.LIVE, 'assertive');
    this.#liveRegion.textContent = message;

    // Reset to polite after announcement
    setTimeout(() => {
      this.#liveRegion.setAttribute('aria-live', 'polite');
    }, 1000);
  }

  /**
   * Clear announcement
   */
  clear() {
    if (this.#liveRegion) {
      this.#liveRegion.textContent = '';
    }

    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }
  }

  /**
   * Destroy announcer
   */
  destroy() {
    this.clear();

    // Don't remove live region from DOM as it might be shared
    // Just clear references
    this.#liveRegion = null;
  }
}

export default Announcer;
