import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingBlock } from './LandingBlock';

const meta: Meta<typeof LandingBlock> = {
  title: 'Landing/04-08 Section block',
  component: LandingBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One component rendered five times. Section 04 is the turn in the argument and carries primary weight; 05 through 08 are a repeating secondary rhythm with a locked heading baseline, so the four read as one continuous surface.',
      },
    },
  },
  args: {
    number: '05',
    name: 'Patterns',
    intent: 'shows the pull, not the push — the interaction is the argument here',
    heading: 'Patterns',
    body: 'Nothing is pushed at you. You pull a card toward you when you want it.',
    slot: 'Home — card fan',
    behaviour: 'still frame of the hand at rest',
    ratio: '16 / 9',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {};

export const Teaser: Story = {
  name: '04 Prototype teaser — primary, full bleed',
  args: {
    number: '04',
    name: 'See it working',
    weight: 'primary',
    intent: 'the turn — everything above is a claim, this is the first evidence',
    heading: 'See it working',
    body: 'The prototype is real, and unfinished. Open it whenever.',
    slot: 'Live card fan — cropped at viewport edge',
    behaviour: 'live and interactive, running past both edges',
    ratio: '21 / 9',
    bleed: true,
  },
};

export const LockedBaseline: Story = {
  name: 'Locked baseline — 05 through 08',
  render: () => (
    <>
      <LandingBlock
        number="05"
        name="Patterns"
        intent="shows the pull, not the push"
        heading="Patterns"
        body="Nothing is pushed at you. You pull a card toward you when you want it."
        slot="Home — card fan"
        behaviour="still frame of the hand at rest"
      />
      <LandingBlock
        number="06"
        name="Sessions"
        intent="raw record, no scoring"
        heading="Sessions"
        body="Every session goes in raw. What you did, not how it scored."
        slot="Sessions screen"
        behaviour="still frame, calendar beside the log"
      />
      <LandingBlock
        number="07"
        name="Scoreboard"
        intent="the privacy line, drawn in public"
        heading="Scoreboard"
        body="Your sport stats, and only your sport stats, are yours to share."
        slot="Scoreboard screen"
        behaviour="still frame, court and ratings"
      />
      <LandingBlock
        number="08"
        name="Insights"
        intent="the payoff — mechanics and tendencies finally meet"
        heading="Insights"
        body="Where mechanics meet tendencies. Stated plainly, never graded."
        slot="Insights screen"
        behaviour="still frame, ask panel beside the library"
      />
    </>
  ),
};
