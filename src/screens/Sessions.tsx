import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/chrome/PageHeader';
import { SessionCard } from '../components/composed/SessionCard';
import { ActivityCalendar } from '../features/sessions/ActivityCalendar';
import { SESSIONS } from '../data';
import { sessionPath } from '../app/routes';
import styles from './Sessions.module.css';

/** every recorded session, read against the month it happened in.
 *  The calendar holds the left column the way Focus holds it on Home;
 *  the log on the right is what scrolls. */
export function Sessions() {
  const navigate = useNavigate();

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
          {SESSIONS.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => navigate(sessionPath(session.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
