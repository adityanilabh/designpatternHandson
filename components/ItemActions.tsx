'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';

/* The mark-done / open-log pair at the top of an SD session or LLD problem
   page, where the item is the page rather than a row in a list. */
export default function ItemActions({ itemKey }: { itemKey: string }) {
  const hydrated = useStore((s) => s.hydrated);
  const p = useStore((s) => s.problems[itemKey]);
  const toggleDone = useStore((s) => s.toggleDone);
  const openDrawer = useUi((s) => s.openDrawer);

  const done = hydrated && !!p?.done;

  return (
    <div className="pane-actions">
      <button className={`btn ${done ? 'ok on' : 'primary'}`} onClick={() => toggleDone(itemKey)}>
        {done ? '✓ Done' : 'Mark done'}
      </button>
      <button className="btn" onClick={() => openDrawer(itemKey)}>Log / status</button>
      <span className={`dot ${(hydrated && p?.status) || ''}`} />
    </div>
  );
}
