import { useEffect, useRef } from 'react';
import { cx } from '../../lib/css';
import { prefersReducedMotion } from '../../lib/enter';
import { colorSurface, dotCanvas } from '../../tokens';
import { hasFinePointer } from './scroll';
import styles from './DotCanvas.module.css';

export interface DotCanvasProps {
  className?: string;
}

/**
 * THE TACTILE DOT FIELD.
 *
 * A grid of dots that answers the pointer: everything inside a
 * radius grows and is pushed gently away, and eases back as the
 * pointer leaves. One canvas, one rAF loop, and the loop parks
 * itself the moment the whole field has settled.
 *
 * THIS IS THE ONE PLACE ON THE PAGE A CANVAS IS THE RIGHT ANSWER,
 * and it is worth saying why, because every other field here is
 * DOM. A block this size holds around two thousand dots. As nodes
 * that is two thousand elements to lay out, and — the part that
 * actually breaks — two thousand style writes per frame while the
 * pointer moves, which is a main-thread stall you can feel in the
 * scroll. Drawn, it is one element, one context and one loop, and
 * the per-dot work is arithmetic rather than layout.
 *
 * Off under reduced motion and on touch: the field renders once,
 * flat and static, and never listens for a pointer.
 */
export function DotCanvas({ className }: DotCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const reactive = !prefersReducedMotion() && hasFinePointer();

    /* the live field. `ox`/`oy` are each dot's current offset from
       its grid position and `s` its current size — the three values
       the loop eases, and the only per-dot state there is. */
    let dots: Array<{ x: number; y: number; ox: number; oy: number; s: number }> = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -1e4, y: -1e4, on: false };
    let raf = 0;
    let running = false;

    const build = () => {
      const rect = el.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      el.width = width * dpr;
      el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { pitch, size } = dotCanvas;
      const cols = Math.ceil(width / pitch) + 1;
      const rows = Math.ceil(height / pitch) + 1;
      /* the grid is centred in the block, so the field reads as a
         ruled surface the block was cut out of rather than as a
         pattern that happens to start at the top left */
      const left = (width - (cols - 1) * pitch) / 2;
      const top = (height - (rows - 1) * pitch) / 2;

      dots = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          dots.push({ x: left + col * pitch, y: top + row * pitch, ox: 0, oy: 0, s: size });
        }
      }
    };

    /* THE DOT IS A SQUIRCLE WHEREVER THE CANVAS CAN DRAW ONE.

       `roundRect` is the right primitive — the dot language of this
       product is a soft square, never a circle and never a hard
       corner — and it is also recent enough that a browser without
       it would throw inside the animation loop and take the whole
       field down. The corner is dropped rather than the field. */
    const rounded = typeof ctx.roundRect === 'function';

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      /* BARELY THERE. It was the tertiary ink at a fifth opacity on
         a level1 ground, which is a lot of contrast for a texture —
         the field read as dirt on the surface rather than as the
         surface having a grain. Two steps quieter: a lighter ink and
         a lower floor, so the block reads as paper with a tooth. */
      ctx.fillStyle = colorSurface.level2;
      for (const dot of dots) {
        const half = dot.s / 2;
        ctx.globalAlpha = dotCanvas.alpha + (dot.s / (dotCanvas.size + dotCanvas.grow)) * dotCanvas.alphaLift;
        const x = dot.x + dot.ox - half;
        const y = dot.y + dot.oy - half;
        if (rounded) {
          ctx.beginPath();
          ctx.roundRect(x, y, dot.s, dot.s, half * 0.42);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, dot.s, dot.s);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      raf = 0;
      const { radius, push, grow, size, ease } = dotCanvas;
      let moving = false;

      for (const dot of dots) {
        let targetX = 0;
        let targetY = 0;
        let targetS = size;

        if (pointer.on) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            /* falloff is squared, so the effect has a soft edge and a
               firm middle rather than a visible circular boundary */
            const t = 1 - dist / radius;
            const force = t * t;
            const unit = dist || 1;
            targetX = (dx / unit) * push * force;
            targetY = (dy / unit) * push * force;
            targetS = size + grow * force;
          }
        }

        dot.ox += (targetX - dot.ox) * ease;
        dot.oy += (targetY - dot.oy) * ease;
        dot.s += (targetS - dot.s) * ease;

        if (
          Math.abs(targetX - dot.ox) > 0.05 ||
          Math.abs(targetY - dot.oy) > 0.05 ||
          Math.abs(targetS - dot.s) > 0.01
        ) {
          moving = true;
        }
      }

      paint();

      /* the loop parks itself once the field is at rest — an idle
         canvas should not be waking the compositor sixty times a
         second for a picture that is not changing */
      if (moving && running) raf = requestAnimationFrame(tick);
      else running = false;
    };

    const wake = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.on = true;
      wake();
    };

    const onLeave = () => {
      pointer.on = false;
      wake();
    };

    const onResize = () => {
      build();
      paint();
      wake();
    };

    build();
    paint();

    /* the block is sized in `dvh` and by the page's own gutter, so it
       can change without the window doing anything the `resize` event
       would report — a font landing, the scale stepping. The observer
       is the honest signal; it fires once on observe as well, which
       covers the case where the first build ran before layout. */
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    if (reactive) {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    }

    return () => {
      ro.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvas} className={cx(styles.canvas, className)} aria-hidden="true" />;
}
