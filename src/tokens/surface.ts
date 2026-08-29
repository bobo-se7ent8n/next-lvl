/* ============================================================
   SURFACE

   The card system, as tokens. Every card in the product is built
   from exactly these numbers, so "a card" is one decision made
   once rather than forty decisions made in forty stylesheets.

   TWO KINDS OF SURFACE, and they are treated differently on
   purpose:

   · a CARD is an object resting on the paper. A non-clickable one
     carries NO drop shadow at all — it is separated from the page
     by a 2px stroke sitting outside its edge. A shadow implies the
     thing could be picked up; most of these cannot.

   · an INNER CONTAINER is a recess cut INTO a card — the region
     holding a chart, a dot field or a pattern candidate. It reads
     as pressed in rather than raised, which is what the white
     inset light on all four edges is doing.

   The space steps here are deliberately named rather than pulled
   from the numeric scale: the scale has no 16 and no 20, and
   renumbering it would have moved every other spacing in the app.
   ============================================================ */

import { colorSurface } from './color';
import { borderWidth } from './border';

export const cardSpec = {
  /** padding on every card face, all four sides */
  padding: '20px',
  /** the gap between blocks stacked inside a card */
  gap: '16px',
  /** the gap between a stat group and its neighbour */
  groupGap: '16px',
  /** The gap between a number and its unit label.
   *
   *  Specified as 2px, set to 4. At 2px the gap is real and measures
   *  correctly, but a 16px display numeral against a 10px mono label
   *  still reads as one word — `18PTS` — which is the outcome the
   *  spec actually asks to avoid. 4px is the smallest step that
   *  separates them visibly. Drop it back to 2 here if the tighter
   *  setting is wanted after all; it is one number in one place. */
  unitGap: '4px',
  /** the gap between the tight rows of a card head */
  tightGap: '4px',
  /** Vertical padding on one rating row, and the gap between a group
   *  heading and its rows.
   *
   *  12, and the leverage is the point: there are twelve rating rows
   *  on the Scoreboard and the padding is paid twice on each, so this
   *  one number is worth ~190px of column height. It was 4 when the
   *  ratings column was the tallest of the three and every pixel had
   *  to come out of it. It is not any more — the column now runs
   *  SHORT of the other two, and the height that used to be scarce
   *  was being handed to "where to work next" to stretch into, which
   *  pushed its two entries to opposite edges of the card.
   *
   *  Spending it here instead puts it where it reads as breathing
   *  room in a list rather than as a void in a card. Projected
   *  through `--aera-scale` like every other length, so the rhythm
   *  steps down with the rest of the page and is not tuned to one
   *  window. */
  rowPadding: '12px',
} as const;

export const innerSpec = {
  /** padding inside a recessed container, all four sides */
  padding: '12px',
  /** the gap between a heading row and the paragraph under it */
  headGap: '12px',
} as const;

/* ------------------------------------------------------------
   THE TWO SURFACE TREATMENTS

   Both are box-shadows so neither one affects layout: the stroke
   sits outside the card's edge without taking a pixel of space,
   and the inset light is painted inside the recess rather than
   drawn as four borders.
   ------------------------------------------------------------ */
export const surfaceEffect = {
  /** what a non-clickable card wears INSTEAD of a drop shadow */
  stroke: `0 0 0 ${borderWidth.base} ${colorSurface.level1}`,
  /** the white light around the inside edge of a recess. Four
   *  stacked insets, one per edge, so the recess reads as pressed
   *  in from every side rather than lit from one direction. */
  innerGlow: [
    'inset 0 4px 8px rgba(255,255,255,0.5)',
    'inset 0 -4px 8px rgba(255,255,255,0.5)',
    'inset 4px 0 8px rgba(255,255,255,0.5)',
    'inset -4px 0 8px rgba(255,255,255,0.5)',
  ].join(', '),
} as const;

export type CardSpecStep = keyof typeof cardSpec;
export type InnerSpecStep = keyof typeof innerSpec;
