/* Parity check: does lib/ compute exactly what legacy/app.js computed?

   The React rewrite is only safe if the logic port was faithful. This boots
   the real legacy/app.js in a DOM stub, exposes its internals, and compares
   them against lib/ for the same state — item lists, bucket sizes, the week
   partition, gating, readiness per company, and the re-solve scheduler.

   Run:  npx tsx scripts/verify-lib.ts                                        */
// @ts-nocheck
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

import { allItems as libAllItems } from '../lib/items';
import { bucketItems as libBuckets, readiness as libReadiness, stats as libStats } from '../lib/score';
import { buildWeeks as libWeeks, weekUnlocked as libUnlocked, currentWeek as libCurrentWeek } from '../lib/weeks';
import { scheduleReviews as libSchedule, dueReviews as libDue } from '../lib/reviews';
import { blankState } from '../lib/types';
import PLAN from '../content';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const START = '2026-08-31';

/* ---------- boot legacy/app.js in a stub DOM ---------- */
function bootLegacy(problems: any = {}, patterns: any = {}, templates: any = {}, unlocked: any = {}) {
  function El(this: any, id: string) {
    this.id = id; this.innerHTML = ''; this.hidden = false; this.style = {};
    this.textContent = ''; this.scrollTop = 0; this._c = {};
    const s = this;
    this.classList = {
      toggle: (c: string, o: boolean) => { s._c[c] = !!o; },
      add: (c: string) => { s._c[c] = true; },
      remove: (c: string) => { s._c[c] = false; },
      contains: (c: string) => !!s._c[c],
    };
  }
  (El.prototype as any).closest = () => null;
  (El.prototype as any).getAttribute = () => null;

  const els: any = {};
  const ids = ['toast', 'm-day', 'm-phase', 'm-done', 'm-due', 'm-bar', 'm-pct', 'tab-due',
    'drawer', 'scrim', 'dr-body', 'dr-eyebrow', 'dr-title', 'modal-scrim', 'st-body',
    'startdate', 'nav-search', 'ref-search', 'sd-search', 'pick-random', 'picked', 'sidenav', 'pane'];
  ids.forEach((i) => { els[i] = new (El as any)(i); });
  ['dashboard', 'weekly', 'method', 'dsa', 'sd', 'lld', 'tech', 'lp', 'revision',
   'companies', 'reference', 'log', 'strategy'].forEach((v) => {
    els['view-' + v] = new (El as any)('view-' + v);
  });

  const store: any = {
    'targetladder.state.v2': JSON.stringify({
      v: 2, startDate: START, problems, patterns, templates, notes: {}, unlocked,
      ui: { open: {}, sel: {}, navQuery: '', refQuery: '', tab: 'dashboard', theme: 'dark' },
    }),
  };

  const ctx: any = {
    console,
    document: {
      body: new (El as any)('body'),
      querySelector: (s: string) => (s[0] === '#' ? els[s.slice(1)] || null : null),
      querySelectorAll: () => [],
      addEventListener: () => {},
      documentElement: { setAttribute: () => {} },
      createElement: () => ({ click: () => {}, style: {} }),
    },
    window: { showSaveFilePicker: undefined, scrollTo: () => {} },
    localStorage: {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
    },
    indexedDB: {
      open: () => {
        const r: any = {
          result: {
            transaction: () => ({
              objectStore: () => ({
                get: () => { const q: any = {}; setTimeout(() => q.onsuccess && q.onsuccess(), 0); return q; },
                put: () => {},
              }),
              oncomplete: null,
            }),
          },
        };
        setTimeout(() => r.onsuccess && r.onsuccess(), 0);
        return r;
      },
    },
    Blob: function () {}, URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
    FileReader: function () {}, confirm: () => false,
    setTimeout, clearTimeout, Promise, Math, JSON, Date, String, Number, Object, Array,
  };
  vm.createContext(ctx);

  vm.runInContext(fs.readFileSync(path.join(ROOT, 'legacy', 'data.js'), 'utf8'), ctx);
  let app = fs.readFileSync(path.join(ROOT, 'legacy', 'app.js'), 'utf8');
  /* app.js runs 'use strict' inside its IIFE, so `this` is undefined there;
     globalThis is the vm context itself. */
  app = app.replace('})();',
    `globalThis.__L = { allItems: allItems, bucketItems: bucketItems, readiness: readiness,
       stats: stats, buildWeeks: buildWeeks, weekUnlocked: weekUnlocked,
       currentWeek: currentWeek, scheduleReviews: scheduleReviews, dueReviews: dueReviews,
       state: state, WEEKS: WEEKS };\n})();`);
  vm.runInContext(app, ctx);
  return ctx.__L;
}

