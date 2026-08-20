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

/** where the block's notch has to point. The track area starts one
 *  label column plus one gap in from the card edge, so the chip's
 *  position along the lane has to be mapped back onto the block's
 *  own width to line the notch up with it. */
const TRACK_INSET = 'calc(var(--aera-space-16) + var(--aera-space-8))';

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
            /* the notch points at the chip this block belongs to,
               which is at the insight's own position along the lane */
            /* the bubble is pushed along the lane to sit under its own
               tag, and the notch sits at its own left edge — anchored
               to the tag, never centred in the container */
            style={
              {
                left: `calc(${TRACK_INSET} + (100% - ${TRACK_INSET}) * ${insight.at.toFixed(4)} - var(--aera-layout-insight-bubble) / 2)`,
                '--notch': '50%',
              } as CSSProperties
            }
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

            <Text variant="bodySM" tone="secondary">
              {insight.line}
            </Text>
          </Link>
        ))
      ) : null}
    </div>
  );
}
