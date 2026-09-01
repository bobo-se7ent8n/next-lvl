/* ============================================================
   THE BROWSER CATALOG

   One list, two groups. The sidebar, the routing and the page
   titles all read from here, so a page cannot exist without an
   entry and an entry cannot exist without a page.
   ============================================================ */

export type BrowserGroup = 'Tokens' | 'Components';

export interface BrowserEntry {
  slug: string;
  name: string;
  group: BrowserGroup;
  /** the mono chip beside the page title */
  chip: string;
  /** the one-line mono description under it */
  description: string;
}

export const CATALOG: BrowserEntry[] = [
  /* ---- tokens ---- */
  { slug: 'colors', name: 'Colors', group: 'Tokens', chip: 'token', description: 'four surfaces and four inks, plus the five-hue AERA palette' },
  { slug: 'radii', name: 'Radii', group: 'Tokens', chip: 'token', description: 'seven squircle corners — every card and panel is one of them' },
  { slug: 'type', name: 'Type', group: 'Tokens', chip: 'token', description: 'eight composed tokens — oswald display, inter body, mono annotation' },
  { slug: 'spacing', name: 'Spacing', group: 'Tokens', chip: 'token', description: 'one scale, seventeen steps, no raw pixel anywhere in a component' },
  { slug: 'elevation', name: 'Elevation', group: 'Tokens', chip: 'token', description: 'the only thing separating a card from the paper it shares a fill with' },
  { slug: 'motion', name: 'Motion', group: 'Tokens', chip: 'token', description: 'resistance, not playfulness — short, settled, and no overshoot' },

  /* ---- components ---- */
  { slug: 'text', name: 'Text', group: 'Components', chip: 'primitive', description: 'every string in the product goes through one component' },
  { slug: 'surface', name: 'Surface & Card', group: 'Components', chip: 'primitive', description: 'background, radius and shadow on one element, always' },
  { slug: 'well', name: 'Well', group: 'Components', chip: 'primitive', description: 'the recessed frame — its graphic sits on the floor, never floating' },
  { slug: 'metric', name: 'Metric & StatRow', group: 'Components', chip: 'primitive', description: 'the headline reading of any card, and its row form' },
  { slug: 'chip', name: 'Chip & Tag', group: 'Components', chip: 'primitive', description: 'an attribute, never a status judgement' },
  { slug: 'controls', name: 'Controls', group: 'Components', chip: 'primitive', description: 'toggle, segmented control, slider, progress' },
  { slug: 'charts', name: 'Charts', group: 'Components', chip: 'viz', description: 'sparkline, area, bars, dot count, legend, ruler' },
  { slug: 'tooltip', name: 'Tooltip', group: 'Components', chip: 'viz', description: 'painted at the document root so a card can never clip it' },
  { slug: 'page-header', name: 'PageHeader', group: 'Components', chip: 'chrome', description: 'one header, one baseline, one reserved band beneath it' },
  { slug: 'nav-bar', name: 'NavBar', group: 'Components', chip: 'chrome', description: 'the four-tab capsule — app layout only' },
  { slug: 'dot-matrix', name: 'DotMatrix', group: 'Components', chip: 'graphic', description: 'the only illustration language — five metaphors, one grid' },
  { slug: 'pattern-card', name: 'PatternCard', group: 'Components', chip: 'composed', description: 'the fan card front — no links, ever' },
  { slug: 'card-fan', name: 'CardFan', group: 'Components', chip: 'feature', description: 'every pattern in the set, eight in the window, the active one centred' },
  { slug: 'expanded-card', name: 'ExpandedCard', group: 'Components', chip: 'feature', description: 'the opened pattern — the card\u2019s own geometry, grown. Not a modal.' },
  { slug: 'session-card', name: 'SessionCard', group: 'Components', chip: 'composed', description: 'a vertical card of uniform width — heights are allowed to be ragged' },
  { slug: 'insight-card', name: 'InsightCard', group: 'Components', chip: 'composed', description: 'a library item, carrying a dot field rather than artwork' },
  { slug: 'chat-panel', name: 'ChatPanel', group: 'Components', chip: 'composed', description: 'ask aera — four levels, loudest first, never taller than the viewport' },
  { slug: 'shot-trend', name: 'ShotTrend', group: 'Components', chip: 'feature', description: 'where the shot is going — a direction, its numbers, and one line placing it' },
  { slug: 'split-layout', name: 'SplitLayout', group: 'Components', chip: 'chrome', description: 'a sticky column beside the one that scrolls' },
  { slug: 'activity-calendar', name: 'ActivityCalendar', group: 'Components', chip: 'feature', description: 'a month, read as a month, with wide landscape cells' },
  { slug: 'motion-stage', name: 'SessionStage', group: 'Components', chip: 'feature', description: 'point clouds, a ground plane and a camera you can orbit' },
  { slug: 'session-timeline', name: 'SessionTimeline', group: 'Components', chip: 'feature', description: 'four tracks, real phase durations, one playhead' },
  { slug: 'session-insights', name: 'SessionInsights', group: 'Components', chip: 'feature', description: 'the block under the timeline — one at a time, where the playhead is' },
  { slug: 'shot-zones-field', name: 'ShotZonesField', group: 'Components', chip: 'feature', description: 'a continuous dot field — size is attempts, colour is accuracy' },
  { slug: 'skill-ratings', name: 'SkillRatings', group: 'Components', chip: 'feature', description: 'two groups, and where to work next as a section at the bottom' },
  { slug: 'shot-arc', name: 'ShotArc', group: 'Components', chip: 'feature', description: 'a solved parabola and a looped dot trail — no shooter' },
  { slug: 'focus-panel', name: 'FocusPanel', group: 'Components', chip: 'feature', description: 'the collapsing interval, filling the height it is given' },
  { slug: 'vital-card', name: 'VitalCard', group: 'Components', chip: 'feature', description: 'a body reading, private to the device' },
  { slug: 'landing', name: 'Landing sections', group: 'Components', chip: 'landing', description: 'the sticky bar, the sections that hold real product, and the two that are still placeholders' },
];

export const GROUPS: BrowserGroup[] = ['Tokens', 'Components'];

export const DEFAULT_SLUG = CATALOG[0].slug;

export function entryFor(slug: string | undefined): BrowserEntry {
  return CATALOG.find((e) => e.slug === slug) ?? CATALOG[0];
}
