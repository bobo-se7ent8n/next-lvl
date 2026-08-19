import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export type { ScreenName } from './routes';

export function App() {
  return <RouterProvider router={router} />;
}
