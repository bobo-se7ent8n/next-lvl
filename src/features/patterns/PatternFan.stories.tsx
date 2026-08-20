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
          'The hand: five cards, the active one pinned to the centre of the stage, the rest fanning symmetrically around it. Rotation and height are the even base sweep PLUS each card’s own hand — hashed from the card INDEX, so a card’s tilt belongs to the card rather than to where it happens to be standing, and it is identical on every render with no randomisation at paint time. The stage clips nothing and is sized off the cards; the step lives in a single `--fan-gap` property. The active marker below the fan is a rotated square with a real radius token, half-clipped, because a border-drawn triangle cannot take a corner radius.',
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
