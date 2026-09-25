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
          'The opened pattern \u2014 Paper\u2019s pattern popup. Four rows: the name with how it was arrived at in a white chip, the numeral, the source block beside the card\u2019s own dot matrix, and the last four readings. Every pattern fills the same four, so every pattern opens at the same height; the fans measure it off a hidden probe (`PanelProbe`) rather than predicting it. In the fan it is opened by a geometry transition rather than a fade: the panel is planted on the card\u2019s own bounding rect and then given the expanded one, and the five values between those two states \u2014 left, top, width, height and the corner \u2014 are what animate. It is the same element the whole way, which is why it carries a `bare` mode: while it is flying, the corner and the shadow belong to the box doing the travelling.',
      },
    },
  },
  args: { pattern: PATTERNS[0] },
  render: (args) => (
    <div style={{ width: 'min(760px, 100%)' }}>
      <ExpandedCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ExpandedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bars: Story = { args: { pattern: PATTERNS.find((p) => p.viz === 'bars') ?? PATTERNS[1] } };
export const NoSession: Story = {
  name: 'No session readings',
  args: { pattern: PATTERNS.find((p) => p.sessionIndex === undefined) ?? PATTERNS[1] },
};
export const Stacked: Story = {
  args: { stacked: true },
  render: (args) => (
    <div style={{ width: 335 }}>
      <ExpandedCard {...args} />
    </div>
  ),
};
export const DarkFace: Story = {
  name: 'Dark face',
  args: { pattern: PATTERNS.find((p) => p.fill === colorSurface.inverse) ?? PATTERNS[6] },
};
