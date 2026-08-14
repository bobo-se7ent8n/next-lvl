import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityPanel } from './ActivityPanel';

const meta = {
  title: 'Components/ActivityPanel',
  component: ActivityPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The activity calendar and what it adds up to. It sits sticky beside the session log, because it is the frame the sessions are read against. No streaks, no guilt for a rest day.',
      },
    },
  },
  render: () => (
    <div style={{ width: 460 }}>
      <ActivityPanel />
    </div>
  ),
} satisfies Meta<typeof ActivityPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
