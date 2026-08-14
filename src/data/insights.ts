import type { Insight } from './types';

/* The library is pulled from, never pushed. Nothing here is
   recommended, ranked, or marked as urgent. */
export const INSIGHTS: Insight[] = [
  {
    id: 'breath',
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
    title: 'Film · pressure possessions',
    kind: 'VIDEO',
    duration: '9 min',
    side: 'on',
    ratio: '3 / 2',
    desc: 'Eleven possessions from the last two scrimmages, cut to the moment the defender arrives.',
  },
  {
    id: 'handle-fatigue',
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
    title: 'Pre-game reset routine',
    kind: 'LESSON',
    duration: '5 min',
    side: 'off',
    ratio: '5 / 4',
    desc: 'A short sequence for the ten minutes before tip.',
  },
  {
    id: 'sleep',
    title: 'Sleep & decision speed',
    kind: 'VIDEO',
    duration: '11 min',
    side: 'off',
    ratio: '16 / 9',
    desc: 'What a short night does to the first pass out of a double team.',
  },
  {
    id: 'ladder',
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
