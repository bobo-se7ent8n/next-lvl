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
  body: 'A pattern is a behaviour your sessions keep repeating.',
  bodySM: 'Release time under a closeout has moved toward your baseline.',
  mono: 'what was measured',
};

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Eight composed text tokens, collapsed from fifteen. The two label sizes, the chart tick and the old mono all became one `mono` token — the mono family keeps the uppercase annotation voice, so a caption still reads as a caption. Display sizes carry per-letter weight variation hashed from the string itself.',
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
