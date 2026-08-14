import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatPanel, type ChatMessage } from './ChatPanel';
import { StoryFrame, Variant } from '../../stories/kit';
import { ASK_SEEDS } from '../../data/insights';
import { askAera } from '../../features/insights/askAera';

const OPENING: ChatMessage[] = [
  {
    id: 'a',
    from: 'aera',
    text: 'Ask for something to work on. I read your own sessions and patterns — nothing leaves the device.',
  },
];

const THREAD: ChatMessage[] = [
  ...OPENING,
  { id: 'b', from: 'you', text: 'why do I rush under pressure?' },
  {
    id: 'c',
    from: 'aera',
    text: 'Your own data has this as rushing under pressure — currently 0.42 s, release time under pressure · last 6 sessions. It reads as improving.',
    source: 'from your patterns · sessions 9 → 14',
  },
];

const meta = {
  title: 'Components/ChatPanel',
  component: ChatPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Ask aera, with four deliberate levels: the input is the dominant object, aera and you are visually distinct from each other, the suggestion chips are a clear third layer, and the "answers are drawn from your own sessions" line is the recessed footnote.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    placeholder: { control: 'text' },
    systemNote: { control: 'text' },
    onSend: { action: 'sent' },
  },
  args: { messages: OPENING, suggestions: ASK_SEEDS, onSend: () => {} },
  render: function Render(args) {
    const [messages, setMessages] = useState(args.messages);
    return (
      <div style={{ width: 420 }}>
        <ChatPanel
          {...args}
          messages={messages}
          onSend={(text) => {
            const answer = askAera(text);
            setMessages((prev) => [
              ...prev,
              { id: `${prev.length}-you`, from: 'you', text },
              { id: `${prev.length}-aera`, from: 'aera', text: answer.text, source: answer.source },
            ]);
            args.onSend(text);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof ChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Hierarchy: Story = {
  render: () => (
    <StoryFrame name="ChatPanel" note="opening state · a thread in progress">
      <Variant name="opening">
        <div style={{ width: 420 }}>
          <ChatPanel messages={OPENING} suggestions={ASK_SEEDS} onSend={() => {}} />
        </div>
      </Variant>
      <Variant name="in conversation">
        <div style={{ width: 420 }}>
          <ChatPanel messages={THREAD} suggestions={ASK_SEEDS} onSend={() => {}} />
        </div>
      </Variant>
    </StoryFrame>
  ),
};
