import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Counted } from './Metric';
import { Label, Text } from './Text';
import { duration } from '../../tokens';
import styles from './StatRow.module.css';

export interface StatRowProps {
  label: string;
  value: ReactNode;
  /** the compact form — value above, mono label below, used in a StatSet */
  inline?: boolean;
  /** the smaller stat number — a reading on a card, not a headline */
  compact?: boolean;
  /** inherit the surrounding ink rather than the numeral colour */
  inherit?: boolean;
  /** opt out of the count-up — a value that is not a reading */
  static?: boolean;
  className?: string;
}

/**
 * A labelled reading — the row form of a metric.
 *
 * THE NUMBER COUNTS UP, like every other reading in the product.
 * This row was the last numeral that did not: session cards, the
 * calendar's month totals and the session detail's header all run
 * through here, which is why the Sessions tab was the one screen that
 * arrived already finished while every other one recalculated in
 * front of you.
 *
 * `Counted` passes anything that is not a plain number or numeric
 * string straight through, so a value that is already a node — the
 * shot-mechanics rows, which carry their own degree sign — is
 * untouched and keeps counting through its own wrapper.
 */
export function StatRow({
  label,
  value,
  inline,
  compact,
  inherit,
  static: isStatic,
  className,
}: StatRowProps) {
  const reading = isStatic ? value : <Counted value={value} over={duration.countQuick} />;
  if (inline) {
    return (
      <span className={cx(styles.row, styles.inline, className)}>
        <Text
          as="b"
          variant={compact ? 'metricSM' : 'metricMD'}
          tone={inherit ? 'inherit' : 'primary'}
          numeric
        >
          {reading}
        </Text>
        <Label tone={inherit ? 'inherit' : 'tertiary'}>{label}</Label>
      </span>
    );
  }

  return (
    <div className={cx(styles.row, className)}>
      <Text variant="bodySM" tone="secondary" className={styles.label}>
        {label}
      </Text>
      <Text
        as="b"
        variant="metricMD"
        tone={inherit ? 'inherit' : 'primary'}
        numeric
        className={styles.value}
      >
        {reading}
      </Text>
    </div>
  );
}

export interface StatSetProps {
  stats: Array<{ label: string; value: ReactNode }>;
  inherit?: boolean;
  /** the smaller stat number — a reading on a card, not a headline */
  compact?: boolean;
  className?: string;
}

/** a run of inline stats — the stat row of a session card */
export function StatSet({ stats, inherit, compact, className }: StatSetProps) {
  return (
    <div className={cx(styles.set, className)}>
      {stats.map((s) => (
        <StatRow
          key={s.label}
          label={s.label}
          value={s.value}
          inline
          compact={compact}
          inherit={inherit}
        />
      ))}
    </div>
  );
}
