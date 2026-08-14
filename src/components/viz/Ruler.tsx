import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/css';
import styles from './Charts.module.css';

const STEP = 46; // px between majors
const SUBS = 5;

export interface RulerProps {
  /** number of majors on the tape */
  total: number;
  /** the position read against the fixed caret, in majors (may be fractional) */
  value: number;
  /** omit to render a read-only tape */
  onChange?: (next: number) => void;
  ariaLabel?: string;
  className?: string;
}

/** the measure tape — ticks slide under one fixed caret. There is no
 *  counter: the tape is the readout. */
export function Ruler({ total, value, onChange, ariaLabel = 'Position', className }: RulerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; from: number } | null>(null);
  const [mid, setMid] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setMid(el.offsetWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ticks = [];
  for (let i = 0; i < Math.max(1, total); i++) {
    ticks.push(
      <span key={`M${i}`} className={styles.tick} style={{ left: i * STEP, height: 12, opacity: 0.42 }} />,
    );
    ticks.push(
      <span key={`L${i}`} className={styles.tickLabel} style={{ left: i * STEP }}>
        {i + 1}
      </span>,
    );
    if (i < total - 1) {
      for (let k = 1; k < SUBS; k++) {
        ticks.push(
          <span
            key={`m${i}-${k}`}
            className={styles.tick}
            style={{ left: i * STEP + (k * STEP) / SUBS, height: 5, opacity: 0.18 }}
          />,
        );
      }
    }
  }

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!onChange) return;
      drag.current = { id: e.pointerId, x: e.clientX, from: value };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [onChange, value],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d || !onChange || e.pointerId !== d.id) return;
      onChange(d.from - (e.clientX - d.x) / STEP);
    },
    [onChange],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      drag.current = null;
      onChange?.(Math.round(value));
    },
    [onChange, value],
  );

  return (
    <div
      ref={ref}
      className={cx(styles.ruler, className)}
      role={onChange ? 'slider' : 'img'}
      tabIndex={onChange ? 0 : undefined}
      aria-label={ariaLabel}
      aria-valuemin={onChange ? 1 : undefined}
      aria-valuemax={onChange ? total : undefined}
      aria-valuenow={onChange ? Math.round(value) + 1 : undefined}
      style={{ cursor: onChange ? 'grab' : 'default', touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={(e) => {
        if (!onChange) return;
        if (e.key === 'ArrowRight') {
          onChange(Math.round(value) + 1);
          e.preventDefault();
        }
        if (e.key === 'ArrowLeft') {
          onChange(Math.round(value) - 1);
          e.preventDefault();
        }
      }}
    >
      <div
        className={styles.rulerTrack}
        style={{
          width: (Math.max(1, total) - 1) * STEP + 2,
          transform: `translateX(${(mid - value * STEP).toFixed(1)}px)`,
        }}
      >
        {ticks}
      </div>
      <span className={styles.caret} aria-hidden="true" />
    </div>
  );
}
