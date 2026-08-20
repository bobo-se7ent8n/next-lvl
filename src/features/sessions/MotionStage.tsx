import { useEffect, useMemo, useRef, useState } from 'react';
import { cx } from '../../lib/css';
import { Label, Mono } from '../../components/primitives/Text';
import { Legend } from '../../components/viz/Legend';
import { clamp } from '../../lib/chart';
import { withAlpha } from '../../lib/color';
import {
  CAMERA,
  ORBIT,
  STAGE_EXTENT,
  floorRings,
  foreshorten,
  frameVolume,
  orbit,
  phaseAt,
  type PointGroup,
  type VolumePoint,
} from '../../lib/pose';
import { colorData, colorInk } from '../../tokens';
import styles from './MotionStage.module.css';

/** the three groups are told apart by the AERA palette and nothing else */
const GROUP_COLOR: Record<Exclude<PointGroup, 'floor'>, string> = {
  you: colorData.lilac,
  opponents: colorData.orange,
  ball: colorData.yellow,
};

const Icon = {
  play: 'M8 5v14l11-7z',
  pause: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  down: 'M6 9l6 6 6-6',
};

const Glyph = ({ d, filled }: { d: string; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

/* Building an rgba() string per point meant a couple of thousand
   string allocations on every frame of playback. The alpha is
   quantised into steps and the resulting fills are cached, so a frame
   sets a handful of distinct colours instead of one per dot. */
const FILL_CACHE = new Map<string, string>();

function fillFor(base: string, alpha: number): string {
  const step = Math.round(alpha * 24) / 24;
  const key = `${base}${step}`;
  let value = FILL_CACHE.get(key);
  if (!value) {
    value = withAlpha(base, step);
    FILL_CACHE.set(key, value);
  }
  return value;
}

/** a stable 0..1 per point — the omission has to be the same on every
 *  frame or the cloud would fizz */
function jitter(p: VolumePoint): number {
  const s = Math.sin(p.x * 127.1 + p.y * 311.7 + p.z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

/** hh:mm:ss → seconds */
function parseClock(stamp: string): number {
  const parts = stamp.split(':').map(Number);
  return parts.reduce((acc, part) => acc * 60 + (Number.isFinite(part) ? part : 0), 0);
}

/** seconds → mm:ss.t, the running readout on the transport */
function formatClock(seconds: number): string {
  const whole = Math.floor(seconds);
  const mm = String(Math.floor(whole / 60)).padStart(2, '0');
  const ss = String(whole % 60).padStart(2, '0');
  return `${mm}:${ss}.${Math.floor((seconds - whole) * 10)}`;
}

export interface StageMoment {
  id: string;
  title: string;
  timestamp: string;
  seconds: number;
}

export interface MotionStageProps {
  moments: StageMoment[];
  /** which moment is on the stage */
  index: number;
  onMoment: (next: number) => void;
  /** 0..1 along the moment — the same axis the timeline draws */
  playhead: number;
  onPlayhead: (next: number) => void;
  className?: string;
}

/** The stage. A volumetric figure that actually moves as the playhead
 *  moves, drawn as points on a 2D canvas with a camera in front of it:
 *  a ground plane, density falling off with distance, and
 *  foreshortening, so the thing has depth without a 3D library. The
 *  transport is an overlay inside the frame rather than a row of
 *  buttons floating underneath it. */
export function MotionStage({
  moments,
  index,
  onMoment,
  playhead,
  onPlayhead,
  className,
}: MotionStageProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ w: 900, h: 480 });
  /* where the camera is standing. Dragging the stage walks it around
     the action rather than moving the action. */
  const [view, setView] = useState({ yaw: 0, lift: CAMERA.height });
  const drag = useRef<{ x: number; y: number; yaw: number; lift: number } | null>(null);
  const head = useRef(playhead);

  const moment = moments[index];
  const seconds = moment?.seconds ?? 1;

  /* the floor never changes, so it is built once */
  const floor = useMemo(() => floorRings(), []);

  useEffect(() => {
    head.current = playhead;
  }, [playhead]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Playback runs to the end of the moment and PAUSES on the next one.
     A moment is a thing you look at: the transport rolls you up to the
     next one and then waits for you. */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const next = head.current + dt / seconds;
      if (next >= 1) {
        setPlaying(false);
        if (index < moments.length - 1) {
          onMoment(index + 1);
          onPlayhead(0);
        } else {
          onPlayhead(1);
        }
        return;
      }
      onPlayhead(next);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, seconds, index, moments.length, onMoment, onPlayhead]);

  /* the dropdown closes on escape, or on a press anywhere outside it */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  /* ---- the frame: volume → camera → canvas ---- */
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = size.w * dpr;
    el.height = size.h * dpr;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    /* one metre, in pixels, at the origin */
    const unit = Math.min(size.w / (STAGE_EXTENT.x * 1.5), size.h / (STAGE_EXTENT.y * 1.42));
    /* the drive carries the shooter about a metre up-court, so the
       stage is framed on the middle of that travel rather than on the
       origin — otherwise the whole group sits right of centre */
    const originX = size.w / 2 - 0.45 * unit;
    /* The eye line. Everything is measured off the camera height, so a
       point on the floor lands lower on screen the nearer it is — that
       is what turns the ground rings into ellipses. The floor sits high
       enough in the frame that the nearest figure still has its feet
       above the transport bar. */
    const horizonY = size.h * 0.71 - view.lift * unit;
    /* small enough that a limb is three dots across rather than one —
       a dot the size of a forearm is a stick figure again */
    const base = Math.max(1.4, unit * 0.032);

    /* the orbit is applied before anything is sorted or projected, so
       depth ordering follows the camera rather than the model */
    const points: VolumePoint[] = [...floor, ...frameVolume(playhead)];
    const spun = points.map((p) => ({ p, q: orbit(p, view.yaw) }));
    /* far points first, so nearer ones paint over them */
    spun.sort((a, b) => b.q.z - a.q.z);

    for (const { p, q } of spun) {
      const k = foreshorten(q.z);
      const near = clamp((k - 0.62) / 0.55, 0, 1);
      /* density falloff: the further back a point is, the more of the
         cloud is simply left out of the frame */
      if (jitter(p) > 0.4 + near * 0.6) continue;

      const x = originX + q.x * k * unit;
      const y = horizonY - (q.y - view.lift) * k * unit;
      /* foreshortening, and each dot's own size: the same body draws
         larger the nearer it is, and no two dots are the same */
      const r = base * k * p.size * (p.group === 'ball' ? 1.3 : 1);

      ctx.fillStyle =
        p.group === 'floor'
          ? fillFor(colorInk.primary, 0.05 + p.weight * 0.16 * near)
          : fillFor(GROUP_COLOR[p.group], (0.2 + near * 0.66) * (0.5 + p.weight * 0.5));

      ctx.beginPath();
      ctx.roundRect(x - r / 2, y - r / 2, r, r, r * 0.3);
      ctx.fill();
    }
  }, [playhead, size, floor, view]);

  /* ---- drag to orbit ---- */
  const onOrbitStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, yaw: view.yaw, lift: view.lift };
  };
  const onOrbitMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const from = drag.current;
    if (!from) return;
    setView({
      yaw: clamp(from.yaw + (e.clientX - from.x) * 0.005, -ORBIT.yaw, ORBIT.yaw),
      lift: clamp(from.lift + (e.clientY - from.y) * 0.006, ORBIT.liftMin, ORBIT.liftMax),
    });
  };
  const onOrbitEnd = () => {
    drag.current = null;
  };

  if (!moment) return null;

  const phase = phaseAt(playhead);
  const start = parseClock(moment.timestamp);
  const clock = formatClock(start + playhead * seconds);

  return (
    <div className={cx(styles.stage, className)}>
      {/* the picture, with its own overlays. The transport is NOT in
          here any more — it sits below as a row of the same block. */}
      <div className={styles.frame}>
      <canvas
        ref={canvas}
        className={styles.canvas}
        role="img"
        aria-label={`Motion at ${moment.timestamp}, phase ${phase.label}. Drag to orbit the camera.`}
        onPointerDown={onOrbitStart}
        onPointerMove={onOrbitMove}
        onPointerUp={onOrbitEnd}
        onPointerCancel={onOrbitEnd}
      />

      <Label className={styles.orbitHint} tone="tertiary">
        drag to orbit
      </Label>

      <Label className={styles.phase} tone="secondary">
        {phase.label}
      </Label>
      <Legend
        className={styles.legend}
        items={[
          { label: 'you', color: GROUP_COLOR.you },
          { label: 'opponents', color: GROUP_COLOR.opponents },
          { label: 'ball', color: GROUP_COLOR.ball },
        ]}
      />

      {/* THE TRANSPORT LIVES INSIDE THE FRAME.

          A compact light pill, bottom-centred over the canvas: prev,
          the timecode, the moment it belongs to, the dropdown, next.
          The full-width black bar that used to sit under the canvas
          is gone — its scrub slider and its clock are both here now,
          and its play button moved to the timeline's ruler row where
          it lines up with the tracks it drives. */}
      <div className={styles.transport}>
        <button
          type="button"
          className={cx(styles.button, styles.small)}
          disabled={index === 0}
          aria-label="Previous moment"
          onClick={() => onMoment(index - 1)}
        >
          <Glyph d={Icon.back} />
        </button>

        <Mono className={styles.clock} tone="inherit">
          {clock}
        </Mono>

        <div className={styles.menu} ref={menu}>
          <button
            type="button"
            className={styles.select}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.selectName}>{moment.title}</span>
            <Glyph d={Icon.down} />
          </button>

          {open ? (
            <ul className={styles.list} role="listbox" aria-label="Tracked moments">
              {moments.map((m, i) => (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === index}
                    className={cx(styles.option, i === index && styles.optionOn)}
                    onClick={() => {
                      onMoment(i);
                      setOpen(false);
                    }}
                  >
                    <Mono tone="inherit">{m.timestamp}</Mono>
                    <span className={styles.optionName}>{m.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <button
          type="button"
          className={cx(styles.button, styles.small)}
          disabled={index === moments.length - 1}
          aria-label="Next moment"
          onClick={() => onMoment(index + 1)}
        >
          <Glyph d={Icon.next} />
        </button>
      </div>
      </div>
    </div>
  );
}
