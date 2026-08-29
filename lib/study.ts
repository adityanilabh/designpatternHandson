/* Where to go and read about an item — for EVERY kind of item, not only the
   ones carrying a LeetCode number.

   THREE TIERS, best first:

     1. RESOLVED. content/resources.ts holds a real article URL per tech Q&A
        item, fetched and title-checked by scripts/gen-resources.ts. These are
        the good ones: a named article, not a results page.

     2. CURATED. content/ already holds hand-picked reading for the system
        design sessions (sdRead, all 22 covered) and the tech modules
        (techRead). sdRead is keyed by session so it is already item-specific;
        techRead is keyed by MODULE, so it is filtered down to the rows
        actually about this item — see rowsAbout.

     3. SEARCH. Everything else gets two or three destinations built from the
        item's own title, labelled "search" so nobody is surprised by landing
        on a results page. GfG problem slugs carry an opaque numeric suffix and
        Baeldung's carry an article slug — neither derivable from a title, so a
        hand-built "direct" link would be a 404 wearing a link's clothes.

   NOTHING HERE LINKS INSIDE THE APP. An earlier version offered "All reading
   for <module>", which navigated to the module page — the page the item is
   rendered on. Clicking the item there reopened this drawer, which offered the
   same link: a loop that never reached a resource. Study links go outward.

   Lives apart from lib/links.ts deliberately: that module imports only
   content/dsa so the DSA routes stay code-split, while this one needs the
   whole plan. Only the drawer imports it, and the drawer sits in the root
   layout, which already pulls everything.                                    */
import PLAN from '../content';
import RESOURCES from '../content/resources';
import { lcUrl, gfgUrl } from './links';
import type { Item } from './types';

export interface StudyLink {
  label: string;
  href: string;
  /* 'lc' and 'gfg' get their own colour; 'ref' is everything else */
  tone: 'lc' | 'gfg' | 'ref';
  /* true when the URL lands on a results page rather than the thing itself */
  search?: boolean;
}

/* A named piece of reading — a real article, with a title you can judge before
   you click. */
export interface Reading {
  label: string;
  href: string;
  /* content/ rows may carry a search term instead of a URL */
  search?: boolean;
}

export interface StudyBlock {
  reading: Reading[];
  searches: StudyLink[];
  warning?: string;
}

const web = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const onSite = (host: string, q: string) => web(`site:${host} ${q}`);
const gfgFind = (q: string) => `https://www.geeksforgeeks.org/search/?gq=${encodeURIComponent(q)}`;
const baeldungFind = (q: string) => `https://www.baeldung.com/?s=${encodeURIComponent(q)}`;

/* Titles are written to be read, not to be searched: sessions are prefixed
   ("SD 7 — Design a rate limiter") and tech items are whole questions ("Why is
   String immutable?"). Strip both down to the nouns a site search wants. The
   untouched title still goes to the general web search, which handles a
   natural-language question better than any site search does. */
function topic(name: string): string {
  return String(name || '')
    .replace(/^SD\s+\d+\s*[—–-]\s*/i, '')
    .replace(/\s*\[[^\]]*\]\s*$/, '')
    .replace(/\?+\s*$/, '')
    .replace(/^(why|what|how|when|where|which)\s+(is|are|do|does|did|can|could|would|should|will)\s+/i, '')
    .replace(/^(why|what|how|when|where|which)\s+/i, '')
    .replace(/^(a|an|the)\s+/i, '')
    .trim();
}

/* Kind is too coarse: sdItems() files anything titled "mock" under 'mock', and
   methodItems() files blind prompts there too, so three unrelated things share
   one kind. The key prefix is the thing that is actually exact. */
function family(item: Item): string {
  const k = item.key;
  if (k.startsWith('tq-')) return 'tech';
  if (k.startsWith('sd-')) return 'sd';
  if (k.startsWith('ld-')) return 'lld';
  if (k.startsWith('lp-story-')) return 'lp';
  if (k.startsWith('bp-')) return 'blind';
  if (k.startsWith('mk-')) return 'mock';
  return item.kind;
}

/* ------------------------------------------------------------- searches -- */

