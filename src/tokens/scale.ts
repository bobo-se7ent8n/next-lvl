/* ============================================================
   BREAKPOINTS AND THE LAYOUT SCALE

   THE PROBLEM THIS SOLVES. Every section was built to fit one
   screen on a 16" laptop, and only there. On a 14" — and worse on
   an iPad Mini in landscape — the same layout ran past the fold by
   anywhere from 40 to 1900 pixels, because every spacing step,
   every card padding and every fixed layout constant was an
   absolute pixel value that did not know how tall the window was.

   THE FIX IS ONE NUMBER. `--aera-scale` is set on `:root` and
   nowhere else (see global.css), and every length token is
   projected through it — `22px` becomes
   `calc(22px * var(--aera-scale))`. One variable moves the whole
   system together, so a smaller screen gets the SAME layout drawn
   smaller rather than a differently-proportioned one.

   WHY MEDIA QUERIES ON :root RATHER THAN A FLUID clamp(). A fluid
   scale wants `0.82 + (100vw - 1024px) × k`, and CSS cannot do
   that: dividing a length by a length does not yield a number, so
   there is no way to get a unitless ratio out of `100vw` in plain
   `calc()`. Four steps on `:root` is the honest version of the same
   idea — and it is still ONE declaration per step, not a media
   query per component.

   TYPE IS FLOORED, NOT SCALED FREELY. See `cssVars.ts`: body text
   never goes below 12px, and the annotation sizes that already sit
   under it do not shrink at all.
   ============================================================ */

/** the widths the scale steps at, largest first */
export const breakpoint = {
  /** below this a 16" layout starts to crowd */
  desktop: '1600px',
  /** the 14" MacBook band */
  laptop: '1400px',
  /** the 13" Air, at either of the widths it reports */
  air: '1280px',
  /** tablets in landscape, and small laptops */
  tablet: '1100px',
} as const;

/**
 * THE HEIGHTS THE SCALE STEPS AT.
 *
 * THIS IS THE HALF THAT WAS MISSING. The scale keyed off width
 * alone, and every problem it was built to solve is vertical: a
 * MacBook Air 13" is 1440 CSS px wide — wider than a 14" Pro — so
 * it matched the largest step and barely scaled, while having a
 * hundred pixels LESS usable height than the 14" it was scaling
 * for. The page fit, and the content inside the panes was clipped.
 *
 * `--aera-scale` is the smaller of the two axes now, so whichever
 * dimension is actually tight is the one that drives.
 */
export const breakpointHeight = {
  desktop: '940px',
  laptop: '860px',
  air: '800px',
  tablet: '740px',
} as const;

/**
 * What the layout is multiplied by inside each band.
 *
 * `full` is the design as drawn. The three steps below it are not
 * arbitrary: each is the largest multiplier that still brings every
 * section inside the shortest viewport in its band.
 */
export const scaleStep = {
  full: 1,
  desktop: 0.94,
  laptop: 0.88,
  /* calibrated against the shortest window in each band, not the
     narrowest: 0.84 left the Scoreboard bento 60px over on a
     1440x790 Air because the height track is the one that binds
     there and the step above it was doing almost nothing */
  air: 0.8,
  tablet: 0.74,
} as const;

export type Breakpoint = keyof typeof breakpoint;
export type BreakpointHeight = keyof typeof breakpointHeight;
export type ScaleStep = keyof typeof scaleStep;
