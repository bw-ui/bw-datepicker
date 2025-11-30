/**
 * @bw-ui/datepicker-input-handler - TypeScript Definitions
 * @version 1.1.0
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Options
// ============================================================================

export interface InputHandlerOptions {
  /** Date format for input */
  format?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Enable input masking */
  enableMask?: boolean;
  /** Mask character */
  maskChar?: string;
  /** Enable validation */
  enableValidation?: boolean;
  /** Validate on blur */
  validateOnBlur?: boolean;
  /** Validate on input */
  validateOnInput?: boolean;
  /** Show validation errors */
  showErrors?: boolean;
  /** Error CSS class */
  errorClass?: string;
  /** Allow manual input */
  allowManualInput?: boolean;
  /** Auto-correct invalid dates */
  autoCorrect?: boolean;
  /** Custom validation function */
  customValidator?: (value: string, date: Date | null) => boolean | string;
  /** Callback on valid input */
  onValid?: (date: Date) => void;
  /** Callback on invalid input */
  onInvalid?: (value: string, error: string) => void;
}

// ============================================================================
// Input Handler Instance
// ============================================================================

export interface InputHandlerInstance {
  /** Mask handler */
  maskHandler: MaskHandler | null;
  /** Validation handler */
  validationHandler: ValidationHandler | null;
  /** Input binder */
  inputBinder: InputBinder | null;
  /** Value sync handler */
  valueSync: ValueSync | null;
  /** Get current input value */
  getValue(): string;
  /** Set input value */
  setValue(value: string): void;
  /** Validate current value */
  validate(): boolean;
  /** Clear input */
  clear(): void;
  /** Check if valid */
  isValid(): boolean;
  /** Get validation error */
  getError(): string | null;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Mask Handler
// ============================================================================

export declare class MaskHandler {
  constructor(format?: string);

  /** Apply mask to input */
  applyMask(input: string, previousValue?: string): string;
  /** Parse input to parts */
  parse(input: string): { day: string; month: string; year: string } | null;
  /** Format date */
  formatDate(date: Date): string;
  /** Check if complete */
  isComplete(input: string): boolean;
  /** Get placeholder */
  getPlaceholder(): string;
}

// ============================================================================
// Validation Handler
// ============================================================================

export declare class ValidationHandler {
  constructor(options?: {
    minDate?: Date | null;
    maxDate?: Date | null;
    disabledDates?: Array<Date | ((date: Date) => boolean)>;
  });

  /** Validate parts and return date or null */
  validate(parts: { day: string; month: string; year: string }): Date | null;
  /** Auto-correct input */
  autoCorrect(input: string): string;
  /** Validate partial input */
  validatePartial(input: string): boolean;
  /** Get error message */
  getErrorMessage(date: Date | null): string | null;
  /** Update options */
  updateOptions(options: {
    minDate?: Date | null;
    maxDate?: Date | null;
    disabledDates?: Array<Date | ((date: Date) => boolean)>;
  }): void;
}

// ============================================================================
// Input Binder
// ============================================================================

export declare class InputBinder {
  constructor(
    inputElement: HTMLInputElement,
    controller: unknown,
    eventBus: unknown,
    options?: InputHandlerOptions
  );

  /** Update input value from date */
  updateValue(date: Date | null): void;
  /** Update options */
  updateOptions(options: Partial<InputHandlerOptions>): void;
  /** Show error message */
  showError(message: string): void;
  /** Clear error */
  clearError(): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Value Sync
// ============================================================================

export declare class ValueSync {
  constructor(
    inputElement: HTMLInputElement,
    controller: unknown,
    options?: {
      format?: string;
      onChange?: (date: Date) => void;
    }
  );

  /** Sync value to picker */
  syncToPicker(date: Date): void;
  /** Sync value from picker */
  syncFromPicker(date: Date | null): void;
  /** Clear input */
  clear(): void;
  /** Update format */
  updateFormat(format: string): void;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const InputHandlerPlugin: Plugin<InputBinder> & {
  name: 'input-handler';
  init(api: unknown, options?: InputHandlerOptions): InputBinder;
  destroy(instance: InputBinder): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default InputHandlerPlugin;
