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
} as const;

export type BorderWidth = keyof typeof borderWidth;
