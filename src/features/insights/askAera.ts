import { INSIGHTS } from '../../data/insights';
import { PATTERNS, STATE_LABEL } from '../../data/patterns';
import { SESSIONS, sessionLabel } from '../../data/sessions';

export interface AskAnswer {
  text: string;
  source: string;
}

/* Answers are assembled from the user's own patterns and sessions.
   Nothing is fetched, nothing is inferred from anybody else's data,
   and nothing is offered unless it was asked for. */
export function askAera(question: string): AskAnswer {
  const terms = question
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  let best = null as (typeof PATTERNS)[number] | null;
  let bestScore = 0;

  for (const pattern of PATTERNS) {
    const hay = `${pattern.name} ${pattern.context} ${pattern.kind}`.toLowerCase();
    const score = terms.reduce((a, t) => a + (hay.includes(t) ? 2 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = pattern;
    }
  }

  if (best) {
    const related =
      INSIGHTS.find((i) => best!.insightTitles.includes(i.title)) ??
      INSIGHTS.find((i) => i.pattern);
    return {
      text:
        `Your own data has this as ${best.name.toLowerCase()} — currently ${best.hero} ${best.unit}, ` +
        `${best.context}. It reads as ${STATE_LABEL[best.state].toLowerCase()}.` +
        (related ? ` Closest thing in the library: ${related.title} (${related.duration}).` : ''),
      source: `from your patterns · sessions 9 → 14`,
    };
  }

  const s = SESSIONS[0];
  return {
    text:
      `Nothing in your patterns matches that directly. The most recent thing measured is ` +
      `${sessionLabel(s).toLowerCase()} — ${s.shots} shots over ${s.duration}` +
      (s.candidate ? `, with a candidate forming: ${s.candidate.title.toLowerCase()}.` : '.'),
    source: 'from your sessions · on-device',
  };
}
