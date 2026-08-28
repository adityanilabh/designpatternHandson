/* Verifies the unlock chain:
     solve week 1  -> week 2 opens, week 3 still locked
     solve week 2  -> week 3 opens, week 4 still locked
   Run: node test-gating.js */
var fs = require('fs');
var data = fs.readFileSync('data.js', 'utf8');
var appsrc = fs.readFileSync('app.js', 'utf8');

function El(id) {
  this.id = id; this.innerHTML = ''; this.hidden = false; this.style = {}; this.textContent = '';
  this.scrollTop = 0; var s = this; this._c = {};
  this.classList = { toggle: function (c, o) { s._c[c] = !!o; }, add: function (c) { s._c[c] = true; },
                     remove: function (c) { s._c[c] = false; }, contains: function (c) { return !!s._c[c]; } };
}
El.prototype.closest = function () { return null; };
El.prototype.getAttribute = function () { return null; };

var views = ['dashboard','weekly','method','dsa','sd','lld','tech','lp','revision','companies','reference','log','strategy'];
var els = {}, state;
['toast','m-day','m-phase','m-done','m-due','m-bar','m-pct','tab-due','drawer','scrim','dr-body','dr-eyebrow',
 'dr-title','modal-scrim','st-body','startdate','nav-search','ref-search','sd-search','pick-random','picked',
 'sidenav','pane'].forEach(function (i) { els[i] = new El(i); });
views.forEach(function (v) { els['view-' + v] = new El('view-' + v); });

global.document = { body: new El('body'),
  querySelector: function (s) { return s[0] === '#' ? (els[s.slice(1)] || null) : null; },
  querySelectorAll: function () { return []; }, addEventListener: function () {},
  documentElement: { setAttribute: function () {} },
  createElement: function () { return { click: function () {}, style: {} }; } };
global.window = { showSaveFilePicker: undefined, scrollTo: function () {} };
var store = { 'targetladder.state.v2': JSON.stringify({ v: 2, startDate: '2026-08-31', problems: {},
  patterns: {}, templates: {}, notes: {}, unlocked: {},
  ui: { open: {}, sel: {}, navQuery: '', refQuery: '', tab: 'weekly', theme: 'dark' } }) };
global.localStorage = { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = v; } };
global.indexedDB = { open: function () { var r = { result: { transaction: function () { return { objectStore: function () {
  return { get: function () { var q = {}; setTimeout(function () { q.onsuccess && q.onsuccess(); }, 0); return q; },
           put: function () {} }; }, oncomplete: null }; } } };
  setTimeout(function () { r.onsuccess && r.onsuccess(); }, 0); return r; } };
global.Blob = function () {}; global.URL = { createObjectURL: function () { return ''; }, revokeObjectURL: function () {} };
global.FileReader = function () {}; global.confirm = function () { return false; };

var PLAN; eval(data); global.PLAN = PLAN;
appsrc = appsrc.replace('})();',
  'global.__wk = { buildWeeks: buildWeeks, weekProgress: weekProgress, weekUnlocked: weekUnlocked,\n' +
  '  currentWeek: currentWeek, state: function () { return state; } };\n})();');
eval(appsrc);

setTimeout(function () {
  var W = global.__wk, st = W.state(), weeks = W.buildWeeks(), fail = 0;

  function tick(week) {
    week.core.forEach(function (g) {
      if (g.type === 'pattern') st.patterns[g.key] = 'fast';
      else if (g.type === 'template') { st.templates[g.key] = { status: 'fast' }; }
      else st.problems[g.key] = { done: true, status: 'clean', mins: 0, log: {}, reviews: [] };
    });
  }
  function row(label) {
    var o = [1, 2, 3, 4].map(function (n) { return 'W' + n + ' ' + (W.weekUnlocked(n) ? 'OPEN  ' : 'locked'); });
    console.log('  ' + (label + '                        ').slice(0, 24) + o.join(' | ') +
                '   current=' + W.currentWeek());
  }
  function expect(label, n, want) {
    var got = W.weekUnlocked(n);
    if (got !== want) { console.log('  FAIL: week ' + n + ' should be ' + (want ? 'open' : 'locked') + ' ' + label); fail++; }
  }

  console.log('unlock chain\n');
  row('nothing done');
  expect('at start', 1, true); expect('at start', 2, false); expect('at start', 3, false);

  tick(weeks[0]);
  row('week 1 core done');
  expect('after w1', 2, true); expect('after w1', 3, false);

  tick(weeks[1]);
  row('week 2 core done');
  expect('after w2', 3, true); expect('after w2', 4, false);

  tick(weeks[2]);
  row('week 3 core done');
  expect('after w3', 4, true);

  /* a half-finished week must NOT open the next one */
  st.problems = {}; st.patterns = {}; st.templates = {}; st.unlocked = {};
  var half = weeks[0].core.slice(0, weeks[0].core.length - 1);
  half.forEach(function (g) {
    if (g.type === 'pattern') st.patterns[g.key] = 'fast';
    else if (g.type === 'template') st.templates[g.key] = { status: 'fast' };
    else st.problems[g.key] = { done: true, status: 'clean', mins: 0, log: {}, reviews: [] };
  });
  console.log();
  row('week 1 minus ONE item');
  expect('one item short', 2, false);

  /* the override opens that week only, and the chain resumes from it */
  st.unlocked = { 3: true };
  console.log();
  row('override on week 3');
  expect('override', 3, true);
  expect('override does not leak to 4', 4, false);
  tick(weeks[2]);
  row('…then week 3 finished');
  expect('chain resumes', 4, true);

  console.log(fail ? '\n' + fail + ' FAILURES' : '\nChain is exact: week N opens only when week N-1 core is complete.');
  process.exit(fail ? 1 : 0);
}, 120);
