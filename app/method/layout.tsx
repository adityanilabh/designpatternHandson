import SideNav from '@/components/SideNav';
import PLAN from '@/content/method';

export default function MethodLayout({ children }: { children: React.ReactNode }) {
  const blind = PLAN.method.blind.groups.reduce((n: number, g: any) => n + g[2].length, 0);
  return (
    <>
      <SideNav
        placeholder="Search the method…"
        groups={[
          { g: 'The procedure', items: [
            { href: '/method/why', n: '1', label: 'Why this section exists', sub: 'the volatility problem' },
            { href: '/method/altitude', n: '2', label: 'Altitude control', sub: 'the most common loss' },
            { href: '/method/decompose', n: '3', label: 'Decomposition', sub: 'unknown → known parts' },
            { href: '/method/primitives', n: '4', label: 'The primitive catalogue', sub: `${PLAN.method.primitives.rows.length} building blocks` },
            { href: '/method/failures', n: '5', label: 'Failure generator', sub: '11 questions, any system' },
            { href: '/method/ambiguity', n: '6', label: 'The first three minutes', sub: 'when you do not understand' },
            { href: '/method/domain', n: '7', label: 'Unknown domain', sub: 'translate, do not learn' },
            { href: '/method/product', n: '8', label: 'Product thinking', sub: 'scored, rarely prepared' },
          ]},
          { g: 'Practice', items: [
            { href: '/method/worked', label: 'A worked round', sub: 'the method, beat by beat' },
            { href: '/method/blind', label: 'Blind prompt bank', sub: `${blind} prompts, no solutions` },
            { href: '/method/rubric', label: 'The rubric', sub: 'score yourself out of 20' },
          ]},
        ]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
