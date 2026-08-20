import type { Meta, StoryObj } from '@storybook/react-vite';
import { InsightCard } from './InsightCard';
import { StoryFrame, Row } from '../../stories/kit';
import { INSIGHTS } from '../../data/insights';

const meta = {
  title: 'Components/InsightCard',
  component: InsightCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A library item, pulled from rather than pushed. One flex column at the 16px block step, with the heading row and its line nested in a second column at 12px. Footer runs filled tag, stroked tag, then the duration right-aligned. Clickable treatment: shadow, no stroke.',
      },
    },
  },
  argTypes: { onClick: { action: 'opened' } },
  args: { insight: INSIGHTS[0] },
  render: (args) => (
    <div style={{ width: 360 }}>
      <InsightCard {...args} />
    </div>
  ),
} satisfies Meta<typeof InsightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Kinds: Story = {
  render: () => (
    <StoryFrame name="InsightCard" note="drill · lesson · video">
      <Row gap={20}>
        {['breath', 'rushing-lesson', 'sleep'].map((id) => (
          <div key={id} style={{ width: 320 }}>
            <InsightCard insight={INSIGHTS.find((i) => i.id === id)!} />
          </div>
        ))}
      </Row>
    </StoryFrame>
  ),
};
