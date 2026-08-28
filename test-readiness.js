/* Does the readiness score MEAN anything?
   The percentage per company is the number the whole tracker points at, and it
   is computed by pure functions that the render tests never touch. This asserts
   the buckets partition correctly, that finishing a track can actually reach
   100% of its bucket, that no track leaks into another, and that the re-solve
   scheduler is idempotent. Run: node test-readiness.js */
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
  ui: { open: {}, sel: {}, navQuery: '', refQuery: '', tab: 'companies', theme: 'dark' } }) };
global.localStorage = { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = v; } };
global.indexedDB = { open: function () { var r = { result: { transaction: function () { return { objectStore: function () {
  return { get: function () { var q = {}; setTimeout(function () { q.onsuccess && q.onsuccess(); }, 0); return q; },
           put: function () {} }; }, oncomplete: null }; } } };
  setTimeout(function () { r.onsuccess && r.onsuccess(); }, 0); return r; } };
global.Blob = function () {}; global.URL = { createObjectURL: function () { return ''; }, revokeObjectURL: function () {} };
global.FileReader = function () {}; global.confirm = function () { return false; };

var PLAN; eval(data); global.PLAN = PLAN;
/* expose the internals we need to assert on */
appsrc = appsrc.replace('})();', 'global.__rd = { bucketItems: bucketItems, readiness: readiness, scoreOf: scoreOf,\n' +
  '  doneCountOf: doneCountOf, allItems: allItems, packItems: packItems, stats: stats,\n' +
  '  scheduleReviews: scheduleReviews, dueReviews: dueReviews, P: P, today: today,\n' +
  '  REVIEW_OFFSETS: REVIEW_OFFSETS, addDays: addDays, reset: function () { state.problems = {}; } };\n})();');
eval(appsrc);

var R = global.__rd;
var fail = 0;
function ok(cond, label, detail) {
  if (!cond) fail++;
  console.log('  ' + (cond ? 'ok  ' : 'FAIL') + '  ' + label + (detail ? '   ' + detail : ''));
}
function markClean(keys) { keys.forEach(function (k) { var p = R.P(k); p.done = true; p.status = 'clean'; }); }
function keysOfKind(kind) {
  return R.allItems().filter(function (x) { return x.kind === kind; }).map(function (x) { return x.key; });
}

/* ---------------------------------------------------------- buckets --- */
console.log('\nbucket composition\n');
var b = R.bucketItems();
var EXPECT = {
  core: PLAN.sections.reduce(function (n, s) { return n + s.b.length; }, 0),
  hard: PLAN.sections.reduce(function (n, s) { return n + s.c.length; }, 0),
  sd: PLAN.sd.length,
  lld: PLAN.lldProblems.length,
  lp: PLAN.lp.slots.length
};
Object.keys(EXPECT).forEach(function (k) {
  ok(b[k].length === EXPECT[k], k.padEnd(5) + ' bucket holds ' + EXPECT[k] + ' items',
     b[k].length === EXPECT[k] ? '' : '(got ' + b[k].length + ')');
});

/* the bug this file was written for: behavioural stories are not LLD */
var leaked = b.lld.filter(function (x) { return x.kind !== 'lld'; });
ok(leaked.length === 0, 'lld bucket contains only kind:lld',
   leaked.length ? '(leaked: ' + leaked.map(function (x) { return x.key; }).join(', ') + ')' : '');

/* the one double-count that IS deliberate: an SD session titled "mock" */
var sdMocks = R.allItems().filter(function (x) { return x.kind === 'mock' && x.key.indexOf('sd-') === 0; });
ok(sdMocks.length > 0 && sdMocks.every(function (x) {
  return b.sd.indexOf(x) >= 0 && b.mock.indexOf(x) >= 0;
}), 'SD sessions titled "mock" count in both sd and mock', '(' + sdMocks.length + ' of them)');

/* nothing else may appear twice */
var dupes = [];
Object.keys(b).forEach(function (k) {
  b[k].forEach(function (x) {
    Object.keys(b).forEach(function (k2) {
      if (k2 <= k) return;
      if (b[k2].indexOf(x) >= 0 && !(k === 'mock' && k2 === 'sd') && !(k === 'sd' && k2 === 'mock')) {
        dupes.push(x.key + ' in ' + k + ' + ' + k2);
      }
    });
  });
});
ok(dupes.length === 0, 'no other item lands in two buckets', dupes.length ? '(' + dupes.join('; ') + ')' : '');

