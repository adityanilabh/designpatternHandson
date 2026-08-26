/* ===== Target Ladder — plan data =====
   154 days / 22 weeks / 3 phases.  Section-major: the SECTION is the unit of
   content, the phases are the calendar.

   Compact row formats:
     pattern  = [name, disguise, move, cost]
     question = [lc, name, diff, note]      lc may be null for concept items
     qa       = [question, answerSpine, followUp]

   Progress keys are stable and content-addressed:
     DSA question   ds-<sectionId>-<block>-<index>     block = 'b' | 'c'
     pattern drill  pt-<sectionId>-<index>
     SD session     sd-<index>
     LLD problem    ld-<block>-<index>
     Tech Q&A       tq-<moduleId>-<index>
   Appending to the END of any list is always safe. */

var PLAN = {};

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

PLAN.sections = [

{ id:'arr', n:1, name:'Arrays', sub:'prefix, Kadane, in-place', phase:1,
 p:[
  ['Prefix sum','"sum of any range", repeated range totals','Build pre[i]; answer = pre[r+1]-pre[l]','O(n)/O(1)'],
  ['Prefix + hashmap','"count subarrays summing to K", "divisible by K", "equal 0s and 1s"','Seed {0:1}; look up pre-K. For divisibility store pre % K','O(n)'],
  ['Difference array','"add v to every index in [l,r]", many updates then one read','d[l]+=v; d[r+1]-=v, prefix at the end','O(1)/update'],
  ['Kadane','"maximum sum subarray", "best contiguous stretch"','cur = max(x, cur+x); track global','O(n)'],
  ['Kadane two-sided','max PRODUCT subarray, sign flips','Track maxEnd AND minEnd — a negative can become the max','O(n)'],
  ['Boyer–Moore voting','"appears more than n/2 (or n/3) times", O(1) space demanded','Candidate + counter; n/3 needs two candidates and a verify pass','O(n)/O(1)'],
  ['Dutch national flag','"sort 0/1/2", "partition into three", one pass in place','Three pointers low, mid, high','O(n) 1-pass'],
  ['Index-as-hashmap','values in [1..n], "find missing / duplicate", O(1) space','Negate a[abs(x)-1], or cyclic-sort a[i] to position a[i]-1','O(n)/O(1)'],
  ['Product except self','"without division", "everything but me"','Left-pass prefix, right-pass suffix, multiply','O(n)/O(1)'],
  ['Rotate via reverse','"rotate by k in place"','Reverse all, reverse first k, reverse rest','O(n)/O(1)'],
  ['Matrix as coordinates','spiral, rotate 90°, set-zeroes','Rotate = transpose + reverse rows. Set-zeroes = row0/col0 as markers','O(nm)']
 ],
 b:[
  [1,'Two Sum','E','Hashmap complement — the ur-pattern'],
  [121,'Best Time to Buy and Sell Stock','E','Kadane in disguise: track min-so-far'],
  [53,'Maximum Subarray','M','Kadane itself'],
  [152,'Maximum Product Subarray','M','Why you must track the min too'],
  [238,'Product of Array Except Self','M','Prefix/suffix without division'],
  [169,'Majority Element','E','Boyer–Moore; the O(1)-space follow-up is the real question'],
  [229,'Majority Element II','M','Two candidates + verification pass'],
  [75,'Sort Colors','M','Dutch national flag, one pass'],
  [268,'Missing Number','E','XOR or sum; know both'],
  [287,'Find the Duplicate Number','M','Read-only + O(1) space => Floyd cycle on indices'],
  [442,'Find All Duplicates in an Array','M','Index-as-hashmap by negation'],
  [448,'Find All Numbers Disappeared','E','Same trick'],
  [41,'First Missing Positive','H','Cyclic sort. Amazon and Adobe favourite'],
  [88,'Merge Sorted Array','E','Fill backwards'],
  [189,'Rotate Array','M','Three reversals'],
  [66,'Plus One','E','Carry propagation, watch all-nines'],
  [73,'Set Matrix Zeroes','M','O(1) space via first row/col as flags'],
  [54,'Spiral Matrix','M','Four bounds, shrink; off-by-one discipline'],
  [48,'Rotate Image','M','Transpose then reverse'],
  [240,'Search a 2D Matrix II','M','Staircase from top-right'],
  [560,'Subarray Sum Equals K','M','Prefix + hashmap seeded {0:1}'],
  [523,'Continuous Subarray Sum','M','Prefix modulo K'],
  [525,'Contiguous Array','M','Map 0 to -1, then it is 560'],
  [1010,'Pairs of Songs Divisible by 60','M','Amazon — counting by remainder'],
  [918,'Maximum Sum Circular Subarray','M','max(Kadane, total - minKadane), guard all-negative']
 ],
 cx:'merge-sort as a counting device · binary search on a real-valued answer · 2-D difference arrays · monotonic deque over a window · prefix with a BIT when the transition needs a range query',
 c:[
  [4,'Median of Two Sorted Arrays','H','Binary search on the PARTITION, not the value'],
  [315,'Count of Smaller Numbers After Self','H','Merge sort as a counter, or BIT on ranks. Google pack'],
  [493,'Reverse Pairs','H','Same machinery, different predicate — proves transfer'],
  [327,'Count of Range Sum','H','Prefix + merge sort; three ideas composed'],
  [239,'Sliding Window Maximum','H','Monotonic deque — the template you will reuse'],
  [84,'Largest Rectangle in Histogram','H','Monotonic stack; parent of 85'],
  [85,'Maximal Rectangle','H','84 applied per row. Composition'],
  [42,'Trapping Rain Water','H','Three solutions. Know why two-pointer is correct'],
  [407,'Trapping Rain Water II','H','Heap from the border inward. A genuine step up'],
  [862,'Shortest Subarray with Sum >= K','H','Negatives break sliding window => monotonic deque over prefix'],
  [410,'Split Array Largest Sum','H','Binary search on the answer; write feasible(x) first'],
  [774,'Minimize Max Distance to Gas Station','H','Google premium — binary search on a REAL answer'],
  [2251,'Number of Flowers in Full Bloom','H','Offline queries, or difference-map sweep']
 ]},

{ id:'twop', n:2, name:'Two Pointers & Sliding Window', sub:'', phase:1,
 p:[
  ['Opposite-end two pointers','Sorted input, "pair/triplet summing to target", "container", "palindrome"','lo, hi; move the one that can improve the objective','O(n)'],
  ['Same-direction fast/slow','"remove in place", "move zeroes", "dedupe sorted"','Write pointer trails read pointer','O(n)/O(1)'],
  ['Fixed-size window','"every subarray of length k", "average of k"','Add right, drop left, no shrink loop','O(n)'],
  ['Variable window','"longest substring such that…", "smallest subarray with sum >= …"','Expand right always; WHILE invalid, shrink left','O(n)'],
  ['Window with a counter map','"at most K distinct", "contains all of T", anagram windows','Count map + a formed/distinct scalar so the check is O(1)','O(n)'],
  ['atMost(K) − atMost(K−1)','"EXACTLY K" anything','Solve "at most" twice and subtract. Never write "exactly" directly','O(n)'],
  ['Two pointers over two arrays','merge, intersection, "is subsequence"','Advance the smaller/matched side','O(n+m)'],
  ['Floyd cycle detection','"no extra space", "find where it repeats"','Slow/fast, then reset one to head','O(n)/O(1)']
 ],
 b:[
  [125,'Valid Palindrome','E','Filtering + opposite ends'],
  [680,'Valid Palindrome II','E','One-deletion branch'],
  [167,'Two Sum II','M','Opposite ends on sorted'],
  [15,'3Sum','M','Sort + fix one + two pointers. Dedup IS the interview'],
  [16,'3Sum Closest','M','Same skeleton, different objective'],
  [18,'4Sum','M','Generalising the skeleton'],
  [11,'Container With Most Water','M','Why moving the shorter side is safe — prove it'],
  [26,'Remove Duplicates / Element / Move Zeroes','E','LC 26, 27, 283 — write-pointer idiom'],
  [3,'Longest Substring Without Repeating','M','Variable window + last-seen map'],
  [209,'Minimum Size Subarray Sum','M','Shrink-while'],
  [424,'Longest Repeating Character Replacement','M','Valid when len - maxFreq <= k'],
  [567,'Permutation in String','M','Fixed window + count compare'],
  [438,'Find All Anagrams','M','Same'],
  [76,'Minimum Window Substring','H','The formed counter. Asked everywhere'],
  [340,'Longest Substring with At Most K Distinct','M','PREMIUM. The archetype'],
  [141,'Linked List Cycle I & II','E','LC 141, 142 — prove why phase 2 meets at the entry'],
  [234,'Palindrome Linked List','E','Fast/slow + reverse half. O(1) space expected'],
  [986,'Interval List Intersections','M','Two pointers over intervals'],
  [392,'Is Subsequence','E','Follow-up: many queries => preprocess']
 ],
 cx:'window over a TRANSFORMED array · monotonic deque inside a window · "exactly K" by subtraction · windows whose shrink condition is not monotone (=> deque or heap)',
 c:[
  [992,'Subarrays with K Different Integers','H','The atMost subtraction at its purest'],
  [930,'Binary Subarrays With Sum','M','Same trick, easier — do it first'],
  [1248,'Count Number of Nice Subarrays','M','Same trick, third dress'],
  [480,'Sliding Window Median','H','Two heaps + LAZY DELETION. Broadly reusable'],
  [239,'Sliding Window Maximum','H','Monotonic deque'],
  [727,'Minimum Window Subsequence','H','PREMIUM. Google & Uber. Subsequence != substring'],
  [683,'K Empty Slots','H','PREMIUM. Window over a transformed array'],
  [1004,'Max Consecutive Ones III','M','Window with a budget'],
  [1234,'Replace Substring for Balanced String','M','Window on the COMPLEMENT — a real inversion'],
  [828,'Count Unique Characters of All Substrings','H','Contribution counting. Know when the window fails']
 ]},

{ id:'str', n:3, name:'Strings', sub:'', phase:1,
 p:[
  ['Frequency map / anagram key','"anagram", "permutation of", "group by"','26-array or sorted-string as the key','O(n)'],
  ['Expand around centre','"longest palindromic substring", "count palindromes"','2n-1 centres, expand both ways','O(n^2)'],
  ['Stack parsing','nested brackets, "decode k[abc]", calculator','Push context on open, pop on close','O(n)'],
  ['State machine / spec-following','atoi, "valid number", IP validation, text justification','Enumerate the states FIRST, code second. The spec is the problem','O(n)'],
  ['Rolling hash (Rabin–Karp)','"repeated substring of length L", dedupe by content','Hash, slide, verify collisions','O(n)'],
  ['KMP failure function','"shortest prefix that is also a suffix", "does the string repeat"','lps[] array','O(n)'],
  ['Encode with framing','serialize a list of strings unambiguously','len + "#" + payload — never a delimiter alone','O(n)']
 ],
 b:[
  [242,'Valid Anagram','E','Count array'],
  [49,'Group Anagrams','M','Canonical key choice'],
  [5,'Longest Palindromic Substring','M','Amazon — expand around centre'],
  [647,'Palindromic Substrings','M','Same engine, counting'],
  [20,'Valid Parentheses','E','Stack'],
  [22,'Generate Parentheses','M','Backtracking with a validity counter'],
  [151,'Reverse Words in a String','M','Microsoft; 186 is the in-place version'],
  [8,'String to Integer (atoi)','M','Microsoft/Adobe — pure spec discipline'],
  [13,'Roman to Integer / Integer to Roman','E','LC 13, 12 — table-driven'],
  [14,'Longest Common Prefix','E','Vertical scan'],
  [28,'Find the Index of the First Occurrence','E','Naive, then KMP as the follow-up'],
  [344,'Reverse String / Reverse Vowels','E','LC 344, 345'],
  [387,'First Unique Character','E','Two passes'],
  [819,'Most Common Word','E','Amazon — string hygiene under time pressure'],
  [937,'Reorder Data in Log Files','M','Amazon rite of passage — custom comparator'],
  [271,'Encode and Decode Strings','M','PREMIUM. Length-framing'],
  [443,'String Compression','M','In-place write pointer'],
  [6,'Zigzag Conversion','M','Index arithmetic, easy to fumble'],
  [68,'Text Justification','H','The most Google-flavoured spec problem. Also Uber'],
  [468,'Validate IP Address','M','Microsoft — spec discipline'],
  [273,'Integer to English Words','H','Uber/Microsoft. Tedious on purpose; tests care']
 ],
 cx:'KMP and lps reuse · Z-function · rolling hash with double modulus · counting CONTRIBUTIONS instead of enumerating substrings · DP over strings',
 c:[
  [1044,'Longest Duplicate Substring','H','Binary search on length + rolling hash. Two techniques composed'],
  [214,'Shortest Palindrome','H','KMP on s + "#" + reverse(s) — the trick worth owning'],
  [459,'Repeated Substring Pattern','E','Falls straight out of lps'],
  [336,'Palindrome Pairs','H','Google pack. Trie or reversed-prefix hashmap'],
  [809,'Expressive Words','M','Google pack — two-pointer group counting'],
  [777,'Swap Adjacent in LR String','M','Google pack. Code is short; the invariant proof is the interview'],
  [833,'Find And Replace in String','M','Google pack — index bookkeeping'],
  [726,'Number of Atoms','H','Uber — recursive parsing'],
  [224,'Basic Calculator I / II / III','H','LC 224, 227, 772. Uber & Google. III is the real one'],
  [394,'Decode String','M','Stack of (count, built-so-far)'],
  [65,'Valid Number','H','State machine. Horrible and instructive'],
  [30,'Substring with Concatenation of All Words','H','Window of words, not chars']
 ]},

{ id:'hash', n:4, name:'Hashing & Counting', sub:'', phase:1,
 p:[
  ['Complement lookup','"two things that add to X"','Map value->index, look for target-x','O(n)'],
  ['Canonical key','"group these", "are these the same shape"','Choose a key equal iff the things are equal — sorted string, normalised tuple, serialized subtree','O(nk)'],
  ['Count then decide','"top K frequent", "most common", "can we rearrange"','Counter, then heap / bucket / greedy','O(n)'],
  ['Bucket by frequency','"top K" with K near n, or O(n) demanded','buckets[freq] = [items], walk down','O(n)'],
  ['Seen-set as a graph probe','"longest consecutive sequence"','Only start a run at x when x-1 is not in the set','O(n)'],
  ['Hash + doubly linked list','"O(1) get, put, and eviction"','LRU','O(1)']
 ],
 b:[
  [217,'Contains Duplicate I & II','E','LC 217, 219 — set, then windowed set'],
  [128,'Longest Consecutive Sequence','M','The x-1 guard is the whole problem'],
  [347,'Top K Frequent Elements','M','Heap AND bucket sort — know both'],
  [692,'Top K Frequent Words','M','Amazon/Google. The lexicographic tie-break is where people fail'],
  [383,'Ransom Note / Isomorphic / Word Pattern','E','LC 383, 205, 290 — a bijection needs TWO maps'],
  [349,'Intersection of Two Arrays I & II','E','LC 349, 350 — set vs multiset'],
  [249,'Group Shifted Strings','M','PREMIUM. Canonical key design'],
  [380,'Insert Delete GetRandom O(1)','M','Amazon/Uber. Array + index map; swap-with-last on delete'],
  [381,'Insert Delete GetRandom — duplicates allowed','H','Same, with a set of indices'],
  [146,'LRU Cache','M','Everywhere. Be fastest at this'],
  [1152,'Analyze User Website Visit Pattern','M','PREMIUM. Amazon — deliberately messy, and that is the point']
 ],
 cx:'canonical id assignment to avoid O(n^2) string cost · frequency-bucket structures · versioned/time-indexed maps',
 c:[
  [652,'Find Duplicate Subtrees','M','Canonical serialization + id assignment'],
  [288,'Unique Word Abbreviation','M','PREMIUM. Google pack'],
  [359,'Logger Rate Limiter','E','PREMIUM. Google & Uber — design warm-up'],
  [981,'Time Based Key-Value Store','M','Uber — map to sorted list + binary search'],
  [895,'Maximum Frequency Stack','H','Uber — stack of stacks keyed by frequency'],
  [460,'LFU Cache','H','Two maps + frequency buckets. The hard sibling of 146'],
  [936,'Stamping The Sequence','H','Reverse thinking + greedy matching']
 ]},

{ id:'bs', n:5, name:'Binary Search', sub:'', phase:1,
 p:[
  ['First-true / last-true','"find the boundary", "leftmost index where…"','ONE template, half-open [lo, hi). Never deviate under pressure','O(log n)'],
  ['Binary search on the answer','"MINIMISE THE MAXIMUM", "maximise the minimum", "smallest k such that possible"','Write feasible(x) first; the search is boilerplate','O(n log R)'],
  ['Rotated array','"sorted but rotated"','Decide which half is sorted, then whether the target lies in it','O(log n)'],
  ['2-D grid','sorted rows and columns','Flatten to 1-D, or staircase from top-right','O(log nm)'],
  ['Real-valued answer','answers are doubles; "within 1e-6"','Fixed ~100 iterations, not lo < hi','O(100n)'],
  ['Search the partition','two sorted arrays, median, kth','Search the SPLIT POINT, not the value','O(log min)'],
  ['Binary search inside DP/greedy','"longest increasing", "job scheduling by end time"','bisect over tails[] or over sorted ends','O(n log n)'],
  ['Peak / unimodal','"find any peak", "mountain array"','Compare with the neighbour and walk uphill','O(log n)']
 ],
 b:[
  [704,'Binary Search','E','The template'],
  [35,'Search Insert Position','E','First-true'],
  [34,'Find First and Last Position','M','Two boundary searches'],
  [33,'Search in Rotated Sorted Array I & II','M','LC 33, 81. Duplicates break the invariant in II — say why'],
  [153,'Find Minimum in Rotated Array I & II','M','LC 153, 154'],
  [74,'Search a 2-D Matrix I & II','M','LC 74, 240 — flatten vs staircase'],
  [69,'Sqrt(x)','E','Integer binary search'],
  [278,'First Bad Version','E','First-true, literally'],
  [162,'Find Peak Element','M','Unimodal'],
  [852,'Peak Index in a Mountain Array','E','Same'],
  [875,'Koko Eating Bananas','M','THE canonical "on the answer". Do this first'],
  [1011,'Capacity To Ship Packages','M','Same shape, different feasible()'],
  [1552,'Magnetic Force Between Two Balls','M','Maximise-the-minimum'],
  [540,'Single Element in a Sorted Array','M','Parity of the index'],
  [658,'Find K Closest Elements','M','Binary search the window start'],
  [528,'Random Pick with Weight','M','Uber — prefix sum + binary search'],
  [981,'Time Based Key-Value Store','M','Uber']
 ],
 cx:'binary search on the VALUE with a counting helper · real-valued search · search-the-partition · binary search composed with DP or a rolling hash',
 c:[
  [4,'Median of Two Sorted Arrays','H','Search the partition'],
  [410,'Split Array Largest Sum','H','The DP-vs-binary-search conversation is the signal'],
  [1231,'Divide Chocolate','H','Maximise the minimum'],
  [1482,'Minimum Days to Make m Bouquets','M','feasible() is a scan'],
  [774,'Minimize Max Distance to Gas Station','H','PREMIUM. Real-valued'],
  [644,'Maximum Average Subarray II','H','PREMIUM. Real-valued + prefix trick'],
  [1044,'Longest Duplicate Substring','H','Binary search + rolling hash'],
  [1235,'Maximum Profit in Job Scheduling','H','Google pack. DP + binary search composed'],
  [668,'Kth Smallest Number in Multiplication Table','H','Binary search on the VALUE, count with a helper'],
  [378,'Kth Smallest Element in a Sorted Matrix','M','Heap AND binary-search-on-value. Do both'],
  [719,'Find K-th Smallest Pair Distance','H','Binary search on value + two pointers to count']
 ]},

{ id:'sort', n:6, name:'Sorting & Greedy', sub:'', phase:1,
 p:[
  ['Sort by the right key','"schedule", "minimum number of X", "maximum non-overlapping"','The WHOLE problem is the key. End time => max non-overlap. Start time => merge','O(n log n)'],
  ['Exchange argument','"is this greedy correct?"','Show swapping any adjacent out-of-order pair does not worsen the answer. SAY THIS OUT LOUD — it is scored',''],
  ['Greedy with regret (heap)','"you may do K upgrades", "at most k refuels"','Take greedily, push what you skipped, pop the best regret when stuck','O(n log n)'],
  ['Custom comparator','"largest number from these pieces", "log file ordering"','Comparator on the CONCATENATION or on the tuple','O(n log n)'],
  ['Counting / bucket sort','small value range, O(n) demanded','Count array','O(n+k)'],
  ['Quickselect','"kth largest", full sort not needed','Partition, recurse one side','O(n) avg'],
  ['Cyclic sort','values are a permutation of 1..n','Swap a[i] home until it is','O(n)'],
  ['Merge sort as a counter','"count inversions", "smaller after self"','Count across the merge step','O(n log n)']
 ],
 b:[
  [215,'Kth Largest Element','M','Amazon. Heap AND quickselect'],
  [973,'K Closest Points to Origin','M','Amazon. Same'],
  [179,'Largest Number','M','Comparator on concatenation'],
  [56,'Merge Intervals','M','Sort by START'],
  [435,'Non-overlapping Intervals','M','Sort by END'],
  [452,'Minimum Arrows to Burst Balloons','M','Same'],
  [455,'Assign Cookies','E','Two sorted pointers'],
  [122,'Best Time to Buy and Sell Stock II','M','Greedy sum of positive deltas'],
  [55,'Jump Game I & II','M','LC 55, 45 — reachability greedy, then BFS-by-level greedy'],
  [134,'Gas Station','M','The "if total >= 0, an answer exists" argument'],
  [621,'Task Scheduler','M','Amazon — the formula, and why it works'],
  [767,'Reorganize String','M','Amazon — heap greedy'],
  [1167,'Minimum Cost to Connect Sticks','M','PREMIUM. Amazon — heap greedy'],
  [1481,'Least Number of Unique Integers after K Removals','M','Amazon — count then greedy'],
  [253,'Meeting Rooms II','M','PREMIUM. Uber. Heap or sweep — know both'],
  [1834,'Single-Threaded CPU','M','Two-stage heap'],
  [148,'Sort List','M','Merge sort on a linked list']
 ],
 cx:'the regret heap in its four disguises · merge-sort counting · greedy + stack (monotonic) · proving a greedy with an exchange argument',
 c:[
  [857,'Minimum Cost to Hire K Workers','H','Sort by ratio + max-heap of quality. A beautiful greedy'],
  [502,'IPO','H','Two heaps: capital min-heap feeding a profit max-heap'],
  [1642,'Furthest Building You Can Reach','M','THE REGRET HEAP. Learn this shape'],
  [871,'Minimum Number of Refueling Stops','H','Same shape, restated'],
  [630,'Course Schedule III','H','Regret again — three dresses, one idea'],
  [315,'Count of Smaller Numbers After Self','H','Merge-sort counting'],
  [493,'Reverse Pairs','H','Same'],
  [759,'Employee Free Time','H','PREMIUM. Google pack — k-way interval merge'],
  [402,'Remove K Digits','M','Monotonic stack greedy'],
  [316,'Remove Duplicate Letters','H','LC 316, 1081. Greedy + stack + last-occurrence'],
  [135,'Candy','H','Two sweeps; the proof is the interview']
 ]},

{ id:'ll', n:7, name:'Linked List', sub:'', phase:1,
 p:[
  ['Dummy head','any problem that may delete the head','Allocate a sentinel; return dummy.next. Removes every edge case','O(1)'],
  ['Fast/slow','"middle", "cycle", "nth from end", "palindrome"','Two pointers at different speeds','O(n)/O(1)'],
  ['Reverse in place','"reverse", "reverse in groups of k"','prev/cur/next three-pointer walk','O(n)/O(1)'],
  ['Merge two lists','"merge sorted", merge sort on a list','Dummy + compare-and-append','O(n+m)'],
  ['Interleave / split','reorder list, odd-even, copy with random pointer','Split, reverse one half, zip','O(n)/O(1)'],
  ['Map of nodes','deep copy with extra pointers','Map old->new, or interleave clones then unweave for O(1) space','O(n)'],
  ['Two-pass length','"intersection of two lists", "rotate by k"','Compute lengths, align, walk','O(n)']
 ],
 b:[
  [206,'Reverse Linked List I & II','E','LC 206, 92. II needs a dummy'],
  [21,'Merge Two Sorted Lists','E','Dummy'],
  [141,'Cycle I & II','E','LC 141, 142. Floyd, and the entry proof'],
  [143,'Reorder List','M','Split + reverse + zip — three patterns in one'],
  [19,'Remove Nth From End','M','One pass with a gap'],
  [2,'Add Two Numbers I & II','M','LC 2, 445. Amazon — II WITHOUT reversing'],
  [138,'Copy List with Random Pointer','M','Amazon/Microsoft. Know the O(1)-space interleave'],
  [160,'Intersection of Two Linked Lists','E','Microsoft. The swap-heads trick'],
  [234,'Palindrome Linked List','E','O(1) space expected'],
  [328,'Odd Even Linked List','M','In-place split'],
  [61,'Rotate List','M','Make it circular, then cut'],
  [83,'Remove Duplicates I & II','E','LC 83, 82. II needs a dummy'],
  [707,'Design Linked List','M','Index bookkeeping'],
  [146,'LRU Cache','M','Hashmap + DLL. The one to be fastest at']
 ],
 cx:'k-group reversal with O(1) space · list problems solved by transferring a non-list pattern (prefix sum, list-intersection as LCA)',
 c:[
  [25,'Reverse Nodes in k-Group','H','THE hardest common list problem. Iteratively, O(1) space'],
  [23,'Merge k Sorted Lists','H','Heap of k heads'],
  [460,'LFU Cache','H','Two-level bucketing'],
  [1650,'LCA III with Parent Pointers','M','PREMIUM. Solve it AS list-intersection — the transfer is the lesson'],
  [430,'Flatten a Multilevel Doubly Linked List','M','Stack or recursion'],
  [708,'Insert into a Sorted Circular List','M','PREMIUM. Edge cases are the entire problem'],
  [1171,'Remove Zero Sum Consecutive Nodes','M','Prefix sum + hashmap ON A LIST'],
  [148,'Sort List','M','O(1)-space bottom-up merge sort is the follow-up']
 ]},

{ id:'stack', n:8, name:'Stack, Queue & Monotonic Stack', sub:'', phase:1,
 p:[
  ['Plain stack','"matching", "nested", "undo", "innermost first"','Push context, pop on close','O(n)'],
  ['Monotonic stack (decreasing)','"NEXT GREATER element", "days until warmer", "how far right until bigger"','Pop while top < cur; the popped item answer is cur','O(n)'],
  ['Monotonic stack (increasing)','"next smaller", histogram, "largest rectangle"','Mirror. DECIDE UP FRONT: increasing or decreasing, index or value','O(n)'],
  ['Monotonic deque','monotonic behaviour INSIDE a window','Deque of indices; pop from both ends','O(n)'],
  ['Stack for parsing/eval','calculator, decode string, file paths, exclusive time','One stack, or one per context type','O(n)'],
  ['Two stacks','queue from stacks, min-stack, calculator with signs','Amortised transfer, or a parallel stack of minima','O(1) amort'],
  ['Stack of pending','asteroid collision, remove-k-digits, dedupe-letters','Push, then resolve conflicts against the top','O(n)']
 ],
 b:[
  [20,'Valid Parentheses','E','The base case'],
  [155,'Min Stack','M','Parallel stack of minima'],
  [232,'Queue from Stacks / Stack from Queues','E','LC 232, 225 — amortised analysis'],
  [739,'Daily Temperatures','M','THE canonical monotonic stack'],
  [496,'Next Greater Element I & II','E','LC 496, 503. II: circular => iterate 2n'],
  [901,'Online Stock Span','M','Monotonic stack, streaming'],
  [42,'Trapping Rain Water','H','Stack solution, plus two others'],
  [84,'Largest Rectangle in Histogram','H','The parent problem'],
  [85,'Maximal Rectangle','H','84 per row'],
  [394,'Decode String','M','Stack of (count, prefix)'],
  [71,'Simplify Path','M','Stack of components'],
  [150,'Evaluate RPN','M',''],
  [227,'Basic Calculator II','M','Sign carried into the stack'],
  [735,'Asteroid Collision','M','Resolve against the top'],
  [402,'Remove K Digits','M','Greedy + monotonic stack'],
  [1047,'Remove Adjacent Duplicates I & II','E','LC 1047, 1209 — stack with counts'],
  [636,'Exclusive Time of Functions','M','Google pack — stack simulation'],
  [388,'Longest Absolute File Path','M','Google pack — parse + stack']
 ],
 cx:'monotonic deque over prefix sums · CONTRIBUTION counting via monotonic stack · stack-vs-DP duality · monotonic stack scanned from the right',
 c:[
  [224,'Basic Calculator I & III','H','LC 224, 772. Uber & Google. III (parens + precedence) is the real one'],
  [239,'Sliding Window Maximum','H','Monotonic deque'],
  [862,'Shortest Subarray with Sum at Least K','H','Deque over prefix sums — non-obvious'],
  [316,'Remove Duplicate Letters','H','Stack + greedy + last-occurrence'],
  [321,'Create Maximum Number','H','Composition: pick-k monotone + merge'],
  [907,'Sum of Subarray Minimums','M','CONTRIBUTION counting. Learn this idea'],
  [2104,'Sum of Subarray Ranges','M','Same idea, twice'],
  [1130,'Minimum Cost Tree From Leaf Values','M','Monotonic stack OR interval DP — see both'],
  [895,'Maximum Frequency Stack','H','Uber'],
  [456,'132 Pattern','M','Monotonic stack from the right — genuinely tricky'],
  [32,'Longest Valid Parentheses','H','Stack AND DP — do both']
 ]},

{ id:'heap', n:9, name:'Heap & Top-K', sub:'', phase:1,
 p:[
  ['Top-K with the OPPOSITE heap','"k largest", "k closest"','MIN-heap of size k for k-LARGEST. The polarity is the opposite of what feels natural','O(n log k)'],
  ['K-way merge','"merge k sorted", "smallest range covering all lists"','Heap of k cursors','O(n log k)'],
  ['Two heaps','"MEDIAN", "balance two halves"','Max-heap low half, min-heap high half, rebalance by size','O(log n)'],
  ['Lazy deletion','heap needs "remove an arbitrary element"','to_delete count map; discard stale entries at the top','O(log n) amort'],
  ['Greedy with regret','"at most k upgrades / refuels / skips"','Push what you passed on; pop the best regret when stuck','O(n log n)'],
  ['Scheduling by two keys','"tasks with start and priority", CPU scheduling','Sort by key 1, heap by key 2','O(n log n)'],
  ['Heap as a sweep frontier','trapping rain water II, skyline','Pop the current global minimum boundary','O(n log n)'],
  ['Bucket instead of heap','"top K" where K is near n, or O(n) required','buckets[freq]','O(n)']
 ],
 b:[
  [215,'Kth Largest Element','M','Min-heap of size k, and quickselect'],
  [703,'Kth Largest in a Stream','E','Streaming version'],
  [347,'Top K Frequent Elements / Words','M','LC 347, 692. Bucket vs heap; the tie-break in 692'],
  [973,'K Closest Points','M','Amazon'],
  [23,'Merge k Sorted Lists','H','K-way merge'],
  [295,'Find Median from Data Stream','H','TWO HEAPS. The rebalance invariant is the interview'],
  [253,'Meeting Rooms II','M','PREMIUM. Uber'],
  [621,'Task Scheduler','M','Amazon'],
  [1167,'Minimum Cost to Connect Sticks','M','PREMIUM. Amazon'],
  [1834,'Single-Threaded CPU','M','Two-stage'],
  [378,'Kth Smallest in a Sorted Matrix','M','Heap, then binary-search-on-value'],
  [373,'K Pairs with Smallest Sums','M','Heap over a virtual grid'],
  [1046,'Last Stone Weight','E','Warm-up']
 ],
 cx:'lazy deletion · chained heaps · the regret heap · heap as a geometric sweep frontier',
 c:[
  [480,'Sliding Window Median','H','Two heaps + LAZY DELETION'],
  [502,'IPO','H','Two heaps chained'],
  [857,'Minimum Cost to Hire K Workers','H','Ratio sort + heap'],
  [1642,'Furthest Building You Can Reach','M','Regret heap'],
  [871,'Minimum Refueling Stops','H','Regret heap'],
  [630,'Course Schedule III','H','Regret heap'],
  [1383,'Maximum Performance of a Team','H','Sort by one key, heap the other'],
  [632,'Smallest Range Covering K Lists','H','K-way merge + window'],
  [407,'Trapping Rain Water II','H','Heap as a sweep frontier'],
  [218,'The Skyline Problem','H','LEGENDARY. Heap + sweep, or divide & conquer'],
  [895,'Maximum Frequency Stack','H','Uber']
 ]}
];

