/**
 * @bw-ui/datepicker - TypeScript Definitions
 * @version 0.3.0
 */

// ============================================================================
// View Modes
// ============================================================================

export type ViewMode = 'calendar' | 'month' | 'year' | 'week';

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
  /** Show days from adjacent months */
  showOtherMonths?: boolean;
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
  /** Default view mode */
  defaultViewMode?: ViewMode;
  /** Enable month picker on click */
  showMonthPicker?: boolean;
  /** Enable year picker on click */
  showYearPicker?: boolean;
  /** Show year navigation arrows */
  showYearNavigation?: boolean;
  /** Show month navigation arrows */
  showMonthNavigation?: boolean;
  /** Show week navigation arrows */
  showWeekNavigation?: boolean;
  /** Reset to default view on close */
  resetViewOnClose?: boolean;
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

export interface WeekChangedPayload {
  date: Date;
}

export interface ViewChangedPayload {
  viewMode: ViewMode;
}

export interface BeforeOpenPayload {
  cancelled: boolean;
  cancel: () => void;
}

// Slot-based render events
export interface RenderSlot {
  header: HTMLElement;
  calendar: HTMLElement;
  footer: HTMLElement;
}

export interface RenderData {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date | null;
  viewMode: ViewMode;
  weeks: Date[][];
  options: BWDatePickerOptions;
}

export interface RenderBeforePayload {
  data: RenderData;
  slots: RenderSlot;
}

export interface RenderHeaderPayload {
  data: RenderData;
  slot: HTMLElement;
}

export interface RenderCalendarPayload {
  data: RenderData;
  slot: HTMLElement;
  viewMode: ViewMode;
}

export interface RenderFooterPayload {
  data: RenderData;
  slot: HTMLElement;
}

export interface RenderAfterPayload {
  data: RenderData;
  slots: RenderSlot;
  element: HTMLElement;
}

export interface RenderDayPayload {
  dayData: {
    date: Date;
    dateISO: string;
    day: number;
    dayOfWeek: number;
    dayName: string;
    isToday: boolean;
    isSelected: boolean;
    isWeekend: boolean;
    isCurrentMonth: boolean;
    isDisabled: boolean;
  };
  html: string | null;
}

// ============================================================================
// Event Types
// ============================================================================

export type BWDatePickerEventMap = {
  'date:changed': DateChangedPayload;
  'date:selected': DateSelectedPayload;
  'date:cleared': void;
  'date:beforeSelect': { date: Date; cancelled: boolean; cancel: () => void };
  'picker:opened': void;
  'picker:closed': void;
  'picker:beforeOpen': BeforeOpenPayload;
  'picker:beforeClose': { cancelled: boolean; cancel: () => void };
  'picker:init': { options: BWDatePickerOptions };
  'picker:ready': void;
  'picker:destroy': void;
  'nav:monthChanged': MonthChangedPayload;
  'nav:yearChanged': YearChangedPayload;
  'nav:weekChanged': WeekChangedPayload;
  'view:changed': ViewChangedPayload;
  // Slot-based render events
  'render:before': RenderBeforePayload;
  'render:header': RenderHeaderPayload;
  'render:calendar': RenderCalendarPayload;
  'render:footer': RenderFooterPayload;
  'render:after': RenderAfterPayload;
  'render:day': RenderDayPayload;
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
  /** Set option */
  setOption(key: string, value: unknown): void;
  /** Get event bus */
  getEventBus(): EventBus;
  /** Get state manager */
  getStateManager(): StateManager;
  /** Get selected date */
  getDate(): Date | null;
  /** Set selected date */
  setDate(date: Date | null): void;
  /** Open picker */
  open(): void;
  /** Close picker */
  close(): void;
  /** Force re-render */
  refresh(): void;
  /** Get plugin instance */
  getPlugin<T = unknown>(name: string): T | null;
  /** Check if plugin exists */
  hasPlugin(name: string): boolean;
  /** Reference to datepicker instance */
  datepicker: BWDatePicker;
  /** Utility functions */
  utils: {
    generateCalendarMonth: (
      year: number,
      month: number,
      firstDayOfWeek?: number
    ) => Date[][];
    MONTH_NAMES: string[];
    DAY_NAMES: string[];
  };
}

export interface StateManager {
  /** Get state value */
  get(key: string): unknown;
  /** Set state value(s) */
  set(keyOrObject: string | Record<string, unknown>, value?: unknown): void;
  /** Observe state changes */
  observe(
    key: string,
    callback: (payload: { key: string; value: unknown }) => void
  ): () => void;
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
  constructor(
    selector: string | HTMLInputElement,
    options?: BWDatePickerOptions
  );

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
  /** Change month by offset */
  changeMonth(offset: number): this;
  /** Change year by offset */
  changeYear(offset: number): this;
  /** Change week by offset */
  changeWeek(offset: number): this;
  /** Navigate to specific date */
  goToDate(date: Date): this;
  /** Navigate to today */
  goToToday(): this;
  /** Re-render picker */
  refresh(): this;

  // View mode methods
  /** Set view mode */
  setViewMode(mode: ViewMode): this;
  /** Get current view mode */
  getViewMode(): ViewMode;

  // Event methods
  /** Subscribe to event */
  on<K extends keyof BWDatePickerEventMap>(
    event: K,
    callback: (payload: BWDatePickerEventMap[K]) => void | boolean
  ): this;
  /** Unsubscribe from event */
  off<K extends keyof BWDatePickerEventMap>(
    event: K,
    callback: (payload: BWDatePickerEventMap[K]) => void | boolean
  ): this;

  // Plugin methods
  /** Use a plugin */
  use<T>(plugin: Plugin<T>, options?: unknown): this;
  /** Get plugin instance by name */
  getPlugin<T = unknown>(name: string): T | null;
  /** Check if plugin exists */
  hasPlugin(name: string): boolean;

  // Getters
  /** Get picker element */
  getPickerElement(): HTMLElement;
  /** Get input element */
  getInputElement(): HTMLInputElement;
  /** Get current options */
  getOptions(): BWDatePickerOptions;
  /** Get state manager */
  getStateManager(): StateManager;
  /** Get event bus */
  getEventBus(): EventBus;
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
