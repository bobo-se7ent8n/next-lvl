import type { Meta, StoryObj } from '@storybook/react-vite';
import { Legend } from './Legend';
import { StoryFrame, Variant } from '../../stories/kit';
import { accuracyRamp, colorData } from '../../tokens';

const meta = {
  title: 'Components/Legend',
  component: Legend,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The key for any chart: swatch, name, and an optional reading.',
      },
    },
  },
  argTypes: {
    justify: { control: 'inline-radio', options: ['start', 'center'] },
    inherit: { control: 'boolean' },
  },
  args: {
    items: [
      { label: 'now', value: '74ms', color: colorData.mint },
      { label: '7-day low', value: '61ms', color: colorData.blue },
    ],
    justify: 'start',
  },
} satisfies Meta<typeof Legend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="Legend" note="with readings · plain · the shot-zone ramp">
      <Variant name="with readings">
        <Legend
          items={[
            { label: 'now', value: '74ms', color: colorData.mint },
            { label: '7-day low', value: '61ms', color: colorData.blue },
          ]}
        />
      </Variant>
      <Variant name="plain">
        <Legend
          items={[
            { label: 'rest', color: 'var(--aera-color-surface-level2)' },
            { label: 'light', color: colorData.mint },
          ]}
        />
      </Variant>
      <Variant name="accuracy ramp">
        <Legend items={accuracyRamp.map((stop) => ({ label: stop.name, color: stop.color }))} />
      </Variant>
    </StoryFrame>
  ),
};
