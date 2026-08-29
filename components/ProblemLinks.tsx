'use client';

import { lcUrl, gfgUrl } from '@/lib/links';

/* The two outbound links every problem row carries.

   They used to render as bare coloured text — "LC 1" and "GfG" — which readers
   did not recognise as clickable at all. They are chips now: bordered, named in
   full ("LeetCode 121"), and carrying the ↗ that means "this leaves the page".
   The wrapper is a fixed-width column so the numbers line up down the page and
   every title starts at the same x.

   LeetCode opens the problem directly; GfG has no derivable slug, so it opens a
   search, which always resolves. stopPropagation keeps a link click from also
   opening the drawer behind it. */
export default function ProblemLinks({ lc, name }: { lc: number | null; name: string }) {
  /* concept rows have no problem to link to — hold the column open anyway */
  if (lc == null) {
    return (
      <span className="p-links">
        <span className="lnk-chip none" aria-hidden="true">no link</span>
      </span>
    );
  }

  return (
    <span className="p-links">
      <a
        className="lnk-chip lc"
        href={lcUrl(lc, name)}
        target="_blank"
        rel="noopener noreferrer"
        title={`LeetCode ${lc} — ${name}`}
        aria-label={`Open LeetCode problem ${lc}, ${name}, in a new tab`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="chip-full">LeetCode</span>
        <span className="chip-abbr">LC</span>
        <span className="chip-num">{lc}</span>
        <span className="chip-out" aria-hidden="true">↗</span>
      </a>
      <a
        className="lnk-chip gfg"
        href={gfgUrl(lc, name)}
        target="_blank"
        rel="noopener noreferrer"
        title={`Search GeeksforGeeks for ${name}`}
        aria-label={`Search GeeksforGeeks for ${name}, opens in a new tab`}
        onClick={(e) => e.stopPropagation()}
      >
        GfG
        <span className="chip-out" aria-hidden="true">↗</span>
      </a>
    </span>
  );
}
