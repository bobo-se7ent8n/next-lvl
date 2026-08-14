import type { Meta, StoryObj } from '@storybook/react-vite';
import { Metric } from './Metric';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Primitives/Metric',
  component: Metric,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A big number with its unit — the headline reading of any card. The number is always tabular so two readings can be compared down a column.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    align: { control: 'inline-radio', options: ['start', 'center'] },
    inherit: { control: 'boolean' },
    value: { control: 'text' },
    unit: { control: 'text' },
    caption: { control: 'text' },
  },
  args: { value: '0.42', unit: 's', size: 'lg', caption: 'release under pressure' },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <StoryFrame name="Metric" note="size">
      {(['xl', 'lg', 'md', 'sm'] as const).map((size) => (
        <Variant key={size} name={size}>
          <Metric value="0.42" unit="s" size={size} />
        </Variant>
      ))}
      <Variant name="with caption">
        <Metric value="84" unit="/ 100" size="lg" caption="activity load" />
      </Variant>
    </StoryFrame>
  ),
};
