import { BulletList, AsciiBlock, Table, Qa, Paragraphs } from '@/components/content';
import Collapsible from '@/components/Collapsible';

/* The expandable worked solution on a system design session. Server-rendered
   inside a client Collapsible, so the markup ships once and toggling costs
   nothing. */
export default function SdSolution({ n, solution: s }: { n: number; solution: any }) {
  if (!s) {
    return (
      <div className="soln-none">
        Worked solution not written yet for this session. The blocks above are complete.
      </div>
    );
  }

  return (
    <Collapsible
      id={`sdsoln-${n}`}
      title="Full solution"
      sub="requirements · estimation · API · data model · architecture · flows · deep dive · scaling · trade-offs"
    >
      <h2 className="pane-h2">Requirements</h2>
      <div className="req-cols">
        <div><h3>Functional</h3><BulletList items={s.req.functional} /></div>
        <div><h3>Non-functional</h3><BulletList items={s.req.nonFunctional} /></div>
      </div>

      <h2 className="pane-h2">Estimation — out loud, rounded</h2>
      <Table
        heads={['Quantity', 'Working', 'Result']}
        rows={s.estimate.map((r: any) => [
          <span className="fire">{r[0]}</span>,
          <span className="mono-cell">{r[1]}</span>,
          <span className="trig">{r[2]}</span>,
        ])}
      />

      <h2 className="pane-h2">API</h2>
      <Table
        heads={['Endpoint', 'Request', 'Response', 'Note']}
        rows={s.api.map((r: any) => [
          <span className="mono-cell">{r[0]}</span>,
          <span className="canon">{r[1]}</span>,
          <span className="canon">{r[2]}</span>,
          <span className="trig">{r[3]}</span>,
        ])}
      />

      <h2 className="pane-h2">Data model</h2>
      <Table
        heads={['Table', 'Columns', 'Why']}
        rows={s.dataModel.map((r: any) => [
          <span className="fire">{r[0]}</span>,
          <span className="mono-cell">{r[1]}</span>,
          <span className="trig">{r[2]}</span>,
        ])}
      />

      <h2 className="pane-h2">Architecture</h2>
      <AsciiBlock lines={s.arch} />

      <h2 className="pane-h2">Flows</h2>
      {s.flows.map((f: any, i: number) => (
        <div key={i}>
          <h3 className="prac-h">{f[0]}</h3>
          <BulletList items={f[1]} />
        </div>
      ))}

      <h2 className="pane-h2">
        Deep dive <span className="h2-count">{s.deepDive.length}</span>
      </h2>
      <p className="pane-p">
        Pick one of these at minute 30, before they ask. Choosing well is itself scored.
      </p>
      {s.deepDive.map((d: any, i: number) => (
        <div key={i}>
          <h3 className="prac-h">{d[0]}</h3>
          <Paragraphs text={d[1]} />
        </div>
      ))}

      <h2 className="pane-h2">Scaling — in the order it bites</h2>
      <Table
        heads={['Bottleneck', 'What you do']}
        rows={s.scaling.map((r: any) => [
          <span className="fire">{r[0]}</span>,
          <span className="trig">{r[1]}</span>,
        ])}
      />

      <h2 className="pane-h2">Trade-offs — say the alternative you rejected</h2>
      <Table
        heads={['Decision', 'Chose', 'Over', 'Because']}
        rows={s.tradeoffs.map((r: any) => [
          <span className="fire">{r[0]}</span>,
          <span className="trig"><b>{r[1]}</b></span>,
          <span className="canon">{r[2]}</span>,
          <span className="trig">{r[3]}</span>,
        ])}
      />

      <h2 className="pane-h2">What each company pushes on</h2>
      {s.angle.map((r: any, i: number) => <Qa key={i} q={r[0]} a={r[1]} />)}
    </Collapsible>
  );
}
