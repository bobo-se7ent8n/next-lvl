/* ============================================================
   SIZE — ICONS AND CONTROL FURNITURE

   THE ICON SCALE BELOW IS A RECORD OF DRIFT, not a design.

   Six sizes between 11 and 19px is not a system; it is what you
   get when eight components each pick an icon size on their own.
   They are written down here at their EXACT current values so
   that the drift is visible in the token layer instead of spread
   across eight stylesheets — collapsing them to two or three
   steps changes pixels, which the audit that produced this file
   was explicitly not allowed to do. That is the follow-up.

   `controlSpec` is the geometry of the small controls — the
   switch and the slider. It is a named spec rather than steps on
   the space scale for the same reason `cardSpec` is: the scale
   has no 3px and no 32px-by-18px, and bending it to fit a toggle
   would move every other spacing in the app.
   ============================================================ */

export const iconSize = {
  xs: '11px',
  sm: '12px',
  base: '13px',
  md: '14px',
  lg: '16px',
  xl: '19px',
} as const;

/* THE ICON STROKE, in SVG user space.
 *
 * Icons are drawn in a 24-unit box and stroked, so the weight is a
 * unitless number rather than a CSS length — the same reason
 * `dotMatrix` in graphic.ts is numbers.
 *
 * These three cover every ICON in the product. They deliberately do
 * NOT cover the diagrams: the shot arc's hoop, the court markings
 * and the trend lines carry their own weights because those are
 * part of the drawing, in the same category as their path data. */
export const iconStroke = {
  thin: 1.9,
  base: 2.2,
  bold: 2.6,
} as const;

/* ============================================================
   THE TAP TARGET FLOOR — AND IT DOES NOT SCALE.

   Everything else in this file is projected through
   `--aera-scale`, which is right for spacing and type: a smaller
   window gets a smaller layout. It is wrong for a hit area. A
   finger is the same size on a 14" laptop as on a 16", so the
   minimum a control may shrink to is an absolute, and `cssVars.ts`
   projects this group verbatim for that reason.

   Applied as a `min-width` / `min-height` floor rather than a size,
   so a control that is already comfortably larger is untouched and
   only the ones the scale would push under 32px are caught.
   ============================================================ */
export const minTarget = {
  /** the smallest either dimension of an interactive control gets */
  tap: '32px',
} as const;

export const controlSpec = {
  /** the switch, and the knob that travels inside it */
  switchWidth: '32px',
  switchHeight: '18px',
  switchKnob: '12px',
  switchInset: '3px',
  switchTravel: '14px',
  /** the slider — its rail, its thumb, and its label column */
  sliderTrack: '4px',
  sliderThumb: '14px',
  sliderLabel: '64px',
  sliderValue: '40px',
  /** the ruler — its band, the drop to its labels, and its caret */
  rulerHeight: '46px',
  rulerLabelTop: '17px',
  rulerCaret: '13px',
  /** the rating row's two fixed columns */
  ratingLabel: '132px',
  ratingValue: '36px',
  /* the history row, in the expanded pattern card: a fixed label
     column, the bar between them, and a fixed value column. The
     label column was already referenced as a token by the
     stylesheet but never declared here, so it resolved to nothing
     and the column took its natural width — 57px on one row and
     63px on the next, which is exactly the raggedness the fixed
     column exists to prevent.

     The width has headroom on purpose. Type sizes stop shrinking at
     12px while lengths keep scaling down, so at the smallest step
     the label is at its floor inside a column that is not — and a
     column sized to just fit at full scale wraps `Session 10` onto
     two lines there. */
  historyLabel: '80px',
  historyBar: '7px',
  historyValue: '52px',
} as const;

export type IconSize = keyof typeof iconSize;
export type MinTarget = keyof typeof minTarget;
export type IconStroke = keyof typeof iconStroke;
export type ControlSpecStep = keyof typeof controlSpec;
