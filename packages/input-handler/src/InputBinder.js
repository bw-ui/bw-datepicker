/**
 * ============================================================================
 * Black & White UI – Input Binder
 * Coordinates all input interactions: masking, validation, sync
 * ============================================================================
 */

import { MaskHandler } from './MaskHandler.js';
import { ValidationHandler } from './ValidationHandler.js';
import { ValueSync } from './ValueSync.js';

export class InputBinder {
  constructor(inputElement, controller, options = {}) {
    this.inputElement = inputElement;
    this.controller = controller;
    this.options = {
      format: 'DD/MM/YYYY',
      autoCorrect: true,
      validateOnBlur: true,
      showErrors: true,
      allowManualInput: true,
      ...options,
    };

    this.maskHandler = new MaskHandler(this.options.format);
    this.validationHandler = new ValidationHandler({
      minDate: options.minDate,
      maxDate: options.maxDate,
      disabledDates: options.disabledDates,
    });
    this.valueSync = new ValueSync(inputElement, controller, {
      format: this.options.format,
      onChange: options.onChange,
    });

    this.previousValue = '';
    this.listeners = {};

    this.attachListeners();
    this.setPlaceholder();
    this.listenToPickerChanges();
  }

  attachListeners() {
    if (!this.options.allowManualInput) {
      this.inputElement.setAttribute('readonly', 'true');
      return;
    }

    this.listeners.input = this.handleInput.bind(this);
    this.listeners.keydown = this.handleKeydown.bind(this);
    this.listeners.paste = this.handlePaste.bind(this);
    this.listeners.blur = this.handleBlur.bind(this);
    this.listeners.focus = this.handleFocus.bind(this);

    this.inputElement.addEventListener('input', this.listeners.input);
    this.inputElement.addEventListener('keydown', this.listeners.keydown);
    this.inputElement.addEventListener('paste', this.listeners.paste);
    this.inputElement.addEventListener('blur', this.listeners.blur);
    this.inputElement.addEventListener('focus', this.listeners.focus);
  }

  handleInput(e) {
    const input = e.target;
    const value = input.value;

    // Apply mask
    const masked = this.maskHandler.applyMask(value, this.previousValue);

    // Update input
    input.value = masked;
    this.previousValue = masked;

    // If complete, validate and sync
    if (this.maskHandler.isComplete(masked)) {
      const parts = this.maskHandler.parse(masked);
      if (parts) {
        const date = this.validationHandler.validate(parts);
        if (date) {
          this.valueSync.syncToPicker(date);
          this.clearError();
        }
      }
    }
  }

  handleKeydown(e) {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Allow: arrow keys
    if (e.keyCode >= 35 && e.keyCode <= 39) {
      return;
    }

    // Only allow numbers
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  handlePaste(e) {
    e.preventDefault();

    const pastedText = (e.clipboardData || window.clipboardData).getData(
      'text'
    );
    const cleaned = pastedText.replace(/\D/g, '');

    if (cleaned.length >= 6) {
      const masked = this.maskHandler.applyMask(cleaned);
      this.inputElement.value = masked;
      this.previousValue = masked;

      if (this.maskHandler.isComplete(masked)) {
        const parts = this.maskHandler.parse(masked);
        if (parts) {
          const date = this.validationHandler.validate(parts);
          if (date) {
            this.valueSync.syncToPicker(date);
            this.clearError();
          } else if (this.options.showErrors) {
            this.showError('Invalid date');
          }
        }
      }
    }
  }

  handleBlur(e) {
    if (!this.options.validateOnBlur) return;

    const value = e.target.value;

    if (!value) {
      this.clearError();
      return;
    }

    if (!this.maskHandler.isComplete(value)) {
      if (this.options.showErrors) {
        this.showError('Incomplete date');
      }
      return;
    }

    const parts = this.maskHandler.parse(value);
    if (parts) {
      const date = this.validationHandler.validate(parts);
      if (!date && this.options.showErrors) {
        this.showError('Invalid date');
      } else {
        this.clearError();
      }
    }
  }

  handleFocus() {
    this.clearError();
  }

  updateValue(date) {
    if (!date) {
      this.valueSync.clear();
      this.previousValue = '';
      this.clearError();
      return;
    }

    const formatted = this.maskHandler.formatDate(date);
    this.inputElement.value = formatted;
    this.previousValue = formatted;
    this.clearError();
  }

  setPlaceholder() {
    if (!this.inputElement.placeholder) {
      this.inputElement.placeholder = this.maskHandler.getPlaceholder();
    }
  }

  showError(message) {
    this.inputElement.classList.add('bw-datepicker-input--error');

    let errorEl = this.inputElement.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('bw-datepicker-input__error')) {
      errorEl = document.createElement('div');
      errorEl.className = 'bw-datepicker-input__error';
      this.inputElement.parentNode.insertBefore(
        errorEl,
        this.inputElement.nextSibling
      );
    }

    errorEl.textContent = message;
    errorEl.style.color = '#e53e3e';
    errorEl.style.fontSize = '12px';
    errorEl.style.marginTop = '4px';
  }

  clearError() {
    this.inputElement.classList.remove('bw-datepicker-input--error');

    const errorEl = this.inputElement.nextElementSibling;
    if (errorEl && errorEl.classList.contains('bw-datepicker-input__error')) {
      errorEl.remove();
    }
  }

  updateOptions(options) {
    Object.assign(this.options, options);

    if (options.format) {
      this.maskHandler = new MaskHandler(options.format);
      this.valueSync.updateFormat(options.format);
      this.setPlaceholder();
    }

    this.validationHandler.updateOptions({
      minDate: options.minDate,
      maxDate: options.maxDate,
      disabledDates: options.disabledDates,
    });
  }

  listenToPickerChanges() {
    if (this.controller && this.controller.on) {
      this.controller.on('date:changed', ({ date }) => {
        if (date) {
          const formatted = this.maskHandler.formatDate(date);
          this.inputElement.value = formatted;
          this.previousValue = formatted;
        }
      });
    }
  }

  destroy() {
    Object.keys(this.listeners).forEach((key) => {
      this.inputElement.removeEventListener(key, this.listeners[key]);
    });
    this.clearError();
  }
}

export default InputBinder;
