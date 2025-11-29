/**
 * @bw-ui/datepicker-locale - TypeScript Definitions
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Options
// ============================================================================

export interface LocaleOptions {
  /** BCP 47 locale code or preset name */
  locale?: string;
  /** Use browser's Intl API */
  useIntl?: boolean;
  /** Custom month names (12 items) */
  monthNames?: string[] | null;
  /** Custom short month names */
  monthNamesShort?: string[] | null;
  /** Custom day names (7 items, starting Sunday) */
  dayNames?: string[] | null;
  /** Custom short day names */
  dayNamesShort?: string[] | null;
  /** Custom narrow day names (single letter) */
  dayNamesNarrow?: string[] | null;
  /** First day of week: 0 (Sunday) - 6 (Saturday) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Right-to-left layout */
  rtl?: boolean;
}

// ============================================================================
// Locale Preset
// ============================================================================

export interface LocalePreset {
  locale: string;
  monthNames: string[];
  dayNames: string[];
  dayNamesShort: string[];
  firstDayOfWeek: number;
  rtl?: boolean;
}

// ============================================================================
// Locale Instance
// ============================================================================

export interface LocaleInstance {
  /** Get locale manager */
  getManager(): LocaleManager;
  /** Get current locale */
  getLocale(): string;
  /** Set locale */
  setLocale(locale: string): void;
  /** Get month name */
  getMonthName(month: number, format?: 'long' | 'short' | 'narrow'): string;
  /** Get all month names */
  getMonthNames(format?: 'long' | 'short' | 'narrow'): string[];
  /** Get day name */
  getDayName(day: number, format?: 'long' | 'short' | 'narrow'): string;
  /** Get all day names */
  getDayNames(format?: 'long' | 'short' | 'narrow', firstDay?: number): string[];
  /** Format date with locale */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string;
  /** Get relative time */
  getRelativeTime(date: Date): string;
  /** Destroy and cleanup */
  destroy(): void;
  /** Plugin options */
  options: LocaleOptions;
}

// ============================================================================
// Locale Manager
// ============================================================================

export declare class LocaleManager {
  constructor(options?: {
    locale?: string;
    useIntl?: boolean;
    monthNames?: string[] | null;
    monthNamesShort?: string[] | null;
    dayNames?: string[] | null;
    dayNamesShort?: string[] | null;
    dayNamesNarrow?: string[] | null;
  });

  /** Get current locale */
  getLocale(): string;
  /** Set locale */
  setLocale(locale: string): void;
  /** Get month name */
  getMonthName(month: number, format?: 'long' | 'short' | 'narrow'): string;
  /** Get all month names */
  getMonthNames(format?: 'long' | 'short' | 'narrow'): string[];
  /** Get day name */
  getDayName(day: number, format?: 'long' | 'short' | 'narrow'): string;
  /** Get all day names */
  getDayNames(format?: 'long' | 'short' | 'narrow', firstDayOfWeek?: number): string[];
  /** Format date using locale */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string;
  /** Get relative time string */
  getRelativeTime(date: Date): string;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Built-in Presets
// ============================================================================

export declare const en_US: LocalePreset;
export declare const en_GB: LocalePreset;
export declare const es_ES: LocalePreset;
export declare const fr_FR: LocalePreset;
export declare const de_DE: LocalePreset;
export declare const it_IT: LocalePreset;
export declare const pt_BR: LocalePreset;
export declare const nl_NL: LocalePreset;
export declare const ru_RU: LocalePreset;
export declare const ja_JP: LocalePreset;
export declare const zh_CN: LocalePreset;
export declare const ko_KR: LocalePreset;
export declare const ar_SA: LocalePreset;
export declare const hi_IN: LocalePreset;
export declare const tr_TR: LocalePreset;
export declare const pl_PL: LocalePreset;
export declare const sv_SE: LocalePreset;

/** All presets map */
export declare const PRESETS: Record<string, LocalePreset>;

/** Get preset by locale code */
export declare function getPreset(locale: string): LocalePreset | null;

/** Get list of available locales */
export declare function getAvailableLocales(): string[];

// ============================================================================
// Plugin
// ============================================================================

export declare const LocalePlugin: Plugin<LocaleInstance> & {
  name: 'locale';
  init(api: unknown, options?: LocaleOptions): LocaleInstance;
  destroy(instance: LocaleInstance): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default LocalePlugin;
