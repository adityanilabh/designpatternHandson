/* DSA — 17 sections, approaches, derivations, correctness arguments, problem-link overrides
   Moved VERBATIM from legacy/data.js — this file is content, not code.
   Edit this to change the plan; gen-sheet.js regenerates the markdown sheet
   from it, so the sheet cannot drift.

   Progress keys are content-addressed, so APPENDING to any list is safe;
   reordering within a list remaps that list's saved progress. */
/* eslint-disable */
// @ts-nocheck

const PLAN: any = {};

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


/* ==================================================== APPROACH + COST ===
   The sheet's job is recognition, but recognition without a resolution is
   just a pointer at LeetCode. Every question in blocks B and C carries the
   ACTUAL move and its cost here - one or two sentences, enough to unblock a
   section you are weak at without handing you the code.

   Keyed by section id, then by the row's LC field as a string, so the b/c
   arrays are untouched and adding a question can never re-map progress.

   In the tracker it sits behind a click in the drawer, so it does not spoil
   a problem you are about to solve.                                       */


PLAN.approach = {};


PLAN.approach.arr = {
 '1':'Hashmap of value to index. For each x, look up target-x BEFORE inserting x, so an element never pairs with itself. O(n) time, O(n) space.',
 '121':'One pass tracking the minimum price seen so far; the answer is the best of price minus that minimum. This is Kadane on the difference array without building it. O(n) time, O(1) space.',
 '53':'Kadane: cur = max(x, cur + x), and keep a running global maximum. The whole trick is that a prefix with negative sum is worth discarding rather than carrying. O(n) time, O(1) space.',
 '152':'Kadane, but track maxEnd AND minEnd at each index, because a negative times the current minimum can become the new maximum. Swap them when x is negative. O(n) time, O(1) space.',
 '238':'Two passes. Left to right filling res[i] with the prefix product; right to left multiplying by a running suffix product. The output array is not extra space by the problem definition. O(n) time, O(1) extra.',
 '169':'Boyer-Moore voting: keep a candidate and a counter, increment on a match, decrement otherwise, reset the candidate at zero. Works because the majority element survives every cancellation. O(n) time, O(1) space.',
 '229':'Boyer-Moore generalised: at most two elements can exceed n/3, so run two candidates and two counters simultaneously, then VERIFY both with a second counting pass. O(n) time, O(1) space.',
 '75':'Dutch national flag. Three pointers low, mid, high: on 0 swap to low and advance both, on 2 swap to high and do NOT advance mid, on 1 just advance mid. One pass, O(n) time, O(1) space.',
 '268':'XOR every index and every value together; pairs cancel and the missing number survives. Sum-of-first-n minus actual sum also works but can overflow. O(n) time, O(1) space.',
 '287':'Read-only plus O(1) space forces Floyd cycle detection on the functional graph i -> a[i]: phase one finds a meeting point, phase two walks one pointer from the start to find the entry, which is the duplicate. O(n) time, O(1) space.',
 '442':'Index-as-hashmap. For each x, negate a[abs(x)-1]; if it was already negative you have seen abs(x) before. Restore signs if the input must survive. O(n) time, O(1) space.',
 '448':'Same negation marking, then every index still holding a positive value corresponds to a missing number. O(n) time, O(1) space.',
 '41':'Cyclic sort: while a[i] is in [1..n] and not already in position, swap it to index a[i]-1. Then scan for the first index whose value is not i+1. The answer is always in [1..n+1]. O(n) time, O(1) space.',
 '88':'Fill BACKWARDS from index m+n-1, taking the larger tail element each time. Going forwards would overwrite unread values. O(m+n) time, O(1) space.',
 '189':'Three reversals: reverse the whole array, reverse the first k, reverse the rest. Take k modulo n first. O(n) time, O(1) space.',
 '66':'Walk from the last digit adding the carry; stop as soon as a digit is not 9. If you fall off the front, the answer is 1 followed by n zeros. O(n) time.',
 '73':'Use row 0 and column 0 as the marker arrays, with one extra boolean for whether column 0 itself must be zeroed. Mark in one pass, apply in a second pass working backwards so the markers are read before they are overwritten. O(nm) time, O(1) space.',
 '54':'Four bounds - top, bottom, left, right - and shrink whichever one you just consumed. The discipline is guarding the bottom and left passes against a single remaining row or column. O(nm) time.',
 '48':'Transpose in place, then reverse each row. Anticlockwise is transpose then reverse each column. O(n^2) time, O(1) space.',
 '240':'Staircase from the top-right corner: if the value is too large move left, if too small move down. Each step eliminates a whole row or column. O(n+m) time, O(1) space.',
 '560':'Prefix sum plus a hashmap of prefix-value to count, SEEDED with {0:1} so a prefix that itself equals K is counted. At each index add the count of pre-K seen so far. O(n) time, O(n) space.',
 '523':'Same as 560 but store prefix modulo K and the earliest INDEX it occurred at, because the subarray must be at least length two. Seed {0:-1}. O(n) time, O(k) space.',
 '525':'Map every 0 to -1 and the problem becomes "longest subarray summing to zero", which is prefix sums plus a map of first occurrence. O(n) time, O(n) space.',
 '1010':'Count remainders modulo 60. Pair r with 60-r, and handle r=0 and r=30 as n choose 2 within their own bucket. O(n) time, O(1) space.',
 '918':'The answer is max(Kadane(a), total - minKadane(a)), because the best wrapping subarray is the complement of the worst non-wrapping one. Guard the all-negative case, where the second term is zero and wrong. O(n) time, O(1) space.'
};


Object.assign(PLAN.approach.arr, {
 '4':'Binary search on the PARTITION of the shorter array, not on the value. Choose i in the shorter array, derive j from the total half-length, and check the four boundary values maxLeftA <= minRightB and maxLeftB <= minRightA. O(log min(m,n)) time.',
 '315':'Merge sort on (value, originalIndex) pairs, counting how many right-half elements are placed before each left-half element during the merge; that count is exactly the smaller-after count. Or a BIT over compressed ranks scanned right to left. O(n log n) time.',
 '493':'Same merge-sort machinery, different predicate: before merging, count pairs with a[i] > 2*a[j] using a two-pointer sweep across the two sorted halves. Proves the counting device transfers. O(n log n) time.',
 '327':'Build prefix sums, then during the merge count how many prefix[j] fall in [prefix[i]+lower, prefix[i]+upper] with two moving pointers. Three ideas composed: prefix, merge sort, window. O(n log n) time.',
 '239':'Monotonic deque holding INDICES with decreasing values. Pop the front when it leaves the window, pop the back while it is smaller than the incoming value, then push. The front is always the window maximum. O(n) time, O(k) space.',
 '84':'Monotonic increasing stack of indices. When a shorter bar arrives, pop and settle each taller bar: its width runs from the new stack top plus one to the current index minus one. Sentinel zeros at both ends remove the flush logic. O(n) time.',
 '85':'Treat each row as the base of a histogram whose heights are consecutive ones above it, and run 84 per row. Composition, not a new idea. O(nm) time.',
 '42':'Two pointers from both ends moving the side with the smaller wall inward, adding maxLeft minus height at each step. Correct because the smaller wall alone bounds the water at that index. O(n) time, O(1) space.',
 '407':'Two dimensions break the two-pointer argument, so use a min-heap seeded with the whole border. Pop the lowest boundary cell, and for each unvisited neighbour add max(0, boundaryHeight - h) and push it with height max(boundaryHeight, h). O(nm log nm) time.',
 '862':'Negatives break the sliding window, so keep a monotonic increasing deque of prefix-sum indices. Pop from the front while prefix[i]-prefix[front] >= K recording the length, and pop from the back while prefix[back] >= prefix[i]. O(n) time.',
 '410':'Binary search on the ANSWER. Write feasible(x) = greedily cut whenever the running sum would exceed x, and count the pieces; feasible if that count is at most m. Search between max(a) and sum(a). O(n log sum) time.',
 '774':'Binary search on a REAL-valued answer. feasible(d) = sum over gaps of ceil(gap/d) - 1 stations needed, feasible if that is at most K. Iterate a fixed 60-100 times or to 1e-6. O(n log(range/eps)) time.',
 '2251':'Sort start times and end times into two separate arrays. For each person, binary search how many flowers have started by then minus how many have ended; the difference is the answer. Or sweep a difference map over compressed times. O((n+q) log n) time.'
});


PLAN.approach.twop = {
 '125':'Two pointers inward, skipping non-alphanumerics on both sides, comparing lowercased. O(n) time, O(1) space.',
 '680':'Two pointers inward; on the first mismatch try deleting the left OR the right character and test whether either remaining span is a palindrome. One branch point only. O(n) time.',
 '167':'Sorted input, so two pointers from both ends: move left in when the sum is too small, right in when too large. O(n) time, O(1) space.',
 '15':'Sort, then fix i and run the 167 two-pointer on the suffix. Skip duplicates at i and after every successful pair, or the output has repeats. O(n^2) time.',
 '16':'Same as 3Sum but track the closest sum seen instead of an exact match; you can still move pointers by the sign of sum minus target. O(n^2) time.',
 '18':'Two nested fixed indices plus the two-pointer inner loop, with duplicate skipping at all four positions. Prune early when the smallest or largest reachable sum cannot hit the target. O(n^3) time.',
 '11':'Two pointers from both ends; always move the SHORTER wall inward, because moving the taller one can only reduce the area. O(n) time, O(1) space.',
 '26':'Slow-fast write pointer: the slow index is where the next kept element goes, the fast index scans. The same shape solves remove-element and move-zeroes. O(n) time, O(1) space.',
 '3':'Sliding window with a map of character to LAST index. On a repeat, jump the left edge to max(left, lastIndex+1) rather than crawling. O(n) time, O(min(n,alphabet)) space.',
 '209':'Sliding window over positive numbers: grow right, and while the sum is at least the target shrink from the left recording the length. Positivity is what makes the window monotone. O(n) time.',
 '424':'Window is valid while (windowLength - countOfMostFrequentChar) <= k. The subtle part: you never need to decrease the recorded maximum frequency, so the window only ever grows or slides. O(n) time.',
 '567':'Fixed-size window of length len(s1) over s2, with a 26-slot count array and a matches counter. Slide and update two characters per step. O(n) time.',
 '438':'Identical machinery to 567, but record every start index where the counts match rather than returning on the first. O(n) time.',
 '76':'Grow the window until it covers all required counts (tracked by a "how many distinct chars are satisfied" counter), then shrink from the left while it still covers, recording the best. Each pointer moves n times. O(n + m) time.',
 '340':'Sliding window with a map of character to count; while the map has more than K keys, shrink from the left and delete keys that reach zero. O(n) time, O(k) space.',
 '141':'Floyd: slow moves one, fast moves two; they meet inside a cycle. For the entry point, restart one pointer at the head and advance both one step at a time until they meet. O(n) time, O(1) space.',
 '234':'Find the middle with slow-fast, reverse the second half in place, compare the two halves, then restore the list if the caller cares. O(n) time, O(1) space.',
 '986':'Two pointers over the two sorted lists. The intersection is [max(starts), min(ends)] when that is non-empty, and you always advance whichever interval ends first. O(n+m) time.',
 '392':'Two pointers, advancing the s pointer only on a match. For the follow-up with many queries, precompute for each position and letter the next occurrence and binary search instead. O(n) time.'
};


Object.assign(PLAN.approach.twop, {
 '992':'exactly(K) = atMost(K) - atMost(K-1). atMost is a normal distinct-count sliding window, so the whole problem is one small algebraic trick over a standard window. O(n) time.',
 '930':'Same subtraction trick: exactly S = atMost(S) - atMost(S-1), where atMost is a prefix-sum window over a binary array. O(n) time.',
 '1248':'Map odd to 1 and even to 0 and it becomes 930 with S = k. The same subtraction trick again - three problems, one idea. O(n) time.',
 '480':'Two heaps (max-heap of the lower half, min-heap of the upper half) with LAZY DELETION: keep a map of values scheduled for removal and purge only from the tops. Rebalance by size after every insert and delete. O(n log k) time.',
 '239':'Monotonic deque of indices with decreasing values; the front is the maximum and leaves when it falls out of the window. O(n) time, O(k) space.',
 '727':'Two pointers with a BACKWARD pass: scan forward to find an end that covers t, then walk backwards from that end to tighten the start. Or DP over dp[i][j] = the latest start. O(nm) time.',
 '683':'Slide a window over the position-to-day array and keep windows where every interior day is greater than both endpoints; a monotonic deque or a min-window check does it. O(n) time.',
 '1004':'Sliding window allowing at most K zeros: grow right, and when the zero count exceeds K shrink from the left. The maximum window length is the answer. O(n) time.',
 '1234':'Reframe: find the SHORTEST window such that the characters OUTSIDE it are already balanced. Then it is a standard shrinking window over the outside counts. O(n) time.',
 '828':'Contribution technique, not a window. For each occurrence of a character, its contribution is (i - prevIndex) * (nextIndex - i), so keep the last two indices per character and sum. O(n) time.'
});


