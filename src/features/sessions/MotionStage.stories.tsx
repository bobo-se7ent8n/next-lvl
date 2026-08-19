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
          'Real motion, sampled as CLOUDS. Every frame is the pose model evaluated at the playhead, and every limb is scattered through its own volume — dense along the core, thinning outward, with a haze past the nominal radius, so the silhouette is implied by density rather than drawn as an outline and the body edges dissolve. The scatter is precomputed and mapped onto the bones each frame, which is what keeps the cloud from fizzing while the playhead moves. An arm has two freedoms — it swings up and it reaches forward — so a catch is hands out toward the ball rather than the T-pose the first version stood in. The camera puts a ground plane under it, drops density with distance and foreshortens, and dragging the stage orbits it. Three groups told apart by the AERA palette and nothing else. The transport is an overlay inside the frame — play, the running clock, the scrubber and the dropdown of every tracked moment — and playback pauses on each moment as it reaches it. Canvas approximation only: there is no 3D library in this project.',
      },
    },
  },
  render: () => <Harness />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
