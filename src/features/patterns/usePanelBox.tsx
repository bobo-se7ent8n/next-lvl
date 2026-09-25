import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { PanelProbe } from './ExpandedCard';
import { layoutScale } from './fanGeometry';
import { expandedRect, headlineOf, PANEL_FALLBACK, STACK_WIDTH, type Rect } from './flight';

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
   ============================================================ */

/** where the panel ends up, on this window, right now */
export function panelRect(stage: Element | null, height: number | null): Rect {
  return expandedRect(headlineOf(stage), layoutScale(), height);
}

export function usePanelBox(stage: RefObject<HTMLElement | null>) {
  const [box, setBox] = useState<Rect>(PANEL_FALLBACK);
  const probeHost = useRef<HTMLDivElement>(null);
  /* the resize handler, kept so a new measurement from the probe can
     re-run it without a second listener */
  const remeasure = useRef<() => void>(() => {});

  /** the opened card's height on this window, read off the probe now */
  const height = useCallback((): number | null => {
    const el = probeHost.current;
    return el ? Math.ceil(el.getBoundingClientRect().height) : null;
  }, []);

  useLayoutEffect(() => {
    const measure = () => setBox(panelRect(stage.current, height()));
    remeasure.current = measure;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [stage, height]);

  const onHeight = useCallback(() => remeasure.current(), []);

  const stacked = box.width < STACK_WIDTH;

  return {
    box,
    stacked,
    /** read it through `panelRect` at the moment the card opens */
    height,
    /** render this once, anywhere in the fan — it portals itself */
    probe: <PanelProbe host={probeHost} width={box.width} stacked={stacked} onHeight={onHeight} />,
  };
}