PLAN.sections = PLAN.sections.concat([

{ id:'intv', n:10, name:'Intervals', sub:'', phase:2,
 p:[
  ['Sort by START, then merge','"merge overlapping", "insert an interval"','If cur.start <= last.end, extend; else push','O(n log n)'],
  ['Sort by END, then greedy','"MAXIMUM NON-OVERLAPPING", "minimum removals", "minimum arrows"','Take the earliest-ending compatible one','O(n log n)'],
  ['Sweep line / difference map','"maximum concurrent", "how many at time t", booking counts','+1 at start, -1 at end, sort events, running sum, track max','O(n log n)'],
  ['Heap of end times','"minimum rooms / resources needed"','Pop every meeting that has ended; heap size is the answer','O(n log n)'],
  ['Ordered map of intervals','"book if free", "range module", dynamic add/remove','TreeMap; floorKey and ceilingKey are the whole API','O(log n)'],
  ['Overlap test','any of the above','a.start < b.end && b.start < a.end. Write it once, never re-derive',''],
  ['Two pointers over two lists','"free time common to both"','Advance the one that ends first','O(n+m)']
 ],
 b:[
  [56,'Merge Intervals','M','Sort by start'],
  [57,'Insert Interval','M','Three phases: before, merge, after'],
  [252,'Meeting Rooms I & II','E','LC 252, 253. PREMIUM. Uber'],
  [435,'Non-overlapping Intervals','M','Sort by end'],
  [452,'Minimum Arrows','M','Same'],
  [986,'Interval List Intersections','M','Two pointers'],
  [228,'Summary Ranges','E','Warm-up'],
  [1288,'Remove Covered Intervals','M','Sort by start asc, end desc'],
  [729,'My Calendar I','M','Google favourite. TreeMap'],
  [1229,'Meeting Scheduler','M','PREMIUM. Two pointers']
 ],
 cx:'sweep-line difference map with a running max · interval TreeMap with merge AND split · coordinate compression · sweep + segment tree',
 c:[
  [731,'My Calendar II','M','Double-booking list, or a count map'],
  [732,'My Calendar III','H','SWEEP-LINE difference map with a running max. The general solution'],
  [715,'Range Module','H','Google pack. Interval TreeMap with merge and split'],
  [759,'Employee Free Time','H','PREMIUM. Google pack'],
  [218,'The Skyline Problem','H','Sweep + heap'],
  [699,'Falling Squares','H','Coordinate compression + segment tree'],
  [850,'Rectangle Area II','H','Sweep + segment tree over y'],
  [2251,'Number of Flowers in Full Bloom','H','Offline queries + sorted starts/ends']
 ]},

{ id:'tree', n:11, name:'Trees & BST', sub:'', phase:2,
 p:[
  ['DFS returning what the PARENT needs','almost every tree problem','dfs(node) -> value the parent needs; the ANSWER is updated inside at each node. Two different quantities','O(n)'],
  ['Path that bends at a node','"any path", "diameter", "max path sum"','Return max(0, best straight-down); update global with left+right+val','O(n)'],
  ['Root-to-leaf path','"path sum equals target", "all paths"','DFS + a backtracked list','O(nh)'],
  ['Downward path anywhere','"path sum III", "count paths summing to K"','Prefix sum + hashmap along the DFS path — and DECREMENT ON THE WAY UP. That backtrack is the bug everyone ships','O(n)'],
  ['BFS by level','"level order", "right side view", "zigzag", "minimum depth"','for _ in range(len(queue)) — the level counter is where people bug out','O(n)'],
  ['Tree -> undirected graph','"ALL NODES AT DISTANCE K", "infection spreads", "burn the tree"','Build a parent map, then plain BFS','O(n)'],
  ['Rerooting','"the answer for EVERY NODE as root"','Two passes: down-DFS accumulates, second DFS redistributes using the parent answer. O(n^2) -> O(n)','O(n)'],
  ['Post-order greedy with states','"cover / monitor all nodes with the fewest X"','Return one of 3 states: needs-cover / covered / has-camera','O(n)'],
  ['Choose-or-skip on nodes','"cannot take a node and its child"','Tree DP returning a (take, skip) tuple','O(n)'],
  ['Canonical serialization','"duplicate subtrees", "is this a subtree of that"','Serialize with null markers -> hashmap. Assign integer IDs to avoid O(n^2) string cost — that discussion is the signal','O(n)'],
  ['Construct from traversals','pre+in, in+post, pre+post','Recursion + an index hashmap for O(n). Know WHY pre+post is not unique','O(n)'],
  ['BST bounds','"validate", "range sum", "trim"','Carry (lo, hi) down; prune whole subtrees. NEVER validate with just left < root','O(n)'],
  ['Inorder is sorted','"kth smallest", "recover swapped nodes", "closest value"','Iterative inorder with one stack, stop early','O(h) space'],
  ['Morris traversal','"can you do it in O(1) SPACE?"','Thread via right-most predecessors, unthread on the way back','O(n)/O(1)'],
  ['Augment with subtree size','"kth smallest WHEN THE TREE CHANGES OFTEN"','Store leftSubtreeSize; descend in O(h). An order-statistic tree — the ONE place AVL knowledge pays','O(h)'],
  ['Binary lifting','"kth ancestor", repeated LCA queries','up[k][v] = up[k-1][up[k-1][v]], LOG = 20','O(n log n)']
 ],
 b:[
  [94,'Traversals — ITERATIVELY','M','LC 94, 144, 145. One stack each; postorder via reversed-modified-preorder'],
  [102,'Level order / bottom-up / zigzag','M','LC 102, 107, 103 — the level loop'],
  [199,'Right Side View','M','Last node per level'],
  [104,'Max depth / Min depth / Balanced','E','LC 104, 111, 110. Min depth leaf edge case'],
  [226,'Invert Binary Tree','E',''],
  [100,'Same / Symmetric / Subtree','E','LC 100, 101, 572. 572 also has an O(n+m) serialize+KMP answer'],
  [543,'Diameter','E','The bend-at-a-node scaffold'],
  [112,'Path Sum I & II','E','LC 112, 113 — backtracking'],
  [437,'Path Sum III','M','Prefix map + DECREMENT on the way up'],
  [236,'LCA of BT / of BST','M','LC 236, 235 — two different algorithms, do not conflate'],
  [105,'Build from pre+in / in+post','M','LC 105, 106 — index map'],
  [98,'Validate BST','M','Bounds, not comparison'],
  [700,'BST search / insert / DELETE','M','LC 700, 701, 450. 450 three cases — people fumble this live'],
  [230,'Kth Smallest in BST','M','And the "tree changes often" follow-up'],
  [173,'BST Iterator','M','O(h) space; then support prev()'],
  [108,'Sorted array / list to balanced BST','E','LC 108, 109'],
  [938,'Range sum / Trim / Two Sum in BST','E','LC 938, 669, 653 — pruning'],
  [297,'Serialize and Deserialize BT','H','Preorder + null sentinels'],
  [863,'All Nodes Distance K','M','Amazon — tree to graph'],
  [116,'Populating Next Right Pointers','M','LC 116, 117. Microsoft — 117 with O(1) space'],
  [114,'Flatten to Linked List','M','Morris-style O(1) version'],
  [124,'Binary Tree Maximum Path Sum','H','THE archetype'],
  [337,'House Robber III','M','(take, skip)'],
  [662,'Maximum Width of Binary Tree','M','Index arithmetic, watch overflow']
 ],
 cx:'rerooting · binary lifting · Morris · canonical-ID serialization · vertical order with tie-breaks · 4-tuple tree DP',
 c:[
  [834,'Sum of Distances in Tree','H','THE rerooting archetype. If you learn one thing here, this'],
  [968,'Binary Tree Cameras','H','Post-order greedy, 3 states. Hard and worth it'],
  [979,'Distribute Coins in Binary Tree','M','Return the EXCESS; accumulate abs(l)+abs(r)'],
  [1483,'Kth Ancestor of a Tree Node','H','BINARY LIFTING'],
  [987,'Vertical Order Traversal','H','The sort-by-value tie-break is where everyone fails'],
  [314,'Vertical Order Traversal','M','PREMIUM. Google favourite — note the different tie-break'],
  [99,'Recover BST','M','Two inversions in inorder; do the MORRIS O(1) version'],
  [449,'Serialize/Deserialize BST','M','MUST be shorter than 297 output. If it is not, you failed the problem'],
  [428,'Serialize/Deserialize N-ary Tree','H','Framing discipline'],
  [652,'Find Duplicate Subtrees','M','Canonical IDs'],
  [1373,'Maximum Sum BST in a Binary Tree','H','Tree DP returning a 4-tuple — great composition drill'],
  [1372,'Longest ZigZag Path','M','Two-state DFS'],
  [2385,'Amount of Time for Tree to Be Infected','M','863 restated'],
  [1650,'LCA III with parent pointers','M','PREMIUM. Solve as list-intersection'],
  [1123,'LCA of Deepest Leaves','M','Return (depth, node)'],
  [272,'Closest BST Values II','H','PREMIUM. Google classic — two stacks as pred/succ iterators'],
  [951,'Flip Equivalent Binary Trees','M','Google pack'],
  [545,'Boundary of Binary Tree','M','PREMIUM. Three careful walks'],
  [null,'AVL / Red-Black — CONCEPTS ONLY, 2h hard cap','M','Balance factor, 4 rotation cases, RB 5 invariants, why TreeMap is RB. DO NOT implement insert/delete']
 ]},

{ id:'trie', n:12, name:'Trie', sub:'', phase:2,
 p:[
  ['Standard trie','"prefix", "autocomplete", "dictionary", "starts with"','children map + isEnd','O(L)'],
  ['Trie + DFS wildcard','"search with . matching any char"','At ., recurse into every child','O(26^dots)'],
  ['Trie + grid backtracking','"find ALL WORDS FROM THE LIST in this board"','Walk board and trie together. Two optimisations make it pass: prune leaf nodes after a word is found, and store the word on the terminal node',''],
  ['Binary trie (bitwise)','"MAXIMUM XOR pair", "max XOR with a limit"','32 levels; at each bit greedily descend to the opposite bit','O(32n)'],
  ['Suffix trie / reversed insert','"stream of characters", "suffix search"','Insert reversed words; query the reversed stream','O(L)'],
  ['Trie + DP','"can this word be built from others"','Trie walk inside a DP over positions','O(nL)'],
  ['Trie with payload','autocomplete ranked by frequency; top-k per prefix','Store the top-k list on each node','']
 ],
 b:[
  [208,'Implement Trie','M','The template'],
  [211,'Add and Search Words','M','Wildcard DFS'],
  [212,'Word Search II','H','THE one that matters. Trie + grid DFS + pruning'],
  [648,'Replace Words','M','Shortest-root lookup'],
  [720,'Longest Word in Dictionary','M','Ordering + trie'],
  [676,'Implement Magic Dictionary','M','Exactly-one-mismatch'],
  [1268,'Search Suggestions System','M','Amazon — very on-brand'],
  [472,'Concatenated Words','H','Amazon — trie + DP']
 ],
 cx:'binary trie for XOR · trie with a ranked payload · Aho-Corasick-lite streaming · combined prefix#suffix keys',
 c:[
  [421,'Maximum XOR of Two Numbers','M','BINARY TRIE. A genuinely different use of the structure'],
  [1707,'Maximum XOR With an Element From Array','H','Binary trie + offline queries sorted by limit'],
  [336,'Palindrome Pairs','H','Google pack. Trie of reversed words + palindromic-remainder check'],
  [642,'Design Search Autocomplete System','H','PREMIUM. Google pack — trie with ranked payload'],
  [1032,'Stream of Characters','H','Suffix-trie trick, or Aho-Corasick-lite'],
  [745,'Prefix and Suffix Search','H','Two tries, or a combined key suffix#prefix'],
  [588,'Design In-Memory File System','H','PREMIUM. Google & Amazon — a file system IS an n-ary tree'],
  [425,'Word Squares','H','PREMIUM. Trie + backtracking']
 ]},

{ id:'graph', n:13, name:'Graphs', sub:'the biggest section', phase:2,
 p:[
  ['BFS','"shortest", ALL EDGES COST 1','Queue, visited on push','O(V+E)'],
  ['Multi-source BFS','"shortest from ANY of these", "spreading from several places at once"','Seed the queue with ALL sources — one virtual super-source','O(V+E)'],
  ['Bidirectional BFS','both endpoints known, huge branching factor','Expand the smaller frontier each round','~b^(d/2)'],
  ['DFS / flood fill','"islands", "regions", "connected components"','Recursion or explicit stack. Know why recursion dies at n=1e5 in Python','O(V+E)'],
  ['Reverse thinking','"regions NOT touching the border", "cells that reach both oceans"','BFS/DFS INWARD from the border, then invert','O(V+E)'],
  ['Dijkstra (lazy)','"shortest", POSITIVE WEIGHTS','Heap of (dist,node); skip stale with if d > dist[u]: continue','O(E log V)'],
  ['Dijkstra with AUGMENTED STATE','"AT MOST K stops / removals / refuels", "with a fuel budget"','Heap of (cost,node,extra); dist becomes 2-D dist[node][extra]. THE single highest-value template','O(EK log)'],
  ['Bitmask in the state','"collect all keys", "visit every node", N <= 20','State = (node, visitedMask)','O(2^n n)'],
  ['0-1 BFS','edge weights are ONLY 0 AND 1','deque; appendleft for 0, append for 1. O(V+E) not O(E log V). Most candidates do not know it exists','O(V+E)'],
  ['Bellman-Ford / exactly-k','negative edges, or "EXACTLY k edges"','prev = dist.copy() inside the k-loop — that copy IS the trick','O(VE)'],
  ['Floyd-Warshall','all-pairs, n <= 400','Triple loop, k outermost','O(n^3)'],
  ['Minimax path','"MINIMISE THE MAXIMUM EDGE on the path"','Three equivalent answers: Dijkstra-with-max, binary search + BFS, Kruskal + DSU. Recognise they are the same problem',''],
  ['Path counting','"count the shortest paths"','Carry ways[]; reset on improve, accumulate on tie','O(E log V)'],
  ['Topological sort — Kahn','"prerequisites", "ordering", "before"','In-degree + queue; cycle iff len(order) != n','O(V+E)'],
  ['Topological sort — DFS 3-colour','needed for SCC and "safe states"','white/grey/black','O(V+E)'],
  ['Topo + DP','A VALUE ACCUMULATES ALONG A DAG','Process in topo order; when you reach v, every predecessor dp is final. Say that invariant out loud before coding','O(V+E)'],
  ['DAG in disguise','"longest increasing path in a matrix", monotone constraints','It is a DAG => memoized DFS','O(nm)'],
  ['Bipartite / 2-colouring','"two groups", "no two adjacent alike", "dislikes"','BFS colouring, or DSU with parity','O(V+E)'],
  ['DSU','"merge these", "same group", incremental unions','Path compression + union by size, with a component counter','~O(1)'],
  ['DSU offline sweep','queries with a WEIGHT THRESHOLD','Sort queries by limit, sort edges by weight, one DSU pass','O((E+Q)log)'],
  ['Reverse-time DSU','THINGS GET REMOVED OVER TIME','Process backwards, so removals become additions','O(a)'],
  ['Weighted DSU','ratios, "a/b = 2.0", parity constraints','Store the weight to the parent; compose on find','~O(1)'],
  ['MST','"connect everything at minimum cost"','Kruskal + DSU; PRIM for dense/complete graphs — the interviewer will probe this','O(E log E)'],
  ['Tarjan bridges','"REMOVING THIS EDGE DISCONNECTS THE GRAPH", critical connections','disc[], low[], timer; bridge iff low[v] > disc[u]. Articulation: low[v] >= disc[u] + root case','O(V+E)'],
  ['SCC (Kosaraju / Tarjan)','"strongly connected", condensation','Two passes on G and G-transpose','O(V+E)'],
  ['Hierholzer (Euler)','"USE EVERY EDGE EXACTLY ONCE", itinerary','Append AFTER recursion, then reverse. Exists iff 0 or 2 odd-degree (undirected)','O(E)'],
  ['Implicit / state-space graph','input is STRINGS, BOARD STATES, NUMBERS — no edges given','Stop asking "what is the graph". Ask "what is a STATE, and what states are one move away?" Write neighbors(state) first; the BFS is boilerplate',''],
  ['Node splitting','the NODE has a capacity, not the edge','v -> v_in, v_out with a capacity edge between','']
 ],
 b:[
  [200,'Number of Islands','M','AMAZON SPEED-RUN: under 8 minutes, clean'],
  [695,'Max Area of Island / Closed Islands','M','LC 695, 1254 — same engine'],
  [733,'Flood Fill','E',''],
  [994,'Rotting Oranges','M','MULTI-SOURCE BFS. Amazon speed-run'],
  [542,'01 Matrix','M','Multi-source'],
  [1091,'Shortest Path in Binary Matrix','M','BFS with 8 directions'],
  [130,'Surrounded Regions','M','Reverse thinking from the border'],
  [417,'Pacific Atlantic Water Flow','M','BFS FROM both oceans inward'],
  [934,'Shortest Bridge','M','DFS to mark, BFS to expand'],
  [909,'Snakes and Ladders','M','Amazon — BFS on a transformed board'],
  [127,'Word Ladder','H','Amazon — implicit graph; then bidirectional'],
  [133,'Clone Graph','M','Map old->new'],
  [207,'Course Schedule I & II','M','LC 207, 210. Kahn AND DFS'],
  [802,'Find Eventual Safe States','M','Reverse graph + topo, or 3-colour'],
  [310,'Minimum Height Trees','M','Peel leaves'],
  [269,'Alien Dictionary','H','PREMIUM. Historically the most-asked Google graph problem. Edge case: ["abc","ab"] -> ""'],
  [547,'Number of Provinces','M','DSU'],
  [721,'Accounts Merge','M','Amazon — DSU with a key map'],
  [684,'Redundant Connection','M','DSU'],
  [990,'Satisfiability of Equality Equations','M','DSU in disguise'],
  [947,'Most Stones Removed','M','Google pack — DSU in disguise'],
  [743,'Network Delay Time','M','Vanilla Dijkstra'],
  [1514,'Path with Maximum Probability','M','Max-heap Dijkstra — proves you know the invariant, not the code'],
  [785,'Is Graph Bipartite / Possible Bipartition','M','LC 785, 886. Also DSU-with-parity'],
  [399,'Evaluate Division','M','Weighted DSU AND DFS-with-product — do both'],
  [1584,'Min Cost to Connect All Points','M','Kruskal AND Prim'],
  [1319,'Number of Operations to Make Network Connected','M','DSU with a counter'],
  [329,'Longest Increasing Path in a Matrix','H','It is a DAG => memo. Also the topo version'],
  [1466,'Reorder Routes','M','Directed edges on a tree']
 ],
 cx:'state augmentation · bitmask states · 0-1 BFS · Tarjan · Hierholzer · topo+DP · offline and reverse-time DSU · implicit graph modelling',
 c:[
  [787,'Cheapest Flights Within K Stops','M','SOLVE THREE WAYS: BFS-by-level, Bellman-Ford layer copy, Dijkstra on (cost,node,stops). Worth more than ten easy problems'],
  [1631,'Path With Minimum Effort','M','THREE WAYS: Dijkstra-with-max, binary search + BFS, Kruskal + DSU'],
  [778,'Swim in Rising Water','H','THE SAME PROBLEM as 1631. Say why in one sentence'],
  [1102,'Path With Maximum Minimum Value','M','PREMIUM. Inverted'],
  [1368,'Min Cost to Make at Least One Valid Path','H','0-1 BFS'],
  [2290,'Minimum Obstacle Removal','H','0-1 BFS'],
  [1293,'Shortest Path with Obstacle Elimination','H','State (r,c,k). Pruning: if k >= r+c remaining, answer is Manhattan'],
  [864,'Shortest Path to Get All Keys','H','State (r,c,keyMask). visited is STATE-al, not positional — the classic bug'],
  [847,'Shortest Path Visiting All Nodes','H','(node, mask)'],
  [815,'Bus Routes','H','NODES ARE ROUTES, not stops. Modelling choice is everything'],
  [752,'Open the Lock','M','State = a 4-digit string'],
  [773,'Sliding Puzzle','H','State = flattened board; precompute the neighbour table'],
  [1345,'Jump Game IV','H','Clear the value->indices bucket after first use or it is O(n^2)'],
  [126,'Word Ladder II','H','BFS to build the DAG, DFS to enumerate. Two-phase'],
  [1976,'Number of Ways to Arrive at Destination','M','Dijkstra + ways[]'],
  [1928,'Min Cost to Reach Destination in Time','H','(cost, node, time)'],
  [2045,'Second Minimum Time to Reach Destination','H','Best AND second-best, plus traffic-light modular arithmetic'],
  [1334,'City With Smallest Number of Neighbors','M','Floyd-Warshall and its n^3 ceiling'],
  [1192,'Critical Connections','H','TARJAN BRIDGES — the one Google actually asks. Memorisation is acceptable; nobody derives it live'],
  [1568,'Minimum Days to Disconnect Island','H','Answer is always 0, 1 or 2 — the 1-case is an articulation point'],
  [332,'Reconstruct Itinerary','H','HIERHOLZER. "Why append after the recursion" is the probe'],
  [2097,'Valid Arrangement of Pairs','H','Euler path, directed'],
  [753,'Cracking the Safe','H','de Bruijn sequence as an Euler circuit. Beautiful'],
  [1857,'Largest Color Value in a Directed Graph','H','TOPO + DP with a 26-wide count per node'],
  [2050,'Parallel Courses III','H','Topo + DP'],
  [1203,'Sort Items by Groups','H','TOPO ON TWO LEVELS. A genuine L4-hard'],
  [685,'Redundant Connection II','H','Directed: two-parents vs cycle vs both. Nasty case analysis'],
  [1697,'Edge Length Limited Paths','H','THE OFFLINE-SWEEP ARCHETYPE'],
  [1489,'Critical and Pseudo-Critical Edges in MST','H','Exclude => critical; force-include => pseudo-critical'],
  [803,'Bricks Falling When Hit','H','REVERSE-TIME DSU. Top-tier'],
  [1970,'Last Day Where You Can Still Cross','H','Reverse time, or binary search + BFS'],
  [952,'Largest Component by Common Factor','H','DSU + factorisation'],
  [839,'Similar String Groups','H','DSU with an O(n^2 L) compare'],
  [827,'Making A Large Island','H','Component labelling + size map'],
  [490,'The Maze I & II','H','LC 490, 505. PREMIUM. Uber — rolling-ball BFS / Dijkstra'],
  [818,'Race Car','H','Uber — BFS/DP over an unusual state space'],
  [489,'Robot Room Cleaner','H','PREMIUM. Google classic — backtracking with no coordinates given']
 ]},

{ id:'bt', n:14, name:'Backtracking', sub:'', phase:2,
 p:[
  ['The template','"all combinations / permutations / subsets"','choose -> recurse -> UN-choose. Write the un-choose immediately after the choose, always','O(b^d)'],
  ['Subsets vs combinations vs permutations','','Subsets: include/exclude. Combinations: a start index. Permutations: a used[] array',''],
  ['Dedup with sorted input','input has duplicates, output must not','Sort, then if i > start and a[i] == a[i-1]: continue',''],
  ['Prune on infeasibility','"sum exceeds target", "already worse than best"','Return early. PRUNING is what makes these pass, and it IS the interview',''],
  ['Grid backtracking','word search, N-Queens, sudoku','Mark visited in place, restore after',''],
  ['Backtracking + trie','grid + a word list','Never search per word — walk the trie',''],
  ['Partition into k groups','"k equal-sum subsets", "matchsticks to square"','Sort descending, place each item, skip equal-sized empty buckets',''],
  ['Expression building','"insert operators to reach a target"','Carry (value, lastOperand) for * precedence','']
 ],
 b:[
  [78,'Subsets I & II','M','LC 78, 90 — dedup on sorted'],
  [46,'Permutations I & II','M','LC 46, 47 — used[], then dedup'],
  [39,'Combination Sum I & II','M','LC 39, 40 — reuse vs single-use'],
  [77,'Combinations','M','Start index'],
  [17,'Letter Combinations of a Phone Number','M',''],
  [22,'Generate Parentheses','M','Validity counters as pruning'],
  [79,'Word Search','M','Amazon — grid backtracking'],
  [131,'Palindrome Partitioning','M','Backtracking + palindrome check'],
  [93,'Restore IP Addresses','M','Bounded splitting'],
  [216,'Combination Sum III','M',''],
  [698,'Partition to K Equal Sum Subsets','M','Sorting + pruning is everything']
 ],
 cx:'constraint propagation · bitmask-encoded constraints · backtracking without coordinates · interactive/minimax search',
 c:[
  [51,'N-Queens I & II','H','LC 51, 52. Diagonal encoding; bitmask as the follow-up'],
  [37,'Sudoku Solver','H','Constraint propagation + ordering heuristics'],
  [212,'Word Search II','H','Trie + backtracking + pruning'],
  [282,'Expression Add Operators','H','The lastOperand trick for *'],
  [301,'Remove Invalid Parentheses','H','BFS-by-level, or DFS with a computed removal count'],
  [489,'Robot Room Cleaner','H','PREMIUM. Google classic'],
  [291,'Word Pattern II','H','PREMIUM. Backtracking with two maps'],
  [425,'Word Squares','H','PREMIUM. Trie-guided'],
  [465,'Optimal Account Balancing','H','PREMIUM. Google & Uber — Splitwise as an algorithm'],
  [843,'Guess the Word','H','Google pack. Interactive + minimax. Unlike anything else on LeetCode'],
  [679,'24 Game','H','Exhaustive with floating-point care']
 ]},

{ id:'dp', n:15, name:'Dynamic Programming', sub:'the largest block', phase:2,
 p:[
  ['STATE FIRST','every DP problem','If you cannot state dp[i][j] in one English sentence, you do not have a solution — you have a vague feeling. Say it OUT LOUD before coding, every time',''],
  ['Linear / decision at each index','"at each step, take it or don\'t"','dp[i] = best using the first i','198, 91'],
  ['Fibonacci-shaped','"how many ways to reach step n"','dp[i] = dp[i-1] + dp[i-2]','70'],
  ['Kadane','max/min subarray','running best ending here','53, 152'],
  ['LIS family','"longest increasing / chain"','dp[i] = best ending at i; or tails[] + bisect for O(n log n). tails is NOT the subsequence','300, 354'],
  ['0/1 knapsack','pick items, capacity limit, EACH USED ONCE','dp[i][w]; the 1-D capacity loop runs BACKWARDS','416, 494'],
  ['Unbounded knapsack','items reusable','1-D loop runs FORWARDS','322, 518'],
  ['Combinations vs permutations','same items, different counting','PURELY LOOP ORDER. Items outer => combinations. Capacity outer => permutations','518 vs 377'],
  ['Two-sequence grid','"two strings, align them"','dp[i][j]: match / skip-left / skip-right. Parent of a whole family','1143, 72'],
  ['Palindrome / substring DP','"longest palindromic subsequence", "min cuts"','dp[i][j] over the substring [i..j]','516, 132'],
  ['Interval DP','"CHOOSE A SPLIT POINT in a range", "which is processed LAST"','dp[i][j] = best over k in (i,j). ITERATE BY INCREASING LENGTH','312, 1039'],
  ['Grid DP','paths, min falling path, obstacles','dp[r][c] from neighbours','62, 64'],
  ['State machine','buy/sell/hold with cooldown or a transaction cap','dp[i][state] — enumerate the states first','309, 188'],
  ['Bitmask DP','N <= 20 and you must track a SUBSET','dp[mask]; submask enumeration for (s = m; s; s = (s-1)&m)','1349, 698'],
  ['Digit DP','"count numbers <= N with property P"','dp[pos][tight][state]','902'],
  ['DP + a data structure','the transition needs a range query or best-so-far','DP + heap / BIT / binary search','1235, 315'],
  ['Memo -> tabulation','any of the above','Write the memo FIRST. Then convert mechanically. Every time, until automatic','']
 ],
 b:[
  [70,'Climbing Stairs / Min Cost','E','LC 70, 746 — the base shape'],
  [198,'House Robber I & II','M','LC 198, 213. Circular = two runs'],
  [53,'Max Subarray / Max Product','M','LC 53, 152 — Kadane'],
  [300,'Longest Increasing Subsequence','M','Both O(n^2) and O(n log n)'],
  [322,'Coin Change I & II','M','LC 322, 518. Min vs count; loop order'],
  [377,'Combination Sum IV','M','LOOP ORDER FLIPS THE MEANING'],
  [416,'Partition Equal Subset Sum','M','0/1 knapsack'],
  [494,'Target Sum','M','Knapsack after a transform'],
  [1143,'Longest Common Subsequence','M','The grid parent'],
  [72,'Edit Distance','H','Asked everywhere. Three operations, three transitions'],
  [5,'Palindromic substring / count / subsequence','M','LC 5, 647, 516 — expand vs DP'],
  [62,'Unique Paths I, II / Min Path Sum','M','LC 62, 63, 64'],
  [91,'Decode Ways','M','Edge cases around 0 are the whole problem'],
  [139,'Word Break I & II','M','LC 139, 140. DP, then DP + backtracking'],
  [279,'Perfect Squares','M','Unbounded knapsack'],
  [121,'Stock I, II, with Cooldown','M','LC 121, 122, 309 — state machine'],
  [221,'Maximal Square','M','Grid DP with a min-of-three'],
  [1024,'Video Stitching','M','Interval greedy vs DP'],
  [337,'House Robber III','M','Tree DP'],
  [837,'New 21 Game','M','Google pack — probability DP with a sliding-window sum']
 ],
 cx:'interval DP and the "which is LAST" flip · bitmask DP + submask enumeration · digit DP · DP that runs BACKWARDS · DP composed with a BIT, heap or binary search',
 c:[
  [312,'Burst Balloons','H','INTERVAL DP, and the "which is LAST" mental flip. The one to truly understand'],
  [1039,'Minimum Score Triangulation','M','Same skeleton'],
  [1130,'Minimum Cost Tree From Leaf Values','M','Interval DP OR monotonic stack — see both'],
  [546,'Remove Boxes','H','Interval DP with a third dimension. Brutal and instructive'],
  [132,'Palindrome Partitioning II','H','Precompute isPal, then linear DP'],
  [10,'Regular Expression Matching','H','The two-sequence grid at its nastiest'],
  [44,'Wildcard Matching','H','Same family; a greedy alternative exists'],
  [97,'Interleaving String','H','Two-sequence grid, restated'],
  [115,'Distinct Subsequences','H','Counting variant'],
  [188,'Best Time to Buy and Sell Stock IV / III','H','LC 188, 123. State machine with a transaction cap'],
  [1349,'Maximum Students Taking Exam','H','BITMASK DP over rows + submask enumeration'],
  [698,'Partition to K Equal Sum Subsets','M','Bitmask DP alternative'],
  [174,'Dungeon Game','H','DP THAT MUST RUN BACKWARDS. The direction IS the insight'],
  [1235,'Maximum Profit in Job Scheduling','H','Google pack. DP + binary search'],
  [315,'Count of Smaller Numbers After Self','H','DP + BIT'],
  [552,'Student Attendance Record II','H','Google pack — state machine with a modulus'],
  [887,'Super Egg Drop','H','The inverted-DP reformulation. Famous'],
  [32,'Longest Valid Parentheses','H','DP OR stack — do both'],
  [1000,'Minimum Cost to Merge Stones','H','Interval DP with a k-step constraint'],
  [96,'Unique BSTs I & II','M','LC 96, 95. Catalan; II builds them'],
  [902,'Numbers At Most N Given Digit Set','H','DIGIT DP']
 ]},

{ id:'bit', n:16, name:'Bit Manipulation & Math', sub:'small on purpose', phase:2,
 p:[
  ['XOR cancels pairs','"everything appears twice except one"','XOR the whole array',''],
  ['XOR partitioning','"two numbers appear once"','XOR all, isolate the lowest set bit, split into two groups',''],
  ['Counting bits per position','"everything appears three times except one"','Sum bit counts mod 3',''],
  ['n & (n-1)','"count set bits", "is it a power of two"','Clears the lowest set bit',''],
  ['n & -n','"lowest set bit"','Also the core of a Fenwick tree',''],
  ['Bitmask as a set','N <= 20, subsets','mask is the set; 1<<i is membership',''],
  ['Submask enumeration','"partition a set", assignment problems','for (s = m; s; s = (s-1) & m)',''],
  ['GCD / LCM','"reduce a fraction", cycles, "meet again"','Euclid; lcm = a/g*b',''],
  ['Sieve','"primes up to n", factor counts','Eratosthenes',''],
  ['Fast power / modular arithmetic','"answer mod 1e9+7", huge exponents','Binary exponentiation',''],
  ['Reservoir sampling','"pick uniformly from a stream of unknown length"','Keep item i with probability 1/i',''],
  ['Fisher–Yates','"shuffle"','Swap with a random earlier index — know WHY the naive shuffle is biased',''],
  ['Median not mean','"minimise total distance to a point"','The 1-D optimum is the MEDIAN. Prove it','']
 ],
 b:[
  [136,'Single Number I, II, III','E','LC 136, 137, 260 — the three XOR tricks'],
  [191,'Number of 1 Bits / Counting Bits','E','LC 191, 338. n&(n-1), then DP'],
  [231,'Power of Two / Four / Three','E','LC 231, 342, 326'],
  [268,'Missing Number','E','XOR or sum'],
  [190,'Reverse Bits','E',''],
  [371,'Sum of Two Integers','M','Add without +'],
  [7,'Reverse Integer / Palindrome Number','E','LC 7, 9 — overflow discipline'],
  [50,'Pow(x, n)','M','Fast power; negative exponent'],
  [172,'Factorial Trailing Zeroes','M','Count 5s'],
  [204,'Count Primes','M','Sieve'],
  [202,'Happy Number','E','Cycle detection'],
  [384,'Shuffle an Array','M','Microsoft — Fisher-Yates'],
  [528,'Random Pick with Weight','M','Uber'],
  [398,'Random Pick Index','M','Reservoir sampling']
 ],
 cx:'binary trie for XOR · rejection sampling with expected-value analysis · working backwards with modulo · proofs that a one-line answer is correct',
 c:[
  [421,'Maximum XOR of Two Numbers','M','Binary trie'],
  [1707,'Maximum XOR With an Element','H','+ offline queries'],
  [296,'Best Meeting Point','H','PREMIUM. Google pack — median, not mean. PROVE WHY'],
  [899,'Orderly Queue','H','k=1 is rotations, k>=2 is a full sort. A one-line answer with a real proof'],
  [470,'Implement Rand10() Using Rand7()','M','Rejection sampling; expected-value analysis'],
  [780,'Reaching Points','H','Work backwards with modulo'],
  [372,'Super Pow','M','Modular exponentiation']
 ]},

{ id:'design', n:17, name:'Design & Composition', sub:'', phase:2,
 p:[
  ['Hashmap + doubly linked list','"O(1) GET, PUT, AND EVICTION"','LRU. Sentinel head and tail remove every edge case',''],
  ['Hashmap + frequency buckets','LFU, "max frequency stack"','Two maps: key->node, freq->list',''],
  ['Array + index map','"O(1) INSERT, DELETE, AND GETRANDOM"','Swap-with-last on delete',''],
  ['Two stacks / two heaps','min-stack, median, queue-from-stacks','Parallel structure carrying the auxiliary invariant',''],
  ['Sorted structure + binary search','"value at time t", "closest to x"','Map key -> sorted list of (time, value)',''],
  ['Bucket by time','hit counter, rate limiter, logger','Circular array of second-buckets. THE SCALING FOLLOW-UP IS THE INTERVIEW',''],
  ['Lazy deletion','any structure needing "remove arbitrary"','Tombstones + a counter',''],
  ['Fenwick / BIT','"range sum WITH UPDATES"','i & -i; point update, prefix query. 15 lines — learn it cold',''],
  ['Segment tree','range query + range update','Iterative point-update version is enough at L4. Lazy propagation: know it exists',''],
  ['Coordinate compression','huge / sparse coordinate space','Map values to ranks first','']
 ],
 b:[
  [146,'LRU Cache','M','BE FASTEST AT THIS. Under 15 minutes, cold. Microsoft/Amazon/Uber'],
  [155,'Min Stack','M',''],
  [380,'Insert Delete GetRandom O(1)','M','Amazon/Uber'],
  [232,'Queue from Stacks / Stack from Queues','E','LC 232, 225'],
  [705,'Design HashSet / HashMap','E','LC 705, 706 — chaining'],
  [622,'Design Circular Queue / Deque','M','LC 622, 641. Uber/Microsoft'],
  [348,'Design Tic-Tac-Toe','M','PREMIUM. Amazon/Microsoft — OOD-flavoured'],
  [359,'Logger Rate Limiter','E','PREMIUM. Google/Uber'],
  [362,'Design Hit Counter','M','PREMIUM. Uber — the scaling follow-up IS the interview'],
  [981,'Time Based Key-Value Store','M','Uber'],
  [173,'BST Iterator','M',''],
  [295,'Find Median from Data Stream','H','Two heaps']
 ],
 cx:'BIT and segment tree · interval TreeMap · versioned/snapshot structures · buffer state that survives between calls',
 c:[
  [460,'LFU Cache','H','Two-level bucketing'],
  [588,'Design In-Memory File System','H','PREMIUM. Google/Amazon — tree + design'],
  [642,'Design Search Autocomplete System','H','PREMIUM. Google pack'],
  [855,'Exam Room','H','Uber. Design + ordered set. Very on-brand'],
  [895,'Maximum Frequency Stack','H','Uber'],
  [900,'RLE Iterator','M','Google pack — lazy consumption'],
  [158,'Read N Characters Given read4 II','H','PREMIUM. Google pack. The buffer state BETWEEN CALLS is the whole problem'],
  [307,'Range Sum Query — Mutable','M','BIT and segment tree — WRITE BOTH'],
  [715,'Range Module','H','Google pack'],
  [729,'My Calendar I / II / III','H','LC 729, 731, 732. Google favourite'],
  [1146,'Snapshot Array','M','Versioned values + binary search'],
  [432,'All O(1) Data Structure','H','Doubly linked list of frequency buckets'],
  [218,'The Skyline Problem','H','']
 ]}

]);

