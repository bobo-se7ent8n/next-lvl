/* ============================================================
   THE HERO — the public page's first two screens, as constants.

   THE HERO IS DRAWN AT ONE WINDOW SIZE AND SCALED AS A PICTURE.
   The design is a 2050-wide window with the headline, the product
   shot and the stickers composed edge to edge across all of it.
   Every number in the SCENE groups below is a DESIGN PIXEL at that
   width — a plain number, no unit — and the stylesheet multiplies
   it by one unit:

     --u   = the smaller of  window width / 2050
                         and the height the first screen has / the
                             height the design needs

   so the composition keeps its proportions, fills the width, and
   still fits one screen. Horizontal positions use the width share
   alone, so the stickers always reach the edges of the window even
   when a short window makes everything else smaller.

   Two things are NOT on that unit, deliberately: the bar and the
   button. They are interface, not picture — they stay the size a
   pointer needs and scale with `--aera-scale` like the rest of the
   product.
   ============================================================ */

export const hero = {
  /* ---- the bar (px, interface) ---- */
  navHeight: '32px',
  navPadX: '32px',
  navGap: '4px',
  navPillHeight: '22px',
  navPillPadX: '10px',
  /* the mark, cropped to its own glyph (the file used to carry three
     times its width in empty margin, which is what made it read as a
     dash and would have widened the gap to the word if scaled) —
     twice the size it was, with the gap to the word unchanged */
  markWidth: '36px',
  markHeight: '22px',

  /* ---- the call to action (px, interface) ---- */
  ctaHeight: '40px',
  ctaPadX: '20px',

  /* ============================================================
     THE SCENE — design pixels at a 2050-wide window.
     ============================================================ */
  designWidth: '2050',

  /* the headline block */
  headTop: '64',
  headSize: '98.4',
  headGap: '32',
  headBottom: '32',
  headMeasure: '1398',
  headPadX: '40',

  /* the rule under the active keyword — in `em`, so it belongs to
     the type: the design's 4 / 8.6 / 1.1 px against a 98.4px line */
  ruleThickness: '0.0407em',
  ruleOffset: '-0.0872em',
  ruleInset: '0.0116em',

  /* the product shot, and the air under it at the bottom of the
     first screen */
  shotWidth: '838',
  shotHeight: '542',
  shotAspect: '1.5461',
  shotRadius: '32',
  foldGap: '9',

  /* the sticker field's box under the headline */
  sceneHeight: '700',

  /* the stickers */
  stickerRadius: '32',
  stickerPadX: '24',
  stickerPadY: '12',
  stripPadX: '20',
  stripPadY: '12',
  chipShellPad: '4',
  chipRadius: '28',
  chipPadX: '12',
  chipPadY: '8',
  chipGap: '6',
  lockSize: '24',
  legendGap: '6',
  legendDot: '10',
  legendDotSmall: '8',
  badgePadX: '10',
  badgePadY: '6',
  statGap: '12',
  statRowGap: '16',
  statPairGap: '4',
  readingGap: '6',
  readingUnitGap: '4',

  /* ---- THE CYCLE ---------------------------------------------- */
  dwell: '4000ms',
  neutralDwell: '2000ms',
  leadIn: '1080ms',

  /* ---- the keyword switch ---- */
  letterFade: '120ms',
  letterStep: '35ms',
  ruleSweep: '420ms',
  neutralFade: '320ms',

  /* ---- the scene under it ---- */
  shotFade: '500ms',
  stickerOut: '240ms',
  stickerDrift: '1vw',
  stickerIn: '600ms',
  stickerInDelay: '140ms',
  stickerTwist: '18deg',

  /* ---- pointer ---- */
  hoverFade: '320ms',
  resumeDelay: '2000ms',

  /* ---- the opening ---- */
  openDuration: '720ms',
  openHeadDelay: '0ms',
  openCtaDelay: '120ms',
  openShotDelay: '200ms',
  openStickerDelay: '360ms',
  openRise: '18px',

  /* ============================================================
     THE HANDOFF — the second screen. Interface lengths (px): the
     list is text to be read, not part of the picture.
     ============================================================ */
  travel: '2400px',
  handoffDuration: '720ms',
  leaveScale: '1.12',
  modesWidth: '320px',
  modesGap: '64px',
  modesSlide: '130%',
  featPadX: '40px',
  featPadY: '48px',
  featMaxHeight: '780px',
  modeRowHeight: '72px',
  modeBodyMeasure: '288px',
  modeBodyGap: '16px',
  modeBodyPad: '24px',
  modeTitleRest: '0.72',
  modeSwap: '360ms',

  /* ---- the curves: pure deceleration, no overshoot ---- */
  easeShot: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeIn: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeOut: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

/* ------------------------------------------------------------
   THE STICKERS' TYPE — one entry per role, design px at 2050.

   Not composed text tokens: those carry a px size that the product
   scales by `--aera-scale`, and a sticker's words have to scale
   with the PICTURE they are part of or they would run out of their
   pills on a smaller window. Each role names a family and a weight
   from the product's own sets; the projection resolves them.
   Tracking is in `em`, so it follows the size.
   ------------------------------------------------------------ */
export interface HeroTypeRole {
  family: 'hero' | 'display' | 'body' | 'mono';
  size: string;
  weight: 'regular' | 'medium' | 'semibold' | 'bold';
  leading: string;
  tracking: string;
  transform: 'none' | 'uppercase';
}

export const heroType = {
  /** "Catch", "Points", "Release" */
  pill: { family: 'body', size: '24', weight: 'regular', leading: '1', tracking: '0', transform: 'none' },
  /** "band · synced · 41 shots", "stats only · shared" */
  strip: { family: 'mono', size: '20', weight: 'medium', leading: '1', tracking: '0.045em', transform: 'uppercase' },
  /** "Scoreboard", "patterns" */
  chip: { family: 'hero', size: '24', weight: 'semibold', leading: '1', tracking: '-0.0417em', transform: 'none' },
  /** "Tuesday scrimmage" */
  statTitle: { family: 'display', size: '18', weight: 'bold', leading: '1.12', tracking: '0.0533em', transform: 'uppercase' },
  /** "18", "2", "6" */
  statValue: { family: 'display', size: '24', weight: 'bold', leading: '1', tracking: '-0.0183em', transform: 'none' },
  /** "pts", "stl" */
  statUnit: { family: 'mono', size: '10', weight: 'medium', leading: '1.4', tracking: '0.12em', transform: 'uppercase' },
  /** "rush", "pressure" */
  legend: { family: 'body', size: '15', weight: 'regular', leading: '1.2', tracking: '0.048em', transform: 'uppercase' },
  /** "what we saw", "why it happens" */
  legendSmall: { family: 'body', size: '12', weight: 'regular', leading: '1.5', tracking: '0.06em', transform: 'uppercase' },
  /** the "0.42" reading */
  reading: { family: 'display', size: '52', weight: 'bold', leading: '0.84', tracking: '-0.028em', transform: 'none' },
  /** and its "s" */
  readingUnit: { family: 'body', size: '14.5', weight: 'medium', leading: '1.55', tracking: '0', transform: 'none' },
  /** "release under pressure" */
  caption: { family: 'mono', size: '10', weight: 'medium', leading: '1.4', tracking: '0.12em', transform: 'uppercase' },
  /** "Session 14" */
  badge: { family: 'mono', size: '10', weight: 'medium', leading: '1', tracking: '0.09em', transform: 'uppercase' },
  /** "Focus" */
  label: { family: 'display', size: '16', weight: 'bold', leading: '1.12', tracking: '0.06em', transform: 'uppercase' },
} as const satisfies Record<string, HeroTypeRole>;

/* ------------------------------------------------------------
   WHERE THE HANDOFF'S PHASES FALL, as fractions of `travel`.
   ------------------------------------------------------------ */
export const heroHandoff = {
  leaveAt: 0.015,
  modesAt: 0.1,
  segment: 0.3,
} as const;

export type HeroToken = keyof typeof hero;
