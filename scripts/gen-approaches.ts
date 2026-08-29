/* Candidate approach families per DSA problem.

   WHAT THIS IS FOR. The drawer used to ask "TECHNIQUE — what actually solved
   it" as a free text box. Nobody fills in a free text box at 1am after a hard
   problem. Checkboxes get ticked, and a ticked list can be read back later.

   WHERE THE DATA COMES FROM. Nothing here is invented. content/dsa.ts already
   holds, for all 501 questions, an authored optimal approach with its
   complexity (PLAN.approach[section][lc]). These rules match a fixed vocabulary
   of approach families against that text, the problem's note and its name.

   THE RULES ARE EVIDENCE-BASED, NOT GUESSED. The first version of this file was
   guessed, and it had no rule for "Kadane" — so Two Sum, Best Time to Buy and
   Sell Stock and Maximum Subarray all fell through to the section's default
   padding and came out with three identical lists. The vocabulary below was
   extracted from the corpus first by counting which technique words actually
   appear across the 501 texts.

   WHY THE LIST IS NOT SIMPLY THE ANSWER. If the only options were the ones that
   work, the checkboxes would give the problem away before you started. Short
   lists are padded up to four with families that section commonly uses — which
   is also what makes the log worth reading back, because "I tried greedy first"
   is the interesting part.

   Run:  npx tsx scripts/gen-approaches.ts                                     */

import { writeFileSync } from 'node:fs';
import PLAN from '../content/dsa';

const OUT = 'content/approaches.ts';

/* id, label, rank. Rank orders a list blunt-to-sharp; brute force is always 0
   so it always reads first. */
const FAMILIES: [string, string, number][] = [
  ['brute', 'Brute force — enumerate every candidate', 0],
  ['simulate', 'Direct simulation', 1],
  ['sort', 'Sorting first', 2],
  ['hash', 'Hashmap / set', 3],
  ['prefix', 'Prefix or suffix accumulation', 3],
  ['twoptr', 'Two pointers', 4],
  ['fastslow', 'Fast & slow pointers (Floyd)', 4],
  ['window', 'Sliding window', 4],
  ['binsearch', 'Binary search', 4],
  ['inplace', 'In-place / index-as-hashmap', 4],
  ['linkedlist', 'Pointer surgery on the list', 4],
  ['stack', 'Stack', 5],
  ['monotonic', 'Monotonic stack or deque', 5],
  ['heap', 'Heap / priority queue', 5],
  ['interval', 'Sort by start, sweep', 5],
  ['trie', 'Trie', 5],
  ['bits', 'Bit manipulation', 6],
  ['math', 'Maths / number theory', 6],
  ['greedy', 'Greedy with an exchange argument', 6],
  ['dandc', 'Divide and conquer', 6],
  ['bfs', 'BFS / level order', 7],
  ['dfs', 'DFS / recursion', 7],
  ['topo', 'Topological sort', 7],
  ['unionfind', 'Union-Find (DSU)', 7],
  ['segtree', 'Fenwick / segment tree', 7],
  ['backtrack', 'Backtracking with undo', 8],
  ['dp', 'Dynamic programming', 8],
];

const RANK = new Map(FAMILIES.map(([id, , r]) => [id, r]));

/* Named algorithms carry their family with them: "Kadane" is DP wearing a
   greedy coat, "Dutch national flag" is two pointers in place, "Dijkstra" is
   BFS with a heap. Matching the names is what makes these lists specific. */
