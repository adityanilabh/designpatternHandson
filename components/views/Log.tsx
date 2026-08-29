'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { allItems } from '@/lib/items';

export default function Log() {
  const hydrated = useStore((s) => s.hydrated);
  const problems = useStore((s) => s.problems);
  const openDrawer = useUi((s) => s.openDrawer);

  const rows = hydrated
    ? allItems().filter((x) => {
        const p = problems[x.key];
        return p?.log && (p.log.trigger || p.log.technique || p.log.mistake);
      })
    : [];

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>The log</h2><span className="spacer" />
          <span className="pill">{rows.length}</span>
        </div>
        <p className="dim">
          The <b>ROOT CAUSE</b> line is the point of the whole exercise. &quot;I made a
          mistake&quot; is worthless. &quot;I think of <i>visited</i> as positional when it is
          state-al&quot; is a fixable defect that would otherwise recur in five more problems.
        </p>
      </div>

      {!rows.length ? (
        <div className="card">
          <p className="dim">
            Nothing logged yet. Open any item and fill in trigger / technique / root cause.
          </p>
        </div>
      ) : (
        rows.slice().reverse().map((x) => {
          const p = problems[x.key];
          return (
            <div
              key={x.key}
              className="card logcard"
              role="button"
              tabIndex={0}
              onClick={() => openDrawer(x.key)}
              onKeyDown={(e) => { if (e.key === 'Enter') openDrawer(x.key); }}
            >
              <div className="log-hd">
                <b>{x.lc != null ? `LeetCode ${x.lc} · ` : ''}{x.name}</b>
                <span className="spacer" />
                <span className={`dot ${p.status}`} />
                <span className="dim" style={{ marginLeft: 8 }}>
                  {x.group}{p.mins ? ` · ${p.mins} min` : ''}
                </span>
              </div>
              {p.log.trigger && <div className="log-l"><i>TRIGGER</i>{p.log.trigger}</div>}
              {p.log.technique && <div className="log-l"><i>TECHNIQUE</i>{p.log.technique}</div>}
              {p.log.mistake && <div className="log-l root"><i>ROOT CAUSE</i>{p.log.mistake}</div>}
            </div>
          );
        })
      )}
    </>
  );
}
