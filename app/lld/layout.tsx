import SideNav from '@/components/SideNav';
import PLAN from '@/content/lld';

export default function LldLayout({ children }: { children: React.ReactNode }) {
  const pb = PLAN.lldProblems.filter((p: any) => p.tier === 'b');
  const pc = PLAN.lldProblems.filter((p: any) => p.tier !== 'b');
  const prob = (p: any) => ({
    href: `/lld/${p.id}`, label: p.name, sub: `${p.flavour} · ${p.mins}m`,
  });
  return (
    <>
      <SideNav
        placeholder="Search LLD…"
        groups={[
          { g: 'Reference', items: [
            { href: '/lld/flavours', label: 'The three flavours', sub: 'get this wrong and you lose the round' },
            { href: '/lld/script', label: 'The 60-minute script', sub: 'minute by minute' },
            { href: '/lld/patterns', label: 'Requirement → pattern', sub: `${PLAN.lldPatterns.length} rows` },
            { href: '/lld/solid', label: 'SOLID as refactors', sub: 'violation and fix, in code' },
            { href: '/lld/concurrency', label: 'Concurrency in LLD', sub: 'the Amazon differentiator' },
            { href: '/lld/checklist', label: 'Class design checklist', sub: `${PLAN.lldChecklist.length} checks` },
            { href: '/lld/rules', label: 'Machine-coding rules', sub: 'how to finish' },
          ]},
          { g: 'Design patterns', items: PLAN.patterns.map((p: any) => ({
            href: `/lld/pat-${p.id}`, label: p.name, sub: p.cat,
          })) },
          { g: 'Block B · tier 1–2', items: pb.map(prob) },
          { g: 'Block C · top tier', items: pc.map(prob) },
        ]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
