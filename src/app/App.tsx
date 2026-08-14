import { useEffect, useState } from 'react';
import { NavBar } from '../components/chrome/NavBar';
import { BackgroundLayers } from '../features/background/BackgroundLayers';
import { BackgroundPanel } from '../features/background/BackgroundPanel';
import { BACKGROUND_DEFAULTS, type BackgroundSettings } from '../features/background/settings';
import { Home } from '../screens/Home';
import { Sessions } from '../screens/Sessions';
import { Insights } from '../screens/Insights';
import { Scoreboard } from '../screens/Scoreboard';
import styles from './App.module.css';

export type ScreenName = 'home' | 'sessions' | 'insights' | 'scoreboard';

const NAV = [
  { value: 'home' as const, label: 'Home' },
  { value: 'sessions' as const, label: 'Sessions' },
  { value: 'insights' as const, label: 'Insights' },
  { value: 'scoreboard' as const, label: 'Scoreboard' },
];

export function App() {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [background, setBackground] = useState<BackgroundSettings>(BACKGROUND_DEFAULTS);

  /* every screen change starts at the top — the header baseline is the
     same on all four, so nothing appears to move but the content */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <>
      <BackgroundLayers settings={background} />
      <NavBar items={NAV} value={screen} onChange={setScreen} />

      <main className={styles.main}>
        {screen === 'home' ? (
          <Home
            onOpenSessions={() => setScreen('sessions')}
            onOpenInsights={() => setScreen('insights')}
            onOpenScoreboard={() => setScreen('scoreboard')}
          />
        ) : null}
        {screen === 'sessions' ? <Sessions /> : null}
        {screen === 'insights' ? <Insights /> : null}
        {screen === 'scoreboard' ? <Scoreboard /> : null}
      </main>

      <BackgroundPanel settings={background} onChange={setBackground} />
    </>
  );
}
