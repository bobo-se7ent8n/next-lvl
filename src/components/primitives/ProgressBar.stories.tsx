import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar, ProgressRow } from './Controls';
import { StoryFrame, Variant } from '../../stories/kit';
import { semanticColor } from '../../lib/color';

const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A filled track — a share of something, never a countdown and never a goal the user is behind on. ProgressRow is the named form used by the Skills block; its colour follows the semantic rule.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    color: { control: 'color' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { value: 78, color: semanticColor(0.8), size: 'md' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SemanticScale: Story = {
  name: 'Semantic scale',
  render: () => (
    <StoryFrame name="ProgressBar / ProgressRow" note="green is good, orange is developing" width={380}>
      <Variant name="rows">
        <div>
          <ProgressRow label="Free throw" value={85} color={semanticColor((85 - 45) / 45)} />
          <ProgressRow label="Catch & shoot" value={78} color={semanticColor((78 - 45) / 45)} />
          <ProgressRow label="Off the dribble" value={64} color={semanticColor((64 - 45) / 45)} />
          <ProgressRow label="Contested 3" value={52} color={semanticColor((52 - 45) / 45)} />
        </div>
      </Variant>
      <Variant name="small">
        <ProgressBar value={40} color={semanticColor(0.3)} size="sm" />
      </Variant>
    </StoryFrame>
  ),
};
