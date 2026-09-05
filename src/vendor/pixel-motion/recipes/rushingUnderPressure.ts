import type { DataDotMatrixRecipe } from '../engine';

/* RUSHING UNDER PRESSURE — the matrix on fan card 0.
 *
 * Authored in render-engine-tool and pasted here VERBATIM. The hex
 * values are the engine's own palette, not AERA tokens, and they stay
 * literal on purpose — see ../README.md.
 *
 * BOTH EXPORTS ARE MODULE-LEVEL CONSTANTS, and that is load-bearing
 * rather than tidiness. `DataDotMatrix` memoizes the composition on
 * `recipe` and `data` BY REFERENCE, and `DotMatrixCanvas` restarts its
 * rAF loop whenever the composition identity changes. An object
 * literal written inline in JSX is a new reference on every render, so
 * the animation would restart every frame and the reveal would never
 * get past its first instant. Import these; never inline them.
 */
export const RUSHING_RECIPE: DataDotMatrixRecipe = {
  type: 'data-dot-matrix',
  visualization: 'area-zone',
  seed: 73129,
  format: { ratio: 'custom', width: 328, height: 300 },
  canvas: {
    logicalWidth: 96,
    logicalHeight: 88,
    displayWidth: 328,
    displayHeight: 300,
    background: '#F3F2EE',
  },
  color: '#93EAC3',
  comparisonColors: ['#93EAC3', '#FFE159', '#FF9868'],
  pixelStyle: { pixelSize: 1, gap: 1, density: 1 },
  motion: {
    preset: 'drift',
    amount: 0.33,
    speed: 0.69,
    revealDuration: 1400,
  },
  domain: { mode: 'zero-to-100' },
};

/** the series the area zone is cut from — six sessions, falling */
export const RUSHING_SERIES = [52, 50, 50, 44, 40, 32];
