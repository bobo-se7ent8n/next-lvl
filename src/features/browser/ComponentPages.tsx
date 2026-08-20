import { useState } from 'react';
import { Card } from '../../components/primitives/Card';
import { Chip, Tag } from '../../components/primitives/Chip';
import {
  ProgressRow,
  SegmentedControl,
  Slider,
  Toggle,
} from '../../components/primitives/Controls';
import { Metric } from '../../components/primitives/Metric';
import { StatRow, StatSet } from '../../components/primitives/StatRow';
import { Surface, Well } from '../../components/primitives/Surface';
import { Display, Label, Mono, Text } from '../../components/primitives/Text';
import { AreaChart } from '../../components/viz/AreaChart';
import { BarSet } from '../../components/viz/BarSet';
import { DotCount } from '../../components/viz/DotCount';
import { Legend } from '../../components/viz/Legend';
import { Ruler } from '../../components/viz/Ruler';
import { Sparkline } from '../../components/viz/Sparkline';
import { Tooltip } from '../../components/viz/Tooltip';
import { DotMatrix } from '../../components/graphics/DotMatrix';
import { NavBar } from '../../components/chrome/NavBar';
import { PageHeader } from '../../components/chrome/PageHeader';
import { PatternCard } from '../../components/composed/PatternCard';
import { SessionCard } from '../../components/composed/SessionCard';
import { InsightCard } from '../../components/composed/InsightCard';
import { ChatPanel } from '../../components/composed/ChatPanel';
import { PatternFan } from '../../features/patterns/PatternFan';
import { MotionStage } from '../../features/sessions/MotionStage';
import { SessionInsights } from '../../features/sessions/SessionInsights';
import { ShotTrend } from '../../features/scoreboard/ShotTrend';
import { SplitLayout } from '../../components/chrome/SplitLayout';
import { ExpandedCard } from '../../features/patterns/ExpandedCard';
import { ActivityCalendar } from '../../features/sessions/ActivityCalendar';
import { SessionTimeline } from '../../features/sessions/SessionTimeline';
import { ShotZonesField } from '../../features/scoreboard/ShotZonesField';
import { SkillRatings, WhereToWorkNext } from '../../features/scoreboard/SkillRatings';
import { ShotArc } from '../../features/scoreboard/ShotArc';
import { FocusPanel } from '../../features/home/FocusPanel';
import { VitalCard } from '../../features/home/VitalCard';
import {
  LandingAudience,
  LandingBlock,
  LandingClosure,
  LandingFuture,
  LandingHero,
  LandingNotice,
  LandingPrinciples,
  OpenPrototypePill,
  WireBox,
  WireSection,
  WireSlot,
} from '../landing';
import { DOT_PATTERNS, DOT_PATTERN_NOTE } from '../../lib/dotField';
import { colorData } from '../../tokens';
import { INSIGHTS, MOMENTS, PATTERNS, SESSIONS, VITALS } from '../../data';
import { BrowserSection, Demo, DemoGrid, DemoRow, Note, Specimen, SpecimenGrid } from './BrowserPage';

/* ============================================================
   COMPONENT PAGES

   Every entry in the catalog renders live here, in the real
   components — nothing on these pages is a picture of a component.
   ============================================================ */

export function TextPage() {
  return (
    <BrowserSection title="One component, four voices">
      <Demo>
        <Display size="xl">Rushing under pressure</Display>
        <Display size="lg">Focus &amp; vitals</Display>
        <Text variant="body">
          The display sizes carry per-letter weight variation, hashed from the string itself, so a
          headline always comes out the same way.
        </Text>
        <Text variant="bodySM" tone="secondary">
          Body copy sits at three sizes and never sets a font-size of its own.
        </Text>
        <DemoRow>
          <Label>micro label</Label>
          <Mono>00:11:24</Mono>
        </DemoRow>
      </Demo>
    </BrowserSection>
  );
}

export function SurfacePage() {
  return (
    <>
      <BrowserSection title="Surface — a background, a radius and an elevation, nothing else">
        <DemoGrid>
          <Surface level="background" padding="10" radius="card">
            <Label tone="tertiary">panel</Label>
          </Surface>
          <Surface level="level1" padding="10" radius="card" elevation="none">
            <Label tone="tertiary">level 1</Label>
          </Surface>
          <Well ratio="5 / 2" radius="lg" />
        </DemoGrid>
      </BrowserSection>
      <BrowserSection title="Card — the radius and the shadow are always the same element">
        <DemoGrid>
          <Card radius="card" padding="10">
            <Label tone="tertiary">default</Label>
          </Card>
          <Card radius="card" padding="10" face={colorData.mint}>
            <Label tone="inherit">face colour</Label>
          </Card>
          <Card radius="card" padding="10" elevation="high">
            <Label tone="tertiary">lifted</Label>
          </Card>
        </DemoGrid>
      </BrowserSection>
    </>
  );
}

