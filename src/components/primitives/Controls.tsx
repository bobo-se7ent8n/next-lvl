import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { Counted } from './Metric';
import { Label, Mono, Text } from './Text';
import styles from './Controls.module.css';

/* ============================================================
   TOGGLE
   ============================================================ */
export interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

/** the mini switch — one setting, on or off */
export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        styles.toggle,
        checked && styles.toggleOn,
        disabled && styles.toggleDisabled,
        className,
      )}
    />
  );
}

/* ============================================================
   SEGMENTED CONTROL
   ============================================================ */
export interface SegmentedControlProps<T extends string> {
  options: Array<{ value: T; label: string; disabled?: boolean }>;
  value: T;
  onChange: (next: T) => void;
  ariaLabel: string;
  className?: string;
}

/** a small set of mutually exclusive choices, all visible at once */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cx(styles.segmented, className)} role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={opt.disabled}
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={cx(styles.segment, opt.value === value && styles.segmentOn)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   SLIDER
   ============================================================ */
export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** the value as the user reads it — '26%', '1.40', '10px' */
  display: string;
  onChange: (next: number) => void;
  disabled?: boolean;
  className?: string;
}

/** a single continuous setting */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
  disabled,
  className,
}: SliderProps) {
  return (
    <label className={cx(styles.slider, className)}>
      <Label className={styles.sliderName}>{label}</Label>
      <input
        type="range"
        className={styles.sliderInput}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <Mono className={styles.sliderValue}>{display}</Mono>
    </label>
  );
}

/* ============================================================
   PROGRESS BAR
   ============================================================ */
export interface ProgressBarProps {
  /** 0..100 */
  value: number;
  color: string;
  size?: 'sm' | 'md';
  /** this bar's place in a run of them — one stagger step per index */
  index?: number;
  ariaLabel?: string;
  className?: string;
}

/** a filled track — a share of something, never a countdown */
export function ProgressBar({
  value,
  color,
  size = 'md',
  index = 0,
  ariaLabel,
  className,
}: ProgressBarProps) {
  return (
    <span
      className={cx(styles.progress, className)}
      role="img"
      aria-label={ariaLabel ?? `${value} of 100`}
      style={
        {
          '--bar-h': size === 'sm' ? '6px' : '8px',
          '--bar-w': `${Math.max(0, Math.min(100, value))}%`,
          '--bar-color': color,
          '--bar-delay': `calc(var(--aera-duration-stagger) * ${index})`,
        } as CSSProperties
      }
    >
      <i className={styles.progressFill} />
    </span>
  );
}

export interface ProgressRowProps {
  label: string;
  value: number;
  color: string;
  /** this row's place in a run of them — one stagger step per index */
  index?: number;
  className?: string;
}

/** a named progress bar with its reading — the skills row.
 *
 *  THE BAR AND THE NUMERAL ARRIVE TOGETHER. The reading counts up on
 *  the same entry the fill grows on, in a slot of a fixed width set
 *  in tabular figures, so nothing beside it moves while it runs. */
export function ProgressRow({ label, value, color, index, className }: ProgressRowProps) {
  return (
    <div className={cx(styles.progressRow, className)}>
      <Text variant="bodySM" tone="secondary" className={styles.progressRowName}>
        {label}
      </Text>
      <ProgressBar
        value={value}
        color={color}
        index={index}
        ariaLabel={`${label}: ${value} of 100`}
      />
      <Text
        as="span"
        variant="metricMD"
        tone="primary"
        numeric
        className={styles.progressRowValue}
      >
        <Counted value={value} />
      </Text>
    </div>
  );
}
