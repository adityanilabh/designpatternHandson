/* The 22-week plan: which items land in which week, and when a week opens.

   Ported from legacy/app.js. The 22 weeks PARTITION the sheet — every
   trackable item appears in exactly one week, which is what makes "finish all
   22 weeks" equal to "finish the repo". test/weeks.test.ts asserts that.

   core  — the spine. Required to unlock the next week.
   addon — optional per week; finishing all of them finishes those sections.  */
import PLAN from '../content';
import { addDays, diffDays } from './calendar';
import type { AppState, Goal, Week, WeekProgress } from './types';

export const WEEKS = 22;

/* even, order-preserving distribution across a week range */
export function chunkTo<T>(items: T[], fromW: number, toW: number): Record<number, T[]> {
  const out: Record<number, T[]> = {};
  const n = toW - fromW + 1;
  if (n <= 0) return out;
  const base = Math.floor(items.length / n);
  const rem = items.length % n;
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const take = base + (i < rem ? 1 : 0);
    out[fromW + i] = items.slice(idx, idx + take);
    idx += take;
  }
  return out;
}

function phaseRangeFor(p: number): [number, number] {
  return p === 1 ? [1, 6] : p === 2 ? [7, 13] : [14, 22];
}

function G(key: string, type: Goal['type'], label: string, note?: string,
           group = '', lc?: number | null, name?: string): Goal {
  return { key, type, label, note: note || '', group,
           lc: lc === undefined ? null : lc, name: name || label };
}

/* Cached per start date — the content is static, only the from/to dates move. */
let _cache: { key: string; weeks: Week[] } | null = null;

