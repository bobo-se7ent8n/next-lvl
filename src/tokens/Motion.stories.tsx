import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Text } from '../components/primitives/Text';
import { StoryFrame } from '../stories/kit';
import { kebab } from '../lib/css';
import { tokens } from './index';

const meta = {
  title: 'Tokens/Motion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Durations and easings. Motion shows that something moved from A to B — it never decorates and never demands attention. Nothing animates unless the user acted first, so press the button to see each token run.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function MotionRow({ name, duration, easing }: { name: string; duration: string; easing: string }) {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr 96px', gap: 18, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Text as="span" variant="bodySM" style={{ fontWeight: 'var(--aera-weight-semibold)' }}>
          {name}
        </Text>
        <Label>{duration}</Label>
      </div>
      <div
        style={{
          position: 'relative',
          height: 26,
          borderRadius: 'var(--aera-radius-pill)',
          background: 'var(--aera-color-surface-level1)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: on ? 'calc(100% - 23px)' : '3px',
            width: 20,
            height: 20,
            borderRadius: 'var(--aera-radius-pill)',
            background: 'var(--aera-color-data-mint)',
            transition: `left ${duration} ${easing}`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          borderRadius: 'var(--aera-radius-pill)',
          background: 'var(--aera-color-surface-inverse)',
          color: 'var(--aera-color-ink-on-inverse)',
          padding: '8px 14px',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        run
      </button>
    </div>
  );
}

export const Durations: Story = {
  render: () => (
    <StoryFrame name="duration" note="all shown on the house easing, ease.out">
      {Object.entries(tokens.duration).map(([name, value]) => (
        <MotionRow
          key={name}
          name={`duration.${name} · --aera-duration-${kebab(name)}`}
          duration={value}
          easing={tokens.easing.out}
        />
      ))}
    </StoryFrame>
  ),
};

export const Easings: Story = {
  render: () => (
    <StoryFrame name="easing" note="all shown at duration.slow">
      {Object.entries(tokens.easing).map(([name, value]) => (
        <MotionRow
          key={name}
          name={`easing.${name} · --aera-ease-${kebab(name)}`}
          duration={tokens.duration.slow}
          easing={value}
        />
      ))}
    </StoryFrame>
  ),
};