/* ============================================================ SYSTEM DESIGN ===
   Tier note: the gradient does NOT run to Google. Google L4 has little or no
   system design. Heavy SD rounds are JPM, Amex, Expedia, Amazon and Uber. */

PLAN.sdFramework = [
  ['1 · Requirements','3–5 min','Functional (3–5 bullets) and non-functional (scale, latency, consistency, availability). ASK ABOUT SCALE EVERY TIME — it drives every later decision and asking it is scored signal.'],
  ['2 · Estimation','3–5 min','DAU to QPS to storage to bandwidth. Out loud, rounded, no calculator.'],
  ['3 · API','3–5 min','3–6 endpoints with signatures. This forces the data model.'],
  ['4 · Data model','5 min','Entities, keys, and THE SHARD KEY — plus why it does not create a hot partition.'],
  ['5 · High-level design','10 min','Boxes and arrows. Client to LB to service to cache to DB to queue to worker.'],
  ['6 · Deep dive + bottlenecks','15 min','PICK THE INTERESTING PART YOURSELF. Then defend it against the six cross-question categories.']
];

PLAN.sdNumbers = 'L1 ~1ns · RAM ~100ns · SSD random read ~100us · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent RTT ~150ms · 1M req/day ≈ 12 QPS · 86,400 s/day';