PLAN.approach.str = {
 '242':'26-slot count array, increment for s and decrement for t, then check all zeros. Unicode follow-up needs a hashmap. O(n) time, O(1) space.',
 '49':'Group by a canonical key: either the sorted string, O(n k log k), or a 26-length count signature, O(n k). The choice of key IS the interview.',
 '5':'Expand around every centre, 2n-1 of them because even-length palindromes have a centre between characters. Manacher gets O(n) but is rarely required. O(n^2) time, O(1) space.',
 '647':'Identical centre expansion, but count every successful expansion instead of tracking the longest. O(n^2) time.',
 '20':'Stack of expected closers. Push the matching closer on an opener, and on a closer check it equals the popped top. The stack must be empty at the end. O(n) time.',
 '22':'Backtrack with two counters: you may add an open bracket while open < n, and a close bracket while close < open. That invariant alone prevents every invalid string. O(4^n / sqrt(n)) outputs.',
 '151':'Split on runs of whitespace and join reversed. For the in-place O(1) variant: reverse the whole array, then reverse each word. O(n) time.',
 '8':'The specification IS the problem. Skip leading spaces, read an optional sign, consume digits, stop at the first non-digit, and clamp to the 32-bit range while accumulating rather than after. O(n) time.',
 '13':'Right to left: add the value, but subtract when the current symbol is smaller than the one to its right. For the reverse direction, greedily emit from a table that includes the subtractive pairs. O(n) time.',
 '14':'Compare characters column by column across all strings, or take the min and max string in lexical order and compare only those two. O(total characters).',
 '28':'KMP: build the failure function (longest proper prefix that is also a suffix) then scan without ever backing up in the haystack. O(n+m) time.',
 '344':'Two pointers swapping inward. The vowels variant advances each pointer until it lands on a vowel first. O(n) time, O(1) space.',
 '387':'Two passes: count, then scan for the first character with count one. A single pass storing first-index and count also works. O(n) time.',
 '819':'Lowercase, split on non-letters, count, then take the highest count not in the banned set. The parsing is the difficulty, not the algorithm. O(n) time.',
 '937':'Stable sort with a custom comparator: letter-logs before digit-logs, letter-logs compared by content then by identifier, digit-logs left in original order. Stability is what preserves the digit-log order. O(n log n) time.',
 '271':'Length-prefix framing: write the length, a delimiter, then the payload. Never a delimiter alone, because the payload can contain it. O(total length).',
 '443':'Read pointer and write pointer over the same array. Count a run, write the character, then write the count digits only when the run exceeds one. O(n) time, O(1) space.',
 '6':'Simulate the row index bouncing between 0 and numRows-1, appending each character to its row, then concatenate. The closed-form index arithmetic is an optional flourish. O(n) time.',
 '68':'Greedily fit as many words as possible per line, then distribute spaces: the leftmost gaps take the extra space. The last line and any single-word line are left-justified. O(total characters).',
 '468':'Pure specification work. Split on dots or colons, check the count of parts, then validate each part - no leading zeros for IPv4, at most four hex digits for IPv6. O(n) time.',
 '273':'Recurse in groups of three digits, appending the scale word (Thousand, Million, Billion). The traps are zero, the teens, and stray spaces. O(log n) digits.'
};


Object.assign(PLAN.approach.str, {
 '1044':'Binary search on the LENGTH, with a rolling hash (Rabin-Karp) checking whether any duplicate substring of that length exists. Store hashes in a set and verify collisions. O(n log n) expected.',
 '214':'The answer is the longest palindromic PREFIX; everything after it gets mirrored in front. Find it with KMP on s + "#" + reverse(s) and read the last failure value. O(n) time.',
 '459':'The one-liner: s is built from a repeated block if and only if s appears inside (s+s) with the first and last characters removed. Or use the KMP failure function: n % (n - fail[n]) == 0. O(n) time.',
 '336':'Trie of reversed words plus a per-node list of which suffixes below it are palindromes. For each word, walk the trie and match the two cases - the other word is shorter, or longer. O(n k^2) time.',
 '809':'Run-length encode both strings and compare group by group: the groups must be the same character, and the query count must either equal the word count or be at least three and at least the word count. O(n) time.',
 '777':'Invariant proof, not simulation. Strip the Xs: the remaining L/R sequences must be identical, and every L in start must be at an index >= its position in end, every R at an index <=. O(n) time.',
 '833':'Collect all replacements that actually match at their index, sort by index, then build the output in one left-to-right pass. Doing them in place invalidates every later index. O(n + k log k) time.',
 '726':'Recursive descent parser. Parse an element and an optional count, recurse on an open parenthesis, multiply the returned map by the count after the close. Then sort the map. O(n^2) worst case.',
 '224':'One stack, one running result, one sign. On an open parenthesis push the result and the sign and reset both; on a close pop and combine. For II and III also carry a pending operator and handle multiply/divide immediately against the last term. O(n) time.',
 '394':'Two stacks - counts and partial strings - or one recursion. On an open bracket push the current string and the multiplier; on a close pop and append the repeated segment. O(output length).',
 '65':'A small state machine, or a flag-based scan tracking seenDigit, seenDot and seenExponent with the rule that a dot cannot follow an exponent and an exponent needs a digit before and after. O(n) time.',
 '30':'Sliding window in WORD units: run len separate windows, one per starting offset modulo the word length, each maintaining a count map and shrinking on excess. O(n * len) time.'
});


PLAN.approach.hash = {
 '217':'Set for the plain version. For the "within k indices" variant, keep a sliding window set of the last k elements, evicting as you go. O(n) time.',
 '128':'Put everything in a set, then start a run ONLY at x where x-1 is absent, and walk upward. Each element is visited at most twice, which is what makes it O(n) rather than O(n log n).',
 '347':'Count, then either a size-k min-heap, O(n log k), or bucket sort by frequency into n+1 buckets and read from the top, O(n). Quickselect on counts is the third answer.',
 '692':'Same as 347 but the tie-break is lexical, so the heap comparator must invert on count and not on the word. Bucket sort plus sorting inside each bucket also works. O(n log k) time.',
 '383':'Count the source, decrement for the target, fail on a negative. The isomorphic and word-pattern variants need TWO maps - forward and backward - or the mapping is not a bijection. O(n) time.',
 '349':'Set intersection for the distinct version. For the multiset version, count one side and decrement while scanning the other; if both are sorted, two pointers with no extra space. O(n+m) time.',
 '249':'Canonical key: shift every character so the first letter becomes "a", wrapping modulo 26. Group by that key. O(total characters).',
 '380':'Array plus a value-to-index map. Insert appends; delete swaps the doomed element with the LAST one, fixes that one index in the map, and pops. getRandom indexes the array. O(1) all three.',
 '381':'Same shape but the map holds a SET of indices per value. On delete pull any index out of the set and do the same swap-with-last, updating the moved element\'s index set. O(1) expected.',
 '146':'Hashmap to node, plus a doubly linked list with sentinel head and tail. get moves the node to the front; put evicts from the tail when full. The sentinels are what make the pointer surgery branch-free. O(1) both.',
 '1152':'Group timestamps by user, sort each user\'s visits by time, enumerate every 3-subsequence of pages, count the patterns across users, and take the max with a lexical tie-break. Deliberately messy - the specification is the difficulty. O(u * k^3) time.'
};


Object.assign(PLAN.approach.hash, {
 '652':'Serialise every subtree post-order into a canonical string (with explicit null markers) and count them in a map; any serialisation seen exactly twice contributes one root. O(n^2) with strings, O(n) with an id-assignment map. ',
 '288':'Map from abbreviation to the set of words producing it. A word is unique if the abbreviation is absent, or maps to a set containing only that word. O(n) build.',
 '359':'Map from message to the next allowed timestamp. Print only when now is at least that value, and then set it to now + 10. The follow-up is what to do about unbounded memory - evict lazily. O(1) per call.',
 '981':'Map from key to a list of (timestamp, value) appended in increasing time order, then binary search for the largest timestamp not exceeding the query. O(log n) per get.',
 '895':'Map from value to a stack of the frequencies at which it was pushed, plus a map from frequency to the stack of values at that frequency, plus the current max frequency. Push increments; pop takes from the top frequency stack. O(1) both.',
 '460':'Three structures: key to node, key to frequency, and frequency to a doubly linked list of nodes in that bucket in LRU order. Track the minimum frequency and bump nodes between buckets on access. O(1) both.',
 '936':'Work BACKWARDS. Repeatedly find a window in the target that matches the stamp allowing already-stamped wildcards, replace it with wildcards, and record the index; reverse the recorded order at the end. O(n * m) time.'
});


PLAN.approach.bs = {
 '704':'Canonical half-open loop: lo=0, hi=n, while lo<hi with mid = lo + (hi-lo)/2. Pick one template and never write another. O(log n) time.',
 '35':'Same search, but return lo when the loop ends - that is exactly the insertion point. O(log n) time.',
 '34':'Two searches: lower bound (first index with a[i] >= target) and upper bound (first index with a[i] > target). Write them as one function with a strictness flag. O(log n) time.',
 '33':'One half of the array is always sorted. Determine which by comparing a[lo] with a[mid], test whether the target lies inside that sorted half, and discard the other. With duplicates you must shrink lo and hi by one on ties, which degrades to O(n) worst case.',
 '153':'Compare a[mid] with a[hi]: if greater, the minimum is to the right; otherwise it is at mid or to the left. Comparing with a[lo] instead is the classic bug on an already-sorted array. O(log n) time.',
 '74':'Treat the matrix as one flat sorted array of length n*m and map the index back with divide and modulo. For matrix II, where rows are not globally sorted, use the staircase from the top-right instead. O(log nm) / O(n+m).',
 '69':'Binary search on the answer in [0, x], testing mid*mid <= x with care about overflow (compare mid <= x/mid). Newton iteration is the alternative. O(log x) time.',
 '278':'Straight lower-bound search for the first index where isBadVersion is true. Use lo + (hi-lo)/2 to avoid overflow. O(log n) time.',
 '162':'Compare a[mid] with a[mid+1]: if increasing, a peak exists to the right, otherwise at mid or left. Works on unsorted input because the boundary conditions guarantee a peak. O(log n) time.',
 '852':'Identical to 162, but the mountain shape means the peak is unique. O(log n) time.',
 '875':'Binary search on the answer k in [1, max(pile)]. feasible(k) = sum of ceil(pile/k) <= h. Write feasible first and the search is boilerplate. O(n log max) time.',
 '1011':'Binary search on the capacity in [max(weight), sum(weight)]. feasible(c) = greedily fill days and count them. O(n log sum) time.',
 '1552':'Binary search on the minimum gap. feasible(d) = greedily place balls at least d apart after sorting, and check you placed m. O(n log range) time.',
 '540':'Binary search on PAIR indices. Force mid to be even; if a[mid] == a[mid+1] the single element is to the right, otherwise at mid or left. O(log n) time.',
 '658':'Binary search for the left edge of the window: find the smallest i such that x - a[i] <= a[i+k] - x, then take k elements from i. O(log n) time.',
 '528':'Build prefix sums of the weights, draw a uniform number in [0, total), and binary search for the first prefix strictly greater than it. O(log n) per pick.',
 '981':'Per key, an append-only list ordered by timestamp plus a binary search for the largest timestamp not exceeding the query. O(log n) per get.'
};


