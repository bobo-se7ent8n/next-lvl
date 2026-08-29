import { useEffect, useState } from 'react';
import { PageHeader } from '../components/chrome/PageHeader';
import { ChatPanel, type ChatMessage } from '../components/composed/ChatPanel';
import { InsightCard } from '../components/composed/InsightCard';
import { askAera } from '../features/insights/askAera';
import { ASK_SEEDS, INSIGHTS } from '../data';
import { columnize, columnCountFor } from '../lib/columns';
import styles from './Insights.module.css';

const OPENING: ChatMessage = {
  id: 'open',
  from: 'aera',
  text: 'Ask for something to work on. I read your own sessions and patterns — nothing leaves the device.',
};

/** the library, unfiltered, beside the assistant. Everything here is
 *  pulled: nothing is pushed, ranked or marked urgent. */
export function Insights() {
  /* three columns at 1024 and above, two below — see lib/columns.ts */
  const [columns, setColumns] = useState(() =>
    columnCountFor(typeof window === 'undefined' ? 1440 : window.innerWidth),
  );
  useEffect(() => {
    const measure = () => setColumns(columnCountFor(window.innerWidth));
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

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

        {/* THREE PACKED COLUMNS, EACH CARD ITS OWN HEIGHT.

            Round-robin into independent flex stacks: a short card is
            followed immediately by the next card in its column
            rather than waiting for the tallest card in a grid row.
            That is what lets a card hug its content — see the note
            in the stylesheet. */}
        <div className={styles.grid}>
          {columnize(INSIGHTS, columns).map((column, i) => (
            <div key={i} className={styles.column}>
              {column.map((insight) => (
                <InsightCard key={insight.id} insight={insight} id={insight.id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
