import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sessions } from './Sessions';
import { ScreenFrame } from './ScreenFrame';

const meta: Meta<typeof Sessions> = {
  title: 'Screens/Sessions',
  component: Sessions,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The month calendar runs full width above the log, and every session card opens its own detail view — the replay stage, the moment pager, and the multi-track timeline.',
      },
    },
  },
  render: () => (
    <ScreenFrame active="sessions">
      <Sessions />
    </ScreenFrame>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
