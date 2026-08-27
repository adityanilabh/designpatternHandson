/* Does the weekly plan PARTITION the sheet?
   Every trackable item must appear in exactly one week, and every week's
   items must be real. Run: node _wkcheck.js */
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
var els = {};
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
/* expose the internals we need to assert on */
appsrc = appsrc.replace('})();', 'global.__wk = { buildWeeks: buildWeeks, allItems: allItems, WEEKS: WEEKS,\n' +
  '  weekProgress: weekProgress, weekUnlocked: weekUnlocked, currentWeek: currentWeek };\n})();');
eval(appsrc);

setTimeout(function () {
  var W = global.__wk, weeks = W.buildWeeks(), fail = 0;

  /* 1. no key appears twice */
  var seen = {}, dupes = [];
  weeks.forEach(function (wk) {
    wk.core.concat(wk.addon).forEach(function (g) {
      var id = g.type + ':' + g.key;
      if (seen[id]) dupes.push(id + ' (weeks ' + seen[id] + ' and ' + wk.n + ')');
      seen[id] = wk.n;
    });
  });
  console.log('duplicate goals across weeks :', dupes.length);
  dupes.slice(0, 8).forEach(function (d) { console.log('    ', d); });
  if (dupes.length) fail++;

  /* 2. every trackable problem item is covered */
  var universe = {};
  W.allItems().forEach(function (it) { universe['problem:' + it.key] = it; });
  PLAN.sections.forEach(function (s) {
    s.p.forEach(function (_, i) { universe['pattern:pt-' + s.id + '-' + i] = 1; });
  });
  PLAN.templates.forEach(function (_, i) { universe['template:' + i] = 1; });

  var uKeys = Object.keys(universe);
  var missing = uKeys.filter(function (k) { return !seen[k]; });
  console.log('items in the sheet            :', uKeys.length);
  console.log('items placed into a week      :', Object.keys(seen).length);
  console.log('items NOT in any week         :', missing.length);
  missing.slice(0, 10).forEach(function (m) { console.log('     MISSING', m); });
  if (missing.length) fail++;

  /* 3. nothing scheduled that does not exist */
  var ghost = Object.keys(seen).filter(function (k) { return !universe[k]; });
  console.log('scheduled but not in the sheet:', ghost.length);
  ghost.slice(0, 10).forEach(function (g) { console.log('     GHOST', g); });
  if (ghost.length) fail++;

  /* 4. per-week load */
  console.log('\nweek   core  addon   total   phase');
  var totCore = 0, totAddon = 0;
  weeks.forEach(function (wk) {
    totCore += wk.core.length; totAddon += wk.addon.length;
    console.log('  ' + String(wk.n).padStart(2) + '   ' + String(wk.core.length).padStart(4) +
      '  ' + String(wk.addon.length).padStart(5) + '   ' +
      String(wk.core.length + wk.addon.length).padStart(5) + '     P' + wk.phase);
  });
  console.log('       ----  -----   -----');
  console.log('       ' + String(totCore).padStart(4) + '  ' + String(totAddon).padStart(5) +
    '   ' + String(totCore + totAddon).padStart(5));

  /* 5. gating behaves */
  console.log('\ngating:');
  console.log('  week 1 unlocked  :', W.weekUnlocked(1), '(must be true)');
  console.log('  week 2 unlocked  :', W.weekUnlocked(2), '(must be false with nothing done)');
  console.log('  current week     :', W.currentWeek(), '(must be 1)');
  if (!W.weekUnlocked(1) || W.weekUnlocked(2) || W.currentWeek() !== 1) fail++;

  console.log(fail ? '\n' + fail + ' FAILURES' : '\nPARTITION HOLDS — every item in exactly one week, gating correct.');
  process.exit(fail ? 1 : 0);
}, 120);
