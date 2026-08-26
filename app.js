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
    ui: { open: {}, refQuery: '', dsaQuery: '', techQuery: '', tab: 'dashboard', theme: 'dark' }
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
function questionRow(key, q) {
  var p = state.problems[key] || {};
  var diffCls = { E: 'e', M: 'm', H: 'h' }[q[2]] || '';
  return '<div class="prow' + (p.done ? ' done' : '') + '" data-open="' + key + '">' +
    '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
    '<span class="diff ' + diffCls + '">' + esc(q[2] || '') + '</span>' +
    '<span class="p-lc">' + (q[0] ? 'LC ' + q[0] : '—') + '</span>' +
    '<span class="p-name">' + esc(q[1]) + '</span>' +
    (q[3] ? '<span class="p-note">' + esc(q[3]) + '</span>' : '') +
    '<span class="dot ' + esc(p.status || '') + '"></span></div>';
}

function renderDsa() {
  var q = (state.ui.dsaQuery || '').toLowerCase();
  var h = '<div class="card"><div class="card-head"><h2>DSA — 17 sections</h2><span class="spacer"></span>' +
    '<button class="btn sm" id="dsa-expand">Expand all</button> ' +
    '<button class="btn sm" id="dsa-collapse">Collapse all</button></div>' +
    '<p class="dim">Every section has three blocks. <b>A · Patterns</b> is the machinery — each row is ' +
    '<i>disguise → move</i>, and the disguise column is the whole point. <b>B · Tier 1–2</b> is ' +
    'JPM / Amex / Expedia / Amazon / Microsoft / Adobe. <b>C · Google / Uber</b> is Phase 3.</p>' +
    '<p class="dim" style="margin-top:8px"><b>The rule:</b> drill block A before touching the questions, and never solve one ' +
    'without first naming which row of block A it is. If you cannot name the row, you are pattern-matching on the problem ' +
    'statement rather than on the machinery.</p>' +
    '<input class="search" id="dsa-search" placeholder="Filter sections, patterns and problems — try &quot;bitmask&quot;, &quot;regret&quot;, &quot;median&quot;…" value="' +
    esc(state.ui.dsaQuery || '') + '"></div>';

  PLAN.sections.forEach(function (s) {
    var hay = (s.name + ' ' + s.sub + ' ' + s.cx + ' ' +
      s.p.map(function (r) { return r.join(' '); }).join(' ') + ' ' +
      s.b.concat(s.c).map(function (r) { return r.join(' '); }).join(' ')).toLowerCase();
    if (q && hay.indexOf(q) < 0) return;

    var open = !!state.ui.open['sec-' + s.id];
    var bd = s.b.filter(function (_, i) { var p = state.problems['ds-' + s.id + '-b-' + i]; return p && p.done; }).length;
    var cd = s.c.filter(function (_, i) { var p = state.problems['ds-' + s.id + '-c-' + i]; return p && p.done; }).length;
    var pd = s.p.filter(function (_, i) { return state.patterns['pt-' + s.id + '-' + i] === 'fast'; }).length;

    h += '<div class="sec' + (open ? ' open' : '') + '">' +
      '<button class="sec-head" data-sec="' + s.id + '">' +
      '<span class="chev">▶</span><span class="sec-n">§' + s.n + '</span>' +
      '<span class="sec-title"><b>' + esc(s.name) + '</b><span>' + esc(s.sub || '') + '</span></span>' +
      '<span class="chip ph' + s.phase + '">phase ' + s.phase + '</span>' +
      '<span class="sec-prog">A ' + pd + '/' + s.p.length + ' · B ' + bd + '/' + s.b.length +
      ' · C ' + cd + '/' + s.c.length + '</span></button><div class="sec-body">';

    h += '<div class="block-lbl">A · Patterns — drill the disguise column</div>' +
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

    h += '<div class="block-lbl">B · Tier 1–2 — JPM · Amex · Expedia · Amazon · Microsoft · Adobe <span class="dim">(' + s.b.length + ')</span></div>';
    s.b.forEach(function (r, i) { h += questionRow('ds-' + s.id + '-b-' + i, r); });

    h += '<div class="block-lbl">C · Google / Uber L4 <span class="dim">(' + s.c.length + ')</span></div>';
    if (s.cx) h += '<div class="learn"><b>Extra machinery.</b> ' + esc(s.cx) + '</div>';
    s.c.forEach(function (r, i) { h += questionRow('ds-' + s.id + '-c-' + i, r); });

    h += '<div class="field" style="margin-top:14px"><label>Notes — add YOUR disguises here</label>' +
      '<textarea data-note="sec-' + s.id + '" placeholder="The phrase that should have tipped you off. One line per miss.">' +
      esc(state.notes['sec-' + s.id] || '') + '</textarea></div></div></div>';
  });

  $('#view-dsa').innerHTML = h;
  var si = $('#dsa-search');
  if (si) si.oninput = function () {
    state.ui.dsaQuery = si.value; var pos = si.selectionStart;
    renderDsa(); var ns = $('#dsa-search'); ns.focus(); ns.setSelectionRange(pos, pos);
  };
  var ex = $('#dsa-expand'), co = $('#dsa-collapse');
  if (ex) ex.onclick = function () { PLAN.sections.forEach(function (s) { state.ui.open['sec-' + s.id] = true; }); save(); renderDsa(); };
  if (co) co.onclick = function () { PLAN.sections.forEach(function (s) { delete state.ui.open['sec-' + s.id]; }); save(); renderDsa(); };
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

function renderSd() {
  var h = '<div class="card"><div class="card-head"><h2>System design</h2><span class="spacer"></span>' +
    '<span class="dim">22 Saturdays</span></div>' +
    '<p class="dim"><b>The gradient does not run to Google.</b> Google L4 has little or no system design. The heavy SD ' +
    'rounds are JP Morgan, Amex, Expedia, Amazon and Uber — so the tier 1–2 block is the big one here, and the ' +
    'top tier means Uber / Apple / Amazon-senior depth.</p>' +
    '<p class="dim" style="margin-top:8px">Each session is four blocks: <b>terms (45m) → the design (90m, timed, ' +
    'recorded) → case study (45m) → cross-questions (60m, written)</b>. The cross-question block is the one most ' +
    'people skip and the one that decides the round.</p></div>';

  h += '<div class="card"><div class="card-head"><h2>The framework — use it every single time</h2></div>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Step</th><th>Min</th><th>What you actually do</th></tr></thead><tbody>';
  PLAN.sdFramework.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
      '<td class="trig">' + esc(r[2]) + '</td></tr>';
  });
  h += '</tbody></table></div><div class="exit"><b>Numbers to have memorised.</b> ' + esc(PLAN.sdNumbers) + '</div></div>';

  h += '<div class="card"><div class="card-head"><h2>Requirement → building block</h2><span class="spacer"></span>' +
    '<span class="dim">the SD equivalent of a pattern table — drill it</span></div>' +
    triTable(PLAN.sdTriggers, ['You hear', 'Reach for', 'The cross-question that follows']) + '</div>';

  h += '<div class="card"><div class="card-head"><h2>The six cross-question categories</h2><span class="spacer"></span>' +
    '<span class="dim">answer all six, in writing, for every design</span></div>' +
    triTable(PLAN.sdCross, ['Category', 'Shape', 'Examples']) + '</div>';

  [['b', 'Block B · tier 1–2 sessions'],
   ['c', 'Block C · top tier — Uber / Apple / Amazon']].forEach(function (pair) {
    var list = PLAN.sd.filter(function (s) { return s.tier === pair[0]; });
    h += '<div class="card"><div class="card-head"><h2>' + pair[1] + '</h2><span class="spacer"></span>' +
      '<span class="dim">' + list.length + ' sessions</span></div>';
    list.forEach(function (s) {
      var key = 'sd-' + s.n, p = state.problems[key] || {};
      var open = !!state.ui.open[key];
      h += '<div class="sec' + (open ? ' open' : '') + '"><div class="sec-head-row">' +
        '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
        '<button class="sec-head flat" data-secopen="' + key + '">' +
        '<span class="chev">▶</span><span class="sec-n">SD ' + s.n + '</span>' +
        '<span class="sec-title"><b>' + esc(s.t) + '</b><span>week ' + s.wk +
        (s.anchor ? ' · ' + esc(s.anchor) : '') + '</span></span>' +
        '<span class="dot ' + esc(p.status || '') + '"></span></button>' +
        '<button class="btn xs" data-open="' + key + '">log</button></div>' +
        '<div class="sec-body">' +
        (s.terms ? '<div class="learn"><b>Terms you must own.</b> ' + esc(s.terms) + '</div>' : '') +
        '<div class="exit"><b>The design.</b> ' + esc(s.design) + '</div>' +
        '<div class="field" style="margin-top:12px"><label>Your one-page design + cross-question answers</label>' +
        '<textarea data-note="' + key + '" placeholder="A weekend that produced nothing you can re-read did not happen.">' +
        esc(state.notes[key] || '') + '</textarea></div></div></div>';
    });
    h += '</div>';
  });

  $('#view-sd').innerHTML = h;
}

