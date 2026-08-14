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
          'The face of a card in the fan: the MEASURED / SCORE label, the headline reading, one flat sentence of trend, a compact viz driven by that pattern’s own data, and the name at the bottom. No links live here — those exist only in the expanded state.',
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
  name: 'Viz kinds',
  render: () => (
    <StoryFrame name="PatternCard" note="sparkline · bars · dots — chosen by the pattern’s own shape">
      <Row gap={24}>
        {['rushing', 'contested3', 'fatigue'].map((id) => {
          const pattern = PATTERNS.find((p) => p.id === id)!;
          return (
            <div key={id} style={{ width: 226, height: 316 }}>
              <PatternCard pattern={pattern} />
            </div>
          );
        })}
      </Row>
    </StoryFrame>
  ),
};
