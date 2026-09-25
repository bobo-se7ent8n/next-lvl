import { useCallback } from 'react';

/* ============================================================
   SOFT EDGES ON A SCROLL PANE

   Three screens hold a pane that scrolls inside itself while the
   header and the column beside it stay put — the library on
   Insights, the log on Sessions, the vitals on Home. A scroll box
   clips, and a hard clip through the middle of a card reads as a
   rendering fault: the card is not leaving the screen, it is being
   cut in half by an edge that has nothing drawn on it.

   The fix is a mask painted over a gutter the pane is widened by, so
   it is always on and never touches a card at rest — see the
   `[data-edge]` rules in global.css for why it is not tied to which
   edges are live any more. What this reports is the one thing CSS
   cannot see on its own: whether the pane is a scroll box at all.

     data-edge="soft"   a scroll box: gutter and mask
     data-edge="none"   in the page flow: neither

   Every one of these panes hands its overflow back to the page at a
   breakpoint — stacked, the column is a column of content again and
   the page scrolls past it. A gutter there would only push the list
   away from its heading, and a mask would fade the foot of a list
   that is entirely on screen.

   Watched with a ResizeObserver, because the breakpoint that turns
   the scroll box off is a window resize, and the pane changes size
   when it crosses one.

   A CALLBACK REF, NOT AN OBJECT ONE, and the reason is Home. The
   pane it returns is rendered by only one of that screen's two
   views, so on a `useRef` plus `useEffect` the effect would run once
   at mount against a ref holding null and never again — switch to
   Focus & vitals and the pane arrives with nothing watching it. A
   callback ref fires when the node itself appears and disappears,
   whenever that is. The cleanup is returned straight from it, which
   React 19 calls on detach.
   ============================================================ */
export function useScrollEdges<T extends HTMLElement>() {
  return useCallback((el: T | null) => {
    if (!el) return;

    const update = () => {
      const edge = getComputedStyle(el).overflowY === 'visible' ? 'none' : 'soft';
      /* the gutter changes the pane's size, which re-fires the
         observer — an unchanged answer writes nothing */
      if (el.dataset.edge !== edge) el.dataset.edge = edge;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);
}
