import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame, TokenCard, TokenGrid } from '../stories/kit';
import { tokens } from './index';

const meta = {
  title: 'Tokens/Radius',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The squircle-family radii. The card scale is generous on purpose — the object language of this product is a soft rectangle, not a rounded box.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <StoryFrame name="radius" note="each sample is drawn with the token it names">
      <TokenGrid>
        {Object.entries(tokens.radius).map(([name, value]) => (
          <TokenCard key={name} name={`radius.${name}`} value={value} cssVar={`--aera-radius-${name}`}>
            <div
              style={{
                width: '100%',
                height: 72,
                borderRadius: value,
                background: 'var(--aera-color-surface-panel)',
                boxShadow: 'var(--aera-elevation-medium)',
              }}
            />
          </TokenCard>
        ))}
      </TokenGrid>
    </StoryFrame>
  ),
};
