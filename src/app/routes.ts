/* ============================================================
   ROUTES — the one place a path string is written.

   `/` is the public landing wireframe and `/storybook` is the
   public component browser; neither sees the app shell or its nav
   bar. Everything the prototype does lives under `/app/*`.

   A session detail is a real route rather than a piece of state
   inside the sessions list, so browser-back and the back button
   are the same gesture and neither of them surprises anybody.
   ============================================================ */

export const ROUTES = {
  landing: '/',
  storybook: '/storybook',
  app: '/app',
  home: '/app/home',
  sessions: '/app/sessions',
  scoreboard: '/app/scoreboard',
  insights: '/app/insights',
} as const;

/** the detail route for one session */
export function sessionPath(id: string): string {
  return `${ROUTES.sessions}/${id}`;
}

/** the nav segment for each screen — matches the NavBar item values */
export type ScreenName = 'home' | 'sessions' | 'insights' | 'scoreboard';

export const SCREEN_PATH: Record<ScreenName, string> = {
  home: ROUTES.home,
  sessions: ROUTES.sessions,
  insights: ROUTES.insights,
  scoreboard: ROUTES.scoreboard,
};

export const DEFAULT_SCREEN: ScreenName = 'home';

/** which screen a pathname is on — `/app/sessions/s14` → `sessions` */
export function screenFromPath(pathname: string): ScreenName {
  const segment = pathname.split('/').filter(Boolean)[1];
  return segment && segment in SCREEN_PATH ? (segment as ScreenName) : DEFAULT_SCREEN;
}
