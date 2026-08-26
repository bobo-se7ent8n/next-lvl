/* ============================================================
   ENTERING

   Numbers count up to their value and graphs draw themselves in
   when a view is entered — every time it is entered, not only the
   first time. A tab you come back to recalculates in front of
   you, the way an instrument re-reads rather than remembering.

   Everything in here is inert under `prefers-reduced-motion`:
   the hook returns the final value on the first tick and the
   graphs render finished. Motion is the decoration, never the
   information.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { duration } from '../tokens';

/** does this visitor want motion at all */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const ms = (token: string) => Number.parseFloat(token);

/** the house curve, as a number-to-number easing — decelerating, and
 *  with no overshoot in it anywhere */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Count from zero up to `value` whenever `key` changes.
 *
 * `key` is what makes this re-run on every entry rather than only on
 * mount: pass the pathname, or the active view, and the count restarts
 * each time the visitor arrives.
 */
export function useCountUp(value: number, key: unknown = null, over: string = duration.count): number {
  /* Read once, and BRANCH ON THE RETURN rather than on state. Setting
     state inside the effect to handle the reduced-motion case meant a
     synchronous setState in an effect for every number on the page. */
  const reduced = prefersReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) return;

    const total = ms(over);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setShown(value * easeOut(t));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, key, reduced, over]);

  return reduced ? value : shown;
}

/**
 * A number counted up and then formatted back to the shape it was
 * written in — `0.42` counts through two decimals, `18` through none,
 * so a reading never briefly shows more precision than it has.
 */
export function useCountUpText(value: string, key: unknown = null, over?: string): string {
  const numeric = Number.parseFloat(value);
  const animatable = Number.isFinite(numeric);
  const decimals = animatable && value.includes('.') ? (value.split('.')[1] ?? '').length : 0;
  const counted = useCountUp(animatable ? numeric : 0, key, over);

  if (!animatable) return value;

  /* anything the number was wrapped in — a sign, a degree, a unit
     stuck to the digits — is put back exactly as it was written */
  const [, prefix = '', , suffix = ''] = value.match(/^([^\d-]*)(-?[\d.]+)(.*)$/) ?? [];
  return `${prefix}${counted.toFixed(decimals)}${suffix}`;
}

/**
 * A 0 → 1 progress ramp for a graph drawing itself in. Line charts
 * read it as a stroke-dashoffset, bars as a height, a dot field as a
 * per-index threshold.
 */
export function useEnterProgress(key: unknown = null): number {
  const reduced = prefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) return;

    const total = ms(duration.count);
    const start = performance.now();

    /* the first frame sets it to zero on its own — an explicit reset
       here would be a synchronous setState in an effect */
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setProgress(easeOut(t));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [key, reduced]);

  return reduced ? 1 : progress;
}

/**
 * How far along a staggered field one item is, given its index. Used
 * by the dot matrix, where the dots arrive in order rather than all at
 * once — `spread` is the share of the run given over to the stagger.
 */
export function staggerAt(progress: number, index: number, count: number, spread = 0.5): number {
  if (count <= 1) return progress;
  const offset = (index / (count - 1)) * spread;
  const scaled = (progress - offset) / (1 - spread);
  return Math.max(0, Math.min(1, scaled));
}