Object.assign(PLAN.approach.bs, {
 '4':'Binary search the partition point of the SHORTER array so that the combined left halves hold exactly half the elements, then validate with the four boundary values. O(log min(m,n)) time.',
 '410':'Binary search on the answer between max(a) and sum(a); feasible(x) counts greedy cuts and checks the count is at most m. O(n log sum) time.',
 '1231':'Binary search on the minimum sweetness; feasible(x) greedily cuts a chunk whenever the running sum reaches x and checks you got at least k+1 chunks. O(n log sum) time.',
 '1482':'Binary search on the number of days; feasible(d) scans for runs of flowers bloomed by day d and counts how many bouquets of k adjacent ones fit. O(n log maxDay) time.',
 '774':'Binary search on a REAL answer; feasible(d) sums ceil(gap/d)-1 across gaps. Iterate to a fixed epsilon rather than to equality. O(n log(range/eps)) time.',
 '644':'Binary search on the real-valued average. feasible(x) subtracts x from every element and asks whether some subarray of length at least k has a non-negative sum, which is a prefix-minimum sweep. O(n log(range/eps)) time.',
 '1044':'Binary search on the length, Rabin-Karp rolling hash to test whether a duplicate of that length exists. O(n log n) expected.',
 '1235':'Sort jobs by end time; dp[i] = max(dp[i-1], profit[i] + dp[j]) where j is found by binary searching for the last job ending at or before job i starts. O(n log n) time.',
 '668':'Binary search on the VALUE x in [1, m*n], counting how many table entries are at most x with sum over rows of min(x/i, n). Take the smallest x whose count reaches k. O(m log mn) time.',
 '378':'Binary search on the value, counting entries at most x with a staircase walk from the bottom-left. The heap solution is O(k log k) and is the one to mention as the alternative. O(n log range) time.',
 '719':'Binary search on the distance. count(d) = number of pairs within d, computed by a sliding window over the sorted array. O(n log n + n log range) time.'
});


PLAN.approach.sort = {
 '215':'Quickselect with a random pivot, expected O(n), worst case O(n^2) - say the randomisation out loud. A size-k min-heap is the O(n log k) answer and the one to give when the interviewer wants streaming.',
 '973':'Same choice: a size-k max-heap by squared distance, O(n log k), or quickselect on squared distance, expected O(n). Never take the square root.',
 '179':'Sort with the comparator (a+b) vs (b+a) as strings, descending. Then handle the all-zeros case, which otherwise prints "000". O(n log n * k) time.',
 '56':'Sort by start, then walk merging while the next start is at most the current end, extending the end to the maximum. O(n log n) time.',
 '435':'Sort by END time and greedily keep every interval whose start is at least the last kept end; the removals are the rest. Sorting by start is the classic wrong answer. O(n log n) time.',
 '452':'Identical to 435 - sort by end, shoot at the end of the first balloon, skip everything it hits. The count of shots is the answer. O(n log n) time.',
 '455':'Sort both children and cookies, then two pointers assigning the smallest sufficient cookie to the least greedy child. O(n log n) time.',
 '122':'Sum every positive consecutive difference. The exchange argument: any profitable multi-day hold decomposes into the daily gains it contains. O(n) time.',
 '55':'Track the furthest reachable index while scanning; fail if the current index passes it. For Jump Game II, count levels BFS-style by tracking the end of the current jump range. O(n) time.',
 '134':'If the total gas is at least the total cost a solution exists. Scan once tracking a running tank, and every time it goes negative reset it and set the candidate start to the next index. O(n) time.',
 '621':'Formula: (maxCount-1) * (n+1) + numberOfTasksWithMaxCount, then take the max with the total task count for the dense case. The heap simulation is the alternative and is worth knowing. O(n) time.',
 '767':'Greedy from a max-heap by remaining count: take the two most frequent characters each round so you never place the same one twice in a row. Impossible when one count exceeds (n+1)/2. O(n log 26) time.',
 '1167':'Huffman: min-heap, repeatedly pop the two smallest, push their sum, and accumulate. The exchange argument is that the two smallest must be deepest. O(n log n) time.',
 '1481':'Count frequencies, sort the counts ascending, and remove whole groups from the smallest upward while the budget lasts. O(n log n) time, or O(n) with bucket counting.',
 '253':'Sort by start and use a min-heap of end times: pop every meeting that has finished before the current start, then push the current end. The heap size is the answer. Or sweep +1/-1 events. O(n log n) time.',
 '1834':'Sort tasks by enqueue time, then simulate with a min-heap ordered by (processingTime, index). When the heap is empty, jump the clock forward to the next enqueue time. O(n log n) time.',
 '148':'Merge sort on the list. Top-down with slow-fast splitting is O(log n) stack; bottom-up with doubling block sizes is the true O(1)-space answer the interviewer is fishing for. O(n log n) time.'
};


Object.assign(PLAN.approach.sort, {
 '857':'Sort workers by wage-to-quality ratio ascending. Sweep, keeping a max-heap of qualities of size k and its running sum; at each ratio the cost is ratio * sumOfQualities. O(n log n) time.',
 '502':'Sort projects by capital. Push every affordable project\'s profit into a max-heap, then pop the best, add it to the capital, and repeat k times. O(n log n) time.',
 '1642':'Use ladders for the k largest climbs seen so far: push every positive climb into a min-heap of size ladders, and when it overflows pay the smallest climb with bricks. Stop when the bricks run out. O(n log k) time.',
 '871':'Scan stations while the fuel lasts, pushing each passed station\'s fuel into a max-heap. When you cannot reach the next one, pop the biggest tank you have skipped and count a stop. O(n log n) time.',
 '630':'Sort by deadline. Take every course, pushing its duration into a max-heap; if the running total exceeds the deadline, pop the longest course taken so far and remove it. O(n log n) time.',
 '315':'Merge sort counting right-half elements placed before left-half ones, or a BIT over compressed ranks scanned right to left. O(n log n) time.',
 '493':'Merge sort with a two-pointer counting pass for a[i] > 2*a[j] before each merge. O(n log n) time.',
 '759':'Flatten every interval, sort by start, and merge; the gaps between merged intervals are the free time. A k-way heap merge is the O(n log k) version. O(n log n) time.',
 '402':'Monotonic increasing stack: pop while the top is greater than the incoming digit and you still have removals left. Trim any remaining removals from the tail and strip leading zeros. O(n) time.',
 '316':'Monotonic stack plus a last-occurrence index and an in-stack set: pop a larger character only if it appears again later. O(n) time.',
 '135':'Two sweeps: left to right giving one more than the left neighbour when the rating rises, then right to left taking the maximum with one more than the right neighbour. Sum. O(n) time.'
});


PLAN.approach.ll = {
 '206':'Three pointers - prev, cur, next - relinking one node per step. For "reverse between m and n", walk to the node before m, then repeatedly splice the next node to the front of the sublist. O(n) time, O(1) space.',
 '21':'Dummy head plus a tail pointer, taking the smaller head each step and attaching the remaining list at the end. The dummy is what removes every null special case. O(n+m) time.',
 '141':'Floyd slow-fast. For the entry node, once they meet restart one pointer at the head and step both one at a time. O(n) time, O(1) space.',
 '143':'Three standard moves composed: find the middle with slow-fast, reverse the second half, then merge the two halves alternately. O(n) time, O(1) space.',
 '19':'Two pointers n apart, moving together until the leader falls off the end; a dummy head handles removing the head itself. O(n) time, one pass.',
 '2':'Walk both lists adding digit plus carry, allocating as you go, and remember the final carry. For version II (most significant first) either reverse both lists or push onto two stacks and build the result backwards. O(n+m) time.',
 '138':'Interleave: insert each copy directly after its original, set copy.random = original.random.next, then unweave the two lists. That gives O(1) extra space where the hashmap version needs O(n).',
 '160':'Two pointers that switch to the other list on reaching the end; they meet at the intersection after at most two passes because both then travel the same total distance. O(n+m) time, O(1) space.',
 '234':'Middle by slow-fast, reverse the second half, compare, then restore. O(n) time, O(1) space.',
 '328':'Two chains built simultaneously - odd tail and even tail - then attach the even head after the odd tail. Keep the even head in a variable before you start. O(n) time.',
 '61':'Close the list into a ring while measuring the length, then break it at length minus k modulo length steps from the head. O(n) time.',
 '83':'Sorted input, so compare with the next node. Version II, which removes ALL copies of a duplicated value, needs a dummy head and a prev pointer that skips a whole run. O(n) time.',
 '146':'Hashmap to node plus a doubly linked list with sentinels; get moves to the front, put evicts from the tail. O(1) both.',
 '707':'Doubly linked list with a size counter and sentinel head and tail; index operations walk from whichever end is closer. The interview is the boundary conditions, not the idea. O(n) per index op.'
};


Object.assign(PLAN.approach.ll, {
 '25':'Count k nodes ahead first; if fewer than k remain, leave them alone. Reverse the group with the standard three-pointer loop, then reconnect the previous tail to the new head. A dummy head makes the first group uniform. O(n) time, O(1) space.',
 '23':'Min-heap of the k current heads, popping the smallest and pushing its successor - O(N log k). Divide and conquer pairwise merging is the same complexity with no heap and is often the cleaner answer.',
 '460':'Key to node, key to frequency, and frequency to a doubly linked list in LRU order, plus a running minimum frequency. O(1) both operations.',
 '1650':'With parent pointers this is exactly 160: walk both nodes upward switching to the other chain at the root, and they meet at the LCA. O(h) time, O(1) space.',
 '430':'Iterative with a stack, or splice in place: when a node has a child, insert the whole child list between the node and its next, fix the prev pointers, and clear the child. O(n) time.',
 '708':'Walk the ring once looking for prev.val <= insertVal <= next.val, or for the pivot where the value wraps. If you complete a full loop without a slot, all values are equal - insert anywhere. O(n) time.',
 '1171':'Prefix sums over the list plus a map from prefix value to node. Any repeated prefix value means the span between them sums to zero, so relink past it. Two passes, O(n) time.',
 '148':'Merge sort; bottom-up with doubling block sizes is the O(1)-space version. O(n log n) time.'
});


PLAN.approach.stack = {
 '20':'Push the matching closer on every opener; on a closer, check it equals the popped top. Empty at the end. O(n) time.',
 '155':'Either a second stack of running minima, or store the value together with the minimum-so-far in one stack. The O(1)-extra-space trick with encoded deltas is the follow-up. O(1) per op.',
 '232':'Two stacks, in and out. Push onto in; pop from out, refilling it from in only when it is empty. Amortised O(1) because each element moves between stacks at most once.',
 '739':'Monotonic decreasing stack of indices. When a warmer day arrives, pop and record the index difference for each popped day. O(n) time.',
 '496':'Same monotonic stack. For the circular version II, iterate over 2n indices using modulo so every element gets a second chance to find its greater element. O(n) time.',
 '901':'Monotonic decreasing stack of (price, span) pairs. On a new price, pop everything not greater and absorb its span. O(1) amortised per call.',
 '42':'Two pointers moving the smaller wall inward - O(n) time, O(1) space. The monotonic-stack version fills water layer by layer and is worth knowing as the second answer.',
 '84':'Monotonic increasing stack of indices; on a shorter bar, pop and settle each taller bar with width from the new top plus one to the current index minus one. Sentinels at both ends. O(n) time.',
 '85':'Row by row, build a histogram of consecutive ones and run 84 on it. O(nm) time.',
 '394':'Stack of (multiplier, partialString), or direct recursion. On a close bracket, pop and append the repeated segment. O(output) time.',
 '71':'Split on slashes and push components onto a stack, ignoring empty and ".", popping on "..". Join with slashes. O(n) time.',
 '150':'Push numbers, and on an operator pop two, apply, push back. Watch the operand order for subtraction and division. O(n) time.',
 '227':'One pass with a stack of terms: push a number for +, push its negation for -, and for * or / pop the top and combine immediately. The answer is the sum of the stack. O(n) time.',
 '735':'Stack of surviving asteroids. A negative asteroid pops positives smaller than it, annihilates on equality, and dies if the top is larger. The three-way comparison is the whole problem. O(n) time.',
 '402':'Monotonic increasing stack popping while the top exceeds the incoming digit and removals remain; trim the tail and strip leading zeros. O(n) time.',
 '1047':'Stack: pop when the incoming character equals the top. For version II with k adjacent duplicates, store (char, count) and pop when the count reaches k. O(n) time.',
 '636':'Stack of function ids plus the timestamp of the last switch. On start, charge the elapsed time to the current top and push; on end, charge the inclusive duration and pop. Off-by-one on the end timestamp is the trap. O(n) time.',
 '388':'Stack (or an array indexed by depth) holding the path length at each depth. Depth comes from counting tab characters; on a file, record depth-length plus the name length. O(n) time.'
};


