'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';

/* A tech Q&A row: question → answer spine → the follow-up they will actually
   ask. The follow-up is the point — anyone can answer the first question. */
export default function QaRow({
  itemKey, q, spine, followUp,
}: { itemKey: string; q: string; spine: string; followUp?: string }) {
  const hydrated = useStore((s) => s.hydrated);
  const p = useStore((s) => s.problems[itemKey]);
  const toggleDone = useStore((s) => s.toggleDone);
  const openDrawer = useUi((s) => s.openDrawer);

  const done = hydrated && !!p?.done;

  return (
    <div className={`qa${done ? ' done' : ''}`}>
      <button
        className="cb"
        aria-label={done ? `Mark "${q}" not answered` : `Mark "${q}" answered cold`}
        aria-pressed={done}
        onClick={() => toggleDone(itemKey)}
      >
        {done ? '✓' : ''}
      </button>
      <div
        className="qa-body"
        role="button"
        tabIndex={0}
        onClick={() => openDrawer(itemKey)}
        onKeyDown={(e) => { if (e.key === 'Enter') openDrawer(itemKey); }}
      >
        <b className="qa-q">{q}</b>
        <span className="qa-a">{spine}</span>
        {followUp && <span className="qa-f"><i>follow-up →</i> {followUp}</span>}
      </div>
      <span className={`dot ${(hydrated && p?.status) || ''}`} />
    </div>
  );
}
