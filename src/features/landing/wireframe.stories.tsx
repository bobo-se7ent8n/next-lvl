import type { Meta, StoryObj } from '@storybook/react-vite';
import { WireBox, WireRuler, WireSection, WireSlot } from './wireframe';
import { Display, Text } from '../../components/primitives/Text';

const meta: Meta<typeof WireSection> = {
  title: 'Landing/Wireframe primitives',
  component: WireSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The landing page is a wireframe and it says so — but only once per section. An earlier pass outlined the section, every region inside it, every slot and both column edges, all at the same weight; everything was annotated, so nothing was. Now only the section container is dashed, every region inside it is a flat tint with no border, and the column guides are gone. The annotation says what a section is FOR rather than how many lines of type it holds, and a section declares a weight — primary, secondary or tertiary — which decides its padding and its heading size, so the spine of the argument is visible at a glance.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Weights: Story = {
  render: () => (
    <>
      <WireSection
        number="01"
        name="Primary"
        weight="primary"
        intent="carries the argument — the most vertical space and the largest type on the page"
      >
        <WireBox plain>
          <Display size="xl" as="p">
            The claim everything rests on.
          </Display>
        </WireBox>
      </WireSection>
      <WireSection
        number="05"
        name="Secondary"
        intent="a repeating rhythm — four of these read as one continuous surface"
      >
        <WireBox>
          <Display size="lg">One of four</Display>
          <Text variant="body" tone="secondary">
            Same structure every time, and a locked heading baseline.
          </Text>
        </WireBox>
      </WireSection>
      <WireSection
        number="09"
        name="Tertiary"
        weight="tertiary"
        intent="supporting material — present, and deliberately not competing"
      >
        <WireBox plain>
          <Text variant="body">Four flat lines, no cards, no bullets.</Text>
        </WireBox>
      </WireSection>
    </>
  ),
};

export const Slot: Story = {
  render: () => (
    <WireSection
      number="00"
      name="Media slots"
      intent="a flat block naming what will replace it, and how it will behave"
    >
      <WireSlot label="Home — card fan" behaviour="still frame of the hand at rest" ratio="16 / 9" />
    </WireSection>
  ),
};

export const Ruler: Story = {
  name: 'Section ruler',
  render: () => (
    <div style={{ position: 'relative', minHeight: '50svh' }}>
      <WireRuler
        active="03"
        sections={[
          { number: '01', name: 'Hero' },
          { number: '02', name: "What you'll notice" },
          { number: '03', name: "Who it's for" },
          { number: '04', name: 'See it working' },
        ]}
      />
      <WireSection number="03" name="Who it's for" intent="self-selection by temperament">
        <WireBox>
          <Text variant="body">The ruler is fixed to the left edge while the page scrolls.</Text>
        </WireBox>
      </WireSection>
    </div>
  ),
};
