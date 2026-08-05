# aera

A self-knowledge instrument for a basketball player. Sessions go in; patterns,
reads and a shareable scoreboard come out.

**Vite + React + Tailwind.** One light theme. The visual system is
neutral-on-neutral — off-white surfaces, no strokes, no dividers, deep
superellipse corners everywhere — with saturated colour confined to small
highlighter chips, and headlines set in Oswald at a per-letter randomised
weight. Behind all of it sit three toggleable generative background layers.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # serve the production build
```

Requires Node 18+ (developed on Node 24). Fonts load from Google Fonts, so the
first run wants a network connection.

## Structure

```
src/
  App.jsx                     root — providers, chrome, routing, transitions
  data/mock.js                ALL placeholder data lives here
  state/
    AppState.jsx              state that outlives a screen unmount
    BackgroundState.jsx       the three background layers' settings
  lib/                        palette, utils, scrollProgress, useMeasure,
                              useMediaQuery, useReducedMotion, useEscape
  components/
    bg/                       BackgroundLayers BackgroundPanel ascii
    chrome/ScrollRuler.jsx
    charts/                   the one chart family + its geometry
    nav/TopNav.jsx
    ui/                       Inked Highlight SegBar Card Button Tag Chip
                              Segmented Modal Sidebar Toast Field ScreenHeader
                              Sparkline Meter HeroStat Callout
    home/                     FocusPanel VitalCard PatternCard ActivityHeatmap
    motion/                   PageTransition Stagger Num
    viz/                      PointCloud ShotZones
  screens/
    Home.jsx  Sessions.jsx  Insights.jsx  Scoreboard.jsx
    sub/  FocusArchive.jsx  PatternDetail.jsx  SessionDetail.jsx
legacy/prototype.html         the original single-file prototype, kept for diffing
```

### Routes

| Route                        | Screen                                 |
| ---------------------------- | -------------------------------------- |
| `/`                          | Home — fixed three-column shell        |
| `/focus`                     | Focus archive                          |
| `/sessions`                  | Session list                           |
| `/sessions/:id`              | Game review (timeline, viewport, pins) |
| `/insights`                  | Insight library + Ask sidebar          |
| `/insights/pattern/:id`      | Per-pattern draft article              |
| `/scoreboard`                | Scoreboard + shared view               |

Every screen and sub-page is a real route with a real URL, wrapped in
`AnimatePresence`.

## Visual system

### Neutrals

One light theme. Every neutral is still a CSS variable in `src/index.css`,
because the tokens are the vocabulary the whole app speaks — the background
canvas reads the same values to pick its ink.

| token      | value     |
| ---------- | --------- |
| `canvas`   | `#F5F2EC` |
| `panel`    | `#FFFFFF` |
| `surface`  | `#F2EFE8` |
| `surface2` | `#E8E4DB` |
| `ink`      | `#111111` |

### Colour — highlighter chips

Saturated colour appears in exactly one form: a **highlighter chip** — a solid
pastel-bright fill with dark monospace caps sitting directly on it, no border,
minimal padding, fully rounded caps. A marker swipe over a word, not a badge.

Eight fills in `src/lib/palette.js`: lime, sky, coral, pink, lavender, mint,
yellow, tan. Each carries its own dark ink.

Everything else in the app is neutral. Cards and backgrounds are never
colour-flooded. The one extension is data: segmented bars, their legend dots,
skill meters and the shot-zone sunburst draw from the same eight fills, so the
app never introduces a second colour vocabulary.

`heatColor()` in `lib/utils.js` bands a 0–1 value onto four of them —
sky → mint → lime → coral. Four discrete steps, not a gradient: banding keeps
every value on a colour you can name.

### Type

**Headlines** are Oswald (variable, 200–700), uppercase, through `<Inked>`. Every
character draws its own weight from the axis, plus ±1.8° of rotation and ±1.6px
of vertical drift, rolled once per mount. The result reads hand-inked rather than
set — deliberately light, never illegible.

**Body and UI** are Inter.

**Large numerals** are Inter too, at heavy weight and tight tracking
(`-0.035em`), tabular so nothing re-flows while a value animates. The numeral is
the loudest thing on any card it appears in.

Monospace (IBM Plex Mono) is reserved for highlighter chips.

### Shape

Very deep corners: 26 / 44 / 68 / 110 / 120 / 140px, small chips fully rounded.
Each step is sized to the element it is meant for, because the browser clamps a
radius at half the box — one blanket number would collapse a small tile into a
circle.

The `.sq` utility redraws the radius as a superellipse where `corner-shape`
ships, at **exponent 3**. That is deliberately *below* the `squircle` keyword
(exponent 4): a higher exponent hugs the box and visually shrinks the corner,
and these radii are large because the corner is meant to read large.

> `.sq` is deliberately **not** applied to anything at pill radius — a
> superellipse corner on a circle flattens it back into a rounded square.

**No strokes. No dividers.** A surface is a fill and a radius. Separation comes
from whitespace and one step on the neutral ramp. Nothing changes fill on hover
— the only hover state in the app is the Figma selection frame.

