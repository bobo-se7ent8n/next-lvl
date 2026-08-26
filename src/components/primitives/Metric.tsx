import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/css';
import { useCountUpText } from '../../lib/enter';
import { useEnterKey } from '../../lib/enterContext';
import { Label } from './Text';
import styles from './Metric.module.css';

/* There are two metric tokens and therefore two metric sizes. The
   `sm` and `xl` steps this type used to carry pointed at token names
   that no longer exist, so they rendered with no size at all. */
export type MetricSize = 'md' | 'lg';

const VARIANT: Record<MetricSize, string> = {
  md: 'metric-md',
  lg: 'metric-lg',
};

const UNIT_SIZE: Record<MetricSize, string> = {
  md: 'var(--aera-text-body-sm-size)',
  lg: 'var(--aera-text-body-size)',
};

export interface MetricProps {
  /** the number itself, already formatted */
  value: ReactNode;
  unit?: ReactNode;
  size?: MetricSize;
  /** a mono caption below the number */
  caption?: string;
  /** inherit the card's ink instead of the numeral colour */
  inherit?: boolean;
  align?: 'start' | 'center';
  /** opt out of the count-up — a value that is not a reading */
  static?: boolean;
  /** how long the count-up runs. Defaults to the page-enter duration;
   *  the opened pattern panel passes its own, shorter one. */
  countOver?: string;
  /** append a true superscript degree, tight to the number. Written
   *  as a separate flag rather than as part of the value because a
   *  degree glyph in the unit slot sat on the baseline with the
   *  unit's own leading space in front of it — `+3 °` rather than
   *  `+3°`. */
  degree?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A READING COUNTS UP TO ITSELF ON ENTRY.
 *
 * Only a plain numeric string is animated: anything else is passed
 * straight through, so a value that is a node or a word never
 * flickers through nonsense. A number is accepted too and stringified
 * — the caller should not have to remember which slot wants which.
 *
 * Exported because it is not the metric's own trick: the skill rating
 * rows and the shot-mechanics readings are numerals on the same
 * screen, and a screen where some numbers count in and others are
 * simply there reads as half-finished.
 */
export function Counted({ value, over }: { value: ReactNode; over?: string }) {
  const enterKey = useEnterKey();
  const source = typeof value === 'number' ? String(value) : value;
  const text = useCountUpText(typeof source === 'string' ? source : '', enterKey, over);
  return <>{typeof source === 'string' ? text : source}</>;
}

/** big number + unit — the headline reading of any card */
export function Metric({
  value,
  unit,
  size = 'lg',
  caption,
  inherit,
  align = 'start',
  static: isStatic,
  countOver,
  degree,
  className,
  style,
}: MetricProps) {
  const key = `--aera-text-${VARIANT[size]}`;
  const row = (
    <div
      className={cx(styles.metric, align === 'center' && styles.center)}
      style={
        {
          '--v-family': `var(${key}-family)`,
          '--v-size': `var(${key}-size)`,
          '--v-leading': `var(${key}-leading)`,
          '--v-tracking': `var(${key}-tracking)`,
          '--v-weight': `var(${key}-weight)`,
          '--v-tone': inherit ? 'currentColor' : 'var(--aera-color-ink-primary)',
          '--u-size': UNIT_SIZE[size],
          '--u-tone': inherit ? 'currentColor' : 'var(--aera-color-ink-tertiary)',
        } as CSSProperties
      }
    >
      <span className={styles.value}>
        {isStatic ? value : <Counted value={value} over={countOver} />}
        {degree ? <sup className={styles.degree}>°</sup> : null}
      </span>
      {unit ? <span className={styles.unit}>{unit}</span> : null}
    </div>
  );

  if (!caption) {
    return (
      <div className={className} style={style}>
        {row}
      </div>
    );
  }

  return (
    <div className={cx(styles.block, className)} style={style}>
      {row}
      <Label tone={inherit ? 'inherit' : 'tertiary'} style={inherit ? { opacity: 0.6 } : undefined}>
        {caption}
      </Label>
    </div>
  );
}
