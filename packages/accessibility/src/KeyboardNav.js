/**
 * ============================================================================
 * Black & White UI – Keyboard Navigation Module
 * ============================================================================
 */

import { FocusTrap } from './FocusTrap.js';
import { Announcer } from './Announcer.js';

// Key constants
const KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

export class KeyboardNav {
  constructor(controller, options = {}) {
    this.controller = controller;
    this.pickerElement = null;
    this.focusTrap = new FocusTrap();
    this.announcer = new Announcer();
    this.keydownHandler = null;
    this.initialized = false;
  }

  init(pickerElement) {
    this.pickerElement = pickerElement;

    if (this.initialized && this.keydownHandler) {
      return;
    }

    if (this.keydownHandler) {
      this.pickerElement.removeEventListener('keydown', this.keydownHandler);
    }

    // Make picker focusable
    this.pickerElement.setAttribute('tabindex', '-1');

    // Make all visible day buttons focusable (support both core and dual calendar)
    const days = this.pickerElement.querySelectorAll(
      '.bw-datepicker__day, .bw-dual-day'
    );
    days.forEach((day) => {
      // Skip disabled, empty, and hidden days
      if (
        day.classList.contains('bw-datepicker__day--disabled') ||
        day.classList.contains('bw-datepicker__day--empty') ||
        day.classList.contains('bw-dual-day--disabled')
      ) {
        return;
      }
      // Skip days with no content (empty cells from showOtherMonths: false)
      if (!day.textContent.trim()) {
        return;
      }
      day.setAttribute('tabindex', '0');
    });

    // Make nav buttons focusable
    const buttons = this.pickerElement.querySelectorAll(
      'button, [data-action]'
    );
    buttons.forEach((btn) => {
      btn.setAttribute('tabindex', '0');
    });

    this.keydownHandler = this.handleKeydown.bind(this);
    this.pickerElement.addEventListener('keydown', this.keydownHandler);

    this.focusTrap.activate(pickerElement);
    this.initialized = true;

    // Set initial focus immediately
    this.setInitialFocus();
  }