/* --------------------------------------------------------------- LLD --- */
function renderLld() {
  var h = '<div class="card"><div class="card-head"><h2>LLD / OOD / machine coding</h2></div>' +
    '<p class="dim"><b>Three different rounds wear this name</b>, and confusing them is how people lose the round.</p>' +
    '<div class="tbl-wrap"><table><thead><tr><th>Flavour</th><th>Who</th><th>Format</th><th>What scores</th></tr></thead><tbody>';
  PLAN.lldFlavours.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="canon">' + esc(r[1]) + '</td>' +
      '<td class="trig">' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
  });
  h += '</tbody></table></div></div>';

  h += '<div class="card"><div class="card-head"><h2>Requirement → pattern</h2><span class="spacer"></span>' +
    '<span class="dim">about eight of the 23 GoF patterns appear. Learn these and stop.</span></div>' +
    triTable(PLAN.lldPatterns, ['You hear', 'Reach for', 'Where it shows up']) + '</div>';

  h += '<div class="card"><div class="card-head"><h2>SOLID as a refactor, not a definition</h2><span class="spacer"></span>' +
    '<span class="dim">a 10-line violation and its fix for each</span></div>' +
    '<div class="tbl-wrap"><table><thead><tr><th></th><th>Principle</th><th>The violation to be able to write</th></tr></thead><tbody>';
  PLAN.lldSolid.forEach(function (r) {
    h += '<tr><td class="fire">' + esc(r[0]) + '</td><td class="trig">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
  });
  h += '</tbody></table></div><div class="exit"><b>The framework.</b> ' + esc(PLAN.lldFramework) + '</div></div>';

  h += '<div class="card"><div class="card-head"><h2>Machine-coding rules that decide the round</h2></div><ol class="rules">';
  PLAN.lldRules.forEach(function (r) { h += '<li>' + esc(r) + '</li>'; });
  h += '</ol></div>';

  [['b', 'Block B · tier 1–2 — Amazon · Adobe · Microsoft · JPM'],
   ['c', 'Block C · top tier — Amazon hybrid · Uber / Flipkart machine coding']].forEach(function (pair) {
    var blk = pair[0];
    h += '<div class="card"><div class="card-head"><h2>' + pair[1] + '</h2><span class="spacer"></span>' +
      '<span class="dim">' + PLAN.lld[blk].length + ' items</span></div>';
    PLAN.lld[blk].forEach(function (r, i) {
      var key = 'ld-' + blk + '-' + i, p = state.problems[key] || {};
      h += '<div class="prow' + (p.done ? ' done' : '') + '" data-open="' + key + '">' +
        '<button class="cb" data-check="' + key + '">' + (p.done ? '✓' : '') + '</button>' +
        '<span class="tag ' + esc(String(r[1]).split(' ')[0].toLowerCase()) + '">' + esc(r[1]) + '</span>' +
        '<span class="p-name">' + esc(r[0]) + '</span>' +
        (r[2] ? '<span class="p-note">' + esc(r[2]) + '</span>' : '') +
        '<span class="dot ' + esc(p.status || '') + '"></span></div>';
    });
    h += '</div>';
  });

  $('#view-lld').innerHTML = h;
}

