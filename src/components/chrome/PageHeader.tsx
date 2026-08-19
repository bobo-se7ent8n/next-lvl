import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Display, Text } from '../primitives/Text';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  /** Oswald, per-letter inked, one shared baseline across every tab */
  title: string;
  subhead?: string;
  /** an optional control row under the subhead, inside the same band */
  aside?: ReactNode;
  className?: string;
}

/** every screen's header. One component, one reserved band beneath it. */
export function PageHeader({ title, subhead, aside, className }: PageHeaderProps) {
  return (
    <header className={cx(styles.header, className)}>
      <Display size="xl">{title}</Display>
      {subhead ? (
        <Text variant="body" tone="secondary" className={styles.sub}>
          {subhead}
        </Text>
      ) : null}
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  );
}
