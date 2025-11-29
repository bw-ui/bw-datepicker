/**
 * @bw-ui/datepicker-positioning
 */

import { Positioner } from './Positioner.js';

export const PositioningPlugin = {
  name: 'positioning',

  init(api, options = {}) {
    const opts = api.getOptions();
    if (opts.mode === 'inline' || opts.mode === 'modal') return null;

    const positioner = new Positioner({
      placement: options.placement || 'bottom',
      alignment: options.alignment || 'left',
      autoFlip: options.autoFlip === true,
      offset: options.offset || { x: 0, y: 8 },
      constrainToViewport: options.constrainToViewport !== false,
      margin: options.margin || 8,
      zIndex: options.zIndex || 1000,
      onPosition: options.onPosition || null,
    });

    const eventBus = api.getEventBus();
    const pickerEl = api.getPickerElement();
    const inputEl = api.getInputElement();

    let scrollHandler = null;
    let resizeHandler = null;

    const doPosition = () => {
      positioner.position(pickerEl, inputEl);
    };

    eventBus.on('picker:opened', () => {
      if (pickerEl && inputEl) {
        requestAnimationFrame(doPosition);

        // Add scroll/resize handlers
        scrollHandler = () => doPosition();
        resizeHandler = () => doPosition();
        window.addEventListener('scroll', scrollHandler, {
          passive: true,
          capture: true,
        });
        window.addEventListener('resize', resizeHandler, { passive: true });
      }
    });

    eventBus.on('picker:closed', () => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler, { capture: true });
        scrollHandler = null;
      }
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
      }
    });

    return positioner;
  },

  destroy(instance) {
    instance?.destroy?.();
  },
};

export { Positioner };
export default PositioningPlugin;
