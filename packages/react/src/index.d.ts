/**
 * @bw-ui/datepicker-react
 * TypeScript Definitions
 */

import {
  ForwardRefExoticComponent,
  RefAttributes,
  RefObject,
  CSSProperties,
} from 'react';

// ============================================================================
// Core Types
// ============================================================================

export type DateValue = Date | string | null;

export interface PluginInstance {
  name: string;
  [key: string]: any;
}

export interface DateSelectEvent {
  date: Date | null;
  formatted: string;
  source: 'click' | 'keyboard' | 'api';
}

export interface PickerEvent {
  instance: DatePickerInstance;
}

export interface MonthChangeEvent {
  month: number;
  year: number;
}

export interface YearChangeEvent {
  year: number;
}

// ============================================================================
// Plugin Options
// ============================================================================

export interface ThemingPluginOptions {
  theme?: 'light' | 'dark' | 'auto';
  autoDetect?: boolean;
  persist?: boolean;
  storageKey?: string;
  customVars?: Record<string, string>;
}

export interface AccessibilityPluginOptions {
  announceChanges?: boolean;
  enableKeyboardNav?: boolean;
  enableFocusTrap?: boolean;
  highContrast?: boolean;
}

export interface LocalePluginOptions {
  locale?: string;
  monthNames?: string[];
  dayNames?: string[];
  firstDayOfWeek?: number;
}

export interface MobilePluginOptions {
  enableTouch?: boolean;
  enableSwipe?: boolean;
  breakpoint?: number;
}

export interface PositioningPluginOptions {
  placement?: 'bottom' | 'top' | 'left' | 'right';
  autoFlip?: boolean;
  offset?: number;
}

export interface InputHandlerPluginOptions {
  mask?: string;
  validateOnBlur?: boolean;
  allowTyping?: boolean;
}

export interface DateUtilsPluginOptions {
  parseFormats?: string[];
  strictParsing?: boolean;
}

export interface PluginOptionsMap {
  theming?: ThemingPluginOptions;
  accessibility?: AccessibilityPluginOptions;
  locale?: LocalePluginOptions;
  mobile?: MobilePluginOptions;
  positioning?: PositioningPluginOptions;
  'input-handler'?: InputHandlerPluginOptions;
  'date-utils'?: DateUtilsPluginOptions;
  [key: string]: any;
}

// ============================================================================
// Component Props
// ============================================================================

export interface BWDatePickerProps {
  // Value & Change
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (date: Date | null, event: DateSelectEvent) => void;

  // Core options
  mode?: 'popup' | 'modal' | 'inline';
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;

  // Date constraints
  minDate?: Date | string;
  maxDate?: Date | string;
  disabledDates?: (Date | string)[] | ((date: Date) => boolean);

  // Display options
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  showOtherMonths?: boolean;
  numberOfMonths?: number;

  // Plugins
  plugins?: PluginInstance[];
  pluginOptions?: PluginOptionsMap;

  // Event callbacks
  onOpen?: (event: PickerEvent) => void;
  onClose?: (event: PickerEvent) => void;
  onMonthChange?: (event: MonthChangeEvent) => void;
  onYearChange?: (event: YearChangeEvent) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  // Styling
  className?: string;
  inputClassName?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;

  // Input attributes
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Additional input props
  [key: string]: any;
}

// ============================================================================
// Ref Handle
// ============================================================================

export interface BWDatePickerRef {
  // Core methods
  open: () => void;
  close: () => void;
  toggle: () => void;
  clear: () => void;
  setDate: (date: DateValue) => void;
  getDate: () => Date | null;

  // Navigation
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
  today: () => void;

  // Plugin access
  getPlugin: <T = any>(name: string) => T | null;
  hasPlugin: (name: string) => boolean;

  // DOM access
  getInputElement: () => HTMLInputElement | null;
  getPickerElement: () => HTMLElement | null;

  // Instance access
  getInstance: () => DatePickerInstance | null;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseBWDatePickerOptions {
  // Core options
  mode?: 'popup' | 'modal' | 'inline';
  format?: string;
  defaultDate?: DateValue;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabledDates?: (Date | string)[] | ((date: Date) => boolean);
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  showOtherMonths?: boolean;
  numberOfMonths?: number;

  // Plugins
  plugins?: PluginInstance[];
  pluginOptions?: PluginOptionsMap;

  // Callbacks
  onChange?: (date: Date | null, event: DateSelectEvent) => void;
  onOpen?: (event: PickerEvent) => void;
  onClose?: (event: PickerEvent) => void;
  onMonthChange?: (event: MonthChangeEvent) => void;
  onYearChange?: (event: YearChangeEvent) => void;
}

export interface UseBWDatePickerReturn {
  // Ref to attach to input
  ref: RefObject<HTMLInputElement>;

  // State
  date: Date | null;
  isOpen: boolean;

  // Core methods
  open: () => void;
  close: () => void;
  toggle: () => void;
  setDate: (date: DateValue) => void;
  clear: () => void;

  // Navigation
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
  today: () => void;

  // Plugin access
  getPlugin: <T = any>(name: string) => T | null;
  hasPlugin: (name: string) => boolean;

  // Instance access
  getInstance: () => DatePickerInstance | null;
  getPickerElement: () => HTMLElement | null;
}

// ============================================================================
// Instance Type (from core)
// ============================================================================

export interface DatePickerInstance {
  open: () => DatePickerInstance;
  close: () => DatePickerInstance;
  setDate: (date: DateValue) => DatePickerInstance;
  getDate: () => Date | null;
  clear: () => DatePickerInstance;
  destroy: () => void;
  prevMonth: () => DatePickerInstance;
  nextMonth: () => DatePickerInstance;
  prevYear: () => DatePickerInstance;
  nextYear: () => DatePickerInstance;
  today: () => DatePickerInstance;
  use: (plugin: PluginInstance, options?: any) => DatePickerInstance;
  getPlugin: <T = any>(name: string) => T | null;
  hasPlugin: (name: string) => boolean;
  getEventBus: () => any;
  getStateManager: () => any;
  getPickerElement: () => HTMLElement;
  getInputElement: () => HTMLInputElement;
  getOptions: () => any;
  getInstanceId: () => number;
  on: (event: string, handler: Function) => DatePickerInstance;
  off: (event: string, handler: Function) => DatePickerInstance;
  refresh: () => DatePickerInstance;
}

// ============================================================================
// Exports
// ============================================================================

export const BWDatePicker: ForwardRefExoticComponent<
  BWDatePickerProps & RefAttributes<BWDatePickerRef>
>;

export function useBWDatePicker(
  options?: UseBWDatePickerOptions
): UseBWDatePickerReturn;

export default BWDatePicker;