/* ---------- compare ---------- */
let failed = 0;
const ok = (cond: boolean, label: string, detail = '') => {
  if (!cond) failed++;
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${label}${detail ? '   ' + detail : ''}`);
};

console.log('\nlib/ vs legacy/app.js — parity\n');

const L = bootLegacy();
const state = blankState(START);

/* items: same keys, same order, same kinds */
const legacyItems = L.allItems();
const libItems = libAllItems();
ok(legacyItems.length === libItems.length,
   `allItems length ${legacyItems.length}`, legacyItems.length === libItems.length ? '' : `(lib ${libItems.length})`);
const keyMismatch = legacyItems.findIndex((x: any, i: number) => !libItems[i] || x.key !== libItems[i].key);
ok(keyMismatch === -1, 'allItems keys identical and in the same order',
   keyMismatch === -1 ? '' : `(first differs at ${keyMismatch}: ${legacyItems[keyMismatch].key} vs ${libItems[keyMismatch]?.key})`);
const kindMismatch = legacyItems.findIndex((x: any, i: number) => x.kind !== libItems[i].kind);
ok(kindMismatch === -1, 'allItems kinds identical',
   kindMismatch === -1 ? '' : `(${legacyItems[kindMismatch].key}: ${legacyItems[kindMismatch].kind} vs ${libItems[kindMismatch].kind})`);

/* buckets — expected to differ ONLY by the lp/lld fix */
console.log('');
const lb = L.bucketItems(), nb = libBuckets();
(['core', 'hard', 'tech', 'sd', 'mock', 'lp'] as const).forEach((k) => {
  ok(lb[k].length === nb[k].length, `bucket ${k}`.padEnd(22) + `${nb[k].length}`,
     lb[k].length === nb[k].length ? '' : `(legacy ${lb[k].length})`);
});
/* legacy/app.js on this branch already carries the lp/lld fix, so these agree.
   Against main it would read 28, and the assertion below is what catches that. */
ok(lb.lld.length === nb.lld.length && nb.lld.length === PLAN.lldProblems.length,
   `bucket lld`.padEnd(22) + `${nb.lld.length}`,
   lb.lld.length === nb.lld.length ? '' : `(legacy ${lb.lld.length} — lp/lld double-count)`);

/* week partition */
console.log('');
const lw = L.buildWeeks(), nw = libWeeks(START);
ok(lw.length === nw.length, `buildWeeks length ${nw.length}`);
let weekDiff = '';
for (let i = 0; i < nw.length; i++) {
  const a = lw[i], b = nw[i];
  const ak = [...a.core, ...a.addon].map((g: any) => g.key).join('|');
  const bk = [...b.core, ...b.addon].map((g) => g.key).join('|');
  if (ak !== bk) { weekDiff = `week ${b.n}`; break; }
  if (a.core.length !== b.core.length) { weekDiff = `week ${b.n} core size`; break; }
  if (a.from !== b.from || a.to !== b.to) { weekDiff = `week ${b.n} dates`; break; }
}
ok(weekDiff === '', 'every week has identical goals, order, split and dates', weekDiff && `(${weekDiff})`);

/* gating under a real partial state */
console.log('');
const partial: any = {}, patterns: any = {}, templates: any = {};
nw[0].core.forEach((g) => {
  if (g.type === 'pattern') patterns[g.key] = 'fast';
  else if (g.type === 'template') templates[g.key] = { status: 'fast' };
  else partial[g.key] = { done: true, status: 'clean', mins: 0, log: {}, reviews: [] };
});
const L2 = bootLegacy(partial, patterns, templates);
const s2 = blankState(START);
s2.problems = JSON.parse(JSON.stringify(partial));
s2.patterns = { ...patterns };
s2.templates = { ...templates };
[1, 2, 3].forEach((n) => {
  ok(L2.weekUnlocked(n) === libUnlocked(s2, n), `weekUnlocked(${n}) agrees`, `= ${libUnlocked(s2, n)}`);
});
ok(L2.currentWeek() === libCurrentWeek(s2), 'currentWeek agrees', `= ${libCurrentWeek(s2)}`);

/* readiness — all clean. Differs only where the lld bucket changed. */
console.log('');
const allDone: any = {};
libItems.forEach((x) => { allDone[x.key] = { done: true, status: 'clean', mins: 0, log: {}, reviews: [] }; });
const L3 = bootLegacy(allDone);
const s3 = blankState(START);
s3.problems = allDone;
const lbuck = L3.bucketItems(), nbuck = libBuckets();
PLAN.companies.forEach((c: any) => {
  const legacyScore = L3.readiness(c, lbuck).score;
  const libScore = libReadiness(s3, c, nbuck).score;
  const perfect = Math.abs(libScore - 1) < 1e-9;
  ok(perfect, `${c.id}`.padEnd(12) + `lib reaches 100%`,
     `(legacy ${(legacyScore * 100).toFixed(1)}%${legacyScore < 0.999 ? ' — capped by the bug' : ''})`);
});

/* stats */
console.log('');
const ls = L3.stats(), ns = libStats(s3);
(['total', 'done', 'clean', 'ugly', 'failed', 'logged'] as const).forEach((k) => {
  ok(ls[k] === ns[k], `stats.${k}`.padEnd(22) + `${ns[k]}`, ls[k] === ns[k] ? '' : `(legacy ${ls[k]})`);
});

/* review scheduler */
console.log('');
const L4 = bootLegacy({ 'ld-parking': { done: true, status: 'ugly', mins: 0, log: {}, reviews: [] } });
L4.scheduleReviews('ld-parking');
const legacyDue = L4.dueReviews().map((d: any) => d.due);
const s4 = blankState(START);
s4.problems['ld-parking'] = { done: true, status: 'ugly', mins: 0, log: {}, reviews: [] };
libSchedule(s4, 'ld-parking');
const libDueDates = libDue(s4).map((d) => d.due);
ok(JSON.stringify(legacyDue) === JSON.stringify(libDueDates),
   'scheduleReviews produces identical due dates', libDueDates.join(', '));

console.log('');
if (failed) {
  console.log(`${failed} PARITY CHECK${failed === 1 ? '' : 'S'} FAILED — the logic port changed behaviour.\n`);
  process.exit(1);
}
console.log('lib/ matches legacy/app.js, except the readiness bug it deliberately fixes.\n');