export function MetricPage() {
  return (
    <BrowserSection title="The headline reading of any card, and its row form">
      <Demo>
        <DemoRow>
          <Metric value="0.42" unit="s" size="lg" caption="release under pressure" />
          <Metric value="74" unit="ms" size="lg" />
          <Metric value="46" unit="°" size="md" />
        </DemoRow>
        <StatSet
          stats={[
            { label: 'shots', value: 41 },
            { label: 'pts', value: 18 },
            { label: 'reb', value: 6 },
          ]}
        />
        <StatRow label="Motion consistency" value="81" />
      </Demo>
    </BrowserSection>
  );
}

export function ChipPage() {
  return (
    <BrowserSection title="An attribute, never a status judgement">
      <Demo>
        <DemoRow>
          <Chip>Measured</Chip>
          <Chip tone="mint">1 new pattern</Chip>
          <Chip tone="lilac">Pattern candidate</Chip>
          <Chip tone="blue">Session 14</Chip>
        </DemoRow>
        <DemoRow>
          <Tag>on court</Tag>
          <Tag quiet>rushing under pressure</Tag>
        </DemoRow>
      </Demo>
    </BrowserSection>
  );
}

export function ControlsPage() {
  const [on, setOn] = useState(true);
  const [seg, setSeg] = useState('a');
  const [slider, setSlider] = useState(42);
  return (
    <BrowserSection title="Toggle, segmented control, slider, progress">
      <Demo>
        <DemoRow>
          <Toggle checked={on} onChange={setOn} label="Example" />
          <SegmentedControl
            ariaLabel="Example"
            value={seg}
            onChange={setSeg}
            options={[
              { value: 'a', label: 'One' },
              { value: 'b', label: 'Two' },
              { value: 'c', label: 'Three' },
            ]}
          />
        </DemoRow>
        <Slider label="Amount" value={slider} min={0} max={100} display={`${slider}%`} onChange={setSlider} />
        <ProgressRow label="Free throw" value={85} color={colorData.mint} />
        <ProgressRow label="Balance" value={58} color={colorData.orange} />
      </Demo>
    </BrowserSection>
  );
}

export function ChartsPage() {
  const pattern = PATTERNS[0];
  return (
    <>
      <BrowserSection title="Line, area and bars">
        <DemoGrid>
          <Demo>
            <Sparkline values={pattern.series} color={colorData.mint} height={80} />
            <Label tone="tertiary">Sparkline</Label>
          </Demo>
          <Demo>
            <AreaChart values={pattern.series} color={colorData.blue} height={80} />
            <Label tone="tertiary">AreaChart</Label>
          </Demo>
          <Demo>
            <BarSet items={pattern.bars} height={80} showLabels />
            <Label tone="tertiary">BarSet</Label>
          </Demo>
        </DemoGrid>
      </BrowserSection>
      <BrowserSection title="Counts, keys and the measure tape">
        <DemoGrid>
          <Demo>
            <DotCount value={14} total={24} columns={12} color={colorData.lilac} />
            <Label tone="tertiary">DotCount — a reading, not an illustration</Label>
          </Demo>
          <Demo>
            <Legend
              items={[
                { label: 'you', color: colorData.lilac },
                { label: 'opponents', color: colorData.orange },
                { label: 'ball', color: colorData.yellow },
              ]}
            />
            <Label tone="tertiary">Legend</Label>
          </Demo>
          <Demo>
            <Ruler total={8} value={3} />
            <Label tone="tertiary">Ruler</Label>
          </Demo>
        </DemoGrid>
      </BrowserSection>
    </>
  );
}