PLAN.sdTriggers = [
  ['Read-heavy, same data repeatedly','Cache — decide placement, eviction, invalidation','"The cache expires and 10k requests hit at once" => stampede: coalescing, early/jittered expiry, or a lock'],
  ['Nodes join and leave the cluster','Consistent hashing + virtual nodes','"Why virtual nodes?" => even distribution when a node dies'],
  ['Data outgrows one machine','Sharding','"Defend your shard key" => hot partitions, resharding, cross-shard queries'],
  ['Write-heavy, append-mostly','LSM-tree store, not a B-tree','"What does compaction cost you?"'],
  ['Read-heavy, complex queries, joins','Relational + read replicas','"Replication lag — what does the user see?"'],
  ['Slow work must not block the request','Queue + async worker + DLQ','"The queue backs up" => backpressure, autoscaling, shedding'],
  ['"What if the client retries?"','Idempotency key','Exactly-once = at-least-once + idempotency. Where is the key stored? What TTL? Two concurrent retries?'],
  ['Write to DB AND publish an event','Outbox pattern','"Why not just do both?" => the dual-write problem'],
  ['Limit requests per user','Token bucket, distributed via Redis','"What if Redis goes down?" => local fallback, fail-open vs fail-closed'],
  ['Feed with a few very popular producers','Hybrid fan-out','Pure fan-out-on-write breaks on celebrities — say this unprompted'],
  ['Persistent bidirectional connection','WebSockets + a connection registry','"How does node A reach a user connected to node B?"'],
  ['"Find things near me"','Geohash / quadtree / S2 / H3','"Why not a bounding-box scan?"'],
  ['Multi-service transaction involving money','Saga + compensating transactions','"Why not 2PC?" => availability, lock duration, coordinator failure'],
  ['Two customers buy the last item','Reservation with TTL, or optimistic decrement','"What if payment fails after the hold?"'],
  ['Money must be auditable','Double-entry ledger, append-only','JPM/Amex core. "How do you correct a mistake?" => a reversing entry, never an update'],
  ['"Users in Europe and the US"','Multi-region','"Active-active or active-passive? What is your RPO and RTO?"'],
  ['Search box that completes as you type','Trie / inverted index + ranking','"How do you update the index?"'],
  ['Uploads, images, video','Object store + CDN + presigned URLs','"Why not through your service?"'],
  ['Something must run exactly once daily','Scheduler + distributed lock/lease','"Two schedulers fire at once"'],
  ['"How do you know it is broken?"','Metrics, logs, traces + alerting on SLO','"What do you alert on?" => symptoms, not causes'],
  ['Deploy without downtime','Rolling / blue-green / canary','"How do you roll back a schema change?" => expand-migrate-contract']
];

