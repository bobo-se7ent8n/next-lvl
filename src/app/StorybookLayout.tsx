import { Outlet } from 'react-router-dom';
import { BrowserSidebar } from '../features/browser/BrowserSidebar';
import styles from './StorybookLayout.module.css';

/** the third layout. No app nav, no landing scaffolding — a fixed
 *  sidebar and one panel, and nothing borrowed from either. */
export function StorybookLayout() {
  return (
    <div className={styles.shell}>
      <BrowserSidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
