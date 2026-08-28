import { BulletList, AsciiBlock, CodeBlock, Table } from '@/components/content';
import Collapsible from '@/components/Collapsible';

export default function LldSolution({ pid, solution: s }: { pid: string; solution: any }) {
  if (!s) {
    return (
      <div className="soln-none">
        Full worked solution not written yet for this problem. The blocks above are complete.
      </div>
    );
  }

  return (
    <Collapsible
      id={`soln-${pid}`}
      title="Full solution"
      sub={`approach · class diagram · API${s.schema ? ' · schema' : ''} · code`}
    >
      <h2 className="pane-h2">Problem statement</h2>
      <div className="learn">{s.statement}</div>

      <h2 className="pane-h2">Requirements</h2>
      <div className="req-cols">
        <div><h3>Functional</h3><BulletList items={s.req.functional} /></div>
        <div><h3>Non-functional</h3><BulletList items={s.req.nonFunctional} /></div>
      </div>

      <h2 className="pane-h2">How to approach it</h2>
      <Table
        heads={['Step', 'What you do']}
        rows={s.approach.map((r: any) => [
          <span className="fire">{r[0]}</span>,
          <span className="trig">{r[1]}</span>,
        ])}
      />

      <h2 className="pane-h2">Class diagram</h2>
      <AsciiBlock lines={s.uml} />

      <h2 className="pane-h2">Public API</h2>
      <Table
        heads={['Signature', 'Contract']}
        rows={s.api.map((r: any) => [
          <span className="mono-cell">{r[0]}</span>,
          <span className="trig">{r[1]}</span>,
        ])}
      />

      {s.schema?.length > 0 && (
        <>
          <h2 className="pane-h2">Schema, if persistence is in scope</h2>
          <Table
            heads={['Table', 'Columns', 'Note']}
            rows={s.schema.map((r: any) => [
              <span className="fire">{r[0]}</span>,
              <span className="mono-cell">{r[1]}</span>,
              <span className="trig">{r[2]}</span>,
            ])}
          />
        </>
      )}

      <h2 className="pane-h2">The code</h2>
      {s.solution.map((b: any, i: number) => (
        <CodeBlock key={i} title={b[0]} lines={b[1]} why={b[2]} />
      ))}
    </Collapsible>
  );
}
