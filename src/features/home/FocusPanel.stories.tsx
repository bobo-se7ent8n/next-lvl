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
          'One thing worth attention this week. It reads top to bottom: the number carries the weight, and the three beats are a plain stacked sequence — what we saw, why it happens, what to do.',
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
