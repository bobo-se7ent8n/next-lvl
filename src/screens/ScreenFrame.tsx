import type { ReactNode } from 'react';
import { NavBar } from '../components/chrome/NavBar';
import { BackgroundLayers } from '../features/background/BackgroundLayers';
import { BACKGROUND_DEFAULTS, type BackgroundSettings } from '../features/background/settings';
import appStyles from '../app/App.module.css';

const NAV = [
  { value: 'home', label: 'Home' },
  { value: 'sessions', label: 'Sessions' },
  { value: 'insights', label: 'Insights' },
  { value: 'scoreboard', label: 'Scoreboard' },
];

export interface ScreenFrameProps {
  /** which nav item reads as current */
  active: string;
  /** omit for a static frame — stories use it that way */
  onNavigate?: (next: string) => void;
  /** the background layers, when the host is driving them */
  background?: BackgroundSettings;
  children: ReactNode;
}

/** the page shell — paper, nav, content column. Used by the app and by
 *  every screen story, so a screen is documented exactly as it ships. */
export function ScreenFrame({ active, onNavigate, background, children }: ScreenFrameProps) {
  return (
    <>
      <BackgroundLayers settings={background ?? BACKGROUND_DEFAULTS} />
      <NavBar items={NAV} value={active} onChange={(next) => onNavigate?.(next)} />
      <main className={appStyles.main}>{children}</main>
    </>
  );
}
