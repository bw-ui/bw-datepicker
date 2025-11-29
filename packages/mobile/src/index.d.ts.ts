/**
 * @bw-ui/datepicker-mobile - TypeScript Definitions
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Options
// ============================================================================

export interface MobileOptions {
  /** Enable touch support */
  enableTouch?: boolean;
  /** Enable swipe gestures */
  enableSwipe?: boolean;
  /** Swipe threshold in pixels */
  swipeThreshold?: number;
  /** Enable orientation handling */
  enableOrientation?: boolean;
  /** Breakpoint for mobile detection (pixels) */
  mobileBreakpoint?: number;
  /** Force mobile mode regardless of screen size */
  forceMobile?: boolean;
}

// ============================================================================
// Mobile Instance
// ============================================================================

export interface MobileInstance {
  /** Touch handler */
  touchHandler: TouchHandler | null;
  /** Gesture recognizer */
  gestureRecognizer: GestureRecognizer | null;
  /** Orientation handler */
  orientationHandler: OrientationHandler | null;
  /** Mobile detector */
  mobileDetector: MobileDetector | null;
  /** Check if mobile mode is active */
  isMobile(): boolean;
  /** Check if touch device */
  isTouch(): boolean;
  /** Get current orientation */
  getOrientation(): 'portrait' | 'landscape';
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Touch Handler
// ============================================================================

export declare class TouchHandler {
  constructor(options?: {
    element?: HTMLElement;
    onTap?: (event: TouchEvent) => void;
    onDoubleTap?: (event: TouchEvent) => void;
    onLongPress?: (event: TouchEvent) => void;
    longPressDelay?: number;
  });

  /** Enable touch handling */
  enable(): void;
  /** Disable touch handling */
  disable(): void;
  /** Check if enabled */
  isEnabled(): boolean;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Gesture Recognizer
// ============================================================================

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export declare class GestureRecognizer {
  constructor(options?: {
    element?: HTMLElement;
    swipeThreshold?: number;
    onSwipe?: (event: SwipeEvent) => void;
    onSwipeLeft?: (event: SwipeEvent) => void;
    onSwipeRight?: (event: SwipeEvent) => void;
    onSwipeUp?: (event: SwipeEvent) => void;
    onSwipeDown?: (event: SwipeEvent) => void;
    onPinch?: (scale: number) => void;
  });

  /** Enable gesture recognition */
  enable(): void;
  /** Disable gesture recognition */
  disable(): void;
  /** Check if enabled */
  isEnabled(): boolean;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Orientation Handler
// ============================================================================

export declare class OrientationHandler {
  constructor(options?: {
    onChange?: (orientation: 'portrait' | 'landscape') => void;
  });

  /** Get current orientation */
  getOrientation(): 'portrait' | 'landscape';
  /** Check if portrait */
  isPortrait(): boolean;
  /** Check if landscape */
  isLandscape(): boolean;
  /** Listen to orientation changes */
  onChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Mobile Detector
// ============================================================================

export declare class MobileDetector {
  constructor(options?: {
    breakpoint?: number;
  });

  /** Check if mobile viewport */
  isMobile(): boolean;
  /** Check if tablet viewport */
  isTablet(): boolean;
  /** Check if desktop viewport */
  isDesktop(): boolean;
  /** Check if touch device */
  isTouch(): boolean;
  /** Get device type */
  getDeviceType(): 'mobile' | 'tablet' | 'desktop';
  /** Listen to viewport changes */
  onChange(callback: (isMobile: boolean) => void): () => void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const MobilePlugin: Plugin<MobileInstance> & {
  name: 'mobile';
  init(api: unknown, options?: MobileOptions): MobileInstance;
  destroy(instance: MobileInstance): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default MobilePlugin;
