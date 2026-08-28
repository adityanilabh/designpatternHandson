import SideNav from '@/components/SideNav';
import PLAN from '@/content/tech';

export default function TechLayout({ children }: { children: React.ReactNode }) {
  const p1 = PLAN.tech.filter((m: any) => m.phase === 1);
  const p2 = PLAN.tech.filter((m: any) => m.phase !== 1);
  const item = (m: any) => ({
    href: `/tech/${m.id}`, n: String(m.n), label: m.name, sub: `${m.hrs}h · ${m.qa.length} Q&A`,
  });
  return (
    <>
      <SideNav
        placeholder="Search modules…"
        groups={[
          { g: 'Phase 1', items: p1.map(item) },
          { g: 'Phase 2', items: p2.map(item) },
        ]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
