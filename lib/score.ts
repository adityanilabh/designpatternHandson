/* Readiness scoring — the number the whole tracker points at.

   Ported from legacy/app.js, with the lp-into-lld double count removed: the
   behavioural story slots belong to the `lp` bucket alone. Pooling them into
   `lld` capped LLD coverage at 13/28 = 46.4% no matter how much you did, and
   silently credited behavioural work as machine coding for the eight companies
   that carry no lp weight at all.                                            */
import PLAN from '../content/meta';
import { allItems, packItems } from './items';
import { problemOf } from './types';
import type { AppState, Item, Kind } from './types';

export type Buckets = Record<Exclude<Kind, 'pack'>, Item[]>;

export function bucketItems(): Buckets {
  const b: Buckets = { core: [], hard: [], tech: [], sd: [], lld: [], lp: [], mock: [] };
  allItems().forEach((it) => {
    if (it.kind === 'pack') return;
    (b as any)[it.kind]?.push(it);
    /* An SD session titled "mock" is both a mock and system design coverage,
       so it counts in each. Nothing else is double-counted. */
    if (it.kind === 'mock' && it.key.startsWith('sd-')) b.sd.push(it);
  });
  return b;
}

/* clean 1.0 · ugly 0.7 · failed 0.4 · done-but-unrated 0.85 */
export function scoreOf(state: AppState, items: Item[]): number {
  if (!items || !items.length) return 0;
  let got = 0;
  items.forEach((x) => {
    const p = problemOf(state, x.key);
    if (!p.done) return;
    got += p.status === 'clean' ? 1
         : p.status === 'ugly' ? 0.7
         : p.status === 'failed' ? 0.4
         : 0.85;
  });
  return got / items.length;
}

/* how many are actually ticked, ignoring quality weighting */
export function doneCountOf(state: AppState, items: Item[]): number {
  if (!items || !items.length) return 0;
  return items.reduce((n, x) => n + (problemOf(state, x.key).done ? 1 : 0), 0);
}

export interface ReadinessPart {
  k: string; w: number; s: number; n: number; done: number;
}

export function readiness(state: AppState, company: any, buckets?: Buckets) {
  const b = buckets || bucketItems();
  const parts: ReadinessPart[] = [];
  let total = 0;
  Object.keys(company.weights).forEach((k) => {
    const items = k === 'pack' ? packItems(company) : ((b as any)[k] || []);
    const s = scoreOf(state, items);
    parts.push({ k, w: company.weights[k], s, n: items.length, done: doneCountOf(state, items) });
    total += company.weights[k] * s;
  });
  parts.sort((a, z) => z.w - a.w);
  return { score: total, parts };
}

export interface Stats {
  total: number; done: number; clean: number; ugly: number;
  failed: number; mins: number; logged: number;
}

/* Company packs are optional, so they are excluded from the headline count -
   otherwise "items done" would never reach its own total. */
export function stats(state: AppState): Stats {
  const s: Stats = { total: 0, done: 0, clean: 0, ugly: 0, failed: 0, mins: 0, logged: 0 };
  allItems().forEach((x) => {
    if (x.kind === 'pack') return;
    s.total++;
    const p = state.problems[x.key];
    if (!p) return;
    if (p.done) s.done++;
    if (p.status === 'clean') s.clean++;
    if (p.status === 'ugly') s.ugly++;
    if (p.status === 'failed') s.failed++;
    s.mins += p.mins || 0;
    if (p.log && (p.log.trigger || p.log.technique || p.log.mistake)) s.logged++;
  });
  return s;
}

export function companies() {
  return PLAN.companies;
}