PLAN.sdCross = [
  ['Failure','"What happens when X dies?"','Cache dies · leader dies mid-write · queue backs up · a region goes dark'],
  ['Scale','"10x traffic — what breaks first?"','Hot partition · fan-out · connection pool · a single-threaded consumer'],
  ['Consistency','"Two users, same instant"','Double-booking · double-charge · lost update · read-your-writes after a write'],
  ['Cost','"Where is the money going?"','Cross-AZ egress · retaining every event forever · over-provisioned pods · a chatty N+1'],
  ['Change','"Now add this"','Multi-region · GDPR delete · an audit trail · a new consumer of the same events'],
  ['Justify','"Why not the other one?"','Kafka not SQS · Postgres not Cassandra · cache not replica · a cron job not a queue']
];

/* tier: 'b' = tier 1-2 (the heavy block here) · 'c' = Uber / Apple / Amazon-senior */
PLAN.sd = [
 {n:1, wk:1, tier:'b', t:'Fundamentals & estimation', terms:'latency table, QPS, CAP, PACELC, consistency models, availability nines, SLA/SLO/SLI', design:'Estimation drills only', anchor:''},
 {n:2, wk:2, tier:'b', t:'Caching', terms:'write-through / write-back / write-around, TTL, LRU/LFU, stampede, coalescing, consistent hashing, CDN edge', design:'A caching layer for a read-heavy API', anchor:'Facebook memcache leases'},
 {n:3, wk:3, tier:'b', t:'Databases', terms:'B-tree vs LSM, index selectivity, covering index, isolation levels, MVCC, normalisation', design:'Pick and defend a store for three products', anchor:'Postgres internals — YOUR STACK'},
 {n:4, wk:4, tier:'b', t:'Sharding & replication', terms:'range/hash/directory sharding, hot partition, leader-follower, multi-leader, quorum R+W>N, read-your-writes', design:'Shard a 10 TB table', anchor:'Discord: Cassandra to ScyllaDB'},
 {n:5, wk:5, tier:'b', t:'Queues & async', terms:'at-most/at-least/exactly-once, idempotency, DLQ, backpressure, outbox, ordering', design:'An async job pipeline', anchor:'Kafka vs SQS vs RabbitMQ'},
 {n:6, wk:6, tier:'b', t:'Kubernetes as a design primitive', terms:'pod, service, ingress, probes, HPA, requests vs limits, rolling update, sidecar', design:'Deploy and scale a 2-tier app; survive a node failure', anchor:'YOUR PRODUCTION CLUSTER'},
 {n:7, wk:7, tier:'b', t:'URL shortener + Pastebin', terms:'base62, collision, custom alias, expiry, 301 vs 302', design:'TinyURL', anchor:''},
 {n:8, wk:8, tier:'b', t:'Rate limiter', terms:'fixed window, sliding log, sliding counter, token bucket, leaky bucket', design:'A distributed rate limiter', anchor:'Stripe'},
 {n:9, wk:9, tier:'b', t:'News feed', terms:'fan-out on write vs read, hybrid, ranking, cursor pagination', design:'A timeline', anchor:'Twitter celebrity problem'},
 {n:10, wk:10, tier:'b', t:'Chat', terms:'WebSocket, presence, delivery receipts, message ordering, offline queue', design:'WhatsApp-lite', anchor:'Discord message store'},
 {n:11, wk:11, tier:'b', t:'Payments & ledger', terms:'double-entry, idempotency key, reconciliation, settlement, PCI scope, eventual consistency of money', design:'A payment service', anchor:'JPM / AMEX CORE TOPIC'},
 {n:12, wk:12, tier:'b', t:'Orders & inventory', terms:'reservation with TTL, optimistic locking, saga, oversell', design:'Amazon checkout', anchor:'Amazon inventory holds'},
 {n:13, wk:13, tier:'b', t:'Search & notifications', terms:'inverted index, typeahead, fan-out, user preferences, dedup', design:'Typeahead + a notification service', anchor:''},
 {n:14, wk:14, tier:'c', t:'Uber ride matching, geo indexing', terms:'geohash, quadtree, S2, H3, supply/demand, driver location writes', design:'Ride matching', anchor:'Uber H3'},
 {n:15, wk:15, tier:'c', t:'Metrics & observability at scale', terms:'time-series storage, cardinality explosion, downsampling, pull vs push', design:'A metrics platform', anchor:'Prometheus'},
 {n:16, wk:16, tier:'c', t:'File storage, CDN, video', terms:'chunking, adaptive bitrate, presigned URLs, edge caching', design:'Video streaming', anchor:'Netflix Open Connect'},
 {n:17, wk:17, tier:'c', t:'Distributed transactions', terms:'saga vs 2PC, compensations, isolation without locks, outbox', design:'A multi-service booking with money', anchor:''},
 {n:18, wk:18, tier:'c', t:'Multi-region & disaster recovery', terms:'active-active vs active-passive, conflict resolution, RPO/RTO, data residency', design:'Make an existing design multi-region', anchor:'JPM/AMEX CARE DEEPLY'},
 {n:19, wk:19, tier:'c', t:'Recorded mock x2', terms:'', design:'Unseen prompt, 45 min, narrated, watch it back', anchor:''},
 {n:20, wk:20, tier:'c', t:'Recorded mock x2', terms:'', design:'Unseen prompt, 45 min', anchor:''},
 {n:21, wk:21, tier:'c', t:'Recorded mock x2', terms:'', design:'Unseen prompt, 45 min', anchor:''},
 {n:22, wk:22, tier:'c', t:'Final mock + rebuild the vocabulary', terms:'reproduce every trigger row from memory', design:'If you cannot reproduce the trigger table, you have not learned it', anchor:''}
];

