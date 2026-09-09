# Cards with a viz slot

Every card on **Patterns**, **Focus & vitals** and **Insights** that has a
graphic container, and the id it is addressed by.

**The `card id` column is the registry key.** Add an entry to
`src/vendor/pixel-motion/recipes/registry.ts` under that exact id and the
card renders a dot matrix instead of its chart — no component change
anywhere. Remove the entry and it falls straight back to the chart below.

An entry is one of two kinds, and its recipe's own `type` says which:

- **`DataDotMatrix`** — a `data-dot-matrix` recipe plus the card's own
  series. It is a chart: the numbers are encoded and the field reveals
  column by column. All twelve **Patterns** cards.
- **`PixelAnimation`** — a procedural `dot-matrix` recipe: a seed, a
  colour, and no data at all. It is ambient, and it has **no reveal
  phase** — the field is there from the first frame. All seven
  **Focus & vitals** cards and all eight **Insights** cards.

`CardViz` branches on `recipe.type`. Both components take the same
`className` and `ariaLabel`, so the canvas class, the `object-fit:
contain` guard and the mount point are the same either way.

Ids come from the data source (`Pattern.id`, `Vital.id`, `Insight.id`).
The one exception is **Focus**, a singleton that had no id; `id: 'focus'`
was added to the `FOCUS` object in `src/data/vitals.ts`. Nothing is keyed
off array index — the fan reorders.

Container sizes are the viz container's own `offsetWidth × offsetHeight`
measured in Chrome at **1512×850**, with the dev panel hidden, and they
are re-measured every time a recipe on these two screens is re-cut — see
*The container is an output* below.

**The container is not the box the canvas is scaled into.** Every well on
Focus & vitals and Insights carries 10.56px of padding, and the canvas
fills the content box inside it. The recipes are cut to that content box,
not to the numbers in this column.

| screen | card id | card title | current viz type | card fill color | container size at 1512×850 |
| --- | --- | --- | --- | --- | --- |
| Patterns | `rushing` | Rushing under pressure | **DataDotMatrix** (canvas, `area-zone`) | `#93EAC3` mint | 237 × 205 |
| Patterns | `recovers` | Recovery after makes | **DataDotMatrix** (canvas, `comparison`) | `#FFE159` yellow | 237 × 214 |
| Patterns | `contested3` | Contested-3 confidence | **DataDotMatrix** (canvas, `area-zone`) | `#FF9B68` orange | 237 × 205 |
| Patterns | `leftwing` | Left-wing hesitation | **DataDotMatrix** (canvas, `area-zone`) | `#C4B5FF` lilac | 237 × 214 |
| Patterns | `firststep` | First-step quickening | **DataDotMatrix** (canvas, `area-zone`) | `#A6DBFF` blue | 237 × 205 |
| Patterns | `finishing` | Finishing through contact | **DataDotMatrix** (canvas, `comparison`) | `#F0E9D8` beige | 237 × 205 |
| Patterns | `fatigue` | Fatigue shifts shot mix | **DataDotMatrix** (canvas, `area-zone`) | `#FFB0CD` pink | 237 × 214 |
| Patterns | `handle` | Handle tightens late | **DataDotMatrix** (canvas, `comparison`) | `#93EAC3` mint | 237 × 214 |
| Patterns | `freethrow` | Free-throw rhythm | **DataDotMatrix** (canvas, `area-zone`) | `#FFE159` yellow | 237 × 214 |
| Patterns | `corner3` | Corner-3 footwork | **DataDotMatrix** (canvas, `area-zone`) | `#FF9B68` orange | 237 × 214 |
| Patterns | `ballsec` | Ball security | **DataDotMatrix** (canvas, `area-zone`) | `#C4B5FF` lilac | 237 × 214 |
| Patterns | `routine` | Pre-shot routine drift | **DataDotMatrix** (canvas, `area-zone`) | `#A6DBFF` blue | 237 × 205 |
| Focus & vitals | `focus` | Focus | **PixelAnimation** (canvas, `pulse`) | `#FFFFFC` surface | 370 × 322 |
| Focus & vitals | `stress` | Stress | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 103 |
| Focus & vitals | `hrv` | HRV | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 144 |
| Focus & vitals | `rhr` | Resting HR | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 144 |
| Focus & vitals | `cardio` | Cardio capacity | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 159 |
| Focus & vitals | `resilience` | Resilience | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 118 |
| Focus & vitals | `load` | Activity load | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 136 |
| Insights | `breath` | Breath before the gather | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `closeout` | Closeout release reps | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `rushing-lesson` | What rushing feels like | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `film-pressure` | Film · pressure possessions | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `handle-fatigue` | Handle under fatigue | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `reset` | Pre-game reset routine | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `sleep` | Sleep & decision speed | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |
| Insights | `ladder` | Two-ball dribble ladder | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 186 |

27 cards: 12 Patterns, 7 Focus & vitals (the Focus panel plus six vitals),
8 Insights.

## Notes on the numbers

