import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/css';
import { dataColor, dataInk } from '../../lib/color';
import type { DataTone } from '../../tokens';
import styles from './Chip.module.css';

export interface ChipProps {
  children: ReactNode;
  /** a hue from the data palette, or the neutral grey chip */
  tone?: DataTone | 'neutral';
  className?: string;
  style?: CSSProperties;
}

/** the filled pill — carries an attribute, never a status judgement */
export function Chip({ children, tone = 'neutral', className, style }: ChipProps) {
  const filled = tone !== 'neutral';
  return (
    <span
      className={cx(styles.chip, className)}
      style={
        {
          '--chip-bg': filled ? dataColor(tone) : 'var(--aera-color-surface-level2)',
          '--chip-ink': filled ? dataInk(tone) : 'var(--aera-color-ink-secondary)',
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}

export interface TagProps {
  children: ReactNode;
  /** the outlined form — the quietest label the system has */
  quiet?: boolean;
  className?: string;
}

/** the unfilled label — meta on a card, never a status */
export function Tag({ children, quiet, className }: TagProps) {
  return <span className={cx(styles.tag, quiet && styles.tagQuiet, className)}>{children}</span>;
}
