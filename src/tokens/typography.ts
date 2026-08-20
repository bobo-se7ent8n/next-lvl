/* ============================================================
   TYPOGRAPHY

   Three families and eight composed text tokens — every piece of
   type in the product is one of these. Components never set a
   font-size or a letter-spacing of their own.

   Collapsed from fifteen:
     · metricXL dropped; metricLG carries the hero number instead
       and clamps up to do it.
     · bodyLG + body     → body    (14.5px, the middle of 15 and 14)
     · bodySM + bodyXS   → bodySM  (12px, the middle of 12.5 and 11.5)
     · displayMD + displaySM → displayMD (16px, between 20 and 13)
     · metricMD + metricSM   → metricMD  (22px, between 26 and 19)
     · label + labelLG + tick + mono → mono. The mono family keeps
       the uppercase annotation voice the labels carried, so a
       caption still reads as a caption.

   `display` is Oswald as a variable font. Headlines get per-letter
   weight variation (see `inkVariation`) so a headline reads as
   something printed rather than typed. The randomisation is
   deterministic — hashed from the string itself — so the same
   words always come out the same way.
   ============================================================ */

export const fontFamily = {
  display: "'Oswald', Impact, sans-serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** the per-letter jitter applied to display headlines */
export const inkVariation = {
  /** weight is drawn from this range, rounded to a step of 10 */
  weightMin: 420,
  weightMax: 700,
  /** ± degrees of rotation per letter */
  rotate: 1.4,
  /** ± px of vertical offset per letter */
  shift: 1.3,
} as const;

/** the eight composed text tokens — the full set a component may ask for */
export const textStyle = {
  /* ---- display · Oswald 700, uppercase ---- */
  displayXL: {
    fontFamily: fontFamily.display,
    fontSize: 'clamp(38px, 5vw, 74px)',
    lineHeight: '0.95',
    letterSpacing: '0.012em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
  },
  displayLG: {
    fontFamily: fontFamily.display,
    fontSize: 'clamp(26px, 3.4vw, 44px)',
    lineHeight: '0.96',
    letterSpacing: '0.012em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
  },
  /** every card heading and every small display line */
  displayMD: {
    fontFamily: fontFamily.display,
    fontSize: '16px',
    lineHeight: '1.12',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
  },

  /* ---- metric · Oswald 700, tight leading ---- */
  /** the headline reading of a card, and of the focus panel */
  metricLG: {
    fontFamily: fontFamily.display,
    fontSize: 'clamp(34px, 3.6vw, 52px)',
    lineHeight: '0.84',
    letterSpacing: '-0.028em',
    fontWeight: fontWeight.bold,
  },
  metricMD: {
    fontFamily: fontFamily.display,
    fontSize: '22px',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.bold,
  },
  /** the stat number on a session card — a reading, not a headline */
  metricSM: {
    fontFamily: fontFamily.display,
    fontSize: '16px',
    lineHeight: '1',
    letterSpacing: '-0.01em',
    fontWeight: fontWeight.bold,
  },

  /* ---- body · Inter ---- */
  body: {
    fontFamily: fontFamily.body,
    fontSize: '14.5px',
    lineHeight: '1.55',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
  },
  bodySM: {
    fontFamily: fontFamily.body,
    fontSize: '12px',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
  },
  /** a group heading inside a card — sentence case, bold, never mono */
  bodyStrong: {
    fontFamily: fontFamily.body,
    fontSize: '14.5px',
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: fontWeight.semibold,
  },

  /* ---- mono · the annotation voice of the whole product ---- */
  /** the smallest annotation in the product — labels sitting INSIDE a
   *  diagram, where the drawing is the content and the label is only
   *  there to name what you are already looking at */
  monoSM: {
    fontFamily: fontFamily.mono,
    fontSize: '8px',
    lineHeight: '1.3',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.regular,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: '10px',
    lineHeight: '1.4',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.medium,
  },
} as const;

export type TextStyleName = keyof typeof textStyle;
