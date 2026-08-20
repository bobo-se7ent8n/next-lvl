import type { CSSProperties, ElementType, ReactNode } from 'react';
import type { ElevationLevel, RadiusStep, SpaceStep } from '../../tokens';
import { cx, tokenVar } from '../../lib/css';
import styles from './Surface.module.css';

export type SurfaceLevel = 'background' | 'level1' | 'level2' | 'inverse' | 'transparent';

const LEVEL_BG: Record<SurfaceLevel, string> = {
  background: 'var(--aera-color-surface-background)',
  level1: 'var(--aera-color-surface-level1)',
  level2: 'var(--aera-color-surface-level2)',
  inverse: 'var(--aera-color-surface-inverse)',
  transparent: 'transparent',
};

const LEVEL_INK: Record<SurfaceLevel, string> = {
  background: 'var(--aera-color-ink-primary)',
  level1: 'var(--aera-color-ink-primary)',
  level2: 'var(--aera-color-ink-secondary)',
  inverse: 'var(--aera-color-ink-on-inverse)',
  transparent: 'inherit',
};

export interface SurfaceProps {
  children?: ReactNode;
  /** which step of the surface scale this sits on */
  level?: SurfaceLevel;
  radius?: RadiusStep;
  elevation?: ElevationLevel;
  padding?: SpaceStep;
  /** clip children to the radius */
  clip?: boolean;
  /** stretch to the height of the grid cell */
  fill?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/** the raw surface — a background, a radius and an elevation, nothing else */
export function Surface({
  children,
  level = 'background',
  radius = 'card',
  elevation = 'medium',
  padding = '0',
  clip,
  fill,
  as,
  className,
  style,
  id,
  ...rest
}: SurfaceProps) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      id={id}
      className={cx(styles.surface, clip && styles.clip, fill && styles.fill, className)}
      style={
        {
          '--surface-bg': LEVEL_BG[level],
          '--surface-ink': LEVEL_INK[level],
          '--surface-radius': tokenVar('radius', radius),
          '--surface-shadow': tokenVar('elevation', elevation),
          '--surface-pad': tokenVar('space', padding),
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface WellProps extends Omit<SurfaceProps, 'level' | 'elevation' | 'padding'> {
  /** the aspect the well holds, e.g. '5 / 3' */
  ratio?: string;
}

/** THE INNER CONTAINER — the one recessed frame in the product.
 *
 *  Every region inside a card that holds a chart, a dot field or a
 *  pattern candidate is one of these: level1 fill, the lg corner, one
 *  padding step, and the white light around all four inside edges that
 *  makes it read as pressed INTO the card rather than sitting on it.
 *  The padding and the inset light are tokens, defined once, so there
 *  is no second version of this treatment anywhere.
 *
 *  Content is bottom-aligned: top-aligning left a gap under every
 *  chart in the product. */
export function Well({ ratio, radius = 'lg', style, ...rest }: WellProps) {
  return (
    <Surface
      {...rest}
      level="level1"
      elevation="none"
      radius={radius}
      className={cx(styles.well, rest.className)}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
    />
  );
}