export function TooltipPage() {
  const [show, setShow] = useState<{ x: number; y: number } | null>(null);
  return (
    <BrowserSection title="Painted at the document root — a card can never clip it">
      <Demo>
        <Note>
          Tooltips used to be anchored inside the card they described, which meant an overflow rule
          on the card, or on anything above it, cut them off. This one is portalled to the body and
          positioned in viewport coordinates instead.
        </Note>
        <Card radius="card" padding="11">
          <div
            onPointerEnter={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setShow({ x: r.left + r.width / 2, y: r.top });
            }}
            onPointerLeave={() => setShow(null)}
          >
            <Label tone="tertiary">hover this row — the tip escapes the clipped card</Label>
          </div>
        </Card>
        {show ? (
          <Tooltip x={show.x} y={show.y} heading="Apr 12">
            2 sessions · Scrimmage · 71 min
          </Tooltip>
        ) : null}
      </Demo>
    </BrowserSection>
  );
}

export function PageHeaderPage() {
  return (
    <BrowserSection title="One header, one baseline, one reserved band beneath it">
      <Demo>
        <Note>
          Every tab uses this. The title sits at the same offset on all four and the header reserves
          a spacing token underneath itself, so no content region can start inside the subhead — the
          overlap that was clipping the second line on Sessions.
        </Note>
        <Card radius="card" padding="10">
          <PageHeader
            title="Sessions"
            subhead="Every game you recorded, kept on the device. The month above is the frame; the log below it is what happened, and any session opens."
          />
          <div style={{ height: 'var(--aera-space-11)', borderRadius: 'var(--aera-radius-md)', background: colorData.blue }} />
        </Card>
      </Demo>
    </BrowserSection>
  );
}

export function NavBarPage() {
  const [tab, setTab] = useState('home');
  return (
    <BrowserSection title="The four-tab capsule. It appears in the app layout and nowhere else.">
      <Demo>
        <NavBar
          inline
          value={tab}
          onChange={setTab}
          items={[
            { value: 'home', label: 'Home' },
            { value: 'sessions', label: 'Sessions' },
            { value: 'insights', label: 'Insights' },
            { value: 'scoreboard', label: 'Scoreboard' },
          ]}
        />
      </Demo>
    </BrowserSection>
  );
}

export function DotMatrixPage() {
  return (
    <>
      <BrowserSection title="Five metaphors, one grid. Same dot, same pitch, same palette.">
        <SpecimenGrid min="300px">
          {DOT_PATTERNS.map((pattern) => (
            <Specimen key={pattern} name={pattern} value={DOT_PATTERN_NOTE[pattern]}>
              <Demo>
                <DotMatrix pattern={pattern} columns={28} accent="lilac" />
              </Demo>
            </Specimen>
          ))}
        </SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Density and accent are the only other things a caller sets">
        <DemoGrid>
          <Demo>
            <DotMatrix pattern="steady" density="low" accent="mint" columns={24} />
            <Label tone="tertiary">low · mint</Label>
          </Demo>
          <Demo>
            <DotMatrix pattern="steady" density="base" accent="blue" columns={24} />
            <Label tone="tertiary">base · blue</Label>
          </Demo>
          <Demo>
            <DotMatrix pattern="steady" density="high" accent="orange" columns={24} />
            <Label tone="tertiary">high · orange</Label>
          </Demo>
        </DemoGrid>
      </BrowserSection>
    </>
  );
}

export function PatternCardPage() {
  return (
    <BrowserSection title="The fan card front — no links, ever">
      <DemoGrid>
        {PATTERNS.slice(0, 3).map((p) => (
          <div key={p.id} style={{ height: 'var(--aera-space-16)', minHeight: '300px' }}>
            <PatternCard pattern={p} showTag={false} />
          </div>
        ))}
      </DemoGrid>
    </BrowserSection>
  );
}

export function CardFanPage() {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <BrowserSection title="Eight cards, dropped rather than plotted">
      <Note>
        The tilt and the vertical stagger are pure functions of the card index, so the hand is the
        same on every render. Scale and opacity fall off toward the edges — the outermost pair sits
        at 85% and 60% — so the set reads as continuing off-screen.
      </Note>
      <Demo>
        <PatternFan
          patterns={PATTERNS}
          position={position}
          onPosition={setPosition}
          openIndex={open}
          onOpen={setOpen}
        />
      </Demo>
    </BrowserSection>
  );
}

export function ExpandedCardPage() {
  return (
    <BrowserSection title="A detail view, not a modal. No links, no close button.">
      <Demo>
        <div style={{ height: 'min(620px, 70svh)' }}>
          <ExpandedCard pattern={PATTERNS[0]} />
        </div>
      </Demo>
    </BrowserSection>
  );
}

export function SessionCardPage() {
  return (
    <BrowserSection title="One recorded session — the whole card opens">
      <Demo>
        <SessionCard session={SESSIONS[0]} onClick={() => {}} />
        <SessionCard session={SESSIONS[1]} onClick={() => {}} />
      </Demo>
    </BrowserSection>
  );
}

