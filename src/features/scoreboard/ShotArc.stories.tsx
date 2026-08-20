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
          'The trajectory: a true parabola solved from the release height, the distance and the arc angle. Every label inside the diagram is one size and ONE COLOUR — they were three sizes and two weights in three different inks, so the diagram looked annotated by three different people. The caption sits directly under the header row rather than at the foot, where it read as a footnote to the stat rows. The chart container is a Well.',
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
