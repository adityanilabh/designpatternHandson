/* Resolve a REAL, DIRECT article URL for each tech Q&A item.

   WHY THIS EXISTS. The 197 tech questions were the one family with nowhere to
   go: no LeetCode number, and — unlike the system design sessions, which all
   22 carry curated reading in content/sd.ts — no hand-picked links either. They
   got search URLs, and a search results page is not a resource.

   WHY NOT JUST GUESS THE SLUG. geeksforgeeks.org/why-string-is-immutable/ looks
   entirely plausible and 404s. Nothing here is constructed: every URL is one a
   source handed back for a published article of its own.

   THE SOURCE is Baeldung's standard WordPress REST index at
   /wp-json/wp/v2/search — a public, documented API returning title + url, no
   scraping and no key. It is the only one used, and the reason is domain
   scope: everything Baeldung publishes is about software, so a title match is
   automatically a match in the right field.

   WIKIPEDIA WAS TRIED AND REMOVED. Its opensearch API matched titles perfectly
   and subjects terribly: "Circuit breaker" resolved to the electrical switch,
   "Bulkhead" to the ship partition, "Idempotency" to a rule in proof theory,
   "Outbox" to the email folder, "Text blocks" to bookbinding. A summary-extract
   domain gate caught most but still passed "Auto-configuration" (network
   devices) for a Spring Boot question. A source that needs a filter this
   unreliable is costing more than it adds.

   DUCKDUCKGO WAS TRIED FIRST and now answers 202 with an anti-bot page; a
   source that has to be tricked is not a source.

   THE ACCEPTANCE RULE is deliberately strict: EVERY significant word of the
   question must appear in the article's title. At anything looser, "HashMap
   internals" matched "Select a Random Key from a HashMap in Java" — a real URL
   about the wrong thing, which is worse than no link, because the reader only
   finds out after the click. Items that fail keep their labelled search chips.

       npx tsx scripts/gen-resources.ts              resolve anything uncached
       npx tsx scripts/gen-resources.ts --force      re-resolve everything
       npx tsx scripts/gen-resources.ts --emit-only  rewrite output, no network

   Progress is checkpointed to scripts/.resources-cache.json after every item,
   so an interrupted run resumes instead of starting over.                    */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { allItems } from '../lib/items';
import type { Item } from '../lib/types';

const CACHE = 'scripts/.resources-cache.json';
const OUT = 'content/resources.ts';
const FORCE = process.argv.includes('--force');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TargetLadder-linkcheck/1.0';

/* Words that carry no signal about what an article is about. Baeldung's own
   title furniture ("Guide to", "Quick", "Introduction") is in here, and so is
   "java", which appears in most of their titles and all of these questions. */
const NOISE = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'your', 'you', 'how', 'why', 'what', 'when',
  'versus', 'use', 'used', 'using', 'guide', 'tutorial', 'intro', 'introduction', 'overview',
  'explained', 'difference', 'between', 'quick', 'weekly', 'issue', 'part', 'about', 'its',
  'java', 'baeldung', 'wikipedia', 'article', 'series', 'example', 'examples', 'work', 'works',
]);

/* WordPress hands back HTML-escaped titles; they are going straight into the
   UI, so unescape the handful of entities that actually turn up. */
function clean(t: string): string {
  return String(t || '')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8216;|&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, '’')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#?\w+;/g, '')
    .trim();
}

const stem = (w: string) => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w);