Object.assign(PLAN.approach.stack, {
 '224':'Stack of (result, sign) pushed on an open parenthesis. Version III adds multiply and divide, so also carry a pending operator and combine against the previous term immediately. O(n) time.',
 '239':'Monotonic deque of indices with decreasing values; the front is the window maximum. O(n) time.',
 '862':'Monotonic increasing deque over prefix-sum indices: pop the front while the difference reaches K, pop the back while the new prefix is not larger. O(n) time.',
 '316':'Monotonic stack plus last-occurrence indices and an in-stack marker; only pop a character that reappears later. O(n) time.',
 '321':'For every split k, take the best k digits from one array and best (K-k) from the other with a monotonic stack, then merge them by lexical comparison of remaining suffixes and keep the maximum. O(K * (n+m)^2) worst case.',
 '907':'Contribution technique with a monotonic stack: for each element compute how many subarrays it is the minimum of, which is (i - prevSmaller) * (nextSmaller - i). Use strict on one side and non-strict on the other to avoid double counting. O(n) time.',
 '2104':'Sum of subarray maximums minus sum of subarray minimums, each computed with the 907 contribution technique. Two runs of the same machinery. O(n) time.',
 '1130':'Monotonic decreasing stack: repeatedly remove the smallest leaf, paying it multiplied by its smaller neighbour. Equivalent to interval DP but linear. O(n) time.',
 '895':'Value to a stack of push-frequencies, frequency to a stack of values, plus the current maximum frequency. O(1) both.',
 '456':'Scan right to left with a stack, maintaining the largest value that has already been popped as the candidate "2". If the current element is smaller than that candidate, you have the pattern. O(n) time.',
 '32':'Stack of indices seeded with -1 as a base; on a close bracket pop and measure from the new top. The two-counter left-right scan run in both directions is the O(1)-space alternative. O(n) time.'
});


PLAN.approach.heap = {
 '215':'Size-k min-heap, O(n log k), or quickselect with a random pivot, expected O(n). Say which the interviewer wants: streaming favours the heap.',
 '703':'Size-k min-heap; the root is the answer and every add pushes then pops if the size exceeds k. O(log k) per add.',
 '347':'Count, then a size-k heap, O(n log k), or bucket by frequency for O(n). The words variant needs a comparator that inverts on count but not on the word.',
 '973':'Size-k max-heap on squared distance, or quickselect. Never take the square root. O(n log k) time.',
 '23':'Heap of the k current heads, or divide-and-conquer pairwise merges. O(N log k) time.',
 '295':'Two heaps: a max-heap for the lower half, a min-heap for the upper, rebalanced so their sizes differ by at most one. The median is the top of the larger, or the average of the two tops. O(log n) add, O(1) find.',
 '253':'Sort by start, min-heap of end times, popping everything finished before the current start. The heap size is the answer. O(n log n) time.',
 '621':'Max-heap by remaining count, taking up to n+1 tasks per round and pushing back what remains. The closed-form formula is the O(n) answer. O(n log 26) time.',
 '1167':'Huffman with a min-heap: pop two, push the sum, accumulate. O(n log n) time.',
 '1834':'Sort by enqueue time, then a min-heap ordered by (processingTime, index), jumping the clock forward when the heap empties. O(n log n) time.',
 '378':'Min-heap seeded with the first column, popping k times and pushing the right neighbour - O(k log n). Binary search on the value with a staircase count is the other answer and is better when k is large.',
 '373':'Min-heap seeded with (a[i], b[0]) for the first k values of a; on popping (i,j) push (i, j+1). Avoids generating all n*m pairs. O(k log k) time.',
 '1046':'Max-heap; pop two, push the difference if non-zero. O(n log n) time.'
};


Object.assign(PLAN.approach.heap, {
 '480':'Two heaps with LAZY deletion via a map of pending removals, purged only from the tops, rebalanced by logical size. O(n log k) time.',
 '502':'Sort by capital, push affordable profits into a max-heap, pop the best k times. O(n log n) time.',
 '857':'Sort by wage-to-quality ratio; sweep with a max-heap of qualities of size k and its running sum. O(n log n) time.',
 '1642':'Min-heap of the climbs paid with ladders, size ladders; overflow is paid with bricks. O(n log k) time.',
 '871':'Max-heap of the fuel at stations you have passed; pop the largest when you cannot reach the next one. O(n log n) time.',
 '630':'Sort by deadline, take everything into a max-heap of durations, and evict the longest whenever the running total exceeds the deadline. O(n log n) time.',
 '1383':'Sort engineers by efficiency descending, sweep with a min-heap of speeds of size k and its running sum, and evaluate sum * currentEfficiency at each step. O(n log n) time.',
 '632':'Min-heap of one pointer per list plus the current maximum across the pointers. Pop the minimum, record the range, and advance that list; stop when any list is exhausted. O(N log k) time.',
 '407':'Min-heap seeded with the whole border; pop the lowest boundary cell and push neighbours with height max(boundary, h). O(nm log nm) time.',
 '218':'Sweep the x coordinates with a max-heap of active heights and lazy deletion; emit a key point whenever the maximum changes. Divide and conquer merging skylines is the alternative. O(n log n) time.',
 '895':'Value to a stack of frequencies, frequency to a stack of values, plus the maximum frequency. O(1) both.'
});


PLAN.approach.intv = {
 '56':'Sort by start, walk merging while the next start is at most the current end. O(n log n) time.',
 '57':'Already sorted, so three phases: copy everything ending before the new start, merge everything overlapping by taking min of starts and max of ends, then copy the rest. O(n) time.',
 '252':'Sort by start and check for any overlap. For II, the min-heap of end times or the +1/-1 sweep gives the number of rooms. O(n log n) time.',
 '435':'Sort by END and greedily keep non-overlapping intervals; the rest are removals. O(n log n) time.',
 '452':'Same greedy as 435: sort by end and shoot at each kept end. O(n log n) time.',
 '986':'Two pointers; the intersection is [max(starts), min(ends)] when non-empty, and you advance whichever ends first. O(n+m) time.',
 '228':'Single pass building runs while each value is exactly one more than the previous. Formatting is the only difficulty. O(n) time.',
 '1288':'Sort by start ascending and end DESCENDING, then anything whose end is at most the running maximum end is covered. The tie-break on end is what makes it correct. O(n log n) time.',
 '729':'Keep bookings in a sorted structure (TreeMap or a sorted list) and binary search for the neighbour before the new start; reject if it overlaps. O(log n) per booking.',
 '1229':'Two pointers over both sorted slot lists: compute the overlap, return it if it is long enough, otherwise advance whichever slot ends first. O(n log n + m log m) with the sorts.'
};


Object.assign(PLAN.approach.intv, {
 '731':'Keep two structures: all booked intervals and all doubly-booked ones. A new booking is rejected if it overlaps the doubly-booked set; otherwise add its overlap with the booked set to the doubly-booked set. O(n) per booking.',
 '732':'Difference map over a TreeMap: +1 at the start, -1 at the end, then sweep the whole map accumulating and tracking the maximum. O(n log n) per query.',
 '715':'A TreeMap from start to end holding disjoint intervals. addRange merges with any neighbour that touches or overlaps; removeRange splits. Every operation is a floor lookup plus a bounded walk. O(log n) amortised.',
 '759':'Flatten, sort by start, merge; the gaps are the answer. O(n log n) time.',
 '218':'Max-heap sweep with lazy deletion, emitting a point whenever the maximum height changes. O(n log n) time.',
 '699':'Coordinate-compress the x ranges, then either a segment tree with range-max and range-assign, or an O(n^2) scan comparing each square against all previous overlapping ones. O(n log n) or O(n^2).',
 '850':'Sweep on x with coordinate compression on y: at each x interval, compute the total covered y length from the currently active rectangles and multiply by the x width. O(n^2) with a scan, O(n log n) with a segment tree.',
 '2251':'Sort starts and ends separately; for each query, count started minus ended by binary search. O((n+q) log n) time.'
});


PLAN.approach.tree = {
 '94':'Iterative inorder: push left spine, pop and visit, then move to the right child. Preorder is one stack pushing right before left; postorder is either two stacks or reversed root-right-left. Learn all three iteratively - recursion is not the interview. O(n) time.',
 '102':'BFS with a queue, processing exactly queue.size() nodes per level so the level boundary is explicit. Bottom-up reverses the result; zigzag flips the insertion order per level. O(n) time.',
 '199':'Level-order taking the last node of each level, or DFS root-right-left recording the first node seen at each new depth. O(n) time.',
 '104':'Post-order recursion returning 1 + max of children. Min depth must ignore null children of a one-child node. Balanced returns -1 as a sentinel to short-circuit. O(n) time.',
 '226':'Swap the children and recurse, or a BFS swapping at each node. O(n) time.',
 '100':'Parallel recursion on both trees, handling the two-null and one-null cases first. Symmetric mirrors the recursion (left against right); subtree checks isSame at every node, or compares canonical serialisations. O(nm) time.',
 '543':'Post-order returning HEIGHT while updating a global best with leftHeight + rightHeight. Returning the diameter instead of the height is the classic bug. O(n) time.',
 '112':'DFS carrying the remaining sum, checking it hits zero exactly at a leaf. Version II carries the path and copies it on success. O(n) time.',
 '437':'Prefix sums along the root-to-node path plus a hashmap of prefix counts seeded with {0:1}, and REMOVE the current prefix on the way back up. That backtracking removal is the whole problem. O(n) time.',
 '236':'Post-order: return the node itself if it matches, otherwise the non-null child result, or the node when both children return non-null. For a BST, walk down while both targets are on the same side. O(n) / O(h).',
 '105':'The first preorder element is the root; find it in the inorder array (use a value-to-index map) to split left and right, and recurse with index ranges. From in+post, take the LAST postorder element and build right before left. O(n) time.',
 '98':'Recurse carrying (low, high) bounds, not just comparing with the parent. An inorder traversal checking strict increase is the equally valid alternative. O(n) time.',
 '700':'Search and insert walk down comparing. DELETE is the real question: no children means unlink, one child means promote it, two children means replace with the inorder successor and delete that successor instead. O(h) time.',
 '230':'Inorder traversal stopping at the kth node - iterative with a stack so you can stop early. The follow-up for frequent queries is to store subtree sizes. O(h + k) time.',
 '173':'Controlled iterative inorder: keep the stack of the left spine, and on next() pop, then push the left spine of the popped node\'s right child. O(1) amortised per call, O(h) space.',
 '108':'Take the middle element as the root and recurse on the halves. From a sorted LIST, either convert to an array or use the inorder-simulation trick that builds bottom-up in O(n). O(n) time.',
 '938':'BST pruning: skip the left subtree when the node is below the low bound and the right when above the high. Trim returns the rebuilt subtree. Two Sum in a BST uses the BSTIterator from both ends. O(n) time.',
 '297':'Preorder with explicit null markers, deserialising from a queue of tokens. Level-order also works. The null markers are what make it unambiguous. O(n) time.',
 '863':'Build a parent map with one DFS, then BFS outward from the target through children and parent, with a visited set. O(n) time.',
 '116':'Use the already-built next pointers of the level above to walk it and stitch the level below, giving O(1) extra space. Version 117 with a non-perfect tree needs a dummy head per level. O(n) time.',
 '114':'Morris-style: for each node, find the rightmost node of its left subtree, attach the current right subtree there, move the left subtree to the right, and null the left. O(n) time, O(1) space.',
 '124':'Post-order returning the best DOWNWARD path (max(0, child)) while updating a global with node + leftDown + rightDown. Returning the split path upward is the bug. O(n) time.',
 '337':'Tree DP returning a pair (bestWithThisNode, bestWithoutThisNode). With = value + both children\'s without; without = sum of max of each child\'s pair. O(n) time.',
 '662':'BFS assigning heap-style indices (2i, 2i+1), taking the difference between the first and last index per level. Normalise by subtracting the level\'s first index each level or the numbers overflow. O(n) time.'
};


