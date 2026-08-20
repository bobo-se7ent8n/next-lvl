import { createContext, useContext } from 'react';

/* ============================================================
   THE ENTER KEY

   One value, provided by whatever owns the current view, that
   changes every time that view is entered. Numbers and graphs
   anywhere below read it and re-run their entrance — which is
   what makes a tab recalculate when you come back to it rather
   than only the first time you see it.

   It is a context rather than a prop because the things that
   animate are leaves: a metric inside a stat row inside a card
   inside a grid. Threading a key through four layers of layout
   would put an animation concern in every one of them.

   The provider is used directly as `EnterContext.Provider` so
   this file exports no component and stays fast-refresh clean.
   ============================================================ */

export const EnterContext = createContext<unknown>('initial');

/** the current entry. Pass it as the `key` argument to the enter hooks. */
export function useEnterKey(): unknown {
  return useContext(EnterContext);
}
