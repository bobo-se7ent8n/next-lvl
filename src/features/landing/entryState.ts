/* ============================================================
   HAS THE ENTRY SEQUENCE ALREADY RUN?

   ONCE PER SESSION, AND THE FLAG LIVES OUTSIDE REACT.

   The dark loading state plays on the first load of the page and
   never again — not when a route inside the prototype is visited
   and the visitor comes back to `/`, not when the landing page
   remounts for any other reason. Component state is reset by
   exactly the remount this has to survive, and `sessionStorage`
   would keep it across a genuine reload, which is too long: a
   reload is a fresh arrival and should play.

   Module scope is exactly the right lifetime. It lives as long as
   the tab's JavaScript context does and dies with a real reload.

   It is here rather than in `LoadingScreen.tsx` because a module
   that exports a component may only export components — sharing a
   function out of one breaks fast refresh for the whole file.
   ============================================================ */

let played = false;

/** has the entry sequence already run in this session */
export function entryPlayed(): boolean {
  return played;
}

/** the sequence has finished; it must not run again */
export function markEntryPlayed(): void {
  played = true;
}
