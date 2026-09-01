import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingPatterns } from './LandingPatterns';

const meta: Meta<typeof LandingPatterns> = {
  title: 'Landing/03 Patterns',
  component: LandingPatterns,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The hand laid out flat: five real pattern cards, each with its own row of constants — how far along, how far down, how far round, and how near the front. Written out rather than derived from the index, because the reference is not symmetrical and anything computed from an index can only ever be the shape the expression happens to make. The cards step rightward overlapping by about a third of a card, the tilts alternate, and the middle card stands highest and in front with the z-order falling away in both directions. Hovering lifts a card clear of its neighbours and leans it away from the pointer; the lean sits on its own layer inside the box the opening flight measures, so a three-dimensional hover cannot end up in the angle the panel plants itself at.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '0 var(--aera-layout-gutter)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
