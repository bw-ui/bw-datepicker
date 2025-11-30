/**
 * @bw-ui/datepicker-range
 * Range Plugin - Date range selection with presets
 *
 * @version 1.1.0
 * @license MIT
 */

import { RangeManager } from './RangeManager.js';
import { RangeRenderer } from './RangeRenderer.js';
import { PresetsManager } from './PresetsManager.js';
import { InputSync } from './InputSync.js';

export const RangePlugin = {
  name: 'range',

  /**
   * Initialize plugin
   * @param {Object} api - DatePicker API
   * @param {Object} options - Plugin options
   */
  init(api, options = {}) {
    const config = {
      // Range options
      minRange: 1,
      maxRange: null,

      // Display
      highlightRange: true,

      // Inputs
      startInput: null,
      endInput: null,
      format: 'YYYY-MM-DD',

      // Labels
      startLabel: 'Start',
      endLabel: 'End',

      // Presets
      presets: [],
      presetsPosition: 'left', // 'left' | 'right' | 'top' | 'bottom' | 'dropdown' | 'none'

      // Behavior
      autoClose: false,
      closeOnSelect: false,

      ...options,
    };

    const eventBus = api.getEventBus();
    const stateManager = api.getStateManager();
    const pickerEl = api.getPickerElement();

    // Auto-disable closeOnSelect for range mode
    try {
      const opts = api.getOptions();
      if (opts.closeOnSelect !== false) {
        if (typeof api.setOption === 'function') {
          api.setOption('closeOnSelect', false);
        } else if (
          api.datepicker &&
          typeof api.datepicker.setOption === 'function'
        ) {
          api.datepicker.setOption('closeOnSelect', false);
        }
      }
    } catch (e) {
      // Silently ignore
    }

    // Initialize components
    const rangeManager = new RangeManager({
      minRange: config.minRange,
      maxRange: config.maxRange,
    });

    const rangeRenderer = new RangeRenderer(rangeManager, {
      highlightRange: config.highlightRange,
    });

    const presetsManager = new PresetsManager({
      position: config.presetsPosition,
    });
    presetsManager.init(config.presets);

    const inputSync = new InputSync({
      format: config.format,
      startPlaceholder: config.startLabel,
      endPlaceholder: config.endLabel,
    });

    // Initialize input sync
    if (config.startInput || config.endInput) {
      // Use separate start/end inputs
      inputSync.init(config.startInput, config.endInput);
    }

    // Always set main input for combined range display
    const mainInput = api.getInputElement();
    if (mainInput) {
      inputSync.setMainInput(mainInput);
    }

    // Track state
    let selectedPresetKey = null;

    // Add range class to picker
    pickerEl.classList.add('bw-datepicker--range');

    /**
     * Check if current view mode supports range display
     */
    const isRangeViewMode = () => {
      const viewMode = stateManager.get('viewMode');
      return !viewMode || viewMode === 'calendar' || viewMode === 'week';
    };

    /**
     * Validate range against min/max constraints
     */
    const validateRange = (startDate, endDate) => {
      if (!startDate || !endDate) return { valid: true };

      const diff = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

      if (config.minRange && days < config.minRange) {
        return {
          valid: false,
          error: `Minimum ${config.minRange} days required`,
        };
      }

      if (config.maxRange && days > config.maxRange) {
        return {
          valid: false,
          error: `Maximum ${config.maxRange} days allowed`,
        };
      }

      return { valid: true, days };
    };

    /**
     * Show error message
     */
    const showError = (message) => {
      const existingError = pickerEl.querySelector('.bw-range-error');
      if (existingError) existingError.remove();

      const errorEl = document.createElement('div');
      errorEl.className = 'bw-range-error';
      errorEl.textContent = message;

      const container = pickerEl.querySelector('.bw-datepicker__container');
      if (container) {
        container.appendChild(errorEl);
        setTimeout(() => errorEl.remove(), 3000);
      }
    };

    /**
     * Handle dropdown toggle
     */
    const onDropdownToggle = (e) => {
      const toggle = e.target.closest('.bw-preset-dropdown-toggle');
      if (!toggle) return;

      e.preventDefault();
      e.stopPropagation();

      const dropdown = toggle.closest('.bw-presets--dropdown');
      if (dropdown) {
        dropdown.classList.toggle('open');
      }
    };

    /**
     * Handle date selection
     */
    const onDateSelect = (e) => {
      const { date } = e;
      if (!date) return;

      const result = rangeManager.select(date);

      // Update inputs
      inputSync.update(result.startDate, result.endDate);

      // Clear preset selection when manually selecting dates
      selectedPresetKey = null;
      const allPresetBtns = pickerEl.querySelectorAll(
        '.bw-preset-btn[data-preset]'
      );
      allPresetBtns.forEach((b) => b.classList.remove('selected'));

      // Update dropdown text back to default
      const dropdown = pickerEl.querySelector('.bw-presets--dropdown');
      if (dropdown) {
        const toggle = dropdown.querySelector('.bw-preset-dropdown-toggle');
        if (toggle) {
          const textSpan = toggle.querySelector('span:first-child');
          if (textSpan) {
            textSpan.textContent = 'Select Range';
          }
        }
      }

      // Emit events
      eventBus.emit('range:change', {
        startDate: result.startDate,
        endDate: result.endDate,
        selecting: result.selecting,
      });

      if (result.complete) {
        eventBus.emit('range:complete', {
          startDate: result.startDate,
          endDate: result.endDate,
          days: rangeManager.getRangeDays(),
          nights: rangeManager.getRangeNights(),
        });

        if (config.closeOnSelect) {
          api.close();
        }
      }

      if (result.error) {
        eventBus.emit('range:error', { error: result.error });
        showError(result.error);
      }

      // Apply range classes
      rangeRenderer.render(pickerEl);
    };

    /**
     * Handle hover for preview
     */
    const onDayHover = (e) => {
      if (rangeManager.getSelecting() !== 'end') return;
      if (!isRangeViewMode()) return;

      const target = e.target.closest('[data-date]');
      if (!target) {
        if (rangeRenderer.getHoverDate()) {
          rangeRenderer.setHoverDate(null);
          rangeRenderer.render(pickerEl);
        }
        return;
      }

      const dateStr = target.getAttribute('data-date');
      if (dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const newHoverDate = new Date(year, month - 1, day);
        const currentHover = rangeRenderer.getHoverDate();

        if (
          !currentHover ||
          currentHover.getTime() !== newHoverDate.getTime()
        ) {
          rangeRenderer.setHoverDate(newHoverDate);
          rangeRenderer.render(pickerEl);
        }
      }
    };

    /**
     * Handle preset selection
     */
    const onPresetClick = (e) => {
      const btn = e.target.closest('[data-preset]');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const presetKey = btn.getAttribute('data-preset');
      const range = presetsManager.executePreset(presetKey);

      if (range && range.length === 2) {
        // Validate against maxRange
        const validation = validateRange(range[0], range[1]);
        if (!validation.valid) {
          eventBus.emit('range:error', {
            error: validation.error,
            preset: presetKey,
          });
          showError(validation.error);
          return;
        }

        rangeManager.setRange(range[0], range[1]);
        inputSync.update(range[0], range[1]);

        // Store selected preset key BEFORE navigation
        selectedPresetKey = presetKey;

        // Navigate to start date month - update state first
        const targetMonth = range[0].getMonth();
        const targetYear = range[0].getFullYear();

        // Set state - this triggers DualCalendar's onStateChange
        stateManager.set({
          currentMonth: targetMonth,
          currentYear: targetYear,
        });

        // Emit events
        eventBus.emit('range:preset', {
          preset: presetKey,
          startDate: range[0],
          endDate: range[1],
        });
        eventBus.emit('range:complete', {
          startDate: range[0],
          endDate: range[1],
          days: rangeManager.getRangeDays(),
          nights: rangeManager.getRangeNights(),
        });

        // Close dropdown if open and update text
        const dropdown = pickerEl.querySelector('.bw-presets--dropdown');
        if (dropdown) {
          dropdown.classList.remove('open');
          const toggle = dropdown.querySelector('.bw-preset-dropdown-toggle');
          if (toggle) {
            const preset = presetsManager.getPreset(presetKey);
            const textSpan = toggle.querySelector('span:first-child');
            if (textSpan) {
              textSpan.textContent = preset?.label || presetKey;
            }
          }
        }

        // Force refresh to update view with new month/year
        api.refresh();

        if (config.closeOnSelect) {
          api.close();
        }
      }
    };

    /**
     * Handle clear button
     */
    const onClear = () => {
      rangeManager.reset();
      inputSync.clear();
      selectedPresetKey = null;

      // Clear preset selection
      const allPresetBtns = pickerEl.querySelectorAll(
        '.bw-preset-btn[data-preset]'
      );
      allPresetBtns.forEach((b) => b.classList.remove('selected'));

      // Reset dropdown text
      const dropdown = pickerEl.querySelector('.bw-presets--dropdown');
      if (dropdown) {
        const toggle = dropdown.querySelector('.bw-preset-dropdown-toggle');
        if (toggle) {
          const textSpan = toggle.querySelector('span:first-child');
          if (textSpan) {
            textSpan.textContent = 'Select Range';
          }
        }
      }

      eventBus.emit('range:reset');
      rangeRenderer.render(pickerEl);
    };

    /**
     * Inject presets into picker (only once)
     */
    const injectPresets = () => {
      if (config.presets.length === 0 || config.presetsPosition === 'none')
        return;

      // Double-check no existing presets
      if (pickerEl.querySelector('.bw-presets')) return;

      const presetsHtml = presetsManager.render();
      if (!presetsHtml) return;

      const calendar =
        pickerEl.querySelector('.bw-datepicker__calendar') ||
        pickerEl.querySelector('.bw-datepicker__slot--calendar');
      const dualWrapper = pickerEl.querySelector('.bw-dual-wrapper');
      const footer =
        pickerEl.querySelector('.bw-datepicker__footer') ||
        pickerEl.querySelector('.bw-datepicker__slot--footer');

      const targetEl = dualWrapper || calendar;
      if (!targetEl) return;

      const isDualMode = !!dualWrapper;

      switch (config.presetsPosition) {
        case 'top':
          targetEl.insertAdjacentHTML('beforebegin', presetsHtml);
          break;

        case 'bottom':
          if (footer) {
            footer.insertAdjacentHTML('beforebegin', presetsHtml);
          } else {
            targetEl.insertAdjacentHTML('afterend', presetsHtml);
          }
          break;

        case 'left':
        case 'right':
          // Create wrapper for side-by-side layout
          const wrapper = document.createElement('div');
          wrapper.className = `bw-range-wrapper bw-range-wrapper--${config.presetsPosition}`;

          if (isDualMode) {
            dualWrapper.parentNode.insertBefore(wrapper, dualWrapper);
            wrapper.appendChild(dualWrapper);
          } else {
            const weekdays = pickerEl.querySelector('.bw-datepicker__weekdays');
            const calendarWrapper = document.createElement('div');
            calendarWrapper.className = 'bw-range-calendar-inner';

            const insertPoint = weekdays || calendar;
            insertPoint.parentNode.insertBefore(wrapper, insertPoint);

            if (weekdays) {
              calendarWrapper.appendChild(weekdays);
            }
            calendarWrapper.appendChild(calendar);
            wrapper.appendChild(calendarWrapper);
          }

          wrapper.insertAdjacentHTML(
            config.presetsPosition === 'left' ? 'afterbegin' : 'beforeend',
            presetsHtml
          );
          break;

        case 'dropdown':
          targetEl.insertAdjacentHTML('beforebegin', presetsHtml);
          break;

        default:
          targetEl.insertAdjacentHTML('beforebegin', presetsHtml);
      }
    };

    /**
     * Handle render:after - apply range classes and inject presets
     */
    const onRenderAfter = () => {
      if (!isRangeViewMode()) return;

      if (!pickerEl.querySelector('.bw-presets')) {
        injectPresets();
      }

      // Inject presets only once

      injectPresets();

      // Always apply range classes after render
      rangeRenderer.render(pickerEl);

      // Restore preset selection state
      if (selectedPresetKey) {
        const allPresetBtns = pickerEl.querySelectorAll(
          '.bw-preset-btn[data-preset]'
        );
        allPresetBtns.forEach((b) => {
          b.classList.toggle(
            'selected',
            b.getAttribute('data-preset') === selectedPresetKey
          );
        });
      }
    };

    /**
     * Handle dual calendar rendered
     */
    const onDualRendered = () => {
      rangeRenderer.render(pickerEl);

      // Re-inject presets if needed (dual calendar rebuilds DOM)
      if (!pickerEl.querySelector('.bw-presets')) {
        injectPresets();
      }

      // Restore preset selection
      if (selectedPresetKey) {
        const allPresetBtns = pickerEl.querySelectorAll(
          '.bw-preset-btn[data-preset]'
        );
        allPresetBtns.forEach((b) => {
          b.classList.toggle(
            'selected',
            b.getAttribute('data-preset') === selectedPresetKey
          );
        });
      }
    };

    /**
     * Handle view mode change
     */
    const onViewChange = ({ viewMode }) => {
      const presetsEl = pickerEl.querySelector('.bw-presets');
      const wrapperEl = pickerEl.querySelector('.bw-range-wrapper');

      if (viewMode === 'month' || viewMode === 'year') {
        if (presetsEl) presetsEl.style.display = 'none';
        if (wrapperEl) wrapperEl.classList.add('bw-range-wrapper--hidden');
      } else {
        if (presetsEl) presetsEl.style.display = '';
        if (wrapperEl) wrapperEl.classList.remove('bw-range-wrapper--hidden');
      }
    };

    // Subscribe to events
    eventBus.on('date:selected', onDateSelect);
    eventBus.on('date:cleared', onClear);
    eventBus.on('render:after', onRenderAfter);
    eventBus.on('dual:rendered', onDualRendered);
    eventBus.on('data:loaded', onRenderAfter);
    eventBus.on('view:changed', onViewChange);

    // Add DOM listeners
    pickerEl.addEventListener('mouseover', onDayHover);
    pickerEl.addEventListener('click', onPresetClick);
    pickerEl.addEventListener('click', onDropdownToggle);

    // Return instance with API
    const instance = {
      /**
       * Get current range
       */
      getRange: () => rangeManager.getRange(),

      /**
       * Set range
       */
      setRange: (start, end) => {
        const validation = validateRange(start, end);
        if (!validation.valid) {
          eventBus.emit('range:error', { error: validation.error });
          return false;
        }

        rangeManager.setRange(start, end);
        inputSync.update(start, end);
        eventBus.emit('range:change', { startDate: start, endDate: end });
        rangeRenderer.render(pickerEl);
        return true;
      },

      /**
       * Get days in range
       */
      getDays: () => rangeManager.getRangeDays(),

      /**
       * Get nights in range
       */
      getNights: () => rangeManager.getRangeNights(),

      /**
       * Reset selection
       */
      reset: () => {
        rangeManager.reset();
        inputSync.clear();
        selectedPresetKey = null;

        const allPresetBtns = pickerEl.querySelectorAll(
          '.bw-preset-btn[data-preset]'
        );
        allPresetBtns.forEach((b) => b.classList.remove('selected'));

        eventBus.emit('range:reset');
        rangeRenderer.render(pickerEl);
      },

      /**
       * Apply preset
       */
      applyPreset: (key) => {
        const range = presetsManager.executePreset(key);
        if (range) {
          const validation = validateRange(range[0], range[1]);
          if (!validation.valid) {
            eventBus.emit('range:error', { error: validation.error });
            return false;
          }

          rangeManager.setRange(range[0], range[1]);
          inputSync.update(range[0], range[1]);
          selectedPresetKey = key;

          const allPresetBtns = pickerEl.querySelectorAll(
            '.bw-preset-btn[data-preset]'
          );
          allPresetBtns.forEach((b) => {
            b.classList.toggle(
              'selected',
              b.getAttribute('data-preset') === key
            );
          });

          rangeRenderer.render(pickerEl);
          return true;
        }
        return false;
      },

      /**
       * Get available presets
       */
      getPresets: () => presetsManager.getPresets(),

      /**
       * Check if selecting
       */
      isSelecting: () => rangeManager.getSelecting(),

      /**
       * Destroy
       */
      destroy: () => {
        eventBus.off('date:selected', onDateSelect);
        eventBus.off('date:cleared', onClear);
        eventBus.off('render:after', onRenderAfter);
        eventBus.off('dual:rendered', onDualRendered);
        eventBus.off('data:loaded', onRenderAfter);
        eventBus.off('view:changed', onViewChange);

        pickerEl.removeEventListener('mouseover', onDayHover);
        pickerEl.removeEventListener('click', onPresetClick);
        pickerEl.removeEventListener('click', onDropdownToggle);

        pickerEl.classList.remove(
          'bw-datepicker--range',
          'bw-datepicker--dual'
        );

        // Remove presets
        const presets = pickerEl.querySelector('.bw-presets');
        if (presets) presets.remove();

        // Unwrap wrapper if exists
        const wrapper = pickerEl.querySelector('.bw-range-wrapper');
        if (wrapper) {
          const container = wrapper.parentNode;
          const innerWrapper = wrapper.querySelector(
            '.bw-range-calendar-inner'
          );

          if (innerWrapper) {
            while (innerWrapper.firstChild) {
              container.insertBefore(innerWrapper.firstChild, wrapper);
            }
          }
          wrapper.remove();
        }

        rangeManager.destroy();
        rangeRenderer.destroy();
        presetsManager.destroy();
        inputSync.destroy();
      },

      options: config,
    };

    return instance;
  },

  /**
   * Destroy plugin
   */
  destroy(instance) {
    if (instance?.destroy) instance.destroy();
  },
};

export { RangeManager, RangeRenderer, PresetsManager, InputSync };
export default RangePlugin;
