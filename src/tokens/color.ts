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

/* ------------------------------------------------------------
   THE TAG PALETTE — the landing page's scattered word field.

   Eight soft pastels, and five of them are the AERA palette
   REFERENCED rather than re-typed: a tag wearing mint is wearing
   the same mint a chart draws in, and the day that mint moves this
   moves with it. The three that are new — pink, peach and coral —
   are the warm end the product's own palette does not have, and
   they exist because twenty-two tags scattered across a screen need
   more than five fills before the eye starts reading the repeat
   instead of the words.

   They are a SEPARATE GROUP from `data` for the same reason
   `colorFace` is: a `data` entry carries a meaning slot in the
   charts, and these carry none. A tag is a word on a wall.

   Every one is light enough to take the product's own dark ink, so
   there is no light-on-dark case anywhere in the field.
   ------------------------------------------------------------ */
export const colorTag = {
  pink: '#FFC9DE',
  peach: '#FFD9BF',
  coral: '#FFB3A7',
  lilac: colorData.lilac,
  mint: colorData.mint,
  sky: colorData.blue,
  butter: colorData.yellow,
  sand: colorFace.beige,
} as const;

/* ------------------------------------------------------------
   ACCENT — colour used as TYPE rather than as a fill.

   The palette is five pastels designed to be filled with, and none
   of them can carry a word: `#FF9B68` set as running text on
   `#FFFFFC` is a smear. This is the one place on the landing page
   where a colour has to be READ rather than looked at, so it is the
   palette orange taken to text weight and nothing else uses it.

   A NOTE ON WHAT IS NOT HERE. This group briefly carried two lilac
   stops for a text gradient on the Sessions read-through. There are
   no gradients in this product: flat fills are the whole visual
   argument, and one exception is how a rule stops being one. The
   copy is black body text, and the single orange word is the only
   colour in it.
   ------------------------------------------------------------ */
export const colorAccent = {
  /** the palette orange, dark enough to set a word in */
  orange: '#B34D14',
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

  /* ---- THE DARK ENTRY STATE ---------------------------------
     The loading screen is the one dark surface a visitor sees, and
     it needs a line the light system has no equivalent for: a rule
     drawn ON the near-black. Alpha rather than a sixth near-black,
     so `surface.inverse` stays the only dark in the product.

     There used to be a paper-coloured twin of it for the white
     state. There is no grid on the white state any more — it fades
     out as the card fills the window rather than changing colour
     under it — so the twin had no callers and is gone. */
  /** the faint grid rule ruled across the dark entry state */
  gridDark: 'rgba(255,255,252,0.055)',
} as const;

export const color = {
  surface: colorSurface,
  ink: colorInk,
  data: colorData,
  face: colorFace,
  tag: colorTag,
  accent: colorAccent,
  dataInk: colorDataInk,
  semantic: colorSemantic,
  shotZone: colorShotZone,
  onFace: colorOnFace,
  utility: colorUtility,
} as const;

export type DataTone = keyof typeof colorData;
export type TagTone = keyof typeof colorTag;
export type SemanticTone = keyof typeof colorSemantic;
export type AccuracyStop = (typeof accuracyRamp)[number]['name'];
