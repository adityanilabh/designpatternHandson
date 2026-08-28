'use client';

import { useStore } from '@/lib/store';
import { stats } from '@/lib/score';
import { dueReviews } from '@/lib/reviews';
import {
  rawDayNumber, currentPhase, phaseRange, fmtDate, dayOfWeek, DAYS, barWidth, pct,
} from '@/lib/calendar';

interface Props {
  phases: any[]; split: any[]; calendar: any[]; criteria: any[];
  rules: string[]; days: number;
}

function Stat({ v, l, cls }: { v: React.ReactNode; l: string; cls?: string }) {
  return (
    <div className={`stat ${cls || ''}`}>
      <span className="stat-v">{v}</span>
      <span className="stat-l">{l}</span>
    </div>
  );
}

export default function Dashboard({ phases, split, calendar, criteria, rules, days }: Props) {
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const setStartDate = useStore((s) => s.setStartDate);
  const toggleOpen = useStore((s) => s.toggleOpen);
  const open = useStore((s) => s.ui.open);

  const s = stats(state);
  const due = dueReviews(state);
  const overdue = due.filter((d) => d.delta <= 0).length;
  const d = rawDayNumber(state.startDate);
  const ph = currentPhase(state.startDate);
  const started = d >= 1 && d <= days;
  const [from, to] = phaseRange(ph);
  const prog = Math.max(0, Math.min(1, (d - from + 1) / (to - from + 1)));
  const startDow = dayOfWeek(state.startDate);

  return (
    <>
      {hydrated && startDow !== 1 && (
        <div className="warnbox">
          <b>Your start date is a {DAYS[startDow]}.</b> This plan assumes <b>Day 1 = Monday</b> —
          Mon–Fri DSA + tech, Saturday system design, Sunday LLD. Change it below, or the weekend
          tracks land on weekdays.
        </div>
      )}

      <div className="card phase-card">
        <div className="card-head">
          <h2>Phase {ph.n} · {ph.name}</h2>
          <span className="spacer" />
          <span className={`chip tier${ph.n}`}>{ph.rung}</span>
        </div>
        <div className="phase-meta">
          {!hydrated ? <b>—</b>
            : started ? <><b>Day {d}</b> of {days}</>
            : d < 1 ? <b>Starts in {1 - d} days</b>
            : <b>Plan complete</b>}
          {' · '}days {ph.days} · {fmtDate(ph.from)} → {fmtDate(ph.to)}
        </div>
        <div className="learn"><b>The bar.</b> {ph.bar}</div>
        <div className="exit"><b>What you work now.</b> {ph.work}</div>
        <div className="co-bar" style={{ marginTop: 14 }}>
          <i style={{ width: hydrated ? barWidth(prog) : '0' }} />
        </div>
        <p className="dim" style={{ marginTop: 6, fontSize: 12.5 }}>
          Phase {hydrated ? pct(prog) : 0}% elapsed
        </p>
      </div>

      <div className="card">
        <div className="card-head"><h2>Where you are</h2></div>
        <div className="statrow">
          <Stat v={<>{s.done}<span className="of">/{s.total}</span></>} l="items done" />
          <Stat v={s.clean} l="clean" cls="ok" />
          <Stat v={s.ugly} l="ugly" cls="warn" />
          <Stat v={s.failed} l="failed" cls="bad" />
          <Stat v={overdue} l="due now" cls={overdue ? 'bad' : ''} />
          <Stat v={`${Math.round(s.mins / 60)}h`} l="logged time" />
          <Stat v={s.logged} l="log entries" />
        </div>
        <div className="co-bar" style={{ marginTop: 16 }}>
          <i style={{ width: hydrated ? barWidth(s.done / (s.total || 1)) : '0' }} />
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>The 43 / 57 split</h2><span className="spacer" />
          <span className="dim">~506 hours over 22 weeks</span>
        </div>
        <p className="dim" style={{ marginBottom: 12 }}>
          Going from 65% DSA to 43% did not cut your DSA hours — it raised them from 195 to 220.
          The percentage fell because the denominator grew.
        </p>
        {split.map((r: any) => (
          <div className="co-part" key={r[0]}>
            <span className="co-part-lbl">{r[0]}</span>
            <span className="co-part-w">{r[1]}h</span>
            <span className="co-part-bar"><i style={{ width: `${r[2] * 1.9}%` }} /></span>
            <span className="co-part-n">{r[2]}%</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Interview calendar</h2><span className="spacer" />
          <span className="dim">applying is work, and it is on the clock</span>
        </div>
        <p className="dim" style={{ marginBottom: 12 }}>
          The Google application goes out in <b>week 13</b>, not week 22. Their pipeline is 8–12
          weeks — it is longer than the preparation.
        </p>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Week</th><th>Days</th><th>Action</th></tr></thead>
            <tbody>
              {calendar.map((r: any, i: number) => (
                <tr key={i} className={r[3] ? 'hot' : ''}>
                  <td className="canon">{r[0]}</td>
                  <td className="canon">{r[1]}</td>
                  <td className={r[3] ? 'fire' : 'trig'}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Phase {ph.n} exit criteria</h2><span className="spacer" />
          <span className="dim">six of seven is the pass bar</span>
        </div>
        {criteria.filter((c: any) => c.ph === ph.n).map((c: any, i: number) => {
          const id = `crit-${ph.n}-${i}`;
          const on = !!open[id];
          return (
            <div className="tpl" key={id}>
              <span className="tpl-n">{i + 1}</span>
              <div className="tpl-body"><b>{c.t}</b><span>{c.d}</span></div>
              <div className="tpl-actions">
                <button className={`btn sm ok${on ? ' on' : ''}`} onClick={() => toggleOpen(id)}>
                  {on ? '✓ hit' : 'mark hit'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head"><h2>Non-negotiable process</h2></div>
        <ol className="rules">{rules.map((r, i) => <li key={i}>{r}</li>)}</ol>
      </div>

      <div className="card">
        <div className="card-head"><h2>Start date</h2></div>
        <p className="dim">Day 1 must be a <b>Monday</b>.</p>
        <input
          type="date"
          className="search"
          style={{ maxWidth: 220 }}
          value={state.startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
    </>
  );
}
