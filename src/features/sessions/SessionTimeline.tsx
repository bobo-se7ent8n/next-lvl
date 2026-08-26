import { useCallback, useRef, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { clamp, project, smoothPath } from '../../lib/chart';
import { Label } from '../../components/primitives/Text';
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

/** How heavy the physiology trace is drawn, in device pixels — the
 *  stroke is non-scaling, so this is the width on screen whatever the
 *  lane is stretched to. It is the second-heaviest mark on the whole
 *  timeline on purpose: the events in the trace are the reason the
 *  track is there, and at a hairline they read as noise. */
const PHYSIO_STROKE = 4;

export interface SessionTimelineProps {
  moment: Moment;
  /** 0..1 along the moment — the same value the stage scrubber holds */
  playhead: number;
  onScrub: (next: number) => void;
  playing?: boolean;
  onPlay?: () => void;
  className?: string;
}

/** the ruler's minute marks, and the ticks between them */
const RULER_MINUTES = [0, 2, 4, 6, 8, 10, 12];
const RULER_TICKS = 48;

function minuteLabel(m: number): string {
  return `00:${String(m).padStart(2, '0')}:00`;
}

/** four tracks, one time axis, one playhead. Which insight is current
 *  is not a separate piece of state: it is wherever the playhead is
 *  standing, which is the same rule the blocks underneath follow. */
export function SessionTimeline({
  moment,
  playhead,
  onScrub,
  playing,
  onPlay,
  className,
}: SessionTimelineProps) {
  /* THE LANE COLUMN IS THE MEASURING STICK.

     Every track shares one time axis and the playfield spans exactly
     that axis, so it is what a pointer x is resolved against — not
     whichever lane happened to be under the pointer, and certainly
     not the track region itself, which is a label column wider than
     the axis and would map every click a hundred px early. */
  const axis = useRef<HTMLDivElement>(null);

  const scrubTo = useCallback(
    (clientX: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      onScrub(clamp((clientX - rect.left) / rect.width, 0, 1));
    },
    [onScrub],
  );

  /** scrub from a pointer anywhere in the track region */
  const scrubAxis = useCallback(
    (clientX: number) => {
      const el = axis.current;
      if (el) scrubTo(clientX, el);
    },
    [scrubTo],
  );

  /* barely smoothed: the whole point of this trace is the events in
     it — the spike into the closeout, the flat stretch where the
     breath is held, and the slow decay after the shot. A heavy
     smoothing pass turned all three into one soft hill. */
  const wave = project(moment.physiology, 100, 26, 3);

  return (
    <div className={cx(styles.timeline, className)}>
      {/* THE RULER ROW — and there is no card header above it. The
          `Timeline · 00:11:24` label and the "drag any track to
          scrub" hint are gone: the time is already on the ruler and
          on the transport pill, and the hint explained an
          affordance the playhead makes obvious. */}
      <div className={styles.rulerRow}>
        <button
          type="button"
          className={styles.play}
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={onPlay}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5l11 7-11 7z" />
            </svg>
          )}
        </button>

        {/* the ruler starts where the TRACKS start, not at the card
            edge — its left edge is the same column boundary the
            lanes below it use */}
        <div
          className={styles.ruler}
          onPointerDown={(e) => scrubTo(e.clientX, e.currentTarget)}
          onPointerMove={(e) => e.buttons === 1 && scrubTo(e.clientX, e.currentTarget)}
        >
          <div className={styles.rulerLabels}>
            {RULER_MINUTES.map((m) => (
              <Label key={m} tone="tertiary">
                {minuteLabel(m)}
              </Label>
            ))}
          </div>
          <div className={styles.rulerTicks} aria-hidden="true">
            {Array.from({ length: RULER_TICKS + 1 }, (_, i) => (
              <span key={i} className={cx(styles.tick, i % 4 === 0 && styles.tickMajor)} />
            ))}
          </div>
          {/* the playhead's handle rides on the tick row */}
          <span
            className={styles.handle}
            style={{ '--x': `${(playhead * 100).toFixed(2)}%` } as CSSProperties}
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className={styles.tracks}
        onPointerDown={(e) => scrubAxis(e.clientX)}
        onPointerMove={(e) => e.buttons === 1 && scrubAxis(e.clientX)}
      >
        {/* motion · pose — segment widths are the real phase durations */}
        <Label tone="tertiary" className={styles.trackName}>
          {TIMELINE_TRACKS[0].label}
        </Label>
        <div
          className={cx(styles.lane, styles.laneFlat)}
          style={{ '--lane-h': 'var(--aera-space-13)' } as CSSProperties}
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
          style={{ '--lane-h': 'var(--aera-space-14)' } as CSSProperties}
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
          style={{ '--lane-h': 'var(--aera-space-14)' } as CSSProperties}
        >
          {/* THE STROKE SHIFTS ALONG ITS LENGTH: green at rest,
              warming through yellow at the arousal spike, cooling to
              blue on the descent. One flat colour said the trace was
              one state throughout, which is the opposite of what it
              measures. */}
          <svg className={styles.field} viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
            {/* THE COLOUR MAPS TO HEIGHT, NOT TO TIME.
                A vertical gradient in the lane's own user space: high
                on the track is hot, the middle band is the healthy
                one, low is cold. Because the gradient is vertical the
                line picks up its colour from where it actually IS,
                and it interpolates continuously along its own path
                rather than switching in blocks. */}
            <defs>
              <linearGradient id="physio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorData.orange} />
                <stop offset="34%" stopColor={colorData.yellow} />
                <stop offset="52%" stopColor={colorData.mint} />
                <stop offset="74%" stopColor={colorData.blue} />
                <stop offset="100%" stopColor={colorData.blue} />
              </linearGradient>
            </defs>
            <path
              d={smoothPath(wave, 0.18)}
              fill="none"
              stroke="url(#physio)"
              strokeWidth={PHYSIO_STROKE}
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
          style={{ '--lane-h': 'var(--aera-space-14)' } as CSSProperties}
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

        <div ref={axis} className={styles.playfield} aria-hidden="true">
          <span
            className={styles.playhead}
            style={{ '--x': `${(playhead * 100).toFixed(2)}%` } as CSSProperties}
          />
        </div>
      </div>
    </div>
  );
}
