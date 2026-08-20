import type { ComponentType } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserPage } from '../features/browser/BrowserPage';
import { entryFor } from '../features/browser/catalog';
import {
  ColorsPage,
  ElevationPage,
  MotionPage,
  RadiiPage,
  SpacingPage,
  TypePage,
} from '../features/browser/TokenPages';
import {
  ActivityCalendarPage,
  CardFanPage,
  ChartsPage,
  ChatPanelPage,
  ChipPage,
  ControlsPage,
  DotMatrixPage,
  ExpandedCardPage,
  FocusPanelPage,
  MotionStagePage,
  ShotTrendPage,
  SessionInsightsPage,
  SplitLayoutPage,
  InsightCardPage,
  LandingPage,
  MetricPage,
  NavBarPage,
  PageHeaderPage,
  PatternCardPage,
  SessionCardPage,
  SessionTimelinePage,
  ShotArcPage,
  ShotZonesPage,
  SkillRatingsPage,
  SurfacePage,
  TextPage,
  TooltipPage,
  VitalCardPage,
  WellPage,
} from '../features/browser/ComponentPages';

/** slug → the page that renders it. Every catalog entry has one. */
const PAGES: Record<string, ComponentType> = {
  colors: ColorsPage,
  radii: RadiiPage,
  type: TypePage,
  spacing: SpacingPage,
  elevation: ElevationPage,
  motion: MotionPage,

  text: TextPage,
  surface: SurfacePage,
  well: WellPage,
  metric: MetricPage,
  chip: ChipPage,
  controls: ControlsPage,
  charts: ChartsPage,
  tooltip: TooltipPage,
  'page-header': PageHeaderPage,
  'nav-bar': NavBarPage,
  'dot-matrix': DotMatrixPage,
  'pattern-card': PatternCardPage,
  'card-fan': CardFanPage,
  'expanded-card': ExpandedCardPage,
  'session-card': SessionCardPage,
  'insight-card': InsightCardPage,
  'chat-panel': ChatPanelPage,
  'activity-calendar': ActivityCalendarPage,
  'motion-stage': MotionStagePage,
  'session-timeline': SessionTimelinePage,
  'session-insights': SessionInsightsPage,
  'shot-trend': ShotTrendPage,
  'split-layout': SplitLayoutPage,
  'shot-zones-field': ShotZonesPage,
  'skill-ratings': SkillRatingsPage,
  'shot-arc': ShotArcPage,
  'focus-panel': FocusPanelPage,
  'vital-card': VitalCardPage,
  landing: LandingPage,
};

/** the public component browser. Same token layer as the app and the
 *  same components — nothing here is a picture of anything. */
export function StorybookBrowser() {
  const { slug } = useParams();
  const entry = entryFor(slug);
  const Page = PAGES[entry.slug] ?? ColorsPage;

  return (
    <BrowserPage title={entry.name} chip={entry.chip} description={entry.description}>
      <Page />
    </BrowserPage>
  );
}
