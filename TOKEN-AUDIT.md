# Token audit

A scan of all 213 files under `src/` for hardcoded visual values,
and the migration of every one of them onto a design token.

**The token source of truth is `src/tokens/*.ts`, not a CSS file.**
`src/tokens/cssVars.ts` projects those objects onto `:root` as
`--aera-*` custom properties at runtime. There is no `tokens.css` and
there never was; a CSS file would be a second source of truth the app
does not read.

**This was a pure refactor.** Every value below was migrated at its
exact current value. Nothing was rounded, nudged or collapsed, so the
app renders pixel-identical to before. See *Snapped* for why that
section is empty.

**Scope.** The categories audited are the eight named in the brief:
colour, type, radius, spacing, shadow, motion, border width and
z-index. Icon and control dimensions were migrated too — they are
where most of the remaining drift was hiding. Illustration geometry
was deliberately left alone; see *Out of scope*.

---

## Violations migrated, by category

**100 literals across 30 files.**

| Category | Count |
|---|---|
| border width | 25 |
| control geometry | 19 |
| icon size | 14 |
| spacing | 13 |
| type | 12 |
| z-index | 10 |
| motion | 4 |
| colour | 2 |
| radius | 1 |

### Border width — 25

CSS shorthands carrying a px literal beside a `var()` colour. These
were invisible to a naive "does the line contain `var(`" check, which
is how eleven of them survived earlier passes.

| File | Was |
|---|---|
| `src/components/chrome/NavBar.module.css:80` | `outline: 2px solid …` |
| `src/components/chrome/PageHeader.module.css:81` | `outline: 2px solid …` |
| `src/components/primitives/Card.module.css:105` | `outline: 2px solid …` |
| `src/features/sessions/SessionTimeline.module.css:73` | `outline: 2px solid …` |
| `src/styles/global.css:91` | `outline: 2px solid …` |
| `src/components/primitives/StatRow.module.css:10` | `border-top: 1px solid …` |
| `src/stories/kit.module.css:13` | `border-bottom: 1px solid …` |
| `src/stories/kit.module.css:31` | `border-top: 1px solid …` |
| `src/features/browser/BrowserPage.module.css:53` | `outline: 1px solid …` |
| `src/features/landing/wireframe.module.css:45` | `border: 1px dashed …` |
| `src/styles/global.css:81` | `border: 3px solid …` |

Rails and rules that are a border width wearing a `width`/`height`:

| File | Was |
|---|---|
| `src/components/viz/Charts.module.css:114` | `width: 1px` (ruler tick) |
| `src/components/viz/Charts.module.css:134` | `width: 2px` (caret) |
| `src/features/sessions/SessionTimeline.module.css:99` | `width: 1px` (tick) |
| `src/features/sessions/SessionTimeline.module.css:288` | `width: 3px` (playhead) |
| `src/features/sessions/SessionTimeline.module.css:289` | `margin-left: -1.5px` |
| `src/features/sessions/MotionStage.module.css:175` | `height: 3px` (scrub rail) |
| `src/components/composed/PatternCard.module.css:88` | `left: -1px` |

Icon stroke weights, which recur across the product and are therefore
a design value rather than drawing:

| File | Was | Now |
|---|---|---|
| `src/app/SessionDetailLayout.tsx:12` | `strokeWidth="2.2"` | `iconStroke.base` |
| `src/features/sessions/ActivityCalendar.tsx:32` | `strokeWidth="2.2"` | `iconStroke.base` |
| `src/features/sessions/MotionStage.tsx:42` | `strokeWidth="2.2"` | `iconStroke.base` |
| `src/features/browser/BrowserSidebar.tsx:9` | `strokeWidth="2.6"` | `iconStroke.bold` |
| `src/features/background/BackgroundPanel.tsx:155` | `strokeWidth="1.9"` | `iconStroke.thin` |

And two widths that were baked into shadow strings in the token layer
itself:

| File | Was |
|---|---|
| `src/tokens/surface.ts` | `stroke: '0 0 0 2px …'` |
| `src/tokens/elevation.ts` | `selectRing: '0 0 0 1.5px #0D99FF'` |

### Control geometry — 19

