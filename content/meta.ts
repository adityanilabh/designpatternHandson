/* Plan metadata — phases, calendar, companies, templates, strategy, mocks
   Moved VERBATIM from legacy/data.js — this file is content, not code.
   Edit this to change the plan; gen-sheet.js regenerates the markdown sheet
   from it, so the sheet cannot drift.

   Progress keys are content-addressed, so APPENDING to any list is safe;
   reordering within a list remaps that list's saved progress. */
/* eslint-disable */
// @ts-nocheck

const PLAN: any = {};

PLAN.meta = {
  start: '2026-08-31',
  days: 154,
  weeks: 22,
  title: 'Target Ladder',
  sub: '154 days · JPM → Amazon → Google'
};


PLAN.phases = [
  { n:1, name:'Foundation + tech blitz', days:'1–42', weeks:'1–6', from:'2026-08-31', to:'2026-10-11',
    rung:'JP Morgan · Amex · Expedia',
    bar:'DSA easy-medium, clean and fast. Tech depth on your own stack. SD vocabulary. Basic LLD.',
    work:'DSA §1–§9 blocks A+B · SD §18/§19 + sessions 1–6 · LLD patterns + parking/elevator/vending/ATM/library · Tech modules 1–5, 7, 9' },
  { n:2, name:'Product-tier push', days:'43–91', weeks:'7–13', from:'2026-10-12', to:'2026-11-29',
    rung:'Amazon · Microsoft · Adobe',
    bar:'DSA medium-hard. Amazon hybrid LLD. Full SD designs end-to-end. 15 LP stories.',
    work:'DSA §10–§17 blocks A+B · SD sessions 7–13 + all six cross-question categories · LLD booking/Splitwise/hybrids · Tech modules 6, 8, 10' },
  { n:3, name:'Google tier', days:'92–154', weeks:'14–22', from:'2026-11-30', to:'2027-01-31',
    rung:'Google · Uber',
    bar:'Hard tier, implicit graphs, DP hards, rerooting. Recorded mocks. Uber machine coding.',
    work:'EVERY block C · SD sessions 14–22 · LLD machine-coding drills + Uber simulation · Tech: maintenance only' }
];


PLAN.calendar = [
  ['2', '8–14',   'Resume rewritten around Kubernetes + event-driven + Postgres. Referral list built.', false],
  ['3', '15–21',  'APPLY / trigger referrals: JP Morgan, Amex, Expedia.', true],
  ['4–7', '22–49','JPM-tier loops. Expect 2–4 weeks from apply to onsite at this tier.', false],
  ['7', '43–49',  'APPLY: Amazon, Microsoft, Adobe. These take 4–8 weeks to reach onsite.', true],
  ['10–14','64–98','Amazon / Microsoft / Adobe loops. Target: offer in hand by 29 Nov.', false],
  ['13','85–91',  'APPLY: Google, Uber. Their pipeline is 8–12 weeks — this is what makes Phase 3 land inside your notice period.', true],
  ['17–22','113–154','Google / Uber loops, during notice period.', false]
];


PLAN.split = [
  ['DSA', 220, 43.5], ['Tech', 110, 21.7], ['System design', 88, 17.4], ['LLD', 88, 17.4]
];


PLAN.rules = [
  'No solution peeking before 25 minutes on a hard, 15 on a medium. When you do look, read only the approach paragraph — never the code.',
  'Every item gets a log entry with a ROOT CAUSE line. "I made a mistake" is worthless; "I think of visited as positional when it is state-al" is fixable.',
  'Re-solve from a blank file at +1, +3, +7 and +16 days. Three re-solves of one hard beats one solve each of three hards.',
  'Talk out loud, always. The failure mode is not "couldn\'t solve it", it is "solved it silently and the interviewer could not score the signal".',
  'Weekends produce artefacts. Every SD session ends with a written one-page design AND its cross-question answers. Every LLD session ends with code that runs.',
  'Tech modules end with a hands-on artefact, not notes. Reading about Kafka does not survive the follow-up column.',
  'Say "I", not "we", in every LP story.'
];

