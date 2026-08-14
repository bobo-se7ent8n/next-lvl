import { useState } from 'react';
import { ScreenHeader } from '../components/chrome/ScreenHeader';
import { SplitLayout } from '../components/chrome/SplitLayout';
import { ChatPanel, type ChatMessage } from '../components/composed/ChatPanel';
import { InsightCard } from '../components/composed/InsightCard';
import { askAera } from '../features/insights/askAera';
import { ASK_SEEDS, INSIGHTS } from '../data';
import styles from './Insights.module.css';

const OPENING: ChatMessage = {
  id: 'open',
  from: 'aera',
  text: 'Ask for something to work on. I read your own sessions and patterns — nothing leaves the device.',
};

/** the library, unfiltered, beside the assistant. Everything here is
 *  pulled: nothing is pushed, ranked or marked urgent. */
export function Insights() {
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING]);

  const send = (text: string) => {
    const answer = askAera(text);
    setMessages((prev) => [
      ...prev,
      { id: `${prev.length}-you`, from: 'you', text },
      { id: `${prev.length}-aera`, from: 'aera', text: answer.text, source: answer.source },
    ]);
  };

  return (
    <section>
      <ScreenHeader
        title="Insights"
        description="Built from your own sessions, on-device. Pull what you want — nothing here is pushed at you."
      />
      <SplitLayout
        columns="minmax(340px, 0.9fr) minmax(0, 1.5fr)"
        aside={<ChatPanel messages={messages} suggestions={ASK_SEEDS} onSend={send} />}
      >
        <div className={styles.grid}>
          {INSIGHTS.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </SplitLayout>
    </section>
  );
}
