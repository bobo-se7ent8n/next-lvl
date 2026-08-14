/* ============================================================
   MOTION

   Durations and easings. Motion in this product is used to show
   that something moved from A to B — never to decorate, never to
   demand attention. Nothing animates unless the user acted first.
   ============================================================ */

export const duration = {
  instant: '80ms',
  fast: '160ms',
  base: '220ms',
  slow: '340ms',
  /** the fan card opening into the expanded state */
  expand: '440ms',
  /** a spring settling back */
  settle: '640ms',
} as const;

export const easing = {
  /** the house curve — everything decelerates into place */
  out: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  /** a soft overshoot for returning objects */
  spring: 'cubic-bezier(0.34, 1.44, 0.46, 1)',
  linear: 'linear',
} as const;

export const transition = {
  color: `color ${duration.fast} ${easing.out}, background-color ${duration.fast} ${easing.out}`,
  transform: `transform ${duration.base} ${easing.out}`,
  shadow: `box-shadow ${duration.base} ${easing.out}`,
  opacity: `opacity ${duration.base} ${easing.out}`,
} as const;

export type DurationStep = keyof typeof duration;
export type EasingName = keyof typeof easing;
