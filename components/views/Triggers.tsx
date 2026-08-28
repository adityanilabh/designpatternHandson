'use client';

import { useState } from 'react';

/* Every trigger table in the sheet, in one searchable index: disguise → move,
   across DSA, system design, LLD and tech. */
export default function Triggers({ groups }: { groups: { g: string; rows: any[][] }[] }) {
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();

  const shown = groups
    .map((grp) => ({
      ...grp,
      rows: grp.rows.filter(
        (r) => !needle || `${r[0]} ${r[1]} ${r[2] || ''}`.toLowerCase().includes(needle)
      ),
    }))
    .filter((grp) => grp.rows.length);

  const count = shown.reduce((n, g) => n + g.rows.length, 0);

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">Reference</div>
        <h1>All triggers</h1>
        <p className="pane-sub">Disguise → move, across every track, in one searchable index.</p>
      </div>

      <input
        className="search"
        placeholder='Try "exactly K", "removed over time", "OOMKilled", "celebrity"…'
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search triggers"
      />

      {!count && <p className="dim" style={{ marginTop: 16 }}>No trigger matches that.</p>}

      {shown.map((grp) => (
        <div key={grp.g}>
          <h2 className="pane-h2">{grp.g}</h2>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>You hear / see</th><th>Fire this</th><th>Note</th></tr>
              </thead>
              <tbody>
                {grp.rows.map((r, i) => (
                  <tr key={i}>
                    <td className="trig">{r[0]}</td>
                    <td className="fire">{r[1]}</td>
                    <td className="canon">{r[2] || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