export function InsightCardPage() {
  return (
    <BrowserSection title="A library item. The graphic is a dot field, chosen to match the subject.">
      <DemoGrid>
        {INSIGHTS.slice(0, 4).map((i) => (
          <InsightCard key={i.id} insight={i} />
        ))}
      </DemoGrid>
    </BrowserSection>
  );
}

export function ChatPanelPage() {
  return (
    <BrowserSection title="Ask aera — four levels, loudest first">
      <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
        <ChatPanel
          messages={[
            { id: '1', from: 'aera', text: 'Ask for something to work on. I read your own sessions and patterns — nothing leaves the device.' },
            { id: '2', from: 'you', text: 'why do I rush under pressure?' },
          ]}
          suggestions={['what should I work on this week?']}
          onSend={() => {}}
        />
      </div>
    </BrowserSection>
  );
}

export function ActivityCalendarPage() {
  return (
    <BrowserSection title="A month, read as a month. Wide landscape cells, real gutters.">
      <ActivityCalendar />
    </BrowserSection>
  );
}

export function SessionTimelinePage() {
  const [playhead, setPlayhead] = useState(0.46);
  return (
    <BrowserSection title="Four tracks, one time axis, one playhead">
      <Note>
        The phase segments are sized by how long each phase actually takes — drawing them equal was
        the timeline&rsquo;s worst lie — and the names are printed in the segments rather than
        repeated underneath them. The opponents track is a field of small round dots that thickens
        at contact, and the physiology trace is drawn heavily enough to show its stress spike, its
        held breath and its recovery decay.
      </Note>
      <Card radius="card" padding="10">
        <SessionTimeline moment={MOMENTS[0]} playhead={playhead} onScrub={setPlayhead} />
      </Card>
    </BrowserSection>
  );
}

export function WellPage() {
  return (
    <BrowserSection title="The recessed frame — 12px of padding, and its graphic on the floor">
      <Note>
        Charts used to be top-aligned in their well, which left a gap underneath every one of them.
        The well is a flex column that justifies to the end, so a graphic always sits on the floor.
      </Note>
      <DemoGrid>
        <Well ratio="5 / 2">
          <Sparkline values={PATTERNS[0].series} color={colorData.mint} height={60} />
        </Well>
        <Well ratio="5 / 2">
          <BarSet items={PATTERNS[1].bars} height={60} />
        </Well>
      </DemoGrid>
    </BrowserSection>
  );
}

export function MotionStagePage() {
  const [playhead, setPlayhead] = useState(0.4);
  const [index, setIndex] = useState(0);
  return (
    <BrowserSection title="Real motion, with real volume">
      <Note>
        Every frame is the pose model evaluated at the playhead and sampled as volume — capsules
        around every bone, a sphere for the head — then put through a camera: a ground plane that
        projects as an ellipse, density falling off with distance, and foreshortening, so the
        figure nearer the camera reads larger. The transport is inside the frame, and the scrubber
        and the timeline playhead are two views of one value. Canvas approximation only — there is
        no 3D library in this project.
      </Note>
      <MotionStage
        moments={MOMENTS}
        index={index}
        playhead={playhead}
        onPlayhead={setPlayhead}
        onMoment={(next) => {
          setIndex(next);
          setPlayhead(0);
        }}
      />
    </BrowserSection>
  );
}

export function SessionInsightsPage() {
  const [playhead, setPlayhead] = useState(0.46);
  return (
    <BrowserSection title="One block, and only where the playhead is standing">
      <Note>
        Every block used to render at once, with the unreached ones greyed out, and the chips
        shared a 96px column with the title so both of them ran straight through it. Drag the
        playhead: a block appears only when it is reached, and everything in it stacks.
      </Note>
      <Slider
        label="Playhead"
        value={Math.round(playhead * 100)}
        min={0}
        max={100}
        display={`${Math.round(playhead * 100)}%`}
        onChange={(v) => setPlayhead(v / 100)}
      />
      <SessionInsights insights={MOMENTS[0].insights} playhead={playhead} />
    </BrowserSection>
  );
}

export function ShotTrendPage() {
  return (
    <BrowserSection title="The number, the session it came from, and the band it sits inside">
      <Note>
        No prose paragraph restating the figures above it, no three-stat row, no shot splits and no
        controls — a control on this tile invited comparison, and comparison is not what the
        scoreboard is for.
      </Note>
      <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
        <ShotTrend />
      </div>
    </BrowserSection>
  );
}

