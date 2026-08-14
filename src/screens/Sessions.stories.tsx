import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sessions } from './Sessions';
import { ScreenFrame } from './ScreenFrame';

const meta = {
  title: 'Screens/Sessions',
  component: Sessions,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The activity calendar sticks on the left while the session log scrolls on the right.',
      },
    },
  },
  render: () => (
    <ScreenFrame active="sessions">
      <Sessions />
    </ScreenFrame>
  ),
} satisfies Meta<typeof Sessions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
