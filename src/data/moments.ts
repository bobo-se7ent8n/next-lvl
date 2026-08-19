/* ============================================================
   MOMENTS

   A session detail is built around five moments. The motion
   itself is not stored here — it is generated from the pose model
   in lib/pose.ts, so the figure on the stage really moves as the
   playhead moves rather than being a frozen cloud.

   What lives here is everything the timeline reads: the opponent
   density field, the physiology trace with its real events, and
   the insight lines that tie the moment back to a pattern
   candidate. All of it is seeded, so a moment looks the same
   every time it is opened.
   ============================================================ */

import { seeded } from '../lib/chart';
import { separationAt } from '../lib/pose';

export type { PointGroup } from '../lib/pose';

export interface LidarPoint {
  /** 0..1 along the moment */
  t: number;
  /** 0..1 up the lane */
  y: number;
  /** 0..1 — how strong the return is */
  weight: number;
}

export interface MomentInsight {
  id: string;
  /** 0..1 along the moment — where the playhead surfaces it */
  at: number;
  title: string;
  /** the one line that sits below the timeline */
  line: string;
  /** the pattern candidate this is evidence for */
  pattern: string;
  /** the library item it routes through to */
  insightId: string;
}

export interface Moment {
  id: string;
  index: number;
  /** the session clock, as it reads in the corner of the stage */
  timestamp: string;
  title: string;
  /** how long the moment runs, in seconds — the transport uses it */
  seconds: number;
  insights: MomentInsight[];
  lidar: LidarPoint[];
  /** the physiology trace, 0..1, one sample per 1% of the moment */
  physiology: number[];
}

/* ------------------------------------------------------------
   LIDAR — a density field rather than a row of evenly spaced
   dots. The cloud thickens where an opponent is in contact and
   thins out as separation opens back up.
   ------------------------------------------------------------ */
function lidarField(seed: number): LidarPoint[] {
  const rand = seeded(seed);
  const points: LidarPoint[] = [];
  const COLUMNS = 64;
  for (let c = 0; c < COLUMNS; c++) {
    const t = c / (COLUMNS - 1);
    /* contact is the inverse of separation, so the field is at its
       densest exactly where the closeout arrives */
    const contact = 1 - separationAt(t);
    const count = Math.round(1 + contact * 6 + rand() * 2);
    for (let i = 0; i < count; i++) {
      points.push({
        t: t + (rand() - 0.5) * 0.008,
        y: 0.5 + (rand() - 0.5) * (1.05 - contact * 0.62),
        weight: 0.3 + contact * 0.6 + rand() * 0.2,
      });
    }
  }
  return points;
}

/* ------------------------------------------------------------
   PHYSIOLOGY — a trace with events in it, and the events are
   what the track is for:

     · a working baseline, with the breath cycle visible in it
     · a stress spike as the defender arrives
     · a HELD BREATH through the gather, where the trace goes
       genuinely flat — it holds the level it arrived at rather
       than merely losing its tremor, which is what made the hold
       invisible under the rising spike
     · a recovery decay once the shot is away

   A smooth sine showed none of this, and neither did a version
   where all four were summed on top of one another.
   ------------------------------------------------------------ */
const HOLD = { from: 0.34, to: 0.5 };

function physiologyTrace(seed: number, lift: number): number[] {
  const rand = seeded(seed);
  const N = 100;

  /* the signal, before the hold is applied */
  const signal = (t: number) => {
    const baseline = 0.3 + lift;
    /* the breath cycle — small, regular, and always there */
    const breath = 0.05 * Math.sin(t * 34);
    /* arousal climbs into the closeout and peaks just before release */
    const spike = 0.5 * Math.exp(-(((t - 0.54) / 0.075) ** 2));
    /* and then comes down slowly rather than snapping back */
    const recovery = t > 0.62 ? -0.3 * (1 - Math.exp(-(t - 0.62) * 6)) : 0;
    return baseline + breath + spike + recovery;
  };

  const heldLevel = signal(HOLD.from);
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const inHold = t >= HOLD.from && t <= HOLD.to;
    /* nothing moves through the hold: no breath, no tremor, no climb */
    const value = inHold ? heldLevel : signal(t) + (rand() - 0.5) * 0.026;
    out.push(Math.max(0.04, Math.min(0.98, value)));
  }
  return out;
}

const COPY: Array<{
  timestamp: string;
  title: string;
  seconds: number;
  insights: Array<Omit<MomentInsight, 'id'>>;
}> = [
  {
    timestamp: '00:11:24',
    title: 'Left wing catch, late closeout',
    seconds: 4.2,
    insights: [
      {
        at: 0.46,
        title: 'Release change under closeout',
        line: 'The gather starts before the feet are set. Release comes in 0.09s under your own baseline.',
        pattern: 'Rushing under pressure',
        insightId: 'closeout',
      },
      {
        at: 0.72,
        title: 'Breath held through the gather',
        line: 'No exhale between the catch and the release. The trace goes flat for 0.4s.',
        pattern: 'Rushing under pressure',
        insightId: 'breath',
      },
    ],
  },
  {
    timestamp: '00:19:03',
    title: 'Drive right, contact finish',
    seconds: 3.6,
    insights: [
      {
        at: 0.58,
        title: 'Balance holds through contact',
        line: 'Contact at the second step, and the landing is still square. Kept as counter-evidence.',
        pattern: 'Balance under load',
        insightId: 'handle-fatigue',
      },
    ],
  },
  {
    timestamp: '00:28:47',
    title: 'Top of key, contested pull-up',
    seconds: 3.9,
    insights: [
      {
        at: 0.5,
        title: 'Gather rhythm holds',
        line: 'The same shot without the quickening. This is what the unpressured rhythm looks like.',
        pattern: 'Rushing under pressure',
        insightId: 'rushing-lesson',
      },
    ],
  },
  {
    timestamp: '00:41:12',
    title: 'Transition, trail three',
    seconds: 3.1,
    insights: [
      {
        at: 0.64,
        title: 'Feet set early',
        line: 'Release time sits inside your unpressured band even with a closeout inbound.',
        pattern: 'Rushing under pressure',
        insightId: 'film-pressure',
      },
    ],
  },
  {
    timestamp: '00:55:38',
    title: 'Late-clock catch, right corner',
    seconds: 4.6,
    insights: [
      {
        at: 0.44,
        title: 'Clock pressure, no defender',
        line: 'The same 0.1s compression with nobody closing out. The clock is enough on its own.',
        pattern: 'Rushing under pressure',
        insightId: 'reset',
      },
    ],
  },
];

export const MOMENTS: Moment[] = COPY.map((copy, i) => ({
  id: `m${i + 1}`,
  index: i,
  timestamp: copy.timestamp,
  title: copy.title,
  seconds: copy.seconds,
  insights: copy.insights.map((ins, k) => ({ ...ins, id: `m${i + 1}-i${k + 1}` })),
  lidar: lidarField(991 + i * 137),
  physiology: physiologyTrace(4409 + i * 211, i * 0.05),
}));

/* The opponents track is called 'Opponents' and nothing else. The
   '· lidar' half was clipped by the track column anyway, and naming
   the sensor was never the point of the row. */
export const TIMELINE_TRACKS = [
  { id: 'motion', label: 'Motion · pose' },
  { id: 'lidar', label: 'Opponents' },
  { id: 'physiology', label: 'Physiology' },
  { id: 'insights', label: 'Insights' },
] as const;
