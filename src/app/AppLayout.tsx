import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BACKGROUND_DEFAULTS, type BackgroundSettings } from '../features/background/settings';
import { ScreenFrame } from '../screens/ScreenFrame';
import { EnterContext } from '../lib/enterContext';
import { SCREEN_PATH, screenFromPath, type ScreenName } from './routes';
import styles from './App.module.css';

/** the app shell — paper, nav, content column.
 *  Everything under `/app/*` renders inside it; the landing page does not. */
export function AppLayout() {
  /* THE SETTINGS ARE READ, NOT EDITED, AND THERE IS NO LONGER A
     CONTROL FOR THEM IN THE APP.

     Display settings used to hang off a fixed button in the
     bottom-right corner, opposite the token panel's in the
     bottom-left, with the nav capsule between the two. Both were
     tuning affordances; the tuning is finished and its answers are
     the shipped defaults. The panel itself is still a real
     component and is still documented in the browser — see
     features/background/BackgroundPanel.tsx. */
  const [background] = useState<BackgroundSettings>(BACKGROUND_DEFAULTS);
  const location = useLocation();
  const navigate = useNavigate();

  const screen = screenFromPath(location.pathname);

  /* every screen change starts at the top — the header baseline is the
     same on all four, so nothing appears to move but the content */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScreenFrame
        active={screen}
        background={background}
        onNavigate={(next) => navigate(SCREEN_PATH[next as ScreenName])}
      >
        {/* keyed on the path so each tab settles in rather than
            appearing already in place, and scoped on it so every
            number and graph inside recalculates on each entry */}
        <div key={location.pathname} className={styles.settle}>
          <EnterContext.Provider value={location.pathname}>
            <Outlet />
          </EnterContext.Provider>
        </div>
      </ScreenFrame>
    </>
  );
}
