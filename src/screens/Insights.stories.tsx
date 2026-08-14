import type { Meta, StoryObj } from '@storybook/react-vite';
import { Insights } from './Insights';
import { ScreenFrame } from './ScreenFrame';

const meta = {
  title: 'Screens/Insights',
  component: Insights,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The assistant sticks on the left, the library scrolls on the right, and there is no filter — the cards keep their own ON COURT / OFF COURT tags.',
      },
    },
  },
  render: () => (
    <ScreenFrame active="insights">
      <Insights />
    </ScreenFrame>
  ),
} satisfies Meta<typeof Insights>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
