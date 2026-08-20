/* ============================================================
   COLOR TOKENS

   The scale is eight values and no more: four surfaces and four
   inks. Everything else in this file is a mapping onto the AERA
   palette rather than a new colour.

   · surface / ink   — the paper and the text on it. Eight tokens.
                       Cards and the page now share a fill; a card
                       reads as a distinct object because of its
                       elevation and its radius, not because it is
                       a different colour.
   · data            — the AERA palette. Five hues, nothing else.
                       Carries no meaning on its own.
   · semantic        — green = good, orange = bad. GLOBAL RULE.
   · accuracy        — the ordered three-step ramp the shot field
                       is coloured by. It is the semantic scale, in
                       order: mint is accurate, orange is not. There
                       is no cold → hot exemption any more — that
                       scale ran through blue, and blue does not sit
                       on an ordered axis with mint and orange.
   · onFace          — alpha washes for use ON a coloured card face,
                       where a surface token would fight the face.
   · utility         — the handful of functional colours that are
                       not part of the scale: a hairline, the dim,
                       the wireframe dash, the selection ring.
   ============================================================ */

export const colorSurface = {
  /** the paper, and the face of every card resting on it */
  background: '#FFFFFC',
  /** the first step up — chips, quiet fills, wells */
  level1: '#F3F2EE',
  /** the second — tracks, inactive rails, empty cells */
  level2: '#E9E7E1',
  /** the darkest surface — inverted pills, tooltips */
  inverse: '#141310',
} as const;

export const colorInk = {
  /** headlines, body copy and every numeral */
  primary: '#111111',
  /** secondary labels and quieter running text */
  secondary: '#615E58',
  /** micro annotation, captions, disabled */
  tertiary: '#96928B',
  /** text on an inverse surface */
  onInverse: '#FFFFFC',
} as const;

/** the AERA palette — five hues, and nothing outside them */
export const colorData = {
  mint: '#93EAC3',
  yellow: '#FFE159',
  orange: '#FF9B68',
  lilac: '#C4B5FF',
  blue: '#A6DBFF',
} as const;

/** legible ink for text sitting directly on each palette colour */
export const colorDataInk = {
  mint: '#062017',
  yellow: '#1F1804',
  orange: '#201006',
  lilac: '#150F26',
  blue: '#0A1620',
} as const;

/* ------------------------------------------------------------
   SEMANTIC — the global rule. Green is good, orange is bad,
   yellow is the middle. Nothing else may claim these meanings.
   ------------------------------------------------------------ */
export const colorSemantic = {
  positive: colorData.mint,
  neutral: colorData.yellow,
  negative: colorData.orange,
  /** a reading that carries no judgement at all */
  informational: colorData.blue,
} as const;

/* ------------------------------------------------------------
   ACCURACY — three ordered stops, and they are the semantic ones.
   A scale that has to be read in order can only use hues that
   have an order: mint, yellow, orange. Lilac and blue are on the
   palette but not on this axis, so they are not on this ramp.
   Highest first — mint is the accurate end.
   ------------------------------------------------------------ */
export const accuracyRamp = [
  { name: 'accurate', color: colorSemantic.positive, min: 0.42 },
  { name: 'holding', color: colorSemantic.neutral, min: 0.33 },
  { name: 'cold', color: colorSemantic.negative, min: 0 },
] as const;

/* ------------------------------------------------------------
   ON-FACE — washes used on top of a coloured card, where a
   surface token would fight the face underneath it.
   ------------------------------------------------------------ */
export const colorOnFace = {
  /** a recessed panel on a coloured card */
  wash: 'rgba(255,255,255,0.34)',
  /** the same panel, lifted — a hovered link */
  washStrong: 'rgba(255,255,255,0.72)',
  /** an empty track on a coloured card */
  track: 'rgba(0,0,0,0.09)',
  /** the barely-there field behind a viz on a light face */
  vizLight: 'rgba(255,255,255,0.42)',
  /** the same field on a dark face */
  vizDark: 'rgba(255,255,255,0.12)',
} as const;

export const colorUtility = {
  /** figma-style selection outline */
  select: '#0D99FF',
  /** text on the selection outline */
  onSelect: '#FFFFFF',
  /** the one hairline in the system — court markings, chart axes */
  hairline: 'rgba(120,110,92,0.14)',
  /** the flat ground that drops behind a focused object. Never a blur. */
  dim: 'rgba(20,19,16,0.52)',
  /** the dashed scaffolding line of a wireframe — annotation, not design */
  wireframe: 'rgba(120,110,92,0.40)',
  /** text-selection highlight */
  highlight: colorData.yellow,
  /** the fill shift a surface makes when the pointer is over it */
  hover: 'rgba(20,19,16,0.045)',
  /** the same, pressed */
  press: 'rgba(20,19,16,0.085)',
  /** the keyboard focus ring — never used for hover, only for tab */
  focus: '#111111',
} as const;

export const color = {
  surface: colorSurface,
  ink: colorInk,
  data: colorData,
  dataInk: colorDataInk,
  semantic: colorSemantic,
  onFace: colorOnFace,
  utility: colorUtility,
} as const;

export type DataTone = keyof typeof colorData;
export type SemanticTone = keyof typeof colorSemantic;
export type AccuracyStop = (typeof accuracyRamp)[number]['name'];
