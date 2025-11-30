/**
 * DualCalendarManager
 * Manages state for multiple calendars
 */

export class DualCalendarManager {
  #months = []; // Array of { month, year }
  #options;

  constructor(options = {}) {
    this.#options = {
      linked: true,
      months: 2, // Number of months to show (2-4)
      gap: 1, // Months between each calendar (1 = consecutive)
      leftMonth: null, // Starting month (0-11)
      leftYear: null, // Starting year
      ...options,
    };

    this.#initialize();
  }

  /**
   * Initialize calendar months
   */
  #initialize() {
    const today = new Date();
    let startMonth = this.#options.leftMonth ?? today.getMonth();
    let startYear = this.#options.leftYear ?? today.getFullYear();

    this.#months = [];

    for (let i = 0; i < this.#options.months; i++) {
      let month = startMonth + i * this.#options.gap;
      let year = startYear;

      // Handle year overflow
      while (month > 11) {
        month -= 12;
        year += 1;
      }
      while (month < 0) {
        month += 12;
        year -= 1;
      }

      this.#months.push({ month, year });
    }
  }

  /**
   * Get all calendar states
   */
  getAll() {
    return [...this.#months];
  }

  /**
   * Get left (first) calendar state
   */
  getLeft() {
    return this.#months[0] || { month: 0, year: 2025 };
  }

  /**
   * Get right (second) calendar state
   */
  getRight() {
    return this.#months[1] || this.#months[0] || { month: 0, year: 2025 };
  }

  /**
   * Get calendar at index
   */
  getAt(index) {
    return this.#months[index] || null;
  }

  /**
   * Get number of months
   */
  getMonthCount() {
    return this.#months.length;
  }

  /**
   * Navigate to previous month(s)
   */
  prevMonth() {
    this.#months = this.#months.map(({ month, year }) => {
      let newMonth = month - 1;
      let newYear = year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      return { month: newMonth, year: newYear };
    });
  }

  /**
   * Navigate to next month(s)
   */
  nextMonth() {
    this.#months = this.#months.map(({ month, year }) => {
      let newMonth = month + 1;
      let newYear = year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { month: newMonth, year: newYear };
    });
  }

  /**
   * Navigate to previous year
   */
  prevYear() {
    this.#months = this.#months.map(({ month, year }) => ({
      month,
      year: year - 1,
    }));
  }

  /**
   * Navigate to next year
   */
  nextYear() {
    this.#months = this.#months.map(({ month, year }) => ({
      month,
      year: year + 1,
    }));
  }

  /**
   * Navigate specific calendar (for independent mode)
   */
  prevMonthAt(index) {
    if (!this.#months[index]) return;
    let { month, year } = this.#months[index];
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    this.#months[index] = { month, year };
  }

  /**
   * Navigate specific calendar (for independent mode)
   */
  nextMonthAt(index) {
    if (!this.#months[index]) return;
    let { month, year } = this.#months[index];
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    this.#months[index] = { month, year };
  }

  /**
   * Set left calendar to specific month/year
   */
  setLeft(month, year) {
    if (this.#options.linked) {
      // Recalculate all months from new start
      this.#options.leftMonth = month;
      this.#options.leftYear = year;
      this.#initialize();
    } else {
      this.#months[0] = { month, year };
    }
  }

  /**
   * Set right calendar to specific month/year (only if not linked)
   */
  setRight(month, year) {
    if (!this.#options.linked && this.#months[1]) {
      this.#months[1] = { month, year };
    }
  }

  /**
   * Set calendar at index
   */
  setAt(index, month, year) {
    if (this.#options.linked) {
      // In linked mode, shift all calendars
      const diff = index;
      this.#options.leftMonth = month - diff * this.#options.gap;
      this.#options.leftYear = year;
      this.#initialize();
    } else if (this.#months[index]) {
      this.#months[index] = { month, year };
    }
  }

  /**
   * Go to today
   */
  goToToday() {
    const today = new Date();
    this.#options.leftMonth = today.getMonth();
    this.#options.leftYear = today.getFullYear();
    this.#initialize();
  }

  /**
   * Go to specific date (shows in left calendar)
   */
  goToDate(date) {
    this.#options.leftMonth = date.getMonth();
    this.#options.leftYear = date.getFullYear();
    this.#initialize();
  }

  /**
   * Check if linked navigation
   */
  isLinked() {
    return this.#options.linked;
  }

  /**
   * Set linked mode
   */
  setLinked(linked) {
    this.#options.linked = linked;
    if (linked) {
      // Recalculate from first calendar
      const first = this.#months[0];
      if (first) {
        this.#options.leftMonth = first.month;
        this.#options.leftYear = first.year;
        this.#initialize();
      }
    }
  }

  /**
   * Destroy
   */
  destroy() {
    this.#months = [];
  }
}

export default DualCalendarManager;
