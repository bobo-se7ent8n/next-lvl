/* ============================================================
   ELEVATION

   Four card levels plus one inset. Shadows are warm-grey, never
   pure black, and always long and soft — the object should look
   like it is resting on paper.

   Every shadow here is a plain box-shadow so it follows the
   element's own border-radius. Nothing in the system paints a
   shadow on a different element from the one carrying the radius —
   that is what produced the sharp-corner artefact on the fan cards.
   ============================================================ */

export const elevation = {
  none: 'none',
  /** a record strip resting on the page */
  low: '0 12px 30px -22px rgba(40,36,28,0.45)',
  /** the default card */
  medium: '0 16px 40px -26px rgba(40,36,28,0.45)',
  /** hover / lifted */
  high: '0 30px 62px -28px rgba(40,36,28,0.50)',
  /** the opened pattern, the modal */
  overlay: '0 50px 96px -34px rgba(40,36,28,0.55)',
  /** the recessed well inside a card */
  inset: [
    'inset 0 0 18px 3px rgba(255,255,255,0.92)',
    'inset 0 0 0 1px rgba(255,255,255,0.85)',
    'inset 0 0 0 2px rgba(255,255,255,0.40)',
    'inset 0 0 0 1px rgba(120,110,92,0.05)',
  ].join(', '),
  /** the figma-style hover ring — a spread shadow, so it follows the radius */
  selectRing: '0 0 0 1.5px #0D99FF',
} as const;

export type ElevationLevel = keyof typeof elevation;
