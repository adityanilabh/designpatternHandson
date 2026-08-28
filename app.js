/* ===== Target Ladder — application logic =====
   Section-major content, phase-based calendar.
   Persistence, in priority order:
     1. localStorage  — automatic, every change
     2. Linked file   — File System Access API (Chrome/Edge), survives cache clears
     3. Export/Import — manual JSON, always available */

(function () {
'use strict';

var STORE_KEY = 'targetladder.state.v2';
var IDB_NAME = 'targetladder', IDB_STORE = 'handles';
var REVIEW_OFFSETS = [1, 3, 7, 16];

var state = null;
var fileHandle = null;
var saveTimer = null;

/* ------------------------------------------------------------ helpers --- */
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function iso(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0');
}
function today() { return iso(new Date()); }
function addDays(s, n) {
  var p = s.split('-').map(Number);
  return iso(new Date(p[0], p[1] - 1, p[2] + n));
}
function diffDays(a, b) {
  var x = a.split('-').map(Number), y = b.split('-').map(Number);
  return Math.round((new Date(y[0], y[1] - 1, y[2]) - new Date(x[0], x[1] - 1, x[2])) / 86400000);
}
var MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(s) { var p = s.split('-').map(Number); return p[2] + ' ' + MO[p[1] - 1]; }
var DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function dowOf(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]).getDay(); }
function toast(msg) {
  var t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(t._t); t._t = setTimeout(function () { t.hidden = true; }, 2200);
}
function pct(x) { return Math.round(x * 100); }
/* Math.round(0.0035 * 100) is 0, which reads as "nothing registered".
   Show one decimal below 10% so early progress is visible and honest. */
function fmtPct(x) {
  var v = x * 100;
  if (v <= 0) return '0%';
  if (v < 10) return (v < 0.1 ? '<0.1' : v.toFixed(1)) + '%';
  return Math.round(v) + '%';
}

/* ---------------------------------------------------------------- IDB --- */
function idb() {
  return new Promise(function (res, rej) {
    var r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = function () { r.result.createObjectStore(IDB_STORE); };
    r.onsuccess = function () { res(r.result); };
    r.onerror = function () { rej(r.error); };
  });
}
function idbPut(k, v) {
  return idb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(v, k);
      tx.oncomplete = res; tx.onerror = function () { rej(tx.error); };
    });
  });
}
function idbGet(k) {
  return idb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction(IDB_STORE, 'readonly');
      var rq = tx.objectStore(IDB_STORE).get(k);
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error); };
    });
  });
}

/* -------------------------------------------------------------- state --- */
function blankState() {
  return {
    v: 2,
    startDate: PLAN.meta.start,
    problems: {},   /* key -> {done,status,mins,log:{trigger,technique,mistake},reviews:[]} */
    patterns: {},   /* pt-key -> 'unknown'|'learning'|'fast' */
    templates: {},  /* index -> {status} */
    notes: {},      /* free text keyed by section / module / session id */
    unlocked: {},
    ui: { open: {}, sel: {}, navQuery: '', refQuery: '', tab: 'dashboard', theme: 'dark' }
  };
}
function loadState() {
  var raw = null;
  try { raw = localStorage.getItem(STORE_KEY); } catch (e) {}
  if (!raw) { state = blankState(); return; }
  try {
    var s = JSON.parse(raw), b = blankState();
    Object.keys(b).forEach(function (k) { if (s[k] === undefined) s[k] = b[k]; });
    if (!s.ui) s.ui = b.ui;
    if (!s.ui.open) s.ui.open = {};
    state = s;
  } catch (e) { state = blankState(); }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  clearTimeout(saveTimer);
  saveTimer = setTimeout(writeToFile, 700);
}
function P(key) {
  if (!state.problems[key]) state.problems[key] = { done: false, status: '', mins: 0, log: {}, reviews: [] };
  var p = state.problems[key];
  if (!p.log) p.log = {};
  if (!p.reviews) p.reviews = [];
  return p;
}

/* ------------------------------------------------- File System Access --- */
var FSA = typeof window.showSaveFilePicker === 'function';
function writeToFile() {
  if (!fileHandle) return;
  try {
    fileHandle.createWritable().then(function (w) {
      w.write(JSON.stringify(state, null, 2)).then(function () { w.close(); });
    }).catch(function () {});
  } catch (e) {}
}
function linkFile() {
  window.showSaveFilePicker({
    suggestedName: 'target-ladder-progress.json',
    types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
  }).then(function (h) {
    fileHandle = h;
    return idbPut('file', h);
  }).then(function () {
    writeToFile(); toast('Linked. Every change is now written to disk.'); renderStorage();
  }).catch(function () {});
}
function restoreFileHandle() {
  if (!FSA) return Promise.resolve();
  return idbGet('file').then(function (h) {
    if (!h) return;
    return h.queryPermission({ mode: 'readwrite' }).then(function (p) {
      if (p === 'granted') fileHandle = h;
      else window._pendingHandle = h;
    });
  }).catch(function () {});
}
function grantFile() {
  var h = window._pendingHandle; if (!h) return;
  h.requestPermission({ mode: 'readwrite' }).then(function (p) {
    if (p === 'granted') {
      fileHandle = h; window._pendingHandle = null;
      writeToFile(); toast('Re-linked.'); renderStorage();
    }
  });
}
function exportJSON() {
  var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'target-ladder-' + today() + '.json';
  a.click(); URL.revokeObjectURL(a.href);
}
function importJSON() {
  var i = document.createElement('input');
  i.type = 'file'; i.accept = '.json';
  i.onchange = function () {
    var f = i.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var s = JSON.parse(r.result);
        if (!s.problems) throw new Error('bad');
        var b = blankState();
        Object.keys(b).forEach(function (k) { if (s[k] === undefined) s[k] = b[k]; });
        state = s; save(); renderAll(); closeModal(); toast('Imported.');
      } catch (e) { toast('That file did not parse.'); }
    };
    r.readAsText(f);
  };
  i.click();
}

/* ------------------------------------------------------------- items --- */
/* Every checkable item normalises to {key, lc, name, note, diff, kind, group} */

function dsaItems() {
  var out = [];
  PLAN.sections.forEach(function (s) {
    ['b', 'c'].forEach(function (blk) {
      s[blk].forEach(function (q, i) {
        out.push({ key: 'ds-' + s.id + '-' + blk + '-' + i, lc: q[0], name: q[1],
          diff: q[2], note: q[3], kind: blk === 'b' ? 'core' : 'hard',
          group: '§' + s.n + ' ' + s.name + ' · block ' + blk.toUpperCase() });
      });
    });
  });
  return out;
}
function sdItems() {
  return PLAN.sd.map(function (s) {
    return { key: 'sd-' + s.n, lc: null, name: 'SD ' + s.n + ' — ' + s.t,
      note: s.design, diff: '', kind: /mock/i.test(s.t) ? 'mock' : 'sd',
      group: 'System design · ' + (s.tier === 'b' ? 'tier 1–2' : 'top tier') };
  });
}
function lldItems() {
  var out = [];
  PLAN.lldProblems.forEach(function (p) {
    out.push({ key: 'ld-' + p.id, lc: null, name: p.name, note: p.who,
      diff: p.flavour, kind: 'lld',
      group: 'LLD · block ' + p.tier.toUpperCase() });
  });
  PLAN.lp.slots.forEach(function (s, i) {
    out.push({ key: 'lp-story-' + i, lc: null, name: s[0], note: s[2],
      diff: '', kind: 'lp', group: 'Behavioural story bank' });
  });
  return out;
}
function techItems() {
  var out = [];
  PLAN.tech.forEach(function (m) {
    m.qa.forEach(function (q, i) {
      out.push({ key: 'tq-' + m.id + '-' + i, lc: null, name: q[0], note: q[2],
        diff: '', kind: 'tech', group: 'Tech ' + m.n + ' · ' + m.name });
    });
    var set = (PLAN.techProblems || {})[m.id];
    if (set) {
      set.groups.forEach(function (g, gi) {
        g[2].forEach(function (r, i) {
          out.push({ key: 'pp-' + m.id + '-' + gi + '-' + i, lc: r[0], name: r[1],
            note: r[3], diff: r[2], kind: 'tech',
            group: m.name + ' practice · ' + g[0] });
        });
      });
    }
  });
  return out;
}
function mockItems() {
  return (PLAN.mocks || []).map(function (m, i) {
    return { key: 'mk-' + i, lc: null, name: m.t, note: m.d, diff: '',
      kind: 'mock', group: 'Recorded mock · phase ' + m.ph };
  });
}
function packItems(c) {
  return (c.pack || []).map(function (q, i) {
    return { key: 'pk-' + c.id + '-' + i, lc: q[0], name: q[1], note: q[3],
      diff: '', kind: 'pack', group: c.name + ' pack' };
  });
}
function methodItems() {
  var out = [];
  ((PLAN.method && PLAN.method.blind && PLAN.method.blind.groups) || []).forEach(function (g, gi) {
    g[2].forEach(function (p, i) {
      out.push({ key: 'bp-' + gi + '-' + i, lc: null, name: p, note: '',
        diff: '', kind: 'mock', group: 'Blind prompt · ' + g[0] });
    });
  });
  return out;
}
var _allCache = null;
function allItems() {
  if (_allCache) return _allCache;
  var out = dsaItems().concat(sdItems(), lldItems(), techItems(), mockItems(), methodItems());
  PLAN.companies.forEach(function (c) { out = out.concat(packItems(c)); });
  _allCache = out;
  return out;
}
function findItem(key) {
  var all = allItems();
  for (var i = 0; i < all.length; i++) if (all[i].key === key) return all[i];
  return null;
}

/* ------------------------------------------------- readiness & stats --- */
function bucketItems() {
  var b = { core: [], hard: [], tech: [], sd: [], lld: [], lp: [], mock: [] };
  allItems().forEach(function (it) {
    if (it.kind === 'pack') return;
    if (b[it.kind]) b[it.kind].push(it);
    if (it.kind === 'lp') b.lld.push(it);
    if (it.kind === 'mock' && it.key.indexOf('sd-') === 0) b.sd.push(it);
  });
  return b;
}
/* clean 1.0 · ugly 0.7 · failed 0.4 · done-but-unrated 0.85 */
function scoreOf(items) {
  if (!items || !items.length) return 0;
  var got = 0;
  items.forEach(function (x) {
    var p = state.problems[x.key];
    if (!p || !p.done) return;
    got += p.status === 'clean' ? 1 : p.status === 'ugly' ? 0.7 : p.status === 'failed' ? 0.4 : 0.85;
  });
  return got / items.length;
}
/* how many items are actually ticked, ignoring quality weighting */
function doneCountOf(items) {
  if (!items || !items.length) return 0;
  var n = 0;
  items.forEach(function (x) {
    var p = state.problems[x.key];
    if (p && p.done) n++;
  });
  return n;
}
function readiness(c, buckets) {
  var b = buckets || bucketItems();
  var parts = [], total = 0;
  Object.keys(c.weights).forEach(function (k) {
    var items = (k === 'pack') ? packItems(c) : (b[k] || []);
    var s = scoreOf(items);
    parts.push({ k: k, w: c.weights[k], s: s, n: items.length, done: doneCountOf(items) });
    total += c.weights[k] * s;
  });
  parts.sort(function (a, z) { return z.w - a.w; });
  return { score: total, parts: parts };
}
function stats() {
  var s = { total: 0, done: 0, clean: 0, ugly: 0, failed: 0, mins: 0, logged: 0 };
  allItems().forEach(function (x) {
    if (x.kind === 'pack') return;
    s.total++;
    var p = state.problems[x.key]; if (!p) return;
    if (p.done) s.done++;
    if (p.status === 'clean') s.clean++;
    if (p.status === 'ugly') s.ugly++;
    if (p.status === 'failed') s.failed++;
    s.mins += (p.mins || 0);
    if (p.log && (p.log.trigger || p.log.technique || p.log.mistake)) s.logged++;
  });
  return s;
}
function dueReviews() {
  var t = today(), out = [];
  allItems().forEach(function (x) {
    var p = state.problems[x.key]; if (!p || !p.reviews) return;
    p.reviews.forEach(function (r, ri) {
      if (r.done) return;
      out.push({ key: x.key, it: x, due: r.due, ri: ri, delta: diffDays(t, r.due) });
    });
  });
  out.sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : 0; });
  return out;
}
function scheduleReviews(key, from) {
  var p = P(key), base = from || today(), have = {};
  p.reviews.forEach(function (r) { if (!r.done) have[r.due] = 1; });
  REVIEW_OFFSETS.forEach(function (o) {
    var d = addDays(base, o);
    if (!have[d]) p.reviews.push({ due: d, done: false });
  });
  p.reviews.sort(function (a, b) { return a.due < b.due ? -1 : 1; });
}

/* --------------------------------------------------------- calendar --- */
function rawDayNumber() { return diffDays(state.startDate, today()) + 1; }
function dayNumber() { return Math.max(1, Math.min(PLAN.meta.days, rawDayNumber())); }
function phaseRange(ph) { return ph.days.split('–').map(Number); }
function currentPhase() {
  var d = dayNumber();
  for (var i = 0; i < PLAN.phases.length; i++) {
    var r = phaseRange(PLAN.phases[i]);
    if (d >= r[0] && d <= r[1]) return PLAN.phases[i];
  }
  return PLAN.phases[0];
}

/* ================================================================ VIEWS === */

function stat(v, l, cls) {
  return '<div class="stat ' + (cls || '') + '"><span class="stat-v">' + v +
    '</span><span class="stat-l">' + l + '</span></div>';
}

/* Sidebar model. Every entry: {g: groupLabel, items:[{id, n, label, sub}]}
   Tabs not listed here render full-width with no sidebar. */