export function SplitLayoutPage() {
  return (
    <BrowserSection title="A sticky column beside the one that scrolls">
      <Note>
        Sessions and Insights are both this shape: the frame you read against stays put, and the
        thing you are reading moves.
      </Note>
      <SplitLayout
        aside={
          <Card radius="card" padding="10">
            <Label>sticky</Label>
            <Text variant="bodySM" tone="secondary">
              Holds its place while the column beside it scrolls.
            </Text>
          </Card>
        }
      >
        <Card radius="card" padding="10">
          <Label>scrolls</Label>
          <Text variant="bodySM" tone="secondary">
            The log, the library — whatever there is more of than fits.
          </Text>
        </Card>
      </SplitLayout>
    </BrowserSection>
  );
}

export function ShotZonesPage() {
  return (
    <BrowserSection title="A continuous field, not eight regions">
      <Note>
        The zone polygons and their tags are gone. Every dot reads the recorded attempts near it:
        dot SIZE is how often the shot is taken from that spot and dot COLOUR is how often it
        drops, on the three-step accuracy ramp. The court is drawn over the field in one neutral
        ink, and there is nothing with an edge for a corner label to hang off any more.
      </Note>
      <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
        <ShotZonesField />
      </div>
    </BrowserSection>
  );
}

export function SkillRatingsPage() {
  return (
    <BrowserSection title="Two cards: the ratings, and the conclusion drawn from them">
      <Note>
        Where-to-work-next is its own card rather than a section under the ratings. Behind a
        divider inside one card it read as a footnote to the numbers above it, when it is the
        thing those numbers are for. Each entry is a rating row and one line saying what that
        number actually does — never what to do about it.
      </Note>
      <div
        style={{
          maxWidth: 'var(--aera-layout-max-prose-width)',
          display: 'grid',
          gap: 'var(--aera-space-8)',
        }}
      >
        <SkillRatings />
        <WhereToWorkNext />
      </div>
    </BrowserSection>
  );
}

export function ShotArcPage() {
  return (
    <BrowserSection title="A solved parabola, drawn as a looped dot trail">
      <Note>
        The curve is not drawn — it is solved from the release angle, the release height and the
        distance to the ring, so the apex marker sits on the mathematical peak and the entry tangent
        is the real derivative at the rim. There is no shooter: the figure that used to hold the
        release point up rendered as an armless, headless post, and the release dot already says
        where the ball left the hand.
      </Note>
      <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
        <ShotArc />
      </div>
    </BrowserSection>
  );
}

export function FocusPanelPage() {
  return (
    <BrowserSection title="One thing worth attention, and the graphic that explains it">
      <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
        <FocusPanel />
      </div>
    </BrowserSection>
  );
}

export function VitalCardPage() {
  return (
    <BrowserSection title="A body reading. Private to the device — never shareable.">
      <DemoGrid>
        {VITALS.slice(0, 3).map((v) => (
          <VitalCard key={v.id} vital={v} />
        ))}
      </DemoGrid>
    </BrowserSection>
  );
}

export function LandingPage() {
  return (
    <>
      <BrowserSection title="Wireframe primitives — the scaffolding every section is built from">
        <WireSection
          number="00"
          name="Example"
          intent="only the section is outlined — everything inside it is a flat tint"
        >
          <WireBox>
            <Text variant="body" tone="secondary">
              A region is a flat level1 tint with no border. A slot is a muted block naming what
              will replace it.
            </Text>
          </WireBox>
          <WireSlot label="Media slot" behaviour="says what goes here and how it behaves" ratio="16 / 9" />
        </WireSection>
      </BrowserSection>
      <BrowserSection title="Every section, in order">
        <LandingHero />
        <LandingNotice />
        <LandingAudience />
        <LandingBlock
          number="05"
          name="Patterns"
          intent="shows the pull, not the push"
          heading="Patterns"
          body="Nothing is pushed at you. You pull a card toward you when you want it."
          slot="Home — card fan"
          behaviour="still frame of the hand at rest"
        />
        <LandingPrinciples />
        <LandingFuture />
        <LandingClosure />
      </BrowserSection>
      <BrowserSection title="Sticky pill — landing page only, never inside the product">
        <Demo>
          <div style={{ position: 'relative', minHeight: 'var(--aera-space-16)' }}>
            <OpenPrototypePill visible />
          </div>
        </Demo>
      </BrowserSection>
    </>
  );
}
