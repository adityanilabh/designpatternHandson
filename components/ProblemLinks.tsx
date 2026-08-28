'use client';

import { lcUrl, gfgUrl } from '@/lib/links';

/* Every problem row carries two links. LeetCode opens the problem directly;
   GfG has no derivable slug so it opens a search, which always resolves.
   stopPropagation keeps a link click from also opening the drawer. */
export default function ProblemLinks({ lc, name }: { lc: number | null; name: string }) {
  if (lc == null) return <span className="p-lc">—</span>;
  return (
    <>
      <a
        className="p-lc lnk"
        href={lcUrl(lc, name)}
        target="_blank"
        rel="noopener noreferrer"
        title={`Open LC ${lc} on LeetCode`}
        onClick={(e) => e.stopPropagation()}
      >
        LC {lc}
      </a>
      <a
        className="p-gfg lnk"
        href={gfgUrl(lc, name)}
        target="_blank"
        rel="noopener noreferrer"
        title="Search GeeksforGeeks"
        onClick={(e) => e.stopPropagation()}
      >
        GfG
      </a>
    </>
  );
}
