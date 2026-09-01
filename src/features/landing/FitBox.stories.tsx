import type { Meta, StoryObj } from '@storybook/react-vite';
import { FitBox } from './FitBox';
import { ScoreboardShot } from './screens';

const meta: Meta<typeof FitBox> = {
  title: 'Landing/Fit to height',
  component: FitBox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A block that must sit inside one viewport and whose content is naturally taller has three options: crop it, scroll it, or make it smaller. On a page whose whole argument is that the product fits on a screen, the first two are the page admitting it does not. This measures both and scales the difference away. It cannot oscillate: a transform does not change an element’s layout box, so the measured natural height is the same before and after the scale is applied, and the observer cannot be woken by its own output.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Constrained: Story = {
  name: 'A board given half the height it wants',
  render: () => (
    <div style={{ height: '50dvh', padding: 'var(--aera-landing-frame)' }}>
      <FitBox>
        <ScoreboardShot />
      </FitBox>
    </div>
  ),
};
