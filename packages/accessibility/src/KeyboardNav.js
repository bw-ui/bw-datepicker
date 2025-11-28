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

    // Make all day buttons focusable
    const days = this.pickerElement.querySelectorAll('.bw-datepicker__day');
    days.forEach((day) => {
      if (!day.disabled) {
        day.setAttribute('tabindex', '0');
      }
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
    const isOnDay = focused && focused.classList.contains('bw-datepicker__day');

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
          this.controller.prevYear();
        } else {
          this.controller.prevMonth();
        }
        setTimeout(() => this.focusFirstAvailableDay(), 50);
        break;

      case KEYS.PAGE_DOWN:
        e.preventDefault();
        if (e.shiftKey) {
          this.controller.nextYear();
        } else {
          this.controller.nextMonth();
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
      'button:not(:disabled), [tabindex="0"]:not(:disabled), .bw-datepicker__day:not(:disabled)'
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
    const allDays = Array.from(
      this.pickerElement.querySelectorAll('.bw-datepicker__day:not(:disabled)')
    );

    const currentIndex = allDays.indexOf(currentDay);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex + offset;

    // Wrap around or change month
    if (targetIndex < 0) {
      this.controller.prevMonth();
      setTimeout(() => this.goToLastDay(), 50);
      return;
    }

    if (targetIndex >= allDays.length) {
      this.controller.nextMonth();
      setTimeout(() => this.goToFirstDay(), 50);
      return;
    }

    const targetDay = allDays[targetIndex];
    if (targetDay) {
      targetDay.focus();
      this.announceFocusedDate(targetDay);
    }
  }

  goToFirstDay() {
    const firstDay = this.pickerElement.querySelector(
      '.bw-datepicker__day:not(:disabled):not(.bw-datepicker__day--other-month)'
    );
    if (firstDay) {
      firstDay.focus();
      this.announceFocusedDate(firstDay);
    }
  }

  goToLastDay() {
    const days = Array.from(
      this.pickerElement.querySelectorAll(
        '.bw-datepicker__day:not(:disabled):not(.bw-datepicker__day--other-month)'
      )
    );
    const lastDay = days[days.length - 1];
    if (lastDay) {
      lastDay.focus();
      this.announceFocusedDate(lastDay);
    }
  }

  focusFirstAvailableDay() {
    const firstDay = this.pickerElement.querySelector(
      '.bw-datepicker__day:not(:disabled)'
    );
    if (firstDay) {
      firstDay.focus({ preventScroll: true });
      this.announceFocusedDate(firstDay);
    }
  }

  selectFocusedDay(dayElement) {
    const date = dayElement.getAttribute('data-date');
    if (date) {
      this.controller.setDate(new Date(date));
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
    const selectedDay = this.pickerElement.querySelector(
      '.bw-datepicker__day--selected:not(:disabled)'
    );
    if (selectedDay) {
      selectedDay.setAttribute('tabindex', '0');
      selectedDay.focus({ preventScroll: true });
      return;
    }

    const today = this.pickerElement.querySelector(
      '.bw-datepicker__day--today:not(:disabled)'
    );
    if (today) {
      today.setAttribute('tabindex', '0');
      today.focus({ preventScroll: true });
      return;
    }

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
