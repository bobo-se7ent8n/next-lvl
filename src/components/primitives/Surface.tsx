import type { CSSProperties, ElementType, ReactNode } from 'react';
import type { ElevationLevel, RadiusStep, SpaceStep } from '../../tokens';
import { cx, tokenVar } from '../../lib/css';
import styles from './Surface.module.css';

export type SurfaceLevel =
  | 'background'
  | 'panel'
  | 'level1'
  | 'level2'
  | 'well'
  | 'inverse'
  | 'transparent';

const LEVEL_BG: Record<SurfaceLevel, string> = {
  background: 'var(--aera-color-surface-background)',
  panel: 'var(--aera-color-surface-panel)',
  level1: 'var(--aera-color-surface-level1)',
  level2: 'var(--aera-color-surface-level2)',
  well: 'var(--aera-color-surface-well)',
  inverse: 'var(--aera-color-surface-inverse)',
  transparent: 'transparent',
};

const LEVEL_INK: Record<SurfaceLevel, string> = {
  background: 'var(--aera-color-ink-primary)',
  panel: 'var(--aera-color-ink-primary)',
  level1: 'var(--aera-color-ink-primary)',
  level2: 'var(--aera-color-ink-secondary)',
  well: 'var(--aera-color-ink-primary)',
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
  level = 'panel',
  radius = 'panel',
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

/** the recessed frame inside a card — a cream well with an inset light */
export function Well({ ratio, radius = 'lg', padding = '8', style, ...rest }: WellProps) {
  return (
    <Surface
      {...rest}
      level="well"
      elevation="inset"
      radius={radius}
      padding={padding}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
    />
  );
}
