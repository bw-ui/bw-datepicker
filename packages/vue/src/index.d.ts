/**
 * @bw-ui/datepicker-vue
 * TypeScript definitions
 */

import { DefineComponent, Ref } from 'vue';

export interface BWDatePickerProps {
  /** Selected date (v-model) */
  modelValue?: Date | string | null;
  /** Default date when uncontrolled */
  defaultValue?: Date | string | null;
  /** Picker mode */
  mode?: 'popup' | 'modal' | 'inline';
  /** Date format string */
  format?: string;
  /** Input placeholder */
  placeholder?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Make input read-only */
  readOnly?: boolean;
  /** Minimum selectable date */
  minDate?: Date | null;
  /** Maximum selectable date */
  maxDate?: Date | null;
  /** Array of disabled dates */
  disabledDates?: Date[];
  /** First day of week (0=Sunday, 1=Monday) */
  firstDayOfWeek?: number;
  /** Show week numbers */
  showWeekNumbers?: boolean;
  /** Show days from other months */
  showOtherMonths?: boolean;
  /** Number of months to display */
  numberOfMonths?: number;
  /** Plugins to register */
  plugins?: any[];
  /** Plugin options keyed by plugin name */
  pluginOptions?: Record<string, any>;
  /** Container CSS class */
  containerClass?: string;
  /** Container inline styles */
  containerStyle?: Record<string, any>;
  /** Input CSS class */
  inputClassName?: string;
  /** Input inline styles */
  inputStyle?: Record<string, any>;
  /** Input id attribute */
  id?: string;
  /** Input name attribute */
  name?: string;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** ARIA describedby */
  ariaDescribedBy?: string;
}

export interface BWDatePickerEmits {
  /** v-model update */
  'update:modelValue': [date: Date | null];
  /** Date changed */
  change: [date: Date | null, data: any];
  /** Picker opened */
  open: [data: any];
  /** Picker closed */
  close: [data: any];
  /** Month changed */
  'month-change': [data: { month: number; year: number }];
  /** Year changed */
  'year-change': [data: { year: number }];
  /** Input focused */
  focus: [event: FocusEvent];
  /** Input blurred */
  blur: [event: FocusEvent];
}

export interface BWDatePickerExposed {
  /** Open the picker */
  open: () => void;
  /** Close the picker */
  close: () => void;
  /** Toggle open/close */
  toggle: () => void;
  /** Clear selection */
  clear: () => void;
  /** Set date */
  setDate: (date: Date) => void;
  /** Get current date */
  getDate: () => Date | null;
  /** Navigate to previous month */
  prevMonth: () => void;
  /** Navigate to next month */
  nextMonth: () => void;
  /** Navigate to previous year */
  prevYear: () => void;
  /** Navigate to next year */
  nextYear: () => void;
  /** Go to today */
  today: () => void;
  /** Get plugin by name */
  getPlugin: (name: string) => any;
  /** Check if plugin exists */
  hasPlugin: (name: string) => boolean;
  /** Get input element */
  getInputElement: () => HTMLInputElement | null;
  /** Get picker element */
  getPickerElement: () => HTMLElement | null;
  /** Get core instance */
  getInstance: () => any;
}

export declare const BWDatePicker: DefineComponent<
  BWDatePickerProps,
  BWDatePickerExposed,
  {},
  {},
  {},
  {},
  {},
  BWDatePickerEmits
>;

export interface UseBWDatePickerOptions {
  /** Picker mode */
  mode?: 'popup' | 'modal' | 'inline';
  /** Date format string */
  format?: string;
  /** Default date */
  defaultDate?: Date | null;
  /** Minimum selectable date */
  minDate?: Date | null;
  /** Maximum selectable date */
  maxDate?: Date | null;
  /** Array of disabled dates */
  disabledDates?: Date[];
  /** First day of week (0=Sunday, 1=Monday) */
  firstDayOfWeek?: number;
  /** Show week numbers */
  showWeekNumbers?: boolean;
  /** Show days from other months */
  showOtherMonths?: boolean;
  /** Number of months to display */
  numberOfMonths?: number;
  /** Plugins to register */
  plugins?: any[];
  /** Plugin options keyed by plugin name */
  pluginOptions?: Record<string, any>;
  /** Called when date changes */
  onChange?: (date: Date | null, data: any) => void;
  /** Called when picker opens */
  onOpen?: (data: any) => void;
  /** Called when picker closes */
  onClose?: (data: any) => void;
  /** Called when month changes */
  onMonthChange?: (data: { month: number; year: number }) => void;
  /** Called when year changes */
  onYearChange?: (data: { year: number }) => void;
}

export interface UseBWDatePickerReturn {
  /** Ref to attach to input element */
  inputRef: Ref<HTMLInputElement | null>;
  /** Current selected date (reactive) */
  date: Ref<Date | null>;
  /** Whether picker is open (reactive) */
  isOpen: Ref<boolean>;
  /** Open the picker */
  open: () => void;
  /** Close the picker */
  close: () => void;
  /** Toggle open/close */
  toggle: () => void;
  /** Set date */
  setDate: (date: Date) => void;
  /** Clear selection */
  clear: () => void;
  /** Navigate to previous month */
  prevMonth: () => void;
  /** Navigate to next month */
  nextMonth: () => void;
  /** Navigate to previous year */
  prevYear: () => void;
  /** Navigate to next year */
  nextYear: () => void;
  /** Go to today */
  today: () => void;
  /** Get plugin by name */
  getPlugin: (name: string) => any;
  /** Check if plugin exists */
  hasPlugin: (name: string) => boolean;
  /** Get core instance */
  getInstance: () => any;
  /** Get picker element */
  getPickerElement: () => HTMLElement | null;
}

export declare function useBWDatePicker(
  options?: UseBWDatePickerOptions
): UseBWDatePickerReturn;
