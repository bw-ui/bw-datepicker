/**
 * @bw-ui/datepicker-mobile
 * Mobile Plugin - Touch support, swipe gestures, orientation handling
 *
 * Compatible with slot-based architecture (v1.1.0):
 * - Uses core API (prevMonth/nextMonth) for swipe navigation
 * - No dependencies on other plugins
 * - Works with DualCalendar (swipe navigates all months)
 *
 * @version 1.1.0
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

    const instances = {
      touch: null,
      gestures: null,
      orientation: null,
      deviceInfo,
    };

    // Touch Handler
    if (options.enableTouch !== false) {
      instances.touch = new TouchHandler(pickerEl, {
        enableFeedback: options.touchFeedback !== false,
      });
    }

    // Gesture Recognizer (Swipe)
    if (options.enableSwipe !== false && options.enableTouch !== false) {
      instances.gestures = new GestureRecognizer(pickerEl, {
        swipeThreshold: options.swipeThreshold || 50,
        onSwipeLeft: () => {
          api.datepicker.nextMonth();
          eventBus.emit('gesture:swipeLeft');
        },
        onSwipeRight: () => {
          api.datepicker.prevMonth();
          eventBus.emit('gesture:swipeRight');
        },
      });
    }

    // Orientation Handler
    if (options.enableOrientationChange !== false) {
      instances.orientation = new OrientationHandler({
        onOrientationChange: (info) => {
          eventBus.emit('orientation:changed', info);
          api.datepicker.refresh();
        },
      });
    }

    return instances;
  },

  destroy(instance) {
    instance?.touch?.destroy?.();
    instance?.gestures?.destroy?.();
    instance?.orientation?.destroy?.();
  },
};

export { MobileDetector, TouchHandler, GestureRecognizer, OrientationHandler };
export default MobilePlugin;
