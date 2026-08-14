import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home } from './Home';
import { ScreenFrame } from './ScreenFrame';

const meta = {
  title: 'Screens/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Patterns and the fanned hand, then Focus and vitals below it. Stage one spends the scroll on the hand; at the end of the set the page releases, once, to stage two.',
      },
    },
  },
  args: {
    onOpenSessions: () => {},
    onOpenInsights: () => {},
    onOpenScoreboard: () => {},
  },
  render: () => (
    <ScreenFrame active="home">
      <Home onOpenSessions={() => {}} onOpenInsights={() => {}} onOpenScoreboard={() => {}} />
    </ScreenFrame>
  ),
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
