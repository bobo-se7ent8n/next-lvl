import { Link, Outlet } from 'react-router-dom';
import { Label } from '../components/primitives/Text';
import { iconStroke } from '../tokens';
import { ROUTES } from './routes';
import styles from './SessionDetailLayout.module.css';

/** the session detail shell. No nav bar, no page header — a back
 *  button, and then the stage. */
export function SessionDetailLayout() {
  return (
    <div className={styles.shell}>
      <Link to={ROUTES.sessions} className={styles.back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke.base} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        <Label tone="inherit">All sessions</Label>
      </Link>
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
}
