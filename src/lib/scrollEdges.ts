import { useCallback } from 'react';

/* ============================================================
   SOFT EDGES ON A SCROLL PANE

   Three screens hold a pane that scrolls inside itself while the
   header and the column beside it stay put — the library on
   Insights, the log on Sessions, the vitals on Home. A scroll box
   clips, and a hard clip through the middle of a card reads as a
   rendering fault: the card is not leaving the screen, it is being
   cut in half by an edge that has nothing drawn on it.

   The fix is a mask, and the mask has to know which edges are live.
   A fade painted permanently on both edges is the same fault turned
   inside out — at the top of the list the first card's own top edge
   dissolves into the paper for no reason.

   So this publishes the answer as one attribute on the element:

     data-edge="none"    nothing to scroll, no mask at all
     data-edge="top"     scrolled down; content continues above
     data-edge="bottom"  content continues below
     data-edge="both"    somewhere in the middle of the list

   The stylesheet on each screen picks the mask off that. It is an
   attribute rather than a class so a CSS module cannot get between
   the hook and the rule that reads it.

   Watched with a ResizeObserver as well as a scroll listener,
   because the list changes height without ever being scrolled: the
   layout scale re-steps on a window resize, and the cards themselves
   grow as their text rewraps.

   A CALLBACK REF, NOT AN OBJECT ONE, and the reason is Home. The
   pane it returns is rendered by only one of that screen's two
   views, so on a `useRef` plus `useEffect` the effect would run once
   at mount against a ref holding null and never again — switch to
   Focus & vitals and the pane arrives with no listener on it and no
   mask ever drawn. A callback ref fires when the node itself
   appears and disappears, whenever that is. The cleanup is returned
   straight from it, which React 19 calls on detach.
   ============================================================ */
export function useScrollEdges<T extends HTMLElement>() {
  return useCallback((el: T | null) => {
    if (!el) return;

    const update = () => {
      /* A PANE THAT IS NOT A SCROLL BOX IS NOT MASKED, WHATEVER ITS
         CONTENT DOES. Every one of these three panes hands its
         overflow back to the page at a breakpoint — stacked, the
         column is a column of content again and the page scrolls
         past it. `scrollHeight` still reports the content, so
         without this the fade would be painted over the foot of a
         list that is entirely on screen and scrolls nowhere. */
      if (getComputedStyle(el).overflowY === 'visible') {
        el.dataset.edge = 'none';
        return;
      }
      /* 1px of tolerance at each end: sub-pixel layout and fractional
         scroll offsets should not leave a fade hanging over an edge
         that has nothing beyond it */
      const above = el.scrollTop > 1;
      const below = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      el.dataset.edge = above && below ? 'both' : above ? 'top' : below ? 'bottom' : 'none';
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    for (const kid of Array.from(el.children)) ro.observe(kid);

    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);
}