All of `src/components/primitives/Controls.module.css` except where
noted: the switch (`32px`, `18px`, `12px`, `3px` inset, `14px`
travel), the slider (`64px` label, `4px` track, `14px` thumb ×2,
`40px` value) and the rating row (`132px` label, `36px` value). Plus
the ruler in `src/components/viz/Charts.module.css` — `46px` band,
`17px` label drop, `13px` caret.

### Icon size — 14

| File | Was |
|---|---|
| `src/app/SessionDetailLayout.module.css:53–54` | `13px` |
| `src/features/sessions/ActivityCalendar.module.css:72–73` | `13px` |
| `src/features/sessions/MotionStage.module.css:135–136` | `14px` |
| `src/features/sessions/MotionStage.module.css:229–230` | `12px` |
| `src/features/sessions/SessionTimeline.module.css:59–60` | `16px` |
| `src/features/browser/BrowserSidebar.module.css:76–77` | `11px` |
| `src/features/background/BackgroundPanel.module.css:39–40` | `19px` |

### Spacing — 13

| File | Was |
|---|---|
| `src/app/App.module.css:47` | `translateY(8px)` |
| `src/components/chrome/NavBar.module.css:70` | `translateY(-2px)` |
| `src/components/primitives/Card.module.css:94` | `translateY(-2px)` |
| `src/features/sessions/SessionTimeline.module.css:64` | `translateY(-2px)` |
| `src/features/sessions/SessionInsights.module.css:131` | `translateY(4px)` |
| `src/components/composed/PatternCard.module.css:89` | `bottom: -24px` |
| `src/components/primitives/Controls.tsx:152` | `'6px'` / `'8px'` bar height |
| `src/components/viz/Charts.module.css:86–87` | `8px` swatch |
| `src/components/viz/Charts.module.css:113` | `top: 4px` |
| `src/styles/global.css:70–71` | `10px` scrollbar |
| `src/features/background/BackgroundPanel.stories.tsx:26` | `gap: 32` |

### Type — 12

| File | Was |
|---|---|
| `src/components/composed/PatternCard.module.css:96` | `letter-spacing: 0.02em` |
| `src/components/composed/PatternCard.module.css:97` | `line-height: 1` |
| `src/components/primitives/Chip.module.css:9` | `letter-spacing: 0.09em` |
| `src/components/primitives/Chip.module.css:10` | `line-height: 1` |
| `src/components/primitives/Chip.module.css:31` | `letter-spacing: 0.12em` |
| `src/components/primitives/Chip.module.css:32` | `line-height: 1` |
| `src/components/primitives/Metric.module.css:44` | `font-size: 0.55em` |
| `src/components/primitives/Metric.module.css:45` | `line-height: 1` |
| `src/features/scoreboard/ShotArc.module.css:118` | `font-size: 0.55em` |
| `src/features/scoreboard/ShotArc.module.css:119` | `line-height: 1` |
| `src/components/viz/Tooltip.module.css:21` | `line-height: 1.45` |
| `src/components/viz/Legend.tsx:34` | `letterSpacing: '0.06em'` |

### Z-index — 10

Nine bare numbers in stylesheets and one in TypeScript. Nothing
anywhere recorded what the order *was*, so adding a layer meant
reading four files and picking a bigger number.

| File | Was | Now |
|---|---|---|
| `src/app/App.module.css:11` | `10` | `--aera-z-content` |
| `src/features/sessions/MotionStage.module.css:242` | `20` | `--aera-z-menu` |
| `src/features/patterns/fanGeometry.ts` | `600` | `zIndex.fan` |
| `src/features/patterns/PatternFan.module.css:114` | `700 !important` | `--aera-z-fan-lift` |
| `src/features/landing/wireframe.module.css:128` | `900` | `--aera-z-wireframe` |
| `src/features/background/BackgroundPanel.module.css:5` | `940` | `--aera-z-panel` |
| `src/components/chrome/NavBar.module.css:29` | `950` | `--aera-z-nav` |
| `src/features/landing/OpenPrototypePill.module.css:14` | `950` | `--aera-z-nav` |
| `src/features/patterns/PatternFan.module.css:180` | `970` | `--aera-z-flight` |
| `src/components/viz/Tooltip.module.css:10` | `980` | `--aera-z-tooltip` |

### Motion — 4

