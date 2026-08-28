import SideNav from '@/components/SideNav';
import PLAN from '@/content/dsa';

/* Sidebar is shared across every DSA route, so it lives in the layout and does
   not re-render when you move between sections. */
export default function DsaLayout({ children }: { children: React.ReactNode }) {
  const p1 = PLAN.sections.filter((s: any) => s.phase === 1);
  const p2 = PLAN.sections.filter((s: any) => s.phase === 2);
  const item = (s: any) => ({ href: `/dsa/${s.id}`, n: `§${s.n}`, label: s.name, sub: s.sub });

  return (
    <>
      <SideNav
        placeholder="Search sections…"
        groups={[
          { g: 'Phase 1 · foundation', items: p1.map(item) },
          { g: 'Phase 2 · product tier', items: p2.map(item) },
          { g: 'Argument shapes', items: [{ href: '/dsa/proof', n: '✓', label: 'Why it is correct', sub: '12 shapes' }] },
        ]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
