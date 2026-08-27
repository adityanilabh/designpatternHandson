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

/* tier 'b' = tier 1-2 (the heavy block here) · 'c' = Uber / Apple / Amazon-senior
   Per session:
     asked     the prompt as an interviewer actually poses it, plus its variants
     who       who asks this one
     clarify   what YOU ask in the first three minutes
     scale     the back-of-envelope for this specific problem
     terms     [term, one-line definition] — vocabulary is scored signal
     decisions [decision point, the options, the verdict and why]
     cross     [the follow-up they will ask, the answer spine]
     fail      what actually sinks candidates on this one
     anchor    the real system to point at                                     */

PLAN.sd = [

{n:1, wk:1, tier:'b', t:'Fundamentals & estimation', anchor:'',
 who:'Everyone. This is not a round — it is the tax you pay in every other round.',
 asked:[
  'How many servers would you need for 100M daily active users?',
  'Estimate the storage for five years of a photo-sharing app.',
  'What is the QPS of a service with 500M requests a day?',
  'Walk me through CAP, and tell me where your last system sat.'
 ],
 clarify:[
  'Is this peak QPS or average? (peak is usually 2–3x average)',
  'Read-heavy or write-heavy, and roughly what ratio?',
  'What latency are we promising — p50 or p99?',
  'Is this one region or several?'
 ],
 scale:'Anchor everything to: 1M requests/day ≈ 12 QPS · 100M DAU x 10 actions = 1B events/day ≈ 12k QPS average, ~35k peak · 1KB x 1B = 1TB/day = 365TB/year. Round aggressively and say you are rounding.',
 terms:[
  ['Latency numbers','L1 ~1ns · RAM ~100ns · SSD random read ~100us · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent ~150ms'],
  ['QPS','Queries per second. 86,400 s/day, so 1M/day ≈ 12 QPS. Always state peak separately.'],
  ['CAP','Under a network PARTITION you choose consistency or availability. It says nothing when there is no partition — which is most of the time.'],
  ['PACELC','The honest extension: on Partition choose A or C; Else choose Latency or Consistency. This is the one that actually describes daily trade-offs.'],
  ['Strong consistency','Every read sees the latest write. Costs a round trip or a quorum.'],
  ['Eventual consistency','Replicas converge given no new writes. Fine for a like count, not for a bank balance.'],
  ['Read-your-writes','A user always sees their own write, even if others do not yet. Cheapest fix for the "I posted it and it vanished" complaint.'],
  ['Monotonic reads','You never see the clock go backwards. Prevents a refresh showing older data.'],
  ['SLA / SLO / SLI','Contract / internal target / the actual measurement. Alert on the SLO, not the SLI.'],
  ['Nines','99.9% = 43 min/month down. 99.99% = 4.3 min. Each nine costs roughly 10x.']
 ],
 decisions:[
  ['Peak vs average','Design for average and hope · design for peak · autoscale','Size for peak, autoscale toward average. Say the peak-to-average ratio you assumed — 2-3x is defensible.'],
  ['Where to round','Exact arithmetic · powers of ten','Powers of ten, out loud. An interviewer scores the method, not the digits.']
 ],
 cross:[
  ['Why not just use a bigger machine?','Vertical scaling has a ceiling and a single failure domain. It is often the right FIRST answer though — say that, then say when it stops working.'],
  ['You said eventually consistent. What does the user actually see?','Name the concrete anomaly: a like count that flickers, a comment that disappears on refresh. Then name the mitigation: read-your-writes via sticky routing or reading your own writes from the primary.'],
  ['What is your p99 and why is it worse than p50?','Queueing, GC pauses, cold caches, a slow replica, retries. p99 is where the tail lives and it is what users actually feel.'],
  ['Four nines — what does that cost you?','Multi-AZ, automated failover, no manual deploys, an on-call rota. Say the operational cost, not just the architecture.']
 ],
 fail:[
  'Reaching for a calculator or going silent. Estimate out loud, badly and fast, and correct yourself.',
  'Reciting CAP as "pick two". It is only a choice during a partition.',
  'Never stating peak vs average, so every downstream number is ambiguous.'
 ]},

{n:2, wk:2, tier:'b', t:'Caching', anchor:'Facebook memcache leases (the stampede paper) · Redis vs Memcached',
 who:'JPM · Amex · Expedia · Amazon · Microsoft',
 asked:[
  'Design a caching layer for a read-heavy API.',
  'Our database is falling over under reads. What do you do?',
  'Design a distributed cache like Redis.',
  'How do you keep a cache and a database in sync?'
 ],
 clarify:[
  'What is the read-to-write ratio? (caching only pays above ~10:1)',
  'How stale can this data be — seconds, minutes, or never?',
  'What is the working-set size versus the total data size?',
  'Is a cache miss expensive, or just slower?'
 ],
 scale:'Cache sizing: hit rate follows the working set, not the total. 20% of keys usually serve 80% of reads. 100GB of data with a 10GB working set means 10GB of RAM buys you ~80% hit rate.',
 terms:[
  ['Cache-aside (lazy)','App checks cache, misses, reads DB, writes cache. The default. Simple, and the first request after a write is always a miss.'],
  ['Write-through','Write to cache and DB together. Cache is never stale; writes are slower.'],
  ['Write-back','Write to cache, flush to DB later. Fast, and you can lose data on a crash.'],
  ['Write-around','Write to DB only, let reads populate. Good when written data is rarely read soon after.'],
  ['TTL','Expiry time. The cheapest form of invalidation, and usually the right one.'],
  ['Cache stampede','A hot key expires and thousands of requests hit the DB at once.'],
  ['Request coalescing','Only one request recomputes; the rest wait on it. Also called single-flight.'],
  ['Consistent hashing','Keys map to a ring so adding or removing a node moves only 1/N of keys instead of all of them.'],
  ['Virtual nodes','Each physical node owns many ring positions, so load stays even when one dies.'],
  ['Hot key','One key taking a disproportionate share of traffic — a celebrity, a viral post. Breaks even a good sharding scheme.']
 ],
 decisions:[
  ['Cache placement','Client · CDN · app-local · shared cache tier · DB buffer pool','Usually a shared tier (Redis) plus a CDN for static. App-local is fastest but gives you N inconsistent copies.'],
  ['Invalidation','TTL only · explicit delete on write · versioned keys','TTL is the default. Explicit delete on write when staleness is visible. Versioned keys when you cannot enumerate what to delete.'],
  ['Eviction','LRU · LFU · FIFO · random','LRU by default. LFU when there is a stable hot set and you want to survive a scan. Say why you picked one.'],
  ['Redis vs Memcached','','Memcached is a simpler pure cache and multi-threaded. Redis gives data structures, persistence and replication. Pick Redis unless you genuinely only need get/set.']
 ],
 cross:[
  ['The cache expires and 10,000 requests hit at once. What happens?','A stampede. Three fixes: request coalescing so one caller recomputes, jittered/randomised TTLs so keys do not expire together, or an early-recompute window where one request refreshes before expiry while others serve the old value.'],
  ['What if Redis goes down entirely?','Decide fail-open or fail-closed. Fail-open means all traffic hits the DB — will it survive? Usually you need a circuit breaker plus load shedding, or the outage cascades.'],
  ['Two servers write the same key at the same time. Which wins?','Last write wins by default, which can resurrect stale data. If it matters, use a versioned/CAS write or invalidate-then-write rather than write-then-invalidate.'],
  ['How do you cache something a user is only allowed to see part of?','Cache the raw object and apply authorisation on read, or key the cache by (resource, permission-scope). Never cache the post-authorisation response under a shared key.'],
  ['One key gets 50% of your traffic. Now what?','Hot key. Replicate that key across several nodes with a random suffix, or push it into app-local cache with a short TTL.'],
  ['How do you warm a cold cache after a deploy?','Pre-warm from a snapshot of hot keys, or roll the deploy so only part of the fleet is cold at once.']
 ],
 fail:[
  'Saying "add a cache" without saying what happens on a miss, on a write, or when it is down.',
  'Not knowing the stampede answer. It is the single most common cache follow-up.',
  'Ignoring the read-to-write ratio. A cache in front of a write-heavy store is worse than no cache.'
 ]},

{n:3, wk:3, tier:'b', t:'Databases — the choice, not the preference', anchor:'Postgres B-tree and MVCC internals — your own stack',
 who:'JPM · Amex · Expedia. The deepest DB questioning is at tier 1.',
 asked:[
  'SQL or NoSQL for this, and defend it.',
  'Design the data model for [product].',
  'This query got slow after the table grew. Diagnose it.',
  'When would you NOT use a relational database?'
 ],
 clarify:[
  'What are the access patterns? (this decides the store, not the data shape)',
  'Do we need transactions across more than one entity?',
  'How much data, and how fast is it growing?',
  'Are the queries known in advance, or ad hoc?'
 ],
 scale:'A single well-indexed Postgres handles low tens of thousands of QPS and single-digit TB comfortably. Say that out loud — most systems never need more, and knowing the ceiling is worth more than knowing Cassandra.',
 terms:[
  ['B-tree','Sorted, balanced, good for reads and ranges. What Postgres and MySQL use.'],
  ['LSM-tree','Buffer writes in memory, flush sorted runs, compact later. Fast writes, read amplification, compaction cost. Cassandra, RocksDB, ScyllaDB.'],
  ['Selectivity','What fraction of rows a predicate keeps. Low selectivity means an index will not help.'],
  ['Covering index','Contains every column the query needs, so it never touches the heap.'],
  ['Leftmost prefix','A composite index on (a,b,c) serves a, a+b, a+b+c — never b alone.'],
  ['MVCC','Each write creates a new row version; readers never block writers. Dead versions need VACUUM.'],
  ['Isolation levels','Read committed (Postgres default) · repeatable read · serializable. Each forbids more anomalies and costs more.'],
  ['Normalisation','Store facts once. Trade joins for consistency. Denormalise deliberately, not accidentally.'],
  ['Write amplification','One logical write causing many physical writes — compaction, index maintenance, replication.']
 ],
 decisions:[
  ['SQL vs NoSQL','','Start relational. Move when you have a concrete reason: scale beyond one machine, a genuinely schemaless shape, or an access pattern relational storage serves badly. "It scales better" is not a reason on its own.'],
  ['B-tree vs LSM','','Read-heavy with ranges: B-tree. Write-heavy and append-mostly: LSM, and accept compaction.'],
  ['Index columns','','Equality columns first, then the range column. An index on (status, created_at) serves status=x AND created_at>y; the reverse order does not.'],
  ['Denormalise?','','Only when a join is measurably the bottleneck AND you have a plan for keeping the copies consistent.']
 ],
 cross:[
  ['Read me this EXPLAIN plan.','Name the scan type, compare estimated vs actual rows, find where the estimate is wrong. A seq scan on a big table with a selective predicate means a missing or unusable index. A huge estimate error means stale statistics — run ANALYZE.'],
  ['Why is your index not being used?','Wrong column order, a function applied to the column, low selectivity so the planner prefers a seq scan, or a type mismatch forcing a cast.'],
  ['Give me a lost update at READ COMMITTED.','Two transactions read balance=100, both compute 100-10, both write 90. One update vanished. Fix with SELECT FOR UPDATE, an atomic UPDATE ... SET balance = balance - 10, or a version column.'],
  ['Your connection pool exhausted. Diagnose it.','Long-running transactions, leaked connections, an N+1 holding connections, or missing statement timeouts. Pool size should be roughly cores x 2, not hundreds — a bigger pool usually makes it worse.'],
  ['How do you add a column to a 500M-row table with no downtime?','Expand-migrate-contract: add nullable, backfill in batches, dual-write, switch reads, then drop the old. Never a blocking ALTER in one shot.'],
  ['What breaks when you shard this?','Cross-shard joins, cross-shard transactions, and unique constraints across shards. Say which of those your design needs and how you avoid them.']
 ],
 fail:[
  'Choosing NoSQL as a default and being unable to say what specifically fails in Postgres.',
  'Not being able to read an EXPLAIN plan when the DB is on your resume.',
  'Talking about indexes without mentioning column order.'
 ]},

{n:4, wk:4, tier:'b', t:'Sharding & replication', anchor:'Discord: Cassandra to ScyllaDB · Instagram sharded Postgres',
 who:'JPM · Amex · Amazon · Uber',
 asked:[
  'This table is 10TB. Shard it.',
  'How do you scale reads? How do you scale writes?',
  'What is your shard key, and why does it not create a hot partition?',
  'A replica is lagging. What does the user see?'
 ],
 clarify:[
  'Read-heavy or write-heavy? (replicas fix reads; only sharding fixes writes)',
  'What are the query patterns — always by one key, or ad hoc?',
  'Is the data naturally partitionable by tenant or user?',
  'Do we need cross-shard transactions? (if yes, push back hard)'
 ],
 scale:'Rule of thumb: one node holds low single-digit TB and tens of thousands of QPS. 10TB means ~4-8 shards with headroom, not 100. Over-sharding costs more operationally than it saves.',
 terms:[
  ['Range sharding','Split by key range. Good for range scans, prone to hot spots at the ends (e.g. sharding by timestamp).'],
  ['Hash sharding','Hash the key. Even distribution, no range scans.'],
  ['Directory sharding','A lookup service maps key to shard. Flexible, and now the directory is a SPOF.'],
  ['Hot partition','One shard taking disproportionate load. The failure mode of every naive shard key.'],
  ['Leader-follower','One writer, many readers. Simple, and reads can be stale.'],
  ['Multi-leader','Writes anywhere, conflicts possible. Needs a resolution strategy.'],
  ['Quorum (R+W>N)','Read and write quorums overlapping guarantees you read the latest write.'],
  ['Replication lag','How far behind a follower is. The source of "I posted it and it vanished".'],
  ['Resharding','Moving data when you add shards. Consistent hashing keeps this to 1/N.'],
  ['Split brain','Two nodes both believe they are leader. Prevented by fencing tokens or a quorum-based election.']
 ],
 decisions:[
  ['Shard key','user_id · tenant_id · hash(id) · timestamp','Almost never timestamp — it makes the newest shard the hottest. Pick the key that appears in the majority of queries so most reads hit one shard.'],
  ['Replicas vs shards','','Replicas scale READS and give you failover. Shards scale WRITES and storage. Do not reach for sharding when the problem is read load.'],
  ['Sync vs async replication','','Async by default — sync replication couples your write latency to your slowest replica. Sync (or quorum) when losing the last few writes is unacceptable.'],
  ['Failover','Automatic · manual','Automatic with a quorum-based election and fencing. Manual failover means your RTO is however long it takes to wake someone up.']
 ],
 cross:[
  ['Defend your shard key.','Say the query distribution it serves, the hot-partition risk, and what happens when one tenant is 100x bigger than the rest — usually a dedicated shard for whales.'],
  ['You need to add shards. How, without downtime?','Consistent hashing so only 1/N moves; dual-write during migration; backfill; verify; cut over reads; stop dual-writing.'],
  ['A query needs data from three shards.','Scatter-gather, and now your latency is the slowest shard. If it is common, the shard key is wrong or you need a denormalised read model.'],
  ['The leader dies mid-write. What is lost?','With async replication, anything not yet replicated. State your RPO explicitly. With quorum writes, nothing acknowledged is lost.'],
  ['User posts a comment and refreshes — it is gone. Why?','They read from a lagging follower. Fix with read-your-writes: route that user to the leader for a short window, or track a write timestamp per session.'],
  ['Two nodes both think they are the leader.','Split brain. Quorum election plus fencing tokens so the stale leader is rejected by the storage layer.']
 ],
 fail:[
  'Sharding when replicas would have solved it.',
  'Choosing a shard key without saying what makes it hot.',
  'Claiming zero data loss with async replication.'
 ]},

{n:5, wk:5, tier:'b', t:'Queues, async & delivery semantics', anchor:'Kafka vs SQS vs RabbitMQ — and your own custom Spring event components',
 who:'JPM · Amex · Amazon · Uber. Directly connected to your Kafka module.',
 asked:[
  'Design an async job pipeline.',
  'A request takes 30 seconds. Make it not.',
  'How do you guarantee this is processed exactly once?',
  'Design a notification / email sending system.'
 ],
 clarify:[
  'Does the caller need the result, or just an acknowledgement?',
  'Does ordering matter, and ordering by what — globally, or per user?',
  'What happens if a message is processed twice? Is that harmless?',
  'Do we need to replay history, or is a consumed message gone forever?'
 ],
 scale:'Queue depth is the signal to watch. Producers at 1k/s and consumers at 800/s means 200 messages/s of unbounded growth — say what you do BEFORE the disk fills.',
 terms:[
  ['At-most-once','Commit the offset first, then process. Loses messages on a crash.'],
  ['At-least-once','Process first, then commit. Duplicates on a crash. The default choice.'],
  ['Exactly-once','At-least-once plus idempotency. Not a delivery property you can buy — it is something you build.'],
  ['Idempotency key','A client-supplied unique id; the server stores the result and returns it on a repeat.'],
  ['DLQ','Dead letter queue. Where a message goes after N failed attempts, so it stops blocking the partition.'],
  ['Backpressure','Making the producer slow down when consumers cannot keep up. Bounded queues give it to you for free.'],
  ['Outbox pattern','Write the row and the event in one local transaction; a relay publishes from the outbox table.'],
  ['Dual write','Writing to the DB and the broker separately. One can fail. This is the bug the outbox exists to prevent.'],
  ['Queue vs log','A queue deletes on consume. A log keeps messages, so new consumers can replay from the beginning.'],
  ['Visibility timeout','SQS: how long a consumed message is hidden before it reappears. Too short means duplicate processing.']
 ],
 decisions:[
  ['Queue vs log','SQS/RabbitMQ · Kafka','Need replay, multiple independent consumers, or ordering per key? Kafka. Just need work distributed to workers with per-message ack and retry? A queue is simpler and cheaper.'],
  ['Ordering','Global · per key · none','Per key, via the partition key. Global ordering means one partition means no parallelism — almost never worth it.'],
  ['Retry policy','Immediate · fixed · exponential with jitter','Exponential with jitter, capped, then DLQ. Immediate retries against a struggling downstream make the outage worse.'],
  ['Dual write vs outbox','','Outbox. Always. The dual-write problem is the thing an interviewer is checking you know.']
 ],
 cross:[
  ['What if the client retries the request?','Idempotency key: client generates it, server stores key to result with a TTL, a repeat returns the stored result. Two concurrent retries need a unique constraint on the key so one loses.'],
  ['Your consumer dies halfway through a batch.','The offset was not committed, so the messages are redelivered. Which means your consumer MUST be idempotent — say this before they ask.'],
  ['Is exactly-once real?','Inside Kafka, yes — idempotent producer plus transactional writes. End to end, no: the moment you touch an external system you need idempotency at the consumer.'],
  ['The queue is backing up. What do you do?','First diagnose: slow consumer, too few partitions, a poison message, or a downstream bottleneck. Then: scale consumers (up to partition count), shed low-priority load, and apply backpressure to producers.'],
  ['One message keeps failing and blocks everything.','Poison message. Retry with backoff, then route to a DLQ so the partition advances. Then have a process to inspect and replay the DLQ.'],
  ['How do you replay from the DLQ without causing chaos?','Fix the bug first, then replay at a throttled rate into a separate topic or with a flag, and rely on consumer idempotency.'],
  ['You built custom event components in Spring. Why not Kafka?','Answer honestly: the constraint at the time. Then say precisely what Kafka would have bought — durability, replay, consumer groups, per-key ordering — and what it costs: an operational dependency and a rebalance model to reason about.']
 ],
 fail:[
  'Saying "exactly once" as if the broker provides it.',
  'No DLQ, so one bad message stops the pipeline.',
  'Retrying non-idempotent operations. Especially payments.'
 ]},

{n:6, wk:6, tier:'b', t:'Kubernetes as a design primitive', anchor:'Your own production cluster — frontend and backend pods',
 who:'JPM · Amex · Expedia. Unusual as an SD topic, and YOUR strongest card.',
 asked:[
  'How would you deploy and scale this design?',
  'Walk me through what happens when a pod dies.',
  'How do you deploy with zero downtime?',
  'Your service is running out of memory in production. Walk me through it.'
 ],
 clarify:[
  'Stateless or stateful? (that decides Deployment vs StatefulSet)',
  'What is the acceptable downtime during a deploy?',
  'Is scaling driven by CPU, memory, or a queue depth?',
  'Single cluster or multi-region?'
 ],
 scale:'Pod sizing: requests set what the scheduler reserves, limits set the hard cap. A JVM pod with a 2GB limit and no -XX:MaxRAMPercentage will happily try to use more and get OOMKilled.',
 terms:[
  ['Pod','The scheduling unit. One or more containers sharing a network namespace and volumes.'],
  ['Deployment / ReplicaSet','Declarative desired state; a controller reconciles reality toward it.'],
  ['Service','A stable virtual IP plus a selector. How anything finds your pods.'],
  ['Ingress','L7 routing into the cluster — host and path based.'],
  ['Liveness probe','Fails, and the container is RESTARTED.'],
  ['Readiness probe','Fails, and the pod is REMOVED FROM SERVICE ENDPOINTS but keeps running.'],
  ['Startup probe','Gives a slow-booting app time before liveness starts counting.'],
  ['Requests vs limits','Reserved vs capped. Set both; setting only limits makes requests default to limits and wrecks bin-packing.'],
  ['OOMKilled','The container exceeded its memory limit and the kernel killed it. Exit code 137.'],
  ['CrashLoopBackOff','The container keeps exiting; the restart delay grows exponentially.'],
  ['HPA','Horizontal Pod Autoscaler — scales replica count on a metric.'],
  ['preStop + terminationGracePeriod','The drain window. Without it, a rolling update kills in-flight requests.']
 ],
 decisions:[
  ['Deployment vs StatefulSet','','Stateless: Deployment. Needs stable identity or per-pod storage (databases, Kafka): StatefulSet. And say out loud whether running the DB in-cluster is even a good idea.'],
  ['Probe design','','Liveness should check only "is this process wedged" — make it cheap and never depend on a downstream. Readiness SHOULD check downstreams. Swapping them is the classic mistake.'],
  ['Scaling signal','CPU · memory · custom (queue depth)','CPU for request-serving. Queue depth or consumer lag for workers — CPU lies about whether a consumer is keeping up.'],
  ['Rollout','Rolling · blue-green · canary','Rolling by default with maxUnavailable=0. Canary when the change is risky and you have the metrics to judge it.']
 ],
 cross:[
  ['What breaks if you swap liveness and readiness?','A pod that is briefly busy or waiting on a downstream gets RESTARTED instead of temporarily removed from rotation. Under load that becomes a restart loop that takes the whole service down.'],
  ['Your Java pod is OOMKilled. What do you change?','The JVM heap does not know about the container limit unless you tell it. Set -XX:MaxRAMPercentage, account for metaspace, thread stacks and direct buffers on top of heap, raise the limit if genuinely needed — and then actually find the leak with a heap dump.'],
  ['Latency spikes but memory is fine.','CPU throttling. A CPU limit throttles via cfs quota rather than killing, so the app just gets slower in bursts. Check container_cpu_cfs_throttled_seconds.'],
  ['Walk me through debugging CrashLoopBackOff.','kubectl describe pod for events (image pull, mount failure, probe failure) then kubectl logs --previous for the last crash, then the exit code — 137 is OOM, 1 is app error. Then check config and secrets actually exist.'],
  ['How do you get truly zero downtime?','Readiness gating the rollout, a preStop hook plus terminationGracePeriodSeconds long enough to drain, graceful shutdown in the app, and backward-compatible schema changes. Any one missing and you drop requests.'],
  ['You added HPA and it did not help.','The bottleneck was not the pods — it was the database, a connection pool, or a single Kafka partition. More replicas against a fixed downstream makes it worse.'],
  ['How do you rotate a secret with no restart?','Mounted secrets update on a delay and need the app to re-read; env vars do not update at all. Either use a mounted file with a watcher, or accept a rolling restart.']
 ],
 fail:[
  'Reciting Kubernetes concepts abstractly when you have production experience. Lead with a real incident.',
  'Not knowing the liveness vs readiness distinction cold. It is the most-asked K8s question there is.',
  'Treating HPA as a solution to every scaling problem.'
 ]},

{n:7, wk:7, tier:'b', t:'URL shortener + Pastebin', anchor:'bit.ly · the classic warm-up design',
 who:'Amazon · Microsoft · Adobe · Expedia. Often the first design they give you.',
 asked:[
  'Design TinyURL.',
  'Design Pastebin.',
  'Design a link shortener with custom aliases, expiry and click analytics.',
  'How do you generate 100M unique short codes without collisions?'
 ],
 clarify:[
  'Custom aliases, or system-generated only?',
  'Do links expire?',
  'Do we need analytics per click, and at what granularity?',
  'Read-to-write ratio? (this one is extremely read-heavy — say ~100:1)'
 ],
 scale:'100M new URLs/month ≈ 40 writes/s. At 100:1 that is ~4,000 reads/s. 100M x 500 bytes = 50GB/month, 3TB over five years. Small — say so, because it tells you a single DB plus a cache is plausible and sharding is a scale-out story, not a day-one need.',
 terms:[
  ['Base62','[a-zA-Z0-9]. 62^7 ≈ 3.5 trillion codes — 7 characters is plenty.'],
  ['Counter-based generation','A distributed counter, base62-encoded. No collisions by construction, but codes are guessable and sequential.'],
  ['Hash-based generation','Hash the URL, take the first N chars, handle collisions by retry. Same URL maps to the same code (a feature or a bug).'],
  ['Range allocation','Each app server claims a block of counter values from a coordinator, so it does not hit the counter per request.'],
  ['301 vs 302','301 permanent — the browser caches it and you lose analytics. 302 temporary — every click reaches you. Pick 302 if you want click data.'],
  ['Bloom filter','Cheap probabilistic "have I seen this code" check to avoid a DB round trip on custom-alias collisions.']
 ],
 decisions:[
  ['Code generation','Counter + base62 · hash + collision retry · random + check','Counter with range allocation per server. No collision handling, no coordination on the hot path. Mention that sequential codes are enumerable and, if that matters, encrypt or shuffle the counter.'],
  ['Storage','Relational · KV store','A KV store fits perfectly (code to URL), but relational is fine at this size. The interesting part is the cache, not the store.'],
  ['Redirect code','301 · 302','302 if analytics matter — 301 gets cached by the browser and your click counts vanish.'],
  ['Analytics','Synchronous count · async event stream','Async. Never make the redirect wait on an analytics write. Fire an event, aggregate offline.']
 ],
 cross:[
  ['Two users request the same custom alias at the same instant.','A unique constraint on the alias column; one insert fails and gets an error. Do not check-then-insert — that is a race.'],
  ['How do you stop someone enumerating all your links?','Sequential base62 is trivially enumerable. Either encrypt the counter (a format-preserving cipher) or accept it and treat links as unguessable-by-obscurity only, never as an access control.'],
  ['One link goes viral — 50k requests a second on one key.','Hot key. It is in the cache, which is the easy part; the risk is a single cache node. Replicate the key or push it to CDN/edge with a short TTL.'],
  ['How do expiries actually get deleted?','Do not run a delete sweep on the hot path. Lazy delete on read plus a background cleanup job, or a TTL in the store itself.'],
  ['The counter service is a single point of failure.','Range allocation means servers hold a block, so a brief counter outage does not stop writes. Or use per-server prefixes so there is no shared counter at all.'],
  ['Now support 10 billion links.','Shard by code prefix or hash. Because reads are by exact key, sharding is clean — no cross-shard queries. Say that; it is why this design scales so easily.']
 ],
 fail:[
  'Spending 20 minutes on code generation and never getting to caching, which is where all the traffic is.',
  'Picking 301 and then claiming per-click analytics.',
  'Not noticing that this is a tiny dataset and over-engineering the storage.'
 ]},

{n:8, wk:8, tier:'b', t:'Rate limiter', anchor:'Stripe’s rate limiters · Redis token bucket',
 who:'JPM · Amex · Amazon · Uber. Also a very common LLD crossover.',
 asked:[
  'Design a rate limiter.',
  'Limit each user to 100 requests per minute — across 50 servers.',
  'How do you protect a downstream service from being overwhelmed?',
  'Design an API gateway throttling layer.'
 ],
 clarify:[
  'Per user, per IP, per API key, or per endpoint?',
  'Hard limit or soft (throttle vs reject)?',
  'Is it acceptable to be approximate, or must it be exact?',
  'What do we return when limited — 429 with Retry-After?'
 ],
 scale:'The limiter itself is on the hot path of every request, so its cost matters. A Redis round trip per request adds ~1ms; at 50k QPS that is 50k extra Redis ops/s. That pressure is what pushes you toward local counters with periodic sync.',
 terms:[
  ['Fixed window','Count per clock minute. Simple, and allows 2x burst across the boundary.'],
  ['Sliding window log','Store every timestamp. Exact, and memory grows with traffic.'],
  ['Sliding window counter','Weighted blend of the current and previous window. Nearly exact, tiny memory. The usual answer.'],
  ['Token bucket','Tokens refill at a fixed rate up to a capacity. Allows controlled bursts. What most real systems use.'],
  ['Leaky bucket','Requests drain at a constant rate. Smooths output, no bursts.'],
  ['429 + Retry-After','The correct response. Tell the client when to come back.'],
  ['Fail-open vs fail-closed','When the limiter is down: let everything through, or reject everything. Almost always fail-open — a broken limiter should not be an outage.']
 ],
 decisions:[
  ['Algorithm','fixed · sliding log · sliding counter · token bucket','Token bucket for user-facing APIs (bursts are legitimate). Sliding window counter when you need accuracy with low memory. Say why fixed window is tempting and wrong: the boundary burst.'],
  ['Where it runs','Client · gateway/edge · per service','At the gateway, before your service does any work. Per-service limiters protect individual dependencies as a second layer.'],
  ['Distributed state','Redis central · local + periodic sync · consistent-hash the user to one node','Redis centrally is the simple correct answer. Local counters with sync are approximate but survive Redis being down and remove a hot-path round trip.'],
  ['Failure mode','','Fail-open with a local fallback limit. State this unprompted — it shows you have run one in production.']
 ],
 cross:[
  ['What if Redis goes down?','Fail-open, with a conservative local in-memory limit as a fallback so you are not completely unprotected. A limiter that takes down your API when it fails is worse than no limiter.'],
  ['Fixed window — show me the problem.','100/min limit. 100 requests at 11:00:59 and 100 more at 11:01:00 is 200 in one second, all legal. That is why sliding window or token bucket exists.'],
  ['Per user or per IP — what breaks with each?','Per IP punishes everyone behind a corporate NAT or mobile carrier. Per user requires authentication, so unauthenticated endpoints still need IP limiting. Usually both, at different tiers.'],
  ['Two servers process the same user simultaneously. Do they double-count?','With a central Redis counter and an atomic INCR, no. With local counters, yes — you allow up to N x limit in the worst case. Say which trade-off you took.'],
  ['How do you limit expensive endpoints differently?','Weighted tokens — a heavy endpoint costs 10 tokens, a cheap one costs 1. Same bucket, different price.'],
  ['A legitimate customer is being throttled during a spike.','Tiered limits by plan, burst capacity in the bucket, and a way to raise a specific customer’s limit without a deploy. That is a config lookup, not a code change.']
 ],
 fail:[
  'Answering with fixed window and not knowing the boundary burst.',
  'Never addressing what happens when the limiter itself fails.',
  'Forgetting to return Retry-After, so well-behaved clients cannot back off correctly.'
 ]}

];

PLAN.sd = PLAN.sd.concat([

{n:9, wk:9, tier:'b', t:'News feed / timeline', anchor:'Twitter’s celebrity problem · Instagram feed',
 who:'Amazon · Microsoft · Adobe · Uber',
 asked:[
  'Design Twitter / the Facebook news feed.',
  'Design Instagram’s home timeline.',
  'How do you handle a user with 100 million followers?',
  'Design a notification feed for an e-commerce app.'
 ],
 clarify:[
  'Chronological or ranked? (ranking changes the whole read path)',
  'How many followers does a typical user have — and the maximum?',
  'How fresh must the feed be? Seconds, or is a minute fine?',
  'Read-to-write ratio? (feeds are read-heavy, ~100:1)'
 ],
 scale:'300M DAU, 2 posts/day = 600M posts/day ≈ 7k writes/s. Each read is a feed fetch: 300M x 10 refreshes = 3B reads/day ≈ 35k QPS. Fan-out on write at an average 200 followers = 7k x 200 = 1.4M feed-row writes/s. That number is why hybrid exists.',
 terms:[
  ['Fan-out on write','Push the post into every follower’s feed at publish time. Fast reads, expensive writes, terrible for celebrities.'],
  ['Fan-out on read','Pull from everyone you follow at read time. Cheap writes, slow reads, bad for users following thousands.'],
  ['Hybrid fan-out','Push for normal users, pull for celebrities, merge at read. What every real system does.'],
  ['Feed store','Per-user list of post ids, usually capped at a few hundred, in Redis or a KV store.'],
  ['Cursor pagination','Paginate by (timestamp, id) rather than offset, so new posts do not shift pages.'],
  ['Write amplification','One post causing N feed writes. The core cost of fan-out on write.'],
  ['Ranking signals','Recency, affinity, engagement rate. Ranking turns the feed into a scoring problem on top of retrieval.']
 ],
 decisions:[
  ['Fan-out strategy','write · read · hybrid','Hybrid, with a follower-count threshold (say 10k) defining a celebrity. Say the threshold and say it is tunable.'],
  ['Feed storage','Full posts · post ids only','Ids only, hydrated from a post cache on read. Storing full posts N times is enormous duplication and makes edits impossible.'],
  ['Feed length','Unbounded · capped','Capped at ~500-1000 ids. Nobody scrolls further; older content falls back to a pull query.'],
  ['Pagination','Offset · cursor','Cursor. Offset pagination on a feed that is constantly prepended shows duplicates and skips items.']
 ],
 cross:[
  ['A user with 100M followers posts. Walk me through it.','Do NOT fan out. Mark them a celebrity, store the post once, and merge their posts into each follower’s feed at read time. This is the single question this design exists to test.'],
  ['How do you merge pushed and pulled content at read time?','Fetch the precomputed feed, fetch recent posts from the handful of celebrities the user follows, merge by timestamp, take the top N. Cache the merged result briefly.'],
  ['Someone deletes a post that is already in 200M feeds.','Do not chase it. Filter at read time by checking post existence/visibility in the hydration step — which is why you store ids, not copies.'],
  ['A new user follows 500 accounts. Their feed is empty.','Backfill asynchronously from those accounts’ recent posts, and serve a pull-based feed until the backfill completes.'],
  ['How do you make the feed personalised without killing latency?','Retrieve a candidate set cheaply (the feed store), then rank only those few hundred. Never rank the whole corpus at read time.'],
  ['The fan-out workers fall behind at peak.','Queue depth grows. Prioritise: fan out to active users first, lazily backfill inactive ones on their next read. Most followers will not open the app in the next hour.']
 ],
 fail:[
  'Picking pure fan-out on write and not raising the celebrity problem unprompted.',
  'Storing whole posts in every feed.',
  'Using offset pagination on a live feed.'
 ]},

{n:10, wk:10, tier:'b', t:'Chat system', anchor:'WhatsApp · Discord’s message store (Cassandra to ScyllaDB)',
 who:'Amazon · Microsoft · Uber',
 asked:[
  'Design WhatsApp / Messenger / Slack.',
  'Design a real-time chat with delivery receipts and presence.',
  'How do you deliver a message to a user connected to a different server?',
  'Design group chat for 1,000 members.'
 ],
 clarify:[
  '1:1 only, or groups? What is the maximum group size?',
  'Do we need read receipts and typing indicators?',
  'Message history — forever, or a retention window?',
  'End-to-end encrypted? (that removes server-side search entirely)'
 ],
 scale:'50M DAU, 40 messages/day = 2B messages/day ≈ 23k writes/s. Each message fans out to at least one recipient. Connections are the real cost: 10M concurrent WebSockets at ~10k connections per node means ~1,000 gateway nodes.',
 terms:[
  ['WebSocket','A persistent bidirectional connection. The reason chat needs a connection registry.'],
  ['Connection registry','A map of user to the gateway node holding their socket. Usually Redis with a TTL.'],
  ['Presence','Online/offline/last-seen. Extremely chatty — usually heartbeats plus a decay window, not real-time truth.'],
  ['Delivery receipt','sent / delivered / read. Three separate acknowledgements, each a message of its own.'],
  ['Offline queue','Messages stored for a user who is not connected, delivered on reconnect.'],
  ['Message ordering','Per conversation, not global. Use a per-conversation sequence number, not wall-clock time.'],
  ['Idempotent send','Client generates a message id so a retry after a flaky network does not duplicate.'],
  ['Fan-out (group)','A group message is one write plus N deliveries. Big groups are a fan-out problem, same as feeds.']
 ],
 decisions:[
  ['Transport','WebSocket · long polling · SSE','WebSocket for bidirectional. Mention long polling as the fallback for restrictive networks.'],
  ['Message store','Relational · wide-column','Wide-column (Cassandra/Scylla) partitioned by conversation_id, clustered by sequence. Chat is append-heavy with range reads by conversation — the ideal LSM workload.'],
  ['Routing across nodes','Registry lookup + direct RPC · pub/sub broadcast','Registry plus direct forward. Broadcasting every message to every gateway does not scale past a small fleet.'],
  ['Ordering','Server timestamp · per-conversation sequence','Per-conversation monotonic sequence. Clock skew across servers makes timestamps unreliable for ordering.']
 ],
 cross:[
  ['User A is on gateway 1, user B is on gateway 3. How does the message get there?','Look up B in the connection registry, forward the message to gateway 3 over an internal RPC or a pub/sub channel keyed by node. If B is absent, write to the offline queue.'],
  ['The recipient is offline. Then comes back on a different device.','Offline queue keyed by user, drained on connect. Multi-device means per-device delivery cursors, not one — each device tracks what it has received.'],
  ['Two messages arrive out of order.','Per-conversation sequence numbers; the client buffers and reorders on the gap. Do not rely on server timestamps across nodes.'],
  ['A gateway node dies with 10,000 connections.','Clients reconnect (with jittered backoff, or you get a thundering herd), get assigned a new node, the registry updates, and the offline queue covers the gap.'],
  ['Group of 1,000 — do you write 1,000 rows?','One message row per conversation, plus per-member delivery state. Do not duplicate message bodies per member. For very large groups, treat it like a feed and pull on read.'],
  ['How does presence not melt your system?','Heartbeats every ~30s with a TTL in Redis, and only push presence changes to users actively viewing that contact. Real-time global presence is the classic scaling trap.'],
  ['End-to-end encryption — what do you lose?','Server-side search, server-side spam filtering, and multi-device history sync becomes a key-management problem. Say this trade-off out loud.']
 ],
 fail:[
  'Not having an answer for cross-node delivery. It is the whole question.',
  'Using timestamps for ordering.',
  'Treating presence as trivially real-time.'
 ]},

{n:11, wk:11, tier:'b', t:'Payments, ledger & idempotent charges', anchor:'Stripe’s idempotency keys · double-entry bookkeeping',
 who:'JP MORGAN · AMEX. This is their home turf — expect real depth.',
 asked:[
  'Design a payment system.',
  'Design a wallet / ledger service.',
  'How do you make sure a customer is never double-charged?',
  'Design the money movement for a marketplace (buyer, seller, platform fee).'
 ],
 clarify:[
  'Are we moving real money, or internal credits?',
  'Do we own the ledger, or is a PSP (Stripe/Adyen) the source of truth?',
  'What is the reconciliation requirement — daily, real-time?',
  'Multi-currency? (that adds FX rate-at-time-of-transaction)'
 ],
 scale:'Payments are low QPS and high stakes. 1M transactions/day is only ~12 TPS — the design is not about throughput, it is about correctness under partial failure. Say that early; it reframes the whole conversation.',
 terms:[
  ['Double-entry','Every transaction writes two entries, debit and credit, summing to zero. The invariant that makes the ledger auditable.'],
  ['Append-only ledger','You never UPDATE a ledger row. Corrections are new reversing entries.'],
  ['Idempotency key','Client-supplied unique id per payment attempt. The single most important control in this design.'],
  ['Authorisation vs capture','Auth reserves funds; capture takes them. Two-phase, and the gap is where holds and expiries live.'],
  ['Reconciliation','Comparing your ledger against the PSP or bank statement and explaining every difference.'],
  ['Settlement','When money actually moves between institutions — hours or days after the transaction.'],
  ['Saga','A multi-step money flow with compensating transactions instead of a distributed lock.'],
  ['Compensating transaction','A business-level undo — a refund, not a rollback.'],
  ['Exactly-once (money)','Achieved with idempotency keys plus a unique constraint, never with a broker guarantee.'],
  ['PCI scope','Anything touching raw card data. Minimise it — tokenise at the edge so your services never see a PAN.']
 ],
 decisions:[
  ['Ledger model','Balance column · append-only entries','Append-only entries; balance is derived (and cached as a materialised snapshot). A mutable balance column has no audit trail and no way to explain a discrepancy.'],
  ['Consistency','Eventual · strong','Strong within the ledger. Money is the canonical case for not being eventually consistent. Across services, use a saga with compensations.'],
  ['Distributed transaction','2PC · saga','Saga. 2PC holds locks across services and its coordinator is a single point of failure — unacceptable for availability. Say this explicitly, it is the expected answer.'],
  ['Idempotency storage','In the payment row · a separate keys table','A separate table with a unique constraint on the key, storing the resulting response, with a TTL of at least 24h.']
 ],
 cross:[
  ['The client times out and retries the charge. What stops a double charge?','The idempotency key. First request inserts the key (unique constraint), processes, stores the result. The retry hits the constraint, finds the stored result, returns it. Two CONCURRENT retries: one insert wins, the other waits or returns 409.'],
  ['How do you correct a mistaken transaction?','A reversing entry, never an UPDATE. The original stays in the ledger forever — that is the point of append-only.'],
  ['Payment succeeded at the PSP but your service crashed before recording it.','This is why reconciliation exists. Poll the PSP for the status of any pending transaction, or consume their webhook — and make webhook handling idempotent too, since they retry.'],
  ['Two services both need to move money. How do you keep it consistent?','Saga with compensations: reserve, charge, credit; on failure at step 3, issue a refund for step 2. Each step idempotent, each compensation idempotent.'],
  ['A user’s balance is wrong. How do you find out why?','Replay the ledger entries for that account and compare against the cached balance. If you had a mutable balance column, you could not do this — which is the argument for the design.'],
  ['How do you handle a currency conversion?','Store the rate used and the timestamp on the transaction. Never recompute historic amounts from today’s rate.'],
  ['What happens on a partial refund with a marketplace fee?','Decide the policy first — is the platform fee refunded? — then encode it as explicit ledger entries. The design question is really a business-rules question, and saying that is a good answer.']
 ],
 fail:[
  'Not raising idempotency unprompted. At JPM and Amex this is disqualifying.',
  'Proposing 2PC without acknowledging its availability cost.',
  'A mutable balance column with no audit trail.'
 ]},

{n:12, wk:12, tier:'b', t:'Orders, inventory & reservations', anchor:'Amazon inventory holds · Ticketmaster seat locks',
 who:'AMAZON. Also Flipkart, Expedia (seats/rooms), and any e-commerce loop.',
 asked:[
  'Design Amazon’s checkout.',
  'Design a ticket booking system (BookMyShow / Ticketmaster).',
  'Two customers buy the last item at the same instant. What happens?',
  'Design the inventory service for a warehouse.'
 ],
 clarify:[
  'Is overselling ever acceptable, or must it be strictly prevented?',
  'How long may a reservation be held before payment?',
  'Single warehouse or many? (multi-warehouse turns this into an allocation problem)',
  'What happens if payment fails after the hold?'
 ],
 scale:'Peak is the whole story: a normal day at 500 orders/s becomes 50,000/s during a flash sale on one SKU. Design for the hot-SKU case — that single row is the bottleneck, not overall QPS.',
 terms:[
  ['Reservation / hold','Inventory taken out of available stock temporarily, with a TTL.'],
  ['TTL expiry','The hold releases automatically if payment does not complete. Needs a sweeper or a lazy check.'],
  ['Optimistic locking','Read version, write with WHERE version = x. Retry on conflict. Good under low contention.'],
  ['Pessimistic locking','SELECT ... FOR UPDATE. Holds a row lock. Correct under high contention, at the cost of throughput.'],
  ['Atomic decrement','UPDATE stock SET qty = qty - 1 WHERE sku = ? AND qty > 0. One statement, no read-modify-write race. Often the best answer.'],
  ['Oversell','Selling more than you have. Sometimes tolerated (airlines) and sometimes catastrophic (concert seats).'],
  ['Saga','Reserve inventory, charge payment, confirm order — with compensations at each step.'],
  ['Idempotency','The order-placement endpoint must be idempotent, or a double-click creates two orders.']
 ],
 decisions:[
  ['Concurrency control','optimistic · pessimistic · atomic decrement','Atomic conditional decrement for simple stock. Pessimistic for specific named units (seat 14A) where you must hold identity. Optimistic when contention is genuinely low.'],
  ['Hold expiry','Background sweeper · lazy check on read · TTL in the store','Lazy check plus a background sweeper. A sweeper alone leaves a window where expired holds still block sales.'],
  ['Order state','Status column · state machine + event log','Explicit state machine (created, reserved, paid, confirmed, shipped, cancelled) with allowed transitions. Interviewers probe illegal transitions.'],
  ['Cross-service consistency','2PC · saga','Saga with compensations: release inventory if payment fails, refund if fulfilment fails.']
 ],
 cross:[
  ['Two customers buy the last item simultaneously.','Atomic conditional decrement — UPDATE ... WHERE qty > 0. Exactly one update affects a row; the other gets zero rows affected and a clean out-of-stock response. Never SELECT then UPDATE.'],
  ['Payment fails after you reserved the seat.','The hold has a TTL and releases automatically. Additionally fire an explicit compensating release so the seat frees immediately rather than after the timeout.'],
  ['The hold expires while the user is on the payment page.','Either refuse the payment and show a clear message, or extend the hold once. Decide the policy and say it — silently taking payment for released stock is the failure everyone hits.'],
  ['A flash sale puts 50k requests/s on one SKU row.','That row is a single lock. Options: shard the stock into N buckets and decrement a random one, queue the requests and process serially, or admit users through a virtual waiting room. Say which and why.'],
  ['User double-clicks Place Order.','Idempotency key on the order request. Same key returns the same order, never a second one.'],
  ['How do you avoid overselling across three warehouses?','Either a single logical stock counter with allocation deciding the warehouse afterwards, or per-warehouse stock with the reservation naming the warehouse. Do not sum three counters and decrement one — that races.'],
  ['Is eventual consistency ever OK for inventory?','For DISPLAY, yes — "only 3 left" can be slightly stale. For the reservation itself, no. Separating those two is the mature answer.']
 ],
 fail:[
  'Read-then-write on stock. It is the exact race the question is testing.',
  'No answer for what happens when payment fails after the hold.',
  'Ignoring the hot-SKU case and only discussing aggregate QPS.'
 ]},

{n:13, wk:13, tier:'b', t:'Search, typeahead & notifications', anchor:'Elasticsearch inverted index · Google suggest',
 who:'Amazon (search suggestions is a favourite) · Adobe · Microsoft',
 asked:[
  'Design search autocomplete / typeahead.',
  'Design product search for an e-commerce site.',
  'Design a notification service (email, push, SMS).',
  'How do you rank suggestions, and how do you update the ranking?'
 ],
 clarify:[
  'Typeahead latency budget? (under 100ms or it feels broken)',
  'Personalised suggestions, or global?',
  'How fresh must the index be — instant, or minutes?',
  'For notifications: what are the user preference and quiet-hours rules?'
 ],
 scale:'Typeahead fires on every keystroke: 10M searches/day x 20 keystrokes = 200M requests/day ≈ 2.3k QPS average, far higher at peak. Debounce on the client and cache aggressively — most prefixes repeat.',
 terms:[
  ['Inverted index','term to list of document ids. The core structure of every search engine.'],
  ['Trie / prefix tree','Prefix to completions, with the top-k precomputed on each node.'],
  ['Top-k on node','Store the best k completions at each trie node so a lookup is O(prefix), not a subtree walk.'],
  ['Debounce','Client waits ~150ms of no typing before firing. Cuts request volume enormously.'],
  ['TF-IDF / BM25','Relevance scoring. Know the name and roughly what it does; you will not implement it.'],
  ['Index freshness','The lag between a write and it becoming searchable. Near-real-time is usually minutes, not milliseconds.'],
  ['Fan-out (notifications)','One event to many channels and many users, with per-user preferences.'],
  ['Deduplication','Collapsing 50 "someone liked your post" into one digest. A product requirement that shapes the architecture.'],
  ['Quiet hours / throttling','Per-user rules about when and how often you may notify.']
 ],
 decisions:[
  ['Typeahead structure','Trie with top-k · prefix range query on a sorted store · Elasticsearch completion suggester','Trie with precomputed top-k for latency. Say that rebuilding it is a batch job, which is why suggestions lag reality by minutes.'],
  ['Index updates','Real-time · near-real-time batch','Near-real-time. Full rebuild nightly, incremental updates every few minutes. Instant indexing is expensive and rarely required.'],
  ['Notification delivery','Synchronous · queued','Queued, always. One queue per channel so a slow SMS provider does not block email.'],
  ['Notification dedup','','Aggregate in a window before sending. This is a product decision with an architectural consequence — say both.']
 ],
 cross:[
  ['How do you keep typeahead under 100ms?','Precomputed top-k per prefix node, held in memory, plus an edge cache. The query does no ranking at request time — all ranking happened offline.'],
  ['A new trending term appears. How long until it suggests?','However often you rebuild. Say the number. If it must be instant, maintain a small real-time overlay index merged at query time with the batch index.'],
  ['How do you personalise without recomputing per user?','Retrieve a global candidate set, then re-rank the top ~20 with user signals at request time. Never personalise retrieval itself.'],
  ['The SMS provider is down and the queue is filling.','Circuit breaker on that channel, DLQ for failures, and fall back to another channel if the notification is important. Separate queues per channel are what make this containable.'],
  ['A user gets 200 notifications in a minute.','Aggregation window plus per-user rate limits plus quiet hours. Also an unsubscribe path — a notification system without one is a product bug.'],
  ['How do you handle typos?','Edit-distance matching on the index, or a separate spell-correction pass. Fuzzy matching in the trie explodes the search space, so it is usually a second lookup, not the main path.']
 ],
 fail:[
  'Doing ranking at query time and blowing the latency budget.',
  'One queue for all notification channels.',
  'No user preference or throttling model — the interviewer will ask about spam.'
 ]},

{n:14, wk:14, tier:'c', t:'Uber ride matching & geo indexing', anchor:'Uber H3 hexagonal grid · Google S2',
 who:'UBER. Also Lyft, DoorDash, Swiggy, Zomato-style loops.',
 asked:[
  'Design Uber / Lyft.',
  'Find all drivers within 2km of this rider.',
  'How do you handle 1M drivers updating their location every 4 seconds?',
  'Design food delivery dispatch.'
 ],
 clarify:[
  'How often do drivers report location? (this dominates write volume)',
  'Matching by distance only, or ETA, rating, surge?',
  'How large is the search radius, and does it expand on failure?',
  'Is a driver allowed to decline? (that turns matching into an offer loop)'
 ],
 scale:'1M active drivers reporting every 4s = 250k writes/s of pure location churn. That number is the reason you do NOT put live location in your primary database — it goes to an in-memory geo store with a short TTL.',
 terms:[
  ['Geohash','Interleave lat/long bits into a string; shared prefix means nearby. Simple, with edge-case pain at cell boundaries.'],
  ['Quadtree','Recursively subdivided grid, adapts to density. Good for uneven distributions like cities vs countryside.'],
  ['S2','Google’s sphere-to-cell library. Hilbert-curve ordering, well-behaved cells.'],
  ['H3','Uber’s hexagonal grid. Hexagons have uniform neighbour distance — no diagonal problem. The one to name in an Uber interview.'],
  ['Cell / bucket','A region id. Nearby search means "my cell plus its neighbours", not a distance scan.'],
  ['Boundary problem','The nearest driver may be in an adjacent cell. Always query neighbours too.'],
  ['Supply/demand','Drivers vs riders per cell over time. Drives surge and repositioning.'],
  ['Dispatch/offer loop','Offer to a driver, wait for accept, time out, offer to the next. Matching is a sequence, not one decision.'],
  ['ETA vs distance','Straight-line distance is wrong across a river. Real matching uses road-network ETA.']
 ],
 decisions:[
  ['Geo index','geohash · quadtree · S2 · H3','H3 for an Uber interview and say why: uniform hexagon neighbours, no diagonal distortion. Geohash is fine as the simple answer if you name the boundary problem.'],
  ['Location storage','Primary DB · in-memory geo store','In-memory (Redis geo / a dedicated service) with a TTL. Location is high-churn, low-value, and disposable — persisting every ping is a mistake.'],
  ['Matching','Nearest · ETA-based · batched optimisation','Start with nearest-by-ETA within an expanding radius. Mention batch matching (matching several riders and drivers together every few seconds) as the optimisation — it beats greedy per-request matching.'],
  ['Consistency','','Two riders must never be matched to the same driver. That single assignment needs a lock or an atomic state transition on the driver record — this is the correctness core.']
 ],
 cross:[
  ['Why not just SELECT ... WHERE distance < 2km?','A full scan over a million rows per request. Geo indexing turns it into a lookup of a handful of cells.'],
  ['The nearest driver is just over the cell boundary.','Query the cell and all its neighbours, then filter by true distance. Hexagons make this cleaner — six equidistant neighbours instead of eight at two different distances.'],
  ['250k location writes per second. Where do they go?','Not the primary DB. In-memory geo store keyed by driver, TTL a few minutes, no durability. If you need history, sample it and stream it to cold storage separately.'],
  ['Two riders get matched to the same driver.','The assignment must be an atomic state transition on the driver — compare-and-set from AVAILABLE to ASSIGNED. Whoever loses re-enters matching.'],
  ['The driver does not respond to the offer.','Timeout (say 15s), release, offer to the next candidate. Track decline rates — this is the offer loop and it is where the product actually lives.'],
  ['Surge pricing — how do you compute it?','Supply/demand ratio per cell over a rolling window, smoothed to avoid flapping. Say "smoothed" — instant surge changes are a bad user experience and interviewers know it.'],
  ['A whole city’s drivers go offline (network outage).','TTLs expire and they vanish from the index, which is correct behaviour. Riders see no availability; you need a degraded-mode message rather than an infinite spinner.']
 ],
 fail:[
  'Proposing a bounding-box scan.',
  'Storing every location ping durably.',
  'No answer for the double-assignment race.'
 ]},

{n:15, wk:15, tier:'c', t:'Metrics & observability at scale', anchor:'Prometheus · Facebook Gorilla time-series compression',
 who:'Uber · Apple · Amazon-senior. Also strong signal at JPM if you run production.',
 asked:[
  'Design a metrics/monitoring system.',
  'Design a distributed tracing system.',
  'How do you store a billion time series?',
  'How would you alert on this design you just built?'
 ],
 clarify:[
  'Metrics, logs, or traces? (they are three different storage problems)',
  'What retention — high resolution for how long?',
  'Query patterns: dashboards (predictable) or ad-hoc investigation?',
  'What is the cardinality of the labels? (this is the killer)'
 ],
 scale:'10k hosts x 1k metrics x 1 sample per 10s = 1M samples/s. At 16 bytes raw that is 16MB/s = 1.4TB/day. Gorilla-style delta-of-delta compression takes that to ~1.4 bytes/sample — which is why time-series databases exist instead of using Postgres.',
 terms:[
  ['Time series','A metric name plus a label set, over time. The unit of storage.'],
  ['Cardinality','The number of distinct label combinations. Adding user_id as a label is how you kill a metrics system.'],
  ['Pull vs push','Prometheus scrapes targets; StatsD receives pushes. Pull gives you a free health signal; push works behind NAT and for short-lived jobs.'],
  ['Downsampling','Keeping 10s resolution for a day, 1m for a month, 1h for a year.'],
  ['Delta-of-delta encoding','Timestamps are regular, so store the change in the change. Near-free compression.'],
  ['Span / trace','A trace is a request; a span is one operation within it. Linked by a propagated trace id.'],
  ['Sampling','Storing 1% of traces. Head-based (decide at the start) or tail-based (decide after seeing the whole trace — keeps the slow ones).'],
  ['SLO burn rate','How fast you are consuming your error budget. The correct thing to alert on.']
 ],
 decisions:[
  ['Metrics vs logs vs traces','','Metrics for "is it broken" (cheap, aggregated). Logs for "what exactly happened" (expensive, detailed). Traces for "where did the time go" (sampled). Saying this distinction cleanly is most of the round.'],
  ['Pull vs push','','Pull for long-lived services — you get target health for free. Push for batch jobs that die before a scrape.'],
  ['Storage','Relational · TSDB · columnar','Purpose-built TSDB. Say why a relational store fails: no delta compression, and the index cost per series is ruinous.'],
  ['Sampling for traces','head · tail','Tail-based if you can afford it — it keeps the slow and failed traces, which are the ones you actually want. Head-based is cheaper and throws away the interesting ones.']
 ],
 cross:[
  ['Someone adds user_id as a metric label. What happens?','Cardinality explosion — one series per user. Memory and index blow up and the system falls over. Labels must be low-cardinality; high-cardinality dimensions belong in logs or traces.'],
  ['Why is "CPU > 80%" a bad alert?','It is a cause, not a symptom, and it is often fine. Alert on user-visible symptoms and SLO burn rate; put CPU on a dashboard for diagnosis.'],
  ['You have metrics, logs and traces, and the app is slow. What first?','Metrics to confirm and localise (which service, which endpoint, p99 vs p50), traces to find where the time goes, logs last for the specific failing request. Cheapest to most expensive.'],
  ['How do you keep a year of data without keeping a year of raw samples?','Downsample in tiers and drop raw after the high-resolution window. Say the retention policy as part of the design, not an afterthought.'],
  ['A trace crosses five services and a Kafka hop. How does the id survive?','Propagate it in HTTP headers and in Kafka message headers, and make sure your async executor copies the context — this is where trace ids are usually lost.'],
  ['The monitoring system goes down. How do you know?','Dead-man’s switch: an alert that fires when the heartbeat STOPS. Monitor the monitor externally.']
 ],
 fail:[
  'Not raising cardinality unprompted — it is the defining failure of this domain.',
  'Conflating metrics and logs into one storage design.',
  'Alerting on causes instead of symptoms.'
 ]},

{n:16, wk:16, tier:'c', t:'File storage, CDN & video streaming', anchor:'Netflix Open Connect · YouTube transcoding pipeline',
 who:'Apple · Amazon · Adobe (media is their domain)',
 asked:[
  'Design Dropbox / Google Drive.',
  'Design YouTube / Netflix.',
  'Design an image upload and serving pipeline.',
  'How do you stream video to 100M concurrent viewers?'
 ],
 clarify:[
  'Upload size limits? (over ~100MB you need chunked/resumable uploads)',
  'Do we need sharing, permissions, versioning?',
  'Live streaming or video on demand? (completely different pipelines)',
  'What is the geographic distribution of viewers?'
 ],
 scale:'Video dominates everything: 1 hour of 1080p ≈ 3GB, and you store 4-6 encoded variants, so ~15GB per source hour. 500 hours uploaded per minute (YouTube scale) is why transcoding is the expensive part, not storage.',
 terms:[
  ['Object store','S3-style. Flat key to blob, cheap, durable, not a filesystem.'],
  ['Presigned URL','A time-limited signed URL letting the client upload or download directly, bypassing your servers.'],
  ['Chunked / resumable upload','Split into parts, upload independently, retry only failed parts, assemble server-side.'],
  ['Content-addressed storage','Key by hash of content. Gives you free deduplication.'],
  ['CDN / edge','Cached copies near the user. The reason video is viable at all.'],
  ['Cache hit ratio at edge','The whole economics of streaming. A 95% hit ratio means origin serves 5% of traffic.'],
  ['Transcoding','Converting the source into multiple resolutions and bitrates. CPU-expensive, done async.'],
  ['Adaptive bitrate (HLS/DASH)','Video split into segments at several bitrates; the client switches based on bandwidth.'],
  ['Manifest','The playlist file telling the client what segments exist at what bitrates.']
 ],
 decisions:[
  ['Upload path','Through your service · presigned direct-to-storage','Presigned direct upload. Never proxy large files through your application servers.'],
  ['Storage','Filesystem · object store','Object store, with metadata (owner, permissions, versions) in a database. Separating blob from metadata is the core structural decision.'],
  ['Transcoding','Sync · async pipeline','Async queue with workers. The upload returns immediately; the video becomes playable as each rendition completes.'],
  ['Delivery','Origin · CDN','CDN, with the origin only serving cache misses. For very large scale, ISP-embedded caches (what Netflix Open Connect actually is).']
 ],
 cross:[
  ['A 5GB upload fails at 90%.','Chunked resumable upload — only the failed chunk is retried. Without it, the user starts over and gives up.'],
  ['Two users upload the identical file.','Content-addressed storage: hash the content, find it exists, just add a metadata reference. This is how Dropbox dedupes.'],
  ['How does the video start playing before transcoding finishes?','Prioritise one baseline rendition, publish it, and let higher qualities appear as they complete. The manifest is updated as renditions land.'],
  ['A new video goes viral and it is not in any edge cache.','Every request misses to origin — a stampede at CDN scale. Mitigate with origin shielding (a mid-tier cache absorbing misses) and pre-warming for predictable launches.'],
  ['How do you stop someone sharing a direct link to paid content?','Signed URLs with a short expiry and, for video, per-segment tokens. Signing the manifest is not enough if the segments are publicly addressable.'],
  ['How do permissions work if the CDN serves the file?','Authorise at the point of issuing the signed URL, not at delivery. The CDN never checks permissions — the signature is the permission.'],
  ['Live streaming instead of VOD — what changes?','No pre-transcoding time, so you transcode in real time; segments are produced continuously; the manifest is a sliding window; and latency becomes the primary constraint.']
 ],
 fail:[
  'Proxying uploads and downloads through application servers.',
  'Making transcoding synchronous.',
  'Not separating blob storage from metadata storage.'
 ]}

]);

PLAN.sd = PLAN.sd.concat([

{n:17, wk:17, tier:'c', t:'Distributed transactions — saga vs 2PC', anchor:'The outbox pattern · Uber’s and Amazon’s saga usage',
 who:'Uber · Amazon-senior · JPM. The question behind every multi-service design.',
 asked:[
  'Two services both need to change state atomically. How?',
  'Design a booking flow spanning payment, inventory and notification.',
  'Why not use two-phase commit?',
  'You write to the database and publish an event. How do you make that atomic?'
 ],
 clarify:[
  'Does the user need a synchronous answer, or can this complete asynchronously?',
  'Is a compensating action actually possible? (you cannot un-send an email)',
  'What is the acceptable window of inconsistency?',
  'Who owns the overall state of the workflow?'
 ],
 scale:'Not a throughput question. The metric that matters is the inconsistency window — how long can step 2 be done while step 3 is not? Say a number (seconds, minutes) and design the reconciliation to match.',
 terms:[
  ['2PC','Prepare then commit, coordinated. Gives atomicity, holds locks across services, and the coordinator is a SPOF.'],
  ['Saga','A sequence of local transactions, each with a compensating action. Eventual consistency, no distributed locks.'],
  ['Choreography','Services react to each other’s events. No central controller; hard to see the whole flow.'],
  ['Orchestration','One coordinator drives the steps. Easier to reason about and debug; the orchestrator is a dependency.'],
  ['Compensating transaction','A business-level undo (a refund), not a database rollback.'],
  ['Outbox pattern','Write the row and the event to an outbox table in ONE local transaction; a relay publishes from the outbox.'],
  ['Dual write','Writing to two systems separately. One can fail. The bug the outbox prevents.'],
  ['Idempotent consumer','Required, because at-least-once delivery means every step can run twice.'],
  ['Semantic lock','Marking a record as "pending" so other operations know it is mid-saga.']
 ],
 decisions:[
  ['2PC vs saga','','Saga, essentially always in a service architecture. Say why: 2PC holds locks for the duration of a network call, blocks on coordinator failure, and trades availability for an atomicity you can usually get another way.'],
  ['Choreography vs orchestration','','Orchestration for anything with more than ~3 steps or that needs to be debuggable. Choreography is elegant for two services and becomes unfollowable at five.'],
  ['Publishing events','Direct publish after commit · outbox','Outbox. This is the expected answer and the interviewer is checking whether you know the dual-write problem exists.'],
  ['Failure handling','Retry forever · retry then compensate · retry then human','Retry with backoff, then compensate, then a dead-letter with alerting. Say that some failures need a human — pretending everything auto-resolves is not credible.']
 ],
 cross:[
  ['Why not just write to the DB and then publish to Kafka?','If the publish fails after the commit, the event is lost and the systems diverge silently. If you publish first and the commit fails, you have announced something that did not happen. That is the dual-write problem.'],
  ['How does the outbox relay work exactly?','A poller (or CDC on the WAL) reads unpublished outbox rows, publishes them, marks them sent. At-least-once, so consumers must be idempotent. Debezium is the CDC answer if they push.'],
  ['Step 3 of 5 fails. Walk me through it.','Compensate 2 then 1, in reverse order, each compensation idempotent and retryable. Mark the saga failed with the reason. If a compensation itself fails, retry then escalate — it does not silently disappear.'],
  ['What if you cannot compensate? You already sent the email.','Then order the steps so irreversible actions come LAST, after everything reversible has succeeded. That reordering is the design answer.'],
  ['A compensating transaction runs twice.','It must be idempotent — a refund keyed by the original transaction id, not "refund 10 more". Same discipline as the forward path.'],
  ['How do you know a saga is stuck?','Persist saga state with a timestamp and alert on anything in a non-terminal state past a threshold. Without that, stuck sagas are invisible until a customer complains.'],
  ['Is there any case for 2PC?','Within one database across tables, or across resources that support XA and where you control both and availability is not paramount. Being able to say when it IS right is what separates a real answer from a memorised one.']
 ],
 fail:[
  'Not knowing the dual-write problem.',
  'Describing a saga with no compensation for a step that cannot be undone.',
  'Choreography for a six-step flow, with no way to see the current state.'
 ]},

{n:18, wk:18, tier:'c', t:'Multi-region & disaster recovery', anchor:'AWS multi-AZ vs multi-region · bank DR requirements',
 who:'JP MORGAN · AMEX (regulatory DR requirements are real) · Apple',
 asked:[
  'Make your design multi-region.',
  'A whole region goes down. What happens?',
  'What is your RPO and RTO?',
  'How do you serve European and US users with one system?'
 ],
 clarify:[
  'Is this for latency (users near data) or for disaster recovery? (different designs)',
  'What is the acceptable data loss — zero, or a few seconds?',
  'Are there data residency rules? (GDPR means EU data may not leave)',
  'Active-active, or active-passive with failover?'
 ],
 scale:'Cross-region RTT is ~80-150ms. A synchronous cross-region write costs you that on every write. That single number decides active-active vs active-passive more than anything else.',
 terms:[
  ['RPO','Recovery point objective — how much data you may lose. Async replication means RPO > 0, always.'],
  ['RTO','Recovery time objective — how long until you are back. Manual failover means RTO is measured in people, not machines.'],
  ['Active-passive','One region serves; the other stands by. Simple, wasteful, and failover is a real event you must rehearse.'],
  ['Active-active','Both serve. No wasted capacity, and you now own conflict resolution.'],
  ['Conflict resolution','LWW · CRDT · application-level merge. Needed the moment two regions accept writes for the same data.'],
  ['Data residency','Legal requirement that data stays in a jurisdiction. Changes the sharding key to region.'],
  ['Geo-DNS / anycast','Routing users to the nearest healthy region.'],
  ['Split brain','Both regions believing they are primary during a partition.'],
  ['Failover drill','Actually practising it. An untested failover plan is a hypothesis.']
 ],
 decisions:[
  ['Active-active vs active-passive','','Active-passive unless you genuinely need write latency in both regions. Active-active means conflict resolution, and most teams underestimate that cost by an order of magnitude.'],
  ['Replication','sync · async','Async across regions — sync means every write pays 150ms. If RPO must be zero, you need synchronous quorum, and you must accept the latency. State the trade explicitly.'],
  ['Partitioning by region','','If data residency applies, region becomes part of the partition key and cross-region reads become a product decision, not a technical one.'],
  ['Failover','automatic · manual','Manual with a well-rehearsed runbook is often BETTER than automatic — automatic failover on a network blip causes split brain. Say this; it is a mature position.']
 ],
 cross:[
  ['What is your RPO with async replication?','Non-zero, equal to the replication lag at the moment of failure — typically seconds. If the business needs zero, async is off the table and you pay the latency.'],
  ['Both regions accept writes for the same user record. Then what?','Conflict. Last-write-wins loses data silently. Options: partition users to a home region so conflicts cannot occur, use CRDTs for mergeable data, or resolve in the application with business rules.'],
  ['The network between regions partitions. Both think they are primary.','Split brain. Prevented with a quorum across three locations (two regions plus a witness) so a minority cannot promote itself.'],
  ['How do you test the failover?','Scheduled game days that actually fail a region over in production. If you have never tested it, your RTO is a guess — say that plainly.'],
  ['GDPR says EU data stays in the EU. What changes?','Region becomes a partition key. Users have a home region; cross-region features either aggregate anonymously or do not exist. This is a product constraint, not just infrastructure.'],
  ['Cost of active-active?','Double the capacity, double the operational surface, plus conflict resolution engineering. Justify it with a requirement — latency or regulatory — not with "it is more resilient".'],
  ['A deploy takes down region A. Does failover help?','No — the bad code follows you. Regional failover protects against infrastructure failure, not bad releases. That is what canary and rollback are for. Making that distinction is a strong answer.']
 ],
 fail:[
  'Claiming zero RPO with async replication.',
  'Active-active with no conflict-resolution story.',
  'Never having considered that failover must be rehearsed.'
 ]},

{n:19, wk:19, tier:'c', t:'Recorded mock ×2', anchor:'',
 who:'Unseen prompt. No preparation, no notes, 45 minutes, recorded.',
 asked:[
  'Design a ride-sharing service for airports only.',
  'Design a system to detect fraudulent transactions in real time.',
  'Design a collaborative document editor.',
  'Design a leaderboard for a game with 50M players.',
  'Design an ad-click aggregation pipeline.',
  'Design a distributed cron scheduler.'
 ],
 clarify:[
  'Restate the problem in your own words before anything else.',
  'Ask about scale in the first three minutes. Every time.',
  'Get agreement on the functional scope before drawing a single box.',
  'Say your assumptions out loud and write them down.'
 ],
 scale:'Follow the framework in order. The most common mock failure is jumping to boxes and arrows before establishing requirements and estimates.',
 terms:[],
 decisions:[
  ['Pick your own deep dive','','At minute 30, choose the interesting component and go deep before they ask. Choosing well is scored — it shows judgement about where the difficulty is.']
 ],
 cross:[
  ['Watch the recording and count these','Dead-air gaps over 20 seconds · times you drew before agreeing requirements · trade-offs you asserted without naming the alternative · follow-ups you fumbled.'],
  ['Did you state peak vs average?','If not, every capacity number you gave was ambiguous.'],
  ['Did you name the alternative you rejected?','"I would use Kafka" is weak. "Kafka over SQS because we need replay and per-key ordering" is the same sentence with the signal added.'],
  ['Would you hire you?','Be honest. Then write down the one thing you would fix and drill only that before the next mock.']
 ],
 fail:[
  'Drawing before agreeing on requirements.',
  'Waiting to be asked the follow-up instead of raising it yourself.',
  'Running out of time because you spent 20 minutes on the data model.'
 ]},

{n:20, wk:20, tier:'c', t:'Recorded mock ×2', anchor:'',
 who:'Unseen prompt. Different domain from last week.',
 asked:[
  'Design a hotel booking system.',
  'Design a stock trading matching engine.',
  'Design a web crawler.',
  'Design an API gateway.',
  'Design a feature-flag service.',
  'Design a system for real-time analytics dashboards.'
 ],
 clarify:[
  'Same discipline. Restate, scope, scale, then design.',
  'For anything with money or inventory, raise idempotency and races unprompted.'
 ],
 scale:'By now the estimation should take under four minutes and feel automatic. If it does not, that is the thing to drill.',
 terms:[],
 decisions:[
  ['Deliberately practise the pushback','','Have the interviewer (or you, playing them) reject your first design choice. Practise defending it, then practise conceding gracefully and adapting. Both are scored.']
 ],
 cross:[
  ['Did you survive all six categories?','Failure · scale · consistency · cost · change · justify. Write the answers down afterwards for whichever you fumbled.'],
  ['Was your deep dive the interesting part?','If you deep-dived the part you found easy, you dodged. That is visible.']
 ],
 fail:[
  'Repeating the same architecture regardless of the problem.',
  'Not adapting when a requirement is added mid-round.'
 ]},

{n:21, wk:21, tier:'c', t:'Recorded mock ×2', anchor:'',
 who:'Unseen prompt, under fatigue — run these back-to-back with a 15-minute break.',
 asked:[
  'Design a multi-tenant SaaS billing system.',
  'Design a content moderation pipeline.',
  'Design a service that emails 50M users a daily digest.',
  'Design an online judge (like LeetCode) that runs untrusted code.',
  'Design a URL safety checker at browser scale.',
  'Design an event-sourced order system.'
 ],
 clarify:[
  'Same framework, tired. That is the point of this week.'
 ],
 scale:'Stamina test. Round 2 should be within 15% of round 1 in quality.',
 terms:[],
 decisions:[
  ['Second round is the real test','','Everyone is good in round 1. Compare the recordings and find what degrades — usually narration first, then edge cases, then complexity precision.']
 ],
 cross:[
  ['What degraded between round 1 and round 2?','Name it specifically. That is what to shore up before the real loop.']
 ],
 fail:[
  'Treating the second round as optional. It is the one that predicts your real onsite.'
 ]},

{n:22, wk:22, tier:'c', t:'Final mock + rebuild the vocabulary from memory', anchor:'',
 who:'You, alone, with a blank page.',
 asked:[
  'Reproduce the requirement→building-block table from memory.',
  'Reproduce the six cross-question categories and one example of each.',
  'Reproduce the latency numbers and the estimation anchors.',
  'One final recorded mock on an unseen prompt.'
 ],
 clarify:[
  'No notes. What you cannot reproduce is what you have not learned.'
 ],
 scale:'Target: 85% of the trigger table reproduced from memory.',
 terms:[],
 decisions:[
  ['What to do with the gaps','','Whatever you could not reproduce goes on a physical index card you carry and review daily until the loop. Do not try to re-learn it from scratch this late.']
 ],
 cross:[
  ['Can you name the building block for every requirement phrase?','If yes, you have the vocabulary. If no, drill only the misses — not the whole table.']
 ],
 fail:[
  'Learning something new on the last day. Consolidate; do not expand.'
 ]}

]);

/* ================================================================== LLD === */

/* ================================================================== LLD ===
   Three different rounds wear this name. Getting the flavour wrong is how
   people lose it before they write a line.

   Reference blocks first, then problems. Per problem:
     asked        how the interviewer poses it, and the variants
     who          who asks it
     clarify      what you pin down before drawing anything
     entities     [name, kind, note] - the class list you put on the board
     patterns     [pattern, exactly where it applies]
     code         [title, [lines], why it matters]
     concurrency  [the race, how you close it]  <- the Amazon differentiator
     extend       [the "now add X" follow-up, how you answer]
     cross        [the question, the answer spine]
     fail         what actually sinks candidates                            */

PLAN.lldFlavours = [
  ['Whiteboard OOD','Amazon · Adobe · Microsoft · JPM','45–60 min, class diagram plus key methods','Entities, relationships, extensibility. SOLID applied, never recited. You are scored on whether a new requirement slots in without rewriting.'],
  ['Machine coding','Uber · Flipkart · Swiggy','60–90 min, RUNNABLE and TESTED code','FINISHING. An unfinished elegant design scores below a finished plain one. Ship a working skeleton in 20 minutes, then enrich.'],
  ['Amazon hybrid','Amazon','60 min: design PLUS working code PLUS an algorithmic core','Doing all three under one clock. Most candidates over-invest in the diagram and never run the code.']
];

PLAN.lldScript = [
  ['0:00–5:00','Clarify and scope','Restate. Ask 4–6 questions. Write the scope on the board and get explicit agreement: "so we are building X and Y, not Z — agreed?" Scope creep later is then their choice, not your failure.'],
  ['5:00–12:00','Entities and relationships','Nouns become classes, verbs become methods. Draw cardinality on every line (1..*, 0..1). Enums for closed sets. Say "I am deliberately keeping this in memory."'],
  ['12:00–20:00','Interfaces and the extension axes','Name the things that will change — pricing, scheduling, notification channel — and put an interface on each. This is where the round is actually won.'],
  ['20:00–40:00','Implement the core','Not every class. The one flow that proves the design: park a vehicle, book a seat, dispense an item. Real method bodies, not pseudocode.'],
  ['40:00–50:00','Concurrency and edge cases','Say where two users collide and how you resolve it, before being asked. This is the single biggest separator at Amazon.'],
  ['50:00–60:00','Show one extension','"Here is how a new vehicle type slots in — one enum value and one strategy, no existing class changes." The highest-scoring thirty seconds of the round.']
];

PLAN.lldPatterns = [
  ['"support multiple algorithms for X, swappable"','Strategy','Parking pricing, elevator scheduling, ride matching, payment methods, notification channel'],
  ['"create objects without naming the concrete class"','Factory / Abstract Factory','Vehicle types, chess pieces, notification senders, document parsers'],
  ['"notify N things when this changes"','Observer','Bidding, order status, stock ticker, elevator display panels'],
  ['"behaves differently depending on its mode"','State — NOT a switch over an enum','Vending machine, ATM, elevator, order lifecycle, chess game phase'],
  ['"undo / redo / a queue of operations"','Command','Chess moves, text editor, job scheduler, remote control'],
  ['"add behaviour without a subclass explosion"','Decorator','Pizza toppings, coffee add-ons, middleware, discount stacking'],
  ['"lots of optional constructor parameters"','Builder','Complex config, pizza order, HTTP request objects'],
  ['"exactly one of these, globally"','Singleton — and say when it is a mistake','Config, connection pool, id generator. Usually dependency injection is better and more testable.'],
  ['"two users grab the same resource"','Optimistic vs pessimistic locking — say WHICH and WHY','Booking a seat, claiming a parking spot, decrementing inventory'],
  ['"make it extensible"','Depend on an interface, not a concrete class','Every LLD round, always'],
  ['"the object is expensive to create"','Object pool / Flyweight','Connections, threads, game sprites, chess piece images'],
  ['"one simple interface over several subsystems"','Facade','A service layer over repositories, an order facade over payment plus inventory plus shipping'],
  ['"walk a structure without knowing its concrete types"','Visitor','Tax calculation over item types, AST evaluation'],
  ['"a chain of handlers, first one that can, handles it"','Chain of Responsibility','ATM note dispensing, approval workflows, middleware, logging levels'],
  ['"wrap an incompatible interface"','Adapter','Third-party payment gateway, legacy service']
];

PLAN.lldSolid = [
  ['S','Single responsibility','A class that both computes a total AND writes it to the database.',
   ['// VIOLATION',
    'class Order {',
    '    BigDecimal total() { ... }',
    '    void saveToDb(Connection c) { ... }   // second reason to change',
    '    String toJson() { ... }               // third',
    '}',
    '',
    '// FIX - one reason to change each',
    'class Order            { BigDecimal total() { ... } }',
    'class OrderRepository  { void save(Order o) { ... } }',
    'class OrderSerializer  { String toJson(Order o) { ... } }']],
  ['O','Open/closed','A switch you must edit every time a new type appears.',
   ['// VIOLATION - every new vehicle edits this method',
    'BigDecimal fee(Vehicle v, Duration d) {',
    '    switch (v.type()) {',
    '        case CAR:  return d.toHours() * 20;',
    '        case BIKE: return d.toHours() * 10;',
    '    }',
    '}',
    '',
    '// FIX - open for extension, closed for modification',
    'interface PricingStrategy { BigDecimal fee(Duration d); }',
    'class CarPricing  implements PricingStrategy { ... }',
    'class BikePricing implements PricingStrategy { ... }',
    '// new vehicle type = one new class, zero edits']],
  ['L','Liskov substitution','A subclass that throws on a method it inherited.',
   ['// VIOLATION',
    'class Bird { void fly() { ... } }',
    'class Penguin extends Bird {',
    '    void fly() { throw new UnsupportedOperationException(); }  // breaks callers',
    '}',
    '',
    '// FIX - model the capability, not the taxonomy',
    'interface Bird {}',
    'interface Flying { void fly(); }',
    'class Sparrow implements Bird, Flying { ... }',
    'class Penguin implements Bird { ... }']],
  ['I','Interface segregation','A fat interface forcing empty implementations.',
   ['// VIOLATION',
    'interface Worker { void work(); void eat(); }',
    'class Robot implements Worker {',
    '    public void work() { ... }',
    '    public void eat()  { }        // meaningless, forced to exist',
    '}',
    '',
    '// FIX',
    'interface Workable { void work(); }',
    'interface Feedable { void eat(); }',
    'class Robot implements Workable { ... }']],
  ['D','Dependency inversion','new ConcreteThing() buried inside business logic.',
   ['// VIOLATION - untestable, cannot swap',
    'class OrderService {',
    '    private final MySqlOrderRepo repo = new MySqlOrderRepo();',
    '}',
    '',
    '// FIX - depend on the abstraction, inject the concrete',
    'class OrderService {',
    '    private final OrderRepository repo;',
    '    OrderService(OrderRepository repo) { this.repo = repo; }',
    '}']]
];

PLAN.lldConcurrency = [
  ['Two users claim the same seat / spot / last item',
   'An atomic conditional transition, not read-then-write. In memory: AtomicReference.compareAndSet or a synchronized block on the specific resource. In a database: UPDATE ... WHERE status = AVAILABLE, and check rows-affected. Whoever gets zero rows loses cleanly.'],
  ['A hold expires while the user is paying',
   'Reservation with a TTL, plus a decision you must state: refuse the payment, or extend the hold once. Silently taking payment for released stock is the failure everyone ships.'],
  ['Two threads read a balance, both compute, both write',
   'Lost update. Fix with an atomic operation (balance.addAndGet), a version field with retry, or a lock scoped to the account.'],
  ['Locking the whole system to make one thing safe',
   'A single global lock is correct and useless. Lock per resource - per spot, per seat, per account - so unrelated operations do not serialise. Interviewers probe this the moment you write synchronized on a method.'],
  ['Two locks taken in opposite order',
   'Deadlock. Impose a global ordering (always lock the lower id first), or use tryLock with a timeout and retry.'],
  ['A collection mutated while another thread iterates it',
   'ConcurrentModificationException. Use ConcurrentHashMap, CopyOnWriteArrayList for read-heavy, or copy before iterating.'],
  ['Optimistic vs pessimistic — how to choose out loud',
   'Low contention and cheap retry: optimistic (version check, retry). High contention on a specific named unit like seat 14A: pessimistic (lock the row). Say the contention assumption you are making — that is the scored part.']
];

PLAN.lldChecklist = [
  ['Nouns to classes, verbs to methods','Extract them from the requirements out loud so the interviewer sees the derivation.'],
  ['Enums for every closed set','VehicleType, SpotSize, OrderStatus, Direction. Never magic strings.'],
  ['Cardinality on every relationship','A Lot has 1..* Floors; a Floor has 1..* Spots; a Spot has 0..1 Ticket. Draw it.'],
  ['An interface on every axis of change','Pricing, allocation, scheduling, notification. One interface per axis, not fifteen.'],
  ['Immutable value objects','Money, TimeSlot, Coordinates. Records are ideal. Prevents a whole class of bugs.'],
  ['A single entry-point facade','ParkingLotService, BookingService. The interviewer should see one obvious place to start reading.'],
  ['No database, no framework','In-memory collections unless asked. Say "in-memory for now, the repository interface is the seam."'],
  ['Say what you are NOT building','Auth, persistence, UI. Naming the exclusions shows judgement rather than omission.']
];

PLAN.lldRules = [
  'Ship a working skeleton in the first 20 minutes, then enrich. Never design for 60 and code for 30.',
  'In-memory only unless asked. No database, no framework, no build tooling.',
  'Write main() with a demo run early - it proves it works and prevents you being unfinished.',
  'Two or three tests beat ten. Add them as you go, not at the end.',
  'One interface per axis of change. Do not create fifteen.',
  'Say your assumptions out loud and write them as comments.',
  'When you run out of time, say what you would do next and why. A stated plan scores; silence does not.'
];

PLAN.lldFramework = 'clarify requirements → identify entities → relationships and cardinality → define interfaces on the axes of change → implement the core flow → state the concurrency story → SHOW ONE EXTENSION. That last step is the highest-scoring thirty seconds of the round.';

/* ============================================================= PROBLEMS === */

PLAN.lldProblems = [

{id:'parking', name:'Parking Lot', tier:'b', flavour:'OOD', mins:45,
 who:'Amazon · Microsoft · Adobe · JPM. The most-asked LLD problem there is.',
 asked:[
  'Design a parking lot.',
  'Design a multi-floor parking system with different vehicle sizes and pricing.',
  'How do you allocate the nearest available spot?',
  'Two cars arrive at the same instant and one spot is left. What happens?'
 ],
 clarify:[
  'How many floors, and are spot sizes fixed per floor?',
  'Vehicle types — bike, car, truck? Can a car take a truck spot?',
  'Pricing: flat hourly, or per vehicle type, or slab-based?',
  'Do we need entry and exit gates as first-class objects, or just park/unpark?',
  'Payment: cash, card, both? Is payment in scope at all?'
 ],
 entities:[
  ['ParkingLot','class','The facade. Holds floors, exposes park() and unpark().'],
  ['ParkingFloor','class','Holds spots, knows its own availability counts per size.'],
  ['ParkingSpot','class','id, size, occupied flag, current vehicle. The unit of contention.'],
  ['Vehicle','abstract class','licensePlate, VehicleType. Car / Bike / Truck extend it.'],
  ['VehicleType','enum','BIKE, CAR, TRUCK — with the spot sizes each may occupy.'],
  ['SpotSize','enum','SMALL, MEDIUM, LARGE.'],
  ['Ticket','class','id, spot, vehicle, entryTime, exitTime. Immutable except exit.'],
  ['PricingStrategy','interface','fee(Ticket) — the first axis of change.'],
  ['SpotAllocationStrategy','interface','findSpot(VehicleType) — nearest, first-free, per-floor.'],
  ['PaymentProcessor','interface','Optional. Say if you are excluding it.']
 ],
 patterns:[
  ['Strategy','PricingStrategy and SpotAllocationStrategy — the two things that always change.'],
  ['Factory','VehicleFactory creating Car/Bike/Truck from a type, so callers never name concretes.'],
  ['Singleton','ParkingLot itself, arguably. Say out loud that injection is usually better and more testable.'],
  ['Observer','Optional: display boards subscribing to availability changes.']
 ],
 code:[
  ['The extension axis that wins the round',
   ['public interface PricingStrategy {',
    '    BigDecimal fee(Ticket ticket);',
    '}',
    '',
    'public class HourlyPricing implements PricingStrategy {',
    '    private final Map<VehicleType, BigDecimal> ratePerHour;',
    '    public BigDecimal fee(Ticket t) {',
    '        long hours = Math.max(1, Duration.between(t.entry(), t.exit()).toHours());',
    '        return ratePerHour.get(t.vehicle().type()).multiply(BigDecimal.valueOf(hours));',
    '    }',
    '}',
    '',
    '// weekend pricing, EV discount, first-hour-free: a new class, zero edits'],
   'When they say "now add weekend pricing", you add one class. If pricing were a switch inside ParkingLot, you would be editing the core class - which is the Open/Closed violation they are testing for.'],
  ['Allocation without a race',
   ['public class ParkingLot {',
    '    private final SpotAllocationStrategy allocator;',
    '',
    '    public Optional<Ticket> park(Vehicle v) {',
    '        for (ParkingSpot spot : allocator.candidates(v.type())) {',
    '            if (spot.tryOccupy(v)) {                 // atomic - see below',
    '                return Optional.of(new Ticket(spot, v, Instant.now()));',
    '            }',
    '        }',
    '        return Optional.empty();                     // lot full',
    '    }',
    '}',
    '',
    'public class ParkingSpot {',
    '    private final AtomicReference<Vehicle> occupant = new AtomicReference<>();',
    '',
    '    public boolean tryOccupy(Vehicle v) {',
    '        return occupant.compareAndSet(null, v);      // exactly one winner',
    '    }',
    '    public void release() { occupant.set(null); }',
    '}'],
   'Note there is NO global lock. Contention is per spot, so two cars heading for different spots never block each other. compareAndSet means the loser simply tries the next candidate instead of failing the request.']
 ],
 concurrency:[
  ['Two cars, one remaining spot','compareAndSet on the spot. One wins; the loser continues the loop to the next candidate, and only reports "full" after exhausting all of them.'],
  ['synchronized on park() — why it is wrong','It is correct and it serialises the entire lot. A thousand-spot lot would process one car at a time. Lock the spot, not the lot.'],
  ['Availability counters drifting','If you cache a per-floor free count, it must be updated atomically with occupation, or use an AtomicInteger and accept that reads are a hint, not a guarantee.']
 ],
 extend:[
  ['"Now add electric vehicles with charging spots"','A new SpotSize or a Boolean capability on the spot, a new VehicleType, and an allocation strategy that prefers charging spots for EVs. No existing class changes.'],
  ['"Now support monthly pass holders"','A new PricingStrategy returning zero, plus a reserved-spot allocation strategy. Say this out loud — it demonstrates the design holds.'],
  ['"Now make it multi-lot across a city"','ParkingLot becomes one node; add a LotDirectory keyed by location. The spot-level locking still holds because contention is local.'],
  ['"Show me the display board at the entrance"','Observer: the board subscribes to spot occupation events. Do not have the board poll.']
 ],
 cross:[
  ['Why an interface for pricing rather than a method?','Because pricing is the requirement most likely to change, and it changes for reasons unrelated to parking. Separating it means a pricing change never risks the allocation code.'],
  ['How do you find the NEAREST spot?','That is the allocation strategy. Keep a per-floor sorted structure or a priority queue keyed by distance from the entrance. Swapping to "first free" is then a one-line change.'],
  ['What if the ticket is lost?','A business rule, not a design problem — flat penalty fee, look up by licence plate. Say that you would confirm the rule rather than invent it.'],
  ['Where would this break at scale?','The in-memory spot map. In a real system the spot state lives in a database and tryOccupy becomes UPDATE ... WHERE occupied = false, checking rows-affected. The design shape is identical; only the atomic primitive changes.'],
  ['Would you use a Singleton for ParkingLot?','I would inject it instead. Singleton makes testing painful and hides the dependency. If they push, implement it — but state the trade-off.']
 ],
 fail:[
  'A switch over vehicle type inside the pricing method. This is the exact Open/Closed violation being tested.',
  'synchronized on the whole park() method.',
  'Forgetting the "lot is full" path entirely.',
  'Modelling Ticket as mutable everywhere, so the entry time can be changed after the fact.',
  'Spending 30 minutes on class diagrams and never writing an allocation method.'
 ]},

{id:'elevator', name:'Elevator System', tier:'b', flavour:'OOD', mins:50,
 who:'Amazon · Microsoft · Adobe. The scheduling discussion is the whole round.',
 asked:[
  'Design an elevator system.',
  'Design elevators for a 50-floor building with 4 cars.',
  'Someone presses 5 while the lift is going up from 2 to 8. What happens?',
  'How would you change the scheduling algorithm without touching the elevator class?'
 ],
 clarify:[
  'How many elevators and how many floors?',
  'Are there external (floor) and internal (car) buttons? They behave differently.',
  'Any special modes — express, service, fire?',
  'Optimising for average wait time, or for throughput?',
  'Do we simulate time, or is this event-driven?'
 ],
 entities:[
  ['ElevatorSystem','class','The facade. Receives requests, delegates to the dispatcher.'],
  ['Elevator (Car)','class','id, currentFloor, Direction, State, the set of target floors.'],
  ['Direction','enum','UP, DOWN, IDLE.'],
  ['ElevatorState','interface','Moving / Stopped / DoorsOpen / Maintenance — the State pattern.'],
  ['Request','class','sourceFloor, destinationFloor, direction, timestamp.'],
  ['ExternalRequest / InternalRequest','class','Hall call versus car call. Different routing rules.'],
  ['SchedulingStrategy','interface','chooseElevator(Request, List<Elevator>) — the axis of change.'],
  ['Door','class','Optional but shows care: open, close, obstruction.'],
  ['DisplayPanel','class','Observer on elevator state.']
 ],
 patterns:[
  ['Strategy','SchedulingStrategy — FCFS, nearest-car, SCAN/LOOK. The interviewer will ask you to swap it.'],
  ['State','Elevator behaviour differs by state. Moving ignores door-open; DoorsOpen ignores movement. A switch over an enum is the wrong answer here.'],
  ['Observer','Display panels and floor indicators subscribe to elevator movement.'],
  ['Command','Optional: requests as command objects, queued and cancellable.']
 ],
 code:[
  ['State, not a switch over an enum',
   ['public interface ElevatorState {',
    '    void openDoors(Elevator e);',
    '    void move(Elevator e);',
    '    default String name() { return getClass().getSimpleName(); }',
    '}',
    '',
    'public class MovingState implements ElevatorState {',
    '    public void openDoors(Elevator e) {',
    '        throw new IllegalStateException("cannot open doors while moving");',
    '    }',
    '    public void move(Elevator e) { e.stepTowardsNextTarget(); }',
    '}',
    '',
    'public class DoorsOpenState implements ElevatorState {',
    '    public void openDoors(Elevator e) { /* already open, no-op */ }',
    '    public void move(Elevator e) { e.setState(new MovingState()); e.stepTowardsNextTarget(); }',
    '}'],
   'Illegal transitions become impossible by construction rather than by an if-check someone forgets. When they ask "what if the doors are told to open mid-travel", the answer is already in the type system.'],
  ['The SCAN scheduler — keep going, serve on the way',
   ['public class LookScheduling implements SchedulingStrategy {',
    '',
    '    public Elevator choose(Request r, List<Elevator> cars) {',
    '        return cars.stream()',
    '            .filter(e -> e.canServe(r))          // moving toward r, or idle',
    '            .min(Comparator.comparingInt(e -> Math.abs(e.currentFloor() - r.source())))',
    '            .orElse(leastBusy(cars));',
    '    }',
    '}',
    '',
    '// inside Elevator',
    'public boolean canServe(Request r) {',
    '    if (direction == IDLE) return true;',
    '    if (direction == UP)   return r.source() >= currentFloor && r.direction() == UP;',
    '    return r.source() <= currentFloor && r.direction() == DOWN;',
    '}'],
   'canServe is where the "press 5 while going 2 to 8" question is answered: the request is on the path and in the same direction, so it is absorbed into the current sweep rather than queued for later.']
 ],
 concurrency:[
  ['Two floors call simultaneously','The dispatcher is the single point of assignment. Make choose-and-assign atomic (synchronized on the dispatcher, or a single-threaded request queue) so one elevator is not double-assigned.'],
  ['Request arrives while the elevator is mid-move','Target floors live in a thread-safe sorted set. Adding a floor already on the path is idempotent.'],
  ['The event loop','A common clean answer: one thread per elevator consuming from a BlockingQueue of commands. Say it — it removes most locking questions at a stroke.']
 ],
 extend:[
  ['"Now optimise for average wait instead of throughput"','A different SchedulingStrategy. The Elevator and Request classes do not change. That is the payoff of putting scheduling behind an interface.'],
  ['"Add an express elevator serving only floors above 30"','A capability on the elevator plus a filter in canServe. No change to the dispatcher.'],
  ['"Fire mode: all cars to the ground floor and stop"','A new state, plus a system-level mode that overrides the scheduler. Show it as a state transition, not a boolean flag.'],
  ['"How would you test this?"','Simulate time with an injected clock and step the system tick by tick. Saying that you would inject the clock is a strong signal.']
 ],
 cross:[
  ['Why State rather than an if/switch on a status field?','Because the number of illegal transitions grows quadratically with states, and each one becomes a forgotten if. With State the compiler and the object structure carry the rules.'],
  ['Press 5 while going from 2 to 8 — walk me through it.','5 is above the current floor and the direction matches, so canServe is true. Insert 5 into the sorted target set; the sweep stops there naturally on the way to 8.'],
  ['What if someone presses down on floor 5 while the car is going up?','It is not absorbed into this sweep. It stays in the pending pool and is served on the downward pass, or assigned to another car. Say why: absorbing it would make an upward passenger travel down.'],
  ['How do you avoid starvation on a busy building?','Age the requests — after a threshold, promote a waiting request so a sweep must serve it. Mention it unprompted; it shows you thought past the happy path.'],
  ['Four elevators, one request. How do you pick?','That is the strategy. Nearest suitable car by default; the real answer names the objective — minimising wait versus minimising total travel — and says they give different algorithms.']
 ],
 fail:[
  'A switch over an ElevatorStatus enum instead of the State pattern.',
  'Hard-coding the scheduling algorithm inside Elevator.',
  'Not distinguishing external (hall) from internal (car) requests.',
  'No answer for direction-mismatched requests.',
  'Ignoring starvation entirely.'
 ]},

{id:'vending', name:'Vending Machine', tier:'b', flavour:'OOD', mins:40,
 who:'Amazon · Adobe · Microsoft. The canonical State-pattern question.',
 asked:[
  'Design a vending machine.',
  'Design a vending machine that handles coins, refunds and out-of-stock.',
  'The user presses the button before inserting money. What happens?',
  'How do you dispense the right change?'
 ],
 clarify:[
  'Cash only, or card as well?',
  'Do we need to return change, and with which denominations?',
  'What happens on a mid-transaction cancel?',
  'Can the machine be restocked while a transaction is in flight?'
 ],
 entities:[
  ['VendingMachine','class','Context object. Holds current state, inventory, and inserted amount.'],
  ['VendingState','interface','idle / hasMoney / dispensing / outOfService. The State pattern.'],
  ['Inventory','class','Map<Slot, ItemStack>. Knows counts, not prices.'],
  ['Item','class','code, name, price.'],
  ['Slot','class','A physical position holding one item type.'],
  ['Coin / Note','enum','Denominations, with values. Enums make change-making trivial.'],
  ['CashRegister','class','Tracks denominations available for change.'],
  ['ChangeStrategy','interface','makeChange(amount) — greedy or exact-DP.']
 ],
 patterns:[
  ['State','THE point of this problem. IdleState, HasMoneyState, DispensingState, OutOfServiceState.'],
  ['Strategy','ChangeStrategy — greedy by default, exact-change DP if they push.'],
  ['Singleton','The machine itself, arguably.'],
  ['Command','Optional: each user action as a command, giving you a transaction log for free.']
 ],
 code:[
  ['State handles what is legal, not the machine',
   ['public interface VendingState {',
    '    void insertCoin(VendingMachine m, Coin c);',
    '    void selectItem(VendingMachine m, String code);',
    '    void dispense(VendingMachine m);',
    '    void cancel(VendingMachine m);',
    '}',
    '',
    'public class IdleState implements VendingState {',
    '    public void insertCoin(VendingMachine m, Coin c) {',
    '        m.addToBalance(c.value());',
    '        m.setState(new HasMoneyState());',
    '    }',
    '    public void selectItem(VendingMachine m, String code) {',
    '        throw new IllegalStateException("insert money first");   // the classic question',
    '    }',
    '    public void dispense(VendingMachine m) { throw new IllegalStateException("nothing selected"); }',
    '    public void cancel(VendingMachine m)   { /* nothing to refund */ }',
    '}'],
   '"The user presses the button before inserting money" is answered by the state, not by a guard clause scattered through the machine. Every state implements all four actions, so no transition is accidentally unhandled.'],
  ['Change-making, and being honest about greedy',
   ['public class GreedyChange implements ChangeStrategy {',
    '    public Optional<List<Coin>> make(int amount, Map<Coin,Integer> available) {',
    '        List<Coin> out = new ArrayList<>();',
    '        for (Coin c : Coin.descending()) {',
    '            while (amount >= c.value() && available.get(c) > 0) {',
    '                out.add(c); amount -= c.value();',
    '                available.merge(c, -1, Integer::sum);',
    '            }',
    '        }',
    '        return amount == 0 ? Optional.of(out) : Optional.empty();  // cannot make change',
    '    }',
    '}'],
   'Greedy is correct for canonical currency systems and WRONG in general - with coins {1, 3, 4} making 6 greedily gives 4+1+1 instead of 3+3. Saying that unprompted, and noting the DP alternative, is a genuine differentiator on this question.']
 ],
 concurrency:[
  ['Two users on one machine','Physically impossible, so say so — but if they push, the machine is a single-threaded state machine and actions are serialised through one queue.'],
  ['Restocking during a transaction','Inventory updates must be atomic against the dispense check. A synchronized inventory or a ConcurrentHashMap with atomic decrement.'],
  ['Dispense succeeds, change fails','Decide the policy: refuse the sale up front if change cannot be made. Checking change availability BEFORE dispensing is the correct order and interviewers look for it.']
 ],
 extend:[
  ['"Add card payment"','A PaymentMethod interface with Cash and Card implementations. The states stay the same; only how balance is credited changes.'],
  ['"Machine runs out of change"','A pre-check before accepting a selection, plus an exact-change-only mode as a state or a flag on the machine.'],
  ['"Add a maintenance mode"','A new state. It rejects every user action and allows restocking. That is the whole change.'],
  ['"Log every transaction"','Observer on state transitions, or Command objects appended to a log.']
 ],
 cross:[
  ['Why State and not a switch on an enum?','Because each state must answer all four actions, so a new state forces you to decide every case. A switch lets you silently forget one, and that is exactly how the "press before paying" bug ships.'],
  ['Is greedy change always correct?','No. It is correct for canonical denominations like INR or USD, and wrong for arbitrary sets. With {1,3,4} making 6, greedy gives three coins where two suffice. The general solution is coin-change DP.'],
  ['User cancels after inserting money.','The cancel action on HasMoneyState refunds the balance and returns to Idle. Every state defines cancel, which is why nothing is missed.'],
  ['Item is out of stock but money is in.','Reject the selection, keep the balance, stay in HasMoneyState so the user can choose something else or cancel.'],
  ['How would you unit test this?','Drive the state machine directly: assert that selectItem on IdleState throws, that insertCoin moves to HasMoneyState. State objects are trivially testable in isolation, which is another argument for the pattern.']
 ],
 fail:[
  'A giant switch statement over a status enum. This problem exists to test the State pattern.',
  'Dispensing before verifying change can be made.',
  'Claiming greedy change is universally correct.',
  'No cancel or refund path.',
  'Prices stored on the slot AND the item, so they can disagree.'
 ]}

];

PLAN.lldProblems = PLAN.lldProblems.concat([

{id:'booking', name:'Movie Booking (BookMyShow)', tier:'b', flavour:'OOD + concurrency', mins:50,
 who:'AMAZON favourite · Adobe · Expedia (rooms) · Flipkart. Chosen specifically because of the race condition.',
 asked:[
  'Design BookMyShow / Ticketmaster.',
  'Design seat booking for a cinema.',
  'Two users click the same seat at the same instant. Walk me through it.',
  'The user holds seats and then abandons the payment. What happens?'
 ],
 clarify:[
  'Can a user hold seats before paying, and for how long?',
  'Is overbooking ever acceptable? (for cinemas, no)',
  'Multiple screens per cinema, multiple shows per screen — how far do we model?',
  'Seat categories and dynamic pricing in scope?',
  'What happens if payment fails after the hold?'
 ],
 entities:[
  ['City / Cinema / Screen','class','The location hierarchy. Cinema has 1..* Screens.'],
  ['Movie','class','id, title, duration, language.'],
  ['Show','class','movie, screen, startTime. THE unit that owns seat availability.'],
  ['Seat','class','row, number, SeatCategory. Physical, belongs to a Screen.'],
  ['ShowSeat','class','seat + show + SeatStatus. The unit of contention — NOT Seat itself.'],
  ['SeatStatus','enum','AVAILABLE, HELD, BOOKED.'],
  ['SeatHold','class','showSeats, userId, expiresAt. The TTL lives here.'],
  ['Booking','class','id, user, showSeats, amount, BookingStatus.'],
  ['BookingService','class','The facade: hold, confirm, release.'],
  ['PricingStrategy','interface','Category-based, time-based, demand-based.']
 ],
 patterns:[
  ['Strategy','PricingStrategy — weekday vs weekend, premium seats, dynamic pricing.'],
  ['State','Booking lifecycle: CREATED, HELD, PAID, CONFIRMED, CANCELLED, EXPIRED.'],
  ['Observer','Notify the user on confirmation; notify the screen display on availability change.'],
  ['Factory','Optional, for creating ShowSeats when a Show is scheduled.']
 ],
 code:[
  ['ShowSeat is the unit of contention — this is the key modelling insight',
   ['// WRONG: Seat holds the status. Seat 14A is shared across every show,',
    '// so booking it for the 6pm show would mark it taken for the 9pm show too.',
    '',
    '// RIGHT: status belongs to (seat, show)',
    'public class ShowSeat {',
    '    private final Seat seat;',
    '    private final Show show;',
    '    private final AtomicReference<SeatStatus> status =',
    '            new AtomicReference<>(SeatStatus.AVAILABLE);',
    '    private volatile String heldBy;',
    '    private volatile Instant holdExpiry;',
    '',
    '    public boolean tryHold(String userId, Duration ttl) {',
    '        if (status.compareAndSet(SeatStatus.AVAILABLE, SeatStatus.HELD)) {',
    '            heldBy = userId;',
    '            holdExpiry = Instant.now().plus(ttl);',
    '            return true;',
    '        }',
    '        return releaseIfExpiredThenRetry(userId, ttl);   // lazy expiry, see below',
    '    }',
    '}'],
   'Putting status on Seat instead of ShowSeat is the single most common modelling error on this question, and it is invisible until the interviewer asks about a second show.'],
  ['All-or-nothing hold across several seats',
   ['public Optional<SeatHold> hold(List<ShowSeat> requested, String userId) {',
    '    List<ShowSeat> acquired = new ArrayList<>();',
    '    // deterministic order prevents deadlock between two overlapping requests',
    '    requested.sort(Comparator.comparing(ShowSeat::id));',
    '',
    '    for (ShowSeat s : requested) {',
    '        if (s.tryHold(userId, HOLD_TTL)) {',
    '            acquired.add(s);',
    '        } else {',
    '            acquired.forEach(ShowSeat::release);   // roll back partial holds',
    '            return Optional.empty();',
    '        }',
    '    }',
    '    return Optional.of(new SeatHold(acquired, userId, Instant.now().plus(HOLD_TTL)));',
    '}'],
   'Two things interviewers look for: the rollback of partial holds (otherwise you strand seats nobody can book), and the deterministic sort (otherwise two users each holding one of the other pair deadlock).'],
  ['Expiry: lazy plus sweeper, not sweeper alone',
   ['// lazy - checked on every access, so an expired hold never blocks a sale',
    'private boolean releaseIfExpiredThenRetry(String userId, Duration ttl) {',
    '    if (status.get() == SeatStatus.HELD && Instant.now().isAfter(holdExpiry)) {',
    '        if (status.compareAndSet(SeatStatus.HELD, SeatStatus.AVAILABLE)) {',
    '            return tryHold(userId, ttl);',
    '        }',
    '    }',
    '    return false;',
    '}',
    '',
    '// sweeper - so seats free up for BROWSING users too',
    '@Scheduled(fixedDelay = 30_000)',
    'public void sweepExpiredHolds() { ... }'],
   'A sweeper alone leaves a window where an expired hold still blocks a sale. Lazy alone means the seat looks taken to anyone browsing. You need both, and saying so is the mature answer.']
 ],
 concurrency:[
  ['Two users click seat 14A simultaneously','compareAndSet from AVAILABLE to HELD. Exactly one wins; the other gets a clean "seat no longer available". Never read-then-write.'],
  ['Partial hold on a multi-seat request','Roll back everything acquired so far. Otherwise seats sit HELD with no owner until the TTL expires.'],
  ['Two users request overlapping seat sets in opposite order','Deadlock risk. Sort by seat id before acquiring so every request takes locks in the same order.'],
  ['Hold expires mid-payment','State the policy. Either fail the payment with a clear message, or extend the hold once when payment begins. Silently charging for a released seat is the failure that ships.'],
  ['At database scale','The same shape: UPDATE show_seat SET status = HELD WHERE id = ? AND status = AVAILABLE, then check rows-affected. Or SELECT ... FOR UPDATE if you need to hold several rows.']
 ],
 extend:[
  ['"Now add dynamic pricing based on demand"','A new PricingStrategy reading the current occupancy ratio. Booking and seat classes untouched.'],
  ['"Support seat maps with couple seats and wheelchair spaces"','SeatCategory plus a capability flag; the allocation and validation rules read the flag.'],
  ['"Handle a whole show being cancelled"','A state transition on Show that cascades to bookings, plus refund events. Show it as a state machine, not a boolean.'],
  ['"Ten thousand users hitting one popular show"','That single Show becomes the hot object. Shard holds by seat id, or admit users through a queue. Say that the design is unchanged; only the contention management moves.']
 ],
 cross:[
  ['Why ShowSeat rather than putting status on Seat?','Because a seat exists in the cinema, but availability exists per show. Status on Seat would make booking 14A at 6pm also book it at 9pm.'],
  ['Optimistic or pessimistic here?','For a specific named seat under high contention, pessimistic — a compare-and-set or a row lock on that seat. Optimistic retry thrashes when everyone wants the same seat.'],
  ['What if the payment gateway times out and you do not know the outcome?','Do not release the hold. Mark the booking PENDING, reconcile against the gateway, and make the confirm operation idempotent so a retry does not double-book.'],
  ['How do you stop one user holding every seat?','A per-user hold limit and a rate limit. A design question worth raising unprompted — it shows product thinking.'],
  ['Where does this design break first?','The in-memory ShowSeat map. Move it to a database with a conditional update; the concurrency argument transfers unchanged.']
 ],
 fail:[
  'Status on Seat instead of ShowSeat.',
  'Read-then-write on availability — the exact race being tested.',
  'No rollback of partial holds.',
  'No answer for payment failing after the hold.',
  'A global lock on the show, which serialises every booking in the cinema.'
 ]},

{id:'splitwise', name:'Splitwise', tier:'b', flavour:'OOD + algorithm', mins:45,
 who:'Amazon · Uber · Flipkart. The settlement algorithm is the hybrid element.',
 asked:[
  'Design Splitwise.',
  'Design an expense sharing app with equal, exact and percentage splits.',
  'How do you minimise the number of transactions to settle a group?',
  'Show me the balance sheet for a user.'
 ],
 clarify:[
  'Split types — equal, exact amounts, percentages, shares?',
  'Do we settle within groups only, or globally across all friends?',
  'Multi-currency?',
  'Do we need simplified debts (A owes C directly instead of A→B→C)?'
 ],
 entities:[
  ['User','class','id, name, email.'],
  ['Group','class','name, members. Optional but usually asked for.'],
  ['Expense','class','paidBy, amount, description, SplitStrategy, participants.'],
  ['Split','abstract class','user + amount owed. EqualSplit / ExactSplit / PercentSplit.'],
  ['SplitStrategy','interface','validate() and computeSplits(amount, participants).'],
  ['BalanceSheet','class','Map<userA, Map<userB, amount>> — who owes whom.'],
  ['ExpenseService','class','The facade: addExpense, settleUp, showBalances.'],
  ['SettlementStrategy','interface','Minimise transactions, or simple pairwise netting.']
 ],
 patterns:[
  ['Strategy','SplitStrategy for the split types; SettlementStrategy for simplification.'],
  ['Factory','SplitFactory creating the right Split from a type.'],
  ['Observer','Notify members when an expense is added or settled.'],
  ['Command','Optional: expenses as commands, giving undo for free.']
 ],
 code:[
  ['Split types behind one interface, with validation',
   ['public interface SplitStrategy {',
    '    List<Split> split(BigDecimal total, List<User> participants, List<BigDecimal> args);',
    '}',
    '',
    'public class PercentSplit implements SplitStrategy {',
    '    public List<Split> split(BigDecimal total, List<User> users, List<BigDecimal> pcts) {',
    '        BigDecimal sum = pcts.stream().reduce(BigDecimal.ZERO, BigDecimal::add);',
    '        if (sum.compareTo(new BigDecimal("100")) != 0)',
    '            throw new IllegalArgumentException("percentages must total 100");',
    '        // ... and the rounding problem below',
    '    }',
    '}'],
   'Validation belongs in the strategy, because each split type has a different invariant: exact must sum to the total, percent must sum to 100, equal has none.'],
  ['The rounding trap nobody mentions',
   ['// 100.00 split equally three ways = 33.333...',
    '// naive rounding gives 33.33 x 3 = 99.99. One cent has vanished.',
    '',
    'public List<Split> splitEqually(BigDecimal total, List<User> users) {',
    '    int n = users.size();',
    '    BigDecimal each = total.divide(BigDecimal.valueOf(n), 2, RoundingMode.DOWN);',
    '    BigDecimal remainder = total.subtract(each.multiply(BigDecimal.valueOf(n)));',
    '',
    '    List<Split> out = new ArrayList<>();',
    '    for (int i = 0; i < n; i++) {',
    '        BigDecimal amt = each;',
    '        if (remainder.compareTo(BigDecimal.ZERO) > 0) {   // give the odd cents away',
    '            amt = amt.add(new BigDecimal("0.01"));',
    '            remainder = remainder.subtract(new BigDecimal("0.01"));',
    '        }',
    '        out.add(new Split(users.get(i), amt));',
    '    }',
    '    return out;',
    '}'],
   'Raising this unprompted is a strong signal. It also settles the "why BigDecimal and never double" question before it is asked - floating point cannot represent 0.1 and money must balance exactly.'],
  ['Debt simplification — the algorithmic core',
   ['// net every user to a single figure, then greedily match',
    'public List<Transaction> simplify(Map<User, BigDecimal> net) {',
    '    PriorityQueue<Entry> creditors = new PriorityQueue<>(byAmountDesc);',
    '    PriorityQueue<Entry> debtors   = new PriorityQueue<>(byAmountDesc);',
    '    net.forEach((u, amt) -> {',
    '        if (amt.signum() > 0) creditors.add(new Entry(u, amt));',
    '        else if (amt.signum() < 0) debtors.add(new Entry(u, amt.negate()));',
    '    });',
    '',
    '    List<Transaction> out = new ArrayList<>();',
    '    while (!creditors.isEmpty() && !debtors.isEmpty()) {',
    '        Entry c = creditors.poll(), d = debtors.poll();',
    '        BigDecimal settled = c.amount.min(d.amount);',
    '        out.add(new Transaction(d.user, c.user, settled));',
    '        if (c.amount.compareTo(settled) > 0) creditors.add(c.minus(settled));',
    '        if (d.amount.compareTo(settled) > 0) debtors.add(d.minus(settled));',
    '    }',
    '    return out;',
    '}'],
   'This greedy heap approach gives at most n-1 transactions and is what you should write. Be honest that MINIMUM transactions is NP-hard (it is LC 465, solved with bitmask DP for small n) - knowing the distinction is the differentiator.']
 ],
 concurrency:[
  ['Two expenses added to the same group simultaneously','Balance updates must be atomic. Lock per group, or make the balance sheet an append-only ledger of expenses with balances derived on read.'],
  ['Derived versus stored balances','Storing a running balance is fast and can drift. Deriving from the expense list is always correct and slower. The mature answer: store expenses as the source of truth, cache the balance, and rebuild on demand.'],
  ['Settle-up racing an expense','Settlement should record the balance it settled against, so a concurrent expense does not silently vanish.']
 ],
 extend:[
  ['"Now support multi-currency"','Money becomes a value object of amount plus currency; expenses store the FX rate used AT THE TIME. Never recompute historic amounts at today rate.'],
  ['"Add group-level simplification"','SettlementStrategy already isolates this. Swap greedy netting for a per-group variant.'],
  ['"Show a per-user activity feed"','Observer on expense events, or derive it from the append-only expense log.'],
  ['"Support recurring expenses"','A scheduled job creating expenses from a template. Say it does not change the core model.']
 ],
 cross:[
  ['Why BigDecimal and not double?','Floating point cannot represent 0.1 exactly, so sums drift. Money must balance to the cent, and BigDecimal with an explicit RoundingMode makes rounding a decision rather than an accident.'],
  ['100 split three ways — where does the extra cent go?','Somebody gets 33.34. Choose a deterministic rule — the payer, or the first participant — and apply it consistently so the total always reconciles.'],
  ['Is your simplification optimal?','No. Greedy netting gives at most n-1 transactions, which is good and fast. The true minimum is NP-hard; for small groups you could use bitmask DP, which is LC 465.'],
  ['A owes B, B owes C, C owes A, all £10. What happens?','It nets to zero. Simplification removes the cycle entirely and produces no transactions, which is the whole value of the feature.'],
  ['Where does the balance sheet live?','I would treat expenses as the source of truth and the balance as a derived, cached view — so a bug in balance maintenance is recoverable by recomputation.']
 ],
 fail:[
  'Using double for money.',
  'Ignoring the rounding remainder so totals do not reconcile.',
  'Claiming greedy settlement is optimal.',
  'A single balance field per user instead of pairwise balances, losing who owes whom.',
  'Validation logic duplicated across split types instead of living in each strategy.'
 ]},

{id:'tictactoe', name:'Tic-Tac-Toe & Chess', tier:'b', flavour:'OOD + algorithm', mins:45,
 who:'Microsoft · Amazon (hybrid) · Adobe. Tic-tac-toe is the warm-up; chess is the extensibility test.',
 asked:[
  'Design tic-tac-toe. Now make the win-check O(1).',
  'Design a chess game.',
  'Add undo and redo.',
  'How do you make it n-by-n, or support four players?'
 ],
 clarify:[
  'Board size — fixed 3x3, or n-by-n with k-in-a-row?',
  'Two players only, or more?',
  'Do we need undo/redo, move history, replay?',
  'Is an AI opponent in scope? (usually say no, then offer minimax if pushed)'
 ],
 entities:[
  ['Game','class','The facade. Holds board, players, turn, GameState.'],
  ['Board','class','The grid plus win detection.'],
  ['Cell','class','position and occupant. For chess, holds a Piece.'],
  ['Player','class','id, name, Symbol or Colour.'],
  ['GameState','enum / interface','IN_PROGRESS, WIN, DRAW. State pattern if the phases have behaviour.'],
  ['Move','class','from, to, player, captured. The Command object.'],
  ['Piece','abstract class','(Chess) King, Queen, Rook... each with its own movement rule.'],
  ['MoveValidator','interface','(Chess) The axis of change per piece type.'],
  ['WinStrategy','interface','Row/column/diagonal for TTT; checkmate detection for chess.']
 ],
 patterns:[
  ['Strategy','Movement rules per piece; win-condition per game variant.'],
  ['Factory','PieceFactory creating pieces from a type character.'],
  ['Command','Move objects with execute and undo. This is how you get undo/redo for free.'],
  ['State','Game phase: in-progress, check, checkmate, stalemate.'],
  ['Observer','Optional: UI or move log subscribing to board changes.']
 ],
 code:[
  ['O(1) win check — the point of LC 348',
   ['public class TicTacToe {',
    '    private final int[] rows, cols;',
    '    private int diag, antiDiag;',
    '    private final int n;',
    '',
    '    // player 1 adds +1, player 2 adds -1. |count| == n means a win.',
    '    public int move(int r, int c, int player) {',
    '        int delta = (player == 1) ? 1 : -1;',
    '        rows[r] += delta;',
    '        cols[c] += delta;',
    '        if (r == c)         diag     += delta;',
    '        if (r + c == n - 1) antiDiag += delta;',
    '',
    '        if (Math.abs(rows[r]) == n || Math.abs(cols[c]) == n',
    '         || Math.abs(diag)    == n || Math.abs(antiDiag) == n) return player;',
    '        return 0;',
    '    }',
    '}'],
   'The naive answer scans the board after every move, O(n^2). This is O(1) per move with O(n) space, and it is exactly what the Amazon hybrid round wants: a clean design PLUS the algorithmic insight.'],
  ['Command gives you undo and redo',
   ['public interface GameCommand {',
    '    void execute(Board b);',
    '    void undo(Board b);',
    '}',
    '',
    'public class MoveCommand implements GameCommand {',
    '    private final Position from, to;',
    '    private Piece captured;              // remembered so undo can restore it',
    '',
    '    public void execute(Board b) {',
    '        captured = b.pieceAt(to);',
    '        b.place(to, b.remove(from));',
    '    }',
    '    public void undo(Board b) {',
    '        b.place(from, b.remove(to));',
    '        if (captured != null) b.place(to, captured);',
    '    }',
    '}',
    '',
    '// Deque<GameCommand> undoStack, redoStack'],
   'Remembering the captured piece inside the command is what makes undo correct. Interviewers ask "now add undo" precisely to see whether your move representation is rich enough - a plain from/to pair is not.'],
  ['Piece movement as a strategy, not a switch',
   ['public abstract class Piece {',
    '    protected final Colour colour;',
    '    public abstract boolean canMove(Board b, Position from, Position to);',
    '}',
    '',
    'public class Rook extends Piece {',
    '    public boolean canMove(Board b, Position from, Position to) {',
    '        if (from.row() != to.row() && from.col() != to.col()) return false;',
    '        return b.isPathClear(from, to) && !b.hasOwnPiece(to, colour);',
    '    }',
    '}'],
   'Adding a new piece is a new class. A switch over a piece-type enum inside Board is the Open/Closed violation this problem is designed to surface.']
 ],
 concurrency:[
  ['Two players moving at once','Turn-based by definition, so enforce it: reject a move from the player whose turn it is not. That check IS the concurrency control.'],
  ['Online multiplayer','Moves go through a single queue per game, applied in order. The game object is single-threaded; the network layer is not.'],
  ['Shared game state','If several viewers observe, use an immutable board snapshot per move so readers never see a half-applied move.']
 ],
 extend:[
  ['"Make it n-by-n with k-in-a-row"','The counter trick generalises for k == n. For k < n you need a directional scan from the last move — O(k) rather than O(1). Say that honestly; the naive claim that it still works is a trap.'],
  ['"Add undo and redo"','Command objects plus two stacks. If your Move already stores the captured piece, this is nearly free — which is the reason to model it that way from the start.'],
  ['"Add an AI opponent"','Minimax with alpha-beta pruning behind a Player interface, so a human and an AI are interchangeable.'],
  ['"Support four players"','Symbol becomes a player id and the counters become per-player. Say what breaks: the +1/-1 trick only works for two.']
 ],
 cross:[
  ['How do you check a win in O(1)?','Maintain per-row, per-column and two diagonal counters, incrementing by +1 or -1 by player. A magnitude equal to n means a win. O(1) per move.'],
  ['Does that generalise to k-in-a-row on an n board?','No. Counters assume a full line. For k < n you scan the four directions outward from the last move, which is O(k) — still far better than rescanning the board.'],
  ['Where does the movement rule for a piece live?','On the piece. A switch inside Board means every new piece edits Board, which is the violation being tested.'],
  ['How would you detect checkmate?','King is in check AND no legal move removes the check. Generate legal moves, apply each to a copy, and test. Say it is expensive and that real engines optimise heavily.'],
  ['What makes this design extensible?','Piece movement, win condition and player type each sit behind their own abstraction, so a variant like Chess960 or four-player changes one place each.']
 ],
 fail:[
  'Rescanning the whole board after every move, then having no better answer when asked.',
  'A switch over piece type inside Board.',
  'A Move that stores only from and to, so undo cannot restore a capture.',
  'Claiming the O(1) counter trick works for arbitrary k-in-a-row.',
  'No turn validation.'
 ]},

{id:'notification', name:'Notification System', tier:'b', flavour:'OOD', mins:45,
 who:'Amazon · Microsoft · Adobe. Bridges directly into the system design track.',
 asked:[
  'Design a notification service supporting email, SMS and push.',
  'How do you stop a user receiving 200 notifications in a minute?',
  'One channel provider goes down. What happens to the others?',
  'How do you add a new channel without touching existing code?'
 ],
 clarify:[
  'Which channels, and is the set fixed or extensible?',
  'Do users have per-channel and per-category preferences?',
  'Priority levels — does an OTP jump the queue ahead of marketing?',
  'Delivery guarantees: at-least-once, and do we need read receipts?',
  'Templating and localisation in scope?'
 ],
 entities:[
  ['NotificationService','class','The facade: send(Notification).'],
  ['Notification','class','recipient, category, priority, payload, template id.'],
  ['Channel','interface','send(Notification) — Email, Sms, Push, InApp.'],
  ['ChannelFactory','class','Resolves a channel from a type.'],
  ['UserPreferences','class','Per-category, per-channel opt-in plus quiet hours.'],
  ['RateLimiter','interface','Per-user, per-category throttling.'],
  ['TemplateEngine','interface','Renders payload into channel-specific content.'],
  ['RetryPolicy','class','Attempts, backoff, and when to give up.'],
  ['DeadLetterQueue','class','Where a permanently failing notification goes.'],
  ['NotificationStatus','enum','PENDING, SENT, DELIVERED, FAILED, SUPPRESSED.']
 ],
 patterns:[
  ['Strategy','One implementation of Channel per delivery mechanism.'],
  ['Factory','ChannelFactory, so callers never name a concrete channel.'],
  ['Observer','Subscribers to domain events that trigger notifications.'],
  ['Decorator','Stacking cross-cutting behaviour: retry wraps rate-limit wraps the raw channel.'],
  ['Chain of Responsibility','The pre-send pipeline: preferences, then quiet hours, then rate limit, then dedup.'],
  ['Builder','Notification has many optional fields — a natural Builder.']
 ],
 code:[
  ['Channel as the extension point',
   ['public interface Channel {',
    '    ChannelType type();',
    '    DeliveryResult send(Notification n);',
    '    boolean supports(Notification n);     // e.g. SMS rejects rich payloads',
    '}',
    '',
    'public class EmailChannel implements Channel {',
    '    private final EmailClient client;',
    '    private final TemplateEngine templates;',
    '',
    '    public DeliveryResult send(Notification n) {',
    '        String body = templates.render(n.templateId(), n.payload());',
    '        return client.send(n.recipient().email(), n.subject(), body);',
    '    }',
    '}',
    '',
    '// adding WhatsApp = one class + one enum value. Nothing else changes.'],
   'This is the answer to "add a new channel without touching existing code", and it is why the interviewer asks the question.'],
  ['The pre-send pipeline as a chain',
   ['public interface SendFilter {',
    '    // returns empty to continue, or a reason to suppress',
    '    Optional<String> reject(Notification n, UserPreferences prefs);',
    '}',
    '',
    'List<SendFilter> pipeline = List.of(',
    '    new OptOutFilter(),        // user turned this category off',
    '    new QuietHoursFilter(),    // 22:00-08:00, unless priority == CRITICAL',
    '    new RateLimitFilter(),     // max N per user per window',
    '    new DedupFilter()          // same content within the aggregation window',
    ');',
    '',
    'for (SendFilter f : pipeline) {',
    '    Optional<String> reason = f.reject(n, prefs);',
    '    if (reason.isPresent()) return DeliveryResult.suppressed(reason.get());',
    '}'],
   'Each rule is independently testable and reorderable, and a new rule is a new class. Note the CRITICAL override on quiet hours: an OTP must ignore them, and saying so shows product judgement.'],
  ['Per-channel isolation so one provider cannot sink the rest',
   ['// separate queue and thread pool per channel',
    'Map<ChannelType, ExecutorService> pools = Map.of(',
    '    EMAIL, boundedPool(8, 500),',
    '    SMS,   boundedPool(4, 200),',
    '    PUSH,  boundedPool(16, 1000)',
    ');',
    '',
    'pools.get(n.channel()).submit(() -> {',
    '    try {',
    '        retry.execute(() -> channel.send(n));',
    '    } catch (PermanentFailure e) {',
    '        dlq.publish(n, e);',
    '    }',
    '});'],
   'This is the bulkhead pattern applied at the LLD level. One queue for all channels means a slow SMS provider stalls every email too - which is the exact failure the interviewer is probing for.']
 ],
 concurrency:[
  ['One slow provider blocking everything','Separate bounded queue and thread pool per channel. Bulkhead isolation.'],
  ['Duplicate sends on retry','Every notification carries an idempotency key; the channel or the provider dedupes on it. At-least-once delivery makes duplicates inevitable.'],
  ['Rate-limit counters across threads','An atomic counter per user per window, or a token bucket with compare-and-set. Not a plain HashMap increment.'],
  ['Aggregation window','Buffer per user, flush on a timer or on count. Needs a thread-safe buffer and a single flusher to avoid double-sending.']
 ],
 extend:[
  ['"Add WhatsApp"','One Channel implementation plus an enum value. Say it out loud — this is the demonstration that the design holds.'],
  ['"Digest 50 likes into one notification"','A DedupFilter plus an aggregation buffer keyed by user and category, flushed on a window.'],
  ['"Guarantee OTPs are never delayed"','Priority queues per channel, and a CRITICAL priority that bypasses quiet hours and rate limits.'],
  ['"Scale to millions per hour"','This is where LLD hands off to system design: the in-process queue becomes Kafka, the pools become consumer groups. The interfaces do not change.']
 ],
 cross:[
  ['How do you add a channel without changing existing code?','Implement Channel and register it in the factory. Nothing that already exists is edited — that is Open/Closed in practice.'],
  ['A user gets 200 notifications in a minute. Fix it.','Rate-limit filter per user per category, plus an aggregation window that digests repeats, plus quiet hours. And an unsubscribe path — a notification system without one is a product bug.'],
  ['SMS provider is down. What happens to email?','Nothing, if each channel has its own queue and pool. If they share one, email backs up behind SMS — that is the bulkhead argument.'],
  ['At-least-once means duplicates. How do you handle that?','An idempotency key on each notification, deduplicated at the channel or by the provider.'],
  ['Where does this stop being an LLD problem?','When volume forces a real broker and horizontal workers. The Channel and filter interfaces survive the transition unchanged, which is a good sign about the design.']
 ],
 fail:[
  'A switch over channel type instead of a Channel interface.',
  'One shared queue for all channels.',
  'No user preferences or opt-out.',
  'No retry, or retry with no cap and no DLQ.',
  'Quiet hours applied to OTPs.'
 ]}

]);

PLAN.lldProblems = PLAN.lldProblems.concat([

{id:'atm', name:'ATM', tier:'b', flavour:'OOD', mins:40,
 who:'JPM · Amex · Amazon. State plus a small algorithm, and money makes the edge cases real.',
 asked:[
  'Design an ATM.',
  'How do you dispense 3,700 with the notes you have?',
  'The cash is dispensed but the network drops before the balance updates. What happens?',
  'Card is inserted but the user walks away. What then?'
 ],
 clarify:[
  'Which operations — withdraw, deposit, balance, transfer?',
  'Which note denominations, and must we minimise the note count?',
  'Is the bank backend in scope, or do we stub it?',
  'Do we handle card retention after three wrong PINs?'
 ],
 entities:[
  ['ATM','class','Context. Holds state, cash dispenser, card reader.'],
  ['AtmState','interface','Idle / CardInserted / Authenticated / Dispensing / OutOfService.'],
  ['Card','class','number, expiry. No PIN — that is verified by the bank.'],
  ['Account','class','id, balance. Lives behind the BankService, not in the ATM.'],
  ['Transaction','abstract class','Withdraw / Deposit / BalanceEnquiry / Transfer.'],
  ['CashDispenser','class','Holds note inventory; the Chain of Responsibility root.'],
  ['NoteDispenser','abstract class','Handler per denomination, chained largest to smallest.'],
  ['BankService','interface','The external boundary. Stub it and say so.'],
  ['ReceiptPrinter','class','Optional but shows completeness.']
 ],
 patterns:[
  ['State','ATM behaviour by phase. Ejecting a card mid-dispense must be impossible.'],
  ['Chain of Responsibility','Note dispensing: the 2000 handler takes what it can, passes the rest down.'],
  ['Strategy','Optional: note-selection algorithm, greedy versus exact DP.'],
  ['Template Method','Transaction defines the skeleton — validate, execute, record, print.']
 ],
 code:[
  ['Chain of Responsibility for note dispensing',
   ['public abstract class NoteDispenser {',
    '    private NoteDispenser next;',
    '    private final int denomination;',
    '    private int count;',
    '',
    '    public void dispense(int amount, Map<Integer,Integer> out) {',
    '        int give = Math.min(amount / denomination, count);',
    '        if (give > 0) {',
    '            out.put(denomination, give);',
    '            count -= give;',
    '            amount -= give * denomination;',
    '        }',
    '        if (amount > 0) {',
    '            if (next == null) throw new InsufficientNotesException(amount);',
    '            next.dispense(amount, out);',
    '        }',
    '    }',
    '}',
    '// chain: 2000 -> 500 -> 200 -> 100'],
   'Adding a 200-rupee note is one new handler inserted into the chain. Note the failure path: if the remainder cannot be made, throw BEFORE anything physically leaves the machine.'],
  ['Check first, dispense second — the ordering that matters',
   ['public void withdraw(int amount) {',
    '    // 1. can we physically make this amount?',
    '    Map<Integer,Integer> plan = dispenser.plan(amount);   // throws if not',
    '    // 2. does the account allow it?',
    '    bank.debit(account, amount);                          // throws if insufficient',
    '    // 3. only now move physical cash',
    '    dispenser.commit(plan);',
    '    printer.print(receipt(amount));',
    '}'],
   'Getting this order wrong is the classic failure: debiting the account and then discovering you cannot make 3,700 from the notes you hold. Plan, then debit, then dispense.']
 ],
 concurrency:[
  ['Cash dispensed, network drops before the debit','This is the real question. Dispense LAST, after the debit succeeds. If the debit succeeds and dispensing then fails physically, you need a reversal — record the transaction as PENDING and reconcile.'],
  ['Two ATMs, one account','The balance check and debit must be atomic at the bank, not the ATM. Say the ATM is not where the invariant lives.'],
  ['Note inventory','Decrement atomically with the dispense commit; a plan that is not committed must not reserve notes indefinitely.']
 ],
 extend:[
  ['"Add a 200-rupee note"','One handler in the chain. Nothing else changes.'],
  ['"Minimise the number of notes"','Greedy works for canonical denominations and fails in general. The exact answer is coin-change DP. Same distinction as the vending machine.'],
  ['"Support deposits"','A new Transaction subclass; the template method skeleton already fits.'],
  ['"Card retention after three wrong PINs"','A counter on the session plus a state transition to CardRetained. Show it in the state machine.']
 ],
 cross:[
  ['Where does the PIN get verified?','At the bank, never on the ATM. The ATM forwards an encrypted PIN block. Saying this shows you understand the trust boundary.'],
  ['Dispense then debit, or debit then dispense?','Debit then dispense. If dispensing fails you can reverse a debit; you cannot un-dispense cash.'],
  ['Why Chain of Responsibility rather than a loop?','A loop works. The chain makes each denomination independently testable and lets you insert or retire a denomination without touching the others. If they push back, concede the loop is fine — the reasoning is what is scored.'],
  ['User walks away mid-session.','A session timeout state transition that ejects the card and returns to Idle. Every state must define it.'],
  ['Is greedy note selection always right?','No — same caveat as change-making. It is correct for real currency systems, wrong for arbitrary denominations.']
 ],
 fail:[
  'Debiting before checking whether the amount can be physically made.',
  'Storing the balance on the ATM instead of behind the bank service.',
  'Verifying the PIN locally.',
  'A switch over an ATM status enum instead of the State pattern.',
  'No session timeout.'
 ]},

{id:'orderinv', name:'Order & Inventory (Amazon)', tier:'b', flavour:'OOD + concurrency', mins:50,
 who:'AMAZON specifically · Flipkart · Expedia. The oversell race is the point.',
 asked:[
  'Design the order management system for an e-commerce site.',
  'Two customers buy the last item at the same instant. What happens?',
  'Design inventory across multiple warehouses.',
  'Walk me through the order lifecycle and what can fail at each step.'
 ],
 clarify:[
  'Is overselling ever acceptable? (for physical goods, no)',
  'Single warehouse or many? Multi-warehouse turns this into allocation.',
  'Is payment synchronous, or do we reserve then charge?',
  'Do we support cancellation and partial refunds?',
  'Cart in scope, or start at checkout?'
 ],
 entities:[
  ['Order','class','id, customer, lineItems, OrderStatus, total.'],
  ['OrderStatus','enum / State','CREATED, RESERVED, PAID, CONFIRMED, SHIPPED, DELIVERED, CANCELLED.'],
  ['OrderLine','class','sku, quantity, unitPrice at time of order.'],
  ['Inventory','class','Per-SKU available and reserved counts. The unit of contention.'],
  ['Reservation','class','sku, quantity, orderId, expiresAt.'],
  ['Warehouse','class','Location plus its own inventory.'],
  ['AllocationStrategy','interface','Which warehouse fulfils this line.'],
  ['PaymentService','interface','External boundary; charge and refund, both idempotent.'],
  ['OrderSaga','class','Orchestrates reserve → charge → confirm, with compensations.'],
  ['PricingStrategy','interface','Base price, discounts, promotions.']
 ],
 patterns:[
  ['State','The order lifecycle, with explicitly allowed transitions.'],
  ['Saga / orchestration','Reserve, charge, confirm — with a compensating action per step.'],
  ['Strategy','Allocation across warehouses; pricing and discounting.'],
  ['Observer','Order status changes triggering notifications.'],
  ['Command','Optional: each lifecycle step as an executable, compensatable command.']
 ],
 code:[
  ['The oversell race, closed properly',
   ['// WRONG - the classic read-then-write race',
    'if (inventory.get(sku) > 0) {',
    '    inventory.put(sku, inventory.get(sku) - 1);   // two threads both pass the check',
    '}',
    '',
    '// RIGHT (in memory) - atomic conditional decrement',
    'public boolean tryReserve(String sku, int qty) {',
    '    AtomicInteger available = stock.get(sku);',
    '    while (true) {',
    '        int current = available.get();',
    '        if (current < qty) return false;',
    '        if (available.compareAndSet(current, current - qty)) return true;',
    '    }',
    '}',
    '',
    '// RIGHT (in a database) - one statement, no read-modify-write',
    '// UPDATE inventory SET available = available - :qty',
    '//  WHERE sku = :sku AND available >= :qty',
    '// then check rowsAffected == 1'],
   'The database form is the one to write on the board. Check rows-affected: one means you got it, zero means you did not, and there is no window between the check and the decrement.'],
  ['State machine with explicit legal transitions',
   ['public enum OrderStatus {',
    '    CREATED   { public Set<OrderStatus> next() { return Set.of(RESERVED, CANCELLED); } },',
    '    RESERVED  { public Set<OrderStatus> next() { return Set.of(PAID, CANCELLED, EXPIRED); } },',
    '    PAID      { public Set<OrderStatus> next() { return Set.of(CONFIRMED, REFUNDED); } },',
    '    CONFIRMED { public Set<OrderStatus> next() { return Set.of(SHIPPED, CANCELLED); } },',
    '    SHIPPED   { public Set<OrderStatus> next() { return Set.of(DELIVERED); } },',
    '    DELIVERED { public Set<OrderStatus> next() { return Set.of(); } },',
    '    CANCELLED { public Set<OrderStatus> next() { return Set.of(); } };',
    '',
    '    public abstract Set<OrderStatus> next();',
    '    public void checkTransition(OrderStatus to) {',
    '        if (!next().contains(to))',
    '            throw new IllegalStateException(this + " -> " + to + " not allowed");',
    '    }',
    '}'],
   'Interviewers deliberately ask about illegal transitions — "can a DELIVERED order be cancelled?". Encoding the graph makes the answer structural instead of a scattered if.'],
  ['Saga with compensation',
   ['public Order place(Cart cart, String idempotencyKey) {',
    '    return idempotency.runOnce(idempotencyKey, () -> {',
    '        Order order = Order.create(cart);',
    '        List<Runnable> compensations = new ArrayList<>();',
    '        try {',
    '            inventory.reserve(order);',
    '            compensations.add(() -> inventory.release(order));',
    '',
    '            payments.charge(order, idempotencyKey);',
    '            compensations.add(() -> payments.refund(order, idempotencyKey));',
    '',
    '            order.transitionTo(CONFIRMED);',
    '            return order;',
    '        } catch (Exception e) {',
    '            Collections.reverse(compensations);',
    '            compensations.forEach(Runnable::run);   // undo in reverse',
    '            order.transitionTo(CANCELLED);',
    '            throw e;',
    '        }',
    '    });',
    '}'],
   'Three things being tested at once: the idempotency key wrapping the whole operation, compensation in reverse order, and the fact that a refund is a business undo rather than a rollback.']
 ],
 concurrency:[
  ['Two customers, one item left','Atomic conditional decrement. Exactly one succeeds; the other gets a clean out-of-stock. Never read-then-write.'],
  ['Payment fails after reservation','Compensate by releasing the reservation, and rely on the TTL as a backstop if the compensation itself fails.'],
  ['User double-clicks Place Order','Idempotency key on the request. The same key returns the same order rather than creating a second.'],
  ['A flash sale on one SKU','That row becomes a single lock. Options: shard the stock into N buckets and decrement a random one, serialise through a queue, or use a virtual waiting room. Say which and why.'],
  ['Three warehouses','Do NOT sum three counters and decrement one — that races. Either one logical counter with allocation deciding the warehouse afterwards, or per-warehouse reservation naming the warehouse.']
 ],
 extend:[
  ['"Add partial cancellation of one line"','Line-level status rather than order-level only, with the order status derived from its lines.'],
  ['"Support pre-orders with no stock"','A reservation type that does not decrement available stock, and an allocation step when stock arrives.'],
  ['"Add promotions and coupons"','PricingStrategy composition — Decorator stacks discounts without a combinatorial explosion of pricing classes.'],
  ['"Make it eventually consistent for display"','Split the read model: "only 3 left" can be stale, the reservation cannot. Separating those two is the mature answer.']
 ],
 cross:[
  ['Two customers buy the last item. Exactly what happens?','One atomic conditional update succeeds and affects one row; the other affects zero rows and receives an out-of-stock response. There is no window in which both pass a check.'],
  ['Is eventual consistency ever acceptable for inventory?','For DISPLAY, yes. For the reservation, never. Distinguishing them is the answer they want.'],
  ['Can a delivered order be cancelled?','Not by the state machine — that becomes a return, which is a different flow with its own states. Saying that shows you modelled the domain and not just the happy path.'],
  ['Why saga rather than a distributed transaction?','2PC holds locks across services for the duration of network calls and its coordinator is a single point of failure. A saga trades atomicity for availability and uses compensations.'],
  ['What if the refund compensation fails?','Retry with backoff, then dead-letter and alert. Some failures need a human — pretending everything auto-resolves is not credible.']
 ],
 fail:[
  'Read-then-write on stock. This is the exact race being tested.',
  'No idempotency on order placement.',
  'An order status field with no transition rules.',
  'Summing stock across warehouses then decrementing one.',
  'No compensation path when payment fails after reservation.'
 ]},

{id:'lru', name:'LRU / LFU Cache', tier:'c', flavour:'Amazon hybrid', mins:40,
 who:'AMAZON hybrid · Microsoft · Uber. Design plus the data-structure insight, in one round.',
 asked:[
  'Design an LRU cache with O(1) get and put.',
  'Now make it LFU.',
  'Add a TTL per entry.',
  'Make it thread-safe. Now make it thread-safe without one global lock.'
 ],
 clarify:[
  'Fixed capacity, or memory-bounded?',
  'Do we need TTL as well as capacity eviction?',
  'Thread-safe? Single writer or many?',
  'Do we need statistics — hit rate, evictions?'
 ],
 entities:[
  ['Cache<K,V>','interface','get, put, remove. The seam that lets you swap policies.'],
  ['EvictionPolicy','interface','recordAccess(key), evictCandidate(). LRU / LFU / FIFO.'],
  ['Node<K,V>','class','key, value, prev, next. The doubly linked list node.'],
  ['DoublyLinkedList','class','With sentinel head and tail so there are no null checks.'],
  ['CacheStats','class','hits, misses, evictions.']
 ],
 patterns:[
  ['Strategy','EvictionPolicy — this is what turns "write an LRU" into a design answer rather than a LeetCode answer.'],
  ['Decorator','TTL, stats and thread-safety as wrappers around a plain cache.'],
  ['Template Method','Optional: shared get/put skeleton with policy hooks.']
 ],
 code:[
  ['LRU: hashmap plus doubly linked list, sentinels included',
   ['public class LruCache<K,V> {',
    '    private final Map<K, Node<K,V>> map = new HashMap<>();',
    '    private final Node<K,V> head = new Node<>(null, null);   // sentinels remove',
    '    private final Node<K,V> tail = new Node<>(null, null);   // every null check',
    '    private final int capacity;',
    '',
    '    { head.next = tail; tail.prev = head; }',
    '',
    '    public V get(K key) {',
    '        Node<K,V> n = map.get(key);',
    '        if (n == null) return null;',
    '        moveToFront(n);',
    '        return n.value;',
    '    }',
    '',
    '    public void put(K key, V value) {',
    '        Node<K,V> n = map.get(key);',
    '        if (n != null) { n.value = value; moveToFront(n); return; }',
    '        if (map.size() == capacity) {',
    '            Node<K,V> lru = tail.prev;',
    '            remove(lru);',
    '            map.remove(lru.key);            // remove from BOTH structures',
    '        }',
    '        Node<K,V> fresh = new Node<>(key, value);',
    '        map.put(key, fresh);',
    '        addFront(fresh);',
    '    }',
    '}'],
   'The two bugs interviewers watch for: forgetting to remove the evicted key from the map (a slow leak), and hand-rolling null checks instead of using sentinels.'],
  ['LFU: the frequency-bucket trick',
   ['// key -> node, key -> freq, freq -> doubly linked list of keys at that freq',
    'private final Map<K, V> values = new HashMap<>();',
    'private final Map<K, Integer> freq = new HashMap<>();',
    'private final Map<Integer, LinkedHashSet<K>> buckets = new HashMap<>();',
    'private int minFreq;',
    '',
    'private void touch(K key) {',
    '    int f = freq.get(key);',
    '    buckets.get(f).remove(key);',
    '    if (buckets.get(f).isEmpty() && minFreq == f) minFreq++;   // the whole trick',
    '    freq.put(key, f + 1);',
    '    buckets.computeIfAbsent(f + 1, x -> new LinkedHashSet<>()).add(key);',
    '}'],
   'Tracking minFreq is what keeps eviction O(1) — otherwise you scan for the minimum. LinkedHashSet within a bucket breaks frequency ties by recency, which is the standard tie-break.'],
  ['Thread safety without one global lock',
   ['// Level 1 - correct, and it serialises everything',
    'public synchronized V get(K key) { ... }',
    '',
    '// Level 2 - segment the cache, lock per segment',
    'private final LruCache<K,V>[] segments;   // key.hashCode() % n',
    'public V get(K key) { return segmentFor(key).get(key); }',
    '',
    '// Level 3 - what real caches do: approximate LRU',
    '// Caffeine buffers reads in a ring and applies them in batches, so the',
    '// hot path never contends on the linked list at all.'],
   'Interviewers push here. Level 1 is the honest starting point; being able to name segmentation and then approximate LRU is what separates a memorised LeetCode answer from a design answer.']
 ],
 concurrency:[
  ['Every get mutates the recency list','That is why a plain LRU cannot be lock-free — a read is a write. Say this; it is the insight the question is built on.'],
  ['Segmenting','Partition by key hash, lock per segment. Eviction becomes per-segment, so the policy is approximate globally — an acceptable trade you should name.'],
  ['Read buffering','Production caches (Caffeine) record accesses into a buffer and replay them in batches, keeping reads contention-free.'],
  ['TTL expiry','Lazy on read plus a periodic sweeper, the same pairing as the seat hold.']
 ],
 extend:[
  ['"Add TTL"','A Decorator wrapping the cache: check expiry on read, and sweep periodically. The eviction policy is untouched.'],
  ['"Make it LFU"','Swap the EvictionPolicy implementation. If your first answer put the linked list inside the cache class, this is a rewrite — which is why the policy is an interface.'],
  ['"Add hit-rate statistics"','Another decorator. Do not thread counters through the core class.'],
  ['"Make it distributed"','This is where it becomes a system design question: consistent hashing, invalidation, and the fact that per-node LRU no longer gives global LRU.']
 ],
 cross:[
  ['Why a doubly linked list rather than singly?','Eviction and promotion both need O(1) removal of a node given only that node, which requires the previous pointer.'],
  ['Why not just LinkedHashMap with accessOrder?','You can, and for a real answer say so — override removeEldestEntry and it is five lines. Interviewers usually want the hand-rolled version to see the pointer work.'],
  ['Why can a read not be lock-free?','Because get() reorders the recency list, so a read mutates shared state. That is the whole reason production caches buffer reads.'],
  ['LFU eviction in O(1) — how?','Frequency buckets plus a tracked minFreq. Increment moves the key up a bucket; if the min bucket empties, minFreq increases by one.'],
  ['Which would you actually use in production?','Caffeine. It uses a W-TinyLFU admission policy that beats both plain LRU and plain LFU on real workloads. Naming it signals you have used caches rather than only implemented them.']
 ],
 fail:[
  'Forgetting to remove the evicted key from the hashmap.',
  'Singly linked list, so eviction is O(n).',
  'Putting the eviction policy inside the cache class, so LFU means a rewrite.',
  'Claiming get() can be lock-free.',
  'No sentinel nodes, then drowning in null checks under time pressure.'
 ]},

{id:'filesystem', name:'In-Memory File System', tier:'c', flavour:'Amazon hybrid', mins:45,
 who:'AMAZON · Google · Microsoft. A tree problem wearing a design costume.',
 asked:[
  'Design an in-memory file system.',
  'Implement ls, mkdir, addContentToFile, readContentFromFile.',
  'Add search with wildcards.',
  'How would you add permissions?'
 ],
 clarify:[
  'Do we need permissions, symlinks, or just files and directories?',
  'Is ls sorted? Does ls on a file return just that file?',
  'Are paths always absolute?',
  'Thread-safe?'
 ],
 entities:[
  ['FileSystem','class','The facade holding the root node.'],
  ['FsNode','abstract class','name, parent, createdAt. The Composite base.'],
  ['Directory','class','extends FsNode, holds Map<String, FsNode> children.'],
  ['File','class','extends FsNode, holds content.'],
  ['Path','value object','Parsing and normalising, so string handling is not scattered.'],
  ['Permission','class','Optional extension: owner, mode bits.']
 ],
 patterns:[
  ['Composite','THE pattern here. Directory and File share a base type so a directory holds either.'],
  ['Visitor','Optional: traversal operations like search, du, find, without editing the node classes.'],
  ['Facade','FileSystem hiding traversal from callers.'],
  ['Iterator','Walking the tree lazily.']
 ],
 code:[
  ['Composite — the whole design in one shape',
   ['public abstract class FsNode {',
    '    protected final String name;',
    '    protected Directory parent;',
    '    protected FsNode(String name) { this.name = name; }',
    '    public abstract boolean isDirectory();',
    '    public abstract int size();          // recursive for directories',
    '}',
    '',
    'public class Directory extends FsNode {',
    '    private final Map<String, FsNode> children = new TreeMap<>();  // TreeMap = ls sorted free',
    '    public boolean isDirectory() { return true; }',
    '    public int size() {',
    '        return children.values().stream().mapToInt(FsNode::size).sum();',
    '    }',
    '}',
    '',
    'public class File extends FsNode {',
    '    private final StringBuilder content = new StringBuilder();',
    '    public boolean isDirectory() { return false; }',
    '    public int size() { return content.length(); }',
    '}'],
   'TreeMap rather than HashMap is a small choice worth stating out loud: ls must return lexicographic order, and TreeMap gives it for free instead of sorting on every call.'],
  ['Path traversal with mkdir -p semantics',
   ['private Directory traverse(String path, boolean createMissing) {',
    '    Directory cur = root;',
    '    for (String part : path.split("/")) {',
    '        if (part.isEmpty()) continue;             // leading slash, double slash',
    '        FsNode next = cur.child(part);',
    '        if (next == null) {',
    '            if (!createMissing) throw new NoSuchFileException(path);',
    '            next = cur.addChild(new Directory(part));',
    '        }',
    '        if (!next.isDirectory()) throw new NotADirectoryException(part);',
    '        cur = (Directory) next;',
    '    }',
    '    return cur;',
    '}'],
   'One traversal method with a flag serves mkdir, ls, and read. Writing three near-identical walkers is the duplication interviewers notice.']
 ],
 concurrency:[
  ['Two threads creating the same directory','computeIfAbsent on the children map makes creation atomic. Check-then-put races.'],
  ['Reading while another thread writes a file','Either a lock per file, or copy-on-write content so readers always see a consistent snapshot.'],
  ['Locking granularity','A lock on the whole filesystem is correct and useless. Lock the directory being mutated, and take locks in path order to avoid deadlock.']
 ],
 extend:[
  ['"Add permissions"','A Permission on FsNode plus a check in the facade before every operation. Composite means one check point covers files and directories alike.'],
  ['"Add symlinks"','A third FsNode subtype holding a target path, with cycle detection during traversal. Say the cycle detection out loud.'],
  ['"Add search with wildcards"','A Visitor walking the tree with a matcher. Do not add a search method to every node class.'],
  ['"Compute directory size"','Already there — the recursive size() falls straight out of Composite, which is why the pattern earns its place.']
 ],
 cross:[
  ['Why Composite here?','Because a directory contains files AND directories, and callers should not care which. One base type makes recursion natural — size, search and delete are all one method.'],
  ['Why TreeMap for children?','ls must be sorted. TreeMap keeps that invariant instead of sorting on every listing.'],
  ['How do you avoid three copies of path parsing?','One traverse method with a create-missing flag, plus a Path value object owning the parsing. String splitting scattered across methods is where the bugs live.'],
  ['ls on a file rather than a directory?','Returns just that file name. An edge case explicitly worth confirming during clarification — it is the one LC 588 tests.'],
  ['How would you persist this?','Serialise the tree, or keep a write-ahead log of operations and replay. The in-memory design does not change; a Repository interface is the seam.']
 ],
 fail:[
  'Separate unrelated File and Directory classes with no shared base, forcing instanceof everywhere.',
  'Path parsing duplicated in every method.',
  'HashMap for children, then forgetting ls must be sorted.',
  'No handling of intermediate directories in mkdir.',
  'Adding a search method to every node class instead of using a visitor.'
 ]},

{id:'ridehail', name:'Ride-Hailing (machine coding)', tier:'c', flavour:'Machine coding, 90 min', mins:90,
 who:'UBER — their actual round · Flipkart · Ola. You must FINISH.',
 asked:[
  'Build a ride-hailing service: riders, drivers, matching, trip lifecycle.',
  'Runnable, tested code in 90 minutes.',
  'Add surge pricing.',
  'A driver declines. What happens next?'
 ],
 clarify:[
  'How is a driver matched — nearest, or first to accept?',
  'Can a driver decline? (that turns matching into an offer loop, not one decision)',
  'Do we model real geography, or is a 2D grid acceptable? (say grid, and say why)',
  'Is payment in scope? (usually stub it)',
  'How much do we need to persist? (nothing — in memory)'
 ],
 entities:[
  ['RideService','class','The facade: requestRide, acceptRide, startTrip, endTrip.'],
  ['Rider / Driver','class','id, name, current Location, status.'],
  ['DriverStatus','enum','OFFLINE, AVAILABLE, OFFERED, ON_TRIP.'],
  ['Trip','class','rider, driver, source, destination, TripStatus, fare.'],
  ['TripStatus','enum / State','REQUESTED, MATCHED, STARTED, COMPLETED, CANCELLED.'],
  ['Location','record','lat, lng — or grid x, y for a machine-coding round.'],
  ['MatchingStrategy','interface','nearest, highest-rated, batched.'],
  ['PricingStrategy','interface','base plus distance, with a surge multiplier.'],
  ['DriverIndex','class','Spatial lookup. A grid of buckets is enough; say H3 is what production uses.']
 ],
 patterns:[
  ['Strategy','Matching and pricing — the two things they will ask you to swap.'],
  ['State','Trip lifecycle with legal transitions.'],
  ['Observer','Notifying rider and driver on status changes.'],
  ['Factory','Optional, for creating trips.']
 ],
 code:[
  ['Ship this skeleton in the first 20 minutes',
   ['public class RideService {',
    '    private final DriverIndex index;',
    '    private final MatchingStrategy matcher;',
    '    private final PricingStrategy pricing;',
    '    private final Map<String, Trip> trips = new ConcurrentHashMap<>();',
    '',
    '    public Trip requestRide(Rider rider, Location from, Location to) {',
    '        List<Driver> nearby = index.within(from, RADIUS_KM);',
    '        Driver chosen = matcher.choose(nearby, from)',
    '                .orElseThrow(() -> new NoDriverAvailableException(from));',
    '        if (!chosen.tryOffer()) return requestRide(rider, from, to);  // someone beat us',
    '        Trip trip = new Trip(rider, chosen, from, to, pricing.quote(from, to));',
    '        trips.put(trip.id(), trip);',
    '        return trip;',
    '    }',
    '}',
    '',
    '// then main() with a demo run, THEN enrich'],
   'In a machine-coding round the order matters more than the design. A running end-to-end path at minute 20 beats a beautiful class diagram at minute 85.'],
  ['The double-assignment race',
   ['public class Driver {',
    '    private final AtomicReference<DriverStatus> status =',
    '            new AtomicReference<>(DriverStatus.AVAILABLE);',
    '',
    '    public boolean tryOffer() {',
    '        return status.compareAndSet(AVAILABLE, OFFERED);',
    '    }',
    '    public boolean accept() {',
    '        return status.compareAndSet(OFFERED, ON_TRIP);',
    '    }',
    '    public void decline() {',
    '        status.compareAndSet(OFFERED, AVAILABLE);   // back in the pool',
    '    }',
    '}'],
   'Two riders must never be matched to one driver. compareAndSet on the driver status is the whole answer, and it is the correctness question the round is built around.'],
  ['Spatial lookup without over-engineering',
   ['public class GridIndex implements DriverIndex {',
    '    private final double cell;   // e.g. 1 km',
    '    private final Map<Cell, Set<Driver>> buckets = new ConcurrentHashMap<>();',
    '',
    '    public List<Driver> within(Location l, double km) {',
    '        // own cell plus neighbours - never scan every driver',
    '        return cellsAround(l, km).stream()',
    '                .flatMap(c -> buckets.getOrDefault(c, Set.of()).stream())',
    '                .filter(d -> d.location().distanceTo(l) <= km)',
    '                .toList();',
    '    }',
    '}'],
   'A grid is entirely acceptable in a 90-minute round. Say the production answer is H3 or S2, and that you are choosing a grid deliberately for time — that reads as judgement, not ignorance.']
 ],
 concurrency:[
  ['Two riders matched to one driver','compareAndSet on driver status. Exactly one offer wins.'],
  ['Driver never responds to the offer','Timeout, say 15 seconds, then compareAndSet OFFERED back to AVAILABLE and offer the next candidate. The offer loop is the product.'],
  ['Location updates at high frequency','A ConcurrentHashMap of buckets with the driver moved between cells on update. Do not persist every ping.'],
  ['Trip state transitions','Guard them so endTrip cannot fire before startTrip.']
 ],
 extend:[
  ['"Add surge pricing"','A PricingStrategy reading the supply/demand ratio for the cell. Smoothed over a window, or the price flaps and riders revolt.'],
  ['"Add ride pooling"','Trip gains multiple riders and an ordered list of waypoints; matching becomes a route-compatibility check. Say it is a genuinely harder problem.'],
  ['"Add driver ratings into matching"','A different MatchingStrategy. Nothing else changes — that is the payoff.'],
  ['"Scale to a city"','Hand-off to system design: the grid becomes H3, the in-memory index becomes Redis, matching becomes batched every few seconds rather than greedy per request.']
 ],
 cross:[
  ['How do you find nearby drivers without scanning everyone?','Bucket drivers into grid cells and query the cell plus its neighbours. Production uses H3 hexagons because neighbour distance is uniform.'],
  ['Two riders request at the same instant and one driver is nearest.','compareAndSet on the driver status. The loser re-runs matching against the remaining pool.'],
  ['The driver does not accept.','A timeout returns them to AVAILABLE and the next candidate is offered. Matching is a sequence of offers, not a single decision — modelling it as one decision is the common mistake.'],
  ['Why a grid and not a quadtree?','Uniform cells are simpler and adequate at this time budget. A quadtree adapts to density, which matters when a city centre is a thousand times denser than the suburbs. Naming the trade-off is the point.'],
  ['You have 15 minutes left and pooling is not done.','Say so, state what you would do, and make sure what exists runs and is tested. A finished subset beats an unfinished superset in this round, always.']
 ],
 fail:[
  'Designing for 60 minutes and coding for 30. This round is scored on finishing.',
  'Scanning every driver to find the nearest.',
  'No answer for the double-assignment race.',
  'Modelling matching as one decision rather than an offer loop with timeouts.',
  'Building persistence nobody asked for.'
 ]},

{id:'ratelimiter', name:'Rate Limiter / Logger (as objects)', tier:'c', flavour:'Amazon hybrid', mins:35,
 who:'Amazon · Uber · Google. The LLD half of the system design session.',
 asked:[
  'Design a rate limiter as a class.',
  'Implement a token bucket.',
  'Design a logger that accepts a message at most once every 10 seconds.',
  'Now make it work across 50 servers.'
 ],
 clarify:[
  'Per user, per IP, per API key?',
  'Must it be exact, or is approximate acceptable?',
  'Single process, or distributed?',
  'What do we do when the limit is hit — reject, queue, or throttle?'
 ],
 entities:[
  ['RateLimiter','interface','tryAcquire(key) — the seam that lets you swap algorithms.'],
  ['TokenBucketLimiter','class','capacity, refillRate, lastRefill per key.'],
  ['SlidingWindowLimiter','class','Weighted previous and current window counts.'],
  ['FixedWindowLimiter','class','The naive one. Implement it to show you know why it is wrong.'],
  ['Bucket','class','Per-key state. The unit of contention.'],
  ['ClockSource','interface','Injected so tests are not slow and flaky.']
 ],
 patterns:[
  ['Strategy','RateLimiter implementations behind one interface.'],
  ['Decorator','Layering a limiter over any service call.'],
  ['Factory','Choosing a limiter per endpoint or per tier.']
 ],
 code:[
  ['Token bucket with lazy refill',
   ['public class TokenBucket {',
    '    private final long capacity;',
    '    private final double refillPerSecond;',
    '    private double tokens;',
    '    private long lastRefillNanos;',
    '    private final Clock clock;                     // INJECTED - testability',
    '',
    '    public synchronized boolean tryAcquire(int permits) {',
    '        refill();',
    '        if (tokens >= permits) { tokens -= permits; return true; }',
    '        return false;',
    '    }',
    '',
    '    private void refill() {',
    '        long now = clock.nanoTime();',
    '        double add = (now - lastRefillNanos) / 1e9 * refillPerSecond;',
    '        tokens = Math.min(capacity, tokens + add);   // lazy: no background thread',
    '        lastRefillNanos = now;',
    '    }',
    '}'],
   'Lazy refill on access, not a scheduled thread topping up a million buckets. Injecting the clock means a test can assert refill behaviour without sleeping — mention it, because interviewers notice untestable time handling.'],
  ['Why fixed window is wrong, in code',
   ['// FIXED WINDOW: limit 100/min',
    '// 100 requests at 11:00:59 and 100 more at 11:01:00',
    '// = 200 in one second, and every one is "legal"',
    '',
    '// SLIDING WINDOW COUNTER - weighted blend, tiny memory',
    'public boolean allow(String key) {',
    '    long now = clock.millis();',
    '    long windowStart = now - (now % windowMs);',
    '    double elapsed = (now - windowStart) / (double) windowMs;',
    '    Counts c = counts.get(key);',
    '    double estimate = c.previous * (1 - elapsed) + c.current;',
    '    if (estimate >= limit) return false;',
    '    c.current++;',
    '    return true;',
    '}'],
   'Being able to state the boundary-burst problem AND write the fix is what separates this from a memorised definition.']
 ],
 concurrency:[
  ['Many threads hitting one key','synchronized on the bucket, not on the limiter. Per-key locking keeps unrelated users independent.'],
  ['A map of millions of buckets','Use ConcurrentHashMap with computeIfAbsent, and evict idle buckets or you leak memory forever. Interviewers ask about this.'],
  ['Distributed across 50 servers','Central Redis with an atomic INCR and expiry, or a Lua script for the token bucket. Local counters with periodic sync are approximate but survive Redis being down.'],
  ['Fail-open','If the limiter itself fails, let traffic through with a conservative local fallback. A limiter that causes an outage is worse than no limiter.']
 ],
 extend:[
  ['"Different limits per API tier"','Configuration keyed by tier, resolved by the factory. No code change to add a tier.'],
  ['"Expensive endpoints cost more"','Weighted permits — tryAcquire(10) for a heavy call. The bucket already supports it.'],
  ['"Make it distributed"','Redis INCR with TTL, or a Lua script for atomic token-bucket refill-and-take. Name the extra round trip as the cost.'],
  ['"Add a logger that rate-limits identical messages"','LC 359: a map of message to next-allowed timestamp. Same shape, and mention the memory leak if you never evict.']
 ],
 cross:[
  ['Fixed window — show me the flaw.','A 100-per-minute limit permits 200 in one second across the boundary: 100 at 11:00:59 and 100 at 11:01:00. That is why sliding window or token bucket exists.'],
  ['Why lazy refill rather than a scheduler?','A background thread refilling a million buckets is enormous waste. Computing elapsed time on access is exact and free.'],
  ['Where do you put the lock?','On the bucket, one per key. Locking the limiter serialises every user against every other user.'],
  ['Millions of keys — what breaks?','Unbounded memory. Evict idle buckets with an LRU or a TTL. This is the follow-up people miss.'],
  ['What if Redis is down in the distributed version?','Fail open with a conservative local limit. State it explicitly — availability of your API matters more than perfect enforcement.']
 ],
 fail:[
  'Answering with fixed window and not knowing the boundary burst.',
  'A background refill thread per bucket.',
  'Locking the whole limiter instead of the bucket.',
  'Unbounded bucket map with no eviction.',
  'Using System.currentTimeMillis() directly, making the class untestable.'
 ]}

]);




/* ==================================================== DESIGN PATTERNS ===
   The catalogue. Not all 23 GoF - the ones that actually appear, each with
   a runnable example, an ASCII class diagram, and where it shows up in the
   LLD problems.

   Per pattern:
     intent    one sentence
     fires     the phrasing that should make you reach for it
     uml       ASCII class diagram
     code      a complete, compilable example
     used      which LLD problems in this repo use it
     vs        the pattern it is most often confused with, and the tell
     gotchas   how it goes wrong                                          */

PLAN.patterns = [

{id:'strategy', name:'Strategy', cat:'Behavioural', rank:1,
 intent:'Encapsulate interchangeable algorithms behind one interface so the caller picks at runtime.',
 fires:[
  '"support multiple algorithms for X, swappable"',
  '"pricing depends on the vehicle type / day / demand"',
  '"we might change how this is calculated later"',
  'A switch statement that grows every time a new type appears'
 ],
 uml:[
  '           ┌──────────────────┐',
  '           │     Context      │',
  '           │  (ParkingLot)    │',
  '           ├──────────────────┤',
  '           │ -strategy        │───────┐',
  '           │ +checkout()      │       │ uses',
  '           └──────────────────┘       │',
  '                                      ▼',
  '                        ┌───────────────────────────┐',
  '                        │      «interface»          │',
  '                        │     PricingStrategy       │',
  '                        ├───────────────────────────┤',
  '                        │ +fee(Ticket) : BigDecimal │',
  '                        └─────────────△─────────────┘',
  '                                      │ implements',
  '                ┌─────────────────────┼─────────────────────┐',
  '                │                     │                     │',
  '     ┌──────────┴───────┐  ┌──────────┴──────┐  ┌───────────┴──────┐',
  '     │  HourlyPricing   │  │ WeekendPricing  │  │  FlatRatePricing │',
  '     └──────────────────┘  └─────────────────┘  └──────────────────┘'
 ],
 code:[
  'public interface PricingStrategy {',
  '    BigDecimal fee(Ticket ticket);',
  '}',
  '',
  'public class HourlyPricing implements PricingStrategy {',
  '    private final Map<VehicleType, BigDecimal> ratePerHour;',
  '',
  '    public HourlyPricing(Map<VehicleType, BigDecimal> ratePerHour) {',
  '        this.ratePerHour = Map.copyOf(ratePerHour);',
  '    }',
  '',
  '    @Override public BigDecimal fee(Ticket t) {',
  '        long hours = Math.max(1, Duration.between(t.entry(), t.exit()).toHours());',
  '        return ratePerHour.get(t.vehicle().type())',
  '                          .multiply(BigDecimal.valueOf(hours));',
  '    }',
  '}',
  '',
  'public class WeekendPricing implements PricingStrategy {',
  '    private final PricingStrategy base;',
  '    private final BigDecimal multiplier;',
  '',
  '    @Override public BigDecimal fee(Ticket t) {',
  '        BigDecimal fee = base.fee(t);',
  '        DayOfWeek day = t.entry().atZone(ZoneId.systemDefault()).getDayOfWeek();',
  '        boolean weekend = day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;',
  '        return weekend ? fee.multiply(multiplier) : fee;',
  '    }',
  '}',
  '',
  '// the context never names a concrete strategy',
  'public class ParkingLot {',
  '    private final PricingStrategy pricing;',
  '    public ParkingLot(PricingStrategy pricing) { this.pricing = pricing; }',
  '',
  '    public Receipt checkout(Ticket t) {',
  '        t.markExit(Instant.now());',
  '        return new Receipt(t, pricing.fee(t));',
  '    }',
  '}'
 ],
 used:'Parking Lot (pricing, allocation) · Elevator (scheduling) · Splitwise (split types, settlement) · Notification (channel) · Ride-hailing (matching, surge) · Rate limiter (algorithm)',
 vs:'STATE. Both hold an object and delegate. The tell: with Strategy the CALLER chooses and it does not change by itself; with State the object changes its own state as a result of the operation.',
 gotchas:[
  'Creating an interface with exactly one implementation and no plausible second. That is ceremony, not design.',
  'Passing the whole context into the strategy, which recreates the coupling you were removing.',
  'Strategies holding mutable state — they are usually shared, so keep them stateless.'
 ]},

{id:'state', name:'State', cat:'Behavioural', rank:2,
 intent:'Let an object change its behaviour when its internal state changes, so it appears to change class.',
 fires:[
  '"the machine behaves differently depending on its mode"',
  '"the user presses the button before inserting money"',
  '"can a DELIVERED order be cancelled?"',
  'A switch over a status enum repeated in five methods'
 ],
 uml:[
  '      ┌────────────────────┐',
  '      │      Context       │',
  '      │  (VendingMachine)  │',
  '      ├────────────────────┤',
  '      │ -state             │──────┐',
  '      │ +insertCoin()      │      │ delegates',
  '      │ +selectItem()      │      │',
  '      │ +setState(s)       │◄─────┼──── states transition the context',
  '      └────────────────────┘      │',
  '                                  ▼',
  '                   ┌────────────────────────────┐',
  '                   │       «interface»          │',
  '                   │      VendingState          │',
  '                   ├────────────────────────────┤',
  '                   │ +insertCoin(machine, coin) │',
  '                   │ +selectItem(machine, code) │',
  '                   │ +dispense(machine)         │',
  '                   │ +cancel(machine)           │',
  '                   └─────────────△──────────────┘',
  '           ┌─────────────────────┼──────────────────────┐',
  '     ┌─────┴──────┐   ┌──────────┴──────┐   ┌───────────┴──────┐',
  '     │ IdleState  │──▶│ HasMoneyState   │──▶│ DispensingState  │',
  '     └────────────┘   └─────────────────┘   └──────────────────┘',
  '            ▲                                        │',
  '            └────────────────────────────────────────┘'
 ],
 code:[
  'public interface VendingState {',
  '    void insertCoin(VendingMachine m, Coin c);',
  '    void selectItem(VendingMachine m, String code);',
  '    void dispense(VendingMachine m);',
  '    void cancel(VendingMachine m);',
  '}',
  '',
  'public class IdleState implements VendingState {',
  '    @Override public void insertCoin(VendingMachine m, Coin c) {',
  '        m.addToBalance(c.value());',
  '        m.setState(new HasMoneyState());        // the state drives the transition',
  '    }',
  '    @Override public void selectItem(VendingMachine m, String code) {',
  '        throw new IllegalStateException("insert money first");',
  '    }',
  '    @Override public void dispense(VendingMachine m) {',
  '        throw new IllegalStateException("nothing selected");',
  '    }',
  '    @Override public void cancel(VendingMachine m) { /* nothing to refund */ }',
  '}',
  '',
  'public class HasMoneyState implements VendingState {',
  '    @Override public void insertCoin(VendingMachine m, Coin c) {',
  '        m.addToBalance(c.value());              // more money is fine',
  '    }',
  '    @Override public void selectItem(VendingMachine m, String code) {',
  '        Item item = m.inventory().find(code);',
  '        if (item == null || m.inventory().countOf(code) == 0)',
  '            throw new OutOfStockException(code);',
  '        if (m.balance() < item.price())',
  '            throw new InsufficientFundsException(item.price() - m.balance());',
  '        m.select(item);',
  '        m.setState(new DispensingState());',
  '    }',
  '    @Override public void dispense(VendingMachine m) {',
  '        throw new IllegalStateException("select an item first");',
  '    }',
  '    @Override public void cancel(VendingMachine m) {',
  '        m.refund(m.balance());',
  '        m.setState(new IdleState());',
  '    }',
  '}',
  '',
  '// the context is thin - it just delegates',
  'public class VendingMachine {',
  '    private VendingState state = new IdleState();',
  '    public void setState(VendingState s) { this.state = s; }',
  '',
  '    public void insertCoin(Coin c)        { state.insertCoin(this, c); }',
  '    public void selectItem(String code)   { state.selectItem(this, code); }',
  '    public void cancel()                  { state.cancel(this); }',
  '}'
 ],
 used:'Vending Machine · ATM · Elevator · Order lifecycle · Booking lifecycle · Trip lifecycle',
 vs:'STRATEGY. Strategy is chosen from outside and stays put. State replaces itself as a consequence of the operation. If your "strategy" calls setStrategy on the context, it is really a State.',
 gotchas:[
  'A state enum plus a switch. That is the thing State exists to replace, and interviewers ask this problem specifically to see which you write.',
  'Forgetting to implement an action in one state, so an illegal transition silently succeeds. Every state must answer every action.',
  'Allocating a new state object per transition when the states are stateless — make them singletons or enum constants.'
 ]},

{id:'factory', name:'Factory Method & Abstract Factory', cat:'Creational', rank:3,
 intent:'Create objects without the caller naming the concrete class.',
 fires:[
  '"create the right object based on a type code"',
  '"add a new vehicle / piece / notification channel"',
  'A new keyword scattered through business logic',
  '"we need to swap the whole family of objects for tests"'
 ],
 uml:[
  '   ┌─────────────────┐          ┌──────────────────┐',
  '   │  VehicleFactory │─────────▶│   «abstract»     │',
  '   ├─────────────────┤ creates  │     Vehicle      │',
  '   │ +create(type)   │          ├──────────────────┤',
  '   └─────────────────┘          │ +type()          │',
  '                                └────────△─────────┘',
  '                                         │',
  '                    ┌────────────────────┼────────────────────┐',
  '              ┌─────┴─────┐        ┌─────┴─────┐        ┌─────┴─────┐',
  '              │    Car    │        │   Bike    │        │   Truck   │',
  '              └───────────┘        └───────────┘        └───────────┘'
 ],
 code:[
  '// --- Factory Method: one product family, chosen by a key ---',
  'public class VehicleFactory {',
  '    private static final Map<VehicleType, Function<String, Vehicle>> REGISTRY =',
  '        Map.of(',
  '            VehicleType.CAR,   Car::new,',
  '            VehicleType.BIKE,  Bike::new,',
  '            VehicleType.TRUCK, Truck::new',
  '        );',
  '',
  '    public static Vehicle create(VehicleType type, String plate) {',
  '        Function<String, Vehicle> ctor = REGISTRY.get(type);',
  '        if (ctor == null) throw new IllegalArgumentException("unknown type " + type);',
  '        return ctor.apply(plate);',
  '    }',
  '}',
  '',
  '// A registry map beats a switch: adding a type is one entry, and the',
  '// method never changes. In Spring you would inject Map<VehicleType, Vehicle>',
  '// and let the container populate it.',
  '',
  '// --- Abstract Factory: a whole FAMILY of related products ---',
  'public interface NotificationFactory {',
  '    Sender   sender();',
  '    Template template();',
  '    Formatter formatter();',
  '}',
  '',
  'public class EmailFactory implements NotificationFactory {',
  '    public Sender    sender()    { return new SmtpSender(); }',
  '    public Template  template()  { return new HtmlTemplate(); }',
  '    public Formatter formatter() { return new HtmlFormatter(); }',
  '}',
  '',
  'public class SmsFactory implements NotificationFactory {',
  '    public Sender    sender()    { return new TwilioSender(); }',
  '    public Template  template()  { return new PlainTemplate(); }',
  '    public Formatter formatter() { return new PlainFormatter(); }',
  '}',
  '',
  '// the caller gets a consistent SET - never an HTML template with a plain sender'
 ],
 used:'Parking Lot (vehicles) · Chess (pieces) · Notification (channels) · ATM (transactions)',
 vs:'BUILDER. Factory decides WHICH class to build; Builder handles HOW to build one complicated object step by step. Use Factory for polymorphism, Builder for many optional parameters.',
 gotchas:[
  'A factory that is just a switch you still have to edit. Prefer a registry map so adding a type is data, not code.',
  'Static factories that cannot be mocked. If the factory has dependencies, make it an injected bean.',
  'Calling it "Abstract Factory" when there is one product. That is a Factory Method.'
 ]},

{id:'observer', name:'Observer', cat:'Behavioural', rank:4,
 intent:'When one object changes, notify every dependent automatically, without the subject knowing who they are.',
 fires:[
  '"notify all N when this changes"',
  '"the display board must update when a spot frees"',
  '"send an email when the order ships"',
  '"add analytics without touching the core flow"'
 ],
 uml:[
  '   ┌────────────────────┐              ┌────────────────────┐',
  '   │      Subject       │              │    «interface»     │',
  '   │   (OrderService)   │─────────────▶│    OrderObserver   │',
  '   ├────────────────────┤   notifies   ├────────────────────┤',
  '   │ -observers : List  │              │ +onEvent(Order)    │',
  '   │ +subscribe(o)      │              └─────────△──────────┘',
  '   │ +notifyAll(event)  │                        │',
  '   └────────────────────┘        ┌───────────────┼───────────────┐',
  '                          ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐',
  '                          │ EmailNotify │ │ AuditLogger │ │  Analytics  │',
  '                          └─────────────┘ └─────────────┘ └─────────────┘'
 ],
 code:[
  'public interface OrderObserver {',
  '    void onStatusChanged(Order order, OrderStatus from, OrderStatus to);',
  '}',
  '',
  'public class OrderService {',
  '    // CopyOnWriteArrayList: safe to iterate while another thread subscribes',
  '    private final List<OrderObserver> observers = new CopyOnWriteArrayList<>();',
  '',
  '    public void subscribe(OrderObserver o)   { observers.add(o); }',
  '    public void unsubscribe(OrderObserver o) { observers.remove(o); }',
  '',
  '    private void publish(Order o, OrderStatus from, OrderStatus to) {',
  '        for (OrderObserver obs : observers) {',
  '            try {',
  '                obs.onStatusChanged(o, from, to);',
  '            } catch (RuntimeException e) {',
  '                // ONE failing observer must not break the others,',
  '                // and must not roll back the order',
  '                log.error("observer {} failed", obs.getClass().getSimpleName(), e);',
  '            }',
  '        }',
  '    }',
  '',
  '    public void ship(Order order) {',
  '        OrderStatus from = order.status();',
  '        order.transitionTo(OrderStatus.SHIPPED);',
  '        publish(order, from, OrderStatus.SHIPPED);',
  '    }',
  '}',
  '',
  '// In Spring this is ApplicationEventPublisher + @EventListener, and',
  '// @TransactionalEventListener(AFTER_COMMIT) so you do not email a customer',
  '// about an order whose transaction then rolls back.'
 ],
 used:'Parking Lot (display boards) · Elevator (floor indicators) · Order (status notifications) · Notification system · Chess (move log)',
 vs:'PUB/SUB. Observer is in-process and the subject holds direct references. Pub/sub goes through a broker and the publisher does not know subscribers exist at all. Spring events are Observer; Kafka is pub/sub.',
 gotchas:[
  'Not catching exceptions in the notify loop, so one bad observer breaks the business operation.',
  'Observers never unsubscribed — the classic memory leak in a long-lived subject.',
  'Doing slow work (email, HTTP) synchronously inside onEvent, so the core flow waits for it.'
 ]},

{id:'decorator', name:'Decorator', cat:'Structural', rank:5,
 intent:'Add behaviour to an object by wrapping it, without subclassing and without changing the original.',
 fires:[
  '"add toppings / add-ons in any combination"',
  '"add retry, then logging, then rate limiting, around this call"',
  '"discounts should stack"',
  'A subclass explosion: CoffeeWithMilkAndSugarAndCream'
 ],
 uml:[
  '           ┌──────────────────┐',
  '           │   «interface»    │',
  '           │     Beverage     │◄──────────────────┐',
  '           ├──────────────────┤                   │ wraps',
  '           │ +cost() : Money  │                   │',
  '           │ +description()   │                   │',
  '           └────────△─────────┘                   │',
  '                    │                             │',
  '        ┌───────────┴────────┐      ┌─────────────┴────────────┐',
  '        │     Espresso       │      │  «abstract» AddOn        │',
  '        │   (the base)       │      ├──────────────────────────┤',
  '        └────────────────────┘      │ -wrapped : Beverage      │',
  '                                    └────────────△─────────────┘',
  '                                     ┌───────────┼───────────┐',
  '                              ┌──────┴─────┐ ┌───┴────┐ ┌────┴─────┐',
  '                              │    Milk    │ │  Sugar │ │  Cream   │',
  '                              └────────────┘ └────────┘ └──────────┘'
 ],
 code:[
  'public interface Beverage {',
  '    BigDecimal cost();',
  '    String description();',
  '}',
  '',
  'public class Espresso implements Beverage {',
  '    public BigDecimal cost()   { return new BigDecimal("2.00"); }',
  '    public String description(){ return "Espresso"; }',
  '}',
  '',
  'public abstract class AddOn implements Beverage {',
  '    protected final Beverage wrapped;',
  '    protected AddOn(Beverage wrapped) { this.wrapped = wrapped; }',
  '}',
  '',
  'public class Milk extends AddOn {',
  '    public Milk(Beverage b) { super(b); }',
  '    public BigDecimal cost()    { return wrapped.cost().add(new BigDecimal("0.50")); }',
  '    public String description() { return wrapped.description() + " + milk"; }',
  '}',
  '',
  '// compose freely, no combinatorial subclasses',
  'Beverage order = new Sugar(new Milk(new Milk(new Espresso())));',
  'order.cost();          // 3.50',
  'order.description();   // "Espresso + milk + milk + sugar"',
  '',
  '// --- the version you actually meet at work ---',
  'public class RetryingChannel implements Channel {',
  '    private final Channel delegate;',
  '    private final int attempts;',
  '',
  '    @Override public DeliveryResult send(Notification n) {',
  '        RuntimeException last = null;',
  '        for (int i = 0; i < attempts; i++) {',
  '            try { return delegate.send(n); }',
  '            catch (TransientException e) { last = e; sleepBackoff(i); }',
  '        }',
  '        throw last;',
  '    }',
  '}',
  '',
  'Channel c = new RateLimited(new Retrying(new Metered(new EmailChannel())));'
 ],
 used:'Notification (retry / rate-limit / metrics wrappers) · LRU cache (TTL, stats) · Order (stacking discounts)',
 vs:'PROXY. Both wrap and implement the same interface. Decorator ADDS behaviour and you stack several; Proxy CONTROLS ACCESS (lazy loading, permission, remoting) and there is normally one.',
 gotchas:[
  'Order matters and is easy to get wrong: retry inside rate-limit consumes N permits per logical call.',
  'Deep wrapping makes stack traces awful. Name the classes clearly.',
  'Decorating an interface with many methods means writing them all; consider an abstract delegating base.'
 ]},

{id:'command', name:'Command', cat:'Behavioural', rank:6,
 intent:'Turn a request into an object, so it can be queued, logged, and undone.',
 fires:[
  '"add undo and redo"',
  '"queue these operations"',
  '"replay the game / audit what happened"',
  '"schedule this to run later"'
 ],
 uml:[
  '  ┌──────────────┐      ┌────────────────────┐      ┌──────────────┐',
  '  │   Invoker    │─────▶│    «interface»     │─────▶│   Receiver   │',
  '  │  (GameEngine)│      │    GameCommand     │ acts │   (Board)    │',
  '  ├──────────────┤      ├────────────────────┤  on  ├──────────────┤',
  '  │ -undoStack   │      │ +execute(board)    │      │ +place()     │',
  '  │ -redoStack   │      │ +undo(board)       │      │ +remove()    │',
  '  │ +run(cmd)    │      └─────────△──────────┘      └──────────────┘',
  '  │ +undo()      │                │',
  '  └──────────────┘   ┌────────────┼────────────┐',
  '              ┌──────┴─────┐ ┌────┴─────┐ ┌────┴──────┐',
  '              │MoveCommand │ │CastleCmd │ │PromoteCmd │',
  '              └────────────┘ └──────────┘ └───────────┘'
 ],
 code:[
  'public interface GameCommand {',
  '    void execute(Board board);',
  '    void undo(Board board);',
  '}',
  '',
  'public class MoveCommand implements GameCommand {',
  '    private final Position from, to;',
  '    private Piece moved;',
  '    private Piece captured;          // remembered so undo can restore it',
  '',
  '    public MoveCommand(Position from, Position to) {',
  '        this.from = from; this.to = to;',
  '    }',
  '',
  '    @Override public void execute(Board b) {',
  '        moved    = b.remove(from);',
  '        captured = b.pieceAt(to);    // may be null',
  '        b.place(to, moved);',
  '    }',
  '',
  '    @Override public void undo(Board b) {',
  '        b.remove(to);',
  '        b.place(from, moved);',
  '        if (captured != null) b.place(to, captured);',
  '    }',
  '}',
  '',
  'public class GameEngine {',
  '    private final Deque<GameCommand> undoStack = new ArrayDeque<>();',
  '    private final Deque<GameCommand> redoStack = new ArrayDeque<>();',
  '',
  '    public void run(GameCommand cmd) {',
  '        cmd.execute(board);',
  '        undoStack.push(cmd);',
  '        redoStack.clear();           // a new move invalidates the redo branch',
  '    }',
  '',
  '    public void undo() {',
  '        if (undoStack.isEmpty()) return;',
  '        GameCommand cmd = undoStack.pop();',
  '        cmd.undo(board);',
  '        redoStack.push(cmd);',
  '    }',
  '',
  '    public void redo() {',
  '        if (redoStack.isEmpty()) return;',
  '        GameCommand cmd = redoStack.pop();',
  '        cmd.execute(board);',
  '        undoStack.push(cmd);',
  '    }',
  '}'
 ],
 used:'Chess / Tic-Tac-Toe (undo, move log) · Text editor · ATM (transactions) · Job scheduler',
 vs:'STRATEGY. Strategy answers "how do I do this?" and is usually stateless. Command answers "do this specific thing, and remember enough to undo it" — it captures the ARGUMENTS as well as the action.',
 gotchas:[
  'A command that stores only its inputs, so undo cannot restore what it destroyed. Capture the previous state during execute.',
  'Forgetting to clear the redo stack after a new command, producing an impossible history.',
  'Commands holding references to huge objects, so the undo stack becomes a memory leak.'
 ]},

{id:'builder', name:'Builder', cat:'Creational', rank:7,
 intent:'Construct a complex object step by step, so the caller is not facing a ten-argument constructor.',
 fires:[
  '"lots of optional parameters"',
  'Telescoping constructors: new Pizza(size, cheese, true, false, null, 2)',
  '"the object must be valid once built, and immutable after"',
  '"different representations from the same construction process"'
 ],
 uml:[
  '   ┌─────────────────────────┐',
  '   │      Notification       │  ◄── immutable once built',
  '   ├─────────────────────────┤',
  '   │ -recipient, -channel    │',
  '   │ -priority, -template    │',
  '   │ -payload, -ttl          │',
  '   └────────────△────────────┘',
  '                │ build()',
  '   ┌────────────┴────────────┐',
  '   │  Notification.Builder   │',
  '   ├─────────────────────────┤',
  '   │ +to(User)     : Builder │  ◄── each returns this,',
  '   │ +via(Channel) : Builder │      so calls chain',
  '   │ +priority(P)  : Builder │',
  '   │ +build()  : Notification│',
  '   └─────────────────────────┘'
 ],
 code:[
  'public final class Notification {',
  '    private final User recipient;',
  '    private final ChannelType channel;',
  '    private final Priority priority;',
  '    private final String templateId;',
  '    private final Map<String, Object> payload;',
  '',
  '    private Notification(Builder b) {      // private - only the builder constructs',
  '        this.recipient  = b.recipient;',
  '        this.channel    = b.channel;',
  '        this.priority   = b.priority;',
  '        this.templateId = b.templateId;',
  '        this.payload    = Map.copyOf(b.payload);',
  '    }',
  '',
  '    public static Builder to(User recipient) { return new Builder(recipient); }',
  '',
  '    public static final class Builder {',
  '        private final User recipient;                    // required',
  '        private ChannelType channel = ChannelType.EMAIL; // sensible defaults',
  '        private Priority priority   = Priority.NORMAL;',
  '        private String templateId;',
  '        private Map<String, Object> payload = new HashMap<>();',
  '',
  '        private Builder(User recipient) {',
  '            this.recipient = Objects.requireNonNull(recipient);',
  '        }',
  '',
  '        public Builder via(ChannelType c)      { this.channel = c; return this; }',
  '        public Builder priority(Priority p)    { this.priority = p; return this; }',
  '        public Builder template(String id)     { this.templateId = id; return this; }',
  '        public Builder with(String k, Object v){ this.payload.put(k, v); return this; }',
  '',
  '        public Notification build() {',
  '            // validate HERE, so an invalid object can never exist',
  '            if (templateId == null)',
  '                throw new IllegalStateException("templateId is required");',
  '            if (channel == ChannelType.SMS && payload.containsKey("html"))',
  '                throw new IllegalStateException("SMS cannot carry html");',
  '            return new Notification(this);',
  '        }',
  '    }',
  '}',
  '',
  '// reads like a sentence, and cannot be half-built',
  'Notification n = Notification.to(user)',
  '        .via(ChannelType.SMS)',
  '        .priority(Priority.CRITICAL)',
  '        .template("otp")',
  '        .with("code", "482913")',
  '        .build();'
 ],
 used:'Notification · Order / Cart · any config object · test data builders',
 vs:'FACTORY. Factory picks WHICH subclass. Builder configures ONE object with many optional parts. If you find yourself passing a type code to a builder, you wanted a factory.',
 gotchas:[
  'Validating in the constructor instead of build(), so a half-configured builder throws late and confusingly.',
  'A mutable object with setters called "a builder". If build() is missing, it is not one.',
  'Builders for three-field objects. A record or a constructor is clearer.'
 ]},

{id:'chain', name:'Chain of Responsibility', cat:'Behavioural', rank:8,
 intent:'Pass a request along a chain of handlers until one deals with it, so sender and receiver are decoupled.',
 fires:[
  '"dispense the amount using the notes we have"',
  '"check preferences, then quiet hours, then rate limit"',
  '"escalate approval by amount"',
  '"middleware / filters / interceptors"'
 ],
 uml:[
  '  request',
  '     │',
  '     ▼',
  '  ┌──────────────┐   next   ┌──────────────┐   next   ┌──────────────┐',
  '  │  Note2000    │─────────▶│   Note500    │─────────▶│   Note100    │',
  '  ├──────────────┤          ├──────────────┤          ├──────────────┤',
  '  │ handle(amt)  │          │ handle(amt)  │          │ handle(amt)  │',
  '  └──────────────┘          └──────────────┘          └──────────────┘',
  '   takes what it            takes what it             remainder must',
  '   can, passes the          can, passes on            be zero, else',
  '   remainder                                          throw'
 ],
 code:[
  'public abstract class NoteDispenser {',
  '    private NoteDispenser next;',
  '    protected final int denomination;',
  '    protected int available;',
  '',
  '    protected NoteDispenser(int denomination, int available) {',
  '        this.denomination = denomination;',
  '        this.available = available;',
  '    }',
  '',
  '    public NoteDispenser chainTo(NoteDispenser next) {',
  '        this.next = next;',
  '        return next;                       // fluent chaining',
  '    }',
  '',
  '    /** Plans a dispense WITHOUT mutating stock, so we can fail safely. */',
  '    public void plan(int amount, Map<Integer, Integer> plan) {',
  '        int give = Math.min(amount / denomination, available);',
  '        if (give > 0) {',
  '            plan.put(denomination, give);',
  '            amount -= give * denomination;',
  '        }',
  '        if (amount == 0) return;',
  '        if (next == null) throw new InsufficientNotesException(amount);',
  '        next.plan(amount, plan);',
  '    }',
  '}',
  '',
  '// wiring, largest first',
  'NoteDispenser root = new Note(2000, 10);',
  'root.chainTo(new Note(500, 20))',
  '    .chainTo(new Note(200, 30))',
  '    .chainTo(new Note(100, 50));',
  '',
  'Map<Integer,Integer> plan = new LinkedHashMap<>();',
  'root.plan(3700, plan);      // {2000=1, 500=3, 200=1}',
  '',
  '// --- the other everyday shape: a filter pipeline ---',
  'public interface SendFilter {',
  '    Optional<String> reject(Notification n, UserPreferences prefs);',
  '}',
  '',
  'for (SendFilter f : List.of(new OptOut(), new QuietHours(), new RateLimit())) {',
  '    Optional<String> reason = f.reject(n, prefs);',
  '    if (reason.isPresent()) return Result.suppressed(reason.get());',
  '}'
 ],
 used:'ATM (note dispensing) · Notification (pre-send filters) · any middleware or interceptor stack',
 vs:'DECORATOR. Both are chains. Decorator expects EVERY wrapper to run and add something; Chain expects ONE handler to deal with it and stop, or each to take a share and pass the remainder.',
 gotchas:[
  'No terminal handler, so an unhandled request falls off the end silently. Throw at the end.',
  'Mutating state as you walk the chain and then failing halfway. Plan first, commit after — as above.',
  'Chains built implicitly by ordering in a list nobody documents.'
 ]},

{id:'composite', name:'Composite', cat:'Structural', rank:9,
 intent:'Treat individual objects and compositions of objects uniformly through one interface.',
 fires:[
  '"directories contain files AND directories"',
  '"a group can contain sub-groups"',
  '"compute the total size / price of the whole tree"',
  'Recursive containment of any kind'
 ],
 uml:[
  '                ┌──────────────────────┐',
  '                │      «abstract»      │',
  '                │        FsNode        │◄────────┐',
  '                ├──────────────────────┤         │ 0..* children',
  '                │ +name()              │         │',
  '                │ +size() : int        │         │',
  '                │ +isDirectory()       │         │',
  '                └──────────△───────────┘         │',
  '                           │                     │',
  '           ┌───────────────┴───────────────┐     │',
  '   ┌───────┴────────┐            ┌─────────┴─────┴──┐',
  '   │      File      │            │    Directory     │',
  '   │  (leaf)        │            │   (composite)    │',
  '   ├────────────────┤            ├──────────────────┤',
  '   │ -content       │            │ -children : Map  │',
  '   │ +size()        │            │ +size() ── sums  │',
  '   └────────────────┘            └──────────────────┘'
 ],
 code:[
  'public abstract class FsNode {',
  '    protected final String name;',
  '    protected Directory parent;',
  '',
  '    protected FsNode(String name) { this.name = name; }',
  '',
  '    public String name()          { return name; }',
  '    public abstract boolean isDirectory();',
  '    public abstract int size();          // leaf returns own; composite recurses',
  '',
  '    public String absolutePath() {',
  '        return parent == null ? "/" + name : parent.absolutePath() + "/" + name;',
  '    }',
  '}',
  '',
  'public class File extends FsNode {',
  '    private final StringBuilder content = new StringBuilder();',
  '',
  '    public File(String name) { super(name); }',
  '    @Override public boolean isDirectory() { return false; }',
  '    @Override public int size()            { return content.length(); }',
  '',
  '    public void append(String s) { content.append(s); }',
  '    public String read()         { return content.toString(); }',
  '}',
  '',
  'public class Directory extends FsNode {',
  '    // TreeMap so ls() is lexicographically sorted for free',
  '    private final Map<String, FsNode> children = new TreeMap<>();',
  '',
  '    public Directory(String name) { super(name); }',
  '    @Override public boolean isDirectory() { return true; }',
  '',
  '    @Override public int size() {          // the payoff: one line, whole tree',
  '        return children.values().stream().mapToInt(FsNode::size).sum();',
  '    }',
  '',
  '    public FsNode addChild(FsNode node) {',
  '        node.parent = this;',
  '        return children.computeIfAbsent(node.name(), k -> node);  // atomic',
  '    }',
  '',
  '    public FsNode child(String name)  { return children.get(name); }',
  '    public List<String> list()        { return new ArrayList<>(children.keySet()); }',
  '}'
 ],
 used:'In-memory file system · Splitwise (groups within groups) · UI component trees · nested discounts',
 vs:'DECORATOR. Structurally similar — both hold a reference to the same interface. Composite models a WHOLE-PART tree with many children; Decorator wraps exactly one object to add behaviour.',
 gotchas:[
  'Putting child operations (add, remove) on the base class, so File.addChild() compiles and then throws. Safer to keep them on Directory and accept a cast.',
  'Recursion with no cycle detection once you add symlinks.',
  'Recomputing size() on every call for a huge tree — cache it and invalidate upward on change.'
 ]},

{id:'singleton', name:'Singleton', cat:'Creational', rank:10,
 intent:'Guarantee one instance and a global access point — and know when that is the wrong thing to want.',
 fires:[
  '"there is exactly one of these in the system"',
  '"a shared config / connection pool / id generator"',
  'Careful: this fires far more often than it should'
 ],
 uml:[
  '   ┌────────────────────────────────┐',
  '   │        «singleton»             │',
  '   │        IdGenerator             │',
  '   ├────────────────────────────────┤',
  '   │ -INSTANCE : IdGenerator {static}│',
  '   │ -IdGenerator()      «private»  │  ◄── nobody else can construct',
  '   ├────────────────────────────────┤',
  '   │ +getInstance() : IdGenerator   │',
  '   │ +next() : long                 │',
  '   └────────────────────────────────┘'
 ],
 code:[
  '// --- BEST: enum. Thread-safe, serialization-safe, reflection-safe. ---',
  'public enum IdGenerator {',
  '    INSTANCE;',
  '',
  '    private final AtomicLong counter = new AtomicLong();',
  '    public long next() { return counter.incrementAndGet(); }',
  '}',
  '// usage: IdGenerator.INSTANCE.next();',
  '',
  '// --- GOOD: holder idiom. Lazy, thread-safe, no synchronization cost. ---',
  'public class ConnectionPool {',
  '    private ConnectionPool() { }',
  '',
  '    private static class Holder {',
  '        // the JVM guarantees class init is thread-safe and happens once',
  '        static final ConnectionPool INSTANCE = new ConnectionPool();',
  '    }',
  '',
  '    public static ConnectionPool getInstance() { return Holder.INSTANCE; }',
  '}',
  '',
  '// --- The double-checked locking version people write from memory ---',
  'public class Config {',
  '    private static volatile Config instance;   // volatile is NOT optional',
  '',
  '    public static Config getInstance() {',
  '        if (instance == null) {                    // 1st check, no lock',
  '            synchronized (Config.class) {',
  '                if (instance == null) {            // 2nd check, with lock',
  '                    instance = new Config();',
  '                }',
  '            }',
  '        }',
  '        return instance;',
  '    }',
  '}',
  '// Without volatile this is BROKEN: the reference can be published before the',
  '// constructor finishes, so another thread sees a partially built object.',
  '',
  '// --- What you should usually do instead ---',
  '@Configuration',
  'class AppConfig {',
  '    @Bean ConnectionPool pool() { return new ConnectionPool(); }  // singleton scope,',
  '}                                                                 // and mockable'
 ],
 used:'Parking Lot (the lot) · Vending machine · config and id generators — in every case, say that injection is usually better.',
 vs:'DEPENDENCY INJECTION. A DI container gives you one instance without the global static access point, so tests can substitute it. Singleton is the pattern; DI is usually the better answer.',
 gotchas:[
  'Double-checked locking without volatile. The single most-asked follow-up on this pattern.',
  'Singletons holding mutable state, which becomes shared mutable state across every thread.',
  'Untestable code: a static getInstance() cannot be mocked, so everything downstream needs a real one.',
  'Say the trade-off out loud in an interview. Reaching for Singleton uncritically reads as junior.'
 ]},

{id:'adapter', name:'Adapter', cat:'Structural', rank:11,
 intent:'Make an incompatible interface usable, by wrapping it in the interface your code expects.',
 fires:[
  '"integrate this third-party SDK"',
  '"the legacy service returns XML, we want our domain object"',
  '"we may swap payment providers later"'
 ],
 uml:[
  '  ┌───────────────┐      ┌──────────────────────┐      ┌──────────────────┐',
  '  │  OrderService │─────▶│    «interface»       │      │  StripeSdk       │',
  '  │  (your code)  │ uses │   PaymentGateway     │      │  (third party)   │',
  '  └───────────────┘      ├──────────────────────┤      ├──────────────────┤',
  '                         │ +charge(Money, Card) │      │ +createCharge()  │',
  '                         └──────────△───────────┘      │  (different!)    │',
  '                                    │ implements       └────────△─────────┘',
  '                         ┌──────────┴───────────┐               │ delegates',
  '                         │   StripeAdapter      │───────────────┘',
  '                         └──────────────────────┘'
 ],
 code:[
  '// what YOUR domain wants',
  'public interface PaymentGateway {',
  '    PaymentResult charge(Money amount, Card card, String idempotencyKey);',
  '}',
  '',
  '// what the vendor actually gives you - different names, types, exceptions',
  '// class StripeSdk { StripeCharge createCharge(long cents, String currency,',
  '//                                             String token, RequestOptions o) }',
  '',
  'public class StripeAdapter implements PaymentGateway {',
  '    private final StripeSdk stripe;',
  '',
  '    public StripeAdapter(StripeSdk stripe) { this.stripe = stripe; }',
  '',
  '    @Override',
  '    public PaymentResult charge(Money amount, Card card, String idempotencyKey) {',
  '        try {',
  '            StripeCharge sc = stripe.createCharge(',
  '                    amount.toMinorUnits(),              // Money -> long cents',
  '                    amount.currency().getCurrencyCode(),',
  '                    card.token(),',
  '                    RequestOptions.builder().setIdempotencyKey(idempotencyKey).build());',
  '',
  '            return PaymentResult.success(sc.getId());',
  '',
  '        } catch (StripeCardException e) {',
  '            // translate THEIR exceptions into YOUR domain failures',
  '            return PaymentResult.declined(e.getDeclineCode());',
  '        } catch (StripeApiException e) {',
  '            throw new PaymentUnavailableException(e);',
  '        }',
  '    }',
  '}',
  '',
  '// swapping to Adyen is one new adapter. Nothing in OrderService changes,',
  '// and no Stripe type ever leaks into your domain.'
 ],
 used:'Any external boundary — payment gateway, SMS provider, map service, legacy system',
 vs:'FACADE. Adapter changes an interface to match an expectation you already have. Facade invents a simpler interface over a complicated subsystem you own. Adapter is about compatibility; Facade is about convenience.',
 gotchas:[
  'Letting the vendor type leak through — returning StripeCharge from your interface defeats the point.',
  'Not translating exceptions, so a StripeException propagates into business logic.',
  'One giant adapter for five unrelated vendor APIs. One adapter per boundary.'
 ]},

{id:'template', name:'Template Method', cat:'Behavioural', rank:12,
 intent:'Define the skeleton of an algorithm in a base class and let subclasses fill in specific steps.',
 fires:[
  '"every transaction validates, executes, records and prints"',
  '"the same flow with one step different"',
  'Copy-pasted methods differing in two lines'
 ],
 uml:[
  '  ┌──────────────────────────────────┐',
  '  │        «abstract»                │',
  '  │        Transaction               │',
  '  ├──────────────────────────────────┤',
  '  │ +run()  «final»                  │  ◄── the skeleton, cannot be overridden',
  '  │   ├── validate()   «abstract»    │',
  '  │   ├── execute()    «abstract»    │',
  '  │   ├── record()                   │  ◄── shared default',
  '  │   └── printReceipt()  «hook»     │',
  '  └────────────────△─────────────────┘',
  '       ┌───────────┼───────────┐',
  ' ┌─────┴─────┐ ┌───┴─────┐ ┌───┴──────┐',
  ' │ Withdraw  │ │ Deposit │ │ Transfer │',
  ' └───────────┘ └─────────┘ └──────────┘'
 ],
 code:[
  'public abstract class Transaction {',
  '    protected final Account account;',
  '    protected final Money amount;',
  '',
  '    /** The skeleton. final so subclasses cannot reorder the steps. */',
  '    public final Receipt run() {',
  '        validate();',
  '        Money resulting = execute();',
  '        record(resulting);',
  '        return printReceipt(resulting);',
  '    }',
  '',
  '    protected abstract void validate();          // must implement',
  '    protected abstract Money execute();          // must implement',
  '',
  '    protected void record(Money balance) {       // shared default',
  '        auditLog.append(new AuditEntry(account, type(), amount, balance));',
  '    }',
  '',
  '    protected Receipt printReceipt(Money balance) {   // hook - optional override',
  '        return Receipt.standard(account, type(), amount, balance);',
  '    }',
  '',
  '    protected abstract TxType type();',
  '}',
  '',
  'public class Withdrawal extends Transaction {',
  '    @Override protected void validate() {',
  '        if (account.balance().isLessThan(amount))',
  '            throw new InsufficientFundsException(account.id());',
  '        if (amount.toMinorUnits() % 10000 != 0)',
  '            throw new InvalidAmountException("must be a multiple of 100");',
  '    }',
  '    @Override protected Money execute() { return account.debit(amount); }',
  '    @Override protected TxType type()   { return TxType.WITHDRAWAL; }',
  '}',
  '',
  '// adding a new transaction type cannot accidentally skip the audit record'
 ],
 used:'ATM (transaction types) · report generation · any multi-step flow with one varying step',
 vs:'STRATEGY. Template Method uses INHERITANCE and fixes the sequence at compile time. Strategy uses COMPOSITION and swaps at runtime. Prefer Strategy when the variation must change per call or be tested in isolation.',
 gotchas:[
  'Not marking the template method final, so a subclass reorders the steps and skips validation.',
  'Too many abstract hooks, making subclasses harder to write than the original duplication.',
  'Deep inheritance chains. Two levels is usually the limit before Strategy is clearer.'
 ]},

{id:'facade', name:'Facade', cat:'Structural', rank:13,
 intent:'Give a simple entry point to a complicated subsystem, so callers do not orchestrate it themselves.',
 fires:[
  '"the controller is calling six services in a specific order"',
  '"placing an order means inventory, then payment, then shipping, then notify"',
  '"give me one obvious place to start reading this code"'
 ],
 uml:[
  '   ┌──────────────┐',
  '   │  Controller  │',
  '   └──────┬───────┘',
  '          │ one call',
  '          ▼',
  '   ┌────────────────────────┐',
  '   │    OrderFacade         │',
  '   │  +placeOrder(cart)     │',
  '   └───┬────┬────┬─────┬────┘',
  '       │    │    │     │',
  '   ┌───▼─┐┌─▼──┐┌▼───┐┌▼──────┐',
  '   │Inv. ││Pay ││Ship││Notify │',
  '   └─────┘└────┘└────┘└───────┘'
 ],
 code:[
  'public class OrderFacade {',
  '    private final InventoryService inventory;',
  '    private final PaymentService payments;',
  '    private final ShippingService shipping;',
  '    private final NotificationService notifications;',
  '',
  '    /** One call. The ORDER of these steps is the knowledge the facade owns. */',
  '    public Order placeOrder(Cart cart, String idempotencyKey) {',
  '        Order order = Order.from(cart);',
  '        List<Runnable> compensations = new ArrayList<>();',
  '        try {',
  '            inventory.reserve(order);',
  '            compensations.add(() -> inventory.release(order));',
  '',
  '            payments.charge(order, idempotencyKey);',
  '            compensations.add(() -> payments.refund(order, idempotencyKey));',
  '',
  '            shipping.schedule(order);',
  '            order.transitionTo(OrderStatus.CONFIRMED);',
  '            notifications.orderConfirmed(order);   // last: cannot be undone',
  '            return order;',
  '',
  '        } catch (RuntimeException e) {',
  '            Collections.reverse(compensations);',
  '            compensations.forEach(Runnable::run);',
  '            order.transitionTo(OrderStatus.CANCELLED);',
  '            throw e;',
  '        }',
  '    }',
  '}'
 ],
 used:'Every LLD problem has one — ParkingLot, BookingService, RideService, FileSystem. It is the class the interviewer reads first.',
 vs:'ADAPTER. Facade simplifies a subsystem YOU own; Adapter makes someone else interface fit yours. Also note: a facade does not hide the subsystem — callers may still use it directly if they need to.',
 gotchas:[
  'The facade accumulating business rules until it is a god class. It should orchestrate, not decide.',
  'Hiding the subsystem so completely that legitimate advanced use becomes impossible.',
  'Notice the ordering above: irreversible actions go LAST, after everything reversible has succeeded.'
 ]}

];

/* ========================================================== SOLUTIONS ===
   The expandable half of each LLD problem. Keyed by problem id.
     statement     the problem as an interviewer states it
     req           functional and non-functional requirements
     approach      how to attack it, in order
     uml           ASCII class diagram
     api           the public surface
     schema        tables, where persistence is in scope
     solution      the code, at interview scope

   "Interview scope" means what 45 focused minutes actually produces: the
   core classes and the main flow, complete and compilable in shape - not
   every getter, logger and DTO.                                          */

PLAN.lldSolution = {};

PLAN.lldSolution.parking = {
 statement:'Design a parking lot for a shopping mall. The lot has multiple floors. Each floor has spots of different sizes. Vehicles of different types arrive at an entrance, are issued a ticket, park in a suitable spot, and pay on exit based on how long they stayed. The system must tell a driver when the lot is full, and must never assign one spot to two vehicles.',
 req:{
  functional:[
   'Park a vehicle: find a suitable free spot, issue a ticket.',
   'Unpark: compute the fee from the duration, free the spot, produce a receipt.',
   'Report availability per floor and per spot size.',
   'Support multiple vehicle types mapping to allowed spot sizes.',
   'Reject cleanly when no suitable spot exists.'
  ],
  nonFunctional:[
   'Two vehicles must never receive the same spot, under concurrent entry.',
   'Allocation should not serialise the whole lot — a thousand spots means a thousand independent units.',
   'Pricing must be replaceable without editing the lot.',
   'In-memory. A repository interface marks where persistence would go.'
  ]
 },
 approach:[
  ['1. Fix the scope','Confirm floors, sizes, whether a small vehicle may take a large spot, and whether payment is in scope. Write the answers down.'],
  ['2. Extract the nouns','Lot, Floor, Spot, Vehicle, Ticket. Two enums immediately: VehicleType and SpotSize.'],
  ['3. Find the axes of change','Pricing changes constantly. Allocation changes (nearest, first-free, reserved). Those two become interfaces before anything else.'],
  ['4. Decide the unit of contention','The SPOT, not the lot. This decides your whole concurrency story, so decide it now rather than retrofitting a lock later.'],
  ['5. Write park() and the atomic occupy','This is the core flow. Everything else is supporting cast.'],
  ['6. Then unpark and pricing','Fee computation delegates to the strategy; the lot never knows the formula.'],
  ['7. Show the extension','"A new vehicle type is one enum value plus one strategy entry." Say it before they ask.']
 ],
 uml:[
  '  ┌────────────────────────────┐        ┌───────────────────────────┐',
  '  │       ParkingLot           │        │      «interface»          │',
  '  │        (facade)            │───────▶│    PricingStrategy        │',
  '  ├────────────────────────────┤        ├───────────────────────────┤',
  '  │ -floors : List<Floor>      │        │ +fee(Ticket) : BigDecimal │',
  '  │ -pricing : PricingStrategy │        └─────────────△─────────────┘',
  '  │ -allocator : Allocation    │              ┌───────┴───────┐',
  '  │ +park(Vehicle) : Ticket    │        ┌─────┴─────┐  ┌──────┴──────┐',
  '  │ +unpark(Ticket) : Receipt  │        │  Hourly   │  │  Weekend    │',
  '  │ +availability() : Map      │        └───────────┘  └─────────────┘',
  '  └─────────────┬──────────────┘',
  '                │ 1..*                  ┌───────────────────────────┐',
  '                ▼                       │       «interface»         │',
  '  ┌────────────────────────────┐        │  SpotAllocationStrategy   │',
  '  │      ParkingFloor          │◄───────├───────────────────────────┤',
  '  ├────────────────────────────┤ scans  │ +candidates(VehicleType)  │',
  '  │ -number : int              │        └───────────────────────────┘',
  '  │ -spots : List<ParkingSpot> │',
  '  └─────────────┬──────────────┘',
  '                │ 1..*',
  '                ▼',
  '  ┌────────────────────────────┐        ┌──────────────────────────┐',
  '  │      ParkingSpot           │        │       «abstract»         │',
  '  ├────────────────────────────┤  0..1  │        Vehicle           │',
  '  │ -id : String               │───────▶├──────────────────────────┤',
  '  │ -size : SpotSize           │ holds  │ -plate : String          │',
  '  │ -occupant : AtomicRef<V>   │        │ +type() : VehicleType    │',
  '  │ +tryOccupy(Vehicle):bool   │        └────────────△─────────────┘',
  '  │ +release()                 │           ┌─────────┼─────────┐',
  '  └────────────────────────────┘      ┌────┴───┐ ┌───┴──┐ ┌────┴───┐',
  '                                      │  Car   │ │ Bike │ │ Truck  │',
  '  ┌────────────────────────────┐      └────────┘ └──────┘ └────────┘',
  '  │        Ticket              │',
  '  ├────────────────────────────┤',
  '  │ -id, -spot, -vehicle       │',
  '  │ -entry : Instant           │',
  '  │ -exit  : Instant           │',
  '  └────────────────────────────┘'
 ],
 api:[
  ['Ticket park(Vehicle v)','Allocates a spot and issues a ticket. Throws LotFullException if none is suitable.'],
  ['Receipt unpark(String ticketId)','Stamps the exit time, frees the spot, prices the stay.'],
  ['Map<SpotSize,Integer> availability()','Free count per size, for the display board.'],
  ['Map<SpotSize,Integer> availability(int floor)','Same, scoped to one floor.'],
  ['void addFloor(ParkingFloor f)','Configuration, used at construction.']
 ],
 schema:[
  ['parking_spot','id PK · floor_no · size · status · vehicle_plate NULL · version','status + version give you the same atomicity as compareAndSet: UPDATE ... WHERE status = FREE.'],
  ['ticket','id PK · spot_id FK · vehicle_plate · entry_at · exit_at NULL · fee NULL','exit_at NULL means still parked. Index (spot_id, exit_at) for the active lookup.'],
  ['vehicle','plate PK · type','Optional — you may not need to persist vehicles at all.'],
  ['Note','—','If asked to persist: the concurrency argument transfers unchanged. compareAndSet becomes a conditional UPDATE, and you check rowsAffected == 1.']
 ],
 solution:[
  ['Enums and the vehicle hierarchy',
   ['public enum SpotSize { SMALL, MEDIUM, LARGE }',
    '',
    'public enum VehicleType {',
    '    BIKE(EnumSet.of(SpotSize.SMALL, SpotSize.MEDIUM, SpotSize.LARGE)),',
    '    CAR(EnumSet.of(SpotSize.MEDIUM, SpotSize.LARGE)),',
    '    TRUCK(EnumSet.of(SpotSize.LARGE));',
    '',
    '    private final Set<SpotSize> allowed;',
    '    VehicleType(Set<SpotSize> allowed) { this.allowed = allowed; }',
    '',
    '    /** Smallest-first, so a bike does not consume a truck bay. */',
    '    public List<SpotSize> preferredSizes() {',
    '        return allowed.stream().sorted().toList();',
    '    }',
    '    public boolean fitsIn(SpotSize s) { return allowed.contains(s); }',
    '}',
    '',
    'public abstract class Vehicle {',
    '    private final String plate;',
    '    protected Vehicle(String plate) { this.plate = Objects.requireNonNull(plate); }',
    '    public String plate()            { return plate; }',
    '    public abstract VehicleType type();',
    '}',
    '',
    'public class Car   extends Vehicle { public Car(String p){super(p);}   public VehicleType type(){return VehicleType.CAR;} }',
    'public class Bike  extends Vehicle { public Bike(String p){super(p);}  public VehicleType type(){return VehicleType.BIKE;} }',
    'public class Truck extends Vehicle { public Truck(String p){super(p);} public VehicleType type(){return VehicleType.TRUCK;} }'],
   'Putting the allowed sizes ON the enum keeps the fitting rule in one place instead of an if-chain in the allocator. preferredSizes() smallest-first is a real product decision worth stating.'],
  ['ParkingSpot — the unit of contention',
   ['public class ParkingSpot {',
    '    private final String id;',
    '    private final int floorNumber;',
    '    private final SpotSize size;',
    '    private final AtomicReference<Vehicle> occupant = new AtomicReference<>();',
    '',
    '    public ParkingSpot(String id, int floorNumber, SpotSize size) {',
    '        this.id = id; this.floorNumber = floorNumber; this.size = size;',
    '    }',
    '',
    '    /** Atomic. Exactly one caller can win. */',
    '    public boolean tryOccupy(Vehicle v) {',
    '        if (!v.type().fitsIn(size)) return false;',
    '        return occupant.compareAndSet(null, v);',
    '    }',
    '',
    '    public void release() { occupant.set(null); }',
    '',
    '    public boolean isFree()   { return occupant.get() == null; }',
    '    public SpotSize size()    { return size; }',
    '    public String id()        { return id; }',
    '    public int floorNumber()  { return floorNumber; }',
    '}'],
   'No synchronized anywhere. compareAndSet(null, v) is the entire concurrency story, and it scales to as many spots as the lot has.'],
  ['Ticket and Receipt',
   ['public class Ticket {',
    '    private final String id = UUID.randomUUID().toString();',
    '    private final ParkingSpot spot;',
    '    private final Vehicle vehicle;',
    '    private final Instant entry;',
    '    private Instant exit;                 // the only mutable field',
    '',
    '    public Ticket(ParkingSpot spot, Vehicle vehicle, Instant entry) {',
    '        this.spot = spot; this.vehicle = vehicle; this.entry = entry;',
    '    }',
    '',
    '    void markExit(Instant when) {',
    '        if (exit != null) throw new IllegalStateException("already exited: " + id);',
    '        this.exit = when;',
    '    }',
    '',
    '    public String id()          { return id; }',
    '    public ParkingSpot spot()   { return spot; }',
    '    public Vehicle vehicle()    { return vehicle; }',
    '    public Instant entry()      { return entry; }',
    '    public Instant exit()       { return exit; }',
    '}',
    '',
    'public record Receipt(Ticket ticket, BigDecimal fee, Instant paidAt) { }'],
   'Guarding markExit against a double exit is a small thing interviewers notice — it closes the "what if someone scans the ticket twice" question before it is asked.'],
  ['The two strategies',
   ['public interface PricingStrategy {',
    '    BigDecimal fee(Ticket ticket);',
    '}',
    '',
    'public class HourlyPricing implements PricingStrategy {',
    '    private final Map<VehicleType, BigDecimal> ratePerHour;',
    '',
    '    public HourlyPricing(Map<VehicleType, BigDecimal> rates) {',
    '        this.ratePerHour = Map.copyOf(rates);',
    '    }',
    '',
    '    @Override public BigDecimal fee(Ticket t) {',
    '        Duration stay = Duration.between(t.entry(), t.exit());',
    '        long hours = Math.max(1, (long) Math.ceil(stay.toMinutes() / 60.0));',
    '        return ratePerHour.get(t.vehicle().type())',
    '                          .multiply(BigDecimal.valueOf(hours))',
    '                          .setScale(2, RoundingMode.HALF_UP);',
    '    }',
    '}',
    '',
    'public interface SpotAllocationStrategy {',
    '    /** Ordered candidates. The lot walks them until one is won. */',
    '    List<ParkingSpot> candidates(VehicleType type, List<ParkingFloor> floors);',
    '}',
    '',
    'public class NearestFirstAllocation implements SpotAllocationStrategy {',
    '    @Override',
    '    public List<ParkingSpot> candidates(VehicleType type, List<ParkingFloor> floors) {',
    '        return floors.stream()',
    '                .sorted(Comparator.comparingInt(ParkingFloor::number))',
    '                .flatMap(f -> f.spots().stream())',
    '                .filter(s -> type.fitsIn(s.size()) && s.isFree())   // a HINT, not a guarantee',
    '                .sorted(Comparator.comparing(ParkingSpot::size))    // smallest that fits',
    '                .toList();',
    '    }',
    '}'],
   'Note the comment: isFree() here is only a filter to avoid pointless attempts. The real guarantee is tryOccupy. Never treat a pre-check as the lock.'],
  ['ParkingLot — the facade and the core flow',
   ['public class ParkingLot {',
    '    private final List<ParkingFloor> floors;',
    '    private final PricingStrategy pricing;',
    '    private final SpotAllocationStrategy allocator;',
    '    private final Map<String, Ticket> active = new ConcurrentHashMap<>();',
    '',
    '    public ParkingLot(List<ParkingFloor> floors,',
    '                      PricingStrategy pricing,',
    '                      SpotAllocationStrategy allocator) {',
    '        this.floors = List.copyOf(floors);',
    '        this.pricing = pricing;',
    '        this.allocator = allocator;',
    '    }',
    '',
    '    public Ticket park(Vehicle vehicle) {',
    '        for (ParkingSpot spot : allocator.candidates(vehicle.type(), floors)) {',
    '            if (spot.tryOccupy(vehicle)) {              // atomic; loser just moves on',
    '                Ticket ticket = new Ticket(spot, vehicle, Instant.now());',
    '                active.put(ticket.id(), ticket);',
    '                return ticket;',
    '            }',
    '        }',
    '        throw new LotFullException(vehicle.type());',
    '    }',
    '',
    '    public Receipt unpark(String ticketId) {',
    '        Ticket ticket = active.remove(ticketId);',
    '        if (ticket == null) throw new UnknownTicketException(ticketId);',
    '',
    '        ticket.markExit(Instant.now());',
    '        ticket.spot().release();',
    '        return new Receipt(ticket, pricing.fee(ticket), Instant.now());',
    '    }',
    '',
    '    public Map<SpotSize, Long> availability() {',
    '        return floors.stream()',
    '                .flatMap(f -> f.spots().stream())',
    '                .filter(ParkingSpot::isFree)',
    '                .collect(Collectors.groupingBy(ParkingSpot::size, Collectors.counting()));',
    '    }',
    '}'],
   'active.remove() is itself atomic, so a double unpark is impossible: the second call finds nothing and throws. That is a second race closed for free by choosing the right collection.'],
  ['A demo main() — always write one',
   ['public static void main(String[] args) {',
    '    ParkingFloor f1 = new ParkingFloor(1, List.of(',
    '            new ParkingSpot("1-S1", 1, SpotSize.SMALL),',
    '            new ParkingSpot("1-M1", 1, SpotSize.MEDIUM),',
    '            new ParkingSpot("1-L1", 1, SpotSize.LARGE)));',
    '',
    '    ParkingLot lot = new ParkingLot(List.of(f1),',
    '            new HourlyPricing(Map.of(',
    '                    VehicleType.BIKE,  new BigDecimal("10"),',
    '                    VehicleType.CAR,   new BigDecimal("20"),',
    '                    VehicleType.TRUCK, new BigDecimal("40"))),',
    '            new NearestFirstAllocation());',
    '',
    '    Ticket t = lot.park(new Car("KA-01-1234"));',
    '    System.out.println("parked at " + t.spot().id());   // 1-M1, smallest that fits',
    '    System.out.println(lot.availability());             // {SMALL=1, LARGE=1}',
    '    System.out.println(lot.unpark(t.id()).fee());       // 20.00',
    '}'],
   'In a machine-coding round this is not optional — it is the proof it works. In a whiteboard round, saying "and here is how I would exercise it" is nearly as good.']
 ]
};

PLAN.lldSolution.vending = {
 statement:'Design a vending machine. It holds items in slots, each with a price and a stock count. A user inserts coins, selects an item by code, and the machine dispenses the item plus any change. It must handle: selecting before paying, insufficient funds, out-of-stock items, cancellation with refund, and being unable to make change.',
 req:{
  functional:[
   'Insert coins of fixed denominations, accumulating a balance.',
   'Select an item by code; validate stock and funds.',
   'Dispense the item and the correct change.',
   'Cancel at any point and refund the full balance.',
   'Restock and collect cash (an operator mode).'
  ],
  nonFunctional:[
   'Illegal actions for the current mode must be rejected, not silently ignored.',
   'Never dispense if change cannot be made — check before, not after.',
   'Adding a payment method must not change the state machine.'
  ]
 },
 approach:[
  ['1. Enumerate the states first','Idle, HasMoney, Dispensing, OutOfService. Write them on the board before any class.'],
  ['2. Write the action set','insertCoin, selectItem, dispense, cancel. Every state must answer all four — that is what stops a forgotten transition.'],
  ['3. Make the machine thin','The context holds balance, inventory and current state, and delegates every action. No business rules in it.'],
  ['4. Get the ordering right','Check stock, check funds, check change is makeable, THEN dispense. Interviewers probe this order specifically.'],
  ['5. Handle change honestly','Greedy, and say out loud that greedy is only correct for canonical denominations.'],
  ['6. Show the extension','"Card payment is a PaymentMethod; the states are untouched."']
 ],
 uml:[
  '  ┌───────────────────────────────┐         ┌────────────────────────────┐',
  '  │       VendingMachine          │         │       «interface»          │',
  '  │         (context)             │────────▶│       VendingState         │',
  '  ├───────────────────────────────┤delegates├────────────────────────────┤',
  '  │ -state : VendingState         │         │ +insertCoin(m, coin)       │',
  '  │ -balance : int                │◄────────│ +selectItem(m, code)       │',
  '  │ -inventory : Inventory        │ setState│ +dispense(m)               │',
  '  │ -register : CashRegister      │         │ +cancel(m)                 │',
  '  │ +insertCoin(Coin)             │         └─────────────△──────────────┘',
  '  │ +selectItem(String)           │        ┌──────────────┼──────────────┐',
  '  │ +cancel()                     │  ┌─────┴─────┐ ┌──────┴──────┐ ┌─────┴──────┐',
  '  └───────┬───────────────┬───────┘  │ IdleState │ │HasMoneyState│ │Dispensing  │',
  '          │               │          └───────────┘ └─────────────┘ └────────────┘',
  '          ▼               ▼',
  '  ┌───────────────┐ ┌──────────────────────┐     ┌──────────────────────────┐',
  '  │   Inventory   │ │    CashRegister      │────▶│     «interface»          │',
  '  ├───────────────┤ ├──────────────────────┤     │    ChangeStrategy        │',
  '  │ -slots : Map  │ │ -notes : Map<Coin,n> │     ├──────────────────────────┤',
  '  │ +find(code)   │ │ +canMake(int) : bool │     │ +make(amt, avail)        │',
  '  │ +decrement()  │ │ +take(int) : List    │     └──────────────────────────┘',
  '  └───────────────┘ └──────────────────────┘'
 ],
 api:[
  ['void insertCoin(Coin c)','Adds to balance. Legal in Idle and HasMoney.'],
  ['void selectItem(String code)','Validates stock, funds and change availability. Illegal in Idle.'],
  ['Dispensed dispense()','Returns item plus change. Only legal after a successful selection.'],
  ['int cancel()','Refunds the balance and returns to Idle. Legal in every state.'],
  ['void restock(String code, int qty)','Operator mode.']
 ],
 schema:[
  ['Note','—','A vending machine is a single-process embedded system. If asked to persist, you would store slot inventory and a transaction log; the design does not otherwise change.']
 ],
 solution:[
  ['Coins and inventory',
   ['public enum Coin {',
    '    FIVE(5), TEN(10), TWENTY(20), FIFTY(50);',
    '',
    '    private final int value;',
    '    Coin(int value) { this.value = value; }',
    '    public int value() { return value; }',
    '',
    '    /** Largest first — the order greedy change-making needs. */',
    '    public static List<Coin> descending() {',
    '        return Arrays.stream(values())',
    '                .sorted(Comparator.comparingInt(Coin::value).reversed())',
    '                .toList();',
    '    }',
    '}',
    '',
    'public record Item(String code, String name, int price) { }',
    '',
    'public class Inventory {',
    '    private final Map<String, Item> items = new HashMap<>();',
    '    private final Map<String, Integer> counts = new HashMap<>();',
    '',
    '    public void load(Item item, int qty) {',
    '        items.put(item.code(), item);',
    '        counts.merge(item.code(), qty, Integer::sum);',
    '    }',
    '',
    '    public Optional<Item> find(String code) { return Optional.ofNullable(items.get(code)); }',
    '    public int countOf(String code)         { return counts.getOrDefault(code, 0); }',
    '',
    '    public void decrement(String code) {',
    '        counts.computeIfPresent(code, (k, v) -> v > 0 ? v - 1 : v);',
    '    }',
    '}'],
   'Prices live on Item only, never duplicated on the slot — otherwise the two can disagree, which is a classic review comment.'],
  ['The cash register and change-making',
   ['public interface ChangeStrategy {',
    '    Optional<List<Coin>> make(int amount, Map<Coin, Integer> available);',
    '}',
    '',
    'public class GreedyChange implements ChangeStrategy {',
    '    @Override',
    '    public Optional<List<Coin>> make(int amount, Map<Coin, Integer> available) {',
    '        List<Coin> out = new ArrayList<>();',
    '        Map<Coin, Integer> remaining = new EnumMap<>(available);',
    '',
    '        for (Coin c : Coin.descending()) {',
    '            while (amount >= c.value() && remaining.getOrDefault(c, 0) > 0) {',
    '                out.add(c);',
    '                amount -= c.value();',
    '                remaining.merge(c, -1, Integer::sum);',
    '            }',
    '        }',
    '        // GREEDY IS ONLY CORRECT FOR CANONICAL DENOMINATIONS.',
    '        // With coins {1,3,4}, making 6 greedily gives 4+1+1 instead of 3+3.',
    '        return amount == 0 ? Optional.of(out) : Optional.empty();',
    '    }',
    '}',
    '',
    'public class CashRegister {',
    '    private final Map<Coin, Integer> holdings = new EnumMap<>(Coin.class);',
    '    private final ChangeStrategy strategy;',
    '',
    '    public CashRegister(ChangeStrategy strategy) { this.strategy = strategy; }',
    '',
    '    public void accept(Coin c) { holdings.merge(c, 1, Integer::sum); }',
    '',
    '    /** Check BEFORE dispensing. This is the ordering that matters. */',
    '    public boolean canMakeChange(int amount) {',
    '        return amount == 0 || strategy.make(amount, holdings).isPresent();',
    '    }',
    '',
    '    public List<Coin> dispenseChange(int amount) {',
    '        List<Coin> coins = strategy.make(amount, holdings)',
    '                .orElseThrow(() -> new CannotMakeChangeException(amount));',
    '        coins.forEach(c -> holdings.merge(c, -1, Integer::sum));',
    '        return coins;',
    '    }',
    '}'],
   'canMakeChange and dispenseChange are deliberately separate. Planning without mutating lets you refuse the sale cleanly instead of discovering the problem after the item has dropped.'],
  ['The states',
   ['public interface VendingState {',
    '    void insertCoin(VendingMachine m, Coin c);',
    '    void selectItem(VendingMachine m, String code);',
    '    Dispensed dispense(VendingMachine m);',
    '    int cancel(VendingMachine m);',
    '}',
    '',
    'public class IdleState implements VendingState {',
    '    public void insertCoin(VendingMachine m, Coin c) {',
    '        m.credit(c);',
    '        m.setState(new HasMoneyState());',
    '    }',
    '    public void selectItem(VendingMachine m, String code) {',
    '        throw new IllegalStateException("insert money first");',
    '    }',
    '    public Dispensed dispense(VendingMachine m) {',
    '        throw new IllegalStateException("nothing selected");',
    '    }',
    '    public int cancel(VendingMachine m) { return 0; }',
    '}',
    '',
    'public class HasMoneyState implements VendingState {',
    '    public void insertCoin(VendingMachine m, Coin c) { m.credit(c); }',
    '',
    '    public void selectItem(VendingMachine m, String code) {',
    '        Item item = m.inventory().find(code)',
    '                .orElseThrow(() -> new UnknownItemException(code));',
    '        if (m.inventory().countOf(code) == 0)',
    '            throw new OutOfStockException(code);',
    '        if (m.balance() < item.price())',
    '            throw new InsufficientFundsException(item.price() - m.balance());',
    '        if (!m.register().canMakeChange(m.balance() - item.price()))',
    '            throw new CannotMakeChangeException(m.balance() - item.price());',
    '',
    '        m.select(item);                       // all four checks passed',
    '        m.setState(new DispensingState());',
    '    }',
    '',
    '    public Dispensed dispense(VendingMachine m) {',
    '        throw new IllegalStateException("select an item first");',
    '    }',
    '    public int cancel(VendingMachine m) {',
    '        int refund = m.drainBalance();',
    '        m.setState(new IdleState());',
    '        return refund;',
    '    }',
    '}',
    '',
    'public class DispensingState implements VendingState {',
    '    public void insertCoin(VendingMachine m, Coin c) {',
    '        throw new IllegalStateException("dispensing in progress");',
    '    }',
    '    public void selectItem(VendingMachine m, String code) {',
    '        throw new IllegalStateException("dispensing in progress");',
    '    }',
    '    public Dispensed dispense(VendingMachine m) {',
    '        Item item = m.selected();',
    '        int change = m.balance() - item.price();',
    '        m.inventory().decrement(item.code());',
    '        List<Coin> coins = m.register().dispenseChange(change);',
    '        m.drainBalance();',
    '        m.setState(new IdleState());',
    '        return new Dispensed(item, coins);',
    '    }',
    '    public int cancel(VendingMachine m) {',
    '        throw new IllegalStateException("too late to cancel");',
    '    }',
    '}'],
   'Four checks in selectItem, in that exact order, all before any state change. And note DispensingState refuses cancel — "too late" is a real product rule and encoding it in the state is the whole argument for the pattern.'],
  ['The machine, and a demo',
   ['public class VendingMachine {',
    '    private VendingState state = new IdleState();',
    '    private final Inventory inventory;',
    '    private final CashRegister register;',
    '    private int balance;',
    '    private Item selected;',
    '',
    '    public VendingMachine(Inventory inv, CashRegister reg) {',
    '        this.inventory = inv; this.register = reg;',
    '    }',
    '',
    '    // public API - pure delegation',
    '    public void insertCoin(Coin c)      { state.insertCoin(this, c); }',
    '    public void selectItem(String code) { state.selectItem(this, code); }',
    '    public Dispensed dispense()         { return state.dispense(this); }',
    '    public int cancel()                 { return state.cancel(this); }',
    '',
    '    // package-private hooks the states use',
    '    void setState(VendingState s) { this.state = s; }',
    '    void credit(Coin c)           { balance += c.value(); register.accept(c); }',
    '    void select(Item item)        { this.selected = item; }',
    '    int drainBalance()            { int b = balance; balance = 0; return b; }',
    '',
    '    int balance()               { return balance; }',
    '    Item selected()             { return selected; }',
    '    Inventory inventory()       { return inventory; }',
    '    CashRegister register()     { return register; }',
    '}',
    '',
    'public record Dispensed(Item item, List<Coin> change) { }',
    '',
    '// --- demo ---',
    'Inventory inv = new Inventory();',
    'inv.load(new Item("A1", "Water", 25), 3);',
    'CashRegister reg = new CashRegister(new GreedyChange());',
    'VendingMachine m = new VendingMachine(inv, reg);',
    '',
    'm.selectItem("A1");                    // IllegalStateException: insert money first',
    'm.insertCoin(Coin.TWENTY);',
    'm.insertCoin(Coin.TEN);                // balance 30',
    'm.selectItem("A1");',
    'Dispensed d = m.dispense();            // Water + [FIVE]'],
   'The states are stateless, so in production they would be singletons or enum constants rather than a new object per transition. Worth mentioning; not worth spending interview time on.']
 ]
};

PLAN.lldSolution.booking = {
 statement:'Design a movie ticket booking system. A cinema has several screens; each screen runs several shows a day; each show has a seat map. A user browses shows, selects seats, holds them while paying, and confirms. Two users must never be sold the same seat. If a user abandons payment, the seats must return to the pool.',
 req:{
  functional:[
   'Browse cinemas, shows and the seat map for a show.',
   'Hold one or more seats for a limited window.',
   'Confirm a hold into a booking after successful payment.',
   'Release a hold on cancellation or expiry.',
   'Price seats by category.'
  ],
  nonFunctional:[
   'No double-booking, ever, under concurrent load on the same seat.',
   'A multi-seat request is all-or-nothing — never leave stranded holds.',
   'No global lock on a show: 300 seats should mean 300 independent units.',
   'Expired holds must free up without waiting for a sweeper to run.'
  ]
 },
 approach:[
  ['1. Ask the hold question first','"Can a user hold seats before paying, and for how long?" The answer defines the entire design. If there is no hold, this is a much simpler problem — say so.'],
  ['2. Get the key modelling decision right','Availability belongs to (seat, show), not to seat. State this out loud; it is the thing most candidates get wrong and it is invisible until show two.'],
  ['3. Draw the seat state machine','AVAILABLE → HELD → BOOKED, with HELD → AVAILABLE on expiry or cancel. Three states, four transitions.'],
  ['4. Make the transition atomic','compareAndSet on ShowSeat status. Then handle the multi-seat case: sorted acquisition plus rollback.'],
  ['5. Decide expiry policy','Lazy check on access AND a background sweeper. Explain why you need both.'],
  ['6. State the payment-failure policy','What happens when the hold expires mid-payment. Have an answer; there is no free lunch here.'],
  ['7. Show the extension','Dynamic pricing is a new strategy; nothing else moves.']
 ],
 uml:[
  '  ┌──────────────┐ 1..*  ┌──────────────┐ 1..*  ┌────────────────────┐',
  '  │    Cinema    │──────▶│    Screen    │──────▶│       Show         │',
  '  ├──────────────┤       ├──────────────┤       ├────────────────────┤',
  '  │ -name, -city │       │ -seats:List  │       │ -movie : Movie     │',
  '  └──────────────┘       └──────┬───────┘       │ -startTime         │',
  '                                │ 1..*          │ -showSeats : Map   │',
  '                                ▼               └─────────┬──────────┘',
  '                         ┌──────────────┐                 │ 1..*',
  '                         │     Seat     │                 ▼',
  '                         ├──────────────┤       ┌────────────────────────┐',
  '                         │ -row, -number│◄──────│      ShowSeat          │',
  '                         │ -category    │ 1     ├────────────────────────┤',
  '                         └──────────────┘       │ -status : AtomicRef    │  ◄── THE unit',
  '                                                │ -heldBy, -holdExpiry   │      of contention',
  '                                                │ +tryHold(user, ttl)    │',
  '                                                │ +confirm() +release()  │',
  '                                                └────────────────────────┘',
  '  ┌──────────────────────────────┐                        ▲',
  '  │      BookingService          │                        │ holds',
  '  │        (facade)              │────────────────────────┘',
  '  ├──────────────────────────────┤       ┌──────────────────────────┐',
  '  │ +hold(show, seats, user)     │──────▶│      «interface»         │',
  '  │ +confirm(holdId, payment)    │       │    PricingStrategy       │',
  '  │ +release(holdId)             │       └──────────────────────────┘',
  '  │ +sweepExpired()              │',
  '  └──────────────┬───────────────┘       ┌──────────────────────────┐',
  '                 │ creates               │        SeatHold          │',
  '                 └──────────────────────▶│ -id, -seats, -expiresAt  │',
  '                                         └──────────────────────────┘',
  '',
  '  ShowSeat state machine:',
  '     AVAILABLE ──tryHold()──▶ HELD ──confirm()──▶ BOOKED',
  '         ▲                     │',
  '         └──release()/expiry───┘'
 ],
 api:[
  ['SeatHold hold(String showId, List<String> seatIds, String userId)','All-or-nothing. Throws SeatsUnavailableException naming which seats failed.'],
  ['Booking confirm(String holdId, PaymentRef payment)','Converts HELD to BOOKED. Idempotent on holdId.'],
  ['void release(String holdId)','Explicit cancel. Also called by the sweeper.'],
  ['SeatMap seatMap(String showId)','Current status of every seat, for display.'],
  ['int sweepExpired()','Background job. Returns how many holds it released.']
 ],
 schema:[
  ['show','id PK · movie_id · screen_id · start_time','Index (screen_id, start_time).'],
  ['show_seat','id PK · show_id FK · seat_id FK · status · held_by NULL · hold_expiry NULL · version','UNIQUE (show_id, seat_id) is the constraint that makes double-booking structurally impossible.'],
  ['seat_hold','id PK · user_id · expires_at · status','Index on expires_at for the sweeper.'],
  ['booking','id PK · hold_id FK · user_id · amount · status · created_at','hold_id UNIQUE gives you idempotent confirm for free.'],
  ['The atomic write','—','UPDATE show_seat SET status=HELD, held_by=?, hold_expiry=? WHERE id=? AND status=AVAILABLE — then require rowsAffected == 1. Identical shape to compareAndSet.']
 ],
 solution:[
  ['ShowSeat — availability belongs to (seat, show)',
   ['public enum SeatStatus { AVAILABLE, HELD, BOOKED }',
    '',
    'public class ShowSeat {',
    '    private final String id;              // showId + ":" + seatId',
    '    private final Seat seat;',
    '    private final Show show;',
    '    private final AtomicReference<SeatStatus> status =',
    '            new AtomicReference<>(SeatStatus.AVAILABLE);',
    '    private volatile String heldBy;',
    '    private volatile Instant holdExpiry;',
    '',
    '    public ShowSeat(Seat seat, Show show) {',
    '        this.seat = seat; this.show = show;',
    '        this.id = show.id() + ":" + seat.id();',
    '    }',
    '',
    '    /** Atomic. Exactly one caller wins. Reclaims an expired hold first. */',
    '    public boolean tryHold(String userId, Duration ttl) {',
    '        if (status.compareAndSet(SeatStatus.AVAILABLE, SeatStatus.HELD)) {',
    '            heldBy = userId;',
    '            holdExpiry = Instant.now().plus(ttl);',
    '            return true;',
    '        }',
    '        // LAZY EXPIRY: an abandoned hold must not block a live sale',
    '        if (status.get() == SeatStatus.HELD',
    '                && holdExpiry != null && Instant.now().isAfter(holdExpiry)',
    '                && status.compareAndSet(SeatStatus.HELD, SeatStatus.AVAILABLE)) {',
    '            return tryHold(userId, ttl);      // one retry, now that it is free',
    '        }',
    '        return false;',
    '    }',
    '',
    '    public boolean confirm(String userId) {',
    '        if (!userId.equals(heldBy)) return false;      // not your hold',
    '        return status.compareAndSet(SeatStatus.HELD, SeatStatus.BOOKED);',
    '    }',
    '',
    '    public void release() {',
    '        if (status.compareAndSet(SeatStatus.HELD, SeatStatus.AVAILABLE)) {',
    '            heldBy = null; holdExpiry = null;',
    '        }',
    '    }',
    '',
    '    public boolean isExpiredHold() {',
    '        return status.get() == SeatStatus.HELD',
    '                && holdExpiry != null && Instant.now().isAfter(holdExpiry);',
    '    }',
    '',
    '    public String id()          { return id; }',
    '    public Seat seat()          { return seat; }',
    '    public SeatStatus status()  { return status.get(); }',
    '}'],
   'Three things at once: the (seat, show) identity, the atomic transition, and lazy expiry reclaiming a dead hold rather than waiting for a sweeper. The confirm() ownership check stops user B confirming user A hold.'],
  ['SeatHold and the all-or-nothing acquisition',
   ['public class SeatHold {',
    '    private final String id = UUID.randomUUID().toString();',
    '    private final List<ShowSeat> seats;',
    '    private final String userId;',
    '    private final Instant expiresAt;',
    '    private volatile boolean settled;      // confirmed or released',
    '',
    '    SeatHold(List<ShowSeat> seats, String userId, Instant expiresAt) {',
    '        this.seats = List.copyOf(seats);',
    '        this.userId = userId;',
    '        this.expiresAt = expiresAt;',
    '    }',
    '',
    '    public boolean isExpired() { return Instant.now().isAfter(expiresAt); }',
    '',
    '    public String id()             { return id; }',
    '    public List<ShowSeat> seats()  { return seats; }',
    '    public String userId()         { return userId; }',
    '    public Instant expiresAt()     { return expiresAt; }',
    '    boolean markSettled()          { ',
    '        synchronized (this) {',
    '            if (settled) return false;',
    '            settled = true; return true;   // idempotency for confirm/release',
    '        }',
    '    }',
    '}'],
   'markSettled is a small guard that makes confirm and release idempotent — a retried payment callback cannot double-confirm.'],
  ['BookingService — the core flow',
   ['public class BookingService {',
    '    private static final Duration HOLD_TTL = Duration.ofMinutes(8);',
    '',
    '    private final Map<String, Show> shows = new ConcurrentHashMap<>();',
    '    private final Map<String, SeatHold> holds = new ConcurrentHashMap<>();',
    '    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();',
    '    private final PricingStrategy pricing;',
    '',
    '    public BookingService(PricingStrategy pricing) { this.pricing = pricing; }',
    '',
    '    /** All-or-nothing. Deterministic order prevents deadlock between',
    '     *  two users requesting overlapping seat sets. */',
    '    public SeatHold hold(String showId, List<String> seatIds, String userId) {',
    '        Show show = shows.get(showId);',
    '        if (show == null) throw new UnknownShowException(showId);',
    '',
    '        List<ShowSeat> requested = seatIds.stream()',
    '                .map(show::showSeat)',
    '                .sorted(Comparator.comparing(ShowSeat::id))    // <-- deadlock guard',
    '                .toList();',
    '',
    '        List<ShowSeat> acquired = new ArrayList<>();',
    '        for (ShowSeat s : requested) {',
    '            if (s.tryHold(userId, HOLD_TTL)) {',
    '                acquired.add(s);',
    '            } else {',
    '                acquired.forEach(ShowSeat::release);           // <-- rollback',
    '                throw new SeatsUnavailableException(s.seat().id());',
    '            }',
    '        }',
    '',
    '        SeatHold h = new SeatHold(acquired, userId, Instant.now().plus(HOLD_TTL));',
    '        holds.put(h.id(), h);',
    '        return h;',
    '    }',
    '',
    '    public Booking confirm(String holdId, PaymentRef payment) {',
    '        SeatHold h = holds.get(holdId);',
    '        if (h == null) throw new UnknownHoldException(holdId);',
    '',
    '        // idempotent: a retried callback returns the existing booking',
    '        Booking existing = bookings.get(holdId);',
    '        if (existing != null) return existing;',
    '',
    '        if (h.isExpired()) {',
    '            release(holdId);',
    '            throw new HoldExpiredException(holdId);   // POLICY: refuse, do not charge',
    '        }',
    '        if (!h.markSettled()) return bookings.get(holdId);',
    '',
    '        for (ShowSeat s : h.seats()) {',
    '            if (!s.confirm(h.userId()))',
    '                throw new IllegalStateException("seat lost during confirm: " + s.id());',
    '        }',
    '',
    '        BigDecimal amount = h.seats().stream()',
    '                .map(pricing::price)',
    '                .reduce(BigDecimal.ZERO, BigDecimal::add);',
    '',
    '        Booking b = new Booking(holdId, h.userId(), h.seats(), amount, payment);',
    '        bookings.put(holdId, b);',
    '        holds.remove(holdId);',
    '        return b;',
    '    }',
    '',
    '    public void release(String holdId) {',
    '        SeatHold h = holds.remove(holdId);',
    '        if (h != null && h.markSettled()) h.seats().forEach(ShowSeat::release);',
    '    }',
    '',
    '    /** Background sweeper. Lazy expiry handles the contended case;',
    '     *  this one frees seats for people merely BROWSING. */',
    '    public int sweepExpired() {',
    '        List<String> dead = holds.values().stream()',
    '                .filter(SeatHold::isExpired)',
    '                .map(SeatHold::id)',
    '                .toList();',
    '        dead.forEach(this::release);',
    '        return dead.size();',
    '    }',
    '}'],
   'Read the confirm() path carefully: idempotency check, expiry policy, settle-once guard, then the seat transitions. The stated policy on an expired hold is REFUSE — silently charging for a released seat is the failure that actually ships to production.'],
  ['A test that proves the race is closed',
   ['@Test',
    'void onlyOneOfTwoConcurrentUsersGetsTheSeat() throws Exception {',
    '    BookingService svc = new BookingService(new CategoryPricing());',
    '    svc.addShow(showWithSeats("SHOW1", "A1"));',
    '',
    '    int threads = 50;',
    '    var latch = new CountDownLatch(1);',
    '    var pool  = Executors.newFixedThreadPool(threads);',
    '    var wins  = new AtomicInteger();',
    '',
    '    for (int i = 0; i < threads; i++) {',
    '        int user = i;',
    '        pool.submit(() -> {',
    '            latch.await();                       // fire all at once',
    '            try {',
    '                svc.hold("SHOW1", List.of("A1"), "user" + user);',
    '                wins.incrementAndGet();',
    '            } catch (SeatsUnavailableException expected) { }',
    '            return null;',
    '        });',
    '    }',
    '    latch.countDown();',
    '    pool.shutdown();',
    '    pool.awaitTermination(5, TimeUnit.SECONDS);',
    '',
    '    assertEquals(1, wins.get());                 // exactly one winner',
    '}'],
   'Writing this test in a machine-coding round is worth more than another feature. It is the difference between claiming the design is correct and demonstrating it.']
 ]
};

PLAN.lldSolution.lru = {
 statement:'Design a fixed-capacity cache with O(1) get and put. When capacity is exceeded, evict the least recently used entry. Then extend it: make the eviction policy swappable to LFU, add a per-entry TTL, and make it safe under concurrent access.',
 req:{
  functional:[
   'get(key) returns the value or null, and counts as a use.',
   'put(key, value) inserts or updates, evicting if full.',
   'Eviction policy must be replaceable without rewriting the cache.',
   'Optional TTL per entry.'
  ],
  nonFunctional:[
   'Both operations O(1) — amortised is not good enough here, they mean worst case.',
   'No memory leak: an evicted key must leave BOTH structures.',
   'Thread safety discussed, with a story better than one global lock.'
  ]
 },
 approach:[
  ['1. Say the two structures immediately','Hashmap for O(1) lookup, doubly linked list for O(1) reordering. Neither alone is enough — say why.'],
  ['2. Use sentinel head and tail','It removes every null check. Under time pressure this is the difference between working and nearly working.'],
  ['3. Write get, then put','get moves to front. put handles update, insert, and evict-then-insert.'],
  ['4. Watch the eviction bug','Removing from the list but not the map is the classic leak. Say it aloud as you write it.'],
  ['5. Lift the policy out','Once LRU works, extract EvictionPolicy. That is what turns a LeetCode answer into a design answer, and it is what makes the LFU follow-up a swap not a rewrite.'],
  ['6. Handle the concurrency question in three levels','Global lock, then segmentation, then approximate LRU with read buffering. Name all three.']
 ],
 uml:[
  '   ┌────────────────────────────────┐      ┌──────────────────────────┐',
  '   │        LruCache<K,V>           │─────▶│      «interface»         │',
  '   ├────────────────────────────────┤      │    EvictionPolicy<K>     │',
  '   │ -map : Map<K, Node<K,V>>       │      ├──────────────────────────┤',
  '   │ -head, -tail : Node  «sentinel»│      │ +recordAccess(K)         │',
  '   │ -capacity : int                │      │ +evictCandidate() : K    │',
  '   │ +get(K) : V                    │      └────────────△─────────────┘',
  '   │ +put(K,V)                      │            ┌──────┴──────┐',
  '   │ -moveToFront(Node)             │      ┌─────┴─────┐ ┌─────┴─────┐',
  '   │ -addFront(Node) -remove(Node)  │      │  LruPolicy│ │ LfuPolicy │',
  '   └───────────────┬────────────────┘      └───────────┘ └───────────┘',
  '                   │ owns',
  '                   ▼',
  '   ┌────────────────────────────────┐',
  '   │          Node<K,V>             │',
  '   ├────────────────────────────────┤',
  '   │ -key : K   -value : V          │',
  '   │ -prev : Node  -next : Node     │',
  '   └────────────────────────────────┘',
  '',
  '   head ⇄ [most recent] ⇄ ... ⇄ [least recent] ⇄ tail',
  '    ▲                                             ▲',
  '    │ insert here                     evict here ─┘',
  '   sentinel                                   sentinel'
 ],
 api:[
  ['V get(K key)','Returns the value and marks it most-recently-used. null if absent.'],
  ['void put(K key, V value)','Insert or update. Evicts the LRU entry when at capacity.'],
  ['V remove(K key)','Explicit removal from both structures.'],
  ['int size()','Current entry count.'],
  ['CacheStats stats()','Hits, misses, evictions — for the "how do you know it works" follow-up.']
 ],
 schema:[
  ['Note','—','An in-memory cache has no schema. If they push toward distributed caching, that is a system design question: consistent hashing, invalidation, and the fact that per-node LRU is no longer global LRU.']
 ],
 solution:[
  ['The node and the sentinel list',
   ['class Node<K, V> {',
    '    final K key;',
    '    V value;',
    '    Node<K, V> prev, next;',
    '',
    '    Node(K key, V value) { this.key = key; this.value = value; }',
    '}',
    '',
    'public class LruCache<K, V> {',
    '    private final int capacity;',
    '    private final Map<K, Node<K, V>> map;',
    '    private final Node<K, V> head = new Node<>(null, null);   // sentinels:',
    '    private final Node<K, V> tail = new Node<>(null, null);   // no null checks',
    '',
    '    public LruCache(int capacity) {',
    '        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");',
    '        this.capacity = capacity;',
    '        this.map = new HashMap<>(capacity * 2);',
    '        head.next = tail;',
    '        tail.prev = head;',
    '    }',
    '',
    '    // --- list primitives, each O(1) ---',
    '    private void unlink(Node<K, V> n) {',
    '        n.prev.next = n.next;',
    '        n.next.prev = n.prev;',
    '    }',
    '',
    '    private void addFront(Node<K, V> n) {',
    '        n.next = head.next;',
    '        n.prev = head;',
    '        head.next.prev = n;',
    '        head.next = n;',
    '    }',
    '',
    '    private void moveToFront(Node<K, V> n) { unlink(n); addFront(n); }',
    '}'],
   'Sentinels mean unlink() never checks for null, because head and tail always exist. Under a 20-minute clock that removes an entire class of bug.'],
  ['get and put',
   ['    public V get(K key) {',
    '        Node<K, V> n = map.get(key);',
    '        if (n == null) { misses++; return null; }',
    '        hits++;',
    '        moveToFront(n);            // a READ mutates the list - hence no lock-free LRU',
    '        return n.value;',
    '    }',
    '',
    '    public void put(K key, V value) {',
    '        Node<K, V> existing = map.get(key);',
    '        if (existing != null) {',
    '            existing.value = value;',
    '            moveToFront(existing);',
    '            return;',
    '        }',
    '',
    '        if (map.size() == capacity) {',
    '            Node<K, V> lru = tail.prev;      // sentinel guarantees this exists',
    '            unlink(lru);',
    '            map.remove(lru.key);            // <-- BOTH structures. The classic bug.',
    '            evictions++;',
    '        }',
    '',
    '        Node<K, V> fresh = new Node<>(key, value);',
    '        map.put(key, fresh);',
    '        addFront(fresh);',
    '    }',
    '',
    '    public V remove(K key) {',
    '        Node<K, V> n = map.remove(key);',
    '        if (n == null) return null;',
    '        unlink(n);',
    '        return n.value;',
    '    }',
    '',
    '    public int size() { return map.size(); }'],
   'The comment on moveToFront in get() is worth saying out loud: a cache read is a write to the recency structure. That single fact is why a plain LRU cannot be lock-free, and it is the setup for the whole concurrency follow-up.'],
  ['LFU — frequency buckets with a tracked minimum',
   ['public class LfuCache<K, V> {',
    '    private final int capacity;',
    '    private final Map<K, V> values   = new HashMap<>();',
    '    private final Map<K, Integer> freq = new HashMap<>();',
    '    // LinkedHashSet: ties within a frequency break by recency',
    '    private final Map<Integer, LinkedHashSet<K>> buckets = new HashMap<>();',
    '    private int minFreq = 0;',
    '',
    '    public V get(K key) {',
    '        if (!values.containsKey(key)) return null;',
    '        touch(key);',
    '        return values.get(key);',
    '    }',
    '',
    '    public void put(K key, V value) {',
    '        if (capacity == 0) return;',
    '        if (values.containsKey(key)) { values.put(key, value); touch(key); return; }',
    '',
    '        if (values.size() == capacity) {',
    '            LinkedHashSet<K> lowest = buckets.get(minFreq);',
    '            K victim = lowest.iterator().next();     // least frequent, then oldest',
    '            lowest.remove(victim);',
    '            values.remove(victim);',
    '            freq.remove(victim);',
    '        }',
    '        values.put(key, value);',
    '        freq.put(key, 1);',
    '        buckets.computeIfAbsent(1, k -> new LinkedHashSet<>()).add(key);',
    '        minFreq = 1;                                  // a new key is always freq 1',
    '    }',
    '',
    '    private void touch(K key) {',
    '        int f = freq.get(key);',
    '        buckets.get(f).remove(key);',
    '        if (buckets.get(f).isEmpty() && minFreq == f) minFreq++;   // <-- the trick',
    '        freq.put(key, f + 1);',
    '        buckets.computeIfAbsent(f + 1, k -> new LinkedHashSet<>()).add(key);',
    '    }',
    '}'],
   'minFreq is what keeps eviction O(1). Without it you would scan the buckets for the minimum on every eviction. The two places it moves — up in touch(), reset to 1 in put() — are the whole algorithm.'],
  ['Thread safety, in three honest levels',
   ['// LEVEL 1 - correct, and it serialises every user against every other',
    'public synchronized V get(K key) { ... }',
    '',
    '// LEVEL 2 - segmentation. Lock per shard, not per cache.',
    'public class SegmentedLruCache<K, V> {',
    '    private final LruCache<K, V>[] segments;',
    '',
    '    @SuppressWarnings("unchecked")',
    '    public SegmentedLruCache(int capacity, int segmentCount) {',
    '        segments = new LruCache[segmentCount];',
    '        int per = Math.max(1, capacity / segmentCount);',
    '        for (int i = 0; i < segmentCount; i++) segments[i] = new LruCache<>(per);',
    '    }',
    '',
    '    private LruCache<K, V> segmentFor(K key) {',
    '        return segments[Math.floorMod(key.hashCode(), segments.length)];',
    '    }',
    '',
    '    public V get(K key) {',
    '        LruCache<K, V> seg = segmentFor(key);',
    '        synchronized (seg) { return seg.get(key); }',
    '    }',
    '}',
    '// Trade-off to state: eviction is now per-segment, so the policy is',
    '// approximate globally. Usually acceptable, and you should say so.',
    '',
    '// LEVEL 3 - what production caches actually do.',
    '// Caffeine buffers reads in a lock-free ring and replays them in batches,',
    '// so the hot path never touches the recency list. Its admission policy is',
    '// W-TinyLFU, which beats both plain LRU and plain LFU on real workloads.'],
   'Being able to walk all three levels — and naming Caffeine and W-TinyLFU at the end — is what separates someone who has implemented a cache from someone who has run one.']
 ]
};


/* ============================================ AMAZON LEADERSHIP PRINCIPLES ===
   Roughly half of Amazon's hiring signal, and the most common reason strong
   coders are rejected. It is not one round - it is woven through every round,
   and the bar-raiser can veto on LP alone.

   This section is a workstream, not a reading list. The story bank at the end
   is meant to be filled in and rehearsed out loud.                          */

PLAN.lp = {};

PLAN.lp.scoring = {
  intro:'LP is not a soft round you turn up to. It is a structured, rubric-scored evaluation running through the entire loop, and it carries roughly half the decision.',
  rounds:[
   ['Every technical round','15–20 min at the end','Your coding interviewer also scores LP. They will ask one or two behavioural questions after the problem, and they write them up against named principles.'],
   ['The dedicated behavioural round','45–60 min','Usually 3–5 stories, each with 4–8 follow-up probes. This is where depth is tested.'],
   ['The bar-raiser','45–60 min','A trained interviewer from OUTSIDE the hiring team, with veto power. They are not measuring you against this team — they are measuring whether you raise the bar for Amazon overall. Often the hardest LP probing of the loop.'],
   ['Debrief','after','Every interviewer submits written notes tagged to principles. Gaps are visible: if nobody scored you on Dive Deep, that is itself a problem.']
  ],
  rubric:[
   ['What they write down','Interviewers take near-verbatim notes as you speak. Vague answers produce vague notes, and vague notes do not get you hired.'],
   ['They score the ACTION','Not the outcome, not the team. What did YOU do, decide, and change?'],
   ['They probe for depth','The story is the setup. The follow-ups are the test. A polished story with thin follow-ups reads as rehearsed rather than lived.'],
   ['They look for data','"It got much faster" is a claim. "p99 went from 3.2s to 380ms" is evidence. Amazon is a metrics culture and this is scored.'],
   ['They look for failure','A candidate with no failure stories is either inexperienced or not self-aware. Both are rejections.'],
   ['Coverage matters','You are scored against specific principles. If you tell four Deliver Results stories, you have one data point across four rounds.']
  ],
  reality:[
   'The bar-raiser can reject you when every coding round passed. This happens constantly.',
   'You will be interrupted mid-story. That is not rudeness — they are steering toward the part they need to score.',
   'Two hours of stories from a 45-minute round means you told too few, too long. Aim for a 2-minute story plus 6 minutes of probing.',
   'They can tell a fabricated story within three follow-ups, because invented detail does not survive "what exactly did you say to them?"'
  ]
};

PLAN.lp.star = {
  intro:'STAR is the format. Amazon uses it with very specific proportions, and most candidates get the balance backwards — long setup, thin action.',
  parts:[
   ['S — Situation','15 sec · ~10%','Context only. Company, team, what the system did, what was wrong. Two or three sentences. If you are still describing the architecture at 60 seconds, you have lost them.'],
   ['T — Task','15 sec · ~10%','YOUR specific responsibility. Not the team goal — the part you owned. "I was asked to…" or "I decided to…".'],
   ['A — Action','60–75 sec · ~60%','THE BULK. What you did, in first person, in sequence. Decisions you made, alternatives you rejected and why, who you convinced, what you built. This is the only part that gets scored properly.'],
   ['R — Result','20 sec · ~15%','Quantified. Latency, cost, revenue, incident count, hours saved, users affected. If you genuinely cannot measure it, say what you observed and be explicit that it was not measured.'],
   ['L — Learning','10 sec · ~5%','Not formally in STAR, but Amazon expects it. What you would do differently. Volunteering this pre-empts the most common follow-up.']
  ],
  rules:[
   'Say "I", not "we". Amazon scores your actions. If a story genuinely was a team effort, say what YOUR part was inside it.',
   'Present tense for the situation, past tense for actions. It keeps the narration crisp.',
   'One story, one primary principle. Know which one you are answering before you start talking.',
   'Have the numbers ready before the interview. Digging for them mid-story kills the pace.',
   'Practise the 2-minute version AND the 30-second version. Sometimes they only want the headline.',
   'Never read from notes. Rehearsed-but-natural is the target; recited is worse than rough.'
  ],
  timing:'Target: 2 minutes for the story, then 5–8 minutes of follow-ups. If you talk for five minutes uninterrupted, the interviewer has no time to probe, and un-probed stories score low because they cannot be verified.'
};

PLAN.lp.probes = {
  intro:'The story is the setup. These are the test. Prepare answers to every one of these for every story you own — the follow-ups are where fabricated stories fall apart and real ones earn their score.',
  groups:[
   ['On your specific contribution',[
     'What exactly was YOUR part in this?',
     'Who else was involved, and what did they do?',
     'What would have happened if you had not been there?',
     'Was this your idea, or were you assigned it?'
   ]],
   ['On the decision',[
     'What alternatives did you consider?',
     'Why did you reject the other options?',
     'What data did you have at the time?',
     'What did you get wrong in your initial assessment?',
     'Who disagreed with you, and how did you handle it?'
   ]],
   ['On depth (this is Dive Deep, and it is where people fail)',[
     'Walk me through how it actually worked, technically.',
     'How did you know that was the root cause and not a symptom?',
     'What did the metric look like before and after?',
     'How did you measure that?',
     'What was the hardest bug, and how did you find it?'
   ]],
   ['On difficulty and failure',[
     'What was the hardest part?',
     'What went wrong?',
     'What would you do differently?',
     'What did you learn?',
     'If you had twice the time, what would you have changed?'
   ]],
   ['On impact',[
     'How do you know it worked?',
     'What was the business impact?',
     'Did it hold up over time?',
     'What did it cost — in effort, in money, in complexity?'
   ]],
   ['On people',[
     'How did you convince them?',
     'What did they say?',
     'What happened to the relationship afterwards?',
     'How did you handle it when someone pushed back?'
   ]]
  ],
  tactics:[
   ['When you do not know a number','Say so, then give the shape: "I do not have the exact figure, but it was roughly a 5x improvement and we stopped getting paged." Guessing precisely is worse than being honest about approximation.'],
   ['When you are interrupted','Stop and answer. Do not finish your sentence first. They are steering toward what they need to score.'],
   ['When the probe goes deeper than your story','Go with it. This is what Dive Deep looks like — you are being invited to demonstrate real understanding. Never bluff; they will keep going.'],
   ['When you genuinely did not do the thing','Say so and reframe: "I was not the one who built that, but I did X." Claiming someone else\'s work is the fastest rejection there is.'],
   ['When they ask for a second example','Have one. "Give me another time you did this" is standard, and having only one story per principle shows.']
  ]
};

PLAN.lp.antipatterns = [
 ['Saying "we" throughout','The single most common failure. Amazon scores individual actions. Record yourself and count — most people say "we" 20+ times in a two-minute story without noticing.',
  'FIX: rewrite every story in first person, then rehearse it. Where the work truly was collective, say "the team decided X; I owned Y and did Z."'],
 ['No numbers','"It improved performance a lot" is unverifiable and scores as a claim, not a result.',
  'FIX: dig out the real figures now, before the interview. Latency, error rate, throughput, cost, hours, incident count, number of users. Any real number beats an adjective.'],
 ['A 6-minute story','You have crowded out the follow-ups, and un-probed stories score low because they cannot be verified.',
  'FIX: time yourself. Two minutes. Cut the architecture description first — it is almost always the bloat.'],
 ['No failure stories','A candidate who has never failed is either junior or not self-aware. Both are rejections, and "biggest failure" is asked in most loops.',
  'FIX: prepare two genuine failures with real consequences, and what changed in your behaviour afterwards. Not "I worked too hard."'],
 ['A fake failure','"My weakness is that I care too much" is transparent and actively damaging — it reads as evasion.',
  'FIX: pick something that actually cost the business, that you actually caused, and that you actually fixed your process over.'],
 ['One story reused for everything','Interviewers compare notes at debrief. The same story in three rounds is visible and reads as thin experience.',
  'FIX: build the coverage matrix. 12–15 distinct stories mapped across the principles.'],
 ['Blaming others','"The other team gave us bad requirements" reads as lack of ownership, which is the LP they care most about.',
  'FIX: even when it was genuinely someone else\'s fault, the story is about what YOU did about it.'],
 ['Only success stories with tidy endings','Real engineering is messy. Perfect arcs read as fabricated.',
  'FIX: include the part that went badly, the thing you missed, the pushback you got.'],
 ['Reciting','A word-perfect story delivered at speed sounds memorised, and memorised sounds untrue.',
  'FIX: rehearse the STRUCTURE and the numbers, not the sentences. Different words each time is a good sign.'],
 ['Answering a different principle','Being asked about Have Backbone and telling a Deliver Results story means the interviewer has nothing to score.',
  'FIX: before you speak, name the principle to yourself. If you are unsure what they are asking for, ask them to clarify — that is allowed and reads well.']
];

PLAN.lp.worked = {
 question:'Tell me about a time you took ownership of something outside your remit.',
 principle:'Ownership (primary) · Dive Deep and Bias for Action (secondary)',
 story:[
  ['S — Situation (18 sec)',
   'Our backend runs as a monolith on Kubernetes, and we started getting paged two or three nights a week for pods restarting under load. It was logged as an infra issue and sat with the platform team for about three weeks with no progress.',
   'Short. Enough context to follow, no architecture tour. Note the concrete pain — "two or three nights a week" is already a number.'],
  ['T — Task (12 sec)',
   'It was not my service and not my team, but I was on the on-call rota being woken up by it, so I decided to find the actual cause rather than keep acknowledging alerts.',
   'This is the Ownership hook: explicitly outside the remit, explicitly a decision to act. "I decided" not "I was asked."'],
  ['A — Action (75 sec)',
   'I started with the pod events rather than the application logs, and saw exit code 137 — OOMKilled, not a crash. The container limit was 1GB and the JVM had no heap configuration, so it was sizing the heap from the node\'s memory, about 16GB, and blowing past the container limit. ' +
   'I reproduced it locally by running the image with a 1GB constraint and driving load at it. ' +
   'Two options: raise the limit, which was the fast fix everyone wanted, or make the JVM container-aware, which meant a config change plus a rollout. I pushed for the second because raising the limit would have masked it until the next traffic increase. ' +
   'I set MaxRAMPercentage to 75 and accounted for metaspace and thread stacks on top of heap. ' +
   'The platform lead pushed back — he thought it was a genuine leak. I took a heap dump under load and showed him the dominator tree: it was steady-state, no leak. He agreed and we shipped it. ' +
   'I also added a Grafana panel for container memory versus JVM heap, because nobody could see the gap.',
   'This is 60% of the runtime and it is all first-person decisions. Notice: a rejected alternative WITH the reason, a named disagreement and how it was resolved, and evidence rather than assertion. The heap dump is the Dive Deep moment.'],
  ['R — Result (20 sec)',
   'Restarts went from roughly 15 a week to zero, and they stayed at zero through the next quarter including a traffic increase. We stopped being paged for it entirely. The dashboard later caught the same class of problem in a different service before it caused an incident.',
   'Numbers, durability ("stayed at zero"), and a second-order impact. The last sentence quietly demonstrates broader value.'],
  ['L — Learning (12 sec)',
   'What I would do differently is escalate sooner. I sat with three weeks of bad sleep before deciding it was mine to fix. Now when something wakes me twice, I either own it or get it explicitly owned by someone else that week.',
   'A real, specific behaviour change. This pre-empts "what would you do differently?" and it is not a humblebrag.']
 ],
 probesAndAnswers:[
  ['How did you know it was OOMKilled and not an application crash?','Exit code 137 in kubectl describe, and the kernel OOM message in the node events. An application exception would exit 1 and leave a stack trace in the logs — there was none.'],
  ['Why not just raise the memory limit?','It would have worked until the next traffic increase, and it would have cost us capacity across every replica. The JVM was misconfigured; raising the limit treats the symptom. I said that explicitly at the time.'],
  ['What did the platform lead actually say?','He thought it was a memory leak and wanted a profiler run before any config change. That was a reasonable position — I just had evidence it was not. I took the heap dump, showed him retained size was flat across an hour under load, and he changed his mind in about ten minutes.'],
  ['What was the hardest part?','Convincing people it was worth fixing properly when a one-line limit increase would have stopped the pages that night. The pressure to take the fast fix was real.'],
  ['How did you measure the result?','Restart count from the kube-state metrics, weekly. It was about 15 a week before and zero after, sustained over the following quarter.'],
  ['Would this have been caught earlier with better process?','Yes. We had no alert on container memory versus heap, and no default JVM configuration in the base image. I fixed the first; the second is still open, and I would push for it if I were doing it again.']
 ],
 why:'This story works because: it names a decision made against the easy option, it contains a disagreement resolved with evidence, every claim has a number behind it, the learning is a genuine behaviour change, and the follow-ups go deeper than the story without running out of material. It also happens to be true for the person telling it — which is why the probes are answerable.'
};

/* freq: how often this comes up for an SDE2 / mid-level backend candidate.
   high = expect it in most loops · med = likely once · low = rare below senior */

PLAN.lp.principles = [

{id:'ownership', n:1, name:'Ownership', freq:'high',
 official:'Leaders are owners. They think long term and do not sacrifice long-term value for short-term results. They act on behalf of the entire company, beyond just their own team. They never say "that is not my job."',
 means:'You did something because it needed doing, not because it was assigned to you — and you stayed with it past the point where you could have handed it off.',
 signal:'Will this person let a problem rot because it sits in someone else\'s column? Amazon is deliberately under-staffed relative to scope, so people who wait to be told are expensive.',
 asked:[
  'Tell me about a time you took on something outside your job responsibilities.',
  'Describe a time you saw a problem nobody owned and acted on it.',
  'Tell me about a time you had to make a decision with long-term consequences.',
  'When have you sacrificed a short-term win for a long-term one?'
 ],
 probes:[
  'Why was it your problem?',
  'What would have happened if you had done nothing?',
  'Did anyone tell you to stop?',
  'How did you balance this against your actual assigned work?'
 ],
 strong:'You crossed a boundary deliberately, you can say why the easy option was wrong, and you stayed involved through the follow-through — including the unglamorous parts like documentation, alerting, or handover.',
 weak:'"I helped out another team when they asked." That is cooperation, not ownership. Ownership starts with nobody asking.',
 pairs:'Bias for Action · Dive Deep · Deliver Results',
 yourAngle:'Your on-call and production experience is the natural source here. An incident you chased past the point of "restart it and go back to bed" is an Ownership story.'},

{id:'dive-deep', n:2, name:'Dive Deep', freq:'high',
 official:'Leaders operate at all levels, stay connected to the details, audit frequently, and are sceptical when metrics and anecdote differ. No task is beneath them.',
 means:'You went to the actual mechanism rather than stopping at the plausible explanation.',
 signal:'The single most-probed principle for engineers. They are testing whether you understand what you built or merely operated it. This is the one where bluffing is detected fastest.',
 asked:[
  'Tell me about the most complex problem you have debugged.',
  'Describe a time the data contradicted what everyone believed.',
  'Tell me about a time you found a root cause others had missed.',
  'When did you have to learn something deeply and quickly?'
 ],
 probes:[
  'Walk me through exactly how it worked.',
  'How did you know that was the root cause and not a symptom?',
  'What did you rule out, and how?',
  'What tools did you use?',
  'What did the numbers look like before and after?'
 ],
 strong:'You can go three levels deeper than the story required, unprompted. You name the specific tool, the specific metric, the specific line of reasoning that eliminated the wrong hypothesis.',
 weak:'"I looked at the logs and found the issue." No mechanism, no elimination, no measurement. Also weak: a deep story you can no longer explain, which reads as someone else\'s work.',
 pairs:'Ownership · Insist on the Highest Standards · Are Right, A Lot',
 yourAngle:'A slow Postgres query you traced through EXPLAIN, or a Kubernetes issue where the obvious cause was wrong. These are your strongest raw material — you have felt them.'},

{id:'deliver-results', n:3, name:'Deliver Results', freq:'high',
 official:'Leaders focus on the key inputs for their business and deliver them with the right quality and in a timely fashion. Despite setbacks, they rise to the occasion and never settle.',
 means:'You shipped, under constraint, and the outcome was measurable.',
 signal:'Can you finish? Amazon has plenty of people with good ideas. This principle is about whether the thing actually landed.',
 asked:[
  'Tell me about a time you delivered under a tight deadline.',
  'Describe a project where you had to overcome significant obstacles.',
  'Tell me about a goal you achieved that seemed out of reach.',
  'When did you have to push through despite setbacks?'
 ],
 probes:[
  'What did you cut to make the date?',
  'What was the setback and how did you get past it?',
  'What did the result actually measure?',
  'Did it hold up afterwards?'
 ],
 strong:'A named constraint (time, people, dependency), an explicit trade-off you chose, and a quantified outcome that survived contact with reality.',
 weak:'A story where nothing went wrong. There was no obstacle, so there was nothing to demonstrate.',
 pairs:'Bias for Action · Ownership · Insist on the Highest Standards',
 yourAngle:'A release you got out despite a blocking dependency, or a migration you completed without downtime. Have the before/after numbers.'},

{id:'customer-obsession', n:4, name:'Customer Obsession', freq:'high',
 official:'Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust. Although leaders pay attention to competitors, they obsess over customers.',
 means:'You changed a technical decision because of what it did to the person using the thing.',
 signal:'Amazon\'s founding principle, asked in almost every loop. For backend engineers the trap is having no customer story at all because "I do not talk to customers."',
 asked:[
  'Tell me about a time you went above and beyond for a customer.',
  'Describe a time you used customer feedback to drive a change.',
  'Tell me about a time you had to balance customer needs against business or technical constraints.',
  'When did you say no to a customer?'
 ],
 probes:[
  'Who was the customer, specifically?',
  'How did you know that was what they needed?',
  'What did it cost you to do that?',
  'How did you measure whether it helped?'
 ],
 strong:'Your "customer" can be an internal team, another service, or the on-call engineer downstream — say so explicitly and it counts. The strength is showing you traced a technical choice to a human consequence.',
 weak:'"I do not have customer contact." Reframe it. Every backend engineer has consumers of their API, their data or their alerts.',
 pairs:'Ownership · Insist on the Highest Standards · Earn Trust',
 yourAngle:'You have a frontend consuming your backend pods. Their experience of your latency or your error responses IS the customer relationship.'},

{id:'bias-for-action', n:5, name:'Bias for Action', freq:'high',
 official:'Speed matters in business. Many decisions and actions are reversible and do not need extensive study. We value calculated risk taking.',
 means:'You moved without full information, having correctly judged that the decision was reversible.',
 signal:'Do you stall? Amazon distinguishes one-way doors (irreversible, deliberate) from two-way doors (reversible, act fast). Knowing the difference is the actual test.',
 asked:[
  'Tell me about a time you made a decision with incomplete information.',
  'Describe a time you had to move fast on something.',
  'Tell me about a calculated risk you took.',
  'When did you act without waiting for approval?'
 ],
 probes:[
  'What information were you missing?',
  'What was the worst case if you were wrong?',
  'How would you have reversed it?',
  'Did it turn out to be the right call?'
 ],
 strong:'You explicitly reasoned about reversibility, and you had a rollback. Using the two-way-door framing unprompted lands very well because it is Amazon\'s own language.',
 weak:'Recklessness dressed as speed — acting fast with no assessment of downside. And its opposite: a story where you gathered data for six weeks first.',
 pairs:'Ownership · Deliver Results · Are Right, A Lot',
 yourAngle:'A production hotfix you shipped behind a flag, or a config change you made during an incident with a rollback ready.'},

{id:'earn-trust', n:6, name:'Earn Trust', freq:'high',
 official:'Leaders listen attentively, speak candidly, and treat others respectfully. They are vocally self-critical, even when doing so is awkward. They benchmark themselves against the best.',
 means:'You said the awkward true thing, or you admitted your own mistake before anyone caught it.',
 signal:'"Vocally self-critical" is the operative phrase. They want someone who surfaces their own errors, not someone who is merely pleasant.',
 asked:[
  'Tell me about a time you made a mistake. What did you do?',
  'Describe a time you had to give difficult feedback.',
  'Tell me about a time you lost someone\'s trust and rebuilt it.',
  'When have you been vocally self-critical?'
 ],
 probes:[
  'Who did you tell, and how quickly?',
  'What was the consequence?',
  'How did they react?',
  'What did you change afterwards?'
 ],
 strong:'You raised it yourself before it was discovered, you owned the consequence without hedging, and you changed a process rather than just promising to be careful.',
 weak:'A mistake with no consequence, or one you were caught doing. Also weak: blaming the process rather than owning your part in it.',
 pairs:'Ownership · Have Backbone · Insist on the Highest Standards',
 yourAngle:'A production issue you caused. Everyone has one. The story is what you did in the first ten minutes and what you changed afterwards.'},

{id:'backbone', n:7, name:'Have Backbone; Disagree and Commit', freq:'high',
 official:'Leaders are obligated to respectfully challenge decisions when they disagree, even when doing so is uncomfortable or exhausting. Once a decision is determined, they commit wholly.',
 means:'You pushed back on someone with more authority, with evidence — and then, if you lost, you executed the decision properly anyway.',
 signal:'BOTH halves are scored, and most candidates only tell the first. Disagreeing is easy; committing wholeheartedly to a decision you argued against is the harder, rarer signal.',
 asked:[
  'Tell me about a time you disagreed with your manager.',
  'Describe a time you challenged a decision you thought was wrong.',
  'Tell me about a time you had to commit to a decision you disagreed with.',
  'When did you stand alone on a position?'
 ],
 probes:[
  'What exactly did you say?',
  'What data did you bring?',
  'What happened after the decision was made?',
  'Did you turn out to be right?',
  'How is your relationship with that person now?'
 ],
 strong:'Named disagreement, evidence rather than opinion, an explicit escalation path, and then — crucially — genuine commitment afterwards. "I still think I was right, and I made it work anyway" is a very strong ending.',
 weak:'Only disagreeing (no commit half), or only committing (no backbone). Also weak: disagreeing with a peer. The signal is stronger when there was a power gradient.',
 pairs:'Earn Trust · Are Right, A Lot · Dive Deep',
 yourAngle:'This is one of the two questions that catches people. Prepare it specifically. A technical decision you argued against with data — architecture, tooling, a deadline.'},

{id:'invent-simplify', n:8, name:'Invent and Simplify', freq:'med',
 official:'Leaders expect and require innovation and invention from their teams and always find ways to simplify. They are externally aware, look for new ideas from everywhere, and are not limited by "not invented here."',
 means:'You removed complexity, or you solved something in a way nobody on the team had considered.',
 signal:'Simplification counts as much as invention, and is far more available to a mid-level engineer. Deleting things is a legitimate answer.',
 asked:[
  'Tell me about a time you simplified a complex process.',
  'Describe something you invented or an unconventional solution you found.',
  'Tell me about a time you improved an existing system significantly.',
  'When did you challenge how something had always been done?'
 ],
 probes:[
  'What made it complex in the first place?',
  'What did you remove?',
  'Why had nobody done this before?',
  'What did the simplification cost you?'
 ],
 strong:'A measurable reduction — lines of code, steps in a process, services, deploy time, manual work eliminated. Simplification with a number is very strong and very underused.',
 weak:'Describing normal feature work as invention. Also weak: a "simplification" that just moved complexity somewhere else, with no acknowledgement.',
 pairs:'Deliver Results · Dive Deep · Frugality',
 yourAngle:'Automating something manual, collapsing duplicated code, or replacing a hand-rolled component with something standard. Your custom event-driven components are also an invention story if you can say why you built rather than bought.'},

{id:'highest-standards', n:9, name:'Insist on the Highest Standards', freq:'med',
 official:'Leaders have relentlessly high standards — many people may think these standards are unreasonably high. Leaders continually raise the bar and drive their teams to deliver high-quality products, services and processes. They ensure defects do not get sent down the line.',
 means:'You refused to ship something that met the requirement but not the bar, and you can say what the bar was.',
 signal:'Do you have a bar at all, and can you articulate it? Also: do you hold OTHERS to it, which is the harder half.',
 asked:[
  'Tell me about a time you were not satisfied with the quality of something.',
  'Describe a time you pushed back on shipping.',
  'Tell me about how you have raised the bar for your team.',
  'When did you refuse to accept "good enough"?'
 ],
 probes:[
  'What specifically was not good enough?',
  'What was the cost of holding the line?',
  'Did anyone push back?',
  'How do you decide when good enough IS good enough?'
 ],
 strong:'A specific, articulable standard, a real cost paid to hold it, and — importantly — evidence you know when NOT to. Perfectionism without judgement is a negative signal.',
 weak:'"I am a perfectionist." Also weak: holding a standard nobody else agreed with and shipping late for no measurable benefit.',
 pairs:'Earn Trust · Dive Deep · Deliver Results',
 yourAngle:'A code review where you blocked a merge, a test suite you insisted on, or an incident postmortem where you pushed for the real fix over the quick one.'},

{id:'learn-curious', n:10, name:'Learn and Be Curious', freq:'med',
 official:'Leaders are never done learning and always seek to improve themselves. They are curious about new possibilities and act to explore them.',
 means:'You learned something hard because you were curious, not because you were told to.',
 signal:'Amazon changes stack and domain frequently. They want people who self-direct their learning rather than waiting for training.',
 asked:[
  'Tell me about something you learned recently outside your job.',
  'Describe a time you had to get up to speed on something unfamiliar, fast.',
  'Tell me about a time your curiosity led to a better outcome.',
  'How do you stay current?'
 ],
 probes:[
  'Why that, specifically?',
  'How did you go about learning it?',
  'What did you do with it?',
  'What are you learning right now?'
 ],
 strong:'Self-directed, applied to something real, with an outcome. "I learned X and then used it to do Y" beats "I read about X."',
 weak:'Listing courses or certifications with no application. Also weak: having no answer to "what are you learning right now?" — that question is nearly always asked.',
 pairs:'Dive Deep · Invent and Simplify',
 yourAngle:'Kafka and microservices, which you are learning without using at work, is a genuinely good answer — self-directed, and you will have a built artefact to point at.'},

{id:'are-right', n:11, name:'Are Right, A Lot', freq:'med',
 official:'Leaders are right a lot. They have strong judgement and good instincts. They seek diverse perspectives and work to disconfirm their beliefs.',
 means:'You made a judgement call that turned out well — and you actively looked for evidence you were wrong before committing.',
 signal:'"Work to disconfirm their beliefs" is the part being tested. They want someone who seeks the counter-argument, not someone who is merely confident.',
 asked:[
  'Tell me about a time you had to make a judgement call without data.',
  'Describe a time you were wrong. How did you realise?',
  'Tell me about a decision you made that others disagreed with.',
  'How do you know when your instinct is wrong?'
 ],
 probes:[
  'What made you confident?',
  'Who did you ask, and what did they say?',
  'What would have changed your mind?',
  'Have you been wrong about something similar?'
 ],
 strong:'Showing the disconfirmation step explicitly: "I went to the person most likely to disagree with me and asked them to break it." That single sentence is what this principle is looking for.',
 weak:'A story that is just "I was right." No process, no doubt, no seeking of other views — that reads as arrogance rather than judgement.',
 pairs:'Dive Deep · Have Backbone · Bias for Action',
 yourAngle:'A design decision where you deliberately sought the strongest objection before committing.'},

{id:'frugality', n:12, name:'Frugality', freq:'low',
 official:'Accomplish more with less. Constraints breed resourcefulness, self-sufficiency and invention. There are no extra points for growing headcount, budget size or fixed expense.',
 means:'You achieved the outcome without the resources that seemed necessary.',
 signal:'Resourcefulness under constraint. For engineers this is usually cost, or doing something with existing tools rather than new infrastructure.',
 asked:[
  'Tell me about a time you achieved something with limited resources.',
  'Describe a time you reduced cost.',
  'Tell me about a time you had to do more with less.'
 ],
 probes:[
  'What resource were you short of?',
  'What did you give up?',
  'What did it save, quantified?'
 ],
 strong:'A real number — cloud spend, licence cost, engineer-hours saved by automation, capacity reclaimed. Right-sizing over-provisioned infrastructure is a very natural version of this.',
 weak:'Cutting corners and calling it frugality. Frugality is about resourcefulness, not about lower quality.',
 pairs:'Invent and Simplify · Deliver Results',
 yourAngle:'Right-sizing Kubernetes resource requests, or removing an unnecessary dependency. Both have measurable cost impact.'},

{id:'hire-develop', n:13, name:'Hire and Develop the Best', freq:'low',
 official:'Leaders raise the performance bar with every hire and promotion. They recognise exceptional talent and willingly move them throughout the organisation. Leaders develop leaders and take seriously their role in coaching others.',
 means:'You made someone else better, deliberately.',
 signal:'Rarely a primary question at SDE2, but a mentoring story is often accepted where one is asked. Have one, do not build three.',
 asked:[
  'Tell me about a time you mentored someone.',
  'Describe how you have helped a colleague grow.',
  'Tell me about feedback you gave that changed someone\'s performance.'
 ],
 probes:[
  'What specifically did you do?',
  'How did you know they improved?',
  'What did you learn from mentoring them?'
 ],
 strong:'A named change in the other person\'s capability, with evidence. "They went from needing review on every PR to reviewing mine" is concrete.',
 weak:'"I answer questions when people ask." That is being helpful, not developing anyone.',
 pairs:'Earn Trust · Insist on the Highest Standards',
 yourAngle:'Onboarding a new joiner, or a code review habit you taught that stuck. One story is enough at this level.'},

{id:'think-big', n:14, name:'Think Big', freq:'low',
 official:'Thinking small is a self-fulfilling prophecy. Leaders create and communicate a bold direction that inspires results. They think differently and look around corners for ways to serve customers.',
 means:'You proposed something significantly beyond the immediate scope, and made the case for it.',
 signal:'Hard to demonstrate genuinely at SDE2 and interviewers know that. A scoped-up proposal that you actually got funded counts.',
 asked:[
  'Tell me about a time you proposed something ambitious.',
  'Describe a time you looked beyond the immediate problem.',
  'Where do you think your current system should be in two years?'
 ],
 probes:[
  'Who did you have to convince?',
  'What happened to the idea?',
  'What would it have taken to do it properly?'
 ],
 strong:'An idea larger than your remit that you actually advanced — a proposal document, a prototype, a funded piece of work. Even "it was rejected, and here is what I learned about how to pitch" is usable.',
 weak:'A vision with no action attached. Thinking big without doing anything is just talking.',
 pairs:'Invent and Simplify · Ownership',
 yourAngle:'Your monolith-to-microservices analysis is exactly this — a case for a direction bigger than any one ticket, with an honest cost assessment.'},

{id:'best-employer', n:15, name:'Strive to be Earth\'s Best Employer', freq:'low',
 official:'Leaders work every day to create a safer, more productive, higher performing, more diverse and more just work environment. They lead with empathy, have fun at work, and make it easy for others to have fun.',
 means:'You improved the working environment for the people around you.',
 signal:'Rarely asked below senior. If it comes up, a story about improving team process or supporting a struggling colleague works.',
 asked:[
  'Tell me about a time you improved your team\'s working environment.',
  'Describe how you have supported a struggling teammate.'
 ],
 probes:['What changed as a result?','How did others respond?'],
 strong:'A concrete process change with a human outcome — reducing on-call burden, fixing a painful deploy, making onboarding shorter.',
 weak:'Generic statements about team culture with nothing you actually did.',
 pairs:'Earn Trust · Hire and Develop the Best',
 yourAngle:'If your on-call rota improved because of the alerting you fixed, that is this principle as well as Ownership.'},

{id:'broad-responsibility', n:16, name:'Success and Scale Bring Broad Responsibility', freq:'low',
 official:'We started in a garage, but we are not there any more. We are big, we impact the world, and we are far from perfect. We must be humble and thoughtful about even the secondary effects of our actions.',
 means:'You considered the second-order consequences of a technical decision.',
 signal:'Rarely asked below senior. Security, privacy, accessibility, environmental cost and data handling are the realistic angles for an engineer.',
 asked:[
  'Tell me about a time you considered the wider impact of a decision.',
  'Describe a time you raised a concern about privacy, security or ethics.'
 ],
 probes:['Who else was affected?','What did you do about it?'],
 strong:'A specific second-order effect you noticed and acted on — data retention, a security implication, a downstream team you would have broken.',
 weak:'Abstract statements about responsibility with no decision attached.',
 pairs:'Earn Trust · Are Right, A Lot',
 yourAngle:'Data handling on the upstream Postgres data you work with, or a security concern you raised in review.'}

];

/* 15 slots. Prompts chosen so that filling them gives coverage across every
   high and medium frequency principle, with two spare for whatever your
   actual career hands you. */
PLAN.lp.slots = [
 ['A problem nobody owned that you fixed anyway','Ownership · Bias for Action','The clearest Ownership story. Cross a boundary, stay for the follow-through.'],
 ['The hardest thing you have ever debugged','Dive Deep · Ownership','Must survive three levels of "how did you know?". Choose one you can still explain.'],
 ['A mistake you made that had real consequences','Earn Trust · Ownership','Raised by you, not discovered. What process changed afterwards.'],
 ['A time you disagreed with your manager or a senior engineer','Have Backbone · Earn Trust','BOTH halves: the disagreement AND the commitment afterwards.'],
 ['Your biggest professional failure','Earn Trust · Learn and Be Curious','The other question that catches people. Real cost, real change.'],
 ['Delivering under a hard deadline or a blocking dependency','Deliver Results · Bias for Action','Name what you cut. There must be a trade-off.'],
 ['A decision made with incomplete information','Bias for Action · Are Right, A Lot','Use the two-way-door framing. Say what your rollback was.'],
 ['Something you simplified or automated away','Invent and Simplify · Frugality','Quantify the reduction — steps, code, time, cost.'],
 ['A time you refused to ship something','Insist on the Highest Standards','What the bar was, and what holding it cost.'],
 ['Improving something for the team or a downstream consumer','Customer Obsession · Best Employer','Your "customer" can be internal. Say who, specifically.'],
 ['Something hard you taught yourself and then used','Learn and Be Curious','Self-directed, applied, with an outcome.'],
 ['A time you were wrong and changed your mind','Are Right, A Lot · Earn Trust','The disconfirmation step is the whole point.'],
 ['Mentoring or levelling someone up','Hire and Develop the Best','One is enough at SDE2. Needs evidence they actually improved.'],
 ['A proposal bigger than your remit','Think Big · Invent and Simplify','Even if rejected — what you learned about making the case.'],
 ['Spare — whatever your best story is that these prompts missed','—','Every career has one that does not fit a template. Keep the slot.']
];

PLAN.lp.plan = [
 ['Weeks 2–4','Write stories 1–5','Draft only. Get them on paper with real numbers dug out of Jira, Grafana, git history — whatever you still have access to. Do this while you are still employed.'],
 ['Weeks 5–8','Write stories 6–11','By now you know the format. Faster.'],
 ['Weeks 9–11','Write stories 12–15, build the coverage matrix','Check every high-frequency principle has at least two stories.'],
 ['Week 12','Rehearse all 15 out loud, recorded','Two minutes each. Count how many times you say "we". Rewrite the ones over 2:30.'],
 ['Week 13','Probe drill','Have someone ask you the follow-ups cold. If you cannot answer six probes on a story, it is not ready.'],
 ['Ongoing','Two per Sunday','This is the schedule that actually gets it done. Fifteen stories in one weekend does not work.']
];

PLAN.lp.mining = [
 ['Your incident history','On-call pages, postmortems, the thing that woke you at 3am. Richest single source: Ownership, Dive Deep, Earn Trust.'],
 ['Your git history','Search your own commits for the big refactors and the reverts. The reverts are failure stories.'],
 ['Jira / tickets','Look for the ones that took far longer than estimated. There is always a story in why.'],
 ['Grafana and dashboards','This is where your NUMBERS are. Before/after latency, error rate, restart counts, throughput. Screenshot them now.'],
 ['Code review comments','Times you pushed back, times you were pushed back on. Have Backbone and Highest Standards live here.'],
 ['Your production system','Frontend and backend pods on Kubernetes, Postgres upstream, custom event-driven components, a monolith. Every one of those is a decision someone made, and you have opinions about all of them.'],
 ['WARNING','Do this while you still have access. If a layoff comes in December you lose Grafana, Jira and the git history on the same day. Export what you need NOW.']
];

/* ================================================================= TECH ===
   The gradient INVERTS here: the deepest tech questioning is at the BOTTOM of
   the ladder. JPM and Amex go far deeper than Google, which asks none of it.
   qa row = [question, answerSpine, followUp] */

/* ================================================================= TECH ===
   The gradient INVERTS here: the deepest tech questioning is at the BOTTOM of
   the ladder. JPM and Amex go far deeper than Google, which asks none of it.

   Per module:
     asked  how the interviewer opens on this topic
     code   [title, [lines...], why it matters] — the pattern you must be able to write
     qa     [question, the answer spine, the follow-up they will actually ask]
     traps  the gotchas that bite in production and in interviews             */

PLAN.tech = [

{id:'java', n:1, name:'Java core & collections', phase:1, hrs:9,
 asked:[
  'Walk me through what happens when you put an object in a HashMap.',
  'Why is String immutable?',
  'ArrayList or LinkedList here, and why?',
  'How would you find a memory leak in production?'
 ],
 code:[
  ['equals / hashCode done correctly',
   ['@Override public boolean equals(Object o) {',
    '    if (this == o) return true;',
    '    if (!(o instanceof Order other)) return false;   // pattern matching, Java 16+',
    '    return Objects.equals(id, other.id);             // ONLY immutable identity fields',
    '}',
    '@Override public int hashCode() { return Objects.hash(id); }'],
   'The contract: equal objects MUST have equal hashcodes. Use only fields that never change after construction, or the object gets lost in its own HashMap.'],
  ['Safe iteration and removal',
   ['// WRONG - ConcurrentModificationException',
    'for (Order o : orders) if (o.isCancelled()) orders.remove(o);',
    '',
    '// right, single-threaded',
    'orders.removeIf(Order::isCancelled);',
    '',
    '// right, explicit iterator',
    'Iterator<Order> it = orders.iterator();',
    'while (it.hasNext()) if (it.next().isCancelled()) it.remove();'],
   'removeIf is the modern answer. Knowing WHY the enhanced for-loop throws is the interview.']
 ],
 qa:[
  ['Why is String immutable?','Security (class loading, file paths cannot be mutated after a check), hashcode caching, safe sharing in the string pool, and thread safety with no synchronisation.','Then how does StringBuilder differ, and when does the compiler use it for you? (String concatenation in a loop is the classic waste.)'],
  ['The equals/hashCode contract','Equal objects must have equal hashcodes; unequal objects may collide. Override both or neither.','You put a mutable object in a HashSet then mutate the field used in hashCode. What happens? => the bucket no longer matches, contains() returns false, and the object is unreachable but still consuming memory.'],
  ['HashMap internals','Array of buckets; each bucket a linked list; treeified into a red-black tree at 8 nodes (Java 8+); resize doubles capacity at load factor 0.75 and rehashes.','Why treeify? => it caps worst-case lookup at O(log n) and defends against hash-collision denial-of-service attacks.'],
  ['HashMap vs LinkedHashMap vs TreeMap','Unordered / insertion or access order / sorted by comparator.','Which one gives you an LRU cache almost for free? => LinkedHashMap with accessOrder=true and removeEldestEntry overridden.'],
  ['ArrayList vs LinkedList','Contiguous array with O(1) random access and cache-friendly iteration, versus node chasing with O(1) insert once you already hold the node.','Why does LinkedList lose even for middle insertion? => you still pay O(n) to walk there, and every node is a cache miss.'],
  ['Array vs ArrayList','Fixed size, can hold primitives, covariant. ArrayList grows, boxes primitives, is invariant with generics.','Why does new List<int>() not compile? => generics do not accept primitives; erasure requires reference types.'],
  ['Heap vs stack','Objects and their fields on the heap; frames, locals and references on the stack. Each thread has its own stack.','Where does a String literal live? => the string pool, which sits in the heap since Java 7.'],
  ['Garbage collection','Generational hypothesis: most objects die young. Young generation collected often and cheaply; old generation rarely and expensively. G1 splits the heap into regions and collects the emptiest first.','What is a stop-the-world pause and how do you reduce it? => smaller heaps, region-based collectors, avoiding huge object graphs, and tuning pause targets.'],
  ['Memory leak in a garbage-collected language','Unbounded caches, listeners that are never deregistered, ThreadLocal in a pooled thread, static collections that only grow, and unclosed resources.','How would you find one? => heap dump, then the dominator tree in a tool like Eclipse MAT to find who is holding the retained set.'],
  ['final, finally, finalize','A binding or class that cannot change / a block that always runs / a deprecated pre-collection hook you must never use.','Does finally always run? => not on System.exit, a JVM crash, or an infinite loop in try. And a return in finally silently swallows exceptions.'],
  ['Checked vs unchecked exceptions','Checked = the caller can plausibly recover. Unchecked = a programming error.','Why do many modern codebases avoid checked exceptions? => they leak through abstraction layers, do not compose with lambdas, and get swallowed with empty catch blocks.'],
  ['Generics and type erasure','Generic types exist at compile time only; the runtime sees raw types plus synthetic casts.','Why can you not write new T[]? => the runtime has no idea what T is, so it cannot create the array.'],
  ['== vs equals for boxed types','== compares references. Integer caches -128 to 127, so small values appear to work.','Why does Integer a = 128, b = 128; a == b evaluate false? => outside the cache range, two distinct objects.'],
  ['Comparable vs Comparator','Natural ordering inside the class versus an external ordering strategy.','Your comparator is inconsistent with equals. What breaks? => TreeSet and TreeMap silently treat distinct objects as duplicates.'],
  ['String pool and interning','Literals are pooled; new String() is not.','What does intern() do, and why is it usually a mistake? => forces pooling, and on hot paths it becomes a contended bottleneck.']
 ],
 traps:[
  'Overriding equals but not hashCode. Interviewers check this constantly.',
  'Using a mutable field in hashCode.',
  'Concatenating strings in a loop instead of StringBuilder.',
  'Assuming ArrayList.remove(int) and remove(Object) do the same thing on a List<Integer>. They do not.'
 ]},

{id:'modern', n:2, name:'Modern Java (8 to 21)', phase:1, hrs:5,
 asked:[
  'Rewrite this loop with the Streams API.',
  'When is a parallel stream a bad idea?',
  'What are records for?',
  'How do you avoid null without Optional everywhere?'
 ],
 code:[
  ['Streams: grouping and summarising',
   ['Map<Status, List<Order>> byStatus = orders.stream()',
    '        .collect(Collectors.groupingBy(Order::getStatus));',
    '',
    'Map<Status, BigDecimal> totals = orders.stream()',
    '        .collect(Collectors.groupingBy(Order::getStatus,',
    '                 Collectors.reducing(BigDecimal.ZERO, Order::getAmount, BigDecimal::add)));',
    '',
    'Optional<Order> largest = orders.stream()',
    '        .max(Comparator.comparing(Order::getAmount));'],
   'groupingBy with a downstream collector is the single most useful thing in the Streams API, and the one candidates most often fumble.'],
  ['Record as a DTO or value object',
   ['public record Money(BigDecimal amount, Currency currency) {',
    '    public Money {',
    '        if (amount.signum() < 0) throw new IllegalArgumentException("negative");',
    '    }',
    '    public Money plus(Money other) {',
    '        if (!currency.equals(other.currency)) throw new IllegalArgumentException("mixed currency");',
    '        return new Money(amount.add(other.amount), currency);',
    '    }',
    '}'],
   'Records give you a final class, equals, hashCode, toString and accessors. The compact constructor is where validation goes. Ideal for DTOs and value objects; wrong for JPA entities, which need a no-arg constructor and mutability.']
 ],
 qa:[
  ['Streams: lazy or eager?','Lazy. Intermediate operations build a pipeline; nothing runs until a terminal operation.','A stream with no terminal operation - what happens? => nothing at all, and it is a silent bug.'],
  ['When is a parallel stream slower?','Small collections, cheap per-element work, non-splittable sources like LinkedList, or any blocking IO inside the lambda.','Which thread pool does it use? => the common ForkJoinPool, shared process-wide, so one slow parallel stream starves everything else.'],
  ['Optional: correct use','A return type for a value that may legitimately be absent.','Why not as a field or a method parameter? => it is not Serializable, it adds an allocation, and an overload or null check is clearer for parameters.'],
  ['orElse vs orElseGet','orElse always evaluates its argument; orElseGet only on absence.','So what is wrong with orElse(expensiveCall())? => the expensive call runs even when the value is present.'],
  ['Records vs Lombok @Data','Records are a language feature: final, immutable, no setters. @Data generates mutable boilerplate.','Can you use a record as a JPA entity? => no. JPA needs a no-arg constructor and non-final fields for proxies.'],
  ['Sealed interfaces','Restricts which types may implement, so the compiler can check exhaustiveness in a switch.','Where does that help? => modelling a closed set of states or events, with no default branch hiding a missing case.'],
  ['var','Local type inference; the type is still static and fixed.','When does it hurt readability? => when the right-hand side does not make the type obvious.'],
  ['CompletableFuture vs Stream','Async composition versus data transformation. Different axes.','How do you run 10 HTTP calls in parallel and collect the results? => a list of CompletableFutures, then allOf(...).join(), then map to join each.'],
  ['Text blocks','Multi-line string literals. Useful for SQL and JSON in tests.','Any runtime cost? => none, resolved at compile time.'],
  ['Virtual threads (21)','Lightweight threads scheduled by the JVM; blocking is cheap so thread-per-request scales.','When do they NOT help? => CPU-bound work, and code pinned by synchronized blocks holding the carrier thread.']
 ],
 traps:[
  'Side effects inside a stream lambda (mutating an external list). Use a collector.',
  'Reusing a stream after a terminal operation. It throws.',
  'Optional.get() without isPresent. That is just a nullcheck with extra steps.',
  'Parallel streams on anything doing IO.'
 ]},

{id:'conc', n:3, name:'Concurrency', phase:1, hrs:12,
 note:'JPM and Amex go deep here. Your custom event-driven components make this a natural question, so expect it.',
 asked:[
  'What is the difference between volatile and synchronized?',
  'How do you size a thread pool?',
  'Write a thread-safe counter. Now make it faster.',
  'Reproduce a deadlock, then fix it.'
 ],
 code:[
  ['Thread pool with a bounded queue and a rejection policy',
   ['@Bean("taskExecutor")',
    'public ThreadPoolTaskExecutor taskExecutor() {',
    '    ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();',
    '    ex.setCorePoolSize(8);',
    '    ex.setMaxPoolSize(16);',
    '    ex.setQueueCapacity(500);                       // BOUNDED - unbounded means OOM',
    '    ex.setThreadNamePrefix("evt-");                 // shows up in thread dumps',
    '    ex.setRejectedExecutionHandler(',
    '        new ThreadPoolExecutor.CallerRunsPolicy()); // backpressure onto the caller',
    '    ex.setWaitForTasksToCompleteOnShutdown(true);',
    '    ex.setAwaitTerminationSeconds(30);',
    '    return ex;',
    '}'],
   'Three interview points in one bean: the queue is bounded, the rejection policy applies backpressure instead of dropping, and shutdown drains. The default Spring executor does none of this.'],
  ['Deadlock, and the fix',
   ['// DEADLOCK: two threads take the locks in opposite order',
    'void transfer(Account a, Account b, BigDecimal amt) {',
    '    synchronized (a) { synchronized (b) { a.debit(amt); b.credit(amt); } }',
    '}',
    '',
    '// FIX: impose a global lock ordering',
    'void transfer(Account a, Account b, BigDecimal amt) {',
    '    Account first  = a.getId() < b.getId() ? a : b;',
    '    Account second = a.getId() < b.getId() ? b : a;',
    '    synchronized (first) { synchronized (second) { a.debit(amt); b.credit(amt); } }',
    '}'],
   'Lock ordering is the standard answer. The alternative is tryLock with a timeout and retry. Be able to write both.'],
  ['Parallel calls with CompletableFuture',
   ['List<CompletableFuture<Quote>> futures = vendors.stream()',
    '    .map(v -> CompletableFuture.supplyAsync(() -> client.quote(v), taskExecutor)',
    '                 .orTimeout(2, TimeUnit.SECONDS)',
    '                 .exceptionally(ex -> Quote.unavailable(v)))',
    '    .toList();',
    '',
    'CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();',
    'List<Quote> quotes = futures.stream().map(CompletableFuture::join).toList();'],
   'Note the explicit executor (never the common pool for IO), the per-call timeout, and the fallback. Without those three this pattern hangs your request thread.']
 ],
 qa:[
  ['volatile vs synchronized','volatile gives visibility and ordering, no atomicity. synchronized gives mutual exclusion plus visibility.','Is count++ safe on a volatile int? => no. It is read-modify-write, three operations. Use AtomicInteger.'],
  ['The happens-before relationship','The JMM rule that makes one thread writes visible to another: unlock before lock, volatile write before volatile read, thread start, thread join.','Why is double-checked locking broken without volatile? => the reference can be published before the constructor finishes, so another thread sees a partially built object.'],
  ['Thread pool sizing','CPU-bound is roughly cores + 1. IO-bound is roughly cores x (1 + waitTime/serviceTime).','What if the queue is unbounded and producers outpace consumers? => memory grows until OutOfMemoryError. Bound the queue and choose a rejection policy.'],
  ['ExecutorService shutdown','shutdown stops accepting and drains; shutdownNow interrupts; awaitTermination blocks for the drain.','Your application will not exit. Why? => non-daemon pool threads still alive because nothing called shutdown.'],
  ['ConcurrentHashMap','Locks at the bin level using CAS plus synchronized on the bin head, not the whole map.','Is if (map.get(k) == null) map.put(k, v) safe? => no, it is check-then-act. Use computeIfAbsent or putIfAbsent.'],
  ['computeIfAbsent pitfall','Atomic per key, but the mapping function must not modify the same map.','What happens if it does? => in Java 9+ a ConcurrentModificationException; before that, a corrupted map or an infinite loop.'],
  ['CompletableFuture composition','thenApply transforms; thenCompose flattens a nested future; thenCombine joins two.','Which executor runs your callback if you do not pass one? => the one that completed the previous stage, or the common ForkJoinPool. Always pass your own for IO.'],
  ['Deadlock','Four Coffman conditions: mutual exclusion, hold and wait, no pre-emption, circular wait. Break any one.','How do you detect one in production? => a thread dump shows "Found one Java-level deadlock" explicitly.'],
  ['Livelock and starvation','Threads keep responding to each other and make no progress; or a thread never gets scheduled.','How is livelock different from deadlock? => the threads are running, which makes it harder to spot.'],
  ['Optimistic vs pessimistic locking','Compare-and-set or a version column, versus holding a lock.','Which for a high-contention seat booking, and why? => pessimistic, or an atomic conditional update. Optimistic retries thrash under contention.'],
  ['ThreadLocal','Per-thread storage. Must be removed in a pooled thread.','What leaks if you do not? => the value stays bound to the pooled thread and is visible to the next unrelated request. A correctness bug as well as a leak.'],
  ['Atomics and LongAdder','AtomicInteger is a CAS loop. LongAdder spreads across cells and sums on read.','When does LongAdder beat AtomicLong? => high write contention with infrequent reads, like a metrics counter.'],
  ['Producer-consumer','BlockingQueue with bounded capacity gives you backpressure for free.','Bounded or unbounded, and what breaks with each? => unbounded risks OOM; bounded blocks the producer, which is usually what you want.'],
  ['synchronized method vs block','Method locks this (or the class for static); a block locks whatever monitor you name.','Can two synchronized methods on the same object run concurrently? => no, they share the same monitor.'],
  ['Virtual threads (Java 21)','Cheap, blocking-friendly, scheduled on carrier threads.','What is pinning? => a virtual thread inside a synchronized block cannot unmount, so it holds the carrier. Use ReentrantLock instead.'],
  ['Immutability as a concurrency strategy','No shared mutable state means no synchronisation needed.','What is the cheapest way to make a class thread-safe? => make it immutable. Say this before reaching for locks.']
 ],
 traps:[
  'Unbounded queues in thread pools. The classic production OutOfMemoryError.',
  'ThreadLocal not removed in a pooled thread - leaks data across requests.',
  'Using the common ForkJoinPool for blocking IO.',
  'Assuming synchronized collections are enough for compound operations. Collections.synchronizedList still needs external locking for check-then-act.'
 ]},

{id:'spring', n:4, name:'Spring core & DI', phase:1, hrs:9,
 asked:[
  'How does dependency injection actually work in Spring?',
  'Why does @Transactional not work when I call the method from the same class?',
  'Explain the bean lifecycle.',
  'Constructor or field injection, and why?'
 ],
 code:[
  ['Constructor injection, the way it should be written',
   ['@Service',
    'public class OrderService {',
    '    private final OrderRepository repo;',
    '    private final PaymentClient payments;',
    '',
    '    // no @Autowired needed since Spring 4.3 for a single constructor',
    '    public OrderService(OrderRepository repo, PaymentClient payments) {',
    '        this.repo = repo;',
    '        this.payments = payments;',
    '    }',
    '}'],
   'Final fields, immutable, trivially unit-testable with new OrderService(mock, mock), and circular dependencies fail loudly at startup instead of silently at runtime.'],
  ['The self-invocation trap and three fixes',
   ['@Service',
    'public class OrderService {',
    '',
    '    public void placeAll(List<Order> orders) {',
    '        orders.forEach(this::place);   // BUG: bypasses the proxy, NO transaction',
    '    }',
    '',
    '    @Transactional',
    '    public void place(Order o) { ... }',
    '}',
    '',
    '// FIX 1 - inject self (Spring resolves the proxy)',
    '@Autowired @Lazy private OrderService self;',
    'orders.forEach(self::place);',
    '',
    '// FIX 2 - move the transactional method to another bean (preferred)',
    '',
    '// FIX 3 - programmatic',
    'transactionTemplate.executeWithoutResult(status -> place(o));'],
   'THE most-asked Spring question. AOP works through a proxy; this.method() never touches it. Fix 2 is the one to name first because it fixes the design, not just the symptom.'],
  ['Transaction propagation that actually matters',
   ['@Transactional                                     // joins the caller transaction',
    'public void placeOrder(Order o) {',
    '    repo.save(o);',
    '    audit.record(o);      // REQUIRES_NEW - commits even if placeOrder rolls back',
    '}',
    '',
    '@Transactional(propagation = Propagation.REQUIRES_NEW)',
    'public void record(Order o) { auditRepo.save(new AuditEntry(o)); }'],
   'REQUIRES_NEW suspends the outer transaction and starts its own on a separate connection. Audit logging is the canonical legitimate use. It also means you now hold two connections, which is how pools get exhausted.']
 ],
 qa:[
  ['Inversion of control','The container owns construction and wiring; your class declares what it needs.','Constructor or field injection? => constructor: immutability, testability without reflection, and fail-fast on cycles.'],
  ['Bean scopes','singleton (default, one per context), prototype (new each injection), request, session.','A singleton bean holding mutable state - what happens? => shared across every request thread. Either make it stateless or synchronise.'],
  ['Bean lifecycle','instantiate, populate dependencies, *Aware callbacks, BeanPostProcessor before, @PostConstruct, BeanPostProcessor after, ready, @PreDestroy.','Where would you hook to modify every bean of a type? => a BeanPostProcessor. That is also how @Transactional and @Async wrap your beans.'],
  ['@Component vs @Bean','Class-level, found by component scan, versus a factory method inside @Configuration.','How do you register a bean from a third-party library you cannot annotate? => @Bean in a @Configuration class.'],
  ['AOP and proxies','JDK dynamic proxy when the bean implements an interface, CGLIB subclass otherwise. Advice wraps the join point.','Why does the aspect not fire on a private method or a self-invocation? => the call never leaves the object, so the proxy is not involved.'],
  ['@Transactional self-invocation','this.method() bypasses the proxy, so no transaction, no retry, no cache.','How do you fix it? => move the method to another bean (best), self-inject with @Lazy, or use TransactionTemplate.'],
  ['Propagation','REQUIRED joins or creates; REQUIRES_NEW suspends and starts a new one; NESTED uses a savepoint; MANDATORY throws if none exists.','The outer transaction rolls back - does the REQUIRES_NEW inner also roll back? => no, it already committed independently.'],
  ['Rollback rules','Rolls back on RuntimeException and Error by default; checked exceptions need rollbackFor.','You caught the exception inside the method - does it still roll back? => no. The proxy never sees it. This silently loses data.'],
  ['Isolation','READ_COMMITTED is the Postgres default; REPEATABLE_READ prevents non-repeatable reads; SERIALIZABLE prevents phantoms.','Give a concrete anomaly each level allows.'],
  ['readOnly = true','A hint: Hibernate skips dirty checking and the driver may route to a replica.','Does it prevent writes? => not reliably. It is an optimisation, not a guarantee.'],
  ['Circular dependencies','Constructor cycles fail at startup; setter or @Lazy can break them.','Why is failing the RIGHT behaviour? => a cycle is a design smell. Spring Boot 2.6+ disallows it by default.'],
  ['@Qualifier and @Primary','Disambiguate when several beans satisfy one type.','Two implementations of an interface and no qualifier - what happens? => NoUniqueBeanDefinitionException at startup.'],
  ['@Profile and conditional beans','Register beans only under a profile or a condition.','How do you swap a real client for a stub in tests? => a @Profile("test") bean, or @TestConfiguration.'],
  ['Spring MVC request flow','DispatcherServlet, HandlerMapping, HandlerAdapter, your controller, then a message converter or view resolver.','Where does @ControllerAdvice fit? => it wraps handler invocation to translate exceptions into responses centrally.'],
  ['@ControllerAdvice','Centralised exception handling and response shaping.','Why is it better than try/catch in every controller? => one error contract, no duplication, and it also catches exceptions from validation and converters.']
 ],
 traps:[
  'Self-invocation silently disabling @Transactional, @Async, @Cacheable and @Retryable.',
  'Catching an exception inside a transactional method and expecting a rollback.',
  'Field injection, which hides cycles and makes unit tests need a Spring context.',
  'Mutable state in a singleton bean.'
 ]},

{id:'boot', n:5, name:'Spring Boot & configuration', phase:1, hrs:5,
 asked:[
  'How does auto-configuration decide what to configure?',
  'How do you override an auto-configured bean?',
  'How do you inject secrets without putting them in the image?',
  'What does Actuator expose, and what must never be public?'
 ],
 code:[
  ['Typed configuration with validation',
   ['@ConfigurationProperties(prefix = "payments")',
    '@Validated',
    'public record PaymentProps(',
    '        @NotBlank String apiUrl,',
    '        @Positive int timeoutMs,',
    '        @DefaultValue("3") int maxRetries) {}',
    '',
    '// application.yml',
    '// payments:',
    '//   api-url: https://...',
    '//   timeout-ms: 2000'],
   'Typed, validated at startup, and a bad config fails the deploy instead of failing the first request at 3am. Far better than scattering @Value strings.'],
  ['Health checks mapped to Kubernetes probes',
   ['management:',
    '  endpoint:',
    '    health:',
    '      probes:',
    '        enabled: true          # exposes /health/liveness and /health/readiness',
    '  endpoints:',
    '    web:',
    '      exposure:',
    '        include: health,info,prometheus     # NOT env, NOT heapdump',
    '',
    'server:',
    '  shutdown: graceful           # drain in-flight requests',
    'spring:',
    '  lifecycle:',
    '    timeout-per-shutdown-phase: 25s'],
   'Liveness must not check downstreams or a slow database takes your pods down in a restart loop. Readiness should. Graceful shutdown plus a preStop hook is what actually gives zero-downtime rollouts.']
 ],
 qa:[
  ['Auto-configuration','@EnableAutoConfiguration loads candidates from AutoConfiguration.imports, each guarded by @ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty.','How do you stop one applying? => exclude it, or simply define your own bean, since most are @ConditionalOnMissingBean.'],
  ['Debugging auto-configuration','Run with --debug for the condition evaluation report showing what matched and what did not.','A bean you expected is missing. What is your first move? => read that report before changing any code.'],
  ['Starters','Curated transitive dependency sets. No code of their own.','What is actually in spring-boot-starter-web? => Spring MVC, Jackson, validation, and embedded Tomcat.'],
  ['Config precedence','Command line, then OS env, then application-{profile}.yml, then application.yml, then defaults.','How do you inject a secret without baking it into the image? => environment variable from a Kubernetes Secret, or a mounted file, never the jar.'],
  ['Profiles','@Profile on beans, spring.profiles.active to select.','How do your Kubernetes manifests set it? => SPRING_PROFILES_ACTIVE as an env var. Relaxed binding maps it automatically.'],
  ['Relaxed binding','api-url, api_url, API_URL and apiUrl all bind to the same property.','Why does that matter in containers? => environment variables cannot contain dots or dashes.'],
  ['Actuator','/health, /info, /metrics, /prometheus, /env, /threaddump, /heapdump.','Which must never be public? => env, heapdump and threaddump leak secrets and internals. Bind Actuator to a separate management port.'],
  ['Liveness vs readiness in Boot','Health groups map to the two Kubernetes probes.','What must liveness NOT check? => downstream dependencies. A slow database would restart every pod at once.'],
  ['Embedded server and thread model','Tomcat by default, thread per request, default 200 threads.','How many concurrent requests can it handle, and what do you tune? => server.tomcat.threads.max, and remember every thread also holds a DB connection under load.'],
  ['WebFlux vs MVC','Event loop and backpressure versus thread per request.','When is WebFlux the wrong choice? => any blocking JDBC in the chain. One blocking call poisons the event loop.'],
  ['Graceful shutdown','Stop accepting, drain in-flight, then exit.','How does that interact with a rolling update? => needs a preStop sleep so the Service stops routing before the process starts draining, plus a long enough terminationGracePeriodSeconds.'],
  ['@SpringBootTest vs slices','Full context versus @WebMvcTest or @DataJpaTest.','Why prefer a slice? => seconds instead of minutes, and a failure points at one layer.']
 ],
 traps:[
  'Exposing all Actuator endpoints. management.endpoints.web.exposure.include=* in production is a real breach.',
  'Liveness probes that call the database.',
  'Secrets in application.yml committed to git.',
  'No graceful shutdown, so every deploy drops in-flight requests.'
 ]}

];

PLAN.tech = PLAN.tech.concat([

{id:'events', n:6, name:'Spring event-driven & async', phase:1, hrs:9,
 note:'YOUR DAILY WORK. You build custom event-driven components in Spring Boot, so expect an interviewer to pull hard on this thread. It is also the bridge to the Kafka module: the same problems, solved in-process first.',
 asked:[
  'You said your components are event-driven. Show me how that works.',
  'How do you publish an event only after the transaction commits?',
  'What happens to an exception thrown inside an @Async method?',
  'When would you move from Spring events to Kafka?'
 ],
 code:[
  ['Publishing and handling an in-process event',
   ['// 1. the event - a record, immutable, past tense name',
    'public record OrderPlaced(String orderId, BigDecimal amount, Instant at) {}',
    '',
    '// 2. publish',
    '@Service',
    '@RequiredArgsConstructor',
    'public class OrderService {',
    '    private final ApplicationEventPublisher events;',
    '',
    '    @Transactional',
    '    public void place(Order order) {',
    '        repo.save(order);',
    '        events.publishEvent(new OrderPlaced(order.getId(), order.getAmount(), Instant.now()));',
    '    }',
    '}',
    '',
    '// 3. handle',
    '@Component',
    'public class InvoiceListener {',
    '    @EventListener',
    '    public void on(OrderPlaced e) { invoices.create(e.orderId()); }',
    '}'],
   'By default @EventListener is SYNCHRONOUS and runs in the publisher thread, inside the same transaction. That surprises people: publishEvent is a method call, not a queue.'],
  ['@TransactionalEventListener - the one that matters',
   ['@Component',
    'public class EmailListener {',
    '',
    '    // runs ONLY after the transaction commits successfully',
    '    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)',
    '    public void on(OrderPlaced e) {',
    '        mailer.sendConfirmation(e.orderId());',
    '    }',
    '',
    '    // and the compensating side',
    '    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)',
    '    public void onFailure(OrderPlaced e) {',
    '        metrics.increment("order.failed");',
    '    }',
    '}'],
   'Without AFTER_COMMIT you email the customer, then the transaction rolls back, and you have confirmed an order that does not exist. This is the single most valuable annotation in the module. Note the trap: a plain @Transactional handler at AFTER_COMMIT will NOT persist, because the transaction is already finished - you need REQUIRES_NEW.'],
  ['Async handling with a real executor',
   ['@Configuration',
    '@EnableAsync',
    'public class AsyncConfig implements AsyncConfigurer {',
    '',
    '    @Override public Executor getAsyncExecutor() { return taskExecutor(); }',
    '',
    '    // exceptions in void @Async methods are otherwise SILENTLY SWALLOWED',
    '    @Override public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {',
    '        return (ex, method, params) ->',
    '            log.error("async failure in {}", method.getName(), ex);',
    '    }',
    '}',
    '',
    '@Component',
    'public class ReportListener {',
    '    @Async("taskExecutor")',
    '    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)',
    '    public void on(OrderPlaced e) { reports.rebuild(e.orderId()); }',
    '}'],
   'Three things candidates miss: @Async needs @EnableAsync; a void @Async method swallows exceptions unless you register the handler; and the async thread has NO transaction, NO security context and NO MDC unless you propagate them.'],
  ['The outbox - when losing an event is not acceptable',
   ['@Transactional',
    'public void place(Order order) {',
    '    repo.save(order);',
    '    outbox.save(new OutboxEvent("OrderPlaced", toJson(order)));  // SAME transaction',
    '}',
    '',
    '@Scheduled(fixedDelay = 1000)',
    '@Transactional',
    'public void relay() {',
    '    for (OutboxEvent e : outbox.findUnpublished(100)) {',
    '        broker.publish(e.type(), e.payload());   // at-least-once',
    '        e.markPublished();',
    '    }',
    '}'],
   'In-process events die with the JVM. If the process crashes between commit and handler, the event is gone forever and nothing will ever retry it. The outbox makes the event as durable as the row. This is the answer to "what happens if the service crashes mid-handler".']
 ],
 qa:[
  ['How does publishEvent actually work?','ApplicationEventMulticaster looks up listeners by event type and invokes them. By default synchronously, on the caller thread, inside the caller transaction.','So is it a queue? => no. It is an in-process observer pattern. Nothing is persisted and nothing is retried.'],
  ['@EventListener vs @TransactionalEventListener','The first fires when publishEvent is called; the second binds to a transaction phase.','You email the customer from a plain @EventListener and the transaction then rolls back. What did the customer get? => a confirmation for an order that does not exist.'],
  ['The transaction phases','BEFORE_COMMIT, AFTER_COMMIT (default), AFTER_ROLLBACK, AFTER_COMPLETION.','Your AFTER_COMMIT handler writes to the database and nothing is saved. Why? => the transaction is already committed, so there is no active one. Use @Transactional(propagation = REQUIRES_NEW).'],
  ['@Async requirements','@EnableAsync plus a proxied call from another bean.','Why does calling an @Async method from within the same class run synchronously? => self-invocation. Same proxy problem as @Transactional.'],
  ['@Async exception handling','A method returning void swallows exceptions unless you register an AsyncUncaughtExceptionHandler. A method returning CompletableFuture surfaces them on join.','Which return type should you prefer, and why? => CompletableFuture, so failures are visible to the caller.'],
  ['Context propagation','The async thread has no transaction, no SecurityContext and no MDC by default.','How does your correlation id survive the hop? => a TaskDecorator that copies the MDC onto the worker thread. Without it your logs lose the trace id at the async boundary.'],
  ['Ordering listeners','@Order or Ordered on the listener.','Should you rely on listener ordering? => no. Order-dependent handlers mean the events are really a workflow, and should be modelled as one.'],
  ['Conditional listeners','@EventListener(condition = "#e.amount > 1000") using SpEL.','Why is that risky? => the logic is in a string, unchecked by the compiler and invisible to refactoring.'],
  ['Failure inside a synchronous listener','It propagates to the publisher and rolls back the transaction.','Is that good or bad? => it depends. A failing email should not roll back an order. That is the argument for AFTER_COMMIT plus async.'],
  ['What happens if the JVM dies mid-handler?','The event is lost. There is no persistence and no redelivery.','So how do you make it durable? => the outbox pattern, or a real broker. This is exactly the gap Kafka fills.'],
  ['Spring events vs Kafka','In-process, synchronous by default, no durability, single JVM. Kafka is durable, replayable, cross-process, with consumer groups and per-key ordering.','When do you move? => when another service needs the event, when you need replay, or when losing an event is unacceptable.'],
  ['@Scheduled in a multi-instance deployment','Every instance runs it. Three pods means three executions.','How do you fix it? => a distributed lock such as ShedLock, or move the job to a single leader.'],
  ['Backpressure in an async pipeline','A bounded queue plus CallerRunsPolicy pushes back onto the producer.','What does an unbounded queue give you? => the appearance of working, until an OutOfMemoryError.'],
  ['Testing event-driven code','ApplicationEvents in @RecordApplicationEvents, or a test listener capturing published events.','How do you test an AFTER_COMMIT listener? => it will not fire in a rolled-back test transaction. Use @Commit or TestTransaction, otherwise the test silently passes without ever running the handler.'],
  ['Event naming and payload','Past tense, immutable, carry ids rather than whole entities.','Why not put the JPA entity in the event? => it may be detached or lazily initialised by the time the handler runs, and it couples the consumer to your schema.']
 ],
 traps:[
  'Assuming @EventListener is asynchronous. It is not.',
  'Sending email or calling an external system from a plain @EventListener inside a transaction.',
  'A void @Async method with no exception handler - failures vanish silently.',
  'Publishing a JPA entity as the event payload, then hitting LazyInitializationException in the handler.',
  '@Scheduled running on every pod because nobody added a lock.'
 ]},

{id:'jpa', n:7, name:'JPA & Hibernate', phase:1, hrs:11,
 note:'The single richest source of "how does this actually work" questions at tier 1, because everyone claims it on a CV and few can explain the persistence context.',
 asked:[
  'What is the persistence context, and when does it flush?',
  'What is the N+1 problem and how do you detect it?',
  'You changed a field and never called save. Was it persisted?',
  'When does LazyInitializationException happen, and what is the right fix?'
 ],
 code:[
  ['The N+1 problem and three fixes',
   ['// N+1: one query for orders, then one per order for items',
    'List<Order> orders = orderRepo.findAll();',
    'orders.forEach(o -> o.getItems().size());     // N extra queries',
    '',
    '// FIX 1 - JOIN FETCH (best for a bounded result set)',
    '@Query("select distinct o from Order o join fetch o.items where o.status = :s")',
    'List<Order> findWithItems(@Param("s") Status s);',
    '',
    '// FIX 2 - entity graph, declarative',
    '@EntityGraph(attributePaths = "items")',
    'List<Order> findByStatus(Status status);',
    '',
    '// FIX 3 - batch fetching, best when combined with pagination',
    '@BatchSize(size = 50)   // on the collection',
    'private List<OrderItem> items;'],
   'Know all three and when each applies. JOIN FETCH plus pagination is a trap: Hibernate cannot paginate a fetched collection in SQL, so it silently loads everything into memory and pages in Java. @BatchSize is the correct answer there.'],
  ['Dirty checking - the thing that surprises people',
   ['@Transactional',
    'public void rename(Long id, String name) {',
    '    Order order = repo.findById(id).orElseThrow();',
    '    order.setName(name);',
    '    // no save() call - and it is still persisted',
    '}'],
   'Inside a transaction the entity is MANAGED. At commit, Hibernate compares it against the snapshot taken at load and issues an UPDATE. This is why an accidental setter inside a transaction writes to the database.'],
  ['Optimistic locking',
   ['@Entity',
    'public class Order {',
    '    @Id private Long id;',
    '    @Version private Long version;      // Hibernate manages this',
    '}',
    '',
    '// UPDATE orders SET ..., version = 3 WHERE id = ? AND version = 2',
    '// zero rows affected -> OptimisticLockException',
    '',
    '@Retryable(retryFor = OptimisticLockingFailureException.class, maxAttempts = 3)',
    '@Transactional',
    'public void applyDiscount(Long id, BigDecimal pct) { ... }'],
   'The version column turns a lost update into a detectable failure. Pair it with a retry, because the whole point is that a conflict is expected and recoverable.']
 ],
 qa:[
  ['The persistence context','A first-level cache and unit of work, scoped to the transaction. Entities inside it are managed.','Two findById calls for the same id in one transaction - how many queries? => one. The second is served from the persistence context.'],
  ['Entity states','Transient, managed, detached, removed.','What is a detached entity, and what breaks with one? => loaded in a transaction that has ended. Lazy fields throw, and save() will merge rather than update.'],
  ['Dirty checking','At flush, Hibernate diffs each managed entity against its load-time snapshot and generates UPDATEs.','You changed a field and never called save. Persisted? => yes, if inside a transaction. This is the most surprising JPA behaviour for newcomers.'],
  ['When does flush happen?','Before a query that might read affected tables, and at commit. FlushMode.AUTO by default.','Why might your INSERT appear earlier than you expected? => a query triggered an automatic flush.'],
  ['save vs saveAndFlush','save schedules; saveAndFlush forces SQL immediately.','When do you actually need saveAndFlush? => rarely. Usually when you need a generated id or a constraint violation before the transaction ends.'],
  ['The N+1 problem','One query for parents, then one per parent for the association.','How do you DETECT it? => enable hibernate statistics or datasource-proxy, or count queries in an integration test. Do not rely on spotting it in code review.'],
  ['LazyInitializationException','Touching a lazy association after the persistence context has closed.','What is the RIGHT fix? => fetch what you need inside the transaction with JOIN FETCH or an entity graph, or map to a DTO. Not open-in-view.'],
  ['open-in-view','Spring Boot keeps the persistence context open for the whole request. On by default.','Why is it harmful? => it holds a database connection for the entire request including view rendering, hides N+1 behind lazy loads, and exhausts the pool under load. Set spring.jpa.open-in-view=false and fix what breaks.'],
  ['FetchType.LAZY vs EAGER','Lazy by default for collections, eager for @ManyToOne and @OneToOne.','Why is eager on @ManyToOne a problem? => every load drags in the parent graph, and two eager collections produce a cartesian product.'],
  ['Cascade types','PERSIST, MERGE, REMOVE, ALL, plus orphanRemoval.','Why is CascadeType.ALL on @ManyToOne dangerous? => removing a child can delete the shared parent.'],
  ['orphanRemoval vs CascadeType.REMOVE','Orphan removal deletes a child removed from the collection; cascade remove deletes children when the parent is deleted.','Which one deletes on collection.remove(child)? => orphanRemoval.'],
  ['@OneToMany owning side','The side with the foreign key owns the relationship; use mappedBy on the inverse side.','You added to the collection and nothing persisted. Why? => you updated the inverse side only. Set both directions, or make the child set the parent.'],
  ['Optimistic locking with @Version','Version compared in the WHERE clause; zero rows affected means a conflict.','Two users edit the same row - walk me through it. => both read version 2, first commits and bumps to 3, second updates WHERE version = 2, affects zero rows, gets OptimisticLockException, retries.'],
  ['Pessimistic locking','@Lock(LockModeType.PESSIMISTIC_WRITE) issues SELECT FOR UPDATE.','When over optimistic? => high contention, where retrying would thrash.'],
  ['Entity equals/hashCode','Generated ids are null before persist, so identity changes after save.','Why does using the id in hashCode break a HashSet? => the object was added while transient with a null id, then the id changed. Use a natural key or a UUID assigned in the constructor.'],
  ['DTO projections','Select only the fields you need, via a constructor expression or an interface projection.','Why prefer this for read paths? => no persistence context overhead, no lazy loading surprises, and far less data over the wire.'],
  ['Second-level cache','Shared across transactions, opt-in per entity, needs a provider.','When is it a bad idea? => write-heavy entities, or a clustered deployment where invalidation is now a distributed problem.'],
  ['@Transactional(readOnly = true)','Skips dirty-check snapshots and may route to a replica.','Is it enforced? => no. It is an optimisation hint, not a guarantee.'],
  ['Spring Data derived queries','Method names parsed into queries: findByStatusAndCreatedAtAfter.','When do you stop using them? => once the name gets unreadable. Switch to @Query or a Specification.']
 ],
 traps:[
  'open-in-view left on, hiding N+1 and holding connections for the whole request.',
  'JOIN FETCH combined with pagination - silently loads everything into memory.',
  'Bidirectional relationship updated on one side only.',
  'Entity id used in hashCode before it is generated.',
  'CascadeType.ALL applied without thinking about deletes.'
 ]},

{id:'pg', n:8, name:'PostgreSQL', phase:1, hrs:9,
 note:'You are in DBeaver against upstream data daily, so this is claimed expertise and interviewers will test it.',
 asked:[
  'Read me this EXPLAIN plan.',
  'This query got slow after the table grew. Diagnose it.',
  'Why is your index not being used?',
  'Give me a lost update at READ COMMITTED.'
 ],
 code:[
  ['Reading a plan and fixing the index',
   ['EXPLAIN (ANALYZE, BUFFERS)',
    'SELECT * FROM orders WHERE status = \'PENDING\' AND created_at > now() - interval \'7 days\';',
    '',
    '-- Seq Scan on orders  (cost=0.00..18234 rows=100 width=64)',
    '--   (actual time=812ms rows=94512 loops=1)      <-- estimate 100, actual 94512',
    '',
    '-- equality column FIRST, range column SECOND',
    'CREATE INDEX CONCURRENTLY idx_orders_status_created',
    '    ON orders (status, created_at);',
    '',
    'ANALYZE orders;   -- refresh the statistics the planner uses'],
   'A large gap between estimated and actual rows means stale statistics, not a missing index. CONCURRENTLY avoids taking an exclusive lock on a live table - forgetting it is how people cause an outage.'],
  ['Queue in a table, done correctly',
   ['SELECT * FROM jobs',
    ' WHERE status = \'READY\'',
    ' ORDER BY created_at',
    ' LIMIT 10',
    '   FOR UPDATE SKIP LOCKED;'],
   'SKIP LOCKED lets N workers pull disjoint batches without blocking each other. Without it every worker queues behind the first, and your throughput is one worker regardless of how many you deploy.'],
  ['Zero-downtime column change',
   ['-- expand',
    'ALTER TABLE orders ADD COLUMN total_cents BIGINT;          -- nullable, instant',
    '-- migrate: backfill in batches, never one statement',
    'UPDATE orders SET total_cents = (total * 100)::bigint',
    ' WHERE id BETWEEN ? AND ? AND total_cents IS NULL;',
    '-- dual-write from the app, switch reads, then',
    '-- contract',
    'ALTER TABLE orders DROP COLUMN total;'],
   'Expand-migrate-contract. A single blocking ALTER on a 500M-row table takes an exclusive lock and stops the application. This is also why you cannot roll back a deploy that dropped a column.']
 ],
 qa:[
  ['B-tree index','Sorted and balanced. Supports equality, ranges, ordering, and the leftmost prefix of a composite.','Why does index column order matter? => leftmost-prefix. An index on (a,b) serves a and a+b, never b alone.'],
  ['Composite index design','Equality columns first, then the range column.','You have (status, created_at). Does a query on created_at alone use it? => not as a normal index scan.'],
  ['Covering / index-only scan','All required columns are in the index and the page is visible in the visibility map.','Why does VACUUM matter for index-only scans? => a stale visibility map forces a heap fetch and you lose the benefit.'],
  ['EXPLAIN ANALYZE','Actually runs the query. Compare estimated versus actual rows, and look at the node types.','Estimate says 10, actual is 94,512. What do you do? => ANALYZE, raise the statistics target, or rewrite a predicate the planner cannot estimate.'],
  ['When a sequential scan is correct','Low selectivity or a small table. Reading 40% of rows via an index is slower than a scan.','So why is an index sometimes slower? => random heap access plus index traversal beats a sequential read only when few rows match.'],
  ['MVCC','Every write creates a new row version; readers never block writers and writers never block readers.','Where do dead tuples go? => VACUUM reclaims them. If it cannot keep up you get bloat and the table grows without more data.'],
  ['Isolation levels','READ COMMITTED is the default; REPEATABLE READ gives a stable snapshot; SERIALIZABLE uses SSI and can abort transactions.','Give me a lost update at READ COMMITTED. => two transactions read balance 100, both compute 90, both write. One update is silently gone. Fix with an atomic UPDATE, SELECT FOR UPDATE, or a version column.'],
  ['SELECT FOR UPDATE','Row-level pessimistic lock held until the transaction ends.','What is SKIP LOCKED for? => queue workers pulling disjoint batches without blocking each other.'],
  ['Deadlocks','Two transactions acquiring the same rows in opposite order. Postgres detects and kills one.','How do you find and fix them? => the server log names both statements. Fix by ordering access consistently and shortening transactions.'],
  ['Connection pooling','HikariCP. Pool size around cores x 2, not hundreds.','The pool exhausted. Diagnose. => long transactions, leaked connections, N+1, open-in-view, or missing statement timeouts. A bigger pool usually makes it worse.'],
  ['Partial and expression indexes','CREATE INDEX ... WHERE status = \'ACTIVE\', or on lower(email).','Why does an index on email not help WHERE lower(email) = ? => the expression does not match the index. Index the expression.'],
  ['JSONB','Flexible documents with GIN indexing.','When does it become a mistake? => when you start querying and joining inside it. That is a schema asking to exist.'],
  ['Partitioning','Splitting one table by range or list within one database.','How is it different from sharding? => partitioning is one machine; sharding is many. Partitioning helps pruning and bulk deletes.'],
  ['CTEs and materialisation','Since Postgres 12 CTEs inline by default; MATERIALIZED forces the old behaviour.','Why did an old CTE query suddenly get faster on upgrade? => it stopped being an optimisation fence.'],
  ['Transaction length','Long transactions block VACUUM and hold connections.','Why is a transaction spanning an HTTP call to a third party a bug? => you hold a database connection and an MVCC snapshot for the duration of someone else network.'],
  ['UPSERT','INSERT ... ON CONFLICT (key) DO UPDATE.','Why is that better than check-then-insert? => check-then-insert is a race. ON CONFLICT is atomic.']
 ],
 traps:[
  'Building an index without CONCURRENTLY on a live table.',
  'Wrapping a column in a function and losing the index.',
  'A blocking ALTER TABLE on a large table during business hours.',
  'Assuming a bigger connection pool fixes exhaustion.',
  'Long transactions that hold snapshots and block VACUUM.'
 ]},

{id:'api', n:9, name:'REST, API design & auth', phase:2, hrs:7,
 asked:[
  'Design the API for this feature.',
  'Make this POST endpoint idempotent.',
  'How do you revoke a JWT?',
  'Your client retried and the customer was charged twice. Fix it.'
 ],
 code:[
  ['Idempotent POST',
   ['@PostMapping("/payments")',
    'public ResponseEntity<PaymentResponse> pay(',
    '        @RequestHeader("Idempotency-Key") String key,',
    '        @Valid @RequestBody PaymentRequest req) {',
    '',
    '    return idempotency.findByKey(key)',
    '        .map(prev -> ResponseEntity.ok(prev.response()))     // replay the stored result',
    '        .orElseGet(() -> {',
    '            PaymentResponse res = payments.charge(req);',
    '            idempotency.save(key, res);   // UNIQUE constraint on key',
    '            return ResponseEntity.status(CREATED).body(res);',
    '        });',
    '}'],
   'The unique constraint is what makes this correct under CONCURRENT retries - two simultaneous requests race, one insert wins, the other gets a constraint violation and can then read the winner result. A plain if-absent check is a race.'],
  ['Consistent error responses',
   ['@RestControllerAdvice',
    'public class ApiExceptionHandler {',
    '',
    '    @ExceptionHandler(MethodArgumentNotValidException.class)',
    '    ProblemDetail onValidation(MethodArgumentNotValidException ex) {',
    '        ProblemDetail pd = ProblemDetail.forStatus(BAD_REQUEST);',
    '        pd.setTitle("Validation failed");',
    '        pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()',
    '                .collect(toMap(FieldError::getField, FieldError::getDefaultMessage)));',
    '        return pd;',
    '    }',
    '',
    '    @ExceptionHandler(OptimisticLockingFailureException.class)',
    '    ProblemDetail onConflict(Exception ex) {',
    '        return ProblemDetail.forStatusAndDetail(CONFLICT, "Resource was modified, retry");',
    '    }',
    '}'],
   'One error contract for the whole API. ProblemDetail (RFC 7807) is built into Spring 6 and is the answer if asked how you standardise errors.'],
  ['Cursor pagination',
   ['// offset: drifts when rows are inserted, and gets slower page by page',
    'GET /orders?page=5000&size=20',
    '',
    '// cursor: stable and O(log n) regardless of depth',
    'GET /orders?after=2026-08-27T10:00:00Z_01H9X&size=20',
    '',
    'SELECT * FROM orders',
    ' WHERE (created_at, id) < (:afterTs, :afterId)   -- tuple comparison',
    ' ORDER BY created_at DESC, id DESC',
    ' LIMIT 20;'],
   'Offset 100,000 makes the database count and discard 100,000 rows. The tuple comparison with a tiebreaker id is what makes the cursor deterministic.']
 ],
 qa:[
  ['Idempotency','The same request applied twice has the same effect as once. PUT and DELETE yes by definition, POST no.','How do you make POST idempotent? => a client-supplied Idempotency-Key with a unique constraint and a stored response, with a TTL.'],
  ['Status codes','201 with Location, 202 for accepted-async, 400 malformed, 422 semantically invalid, 409 conflict, 429 rate limited.','What do you return when processing is asynchronous? => 202 plus a status URL the client can poll.'],
  ['Pagination','Offset is simple but drifts and degrades; cursor is stable and fast.','Page 10,000 with offset - what is wrong? => the database materialises and discards everything before it.'],
  ['Versioning','URL path, custom header, or content negotiation.','How do you retire v1? => announce, measure usage per client, deprecation headers, then sunset. The hard part is organisational.'],
  ['PUT vs PATCH','Full replacement versus partial update.','Why is PATCH harder to get right? => merge semantics, null meaning "clear" versus "unchanged", and it is not naturally idempotent.'],
  ['OAuth2 flows','Authorization code with PKCE for user-facing apps; client credentials for service-to-service.','Why is the implicit flow deprecated? => the token is exposed in the URL fragment and there is no client authentication.'],
  ['JWT structure','header.payload.signature, base64url. Signed, not encrypted - anyone can read the payload.','So what must never go in a JWT? => anything secret. It is readable by the client.'],
  ['JWT revocation','You cannot revoke a stateless token before it expires.','So how do you handle logout? => short-lived access tokens plus a refresh token you can revoke, and a denylist of token ids for emergencies.'],
  ['Access vs refresh tokens','Short-lived credential versus long-lived means to obtain a new one.','Where do you store them in a browser? => refresh token in an httpOnly SameSite cookie; keeping either in localStorage exposes it to XSS.'],
  ['CORS','Browser-enforced preflight based on origin.','Does it protect your API? => no. It restricts browsers only. curl ignores it entirely.'],
  ['Rate limiting placement','At the gateway, before your service does work.','Per user or per IP? => both, at different tiers. Per IP alone punishes everyone behind a corporate NAT.'],
  ['Retries and backoff','Exponential with jitter, capped, only for idempotent operations.','What does retrying without jitter cause? => a thundering herd that keeps the downstream down.'],
  ['Timeouts','Every remote call needs one, and the budget must shrink down the chain.','Downstream p99 is 3s and your timeout is 5s. What happens under load? => your threads all block on the slow dependency and you fall over with it.'],
  ['Validation','Bean Validation annotations plus @Valid, handled centrally in @RestControllerAdvice.','Why validate in the DTO rather than the entity? => the API contract and the persistence model change for different reasons.'],
  ['API contract testing','OpenAPI spec generated or hand-written, plus contract tests.','How do you stop a breaking change reaching production? => compare the generated spec against the previous version in CI.']
 ],
 traps:[
  'A check-then-insert idempotency implementation, which races under concurrent retries.',
  'Returning 200 for everything, including errors.',
  'Leaking stack traces in error responses.',
  'Assuming CORS is a security control.',
  'No timeout on an outbound call.'
 ]}

]);

PLAN.tech = PLAN.tech.concat([

{id:'kafka', n:10, name:'Kafka', phase:2, hrs:13,
 note:'NEW KNOWLEDGE for you. Hands-on artefact required: Docker Compose with Kafka, a Spring Boot producer and consumer, a topic with 3 partitions, a consumer group of 2 - then KILL ONE CONSUMER and watch the rebalance, and REPLAY from an earlier offset. Reading about Kafka does not survive the follow-up column. Your custom Spring event components are the bridge: same problems, in-process.',
 asked:[
  'Where does Kafka actually guarantee ordering?',
  'Your consumer dies halfway through a batch. What happens?',
  'Kafka or RabbitMQ or SQS for this? Defend it.',
  'You built event-driven components yourself. Why not Kafka?'
 ],
 code:[
  ['Consumer with manual acknowledgement and a DLQ',
   ['@KafkaListener(topics = "orders", groupId = "invoicing",',
    '               containerFactory = "manualAckFactory")',
    'public void onOrder(ConsumerRecord<String, OrderEvent> rec, Acknowledgment ack) {',
    '    try {',
    '        // MUST be idempotent - at-least-once means this can run twice',
    '        invoices.createIfAbsent(rec.value().orderId(), rec.value());',
    '        ack.acknowledge();                 // commit only after success',
    '    } catch (TransientException e) {',
    '        throw e;                           // let the error handler retry',
    '    }',
    '}',
    '',
    '@Bean',
    'DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {',
    '    var recoverer = new DeadLetterPublishingRecoverer(template);   // -> orders.DLT',
    '    return new DefaultErrorHandler(recoverer,',
    '            new ExponentialBackOffWithMaxRetries(3));',
    '}'],
   'Commit AFTER processing, not before - that is the difference between at-least-once and at-most-once. The DLQ stops one poison message blocking the whole partition forever.'],
  ['Partition key controls ordering',
   ['// ordering is guaranteed PER PARTITION only',
    'kafkaTemplate.send("orders", order.customerId(), event);',
    '//                            ^^^^^^^^^^^^^^^^^ key -> partition',
    '',
    '// all events for one customer land on one partition, so they stay ordered',
    '// events for DIFFERENT customers may be processed out of order - usually fine'],
   'If you need per-entity ordering, the entity id is the key. And note the trap: adding partitions later changes the hash mapping, so existing keys move and ordering breaks across the boundary.'],
  ['Idempotent producer and transactions',
   ['spring:',
    '  kafka:',
    '    producer:',
    '      acks: all                        # wait for min.insync.replicas',
    '      enable-idempotence: true         # no duplicates on producer retry',
    '      transaction-id-prefix: tx-       # enables exactly-once within Kafka',
    '    consumer:',
    '      isolation-level: read_committed',
    '      enable-auto-commit: false        # you commit, not a timer',
    '      max-poll-records: 100'],
   'acks=all plus min.insync.replicas=2 is the durability setting for anything financial. Auto-commit is the default and it is wrong for almost everything - it commits on a timer regardless of whether you processed the record.']
 ],
 qa:[
  ['Topic, partition, offset','A topic is split into partitions; each partition is an ordered append-only log; consumers track an offset per partition.','Why partitions at all? => parallelism. Consumer parallelism is capped at the partition count.'],
  ['Ordering guarantee','Within a partition only. Never across a topic.','So how do you get per-user ordering? => partition key = user id. What breaks if you add partitions later? => the hash mapping changes and existing keys move.'],
  ['Consumer groups','Each partition is assigned to exactly one consumer within a group. Different groups each get everything.','3 partitions and 5 consumers in one group? => two sit idle. Adding consumers past the partition count buys nothing.'],
  ['Rebalancing','Any membership change reassigns partitions; processing pauses during it.','How do you avoid a rebalance storm? => raise max.poll.interval.ms if processing is slow, tune session timeout and heartbeats, and use the cooperative-sticky assignor.'],
  ['Consumer dies mid-batch','Offsets were not committed, so records are redelivered from the last commit.','So your consumer must be what? => idempotent. Say this before being asked.'],
  ['Delivery semantics','At-most-once commits first. At-least-once processes first - the default choice. Exactly-once needs the idempotent producer plus transactions.','Is exactly-once real? => within Kafka, yes. End to end, no - the moment you write to an external system you need idempotency there.'],
  ['auto-commit','Commits offsets on a timer whether or not you finished processing.','Why is enable.auto.commit=true dangerous? => a crash after the timer fires but before processing completes loses the record silently.'],
  ['Retention vs compaction','Retention deletes by time or size. Compaction keeps the latest value per key forever.','When do you compact? => changelog and state topics, where you want the current value of every key.'],
  ['Poison message','A record that always fails. Without handling it blocks its partition indefinitely.','Fix? => retry with backoff, then publish to a DLQ so the offset advances. Then a process to inspect and replay.'],
  ['Consumer lag','Log end offset minus committed offset.','Lag is growing. Name four causes. => slow processing, too few partitions, frequent rebalances, a slow downstream. Note CPU may look fine throughout.'],
  ['Kafka vs RabbitMQ vs SQS','Kafka is a durable replayable log with per-key ordering and consumer groups. RabbitMQ is a broker with rich routing and per-message ack. SQS is a managed queue with minimal operations.','Pick one for your event-driven components and defend it. => this is the question your background sets up.'],
  ['acks and min.insync.replicas','acks=0 fire and forget, acks=1 leader only, acks=all waits for the in-sync set.','Which for money? => acks=all with min.insync.replicas=2, and accept the latency.'],
  ['Schema evolution','A schema registry with backward and forward compatibility rules.','You add a required field. Who breaks? => existing consumers that do not know it. Add optional fields with defaults instead.'],
  ['Rebalance listeners','ConsumerRebalanceListener lets you commit before losing a partition.','Why does it matter? => without it, in-flight work on a revoked partition is redone by the new owner.'],
  ['Kafka Streams vs a plain consumer','Streams gives stateful processing, joins and windowing with a changelog-backed store.','When is a plain consumer enough? => stateless transformation and forwarding, which is most cases.'],
  ['From Spring events to Kafka','Spring events are in-process, synchronous by default, and lost on crash. Kafka is durable, replayable and cross-service.','When do you migrate? => when another service needs the event, when you need replay, or when losing one is unacceptable. The outbox is the migration path.']
 ],
 traps:[
  'Leaving auto-commit on.',
  'Assuming topic-wide ordering.',
  'No DLQ, so one bad record halts a partition forever.',
  'Adding partitions to a keyed topic without thinking about ordering.',
  'A non-idempotent consumer under at-least-once delivery.'
 ]},

{id:'micro', n:11, name:'Microservices & resilience', phase:2, hrs:9,
 note:'NEW KNOWLEDGE for you - you run a monolith. That is an ASSET here, not a gap: most candidates parrot microservices without ever having felt the pain. Being able to argue both sides is the strongest position in the room.',
 asked:[
  'Where would you split your monolith first, and why have you not?',
  'A downstream service is slow but not failing. What protects you?',
  'How do you keep a transaction consistent across two services?',
  'Argue against microservices.'
 ],
 code:[
  ['Circuit breaker, bulkhead, timeout and fallback',
   ['@CircuitBreaker(name = "pricing", fallbackMethod = "cachedPrice")',
    '@Bulkhead(name = "pricing")            // isolates the thread pool',
    '@TimeLimiter(name = "pricing")',
    '@Retry(name = "pricing")               // ONLY because this call is idempotent',
    'public CompletableFuture<Price> price(String sku) {',
    '    return CompletableFuture.supplyAsync(() -> pricingClient.get(sku));',
    '}',
    '',
    'private CompletableFuture<Price> cachedPrice(String sku, Throwable t) {',
    '    return CompletableFuture.completedFuture(cache.lastKnown(sku));',
    '}',
    '',
    '# resilience4j.circuitbreaker.instances.pricing:',
    '#   failureRateThreshold: 50',
    '#   waitDurationInOpenState: 10s',
    '#   permittedNumberOfCallsInHalfOpenState: 3'],
   'The order matters: Retry wraps CircuitBreaker wraps TimeLimiter wraps Bulkhead. A breaker without a timeout is useless, because a hang never counts as a failure - it just consumes threads.'],
  ['Strangler fig - how you actually split',
   ['// 1. put a facade in front of the monolith module',
    'interface PricingGateway { Price price(String sku); }',
    '',
    '// 2. implementation still calls in-process',
    'class InProcessPricing implements PricingGateway { ... }',
    '',
    '// 3. new implementation calls the extracted service',
    'class RemotePricing implements PricingGateway { ... }',
    '',
    '// 4. route by feature flag, percentage first, and compare outputs',
    '@Bean PricingGateway pricing(FeatureFlags flags) {',
    '    return flags.enabled("pricing.remote") ? remote : inProcess;',
    '}',
    '',
    '// 5. move the DATA last, once the seam has held for weeks'],
   'The interface comes first, the network call second, the data migration last. Teams that move the data first end up with a distributed monolith and no way back.']
 ],
 qa:[
  ['When NOT to use microservices','Small team, shared data model, unclear boundaries. They buy independent deploy and scale; they cost you a distributed system.','Argue against microservices. => answering this well is worth more than any architecture diagram. Distributed transactions, network partitions, versioned contracts, and debugging across five services.'],
  ['Splitting a monolith','Find a bounded context with few writes crossing the seam. Strangler-fig behind a facade. Move data last.','Which seam would you split first in YOUR system, and why have you not? => have a real answer ready.'],
  ['Distributed monolith','Services that must be deployed together. All the cost, none of the benefit.','How do you spot one? => a change requires coordinated releases, or one service being down takes all of them down.'],
  ['Service discovery','A registry, or Kubernetes Services plus DNS.','How does a caller find a healthy instance? => the Service only routes to pods passing readiness. That is discovery and health in one.'],
  ['API gateway','A single edge for auth, rate limiting, routing and aggregation.','The risk? => it accumulates business logic and becomes a deployment bottleneck.'],
  ['Circuit breaker','Closed, then open above a failure threshold, then half-open to probe.','A downstream is SLOW but not failing. What protects you? => a timeout first, then a bulkhead so it cannot exhaust your threads, then the breaker. A breaker alone never trips on slowness.'],
  ['Bulkhead','Isolate a thread pool or connection pool per dependency.','Why is a timeout not enough? => without isolation, enough slow calls still consume every request thread before any of them time out.'],
  ['Retries','Exponential backoff with jitter, only for idempotent operations.','You retried a payment. Now what? => a double charge, unless the endpoint takes an idempotency key.'],
  ['Saga','Local transactions plus compensating actions. Choreography (events) or orchestration (a coordinator).','Why not 2PC? => it holds locks across services for the duration of network calls and the coordinator is a single point of failure.'],
  ['Compensating transaction','A business-level undo, such as a refund - not a database rollback.','What if the step cannot be undone, like a sent email? => order the workflow so irreversible steps come last.'],
  ['Outbox','Write the row and the event in one local transaction; a relay publishes.','Why not write to the DB then publish? => the dual-write problem. If the publish fails, the systems silently diverge.'],
  ['Distributed tracing','A trace id propagated in headers, with a span per operation.','How does the id survive an async hop or a Kafka message? => a TaskDecorator copying the MDC, and trace headers on the Kafka record.'],
  ['Config and secrets','A config server, or Kubernetes ConfigMaps and Secrets.','How do you rotate a secret with zero downtime? => mounted files can be re-read; env vars require a restart. Design for the first.'],
  ['Data per service','Each service owns its store. No cross-service joins.','So how do you build a report spanning three services? => CQRS with a read model, an event-driven projection, or a warehouse. Not a shared database.'],
  ['Versioning service contracts','Additive changes only; never remove a field consumers still read.','How do you know who still reads it? => you instrument the field, or you cannot safely remove anything.'],
  ['Idempotency across services','Keys plus a dedup store, at every consumer.','Why is this non-negotiable? => at-least-once delivery means every handler runs twice eventually.']
 ],
 traps:[
  'A circuit breaker with no timeout - slowness never trips it.',
  'Retrying non-idempotent operations.',
  'Splitting the data before the interface.',
  'A shared database between services, which is a distributed monolith.',
  'No distributed tracing, so a cross-service latency problem is unfindable.'
 ]},

{id:'k8s', n:12, name:'Docker & Kubernetes', phase:1, hrs:11,
 note:'YOUR PRODUCTION EDGE. You run frontend and backend pods. Most candidates recite Kubernetes; you have been paged by it. Lead with a real incident.',
 asked:[
  'Your Java pod is OOMKilled. Walk me through it.',
  'What breaks if you swap liveness and readiness?',
  'Walk me through debugging CrashLoopBackOff.',
  'How do you deploy with genuinely zero downtime?'
 ],
 code:[
  ['Multi-stage build with a container-aware JVM',
   ['FROM maven:3.9-eclipse-temurin-21 AS build',
    'WORKDIR /app',
    'COPY pom.xml .',
    'RUN mvn -q dependency:go-offline        # cached layer - deps before source',
    'COPY src ./src',
    'RUN mvn -q clean package -DskipTests',
    '',
    'FROM eclipse-temurin:21-jre-alpine',
    'RUN addgroup -S app && adduser -S app -G app   # do not run as root',
    'USER app',
    'COPY --from=build /app/target/*.jar app.jar',
    '# the JVM must be told about the container limit',
    'ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-jar","/app.jar"]'],
   'Dependencies before source is what makes the layer cache work. MaxRAMPercentage is what stops the JVM sizing its heap from the NODE memory and getting OOMKilled.'],
  ['The deployment spec that actually gives zero downtime',
   ['spec:',
    '  strategy:',
    '    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }',
    '  template:',
    '    spec:',
    '      terminationGracePeriodSeconds: 45',
    '      containers:',
    '      - name: api',
    '        resources:',
    '          requests: { memory: "512Mi", cpu: "250m" }   # scheduler reserves',
    '          limits:   { memory: "1Gi" }                  # hard cap; NO cpu limit',
    '        readinessProbe:                                 # gates traffic',
    '          httpGet: { path: /actuator/health/readiness, port: 8080 }',
    '          periodSeconds: 5',
    '        livenessProbe:                                  # RESTARTS the container',
    '          httpGet: { path: /actuator/health/liveness, port: 8080 }',
    '          periodSeconds: 10',
    '          failureThreshold: 3',
    '        startupProbe:                                   # slow boot protection',
    '          httpGet: { path: /actuator/health/liveness, port: 8080 }',
    '          failureThreshold: 30',
    '        lifecycle:',
    '          preStop: { exec: { command: ["sh","-c","sleep 10"] } }'],
   'The preStop sleep is the piece almost everyone omits: endpoint removal and SIGTERM race, so without it the Service still routes to a pod that has started shutting down. Note also no CPU limit - requests for scheduling, limits only on memory, to avoid throttling.']
 ],
 qa:[
  ['Image layers','Copy-on-write layers; the cache invalidates from the first changed layer down.','How do you order a Dockerfile for cache hits? => dependencies before source, since source changes every build.'],
  ['Multi-stage builds','Build in a full image, copy only the artefact into a slim runtime.','Why does this matter beyond size? => attack surface. No compiler, no build tools, no shell in the shipped image.'],
  ['Pod vs container','A pod is the scheduling unit; containers in it share a network namespace and volumes.','When do two containers belong in one pod? => a sidecar tightly coupled in lifecycle, like a log shipper or a proxy.'],
  ['Deployment and ReplicaSet','You declare desired state; a controller reconciles continuously.','You deleted a pod. What happens? => the ReplicaSet creates a replacement. Deleting pods is not how you scale down.'],
  ['Service and Ingress','A Service is a stable virtual IP plus a label selector; Ingress is L7 routing into the cluster.','Walk me from a browser to a pod. => DNS, ingress controller, Service, kube-proxy or IPVS rules, pod IP.'],
  ['Liveness vs readiness vs startup','Liveness RESTARTS. Readiness REMOVES FROM ENDPOINTS. Startup delays liveness for slow boots.','What breaks if you swap them? => a pod that is briefly busy or waiting on a dependency gets killed instead of temporarily drained. Under load that becomes a cluster-wide restart loop.'],
  ['What liveness must not check','Downstream dependencies.','Why? => if the database is slow, every pod fails liveness and restarts simultaneously, turning a degradation into an outage.'],
  ['Requests vs limits','Requests are reserved by the scheduler; limits are the hard cap.','Set only limits - what happens? => requests default to limits, bin-packing gets worse and you waste capacity.'],
  ['OOMKilled','The container exceeded its memory limit; the kernel kills it. Exit code 137.','Your Java pod OOMKills. What do you change? => set MaxRAMPercentage so the heap respects the container, account for metaspace, thread stacks and direct buffers on top of heap, then take a heap dump and actually find the leak.'],
  ['CPU throttling','A CPU limit throttles via CFS quota rather than killing.','Latency spikes but memory is fine. What do you check? => container_cpu_cfs_throttled_seconds. Many teams remove CPU limits entirely and keep requests.'],
  ['CrashLoopBackOff','The container keeps exiting; restart delay grows exponentially.','Walk me through debugging it. => kubectl describe pod for events (image pull, mount, probe failures), then logs --previous for the last crash, then the exit code, then check config and secrets exist.'],
  ['Rolling update','maxSurge and maxUnavailable control the pace; readiness gates progress.','How do you get TRULY zero downtime? => readiness plus graceful shutdown plus a preStop drain plus backward-compatible schema. Missing any one drops requests.'],
  ['HPA','Scales replica count on CPU, memory or a custom metric.','You added HPA and it did not help. Why? => the bottleneck was the database, a connection pool or a single Kafka partition. More pods made it worse.'],
  ['ConfigMap vs Secret','Non-sensitive config versus base64-encoded values, which are NOT encrypted at rest by default.','How do you rotate without a restart? => mounted files update after a delay and can be re-read; env vars cannot change in a running process.'],
  ['StatefulSet','Stable network identity and per-pod persistent storage, ordered rollout.','Why not run Postgres in a Deployment? => no stable identity, no ordered startup, and volumes can attach to the wrong replica.'],
  ['Resource QoS classes','Guaranteed, Burstable, BestEffort - decided by your requests and limits.','Which pods get evicted first under node pressure? => BestEffort, then Burstable. Set requests if you want to survive.'],
  ['Init containers','Run to completion before app containers start.','A legitimate use? => waiting for a migration to complete, or fetching a config bundle.']
 ],
 traps:[
  'A JVM with no MaxRAMPercentage sizing its heap from node memory.',
  'Liveness probes that call the database.',
  'No preStop hook, so rolling updates drop in-flight requests.',
  'CPU limits causing invisible throttling.',
  'Treating Secrets as encrypted. They are base64 by default.'
 ]},

{id:'obs', n:13, name:'Observability, testing & CI/CD', phase:2, hrs:6,
 asked:[
  'How do you know this is broken before a customer tells you?',
  'How do you test a Kafka consumer?',
  'Why not H2 for integration tests?',
  'How do you roll back a bad deploy that included a schema change?'
 ],
 code:[
  ['Testcontainers - the real database in a test',
   ['@SpringBootTest',
    '@Testcontainers',
    'class OrderRepositoryTest {',
    '',
    '    @Container',
    '    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");',
    '',
    '    @DynamicPropertySource',
    '    static void props(DynamicPropertyRegistry r) {',
    '        r.add("spring.datasource.url", pg::getJdbcUrl);',
    '        r.add("spring.datasource.username", pg::getUsername);',
    '        r.add("spring.datasource.password", pg::getPassword);',
    '    }',
    '}'],
   'The container is static, so it starts once for the whole class rather than per test. H2 accepts SQL Postgres rejects and lacks JSONB, window function edge cases and real locking behaviour - so H2-green, production-red is a familiar failure.'],
  ['Correlation id that survives an async hop',
   ['@Bean',
    'public TaskDecorator mdcDecorator() {',
    '    return runnable -> {',
    '        Map<String, String> ctx = MDC.getCopyOfContextMap();   // captured on the caller',
    '        return () -> {',
    '            if (ctx != null) MDC.setContextMap(ctx);',
    '            try { runnable.run(); } finally { MDC.clear(); }',
    '        };',
    '    };',
    '}',
    '// then: executor.setTaskDecorator(mdcDecorator());'],
   'Without this, every log line written on an @Async thread loses the trace id, and a cross-thread latency problem becomes unfindable. The finally clear matters because the thread is pooled.']
 ],
 qa:[
  ['Logs vs metrics vs traces','Discrete events, aggregated numbers, and the causal path of one request.','App is slow and you have all three. What first? => metrics to localise (which service, which endpoint, p99 vs p50), then traces for where the time went, then logs for the specific request. Cheapest to most expensive.'],
  ['Structured logging','JSON with consistent fields, including a correlation id.','How does the id survive an async hop or a Kafka message? => a TaskDecorator copying MDC, and trace headers on the record.'],
  ['What to alert on','User-visible symptoms and SLO burn rate.','Why is CPU above 80 percent a bad alert? => it is a cause, not a symptom, and it is often completely fine. Alerts that fire without user impact get ignored.'],
  ['Cardinality','The number of distinct label combinations on a metric.','Someone adds user_id as a Prometheus label. What happens? => one time series per user; memory and index blow up and the metrics system falls over.'],
  ['p50 vs p99','Median versus tail. Averages hide the tail entirely.','Why does p99 matter more? => on a page making 10 calls, a 1 percent tail affects roughly 10 percent of page loads.'],
  ['Test pyramid','Many fast unit tests, fewer integration, very few end-to-end.','Where do you test a repository query? => an integration test with a real database, via Testcontainers.'],
  ['Mockito','Mock collaborators, never the class under test.','When is mocking a smell? => mocking value objects, or asserting on interactions so specifically that any refactor breaks the test.'],
  ['Testcontainers vs H2','A real Postgres in Docker versus an in-memory imitation.','Why not H2? => dialect drift. H2 accepts SQL Postgres rejects, and lacks JSONB and real lock semantics, so tests pass and production fails.'],
  ['Testing a Kafka consumer','Testcontainers Kafka or an embedded broker for the wiring; call the handler directly for the logic.','What must you assert beyond the happy path? => that processing the same record twice is safe, since at-least-once guarantees it will happen.'],
  ['Testing @Transactional and events','Test transactions roll back by default, so AFTER_COMMIT listeners never fire.','So what happens to that test? => it silently passes without executing the handler. Use @Commit or TestTransaction.'],
  ['Flaky tests','Time, ordering, shared state, real network calls.','What do they cost? => the team stops trusting the suite, then stops reading failures, then ships the real bug.'],
  ['CI pipeline stages','Compile, unit, integration, build image, scan, deploy to staging, smoke, promote.','What should block a merge? => tests, coverage direction, and a dependency vulnerability scan.'],
  ['Blue-green vs canary','Two full environments with a switch, versus a percentage rollout.','Which for a schema change? => neither on its own. Schema needs expand-migrate-contract regardless of deployment strategy.'],
  ['Rollback','Redeploy the previous image. Schema changes must be backward compatible for that to work.','You dropped a column and need to roll back. Now what? => you cannot. Which is why contract is a separate later release from expand.'],
  ['Feature flags','Decouple deploy from release; roll out by percentage.','What is the hidden cost? => every flag is a branch in production, and stale flags accumulate into untested combinations.']
 ],
 traps:[
  'Alerting on causes instead of symptoms.',
  'High-cardinality metric labels.',
  'H2 in tests, Postgres in production.',
  'Tests that never exercise duplicate message delivery.',
  'Dropping a column in the same release that stops writing it.'
 ]}

]);

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

/* ============================================================== LINKING ===
   Problem rows link out to LeetCode and GeeksforGeeks.

   LeetCode slugs are derived from the title (lowercase, strip punctuation,
   hyphenate). That is correct for the large majority. Where a row bundles
   several problems under one heading, or the title was edited for the sheet,
   derivation would 404 - so those numbers get an explicit slug here.

   GfG has no problem numbers and its slugs carry an opaque numeric suffix
   that cannot be derived, so GfG links go through its search page. That
   always resolves. Where GfG names a problem differently from LeetCode, the
   better search term is given in PLAN.gfgName.                             */

PLAN.lcSlug = {
  2:'add-two-numbers', 5:'longest-palindromic-substring', 7:'reverse-integer',
  13:'roman-to-integer', 26:'remove-duplicates-from-sorted-array',
  33:'search-in-rotated-sorted-array', 39:'combination-sum', 46:'permutations',
  51:'n-queens', 53:'maximum-subarray', 55:'jump-game', 62:'unique-paths',
  70:'climbing-stairs', 74:'search-a-2d-matrix', 78:'subsets',
  83:'remove-duplicates-from-sorted-list', 94:'binary-tree-inorder-traversal',
  96:'unique-binary-search-trees', 100:'same-tree', 102:'binary-tree-level-order-traversal',
  104:'maximum-depth-of-binary-tree', 105:'construct-binary-tree-from-preorder-and-inorder-traversal',
  108:'convert-sorted-array-to-binary-search-tree', 112:'path-sum',
  121:'best-time-to-buy-and-sell-stock', 136:'single-number', 139:'word-break',
  141:'linked-list-cycle', 151:'reverse-words-in-a-string',
  153:'find-minimum-in-rotated-sorted-array', 188:'best-time-to-buy-and-sell-stock-iv',
  191:'number-of-1-bits', 198:'house-robber', 206:'reverse-linked-list',
  207:'course-schedule', 216:'combination-sum-iii', 217:'contains-duplicate',
  224:'basic-calculator', 231:'power-of-two', 232:'implement-queue-using-stacks',
  236:'lowest-common-ancestor-of-a-binary-tree', 252:'meeting-rooms',
  307:'range-sum-query-mutable', 322:'coin-change', 337:'house-robber-iii',
  344:'reverse-string', 347:'top-k-frequent-elements',
  349:'intersection-of-two-arrays', 381:'insert-delete-getrandom-o1-duplicates-allowed',
  383:'ransom-note', 428:'serialize-and-deserialize-n-ary-tree', 437:'path-sum-iii',
  449:'serialize-and-deserialize-bst', 490:'the-maze', 496:'next-greater-element-i',
  622:'design-circular-queue', 630:'course-schedule-iii', 695:'max-area-of-island',
  700:'search-in-a-binary-search-tree', 705:'design-hashset', 729:'my-calendar-i',
  732:'my-calendar-iii', 785:'is-graph-bipartite', 938:'range-sum-of-bst',
  1004:'max-consecutive-ones-iii', 1047:'remove-all-adjacent-duplicates-in-string',
  1650:'lowest-common-ancestor-of-a-binary-tree-iii', 2050:'parallel-courses-iii',
  /* titles that derive to the wrong slug */
  68:'text-justification', 69:'sqrtx', 50:'powx-n', 8:'string-to-integer-atoi',
  1:'two-sum', 15:'3sum', 18:'4sum', 16:'3sum-closest', 42:'trapping-rain-water',
  146:'lru-cache', 460:'lfu-cache', 297:'serialize-and-deserialize-binary-tree',
  312:'burst-balloons', 4:'median-of-two-sorted-arrays',
  /* shortened headings and non-derivable slugs */
  3:'longest-substring-without-repeating-characters',
  6:'zigzag-conversion',
  17:'letter-combinations-of-a-phone-number',
  19:'remove-nth-node-from-end-of-list',
  22:'generate-parentheses',
  25:'reverse-nodes-in-k-group',
  30:'substring-with-concatenation-of-all-words',
  32:'longest-valid-parentheses',
  34:'find-first-and-last-position-of-element-in-sorted-array',
  35:'search-insert-position',
  57:'insert-interval',
  61:'rotate-list',
  65:'valid-number',
  71:'simplify-path',
  77:'combinations',
  79:'word-search',
  85:'maximal-rectangle',
  92:'reverse-linked-list-ii',
  93:'restore-ip-addresses',
  97:'interleaving-string',
  98:'validate-binary-search-tree',
  99:'recover-binary-search-tree',
  114:'flatten-binary-tree-to-linked-list',
  115:'distinct-subsequences',
  116:'populating-next-right-pointers-in-each-node',
  126:'word-ladder-ii',
  127:'word-ladder',
  130:'surrounded-regions',
  131:'palindrome-partitioning',
  132:'palindrome-partitioning-ii',
  135:'candy',
  138:'copy-list-with-random-pointer',
  142:'linked-list-cycle-ii',
  143:'reorder-list',
  148:'sort-list',
  150:'evaluate-reverse-polish-notation',
  158:'read-n-characters-given-read4-ii-call-multiple-times',
  160:'intersection-of-two-linked-lists',
  162:'find-peak-element',
  167:'two-sum-ii-input-array-is-sorted',
  172:'factorial-trailing-zeroes',
  173:'binary-search-tree-iterator',
  174:'dungeon-game',
  179:'largest-number',
  199:'binary-tree-right-side-view',
  204:'count-primes',
  208:'implement-trie-prefix-tree',
  209:'minimum-size-subarray-sum',
  211:'design-add-and-search-words-data-structure',
  212:'word-search-ii',
  214:'shortest-palindrome',
  215:'kth-largest-element-in-an-array',
  218:'the-skyline-problem',
  221:'maximal-square',
  225:'implement-stack-using-queues',
  227:'basic-calculator-ii',
  228:'summary-ranges',
  229:'majority-element-ii',
  230:'kth-smallest-element-in-a-bst',
  234:'palindrome-linked-list',
  240:'search-a-2d-matrix-ii',
  249:'group-shifted-strings',
  260:'single-number-iii',
  269:'alien-dictionary',
  270:'closest-binary-search-tree-value',
  271:'encode-and-decode-strings',
  272:'closest-binary-search-tree-value-ii',
  273:'integer-to-english-words',
  278:'first-bad-version',
  282:'expression-add-operators',
  287:'find-the-duplicate-number',
  288:'unique-word-abbreviation',
  289:'game-of-life',
  291:'word-pattern-ii',
  296:'best-meeting-point',
  299:'bulls-and-cows',
  301:'remove-invalid-parentheses',
  310:'minimum-height-trees',
  314:'binary-tree-vertical-order-traversal',
  316:'remove-duplicate-letters',
  321:'create-maximum-number',
  327:'count-of-range-sum',
  328:'odd-even-linked-list',
  329:'longest-increasing-path-in-a-matrix',
  332:'reconstruct-itinerary',
  336:'palindrome-pairs',
  338:'counting-bits',
  340:'longest-substring-with-at-most-k-distinct-characters',
  348:'design-tic-tac-toe',
  359:'logger-rate-limiter',
  362:'design-hit-counter',
  371:'sum-of-two-integers',
  372:'super-pow',
  373:'find-k-pairs-with-smallest-sums',
  378:'kth-smallest-element-in-a-sorted-matrix',
  380:'insert-delete-getrandom-o1',
  384:'shuffle-an-array',
  387:'first-unique-character-in-a-string',
  388:'longest-absolute-file-path',
  392:'is-subsequence',
  394:'decode-string',
  398:'random-pick-index',
  399:'evaluate-division',
  402:'remove-k-digits',
  407:'trapping-rain-water-ii',
  410:'split-array-largest-sum',
  417:'pacific-atlantic-water-flow',
  421:'maximum-xor-of-two-numbers-in-an-array',
  425:'word-squares',
  430:'flatten-a-multilevel-doubly-linked-list',
  432:'all-oone-data-structure',
  433:'minimum-genetic-mutation',
  435:'non-overlapping-intervals',
  438:'find-all-anagrams-in-a-string',
  442:'find-all-duplicates-in-an-array',
  443:'string-compression',
  445:'add-two-numbers-ii',
  448:'find-all-numbers-disappeared-in-an-array',
  452:'minimum-number-of-arrows-to-burst-balloons',
  455:'assign-cookies',
  456:'132-pattern',
  459:'repeated-substring-pattern',
  465:'optimal-account-balancing',
  468:'validate-ip-address',
  470:'implement-rand10-using-rand7',
  472:'concatenated-words',
  480:'sliding-window-median',
  489:'robot-room-cleaner',
  495:'teemo-attacking',
  502:'ipo',
  503:'next-greater-element-ii',
  505:'the-maze-ii',
  523:'continuous-subarray-sum',
  525:'contiguous-array',
  528:'random-pick-with-weight',
  540:'single-element-in-a-sorted-array',
  542:'01-matrix',
  543:'diameter-of-binary-tree',
  545:'boundary-of-binary-tree',
  546:'remove-boxes',
  547:'number-of-provinces',
  552:'student-attendance-record-ii',
  567:'permutation-in-string',
  588:'design-in-memory-file-system',
  621:'task-scheduler',
  632:'smallest-range-covering-elements-from-k-lists',
  636:'exclusive-time-of-functions',
  641:'design-circular-deque',
  642:'design-search-autocomplete-system',
  644:'maximum-average-subarray-ii',
  648:'replace-words',
  652:'find-duplicate-subtrees',
  658:'find-k-closest-elements',
  662:'maximum-width-of-binary-tree',
  668:'kth-smallest-number-in-multiplication-table',
  676:'implement-magic-dictionary',
  679:'24-game',
  680:'valid-palindrome-ii',
  681:'next-closest-time',
  683:'k-empty-slots',
  684:'redundant-connection',
  685:'redundant-connection-ii',
  692:'top-k-frequent-words',
  698:'partition-to-k-equal-sum-subsets',
  699:'falling-squares',
  703:'kth-largest-element-in-a-stream',
  704:'binary-search',
  706:'design-hashmap',
  707:'design-linked-list',
  708:'insert-into-a-sorted-circular-linked-list',
  715:'range-module',
  719:'find-k-th-smallest-pair-distance',
  720:'longest-word-in-dictionary',
  721:'accounts-merge',
  726:'number-of-atoms',
  727:'minimum-window-subsequence',
  731:'my-calendar-ii',
  733:'flood-fill',
  735:'asteroid-collision',
  743:'network-delay-time',
  745:'prefix-and-suffix-search',
  752:'open-the-lock',
  753:'cracking-the-safe',
  759:'employee-free-time',
  767:'reorganize-string',
  772:'basic-calculator-iii',
  773:'sliding-puzzle',
  774:'minimize-max-distance-to-gas-station',
  777:'swap-adjacent-in-lr-string',
  778:'swim-in-rising-water',
  780:'reaching-points',
  787:'cheapest-flights-within-k-stops',
  792:'number-of-matching-subsequences',
  802:'find-eventual-safe-states',
  803:'bricks-falling-when-hit',
  809:'expressive-words',
  815:'bus-routes',
  818:'race-car',
  819:'most-common-word',
  827:'making-a-large-island',
  828:'count-unique-characters-of-all-substrings-of-a-given-string',
  833:'find-and-replace-in-string',
  834:'sum-of-distances-in-tree',
  837:'new-21-game',
  839:'similar-string-groups',
  843:'guess-the-word',
  847:'shortest-path-visiting-all-nodes',
  850:'rectangle-area-ii',
  852:'peak-index-in-a-mountain-array',
  855:'exam-room',
  857:'minimum-cost-to-hire-k-workers',
  862:'shortest-subarray-with-sum-at-least-k',
  863:'all-nodes-distance-k-in-binary-tree',
  864:'shortest-path-to-get-all-keys',
  871:'minimum-number-of-refueling-stops',
  875:'koko-eating-bananas',
  886:'possible-bipartition',
  887:'super-egg-drop',
  895:'maximum-frequency-stack',
  899:'orderly-queue',
  900:'rle-iterator',
  901:'online-stock-span',
  902:'numbers-at-most-n-given-digit-set',
  907:'sum-of-subarray-minimums',
  909:'snakes-and-ladders',
  918:'maximum-sum-circular-subarray',
  930:'binary-subarrays-with-sum',
  934:'shortest-bridge',
  936:'stamping-the-sequence',
  937:'reorder-data-in-log-files',
  947:'most-stones-removed-with-same-row-or-column',
  951:'flip-equivalent-binary-trees',
  952:'largest-component-size-by-common-factor',
  968:'binary-tree-cameras',
  973:'k-closest-points-to-origin',
  979:'distribute-coins-in-binary-tree',
  981:'time-based-key-value-store',
  986:'interval-list-intersections',
  987:'vertical-order-traversal-of-a-binary-tree',
  990:'satisfiability-of-equality-equations',
  992:'subarrays-with-k-different-integers',
  1000:'minimum-cost-to-merge-stones',
  1010:'pairs-of-songs-with-total-durations-divisible-by-60',
  1011:'capacity-to-ship-packages-within-d-days',
  1024:'video-stitching',
  1032:'stream-of-characters',
  1039:'minimum-score-triangulation-of-polygon',
  1044:'longest-duplicate-substring',
  1046:'last-stone-weight',
  1091:'shortest-path-in-binary-matrix',
  1102:'path-with-maximum-minimum-value',
  1123:'lowest-common-ancestor-of-deepest-leaves',
  1130:'minimum-cost-tree-from-leaf-values',
  1146:'snapshot-array',
  1152:'analyze-user-website-visit-pattern',
  1167:'minimum-cost-to-connect-sticks',
  1171:'remove-zero-sum-consecutive-nodes-from-linked-list',
  1192:'critical-connections-in-a-network',
  1203:'sort-items-by-groups-respecting-dependencies',
  1229:'meeting-scheduler',
  1231:'divide-chocolate',
  1234:'replace-the-substring-for-balanced-string',
  1235:'maximum-profit-in-job-scheduling',
  1248:'count-number-of-nice-subarrays',
  1254:'number-of-closed-islands',
  1268:'search-suggestions-system',
  1288:'remove-covered-intervals',
  1293:'shortest-path-in-a-grid-with-obstacles-elimination',
  1319:'number-of-operations-to-make-network-connected',
  1334:'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
  1345:'jump-game-iv',
  1349:'maximum-students-taking-exam',
  1368:'minimum-cost-to-make-at-least-one-valid-path-in-a-grid',
  1372:'longest-zigzag-path-in-a-binary-tree',
  1373:'maximum-sum-bst-in-binary-tree',
  1383:'maximum-performance-of-a-team',
  1443:'minimum-time-to-collect-all-apples-in-a-tree',
  1466:'reorder-routes-to-make-all-paths-lead-to-the-city-zero',
  1481:'least-number-of-unique-integers-after-k-removals',
  1482:'minimum-number-of-days-to-make-m-bouquets',
  1483:'kth-ancestor-of-a-tree-node',
  1489:'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree',
  1514:'path-with-maximum-probability',
  1552:'magnetic-force-between-two-balls',
  1568:'minimum-number-of-days-to-disconnect-island',
  1584:'min-cost-to-connect-all-points',
  1631:'path-with-minimum-effort',
  1642:'furthest-building-you-can-reach',
  1697:'checking-existence-of-edge-length-limited-paths',
  1707:'maximum-xor-with-an-element-from-array',
  1834:'single-threaded-cpu',
  1857:'largest-color-value-in-a-directed-graph',
  1928:'minimum-cost-to-reach-destination-in-time',
  1970:'last-day-where-you-can-still-cross',
  1976:'number-of-ways-to-arrive-at-destination',
  2045:'second-minimum-time-to-reach-destination',
  2093:'minimum-cost-to-reach-city-with-discounts',
  2097:'valid-arrangement-of-pairs',
  2104:'sum-of-subarray-ranges',
  2251:'number-of-flowers-in-full-bloom',
  2290:'minimum-obstacle-removal-to-reach-corner',
  2385:'amount-of-time-for-binary-tree-to-be-infected',
  2492:'minimum-score-of-a-path-between-two-cities'
};

/* GfG names the classics differently. Only the divergences are listed; for
   anything absent, the LeetCode title is the search term. */
PLAN.gfgName = {
  1:'Two Sum pair with given sum', 53:'Kadane Algorithm',
  121:'Stock buy and sell', 122:'Stock buy and sell multiple transactions',
  169:'Majority Element', 75:'Sort an array of 0s 1s and 2s',
  41:'First missing positive', 238:'Product array puzzle',
  152:'Maximum Product Subarray', 189:'Rotate array by n elements',
  73:'Set matrix zeroes', 54:'Spiral traversal of matrix', 48:'Rotate matrix by 90 degrees',
  560:'Subarray with given sum', 3:'Longest distinct characters in string',
  76:'Smallest window containing all characters', 5:'Longest palindromic substring',
  49:'Group anagrams', 20:'Parenthesis checker', 151:'Reverse words in a string',
  8:'Implement atoi', 14:'Longest common prefix', 28:'Implement strstr',
  128:'Longest consecutive subsequence', 347:'Top K frequent elements',
  704:'Binary search', 34:'First and last occurrence', 33:'Search in rotated sorted array',
  162:'Peak element', 875:'Koko eating bananas', 215:'Kth largest element in an array',
  179:'Largest number formed from array', 56:'Merge overlapping intervals',
  55:'Minimum number of jumps', 134:'Circular tour petrol pump',
  206:'Reverse a linked list', 21:'Merge two sorted linked lists',
  141:'Detect loop in linked list', 142:'Find first node of loop',
  19:'Remove nth node from end of linked list', 2:'Add two numbers represented by linked lists',
  138:'Clone a linked list with next and random pointer', 234:'Palindrome linked list',
  25:'Reverse a linked list in groups of given size', 23:'Merge k sorted linked lists',
  20:'Parenthesis checker', 155:'Get min from stack', 739:'Next greater element',
  84:'Largest rectangle in histogram', 85:'Maximum rectangle in binary matrix',
  239:'Maximum of all subarrays of size k', 946:'Stack permutations',
  295:'Find median in a stream', 23:'Merge k sorted arrays',
  94:'Inorder traversal', 144:'Preorder traversal', 145:'Postorder traversal',
  102:'Level order traversal', 104:'Height of binary tree', 110:'Balanced tree check',
  543:'Diameter of binary tree', 236:'LCA in a binary tree', 235:'LCA in a BST',
  98:'Check for BST', 230:'Kth smallest element in BST', 450:'Delete a node from BST',
  297:'Serialize and deserialize a binary tree', 124:'Maximum path sum',
  863:'Nodes at given distance in binary tree', 208:'Trie insert and search',
  212:'Word boggle', 200:'Number of islands', 994:'Rotten oranges',
  127:'Word ladder', 207:'Prerequisite tasks', 210:'Course schedule',
  547:'Number of provinces', 684:'Detect cycle in undirected graph',
  743:'Implementing Dijkstra algorithm', 1584:'Minimum spanning tree',
  1192:'Bridges in graph', 332:'Euler circuit and path', 329:'Longest increasing path in a matrix',
  46:'Permutations of a given string', 51:'N Queen problem', 37:'Solve the sudoku',
  79:'Word search', 39:'Combination sum', 78:'Subsets',
  70:'Count ways to reach nth stair', 198:'Stickler thief', 300:'Longest increasing subsequence',
  322:'Coin change minimum number of coins', 518:'Coin change number of ways',
  416:'Subset sum problem', 1143:'Longest common subsequence', 72:'Edit distance',
  62:'Number of unique paths', 64:'Minimum path sum', 91:'Total decoding messages',
  139:'Word break', 279:'Perfect sum problem', 312:'Burst balloons',
  1024:'Video stitching', 221:'Maximum square area in a binary matrix',
  136:'Single number', 191:'Count set bits', 231:'Power of two',
  50:'Power of numbers', 204:'Sieve of Eratosthenes', 202:'Happy number',
  146:'LRU cache', 380:'Insert delete and getRandom in O(1)',
  4:'Median of two sorted arrays', 42:'Trapping rain water', 84:'Largest rectangle in histogram'
};

/* ============================================================== READING ===
   Per-session and per-module references.
     ['label', 'https://...', 1]  a direct link
     ['label', 'search terms',  0]  something worth reading whose exact URL is
                                    not stable enough to hard-code - the row
                                    opens a search for it instead.
   Marked so you always know which is which.                                */

PLAN.readGeneral = [
  ['System Design Primer (the standard free syllabus)', 'https://github.com/donnemartin/system-design-primer', 1],
  ['GeeksforGeeks — System Design tutorial', 'https://www.geeksforgeeks.org/system-design-tutorial/', 1],
  ['Martin Fowler — Patterns of Distributed Systems', 'https://martinfowler.com/articles/patterns-of-distributed-systems/', 1],
  ['High Scalability — real architecture write-ups', 'http://highscalability.com/', 1],
  ['microservices.io — the pattern catalogue', 'https://microservices.io/patterns/index.html', 1]
];

PLAN.sdRead = {
1:[['Latency numbers every programmer should know', 'https://gist.github.com/jboner/2841832', 1],
   ['GfG — CAP theorem', 'https://www.geeksforgeeks.org/cap-theorem-in-system-design/', 1],
   ['Daniel Abadi — PACELC, the honest extension of CAP', 'PACELC theorem Abadi consistency latency', 0],
   ['Google SRE Book — service level objectives', 'https://sre.google/sre-book/service-level-objectives/', 1]],

2:[['GfG — caching strategies and cache-aside', 'https://www.geeksforgeeks.org/caching-system-design-concept-for-beginners/', 1],
   ['Redis docs — eviction policies', 'https://redis.io/docs/latest/develop/reference/eviction/', 1],
   ['Facebook — Scaling Memcache at Facebook (leases, the stampede fix)', 'Scaling Memcache at Facebook NSDI paper leases', 0],
   ['Consistent hashing explained', 'https://www.geeksforgeeks.org/consistent-hashing/', 1]],

3:[['PostgreSQL docs — indexes', 'https://www.postgresql.org/docs/current/indexes.html', 1],
   ['Use The Index, Luke — how indexing actually works', 'https://use-the-index-luke.com/', 1],
   ['GfG — SQL vs NoSQL', 'https://www.geeksforgeeks.org/difference-between-sql-and-nosql/', 1],
   ['LSM-tree vs B-tree, and why write-heavy stores choose LSM', 'LSM tree vs B-tree write amplification comparison', 0]],

4:[['GfG — database sharding', 'https://www.geeksforgeeks.org/database-sharding-a-system-design-concept/', 1],
   ['Jepsen — what your database actually guarantees under partition', 'https://jepsen.io/analyses', 1],
   ['Discord — how they moved trillions of messages to ScyllaDB', 'Discord trillions of messages ScyllaDB blog', 0],
   ['Instagram — sharding IDs at scale', 'Instagram engineering sharding ids at scale', 0]],

5:[['Kafka documentation — design and delivery semantics', 'https://kafka.apache.org/documentation/#design', 1],
   ['microservices.io — transactional outbox', 'https://microservices.io/patterns/data/transactional-outbox.html', 1],
   ['GfG — message queues in system design', 'https://www.geeksforgeeks.org/message-queues-system-design/', 1],
   ['Stripe — idempotency keys in the API', 'https://docs.stripe.com/api/idempotent_requests', 1]],

6:[['Kubernetes — configure liveness, readiness and startup probes', 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', 1],
   ['Kubernetes — managing resources for containers', 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/', 1],
   ['Kubernetes — zero-downtime rolling updates and pod termination', 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination', 1],
   ['Why Java pods get OOMKilled — container awareness and MaxRAMPercentage', 'JVM container aware MaxRAMPercentage OOMKilled kubernetes', 0]],

7:[['GfG — design a URL shortening service', 'https://www.geeksforgeeks.org/system-design-url-shortening-service/', 1],
   ['System Design Primer — Pastebin walkthrough', 'https://github.com/donnemartin/system-design-primer#design-pastebincom-or-bitly', 1],
   ['Instagram — generating unique ids without a central counter', 'Instagram sharding and ids snowflake style generation', 0]],

8:[['GfG — designing a rate limiter', 'https://www.geeksforgeeks.org/system-design-of-rate-limiter/', 1],
   ['Stripe — scaling your API with rate limiters', 'https://stripe.com/blog/rate-limiters', 1],
   ['Cloudflare — how they count requests at the edge', 'Cloudflare sliding window rate limiting blog', 0]],

9:[['System Design Primer — design Twitter timeline and search', 'https://github.com/donnemartin/system-design-primer#design-the-twitter-timeline-and-search', 1],
   ['GfG — design a news feed system', 'https://www.geeksforgeeks.org/design-a-news-feed-system/', 1],
   ['Twitter — the fan-out problem and celebrity accounts', 'Twitter timeline fanout celebrity problem engineering blog', 0]],

10:[['GfG — design a chat application like WhatsApp', 'https://www.geeksforgeeks.org/designing-whatsapp-messenger-system-design/', 1],
    ['Discord — storing billions of messages', 'Discord how we store billions of messages Cassandra', 0],
    ['WebSockets vs long polling vs SSE', 'https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/', 1]],

11:[['Martin Fowler — event sourcing and the audit log', 'https://martinfowler.com/eaaDev/EventSourcing.html', 1],
    ['Stripe — idempotent requests', 'https://docs.stripe.com/api/idempotent_requests', 1],
    ['Double-entry bookkeeping for engineers', 'double entry ledger design for software engineers immutable', 0],
    ['microservices.io — saga pattern', 'https://microservices.io/patterns/data/saga.html', 1]],

12:[['microservices.io — saga and compensating transactions', 'https://microservices.io/patterns/data/saga.html', 1],
    ['GfG — design an e-commerce system like Amazon', 'https://www.geeksforgeeks.org/design-amazon-system-design/', 1],
    ['Handling inventory reservations and oversell', 'inventory reservation TTL hold oversell design', 0]],

13:[['GfG — design a search autocomplete system', 'https://www.geeksforgeeks.org/design-a-typeahead-system/', 1],
    ['Elasticsearch — inverted index and relevance', 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', 1],
    ['Designing a notification service with per-user preferences', 'notification service design fanout preferences dedup', 0]],

14:[['Uber H3 — the hexagonal geospatial index', 'https://h3geo.org/docs/', 1],
    ['Google S2 geometry', 'http://s2geometry.io/', 1],
    ['GfG — design Uber / ride-sharing', 'https://www.geeksforgeeks.org/system-design-of-uber-app-uber-system-architecture/', 1],
    ['Uber — real-time dispatch architecture', 'Uber engineering blog marketplace dispatch real time matching', 0]],

15:[['Prometheus — overview and data model', 'https://prometheus.io/docs/introduction/overview/', 1],
    ['Google SRE Book — monitoring distributed systems', 'https://sre.google/sre-book/monitoring-distributed-systems/', 1],
    ['Facebook Gorilla — in-memory time series compression', 'Gorilla fast scalable in-memory time series database paper', 0],
    ['OpenTelemetry — traces, metrics, logs', 'https://opentelemetry.io/docs/concepts/signals/', 1]],

16:[['Netflix Open Connect — the CDN they built themselves', 'https://openconnect.netflix.com/en/', 1],
    ['GfG — design a video streaming platform like YouTube', 'https://www.geeksforgeeks.org/system-design-netflix-a-complete-architecture/', 1],
    ['HLS and adaptive bitrate streaming explained', 'HTTP live streaming HLS adaptive bitrate segments manifest', 0]],

17:[['microservices.io — saga pattern', 'https://microservices.io/patterns/data/saga.html', 1],
    ['microservices.io — transactional outbox', 'https://microservices.io/patterns/data/transactional-outbox.html', 1],
    ['Martin Fowler — CQRS', 'https://martinfowler.com/bliki/CQRS.html', 1],
    ['Why two-phase commit is avoided in microservices', 'two phase commit vs saga availability coordinator failure', 0]],

18:[['AWS — disaster recovery strategies and RPO/RTO', 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html', 1],
    ['Jepsen — partition behaviour in real systems', 'https://jepsen.io/analyses', 1],
    ['GfG — multi-region architecture and data residency', 'https://www.geeksforgeeks.org/multi-region-architecture-system-design/', 1],
    ['Conflict-free replicated data types (CRDTs), gently', 'CRDT introduction conflict free replicated data types', 0]],

19:[['System Design Primer — the full problem list', 'https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions', 1],
    ['High Scalability — real architectures to steal from', 'http://highscalability.com/', 1]],

20:[['System Design Primer — the full problem list', 'https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions', 1],
    ['ByteByteGo — system design newsletter archive', 'https://blog.bytebytego.com/', 1]],

21:[['Google SRE Book — the whole thing is free online', 'https://sre.google/books/', 1]],

22:[['Martin Fowler — Patterns of Distributed Systems (for the final sweep)', 'https://martinfowler.com/articles/patterns-of-distributed-systems/', 1]]
};

PLAN.techRead = {
java:[['Baeldung — Java collections', 'https://www.baeldung.com/java-collections', 1],
      ['GfG — HashMap internal working', 'https://www.geeksforgeeks.org/internal-working-of-hashmap-java/', 1],
      ['Oracle — HotSpot garbage collection tuning', 'https://docs.oracle.com/en/java/javase/21/gctuning/', 1]],
modern:[['Baeldung — the Java 8 Stream API', 'https://www.baeldung.com/java-8-streams', 1],
        ['Oracle — records', 'https://docs.oracle.com/en/java/javase/21/language/records.html', 1],
        ['GfG — Optional class in Java', 'https://www.geeksforgeeks.org/java-8-optional-class/', 1]],
conc:[['Java Concurrency in Practice (the standard reference)', 'Java Concurrency in Practice Goetz happens-before', 0],
      ['Baeldung — the Java memory model and volatile', 'https://www.baeldung.com/java-volatile', 1],
      ['GfG — thread pools and ExecutorService', 'https://www.geeksforgeeks.org/thread-pools-java/', 1],
      ['Baeldung — CompletableFuture guide', 'https://www.baeldung.com/java-completablefuture', 1]],
spring:[['Spring Framework — the IoC container', 'https://docs.spring.io/spring-framework/reference/core/beans.html', 1],
        ['Spring — declarative transaction management', 'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html', 1],
        ['Baeldung — why @Transactional self-invocation fails', 'https://www.baeldung.com/spring-transactional-propagation-isolation', 1]],
boot:[['Spring Boot — externalized configuration', 'https://docs.spring.io/spring-boot/reference/features/external-config.html', 1],
      ['Spring Boot — Actuator endpoints', 'https://docs.spring.io/spring-boot/reference/actuator/endpoints.html', 1],
      ['Spring Boot — graceful shutdown', 'https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html', 1]],
events:[['Spring Framework — application events', 'https://docs.spring.io/spring-framework/reference/core/beans/context-introduction.html#context-functionality-events', 1],
        ['Baeldung — Spring events and @TransactionalEventListener', 'https://www.baeldung.com/spring-events', 1],
        ['Baeldung — @Async in Spring', 'https://www.baeldung.com/spring-async', 1],
        ['Transactional outbox in Spring Boot', 'transactional outbox pattern spring boot implementation', 0]],
jpa:[['Vlad Mihalcea — the best JPA/Hibernate writing there is', 'https://vladmihalcea.com/tutorials/hibernate/', 1],
     ['Baeldung — the N+1 problem and how to fix it', 'https://www.baeldung.com/spring-data-jpa-n-plus-1', 1],
     ['Why you should disable open-in-view', 'Vlad Mihalcea open session in view anti-pattern', 0],
     ['Hibernate — fetching strategies', 'https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#fetching', 1]],
pg:[['PostgreSQL — using EXPLAIN', 'https://www.postgresql.org/docs/current/using-explain.html', 1],
    ['PostgreSQL — transaction isolation', 'https://www.postgresql.org/docs/current/transaction-iso.html', 1],
    ['Use The Index, Luke — index column order', 'https://use-the-index-luke.com/sql/where-clause/the-equals-operator/concatenated-keys', 1],
    ['PostgreSQL — routine vacuuming and bloat', 'https://www.postgresql.org/docs/current/routine-vacuuming.html', 1]],
api:[['RFC 7807 / RFC 9457 — problem details for HTTP APIs', 'https://www.rfc-editor.org/rfc/rfc9457.html', 1],
     ['Stripe — idempotent requests', 'https://docs.stripe.com/api/idempotent_requests', 1],
     ['OAuth 2.0 — authorization code flow with PKCE', 'https://oauth.net/2/pkce/', 1],
     ['AWS — exponential backoff and jitter', 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', 1]],
kafka:[['Kafka — the official design document', 'https://kafka.apache.org/documentation/#design', 1],
       ['Confluent — consumer group rebalancing explained', 'https://www.confluent.io/blog/cooperative-rebalancing-in-kafka-streams-consumer-ksqldb/', 1],
       ['Spring for Apache Kafka reference', 'https://docs.spring.io/spring-kafka/reference/', 1],
       ['Exactly-once semantics in Kafka, and its limits', 'Kafka exactly once semantics transactions idempotent producer', 0]],
micro:[['Martin Fowler — MonolithFirst', 'https://martinfowler.com/bliki/MonolithFirst.html', 1],
       ['Martin Fowler — the strangler fig application', 'https://martinfowler.com/bliki/StranglerFigApplication.html', 1],
       ['Resilience4j documentation', 'https://resilience4j.readme.io/docs/getting-started', 1],
       ['Release It! — circuit breakers, bulkheads and timeouts', 'Release It Nygard stability patterns bulkhead circuit breaker', 0]],
k8s:[['Kubernetes — probes', 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', 1],
     ['Kubernetes — resource requests and limits', 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/', 1],
     ['Docker — multi-stage builds', 'https://docs.docker.com/build/building/multi-stage/', 1],
     ['Kubernetes — pod termination and preStop', 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination', 1]],
obs:[['Google SRE Book — monitoring distributed systems', 'https://sre.google/sre-book/monitoring-distributed-systems/', 1],
     ['Testcontainers for Java', 'https://java.testcontainers.org/', 1],
     ['OpenTelemetry — signals', 'https://opentelemetry.io/docs/concepts/signals/', 1],
     ['Why H2 is a bad stand-in for Postgres in tests', 'H2 in memory database vs Testcontainers postgres dialect differences', 0]]
};


/* ============================================== CONCURRENCY PRACTICE ===
   Concurrency is asked as CODE at tier 1 (JPM, Amex, Goldman) and as a
   follow-up on design problems everywhere else. Reading about volatile does
   not survive "write me a bounded blocking queue".

   Keyed by tech module id so other modules can take problem sets later.
   Row: [lc, name, difficulty, note]  ·  lc null = no LeetCode equivalent,
   so the row links to a search instead.                                  */

PLAN.techProblems = {

conc: {
 intro:'LeetCode has a small, unloved Concurrency section that is exactly right for this — nine problems that force you to use wait/notify, semaphores and CountDownLatch correctly. Do all nine; they take an evening each at most. Then the classic implementations, which are what tier-1 interviews actually ask you to write on a whiteboard.',
 groups:[

  ['LeetCode · the Concurrency section — do all nine',
   'Small problems, but they will not compile until your synchronisation is genuinely correct. Solve each one twice: once with synchronized/wait/notify, once with a java.util.concurrent primitive. The comparison is the lesson.',
   [
    [1114,'Print in Order','E','Three threads, forced order. Start here. wait/notify first, then CountDownLatch — the second version should be half the length.'],
    [1115,'Print FooBar Alternately','M','Two threads alternating. The classic wait/notify ping-pong, or two Semaphores. Watch for the lost-wakeup bug.'],
    [1116,'Print Zero Even Odd','M','Three threads, a cycle rather than a pair. Semaphores make this clean; wait/notify with one lock gets ugly fast.'],
    [1117,'Building H2O','M','A barrier problem: two H for every O. Semaphore plus CyclicBarrier is the intended shape.'],
    [1195,'Fizz Buzz Multithreaded','M','Four threads on one counter. Good practice at deciding what the shared state actually is.'],
    [1226,'The Dining Philosophers','M','THE deadlock problem. Solve it three ways: global lock ordering, an arbitrator/semaphore limiting to n-1 diners, and tryLock with timeout. Be able to explain which Coffman condition each one breaks.'],
    [1188,'Design Bounded Blocking Queue','M','PREMIUM. The single most-asked concurrency implementation in real interviews. If you can only do one from this list, do this — and see the classics section below.'],
    [1242,'Web Crawler Multithreaded','M','PREMIUM. An ExecutorService plus a concurrent visited-set. The realistic one: a thread pool, not raw threads.'],
    [1279,'Traffic Light Controlled Intersection','E','PREMIUM. Simple mutual exclusion. Fine to skip if you cannot access it.']
   ]],

  ['Classic implementations — no LeetCode equivalent, and asked constantly',
   'These are whiteboard questions at JP Morgan, Amex, Goldman and most finance-adjacent loops. Write each from a blank file, then write a test that actually exercises the race with a CountDownLatch and 50 threads.',
   [
    [null,'Bounded blocking queue with wait/notify','M','put() waits while full, take() waits while empty. Must use while(...) wait() not if — spurious wakeups are the whole point. Then rewrite with ReentrantLock and two Conditions (notFull, notEmpty) and say why two conditions beat notifyAll.'],
    [null,'Producer-consumer with a bounded queue','M','The application of the above. Say out loud that the bound IS the backpressure mechanism.'],
    [null,'Readers-writers lock','H','Many readers or one writer. Then the follow-up nobody prepares: is it reader-preferring or writer-preferring, and which one starves? Compare against ReentrantReadWriteLock.'],
    [null,'A simple fixed thread pool','H','A BlockingQueue plus N worker threads looping on take(). Shows you understand what ExecutorService actually is. Follow-up: how does shutdown() differ from shutdownNow()?'],
    [null,'Implement a CountDownLatch from scratch','M','Around 15 lines with wait/notifyAll. Proves you understand the primitive rather than just calling it.'],
    [null,'Implement a Semaphore from scratch','M','Same idea, with permits. Then: why is acquire() in a while loop?'],
    [null,'Thread-safe singleton','E','Enum, holder idiom, and double-checked locking. Be ready to explain why DCL is BROKEN without volatile — the reference can be published before the constructor finishes.'],
    [null,'Reproduce a deadlock, then fix it','M','Two accounts, two threads, transfer in opposite directions. Fix by global lock ordering on the account id, then again with tryLock and timeout. Find it in a thread dump — jstack prints "Found one Java-level deadlock" explicitly.'],
    [null,'Thread-safe counter, three ways','E','synchronized, then AtomicInteger with a CAS loop, then LongAdder. Benchmark them under contention and be able to say when LongAdder wins.'],
    [null,'Rate limiter: token bucket, thread-safe','M','Lazy refill on access. Lock per bucket, never one global lock. This one bridges straight into the system design session.'],
    [null,'Print N numbers with N threads in order','M','Generalises 1114. A single lock plus a turn variable, or an array of Semaphores.'],
    [null,'Async fan-out with CompletableFuture','M','Ten remote calls in parallel, collect results, with a per-call timeout and fallback. Pass your OWN executor — never the common ForkJoinPool for IO.']
   ]],

  ['Design problems where concurrency IS the question',
   'These appear elsewhere in this sheet as design problems. Re-solve them here with thread safety as the primary requirement, because that is how the follow-up arrives in a real round.',
   [
    [146,'LRU Cache — now make it thread-safe','M','The interesting part: get() mutates the recency list, so a read is a write and it cannot be lock-free. Answer in three levels — global lock, segmented, then approximate LRU with read buffering (what Caffeine does).'],
    [1188,'Bounded blocking queue','M','PREMIUM. Listed twice on purpose. It is both a LeetCode problem and the classic whiteboard implementation.'],
    [362,'Design Hit Counter','M','PREMIUM. Add the concurrency follow-up yourself: many threads recording hits into time buckets.'],
    [359,'Logger Rate Limiter','E','PREMIUM. Make the message map concurrent, then handle the memory leak when messages are never evicted.'],
    [1279,'Traffic Light Controlled Intersection','E','PREMIUM. Mutual exclusion in its simplest form.'],
    [155,'Min Stack — make it thread-safe','E','Deceptive. Two structures must stay consistent, so per-method synchronized is not enough for compound operations.'],
    [295,'Find Median from Data Stream — concurrent','H','Two heaps that must be rebalanced atomically. A good test of where you put the lock.']
   ]]
 ],
 drill:[
  'Write a test that actually races. A CountDownLatch, 50 threads, all released at once, then assert the invariant. A concurrency implementation with no such test is unverified.',
  'Solve each problem twice — once with synchronized/wait/notify, once with java.util.concurrent. Interviewers ask "could you do that without synchronized?"',
  'Always use while(condition) wait(), never if(condition) wait(). Spurious wakeups are real and this is checked.',
  'Say where the lock is scoped. "Per bucket, not per limiter" or "per spot, not per lot" is the sentence that separates a correct answer from a good one.',
  'Run with -XX:+PrintCompilation or a thread dump at least once, so "how would you diagnose it in production" is not hypothetical.'
 ]
}

};

/* correct slugs for the LeetCode concurrency section */
PLAN.lcSlug[1114] = 'print-in-order';
PLAN.lcSlug[1115] = 'print-foobar-alternately';
PLAN.lcSlug[1116] = 'print-zero-even-odd';
PLAN.lcSlug[1117] = 'building-h2o';
PLAN.lcSlug[1188] = 'design-bounded-blocking-queue';
PLAN.lcSlug[1195] = 'fizz-buzz-multithreaded';
PLAN.lcSlug[1226] = 'the-dining-philosophers';
PLAN.lcSlug[1242] = 'web-crawler-multithreaded';
PLAN.lcSlug[1279] = 'traffic-light-controlled-intersection';
PLAN.lcSlug[155]  = 'min-stack';
PLAN.lcSlug[295]  = 'find-median-from-data-stream';

/* GfG names these differently where they exist at all */
PLAN.gfgName[1114] = 'Print in order using threads';
PLAN.gfgName[1226] = 'Dining Philosophers problem';
PLAN.gfgName[1188] = 'Producer Consumer bounded buffer';
PLAN.gfgName[1117] = 'Barrier synchronization';


/* ================================================================ METHOD ===
   For problems you have never seen.

   Everything else in this repo teaches machinery through named problems.
   That is necessary and it is not sufficient: real rounds hand you a system
   nobody has written a blog post about. This section is the procedure for
   that case - decomposition, altitude control, a primitive catalogue, a
   generative failure loop, and a bank of prompts with no solutions.

   The method is teachable. The fluency is not - that comes from running
   unseen prompts under a clock and scoring yourself. Ten of those beats the
   next fifty named problems.                                              */

PLAN.method = {};

/* ---------------------------------------------------------- 1. ALTITUDE --- */
PLAN.method.altitude = {
 intro:'The most common way to lose a design round is to answer at the wrong level of abstraction. It is also the cheapest to prevent — one sentence in the first minute.',
 evidence:'Two real Amazon rounds, the same error in opposite directions. In an LLD round on audio buffers, the candidate drifted UP into high-level design, spent the round there, and ran out of time. In an HLD round on Alexa broadcasting, the candidate started DOWN in entity models and the interviewer had to redirect him. Neither candidate lacked knowledge. Both spent the round at the wrong altitude.',
 levels:[
  ['HLD — system design','Boxes, arrows, data flow, storage choices, scale numbers, failure modes.','"Design YouTube." "How would you scale this?" "Walk me through the flow."','Naming a class. Writing a method signature. Discussing an interface.'],
  ['LLD — object design','Classes, interfaces, relationships, method signatures, patterns, thread safety.','"Design a parking lot." "Write production-ready classes." "What are the entities?"','Choosing between Kafka and SQS. Sharding. CDN placement.'],
  ['Code','Compiling syntax, real method bodies, tests.','"Write it out." "Implement this on paper." A machine-coding round.','Drawing architecture diagrams.']
 ],
 signals:[
  ['They said "design a SYSTEM" or named a product','HLD','YouTube, Uber, a notification service. Start with actors and the request path.'],
  ['They said "design a CLASS / classes / objects"','LLD','Parking lot, elevator, a logging framework.'],
  ['They handed you paper, or an IDE','Code','Production syntax is expected. Write, do not narrate.'],
  ['They mentioned SCALE, QPS, users, regions','HLD','Numbers in the prompt are an altitude marker.'],
  ['They mentioned EXTENSIBILITY, "add a new type later"','LLD','That is an Open/Closed hint, which lives at object level.'],
  ['They gave you a list of requirements on paper','LLD or code','The scoping phase is done. Your job is to read precisely, not to elicit.'],
  ['The problem is a real thing their team is building','Either — ASK','No prep-list shape to infer from. This is exactly when the check below matters most.']
 ],
 theCheck:'"Before I start — would you like me to begin with the high-level flow and components, or go straight into the class design?" Ask it in the first minute. It costs ten seconds, it is never penalised, and it prevents the single most expensive mistake in the round.',
 recovery:[
  ['You are too LOW and they want HLD','Stop mid-sentence. "Let me step back up — here is the end-to-end flow, and I will come back to the data model." Then draw the request path. Do not apologise at length; one sentence and move.'],
  ['You are too HIGH and they want LLD','"Let me get concrete." Name the three or four core classes immediately and write one real method. Concreteness is the fastest way back down.'],
  ['They redirect you','Take it as information, not failure. It happened to the Alexa candidate and he passed. Redirection means they are still invested in the conversation.'],
  ['You genuinely cannot tell','Ask again mid-round. "Is this the level of detail you want, or should I go deeper?" Checking twice reads as calibration, not confusion.']
 ],
 drift:'The specific trap in an LLD round: HLD feels productive. Discussing sharding and queues generates a lot of words and zero scoreable LLD signal. If you notice yourself talking about infrastructure in a class-design round, you are drifting. Say "that is the deployment story — let me get back to the classes" and descend.'
};

/* ----------------------------------------------------- 2. DECOMPOSITION --- */
PLAN.method.decompose = {
 intro:'A procedure that turns a prompt you have never seen into parts you have. It is deliberately mechanical — under pressure you want a checklist, not inspiration.',
 hld:[
  ['1. Actors','Who or what touches this system? End user, admin, a third-party service, a device, another internal service, a scheduled job. Write them down the left of the board. Most candidates skip this and it is where the interesting requirements hide.'],
  ['2. Nouns → entities','Pull the nouns out of the prompt. "Spotify wants to notify Alexa users about a feature" gives you: Partner, Notification, User, Device, Feature. That is your data model before you have thought about storage.'],
  ['3. Verbs → operations','Pull the verbs. Publish, deliver, acknowledge, dismiss, retry. Each verb becomes an API call or an event.'],
  ['4. Classify every operation','For each verb ask four things: read or write? synchronous or asynchronous? who initiates it? does the caller need the result? Those four answers pick your primitives for you — a write nobody waits for is a queue, a read everyone repeats is a cache.'],
  ['5. Draw ONE request, end to end','A single user, a single action, the happy path, no failure, no scale. Client → edge → service → store → response. Get agreement on this before anything else. The Alexa candidate did exactly this and the interviewer confirmed the direction before pushing further.'],
  ['6. Now add scale','Where does one become a million? Apply the estimate. Only the components on the hot path need to scale, and saying which ones do NOT is scored.'],
  ['7. Now add failure','Run the failure generator over every box and every arrow. This is where the round actually happens.'],
  ['8. Now add the awkward requirement','Multi-region, GDPR, audit, cost. Usually the last ten minutes.']
 ],
 lld:[
  ['1. Read the requirements PRECISELY','If they were handed to you on paper, the eliciting phase is over. Number them. Find the two that are ambiguous and confirm your reading of those specifically. This is a different opening from the usual "ask clarifying questions" and it catches people out.'],
  ['2. Nouns → classes, verbs → methods','Do it out loud so the interviewer sees the derivation. Enums for every closed set.'],
  ['3. Relationships and cardinality','Draw the lines and label them 1..*, 0..1. Cardinality mistakes are visible and cheap to avoid.'],
  ['4. What VARIES? → interface','The single highest-value question in LLD. Pricing, scheduling, matching, formatting, notification channel. Each axis of change gets an interface; nothing else does.'],
  ['5. What is SHARED and CONTENDED? → concurrency','Which object do two actors reach for at the same time? That object is your unit of locking, and naming it before being asked is the Amazon differentiator.'],
  ['6. Pick the ONE flow that proves the design','Not every class. The flow that exercises the interesting part: park a vehicle, mix a playlist, dispense a note. Write it with real method bodies.'],
  ['7. Show one extension','"Here is how a new X slots in — one class, no edits." Highest-scoring thirty seconds of the round.']
 ],
 unknownShape:'When the domain is unfamiliar, do steps 1 to 3 anyway. You do not need to understand audio engineering to notice that a frame is a message, a stage is a processing step, X frames per second is a throughput requirement, and "must not drop" is a durability constraint. The translation IS the work.'
};

/* ------------------------------------------------------- 3. PRIMITIVES --- */
PLAN.method.primitives = {
 intro:'Every system you will be asked to design is an assembly of about twenty parts. If you know what each part is FOR, what it costs, and when it is the wrong choice, then an unheard-of system is an assembly problem rather than a recall problem. This is the system-design equivalent of the DSA pattern table.',
 note:'Learn the "wrong choice" column as hard as the "for" column. Anyone can add a cache; the signal is knowing when not to.',
 rows:[
  ['Client / device','Where the request starts, and the only place that knows the user is offline.','Mobile, browser, an IoT device, another service.','Assuming it is always connected. Offline is a first-class state, not an error.','Retries, local cache, staleness.'],
  ['DNS + load balancer','Spreads traffic across identical instances and removes dead ones.','Any horizontally scaled tier.','Treating it as a bottleneck solution. An LB does not fix a slow database.','An extra hop; health-check config.'],
  ['API gateway','One edge for auth, rate limiting, routing and request shaping.','More than two or three public services.','Letting business logic accumulate in it — that becomes a distributed monolith.','A single point of failure to make redundant.'],
  ['Stateless service','Does the work. Scales by adding copies because it holds nothing.','Almost every request path.','Putting session state in it, which destroys the property that makes it scalable.','Nothing much. This is the cheap part.'],
  ['Cache','Serves repeated reads without touching the store.','Read-heavy, ratio above roughly 10:1.','Write-heavy workloads, or data that must never be stale. A cache in front of an in-memory store is usually redundant.','Invalidation, stampedes, one more thing to be down.'],
  ['Relational DB','Transactions, joins, constraints, and queries you did not anticipate.','Default choice. Money, orders, anything with invariants across rows.','Genuinely schemaless data, or write volume past one machine.','Vertical ceiling; schema migrations.'],
  ['Key-value store','O(1) access by exact key, at very high throughput.','Sessions, feature flags, counters, feed rows.','Anything needing a range scan or a join.','No query flexibility at all.'],
  ['Wide-column store','Huge write volume with range reads inside a partition.','Chat messages, time series, event history.','Small datasets, or anything needing ad-hoc queries.','Operations; you must design the partition key up front.'],
  ['Search index','Full text, relevance ranking, faceting.','Search boxes, log search, typeahead.','As a system of record. It is a derived view and it will drift.','Index lag; a rebuild path you must own.'],
  ['Object store','Cheap durable storage for large opaque blobs.','Images, video, backups, uploads.','Small structured records, or anything you query by content.','Latency; no transactions.'],
  ['CDN / edge','Serves bytes from near the user.','Static assets, video, anything read far more than written.','Personalised or authorised content, unless you sign URLs.','Cache invalidation across a global fleet.'],
  ['Message queue','Hands work to a worker so the caller does not wait.','Email, image processing, anything slow and non-interactive.','When the caller needs the answer now, or when several independent consumers need the same message.','At-least-once delivery, so consumers must be idempotent.'],
  ['Log / stream','A durable, replayable, ordered-per-key record that many consumers can read independently.','Event-driven architectures, audit, CDC, anything needing replay.','Simple point-to-point work handoff — a queue is simpler and cheaper.','Operational weight; a rebalance model to reason about.'],
  ['Worker / consumer','Executes queued work, scaled independently of the request path.','Everything behind a queue or a stream.','Work that must complete inside the request.','Consumer lag becomes a thing you monitor.'],
  ['Scheduler / cron','Runs something on a clock.','Digests, cleanup, reconciliation, expiry sweeps.','Assuming one instance runs it. In a three-pod deployment it fires three times.','Needs a distributed lock or a leader.'],
  ['Push / notification gateway','Reaches a device you do not control and may not be online.','Mobile push, email, SMS, a device like Alexa.','Anything requiring a guaranteed immediate response.','Offline devices, per-channel failure, dedup on reconnect.'],
  ['Registry','Maps an identity to a location. Which node holds this connection, this shard, this service.','WebSockets, sharded state, service discovery.','Small static topologies where DNS is enough.','Becomes a hot dependency; needs TTLs.'],
  ['Geo index','Answers "what is near this point" without scanning everything.','Ride matching, delivery, store locators.','Non-spatial lookups. Do not reach for it because coordinates exist.','Boundary cases; cell size tuning.'],
  ['Append-only ledger','An immutable record where corrections are new entries, never updates.','Money, audit, anything needing "why is this number what it is".','High-churn mutable state.','Storage growth; balances must be derived or snapshotted.'],
  ['Coordination service','Distributed locks, leader election, config that must be consistent.','Exactly-once scheduling, primary election, shared config.','Anything on the hot path — it is a consensus system and it is slow.','A hard dependency you must keep alive.'],
  ['Rate limiter / throttle','Protects a downstream from more load than it can take.','Public APIs, expensive endpoints, any third-party dependency.','Internal calls where backpressure would be better.','A hot-path round trip, and a failure mode of its own.'],
  ['Analytics / warehouse','Answers questions across the whole dataset, slowly, without touching production.','Reporting, ML features, business questions.','Anything a user waits for.','Hours of lag; a separate pipeline to maintain.']
 ]
};

/* ---------------------------------------------- 4. FAILURE GENERATOR --- */
PLAN.method.failures = {
 intro:'Do not memorise the failure modes of each design. Run this loop over any system, including one you have never seen, and it produces them. This is what turns "what if the device is offline?" from a question you were lucky to have prepared into one you would have raised yourself.',
 how:'Take every BOX and every ARROW in your diagram. For each one, walk the eleven questions. Most produce nothing; two or three produce the discussion that decides the round. Do this out loud — narrating the sweep is itself the signal.',
 loop:[
  ['DOWN','What if this component is completely unavailable?','Fail open or fail closed? Is there a fallback? Does the outage cascade or stop here?'],
  ['SLOW','What if it responds, but takes 30 seconds?','A timeout, or your threads pile up and you fail with it. Slowness is worse than failure because nothing trips.'],
  ['WRONG','What if it returns a plausible but incorrect answer?','Validation at the boundary. Do you trust a downstream blindly?'],
  ['LOST','What if the message never arrives?','Retry, at-least-once delivery, a reconciliation job. Or accept the loss and say so.'],
  ['DUPLICATED','What if it arrives twice?','Idempotency key. At-least-once delivery makes this certain, not hypothetical.'],
  ['OUT OF ORDER','What if message 2 arrives before message 1?','Sequence numbers, per-key ordering, or a design that does not care. Say which.'],
  ['RETRIED','What if the client sends it again because it timed out?','This is the duplicate case from the other side, and it is where double-charges live.'],
  ['OFFLINE','What if the recipient is not reachable at all right now?','A whole family — see below. This is the question that opened the Alexa round.'],
  ['CONCURRENT','What if two of these happen at the same instant?','The race. Lost update, double-booking, oversell. Name the atomic operation that closes it.'],
  ['10x / 100x','What if volume multiplies?','Which component saturates FIRST? Naming the first bottleneck is worth more than scaling everything.'],
  ['ELSEWHERE','What if the user, the data or the service is in another region or timezone?','Latency, data residency, clock skew, daylight saving.']
 ],
 offlineFamily:{
  intro:'"What happens when the device is offline" is not one question, it is seven. Knowing it as a family means you can generate the whole discussion rather than answering the one part they asked.',
  rows:[
   ['Store and forward','Where does the undelivered message live, and for how long?'],
   ['TTL / expiry','Is this still worth delivering in three weeks? A feature announcement usually is not. Say what expires and what does not.'],
   ['Delivery receipt','How do you know it arrived? Sent, delivered and read are three different events.'],
   ['Dedup on reconnect','The device reconnects and you replay. Does it now show the notification twice?'],
   ['Ordering on reconnect','Five queued messages arrive at once. Does order matter, and can you preserve it?'],
   ['Backlog cap','A device offline for a month. Do you keep everything, the last N, or only the latest per topic?'],
   ['Fallback channel','If push fails, do you email? Should you? That is a product decision, not a technical one.']
  ]
 },
 pickTwo:'You will not have time for eleven questions across every box. Pick the two or three that are genuinely interesting for THIS system and go deep on those. Announcing the sweep and then choosing — "the interesting failures here are the offline device and the duplicate delivery, let me take those" — shows judgement as well as coverage.'
};

/* ------------------------------------------------------ 5. AMBIGUITY --- */
PLAN.method.ambiguity = {
 intro:'The first three minutes of an unfamiliar problem. Confusion here is normal and not disqualifying — the Alexa candidate was confused for several minutes by the framing and still passed. What matters is having a procedure instead of freezing.',
 steps:[
  ['1. Restate it in your own words','"So a third party like Spotify wants to push an announcement to Alexa users who have their skill enabled — is that right?" This catches a misreading in ten seconds instead of twenty minutes.'],
  ['2. Ask for ONE concrete example, end to end','"Can you walk me through a single user experiencing this once?" The single most useful question in an ambiguous round. It converts an abstract prompt into a trace you can design against.'],
  ['3. Establish scope explicitly','"Are we building the publishing side, the delivery side, or both?" Write the boundary on the board. Anything outside it is now their choice, not your omission.'],
  ['4. Name your assumptions out loud','"I am going to assume the device registers once and we know its identity — stop me if that is wrong." Assumptions stated are free; assumptions hidden are penalised.'],
  ['5. Say what you are doing','"Let me take a minute to make sure I understand the problem before I design anything." Silence reads as stuck; narrated thinking reads as deliberate.'],
  ['6. Start with the happy path anyway','If it is still fuzzy after three minutes, design the simplest version that could work and let them correct you. A concrete wrong answer generates more useful feedback than continued questioning.']
 ],
 dontDo:[
  'Do not ask ten questions in a row. Two or three, then start designing. Interrogation is not clarification.',
  'Do not go silent. Thinking time is fine, but say you are thinking.',
  'Do not pretend to recognise a problem you do not. It falls apart in the follow-ups.',
  'Do not design for requirements they never gave you. Building a multi-region system when nobody mentioned regions is scope you invented and now have to defend.'
 ],
 whenGivenRequirements:'If they hand you a printed list — as in the Amazon playlist round with ten requirements — the eliciting phase is over and the test has changed. Number them. Read them twice. Find the two that are ambiguous or that conflict, and confirm only those. Then design against the list and check items off out loud as you cover them. Missing requirement seven because you never re-read the sheet is the failure mode here.'
};

/* --------------------------------------------------- 6. UNKNOWN DOMAIN --- */
PLAN.method.domain = {
 intro:'"Design a system that handles audio buffers across stages at X frames per second." You do not know audio engineering. You do not need to. What you need is the shape.',
 translate:[
  ['What comes IN, and at what rate?','A frame every 1/X second. That is a message and a throughput requirement.'],
  ['What goes OUT?','A processed frame, presumably in order. That is an output contract.'],
  ['What sits between?','Stages. That is a pipeline of processing steps.'],
  ['What must not happen?','Dropping a frame, or reordering. That is durability and ordering.'],
  ['What is the constraint?','Real time. A frame late is a frame lost. That is a latency budget, not a throughput one.'],
  ['So what IS it?','A staged pipeline with bounded buffers between stages, backpressure when a stage falls behind, and a fixed latency budget per stage. You have practised every one of those parts.']
 ],
 script:'Say the translation OUT LOUD. "Let me map this to something I know — a frame is a message, a stage is a processing step, X per second is a throughput requirement, and not dropping frames is a durability constraint. So this is a pipeline with bounded buffers." That sentence does three things: it confirms your understanding, it invites correction early, and it demonstrates the exact skill they are testing.',
 rules:[
  'Never bluff domain knowledge. "I do not know how audio codecs work — can you tell me whether a frame is independent or depends on the previous one?" is a strong question, because the answer changes the design.',
  'Ask the question whose answer changes your design, not the question that shows you read about the domain.',
  'Domain nouns are a costume. Frame, packet, order, tick, event, message — mechanically they are the same thing until proven otherwise.',
  'If the interviewer says it is a real problem their team has, that is good news: it means there is no memorised answer and everyone is reasoning from first principles. That is a level playing field.'
 ]
};

/* ------------------------------------------------- 7. PRODUCT THINKING --- */
PLAN.method.product = {
 intro:'The Alexa interviewer asked several product-decision questions and explicitly appreciated answers given from both a technical and a product angle rather than the technically easiest one. This is scored, especially at Amazon, and almost nobody prepares for it.',
 frame:[
  ['Who is the user, and what do they experience?','Not "the system fails" — "the customer opens the app and sees a three-week-old announcement about a feature they already use."'],
  ['What is the cost of each option?','Engineering time, latency, money, complexity, and the ongoing operational burden. Name at least two dimensions.'],
  ['What would you measure to know you chose right?','Delivery rate, dismissal rate, complaint volume, opt-outs. If you cannot name the metric, you cannot claim the decision was good.'],
  ['Which is reversible?','A two-way door can be decided fast and changed later. A one-way door — a data model, a public API, an SLA — deserves more care. Using this framing is Amazon\'s own language.'],
  ['What would you ship first?','The smallest version that delivers value, and what you would learn from it.']
 ],
 examples:[
  ['"Should we deliver the notification if the device has been offline for a month?"','Technically: trivially yes, the queue holds it. Product: probably no — a stale feature announcement is noise, and noise trains users to ignore notifications. So: TTL on announcements, no TTL on transactional messages. Different classes, different policy.'],
  ['"Should a third party be able to notify every user?"','Technically: yes. Product: absolutely not — that is a spam vector and a trust problem. So: opt-in per skill, per-partner rate limits, and a review step. Raising this unprompted is a strong signal.'],
  ['"Do we guarantee delivery, or best effort?"','Ask what the message IS. A payment confirmation and a marketing announcement have opposite answers, and designing one policy for both is the actual mistake.'],
  ['"Should we retry a failed push forever?"','No. Retries cost money and annoy users. Bounded retry, then drop, and count the drops so you can see whether it matters.']
 ],
 tell:'The tell that you are answering technically-only: your answer contains no user in it. If you can give the whole answer without mentioning a person, you have answered half the question.'
};

/* ------------------------------------------------------- 8. BLIND BANK --- */
PLAN.method.blind = {
 intro:'Sixty prompts with NO solutions, deliberately. Solutions would turn this back into a list of named problems, which is the thing that does not transfer. Pick one blind, set 45 minutes, record yourself, then score against the rubric below.',
 rules:[
  'Pick without reading ahead. If you skim the list first you have contaminated the exercise.',
  '45 minutes, timed, recorded, out loud. Alone at a whiteboard counts.',
  'Run the method: altitude check, decompose, happy path, failure sweep, then the awkward requirement.',
  'Score yourself against the rubric before looking anything up.',
  'Then look things up — and add whatever you were missing to the primitive catalogue or the failure loop, in your own words.',
  'Ten of these beats the next fifty named problems. That is the whole argument of this section.'
 ],
 groups:[
  ['Real rounds from the wild — start here',
   'These four were actually asked. Two of them are Amazon LLD, and neither is on any prep list.',
   [
    'A third party such as Spotify wants to use Alexa to broadcast a new-feature announcement to users. Design it. [HLD]',
    'Design a system that handles audio buffers across several processing stages at X frames per second. [LLD — a real team problem]',
    'Mix songs from a DJ service and a recommendation service into one playlist, in a custom or equal proportion, with filters based on user preferences. Ten requirements, production-ready classes. [LLD, on paper]',
    'Scale a single-node key-value store to 50 million pairs at 1 million QPS, split evenly between reads and writes. [HLD]'
   ]],
  ['Devices, presence and the offline case',
   'Everything here forces the offline family. If you can only drill one group, drill this one.',
   [
    'Design firmware update rollout to 10 million IoT devices, most of which are offline most of the time.',
    'Design a smart-home system where a phone controls devices that may be unreachable.',
    'Design presence (online / away / offline) for 50 million users.',
    'Design a system that lets a doctor send a message to a patient app, guaranteed to be seen.',
    'Design offline-first sync for a mobile note-taking app, with conflict resolution.',
    'Design a car telemetry pipeline where vehicles lose connectivity in tunnels.'
   ]],
  ['Pipelines, staging and throughput',
   'The audio-buffer shape, in different costumes. Bounded buffers, backpressure, latency budgets.',
   [
    'Design a video transcoding pipeline with four processing stages and a fixed latency budget.',
    'Design a real-time bidding system that must respond within 100 milliseconds.',
    'Design a log ingestion pipeline handling 500,000 events per second.',
    'Design a system that processes sensor readings from a factory floor without dropping any.',
    'Design a live-captioning pipeline for a video call.',
    'Design an image-processing service where each upload passes through resize, watermark and virus scan.'
   ]],
  ['Matching, assignment and capacity',
   'The ride-hailing machine, reskinned. Watch for the capacity variant.',
   [
    'Assign incoming orders to delivery agents based on location and remaining capacity.',
    'Design a system matching freelancers to jobs by skill, availability and rating.',
    'Design airport gate assignment for an airline.',
    'Design a system that matches blood donors to hospitals by type, distance and urgency.',
    'Design load assignment for a fleet of warehouse robots.',
    'Design an on-call rota generator that respects holidays, time zones and fairness.'
   ]],
  ['Money, ledgers and correctness',
   'Idempotency, double-entry, sagas. JPM and Amex territory.',
   [
    'Design a system that splits a refund across three original payment methods.',
    'Design subscription billing with proration, upgrades and mid-cycle cancellation.',
    'Design a loyalty points system where points expire.',
    'Design an internal transfer system between wallets that must never lose a cent.',
    'Design a system that reconciles your ledger against a payment provider daily.',
    'Design a marketplace escrow that releases funds on delivery confirmation.'
   ]],
  ['Scarce resources and races',
   'The atomic-allocation machine. Parking, booking, inventory, all wearing different clothes.',
   [
    'Design an Amazon Locker system: couriers drop packages by size, customers collect with expiring codes.',
    'Design a system for booking shared meeting rooms across a company.',
    'Design ticket sales for an event where 100,000 people arrive at the same second.',
    'Design a system allocating GPU time on a shared research cluster.',
    'Design a library system for a university, including holds and recalls.',
    'Design campsite reservations where sites have variable date ranges.'
   ]],
  ['Trees, hierarchies and composition',
   'The composite machine.',
   [
    'Design an org chart service supporting "who reports to whom, transitively".',
    'Design a permissions system where folders inherit access from parents.',
    'Design a comment system with unlimited nesting.',
    'Design a build system that resolves a dependency graph.',
    'Design a category taxonomy for an e-commerce catalogue.'
   ]],
  ['Framework and library design',
   'Extensibility is the whole test here. Log4j is the classic.',
   [
    'Design a logging framework: levels, appenders, formatters, async writing.',
    'Design a dependency-injection container.',
    'Design a retry library with configurable backoff strategies.',
    'Design a feature-flag SDK with local evaluation and remote config.',
    'Design a validation framework for arbitrary objects.',
    'Design an ORM-lite that maps result sets to objects.'
   ]],
  ['Genuinely odd ones',
   'Chosen because they resist pattern-matching. If you can decompose these, you can decompose anything.',
   [
    'Design the system behind a hotel key card that must work when the network is down.',
    'Design a system to detect that a delivery drone has been stolen.',
    'Design the backend for a multiplayer drawing game with 100ms latency.',
    'Design a system that schedules irrigation for a farm based on weather forecasts.',
    'Design a queue-management system for a hospital emergency department.',
    'Design a system that decides when to reorder stock for 50,000 SKUs.',
    'Design the backend for an exam platform that must prevent cheating.',
    'Design a system that migrates 400 million rows between databases with zero downtime.',
    'Design a service that tells you whether a URL is safe, at browser scale.',
    'Design an elevator system for a 200-floor building with express and local cars.',
    'Design a system that detects duplicate images at upload time across 2 billion images.',
    'Design the backend for a food-ordering kiosk that works when the internet drops.'
   ]]
 ]
};

PLAN.method.rubric = {
 intro:'Score yourself out of 20 immediately after each attempt, before looking anything up. The trend across attempts matters more than any single score.',
 rows:[
  ['Altitude','2','Did you check which level they wanted in the first minute? Did you stay there?'],
  ['Restated the problem','1','In your own words, confirmed before designing.'],
  ['Concrete example','2','Did you ask for one user doing one thing end to end?'],
  ['Scope stated','1','Did you write down what is in and out, and get agreement?'],
  ['Assumptions named','1','Said out loud and invited correction.'],
  ['Actors and entities','2','Extracted before designing, not discovered halfway through.'],
  ['Happy path first','2','One request, end to end, agreed before adding anything.'],
  ['Estimation','2','Numbers out loud, peak versus average distinguished.'],
  ['Failure sweep','3','Ran the loop. Picked the two or three interesting ones and went deep.'],
  ['Concurrency / races','2','Named the contended resource and the atomic operation.'],
  ['Product angle','1','At least one answer that mentioned an actual user.'],
  ['Finished','1','Reached a coherent whole rather than a beautiful fragment.']
 ],
 bands:[
  ['16–20','You would pass this round at tier 2, probably at tier 3.'],
  ['12–15','Solid. Usually one systematic gap — find it in the row scores, it will be the same row every time.'],
  ['8–11','The method is not automatic yet. Do five more before adding new content anywhere else in this repo.'],
  ['under 8','You are pattern-matching to remembered designs. Go back to the decomposition procedure and run it mechanically, in order, even when it feels slow.']
 ],
 log:'Keep a one-line note per attempt: prompt, score, and the single lowest row. If the same row is lowest three times running, that is your actual weakness, and it is almost never "did not know enough technology".'
};

/* --------------------------------------------------------- 9. WORKED --- */
PLAN.method.worked = {
 prompt:'A third party such as Spotify wants to use Amazon Alexa to broadcast a notification to users about a newly launched feature. Design it.',
 note:'A real Amazon round. The candidate opened at the wrong altitude, was redirected, recovered, and passed. This is the method applied to it from the start.',
 beats:[
  ['0:00 — altitude check',
   '"Before I start — do you want the high-level flow and components, or the class design?"',
   'Ten seconds. In the real round the candidate began with entity models and had to be redirected to HLD. One question prevents that entirely.'],
  ['0:30 — restate',
   '"So a partner — Spotify — wants to reach Alexa users with an announcement about a new feature in their skill. Amazon is the delivery channel. Is that right?"',
   'Catches a misreading before you spend twenty minutes on it. Also surfaces the interesting word: PARTNER. A third party is not a first party, and that will matter.'],
  ['1:00 — one concrete example',
   '"Can you walk me through one user experiencing this once? Spotify publishes something, and then what does the user see and when?"',
   'The single most useful question in an ambiguous round. It converts an abstract prompt into a trace.'],
  ['2:00 — scope',
   '"Are we building the publishing side that Spotify calls, the delivery side to devices, or both? And is targeting in scope — all users, or a segment?"',
   'Write the boundary down. Everything outside it is now their decision.'],
  ['3:00 — actors and entities',
   'Actors: Partner (Spotify), Amazon platform, End user, Device. Nouns: Partner, Campaign, Notification, User, Device, Subscription. Verbs: publish, target, deliver, acknowledge, dismiss, expire.',
   'Note that "Subscription" appeared from thinking about actors — a partner may only reach users who enabled their skill. That constraint is the whole trust story and it fell out of step 1.'],
  ['4:00 — classify the operations',
   'Publish: write, asynchronous, partner-initiated, caller does not need the result. Deliver: write, async, platform-initiated, target may be unreachable. Acknowledge: write, async, device-initiated.',
   'Four questions per verb and the primitives pick themselves. "Async, caller does not wait, may fail" is a queue. "May be unreachable" is a push gateway plus store-and-forward.'],
  ['6:00 — the happy path, one request',
   'Spotify → Partner API (auth, validate, rate limit) → Campaign store → fan-out worker resolves the audience from the subscription store → per-device notification rows → push gateway → device → acknowledgement back.',
   'One line, end to end, no failure, no scale. GET AGREEMENT HERE. The real candidate did exactly this and the interviewer confirmed the direction before pushing.'],
  ['10:00 — estimate',
   '"How many Alexa users have the Spotify skill — tens of millions? If a campaign targets 50 million devices and we want it out in an hour, that is roughly 14,000 pushes per second sustained. That is the fan-out, and it is the part that has to scale."',
   'The number tells you which component is the hot one. Everything else is comparatively idle, and saying so is scored.'],
  ['13:00 — announce the failure sweep',
   '"Let me go through what can fail. The interesting ones here are the device being offline, duplicate delivery, and a partner targeting far more users than expected."',
   'Announcing the sweep, then CHOOSING, shows judgement rather than a recited checklist.'],
  ['15:00 — the offline device, in full',
   '"Offline is not one problem. Where does the undelivered notification live and for how long? Does a feature announcement still matter in three weeks — I would say no, so it needs a TTL, whereas a transactional message would not. When the device reconnects and we replay, do we dedup? Do we preserve order? If a device has been offline a month, do we deliver a backlog or only the latest per partner? And if push fails permanently, is email a fallback — that is a product question."',
   'This is the whole discussion the real interviewer wanted, generated from the offline family rather than remembered. Note the last sentence handing a product decision back.'],
  ['22:00 — duplicates and idempotency',
   '"Push delivery is at-least-once, so the device will sometimes get it twice. Each notification carries an id, the device dedups on it, and acknowledgement is idempotent so a retried ack does not double-count."',
   'Raise this before being asked. At-least-once makes duplicates certain, not hypothetical.'],
  ['26:00 — the partner problem',
   '"A third party can reach our users, so the risks are not only technical. I would opt in per skill so Spotify only reaches users who enabled it, rate-limit per partner per period, cap audience size, and put new campaign types through review. Otherwise this is a spam vector and it damages trust in the whole device."',
   'Unprompted product and trust thinking. In the real round the interviewer explicitly appreciated exactly this kind of answer.'],
  ['32:00 — scale the hot path',
   '"Fan-out is the bottleneck. Campaign publish writes one row; a worker pool expands it against the subscription index and writes per-device rows onto a stream, partitioned by device id so ordering per device holds. Consumers push. If fan-out falls behind, active devices are prioritised and inactive ones are backfilled lazily — most will not be listening in the next hour anyway."',
   'The same hybrid fan-out argument as a news feed, reused. This is what the primitive catalogue buys you.'],
  ['38:00 — what I would ship first',
   '"Version one: one partner, opt-in only, no targeting beyond skill-enabled, TTL of seven days, best-effort delivery. That gives us delivery rate and dismissal rate, and dismissal rate is what tells us whether this is useful or annoying."',
   'A ship-first answer plus the metric you would watch. Almost nobody offers this and it reads as senior.'],
  ['42:00 — close',
   '"Open questions I would want answered: whether ordering matters across partners, what the retention requirement is for delivery records, and whether there is a global cap on notifications per user per day across all partners — I suspect there should be."',
   'Ending with the questions you would ask next is stronger than trailing off. The last one is a real design insight offered as a question.']
 ],
 whatTheMethodDid:'Nothing above required knowing anything about Alexa. Altitude check, restate, one example, scope, actors, verbs, happy path, estimate, failure sweep, product angle, ship-first. The primitives — API gateway, queue, stream, worker, push gateway, registry — came from the catalogue. The offline discussion came from the failure family. The partner constraint came from listing actors in step one. That is the whole claim of this section: the procedure produces the design, so an unheard-of prompt is an assembly problem rather than a recall problem.'
};

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
