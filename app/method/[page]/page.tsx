import { notFound } from 'next/navigation';
import PLAN from '@/content/method';
import Pager from '@/components/Pager';
import BlindPrompts from '@/components/views/BlindPrompts';
import { BulletList, Table, Qa } from '@/components/content';

const M = PLAN.method;

const PAGES = [
  { id: 'why', label: 'Why this section exists' },
  { id: 'altitude', label: 'Altitude control' },
  { id: 'decompose', label: 'Decomposition' },
  { id: 'primitives', label: 'The primitive catalogue' },
  { id: 'failures', label: 'Failure generator' },
  { id: 'ambiguity', label: 'The first three minutes' },
  { id: 'domain', label: 'Unknown domain' },
  { id: 'product', label: 'Product thinking' },
  { id: 'worked', label: 'A worked round' },
  { id: 'blind', label: 'Blind prompt bank' },
  { id: 'rubric', label: 'The rubric' },
];

export function generateStaticParams() {
  return PAGES.map((p) => ({ page: p.id }));
}

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="pane-head">
      <div className="eyebrow">The Method</div>
      <h1>{title}</h1>
      {sub && <p className="pane-sub">{sub}</p>}
    </div>
  );
}

/* First column bold, last column muted when there are 3+ — matches numTable()
   in the legacy tracker. */
function NumTable({ rows, heads }: { rows: any[][]; heads: string[] }) {
  return (
    <Table
      heads={heads}
      rows={rows.map((r) => r.map((c, i) =>
        i === 0
          ? <span className="fire">{c}</span>
          : <span className={i === r.length - 1 && r.length > 2 ? 'canon' : 'trig'}>{c}</span>
      ))}
    />
  );
}

