/* ============================================================
   THE SEEDED SCATTER — AND THE PACKING.

   Nothing on this page is random at render time. A word tag's
   position, its scale, its rotation and its colour are all derived
   from a hash of the word itself, so the entry sequence is
   identical on every reload and identical between two people
   looking at it side by side.

   `Math.random()` in a render is what this exists to prevent: it
   makes a layout that cannot be reviewed, cannot be screenshotted
   twice, and re-shuffles itself on every React re-render.

   THE FIELD IS PACKED, NOT SCATTERED.

   A hash gives you a repeatable position; it does not give you a
   GOOD one. At thirty-eight tags a straight seeded scatter puts
   words on top of each other several times over, and puts two or
   three of them across the headline — which is the one thing on the
   page the field exists to frame rather than cover.

   So the coordinates below are solved rather than drawn. Each tag
   takes candidate positions from its own seeded stream and keeps
   the first that clears (a) every box already placed, by a real
   gap, and (b) the keep-out around whatever is in the middle of
   that state — the white card on the dark state, the headline on
   the light one. A tag that cannot find room shrinks a step and
   tries again; one that still cannot is dropped rather than
   overlapped, because a missing word is invisible and a collision
   is not.

   It is solved ONCE, at module load, against a reference window —
   the packer needs box sizes and there is no DOM yet, so a tag's
   width is estimated from its character count. The result is a set
   of fractions, so it holds its shape at any window size; the gaps
   breathe with the aspect ratio, which is the one thing that does
   vary.
   ============================================================ */

import { colorTag, scatter, type TagTone } from '../../tokens';
import { TAG_LEAVE, TAG_WORDS } from './copy';

/** a 32-bit hash of a string — the seed for everything below */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** a 0..1 value from a seed and a named axis, so one word can hand
 *  out a dozen independent-looking numbers that never move */
function unit(seed: number, axis: string): number {
  const h = hash(`${seed}:${axis}`);
  return (h % 100000) / 100000;
}

/** a value in a range, from the same seed */
function between(seed: number, axis: string, min: number, max: number): number {
  return min + unit(seed, axis) * (max - min);
}

/* EIGHT FILLS, AND THE COUNT IS THE WHOLE POINT.

   The field is thirty-eight tags. With five fills the sixth tag
   wears the first tag's colour and the eye reads the repeat instead
   of the words; eight is enough that no two neighbours in a scatter
   this dense are likely to match, and every one of them is light
   enough to take the product's own dark ink. See `colorTag` in the
   token file for why they are a group of their own. */
const TAG_FILLS = Object.keys(colorTag) as TagTone[];

export function tagFill(name: TagTone): string {
  return colorTag[name];
}

/* which words do not survive the expansion — a Set, so the lookup
   below is a membership test rather than a scan per tag */
const LEAVES = new Set<string>(TAG_LEAVE);

export interface ScatterTag {
  word: string;
  /** the pastel this tag wears in both states */
  fill: TagTone;
  /** where it sits on the dark state, as viewport fractions */
  x: number;
  y: number;
  /** and where it reflows to once the white has filled the screen */
  lx: number;
  ly: number;
  scale: number;
  rotate: number;
  /** this one scales to zero toward the centre as the white arrives */
  exits: boolean;
  /** its head start in the entrance, 0..1 of one stagger run */
  delay: number;
}

/* ------------------------------------------------------------
   THE PACKER
   ------------------------------------------------------------ */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface KeepOut {
  readonly x: readonly number[];
  readonly y: readonly number[];
}

/** a tag's box in reference pixels, centred on (cx, cy). The width
 *  is estimated from the word's length because the packer runs
 *  before any of this is in a document to measure. */
