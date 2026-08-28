'use client';

import { useStore } from '@/lib/store';
import { useUi } from '@/lib/ui';
import { dueReviews } from '@/lib/reviews';
import { fmtDate } from '@/lib/calendar';
import ProblemLinks from '@/components/ProblemLinks';

export default function Revision() {
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const toggleReview = useStore((s) => s.toggleReview);
  const openDrawer = useUi((s) => s.openDrawer);

  const due = hydrated ? dueReviews(state) : [];
  const groups: [string, typeof due, string][] = [
    ['Overdue', due.filter((d) => d.delta < 0), 'bad'],
    ['Today', due.filter((d) => d.delta === 0), 'warn'],
    ['Coming up', due.filter((d) => d.delta > 0), ''],
  ];

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>Spaced repetition</h2><span className="spacer" />
          <span className="dim">+1 · +3 · +7 · +16 days</span>
        </div>
        <p className="dim">
          Marking an attempt <b>ugly</b> or <b>failed</b> schedules four blank-file re-solves
          automatically. Three re-solves of one hard problem beats one solve each of three hard
          problems. This is the highest-leverage rule in the plan and it is the one people skip.
        </p>
      </div>

      {!due.length ? (
        <div className="card">
          <p className="dim">
            Nothing due. Either you are on top of it, or you have not rated anything yet — open an
            item and set its status.
          </p>
        </div>
      ) : (
        groups.map(([label, rows, cls]) =>
          rows.length ? (
            <div className="card" key={label}>
              <div className="card-head">
                <h2>{label}</h2><span className="spacer" />
                <span className={`pill ${cls}`}>{rows.length}</span>
              </div>
              {rows.map((r) => (
                <div
                  key={`${r.key}:${r.index}`}
                  className="prow"
                  role="button"
                  tabIndex={0}
                  onClick={() => openDrawer(r.key)}
                  onKeyDown={(e) => { if (e.key === 'Enter') openDrawer(r.key); }}
                >
                  <button
                    className="cb"
                    aria-label={`Mark re-solve of ${r.item.name} done`}
                    onClick={(e) => { e.stopPropagation(); toggleReview(r.key, r.index, true); }}
                  />
                  <ProblemLinks lc={r.item.lc} name={r.item.name} />
                  <span className="p-name">{r.item.name}</span>
                  <span className="p-note">{r.item.group}</span>
                  <span className="p-cap">{fmtDate(r.due)}</span>
                </div>
              ))}
            </div>
          ) : null
        )
      )}
    </>
  );
}
