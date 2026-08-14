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
  elevation?: ElevationLevel;
  padding?: SpaceStep;
  /** clip the contents to the radius */
  clip?: boolean;
  fill?: boolean;
  /** renders as a button and lifts on hover */
  interactive?: boolean;
  /** show the figma-style selection ring on hover */
  outlined?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** the card — a surface with a face colour, a radius and a shadow that
 *  always follow one another. Every card language in the app builds on it. */
export function Card({
  children,
  face,
  radius = 'panel',
  elevation = 'medium',
  padding = '10',
  clip = true,
  fill,
  interactive,
  outlined,
  disabled,
  onClick,
  ariaLabel,
  className,
  style,
}: CardProps) {
  const Tag = interactive ? 'button' : 'div';
  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={interactive && disabled ? true : undefined}
      className={cx(
        styles.card,
        clip && styles.clip,
        fill && styles.fill,
        interactive && styles.interactive,
        outlined && styles.outlined,
        disabled && styles.disabled,
        className,
      )}
      style={
        {
          '--card-bg': face ?? 'var(--aera-color-surface-panel)',
          '--card-ink': face ? inkOn(face) : 'var(--aera-color-ink-primary)',
          '--card-radius': tokenVar('radius', radius),
          '--card-shadow': tokenVar('elevation', elevation),
          '--card-pad': tokenVar('space', padding),
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
