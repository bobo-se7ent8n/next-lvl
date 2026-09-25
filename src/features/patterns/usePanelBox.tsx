import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { PanelProbe } from './ExpandedCard';
import { layoutScale } from './fanGeometry';
import { expandedRect, headlineOf, PANEL_FALLBACK, place, STACK_WIDTH, type Rect } from './flight';

/* ============================================================
   THE OPENED PANEL'S BOX, FOR EITHER FAN

   Both fans — the hand on Home and the arc on the public page — open
   into the same panel, so they need the same three things from it:
   the box it will stand in (for the card's layout), the rect to fly
   to at the moment of opening, and the probe that measures how tall
   an opened pattern is on this window. One hook, so the two can
   never disagree about the size of the card they are opening.

   THE FLIGHT READS THE PROBE ITSELF. The probe's observer keeps the
   resting box current, but an observer reports on the next rendering
   step, and a card opened in the same frame as a resize — or in a
   tab the browser is not painting — would fly to the height from
   before it. So `height()` reads the probe's box at the moment it is
   asked, which forces the layout it needs and is never stale.

   AND AN OPEN PANEL FOLLOWS ITS BOX. The height it flew to can still
   change after it lands — the faces arrive and a line of readings
   wraps, or the window is resized — and a panel left at the old rect
   clips its last history row. The fan hands the panel to `follow`
   once it is on its way to the target and takes it back when it
   closes; every new measurement in between moves it, on the flight's
   own transition.
   ============================================================ */

/** where the panel ends up, on this window, right now — centred on
 *  the anchor when the host has one (see `expandedRect`) */
export function panelRect(
  stage: Element | null,
  height: number | null,
  anchor: Element | null = null,
): Rect {
  return expandedRect(headlineOf(stage), layoutScale(), height, anchor);
}

export function usePanelBox(
  stage: RefObject<HTMLElement | null>,
  anchor?: RefObject<HTMLElement | null>,
) {
  const [box, setBox] = useState<Rect>(PANEL_FALLBACK);
  const probeHost = useRef<HTMLDivElement>(null);
  /* the resize handler, kept so a new measurement from the probe can
     re-run it without a second listener */
  const remeasure = useRef<() => void>(() => {});
  /** the open panel, from the moment it leaves for its target until
   *  it is sent home — see the note above */
  const follow = useRef<HTMLElement | null>(null);

  /** the opened card's height on this window, read off the probe now */
  const height = useCallback((): number | null => {
    const el = probeHost.current;
    return el ? Math.ceil(el.getBoundingClientRect().height) : null;
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const rect = panelRect(stage.current, height(), anchor?.current ?? null);
      setBox(rect);
      const open = follow.current;
      if (open) place(open, rect, open.style.borderRadius, 0);
    };
    remeasure.current = measure;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [stage, anchor, height]);

  const onHeight = useCallback(() => remeasure.current(), []);

  /** hand the open panel over as it leaves for its target, and null
   *  as it is sent home */
  const setFollow = useCallback((el: HTMLElement | null) => {
    follow.current = el;
  }, []);

  const stacked = box.width < STACK_WIDTH;

  return {
    box,
    stacked,
    /** read it through `panelRect` at the moment the card opens */
    height,
    /** the panel as it leaves for its target, null as it closes */
    follow: setFollow,
    /** render this once, anywhere in the fan — it portals itself */
    probe: <PanelProbe host={probeHost} width={box.width} stacked={stacked} onHeight={onHeight} />,
  };
}
