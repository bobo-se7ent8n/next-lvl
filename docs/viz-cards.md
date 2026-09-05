# Cards with a viz slot

Every card on **Patterns**, **Focus & vitals** and **Insights** that has a
graphic container, and the id it is addressed by.

**The `card id` column is the registry key.** Add an entry to
`src/vendor/pixel-motion/recipes/registry.ts` under that exact id and the
card renders a `DataDotMatrix` instead of its chart — no component change
anywhere. Remove the entry and it falls straight back to the chart below.

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
| Patterns | `recovers` | Recovery after makes | BarSet (divs) | `#FFE159` yellow | 237 × 214 |
| Patterns | `contested3` | Contested-3 confidence | BarSet (divs) | `#FF9B68` orange | 237 × 205 |
| Patterns | `leftwing` | Left-wing hesitation | Sparkline (svg) | `#C4B5FF` lilac | 237 × 214 |
| Patterns | `firststep` | First-step quickening | Sparkline (svg) | `#A6DBFF` blue | 237 × 205 |
| Patterns | `finishing` | Finishing through contact | BarSet (divs) | `#F0E9D8` beige | 237 × 205 |
| Patterns | `fatigue` | Fatigue shifts shot mix | AreaChart (svg) | `#FFB0CD` pink | 237 × 214 |
| Patterns | `handle` | Handle tightens late | BarSet (divs) | `#93EAC3` mint | 237 × 214 |
| Patterns | `freethrow` | Free-throw rhythm | Sparkline (svg) | `#FFE159` yellow | 237 × 214 |
| Patterns | `corner3` | Corner-3 footwork | Sparkline (svg) | `#FF9B68` orange | 237 × 214 |
| Patterns | `ballsec` | Ball security | Sparkline (svg) | `#C4B5FF` lilac | 237 × 214 |
| Patterns | `routine` | Pre-shot routine drift | AreaChart (svg) | `#A6DBFF` blue | 237 × 205 |
| Focus & vitals | `focus` | Focus | DotMatrix `interval` (svg) | `#FFFFFC` surface | 370 × 289 |
| Focus & vitals | `stress` | Stress | BarSet (divs) | `#FFFFFC` surface | 295 × 94 |
| Focus & vitals | `hrv` | HRV | Sparkline (svg) | `#FFFFFC` surface | 295 × 135 |
| Focus & vitals | `rhr` | Resting HR | Sparkline (svg) | `#FFFFFC` surface | 295 × 135 |
| Focus & vitals | `cardio` | Cardio capacity | AreaChart (svg) | `#FFFFFC` surface | 295 × 135 |
| Focus & vitals | `resilience` | Resilience | BarSet (divs) | `#FFFFFC` surface | 295 × 94 |
| Focus & vitals | `load` | Activity load | BarSet (divs) | `#FFFFFC` surface | 295 × 112 |
| Insights | `breath` | Breath before the gather | DotMatrix `hold` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `closeout` | Closeout release reps | DotMatrix `compress` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `rushing-lesson` | What rushing feels like | DotMatrix `stall` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `film-pressure` | Film · pressure possessions | DotMatrix `steady` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `handle-fatigue` | Handle under fatigue | DotMatrix `disperse` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `reset` | Pre-game reset routine | DotMatrix `hold` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `sleep` | Sleep & decision speed | DotMatrix `steady` (svg) | `#FFFFFC` surface | 294 × 178 |
| Insights | `ladder` | Two-ball dribble ladder | DotMatrix `compress` (svg) | `#FFFFFC` surface | 294 × 178 |

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
