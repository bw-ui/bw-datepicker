/**
 * PresetsManager
 * Handles built-in and custom presets
 */

export class PresetsManager {
  #presets = [];
  #options;

  constructor(options = {}) {
    this.#options = {
      position: 'left', // 'left' | 'top' | 'bottom' | 'dropdown' | 'none'
      ...options,
    };
  }

  /**
   * Built-in presets
   */
  static BUILT_IN = {
    today: {
      label: 'Today',
      getValue: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [today, new Date(today)];
      },
    },
    yesterday: {
      label: 'Yesterday',
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return [yesterday, new Date(yesterday)];
      },
    },
    last7days: {
      label: 'Last 7 days',
      getValue: () => {
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        return [start, end];
      },
    },
    last30days: {
      label: 'Last 30 days',
      getValue: () => {
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 29);
        return [start, end];
      },
    },
    thisWeek: {
      label: 'This week',
      getValue: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = today.getDay();
        const start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return [start, end];
      },
    },
    lastWeek: {
      label: 'Last week',
      getValue: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = today.getDay();
        const end = new Date(today);
        end.setDate(today.getDate() - dayOfWeek - 1);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        return [start, end];
      },
    },
    thisMonth: {
      label: 'This month',
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return [start, end];
      },
    },
    lastMonth: {
      label: 'Last month',
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        return [start, end];
      },
    },
    thisQuarter: {
      label: 'This quarter',
      getValue: () => {
        const today = new Date();
        const quarter = Math.floor(today.getMonth() / 3);
        const start = new Date(today.getFullYear(), quarter * 3, 1);
        const end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        return [start, end];
      },
    },
    lastQuarter: {
      label: 'Last quarter',
      getValue: () => {
        const today = new Date();
        const quarter = Math.floor(today.getMonth() / 3) - 1;
        const year =
          quarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
        const q = quarter < 0 ? 3 : quarter;
        const start = new Date(year, q * 3, 1);
        const end = new Date(year, q * 3 + 3, 0);
        return [start, end];
      },
    },
    thisYear: {
      label: 'This year',
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear(), 11, 31);
        return [start, end];
      },
    },
    lastYear: {
      label: 'Last year',
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear() - 1, 0, 1);
        const end = new Date(today.getFullYear() - 1, 11, 31);
        return [start, end];
      },
    },
  };

  /**
   * Initialize presets from config
   * @param {Array} presets - Array of preset names or objects
   */
  init(presets) {
    this.#presets = [];

    if (!presets || !Array.isArray(presets)) return;

    presets.forEach((preset) => {
      if (typeof preset === 'string') {
        // Built-in preset by name
        const builtIn = PresetsManager.BUILT_IN[preset];
        if (builtIn) {
          this.#presets.push({ key: preset, ...builtIn });
        }
      } else if (
        typeof preset === 'object' &&
        preset.label &&
        preset.getValue
      ) {
        // Custom preset
        this.#presets.push(preset);
      }
    });
  }

  /**
   * Get all presets
   */
  getPresets() {
    return this.#presets;
  }

  /**
   * Get preset by key/label
   */
  getPreset(key) {
    return this.#presets.find((p) => p.key === key || p.label === key);
  }

  /**
   * Execute preset and get range
   * @param {string} key
   */
  executePreset(key) {
    const preset = this.getPreset(key);
    if (!preset) return null;
    return preset.getValue();
  }

  /**
   * Render presets UI
   * @param {Function} onSelect - Callback when preset selected
   */
  render(onSelect) {
    if (this.#options.position === 'none' || this.#presets.length === 0) {
      return '';
    }

    const positionClass = `bw-presets--${this.#options.position}`;
    const buttons = this.#presets
      .map(
        (preset) =>
          `<button type="button" class="bw-preset-btn" data-preset="${
            preset.key || preset.label
          }">${preset.label}</button>`
      )
      .join('');

    // Dropdown needs different HTML structure
    if (this.#options.position === 'dropdown') {
      return `<div class="bw-presets ${positionClass}">
        <button type="button" class="bw-preset-dropdown-toggle"><span>Select Range</span> <span style="font-size:8px;color:#6b7280;">▼</span></button>
        <div class="bw-preset-dropdown-menu">${buttons}</div>
      </div>`;
    }

    return `<div class="bw-presets ${positionClass}">${buttons}</div>`;
  }

  /**
   * Get position
   */
  getPosition() {
    return this.#options.position;
  }

  /**
   * Destroy
   */
  destroy() {
    this.#presets = [];
  }
}

export default PresetsManager;