`src/styles/global.css:100, 102, 112, 113` — the four `0.001ms
!important` declarations in the `prefers-reduced-motion` block, now
`--aera-duration-none`.

### Colour — 2

| File | Was |
|---|---|
| `src/tokens/elevation.ts` | `#0D99FF` inside `selectRing` |
| `src/components/viz/BarSet.stories.tsx:61` | `rgba(255,255,255,0.42)` |

### Radius — 1

`src/components/viz/BarSet.stories.tsx:61` — `borderRadius: 16` →
`--aera-radius-md`, an exact match.

---

## Snapped

**None.** Step 4 of the brief allowed snapping a near value to an
existing token; step 9 required the app to render pixel-identical.
Those conflict, and step 9 is the stronger constraint — a refactor
that moves pixels is not a refactor. So every value was tokenised at
its exact current value, and where no token matched, a token was
added holding that exact value rather than bending the value to fit.

The candidates that *would* have been snapped, had it been allowed:

| Value | Nearest token | Delta |
|---|---|---|
| icon stroke `1.9`, `2.6` | `iconStroke.base` `2.2` | 0.3, 0.4 |
| `gap: 24` (story) | `--aera-space-10` `26px` | 2px |
| `borderRadius: 22` (story) | `--aera-radius-lg` `24px` | 2px |
| `fontSize: 11` (story) | `--aera-text-mono-size` `10px` | 1px |

The last three are Storybook harness furniture, not product UI. They
were left as literals rather than given product tokens, which would
have polluted the token set for demo scaffolding.

---

## New tokens added

### `src/tokens/zIndex.ts` — new category

```
content    10     the app's own column
menu       20     a dropdown inside a card
fan        600    the pattern hand's floor
fanLift    700    a hovered card, above the hand
wireframe  900    the landing annotation overlay
panel      940    the background settings panel
nav        950    the bottom nav capsule
flight     970    an opened pattern, above the nav
tooltip    980    above everything
```

### `src/tokens/border.ts` — new category

```
hairline  1px    a rule between rows, the wireframe dash
ring      1.5px  the figma-style selection ring
base      2px    the card stroke, the focus outline
thick     3px    the playhead, the scrollbar thumb border
```

### `src/tokens/size.ts` — new category

```
iconSize     xs 11px · sm 12px · base 13px · md 14px · lg 16px · xl 19px
iconStroke   thin 1.9 · base 2.2 · bold 2.6
controlSpec  switchWidth 32px · switchHeight 18px · switchKnob 12px
             switchInset 3px · switchTravel 14px
             sliderTrack 4px · sliderThumb 14px · sliderLabel 64px
             sliderValue 40px
             rulerHeight 46px · rulerLabelTop 17px · rulerCaret 13px
             ratingLabel 132px · ratingValue 36px
```

### Added to `src/tokens/typography.ts`

```
tracking    none 0 · display 0.012em · displayWide 0.06em · tag 0.02em
            chip 0.09em · monoSM 0.1em · mono 0.12em
            metricSM -0.01em · metricMD -0.02em · metricLG -0.028em
lineHeight  none 1 · snug 1.45
fontScale   superscript 0.55em
```

### Added to `src/tokens/motion.ts`

```
duration.none  0.001ms
```

Not zero: the reduced-motion collapse has to stay a real non-zero
time so `transitionend` / `animationend` still fire and nothing that
waits on them hangs.

### Added to `src/tokens/space.ts`

```
layout.tagDrop  24px   how far the figma name tag hangs below a card
```

### Shot Zones — the exception, made explicit

`src/tokens/color.ts` gains `colorShotZone`:

```
hot      colorSemantic.positive   (mint)
holding  colorSemantic.neutral    (yellow)
cold     colorSemantic.negative   (orange)
```

`accuracyRamp` now reads from these instead of reaching into
`colorSemantic` directly, so the shot field's ramp has its own names
and cannot be "corrected" back onto the global green-good /
orange-bad rule by someone tidying up.

**One discrepancy worth a decision.** The brief describes Shot Zones
as using the basketball convention — blue for low FG%, orange for
hot. The codebase deliberately does not: a comment in `color.ts`
records that the blue→orange scale was removed because *"blue does
not sit on an ordered axis with mint and orange"*, i.e. a three-stop
ramp through blue cannot be read in order without a key. The tokens
above therefore hold the **current** values, which are the semantic
hues in accuracy order. Adopting blue→orange is a visible design
change, not a refactor, and was not done here.

