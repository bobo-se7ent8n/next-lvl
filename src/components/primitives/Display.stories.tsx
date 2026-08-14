import type { Meta, StoryObj } from '@storybook/react-vite';
import { Display } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Primitives/Display',
  component: Display,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A display headline in Oswald. Per-letter weight variation is on by default at the two largest sizes; the randomness is hashed from the string, so a headline always comes out the same way.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xl', 'lg', 'md', 'sm'] },
    inked: { control: 'boolean' },
    tone: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'numeral', 'inherit'],
    },
    align: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end'] },
    children: { control: 'text' },
  },
  args: { children: 'Patterns', size: 'xl' },
} satisfies Meta<typeof Display>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <StoryFrame name="Display" note="size">
      {(['xl', 'lg', 'md', 'sm'] as const).map((size) => (
        <Variant key={size} name={size}>
          <Display {...args} size={size}>
            Rushing under pressure
          </Display>
        </Variant>
      ))}
    </StoryFrame>
  ),
};

export const InkedAndPlain: Story = {
  name: 'Inked and plain',
  render: () => (
    <StoryFrame name="Display" note="the same words, with and without per-letter variation">
      <Variant name="inked">
        <Display size="lg">Focus &amp; vitals</Display>
      </Variant>
      <Variant name="plain">
        <Display size="lg" inked={false}>
          Focus &amp; vitals
        </Display>
      </Variant>
    </StoryFrame>
  ),
};
