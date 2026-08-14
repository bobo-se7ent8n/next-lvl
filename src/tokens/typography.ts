/* ============================================================
   TYPOGRAPHY

   Three families and a small set of composed text tokens. Every
   piece of type in the product is one of these — components never
   set a font-size or a letter-spacing of their own.

   `display` is Oswald as a variable font. Headlines get per-letter
   weight variation (see `inkVariation`) so a headline reads as
   something that was printed rather than typed. The randomisation
   is deterministic — hashed from the string itself — so the same
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

/** composed text tokens — the full set a component may ask for */
export const textStyle = {
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
  displayMD: {
    fontFamily: fontFamily.display,
    fontSize: '20px',
    lineHeight: '1.1',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
  },
  displaySM: {
    fontFamily: fontFamily.display,
    fontSize: '13px',
    lineHeight: '1.15',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.bold,
  },
  /** the big number on a metric */
  metricXL: {
    fontFamily: fontFamily.display,
    fontSize: 'clamp(48px, 7vw, 86px)',
    lineHeight: '0.8',
    letterSpacing: '-0.03em',
    fontWeight: fontWeight.bold,
  },
  metricLG: {
    fontFamily: fontFamily.display,
    fontSize: '38px',
    lineHeight: '0.85',
    letterSpacing: '-0.025em',
    fontWeight: fontWeight.bold,
  },
  metricMD: {
    fontFamily: fontFamily.display,
    fontSize: '26px',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.bold,
  },
  metricSM: {
    fontFamily: fontFamily.display,
    fontSize: '19px',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.bold,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: '14px',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
  },
  bodySM: {
    fontFamily: fontFamily.body,
    fontSize: '12.5px',
    lineHeight: '1.55',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
  },
  bodyXS: {
    fontFamily: fontFamily.body,
    fontSize: '11.5px',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: fontWeight.regular,
  },
  /** the mono label style — every micro caption in the product */
  label: {
    fontFamily: fontFamily.mono,
    fontSize: '9px',
    lineHeight: '1.35',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.medium,
  },
  labelLG: {
    fontFamily: fontFamily.mono,
    fontSize: '10.5px',
    lineHeight: '1.35',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontWeight: fontWeight.medium,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: '11px',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    fontWeight: fontWeight.medium,
  },
} as const;

export type TextStyleName = keyof typeof textStyle;
