import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/css';
import { Label } from '../primitives/Text';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** viewport coordinates of the thing being described */
  x: number;
  y: number;
  heading?: string;
  children: ReactNode;
  className?: string;
}

/** A tooltip that renders at the document root rather than inside the
 *  card it belongs to. Cards clip their contents to their radius, and
 *  a tip anchored inside one was being cut off the moment it crossed
 *  an edge — so it goes to the root and is positioned in viewport
 *  coordinates instead. */
export function Tooltip({ x, y, heading, children, className }: TooltipProps) {
  const host = typeof document === 'undefined' ? null : document.body;
  if (!host) return null;

  return createPortal(
    <div
      className={cx(styles.tip, styles.fixed, styles.on, className)}
      style={{ left: x, top: y }}
      role="tooltip"
    >
      {heading ? (
        <Label tone="inherit" className={styles.tipHead}>
          {heading}
        </Label>
      ) : null}
      {children}
    </div>,
    host,
  );
}
