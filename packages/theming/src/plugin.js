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

    // Handle autoDetect option
    let defaultTheme = options.theme || 'light';
    if (options.autoDetect === true) {
      defaultTheme = 'auto';
    }

    const config = {
      element: pickerEl,
      defaultTheme: defaultTheme,
      persist: options.persist || false,
      storageKey: options.storageKey || 'bw-datepicker-theme',
      customVariables: options.customVars || options.customVariables || {},
    };

    // Apply theme attribute directly
    pickerEl.setAttribute('data-bw-theme', config.defaultTheme);

    // Create manager
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
          pickerEl.setAttribute(
            'data-bw-theme',
            current === 'dark' ? 'light' : 'dark'
          );
        },
        isDark: () => pickerEl.getAttribute('data-bw-theme') === 'dark',
        destroy: () => {},
      };
    }

    // Return object with methods for getPlugin()
    const instance = {
      setTheme: (theme) => {
        manager.setTheme(theme);
        pickerEl.setAttribute('data-bw-theme', theme);
      },
      getTheme: () => manager.getTheme(),
      toggle: () => manager.toggle(),
      isDark: () => manager.isDark(),
      destroy: () => manager.destroy(),
      options: config,
    };

    // Emit theme changes
    api.getEventBus().emit('theme:applied', { theme: config.defaultTheme });

    return instance;
  },

  destroy(instance) {
    if (instance?.destroy) instance.destroy();
  },
};

export { ThemeManager, DarkMode, CSSVariables, StyleInjector };
export default ThemingPlugin;
