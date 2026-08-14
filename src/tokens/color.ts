/* ============================================================
   COLOR TOKENS

   Four groups, and the rules that govern them:

   · surface / ink   — the paper and the text on it. Never tinted.
   · data            — the five-colour muted palette used for charts,
                       card faces and chips. Carries no meaning on its own.
   · semantic        — green = good, red/orange = bad. GLOBAL RULE.
   · shotZones       — cold → hot FG% ramp. The ONE deliberate exemption
                       from the semantic rule, because it follows the
                       basketball convention rather than ours. Never reuse
                       this scale for anything but shot zones.
   ============================================================ */

export const colorSurface = {
  /** the paper — flat, never a colour wash */
  background: '#FFFFFC',
  /** raised card face */
  panel: '#FFFFFF',
  /** level 1 — chips, quiet fills */
  level1: '#F3F2EE',
  /** level 2 — tracks, inactive rails */
  level2: '#E9E7E1',
  /** recessed well inside a card */
  well: '#F5F4F0',
  /** the darkest surface — inverted pills, tooltips */
  inverse: '#141310',
} as const;

export const colorInk = {
  /** primary text and headlines */
  primary: '#111111',
  /** body copy, secondary labels */
  secondary: '#615E58',
  /** micro labels, captions, disabled */
  tertiary: '#96928B',
  /** big numerals — a touch denser than primary so they read as objects */
  numeral: '#0D0C0A',
  /** text on an inverse surface */
  onInverse: '#FFFFFC',
} as const;

/** the muted data palette — five named hues plus two neutral extenders */
export const colorData = {
  mint: '#93EAC3',
  yellow: '#FFE159',
  orange: '#FF9B68',
  lilac: '#C4B5FF',
  blue: '#A6DBFF',
  lime: '#D7F24B',
  tan: '#E7D2AC',
} as const;

/** legible ink for text sitting directly on each data colour */
export const colorDataInk = {
  mint: '#062017',
  yellow: '#1F1804',
  orange: '#201006',
  lilac: '#150F26',
  blue: '#0A1620',
  lime: '#15170A',
  tan: '#1E170C',
} as const;

/* ------------------------------------------------------------
   SEMANTIC — the global rule. Green is good, red/orange is bad,
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
   SHOT ZONES — cold → hot FG% ramp.
   EXEMPT from the semantic rule by design. Four stops, cold first.
   ------------------------------------------------------------ */
export const colorShotZone = {
  cold: '#A6DBFF',
  cool: '#93EAC3',
  warm: '#FFE159',
  hot: '#FF9B68',
} as const;

/** ordered stops + the FG% ceiling each one covers */
export const shotZoneRamp = [
  { name: 'cold', color: colorShotZone.cold, max: 0.28 },
  { name: 'cool', color: colorShotZone.cool, max: 0.52 },
  { name: 'warm', color: colorShotZone.warm, max: 0.74 },
  { name: 'hot', color: colorShotZone.hot, max: Infinity },
] as const;

export const colorUtility = {
  /** figma-style selection outline */
  select: '#0D99FF',
  /** hairline on a light surface */
  hairline: 'rgba(120,110,92,0.14)',
  /** an empty track / rest day */
  empty: 'rgba(226,221,210,0.72)',
  /** text-selection highlight */
  highlight: colorData.lime,
} as const;

export const color = {
  surface: colorSurface,
  ink: colorInk,
  data: colorData,
  dataInk: colorDataInk,
  semantic: colorSemantic,
  shotZone: colorShotZone,
  utility: colorUtility,
} as const;

export type DataTone = keyof typeof colorData;
export type SemanticTone = keyof typeof colorSemantic;
export type ShotZoneStop = keyof typeof colorShotZone;
