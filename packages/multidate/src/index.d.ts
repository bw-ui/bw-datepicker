/**
 * @bw-ui/datepicker-multidate
 * TypeScript Declarations
 *
 * @version 1.1.0
 */

export interface MultiDateOptions {
  /** Maximum number of dates that can be selected (null = unlimited) */
  maxDates?: number | null;
  /** Minimum number of dates required for validation */
  minDates?: number | null;
  /** Date format for input display */
  format?: string;
  /** Separator between dates in input */
  separator?: string;
  /** After this many dates, show "X dates selected" instead */
  maxDisplayDates?: number;
  /** Close picker after each selection */
  closeOnSelect?: boolean;
  /** Auto-close when maxDates is reached */
  closeOnMaxDates?: boolean;
  /** Keep dates sorted chronologically */
  sortDates?: boolean;
  /** Show count badge ("X selected") */
  showCountBadge?: boolean;
  /** Position of count badge: 'footer' | 'header' */
  badgePosition?: 'footer' | 'header';
  /** Show clear all button */
  showClearButton?: boolean;
  /** Clear button text */
  clearButtonText?: string;
  /** Error message timeout in ms (0 = never auto-hide) */
  errorTimeout?: number;
  /** Callback when date is selected */
  onSelect?: (date: Date, dates: Date[]) => void;
  /** Callback when date is deselected */
  onDeselect?: (date: Date, dates: Date[]) => void;
  /** Callback when selection changes */
  onChange?: (dates: Date[]) => void;
}

export interface MultiDateInstance {
  /** Get all selected dates */
  getDates(): Date[];
  /** Get count of selected dates */
  getCount(): number;
  /** Check if a date is selected */
  isSelected(date: Date): boolean;
  /** Add a date to selection */
  addDate(date: Date): boolean;
  /** Remove a date from selection */
  removeDate(date: Date): boolean;
  /** Set dates directly (replaces all) */
  setDates(dates: Date[]): boolean;
  /** Toggle date selection */
  toggleDate(date: Date): { added: Date | null; removed: Date | null };
  /** Clear all selections */
  clear(): void;
  /** Get first selected date */
  getFirst(): Date | null;
  /** Get last selected date */
  getLast(): Date | null;
  /** Validate selection (check minDates requirement) */
  validate(): { valid: boolean; error: string | null };
  /** Destroy plugin */
  destroy(): void;
  /** Plugin options */
  options: MultiDateOptions;
}

export interface MultiDatePlugin {
  name: 'multidate';
  init(api: any, options?: MultiDateOptions): MultiDateInstance;
  destroy(instance: MultiDateInstance): void;
}

export const MultiDatePlugin: MultiDatePlugin;
export default MultiDatePlugin;

export class MultiDateManager {
  constructor(options?: {
    maxDates?: number | null;
    minDates?: number | null;
    sortDates?: boolean;
  });
  toggle(date: Date): {
    dates: Date[];
    added: Date | null;
    removed: Date | null;
    count: number;
    error: string | null;
  };
  add(date: Date): {
    dates: Date[];
    added: Date | null;
    count: number;
    error: string | null;
  };
  remove(date: Date): {
    dates: Date[];
    removed: Date | null;
    count: number;
  };
  setDates(dates: Date[]): {
    dates: Date[];
    count: number;
    error: string | null;
  };
  getDates(): Date[];
  getCount(): number;
  isSelected(date: Date): boolean;
  validate(): { valid: boolean; error: string | null };
  getFirst(): Date | null;
  getLast(): Date | null;
  clear(): void;
  reset(): void;
  setOptions(options: object): void;
  getOptions(): object;
  destroy(): void;
}

export class MultiDateRenderer {
  constructor(
    multiDateManager: MultiDateManager,
    options?: {
      selectedClass?: string;
    }
  );
  render(pickerEl: HTMLElement): void;
  clear(pickerEl: HTMLElement): void;
  setOptions(options: object): void;
  destroy(): void;
}

export class InputSync {
  constructor(options?: {
    format?: string;
    separator?: string;
    maxDisplayDates?: number;
    placeholder?: string;
  });
  setMainInput(input: HTMLElement | string): void;
  update(dates: Date[]): void;
  clear(): void;
  parseDates(): Date[];
  setOptions(options: object): void;
  destroy(): void;
}
