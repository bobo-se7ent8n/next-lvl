import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MotionStage } from './MotionStage';
import { MOMENTS } from '../../data/moments';

function Harness() {
  const [playhead, setPlayhead] = useState(0.35);
  const [index, setIndex] = useState(0);
  return (
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
  );
}

const meta: Meta<typeof MotionStage> = {
  title: 'Components/MotionStage',
  component: MotionStage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The stage: volumetric point-cloud figures, drag to orbit. The transport lives INSIDE the frame as a compact light pill, bottom-centred — prev, timecode, the moment it belongs to, dropdown, next. The full-width black bar that used to sit under the canvas is gone; its clock is in the pill and its play button moved to the timeline’s ruler row where it lines up with the tracks it drives.',
      },
    },
  },
  render: () => <Harness />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
