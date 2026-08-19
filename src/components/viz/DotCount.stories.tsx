import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotCount } from './DotCount';
import { StoryFrame, Variant } from '../../stories/kit';
import { colorData, colorInk } from '../../tokens';

const meta = {
  title: 'Components/DotCount',
  component: DotCount,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A count drawn as countable units — the quietest viz in the set. Used on pattern fronts where the reading is a share rather than a trend.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 48 } },
    total: { control: { type: 'range', min: 4, max: 48 } },
    columns: { control: { type: 'range', min: 4, max: 24 } },
    color: { control: 'color' },
    emptyColor: { control: 'color' },
  },
  args: { value: 18, total: 24, columns: 12, color: colorData.lilac, emptyColor: colorInk.tertiary },
  render: (args) => (
    <div style={{ width: 280 }}>
      <DotCount {...args} />
    </div>
  ),
} satisfies Meta<typeof DotCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="DotCount" note="a quarter · half · nearly full" width={280}>
      {[6, 12, 22].map((v) => (
        <Variant key={v} name={`${v} / 24`}>
          <DotCount value={v} total={24} columns={12} color={colorData.lilac} emptyColor={colorInk.tertiary} />
        </Variant>
      ))}
    </StoryFrame>
  ),
};
