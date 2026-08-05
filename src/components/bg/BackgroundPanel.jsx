import { useEffect, useRef, useState } from 'react'
import { ChevronDown, RotateCcw, Shuffle, Sliders, Upload, X } from 'lucide-react'

import { cx } from '../../lib/utils'
import { useBackground } from '../../state/BackgroundState'

/* ============================================================
   BACKGROUND CONTROL PANEL

   A dev tool, not product chrome — but it has to be findable, so it
   ships with a small labelled trigger parked in the bottom-right
   corner that is visible on load. Shift+B toggles the same thing for
   anyone who would rather not reach for the mouse.

   Every control writes straight into background state, so the layers
   re-render live — there is no apply step.
   ============================================================ */

function Row({ label, value, children }) {
  return (
    <label className="mt-sm flex items-center gap-sm">
      <span className="w-[74px] shrink-0 text-[10px] font-medium uppercase tracking-label text-ink3">
        {label}
      </span>
      <span className="flex-1">{children}</span>
      {value != null && (
        <span className="num w-[38px] shrink-0 text-right text-[10px] font-semibold text-ink2">
          {value}
        </span>
      )}
    </label>
  )
}

function Slider({ min, max, step = 1, value, onChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="block h-[4px] w-full cursor-pointer appearance-none rounded-pill bg-surface2 accent-ink"
    />
  )
}

function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center gap-sm text-left"
    >
      <span
        aria-hidden="true"
        className={cx(
          'relative block h-[18px] w-[32px] shrink-0 rounded-pill transition-colors duration-180',
          on ? 'bg-ink' : 'bg-surface2'
        )}
      >
        <span
          className={cx(
            'absolute top-[3px] block h-[12px] w-[12px] rounded-pill bg-panel transition-[left] duration-180',
            on ? 'left-[17px]' : 'left-[3px]'
          )}
        />
      </span>
      <b className="font-display text-[15px] font-medium uppercase leading-none tracking-[0.04em] text-ink">
        {label}
      </b>
    </button>
  )
}

function Section({ children, on }) {
  return (
    <div
      className={cx(
        'mt-sm transition-opacity duration-180',
        on ? 'opacity-100' : 'pointer-events-none opacity-35'
      )}
    >
      {children}
    </div>
  )
}

