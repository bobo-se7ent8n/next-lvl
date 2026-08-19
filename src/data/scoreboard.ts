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
    { id: 'arc', label: 'Arc angle', value: '46', unit: '°' },
    { id: 'release', label: 'Release time', value: '0.58', unit: 's' },
    { id: 'consistency', label: 'Motion consistency', value: '81', unit: '/ 100' },
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
    { label: 'Balance', value: 58 },
  ],
};

export const SKILL_AVERAGE = 70;

/* one line at column width — the two-line version cost the card the
   room its last rating row needed */
export const SKILL_SOURCE = 'on-device pose, ball and inertial data · sessions 9–14';

/* ------------------------------------------------------------
   WHERE TO WORK NEXT — one item. Three was a list, and a list on
   this screen reads as a ranking. There is no intro line and no
   share note either: at tile size there is no room for prose, and
   the tile is not the place that claim belongs.
   ------------------------------------------------------------ */
/* The one thing worth working on. It is a rating like any other —
   same label, same 0–100 bar, same right-aligned reading — because
   it IS one of the ratings above, singled out. Styling it as a
   display number made it read as a separate kind of measurement. */
export const WHERE_NEXT = {
  label: 'Balance',
  value: 58,
  text: 'The lowest movement rating. It moves with late-session fatigue, not with anything technical.',
};
