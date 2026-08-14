import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx, tokenVar } from '../../lib/css';
import type { SpaceStep } from '../../tokens';
import styles from './Layout.module.css';

type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between';

const JUSTIFY: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

const ALIGN: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
};

export interface StackProps {
  children?: ReactNode;
  /** step from the space scale */
  gap?: SpaceStep;
  direction?: 'row' | 'column';
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  fill?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/** the flex primitive — every row and column in the product */
export function Stack({
  children,
  gap = '0',
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  wrap,
  fill,
  as,
  className,
  style,
}: StackProps) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={cx(styles.stack, fill && styles.fill, className)}
      style={
        {
          '--gap': tokenVar('space', gap),
          '--direction': direction,
          '--align': ALIGN[align],
          '--justify': JUSTIFY[justify],
          '--wrap': wrap ? 'wrap' : 'nowrap',
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

export interface GridProps {
  children?: ReactNode;
  gap?: SpaceStep;
  /** any grid-template-columns value, or a plain column count */
  columns?: string | number;
  align?: Align;
  fill?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/** the grid primitive */
export function Grid({
  children,
  gap = '0',
  columns = 1,
  align = 'stretch',
  fill,
  as,
  className,
  style,
}: GridProps) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={cx(styles.grid, fill && styles.fill, className)}
      style={
        {
          '--gap': tokenVar('space', gap),
          '--columns':
            typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns,
          '--align': ALIGN[align],
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
