/**
 * AriaManager - Manages ARIA attributes for accessibility
 * Part of Black & White UI DatePicker accessibility system
 */

export class AriaManager {
  constructor(pickerElement, config = {}) {
    this.pickerElement = pickerElement;
    this.config = {
      labelledBy: config.labelledBy || null,
      describedBy: config.describedBy || null,
      ...config,
    };

    this.liveRegion = null;
    this.init();
  }

  /**
   * Initialize ARIA structure
   */
  init() {
    // Set main picker role and properties
    this.setPickerRoles();

    // Create live region for announcements
    this.createLiveRegion();
  }

  /**
   * Set ARIA roles and properties on picker element
   */
  setPickerRoles() {
    this.pickerElement.setAttribute('role', 'dialog');
    this.pickerElement.setAttribute('aria-modal', 'true');
    this.pickerElement.setAttribute('aria-label', 'Choose date');

    if (this.config.labelledBy) {
      this.pickerElement.setAttribute(
        'aria-labelledby',
        this.config.labelledBy
      );
    }

    if (this.config.describedBy) {
      this.pickerElement.setAttribute(
        'aria-describedby',
        this.config.describedBy
      );
    }
  }

  /**
   * Set ARIA roles on calendar grid
   * @param {HTMLElement} gridElement - Calendar grid container
   */
  setGridRoles(gridElement) {
    if (!gridElement) return;

    gridElement.setAttribute('role', 'grid');
    gridElement.setAttribute('aria-labelledby', 'calendar-heading');

    // Set row roles (support both core and dual calendar)
    const rows = gridElement.querySelectorAll(
      '.bw-datepicker__week, .bw-dual-week'
    );
    rows.forEach((row, index) => {
      row.setAttribute('role', 'row');
      row.setAttribute('aria-rowindex', String(index + 1));
    });

    // Set gridcell roles (support both core and dual calendar)
    const cells = gridElement.querySelectorAll(
      '.bw-datepicker__day, .bw-dual-day'
    );
    cells.forEach((cell, index) => {
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-colindex', String((index % 7) + 1));

      // Add button role for interactive cells
      if (!cell.classList.contains('bw-datepicker__day--disabled')) {
        const button = cell.querySelector('button') || cell;
        button.setAttribute('role', 'button');
        button.setAttribute(
          'tabindex',
          cell.classList.contains('bw-datepicker__day--selected') ? '0' : '-1'
        );
      }
    });
  }

  /**
   * Set ARIA roles on navigation buttons
   * @param {HTMLElement} navElement - Navigation container
   */
  setNavigationRoles(navElement) {
    if (!navElement) return;

    const prevBtn = navElement.querySelector('[data-action="prev-month"]');
    const nextBtn = navElement.querySelector('[data-action="next-month"]');
    const monthYearBtn = navElement.querySelector('[data-action="month-year"]');

    if (prevBtn) {
      prevBtn.setAttribute('aria-label', 'Previous month');
      prevBtn.setAttribute('type', 'button');
    }

    if (nextBtn) {
      nextBtn.setAttribute('aria-label', 'Next month');
      nextBtn.setAttribute('type', 'button');
    }

    if (monthYearBtn) {
      monthYearBtn.setAttribute('aria-label', 'Select month and year');
      monthYearBtn.setAttribute('aria-haspopup', 'true');
      monthYearBtn.setAttribute('type', 'button');
    }
  }

  /**
   * Update ARIA label for a day cell
   * @param {HTMLElement} cell - Day cell element
   * @param {Date} date - Date object
   * @param {Object} states - State flags (selected, today, disabled, etc.)
   */
  updateDayLabel(cell, date, states = {}) {
    const dayNum = date.getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayName = date.toLocaleString('default', { weekday: 'long' });

    let label = `${dayName}, ${monthName} ${dayNum}, ${year}`;

    // Add state information
    if (states.selected) {
      label += ', selected';
    }
    if (states.today) {
      label += ', today';
    }
    if (states.disabled) {
      label += ', not available';
    }
    if (states.weekend) {
      label += ', weekend';
    }

    cell.setAttribute('aria-label', label);

    // Set selected state
    if (states.selected) {
      cell.setAttribute('aria-selected', 'true');
    } else {
      cell.removeAttribute('aria-selected');
    }

    // Set disabled state
    if (states.disabled) {
      cell.setAttribute('aria-disabled', 'true');
      cell.setAttribute('tabindex', '-1');
    } else {
      cell.removeAttribute('aria-disabled');
    }
  }

