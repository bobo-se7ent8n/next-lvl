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

/* ============================================================
   THE APP'S OWN HEIGHT TRACK — CONTINUOUS, NOT STEPPED

   Sessions, Insights and the Scoreboard each stand in ONE window —
   no page scroll, and the three left-hand panels running from under
   the header to above the nav (see `layout.screenHeight`). The track
   above was cut for a layout that was allowed to scroll, and on a
   short window it left the Scoreboard's ratings column — ten rating
   rows and two reasons, all type, nothing that can give — up to ninety
   pixels taller than the room it had.

   WHY IT IS A LINE AND NOT MORE STEPS. A step is right at the window
   it was measured on and wrong just above the bottom edge of its band:
   a 1512 × 805 window sits in the same band as 1512 × 850 and gets the
   same multiplier with 45px less room. Window heights are continuous,
   so this track is too:

       scale = clamp(floor, (100dvh − offset) / span, 1)

   `offset` is the part of a window the scale cannot buy back — the
   type floored at 12px, which does not shrink — and `span` is how
   much window height the rest of the scale is spread over. The ratio
   of two lengths is not something `calc()` can produce, so it is taken
   as `tan(atan2(a, b))`, which is exactly a / b for a positive b and is
   a plain number. `--aera-scale` is registered as a <number>
   (global.css), so the result is resolved once at :root.

   It is still the ONE variable doing it: this only replaces
   `--aera-scale-h` under the app shell, `--aera-scale` is still the
   smaller of the width and height tracks, and the whole app — type,
   spacing, radii, the nav, the fan — is the same layout drawn smaller,
   never a different one. The landing page keeps the track above.

   Checked (see the verification in the commit): every window from
   700 to 1100 tall, at 1024, 1180, 1280, 1366, 1440, 1512, 1728 and
   1920 wide, fits all three screens with nothing clipped, and each of
   the five target windows lands at or under the largest multiplier
   measured to fit it:

       1024 × 768   0.635   (fits to 0.66)
       1180 × 820   0.700   (fits to 0.72)
       1440 × 760   0.625   (fits to 0.68 — a 14" MacBook Pro, windowed)
       1512 × 850   0.738   (fits to 0.82)
       1728 × 1000  0.925   (fits to 0.98)
   ============================================================ */
export const appHeightTrack = {
  /** the window height the line would reach zero at */
  offset: '260px',
  /** the window height, above `offset`, that buys the full scale */
  span: '800px',
  /** the least the line may give: a 700px window */
  floor: '0.55',
  /** BELOW THIS the one-window screens stop being one window. The
   *  floor is reached here, and a shorter window than this gets a page
   *  that scrolls rather than panels that overlap. Mirrored as the
   *  `max-height` media query in the three screens' stylesheets —
   *  media queries cannot read custom properties. */
  minFit: '700px',
} as const;

export type Breakpoint = keyof typeof breakpoint;
export type BreakpointHeight = keyof typeof breakpointHeight;
export type ScaleStep = keyof typeof scaleStep;
export type AppHeightTrack = keyof typeof appHeightTrack;
