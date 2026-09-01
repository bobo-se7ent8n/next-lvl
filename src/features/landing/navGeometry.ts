/* ============================================================
   TWO PIECES OF GEOMETRY THE LANDING PAGE DRAWS BY HAND.

   `roundRectLength` is the perimeter of a stadium — the length an
   SVG `<rect rx>` stroke has to be dashed against for a trace to
   read as a fraction of the outline. The Ask AERA bubble uses it:
   its border closes as the prompt types itself in.

   `ARROW_DOTS` is the nav capsule's glyph, written as the picture
   it draws rather than as a list of coordinates nobody can check.

   A NOTE ON WHAT USED TO BE HERE. This file also carried
   `pointOnRoundRect`, which found the point a given fraction along
   that outline so a lit dot could ride at the head of the nav's
   progress stroke. The nav's indicator is a straight bar growing
   out of the centre of the capsule's top border now, so there is no
   head to place and the function had no callers. Deleted rather
   than kept warm: a helper nothing calls is a helper nobody
   maintains.
   ============================================================ */

/** the outline's total length — the stroke's own `pathLength` */
export function roundRectLength(w: number, h: number, r: number): number {
  const radius = Math.min(r, w / 2, h / 2);
  return 2 * (w - 2 * radius) + 2 * (h - 2 * radius) + 2 * Math.PI * radius;
}

/* ------------------------------------------------------------
   THE ARROW, AS DOTS

   Five rows of a five-wide matrix. Written as the picture it
   draws so it can be read at a glance and edited by moving an X,
   rather than as a list of coordinates nobody can check.
   ------------------------------------------------------------ */
const ARROW = ['..X..', '.XXX.', 'XXXXX', '..X..', '..X..'];

export interface Dot {
  col: number;
  row: number;
}

export const ARROW_DOTS: Dot[] = ARROW.flatMap((line, row) =>
  [...line].flatMap((cell, col) => (cell === 'X' ? [{ col, row }] : [])),
);

/** how wide the matrix is, in cells */
export const ARROW_SPAN = ARROW[0].length;
