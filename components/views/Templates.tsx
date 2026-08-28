'use client';

import { useStore } from '@/lib/store';

/* Cold, correct, under three minutes. A Dijkstra you have to re-derive costs
   eight minutes you do not have. */
export default function Templates({ templates }: { templates: any[] }) {
  const hydrated = useStore((s) => s.hydrated);
  const stored = useStore((s) => s.templates);
  const setTemplate = useStore((s) => s.setTemplate);

  let lastGroup = '';

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">Reference</div>
        <h1>Template library</h1>
        <p className="pane-sub">
          Cold, correct, under three minutes. A Dijkstra you have to re-derive costs eight minutes
          you do not have.
        </p>
      </div>

      {templates.map((tp: any, i: number) => {
        const header = tp.g !== lastGroup ? (lastGroup = tp.g) : null;
        const st = (hydrated && stored[i]?.status) || '';
        return (
          <div key={i}>
            {header && <h2 className="pane-h2">{header}</h2>}
            <div className="tpl">
              <span className="tpl-n">{i + 1}</span>
              <div className="tpl-body"><b>{tp.n}</b><span>{tp.d}</span></div>
              <div className="tpl-actions">
                {([['unknown', 'bad', 'shaky'], ['learning', 'warn', 'slow'], ['fast', 'ok', '<3 min']] as const)
                  .map(([v, cls, label]) => (
                    <button
                      key={v}
                      className={`btn sm ${cls}${st === v ? ' on' : ''}`}
                      aria-pressed={st === v}
                      onClick={() => setTemplate(String(i), v)}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
