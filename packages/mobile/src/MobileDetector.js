/**
 * MobileDetector - Detects mobile devices and viewport characteristics
 */

export class MobileDetector {
  static detect() {
    return {
      isMobile: this.isMobile(),
      isTablet: this.isTablet(),
      isDesktop: this.isDesktop(),
      isTouchDevice: this.isTouchDevice(),
      isIOS: this.isIOS(),
      isAndroid: this.isAndroid(),
      viewport: this.getViewportType(),
      orientation: this.getOrientation(),
    };
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static isTablet() {
    return (
      /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
    );
  }

  static isDesktop() {
    return !this.isMobile() && !this.isTablet();
  }

  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  static isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  static getViewportType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  static getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  static getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1,
    };
  }
}
