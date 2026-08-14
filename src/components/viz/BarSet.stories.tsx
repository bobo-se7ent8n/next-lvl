import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarSet } from './BarSet';
import { StoryFrame, Variant } from '../../stories/kit';

const ITEMS = [
  { label: 'calm', value: 54, tone: 'mint' as const },
  { label: 'elevated', value: 31, tone: 'yellow' as const },
  { label: 'peak', value: 15, tone: 'orange' as const },
];

const meta = {
  title: 'Components/BarSet',
  component: BarSet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small set of categories side by side. On a coloured card the set sits on a translucent well, so a bar whose tone matches the card face still reads.',
      },
    },
  },
  argTypes: {
    height: { control: { type: 'range', min: 40, max: 220 } },
    showValues: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    radius: { control: 'inline-radio', options: ['pill', 'md'] },
    inherit: { control: 'boolean' },
  },
  args: { items: ITEMS, height: 130, showValues: true, showLabels: true, radius: 'pill' },
  render: (args) => (
    <div style={{ width: 340 }}>
      <BarSet {...args} />
    </div>
  ),
} satisfies Meta<typeof BarSet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="BarSet" note="full · compact · on a coloured face" width={340}>
      <Variant name="full">
        <BarSet items={ITEMS} height={130} showLabels />
      </Variant>
      <Variant name="compact">
        <BarSet items={ITEMS} height={62} showValues={false} radius="md" />
      </Variant>
      <Variant name="on a mint face">
        <div style={{ background: '#93EAC3', borderRadius: 22, padding: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.42)', borderRadius: 16, padding: 12 }}>
            <BarSet items={ITEMS} height={110} showLabels inherit />
          </div>
        </div>
      </Variant>
    </StoryFrame>
  ),
};
