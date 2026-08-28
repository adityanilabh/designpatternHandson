'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { buildWeeks, weekProgress, weekUnlocked, currentWeek, weekByDate, goalDone, WEEKS } from '@/lib/weeks';
import { fmtDate, today } from '@/lib/calendar';
import ProblemLinks from '@/components/ProblemLinks';
import Notes from '@/components/Notes';
import Pager from '@/components/Pager';
import type { Goal } from '@/lib/types';

function GoalRow({ g }: { g: Goal }) {
  const state = useStore();
  const toggleDone = useStore((s) => s.toggleDone);
  const setPattern = useStore((s) => s.setPattern);
  const setTemplate = useStore((s) => s.setTemplate);
  const openDrawer = useUi((s) => s.openDrawer);
  const done = goalDone(state, g);

  const onCheck = () => {
    if (g.type === 'pattern') setPattern(g.key, 'fast');
    else if (g.type === 'template') setTemplate(g.key, 'fast');
    else toggleDone(g.key);
  };

  return (
    <div
      className={`prow${done ? ' done' : ''}`}
      role={g.type === 'problem' ? 'button' : undefined}
      tabIndex={g.type === 'problem' ? 0 : undefined}
      onClick={g.type === 'problem' ? () => openDrawer(g.key) : undefined}
      onKeyDown={g.type === 'problem'
        ? (e) => { if (e.key === 'Enter') openDrawer(g.key); }
        : undefined}
    >
      <button
        className="cb"
        aria-label={`${done ? 'Unmark' : 'Mark'} ${g.label}`}
        aria-pressed={done}
        onClick={(e) => { e.stopPropagation(); onCheck(); }}
      >
        {done ? '✓' : ''}
      </button>
      {g.lc != null && <ProblemLinks lc={g.lc} name={g.name} />}
      <span className="wk-src">{g.group}</span>
      <span className="p-name">{g.label}</span>
      {g.note && <span className="p-note">{g.note}</span>}
    </div>
  );
}

function GoalList({ items, empty }: { items: Goal[]; empty: string }) {
  if (!items.length) return <p className="dim" style={{ padding: '8px 0' }}>{empty}</p>;
  return <>{items.map((g) => <GoalRow key={`${g.type}:${g.key}`} g={g} />)}</>;
}

export default function Weekly({ n }: { n: number }) {
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const unlockWeek = useStore((s) => s.unlockWeek);

  const ws = buildWeeks(state.startDate);
  const wk = ws[n - 1] || ws[0];
  const pr = weekProgress(state, wk);
  const open = !hydrated || weekUnlocked(state, wk.n);
  const byDate = weekByDate(state.startDate, today());
  const cur = currentWeek(state);

  const pager = (
    <Pager
      prev={wk.n > 1 ? { href: `/weekly/${wk.n - 1}`, label: `Week ${wk.n - 1}` } : null}
      next={wk.n < WEEKS ? { href: `/weekly/${wk.n + 1}`, label: `Week ${wk.n + 1}` } : null}
    />
  );

  if (!open) {
    const blocker = wk.n - 1;
    const bp = weekProgress(state, ws[blocker - 1]);
    return (
      <>
        <div className="pane-head">
          <div className="eyebrow">
            Weekly goal · week {wk.n} of {WEEKS} ·{' '}
            <span className={`chip ph${wk.phase}`}>phase {wk.phase}</span>
          </div>
          <h1>Week {wk.n}</h1>
          <div className="wk-locked">
            <b>Locked.</b> Finish <Link href={`/weekly/${blocker}`}><b>week {blocker}</b></Link> first
            — it is at <b>{bp.core}/{bp.coreTotal}</b> core goals. One week at a time, no jumping
            around: that is the point of this page.
            <div className="btnrow" style={{ marginTop: 14 }}>
              <button className="btn warn" onClick={() => unlockWeek(wk.n)}>Unlock anyway</button>
            </div>
            <p className="dim" style={{ marginTop: 10, fontSize: 12.5 }}>
              The override exists so a week you cannot finish never traps you permanently. Use it
              deliberately, not habitually.
            </p>
          </div>
        </div>
        {pager}
      </>
    );
  }

  const cp = pr.coreTotal ? pr.core / pr.coreTotal : 0;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">
          Weekly goal · week {wk.n} of {WEEKS} ·{' '}
          <span className={`chip ph${wk.phase}`}>phase {wk.phase}</span>
        </div>
        <h1>Week {wk.n}</h1>
        <p className="pane-sub">
          Gated by completion, not by the calendar. If you stay on schedule this lands around{' '}
          {fmtDate(wk.from)} – {fmtDate(wk.to)}.
        </p>
        <div className="pane-stats">
          <span><b>{pr.core}</b>/{pr.coreTotal} core</span>
          <span><b>{pr.addon}</b>/{pr.addonTotal} addon</span>
          {pr.complete && <span className="ok-txt"><b>week complete</b></span>}
        </div>
        <div className="co-bar" style={{ marginTop: 14 }}>
          <i style={{ width: cp > 0 ? `${Math.max(0.8, cp * 100).toFixed(1)}%` : '0' }} />
        </div>
        {hydrated && byDate !== wk.n && wk.n === cur && (
          <div className="warnbox" style={{ marginTop: 16 }}>
            By the calendar you are in <b>week {byDate}</b>, but by completion you are on{' '}
            <b>week {wk.n}</b>.{' '}
            {byDate > wk.n
              ? 'You are behind — cut addons before you cut core.'
              : 'You are ahead. Do the addons rather than racing forward.'}
          </div>
        )}
      </div>

      <h2 className="pane-h2">
        Core — required to unlock week {wk.n + 1}{' '}
        <span className="h2-count">{pr.core}/{pr.coreTotal}</span>
      </h2>
      <GoalList items={wk.core} empty="Nothing core this week." />

      <h2 className="pane-h2">
        Addons — optional this week, but they ARE the rest of the sheet{' '}
        <span className="h2-count">{pr.addon}/{pr.addonTotal}</span>
      </h2>
      <p className="pane-p">
        Block C, pattern drills, blind prompts and company packs. Skipping them is a legitimate
        choice under time pressure; finishing all of them is finishing those sections outright.
      </p>
      <GoalList items={wk.addon} empty="No addons this week." />

      {pr.complete && (
        <div className="wk-done">
          <b>Week {wk.n} core is complete.</b>{' '}
          {wk.n < WEEKS ? `Week ${wk.n + 1} is unlocked.` : 'That is the whole plan.'}
        </div>
      )}

      <Notes
        noteKey={`week-${wk.n}`}
        label="What actually happened this week"
        placeholder="What you cut. What to redo. What surprised you."
      />
      {pager}
    </>
  );
}
