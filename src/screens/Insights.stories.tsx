import type { Meta, StoryObj } from '@storybook/react-vite';
import { Insights } from './Insights';
import { ScreenFrame } from './ScreenFrame';

const meta: Meta<typeof Insights> = {
  title: 'Screens/Insights',
  component: Insights,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The library. Same column model as Sessions: real flex columns with real gaps, not CSS multi-column with margins on the cards.',
      },
    },
  },
  render: () => (
    <ScreenFrame active="insights">
      <Insights />
    </ScreenFrame>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
