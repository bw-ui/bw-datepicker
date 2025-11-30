/**
 * ============================================================================
 * Black & White: UI Engineering
 * EventBus: Publish-Subscribe Event System
 * ============================================================================
 *
 * Decoupled communication between components
 * No tight coupling, easy to extend
 *
 * Supports interception: if listener returns true, event is intercepted
 * and subsequent listeners won't run.
 *
 * @version 1.1.0
 * @license MIT
 * ============================================================================
 */

export class EventBus {
  #listeners;

  constructor() {
    this.#listeners = new Map(); // eventName -> Set of callbacks
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Event to listen for
   * @param {Function} callback - Handler function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, new Set());
    }

    this.#listeners.get(eventName).add(callback);

    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  /**
   * Subscribe to an event (runs once, then unsubscribes)
   * @param {string} eventName - Event to listen for
   * @param {Function} callback - Handler function
   * @returns {Function} Unsubscribe function
   */
  once(eventName, callback) {
    const wrappedCallback = (...args) => {
      callback(...args);
      this.off(eventName, wrappedCallback);
    };

    return this.on(eventName, wrappedCallback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Event name
   * @param {Function} callback - Handler to remove
   */
  off(eventName, callback) {
    const listeners = this.#listeners.get(eventName);
    if (listeners) {
      listeners.delete(callback);

      // Clean up empty listener sets
      if (listeners.size === 0) {
        this.#listeners.delete(eventName);
      }
    }
  }

  /**
   * Publish an event
   * @param {string} eventName - Event to emit
   * @param {*} data - Event data/payload
   * @returns {boolean} True if event was intercepted by a listener
   */
  emit(eventName, data = null) {
    const listeners = this.#listeners.get(eventName);
    let intercepted = false;

    if (listeners) {
      for (const callback of listeners) {
        try {
          const result = callback(data, eventName);
          // If listener returns true, event is intercepted
          if (result === true) {
            intercepted = true;
            break;
          }
        } catch (error) {
          console.error(`EventBus error in "${eventName}" listener:`, error);
        }
      }
    }

    return intercepted;
  }

  /**
   * Remove all listeners for an event (or all events)
   * @param {string} [eventName] - Specific event, or omit for all
   */
  clear(eventName) {
    if (eventName) {
      this.#listeners.delete(eventName);
    } else {
      this.#listeners.clear();
    }
  }

  /**
   * Check if event has listeners
   * @param {string} eventName - Event name
   * @returns {boolean}
   */
  hasListeners(eventName) {
    const listeners = this.#listeners.get(eventName);
    return listeners ? listeners.size > 0 : false;
  }

  /**
   * Get listener count for event
   * @param {string} eventName - Event name
   * @returns {number}
   */
  listenerCount(eventName) {
    const listeners = this.#listeners.get(eventName);
    return listeners ? listeners.size : 0;
  }

  /**
   * Get all registered event names
   * @returns {Array<string>}
   */
  eventNames() {
    return Array.from(this.#listeners.keys());
  }
}

export default EventBus;
