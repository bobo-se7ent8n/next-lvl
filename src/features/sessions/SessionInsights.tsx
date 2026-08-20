import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/css';
import { Chip } from '../../components/primitives/Chip';
import { Label, Text } from '../../components/primitives/Text';
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
  const shown = insights.filter((insight) => Math.abs(playhead - insight.at) <= INSIGHT_WINDOW);

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
            style={
              {
                '--notch': `calc(${TRACK_INSET} + (100% - ${TRACK_INSET}) * ${insight.at.toFixed(4)})`,
              } as CSSProperties
            }
          >
            <span className={styles.notch} aria-hidden="true" />
            {/* the chips sit in their own row above the title. They
                used to share a grid column with it, which is what put
                PATTERN CANDIDATE straight through the heading. */}
            <div className={styles.tags}>
              <Chip tone="lilac">Pattern candidate</Chip>
              <Label tone="tertiary">{insight.pattern}</Label>
            </div>

            <Text variant="body" className={styles.title}>
              {insight.title}
            </Text>
            <Text variant="bodySM" tone="secondary">
              {insight.line}
            </Text>

            <span className={styles.go}>
              <Label tone="inherit">Open the insight</Label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </Link>
        ))
      ) : null}
    </div>
  );
}
