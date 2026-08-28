'use client';

import { useState } from 'react';

export default function HardPool({ pool }: { pool: number[] }) {
  const [picked, setPicked] = useState('');
  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">Reference</div>
        <h1>Blind hard pool</h1>
        <p className="pane-sub">Phase 3. Pick without looking, 45 minutes, recorded.</p>
      </div>
      <p className="mono" style={{ fontSize: 13.5, lineHeight: 2.1, color: 'var(--accent)' }}>
        {pool.map((n) => `LC ${n}`).join('  ·  ')}
      </p>
      <button
        className="btn primary"
        onClick={() => setPicked(`→ LC ${pool[Math.floor(Math.random() * pool.length)]}  ·  45 min  ·  record it`)}
      >
        Pick one at random
      </button>
      {picked && <span className="mono" style={{ marginLeft: 10 }}>{picked}</span>}
    </>
  );
}