Object.assign(PLAN.approach.tree, {
 '834':'REROOTING. One post-order pass computes subtree sizes and the answer for the root; a second pre-order pass moves the answer to each child with ans[child] = ans[parent] - size[child] + (n - size[child]). O(n) time.',
 '968':'Greedy post-order with three states per node - needs cover, has camera, is covered. Place a camera only when a child needs cover. O(n) time.',
 '979':'Post-order returning the excess coins (subtreeSum - subtreeSize); the moves accumulate the absolute value of every child\'s excess. O(n) time.',
 '1483':'Binary lifting: up[k][v] = the 2^k-th ancestor, built from up[k-1]. Answer a query by decomposing k into its binary bits. O(n log n) build, O(log n) per query.',
 '987':'DFS or BFS collecting (column, row, value), then sort by column, then row, then value. The value tie-break within the same cell is the part everyone misses. O(n log n) time.',
 '314':'Same column bucketing but WITHOUT the value tie-break - BFS order is the required order, so a queue is enough. O(n) time.',
 '99':'Inorder traversal spotting the one or two places where the sequence decreases; the first violation gives the first node, the last gives the second. Morris traversal makes it O(1) space. O(n) time.',
 '449':'Preorder only, no null markers needed - the BST property lets you reconstruct by passing down (low, high) bounds while consuming the token stream. O(n) time.',
 '428':'Serialise each node as value, child count, then the children; the child count replaces the null markers. O(n) time.',
 '652':'Canonical post-order serialisation counted in a map, or an id-assignment map from (leftId, val, rightId) to a new id for the O(n) version.',
 '1373':'Post-order returning (isBST, min, max, sum) for each subtree and updating a global maximum when the subtree is a valid BST. The tuple is the whole design. O(n) time.',
 '1372':'DFS carrying (direction, currentLength); go left from a right-child step and vice versa, resetting to one otherwise. O(n) time.',
 '2385':'Build a parent map, then BFS outward from the start node counting levels. Identical machinery to 863. O(n) time.',
 '1650':'Parent pointers make it the two-list intersection problem: switch chains at the root and they meet at the LCA. O(h) time, O(1) space.',
 '1123':'Post-order returning (depth, lcaOfDeepestLeavesInThisSubtree). Equal child depths means this node is the answer for its subtree; otherwise take the deeper side. O(n) time.',
 '272':'Inorder into a fixed-size window, or two stacks acting as predecessor and successor iterators merged k times for the O(k log n) version. O(n) or O(h + k).',
 '951':'Recurse comparing children both ways: either (l,l and r,r) or (l,r and r,l) must hold. Values are distinct, which is what makes the two-way check sufficient. O(n) time.',
 '545':'Three separate walks - left boundary top-down, leaves left to right, right boundary bottom-up - with careful de-duplication of the corners. Pure case analysis. O(n) time.',
 'null':'Concepts only, hard-capped at two hours. Know WHY rotations restore balance and what a red-black tree guarantees; nobody implements one live.'
});


PLAN.approach.trie = {
 '208':'Node with 26 children (or a map) and an isEnd flag. Insert, search and startsWith all walk one character at a time. O(k) per operation.',
 '211':'Same trie, but search recurses over all 26 children when it hits a dot. Bound the fan-out by noting that dots are rare in practice. O(26^d * k) worst case.',
 '212':'Build a trie of the words, then DFS the board carrying the trie node rather than re-searching per word. Prune by deleting a word from the trie once found so the branch dies. O(nm * 4^L) with heavy pruning.',
 '648':'Trie of the roots; for each word, walk it and stop at the first isEnd node, replacing with that prefix. O(total characters).',
 '720':'Insert every word, then DFS the trie only through nodes marked isEnd, tracking the longest and lexically smallest. Or sort and use a set. O(total characters).',
 '676':'Trie plus a search that permits exactly ONE character substitution, carried as a boolean through the recursion. O(26 * k) per search.',
 '1268':'Trie with each node holding the three lexically smallest completions below it, precomputed at insert time. Or sort the products and binary search per prefix. O(total characters).',
 '472':'Insert all words into a trie, then for each word run a DP over its own characters: dp[i] is true if some prefix ending at i is a word and dp at that split is true. Skip the word itself. O(n k^2) time.'
};


Object.assign(PLAN.approach.trie, {
 '421':'Binary trie of 32-bit numbers, most significant bit first. For each number, walk the trie preferring the OPPOSITE bit at each level to maximise the XOR. The prefix-set-plus-greedy-bit alternative is the same idea without the structure. O(32n) time.',
 '1707':'Offline: sort queries by their limit and numbers ascending, then insert numbers into the binary trie only as the limit allows before answering each query. O((n+q) log n + 32n) time.',
 '336':'Trie of reversed words with a per-node list of palindromic suffixes below it, handling the shorter-other-word and longer-other-word cases separately. O(n k^2) time.',
 '642':'Trie where each node holds the top three sentences by (count, lexical) below it, plus a current-input buffer. On a hash character, commit the sentence and bump its count. O(k) per keystroke.',
 '1032':'Trie of REVERSED words plus a rolling buffer of recent characters; on each query, walk backwards through the buffer down the reversed trie. Cap the buffer at the longest word length. O(maxWordLength) per query.',
 '745':'Insert every (suffix + separator + word) combination into one trie, so a two-sided query becomes a single prefix lookup. O(n k^2) build, O(k) per query.',
 '588':'Trie-shaped directory tree where each node has a children map and optional file content. ls sorts the child names; mkdir walks creating as it goes. O(path length + children log children).',
 '425':'Trie with a per-node list of words having that prefix, plus backtracking row by row: after placing row i, the prefix for row i+1 is column i of the square so far. O(n * 26^L) with strong pruning.'
});


PLAN.approach.graph = {
 '200':'DFS or BFS from every unvisited land cell, sinking the component as you go. Mark visited on PUSH, not on pop, or the queue fills with duplicates. O(nm) time.',
 '695':'Identical flood fill returning the component size. Closed Islands is the same engine run inward from the border first to eliminate open regions. O(nm) time.',
 '733':'Flood fill from the start cell, guarding the case where the new colour equals the old one or you loop forever. O(nm) time.',
 '994':'MULTI-SOURCE BFS: seed the queue with every rotten orange at once, then count levels. The single virtual super-source is the idea. O(nm) time.',
 '542':'Multi-source BFS seeded with every zero cell; the level at which each one-cell is reached is its distance. Two-pass DP is the alternative. O(nm) time.',
 '1091':'Plain BFS with eight directions, counting levels. Bidirectional BFS is the optimisation to mention. O(nm) time.',
 '130':'REVERSE THINKING: BFS or DFS inward from the border to mark regions that reach the edge, then everything unmarked is surrounded. Cleaner than trying to detect enclosure directly. O(nm) time.',
 '417':'BFS or DFS from BOTH oceans inward, marking cells that can reach each; the answer is the intersection. Searching outward from every cell is the O(n^2 m^2) trap. O(nm) time.',
 '934':'DFS to mark the first island, then multi-source BFS outward from all of its cells until you touch the second island. Two techniques composed. O(nm) time.',
 '909':'BFS over the board treated as a 1-D array of squares 1..n*n; the transform from square number to (row, col) with the boustrophedon flip is the actual work. O(n^2) time.',
 '127':'Implicit graph BFS where neighbours are the words one character away - generate them by substituting each position rather than comparing all pairs. Bidirectional BFS is the follow-up. O(n * k * 26) time.',
 '133':'DFS or BFS carrying a map from original node to its copy; check the map before recursing or you loop forever on cycles. O(V+E) time.',
 '207':'Kahn: in-degrees plus a queue, and a cycle exists exactly when the produced order is shorter than n. The DFS three-colour version detects the back edge directly. Know both. O(V+E) time.',
 '802':'Reverse the graph and topologically sort, or run the three-colour DFS where a node is safe if every path from it terminates. O(V+E) time.',
 '310':'Peel leaves layer by layer like a topological sort on an undirected tree; the last one or two nodes remaining are the roots. O(V) time.',
 '269':'Build edges from adjacent word pairs at their first differing character, then topologically sort the alphabet. The killer edge case is a longer word before its own prefix, which is invalid input. O(total characters).',
 '547':'DSU with path compression and union by size, or DFS over the adjacency matrix. The component count is the answer. O(n^2 * alpha) time.',
 '721':'DSU over account INDICES, keyed by a map from email to the first account index that claimed it. Then group emails by root and sort. O(n k log k) time.',
 '684':'DSU: the first edge whose two endpoints are already connected is the redundant one. O(n * alpha) time.',
 '990':'DSU over the 26 letters using the equality equations, then check every inequality against it. Order matters - process all equalities first. O(n) time.',
 '947':'DSU in disguise: union stones sharing a row or a column, and the answer is the number of stones minus the number of components. O(n * alpha) time.',
 '743':'Lazy Dijkstra with a min-heap of (dist, node), skipping stale entries with "if d > dist[u] continue". The answer is the maximum finalised distance. O(E log V) time.',
 '1514':'Dijkstra with a MAX-heap and multiplication instead of addition; the invariant that the popped node is final still holds because probabilities are in [0,1]. O(E log V) time.',
 '785':'BFS colouring, failing on an edge whose endpoints already share a colour. DSU with parity is the second answer, and it is the one that generalises. O(V+E) time.',
 '399':'Weighted DSU storing the ratio to the parent and composing it during find - or DFS multiplying edge weights along the path. Do both; the DSU version is the one that scales to many queries. O((n+q) * alpha) time.',
 '1584':'Manhattan distance makes it a complete graph, so PRIM is the right choice over Kruskal - the interviewer will probe exactly this. O(n^2) time.',
 '1319':'DSU. If the number of cables is less than n-1 it is impossible; otherwise the answer is componentCount - 1. O(n * alpha) time.',
 '329':'The strictly increasing condition makes it a DAG, so memoised DFS on each cell. The topological-order version processing cells by value is the alternative. O(nm) time.',
 '1466':'DFS or BFS over the tree treating every edge as bidirectional but carrying its original direction; count the edges pointing away from the root. O(n) time.'
};


