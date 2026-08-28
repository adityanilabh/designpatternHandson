'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { findItem } from '@/lib/items';
import { approachFor } from '@/lib/links';
import { fmtDate } from '@/lib/calendar';
import ProblemLinks from './ProblemLinks';
import type { Status } from '@/lib/types';

const STATUSES: { v: Status; label: string; cls: string }[] = [
  { v: 'clean', label: 'Clean', cls: 'ok' },
  { v: 'ugly', label: 'Ugly', cls: 'warn' },
  { v: 'failed', label: 'Failed', cls: 'bad' },
];

const LOG_FIELDS: { f: 'trigger' | 'technique' | 'mistake'; label: string; ph: string }[] = [
  { f: 'trigger', label: 'TRIGGER — what in the wording should have tipped you off',
    ph: 'e.g. "collect all keys", keys <= 6 → the bitmask goes INTO the state' },
  { f: 'technique', label: 'TECHNIQUE — what actually solved it',
    ph: 'e.g. BFS on (r, c, keysMask); visited is a 3-D set, NOT a 2-D grid' },
  { f: 'mistake', label: 'ROOT CAUSE — the mental model that was wrong',
    ph: 'Not "I forgot X". What belief produced the bug?' },
];

export default function Drawer() {
  const key = useUi((s) => s.drawerKey);
  const readOnly = useUi((s) => s.drawerReadOnly);
  const close = useUi((s) => s.closeDrawer);
  const spoilerOpen = useUi((s) => (key ? !!s.spoilerOpen[key] : false));
  const toggleSpoiler = useUi((s) => s.toggleSpoiler);

  const p = useStore((s) => (key ? s.problems[key] : undefined));
  const { setStatus, setMins, setLog, toggleReview, rescheduleReviews, toggleDone, clearItem } =
    useStore.getState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  if (!key) return null;
  const item = findItem(key);
  if (!item) return null;

  const approach = approachFor(key);
  const reviews = p?.reviews || [];

  return (
    <>
      <div className="drawer-scrim" onClick={close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={item.name}>
        <div className="drawer-head">
          <div>
            <div className="drawer-eyebrow">{item.group}</div>
            <h2>{item.lc != null ? `LC ${item.lc} · ` : ''}{item.name}</h2>
          </div>
          <button className="btn ghost" onClick={close} aria-label="Close">✕</button>
        </div>

        <div className="drawer-body">
          {item.lc != null && (
            <div className="dr-links"><ProblemLinks lc={item.lc} name={item.name} /></div>
          )}
          {item.note ? <div className="learn">{item.note}</div> : null}

          {approach && (
            <div className={`appr${spoilerOpen ? ' open' : ''}`}>
              <button className="appr-btn" onClick={() => toggleSpoiler(key)}>
                {spoilerOpen ? '▾' : '▸'} Approach &amp; cost
                <span>{spoilerOpen ? 'hide' : 'spoiler — only after you have tried it'}</span>
              </button>
              {spoilerOpen && <div className="appr-body">{approach}</div>}
            </div>
          )}

          {readOnly ? (
            <p className="dim" style={{ marginTop: 16 }}>
              You are viewing someone else&apos;s progress. Their status is shown; their
              trigger, technique and root-cause notes are private.
            </p>
          ) : (
            <>
              <div className="field">
                <label>Status</label>
                <div className="btnrow">
                  {STATUSES.map((st) => (
                    <button
                      key={st.v}
                      className={`btn ${st.cls}${p?.status === st.v ? ' on' : ''}`}
                      onClick={() => setStatus(key, st.v)}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                <p className="dim" style={{ marginTop: 8, fontSize: 12.5 }}>
                  <b>Clean</b> = correct, in time, you could explain every line.{' '}
                  <b>Ugly</b> = correct but slow or guessing. Ugly or failed schedules four
                  blank-file re-solves at +1, +3, +7 and +16 days.
                </p>
              </div>

              <div className="field">
                <label htmlFor="dr-mins">Minutes taken</label>
                <input
                  id="dr-mins"
                  type="number"
                  min={0}
                  value={p?.mins || ''}
                  placeholder="wall clock, visible"
                  onChange={(e) => setMins(key, parseInt(e.target.value, 10))}
                />
              </div>

              {LOG_FIELDS.map((f) => (
                <div className="field" key={f.f}>
                  <label htmlFor={`dr-${f.f}`}>{f.label}</label>
                  <textarea
                    id={`dr-${f.f}`}
                    placeholder={f.ph}
                    value={p?.log?.[f.f] || ''}
                    onChange={(e) => setLog(key, f.f, e.target.value)}
                  />
                </div>
              ))}
            </>
          )}

          {reviews.length > 0 && (
            <div className="field">
              <label>Re-solve schedule</label>
              <div className="revlist">
                {reviews.map((r, i) => (
                  <label key={r.due} className={`revitem${r.done ? ' done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={r.done}
                      disabled={readOnly}
                      onChange={(e) => toggleReview(key, i, e.target.checked)}
                    />{' '}
                    {fmtDate(r.due)}
                  </label>
                ))}
              </div>
            </div>
          )}

          {!readOnly && (
            <div className="btnrow" style={{ marginTop: 20 }}>
              <button className="btn primary" onClick={() => toggleDone(key)}>
                {p?.done ? 'Mark not done' : 'Mark done'}
              </button>
              <button className="btn" onClick={() => rescheduleReviews(key)}>
                Re-schedule re-solves
              </button>
              <button className="btn ghost" onClick={() => { clearItem(key); close(); }}>
                Clear this item
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
