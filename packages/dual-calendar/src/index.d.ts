/**
 * @bw-ui/datepicker-dual-calendar
 * Type definitions
 * @version 1.1.0
 */

// ============================================================================
// Plugin Options
// ============================================================================

export interface DualCalendarPluginOptions {
  /** Navigate all calendars together (default: true) */
  linked?: boolean;
  /** Number of months to display: 2-4 (default: 2) */
  months?: number;
  /** Months gap between calendars: 1 = consecutive (default: 1) */
  gap?: number;
  /** Starting month 0-11, null = current (default: null) */
  leftMonth?: number | null;
  /** Starting year, null = current (default: null) */
  leftYear?: number | null;
  /** Navigation button position (default: 'outside') */
  showNavigation?: 'outside' | 'both' | 'left';
}

// ============================================================================
// Calendar State
// ============================================================================

export interface CalendarState {
  month: number;
  year: number;
}

// ============================================================================
// Events
// ============================================================================

export interface DualNavigateEvent {
  left: CalendarState;
  right: CalendarState;
}

// ============================================================================
// Plugin Instance
// ============================================================================

export interface DualCalendarPluginInstance {
  /** Get all calendar states */
  getAll(): CalendarState[];
  /** Get left (first) calendar state */
  getLeft(): CalendarState;
  /** Get right (second) calendar state */
  getRight(): CalendarState;
  /** Get calendar at index */
  getAt(index: number): CalendarState | null;
  /** Get number of months displayed */
  getMonthCount(): number;
  /** Navigate to previous month */
  prevMonth(): void;
  /** Navigate to next month */
  nextMonth(): void;
  /** Navigate to previous year */
  prevYear(): void;
  /** Navigate to next year */
  nextYear(): void;
  /** Navigate specific calendar (independent mode) */
  prevMonthAt(index: number): void;
  /** Navigate specific calendar (independent mode) */
  nextMonthAt(index: number): void;
  /** Go to specific date */
  goToDate(date: Date): void;
  /** Go to today */
  goToToday(): void;
  /** Set linked navigation mode */
  setLinked(linked: boolean): void;
  /** Check if linked mode */
  isLinked(): boolean;
  /** Refresh render */
  refresh(): void;
  /** Destroy plugin */
  destroy(): void;
  /** Plugin options */
  options: DualCalendarPluginOptions;
}

// ============================================================================
// Plugin
// ============================================================================

export interface DualCalendarPlugin {
  name: 'dual-calendar';
  init(
    api: any,
    options?: DualCalendarPluginOptions
  ): DualCalendarPluginInstance;
  destroy(instance: DualCalendarPluginInstance): void;
}

export const DualCalendarPlugin: DualCalendarPlugin;
export default DualCalendarPlugin;

// ============================================================================
// Internal Classes
// ============================================================================

export class DualCalendarManager {
  constructor(options?: {
    linked?: boolean;
    months?: number;
    gap?: number;
    leftMonth?: number | null;
    leftYear?: number | null;
  });
  getAll(): CalendarState[];
  getLeft(): CalendarState;
  getRight(): CalendarState;
  getAt(index: number): CalendarState | null;
  getMonthCount(): number;
  prevMonth(): void;
  nextMonth(): void;
  prevYear(): void;
  nextYear(): void;
  prevMonthAt(index: number): void;
  nextMonthAt(index: number): void;
  setLeft(month: number, year: number): void;
  setRight(month: number, year: number): void;
  setAt(index: number, month: number, year: number): void;
  goToToday(): void;
  goToDate(date: Date): void;
  isLinked(): boolean;
  setLinked(linked: boolean): void;
  destroy(): void;
}

export class DualCalendarRenderer {
  constructor(
    manager: DualCalendarManager,
    options?: {
      showNavigation?: string;
      linked?: boolean;
    }
  );
  setUtils(utils: any): void;
  setApi(api: any): void;
  renderIntoSlot(slot: HTMLElement, stateManager: any): void;
  render(pickerEl: HTMLElement, stateManager: any): void;
  getContainer(): HTMLElement | null;
  destroy(): void;
}
