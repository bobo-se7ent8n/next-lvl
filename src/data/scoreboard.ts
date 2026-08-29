/* ============================================================
   SCOREBOARD DATA

   Sport statistics only. This is the one part of the product that
   is safe to share — nothing behavioural or physiological appears
   on this screen.
   ============================================================ */

export interface CourtZone {
  id: string;
  label: string;
  short: string;
  makes: number;
  attempts: number;
}

/* The zone list is readings only. Where each zone SITS is court
   geometry and lives in lib/court.ts, so the polygons follow the
   real lines rather than being placed by hand. */
/* TEN ZONES. The paint used to be one region at 38%, which put the
   whole interior in the middle of the ramp and meant the mint end of
   the scale never appeared anywhere on the card — a legend showing a
   colour the graphic never draws is a legend that lies.

   Splitting the rim off from the rest of the paint is also just true:
   a shot at the rim and a shot from the low block are not the same
   shot. The distribution now reads the way a real shot chart reads —
   efficient at the rim, average from mid-range, cold from three. */
export const ZONES: CourtZone[] = [
  /* the interior — the only place the mint end of the ramp appears */
  { id: 'ra', label: 'restricted area', short: 'Rim', makes: 28, attempts: 40 },
  { id: 'paint', label: 'paint', short: 'Paint', makes: 14, attempts: 32 },
  { id: 'ft', label: 'free-throw area', short: 'FT area', makes: 9, attempts: 23 },
  /* mid-range — the middle of the ramp */
  { id: 'midL', label: 'mid-range left', short: 'Mid L', makes: 11, attempts: 28 },
  { id: 'midR', label: 'mid-range right', short: 'Mid R', makes: 14, attempts: 36 },
  /* the perimeter — the cold end */
  { id: 'lc3', label: 'left corner 3', short: 'L corner', makes: 6, attempts: 19 },
  { id: 'rc3', label: 'right corner 3', short: 'R corner', makes: 7, attempts: 22 },
  { id: 'lw3', label: 'left wing 3', short: 'L wing', makes: 10, attempts: 34 },
  { id: 'tk3', label: 'top of key 3', short: 'Top key', makes: 13, attempts: 47 },
  { id: 'rw3', label: 'right wing 3', short: 'R wing', makes: 9, attempts: 31 },
];

export const ZONE_TOTALS = {
  makes: ZONES.reduce((a, z) => a + z.makes, 0),
  attempts: ZONES.reduce((a, z) => a + z.attempts, 0),
};

/* ------------------------------------------------------------
   SHOT MECHANICS — the arc diagram plus the three readings
   ------------------------------------------------------------ */
export const MECHANICS = {
  /* the inputs. Everything drawn — the curve, the apex marker, the
     entry angle — is solved from these four numbers rather than
     placed by eye. See lib/arc.ts. */
  arcAngle: 46,
  releaseHeight: 2.3,
  shotDistance: 6.75,
  rimHeight: 3.05,
  /* label and value only. The explanatory line under each row said
     what the number already said, the footnote ran to two, and the
     quality tick beside each reading was a fourth encoding of the
     same three numbers. */
  rows: [
    /* the degree is a flag, not a unit string: in the unit slot it
       rendered on the baseline behind the slot's own gap — `46 °` */
    { id: 'arc', label: 'Arc angle', value: '46', unit: '', degree: true },
    { id: 'release', label: 'Release time', value: '0.58', unit: 's', degree: false },
    { id: 'consistency', label: 'Motion consistency', value: '81', unit: '/ 100', degree: false },
  ],
  source: '328 tracked shots · sessions 9–14 · on-device',
};

/* ------------------------------------------------------------
   POINTS — one reading with its context. There is no window
   toggle any more: a control on this tile invited comparison,
   and comparison is not what this screen is for. The register is
   flat — notable, never praised, never ranked.
   ------------------------------------------------------------ */
