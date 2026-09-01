import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingHero } from './LandingHero';

const meta: Meta<typeof LandingHero> = {
  title: 'Landing/01 Hero',
  component: LandingHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One screen, one sentence, centred. It is the same headline the entry overlay unblurs as the white fills the window \u2014 both read it from one constant, so the seam between the two states cannot drift. The cursor gathers word tags while this section is in view; that is off here, because it is off wherever there is no fine pointer.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
