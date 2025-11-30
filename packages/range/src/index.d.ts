/**
 * @bw-ui/datepicker-range
 * Type definitions
 * @version 1.1.0
 */

// ============================================================================
// Plugin Options
// ============================================================================

export interface RangePluginOptions {
  /** Minimum days in range (default: 1) */
  minRange?: number;
  /** Maximum days in range (default: null - unlimited) */
  maxRange?: number | null;
  /** Highlight days between start and end (default: true) */
  highlightRange?: boolean;
  /** Start date input element or selector */
  startInput?: HTMLInputElement | string | null;
  /** End date input element or selector */
  endInput?: HTMLInputElement | string | null;
  /** Date format for inputs (default: 'YYYY-MM-DD') */
  format?: string;
  /** Label for start date (default: 'Start') */
  startLabel?: string;
  /** Label for end date (default: 'End') */
  endLabel?: string;
  /** Preset configurations */
  presets?: (PresetKey | CustomPreset)[];
  /** Position of presets (default: 'left') */
  presetsPosition?: 'left' | 'right' | 'top' | 'bottom' | 'dropdown' | 'none';
  /** Close picker after range complete (default: false) */
  closeOnSelect?: boolean;
}

// ============================================================================
// Presets
// ============================================================================

export type PresetKey =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'lastQuarter'
  | 'thisYear'
  | 'lastYear';

export interface CustomPreset {
  /** Display label */
  label: string;
  /** Key identifier (optional, uses label if not provided) */
  key?: string;
  /** Function that returns [startDate, endDate] */
  getValue: () => [Date, Date];
}

export interface Preset {
  key?: string;
  label: string;
  getValue: () => [Date, Date];
}

// ============================================================================
// Range Data
// ============================================================================

export interface RangeData {
  startDate: Date | null;
  endDate: Date | null;
}

export interface RangeSelectionResult {
  startDate: Date | null;
  endDate: Date | null;
  selecting: 'start' | 'end';
  complete: boolean;
  error?: string;
}

export interface RangeValidation {
  valid: boolean;
  error?: string;
  days?: number;
}

// ============================================================================
// Events
// ============================================================================

export interface RangeChangeEvent {
  startDate: Date | null;
  endDate: Date | null;
  selecting: 'start' | 'end';
}

export interface RangeCompleteEvent {
  startDate: Date;
  endDate: Date;
  days: number;
  nights: number;
}

export interface RangePresetEvent {
  preset: string;
  startDate: Date;
  endDate: Date;
}

export interface RangeErrorEvent {
  error: string;
  preset?: string;
}

// ============================================================================
// Plugin Instance
// ============================================================================

export interface RangePluginInstance {
  /** Get current range */
  getRange(): RangeData;
  /** Set range programmatically */
  setRange(start: Date, end: Date): boolean;
  /** Get number of days in range */
  getDays(): number;
  /** Get number of nights in range (days - 1) */
  getNights(): number;
  /** Reset selection */
  reset(): void;
  /** Apply a preset by key */
  applyPreset(key: string): boolean;
  /** Get available presets */
  getPresets(): Preset[];
  /** Check if currently selecting start or end */
  isSelecting(): 'start' | 'end';
  /** Destroy plugin */
  destroy(): void;
  /** Plugin options */
  options: RangePluginOptions;
}

// ============================================================================
// Plugin
// ============================================================================

export interface RangePlugin {
  name: 'range';
  init(api: any, options?: RangePluginOptions): RangePluginInstance;
  destroy(instance: RangePluginInstance): void;
}

export const RangePlugin: RangePlugin;
export default RangePlugin;

// ============================================================================
// Internal Classes (exported for advanced usage)
// ============================================================================

export class RangeManager {
  constructor(options?: { minRange?: number; maxRange?: number | null });
  select(date: Date): RangeSelectionResult;
  setRange(start: Date, end: Date): void;
  getRange(): RangeData;
  getRangeDays(): number;
  getRangeNights(): number;
  isInRange(date: Date): boolean;
  isStart(date: Date): boolean;
  isEnd(date: Date): boolean;
  getSelecting(): 'start' | 'end';
  reset(): void;
  setOptions(options: { minRange?: number; maxRange?: number | null }): void;
  destroy(): void;
}

export class RangeRenderer {
  constructor(
    rangeManager: RangeManager,
    options?: {
      highlightRange?: boolean;
      startClass?: string;
      endClass?: string;
      inRangeClass?: string;
      hoverClass?: string;
    }
  );
  render(pickerEl: HTMLElement): void;
  setHoverDate(date: Date | null): void;
  getHoverDate(): Date | null;
  destroy(): void;
}

export class PresetsManager {
  constructor(options?: { position?: string });
  static BUILT_IN: Record<
    PresetKey,
    { label: string; getValue: () => [Date, Date] }
  >;
  init(presets: (PresetKey | CustomPreset)[]): void;
  getPresets(): Preset[];
  getPreset(key: string): Preset | undefined;
  executePreset(key: string): [Date, Date] | null;
  render(): string;
  getPosition(): string;
  destroy(): void;
}

export class InputSync {
  constructor(options?: {
    format?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
  });
  init(
    startInput: HTMLInputElement | string | null,
    endInput: HTMLInputElement | string | null
  ): void;
  update(startDate: Date | null, endDate: Date | null): void;
  getStartInput(): HTMLInputElement | null;
  getEndInput(): HTMLInputElement | null;
  clear(): void;
  destroy(): void;
}
