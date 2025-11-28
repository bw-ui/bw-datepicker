/**
 * OrientationHandler - Handles device orientation changes
 */

export class OrientationHandler {
  constructor(config = {}) {
    this.config = {
      debounce: 200,
      onOrientationChange: config.onOrientationChange || null,
      ...config,
    };

    this.currentOrientation = this.getOrientation();
    this.debounceTimer = null;

    this.init();
  }

  init() {
    window.addEventListener(
      'orientationchange',
      this.handleOrientationChange.bind(this)
    );
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  getOrientation() {
    if (window.orientation !== undefined) {
      return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
    }
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  handleOrientationChange() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      const newOrientation = this.getOrientation();

      if (newOrientation !== this.currentOrientation) {
        const oldOrientation = this.currentOrientation;
        this.currentOrientation = newOrientation;

        if (this.config.onOrientationChange) {
          this.config.onOrientationChange({
            orientation: newOrientation,
            previousOrientation: oldOrientation,
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      }
    }, this.config.debounce);
  }

  handleResize() {
    this.handleOrientationChange();
  }

  isPortrait() {
    return this.currentOrientation === 'portrait';
  }

  isLandscape() {
    return this.currentOrientation === 'landscape';
  }

  getCurrentOrientation() {
    return this.currentOrientation;
  }

  destroy() {
    window.removeEventListener(
      'orientationchange',
      this.handleOrientationChange
    );
    window.removeEventListener('resize', this.handleResize);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