  /**
   * Update ARIA label for month/year header
   * @param {HTMLElement} headerElement
   * @param {number} month - Month (0-11)
   * @param {number} year - Year
   */
  updateHeaderLabel(headerElement, month, year) {
    if (!headerElement) return;

    const monthName = new Date(year, month).toLocaleString('default', {
      month: 'long',
    });
    const label = `${monthName} ${year}`;

    headerElement.setAttribute('aria-label', label);
    headerElement.id = 'calendar-heading';
  }

  /**
   * Create ARIA live region for announcements
   */
  createLiveRegion() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.className = 'bw-sr-only';
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');

    this.pickerElement.appendChild(this.liveRegion);
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }

    this.liveRegion.setAttribute('aria-live', priority);

    // Clear and set new message
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Set expanded state on element
   * @param {HTMLElement} element
   * @param {boolean} expanded
   */
  setExpanded(element, expanded) {
    if (!element) return;
    element.setAttribute('aria-expanded', String(expanded));
  }

  /**
   * Set pressed state on button
   * @param {HTMLElement} button
   * @param {boolean} pressed
   */
  setPressed(button, pressed) {
    if (!button) return;
    button.setAttribute('aria-pressed', String(pressed));
  }

  /**
   * Set current state (for navigation)
   * @param {HTMLElement} element
   * @param {string} value - 'page', 'step', 'location', 'date', 'time', 'true', 'false'
   */
  setCurrent(element, value = 'true') {
    if (!element) return;
    element.setAttribute('aria-current', value);
  }

  /**
   * Associate label with control
   * @param {HTMLElement} control
   * @param {HTMLElement} label
   */
  associateLabel(control, label) {
    if (!control || !label) return;

    const labelId =
      label.id || `label-${Math.random().toString(36).substr(2, 9)}`;
    label.id = labelId;
    control.setAttribute('aria-labelledby', labelId);
  }

  /**
   * Associate description with element
   * @param {HTMLElement} element
   * @param {HTMLElement} description
   */
  associateDescription(element, description) {
    if (!element || !description) return;

    const descId =
      description.id || `desc-${Math.random().toString(36).substr(2, 9)}`;
    description.id = descId;
    element.setAttribute('aria-describedby', descId);
  }

  /**
   * Set invalid state on element
   * @param {HTMLElement} element
   * @param {boolean} invalid
   * @param {string} errorMessage - Optional error message
   */
  setInvalid(element, invalid, errorMessage = null) {
    if (!element) return;

    if (invalid) {
      element.setAttribute('aria-invalid', 'true');

      if (errorMessage) {
        const errorId = `error-${Math.random().toString(36).substr(2, 9)}`;
        const errorEl = document.createElement('div');
        errorEl.id = errorId;
        errorEl.className = 'bw-error-message bw-sr-only';
        errorEl.textContent = errorMessage;
        element.parentNode.appendChild(errorEl);
        element.setAttribute('aria-describedby', errorId);
      }
    } else {
      element.removeAttribute('aria-invalid');

      // Remove error message if exists
      const errorId = element.getAttribute('aria-describedby');
      if (errorId) {
        const errorEl = document.getElementById(errorId);
        if (errorEl && errorEl.classList.contains('bw-error-message')) {
          errorEl.remove();
          element.removeAttribute('aria-describedby');
        }
      }
    }
  }

  /**
   * Set required state on element
   * @param {HTMLElement} element
   * @param {boolean} required
   */
  setRequired(element, required) {
    if (!element) return;

    if (required) {
      element.setAttribute('aria-required', 'true');
    } else {
      element.removeAttribute('aria-required');
    }
  }

  /**
   * Update roving tabindex for keyboard navigation
   * @param {HTMLElement} container - Container element
   * @param {HTMLElement} focusedElement - Currently focused element
   */
  updateRovingTabindex(container, focusedElement) {
    if (!container) return;

    // Remove tabindex from all focusable elements
    const focusables = container.querySelectorAll('[tabindex="0"]');
    focusables.forEach((el) => el.setAttribute('tabindex', '-1'));

    // Set tabindex on focused element
    if (focusedElement) {
      focusedElement.setAttribute('tabindex', '0');
    }
  }

  /**
   * Get all ARIA attributes from element
   * @param {HTMLElement} element
   * @returns {Object} Object with all ARIA attributes
   */
  getAriaAttributes(element) {
    if (!element) return {};

    const attrs = {};
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith('aria-')) {
        attrs[attr.name] = attr.value;
      }
    });
    return attrs;
  }

  /**
   * Cleanup - remove live region
   */
  destroy() {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
    this.liveRegion = null;
  }
}
