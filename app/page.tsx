import PLAN from '@/content/meta';
import Dashboard from '@/components/views/Dashboard';
import LadderRail from '@/components/views/LadderRail';
import HowToUse from '@/components/views/HowToUse';
import Collapsible from '@/components/Collapsible';

/* The static half of the dashboard — the split, the calendar, the rules — is
   the same for everyone and is rendered on the server. Only the progress
   numbers need the client.

   Two columns: the dashboard reads down the middle, with the ladder alongside
   it. The ladder is the one thing worth having in view while reading anything
   else — which rung you are on — and the page had a wide empty gutter doing
   nothing on any normal monitor. */
export default function DashboardPage() {
  return (
    <main id="pane" className="dash-wrap">
      <div className="dash-main">
        <Collapsible
          id="howto"
          title="How to use this sheet"
          sub="the loop, the statuses, and what every tab is for"
        >
          <HowToUse />
        </Collapsible>

        <Dashboard
          phases={PLAN.phases}
          split={PLAN.split}
          calendar={PLAN.calendar}
          criteria={PLAN.criteria}
          rules={PLAN.rules}
          days={PLAN.meta.days}
        />
      </div>

      <LadderRail />
    </main>
  );
}
