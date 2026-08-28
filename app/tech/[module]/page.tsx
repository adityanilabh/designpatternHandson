import { notFound } from 'next/navigation';
import PLAN from '@/content/tech';
import Pager from '@/components/Pager';
import Notes from '@/components/Notes';
import QaRow from '@/components/QaRow';
import PracticeRow from '@/components/PracticeRow';
import TechStats from '@/components/views/TechStats';
import { BulletList, CodeBlock, ReadingList } from '@/components/content';

export function generateStaticParams() {
  return PLAN.tech.map((m: any) => ({ module: m.id }));
}

export default async function TechModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: modId } = await params;
  const i = PLAN.tech.findIndex((x: any) => x.id === modId);
  if (i < 0) notFound();

  const m = PLAN.tech[i];
  const prev = i > 0 ? PLAN.tech[i - 1] : null;
  const next = i < PLAN.tech.length - 1 ? PLAN.tech[i + 1] : null;
  const set = (PLAN.techProblems || {})[m.id];
  const total = set ? set.groups.reduce((a: number, g: any) => a + g[2].length, 0) : 0;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">
          Tech · module {m.n} of {PLAN.tech.length} · {m.hrs} hours ·{' '}
          <span className={`chip ph${m.phase}`}>phase {m.phase}</span>
        </div>
        <h1>{m.name}</h1>
        <TechStats modId={m.id} qaCount={m.qa.length} codeCount={m.code?.length} trapCount={m.traps?.length} />
      </div>

      {m.note && <div className="learn"><b>Note.</b> {m.note}</div>}

      {m.asked?.length > 0 && (
        <>
          <h2 className="pane-h2">How the interview opens</h2>
          <BulletList items={m.asked} cls="asked" />
        </>
      )}

      {m.code?.length > 0 && (
        <>
          <h2 className="pane-h2">
            Patterns you must be able to write <span className="h2-count">{m.code.length}</span>
          </h2>
          <p className="pane-p">
            Type these from memory, not from a snippet file. The comments mark where candidates go
            wrong.
          </p>
          {m.code.map((c: any, j: number) => (
            <CodeBlock key={j} title={c[0]} lines={c[1]} why={c[2]} />
          ))}
        </>
      )}

      <h2 className="pane-h2">
        Question → spine → follow-up <span className="h2-count">{m.qa.length}</span>
      </h2>
      <p className="pane-p"><b>Learn the follow-up.</b> Anyone can answer the first question.</p>
      {m.qa.map((r: any, j: number) => (
        <QaRow key={j} itemKey={`tq-${m.id}-${j}`} q={r[0]} spine={r[1]} followUp={r[2]} />
      ))}

      {m.traps?.length > 0 && (
        <>
          <h2 className="pane-h2">
            Traps that bite <span className="h2-count">{m.traps.length}</span>
          </h2>
          <BulletList items={m.traps} cls="fail" />
        </>
      )}

      {set && (
        <>
          <h2 className="pane-h2">
            Practice problems <span className="h2-count">{total}</span>
          </h2>
          <p className="pane-p">{set.intro}</p>
          {set.groups.map((g: any, gi: number) => (
            <div key={gi}>
              <h3 className="prac-h">{g[0]}</h3>
              <p className="pane-p">{g[1]}</p>
              {g[2].map((r: any, j: number) => (
                <PracticeRow
                  key={j}
                  itemKey={`pp-${m.id}-${gi}-${j}`}
                  lc={r[0]}
                  name={r[1]}
                  diff={r[2]}
                  note={r[3]}
                />
              ))}
            </div>
          ))}
          {set.drill?.length > 0 && (
            <>
              <h3 className="prac-h">How to work them</h3>
              <BulletList items={set.drill} />
            </>
          )}
        </>
      )}

      <ReadingList rows={(PLAN.techRead || {})[m.id]} heading="Read more" />

      <Notes
        noteKey={`mod-${m.id}`}
        label="Hands-on artefact / notes"
        placeholder="What you actually built or broke. Not a summary of what you read."
      />

      <Pager
        prev={prev ? { href: `/tech/${prev.id}`, label: prev.name } : null}
        next={next ? { href: `/tech/${next.id}`, label: next.name } : null}
      />
    </>
  );
}
