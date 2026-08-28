'use client';

import { useStore } from '@/lib/store';
import ProblemRow from '@/components/ProblemRow';

/* One DSA section: the derivation, block A patterns as drillable rows, then
   blocks B and C. The disguise column is the whole point — cover the right
   side, read a disguise, say the move. */
export default function DsaSection({
  section: s, total, derive,
}: { section: any; total: number; derive?: string }) {
  const hydrated = useStore((st) => st.hydrated);
  const patterns = useStore((st) => st.patterns);
  const problems = useStore((st) => st.problems);
  const notes = useStore((st) => st.notes);
  const setPattern = useStore((st) => st.setPattern);
  const setNote = useStore((st) => st.setNote);

  const doneIn = (blk: 'b' | 'c') =>
    s[blk].filter((_: any, i: number) => problems[`ds-${s.id}-${blk}-${i}`]?.done).length;
  const patDone = s.p.filter((_: any, i: number) => patterns[`pt-${s.id}-${i}`] === 'fast').length;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">
          DSA · section {s.n} of {total} · <span className={`chip ph${s.phase}`}>phase {s.phase}</span>
        </div>
        <h1>{s.name}</h1>
        {s.sub && <p className="pane-sub">{s.sub}</p>}
        <div className="pane-stats">
          <span><b>{hydrated ? patDone : 0}</b>/{s.p.length} patterns cold</span>
          <span><b>{hydrated ? doneIn('b') : 0}</b>/{s.b.length} block B solved</span>
          <span><b>{hydrated ? doneIn('c') : 0}</b>/{s.c.length} block C solved</span>
        </div>
      </div>

      {derive && <div className="derive"><i>getting to the right row</i>{derive}</div>}

      <h2 className="pane-h2">A · Patterns</h2>
      <p className="pane-p">
        The machinery. Each row is <b>disguise → move</b>, and the disguise column is what the
        interviewer actually says. Cover the right side, read a disguise, say the move. Under five
        seconds or it is not learned.
      </p>
      <div className="tbl-wrap">
        <table className="pat">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>The disguise — what you actually hear</th>
              <th>The move</th><th>Cost</th><th>Cold?</th>
            </tr>
          </thead>
          <tbody>
            {s.p.map((r: any, i: number) => {
              const pk = `pt-${s.id}-${i}`;
              const st = (hydrated && patterns[pk]) || '';
              return (
                <tr key={pk}>
                  <td className="fire">{r[0]}</td>
                  <td className="trig">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td className="canon">{r[3] || ''}</td>
                  <td className="pat-act">
                    {([['unknown', 'bad', '?'], ['learning', 'warn', '~'], ['fast', 'ok', '✓']] as const)
                      .map(([v, cls, glyph]) => (
                        <button
                          key={v}
                          className={`btn xs ${cls}${st === v ? ' on' : ''}`}
                          aria-label={`${r[0]}: ${v}`}
                          aria-pressed={st === v}
                          onClick={() => setPattern(pk, v)}
                        >
                          {glyph}
                        </button>
                      ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="pane-h2">
        B · Tier 1–2 <span className="h2-count">{s.b.length}</span>
      </h2>
      <p className="pane-p">
        JPM · Amex · Expedia · Amazon · Microsoft · Adobe. Never solve one without first naming
        which row of block A it is.
      </p>
      {s.b.map((r: any, i: number) => (
        <ProblemRow key={`b${i}`} itemKey={`ds-${s.id}-b-${i}`} lc={r[0]} name={r[1]} diff={r[2]} note={r[3]} />
      ))}

      <h2 className="pane-h2">
        C · Google / Uber L4 <span className="h2-count">{s.c.length}</span>
      </h2>
      {s.cx && <div className="learn"><b>Extra machinery.</b> {s.cx}</div>}
      {s.c.map((r: any, i: number) => (
        <ProblemRow key={`c${i}`} itemKey={`ds-${s.id}-c-${i}`} lc={r[0]} name={r[1]} diff={r[2]} note={r[3]} />
      ))}

      <div className="field pane-notes">
        <label htmlFor={`note-${s.id}`}>Notes — add YOUR disguises here</label>
        <textarea
          id={`note-${s.id}`}
          placeholder="The phrase that should have tipped you off. One line per miss."
          value={notes[`sec-${s.id}`] || ''}
          onChange={(e) => setNote(`sec-${s.id}`, e.target.value)}
        />
      </div>
    </>
  );
}
