import { useState } from 'react';
import { PageHeader } from '../components/chrome/PageHeader';
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
    <section className={styles.screen}>
      <PageHeader
        title="Insights"
        subhead="Built from your own sessions, on-device. Pull what you want — nothing here is pushed at you."
      />

      <div className={styles.split}>
        <div className={styles.aside}>
          <ChatPanel messages={messages} suggestions={ASK_SEEDS} onSend={send} />
        </div>

        <div className={styles.grid}>
          {INSIGHTS.map((insight) => (
            <InsightCard key={insight.id} insight={insight} id={insight.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
