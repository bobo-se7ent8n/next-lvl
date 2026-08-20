import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionTimeline } from './SessionTimeline';
import { Card } from '../../components/primitives/Card';
import { MOMENTS } from '../../data/moments';

function Harness({ index = 0 }: { index?: number }) {
  const [playhead, setPlayhead] = useState(0.46);
  return (
    <Card radius="card" padding="10">
      <SessionTimeline moment={MOMENTS[index]} playhead={playhead} onScrub={setPlayhead} />
    </Card>
  );
}

const meta: Meta<typeof SessionTimeline> = {
  title: 'Components/SessionTimeline',
  component: SessionTimeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Four tracks, one time axis, one playhead — and no card header. The `Timeline · 00:11:24` label and the "drag any track to scrub" hint are gone: the time is already on the ruler and the transport pill, and the hint explained an affordance the playhead makes obvious. The card starts at the ruler row, whose play button occupies the same column as the track labels so the ruler and every lane share one left edge. The playhead is a triangle on the tick row with its line running down through all four tracks and into the active insight chip. Physiology’s stroke shifts along its length — green at rest, warming through the arousal spike, cooling on the descent — because one flat colour said the trace was one state throughout.',
      },
    },
  },
  render: () => <Harness />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondMoment: Story = { name: 'A quieter moment', render: () => <Harness index={1} /> };
