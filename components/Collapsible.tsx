'use client';

import { useStore } from '@/lib/store';

/* The "Full solution" bar on SD sessions and LLD problems. Open state is
   persisted in the store, exactly as legacy/app.js kept it in state.ui.open,
   so a solution you expanded is still expanded when you come back. */
export default function Collapsible({
  id, title, sub, children,
}: {
  id: string; title: string; sub?: string; children: React.ReactNode;
}) {
  const open = useStore((s) => !!s.ui.open[id]);
  const toggleOpen = useStore((s) => s.toggleOpen);

  return (
    <>
      <button
        className={`soln-bar${open ? ' open' : ''}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => toggleOpen(id)}
      >
        <span className="chev">▶</span>
        <span className="soln-t">{title}</span>
        {sub && <span className="soln-sub">{sub}</span>}
      </button>
      {/* Children are always rendered and hidden with [hidden], not omitted.
          The legacy tracker returned early when closed, which meant a worked
          solution existed only after a click — so it was absent from the
          prerendered HTML, unavailable with JS disabled, and invisible to
          anything reading the page. The bodies are a few hundred lines each,
          which is a cheap price for the content actually being there. */}
      <div className="soln-body" id={id} hidden={!open}>{children}</div>
    </>
  );
}
