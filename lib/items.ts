/* Every checkable item in the sheet, normalised to one shape.

   Ported from legacy/app.js. Derived purely from content/, never from user
   state, so the result is cached for the process lifetime.                   */
import PLAN from '../content';
import type { Item } from './types';

export function dsaItems(): Item[] {
  const out: Item[] = [];
  PLAN.sections.forEach((s: any) => {
    (['b', 'c'] as const).forEach((blk) => {
      s[blk].forEach((q: any, i: number) => {
        out.push({
          key: `ds-${s.id}-${blk}-${i}`, lc: q[0], name: q[1],
          diff: q[2], note: q[3], kind: blk === 'b' ? 'core' : 'hard',
          group: `§${s.n} ${s.name} · block ${blk.toUpperCase()}`,
        });
      });
    });
  });
  return out;
}

export function sdItems(): Item[] {
  return PLAN.sd.map((s: any): Item => ({
    key: `sd-${s.n}`, lc: null, name: `SD ${s.n} — ${s.t}`,
    note: s.design, diff: '',
    /* a session titled "mock" is a mock as well as system design coverage */
    kind: /mock/i.test(s.t) ? 'mock' : 'sd',
    group: `System design · ${s.tier === 'b' ? 'tier 1–2' : 'top tier'}`,
  }));
}

/* LLD problems and the behavioural story slots share a builder because both
   are Sunday work, but they carry DIFFERENT kinds and must never be pooled
   into one readiness bucket. */
export function lldItems(): Item[] {
  const out: Item[] = [];
  PLAN.lldProblems.forEach((p: any) => {
    out.push({
      key: `ld-${p.id}`, lc: null, name: p.name, note: p.who,
      diff: p.flavour, kind: 'lld', group: `LLD · block ${p.tier.toUpperCase()}`,
    });
  });
  PLAN.lp.slots.forEach((s: any, i: number) => {
    out.push({
      key: `lp-story-${i}`, lc: null, name: s[0], note: s[2],
      diff: '', kind: 'lp', group: 'Behavioural story bank',
    });
  });
  return out;
}

export function techItems(): Item[] {
  const out: Item[] = [];
  PLAN.tech.forEach((m: any) => {
    m.qa.forEach((q: any, i: number) => {
      out.push({
        key: `tq-${m.id}-${i}`, lc: null, name: q[0], note: q[2],
        diff: '', kind: 'tech', group: `Tech ${m.n} · ${m.name}`,
      });
    });
    const set = (PLAN.techProblems || {})[m.id];
    if (set) {
      set.groups.forEach((g: any, gi: number) => {
        g[2].forEach((r: any, i: number) => {
          out.push({
            key: `pp-${m.id}-${gi}-${i}`, lc: r[0], name: r[1],
            note: r[3], diff: r[2], kind: 'tech',
            group: `${m.name} practice · ${g[0]}`,
          });
        });
      });
    }
  });
  return out;
}

export function mockItems(): Item[] {
  return (PLAN.mocks || []).map((m: any, i: number): Item => ({
    key: `mk-${i}`, lc: null, name: m.t, note: m.d, diff: '',
    kind: 'mock', group: `Recorded mock · phase ${m.ph}`,
  }));
}

export function packItems(c: any): Item[] {
  return (c.pack || []).map((q: any, i: number): Item => ({
    key: `pk-${c.id}-${i}`, lc: q[0], name: q[1], note: q[3],
    diff: '', kind: 'pack', group: `${c.name} pack`,
  }));
}

export function methodItems(): Item[] {
  const out: Item[] = [];
  ((PLAN.method && PLAN.method.blind && PLAN.method.blind.groups) || [])
    .forEach((g: any, gi: number) => {
      g[2].forEach((p: any, i: number) => {
        out.push({
          key: `bp-${gi}-${i}`, lc: null, name: p, note: '',
          diff: '', kind: 'mock', group: `Blind prompt · ${g[0]}`,
        });
      });
    });
  return out;
}

let _all: Item[] | null = null;

export function allItems(): Item[] {
  if (_all) return _all;
  let out = dsaItems().concat(sdItems(), lldItems(), techItems(), mockItems(), methodItems());
  PLAN.companies.forEach((c: any) => { out = out.concat(packItems(c)); });
  _all = out;
  return out;
}

let _byKey: Map<string, Item> | null = null;

/* legacy/app.js scanned the array linearly on every drawer open; a Map makes
   this O(1) without changing behaviour. */
export function findItem(key: string): Item | null {
  if (!_byKey) {
    _byKey = new Map();
    allItems().forEach((it) => _byKey!.set(it.key, it));
  }
  return _byKey.get(key) || null;
}