function boxFor(word: string, scale: number, cx: number, cy: number): Box {
  const w = (word.length * scatter.charW + scatter.padX * 2) * scale;
  const h = scatter.boxH * scale;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** do two boxes come within `gap` of each other */
function collides(a: Box, b: Box, gap: number): boolean {
  return (
    a.x - gap < b.x + b.w &&
    a.x + a.w + gap > b.x &&
    a.y - gap < b.y + b.h &&
    a.y + a.h + gap > b.y
  );
}

/** does a box land inside the middle of the screen, where the card
 *  or the headline is */
function inKeepOut(box: Box, keep: KeepOut): boolean {
  const x0 = keep.x[0] * scatter.refW;
  const x1 = keep.x[1] * scatter.refW;
  const y0 = keep.y[0] * scatter.refH;
  const y1 = keep.y[1] * scatter.refH;
  return box.x < x1 && box.x + box.w > x0 && box.y < y1 && box.y + box.h > y0;
}

interface Seeded {
  word: string;
  seed: number;
  scale: number;
}

/**
 * Solve one state's coordinates for the whole field.
 *
 * Words are placed LONGEST FIRST. A packer that goes in reading
 * order spends its easy early room on three-letter words and then
 * cannot fit `SELF-KNOWLEDGE` anywhere — which is the word most
 * worth keeping. Placing the hardest ones while the field is still
 * empty is the whole trick, and it costs nothing: the order of
 * PLACEMENT has no bearing on the order they are drawn in.
 */
function pack(
  words: Seeded[],
  axis: string,
  keep: KeepOut,
): Map<string, { x: number; y: number; scale: number }> {
  const placed: Box[] = [];
  const out = new Map<string, { x: number; y: number; scale: number }>();
  const order = [...words].sort((a, b) => b.word.length - a.word.length);

  for (const item of order) {
    let found = false;
    /* three passes, each a step smaller — a tag that cannot find
       room at its seeded size is worth more small than absent */
    for (let step = 0; step < 3 && !found; step += 1) {
      const scale = item.scale * (1 - step * 0.16);
      for (let attempt = 0; attempt < scatter.tries; attempt += 1) {
        const cx = between(item.seed, `${axis}x${step}.${attempt}`, 0.04, 0.96) * scatter.refW;
        const cy = between(item.seed, `${axis}y${step}.${attempt}`, 0.05, 0.95) * scatter.refH;
        const box = boxFor(item.word, scale, cx, cy);

        /* inside the window, clear of the middle, clear of everyone */
        if (box.x < 0 || box.y < 0) continue;
        if (box.x + box.w > scatter.refW || box.y + box.h > scatter.refH) continue;
        if (inKeepOut(box, keep)) continue;
        if (placed.some((p) => collides(box, p, scatter.gap))) continue;

        placed.push(box);
        out.set(item.word, { x: cx / scatter.refW, y: cy / scatter.refH, scale });
        found = true;
        break;
      }
    }
  }

  return out;
}

/* the seeded size and character of every word, before placement */
const SEEDS = TAG_WORDS.map((word, i) => {
  const seed = hash(word) + i;
  return {
    word,
    seed,
    fill: TAG_FILLS[hash(`${word}:fill`) % TAG_FILLS.length],
    scale: between(seed, 's', scatter.scaleMin, scatter.scaleMax),
    rotate: between(seed, 'r', -scatter.rotate, scatter.rotate),
    delay: unit(seed, 'd'),
    exits: LEAVES.has(word),
  };
});

/* THE TWO STATES ARE PACKED SEPARATELY, and against different
   keep-outs: the dark state has to clear the white card, the light
   state has to clear the headline. Solving them together would mean
   one arrangement satisfying both constraints at once, which is a
   smaller and more crowded field than either of them needs. */
const DARK = pack(SEEDS, 'd', scatter.keepOutCard);
const LIGHT = pack(
  SEEDS.filter((t) => !t.exits),
  'l',
  scatter.keepOutHead,
);

/**
 * The whole field, built once at module load.
 *
 * A tag the packer could not place in EITHER state is dropped from
 * the set entirely — it would otherwise have to be drawn somewhere,
 * and the only somewhere left is on top of something else.
 */
export const SCATTER_TAGS: ScatterTag[] = SEEDS.flatMap((tag) => {
  const dark = DARK.get(tag.word);
  if (!dark) return [];
  /* a leaver has no light-state home by construction: it collapses
     toward the middle of the window and is gone */
  const light = tag.exits ? dark : LIGHT.get(tag.word);
  if (!light) return [];

  return [
    {
      word: tag.word,
      fill: tag.fill,
      x: dark.x,
      y: dark.y,
      lx: light.x,
      ly: light.y,
      /* the smaller of the two, so a tag never GROWS as it reflows —
         it would then be able to collide in the state it did not
         shrink for */
      scale: Math.min(dark.scale, light.scale),
      rotate: tag.rotate,
      exits: tag.exits,
      delay: tag.delay,
    },
  ];
});

export { hash as seedOf, unit as seedUnit };
