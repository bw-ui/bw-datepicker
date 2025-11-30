/**
 * ============================================================================
 * Black & White: UI Engineering
 * Core Plugin System (Slim)
 * ============================================================================
 *
 * Minimal plugin system for core.
 * Full-featured plugin system is in the original BWPluginSystem.js
 *
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

import { generateCalendarMonth, MONTH_NAMES, DAY_NAMES } from './date-utils.js';

export class PluginSystem {
  #plugins = new Map();
  #datepicker;

  constructor(datepicker) {
    this.#datepicker = datepicker;
  }

  /**
   * Register a plugin
   * @param {Object} plugin - Plugin with name, init, destroy
   */
  register(plugin, options = {}) {
    if (!plugin?.name) {
      throw new Error('Plugin must have a name');
    }

    if (this.#plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" already registered`);
    }

    const entry = {
      name: plugin.name,
      instance: null,
      destroy: plugin.destroy || null,
    };

    this.#plugins.set(plugin.name, entry);

    // Initialize if init function exists
    if (plugin.init) {
      entry.instance = plugin.init(this.#createApi(), options);
    }

    return true;
  }

  /**
   * Get plugin by name
   */
  get(name) {
    const entry = this.#plugins.get(name);
    return entry?.instance || null;
  }

  /**
   * Check if plugin exists
   */
  has(name) {
    return this.#plugins.has(name);
  }

  /**
   * Create plugin API
   */
  #createApi() {
    return {
      datepicker: this.#datepicker,
      getEventBus: () => this.#datepicker.getEventBus(),
      getStateManager: () => this.#datepicker.getStateManager(),
      getPickerElement: () => this.#datepicker.getPickerElement(),
      getInputElement: () => this.#datepicker.getInputElement(),
      getOptions: () => this.#datepicker.getOptions(),
      setOption: (key, value) => this.#datepicker.setOption(key, value),
      getDate: () => this.#datepicker.getDate(),
      setDate: (date) => this.#datepicker.setDate(date),
      open: () => this.#datepicker.open(),
      close: () => this.#datepicker.close(),
      refresh: () => this.#datepicker.refresh(),
      getPlugin: (name) => this.get(name),
      hasPlugin: (name) => this.has(name),
      // Utility functions for plugins
      utils: {
        generateCalendarMonth,
        MONTH_NAMES,
        DAY_NAMES,
      },
    };
  }

  /**
   * Destroy all plugins
   */
  destroyAll() {
    this.#plugins.forEach((entry) => {
      if (entry.destroy) {
        try {
          entry.destroy(entry.instance);
        } catch (e) {
          console.error(`Error destroying plugin "${entry.name}":`, e);
        }
      }
    });
    this.#plugins.clear();
  }
}
