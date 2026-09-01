/* ============================================================
   LANDING — the public page's own structural constants.

   The app screens are laid out from `space` and `layout`; the
   landing page needs a handful of lengths those two scales have no
   step for — the loading card's 4:3 box, the grid it is aligned to,
   the nav capsule's height, a device bezel. They live here rather
   than being typed into eight stylesheets, and they are projected
   onto `:root` as `--aera-landing-*` like every other length, so
   they move with `--aera-scale` and the whole entry sequence
   rescales together on a shorter window.

   THE GRID AND THE CARD ARE ONE DECISION. `loadGrid` is 30px and
   the loading card is 480 × 360 — sixteen cells by twelve — so the
   card's corners, and the four squares pinned to them, land on
   grid intersections at every scale step rather than only at full
   size. Changing either number without the other breaks that.

   `scatter` is NOT a length and is deliberately not projected: it
   is the seeded geometry of the word-tag field, consumed from
   TypeScript the way `dotMatrix` and `inkVariation` are.
   ============================================================ */

export const landing = {
  /* ---- THE PAGE FRAME ----------------------------------------
     One margin, at the top and down both sides, and every section
     lives inside it. The bar, the sections and the closing block
     all measure from this rather than from the app's page gutter:
     the landing is a framed sheet, and the app is a full-bleed
     column, and they were sharing a number that meant two things.
     ------------------------------------------------------------ */
  frame: '16px',

  /* ---- the loading screen ---- */
  /** the dark ground's rule spacing — the card is a multiple of it */
  loadGrid: '30px',
  /** the white card, 4:3, and sixteen grid cells by twelve */
  loadCardW: '480px',
  loadCardH: '360px',
  /** the coloured square pinned to each of the card's corners */
  loadCorner: '18px',
  /** a scattered word-tag's padding, and the radius it is cut at */
  tagPadX: '9px',
  tagPadY: '5px',
  /** how far a cursor-trail tag is offset from the one before it */
  trailStep: '7px',
  /** and how soft the deepest tag in that stack is */
  trailBlur: '5px',
  /** how blurred a tag is by the time it has left toward the centre */
  tagExitBlur: '14px',
  /** and how far out of focus the headline starts behind the card */
  headlineBlur: '22px',
  /** the glow carried by the nav's progress stroke and its head */
  navGlow: '3px',

  /* ---- the sticky nav, as a floating window ---- */
  /** the capsule's height — every group in the bar shares it */
  navPill: '36px',
  /** THE CENTRE CAPSULE, at rest and once it has morphed.
   *
   *  A PILL, NOT A SQUARE. At 36 it was exactly as wide as it was
   *  tall — one glyph in a box the height of the bar — and beside a
   *  wordmark pill and two link pills it read as a chip somebody had
   *  forgotten to label rather than as the third object in the
   *  group. 60 is two thirds wider again: a real pill at the same
   *  height, with the arrow centred in it and nothing else in there
   *  competing for the room.
   *
   *  It went the other way once — 76px for a 14px arrow, which was
   *  too far and left the glyph adrift. This is the middle. */
  navProgressW: '60px',
  navToTopW: '124px',
  /** the drop between the bar and the first thing under it */
  navDrop: '32px',
  /** THE RADIUS THE PROGRESS RING IS DRAWN AT, from the centre of
   *  the capsule.
   *
   *  It used to be 25 — a few pixels proud of a 36px square on all
   *  four sides, so the ring read as travelling around the outside
   *  of the button. The capsule is a 60 x 36 pill now and that same
   *  radius puts the ring outside its top and bottom edges while
   *  sitting inside its left and right ones: a circle half swallowed
   *  by a stadium.
   *
   *  14 is the ring drawn INSIDE the pill instead — clear of the
   *  14px glyph it circles, and clear of the pill's own height once
   *  the widest stroke on it is accounted for. */
  navArc: '14px',
  /* THE BAR'S WHOLE IN-FLOW BAND — inset, padding, border, capsule
     and the drop beneath it.

     THE ONE LANDING TOKEN THAT REFERENCES ITS SIBLINGS, for the same
     reason `layout.columnHeight` does: it mixes lengths that must
     scale with a border width that must not, and it has to stay
     exactly equal to the sum of what the bar actually occupies. The
     hero subtracts it from `100dvh` so the first screen is one
     screen; written as a literal it would be a number that drifts
     the first time the bar's padding is retuned.

     There is no bare px in it, so the projection wraps it verbatim
     and each `var()` arrives already scaled. */
  navBand:
    'calc(var(--aera-space-4) * 2 + var(--aera-border-hairline) * 2' +
    ' + var(--aera-landing-nav-pill) + var(--aera-landing-nav-drop))',

  /** THE TOP CLEARANCE EVERY SECTION AFTER THE HERO CARRIES.
   *
   *  The bar is sticky, so from the second section on it floats OVER
   *  whatever has just snapped into place. A section whose content
   *  starts at its own top edge therefore starts underneath the bar.
   *  This is the frame plus the bar's whole band, and it is the top
   *  padding of every fitted section — which is also why those
   *  sections are `height: 100dvh` and not `min-height`: the padding
   *  comes out of the content, never out of the next screen. */
  navClear: 'calc(var(--aera-landing-frame) + var(--aera-landing-nav-band))',

  /* ---- the section furniture ---- */
  /** the macOS window's title bar, and one of its traffic lights */
  windowBar: '34px',
  windowDot: '11px',
  /** the MacBook bezel, and the foot under its screen */
  deviceBezel: '13px',
  deviceFoot: '15px',
  /** THE LOGICAL SCREEN every embedded app screen is drawn at
   *  before it is fitted into its frame.
   *
   *  1440 x 900, which is a real laptop screen rather than a
   *  convenient number. It was 1280 x 800, and the Home screen did
   *  not fit in it: the page header reserves its band, six vital
   *  cards want two rows under it, and the last row was being cut
   *  off by the plate's own clip. Scaling the whole plate down is
   *  free — it is one transform — where cropping is not. */
  shotWidth: '1440px',
  shotHeight: '900px',
  /** A SECTION'S OPENING LINE, WHERE TWO LINES IS THE POINT.
   *
   *  The default measure for a section's body is the readable one —
   *  `layout.maxReadWidth`, 54ch — which is right for a paragraph and
   *  wrong for a single sentence set centred under a display
   *  heading: the Patterns line broke onto three, and a three-line
   *  block under a one-word heading reads as a paragraph somebody
   *  forgot to cut rather than as a caption.
   *
   *  A LENGTH RATHER THAN A `ch` COUNT, so it is projected through
   *  `--aera-scale` and steps down with the type it is measuring —
   *  a `ch` measure would hold its character count while the type
   *  shrank around it and the line count would drift by window. */
  sectionBodyW: '680px',

  /** a fan card in the patterns arc */
  fanCardW: '284px',
  fanCardH: '372px',
  /** THE VANISHING POINT THE HAND LEANS INTO.
   *
   *  A length, so it is projected through `--aera-scale` with
   *  everything else: perspective is measured in the same space as
   *  the box it is applied to, and a fixed 1600 against cards that
   *  had shrunk to four fifths would make the hover tilt read
   *  deeper on a small window than on a large one. */
  fanPerspective: '1600px',
  /** how far the outermost card of the arc drops below the middle
   *  one. A LENGTH, so it is projected through `--aera-scale` and
   *  the arc keeps its shape relative to the cards it is made of —
   *  the same correction the app's own fan geometry carries. */
  fanDrop: '26px',
  /** the Ask AERA bubble in the insights reveal */
  bubbleW: '540px',
  bubbleH: '76px',
  /** the closing block — a floating window like the nav, and short:
   *  it holds a line and a button, not a section */
  closeBlockH: '54dvh',
} as const;

