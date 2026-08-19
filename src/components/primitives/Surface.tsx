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

export interface WellProps extends Omit<SurfaceProps, 'level' | 'elevation'> {
  /** the aspect the well holds, e.g. '5 / 3' */
  ratio?: string;
}

/** The recessed frame inside a card. Its padding is one step for the
 *  whole product and its content is bottom-aligned, so a chart sits on
 *  the floor of the well instead of floating at the top of it. */
export function Well({ ratio, radius = 'lg', padding = '6', style, ...rest }: WellProps) {
  return (
    <Surface
      {...rest}
      level="level1"
      elevation="none"
      radius={radius}
      padding={padding}
      className={cx(styles.well, rest.className)}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
    />
  );
}