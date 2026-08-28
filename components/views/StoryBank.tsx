'use client';

import { useStore } from '@/lib/store';
import LP from '@/content/lp';

const FIELDS: [string, string, number][] = [
  ['title', 'Story title (how you will refer to it)', 3],
  ['situation', 'S — Situation (15 sec, context only)', 3],
  ['task', 'T — Task (15 sec, YOUR responsibility)', 3],
  ['action', 'A — Action (60–75 sec, first person, decisions and alternatives)', 6],
  ['result', 'R — Result (20 sec, WITH NUMBERS)', 3],
  ['learning', 'L — Learning (what you would do differently)', 3],
  ['probes', 'Answers to the six probes you expect', 6],
];

function Slot({ i }: { i: number }) {
  const slot = LP.lp.slots[i];
  const key = `lp-story-${i}`;
  const p = useStore((s) => s.problems[key]);
  const notes = useStore((s) => s.notes);
  const open = useStore((s) => !!s.ui.open[key]);
  const toggleOpen = useStore((s) => s.toggleOpen);
  const toggleDone = useStore((s) => s.toggleDone);
  const setNote = useStore((s) => s.setNote);

  const filled = FIELDS.filter((f) => (notes[`${key}-${f[0]}`] || '').trim().length > 0).length;

  return (
    <div className={`lp-slot${open ? ' open' : ''}${p?.done ? ' done' : ''}`}>
      <div className="lp-slot-head">
        <button
          className="cb"
          aria-label={`${p?.done ? 'Unmark' : 'Mark'} story ${i + 1} rehearsed`}
          aria-pressed={!!p?.done}
          onClick={() => toggleDone(key)}
        >
          {p?.done ? '✓' : ''}
        </button>
        <button className="lp-slot-btn" aria-expanded={open} onClick={() => toggleOpen(key)}>
          <span className="chev">▶</span>
          <span className="lp-slot-t">
            <b>{i + 1}. {slot[0]}</b>
            <span>{slot[1]}</span>
          </span>
          <span className="lp-fill">{filled}/{FIELDS.length}</span>
        </button>
      </div>

      {open && (
        <div className="lp-slot-body">
          <div className="exit">{slot[2]}</div>
          {FIELDS.map(([f, label, rows]) => {
            const nk = `${key}-${f}`;
            return (
              <div className="field" key={f}>
                <label htmlFor={nk}>{label}</label>
                <textarea
                  id={nk}
                  rows={rows}
                  value={notes[nk] || ''}
                  onChange={(e) => setNote(nk, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StoryBank() {
  const hydrated = useStore((s) => s.hydrated);
  const problems = useStore((s) => s.problems);
  const done = hydrated
    ? LP.lp.slots.filter((_: any, i: number) => problems[`lp-story-${i}`]?.done).length
    : 0;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">Shared · every company</div>
        <h1>The story bank</h1>
        <p className="pane-sub">
          Fifteen slots, and they serve all eleven rubrics. Write the story once; recut the emphasis
          per room.
        </p>
        <div className="pane-stats">
          <span><b>{done}</b>/{LP.lp.slots.length} rehearsed</span>
        </div>
      </div>
      {LP.lp.slots.map((_: any, i: number) => <Slot key={i} i={i} />)}
    </>
  );
}
