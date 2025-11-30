/**
 * ============================================================================
 * Black & White: UI Engineering
 * CoreController - Slot-Based Architecture
 * ============================================================================
 *
 * Refactored to use persistent slots and view modes.
 *
 * Slots (created once, never wiped):
 * - header: month/year title + navigation
 * - calendar: days/months/years/week grid
 * - footer: today/clear buttons
 *
 * View Modes:
 * - calendar: days grid (default)
 * - month: months grid
 * - year: years grid
 * - week: single week
 *
 * Render Pipeline:
 * - render:before - providers modify data
 * - render:header - plugin can intercept (return true)
 * - render:calendar - plugin can intercept (return true)
 * - render:footer - plugin can intercept (return true)
 * - render:after - decorators add classes
 *
 * @version 0.3.0
 * @license MIT
 * ============================================================================
 */

import StateManager from './BWStateManager.js';
import EventBus from './BWEventBus.js';
import { SlotManager } from './slots/index.js';
import { CalendarView, MonthView, YearView, WeekView } from './views/index.js';
import { PopupMode, ModalMode, InlineMode } from './modes/index.js';
import {
  isValidDate,
  isSameDay,
  parseISO,
  toISO,
  formatDate,
  generateCalendarMonth,
  isDisabled,
  isWeekend,
  MONTH_NAMES,
} from './date-utils.js';

const CORE_DEFAULTS = {
  mode: 'popup',
  placement: 'bottom',
  firstDayOfWeek: 0,
  showWeekdays: true,
  showFooter: true,
  selectOtherMonths: true,
  minDate: null,
  maxDate: null,
  disabledDates: [],
  defaultDate: null,
  closeOnSelect: true,
  allowDeselect: true,
  format: 'YYYY-MM-DD',
  defaultViewMode: 'calendar',

  // View mode options
  showMonthPicker: true, // Click month → month grid
  showYearPicker: true, // Click year → year grid
  showYearNavigation: true, // Show « » buttons
  showMonthNavigation: true, // Show ‹ › month buttons (calendar view)
  showWeekNavigation: true, // Show ‹ › week buttons (week view)
  resetViewOnClose: true, // Reset to defaultViewMode on close
};

export class CoreController {
  #stateManager;
  #eventBus;
  #slotManager;
  #modeHandler;
  #inputElement;
  #pickerElement;
  #options;
  #plugins = new Map();

  // View renderers
  #views = {};

  constructor(inputElement, options = {}) {
    this.#inputElement = inputElement;
    this.#options = { ...CORE_DEFAULTS, ...options };

    let initialDate = null;
    if (this.#options.defaultDate) {
      initialDate =
        this.#options.defaultDate instanceof Date
          ? this.#options.defaultDate
          : parseISO(this.#options.defaultDate);
    }

    // Initialize state with viewMode
    this.#stateManager = new StateManager({
      currentMonth: initialDate
        ? initialDate.getMonth()
        : new Date().getMonth(),
      currentYear: initialDate
        ? initialDate.getFullYear()
        : new Date().getFullYear(),
      selectedDate: initialDate,
      isOpen: false,
      viewMode: this.#options.defaultViewMode,
      weekReferenceDate: initialDate || new Date(), // For week navigation
    });

    this.#eventBus = new EventBus();
    this.#slotManager = new SlotManager();

