import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import styles from './Charts.module.css';

export interface DotMatrixProps {
  /** how many dots are filled */
  value: number;
  /** the full grid */
  total: number;
  columns?: number;
  color: string;
  /** the colour of an unfilled dot */
  emptyColor?: string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** a count, drawn as countable units — the quietest viz in the set */
export function DotMatrix({
  value,
  total,
  columns = 12,
  color,
  emptyColor = 'currentColor',
  ariaLabel,
  className,
  style,
}: DotMatrixProps) {
  return (
    <div
      className={cx(styles.dots, className)}
      style={{ '--cols': columns, ...style } as CSSProperties}
      role="img"
      aria-label={ariaLabel ?? `${value} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={
            {
              '--dot-color': i < value ? color : emptyColor,
              opacity: i < value ? 1 : 0.22,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
