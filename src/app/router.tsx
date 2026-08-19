import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LandingLayout } from './LandingLayout';
import { StorybookLayout } from './StorybookLayout';
import { SessionDetailLayout } from './SessionDetailLayout';
import { Home } from '../screens/Home';
import { Landing } from '../screens/Landing';
import { StorybookBrowser } from '../screens/StorybookBrowser';
import { Sessions } from '../screens/Sessions';
import { SessionDetailScreen } from '../screens/SessionDetailScreen';
import { Insights } from '../screens/Insights';
import { Scoreboard } from '../screens/Scoreboard';
import { ROUTES } from './routes';
import { DEFAULT_SLUG } from '../features/browser/catalog';

/* Four layouts. `/` is the landing wireframe and `/storybook` is the
   component browser; neither sees the app shell or its nav bar. `/app`
   is the four-tab prototype. A session detail gets a layout of its own
   — no nav bar, no page header — and is a real route rather than a
   piece of state inside the list, so browser-back and the back button
   are the same gesture. */
export const router = createBrowserRouter([
  {
    path: ROUTES.landing,
    element: <LandingLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
  {
    path: ROUTES.storybook,
    element: <StorybookLayout />,
    children: [
      { index: true, element: <Navigate to={`${ROUTES.storybook}/${DEFAULT_SLUG}`} replace /> },
      { path: ':slug', element: <StorybookBrowser /> },
    ],
  },
  {
    path: ROUTES.app,
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.home} replace /> },
      { path: 'home', element: <Home /> },
      { path: 'sessions', element: <Sessions /> },
      { path: 'scoreboard', element: <Scoreboard /> },
      { path: 'insights', element: <Insights /> },
    ],
  },
  /* the detail is a sibling of the app shell, not a child of it: it
     has its own layout and deliberately no nav bar */
  {
    path: `${ROUTES.sessions}/:id`,
    element: <SessionDetailLayout />,
    children: [{ index: true, element: <SessionDetailScreen /> }],
  },
  /* anything else falls back to the landing page */
  { path: '*', element: <Navigate to={ROUTES.landing} replace /> },
]);
