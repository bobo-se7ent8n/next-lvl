import type { Meta, StoryObj } from '@storybook/react-vite';
import { FocusPanel } from './FocusPanel';

const meta = {
  title: 'Components/FocusPanel',
  component: FocusPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The one thing worth attention this week. The header is space-between — label left, session pill hard right — matching every other card header in the product; the pill used to sit immediately after the label, which made this the one card whose header did not line up with the rest. The graphic carries the standard inner-container treatment.',
      },
    },
  },
  render: () => (
    <div style={{ width: 380, height: 620 }}>
      <FocusPanel />
    </div>
  ),
} satisfies Meta<typeof FocusPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
