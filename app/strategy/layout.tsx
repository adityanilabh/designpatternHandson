import SideNav from '@/components/SideNav';
import PLAN from '@/content/meta';

export default function StrategyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideNav
        placeholder="Search strategy…"
        groups={[{
          g: 'Why the plan is shaped this way',
          items: PLAN.strategy.map((s: any, i: number) => ({
            href: `/strategy/${i}`, n: String(i + 1), label: s.t,
          })),
        }]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