/* ================================================================== LLD === */

PLAN.lldFlavours = [
  ['Whiteboard OOD','Amazon · Adobe · Microsoft · JPM','45–60 min, class diagram + key methods','Entities, relationships, extensibility. SOLID APPLIED, not recited'],
  ['Machine coding','Uber · Flipkart','60–90 min, RUNNABLE, TESTED code','FINISHING. An unfinished elegant design scores below a finished plain one'],
  ['Amazon hybrid','Amazon','60 min: design PLUS working code PLUS an algorithmic core','Doing all three under one clock. Most candidates over-invest in the design and never run the code']
];

PLAN.lldPatterns = [
  ['"support multiple algorithms for X, swappable"','Strategy','Parking pricing, elevator scheduling, ride matching, payment methods'],
  ['"create objects without naming the concrete class"','Factory / Abstract Factory','Vehicle types, chess pieces, notification channels'],
  ['"notify N things when this changes"','Observer','Bidding, notifications, order status, stock ticker'],
  ['"behaves differently depending on its mode"','State — NOT a switch over an enum','Vending machine, ATM, elevator, order lifecycle'],
  ['"undo / redo / a queue of operations"','Command','Chess moves, text editor, job scheduler'],
  ['"add behaviour without a subclass explosion"','Decorator','Pizza toppings, coffee, middleware'],
  ['"lots of optional constructor parameters"','Builder','Complex config, request objects'],
  ['"exactly one of these, globally"','Singleton — and say when it is a mistake','Config, connection pool. Usually DI is better'],
  ['"two users grab the same resource"','Optimistic vs pessimistic locking — say WHICH and WHY','Booking, parking spot, inventory'],
  ['"make it extensible"','Depend on an interface, not a concrete class','Every LLD round, always'],
  ['"the object is expensive to create"','Object pool / flyweight','Connections, threads, game sprites'],
  ['"one interface over several subsystems"','Facade','Service layer over repositories']
];

