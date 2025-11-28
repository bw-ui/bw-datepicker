/**
 * GestureRecognizer - Recognizes swipe and gesture patterns
 */

export class GestureRecognizer {
  constructor(element, config = {}) {
    this.element = element;
    this.config = {
      swipeThreshold: 50,
      swipeTimeout: 300,
      velocityThreshold: 0.3,
      ...config,
    };

    this.touchStart = null;
    this.touchEnd = null;
    this.startTime = 0;

    this.handlers = {
      onSwipeLeft: config.onSwipeLeft || null,
      onSwipeRight: config.onSwipeRight || null,
      onSwipeUp: config.onSwipeUp || null,
      onSwipeDown: config.onSwipeDown || null,
    };

    this.init();
  }

  init() {
    this.element.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      { passive: true }
    );
    this.element.addEventListener(
      'touchmove',
      this.handleTouchMove.bind(this),
      { passive: true }
    );
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: true,
    });
  }

  handleTouchStart(e) {
    this.touchStart = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    this.startTime = Date.now();
  }

  handleTouchMove(e) {
    if (!this.touchStart) return;

    this.touchEnd = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  handleTouchEnd(e) {
    if (!this.touchStart || !this.touchEnd) {
      this.touchStart = null;
      this.touchEnd = null;
      return;
    }

    const deltaX = this.touchEnd.x - this.touchStart.x;
    const deltaY = this.touchEnd.y - this.touchStart.y;
    const duration = Date.now() - this.startTime;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (duration > this.config.swipeTimeout) {
      this.touchStart = null;
      this.touchEnd = null;
      return;
    }

    const velocity = Math.max(absX, absY) / duration;

    if (velocity < this.config.velocityThreshold) {
      this.touchStart = null;
      this.touchEnd = null;
      return;
    }

    if (absX > absY && absX > this.config.swipeThreshold) {
      if (deltaX > 0) {
        if (this.handlers.onSwipeRight) {
          this.handlers.onSwipeRight({ deltaX, deltaY, duration, velocity });
        }
      } else {
        if (this.handlers.onSwipeLeft) {
          this.handlers.onSwipeLeft({ deltaX, deltaY, duration, velocity });
        }
      }
    } else if (absY > absX && absY > this.config.swipeThreshold) {
      if (deltaY > 0) {
        if (this.handlers.onSwipeDown) {
          this.handlers.onSwipeDown({ deltaX, deltaY, duration, velocity });
        }
      } else {
        if (this.handlers.onSwipeUp) {
          this.handlers.onSwipeUp({ deltaX, deltaY, duration, velocity });
        }
      }
    }

    this.touchStart = null;
    this.touchEnd = null;
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}
