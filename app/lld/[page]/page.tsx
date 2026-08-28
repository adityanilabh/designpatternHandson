import { notFound } from 'next/navigation';
import PLAN from '@/content/lld';
import TECH from '@/content/tech';
import Pager from '@/components/Pager';
import Notes from '@/components/Notes';
import ItemActions from '@/components/ItemActions';
import LldSolution from '@/components/views/LldSolution';
import { BulletList, AsciiBlock, CodeBlock, Table, Qa } from '@/components/content';

/* One flat route covers all 33 LLD pages — 7 reference pages, 13 design
   patterns and 13 problems — because they share a sidebar and a pager. */
const REF = ['flavours', 'script', 'patterns', 'solid', 'concurrency', 'checklist', 'rules'];

function order(): { slug: string; label: string }[] {
  return [
    ...REF.map((r) => ({ slug: r, label: r })),
    ...PLAN.patterns.map((p: any) => ({ slug: `pat-${p.id}`, label: p.name })),
    ...PLAN.lldProblems.map((p: any) => ({ slug: p.id, label: p.name })),
  ];
}

export function generateStaticParams() {
  return order().map((o) => ({ page: o.slug }));
}

function Head({ eyebrow, title, sub }: { eyebrow: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="pane-head">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {sub && <p className="pane-sub">{sub}</p>}
    </div>
  );
}

