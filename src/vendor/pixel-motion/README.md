# pixel-motion — vendored

A **vendored copy** of the dot-matrix render engine from
[`render-engine-tool`](https://github.com/bobo-se7ent8n/render-engine-tool)
(`src/engine/**`, `src/components/DataDotMatrix.tsx`,
`src/components/DotMatrixCanvas.tsx`).

| | |
| --- | --- |
| **Upstream commit** | `183f2ac` — "Refine independent pixel flicker" |
| **Authored upstream** | 2026-09-04 |
| **Copied here** | 2026-09-05 |

Re-copied wholesale, not merged file by file. To refresh it again, clone
upstream, replace `engine/` and the two components, delete
`engine/engine.test.ts`, redo the one import-path edit below, and update
this block.

## Do not hand-edit

Nothing under this folder is maintained here. If the engine needs a
change, make it in `render-engine-tool` and **re-copy** — a local edit
is silently lost the next time that happens, and it puts this copy out
of step with the tool the recipes are authored in.

The only deliberate divergence from source is the import path: the
components import `./engine` rather than `../engine`, because the
engine sits beside them here instead of one level up.

## What is in here

- `engine/` — pure TypeScript. Grid layout, seeded random, value
  noise, tone/palette generation, the motion presets, the data and
  procedural composition builders, and the canvas 2d renderer.
- `DataDotMatrix.tsx` — takes a `DataDotMatrixRecipe` plus a
  `number[]` series and memoizes the composition off them.
- `DotMatrixCanvas.tsx` — owns its own `requestAnimationFrame` loop
  and its own `prefers-reduced-motion` listener. Do not wrap either.
- `recipes/` — **ours**, not vendored. Recipe objects authored in the
  tool and pasted here verbatim. This is the one folder in this tree
  that is safe to edit.

## Ambient flicker (new in `183f2ac`)

`engine/dot-matrix/ambientFlicker.ts` gives each dot its own opacity
life, timed off precomputed per-cell traits with no spatial term. Three
recipe fields tune it, and **all three are optional**:

| field | default when omitted |
| --- | --- |
| `motion.minOpacity` | `0.16` |
| `motion.maxOpacity` | `0.96` |
| `motion.changeFrequency` | falls back to `motion.amount` |

Every one is read through `??` in `ambientFlickerOpacity`, so a recipe
written before this commit — `rushing` is one — keeps type-checking and
keeps rendering. Omitted means "take the engine default", never
"undefined reaches the renderer". Add them to a recipe only to tune it
away from that default.

## Dependencies

None. Pure React (standard hooks only) and canvas 2d. Adding an npm
package for anything in here means the copy has drifted.

## Palette

The engine ships its own literal hex palette (`BASE_HUES`,
`DEFAULT_BACKGROUND`) and recipes carry literal hex too. That is
third-party-shaped code and is **exempt** from the AERA token rules —
the repo's hex/radius/font-size grep checks exclude
`src/vendor/pixel-motion/` for exactly this reason.