/* ============================================================ DSA SECTIONS ===
   p = patterns (block A) · b = tier 1-2 (block B) · c = Google/Uber (block C) */


PLAN.readGeneral = [
  ['System Design Primer (the standard free syllabus)', 'https://github.com/donnemartin/system-design-primer', 1],
  ['GeeksforGeeks — System Design tutorial', 'https://www.geeksforgeeks.org/system-design-tutorial/', 1],
  ['Martin Fowler — Patterns of Distributed Systems', 'https://martinfowler.com/articles/patterns-of-distributed-systems/', 1],
  ['High Scalability — real architecture write-ups', 'http://highscalability.com/', 1],
  ['microservices.io — the pattern catalogue', 'https://microservices.io/patterns/index.html', 1]
];


PLAN.templates = [
  {g:'By day 21', n:'Binary search — first-true / last-true', d:'ONE template, half-open [lo, hi). Never deviate under pressure.'},
  {g:'By day 21', n:'Sliding window (variable)', d:'Expand right always; shrink left WHILE the invariant is violated.'},
  {g:'By day 21', n:'Prefix sum + hashmap', d:'Seed the map with {0: 1}. Know why.'},
  {g:'By day 21', n:'Monotonic stack', d:'Decide up front: increasing or decreasing, and push index or value.'},
  {g:'By day 21', n:'BFS with level tracking', d:'The for _ in range(len(queue)) pattern. The level counter is where people bug out.'},
  {g:'By day 21', n:'DFS iterative (explicit stack)', d:'And know why recursion blows the ~1000-frame limit at n = 1e5.'},
  {g:'By day 21', n:'Iterative inorder (one stack)', d:'Plus preorder and postorder-via-reversed-preorder.'},
  {g:'By day 21', n:'DSU (compression + union by size)', d:'With a component counter and size[] array.'},
  {g:'By day 21', n:'Topological sort — Kahn', d:'In-degree + queue. Cycle when len(order) != n.'},
  {g:'By day 70', n:'Dijkstra (lazy)', d:'Heap of (dist,node); skip stale. Know why lazy beats decrease-key live.'},
  {g:'By day 70', n:'Dijkstra with augmented state', d:'Heap of (cost,node,extra); dist[node][extra]. THE highest-value template here.'},
  {g:'By day 70', n:'0-1 BFS', d:'deque; appendleft for weight-0. O(V+E). Most candidates do not know it exists.'},
  {g:'By day 70', n:'Bellman-Ford / exactly-k', d:'The prev = dist.copy() inside the k-loop is the whole trick.'},
  {g:'By day 70', n:'Tree DP scaffold', d:'dfs(node) returns what the parent needs; the global answer is updated inside.'},
  {g:'By day 70', n:'Trie', d:'children map + isEnd; insert / search / startsWith / prefix-DFS.'},
  {g:'By day 70', n:'LRU cache', d:'Hashmap + doubly linked list with sentinel head/tail.'},
  {g:'By day 70', n:'Memo to tabulation conversion', d:'Write the memo, then convert mechanically. Every time until automatic.'},
  {g:'By day 70', n:'0/1 knapsack (2-D then 1-D)', d:'And know why the 1-D capacity loop runs BACKWARDS.'},
  {g:'By day 70', n:'LIS in O(n log n)', d:'tails array + bisect. The tails array is not the actual subsequence.'},
  {g:'By day 70', n:'Two-sequence grid (LCS / edit distance)', d:'match / skip-left / skip-right. Parent of a whole family.'},
  {g:'By day 70', n:'Binary search on the answer', d:'Write feasible(x) first; the search is boilerplate.'},
  {g:'By day 130', n:'Tarjan bridges', d:'disc[], low[], timer. Bridge: low[v] > disc[u].'},
  {g:'By day 130', n:'Topological sort — DFS 3-colour', d:'White/grey/black. Needed for SCC and safe-states.'},
  {g:'By day 130', n:'Binary lifting for LCA', d:'up[k][v] table, LOG = 20, depth array.'},
  {g:'By day 130', n:'Hierholzer (Euler path)', d:'Append after recursion, then reverse.'},
  {g:'By day 130', n:'Fenwick / BIT', d:'Point update, prefix query. i & -i.'},
  {g:'By day 130', n:'Morris inorder', d:'O(1) space — the standard follow-up.'},
  {g:'By day 130', n:'KMP failure function', d:'Occasionally asked at Google. Also unlocks LC 214 and 459.'},
  {g:'By day 130', n:'Submask enumeration', d:'for (s = m; s; s = (s-1) & m). Bitmask DP.'}
];


