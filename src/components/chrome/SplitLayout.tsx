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
  className?: string;
}

/** sticky column beside a scrolling one — Sessions and Insights share it */
export function SplitLayout({
  aside,
  children,
  columns = 'minmax(320px, 0.9fr) minmax(0, 1.5fr)',
  className,
}: SplitLayoutProps) {
  return (
    <div
      className={cx(styles.split, className)}
      style={{ '--split-columns': columns } as CSSProperties}
    >
      <aside className={styles.aside}>{aside}</aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