Object.assign(PLAN.approach.graph, {
 '787':'Three ways, and knowing all three is the point. BFS level by level for at most K+1 levels; Bellman-Ford with prev = dist.copy() inside the k-loop so each round uses only the previous layer; or Dijkstra over the augmented state (cost, node, stopsUsed). O(K*E) time.',
 '1631':'Three ways again: Dijkstra where the path cost is the MAXIMUM edge rather than the sum; binary search on the effort plus a plain BFS feasibility check; or Kruskal with DSU adding edges by weight until start and end connect. O(nm log nm) time.',
 '778':'The same problem as 1631 - minimise the maximum cell on the path. Say why in one sentence and reuse the machinery unchanged. O(nm log nm) time.',
 '1102':'Inverted 1631: maximise the minimum. Max-heap Dijkstra, or binary search plus BFS, or Kruskal adding edges from largest to smallest. O(nm log nm) time.',
 '1368':'0-1 BFS. Following the arrow costs 0, turning costs 1, so use a deque with appendleft for zero-weight moves and append for one-weight ones. O(nm) instead of O(nm log nm).',
 '2290':'0-1 BFS again: moving to an empty cell costs 0, removing an obstacle costs 1. O(nm) time.',
 '1293':'BFS over the augmented state (row, col, remainingEliminations); visited must be three-dimensional. Prune with "if k >= r+c remaining, the answer is the Manhattan distance". O(nm*k) time.',
 '864':'BFS over (row, col, keyMask) with a state-al visited set - treating visited as positional is THE classic bug here. The mask has at most six bits. O(nm * 2^6) time.',
 '847':'BFS over (node, visitedMask) starting from every node simultaneously; the answer is the first state whose mask is full. O(2^n * n^2) time.',
 '815':'Model ROUTES as nodes, not stops. Build a map from stop to the routes serving it, then BFS over routes; the answer is the number of routes taken. The modelling choice is the entire problem. O(total stops) time.',
 '752':'BFS over 4-digit strings with eight neighbours per state and the deadends as a blocked set. Bidirectional BFS halves it. O(10^4 * 8) time.',
 '773':'BFS over the flattened board string with a precomputed neighbour table for the blank position. A* with the Manhattan heuristic is the optimisation. O(6! * 6) time.',
 '1345':'BFS where neighbours are i-1, i+1, and every index sharing the value. CLEAR the value-to-indices bucket after using it once, or the whole thing degenerates to O(n^2).',
 '126':'Two phases: BFS from the start building a parent DAG level by level, then DFS backwards from the end to enumerate every shortest path. Do not try to collect paths during the BFS. O(n * k * 26) time.',
 '1976':'Dijkstra carrying a ways[] array: on a strict improvement reset ways, on a tie accumulate, all modulo 1e9+7. O(E log V) time.',
 '1928':'Dijkstra over the augmented state (cost, node, timeUsed) with dist as a 2-D array indexed by node and time. O(V * maxTime * log) time.',
 '2045':'BFS tracking the best AND second-best arrival time per node, plus modular arithmetic for the traffic lights - if the arrival lands in a red phase, wait until the next green. O(V+E) time.',
 '1334':'Floyd-Warshall with k as the OUTERMOST loop, then count reachable neighbours per node under the threshold. n is small enough that n^3 is intended. O(n^3) time.',
 '1192':'Tarjan bridges: disc[] and low[] with a timer, and an edge is a bridge when low[child] > disc[node]. Memorisation is acceptable here; nobody derives it live. O(V+E) time.',
 '1568':'The answer is always 0, 1 or 2. Check 0 (already disconnected), then try removing each cell and check for an articulation point, otherwise 2 - because any corner cell of an island has at most two neighbours. O((nm)^2) time.',
 '332':'Hierholzer: DFS consuming edges in lexical order, and APPEND the node AFTER the recursion returns, then reverse at the end. "Why after the recursion" is the probe. O(E log E) time.',
 '2097':'Directed Euler path: check the degree condition, pick the start with outdegree exceeding indegree, then Hierholzer. O(E) time.',
 '753':'de Bruijn sequence as an Euler circuit over the (n-1)-length prefix graph, built by Hierholzer. Beautiful and rarely required, but it is the intended answer. O(k^n) time.',
 '1857':'Topological order plus DP: carry a 26-wide colour count per node, and when relaxing an edge take the elementwise maximum. Cycle detection falls out of the topo sort. O((V+E)*26) time.',
 '2050':'Topo order with dp[v] = time[v] + max over predecessors of dp[u]. The pure shape of topo-plus-DP. O(V+E) time.',
 '1203':'Topological sort on TWO levels: order the groups, then order the items inside each group. Give every ungrouped item its own synthetic group first. A genuine L4-hard because of the bookkeeping. O(V+E) time.',
 '685':'Case analysis, not an algorithm. Find any node with two parents; if there is one, try removing each of its two candidate edges and test whether the rest is a valid tree. Otherwise it is a plain cycle, so remove the last cycle edge. O(n * alpha) time.',
 '1697':'The OFFLINE SWEEP archetype: sort queries by their limit and edges by weight, then walk the queries adding all edges below the limit into a DSU and answering connectivity. O((E+Q) log) time.',
 '1489':'Build the MST weight once. For each edge, force-exclude it and rebuild - a larger weight means critical; otherwise force-include it first and rebuild - an equal weight means pseudo-critical. O(E^2 * alpha) time.',
 '803':'REVERSE TIME with DSU. Remove all hits first, build the DSU with a virtual "roof" node, then add the hits back in reverse order and count the newly attached component size each time. O((nm) * alpha) time.',
 '1970':'Reverse time - start fully flooded and remove water backwards until the top and bottom connect via DSU - or binary search on the day plus a BFS check. O(nm * alpha) time.',
 '952':'DSU where each number is unioned with each of its prime factors, then the answer is the largest component. Factorise by trial division up to the square root. O(n sqrt(maxVal)) time.',
 '839':'DSU with an explicit O(n^2 * L) pairwise comparison, since two strings are similar if they differ in at most two positions. When the alphabet is small, generating all swaps is faster. O(n^2 L) time.',
 '827':'Label every island component with an id and record its size, then for each zero cell sum the sizes of its DISTINCT neighbouring ids plus one. The distinctness is the trap. O(nm) time.',
 '490':'Rolling-ball BFS - a move continues until the ball hits a wall, so the neighbours are the stopping positions, not the adjacent cells. Maze II is the same graph with Dijkstra over the distance rolled. O(nm * max(n,m)) time.',
 '818':'BFS or DP over an unusual state space of (position, speed), bounding the search by the target rather than exploring forever. The DP formulation with the "overshoot then reverse" case is the harder half. O(target log target).',
 '489':'Backtracking with NO coordinates: track relative position yourself, and after exploring a direction, execute the exact "turn twice, move, turn twice" sequence to restore both position and heading. The restore step is the problem. O(nm) time.'
});


PLAN.approach.bt = {
 '78':'Either the include/exclude recursion or the bitmask enumeration over 2^n. For duplicates, sort first and skip a value at the same depth when it equals the previous one. O(n * 2^n) time.',
 '46':'Swap-in-place recursion, or a used[] array with a result buffer. For duplicates, sort and skip when a[i] == a[i-1] and a[i-1] was NOT used at this level. O(n * n!) time.',
 '39':'Recurse carrying a start index so combinations are not repeated; reuse is allowed by passing the same index down. Version II passes i+1 and skips same-value siblings. O(n^(target/min)) time.',
 '77':'Standard combination recursion with a start index, plus the pruning that you can stop when the remaining elements cannot fill k slots. O(k * C(n,k)) time.',
 '17':'Recursion over digit positions, looping the letters for each digit. Nothing subtle - it is the template problem. O(4^n) time.',
 '22':'Backtrack with two counters; open while open < n, close while close < open. That invariant prevents every invalid string with no validity check. O(4^n / sqrt(n)) time.',
 '79':'DFS from every cell, mutating the board to a sentinel to mark visited and restoring it on the way out. In-place marking avoids a visited set. O(nm * 4^L) time.',
 '131':'Recurse over the split point, testing each prefix for palindromicity. Precompute an isPalindrome[i][j] table so the check is O(1). O(n * 2^n) time.',
 '93':'Recurse over four segments, each of length one to three, with the no-leading-zero and at-most-255 rules. Pure constraint enforcement. O(3^4) time.',
 '216':'Combination recursion over digits 1..9 with a start index, pruning when the running sum exceeds n or too few digits remain. O(C(9,k)) time.',
 '698':'Sort descending, then recurse assigning each number to a bucket, skipping buckets with the same running total and returning immediately if a number exactly fills a bucket. The bitmask DP over subsets is the other answer. O(k * 2^n) time.'
};


Object.assign(PLAN.approach.bt, {
 '51':'Column, and two diagonal sets keyed by row+col and row-col, placed row by row. The two diagonal keys are the whole trick. Version II just counts. O(n!) time.',
 '37':'Backtracking with row, column and 3x3 box bit sets. Choosing the most-constrained empty cell first is the optimisation that makes hard boards fast. O(9^m) worst case.',
 '212':'Trie of the words plus board DFS carrying the trie node, deleting words from the trie once found so branches die. O(nm * 4^L) with pruning.',
 '282':'Recurse over split points inserting +, - or *; carry both the running value and the LAST operand so multiplication can undo and reapply it. That last-operand carry is the whole problem. O(4^n) time.',
 '301':'BFS over strings by removal count so the first valid level is the minimum - or count the misplaced brackets first and DFS removing exactly that many, skipping consecutive duplicates. O(2^n) worst case.',
 '489':'Relative-coordinate backtracking with an exact go-back routine to restore position and heading. O(nm) time.',
 '291':'Backtrack over pattern characters trying every prefix of the remaining string, maintaining a bijection with both a forward map and a used-values set. O(n^m) time.',
 '425':'Trie with per-node prefix word lists, filling the square row by row where the next prefix is read off the column already built. O(n * 26^L) with pruning.',
 '465':'Reduce to net balances per person, drop the zeros, then backtrack settling the first non-zero balance against every later opposite-signed one. The bitmask-over-subsets DP is the polynomial-in-2^n alternative. O(n!) or O(2^n * n).',
 '843':'Interactive minimax. Guess the word that MINIMISES the size of the largest possible remaining candidate group, then filter by the returned match count. Random guessing among candidates also passes but the minimax argument is the answer. O(n^2) per round.',
 '679':'Recurse picking any two of the current numbers, applying all four operations (both orders for subtraction and division), and recursing on the reduced multiset. Compare against 24 with an epsilon because of floating point. O(1) - bounded search.'
});


PLAN.approach.dp = {
 '70':'dp[i] = dp[i-1] + dp[i-2], reduced to two rolling variables. Min Cost Climbing is the same recurrence with a cost added at each step. O(n) time, O(1) space.',
 '198':'dp[i] = max(dp[i-1], dp[i-2] + a[i]), two rolling variables. For the circular version, run it twice - excluding the first house and excluding the last - and take the max. O(n) time.',
 '53':'Kadane, which is the linear DP where the state is "best subarray ending here". Max Product tracks both the max and the min ending here. O(n) time.',
 '300':'The O(n^2) DP is dp[i] = 1 + max over j<i with a[j]<a[i]. The O(n log n) version maintains a tails array via binary search - and note the tails array is NOT itself a valid subsequence, only its length is right.',
 '322':'Unbounded knapsack: dp[amount] = 1 + min over coins of dp[amount-coin], iterating the amount in the OUTER loop for the minimum-count version. Coin Change II counts combinations, which needs the coin loop outside and the amount inside. O(n * amount) time.',
 '377':'Counts PERMUTATIONS, so the target loop must be outside and the coin loop inside - the exact mirror of Coin Change II. Getting this loop order right is the entire lesson. O(n * target) time.',
 '416':'0/1 knapsack for a subset summing to half the total; if the total is odd, return false immediately. Iterate the capacity DOWNWARD so each item is used once. O(n * sum) time.',
 '494':'Rewrite as a subset-sum: the positive subset must total (sum + target) / 2, which must be a non-negative integer. Then count subsets with 0/1 knapsack. O(n * sum) time.',
 '1143':'dp[i][j] = dp[i-1][j-1] + 1 on a match, else max(dp[i-1][j], dp[i][j-1]). Reduce to two rows. O(nm) time.',
 '72':'dp[i][j] = dp[i-1][j-1] on a match, else 1 + min of the three neighbours (replace, delete, insert). Know which neighbour is which operation. O(nm) time.',
 '5':'Centre expansion is O(n^2) with O(1) space and is the expected answer. The interval DP dp[i][j] is O(n^2) space. Counting substrings uses the same expansion; the palindromic SUBSEQUENCE is a different, interval DP.',
 '62':'dp[i][j] = dp[i-1][j] + dp[i][j-1], one row rolled. With obstacles, zero out the blocked cells; for min path sum, take the minimum instead of the sum. O(nm) time.',
 '91':'dp[i] = dp[i-1] if the single digit is valid, plus dp[i-2] if the two-digit pair is in 10..26. The zeros are where every bug lives. O(n) time.',
 '139':'dp[i] = true if some j < i has dp[j] true and s[j..i) in the dictionary. Word Break II needs memoised DFS returning the list of sentences, not a boolean. O(n^2 * k) time.',
 '279':'dp[i] = 1 + min over squares q <= i of dp[i-q]. Lagrange guarantees the answer is at most four, which is the mathematical shortcut. O(n sqrt(n)) time.',
 '121':'One pass tracking the minimum so far. Version II sums positive differences. With cooldown it becomes a small state machine over hold, sold and rest. O(n) time.',
 '221':'dp[i][j] = 1 + min of the three neighbours above and left when the cell is a 1. The side length squared is the area. O(nm) time.',
 '1024':'Greedy jump-game shape: sweep the time axis tracking the furthest reachable end within the current clip, incrementing the count when you must commit. The interval DP also works. O(n log n) time.',
 '337':'Tree DP returning (withThisNode, withoutThisNode) per node. O(n) time.',
 '837':'Sliding-window probability DP: dp[i] = the average of the previous maxPts values, maintained with a running window sum. The subtlety is stopping the window from including states at or beyond K. O(n) time.'
};