export const POINTS = {
  value: '18',
  unit: 'pts',
  /* ONE mono line. The session meta and the season range used to be
     two rows in the same voice saying two halves of one sentence, and
     the prose paragraph above them said it a third time. */
  caption: 'Apr 12 · Tuesday scrimmage · 62 min · low 11 · high 21',
};

/* ------------------------------------------------------------
   SKILL RATINGS — two groups, every rating derived from sensor
   data rather than entered by anybody. The scale is the player's
   own: there is nobody else in it.
   ------------------------------------------------------------ */
export const SKILLS = {
  shooting: [
    { label: 'Free throw', value: 85 },
    { label: 'Mid-range', value: 73 },
    { label: 'Three-point', value: 61 },
    { label: 'Finishing', value: 66 },
    { label: 'Catch-and-shoot', value: 78 },
    { label: 'Off-dribble', value: 64 },
  ],
  handling: [
    { label: 'Ball handling', value: 69 },
    { label: 'Agility', value: 76 },
    { label: 'First step', value: 74 },
    /* 55, not 58. Every rating on the board is this baseline plus a
       stable per-window shift, so what the card SHOWS is a few
       points off what is written here: at 58 Balance rendered 59 in
       three of the four windows, which is the same number
       Three-point renders — two identical readings side by side in
       one card, and the same pair again in "where to work next".
       55 renders 56 and the collision is gone. */
    { label: 'Balance', value: 55 },
  ],

};

export const SKILL_AVERAGE = 70;

/* one line at column width — the two-line version cost the card the
   room its last rating row needed */
export const SKILL_SOURCE = 'on-device pose, ball and inertial data · sessions 9–14';

/* ------------------------------------------------------------
   WHERE TO WORK NEXT

   Its own card now, and a repeatable list rather than a single
   item. Every entry is a rating from the card above, singled out
   and given a sentence — the sentence says what the number does,
   never what to do about it. Nothing here is an instruction and
   nothing is ranked against anybody.

   NOT WIRED TO ANYTHING. The card on screen does not read this: it
   reads `derive()` in period.ts, which sorts the ten rated skills
   and takes the two lowest for the window, with the sentences from
   WORK_NOTE. This array is the shape that pre-dated that, kept in
   step with SKILLS by hand. If you are changing a rating, the one
   that matters is SKILLS above — this one follows it so the two
   never disagree, and nothing renders if it drifts.
   ------------------------------------------------------------ */
export interface WorkNextEntry {
  label: string;
  value: number;
  note: string;
}

export const WHERE_NEXT: WorkNextEntry[] = [
  {
    label: 'Balance',
    value: 55,
    note: 'The lowest movement rating. It moves with late-session fatigue, not with anything technical.',
  },
  {
    label: 'Three-point',
    value: 61,
    note: 'The lowest shooting rating. It sits lower on right-wing attempts than anywhere else on the floor.',
  },
];

/* ------------------------------------------------------------
   WHERE THE SHOT IS GOING

   The advice block that replaced the points tile. Points was a
   score, and a score is the one thing this product does not keep.
   What is here instead is a trend in the mechanics, stated as an
   observation with its numbers beside it — an experiment to sit
   with, never a directive.
   ------------------------------------------------------------ */
export const SHOT_TREND = {
  meta: 'Apr 12 · Tuesday scrimmage · 62 min',
  heading: 'Arc is tightening',
  /* A READING IS A NUMBER AND ITS UNIT, and nothing else.
     The `label` on each of these used to print a small-caps line
     under the number — ARC ANGLE, RELEASE TIME — saying in six
     letters what the unit beside the number already said in three.
     The trailing `note` sentence went with them: the heading names
     the trend and the numbers carry it, so a sentence restating
     both was the third telling. Figma node 464:8762 has neither. */
  readings: [
    { id: 'arc', value: '+3', unit: 'arc', degree: true },
    { id: 'release', value: '-0.06', unit: 's' },
  ],
};

