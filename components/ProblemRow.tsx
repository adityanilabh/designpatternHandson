'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import ProblemLinks from './ProblemLinks';

interface Props {
  itemKey: string;
  name: string;
  lc?: number | null;
  note?: string;
  diff?: string;
  /* Stage 7's arena peer view renders these for someone else's progress:
     visible and accurate, but not editable. */
  readOnly?: boolean;
}

/* A single checkable row. Keyboard-reachable, unlike the legacy tracker where
   the row was a bare <div> and the drawer could not be opened without a mouse. */
export default function ProblemRow({ itemKey, name, lc = null, note, diff, readOnly }: Props) {
  const hydrated = useStore((s) => s.hydrated);
  const p = useStore((s) => s.problems[itemKey]);
  const toggleDone = useStore((s) => s.toggleDone);
  const openDrawer = useUi((s) => s.openDrawer);

  const done = hydrated && !!p?.done;
  const status = (hydrated && p?.status) || '';

  return (
    <div
      className={`prow${done ? ' done' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${lc != null ? `LeetCode ${lc} ` : ''}${name}`}
      onClick={() => openDrawer(itemKey, readOnly)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(itemKey, readOnly); }
      }}
    >
      <button
        className="cb"
        aria-label={done ? `Mark ${name} not done` : `Mark ${name} done`}
        aria-pressed={done}
        disabled={readOnly}
        onClick={(e) => { e.stopPropagation(); if (!readOnly) toggleDone(itemKey); }}
      >
        {done ? '✓' : ''}
      </button>

      <ProblemLinks lc={lc} name={name} />

      <span className="p-name">{name}</span>
      {note ? <span className="p-note">{note}</span> : null}
      {diff ? <span className="p-cap">{diff}</span> : null}
      <span className={`dot ${status}`} aria-label={status || 'unrated'} />
    </div>
  );
}
