import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpandedCard } from './ExpandedCard';
import { PATTERNS } from '../../data';
import { colorSurface } from '../../tokens';

const meta = {
  title: 'Components/ExpandedCard',
  component: ExpandedCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The opened pattern. A DETAIL VIEW and nothing more: the full viz, what was measured, the longer read and the confirmed history \u2014 no links out, no close button, no modal chrome. In the fan it is opened by a geometry transition rather than a fade: the panel is planted on the card\u2019s own bounding rect and then given the expanded one, and the five values between those two states \u2014 left, top, width, height and the corner \u2014 are what animate. It is the same element the whole way, which is why it carries a `bare` mode: while it is flying, the corner and the shadow belong to the box doing the travelling.',
      },
    },
  },
  args: { pattern: PATTERNS[0] },
  render: (args) => (
    <div style={{ height: 'min(620px, 74svh)' }}>
      <ExpandedCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ExpandedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bars: Story = { args: { pattern: PATTERNS.find((p) => p.viz === 'bars') ?? PATTERNS[1] } };
export const DarkFace: Story = {
  name: 'Dark face',
  args: { pattern: PATTERNS.find((p) => p.fill === colorSurface.inverse) ?? PATTERNS[6] },
};
