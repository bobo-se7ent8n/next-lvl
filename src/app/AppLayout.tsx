import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BackgroundPanel } from '../features/background/BackgroundPanel';
import { BACKGROUND_DEFAULTS, type BackgroundSettings } from '../features/background/settings';
import { ScreenFrame } from '../screens/ScreenFrame';
import { SCREEN_PATH, screenFromPath, type ScreenName } from './routes';
import styles from './App.module.css';

/** the app shell — paper, nav, content column, background controls.
 *  Everything under `/app/*` renders inside it; the landing page does not. */
export function AppLayout() {
  const [background, setBackground] = useState<BackgroundSettings>(BACKGROUND_DEFAULTS);
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
            appearing already in place */}
        <div key={location.pathname} className={styles.settle}>
          <Outlet />
        </div>
      </ScreenFrame>

      <BackgroundPanel settings={background} onChange={setBackground} />
    </>
  );
}
