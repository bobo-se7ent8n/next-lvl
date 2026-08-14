import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplitLayout } from './SplitLayout';
import { Card } from '../primitives/Card';
import { Display, Text } from '../primitives/Text';

const meta = {
  title: 'Components/SplitLayout',
  component: SplitLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The two-column shape shared by Sessions and Insights: a sticky left column that stays put while the right column scrolls with the page. Below 1080px it collapses to one column and the aside stops sticking.',
      },
    },
  },
  argTypes: { columns: { control: 'text' } },
  args: {
    columns: 'minmax(320px, 0.9fr) minmax(0, 1.5fr)',
    aside: (
      <Card padding="9">
        <Display size="md" as="h2">
          Sticky
        </Display>
        <Text variant="bodySM" tone="tertiary">
          This column holds its place while the other one moves.
        </Text>
      </Card>
    ),
    children: Array.from({ length: 4 }, (_, i) => (
      <Card key={i} padding="9">
        <Text variant="bodySM">Scrolling item {i + 1}</Text>
      </Card>
    )),
  },
} satisfies Meta<typeof SplitLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
