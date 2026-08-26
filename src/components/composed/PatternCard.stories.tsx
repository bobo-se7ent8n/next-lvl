import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatternCard } from './PatternCard';
import { StoryFrame, Row } from '../../stories/kit';
import { PATTERNS } from '../../data/patterns';

const meta = {
  title: 'Components/PatternCard',
  component: PatternCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The fan card front, read top to bottom: title and kind pill, the reading, the line under it, then the graphic taking every pixel the three text rows leave. The title used to sit at the very bottom under a small graphic strip, which made the card read from the number upward. The graphic slot is deliberately swappable — the layout makes no assumption about what renders inside beyond that it fills its box, because these become generated artwork later.',
      },
    },
  },
  argTypes: {
    hovered: { control: 'boolean' },
    showTag: { control: 'boolean' },
    onClick: { action: 'opened' },
  },
  args: { pattern: PATTERNS[0], hovered: false, showTag: true },
  render: (args) => (
    <div style={{ width: 226, height: 316 }}>
      <PatternCard {...args} />
    </div>
  ),
} satisfies Meta<typeof PatternCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: function Render() {
    const [hover, setHover] = useState<number | null>(null);
    return (
      <StoryFrame name="PatternCard" note="rest · hover (outline + name tag) — there is no drag state">
        <Row gap={28}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{ width: 226, height: 316 }}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            >
              <PatternCard pattern={PATTERNS[i]} hovered={hover === i} />
            </div>
          ))}
        </Row>
      </StoryFrame>
    );
  },
};

export const VizKinds: Story = {
  name: 'Chart kinds',
  render: () => (
    <StoryFrame
      name="PatternCard"
      note="bars · area · line — the pattern’s own data, the same chart the panel opens with"
    >
      <Row gap={24}>
        {[0, 1, 2].map((i) => {
          const pattern = PATTERNS[i];
          return (
            <div key={pattern.id} style={{ width: 226, height: 316 }}>
              <PatternCard pattern={pattern} />
            </div>
          );
        })}
      </Row>
    </StoryFrame>
  ),
};