### Background layers

Three independent generative layers sit behind everything, fixed to the
viewport, `pointer-events: none` throughout and under the content stacking
context — nothing there can ever swallow a click. Each has its own switch, and
turning all three off leaves a plain canvas.

| layer     | what it is |
| --------- | ---------- |
| **lines** | thin full-height rules at an even interval, very low contrast |
| **grain** | an `feTurbulence` tile baked to a data URI, multiplied over the page |
| **ascii** | a canvas of dense monospace digits and symbols, drawn on a grid |

The ASCII field runs in two modes. **Random** drives character density from a
few octaves of value noise, so the field resolves into a large-scale image at a
distance rather than looking like uniform static — the characters are random,
the tone behind them is not. **Image** takes an upload, cover-fits it to the
character grid, and maps each cell's luminance to a rung on the density ramp
plus an opacity. A per-cell hash nudges every glyph by one rung so flat regions
still read as text.

### Background control panel

A dev tool, not product chrome — but it has to be findable, so a small labelled
**Background** button sits in the bottom-right corner and is visible on load.
**Shift + B** toggles the same thing. Once open the panel collapses from its own
header.

| layer | controls |
| --- | --- |
| lines | on/off · count · width · opacity |
| grain | on/off · amount · scale · opacity |
| ascii | on/off · mode (random / image) · upload · density · font size · opacity · regenerate |

Grain's *amount* is how contrasty the noise itself is (baked into the SVG as an
alpha slope); its *opacity* is how strongly the whole layer sits over the page.
They are separate because a coarse faint grain and a fine strong one are
different looks.

Everything writes straight into background state, so the layers re-render live —
there is no apply step. The ASCII defaults ship sparse and pale on purpose: the
field is meant to read as faint paper texture, not as a screen of digits
competing with the content.

### Charts

One shape language, in `components/charts`:

- lines are thick, round-capped, smooth beziers, always ending in a filled dot
- bars are capsules with the value above them, never rectangles
- areas are soft blobs — stroked and filled in the same colour with
  `paint-order: stroke`, which is what rounds the shoulders
- packed charts encode value in radius, laid out by a deterministic relaxation
  pass so a chart never shifts between renders
- legends are a coloured dot and a label, under the chart

No axes, no gridlines, no frame: the card already states the units, and a rule
would be a divider.

Every SVG chart measures its own box with `useMeasure` and plots in real pixels
rather than scaling a fixed viewBox — otherwise the horizontal axis squashes and
every curve reads flat.

### The Figma selection hover

`components/ui/SelectionFrame.jsx`. The two card types that read as objects on a
canvas — **pattern cards and vitals cards** — pick up the treatment you get
selecting a frame: a 1px dashed blue box just outside the card, filled square
handles on the four corners, and the layer's name in a small monospace chip
above the top-left. Purely presentational, and `pointer-events-none` so it can
never take a click from the card or its ••• menu.

Neither card type has any other hover state. The fill never shifts, so a card
being pointed at never reads as a card whose value changed.

> The frame sits 3px out and the handles straddle it, so the whole treatment
> needs exactly 6px — which is also the horizontal padding on Home's columns.
> They are scroll containers, and a scroll container clips overflow on *both*
> axes, so anything reaching past that gutter would simply be cut off.

### The scroll ruler

A measurement strip pinned to the very top edge, above the background layers and
below modals. Fine ticks run the width; every fifth is taller and carries a
number, and those numbers are **pattern indices** — 1 through the size of the
pattern set — so the ruler reads as a position in the data. A blue badge rides
it at the current scroll fraction, and the right end holds a live dot.

What it measures changes per screen: Home's centre column `claim()`s it and
reports its own progress, and everywhere else it falls back to window scroll
(`lib/scrollProgress.jsx`).

### Layout — full-bleed

**There is no page container.** Every screen reaches both viewport edges; `.wrap`
only holds content off them by a gutter (20 / 32 / 44px). Nothing is centred in a
fixed measure.

What stops a line of text from running 2000px wide is the *element*, not the
page: prose blocks carry `.measure` (68ch), the Skills column caps at 680px, the
goals list and session-summary hero at 760px, the Game-review viewport at 1100px.
Card grids use `repeat(auto-fill, minmax(…, 1fr))` rather than viewport
breakpoints, so the track count follows the real width of the column they sit in.

4/10/20/32/44/64/88/128 spacing scale. Section separation is whitespace, not
rules.

`TopNav` publishes its own measured height as `--nav-h`, because Home's left
column pins directly below it and the bar wraps at narrow widths.

## Home — fixed three-column shell

**The page does not scroll.** The shell is sized to exactly one viewport minus
the ruler and the nav, and only the centre column overflows — so the side
columns are static by construction rather than by `sticky`; they simply have
nowhere to go. They carry `overflow-y-auto` purely as insurance for short
viewports.

All three columns start at the same top edge, separated by a single 12px gutter
— 6px of padding on each column, no grid gap — and 12px is also the gap between
every block inside every section. Nothing sits directly on the page background:
each block, including the column headers and the activity section, carries its
own surface.

