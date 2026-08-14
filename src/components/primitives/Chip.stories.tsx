import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, Tag } from './Chip';
import { StoryFrame, Row, Variant } from '../../stories/kit';
import { colorData } from '../../tokens';

const meta = {
  title: 'Primitives/Chip & Tag',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chip is the filled pill: it carries an attribute — measured, score, drill — never a status judgement. Tag is the unfilled label used for meta on a card.',
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', ...Object.keys(colorData)] },
    children: { control: 'text' },
  },
  args: { children: 'Measured', tone: 'neutral' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <StoryFrame name="Chip / Tag" note="every tone, plus the two Tag forms">
      <Variant name="Chip">
        <Row>
          <Chip>neutral</Chip>
          {(Object.keys(colorData) as Array<keyof typeof colorData>).map((tone) => (
            <Chip key={tone} tone={tone}>
              {tone}
            </Chip>
          ))}
        </Row>
      </Variant>
      <Variant name="Tag">
        <Row>
          <Tag>on court</Tag>
          <Tag quiet>rushing under pressure</Tag>
        </Row>
      </Variant>
    </StoryFrame>
  ),
};
