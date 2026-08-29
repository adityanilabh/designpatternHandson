'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { findItem } from '@/lib/items';
import { approachFor, deriveFor } from '@/lib/links';
import { fmtDate } from '@/lib/calendar';
import APPROACHES, { FAMILY_LABEL } from '@/content/approaches';
import StudyLinks from './StudyLinks';
import type { Status } from '@/lib/types';

const STATUSES: { v: Status; label: string; cls: string }[] = [
  { v: 'clean', label: 'Clean', cls: 'ok' },
  { v: 'ugly', label: 'Ugly', cls: 'warn' },
  { v: 'failed', label: 'Failed', cls: 'bad' },
];

/* 0 means "not recorded". The top of the range is three hours because that is
   the longest a session in this plan runs — an LLD or system design block —
   and the step is fine enough that a 25-minute solve is still expressible. */
const MINS_MAX = 180;
const MINS_STEP = 5;

function fmtMins(m: number): string {
  if (!m) return 'not recorded';
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h${r ? ` ${r}m` : ''}` : `${r}m`;
}

export default function Drawer() {
  const key = useUi((s) => s.drawerKey);
  const readOnly = useUi((s) => s.drawerReadOnly);
  const close = useUi((s) => s.closeDrawer);
  const spoilerOpen = useUi((s) => (key ? !!s.spoilerOpen[key] : false));
  const toggleSpoiler = useUi((s) => s.toggleSpoiler);

  const p = useStore((s) => (key ? s.problems[key] : undefined));
  const {
    setStatus, setMins, setLog, toggleApproach,
    toggleReview, rescheduleReviews, toggleDone, clearItem,
  } = useStore.getState();

  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  /* A centred dialog has to behave like one: the page behind must not scroll,
     and focus has to move in or a keyboard reader is still in the list under it. */
  useEffect(() => {
    if (!key) return;
    document.body.classList.add('dialog-open');
    panel.current?.focus();
    return () => { document.body.classList.remove('dialog-open'); };
  }, [key]);

  if (!key) return null;
  const item = findItem(key);
  if (!item) return null;

  const approach = approachFor(key);
  const derive = deriveFor(key);
  const families = APPROACHES[key] || [];
  const ticked = new Set(p?.approaches || []);
  const reviews = p?.reviews || [];
  const mins = p?.mins || 0;

  return (
    <>
      <div className="drawer-scrim" onClick={close} />
      <aside
        className="drawer book"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        ref={panel}
        tabIndex={-1}
      >
        <div className="drawer-head">
          <div>
            <div className="drawer-eyebrow">{item.group}</div>
            <h2>{item.lc != null ? `LeetCode ${item.lc} · ` : ''}{item.name}</h2>
          </div>
          <button className="btn ghost" onClick={close} aria-label="Close">✕</button>
        </div>

        {/* Two pages, not one column. The left page is what you read BEFORE and
            AFTER attempting; the right is what you write. Keeping them side by
            side means the approach stays visible while you log against it. */}
        <div className="book-spread">

          <section className="book-page" aria-label="Approach">
            <div className="book-lbl">The problem</div>
            {item.note ? <div className="learn">{item.note}</div> : null}

            <StudyLinks item={item} />

            {derive && (
              <>
                <div className="book-lbl">How this section is recognised</div>
                <p className="book-p">{derive}</p>
              </>
            )}

            {families.length > 0 && (
              <>
                <div className="book-lbl">The ladder — blunt to sharp</div>
                <ol className="ladder">
                  {families.map((f) => (
                    <li key={f} className={ticked.has(f) ? 'on' : undefined}>
                      {FAMILY_LABEL[f] || f}
                    </li>
                  ))}
                </ol>
                <p className="dim book-note">
                  Candidate families for this problem, roughest first. Not all of them work
                  here — that is the point. Tick what you actually reached for on the right.
                </p>
              </>
            )}

            {approach && (
              <div className={`appr${spoilerOpen ? ' open' : ''}`}>
                <button className="appr-btn" onClick={() => toggleSpoiler(key)}>
                  {spoilerOpen ? '▾' : '▸'} Optimal approach &amp; cost
                  <span>{spoilerOpen ? 'hide' : 'spoiler — only after you have tried it'}</span>
                </button>
                {spoilerOpen && <div className="appr-body">{approach}</div>}
              </div>
            )}
          </section>

          <section className="book-page" aria-label="Your log">
            {readOnly ? (
              <p className="dim">
                You are viewing someone else&apos;s progress. Their status is shown; their
                approach and root-cause notes are private.
              </p>
            ) : (
              <>
                <div className="book-lbl">Status</div>
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
                <p className="dim book-note">
                  <b>Clean</b> = correct, in time, you could explain every line.{' '}
                  <b>Ugly</b> = correct but slow or guessing. Ugly or failed schedules four
                  blank-file re-solves at +1, +3, +7 and +16 days.
                </p>

                <div className="field">
                  <label htmlFor="dr-mins" className="book-lbl">
                    Time taken <span className="mins-read">{fmtMins(mins)}</span>
                  </label>
                  <input
                    id="dr-mins"
                    className="slider"
                    type="range"
                    min={0}
                    max={MINS_MAX}
                    step={MINS_STEP}
                    value={mins}
                    onChange={(e) => setMins(key, Number(e.target.value))}
                  />
                  <div className="slider-ticks" aria-hidden="true">
                    <span>0</span><span>1h</span><span>2h</span><span>3h</span>
                  </div>
                </div>

                {families.length > 0 ? (
                  <div className="field">
                    <div className="book-lbl">Approaches you tried</div>
                    <div className="apx">
                      {families.map((f) => (
                        <label key={f} className={`apx-row${ticked.has(f) ? ' on' : ''}`}>
                          <input
                            type="checkbox"
                            checked={ticked.has(f)}
                            onChange={() => toggleApproach(key, f)}
                          />
                          <span>{FAMILY_LABEL[f] || f}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Sessions, LLD problems and behavioural slots have no derived
                     approach list, so they keep the sentence box. */
                  <div className="field">
                    <label htmlFor="dr-tech" className="book-lbl">Technique — what actually solved it</label>
                    <textarea
                      id="dr-tech"
                      placeholder="The move that worked, in one line."
                      value={p?.log?.technique || ''}
                      onChange={(e) => setLog(key, 'technique', e.target.value)}
                    />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="dr-mistake" className="book-lbl">
                    Root cause — the mental model that was wrong
                  </label>
                  <textarea
                    id="dr-mistake"
                    placeholder={'Not "I forgot X". What belief produced the bug?'}
                    value={p?.log?.mistake || ''}
                    onChange={(e) => setLog(key, 'mistake', e.target.value)}
                  />
                </div>

                {/* Written before the checkboxes existed. Shown so it is not
                    silently lost, and read-only so it stops growing. */}
                {p?.log?.technique && families.length > 0 && (
                  <div className="field">
                    <div className="book-lbl">Earlier note</div>
                    <p className="legacy-note">{p.log.technique}</p>
                  </div>
                )}
                {p?.log?.trigger && (
                  <div className="field">
                    <div className="book-lbl">Earlier trigger note</div>
                    <p className="legacy-note">{p.log.trigger}</p>
                  </div>
                )}
              </>
            )}

            {reviews.length > 0 && (
              <div className="field">
                <div className="book-lbl">Re-solve schedule</div>
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
          </section>
        </div>

        {!readOnly && (
          <div className="drawer-foot">
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
      </aside>
    </>
  );
}
