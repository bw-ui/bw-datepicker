/**
 * @bw-ui/datepicker-input-handler - TypeScript Definitions
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
  constructor(options?: {
    element?: HTMLInputElement;
    format?: string;
    maskChar?: string;
    onComplete?: (value: string) => void;
  });

  /** Apply mask to input */
  apply(): void;
  /** Remove mask */
  remove(): void;
  /** Get unmasked value */
  getUnmaskedValue(): string;
  /** Get masked value */
  getMaskedValue(): string;
  /** Set value */
  setValue(value: string): void;
  /** Check if complete */
  isComplete(): boolean;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Validation Handler
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error: string | null;
  date: Date | null;
}

export declare class ValidationHandler {
  constructor(options?: {
    format?: string;
    minDate?: Date | null;
    maxDate?: Date | null;
    customValidator?: (value: string, date: Date | null) => boolean | string;
  });

  /** Validate value */
  validate(value: string): ValidationResult;
  /** Check if value is valid date format */
  isValidFormat(value: string): boolean;
  /** Parse value to date */
  parse(value: string): Date | null;
  /** Set min date */
  setMinDate(date: Date | null): void;
  /** Set max date */
  setMaxDate(date: Date | null): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Input Binder
// ============================================================================

export declare class InputBinder {
  constructor(options?: {
    element?: HTMLInputElement;
    onInput?: (value: string) => void;
    onBlur?: (value: string) => void;
    onFocus?: () => void;
    onKeyDown?: (event: KeyboardEvent) => void;
  });

  /** Bind events */
  bind(): void;
  /** Unbind events */
  unbind(): void;
  /** Focus input */
  focus(): void;
  /** Blur input */
  blur(): void;
  /** Select all text */
  selectAll(): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Value Sync
// ============================================================================

export declare class ValueSync {
  constructor(options?: {
    input?: HTMLInputElement;
    format?: string;
    onSync?: (date: Date | null) => void;
  });

  /** Sync value from date */
  fromDate(date: Date | null): void;
  /** Sync value to date */
  toDate(): Date | null;
  /** Get formatted value */
  getFormatted(): string;
  /** Set format */
  setFormat(format: string): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const InputHandlerPlugin: Plugin<InputHandlerInstance> & {
  name: 'input-handler';
  init(api: unknown, options?: InputHandlerOptions): InputHandlerInstance;
  destroy(instance: InputHandlerInstance): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default InputHandlerPlugin;
