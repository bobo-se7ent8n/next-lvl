import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../components/primitives/Text';
import { StoryFrame, TokenCard, TokenGrid } from '../stories/kit';
import { textStyle, type TextStyleName } from './typography';

const SAMPLE: Record<TextStyleName, string> = {
  displayXL: 'Rushing under pressure',
  displayLG: 'Focus & vitals',
  displayMD: 'Shot mechanics',
  metricLG: '0.42',
  metricMD: '18',
  metricSM: '41',
  bodyLG: 'Every session lands on your device and stays there.',
  body: 'A pattern is a behaviour your sessions keep repeating.',
  bodySM: 'Release time under a closeout has moved toward your baseline.',
  bodyStrong: 'Handling & movement',
  monoSM: 'apex 4.26 m',
  mono: 'what was measured',
  /* the landing hero's own nine, none of which the app can reach */
  heroDisplay: 'Now you can play, score & read yourself',
  heroAction: 'Try it now',
  heroWordmark: 'Aera',
  heroNav: 'Storybook',
  landingPhrase: 'aera searches the whole internet for the drills, film and lessons your game needs.',
  heroModeTitle: 'Score',
  heroModeLead: 'For the numbers that matter.',
  heroModeBody: 'Shots, sessions, streaks — tracked automatically.',
};

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Twelve composed text tokens for the product, and ten more that belong to the public page\'s hero and are used nowhere else. `metricSM` is the stat reading on a session card and `bodyStrong` is the sentence-case group heading inside a card — neither one is mono, because neither one is an annotation.  The two label sizes, the chart tick and the old mono all became one `mono` token — the mono family keeps the uppercase annotation voice, so a caption still reads as a caption. Display sizes carry per-letter weight variation hashed from the string itself.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Ramp: Story = {
  render: () => (
    <StoryFrame name="Type" note="a component never sets a size of its own">
      <TokenGrid>
        {(Object.keys(textStyle) as TextStyleName[]).map((name) => {
          const style = textStyle[name] as Record<string, string | number>;
          return (
            <TokenCard
              key={name}
              name={name}
              value={`${style.fontSize} / ${style.lineHeight} · ${style.fontWeight}`}
              cssVar={`--aera-text-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}-*`}
            >
              <Text variant={name}>{SAMPLE[name]}</Text>
            </TokenCard>
          );
        })}
      </TokenGrid>
    </StoryFrame>
  ),
};
