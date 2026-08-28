'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore, migrateLegacyState } from '@/lib/store';
import { stats } from '@/lib/score';
import { overdueCount } from '@/lib/reviews';
import { rawDayNumber, currentPhase, fmtPct, barWidth } from '@/lib/calendar';
import PLAN from '@/content/meta';
import StorageModal from './StorageModal';

/* Progress numbers come from localStorage, which the server cannot know. They
   render as placeholders until the store rehydrates, otherwise the server HTML
   and the first client render disagree and React throws a hydration error. */
export default function TopBar() {
  const hydrated = useStore((s) => s.hydrated);
  const theme = useStore((s) => s.ui.theme);
  const setTheme = useStore((s) => s.setTheme);
  const [storageOpen, setStorageOpen] = useState(false);
  const [migrated, setMigrated] = useState(false);

  useEffect(() => {
    if (hydrated && migrateLegacyState()) setMigrated(true);
  }, [hydrated]);

  const state = useStore();
  const s = hydrated ? stats(state) : { total: 0, done: 0 } as ReturnType<typeof stats>;
  const due = hydrated ? overdueCount(state) : 0;
  const day = hydrated ? rawDayNumber(state.startDate) : 0;
  const phase = hydrated ? currentPhase(state.startDate) : PLAN.phases[0];
  const p = s.total ? s.done / s.total : 0;

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="logo">TL</span>
          <div>
            <h1>Target Ladder</h1>
            <p className="sub">154 days · JPM → Amazon → Google</p>
          </div>
        </Link>

        <div className="topmeta">
          <div className="metric">
            <span className="metric-val">
              {!hydrated ? '—' : day < 1 ? '–' : day > PLAN.meta.days ? '✓' : day}
            </span>
            <span className="metric-lbl">day</span>
          </div>
          <div className="metric phase">
            <span className="metric-val">P{phase.n}</span>
            <span className="metric-lbl">phase</span>
          </div>
          <div className="metric">
            <span className="metric-val">{hydrated ? s.done : '—'}</span>
            <span className="metric-lbl">done</span>
          </div>
          <div className="metric warn">
            <span className="metric-val">{hydrated ? due : '—'}</span>
            <span className="metric-lbl">due</span>
          </div>
          <div className="bar-wrap" title="Overall completion">
            <div className="bar"><i style={{ width: hydrated ? barWidth(p) : '0' }} /></div>
            <span className="bar-pct">{hydrated ? fmtPct(p) : '—'}</span>
          </div>
        </div>

        <div className="topactions">
          <button
            className="btn ghost"
            title="Toggle theme"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            ◙
          </button>
          <button className="btn ghost" title="Storage & backup" onClick={() => setStorageOpen(true)}>
            Storage
          </button>
        </div>
      </header>

      {migrated && (
        <div className="warnbox" style={{ margin: '12px 20px 0' }}>
          <b>Your existing progress was imported</b> from the previous tracker. Nothing was
          overwritten — the old copy is still in your browser under its original key.
        </div>
      )}

      {storageOpen && <StorageModal onClose={() => setStorageOpen(false)} />}
    </>
  );
}
