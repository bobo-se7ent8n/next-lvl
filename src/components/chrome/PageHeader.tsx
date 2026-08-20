import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Display, Text } from '../primitives/Text';
import styles from './PageHeader.module.css';

/** one switchable view, when a screen has more than one */
export interface HeaderView {
  id: string;
  title: string;
  subhead?: string;
}

export interface PageHeaderProps {
  /** Oswald, per-letter inked, one shared baseline across every tab */
  title?: string;
  subhead?: string;
  /** Two or more views switched by clicking the HEADINGS THEMSELVES.
   *  There is no tab strip and no pill: the headline is the control,
   *  which is why the inactive one has to carry a real affordance —
   *  a pointer cursor and a colour that moves toward the active one
   *  under the pointer. */
  views?: HeaderView[];
  activeView?: string;
  onView?: (id: string) => void;
  /** an optional control row under the subhead, inside the same band */
  aside?: ReactNode;
  className?: string;
}

/** every screen's header. One component, one reserved band beneath it. */
export function PageHeader({
  title,
  subhead,
  views,
  activeView,
  onView,
  aside,
  className,
}: PageHeaderProps) {
  const current = views?.find((v) => v.id === activeView) ?? views?.[0];
  const line = views ? current?.subhead : subhead;

  return (
    <header className={cx(styles.header, className)}>
      {views ? (
        <div className={styles.views}>
          {views.map((view) => {
            const on = view.id === (current?.id ?? '');
            return (
              <button
                key={view.id}
                type="button"
                className={cx(styles.view, on && styles.viewOn)}
                aria-pressed={on}
                onClick={() => onView?.(view.id)}
              >
                <Display size="xl" tone="inherit">
                  {view.title}
                </Display>
              </button>
            );
          })}
        </div>
      ) : (
        <Display size="xl">{title ?? ''}</Display>
      )}

      {line ? (
        <Text variant="body" tone="secondary" className={styles.sub}>
          {line}
        </Text>
      ) : null}
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  );
}
