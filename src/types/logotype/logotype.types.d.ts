import type { HTMLAttributes } from 'react';

export interface LogotypeProps extends HTMLAttributes<SVGElement> {
  /**
   * Logo color, can use any Tailwind class or CSS color
   * @default "currentColor"
   */
  color?: string;

  /**
   * Logo height in pixels or any valid CSS unit
   * @default "auto"
   */
  height?: number | string;

  /**
   * Logo width in pixels or any valid CSS unit
   * @default "auto"
   */
  width?: number | string;

  /**
   * Stroke width
   * @default 2
   */
  strokeWidth?: number;

  /**
   * Additional CSS class for the SVG
   */
  className?: string;
}
