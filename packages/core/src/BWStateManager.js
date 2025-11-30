/**
 * ============================================================================
 * Black & White: UI Engineering
 * StateManager: Observable State Management
 * ============================================================================
 *
 * Centralized state with explicit observers
 * No magic, no Proxy, full control
 *
 * Core State:
 * - currentMonth, currentYear: Navigation state
 * - selectedDate: Currently selected date
 * - isOpen: Picker visibility
 * - viewMode: 'calendar' | 'month' | 'year' | 'week'
 *
 * @version 1.1.0
 * @license MIT
 * ============================================================================
 */

export class StateManager {
  #state;
  #observers;

  constructor(initialState = {}) {
    this.#state = { ...initialState };
    this.#observers = new Map(); // key -> Set of callbacks
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @returns {*} State value
   */
  get(key) {
    return this.#state[key];
  }

  /**
   * Get entire state object (read-only copy)
   * @returns {Object} State snapshot
   */
  getAll() {
    return { ...this.#state };
  }

  /**
   * Set state value(s) - EXPLICIT mutation
   * @param {Object|string} keyOrObject - Key or object of key-value pairs
   * @param {*} value - Value (if first param is string)
   */
  set(keyOrObject, value) {
    const updates =
      typeof keyOrObject === 'string' ? { [keyOrObject]: value } : keyOrObject;

    const changedKeys = [];

    // Update state and track changes
    for (const [key, newValue] of Object.entries(updates)) {
      const oldValue = this.#state[key];

      if (oldValue !== newValue) {
        this.#state[key] = newValue;
        changedKeys.push(key);
      }
    }

    // Notify observers for changed keys
    changedKeys.forEach((key) => this.#notifyObservers(key));
  }

  /**
   * Observe state changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Called when key changes
   * @returns {Function} Unsubscribe function
   */
  observe(key, callback) {
    if (!this.#observers.has(key)) {
      this.#observers.set(key, new Set());
    }

    this.#observers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const observers = this.#observers.get(key);
      if (observers) {
        observers.delete(callback);
      }
    };
  }

  /**
   * Observe multiple keys
   * @param {Array<string>} keys - Keys to watch
   * @param {Function} callback - Called when any key changes
   * @returns {Function} Unsubscribe function
   */
  observeMany(keys, callback) {
    const unsubscribers = keys.map((key) => this.observe(key, callback));

    // Return function that unsubscribes all
    return () => unsubscribers.forEach((unsub) => unsub());
  }

  /**
   * Notify observers for a specific key
   * @param {string} key - State key that changed
   */
  #notifyObservers(key) {
    const observers = this.#observers.get(key);
    if (observers) {
      const newValue = this.#state[key];
      observers.forEach((callback) => {
        try {
          callback(newValue, key);
        } catch (error) {
          console.error(`StateManager observer error for key "${key}":`, error);
        }
      });
    }
  }

  /**
   * Reset state to initial or provided values
   * @param {Object} newState - New state object
   */
  reset(newState = {}) {
    const oldKeys = Object.keys(this.#state);
    this.#state = { ...newState };

    // Notify all observers
    oldKeys.forEach((key) => this.#notifyObservers(key));
    Object.keys(newState).forEach((key) => {
      if (!oldKeys.includes(key)) {
        this.#notifyObservers(key);
      }
    });
  }

  /**
   * Clear all observers
   */
  clearObservers() {
    this.#observers.clear();
  }

  /**
   * Debug: Get observer count
   */
  getObserverCount(key) {
    const observers = this.#observers.get(key);
    return observers ? observers.size : 0;
  }
}

export default StateManager;
