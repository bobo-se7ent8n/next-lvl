import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/chrome/PageHeader';
import { SessionCard } from '../components/composed/SessionCard';
import { ActivityCalendar } from '../features/sessions/ActivityCalendar';
import { SESSIONS } from '../data';
import { columnize, columnCountFor } from '../lib/columns';
import { useEffect, useMemo, useState } from 'react';
import { sessionPath } from '../app/routes';
import styles from './Sessions.module.css';

/** every recorded session, read against the month it happened in.
 *  The calendar holds the left column the way Focus holds it on Home;
 *  the log on the right is what scrolls. */
export function Sessions() {
  const navigate = useNavigate();

  /* every session's place in the log, built once — the entrance
     stagger reads it, and `columnize` has already thrown the order
     away by the time the rows are rendered */
  const order = useMemo(() => new Map(SESSIONS.map((s, i) => [s.id, i])), []);

  /* the bento is real flex columns, not CSS multi-column: a
     multi-column box has no flex gap, so the space between stacked
     cards could only be a margin on the cards. See lib/columns.ts. */
  const [columns, setColumns] = useState(() =>
    columnCountFor(typeof window === 'undefined' ? 1440 : window.innerWidth),
  );
  useEffect(() => {
    const measure = () => setColumns(columnCountFor(window.innerWidth));
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section className={styles.screen}>
      <PageHeader
        title="Sessions"
        subhead="Every game you recorded, kept on the device. The month is the frame; the log is what happened."
      />

      <div className={styles.split}>
        <div className={styles.aside}>
          <ActivityCalendar />
        </div>

        <div className={styles.log}>
          {columnize(SESSIONS, columns).map((column, i) => (
            <div key={i} className={styles.column}>
              {column.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  /* THE STAGGER FOLLOWS THE SET, NOT THE COLUMN.
                     `columnize` deals the log out into vertical
                     stacks, so a per-column index would restart the
                     count at the top of every column and the rows
                     would arrive in three simultaneous races. The
                     session's place in the log is its place in the
                     order you read it. */
                  index={order.get(session.id) ?? 0}
                  onClick={() => navigate(sessionPath(session.id))}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
