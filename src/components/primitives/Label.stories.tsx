import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Mono } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Primitives/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The mono micro-label — the caption voice of the whole product. Mono is its running-text sibling, used for timecodes and machine readings.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'lg'] },
    tone: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'inherit'] },
    children: { control: 'text' },
  },
  args: { children: 'release time under pressure', size: 'sm' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="Label / Mono" note="sizes and tones">
      <Variant name="label · sm">
        <Label>what was measured</Label>
      </Variant>
      <Variant name="label · lg">
        <Label size="lg">what was measured</Label>
      </Variant>
      <Variant name="label · secondary">
        <Label tone="secondary">what was measured</Label>
      </Variant>
      <Variant name="Mono">
        <Mono>00:42 / 30:00</Mono>
      </Variant>
    </StoryFrame>
  ),
};
