import { SESSIONS } from '../../data/sessions';
import { ROUTES, sessionPath } from '../../app/routes';
import type { DataTone } from '../../tokens';
import type { Pattern } from '../../data/types';

/* ============================================================
   WHERE A PATTERN CAME FROM

   A pattern is a claim about your own data, and the panel that
   opens it has to say where the claim came from and take you
   there. That source is not always a session: some patterns are
   measured across a scoreboard block, some only exist as a run of
   library items.

   The chip used to read "Linked session" in lilac on every card
   regardless — the right shape with the wrong fact in it, which is
   worse than no chip. One function decides the label, the tone, the
   destination and the button's wording together, so the four can
   never disagree with each other again.

   PRECEDENCE is most-specific-first: a named session beats a
   scoreboard block, which beats the library.
   ============================================================ */

export type SourceKind = 'session' | 'scoreboard' | 'insights';

export interface PatternSource {
  kind: SourceKind;
  /** the chip's words */
  label: string;
  /** the chip's colour, from the data palette */
  tone: DataTone;
  /** where the button goes */
  to: string;
  /** the button's words */
  action: string;
  /** the line under the chip — which session, block or item */
  name: string;
  /** shown only when the source carries one */
  date?: string;
  /** the inline readings, only a session has them */
  stats?: Array<{ label: string; value: number }>;
  /** the caption under the button */
  caption: string;
}

export function patternSource(pattern: Pattern): PatternSource {
  if (pattern.sessionIndex !== undefined && SESSIONS[pattern.sessionIndex]) {
    const s = SESSIONS[pattern.sessionIndex];
    return {
      kind: 'session',
      label: 'Linked session',
      tone: 'lilac',
      to: sessionPath(s.id),
      action: 'Open the session',
      name: s.title,
      date: s.date,
      stats: [
        { label: 'shots', value: s.shots },
        { label: 'pts', value: s.pts },
        { label: 'minutes', value: Number.parseInt(s.duration, 10) || 0 },
      ],
      caption: pattern.context,
    };
  }

  if (pattern.scoreboardBlock) {
    return {
      kind: 'scoreboard',
      label: 'On the scoreboard',
      tone: 'mint',
      to: ROUTES.scoreboard,
      action: 'Open the scoreboard',
      name: pattern.scoreboardBlock,
      caption: pattern.context,
    };
  }

  return {
    kind: 'insights',
    label: 'In the library',
    tone: 'blue',
    to: ROUTES.insights,
    action: 'Open the library',
    name: pattern.insightTitles[0] ?? 'Related reading',
    caption: pattern.context,
  };
}
