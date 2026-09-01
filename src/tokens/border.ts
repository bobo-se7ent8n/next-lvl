/* ============================================================
   BORDER WIDTH

   Four widths, and they were all literals before this file
   existed — `2px` written into six stylesheets for the focus
   ring, `1px` into four more for a hairline rule.

   The card system's 2px stroke is `base`. It is not drawn as a
   border at all — it is a spread box-shadow (see surface.ts), so
   it costs no layout — but the WIDTH is the same decision as
   every other border in the product and belongs in the same
   place.
   ============================================================ */

export const borderWidth = {
  /** a rule between rows, and the wireframe's dashed outline */
  hairline: '1px',
  /** the figma-style selection ring */
  ring: '1.5px',
  /** the card stroke, and the focus outline on everything */
  base: '2px',
  /** the playhead, and the scrollbar thumb's inset border */
  thick: '3px',
  /** THE TRAVELLING DOT ON THE ASK AERA OUTLINE.
   *
   *  It is drawn as a round-capped dash of almost no length walking
   *  the bubble's own border, so its DIAMETER is the stroke width —
   *  this is a dot size wearing a stroke's units. Twice `thick`,
   *  which is where it came from: at 3px it was the same weight as
   *  the glow under the border and read as a bulge in the line
   *  rather than as a head running along it.
   *
   *  Here rather than in `landing` because every landing length is
   *  projected through `--aera-scale`, and this one must not be: it
   *  sits on a stroke the scale does not touch either, and a dot
   *  that shrank while the two strokes beside it held their weight
   *  would stop being twice the line and become 1.6 times it. */
  traceDot: '6px',
} as const;

export type BorderWidth = keyof typeof borderWidth;
