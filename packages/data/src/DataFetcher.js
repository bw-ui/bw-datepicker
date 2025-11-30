/**
 * DataFetcher
 * Handles API calls with retry and debounce
 */

export class DataFetcher {
  #fetchFn;
  #options;
  #pendingRequests = new Map();
  #abortControllers = new Map();

  constructor(fetchFn, options = {}) {
    this.#fetchFn = fetchFn;
    this.#options = {
      retries: 2,
      retryDelay: 1000,
      timeout: 10000,
      debounce: 100,
      ...options,
    };
  }

  /**
   * Fetch data for a month
   * @param {number} month - 0-11
   * @param {number} year
   * @returns {Promise<Object>}
   */
  async fetch(month, year) {
    const key = `${year}-${month}`;

    // Return pending request if exists
    if (this.#pendingRequests.has(key)) {
      return this.#pendingRequests.get(key);
    }

    // Abort previous request for same month
    if (this.#abortControllers.has(key)) {
      this.#abortControllers.get(key).abort();
    }

    const controller = new AbortController();
    this.#abortControllers.set(key, controller);

    const request = this.#executeWithRetry(month, year, controller.signal);
    this.#pendingRequests.set(key, request);

    try {
      const result = await request;
      return result;
    } finally {
      this.#pendingRequests.delete(key);
      this.#abortControllers.delete(key);
    }
  }

  /**
   * Execute fetch with retry logic
   */
  async #executeWithRetry(month, year, signal) {
    let lastError;

    for (let attempt = 0; attempt <= this.#options.retries; attempt++) {
      try {
        if (signal.aborted) {
          throw new Error('Request aborted');
        }

        const result = await this.#executeWithTimeout(month, year, signal);
        return result;
      } catch (error) {
        lastError = error;

        if (signal.aborted || attempt === this.#options.retries) {
          throw error;
        }

        // Wait before retry
        await this.#delay(this.#options.retryDelay * (attempt + 1));
      }
    }

    throw lastError;
  }

  /**
   * Execute fetch with timeout
   */
  async #executeWithTimeout(month, year, signal) {
    const timeoutId = setTimeout(() => {
      if (!signal.aborted) {
        throw new Error('Request timeout');
      }
    }, this.#options.timeout);

    try {
      const result = await this.#fetchFn({ month, year, signal });
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Delay helper
   */
  #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Cancel all pending requests
   */
  cancelAll() {
    this.#abortControllers.forEach((controller) => controller.abort());
    this.#abortControllers.clear();
    this.#pendingRequests.clear();
  }

  /**
   * Check if fetch function is provided
   */
  hasFetchFn() {
    return typeof this.#fetchFn === 'function';
  }

  /**
   * Destroy fetcher
   */
  destroy() {
    this.cancelAll();
    this.#fetchFn = null;
  }
}

export default DataFetcher;
