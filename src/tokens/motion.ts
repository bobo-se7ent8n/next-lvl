/* ============================================================
   MOTION

   Durations and easings. Motion in this product shows that
   something moved from A to B — it never decorates and it never
   asks for attention. Nothing animates unless the user acted
   first.

   The register is RESISTANCE, not playfulness. A press compresses
   and releases; it does not bounce. There is deliberately no
   overshoot curve in this file — a spring would read as the
   product being pleased with itself, which is the opposite of
   pull-not-push.
   ============================================================ */

export const duration = {
  instant: '80ms',
  /** a press compressing under the finger */
  press: '110ms',
  fast: '160ms',
  base: '220ms',
  slow: '340ms',
  /** one tab giving way to the next */
  page: '260ms',
  /** a number counting up to its value on page enter */
  count: '600ms',
  /** the fan card opening into the expanded state */
  expand: '440ms',
  /** a long, quiet loop — the dot fields and the shot arc */
  settle: '640ms',
} as const;

export const easing = {
  /** the house curve — everything decelerates into place */
  out: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  /** decisive, and settled: fast off the mark, no overshoot at all */
  firm: 'cubic-bezier(0.32, 0.72, 0, 1)',
  /** the curve a card's own geometry travels on as it grows out of the
   *  fan into the expanded panel. Slightly longer in the tail than
   *  `out`, and still with no overshoot in it. */
  expand: 'cubic-bezier(0.2, 0.9, 0.25, 1)',
  linear: 'linear',
} as const;

export const transition = {
  color: `color ${duration.fast} ${easing.out}, background-color ${duration.fast} ${easing.out}`,
  transform: `transform ${duration.press} ${easing.firm}`,
  shadow: `box-shadow ${duration.base} ${easing.out}`,
  opacity: `opacity ${duration.base} ${easing.out}`,
} as const;

export type DurationStep = keyof typeof duration;
export type EasingName = keyof typeof easing;
