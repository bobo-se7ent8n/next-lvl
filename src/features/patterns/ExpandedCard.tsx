import { useLayoutEffect } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/css';
import { inkOn, mix, tintOf } from '../../lib/color';
import { Link } from 'react-router-dom';
import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Counted, Metric } from '../../components/primitives/Metric';
import { useEnterKey } from '../../lib/enterContext';
import { duration, iconStroke } from '../../tokens';
import { Display, Label, Text } from '../../components/primitives/Text';
import { PatternChart } from './PatternChart';
import { ExpandedMatrix } from './ExpandedMatrix';
import { patternSource } from './patternSource';
import { PATTERNS } from '../../data/patterns';
import type { Pattern } from '../../data/types';
import styles from './ExpandedCard.module.css';

/** four readings show a direction; a fifth only lengthens the list */
const HISTORY_ROWS = 4;

/** the height the fallback chart draws at, for a pattern the dot
 *  matrix has no recipe for */
const FALLBACK_VIZ_H = 120;

export interface ExpandedCardProps {
  pattern: Pattern;
  /** clicking the card itself dismisses it */
  onDismiss?: () => void;
  /** the host owns the corner and the shadow. The fan sets this while
   *  the card is growing out of the hand, because those two values are
   *  part of what is animating and cannot be on two elements at once. */
  bare?: boolean;
  /** true below the two-column width, where the columns stack */
  stacked?: boolean;
  /** laid out for measuring only — no chart, nothing live. See
   *  `PanelProbe`. */
  probe?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** The opened pattern — Paper's pattern popup.
 *
 *  Four rows, and every pattern fills the same four:
 *
 *    1. the NAME, with how it was arrived at in a white chip
 *    2. the NUMERAL
 *    3. the SOURCE beside the CHART — the session, block or item the
 *       claim was measured on and a way to go there, and the card's
 *       own dot matrix cut for the well
 *    4. the last four readings
 *
 *  THE LONG READ IS GONE. A paragraph under the numeral restated what
 *  the chart draws and the history lists, and it was the one block
 *  whose length varied from pattern to pattern — which is what made
 *  the twelve cards open at twelve different heights. With it gone
 *  every row is the same height on every pattern, so the card is too:
 *  the source block's sentence is held to two lines and the history to
 *  four readings, and nothing else on the card has a length. */
export function ExpandedCard({
  pattern,
  onDismiss,
  bare,
  stacked = false,
  probe = false,
  className,
  style,
}: ExpandedCardProps) {
  const ink = inkOn(pattern.fill);
  const mark = mix(pattern.fill, ink, 0.45);
  const tint = tintOf(pattern.fill);

  const rows = pattern.history.slice(-HISTORY_ROWS);
  /* the recalc's own trigger — the fan re-scopes this 140ms into the
     flight, and everything that animates in here reads it */
  const enterKey = useEnterKey();
  /* where this pattern came from — a session, a scoreboard block or
     the library. One resolver so the name, the button and the route
     can never say different things. */
  const source = patternSource(pattern);

  return (
    <Card
      face={pattern.fill}
      radius={bare ? 'none' : 'window'}
      elevation={bare ? 'none' : 'overlay'}
      padding="0"
      onClick={onDismiss}
      className={cx(styles.panel, bare && styles.bare, className)}
      style={{ color: ink, ...style }}
    >
      {/* THE CLOSE CONTROL. The whole panel is a dismiss target, and
          an X in the corner is what says so. */}
      <button
        type="button"
        className={styles.close}
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss?.();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke.base} strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* the layout lands on the inner box rather than on the Card:
          Card has a closed prop list and does not forward data-* */}
      <div className={styles.inner} data-stacked={stacked ? '' : undefined}>
        {/* 1 — THE NAME, AND HOW IT WAS ARRIVED AT. The state word
            ("declining") that used to lead the heading is gone: the
            history at the foot of the card draws the direction, and
            draws it with numbers. */}
        <div className={styles.head}>
          <Display size="md" as="h2" tone="inherit">
            {pattern.name}
          </Display>
          {/* the neutral chip on the paper ground: a white pill on the
              card face, as Paper draws it */}
          <Chip style={{ '--chip-bg': 'var(--aera-color-surface-background)' } as CSSProperties}>
            {pattern.kind}
          </Chip>
        </div>

        {/* 2 — THE NUMERAL, with nothing under it. "Current value" was
            a caption naming the only number on the card that could be
            the current value. */}
        <Metric
          className={styles.hero}
          value={pattern.hero}
          unit={pattern.unit}
          size="lg"
          inherit
          /* the panel's numbers start while the box is still flying,
             so they run shorter than a page-enter count */
          countOver={duration.countQuick}
        />

