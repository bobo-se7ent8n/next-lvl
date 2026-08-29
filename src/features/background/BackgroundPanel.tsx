import { useState } from 'react';
import { cx } from '../../lib/css';
import { Card } from '../../components/primitives/Card';
import { Slider, Toggle } from '../../components/primitives/Controls';
import { Label } from '../../components/primitives/Text';
import type { BackgroundSettings } from './settings';
import styles from './BackgroundPanel.module.css';
import { iconStroke } from '../../tokens';

export interface BackgroundPanelProps {
  settings: BackgroundSettings;
  onChange: (next: BackgroundSettings) => void;
  /** render in flow instead of pinned to the corner — used by stories */
  inline?: boolean;
  className?: string;
}

/** the display settings panel. Sliders write straight into the layer
 *  state — there is no apply step. */
export function BackgroundPanel({ settings, onChange, inline, className }: BackgroundPanelProps) {
  const [open, setOpen] = useState(inline ?? false);

  const patch = <K extends keyof BackgroundSettings>(
    key: K,
    value: Partial<BackgroundSettings[K]>,
  ) => onChange({ ...settings, [key]: { ...settings[key], ...value } });

  const body = (
    <Card radius="card" padding="10" elevation="overlay" className={styles.body}>
      <div className={styles.group}>
        <div className={styles.groupHead}>
          <Label>Vertical lines</Label>
          <Toggle
            label="Vertical lines"
            checked={settings.lines.on}
            onChange={(on) => patch('lines', { on })}
          />
        </div>
        <div className={cx(styles.fields, !settings.lines.on && styles.fieldsOff)}>
          <Slider
            label="Opacity"
            min={0}
            max={100}
            value={Math.round(settings.lines.opacity * 100)}
            display={`${Math.round(settings.lines.opacity * 100)}%`}
            onChange={(v) => patch('lines', { opacity: v / 100 })}
          />
          <Slider
            label="Width"
            min={1}
            max={8}
            value={settings.lines.width}
            display={`${settings.lines.width}px`}
            onChange={(v) => patch('lines', { width: v })}
          />
          <Slider
            label="Density"
            min={4}
            max={80}
            value={settings.lines.count}
            display={String(settings.lines.count)}
            onChange={(v) => patch('lines', { count: v })}
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupHead}>
          <Label>Grain</Label>
          <Toggle
            label="Grain"
            checked={settings.grain.on}
            onChange={(on) => patch('grain', { on })}
          />
        </div>
        <div className={cx(styles.fields, !settings.grain.on && styles.fieldsOff)}>
          <Slider
            label="Opacity"
            min={0}
            max={100}
            value={Math.round(settings.grain.opacity * 100)}
            display={`${Math.round(settings.grain.opacity * 100)}%`}
            onChange={(v) => patch('grain', { opacity: v / 100 })}
          />
          <Slider
            label="Amount"
            min={5}
            max={150}
            value={Math.round(settings.grain.amount * 100)}
            display={settings.grain.amount.toFixed(2)}
            onChange={(v) => patch('grain', { amount: v / 100 })}
          />
          <Slider
            label="Scale"
            min={20}
            max={400}
            step={5}
            value={Math.round(settings.grain.scale * 100)}
            display={settings.grain.scale.toFixed(2)}
            onChange={(v) => patch('grain', { scale: v / 100 })}
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupHead}>
          <Label>ASCII numbers</Label>
          <Toggle
            label="ASCII number pattern"
            checked={settings.ascii.on}
            onChange={(on) => patch('ascii', { on })}
          />
        </div>
        <div className={cx(styles.fields, !settings.ascii.on && styles.fieldsOff)}>
          <Slider
            label="Opacity"
            min={0}
            max={60}
            value={Math.round(settings.ascii.opacity * 100)}
            display={`${Math.round(settings.ascii.opacity * 100)}%`}
            onChange={(v) => patch('ascii', { opacity: v / 100 })}
          />
          <Slider
            label="Density"
            min={8}
            max={60}
            value={settings.ascii.cell}
            display={`${settings.ascii.cell}px`}
            onChange={(v) => patch('ascii', { cell: v })}
          />
          <Slider
            label="Glyph"
            min={6}
            max={22}
            value={settings.ascii.fontSize}
            display={`${settings.ascii.fontSize}px`}
            onChange={(v) => patch('ascii', { fontSize: v })}
          />
        </div>
      </div>
    </Card>
  );

  if (inline) return <div className={className}>{body}</div>;

  return (
    <div className={cx(styles.panel, className)}>
      {open ? body : null}
      <button
        type="button"
        className={styles.toggleButton}
        aria-expanded={open}
        aria-label="Display settings"
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={iconStroke.thin} strokeLinecap="round">
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="10" cy="17" r="2" />
        </svg>
      </button>
    </div>
  );
}
