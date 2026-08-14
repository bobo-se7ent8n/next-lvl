import { useEffect, useState } from 'react';
import { BackgroundPanel } from '../features/background/BackgroundPanel';
import { BACKGROUND_DEFAULTS, type BackgroundSettings } from '../features/background/settings';
import { ScreenFrame } from '../screens/ScreenFrame';
import { Home } from '../screens/Home';
import { Sessions } from '../screens/Sessions';
import { Insights } from '../screens/Insights';
import { Scoreboard } from '../screens/Scoreboard';

export type ScreenName = 'home' | 'sessions' | 'insights' | 'scoreboard';

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
      <ScreenFrame
        active={screen}
        background={background}
        onNavigate={(next) => setScreen(next as ScreenName)}
      >
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
      </ScreenFrame>

      <BackgroundPanel settings={background} onChange={setBackground} />
    </>
  );
}
