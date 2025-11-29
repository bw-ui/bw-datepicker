/**
 * ============================================================================
 * Black & White UI – Mask Handler
 * Formats input as user types (DD/MM/YYYY, MM/DD/YYYY, etc)
 * ============================================================================
 */

export class MaskHandler {
  constructor(format = 'DD/MM/YYYY') {
    this.format = format;
    this.delimiter = this.detectDelimiter(format);
  }

  detectDelimiter(format) {
    if (format.includes('/')) return '/';
    if (format.includes('-')) return '-';
    if (format.includes('.')) return '.';
    return '/';
  }

  applyMask(input, previousValue = '') {
    if (!input) return '';

    // Remove non-digits
    let cleaned = String(input).replace(/\D/g, '');

    if (cleaned.length === 0) return '';

    // Limit to 8 digits (DDMMYYYY)
    cleaned = cleaned.slice(0, 8);

    // Build result with delimiters
    let result = '';

    for (let i = 0; i < cleaned.length; i++) {
      // Add delimiter after DD (position 2) and MM (position 4)
      if (i === 2 || i === 4) {
        result += this.delimiter;
      }
      result += cleaned[i];
    }

    return result;
  }

  getCursorPosition(input, cursorPos, previousValue) {
    const digits = input.replace(/\D/g, '');

    // Auto-advance after completing day or month
    if (digits.length === 2 && cursorPos === 2) return 3;
    if (digits.length === 4 && cursorPos === 5) return 6;

    return cursorPos;
  }

  parse(input) {
    if (!input) return null;

    const cleaned = String(input).replace(/\D/g, '');
    if (cleaned.length < 8) return null;

    const parts = this.format.split(/[\/\-\.]/);
    const result = { day: '', month: '', year: '' };

    // DD/MM/YYYY format
    if (parts[0] === 'DD') {
      result.day = cleaned.slice(0, 2);
      result.month = cleaned.slice(2, 4);
      result.year = cleaned.slice(4, 8);
    }
    // MM/DD/YYYY format
    else if (parts[0] === 'MM') {
      result.month = cleaned.slice(0, 2);
      result.day = cleaned.slice(2, 4);
      result.year = cleaned.slice(4, 8);
    }
    // YYYY/MM/DD format
    else if (parts[0] === 'YYYY') {
      result.year = cleaned.slice(0, 4);
      result.month = cleaned.slice(4, 6);
      result.day = cleaned.slice(6, 8);
    }

    return result;
  }

  formatDate(date) {
    if (!date) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return this.format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }

  isComplete(input) {
    if (!input || typeof input !== 'string') return false;
    const cleaned = input.replace(/\D/g, '');
    return cleaned.length === 8;
  }

  getPlaceholder() {
    return this.format.toLowerCase();
  }
}

export default MaskHandler;
