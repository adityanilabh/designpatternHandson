'use client';

import { studyFor } from '@/lib/study';
import type { Item } from '@/lib/types';

/* The drawer's "where do I go and read about this" block.

   Named articles first, then searches — in that order because they are not the
   same offer. A titled article tells you what you get before you click; a
   search only promises a results page, and says so on the chip.

   Every link here leaves the app. Nothing points at another page of the sheet:
   an earlier version linked to the module page, which is the page the item is
   rendered on, so clicking through and clicking the item reopened this drawer
   in a loop. */
export default function StudyLinks({ item }: { item: Item }) {
  const { reading, searches, warning } = studyFor(item);
  if (!reading.length && !searches.length && !warning) return null;

  return (
    <div className="study">
      <div className="study-lbl">Study</div>

      {warning && <p className="study-warn">{warning}</p>}

      {reading.length > 0 && (
        <ul className="readlist tight">
          {reading.map((r) => (
            <li key={r.href}>
              <a className="lnk" href={r.href} target="_blank" rel="noopener noreferrer">
                {r.label}
              </a>
              {r.search && <span className="read-find">search</span>}
            </li>
          ))}
        </ul>
      )}

      {searches.length > 0 && (
        <div className="study-row">
          {searches.map((l) => (
            <a
              key={l.href}
              className={`lnk-chip ${l.tone}`}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              title={l.search ? `Search ${l.label} for ${item.name}` : `${l.label} — ${item.name}`}
              aria-label={`${l.search ? 'Search ' : 'Open '}${l.label} for ${item.name}, opens in a new tab`}
            >
              {l.label}
              {l.search && <span className="chip-find" aria-hidden="true">search</span>}
              <span className="chip-out" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
