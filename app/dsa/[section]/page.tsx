import { notFound } from 'next/navigation';
import PLAN from '@/content/dsa';
import DsaSection from '@/components/views/DsaSection';
import Proof from '@/components/views/Proof';
import Pager from '@/components/Pager';

/* Every section is known at build time, so all 17 pages prerender as static
   HTML and each ships only its own slice of the content. */
export function generateStaticParams() {
  return [...PLAN.sections.map((s: any) => ({ section: s.id })), { section: 'proof' }];
}

export default async function DsaSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (section === 'proof') {
    const last = PLAN.sections[PLAN.sections.length - 1];
    return (
      <>
        <Proof proof={PLAN.proof} />
        <Pager prev={{ href: `/dsa/${last.id}`, label: last.name }} next={null} />
      </>
    );
  }

  const i = PLAN.sections.findIndex((s: any) => s.id === section);
  if (i < 0) notFound();
  const s = PLAN.sections[i];
  const prev = i > 0 ? PLAN.sections[i - 1] : null;
  const next = i < PLAN.sections.length - 1 ? PLAN.sections[i + 1] : null;

  return (
    <>
      <DsaSection section={s} total={PLAN.sections.length} derive={PLAN.derive?.[s.id]} />
      <Pager
        prev={prev ? { href: `/dsa/${prev.id}`, label: prev.name } : null}
        next={next
          ? { href: `/dsa/${next.id}`, label: next.name }
          : { href: '/dsa/proof', label: 'Why it is correct' }}
      />
    </>
  );
}