export function BackgroundPanel() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const fileRef = useRef(null)

  const {
    lines,
    grain,
    ascii,
    setLine,
    setGrain,
    setAscii,
    regenerate,
    loadImage,
    reset,
  } = useBackground()

  useEffect(() => {
    const onKey = (e) => {
      // never steal the key while someone is typing
      const t = e.target
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'B' && e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Background controls — shift + B"
        className="fixed bottom-md right-md z-[60] inline-flex items-center gap-[7px] rounded-pill bg-ink py-[9px] pl-[13px] pr-md text-[11px] font-medium text-panel shadow-raise transition-opacity hover:opacity-85"
      >
        <Sliders size={13} strokeWidth={2} />
        Background
      </button>
    )
  }

  return (
    <aside
      aria-label="Background controls"
      className="fixed bottom-md right-md z-[60] w-[292px] rounded-lg bg-panel p-md shadow-raise sq"
    >
      <header className="flex items-center gap-sm">
        <b className="flex-1 font-display text-[17px] font-semibold uppercase leading-none tracking-[0.04em] text-ink">
          Background
        </b>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset to defaults"
          title="Reset"
          className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink3 transition-colors hover:bg-surface hover:text-ink"
        >
          <RotateCcw size={13} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
          className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink3 transition-colors hover:bg-surface hover:text-ink"
        >
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={cx('transition-transform duration-180', collapsed && '-rotate-90')}
          />
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-ink3 transition-colors hover:bg-surface hover:text-ink"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </header>

      {!collapsed && (
        <div className="mt-md max-h-[70vh] overflow-y-auto pr-[2px]">
          {/* ---------------- lines ---------------- */}
          <div className="rounded-sm bg-surface p-sm sq">
            <Switch
              on={lines.on}
              onChange={(v) => setLine('on', v)}
              label="Lines"
            />
            <Section on={lines.on}>
              <Row label="Count" value={lines.count}>
                <Slider
                  min={4}
                  max={80}
                  value={lines.count}
                  onChange={(v) => setLine('count', v)}
                />
              </Row>
              <Row label="Width" value={`${lines.width}px`}>
                <Slider
                  min={1}
                  max={6}
                  value={lines.width}
                  onChange={(v) => setLine('width', v)}
                />
              </Row>
              <Row label="Opacity" value={lines.opacity.toFixed(2)}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={lines.opacity}
                  onChange={(v) => setLine('opacity', v)}
                />
              </Row>
            </Section>
          </div>

          {/* ---------------- grain ---------------- */}
          <div className="mt-sm rounded-sm bg-surface p-sm sq">
            <Switch
              on={grain.on}
              onChange={(v) => setGrain('on', v)}
              label="Grain"
            />
            <Section on={grain.on}>
              <Row label="Amount" value={grain.amount.toFixed(2)}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={grain.amount}
                  onChange={(v) => setGrain('amount', v)}
                />
              </Row>
              <Row label="Scale" value={grain.scale.toFixed(1)}>
                <Slider
                  min={0.3}
                  max={5}
                  step={0.1}
                  value={grain.scale}
                  onChange={(v) => setGrain('scale', v)}
                />
              </Row>
              <Row label="Opacity" value={grain.opacity.toFixed(2)}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={grain.opacity}
                  onChange={(v) => setGrain('opacity', v)}
                />
              </Row>
            </Section>
          </div>

          {/* ---------------- ascii ---------------- */}
          <div className="mt-sm rounded-sm bg-surface p-sm sq">
            <Switch
              on={ascii.on}
              onChange={(v) => setAscii('on', v)}
              label="ASCII"
            />
            <Section on={ascii.on}>
              <div className="mt-sm flex gap-[4px] rounded-pill bg-surface2 p-[3px]">
                {['random', 'image'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAscii('mode', m)}
                    aria-pressed={ascii.mode === m}
                    className={cx(
                      'flex-1 rounded-pill py-[5px] text-[10px] font-semibold uppercase tracking-label transition-colors',
                      ascii.mode === m
                        ? 'bg-ink text-panel'
                        : 'text-ink3 hover:text-ink'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {ascii.mode === 'random' ? (
                <button
                  type="button"
                  onClick={regenerate}
                  className="mt-sm inline-flex w-full items-center justify-center gap-[6px] rounded-pill bg-ink py-[8px] text-[11px] font-medium text-panel transition-opacity hover:opacity-85"
                >
                  <Shuffle size={12} strokeWidth={2} />
                  Regenerate
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-sm inline-flex w-full items-center justify-center gap-[6px] rounded-pill bg-ink py-[8px] text-[11px] font-medium text-panel transition-opacity hover:opacity-85"
                  >
                    <Upload size={12} strokeWidth={2} />
                    {ascii.imageSrc ? 'Replace image' : 'Upload image'}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => loadImage(e.target.files?.[0])}
                  />
                  {!ascii.imageSrc && (
                    <p className="quiet m-0 mt-[6px] text-[10px]">
                      no image yet — the field stays procedural
                    </p>
                  )}
                </>
              )}

              {/* density is the grid pitch: bigger cell, sparser field */}
              <Row label="Density" value={`${ascii.cell}px`}>
                <Slider
                  min={6}
                  max={60}
                  value={ascii.cell}
                  onChange={(v) => setAscii('cell', v)}
                />
              </Row>
              <Row label="Font" value={`${ascii.fontSize}px`}>
                <Slider
                  min={5}
                  max={30}
                  value={ascii.fontSize}
                  onChange={(v) => setAscii('fontSize', v)}
                />
              </Row>
              <Row label="Opacity" value={ascii.opacity.toFixed(2)}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={ascii.opacity}
                  onChange={(v) => setAscii('opacity', v)}
                />
              </Row>
            </Section>
          </div>

          <p className="quiet m-0 mt-sm text-[10px]">
            shift + B to hide
          </p>
        </div>
      )}
    </aside>
  )
}
