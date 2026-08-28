'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LP from '@/content/lp';

/* The sidebar is company-scoped: pick a company at the top and everything
   below reshapes to that rubric. Its 77 values are grouped by how often they
   actually come up, which is the ordering that matters when time is short. */
export default function LpNav() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);   /* ['lp', <co>, <page>] */
  const coId = parts[1] && parts[1] !== 'shared' ? parts[1] : LP.lp.co[0].id;
  const co = LP.lp.co.find((c: any) => c.id === coId) || LP.lp.co[0];

  const link = (href: string, label: string, sub?: string, n?: string, cls = '') => {
    const on = pathname === href;
    return (
      <Link key={href} href={href} className={`nav-i ${cls}${on ? ' on' : ''}`}>
        {n && <span className="nav-n">{n}</span>}
        <span className="nav-l">{label}{sub && <span className="nav-s">{sub}</span>}</span>
      </Link>
    );
  };

  const byFreq = (f: string) => co.values.filter((v: any) => v.freq === f);
  const valueLinks = (vals: any[]) =>
    vals.map((v: any) =>
      link(`/lp/${co.id}/v-${v.id}`, v.name, `${v.freq} frequency`, String(v.n), 'nav-sub'));

  return (
    <aside className="sidenav">
      <div className="nav-group">
        <div className="nav-g">Companies</div>
        {LP.lp.co.map((c: any) => (
          <Link
            key={c.id}
            href={`/lp/${c.id}/overview`}
            className={`nav-i nav-co${c.id === co.id ? ' nav-co-on' : ''}`}
          >
            <span className="nav-l">{c.name}<span className="nav-s">{c.navSub}</span></span>
          </Link>
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-g">{co.name} · how it is scored</div>
        {link(`/lp/${co.id}/scoring`, 'How it is scored', 'and where it happens', undefined, 'nav-sub')}
        {link(`/lp/${co.id}/framework`, 'The story format', 'their proportions', undefined, 'nav-sub')}
        {link(`/lp/${co.id}/probes`, 'The follow-up probes', 'where stories break', undefined, 'nav-sub')}
        {link(`/lp/${co.id}/anti`, 'Anti-patterns', `${co.anti.length} ways to fail`, undefined, 'nav-sub')}
        {link(`/lp/${co.id}/worked`, 'A worked story', 'annotated, with probes', undefined, 'nav-sub')}
      </div>

      {(['high', 'med', 'low'] as const).map((f) =>
        byFreq(f).length ? (
          <div className="nav-group" key={f}>
            <div className="nav-g">
              {f === 'high' ? `${co.name} · ${co.label} · high` : `${co.name} · ${f === 'med' ? 'medium' : 'low'}`}
            </div>
            {valueLinks(byFreq(f))}
          </div>
        ) : null
      )}

      <div className="nav-group">
        <div className="nav-g">{co.name} · your plan</div>
        {link(`/lp/${co.id}/coverage`, 'Coverage matrix', 'gaps are visible at debrief', undefined, 'nav-sub')}
        {link(`/lp/${co.id}/prep`, 'The schedule', 'what to do, and when', undefined, 'nav-sub')}
      </div>

      <div className="nav-group">
        <div className="nav-g">Your stories · shared by every company</div>
        {link('/lp/shared/bank', 'The story bank', `${LP.lp.slots.length} slots`)}
        {link('/lp/shared/u-shapes', 'The ten shapes', 'one story, four rubrics')}
        {link('/lp/shared/u-recut', 'The recut matrix', 'same story, eleven rooms')}
        {link('/lp/shared/mining', 'Where to mine stories', 'do this while employed')}
        {link('/lp/shared/schedule', 'Writing cadence', 'two per Sunday')}
      </div>

      <div className="nav-group">
        <div className="nav-g">Every loop asks these</div>
        {link('/lp/shared/u-openers', 'The four openers', 'nobody prepares them')}
        {link('/lp/shared/u-screen', 'The recruiter screen', 'and the comp question')}
        {link('/lp/shared/u-offer', 'Offers and negotiation', 'the highest hourly value')}
      </div>
    </aside>
  );
}
