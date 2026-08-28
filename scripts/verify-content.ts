/* The acceptance test for the content split.

   content/*.ts were moved verbatim out of legacy/data.js. This proves the
   move lost nothing: it loads the original data.js in a sandbox, recomposes
   PLAN from the modules, and deep-compares them key by key.

   Run:  npx tsx scripts/verify-content.ts                                  */
// @ts-nocheck
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import PLAN from '../content/index';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/* the original, loaded in an isolated context */
function loadLegacy() {
  const ctx: any = { window: {}, console };
  vm.createContext(ctx);
  vm.runInContext(
    fs.readFileSync(path.join(ROOT, 'legacy', 'data.js'), 'utf8') + ';this.__PLAN = PLAN;',
    ctx
  );
  return ctx.__PLAN;
}

/* structural equality that reports WHERE it diverges, not just that it did */
function firstDiff(a: any, b: any, at = ''): string | null {
  if (a === b) return null;
  if (typeof a !== typeof b) return `${at}: type ${typeof a} vs ${typeof b}`;
  if (a === null || b === null) return `${at}: ${a} vs ${b}`;
  if (typeof a === 'function') return String(a) === String(b) ? null : `${at}: function body differs`;
  if (typeof a !== 'object') return `${at}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`;

  if (Array.isArray(a) !== Array.isArray(b)) return `${at}: array vs object`;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return `${at}: length ${a.length} vs ${b.length}`;
    for (let i = 0; i < a.length; i++) {
      const d = firstDiff(a[i], b[i], `${at}[${i}]`);
      if (d) return d;
    }
    return null;
  }

  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) {
    const only = ka.filter((k) => !kb.includes(k)).concat(kb.filter((k) => !ka.includes(k)));
    return `${at}: key count ${ka.length} vs ${kb.length} (differing: ${only.slice(0, 5).join(', ')})`;
  }
  for (const k of ka) {
    if (!(k in b)) return `${at}.${k}: missing in recomposed`;
    const d = firstDiff(a[k], b[k], `${at}.${k}`);
    if (d) return d;
  }
  return null;
}

const legacy = loadLegacy();
const lk = Object.keys(legacy).sort();
const nk = Object.keys(PLAN).sort();

let failed = 0;
const say = (ok: boolean, msg: string) => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${msg}`);
};

console.log('\ncontent split — recomposed PLAN vs legacy/data.js\n');

say(lk.length === nk.length, `${lk.length} top-level keys preserved (got ${nk.length})`);
const missing = lk.filter((k) => !nk.includes(k));
const extra = nk.filter((k) => !lk.includes(k));
say(missing.length === 0, `no keys lost${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
say(extra.length === 0, `no keys invented${extra.length ? ` (extra: ${extra.join(', ')})` : ''}`);

console.log('');
for (const k of lk) {
  const d = firstDiff(legacy[k], PLAN[k], k);
  say(d === null, `PLAN.${k}`.padEnd(22) + (d ? `-> ${d}` : ''));
}

/* the counts the README publishes, asserted against the recomposed content */
console.log('');
const dsaQs = PLAN.sections.reduce((n: number, s: any) => n + s.b.length + s.c.length, 0);
const patternRows = PLAN.sections.reduce((n: number, s: any) => n + s.p.length, 0);
const approaches = Object.keys(PLAN.approach).reduce(
  (n: number, k: string) => n + Object.keys(PLAN.approach[k]).length, 0);
const values = PLAN.lp.co.reduce((n: number, c: any) => n + c.values.length, 0);
const techQa = PLAN.tech.reduce((n: number, m: any) => n + m.qa.length, 0);

say(PLAN.sections.length === 17, `17 DSA sections (got ${PLAN.sections.length})`);
say(dsaQs === 501, `501 DSA questions (got ${dsaQs})`);
say(patternRows === 181, `181 pattern rows (got ${patternRows})`);
say(approaches === 501, `501 approaches (got ${approaches})`);
say(PLAN.sd.length === 22, `22 SD sessions (got ${PLAN.sd.length})`);
say(PLAN.lldProblems.length === 13, `13 LLD problems (got ${PLAN.lldProblems.length})`);
say(PLAN.patterns.length === 13, `13 design patterns (got ${PLAN.patterns.length})`);
say(techQa === 197, `197 tech Q&A (got ${techQa})`);
say(PLAN.lp.co.length === 11, `11 LP companies (got ${PLAN.lp.co.length})`);
say(values === 77, `77 LP values (got ${values})`);
say(PLAN.templates.length === 29, `29 templates (got ${PLAN.templates.length})`);
say(PLAN.companies.length === 10, `10 companies (got ${PLAN.companies.length})`);

console.log('');
if (failed) {
  console.log(`${failed} CHECK${failed === 1 ? '' : 'S'} FAILED — the split lost or changed content.\n`);
  process.exit(1);
}
console.log('Split is lossless: recomposed PLAN is deep-equal to legacy/data.js.\n');
