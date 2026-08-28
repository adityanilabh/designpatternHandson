'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { bucketItems, readiness, doneCountOf } from '@/lib/score';
import { packItems, mockItems } from '@/lib/items';
import { fmtPct, pct } from '@/lib/calendar';
import ProblemRow from '@/components/ProblemRow';
import PLAN from '@/content/meta';

const BUCKET_LBL: Record<string, string> = {
  core: 'DSA block B (tier 1–2)', hard: 'DSA block C (hard tier)', tech: 'Tech modules',
  sd: 'System design', lld: 'LLD / machine coding', lp: 'Behavioural story bank',
  mock: 'Recorded mocks', pack: 'Company pack (optional)',
};
const TIER_LBL: Record<number, string> = {
  1: 'Rung 1 · loops in weeks 4–7',
  2: 'Rung 2 · loops in weeks 10–14',
  3: 'Rung 3 · loops in weeks 17–22',
};

export default function Ladder() {
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const open = useStore((s) => s.ui.open);
  const toggleOpen = useStore((s) => s.toggleOpen);

  const b = bucketItems();
  const mocks = mockItems();
  const mkDone = hydrated ? doneCountOf(state, mocks) : 0;

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>Ladder readiness</h2><span className="spacer" />
          <span className="dim">target 75%</span>
        </div>
        <p className="dim">
          This measures <b>preparation coverage</b>, not probability of an offer. It is computed
          from what you have actually completed, weighted by attempt quality — clean 1.0, ugly 0.7,
          failed 0.4, done-but-unrated 0.85 — and by what each company actually tests.
        </p>
        <p className="dim" style={{ marginTop: 8 }}>
          <b>The honest version:</b> a company pack is worth roughly +3 to +8 percentage points,
          not a 75% jump. For Amazon the LP stories outweigh every coding problem in its pack
          combined; for Uber and Flipkart it is machine coding; for JPM and Amex it is the tech
          modules; for Google it is the mocks.
        </p>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Recorded mocks</h2><span className="spacer" />
          <span className="dim">{mkDone}/{mocks.length} · Google weights these 25%</span>
        </div>
        <p className="dim" style={{ marginBottom: 12 }}>
          Performance, not knowledge. The failure mode at the top of the ladder is not &quot;could
          not solve it&quot; — it is &quot;solved it silently and the interviewer could not score
          the signal&quot;. <b>Record every one and watch it back.</b>
        </p>
        {mocks.map((m) => (
          <ProblemRow key={m.key} itemKey={m.key} name={m.name} note={m.note} />
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <h2>What is counted</h2><span className="spacer" />
          <span className="dim">every tick lands in one of these</span>
        </div>
        <div className="statrow">
          {(['core', 'hard', 'tech', 'sd', 'lld', 'lp', 'mock'] as const).map((k) => (
            <div className="stat" key={k}>
              <span className="stat-v">
                {hydrated ? doneCountOf(state, b[k]) : 0}
                <span className="of">/{b[k].length}</span>
              </span>
              <span className="stat-l">{BUCKET_LBL[k].replace(/ \(.*\)/, '')}</span>
            </div>
          ))}
        </div>
        <p className="dim" style={{ marginTop: 14 }}>
          Counts are exact. The percentages below are weighted by attempt quality, so early on they
          sit near zero even though the count has moved. <b>Trust the counts.</b>
        </p>
      </div>

      {[1, 2, 3].map((tier) => (
        <div key={tier}>
          <h2 className={`tier-hd tier${tier}`}>{TIER_LBL[tier]}</h2>
          {PLAN.companies.filter((c: any) => c.tier === tier).map((c: any) => {
            const r = readiness(state, c, b);
            const hit = pct(r.score) >= 75;
            const lo = Math.round(c.band[0] * r.score);
            const hi = Math.round(c.band[1] * r.score);
            const pk = packItems(c);
            const pkDone = hydrated ? doneCountOf(state, pk) : 0;
            const id = `co-${c.id}`;
            const isOpen = !!open[id];

            return (
              <div className="card co-card" key={c.id}>
                <div className="card-head" style={{ marginBottom: 10 }}>
                  <h2 style={{ fontSize: 17 }}>
                    {c.name} <span className="dim" style={{ fontWeight: 400 }}>{c.level}</span>
                  </h2>
                  <span className="spacer" />
                  <span className={`co-pct${hit ? ' hit' : ''}`}>
                    {hydrated ? fmtPct(r.score) : '—'}
                  </span>
                </div>
                <div className="co-bar">
                  <i style={{ width: hydrated && r.score > 0 ? `${Math.max(0.6, r.score * 100).toFixed(1)}%` : '0' }} />
                  <u style={{ left: '75%' }} />
                </div>
                <p className="dim" style={{ margin: '7px 0 14px', fontSize: 12.5 }}>
                  {hit ? <b className="ok-txt">Past the 75% target. </b> : 'Target line at 75%. '}
                  Estimated onsite pass at this readiness: <b>{lo}–{hi}%</b>{' '}
                  <span style={{ opacity: 0.7 }}>
                    (band at full readiness: {c.band[0]}–{c.band[1]}%)
                  </span>
                </p>

                <div className="co-parts">
                  {r.parts.map((p) => (
                    <div className="co-part" key={p.k}>
                      <span className="co-part-lbl">{BUCKET_LBL[p.k] || p.k}</span>
                      <span className="co-part-w">weight {pct(p.w)}%</span>
                      <span className="co-part-bar">
                        <i style={{ width: p.s > 0 ? `${Math.max(0.8, p.s * 100).toFixed(1)}%` : '0' }} />
                      </span>
                      <span className="co-part-n">
                        <b>{p.done}</b><span className="dim">/{p.n}</span>
                        <span className="co-part-pct">{fmtPct(p.s)}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="learn" style={{ marginTop: 14 }}>{c.note}</div>
                <div className="exit"><b>Biggest lever.</b> {c.lever}</div>

                {pk.length > 0 && (
                  <>
                    <button className="btn sm" style={{ marginTop: 14 }} onClick={() => toggleOpen(id)}>
                      {isOpen ? '▾' : '▸'} Optional pack — {pkDone}/{pk.length} done
                    </button>
                    {isOpen && (
                      <div style={{ marginTop: 10 }}>
                        {pk.map((x) => (
                          <ProblemRow key={x.key} itemKey={x.key} lc={x.lc} name={x.name} note={x.note} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="card">
        <div className="card-head"><h2>What this score cannot see</h2></div>
        <div className="prose">
          <ul>
            <li><b>Getting the interview at all.</b> Referrals and recruiter contact. None of this
              matters without them, and it is not study — start in week 2, not week 12.</li>
            <li><b>Interview performance.</b> Driving, narrating, recovering when stuck. The
              highest-variance factor there is.</li>
            <li><b>Headcount and timing.</b> Loops get cancelled, teams freeze, bars move quarter to
              quarter. Do not read a rejection as a verdict on your ability.</li>
            <li><b>Correlation between companies.</b> Interviewing at all ten does not give you ten
              independent draws. Same person, same weaknesses, every loop.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
