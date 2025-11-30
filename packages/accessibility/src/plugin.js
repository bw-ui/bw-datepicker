/**
 * @bw-ui/datepicker-accessibility
 * Accessibility Plugin - Keyboard nav, ARIA, focus trap, screen readers
 *
 * Updated for slot-based architecture (v1.1.0):
 * - Supports both core and DualCalendar day elements
 * - View mode awareness (calendar/week only)
 * - Uses render:after to setup tabindex after DOM changes
 * - Clicks day elements for selection (Range plugin compatible)
 *
 * @version 1.1.0
 */

import { KeyboardNav } from './KeyboardNav.js';
import { FocusTrap } from './FocusTrap.js';
import { Announcer } from './Announcer.js';
import { AriaManager } from './AriaManager.js';
import { HighContrast } from './HighContrast.js';

// Default options
const DEFAULTS = {
  // Keyboard Navigation
  enableKeyboard: true,

  // Focus Management
  enableFocusTrap: true,
  autoFocus: true,
  returnFocus: true,

  // Screen Reader
  enableAnnouncer: true,
  announcerDelay: 100,

  // ARIA
  enableAria: true,

  // High Contrast
  enableHighContrast: true,
};

export const AccessibilityPlugin = {
  name: 'accessibility',

  init(api, userOptions = {}) {
    // Merge defaults with user options
    const options = Object.assign({}, DEFAULTS, userOptions);
    const pickerEl = api.getPickerElement();
    const inputEl = api.getInputElement();
    const eventBus = api.getEventBus();
    const stateManager = api.getStateManager();

    // Store instances (only create if enabled)
    const instances = {
      keyboard: null,
      focusTrap: null,
      announcer: null,
      aria: null,
      highContrast: null,
    };

    // Helper to check if in calendar/week view mode
    const isNavigableViewMode = () => {
      const viewMode = stateManager.get('viewMode');
      return !viewMode || viewMode === 'calendar' || viewMode === 'week';
    };

    // Initialize Keyboard Navigation
    if (options.enableKeyboard) {
      instances.keyboard = new KeyboardNav(api.datepicker, {
        autoFocus: options.autoFocus,
        returnFocus: options.returnFocus,
      });
    }

    // Initialize Focus Trap
    if (options.enableFocusTrap) {
      instances.focusTrap = new FocusTrap({
        returnFocus: options.returnFocus,
      });
    }

    // Initialize Announcer
    if (options.enableAnnouncer) {
      instances.announcer = new Announcer({
        delay: options.announcerDelay,
      });
    }

    // Initialize ARIA Manager
    if (options.enableAria) {
      instances.aria = new AriaManager(pickerEl, options);
    }

    // Initialize High Contrast
    if (options.enableHighContrast) {
      instances.highContrast = new HighContrast(pickerEl, {
        autoDetect: true,
        applyStyles: true,
      });
    }

    // Event: Picker Opened
    eventBus.on('picker:opened', () => {
      // Keyboard navigation
      if (instances.keyboard && isNavigableViewMode()) {
        instances.keyboard.initialized = false;
        instances.keyboard.init(pickerEl);

        // Auto focus on open
        if (options.autoFocus) {
          instances.keyboard.setInitialFocus();
        }
      }

      // Focus trap
      if (instances.focusTrap) {
        instances.focusTrap.activate(pickerEl);
      }

      // Announce
      if (instances.announcer) {
        instances.announcer.announce('Calendar opened', options.announcerDelay);
      }
    });

    // Event: Picker Closed
    eventBus.on('picker:closed', () => {
      // Deactivate focus trap
      if (instances.focusTrap) {
        instances.focusTrap.deactivate();
      }

      // Return focus to input
      if (options.returnFocus && inputEl) {
        inputEl.focus();
      }

      // Announce
      if (instances.announcer) {
        instances.announcer.announce('Calendar closed', options.announcerDelay);
      }
    });

    // Event: Month Changed
    eventBus.on('nav:monthChanged', ({ month, year }) => {
      if (instances.announcer) {
        const monthName = new Date(year, month).toLocaleString('default', {
          month: 'long',
        });
        instances.announcer.announce(
          `${monthName} ${year}`,
          options.announcerDelay
        );
      }

      // Re-init keyboard after month change
      if (instances.keyboard && isNavigableViewMode()) {
        setTimeout(() => {
          instances.keyboard.initialized = false;
          instances.keyboard.init(pickerEl);
        }, 50);
      }
    });

    // Event: View Changed
    eventBus.on('view:changed', ({ viewMode }) => {
      if (instances.announcer) {
        const viewNames = {
          calendar: 'Calendar view',
          month: 'Month picker',
          year: 'Year picker',
          week: 'Week view',
        };
        instances.announcer.announce(
          viewNames[viewMode] || viewMode,
          options.announcerDelay
        );
      }

      // Re-init keyboard when returning to calendar/week view
      if (
        instances.keyboard &&
        (viewMode === 'calendar' || viewMode === 'week')
      ) {
        setTimeout(() => {
          instances.keyboard.initialized = false;
          instances.keyboard.init(pickerEl);
        }, 50);
      }
    });

    // Event: Render After - reinit keyboard nav after DOM changes
    // Event: Render After - reinit keyboard nav after DOM changes
    eventBus.on('render:after', () => {
      if (instances.keyboard && isNavigableViewMode()) {
        // Re-setup tabindex on all day elements (supports both core and dual calendar)
        const days = pickerEl.querySelectorAll(
          '.bw-datepicker__day, .bw-dual-day'
        );
        days.forEach((day) => {
          if (
            !day.classList.contains('bw-datepicker__day--disabled') &&
            !day.classList.contains('bw-datepicker__day--empty') &&
            !day.classList.contains('bw-dual-day--disabled') &&
            day.textContent.trim()
          ) {
            day.setAttribute('tabindex', '0');
          }
        });
      }
    });

    // Store options for reference
    instances.options = options;

    return instances;
  },

  destroy(instance) {
    if (!instance) return;

    instance.keyboard?.destroy?.();
    instance.focusTrap?.deactivate?.();
    instance.announcer?.destroy?.();
    instance.aria?.destroy?.();
    instance.highContrast?.destroy?.();
  },
};

export { KeyboardNav, FocusTrap, Announcer, AriaManager, HighContrast };
export default AccessibilityPlugin;
