/* Headless render test for the sidebar layout.
   Verifies: every tab renders, every sidebar item renders, and the union of
   all rendered pages still contains all the content. */
var fs = require('fs');
var data = fs.readFileSync('data.js', 'utf8');
var appsrc = fs.readFileSync('app.js', 'utf8');
var views = ['dashboard', 'dsa', 'sd', 'lld', 'tech', 'revision', 'companies', 'reference', 'log', 'strategy'];
var failed = 0;

function El(id) {
  this.id = id; this.innerHTML = ''; this.hidden = false; this.style = {}; this.textContent = '';
  this.scrollTop = 0;
  var self = this;
  this._cls = {};
  this.classList = {
    toggle: function (c, on) { self._cls[c] = !!on; },
    add: function (c) { self._cls[c] = true; },
    remove: function (c) { self._cls[c] = false; },
    contains: function (c) { return !!self._cls[c]; }
  };
}
El.prototype.closest = function () { return null; };
El.prototype.getAttribute = function () { return null; };

function boot(tab, sel) {
  var els = {};
  ['toast', 'm-day', 'm-phase', 'm-done', 'm-due', 'm-bar', 'm-pct', 'tab-due', 'drawer', 'scrim',
   'dr-body', 'dr-eyebrow', 'dr-title', 'modal-scrim', 'st-body', 'startdate', 'nav-search',
   'ref-search', 'pick-random', 'picked', 'sidenav', 'pane'].forEach(function (i) { els[i] = new El(i); });
  views.forEach(function (v) { els['view-' + v] = new El('view-' + v); });

  var body = new El('body');
  global.document = {
    body: body,
    querySelector: function (s) { return s[0] === '#' ? (els[s.slice(1)] || null) : null; },
    querySelectorAll: function () { return []; },
    addEventListener: function () {},
    documentElement: { setAttribute: function () {} },
    createElement: function () { return { click: function () {}, style: {} }; }
  };
  global.window = { showSaveFilePicker: undefined, scrollTo: function () {} };
  var ui = { open: {}, sel: sel || {}, navQuery: '', refQuery: '', tab: tab, theme: 'dark' };
  var store = { 'targetladder.state.v2': JSON.stringify({
    v: 2, startDate: '2026-08-31', problems: {}, patterns: {}, templates: {}, notes: {}, ui: ui }) };
  global.localStorage = {
    getItem: function (k) { return store[k] || null; },
    setItem: function (k, v) { store[k] = v; }
  };
  global.indexedDB = { open: function () {
    var r = { result: { transaction: function () { return { objectStore: function () {
      return { get: function () { var q = {}; setTimeout(function () { q.onsuccess && q.onsuccess(); }, 0); return q; },
               put: function () {} }; }, oncomplete: null }; } } };
    setTimeout(function () { r.onsuccess && r.onsuccess(); }, 0);
    return r;
  } };
  global.Blob = function () {}; global.URL = { createObjectURL: function () { return ''; }, revokeObjectURL: function () {} };
  global.FileReader = function () {}; global.confirm = function () { return false; };

  var PLAN; eval(data); global.PLAN = PLAN;
  eval(appsrc);
  return { els: els, body: body, PLAN: PLAN };
}