Object.assign(PLAN.approach.dp, {
 '312':'INTERVAL DP, and the reframing is the whole problem: iterate over the LAST balloon to burst in each interval, so its neighbours are the interval boundaries. dp[i][j] = max over k of dp[i][k] + a[i]*a[k]*a[j] + dp[k][j] on padded arrays. O(n^3) time.',
 '1039':'Interval DP over the last triangle formed: dp[i][j] = min over k of dp[i][k] + dp[k][j] + a[i]*a[k]*a[j]. The same shape as 312. O(n^3) time.',
 '1130':'Interval DP over the split point, carrying the maximum leaf in each interval - or the O(n) monotonic stack solution that repeatedly removes the smallest leaf. O(n^3) or O(n).',
 '546':'Interval DP with an EXTRA dimension: dp[i][j][k] where k is the number of boxes equal to box[i] already attached to the left. The third dimension is what makes it solvable. O(n^4) time.',
 '132':'Precompute an isPalindrome table, then dp[i] = min cuts for the prefix ending at i, taken over every j where s[j..i] is a palindrome. O(n^2) time.',
 '10':'dp[i][j] over pattern and text. The star case is the whole problem: it matches zero occurrences (dp[i][j-2]) or one more occurrence when the characters match (dp[i-1][j]). O(nm) time.',
 '44':'Same table shape but the star matches any sequence, so dp[i][j] = dp[i-1][j] or dp[i][j-1]. Simpler than 10 - do them adjacently to feel the difference. O(nm) time.',
 '97':'dp[i][j] = whether the first i of s1 and first j of s2 interleave to the first i+j of s3, taking a character from either side. The insight is that the third string index is DERIVED, not a dimension. O(nm) time.',
 '115':'dp[i][j] = dp[i-1][j-1] + dp[i-1][j] on a match, else dp[i-1][j]. Reduce to one row iterated backwards. O(nm) time.',
 '188':'dp[k][i] = max(dp[k][i-1], price[i] + best) where best = max over j of dp[k-1][j] - price[j], maintained as a running maximum to keep it O(nk). When k exceeds n/2 it collapses to the unlimited-transactions greedy.',
 '1349':'Bitmask DP per row: enumerate valid seat masks with no adjacent seats, and for each, check compatibility with the previous row\'s mask on the diagonals. dp[row][mask]. O(rows * 4^cols) time.',
 '698':'Bitmask DP over subsets: dp[mask] = the remainder in the current bucket, filled greedily. The backtracking version with sorting and pruning is usually faster in practice. O(n * 2^n) time.',
 '174':'DP BACKWARDS from the princess, because the health needed at a cell depends on the future, not the past. dp[i][j] = max(1, min(right, down) - grid[i][j]). Forward DP is the trap. O(nm) time.',
 '1235':'Sort by end time, then dp[i] = max(dp[i-1], profit + dp[binary search for the last compatible job]). O(n log n) time.',
 '315':'Merge sort counting, or a BIT over compressed ranks scanned right to left. O(n log n) time.',
 '552':'DP over the state (absences so far, trailing lates), which is six states total, iterated n times with matrix exponentiation available for very large n. O(n) time.',
 '887':'dp[k][m] = the maximum number of floors testable with k eggs and m moves, using dp[k][m] = dp[k-1][m-1] + dp[k][m-1] + 1. Inverting the question from "minimum moves" to "maximum floors" is the trick. O(k * log n) time.',
 '32':'Stack of indices seeded with -1, or two counter passes in both directions for O(1) space. The DP form is dp[i] = the length of the valid string ending at i. O(n) time.',
 '1000':'Interval DP with a third dimension for the number of remaining piles, and it is only possible when (n-1) mod (K-1) == 0. Check the feasibility condition before writing any DP. O(n^3 K) time.',
 '96':'Catalan numbers: dp[n] = sum over i of dp[i] * dp[n-1-i], choosing each value as the root. Version II builds the actual trees with the same recursion and memoisation on (low, high). O(n^2) time.',
 '902':'DIGIT DP. Count numbers with fewer digits by direct powers, then walk the digits of N left to right accumulating the counts for digits strictly smaller, and stop when a digit is not in the set. O(digits * setSize) time.'
});


PLAN.approach.bit = {
 '136':'XOR everything - pairs cancel. Version II (every element three times) sums bits per position modulo 3, or uses the two-variable ones/twos state machine. Version III XORs everything then splits on any set bit of the result. O(n) time, O(1) space.',
 '191':'Repeatedly clear the lowest set bit with n & (n-1) and count the iterations. Counting Bits uses dp[i] = dp[i >> 1] + (i & 1). O(setBits) / O(n).',
 '231':'Power of two is n > 0 && (n & (n-1)) == 0. Power of four adds a mask check that the single bit is in an even position. Power of three has no bit trick - use the largest power of three divisibility test. O(1).',
 '268':'XOR all indices with all values; the missing one survives. O(n) time, O(1) space.',
 '190':'Shift the result left and OR in the lowest bit of the input, 32 times. The divide-and-conquer swap of halves, then quarters, then bytes, is the O(log 32) flourish.',
 '371':'a XOR b is the sum without carries; (a AND b) << 1 is the carry. Loop until the carry is zero. Watch the language rules on negative shifts. O(1).',
 '7':'Pop digits with modulo and push with multiplication, checking against INT_MAX/10 BEFORE each multiply rather than after. Palindrome Number reverses only half the digits. O(digits).',
 '50':'Fast exponentiation: square the base and halve the exponent, multiplying into the result when the exponent is odd. Handle a negative exponent and the INT_MIN edge case. O(log n) time.',
 '172':'Count factors of five: n/5 + n/25 + n/125 + ... Twos are always more plentiful, which is why only fives matter. O(log n) time.',
 '204':'Sieve of Eratosthenes, starting the inner loop at i*i and stepping by i. O(n log log n) time.',
 '202':'Cycle detection on the digit-square-sum function - either Floyd slow-fast or a seen set. O(log n) per step.',
 '384':'Fisher-Yates: for i from the end down, swap a[i] with a random index in [0, i]. Swapping with a random index in [0, n) is the classic biased bug. O(n) time.',
 '528':'Prefix sums of the weights plus a binary search for the first prefix exceeding a uniform draw. O(log n) per pick.',
 '398':'Reservoir sampling for a stream: on the kth matching index, replace the current answer with probability 1/k. O(n) per pick, O(1) space.'
};


Object.assign(PLAN.approach.bit, {
 '421':'Binary trie, or the prefix-set greedy: build the answer bit by bit from the top, and at each step test whether some pair can achieve the candidate prefix using a set of masked values. O(32n) time.',
 '1707':'Offline - sort queries by limit and numbers ascending, inserting into the binary trie only up to the current limit before answering. O((n+q) log n) time.',
 '296':'The optimal meeting point is the MEDIAN, not the mean, in each dimension independently because the L1 distance separates. Collect the row and column coordinates, sort, take the medians. O(nm) time.',
 '899':'If k is 1 you can only rotate, so the answer is the best of the n rotations. If k is 2 or more you can achieve any permutation, so the answer is the sorted string. Proving the k>=2 case is the interview. O(n^2) / O(n log n).',
 '470':'Rejection sampling: generate a uniform value in 1..49 from two rand7 calls, reject anything above 40, and map the rest to 1..10. Rejecting rather than reusing the modulo is what keeps it uniform. O(1) expected.',
 '780':'Work BACKWARDS from the target using modulo instead of repeated subtraction, because the forward search branches and the backward one does not. Handle the boundary cases where one coordinate is already fixed. O(log(max)) time.',
 '372':'Fast exponentiation with the exponent given as a digit array: result = (result^10 * base^digit) modulo m, applied digit by digit. O(len * log 10) time.'
});


PLAN.approach.design = {
 '146':'Hashmap to node plus a doubly linked list with sentinel head and tail. O(1) get and put.',
 '155':'Second stack of running minima, or store (value, minSoFar) pairs. O(1) per operation.',
 '380':'Array plus a value-to-index map, deleting by swapping with the last element. O(1) all three operations.',
 '232':'Two stacks with amortised O(1) pop: move from in to out only when out is empty. The queue-from-stacks direction makes one operation O(n).',
 '705':'Array of buckets with chaining, plus a load factor and a resize that rehashes. The interview is the collision strategy and when to resize. O(1) expected.',
 '622':'Fixed array with head index and size (rather than head and tail, which makes full and empty ambiguous). All operations O(1).',
 '348':'Do NOT scan the board. Keep per-row, per-column and two diagonal counters, adding +1 for player one and -1 for player two; a magnitude of n means a win. O(1) per move.',
 '359':'Map from message to the next allowed timestamp. O(1) per call, with the unbounded-memory follow-up being the real question.',
 '362':'Circular array of 300 buckets holding (timestamp, count), overwriting a bucket whose timestamp is stale. The scaling follow-up - distributed, high volume - IS the interview. O(1) hit, O(300) count.',
 '981':'Key to an append-only list of (timestamp, value) plus binary search. O(log n) per get.',
 '173':'Iterative inorder with the left spine held on a stack. O(1) amortised next, O(h) space.',
 '295':'Two heaps rebalanced by size. O(log n) add, O(1) find.'
};


Object.assign(PLAN.approach.design, {
 '460':'Key to node, key to frequency, frequency to a doubly linked list, plus a minimum-frequency tracker. O(1) both operations.',
 '588':'Directory tree of nodes with a children map and optional content; ls sorts the child names. O(path + children log children).',
 '642':'Trie whose nodes carry the top three sentences below them, plus an input buffer committed on the hash character. O(k) per keystroke.',
 '855':'Sorted structure of occupied seats; on seat(), scan or maintain a max-heap of gaps keyed by (distance, index) with lazy deletion. The gap-heap version is the one that gets you the follow-up. O(log n) per call.',
 '895':'Value to a stack of frequencies, frequency to a stack of values, plus a maximum-frequency counter. O(1) both.',
 '900':'Store the run-length pairs and a pointer plus an offset into the current run, consuming whole runs at a time rather than one element at a time. O(1) amortised.',
 '158':'The state between calls is the whole problem: keep a four-character buffer and an offset, serving from it first and only calling read4 when it is exhausted. O(n) per call.',
 '307':'Fenwick tree (BIT) with point update and prefix-sum query, or a segment tree. Both O(log n) per operation; the BIT is half the code.',
 '715':'TreeMap of disjoint intervals with merge on add and split on remove. O(log n) amortised.',
 '729':'I is a sorted structure with a neighbour check; II tracks booked and double-booked sets; III is a difference map swept for the maximum. The three together are the interval-counting progression. O(log n) to O(n).',
 '1146':'Per index, an append-only list of (snapId, value) plus binary search on get. snap() just increments a counter - copying the array is the trap. O(log n) per get.',
 '432':'Doubly linked list of count-buckets, each holding a set of keys at that count, plus a key-to-bucket map. Increment moves a key to the neighbouring bucket. O(1) all operations.',
 '218':'Max-heap sweep with lazy deletion, emitting a point on every change of maximum. O(n log n) time.'
});

/* ================================================== DERIVE + CORRECTNESS ===
   Two things the pattern tables do not carry.

   DERIVE   the reasoning chain from a statement you have never seen to the
            row of block A it belongs to. The tables tell you what the move
            IS; this tells you how to GET there.

   PROOF    why the move is correct. Google probes this directly - "how do
            you know the greedy is optimal" - and it is the one part of DSA
            preparation that almost nobody rehearses.                       */


