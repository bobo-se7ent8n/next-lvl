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
- **`AmbientField`** — a procedural `dot-matrix` recipe: a seed, a
  colour, and no data at all. All seven **Focus & vitals** cards and
  all eight **Insights** cards. It sweeps in left to right on every
  tab entry, the same 1400ms gesture the Patterns cards make, and it
  fits its grid to the well it is standing in.

`CardViz` branches on `recipe.type`. Both take the same `className`
and `ariaLabel` and mount in the same place; they differ in one line
of CSS — a chart CONTAINS (a cropped reading lies), an ambient field
COVERS (a texture has no edges worth keeping).

Ids come from the data source (`Pattern.id`, `Vital.id`, `Insight.id`).
The one exception is **Focus**, a singleton that had no id; `id: 'focus'`
was added to the `FOCUS` object in `src/data/vitals.ts`. Nothing is keyed
off array index — the fan reorders.

Container sizes are the viz container's own `offsetWidth × offsetHeight`
measured in Chrome at **1512×850**, with the dev panel hidden — see
*The container is an output* below.

**The container is not the box the graphic fills.** Every well on Focus
& vitals and Insights carries 10.56px of padding, and the canvas fills
the content box inside it. A field that looks inset by a few pixels is
the well's own padding, not a short field.

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
| Focus & vitals | `focus` | Focus | **AmbientField** (canvas, `pulse`) | `#FFFFFC` surface | 370 × 326 |
| Focus & vitals | `stress` | Stress | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 106 |
| Focus & vitals | `hrv` | HRV | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 147 |
| Focus & vitals | `rhr` | Resting HR | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 147 |
| Focus & vitals | `cardio` | Cardio capacity | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 159 |
| Focus & vitals | `resilience` | Resilience | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 118 |
| Focus & vitals | `load` | Activity load | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 295 × 136 |
| Insights | `breath` | Breath before the gather | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `closeout` | Closeout release reps | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `rushing-lesson` | What rushing feels like | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `film-pressure` | Film · pressure possessions | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `handle-fatigue` | Handle under fatigue | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `reset` | Pre-game reset routine | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `sleep` | Sleep & decision speed | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |
| Insights | `ladder` | Two-ball dribble ladder | **AmbientField** (canvas, `random-drift`) | `#FFFFFC` surface | 294 × 185 |

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
change again whenever the graphic's shape changes. On Patterns the
graphic slot has a definite height — the fan sizes all twelve slots as
one object — so what stands in it cannot move it, and all twelve are
byte-identical before and after. On Focus & vitals and Insights the well
has NO height of its own: it is `flex: 1 1 auto` with `min-height: auto`
around a child that has an intrinsic aspect ratio, so **the well's height
is an output of the graphic's ratio, not an input to it**. The old
`DotMatrix` SVG had a `364 × 210` viewBox; the canvas has the grid
`AmbientField` fitted to it. Different ratio, different well.

So changing what a graphic draws MOVES its well, and the two have to be
solved together. They are, at runtime: `AmbientField` measures the box it
is standing in and fits its grid to it, and a canvas fitted to ratio r
makes the well ratio r — the circle closes on itself on the first
measurement. That is why the numbers in this column shift by a few pixels
whenever the pitch or the preset changes, and why they are recorded
rather than designed. All twelve Patterns slots are unaffected: the fan
gives its slots a definite height, so what stands in one cannot move it.

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

All fifteen run at **`pixelSize: 1`, `gap: 1`** — a 48-column grid,
with the dot landing near 3px on screen. They ran at the fan's 3/2 for
one revision and the dots read as tiles you could count rather than as
a field. The twelve Patterns cards keep 3/2: they ARE readings, and you
are meant to see the individual marks. That is the difference the two
pitches now carry.

Fourteen share one motion — `random-drift`, `motionAmount: 1`,
`speed: 0.18`, `minOpacity: 0`, `maxOpacity: 1`, `changeFrequency: 1` —
through named constants in the registry. Only the seed and the colour
vary.

**`focus` is the exception.** It is the one card on Focus & vitals that
is not a body reading, and it was reading as a seventh vital. It keeps
the seed, the motion amount and the opacity range, and changes
`#FFB0CD` pink for a palette hue, `pulse` for drift, and `speed: 0.23`.

