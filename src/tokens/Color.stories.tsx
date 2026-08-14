import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame, Swatch, TokenCard, TokenGrid } from '../stories/kit';
import { kebab } from '../lib/css';
import { tokens, shotZoneRamp } from './index';

const meta = {
  title: 'Tokens/Color',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Every colour in the product. Surface and ink are the paper and the text on it; the data palette carries no meaning on its own; the semantic scale is the global green-good / orange-bad rule; the Shot Zones ramp is the one deliberate exemption from that rule.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Group({ group, note }: { group: keyof typeof tokens.color; note?: string }) {
  const entries = Object.entries(tokens.color[group]) as Array<[string, string]>;
  return (
    <StoryFrame name={`color.${group}`} note={note}>
      <TokenGrid>
        {entries.map(([name, value]) => (
          <TokenCard
            key={name}
            name={`color.${group}.${name}`}
            value={value}
            cssVar={`--aera-color-${kebab(group)}-${kebab(name)}`}
          >
            <Swatch color={value} />
          </TokenCard>
        ))}
      </TokenGrid>
    </StoryFrame>
  );
}

export const Surface: Story = {
  render: () => <Group group="surface" note="the paper and the levels raised off it" />,
};

export const Ink: Story = {
  render: () => <Group group="ink" note="text colours, densest first" />,
};

export const DataPalette: Story = {
  name: 'Data palette',
  render: () => (
    <Group group="data" note="five muted hues plus two neutral extenders — no meaning attached" />
  ),
};

export const Semantic: Story = {
  render: () => (
    <Group
      group="semantic"
      note="the global rule: green is good, orange/red is bad, yellow is the middle. Nothing else may claim these meanings."
    />
  ),
};

export const ShotZoneRamp: Story = {
  name: 'Shot zones ramp (semantic exemption)',
  render: () => (
    <StoryFrame
      name="color.shotZone"
      note="cold → hot FG%. This is the ONE scale exempt from the semantic rule, because it follows the basketball convention rather than ours. Never reuse it outside Shot Zones."
    >
      <TokenGrid>
        {shotZoneRamp.map((stop) => (
          <TokenCard
            key={stop.name}
            name={`color.shotZone.${stop.name}`}
            value={`${stop.color} · up to ${stop.max === Infinity ? '∞' : `${Math.round(stop.max * 100)}%`}`}
            cssVar={`--aera-color-shot-zone-${stop.name}`}
          >
            <Swatch color={stop.color} />
          </TokenCard>
        ))}
      </TokenGrid>
    </StoryFrame>
  ),
};

export const Utility: Story = {
  render: () => <Group group="utility" note="selection outline, hairlines, empty tracks" />,
};
