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

/* ------------------------------------------------------------
   THE TWO CARD FACES THAT ARE NOT HUES

   A pattern card's face cycles through the five palette hues and
   then these two. They are the reason a twelve-card hand stops
   reading as a loop: five hues repeat every five cards and the eye
   catches it immediately, and no amount of reordering hides that.
   Two LOW-CHROMA faces in the cycle break the rhythm, because
   neither of them is competing to be a hue at all.

   They live here rather than in `data` on purpose — `data` is the
   palette, and a palette entry carries a meaning slot in the
   charts. These carry none; they are just paper and just ink.

   The near-black is `surface.inverse` referenced, not a second copy
   of the same hex: there is one near-black in this product and it
   is used for inverted pills, tooltips and this card face alike.
   ------------------------------------------------------------ */
export const colorFace = {
  /** warm paper — the low-chroma card face */
  beige: '#F0E9D8',
  /** the near-black card face */
  ink: colorSurface.inverse,
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
/* ------------------------------------------------------------
   SHOT ZONES — THE EXCEPTION, MADE EXPLICIT.

   This ramp is the shot field's and nothing else's. It has its own
   names so that the semantic rule — green good, orange bad — can
   never be "restored" over the top of it by someone tidying up:
   on a shot chart the colour is answering a different question, so
   it gets its own tokens and its own note rather than borrowing
   `colorSemantic` and hoping nobody notices.

   A NOTE ON THE BASKETBALL CONVENTION. The familiar NBA shot chart
   runs blue (cold) → orange (hot). This product deliberately does
   NOT: blue does not sit on an ordered axis with mint and orange,
   so a three-stop ramp through it cannot be read in order by
   anyone who has not been told the key. The stops below are the
   semantic hues, in accuracy order, which is what the field is
   currently drawn with.

   Switching to blue → orange is a real design decision and a
   visible change. It is not a refactor and it is not done here.
   ------------------------------------------------------------ */
export const colorShotZone = {
  /** the accurate end of the ramp */
  hot: colorSemantic.positive,
  holding: colorSemantic.neutral,
  /** the cold end */
  cold: colorSemantic.negative,
} as const;

export const accuracyRamp = [
  { name: 'accurate', color: colorShotZone.hot, min: 0.42 },
  { name: 'holding', color: colorShotZone.holding, min: 0.33 },
  { name: 'cold', color: colorShotZone.cold, min: 0 },
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
  face: colorFace,
  dataInk: colorDataInk,
  semantic: colorSemantic,
  shotZone: colorShotZone,
  onFace: colorOnFace,
  utility: colorUtility,
} as const;

export type DataTone = keyof typeof colorData;
export type SemanticTone = keyof typeof colorSemantic;
export type AccuracyStop = (typeof accuracyRamp)[number]['name'];
