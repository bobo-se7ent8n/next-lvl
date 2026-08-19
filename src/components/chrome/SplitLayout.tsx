import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/css';
import styles from './SplitLayout.module.css';

export interface SplitLayoutProps {
  /** the sticky column */
  aside: ReactNode;
  /** the column that scrolls with the page */
  children: ReactNode;
  /** grid-template-columns for the pair */
  columns?: string;
  /** let the sticky column fill the height it is pinned to, rather
   *  than sitting short at the top of a much longer page */
  stretchAside?: boolean;
  className?: string;
}

/** sticky column beside a scrolling one */
export function SplitLayout({
  aside,
  children,
  columns = 'minmax(320px, 0.9fr) minmax(0, 1.5fr)',
  stretchAside,
  className,
}: SplitLayoutProps) {
  return (
    <div
      className={cx(styles.split, className)}
      style={{ '--split-columns': columns } as CSSProperties}
    >
      <aside className={cx(styles.aside, stretchAside && styles.asideStretch)}>{aside}</aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