PLAN.lldSolid = [
  ['S','Single responsibility','A class that both computes AND persists'],
  ['O','Open/closed','A switch you must edit for each new type'],
  ['L','Liskov substitution','A subclass that throws on an inherited method'],
  ['I','Interface segregation','A fat interface forcing empty implementations'],
  ['D','Dependency inversion','new ConcreteThing() inside business logic']
];

PLAN.lldFramework = 'clarify requirements → identify entities → relationships and cardinality → define interfaces → implement the core → SHOW ONE EXTENSION ("here is how a new vehicle type slots in"). That last step is the highest-scoring thirty seconds of the round.';

PLAN.lldRules = [
  'Ship a working skeleton in the first 20 minutes, then enrich. Never design for 60 and code for 30.',
  'In-memory only unless asked. No database, no framework, no build tooling.',
  'Write main() with a demo run early — it proves it works and prevents you being unfinished.',
  'Two or three tests beat ten. Add them as you go, not at the end.',
  'One interface per axis of change. Do not create fifteen.',
  'Say your assumptions out loud and write them as comments.'
];

PLAN.lld = {
 b:[
  ['Parking lot','OOD','The "two sum" of LLD. Pricing strategy, spot allocation, CONCURRENCY on allocation'],
  ['Elevator system','OOD','Scheduling strategy + State. Multiple cars is the follow-up'],
  ['Vending machine','OOD','STATE PATTERN. If you wrote a switch over an enum, you failed the point'],
  ['ATM','OOD','State + transaction integrity + note dispensing (a small greedy/DP)'],
  ['Library / inventory management','OOD','Deliberately boring. JPM-flavoured. Get the entities clean'],
  ['Booking system (BookMyShow)','OOD','THE RACE CONDITION IS THE INTERVIEW. Seat hold with TTL, optimistic vs pessimistic, payment failing after the hold'],
  ['Splitwise','OOD','Balance simplification — LC 465 is the algorithmic core'],
  ['Tic-tac-toe / chess','OOD','Command for undo; efficient win-check (LC 348)'],
  ['Notification system','OOD','Strategy per channel, Observer for subscribers, retry with backoff'],
  ['Rate limiter / logger / cache as objects','OOD','Bridges into system design; LRU is the classic'],
  ['Ordering system','OOD','Amazon. Order state machine, inventory reservation'],
  ['SOLID: write a 10-line violation and its fix for each of the five','concept','Not definitions — refactors'],
  ['Implement Strategy, Factory, Observer, State — small but runnable','concept','']
 ],
 c:[
  ['Ride-hailing (driver matching)','Machine 90m','UBER ACTUAL ROUND. Matching strategy, state machine, geo lookup — and you must FINISH'],
  ['Food delivery / cart & checkout','Machine','Flipkart flavour. Many entities, tight clock'],
  ['Snake / game simulation','Machine','Tick loop, collision, growth. Tests plain execution speed'],
  ['In-memory key-value store with TTL','Machine','Expiry strategy: lazy vs active sweep'],
  ['In-memory file system','Hybrid','LC 588. Tree + design + path parsing'],
  ['Design Tic-Tac-Toe (efficient)','Hybrid','LC 348. Design PLUS the O(1) win-check'],
  ['LRU / LFU cache','Hybrid','LC 146 / 460. Design PLUS the data-structure insight'],
  ['Max frequency stack','Hybrid','LC 895. Uber'],
  ['Exam room','Hybrid','LC 855. Uber. Design + ordered set'],
  ['Snapshot array / versioned store','Hybrid','LC 1146 / 981'],
  ['Splitwise balance settlement','Hybrid','LC 465 — design PLUS bitmask DP'],
  ['Text editor with undo/redo','Machine','Command + a rope or gap buffer if pushed'],
  ['Machine-coding drill: finish under the clock x3','Machine','Learning to SHIP in 90 minutes'],
  ['Amazon LP: 15 STAR stories, real numbers, under 2 min each, "I" not "we"','concept','LP is roughly half of Amazon signal. Prepare "biggest failure" and "disagreed with a manager" specifically']
 ]
};

/* ================================================================= TECH ===
   The gradient INVERTS here: the deepest tech questioning is at the BOTTOM of
   the ladder. JPM and Amex go far deeper than Google, which asks none of it.
   qa row = [question, answerSpine, followUp] */

