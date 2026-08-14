import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShotMechanics } from './ShotMechanics';

const meta = {
  title: 'Components/ShotMechanics',
  component: ShotMechanics,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The arc trajectory with its apex and the launch-angle callout, the arc angle / release time / motion consistency rows, and the line saying where the numbers came from. The control point of the curve is placed so the tangent leaving the hand really is the measured angle.',
      },
    },
  },
  render: () => (
    <div style={{ width: 520 }}>
      <ShotMechanics />
    </div>
  ),
} satisfies Meta<typeof ShotMechanics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
