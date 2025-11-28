/**
 * ============================================================================
 * Black & White: UI Engineering
 * CoreController - Slim Core Controller with Event Hooks
 * ============================================================================
 * @version 0.2.0
 * @license MIT
 * ============================================================================
 */

import StateManager from './BWStateManager.js';
import EventBus from './BWEventBus.js';
import CoreRenderer from './CoreRenderer.js';
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
} from './date-utils.js';

const CORE_DEFAULTS = {
  mode: 'popup',
  placement: 'bottom-start',
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
};

export class CoreController {
  #stateManager;
  #eventBus;
  #renderer;
  #modeHandler;
  #inputElement;
  #pickerElement;
  #options;
  #plugins = new Map();

  constructor(inputElement, options = {}) {
    this.#inputElement = inputElement;
    this.#options = { ...CORE_DEFAULTS, ...options };

    let initialDate = null;
    if (this.#options.defaultDate) {
      initialDate = this.#options.defaultDate instanceof Date
        ? this.#options.defaultDate
        : parseISO(this.#options.defaultDate);
    }

    this.#stateManager = new StateManager({
      currentMonth: initialDate ? initialDate.getMonth() : new Date().getMonth(),
      currentYear: initialDate ? initialDate.getFullYear() : new Date().getFullYear(),
      selectedDate: initialDate,
      isOpen: false,
    });

