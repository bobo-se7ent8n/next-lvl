import { lazy, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export type { ScreenName } from './routes';

/* THE DEV PANEL IS BEHIND A DYNAMIC IMPORT BEHIND A DEV FLAG.
 *
 * `import.meta.env.DEV` is replaced with a literal `false` at build
 * time, so this whole branch — the lazy call, the chunk it names and
 * Tweakpane with it — is dead code the bundler drops. Nothing about
 * the panel reaches production, which is checked by grepping the
 * built output for "tweakpane".
 *
 * It renders null, so there is nothing to lay out and nothing to
 * suspend on visually; the boundary is only here because `lazy`
 * requires one. */
const TweakPanel = import.meta.env.DEV
  ? lazy(() => import('../dev/TweakPanel').then((m) => ({ default: m.TweakPanel })))
  : null;

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      {TweakPanel ? (
        <Suspense fallback={null}>
          <TweakPanel />
        </Suspense>
      ) : null}
    </>
  );
}
