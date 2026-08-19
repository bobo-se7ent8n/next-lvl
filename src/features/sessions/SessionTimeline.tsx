import { useCallback, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { clamp, project, smoothPath } from '../../lib/chart';
import { Label, Text } from '../../components/primitives/Text';
import { dataInk } from '../../lib/color';
import { PHASE_SPANS } from '../../lib/pose';
import { colorData } from '../../tokens';
import type { Moment } from '../../data/moments';
import { TIMELINE_TRACKS } from '../../data/moments';
import { INSIGHT_WINDOW } from './SessionInsights';
import styles from './SessionTimeline.module.css';

/** the phases cycle through the AERA palette so the segments read
 *  apart from one another without carrying any judgement */
const PHASE_TONES = ['blue', 'lilac', 'mint', 'yellow', 'orange'] as const;

export interface SessionTimelineProps {
  moment: Moment;
  /** 0..1 along the moment — the same value the stage scrubber holds */
  playhead: number;
  onScrub: (next: number) => void;
  className?: string;
}

/** four tracks, one time axis, one playhead. Which insight is current
 *  is not a separate piece of state: it is wherever the playhead is
 *  standing, which is the same rule the blocks underneath follow. */
export function SessionTimeline({ moment, playhead, onScrub, className }: SessionTimelineProps) {
  const scrubTo = useCallback(
    (clientX: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      onScrub(clamp((clientX - rect.left) / rect.width, 0, 1));
    },
    [onScrub],
  );

  /* barely smoothed: the whole point of this trace is the events in
     it — the spike into the closeout, the flat stretch where the
     breath is held, and the slow decay after the shot. A heavy
     smoothing pass turned all three into one soft hill. */
  const wave = project(moment.physiology, 100, 26, 3);

  return (
    <div className={cx(styles.timeline, className)}>
      <div className={styles.head}>
        <Label tone="secondary">Timeline · {moment.timestamp}</Label>
        <Text as="span" variant="bodySM" tone="tertiary">
          drag any track to scrub · the block below is whichever insight the playhead is standing on
        </Text>
      </div>

      <div className={styles.tracks}>
        {/* motion · pose — segment widths are the real phase durations */}
        <Label tone="tertiary" className={styles.trackName}>
          {TIMELINE_TRACKS[0].label}
        </Label>
        <div
          className={styles.lane}
          style={{ '--lane-h': 'var(--aera-space-12)' } as CSSProperties}
          onPointerDown={(e) => scrubTo(e.clientX, e.currentTarget)}
          onPointerMove={(e) => e.buttons === 1 && scrubTo(e.clientX, e.currentTarget)}
        >
          {PHASE_SPANS.map((phase, i) => {
            const tone = PHASE_TONES[i % PHASE_TONES.length];
            return (
              <span
                key={phase.id}
                className={styles.phase}
                style={
                  {
                    '--from': `${(phase.from * 100).toFixed(2)}%`,
                    '--w': `${(phase.share * 100).toFixed(2)}%`,
                    '--phase-bg': colorData[tone],
                    '--phase-ink': dataInk(tone),
                  } as CSSProperties
                }
              >
                <Label tone="inherit">{phase.label}</Label>
              </span>
            );
          })}
        </div>

        {/* opponents — a field of small round dots, dense at contact
            and thinning as separation opens back up */}
        <Label tone="tertiary" className={styles.trackName}>
          {TIMELINE_TRACKS[1].label}
        </Label>
        <div
          className={styles.lane}
          style={{ '--lane-h': 'var(--aera-space-13)' } as CSSProperties}
          onPointerDown={(e) => scrubTo(e.clientX, e.currentTarget)}
          onPointerMove={(e) => e.buttons === 1 && scrubTo(e.clientX, e.currentTarget)}
        >
          {/* no viewBox: the dots are placed in percentages and drawn
              at a fixed radius, so they stay round however wide the
              lane gets. A stretched viewBox turned them into smears. */}
          <svg className={styles.field} aria-hidden="true">
            {moment.lidar.map((p, i) => (
              <circle
                key={i}
                cx={`${(p.t * 100).toFixed(3)}%`}
                cy={`${(p.y * 92 + 4).toFixed(2)}%`}
                r="2.1"
                fill={colorData.orange}
                opacity={p.weight.toFixed(2)}
              />
            ))}
          </svg>
        </div>

        {/* physiology — a trace with a spike, a held breath and a decay */}
        <Label tone="tertiary" className={styles.trackName}>
          {TIMELINE_TRACKS[2].label}
        </Label>
        <div
          className={styles.lane}
          style={{ '--lane-h': 'var(--aera-space-13)' } as CSSProperties}
          onPointerDown={(e) => scrubTo(e.clientX, e.currentTarget)}
          onPointerMove={(e) => e.buttons === 1 && scrubTo(e.clientX, e.currentTarget)}
        >
          <svg className={styles.field} viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
            <path
              d={smoothPath(wave, 0.18)}
              fill="none"
              stroke={colorData.mint}
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* insights — labelled markers */}
        <Label tone="tertiary" className={styles.trackName}>
          {TIMELINE_TRACKS[3].label}
        </Label>
        <div
          className={cx(styles.lane, styles.laneOpen)}
          style={{ '--lane-h': 'var(--aera-space-13)' } as CSSProperties}
          onPointerDown={(e) => scrubTo(e.clientX, e.currentTarget)}
        >
          {moment.insights.map((insight) => (
            <button
              key={insight.id}
              type="button"
              className={cx(
                styles.marker,
                Math.abs(playhead - insight.at) <= INSIGHT_WINDOW && styles.markerOn,
              )}
              style={{ '--x': `${(insight.at * 100).toFixed(2)}%` } as CSSProperties}
              onClick={(e) => {
                e.stopPropagation();
                onScrub(insight.at);
              }}
            >
              <Label tone="inherit">{insight.title}</Label>
            </button>
          ))}
        </div>

        <div className={styles.playfield} aria-hidden="true">
          <span
            className={styles.playhead}
            style={{ '--x': `${(playhead * 100).toFixed(2)}%` } as CSSProperties}
          />
        </div>
      </div>
    </div>
  );
}