---

## Dead gap declarations

**157 `gap` declarations were checked. None were dead.**

Eight rules declare `gap` without `display: flex|grid` in the same
rule block. All eight resolve to a flex or grid box at runtime:

| Rule | Why it is live |
|---|---|
| `PageHeader.module.css:101 .views` | `@media` override; base rule is `display: flex` |
| `SplitLayout.module.css:50 .split` | `@media` override; base rule is `display: grid` |
| `ExpandedCard.module.css:260 .grid` | `@media` override; base rule is `display: grid` |
| `MotionStage.module.css:302 .transport` | `@media` override; base rule is `display: flex` |
| `Home.module.css:54 .grid` | `@media` override; base rule is `display: grid` |
| `Insights.module.css:67 .split` | `@media` override; base rule is `display: grid` |
| `Sessions.module.css:66 .split` | `@media` override; base rule is `display: grid` |
| `BackgroundPanel.module.css .body` | composed onto `<Card>`, which is `display: flex` |

The first seven needed no change — a media query overriding one
property does not restate the display mode.

**One was fixed anyway:** `.body` in
`src/features/background/BackgroundPanel.module.css`. Its gap did
work, but only by inheriting `display: flex` from `Card`'s own
stylesheet, and its `--aera-space-8` override only beat Card's
`--aera-card-gap` because of CSS-module source order. Reading the
rule on its own told you nothing and the outcome depended on
bundling. It now declares `display: flex; flex-direction: column`
itself — visually identical, because that is what it was already
resolving to, and now locally true.

This trap has clearly been hit before: five stylesheets carry a
standing comment on their flex containers reading *"gap is a no-op on
a block box — this must stay flex"*.

---

## Out of scope

### Illustration geometry — 16 values, deliberately not tokenised

SVG `strokeWidth` and circle `r` inside diagrams: the shot arc's
hoop, backboard, net and annotation rules (`1.2`, `1.4`, `1.6`, `2`,
`3.4`, `4.5`), the court markings in `ShotZonesField` (`2.2`, `4`),
the trend line in `AreaChart` (`3`), and the dot radii in
`SessionTimeline` (`2.1`) and `BackgroundPanel` (`2`).

These are drawing coordinates in SVG user space, in the same category
as the `viewBox` and the path data beside them, and they are not
shared with anything. Tokenising them would put a dozen
single-use entries in the token set that no second component could
ever reach for. Icon strokes, which *do* recur, were tokenised —
see *Border width*.

### Storybook harness furniture — 3 values

`gap: 24`, `borderRadius: 22`, `fontSize: 11` in story wrappers. See
*Snapped* for why they were left.

### Runtime data

`src/features/background/settings.ts` `fontSize: 10` is a
user-adjustable ASCII-layer setting with its own min/max in the
background panel, not a design token.

---

## Notes

### The icon scale records drift rather than fixing it

Six icon sizes between 11px and 19px is not a system; it is what you
get when eight components each pick a size independently. They are
written down at their exact values so the drift is visible in one
file instead of spread across eight stylesheets. Collapsing them to
two or three steps moves pixels, which this pass was not allowed to
do. That is the obvious follow-up.

### A kebab-case bug in the token writer

`cssVars.ts` projects token names through
`replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()`, which is
**lossy across consecutive capitals**: `bodySM` projects to
`body-sm`, and camel-casing that back returns `bodySm` — not a key
that exists. The dev panel's Save silently skipped every composed
text token with a two-letter suffix: `bodySM`, `displayXL`,
`displayLG`, `displayMD`, `metricLG`, `metricMD`, `metricSM`,
`monoSM`.

Caught by an end-to-end POST against the real dev server, which
returned `{"skipped":[{"name":"--aera-text-body-sm-size","reason":
"textStyle.bodySm not found"}]}`.

Fixed in `vite-plugins/token-writer.js` by matching on the key's own
kebab form rather than reversing the transform: the writer reads the
keys actually present in the block and takes whichever one kebabs to
the slug being looked for. That is exact by construction for every
key, including ones nobody has written yet, and needed no
special-casing of SM/MD/LG/XL.