PLAN.hardPool = [864,1857,803,968,834,815,332,1483,987,212,480,218,1203,773,1697,1489,297,124,421,731,847,1293,315,753,2097,685,1192,642,272,979,312,72,10,44,410,4,76,84,146,460,132,97,174,546,1349,698,282,37,51,214,992,759,126,887,1000,25,321,407,862,1044,336,224,818,855,895];

/* ============================================================ COMPANIES ===
   weights must sum to 1.0. Buckets: core (block B), hard (block C),
   tech, sd, lld, lp, mock. */


PLAN.companies = [

{id:'jpm', tier:1, name:'JP Morgan', level:'VP / Senior Associate',
 weights:{core:0.25, tech:0.35, sd:0.15, lld:0.15, pack:0.10}, band:[55,70],
 note:'Rung one, and your fastest realistic offer. The algorithms are easy-to-medium and recognisable. What decides it is TECH DEPTH — Java, Spring, concurrency, SQL — and whether you can talk credibly about a system you actually run. Expect a 45-60 minute deep-dive on your own stack.',
 lever:'Tech modules 1-5 and 9, plus the three production narratives. Your Kubernetes and Postgres experience is worth more here than any LeetCode Hard.',
 pack:[[42,'Trapping Rain Water','pack','Asked everywhere'],[146,'LRU Cache','pack','Speed run'],[200,'Number of Islands','pack','Speed run'],[56,'Merge Intervals','pack',''],[236,'LCA of a Binary Tree','pack','Speed run'],[121,'Best Time to Buy and Sell Stock','pack',''],[20,'Valid Parentheses','pack',''],[8,'String to Integer (atoi)','pack','Spec discipline'],[155,'Min Stack','pack',''],[253,'Meeting Rooms II','pack','PREMIUM'],[380,'Insert Delete GetRandom','pack',''],[1,'Two Sum','pack','Warm-up, but be instant']]},

{id:'amex', tier:1, name:'American Express', level:'Engineer II / III',
 weights:{core:0.30, tech:0.30, sd:0.15, lld:0.15, pack:0.10}, band:[55,70],
 note:'Very close to JPM. Payments domain means the ledger, idempotency and multi-region sessions pay off directly. Slightly more coding than JPM, slightly less depth on internals.',
 lever:'SD session 11 (payments and ledger) and session 18 (multi-region). Say "idempotency key" and "double-entry" unprompted.',
 pack:[[121,'Best Time to Buy and Sell Stock','pack',''],[560,'Subarray Sum Equals K','pack',''],[146,'LRU Cache','pack',''],[49,'Group Anagrams','pack',''],[102,'Level Order Traversal','pack',''],[15,'3Sum','pack',''],[139,'Word Break','pack',''],[981,'Time Based Key-Value Store','pack',''],[692,'Top K Frequent Words','pack','']]},

{id:'expedia', tier:1, name:'Expedia', level:'SDE II',
 weights:{core:0.35, tech:0.25, sd:0.15, lld:0.15, pack:0.10}, band:[55,70],
 note:'A little more algorithmic than JPM/Amex, a little less deep on internals. Travel domain means search, availability, caching and booking races recur.',
 lever:'The booking-race LLD and the caching SD session. Both map straight onto their product.',
 pack:[[56,'Merge Intervals','pack','Availability windows'],[253,'Meeting Rooms II','pack','PREMIUM'],[1235,'Maximum Profit in Job Scheduling','pack',''],[729,'My Calendar I','pack',''],[347,'Top K Frequent Elements','pack',''],[200,'Number of Islands','pack',''],[3,'Longest Substring Without Repeating','pack',''],[973,'K Closest Points','pack','']]},

{id:'amazon', tier:2, name:'Amazon', level:'SDE2',
 weights:{core:0.25, hard:0.05, tech:0.05, sd:0.10, lld:0.15, lp:0.30, pack:0.10}, band:[45,60],
 note:'The coding bar is clearly below Google — speed and cleanliness on mediums beats hard-solving. What decides it is Leadership Principles, which is why LP carries the largest single weight. The bar-raiser can reject you on LP alone regardless of how well you coded.',
 lever:'Fifteen LP stories with real numbers, rehearsed to two minutes, saying "I" not "we". Worth more than every coding problem in this pack combined.',
 pack:[[937,'Reorder Data in Log Files','pack','Almost a rite of passage'],[1152,'Analyze User Website Visit Pattern','pack','PREMIUM — messy on purpose'],[1167,'Minimum Cost to Connect Sticks','pack','PREMIUM'],[138,'Copy List with Random Pointer','pack','O(1)-space interleave'],[973,'K Closest Points to Origin','pack','Heap AND quickselect'],[767,'Reorganize String','pack',''],[1010,'Pairs of Songs Divisible by 60','pack',''],[445,'Add Two Numbers II','pack','Without reversing'],[42,'Trapping Rain Water','pack',''],[200,'Number of Islands','pack','SPEED RUN under 8 min'],[994,'Rotting Oranges','pack','Speed run'],[5,'Longest Palindromic Substring','pack',''],[819,'Most Common Word','pack',''],[1268,'Search Suggestions System','pack','Trie — very Amazon'],[588,'Design In-Memory File System','pack','PREMIUM'],[472,'Concatenated Words','pack','Trie + DP'],[909,'Snakes and Ladders','pack',''],[79,'Word Search','pack',''],[127,'Word Ladder','pack',''],[863,'All Nodes Distance K','pack','']]},

{id:'microsoft', tier:2, name:'Microsoft', level:'SDE2',
 weights:{core:0.35, hard:0.05, tech:0.15, sd:0.10, lld:0.15, pack:0.20}, band:[50,65],
 note:'The most forgiving bar of your tier-2 set. Easier algorithms, more weight on practical coding, clean structure and collaboration. Strings, linked lists and matrices appear far more often than graphs or DP.',
 lever:'Nothing exotic. Speed and correctness on standard mediums, and not over-engineering. Microsoft rewards the boring correct answer.',
 pack:[[151,'Reverse Words in a String I & II','pack','LC 151, 186'],[54,'Spiral Matrix + Rotate Image','pack','LC 54, 48'],[73,'Set Matrix Zeroes','pack','O(1) space'],[273,'Integer to English Words','pack',''],[8,'String to Integer (atoi)','pack','The spec IS the problem'],[25,'Reverse Nodes in k-Group','pack','Hardest common list problem'],[138,'Copy List with Random Pointer','pack',''],[160,'Intersection of Two Linked Lists','pack',''],[142,'Linked List Cycle II','pack','Prove the meeting point'],[116,'Populating Next Right Pointers','pack','LC 116, 117 — O(1) space'],[348,'Design Tic-Tac-Toe','pack','PREMIUM'],[419,'Battleships in a Board','pack','O(1)-space one pass'],[189,'Rotate Array','pack',''],[442,'Find All Duplicates','pack','Index-as-hashmap'],[41,'First Missing Positive','pack','Cyclic sort'],[240,'Search a 2D Matrix II','pack','Staircase'],[622,'Design Circular Queue','pack',''],[468,'Validate IP Address','pack',''],[384,'Shuffle an Array','pack','Fisher-Yates'],[88,'Merge Sorted Array','pack','Backwards fill'],[236,'LCA of a Binary Tree','pack','Speed run'],[146,'LRU Cache','pack','Under 15 minutes']]},

{id:'adobe', tier:2, name:'Adobe', level:'MTS 2 / 3',
 weights:{core:0.35, hard:0.10, tech:0.15, sd:0.10, lld:0.15, pack:0.15}, band:[45,60],
 note:'Solid medium-to-hard algorithms with a real emphasis on clean code and OOD. Less system design than Amazon, more than Microsoft. Arrays, strings and DP recur.',
 lever:'Clean, well-named, edge-case-complete code on mediums, plus a confident OOD round. Adobe notices code quality more than most.',
 pack:[[41,'First Missing Positive','pack','Adobe favourite'],[42,'Trapping Rain Water','pack',''],[5,'Longest Palindromic Substring','pack',''],[72,'Edit Distance','pack',''],[300,'Longest Increasing Subsequence','pack',''],[152,'Maximum Product Subarray','pack',''],[56,'Merge Intervals','pack',''],[146,'LRU Cache','pack',''],[23,'Merge k Sorted Lists','pack',''],[8,'String to Integer (atoi)','pack',''],[124,'Binary Tree Maximum Path Sum','pack',''],[221,'Maximal Square','pack','']]},

{id:'flipkart', tier:2, name:'Flipkart', level:'SDE II',
 weights:{core:0.30, hard:0.10, tech:0.10, sd:0.10, lld:0.25, pack:0.15}, band:[40,55],
 note:'Machine coding is the differentiator — a 60-90 minute round where you must produce runnable, tested code. Algorithms are solid medium. LLD carries a heavy weight here.',
 lever:'Machine coding. Practise FINISHING. Most candidates have never practised under that constraint.',
 pack:[[146,'LRU Cache','pack',''],[380,'Insert Delete GetRandom','pack',''],[1235,'Maximum Profit in Job Scheduling','pack',''],[295,'Find Median from Data Stream','pack',''],[621,'Task Scheduler','pack',''],[56,'Merge Intervals','pack',''],[42,'Trapping Rain Water','pack',''],[347,'Top K Frequent Elements','pack','']]},

{id:'uber', tier:3, name:'Uber', level:'L4',
 weights:{core:0.25, hard:0.15, tech:0.05, sd:0.15, lld:0.25, pack:0.15}, band:[35,50],
 note:'Algorithms close to Google. What differs is the machine-coding round — runnable, tested code in 60-90 minutes — and a system design round where geo and real-time topics recur for obvious reasons.',
 lever:'Machine coding. An unfinished elegant design scores below a finished plain one.',
 pack:[[855,'Exam Room','pack','Design + ordered set. Very Uber'],[528,'Random Pick with Weight','pack',''],[362,'Design Hit Counter','pack','PREMIUM — the scaling follow-up IS the interview'],[981,'Time Based Key-Value Store','pack',''],[359,'Logger Rate Limiter','pack','PREMIUM'],[641,'Design Circular Deque','pack',''],[289,'Game of Life','pack','In-place + infinite-board follow-up'],[68,'Text Justification','pack',''],[224,'Basic Calculator','pack',''],[273,'Integer to English Words','pack',''],[490,'The Maze I & II','pack','PREMIUM'],[253,'Meeting Rooms II','pack','PREMIUM'],[465,'Optimal Account Balancing','pack','PREMIUM'],[727,'Minimum Window Subsequence','pack','PREMIUM'],[818,'Race Car','pack',''],[895,'Maximum Frequency Stack','pack',''],[726,'Number of Atoms','pack','Recursive parsing'],[792,'Number of Matching Subsequences','pack','']]},

{id:'google', tier:3, name:'Google', level:'L4',
 weights:{core:0.35, hard:0.25, mock:0.25, pack:0.15}, band:[25,40],
 note:'The highest algorithmic bar of your ladder. Roughly 3 of 4 rounds strong with no red flags, then a hiring committee that rejects some who passed their onsite, then team matching. Almost no system design at L4 — which is why SD and tech carry zero weight here.',
 lever:'The block-C hard tier and the recorded mocks. Google is where "solved it silently" fails hardest.',
 pack:[[68,'Text Justification','pack','The most Google problem ever written'],[681,'Next Closest Time','pack','PREMIUM — brute force IS the intended answer'],[727,'Minimum Window Subsequence','pack','PREMIUM'],[158,'Read N Characters Given read4 II','pack','PREMIUM — buffer state between calls'],[489,'Robot Room Cleaner','pack','PREMIUM — a Google classic'],[843,'Guess the Word','pack','Interactive + minimax'],[809,'Expressive Words','pack',''],[777,'Swap Adjacent in LR String','pack','The invariant proof is the interview'],[833,'Find And Replace in String','pack',''],[388,'Longest Absolute File Path','pack',''],[636,'Exclusive Time of Functions','pack',''],[299,'Bulls and Cows','pack','Deceptively fiddly'],[900,'RLE Iterator','pack',''],[715,'Range Module','pack',''],[947,'Most Stones Removed','pack','DSU in disguise'],[552,'Student Attendance Record II','pack',''],[465,'Optimal Account Balancing','pack','PREMIUM'],[774,'Minimize Max Distance to Gas Station','pack','PREMIUM'],[340,'Longest Substring with At Most K Distinct','pack','PREMIUM'],[296,'Best Meeting Point','pack','PREMIUM — median, not mean'],[683,'K Empty Slots','pack','PREMIUM'],[837,'New 21 Game','pack',''],[336,'Palindrome Pairs','pack',''],[315,'Count of Smaller Numbers After Self','pack',''],[1235,'Maximum Profit in Job Scheduling','pack',''],[692,'Top K Frequent Words','pack',''],[951,'Flip Equivalent Binary Trees','pack','']]},

{id:'apple', tier:3, name:'Apple', level:'ICT3 / ICT4',
 weights:{core:0.30, hard:0.15, tech:0.15, sd:0.15, lld:0.10, pack:0.15}, band:[30,45],
 note:'Highly team-dependent — some loops are algorithm-heavy, others are almost entirely practical and domain-specific. Broad preparation serves you better here than depth in any one area.',
 lever:'Breadth plus the ability to go deep on whatever you claim on your resume. Apple probes claimed expertise hard.',
 pack:[[146,'LRU Cache','pack',''],[42,'Trapping Rain Water','pack',''],[200,'Number of Islands','pack',''],[295,'Find Median from Data Stream','pack',''],[23,'Merge k Sorted Lists','pack',''],[76,'Minimum Window Substring','pack',''],[224,'Basic Calculator','pack',''],[297,'Serialize and Deserialize Binary Tree','pack','']]}
];


