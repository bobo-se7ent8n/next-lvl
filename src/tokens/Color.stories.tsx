import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryFrame, Swatch, TokenCard, TokenGrid } from '../stories/kit';
import {
  colorData,
  colorDataInk,
  colorInk,
  colorSemantic,
  accuracyRamp,
  colorSurface,
  colorUtility,
} from './color';

const meta: Meta = {
  title: 'Tokens/Color',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The scale is eight values: four surfaces and four inks. Cards and the page share a fill now — a card reads as a distinct object because of its elevation and its radius, not because it is a different colour. Everything below the scale is a mapping onto the AERA palette rather than a new colour.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const group = (obj: Record<string, string>, prefix: string) => (
  <TokenGrid>
    {Object.entries(obj).map(([name, value]) => (
      <TokenCard
        key={name}
        name={name}
        value={value}
        cssVar={`--aera-color-${prefix}-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`}
      >
        <Swatch color={value} />
      </TokenCard>
    ))}
  </TokenGrid>
);

export const Scale: Story = {
  name: 'The eight-token scale',
  render: () => (
    <>
      <StoryFrame name="Surface" note="the paper, and the face of every card resting on it">
        {group(colorSurface, 'surface')}
      </StoryFrame>
      <StoryFrame name="Ink" note="four inks — every numeral now uses primary">
        {group(colorInk, 'ink')}
      </StoryFrame>
    </>
  ),
};

export const Palette: Story = {
  name: 'AERA palette',
  render: () => (
    <>
      <StoryFrame name="Data" note="five hues and nothing outside them — carries no meaning on its own">
        {group(colorData, 'data')}
      </StoryFrame>
      <StoryFrame name="Data ink" note="legible text on each palette colour">
        {group(colorDataInk, 'data-ink')}
      </StoryFrame>
    </>
  ),
};

export const Meaning: Story = {
  render: () => (
    <>
      <StoryFrame name="Semantic" note="green good, orange bad, yellow between — the global rule">
        {group(colorSemantic, 'semantic')}
      </StoryFrame>
      <StoryFrame
        name="Accuracy"
        note="three ordered stops, and they are the semantic ones — a scale that reads in order can only use hues that have an order"
      >
        {group(
          Object.fromEntries(accuracyRamp.map((stop) => [stop.name, stop.color])),
          'accuracy',
        )}
      </StoryFrame>
      <StoryFrame name="Utility" note="the functional colours that are not part of the scale">
        {group(colorUtility, 'utility')}
      </StoryFrame>
    </>
  ),
};
