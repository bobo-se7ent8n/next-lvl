import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScreenPlate } from './ScreenPlate';
import { ScoreboardShot } from './screens';

const meta: Meta<typeof ScreenPlate> = {
  title: 'Landing/Screen plate',
  component: ScreenPlate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A fixed 1280 × 800 drawing surface, scaled uniformly to fill whatever frame it is standing in. Scaled rather than reflowed on purpose: a screen laid out at 480px wide is a DIFFERENT screen — three columns become one, the sticky column unpins, the bento breaks — and what belongs on a landing page is the product at its real proportions, made smaller. Everything inside is the component the app ships.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '70vw', margin: '0 auto' }}>
      <ScreenPlate>
        <ScoreboardShot />
      </ScreenPlate>
    </div>
  ),
};
