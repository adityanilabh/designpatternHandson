import { Table } from '@/components/content';
import LP from '@/content/lp';

const U = LP.lp.universal;

function Head({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="pane-head">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {sub && <p className="pane-sub">{sub}</p>}
    </div>
  );
}

/* The pages that are the same in every room: the ten shapes, the recut matrix,
   where to mine stories, the writing cadence, and the four things every loop
   asks regardless of company. */
export default function LpShared({ id }: { id: string }) {
  if (id === 'u-shapes') {
    return (
      <>
        <Head eyebrow="Shared · every company" title="The ten shapes" sub={U.coverage.intro} />
        <Table heads={['Story shape', 'Covers', 'Note']}
          rows={U.coverage.shapes.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
            <span className="trig">{r[2]}</span>,
          ])} />
        <div className="exit">{U.coverage.rule}</div>
      </>
    );
  }

  if (id === 'u-recut') {
    return (
      <>
        <Head eyebrow="Shared · every company" title="The recut matrix" sub={U.recut.intro} />
        <div className="learn">{U.recut.note}</div>
        <Table heads={['Room', 'Register', 'Add', 'Remove']}
          rows={U.recut.rows.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
            <span className="trig">{r[2]}</span>, <span className="trig">{r[3]}</span>,
          ])} />
        <h2 className="pane-h2">One event, four rooms</h2>
        <p className="pane-p">{U.recut.worked.intro}</p>
        {U.recut.worked.rows.map((r: any, i: number) => (
          <div key={i}>
            <h3 className="pane-h3">{r[0]}</h3>
            <div className="lp-said">{r[1]}</div>
          </div>
        ))}
      </>
    );
  }

  if (id === 'mining') {
    return (
      <>
        <Head eyebrow="Shared · every company" title="Where to mine stories"
          sub="You already have fifteen stories. They are in systems you may lose access to." />
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Source</th><th>What is in there</th></tr></thead>
            <tbody>
              {LP.lp.mining.map((r: any, i: number) => (
                <tr key={i} className={r[0] === 'WARNING' ? 'hot' : ''}>
                  <td className="fire">{r[0]}</td>
                  <td className="trig">{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (id === 'schedule') {
    return (
      <>
        <Head eyebrow="Shared · every company" title="Writing cadence"
          sub="Fifteen stories in one weekend does not work. This is the cadence that does. Per-company recuts are on each company’s own schedule page." />
        <Table heads={['When', 'What', 'Note']}
          rows={LP.lp.plan.map((r: any) => [
            <span className="canon">{r[0]}</span>, <span className="fire">{r[1]}</span>,
            <span className="trig">{r[2]}</span>,
          ])} />
      </>
    );
  }

  if (id === 'u-openers') {
    return (
      <>
        <Head eyebrow="Every loop" title="The four openers" sub={U.openers.intro} />
        {U.openers.rows.map((r: any, i: number) => (
          <div key={i}>
            <h2 className="pane-h2">{r[0]}</h2>
            <p className="pane-p">{r[1]}</p>
            <div className="exit">{r[2]}</div>
          </div>
        ))}
        <h2 className="pane-h2">Questions worth asking</h2>
        <p className="pane-p">{U.openers.questions.intro}</p>
        <Table heads={['Ask', 'What it tells you']}
          rows={U.openers.questions.rows.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="trig">{r[1]}</span>,
          ])} />
      </>
    );
  }

  if (id === 'u-screen') {
    return (
      <>
        <Head eyebrow="Every loop" title="The recruiter screen" sub={U.screen.intro} />
        <div className="tbl-wrap">
          <table>
            <thead><tr><th></th><th>What to do</th></tr></thead>
            <tbody>
              {U.screen.rows.map((r: any, i: number) => (
                <tr key={i} className={r[0] === 'Never do this' ? 'hot' : ''}>
                  <td className="fire">{r[0]}</td>
                  <td className="trig">{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <Head eyebrow="Every loop" title="Offers and negotiation" sub={U.offer.intro} />
      <Table heads={['', 'What to do']}
        rows={U.offer.rows.map((r: any) => [
          <span className="fire">{r[0]}</span>, <span className="trig">{r[1]}</span>,
        ])} />
    </>
  );
}
