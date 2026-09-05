import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { DotMatrix } from '../../components/graphics/DotMatrix';
import { CardViz } from '../../components/viz/CardViz';
import { FOCUS } from '../../data/vitals';
import styles from './FocusPanel.module.css';

export interface FocusPanelProps {
  className?: string;
}

/** how many beats the collapsing interval draws. The ROW count is
 *  derived from the shape of the well so the field fills it exactly:
 *  the grid pitch is the invariant, and the number of dots in the box
 *  is what follows from it. A fixed grid letterboxed inside a
 *  landscape well and left the baseline stranded off to one side. */
const BEATS = 26;

/** One thing worth attention this week. The card is as tall as the
 *  vitals grid beside it, so the graphic takes whatever height is left
 *  rather than leaving a void under the text. */
export function FocusPanel({ className }: FocusPanelProps) {
  const well = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(14);

  useLayoutEffect(() => {
    const el = well.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setRows(Math.max(6, Math.round(BEATS * (height / width))));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Card radius="card" fill className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.top}>
        <Display size="md" as="h2" tone="tertiary">
          Focus
        </Display>
        <Chip tone="lilac">{FOCUS.kicker}</Chip>
      </div>

      <Metric value={FOCUS.stat} unit={FOCUS.unit} size="lg" caption={FOCUS.statLabel} />

      {/* The collapsing interval. Each column is a beat in the pre-shot
          sequence; the measured quantity is the SPACE between them.
          Wide and even on the left — the unpressured baseline — closing
          all the way to a dense band at the release. */}
      <div className={styles.graphic} ref={well}>
        <CardViz card={FOCUS}>
          <DotMatrix
            pattern="interval"
            rows={rows}
            columns={BEATS}
            accent="lilac"
            fill
            ariaLabel="The interval between pre-shot beats, closing from the catch to the release"
          />
        </CardViz>
      </div>
      <div className={styles.graphicAxis}>
        <Label tone="tertiary">catch</Label>
        <Label tone="tertiary">closeout</Label>
        <Label tone="tertiary">release</Label>
      </div>

      <div className={styles.beats}>
        {FOCUS.steps.map((step) => (
          <div key={step.label} className={styles.beat}>
            <Label
              className={styles.beatLabel}
              style={{ '--beat': `var(--aera-color-data-${step.tone})` } as CSSProperties}
            >
              {step.label}
            </Label>
            <Text variant="bodySM" tone="secondary">
              {step.text}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
