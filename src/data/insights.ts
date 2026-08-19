import type { Insight } from './types';

/* The library is pulled from, never pushed. Nothing here is
   recommended, ranked, or marked as urgent.

   Every card carries a dot-matrix pattern rather than artwork of
   its own: breath is a held gap, closeout reps compress, the
   rushing lesson stalls and resumes, film is a steady field. One
   system, never a per-type illustration style. */
export const INSIGHTS: Insight[] = [
  {
    id: 'breath',
    graphic: 'hold',
    title: 'Breath before the gather',
    kind: 'DRILL',
    duration: '8 min',
    side: 'on',
    pattern: 'rushing under pressure',
    ratio: '16 / 9',
    desc: 'One beat of air before the gather, run as a full set. The cue is the only thing that changes.',
  },
  {
    id: 'closeout',
    graphic: 'compress',
    title: 'Closeout release reps',
    kind: 'DRILL',
    duration: '12 min',
    side: 'on',
    pattern: 'rushing under pressure',
    ratio: '4 / 3',
    desc: 'Live closeouts at game speed, release timed on every rep.',
  },
  {
    id: 'rushing-lesson',
    graphic: 'stall',
    title: 'What rushing feels like',
    kind: 'LESSON',
    duration: '6 min',
    side: 'off',
    pattern: 'rushing under pressure',
    ratio: '16 / 10',
    desc: 'Naming the sensation before it becomes a miss — a short read on urgency and where it comes from.',
  },
  {
    id: 'film-pressure',
    graphic: 'steady',
    title: 'Film · pressure possessions',
    kind: 'VIDEO',
    duration: '9 min',
    side: 'on',
    ratio: '3 / 2',
    desc: 'Eleven possessions from the last two scrimmages, cut to the moment the defender arrives.',
  },
  {
    id: 'handle-fatigue',
    graphic: 'disperse',
    title: 'Handle under fatigue',
    kind: 'DRILL',
    duration: '10 min',
    side: 'on',
    pattern: 'handle tightens late',
    ratio: '16 / 7',
    desc: 'Late-session ball work at the point where variance starts to climb.',
  },
  {
    id: 'reset',
    graphic: 'hold',
    title: 'Pre-game reset routine',
    kind: 'LESSON',
    duration: '5 min',
    side: 'off',
    ratio: '5 / 4',
    desc: 'A short sequence for the ten minutes before tip.',
  },
  {
    id: 'sleep',
    graphic: 'steady',
    title: 'Sleep & decision speed',
    kind: 'VIDEO',
    duration: '11 min',
    side: 'off',
    ratio: '16 / 9',
    desc: 'What a short night does to the first pass out of a double team.',
  },
  {
    id: 'ladder',
    graphic: 'compress',
    title: 'Two-ball dribble ladder',
    kind: 'DRILL',
    duration: '9 min',
    side: 'on',
    ratio: '4 / 3',
    desc: 'Hands and eyes separated, building tolerance for late-session load.',
  },
];

export const ASK_SEEDS = [
  'why do I rush under pressure?',
  'what should I work on this week?',
  'how is my handle late in sessions?',
];
