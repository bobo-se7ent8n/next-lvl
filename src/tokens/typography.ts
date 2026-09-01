/* ============================================================
   TYPOGRAPHY

   Three faces, four family tokens, and eight composed text tokens —
   every piece of type in the product is one of these. Components
   never set a font-size or a letter-spacing of their own.

   Inter carries two of the four family tokens: `heading` and `body`
   are the same face under two role names, so the heading face can
   move later without taking body copy with it.

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

/* Inter, written once. `heading` and `body` are the same face and
   deliberately two names: they are different ROLES, and the day the
   heading face changes again it has to be able to move without
   dragging every paragraph in the product with it. */
const INTER = "'Inter', system-ui, -apple-system, sans-serif";

export const fontFamily = {
  /** Oswald — the big display headlines and the hand-set letters */
  display: "'Oswald', Impact, sans-serif",
  /** THE HEADING FACE. Inter, per the Figma spec for Heading 3
   *  (node 464:8311): Inter Semi Bold 16 / 22.48 / -0.4%. This is
   *  what `displayMD` and the numerals that follow it are set in. */
  heading: INTER,
  /** running text */
  body: INTER,
  /** the annotation voice */
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
/* ------------------------------------------------------------
   THE THREE PIECES OF TYPE THAT ARE NOT A WHOLE TEXT TOKEN.

   A composed token in `textStyle` sets five properties at once,
   which is right for a paragraph and wrong for a chip: a chip
   needs the mono family and its own tracking, and it needs a
   line-height of exactly 1 because it is a pill sized by its
   padding rather than by its leading.

   These three groups exist so those components can reach for a
   token instead of typing `0.09em` into a stylesheet.
   ------------------------------------------------------------ */

/** letter-spacing, as its own axis */
export const tracking = {
  none: '0',
  /** the display faces, and the small display line */
  display: '0.012em',
  displayWide: '0.06em',
  /** THE HEADING STEP. Figma node 464:8311 sets Heading 3 at -0.4
   *  PERCENT, which is -0.004em — a percent of the font size, not
   *  four tenths of a pixel. Named for the role rather than the
   *  number so the two do not have to be read together. */
  heading: '-0.004em',
  /** the figma-style name tag under a hovered card */
  tag: '0.02em',
  /** a filled chip — wider than the tag, tighter than mono */
  chip: '0.09em',
  /** the annotation voice */
  monoSM: '0.1em',
  mono: '0.12em',
  /** the numerals, which tighten as they get bigger */
  metricSM: '-0.01em',
  metricMD: '-0.02em',
  metricLG: '-0.028em',
} as const;

/** line-height, where a component needs one on its own */
export const lineHeight = {
  /** a pill, a chip, a tag — sized by padding, never by leading */
  none: '1',
  /** the tooltip's two-line body */
  snug: '1.45',
} as const;

/** figure style. A slot the token set did not have — four
 *  stylesheets were each writing `tabular-nums` out by hand. */
export const numeric = {
  /** every digit the same width, so a column cannot shift while a
   *  reading counts up */
  tabular: 'tabular-nums',
  normal: 'normal',
} as const;

/** a size expressed relative to the type it sits in */
export const fontScale = {
  /** the raised degree sign on a reading */
  superscript: '0.55em',
} as const;

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
  /* ONE STEP ABOVE BODY, AND IT IS BACK ON PURPOSE.

     An earlier pass folded `bodyLG` into `body` because the two were
     15 and 14 and nobody could tell them apart. This is not that
     token: it is 17, a real step, and it exists for the one place on
     the site where a paragraph IS the content of a section rather
     than support under a heading — the Sessions read-through, which
     has a laptop beside it and nothing else in its column. At body
     size that paragraph read as a caption for the screenshot. */
  bodyLG: {
    fontFamily: fontFamily.body,
    fontSize: '17px',
    lineHeight: '1.5',
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

export type Tracking = keyof typeof tracking;
export type LineHeightStep = keyof typeof lineHeight;
export type FontScale = keyof typeof fontScale;
export type NumericStyle = keyof typeof numeric;
