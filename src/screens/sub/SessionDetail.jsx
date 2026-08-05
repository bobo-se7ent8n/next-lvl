import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pause, Play } from 'lucide-react'

import {
  MOMENTS,
  SESSIONS,
  SESSION_STAT_ROWS,
  TOTAL,
  TRACKS,
  TRACK_LABELS,
} from '../../data/mock'
import { cx, fmt } from '../../lib/utils'
import { hlFill } from '../../lib/palette'

import {
  Button,
  Callout,
  Card,
  Chip,
  ScreenHeader,
  SectionLabel,
} from '../../components/ui'
import { Num } from '../../components/motion/Num'
import { Stagger, StaggerItem } from '../../components/motion/Stagger'
import {
  PointCloud,
  PointCloudLegend,
} from '../../components/viz/PointCloud'

/** moment the playhead is sitting on (within 12s) */
const nearest = (t) => MOMENTS.findIndex((m) => Math.abs(m.t - t) < 12)

/** a tick every 5 minutes across the scrub track */
const TICKS = Array.from({ length: Math.floor(TOTAL / 300) + 1 }, (_, i) => i * 300)

export default function SessionDetail() {
  const { id } = useParams()
  const index = Number(id)
  const session = SESSIONS[index]

  /* Timeline state is mutable and frame-driven, so it lives in a ref
     with an explicit render tick — same shape as the prototype's
     imperative loop, minus the DOM writes. */
  const tl = useRef({ t: 0, active: -1, consumed: [] })
  const [, tick] = useReducer((x) => x + 1, 0)
  const [playing, setPlaying] = useState(false)
  const [cont, setCont] = useState(null)

  const scrubRef = useRef(null)
  const dragging = useRef(false)

  const pause = useCallback(() => setPlaying(false), [])

  const seek = useCallback((sec) => {
    const s = tl.current
    setPlaying(false)
    setCont(null)
    s.t = Math.max(0, Math.min(TOTAL, sec))
    s.consumed = MOMENTS.map((m) => m.t <= s.t)
    s.active = nearest(s.t)
    tick()
  }, [])

  const goMoment = useCallback(
    (i) => {
      seek(MOMENTS[i].t)
      const s = tl.current
      s.active = i
      s.consumed[i] = true
      tick()
    },
    [seek]
  )

  /* playback loop — pauses automatically at each unvisited moment */
  useEffect(() => {
    if (!playing) return

    const step = () => {
      const s = tl.current
      const nt = s.t + 4

      for (let i = 0; i < MOMENTS.length; i++) {
        const m = MOMENTS[i]
        if (!s.consumed[i] && m.t > s.t && m.t <= nt) {
          s.t = m.t
          s.active = i
          s.consumed[i] = true
          setPlaying(false)
          setCont(`moment ${i + 1} · ${m.label}`)
          tick()
          return
        }
      }

      if (nt >= TOTAL) {
        s.t = 0
        s.active = -1
        s.consumed = []
        setPlaying(false)
      } else {
        s.t = nt
        s.active = nearest(nt)
      }
      tick()
    }

    const timer = setInterval(step, 80)
    return () => clearInterval(timer)
  }, [playing])

  /* scrub drag — mouse + touch */
  useEffect(() => {
    const fromEvent = (e) => {
      const el = scrubRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx_ = e.touches ? e.touches[0].clientX : e.clientX
      seek(((cx_ - r.left) / r.width) * TOTAL)
    }

    const onMove = (e) => dragging.current && fromEvent(e)
    const onTouchMove = (e) => {
      if (!dragging.current) return
      fromEvent(e)
      e.preventDefault()
    }
    const onUp = () => (dragging.current = false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [seek])

  if (!session) return <Navigate to="/sessions" replace />

  const { t, active } = tl.current
  const moment = active > -1 ? MOMENTS[active] : null
  const pos = (t / TOTAL) * 100

  const startDrag = (e) => {
    dragging.current = true
    const r = scrubRef.current.getBoundingClientRect()
    const cx_ = e.touches ? e.touches[0].clientX : e.clientX
    seek(((cx_ - r.left) / r.width) * TOTAL)
    if (e.touches) e.preventDefault()
  }

  return (
    <div className="wrap pb-4xl pt-xl">
      <Link
        to="/sessions"
        className="mb-md inline-flex items-center gap-[6px] rounded-pill bg-surface px-md py-[8px] text-[12px] font-medium text-ink2 transition-colors hover:bg-surface2 hover:text-ink"
      >
        <ArrowLeft size={13} strokeWidth={2.2} />
        All sessions
      </Link>

      <ScreenHeader title="Game review" sub={session.d} />

      <div className="flex flex-wrap items-start gap-xl">
        {/* ---------------- viewport + timeline ---------------- */}
        <div className="min-w-[420px] max-w-[1100px] flex-1">
          {/* point-cloud replay */}
          <div className="relative h-[340px] overflow-hidden rounded-lg bg-surface sq">
            <PointCloud />

            <PointCloudLegend className="absolute bottom-md left-md" />

            {MOMENTS.map((m, i) =>
              m.insight ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => goMoment(i)}
                  style={{ left: `${m.pin[0]}%`, top: `${m.pin[1]}%` }}
                  className={cx(
                    'absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-pill px-[12px] py-[5px] text-[11px] font-medium transition-colors duration-180',
                    'after:absolute after:bottom-[-8px] after:left-1/2 after:h-[8px] after:w-[2px] after:rounded-pill after:bg-current after:content-[""]',
                    i === active
                      ? 'bg-ink text-panel'
                      : 'bg-panel/90 text-ink2 hover:bg-panel hover:text-ink'
                  )}
                >
                  {m.insight}
                </button>
              ) : null
            )}
          </div>

          {/* ---------------- transport + timeline ---------------- */}
          <div className="mt-md flex flex-wrap items-center gap-md">
            <Button
              variant={playing ? 'fill' : 'outline'}
              className="w-[96px]"
              onClick={() => {
                if (playing) pause()
                else {
                  setCont(null)
                  setPlaying(true)
                }
              }}
            >
              {playing ? <Pause size={12} /> : <Play size={12} />}
              {playing ? 'Pause' : 'Play'}
            </Button>

            <span className="num text-[26px] font-extrabold tracking-tightest text-ink">
              {fmt(t)}
              <span className="font-medium text-ink3"> / {fmt(TOTAL)}</span>
            </span>

            <span className="quiet ml-auto">
              {moment
                ? `moment ${active + 1} of ${MOMENTS.length} · ${moment.label}`
                : `${MOMENTS.length} moments`}
            </span>
          </div>

          <div
            className={cx(
              'relative mt-md',
              moment?.insight ? 'pb-[190px]' : 'pb-sm'
            )}
          >
            {/* moment labels along the track */}
            <div className="relative h-[24px]">
              {MOMENTS.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goMoment(i)}
                  title={m.label}
                  style={{ left: `${(m.t / TOTAL) * 100}%` }}
                  className={cx(
                    'num absolute top-0 -translate-x-1/2 rounded-pill px-[10px] py-[4px] text-[10px] font-semibold leading-none transition-colors duration-180',
                    i === active
                      ? 'bg-ink text-panel'
                      : 'bg-surface text-ink3 hover:bg-surface2 hover:text-ink'
                  )}
                >
                  {fmt(m.t)}
                  {m.insight && (
                    <i
                      aria-hidden="true"
                      className="ml-[5px] inline-block h-[5px] w-[5px] rounded-pill align-middle"
                      style={{ background: hlFill('lime') }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* thin scrub track */}
            <div
              ref={scrubRef}
              role="slider"
              tabIndex={0}
              aria-label="Session timeline"
              aria-valuemin={0}
              aria-valuemax={TOTAL}
              aria-valuenow={Math.round(t)}
              aria-valuetext={fmt(t)}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') seek(t + 15)
                if (e.key === 'ArrowLeft') seek(t - 15)
              }}
              className="relative h-[34px] min-w-[220px] cursor-pointer select-none"
            >
              {/* track */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-[8px] block h-[4px] rounded-pill bg-surface2"
              />
              <span
                aria-hidden="true"
                className="absolute left-0 top-[8px] block h-[4px] rounded-pill bg-ink2/50"
                style={{ width: `${pos}%` }}
              />

              {/* minute ticks */}
              {TICKS.map((sec) => (
                <span
                  key={sec}
                  aria-hidden="true"
                  className="absolute top-[17px] block h-[6px] w-[2px] rounded-pill bg-surface2"
                  style={{ left: `${(sec / TOTAL) * 100}%` }}
                />
              ))}
              <span
                aria-hidden="true"
                className="num absolute bottom-0 left-0 text-[9px] font-medium text-ink3"
              >
                00:00
              </span>
              <span
                aria-hidden="true"
                className="num absolute bottom-0 right-0 text-[9px] font-medium text-ink3"
              >
                {fmt(TOTAL)}
              </span>

              {/* moment markers on the track */}
              {MOMENTS.map((m, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute top-[5px] block h-[10px] w-[10px] -translate-x-1/2 rounded-pill"
                  style={{
                    left: `${(m.t / TOTAL) * 100}%`,
                    background:
                      i === active ? 'rgb(var(--c-ink))' : hlFill('lime'),
                  }}
                />
              ))}

              {/* playhead: a thin ink line with a marker dot */}
              <span
                aria-hidden="true"
                className="absolute top-0 block h-[24px] w-[2px] rounded-pill bg-ink"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute -left-[3px] -top-[3px] block h-[8px] w-[8px] rounded-pill bg-ink" />
              </span>
            </div>

            {/* pattern-candidate callout, anchored near its moment */}
            {moment?.insight && (
              <Callout
                eyebrow="Pattern candidate"
                title={moment.insight}
                className="absolute top-[70px] -translate-x-1/2 animate-fade-rise"
                style={{
                  left: `clamp(150px, ${(moment.t / TOTAL) * 100}%, calc(100% - 150px))`,
                }}
              >
                {moment.desc}
              </Callout>
            )}
          </div>

          {cont && (
            <div className="mt-md flex flex-wrap items-center gap-md rounded-pill bg-surface2/60 py-[10px] pl-lg pr-[10px]">
              <span className="flex-1 text-[13px] text-ink2">
                Paused at <b className="font-semibold text-ink">{cont}</b>
              </span>
              <Button
                variant="fill"
                size="sm"
                onClick={() => {
                  setCont(null)
                  const s = tl.current
                  s.t += 6
                  s.active = -1
                  tick()
                  setPlaying(true)
                }}
              >
                Continue →
              </Button>
            </div>
          )}

          {/* tracks */}
          <SectionLabel className="mb-sm mt-lg">Tracks</SectionLabel>

          {TRACK_LABELS.map(([key, label]) => (
            <div
              key={key}
              className="mb-sm flex flex-wrap items-stretch overflow-hidden rounded-card bg-surface sq"
            >
              <div className="w-[160px] shrink-0 px-md py-[14px] text-[10px] font-medium uppercase tracking-label text-ink2">
                {label}
              </div>
              <div className="flex min-h-[46px] flex-1 flex-wrap items-center gap-[5px] px-md py-sm">
                {key === 'lidar'
                  ? TRACKS.lidar.map((w, i) => (
                      <span
                        key={i}
                        className="h-[14px] rounded-pill bg-surface2"
                        style={{ width: `${w}px` }}
                      />
                    ))
                  : TRACKS[key].map((h, i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-pill"
                        style={{
                          height: `${h}px`,
                          background:
                            key === 'phys'
                              ? hlFill('sky')
                              : 'rgb(var(--c-surface2))',
                        }}
                      />
                    ))}
              </div>
            </div>
          ))}

          {/* insights track */}
          <div className="mb-sm flex flex-wrap items-stretch overflow-hidden rounded-card bg-surface sq">
            <div className="w-[160px] shrink-0 px-md py-[14px] text-[10px] font-medium uppercase tracking-label text-ink2">
              Insights
            </div>
            <div className="flex min-h-[46px] flex-1 flex-wrap items-center gap-sm px-md py-sm">
              {MOMENTS.map((m, i) =>
                m.insight ? (
                  <Chip key={i} on={i === active} onClick={() => goMoment(i)}>
                    {m.insight}
                  </Chip>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* ---------------- side column ---------------- */}
        <div className="w-[280px] shrink-0">
          <SectionLabel className="mb-sm">Session stats</SectionLabel>
          <Card padded={false} className="p-sm">
            {SESSION_STAT_ROWS.map(([label, key]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-md rounded-sm px-md py-[11px] text-[13px] text-ink2"
              >
                <span>{label}</span>
                <Num
                  value={String(session[key])}
                  className="text-[17px] font-bold text-ink"
                />
              </div>
            ))}
          </Card>

          <SectionLabel className="mb-sm mt-lg">Moments</SectionLabel>
          <Stagger>
            {MOMENTS.map((m, i) => (
              <StaggerItem key={i}>
                <button
                  type="button"
                  onClick={() => goMoment(i)}
                  className={cx(
                    'mb-sm block w-full rounded-card px-md py-[13px] text-left text-[12px] leading-snug transition-colors duration-180 sq',
                    i === active
                      ? 'bg-ink text-panel'
                      : 'bg-surface text-ink2 hover:bg-surface2 hover:text-ink'
                  )}
                >
                  <span className="num font-semibold">
                    {String(i + 1).padStart(2, '0')}
                  </span>{' '}
                  · {m.label}{' '}
                  <span className="num opacity-60">{fmt(m.t)}</span>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </div>
  )
}
