/**
 * ============================================================================
 * Black & White: UI Engineering
 * SlotManager - Manages Persistent Slots
 * ============================================================================
 *
 * Creates slots ONCE (never wiped). Only slot contents update.
 * Plugins can intercept slot rendering via events.
 *
 * Slots:
 * - header: month/year title + navigation
 * - calendar: days/months/years/week grid
 * - footer: today/clear buttons
 *
 * @version 1.0.0
 * @license MIT
 * ============================================================================
 */

export class SlotManager {
  #container = null;
  #slots = {};
  #initialized = false;

  /**
   * Create slots in picker element (called once)
   * @param {HTMLElement} pickerElement - The picker container
   */
  createSlots(pickerElement) {
    if (this.#initialized) return;

    this.#container = document.createElement('div');
    this.#container.className = 'bw-datepicker__container';

    // Create persistent slot elements
    this.#container.innerHTML = `
      <div class="bw-datepicker__slot bw-datepicker__slot--header"></div>
      <div class="bw-datepicker__slot bw-datepicker__slot--calendar"></div>
      <div class="bw-datepicker__slot bw-datepicker__slot--footer"></div>
    `;

    this.#slots = {
      header: this.#container.querySelector('.bw-datepicker__slot--header'),
      calendar: this.#container.querySelector('.bw-datepicker__slot--calendar'),
      footer: this.#container.querySelector('.bw-datepicker__slot--footer'),
    };

    pickerElement.appendChild(this.#container);
    this.#initialized = true;
  }

  /**
   * Get a specific slot element
   * @param {string} name - Slot name (header, calendar, footer)
   * @returns {HTMLElement|null}
   */
  getSlot(name) {
    return this.#slots[name] || null;
  }

  /**
   * Get all slots
   * @returns {Object} All slot elements
   */
  getAllSlots() {
    return { ...this.#slots };
  }

  /**
   * Get container element
   * @returns {HTMLElement|null}
   */
  getContainer() {
    return this.#container;
  }

  /**
   * Update slot content
   * @param {string} name - Slot name
   * @param {string} html - HTML content
   */
  updateSlot(name, html) {
    const slot = this.#slots[name];
    if (slot) {
      slot.innerHTML = html;
    }
  }

  /**
   * Clear slot content
   * @param {string} name - Slot name (or omit to clear all)
   */
  clearSlot(name) {
    if (name) {
      const slot = this.#slots[name];
      if (slot) slot.innerHTML = '';
    } else {
      Object.values(this.#slots).forEach((slot) => {
        slot.innerHTML = '';
      });
    }
  }

  /**
   * Check if slots are initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this.#initialized;
  }

  /**
   * Destroy slots
   */
  destroy() {
    if (this.#container && this.#container.parentNode) {
      this.#container.parentNode.removeChild(this.#container);
    }
    this.#container = null;
    this.#slots = {};
    this.#initialized = false;
  }
}

export default SlotManager;
