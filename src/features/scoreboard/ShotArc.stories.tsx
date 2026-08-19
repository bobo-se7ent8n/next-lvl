import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShotArc } from './ShotArc';

const meta: Meta<typeof ShotArc> = {
  title: 'Components/ShotArc',
  component: ShotArc,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The trajectory is solved rather than drawn: given a release angle, a release height and a distance to the ring there is exactly one parabola that arrives at rim height. The apex marker sits on the mathematical peak, the angle wedge is anchored at the release point, the ground line spans the frame, and the ball travels the path as a looped dot trail in the same dot language as every other graphic.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <ShotArc />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
