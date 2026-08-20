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
          'The bento. There is no period selector on the page: the window is chosen on ENTRY to the tab, stepping a deterministic cycle, so arriving at the scoreboard recalculates every number and re-renders the shot field. The dots transition their size and colour into the new dataset rather than cutting to it. Hover behaviour on the field is untouched.',
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
