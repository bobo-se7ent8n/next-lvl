/* ============================================================
   SCROLL, DAMPED — the one loop every pinned section reads.

   THE RULE THIS FILE EXISTS TO ENFORCE: a scroll position is
   never written straight onto a transform. Reading `scrollY` in a
   scroll handler and assigning it to `style.transform` produces
   motion that is quantised to the wheel's own steps, which reads
   as stutter however smooth the easing curve on either side of it
   is. Every consumer here gets a value that is eased toward the
   scroll position by a fixed share per frame —

       prog += (target - prog) * EASE

   — so the section keeps moving for a few frames after the wheel
   stops, and a trackpad's fifty tiny deltas a second become one
   continuous travel.

   It is ONE rAF loop for the whole page rather than one per
   section: five sections each running their own would each force
   their own layout read, and they would drift out of phase with
   each other.

   Under `prefers-reduced-motion` the damping is skipped — the
   value is the scroll position exactly, so a section still tracks
   the wheel and simply does not carry any momentum.
   ============================================================ */

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/enter';

/** the share of the remaining distance covered each frame */
export const EASE = 0.22;

/** anything under this and the loop parks itself until scroll moves */
const EPSILON = 0.0002;

export type ProgressFn = (progress: number) => void;

interface Sub {
  /** what to measure — a pinned section's outer track */
  el: HTMLElement;
  /** where the eased value currently is */
  prog: number;
  /** where the scroll says it should be */
  target: number;
  fn: ProgressFn;
  /** has this subscriber been handed its first value yet */
  primed: boolean;
}

const subs = new Set<Sub>();
let frame = 0;

/**
 * How far through a pinned section the page is, 0 → 1.
 *
 * The section is a tall track with a sticky child one viewport
 * high, so the travel available is the track's height less one
 * viewport: at 0 the sticky child has just pinned, at 1 it is about
 * to let go.
 */
function measure(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  if (travel <= 0) return rect.top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -rect.top / travel));
}

function tick(): void {
  frame = 0;
  const reduced = prefersReducedMotion();
  let moving = false;

  for (const sub of subs) {
    sub.target = measure(sub.el);
    const delta = sub.target - sub.prog;

    if (reduced || !sub.primed || Math.abs(delta) < EPSILON) {
      sub.prog = sub.target;
    } else {
      sub.prog += delta * EASE;
      moving = true;
    }

    sub.primed = true;
    sub.fn(sub.prog);
  }

  /* ONE CHAIN, NOT TWO. A scroll event dispatched between this
     callback starting and finishing calls `wake`, which sees
     `frame` at 0 and schedules a frame of its own — and the line
     below would then overwrite the handle and leave that one
     running as a second, untracked tick chain. Scheduling only when
     nothing is already scheduled keeps it to one loop. */
  if ((moving || pending) && !frame) {
    pending = false;
    frame = requestAnimationFrame(tick);
  }
}

/* set by a scroll or resize event — one more frame is owed even if
   nothing was moving, because the targets have just changed */
let pending = false;

function wake(): void {
  pending = true;
  if (!frame) frame = requestAnimationFrame(tick);
}

function listen(): void {
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', wake);
}

function unlisten(): void {
  window.removeEventListener('scroll', wake);
  window.removeEventListener('resize', wake);
}

/**
 * Subscribe an element's pinned progress to a callback.
 *
 * The callback runs on animation frames only, and is handed an
 * eased 0 → 1. Consumers write CSS custom properties or transforms
 * from it directly; a `setState` belongs there only when a
 * DISCRETE stage changes, never once per frame.
 */
export function useSectionProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: ProgressFn,
): void {
  /* the callback is read through a ref so a consumer may close over
     fresh values without resubscribing — and, more to the point, so
     an inline arrow in a component body does not tear the loop down
     and rebuild it on every render */
  const cb = useRef(onProgress);
  /* the callback is refreshed from an effect rather than assigned
     during render — a ref written in the render body is a write to
     something React has not committed yet, and in a concurrent
     render it can be the wrong one */
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sub: Sub = {
      el,
      prog: 0,
      target: 0,
      primed: false,
      fn: (p) => cb.current(p),
    };

    const first = subs.size === 0;
    subs.add(sub);
    if (first) listen();
    wake();

    return () => {
      subs.delete(sub);
      if (subs.size === 0) {
        unlisten();
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }, [ref]);
}

/* ------------------------------------------------------------
   THE WHOLE-PAGE PROGRESS

   The nav's stroke traces total document scroll rather than any
   one section, so it gets its own tiny loop on the same damping.
   ------------------------------------------------------------ */
export function usePageProgress(onProgress: ProgressFn): void {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    let raf = 0;
    let prog = 0;
    let primed = false;
    let queued = true;

    const read = () => {
      const doc = document.documentElement;
      const travel = doc.scrollHeight - window.innerHeight;
      return travel <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / travel));
    };

    const run = () => {
      raf = 0;
      const target = read();
      const delta = target - prog;
      let moving = false;

      if (prefersReducedMotion() || !primed || Math.abs(delta) < EPSILON) {
        prog = target;
      } else {
        prog += delta * EASE;
        moving = true;
      }
      primed = true;
      cb.current(prog);

      /* one chain only — see the note on the shared loop above */
      if ((moving || queued) && !raf) {
        queued = false;
        raf = requestAnimationFrame(run);
      }
    };

    const nudge = () => {
      queued = true;
      if (!raf) raf = requestAnimationFrame(run);
    };

    window.addEventListener('scroll', nudge, { passive: true });
    window.addEventListener('resize', nudge);
    nudge();

    return () => {
      window.removeEventListener('scroll', nudge);
      window.removeEventListener('resize', nudge);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* ------------------------------------------------------------
   SMALL HELPERS, SO THE STAGE MATHS READS THE SAME EVERYWHERE
   ------------------------------------------------------------ */

/** 0 → 1 across a window of the parent progress, clamped either side */
export function span(progress: number, from: number, to: number): number {
  if (to <= from) return progress >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - from) / (to - from)));
}

/** the house curve as a number-to-number easing — decelerating, and
 *  with no overshoot in it anywhere */
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** does this visitor have a pointer that can hover at all */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