function navModel(tab) {
  var g1, g2, out;

  if (tab === 'dsa') {
    g1 = []; g2 = [];
    PLAN.sections.forEach(function (s) {
      (s.phase === 1 ? g1 : g2).push({ id: s.id, n: '§' + s.n, label: s.name, sub: s.sub });
    });
    return [
      { g: 'Phase 1 · foundations', items: g1 },
      { g: 'Phase 2 · depth', items: g2 },
      { g: 'Reference', items: [
        { id: 'proof', n: '', label: 'Why it is correct',
          sub: PLAN.proof.rows.length + ' argument shapes' }
      ]}
    ];
  }

  if (tab === 'sd') {
    g1 = []; g2 = [];
    PLAN.sd.forEach(function (s) {
      var hasSol = !!(PLAN.sdSolution || {})[s.n];
      (s.tier === 'b' ? g1 : g2).push({ id: String(s.n), n: 'SD ' + s.n, label: s.t,
        sub: 'week ' + s.wk + (hasSol ? ' · solution' : '') });
    });
    return [{ g: 'Block B · tier 1–2', items: g1 }, { g: 'Block C · top tier', items: g2 }];
  }

  if (tab === 'tech') {
    g1 = []; g2 = [];
    PLAN.tech.forEach(function (m) {
      (m.phase === 1 ? g1 : g2).push({ id: m.id, n: String(m.n), label: m.name, sub: m.hrs + ' hours' });
    });
    return [{ g: 'Phase 1 · the JPM offer', items: g1 }, { g: 'Phase 2', items: g2 }];
  }

  if (tab === 'weekly') {
    var ws = buildWeeks(), byPhase = { 1: [], 2: [], 3: [] };
    ws.forEach(function (wk) {
      var pr = weekProgress(wk), open = weekUnlocked(wk.n);
      byPhase[wk.phase].push({
        id: String(wk.n),
        n: '',
        label: (open ? '' : '✕ ') + 'Week ' + wk.n,
        sub: open ? (pr.core + '/' + pr.coreTotal + ' core' + (pr.complete ? ' ✓' : '')) : 'locked'
      });
    });
    return [
      { g: 'Phase 1 · JPM tier',     items: byPhase[1] },
      { g: 'Phase 2 · Amazon tier',  items: byPhase[2] },
      { g: 'Phase 3 · Google tier',  items: byPhase[3] }
    ];
  }

  if (tab === 'method') {
    return [
      { g: 'The procedure', items: [
        { id: 'why',        n: '1', label: 'Why this section exists', sub: 'the volatility problem' },
        { id: 'altitude',   n: '2', label: 'Altitude control',        sub: 'the most common loss' },
        { id: 'decompose',  n: '3', label: 'Decomposition',           sub: 'unknown → known parts' },
        { id: 'primitives', n: '4', label: 'The primitive catalogue', sub: PLAN.method.primitives.rows.length + ' building blocks' },
        { id: 'failures',   n: '5', label: 'Failure generator',       sub: '11 questions, any system' },
        { id: 'ambiguity',  n: '6', label: 'The first three minutes', sub: 'when you do not understand' },
        { id: 'domain',     n: '7', label: 'Unknown domain',          sub: 'translate, do not learn' },
        { id: 'product',    n: '8', label: 'Product thinking',        sub: 'scored, rarely prepared' }
      ]},
      { g: 'Practice', items: [
        { id: 'worked', n: '', label: 'A worked round',    sub: 'the method, beat by beat' },
        { id: 'blind',  n: '', label: 'Blind prompt bank', sub: '60 prompts, no solutions' },
        { id: 'rubric', n: '', label: 'The rubric',        sub: 'score yourself out of 20' }
      ]}
    ];
  }

  if (tab === 'lp') {
    var co = lpCo();
    var comps = PLAN.lp.co.map(function (c) {
      return { id: 'co-' + c.id, n: '', label: c.name, sub: c.navSub,
               cls: 'nav-co' + (c.id === co.id ? ' nav-co-on' : '') };
    });
    var hi = [], med = [], lo = [];
    co.values.forEach(function (v) {
      var row = { id: co.id + ':v-' + v.id, n: String(v.n), label: v.name, sub: v.freq + ' frequency', cls: 'nav-sub' };
      (v.freq === 'high' ? hi : v.freq === 'med' ? med : lo).push(row);
    });
    var groups = [
      { g: 'Companies', items: comps },
      { g: co.name + ' · how it is scored', items: [
        { id: co.id + ':scoring',   n: '', label: 'How it is scored',   sub: 'and where it happens', cls: 'nav-sub' },
        { id: co.id + ':framework', n: '', label: 'The story format',   sub: 'their proportions', cls: 'nav-sub' },
        { id: co.id + ':probes',    n: '', label: 'The follow-up probes', sub: 'where stories break', cls: 'nav-sub' },
        { id: co.id + ':anti',      n: '', label: 'Anti-patterns',      sub: co.anti.length + ' ways to fail', cls: 'nav-sub' },
        { id: co.id + ':worked',    n: '', label: 'A worked story',     sub: 'annotated, with probes', cls: 'nav-sub' }
      ]}
    ];
    if (hi.length)  groups.push({ g: co.name + ' · ' + co.label + ' · high', items: hi });
    if (med.length) groups.push({ g: co.name + ' · medium', items: med });
    if (lo.length)  groups.push({ g: co.name + ' · low', items: lo });
    groups.push({ g: co.name + ' · your plan', items: [
      { id: co.id + ':coverage', n: '', label: 'Coverage matrix',  sub: 'gaps are visible at debrief', cls: 'nav-sub' },
      { id: co.id + ':prep',     n: '', label: 'The schedule',     sub: 'what to do, and when', cls: 'nav-sub' }
    ]});
    groups.push({ g: 'Your stories · shared by every company', items: [
      { id: 'bank',     n: '', label: 'The story bank',   sub: PLAN.lp.slots.length + ' slots' },
      { id: 'u-shapes', n: '', label: 'The ten shapes',   sub: 'one story, four rubrics' },
      { id: 'u-recut',  n: '', label: 'The recut matrix', sub: 'same story, eleven rooms' },
      { id: 'mining',   n: '', label: 'Where to mine stories', sub: 'do this while employed' },
      { id: 'schedule', n: '', label: 'Writing cadence',  sub: 'two per Sunday' }
    ]});
    groups.push({ g: 'Every loop asks these', items: [
      { id: 'u-openers', n: '', label: 'The four openers', sub: 'nobody prepares them' },
      { id: 'u-screen',  n: '', label: 'The recruiter screen', sub: 'and the comp question' },
      { id: 'u-offer',   n: '', label: 'Offers and negotiation', sub: 'the highest hourly value' }
    ]});
    return groups;
  }

  if (tab === 'lld') {
    var ref = [
      { id: 'flavours',    n: '', label: 'The three flavours',   sub: 'get this wrong and you lose the round' },
      { id: 'script',      n: '', label: 'The 60-minute script', sub: 'minute by minute' },
      { id: 'patterns',    n: '', label: 'Requirement → pattern', sub: PLAN.lldPatterns.length + ' rows' },
      { id: 'solid',       n: '', label: 'SOLID as refactors',   sub: 'violation and fix, in code' },
      { id: 'concurrency', n: '', label: 'Concurrency in LLD',   sub: 'the Amazon differentiator' },
      { id: 'checklist',   n: '', label: 'Class design checklist', sub: PLAN.lldChecklist.length + ' checks' },
      { id: 'rules',       n: '', label: 'Machine-coding rules', sub: 'how to finish' }
    ];
    var pats = PLAN.patterns.map(function (p) {
      return { id: 'pat-' + p.id, n: '', label: p.name, sub: p.cat };
    });
    var pb = [], pc = [];
    PLAN.lldProblems.forEach(function (p) {
      (p.tier === 'b' ? pb : pc).push({ id: p.id, n: '', label: p.name, sub: p.flavour + ' · ' + p.mins + 'm' });
    });
    return [
      { g: 'Reference', items: ref },
      { g: 'Design patterns', items: pats },
      { g: 'Block B · tier 1–2', items: pb },
      { g: 'Block C · top tier', items: pc }
    ];
  }

  if (tab === 'reference') {
    return [{ g: 'Reference', items: [
      { id: 'templates', n: '', label: 'Template library', sub: PLAN.templates.length + ' templates' },
      { id: 'triggers', n: '', label: 'All triggers', sub: 'one searchable index' },
      { id: 'pool', n: '', label: 'Blind hard pool', sub: PLAN.hardPool.length + ' problems' },
      { id: 'reading', n: '', label: 'Reading list', sub: 'primers and references' }
    ]}];
  }

  if (tab === 'strategy') {
    out = PLAN.strategy.map(function (s, i) { return { id: String(i), n: '', label: s.t, sub: '' }; });
    return [{ g: 'Strategy', items: out }];
  }

  return null;
}

function navFlat(tab) {
  var m = navModel(tab), out = [];
  if (!m) return out;
  m.forEach(function (grp) { grp.items.forEach(function (it) { out.push(it); }); });
  return out;
}

function selected(tab) {
  if (!state.ui.sel) state.ui.sel = {};
  var flat = navFlat(tab);
  if (!flat.length) return null;
  var cur = state.ui.sel[tab];
  for (var i = 0; i < flat.length; i++) if (flat[i].id === cur) return cur;
  return flat[0].id;
}

function renderSidenav(tab) {
  var el = $('#sidenav');
  var model = navModel(tab);
  if (!model) { el.hidden = true; document.body.classList.remove('has-nav'); return; }
  el.hidden = false;
  document.body.classList.add('has-nav');

  var q = (state.ui.navQuery || '').toLowerCase();
  var sel = selected(tab);
  var h = '<input class="nav-search" id="nav-search" placeholder="Filter…" value="' + esc(state.ui.navQuery || '') + '">';
  var shown = 0;

  model.forEach(function (grp) {
    var items = grp.items.filter(function (it) {
      return !q || (it.n + ' ' + it.label + ' ' + (it.sub || '')).toLowerCase().indexOf(q) >= 0;
    });
    if (!items.length) return;
    shown += items.length;
    h += '<div class="nav-group">' + esc(grp.g) + '</div>';
    items.forEach(function (it) {
      h += '<button class="nav-item' + (it.cls ? ' ' + it.cls : '') + (it.id === sel ? ' on' : '') +
        '" data-nav="' + esc(it.id) + '">' +
        (it.n ? '<span class="nav-n">' + esc(it.n) + '</span>' : '') +
        '<span class="nav-lbl">' + esc(it.label) +
        (it.sub ? '<span>' + esc(it.sub) + '</span>' : '') + '</span></button>';
    });
  });
  if (!shown) h += '<p class="dim" style="padding:14px 16px">No match.</p>';

  el.innerHTML = h;
  var si = $('#nav-search');
  if (si) si.oninput = function () {
    state.ui.navQuery = si.value; var pos = si.selectionStart;
    renderSidenav(tab); var ns = $('#nav-search'); ns.focus(); ns.setSelectionRange(pos, pos);
  };
}

/* prev / next footer inside the reading pane */
function pagerFor(tab) {
  var flat = navFlat(tab); if (!flat.length) return '';
  var sel = selected(tab), i = 0;
  flat.forEach(function (x, ix) { if (x.id === sel) i = ix; });
  var prev = flat[i - 1], next = flat[i + 1];
  var h = '<div class="pager">';
  h += prev ? '<button class="btn" data-nav="' + esc(prev.id) + '">‹ ' + esc(prev.label) + '</button>'
            : '<span></span>';
  h += '<span class="pager-mid dim">' + (i + 1) + ' of ' + flat.length + '</span>';
  h += next ? '<button class="btn" data-nav="' + esc(next.id) + '">' + esc(next.label) + ' ›</button>'
            : '<span></span>';
  return h + '</div>';
}

/* ============================================================== WEEKLY ===
   A goal-gated view over everything else. The 22 weeks PARTITION the whole
   sheet: every trackable item belongs to exactly one week, so finishing all
   22 weeks is finishing the repo. The plan is GENERATED from the content,
   which is what guarantees the partition holds when content is added.

   core   the spine. Week N+1 stays locked until every core item is done.
   addon  block C, pattern drills, blind prompts, packs. Optional per week -
          and finishing all addons is finishing those sections.            */

var WEEKS = 22;

/* even, order-preserving distribution across a week range */
function chunkTo(items, fromW, toW) {
  var out = {}, n = toW - fromW + 1;
  if (n <= 0) return out;
  var base = Math.floor(items.length / n), rem = items.length % n, idx = 0;
  for (var i = 0; i < n; i++) {
    var take = base + (i < rem ? 1 : 0);
    out[fromW + i] = items.slice(idx, idx + take);
    idx += take;
  }
  return out;
}
function phaseRangeFor(p) { return p === 1 ? [1, 6] : p === 2 ? [7, 13] : [14, 22]; }

function G(key, type, label, note, group, lc, name) {
  return { key: key, type: type, label: label, note: note || '', group: group,
           lc: (lc === undefined ? null : lc), name: name || label };
}

var _weekCache = null;
function buildWeeks() {
  if (_weekCache) return _weekCache;

  var w = [], i;
  for (i = 1; i <= WEEKS; i++) w.push({ n: i, core: [], addon: [] });
  function at(n) { return w[n - 1]; }
  function push(n, bucket, item) { if (n >= 1 && n <= WEEKS) at(n)[bucket].push(item); }

  /* ---- DSA block B : phase 1 sections into weeks 1-6, phase 2 into 7-13 ---- */
  [1, 2].forEach(function (ph) {
    var items = [];
    PLAN.sections.filter(function (s) { return s.phase === ph; }).forEach(function (s) {
      s.b.forEach(function (q, ix) {
        items.push(G('ds-' + s.id + '-b-' + ix, 'problem',
          q[1], q[3], 'DSA §' + s.n + ' ' + s.name, q[0], q[1]));
      });
    });
    var r = phaseRangeFor(ph), map = chunkTo(items, r[0], r[1]);
    Object.keys(map).forEach(function (k) {
      map[k].forEach(function (it) { push(+k, 'core', it); });
    });
  });

  /* ---- DSA block C : the hard tier, weeks 14-22, addon ---- */
  var cItems = [];
  PLAN.sections.forEach(function (s) {
    s.c.forEach(function (q, ix) {
      cItems.push(G('ds-' + s.id + '-c-' + ix, 'problem',
        q[1], q[3], 'DSA §' + s.n + ' ' + s.name + ' · block C', q[0], q[1]));
    });
  });
  /* Block C is the whole point of phase 3, so it is CORE there - not an
     addon. Leaving it optional made weeks 14-22 nearly empty. */
  var cMap = chunkTo(cItems, 14, 22);
  Object.keys(cMap).forEach(function (k) {
    cMap[k].forEach(function (it) { push(+k, 'core', it); });
  });

  /* ---- pattern drills : with their section's phase, addon ---- */
  [1, 2].forEach(function (ph) {
    var pats = [];
    PLAN.sections.filter(function (s) { return s.phase === ph; }).forEach(function (s) {
      s.p.forEach(function (p, ix) {
        pats.push(G('pt-' + s.id + '-' + ix, 'pattern', p[0], p[1], 'Pattern drill · §' + s.n + ' ' + s.name));
      });
    });
    var r = phaseRangeFor(ph), m = chunkTo(pats, r[0], r[1]);
    Object.keys(m).forEach(function (k) { m[k].forEach(function (it) { push(+k, 'addon', it); }); });
  });

  /* ---- system design : one session per week, already numbered ---- */
  PLAN.sd.forEach(function (s) {
    push(s.wk, 'core', G('sd-' + s.n, 'problem', 'SD ' + s.n + ' — ' + s.t, s.design, 'System design'));
  });

  /* ---- LLD : tier b across weeks 1-13, tier c across 14-22 ---- */
  ['b', 'c'].forEach(function (tier) {
    var items = PLAN.lldProblems.filter(function (p) { return p.tier === tier; })
      .map(function (p) { return G('ld-' + p.id, 'problem', p.name, p.flavour + ' · ' + p.mins + ' min', 'LLD'); });
    var r = tier === 'b' ? [1, 13] : [14, 22], m = chunkTo(items, r[0], r[1]);
    Object.keys(m).forEach(function (k) { m[k].forEach(function (it) { push(+k, 'core', it); }); });
  });

  /* ---- tech : module Q&A and practice, by module phase ---- */
  [1, 2].forEach(function (ph) {
    var items = [];
    PLAN.tech.filter(function (m) { return m.phase === ph; }).forEach(function (m) {
      m.qa.forEach(function (q, ix) {
        items.push(G('tq-' + m.id + '-' + ix, 'problem', q[0], q[2], 'Tech ' + m.n + ' · ' + m.name));
      });
      var set = (PLAN.techProblems || {})[m.id];
      if (set) {
        set.groups.forEach(function (g, gi) {
          g[2].forEach(function (r2, ix) {
            items.push(G('pp-' + m.id + '-' + gi + '-' + ix, 'problem',
              r2[1], r2[3], 'Tech practice · ' + m.name, r2[0], r2[1]));
          });
        });
      }
    });
    var r = phaseRangeFor(ph), mm = chunkTo(items, r[0], r[1]);
    Object.keys(mm).forEach(function (k) { mm[k].forEach(function (it) { push(+k, 'core', it); }); });
  });

  /* ---- Behavioural : two stories a week from week 2 ---- */
  PLAN.lp.slots.forEach(function (s, ix) {
    push(2 + Math.floor(ix / 2), 'core', G('lp-story-' + ix, 'problem', s[0], s[1], 'Story bank'));
  });

  /* ---- templates : by the deadline group they carry ---- */
  var tGroupWeek = { 'By day 21': 3, 'By day 70': 10, 'By day 130': 19 };
  PLAN.templates.forEach(function (t, ix) {
    push(tGroupWeek[t.g] || 3, 'addon', G(String(ix), 'template', t.n, t.d, 'Template · ' + t.g));
  });

  /* ---- recorded mocks : phase 2 onward ---- */
  var mocks = (PLAN.mocks || []).map(function (m, ix) {
    return G('mk-' + ix, 'problem', m.t, m.d, 'Recorded mock');
  });
  var mMap = chunkTo(mocks, 9, 22);
  Object.keys(mMap).forEach(function (k) { mMap[k].forEach(function (it) { push(+k, 'core', it); }); });

  /* ---- blind prompts : the unseen-problem drill, phase 3 ---- */
  var blind = [];
  PLAN.method.blind.groups.forEach(function (g, gi) {
    g[2].forEach(function (p, ix) { blind.push(G('bp-' + gi + '-' + ix, 'problem', p, '', 'Blind prompt')); });
  });
  var bMap = chunkTo(blind, 12, 22);
  Object.keys(bMap).forEach(function (k) { bMap[k].forEach(function (it) { push(+k, 'addon', it); }); });

  /* ---- company packs : optional, spread across the whole run ---- */
  var packs = [];
  PLAN.companies.forEach(function (c) {
    (c.pack || []).forEach(function (q, ix) {
      packs.push(G('pk-' + c.id + '-' + ix, 'problem',
        q[1], q[3], c.name + ' pack', q[0], q[1]));
    });
  });
  var pMap = chunkTo(packs, 4, 22);
  Object.keys(pMap).forEach(function (k) { pMap[k].forEach(function (it) { push(+k, 'addon', it); }); });

  /* ---- phase + dates ---- */
  w.forEach(function (week) {
    week.phase = week.n <= 6 ? 1 : week.n <= 13 ? 2 : 3;
    week.from = addDays(state.startDate, (week.n - 1) * 7);
    week.to = addDays(state.startDate, week.n * 7 - 1);
  });

  _weekCache = w;
  return w;
}

/* ---- completion ---- */
function goalDone(g) {
  if (g.type === 'pattern') return state.patterns[g.key] === 'fast';
  if (g.type === 'template') return (state.templates[g.key] || {}).status === 'fast';
  var p = state.problems[g.key];
  return !!(p && p.done);
}
function weekProgress(week) {
  var c = week.core.filter(goalDone).length;
  var a = week.addon.filter(goalDone).length;
  return { core: c, coreTotal: week.core.length, addon: a, addonTotal: week.addon.length,
           complete: week.core.length > 0 && c === week.core.length };
}
/* Week 1 is always open. After that: the previous week is complete, or you
   explicitly unlocked it. */
/* A strict chain: week N opens when week N-1's core is complete, and not
   before. Checking the immediately previous week (rather than all earlier
   ones) is what makes the manual override behave predictably - unlock a week,
   finish it, and the next one opens normally. */
