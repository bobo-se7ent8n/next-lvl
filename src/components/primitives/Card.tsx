import type { CSSProperties, ReactNode } from 'react';
import { cx, tokenVar } from '../../lib/css';
import { inkOn } from '../../lib/color';
import type { ElevationLevel, RadiusStep, SpaceStep } from '../../tokens';
import styles from './Card.module.css';

export interface CardProps {
  children?: ReactNode;
  /** a face colour from the data palette; defaults to the panel surface */
  face?: string;
  radius?: RadiusStep;
  /** Only set this on a card that genuinely floats — the opened
   *  pattern above its dim. A card resting on the page carries the
   *  2px stroke instead, and that is the default. */
  elevation?: ElevationLevel;
  /** overrides the standard 20px card padding; leave unset normally */
  padding?: SpaceStep;
  fill?: boolean;
  /** renders as a button and lifts on hover */
  interactive?: boolean;
  /** show the figma-style selection ring on hover */
  outlined?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/** the card — a surface with a face colour, a radius and a shadow that
 *  always follow one another. Every card language in the app builds on it. */
export function Card({
  children,
  face,
  radius = 'card',
  elevation,
  padding,
  fill,
  interactive,
  outlined,
  disabled,
  onClick,
  ariaLabel,
  id,
  className,
  style,
}: CardProps) {
  const Tag = interactive ? 'button' : 'div';
  return (
    <Tag
      id={id}
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={interactive && disabled ? true : undefined}
      className={cx(
        styles.card,
        fill && styles.fill,
        /* TWO TREATMENTS, AND THEY ARE MUTUALLY EXCLUSIVE.
           A clickable card floats: it has a shadow and no stroke,
           because it is an object you can pick up. A non-clickable
           one is flat: it has the 2px stroke and no shadow, because
           it is a region of the page. Deciding this here — from the
           one prop that already says which it is — is what stops the
           two treatments getting mixed on individual cards. */
        interactive ? styles.interactive : styles.stroked,
        outlined && styles.outlined,
        disabled && styles.disabled,
        className,
      )}
      style={
        {
          '--card-bg': face ?? 'var(--aera-color-surface-background)',
          '--card-ink': face ? inkOn(face) : 'var(--aera-color-ink-primary)',
          '--card-radius': tokenVar('radius', radius),
          '--card-shadow': elevation
            ? tokenVar('elevation', elevation)
            : interactive
              ? tokenVar('elevation', 'low')
              : undefined,
          '--card-pad': padding ? tokenVar('space', padding) : undefined,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
