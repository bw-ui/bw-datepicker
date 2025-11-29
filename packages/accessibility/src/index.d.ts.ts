/**
 * @bw-ui/datepicker-accessibility - TypeScript Definitions
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Options
// ============================================================================

export interface AccessibilityOptions {
  /** Enable keyboard navigation */
  enableKeyboardNav?: boolean;
  /** Enable focus trap */
  enableFocusTrap?: boolean;
  /** Enable screen reader announcements */
  enableAnnouncer?: boolean;
  /** Enable ARIA attributes */
  enableAria?: boolean;
  /** Enable high contrast mode support */
  enableHighContrast?: boolean;
  /** Custom ARIA label for picker */
  ariaLabel?: string;
  /** Custom date format for announcements */
  announceDateFormat?: string;
}

// ============================================================================
// Accessibility Instance
// ============================================================================

export interface AccessibilityInstance {
  /** Keyboard navigation handler */
  keyboardNav: KeyboardNav | null;
  /** Focus trap handler */
  focusTrap: FocusTrap | null;
  /** Screen reader announcer */
  announcer: Announcer | null;
  /** ARIA manager */
  ariaManager: AriaManager | null;
  /** High contrast handler */
  highContrast: HighContrast | null;
  /** Announce message to screen readers */
  announce(message: string): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

export declare class KeyboardNav {
  constructor(options?: {
    container?: HTMLElement;
    onNavigate?: (direction: string, date: Date) => void;
    onSelect?: (date: Date) => void;
    onEscape?: () => void;
  });

  /** Enable keyboard navigation */
  enable(): void;
  /** Disable keyboard navigation */
  disable(): void;
  /** Check if enabled */
  isEnabled(): boolean;
  /** Focus specific date */
  focusDate(date: Date): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Focus Trap
// ============================================================================

export declare class FocusTrap {
  constructor(options?: {
    container?: HTMLElement;
    initialFocus?: HTMLElement | string;
    returnFocus?: boolean;
  });

  /** Activate focus trap */
  activate(): void;
  /** Deactivate focus trap */
  deactivate(): void;
  /** Check if active */
  isActive(): boolean;
  /** Update focusable elements */
  update(): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Announcer
// ============================================================================

export declare class Announcer {
  constructor(options?: {
    ariaLive?: 'polite' | 'assertive' | 'off';
    clearDelay?: number;
  });

  /** Announce message to screen readers */
  announce(message: string, priority?: 'polite' | 'assertive'): void;
  /** Clear current announcement */
  clear(): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// ARIA Manager
// ============================================================================

export declare class AriaManager {
  constructor(options?: {
    container?: HTMLElement;
    labelledBy?: string;
    describedBy?: string;
  });

  /** Set ARIA attribute */
  set(element: HTMLElement, attribute: string, value: string): void;
  /** Remove ARIA attribute */
  remove(element: HTMLElement, attribute: string): void;
  /** Set role */
  setRole(element: HTMLElement, role: string): void;
  /** Set label */
  setLabel(element: HTMLElement, label: string): void;
  /** Mark as selected */
  setSelected(element: HTMLElement, selected: boolean): void;
  /** Mark as disabled */
  setDisabled(element: HTMLElement, disabled: boolean): void;
  /** Mark as current */
  setCurrent(element: HTMLElement, current: boolean | string): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// High Contrast
// ============================================================================

export declare class HighContrast {
  constructor(options?: {
    container?: HTMLElement;
    autoDetect?: boolean;
  });

  /** Check if high contrast mode is active */
  isActive(): boolean;
  /** Enable high contrast mode */
  enable(): void;
  /** Disable high contrast mode */
  disable(): void;
  /** Toggle high contrast mode */
  toggle(): void;
  /** Destroy and cleanup */
  destroy(): void;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const AccessibilityPlugin: Plugin<AccessibilityInstance> & {
  name: 'accessibility';
  init(api: unknown, options?: AccessibilityOptions): AccessibilityInstance;
  destroy(instance: AccessibilityInstance): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default AccessibilityPlugin;
