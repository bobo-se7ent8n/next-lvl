import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatternFan } from './PatternFan';
import { PATTERNS } from '../../data';

/** the hand owns its own position now — the story only has to say
 *  which card it opens on, and hold the open state */
function FanHarness({ start = 0 }: { start?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  return <PatternFan patterns={PATTERNS} start={start} openIndex={open} onOpen={setOpen} />;
}

const meta: Meta<typeof PatternFan> = {
  title: 'Components/CardFan',
  component: PatternFan,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The hand. SCROLL DOES NOT MOVE IT — scroll moves a target, and a requestAnimationFrame loop eases the hand toward that target by 22% of the remaining distance every frame. That exponential decay is the whole feel of the thing, and it is why the position is a float in a ref rather than React state: the loop writes custom properties straight onto the slots and the component re-renders exactly never while the hand is moving. The arc is quadratic — the middle rides high and the ends fall away on a curve — and each card carries its own tilt and height, hashed from the card INDEX so they belong to the card rather than to the slot it is standing in. How many cards are on stage is not a setting: a card shows while it is within 4.4 of the hand, which is nine through the middle of the set and fewer at the two ends. Two transform layers — the slot places the card and is never transitioned, the card answers the pointer and is. The marker below the fan is a rotated square carrying a real radius token, half-clipped, because a border-drawn triangle cannot take a corner radius.',
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