/* -------------------------------------------------------------- tech --- */
function renderTech() {
  var q = (state.ui.techQuery || '').toLowerCase();
  var h = '<div class="card"><div class="card-head"><h2>Tech — 10 modules</h2><span class="spacer"></span>' +
    '<span class="dim">~110 hours · 1h every weekday</span></div>' +
    '<p class="dim"><b>The gradient inverts here.</b> The deepest tech questioning is at the <b>bottom</b> of your ladder ' +
    '— JP Morgan and Amex go far deeper on <code>@Transactional</code>, thread pools and index plans than Google ever ' +
    'will. Google asks none of it. So this is the JPM offer, and it is front-loaded into Phase 1.</p>' +
    '<p class="dim" style="margin-top:8px">Every row is <b>question → the answer’s spine → the follow-up they ' +
    'will actually ask.</b> <b>Learn the follow-up.</b> Anyone can answer the first question.</p>' +
    '<input class="search" id="tech-search" placeholder="Filter — try &quot;OOMKilled&quot;, &quot;propagation&quot;, &quot;rebalance&quot;…" value="' +
    esc(state.ui.techQuery || '') + '"></div>';

  PLAN.tech.forEach(function (m) {
    var hay = (m.name + ' ' + (m.note || '') + ' ' +
      m.qa.map(function (r) { return r.join(' '); }).join(' ')).toLowerCase();
    if (q && hay.indexOf(q) < 0) return;
    var open = !!state.ui.open['mod-' + m.id];
    var done = m.qa.filter(function (_, i) { var p = state.problems['tq-' + m.id + '-' + i]; return p && p.done; }).length;

    h += '<div class="sec' + (open ? ' open' : '') + '">' +
      '<button class="sec-head" data-mod="' + m.id + '">' +
      '<span class="chev">▶</span><span class="sec-n">' + m.n + '</span>' +
      '<span class="sec-title"><b>' + esc(m.name) + '</b><span>' + m.hrs + ' hours</span></span>' +
      '<span class="chip ph' + m.phase + '">phase ' + m.phase + '</span>' +
      '<span class="sec-prog">' + done + '/' + m.qa.length + '</span></button><div class="sec-body">';
    if (m.note) h += '<div class="learn"><b>Note.</b> ' + esc(m.note) + '</div>';
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
    h += '<div class="field" style="margin-top:14px"><label>Hands-on artefact / notes</label>' +
      '<textarea data-note="mod-' + m.id + '" placeholder="What you actually built or broke. Not a summary of what you read.">' +
      esc(state.notes['mod-' + m.id] || '') + '</textarea></div></div></div>';
  });

  h += '<div class="card"><div class="card-head"><h2>Tech triggers</h2><span class="spacer"></span>' +
    '<span class="dim">drill this like a pattern table</span></div>' +
    triTable(PLAN.techTriggers, ['You hear', 'Reach for']) + '</div>';

  $('#view-tech').innerHTML = h;
  var si = $('#tech-search');
  if (si) si.oninput = function () {
    state.ui.techQuery = si.value; var pos = si.selectionStart;
    renderTech(); var ns = $('#tech-search'); ns.focus(); ns.setSelectionRange(pos, pos);
  };
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
          '<span class="p-lc">' + (r.it.lc ? 'LC ' + r.it.lc : '—') + '</span>' +
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
              '<span class="p-lc">' + (x.lc ? 'LC ' + x.lc : '—') + '</span>' +
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
  var q = (state.ui.refQuery || '').toLowerCase();
  var h = '<div class="card"><div class="card-head"><h2>Template library</h2><span class="spacer"></span>' +
    '<span class="dim">cold, correct, under 3 minutes</span></div>' +
    '<p class="dim" style="margin-bottom:14px">Bugs in templates cost interviews. A Dijkstra you have to re-derive costs ' +
    'eight minutes you do not have. Type three cold at the start of a session, then diff.</p>';
  var lastG = '';
  PLAN.templates.forEach(function (tp, i) {
    if (tp.g !== lastG) { lastG = tp.g; h += '<div class="block-lbl">' + esc(tp.g) + '</div>'; }
    var st = (state.templates[i] || {}).status || '';
    h += '<div class="tpl"><span class="tpl-n">' + (i + 1) + '</span>' +
      '<div class="tpl-body"><b>' + esc(tp.n) + '</b><span>' + esc(tp.d) + '</span></div>' +
      '<div class="tpl-actions">' +
      '<button class="btn sm bad ' + (st === 'unknown' ? 'on' : '') + '" data-tpl="' + i + ':unknown">shaky</button>' +
      '<button class="btn sm warn ' + (st === 'learning' ? 'on' : '') + '" data-tpl="' + i + ':learning">slow</button>' +
      '<button class="btn sm ok ' + (st === 'fast' ? 'on' : '') + '" data-tpl="' + i + ':fast">&lt;3 min</button>' +
      '</div></div>';
  });
  h += '</div>';

  h += '<div class="card"><div class="card-head"><h2>All triggers — one searchable index</h2>' +
    '<span class="spacer"></span><span class="dim">disguise → move, across every track</span></div>' +
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
    h += '<div class="block-lbl" style="margin-top:20px">' + esc(grp.g) + '</div>' +
      '<div class="tbl-wrap"><table><thead><tr><th>You hear / see</th><th>Fire this</th><th>Note</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr><td class="trig">' + esc(r[0]) + '</td><td class="fire">' + esc(r[1]) + '</td>' +
        '<td class="canon">' + esc(r[2] || '') + '</td></tr>';
    });
    h += '</tbody></table></div>';
  });
  if (!shown) h += '<p class="dim" style="margin-top:16px">No trigger matches that.</p>';
  h += '</div>';

  h += '<div class="card"><div class="card-head"><h2>Blind hard pool</h2><span class="spacer"></span>' +
    '<span class="dim">Phase 3 · pick without looking</span></div>' +
    '<p class="mono" style="font-size:13px;line-height:2;color:var(--accent)">' +
    PLAN.hardPool.map(function (n) { return 'LC ' + n; }).join(' &nbsp;·&nbsp; ') + '</p>' +
    '<button class="btn primary" id="pick-random">Pick one at random</button> ' +
    '<span id="picked" class="mono" style="margin-left:10px"></span></div>';

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
  var h = '';
  PLAN.strategy.forEach(function (s) {
    h += '<div class="card"><div class="card-head"><h2>' + esc(s.t) + '</h2></div><div class="prose">' + s.h + '</div></div>';
  });
  $('#view-strategy').innerHTML = h;
}

/* ------------------------------------------------------------- drawer --- */
function openDrawer(key) {
  var it = findItem(key); if (!it) return;
  var p = P(key);
  $('#dr-eyebrow').textContent = it.group;
  $('#dr-title').textContent = (it.lc ? 'LC ' + it.lc + ' · ' : '') + it.name;

  var h = '';
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
  var fn = RENDER[state.ui.tab] || renderDashboard;
  fn();
}
function switchTab(name) {
  if (!RENDER[name]) name = 'dashboard';
  state.ui.tab = name; save();
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
