import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame, TokenCard, TokenGrid } from '../stories/kit';
import { colorData } from './color';
import { radius } from './radius';

const meta: Meta = {
  title: 'Tokens/Radius',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Seven squircle radii, collapsed from ten: xxs folded into xs, and panel and shell folded into card, because three near-identical large corners were three ways of saying the same thing. `pill` is the only fully round token.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <StoryFrame name="Radius" note="every card, panel and object shell is one corner now">
      <TokenGrid>
        {Object.entries(radius).map(([name, value]) => (
          <TokenCard key={name} name={name} value={value} cssVar={`--aera-radius-${name}`}>
            <div
              style={{
                height: 72,
                borderRadius: value,
                background: colorData.lilac,
              }}
            />
          </TokenCard>
        ))}
      </TokenGrid>
    </StoryFrame>
  ),
};