/* ------------------------------------------------------------
   THE SEEDED SCATTER

   Numbers, not lengths: percentages of the viewport, a scale
   range and a blur. Nothing here is projected onto :root — the
   tag field is positioned from TypeScript because its coordinates
   are generated rather than written down.
   ------------------------------------------------------------ */
export const scatter = {
  /* ---- THE PACKING ------------------------------------------
     The field is laid out once, at module load, against a
     REFERENCE WINDOW: a candidate position is drawn from the seeded
     stream, its box is measured, and it is kept only if it clears
     every box already placed and the headline's own keep-out. That
     is why these are here — they are the packer's inputs, and the
     packer runs in `seed.ts`.
     ------------------------------------------------------------ */
  /** the window the packing is solved in, in CSS pixels */
  refW: 1440,
  refH: 900,
  /** the gap every tag keeps from every other tag, in reference px */
  gap: 14,
  /** roughly how wide one uppercase mono character is at scale 1,
   *  the tag's own horizontal padding, and the box's height — the
   *  packer needs a size before the DOM exists, so it estimates one
   *  from the word's length. They shadow `landing.tagPadX` and the
   *  mono token deliberately: these are the packer's model of the
   *  box, in reference pixels, and they must not move with the
   *  layout scale. */
  charW: 8.4,
  padX: 9,
  boxH: 24,
  /** how many seeded candidates a tag may try before it gives up
   *  and shrinks */
  tries: 220,
  /** the smallest and largest a tag is drawn at */
  scaleMin: 0.45,
  scaleMax: 1,
  /** ± degrees a tag is rotated by */
  rotate: 4,
  /** how far a tag's fill is let down once it has reflowed onto
   *  paper — a flat opacity on the same palette hue, never a second
   *  set of colours for the light state */
  tintLight: 0.62,
  /** THE TWO KEEP-OUTS, as fractions of the reference window.
   *
   *  `card` is the white 4:3 panel in the middle of the dark state.
   *  `headline` is the sentence the white state is built around —
   *  wider and shorter, because the headline runs to three lines at
   *  the display size and a tag inside that box is a tag sitting on
   *  top of the one thing the page is for. */
  keepOutCard: { x: [0.3, 0.7], y: [0.24, 0.76] } as const,
  keepOutHead: { x: [0.16, 0.84], y: [0.3, 0.72] } as const,
} as const;

