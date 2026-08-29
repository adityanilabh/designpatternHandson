import SideNav from '@/components/SideNav';
import PLAN from '@/content/sd';

export default function SdLayout({ children }: { children: React.ReactNode }) {
  const b = PLAN.sd.filter((s: any) => s.tier === 'b');
  const c = PLAN.sd.filter((s: any) => s.tier !== 'b');
  const item = (s: any) => ({
    href: `/sd/${s.n}`, n: String(s.n), label: s.t, sub: `week ${s.wk}`,
  });
  return (
    <>
      <SideNav
        placeholder="Search sessions…"
        groups={[
          { g: 'Tier 1–2', items: b.map(item) },
          { g: 'Top tier', items: c.map(item) },
          /* Reference material rather than a session: no number, no week, and
             it carries no progress key. */
          { g: 'Reference', items: [{
            href: '/sd/vocabulary',
            label: 'Design vocabulary',
            sub: '182 terms, plain words',
          }] },
        ]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
