import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame, TokenCard, TokenGrid } from '../stories/kit';
import { kebab } from '../lib/css';
import { tokens } from './index';

const meta = {
  title: 'Tokens/Elevation',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Four card levels, one inset and the selection ring. Every shadow is a plain box-shadow on the same element that carries the radius — that is what keeps a sharp corner from appearing under a rounded card.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: () => (
    <StoryFrame name="elevation" note="each sample carries the shadow it names">
      <TokenGrid>
        {Object.entries(tokens.elevation).map(([name, value]) => (
          <TokenCard
            key={name}
            name={`elevation.${name}`}
            value={value.length > 46 ? `${value.slice(0, 46)}…` : value}
            cssVar={`--aera-elevation-${kebab(name)}`}
          >
            <div
              style={{
                width: '100%',
                height: 72,
                borderRadius: 'var(--aera-radius-panel)',
                background:
                  name === 'inset'
                    ? 'var(--aera-color-surface-well)'
                    : 'var(--aera-color-surface-panel)',
                boxShadow: value,
              }}
            />
          </TokenCard>
        ))}
      </TokenGrid>
    </StoryFrame>
  ),
};
