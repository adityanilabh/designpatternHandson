import { notFound } from 'next/navigation';
import PLAN from '@/content/sd';
import Pager from '@/components/Pager';
import Notes from '@/components/Notes';
import ItemActions from '@/components/ItemActions';
import SdSolution from '@/components/views/SdSolution';
import { BulletList, Table, Qa, ReadingList } from '@/components/content';

export function generateStaticParams() {
  return PLAN.sd.map((s: any) => ({ session: String(s.n) }));
}

export default async function SdSessionPage({ params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  const i = PLAN.sd.findIndex((x: any) => String(x.n) === session);
  if (i < 0) notFound();

  const s = PLAN.sd[i];
  const prev = i > 0 ? PLAN.sd[i - 1] : null;
  const next = i < PLAN.sd.length - 1 ? PLAN.sd[i + 1] : null;
  const key = `sd-${s.n}`;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">
          System design · session {s.n} of {PLAN.sd.length} · week {s.wk} ·{' '}
          <span className={`chip tier${s.tier === 'b' ? '1' : '3'}`}>
            {s.tier === 'b' ? 'tier 1–2' : 'top tier'}
          </span>
        </div>
        <h1>{s.t}</h1>
        {s.anchor && <p className="pane-sub">Case-study anchor: {s.anchor}</p>}
        <ItemActions itemKey={key} />
      </div>

      {s.who && <div className="sd-who"><i>Who asks it</i>{s.who}</div>}

      <h2 className="pane-h2">Asked as</h2>
      <BulletList items={s.asked} cls="asked" />

      {s.clarify?.length > 0 && (
        <>
          <h2 className="pane-h2">Clarify in the first three minutes</h2>
          <BulletList items={s.clarify} />
        </>
      )}

      {s.scale && (
        <>
          <h2 className="pane-h2">Back of the envelope</h2>
          <div className="learn">{s.scale}</div>
        </>
      )}

      {s.terms?.length > 0 && (
        <>
          <h2 className="pane-h2">
            Terms you must own <span className="h2-count">{s.terms.length}</span>
          </h2>
          <Table
            heads={['Term', 'In one sentence']}
            rows={s.terms.map((r: any) => [
              <span className="fire">{r[0]}</span>,
              <span className="trig">{r[1]}</span>,
            ])}
          />
        </>
      )}

      {s.decisions?.length > 0 && (
        <>
          <h2 className="pane-h2">Decision points</h2>
          <Table
            heads={['Decision', 'Options', 'Verdict, and why']}
            rows={s.decisions.map((r: any) => [
              <span className="fire">{r[0]}</span>,
              <span className="canon">{r[1] || '—'}</span>,
              <span className="trig">{r[2]}</span>,
            ])}
          />
        </>
      )}

      {s.cross?.length > 0 && (
        <>
          <h2 className="pane-h2">
            Cross-questions <span className="h2-count">{s.cross.length}</span>
          </h2>
          <p className="pane-p">
            Cover the answer and say it out loud. This is the block that decides the round.
          </p>
          {s.cross.map((r: any, j: number) => <Qa key={j} q={r[0]} a={r[1]} />)}
        </>
      )}

      {s.fail?.length > 0 && (
        <>
          <h2 className="pane-h2">What sinks candidates here</h2>
          <BulletList items={s.fail} cls="fail" />
        </>
      )}

      <SdSolution n={s.n} solution={(PLAN.sdSolution || {})[s.n]} />

      <ReadingList rows={(PLAN.sdRead || {})[s.n]} heading="Read more" />

      <Notes
        noteKey={key}
        label="Your one-page design + cross-question answers"
        placeholder="A weekend that produced nothing you can re-read did not happen."
      />

      <Pager
        prev={prev ? { href: `/sd/${prev.n}`, label: prev.t } : null}
        next={next ? { href: `/sd/${next.n}`, label: next.t } : null}
      />
    </>
  );
}