function weekUnlocked(n) {
  if (n <= 1) return true;
  if (state.unlocked && state.unlocked[n]) return true;
  return weekProgress(buildWeeks()[n - 2]).complete;
}
function currentWeek() {
  var w = buildWeeks();
  for (var i = 0; i < w.length; i++) {
    if (!weekProgress(w[i]).complete) return w[i].n;
  }
  return WEEKS;
}
function weekByDate() {
  var d = diffDays(state.startDate, today());
  return Math.max(1, Math.min(WEEKS, Math.floor(d / 7) + 1));
}


/* ---------------------------------------------------------- dashboard --- */
function renderDashboard() {
  var s = stats(), due = dueReviews();
  var overdue = due.filter(function (d) { return d.delta <= 0; }).length;
  var d = rawDayNumber(), ph = currentPhase();
  var started = d >= 1 && d <= PLAN.meta.days;
  var h = '';

  if (dowOf(state.startDate) !== 1) {
    h += '<div class="warnbox"><b>Your start date is a ' + DOW[dowOf(state.startDate)] + '.</b> ' +
      'This plan assumes <b>Day 1 = Monday</b> — Mon–Fri DSA + tech, Saturday system design, Sunday LLD. ' +
      'Change it below, or the weekend tracks land on weekdays.</div>';
  }

  h += '<div class="card phase-card">' +
    '<div class="card-head"><h2>Phase ' + ph.n + ' · ' + esc(ph.name) + '</h2><span class="spacer"></span>' +
    '<span class="chip tier' + ph.n + '">' + esc(ph.rung) + '</span></div>' +
    '<div class="phase-meta">' +
    (started ? '<b>Day ' + d + '</b> of ' + PLAN.meta.days
      : (d < 1 ? '<b>Starts in ' + (1 - d) + ' days</b>' : '<b>Plan complete</b>')) +
    ' · days ' + esc(ph.days) + ' · ' + fmtDate(ph.from) + ' → ' + fmtDate(ph.to) + '</div>' +
    '<div class="learn"><b>The bar.</b> ' + esc(ph.bar) + '</div>' +
    '<div class="exit"><b>What you work now.</b> ' + esc(ph.work) + '</div>';
  var span = phaseRange(ph);
  var prog = Math.max(0, Math.min(1, (d - span[0] + 1) / (span[1] - span[0] + 1)));
  h += '<div class="co-bar" style="margin-top:14px"><i style="width:' + pct(prog) + '%"></i></div>' +
    '<p class="dim" style="margin-top:6px;font-size:12.5px">Phase ' + pct(prog) + '% elapsed</p></div>';

  h += '<div class="card"><div class="card-head"><h2>Where you are</h2></div><div class="statrow">' +
    stat(s.done + '<span class="of">/' + s.total + '</span>', 'items done') +
    stat(s.clean, 'clean', 'ok') +
    stat(s.ugly, 'ugly', 'warn') +
    stat(s.failed, 'failed', 'bad') +
    stat(overdue, 'due now', overdue ? 'bad' : '') +
    stat(Math.round(s.mins / 60) + 'h', 'logged time') +
    stat(s.logged, 'log entries') +
    '</div><div class="co-bar" style="margin-top:16px"><i style="width:' +
    pct(s.done / (s.total || 1)) + '%"></i></div></div>';

  h += '<div class="card"><div class="card-head"><h2>The 43 / 57 split</h2><span class="spacer"></span>' +
    '<span class="dim">~506 hours over 22 weeks</span></div>' +
    '<p class="dim" style="margin-bottom:12px">Going from 65% DSA to 43% did not cut your DSA hours — it raised them ' +
    'from 195 to 220. The percentage fell because the denominator grew.</p>';
  PLAN.split.forEach(function (r) {
    h += '<div class="co-part"><span class="co-part-lbl">' + esc(r[0]) + '</span>' +
      '<span class="co-part-w">' + r[1] + 'h</span>' +
      '<span class="co-part-bar"><i style="width:' + (r[2] * 1.9) + '%"></i></span>' +
      '<span class="co-part-n">' + r[2] + '%</span></div>';
  });
  h += '</div>';

  h += '<div class="card"><div class="card-head"><h2>Interview calendar</h2><span class="spacer"></span>' +
    '<span class="dim">applying is work, and it is on the clock</span></div>' +
    '<p class="dim" style="margin-bottom:12px">The Google application goes out in <b>week 13</b>, not week 22. ' +
    'Their pipeline is 8–12 weeks — it is longer than the preparation.</p>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Week</th><th>Days</th><th>Action</th></tr></thead><tbody>';
  PLAN.calendar.forEach(function (r) {
    h += '<tr' + (r[3] ? ' class="hot"' : '') + '><td class="canon">' + esc(r[0]) + '</td>' +
      '<td class="canon">' + esc(r[1]) + '</td><td class="' + (r[3] ? 'fire' : 'trig') + '">' + esc(r[2]) + '</td></tr>';
  });
  h += '</tbody></table></div></div>';

  h += '<div class="card"><div class="card-head"><h2>Phase ' + ph.n + ' exit criteria</h2><span class="spacer"></span>' +
    '<span class="dim">six of seven is the pass bar</span></div>';
  PLAN.criteria.filter(function (c) { return c.ph === ph.n; }).forEach(function (c, i) {
    var on = !!state.ui.open['crit-' + ph.n + '-' + i];
    h += '<div class="tpl"><span class="tpl-n">' + (i + 1) + '</span>' +
      '<div class="tpl-body"><b>' + esc(c.t) + '</b><span>' + esc(c.d) + '</span></div>' +
      '<div class="tpl-actions"><button class="btn sm ok ' + (on ? 'on' : '') + '" data-crit="' + ph.n + '-' + i + '">' +
      (on ? '✓ hit' : 'mark hit') + '</button></div></div>';
  });
  h += '</div>';

  h += '<div class="card"><div class="card-head"><h2>Non-negotiable process</h2></div><ol class="rules">';
  PLAN.rules.forEach(function (r) { h += '<li>' + esc(r) + '</li>'; });
  h += '</ol></div>';

  h += '<div class="card"><div class="card-head"><h2>Start date</h2></div>' +
    '<p class="dim">Day 1 must be a <b>Monday</b>.</p>' +
    '<input type="date" class="search" id="startdate" value="' + esc(state.startDate) + '" style="max-width:220px"></div>';

  $('#view-dashboard').innerHTML = h;
  var sd = $('#startdate');
  if (sd) sd.onchange = function () {
    state.startDate = sd.value; _weekCache = null; save(); renderAll();
  };
}

/* --------------------------------------------------------------- DSA --- */
/* ------------------------------------------------------- problem links --- */
/* LeetCode slugs derive from the title; PLAN.lcSlug overrides the ones that
   would 404 (bundled rows, edited headings). GfG has no derivable slug, so
   those go through search, which always resolves. */
function lcUrl(lc, name) {
  var slug = (PLAN.lcSlug && PLAN.lcSlug[lc]) ||
    String(name || '').toLowerCase()
      .replace(/[^a-z0-9 -]/g, '').trim().replace(/\s+/g, '-');
  return 'https://leetcode.com/problems/' + slug + '/';
}
function gfgUrl(lc, name) {
  var term = (PLAN.gfgName && PLAN.gfgName[lc]) || name || '';
  return 'https://www.geeksforgeeks.org/search/?gq=' + encodeURIComponent(term);
}
function problemLinks(lc, name) {
  if (lc == null) return '<span class="p-lc">—</span>';
  return '<a class="p-lc lnk" href="' + lcUrl(lc, name) + '" target="_blank" rel="noopener"' +
    ' title="Open LC ' + lc + ' on LeetCode">LC ' + lc + '</a>' +
    '<a class="p-gfg lnk" href="' + gfgUrl(lc, name) + '" target="_blank" rel="noopener"' +
    ' title="Find this on GeeksforGeeks">GfG</a>';
}

/* the approach + cost for a DSA question, keyed by section and LC field.
   Deliberately behind a click in the drawer so it does not spoil a solve. */
function approachFor(key) {
  var m = /^ds-([a-z]+)-[bc]-(\d+)$/.exec(key || '');
  if (!m) return '';
  var sec = null;
  PLAN.sections.forEach(function (x) { if (x.id === m[1]) sec = x; });
  if (!sec) return '';
  var list = key.indexOf('-b-') > 0 ? sec.b : sec.c;
  var row = list[parseInt(m[2], 10)];
  if (!row) return '';
  var tbl = (PLAN.approach || {})[sec.id] || {};
  return tbl[String(row[0])] || '';
}

function questionRow(key, q) {
  var p = state.problems[key] || {};
  var diffCls = { E: 'e', M: 'm', H: 'h' }[q[2]] || '';
  return '<div class="prow' + (p.done ? ' done' : '') + '" data-open="' + key + '">' +
    '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
    '<span class="diff ' + diffCls + '">' + esc(q[2] || '') + '</span>' +
    problemLinks(q[0], q[1]) +
    '<span class="p-name">' + esc(q[1]) + '</span>' +
    (q[3] ? '<span class="p-note">' + esc(q[3]) + '</span>' : '') +
    '<span class="dot ' + esc(p.status || '') + '"></span></div>';
}

/* "how do you know that is correct?" - a Google question, and the one part
   of DSA preparation nobody rehearses. */
function renderProof() {
  var P = PLAN.proof;
  var h = '<div class="pane-head"><div class="eyebrow">DSA &middot; reference</div>' +
    '<h1>Why it is correct</h1><p class="pane-sub">' + esc(P.intro) + '</p></div>';
  h += '<div class="learn">' + esc(P.note) + '</div>';
  P.rows.forEach(function (r) {
    h += '<h2 class="pane-h2">' + esc(r[0]) + '</h2>' +
      '<p class="pane-p">' + esc(r[1]) + '</p>' +
      '<div class="lp-said">' + esc(r[2]) + '</div>' +
      '<div class="exit"><b>Where you say it.</b> ' + esc(r[3]) + '</div>';
  });
  h += '<h2 class="pane-h2">The drill</h2><div class="exit">' + esc(P.drill) + '</div>';
  h += pagerFor('dsa');
  $('#view-dsa').innerHTML = h;
}

function renderDsa() {
  var id = selected('dsa');
  if (id === 'proof') { renderProof(); return; }
  var s = null;
  PLAN.sections.forEach(function (x) { if (x.id === id) s = x; });
  if (!s) s = PLAN.sections[0];

  var bd = s.b.filter(function (_, i) { var p = state.problems['ds-' + s.id + '-b-' + i]; return p && p.done; }).length;
  var cd = s.c.filter(function (_, i) { var p = state.problems['ds-' + s.id + '-c-' + i]; return p && p.done; }).length;
  var pd = s.p.filter(function (_, i) { return state.patterns['pt-' + s.id + '-' + i] === 'fast'; }).length;

  var h = '<div class="pane-head">' +
    '<div class="eyebrow">DSA &middot; section ' + s.n + ' of ' + PLAN.sections.length +
    ' &middot; <span class="chip ph' + s.phase + '">phase ' + s.phase + '</span></div>' +
    '<h1>' + esc(s.name) + '</h1>' +
    (s.sub ? '<p class="pane-sub">' + esc(s.sub) + '</p>' : '') +
    '<div class="pane-stats">' +
    '<span><b>' + pd + '</b>/' + s.p.length + ' patterns cold</span>' +
    '<span><b>' + bd + '</b>/' + s.b.length + ' block B solved</span>' +
    '<span><b>' + cd + '</b>/' + s.c.length + ' block C solved</span>' +
    '</div></div>';

  if (PLAN.derive && PLAN.derive[s.id]) {
    h += '<div class="derive"><i>getting to the right row</i>' + esc(PLAN.derive[s.id]) + '</div>';
  }

  h += '<h2 class="pane-h2">A &middot; Patterns</h2>' +
    '<p class="pane-p">The machinery. Each row is <b>disguise &rarr; move</b>, and the disguise column is what the ' +
    'interviewer actually says. Cover the right side, read a disguise, say the move. Under five seconds or it is not learned.</p>' +
    '<div class="tbl-wrap"><table class="pat"><thead><tr><th>Pattern</th>' +
    '<th>The disguise — what you actually hear</th><th>The move</th><th>Cost</th><th>Cold?</th></tr></thead><tbody>';
  s.p.forEach(function (r, i) {
    var pk = 'pt-' + s.id + '-' + i, st = state.patterns[pk] || '';
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td>' +
      '<td>' + esc(r[2]) + '</td><td class="canon">' + esc(r[3] || '') + '</td><td class="pat-act">' +
      '<button class="btn xs bad ' + (st === 'unknown' ? 'on' : '') + '" data-pat="' + pk + ':unknown">?</button>' +
      '<button class="btn xs warn ' + (st === 'learning' ? 'on' : '') + '" data-pat="' + pk + ':learning">~</button>' +
      '<button class="btn xs ok ' + (st === 'fast' ? 'on' : '') + '" data-pat="' + pk + ':fast">✓</button>' +
      '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">B &middot; Tier 1–2 <span class="h2-count">' + s.b.length + '</span></h2>' +
    '<p class="pane-p">JPM &middot; Amex &middot; Expedia &middot; Amazon &middot; Microsoft &middot; Adobe. ' +
    'Never solve one without first naming which row of block A it is.</p>';
  s.b.forEach(function (r, i) { h += questionRow('ds-' + s.id + '-b-' + i, r); });

  h += '<h2 class="pane-h2">C &middot; Google / Uber L4 <span class="h2-count">' + s.c.length + '</span></h2>';
  if (s.cx) h += '<div class="learn"><b>Extra machinery.</b> ' + esc(s.cx) + '</div>';
  s.c.forEach(function (r, i) { h += questionRow('ds-' + s.id + '-c-' + i, r); });

  h += '<div class="field pane-notes"><label>Notes — add YOUR disguises here</label>' +
    '<textarea data-note="sec-' + s.id + '" placeholder="The phrase that should have tipped you off. One line per miss.">' +
    esc(state.notes['sec-' + s.id] || '') + '</textarea></div>';

  h += pagerFor('dsa');
  $('#view-dsa').innerHTML = h;
}

/* ----------------------------------------------------- system design --- */
function triTable(rows, heads) {
  var h = '<div class="tbl-wrap"><table><thead><tr>';
  heads.forEach(function (x) { h += '<th>' + esc(x) + '</th>'; });
  h += '</tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td class="trig">' + esc(r[0]) + '</td><td class="fire">' + esc(r[1]) + '</td>' +
      (r.length > 2 ? '<td class="canon">' + esc(r[2]) + '</td>' : '') + '</tr>';
  });
  return h + '</tbody></table></div>';
}

/* a reading list: direct links open the page, non-links open a search */
function readingList(rows, heading) {
  if (!rows || !rows.length) return '';
  var h = '<h2 class="pane-h2">' + esc(heading || 'Read more') +
    ' <span class="h2-count">' + rows.length + '</span></h2><ul class="readlist">';
  rows.forEach(function (r) {
    var url = r[2] ? r[1] : 'https://www.google.com/search?q=' + encodeURIComponent(r[1]);
    h += '<li><a href="' + url + '" target="_blank" rel="noopener" class="lnk">' + esc(r[0]) + '</a>' +
      (r[2] ? '' : '<span class="read-find">search</span>') + '</li>';
  });
  return h + '</ul>';
}

function bulletList(items, cls) {
  if (!items || !items.length) return '';
  var h = '<ul class="sd-list ' + (cls || '') + '">';
  items.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
  return h + '</ul>';
}

