import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  createMotionPresetEvaluator,
  createProceduralDotMatrix,
  renderDotMatrix,
  type DotMatrixRecipe,
} from '../../vendor/pixel-motion/engine';

export interface AmbientFieldProps {
  /** a procedural recipe. Its `canvas` is the NOMINAL cut — see below. */
  recipe: DotMatrixRecipe;
  /** how long the field takes to sweep in on mount, in ms */
  revealDuration?: number;
  className?: string;
  ariaLabel?: string;
}

/* ============================================================
   THE AMBIENT FIELD — the fifteen cards on Focus & vitals and
   Insights.

   WHY THIS IS NOT `PixelAnimation`. The vendored component is the
   upstream tool's own host and it does two things this screen cannot
   live with:

   1. IT PASSES NO `revealDuration`, so a procedural field is simply
      there from the first frame. The twelve Patterns cards sweep in
      column by column every time you enter the tab, and these fifteen
      have to do the same — it is the same gesture on the same screen,
      and a card that does not make it reads as a card that did not
      load.

   2. ITS CANVAS IS THE RECIPE'S. A recipe carries one logical grid
      and a well has a different shape at every breakpoint, so a fixed
      grid letterboxes into a band at any width the recipe was not cut
      for. That band is what this file exists to remove.

   Neither can be fixed upstream from here — `src/vendor/` is re-copied
   wholesale, never patched — so the host loop lives here instead. The
   DRAWING is still entirely the engine's: `createProceduralDotMatrix`
   builds the composition, `createMotionPresetEvaluator` runs the
   preset, `renderDotMatrix` paints. Only the canvas element, the
   requestAnimationFrame loop and the two things above are ours, and
   they are a deliberate, documented copy of `DotMatrixCanvas` rather
   than a wrapper around it.

   `PixelAnimation` stays vendored as the upstream reference. Nothing
   in the app renders it.
   ============================================================ */

