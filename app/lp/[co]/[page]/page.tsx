import { notFound } from 'next/navigation';
import LP from '@/content/lp';
import LpCompany, { LpValue } from '@/components/views/LpCompany';
import LpShared from '@/components/views/LpShared';
import StoryBank from '@/components/views/StoryBank';

const CO_PAGES = ['scoring', 'framework', 'probes', 'anti', 'worked', 'coverage', 'prep'];
const SHARED = ['bank', 'u-shapes', 'u-recut', 'mining', 'schedule', 'u-openers', 'u-screen', 'u-offer'];

/* Two segments cover all 173 pages: /lp/<company>/<page|v-id> for the eleven
   rubrics and their 77 values, and /lp/shared/<page> for the pages that are the
   same in every room. */
export function generateStaticParams() {
  const out: { co: string; page: string }[] = [];
  LP.lp.co.forEach((c: any) => {
    out.push({ co: c.id, page: 'overview' });
    CO_PAGES.forEach((p) => out.push({ co: c.id, page: p }));
    c.values.forEach((v: any) => out.push({ co: c.id, page: `v-${v.id}` }));
  });
  SHARED.forEach((p) => out.push({ co: 'shared', page: p }));
  return out;
}

export default async function LpPage({ params }: { params: Promise<{ co: string; page: string }> }) {
  const { co: coId, page } = await params;

  if (coId === 'shared') {
    if (!SHARED.includes(page)) notFound();
    return page === 'bank' ? <StoryBank /> : <LpShared id={page} />;
  }

  const co = LP.lp.co.find((c: any) => c.id === coId);
  if (!co) notFound();

  if (page.startsWith('v-')) {
    const v = co.values.find((x: any) => `v-${x.id}` === page);
    if (!v) notFound();
    return <LpValue co={co} v={v} />;
  }

  if (page !== 'overview' && !CO_PAGES.includes(page)) notFound();
  return <LpCompany co={co} page={page === 'overview' ? '' : page} />;
}
