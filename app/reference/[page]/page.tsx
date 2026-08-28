import { notFound } from 'next/navigation';
import META from '@/content/meta';
import DSA from '@/content/dsa';
import SD from '@/content/sd';
import LLD from '@/content/lld';
import TECH from '@/content/tech';
import Pager from '@/components/Pager';
import Templates from '@/components/views/Templates';
import Triggers from '@/components/views/Triggers';
import HardPool from '@/components/views/HardPool';
import { ReadingList } from '@/components/content';

const PAGES = [
  { id: 'templates', label: 'Template library' },
  { id: 'triggers', label: 'All triggers' },
  { id: 'pool', label: 'Blind hard pool' },
  { id: 'reading', label: 'Reading list' },
];

export function generateStaticParams() {
  return PAGES.map((p) => ({ page: p.id }));
}

export default async function ReferencePage({ params }: { params: Promise<{ page: string }> }) {
  const { page: id } = await params;
  const i = PAGES.findIndex((p) => p.id === id);
  if (i < 0) notFound();

  const pager = (
    <Pager
      prev={i > 0 ? { href: `/reference/${PAGES[i - 1].id}`, label: PAGES[i - 1].label } : null}
      next={i < PAGES.length - 1
        ? { href: `/reference/${PAGES[i + 1].id}`, label: PAGES[i + 1].label } : null}
    />
  );

  if (id === 'templates') {
    return <><Templates templates={META.templates} />{pager}</>;
  }

  if (id === 'pool') {
    return <><HardPool pool={META.hardPool} />{pager}</>;
  }

  if (id === 'reading') {
    return (
      <>
        <div className="pane-head">
          <div className="eyebrow">Reference</div>
          <h1>Reading list</h1>
          <p className="pane-sub">
            The general references. Per-session and per-module reading sits on each system design
            session and each tech module.
          </p>
        </div>
        <ReadingList rows={META.readGeneral} heading="Start here" />
        <p className="pane-p" style={{ marginTop: 26 }}>
          Rows marked <b>search</b> are things worth reading whose exact URL is not stable enough to
          hard-code, so they open a search instead of a dead link.
        </p>
        {pager}
      </>
    );
  }

  /* every trigger table in the sheet, in one index */
  const groups = [
    ...DSA.sections.map((s: any) => ({
      g: `DSA §${s.n} ${s.name}`,
      rows: s.p.map((r: any) => [r[1], `${r[0]} — ${r[2]}`, r[3] || '']),
    })),
    { g: 'System design', rows: SD.sdTriggers },
    { g: 'LLD', rows: LLD.lldPatterns },
    { g: 'Tech', rows: TECH.techTriggers.map((r: any) => [r[0], r[1], '']) },
  ];

  return <><Triggers groups={groups} />{pager}</>;
}
