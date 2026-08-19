import type { Meta, StoryObj } from '@storybook/react-vite';
import { Well } from './Surface';
import { Sparkline } from '../viz/Sparkline';
import { BarSet } from '../viz/BarSet';
import { StoryFrame, Variant } from '../../stories/kit';
import { colorData } from '../../tokens';
import { PATTERNS } from '../../data';

const meta: Meta<typeof Well> = {
  title: 'Primitives/Well',
  component: Well,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The recessed frame inside a card. Its padding is one step for the whole product — 12px — and its content is bottom-aligned, so a chart sits on the floor of the well instead of floating at the top of it with a gap underneath. It applies uniformly, bar charts included, so a row of cards reads consistently.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomAligned: Story = {
  name: 'Bottom-aligned',
  render: () => (
    <StoryFrame name="Well" note="the graphic sits on the floor, at every ratio">
      <Variant name="sparkline">
        <Well ratio="5 / 2" style={{ width: 320 }}>
          <Sparkline values={PATTERNS[0].series} color={colorData.mint} height={54} />
        </Well>
      </Variant>
      <Variant name="bars">
        <Well ratio="5 / 2" style={{ width: 320 }}>
          <BarSet items={PATTERNS[1].bars} height={54} />
        </Well>
      </Variant>
      <Variant name="tall">
        <Well ratio="1 / 1" style={{ width: 200 }}>
          <Sparkline values={PATTERNS[0].series} color={colorData.blue} height={54} />
        </Well>
      </Variant>
    </StoryFrame>
  ),
};
