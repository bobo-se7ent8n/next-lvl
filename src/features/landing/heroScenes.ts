/* ============================================================
   THE HERO'S THREE SCENES.

   The headline names three things the product does, and each of
   those words owns a scene: one product shot in the middle and a
   field of stickers around it. This file is the whole of that
   content, FROZEN AT MODULE LOAD so no render ever builds a new
   copy of it.

   EVERY NUMBER IS A DESIGN PIXEL at the 2050-wide window the hero is
   drawn at (see tokens/hero.ts). `x` is measured from the left edge
   of the window and `y` from the top of the product shot; the
   stylesheet turns them into lengths — `x` by the window's width
   share, so the field always reaches both edges, and `y`, sizes and
   type by the hero's unit. Each sticker is placed by its TOP-LEFT
   corner and turned about it, which is how the design turns them.

   THE DRIFT IS DERIVED, NOT AUTHORED: a sticker leaves away from the
   centre of the shot, so its direction is just where it sits.
   ============================================================ */

interface Place {
  /** left edge, design px from the left of the window */
  x: number;
  /** top edge, design px from the top of the product shot */
  y: number;
  /** degrees, clockwise, about the top-left corner */
  rotate: number;
  /** a fixed box, for the ones that have one; the rest size to content */
  w?: number;
  h?: number;
  /** an asterisk turns into place rather than only sliding */
  twist?: boolean;
}

type Art =
  | { kind: 'image'; src: string; bgSize?: string; bgPos?: string }
  | { kind: 'line'; d: string; viewBox: string; stroke: string; strokeWidth: number }
  | { kind: 'pill'; text: string; fill: string; ink: string }
  | { kind: 'strip'; text: string }
  | { kind: 'tabs'; on: string; off: string }
  | { kind: 'legend'; text: string; fill: string; small?: boolean }
  | { kind: 'stats'; title: string; values: readonly (readonly [string, string])[] }
  | { kind: 'reading'; value: string; unit: string; caption: string }
  | { kind: 'badge'; text: string; fill: string; ink: string }
  | { kind: 'label'; text: string };

export type Sticker = Place & Art & { id: string; driftX: number; driftY: number };

export interface Scene {
  /** the word in the headline, and the id of the scene under it */
  word: string;
  /** THE SAME THING, EXPLAINED — what the handoff list says about it */
  title: string;
  lead: string;
  body: string;
  /** one colour per letter; the rule under the word is a gradient
   *  through this same array, so the two cannot drift */
  letters: readonly string[];
  shot: string;
  shotAlt: string;
  stickers: readonly Sticker[];
}

const KEY = {
  blue: 'var(--aera-color-keyword-blue)',
  yellow: 'var(--aera-color-keyword-yellow)',
  orange: 'var(--aera-color-keyword-orange)',
  pink: 'var(--aera-color-keyword-pink)',
  green: 'var(--aera-color-keyword-green)',
  lilac: 'var(--aera-color-keyword-lilac)',
} as const;

const FILL = {
  orange: 'var(--aera-color-data-orange)',
  yellow: 'var(--aera-color-data-yellow)',
  lilac: 'var(--aera-color-data-lilac)',
  sticker: 'var(--aera-color-hero-sticker)',
  stickerPink: 'var(--aera-color-hero-sticker-pink)',
  ink: 'var(--aera-color-hero-ink)',
} as const;

const INK = {
  onInverse: 'var(--aera-color-ink-on-inverse)',
  onLilac: 'var(--aera-color-data-ink-lilac)',
} as const;

const LINE_PLAY =
  'M800.083 -48.972C703.199 -53.472 521.954 52.028 455.387 61.528C388.821 71.028 440.888 38.028 457.365 ' +
  '-18.972C473.841 -75.972 311.05 97.028 266.233 53.028C221.416 9.028 375.639 -33.472 301.823 -81.972C228.007 ' +
  '-130.472 50.453 -21.572 -67.917 51.028';

const LINE_SCORE =
  'M1100.208 -33.094C966.936 -36.105 737.091 35.109 626.052 40.841C534.074 45.589 784.817 -47.05 703.309 ' +
  '-49.1C607.419 -51.512 503.69 14.301 365.856 35.154C283.359 47.634 531.17 -73.034 414.812 -55.175C298.947 ' +
  '-37.391 63.302 5.333 -93.795 33.816';

