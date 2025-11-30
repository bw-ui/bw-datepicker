/**
 * ============================================================================
 * Black & White UI — Value Sync
 * Syncs input value with datepicker
 * ============================================================================
 */
export class ValueSync {
  constructor(inputElement, controller, options = {}) {
    this.inputElement = inputElement;
    this.controller = controller;
    this.format = options.format || 'DD/MM/YYYY';
    this.onChange = options.onChange || null;
  }

  syncToPicker(date) {
    if (!date || !this.controller) return;

    if (typeof this.controller.setDate === 'function') {
      this.controller.setDate(date);
    }

    // Re-apply our format (picker might override)
    this.syncFromPicker(date);

    if (this.onChange) {
      this.onChange(date);
    }
  }

  syncFromPicker(date) {
    if (!date) {
      this.inputElement.value = '';
      return;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    this.inputElement.value = this.format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }

  clear() {
    this.inputElement.value = '';
  }

  updateFormat(format) {
    this.format = format;
  }
}

export default ValueSync;
