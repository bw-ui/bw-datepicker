/**
 * @bw-ui/datepicker-data
 * Type definitions
 *
 * Updated for slot-based architecture (v1.1.0)
 */

// ============================================================================
// Plugin Options
// ============================================================================

export interface DataPluginOptions {
  /** Static data object with date keys */
  data?: Record<string, any> | null;
  /** Async function to fetch data for a month */
  fetch?: FetchFunction | null;
  /** How fetch interacts with static data (default: 'replace') */
  fetchPriority?: 'replace' | 'merge' | 'fallback';
  /** Custom render function for day content */
  renderDay?: RenderDayFunction | null;
  /** Custom class function for day cells */
  dayClass?: DayClassFunction | null;
  /** Enable larger day cells for better readability (default: false) */
  expanded?: boolean;
  /** Cache fetched months (default: true) */
  cache?: boolean;
  /** Show loading indicator while fetching (default: true) */
  showLoading?: boolean;
  /** Type of loading indicator (default: 'overlay') */
  loaderType?: 'overlay' | 'calendar' | 'skeleton' | 'spinner';
  /** Number of retry attempts for failed requests (default: 2) */
  retries?: number;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
}

// ============================================================================
// Function Types
// ============================================================================

export interface FetchParams {
  /** Month (0-11) */
  month: number;
  /** Year (e.g., 2025) */
  year: number;
  /** AbortController signal for cancellation */
  signal: AbortSignal;
}

export type FetchFunction = (
  params: FetchParams
) => Promise<Record<string, any>>;

export type RenderDayFunction = (dateKey: string, data: any | null) => string;

export type DayClassFunction = (dateKey: string, data: any | null) => string;

// ============================================================================
// Data Types
// ============================================================================

/** Date key format: 'YYYY-MM-DD' */
export type DateKey = string;

/** Example data structure for hotel booking */
export interface HotelDayData {
  price: number;
  status: 'available' | 'limited' | 'sold-out';
  rooms?: number;
}

/** Example data structure for events */
export interface EventDayData {
  events: Array<{
    title: string;
    color?: string;
  }>;
}

// ============================================================================
// Events
// ============================================================================

export interface DataLoadedEvent {
  month: number;
  year: number;
  data: Record<string, any>;
}

export interface DataErrorEvent {
  month: number;
  year: number;
  error: Error;
}

// ============================================================================
// Plugin Instance
// ============================================================================

export interface DataPluginInstance {
  /** Get data for specific date */
  get(dateKey: DateKey): any | null;
  /** Set data for specific date */
  set(dateKey: DateKey, data: any): void;
  /** Set data for entire month */
  setMonth(month: number, year: number, data: Record<string, any>): void;
  /** Get data for date range */
  getRange(start: Date, end: Date): Record<string, any>;
  /** Sum a property across date range */
  sumRange(start: Date, end: Date, property: string): number;
  /** Refresh data (clear cache and re-fetch) */
  refresh(): void;
  /** Clear all data */
  clear(): void;
  /** Check if currently loading */
  isLoading(): boolean;
  /** Destroy plugin */
  destroy(): void;
  /** Plugin options */
  options: DataPluginOptions;
}

// ============================================================================
// Plugin
// ============================================================================

export interface DataPlugin {
  name: 'data';
  init(api: any, options?: DataPluginOptions): DataPluginInstance;
  destroy(instance: DataPluginInstance): void;
}

export const DataPlugin: DataPlugin;
export default DataPlugin;

// ============================================================================
// Internal Classes (exported for advanced usage)
// ============================================================================

export class DataManager {
  constructor(options?: { cache?: boolean });
  get(dateKey: DateKey): any | null;
  has(dateKey: DateKey): boolean;
  set(dateKey: DateKey, data: any): void;
  setMonth(month: number, year: number, data: Record<string, any>): void;
  getMonth(month: number, year: number): Record<string, any>;
  isMonthCached(month: number, year: number): boolean;
  getRange(start: Date, end: Date): Record<string, any>;
  sumRange(start: Date, end: Date, property: string): number;
  clearCache(): void;
  clear(): void;
  destroy(): void;
}

export class DataFetcher {
  constructor(
    fetchFn: FetchFunction,
    options?: { retries?: number; timeout?: number }
  );
  fetch(month: number, year: number): Promise<Record<string, any>>;
  hasFetchFn(): boolean;
  cancelAll(): void;
  destroy(): void;
}

export class LoadingState {
  constructor(options?: {
    showLoading?: boolean;
    loaderType?: 'overlay' | 'calendar' | 'skeleton' | 'spinner';
  });
  setCalendar(pickerEl: HTMLElement): void;
  show(): void;
  hide(): void;
  isLoading(): boolean;
  destroy(): void;
}
