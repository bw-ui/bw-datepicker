/**
 * @bw-ui/datepicker-theming
 * Theming Plugin - Dark mode, CSS variables, custom themes
 */

import { ThemeManager } from './ThemeManager.js';
import { DarkMode } from './DarkMode.js';
import { CSSVariables } from './CSSVariables.js';
import { StyleInjector } from './StyleInjector.js';

export const ThemingPlugin = {
  name: 'theming',
  
  init(api, options = {}) {
    const pickerEl = api.getPickerElement();
    const opts = api.getOptions();
    
    const config = {
      element: pickerEl,
      defaultTheme: options.theme || opts.theme || 'light',
      persist: options.persist !== false,
      storageKey: options.storageKey || 'bw-datepicker-theme',
      customVariables: options.customVariables || {},
    };

    // Apply theme attribute directly
    pickerEl.setAttribute('data-bw-theme', config.defaultTheme);

    // Create manager if class exists
    let manager = null;
    try {
      manager = new ThemeManager(config);
    } catch (e) {
      // Fallback: simple theme toggle
      manager = {
        setTheme: (theme) => pickerEl.setAttribute('data-bw-theme', theme),
        getTheme: () => pickerEl.getAttribute('data-bw-theme'),
        toggle: () => {
          const current = pickerEl.getAttribute('data-bw-theme');
          pickerEl.setAttribute('data-bw-theme', current === 'dark' ? 'light' : 'dark');
        },
        isDark: () => pickerEl.getAttribute('data-bw-theme') === 'dark',
        destroy: () => {},
      };
    }

    // Expose methods to datepicker
    Object.defineProperties(api.datepicker, {
      setTheme: { value: (theme) => { manager.setTheme(theme); pickerEl.setAttribute('data-bw-theme', theme); }, writable: true },
      getTheme: { value: () => manager.getTheme(), writable: true },
      toggleTheme: { value: () => manager.toggle(), writable: true },
      isDark: { value: () => manager.isDark(), writable: true },
    });

    // Emit theme changes
    api.getEventBus().emit('theme:applied', { theme: config.defaultTheme });

    return manager;
  },
  
  destroy(instance) {
    if (instance?.destroy) instance.destroy();
  }
};

export { ThemeManager, DarkMode, CSSVariables, StyleInjector };
export default ThemingPlugin;
