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
          'The session log. The bento is real flex columns rather than CSS multi-column: a multi-column box has no flex gap, so the space between stacked cards could only ever be a margin on the card itself — which is what kept swallowing every spacing token aimed at this list. Each column is its own flex column with its own gap, and the independent packing is unchanged.',
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
