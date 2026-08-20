import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Display, Text } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';
import { tokens } from '../../tokens';
import { colorData } from '../../tokens';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The card, and it is a FLEX COLUMN — `gap` is a no-op on a `display: block` box, which is why card spacing failed to land for two rounds no matter which token it was given. It also no longer clips. Two mutually exclusive treatments, decided from the `interactive` prop rather than per-card: a clickable card floats (drop shadow, no stroke, hover lift and press compression), a non-clickable one is flat (2px #F3F2EE stroke, no shadow, and no hover at all — it is a region of the page, not a target).',
      },
    },
  },
  argTypes: {
    face: { control: 'color' },
    radius: { control: 'select', options: Object.keys(tokens.radius) },
    elevation: { control: 'select', options: Object.keys(tokens.elevation) },
    padding: { control: 'select', options: Object.keys(tokens.space) },
    interactive: { control: 'boolean' },
    outlined: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fill: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: { radius: 'card', elevation: 'medium', padding: '10' },
  render: (args) => (
    <Card {...args} style={{ width: 260, gap: 'var(--aera-space-5)' }}>
      <Display size="md" as="h3" tone="inherit">
        Card
      </Display>
      <Text variant="bodySM" tone="inherit">
        A surface with a face colour and a shadow that always follows its radius.
      </Text>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <StoryFrame name="Card" note="default · hover (lift) · active · outlined · disabled">
      <Variant name="default">
        <Card padding="8" style={{ width: 220 }}>
          <Text variant="bodySM">resting</Text>
        </Card>
      </Variant>
      <Variant name="interactive">
        <Card interactive padding="8" style={{ width: 220 }}>
          <Text variant="bodySM">hover and press me</Text>
        </Card>
      </Variant>
      <Variant name="outlined on hover">
        <Card interactive outlined padding="8" style={{ width: 220 }}>
          <Text variant="bodySM">figma-style ring</Text>
        </Card>
      </Variant>
      <Variant name="disabled">
        <Card interactive disabled padding="8" style={{ width: 220 }}>
          <Text variant="bodySM">disabled</Text>
        </Card>
      </Variant>
      <Variant name="face colour">
        <Card face={colorData.mint} padding="8" style={{ width: 220 }}>
          <Text variant="bodySM" tone="inherit">
            ink flips with the face
          </Text>
        </Card>
      </Variant>
    </StoryFrame>
  ),
};