        {/* 3 — THE SOURCE BESIDE THE CHART, on one row of one height */}
        <div className={styles.middle}>
          {/* WHERE THE PATTERN CAME FROM. A pattern is a claim about
              your own sessions; this block holds what it was measured
              on, what was measured, and a way to go and look. Its
              readings come before the sentence — a session is known
              first by what happened in it. See patternSource.ts. */}
          <div className={styles.source}>
            <Label tone="inherit">
              {source.date ? `${source.date} · ${source.name}` : source.name}
            </Label>

            {/* omitted when the source carries no readings — the order
                of the block never changes, only what is in it */}
            {source.stats ? (
              <div className={styles.stats}>
                {source.stats.map((stat) => (
                  <span key={stat.label} className={styles.stat}>
                    <Text as="b" variant="figure" tone="inherit" numeric>
                      <Counted value={stat.value} over={duration.countQuick} />
                    </Text>
                    <Text as="span" variant="figureUnit" tone="inherit">
                      {stat.label}
                    </Text>
                  </span>
                ))}
              </div>
            ) : null}

            <Text variant="bodySM" tone="inherit" lines={2} className={styles.measured}>
              {pattern.measured}
            </Text>

            <Link
              to={source.to}
              className={styles.openSource}
              aria-label={`${source.action}: ${source.name}`}
              tabIndex={probe ? -1 : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {source.action}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke.base} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
          </div>

          <div className={styles.well}>
            {/* THE SAME CHART THE CARD IN THE HAND DRAWS — its dot
                matrix, same data, colours and chart type, cut for this
                well rather than stretched from the card's (see
                ExpandedMatrix). The probe draws nothing here: the well
                has no content height, and the canvas is not free. */}
            {probe ? null : (
              <ExpandedMatrix pattern={pattern}>
                <PatternChart pattern={pattern} color={mark} height={FALLBACK_VIZ_H} inherit area />
              </ExpandedMatrix>
            )}
          </div>
        </div>

        {/* 4 — THE LAST FOUR READINGS */}
        <div className={styles.historyBlock}>
          <Label tone="inherit" className={styles.quiet}>
            Last {rows.length} sessions
          </Label>
          {/* KEYED ON THE ENTER KEY so the rows' CSS entrance restarts
              when the panel recalculates 140ms into the flight. A
              custom property change cannot re-fire an animation; a
              remount can, and the count-up beside it follows the same
              key through its own hook. */}
          <div key={String(enterKey)} className={styles.history}>
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={styles.historyRow}
                style={
                  {
                    '--row-delay': `calc(var(--aera-duration-history-delay) + var(--aera-duration-history-step) * ${i})`,
                  } as CSSProperties
                }
              >
                <Text as="span" variant="metricSM" tone="inherit" className={styles.historyName}>
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
                {/* the value counts up and the label does not — and it
                    is tabular, in a slot of a fixed width, so the row
                    cannot reflow while it runs */}
                <Text as="span" variant="metricSM" tone="inherit" numeric className={styles.historyValue}>
                  <Counted value={row.value} over={duration.countRow} />
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   THE PROBE — how tall an opened pattern is on this window.

   Every opened pattern is the same four rows, so they share one
   height; what that height IS depends on the window, because lengths
   scale with it and small type does not. Predicting it would mean
   re-deriving the type floors, the line heights and the scale in
   script, and being wrong by a line whenever a face loads late. So it
   is measured: one card, laid out at the panel's own width with its
   height left to its content, off screen and inert.

   THE TALLEST KIND OF CARD. A pattern measured on a session carries
   a row of readings the others do not; the probe is one of those, and
   every other pattern opens into the same box with its chart well
   taking the difference. The sentence in the block reserves its two
   lines whatever it wraps to, so which session pattern is the probe
   does not matter.

   Portalled to the body so no ancestor's transform or clip can reach
   it, and re-measured by a ResizeObserver — the width changes with
   the window, and the fonts arriving change the height. The observer
   keeps the resting box current; the flight does not rely on it, and
   reads the probe itself at the moment a card opens.
   ============================================================ */
const PROBE_PATTERN = PATTERNS.find((p) => patternSource(p).stats) ?? PATTERNS[0];

export interface PanelProbeProps {
  width: number;
  stacked: boolean;
  onHeight: (height: number) => void;
  /** the probe's box, for a host that has to read the height at the
   *  instant it needs it — see `usePanelBox` */
  host: RefObject<HTMLDivElement | null>;
}

export function PanelProbe({ width, stacked, onHeight, host }: PanelProbeProps) {
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const report = () => onHeight(Math.ceil(el.getBoundingClientRect().height));
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeight, host]);

  return createPortal(
    <div ref={host} className={styles.probe} style={{ width }} aria-hidden="true" inert>
      <ExpandedCard pattern={PROBE_PATTERN} stacked={stacked} bare probe />
    </div>,
    document.body,
  );
}