PLAN.derive = {
 arr:'Ask what the query is over. A RANGE of the array means prefix sums; a COUNT of subarrays means prefix sums plus a hashmap; repeated range UPDATES mean a difference array. If the ask is a single best contiguous stretch, it is Kadane. If the constraint says O(1) extra space and the values happen to lie in [1..n], the array itself is the hashmap - negate or cyclic-sort. If it is a matrix, stop thinking about the values and think about the coordinate transform.',
 twop:'Two pointers need a MONOTONE reason to move one side. Sorted input gives it - moving inward changes the sum in a known direction. A window gives it when the quantity you track only worsens as the window grows, which is why all-positive is required for sum windows and why negatives force a deque instead. If the ask is "exactly K", write atMost(K) - atMost(K-1) rather than a new window.',
 str:'Strings are one of four things. A comparison up to reordering means a canonical key - sorted string or count signature. A nesting or matching structure means a stack. A rigid specification with edge cases means a state machine, and the specification IS the problem. A substring search or repetition question means KMP, Z or a rolling hash - and if the ask is the LONGEST such substring, binary search the length on top of the hash.',
 hash:'Reach for a map when you need O(1) membership or an O(1) count, and reach for a map PLUS a second structure when you also need order or extremes. The composition table in section 17 is the real answer here: map plus doubly linked list is LRU, map plus buckets is LFU, map plus array is O(1) random access. The question "what does the map alone fail to give me" picks the partner structure.',
 bs:'Two different questions wear the same clothes. If the array is sorted, you are searching an INDEX and the only work is picking a lower- or upper-bound template. If the array is not sorted but the answer is a number with a monotone feasibility test - larger is always easier, or always harder - you are searching the ANSWER. In that case write feasible(x) first and the search is boilerplate. The tell is a question phrased as "minimum largest", "maximum smallest", or "minimum days to".',
 sort:'Greedy needs a sorting key, and choosing it is the whole problem. Sort by END for interval scheduling and non-overlap; by start for merging; by a custom pairwise comparator when the objective is a concatenation or a ratio. If the greedy needs to revise an earlier choice, it is not a greedy - it is a heap, where you take everything and evict the worst so far. That is the shape of 502, 630, 871 and 1642.',
 ll:'Almost every list problem is one of four moves, or a composition of them: slow-fast pointers, in-place reversal, a dummy head, and two pointers a fixed gap apart. If the problem asks for O(1) space, the answer is one of those. If it asks for a data structure with list-like ordering plus O(1) lookup, you are in section 17.',
 stack:'A stack means the answer for an element depends on a LATER element that has not arrived yet - so you park it. Monotonic decreasing gives you the next greater element; monotonic increasing gives you the next smaller and therefore the boundaries of the region an element dominates. If the question counts subarrays where an element is the min or max, it is the contribution technique on a monotonic stack, not a DP. Parsing with nesting is the other family entirely.',
 heap:'A heap answers "what is the extreme right now" while the set keeps changing. Size-k heap for top-k; two heaps for a running median; a heap of one entry per list for a k-way merge; a heap as the revision mechanism for a greedy that must undo a choice. If nothing changes over time, sort instead - a heap over a static array is usually the wrong answer.',
 intv:'First decide whether you need the intervals themselves or just the COUNT at each point. Counting means a sweep over +1/-1 events or a difference map, and it is almost always simpler. Needing the intervals means sorting - by start to merge, by end to schedule. If intervals arrive online, you need an ordered structure with neighbour lookup rather than a sort.',
 tree:'Ask which direction the information flows. Upward from children means post-order returning a value, and the classic bug is returning the answer instead of the quantity the parent needs - 543 and 124 are the same mistake. Downward from the root means pre-order carrying state, such as bounds in 98 or a prefix map in 437. Needing BOTH directions is rerooting, which is two passes. Level structure means BFS. A BST adds the invariant that lets you discard half.',
 trie:'A trie is for prefix structure over a set of strings that you will query many times. The tell is many words against many queries, or a per-character search that would otherwise restart per word - which is why 212 is a trie plus DFS rather than a DFS per word. Store aggregates at nodes when the query is not just membership: top-k completions, palindromic suffixes, or the smallest index below.',
 graph:'Two questions, in this order. What is a STATE, and what states are one move away? Answer those and the search is boilerplate - which is why the implicit-graph problems are not harder, only less obvious. Then pick the engine by edge weight: unweighted is BFS, weights of only 0 and 1 is a deque, positive weights is Dijkstra, negative or exactly-k-edges is Bellman-Ford, all pairs with small n is Floyd-Warshall. If the state has an extra budget - stops, removals, keys, fuel - it goes INTO the state and dist becomes multi-dimensional. If the question is about connectivity under adding things, it is DSU; under REMOVING things, it is DSU run backwards in time.',
 bt:'Backtracking is for enumerating, and the questions are always the same three: what is one choice, what makes a choice illegal, and when am I done. Duplicates are handled by sorting and skipping equal siblings at the same depth - never by de-duplicating the output afterwards. If the problem asks for a count rather than the items, check whether a DP collapses the search first.',
 dp:'STATE FIRST, always. Write down what the smallest set of facts is that determines the rest of the problem, and the transition usually falls out. The tells: a decision at each index is linear DP; two strings is a 2-D table; "at most k of something" adds a dimension; n <= 20 means the state includes a bitmask; and if the answer depends on a range whose ends move independently, it is interval DP - where the reframing is usually to iterate over the LAST thing done rather than the first.',
 bit:'Bit tricks are recognition, not derivation - XOR cancels pairs, n & (n-1) clears the lowest set bit, n & -n isolates it, and a mask over n <= 20 elements is a set. The math side is different: ask whether the answer has a closed form (trailing zeroes, Catalan), whether it needs modular exponentiation, and whether the correct centre is the median rather than the mean.',
 design:'Every design question is "one structure cannot do this alone, so which two". Name the operations and their required costs, find the one operation the obvious structure fails, then add the partner that fixes exactly that. Hashmap plus doubly linked list, array plus index map, two heaps, sorted structure plus binary search, buckets plus a pointer to the extreme. If a query needs a range aggregate under updates, that is a BIT or a segment tree.'
};


PLAN.proof = {
 intro:'"How do you know that is correct?" is a Google question, it is an Uber question, and it is the difference between a candidate who recalls an algorithm and one who understands it. There are only a handful of argument shapes, and each has a sentence you can say out loud.',
 note:'You do not need a formal proof in an interview. You need the ONE sentence that names why the algorithm cannot go wrong, delivered before the interviewer has to ask for it.',
 rows:[
  ['Exchange argument','Greedy is optimal. Take any optimal solution, and show you can swap one of its choices for the greedy choice WITHOUT making it worse. Repeat, and you have transformed the optimum into the greedy solution.',
   '"Take an optimal schedule. If it does not use the interval that finishes earliest, swap that interval in - it ends no later, so nothing that followed can now conflict. So there is an optimal solution containing the greedy choice."',
   'Interval scheduling (435, 452) · Huffman (1167) · Jump Game II · Task Scheduler'],
  ['Cut-and-paste','DP has optimal substructure. Assume the optimal solution to the whole contains a sub-solution that is NOT optimal for its subproblem; cut it out, paste in the better one, and the whole improves - contradiction.',
   '"If the best path to this cell went through a suboptimal path to the cell above it, I could substitute the better prefix and get a better total, which contradicts optimality. So the subproblem answers compose."',
   'Every DP · shortest paths · edit distance'],
  ['Loop invariant','A property that holds before the loop, is preserved by each iteration, and gives you the answer when the loop ends. This is the argument for almost every two-pointer solution.',
   '"The invariant is that the true answer always lies between left and right. Moving the shorter wall inward cannot remove a better solution, because any pair using that wall is bounded by it. So the invariant survives, and when the pointers meet we have checked everything that could have won."',
   'Two pointers (11, 42) · binary search · Dutch flag (75) · cyclic sort'],
  ['Monotonicity','Binary search on the answer is valid only if feasibility is monotone: if x works, everything larger works. State it, and the search is justified.',
   '"If a ship of capacity c can finish in d days, so can any larger capacity - feasibility is monotone in c - so the set of feasible capacities is an upward-closed interval and I can binary search its boundary."',
   '875 · 1011 · 410 · 774 · 1552 · 1482'],
  ['Greedy stays ahead','A weaker but often easier argument than exchange: show that after every step the greedy solution is at least as far along as any other, by an explicit measure.',
   '"After processing k intervals, the greedy has an end time no later than any other valid selection of k. By induction it can never be overtaken."',
   'Jump Game · activity selection · 134 Gas Station'],
  ['Dijkstra\'s finality invariant','When a node is popped from the min-heap its distance is final. The argument is that any other route to it must pass through a node still in the heap, which already has a distance at least as large - and edges are non-negative.',
   '"Non-negative weights are what make this work: any alternative path leaves the settled set through a frontier node whose tentative distance is already at least as large, so it cannot come back cheaper."',
   '743 · 787 · 1631 · 1976 · and the reason negative edges force Bellman-Ford'],
  ['Topological invariant','Processing in topological order means every predecessor of the node you are on is already final. Say that out loud before writing the DP.',
   '"By the time I reach v in topological order, every edge into v has already been relaxed, so dp[v] is complete when I leave it."',
   '1857 · 2050 · 1203 · 329'],
  ['Amortised analysis','An individual operation is expensive but the total across n operations is bounded. The accounting argument is that each element can only be charged once.',
   '"Each element is pushed once and popped once across the whole run, so although a single step can pop many elements, the total work is O(n) rather than O(n^2)."',
   'Monotonic stack (84, 739) · two stacks as a queue (232) · sliding-window deque (239) · DSU with path compression'],
  ['Pigeonhole / counting','The answer is forced by a counting fact rather than by a search.',
   '"There are n+1 values in a range of size n, so by pigeonhole a duplicate must exist - which is also what guarantees the functional graph in 287 contains a cycle."',
   '287 · 41 First Missing Positive · 169 majority · 1568'],
  ['Contribution / linearity','Instead of enumerating the objects, count how much each element contributes across all of them, and sum. Turns an O(n^2) enumeration into O(n).',
   '"Rather than enumerating subarrays, I ask for each element how many subarrays it is the minimum of - that is (i - prevSmaller) * (nextSmaller - i) - and multiply. Summing contributions gives the same total."',
   '907 · 2104 · 828 · 891'],
  ['Reduction','Prove correctness by showing the problem IS another problem you already trust, rather than by arguing from scratch.',
   '"Minimising the maximum edge on a path is exactly the question Kruskal answers - the moment the two nodes become connected, the edge that connected them is the minimax bottleneck. So 1631, 778 and 1102 are one problem."',
   '778 = 1631 · 525 = 560 · 1248 = 930 · 214 via KMP'],
  ['Adversary / lower bound','Why you cannot do better, which is the answer to "can this be faster?"',
   '"Any comparison-based sort needs O(n log n) because the decision tree has n! leaves. If you want linear, you have to stop comparing - which is what counting and bucket sorts do, and why they need bounded values."',
   'Answering "why not faster" on sorting, selection, and top-k']
 ],
 drill:'Take any ten problems you have already solved and say the correctness sentence out loud for each. If you cannot, you learned the code rather than the algorithm - and that is precisely the gap a twisted variant exposes.'
};


/* --- machinery the block-A tables were missing. Appended, never inserted:
       pattern progress is keyed by index, so adding to the END is safe. --- */

(function () {
  function sec(id) { var out = null; PLAN.sections.forEach(function (s) { if (s.id === id) out = s; }); return out; }

  sec('str').p.push(
   ['Z-algorithm', '"how far does the string match ITSELF starting here", all-borders questions',
    'z[i] = the length of the longest substring at i that is also a prefix. Same jobs as KMP, easier to derive live - the two-pointer window [l,r] is the whole implementation', 'O(n)'],
   ['Manacher', 'ALL palindromic substrings, or the longest one, when O(n^2) centre expansion will not fit',
    'Interleave separators so every palindrome is odd-length, then reuse the mirror radius under the current rightmost palindrome. Know it exists and what it buys; centre expansion is the expected answer', 'O(n)']
  );

  sec('bit').p.push(
   ['Matrix exponentiation', 'a LINEAR recurrence with n up to 1e18 - "how many ways after n steps"',
    'Write the recurrence as a transition matrix and raise it to the n-th power by fast exponentiation. Any DP whose state is a fixed-size vector qualifies', 'O(k^3 log n)']
  );

  sec('design').p.push(
   ['Lazy propagation', 'RANGE update AND range query together - "add v to [l,r]" then "sum/min over [l,r]"',
    'Segment tree where a pending update sits at a node until a query forces it down. A BIT cannot do this; the moment updates are ranges rather than points, this is the structure', 'O(log n)'],
   ['Sqrt decomposition', 'range queries with an awkward operation no segment tree merges cleanly, or n small enough not to bother',
    'Split into blocks of sqrt(n), keep an aggregate per block, and answer with whole blocks plus two partial ends. Much easier to write correctly under pressure than a segment tree', 'O(sqrt n)']
  );
})();


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


export default PLAN;
