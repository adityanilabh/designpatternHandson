/* Outbound problem links.

   LeetCode slugs derive from the title; content/dsa.ts `lcSlug` overrides the
   385 rows where derivation would 404 (bundled headings, shortened titles).
   GfG has no problem numbers and its slugs carry an opaque numeric suffix that
   cannot be derived, so those go through search, which always resolves —
   with 113 curated terms where GfG names the problem differently.            */
import PLAN from '../content/dsa';

export function lcUrl(lc: number | null, name: string): string {
  const slug =
    (PLAN.lcSlug && PLAN.lcSlug[lc as number]) ||
    String(name || '').toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  return `https://leetcode.com/problems/${slug}/`;
}

export function gfgUrl(lc: number | null, name: string): string {
  const term = (PLAN.gfgName && PLAN.gfgName[lc as number]) || name || '';
  return `https://www.geeksforgeeks.org/search/?gq=${encodeURIComponent(term)}`;
}

/* The approach and cost for a DSA question, keyed by section and LC number.
   Ported from legacy/app.js. Returns '' for anything that is not a DSA
   question, which is how the drawer decides whether to show the spoiler. */
export function approachFor(key: string): string {
  const m = /^ds-([a-z]+)-[bc]-(\d+)$/.exec(key || '');
  if (!m) return '';
  const sec = PLAN.sections.find((x: any) => x.id === m[1]);
  if (!sec) return '';
  const list = key.includes('-b-') ? sec.b : sec.c;
  const row = list[parseInt(m[2], 10)];
  if (!row) return '';
  const tbl = (PLAN.approach || {})[sec.id] || {};
  return tbl[String(row[0])] || '';
}

/* How this section's problems announce themselves — the "which pattern is this"
   paragraph authored per section in content/dsa.ts. Shown on the left page of
   the item dialog, because recognising the shape is the part that transfers. */
export function deriveFor(key: string): string {
  const m = /^ds-([a-z]+)-[bc]-\d+$/.exec(key || '');
  if (!m) return '';
  return (PLAN.derive || {})[m[1]] || '';
}
