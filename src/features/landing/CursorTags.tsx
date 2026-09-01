import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';
import { inkOn } from '../../lib/color';
import { prefersReducedMotion } from '../../lib/enter';
import { Label } from '../../components/primitives/Text';
import { trail } from '../../tokens';
import { SCATTER_TAGS, tagFill } from './seed';
import { hasFinePointer } from './scroll';
import styles from './CursorTags.module.css';

/* The words the cursor gathers are the first few off the scattered
   field — the same vocabulary, in the same seeded order, so the
   cluster reads as the visitor picking tags up off the page rather
   than as a second unrelated set of words appearing. */
const TRAIL = SCATTER_TAGS.slice(0, trail.count);

export interface CursorTagsProps {
  /** the region the cluster is alive inside — the hero white state */
  hostRef: RefObject<HTMLElement | null>;
}

/**
 * THE CURSOR GATHERS TAGS.
 *
 * A short stack of word tags trails the pointer, each one chasing
 * the one in front of it rather than the pointer itself, so the
 * cluster concertinas open when the cursor moves fast and settles
 * into a neat pile when it stops.
 *
 * NOTHING HERE GOES THROUGH REACT. The pointer position is written
 * to a ref and read by one self-cancelling rAF loop, which writes
 * transforms straight onto the nodes. A `setState` per pointermove
 * would re-render seven elements sixty times a second to move them
 * a few pixels, and — worse — would land the raw pointer delta on
 * the transform, which stutters.
 *
 * Off entirely on touch and under reduced motion: there is no
 * pointer to gather with, and a trailing cluster is exactly the
 * kind of decorative motion reduced motion is asking us not to run.
 */
export function CursorTags({ hostRef }: CursorTagsProps) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const root = layer.current;
    if (!host || !root) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-trail]'));
    if (!nodes.length) return;

    /* where the pointer is, and where each tag currently is. Both are
       plain arrays rather than state: they change every frame. */
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const at = nodes.map(() => ({ x: pointer.x, y: pointer.y }));
    let live = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const tick = () => {
      raf = 0;
      /* THE CHAIN. Tag 0 eases toward the pointer; every tag after it
         eases toward the one in front. One damping factor, applied
         seven times, is what makes the stack lag rather than snap —
         `prog += delta * lag`, never `prog = target`. */
      let leadX = pointer.x;
      let leadY = pointer.y;

      for (let i = 0; i < at.length; i += 1) {
        at[i].x += (leadX - at[i].x) * trail.lag;
        at[i].y += (leadY - at[i].y) * trail.lag;
        nodes[i].style.transform =
          `translate3d(${at[i].x.toFixed(2)}px, ${at[i].y.toFixed(2)}px, 0)` +
          ` translate(-50%, -50%) scale(${(1 - i * 0.045).toFixed(3)})` +
          ` rotate(${(TRAIL[i].rotate * trail.rotate * 0.25).toFixed(2)}deg)`;
        leadX = at[i].x;
        leadY = at[i].y;
      }

      if (live) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (live) return;
      live = true;
      root.dataset.on = 'true';
      window.addEventListener('pointermove', onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      live = false;
      delete root.dataset.on;
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    /* the cluster only exists while the hero is on screen — it is the
       white state's behaviour, not the page's */
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.2 },
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [hostRef]);

  return (
    <div ref={layer} className={styles.layer} aria-hidden="true">
      {TRAIL.map((tag, i) => (
        <span
          key={tag.word}
          data-trail=""
          className={styles.tag}
          style={
            {
              '--fill': tagFill(tag.fill),
              '--ink': inkOn(tagFill(tag.fill)),
              '--blur': `calc(var(--aera-landing-trail-blur) * ${(i / TRAIL.length).toFixed(3)})`,
              '--fade': (1 - i / (TRAIL.length + 2)).toFixed(3),
              zIndex: TRAIL.length - i,
            } as CSSProperties
          }
        >
          <Label tone="inherit">{tag.word}</Label>
        </span>
      ))}
    </div>
  );
}