export default async function LldPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: id } = await params;
  const all = order();
  const i = all.findIndex((o) => o.slug === id);
  if (i < 0) notFound();

  const prevItem = i > 0 ? all[i - 1] : null;
  const nextItem = i < all.length - 1 ? all[i + 1] : null;
  const pager = (
    <Pager
      prev={prevItem ? { href: `/lld/${prevItem.slug}`, label: prevItem.label } : null}
      next={nextItem ? { href: `/lld/${nextItem.slug}`, label: nextItem.label } : null}
    />
  );

  /* ---- reference pages ---- */
  if (id === 'flavours') {
    return (
      <>
        <Head eyebrow="LLD" title="The three flavours"
          sub="Three different rounds wear this name. Confusing them is how people lose it before writing a line." />
        <Table heads={['Flavour', 'Who', 'Format', 'What scores']}
          rows={PLAN.lldFlavours.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
            <span className="trig">{r[2]}</span>, r[3],
          ])} />
        <h2 className="pane-h2">The framework</h2>
        <div className="exit">{PLAN.lldFramework}</div>
        {pager}
      </>
    );
  }

  if (id === 'script') {
    return (
      <>
        <Head eyebrow="LLD" title="The 60-minute script"
          sub="Run this every time. The last row is the highest-scoring thirty seconds of the round." />
        <Table heads={['Clock', 'Phase', 'What you actually do']}
          rows={PLAN.lldScript.map((r: any) => [
            <span className="canon">{r[0]}</span>, <span className="fire">{r[1]}</span>,
            <span className="trig">{r[2]}</span>,
          ])} />
        {pager}
      </>
    );
  }

  if (id === 'patterns') {
    return (
      <>
        <Head eyebrow="LLD" title="Requirement → pattern"
          sub="About eight of the 23 GoF patterns actually appear. Learn these and stop." />
        <Table heads={['You hear', 'Reach for', 'Where it shows up']}
          rows={PLAN.lldPatterns.map((r: any) => [
            <span className="trig">{r[0]}</span>, <span className="fire">{r[1]}</span>,
            <span className="canon">{r[2] || ''}</span>,
          ])} />
        {pager}
      </>
    );
  }

  if (id === 'solid') {
    return (
      <>
        <Head eyebrow="LLD" title="SOLID as refactors"
          sub="Be able to write the violation and the fix. Definitions score nothing." />
        {PLAN.lldSolid.map((r: any, j: number) => (
          <div key={j}>
            <h2 className="pane-h2">{r[0]} · {r[1]}</h2>
            <p className="pane-p">{r[2]}</p>
            <CodeBlock lines={r[3]} />
          </div>
        ))}
        {pager}
      </>
    );
  }

  if (id === 'concurrency') {
    const conc = (TECH.techProblems || {}).conc;
    const n = conc ? conc.groups.reduce((a: number, g: any) => a + g[2].length, 0) : 0;
    return (
      <>
        <Head eyebrow="LLD" title="Concurrency in LLD"
          sub="The single biggest separator at Amazon. Raise the race before they ask about it." />
        <Table heads={['The race', 'How you close it']}
          rows={PLAN.lldConcurrency.map((r: any) => [<b>{r[0]}</b>, r[1]])} />
        <div className="exit">
          <b>Practice.</b> Reading about races does not survive &quot;write me a bounded blocking
          queue&quot;. The <b>Tech → Concurrency</b> module carries {n} practice problems — the
          LeetCode concurrency section, the classic whiteboard implementations, and the design
          problems where thread safety is the actual question.
        </div>
        {pager}
      </>
    );
  }

  if (id === 'checklist') {
    return (
      <>
        <Head eyebrow="LLD" title="Class design checklist"
          sub="Run down this list before you say you are done." />
        <Table heads={['Check', 'Why']}
          rows={PLAN.lldChecklist.map((r: any) => [<b>{r[0]}</b>, r[1]])} />
        {pager}
      </>
    );
  }

  if (id === 'rules') {
    return (
      <>
        <Head eyebrow="LLD" title="Machine-coding rules"
          sub="An unfinished elegant design scores below a finished plain one." />
        <ol className="rules">{PLAN.lldRules.map((r: string, j: number) => <li key={j}>{r}</li>)}</ol>
        {pager}
      </>
    );
  }

  /* ---- a design pattern ---- */
  if (id.startsWith('pat-')) {
    const p = PLAN.patterns.find((x: any) => `pat-${x.id}` === id);
    if (!p) notFound();
    return (
      <>
        <Head eyebrow={`Design pattern · ${p.cat}`} title={p.name} sub={p.intent} />
        <h2 className="pane-h2">When it fires</h2>
        <BulletList items={p.fires} cls="asked" />
        <h2 className="pane-h2">Class diagram</h2>
        <AsciiBlock lines={p.uml} />
        <h2 className="pane-h2">Code</h2>
        <CodeBlock lines={p.code} />
        <h2 className="pane-h2">Where it shows up here</h2>
        <div className="learn">{p.used}</div>
        <h2 className="pane-h2">Most often confused with</h2>
        <div className="exit">{p.vs}</div>
        <h2 className="pane-h2">How it goes wrong</h2>
        <BulletList items={p.gotchas} cls="fail" />
        {pager}
      </>
    );
  }

  /* ---- an LLD problem ---- */
  const pr = PLAN.lldProblems.find((x: any) => x.id === id);
  if (!pr) notFound();
  const key = `ld-${pr.id}`;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">
          LLD · {pr.flavour} · {pr.mins} min ·{' '}
          <span className={`chip tier${pr.tier === 'b' ? '1' : '3'}`}>
            {pr.tier === 'b' ? 'tier 1–2' : 'top tier'}
          </span>
        </div>
        <h1>{pr.name}</h1>
        <ItemActions itemKey={key} />
      </div>

      {pr.who && <div className="sd-who"><i>Who asks it</i>{pr.who}</div>}

      <h2 className="pane-h2">Asked as</h2>
      <BulletList items={pr.asked} cls="asked" />
      <h2 className="pane-h2">Clarify before you draw anything</h2>
      <BulletList items={pr.clarify} />

      {pr.entities?.length > 0 && (
        <>
          <h2 className="pane-h2">Entities <span className="h2-count">{pr.entities.length}</span></h2>
          <p className="pane-p">
            Nouns become classes, verbs become methods. Put cardinality on every relationship.
          </p>
          <Table heads={['Class', 'Kind', 'Role']}
            rows={pr.entities.map((r: any) => [
              <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
              <span className="trig">{r[2]}</span>,
            ])} />
        </>
      )}

      {pr.patterns?.length > 0 && (
        <>
          <h2 className="pane-h2">Patterns, and exactly where</h2>
          <Table heads={['Pattern', 'Applied to']}
            rows={pr.patterns.map((r: any) => [<b>{r[0]}</b>, r[1]])} />
        </>
      )}

      {pr.code?.length > 0 && (
        <>
          <h2 className="pane-h2">Code you must be able to write</h2>
          <p className="pane-p">The comments mark where candidates go wrong.</p>
          {pr.code.map((b: any, j: number) => <CodeBlock key={j} title={b[0]} lines={b[1]} why={b[2]} />)}
        </>
      )}

      {pr.concurrency?.length > 0 && (
        <>
          <h2 className="pane-h2">
            Concurrency <span className="h2-count">{pr.concurrency.length}</span>
          </h2>
          <p className="pane-p">
            Raise these before you are asked. At Amazon this is the difference between a hire and a
            no-hire.
          </p>
          <Table heads={['The race', 'How you close it']}
            rows={pr.concurrency.map((r: any) => [<b>{r[0]}</b>, r[1]])} />
        </>
      )}

      {pr.extend?.length > 0 && (
        <>
          <h2 className="pane-h2">&quot;Now add X&quot; <span className="h2-count">{pr.extend.length}</span></h2>
          <p className="pane-p">
            Showing one extension is the highest-scoring thirty seconds of the round.
          </p>
          <Table heads={['They ask for', 'You answer']}
            rows={pr.extend.map((r: any) => [<b>{r[0]}</b>, r[1]])} />
        </>
      )}

      {pr.cross?.length > 0 && (
        <>
          <h2 className="pane-h2">Cross-questions <span className="h2-count">{pr.cross.length}</span></h2>
          {pr.cross.map((r: any, j: number) => <Qa key={j} q={r[0]} a={r[1]} />)}
        </>
      )}

      {pr.fail?.length > 0 && (
        <>
          <h2 className="pane-h2">What sinks candidates here</h2>
          <BulletList items={pr.fail} cls="fail" />
        </>
      )}

      <LldSolution pid={pr.id} solution={(PLAN.lldSolution || {})[pr.id]} />

      <Notes noteKey={key} label="Your design + what you got wrong"
        placeholder="Every LLD session ends with code that runs." />

      {pager}
    </>
  );
}
