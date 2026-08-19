import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Stack } from './Layout';
import { Surface } from './Surface';
import { Text } from './Text';
import { StoryFrame, Variant } from '../../stories/kit';
import { tokens } from '../../tokens';

const Box = ({ label }: { label: string }) => (
  <Surface level="level1" radius="md" elevation="none" padding="6">
    <Text variant="bodySM" tone="secondary">
      {label}
    </Text>
  </Surface>
);

const meta = {
  title: 'Primitives/Stack & Grid',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The two layout primitives. Both take a gap from the space scale — nothing in the product writes a raw px gap.',
      },
    },
  },
  argTypes: {
    gap: { control: 'select', options: Object.keys(tokens.space) },
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'baseline', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
  },
  args: { gap: '6', direction: 'row', align: 'center', justify: 'start' },
  render: (args) => (
    <Stack {...args}>
      <Box label="one" />
      <Box label="two" />
      <Box label="three" />
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StackPlayground: Story = { name: 'Stack playground' };

export const GridColumns: Story = {
  name: 'Grid',
  render: () => (
    <StoryFrame name="Grid" note="columns as a count, or as a template string">
      <Variant name="columns = 3">
        <Grid columns={3} gap="6" style={{ width: 420 }}>
          <Box label="one" />
          <Box label="two" />
          <Box label="three" />
        </Grid>
      </Variant>
      <Variant name="template">
        <Grid columns="minmax(0, 1fr) minmax(0, 2fr)" gap="6" style={{ width: 420 }}>
          <Box label="1fr" />
          <Box label="2fr" />
        </Grid>
      </Variant>
    </StoryFrame>
  ),
};