| card id | seed | colour | where the colour was read | preset |
| --- | --- | --- | --- | --- |
| `focus` | 48291 | `#FFB0CD` pink | **assigned** — see above | `pulse` |
| `stress` | 63194 | `#93EAC3` mint | `vitals.ts` — `tone: 'mint'`, and its leading bar | `random-drift` |
| `hrv` | 27508 | `#93EAC3` mint | `vitals.ts` — `chart.tone: 'mint'` | `random-drift` |
| `rhr` | 85073 | `#A6DBFF` blue | `vitals.ts` — `chart.tone: 'blue'` | `random-drift` |
| `cardio` | 31642 | `#93EAC3` mint | `vitals.ts` — `chart.tone: 'mint'` | `random-drift` |
| `resilience` | 79285 | `#93EAC3` mint | `vitals.ts` — `tone: 'mint'`, and its leading bar | `random-drift` |
| `load` | 50937 | `#FFE159` yellow | `vitals.ts` — `tone: 'yellow'`, and its leading bar | `random-drift` |
| `breath` | 14806 | `#93EAC3` mint | `InsightCard.tsx` — `KIND_TONE.DRILL` | `random-drift` |
| `closeout` | 35719 | `#93EAC3` mint | `KIND_TONE.DRILL` | `random-drift` |
| `rushing-lesson` | 21895 | `#C4B5FF` lilac | `KIND_TONE.LESSON` | `random-drift` |
| `film-pressure` | 68351 | `#A6DBFF` blue | `KIND_TONE.VIDEO` | `random-drift` |
| `handle-fatigue` | 80462 | `#93EAC3` mint | `KIND_TONE.DRILL` | `random-drift` |
| `reset` | 76403 | `#C4B5FF` lilac | `KIND_TONE.LESSON` | `random-drift` |
| `sleep` | 92047 | `#A6DBFF` blue | `KIND_TONE.VIDEO` | `random-drift` |
| `ladder` | 47130 | `#93EAC3` mint | `KIND_TONE.DRILL` | `random-drift` |

### The grid is fitted to the well, not cut for one breakpoint

The recipes used to carry a logical grid measured against one well at
1512×850, arrived at by cutting, re-measuring and re-cutting until the
numbers stopped moving. It worked at 1512×850 and nowhere else — a
well's ratio changes with the viewport, because the six vitals are
stretched to whatever the Focus card beside them needs — so at
1728×1000 the fields sat in bands of 8.7px (`focus`), 15.6px
(`stress`), 16.4px (`load`) and 24.6px (`resilience`).

`AmbientField` measures the box it is standing in and fits the ROW
COUNT to it, so the canvas ratio tracks the well at every width. It
also snaps both logical dimensions to `count * pitch - gap`, which is
what removes the last of the old margin: `createGridLayout` lays down
whole cells and centres them, so a logical 96 at pitch 2 painted 95px
and left a bare strip, and a logical **95** paints 95 and leaves none.

Measured after the change, at three viewports:

| | 1512×850 | 1728×1000 | 1900×1060 |
| --- | --- | --- | --- |
| vertical band, all 15 | **0px** | **0px** | **0px** |
| horizontal, worst | 4.8px cropped | 4.6px cropped | 1.2px cropped |
| dot size, vitals + insights | 2.87–2.94px | 3.30–3.36px | 3.90–3.92px |
| dot size, `focus` | 3.67px | 4.21px | 4.18px |
| `focus` grid | 48 × 42 | 48 × 44 | 48 × 50 |

The horizontal figure is a CROP, not a band — `object-fit: cover` on
the ambient fields means a residual ratio mismatch runs a dot column
off the edge instead of leaving paper showing. Both `cover` and
`contain` scale by one factor in both axes, so the dots stay square.

The cuts in the registry are now **nominal**: a sensible starting shape
per well for the first layout pass, before the measurement lands. They
do not need re-measuring when the design moves.

### Restarting on tab entry

Every one of these restarts when its screen is entered, and there is no
mechanism for it beyond the two `key`s that were already there:
`AppLayout`'s `<div key={location.pathname}>` and `Home`'s
`<div key={view}>`. A remount rebuilds the composition and resets the
clock.

Since `AmbientField` drives a reveal, that restart is now VISIBLE — the
field sweeps in left to right over 1400ms, the same gesture the twelve
Patterns cards make. Measured painted-edge position after entering a
tab, against Patterns as the reference:

| | 180ms | 420ms | 700ms | 1000ms | 1300ms | 1700ms |
| --- | --- | --- | --- | --- | --- | --- |
| Patterns | 20% | 35% | 56% | 82% | 93% | 93% |
| Focus & vitals | 16% | 35% | 56% | 77% | 98% | 100% |
| Insights | 7% | 37% | 58% | 79% | 100% | 100% |

Twenty wheel events inside any of the three screens restart nothing,
and five seconds of sitting still rebuilds nothing — the fit settles on
the first measurement and the integer row count is the guard that keeps
it there.

### Notes

**Three bar cards have three colours, not one.** `stress` and
`resilience` draw mint/yellow/orange and `load` draws yellow/mint/orange.
A procedural recipe takes one, so the base taken is the card's own
declared `tone` — which in all three is also the LEADING bar.

**Every seed is different, and here that matters more than on Patterns.**
Eight Insights wells are the same size, the same grid and — for the four
drills — the same colour. The seed is the only thing separating them.
