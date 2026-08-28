'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import ProblemLinks from './ProblemLinks';

const DIFF_CLS: Record<string, string> = { E: 'e', M: 'm', H: 'h' };

/* A tech practice problem. Some have no LeetCode equivalent — the classic
   whiteboard implementations — so those link to a search instead of a dead
   problem URL. */
export default function PracticeRow({
  itemKey, lc, name, diff, note,
}: { itemKey: string; lc: number | null; name: string; diff?: string; note?: string }) {
  const hydrated = useStore((s) => s.hydrated);
  const p = useStore((s) => s.problems[itemKey]);
  const toggleDone = useStore((s) => s.toggleDone);
  const openDrawer = useUi((s) => s.openDrawer);

  const done = hydrated && !!p?.done;

  return (
    <div
      className={`prow${done ? ' done' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => openDrawer(itemKey)}
      onKeyDown={(e) => { if (e.key === 'Enter') openDrawer(itemKey); }}
    >
      <button
        className="cb"
        aria-label={done ? `Mark ${name} not done` : `Mark ${name} done`}
        aria-pressed={done}
        onClick={(e) => { e.stopPropagation(); toggleDone(itemKey); }}
      >
        {done ? '✓' : ''}
      </button>
      <span className={`diff ${DIFF_CLS[diff || ''] || ''}`}>{diff || ''}</span>
      {lc != null ? (
        <ProblemLinks lc={lc} name={name} />
      ) : (
        <>
          <a
            className="p-lc lnk"
            href={`https://www.google.com/search?q=${encodeURIComponent(`java ${name} implementation interview`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="No LeetCode equivalent — search"
            onClick={(e) => e.stopPropagation()}
          >
            impl
          </a>
          <span className="p-gfg" style={{ opacity: 0.35 }}>—</span>
        </>
      )}
      <span className="p-name">{name}</span>
      {note && <span className="p-note">{note}</span>}
      <span className={`dot ${(hydrated && p?.status) || ''}`} />
    </div>
  );
}
