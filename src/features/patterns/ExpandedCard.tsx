import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { inkOn, mix, tintOf, vizWell } from '../../lib/color';
import { Card } from '../../components/primitives/Card';
import { Counted, Metric } from '../../components/primitives/Metric';
import { useEnterKey } from '../../lib/enterContext';
import { duration } from '../../tokens';
import { Display, Label, Text } from '../../components/primitives/Text';
import { PatternChart } from './PatternChart';
import { buildLadder, historyLabel } from './fitPlan';
import { STATE_LABEL } from '../../data/patterns';
import type { Pattern } from '../../data/types';
import styles from './ExpandedCard.module.css';

export interface ExpandedCardProps {
  pattern: Pattern;
  /** clicking the card itself dismisses it — there is no close button */
  onDismiss?: () => void;
  /** the host owns the corner and the shadow. The fan sets this while
   *  the card is growing out of the hand, because those two values are
   *  part of what is animating and cannot be on two elements at once. */
  bare?: boolean;
  /** the box the popup has to stand inside, in px. Everything that
   *  gives — the rhythm, the chart, the history — is derived from it. */
  maxHeight?: number;
  maxWidth?: number;
  /** true below the two-column breakpoint, where the columns stack */
  stacked?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** The opened pattern. A DETAIL VIEW and nothing more: everything the
 *  card front leaves out lives here — the full viz, what was measured,
 *  the longer read and the confirmed history. No links out, no close
 *  button, no modal chrome. Depth comes from scale and contrast. */
export function ExpandedCard({
  pattern,
  onDismiss,
  bare,
  maxHeight,
  maxWidth,
  stacked = false,
  className,
  style,
}: ExpandedCardProps) {
  const ink = inkOn(pattern.fill);
  const mark = mix(pattern.fill, ink, 0.45);
  const tint = tintOf(pattern.fill);

  /* WHAT HAS TO GIVE, measured rather than predicted.

     The popup renders at the most generous plan on the ladder, then
     steps down a rung whenever its content is taller than its box,
     until it fits or the ladder runs out. Measuring is the only way
     to be right here: how tall this popup is depends on how many
     lines its body text wraps to, which depends on the width, the
     face, and the sentence — none of which a formula knows. */
  const inner = useRef<HTMLDivElement>(null);
  const ladder = useMemo(() => buildLadder(pattern.history.length), [pattern.history.length]);
  const [rung, setRung] = useState(0);

  /* a new pattern, or a new box, is a fresh climb from the top of the
     ladder — adjusted during render, which is the supported way to
     reset state when a prop changes */
  const signature = `${pattern.id}:${maxHeight}:${maxWidth}:${stacked}`;
  const [seen, setSeen] = useState(signature);
  if (seen !== signature) {
    setSeen(signature);
    setRung(0);
  }

  /* The step-down is driven by a ResizeObserver rather than by the
     effect body: the observer fires once when it starts watching and
     again every time a step changes the content's size, so the popup
     settles on the first rung that fits and then stops.

     ONE STEP PER COMMIT. The observer watches the box and each of its
     children, so a single layout delivers several callbacks — all of
     them measuring the same, not-yet-re-rendered DOM. Without this
     gate every one of them counted as a separate overflow and the
     popup fell straight to the bottom of the ladder, which is why a
     stacked layout showed three history rows when it had room for
     six. The gate is released once the new rung has been painted. */
  const stepping = useRef(false);

  useLayoutEffect(() => {
    stepping.current = false;
  });

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const check = () => {
      if (stepping.current) return;
      /* 1px of tolerance: sub-pixel layout should not cost a row */
      if (el.scrollHeight <= el.clientHeight + 1) return;
      stepping.current = true;
      setRung((r) => Math.min(r + 1, ladder.length - 1));
    };
    const ro = new ResizeObserver(check);
    ro.observe(el);
    for (const kid of Array.from(el.children)) ro.observe(kid);
    return () => ro.disconnect();
  }, [ladder.length, signature]);

  const plan = ladder[Math.min(rung, ladder.length - 1)];
  const rows = pattern.history.slice(-plan.historyRows);
  /* the recalc's own trigger — the fan re-scopes this 140ms into the
     flight, and everything that animates in here reads it */
  const enterKey = useEnterKey();

  return (
    <Card
      face={pattern.fill}
      radius={bare ? 'none' : 'card'}
      elevation={bare ? 'none' : 'overlay'}
      padding="0"
      onClick={onDismiss}
      className={cx(styles.panel, className)}
      style={{ color: ink, ...style }}
    >
      {/* the density lands on the inner box rather than on the Card:
          Card has a closed prop list and does not forward data-* */}
      {/* The inner box is pinned to the popup's FINAL geometry rather
          than to 100% of the panel. The panel's width and height are
          what animate as the card grows out of the fan, and a ladder
          measuring against a box still in flight sees the content
          overflow at every rung and walks all the way to the bottom —
          which is why a 1440×1080 screen was being served the compact
          layout. Pinned, the fit is decided once, against the box the
          popup is actually going to occupy. */}
      <div
        ref={inner}
        className={styles.inner}
        data-density={plan.density}
        style={
          {
            '--fit-h': maxHeight ? `${maxHeight}px` : undefined,
            '--fit-w': maxWidth ? `${maxWidth}px` : undefined,
          } as CSSProperties
        }
      >
        <div className={styles.top}>
          <Label tone="inherit">
            {pattern.kind} · {STATE_LABEL[pattern.state]}
          </Label>
          <Display size="lg" as="h2" tone="inherit">
            {pattern.name}
          </Display>
          <Text variant="bodySM" tone="inherit" className={styles.context}>
            {pattern.context}
          </Text>
        </div>

        {/* FIVE CELLS ON THREE SHARED ROWS.

            Both columns used to be flex stacks, which is why nothing
            lined up: each one packed its own blocks at its own
            heights, so the two body paragraphs started at different
            y positions and the panel read as two unrelated columns
            side by side. On a real grid the row starts are the same
            line on both sides by construction.

            The chart spans rows one and two, so its bottom edge and
            the bottom of "what was measured" land together — which
            is what puts the paragraph and the history heading on one
            line. One row gap and one column gap, both from the
            density steps; no block carries a margin of its own. */}
        <div className={styles.grid}>
          <Metric
            className={styles.cellHero}
            value={pattern.hero}
            unit={pattern.unit}
            size="lg"
            caption="current value"
            inherit
            /* the panel's numbers start while the box is still
               flying, so they run shorter than a page-enter count */
            countOver={duration.countPanel}
          />

          <div className={cx(styles.cellMeasured, styles.measured)}>
            <Label tone="inherit" className={styles.quiet}>
              What was measured
            </Label>
            <Text variant="bodySM" tone="inherit">
              {pattern.measured}
            </Text>
          </div>

          <Text variant="bodySM" tone="inherit" className={cx(styles.cellBody, styles.body)}>
            {pattern.body}
          </Text>

          <div
            className={cx(styles.cellChart, styles.viz)}
            style={{ '--viz-well': vizWell(pattern.fill) } as CSSProperties}
          >
            {/* THE SAME CHART THE CARD IN THE HAND DRAWS, at the
                height the fit plan has budgeted and with its
                annotations on */}
            <PatternChart pattern={pattern} color={mark} height={plan.vizHeight} inherit />
          </div>

          <div className={styles.cellHistory}>
            <Label tone="inherit" className={styles.quiet}>
              {historyLabel(rows.length, pattern.history.length)}
            </Label>
            {/* KEYED ON THE ENTER KEY so the rows' CSS entrance
                restarts when the panel recalculates 140ms into the
                flight. A custom property change cannot re-fire an
                animation; a remount can, and the count-up beside it
                follows the same key through its own hook. */}
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
                  <Text
                    as="span"
                    variant="metricSM"
                    tone="inherit"
                    className={styles.historyName}
                  >
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
                  {/* the value counts up and the label does not — and
                      it is tabular, in a slot of a fixed width, so
                      the row cannot reflow while it runs */}
                  <Text
                    as="span"
                    variant="metricSM"
                    tone="inherit"
                    numeric
                    className={styles.historyValue}
                  >
                    <Counted value={row.value} over={duration.countRow} />
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* the same mono caps every other small label wears */}
        <Label tone="inherit" className={styles.note}>
          Click anywhere to put it back.
        </Label>
      </div>
    </Card>
  );
}
