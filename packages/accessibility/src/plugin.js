/**
 * @bw-ui/datepicker-accessibility
 * Accessibility Plugin - Keyboard nav, ARIA, focus trap, screen readers
 */

import { KeyboardNav } from './KeyboardNav.js';
import { FocusTrap } from './FocusTrap.js';
import { Announcer } from './Announcer.js';
import { AriaManager } from './AriaManager.js';
import { HighContrast } from './HighContrast.js';

export const AccessibilityPlugin = {
  name: 'accessibility',
  
  init(api, options = {}) {
    const pickerEl = api.getPickerElement();
    const eventBus = api.getEventBus();
    
    const keyboard = new KeyboardNav(api.datepicker, options);
    const focusTrap = new FocusTrap(options);
    const announcer = new Announcer(options);
    const aria = new AriaManager(pickerEl, options);
    const highContrast = new HighContrast(pickerEl, options);

    eventBus.on('picker:opened', () => {
      // Reset to re-attach listeners on each open
      keyboard.initialized = false;
      keyboard.init(pickerEl);
      focusTrap.activate(pickerEl);
      announcer.announce('Calendar opened', 'assertive');
    });

    eventBus.on('picker:closed', () => {
      focusTrap.deactivate();
      announcer.announce('Calendar closed', 'polite');
    });

    eventBus.on('nav:monthChanged', ({ month, year }) => {
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      announcer.announce(`${monthName} ${year}`, 'polite');
    });

    return { keyboard, focusTrap, announcer, aria, highContrast };
  },
  
  destroy(instance) {
    instance?.keyboard?.destroy?.();
    instance?.focusTrap?.deactivate?.();
    instance?.highContrast?.destroy?.();
  }
};

export { KeyboardNav, FocusTrap, Announcer, AriaManager, HighContrast };
export default AccessibilityPlugin;
