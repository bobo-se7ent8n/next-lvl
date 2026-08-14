import { ScreenHeader } from '../components/chrome/ScreenHeader';
import { SplitLayout } from '../components/chrome/SplitLayout';
import { SessionCard } from '../components/composed/SessionCard';
import { ActivityPanel } from '../features/sessions/ActivityPanel';
import { SESSIONS } from '../data';

/** every recorded session, read against the activity calendar */
export function Sessions() {
  return (
    <section>
      <ScreenHeader
        title="Sessions"
        description="Every game you recorded, kept on the device. The calendar on the left is the frame; the log on the right is what happened."
      />
      <SplitLayout aside={<ActivityPanel />} columns="minmax(340px, 0.85fr) minmax(0, 1.6fr)">
        {SESSIONS.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </SplitLayout>
    </section>
  );
}
