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
          'Every pattern is in the set and eight of them are in the window, heavily overlapped — each card covers nearly two thirds of the one behind it. THE ACTIVE CARD IS ALWAYS CENTRED: the hand flows leftward through the middle of the stage as you scroll, and the ends look asymmetric only because the first and last cards have no neighbour on one side. Each card carries its own tilt and vertical stagger, both pure functions of the card index, so the hand never re-shuffles on a render; the slot supplies the spread and the scale falloff. Nothing inside the window fades, and a card leaving it animates out rather than popping. Clicking a card grows that card — the same element, on its own left, top, width, height and corner — into the expanded panel.',
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