function terms(s: string): string[] {
  return [...new Set(
    String(s || '')
      .replace(/&#?\w+;/g, ' ')            /* titles arrive HTML-escaped */
      .toLowerCase()
      .split(/[^a-z0-9+]+/)
      .filter((w) => w.length > 2 && !NOISE.has(w))
      .map(stem)
  )];
}

/* Every word of the question must be in the title. One matched word is enough
   only when it is long enough to be a real subject ("testcontainers", not
   "pool") — a single short word matches half the index by accident. */
function accepts(want: string[], title: string): boolean {
  if (!want.length) return false;
  const has = terms(title);
  const hit = want.filter((w) => has.includes(w));
  if (hit.length !== want.length) return false;
  return hit.length >= 2 || hit[0].length >= 6;
}

/* The words that disambiguate a module's questions. "Consumer groups" alone is
   meaningless; "consumer groups kafka" is not. */
const MODULE_TERMS: Record<string, string> = {
  java: 'java', modern: 'java', conc: 'java concurrency', spring: 'spring',
  boot: 'spring boot', events: 'spring events', jpa: 'hibernate jpa',
  pg: 'postgresql', api: 'rest api', kafka: 'kafka', micro: 'microservices',
  k8s: 'kubernetes', obs: 'testing',
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* [publisher, url, article title] — the title is the point: "Baeldung" says
   nothing about where you are going, "Why String Is Immutable in Java?" does. */
type Hit = [string, string, string];

async function baeldung(want: string[], modTerm: string): Promise<Hit | null> {
  /* Two attempts: with the module word for disambiguation, then without it —
     WordPress search narrows on every extra term, so the shorter query is the
     one that finds a well-named article. */
  for (const q of [[...want.slice(0, 3), modTerm].join(' '), want.slice(0, 3).join(' ')]) {
    try {
      const res = await fetch(
        `https://www.baeldung.com/wp-json/wp/v2/search?per_page=10&search=${encodeURIComponent(q)}`,
        { headers: { 'User-Agent': UA } });
      if (res.ok) {
        for (const r of (await res.json()) as { title: string; url: string }[]) {
          if (r && r.url && accepts(want, r.title)) return ['Baeldung', r.url, clean(r.title)];
        }
      }
    } catch { /* a source being down is not a reason to abort the run */ }
    await sleep(700);
  }
  return null;
}

function targets(): { it: Item; want: string[]; mod: string }[] {
  const out: { it: Item; want: string[]; mod: string }[] = [];
  for (const it of allItems()) {
    const m = /^tq-([a-z0-9]+)-/.exec(it.key);
    if (!m) continue;                       /* SD is curated; LLD has no canon */
    const want = terms(it.name);
    if (want.length) out.push({ it, want, mod: MODULE_TERMS[m[1]] || 'java' });
  }
  return out;
}

/* the output is a TypeScript literal, so a backslash or apostrophe in a title
   ("Java’s memory model") has to survive being written back out as source */
const esc = (s: string) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

function emit(cache: Record<string, Hit[]>) {
  const keys = Object.keys(cache).filter((k) => cache[k] && cache[k].length).sort();
  const body = keys
    .map((k) => `  '${k}': [\n${cache[k]
      .map(([l, u, t]) => `    ['${esc(l)}', '${esc(u)}', '${esc(t)}'],`)
      .join('\n')}\n  ],`)
    .join('\n');

  writeFileSync(OUT, [
    '/* GENERATED by scripts/gen-resources.ts — do not hand-edit.',
    '',
    '   A real article URL per tech Q&A item, for the one family that had',
    '   nowhere to send you: no LeetCode number and no curated reading. Each URL',
    '   was handed back by its own publisher\'s index for a published article, and',
    '   every significant word of the question appears in the article title.',
    '   Baeldung answers 403 to a crawler on every path, so these rest on the',
    '   index rather than on a liveness check. Links rot — re-run the script',
    '   rather than trusting this file forever.',
    '',
    '   Items absent from this map fall back to a labelled search in lib/study.ts,',
    '   which is honest about being a search.',
    '',
    `   ${keys.length} of ${Object.keys(cache).length} attempted items resolved.  */`,
    '',
    'const RESOURCES: Record<string, [string, string, string][]> = {',
    body,
    '};',
    '',
    'export default RESOURCES;',
    '',
  ].join('\n'));
  console.log(`\nwrote ${OUT} — ${keys.length} items with a real article link`);
}

async function main() {
  const cache: Record<string, Hit[]> = existsSync(CACHE)
    ? JSON.parse(readFileSync(CACHE, 'utf8'))
    : {};

  const todo = targets().filter((t) => FORCE || !(t.it.key in cache));
  console.log(`${todo.length} tech questions to resolve (${Object.keys(cache).length} cached)\n`);

  let n = 0, found = 0;
  for (const { it, want, mod } of todo) {
    n++;
    /* No liveness fetch: Baeldung answers 403 to this crawler on every path,
       real or invented, so the request could only ever prove the host is up.
       What backs these URLs is that the index only lists published posts. */
    const b = await baeldung(want, mod);
    const hits: Hit[] = b ? [b] : [];

    cache[it.key] = hits;
    if (hits.length) found++;
    console.log(`[${n}/${todo.length}] ${it.key.padEnd(16)} ${hits.length ? hits.map((h) => h[0]).join(' + ') : '—'}  ${it.name}`);
    writeFileSync(CACHE, JSON.stringify(cache, null, 1));
    await sleep(700);
  }

  console.log(`\n${found}/${n} resolved this run`);
  emit(cache);
}

if (process.argv.includes('--emit-only')) {
  emit(JSON.parse(readFileSync(CACHE, 'utf8')));
} else {
  main();
}
