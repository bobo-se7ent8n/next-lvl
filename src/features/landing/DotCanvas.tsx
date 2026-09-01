import { useEffect, useRef } from 'react';
import { cx } from '../../lib/css';
import { prefersReducedMotion } from '../../lib/enter';
import { colorData, colorSurface, dotCanvas } from '../../tokens';
import { hasFinePointer } from './scroll';
import styles from './DotCanvas.module.css';

export interface DotCanvasProps {
  className?: string;
}

/* ============================================================
   THE COLOUR UNDER THE POINTER

   The five palette hues, in the order the palette declares them.
   Read from the token object rather than listed here, so the field
   can never be lit in a colour the product does not have.
   ============================================================ */
const ACCENTS = Object.values(colorData);

/** `#RRGGBB` → three numbers */
function rgbOf(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** WHICH HUE A DOT WEARS — from its index, and only from its index.
 *
 *  Deterministic, so the same patch of field comes up the same
 *  colours every time the pointer crosses it: a hue drawn at random
 *  per frame flickers, and one drawn at random per pass makes the
 *  same corner a different colour every time you go back to it.
 *
 *  Not `i % 5`. The field is a grid, so a modulo over the index
 *  paints diagonal stripes you can read as a pattern the moment two
 *  of them are lit. Multiplying by the golden ratio and keeping the
 *  fraction spreads consecutive indices about as far apart as a
 *  sequence can, which is what makes the lit area read as scattered
 *  confetti rather than as a rainbow gradient. */
const PHI = 0.618033988749895;

function toneOf(index: number): number {
  return Math.floor(((index * PHI) % 1) * ACCENTS.length);
}

/* THE RAMP, BUILT ONCE.

   For each hue, `colorSteps` blends from the resting field colour to
   the hue itself. Blending per dot per frame would be two thousand
   colour strings a frame; this is eighty for the life of the module,
   and at this many steps the quantisation is invisible. */
const RAMP: string[][] = (() => {
  const base = rgbOf(colorSurface.level2);
  const steps = dotCanvas.colorSteps;
  return ACCENTS.map((hex) => {
    const to = rgbOf(hex);
    return Array.from({ length: steps }, (_, s) => {
      const t = s / (steps - 1);
      const mix = base.map((c, ch) => Math.round(c + (to[ch] - c) * t));
      return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
    });
  });
})();

/* THE RETURN, AS A SHARE OF THE REMAINING DISTANCE PER FRAME.

   `colorFade` is a duration token; this is the decay rate that
   covers all but two percent of the distance in exactly that long at
   sixty frames a second. Exponential, so there is no overshoot in it
   anywhere — the register is resistance, and a colour that sprang
   back would be the field being pleased with itself. */
const COLOUR_STEP =
  1 - Math.pow(0.02, 1 / Math.max(1, Number.parseFloat(dotCanvas.colorFade) / (1000 / 60)));

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
       its grid position, `s` its current size and `c` how much of its
       own hue it is currently wearing — the four values the loop
       eases, and the only per-dot state there is. `tone` is fixed at
       build time and never changes. */
    let dots: Array<{
      x: number;
      y: number;
      ox: number;
      oy: number;
      s: number;
      c: number;
      tone: number;
    }> = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    /* THE REACH, READ ONCE PER BUILD RATHER THAN PER FRAME. It is a
       landing token — `--aera-landing-footer-cursor-radius` — so it
       arrives already stepped down by the layout scale, and the only
       time it can change is when the block is re-measured. */
    let radius: number = dotCanvas.radius;
    const pointer = { x: -1e4, y: -1e4, on: false };
    let raf = 0;
    let running = false;

    /* OFF `outline-offset`, NOT OFF THE CUSTOM PROPERTY ITSELF.

       An unregistered custom property has no syntax, so
       `getPropertyValue` hands its value back exactly as written —
       `calc(300px * min(0.94, 0.88))` — and there is no number in
       that to parse. The stylesheet assigns the token to a real
       property, which the engine resolves to absolute pixels; see
       the note in DotCanvas.module.css. The fallback covers the one
       frame before the token block has been injected. */
    const readRadius = () => {
      const value = Number.parseFloat(getComputedStyle(el).outlineOffset);
      radius = Number.isFinite(value) && value > 0 ? value : dotCanvas.radius;
    };

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
          dots.push({
            x: left + col * pitch,
            y: top + row * pitch,
            ox: 0,
            oy: 0,
            s: size,
            c: 0,
            /* the hue is the dot's, for the life of the field — see
               `toneOf`. Nothing per-frame ever touches it. */
            tone: toneOf(dots.length),
          });
        }
      }

      readRadius();
    };

    /* THE DOT IS A SQUIRCLE WHEREVER THE CANVAS CAN DRAW ONE.

       `roundRect` is the right primitive — the dot language of this
       product is a soft square, never a circle and never a hard
       corner — and it is also recent enough that a browser without
       it would throw inside the animation loop and take the whole
       field down. The corner is dropped rather than the field. */
    const rounded = typeof ctx.roundRect === 'function';

    /* the ramp's last index — named apart from `build`'s own
       `top`, which is a grid offset and a different thing */
    const rampTop = dotCanvas.colorSteps - 1;

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      /* BARELY THERE. It was the tertiary ink at a fifth opacity on
         a level1 ground, which is a lot of contrast for a texture —
         the field read as dirt on the surface rather than as the
         surface having a grain. Two steps quieter: a lighter ink and
         a lower floor, so the block reads as paper with a tooth. */
      ctx.fillStyle = colorSurface.level2;
      /* the last colour written, so a run of resting dots costs one
         `fillStyle` assignment between them rather than one each */
      let fill: string = colorSurface.level2;
      for (const dot of dots) {
        const half = dot.s / 2;
        const grain =
          dotCanvas.alpha + (dot.s / (dotCanvas.size + dotCanvas.grow)) * dotCanvas.alphaLift;
        /* THE HUE AND THE WEIGHT ARRIVE TOGETHER. The resting field
           is a texture and is deliberately faint; a coloured dot is
           the field answering a hand and has to be seen, so the alpha
           travels with the colour instead of leaving the hue washed
           out at the texture's own floor. */
        ctx.globalAlpha = grain + (dotCanvas.colorAlpha - grain) * dot.c;
        const next =
          dot.c > 0 ? RAMP[dot.tone][Math.round(dot.c * rampTop)] : colorSurface.level2;
        if (next !== fill) {
          fill = next;
          ctx.fillStyle = next;
        }
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
      const { push, grow, size, ease } = dotCanvas;
      let moving = false;

      for (const dot of dots) {
        let targetX = 0;
        let targetY = 0;
        let targetS = size;
        let targetC = 0;

        if (pointer.on) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            const t = 1 - dist / radius;
            /* THE TWO FALLOFFS ARE NOT THE SAME, and deliberately.

               The PUSH is squared, so the displacement has a soft
               edge and a firm middle rather than a visible circular
               boundary of dots all shoved the same distance.

               The COLOUR is LINEAR in the distance: it has to read as
               light falling off across the whole reach, and a squared
               falloff over three hundred pixels puts nearly all of
               the hue in the middle fifty and leaves a wide ring of
               field that is technically lit and looks untouched. */
            const force = t * t;
            const unit = dist || 1;
            targetX = (dx / unit) * push * force;
            targetY = (dy / unit) * push * force;
            targetS = size + grow * force;
            targetC = t;
          }
        }

        dot.ox += (targetX - dot.ox) * ease;
        dot.oy += (targetY - dot.oy) * ease;
        dot.s += (targetS - dot.s) * ease;
        /* the colour drains on its own rate — see `COLOUR_STEP` */
        dot.c += (targetC - dot.c) * COLOUR_STEP;

        if (
          Math.abs(targetX - dot.ox) > 0.05 ||
          Math.abs(targetY - dot.oy) > 0.05 ||
          Math.abs(targetS - dot.s) > 0.01 ||
          Math.abs(targetC - dot.c) > 0.004
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