PLAN.criteria = [
 {ph:1, t:'Unseen medium, narrated', d:'<= 20 min, clean, edge cases + complexity'},
 {ph:1, t:'Phase-1 templates', d:'All nine, cold, under 3 min each'},
 {ph:1, t:'Tech modules 1-5 and 9', d:'Every follow-up answered without notes'},
 {ph:1, t:'Kafka', d:'Running locally; can explain partitions, consumer groups, ordering'},
 {ph:1, t:'Production narratives', d:'All three written and rehearsed under 3 min'},
 {ph:1, t:'SD vocabulary', d:'60+ terms defined in your own words'},
 {ph:1, t:'HireVue, on camera', d:'Three answers recorded to a 90-second timer and watched back — JPM meets you before anyone reads your code'},
 {ph:1, t:'The control sentence', d:'Four stories carrying what could have gone wrong, the rollback, and who reviewed it'},
 {ph:1, t:'Applications', d:'JPM / Amex / Expedia submitted by day 21'},
 {ph:2, t:'Unseen medium', d:'<= 15 min'},
 {ph:2, t:'Speed runs', d:'LC 200, 994, 146, 236 under 10 min cold'},
 {ph:2, t:'DP', d:'State stated in English before coding, every time'},
 {ph:2, t:'Story bank', d:'15 stories, real numbers, under 2 min each, "I" not "we" for Amazon'},
 {ph:2, t:'Recut for the rung', d:'Four stories recut for Microsoft and Adobe — learning inside the action, one org boundary, one craft decision'},
 {ph:2, t:'Amazon hybrid', d:'Design + running code + algorithm in one 60-min clock'},
 {ph:2, t:'System design', d:'Any of sessions 1-13 end-to-end in 45 min, cross-questions survived'},
 {ph:2, t:'Applications', d:'Google / Uber submitted by day 91'},
 {ph:3, t:'Unseen hard, cold, narrated', d:'<= 35 min, >= 70% over 10 attempts'},
 {ph:3, t:'All 29 templates', d:'Blank file, under 3 min each'},
 {ph:3, t:'Trigger recall', d:'Reproduce every pattern table from memory at >= 85%'},
 {ph:3, t:'Modelling', d:'neighbors(state) for any implicit-graph problem in under 3 min'},
 {ph:3, t:'State augmentation', d:'Given "at most K X", name the state tuple in under 60 sec'},
 {ph:3, t:'Machine coding', d:'90-min round finished with running, tested code'},
 {ph:3, t:'Recut for the top tier', d:'The step-back story for Google, the seniority-disagreement and ethics stories for Uber'},
 {ph:3, t:'Correctness out loud', d:'Name the argument shape — exchange, invariant, monotonicity — on ten solved problems without being asked'},
 {ph:3, t:'Stamina', d:'4 x 45-min rounds; round 4 within 15% of round 1'}
];