export function buildWeeks(startDate: string): Week[] {
  if (_cache && _cache.key === startDate) return _cache.weeks;

  const w: Week[] = [];
  for (let i = 1; i <= WEEKS; i++) {
    w.push({ n: i, core: [], addon: [], phase: 0, from: '', to: '' });
  }
  const at = (n: number) => w[n - 1];
  const push = (n: number, bucket: 'core' | 'addon', item: Goal) => {
    if (n >= 1 && n <= WEEKS) at(n)[bucket].push(item);
  };
  const spread = (items: Goal[], from: number, to: number, bucket: 'core' | 'addon') => {
    const m = chunkTo(items, from, to);
    Object.keys(m).forEach((k) => m[+k].forEach((it) => push(+k, bucket, it)));
  };

  /* ---- DSA block B : phase 1 sections into weeks 1-6, phase 2 into 7-13 ---- */
  [1, 2].forEach((ph) => {
    const items: Goal[] = [];
    PLAN.sections.filter((s: any) => s.phase === ph).forEach((s: any) => {
      s.b.forEach((q: any, ix: number) => {
        items.push(G(`ds-${s.id}-b-${ix}`, 'problem', q[1], q[3],
          `DSA §${s.n} ${s.name}`, q[0], q[1]));
      });
    });
    const [from, to] = phaseRangeFor(ph);
    spread(items, from, to, 'core');
  });

  /* ---- DSA block C : the hard tier ----
     Block C is the whole point of phase 3, so it is CORE there, not an addon.
     Leaving it optional made weeks 14-22 nearly empty. */
  const cItems: Goal[] = [];
  PLAN.sections.forEach((s: any) => {
    s.c.forEach((q: any, ix: number) => {
      cItems.push(G(`ds-${s.id}-c-${ix}`, 'problem', q[1], q[3],
        `DSA §${s.n} ${s.name} · block C`, q[0], q[1]));
    });
  });
  spread(cItems, 14, 22, 'core');

  /* ---- pattern drills : with their section's phase, addon ---- */
  [1, 2].forEach((ph) => {
    const pats: Goal[] = [];
    PLAN.sections.filter((s: any) => s.phase === ph).forEach((s: any) => {
      s.p.forEach((p: any, ix: number) => {
        pats.push(G(`pt-${s.id}-${ix}`, 'pattern', p[0], p[1],
          `Pattern drill · §${s.n} ${s.name}`));
      });
    });
    const [from, to] = phaseRangeFor(ph);
    spread(pats, from, to, 'addon');
  });

  /* ---- system design : one session per week, already numbered ---- */
  PLAN.sd.forEach((s: any) => {
    push(s.wk, 'core', G(`sd-${s.n}`, 'problem', `SD ${s.n} — ${s.t}`, s.design, 'System design'));
  });

  /* ---- LLD : tier b across weeks 1-13, tier c across 14-22 ---- */
  (['b', 'c'] as const).forEach((tier) => {
    const items = PLAN.lldProblems
      .filter((p: any) => p.tier === tier)
      .map((p: any) => G(`ld-${p.id}`, 'problem', p.name, `${p.flavour} · ${p.mins} min`, 'LLD'));
    const [from, to] = tier === 'b' ? [1, 13] : [14, 22];
    spread(items, from, to, 'core');
  });

  /* ---- tech : module Q&A and practice, by module phase ---- */
  [1, 2].forEach((ph) => {
    const items: Goal[] = [];
    PLAN.tech.filter((m: any) => m.phase === ph).forEach((m: any) => {
      m.qa.forEach((q: any, ix: number) => {
        items.push(G(`tq-${m.id}-${ix}`, 'problem', q[0], q[2], `Tech ${m.n} · ${m.name}`));
      });
      const set = (PLAN.techProblems || {})[m.id];
      if (set) {
        set.groups.forEach((g: any, gi: number) => {
          g[2].forEach((r: any, ix: number) => {
            items.push(G(`pp-${m.id}-${gi}-${ix}`, 'problem', r[1], r[3],
              `Tech practice · ${m.name}`, r[0], r[1]));
          });
        });
      }
    });
    const [from, to] = phaseRangeFor(ph);
    spread(items, from, to, 'core');
  });

  /* ---- behavioural : two stories a week from week 2 ---- */
  PLAN.lp.slots.forEach((s: any, ix: number) => {
    push(2 + Math.floor(ix / 2), 'core', G(`lp-story-${ix}`, 'problem', s[0], s[1], 'Story bank'));
  });

  /* ---- templates : by the deadline group they carry ---- */
  const tGroupWeek: Record<string, number> = { 'By day 21': 3, 'By day 70': 10, 'By day 130': 19 };
  PLAN.templates.forEach((t: any, ix: number) => {
    push(tGroupWeek[t.g] || 3, 'addon', G(String(ix), 'template', t.n, t.d, `Template · ${t.g}`));
  });

  /* ---- recorded mocks : phase 2 onward ---- */
  spread((PLAN.mocks || []).map((m: any, ix: number) =>
    G(`mk-${ix}`, 'problem', m.t, m.d, 'Recorded mock')), 9, 22, 'core');

  /* ---- blind prompts : the unseen-problem drill, phase 3 ---- */
  const blind: Goal[] = [];
  PLAN.method.blind.groups.forEach((g: any, gi: number) => {
    g[2].forEach((p: any, ix: number) => {
      blind.push(G(`bp-${gi}-${ix}`, 'problem', p, '', 'Blind prompt'));
    });
  });
  spread(blind, 12, 22, 'addon');

  /* ---- company packs : optional, spread across the whole run ---- */
  const packs: Goal[] = [];
  PLAN.companies.forEach((c: any) => {
    (c.pack || []).forEach((q: any, ix: number) => {
      packs.push(G(`pk-${c.id}-${ix}`, 'problem', q[1], q[3], `${c.name} pack`, q[0], q[1]));
    });
  });
  spread(packs, 4, 22, 'addon');

  /* ---- phase + dates ---- */
  w.forEach((week) => {
    week.phase = week.n <= 6 ? 1 : week.n <= 13 ? 2 : 3;
    week.from = addDays(startDate, (week.n - 1) * 7);
    week.to = addDays(startDate, week.n * 7 - 1);
  });

  _cache = { key: startDate, weeks: w };
  return w;
}

export function goalDone(state: AppState, g: Goal): boolean {
  if (g.type === 'pattern') return state.patterns[g.key] === 'fast';
  if (g.type === 'template') return (state.templates[g.key] || {}).status === 'fast';
  const p = state.problems[g.key];
  return !!(p && p.done);
}

export function weekProgress(state: AppState, week: Week): WeekProgress {
  const core = week.core.filter((g) => goalDone(state, g)).length;
  const addon = week.addon.filter((g) => goalDone(state, g)).length;
  return {
    core, coreTotal: week.core.length,
    addon, addonTotal: week.addon.length,
    complete: week.core.length > 0 && core === week.core.length,
  };
}

/* A strict chain: week N opens when week N-1's core is complete, and not
   before. Checking the immediately previous week rather than all earlier ones
   is what makes the manual override behave predictably — unlock a week, finish
   it, and the next one opens normally. */
export function weekUnlocked(state: AppState, n: number): boolean {
  if (n <= 1) return true;
  if (state.unlocked && state.unlocked[n]) return true;
  return weekProgress(state, buildWeeks(state.startDate)[n - 2]).complete;
}

export function currentWeek(state: AppState): number {
  const w = buildWeeks(state.startDate);
  for (const week of w) {
    if (!weekProgress(state, week).complete) return week.n;
  }
  return WEEKS;
}

/* what the calendar says, as opposed to what you have actually finished */
export function weekByDate(startDate: string, on: string): number {
  const d = diffDays(startDate, on);
  return Math.max(1, Math.min(WEEKS, Math.floor(d / 7) + 1));
}
