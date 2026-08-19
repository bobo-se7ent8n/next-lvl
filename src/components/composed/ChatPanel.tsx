import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { Display, Label, Text } from '../primitives/Text';
import styles from './ChatPanel.module.css';

export interface ChatMessage {
  id: string;
  from: 'aera' | 'you';
  text: string;
  /** where the answer came from — only ever the user's own data */
  source?: string;
}

export interface ChatPanelProps {
  title?: string;
  messages: ChatMessage[];
  /** the recessed line explaining where answers come from */
  systemNote?: string;
  suggestions?: string[];
  onSend: (text: string) => void;
  placeholder?: string;
  className?: string;
}

/** Ask aera. Four visual levels: input, messages, suggestions, system note. */
export function ChatPanel({
  title = 'Ask aera',
  messages,
  systemNote = 'answers are drawn from your own sessions and patterns · nothing leaves the device',
  suggestions = [],
  onSend,
  placeholder = 'Tell me what you want to work on…',
  className,
}: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setDraft('');
  };

  return (
    <Card radius="card" padding="9" elevation="medium" className={cx(styles.panel, className)}>
      <div className={styles.head}>
        <Display size="md" as="h2">
          {title}
        </Display>
        <Chip>On-device</Chip>
      </div>

      {/* 2 — the thread */}
      <div className={styles.thread} ref={threadRef}>
        {messages.map((m) =>
          m.from === 'aera' ? (
            <div key={m.id} className={cx(styles.message, styles.fromAera)}>
              <span className={styles.attribution}>
                <Label>aera</Label>
              </span>
              <Text variant="bodySM" tone="primary" className={styles.bubbleAera}>
                {m.text}
              </Text>
              {m.source ? (
                <Label className={styles.source}>{m.source}</Label>
              ) : null}
            </div>
          ) : (
            <div key={m.id} className={cx(styles.message, styles.fromYou)}>
              <Text variant="bodySM" tone="onInverse" className={styles.bubbleYou}>
                {m.text}
              </Text>
            </div>
          ),
        )}
      </div>

      {/* 3 — suggestions */}
      {suggestions.length ? (
        <div className={styles.seeds}>
          {suggestions.map((s) => (
            <button key={s} type="button" className={styles.seed} onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {/* 1 — the input, the dominant element */}
      <div className={styles.composer}>
        <input
          className={styles.input}
          value={draft}
          placeholder={placeholder}
          aria-label={title}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send(draft);
          }}
        />
        <button
          type="button"
          className={styles.send}
          disabled={!draft.trim()}
          onClick={() => send(draft)}
        >
          Send
        </button>
      </div>

      {/* 4 — the recessed system line */}
      <Label className={styles.systemLine}>{systemNote}</Label>
    </Card>
  );
}
