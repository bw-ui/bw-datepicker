/**
 * TouchHandler - Handles touch events and interactions
 */

export class TouchHandler {
  constructor(element, config = {}) {
    this.element = element;
    this.config = {
      tapTimeout: 300,
      minTouchTargetSize: 44,
      enableFeedback: true,
      ...config,
    };

    this.touchStartTime = 0;
    this.touchStartPos = null;
    this.isTouch = false;

    this.handlers = {
      onTap: config.onTap || null,
      onLongPress: config.onLongPress || null,
      onTouchStart: config.onTouchStart || null,
      onTouchEnd: config.onTouchEnd || null,
    };

    this.init();
  }

  init() {
    this.element.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      { passive: false }
    );
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: false,
    });
    this.element.addEventListener(
      'touchcancel',
      this.handleTouchCancel.bind(this)
    );

    if (this.config.enableFeedback) {
      this.addTouchFeedback();
    }
  }

  handleTouchStart(e) {
    this.isTouch = true;
    this.touchStartTime = Date.now();
    this.touchStartPos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    if (this.handlers.onTouchStart) {
      this.handlers.onTouchStart(e);
    }

    if (this.config.enableFeedback) {
      this.addActiveState(e.target);
    }
  }

  handleTouchEnd(e) {
    const duration = Date.now() - this.touchStartTime;
    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };

    const distance = Math.sqrt(
      Math.pow(endPos.x - this.touchStartPos.x, 2) +
        Math.pow(endPos.y - this.touchStartPos.y, 2)
    );

    if (this.config.enableFeedback) {
      this.removeActiveState(e.target);
    }

    if (duration < this.config.tapTimeout && distance < 10) {
      if (this.handlers.onTap) {
        this.handlers.onTap(e, { duration, distance });
      }
    } else if (duration >= 500 && distance < 10) {
      if (this.handlers.onLongPress) {
        this.handlers.onLongPress(e, { duration });
      }
    }

    if (this.handlers.onTouchEnd) {
      this.handlers.onTouchEnd(e);
    }

    this.isTouch = false;
  }

  handleTouchCancel(e) {
    this.isTouch = false;
    if (this.config.enableFeedback) {
      this.removeActiveState(e.target);
    }
  }

  addTouchFeedback() {
    this.element.style.webkitTapHighlightColor = 'transparent';
  }

  addActiveState(target) {
    if (target.classList) {
      target.classList.add('bw-active');
    }
  }

  removeActiveState(target) {
    if (target.classList) {
      setTimeout(() => {
        target.classList.remove('bw-active');
      }, 100);
    }
  }

  ensureTouchTargetSize(element) {
    const rect = element.getBoundingClientRect();
    if (
      rect.width < this.config.minTouchTargetSize ||
      rect.height < this.config.minTouchTargetSize
    ) {
      element.style.minWidth = `${this.config.minTouchTargetSize}px`;
      element.style.minHeight = `${this.config.minTouchTargetSize}px`;
    }
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
  }
}
