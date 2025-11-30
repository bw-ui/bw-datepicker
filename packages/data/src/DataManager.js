/**
 * DataManager
 * Stores and caches data by date
 */

export class DataManager {
  #data = new Map();
  #cache = new Map();
  #options;

  constructor(options = {}) {
    this.#options = {
      cache: true,
      cacheKey: (month, year) => `${year}-${month}`,
      ...options,
    };
  }

  /**
   * Set data for a specific date
   * @param {string} dateKey - ISO date string (YYYY-MM-DD)
   * @param {Object} data - Data for that date
   */
  set(dateKey, data) {
    this.#data.set(dateKey, data);
  }

  /**
   * Get data for a specific date
   * @param {string} dateKey - ISO date string (YYYY-MM-DD)
   * @returns {Object|null}
   */
  get(dateKey) {
    return this.#data.get(dateKey) || null;
  }

  /**
   * Check if data exists for date
   * @param {string} dateKey
   * @returns {boolean}
   */
  has(dateKey) {
    return this.#data.has(dateKey);
  }

  /**
   * Set data for entire month
   * @param {number} month - 0-11
   * @param {number} year
   * @param {Object} data - Object with date keys
   */
  setMonth(month, year, data) {
    if (!data || typeof data !== 'object') return;

    // Store each date
    Object.entries(data).forEach(([dateKey, value]) => {
      this.#data.set(dateKey, value);
    });

    // Cache month if enabled
    if (this.#options.cache) {
      const cacheKey = this.#options.cacheKey(month, year);
      this.#cache.set(cacheKey, true);
    }
  }

  /**
   * Check if month is cached
   * @param {number} month
   * @param {number} year
   * @returns {boolean}
   */
  isMonthCached(month, year) {
    if (!this.#options.cache) return false;
    const cacheKey = this.#options.cacheKey(month, year);
    return this.#cache.has(cacheKey);
  }

  /**
   * Get all data for a month
   * @param {number} month - 0-11
   * @param {number} year
   * @returns {Object}
   */
  getMonth(month, year) {
    const result = {};
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    this.#data.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Clear all data
   */
  clear() {
    this.#data.clear();
    this.#cache.clear();
  }

  /**
   * Clear cache only
   */
  clearCache() {
    this.#cache.clear();
  }

  /**
   * Get data for date range
   * @param {Date} start
   * @param {Date} end
   * @returns {Object}
   */
  getRange(start, end) {
    const result = {};
    const current = new Date(start);

    while (current <= end) {
      const key = this.#formatDateKey(current);
      if (this.#data.has(key)) {
        result[key] = this.#data.get(key);
      }
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  /**
   * Sum a property across date range
   * @param {Date} start
   * @param {Date} end
   * @param {string} property
   * @returns {number}
   */
  sumRange(start, end, property) {
    const rangeData = this.getRange(start, end);
    return Object.values(rangeData).reduce((sum, data) => {
      return sum + (data[property] || 0);
    }, 0);
  }

  /**
   * Format date to key string
   * @param {Date} date
   * @returns {string}
   */
  #formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Destroy manager
   */
  destroy() {
    this.clear();
  }
}

export default DataManager;
