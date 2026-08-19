import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Text } from '../components/primitives/Text';
import { StoryFrame } from '../stories/kit';
import { kebab } from '../lib/css';
import { tokens } from './index';

const meta = {
  title: 'Tokens/Space',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One spacing scale. Components pick a step — they never write a raw px value for margin, padding or gap. The layout constants below are structural rather than spacing steps.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <StoryFrame name="space" note="the ruler, drawn at true size">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--aera-space-4)' }}>
        {Object.entries(tokens.space).map(([step, value]) => (
          <div
            key={step}
            style={{ display: 'grid', gridTemplateColumns: '96px 72px 1fr', alignItems: 'center', gap: 16 }}
          >
            <Text as="span" variant="bodySM" style={{ fontWeight: 'var(--aera-weight-semibold)' }}>
              {`space.${step}`}
            </Text>
            <Text as="span" variant="bodySM" tone="secondary" numeric>
              {value}
            </Text>
            <span
              style={{
                display: 'block',
                width: value,
                height: 14,
                borderRadius: 'var(--aera-radius-xs)',
                background: 'var(--aera-color-data-lilac)',
              }}
            />
          </div>
        ))}
      </div>
    </StoryFrame>
  ),
};

export const Layout: Story = {
  render: () => (
    <StoryFrame name="layout" note="structural constants — the header baseline lives here">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--aera-space-5)' }}>
        {Object.entries(tokens.layout).map(([name, value]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '200px 120px 1fr', gap: 16 }}>
            <Text as="span" variant="bodySM" style={{ fontWeight: 'var(--aera-weight-semibold)' }}>
              {`layout.${name}`}
            </Text>
            <Text as="span" variant="bodySM" tone="secondary" numeric>
              {value}
            </Text>
            <Label>{`--aera-layout-${kebab(name)}`}</Label>
          </div>
        ))}
      </div>
    </StoryFrame>
  ),
};
