'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { buildWeeks, weekProgress, weekUnlocked, WEEKS } from '@/lib/weeks';

/* Weeks are labelled by number, not by date — the plan is gated by completion,
   so a date label would lie the moment you fall behind. A locked week still
   appears, so you can see what is coming and use the override deliberately. */
export default function WeeklyNav() {
  const pathname = usePathname();
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const ws = buildWeeks(state.startDate);

  const groups: [string, typeof ws][] = [
    ['Phase 1 · foundation', ws.filter((w) => w.phase === 1)],
    ['Phase 2 · product tier', ws.filter((w) => w.phase === 2)],
    ['Phase 3 · Google tier', ws.filter((w) => w.phase === 3)],
  ];

  return (
    <aside className="sidenav">
      {groups.map(([label, weeks]) => (
        <div key={label} className="nav-sect">
          <div className="nav-group">{label}</div>
          {weeks.map((w) => {
            const pr = weekProgress(state, w);
            const locked = hydrated && !weekUnlocked(state, w.n);
            const on = pathname === `/weekly/${w.n}`;
            return (
              <Link
                key={w.n}
                href={`/weekly/${w.n}`}
                className={`nav-item${on ? ' on' : ''}${locked ? ' locked' : ''}`}
                aria-current={on ? 'page' : undefined}
              >
                <span className="nav-n">{locked ? '🔒' : w.n}</span>
                <span className="nav-lbl">
                  Week {w.n}
                  <span>
                    {locked ? 'locked' : `${pr.core}/${pr.coreTotal} core`}
                    {pr.complete ? ' · done' : ''}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ))}
      <p className="dim" style={{ padding: '10px 16px', fontSize: 11.5, lineHeight: 1.6 }}>
        {WEEKS} weeks partition the whole sheet — every item appears in exactly one.
      </p>
    </aside>
  );
}