PLAN.strategy = [
{t:'The ladder, and why this order',
 h:'<p>Three rungs inside 154 days: <b>JP Morgan / Amex / Expedia</b>, then <b>Amazon / Microsoft / Adobe</b>, then <b>Google / Uber</b> during your notice period.</p>'+
   '<ul><li><b>Interview reps are a skill you cannot practise alone.</b> A JPM loop in week 4 is worth more as training than any mock, and it costs you nothing if it fails.</li>'+
   '<li><b>An offer in hand changes the Google conversation</b> — not for leverage games, for your own nerves. Google rounds are decided partly on composure.</li>'+
   '<li><b>The notice period is protected study time.</b> Two months winding down at work is the best possible window for the hard tier. Spending it on Kafka basics would be a misallocation.</li></ul>'+
   '<p><b>Apply early.</b> The Google application goes out in week 13, not week 22 — their pipeline is 8-12 weeks and it is longer than the preparation.</p>'},
{t:'Why the split is 43/57, and why that does not cost you DSA',
 h:'<p>The old plan was 65% DSA. This one is 43%. <b>That is not a cut — DSA hours go UP.</b></p>'+
   '<p>Old: 65 weekdays x 3h = 195h of DSA. New: 110 weekdays x 2h = <b>220h</b>, plus 110h of tech that did not exist before. The percentage falls because the denominator grew from ~287h to ~506h. Problem volume goes from ~206 to roughly 290.</p>'+
   '<p>You are not trading the Google bar for the JPM bar. You are buying both with a longer runway.</p>'},
{t:'The gradient inverts across tracks — this matters',
 h:'<p>Every track has a "block B" (tier 1-2) and a "block C" (top tier). <b>But the top tier is a different company in each track.</b></p>'+
   '<ul><li><b>DSA</b> — hardest at Google/Uber. Block C is real and large.</li>'+
   '<li><b>LLD</b> — hardest in the MIDDLE: Amazon hybrid and Uber machine coding. Google does not do LLD.</li>'+
   '<li><b>System design</b> — hardest at Uber/Apple/Amazon. <b>Google L4 has almost none</b>, which is why SD carries zero weight for Google here.</li>'+
   '<li><b>Tech</b> — hardest at the BOTTOM. JP Morgan and Amex go far deeper on @Transactional, thread pools and index plans than Google ever will. Google asks none of it.</li></ul>'+
   '<p>So the same 154 days build four different curves, and you should not expect any one of them to peak in January.</p>'},
{t:'Your stack is an asset, not a gap',
 h:'<p>Java + Spring Boot, Docker and Kubernetes in production (frontend and backend pods), PostgreSQL upstream, custom event-driven components, a <b>monolith</b>, and <b>no Kafka</b>.</p>'+
   '<p>Two halves needing different treatment. <b>Deepen</b> what you use daily — you have the intuition and lack the vocabulary, and interviewers dig deeper precisely because it is on your resume. <b>Acquire</b> Kafka and microservices hands-on, not by reading.</p>'+
   '<p><b>Running a monolith on Kubernetes is a better story than "we use microservices"</b> if you can articulate the trade-off. Most candidates parrot microservices without having felt the pain. You can say: <i>"we are monolithic, here is what actually hurts, here is the seam I would split first, and here is why we have not."</i> That beats an architecture diagram at every rung.</p>'+
   '<p>Prepare three narratives, written, with numbers: <b>(1)</b> walk me through your production system, including a failure you debugged; <b>(2)</b> where would you split the monolith; <b>(3)</b> you built event-driven components yourself — why not Kafka? After module 7 that third one converts a gap into evidence of judgement.</p>'},
{t:'What gives when you fall behind',
 h:'<p>You will fall behind. Decide now, in writing — deciding it at 11pm on a Wednesday produces the wrong answer every time.</p>'+
   '<p><b>Cut in this order:</b> company packs (capped at 15% weight, not the lever) → phase-3 stretch items → tech modules 10 and 6, compressible to reading.</p>'+
   '<p><b>Never cut:</b> the log and the revision queue — they feel optional and they are the mechanism; phase-1 tech modules 2, 5, 7, 9 (that is the JPM offer); and the DSA sections on implicit graphs, state augmentation, knapsack and two-sequence DP (that is the Google offer).</p>'+
   '<p><b>The honest risk:</b> 154 days with four tracks is tight. The first thing to slip will be the log and the revision queue, because they feel optional. I would rather you did 160 problems with the full protocol than 300 without it, and it is not close.</p>'},
{t:'What the readiness score cannot see',
 h:'<ul><li><b>Getting the interview at all.</b> Referrals and recruiter contact. None of this matters without them, and it is not study — week 2, not week 12.</li>'+
   '<li><b>Interview performance.</b> Driving, narrating, recovering when stuck. The highest-variance factor there is.</li>'+
   '<li><b>Headcount and timing.</b> Loops get cancelled, teams freeze, bars move. A rejection is not a verdict on your ability.</li>'+
   '<li><b>Correlation.</b> Interviewing at ten companies does not give you ten independent draws. Same person, same weaknesses, every loop.</li></ul>'}
];

