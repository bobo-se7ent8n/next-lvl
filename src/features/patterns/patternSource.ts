import { SESSIONS } from '../../data/sessions';
import { ROUTES, sessionPath } from '../../app/routes';
import type { Pattern } from '../../data/types';

/* ============================================================
   WHERE A PATTERN CAME FROM

   A pattern is a claim about your own data, and the panel that
   opens it has to say where the claim came from and take you
   there. That source is not always a session: some patterns are
   measured across a scoreboard block, some only exist as a run of
   library items.

   There used to be a chip on top of this block naming the kind of
   source — "On the scoreboard", in white, directly above a button
   reading "Open the scoreboard". A label naming the thing the
   control under it already names. The chip is gone and the button
   carries the fact, but the resolver stays: one function decides
   the destination, the name and the button's wording together, so
   the three can never disagree with each other.

   PRECEDENCE is most-specific-first: a named session beats a
   scoreboard block, which beats the library.
   ============================================================ */

export type SourceKind = 'session' | 'scoreboard' | 'insights';

export interface PatternSource {
  kind: SourceKind;
  /** where the button goes */
  to: string;
  /** the button's words */
  action: string;
  /** the line at the top of the block — which session, block or item */
  name: string;
  /** shown only when the source carries one */
  date?: string;
  /** the inline readings, only a session has them */
  stats?: Array<{ label: string; value: number }>;
}

export function patternSource(pattern: Pattern): PatternSource {
  if (pattern.sessionIndex !== undefined && SESSIONS[pattern.sessionIndex]) {
    const s = SESSIONS[pattern.sessionIndex];
    return {
      kind: 'session',
      to: sessionPath(s.id),
      action: 'Open the session',
      name: s.title,
      date: s.date,
      stats: [
        { label: 'shots', value: s.shots },
        { label: 'pts', value: s.pts },
        { label: 'minutes', value: Number.parseInt(s.duration, 10) || 0 },
      ],
    };
  }

  if (pattern.scoreboardBlock) {
    return {
      kind: 'scoreboard',
      to: ROUTES.scoreboard,
      action: 'Open the scoreboard',
      name: pattern.scoreboardBlock,
    };
  }

  return {
    kind: 'insights',
    to: ROUTES.insights,
    action: 'Open the library',
    name: pattern.insightTitles[0] ?? 'Related reading',
  };
}