const RULES: [string, RegExp][] = [
  ['hash', /hash ?map|hashset|hash table|\bmap of\b|\ba set\b|\bset of\b|frequency map|rolling hash|rabin|\bkmp\b/i],
  ['prefix', /prefix|\bsuffix\b|running sum|difference array|cumulative/i],
  ['twoptr', /two pointer|both ends|opposite ends|dutch national flag|manacher|expand around/i],
  ['fastslow', /fast and slow|floyd|tortoise|cycle detection|meeting point/i],
  ['window', /sliding window|\bwindow\b|left edge|shrink the window/i],
  ['binsearch', /binary search|bisect|O\(log|binary lifting/i],
  ['sort', /\bsort\b|\bsorted\b|\bsorting\b|bucket|counting sort|kruskal/i],
  ['stack', /\bstack\b/i],
  ['monotonic', /monotonic|next greater|\bdeque\b|decreasing stack|increasing stack/i],
  ['heap', /\bheap\b|priority queue|quickselect|\btop k\b|dijkstra|\bprim\b/i],
  ['greedy', /greedy|exchange argument|furthest reachable|always take|kadane|voting|boyer/i],
  ['dp', /dynamic programming|\bdp\b|memo|subproblem|state machine|tabulat|kadane|bellman/i],
  ['backtrack', /backtrack|choose.*unchoose|permutation|combination|\bprune\b/i],
  ['bfs', /\bbfs\b|level order|breadth|level by level|dijkstra|kahn/i],
  ['dfs', /\bdfs\b|depth.first|recurs|postorder|preorder|inorder|tarjan|\blca\b|morris/i],
  ['unionfind', /union.find|\bdsu\b|disjoint set|kruskal/i],
  ['bits', /bitmask|\bxor\b|bit manipulation|parity|\bbits\b|\bbit\b/i],
  ['math', /modul|\bgcd\b|overflow|catalan|combinatoric|sieve|closed.form|reservoir|fisher/i],
  ['trie', /\btrie\b|prefix tree/i],
  ['dandc', /divide and conquer|pairwise merge|merge sort|quickselect|meet in the middle/i],
  ['inplace', /in place|in-place|O\(1\) space|negate|cyclic sort|index.as.hashmap|dutch national flag|morris/i],
  ['linkedlist', /dummy head|\bdummy\b|sentinel|reverse the list|linked list|pointer surgery/i],
  ['interval', /interval|\bby start\b|overlap/i],
  ['topo', /topological|kahn|indegree|in-degree/i],
  ['simulate', /simulate|step through|bounce/i],
  ['segtree', /segment tree|fenwick|binary indexed tree/i],
];

/* Families each section reaches for often, used only to pad a short list. */
const SECTION_COMMON: Record<string, string[]> = {
  arr: ['hash', 'prefix', 'inplace', 'greedy'],
  twop: ['twoptr', 'window', 'sort', 'hash'],
  str: ['hash', 'twoptr', 'dp', 'window'],
  hash: ['hash', 'sort', 'heap', 'prefix'],
  bs: ['binsearch', 'sort', 'greedy', 'math'],
  sort: ['sort', 'greedy', 'heap', 'interval'],
  ll: ['linkedlist', 'fastslow', 'twoptr', 'hash'],
  stack: ['stack', 'monotonic', 'simulate', 'dfs'],
  heap: ['heap', 'sort', 'hash', 'dandc'],
  intv: ['interval', 'sort', 'greedy', 'heap'],
  tree: ['dfs', 'bfs', 'backtrack', 'stack'],
  trie: ['trie', 'dfs', 'hash', 'backtrack'],
  graph: ['bfs', 'dfs', 'unionfind', 'topo'],
  bt: ['backtrack', 'dfs', 'bits', 'dp'],
  dp: ['dp', 'backtrack', 'greedy', 'math'],
  greedy: ['greedy', 'sort', 'heap', 'dp'],
  bits: ['bits', 'math', 'hash', 'simulate'],
  design: ['hash', 'linkedlist', 'heap', 'simulate'],
  math: ['math', 'bits', 'simulate', 'binsearch'],
};

function familiesFor(text: string): string[] {
  const out: string[] = [];
  for (const [id, re] of RULES) if (re.test(text)) out.push(id);
  return out;
}

function main() {
  const map: Record<string, string[]> = {};
  const counts = new Map<string, number>();
  const sizes = new Map<number, number>();
  let padded = 0;
  let total = 0;

  for (const s of PLAN.sections) {
    const table = PLAN.approach[s.id] || {};
    const common = SECTION_COMMON[s.id] || ['hash', 'sort', 'dfs', 'greedy'];

    for (const blk of ['b', 'c'] as const) {
      s[blk].forEach((q: [number, string, string, string], i: number) => {
        total++;
        const key = `ds-${s.id}-${blk}-${i}`;
        const [lc, name, , note] = q;
        const authored = (lc != null && table[String(lc)]) || '';
        const matched = familiesFor(`${authored} ${note || ''} ${name}`);

        /* there is always a way to enumerate, so brute force is always offered */
        const picked = new Set<string>(['brute', ...matched]);
        const beforePad = picked.size;

        for (const c of common) {
          if (picked.size >= 4) break;
          picked.add(c);
        }
        if (picked.size > beforePad) padded++;

        const ordered = [...picked].sort(
          (a, b) => (RANK.get(a) ?? 9) - (RANK.get(b) ?? 9) || a.localeCompare(b)
        );
        map[key] = ordered;
        sizes.set(ordered.length, (sizes.get(ordered.length) || 0) + 1);
        for (const f of ordered) counts.set(f, (counts.get(f) || 0) + 1);
      });
    }
  }

  const body = Object.keys(map).sort()
    .map((k) => `  '${k}': [${map[k].map((f) => `'${f}'`).join(', ')}],`)
    .join('\n');

  const fams = FAMILIES
    .map(([id, label, rank]) => `  ['${id}', '${label.replace(/'/g, "\\'")}', ${rank}],`)
    .join('\n');

  writeFileSync(OUT, [
    '/* GENERATED by scripts/gen-approaches.ts — do not hand-edit.',
    '',
    '   The approach checkboxes for every DSA question, derived from the authored',
    '   approach text already in content/dsa.ts. Each list is ordered blunt-to-',
    '   sharp, and short lists are padded to four with the families that section',
    '   commonly uses — so the list records what you TRIED rather than announcing',
    '   what works.',
    '',
    `   ${total} questions, all with a list.  */`,
    '',
    '/* [id, label, rank] — rank orders a list from brute force outwards */',
    'export const FAMILIES: [string, string, number][] = [',
    fams,
    '];',
    '',
    'export const FAMILY_LABEL: Record<string, string> =',
    '  Object.fromEntries(FAMILIES.map(([id, label]) => [id, label]));',
    '',
    'const APPROACHES: Record<string, string[]> = {',
    body,
    '};',
    '',
    'export default APPROACHES;',
    '',
  ].join('\n'));

  const avg = Object.values(map).reduce((n, v) => n + v.length, 0) / Object.keys(map).length;
  console.log(`\n${total} questions, ${Object.keys(map).length} lists`);
  console.log(`average options ${avg.toFixed(1)}   lists needing padding ${padded}`);
  console.log('\nlist sizes:');
  for (const [n, c] of [...sizes].sort((a, b) => a[0] - b[0])) console.log(`  ${n} options  ${c}`);
  console.log('\nfamily usage:');
  for (const [id, n] of [...counts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${id.padEnd(11)} ${String(n).padStart(4)}`);
  }
  console.log(`\nwrote ${OUT}\n`);
}

main();