    this.#eventBus = new EventBus();
    this.#renderer = new CoreRenderer();
    this.#renderer.setEventBus(this.#eventBus);

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
    this.#attachPickerEvents();
  }

  #initMode() {
    const modeOpts = { ...this.#options, onBackdropClick: () => this.close() };

    switch (this.#options.mode) {
      case 'modal':
        this.#modeHandler = new ModalMode(this.#pickerElement, modeOpts);
        break;
      case 'inline':
        this.#modeHandler = new InlineMode(this.#pickerElement, this.#inputElement, modeOpts);
        break;
      default:
        this.#modeHandler = new PopupMode(this.#pickerElement, this.#inputElement, modeOpts);
    }
    this.#modeHandler.init();
  }

  #setupStateObservers() {
    this.#stateManager.observeMany(['currentMonth', 'currentYear', 'selectedDate'], () => {
      if (this.#stateManager.get('isOpen')) this.render();
    });
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
      setTimeout(() => { justClosed = false; }, 100);
    });

    // Input events
    this.#inputElement.addEventListener('blur', () => this.#eventBus.emit('input:blur', {}));
    this.#inputElement.addEventListener('change', (e) => this.#eventBus.emit('input:change', { value: e.target.value }));
  }

  #attachPickerEvents() {
    this.#pickerElement.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      this.#handleAction(action, target, e);
    });

    // Handle select/input changes for custom elements
    this.#pickerElement.addEventListener('change', (e) => {
      const target = e.target.closest('[data-action]');
      if (target) {
        const action = target.getAttribute('data-action');
        this.#eventBus.emit('action', { action, target, value: target.value, event: e });
      }
    });

    if (this.#options.mode === 'popup') {
      this._outsideClick = (e) => {
        if (!this.#stateManager.get('isOpen')) return;
        const path = e.composedPath();
        if (!path.includes(this.#pickerElement) && !path.includes(this.#inputElement)) {
          this.close();
        }
      };
      document.addEventListener('click', this._outsideClick, { capture: false });
    }

    this.#pickerElement.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.#options.mode !== 'inline') this.close();
    });
  }

  #handleAction(action, target, event) {
    // Emit action event for all actions (plugins can listen)
    this.#eventBus.emit('action', { action, target, event });

    switch (action) {
      case 'prev-year': this.changeYear(-1); break;
      case 'next-year': this.changeYear(1); break;
      case 'prev-month': this.changeMonth(-1); break;
      case 'next-month': this.changeMonth(1); break;
      case 'select-date': this.selectDate(target.getAttribute('data-date')); break;
      case 'today': this.selectToday(); break;
      case 'clear': this.clearDate(); break;
      default:
        // Unknown action - emit for plugins
        this.#eventBus.emit('action:unknown', { action, target, event });
    }
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

  render() {
    if (!this.#pickerElement) return;

    const currentMonth = this.#stateManager.get('currentMonth');
    const currentYear = this.#stateManager.get('currentYear');
    const selectedDate = this.#stateManager.get('selectedDate');
    const weeks = this.#generateWeeks(currentMonth, currentYear);

    const html = this.#renderer.render({
      currentMonth,
      currentYear,
      selectedDate,
      weeks,
      options: this.#options,
    });

    this.#pickerElement.innerHTML = html;

    // Emit after render - plugins can manipulate DOM
    this.#eventBus.emit('render:after', { element: this.#pickerElement });
  }

  #generateWeeks(month, year) {
    const dateGrid = generateCalendarMonth(year, month, this.#options.firstDayOfWeek);
    return dateGrid.map(week =>
      week.map(date => ({
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

  // PUBLIC API

  open() {
    if (this.#stateManager.get('isOpen')) return;

    const eventData = { cancelled: false, cancel: () => { eventData.cancelled = true; } };
    this.#eventBus.emit('picker:beforeOpen', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set('isOpen', true);
    this.#modeHandler.show();
    this.render();

    this.#eventBus.emit('picker:opened', {});
    this.#inputElement.dispatchEvent(new CustomEvent('bw-datepicker:open', { bubbles: true }));
  }

  close() {
    if (!this.#stateManager.get('isOpen')) return;
    if (this.#options.mode === 'inline') return;

    const eventData = { cancelled: false, cancel: () => { eventData.cancelled = true; } };
    this.#eventBus.emit('picker:beforeClose', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set('isOpen', false);
    this.#modeHandler.hide();

    this.#eventBus.emit('picker:closed', {});
    this.#inputElement.dispatchEvent(new CustomEvent('bw-datepicker:close', { bubbles: true }));
  }

  selectDate(dateInput) {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!date || !isValidDate(date)) return;
    if (this.#isDateDisabled(date)) return;

    const currentSelected = this.#stateManager.get('selectedDate');

    // Allow deselect
    if (this.#options.allowDeselect && currentSelected && isSameDay(date, currentSelected)) {
      this.clearDate();
      return;
    }

    // Before select - cancellable
    const eventData = { date, cancelled: false, cancel: () => { eventData.cancelled = true; } };
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
    this.#inputElement.dispatchEvent(new CustomEvent('bw-datepicker:change', { detail: { date }, bubbles: true }));

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
    this.#inputElement.dispatchEvent(new CustomEvent('bw-datepicker:change', { detail: { date: null }, bubbles: true }));
  }

  changeMonth(offset) {
    let month = this.#stateManager.get('currentMonth') + offset;
    let year = this.#stateManager.get('currentYear');

    if (month > 11) { month = 0; year++; }
    else if (month < 0) { month = 11; year--; }

    const eventData = { month, year, cancelled: false, cancel: () => { eventData.cancelled = true; } };
    this.#eventBus.emit('nav:beforeMonth', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set({ currentMonth: month, currentYear: year });
    this.#eventBus.emit('nav:monthChanged', { month, year });
  }

  changeYear(offset) {
    const year = this.#stateManager.get('currentYear') + offset;

    const eventData = { year, cancelled: false, cancel: () => { eventData.cancelled = true; } };
    this.#eventBus.emit('nav:beforeYear', eventData);
    if (eventData.cancelled) return;

    this.#stateManager.set('currentYear', year);
    this.#eventBus.emit('nav:yearChanged', { year });
  }

  setDate(date) {
    if (!date) { this.clearDate(); return; }
    this.selectDate(date);
  }

  getDate() {
    return this.#stateManager.get('selectedDate');
  }

  #updateInputValue(date) {
    this.#inputElement.value = date ? formatDate(date, this.#options.format) : '';
  }

  // PLUGIN API

  getEventBus() { return this.#eventBus; }
  getStateManager() { return this.#stateManager; }
  getPickerElement() { return this.#pickerElement; }
  getInputElement() { return this.#inputElement; }
  getOptions() { return { ...this.#options }; }
  setPlugin(name, instance) { this.#plugins.set(name, instance); }
  getPlugin(name) { return this.#plugins.get(name); }

  destroy() {
    this.#eventBus.emit('picker:destroy', {});

    if (this.#modeHandler) {
      this.#modeHandler.destroy();
      this.#modeHandler = null;
    }

    if (this._inputHandlers) {
      this.#inputElement.removeEventListener('click', this._inputHandlers.click);
      this.#inputElement.removeEventListener('focus', this._inputHandlers.focus);
    }
    if (this._outsideClick) {
      document.removeEventListener('click', this._outsideClick);
    }

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
