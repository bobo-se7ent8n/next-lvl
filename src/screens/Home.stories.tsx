import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home } from './Home';
import { ScreenFrame } from './ScreenFrame';

const meta: Meta<typeof Home> = {
  title: 'Screens/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Patterns and the fanned hand, then Focus and vitals below it. Stage one spends the scroll on the hand: every pattern is in the set, eight are in the window, and the ACTIVE CARD IS ALWAYS CENTRED \u2014 the hand flows leftward through the middle of the stage, new cards animate in from the right and spent ones animate out on the left. The ends look asymmetric only because the first and last cards have no neighbour on one side. At the end of the set the page releases, once, to stage two \u2014 the focus column and the 3 \u00d7 2 vitals grid, sized to one shared column height so the whole stage fits a screen without scrolling.',
      },
    },
  },
  render: () => (
    <ScreenFrame active="home">
      <Home />
    </ScreenFrame>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
