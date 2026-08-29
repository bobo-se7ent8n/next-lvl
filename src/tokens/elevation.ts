/* ============================================================
   ELEVATION

   Cards and the page share a fill now, so elevation is the only
   thing separating an object from the paper it rests on. The
   shadows below are correspondingly a little more present than
   they were when a card was also a different colour — still warm
   grey, never pure black, still long and soft.

   Every shadow here is a plain box-shadow so it follows the
   element's own border-radius. Nothing in the system paints a
   shadow on a different element from the one carrying the radius —
   that is what produced the dark wedge at the card corners.
   ============================================================ */

import { borderWidth } from './border';
import { colorUtility } from './color';

export const elevation = {
  none: 'none',
  /** a record resting on the page */
  low: '0 10px 26px -18px rgba(40,36,28,0.42), 0 2px 5px -3px rgba(40,36,28,0.10)',
  /** the default card */
  medium: '0 18px 42px -24px rgba(40,36,28,0.50), 0 3px 8px -4px rgba(40,36,28,0.12)',
  /** hovered, or otherwise lifted */
  high: '0 30px 62px -26px rgba(40,36,28,0.54), 0 4px 10px -5px rgba(40,36,28,0.14)',
  /** the opened pattern, above the dim */
  overlay: '0 50px 96px -34px rgba(40,36,28,0.58), 0 6px 14px -6px rgba(40,36,28,0.16)',
  /** the figma-style hover ring — a spread shadow, so it follows the radius */
  selectRing: `0 0 0 ${borderWidth.ring} ${colorUtility.select}`,
} as const;

export type ElevationLevel = keyof typeof elevation;
