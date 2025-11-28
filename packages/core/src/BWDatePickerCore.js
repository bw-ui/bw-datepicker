/**
 * ============================================================================
 * Black & White: UI Engineering
 * DatePicker Core - Public API
 * ============================================================================
 *
 * Slim public API wrapper around CoreController.
 * Provides clean, simple interface for users.
 *
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

import CoreController from './BWControllerCore.js';
import { PluginSystem } from './CorePluginSystem.js';

export class DatePickerCore {
  static #instanceCounter = 0;

  #controller;
  #pluginSystem;
  #options;
  #instanceId;

  /**
   * Create a new DatePicker
   * @param {string|HTMLElement} target - Input element or selector
   * @param {Object} options - Configuration options
   */
  constructor(target, options = {}) {
    // Generate unique instance ID
    this.#instanceId = ++DatePickerCore.#instanceCounter;

    // Find input element
    const inputElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!inputElement) {
      throw new Error('BWDatePicker: Target element not found');
    }

    this.#options = {
      instanceId: this.#instanceId,
      ...options,
    };

    // Create core controller
    this.#controller = new CoreController(inputElement, this.#options);

    // Initialize plugin system
    this.#pluginSystem = new PluginSystem(this);

    // Auto-register plugins from options
    if (options.plugins && Array.isArray(options.plugins)) {
      options.plugins.forEach((plugin) => this.use(plugin));
    }
  }

  // ============================================================================
  // PUBLIC API - Essential Methods
  // ============================================================================

  /**
   * Open the picker
   */
  open() {
    this.#controller.open();
    return this;
  }

  /**
   * Close the picker
   */
  close() {
    this.#controller.close();
    return this;
  }

  /**
   * Set the selected date
   * @param {Date|string|null} date
   */
  setDate(date) {
    this.#controller.setDate(date);
    return this;
  }

  /**
   * Get the selected date
   * @returns {Date|null}
   */
  getDate() {
    return this.#controller.getDate();
  }

  /**
   * Clear the selection
   */
  clear() {
    this.#controller.clearDate();
    return this;
  }

  /**
   * Destroy the picker
   */
  destroy() {
    // Destroy all plugins first
    if (this.#pluginSystem) {
      this.#pluginSystem.destroyAll();
      this.#pluginSystem = null;
    }

    this.#controller.destroy();
    this.#controller = null;
  }

  // ============================================================================
  // NAVIGATION API
  // ============================================================================

  /**
   * Navigate to previous month
   */
  prevMonth() {
    this.#controller.changeMonth(-1);
    return this;
  }

  /**
   * Navigate to next month
   */
  nextMonth() {
    this.#controller.changeMonth(1);
    return this;
  }

  /**
   * Navigate to previous year
   */
  prevYear() {
    this.#controller.changeYear(-1);
    return this;
  }

  /**
   * Navigate to next year
   */
  nextYear() {
    this.#controller.changeYear(1);
    return this;
  }

  /**
   * Go to today
   */
  today() {
    this.#controller.selectToday();
    return this;
  }

  // ============================================================================
  // PLUGIN API
  // ============================================================================

  /**
   * Register a plugin
   * @param {Object|Function} plugin - Plugin object or class
   * @returns {DatePickerCore}
   */
  use(plugin) {
    if (!this.#pluginSystem) {
      this.#pluginSystem = new PluginSystem(this);
    }
    this.#pluginSystem.register(plugin);
    return this;
  }

  /**
   * Get a registered plugin
   * @param {string} name
   * @returns {Object|null}
   */
  getPlugin(name) {
    return this.#pluginSystem?.get(name) || null;
  }

  /**
   * Check if plugin is registered
   * @param {string} name
   * @returns {boolean}
   */
  hasPlugin(name) {
    return this.#pluginSystem?.has(name) || false;
  }

  // ============================================================================
  // ADVANCED API (for plugins)
  // ============================================================================

  /**
   * Get event bus for custom event handling
   */
  getEventBus() {
    return this.#controller.getEventBus();
  }

  /**
   * Get state manager for state access
   */
  getStateManager() {
    return this.#controller.getStateManager();
  }

  /**
   * Get picker DOM element
   */
  getPickerElement() {
    return this.#controller.getPickerElement();
  }

  /**
   * Get input DOM element
   */
  getInputElement() {
    return this.#controller.getInputElement();
  }

  /**
   * Get current options
   */
  getOptions() {
    return this.#controller.getOptions();
  }

  /**
   * Get instance ID
   */
  getInstanceId() {
    return this.#instanceId;
  }

  /**
   * Subscribe to events
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    this.#controller.getEventBus().on(event, handler);
    return this;
  }

  /**
   * Unsubscribe from events
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    this.#controller.getEventBus().off(event, handler);
    return this;
  }

  /**
   * Force re-render
   */
  refresh() {
    this.#controller.render();
    return this;
  }
}

// Global exposure for non-module usage
if (typeof window !== 'undefined') {
  window.BWDatePicker = DatePickerCore;
}

export default DatePickerCore;
