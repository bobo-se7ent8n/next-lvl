import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { staggerAt, useEnterProgress } from '../../lib/enter';
import { useEnterKey } from '../../lib/enterContext';
import { dataColor } from '../../lib/color';
import { buildDotField, type DotPattern } from '../../lib/dotField';
import { dotDensity, dotMatrix, type DataTone, type DotDensity } from '../../tokens';
import styles from './DotMatrix.module.css';

export type { DotPattern } from '../../lib/dotField';

export interface DotMatrixProps {
  /** which metaphor this instance is drawing */
  pattern: DotPattern;
  /** how many rows deep the field runs */
  density?: DotDensity;
  /** an explicit row count, when a field has to be taller than a
   *  density step — the collapsing interval uses it */
  rows?: number;
  /** how wide the field is, in dots */
  columns?: number;
  /** the accent from the AERA palette */
  accent?: DataTone;
  /** run the subtle brightening loop */
  animated?: boolean;
  /** scale to fill the container rather than sitting at natural size.
   *  Uniform: the dots never distort. */
  fill?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** the app's only illustration. Every card that needs a picture uses
 *  this and changes the pattern — never invents new artwork. */
export function DotMatrix({
  pattern,
  density = 'base',
  rows: rowsProp,
  columns = 30,
  accent = 'lilac',
  animated,
  fill,
  ariaLabel,
  className,
  style,
}: DotMatrixProps) {
  const rows = rowsProp ?? dotDensity[density];
  const { cells, width, height } = buildDotField({ pattern, columns, rows });
  const { size, corner } = dotMatrix;
  /* the field arrives in order rather than all at once — the stagger
     runs along the same index the cells were generated in, so a dot
     field assembles the way it reads */
  const progress = useEnterProgress(useEnterKey());


  return (
    <svg
      className={cx(styles.field, fill && styles.fieldFill, animated && styles.animated, className)}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `${pattern} dot field`}
      style={
        {
          '--field-w': `${width}px`,
          '--field-accent': dataColor(accent),
          ...style,
        } as CSSProperties
      }
    >
      {cells.map((cell, i) => (
        <rect
          key={cell.key}
          className={styles.dot}
          x={cell.x.toFixed(2)}
          y={cell.y.toFixed(2)}
          width={size}
          height={size}
          rx={corner}
          opacity={(cell.opacity * staggerAt(progress, i, cells.length)).toFixed(3)}
          style={
            {
              '--dot-o': cell.opacity.toFixed(3),
              '--dot-delay': `calc(var(--aera-duration-settle) * ${(cell.u * 5 - 5).toFixed(2)})`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
