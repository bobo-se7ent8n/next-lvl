/* ============================================================
   Z-INDEX — THE STACK, WRITTEN DOWN ONCE.

   Every layer in the product used to be a bare number typed into
   whichever stylesheet needed to sit on top of something: 940 in
   the background panel, 950 in the nav, 970 on the opened pattern,
   980 on a tooltip. Nothing anywhere said what the order WAS, so
   the only way to add a layer was to read four files and pick a
   number bigger than all of them.

   The values are unchanged — this is the existing stack, named.
   The gaps between the steps are deliberate: they leave room to
   slot a layer in without renumbering the ones above it.

   Reading upward:

     content   the app's own column, above the page background
     menu      a dropdown belonging to a control inside a card
     fan       the pattern hand's own floor
     fanLift   a hovered card, above every card in the hand
     wireframe the landing page's annotation overlay
     panel     the background settings panel
     nav       the bottom nav capsule, and the landing's pill
     flight    an opened pattern, above the nav — a detail view
               has no nav links in it
     tooltip   above everything, because it explains everything
   ============================================================ */

export const zIndex = {
  content: 10,
  menu: 20,
  fan: 600,
  fanLift: 700,
  wireframe: 900,
  panel: 940,
  nav: 950,
  flight: 970,
  tooltip: 980,
} as const;

export type ZIndexLayer = keyof typeof zIndex;
