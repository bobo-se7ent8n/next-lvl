import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { inkOn, mix, tintOf } from '../../lib/color';
import { Card } from '../../components/primitives/Card';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { Sparkline } from '../../components/viz/Sparkline';
import { AreaChart } from '../../components/viz/AreaChart';
import { BarSet } from '../../components/viz/BarSet';
import { STATE_LABEL } from '../../data/patterns';
import type { Pattern } from '../../data/types';
import styles from './PatternExpanded.module.css';

export interface PatternExpandedProps {
  pattern: Pattern;
  onClose: () => void;
  /** the three places a pattern can be followed out to */
  onOpenSessions?: (sessionIndex?: number) => void;
  onOpenInsights?: (insightTitle?: string) => void;
  onOpenScoreboard?: () => void;
  className?: string;
  style?: CSSProperties;
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

/** the opened pattern. Everything the card front leaves out lives here:
 *  the full viz, what was measured, the longer read, and the only links
 *  out to Sessions, Insights and the Scoreboard. */
export function PatternExpanded({
  pattern,
  onClose,
  onOpenSessions,
  onOpenInsights,
  onOpenScoreboard,
  className,
  style,
}: PatternExpandedProps) {
  const ink = inkOn(pattern.fill);
  const mark = mix(pattern.fill, ink, 0.45);
  const tint = tintOf(pattern.fill);

  return (
    <Card
      face={pattern.fill}
      radius="shell"
      elevation="overlay"
      padding="0"
      className={cx(styles.panel, className)}
      style={{ color: ink, ...style }}
    >
      <div className={styles.scroll}>
        <div className={styles.top}>
          <div>
            <Label tone="inherit">
              {pattern.kind} · {STATE_LABEL[pattern.state]}
            </Label>
            <Display size="lg" as="h2" tone="inherit">
              {pattern.name}
            </Display>
            <Text variant="bodySM" tone="inherit" style={{ opacity: 0.66, marginTop: 'var(--aera-space-4)' }}>
              {pattern.context}
            </Text>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <Metric value={pattern.hero} unit={pattern.unit} size="xl" caption="current value" inherit />

            <div className={styles.measured}>
              <Label tone="inherit" style={{ opacity: 0.7 }}>
                What was measured
              </Label>
              <Text variant="bodySM" tone="inherit">
                {pattern.measured}
              </Text>
            </div>

            <Text variant="bodySM" tone="inherit" style={{ opacity: 0.82 }}>
              {pattern.body}
            </Text>
          </div>

          <div className={styles.column}>
            {pattern.viz === 'bars' ? (
              <BarSet items={pattern.bars} height={132} showLabels face={pattern.fill} inherit />
            ) : pattern.viz === 'dots' ? (
              <AreaChart values={pattern.series} color={mark} height={120} />
            ) : (
              <Sparkline values={pattern.series} color={mark} height={120} weight={3} />
            )}

            <div>
              <Label tone="inherit" style={{ opacity: 0.66 }}>
                Full history · confirmed across sessions
              </Label>
              <div className={styles.history}>
                {pattern.history.map((row) => (
                  <div key={row.label} className={styles.historyRow}>
                    <Text as="span" variant="bodyXS" tone="inherit" className={styles.historyName}>
                      {row.label}
                    </Text>
                    <span className={styles.historyBar}>
                      <i
                        className={styles.historyFill}
                        style={
                          {
                            '--w': `${Math.max(4, Math.min(100, row.pct))}%`,
                            '--fill': tint,
                          } as CSSProperties
                        }
                      />
                    </span>
                    <Text
                      as="span"
                      variant="metricSM"
                      tone="inherit"
                      numeric
                      className={styles.historyValue}
                    >
                      {row.value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.links}>
          {onOpenSessions ? (
            <button type="button" className={styles.link} onClick={() => onOpenSessions(pattern.sessionIndex)}>
              {pattern.sessionIndex != null ? 'Open the linked session' : 'See it in Sessions'}
              <ArrowIcon />
            </button>
          ) : null}
          {onOpenInsights ? (
            <button type="button" className={styles.link} onClick={() => onOpenInsights(pattern.insightTitles[0])}>
              {pattern.insightTitles.length
                ? `Insights · ${pattern.insightTitles[0].toLowerCase()}`
                : 'Related insights'}
              <ArrowIcon />
            </button>
          ) : null}
          {onOpenScoreboard && pattern.scoreboardBlock ? (
            <button type="button" className={styles.link} onClick={onOpenScoreboard}>
              Scoreboard · {pattern.scoreboardBlock.toLowerCase()}
              <ArrowIcon />
            </button>
          ) : null}
        </div>

        <Text variant="bodyXS" tone="inherit" className={styles.note}>
          Nothing moves until you press it.
        </Text>
      </div>
    </Card>
  );
}
