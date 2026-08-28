import { notFound } from 'next/navigation';
import PLAN from '@/content/meta';
import Pager from '@/components/Pager';

export function generateStaticParams() {
  return PLAN.strategy.map((_: any, i: number) => ({ page: String(i) }));
}

export default async function StrategyPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const i = parseInt(page, 10);
  if (!Number.isInteger(i) || !PLAN.strategy[i]) notFound();
  const s = PLAN.strategy[i];

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">Strategy · {i + 1} of {PLAN.strategy.length}</div>
        <h1>{s.t}</h1>
      </div>
      {/* Authored prose from content/meta.ts — trusted, not user input. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: s.h }} />
      <Pager
        prev={i > 0 ? { href: `/strategy/${i - 1}`, label: PLAN.strategy[i - 1].t } : null}
        next={i < PLAN.strategy.length - 1
          ? { href: `/strategy/${i + 1}`, label: PLAN.strategy[i + 1].t } : null}
      />
    </>
  );
}