/* --- recorded mocks: performance, not knowledge. Google weights these 25%. --- */

PLAN.mocks = [
  {ph:2, t:'First recorded DSA mock — unseen medium, narrated', d:'45 min. Watch it back and count dead-air gaps over 20 seconds.'},
  {ph:2, t:'Recorded medium mock #2 — narrate before you type', d:'Did you commit to an approach, or waffle?'},
  {ph:2, t:'Amazon hybrid simulation — 60 min, one clock', d:'Design + running code + the algorithmic core. Most people never run the code.'},
  {ph:3, t:'Blind hard mock #1', d:'Pick from the hard pool without looking. 45 min, recorded.'},
  {ph:3, t:'Blind hard mock #2', d:'Ask about input size in the first 3 minutes. Every time.'},
  {ph:3, t:'Blind hard mock #3', d:'Dry-run on an example YOU invent, including an edge case.'},
  {ph:3, t:'Blind hard mock #4', d:'State complexity precisely — recursion depth counts as space.'},
  {ph:3, t:'Blind hard mock #5', d:'Pose yourself a follow-up and answer it.'},
  {ph:3, t:'Blind hard mock #6', d:'Would you hire you?'},
  {ph:3, t:'Full-loop simulation #1 — 4 × 45 min, 15-minute breaks', d:'Two DSA, one SD, one LLD. This tests stamina, which is a real failure mode.'},
  {ph:3, t:'Full-loop simulation #2', d:'Round 4 must be within 15% of round 1.'},
  {ph:3, t:'Uber machine-coding simulation — full 90 min', d:'Runnable, tested, FINISHED. Unfinished-and-elegant loses to finished-and-plain.'}
];


export default PLAN;