/* ------------------------------------------------------------
   THE CURSOR TRAIL

   A short stack of tags gathering behind the pointer on the white
   state. `lag` is the damping factor of the rAF loop — each tag
   eases toward the one in front of it by this share of the
   remaining distance per frame, which is what makes the stack
   trail rather than snap.
   ------------------------------------------------------------ */
export const trail = {
  /** how many tags accumulate behind the pointer */
  count: 7,
  /** the share of the remaining distance covered per frame */
  lag: 0.22,
  /** ± degrees one tag is turned from the one in front of it */
  rotate: 5,
} as const;

/* ------------------------------------------------------------
   THE CANVAS DOT FIELD — section 13.

   One canvas, one rAF loop, and these are its physics. Lengths in
   device-independent pixels, drawn rather than laid out, so they
   are numbers here and not CSS custom properties.
   ------------------------------------------------------------ */
export const dotCanvas = {
  /** the distance between dot centres */
  pitch: 26,
  /** a dot at rest, and the most the pointer can grow it to */
  size: 3,
  grow: 3.4,
  /** how far the pointer's influence reaches */
  radius: 150,
  /** how far a dot is pushed away from the pointer at the centre */
  push: 13,
  /** the share of the remaining distance a dot covers per frame */
  ease: 0.16,
  /** THE FIELD'S OWN CONTRAST, and it is deliberately low.
   *
   *  A dot at rest, and how much brighter the pointer can make it.
   *  These were 0.22 and 0.5 against the tertiary ink, which is a
   *  lot of contrast for a texture: the block read as dirty rather
   *  than as paper with a tooth. The dot is drawn in the level2
   *  surface now, and these two numbers keep it under the threshold
   *  of being a thing you look at until the pointer is on it. */
  alpha: 0.5,
  alphaLift: 0.45,
} as const;

export type LandingSpec = keyof typeof landing;