PLAN.tech = [

{id:'java', n:1, name:'Java core & JVM', phase:1, hrs:12,
 qa:[
  ['Why is String immutable?','Security, hashcode caching, string-pool sharing, thread safety','Then how does StringBuilder differ, and when does the compiler use it for you?'],
  ['The equals/hashCode contract','Equal objects must have equal hashcodes; unequal may collide','You put a mutable object in a HashMap then mutate the key field. What happens?'],
  ['HashMap internals','Array of buckets, linked list, treeify at 8 nodes (Java 8+), resize doubles and rehashes','Why treeify? What attack does it defend against?'],
  ['ArrayList vs LinkedList','Contiguous + O(1) random access vs pointer-chasing; LinkedList is almost always worse in practice','Why does LinkedList lose even for insertion in the middle?'],
  ['Heap vs stack','Objects on the heap; frames and primitives-in-frames on the stack','Where does a String literal live? Where does an int[] live?'],
  ['Garbage collection','Generational hypothesis, young/old, minor vs major, G1 regions','What is a stop-the-world pause and how do you reduce it?'],
  ['Memory leak in a GC language','Unbounded caches, listeners never removed, ThreadLocal in a pool, static collections','How would you find one in production? => heap dump + dominator tree'],
  ['final, finally, finalize','Immutability / cleanup block / deprecated hook','Does finally always run? => System.exit, JVM crash'],
  ['Checked vs unchecked exceptions','Recoverable vs programming error','Why do many modern codebases avoid checked exceptions?'],
  ['Generics erasure','Types erased at runtime; bridge methods; no new T[]','Why can you not have List<int>?'],
  ['Optional','A return type for maybe-absent, not a field type','Why not use it as a method parameter?'],
  ['Streams','Lazy, single-use pipeline; the terminal op triggers it','When is a parallel stream actually slower?'],
  ['== vs equals for boxed types','Integer cache -128..127','Why does 128 == 128 fail for Integer?']
 ]},

{id:'conc', n:2, name:'Concurrency', phase:1, hrs:14,
 qa:[
  ['volatile vs synchronized','volatile = visibility + ordering, no atomicity. synchronized = mutual exclusion + visibility','Is count++ safe on a volatile int? => no, it is read-modify-write'],
  ['Happens-before','The JMM ordering guarantee: unlock->lock, volatile write->read, thread start, thread join','Why is double-checked locking broken without volatile?'],
  ['Thread pool sizing','CPU-bound ~ cores + 1. IO-bound ~ cores x (1 + wait/service)','What happens when the queue is unbounded and producers outpace consumers? => OOM'],
  ['ExecutorService shutdown','shutdown vs shutdownNow vs awaitTermination','Your app will not exit. Why? => non-daemon pool threads'],
  ['ConcurrentHashMap','Bucket-level (CAS + synchronized on the bin head), not whole-map locking','Is map.get(k) == null ? map.put(...) safe? => no, use computeIfAbsent'],
  ['CompletableFuture','Composable async; thenApply vs thenCompose vs thenCombine','Which executor runs your callback if you do not pass one?'],
  ['Deadlock','Four Coffman conditions; fix by lock ordering or timeout','Reproduce one, then fix it without a global lock'],
  ['Optimistic vs pessimistic locking','CAS / version column vs SELECT FOR UPDATE','Which for a high-contention seat booking, and why?'],
  ['ThreadLocal','Per-thread storage; MUST be removed in a pooled thread','What leaks if you do not?'],
  ['Atomics','CAS loop, AtomicInteger, LongAdder under contention','When does LongAdder beat AtomicLong?'],
  ['Producer-consumer','BlockingQueue; bounded for backpressure','Bounded or unbounded, and what breaks with each?'],
  ['synchronized method vs block','Locks this vs a chosen monitor','Two synchronized methods on the same object — can they run concurrently?'],
  ['Virtual threads (Java 21)','Cheap, blocking-friendly; pinning on synchronized','When do they NOT help? => CPU-bound work']
 ]},

{id:'spring', n:3, name:'Spring core', phase:1, hrs:10,
 qa:[
  ['IoC / DI','The container owns construction and wiring','Constructor or field injection? => CONSTRUCTOR: immutability, testability, fail-fast on cycles'],
  ['Bean scopes','singleton (default), prototype, request, session','A singleton holding mutable state — what happens?'],
  ['Bean lifecycle','instantiate -> populate -> aware -> BeanPostProcessor before -> @PostConstruct -> after -> ready -> @PreDestroy','Where would you hook to modify every bean of a type?'],
  ['@Component vs @Bean','Class-level scan vs method-level factory in @Configuration','How do you register a bean from a third-party library?'],
  ['AOP and proxies','JDK dynamic proxy (interface) or CGLIB (subclass); advice around a join point','Why does the aspect not fire on a private or self-invoked method?'],
  ['@Transactional SELF-INVOCATION','Calling this.method() bypasses the proxy, so no transaction','THE most-asked Spring question. How do you fix it? => self-inject, split the class, or TransactionTemplate'],
  ['Propagation','REQUIRED (join), REQUIRES_NEW (suspend + new), NESTED (savepoint), MANDATORY, SUPPORTS, NEVER','Outer rolls back — does the REQUIRES_NEW inner also roll back? => no'],
  ['Isolation','READ_COMMITTED default in Postgres; REPEATABLE_READ; SERIALIZABLE','Give a concrete anomaly each level allows'],
  ['Rollback rules','Rolls back on unchecked by default; checked needs rollbackFor','You caught the exception inside the method — does it still roll back?'],
  ['Circular dependencies','Constructor cycles fail; setter/@Lazy can resolve','Why is failing the RIGHT behaviour?'],
  ['@Qualifier / @Primary','Disambiguating multiple candidates',''],
  ['Spring MVC request flow','DispatcherServlet -> HandlerMapping -> Controller -> view resolver / message converter','Where does @ControllerAdvice fit?']
 ]},

{id:'boot', n:4, name:'Spring Boot', phase:1, hrs:8,
 qa:[
  ['Auto-configuration','@EnableAutoConfiguration -> AutoConfiguration.imports -> @ConditionalOnClass/Bean/Property','How do you STOP one from applying? => exclude, or define your own bean'],
  ['Starters','Curated dependency sets, no code','What is in spring-boot-starter-web?'],
  ['Config precedence','CLI args > env > application-{profile}.yml > application.yml > defaults','How do you inject a secret without putting it in the image?'],
  ['Profiles','@Profile, spring.profiles.active','How do your K8s manifests set it?'],
  ['Actuator','/health, /metrics, /info, /env, /threaddump','WHICH MUST NEVER BE PUBLIC, and how do you secure them?'],
  ['Health checks','Liveness vs readiness groups','Map these to K8s probes'],
  ['Embedded server','Tomcat by default; thread-per-request','How many concurrent requests can it take, and what do you tune?'],
  ['WebFlux vs MVC','Event-loop, non-blocking, backpressure vs thread-per-request','When is WebFlux the WRONG choice? => blocking JDBC in the chain'],
  ['@ConfigurationProperties vs @Value','Typed binding vs a single value',''],
  ['Graceful shutdown','Stop accepting, drain in-flight, then exit','How does that interact with a K8s rolling update? => preStop + terminationGracePeriodSeconds']
 ]},

{id:'pg', n:5, name:'PostgreSQL & JPA', phase:1, hrs:14,
 qa:[
  ['B-tree index','Sorted structure; supports =, ranges, ordering, prefix of a composite','Why does index column order matter? => leftmost-prefix rule'],
  ['Composite index order','Equality columns first, then the range column','You have (a,b). Does a query on b alone use it? => no'],
  ['Covering / index-only scan','All needed columns in the index, plus a visible heap page','Why does VACUUM matter for index-only scans?'],
  ['EXPLAIN ANALYZE','Seq scan vs index scan vs bitmap heap scan; estimated vs actual rows','Estimate says 10, actual is 100,000 — what do you do? => ANALYZE, stats target, rewrite'],
  ['When a seq scan is right','Low selectivity, small table','Why is an index sometimes SLOWER?'],
  ['MVCC','Each write creates a new row version; readers never block writers','Where do the dead tuples go? => VACUUM, and bloat if it cannot keep up'],
  ['Isolation levels','Postgres default READ COMMITTED; REPEATABLE READ; SERIALIZABLE (SSI)','Give me a lost update at READ COMMITTED, and two ways to prevent it'],
  ['Deadlocks','Two transactions grabbing rows in opposite order','How do you find them? => logs, pg_locks. Fix? => consistent ordering, shorter transactions'],
  ['SELECT FOR UPDATE','Row-level pessimistic lock','FOR UPDATE SKIP LOCKED — what is it for? => queue-in-a-table workers'],
  ['Connection pooling','HikariCP; pool size ~ cores x 2, not "hundreds"','The pool exhausted. Diagnose. => long transactions, leaked connections, N+1, missing timeouts'],
  ['The N+1 problem','One query per parent row from lazy loading','How do you FIX it? => JOIN FETCH, @EntityGraph, batch size. How do you DETECT it?'],
  ['Lazy vs eager','Lazy by default for collections; eager causes cartesian blowups','LazyInitializationException — why, and what is the RIGHT fix? (not open-in-view)'],
  ['JPA dirty checking','The persistence context flushes changes at commit','You changed a field and never called save(). Was it persisted? => yes, inside a transaction'],
  ['Optimistic locking','@Version column','Two users edit the same row — walk me through it'],
  ['Partitioning vs sharding','Within one DB vs across machines','When do you reach for each?'],
  ['JSONB','Flexible fields, GIN index','When does this become a mistake?']
 ]},

{id:'api', n:6, name:'REST, API design & auth', phase:2, hrs:8,
 qa:[
  ['Idempotency','Same request twice = same result. PUT/DELETE yes, POST no by default','Make POST idempotent => client-supplied idempotency key + a stored result'],
  ['Status codes','201 + Location, 202 async, 400 vs 422, 409 conflict, 429 rate limit','What do you return when the resource is created asynchronously?'],
  ['Pagination','Offset is simple but drifts and gets slow; cursor/keyset is stable and fast','Page 10,000 with offset — what is wrong?'],
  ['Versioning','URL path, header, or content negotiation','How do you retire v1?'],
  ['OAuth2 flows','Authorization code + PKCE for apps; client credentials for service-to-service','Why is implicit flow deprecated?'],
  ['JWT','header.payload.signature; stateless; CANNOT be revoked','So how do you revoke one? => short TTL + refresh token + a denylist'],
  ['Where to rate limit','Gateway/edge, before your service','Per user or per IP, and what breaks with each?'],
  ['CORS','Browser-enforced preflight','Why does it not protect your API?'],
  ['Retries','Exponential backoff WITH JITTER','What does retrying without jitter cause? => thundering herd'],
  ['Timeouts','Every remote call needs one; budget them down the chain','Downstream p99 is 3s and your timeout is 5s — what happens under load?']
 ]},

{id:'kafka', n:7, name:'Kafka — from zero', phase:1, hrs:16,
 note:'HANDS-ON ARTEFACT REQUIRED: Docker Compose with Kafka, a Spring Boot producer and consumer, a topic with 3 partitions, a consumer group of 2 — then KILL ONE CONSUMER and watch the rebalance, and REPLAY from an earlier offset. Reading about Kafka does not survive the follow-up column.',
 qa:[
  ['Topic / partition / offset','A topic is split into partitions; each is an ordered append-only log; consumers track offsets','Why partitions at all? => parallelism and scale-out'],
  ['Ordering guarantee','Ordered WITHIN A PARTITION ONLY','So how do you get per-user ordering? => partition key = user id. What breaks if you add partitions later?'],
  ['Consumer groups','Each partition goes to exactly one consumer in a group','You have 3 partitions and 5 consumers — what happens? => two idle'],
  ['Rebalancing','Membership change triggers reassignment; processing pauses','How do you avoid a rebalance storm? => max.poll.interval, heartbeat tuning, cooperative-sticky'],
  ['Consumer dies mid-batch','Offsets not committed => redelivery from the last commit','So your consumer must be…? => IDEMPOTENT'],
  ['Delivery semantics','at-most-once (commit first), at-least-once (process first — the default choice), exactly-once (transactions)','Is exactly-once real? => within Kafka via idempotent producer + transactional writes; end-to-end still needs idempotency'],
  ['Retention vs compaction','Time/size-based deletion vs keep the LATEST VALUE PER KEY','When would you compact? => changelog / state topics'],
  ['Poison message','Retry with backoff, then route to a DLQ','How do you replay from the DLQ safely?'],
  ['Consumer lag','Committed offset vs log end offset','Lag is growing. Name four causes. => slow processing, too few partitions, rebalances, a downstream bottleneck'],
  ['Kafka vs RabbitMQ vs SQS','Log with replay and ordering vs a broker with routing/ack semantics vs a managed queue','PICK ONE for your event-driven components and defend it'],
  ['Producer acks','acks=0/1/all + min.insync.replicas','Which for money? => all'],
  ['Schema evolution','Schema registry, backward/forward compatibility','You add a required field — who breaks?']
 ]},

{id:'micro', n:8, name:'Microservices — from zero', phase:2, hrs:12,
 note:'You are monolithic. That is a BETTER story than "we use microservices" if you can articulate the trade-off — most candidates parrot microservices without having felt the pain.',
 qa:[
  ['When NOT to','A monolith is right for small teams, shared data, unclear boundaries. Microservices buy independent deploy and scale, and cost you a distributed system','ARGUE AGAINST MICROSERVICES. Answering this well is worth more than the architecture diagram'],
  ['Splitting a monolith','Find a bounded context with few writes across the seam; strangler-fig it behind a facade; move data last','YOUR QUESTION: which seam would you split first in your system, and why have you not?'],
  ['Service discovery','A registry, or K8s Services + DNS','How does a caller find a healthy instance?'],
  ['API gateway','One edge for auth, rate limiting, routing, aggregation','What is the risk? => it becomes a distributed monolith'],
  ['Circuit breaker','Closed -> open on failure threshold -> half-open probe. resilience4j','A downstream is SLOW but not failing. What protects you? => timeout + bulkhead + breaker'],
  ['Bulkhead','Isolate thread pools / connections per dependency','Why is a timeout not enough?'],
  ['Retries','Backoff + jitter, and ONLY for idempotent operations','You retried a payment. Now what?'],
  ['Saga','Local transactions + compensating actions; choreography vs orchestration','Why not 2PC? => locks held across services, coordinator is a SPOF, hurts availability'],
  ['Outbox','Write the row and the event in ONE local transaction; a relay publishes','Why not write to the DB then publish? => dual write; one can fail'],
  ['Distributed tracing','Trace id propagated through headers; spans','A request is slow across five services — find it'],
  ['Config & secrets','Config server or K8s ConfigMap/Secret','How do you rotate a secret with zero downtime?'],
  ['Data per service','Each service owns its store; no cross-service joins','So how do you build a report spanning three services? => CQRS, a read model, or a warehouse']
 ]},

{id:'k8s', n:9, name:'Docker & Kubernetes', phase:1, hrs:12,
 note:'YOUR PRODUCTION EDGE. Most candidates recite Kubernetes; you have been paged by it. Lead with a real incident.',
 qa:[
  ['Image layers','Copy-on-write layers; cache invalidates at the first changed layer','Order your Dockerfile for cache hits => deps before source'],
  ['Multi-stage build','Build in a fat image, copy the artefact into a slim one','Why does this matter beyond size? => attack surface'],
  ['Pod vs container','A pod is the scheduling unit; shares network namespace and volumes','When do two containers belong in one pod? => sidecar, tight coupling'],
  ['Deployment / ReplicaSet','Declarative desired state; the controller reconciles','You deleted a pod. What happens?'],
  ['Service / Ingress','Stable virtual IP + selector; Ingress is L7 routing','How does traffic reach a pod, step by step?'],
  ['Liveness vs readiness vs startup','Liveness RESTARTS the container. Readiness REMOVES it from the Service endpoints. Startup gives slow boots time','WHAT BREAKS IF YOU SWAP LIVENESS AND READINESS? => a briefly-busy pod gets killed in a restart loop'],
  ['Requests vs limits','Request is what the scheduler reserves; limit is the hard cap','Set only limits — what happens? => request defaults to the limit; poor packing. Exceed the memory limit? => OOMKilled'],
  ['OOMKilled','Container exceeded its memory limit','Your Java pod OOMKills. What do you change? => heap vs container limit, MaxRAMPercentage, off-heap and metaspace, then actually fix the leak'],
  ['CPU throttling','CPU limits throttle via cfs quota rather than killing','Latency spikes but memory is fine — what would you check?'],
  ['CrashLoopBackOff','Container exits repeatedly; backoff grows','Walk me through debugging it => describe pod (events), logs --previous, exit code, probe config, missing config/secret, image pull'],
  ['Rolling update','maxSurge / maxUnavailable; readiness gates the rollout','How do you get TRULY zero downtime? => readiness + graceful shutdown + preStop drain'],
  ['HPA','Scales replicas on metrics','Why might HPA not help? => the bottleneck is the DB or a single Kafka partition'],
  ['ConfigMap vs Secret','Non-sensitive vs base64 (not encrypted at rest by default)','How do you rotate without a restart?'],
  ['StatefulSet','Stable identity and storage','Why not run Postgres in a Deployment?']
 ]},

{id:'obs', n:10, name:'Observability, testing, CI/CD', phase:2, hrs:4,
 qa:[
  ['Logs vs metrics vs traces','Events / aggregates / the causal request path','You have all three and the app is slow. What do you look at first?'],
  ['Structured logging + correlation id','JSON logs, trace id propagated','How does the id survive an async hop into Kafka? => carry it in headers'],
  ['What to alert on','Symptoms and SLO burn, not causes','Why is "CPU > 80%" a bad alert?'],
  ['Test pyramid','Many unit, fewer integration, very few E2E','Where do you test a repository query?'],
  ['Mockito','Mock collaborators, not the class under test','When is mocking a smell? => mocking value objects, over-specifying interactions'],
  ['Testcontainers','Real Postgres/Kafka in Docker for tests','Why not H2? => dialect drift; H2 passes what Postgres rejects'],
  ['Testing a Kafka consumer','Embedded/Testcontainers Kafka, or test the handler directly',''],
  ['Flaky tests','Time, ordering, shared state, real network','What is the cost? => the team stops trusting the suite'],
  ['Blue-green vs canary','Two full environments vs a percentage rollout','Which for a schema change? => neither alone: expand/migrate/contract'],
  ['Rollback','Redeploy the previous image; schema changes must be backward compatible','You cannot roll back a dropped column. So what is the process?']
 ]}
];

PLAN.techTriggers = [
  ['"our consumers keep falling behind"','Consumer lag · partition count · per-message processing time · rebalance frequency'],
  ['"the pod restarts under load"','Memory limit vs JVM heap · OOMKilled · MaxRAMPercentage · liveness probe too aggressive'],
  ['"it is slow but only sometimes"','GC pause · CPU throttling · connection-pool wait · p99 vs mean'],
  ['"the query got slow after the table grew"','Index column order · EXPLAIN · seq scan · stale statistics · bloat'],
  ['"the retry made it worse"','Thundering herd · no jitter · no circuit breaker · non-idempotent operation'],
  ['"the same request was processed twice"','At-least-once delivery · missing idempotency key · consumer died before commit'],
  ['"it works on my machine"','Image layers · env config · Testcontainers vs H2'],
  ['"two users overwrote each other"','Lost update · optimistic locking with @Version · isolation level'],
  ['"the transaction did not roll back"','Self-invocation · checked exception · caught and swallowed · wrong propagation'],
  ['"we cannot deploy without downtime"','Readiness probe · graceful shutdown · preStop · backward-compatible schema'],
  ['"the whole app went down because one service was slow"','Circuit breaker · bulkhead · timeout budget'],
  ['"we need to add a new consumer of this data"','Log-based stream over a queue · replay · compaction']
];

/* ============================================================ TEMPLATES === */

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
 {ph:1, t:'Applications', d:'JPM / Amex / Expedia submitted by day 21'},
 {ph:2, t:'Unseen medium', d:'<= 15 min'},
 {ph:2, t:'Speed runs', d:'LC 200, 994, 146, 236 under 10 min cold'},
 {ph:2, t:'DP', d:'State stated in English before coding, every time'},
 {ph:2, t:'Amazon LP', d:'15 stories, real numbers, under 2 min each, "I" not "we"'},
 {ph:2, t:'Amazon hybrid', d:'Design + running code + algorithm in one 60-min clock'},
 {ph:2, t:'System design', d:'Any of sessions 1-13 end-to-end in 45 min, cross-questions survived'},
 {ph:2, t:'Applications', d:'Google / Uber submitted by day 91'},
 {ph:3, t:'Unseen hard, cold, narrated', d:'<= 35 min, >= 70% over 10 attempts'},
 {ph:3, t:'All 29 templates', d:'Blank file, under 3 min each'},
 {ph:3, t:'Trigger recall', d:'Reproduce every pattern table from memory at >= 85%'},
 {ph:3, t:'Modelling', d:'neighbors(state) for any implicit-graph problem in under 3 min'},
 {ph:3, t:'State augmentation', d:'Given "at most K X", name the state tuple in under 60 sec'},
 {ph:3, t:'Machine coding', d:'90-min round finished with running, tested code'},
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

/* --- LP granularity: 0.30 of Amazon's score cannot hang on one checkbox --- */
PLAN.lld.c = PLAN.lld.c.concat([
  ['LP stories 1–3 — ownership · dive deep · deliver results','concept','Real numbers. Written, not remembered.'],
  ['LP stories 4–6 — customer obsession · invent and simplify · bias for action','concept',''],
  ['LP stories 7–9 — earn trust · have backbone and disagree · learn and be curious','concept',''],
  ['LP stories 10–12 — hire and develop · frugality · think big','concept',''],
  ['LP stories 13–15 — highest standards · are right a lot · best employer','concept',''],
  ['LP: "your biggest failure" — rehearsed cold','concept','This one catches people. Prepare it specifically.'],
  ['LP: "when you disagreed with a manager" — rehearsed cold','concept','So does this one.'],
  ['LP full rehearsal — all 15 under 2 minutes each, "I" not "we"','concept','Record it. Count how often you say "we".']
]);

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
