import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShotZonesField } from './ShotZonesField';

const meta: Meta<typeof ShotZonesField> = {
  title: 'Components/ShotZonesField',
  component: ShotZonesField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shots as a continuous field rather than eight named regions. Every recorded zone becomes a kernel centred where those shots were actually taken, and every dot on the grid reads every kernel: dot SIZE is the attempts near that spot, dot COLOUR is the attempt-weighted FG% on the three-step accuracy ramp. The court is drawn over the field in one neutral ink. A zone was a polygon with a hard edge and a tag hanging off it, and neither is a thing that exists — a shooter does not stop being accurate at a painted line, and the three-foot corner strips could never hold a label inside them.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
      <ShotZonesField />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
