/**
 * ============================================================================
 * @bw-ui/datepicker - Core Package
 * Lightweight, zero-dependency datepicker
 * ============================================================================
 * @version 0.3.0
 * @license MIT
 * ============================================================================
 */

export { DatePickerCore as BWDatePicker, DatePickerCore } from './BWDatePickerCore.js';
export { CoreController } from './BWControllerCore.js';
export { StateManager } from './BWStateManager.js';
export { EventBus } from './BWEventBus.js';
export { CoreRenderer } from './CoreRenderer.js';
export { PluginSystem } from './CorePluginSystem.js';
export { PopupMode, ModalMode, InlineMode } from './modes/index.js';

// NEW: Slot system
export { SlotManager } from './slots/index.js';

// NEW: View modes
export { CalendarView, MonthView, YearView, WeekView } from './views/index.js';

export {
  isValidDate,
  isSameDay,
  parseISO,
  toISO,
  formatDate,
  generateCalendarMonth,
  isWithinRange,
  isDisabled,
  isWeekend,
  MONTH_NAMES,
  DAY_NAMES,
} from './date-utils.js';

export { DatePickerCore as default } from './BWDatePickerCore.js';