export default async function MethodPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: id } = await params;
  const i = PAGES.findIndex((p) => p.id === id);
  if (i < 0) notFound();

  const pager = (
    <Pager
      prev={i > 0 ? { href: `/method/${PAGES[i - 1].id}`, label: PAGES[i - 1].label } : null}
      next={i < PAGES.length - 1
        ? { href: `/method/${PAGES[i + 1].id}`, label: PAGES[i + 1].label } : null}
    />
  );

  let body: React.ReactNode = null;

  if (id === 'why') {
    body = (
      <>
        <Head title="Why this section exists"
          sub="Every other section teaches machinery through named problems. Real rounds hand you a system nobody has blogged about." />
        <div className="learn">{M.altitude.evidence}</div>
        <h2 className="pane-h2">The claim</h2>
        <p className="pane-p">
          The <b>problem</b> is volatile. The <b>machinery</b> is not. An audio-buffer pipeline is
          bounded buffers with backpressure. A playlist mixer is a k-way merge with a ratio strategy
          and a filter chain. A locker system is atomic allocation with an expiring token. None of
          those appear on a prep list; all of them are made of parts you already have.
        </p>
        <p className="pane-p">
          This section is the procedure for getting from an unheard-of prompt to those parts. Work
          it in order, mechanically, especially when it feels slow.
        </p>
        <h2 className="pane-h2">The honest limit</h2>
        <div className="exit">
          The method is teachable and it is written down here. The <b>fluency is not</b> — that
          comes from running unseen prompts under a clock, recorded, scored against the rubric. Ten
          of those is worth more than the next fifty named problems.
        </div>
      </>
    );
  } else if (id === 'altitude') {
    body = (
      <>
        <Head title="Altitude control" sub={M.altitude.intro} />
        <div className="lp-weak">{M.altitude.evidence}</div>
        <h2 className="pane-h2">The three levels</h2>
        <Table heads={['Level', 'What lives here', 'Prompt sounds like', 'You are drifting if you…']}
          rows={M.altitude.levels.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="trig">{r[1]}</span>,
            <span className="canon">{r[2]}</span>, <span className="canon">{r[3]}</span>,
          ])} />
        <h2 className="pane-h2">How to tell which one they want</h2>
        <NumTable rows={M.altitude.signals} heads={['Signal', 'Level', 'What to do']} />
        <h2 className="pane-h2">The check — ask this in the first minute</h2>
        <div className="soln-quote">{M.altitude.theCheck}</div>
        <h2 className="pane-h2">Recovering when you are at the wrong level</h2>
        <NumTable rows={M.altitude.recovery} heads={['Situation', 'What to do']} />
        <h2 className="pane-h2">The specific trap</h2>
        <div className="lp-weak">{M.altitude.drift}</div>
      </>
    );
  } else if (id === 'decompose') {
    body = (
      <>
        <Head title="Decomposition" sub={M.decompose.intro} />
        <h2 className="pane-h2">System design — in this order</h2>
        <NumTable rows={M.decompose.hld} heads={['Step', 'What you do']} />
        <h2 className="pane-h2">Object design — in this order</h2>
        <NumTable rows={M.decompose.lld} heads={['Step', 'What you do']} />
        <h2 className="pane-h2">When the domain is unfamiliar</h2>
        <div className="exit">{M.decompose.unknownShape}</div>
      </>
    );
  } else if (id === 'primitives') {
    body = (
      <>
        <Head title="The primitive catalogue" sub={M.primitives.intro} />
        <div className="learn">{M.primitives.note}</div>
        <Table heads={['Primitive', 'What it is for', 'Reach for it when', 'WRONG choice when', 'It costs you']}
          rows={M.primitives.rows.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="trig">{r[1]}</span>,
            <span className="canon">{r[2]}</span>, <span className="wrong-cell">{r[3]}</span>,
            <span className="canon">{r[4]}</span>,
          ])} />
      </>
    );
  } else if (id === 'failures') {
    body = (
      <>
        <Head title="Failure generator" sub={M.failures.intro} />
        <div className="learn"><b>How to run it.</b> {M.failures.how}</div>
        <h2 className="pane-h2">The eleven questions</h2>
        <NumTable rows={M.failures.loop} heads={['', 'Ask', 'What it forces you to answer']} />
        <h2 className="pane-h2">The offline family</h2>
        <p className="pane-p">{M.failures.offlineFamily.intro}</p>
        <NumTable rows={M.failures.offlineFamily.rows} heads={['Aspect', 'The question']} />
        <h2 className="pane-h2">You will not have time for all of it</h2>
        <div className="exit">{M.failures.pickTwo}</div>
      </>
    );
  } else if (id === 'ambiguity') {
    body = (
      <>
        <Head title="The first three minutes" sub={M.ambiguity.intro} />
        <h2 className="pane-h2">The protocol</h2>
        <NumTable rows={M.ambiguity.steps} heads={['Step', 'What you say']} />
        <h2 className="pane-h2">What not to do</h2>
        <BulletList items={M.ambiguity.dontDo} cls="fail" />
        <h2 className="pane-h2">When the requirements are handed to you</h2>
        <div className="lp-weak">{M.ambiguity.whenGivenRequirements}</div>
      </>
    );
  } else if (id === 'domain') {
    body = (
      <>
        <Head title="Unknown domain" sub={M.domain.intro} />
        <h2 className="pane-h2">Translate it, do not learn it</h2>
        <NumTable rows={M.domain.translate} heads={['Ask', 'What it maps to']} />
        <h2 className="pane-h2">Say it out loud</h2>
        <div className="soln-quote">{M.domain.script}</div>
        <h2 className="pane-h2">Rules</h2>
        <BulletList items={M.domain.rules} />
      </>
    );
  } else if (id === 'product') {
    body = (
      <>
        <Head title="Product thinking" sub={M.product.intro} />
        <h2 className="pane-h2">The frame</h2>
        <NumTable rows={M.product.frame} heads={['Ask yourself', 'Because']} />
        <h2 className="pane-h2">Worked answers</h2>
        {M.product.examples.map((r: any, j: number) => <Qa key={j} q={r[0]} a={r[1]} />)}
        <h2 className="pane-h2">The tell</h2>
        <div className="lp-weak">{M.product.tell}</div>
      </>
    );
  } else if (id === 'worked') {
    body = (
      <>
        <Head title="A worked round" sub={M.worked.prompt} />
        <div className="learn">{M.worked.note}</div>
        {M.worked.beats.map((b: any, j: number) => (
          <div key={j}>
            <h2 className="pane-h2">{b[0]}</h2>
            <div className="lp-said">{b[1]}</div>
            <div className="lp-why"><i>what the method is doing here</i>{b[2]}</div>
          </div>
        ))}
        <h2 className="pane-h2">What the method did</h2>
        <div className="exit">{M.worked.whatTheMethodDid}</div>
      </>
    );
  } else if (id === 'blind') {
    body = <BlindPrompts blind={M.blind} />;
  } else {
    body = (
      <>
        <Head title="The rubric" sub={M.rubric.intro} />
        <Table heads={['Row', 'Pts', 'What earns it']}
          rows={M.rubric.rows.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
            <span className="trig">{r[2]}</span>,
          ])} />
        <h2 className="pane-h2">Bands</h2>
        <NumTable rows={M.rubric.bands} heads={['Score', 'Read']} />
        <h2 className="pane-h2">Keep a log</h2>
        <div className="exit">{M.rubric.log}</div>
      </>
    );
  }

  return <>{body}{pager}</>;
}
