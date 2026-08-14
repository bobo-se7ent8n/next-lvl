import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatternFan } from './PatternFan';
import { PATTERNS } from '../../data/patterns';

const meta = {
  title: 'Components/PatternFan',
  component: PatternFan,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The fanned hand: the ruler on top, five cards visible, the hand centred, and the set cycling as the position moves. Each slot has its own Y offset, rotation and scale, so the hand is asymmetric. Hovering shows a Figma-style outline and the name tag; clicking opens the card into the centre with the rest tucked into a peeking stack. There is no drag.',
      },
    },
  },
  argTypes: {
    position: { control: { type: 'range', min: 0, max: 11, step: 0.1 } },
    openIndex: { control: { type: 'number', min: -1, max: 11 } },
    hint: { control: 'text' },
    onPosition: { action: 'moved' },
    onOpen: { action: 'opened' },
  },
  args: { patterns: PATTERNS, position: 0, openIndex: null, onPosition: () => {}, onOpen: () => {} },
  render: function Render(args) {
    const [position, setPosition] = useState(args.position);
    const [open, setOpen] = useState<number | null>(args.openIndex);
    return (
      <div style={{ padding: '32px 0' }}>
        <PatternFan
          {...args}
          position={position}
          onPosition={(p) => { setPosition(p); args.onPosition(p); }}
          openIndex={open}
          onOpen={(i) => { setOpen(i); args.onOpen(i); }}
          onOpenSessions={() => {}}
          onOpenInsights={() => {}}
          onOpenScoreboard={() => {}}
        />
      </div>
    );
  },
} satisfies Meta<typeof PatternFan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MidSet: Story = {
  name: 'Part way through the set',
  args: { position: 6 },
};

export const Opened: Story = {
  name: 'A card opened',
  args: { position: 0, openIndex: 0 },
};
