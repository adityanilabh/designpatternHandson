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
