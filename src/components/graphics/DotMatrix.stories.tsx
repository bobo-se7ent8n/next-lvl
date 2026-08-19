import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotMatrix } from './DotMatrix';
import { DOT_PATTERNS, DOT_PATTERN_NOTE } from '../../lib/dotField';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Components/DotMatrix',
  component: DotMatrix,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The app’s only illustration language — there is no photography anywhere in the product. Every instance shares the dot size, the base grid pitch, the corner and the palette; what changes is the local spacing, the opacity, the omission and the phase. Each pattern is a metaphor for its subject, so a new card picks a pattern rather than inventing artwork.',
      },
    },
  },
  args: {
    pattern: 'compress',
    density: 'base',
    columns: 30,
    accent: 'lilac',
  },
} satisfies Meta<typeof DotMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: 'Every variant',
  render: () => (
    <StoryFrame name="DotMatrix" note="five metaphors, one grid — same dot, same pitch, same palette">
      {DOT_PATTERNS.map((pattern) => (
        <Variant key={pattern} name={`${pattern} — ${DOT_PATTERN_NOTE[pattern]}`}>
          <DotMatrix pattern={pattern} columns={30} accent="lilac" />
        </Variant>
      ))}
    </StoryFrame>
  ),
};

export const Densities: Story = {
  render: () => (
    <StoryFrame name="Density" note="rows deep — low, base, high">
      <Variant name="low">
        <DotMatrix pattern="steady" density="low" accent="mint" columns={26} />
      </Variant>
      <Variant name="base">
        <DotMatrix pattern="steady" density="base" accent="blue" columns={26} />
      </Variant>
      <Variant name="high">
        <DotMatrix pattern="steady" density="high" accent="orange" columns={26} />
      </Variant>
    </StoryFrame>
  ),
};

export const Animated: Story = {
  name: 'Looped',
  args: { animated: true, pattern: 'steady' },
};
