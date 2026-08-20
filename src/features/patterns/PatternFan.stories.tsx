import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatternFan } from './PatternFan';
import { PATTERNS } from '../../data';

/** the fan owns its own position, so the story does too */
function FanHarness({ start = 0 }: { start?: number }) {
  const [position, setPosition] = useState(start);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <PatternFan
      patterns={PATTERNS}
      position={position}
      onPosition={setPosition}
      openIndex={open}
      onOpen={setOpen}
    />
  );
}

const meta: Meta<typeof PatternFan> = {
  title: 'Components/CardFan',
  component: PatternFan,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The hand, LEFT-ANCHORED. The first visible card sits at the left edge and the stack runs rightward; scrolling changes which five cards are on the stage, not where the stack sits. Depth runs left to right — the leftmost card is furthest back, the rightmost is front-most and active — so rotation and scale both climb with the slot index rather than falling away from a centre. The stage clips nothing and is sized by the cards: the `overflow: clip`, the viewport `height: clamp(...)` and the `transform: scale(--fit)` that used to slice cards off are all gone. Hover composes translateY(-8px), scale(1.02) and a partial straightening of the card’s own tilt onto the same transform as the fan geometry.',
      },
    },
  },
  render: () => <FanHarness />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MidSet: Story = {
  name: 'Mid-set — neighbours on both sides',
  render: () => <FanHarness start={5} />,
};

export const EndOfSet: Story = {
  name: 'Last card — nothing to its right',
  render: () => <FanHarness start={PATTERNS.length - 1} />,
};