    // Initialize views
    this.#views = {
      calendar: new CalendarView(),
      month: new MonthView(),
      year: new YearView(),
      week: new WeekView(),
    };

    // Set eventBus on views that need it
    this.#views.calendar.setEventBus(this.#eventBus);
    this.#views.week.setEventBus(this.#eventBus);

    // Emit init event - plugins can modify options
    this.#eventBus.emit('picker:init', { options: this.#options });

    this.#init();
  }

  #init() {
    this.#createPickerElement();
    this.#setupStateObservers();

    if (this.#options.mode !== 'inline') {
      this.#attachInputEvents();
    }

    this.#parseInputValue();
    this.#initMode();
    this.render();

    if (this.#options.mode === 'inline') {
      this.open();
    }

    this.#eventBus.emit('picker:ready', {});
  }

  #createPickerElement() {
    const picker = document.createElement('div');
    picker.className = 'bw-datepicker';
    picker.setAttribute('role', 'dialog');
    picker.setAttribute('aria-label', 'Date picker');
    picker.setAttribute('hidden', '');

    if (this.#options.instanceId) {
      picker.setAttribute('data-bw-instance', this.#options.instanceId);
    }

    this.#pickerElement = picker;

    // Create slots (ONCE - never wiped)
    this.#slotManager.createSlots(picker);

    this.#attachPickerEvents();
  }

  #initMode() {
    const modeOpts = { ...this.#options, onBackdropClick: () => this.close() };

    switch (this.#options.mode) {
      case 'modal':
        this.#modeHandler = new ModalMode(this.#pickerElement, modeOpts);
        break;
      case 'inline':
        this.#modeHandler = new InlineMode(
          this.#pickerElement,
          this.#inputElement,
          modeOpts
        );
        break;
      default:
        this.#modeHandler = new PopupMode(
          this.#pickerElement,
          this.#inputElement,
          modeOpts
        );
    }
    this.#modeHandler.init();
  }

  #setupStateObservers() {
    // Re-render on state changes
    this.#stateManager.observeMany(
      [
        'currentMonth',
        'currentYear',
        'selectedDate',
        'viewMode',
        'weekReferenceDate',
      ],
      () => {
        if (this.#stateManager.get('isOpen')) this.render();
      }
    );
  }

  #attachInputEvents() {
    let justClosed = false;

    const handleOpen = () => {
      if (justClosed) return;
      this.open();
    };

    this.#inputElement.addEventListener('click', handleOpen);
    this.#inputElement.addEventListener('focus', handleOpen);
    this._inputHandlers = { click: handleOpen, focus: handleOpen };

    this.#eventBus.on('picker:closed', () => {
      justClosed = true;
      setTimeout(() => {
        justClosed = false;
      }, 100);
    });

    this.#inputElement.addEventListener('blur', () =>
      this.#eventBus.emit('input:blur', {})
    );
    this.#inputElement.addEventListener('change', (e) =>
      this.#eventBus.emit('input:change', { value: e.target.value })
    );
  }

  #attachPickerEvents() {
    this.#pickerElement.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      this.#handleAction(action, target, e);
    });

    // Handle select/input changes
    this.#pickerElement.addEventListener('change', (e) => {
      const target = e.target.closest('[data-action]');
      if (target) {
        const action = target.getAttribute('data-action');
        this.#eventBus.emit('action', {
          action,
          target,
          value: target.value,
          event: e,
        });
      }
    });

    if (this.#options.mode === 'popup') {
      this._outsideClick = (e) => {
        if (!this.#stateManager.get('isOpen')) return;
        const path = e.composedPath();
        if (
          !path.includes(this.#pickerElement) &&
          !path.includes(this.#inputElement)
        ) {
          this.close();
        }
      };
      document.addEventListener('click', this._outsideClick, {
        capture: false,
      });
    }

    this.#pickerElement.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.#options.mode !== 'inline') this.close();
    });
  }

  #handleAction(action, target, event) {
    // Emit action event for all actions (plugins can listen)
    this.#eventBus.emit('action', { action, target, event });

    switch (action) {
      case 'prev-year':
        if (this.#options.showYearNavigation) this.changeYear(-1);
        break;
      case 'next-year':
        if (this.#options.showYearNavigation) this.changeYear(1);
        break;
      case 'prev-month':
        if (this.#options.showMonthNavigation) this.changeMonth(-1);
        break;
      case 'next-month':
        if (this.#options.showMonthNavigation) this.changeMonth(1);
        break;
      case 'select-date':
        this.selectDate(target.getAttribute('data-date'));
        break;
      case 'today':
        this.selectToday();
        break;
      case 'clear':
        this.clearDate();
        break;

      // View mode actions - check options
      case 'show-months':
        if (this.#options.showMonthPicker) this.setViewMode('month');
        break;
      case 'show-years':
        if (this.#options.showYearPicker) this.setViewMode('year');
        break;
      case 'select-month':
        this.#handleMonthSelect(
          parseInt(target.getAttribute('data-month'), 10)
        );
        break;
      case 'select-year':
        this.#handleYearSelect(parseInt(target.getAttribute('data-year'), 10));
        break;
      case 'prev-year-range':
        this.changeYear(-12);
        break;
      case 'next-year-range':
        this.changeYear(12);
        break;

      // Week navigation
      case 'prev-week':
        this.changeWeek(-1);
        break;
      case 'next-week':
        this.changeWeek(1);
        break;

      default:
        this.#eventBus.emit('action:unknown', { action, target, event });
    }
  }

  #handleMonthSelect(month) {
    this.#stateManager.set({ currentMonth: month, viewMode: 'calendar' });
    this.#eventBus.emit('nav:monthSelected', { month });
  }

  #handleYearSelect(year) {
    this.#stateManager.set({ currentYear: year, viewMode: 'month' });
    this.#eventBus.emit('nav:yearSelected', { year });
  }

  #parseInputValue() {
    const value = this.#inputElement.value?.trim();
    if (!value) return;

    const date = parseISO(value);
    if (date && isValidDate(date)) {
      this.#stateManager.set({
        selectedDate: date,
        currentMonth: date.getMonth(),
        currentYear: date.getFullYear(),
      });
    }
  }

  /**
   * Main render method - uses slots and view modes
   */
  render() {
    if (!this.#pickerElement) return;

    const currentMonth = this.#stateManager.get('currentMonth');
    const currentYear = this.#stateManager.get('currentYear');
    const selectedDate = this.#stateManager.get('selectedDate');
    const viewMode = this.#stateManager.get('viewMode');
    const weekReferenceDate = this.#stateManager.get('weekReferenceDate');

    // Update view mode class on picker element
    this.#pickerElement.className = this.#pickerElement.className
      .replace(/bw-datepicker--view-\w+/g, '')
      .trim();
    this.#pickerElement.classList.add(`bw-datepicker--view-${viewMode}`);

    const weeks = this.#generateWeeks(currentMonth, currentYear);
    const slots = this.#slotManager.getAllSlots();

    const renderData = {
      currentMonth,
      currentYear,
      selectedDate,
      viewMode,
      weekReferenceDate,
      weeks,
      options: this.#options,
    };

    // 1. Emit render:before - providers can modify data
    this.#eventBus.emit('render:before', { data: renderData, slots });

    // 2. Render header slot
    const headerIntercepted = this.#eventBus.emit('render:header', {
      data: renderData,
      slot: slots.header,
    });
    if (!headerIntercepted) {
      this.#renderDefaultHeader(renderData, slots.header);
    }

    // 3. Render calendar slot (based on viewMode)
    const calendarIntercepted = this.#eventBus.emit('render:calendar', {
      data: renderData,
      slot: slots.calendar,
      viewMode,
    });
    if (!calendarIntercepted) {
      this.#renderDefaultCalendar(renderData, slots.calendar);
    }

    // 4. Render footer slot
    const footerIntercepted = this.#eventBus.emit('render:footer', {
      data: renderData,
      slot: slots.footer,
    });
    if (!footerIntercepted) {
      this.#renderDefaultFooter(renderData, slots.footer);
    }

    // 5. Emit render:after - decorators can add classes
    this.#eventBus.emit('render:after', {
      data: renderData,
      slots,
      element: this.#pickerElement,
    });
  }

  #renderDefaultHeader(data, slot) {
    const { currentMonth, currentYear, viewMode, options } = data;
    const monthName =
      options.monthNames?.[currentMonth] || MONTH_NAMES[currentMonth];

    const showYearNav = options.showYearNavigation !== false;
    const showMonthNav = options.showMonthNavigation !== false;
    const showMonthPicker = options.showMonthPicker !== false;
    const showYearPicker = options.showYearPicker !== false;

    let titleHtml;
    let navHtml;

    if (viewMode === 'year') {
      // Year view: show year range
      const yearView = this.#views.year;
      const range = yearView.getYearRange(currentYear);
      titleHtml = `<span class="bw-datepicker__title-text">${range.start} - ${range.end}</span>`;
      navHtml = `
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="prev-year-range" aria-label="Previous years">«</button>'
            : '<span></span>'
        }
        <div class="bw-datepicker__title">${titleHtml}</div>
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="next-year-range" aria-label="Next years">»</button>'
            : '<span></span>'
        }
      `;
    } else if (viewMode === 'month') {
      // Month view: show year (clickable if yearPicker enabled)
      if (showYearPicker) {
        titleHtml = `<button type="button" class="bw-datepicker__title-btn" data-action="show-years">${currentYear}</button>`;
      } else {
        titleHtml = `<span class="bw-datepicker__title-text">${currentYear}</span>`;
      }
      navHtml = `
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="prev-year" aria-label="Previous year">«</button>'
            : '<span></span>'
        }
        <div class="bw-datepicker__title">${titleHtml}</div>
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="next-year" aria-label="Next year">»</button>'
            : '<span></span>'
        }
      `;
    } else if (viewMode === 'week') {
      // Week view: show month + year with ALL navigation
      const showWeekNav = options.showWeekNavigation !== false;

      const monthEl = showMonthPicker
        ? `<button type="button" class="bw-datepicker__title-btn" data-action="show-months">${monthName}</button>`
        : `<span class="bw-datepicker__title-text">${monthName}</span>`;

      const yearEl = showYearPicker
        ? `<button type="button" class="bw-datepicker__title-btn" data-action="show-years">${currentYear}</button>`
        : `<span class="bw-datepicker__title-text">${currentYear}</span>`;

      titleHtml = `${monthEl} ${yearEl}`;

      // Week view: year nav (« ») + month nav (‹ ›) + week nav (← →)
      navHtml = `
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="prev-year" aria-label="Previous year">«</button>'
            : ''
        }
        ${
          showMonthNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="prev-month" aria-label="Previous month">‹</button>'
            : ''
        }
        ${
          showWeekNav
            ? '<button type="button" class="bw-datepicker__nav-btn bw-datepicker__nav-btn--week" data-action="prev-week" aria-label="Previous week">←</button>'
            : ''
        }
        <div class="bw-datepicker__title">${titleHtml}</div>
        ${
          showWeekNav
            ? '<button type="button" class="bw-datepicker__nav-btn bw-datepicker__nav-btn--week" data-action="next-week" aria-label="Next week">→</button>'
            : ''
        }
        ${
          showMonthNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="next-month" aria-label="Next month">›</button>'
            : ''
        }
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="next-year" aria-label="Next year">»</button>'
            : ''
        }
      `;
    } else {
      // Calendar view: month + year
      const monthEl = showMonthPicker
        ? `<button type="button" class="bw-datepicker__title-btn" data-action="show-months">${monthName}</button>`
        : `<span class="bw-datepicker__title-text">${monthName}</span>`;

      const yearEl = showYearPicker
        ? `<button type="button" class="bw-datepicker__title-btn" data-action="show-years">${currentYear}</button>`
        : `<span class="bw-datepicker__title-text">${currentYear}</span>`;

      titleHtml = `${monthEl} ${yearEl}`;

      navHtml = `
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="prev-year" aria-label="Previous year">«</button>'
            : ''
        }
        ${
          showMonthNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="prev-month" aria-label="Previous month">‹</button>'
            : ''
        }
        <div class="bw-datepicker__title">${titleHtml}</div>
        ${
          showMonthNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="next-month" aria-label="Next month">›</button>'
            : ''
        }
        ${
          showYearNav
            ? '<button type="button" class="bw-datepicker__nav-btn" data-action="next-year" aria-label="Next year">»</button>'
            : ''
        }
      `;
    }

    slot.innerHTML = `<div class="bw-datepicker__header">${navHtml}</div>`;
  }

  #renderDefaultCalendar(data, slot) {
    const viewMode = data.viewMode || 'calendar';
    const view = this.#views[viewMode];

    if (view) {
      slot.innerHTML = view.render(data);
    }
  }

  #renderDefaultFooter(data, slot) {
    const { options } = data;

    if (options.showFooter === false) {
      slot.innerHTML = '';
      return;
    }

    const showToday = options.showTodayButton !== false;
    const showClear = options.showClearButton !== false;

    if (!showToday && !showClear) {
      slot.innerHTML = '';
      return;
    }

    slot.innerHTML = `
      <div class="bw-datepicker__footer">
        ${
          showToday
            ? '<button type="button" class="bw-datepicker__btn" data-action="today">Today</button>'
            : ''
        }
        ${
          showClear
            ? '<button type="button" class="bw-datepicker__btn" data-action="clear">Clear</button>'
            : ''
        }
      </div>
    `;
  }

  #generateWeeks(month, year) {
    const dateGrid = generateCalendarMonth(
      year,
      month,
      this.#options.firstDayOfWeek
    );
    return dateGrid.map((week) =>
      week.map((date) => ({
        date,
        isCurrentMonth: date.getMonth() === month,
        isDisabled: this.#isDateDisabled(date),
        isWeekend: isWeekend(date),
      }))
    );
  }

  #isDateDisabled(date) {
    return isDisabled(date, {
      minDate: this.#options.minDate,
      maxDate: this.#options.maxDate,
      disabledDates: this.#options.disabledDates,
    });
  }

  // =====================================================================
  // PUBLIC API
  // =====================================================================

  open() {
    if (this.#stateManager.get('isOpen')) return;

    const eventData = {
      cancelled: false,
      cancel: () => {
        eventData.cancelled = true;
      },
    };
    this.#eventBus.emit('picker:beforeOpen', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set('isOpen', true);
    this.#modeHandler.show();
    this.render();

    this.#eventBus.emit('picker:opened', {});
    this.#inputElement.dispatchEvent(
      new CustomEvent('bw-datepicker:open', { bubbles: true })
    );
  }

  close() {
    if (!this.#stateManager.get('isOpen')) return;
    if (this.#options.mode === 'inline') return;

    const eventData = {
      cancelled: false,
      cancel: () => {
        eventData.cancelled = true;
      },
    };
    this.#eventBus.emit('picker:beforeClose', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set('isOpen', false);
    this.#modeHandler.hide();

    // Reset to default view on close (if enabled)
    if (this.#options.resetViewOnClose !== false) {
      this.#stateManager.set('viewMode', this.#options.defaultViewMode);
    }

    this.#eventBus.emit('picker:closed', {});
    this.#inputElement.dispatchEvent(
      new CustomEvent('bw-datepicker:close', { bubbles: true })
    );
  }

  selectDate(dateInput) {
    const date =
      typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!date || !isValidDate(date)) return;
    if (this.#isDateDisabled(date)) return;

    const currentSelected = this.#stateManager.get('selectedDate');

    // Allow deselect
    if (
      this.#options.allowDeselect &&
      currentSelected &&
      isSameDay(date, currentSelected)
    ) {
      this.clearDate();
      return;
    }

    // Before select - cancellable
    const eventData = {
      date,
      cancelled: false,
      cancel: () => {
        eventData.cancelled = true;
      },
    };
    this.#eventBus.emit('date:beforeSelect', eventData);
    if (eventData.cancelled) return;

    const oldDate = currentSelected;

    this.#stateManager.set({
      selectedDate: date,
      currentMonth: date.getMonth(),
      currentYear: date.getFullYear(),
    });

    this.#updateInputValue(date);

    this.#eventBus.emit('date:selected', { date });
    this.#eventBus.emit('date:changed', { date, oldDate });
    this.#inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    this.#inputElement.dispatchEvent(
      new CustomEvent('bw-datepicker:change', {
        detail: { date },
        bubbles: true,
      })
    );

    if (this.#options.closeOnSelect && this.#options.mode !== 'inline') {
      this.close();
    }
  }

  selectToday() {
    const today = new Date();
    if (!this.#isDateDisabled(today)) this.selectDate(today);
  }

  clearDate() {
    const oldDate = this.#stateManager.get('selectedDate');
    this.#stateManager.set('selectedDate', null);
    this.#inputElement.value = '';

    this.#eventBus.emit('date:cleared', {});
    this.#eventBus.emit('date:changed', { date: null, oldDate });
    this.#inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    this.#inputElement.dispatchEvent(
      new CustomEvent('bw-datepicker:change', {
        detail: { date: null },
        bubbles: true,
      })
    );
  }

  changeMonth(offset) {
    let month = this.#stateManager.get('currentMonth') + offset;
    let year = this.#stateManager.get('currentYear');

    if (month > 11) {
      month = 0;
      year++;
    } else if (month < 0) {
      month = 11;
      year--;
    }

    const eventData = {
      month,
      year,
      cancelled: false,
      cancel: () => {
        eventData.cancelled = true;
      },
    };
    this.#eventBus.emit('nav:beforeMonth', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set({ currentMonth: month, currentYear: year });
    this.#eventBus.emit('nav:monthChanged', { month, year });
  }

  changeYear(offset) {
    const year = this.#stateManager.get('currentYear') + offset;

    const eventData = {
      year,
      cancelled: false,
      cancel: () => {
        eventData.cancelled = true;
      },
    };
    this.#eventBus.emit('nav:beforeYear', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set('currentYear', year);
    this.#eventBus.emit('nav:yearChanged', { year });
  }

  /**
   * Change week by offset (for week view navigation)
   * @param {number} offset - Number of weeks to move (negative = previous)
   */
  changeWeek(offset) {
    const currentRef =
      this.#stateManager.get('weekReferenceDate') || new Date();
    const newDate = new Date(currentRef);
    newDate.setDate(newDate.getDate() + offset * 7);

    const eventData = {
      date: newDate,
      cancelled: false,
      cancel: () => {
        eventData.cancelled = true;
      },
    };
    this.#eventBus.emit('nav:beforeWeek', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set({
      weekReferenceDate: newDate,
      currentMonth: newDate.getMonth(),
      currentYear: newDate.getFullYear(),
    });
    this.#eventBus.emit('nav:weekChanged', { date: newDate });
  }

  /**
   * Set view mode
   * @param {string} mode - 'calendar' | 'month' | 'year' | 'week'
   */
  setViewMode(mode) {
    const validModes = ['calendar', 'month', 'year', 'week'];
    if (!validModes.includes(mode)) return;

    this.#stateManager.set('viewMode', mode);
    this.#eventBus.emit('view:changed', { viewMode: mode });
  }

  /**
   * Get current view mode
   * @returns {string}
   */
  getViewMode() {
    return this.#stateManager.get('viewMode');
  }

  setDate(date) {
    if (!date) {
      this.clearDate();
      return;
    }
    this.selectDate(date);
  }

  getDate() {
    return this.#stateManager.get('selectedDate');
  }

  /**
   * Navigate to a date without selecting it
   * @param {Date|string} date - Date to navigate to
   */
  goToDate(date) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!d || !isValidDate(d)) return;

    this.#stateManager.set({
      currentMonth: d.getMonth(),
      currentYear: d.getFullYear(),
    });
  }

  /**
   * Force re-render
   */
  refresh() {
    this.render();
  }

  /**
   * Navigate to today
   */
  goToToday() {
    const today = new Date();
    this.#stateManager.set({
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
    });
  }

  #updateInputValue(date) {
    this.#inputElement.value = date
      ? formatDate(date, this.#options.format)
      : '';
  }

  // =====================================================================
  // PLUGIN API
  // =====================================================================

  getEventBus() {
    return this.#eventBus;
  }
  getStateManager() {
    return this.#stateManager;
  }
  getSlotManager() {
    return this.#slotManager;
  }
  getPickerElement() {
    return this.#pickerElement;
  }
  getInputElement() {
    return this.#inputElement;
  }
  getOptions() {
    return { ...this.#options };
  }
  setOption(key, value) {
    this.#options[key] = value;
  }
  setPlugin(name, instance) {
    this.#plugins.set(name, instance);
  }
  getPlugin(name) {
    return this.#plugins.get(name);
  }

  destroy() {
    this.#eventBus.emit('picker:destroy', {});

    if (this.#modeHandler) {
      this.#modeHandler.destroy();
      this.#modeHandler = null;
    }

    if (this._inputHandlers) {
      this.#inputElement.removeEventListener(
        'click',
        this._inputHandlers.click
      );
      this.#inputElement.removeEventListener(
        'focus',
        this._inputHandlers.focus
      );
    }
    if (this._outsideClick) {
      document.removeEventListener('click', this._outsideClick);
    }

    this.#slotManager.destroy();
    this.#eventBus.clear();
    this.#stateManager.clearObservers();
    this.#plugins.clear();

    if (this.#pickerElement?.parentNode) {
      this.#pickerElement.parentNode.removeChild(this.#pickerElement);
    }

    this.#pickerElement = null;
    this.#inputElement = null;
  }
}

export default CoreController;
