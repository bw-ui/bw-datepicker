/**
 * @bw-ui/datepicker-dual-calendar
 * Dual Calendar Plugin - Multiple months side by side
 *
 * Updated for slot-based architecture (v1.1.0):
 * - Intercepts render:calendar to prevent default calendar
 * - Intercepts render:header to hide default header
 * - Emits render:day events for each day (Data plugin compatibility)
 * - Renders directly into slots
 * - Syncs state on nav:monthChanged
 *
 * @version 1.1.0
 */

import { DualCalendarManager } from './DualCalendarManager.js';
import { DualCalendarRenderer } from './DualCalendarRenderer.js';

export const DualCalendarPlugin = {
  name: 'dual-calendar',

  /**
   * Initialize plugin
   * @param {Object} api - Plugin API from core
   * @param {Object} options - Plugin options
   */
  init(api, options = {}) {
    const config = {
      // Navigation
      linked: true, // Navigate all calendars together
      months: 2, // Number of months to show (2-4)
      gap: 1, // Months gap between calendars (1 = consecutive)

      // Starting position
      leftMonth: null, // Starting month (0-11), null = current
      leftYear: null, // Starting year, null = current

      // Display
      showNavigation: 'outside', // 'outside' | 'both' | 'left'

      ...options,
    };

    // Clamp months between 2-4
    config.months = Math.max(2, Math.min(4, config.months));

    const eventBus = api.getEventBus();
    const pickerEl = api.getPickerElement();
    const stateManager = api.getStateManager();

    // Add dual calendar class with month count
    pickerEl.classList.add('bw-datepicker--dual');
    pickerEl.classList.add(`bw-datepicker--dual-${config.months}`);

    // Initialize manager
    const manager = new DualCalendarManager({
      linked: config.linked,
      months: config.months,
      gap: config.gap,
      leftMonth: config.leftMonth,
      leftYear: config.leftYear,
    });

    // Initialize renderer
    const renderer = new DualCalendarRenderer(manager, {
      showNavigation: config.showNavigation,
      linked: config.linked,
    });

    // Pass utils and api to renderer
    renderer.setUtils(api.utils);
    renderer.setApi(api);

    // Sync with core state on init (if no leftMonth specified)
    if (config.leftMonth === null) {
      const currentMonth = stateManager.get('currentMonth');
      const currentYear = stateManager.get('currentYear');
      if (currentMonth !== undefined && currentYear !== undefined) {
        manager.setLeft(currentMonth, currentYear);
      }
    }

    /**
     * Handle navigation clicks
     */
    const onNavClick = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-action');

      // Check for index-specific actions (for independent mode)
      const indexMatch = action.match(/^(prev|next)-month-(\d+)$/);

      if (indexMatch) {
        const [, direction, indexStr] = indexMatch;
        const index = parseInt(indexStr, 10);

        if (direction === 'prev') {
          manager.prevMonthAt(index);
        } else {
          manager.nextMonthAt(index);
        }
      } else {
        switch (action) {
          case 'prev-month':
            manager.prevMonth();
            break;
          case 'next-month':
            manager.nextMonth();
            break;
          case 'prev-year':
            manager.prevYear();
            break;
          case 'next-year':
            manager.nextYear();
            break;
        }
      }

      // Update core state to match left calendar
      const left = manager.getLeft();
      stateManager.set({
        currentMonth: left.month,
        currentYear: left.year,
      });

      // Re-render by triggering refresh
      api.refresh();

      // Emit event
      eventBus.emit('dual:navigate', {
        calendars: manager.getAll(),
        left: manager.getLeft(),
        right: manager.getRight(),
      });
    };

    /**
     * Handle day click - emit event for other plugins (like Range)
     */
    const onDayClick = (e) => {
      const dayEl = e.target.closest('.bw-dual-day[data-date]');
      if (!dayEl || dayEl.classList.contains('bw-dual-day--other')) return;

      const dateStr = dayEl.getAttribute('data-date');
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      // Emit date:selected event for plugins like Range to handle
      eventBus.emit('date:selected', { date });

      // For single selection mode (no Range plugin), set date and re-render
      if (!api.hasPlugin || !api.hasPlugin('range')) {
        api.datepicker.setDate(date);
      }
    };

    /**
     * Sync manager when core navigation changes
     * This ensures getAll() returns correct data when other plugins query it
     */
    const onMonthChanged = ({ month, year }) => {
      const managerLeft = manager.getLeft();
      if (managerLeft.month !== month || managerLeft.year !== year) {
        manager.setLeft(month, year);
      }
    };

    /**
     * Intercept render:header - hide default header
     * Return true to prevent default header rendering
     */
    const onRenderHeader = ({ slot }) => {
      // Clear the header slot - we include our own header in calendar
      if (slot) {
        slot.innerHTML = '';
      }
      return true; // Intercept - don't render default header
    };

    /**
     * Intercept render:calendar - render dual calendar instead
     * Return true to prevent default calendar rendering
     */
    const onRenderCalendar = ({ slot, data }) => {
      if (!slot) return false;

      // Sync manager with current state before rendering (backup sync)
      const currentMonth = stateManager.get('currentMonth');
      const currentYear = stateManager.get('currentYear');
      const managerLeft = manager.getLeft();

      // Only update if different to avoid unnecessary recalculation
      if (
        managerLeft.month !== currentMonth ||
        managerLeft.year !== currentYear
      ) {
        manager.setLeft(currentMonth, currentYear);
      }

      // Render dual calendar into the calendar slot
      renderer.renderIntoSlot(slot, stateManager);

      return true; // Intercept - don't render default calendar
    };

    /**
     * Intercept render:footer - optionally hide footer
     */
    const onRenderFooter = ({ slot }) => {
      // Let core render footer normally, or hide it
      // For now, hide it since dual calendar has its own look
      if (slot) {
        slot.innerHTML = '';
      }
      return true; // Intercept - don't render default footer
    };

    /**
     * Handle render:after - emit dual:rendered for other plugins
     */
    const onRenderAfter = () => {
      // Emit event so Range plugin can apply its classes
      eventBus.emit('dual:rendered');
    };

    // Subscribe to render events (these intercept default rendering)
    // Subscribe to render events (these intercept default rendering)
    eventBus.on('render:header', onRenderHeader);
    eventBus.on('render:calendar', onRenderCalendar);
    eventBus.on('render:footer', onRenderFooter);
    eventBus.on('render:after', onRenderAfter);

    // Subscribe to navigation events - sync manager state
    eventBus.on('nav:monthChanged', onMonthChanged);

    // Add event listeners
    pickerEl.addEventListener('click', onNavClick);
    pickerEl.addEventListener('click', onDayClick);

    // Plugin instance
    const instance = {
      /**
       * Get all calendar states
       */
      getAll: () => manager.getAll(),

      /**
       * Get left (first) calendar state
       */
      getLeft: () => manager.getLeft(),

      /**
       * Get right (second) calendar state
       */
      getRight: () => manager.getRight(),

      /**
       * Get calendar at index
       */
      getAt: (index) => manager.getAt(index),

      /**
       * Get number of months displayed
       */
      getMonthCount: () => manager.getMonthCount(),

      /**
       * Navigate to previous month
       */
      prevMonth: () => {
        manager.prevMonth();
        const left = manager.getLeft();
        stateManager.set({ currentMonth: left.month, currentYear: left.year });
      },

      /**
       * Navigate to next month
       */
      nextMonth: () => {
        manager.nextMonth();
        const left = manager.getLeft();
        stateManager.set({ currentMonth: left.month, currentYear: left.year });
      },

      /**
       * Navigate to previous year
       */
      prevYear: () => {
        manager.prevYear();
        const left = manager.getLeft();
        stateManager.set({ currentMonth: left.month, currentYear: left.year });
      },

      /**
       * Navigate to next year
       */
      nextYear: () => {
        manager.nextYear();
        const left = manager.getLeft();
        stateManager.set({ currentMonth: left.month, currentYear: left.year });
      },

      /**
       * Navigate specific calendar (for independent mode)
       */
      prevMonthAt: (index) => {
        manager.prevMonthAt(index);
        api.refresh();
      },

      /**
       * Navigate specific calendar (for independent mode)
       */
      nextMonthAt: (index) => {
        manager.nextMonthAt(index);
        api.refresh();
      },

      /**
       * Go to specific date
       */
      goToDate: (date) => {
        manager.goToDate(date);
        const left = manager.getLeft();
        stateManager.set({ currentMonth: left.month, currentYear: left.year });
      },

      /**
       * Go to today
       */
      goToToday: () => {
        manager.goToToday();
        const left = manager.getLeft();
        stateManager.set({ currentMonth: left.month, currentYear: left.year });
      },

      /**
       * Set linked mode
       */
      setLinked: (linked) => {
        manager.setLinked(linked);
        api.refresh();
      },

      /**
       * Check if linked
       */
      isLinked: () => manager.isLinked(),

      /**
       * Refresh render
       */
      refresh: () => {
        api.refresh();
      },

      /**
       * Destroy plugin
       */
      destroy: () => {
        eventBus.off('render:header', onRenderHeader);
        eventBus.off('render:calendar', onRenderCalendar);
        eventBus.off('render:footer', onRenderFooter);
        eventBus.off('render:after', onRenderAfter);
        eventBus.off('nav:monthChanged', onMonthChanged);

        pickerEl.removeEventListener('click', onNavClick);
        pickerEl.removeEventListener('click', onDayClick);
        pickerEl.classList.remove('bw-datepicker--dual');
        pickerEl.classList.remove(`bw-datepicker--dual-${config.months}`);

        renderer.destroy();
        manager.destroy();
      },

      options: config,
    };

    return instance;
  },

  /**
   * Destroy plugin
   */
  destroy(instance) {
    if (instance?.destroy) {
      instance.destroy();
    }
  },
};

export { DualCalendarManager, DualCalendarRenderer };
export default DualCalendarPlugin;
