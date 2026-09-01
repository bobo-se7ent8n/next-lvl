import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import styles from './AppWindow.module.css';

export interface AppWindowProps {
  /** what the title bar reads — usually the current screen's path */
  title: string;
  /** the switch row rendered into the title bar's right side */
  tabs?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * A macOS window frame.
 *
 * Traffic lights, a title bar, and a body that holds one screen.
 * The three dots are the palette's own hues rather than the system
 * red/amber/green — this is the AERA product in a window, not a
 * screenshot of somebody's desktop, and three imported colours
 * would be the only three on the page that came from outside the
 * palette.
 */
export function AppWindow({ title, tabs, children, className }: AppWindowProps) {
  return (
    <div className={cx(styles.window, className)}>
      <div className={styles.bar}>
        <span className={styles.lights} aria-hidden="true">
          <span className={cx(styles.light, styles.close)} />
          <span className={cx(styles.light, styles.min)} />
          <span className={cx(styles.light, styles.zoom)} />
        </span>

        <span className={styles.title}>
          <Label tone="secondary">{title}</Label>
        </span>

        {tabs ? <div className={styles.tabs}>{tabs}</div> : <span aria-hidden="true" />}
      </div>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
