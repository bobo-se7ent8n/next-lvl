import type { DataTone } from '../tokens';
import type { DotPattern } from '../lib/dotField';

export type PatternState = 'improving' | 'steady' | 'new' | 'declining';

/** how a pattern's compact viz is drawn on the card front */
export type VizKind = 'sparkline' | 'bars' | 'dots';

export interface SeriesPoint {
  label: string;
  value: number;
  tone: DataTone;
}

export interface Pattern {
  id: string;
  name: string;
  state: PatternState;
  /** MEASURED or SCORE — how the number was arrived at */
  kind: 'Measured' | 'Score';
  hero: string;
  unit: string;
  tone: DataTone;
  /** the card face colour */
  fill: string;
  /** one neutral sentence about direction. Never praise, never blame. */
  trend: string;
  /** what the sensors actually recorded */
  measured: string;
  /** the longer read, shown only in the expanded state */
  body: string;
  context: string;
  viz: VizKind;
  series: number[];
  bars: SeriesPoint[];
  history: Array<{ label: string; value: string; pct: number }>;
  /** index into SESSIONS, when this pattern was measured on one */
  sessionIndex?: number;
  /** insight titles this pattern points at */
  insightTitles: string[];
  /** the scoreboard block this pattern is visible in, if any */
  scoreboardBlock?: string;
}

export interface Vital {
  id: string;
  label: string;
  category: 'Measured' | 'Score';
  value: string;
  unit: string;
  desc: string;
  tone: DataTone;
  chart:
    | { type: 'line' | 'area'; tone: DataTone; values: number[] }
    | { type: 'bars'; items: SeriesPoint[] };
  legend?: Array<{ tone: DataTone; label: string; value: string }>;
}

export interface Session {
  id: string;
  date: string;
  title: string;
  duration: string;
  shots: number;
  pts: number;
  reb: number;
  ast: number;
  to: number;
  stl: number;
  tag?: string;
  candidate?: { title: string; desc: string };
  /** Stats for a session that is not a game. A solo shooting hour has
   *  no points, rebounds or assists, so the game stat run collapses
   *  to nothing and the card reads as broken; these are what that
   *  session actually measured instead. */
  extra?: Array<{ label: string; value: string | number }>;
  note: string;
}

export interface Insight {
  id: string;
  title: string;
  kind: 'DRILL' | 'LESSON' | 'VIDEO';
  duration: string;
  side: 'on' | 'off';
  pattern?: string;
  desc: string;
  ratio: string;
  /** which dot-matrix metaphor stands in for this item's subject */
  graphic: DotPattern;
}

export interface FocusStep {
  label: string;
  tone: DataTone;
  text: string;
}
