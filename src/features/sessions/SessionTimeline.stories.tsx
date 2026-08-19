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
          'Four tracks on one time axis with a single playhead. The pose segments are sized by how long each phase actually takes — a drive is long and a release is not, and drawing them equal was the timeline’s worst lie — and the phase names are printed in the segments rather than repeated underneath them. The opponents track is a field of small round dots that thickens on contact and thins as separation opens; the physiology trace is drawn heavily enough to show its stress spike, the flat stretch where the breath is held, and the slow recovery after the shot.',
      },
    },
  },
  render: () => <Harness />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondMoment: Story = { name: 'A quieter moment', render: () => <Harness index={1} /> };
