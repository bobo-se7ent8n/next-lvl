import { NavLink } from 'react-router-dom';
import { cx } from '../../lib/css';
import { Display, Label } from '../../components/primitives/Text';
import { ROUTES } from '../../app/routes';
import { CATALOG, GROUPS } from './catalog';
import styles from './BrowserSidebar.module.css';
import { iconStroke } from '../../tokens';

const Chevron = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke.bold} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/** the fixed left list — product, route, then the two groups */
export function BrowserSidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Browser">
      <div className={styles.brand}>
        <Display size="md" as="p">
          aera
        </Display>
        <Label tone="tertiary">{ROUTES.storybook}</Label>
      </div>

      <div className={styles.groups}>
        {GROUPS.map((group) => (
          <div key={group} className={styles.group}>
            <Label tone="tertiary" className={styles.groupName}>
              {group}
            </Label>
            {CATALOG.filter((entry) => entry.group === group).map((entry) => (
              <NavLink
                key={entry.slug}
                to={`${ROUTES.storybook}/${entry.slug}`}
                className={({ isActive }) => cx(styles.item, isActive && styles.itemOn)}
              >
                <Label tone="inherit">{entry.name}</Label>
                <Chevron />
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <NavLink to={ROUTES.home} className={styles.back}>
        <Label tone="inherit">← Open the prototype</Label>
      </NavLink>
    </nav>
  );
}