  handleKeydown(e) {
    const key = e.key;

    // Escape closes picker
    if (key === KEYS.ESCAPE) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof this.controller.close === 'function') {
        this.controller.close();
      }
      // Return focus to input
      const input = this.controller.getInputElement();
      if (input) {
        input.focus();
      }
      this.announcer.announce('Calendar closed');
      return;
    }

    // Tab navigation - trap focus inside picker
    if (key === KEYS.TAB) {
      this.handleTabKey(e);
      return;
    }

    // Get focused element
    const focused = document.activeElement;
    const isOnDay =
      focused &&
      (focused.classList.contains('bw-datepicker__day') ||
        focused.classList.contains('bw-dual-day'));

    if (!isOnDay) {
      // If not on a day, try to focus first day on arrow keys
      if (
        [
          KEYS.ARROW_LEFT,
          KEYS.ARROW_RIGHT,
          KEYS.ARROW_UP,
          KEYS.ARROW_DOWN,
        ].includes(key)
      ) {
        e.preventDefault();
        this.focusFirstAvailableDay();
      }
      return;
    }

    // Handle navigation when on a day
    switch (key) {
      case KEYS.ARROW_LEFT:
        e.preventDefault();
        this.navigateDay(focused, -1);
        break;

      case KEYS.ARROW_RIGHT:
        e.preventDefault();
        this.navigateDay(focused, 1);
        break;

      case KEYS.ARROW_UP:
        e.preventDefault();
        this.navigateDay(focused, -7);
        break;

      case KEYS.ARROW_DOWN:
        e.preventDefault();
        this.navigateDay(focused, 7);
        break;

      case KEYS.HOME:
        e.preventDefault();
        this.goToFirstDay();
        break;

      case KEYS.END:
        e.preventDefault();
        this.goToLastDay();
        break;

      case KEYS.PAGE_UP:
        e.preventDefault();
        if (e.shiftKey) {
          // Use prevYear if available, otherwise call changeYear on controller
          if (typeof this.controller.prevYear === 'function') {
            this.controller.prevYear();
          } else if (typeof this.controller.changeYear === 'function') {
            this.controller.changeYear(-1);
          }
        } else {
          // Use prevMonth if available, otherwise call changeMonth on controller
          if (typeof this.controller.prevMonth === 'function') {
            this.controller.prevMonth();
          } else if (typeof this.controller.changeMonth === 'function') {
            this.controller.changeMonth(-1);
          }
        }
        setTimeout(() => this.focusFirstAvailableDay(), 50);
        break;

      case KEYS.PAGE_DOWN:
        e.preventDefault();
        if (e.shiftKey) {
          if (typeof this.controller.nextYear === 'function') {
            this.controller.nextYear();
          } else if (typeof this.controller.changeYear === 'function') {
            this.controller.changeYear(1);
          }
        } else {
          if (typeof this.controller.nextMonth === 'function') {
            this.controller.nextMonth();
          } else if (typeof this.controller.changeMonth === 'function') {
            this.controller.changeMonth(1);
          }
        }
        setTimeout(() => this.focusFirstAvailableDay(), 50);
        break;

      case KEYS.ENTER:
      case KEYS.SPACE:
        e.preventDefault();
        this.selectFocusedDay(focused);
        break;
    }
  }

  handleTabKey(e) {
    const focusableElements = this.pickerElement.querySelectorAll(
      'button:not(:disabled), [tabindex="0"]:not(:disabled), ' +
        '.bw-datepicker__day:not(.bw-datepicker__day--disabled):not(.bw-datepicker__day--empty), ' +
        '.bw-dual-day:not(.bw-dual-day--disabled)'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: go backwards
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: go forwards
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  navigateDay(currentDay, offset) {
    // Get only visible, non-disabled days (exclude empty and other-month when hidden)
    const allDays = Array.from(
      this.pickerElement.querySelectorAll(
        '.bw-datepicker__day:not(.bw-datepicker__day--disabled):not(.bw-datepicker__day--empty):not([style*="visibility: hidden"]), ' +
          '.bw-dual-day:not(.bw-dual-day--disabled):not([style*="visibility: hidden"])'
      )
    ).filter((day) => {
      // Also filter out days that have no text content (truly empty cells)
      const text = day.textContent.trim();
      if (!text) return false;
      // Filter out "other month" days that are hidden via CSS
      const style = window.getComputedStyle(day);
      if (style.visibility === 'hidden' || style.display === 'none')
        return false;
      return true;
    });

    const currentIndex = allDays.indexOf(currentDay);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex + offset;

    // Wrap around or change month
    if (targetIndex < 0) {
      if (typeof this.controller.prevMonth === 'function') {
        this.controller.prevMonth();
      } else if (typeof this.controller.changeMonth === 'function') {
        this.controller.changeMonth(-1);
      }
      setTimeout(() => this.goToLastDay(), 50);
      return;
    }

    if (targetIndex >= allDays.length) {
      if (typeof this.controller.nextMonth === 'function') {
        this.controller.nextMonth();
      } else if (typeof this.controller.changeMonth === 'function') {
        this.controller.changeMonth(1);
      }
      setTimeout(() => this.goToFirstDay(), 50);
      return;
    }

    const targetDay = allDays[targetIndex];
    if (targetDay) {
      targetDay.focus();
      this.announceFocusedDate(targetDay);
    }
  }

  /**
   * Helper to get all visible, focusable days
   */
  getVisibleDays() {
    return Array.from(
      this.pickerElement.querySelectorAll(
        '.bw-datepicker__day:not(.bw-datepicker__day--disabled):not(.bw-datepicker__day--empty), ' +
          '.bw-dual-day:not(.bw-dual-day--disabled)'
      )
    ).filter((day) => {
      // Filter out days that have no text content (truly empty cells)
      const text = day.textContent.trim();
      if (!text) return false;
      // Filter out days that are hidden via CSS (showOtherMonths: false)
      const style = window.getComputedStyle(day);
      if (style.visibility === 'hidden' || style.display === 'none')
        return false;
      return true;
    });
  }

  goToFirstDay() {
    const days = this.getVisibleDays();
    // Prefer current month days
    const currentMonthDay = days.find(
      (day) =>
        !day.classList.contains('bw-datepicker__day--other-month') &&
        !day.classList.contains('bw-dual-day--other')
    );
    const firstDay = currentMonthDay || days[0];
    if (firstDay) {
      firstDay.focus();
      this.announceFocusedDate(firstDay);
    }
  }

  goToLastDay() {
    const days = this.getVisibleDays();
    // Prefer current month days
    const currentMonthDays = days.filter(
      (day) =>
        !day.classList.contains('bw-datepicker__day--other-month') &&
        !day.classList.contains('bw-dual-day--other')
    );
    const lastDay =
      currentMonthDays.length > 0
        ? currentMonthDays[currentMonthDays.length - 1]
        : days[days.length - 1];
    if (lastDay) {
      lastDay.focus();
      this.announceFocusedDate(lastDay);
    }
  }

  focusFirstAvailableDay() {
    const days = this.getVisibleDays();
    const firstDay = days[0];
    if (firstDay) {
      firstDay.focus();
      this.announceFocusedDate(firstDay);
    }
  }

  selectFocusedDay(dayElement) {
    const date = dayElement.getAttribute('data-date');
    if (date) {
      // Click the element instead of calling setDate directly
      // This allows Range plugin and other plugins to handle the selection properly
      dayElement.click();
      this.announcer.announce(`Selected ${date}`);
    }
  }

  announceFocusedDate(dayElement) {
    const ariaLabel = dayElement.getAttribute('aria-label');
    if (ariaLabel) {
      this.announcer.announce(ariaLabel);
    }
  }

  setInitialFocus() {
    const visibleDays = this.getVisibleDays();

    // Focus selected date if exists
    const selectedDay = visibleDays.find(
      (day) =>
        day.classList.contains('bw-datepicker__day--selected') ||
        day.classList.contains('bw-dual-day--selected')
    );
    if (selectedDay) {
      selectedDay.setAttribute('tabindex', '0');
      selectedDay.focus();
      return;
    }

    // Focus today
    const today = visibleDays.find(
      (day) =>
        day.classList.contains('bw-datepicker__day--today') ||
        day.classList.contains('bw-dual-day--today')
    );
    if (today) {
      today.setAttribute('tabindex', '0');
      today.focus();
      return;
    }

    // Focus first day
    this.focusFirstAvailableDay();
  }

  destroy() {
    if (this.pickerElement && this.keydownHandler) {
      this.pickerElement.removeEventListener('keydown', this.keydownHandler);
    }

    this.focusTrap.deactivate();
    this.announcer.destroy();
    this.keydownHandler = null;
    this.initialized = false;
  }
}

export default KeyboardNav;
