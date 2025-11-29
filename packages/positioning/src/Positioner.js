/**
 * Positioner - Main positioning controller for BW DatePicker
 */

export class Positioner {
  constructor(config = {}) {
    this.config = {
      placement: 'bottom',
      alignment: 'left',
      autoFlip: true,
      constrainToViewport: true,
      offset: { x: 0, y: 8 },
      margin: 8,
      zIndex: 1000,
      onPosition: null,
      ...config,
    };

    this.triggerElement = null;
    this.pickerElement = null;
    this.isPositioned = false;
    this.currentPosition = null;
  }

  position(pickerEl, inputEl) {
    if (pickerEl) this.pickerElement = pickerEl;
    if (inputEl) this.triggerElement = inputEl;

    if (!this.triggerElement || !this.pickerElement) {
      return null;
    }

    const { placement, alignment, autoFlip, offset, margin } = this.config;

    const triggerRect = this.triggerElement.getBoundingClientRect();
    const pickerRect = this.pickerElement.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let finalPlacement = placement;
    let finalAlignment = alignment;

    // Only flip if autoFlip is true
    if (autoFlip === true) {
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (finalPlacement === 'bottom') {
        if (spaceBelow < pickerRect.height && spaceAbove >= pickerRect.height) {
          finalPlacement = 'top';
        }
      } else if (finalPlacement === 'top') {
        if (spaceAbove < pickerRect.height && spaceBelow >= pickerRect.height) {
          finalPlacement = 'bottom';
        }
      }
    }

    let top, left;

    // Calculate top (absolute = viewport + scroll)
    if (finalPlacement === 'top') {
      top = triggerRect.top + scrollY - pickerRect.height - offset.y;
    } else {
      top = triggerRect.bottom + scrollY + offset.y;
    }

    // Calculate left (keep alignment)
    if (finalAlignment === 'right' || finalAlignment === 'end') {
      left = triggerRect.right + scrollX - pickerRect.width - offset.x;
    } else if (finalAlignment === 'center') {
      left =
        triggerRect.left + scrollX + (triggerRect.width - pickerRect.width) / 2;
    } else {
      left = triggerRect.left + scrollX + offset.x;
    }

    // Constrain to viewport (account for scroll)
    if (this.config.constrainToViewport) {
      const minLeft = scrollX + margin;
      const maxLeft = scrollX + viewportWidth - pickerRect.width - margin;
      const minTop = scrollY + margin;
      const maxTop = scrollY + viewportHeight - pickerRect.height - margin;

      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;
      if (top < minTop) top = minTop;
      if (top > maxTop) top = maxTop;
    }

    // Apply absolute position
    this.pickerElement.style.position = 'absolute';
    this.pickerElement.style.top = `${top}px`;
    this.pickerElement.style.left = `${left}px`;
    this.pickerElement.style.zIndex = this.config.zIndex;
    this.pickerElement.setAttribute('data-placement', finalPlacement);
    this.pickerElement.setAttribute('data-alignment', finalAlignment);

    this.currentPosition = {
      top,
      left,
      placement: finalPlacement,
      alignment: finalAlignment,
    };
    this.isPositioned = true;

    if (this.config.onPosition) {
      this.config.onPosition(this.currentPosition);
    }

    return this.currentPosition;
  }

  destroy() {
    this.triggerElement = null;
    this.pickerElement = null;
    this.isPositioned = false;
    this.currentPosition = null;
  }
}
