/**
 * @bw-ui/datepicker - TypeScript Definitions
 */

// ============================================================================
// Options
// ============================================================================

export interface BWDatePickerOptions {
  /** Display mode */
  mode?: 'popup' | 'modal' | 'inline';
  /** Date format for input display */
  format?: string;
  /** First day of week: 0 (Sunday) - 6 (Saturday) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Show weekday headers */
  showWeekdays?: boolean;
  /** Show footer with Today/Clear buttons */
  showFooter?: boolean;
  /** Close picker after selecting date */
  closeOnSelect?: boolean;
  /** Allow clicking selected date to deselect */
  allowDeselect?: boolean;
  /** Allow selecting days from adjacent months */
  selectOtherMonths?: boolean;
  /** Minimum selectable date */
  minDate?: Date | null;
  /** Maximum selectable date */
  maxDate?: Date | null;
  /** Array of disabled dates */
  disabledDates?: Date[];
  /** Initial selected date */
  defaultDate?: Date | null;
  /** Custom month names (12 items) */
  monthNames?: string[] | null;
  /** Custom day names (7 items, starting Sunday) */
  dayNames?: string[] | null;
  /** Theme */
  theme?: 'light' | 'dark';
}

// ============================================================================
// Event Payloads
// ============================================================================

export interface DateChangedPayload {
  date: Date | null;
  dateISO: string | null;
  oldDate: Date | null;
}

export interface DateSelectedPayload {
  date: Date;
  dateISO: string;
}

export interface MonthChangedPayload {
  month: number;
  year: number;
}

export interface YearChangedPayload {
  year: number;
}

export interface BeforeOpenPayload {
  cancelled: boolean;
  cancel: () => void;
}

// ============================================================================
// Event Types
// ============================================================================

export type BWDatePickerEventMap = {
  'date:changed': DateChangedPayload;
  'date:selected': DateSelectedPayload;
  'date:cleared': void;
  'picker:opened': void;
  'picker:closed': void;
  'picker:beforeOpen': BeforeOpenPayload;
  'nav:monthChanged': MonthChangedPayload;
  'nav:yearChanged': YearChangedPayload;
  'render:before': { html: string; data: unknown };
  'render:header': { month: number; year: number; monthName: string };
  'render:after': { html: string };
};

export type BWDatePickerEvent = keyof BWDatePickerEventMap;

// ============================================================================
// Plugin System
// ============================================================================

export interface PluginAPI {
  /** Get picker element */
  getPickerElement(): HTMLElement;
  /** Get input element */
  getInputElement(): HTMLInputElement;
  /** Get current options */
  getOptions(): BWDatePickerOptions;
  /** Get event bus */
  getEventBus(): EventBus;
  /** Reference to datepicker instance */
  datepicker: BWDatePicker;
}

export interface Plugin<T = unknown> {
  /** Plugin name */
  name: string;
  /** Initialize plugin */
  init(api: PluginAPI, options?: unknown): T;
  /** Destroy plugin */
  destroy?(instance: T): void;
}

// ============================================================================
// Event Bus
// ============================================================================

export interface EventBus {
  /** Subscribe to event */
  on<K extends BWDatePickerEvent>(
    event: K,
    callback: (payload: BWDatePickerEventMap[K]) => void
  ): void;
  /** Unsubscribe from event */
  off<K extends BWDatePickerEvent>(
    event: K,
    callback: (payload: BWDatePickerEventMap[K]) => void
  ): void;
  /** Emit event */
  emit<K extends BWDatePickerEvent>(
    event: K,
    payload?: BWDatePickerEventMap[K]
  ): BWDatePickerEventMap[K];
}

// ============================================================================
// Main Class
// ============================================================================

export declare class BWDatePicker {
  /**
   * Create a new BWDatePicker instance
   * @param selector - CSS selector or HTMLInputElement
   * @param options - Configuration options
   */
  constructor(selector: string | HTMLInputElement, options?: BWDatePickerOptions);

  // Lifecycle methods
  /** Open the picker */
  open(): this;
  /** Close the picker */
  close(): this;
  /** Destroy the picker instance */
  destroy(): void;

  // Date methods
  /** Set selected date */
  setDate(date: Date | string | null): this;
  /** Get selected date */
  getDate(): Date | null;
  /** Clear selection */
  clear(): this;

  // Navigation methods
  /** Go to previous month */
  prevMonth(): this;
  /** Go to next month */
  nextMonth(): this;
  /** Go to previous year */
  prevYear(): this;
  /** Go to next year */
  nextYear(): this;
  /** Select today */
  today(): this;
  /** Re-render picker */
  refresh(): this;

  // Event methods
  /** Subscribe to event */
  on<K extends BWDatePickerEvent>(
    event: K,
    callback: (payload: BWDatePickerEventMap[K]) => void
  ): this;
  /** Unsubscribe from event */
  off<K extends BWDatePickerEvent>(
    event: K,
    callback: (payload: BWDatePickerEventMap[K]) => void
  ): this;

  // Plugin methods
  /** Use a plugin */
  use<T>(plugin: Plugin<T>, options?: unknown): this;
  /** Get plugin instance by name */
  getPlugin<T = unknown>(name: string): T | null;

  // Getters
  /** Get picker element */
  getPickerElement(): HTMLElement;
  /** Get input element */
  getInputElement(): HTMLInputElement;
  /** Get current options */
  getOptions(): BWDatePickerOptions;
  /** Check if picker is open */
  isOpen(): boolean;
}

// ============================================================================
// Date Utilities (exported from core)
// ============================================================================

export declare function isValidDate(date: unknown): date is Date;
export declare function isSameDay(date1: Date, date2: Date): boolean;
export declare function parseISO(dateString: string): Date | null;
export declare function toISO(date: Date): string;
export declare function formatDate(date: Date, format: string): string;

export declare const MONTH_NAMES: string[];
export declare const DAY_NAMES: string[];

// ============================================================================
// Default Export
// ============================================================================

export default BWDatePicker;
