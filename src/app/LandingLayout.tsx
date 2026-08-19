import { Outlet } from 'react-router-dom';
import styles from './LandingLayout.module.css';

/** the public shell. Deliberately not the app shell: no nav, no
 *  background layers, no settings panel — just paper and the page. */
export function LandingLayout() {
  return (
    <div className={styles.page}>
      <Outlet />
    </div>
  );
}
