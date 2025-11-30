/**
 * DualCalendarRenderer
 * Renders multiple calendars side by side
 */

export class DualCalendarRenderer {
  #manager;
  #options;
  #container = null;
  #utils = null;
  #api = null;

  constructor(manager, options = {}) {
    this.#manager = manager;
    this.#options = {
      showNavigation: 'outside', // 'outside' | 'both' | 'left'
      linked: true,
      ...options,
    };
  }

  /**
   * Set utils from api
   */
  setUtils(utils) {
    this.#utils = utils;
  }

  /**
   * Set API reference for getting fresh options
   */
  setApi(api) {
    this.#api = api;
  }

  /**
   * Get current core options (for locale support)
   */
  #getCoreOptions() {
    if (this.#api) {
      return this.#api.getOptions();
    }
    return {};
  }

  /**
   * Render dual calendar into a slot element (new slot-based architecture)
   */
  renderIntoSlot(slot, stateManager) {
    if (!slot || !this.#utils) return;

    const calendars = this.#manager.getAll();
    const selectedDate = stateManager?.get('selectedDate') || null;

    // Get fresh options from core (for locale plugin support)
    const coreOptions = this.#getCoreOptions();

    // Get month/day names - prefer core options (locale), fallback to utils
    const monthNames = coreOptions.monthNames || this.#utils.MONTH_NAMES;
    const dayNames = coreOptions.dayNames || this.#utils.DAY_NAMES;
    const firstDayOfWeek = coreOptions.firstDayOfWeek ?? 0;

    // Generate weeks for all months
    const calendarData = calendars.map((cal, index) => ({
      ...cal,
      index,
      monthName: monthNames[cal.month],
      weeks: this.#utils.generateCalendarMonth(
        cal.year,
        cal.month,
        firstDayOfWeek
      ),
    }));

    // Create dual wrapper inside slot
    let dualWrapper = slot.querySelector('.bw-dual-wrapper');
    if (!dualWrapper) {
      dualWrapper = document.createElement('div');
      dualWrapper.className = 'bw-dual-wrapper';
      slot.innerHTML = '';
      slot.appendChild(dualWrapper);
    }

    // Render HTML based on navigation mode
    dualWrapper.innerHTML = this.#renderHTML(
      calendarData,
      selectedDate,
      dayNames,
      firstDayOfWeek
    );
    this.#container = dualWrapper;
  }

  /**
   * Render dual calendar into picker element (legacy method for backward compat)
   */
  render(pickerEl, stateManager) {
    const container = pickerEl.querySelector('.bw-datepicker__container');
    if (!container || !this.#utils) return;

    const calendars = this.#manager.getAll();
    const selectedDate = stateManager?.get('selectedDate') || null;

    // Get fresh options from core (for locale plugin support)
    const coreOptions = this.#getCoreOptions();

    // Get month/day names - prefer core options (locale), fallback to utils
    const monthNames = coreOptions.monthNames || this.#utils.MONTH_NAMES;
    const dayNames = coreOptions.dayNames || this.#utils.DAY_NAMES;
    const firstDayOfWeek = coreOptions.firstDayOfWeek ?? 0;

    // Generate weeks for all months
    const calendarData = calendars.map((cal, index) => ({
      ...cal,
      index,
      monthName: monthNames[cal.month],
      weeks: this.#utils.generateCalendarMonth(
        cal.year,
        cal.month,
        firstDayOfWeek
      ),
    }));

    // Hide original single calendar elements (only first time)
    const existingCalendar = container.querySelector(
      ':scope > .bw-datepicker__calendar'
    );
    const existingHeader = container.querySelector(
      ':scope > .bw-datepicker__header'
    );
    const existingWeekdays = container.querySelector(
      ':scope > .bw-datepicker__weekdays'
    );
    const existingFooter = container.querySelector(
      ':scope > .bw-datepicker__footer'
    );

    if (existingHeader) existingHeader.style.display = 'none';
    if (existingWeekdays) existingWeekdays.style.display = 'none';
    if (existingCalendar) existingCalendar.style.display = 'none';
    if (existingFooter) existingFooter.style.display = 'none';

    // Check for existing dual wrapper (might be nested in range wrapper)
    let dualWrapper = container.querySelector('.bw-dual-wrapper');
    if (!dualWrapper) {
      dualWrapper = document.createElement('div');
      dualWrapper.className = 'bw-dual-wrapper';

      if (existingHeader) {
        existingHeader.insertAdjacentElement('afterend', dualWrapper);
      } else {
        container.insertAdjacentElement('afterbegin', dualWrapper);
      }
    }

    // Render HTML based on navigation mode
    dualWrapper.innerHTML = this.#renderHTML(
      calendarData,
      selectedDate,
      dayNames,
      firstDayOfWeek
    );
    this.#container = dualWrapper;
  }

  /**
   * Generate HTML based on navigation mode
   */
  #renderHTML(calendarData, selectedDate, dayNames, firstDayOfWeek) {
    const navMode = this.#options.showNavigation;
    const linked = this.#options.linked;

    if (navMode === 'outside') {
      return this.#renderOutsideNav(
        calendarData,
        selectedDate,
        dayNames,
        firstDayOfWeek
      );
    } else if (navMode === 'both') {
      return this.#renderBothNav(
        calendarData,
        selectedDate,
        dayNames,
        firstDayOfWeek,
        linked
      );
    } else if (navMode === 'left') {
      return this.#renderLeftNav(
        calendarData,
        selectedDate,
        dayNames,
        firstDayOfWeek
      );
    }

    // Default to outside
    return this.#renderOutsideNav(
      calendarData,
      selectedDate,
      dayNames,
      firstDayOfWeek
    );
  }

  /**
   * Render with navigation on outside edges only
   * ◄ [Dec 2025] [Jan 2026] ►
   */
  #renderOutsideNav(calendarData, selectedDate, dayNames, firstDayOfWeek) {
    const titles = calendarData
      .map((c) => `<span class="bw-dual-title">${c.monthName} ${c.year}</span>`)
      .join('');

    const calendarsHTML = calendarData
      .map(
        (c) =>
          `<div class="bw-dual-calendar" data-index="${c.index}">
        ${this.#renderWeekdays(dayNames, firstDayOfWeek)}
        ${this.#renderDays(c.weeks, c.month, selectedDate)}
      </div>`
      )
      .join('');

    return `
      <div class="bw-dual-nav bw-dual-nav--outside">
        <button type="button" class="bw-dual-nav__btn" data-action="prev-month" aria-label="Previous month">
          ${this.#iconPrev()}
        </button>
        <div class="bw-dual-titles">${titles}</div>
        <button type="button" class="bw-dual-nav__btn" data-action="next-month" aria-label="Next month">
          ${this.#iconNext()}
        </button>
      </div>
      <div class="bw-dual-calendars">${calendarsHTML}</div>
    `;
  }

  /**
   * Render with navigation on each calendar
   * ◄ [Dec 2025] ► ◄ [Jan 2026] ►
   */
  #renderBothNav(calendarData, selectedDate, dayNames, firstDayOfWeek, linked) {
    const calendarsHTML = calendarData
      .map((c) => {
        const actionPrev = linked ? 'prev-month' : `prev-month-${c.index}`;
        const actionNext = linked ? 'next-month' : `next-month-${c.index}`;

        return `
        <div class="bw-dual-calendar bw-dual-calendar--with-nav" data-index="${
          c.index
        }">
          <div class="bw-dual-calendar__header">
            <button type="button" class="bw-dual-nav__btn" data-action="${actionPrev}" aria-label="Previous month">
              ${this.#iconPrev()}
            </button>
            <span class="bw-dual-title">${c.monthName} ${c.year}</span>
            <button type="button" class="bw-dual-nav__btn" data-action="${actionNext}" aria-label="Next month">
              ${this.#iconNext()}
            </button>
          </div>
          ${this.#renderWeekdays(dayNames, firstDayOfWeek)}
          ${this.#renderDays(c.weeks, c.month, selectedDate)}
        </div>
      `;
      })
      .join('');

    return `<div class="bw-dual-calendars bw-dual-calendars--both-nav">${calendarsHTML}</div>`;
  }

  /**
   * Render with navigation only on left calendar
   * ◄ [Dec 2025] ► [Jan 2026]
   */
  #renderLeftNav(calendarData, selectedDate, dayNames, firstDayOfWeek) {
    const calendarsHTML = calendarData
      .map((c, i) => {
        const hasNav = i === 0;

        if (hasNav) {
          return `
          <div class="bw-dual-calendar bw-dual-calendar--with-nav" data-index="${
            c.index
          }">
            <div class="bw-dual-calendar__header">
              <button type="button" class="bw-dual-nav__btn" data-action="prev-month" aria-label="Previous month">
                ${this.#iconPrev()}
              </button>
              <span class="bw-dual-title">${c.monthName} ${c.year}</span>
              <button type="button" class="bw-dual-nav__btn" data-action="next-month" aria-label="Next month">
                ${this.#iconNext()}
              </button>
            </div>
            ${this.#renderWeekdays(dayNames, firstDayOfWeek)}
            ${this.#renderDays(c.weeks, c.month, selectedDate)}
          </div>
        `;
        }

        return `
        <div class="bw-dual-calendar" data-index="${c.index}">
          <div class="bw-dual-calendar__header bw-dual-calendar__header--no-nav">
            <span class="bw-dual-title">${c.monthName} ${c.year}</span>
          </div>
          ${this.#renderWeekdays(dayNames, firstDayOfWeek)}
          ${this.#renderDays(c.weeks, c.month, selectedDate)}
        </div>
      `;
      })
      .join('');

    return `<div class="bw-dual-calendars bw-dual-calendars--left-nav">${calendarsHTML}</div>`;
  }

  /**
   * Render weekdays row
   */
  #renderWeekdays(dayNames, firstDayOfWeek) {
    const ordered = [
      ...dayNames.slice(firstDayOfWeek),
      ...dayNames.slice(0, firstDayOfWeek),
    ];

    return `
      <div class="bw-dual-weekdays">
        ${ordered
          .map((d) => `<span class="bw-dual-weekday">${d}</span>`)
          .join('')}
      </div>
    `;
  }

  /**
   * Render days grid - uses bw-datepicker__day class for Range plugin compatibility
   * Emits render:day events for each day to allow plugins like Data to customize
   */
  #renderDays(weeks, currentMonth, selectedDate) {
    const coreOptions = this.#getCoreOptions();
    const showOtherMonths = coreOptions.showOtherMonths !== false;
    const eventBus = this.#api?.getEventBus();

    const rows = weeks.map((week) => {
      const cells = week.map((day) => {
        if (!day) {
          return '<span class="bw-dual-day bw-datepicker__day bw-datepicker__day--empty"></span>';
        }

        const isOtherMonth = day.getMonth() !== currentMonth;

        // If showOtherMonths is false, render empty cell for other month days
        if (isOtherMonth && !showOtherMonths) {
          return '<span class="bw-dual-day bw-datepicker__day bw-datepicker__day--empty"></span>';
        }

        const dateStr = this.#toDateString(day);
        const isSelected = selectedDate && this.#isSameDay(day, selectedDate);
        const isToday = this.#isToday(day);
        const dayOfWeek = day.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isDisabled = this.#isDisabled(day);

        // Build dayData object similar to core
        const dayData = {
          date: day,
          dateISO: dateStr,
          day: day.getDate(),
          dayOfWeek: dayOfWeek,
          dayName: this.#utils?.DAY_NAMES?.[dayOfWeek] || '',
          isToday: isToday,
          isSelected: isSelected,
          isWeekend: isWeekend,
          isCurrentMonth: !isOtherMonth,
          isDisabled: isDisabled,
        };

        // Create event data that plugins can modify
        const eventData = {
          dayData: dayData,
          html: null, // Plugins can set this to override rendering
        };

        // Emit render:day event - plugins can modify eventData.html
        if (eventBus) {
          eventBus.emit('render:day', eventData);
        }

        // If a plugin provided custom HTML, use it
        if (eventData.html) {
          return eventData.html;
        }

        // Default rendering
        // Use both dual-day and datepicker__day classes for compatibility
        const classes = ['bw-dual-day', 'bw-datepicker__day'];

        if (isOtherMonth) {
          classes.push('bw-dual-day--other', 'bw-datepicker__day--other-month');
        }

        if (isSelected) {
          classes.push('bw-dual-day--selected', 'bw-datepicker__day--selected');
        }

        if (isToday) {
          classes.push('bw-dual-day--today', 'bw-datepicker__day--today');
        }

        if (isWeekend) {
          classes.push('bw-datepicker__day--weekend');
        }

        if (isDisabled) {
          classes.push('bw-dual-day--disabled', 'bw-datepicker__day--disabled');
        }

        return `<span class="${classes.join(
          ' '
        )}" data-date="${dateStr}" tabindex="0" role="gridcell">${day.getDate()}</span>`;
      });

      return `<div class="bw-dual-week">${cells.join('')}</div>`;
    });

    return `<div class="bw-dual-days">${rows.join('')}</div>`;
  }

  /**
   * Check if date is disabled
   */
  #isDisabled(date) {
    const coreOptions = this.#getCoreOptions();

    // Check minDate
    if (coreOptions.minDate && date < coreOptions.minDate) {
      return true;
    }

    // Check maxDate
    if (coreOptions.maxDate && date > coreOptions.maxDate) {
      return true;
    }

    // Check disabledDates
    if (coreOptions.disabledDates && Array.isArray(coreOptions.disabledDates)) {
      return coreOptions.disabledDates.some((d) => this.#isSameDay(d, date));
    }

    return false;
  }

  /**
   * Icons
   */
  #iconPrev() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
  }

  #iconNext() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
  }

  /**
   * Convert date to string
   */
  #toDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Check if same day
   */
  #isSameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  /**
   * Check if today
   */
  #isToday(date) {
    return this.#isSameDay(date, new Date());
  }

  /**
   * Get container element
   */
  getContainer() {
    return this.#container;
  }

  /**
   * Destroy
   */
  destroy() {
    if (this.#container) {
      this.#container.remove();
      this.#container = null;
    }
  }
}

export default DualCalendarRenderer;
