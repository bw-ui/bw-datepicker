/**
 * @bw-ui/datepicker-theming - TypeScript Definitions
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Options
// ============================================================================

export interface ThemingOptions {
  /** Theme to apply */
  theme?: 'light' | 'dark' | 'auto';
  /** Auto-detect OS theme preference */
  autoDetect?: boolean;
  /** Custom CSS variables */
  customVars?: Record<string, string>;
  /** Persist theme to localStorage */
  persist?: boolean;
  /** localStorage key for persistence */
  storageKey?: string;
}

// ============================================================================
// Theme Manager Instance
// ============================================================================

export interface ThemingInstance {
  /** Set theme */
  setTheme(theme: 'light' | 'dark' | 'auto'): void;
  /** Get current theme */
  getTheme(): 'light' | 'dark' | 'auto';
  /** Toggle between light and dark */
  toggle(): void;
  /** Check if dark mode is active */
  isDark(): boolean;
  /** Destroy and cleanup */
  destroy(): void;
  /** Plugin options */
  options: ThemingOptions;
}

// ============================================================================
// Theme Manager Class
// ============================================================================

export declare class ThemeManager {
  constructor(options?: {
    element?: HTMLElement;
    defaultTheme?: 'light' | 'dark' | 'auto';
    persist?: boolean;
    storageKey?: string;
    customVariables?: Record<string, string>;
  });

  /** Get current theme setting */
  getTheme(): 'light' | 'dark' | 'auto';
  /** Get effective theme (resolves 'auto') */
  getEffectiveTheme(): 'light' | 'dark';
  /** Set theme */
  setTheme(theme: 'light' | 'dark' | 'auto', persist?: boolean): void;
  /** Toggle between light and dark */
  toggle(persist?: boolean): void;
  /** Check if dark mode is active */
  isDark(): boolean;
  /** Check if light mode is active */
  isLight(): boolean;
  /** Check if auto mode is enabled */
  isAuto(): boolean;
  /** Get system preference */
  getSystemPreference(): boolean;
  /** Get CSS variable value */
  getVariable(name: string): string;
  /** Set CSS variable value */
  setVariable(name: string, value: string): void;
  /** Set multiple CSS variables */
  setVariables(variables: Record<string, string>): void;
  /** Inject custom CSS */
  injectCSS(css: string, id?: string): void;
  /** Inject CSS variables */
  injectVariables(variables: Record<string, string>, id?: string): void;
  /** Remove injected CSS by ID */
  removeCSS(id: string): void;
  /** Listen to theme changes */
  onChange(callback: (newTheme: string, oldTheme?: string) => void): () => void;
  /** Clear persisted theme */
  clearStorage(): void;
  /** Reset to default theme */
  reset(persist?: boolean): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Supporting Classes
// ============================================================================

export declare class DarkMode {
  constructor();
  /** Check if system prefers dark mode */
  isDark(): boolean;
  /** Listen to system preference changes */
  onChange(callback: (isDark: boolean) => void): void;
  /** Destroy and cleanup */
  destroy(): void;
}

export declare class CSSVariables {
  constructor(element?: HTMLElement);
  /** Get CSS variable value */
  get(name: string): string;
  /** Set CSS variable value */
  set(name: string, value: string): void;
  /** Set multiple variables */
  setMultiple(variables: Record<string, string>): void;
  /** Remove CSS variable */
  remove(name: string): void;
}

export declare class StyleInjector {
  constructor();
  /** Inject CSS string */
  inject(css: string, id?: string): HTMLStyleElement;
  /** Inject CSS variables */
  injectVariables(variables: Record<string, string>, id?: string): HTMLStyleElement;
  /** Remove injected style by ID */
  remove(id: string): void;
  /** Remove all injected styles */
  removeAll(): void;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const ThemingPlugin: Plugin<ThemingInstance> & {
  name: 'theming';
  init(api: unknown, options?: ThemingOptions): ThemingInstance;
  destroy(instance: ThemingInstance): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default ThemingPlugin;
