import type { Meta, StoryObj } from '@storybook/react-vite';
import { Display, Label, Text } from '../components/primitives/Text';
import { StoryFrame } from '../stories/kit';
import { kebab } from '../lib/css';
import { tokens } from './index';
import type { TextStyleName } from './typography';

const meta = {
  title: 'Tokens/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Three families and the composed text tokens built from them. Display is Oswald as a variable font; headlines get deterministic per-letter weight variation so they read as printed rather than typed.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE: Partial<Record<TextStyleName, string>> = {
  displayXL: 'Patterns',
  displayLG: 'Rushing under pressure',
  displayMD: 'Tuesday scrimmage',
  displaySM: 'Arc angle',
  metricXL: '0.42',
  metricLG: '0.42',
  metricMD: '46',
  metricSM: '18',
  body: 'A pattern is a behaviour your sessions keep repeating.',
  bodySM: 'A pattern is a behaviour your sessions keep repeating.',
  bodyXS: 'A pattern is a behaviour your sessions keep repeating.',
  label: 'release time under pressure',
  labelLG: 'what was measured',
  mono: '00:42 / 30:00',
};

export const Families: Story = {
  render: () => (
    <StoryFrame name="fontFamily" note="display · body · mono">
      {Object.entries(tokens.fontFamily).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Label>{`fontFamily.${name} · --aera-font-${kebab(name)}`}</Label>
          <p style={{ margin: 0, fontFamily: value, fontSize: 26 }}>
            aera — 0123456789
          </p>
          <Text variant="bodyXS" tone="tertiary">
            {value}
          </Text>
        </div>
      ))}
    </StoryFrame>
  ),
};

export const Scale: Story = {
  render: () => (
    <StoryFrame name="textStyle" note="every composed text token, at true size">
      {(Object.keys(tokens.textStyle) as TextStyleName[]).map((name) => {
        const style = tokens.textStyle[name] as Record<string, string | number>;
        return (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label>{`textStyle.${name} · --aera-text-${kebab(name)}-*`}</Label>
            <Text variant={name}>{SAMPLE[name] ?? name}</Text>
            <Text variant="bodyXS" tone="tertiary" numeric>
              {`${style.fontSize} / ${style.lineHeight} · ${style.letterSpacing} · ${style.fontWeight}`}
            </Text>
          </div>
        );
      })}
    </StoryFrame>
  ),
};

export const InkVariation: Story = {
  name: 'Ink variation',
  render: () => (
    <StoryFrame
      name="inkVariation"
      note={`per-letter weight ${tokens.inkVariation.weightMin}–${tokens.inkVariation.weightMax}, ±${tokens.inkVariation.rotate}° rotation, ±${tokens.inkVariation.shift}px shift — hashed from the string, so the same words always come out the same way`}
    >
      <Display size="xl">Patterns</Display>
      <Display size="lg">Focus &amp; vitals</Display>
      <Display size="lg" inked={false}>
        The same headline, unvaried
      </Display>
    </StoryFrame>
  ),
};