**Patterns alternate 205 and 214.** The graphic slot takes whatever the
three text rows above it leave, and a two-line pattern name costs the
slot 9px. It is not a per-card setting — it follows from the name.

**Every pattern card is 237 wide** at this viewport. The fan scales all
twelve slots as one object, so width does not vary across the hand.

**Vitals vary by content, not by card.** A card carrying a `legend` row
gives up that height from its well: three-item legends (`stress`,
`resilience`) leave 94, the one-item legends (`hrv`, `rhr`, `cardio`)
leave 135, and `load` sits between at 112.

**Insights are uniform at 294 × 178** — every library well is the same
landscape frame by design, so the dot field is the same grid in all of
them.

**THE CONTAINER IS AN OUTPUT, NOT AN INPUT.** The fifteen procedural
wells changed height when the canvas replaced the SVG in them, and they
change again every time a recipe is re-cut. On Patterns the
graphic slot has a definite height — the fan sizes all twelve slots as
one object — so what stands in it cannot move it, and all twelve are
byte-identical before and after. On Focus & vitals and Insights the well
has NO height of its own: it is `flex: 1 1 auto` with `min-height: auto`
around a child that has an intrinsic aspect ratio, so **the well's height
is an output of the graphic's ratio, not an input to it**. The old
`DotMatrix` SVG had a `364 × 210` viewBox; the canvas has its recipe's
logical grid. Different ratio, different well.

So cutting a recipe to fill its well MOVES that well, and the two have to
be solved together. The numbers in this table are that solution: each
recipe was cut to its well's measured content box, the wells re-measured,
and the loop repeated until nothing moved — three rounds, ending with
every measurement stable to 0.00px. All eight Insights wells and all
twelve Patterns slots came out unchanged; the seven on Focus & vitals did
not, and could not.

**A vital's well is its own.** The six sit in a three-column grid whose
rows are `auto`, inside a column stretched to the Focus card beside it:
every card in a row ends up the same total height, and its well takes
whatever the head, metric, description and legend above it leave. Three
different legends and three different descriptions means six different
wells. The old reading of "two shapes, 94 and 135" was the coarse,
pre-registration measurement.

**Card fill vs. container background.** This column is the card *face*.
On Patterns that face is one of seven from `FAN_FILLS`, cycling by index
modulo seven; the graphic sits in a flat `surface-level1` well cut into
it, which is what a recipe's `canvas.background` should match rather than
the face. On Focus & vitals and Insights the face is the plain surface.

All seven fan faces are now light, so every card takes dark ink and the
same `surface-level1` well. `fatigue` used to wear the near-black
`colorFace.ink` and was the one card whose luminance flipped the
ink/well/chart-ink helpers; it wears `colorFace.pink` (`#FFB0CD`) now and
behaves like the other six. A recipe written for it needs no dark
variant.

**Insights card order.** The table is in `INSIGHTS` data order. On screen
the grid round-robins them into three columns at ≥1024px, so the DOM
order at 1512 is `breath, film-pressure, sleep, closeout, handle-fatigue,
ladder, rushing-lesson, reset`. The id is unaffected either way — that is
the point of keying on it.

## The fifteen procedural recipes

Fourteen share one motion — `random-drift`, `motionAmount: 1`,
`speed: 0.18`, `minOpacity: 0`, `maxOpacity: 1`, `changeFrequency: 1`,
`pixelSize: 3`, `gap: 2` — through named constants in the registry. Only
the seed, the colour and the cut vary.

**`focus` is the exception, and deliberately.** It is the one card on
Focus & vitals that is not a body reading, and it was reading as a
seventh vital because it wore the same field as the six beside it. It
keeps the seed, the full motion amount and the 0→1 opacity range, and
changes everything else: `#FFB0CD` pink instead of a palette hue,
`pulse` instead of drift, `speed: 0.23`, and a **1px dot on a 1px gap**
— a 48 × 42 grid where the vitals beside it run 19 wide.

**The cut is to the well's CONTENT box**, measured in Chrome at 1512×850
with the dev panel hidden, and iterated to a fixed point (a recipe
changes the well it was cut to). The logical grid is chosen by
`fitCanvas` in the registry: `createDataCanvas` — the engine's own format
helper — gives the honest answer from the ratio, and `fitCanvas` then
walks two pitch-runs either side of it, lays each candidate out with the
engine's own `createGridLayout`, and keeps whichever leaves the least
margin. Ties go to the helper's answer.