/* the expandable worked solution on a system design session */
function renderSdSolution(n) {
  var s = (PLAN.sdSolution || {})[n];
  if (!s) {
    return '<div class="soln-none">Worked solution not written yet for this session. ' +
      'The blocks above are complete.</div>';
  }
  var open = !!state.ui.open['sdsoln-' + n];
  var h = '<button class="soln-bar' + (open ? ' open' : '') + '" data-sdsoln="' + n + '">' +
    '<span class="chev">▶</span><span class="soln-t">Full solution</span>' +
    '<span class="soln-sub">requirements &middot; estimation &middot; API &middot; data model &middot; architecture &middot; ' +
    'flows &middot; deep dive &middot; scaling &middot; trade-offs</span></button>';
  if (!open) return h;

  h += '<div class="soln-body">';

  h += '<h2 class="pane-h2">Requirements</h2>' +
    '<div class="req-cols"><div><h3>Functional</h3>' + bulletList(s.req.functional) + '</div>' +
    '<div><h3>Non-functional</h3>' + bulletList(s.req.nonFunctional) + '</div></div>';

  h += '<h2 class="pane-h2">Estimation — out loud, rounded</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Quantity</th><th>Working</th><th>Result</th></tr></thead><tbody>';
  s.estimate.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="mono-cell">' + esc(r[1]) + '</td>' +
      '<td class="trig">' + esc(r[2]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">API</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Endpoint</th><th>Request</th><th>Response</th><th>Note</th></tr></thead><tbody>';
  s.api.forEach(function (r) {
    h += '<tr><td class="mono-cell">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
      '<td class="canon">' + esc(r[2]) + '</td><td class="trig">' + esc(r[3]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">Data model</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Table</th><th>Columns</th><th>Why</th></tr></thead><tbody>';
  s.dataModel.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="mono-cell">' + esc(r[1]) + '</td>' +
      '<td class="trig">' + esc(r[2]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">Architecture</h2>' + asciiBlock(s.arch);

  h += '<h2 class="pane-h2">Flows</h2>';
  s.flows.forEach(function (f) {
    h += '<h3 class="prac-h">' + esc(f[0]) + '</h3>' + bulletList(f[1]);
  });

  h += '<h2 class="pane-h2">Deep dive <span class="h2-count">' + s.deepDive.length + '</span></h2>' +
    '<p class="pane-p">Pick one of these at minute 30, before they ask. Choosing well is itself scored.</p>';
  s.deepDive.forEach(function (d) {
    h += '<h3 class="prac-h">' + esc(d[0]) + '</h3>';
    String(d[1]).split('\n\n').forEach(function (para) {
      h += '<p class="pane-p">' + esc(para) + '</p>';
    });
  });

  h += '<h2 class="pane-h2">Scaling — in the order it bites</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Bottleneck</th><th>What you do</th></tr></thead><tbody>';
  s.scaling.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">Trade-offs — say the alternative you rejected</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Decision</th><th>Chose</th><th>Over</th><th>Because</th></tr></thead><tbody>';
  s.tradeoffs.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig"><b>' + esc(r[1]) + '</b></td>' +
      '<td class="canon">' + esc(r[2]) + '</td><td class="trig">' + esc(r[3]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">What each company pushes on</h2>';
  s.angle.forEach(function (r) {
    h += '<div class="qa static"><div class="qa-body"><b class="qa-q">' + esc(r[0]) + '</b>' +
      '<span class="qa-f">' + esc(r[1]) + '</span></div></div>';
  });

  return h + '</div>';
}

function renderSd() {
  var id = selected('sd');
  var s = null;
  PLAN.sd.forEach(function (x) { if (String(x.n) === id) s = x; });
  if (!s) s = PLAN.sd[0];

  var key = 'sd-' + s.n, p = state.problems[key] || {};

  var h = '<div class="pane-head">' +
    '<div class="eyebrow">System design &middot; session ' + s.n + ' of ' + PLAN.sd.length +
    ' &middot; week ' + s.wk + ' &middot; <span class="chip tier' + (s.tier === 'b' ? '1' : '3') + '">' +
    (s.tier === 'b' ? 'tier 1–2' : 'top tier') + '</span></div>' +
    '<h1>' + esc(s.t) + '</h1>' +
    (s.anchor ? '<p class="pane-sub">Case-study anchor: ' + esc(s.anchor) + '</p>' : '') +
    '<div class="pane-actions">' +
    '<button class="btn ' + (p.done ? 'ok on' : 'primary') + '" data-check="' + key + '">' +
    (p.done ? '✓ Done' : 'Mark done') + '</button>' +
    '<button class="btn" data-open="' + key + '">Log / status</button>' +
    '<span class="dot ' + esc(p.status || '') + '"></span></div></div>';

  if (s.who) h += '<div class="sd-who"><i>Who asks it</i>' + esc(s.who) + '</div>';

  h += '<h2 class="pane-h2">Asked as</h2>' + bulletList(s.asked, 'asked');

  if (s.clarify && s.clarify.length) {
    h += '<h2 class="pane-h2">Clarify in the first three minutes</h2>' + bulletList(s.clarify);
  }
  if (s.scale) {
    h += '<h2 class="pane-h2">Back of the envelope</h2><div class="learn">' + esc(s.scale) + '</div>';
  }
  if (s.terms && s.terms.length) {
    h += '<h2 class="pane-h2">Terms you must own <span class="h2-count">' + s.terms.length + '</span></h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Term</th><th>In one sentence</th></tr></thead><tbody>';
    s.terms.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
  }
  if (s.decisions && s.decisions.length) {
    h += '<h2 class="pane-h2">Decision points</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Decision</th><th>Options</th><th>Verdict, and why</th></tr></thead><tbody>';
    s.decisions.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1] || '—') + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
  }
  if (s.cross && s.cross.length) {
    h += '<h2 class="pane-h2">Cross-questions <span class="h2-count">' + s.cross.length + '</span></h2>' +
      '<p class="pane-p">Cover the answer and say it out loud. This is the block that decides the round.</p>';
    s.cross.forEach(function (r) {
      h += '<div class="qa static"><div class="qa-body">' +
        '<b class="qa-q">' + esc(r[0]) + '</b>' +
        '<span class="qa-f">' + esc(r[1]) + '</span></div></div>';
    });
  }
  if (s.fail && s.fail.length) {
    h += '<h2 class="pane-h2">What sinks candidates here</h2>' + bulletList(s.fail, 'fail');
  }

  h += renderSdSolution(s.n);

  h += readingList((PLAN.sdRead || {})[s.n], 'Read more');

  h += '<div class="field pane-notes"><label>Your one-page design + cross-question answers</label>' +
    '<textarea data-note="' + key + '" placeholder="A weekend that produced nothing you can re-read did not happen.">' +
    esc(state.notes[key] || '') + '</textarea></div>';

  h += pagerFor('sd');
  $('#view-sd').innerHTML = h;
}

/* --------------------------------------------------------------- LLD --- */
/* one ASCII diagram block */
function asciiBlock(lines, title) {
  if (!lines || !lines.length) return '';
  return '<div class="codeblock diagram">' +
    (title ? '<div class="code-t">' + esc(title) + '</div>' : '') +
    '<pre><code>' + esc(lines.join('\n')) + '</code></pre></div>';
}

function renderPattern(p) {
  var h = '<div class="pane-head">' +
    '<div class="eyebrow">Design pattern &middot; ' + esc(p.cat) + '</div>' +
    '<h1>' + esc(p.name) + '</h1>' +
    '<p class="pane-sub">' + esc(p.intent) + '</p></div>';

  h += '<h2 class="pane-h2">When it fires</h2>' + bulletList(p.fires, 'asked');
  h += '<h2 class="pane-h2">Class diagram</h2>' + asciiBlock(p.uml);
  h += '<h2 class="pane-h2">Code</h2>' +
    '<div class="codeblock"><pre><code>' + esc(p.code.join('\n')) + '</code></pre></div>';
  h += '<h2 class="pane-h2">Where it shows up here</h2><div class="learn">' + esc(p.used) + '</div>';
  h += '<h2 class="pane-h2">Most often confused with</h2><div class="exit">' + esc(p.vs) + '</div>';
  h += '<h2 class="pane-h2">How it goes wrong</h2>' + bulletList(p.gotchas, 'fail');
  return h;
}

/* the expandable full solution */
function renderSolution(pid) {
  var s = (PLAN.lldSolution || {})[pid];
  if (!s) {
    return '<div class="soln-none">Full worked solution not written yet for this problem. ' +
      'The blocks above are complete.</div>';
  }
  var open = !!state.ui.open['soln-' + pid];
  var h = '<button class="soln-bar' + (open ? ' open' : '') + '" data-soln="' + esc(pid) + '">' +
    '<span class="chev">▶</span>' +
    '<span class="soln-t">Full solution</span>' +
    '<span class="soln-sub">approach &middot; class diagram &middot; API' +
    (s.schema ? ' &middot; schema' : '') + ' &middot; code</span></button>';
  if (!open) return h;

  h += '<div class="soln-body">';

  h += '<h2 class="pane-h2">Problem statement</h2><div class="learn">' + esc(s.statement) + '</div>';

  h += '<h2 class="pane-h2">Requirements</h2>' +
    '<div class="req-cols"><div><h3>Functional</h3>' + bulletList(s.req.functional) + '</div>' +
    '<div><h3>Non-functional</h3>' + bulletList(s.req.nonFunctional) + '</div></div>';

  h += '<h2 class="pane-h2">How to approach it</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Step</th><th>What you do</th></tr></thead><tbody>';
  s.approach.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h2 class="pane-h2">Class diagram</h2>' + asciiBlock(s.uml);

  h += '<h2 class="pane-h2">Public API</h2>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Signature</th><th>Contract</th></tr></thead><tbody>';
  s.api.forEach(function (r) {
    h += '<tr><td class="mono-cell">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  if (s.schema && s.schema.length) {
    h += '<h2 class="pane-h2">Schema, if persistence is in scope</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Table</th><th>Columns</th><th>Note</th></tr></thead><tbody>';
    s.schema.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="mono-cell">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
  }

  h += '<h2 class="pane-h2">The solution <span class="h2-count">' + s.solution.length + ' parts</span></h2>' +
    '<p class="pane-p">Interview scope: the core classes and the main flow. Not every getter.</p>';
  s.solution.forEach(function (c) {
    h += '<div class="codeblock"><div class="code-t">' + esc(c[0]) + '</div>' +
      '<pre><code>' + esc(c[1].join('\n')) + '</code></pre>' +
      (c[2] ? '<div class="code-why">' + esc(c[2]) + '</div>' : '') + '</div>';
  });

  return h + '</div>';
}

function codeBlocks(rows, heading, intro) {
  if (!rows || !rows.length) return '';
  var h = '<h2 class="pane-h2">' + esc(heading) + ' <span class="h2-count">' + rows.length + '</span></h2>' +
    (intro ? '<p class="pane-p">' + esc(intro) + '</p>' : '');
  rows.forEach(function (c) {
    h += '<div class="codeblock"><div class="code-t">' + esc(c[0]) + '</div>' +
      '<pre><code>' + esc(c[1].join('\n')) + '</code></pre>' +
      (c[2] ? '<div class="code-why">' + esc(c[2]) + '</div>' : '') + '</div>';
  });
  return h;
}

function twoColTable(rows, heads, boldFirst) {
  var h = '<div class="tbl-wrap"><table><thead><tr>';
  heads.forEach(function (x) { h += '<th>' + esc(x) + '</th>'; });
  h += '</tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td class="' + (boldFirst ? 'fire' : 'trig') + '">' + esc(r[0]) + '</td>' +
      '<td class="trig">' + esc(r[1]) + '</td>' +
      (r.length > 2 ? '<td class="canon">' + esc(r[2]) + '</td>' : '') + '</tr>';
  });
  return h + '</tbody></table></div>';
}

function renderLld() {
  var id = selected('lld'), h = '';

  function head(eyebrow, title, sub) {
    return '<div class="pane-head"><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1>' +
      (sub ? '<p class="pane-sub">' + esc(sub) + '</p>' : '') + '</div>';
  }

  if (id === 'flavours') {
    h += head('LLD', 'The three flavours',
      'Three different rounds wear this name. Confusing them is how people lose it before writing a line.') +
      '<div class="tbl-wrap"><table><thead><tr><th>Flavour</th><th>Who</th><th>Format</th><th>What scores</th></tr></thead><tbody>';
    PLAN.lldFlavours.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
    });
    h += '</tbody></table></div><h2 class="pane-h2">The framework</h2><div class="exit">' +
      esc(PLAN.lldFramework) + '</div>';

  } else if (id === 'script') {
    h += head('LLD', 'The 60-minute script',
      'Run this every time. The last row is the highest-scoring thirty seconds of the round.') +
      '<div class="tbl-wrap"><table><thead><tr><th>Clock</th><th>Phase</th><th>What you actually do</th></tr></thead><tbody>';
    PLAN.lldScript.forEach(function (r) {
      h += '<tr><td class="canon">' + esc(r[0]) + '</td><td class="fire">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (id === 'patterns') {
    h += head('LLD', 'Requirement → pattern',
      'About eight of the 23 GoF patterns actually appear. Learn these and stop.') +
      triTable(PLAN.lldPatterns, ['You hear', 'Reach for', 'Where it shows up']);

  } else if (id === 'solid') {
    h += head('LLD', 'SOLID as refactors',
      'Be able to write the violation and the fix. Definitions score nothing.');
    PLAN.lldSolid.forEach(function (r) {
      h += '<h2 class="pane-h2">' + esc(r[0]) + ' &middot; ' + esc(r[1]) + '</h2>' +
        '<p class="pane-p">' + esc(r[2]) + '</p>' +
        '<div class="codeblock"><pre><code>' + esc(r[3].join('\n')) + '</code></pre></div>';
    });

  } else if (id === 'concurrency') {
    h += head('LLD', 'Concurrency in LLD',
      'The single biggest separator at Amazon. Raise the race before they ask about it.') +
      twoColTable(PLAN.lldConcurrency, ['The race', 'How you close it'], true) +
      '<div class="exit"><b>Practice.</b> Reading about races does not survive "write me a bounded blocking queue". ' +
      'The <b>Tech &rarr; Concurrency</b> module carries ' +
      (function () {
        var s = (PLAN.techProblems || {}).conc, n = 0;
        if (s) s.groups.forEach(function (g) { n += g[2].length; });
        return n;
      })() +
      ' practice problems — the LeetCode concurrency section, the classic whiteboard implementations, ' +
      'and the design problems where thread safety is the actual question.</div>';

  } else if (id === 'checklist') {
    h += head('LLD', 'Class design checklist',
      'Run down this list before you say you are done.') +
      twoColTable(PLAN.lldChecklist, ['Check', 'Why'], true);

  } else if (id === 'rules') {
    h += head('LLD', 'Machine-coding rules',
      'An unfinished elegant design scores below a finished plain one.') + '<ol class="rules">';
    PLAN.lldRules.forEach(function (r) { h += '<li>' + esc(r) + '</li>'; });
    h += '</ol>';

  } else if (id.indexOf('pat-') === 0) {
    var pat = null;
    PLAN.patterns.forEach(function (x) { if ('pat-' + x.id === id) pat = x; });
    h += renderPattern(pat || PLAN.patterns[0]);

  } else {
    var pr = null;
    PLAN.lldProblems.forEach(function (x) { if (x.id === id) pr = x; });
    if (!pr) pr = PLAN.lldProblems[0];
    var key = 'ld-' + pr.id, p = state.problems[key] || {};

    h += '<div class="pane-head">' +
      '<div class="eyebrow">LLD &middot; ' + esc(pr.flavour) + ' &middot; ' + pr.mins + ' min &middot; ' +
      '<span class="chip tier' + (pr.tier === 'b' ? '1' : '3') + '">' +
      (pr.tier === 'b' ? 'tier 1–2' : 'top tier') + '</span></div>' +
      '<h1>' + esc(pr.name) + '</h1>' +
      '<div class="pane-actions">' +
      '<button class="btn ' + (p.done ? 'ok on' : 'primary') + '" data-check="' + key + '">' +
      (p.done ? '✓ Done' : 'Mark done') + '</button>' +
      '<button class="btn" data-open="' + key + '">Log / status</button>' +
      '<span class="dot ' + esc(p.status || '') + '"></span></div></div>';

    if (pr.who) h += '<div class="sd-who"><i>Who asks it</i>' + esc(pr.who) + '</div>';

    h += '<h2 class="pane-h2">Asked as</h2>' + bulletList(pr.asked, 'asked');
    h += '<h2 class="pane-h2">Clarify before you draw anything</h2>' + bulletList(pr.clarify);

    if (pr.entities && pr.entities.length) {
      h += '<h2 class="pane-h2">Entities <span class="h2-count">' + pr.entities.length + '</span></h2>' +
        '<p class="pane-p">Nouns become classes, verbs become methods. Put cardinality on every relationship.</p>' +
        '<div class="tbl-wrap"><table><thead><tr><th>Class</th><th>Kind</th><th>Role</th></tr></thead><tbody>';
      pr.entities.forEach(function (r) {
        h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
          '<td class="trig">' + esc(r[2]) + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    if (pr.patterns && pr.patterns.length) {
      h += '<h2 class="pane-h2">Patterns, and exactly where</h2>' +
        twoColTable(pr.patterns, ['Pattern', 'Applied to'], true);
    }
    h += codeBlocks(pr.code, 'Code you must be able to write',
      'The comments mark where candidates go wrong.');

    if (pr.concurrency && pr.concurrency.length) {
      h += '<h2 class="pane-h2">Concurrency <span class="h2-count">' + pr.concurrency.length + '</span></h2>' +
        '<p class="pane-p">Raise these before you are asked. At Amazon this is the difference between a hire and a no-hire.</p>' +
        twoColTable(pr.concurrency, ['The race', 'How you close it'], true);
    }
    if (pr.extend && pr.extend.length) {
      h += '<h2 class="pane-h2">"Now add X" <span class="h2-count">' + pr.extend.length + '</span></h2>' +
        '<p class="pane-p">Showing one extension is the highest-scoring thirty seconds of the round.</p>' +
        twoColTable(pr.extend, ['They ask for', 'You answer'], true);
    }
    if (pr.cross && pr.cross.length) {
      h += '<h2 class="pane-h2">Cross-questions <span class="h2-count">' + pr.cross.length + '</span></h2>';
      pr.cross.forEach(function (r) {
        h += '<div class="qa static"><div class="qa-body">' +
          '<b class="qa-q">' + esc(r[0]) + '</b>' +
          '<span class="qa-f">' + esc(r[1]) + '</span></div></div>';
      });
    }
    if (pr.fail && pr.fail.length) {
      h += '<h2 class="pane-h2">What sinks candidates here</h2>' + bulletList(pr.fail, 'fail');
    }

    h += renderSolution(pr.id);

    h += '<div class="field pane-notes"><label>Your design + what you got wrong</label>' +
      '<textarea data-note="' + key + '" placeholder="Every LLD session ends with code that runs.">' +
      esc(state.notes[key] || '') + '</textarea></div>';
  }

  h += pagerFor('lld');
  $('#view-lld').innerHTML = h;
}

/* -------------------------------------------------------------- tech --- */
/* a practice-problem block on a tech module page */
function practiceProblems(modId) {
  var set = (PLAN.techProblems || {})[modId];
  if (!set) return '';

  var total = 0;
  set.groups.forEach(function (g) { total += g[2].length; });

  var h = '<h2 class="pane-h2">Practice problems <span class="h2-count">' + total + '</span></h2>' +
    '<p class="pane-p">' + esc(set.intro) + '</p>';

  set.groups.forEach(function (g, gi) {
    h += '<h3 class="prac-h">' + esc(g[0]) + '</h3>' +
      '<p class="pane-p">' + esc(g[1]) + '</p>';
    g[2].forEach(function (r, i) {
      var key = 'pp-' + modId + '-' + gi + '-' + i;
      var p = state.problems[key] || {};
      var diffCls = { E: 'e', M: 'm', H: 'h' }[r[2]] || '';
      h += '<div class="prow' + (p.done ? ' done' : '') + '" data-open="' + key + '">' +
        '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
        '<span class="diff ' + diffCls + '">' + esc(r[2] || '') + '</span>' +
        (r[0] != null
          ? problemLinks(r[0], r[1])
          : '<a class="p-lc lnk" href="https://www.google.com/search?q=' +
            encodeURIComponent('java ' + r[1] + ' implementation interview') +
            '" target="_blank" rel="noopener" title="No LeetCode equivalent — search">impl</a>' +
            '<span class="p-gfg" style="opacity:.35">—</span>') +
        '<span class="p-name">' + esc(r[1]) + '</span>' +
        (r[3] ? '<span class="p-note">' + esc(r[3]) + '</span>' : '') +
        '<span class="dot ' + esc(p.status || '') + '"></span></div>';
    });
  });

  if (set.drill && set.drill.length) {
    h += '<h3 class="prac-h">How to work them</h3>' + bulletList(set.drill);
  }
  return h;
}

function renderTech() {
  var id = selected('tech');
  var m = null;
  PLAN.tech.forEach(function (x) { if (x.id === id) m = x; });
  if (!m) m = PLAN.tech[0];

  var done = m.qa.filter(function (_, i) { var p = state.problems['tq-' + m.id + '-' + i]; return p && p.done; }).length;

  var h = '<div class="pane-head">' +
    '<div class="eyebrow">Tech &middot; module ' + m.n + ' of ' + PLAN.tech.length +
    ' &middot; ' + m.hrs + ' hours &middot; <span class="chip ph' + m.phase + '">phase ' + m.phase + '</span></div>' +
    '<h1>' + esc(m.name) + '</h1>' +
    '<div class="pane-stats"><span><b>' + done + '</b>/' + m.qa.length + ' answered cold</span>' +
    (m.code ? '<span><b>' + m.code.length + '</b> code patterns</span>' : '') +
    (m.traps ? '<span><b>' + m.traps.length + '</b> traps</span>' : '') +
    '</div></div>';

  if (m.note) h += '<div class="learn"><b>Note.</b> ' + esc(m.note) + '</div>';

  if (m.asked && m.asked.length) {
    h += '<h2 class="pane-h2">How the interview opens</h2>' + bulletList(m.asked, 'asked');
  }

  if (m.code && m.code.length) {
    h += '<h2 class="pane-h2">Patterns you must be able to write <span class="h2-count">' +
      m.code.length + '</span></h2>' +
      '<p class="pane-p">Type these from memory, not from a snippet file. The comments mark where candidates go wrong.</p>';
    m.code.forEach(function (c) {
      h += '<div class="codeblock">' +
        '<div class="code-t">' + esc(c[0]) + '</div>' +
        '<pre><code>' + esc(c[1].join('\n')) + '</code></pre>' +
        (c[2] ? '<div class="code-why">' + esc(c[2]) + '</div>' : '') +
        '</div>';
    });
  }

  h += '<h2 class="pane-h2">Question &rarr; spine &rarr; follow-up <span class="h2-count">' + m.qa.length + '</span></h2>' +
    '<p class="pane-p"><b>Learn the follow-up.</b> Anyone can answer the first question.</p>';
  m.qa.forEach(function (r, i) {
    var key = 'tq-' + m.id + '-' + i, p = state.problems[key] || {};
    h += '<div class="qa' + (p.done ? ' done' : '') + '">' +
      '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
      '<div class="qa-body" data-open="' + key + '">' +
      '<b class="qa-q">' + esc(r[0]) + '</b>' +
      '<span class="qa-a">' + esc(r[1]) + '</span>' +
      (r[2] ? '<span class="qa-f"><i>follow-up →</i> ' + esc(r[2]) + '</span>' : '') +
      '</div><span class="dot ' + esc(p.status || '') + '"></span></div>';
  });

  if (m.traps && m.traps.length) {
    h += '<h2 class="pane-h2">Traps that bite <span class="h2-count">' + m.traps.length + '</span></h2>' +
      bulletList(m.traps, 'fail');
  }

  h += practiceProblems(m.id);

  h += readingList((PLAN.techRead || {})[m.id], 'Read more');

  h += '<div class="field pane-notes"><label>Hands-on artefact / notes</label>' +
    '<textarea data-note="mod-' + m.id + '" placeholder="What you actually built or broke. Not a summary of what you read.">' +
    esc(state.notes['mod-' + m.id] || '') + '</textarea></div>';

  h += pagerFor('tech');
  $('#view-tech').innerHTML = h;
}

/* ------------------------------------------------------------ weekly --- */
function goalRow(g) {
  var done = goalDone(g);
  var cls = g.type === 'pattern' ? 'pat' : g.type === 'template' ? 'tpl' : '';
  var h = '<div class="prow' + (done ? ' done' : '') + '"' +
    (g.type === 'problem' ? ' data-open="' + esc(g.key) + '"' : '') + '>';
  if (g.type === 'problem') {
    h += '<button class="cb" data-check="' + esc(g.key) + '">' + (done ? '✓' : '') + '</button>';
  } else if (g.type === 'pattern') {
    h += '<button class="cb" data-patq="' + esc(g.key) + '">' + (done ? '✓' : '') + '</button>';
  } else {
    h += '<button class="cb" data-tplq="' + esc(g.key) + '">' + (done ? '✓' : '') + '</button>';
  }
  h += (g.lc != null ? problemLinks(g.lc, g.name) : '') +
    '<span class="wk-src">' + esc(g.group) + '</span>' +
    '<span class="p-name">' + esc(g.label) + '</span>' +
    (g.note ? '<span class="p-note">' + esc(g.note) + '</span>' : '') + '</div>';
  return h;
}

function renderWeekList(items, emptyMsg) {
  if (!items.length) return '<p class="dim">' + esc(emptyMsg) + '</p>';
  var byGroup = {}, order = [];
  items.forEach(function (g) {
    if (!byGroup[g.group]) { byGroup[g.group] = []; order.push(g.group); }
    byGroup[g.group].push(g);
  });
  var h = '';
  order.forEach(function (grp) {
    var gi = byGroup[grp], d = gi.filter(goalDone).length;
    h += '<h3 class="prac-h">' + esc(grp) + ' <span class="h2-count">' + d + '/' + gi.length + '</span></h3>';
    gi.forEach(function (g) { h += goalRow(g); });
  });
  return h;
}

function renderWeekly() {
  var ws = buildWeeks();
  var sel = parseInt(selected('weekly'), 10);
  if (isNaN(sel)) sel = currentWeek();
  var wk = ws[sel - 1] || ws[0];
  var pr = weekProgress(wk);
  var open = weekUnlocked(wk.n);
  var byDate = weekByDate();

  var h = '<div class="pane-head">' +
    '<div class="eyebrow">Weekly goal &middot; week ' + wk.n + ' of ' + WEEKS +
    ' &middot; <span class="chip ph' + wk.phase + '">phase ' + wk.phase + '</span></div>' +
    '<h1>Week ' + wk.n + '</h1>' +
    '<p class="pane-sub">Gated by completion, not by the calendar. ' +
    'If you stay on schedule this lands around ' + fmtDate(wk.from) + ' – ' + fmtDate(wk.to) + '.</p>';

  if (!open) {
    var blocker = wk.n - 1;
    var bp = weekProgress(ws[blocker - 1]);
    h += '<div class="wk-locked"><b>Locked.</b> Finish <b>week ' + blocker + '</b> first — ' +
      'it is at <b>' + bp.core + '/' + bp.coreTotal + '</b> core goals. ' +
      'One week at a time, no jumping around: that is the point of this page.' +
      '<div class="btnrow" style="margin-top:14px">' +
      '<button class="btn warn" data-unlock="' + wk.n + '">Unlock anyway</button></div>' +
      '<p class="dim" style="margin-top:10px;font-size:12.5px">The override exists so a week you cannot finish ' +
      'never traps you permanently. Use it deliberately, not habitually.</p></div></div>';
    h += pagerFor('weekly');
    $('#view-weekly').innerHTML = h;
    return;
  }

  h += '<div class="pane-stats">' +
    '<span><b>' + pr.core + '</b>/' + pr.coreTotal + ' core</span>' +
    '<span><b>' + pr.addon + '</b>/' + pr.addonTotal + ' addon</span>' +
    (pr.complete ? '<span class="ok-txt"><b>week complete</b></span>' : '') +
    '</div>';

  var cp = pr.coreTotal ? pr.core / pr.coreTotal : 0;
  h += '<div class="co-bar" style="margin-top:14px"><i style="width:' +
    (cp > 0 ? Math.max(0.8, cp * 100).toFixed(1) : 0) + '%"></i></div>';

  if (byDate !== wk.n && wk.n === currentWeek()) {
    h += '<div class="warnbox" style="margin-top:16px">By the calendar you are in <b>week ' + byDate +
      '</b>, but by completion you are on <b>week ' + wk.n + '</b>. ' +
      (byDate > wk.n ? 'You are behind — cut addons before you cut core.'
                     : 'You are ahead. Do the addons rather than racing forward.') + '</div>';
  }
  h += '</div>';

  h += '<h2 class="pane-h2">Core — required to unlock week ' + (wk.n + 1) +
    ' <span class="h2-count">' + pr.core + '/' + pr.coreTotal + '</span></h2>' +
    renderWeekList(wk.core, 'Nothing core this week.');

  h += '<h2 class="pane-h2">Addons — optional this week, but they ARE the rest of the sheet' +
    ' <span class="h2-count">' + pr.addon + '/' + pr.addonTotal + '</span></h2>' +
    '<p class="pane-p">Block C, pattern drills, blind prompts and company packs. Skipping them is a legitimate ' +
    'choice under time pressure; finishing all of them is finishing those sections outright.</p>' +
    renderWeekList(wk.addon, 'No addons this week.');

  if (pr.complete) {
    h += '<div class="wk-done"><b>Week ' + wk.n + ' core is complete.</b> ' +
      (wk.n < WEEKS ? 'Week ' + (wk.n + 1) + ' is unlocked.' : 'That is the whole plan.') + '</div>';
  }

  h += '<div class="field pane-notes"><label>What actually happened this week</label>' +
    '<textarea data-note="week-' + wk.n + '" placeholder="What you cut. What to redo. What surprised you.">' +
    esc(state.notes['week-' + wk.n] || '') + '</textarea></div>';

  h += pagerFor('weekly');
  $('#view-weekly').innerHTML = h;
}

/* --------------------------------------------------------- The Method --- */
function mHead(eyebrow, title, sub) {
  return '<div class="pane-head"><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1>' +
    (sub ? '<p class="pane-sub">' + esc(sub) + '</p>' : '') + '</div>';
}
function numTable(rows, heads) {
  var h = '<div class="tbl-wrap"><table><thead><tr>';
  heads.forEach(function (x) { h += '<th>' + esc(x) + '</th>'; });
  h += '</tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td>';
    for (var i = 1; i < r.length; i++) {
      h += '<td class="' + (i === r.length - 1 && r.length > 2 ? 'canon' : 'trig') + '">' + esc(r[i]) + '</td>';
    }
    h += '</tr>';
  });
  return h + '</tbody></table></div>';
}

function renderMethod() {
  var id = selected('method'), M = PLAN.method, h = '';

  if (id === 'why') {
    h += mHead('The Method', 'Why this section exists',
      'Every other section teaches machinery through named problems. Real rounds hand you a system nobody has blogged about.');
    h += '<div class="learn">' + esc(M.altitude.evidence) + '</div>';
    h += '<h2 class="pane-h2">The claim</h2>' +
      '<p class="pane-p">The <b>problem</b> is volatile. The <b>machinery</b> is not. An audio-buffer pipeline is bounded ' +
      'buffers with backpressure. A playlist mixer is a k-way merge with a ratio strategy and a filter chain. A locker ' +
      'system is atomic allocation with an expiring token. None of those appear on a prep list; all of them are made of ' +
      'parts you already have.</p>' +
      '<p class="pane-p">This section is the procedure for getting from an unheard-of prompt to those parts. Work it in ' +
      'order, mechanically, especially when it feels slow.</p>';
    h += '<h2 class="pane-h2">The honest limit</h2><div class="exit">The method is teachable and it is written down here. ' +
      'The <b>fluency is not</b> — that comes from running unseen prompts under a clock, recorded, scored against the ' +
      'rubric. Ten of those is worth more than the next fifty named problems.</div>';

  } else if (id === 'altitude') {
    h += mHead('The Method', 'Altitude control', M.altitude.intro);
    h += '<div class="lp-weak">' + esc(M.altitude.evidence) + '</div>';
    h += '<h2 class="pane-h2">The three levels</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Level</th><th>What lives here</th><th>Prompt sounds like</th>' +
      '<th>You are drifting if you…</th></tr></thead><tbody>';
    M.altitude.levels.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td>' +
        '<td class="canon">' + esc(r[2]) + '</td><td class="canon">' + esc(r[3]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<h2 class="pane-h2">How to tell which one they want</h2>' +
      numTable(M.altitude.signals, ['Signal', 'Level', 'What to do']);
    h += '<h2 class="pane-h2">The check — ask this in the first minute</h2>' +
      '<div class="soln-quote">' + esc(M.altitude.theCheck) + '</div>';
    h += '<h2 class="pane-h2">Recovering when you are at the wrong level</h2>' +
      numTable(M.altitude.recovery, ['Situation', 'What to do']);
    h += '<h2 class="pane-h2">The specific trap</h2><div class="lp-weak">' + esc(M.altitude.drift) + '</div>';

  } else if (id === 'decompose') {
    h += mHead('The Method', 'Decomposition', M.decompose.intro);
    h += '<h2 class="pane-h2">System design — in this order</h2>' +
      numTable(M.decompose.hld, ['Step', 'What you do']);
    h += '<h2 class="pane-h2">Object design — in this order</h2>' +
      numTable(M.decompose.lld, ['Step', 'What you do']);
    h += '<h2 class="pane-h2">When the domain is unfamiliar</h2><div class="exit">' +
      esc(M.decompose.unknownShape) + '</div>';

  } else if (id === 'primitives') {
    h += mHead('The Method', 'The primitive catalogue', M.primitives.intro);
    h += '<div class="learn">' + esc(M.primitives.note) + '</div>';
    h += '<div class="tbl-wrap"><table><thead><tr><th>Primitive</th><th>What it is for</th>' +
      '<th>Reach for it when</th><th>WRONG choice when</th><th>It costs you</th></tr></thead><tbody>';
    M.primitives.rows.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td>' +
        '<td class="canon">' + esc(r[2]) + '</td><td class="wrong-cell">' + esc(r[3]) + '</td>' +
        '<td class="canon">' + esc(r[4]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (id === 'failures') {
    h += mHead('The Method', 'Failure generator', M.failures.intro);
    h += '<div class="learn"><b>How to run it.</b> ' + esc(M.failures.how) + '</div>';
    h += '<h2 class="pane-h2">The eleven questions</h2>' +
      numTable(M.failures.loop, ['', 'Ask', 'What it forces you to answer']);
    h += '<h2 class="pane-h2">The offline family</h2>' +
      '<p class="pane-p">' + esc(M.failures.offlineFamily.intro) + '</p>' +
      numTable(M.failures.offlineFamily.rows, ['Aspect', 'The question']);
    h += '<h2 class="pane-h2">You will not have time for all of it</h2>' +
      '<div class="exit">' + esc(M.failures.pickTwo) + '</div>';

  } else if (id === 'ambiguity') {
    h += mHead('The Method', 'The first three minutes', M.ambiguity.intro);
    h += '<h2 class="pane-h2">The protocol</h2>' + numTable(M.ambiguity.steps, ['Step', 'What you say']);
    h += '<h2 class="pane-h2">What not to do</h2>' + bulletList(M.ambiguity.dontDo, 'fail');
    h += '<h2 class="pane-h2">When the requirements are handed to you</h2>' +
      '<div class="lp-weak">' + esc(M.ambiguity.whenGivenRequirements) + '</div>';

  } else if (id === 'domain') {
    h += mHead('The Method', 'Unknown domain', M.domain.intro);
    h += '<h2 class="pane-h2">Translate it, do not learn it</h2>' +
      numTable(M.domain.translate, ['Ask', 'What it maps to']);
    h += '<h2 class="pane-h2">Say it out loud</h2><div class="soln-quote">' + esc(M.domain.script) + '</div>';
    h += '<h2 class="pane-h2">Rules</h2>' + bulletList(M.domain.rules);

  } else if (id === 'product') {
    h += mHead('The Method', 'Product thinking', M.product.intro);
    h += '<h2 class="pane-h2">The frame</h2>' + numTable(M.product.frame, ['Ask yourself', 'Because']);
    h += '<h2 class="pane-h2">Worked answers</h2>';
    M.product.examples.forEach(function (r) {
      h += '<div class="qa static"><div class="qa-body"><b class="qa-q">' + esc(r[0]) + '</b>' +
        '<span class="qa-f">' + esc(r[1]) + '</span></div></div>';
    });
    h += '<h2 class="pane-h2">The tell</h2><div class="lp-weak">' + esc(M.product.tell) + '</div>';

  } else if (id === 'worked') {
    h += mHead('The Method', 'A worked round', M.worked.prompt);
    h += '<div class="learn">' + esc(M.worked.note) + '</div>';
    M.worked.beats.forEach(function (b) {
      h += '<h2 class="pane-h2">' + esc(b[0]) + '</h2>' +
        '<div class="lp-said">' + esc(b[1]) + '</div>' +
        '<div class="lp-why"><i>what the method is doing here</i>' + esc(b[2]) + '</div>';
    });
    h += '<h2 class="pane-h2">What the method did</h2><div class="exit">' + esc(M.worked.whatTheMethodDid) + '</div>';

  } else if (id === 'blind') {
    var total = 0;
    M.blind.groups.forEach(function (g) { total += g[2].length; });
    h += mHead('The Method', 'Blind prompt bank',
      total + ' prompts, no solutions — deliberately. Solutions would turn this back into a list of named problems.');
    h += '<h2 class="pane-h2">How to work them</h2>' + bulletList(M.blind.rules);
    M.blind.groups.forEach(function (g, gi) {
      h += '<h2 class="pane-h2">' + esc(g[0]) + ' <span class="h2-count">' + g[2].length + '</span></h2>' +
        '<p class="pane-p">' + esc(g[1]) + '</p>';
      g[2].forEach(function (p, i) {
        var key = 'bp-' + gi + '-' + i, st = state.problems[key] || {};
        h += '<div class="prow' + (st.done ? ' done' : '') + '" data-open="' + key + '">' +
          '<button class="cb" data-check="' + key + '">' + (st.done ? '✓' : '') + '</button>' +
          '<span class="p-name">' + esc(p) + '</span>' +
          '<span class="dot ' + esc(st.status || '') + '"></span></div>';
      });
    });
    h += '<button class="btn primary" id="pick-blind" style="margin-top:24px">Pick one at random</button> ' +
      '<span id="picked-blind" class="mono" style="margin-left:10px"></span>';

  } else {
    h += mHead('The Method', 'The rubric', M.rubric.intro);
    h += '<div class="tbl-wrap"><table><thead><tr><th>Row</th><th>Pts</th><th>What earns it</th></tr></thead><tbody>';
    M.rubric.rows.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<h2 class="pane-h2">Bands</h2>' + numTable(M.rubric.bands, ['Score', 'Read']);
    h += '<h2 class="pane-h2">Keep a log</h2><div class="exit">' + esc(M.rubric.log) + '</div>';
  }

  h += pagerFor('method');
  $('#view-method').innerHTML = h;

  var pb = $('#pick-blind');
  if (pb) pb.onclick = function () {
    var all = [];
    M.blind.groups.forEach(function (g) { g[2].forEach(function (p) { all.push(p); }); });
    $('#picked-blind').textContent = '→ ' + all[Math.floor(Math.random() * all.length)];
  };
}

/* ------------------------------------------------------- COMPANIES LP ---
   One story bank, eleven rubrics. Selection ids:
     co-<id>          the company overview
     <coid>:<page>    a page for that company
     <coid>:v-<vid>   one value / principle page
     bank | mining | schedule | u-*   shared across every company          */
function lpHead(eyebrow, title, sub) {
  return '<div class="pane-head"><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1>' +
    (sub ? '<p class="pane-sub">' + esc(sub) + '</p>' : '') + '</div>';
}

/* the active company is read from the raw selection, so navModel can build
   its own sub-nav without recursing through selected() */
function lpCoId() {
  var s = (state.ui.sel && state.ui.sel.lp) || '', id = '';
  var m = /^co-(.+)$/.exec(s);
  if (m) id = m[1];
  else if (s.indexOf(':') > 0) id = s.slice(0, s.indexOf(':'));
  var ok = false;
  PLAN.lp.co.forEach(function (c) { if (c.id === id) ok = true; });
  return ok ? id : 'amazon';
}
function lpCo() {
  var id = lpCoId(), out = PLAN.lp.co[0];
  PLAN.lp.co.forEach(function (c) { if (c.id === id) out = c; });
  return out;
}

function renderLpStory(i) {
  var slot = PLAN.lp.slots[i];
  var key = 'lp-story-' + i;
  var p = state.problems[key] || {};
  var open = !!state.ui.open[key];
  var fields = [
    ['title',     'Story title (how you will refer to it)'],
    ['situation', 'S — Situation (15 sec, context only)'],
    ['task',      'T — Task (15 sec, YOUR responsibility)'],
    ['action',    'A — Action (60–75 sec, first person, decisions and alternatives)'],
    ['result',    'R — Result (20 sec, WITH NUMBERS)'],
    ['learning',  'L — Learning (what you would do differently)'],
    ['probes',    'Answers to the six probes you expect']
  ];
  var filled = fields.filter(function (f) {
    return (state.notes[key + '-' + f[0]] || '').trim().length > 0;
  }).length;

  var h = '<div class="lp-slot' + (open ? ' open' : '') + (p.done ? ' done' : '') + '">' +
    '<div class="lp-slot-head">' +
    '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
    '<button class="lp-slot-btn" data-lpstory="' + i + '">' +
    '<span class="chev">▶</span>' +
    '<span class="lp-slot-t"><b>' + (i + 1) + '. ' + esc(slot[0]) + '</b>' +
    '<span>' + esc(slot[1]) + '</span></span>' +
    '<span class="lp-fill">' + filled + '/' + fields.length + '</span></button></div>';

  if (open) {
    h += '<div class="lp-slot-body"><div class="exit">' + esc(slot[2]) + '</div>';
    fields.forEach(function (f) {
      var nk = key + '-' + f[0];
      h += '<div class="field"><label>' + esc(f[1]) + '</label>' +
        '<textarea data-note="' + nk + '" rows="' + (f[0] === 'action' || f[0] === 'probes' ? 6 : 3) + '">' +
        esc(state.notes[nk] || '') + '</textarea></div>';
    });
    h += '</div>';
  }
  return h + '</div>';
}

/* ---- the shared pages ---- */
function renderLpShared(id) {
  var U = PLAN.lp.universal, h = '';

  if (id === 'bank') {
    var doneCount = 0;
    PLAN.lp.slots.forEach(function (_, i) {
      var p = state.problems['lp-story-' + i];
      if (p && p.done) doneCount++;
    });
    h += lpHead('Shared · every company', 'The story bank',
      'Fifteen slots, and they serve all eleven rubrics. Write the story once; recut the emphasis per room.');
    h += '<div class="pane-stats"><span><b>' + doneCount + '</b>/' + PLAN.lp.slots.length + ' rehearsed</span></div>';
    PLAN.lp.slots.forEach(function (_, i) { h += renderLpStory(i); });

  } else if (id === 'u-shapes') {
    h += lpHead('Shared · every company', 'The ten shapes', U.coverage.intro);
    h += '<div class="tbl-wrap"><table><thead><tr><th>Story shape</th><th>Covers</th><th>Note</th></tr></thead><tbody>';
    U.coverage.shapes.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div><div class="exit">' + esc(U.coverage.rule) + '</div>';

  } else if (id === 'u-recut') {
    h += lpHead('Shared · every company', 'The recut matrix', U.recut.intro);
    h += '<div class="learn">' + esc(U.recut.note) + '</div>';
    h += '<div class="tbl-wrap"><table><thead><tr><th>Room</th><th>Register</th><th>Add</th><th>Remove</th></tr></thead><tbody>';
    U.recut.rows.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td><td class="trig">' + esc(r[3]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<h2 class="pane-h2">One event, four rooms</h2><p class="pane-p">' + esc(U.recut.worked.intro) + '</p>';
    U.recut.worked.rows.forEach(function (r) {
      h += '<h3 class="pane-h3">' + esc(r[0]) + '</h3><div class="lp-said">' + esc(r[1]) + '</div>';
    });

  } else if (id === 'mining') {
    h += lpHead('Shared · every company', 'Where to mine stories',
      'You already have fifteen stories. They are in systems you may lose access to.');
    h += '<div class="tbl-wrap"><table><thead><tr><th>Source</th><th>What is in there</th></tr></thead><tbody>';
    PLAN.lp.mining.forEach(function (r) {
      h += '<tr class="' + (r[0] === 'WARNING' ? 'hot' : '') + '"><td class="fire">' + esc(r[0]) + '</td>' +
        '<td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (id === 'schedule') {
    h += lpHead('Shared · every company', 'Writing cadence',
      'Fifteen stories in one weekend does not work. This is the cadence that does. Per-company recuts are on each company’s own schedule page.');
    h += '<div class="tbl-wrap"><table><thead><tr><th>When</th><th>What</th><th>Note</th></tr></thead><tbody>';
    PLAN.lp.plan.forEach(function (r) {
      h += '<tr><td class="canon">' + esc(r[0]) + '</td><td class="fire">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (id === 'u-openers') {
    h += lpHead('Every loop', 'The four openers', U.openers.intro);
    U.openers.rows.forEach(function (r) {
      h += '<h2 class="pane-h2">' + esc(r[0]) + '</h2><p class="pane-p">' + esc(r[1]) + '</p>' +
        '<div class="exit">' + esc(r[2]) + '</div>';
    });
    h += '<h2 class="pane-h2">Questions worth asking</h2><p class="pane-p">' + esc(U.openers.questions.intro) + '</p>';
    h += '<div class="tbl-wrap"><table><thead><tr><th>Ask</th><th>What it tells you</th></tr></thead><tbody>';
    U.openers.questions.rows.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (id === 'u-screen') {
    h += lpHead('Every loop', 'The recruiter screen', U.screen.intro);
    h += '<div class="tbl-wrap"><table><thead><tr><th></th><th>What to do</th></tr></thead><tbody>';
    U.screen.rows.forEach(function (r) {
      h += '<tr class="' + (r[0] === 'Never do this' ? 'hot' : '') + '"><td class="fire">' + esc(r[0]) + '</td>' +
        '<td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else {
    h += lpHead('Every loop', 'Offers and negotiation', U.offer.intro);
    h += '<div class="tbl-wrap"><table><thead><tr><th></th><th>What to do</th></tr></thead><tbody>';
    U.offer.rows.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
  }
  return h;
}

/* ---- one company ---- */
function renderLpCompany(co, page) {
  var h = '';

  if (page === '') {                                     /* the overview */
    h += '<div class="pane-head"><div class="eyebrow">' + esc(co.rung) + ' &middot; ' + esc(co.label) +
      '</div><h1>' + esc(co.name) + '</h1><p class="pane-sub">' + esc(co.oneLine) + '</p></div>';
    h += '<div class="learn"><b>What it is worth.</b> ' + esc(co.weight) + '</div>';
    h += '<h2 class="pane-h2">The rubric, in one table</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th></th><th>Value</th><th>Freq</th><th>What it actually means</th></tr></thead><tbody>';
    co.values.forEach(function (v) {
      h += '<tr><td class="canon">' + v.n + '</td>' +
        '<td class="fire"><button class="lnk-btn" data-nav="' + esc(co.id + ':v-' + v.id) + '">' + esc(v.name) + '</button></td>' +
        '<td class="canon"><span class="chip freq-' + v.freq + '">' + v.freq + '</span></td>' +
        '<td class="trig">' + esc(v.means) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<h2 class="pane-h2">How this room differs from the others</h2><div class="exit">' + esc(co.contrast) + '</div>';
    h += '<h2 class="pane-h2">How much of this is published</h2><div class="sd-who"><i>source and confidence</i>' +
      esc(co.source) + '</div>';

  } else if (page === 'scoring') {
    h += lpHead(co.name, 'How it is scored', co.scoring.intro);
    h += '<h2 class="pane-h2">Where it happens</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Round</th><th>Time</th><th>What happens</th></tr></thead><tbody>';
    co.scoring.rounds.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<h2 class="pane-h2">What they are actually scoring</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th></th><th>Why it matters</th></tr></thead><tbody>';
    co.scoring.rubric.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<h2 class="pane-h2">Things nobody tells you</h2>' + bulletList(co.scoring.reality, 'fail');

  } else if (page === 'framework') {
    var F = co.framework;
    h += lpHead(co.name, 'The story format', F.intro);
    h += '<div class="tbl-wrap"><table><thead><tr><th>Part</th><th>Budget</th><th>What goes in it</th></tr></thead><tbody>';
    F.parts.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<div class="learn"><b>Timing.</b> ' + esc(F.timing) + '</div>';
    h += '<h2 class="pane-h2">Rules for this room</h2><ol class="rules">';
    F.rules.forEach(function (r) { h += '<li>' + esc(r) + '</li>'; });
    h += '</ol>';

  } else if (page === 'probes') {
    h += lpHead(co.name, 'The follow-up probes', co.probes.intro);
    co.probes.groups.forEach(function (g) {
      h += '<h2 class="pane-h2">' + esc(g[0]) + '</h2>' + bulletList(g[1], 'asked');
    });
    h += '<h2 class="pane-h2">How to handle them</h2>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Situation</th><th>What to do</th></tr></thead><tbody>';
    co.probes.tactics.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (page === 'anti') {
    h += lpHead(co.name, 'Anti-patterns',
      co.anti.length + ' ways candidates lose this round. They are not the same ' + co.anti.length + ' at the next company.');
    co.anti.forEach(function (r, i) {
      h += '<h2 class="pane-h2">' + (i + 1) + '. ' + esc(r[0]) + '</h2>' +
        '<p class="pane-p">' + esc(r[1]) + '</p>' +
        '<div class="exit">' + esc(r[2]) + '</div>';
    });

  } else if (page === 'worked') {
    var w = co.worked;
    h += lpHead(co.name, 'A worked story',
      'One complete answer, cut for this room. The right column is why each part is shaped that way.');
    h += '<div class="learn"><b>Question.</b> ' + esc(w.question) + '<br><b>Scoring against.</b> ' + esc(w.principle) + '</div>';
    w.story.forEach(function (s) {
      h += '<h2 class="pane-h2">' + esc(s[0]) + '</h2>' +
        '<div class="lp-said">' + esc(s[1]) + '</div>' +
        '<div class="lp-why"><i>why it is shaped this way</i>' + esc(s[2]) + '</div>';
    });
    h += '<h2 class="pane-h2">The probes, and how they are answered</h2>';
    w.probesAndAnswers.forEach(function (r) {
      h += '<div class="qa static"><div class="qa-body"><b class="qa-q">' + esc(r[0]) + '</b>' +
        '<span class="qa-f">' + esc(r[1]) + '</span></div></div>';
    });
    h += '<h2 class="pane-h2">Why this one works here</h2><div class="exit">' + esc(w.why) + '</div>';

  } else if (page === 'coverage') {
    h += lpHead(co.name, 'Coverage matrix',
      'Interviewers compare notes at debrief. A value with no story is a visible gap; four stories for one value is one data point.');
    h += '<div class="tbl-wrap"><table><thead><tr><th>' + esc(co.label) + '</th><th>Freq</th><th>Slots that can cover it</th></tr></thead><tbody>';
    co.values.forEach(function (v) {
      var hits = [];
      PLAN.lp.slots.forEach(function (s, i) {
        var hay = (s[0] + ' ' + s[1] + ' ' + s[2]).toLowerCase();
        var needle = v.name.toLowerCase().replace(/^we /, '');
        if (hay.indexOf(needle) >= 0) hits.push(i + 1);
      });
      h += '<tr><td class="fire">' + esc(v.name) + '</td>' +
        '<td class="canon"><span class="chip freq-' + v.freq + '">' + v.freq + '</span></td>' +
        '<td class="' + (hits.length ? 'trig' : 'canon') + '">' +
        (hits.length ? 'slots ' + hits.join(', ') : '&mdash; recut an existing story, or write one') + '</td></tr>';
    });
    h += '</tbody></table></div>' +
      '<div class="exit"><b>The target.</b> Every high-frequency value covered by at least two different stories, ' +
      'and no single story doing more than three. Where a slot is blank, start from ' +
      '<button class="lnk-btn" data-nav="u-shapes">the ten shapes</button> rather than from a new event.</div>';

  } else {                                                    /* prep */
    h += lpHead(co.name, 'The schedule', 'What to do for this room, and when. The shared writing cadence is under Your stories.');
    h += '<div class="tbl-wrap"><table><thead><tr><th>When</th><th>What</th><th>Note</th></tr></thead><tbody>';
    co.prep.forEach(function (r) {
      h += '<tr><td class="canon">' + esc(r[0]) + '</td><td class="fire">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';
  }
  return h;
}

/* ---- one value / principle ---- */
function renderLpValue(co, v) {
  var h = '<div class="pane-head"><div class="eyebrow">' + esc(co.name) + ' &middot; ' + esc(co.label) +
    ' ' + v.n + ' of ' + co.values.length + ' &middot; ' +
    '<span class="chip freq-' + v.freq + '">' + v.freq + ' frequency</span></div>' +
    '<h1>' + esc(v.name) + '</h1>' +
    '<p class="pane-sub">' + esc(v.means) + '</p></div>';

  h += '<div class="lp-official"><i>how ' + esc(co.name) + ' words it</i>' + esc(v.official) + '</div>';
  h += '<h2 class="pane-h2">What they are actually testing</h2><div class="learn">' + esc(v.signal) + '</div>';
  h += '<h2 class="pane-h2">How it is asked</h2>' + bulletList(v.asked, 'asked');
  h += '<h2 class="pane-h2">The probes that follow</h2>' + bulletList(v.probes);
  h += '<h2 class="pane-h2">Strong vs weak</h2>' +
    '<div class="learn"><b>Strong.</b> ' + esc(v.strong) + '</div>' +
    '<div class="lp-weak"><b>Weak.</b> ' + esc(v.weak) + '</div>';
  h += '<h2 class="pane-h2">Usually pairs with</h2><div class="exit">' + esc(v.pairs) + '</div>';
  if (v.yourAngle) {
    h += '<h2 class="pane-h2">Your angle</h2><div class="sd-who"><i>from your own work</i>' + esc(v.yourAngle) + '</div>';
  }
  return h;
}

function renderLp() {
  var id = selected('lp'), h = '';
  var SHARED = ['bank', 'mining', 'schedule', 'u-shapes', 'u-recut', 'u-openers', 'u-screen', 'u-offer'];

  if (SHARED.indexOf(id) >= 0) {
    h = renderLpShared(id);
  } else {
    var co = lpCo(), page = '';
    var i = id.indexOf(':');
    if (i > 0) page = id.slice(i + 1);
    if (page.slice(0, 2) === 'v-') {
      var vid = page.slice(2), val = co.values[0];
      co.values.forEach(function (x) { if (x.id === vid) val = x; });
      h = renderLpValue(co, val);
    } else {
      h = renderLpCompany(co, page);
    }
  }

  h += pagerFor('lp');
  $('#view-lp').innerHTML = h;
}

/* ---------------------------------------------------------- revision --- */
function renderRevision() {
  var due = dueReviews();
  var h = '<div class="card"><div class="card-head"><h2>Spaced repetition</h2><span class="spacer"></span>' +
    '<span class="dim">+1 · +3 · +7 · +16 days</span></div>' +
    '<p class="dim">Marking an attempt <b>ugly</b> or <b>failed</b> schedules four blank-file re-solves automatically. ' +
    'Three re-solves of one hard problem beats one solve each of three hard problems. This is the highest-leverage rule ' +
    'in the plan and it is the one people skip.</p></div>';

  if (!due.length) {
    h += '<div class="card"><p class="dim">Nothing due. Either you are on top of it, or you have not rated anything yet ' +
      '— open an item and set its status.</p></div>';
  } else {
    [['Overdue', due.filter(function (d) { return d.delta < 0; }), 'bad'],
     ['Today', due.filter(function (d) { return d.delta === 0; }), 'warn'],
     ['Coming up', due.filter(function (d) { return d.delta > 0; }), '']].forEach(function (g) {
      if (!g[1].length) return;
      h += '<div class="card"><div class="card-head"><h2>' + g[0] + '</h2><span class="spacer"></span>' +
        '<span class="pill ' + g[2] + '">' + g[1].length + '</span></div>';
      g[1].forEach(function (r) {
        h += '<div class="prow" data-open="' + r.key + '">' +
          '<button class="cb" data-rev="' + r.key + ':' + r.ri + '"></button>' +
          problemLinks(r.it.lc, r.it.name) +
          '<span class="p-name">' + esc(r.it.name) + '</span>' +
          '<span class="p-note">' + esc(r.it.group) + '</span>' +
          '<span class="p-cap">' + fmtDate(r.due) + '</span></div>';
      });
      h += '</div>';
    });
  }
  $('#view-revision').innerHTML = h;
}

/* --------------------------------------------------------- companies --- */
var BUCKET_LBL = {
  core: 'DSA block B (tier 1–2)', hard: 'DSA block C (hard tier)', tech: 'Tech modules',
  sd: 'System design', lld: 'LLD / machine coding', lp: 'Behavioural story bank',
  mock: 'Recorded mocks', pack: 'Company pack (optional)'
};
var TIER_LBL = {
  1: 'Rung 1 · loops in weeks 4–7',
  2: 'Rung 2 · loops in weeks 10–14',
  3: 'Rung 3 · loops in weeks 17–22'
};

function renderCompanies() {
  var b = bucketItems();
  var h = '<div class="card"><div class="card-head"><h2>Ladder readiness</h2><span class="spacer"></span>' +
    '<span class="dim">target 75%</span></div>' +
    '<p class="dim">This measures <b>preparation coverage</b>, not probability of an offer. It is computed from what you ' +
    'have actually completed, weighted by attempt quality — clean 1.0, ugly 0.7, failed 0.4, done-but-unrated 0.85 ' +
    '— and by what each company actually tests.</p>' +
    '<p class="dim" style="margin-top:8px"><b>The honest version:</b> a company pack is worth roughly +3 to +8 percentage ' +
    'points, not a 75% jump. For Amazon the LP stories outweigh every coding problem in its pack combined; for Uber and ' +
    'Flipkart it is machine coding; for JPM and Amex it is the tech modules; for Google it is the mocks.</p></div>';

  var mk = mockItems();
  var mkDone = mk.filter(function (x) { var p = state.problems[x.key]; return p && p.done; }).length;
  h += '<div class="card"><div class="card-head"><h2>Recorded mocks</h2><span class="spacer"></span>' +
    '<span class="dim">' + mkDone + '/' + mk.length + ' · Google weights these 25%</span></div>' +
    '<p class="dim" style="margin-bottom:12px">Performance, not knowledge. The failure mode at the top of the ladder is ' +
    'not &quot;could not solve it&quot; — it is &quot;solved it silently and the interviewer could not score the signal&quot;. ' +
    '<b>Record every one and watch it back.</b></p>';
  mk.forEach(function (x) {
    var p = state.problems[x.key] || {};
    h += '<div class="prow' + (p.done ? ' done' : '') + '" data-open="' + x.key + '">' +
      '<button class="cb" data-check="' + x.key + '">' + (p.done ? '✓' : '') + '</button>' +
      '<span class="chip ph' + x.group.slice(-1) + '">P' + x.group.slice(-1) + '</span>' +
      '<span class="p-name">' + esc(x.name) + '</span>' +
      '<span class="p-note">' + esc(x.note) + '</span>' +
      '<span class="dot ' + esc(p.status || '') + '"></span></div>';
  });
  h += '</div>';

  h += '<div class="card"><div class="card-head"><h2>What is counted</h2><span class="spacer"></span>' +
    '<span class="dim">every tick lands in one of these</span></div><div class="statrow">';
  ['core', 'hard', 'tech', 'sd', 'lld', 'lp', 'mock'].forEach(function (k) {
    var items = b[k] || [];
    h += stat(doneCountOf(items) + '<span class="of">/' + items.length + '</span>',
              String(BUCKET_LBL[k] || k).replace(/ \(.*\)/, ''));
  });
  h += '</div><p class="dim" style="margin-top:14px">Counts are exact. The percentages below are weighted by attempt ' +
    'quality — clean 1.0, ugly 0.7, failed 0.4 — so early on they sit near zero even though the count has moved. ' +
    '<b>Trust the counts.</b></p></div>';

  [1, 2, 3].forEach(function (tier) {
    h += '<h2 class="tier-hd tier' + tier + '">' + TIER_LBL[tier] + '</h2>';
    PLAN.companies.filter(function (c) { return c.tier === tier; }).forEach(function (c) {
      var r = readiness(c, b), p100 = pct(r.score);
      var pShown = fmtPct(r.score);
      var barW = r.score > 0 ? Math.max(0.6, r.score * 100).toFixed(1) : '0';
      var lo = Math.round(c.band[0] * r.score), hi = Math.round(c.band[1] * r.score);
      var open = !!state.ui.open['co-' + c.id];
      var pk = packItems(c);
      var pkDone = pk.filter(function (x) { var pp = state.problems[x.key]; return pp && pp.done; }).length;
      var hit = p100 >= 75;

      h += '<div class="card co-card"><div class="card-head" style="margin-bottom:10px">' +
        '<h2 style="font-size:17px">' + esc(c.name) + ' <span class="dim" style="font-weight:400">' +
        esc(c.level) + '</span></h2><span class="spacer"></span>' +
        '<span class="co-pct ' + (hit ? 'hit' : '') + '">' + pShown + '</span></div>' +
        '<div class="co-bar"><i style="width:' + barW + '%"></i><u style="left:75%"></u></div>' +
        '<p class="dim" style="margin:7px 0 14px;font-size:12.5px">' +
        (hit ? '<b class="ok-txt">Past the 75% target.</b> ' : 'Target line at 75%. ') +
        'Estimated onsite pass at this readiness: <b>' + lo + '–' + hi + '%</b> ' +
        '<span style="opacity:.7">(band at full readiness: ' + c.band[0] + '–' + c.band[1] + '%)</span></p>' +
        '<div class="co-parts">';
      r.parts.forEach(function (pt) {
        /* a non-empty bucket always gets a visible sliver, so "I ticked
           something and nothing moved" cannot happen */
        var w = pt.s > 0 ? Math.max(0.8, pt.s * 100).toFixed(1) : '0';
        h += '<div class="co-part"><span class="co-part-lbl">' + esc(BUCKET_LBL[pt.k] || pt.k) + '</span>' +
          '<span class="co-part-w">weight ' + pct(pt.w) + '%</span>' +
          '<span class="co-part-bar"><i style="width:' + w + '%"></i></span>' +
          '<span class="co-part-n"><b>' + pt.done + '</b><span class="dim">/' + pt.n + '</span>' +
          '<span class="co-part-pct">' + fmtPct(pt.s) + '</span></span></div>';
      });
      h += '</div><div class="learn" style="margin-top:14px">' + esc(c.note) + '</div>' +
        '<div class="exit"><b>Biggest lever.</b> ' + esc(c.lever) + '</div>';

      if (pk.length) {
        h += '<button class="btn sm" data-cotoggle="' + c.id + '" style="margin-top:14px">' +
          (open ? '▾' : '▸') + ' Optional pack — ' + pkDone + '/' + pk.length + ' done</button>';
        if (open) {
          h += '<div style="margin-top:10px">';
          pk.forEach(function (x) {
            var pp = state.problems[x.key] || {};
            h += '<div class="prow' + (pp.done ? ' done' : '') + '" data-open="' + x.key + '">' +
              '<button class="cb" data-check="' + x.key + '">' + (pp.done ? '✓' : '') + '</button>' +
              problemLinks(x.lc, x.name) +
              '<span class="p-name">' + esc(x.name) + '</span>' +
              (x.note ? '<span class="p-note">' + esc(x.note) + '</span>' : '') +
              '<span class="dot ' + esc(pp.status || '') + '"></span></div>';
          });
          h += '</div>';
        }
      }
      h += '</div>';
    });
  });

  h += '<div class="card"><div class="card-head"><h2>What this score cannot see</h2></div><div class="prose"><ul>' +
    '<li><b>Getting the interview at all.</b> Referrals and recruiter contact. None of this matters without them, and it ' +
    'is not study — start in week 2, not week 12.</li>' +
    '<li><b>Interview performance.</b> Driving, narrating, recovering when stuck. The highest-variance factor there is.</li>' +
    '<li><b>Headcount and timing.</b> Loops get cancelled, teams freeze, bars move quarter to quarter. Do not read a ' +
    'rejection as a verdict on your ability.</li>' +
    '<li><b>Correlation between companies.</b> Interviewing at all ten does not give you ten independent draws. Same ' +
    'person, same weaknesses, every loop.</li></ul></div></div>';

  $('#view-companies').innerHTML = h;
}

/* --------------------------------------------------------- reference --- */
function renderReference() {
  var id = selected('reference'), h = '';

  if (id === 'templates') {
    h += '<div class="pane-head"><div class="eyebrow">Reference</div><h1>Template library</h1>' +
      '<p class="pane-sub">Cold, correct, under three minutes. A Dijkstra you have to re-derive costs eight minutes ' +
      'you do not have.</p></div>';
    var lastG = '';
    PLAN.templates.forEach(function (tp, i) {
      if (tp.g !== lastG) { lastG = tp.g; h += '<h2 class="pane-h2">' + esc(tp.g) + '</h2>'; }
      var st = (state.templates[i] || {}).status || '';
      h += '<div class="tpl"><span class="tpl-n">' + (i + 1) + '</span>' +
        '<div class="tpl-body"><b>' + esc(tp.n) + '</b><span>' + esc(tp.d) + '</span></div>' +
        '<div class="tpl-actions">' +
        '<button class="btn sm bad ' + (st === 'unknown' ? 'on' : '') + '" data-tpl="' + i + ':unknown">shaky</button>' +
        '<button class="btn sm warn ' + (st === 'learning' ? 'on' : '') + '" data-tpl="' + i + ':learning">slow</button>' +
        '<button class="btn sm ok ' + (st === 'fast' ? 'on' : '') + '" data-tpl="' + i + ':fast">&lt;3 min</button>' +
        '</div></div>';
    });

  } else if (id === 'reading') {
    h += '<div class="pane-head"><div class="eyebrow">Reference</div><h1>Reading list</h1>' +
      '<p class="pane-sub">The general references. Per-session and per-module reading sits on each ' +
      'system design session and each tech module.</p></div>' +
      readingList(PLAN.readGeneral, 'Start here') +
      '<p class="pane-p" style="margin-top:26px">Rows marked <b>search</b> are things worth reading whose exact ' +
      'URL is not stable enough to hard-code, so they open a search instead of a dead link.</p>';

  } else if (id === 'pool') {
    h += '<div class="pane-head"><div class="eyebrow">Reference</div><h1>Blind hard pool</h1>' +
      '<p class="pane-sub">Phase 3. Pick without looking, 45 minutes, recorded.</p></div>' +
      '<p class="mono" style="font-size:13.5px;line-height:2.1;color:var(--accent)">' +
      PLAN.hardPool.map(function (n) { return 'LC ' + n; }).join(' &nbsp;·&nbsp; ') + '</p>' +
      '<button class="btn primary" id="pick-random">Pick one at random</button> ' +
      '<span id="picked" class="mono" style="margin-left:10px"></span>';

  } else {
    var q = (state.ui.refQuery || '').toLowerCase();
    h += '<div class="pane-head"><div class="eyebrow">Reference</div><h1>All triggers</h1>' +
      '<p class="pane-sub">Disguise &rarr; move, across every track, in one searchable index.</p></div>' +
      '<input class="search" id="ref-search" placeholder="Try &quot;exactly K&quot;, &quot;removed over time&quot;, &quot;OOMKilled&quot;, &quot;celebrity&quot;…" value="' +
      esc(state.ui.refQuery || '') + '">';

    var groups = [];
    PLAN.sections.forEach(function (s) {
      groups.push({ g: 'DSA §' + s.n + ' ' + s.name,
        rows: s.p.map(function (r) { return [r[1], r[0] + ' — ' + r[2], r[3] || '']; }) });
    });
    groups.push({ g: 'System design', rows: PLAN.sdTriggers });
    groups.push({ g: 'LLD', rows: PLAN.lldPatterns });
    groups.push({ g: 'Tech', rows: PLAN.techTriggers.map(function (r) { return [r[0], r[1], '']; }) });

    var shown = 0;
    groups.forEach(function (grp) {
      var rows = grp.rows.filter(function (r) {
        return !q || (r[0] + ' ' + r[1] + ' ' + (r[2] || '')).toLowerCase().indexOf(q) >= 0;
      });
      if (!rows.length) return;
      shown += rows.length;
      h += '<h2 class="pane-h2">' + esc(grp.g) + '</h2>' +
        '<div class="tbl-wrap"><table><thead><tr><th>You hear / see</th><th>Fire this</th><th>Note</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        h += '<tr><td class="trig">' + esc(r[0]) + '</td><td class="fire">' + esc(r[1]) + '</td>' +
          '<td class="canon">' + esc(r[2] || '') + '</td></tr>';
      });
      h += '</tbody></table></div>';
    });
    if (!shown) h += '<p class="dim" style="margin-top:16px">No trigger matches that.</p>';
  }

  h += pagerFor('reference');
  $('#view-reference').innerHTML = h;

  var si = $('#ref-search');
  if (si) si.oninput = function () {
    state.ui.refQuery = si.value; var pos = si.selectionStart;
    renderReference(); var ns = $('#ref-search'); ns.focus(); ns.setSelectionRange(pos, pos);
  };
  var pr = $('#pick-random');
  if (pr) pr.onclick = function () {
    var n = PLAN.hardPool[Math.floor(Math.random() * PLAN.hardPool.length)];
    $('#picked').textContent = '→ LC ' + n + '  ·  45 min  ·  record it';
  };
}

/* --------------------------------------------------------------- log --- */
function renderLog() {
  var rows = allItems().filter(function (x) {
    var p = state.problems[x.key];
    return p && p.log && (p.log.trigger || p.log.technique || p.log.mistake);
  });
  var h = '<div class="card"><div class="card-head"><h2>The log</h2><span class="spacer"></span>' +
    '<span class="pill">' + rows.length + '</span></div>' +
    '<p class="dim">The <b>ROOT CAUSE</b> line is the point of the whole exercise. "I made a mistake" is worthless. ' +
    '"I think of <i>visited</i> as positional when it is state-al" is a fixable defect that would otherwise recur in five ' +
    'more problems.</p></div>';
  if (!rows.length) {
    h += '<div class="card"><p class="dim">Nothing logged yet. Open any item and fill in trigger / technique / root cause.</p></div>';
  } else {
    rows.slice().reverse().forEach(function (x) {
      var p = state.problems[x.key];
      h += '<div class="card logcard" data-open="' + x.key + '"><div class="log-hd">' +
        '<b>' + (x.lc ? 'LC ' + x.lc + ' · ' : '') + esc(x.name) + '</b><span class="spacer"></span>' +
        '<span class="dot ' + esc(p.status || '') + '"></span>' +
        '<span class="dim" style="margin-left:8px">' + esc(x.group) + (p.mins ? ' · ' + p.mins + ' min' : '') + '</span></div>' +
        (p.log.trigger ? '<div class="log-l"><i>TRIGGER</i>' + esc(p.log.trigger) + '</div>' : '') +
        (p.log.technique ? '<div class="log-l"><i>TECHNIQUE</i>' + esc(p.log.technique) + '</div>' : '') +
        (p.log.mistake ? '<div class="log-l root"><i>ROOT CAUSE</i>' + esc(p.log.mistake) + '</div>' : '') +
        '</div>';
    });
  }
  $('#view-log').innerHTML = h;
}

/* ---------------------------------------------------------- strategy --- */
function renderStrategy() {
  var id = selected('strategy');
  var i = parseInt(id, 10); if (isNaN(i) || !PLAN.strategy[i]) i = 0;
  var s = PLAN.strategy[i];
  var h = '<div class="pane-head"><div class="eyebrow">Strategy &middot; ' + (i + 1) + ' of ' +
    PLAN.strategy.length + '</div><h1>' + esc(s.t) + '</h1></div>' +
    '<div class="prose">' + s.h + '</div>' + pagerFor('strategy');
  $('#view-strategy').innerHTML = h;
}

/* ------------------------------------------------------------- drawer --- */
function openDrawer(key) {
  var it = findItem(key); if (!it) return;
  var p = P(key);
  $('#dr-eyebrow').textContent = it.group;
  $('#dr-title').textContent = (it.lc ? 'LC ' + it.lc + ' · ' : '') + it.name;

  var h = '';
  if (it.lc != null) {
    h += '<div class="dr-links">' + problemLinks(it.lc, it.name) + '</div>';
  }
  if (it.note) h += '<div class="learn">' + esc(it.note) + '</div>';

  var appr = approachFor(key);
  if (appr) {
    var shown = !!state.ui.open['appr-' + key];
    h += '<div class="appr' + (shown ? ' open' : '') + '">' +
      '<button class="appr-btn" data-appr="' + esc(key) + '">' +
      (shown ? '▾' : '▸') + ' Approach &amp; cost' +
      '<span>' + (shown ? 'hide' : 'spoiler — only after you have tried it') + '</span></button>' +
      (shown ? '<div class="appr-body">' + esc(appr) + '</div>' : '') + '</div>';
  }

  h += '<div class="field"><label>Status</label><div class="btnrow">' +
    '<button class="btn ok ' + (p.status === 'clean' ? 'on' : '') + '" data-st="clean">Clean</button>' +
    '<button class="btn warn ' + (p.status === 'ugly' ? 'on' : '') + '" data-st="ugly">Ugly</button>' +
    '<button class="btn bad ' + (p.status === 'failed' ? 'on' : '') + '" data-st="failed">Failed</button>' +
    '</div><p class="dim" style="margin-top:8px;font-size:12.5px"><b>Clean</b> = correct, in time, you could explain every ' +
    'line. <b>Ugly</b> = correct but slow or guessing. Ugly or failed schedules four blank-file re-solves at +1, +3, +7 ' +
    'and +16 days.</p></div>';

  h += '<div class="field"><label>Minutes taken</label>' +
    '<input type="number" min="0" id="dr-mins" value="' + (p.mins || '') + '" placeholder="wall clock, visible"></div>';

  h += '<div class="field"><label>TRIGGER — what in the wording should have tipped you off</label>' +
    '<textarea id="dr-trigger" placeholder="e.g. &quot;collect all keys&quot;, keys &lt;= 6 → the bitmask goes INTO the state">' +
    esc(p.log.trigger || '') + '</textarea></div>';
  h += '<div class="field"><label>TECHNIQUE — what actually solved it</label>' +
    '<textarea id="dr-technique" placeholder="e.g. BFS on (r, c, keysMask); visited is a 3-D set, NOT a 2-D grid">' +
    esc(p.log.technique || '') + '</textarea></div>';
  h += '<div class="field"><label>ROOT CAUSE — the mental model that was wrong</label>' +
    '<textarea id="dr-mistake" placeholder="Not &quot;I forgot X&quot;. What belief produced the bug? e.g. I think of visited as positional. It is state-al.">' +
    esc(p.log.mistake || '') + '</textarea></div>';

  if (p.reviews && p.reviews.length) {
    h += '<div class="field"><label>Re-solve schedule</label><div class="revlist">';
    p.reviews.forEach(function (r, i) {
      h += '<label class="revitem' + (r.done ? ' done' : '') + '">' +
        '<input type="checkbox" data-revchk="' + i + '"' + (r.done ? ' checked' : '') + '> ' +
        fmtDate(r.due) + '</label>';
    });
    h += '</div></div>';
  }

  h += '<div class="btnrow" style="margin-top:20px">' +
    '<button class="btn primary" id="dr-toggle">' + (p.done ? 'Mark not done' : 'Mark done') + '</button>' +
    '<button class="btn" id="dr-resched">Re-schedule re-solves</button>' +
    '<button class="btn ghost" id="dr-clear">Clear this item</button></div>';

  $('#dr-body').innerHTML = h;
  $('#drawer').hidden = false; $('#scrim').hidden = false;

  $$('#dr-body [data-st]').forEach(function (btn) {
    btn.onclick = function () {
      var v = btn.getAttribute('data-st');
      p.status = (p.status === v) ? '' : v;
      if (p.status) p.done = true;
      if (p.status === 'ugly' || p.status === 'failed') scheduleReviews(key);
      save(); openDrawer(key); renderAll();
    };
  });
  $('#dr-mins').onchange = function () { p.mins = parseInt(this.value, 10) || 0; save(); renderAll(); };
  ['trigger', 'technique', 'mistake'].forEach(function (f) {
    var el = $('#dr-' + f);
    el.oninput = function () { p.log[f] = this.value; save(); };
    el.onblur = function () { renderHeader(); };
  });
  $$('#dr-body [data-revchk]').forEach(function (c) {
    c.onchange = function () {
      p.reviews[+c.getAttribute('data-revchk')].done = c.checked;
      save(); openDrawer(key); renderAll();
    };
  });
  $('#dr-toggle').onclick = function () { p.done = !p.done; save(); openDrawer(key); renderAll(); };
  $('#dr-resched').onclick = function () {
    scheduleReviews(key); save(); openDrawer(key); renderAll(); toast('Re-solves scheduled.');
  };
  $('#dr-clear').onclick = function () { delete state.problems[key]; save(); closeDrawer(); renderAll(); };
}
function closeDrawer() { $('#drawer').hidden = true; $('#scrim').hidden = true; }

/* ------------------------------------------------------------ storage --- */
function renderStorage() {
  var h = '<p class="dim">Three layers. Set up layer 2 today, and export a dated backup every Sunday.</p>';

  h += '<div class="stlayer"><b>1 · Browser storage</b>' +
    '<span>Automatic, on every click. One "clear browsing data" away from gone.</span>' +
    '<span class="ok-txt">Active</span></div>';

  h += '<div class="stlayer"><b>2 · Linked file on disk</b>';
  if (!FSA) {
    h += '<span>Not available in this browser. Use Chrome or Edge for automatic file writes.</span><span class="dim">Unavailable</span>';
  } else if (fileHandle) {
    h += '<span>Every change is written automatically to your chosen .json.</span><span class="ok-txt">Linked</span>';
  } else if (window._pendingHandle) {
    h += '<span>Linked previously — permission must be re-granted once per browser restart.</span>' +
      '<button class="btn sm primary" id="st-grant">Re-grant</button>';
  } else {
    h += '<span>Pick a .json in this folder; every change is written to it automatically.</span>' +
      '<button class="btn sm primary" id="st-link">Link file</button>';
  }
  h += '</div>';

  h += '<div class="stlayer"><b>3 · Export / import</b><span>Manual JSON snapshot. Works everywhere.</span>' +
    '<span><button class="btn sm" id="st-export">Export</button> ' +
    '<button class="btn sm" id="st-import">Import</button></span></div>';

  h += '<div class="warnbox" style="margin-top:18px"><b>Progress keys are content-addressed</b> — ' +
    '<code>ds-&lt;section&gt;-&lt;block&gt;-&lt;index&gt;</code>. Appending to the end of any list in <code>data.js</code> ' +
    'is always safe; reordering within a list re-maps that list’s progress.</div>';

  h += '<div class="btnrow" style="margin-top:18px"><button class="btn bad" id="st-reset">Reset everything</button></div>';

  $('#st-body').innerHTML = h;
  var g;
  if ((g = $('#st-link'))) g.onclick = linkFile;
  if ((g = $('#st-grant'))) g.onclick = grantFile;
  $('#st-export').onclick = exportJSON;
  $('#st-import').onclick = importJSON;
  $('#st-reset').onclick = function () {
    if (!confirm('Delete all progress, notes and logs? This cannot be undone.')) return;
    state = blankState(); save(); renderAll(); closeModal(); toast('Reset.');
  };
}
function closeModal() { $('#modal-scrim').hidden = true; }

/* ------------------------------------------------------------- chrome --- */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.ui.theme === 'light' ? 'light' : 'dark');
}
function renderHeader() {
  var s = stats(), due = dueReviews();
  var overdue = due.filter(function (d) { return d.delta <= 0; }).length;
  var d = rawDayNumber(), ph = currentPhase();
  $('#m-day').textContent = (d < 1 ? '–' : d > PLAN.meta.days ? '✓' : d);
  $('#m-phase').textContent = 'P' + ph.n;
  $('#m-done').textContent = s.done;
  $('#m-due').textContent = overdue;
  var p = s.done / (s.total || 1);
  $('#m-bar').style.width = pct(p) + '%';
  $('#m-pct').textContent = pct(p) + '%';
  $('#tab-due').textContent = overdue;
}
var RENDER = {
  dashboard: renderDashboard, weekly: renderWeekly, method: renderMethod, dsa: renderDsa, sd: renderSd, lld: renderLld,
  tech: renderTech, lp: renderLp, revision: renderRevision, companies: renderCompanies,
  reference: renderReference, log: renderLog, strategy: renderStrategy
};
function renderAll() {
  applyTheme();
  renderHeader();
  renderSidenav(state.ui.tab);
  var fn = RENDER[state.ui.tab] || renderDashboard;
  fn();
}
function switchTab(name) {
  if (!RENDER[name]) name = 'dashboard';
  state.ui.tab = name;
  state.ui.navQuery = '';
  save();
  $$('.tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === name); });
  $$('.view').forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + name); });
  renderAll();
  window.scrollTo(0, 0);
}

/* --------------------------------------------------------- delegation --- */
function toggleOpen(k) { if (state.ui.open[k]) delete state.ui.open[k]; else state.ui.open[k] = true; }

document.addEventListener('click', function (e) {
  var t = e.target, a;
  if (!t || !t.closest) return;

  if ((a = t.closest('.tab'))) { switchTab(a.getAttribute('data-tab')); return; }

  if ((a = t.closest('[data-nav]'))) {
    if (!state.ui.sel) state.ui.sel = {};
    state.ui.sel[state.ui.tab] = a.getAttribute('data-nav');
    save();
    renderSidenav(state.ui.tab);
    (RENDER[state.ui.tab] || renderDashboard)();
    var pane = $('#pane');
    if (pane) pane.scrollTop = 0;
    window.scrollTo(0, 0);
    return;
  }

  if (t.closest && t.closest('a.lnk')) { e.stopPropagation(); return; }

  if ((a = t.closest('[data-check]'))) {
    e.stopPropagation();
    var k = a.getAttribute('data-check'), p = P(k);
    p.done = !p.done;
    if (!p.done) p.status = '';
    save(); renderAll(); return;
  }
  if ((a = t.closest('[data-rev]'))) {
    e.stopPropagation();
    var parts = a.getAttribute('data-rev').split(':');
    P(parts[0]).reviews[+parts[1]].done = true;
    save(); renderAll(); return;
  }
  if ((a = t.closest('[data-pat]'))) {
    e.stopPropagation();
    var pp = a.getAttribute('data-pat').split(':');
    state.patterns[pp[0]] = (state.patterns[pp[0]] === pp[1]) ? '' : pp[1];
    save(); renderDsa(); return;
  }
  if ((a = t.closest('[data-tpl]'))) {
    var tp = a.getAttribute('data-tpl').split(':');
    if (!state.templates[tp[0]]) state.templates[tp[0]] = {};
    state.templates[tp[0]].status = (state.templates[tp[0]].status === tp[1]) ? '' : tp[1];
    save(); renderReference(); return;
  }
  if ((a = t.closest('[data-lpstory]'))) {
    toggleOpen('lp-story-' + a.getAttribute('data-lpstory'));
    save(); renderLp();
    return;
  }

  if ((a = t.closest('[data-unlock]'))) {
    if (!state.unlocked) state.unlocked = {};
    state.unlocked[a.getAttribute('data-unlock')] = true;
    save(); renderSidenav('weekly'); renderWeekly();
    return;
  }
  if ((a = t.closest('[data-patq]'))) {
    e.stopPropagation();
    var pk2 = a.getAttribute('data-patq');
    state.patterns[pk2] = state.patterns[pk2] === 'fast' ? '' : 'fast';
    save(); renderSidenav('weekly'); renderWeekly();
    return;
  }
  if ((a = t.closest('[data-tplq]'))) {
    e.stopPropagation();
    var tk = a.getAttribute('data-tplq');
    if (!state.templates[tk]) state.templates[tk] = {};
    state.templates[tk].status = state.templates[tk].status === 'fast' ? '' : 'fast';
    save(); renderSidenav('weekly'); renderWeekly();
    return;
  }

  if ((a = t.closest('[data-sdsoln]'))) {
    toggleOpen('sdsoln-' + a.getAttribute('data-sdsoln'));
    save(); renderSd();
    return;
  }

  if ((a = t.closest('[data-soln]'))) {
    toggleOpen('soln-' + a.getAttribute('data-soln'));
    save(); renderLld();
    return;
  }

  if ((a = t.closest('[data-crit]'))) { toggleOpen('crit-' + a.getAttribute('data-crit')); save(); renderDashboard(); return; }
  if ((a = t.closest('[data-sec]'))) { toggleOpen('sec-' + a.getAttribute('data-sec')); save(); renderDsa(); return; }
  if ((a = t.closest('[data-mod]'))) { toggleOpen('mod-' + a.getAttribute('data-mod')); save(); renderTech(); return; }
  if ((a = t.closest('[data-secopen]'))) { toggleOpen(a.getAttribute('data-secopen')); save(); renderSd(); return; }
  if ((a = t.closest('[data-cotoggle]'))) { toggleOpen('co-' + a.getAttribute('data-cotoggle')); save(); renderCompanies(); return; }
  if ((a = t.closest('[data-appr]'))) {
    e.stopPropagation();
    var ak = 'appr-' + a.getAttribute('data-appr');
    state.ui.open[ak] = !state.ui.open[ak];
    save(); openDrawer(a.getAttribute('data-appr'));
    return;
  }

  if ((a = t.closest('[data-open]'))) { openDrawer(a.getAttribute('data-open')); return; }

  if (t.id === 'scrim' || t.id === 'dr-close') { closeDrawer(); return; }
  if (t.id === 'modal-scrim' || t.id === 'st-close') { closeModal(); return; }
  if (t.id === 'btn-storage') { $('#modal-scrim').hidden = false; renderStorage(); return; }
  if (t.id === 'btn-theme') {
    state.ui.theme = (state.ui.theme === 'light') ? 'dark' : 'light';
    save(); applyTheme(); return;
  }
});

document.addEventListener('input', function (e) {
  var n = e.target.getAttribute && e.target.getAttribute('data-note');
  if (n) { state.notes[n] = e.target.value; save(); }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeDrawer(); closeModal(); }
});

/* ----------------------------------------------------------------- go --- */
loadState();
restoreFileHandle().then(function () {
  switchTab(state.ui.tab || 'dashboard');
});

})();
