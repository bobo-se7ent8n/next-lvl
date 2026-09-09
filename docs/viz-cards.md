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
measured in Chrome at **1512×850**, with the dev panel hidden. The
container is the box the canvas is scaled into, not the card.

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
| Focus & vitals | `focus` | Focus | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 370 × 289 → **370 × 321** |
| Focus & vitals | `stress` | Stress | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 94 → **295 × 110** |
| Focus & vitals | `hrv` | HRV | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 135 → **295 × 151** |
| Focus & vitals | `rhr` | Resting HR | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 135 → **295 × 151** |
| Focus & vitals | `cardio` | Cardio capacity | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 135 → **295 × 151** |
| Focus & vitals | `resilience` | Resilience | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 94 → **295 × 110** |
| Focus & vitals | `load` | Activity load | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 112 → **295 × 128** |
| Insights | `breath` | Breath before the gather | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `closeout` | Closeout release reps | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `rushing-lesson` | What rushing feels like | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `film-pressure` | Film · pressure possessions | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `handle-fatigue` | Handle under fatigue | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `reset` | Pre-game reset routine | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `sleep` | Sleep & decision speed | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |
| Insights | `ladder` | Two-ball dribble ladder | **PixelAnimation** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 178 → **294 × 186** |

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

**THE ARROW IN THE LAST COLUMN IS A REAL, MEASURED CHANGE.** The fifteen
procedural wells got taller when the canvas replaced the SVG in them, and
this is not something a recipe can be re-cut to avoid. On Patterns the
graphic slot has a definite height — the fan sizes all twelve slots as
one object — so what stands in it cannot move it, and all twelve are
byte-identical before and after. On Focus & vitals and Insights the well
has NO height of its own: it is `flex: 1 1 auto` with `min-height: auto`
around a child that has an intrinsic aspect ratio, so **the well's height
is an output of the graphic's ratio, not an input to it**. The old
`DotMatrix` SVG had a `364 × 210` viewBox; the canvas has its recipe's
logical grid. Different ratio, different well.

Cutting each recipe to its well's numbers above shrinks the change to
+7.4px on Insights, +32px on Focus and +16px on each vital — the vitals
follow the Focus panel, whose card sets the grid row and whose height they
then split — but it cannot reach zero, because the well's measured size
includes its 10.56px padding while the canvas fills only the content box,
and because the logical grid's height is an integer. See the report that
accompanied this change.

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

Motion is identical across all fifteen — `random-drift`, `motionAmount: 1`,
`speed: 0.18`, `minOpacity: 0`, `maxOpacity: 1`, `changeFrequency: 1`,
`pixelSize: 3`, `gap: 2` — and shared through named constants in the
registry. Only the seed, the colour and the cut vary.

**The pitch is the same 3/2 the twelve Patterns cards use**, so all three
screens read at one dot scale. The playground's 2/2 is not what ships.

**The colour is read, never assigned.** Each hex is the hue that card
already drew in, taken from the component or the data that drew it.

| card id | seed | colour | where the colour was read | format (display) | logical grid | dot grid |
| --- | --- | --- | --- | --- | --- | --- |
| `focus` | 48291 | `#C4B5FF` lilac | `FocusPanel.tsx` — `<DotMatrix accent="lilac">` | 370 × 289 | 96 × 75 | 19 × 15 |
| `stress` | 63194 | `#93EAC3` mint | `vitals.ts` — `tone: 'mint'`, and its leading bar | 295 × 94 | 96 × 31 | 19 × 6 |
| `hrv` | 27508 | `#93EAC3` mint | `vitals.ts` — `chart.tone: 'mint'` | 295 × 135 | 96 × 44 | 19 × 9 |
| `rhr` | 85073 | `#A6DBFF` blue | `vitals.ts` — `chart.tone: 'blue'` | 295 × 135 | 96 × 44 | 19 × 9 |
| `cardio` | 31642 | `#93EAC3` mint | `vitals.ts` — `chart.tone: 'mint'` | 295 × 135 | 96 × 44 | 19 × 9 |
| `resilience` | 79285 | `#93EAC3` mint | `vitals.ts` — `tone: 'mint'`, and its leading bar | 295 × 94 | 96 × 31 | 19 × 6 |
| `load` | 50937 | `#FFE159` yellow | `vitals.ts` — `tone: 'yellow'`, and its leading bar | 295 × 112 | 96 × 36 | 19 × 7 |
| `breath` | 14806 | `#93EAC3` mint | `InsightCard.tsx` — `KIND_TONE.DRILL` | 294 × 178 | 96 × 58 | 19 × 12 |
| `closeout` | 35719 | `#93EAC3` mint | `InsightCard.tsx` — `KIND_TONE.DRILL` | 294 × 178 | 96 × 58 | 19 × 12 |
| `rushing-lesson` | 21895 | `#C4B5FF` lilac | `InsightCard.tsx` — `KIND_TONE.LESSON` | 294 × 178 | 96 × 58 | 19 × 12 |
| `film-pressure` | 68351 | `#A6DBFF` blue | `InsightCard.tsx` — `KIND_TONE.VIDEO` | 294 × 178 | 96 × 58 | 19 × 12 |
| `handle-fatigue` | 80462 | `#93EAC3` mint | `InsightCard.tsx` — `KIND_TONE.DRILL` | 294 × 178 | 96 × 58 | 19 × 12 |
| `reset` | 76403 | `#C4B5FF` lilac | `InsightCard.tsx` — `KIND_TONE.LESSON` | 294 × 178 | 96 × 58 | 19 × 12 |
| `sleep` | 92047 | `#A6DBFF` blue | `InsightCard.tsx` — `KIND_TONE.VIDEO` | 294 × 178 | 96 × 58 | 19 × 12 |
| `ladder` | 47130 | `#93EAC3` mint | `InsightCard.tsx` — `KIND_TONE.DRILL` | 294 × 178 | 96 × 58 | 19 × 12 |

The logical grid is derived by `createDataCanvas` — the engine's own
format helper — from the display numbers, at module load. It is never
hand-computed here, and the dot grid follows from it at pitch 5.

**Three bar cards have three colours, not one.** `stress` and
`resilience` draw mint/yellow/orange and `load` draws yellow/mint/orange.
A procedural recipe takes one, so the base taken is the card's own
declared `tone` — which in all three is also the LEADING bar. If that
reads wrong on screen, this is the line to change.

**Every seed is different, and here that matters more than on Patterns.**
Eight Insights wells are the same size, the same grid and — for the four
drills — the same colour. The seed is the only thing separating them.
