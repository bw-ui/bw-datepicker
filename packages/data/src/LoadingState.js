/**
 * LoadingState
 * Shows loading indicator while fetching data
 *
 * Updated for slot-based architecture
 * Supports multiple loader types
 */

export class LoadingState {
  #pickerEl;
  #options;
  #isLoading = false;
  #overlayEl = null;

  constructor(options = {}) {
    this.#options = {
      showLoading: true,
      loaderType: 'overlay', // 'overlay' | 'calendar' | 'skeleton' | 'spinner'
      ...options,
    };
  }

  /**
   * Set picker element
   */
  setCalendar(pickerEl) {
    this.#pickerEl = pickerEl;
  }

  /**
   * Show loading state
   */
  show() {
    if (!this.#options.showLoading || !this.#pickerEl) return;

    this.#isLoading = true;

    const loaderType = this.#options.loaderType;
    this.#pickerEl.classList.add('bw-datepicker--data-loading');
    this.#pickerEl.setAttribute('data-loader-type', loaderType);

    if (loaderType === 'overlay') {
      this.#createOverlay();
    } else if (loaderType === 'skeleton') {
      this.#addSkeletons();
    }
  }

  /**
   * Create full picker overlay
   */
  #createOverlay() {
    if (this.#overlayEl) return;

    this.#overlayEl = document.createElement('div');
    this.#overlayEl.className = 'bw-datepicker__loading-overlay';
    this.#overlayEl.innerHTML =
      '<div class="bw-datepicker__loading-spinner"></div>';

    // Prevent clicks from passing through
    this.#overlayEl.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    this.#pickerEl.appendChild(this.#overlayEl);
  }

  /**
   * Add skeleton loaders to day cells
   */
  #addSkeletons() {
    const dayCells = this.#pickerEl.querySelectorAll(
      '.bw-datepicker__day[data-date]'
    );

    dayCells.forEach((cell) => {
      if (!cell.querySelector('.bw-day-skeleton')) {
        const skeleton = document.createElement('div');
        skeleton.className = 'bw-day-skeleton';
        cell.appendChild(skeleton);
      }
    });
  }

  /**
   * Hide loading state
   */
  hide() {
    if (!this.#pickerEl) return;

    this.#isLoading = false;
    this.#pickerEl.classList.remove('bw-datepicker--data-loading');
    this.#pickerEl.removeAttribute('data-loader-type');

    // Remove overlay
    if (this.#overlayEl) {
      this.#overlayEl.remove();
      this.#overlayEl = null;
    }

    // Remove skeletons
    const skeletons = this.#pickerEl.querySelectorAll('.bw-day-skeleton');
    skeletons.forEach((skeleton) => skeleton.remove());
  }

  /**
   * Check if loading
   */
  isLoading() {
    return this.#isLoading;
  }

  /**
   * Destroy loading state
   */
  destroy() {
    this.hide();
    this.#pickerEl = null;
  }
}

export default LoadingState;
