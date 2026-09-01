import { useEffect, useState, type RefObject } from 'react';

export interface Box {
  w: number;
  h: number;
}

/**
 * An element's border box, in CSS pixels, kept current.
 *
 * Two things on this page draw a stroke ON an element's own
 * outline — the nav's scroll capsule and the Ask AERA bubble — and
 * an SVG cannot be told to be the size of its parent and also
 * carry a viewBox in the parent's units. Both need the number.
 *
 * `offsetWidth`/`offsetHeight` rather than a bounding rect or the
 * observer's `contentRect`. The stroke is drawn on the BORDER box,
 * so the padding has to be in the number, which rules out
 * `contentRect`; and the bubble this measures sits inside a group
 * its section scales as it hands over, so a bounding rect would
 * report the painted size and the SVG's viewBox would stop agreeing
 * with the element it is drawn on. The offset box is the border box
 * with no transform in it, which is exactly the pair of properties
 * wanted here.
 */
export function useBoxSize(ref: RefObject<HTMLElement | null>): Box {
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      setBox((prev) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        /* compared before it is set: an observer that fired on
           sub-pixel noise would re-render the whole bar mid-scroll */
        return prev.w === w && prev.h === h ? prev : { w, h };
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [ref]);

  return box;
}