The deck's focal line is the middle of the centre column, except at the very top
of the scroll where it rides up to the first card. Without that the top card
would sit permanently scaled down, which is exactly what stopped the column
reading as top-aligned.

Below 1024px the whole thing collapses to one ordinary stacked scrolling column
— Focus → Vitals → Patterns — the deck effect turns off, and the ruler goes back
to measuring the window. The ruler is retained either way.

### Left · Focus

`components/home/FocusPanel.jsx`. No diagram, no bubbles, no connectors — three
questions answered in plain language and in order, each labelled with its own
chip:

1. **What we saw** — the observation.
2. **Why it happens** — the pattern behind it.
3. **What to do** — one concrete action to counter it.

The reading itself sits above them as a single number. One focus, shown once.
One control: the archive button. Below it, the activity heatmap.

### Centre · Patterns — the only scroller

A vertical deck. Each card's distance from the centre of the scroller drives its
scale, opacity and offset, so the card under the middle of the column is full
size and fully opaque while everything above and below recedes. The transform is
written to CSS variables from one rAF-throttled scroll handler, so React never
re-renders while the column moves.

**Every card is identical.** Same size, same five fields, same order — name,
hero numeral, context line, chart, status chip. No pattern is presented as more
important than another. Chart *type* varies because the shape of the data
varies, but the slot it occupies is the same everywhere, so the variation never
becomes hierarchy.

The ••• menu, mute + undo toast, and click-through to the pattern detail page
are unchanged.

### Right · Vitals

`components/home/VitalCard.jsx`. Uniform squares — no circles, no size
variation. Because shape no longer differentiates them, every card carries the
same full complement: a category chip, the metric name, the reading and its
unit, and a chart from the same family every other chart uses.

The chip names the category (`SCORE` / `MEASURED`) and takes a highlighter fill
when the reading sits meaningfully outside the player's own baseline; otherwise
it stays neutral. Everything is visible at rest — no hide toggle, no ⓘ, no
click-to-highlight, no copy beside the headline. Hover is half-strength.

> The card fill itself stays neutral even when out of baseline — colour-flooding
> a surface is the one thing the visual system forbids, so the accent arrives as
> a chip instead.

## Session activity heatmap

`components/home/ActivityHeatmap.jsx`, on both Home and Sessions. One rounded
cell per day, fill intensity standing for how much work that day held, on the
same colour-intensity scale as the rest of the app.

Two neutral headline stats: total sessions, and the most active week.

> **No streaks, and no guilt.** A day with no session is drawn as an empty cell
> on the neutral ramp — not red, not dashed, not called a miss. The second stat
> is deliberately a peak rather than a run, because a streak turns an ordinary
> rest day into a loss and this product does not do that.

## Key components

- **`Inked`** — the randomised-weight Oswald headline.
- **`Highlight` / `LegendDot`** — the highlighter chip and its legend form;
  `tone="neutral"` spends no colour, so the coloured version reads as a signal.
- **`Chart`** — one entry point over the whole chart family, so a card never has
  to know which chart its data asked for.
- **`SegBar` / `SegLegend`** — the segmented comparison bar, still used on the
  pattern detail page.
- **`PointCloud`** — the 3D viewport, a canvas particle scene rather than a
  rendered figure. Its neutrals are pulled from the live tokens at draw time;
  the ball stays coral.
- **`ShotZones`** — a court-shaped sunburst on the four-band data scale. Wedges
  are separated by a gap in the fill, never a stroke. Hovering one quietens the
  rest rather than brightening it, so every wedge keeps its true colour.

## Motion

- **Page transitions** — fade plus a 6px vertical shift, 170ms, via
  `AnimatePresence mode="wait"`.
- **Stagger** — 30ms per item on card grids and tile rows, fade + 6px rise.
- **Numerals** — `<Num>` counts up from zero over 480ms for pure numbers, seeded
  with a same-width mask so nothing shifts. Mixed readouts (`0.61s → 0.42s`)
  render immediately; there is no scramble.
- **The pattern deck** — scale, opacity and offset driven by scroll position in
  the centre column, written to CSS variables so React stays out of the loop.
- **Hover** — the Figma selection frame, and nothing else. No fill shifts, no
  scaling, no lift, no sweep.

`prefers-reduced-motion` disables the transitions, the stagger, the count-up and
the pattern deck, and freezes the point cloud on a single held frame.

## Product constraints kept intact

No leaderboards, no ranking, no head-to-head. Trend states stay neutral —
"declining" gets coral, never red, never scolding. Sharing is opt-in per section.
Insights are pulled, not pushed; your patterns re-rank the library but never
filter it.

## Data

Every placeholder value — patterns (with their mosaic spans and bar segments),
sessions, moments, vitals (with their kind, scale, baseline and state), the focus
chain, shot zones, skills, goal stats, insight cards, friends, nav — lives in
`src/data/mock.js`. No screen hardcodes content.
