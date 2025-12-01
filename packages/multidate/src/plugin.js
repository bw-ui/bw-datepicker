/**
 * @bw-ui/datepicker-multidate
 * Multi-Date Plugin - Select multiple individual dates
 *
 * @version 1.1.0
 * @license MIT
 */

import { MultiDateManager } from './MultiDateManager.js';
import { MultiDateRenderer } from './MultiDateRenderer.js';
import { InputSync } from './InputSync.js';

export const MultiDatePlugin = {
  name: 'multidate',

  /**
   * Initialize plugin
   * @param {Object} api - DatePicker API
   * @param {Object} options - Plugin options
   */
  init(api, options = {}) {
    const config = {
      // Selection limits
      maxDates: null, // null = unlimited
      minDates: null, // Minimum required dates

      // Display
      format: 'YYYY-MM-DD',
      separator: ', ',
      maxDisplayDates: 3, // After this, show "X dates selected"

      // Behavior
      closeOnSelect: false, // Close when maxDates reached
      closeOnMaxDates: true, // Auto-close when max dates selected
      sortDates: true, // Keep dates sorted chronologically

      // UI
      showCountBadge: true, // Show "X selected" badge
      badgePosition: 'footer', // 'footer' | 'header'
      showClearButton: true, // Show clear all button
      clearButtonText: 'Clear All',
      errorTimeout: 3000, // Error message timeout in ms (0 = never auto-hide)

      // Callbacks
      onSelect: null,
      onDeselect: null,
      onChange: null,

      ...options,
    };

    const eventBus = api.getEventBus();
    const stateManager = api.getStateManager();
    const pickerEl = api.getPickerElement();

    // Always disable core's closeOnSelect - we handle it ourselves
    try {
      if (typeof api.setOption === 'function') {
        api.setOption('closeOnSelect', false);
      } else if (
        api.datepicker &&
        typeof api.datepicker.setOption === 'function'
      ) {
        api.datepicker.setOption('closeOnSelect', false);
      }
    } catch (e) {
      // Silently ignore
    }

    // Initialize components
    const multiDateManager = new MultiDateManager({
      maxDates: config.maxDates,
      minDates: config.minDates,
      sortDates: config.sortDates,
    });

    const multiDateRenderer = new MultiDateRenderer(multiDateManager, {
      showCountBadge: config.showCountBadge,
      badgePosition: config.badgePosition,
    });

    const inputSync = new InputSync({
      format: config.format,
      separator: config.separator,
      maxDisplayDates: config.maxDisplayDates,
    });

    // Set main input
    const mainInput = api.getInputElement();
    if (mainInput) {
      inputSync.setMainInput(mainInput);
    }

    // Add multidate class to picker
    pickerEl.classList.add('bw-datepicker--multidate');

    /**
     * Check if current view mode supports multidate display
     */
    const isMultiDateViewMode = () => {
      const viewMode = stateManager.get('viewMode');
      return !viewMode || viewMode === 'calendar' || viewMode === 'week';
    };

    /**
     * Close picker helper
     */
    const closePicker = () => {
      if (typeof api.close === 'function') {
        api.close();
      } else if (api.datepicker && typeof api.datepicker.close === 'function') {
        api.datepicker.close();
      }
    };

    /**
     * Show error message
     */
    const showError = (message) => {
      const existingError = pickerEl.querySelector('.bw-multidate-error');
      if (existingError) existingError.remove();

      const errorEl = document.createElement('div');
      errorEl.className = 'bw-multidate-error';
      errorEl.textContent = message;

      const container = pickerEl.querySelector('.bw-datepicker__container');
      if (container) {
        container.appendChild(errorEl);

        // Use configurable timeout (0 = never auto-hide)
        if (config.errorTimeout > 0) {
          setTimeout(() => errorEl.remove(), config.errorTimeout);
        }
      }
    };

    /**
     * Inject header badge
     */
    const injectHeaderBadge = () => {
      if (!config.showCountBadge || config.badgePosition !== 'header') return;
      if (pickerEl.querySelector('.bw-multidate-badge')) return;

      const header = pickerEl.querySelector('.bw-datepicker__header');
      if (!header) return;

      // Make header relative for absolute positioning
      header.style.position = 'relative';

      const badge = document.createElement('span');
      badge.className = 'bw-multidate-badge bw-multidate-badge--header';
      badge.style.display = 'none';
      header.appendChild(badge);
    };

    /**
     * Inject footer with clear button and badge
     */
    const injectFooter = () => {
      // Check if we need footer at all
      const needsBadgeInFooter =
        config.showCountBadge && config.badgePosition === 'footer';
      const needsClearButton = config.showClearButton;

      if (!needsBadgeInFooter && !needsClearButton) return;

      // Don't duplicate
      if (pickerEl.querySelector('.bw-multidate-footer')) return;

      const container = pickerEl.querySelector('.bw-datepicker__container');
      if (!container) return;

      // Create footer
      const footer = document.createElement('div');
      footer.className = 'bw-multidate-footer';

      // Add modifier class if only clear button (no badge)
      if (!needsBadgeInFooter && needsClearButton) {
        footer.classList.add('bw-multidate-footer--button-only');
      }

      // Add badge if enabled and position is footer
      if (needsBadgeInFooter) {
        const badge = document.createElement('span');
        badge.className = 'bw-multidate-badge';
        badge.style.display = 'none';
        footer.appendChild(badge);
      }

      // Add clear button if enabled
      if (needsClearButton) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'bw-multidate-clear';
        clearBtn.textContent = config.clearButtonText;
        clearBtn.style.display = 'none';
        footer.appendChild(clearBtn);
      }

      container.appendChild(footer);
    };

    /**
     * Update count badge
     */
    const updateCountBadge = () => {
      if (!config.showCountBadge) return;

      let badge = pickerEl.querySelector('.bw-multidate-badge');
      const count = multiDateManager.getCount();

      if (count === 0) {
        if (badge) badge.style.display = 'none';
        return;
      }

      if (badge) {
        badge.textContent = `${count} selected`;
        badge.style.display = '';
      }
    };

    /**
     * Update clear button visibility
     */
    const updateClearButton = () => {
      const clearBtn = pickerEl.querySelector('.bw-multidate-clear');
      if (clearBtn) {
        clearBtn.style.display = multiDateManager.getCount() > 0 ? '' : 'none';
      }
    };

    /**
     * Handle date click directly on the picker element
     * This bypasses the core's date:selected event to prevent interference
     */
    const onDayClick = (e) => {
      const dayEl = e.target.closest('[data-date]');
      if (!dayEl) return;

      // Don't handle if it's disabled
      if (
        dayEl.classList.contains('bw-datepicker__day--disabled') ||
        dayEl.classList.contains('bw-dual-day--disabled') ||
        dayEl.hasAttribute('disabled')
      ) {
        return;
      }

      const dateStr = dayEl.getAttribute('data-date');
      if (!dateStr) return;

      // Parse date
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      // Prevent core from handling this
      e.preventDefault();
      e.stopPropagation();

      const result = multiDateManager.toggle(date);

      // Update input
      inputSync.update(result.dates);

      // Update UI
      updateClearButton();
      updateCountBadge();

      // Emit events and callbacks
      if (result.added) {
        eventBus.emit('multidate:select', {
          date: result.added,
          dates: result.dates,
          count: result.count,
        });

        if (config.onSelect) {
          config.onSelect(result.added, result.dates);
        }

        // Check if we should close (reached maxDates)
        if (
          config.closeOnSelect ||
          (config.closeOnMaxDates &&
            config.maxDates &&
            result.count >= config.maxDates)
        ) {
          setTimeout(() => closePicker(), 100);
        }
      }

      if (result.removed) {
        eventBus.emit('multidate:deselect', {
          date: result.removed,
          dates: result.dates,
          count: result.count,
        });

        if (config.onDeselect) {
          config.onDeselect(result.removed, result.dates);
        }
      }

      eventBus.emit('multidate:change', {
        dates: result.dates,
        count: result.count,
        added: result.added,
        removed: result.removed,
      });

      if (config.onChange) {
        config.onChange(result.dates);
      }

      if (result.error) {
        eventBus.emit('multidate:error', { error: result.error });
        showError(result.error);
      }

      // Apply selected classes
      multiDateRenderer.render(pickerEl);
    };

    /**
     * Intercept core's date:selected to prevent default single-date behavior
     */
    const onDateSelect = (e) => {
      // Return true to intercept and prevent core from handling
      return true;
    };

    /**
     * Handle clear button click
     */
    const onClearClick = (e) => {
      const clearBtn = e.target.closest('.bw-multidate-clear');
      if (!clearBtn) return;

      e.preventDefault();
      e.stopPropagation();

      multiDateManager.clear();
      inputSync.clear();
      updateClearButton();
      updateCountBadge();

      eventBus.emit('multidate:clear');
      eventBus.emit('multidate:change', {
        dates: [],
        count: 0,
        added: null,
        removed: null,
      });

      if (config.onChange) {
        config.onChange([]);
      }

      multiDateRenderer.render(pickerEl);
    };

    /**
     * Handle date cleared (from core)
     */
    const onClear = () => {
      multiDateManager.clear();
      inputSync.clear();
      updateClearButton();
      updateCountBadge();
      multiDateRenderer.render(pickerEl);
    };

    /**
     * Handle render:after - apply selected classes and inject UI
     */
    const onRenderAfter = () => {
      if (!isMultiDateViewMode()) return;

      injectHeaderBadge();
      injectFooter();
      updateClearButton();
      updateCountBadge();
      multiDateRenderer.render(pickerEl);
    };

    /**
     * Handle dual calendar rendered
     */
    const onDualRendered = () => {
      multiDateRenderer.render(pickerEl);
      injectHeaderBadge();
      injectFooter();
      updateClearButton();
      updateCountBadge();
    };

    /**
     * Handle view mode change
     */
    const onViewChange = ({ viewMode }) => {
      const clearBtn = pickerEl.querySelector('.bw-multidate-clear');
      const badge = pickerEl.querySelector('.bw-multidate-badge');
      const footer = pickerEl.querySelector('.bw-multidate-footer');

      if (viewMode === 'month' || viewMode === 'year') {
        if (clearBtn) clearBtn.style.display = 'none';
        if (badge) badge.style.display = 'none';
        if (footer) footer.style.display = 'none';
      } else {
        if (footer) footer.style.display = '';
        updateClearButton();
        updateCountBadge();
      }
    };

    // Subscribe to events
    eventBus.on('date:selected', onDateSelect);
    eventBus.on('date:cleared', onClear);
    eventBus.on('render:after', onRenderAfter);
    eventBus.on('dual:rendered', onDualRendered);
    eventBus.on('data:loaded', onRenderAfter);
    eventBus.on('view:changed', onViewChange);

    // Add DOM listeners - use capture phase to intercept before core
    pickerEl.addEventListener('click', onDayClick, true);
    pickerEl.addEventListener('click', onClearClick);

    // Return instance with API
    const instance = {
      /**
       * Get all selected dates
       * @returns {Date[]}
       */
      getDates: () => multiDateManager.getDates(),

      /**
       * Get count of selected dates
       * @returns {number}
       */
      getCount: () => multiDateManager.getCount(),

      /**
       * Check if date is selected
       * @param {Date} date
       * @returns {boolean}
       */
      isSelected: (date) => multiDateManager.isSelected(date),

      /**
       * Add a date
       * @param {Date} date
       * @returns {boolean} Success
       */
      addDate: (date) => {
        const result = multiDateManager.add(date);
        if (result.added) {
          inputSync.update(result.dates);
          updateClearButton();
          multiDateRenderer.render(pickerEl);
          eventBus.emit('multidate:change', {
            dates: result.dates,
            count: result.count,
            added: result.added,
            removed: null,
          });
          return true;
        }
        if (result.error) {
          showError(result.error);
        }
        return false;
      },

      /**
       * Remove a date
       * @param {Date} date
       * @returns {boolean} Success
       */
      removeDate: (date) => {
        const result = multiDateManager.remove(date);
        inputSync.update(result.dates);
        updateClearButton();
        multiDateRenderer.render(pickerEl);
        eventBus.emit('multidate:change', {
          dates: result.dates,
          count: result.count,
          added: null,
          removed: result.removed,
        });
        return result.removed !== null;
      },

      /**
       * Set dates directly (replaces all)
       * @param {Date[]} dates
       * @returns {boolean} Success
       */
      setDates: (dates) => {
        const result = multiDateManager.setDates(dates);
        if (!result.error) {
          inputSync.update(result.dates);
          updateClearButton();
          multiDateRenderer.render(pickerEl);
          eventBus.emit('multidate:change', {
            dates: result.dates,
            count: result.count,
            added: null,
            removed: null,
          });
          return true;
        }
        showError(result.error);
        return false;
      },

      /**
       * Toggle date selection
       * @param {Date} date
       * @returns {Object} { added, removed }
       */
      toggleDate: (date) => {
        const result = multiDateManager.toggle(date);
        inputSync.update(result.dates);
        updateClearButton();
        multiDateRenderer.render(pickerEl);
        eventBus.emit('multidate:change', {
          dates: result.dates,
          count: result.count,
          added: result.added,
          removed: result.removed,
        });
        return { added: result.added, removed: result.removed };
      },

      /**
       * Clear all selections
       */
      clear: () => {
        multiDateManager.clear();
        inputSync.clear();
        updateClearButton();
        multiDateRenderer.render(pickerEl);
        eventBus.emit('multidate:clear');
        eventBus.emit('multidate:change', {
          dates: [],
          count: 0,
          added: null,
          removed: null,
        });
      },

      /**
       * Get first selected date
       * @returns {Date|null}
       */
      getFirst: () => multiDateManager.getFirst(),

      /**
       * Get last selected date
       * @returns {Date|null}
       */
      getLast: () => multiDateManager.getLast(),

      /**
       * Validate selection (check minDates requirement)
       * @returns {Object} { valid, error }
       */
      validate: () => multiDateManager.validate(),

      /**
       * Destroy plugin
       */
      destroy: () => {
        eventBus.off('date:selected', onDateSelect);
        eventBus.off('date:cleared', onClear);
        eventBus.off('render:after', onRenderAfter);
        eventBus.off('dual:rendered', onDualRendered);
        eventBus.off('data:loaded', onRenderAfter);
        eventBus.off('view:changed', onViewChange);

        pickerEl.removeEventListener('click', onDayClick, true);
        pickerEl.removeEventListener('click', onClearClick);

        pickerEl.classList.remove('bw-datepicker--multidate');

        // Remove UI elements
        const clearBtn = pickerEl.querySelector('.bw-multidate-clear');
        if (clearBtn) clearBtn.remove();

        const badge = pickerEl.querySelector('.bw-multidate-badge');
        if (badge) badge.remove();

        const footer = pickerEl.querySelector('.bw-multidate-footer');
        if (footer) footer.remove();

        multiDateManager.destroy();
        multiDateRenderer.destroy();
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

export { MultiDateManager, MultiDateRenderer, InputSync };
export default MultiDatePlugin;
