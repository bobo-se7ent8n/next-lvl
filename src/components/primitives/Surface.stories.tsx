import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface, Well } from './Surface';
import { Text } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';
import { tokens } from '../../tokens';

const meta = {
  title: 'Primitives/Surface',
  component: Surface,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The raw surface: a background level, a radius and an elevation, nothing else. Well is the recessed form — a cream frame with an inset light, used inside cards.',
      },
    },
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['background', 'panel', 'level1', 'level2', 'well', 'inverse', 'transparent'],
    },
    radius: { control: 'select', options: Object.keys(tokens.radius) },
    elevation: { control: 'select', options: Object.keys(tokens.elevation) },
    padding: { control: 'select', options: Object.keys(tokens.space) },
    clip: { control: 'boolean' },
    fill: { control: 'boolean' },
  },
  args: { level: 'panel', radius: 'panel', elevation: 'medium', padding: '10' },
  render: (args) => (
    <Surface {...args} style={{ width: 280 }}>
      <Text variant="bodySM" tone="inherit">
        Surface
      </Text>
    </Surface>
  ),
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Levels: Story = {
  render: () => (
    <StoryFrame name="Surface" note="every level of the surface scale">
      {(['background', 'panel', 'level1', 'level2', 'well', 'inverse'] as const).map((level) => (
        <Variant key={level} name={level}>
          <Surface level={level} padding="8" radius="md" elevation="low" style={{ width: 240 }}>
            <Text variant="bodySM" tone="inherit">
              {level}
            </Text>
          </Surface>
        </Variant>
      ))}
      <Variant name="Well">
        <Well ratio="5 / 2" style={{ width: 240 }}>
          <Text variant="bodySM" tone="tertiary">
            recessed
          </Text>
        </Well>
      </Variant>
    </StoryFrame>
  ),
};
