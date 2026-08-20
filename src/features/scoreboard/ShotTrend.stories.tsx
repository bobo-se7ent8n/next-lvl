import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShotTrend } from './ShotTrend';
import { StoryFrame } from '../../stories/kit';

const meta: Meta<typeof ShotTrend> = {
  title: 'Features/Scoreboard/ShotTrend',
  component: ShotTrend,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Where the shot is going — the block that replaced the points tile. Two readings, not three: consistency was the third and it is already the last row of Shot Mechanics directly underneath, so printing it twice only made this block taller than its column. The degree is a raised superscript tight to its number rather than the first character of the unit string, which put it on the baseline behind the unit slot’s own gap.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ShotTrend> = {
  render: () => (
    <StoryFrame name="Where the shot is going" note="A direction, its numbers, and one line placing it.">
      <div style={{ maxWidth: 420 }}>
        <ShotTrend />
      </div>
    </StoryFrame>
  ),
};
