import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';
import { tokens } from '../../tokens';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The one text component. Every string in the product goes through it, so no component ever sets its own font-size, weight or tracking — it names a composed text token instead.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: Object.keys(tokens.textStyle) },
    tone: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'numeral', 'onInverse', 'inherit'],
    },
    align: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end'] },
    numeric: { control: 'boolean' },
    measure: { control: 'boolean' },
    lines: { control: { type: 'number', min: 0, max: 6 } },
    as: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    children: 'A pattern is a behaviour your sessions keep repeating.',
    variant: 'body',
    tone: 'primary',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <StoryFrame name="Text" note="tone">
      {(['primary', 'secondary', 'tertiary', 'numeral'] as const).map((tone) => (
        <Variant key={tone} name={tone}>
          <Text {...args} tone={tone} />
        </Variant>
      ))}
      <Variant name="onInverse">
        <span
          style={{
            display: 'block',
            background: 'var(--aera-color-surface-inverse)',
            borderRadius: 'var(--aera-radius-md)',
            padding: 'var(--aera-space-6)',
          }}
        >
          <Text {...args} tone="onInverse" />
        </span>
      </Variant>
    </StoryFrame>
  ),
};

export const Truncation: Story = {
  args: { lines: 2, measure: true },
  render: (args) => (
    <StoryFrame name="Text" note="measure + line clamp">
      <div style={{ width: 320 }}>
        <Text {...args}>
          A pattern is a behaviour your sessions keep repeating. Twelve of them are holding right
          now, and each one has a full history behind it.
        </Text>
      </div>
    </StoryFrame>
  ),
};