/* --------------------------------------------------------- isolation --- */
console.log('\ntracks do not leak into each other\n');
R.reset();
markClean(keysOfKind('lp'));
ok(R.scoreOf(R.bucketItems().lp) === 1, 'all 15 stories clean -> lp bucket 100%');
ok(R.scoreOf(R.bucketItems().lld) === 0, 'all 15 stories clean -> lld bucket still 0%',
   '(behavioural work must not score as machine coding)');

R.reset();
markClean(keysOfKind('lld'));
var lldScore = R.scoreOf(R.bucketItems().lld);
ok(lldScore === 1, 'all ' + EXPECT.lld + ' LLD problems clean -> lld bucket 100%',
   lldScore === 1 ? '' : '(got ' + (lldScore * 100).toFixed(1) + '% — unreachable ceiling)');
ok(R.scoreOf(R.bucketItems().lp) === 0, 'all LLD problems clean -> lp bucket still 0%');

/* ------------------------------------------------------- reachability --- */
console.log('\nevery company can reach 100%\n');
PLAN.companies.forEach(function (c) {
  var sum = Object.keys(c.weights).reduce(function (n, k) { return n + c.weights[k]; }, 0);
  ok(Math.abs(sum - 1) < 1e-9, c.id.padEnd(10) + ' weights sum to 1.00',
     Math.abs(sum - 1) < 1e-9 ? '' : '(got ' + sum.toFixed(3) + ')');
});

R.reset();
markClean(R.allItems().map(function (x) { return x.key; }));
var buckets = R.bucketItems();
PLAN.companies.forEach(function (c) {
  var s = R.readiness(c, buckets).score;
  ok(Math.abs(s - 1) < 1e-9, c.id.padEnd(10) + ' everything clean -> 100%',
     Math.abs(s - 1) < 1e-9 ? '' : '(got ' + (s * 100).toFixed(1) + '%)');
});

/* quality weighting still applies below "clean" */
R.reset();
R.allItems().forEach(function (x) { var p = R.P(x.key); p.done = true; p.status = 'ugly'; });
var ugly = R.readiness(PLAN.companies[0], R.bucketItems()).score;
ok(Math.abs(ugly - 0.7) < 1e-9, 'everything ugly -> 70%', '(got ' + (ugly * 100).toFixed(1) + '%)');

/* ---------------------------------------------------------- re-solves --- */
console.log('\nspaced repetition\n');
R.reset();
var k1 = keysOfKind('lld')[0];
R.scheduleReviews(k1);
var revs = R.P(k1).reviews;
ok(revs.length === R.REVIEW_OFFSETS.length, 'one rating schedules ' + R.REVIEW_OFFSETS.length + ' re-solves',
   '(got ' + revs.length + ')');
var wanted = R.REVIEW_OFFSETS.map(function (o) { return R.addDays(R.today(), o); });
ok(revs.map(function (r) { return r.due; }).join() === wanted.join(),
   're-solves land at +' + R.REVIEW_OFFSETS.join(' / +') + ' days');

R.scheduleReviews(k1);
ok(R.P(k1).reviews.length === R.REVIEW_OFFSETS.length, 're-scheduling the same day does not duplicate',
   '(got ' + R.P(k1).reviews.length + ')');

var due = R.dueReviews();
ok(due.length === R.REVIEW_OFFSETS.length, 'all four surface in the revision queue');
ok(due.every(function (d) { return d.key === k1; }), 'queue rows carry the right item key');
R.P(k1).reviews.forEach(function (r) { r.done = true; });
ok(R.dueReviews().length === 0, 'completed re-solves leave the queue');

/* ---------------------------------------------------------------------- */
R.reset();
console.log('');
if (fail) {
  console.log(fail + ' ASSERTION' + (fail === 1 ? '' : 'S') + ' FAILED');
  process.exit(1);
}
console.log('Readiness is sound: buckets partition, no track leaks, every company reaches 100%.');
