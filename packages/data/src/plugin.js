/**
 * @bw-ui/datepicker-data
 * Data Plugin - API integration for prices, availability, events
 *
 * Updated for slot-based architecture (v1.1.0):
 * - Uses render:day event for efficient rendering
 * - Uses render:after for fetching (ensures DualCalendar state is ready)
 * - Supports DualCalendar plugin (fetches all visible months)
 * - Supports week view with nav:weekChanged
 * - Only renders in calendar/week views
 *
 * @version 1.1.0
 * @license MIT
 */

import { DataManager } from './DataManager.js';
import { DataFetcher } from './DataFetcher.js';
import { LoadingState } from './LoadingState.js';

export const DataPlugin = {
  name: 'data',

  /**
   * Initialize plugin
   * @param {Object} api - DatePicker API
   * @param {Object} options - Plugin options
   */
  init(api, options = {}) {
    const config = {
      // Data source
      fetch: null,
      data: null,
      fetchPriority: 'replace', // 'replace' | 'merge' | 'fallback'

      // Rendering
      renderDay: null,
      dayClass: null,

      // Display
      expanded: false,

      // Loading options
      showLoading: true,
      loaderType: 'overlay', // 'overlay' | 'calendar' | 'skeleton' | 'spinner'

      // Fetch options
      cache: true,
      retries: 2,
      timeout: 10000,

      ...options,
    };

    const eventBus = api.getEventBus();
    const stateManager = api.getStateManager();
    const pickerEl = api.getPickerElement();

    // Apply expanded mode class
    if (config.expanded) {
      pickerEl.classList.add('bw-datepicker--expanded');
    }

    // Initialize components
    const dataManager = new DataManager({ cache: config.cache });
    const loadingState = new LoadingState({
      showLoading: config.showLoading,
      loaderType: config.loaderType,
    });

    let dataFetcher = null;
    if (config.fetch) {
      dataFetcher = new DataFetcher(config.fetch, {
        retries: config.retries,
        timeout: config.timeout,
      });
    }

    // Load static data if provided
    if (config.data) {
      Object.entries(config.data).forEach(([dateKey, value]) => {
        dataManager.set(dateKey, value);
      });
    }

    /**
     * Check if current view mode supports data display
     */
    const isDataViewMode = () => {
      const viewMode = stateManager.get('viewMode');
      return viewMode === 'calendar' || viewMode === 'week';
    };

    /**
     * Fetch data for month
     */
    const fetchMonthData = async (month, year) => {
      // Skip if not in data view mode
      if (!isDataViewMode()) {
        return;
      }

      // Skip if cached
      if (dataManager.isMonthCached(month, year)) {
        return;
      }

      // Skip if no fetch function
      if (!dataFetcher || !dataFetcher.hasFetchFn()) {
        return;
      }

      // 'fallback' - skip fetch if static data exists for this month
      if (config.fetchPriority === 'fallback') {
        const existingData = dataManager.getMonth(month, year);
        if (Object.keys(existingData).length > 0) {
          return;
        }
      }

      loadingState.setCalendar(pickerEl);
      loadingState.show();

      try {
        const fetchedData = await dataFetcher.fetch(month, year);

        // Check again if still in data view mode (user might have switched)
        if (!isDataViewMode()) {
          return;
        }

        if (config.fetchPriority === 'merge') {
          // Merge: static data fills gaps where fetch has no data
          const existingData = dataManager.getMonth(month, year);
          const mergedData = { ...existingData, ...fetchedData };
          dataManager.setMonth(month, year, mergedData);
        } else {
          // 'replace' (default): fetch overwrites static
          dataManager.setMonth(month, year, fetchedData);
        }

        eventBus.emit('data:loaded', { month, year, data: fetchedData });

        // Trigger re-render to apply data (only if still in data view)
        if (isDataViewMode()) {
          api.refresh();
        }
      } catch (error) {
        eventBus.emit('data:error', { month, year, error });
      } finally {
        loadingState.hide();
      }
    };

    /**
     * Handle render:day event - inject data into day cells
     * This is called for each day during rendering
     */
    const onRenderDay = (eventData) => {
      const { dayData } = eventData;
      if (!dayData || !dayData.dateISO) return;

      const data = dataManager.get(dayData.dateISO);
      if (!data) return;

      // Store data reference on dayData for other plugins
      dayData.customData = data;

      // Add custom class if provided
      let extraClass = '';
      if (config.dayClass) {
        const customClass = config.dayClass(dayData.dateISO, data);
        if (customClass) {
          extraClass = ` ${customClass}`;
        }
      }

      // Render custom content if provided
      let customContent = '';
      if (config.renderDay) {
        const content = config.renderDay(dayData.dateISO, data);
        if (content) {
          customContent = `<div class="bw-day-data">${content}</div>`;
        }
      }

      // Only override HTML if we have custom content or class
      if (customContent || extraClass) {
        const isSelected = dayData.isSelected
          ? ' bw-datepicker__day--selected'
          : '';
        const isToday = dayData.isToday ? ' bw-datepicker__day--today' : '';
        const isDisabled = dayData.isDisabled
          ? ' bw-datepicker__day--disabled'
          : '';
        const isOtherMonth = !dayData.isCurrentMonth
          ? ' bw-datepicker__day--other-month'
          : '';
        const isWeekend = dayData.isWeekend
          ? ' bw-datepicker__day--weekend'
          : '';

        const classes = `bw-datepicker__day${isSelected}${isToday}${isDisabled}${isOtherMonth}${isWeekend}${extraClass}`;

        if (dayData.isDisabled) {
          eventData.html = `<span class="${classes}" role="gridcell" aria-disabled="true" data-bw-data='${JSON.stringify(
            data
          )}'>${dayData.day}${customContent}</span>`;
        } else {
          eventData.html = `<button type="button" class="${classes}" data-date="${
            dayData.dateISO
          }" data-action="select-date" role="gridcell" tabindex="-1" data-bw-data='${JSON.stringify(
            data
          )}'>${dayData.day}${customContent}</button>`;
        }
      }
    };

    /**
     * Handle render:after - fetch data for visible months
     * This fires AFTER all plugins have updated their state
     */
    const onRenderAfter = () => {
      if (!isDataViewMode()) return;
      fetchVisibleMonths();
    };

    /**
     * Handle week change
     */
    const onWeekChange = ({ date }) => {
      if (!date) return;
      const month = date.getMonth();
      const year = date.getFullYear();
      fetchMonthData(month, year);
    };

    /**
     * Handle view mode change
     */
    const onViewChange = ({ viewMode }) => {
      // When switching back to calendar/week view, fetch will happen in render:after
    };

    /**
     * Fetch data for all visible months (supports DualCalendar)
     */
    const fetchVisibleMonths = () => {
      // Check if DualCalendar plugin is active
      const dualPlugin = api.getPlugin ? api.getPlugin('dual-calendar') : null;

      if (dualPlugin && typeof dualPlugin.getAll === 'function') {
        // Fetch data for all visible months in dual calendar
        const calendars = dualPlugin.getAll();
        calendars.forEach(({ month, year }) => {
          fetchMonthData(month, year);
        });
      } else {
        // Single calendar - fetch current month only
        const month = stateManager.get('currentMonth');
        const year = stateManager.get('currentYear');
        fetchMonthData(month, year);
      }
    };

    /**
     * Handle picker open - initial fetch
     */
    const onPickerOpen = () => {
      // Initial fetch will happen in render:after
    };

    // Subscribe to events
    eventBus.on('nav:weekChanged', onWeekChange);
    eventBus.on('view:changed', onViewChange);
    eventBus.on('render:day', onRenderDay);
    eventBus.on('render:after', onRenderAfter);

    // Return instance with API
    const instance = {
      /**
       * Get data for date
       */
      get: (dateKey) => dataManager.get(dateKey),

      /**
       * Set data for date
       */
      set: (dateKey, data) => {
        dataManager.set(dateKey, data);
        if (isDataViewMode()) {
          api.refresh();
        }
      },

      /**
       * Set data for month
       */
      setMonth: (month, year, data) => {
        dataManager.setMonth(month, year, data);
        if (isDataViewMode()) {
          api.refresh();
        }
      },

      /**
       * Get data for range
       */
      getRange: (start, end) => dataManager.getRange(start, end),

      /**
       * Sum property across range
       */
      sumRange: (start, end, property) =>
        dataManager.sumRange(start, end, property),

      /**
       * Refresh data for current month
       */
      refresh: () => {
        const month = stateManager.get('currentMonth');
        const year = stateManager.get('currentYear');
        dataManager.clearCache();
        fetchMonthData(month, year);
      },

      /**
       * Clear all data
       */
      clear: () => {
        dataManager.clear();
        if (isDataViewMode()) {
          api.refresh();
        }
      },

      /**
       * Check if loading
       */
      isLoading: () => loadingState.isLoading(),

      /**
       * Destroy - cleanup
       */
      destroy: () => {
        eventBus.off('nav:weekChanged', onWeekChange);
        eventBus.off('view:changed', onViewChange);
        eventBus.off('render:day', onRenderDay);
        eventBus.off('render:after', onRenderAfter);

        // Remove expanded class
        pickerEl.classList.remove('bw-datepicker--expanded');

        dataManager.destroy();
        dataFetcher?.destroy();
        loadingState.destroy();
      },

      // Store config
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

export { DataManager, DataFetcher, LoadingState };
export default DataPlugin;