| card id | seed | colour | where the colour was read | content box @1512 | logical | dot grid | fill @1512 (l/r/t/b px) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `focus` | 48291 | `#FFB0CD` pink | **assigned** — see above | 348.49 × 301.29 | 96 × 83 | 48 × 42 | 0 / 3.6 / 0 / 0 |
| `stress` | 63194 | `#93EAC3` mint | `vitals.ts` — `tone: 'mint'`, and its leading bar | 274.04 × 81.72 | 96 × 28 | 19 × 6 | 2.8 / 5.7 / 0.9 / 0.9 |
| `hrv` | 27508 | `#93EAC3` mint | `vitals.ts` — `chart.tone: 'mint'` | 274.05 × 122.99 | 96 × 43 | 19 × 9 | 2.8 / 5.7 / 0.1 / 0.1 |
| `rhr` | 85073 | `#A6DBFF` blue | `vitals.ts` — `chart.tone: 'blue'` | 274.05 × 122.99 | 96 × 43 | 19 × 9 | 2.8 / 5.7 / 0.1 / 0.1 |
| `cardio` | 31642 | `#93EAC3` mint | `vitals.ts` — `chart.tone: 'mint'` | 274.04 × 137.69 | 96 × 48 | 19 × 10 | 2.8 / 5.7 / 0.3 / 0.3 |
| `resilience` | 79285 | `#93EAC3` mint | `vitals.ts` — `tone: 'mint'`, and its leading bar | 274.05 × 96.43 | 96 × 33 | 19 × 7 | 2.8 / 5.7 / 1.1 / 1.1 |
| `load` | 50937 | `#FFE159` yellow | `vitals.ts` — `tone: 'yellow'`, and its leading bar | 274.04 × 114.43 | 96 × 40 | 19 × 8 | 2.8 / 5.7 / 3.0 / 3.0 |
| `breath` | 14806 | `#93EAC3` mint | `InsightCard.tsx` — `KIND_TONE.DRILL` | 272.71 × 164.74 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `closeout` | 35719 | `#93EAC3` mint | `KIND_TONE.DRILL` | 272.72 × 164.75 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `rushing-lesson` | 21895 | `#C4B5FF` lilac | `KIND_TONE.LESSON` | 272.71 × 164.74 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `film-pressure` | 68351 | `#A6DBFF` blue | `KIND_TONE.VIDEO` | 272.71 × 164.74 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `handle-fatigue` | 80462 | `#93EAC3` mint | `KIND_TONE.DRILL` | 272.72 × 164.76 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `reset` | 76403 | `#C4B5FF` lilac | `KIND_TONE.LESSON` | 272.71 × 164.74 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `sleep` | 92047 | `#A6DBFF` blue | `KIND_TONE.VIDEO` | 272.71 × 164.74 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |
| `ladder` | 47130 | `#93EAC3` mint | `KIND_TONE.DRILL` | 272.72 × 164.76 | 96 × 58 | 19 × 12 | 2.8 / 5.7 / 0 / 0 |

### The horizontal 2.8 / 5.7 is the engine, not the cut

Every card above leaves the same left/right margin, and no recipe can
close it. `createGridLayout` tiles the logical field with whole cells and
centres what it lays down: at pitch 5 over a 96-wide logical field it
fits `floor((96 + 2) / 5) = 19` columns, which paint 93px, and centres
them with `floor(3 / 2) = 1` on the left and 2 on the right. Scaled up
that is 2.84px and 5.70px — the asymmetry is the floor, not a bug in the
cut, and it is identical on all twenty-seven cards including Patterns.

`logicalWidth` is pinned to 96 by `createDataCanvas` for any landscape
format, so the recipe cannot choose a width that tiles exactly. Closing
it means changing the engine, which this repo does not do — the copy
under `src/vendor/pixel-motion/` is re-copied, never patched.

`focus` shows what it would look like fixed: at pitch 2 the same field
fits 48 columns painting 95px, so its margin is 0 / 3.6 rather than
2.8 / 5.7.

### The residual at 1728×1000

A recipe has one ratio and a well has a different one at every
breakpoint, so a cut made at 1512×850 cannot fill at 1728×1000 as well.
Measured there: `hrv`, `rhr`, `cardio` and all eight Insights fill exactly
(0px band); `focus` leaves 8.7px top and bottom, `stress` 15.6px,
`load` 16.4px and `resilience` 24.6px. At 1728 the six vitals wells are
pushed to two heights by the taller viewport, and the short-legend cards
are the ones that letterbox into them.

### Restarting on tab entry

Every one of these restarts when its screen is entered, and there is no
mechanism for it beyond the two `key`s that were already there:
`AppLayout`'s `<div key={location.pathname}>` and `Home`'s
`<div key={view}>`. A remount rebuilds the composition and resets
`startedAt`, which is the restart. Measured: entering Focus & vitals runs
the canvas effect for all seven cards, entering Insights for all eight,
and twenty wheel events inside a screen run it zero times.

A seeded `random-drift` field has no visible beginning — t=0 looks like
t=30s — so fourteen of the fifteen restart invisibly. `focus` does not:
`pulse` has a phase, and it resets.

### Notes

**Three bar cards have three colours, not one.** `stress` and
`resilience` draw mint/yellow/orange and `load` draws yellow/mint/orange.
A procedural recipe takes one, so the base taken is the card's own
declared `tone` — which in all three is also the LEADING bar.

**Every seed is different, and here that matters more than on Patterns.**
Eight Insights wells are the same size, the same grid and — for the four
drills — the same colour. The seed is the only thing separating them.