/** the centre of the product shot, in the same design px */
const SHOT_CENTRE = { x: 1025, y: 271 } as const;

function drift(s: Place): { driftX: number; driftY: number } {
  const dx = s.x + (s.w ?? 120) / 2 - SHOT_CENTRE.x;
  const dy = s.y + (s.h ?? 40) / 2 - SHOT_CENTRE.y;
  const len = Math.hypot(dx, dy) || 1;
  return { driftX: +(dx / len).toFixed(3), driftY: +(dy / len).toFixed(3) };
}

const place = (list: readonly (Place & Art & { id: string })[]): readonly Sticker[] =>
  Object.freeze(list.map((s) => Object.freeze({ ...s, ...drift(s) }) as Sticker));

export const SCENES: readonly Scene[] = Object.freeze([
  Object.freeze({
    word: 'play',
    title: 'Play',
    lead: 'For the game itself.',
    body: 'Every session, the ball and band catch what happens in real time — releases, breathing, movement. No setup, no manual logging. You just play.',
    letters: Object.freeze([KEY.blue, KEY.yellow, KEY.orange, KEY.pink]),
    shot: '/hero/play-screen.jpg',
    shotAlt: 'A session open in AERA — motion, opponents and physiology on one timeline',
    stickers: place([
      { id: 'line', kind: 'line', d: LINE_PLAY, viewBox: '0.5 -133 740 389',
        stroke: 'var(--aera-color-hero-squiggle-play)', strokeWidth: 2,
        x: -56, y: 386, rotate: -10.22, w: 740, h: 389 },
      /* THE TURN IS ALREADY IN THE PICTURE: the design exports a turned
         shader as its turned bounding box, so it is placed at that box,
         unrotated, and drawn at 100% */
      { id: 'dither', kind: 'image', src: '/hero/play-dither.png', bgSize: '100% 100%',
        x: -43, y: -21, rotate: 0, w: 364.35, h: 287.73 },
      { id: 'band', kind: 'strip', text: 'band · synced · 41 shots',
        x: 141, y: 278, rotate: 3.22 },
      { id: 'catch', kind: 'pill', text: 'Catch', fill: FILL.orange, ink: INK.onInverse,
        x: 1641, y: 37, rotate: 4.23 },
      { id: 'release', kind: 'pill', text: 'Release', fill: FILL.sticker, ink: INK.onInverse,
        x: 1801.34, y: 284.92, rotate: 0.2 },
      { id: 'session', kind: 'stats', title: 'Tuesday scrimmage',
        values: Object.freeze([
          Object.freeze(['18', 'pts'] as const),
          Object.freeze(['2', 'stl'] as const),
          Object.freeze(['6', 'reb'] as const),
          Object.freeze(['4', 'ast'] as const),
          Object.freeze(['3', 'to'] as const),
        ]),
        x: 1717, y: 160, rotate: -3.01, w: 267 },
      { id: 'month', kind: 'image', src: '/hero/play-ovals.png',
        x: 1667.98, y: 389.34, rotate: 5.14, w: 420, h: 70 },
    ]),
  }),

  Object.freeze({
    word: 'score',
    title: 'Score',
    lead: 'For the numbers that matter.',
    body: "Shots, sessions, streaks — tracked automatically and shown the way you already think about your game. Sharing is opt-in, and it's stats only.",
    letters: Object.freeze([KEY.green, KEY.blue, KEY.lilac, KEY.yellow, KEY.orange]),
    shot: '/hero/score-screen.jpg',
    shotAlt: 'The AERA scoreboard — shot zones, skill ratings and shot mechanics',
    stickers: place([
      { id: 'tabs', kind: 'tabs', on: 'Scoreboard', off: 'patterns',
        x: 29, y: 78, rotate: -12.23 },
      { id: 'points', kind: 'pill', text: 'Points', fill: FILL.orange, ink: INK.onInverse,
        x: 290, y: 165, rotate: -4.15 },
      { id: 'rebounds', kind: 'pill', text: 'Rebounds', fill: FILL.ink, ink: INK.onInverse,
        x: 84, y: 319, rotate: -21.88 },
      { id: 'steals', kind: 'pill', text: 'Steals', fill: FILL.stickerPink, ink: INK.onInverse,
        x: 300, y: 465, rotate: 9.69 },
      /* the turn is in the picture — see the play scene's dither */
      { id: 'dither', kind: 'image', src: '/hero/score-dither.png', bgSize: '100% 100%',
        x: 1670.34, y: 83, rotate: 0, w: 286.19, h: 381.27 },
      { id: 'stats', kind: 'strip', text: 'stats only · shared',
        x: 1660, y: 434, rotate: -2.35 },
      { id: 'line', kind: 'line', d: LINE_SCORE, viewBox: '0.5 -175.317 901 473.634',
        stroke: 'var(--aera-color-data-lilac)', strokeWidth: 4,
        x: 1282.49, y: 2.35, rotate: -10.22, w: 901, h: 473.63 },
      { id: 'star', kind: 'image', src: '/hero/star-large.svg', bgSize: '100% 100%',
        x: 1643, y: -40, rotate: 52.9, w: 46.22, h: 55.37, twist: true },
    ]),
  }),

  Object.freeze({
    word: 'read',
    title: 'Read',
    lead: 'For what repeats.',
    body: 'Patterns only surface once they return — no single bad session gets flagged. When something shows up again and again, aera tells you what it saw, why it happens, and one thing to try.',
    letters: Object.freeze([KEY.lilac, KEY.blue, KEY.green, KEY.yellow]),
    shot: '/hero/read-screen.jpg',
    shotAlt: 'The pattern hand in AERA',
    stickers: place([
      { id: 'figure', kind: 'image', src: '/hero/read-figure.png',
        bgSize: '171.821%', bgPos: '50.478% 100%',
        x: 1958, y: 222, rotate: 60, w: 185.44, h: 256.81 },
      { id: 'starSmall', kind: 'image', src: '/hero/star-small.svg', bgSize: '100% 100%',
        x: 1632, y: 516, rotate: 0, w: 37, h: 33, twist: true },
      { id: 'rush', kind: 'legend', text: 'rush', fill: FILL.orange,
        x: 193, y: 255, rotate: 5.13 },
      { id: 'saw', kind: 'legend', text: 'what we saw', fill: FILL.lilac, small: true,
        x: 1566, y: 356, rotate: 5.13 },
      { id: 'pressure', kind: 'legend', text: 'pressure', fill: FILL.yellow,
        x: 286, y: 324, rotate: -13.15 },
      { id: 'why', kind: 'legend', text: 'why it happens', fill: FILL.sticker, small: true,
        x: 1659, y: 425, rotate: -13.15 },
      { id: 'ask', kind: 'image', src: '/hero/read-ask.png',
        x: -18.34, y: 157.35, rotate: -8.65, w: 345.41, h: 57.8 },
      { id: 'candidate', kind: 'image', src: '/hero/read-candidate.png',
        x: 67, y: 428, rotate: -5.68, w: 175, h: 28 },
      { id: 'newPattern', kind: 'image', src: '/hero/read-new-pattern.png',
        x: 127, y: 477, rotate: 0, w: 141, h: 28 },
      { id: 'reading', kind: 'reading', value: '0.42', unit: 's', caption: 'release under pressure',
        x: 1658, y: 199, rotate: -4.47, w: 165 },
      { id: 'session', kind: 'badge', text: 'Session 14', fill: FILL.lilac, ink: INK.onLilac,
        x: 1857, y: 47, rotate: -5.8 },
      { id: 'focus', kind: 'label', text: 'Focus',
        x: 1570, y: 98, rotate: 4.33, w: 48 },
      { id: 'starLarge', kind: 'image', src: '/hero/star-large.svg', bgSize: '100% 100%',
        x: 79, y: -27, rotate: 16.39, w: 34, h: 40, twist: true },
    ]),
  }),
]);

/** the sentence around the switching words, and the words themselves */
export const HERO_LEAD = 'Now you can';
export const HERO_TAIL = 'yourself';
/** what a screen reader is given instead of thirteen coloured spans */
export const HERO_SENTENCE = `${HERO_LEAD} ${SCENES.map((s) => s.word).join(', ').replace(/, ([^,]*)$/, ' & $1')} ${HERO_TAIL}`;

/** every picture the scenes will ever need, fetched once and deduped */
export const HERO_PRELOAD: readonly string[] = Object.freeze([
  ...new Set(
    SCENES.flatMap((s) => [s.shot, ...s.stickers.flatMap((k) => (k.kind === 'image' ? [k.src] : []))]),
  ),
]);

/** the state the cycle rests on between runs: every word in ink */
export const NEUTRAL = -1;
