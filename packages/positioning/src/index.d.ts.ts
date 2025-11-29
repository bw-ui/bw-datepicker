/**
 * @bw-ui/datepicker-positioning - TypeScript Definitions
 */

import { Plugin } from '@bw-ui/datepicker';

// ============================================================================
// Options
// ============================================================================

export interface PositioningOptions {
  /** Vertical placement */
  placement?: 'top' | 'bottom';
  /** Horizontal alignment */
  alignment?: 'left' | 'center' | 'right' | 'start' | 'end';
  /** Auto-flip when no space */
  autoFlip?: boolean;
  /** Offset from trigger element */
  offset?: { x: number; y: number };
  /** Constrain picker to viewport */
  constrainToViewport?: boolean;
  /** Margin from viewport edges (pixels) */
  margin?: number;
  /** z-index for picker */
  zIndex?: number;
  /** Callback after positioning */
  onPosition?: (position: PositionResult) => void;
}

// ============================================================================
// Position Result
// ============================================================================

export interface PositionResult {
  /** Top position in pixels */
  top: number;
  /** Left position in pixels */
  left: number;
  /** Final placement after flip */
  placement: 'top' | 'bottom';
  /** Final alignment */
  alignment: 'left' | 'center' | 'right' | 'start' | 'end';
}

// ============================================================================
// Positioner Class
// ============================================================================

export declare class Positioner {
  constructor(config?: PositioningOptions);

  /** Current configuration */
  config: Required<PositioningOptions>;
  /** Trigger element reference */
  triggerElement: HTMLElement | null;
  /** Picker element reference */
  pickerElement: HTMLElement | null;
  /** Whether picker has been positioned */
  isPositioned: boolean;
  /** Current position result */
  currentPosition: PositionResult | null;

  /**
   * Position the picker relative to trigger
   * @param pickerEl - Picker element
   * @param inputEl - Input/trigger element
   * @returns Position result or null
   */
  position(pickerEl?: HTMLElement, inputEl?: HTMLElement): PositionResult | null;

  /** Cleanup and reset */
  destroy(): void;
}

// ============================================================================
// Plugin
// ============================================================================

export declare const PositioningPlugin: Plugin<Positioner> & {
  name: 'positioning';
  init(api: unknown, options?: PositioningOptions): Positioner | null;
  destroy(instance: Positioner): void;
};

// ============================================================================
// Default Export
// ============================================================================

export default PositioningPlugin;
