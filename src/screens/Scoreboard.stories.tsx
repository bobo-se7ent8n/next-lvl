import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scoreboard } from './Scoreboard';
import { ScreenFrame } from './ScreenFrame';

const meta: Meta<typeof Scoreboard> = {
  title: 'Screens/Scoreboard',
  component: Scoreboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A compact bento grid — shot zones, points across three windows, shot mechanics and skills. Sport statistics only.',
      },
    },
  },
  render: () => (
    <ScreenFrame active="scoreboard">
      <Scoreboard />
    </ScreenFrame>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
