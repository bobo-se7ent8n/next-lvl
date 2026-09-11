/* ============================================================
   THE STORY SECTIONS — "The full picture" and "A game".

   Both are drawn in the design at a 2046 × 1151 window and, like the
   hero, they are scaled here as pictures: every number below is a
   DESIGN PIXEL, a plain number, and the stylesheet multiplies it by
   one unit — the smaller of the window's width over 2046 and its
   height over 1151 — so each section keeps its composition and fits
   one screen.
   ============================================================ */

export const story = {
  designWidth: '2046',
  designHeight: '1151',

  /* ---- the full picture ---- */
  headTop: '64',
  headSize: '98.4',
  headGap: '32',
  subSize: '23.4438',
  subLeading: '1.4',
  subMeasure: '670',
  /** the deck: one radius for every card in it */
  deckRadius: '48',
  /** the product shot inside the front card */
  innerInset: '40',
  innerWidth: '485',
  innerRadius: '28',
  /** the copy beside it */
  copySize: '23.4438',
  copyLeading: '1.4',
  copyLeadingTight: '1.2',
  copyMeasure: '295',
  /** the front two cards trading places — the incoming one is lifted
   *  over the outgoing one halfway through, which is when they cross */
  swapDuration: '720ms',
  /** the outgoing card's contents clearing, and the incoming card's
   *  arriving once it is on top */
  contentOut: '240ms',
  contentIn: '420ms',

  /* ---- a game ---- */
  gameSize: '258.4',
  gameTracking: '-0.0208em',
  tileWidth: '220',
  tileHeight: '275',
  tileRadius: '20',
  /** the section arriving, once: every piece rises into place in turn */
  revealDuration: '720ms',
  revealStep: '60ms',
  revealRise: '24px',
} as const;

export type StoryToken = keyof typeof story;
