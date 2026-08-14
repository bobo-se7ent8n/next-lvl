import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { clamp } from '../../lib/chart';
import { Ruler } from '../../components/viz/Ruler';
import { Label } from '../../components/primitives/Text';
import { PatternCard } from '../../components/composed/PatternCard';
import { PatternExpanded } from './PatternExpanded';
import { ringDelta, slotOpacity, slotShape } from './fanGeometry';
import type { Pattern } from '../../data/types';
import styles from './PatternFan.module.css';

/** how far the tucked stack sits below centre while a card is open */
const TUCK_Y = 260;
const TUCK_SCALE = 0.5;
const TUCK_SPREAD = 30;

export interface PatternFanProps {
  patterns: Pattern[];
  /** 0-based position in the set */
  position: number;
  onPosition: (next: number) => void;
  openIndex: number | null;
  onOpen: (index: number | null) => void;
  onOpenSessions?: (sessionIndex?: number) => void;
  onOpenInsights?: (insightTitle?: string) => void;
  onOpenScoreboard?: () => void;
  hint?: string;
  className?: string;
}

/** the fanned hand of pattern cards — ruler on top, hint underneath */
export function PatternFan({
  patterns,
  position,
  onPosition,
  openIndex,
  onOpen,
  onOpenSessions,
  onOpenInsights,
  onOpenScoreboard,
  hint = 'scroll to move through the set · click a card to open it',
  className,
}: PatternFanProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [step, setStep] = useState(150);
  const stage = useRef<HTMLDivElement>(null);
  const expanded = useRef<HTMLDivElement>(null);
  const total = patterns.length;

  /* the horizontal step is a share of the card width, so the overlap
     holds at any viewport size */
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const slot = el.querySelector<HTMLElement>(`.${styles.slot}`);
      if (slot) setStep(Math.max(72, slot.offsetWidth * 0.72));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* escape, or a press anywhere outside the opened card, closes it */
  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpen(null);
    };
    const onDown = (e: PointerEvent) => {
      if (!expanded.current?.contains(e.target as Node)) onOpen(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [openIndex, onOpen]);

  const open = openIndex != null ? patterns[openIndex] : null;

  return (
    <div className={cx(styles.wrap, className)}>
      <Ruler
        total={total}
        value={position}
        onChange={(v) => onPosition(clamp(v, 0, total - 1))}
        ariaLabel="Position in the pattern set"
      />

      <div
        ref={stage}
        className={cx(styles.stage, open && styles.stageOpen)}
        onPointerDown={(e) => {
          /* clicking the empty stage closes an opened card */
          if (open && e.target === e.currentTarget) onOpen(null);
        }}
      >
        {patterns.map((pattern, i) => {
          const d = ringDelta(i, position, total);
          const shape = slotShape(d);
          const tucked = open != null;
          const visible = tucked ? Math.abs(d) <= 2.6 : slotOpacity(d) > 0;

          const style = tucked
            ? ({
                '--x': `${(d * TUCK_SPREAD).toFixed(1)}px`,
                '--y': `${TUCK_Y}px`,
                '--rot': `${(d * 4).toFixed(2)}deg`,
                '--sc': TUCK_SCALE,
                '--op': visible ? 0.85 : 0,
                '--vis': visible ? 'visible' : 'hidden',
                zIndex: 10 - Math.round(Math.abs(d)),
              } as CSSProperties)
            : ({
                '--x': `${(d * step).toFixed(1)}px`,
                '--y': `${shape.y.toFixed(1)}px`,
                '--rot': `${shape.rot.toFixed(2)}deg`,
                '--sc': shape.scale.toFixed(4),
                '--op': slotOpacity(d),
                '--vis': visible ? 'visible' : 'hidden',
                zIndex: hover === i ? 700 : 600 - Math.round(Math.abs(d) * 10),
              } as CSSProperties);

          return (
            <div
              key={pattern.id}
              className={cx(styles.slot, tucked && styles.slotTucked)}
              style={style}
              onPointerEnter={() => !tucked && setHover(i)}
              onPointerLeave={() => setHover((h) => (h === i ? null : h))}
            >
              <PatternCard
                pattern={pattern}
                hovered={!tucked && hover === i}
                showTag={!tucked}
                onClick={() => {
                  if (tucked) return;
                  onPosition(i);
                  onOpen(i);
                }}
              />
            </div>
          );
        })}

        {open ? (
          <div
            ref={expanded}
            className={styles.expanded}
          >
            <PatternExpanded
              pattern={open}
              onClose={() => onOpen(null)}
              onOpenSessions={onOpenSessions}
              onOpenInsights={onOpenInsights}
              onOpenScoreboard={onOpenScoreboard}
            />
          </div>
        ) : null}
      </div>

      <Label className={styles.hint}>
        {open ? 'click outside the card, or press escape, to close it' : hint}
      </Label>
    </div>
  );
}
