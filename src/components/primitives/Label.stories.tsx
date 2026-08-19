import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Mono } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';

const meta: Meta<typeof Label> = {
  title: 'Primitives/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The mono micro-label — the annotation voice of the whole product. There is one mono size now: the two label sizes, the chart tick and the old running mono all collapsed into a single token, because the distinction between them was one nobody could see. It keeps the uppercase treatment, so a caption still reads as a caption.',
      },
    },
  },
  args: { children: 'what was measured' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <StoryFrame name="Label" note="one size, three inks">
      <Variant name="tertiary">
        <Label>release under pressure</Label>
      </Variant>
      <Variant name="secondary">
        <Label tone="secondary">release under pressure</Label>
      </Variant>
      <Variant name="primary">
        <Label tone="primary">release under pressure</Label>
      </Variant>
      <Variant name="Mono — numeric">
        <Mono>00:11:24</Mono>
      </Variant>
    </StoryFrame>
  ),
};
