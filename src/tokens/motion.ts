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
  /** NOT ZERO, AND NOT A ROUNDING ERROR. The duration a motion is
   *  collapsed to under `prefers-reduced-motion`. It has to be a
   *  real non-zero time so that transitionend/animationend still
   *  fire and nothing that waits on them hangs — which is why the
   *  reduced-motion idiom is 0.001ms everywhere rather than 0. */
  none: '0.001ms',
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
  /** THE STAGGER STEP — one item's head start over the one before
   *  it in a field, a tile row or a card grid entering together. It
   *  is a delay rather than a duration: every staggered item still
   *  runs for `base`, it just starts this much later than its
   *  neighbour. One number, so every staggered entrance in the
   *  product arrives at the same cadence. */
  stagger: '30ms',
  /** A FAN CARD ANSWERING THE POINTER.
   *
   *  Numerically the same as `page`, and deliberately its own token:
   *  one is a tab giving way to the next and the other is a card
   *  lifting under the cursor, and the day one of them is retuned
   *  the other must not move with it. */
  fanCard: '260ms',
  /** the opened panel's contents arriving, once the panel itself has
   *  somewhere to be */
  reveal: '200ms',
  /** how long they wait first, so the box is already travelling
   *  before anything inside it appears */
  revealDelay: '100ms',
  /** how far into the flight the opened card re-reads itself — the
   *  numbers count up, the bars grow, the line draws */
  recalc: '140ms',
  /** a history row's value counting up inside the opened panel */
  countRow: '380ms',
  /** the first history row's head start after the recalc fires */
  historyDelay: '60ms',
  /** and one row's head start over the row above it */
  historyStep: '45ms',
  /** THE SHORT COUNT-UP — a reading that arrives WITH its container
   *  rather than with the page. The opened pattern panel's numbers
   *  start while the box is still flying and the session rows' start
   *  as the rows rise in, so both have to be done close to when the
   *  thing carrying them lands rather than a third of a second
   *  afterwards. Shorter than the page-enter `count` for that reason
   *  and no other. */
  countQuick: '480ms',
  /** the fan card opening into the expanded state */
  expand: '440ms',
  /* ---- AND CLOSING, WHICH IS NOT THE SAME MOVE ----

     Opening is the card arriving and being read; it can take its
     time. Closing is dismissal — the answer is already had, and a
     440ms exit is 440ms of nothing. These are separate values
     rather than one shared constant precisely so the two can be
     tuned against each other. */
  /** the box travelling back into its slot — well under `expand` */
  collapse: '260ms',
  /** one group of card content clearing out. Short, and it starts at
   *  the top of the close so every group is gone before the geometry
   *  is halfway home: what rotates and shrinks is a plain block of
   *  colour, not a page of detail in motion. */
  contentClear: '70ms',
  /** the head start one group has over the one before it. Barely
   *  perceptible on purpose — this is five things leaving at once,
   *  not a choreographed exit. */
  clearStep: '6ms',
  /** a long, quiet loop — the dot fields and the shot arc */
  settle: '640ms',

  /* ---- THE ENTRY SEQUENCE ------------------------------------
     The dark state is not a spinner and must not read as one: it
     is held long enough to be read and then it opens. Three
     numbers, and they are deliberately the longest in this file —
     they are the only motion in the product that runs before the
     visitor has done anything, which is exactly why they are
     written down where the register is documented rather than
     typed into the component.
     ------------------------------------------------------------ */
  /** how long the dark state stands still before it opens */
  entryHold: '1150ms',
  /** the white card filling the window */
  entryExpand: '1250ms',
  /** the headline coming out of its blur behind the white */
  entryFocus: '900ms',
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
  /** and the curve it comes back on.
   *
   *  WEIGHT AT THE START, not only at the end. A hard decelerate —
   *  which is what `expand` is — covers 98% of the distance in the
   *  first third of the close, so the card was effectively home
   *  before its content had finished clearing and there was nothing
   *  left to watch it do. This one leans in slowly and then commits:
   *  the card is emptied while it is still leaving, which is the
   *  whole point of clearing it first.
   *
   *  Both control points sit inside the unit square, so there is no
   *  overshoot in it and nothing to bounce back from. */
  collapse: 'cubic-bezier(0.55, 0.05, 0.25, 1)',
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
