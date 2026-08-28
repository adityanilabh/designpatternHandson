'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { BulletList } from '@/components/content';

/* No solutions, deliberately — solutions would turn this back into a list of
   named problems, which is exactly what the section exists to escape. */
export default function BlindPrompts({ blind }: { blind: any }) {
  const hydrated = useStore((s) => s.hydrated);
  const problems = useStore((s) => s.problems);
  const toggleDone = useStore((s) => s.toggleDone);
  const openDrawer = useUi((s) => s.openDrawer);
  const [picked, setPicked] = useState('');

  const total = blind.groups.reduce((n: number, g: any) => n + g[2].length, 0);

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">The Method</div>
        <h1>Blind prompt bank</h1>
        <p className="pane-sub">
          {total} prompts, no solutions — deliberately. Solutions would turn this back into a list
          of named problems.
        </p>
      </div>

      <h2 className="pane-h2">How to work them</h2>
      <BulletList items={blind.rules} />

      {blind.groups.map((g: any, gi: number) => (
        <div key={gi}>
          <h2 className="pane-h2">
            {g[0]} <span className="h2-count">{g[2].length}</span>
          </h2>
          <p className="pane-p">{g[1]}</p>
          {g[2].map((p: string, i: number) => {
            const key = `bp-${gi}-${i}`;
            const st = hydrated ? problems[key] : undefined;
            return (
              <div
                key={key}
                className={`prow${st?.done ? ' done' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => openDrawer(key)}
                onKeyDown={(e) => { if (e.key === 'Enter') openDrawer(key); }}
              >
                <button
                  className="cb"
                  aria-label={`${st?.done ? 'Unmark' : 'Mark'} prompt done`}
                  aria-pressed={!!st?.done}
                  onClick={(e) => { e.stopPropagation(); toggleDone(key); }}
                >
                  {st?.done ? '✓' : ''}
                </button>
                <span className="p-name">{p}</span>
                <span className={`dot ${st?.status || ''}`} />
              </div>
            );
          })}
        </div>
      ))}

      <button
        className="btn primary"
        style={{ marginTop: 24 }}
        onClick={() => {
          const all: string[] = blind.groups.flatMap((g: any) => g[2]);
          setPicked(all[Math.floor(Math.random() * all.length)]);
        }}
      >
        Pick one at random
      </button>
      {picked && <span className="mono" style={{ marginLeft: 10 }}>→ {picked}</span>}
    </>
  );
}
