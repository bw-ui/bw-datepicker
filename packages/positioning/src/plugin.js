/**
 * @bw-ui/datepicker-positioning
 * Positioning Plugin - Auto-flip, collision detection, viewport constraints
 */

import { Positioner } from './Positioner.js';
import { AutoFlip } from './AutoFlip.js';
import { Collision } from './Collision.js';
import { ViewportDetector } from './ViewportDetector.js';

export const PositioningPlugin = {
  name: 'positioning',
  
  init(api, options = {}) {
    const opts = api.getOptions();
    if (opts.mode === 'inline' || opts.mode === 'modal') return null;

    const positioner = new Positioner({
      placement: options.placement || opts.placement || 'bottom',
      alignment: options.alignment || opts.alignment || 'left',
      autoFlip: options.autoFlip !== false,
      offset: options.offset || { x: 0, y: 8 },
      constrainToViewport: options.constrainToViewport !== false,
      margin: options.margin || 8,
    });

    const eventBus = api.getEventBus();
    const pickerEl = api.getPickerElement();
    const inputEl = api.getInputElement();

    eventBus.on('picker:opened', () => {
      if (pickerEl && inputEl) {
        positioner.position(pickerEl, inputEl);
      }
    });

    return positioner;
  },
  
  destroy(instance) {
    instance?.destroy?.();
  }
};

export { Positioner, AutoFlip, Collision, ViewportDetector };
export default PositioningPlugin;
