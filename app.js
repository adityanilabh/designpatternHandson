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
  ['b', 'c'].forEach(function (blk) {
    PLAN.lld[blk].forEach(function (p, i) {
      out.push({ key: 'ld-' + blk + '-' + i, lc: null, name: p[0], note: p[2],
        diff: p[1], kind: /LP|STAR|Leadership/i.test(p[0]) ? 'lp' : 'lld',
        group: 'LLD · block ' + blk.toUpperCase() });
    });
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
var _allCache = null;
function allItems() {
  if (_allCache) return _allCache;
  var out = dsaItems().concat(sdItems(), lldItems(), techItems(), mockItems());
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
function readiness(c, buckets) {
  var b = buckets || bucketItems();
  var parts = [], total = 0;
  Object.keys(c.weights).forEach(function (k) {
    var items = (k === 'pack') ? packItems(c) : (b[k] || []);
    var s = scoreOf(items);
    parts.push({ k: k, w: c.weights[k], s: s, n: items.length });
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
    return [{ g: 'Phase 1 · foundations', items: g1 }, { g: 'Phase 2 · depth', items: g2 }];
  }

  if (tab === 'sd') {
    g1 = []; g2 = [];
    PLAN.sd.forEach(function (s) {
      (s.tier === 'b' ? g1 : g2).push({ id: String(s.n), n: 'SD ' + s.n, label: s.t, sub: 'week ' + s.wk });
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

  if (tab === 'lld') {
    return [
      { g: 'Reference', items: [
        { id: 'flavours', n: '', label: 'The three flavours', sub: 'OOD · machine coding · hybrid' },
        { id: 'patterns', n: '', label: 'Requirement → pattern', sub: '12 rows' },
        { id: 'solid', n: '', label: 'SOLID as refactors', sub: 'violation and fix' },
        { id: 'rules', n: '', label: 'Machine-coding rules', sub: 'how to finish' }
      ]},
      { g: 'Problems', items: [
        { id: 'b', n: '', label: 'Block B · tier 1–2', sub: PLAN.lld.b.length + ' items' },
        { id: 'c', n: '', label: 'Block C · top tier', sub: PLAN.lld.c.length + ' items' }
      ]}
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
      h += '<button class="nav-item' + (it.id === sel ? ' on' : '') + '" data-nav="' + esc(it.id) + '">' +
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
  if (sd) sd.onchange = function () { state.startDate = sd.value; save(); renderAll(); };
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

function renderDsa() {
  var id = selected('dsa');
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

  h += readingList((PLAN.sdRead || {})[s.n], 'Read more');

  h += '<div class="field pane-notes"><label>Your one-page design + cross-question answers</label>' +
    '<textarea data-note="' + key + '" placeholder="A weekend that produced nothing you can re-read did not happen.">' +
    esc(state.notes[key] || '') + '</textarea></div>';

  h += pagerFor('sd');
  $('#view-sd').innerHTML = h;
}

/* --------------------------------------------------------------- LLD --- */
function renderLld() {
  var id = selected('lld'), h = '';

  if (id === 'flavours') {
    h += '<div class="pane-head"><div class="eyebrow">LLD</div><h1>The three flavours</h1>' +
      '<p class="pane-sub">Three different rounds wear this name, and confusing them is how people lose the round.</p></div>' +
      '<div class="tbl-wrap"><table><thead><tr><th>Flavour</th><th>Who</th><th>Format</th><th>What scores</th></tr></thead><tbody>';
    PLAN.lldFlavours.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
        '<td class="trig">' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
    });
    h += '</tbody></table></div>' +
      '<h2 class="pane-h2">The framework</h2><div class="exit">' + esc(PLAN.lldFramework) + '</div>';

  } else if (id === 'patterns') {
    h += '<div class="pane-head"><div class="eyebrow">LLD</div><h1>Requirement → pattern</h1>' +
      '<p class="pane-sub">About eight of the 23 GoF patterns actually appear. Learn these and stop.</p></div>' +
      triTable(PLAN.lldPatterns, ['You hear', 'Reach for', 'Where it shows up']);

  } else if (id === 'solid') {
    h += '<div class="pane-head"><div class="eyebrow">LLD</div><h1>SOLID as refactors</h1>' +
      '<p class="pane-sub">Be able to show a 10-line violation and its fix for each. Definitions score nothing.</p></div>' +
      '<div class="tbl-wrap"><table><thead><tr><th></th><th>Principle</th><th>The violation to be able to write</th></tr></thead><tbody>';
    PLAN.lldSolid.forEach(function (r) {
      h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
    });
    h += '</tbody></table></div>';

  } else if (id === 'rules') {
    h += '<div class="pane-head"><div class="eyebrow">LLD</div><h1>Machine-coding rules</h1>' +
      '<p class="pane-sub">An unfinished elegant design scores below a finished plain one.</p></div>' +
      '<ol class="rules">';
    PLAN.lldRules.forEach(function (r) { h += '<li>' + esc(r) + '</li>'; });
    h += '</ol>';

  } else {
    var blk = (id === 'c') ? 'c' : 'b';
    h += '<div class="pane-head"><div class="eyebrow">LLD &middot; problems</div><h1>' +
      (blk === 'b' ? 'Block B · tier 1–2' : 'Block C · top tier') + '</h1>' +
      '<p class="pane-sub">' + (blk === 'b'
        ? 'Amazon · Adobe · Microsoft · JPM — whiteboard OOD.'
        : 'Amazon hybrid · Uber and Flipkart machine coding · the Amazon LP story bank.') + '</p></div>';
    PLAN.lld[blk].forEach(function (r, i) {
      var key = 'ld-' + blk + '-' + i, p = state.problems[key] || {};
      h += '<div class="prow' + (p.done ? ' done' : '') + '" data-open="' + key + '">' +
        '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
        '<span class="tag ' + esc(String(r[1]).split(' ')[0].toLowerCase()) + '">' + esc(r[1]) + '</span>' +
        '<span class="p-name">' + esc(r[0]) + '</span>' +
        (r[2] ? '<span class="p-note">' + esc(r[2]) + '</span>' : '') +
        '<span class="dot ' + esc(p.status || '') + '"></span></div>';
    });
  }

  h += pagerFor('lld');
  $('#view-lld').innerHTML = h;
}

/* -------------------------------------------------------------- tech --- */
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

  h += readingList((PLAN.techRead || {})[m.id], 'Read more');

  h += '<div class="field pane-notes"><label>Hands-on artefact / notes</label>' +
    '<textarea data-note="mod-' + m.id + '" placeholder="What you actually built or broke. Not a summary of what you read.">' +
    esc(state.notes['mod-' + m.id] || '') + '</textarea></div>';

  h += pagerFor('tech');
  $('#view-tech').innerHTML = h;
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
  sd: 'System design', lld: 'LLD / machine coding', lp: 'Amazon LP stories',
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

  [1, 2, 3].forEach(function (tier) {
    h += '<h2 class="tier-hd tier' + tier + '">' + TIER_LBL[tier] + '</h2>';
    PLAN.companies.filter(function (c) { return c.tier === tier; }).forEach(function (c) {
      var r = readiness(c, b), p100 = pct(r.score);
      var lo = Math.round(c.band[0] * r.score), hi = Math.round(c.band[1] * r.score);
      var open = !!state.ui.open['co-' + c.id];
      var pk = packItems(c);
      var pkDone = pk.filter(function (x) { var pp = state.problems[x.key]; return pp && pp.done; }).length;
      var hit = p100 >= 75;

      h += '<div class="card co-card"><div class="card-head" style="margin-bottom:10px">' +
        '<h2 style="font-size:17px">' + esc(c.name) + ' <span class="dim" style="font-weight:400">' +
        esc(c.level) + '</span></h2><span class="spacer"></span>' +
        '<span class="co-pct ' + (hit ? 'hit' : '') + '">' + p100 + '%</span></div>' +
        '<div class="co-bar"><i style="width:' + p100 + '%"></i><u style="left:75%"></u></div>' +
        '<p class="dim" style="margin:7px 0 14px;font-size:12.5px">' +
        (hit ? '<b class="ok-txt">Past the 75% target.</b> ' : 'Target line at 75%. ') +
        'Estimated onsite pass at this readiness: <b>' + lo + '–' + hi + '%</b> ' +
        '<span style="opacity:.7">(band at full readiness: ' + c.band[0] + '–' + c.band[1] + '%)</span></p>' +
        '<div class="co-parts">';
      r.parts.forEach(function (pt) {
        h += '<div class="co-part"><span class="co-part-lbl">' + esc(BUCKET_LBL[pt.k] || pt.k) + '</span>' +
          '<span class="co-part-w">weight ' + pct(pt.w) + '%</span>' +
          '<span class="co-part-bar"><i style="width:' + pct(pt.s) + '%"></i></span>' +
          '<span class="co-part-n">' + pct(pt.s) + '% <span class="dim">of ' + pt.n + '</span></span></div>';
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
  dashboard: renderDashboard, dsa: renderDsa, sd: renderSd, lld: renderLld,
  tech: renderTech, revision: renderRevision, companies: renderCompanies,
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
  if ((a = t.closest('[data-crit]'))) { toggleOpen('crit-' + a.getAttribute('data-crit')); save(); renderDashboard(); return; }
  if ((a = t.closest('[data-sec]'))) { toggleOpen('sec-' + a.getAttribute('data-sec')); save(); renderDsa(); return; }
  if ((a = t.closest('[data-mod]'))) { toggleOpen('mod-' + a.getAttribute('data-mod')); save(); renderTech(); return; }
  if ((a = t.closest('[data-secopen]'))) { toggleOpen(a.getAttribute('data-secopen')); save(); renderSd(); return; }
  if ((a = t.closest('[data-cotoggle]'))) { toggleOpen('co-' + a.getAttribute('data-cotoggle')); save(); renderCompanies(); return; }
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