/** the engine's own curve, from `engine/dot-matrix/presets/types.ts`.
 *  Two lines rather than a deep import into the vendored tree, which
 *  would break the next time the engine is re-copied. */
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const amount = Math.min(1, Math.max(0, (value - edge0) / Math.max(0.0001, edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** the same 700ms the twelve Patterns recipes sweep in over */
const REVEAL_MS = 700;

/* THE LOGICAL FIELD IS 96 WIDE, LIKE EVERY OTHER RECIPE IN THE
   PRODUCT — that is what fixes the dot's size relative to its card,
   and it is why a vitals dot and a Patterns dot read as the same
   material. Only the number of ROWS is fitted to the well. */
const LOGICAL_WIDTH = 96;

/**
 * The logical grid for a box, snapped so the dots tile it EXACTLY.
 *
 * `createGridLayout` lays down whole cells and centres what it lays
 * down, so a logical size that is not `count * pitch - gap` leaves a
 * strip of bare canvas at the edge — at pitch 5 over 96 that strip was
 * 1px left and 2px right on every card in the app, and it is visible
 * once the field is meant to reach the edge of its well.
 *
 * Solving for the count instead makes the strip zero in both axes: the
 * field IS the canvas. The row count then follows from the measured
 * box, so the canvas ratio tracks the well at every breakpoint rather
 * than at the one it was cut for.
 */
function fitGrid(box: { width: number; height: number }, pixelSize: number, gap: number) {
  const pitch = pixelSize + gap;
  const columns = Math.max(1, Math.floor((LOGICAL_WIDTH + gap) / pitch));
  const logicalWidth = columns * pitch - gap;
  const rows = Math.max(
    1,
    Math.round((logicalWidth * (box.height / Math.max(1, box.width)) + gap) / pitch),
  );
  return { logicalWidth, logicalHeight: rows * pitch - gap };
}

export function AmbientField({
  recipe,
  revealDuration = REVEAL_MS,
  className,
  ariaLabel = 'Ambient dot field',
}: AmbientFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* The fitted grid, held as state so it survives a re-render and so a
     well that has not moved cannot rebuild the composition.

     IT IS SEEDED FROM THE RECIPE'S NOMINAL CUT, AND THAT SEED IS LOAD
     BEARING. Starting it empty looks tidier and is wrong: a canvas
     with no `width`/`height` attribute has the intrinsic 300x150 every
     replaced element has, so the FIRST layout hands these wells a 2:1
     box that has nothing to do with the design. The measurement then
     settles on that shape and the card keeps it. Seeding with the
     nominal cut means the first layout is already the right shape and
     the fit only has to correct it, at the cost of one extra
     composition on mount. */
  const [grid, setGrid] = useState(() => ({
    logicalWidth: recipe.canvas.logicalWidth,
    logicalHeight: recipe.canvas.logicalHeight,
  }));

  /* ---- MEASURE THE BOX, NOT THE RECIPE -------------------------
     The canvas is `width: 100%; height: 100%` of its well's content
     box, so its own border box IS the box to fill. Reading it back is
     circular on the wells whose height comes from the graphic — but
     it is a circle that closes on itself immediately: a canvas cut to
     ratio r makes the well ratio r, and fitting to ratio r returns r.

     The chatter guard is the integer. `fitGrid` returns whole rows,
     and state only moves when that integer moves, so a sub-pixel
     reflow cannot restart the animation and a settling grid cannot
     ping-pong. Measured across all fifteen it settles on the first
     observation and does not move again. */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const next = fitGrid({ width, height }, recipe.pixelStyle.pixelSize, recipe.pixelStyle.gap);
      setGrid((previous) => (
        previous.logicalWidth === next.logicalWidth
          && previous.logicalHeight === next.logicalHeight
          ? previous
          : next
      ));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [recipe]);

  /* ---- THE COMPOSITION ------------------------------------------
     Memoised on the recipe BY REFERENCE and on the two fitted
     integers, exactly the contract `DataDotMatrix` keeps: the recipes
     are frozen module-level constants, so this rebuilds only when the
     well genuinely changes shape. */
  const generated = useMemo(() => createProceduralDotMatrix({
    ...recipe,
    canvas: { ...recipe.canvas, ...grid },
  }), [grid, recipe]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const { composition, palettes } = generated;

    canvas.width = composition.width;
    canvas.height = composition.height;
    context.imageSmoothingEnabled = false;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let startedAt = performance.now();

    const render = (now: number) => {
      const reducedMotion = reducedMotionQuery.matches;
      const elapsedMs = reducedMotion ? 0 : now - startedAt;
      const revealProgress = reducedMotion || revealDuration <= 0
        ? 1
        : clamp01(elapsedMs / revealDuration);

      /* THE SWEEP. `createDotMatrixCell` already gives every
         procedural cell a `revealAt` of `column / (columns - 1)`, so
         the wipe runs left to right, and the window either side of it
         is the engine's own — the same 0.055/0.025 smoothstep
         `createDataEvaluator` uses on the Patterns cards. Same
         gesture, same timing, same easing. */
      const evaluate = createMotionPresetEvaluator({
        ...recipe,
        canvas: { ...recipe.canvas, ...grid },
      }, composition, elapsedMs / 1000);

      renderDotMatrix(context, composition, palettes, {
        elapsedMs,
        reducedMotion,
        revealProgress,
      }, (cell) => {
        const frame = evaluate(cell);
        const reveal = smoothstep(cell.revealAt - 0.055, cell.revealAt + 0.025, revealProgress);
        return { ...frame, activation: frame.activation * reveal };
      }, {
        background: recipe.canvas.background,
        motionAmount: recipe.motionAmount,
        speed: recipe.speed,
      });

      if (!reducedMotion) animationFrame = requestAnimationFrame(render);
    };

    const restart = () => {
      cancelAnimationFrame(animationFrame);
      startedAt = performance.now();
      animationFrame = requestAnimationFrame(render);
    };

    reducedMotionQuery.addEventListener('change', restart);
    animationFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrame);
      reducedMotionQuery.removeEventListener('change', restart);
    };
  }, [generated, grid, recipe, revealDuration]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={ariaLabel} />;
}
