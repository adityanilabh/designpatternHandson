'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { bucketItems, readiness } from '@/lib/score';
import { fmtPct, pct } from '@/lib/calendar';
import PLAN from '@/content/meta';

const TIER_LBL: Record<number, string> = {
  1: 'Rung 1 · loops in weeks 4–7',
  2: 'Rung 2 · loops in weeks 10–14',
  3: 'Rung 3 · loops in weeks 17–22',
};

/* The ladder, compressed to a rail beside the dashboard.

   The full page carries the weights, the per-bucket breakdown, the optional
   packs and the caveats. None of that belongs in a sidebar. What does belong is
   the one thing you want in view while reading anything else: which rung you
   are on, and how far the next company is from the 75% line. Everything else is
   one click away. */
export default function LadderRail() {
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const b = bucketItems();

  return (
    <aside className="rail" aria-label="Ladder readiness">
      <div className="rail-head">
        <h2>Ladder readiness</h2>
        <span className="dim">target 75%</span>
      </div>

      {[1, 2, 3].map((tier) => (
        <div className="rail-sect" key={tier}>
          <div className={`rail-tier tier${tier}`}>{TIER_LBL[tier]}</div>
          {PLAN.companies
            .filter((c: { tier: number }) => c.tier === tier)
            .map((c: { id: string; name: string; level: string }) => {
              const r = readiness(state, c, b);
              const hit = pct(r.score) >= 75;
              return (
                <div className="rail-co" key={c.id}>
                  <div className="rail-co-top">
                    <span className="rail-co-name">{c.name}</span>
                    <span className={`rail-co-pct${hit ? ' hit' : ''}`}>
                      {hydrated ? fmtPct(r.score) : '—'}
                    </span>
                  </div>
                  <div className="rail-co-lvl">{c.level}</div>
                  <div className="co-bar rail-bar">
                    <i style={{ width: hydrated && r.score > 0 ? `${Math.max(0.6, r.score * 100).toFixed(1)}%` : '0' }} />
                    <u style={{ left: '75%' }} />
                  </div>
                </div>
              );
            })}
        </div>
      ))}

      <p className="rail-note">
        Coverage of the preparation, not a probability of an offer. Early on these sit near zero
        even though your counts have moved — the score weights by attempt quality, so an unrated
        tick is worth less than a clean one.
      </p>
      <Link className="btn sm" href="/ladder">Open the full ladder →</Link>
    </aside>
  );
}
