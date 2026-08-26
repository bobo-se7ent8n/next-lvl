import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/css';
import { Chip } from '../../components/primitives/Chip';
import { Text } from '../../components/primitives/Text';
import { ROUTES } from '../../app/routes';
import type { MomentInsight } from '../../data/moments';
import styles from './SessionInsights.module.css';

/** how close the playhead has to be for a block to be on screen */
export const INSIGHT_WINDOW = 0.07;

export interface SessionInsightsProps {
  insights: MomentInsight[];
  /** 0..1 along the moment */
  playhead: number;
  className?: string;
}

/** Where the lane the markers stand in actually begins. The track
 *  area starts one label column plus one gap in from the card edge,
 *  so a marker at `t` along the lane is at that inset plus `t` of
 *  whatever is left — which is the x the bubble has to centre on. */
const TRACK_INSET = 'calc(var(--aera-space-16) + var(--aera-space-8))';

/** the centre of the marker an insight belongs to, as a length the
 *  bubble can be positioned from */
function markerX(at: number): string {
  return `calc(${TRACK_INSET} + (100% - ${TRACK_INSET}) * ${at.toFixed(4)})`;
}

/** The block under the timeline. Exactly one is on screen at a time —
 *  the one the playhead is standing on — rather than all of them at
 *  once with the unreached ones greyed out. Clicking the description
 *  goes through to the full insight in the library. */
export function SessionInsights({ insights, playhead, className }: SessionInsightsProps) {
  /* ONLY ONE. The nearest insight inside the window, never all of
     the ones that happen to fall inside it — two open bubbles would
     both claim to be the thing the playhead is standing on. */
  const nearest = insights
    .filter((insight) => Math.abs(playhead - insight.at) <= INSIGHT_WINDOW)
    .sort((a, b) => Math.abs(playhead - a.at) - Math.abs(playhead - b.at));
  const shown = nearest.slice(0, 1);

  return (
    <div className={cx(styles.list, className)}>
      {shown.length ? (
        shown.map((insight) => (
          <Link
            key={insight.id}
            to={`${ROUTES.insights}#${insight.insightId}`}
            className={styles.block}
            /* THE BUBBLE IS CENTRED ON ITS OWN MARKER, and the
               centring is done by the bubble's OWN width.

               It used to be pushed left by half of
               `--aera-layout-insight-bubble` — the CAP on the width,
               not the width. A bubble whose text did not reach the cap
               is narrower than that, so every short one sat left of the
               marker it belonged to, by half the difference. Anchoring
               the left edge on the marker and translating back by half
               of `100%` uses the width the bubble actually has, which
               is also what puts the notch — dead centre of the bubble —
               under the marker rather than beside it. */
            style={{ left: markerX(insight.at) } as CSSProperties}
          >
            <span className={styles.notch} aria-hidden="true" />
            {/* TWO LINES, AND NOTHING ELSE. Heading and tag share the
                first; the description sits under them. The pattern
                name, and the "open the insight" footer, are both gone
                — the whole block is the link, so a second affordance
                inside it was saying the same thing twice. */}
            <div className={styles.tags}>
              <Text variant="bodyStrong" className={styles.title}>
                {insight.title}
              </Text>
              <Chip tone="lilac">Pattern candidate</Chip>
            </div>

            {/* TWO LINES, HARD. The bubble's ceiling — and therefore
                the height of the band it opens into — is measured for
                two lines of this, so a third would push the bubble
                through the bottom of the band it was sized for. */}
            <Text variant="bodySM" tone="secondary" lines={2}>
              {insight.line}
            </Text>
          </Link>
        ))
      ) : null}
    </div>
  );
}