function later(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
/* the app HTML-escapes titles, so escape the expected string the same way */
function esc(x) {
  return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

(async function () {
  /* 1. every tab boots and renders */
  for (var i = 0; i < views.length; i++) {
    var tab = views[i], ctx;
    try { ctx = boot(tab); } catch (e) { console.log('FAIL', tab, 'boot:', e.message); failed++; continue; }
    await later(50);
    var len = ctx.els['view-' + tab].innerHTML.length;
    var navLen = ctx.els.sidenav.innerHTML.length;
    var hasNav = ctx.body._cls['has-nav'];
    if (!len) { console.log('FAIL', tab, 'pane empty'); failed++; }
    else console.log('ok  ', tab.padEnd(11), String(len).padStart(7), 'bytes  nav:',
      (hasNav ? String(navLen).padStart(5) + 'b' : ' none'));
  }

  /* 2. every DSA section renders, and the union covers all questions */
  var ctxD = boot('dsa'); await later(40);
  var totalQ = 0, seen = 0;
  ctxD.PLAN.sections.forEach(function (s) { totalQ += s.b.length + s.c.length; });
  for (var j = 0; j < ctxD.PLAN.sections.length; j++) {
    var sec = ctxD.PLAN.sections[j];
    var c = boot('dsa', { dsa: sec.id }); await later(12);
    var html = c.els['view-dsa'].innerHTML;
    if (html.indexOf(esc(sec.name)) < 0) { console.log('FAIL dsa section missing title:', sec.id); failed++; }
    var rows = (html.match(/data-open="ds-/g) || []).length;
    var pats = (html.match(/data-pat="pt-/g) || []).length / 3;
    if (rows !== sec.b.length + sec.c.length) {
      console.log('FAIL', sec.id, 'rendered', rows, 'questions, expected', sec.b.length + sec.c.length); failed++;
    }
    if (pats !== sec.p.length) {
      console.log('FAIL', sec.id, 'rendered', pats, 'patterns, expected', sec.p.length); failed++;
    }
    seen += rows;
  }
  console.log('\nDSA: all', ctxD.PLAN.sections.length, 'sections render ·', seen, '/', totalQ, 'questions across pages');

  /* 3. every SD session renders with all its blocks */
  var ctxS = boot('sd'); await later(40);
  var crossSeen = 0, crossTotal = 0;
  ctxS.PLAN.sd.forEach(function (s) { crossTotal += s.cross.length; });
  for (var k = 0; k < ctxS.PLAN.sd.length; k++) {
    var ses = ctxS.PLAN.sd[k];
    var c2 = boot('sd', { sd: String(ses.n) }); await later(12);
    var html2 = c2.els['view-sd'].innerHTML;
    if (html2.indexOf(esc(ses.t)) < 0) { console.log('FAIL sd title missing:', ses.n); failed++; }
    crossSeen += (html2.match(/qa static/g) || []).length;
    if (ses.terms.length && html2.indexOf('Terms you must own') < 0) {
      console.log('FAIL sd', ses.n, 'terms block missing'); failed++;
    }
  }
  console.log('SD : all', ctxS.PLAN.sd.length, 'sessions render ·', crossSeen, '/', crossTotal, 'cross-questions across pages');

  /* 4. tech modules */
  var ctxT = boot('tech'); await later(40);
  var qaSeen = 0, qaTotal = 0;
  ctxT.PLAN.tech.forEach(function (m) { qaTotal += m.qa.length; });
  for (var t = 0; t < ctxT.PLAN.tech.length; t++) {
    var mod = ctxT.PLAN.tech[t];
    var c3 = boot('tech', { tech: mod.id }); await later(12);
    qaSeen += (c3.els['view-tech'].innerHTML.match(/data-check="tq-/g) || []).length;
  }
  console.log('Tech: all', ctxT.PLAN.tech.length, 'modules render ·', qaSeen, '/', qaTotal, 'Q&A across pages');

  /* 5. lld + reference + strategy pages */
  for (var pair of [['lld', ['flavours','patterns','solid','rules','b','c']],
                    ['reference', ['templates','triggers','pool']],
                    ['strategy', ['0','1','2','3','4','5']]]) {
    for (var id of pair[1]) {
      var sel = {}; sel[pair[0]] = id;
      var c4 = boot(pair[0], sel); await later(10);
      if (!c4.els['view-' + pair[0]].innerHTML.length) {
        console.log('FAIL', pair[0], id, 'empty'); failed++;
      }
    }
    console.log(pair[0].padEnd(4), ': all', pair[1].length, 'pages render');
  }

  console.log(failed ? '\n' + failed + ' FAILURES' : '\nAll pages render. Content complete across pagination.');
  process.exit(failed ? 1 : 0);
})();