function searchesFor(item: Item): StudyLink[] {
  const t = topic(item.name);

  /* A LeetCode number means a coding problem whatever bucket it sits in — the
     tech practice rows carry one too. */
  if (item.lc != null) {
    return [
      { label: `LeetCode ${item.lc}`, href: lcUrl(item.lc, item.name), tone: 'lc' },
      { label: 'GeeksforGeeks', href: gfgUrl(item.lc, item.name), tone: 'gfg', search: true },
      { label: 'NeetCode', href: onSite('neetcode.io', t), tone: 'ref', search: true },
    ];
  }

  switch (family(item)) {
    case 'tech':
      return [
        { label: 'GeeksforGeeks', href: gfgFind(`${t} java`), tone: 'gfg', search: true },
        { label: 'Baeldung', href: baeldungFind(t), tone: 'ref', search: true },
        { label: 'Web', href: web(`java ${item.name} interview`), tone: 'ref', search: true },
      ];

    case 'sd':
      return [
        { label: 'GeeksforGeeks', href: gfgFind(`${t} system design`), tone: 'gfg', search: true },
        { label: 'Web', href: web(`${t} system design interview`), tone: 'ref', search: true },
      ];

    case 'lld':
      return [
        { label: 'GeeksforGeeks', href: gfgFind(`${t} low level design`), tone: 'gfg', search: true },
        { label: 'Refactoring Guru', href: onSite('refactoring.guru', t), tone: 'ref', search: true },
        { label: 'Web', href: web(`${t} low level design java interview`), tone: 'ref', search: true },
      ];

    case 'lp':
      return [
        { label: 'Amazon leadership principles',
          href: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', tone: 'ref' },
        { label: 'Web', href: web(`"${item.name}" behavioural interview STAR answer`), tone: 'ref', search: true },
      ];

    /* A recorded mock is something you RUN. Searching its title returns
       nothing, so it gets the general reading instead — see readingFor. */
    case 'mock':
      return [];

    case 'blind':
      return [{ label: 'Web — after you have tried it', href: web(t), tone: 'ref', search: true }];

    default:
      return [{ label: 'Web', href: web(t), tone: 'ref', search: true }];
  }
}

/* -------------------------------------------------------------- reading -- */

type ReadRow = [string, string, number];   /* [label, url or term, isDirectUrl] */

/* Words that turn up across half the sheet and so say nothing about whether a
   given row is about a given item. Publisher names are in here too: matching
   "GfG — HashMap internal working" to a String question on the word "gfg" is
   exactly the false positive this list exists to stop. */
const NOISE = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'your', 'you', 'how', 'why', 'what', 'when',
  'versus', 'use', 'using', 'guide', 'tutorial', 'introduction', 'intro', 'overview',
  'explained', 'reference', 'docs', 'doc', 'api', 'part', 'more', 'about', 'its',
  'java', 'gfg', 'geeksforgeeks', 'baeldung', 'oracle', 'google', 'book', 'reading',
  'code', 'codes', 'data', 'value', 'values', 'object', 'objects',
  'system', 'application', 'app', 'new', 'best', 'practice',
]);

/* Crude singular-ing so "internals" matches "internal". It mangles a few words
   ("class" -> "clas"), which is harmless: both sides are stemmed the same way,
   so they still meet. */
function stem(w: string): string {
  return w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w;
}

function terms(s: string, alsoNoise?: Set<string>): Set<string> {
  return new Set(
    String(s || '')
      .replace(/^https?:\/\/[^/]+\//, ' ')   /* keep a URL's slug, drop its host */
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !NOISE.has(w))
      .map(stem)
      .filter((w) => !alsoNoise || !alsoNoise.has(w))
  );
}

/* A curated row earns its place only if it is about THIS item. The tech lists
   are per-MODULE — fifteen unrelated questions share one list — so rendering
   them unfiltered put "GfG — HashMap internal working" under "Why is String
   immutable?". Nothing is better than something wrong. */
function rowsAbout(item: Item, rows: ReadRow[], context: string): ReadRow[] {
  /* The module's own name is shared by every item AND every row in its list, so
     it cannot tell them apart — "Garbage collection" was matching "Baeldung —
     Java collections" purely on the module word "collections". Demote it. */
  const shared = terms(context);
  const want = terms(item.name, shared);
  if (!want.size) return [];
  return rows.filter((r) => {
    const has = terms(`${r[0]} ${r[2] ? r[1] : ''}`, shared);
    for (const w of want) if (has.has(w)) return true;
    return false;
  });
}

const toReading = (r: ReadRow): Reading =>
  ({ label: r[0], href: r[2] ? r[1] : web(r[1]), search: !r[2] });

function readingFor(item: Item): Reading[] {
  const out: Reading[] = [];
  const seen = new Set<string>();
  const add = (r: Reading) => { if (!seen.has(r.href)) { seen.add(r.href); out.push(r); } };

  /* tier 1 — resolved and checked, with the article's own title */
  for (const [publisher, href, title] of (RESOURCES[item.key] || [])) {
    add({ label: `${publisher} — ${title}`, href });
  }

  /* tier 2 — curated */
  const tech = /^(?:tq|pp)-([a-z0-9]+)-/.exec(item.key);
  if (tech) {
    const mod = (PLAN.tech as { id: string; name: string }[] | undefined || [])
      .find((m) => m.id === tech[1]);
    const all: ReadRow[] = (PLAN.techRead || {})[tech[1]] || [];
    rowsAbout(item, all, mod ? mod.name : '').forEach((r) => add(toReading(r)));
  }

  /* sdRead is keyed by SESSION, so its rows are already about this exact item —
     no filtering, and none wanted. */
  const sd = /^sd-(\d+)$/.exec(item.key);
  if (sd) {
    ((PLAN.sdRead || {})[Number(sd[1])] || []).forEach((r: ReadRow) => add(toReading(r)));
  }

  /* A mock has no topic of its own; the general syllabus is the useful thing
     to have open while you run one. */
  if (item.key.startsWith('mk-')) {
    ((PLAN.readGeneral || []) as ReadRow[]).forEach((r) => add(toReading(r)));
  }

  return out;
}

/* ----------------------------------------------------------------- api -- */

const BLIND_WARNING =
  'These prompts have no solutions by design. Run the full 45 minutes first — ' +
  'looking anything up before that is the one way to waste the exercise.';

export function studyFor(item: Item): StudyBlock {
  return {
    reading: readingFor(item),
    searches: searchesFor(item),
    warning: item.key.startsWith('bp-') ? BLIND_WARNING : undefined,
  };
}
