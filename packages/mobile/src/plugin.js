/**
 * @bw-ui/datepicker-mobile
 * Mobile Plugin - Touch support, swipe gestures, orientation handling
 */

import { MobileDetector } from './MobileDetector.js';
import { TouchHandler } from './TouchHandler.js';
import { GestureRecognizer } from './GestureRecognizer.js';
import { OrientationHandler } from './OrientationHandler.js';

export const MobilePlugin = {
  name: 'mobile',
  
  init(api, options = {}) {
    const pickerEl = api.getPickerElement();
    const eventBus = api.getEventBus();
    const deviceInfo = MobileDetector.detect();

    const touch = new TouchHandler(pickerEl, {
      enableFeedback: options.touchFeedback !== false,
    });

    const gestures = new GestureRecognizer(pickerEl, {
      onSwipeLeft: () => {
        api.datepicker.nextMonth();
        eventBus.emit('gesture:swipeLeft');
      },
      onSwipeRight: () => {
        api.datepicker.prevMonth();
        eventBus.emit('gesture:swipeRight');
      },
    });

    const orientation = new OrientationHandler({
      onOrientationChange: (info) => {
        eventBus.emit('orientation:changed', info);
        api.datepicker.refresh();
      },
    });

    return { touch, gestures, orientation, deviceInfo };
  },
  
  destroy(instance) {
    instance?.touch?.destroy?.();
    instance?.gestures?.destroy?.();
    instance?.orientation?.destroy?.();
  }
};

export { MobileDetector, TouchHandler, GestureRecognizer, OrientationHandler };
export default MobilePlugin;
