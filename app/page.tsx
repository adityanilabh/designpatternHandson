import PLAN from '@/content/meta';
import Dashboard from '@/components/views/Dashboard';

/* The static half of the dashboard — the split, the calendar, the rules — is
   the same for everyone and is rendered on the server. Only the progress
   numbers need the client. */
export default function DashboardPage() {
  return (
    <main id="pane">
      <Dashboard
        phases={PLAN.phases}
        split={PLAN.split}
        calendar={PLAN.calendar}
        criteria={PLAN.criteria}
        rules={PLAN.rules}
        days={PLAN.meta.days}
      />
    </main>
  );
}
