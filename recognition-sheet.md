# The Recognition Sheet

**Built:** 2026-08-27 · companion to `PLAN.md`

**The one goal:** you read a question you have never seen, and within 60 seconds you say *"this is X wearing a costume."* Not "I have solved this before" — that is memory, and it fails on twisted variants. **"I recognise the machinery"** — that is transfer, and it survives rewording.

---

## HOW TO USE THIS

Every section has three blocks.

| Block | What it is | How you work it |
|---|---|---|
| **A · Patterns** | The machinery of the section. Each row is **disguise → move**. The disguise column is the whole point — it is what the interviewer says, not what the textbook calls it. | **Drill it.** Cover the right column, read a disguise, say the move out loud. Under 5 seconds or it is not learned. |
| **B · Tier 1–2** | JP Morgan · Amex · Expedia · Amazon · Microsoft · Adobe. High-frequency, medium-difficulty, recognisable. | **Solve them.** These are the offer that gets you out. |
| **C · Google / Uber L4** | Extra machinery the top tier needs, plus questions chosen for *transferable insight*, not volume. | **Phase 3.** Solve cold, narrated, timed. |

**Rules that make this work:**

1. Block A is drilled *before* the questions of that section, and re-drilled weekly. The patterns are the index; the questions are how you build it.
2. Never solve a question without first saying which row of block A it is. If you cannot name the row, you are pattern-matching on the problem statement, not the machinery.
3. When a question does not fit any row, that is the most valuable moment in the sheet — **add a row.** This document is meant to be written in.
4. A question appears in exactly one section, even when it uses three patterns. Its home is the pattern that *unlocks* it.

**Difficulty legend:** `E` easy · `M` medium · `H` hard · `H+` genuinely nasty

---

# PART I — DSA

Seventeen sections. Weight is deliberately uneven — Arrays, Strings, Trees, Graphs and DP carry the plan; Bit/Math and Design are small on purpose.

---

## §1 · ARRAYS — prefix, Kadane, in-place

### A · Patterns

| Pattern | The disguise — what you actually hear | The move | Cost |
|---|---|---|---|
| **Prefix sum** | "sum of any range", "queries on subarrays", repeated range totals | Build `pre[i]`; answer = `pre[r+1]-pre[l]` | O(n) build, O(1) query |
| **Prefix + hashmap** | "count subarrays summing to K", "divisible by K", "equal 0s and 1s" | Seed `{0:1}`; look up `pre-K`. For divisibility store `pre % K` | O(n) |
| **Difference array** | "add v to every index in [l,r]", many range updates then one read | `d[l]+=v; d[r+1]-=v`, prefix at the end | O(1) per update |
| **Kadane** | "maximum sum subarray", "best contiguous stretch" | `cur = max(x, cur+x)`; track global | O(n) |
| **Kadane, two-sided** | max **product** subarray, sign flips | Track `maxEnd` **and** `minEnd` — a negative can become the max | O(n) |
| **Boyer–Moore voting** | "element appearing more than n/2 (or n/3) times", O(1) space demanded | Candidate + counter; n/3 needs two candidates and a verify pass | O(n), O(1) space |
| **Dutch national flag** | "sort 0/1/2", "partition into three groups", one pass, in place | Three pointers `low, mid, high` | O(n), one pass |
| **Index-as-hashmap** | Values are in `[1..n]`, "find the missing / duplicate", O(1) space | Negate `a[abs(x)-1]`, or cyclic-sort `a[i]` to position `a[i]-1` | O(n), O(1) space |
| **Product except self** | "without division", "product/sum of everything but me" | Left-pass prefix, right-pass suffix, multiply | O(n), O(1) extra |
| **Rotate / reverse trick** | "rotate by k in place" | Reverse all, reverse first k, reverse rest | O(n), O(1) |
| **Matrix as coordinates** | spiral, rotate 90°, set-zeroes | Rotate = transpose + reverse rows. Set-zeroes = use row 0/col 0 as the marker | O(nm) |

### B · Tier 1–2

| LC | Name | D | The thing it teaches |
|---|---|---|---|
| 1 | Two Sum | E | Hashmap complement — the ur-pattern |
| 121 | Best Time to Buy and Sell Stock | E | Kadane in disguise: track min-so-far |
| 53 | Maximum Subarray | M | Kadane itself |
| 152 | Maximum Product Subarray | M | Why you must track the min too |
| 238 | Product of Array Except Self | M | Prefix/suffix without division |
| 169 | Majority Element | E | Boyer–Moore; the O(1)-space follow-up is the real question |
| 229 | Majority Element II | M | Two candidates + verification pass |
| 75 | Sort Colors | M | Dutch national flag, one pass |
| 268 | Missing Number | E | XOR or sum; know both |
| 287 | Find the Duplicate Number | M | Read-only + O(1) space ⇒ Floyd cycle on indices |
| 442 | Find All Duplicates in an Array | M | Index-as-hashmap by negation |
| 448 | Find All Numbers Disappeared | E | Same trick |
| 41 | First Missing Positive | H | Cyclic sort. **Amazon and Adobe favourite** |
| 88 | Merge Sorted Array | E | Fill backwards |
| 189 | Rotate Array | M | Three reversals |
| 66 | Plus One | E | Carry propagation, watch all-nines |
| 73 | Set Matrix Zeroes | M | O(1) space via first row/col as flags |
| 54 | Spiral Matrix | M | Four bounds, shrink; off-by-one discipline |
| 48 | Rotate Image | M | Transpose then reverse |
| 240 | Search a 2D Matrix II | M | Staircase from top-right |
| 560 | Subarray Sum Equals K | M | Prefix + hashmap seeded `{0:1}` |
| 523 | Continuous Subarray Sum | M | Prefix modulo K |
| 525 | Contiguous Array | M | Map 0→−1, then it is 560 |
| 1010 | Pairs of Songs Divisible by 60 | M | Counting by remainder — **Amazon** |
| 495 | Teemo Attacking | E | Interval merge as arithmetic |
| 918 | Maximum Sum Circular Subarray | M | max(Kadane, total − minKadane), guard all-negative |

### C · Google / Uber L4

**Extra machinery:** merge-sort as a counting device · binary search on a *real-valued* answer · difference arrays over 2-D · monotonic deque over a window · prefix with a BIT when the transition needs a range query.

| LC | Name | D | Why it is here |
|---|---|---|---|
| 4 | Median of Two Sorted Arrays | H | Binary search on the *partition*, not the value. The canonical "you must think, not recall" |
| 315 | Count of Smaller Numbers After Self | H | Merge sort as a counter, or BIT on ranks. **Google pack** |
| 493 | Reverse Pairs | H | Same machinery, different predicate — proves transfer |
| 327 | Count of Range Sum | H | Prefix + merge sort; three ideas composed |
| 239 | Sliding Window Maximum | H | Monotonic deque — the template you will reuse |
| 84 | Largest Rectangle in Histogram | H | Monotonic stack; the parent of 85 |
| 85 | Maximal Rectangle | H | 84 applied per row. Composition |
| 42 | Trapping Rain Water | H | Three solutions (DP, two-pointer, stack). Know why two-pointer is correct |
| 407 | Trapping Rain Water II | H+ | Heap from the border inward. A genuine step up |
| 862 | Shortest Subarray with Sum ≥ K | H | Negatives break sliding window ⇒ monotonic deque over prefix |
| 410 | Split Array Largest Sum | H | Binary search on the answer; write `feasible(x)` first |
| 774 | Minimize Max Distance to Gas Station | H | Binary search on a **real** answer. **Google premium** |
| 2251 | Number of Flowers in Full Bloom | H | Two sorted arrays + binary search, or difference-map sweep |

---

## §2 · TWO POINTERS & SLIDING WINDOW

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Opposite-end two pointers** | Sorted input, "pair/triplet summing to target", "container", "palindrome" | `lo`, `hi`; move the one that can improve the objective | O(n) |
| **Same-direction (fast/slow)** | "remove in place", "move zeroes", "dedupe sorted" | Write pointer trails read pointer | O(n), O(1) |
| **Fixed-size window** | "every subarray of length k", "average of k" | Add right, drop left, no shrink loop | O(n) |
| **Variable window — shrink while invalid** | "longest substring such that…", "smallest subarray with sum ≥ …" | Expand right always; `while (invalid) shrink left` | O(n) |
| **Window with a counter map** | "at most K distinct", "contains all of T", anagram windows | Map of counts + a `formed`/`distinct` scalar so the check is O(1) | O(n) |
| **atMost(K) − atMost(K−1)** | **"exactly K"** anything | Solve "at most" twice and subtract. Never try to write "exactly" directly | O(n) |
| **Two pointers over two arrays** | merge, intersection, "is subsequence" | Advance the smaller/matched side | O(n+m) |
| **Cycle detection (Floyd)** | "no extra space", "find where it repeats", value range implies a functional graph | Slow/fast, then reset one to head | O(n), O(1) |

> **The single most common bug:** shrinking with `if` instead of `while`. Say the invariant out loud before writing the loop: *"while the window is invalid, shrink."*

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 125 | Valid Palindrome | E | Filtering + opposite ends |
| 680 | Valid Palindrome II | E | One-deletion branch |
| 167 | Two Sum II | M | Opposite ends on sorted |
| 15 | 3Sum | M | Sort + fix one + two pointers. **Dedup is the interview** |
| 16 | 3Sum Closest | M | Same skeleton, different objective |
| 18 | 4Sum | M | Generalising the skeleton |
| 11 | Container With Most Water | M | Why moving the shorter side is safe — prove it |
| 26/27/283 | Remove Dups / Element / Move Zeroes | E | Write-pointer idiom |
| 3 | Longest Substring Without Repeating | M | Variable window + last-seen map |
| 209 | Minimum Size Subarray Sum | M | Shrink-while |
| 424 | Longest Repeating Character Replacement | M | Window valid when `len − maxFreq ≤ k` |
| 567 | Permutation in String | M | Fixed window + count compare |
| 438 | Find All Anagrams | M | Same |
| 76 | Minimum Window Substring | H | The `formed` counter. **Asked everywhere** |
| 340 | Longest Substring with At Most K Distinct | M | *Premium.* The archetype |
| 141/142 | Linked List Cycle I & II | E/M | Floyd; prove why the second phase meets at the entry |
| 234 | Palindrome Linked List | E | Fast/slow + reverse half. O(1) space expected |
| 986 | Interval List Intersections | M | Two pointers over intervals |
| 392 | Is Subsequence | E | And the follow-up: many queries ⇒ preprocess |

### C · Google / Uber L4

**Extra machinery:** window over a *transformed* array · monotonic deque inside a window · "exactly K" by subtraction · windows where the shrink condition is not monotone (⇒ deque or heap) · two-pointer on a sorted-by-something-else key.

| LC | Name | D | Why |
|---|---|---|---|
| 992 | Subarrays with K Different Integers | H | The atMost subtraction, at its purest |
| 930 | Binary Subarrays With Sum | M | Same trick, easier — do it first |
| 1248 | Count Number of Nice Subarrays | M | Same trick, third dress |
| 480 | Sliding Window Median | H | Two heaps + **lazy deletion**. Broadly reusable |
| 239 | Sliding Window Maximum | H | Monotonic deque |
| 727 | Minimum Window Subsequence | H | *Premium.* Subsequence ≠ substring — **Google & Uber** |
| 683 | K Empty Slots | H | *Premium.* Window over a transformed array |
| 76 | Minimum Window Substring | H | Re-solve blind in Phase 3 |
| 1004 | Max Consecutive Ones III | M | Window with a budget |
| 1234 | Replace Substring for Balanced String | M | Window on the *complement* — a real inversion of thinking |
| 828 | Count Unique Characters of All Substrings | H | Contribution counting, not windowing. Know when the window fails |

---

## §3 · STRINGS

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Frequency map / anagram key** | "anagram", "permutation of", "group by" | 26-array or sorted-string as the key | O(n) |
| **Expand around centre** | "longest palindromic substring", "count palindromes" | 2n−1 centres, expand both ways | O(n²) |
| **Two pointers** | "reverse words", "valid palindrome", in-place | See §2 | O(n) |
| **Stack parsing** | nested brackets, "decode k[abc]", calculator | Push context on open, pop on close | O(n) |
| **State machine / spec-following** | atoi, "valid number", IP validation, text justification | Enumerate the states first, code second. **The spec is the problem** | O(n) |
| **Rolling hash (Rabin–Karp)** | "find repeated substring of length L", dedupe by content | Hash, slide, verify collisions | O(n) |
| **KMP failure function** | "shortest prefix that is also a suffix", "does the string repeat" | `lps[]` | O(n) |
| **Trie** | prefix / dictionary / autocomplete | See §12 | — |
| **Char-count sliding window** | see §2 | | |
| **Encode with framing** | serialize a list of strings unambiguously | `len + '#' + payload` — never a delimiter alone | O(n) |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 242 | Valid Anagram | E | Count array |
| 49 | Group Anagrams | M | Canonical key choice |
| 5 | Longest Palindromic Substring | M | Expand around centre. **Amazon** |
| 647 | Palindromic Substrings | M | Same engine, counting |
| 20 | Valid Parentheses | E | Stack |
| 22 | Generate Parentheses | M | Backtracking with a validity counter |
| 151 | Reverse Words in a String | M | **Microsoft**; 186 is the in-place version |
| 8 | String to Integer (atoi) | M | Pure spec discipline. **Microsoft/Adobe** |
| 13/12 | Roman ↔ Integer | E | Table-driven |
| 14 | Longest Common Prefix | E | Vertical scan |
| 28 | Find the Index of the First Occurrence | E | Naive, then KMP as the follow-up |
| 344/345 | Reverse String / Vowels | E | Two pointers |
| 387 | First Unique Character | E | Two passes |
| 819 | Most Common Word | E | **Amazon** — string hygiene under time pressure |
| 937 | Reorder Data in Log Files | M | **Amazon rite of passage** — custom comparator |
| 271 | Encode and Decode Strings | M | *Premium.* Length-framing |
| 443 | String Compression | M | In-place write pointer |
| 6 | Zigzag Conversion | M | Index arithmetic, easy to fumble |
| 68 | Text Justification | H | **The most Google-flavoured spec problem** — also asked at Uber |
| 468 | Validate IP Address | M | **Microsoft** — spec discipline |
| 273 | Integer to English Words | H | **Uber/Microsoft.** Tedious on purpose; tests care |

### C · Google / Uber L4

**Extra machinery:** KMP and its `lps` reuse · Z-function · rolling hash with double modulus · suffix structures conceptually · counting *contributions* instead of enumerating substrings · DP over strings (see §15).

| LC | Name | D | Why |
|---|---|---|---|
| 1044 | Longest Duplicate Substring | H+ | Binary search on length + rolling hash. Two techniques composed |
| 214 | Shortest Palindrome | H | KMP on `s + '#' + reverse(s)` — the trick worth owning |
| 459 | Repeated Substring Pattern | E | Falls straight out of `lps` |
| 336 | Palindrome Pairs | H | Trie or reversed-prefix hashmap. **Google pack** |
| 76 | Minimum Window Substring | H | — |
| 809 | Expressive Words | M | **Google pack** — two-pointer group counting |
| 777 | Swap Adjacent in LR String | M | **Google pack.** Code is short, the invariant proof is the interview |
| 833 | Find And Replace in String | M | **Google pack** — index bookkeeping |
| 726 | Number of Atoms | H | **Uber** — recursive parsing |
| 224/227/772 | Basic Calculator I / II / III | H | **Uber & Google.** Do all three; III is the real one |
| 394 | Decode String | M | Stack of (count, built-so-far) |
| 65 | Valid Number | H | State machine. Horrible and instructive |
| 30 | Substring with Concatenation of All Words | H | Window of words, not chars |

---

## §4 · HASHING & COUNTING

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Complement lookup** | "two things that add to X" | Map value→index, look for `target−x` | O(n) |
| **Canonical key** | "group these", "are these the same shape" | Choose a key that is equal iff the things are equal — sorted string, normalised tuple, serialized subtree | O(n·k) |
| **Count then decide** | "top K frequent", "most common", "can we rearrange" | Counter, then heap / bucket / greedy | O(n) |
| **Bucket by frequency** | "top K" with K near n, or O(n) demanded | `buckets[freq] = [items]`, walk down | O(n) |
| **Seen-set as a graph probe** | "longest consecutive sequence" | Only start a run at `x` when `x−1 ∉ set` | O(n) |
| **Prefix state → map** | see §1 | | |
| **Hash + doubly linked list** | "O(1) get, put, and eviction" | LRU. See §17 | O(1) |
| **Rolling / incremental key** | dedupe streaming content | Rolling hash | O(n) |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 217/219 | Contains Duplicate I & II | E | Set, then windowed set |
| 128 | Longest Consecutive Sequence | M | The `x−1 ∉ set` guard is the whole problem |
| 347 | Top K Frequent Elements | M | Heap **and** bucket sort — know both |
| 692 | Top K Frequent Words | M | **Amazon/Google.** The lexicographic tie-break is where people fail |
| 383/205/290 | Ransom Note / Isomorphic / Word Pattern | E | Bijection needs **two** maps |
| 349/350 | Intersection of Two Arrays I & II | E | Set vs multiset |
| 249 | Group Shifted Strings | M | *Premium.* Canonical key design |
| 380 | Insert Delete GetRandom O(1) | M | **Amazon/Uber.** Array + index map; swap-with-last on delete |
| 381 | …with Duplicates allowed | H | Same, with a set of indices |
| 146 | LRU Cache | M | **Everywhere.** See §17 |
| 1152 | Analyze User Website Visit Pattern | M | *Premium.* **Amazon** — deliberately messy, and that is the point |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 652 | Find Duplicate Subtrees | M | Canonical serialization + id assignment to dodge O(n²) strings |
| 288 | Unique Word Abbreviation | M | *Premium.* **Google pack** |
| 359 | Logger Rate Limiter | E | *Premium.* **Google & Uber** — design warm-up |
| 981 | Time Based Key-Value Store | M | **Uber** — map to sorted list + binary search |
| 895 | Maximum Frequency Stack | H | **Uber** — stack of stacks keyed by frequency |
| 460 | LFU Cache | H | Two maps + frequency buckets. The hard sibling of 146 |
| 936 | Stamping The Sequence | H | Reverse thinking + greedy matching |

---

## §5 · BINARY SEARCH

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **First-true / last-true** | "find the boundary", "leftmost index where…" | **One template**, half-open `[lo, hi)`. Never deviate under pressure | O(log n) |
| **Binary search on the answer** | **"minimise the maximum"**, "maximise the minimum", "smallest k such that possible" | Write `feasible(x)` first; the search is boilerplate | O(n log R) |
| **Search a rotated array** | "sorted but rotated" | Decide which half is sorted, then whether the target lies in it | O(log n) |
| **Search on a 2-D grid** | sorted rows and columns | Treat as 1-D, or staircase from top-right | O(log nm) / O(n+m) |
| **Binary search on a real answer** | answers are doubles; "within 1e-6" | Fixed ~100 iterations, not `lo < hi` | O(100·n) |
| **Binary search on the partition** | two sorted arrays, median, kth | Search the split point, not the value | O(log min(n,m)) |
| **Binary search inside a DP/greedy** | "longest increasing", "job scheduling by end time" | `bisect` over `tails[]` or over sorted ends | O(n log n) |
| **Peak / unimodal** | "find any peak", "mountain array" | Compare with the neighbour and walk uphill | O(log n) |

> **Trigger to burn in:** the words *minimise the maximum* or *maximise the minimum* mean binary search on the answer, roughly 90% of the time. The other 10% is Dijkstra-with-max or Kruskal — and those three are usually the same problem (see §13).

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 704 | Binary Search | E | The template |
| 35 | Search Insert Position | E | First-true |
| 34 | Find First and Last Position | M | Two boundary searches |
| 33/81 | Search in Rotated Sorted Array I & II | M | Duplicates break the invariant in II — say why |
| 153/154 | Find Minimum in Rotated Array I & II | M/H | Same |
| 74/240 | Search a 2-D Matrix I & II | M | Flatten vs staircase |
| 69 | Sqrt(x) | E | Integer binary search |
| 278 | First Bad Version | E | First-true, literally |
| 162 | Find Peak Element | M | Unimodal |
| 852 | Peak Index in a Mountain Array | E | Same |
| 875 | Koko Eating Bananas | M | **The canonical "on the answer"** — do this before anything else here |
| 1011 | Capacity To Ship Packages | M | Same shape, different `feasible` |
| 1552 | Magnetic Force Between Two Balls | M | Maximise-the-minimum |
| 540 | Single Element in a Sorted Array | M | Parity of the index |
| 658 | Find K Closest Elements | M | Binary search the window start |
| 528 | Random Pick with Weight | M | **Uber** — prefix sum + binary search |
| 981 | Time Based Key-Value Store | M | **Uber** |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 4 | Median of Two Sorted Arrays | H | Search the partition |
| 410 | Split Array Largest Sum | H | The DP-vs-binary-search conversation is the signal |
| 1231 | Divide Chocolate | H | Maximise the minimum |
| 1482 | Minimum Days to Make m Bouquets | M | `feasible` is a scan |
| 774 | Minimize Max Distance to Gas Station | H | *Premium.* Real-valued |
| 644 | Maximum Average Subarray II | H | *Premium.* Real-valued + prefix trick |
| 1044 | Longest Duplicate Substring | H+ | Binary search + rolling hash |
| 1235 | Maximum Profit in Job Scheduling | H | **Google pack.** DP + binary search composed |
| 668 | Kth Smallest Number in Multiplication Table | H | Binary search on the *value*, count with a helper |
| 378 | Kth Smallest Element in a Sorted Matrix | M | Heap **and** binary-search-on-value. Do both |
| 719 | Find K-th Smallest Pair Distance | H | Binary search on value + two pointers to count |

---

## §6 · SORTING & GREEDY

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Sort by the right key** | "schedule", "minimum number of X", "maximum non-overlapping" | The whole problem is choosing the key. End time → max non-overlap. Start time → merge | O(n log n) |
| **Exchange argument** | "is this greedy correct?" | Show swapping any adjacent out-of-order pair does not worsen the answer. **Say this out loud — it is scored** | — |
| **Greedy with a heap (regret)** | "you may do K upgrades", "at most k refuels" | Take greedily, push what you skipped, pop the best regret when you get stuck | O(n log n) |
| **Custom comparator** | "largest number from these pieces", "log file ordering" | Comparator on the *concatenation* or on the tuple | O(n log n) |
| **Counting / bucket sort** | small value range, O(n) demanded | Count array | O(n+k) |
| **Quickselect** | "kth largest", full sort not needed | Lomuto/Hoare partition, recurse one side | O(n) avg |
| **Cyclic sort** | values are a permutation of `1..n` | Swap `a[i]` home until it is | O(n) |
| **Merge sort as a counter** | "count inversions", "smaller after self" | Count across the merge step | O(n log n) |
| **Interval greedy** | see §10 | | |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 215 | Kth Largest Element | M | Heap **and** quickselect. **Amazon** |
| 973 | K Closest Points to Origin | M | Same. **Amazon** |
| 179 | Largest Number | M | Comparator on concatenation |
| 937 | Reorder Data in Log Files | M | **Amazon** |
| 56 | Merge Intervals | M | Sort by start |
| 435 | Non-overlapping Intervals | M | Sort by **end** |
| 452 | Minimum Arrows to Burst Balloons | M | Same |
| 455 | Assign Cookies | E | Two sorted pointers |
| 122 | Best Time to Buy and Sell Stock II | M | Greedy sum of positive deltas |
| 55/45 | Jump Game I & II | M | Reachability greedy, then BFS-by-level greedy |
| 134 | Gas Station | M | The "if total ≥ 0, an answer exists" argument |
| 621 | Task Scheduler | M | **Amazon** — the formula, and why it works |
| 767 | Reorganize String | M | **Amazon** — heap greedy |
| 1167 | Minimum Cost to Connect Sticks | M | *Premium.* **Amazon** — heap greedy |
| 1481 | Least Number of Unique Integers after K Removals | M | **Amazon** — count then greedy |
| 253 | Meeting Rooms II | M | *Premium.* **Uber.** Heap or sweep — know both |
| 1834 | Single-Threaded CPU | M | Two-stage heap |
| 75 | Sort Colors | M | DNF |
| 148 | Sort List | M | Merge sort on a linked list |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 857 | Minimum Cost to Hire K Workers | H | Sort by ratio + max-heap of quality. A genuinely beautiful greedy |
| 502 | IPO | H | Two heaps: capital min-heap feeding a profit max-heap |
| 1642 | Furthest Building You Can Reach | M | **The regret heap.** Learn this shape |
| 871 | Minimum Number of Refueling Stops | H | Same shape, restated |
| 630 | Course Schedule III | H | Regret again — three dresses, one idea |
| 315 | Count of Smaller Numbers After Self | H | Merge-sort counting |
| 493 | Reverse Pairs | H | Same |
| 759 | Employee Free Time | H | *Premium.* **Google pack** — k-way interval merge |
| 402 | Remove K Digits | M | Monotonic stack greedy |
| 316/1081 | Remove Duplicate Letters | H | Greedy + stack + last-occurrence. Hard to get right cold |
| 135 | Candy | H | Two sweeps; the proof is the interview |

---

## §7 · LINKED LIST

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Dummy head** | any problem that may delete the head | Allocate a sentinel; return `dummy.next`. Removes every edge case | O(1) |
| **Fast/slow** | "middle", "cycle", "nth from end", "palindrome" | Two pointers at different speeds | O(n), O(1) |
| **Reverse in place** | "reverse", "reverse in groups of k", palindrome check | `prev/cur/next` three-pointer walk | O(n), O(1) |
| **Merge two lists** | "merge sorted", merge sort on a list | Dummy + compare-and-append | O(n+m) |
| **Interleave / split** | reorder list, odd-even, copy with random pointer | Split, reverse one half, zip | O(n), O(1) |
| **Hash map of nodes** | deep copy with extra pointers | Map old→new, or interleave clones then unweave for O(1) space | O(n) |
| **Two-pass length** | "intersection of two lists", "rotate by k" | Compute lengths, align, walk | O(n) |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 206/92 | Reverse Linked List I & II | E/M | The three-pointer walk; II needs a dummy |
| 21/23 | Merge Two / K Sorted Lists | E/H | Dummy; then a heap of k heads |
| 141/142 | Cycle I & II | E/M | Floyd, and the entry proof |
| 143 | Reorder List | M | Split + reverse + zip — three patterns in one |
| 19 | Remove Nth From End | M | One pass with a gap |
| 2/445 | Add Two Numbers I & II | M | II **without reversing** — **Amazon** |
| 138 | Copy List with Random Pointer | M | **Amazon/Microsoft.** Know the O(1)-space interleave |
| 160 | Intersection of Two Linked Lists | E | **Microsoft.** The swap-heads trick |
| 234 | Palindrome Linked List | E | O(1) space expected |
| 328 | Odd Even Linked List | M | In-place split |
| 61 | Rotate List | M | Make it circular, then cut |
| 83/82 | Remove Duplicates I & II | E/M | II needs a dummy |
| 707 | Design Linked List | M | Index bookkeeping |
| 146 | LRU Cache | M | Hashmap + DLL. **The one to be fastest at** |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 25 | Reverse Nodes in k-Group | H | **The hardest common list problem.** Do it iteratively, O(1) space |
| 460 | LFU Cache | H | Two-level bucketing |
| 1650 | LCA III with Parent Pointers | M | *Premium.* Solve it **as "intersection of two linked lists"** — the transfer is the lesson |
| 430 | Flatten a Multilevel Doubly Linked List | M | Stack or recursion |
| 708 | Insert into a Sorted Circular List | M | *Premium.* Edge cases are the entire problem |
| 1171 | Remove Zero Sum Consecutive Nodes | M | Prefix sum + hashmap **on a list** |
| 148 | Sort List | M | O(1)-space bottom-up merge sort is the follow-up |

---

## §8 · STACK, QUEUE & MONOTONIC STACK

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Plain stack** | "matching", "nested", "undo", "innermost first" | Push context, pop on close | O(n) |
| **Monotonic stack (decreasing)** | **"next greater element"**, "days until warmer", "how far right until bigger" | Pop while `stack.top < cur`; the popped item's answer is `cur` | O(n) |
| **Monotonic stack (increasing)** | "next smaller", histogram, "largest rectangle" | Mirror. **Decide up front: increasing or decreasing, and push index or value** | O(n) |
| **Monotonic deque** | monotonic behaviour **inside a window** | Deque of indices; pop from both ends | O(n) |
| **Stack for parsing/eval** | calculator, decode string, file paths, exclusive time | One stack, or one per context type | O(n) |
| **Two stacks** | queue from stacks, min-stack, calculator with signs | Amortised transfer, or a parallel stack of minima | O(1) amortised |
| **Stack of "pending"** | asteroid collision, remove-k-digits, dedupe-letters | Push, then resolve conflicts against the top | O(n) |
| **Simulation with a stack** | browser history, backspace compare | — | O(n) |

> **The recognition line for monotonic stack:** any phrasing of *"for each element, find the nearest element to its left/right that is bigger/smaller"* — including heavily disguised ones like "how many days until", "how much water is trapped", "how wide can this bar extend".

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 20 | Valid Parentheses | E | The base case |
| 155 | Min Stack | M | Parallel stack of minima |
| 232/225 | Queue from Stacks / Stack from Queues | E | Amortised analysis |
| 739 | Daily Temperatures | M | **The canonical monotonic stack** |
| 496/503 | Next Greater Element I & II | E/M | II: circular ⇒ iterate `2n` |
| 901 | Online Stock Span | M | Monotonic stack, streaming |
| 42 | Trapping Rain Water | H | Stack solution, plus two others |
| 84 | Largest Rectangle in Histogram | H | The parent problem |
| 85 | Maximal Rectangle | H | 84 per row |
| 394 | Decode String | M | Stack of (count, prefix) |
| 71 | Simplify Path | M | Stack of components |
| 150 | Evaluate RPN | M | — |
| 227 | Basic Calculator II | M | Sign carried into the stack |
| 735 | Asteroid Collision | M | Resolve against the top |
| 682 | Baseball Game | E | Warm-up |
| 402 | Remove K Digits | M | Greedy + monotonic stack |
| 1047/1209 | Remove Adjacent Duplicates | E/M | Stack with counts |
| 636 | Exclusive Time of Functions | M | **Google pack** — stack simulation |
| 388 | Longest Absolute File Path | M | **Google pack** — parse + stack |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 224/772 | Basic Calculator I & III | H | **Uber & Google.** III (parens + precedence) is the real one |
| 239 | Sliding Window Maximum | H | Monotonic deque |
| 862 | Shortest Subarray with Sum at Least K | H | Deque over prefix sums — non-obvious |
| 316 | Remove Duplicate Letters | H | Stack + greedy + last-occurrence |
| 321 | Create Maximum Number | H+ | Composition: pick-k monotone + merge |
| 907 | Sum of Subarray Minimums | M | **Contribution counting** via monotonic stack. Learn this idea |
| 2104 | Sum of Subarray Ranges | M | Same idea, twice |
| 1130 | Minimum Cost Tree From Leaf Values | M | Monotonic stack **or** interval DP — see both |
| 895 | Maximum Frequency Stack | H | **Uber** |
| 456 | 132 Pattern | M | Monotonic stack from the right — genuinely tricky |
---

## §9 · HEAP & TOP-K

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Top-K with the opposite heap** | "k largest", "k closest" | **Min**-heap of size k for k-*largest*. The polarity is the opposite of what feels natural | O(n log k) |
| **K-way merge** | "merge k sorted lists/arrays", "smallest range covering all lists" | Heap of k cursors | O(n log k) |
| **Two heaps** | **"median"**, "balance two halves" | Max-heap for the low half, min-heap for the high half, rebalance by size | O(log n) insert |
| **Lazy deletion** | heap needs "remove an arbitrary element" | Keep a `to_delete` count map; discard stale entries at the top | O(log n) amortised |
| **Greedy with regret** | "at most k upgrades / refuels / skips" | Push what you passed on; pop the best regret when stuck | O(n log n) |
| **Scheduling by two keys** | "tasks with start and priority", CPU scheduling | Sort by key 1, heap by key 2 | O(n log n) |
| **Heap as a sweep frontier** | trapping rain water II, shortest-path-like grids | Pop the current global minimum boundary | O(nm log nm) |
| **Bucket instead of heap** | "top K" where K ≈ n, or O(n) required | `buckets[freq]` | O(n) |

> `heapify` is **O(n)**, not O(n log n). Know the proof sketch — it gets asked as a warm-up.

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 215 | Kth Largest Element | M | Min-heap of size k, and quickselect |
| 703 | Kth Largest in a Stream | E | Streaming version |
| 347/692 | Top K Frequent Elements / Words | M | Bucket vs heap; the tie-break in 692 |
| 973 | K Closest Points | M | **Amazon** |
| 23 | Merge k Sorted Lists | H | K-way merge |
| 295 | Find Median from Data Stream | H | **Two heaps.** The rebalance invariant is the interview |
| 253 | Meeting Rooms II | M | *Premium.* **Uber** |
| 621 | Task Scheduler | M | **Amazon** |
| 767 | Reorganize String | M | **Amazon** |
| 1167 | Minimum Cost to Connect Sticks | M | *Premium.* **Amazon** |
| 1834 | Single-Threaded CPU | M | Two-stage |
| 378 | Kth Smallest in a Sorted Matrix | M | Heap, then binary-search-on-value |
| 373 | K Pairs with Smallest Sums | M | Heap over a virtual grid |
| 1046 | Last Stone Weight | E | Warm-up |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 480 | Sliding Window Median | H | Two heaps + **lazy deletion**. The pattern is broadly reusable |
| 502 | IPO | H | Two heaps chained |
| 857 | Minimum Cost to Hire K Workers | H | Ratio sort + heap |
| 1642 | Furthest Building You Can Reach | M | Regret heap |
| 871 | Minimum Refueling Stops | H | Regret heap |
| 630 | Course Schedule III | H | Regret heap |
| 1383 | Maximum Performance of a Team | H | Sort by one key, heap the other |
| 632 | Smallest Range Covering K Lists | H | K-way merge + window |
| 407 | Trapping Rain Water II | H+ | Heap as a sweep frontier |
| 218 | The Skyline Problem | H+ | **Legendary.** Heap + sweep, or divide & conquer |
| 895 | Maximum Frequency Stack | H | **Uber** |

---

## §10 · INTERVALS

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Sort by START, then merge** | "merge overlapping", "insert an interval" | If `cur.start <= last.end`, extend; else push | O(n log n) |
| **Sort by END, then greedy** | **"maximum non-overlapping"**, "minimum removals", "minimum arrows" | Take the earliest-ending compatible one | O(n log n) |
| **Sweep line / difference map** | "maximum concurrent", "how many at time t", booking counts | `+1` at start, `−1` at end, sort events, running sum, track max | O(n log n) |
| **Heap of end times** | "minimum rooms/resources needed" | Pop every meeting that has ended; heap size is the answer | O(n log n) |
| **Ordered map of intervals** | "book if free", "range module", dynamic add/remove | TreeMap / sorted dict; `floorKey` and `ceilingKey` are the whole API | O(log n) |
| **Overlap test** | any of the above | `a.start < b.end && b.start < a.end`. Write it once, never re-derive | — |
| **Interval intersection (two lists)** | "free time common to both" | Two pointers; advance the one that ends first | O(n+m) |

> Python note: **there is no balanced BST in the standard library.** `sortedcontainers.SortedList` is third-party. Know the fallbacks: `bisect` on a list (O(n) insert), a heap with lazy deletion, or a BIT. This trips up Python candidates constantly — Java `TreeMap` and C++ `std::map` are a real advantage here.

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 56 | Merge Intervals | M | Sort by start |
| 57 | Insert Interval | M | Three phases: before, merge, after |
| 252/253 | Meeting Rooms I & II | E/M | *Premium.* **Uber** |
| 435 | Non-overlapping Intervals | M | Sort by end |
| 452 | Minimum Arrows | M | Same |
| 986 | Interval List Intersections | M | Two pointers |
| 228 | Summary Ranges | E | Warm-up |
| 495 | Teemo Attacking | E | — |
| 1288 | Remove Covered Intervals | M | Sort by start asc, end desc |
| 729 | My Calendar I | M | **Google favourite.** TreeMap |
| 1229 | Meeting Scheduler | M | *Premium.* Two pointers |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 731 | My Calendar II | M | Double-booking list, or a count map |
| 732 | My Calendar III | H | **Sweep-line difference map with a running max.** The general solution |
| 715 | Range Module | H | **Google pack.** Interval TreeMap with merge and split |
| 759 | Employee Free Time | H | *Premium.* **Google pack** |
| 218 | The Skyline Problem | H+ | Sweep + heap |
| 699 | Falling Squares | H | Coordinate compression + segment tree, or brute-force-with-max |
| 850 | Rectangle Area II | H+ | Sweep + segment tree over y |
| 2251 | Number of Flowers in Full Bloom | H | Offline queries + sorted starts/ends |

---

## §11 · TREES & BST

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **DFS returning what the parent needs** | almost every tree problem | `dfs(node) -> value the parent needs`; the **answer** is updated inside, at each node. These are two different quantities — internalise that | O(n) |
| **Path that bends at a node** | "any path", "diameter", "max path sum" | Return `max(0, best straight-down)`; update the global with `left + right + val` | O(n) |
| **Root-to-leaf path** | "path sum equals target", "all paths" | DFS + a backtracked list | O(n·h) |
| **Downward path, anywhere to anywhere** | "path sum III", "count paths summing to K" | **Prefix sum + hashmap along the DFS path** — and *decrement the map on the way up*. That backtrack is the bug everyone ships | O(n) |
| **BFS by level** | "level order", "right side view", "zigzag", "minimum depth" | `for _ in range(len(queue))` — the level counter is where people bug out | O(n) |
| **Tree → undirected graph** | **"all nodes at distance K"**, "infection spreads", "burn the tree" | Build a parent map, then plain BFS | O(n) |
| **Rerooting** | **"the answer for EVERY node as root"** | Two passes: down-DFS accumulates subtree info, second DFS redistributes using the parent's answer. Turns O(n²) into O(n) | O(n) |
| **Post-order greedy with states** | "cover/monitor all nodes with the fewest X" | Return one of 3 states (needs-cover / covered / has-camera) | O(n) |
| **Choose-or-skip on nodes** | "cannot take a node and its child" | Tree DP returning a `(take, skip)` tuple | O(n) |
| **Serialize to a canonical form** | "duplicate subtrees", "is this a subtree of that" | Serialize with null markers → hashmap. Assign integer ids to avoid O(n²) string cost — *that discussion is the signal* | O(n) |
| **Construct from traversals** | pre+in, in+post, pre+post | Recursion + an index hashmap for O(n). Know **why pre+post is not unique** | O(n) |
| **BST bounds** | "validate", "range sum", "trim" | Carry `(lo, hi)` down; prune whole subtrees. **Never** validate with just `left < root` | O(n) |
| **Inorder is sorted** | "kth smallest", "recover swapped nodes", "closest value" | Iterative inorder with one stack, stop early | O(h) space |
| **Morris traversal** | *"can you do it in O(1) space?"* | Thread the tree via right-most predecessors, unthread on the way back | O(n), O(1) |
| **Augment with subtree size** | "kth smallest **when the tree changes often**" | Store `leftSubtreeSize`; descend in O(h). This is an order-statistic tree — **the one place AVL knowledge pays** | O(h) |
| **Binary lifting** | "kth ancestor", repeated LCA queries | `up[k][v] = up[k-1][up[k-1][v]]`, `LOG = 20` | O(n log n) / O(log n) |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 94/144/145 | Traversals — **iteratively** | M | One stack each; postorder via reversed-modified-preorder |
| 102/107/103 | Level order, bottom-up, zigzag | M | The level loop |
| 199 | Right Side View | M | Last node per level |
| 104/111/110 | Max depth / Min depth / Balanced | E | Min depth's leaf edge case |
| 226 | Invert Binary Tree | E | — |
| 100/101/572 | Same / Symmetric / Subtree | E/M | 572 also has an O(n+m) serialization+KMP answer |
| 543 | Diameter | E | The bend-at-a-node scaffold |
| 112/113 | Path Sum I & II | E/M | Backtracking |
| 437 | Path Sum III | M | Prefix map + **decrement on the way up** |
| 236/235 | LCA of BT / of BST | M | Two different algorithms — do not conflate |
| 105/106 | Build from pre+in / in+post | M | Index map |
| 98 | Validate BST | M | Bounds, not comparison |
| 700/701/450 | BST search / insert / **delete** | E/M | **450's three cases** — people fumble this live |
| 230 | Kth Smallest in BST | M | And the "tree changes often" follow-up |
| 173 | BST Iterator | M | O(h) space; then support `prev()` |
| 108/109 | Sorted array/list → balanced BST | E/M | — |
| 938/669/653 | Range sum / Trim / Two Sum in BST | E/M | Pruning |
| 297 | Serialize and Deserialize BT | H | Preorder + null sentinels |
| 863 | All Nodes Distance K | M | **Amazon** — tree→graph |
| 116/117 | Populating Next Right Pointers | M | **Microsoft** — 117 with O(1) space |
| 114 | Flatten to Linked List | M | Morris-style O(1) version |
| 124 | Binary Tree Maximum Path Sum | H | **The archetype** |
| 337 | House Robber III | M | `(take, skip)` |
| 662 | Maximum Width of Binary Tree | M | Index arithmetic, watch overflow |

### C · Google / Uber L4

**Extra machinery:** rerooting · binary lifting · Morris · canonical-id serialization · vertical order with tie-breaks · segment/BIT-augmented BSTs.

| LC | Name | D | Why |
|---|---|---|---|
| 834 | Sum of Distances in Tree | H | **The rerooting archetype.** If you learn one thing here, this |
| 968 | Binary Tree Cameras | H | Post-order greedy, 3 states. Hard and worth it |
| 979 | Distribute Coins in Binary Tree | M | Return the *excess*; accumulate `abs(l)+abs(r)` |
| 1483 | Kth Ancestor of a Tree Node | H | **Binary lifting** |
| 987 | Vertical Order Traversal | H | The sort-by-value tie-break is where everyone fails |
| 314 | Vertical Order Traversal | M | *Premium.* **Google favourite** — note the different tie-break |
| 99 | Recover BST | M | Two inversions in inorder; **do the Morris O(1) version** |
| 449 | Serialize/Deserialize **BST** | M | **Must be shorter than 297's output.** If it is not, you failed the problem |
| 428 | Serialize/Deserialize N-ary Tree | H | Framing discipline |
| 652 | Find Duplicate Subtrees | M | Canonical ids |
| 1373 | Maximum Sum BST in a Binary Tree | H | Tree DP returning a 4-tuple — great composition drill |
| 1372 | Longest ZigZag Path | M | Two-state DFS |
| 2385 | Amount of Time for Tree to Be Infected | M | 863 restated |
| 1650 | LCA III with parent pointers | M | *Premium.* Solve as list-intersection |
| 1123 | LCA of Deepest Leaves | M | Return `(depth, node)` |
| 272 | Closest BST Values II | H | *Premium.* **Google classic** — two stacks as pred/succ iterators, O(k + log n) |
| 270 | Closest BST Value | E | *Premium.* Its warm-up |
| 951 | Flip Equivalent Binary Trees | M | **Google pack** |
| 545 | Boundary of Binary Tree | M | *Premium.* Three careful walks |

> **Deliberately capped:** AVL and red-black. Learn the *concepts* — balance factor, the four rotation cases, RB's five invariants, why `TreeMap`/`std::map` are RB trees, AVL better for reads / RB better for writes. **Do not implement insert or delete.** Two hours, conceptual, done. Trie, rerooting and 0-1 BFS each pay back more.

---

## §12 · TRIE

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **Standard trie** | "prefix", "autocomplete", "dictionary", "starts with" | `children` map + `isEnd` | O(L) per op |
| **Trie + DFS wildcard** | "search with `.` matching any char" | At `.`, recurse into every child | O(26^dots · L) |
| **Trie + grid backtracking** | **"find all words from the list in this board"** | Walk the board and the trie together. Two optimisations make it pass: **prune leaf nodes after a word is found**, and **store the word on the terminal node** instead of threading a string | — |
| **Binary trie (bitwise)** | **"maximum XOR pair"**, "max XOR with a limit" | 32 levels; at each bit greedily descend to the opposite bit | O(32n) |
| **Suffix trie / reversed insert** | "stream of characters", "suffix search" | Insert reversed words; query the reversed stream | O(L) |
| **Trie + DP** | "can this word be built from others" | Trie walk inside a DP over positions | O(n·L) |
| **Trie with payload** | autocomplete ranked by frequency; top-k per prefix | Store the top-k list on each node | — |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 208 | Implement Trie | M | The template |
| 211 | Add and Search Words | M | Wildcard DFS |
| 212 | Word Search II | H | **The one that matters.** Trie + grid DFS + pruning |
| 648 | Replace Words | M | Shortest-root lookup |
| 720 | Longest Word in Dictionary | M | Ordering + trie |
| 676 | Implement Magic Dictionary | M | Exactly-one-mismatch |
| 1268 | Search Suggestions System | M | **Amazon** — very on-brand |
| 472 | Concatenated Words | H | **Amazon** — trie + DP |
| 14 | Longest Common Prefix | E | Trie is overkill — say so |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 421 | Maximum XOR of Two Numbers | M | **Binary trie.** A genuinely different use of the structure |
| 1707 | Maximum XOR With an Element From Array | H | Binary trie + offline queries sorted by limit |
| 336 | Palindrome Pairs | H | **Google pack.** Trie of reversed words + palindromic-remainder check |
| 642 | Design Search Autocomplete System | H | *Premium.* **Google pack** — trie with ranked payload |
| 1032 | Stream of Characters | H | Suffix-trie trick, or Aho–Corasick-lite |
| 745 | Prefix and Suffix Search | H | Two tries, or a combined key `suffix#prefix` |
| 588 | Design In-Memory File System | H | *Premium.* **Google & Amazon** — file system *is* an n-ary tree |
| 425 | Word Squares | H | *Premium.* Trie + backtracking |

---

## §13 · GRAPHS

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **BFS** | "shortest", **all edges cost 1** | Queue, visited on push | O(V+E) |
| **Multi-source BFS** | "shortest from *any* of these", "spreading from several places at once" | Seed the queue with **all** sources — one virtual super-source | O(V+E) |
| **Bidirectional BFS** | both endpoints known, huge branching factor | Expand the smaller frontier each round | ~O(b^(d/2)) |
| **DFS / flood fill** | "islands", "regions", "connected components" | Recursion or explicit stack. Know why recursion dies at n=10⁵ in Python | O(V+E) |
| **Reverse thinking** | "regions NOT touching the border", "cells that reach both oceans" | BFS/DFS **inward from the border**, then invert | O(V+E) |
| **Dijkstra (lazy)** | "shortest", **positive weights** | Heap of `(dist, node)`; skip stale with `if d > dist[u]: continue` | O(E log V) |
| **Dijkstra with augmented state** | **"at most K stops / removals / refuels"**, "with a fuel budget" | Heap of `(cost, node, extra)`; `dist` becomes 2-D `dist[node][extra]`. **The single highest-value template** | O(E·K log) |
| **Bitmask in the state** | "collect all keys", "visit every node", **n ≤ 20** | State = `(node, visitedMask)` | O(2ⁿ·n) |
| **0-1 BFS** | edge weights are **only 0 and 1** | `deque`; `appendleft` for 0, `append` for 1. O(V+E) instead of O(E log V). **Most candidates do not know it exists** | O(V+E) |
| **Bellman-Ford / exactly-k** | negative edges, or **"exactly k edges"** | `prev = dist.copy()` inside the k-loop — that copy *is* the trick | O(V·E) |
| **Floyd-Warshall** | all-pairs, **n ≤ 400** | Triple loop, k outermost | O(n³) |
| **Dijkstra with max / minimax path** | **"minimise the maximum edge on the path"** | Three equivalent answers: Dijkstra-with-max · binary search + BFS · **Kruskal + DSU**. Recognise they are the same problem | — |
| **Path counting** | "count the shortest paths" | Carry `ways[]`; reset on improve, accumulate on tie | O(E log V) |
| **Topological sort — Kahn** | "prerequisites", "ordering", "before" | In-degree + queue; cycle iff `len(order) != n` | O(V+E) |
| **Topological sort — DFS 3-colour** | needed for SCC and "safe states" | white/grey/black | O(V+E) |
| **Topo + DP** | **a value accumulates along a DAG** | Process in topo order; when you reach `v`, every predecessor's dp is final. **Say that invariant out loud before coding** | O(V+E) |
| **DAG in disguise** | "longest increasing path in a matrix", monotone constraints | It is a DAG ⇒ memoized DFS | O(nm) |
| **Bipartite / 2-colouring** | "two groups", "no two adjacent alike", "dislikes" | BFS colouring, or **DSU with parity** | O(V+E) |
| **DSU** | "merge these", "same group", incremental unions | Path compression + union by size, with a component counter | ~O(1) |
| **DSU offline sweep** | queries with a **weight threshold** | Sort queries by limit, sort edges by weight, one DSU pass | O((E+Q) log) |
| **Reverse-time DSU** | **things get REMOVED over time** | Process backwards, so removals become additions | O(α) |
| **Weighted DSU** | ratios, "a/b = 2.0", parity constraints | Store the weight to the parent; compose on find | ~O(1) |
| **MST** | "connect everything at minimum cost" | Kruskal + DSU; **Prim for dense/complete graphs** — the interviewer will probe this | O(E log E) |
| **Tarjan bridges** | **"removing this edge disconnects the graph"**, critical connections | `disc[]`, `low[]`, timer; bridge iff `low[v] > disc[u]`. Articulation point: `low[v] >= disc[u]`, plus the root special case | O(V+E) |
| **Kosaraju / Tarjan SCC** | "strongly connected", condensation | Two passes on G and Gᵀ | O(V+E) |
| **Hierholzer (Euler)** | **"use every edge exactly once"**, itinerary | Append **after** recursion, then reverse. Existence: 0 or 2 odd-degree (undirected) | O(E) |
| **Implicit / state-space graph** | input is **strings, board states, numbers** — no edges given | Stop asking "what is the graph". Ask **"what is a state, and what states are one move away?"** Write `neighbors(state)` first; the BFS is boilerplate | varies |
| **Node splitting** | the **node** has a capacity, not the edge | `v → v_in, v_out` with a capacity edge between | — |

> **The four things that make a graph problem Hard** (this is the whole game):
> **(A)** the graph is implicit · **(B)** the state is a tuple · **(C)** two techniques compose · **(D)** the invariant is non-obvious and the code is 15 lines.

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 200 | Number of Islands | M | **Amazon speed-run: under 8 minutes, clean** |
| 695/1254 | Max Area of Island / Closed Islands | M | Same engine |
| 733 | Flood Fill | E | — |
| 994 | Rotting Oranges | M | **Multi-source BFS.** Amazon speed-run |
| 542 | 01 Matrix | M | Multi-source |
| 1091 | Shortest Path in Binary Matrix | M | BFS with 8 directions |
| 130 | Surrounded Regions | M | Reverse thinking from the border |
| 417 | Pacific Atlantic Water Flow | M | BFS *from* both oceans inward |
| 934 | Shortest Bridge | M | DFS to mark, BFS to expand |
| 909 | Snakes and Ladders | M | **Amazon** — BFS on a transformed board |
| 127 | Word Ladder | H | **Amazon** — implicit graph; then bidirectional |
| 133 | Clone Graph | M | Map old→new |
| 207/210 | Course Schedule I & II | M | Kahn **and** DFS |
| 802 | Find Eventual Safe States | M | Reverse graph + topo, or 3-colour |
| 310 | Minimum Height Trees | M | Peel leaves |
| 269 | Alien Dictionary | H | *Premium.* **Historically the most-asked Google graph problem.** Edge case: `["abc","ab"] → ""` |
| 547 | Number of Provinces | M | DSU |
| 721 | Accounts Merge | M | **Amazon** — DSU with a key map |
| 684 | Redundant Connection | M | DSU |
| 990 | Satisfiability of Equality Equations | M | DSU in disguise |
| 947 | Most Stones Removed | M | **Google pack** — DSU in disguise |
| 743 | Network Delay Time | M | Vanilla Dijkstra |
| 1514 | Path with Maximum Probability | M | Max-heap Dijkstra — proves you know the invariant, not the code |
| 785/886 | Is Graph Bipartite / Possible Bipartition | M | Colouring; also DSU-with-parity |
| 399 | Evaluate Division | M | Weighted DSU **and** DFS-with-product — do both |
| 1584 | Min Cost to Connect All Points | M | Kruskal **and** Prim |
| 1319 | Number of Operations to Make Network Connected | M | DSU with a counter |
| 329 | Longest Increasing Path in a Matrix | H | It is a DAG ⇒ memo. Also do the topo version |
| 1466 | Reorder Routes | M | Directed edges on a tree |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| **787** | Cheapest Flights Within K Stops | M | **Solve three ways:** BFS-by-level · Bellman-Ford with layer copy · Dijkstra on `(cost,node,stops)`. Worth more than ten easy problems |
| **1631** | Path With Minimum Effort | M | **Three ways:** Dijkstra-with-max · binary search + BFS · Kruskal + DSU |
| 778 | Swim in Rising Water | H | **The same problem as 1631.** Say why in one sentence |
| 1102 | Path With Maximum Minimum Value | M | *Premium.* Inverted |
| 1368 | Min Cost to Make at Least One Valid Path | H | **0-1 BFS** |
| 2290 | Minimum Obstacle Removal | H | 0-1 BFS |
| 1293 | Shortest Path with Obstacle Elimination | H | State `(r,c,k)`. Pruning: if `k ≥ r+c` remaining, answer is Manhattan |
| 864 | Shortest Path to Get All Keys | H | State `(r,c,keyMask)`. **`visited` is state-al, not positional** — the classic bug |
| 847 | Shortest Path Visiting All Nodes | H | `(node, mask)` |
| 815 | Bus Routes | H | **Nodes are routes, not stops.** Modelling choice is everything |
| 752 | Open the Lock | M | State = a 4-digit string |
| 773 | Sliding Puzzle | H | State = flattened board; precompute the neighbour table |
| 1345 | Jump Game IV | H | Clear the value→indices bucket after first use or it is O(n²) |
| 126 | Word Ladder II | H | BFS to build the DAG, DFS to enumerate. Two-phase |
| 1976 | Number of Ways to Arrive at Destination | M | Dijkstra + `ways[]` |
| 1928 | Min Cost to Reach Destination in Time | H | `(cost, node, time)` |
| 2045 | Second Minimum Time to Reach Destination | H | Best **and** second-best, plus traffic-light modular arithmetic |
| 1334 | City With Smallest Number of Neighbors | M | Floyd-Warshall and its n³ ceiling |
| **1192** | Critical Connections | H | **Tarjan bridges — the one Google actually asks.** Memorisation is acceptable here; nobody derives it live |
| 1568 | Minimum Days to Disconnect Island | H | Answer is always 0, 1 or 2 — the 1-case is an articulation point |
| **332** | Reconstruct Itinerary | H | **Hierholzer.** "Why append after the recursion" is the probe |
| 2097 | Valid Arrangement of Pairs | H | Euler path, directed |
| 753 | Cracking the Safe | H | de Bruijn sequence as an Euler circuit. Beautiful |
| **1857** | Largest Color Value in a Directed Graph | H | **Topo + DP** with a 26-wide count per node |
| 2050 | Parallel Courses III | H | Topo + DP |
| **1203** | Sort Items by Groups | H | **Topo on two levels.** A genuine L4-hard |
| 685 | Redundant Connection II | H | Directed: two-parents vs cycle vs both. Nasty case analysis |
| **1697** | Edge Length Limited Paths | H | **The offline-sweep archetype** |
| 1489 | Critical and Pseudo-Critical Edges in MST | H | Exclude ⇒ critical; force-include ⇒ pseudo-critical |
| **803** | Bricks Falling When Hit | H+ | **Reverse-time DSU.** Top-tier |
| 1970 | Last Day Where You Can Still Cross | H | Reverse time, or binary search + BFS |
| 952 | Largest Component by Common Factor | H | DSU + factorisation |
| 839 | Similar String Groups | H | DSU with an O(n²·L) compare |
| 827 | Making A Large Island | H | Component labelling + size map |
| 2492 | Minimum Score of a Path | M | — |
| 490/505 | The Maze I & II | M/H | *Premium.* **Uber** — rolling-ball BFS / Dijkstra |
| 818 | Race Car | H | **Uber** — BFS/DP over an unusual state space |
| 489 | Robot Room Cleaner | H | *Premium.* **Google classic** — backtracking with no coordinates given |

---

## §14 · BACKTRACKING

### A · Patterns

| Pattern | The disguise | The move | Cost |
|---|---|---|---|
| **The template** | "all combinations / permutations / subsets" | `choose → recurse → un-choose`. Write the un-choose immediately after the choose, always | O(branch^depth) |
| **Subsets vs combinations vs permutations** | — | Subsets: include/exclude. Combinations: a start index. Permutations: a `used[]` array | — |
| **Dedup with sorted input** | input has duplicates, output must not | Sort, then `if i > start and a[i] == a[i-1]: continue` | — |
| **Prune on infeasibility** | "sum exceeds target", "already worse than best" | Return early. **Pruning is what makes these pass, and it is the interview** | — |
| **Grid backtracking** | word search, N-Queens, sudoku | Mark visited in place, restore after | — |
| **Backtracking + trie** | grid + a word list | Never search per word — walk the trie | — |
| **Partition into k groups** | "k equal-sum subsets", "matchsticks to square" | Sort descending, place each item, skip equal-sized empty buckets | — |
| **Expression building** | "insert operators to reach a target" | Carry `(value, lastOperand)` for `*` precedence | — |
| **Iterative deepening / bounded search** | "minimum moves", branching too wide for BFS | Depth-limited DFS | — |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 78/90 | Subsets I & II | M | Dedup on sorted |
| 46/47 | Permutations I & II | M | `used[]`, then dedup |
| 39/40 | Combination Sum I & II | M | Reuse vs single-use |
| 77 | Combinations | M | Start index |
| 17 | Letter Combinations of a Phone Number | M | — |
| 22 | Generate Parentheses | M | Validity counters as pruning |
| 79 | Word Search | M | **Amazon** — grid backtracking |
| 131 | Palindrome Partitioning | M | Backtracking + palindrome check |
| 93 | Restore IP Addresses | M | Bounded splitting |
| 784/797 | Letter Case Permutation / All Paths | M | — |
| 216 | Combination Sum III | M | — |
| 698 | Partition to K Equal Sum Subsets | M | Sorting + pruning is everything |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 51/52 | N-Queens I & II | H | Diagonal encoding; bitmask version as the follow-up |
| 37 | Sudoku Solver | H | Constraint propagation + ordering heuristics |
| 212 | Word Search II | H | **Trie + backtracking + pruning** |
| 282 | Expression Add Operators | H | The `lastOperand` trick for `*` |
| 301 | Remove Invalid Parentheses | H | BFS-by-level, or DFS with a computed removal count |
| 489 | Robot Room Cleaner | H | *Premium.* **Google classic** |
| 291 | Word Pattern II | H | *Premium.* Backtracking with two maps |
| 425 | Word Squares | H | *Premium.* Trie-guided |
| 465 | Optimal Account Balancing | H | *Premium.* **Google & Uber** — Splitwise as an algorithm; bitmask DP or backtracking |
| 843 | Guess the Word | H | **Google pack.** Interactive + minimax. Unlike anything else on LeetCode |
| 679 | 24 Game | H | Exhaustive with floating-point care |

---

## §15 · DYNAMIC PROGRAMMING

> **The rule that decides this whole section:** if you cannot state **the state** in one English sentence, you do not have a solution — you have a vague feeling. Say `dp[i][j] = "the best X considering the first i of A and first j of B"` **out loud, before writing code, every single time.**

### A · Patterns

| Family | The disguise | The state | Canonical |
|---|---|---|---|
| **Linear / decision at each index** | "at each step, take it or don't" | `dp[i]` = best using the first i | 198, 91, 746 |
| **Fibonacci-shaped** | "how many ways to reach step n" | `dp[i] = dp[i-1] + dp[i-2]` | 70, 509 |
| **Kadane** | max/min subarray | running best ending here | 53, 152 |
| **LIS family** | "longest increasing/chain", "minimum arrows/rooms after sorting" | `dp[i]` = best ending at i; or `tails[]` + bisect for O(n log n). **`tails` is not the actual subsequence** | 300, 354, 646 |
| **0/1 knapsack** | pick items, capacity limit, **each used once** | `dp[i][w]`; 1-D version's capacity loop runs **backwards** | 416, 494, 1049 |
| **Unbounded knapsack** | items reusable | 1-D loop runs **forwards** | 322, 518, 377 |
| **Combinations vs permutations** | same items, different counting | **Purely loop order.** Items outer ⇒ combinations. Capacity outer ⇒ permutations | 518 vs 377 |
| **Two-sequence grid** | "two strings, align them" | `dp[i][j]`: match / skip-left / skip-right. **Parent of a whole family** | 1143, 72, 583 |
| **Palindrome / substring DP** | "longest palindromic subsequence", "min cuts" | `dp[i][j]` over the substring `[i..j]` | 516, 132, 5 |
| **Interval DP** | **"choose a split point in a range"**, "which is processed LAST" | `dp[i][j] = best over k in (i,j)`. **Iterate by increasing length** | 312, 1039, 1130 |
| **Grid DP** | paths, min falling path, obstacles | `dp[r][c]` from neighbours | 62, 64, 931 |
| **State machine** | buy/sell/hold with cooldown or a transaction cap | `dp[i][state]` — enumerate the states first | 309, 188, 123 |
| **Bitmask DP** | **n ≤ 20** and you must track a *subset* | `dp[mask]`; submask enumeration `for (s = m; s; s = (s-1)&m)` | 1349, 698, 847 |
| **Tree DP** | see §11 | `dfs(node) -> tuple` | 337, 124, 968 |
| **Digit DP** | "count numbers ≤ N with property P" | `dp[pos][tight][state]` | 233, 902 |
| **DP + a data structure** | the transition needs a range query or a "best so far" | DP + heap / BIT / binary search | 1235, 315 |
| **DP on the answer's shape** | "minimum number of X to cover Y" | Sometimes greedy beats DP — check | 45, 55 |
| **Memo → tabulation** | any of the above | Write the memo first. Then convert **mechanically**. Do it every time until automatic | — |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 70/746 | Climbing Stairs / Min Cost | E | The base shape |
| 198/213 | House Robber I & II | M | Circular = two runs |
| 53/152 | Max Subarray / Product | M | Kadane |
| 300 | Longest Increasing Subsequence | M | Both O(n²) and O(n log n) |
| 322/518 | Coin Change I & II | M | Min vs count; loop order |
| 377 | Combination Sum IV | M | **Loop order flips the meaning** |
| 416 | Partition Equal Subset Sum | M | 0/1 knapsack |
| 494 | Target Sum | M | Knapsack after a transform |
| 1143 | Longest Common Subsequence | M | The grid parent |
| 72 | Edit Distance | H | **Asked everywhere.** Three operations, three transitions |
| 5/647/516 | Palindromic substring / count / subsequence | M | Expand vs DP |
| 62/63/64 | Unique Paths I, II / Min Path Sum | M | Grid |
| 91 | Decode Ways | M | Edge cases around `0` are the whole problem |
| 139/140 | Word Break I & II | M/H | DP, then DP + backtracking |
| 279 | Perfect Squares | M | Unbounded knapsack |
| 121/122/309 | Stock I, II, with Cooldown | E/M | State machine |
| 1137/509 | Tribonacci / Fibonacci | E | — |
| 118/119 | Pascal's Triangle | E | Warm-up |
| 1024 | Video Stitching | M | Interval greedy vs DP |
| 337 | House Robber III | M | Tree DP |
| 221 | Maximal Square | M | Grid DP with a min-of-three |
| 837 | New 21 Game | M | **Google pack** — probability DP with a sliding-window sum |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| **312** | Burst Balloons | H | **Interval DP, and the "which is LAST" mental flip.** The one to truly understand |
| 1039 | Minimum Score Triangulation | M | Same skeleton |
| 1130 | Minimum Cost Tree From Leaf Values | M | Interval DP **or** monotonic stack — see both |
| 546 | Remove Boxes | H+ | Interval DP with a third dimension. Brutal and instructive |
| 132 | Palindrome Partitioning II | H | Precompute `isPal`, then linear DP |
| **10** | Regular Expression Matching | H | The two-sequence grid at its nastiest |
| **44** | Wildcard Matching | H | Same family, greedy alternative exists |
| 97 | Interleaving String | H | Two-sequence grid, restated |
| 115 | Distinct Subsequences | H | Counting variant |
| 188/123 | Best Time to Buy and Sell Stock IV / III | H | State machine with a transaction cap |
| 1349 | Maximum Students Taking Exam | H | **Bitmask DP** over rows + submask enumeration |
| 698 | Partition to K Equal Sum Subsets | M | Bitmask DP alternative |
| 847 | Shortest Path Visiting All Nodes | H | Bitmask, but BFS not DP — know why |
| 174 | Dungeon Game | H | **DP that must run backwards.** The direction *is* the insight |
| **1235** | Maximum Profit in Job Scheduling | H | **Google pack.** DP + binary search |
| 315 | Count of Smaller Numbers After Self | H | DP + BIT |
| 552 | Student Attendance Record II | H | **Google pack** — state machine with a modulus |
| 887 | Super Egg Drop | H+ | The inverted-DP reformulation. Famous |
| 32 | Longest Valid Parentheses | H | DP **or** stack — do both |
| 85 | Maximal Rectangle | H | Composition |
| 1000 | Minimum Cost to Merge Stones | H+ | Interval DP with a k-step constraint |
| 96/95 | Unique BSTs I & II | M | Catalan; II builds them |
| 902 | Numbers At Most N Given Digit Set | H | **Digit DP** |

---

## §16 · BIT MANIPULATION & MATH

### A · Patterns

| Pattern | The disguise | The move |
|---|---|---|
| **XOR cancels pairs** | "everything appears twice except one" | XOR the whole array |
| **XOR partitioning** | "two numbers appear once" | XOR all, isolate the lowest set bit, split into two groups |
| **Counting bits per position** | "everything appears three times except one" | Sum bit counts mod 3 |
| **`n & (n-1)`** | "count set bits", "is it a power of two" | Clears the lowest set bit |
| **`n & -n`** | "lowest set bit" | Also the core of a Fenwick tree |
| **Bitmask as a set** | **n ≤ 20**, subsets | `mask` is the set; `1<<i` is membership |
| **Submask enumeration** | "partition a set", assignment problems | `for (s = m; s; s = (s-1) & m)` |
| **Binary trie** | max XOR pair | See §12 |
| **GCD / LCM** | "reduce a fraction", cycles, "meet again" | Euclid; `lcm = a/g*b` |
| **Sieve** | "primes up to n", factor counts | Eratosthenes |
| **Fast power / modular arithmetic** | "answer mod 1e9+7", huge exponents | Binary exponentiation |
| **Reservoir sampling** | "pick uniformly from a stream of unknown length" | Keep item i with probability 1/i |
| **Fisher–Yates** | "shuffle" | Swap with a random earlier index — **know why the naive shuffle is biased** |
| **Median not mean** | "minimise total distance to a point" | The 1-D optimum is the median. **Prove it** |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 136/137/260 | Single Number I, II, III | E/M | The three XOR tricks |
| 191/338 | Number of 1 Bits / Counting Bits | E | `n&(n-1)`, then DP |
| 231/342/326 | Power of Two / Four / Three | E | — |
| 268 | Missing Number | E | XOR or sum |
| 190 | Reverse Bits | E | — |
| 371 | Sum of Two Integers | M | Add without `+` |
| 7/9 | Reverse Integer / Palindrome Number | E | Overflow discipline |
| 50 | Pow(x, n) | M | Fast power; negative exponent |
| 172 | Factorial Trailing Zeroes | M | Count 5s |
| 204 | Count Primes | M | Sieve |
| 202 | Happy Number | E | Cycle detection |
| 384 | Shuffle an Array | M | **Microsoft** — Fisher–Yates |
| 528 | Random Pick with Weight | M | **Uber** |
| 398 | Random Pick Index | M | Reservoir sampling |
| 189 | Rotate Array | M | — |
| 66 | Plus One | E | — |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 421 | Maximum XOR of Two Numbers | M | Binary trie |
| 1707 | Maximum XOR With an Element | H | + offline queries |
| 296 | Best Meeting Point | H | *Premium.* **Google pack** — median, not mean. **Prove why** |
| 899 | Orderly Queue | H | k=1 is rotations, k≥2 is a full sort. A one-line answer with a real proof |
| 470 | Implement Rand10() Using Rand7() | M | Rejection sampling; expected-value analysis |
| 382/398 | Linked List Random Node / Random Pick Index | M | Reservoir |
| 780 | Reaching Points | H | Work backwards with modulo |
| 372 | Super Pow | M | Modular exponentiation |

---

## §17 · DESIGN & DATA-STRUCTURE COMPOSITION

### A · Patterns

| Pattern | The disguise | The move |
|---|---|---|
| **Hashmap + doubly linked list** | **"O(1) get, put, and eviction"** | LRU. Sentinel head and tail — they remove every edge case |
| **Hashmap + frequency buckets** | LFU, "max frequency stack" | Two maps: key→node, freq→list |
| **Array + index map** | **"O(1) insert, delete, and getRandom"** | Swap-with-last on delete |
| **Two stacks / two heaps** | min-stack, median, queue-from-stacks | Parallel structure carrying the auxiliary invariant |
| **Sorted structure + binary search** | "value at time t", "closest to x" | Map key → sorted list of `(time, value)` |
| **Difference map / sweep** | "how many booked at time t" | See §10 |
| **Trie + payload** | autocomplete, file system | See §12 |
| **Lazy deletion** | any structure needing "remove arbitrary" | Tombstones + a counter |
| **Bucket by time** | hit counter, rate limiter, logger | Circular array of second-buckets. **The scaling follow-up is the interview** |
| **Fenwick / BIT** | "range sum **with updates**" | `i & -i`; point update, prefix query. 15 lines — learn it cold |
| **Segment tree** | range query + range update | Iterative point-update version is enough at L4. Lazy propagation: know it exists |
| **Coordinate compression** | huge/sparse coordinate space | Map values to ranks first |

### B · Tier 1–2

| LC | Name | D | Teaches |
|---|---|---|---|
| 146 | LRU Cache | M | **Be fastest at this. Under 15 minutes, cold.** Microsoft/Amazon/Uber |
| 155 | Min Stack | M | — |
| 380 | Insert Delete GetRandom O(1) | M | **Amazon/Uber** |
| 232/225 | Queue/Stack from the other | E | — |
| 705/706 | Design HashSet / HashMap | E | Chaining |
| 622/641 | Design Circular Queue / Deque | M | **Uber/Microsoft** |
| 348 | Design Tic-Tac-Toe | M | *Premium.* **Amazon/Microsoft** — OOD-flavoured |
| 359 | Logger Rate Limiter | E | *Premium.* **Google/Uber** |
| 362 | Design Hit Counter | M | *Premium.* **Uber — the scaling follow-up IS the interview** |
| 981 | Time Based Key-Value Store | M | **Uber** |
| 707 | Design Linked List | M | — |
| 173 | BST Iterator | M | — |
| 295 | Find Median from Data Stream | H | Two heaps |

### C · Google / Uber L4

| LC | Name | D | Why |
|---|---|---|---|
| 460 | LFU Cache | H | Two-level bucketing |
| 588 | Design In-Memory File System | H | *Premium.* **Google/Amazon** — tree + design |
| 642 | Design Search Autocomplete System | H | *Premium.* **Google pack** |
| 855 | Exam Room | H | **Uber.** Design + ordered set. Very on-brand |
| 895 | Maximum Frequency Stack | H | **Uber** |
| 900 | RLE Iterator | M | **Google pack** — lazy consumption |
| 158 | Read N Characters Given read4 II | H | *Premium.* **Google pack.** The buffer state *between calls* is the whole problem |
| 307 | Range Sum Query — Mutable | M | **BIT and segment tree — write both** |
| 715 | Range Module | H | **Google pack** |
| 729/731/732 | My Calendar I / II / III | M/H | **Google favourite** |
| 1146 | Snapshot Array | M | Versioned values + binary search |
| 432 | All O(1) Data Structure | H | Doubly linked list of frequency buckets |
| 218 | The Skyline Problem | H+ | — |
---

# PART II — SYSTEM DESIGN

**The recognition goal here is different.** In DSA you recognise *which algorithm*. In system design you recognise **which requirement implies which building block** — and then you survive the cross-question. Nobody fails an SD round for not knowing what a CDN is. They fail it on the follow-up.

**Tier note:** the gradient does **not** run to Google. Google L4 has little or no system design. The heavy SD rounds are **JP Morgan, Amex, Expedia, Amazon and Uber** — so Block B here is the big one, and Block C means "Uber / Apple / Amazon-senior depth", not "Google".

Each session carries the **actual prompts**, what to clarify, the numbers, the decision points **with a verdict**, and **the specific cross-questions with their answers**.

---

## §18 · THE FRAMEWORK — memorise this, use it every single time

| Step | Minutes | What you actually do |
|---|---|---|
| **1 · Requirements** | 3–5 min | Functional (3–5 bullets) and non-functional (scale, latency, consistency, availability). ASK ABOUT SCALE EVERY TIME — it drives every later decision and asking it is scored signal. |
| **2 · Estimation** | 3–5 min | DAU to QPS to storage to bandwidth. Out loud, rounded, no calculator. |
| **3 · API** | 3–5 min | 3–6 endpoints with signatures. This forces the data model. |
| **4 · Data model** | 5 min | Entities, keys, and THE SHARD KEY — plus why it does not create a hot partition. |
| **5 · High-level design** | 10 min | Boxes and arrows. Client to LB to service to cache to DB to queue to worker. |
| **6 · Deep dive + bottlenecks** | 15 min | PICK THE INTERESTING PART YOURSELF. Then defend it against the six cross-question categories. |

**Numbers to have memorised:** L1 ~1ns · RAM ~100ns · SSD random read ~100us · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent RTT ~150ms · 1M req/day ≈ 12 QPS · 86,400 s/day.

---

## §19 · REQUIREMENT → BUILDING BLOCK

This is the SD equivalent of the DSA pattern table. **Drill it the same way.**

| You hear | Reach for | The cross-question that follows |
|---|---|---|
| Read-heavy, same data repeatedly | **Cache — decide placement, eviction, invalidation** | "The cache expires and 10k requests hit at once" => stampede: coalescing, early/jittered expiry, or a lock |
| Nodes join and leave the cluster | **Consistent hashing + virtual nodes** | "Why virtual nodes?" => even distribution when a node dies |
| Data outgrows one machine | **Sharding** | "Defend your shard key" => hot partitions, resharding, cross-shard queries |
| Write-heavy, append-mostly | **LSM-tree store, not a B-tree** | "What does compaction cost you?" |
| Read-heavy, complex queries, joins | **Relational + read replicas** | "Replication lag — what does the user see?" |
| Slow work must not block the request | **Queue + async worker + DLQ** | "The queue backs up" => backpressure, autoscaling, shedding |
| "What if the client retries?" | **Idempotency key** | Exactly-once = at-least-once + idempotency. Where is the key stored? What TTL? Two concurrent retries? |
| Write to DB AND publish an event | **Outbox pattern** | "Why not just do both?" => the dual-write problem |
| Limit requests per user | **Token bucket, distributed via Redis** | "What if Redis goes down?" => local fallback, fail-open vs fail-closed |
| Feed with a few very popular producers | **Hybrid fan-out** | Pure fan-out-on-write breaks on celebrities — say this unprompted |
| Persistent bidirectional connection | **WebSockets + a connection registry** | "How does node A reach a user connected to node B?" |
| "Find things near me" | **Geohash / quadtree / S2 / H3** | "Why not a bounding-box scan?" |
| Multi-service transaction involving money | **Saga + compensating transactions** | "Why not 2PC?" => availability, lock duration, coordinator failure |
| Two customers buy the last item | **Reservation with TTL, or optimistic decrement** | "What if payment fails after the hold?" |
| Money must be auditable | **Double-entry ledger, append-only** | JPM/Amex core. "How do you correct a mistake?" => a reversing entry, never an update |
| "Users in Europe and the US" | **Multi-region** | "Active-active or active-passive? What is your RPO and RTO?" |
| Search box that completes as you type | **Trie / inverted index + ranking** | "How do you update the index?" |
| Uploads, images, video | **Object store + CDN + presigned URLs** | "Why not through your service?" |
| Something must run exactly once daily | **Scheduler + distributed lock/lease** | "Two schedulers fire at once" |
| "How do you know it is broken?" | **Metrics, logs, traces + alerting on SLO** | "What do you alert on?" => symptoms, not causes |
| Deploy without downtime | **Rolling / blue-green / canary** | "How do you roll back a schema change?" => expand-migrate-contract |

### The six cross-question categories

Every design must survive all six. Write the answers; do not just think them.

| Category | Shape | Examples |
|---|---|---|
| **Failure** | "What happens when X dies?" | Cache dies · leader dies mid-write · queue backs up · a region goes dark |
| **Scale** | "10x traffic — what breaks first?" | Hot partition · fan-out · connection pool · a single-threaded consumer |
| **Consistency** | "Two users, same instant" | Double-booking · double-charge · lost update · read-your-writes after a write |
| **Cost** | "Where is the money going?" | Cross-AZ egress · retaining every event forever · over-provisioned pods · a chatty N+1 |
| **Change** | "Now add this" | Multi-region · GDPR delete · an audit trail · a new consumer of the same events |
| **Justify** | "Why not the other one?" | Kafka not SQS · Postgres not Cassandra · cache not replica · a cron job not a queue |

---

## BLOCK B · TIER 1–2 — JPM · Amex · Expedia · Amazon · Microsoft · Adobe

### SD 1 · Fundamentals & estimation  *(week 1)*

**Who asks it.** Everyone. This is not a round — it is the tax you pay in every other round.  

**Asked as:**

- How many servers would you need for 100M daily active users?
- Estimate the storage for five years of a photo-sharing app.
- What is the QPS of a service with 500M requests a day?
- Walk me through CAP, and tell me where your last system sat.

**Clarify in the first three minutes:**

- Is this peak QPS or average? (peak is usually 2–3x average)
- Read-heavy or write-heavy, and roughly what ratio?
- What latency are we promising — p50 or p99?
- Is this one region or several?

**Back of the envelope.** Anchor everything to: 1M requests/day ≈ 12 QPS · 100M DAU x 10 actions = 1B events/day ≈ 12k QPS average, ~35k peak · 1KB x 1B = 1TB/day = 365TB/year. Round aggressively and say you are rounding.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Latency numbers** | L1 ~1ns · RAM ~100ns · SSD random read ~100us · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent ~150ms |
| **QPS** | Queries per second. 86,400 s/day, so 1M/day ≈ 12 QPS. Always state peak separately. |
| **CAP** | Under a network PARTITION you choose consistency or availability. It says nothing when there is no partition — which is most of the time. |
| **PACELC** | The honest extension: on Partition choose A or C; Else choose Latency or Consistency. This is the one that actually describes daily trade-offs. |
| **Strong consistency** | Every read sees the latest write. Costs a round trip or a quorum. |
| **Eventual consistency** | Replicas converge given no new writes. Fine for a like count, not for a bank balance. |
| **Read-your-writes** | A user always sees their own write, even if others do not yet. Cheapest fix for the "I posted it and it vanished" complaint. |
| **Monotonic reads** | You never see the clock go backwards. Prevents a refresh showing older data. |
| **SLA / SLO / SLI** | Contract / internal target / the actual measurement. Alert on the SLO, not the SLI. |
| **Nines** | 99.9% = 43 min/month down. 99.99% = 4.3 min. Each nine costs roughly 10x. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Peak vs average** | Design for average and hope · design for peak · autoscale | Size for peak, autoscale toward average. Say the peak-to-average ratio you assumed — 2-3x is defensible. |
| **Where to round** | Exact arithmetic · powers of ten | Powers of ten, out loud. An interviewer scores the method, not the digits. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Why not just use a bigger machine? | Vertical scaling has a ceiling and a single failure domain. It is often the right FIRST answer though — say that, then say when it stops working. |
| You said eventually consistent. What does the user actually see? | Name the concrete anomaly: a like count that flickers, a comment that disappears on refresh. Then name the mitigation: read-your-writes via sticky routing or reading your own writes from the primary. |
| What is your p99 and why is it worse than p50? | Queueing, GC pauses, cold caches, a slow replica, retries. p99 is where the tail lives and it is what users actually feel. |
| Four nines — what does that cost you? | Multi-AZ, automated failover, no manual deploys, an on-call rota. Say the operational cost, not just the architecture. |

**What sinks candidates here:**

- Reaching for a calculator or going silent. Estimate out loud, badly and fast, and correct yourself.
- Reciting CAP as "pick two". It is only a choice during a partition.
- Never stating peak vs average, so every downstream number is ambiguous.

---

### SD 2 · Caching  *(week 2)*

**Who asks it.** JPM · Amex · Expedia · Amazon · Microsoft  
**Case-study anchor.** Facebook memcache leases (the stampede paper) · Redis vs Memcached

**Asked as:**

- Design a caching layer for a read-heavy API.
- Our database is falling over under reads. What do you do?
- Design a distributed cache like Redis.
- How do you keep a cache and a database in sync?

**Clarify in the first three minutes:**

- What is the read-to-write ratio? (caching only pays above ~10:1)
- How stale can this data be — seconds, minutes, or never?
- What is the working-set size versus the total data size?
- Is a cache miss expensive, or just slower?

**Back of the envelope.** Cache sizing: hit rate follows the working set, not the total. 20% of keys usually serve 80% of reads. 100GB of data with a 10GB working set means 10GB of RAM buys you ~80% hit rate.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Cache-aside (lazy)** | App checks cache, misses, reads DB, writes cache. The default. Simple, and the first request after a write is always a miss. |
| **Write-through** | Write to cache and DB together. Cache is never stale; writes are slower. |
| **Write-back** | Write to cache, flush to DB later. Fast, and you can lose data on a crash. |
| **Write-around** | Write to DB only, let reads populate. Good when written data is rarely read soon after. |
| **TTL** | Expiry time. The cheapest form of invalidation, and usually the right one. |
| **Cache stampede** | A hot key expires and thousands of requests hit the DB at once. |
| **Request coalescing** | Only one request recomputes; the rest wait on it. Also called single-flight. |
| **Consistent hashing** | Keys map to a ring so adding or removing a node moves only 1/N of keys instead of all of them. |
| **Virtual nodes** | Each physical node owns many ring positions, so load stays even when one dies. |
| **Hot key** | One key taking a disproportionate share of traffic — a celebrity, a viral post. Breaks even a good sharding scheme. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Cache placement** | Client · CDN · app-local · shared cache tier · DB buffer pool | Usually a shared tier (Redis) plus a CDN for static. App-local is fastest but gives you N inconsistent copies. |
| **Invalidation** | TTL only · explicit delete on write · versioned keys | TTL is the default. Explicit delete on write when staleness is visible. Versioned keys when you cannot enumerate what to delete. |
| **Eviction** | LRU · LFU · FIFO · random | LRU by default. LFU when there is a stable hot set and you want to survive a scan. Say why you picked one. |
| **Redis vs Memcached** | — | Memcached is a simpler pure cache and multi-threaded. Redis gives data structures, persistence and replication. Pick Redis unless you genuinely only need get/set. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| The cache expires and 10,000 requests hit at once. What happens? | A stampede. Three fixes: request coalescing so one caller recomputes, jittered/randomised TTLs so keys do not expire together, or an early-recompute window where one request refreshes before expiry while others serve the old value. |
| What if Redis goes down entirely? | Decide fail-open or fail-closed. Fail-open means all traffic hits the DB — will it survive? Usually you need a circuit breaker plus load shedding, or the outage cascades. |
| Two servers write the same key at the same time. Which wins? | Last write wins by default, which can resurrect stale data. If it matters, use a versioned/CAS write or invalidate-then-write rather than write-then-invalidate. |
| How do you cache something a user is only allowed to see part of? | Cache the raw object and apply authorisation on read, or key the cache by (resource, permission-scope). Never cache the post-authorisation response under a shared key. |
| One key gets 50% of your traffic. Now what? | Hot key. Replicate that key across several nodes with a random suffix, or push it into app-local cache with a short TTL. |
| How do you warm a cold cache after a deploy? | Pre-warm from a snapshot of hot keys, or roll the deploy so only part of the fleet is cold at once. |

**What sinks candidates here:**

- Saying "add a cache" without saying what happens on a miss, on a write, or when it is down.
- Not knowing the stampede answer. It is the single most common cache follow-up.
- Ignoring the read-to-write ratio. A cache in front of a write-heavy store is worse than no cache.

---

### SD 3 · Databases — the choice, not the preference  *(week 3)*

**Who asks it.** JPM · Amex · Expedia. The deepest DB questioning is at tier 1.  
**Case-study anchor.** Postgres B-tree and MVCC internals — your own stack

**Asked as:**

- SQL or NoSQL for this, and defend it.
- Design the data model for [product].
- This query got slow after the table grew. Diagnose it.
- When would you NOT use a relational database?

**Clarify in the first three minutes:**

- What are the access patterns? (this decides the store, not the data shape)
- Do we need transactions across more than one entity?
- How much data, and how fast is it growing?
- Are the queries known in advance, or ad hoc?

**Back of the envelope.** A single well-indexed Postgres handles low tens of thousands of QPS and single-digit TB comfortably. Say that out loud — most systems never need more, and knowing the ceiling is worth more than knowing Cassandra.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **B-tree** | Sorted, balanced, good for reads and ranges. What Postgres and MySQL use. |
| **LSM-tree** | Buffer writes in memory, flush sorted runs, compact later. Fast writes, read amplification, compaction cost. Cassandra, RocksDB, ScyllaDB. |
| **Selectivity** | What fraction of rows a predicate keeps. Low selectivity means an index will not help. |
| **Covering index** | Contains every column the query needs, so it never touches the heap. |
| **Leftmost prefix** | A composite index on (a,b,c) serves a, a+b, a+b+c — never b alone. |
| **MVCC** | Each write creates a new row version; readers never block writers. Dead versions need VACUUM. |
| **Isolation levels** | Read committed (Postgres default) · repeatable read · serializable. Each forbids more anomalies and costs more. |
| **Normalisation** | Store facts once. Trade joins for consistency. Denormalise deliberately, not accidentally. |
| **Write amplification** | One logical write causing many physical writes — compaction, index maintenance, replication. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **SQL vs NoSQL** | — | Start relational. Move when you have a concrete reason: scale beyond one machine, a genuinely schemaless shape, or an access pattern relational storage serves badly. "It scales better" is not a reason on its own. |
| **B-tree vs LSM** | — | Read-heavy with ranges: B-tree. Write-heavy and append-mostly: LSM, and accept compaction. |
| **Index columns** | — | Equality columns first, then the range column. An index on (status, created_at) serves status=x AND created_at>y; the reverse order does not. |
| **Denormalise?** | — | Only when a join is measurably the bottleneck AND you have a plan for keeping the copies consistent. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Read me this EXPLAIN plan. | Name the scan type, compare estimated vs actual rows, find where the estimate is wrong. A seq scan on a big table with a selective predicate means a missing or unusable index. A huge estimate error means stale statistics — run ANALYZE. |
| Why is your index not being used? | Wrong column order, a function applied to the column, low selectivity so the planner prefers a seq scan, or a type mismatch forcing a cast. |
| Give me a lost update at READ COMMITTED. | Two transactions read balance=100, both compute 100-10, both write 90. One update vanished. Fix with SELECT FOR UPDATE, an atomic UPDATE ... SET balance = balance - 10, or a version column. |
| Your connection pool exhausted. Diagnose it. | Long-running transactions, leaked connections, an N+1 holding connections, or missing statement timeouts. Pool size should be roughly cores x 2, not hundreds — a bigger pool usually makes it worse. |
| How do you add a column to a 500M-row table with no downtime? | Expand-migrate-contract: add nullable, backfill in batches, dual-write, switch reads, then drop the old. Never a blocking ALTER in one shot. |
| What breaks when you shard this? | Cross-shard joins, cross-shard transactions, and unique constraints across shards. Say which of those your design needs and how you avoid them. |

**What sinks candidates here:**

- Choosing NoSQL as a default and being unable to say what specifically fails in Postgres.
- Not being able to read an EXPLAIN plan when the DB is on your resume.
- Talking about indexes without mentioning column order.

---

### SD 4 · Sharding & replication  *(week 4)*

**Who asks it.** JPM · Amex · Amazon · Uber  
**Case-study anchor.** Discord: Cassandra to ScyllaDB · Instagram sharded Postgres

**Asked as:**

- This table is 10TB. Shard it.
- How do you scale reads? How do you scale writes?
- What is your shard key, and why does it not create a hot partition?
- A replica is lagging. What does the user see?

**Clarify in the first three minutes:**

- Read-heavy or write-heavy? (replicas fix reads; only sharding fixes writes)
- What are the query patterns — always by one key, or ad hoc?
- Is the data naturally partitionable by tenant or user?
- Do we need cross-shard transactions? (if yes, push back hard)

**Back of the envelope.** Rule of thumb: one node holds low single-digit TB and tens of thousands of QPS. 10TB means ~4-8 shards with headroom, not 100. Over-sharding costs more operationally than it saves.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Range sharding** | Split by key range. Good for range scans, prone to hot spots at the ends (e.g. sharding by timestamp). |
| **Hash sharding** | Hash the key. Even distribution, no range scans. |
| **Directory sharding** | A lookup service maps key to shard. Flexible, and now the directory is a SPOF. |
| **Hot partition** | One shard taking disproportionate load. The failure mode of every naive shard key. |
| **Leader-follower** | One writer, many readers. Simple, and reads can be stale. |
| **Multi-leader** | Writes anywhere, conflicts possible. Needs a resolution strategy. |
| **Quorum (R+W>N)** | Read and write quorums overlapping guarantees you read the latest write. |
| **Replication lag** | How far behind a follower is. The source of "I posted it and it vanished". |
| **Resharding** | Moving data when you add shards. Consistent hashing keeps this to 1/N. |
| **Split brain** | Two nodes both believe they are leader. Prevented by fencing tokens or a quorum-based election. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Shard key** | user_id · tenant_id · hash(id) · timestamp | Almost never timestamp — it makes the newest shard the hottest. Pick the key that appears in the majority of queries so most reads hit one shard. |
| **Replicas vs shards** | — | Replicas scale READS and give you failover. Shards scale WRITES and storage. Do not reach for sharding when the problem is read load. |
| **Sync vs async replication** | — | Async by default — sync replication couples your write latency to your slowest replica. Sync (or quorum) when losing the last few writes is unacceptable. |
| **Failover** | Automatic · manual | Automatic with a quorum-based election and fencing. Manual failover means your RTO is however long it takes to wake someone up. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Defend your shard key. | Say the query distribution it serves, the hot-partition risk, and what happens when one tenant is 100x bigger than the rest — usually a dedicated shard for whales. |
| You need to add shards. How, without downtime? | Consistent hashing so only 1/N moves; dual-write during migration; backfill; verify; cut over reads; stop dual-writing. |
| A query needs data from three shards. | Scatter-gather, and now your latency is the slowest shard. If it is common, the shard key is wrong or you need a denormalised read model. |
| The leader dies mid-write. What is lost? | With async replication, anything not yet replicated. State your RPO explicitly. With quorum writes, nothing acknowledged is lost. |
| User posts a comment and refreshes — it is gone. Why? | They read from a lagging follower. Fix with read-your-writes: route that user to the leader for a short window, or track a write timestamp per session. |
| Two nodes both think they are the leader. | Split brain. Quorum election plus fencing tokens so the stale leader is rejected by the storage layer. |

**What sinks candidates here:**

- Sharding when replicas would have solved it.
- Choosing a shard key without saying what makes it hot.
- Claiming zero data loss with async replication.

---

### SD 5 · Queues, async & delivery semantics  *(week 5)*

**Who asks it.** JPM · Amex · Amazon · Uber. Directly connected to your Kafka module.  
**Case-study anchor.** Kafka vs SQS vs RabbitMQ — and your own custom Spring event components

**Asked as:**

- Design an async job pipeline.
- A request takes 30 seconds. Make it not.
- How do you guarantee this is processed exactly once?
- Design a notification / email sending system.

**Clarify in the first three minutes:**

- Does the caller need the result, or just an acknowledgement?
- Does ordering matter, and ordering by what — globally, or per user?
- What happens if a message is processed twice? Is that harmless?
- Do we need to replay history, or is a consumed message gone forever?

**Back of the envelope.** Queue depth is the signal to watch. Producers at 1k/s and consumers at 800/s means 200 messages/s of unbounded growth — say what you do BEFORE the disk fills.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **At-most-once** | Commit the offset first, then process. Loses messages on a crash. |
| **At-least-once** | Process first, then commit. Duplicates on a crash. The default choice. |
| **Exactly-once** | At-least-once plus idempotency. Not a delivery property you can buy — it is something you build. |
| **Idempotency key** | A client-supplied unique id; the server stores the result and returns it on a repeat. |
| **DLQ** | Dead letter queue. Where a message goes after N failed attempts, so it stops blocking the partition. |
| **Backpressure** | Making the producer slow down when consumers cannot keep up. Bounded queues give it to you for free. |
| **Outbox pattern** | Write the row and the event in one local transaction; a relay publishes from the outbox table. |
| **Dual write** | Writing to the DB and the broker separately. One can fail. This is the bug the outbox exists to prevent. |
| **Queue vs log** | A queue deletes on consume. A log keeps messages, so new consumers can replay from the beginning. |
| **Visibility timeout** | SQS: how long a consumed message is hidden before it reappears. Too short means duplicate processing. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Queue vs log** | SQS/RabbitMQ · Kafka | Need replay, multiple independent consumers, or ordering per key? Kafka. Just need work distributed to workers with per-message ack and retry? A queue is simpler and cheaper. |
| **Ordering** | Global · per key · none | Per key, via the partition key. Global ordering means one partition means no parallelism — almost never worth it. |
| **Retry policy** | Immediate · fixed · exponential with jitter | Exponential with jitter, capped, then DLQ. Immediate retries against a struggling downstream make the outage worse. |
| **Dual write vs outbox** | — | Outbox. Always. The dual-write problem is the thing an interviewer is checking you know. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| What if the client retries the request? | Idempotency key: client generates it, server stores key to result with a TTL, a repeat returns the stored result. Two concurrent retries need a unique constraint on the key so one loses. |
| Your consumer dies halfway through a batch. | The offset was not committed, so the messages are redelivered. Which means your consumer MUST be idempotent — say this before they ask. |
| Is exactly-once real? | Inside Kafka, yes — idempotent producer plus transactional writes. End to end, no: the moment you touch an external system you need idempotency at the consumer. |
| The queue is backing up. What do you do? | First diagnose: slow consumer, too few partitions, a poison message, or a downstream bottleneck. Then: scale consumers (up to partition count), shed low-priority load, and apply backpressure to producers. |
| One message keeps failing and blocks everything. | Poison message. Retry with backoff, then route to a DLQ so the partition advances. Then have a process to inspect and replay the DLQ. |
| How do you replay from the DLQ without causing chaos? | Fix the bug first, then replay at a throttled rate into a separate topic or with a flag, and rely on consumer idempotency. |
| You built custom event components in Spring. Why not Kafka? | Answer honestly: the constraint at the time. Then say precisely what Kafka would have bought — durability, replay, consumer groups, per-key ordering — and what it costs: an operational dependency and a rebalance model to reason about. |

**What sinks candidates here:**

- Saying "exactly once" as if the broker provides it.
- No DLQ, so one bad message stops the pipeline.
- Retrying non-idempotent operations. Especially payments.

---

### SD 6 · Kubernetes as a design primitive  *(week 6)*

**Who asks it.** JPM · Amex · Expedia. Unusual as an SD topic, and YOUR strongest card.  
**Case-study anchor.** Your own production cluster — frontend and backend pods

**Asked as:**

- How would you deploy and scale this design?
- Walk me through what happens when a pod dies.
- How do you deploy with zero downtime?
- Your service is running out of memory in production. Walk me through it.

**Clarify in the first three minutes:**

- Stateless or stateful? (that decides Deployment vs StatefulSet)
- What is the acceptable downtime during a deploy?
- Is scaling driven by CPU, memory, or a queue depth?
- Single cluster or multi-region?

**Back of the envelope.** Pod sizing: requests set what the scheduler reserves, limits set the hard cap. A JVM pod with a 2GB limit and no -XX:MaxRAMPercentage will happily try to use more and get OOMKilled.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Pod** | The scheduling unit. One or more containers sharing a network namespace and volumes. |
| **Deployment / ReplicaSet** | Declarative desired state; a controller reconciles reality toward it. |
| **Service** | A stable virtual IP plus a selector. How anything finds your pods. |
| **Ingress** | L7 routing into the cluster — host and path based. |
| **Liveness probe** | Fails, and the container is RESTARTED. |
| **Readiness probe** | Fails, and the pod is REMOVED FROM SERVICE ENDPOINTS but keeps running. |
| **Startup probe** | Gives a slow-booting app time before liveness starts counting. |
| **Requests vs limits** | Reserved vs capped. Set both; setting only limits makes requests default to limits and wrecks bin-packing. |
| **OOMKilled** | The container exceeded its memory limit and the kernel killed it. Exit code 137. |
| **CrashLoopBackOff** | The container keeps exiting; the restart delay grows exponentially. |
| **HPA** | Horizontal Pod Autoscaler — scales replica count on a metric. |
| **preStop + terminationGracePeriod** | The drain window. Without it, a rolling update kills in-flight requests. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Deployment vs StatefulSet** | — | Stateless: Deployment. Needs stable identity or per-pod storage (databases, Kafka): StatefulSet. And say out loud whether running the DB in-cluster is even a good idea. |
| **Probe design** | — | Liveness should check only "is this process wedged" — make it cheap and never depend on a downstream. Readiness SHOULD check downstreams. Swapping them is the classic mistake. |
| **Scaling signal** | CPU · memory · custom (queue depth) | CPU for request-serving. Queue depth or consumer lag for workers — CPU lies about whether a consumer is keeping up. |
| **Rollout** | Rolling · blue-green · canary | Rolling by default with maxUnavailable=0. Canary when the change is risky and you have the metrics to judge it. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| What breaks if you swap liveness and readiness? | A pod that is briefly busy or waiting on a downstream gets RESTARTED instead of temporarily removed from rotation. Under load that becomes a restart loop that takes the whole service down. |
| Your Java pod is OOMKilled. What do you change? | The JVM heap does not know about the container limit unless you tell it. Set -XX:MaxRAMPercentage, account for metaspace, thread stacks and direct buffers on top of heap, raise the limit if genuinely needed — and then actually find the leak with a heap dump. |
| Latency spikes but memory is fine. | CPU throttling. A CPU limit throttles via cfs quota rather than killing, so the app just gets slower in bursts. Check container_cpu_cfs_throttled_seconds. |
| Walk me through debugging CrashLoopBackOff. | kubectl describe pod for events (image pull, mount failure, probe failure) then kubectl logs --previous for the last crash, then the exit code — 137 is OOM, 1 is app error. Then check config and secrets actually exist. |
| How do you get truly zero downtime? | Readiness gating the rollout, a preStop hook plus terminationGracePeriodSeconds long enough to drain, graceful shutdown in the app, and backward-compatible schema changes. Any one missing and you drop requests. |
| You added HPA and it did not help. | The bottleneck was not the pods — it was the database, a connection pool, or a single Kafka partition. More replicas against a fixed downstream makes it worse. |
| How do you rotate a secret with no restart? | Mounted secrets update on a delay and need the app to re-read; env vars do not update at all. Either use a mounted file with a watcher, or accept a rolling restart. |

**What sinks candidates here:**

- Reciting Kubernetes concepts abstractly when you have production experience. Lead with a real incident.
- Not knowing the liveness vs readiness distinction cold. It is the most-asked K8s question there is.
- Treating HPA as a solution to every scaling problem.

---

### SD 7 · URL shortener + Pastebin  *(week 7)*

**Who asks it.** Amazon · Microsoft · Adobe · Expedia. Often the first design they give you.  
**Case-study anchor.** bit.ly · the classic warm-up design

**Asked as:**

- Design TinyURL.
- Design Pastebin.
- Design a link shortener with custom aliases, expiry and click analytics.
- How do you generate 100M unique short codes without collisions?

**Clarify in the first three minutes:**

- Custom aliases, or system-generated only?
- Do links expire?
- Do we need analytics per click, and at what granularity?
- Read-to-write ratio? (this one is extremely read-heavy — say ~100:1)

**Back of the envelope.** 100M new URLs/month ≈ 40 writes/s. At 100:1 that is ~4,000 reads/s. 100M x 500 bytes = 50GB/month, 3TB over five years. Small — say so, because it tells you a single DB plus a cache is plausible and sharding is a scale-out story, not a day-one need.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Base62** | [a-zA-Z0-9]. 62^7 ≈ 3.5 trillion codes — 7 characters is plenty. |
| **Counter-based generation** | A distributed counter, base62-encoded. No collisions by construction, but codes are guessable and sequential. |
| **Hash-based generation** | Hash the URL, take the first N chars, handle collisions by retry. Same URL maps to the same code (a feature or a bug). |
| **Range allocation** | Each app server claims a block of counter values from a coordinator, so it does not hit the counter per request. |
| **301 vs 302** | 301 permanent — the browser caches it and you lose analytics. 302 temporary — every click reaches you. Pick 302 if you want click data. |
| **Bloom filter** | Cheap probabilistic "have I seen this code" check to avoid a DB round trip on custom-alias collisions. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Code generation** | Counter + base62 · hash + collision retry · random + check | Counter with range allocation per server. No collision handling, no coordination on the hot path. Mention that sequential codes are enumerable and, if that matters, encrypt or shuffle the counter. |
| **Storage** | Relational · KV store | A KV store fits perfectly (code to URL), but relational is fine at this size. The interesting part is the cache, not the store. |
| **Redirect code** | 301 · 302 | 302 if analytics matter — 301 gets cached by the browser and your click counts vanish. |
| **Analytics** | Synchronous count · async event stream | Async. Never make the redirect wait on an analytics write. Fire an event, aggregate offline. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Two users request the same custom alias at the same instant. | A unique constraint on the alias column; one insert fails and gets an error. Do not check-then-insert — that is a race. |
| How do you stop someone enumerating all your links? | Sequential base62 is trivially enumerable. Either encrypt the counter (a format-preserving cipher) or accept it and treat links as unguessable-by-obscurity only, never as an access control. |
| One link goes viral — 50k requests a second on one key. | Hot key. It is in the cache, which is the easy part; the risk is a single cache node. Replicate the key or push it to CDN/edge with a short TTL. |
| How do expiries actually get deleted? | Do not run a delete sweep on the hot path. Lazy delete on read plus a background cleanup job, or a TTL in the store itself. |
| The counter service is a single point of failure. | Range allocation means servers hold a block, so a brief counter outage does not stop writes. Or use per-server prefixes so there is no shared counter at all. |
| Now support 10 billion links. | Shard by code prefix or hash. Because reads are by exact key, sharding is clean — no cross-shard queries. Say that; it is why this design scales so easily. |

**What sinks candidates here:**

- Spending 20 minutes on code generation and never getting to caching, which is where all the traffic is.
- Picking 301 and then claiming per-click analytics.
- Not noticing that this is a tiny dataset and over-engineering the storage.

---

### SD 8 · Rate limiter  *(week 8)*

**Who asks it.** JPM · Amex · Amazon · Uber. Also a very common LLD crossover.  
**Case-study anchor.** Stripe’s rate limiters · Redis token bucket

**Asked as:**

- Design a rate limiter.
- Limit each user to 100 requests per minute — across 50 servers.
- How do you protect a downstream service from being overwhelmed?
- Design an API gateway throttling layer.

**Clarify in the first three minutes:**

- Per user, per IP, per API key, or per endpoint?
- Hard limit or soft (throttle vs reject)?
- Is it acceptable to be approximate, or must it be exact?
- What do we return when limited — 429 with Retry-After?

**Back of the envelope.** The limiter itself is on the hot path of every request, so its cost matters. A Redis round trip per request adds ~1ms; at 50k QPS that is 50k extra Redis ops/s. That pressure is what pushes you toward local counters with periodic sync.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Fixed window** | Count per clock minute. Simple, and allows 2x burst across the boundary. |
| **Sliding window log** | Store every timestamp. Exact, and memory grows with traffic. |
| **Sliding window counter** | Weighted blend of the current and previous window. Nearly exact, tiny memory. The usual answer. |
| **Token bucket** | Tokens refill at a fixed rate up to a capacity. Allows controlled bursts. What most real systems use. |
| **Leaky bucket** | Requests drain at a constant rate. Smooths output, no bursts. |
| **429 + Retry-After** | The correct response. Tell the client when to come back. |
| **Fail-open vs fail-closed** | When the limiter is down: let everything through, or reject everything. Almost always fail-open — a broken limiter should not be an outage. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Algorithm** | fixed · sliding log · sliding counter · token bucket | Token bucket for user-facing APIs (bursts are legitimate). Sliding window counter when you need accuracy with low memory. Say why fixed window is tempting and wrong: the boundary burst. |
| **Where it runs** | Client · gateway/edge · per service | At the gateway, before your service does any work. Per-service limiters protect individual dependencies as a second layer. |
| **Distributed state** | Redis central · local + periodic sync · consistent-hash the user to one node | Redis centrally is the simple correct answer. Local counters with sync are approximate but survive Redis being down and remove a hot-path round trip. |
| **Failure mode** | — | Fail-open with a local fallback limit. State this unprompted — it shows you have run one in production. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| What if Redis goes down? | Fail-open, with a conservative local in-memory limit as a fallback so you are not completely unprotected. A limiter that takes down your API when it fails is worse than no limiter. |
| Fixed window — show me the problem. | 100/min limit. 100 requests at 11:00:59 and 100 more at 11:01:00 is 200 in one second, all legal. That is why sliding window or token bucket exists. |
| Per user or per IP — what breaks with each? | Per IP punishes everyone behind a corporate NAT or mobile carrier. Per user requires authentication, so unauthenticated endpoints still need IP limiting. Usually both, at different tiers. |
| Two servers process the same user simultaneously. Do they double-count? | With a central Redis counter and an atomic INCR, no. With local counters, yes — you allow up to N x limit in the worst case. Say which trade-off you took. |
| How do you limit expensive endpoints differently? | Weighted tokens — a heavy endpoint costs 10 tokens, a cheap one costs 1. Same bucket, different price. |
| A legitimate customer is being throttled during a spike. | Tiered limits by plan, burst capacity in the bucket, and a way to raise a specific customer’s limit without a deploy. That is a config lookup, not a code change. |

**What sinks candidates here:**

- Answering with fixed window and not knowing the boundary burst.
- Never addressing what happens when the limiter itself fails.
- Forgetting to return Retry-After, so well-behaved clients cannot back off correctly.

---

### SD 9 · News feed / timeline  *(week 9)*

**Who asks it.** Amazon · Microsoft · Adobe · Uber  
**Case-study anchor.** Twitter’s celebrity problem · Instagram feed

**Asked as:**

- Design Twitter / the Facebook news feed.
- Design Instagram’s home timeline.
- How do you handle a user with 100 million followers?
- Design a notification feed for an e-commerce app.

**Clarify in the first three minutes:**

- Chronological or ranked? (ranking changes the whole read path)
- How many followers does a typical user have — and the maximum?
- How fresh must the feed be? Seconds, or is a minute fine?
- Read-to-write ratio? (feeds are read-heavy, ~100:1)

**Back of the envelope.** 300M DAU, 2 posts/day = 600M posts/day ≈ 7k writes/s. Each read is a feed fetch: 300M x 10 refreshes = 3B reads/day ≈ 35k QPS. Fan-out on write at an average 200 followers = 7k x 200 = 1.4M feed-row writes/s. That number is why hybrid exists.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Fan-out on write** | Push the post into every follower’s feed at publish time. Fast reads, expensive writes, terrible for celebrities. |
| **Fan-out on read** | Pull from everyone you follow at read time. Cheap writes, slow reads, bad for users following thousands. |
| **Hybrid fan-out** | Push for normal users, pull for celebrities, merge at read. What every real system does. |
| **Feed store** | Per-user list of post ids, usually capped at a few hundred, in Redis or a KV store. |
| **Cursor pagination** | Paginate by (timestamp, id) rather than offset, so new posts do not shift pages. |
| **Write amplification** | One post causing N feed writes. The core cost of fan-out on write. |
| **Ranking signals** | Recency, affinity, engagement rate. Ranking turns the feed into a scoring problem on top of retrieval. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Fan-out strategy** | write · read · hybrid | Hybrid, with a follower-count threshold (say 10k) defining a celebrity. Say the threshold and say it is tunable. |
| **Feed storage** | Full posts · post ids only | Ids only, hydrated from a post cache on read. Storing full posts N times is enormous duplication and makes edits impossible. |
| **Feed length** | Unbounded · capped | Capped at ~500-1000 ids. Nobody scrolls further; older content falls back to a pull query. |
| **Pagination** | Offset · cursor | Cursor. Offset pagination on a feed that is constantly prepended shows duplicates and skips items. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| A user with 100M followers posts. Walk me through it. | Do NOT fan out. Mark them a celebrity, store the post once, and merge their posts into each follower’s feed at read time. This is the single question this design exists to test. |
| How do you merge pushed and pulled content at read time? | Fetch the precomputed feed, fetch recent posts from the handful of celebrities the user follows, merge by timestamp, take the top N. Cache the merged result briefly. |
| Someone deletes a post that is already in 200M feeds. | Do not chase it. Filter at read time by checking post existence/visibility in the hydration step — which is why you store ids, not copies. |
| A new user follows 500 accounts. Their feed is empty. | Backfill asynchronously from those accounts’ recent posts, and serve a pull-based feed until the backfill completes. |
| How do you make the feed personalised without killing latency? | Retrieve a candidate set cheaply (the feed store), then rank only those few hundred. Never rank the whole corpus at read time. |
| The fan-out workers fall behind at peak. | Queue depth grows. Prioritise: fan out to active users first, lazily backfill inactive ones on their next read. Most followers will not open the app in the next hour. |

**What sinks candidates here:**

- Picking pure fan-out on write and not raising the celebrity problem unprompted.
- Storing whole posts in every feed.
- Using offset pagination on a live feed.

---

### SD 10 · Chat system  *(week 10)*

**Who asks it.** Amazon · Microsoft · Uber  
**Case-study anchor.** WhatsApp · Discord’s message store (Cassandra to ScyllaDB)

**Asked as:**

- Design WhatsApp / Messenger / Slack.
- Design a real-time chat with delivery receipts and presence.
- How do you deliver a message to a user connected to a different server?
- Design group chat for 1,000 members.

**Clarify in the first three minutes:**

- 1:1 only, or groups? What is the maximum group size?
- Do we need read receipts and typing indicators?
- Message history — forever, or a retention window?
- End-to-end encrypted? (that removes server-side search entirely)

**Back of the envelope.** 50M DAU, 40 messages/day = 2B messages/day ≈ 23k writes/s. Each message fans out to at least one recipient. Connections are the real cost: 10M concurrent WebSockets at ~10k connections per node means ~1,000 gateway nodes.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **WebSocket** | A persistent bidirectional connection. The reason chat needs a connection registry. |
| **Connection registry** | A map of user to the gateway node holding their socket. Usually Redis with a TTL. |
| **Presence** | Online/offline/last-seen. Extremely chatty — usually heartbeats plus a decay window, not real-time truth. |
| **Delivery receipt** | sent / delivered / read. Three separate acknowledgements, each a message of its own. |
| **Offline queue** | Messages stored for a user who is not connected, delivered on reconnect. |
| **Message ordering** | Per conversation, not global. Use a per-conversation sequence number, not wall-clock time. |
| **Idempotent send** | Client generates a message id so a retry after a flaky network does not duplicate. |
| **Fan-out (group)** | A group message is one write plus N deliveries. Big groups are a fan-out problem, same as feeds. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Transport** | WebSocket · long polling · SSE | WebSocket for bidirectional. Mention long polling as the fallback for restrictive networks. |
| **Message store** | Relational · wide-column | Wide-column (Cassandra/Scylla) partitioned by conversation_id, clustered by sequence. Chat is append-heavy with range reads by conversation — the ideal LSM workload. |
| **Routing across nodes** | Registry lookup + direct RPC · pub/sub broadcast | Registry plus direct forward. Broadcasting every message to every gateway does not scale past a small fleet. |
| **Ordering** | Server timestamp · per-conversation sequence | Per-conversation monotonic sequence. Clock skew across servers makes timestamps unreliable for ordering. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| User A is on gateway 1, user B is on gateway 3. How does the message get there? | Look up B in the connection registry, forward the message to gateway 3 over an internal RPC or a pub/sub channel keyed by node. If B is absent, write to the offline queue. |
| The recipient is offline. Then comes back on a different device. | Offline queue keyed by user, drained on connect. Multi-device means per-device delivery cursors, not one — each device tracks what it has received. |
| Two messages arrive out of order. | Per-conversation sequence numbers; the client buffers and reorders on the gap. Do not rely on server timestamps across nodes. |
| A gateway node dies with 10,000 connections. | Clients reconnect (with jittered backoff, or you get a thundering herd), get assigned a new node, the registry updates, and the offline queue covers the gap. |
| Group of 1,000 — do you write 1,000 rows? | One message row per conversation, plus per-member delivery state. Do not duplicate message bodies per member. For very large groups, treat it like a feed and pull on read. |
| How does presence not melt your system? | Heartbeats every ~30s with a TTL in Redis, and only push presence changes to users actively viewing that contact. Real-time global presence is the classic scaling trap. |
| End-to-end encryption — what do you lose? | Server-side search, server-side spam filtering, and multi-device history sync becomes a key-management problem. Say this trade-off out loud. |

**What sinks candidates here:**

- Not having an answer for cross-node delivery. It is the whole question.
- Using timestamps for ordering.
- Treating presence as trivially real-time.

---

### SD 11 · Payments, ledger & idempotent charges  *(week 11)*

**Who asks it.** JP MORGAN · AMEX. This is their home turf — expect real depth.  
**Case-study anchor.** Stripe’s idempotency keys · double-entry bookkeeping

**Asked as:**

- Design a payment system.
- Design a wallet / ledger service.
- How do you make sure a customer is never double-charged?
- Design the money movement for a marketplace (buyer, seller, platform fee).

**Clarify in the first three minutes:**

- Are we moving real money, or internal credits?
- Do we own the ledger, or is a PSP (Stripe/Adyen) the source of truth?
- What is the reconciliation requirement — daily, real-time?
- Multi-currency? (that adds FX rate-at-time-of-transaction)

**Back of the envelope.** Payments are low QPS and high stakes. 1M transactions/day is only ~12 TPS — the design is not about throughput, it is about correctness under partial failure. Say that early; it reframes the whole conversation.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Double-entry** | Every transaction writes two entries, debit and credit, summing to zero. The invariant that makes the ledger auditable. |
| **Append-only ledger** | You never UPDATE a ledger row. Corrections are new reversing entries. |
| **Idempotency key** | Client-supplied unique id per payment attempt. The single most important control in this design. |
| **Authorisation vs capture** | Auth reserves funds; capture takes them. Two-phase, and the gap is where holds and expiries live. |
| **Reconciliation** | Comparing your ledger against the PSP or bank statement and explaining every difference. |
| **Settlement** | When money actually moves between institutions — hours or days after the transaction. |
| **Saga** | A multi-step money flow with compensating transactions instead of a distributed lock. |
| **Compensating transaction** | A business-level undo — a refund, not a rollback. |
| **Exactly-once (money)** | Achieved with idempotency keys plus a unique constraint, never with a broker guarantee. |
| **PCI scope** | Anything touching raw card data. Minimise it — tokenise at the edge so your services never see a PAN. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Ledger model** | Balance column · append-only entries | Append-only entries; balance is derived (and cached as a materialised snapshot). A mutable balance column has no audit trail and no way to explain a discrepancy. |
| **Consistency** | Eventual · strong | Strong within the ledger. Money is the canonical case for not being eventually consistent. Across services, use a saga with compensations. |
| **Distributed transaction** | 2PC · saga | Saga. 2PC holds locks across services and its coordinator is a single point of failure — unacceptable for availability. Say this explicitly, it is the expected answer. |
| **Idempotency storage** | In the payment row · a separate keys table | A separate table with a unique constraint on the key, storing the resulting response, with a TTL of at least 24h. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| The client times out and retries the charge. What stops a double charge? | The idempotency key. First request inserts the key (unique constraint), processes, stores the result. The retry hits the constraint, finds the stored result, returns it. Two CONCURRENT retries: one insert wins, the other waits or returns 409. |
| How do you correct a mistaken transaction? | A reversing entry, never an UPDATE. The original stays in the ledger forever — that is the point of append-only. |
| Payment succeeded at the PSP but your service crashed before recording it. | This is why reconciliation exists. Poll the PSP for the status of any pending transaction, or consume their webhook — and make webhook handling idempotent too, since they retry. |
| Two services both need to move money. How do you keep it consistent? | Saga with compensations: reserve, charge, credit; on failure at step 3, issue a refund for step 2. Each step idempotent, each compensation idempotent. |
| A user’s balance is wrong. How do you find out why? | Replay the ledger entries for that account and compare against the cached balance. If you had a mutable balance column, you could not do this — which is the argument for the design. |
| How do you handle a currency conversion? | Store the rate used and the timestamp on the transaction. Never recompute historic amounts from today’s rate. |
| What happens on a partial refund with a marketplace fee? | Decide the policy first — is the platform fee refunded? — then encode it as explicit ledger entries. The design question is really a business-rules question, and saying that is a good answer. |

**What sinks candidates here:**

- Not raising idempotency unprompted. At JPM and Amex this is disqualifying.
- Proposing 2PC without acknowledging its availability cost.
- A mutable balance column with no audit trail.

---

### SD 12 · Orders, inventory & reservations  *(week 12)*

**Who asks it.** AMAZON. Also Flipkart, Expedia (seats/rooms), and any e-commerce loop.  
**Case-study anchor.** Amazon inventory holds · Ticketmaster seat locks

**Asked as:**

- Design Amazon’s checkout.
- Design a ticket booking system (BookMyShow / Ticketmaster).
- Two customers buy the last item at the same instant. What happens?
- Design the inventory service for a warehouse.

**Clarify in the first three minutes:**

- Is overselling ever acceptable, or must it be strictly prevented?
- How long may a reservation be held before payment?
- Single warehouse or many? (multi-warehouse turns this into an allocation problem)
- What happens if payment fails after the hold?

**Back of the envelope.** Peak is the whole story: a normal day at 500 orders/s becomes 50,000/s during a flash sale on one SKU. Design for the hot-SKU case — that single row is the bottleneck, not overall QPS.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Reservation / hold** | Inventory taken out of available stock temporarily, with a TTL. |
| **TTL expiry** | The hold releases automatically if payment does not complete. Needs a sweeper or a lazy check. |
| **Optimistic locking** | Read version, write with WHERE version = x. Retry on conflict. Good under low contention. |
| **Pessimistic locking** | SELECT ... FOR UPDATE. Holds a row lock. Correct under high contention, at the cost of throughput. |
| **Atomic decrement** | UPDATE stock SET qty = qty - 1 WHERE sku = ? AND qty > 0. One statement, no read-modify-write race. Often the best answer. |
| **Oversell** | Selling more than you have. Sometimes tolerated (airlines) and sometimes catastrophic (concert seats). |
| **Saga** | Reserve inventory, charge payment, confirm order — with compensations at each step. |
| **Idempotency** | The order-placement endpoint must be idempotent, or a double-click creates two orders. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Concurrency control** | optimistic · pessimistic · atomic decrement | Atomic conditional decrement for simple stock. Pessimistic for specific named units (seat 14A) where you must hold identity. Optimistic when contention is genuinely low. |
| **Hold expiry** | Background sweeper · lazy check on read · TTL in the store | Lazy check plus a background sweeper. A sweeper alone leaves a window where expired holds still block sales. |
| **Order state** | Status column · state machine + event log | Explicit state machine (created, reserved, paid, confirmed, shipped, cancelled) with allowed transitions. Interviewers probe illegal transitions. |
| **Cross-service consistency** | 2PC · saga | Saga with compensations: release inventory if payment fails, refund if fulfilment fails. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Two customers buy the last item simultaneously. | Atomic conditional decrement — UPDATE ... WHERE qty > 0. Exactly one update affects a row; the other gets zero rows affected and a clean out-of-stock response. Never SELECT then UPDATE. |
| Payment fails after you reserved the seat. | The hold has a TTL and releases automatically. Additionally fire an explicit compensating release so the seat frees immediately rather than after the timeout. |
| The hold expires while the user is on the payment page. | Either refuse the payment and show a clear message, or extend the hold once. Decide the policy and say it — silently taking payment for released stock is the failure everyone hits. |
| A flash sale puts 50k requests/s on one SKU row. | That row is a single lock. Options: shard the stock into N buckets and decrement a random one, queue the requests and process serially, or admit users through a virtual waiting room. Say which and why. |
| User double-clicks Place Order. | Idempotency key on the order request. Same key returns the same order, never a second one. |
| How do you avoid overselling across three warehouses? | Either a single logical stock counter with allocation deciding the warehouse afterwards, or per-warehouse stock with the reservation naming the warehouse. Do not sum three counters and decrement one — that races. |
| Is eventual consistency ever OK for inventory? | For DISPLAY, yes — "only 3 left" can be slightly stale. For the reservation itself, no. Separating those two is the mature answer. |

**What sinks candidates here:**

- Read-then-write on stock. It is the exact race the question is testing.
- No answer for what happens when payment fails after the hold.
- Ignoring the hot-SKU case and only discussing aggregate QPS.

---

### SD 13 · Search, typeahead & notifications  *(week 13)*

**Who asks it.** Amazon (search suggestions is a favourite) · Adobe · Microsoft  
**Case-study anchor.** Elasticsearch inverted index · Google suggest

**Asked as:**

- Design search autocomplete / typeahead.
- Design product search for an e-commerce site.
- Design a notification service (email, push, SMS).
- How do you rank suggestions, and how do you update the ranking?

**Clarify in the first three minutes:**

- Typeahead latency budget? (under 100ms or it feels broken)
- Personalised suggestions, or global?
- How fresh must the index be — instant, or minutes?
- For notifications: what are the user preference and quiet-hours rules?

**Back of the envelope.** Typeahead fires on every keystroke: 10M searches/day x 20 keystrokes = 200M requests/day ≈ 2.3k QPS average, far higher at peak. Debounce on the client and cache aggressively — most prefixes repeat.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Inverted index** | term to list of document ids. The core structure of every search engine. |
| **Trie / prefix tree** | Prefix to completions, with the top-k precomputed on each node. |
| **Top-k on node** | Store the best k completions at each trie node so a lookup is O(prefix), not a subtree walk. |
| **Debounce** | Client waits ~150ms of no typing before firing. Cuts request volume enormously. |
| **TF-IDF / BM25** | Relevance scoring. Know the name and roughly what it does; you will not implement it. |
| **Index freshness** | The lag between a write and it becoming searchable. Near-real-time is usually minutes, not milliseconds. |
| **Fan-out (notifications)** | One event to many channels and many users, with per-user preferences. |
| **Deduplication** | Collapsing 50 "someone liked your post" into one digest. A product requirement that shapes the architecture. |
| **Quiet hours / throttling** | Per-user rules about when and how often you may notify. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Typeahead structure** | Trie with top-k · prefix range query on a sorted store · Elasticsearch completion suggester | Trie with precomputed top-k for latency. Say that rebuilding it is a batch job, which is why suggestions lag reality by minutes. |
| **Index updates** | Real-time · near-real-time batch | Near-real-time. Full rebuild nightly, incremental updates every few minutes. Instant indexing is expensive and rarely required. |
| **Notification delivery** | Synchronous · queued | Queued, always. One queue per channel so a slow SMS provider does not block email. |
| **Notification dedup** | — | Aggregate in a window before sending. This is a product decision with an architectural consequence — say both. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| How do you keep typeahead under 100ms? | Precomputed top-k per prefix node, held in memory, plus an edge cache. The query does no ranking at request time — all ranking happened offline. |
| A new trending term appears. How long until it suggests? | However often you rebuild. Say the number. If it must be instant, maintain a small real-time overlay index merged at query time with the batch index. |
| How do you personalise without recomputing per user? | Retrieve a global candidate set, then re-rank the top ~20 with user signals at request time. Never personalise retrieval itself. |
| The SMS provider is down and the queue is filling. | Circuit breaker on that channel, DLQ for failures, and fall back to another channel if the notification is important. Separate queues per channel are what make this containable. |
| A user gets 200 notifications in a minute. | Aggregation window plus per-user rate limits plus quiet hours. Also an unsubscribe path — a notification system without one is a product bug. |
| How do you handle typos? | Edit-distance matching on the index, or a separate spell-correction pass. Fuzzy matching in the trie explodes the search space, so it is usually a second lookup, not the main path. |

**What sinks candidates here:**

- Doing ranking at query time and blowing the latency budget.
- One queue for all notification channels.
- No user preference or throttling model — the interviewer will ask about spam.

---

## BLOCK C · TOP TIER — Uber · Apple · Amazon-senior

### SD 14 · Uber ride matching & geo indexing  *(week 14)*

**Who asks it.** UBER. Also Lyft, DoorDash, Swiggy, Zomato-style loops.  
**Case-study anchor.** Uber H3 hexagonal grid · Google S2

**Asked as:**

- Design Uber / Lyft.
- Find all drivers within 2km of this rider.
- How do you handle 1M drivers updating their location every 4 seconds?
- Design food delivery dispatch.

**Clarify in the first three minutes:**

- How often do drivers report location? (this dominates write volume)
- Matching by distance only, or ETA, rating, surge?
- How large is the search radius, and does it expand on failure?
- Is a driver allowed to decline? (that turns matching into an offer loop)

**Back of the envelope.** 1M active drivers reporting every 4s = 250k writes/s of pure location churn. That number is the reason you do NOT put live location in your primary database — it goes to an in-memory geo store with a short TTL.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Geohash** | Interleave lat/long bits into a string; shared prefix means nearby. Simple, with edge-case pain at cell boundaries. |
| **Quadtree** | Recursively subdivided grid, adapts to density. Good for uneven distributions like cities vs countryside. |
| **S2** | Google’s sphere-to-cell library. Hilbert-curve ordering, well-behaved cells. |
| **H3** | Uber’s hexagonal grid. Hexagons have uniform neighbour distance — no diagonal problem. The one to name in an Uber interview. |
| **Cell / bucket** | A region id. Nearby search means "my cell plus its neighbours", not a distance scan. |
| **Boundary problem** | The nearest driver may be in an adjacent cell. Always query neighbours too. |
| **Supply/demand** | Drivers vs riders per cell over time. Drives surge and repositioning. |
| **Dispatch/offer loop** | Offer to a driver, wait for accept, time out, offer to the next. Matching is a sequence, not one decision. |
| **ETA vs distance** | Straight-line distance is wrong across a river. Real matching uses road-network ETA. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Geo index** | geohash · quadtree · S2 · H3 | H3 for an Uber interview and say why: uniform hexagon neighbours, no diagonal distortion. Geohash is fine as the simple answer if you name the boundary problem. |
| **Location storage** | Primary DB · in-memory geo store | In-memory (Redis geo / a dedicated service) with a TTL. Location is high-churn, low-value, and disposable — persisting every ping is a mistake. |
| **Matching** | Nearest · ETA-based · batched optimisation | Start with nearest-by-ETA within an expanding radius. Mention batch matching (matching several riders and drivers together every few seconds) as the optimisation — it beats greedy per-request matching. |
| **Consistency** | — | Two riders must never be matched to the same driver. That single assignment needs a lock or an atomic state transition on the driver record — this is the correctness core. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Why not just SELECT ... WHERE distance < 2km? | A full scan over a million rows per request. Geo indexing turns it into a lookup of a handful of cells. |
| The nearest driver is just over the cell boundary. | Query the cell and all its neighbours, then filter by true distance. Hexagons make this cleaner — six equidistant neighbours instead of eight at two different distances. |
| 250k location writes per second. Where do they go? | Not the primary DB. In-memory geo store keyed by driver, TTL a few minutes, no durability. If you need history, sample it and stream it to cold storage separately. |
| Two riders get matched to the same driver. | The assignment must be an atomic state transition on the driver — compare-and-set from AVAILABLE to ASSIGNED. Whoever loses re-enters matching. |
| The driver does not respond to the offer. | Timeout (say 15s), release, offer to the next candidate. Track decline rates — this is the offer loop and it is where the product actually lives. |
| Surge pricing — how do you compute it? | Supply/demand ratio per cell over a rolling window, smoothed to avoid flapping. Say "smoothed" — instant surge changes are a bad user experience and interviewers know it. |
| A whole city’s drivers go offline (network outage). | TTLs expire and they vanish from the index, which is correct behaviour. Riders see no availability; you need a degraded-mode message rather than an infinite spinner. |

**What sinks candidates here:**

- Proposing a bounding-box scan.
- Storing every location ping durably.
- No answer for the double-assignment race.

---

### SD 15 · Metrics & observability at scale  *(week 15)*

**Who asks it.** Uber · Apple · Amazon-senior. Also strong signal at JPM if you run production.  
**Case-study anchor.** Prometheus · Facebook Gorilla time-series compression

**Asked as:**

- Design a metrics/monitoring system.
- Design a distributed tracing system.
- How do you store a billion time series?
- How would you alert on this design you just built?

**Clarify in the first three minutes:**

- Metrics, logs, or traces? (they are three different storage problems)
- What retention — high resolution for how long?
- Query patterns: dashboards (predictable) or ad-hoc investigation?
- What is the cardinality of the labels? (this is the killer)

**Back of the envelope.** 10k hosts x 1k metrics x 1 sample per 10s = 1M samples/s. At 16 bytes raw that is 16MB/s = 1.4TB/day. Gorilla-style delta-of-delta compression takes that to ~1.4 bytes/sample — which is why time-series databases exist instead of using Postgres.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Time series** | A metric name plus a label set, over time. The unit of storage. |
| **Cardinality** | The number of distinct label combinations. Adding user_id as a label is how you kill a metrics system. |
| **Pull vs push** | Prometheus scrapes targets; StatsD receives pushes. Pull gives you a free health signal; push works behind NAT and for short-lived jobs. |
| **Downsampling** | Keeping 10s resolution for a day, 1m for a month, 1h for a year. |
| **Delta-of-delta encoding** | Timestamps are regular, so store the change in the change. Near-free compression. |
| **Span / trace** | A trace is a request; a span is one operation within it. Linked by a propagated trace id. |
| **Sampling** | Storing 1% of traces. Head-based (decide at the start) or tail-based (decide after seeing the whole trace — keeps the slow ones). |
| **SLO burn rate** | How fast you are consuming your error budget. The correct thing to alert on. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Metrics vs logs vs traces** | — | Metrics for "is it broken" (cheap, aggregated). Logs for "what exactly happened" (expensive, detailed). Traces for "where did the time go" (sampled). Saying this distinction cleanly is most of the round. |
| **Pull vs push** | — | Pull for long-lived services — you get target health for free. Push for batch jobs that die before a scrape. |
| **Storage** | Relational · TSDB · columnar | Purpose-built TSDB. Say why a relational store fails: no delta compression, and the index cost per series is ruinous. |
| **Sampling for traces** | head · tail | Tail-based if you can afford it — it keeps the slow and failed traces, which are the ones you actually want. Head-based is cheaper and throws away the interesting ones. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Someone adds user_id as a metric label. What happens? | Cardinality explosion — one series per user. Memory and index blow up and the system falls over. Labels must be low-cardinality; high-cardinality dimensions belong in logs or traces. |
| Why is "CPU > 80%" a bad alert? | It is a cause, not a symptom, and it is often fine. Alert on user-visible symptoms and SLO burn rate; put CPU on a dashboard for diagnosis. |
| You have metrics, logs and traces, and the app is slow. What first? | Metrics to confirm and localise (which service, which endpoint, p99 vs p50), traces to find where the time goes, logs last for the specific failing request. Cheapest to most expensive. |
| How do you keep a year of data without keeping a year of raw samples? | Downsample in tiers and drop raw after the high-resolution window. Say the retention policy as part of the design, not an afterthought. |
| A trace crosses five services and a Kafka hop. How does the id survive? | Propagate it in HTTP headers and in Kafka message headers, and make sure your async executor copies the context — this is where trace ids are usually lost. |
| The monitoring system goes down. How do you know? | Dead-man’s switch: an alert that fires when the heartbeat STOPS. Monitor the monitor externally. |

**What sinks candidates here:**

- Not raising cardinality unprompted — it is the defining failure of this domain.
- Conflating metrics and logs into one storage design.
- Alerting on causes instead of symptoms.

---

### SD 16 · File storage, CDN & video streaming  *(week 16)*

**Who asks it.** Apple · Amazon · Adobe (media is their domain)  
**Case-study anchor.** Netflix Open Connect · YouTube transcoding pipeline

**Asked as:**

- Design Dropbox / Google Drive.
- Design YouTube / Netflix.
- Design an image upload and serving pipeline.
- How do you stream video to 100M concurrent viewers?

**Clarify in the first three minutes:**

- Upload size limits? (over ~100MB you need chunked/resumable uploads)
- Do we need sharing, permissions, versioning?
- Live streaming or video on demand? (completely different pipelines)
- What is the geographic distribution of viewers?

**Back of the envelope.** Video dominates everything: 1 hour of 1080p ≈ 3GB, and you store 4-6 encoded variants, so ~15GB per source hour. 500 hours uploaded per minute (YouTube scale) is why transcoding is the expensive part, not storage.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **Object store** | S3-style. Flat key to blob, cheap, durable, not a filesystem. |
| **Presigned URL** | A time-limited signed URL letting the client upload or download directly, bypassing your servers. |
| **Chunked / resumable upload** | Split into parts, upload independently, retry only failed parts, assemble server-side. |
| **Content-addressed storage** | Key by hash of content. Gives you free deduplication. |
| **CDN / edge** | Cached copies near the user. The reason video is viable at all. |
| **Cache hit ratio at edge** | The whole economics of streaming. A 95% hit ratio means origin serves 5% of traffic. |
| **Transcoding** | Converting the source into multiple resolutions and bitrates. CPU-expensive, done async. |
| **Adaptive bitrate (HLS/DASH)** | Video split into segments at several bitrates; the client switches based on bandwidth. |
| **Manifest** | The playlist file telling the client what segments exist at what bitrates. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Upload path** | Through your service · presigned direct-to-storage | Presigned direct upload. Never proxy large files through your application servers. |
| **Storage** | Filesystem · object store | Object store, with metadata (owner, permissions, versions) in a database. Separating blob from metadata is the core structural decision. |
| **Transcoding** | Sync · async pipeline | Async queue with workers. The upload returns immediately; the video becomes playable as each rendition completes. |
| **Delivery** | Origin · CDN | CDN, with the origin only serving cache misses. For very large scale, ISP-embedded caches (what Netflix Open Connect actually is). |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| A 5GB upload fails at 90%. | Chunked resumable upload — only the failed chunk is retried. Without it, the user starts over and gives up. |
| Two users upload the identical file. | Content-addressed storage: hash the content, find it exists, just add a metadata reference. This is how Dropbox dedupes. |
| How does the video start playing before transcoding finishes? | Prioritise one baseline rendition, publish it, and let higher qualities appear as they complete. The manifest is updated as renditions land. |
| A new video goes viral and it is not in any edge cache. | Every request misses to origin — a stampede at CDN scale. Mitigate with origin shielding (a mid-tier cache absorbing misses) and pre-warming for predictable launches. |
| How do you stop someone sharing a direct link to paid content? | Signed URLs with a short expiry and, for video, per-segment tokens. Signing the manifest is not enough if the segments are publicly addressable. |
| How do permissions work if the CDN serves the file? | Authorise at the point of issuing the signed URL, not at delivery. The CDN never checks permissions — the signature is the permission. |
| Live streaming instead of VOD — what changes? | No pre-transcoding time, so you transcode in real time; segments are produced continuously; the manifest is a sliding window; and latency becomes the primary constraint. |

**What sinks candidates here:**

- Proxying uploads and downloads through application servers.
- Making transcoding synchronous.
- Not separating blob storage from metadata storage.

---

### SD 17 · Distributed transactions — saga vs 2PC  *(week 17)*

**Who asks it.** Uber · Amazon-senior · JPM. The question behind every multi-service design.  
**Case-study anchor.** The outbox pattern · Uber’s and Amazon’s saga usage

**Asked as:**

- Two services both need to change state atomically. How?
- Design a booking flow spanning payment, inventory and notification.
- Why not use two-phase commit?
- You write to the database and publish an event. How do you make that atomic?

**Clarify in the first three minutes:**

- Does the user need a synchronous answer, or can this complete asynchronously?
- Is a compensating action actually possible? (you cannot un-send an email)
- What is the acceptable window of inconsistency?
- Who owns the overall state of the workflow?

**Back of the envelope.** Not a throughput question. The metric that matters is the inconsistency window — how long can step 2 be done while step 3 is not? Say a number (seconds, minutes) and design the reconciliation to match.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **2PC** | Prepare then commit, coordinated. Gives atomicity, holds locks across services, and the coordinator is a SPOF. |
| **Saga** | A sequence of local transactions, each with a compensating action. Eventual consistency, no distributed locks. |
| **Choreography** | Services react to each other’s events. No central controller; hard to see the whole flow. |
| **Orchestration** | One coordinator drives the steps. Easier to reason about and debug; the orchestrator is a dependency. |
| **Compensating transaction** | A business-level undo (a refund), not a database rollback. |
| **Outbox pattern** | Write the row and the event to an outbox table in ONE local transaction; a relay publishes from the outbox. |
| **Dual write** | Writing to two systems separately. One can fail. The bug the outbox prevents. |
| **Idempotent consumer** | Required, because at-least-once delivery means every step can run twice. |
| **Semantic lock** | Marking a record as "pending" so other operations know it is mid-saga. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **2PC vs saga** | — | Saga, essentially always in a service architecture. Say why: 2PC holds locks for the duration of a network call, blocks on coordinator failure, and trades availability for an atomicity you can usually get another way. |
| **Choreography vs orchestration** | — | Orchestration for anything with more than ~3 steps or that needs to be debuggable. Choreography is elegant for two services and becomes unfollowable at five. |
| **Publishing events** | Direct publish after commit · outbox | Outbox. This is the expected answer and the interviewer is checking whether you know the dual-write problem exists. |
| **Failure handling** | Retry forever · retry then compensate · retry then human | Retry with backoff, then compensate, then a dead-letter with alerting. Say that some failures need a human — pretending everything auto-resolves is not credible. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Why not just write to the DB and then publish to Kafka? | If the publish fails after the commit, the event is lost and the systems diverge silently. If you publish first and the commit fails, you have announced something that did not happen. That is the dual-write problem. |
| How does the outbox relay work exactly? | A poller (or CDC on the WAL) reads unpublished outbox rows, publishes them, marks them sent. At-least-once, so consumers must be idempotent. Debezium is the CDC answer if they push. |
| Step 3 of 5 fails. Walk me through it. | Compensate 2 then 1, in reverse order, each compensation idempotent and retryable. Mark the saga failed with the reason. If a compensation itself fails, retry then escalate — it does not silently disappear. |
| What if you cannot compensate? You already sent the email. | Then order the steps so irreversible actions come LAST, after everything reversible has succeeded. That reordering is the design answer. |
| A compensating transaction runs twice. | It must be idempotent — a refund keyed by the original transaction id, not "refund 10 more". Same discipline as the forward path. |
| How do you know a saga is stuck? | Persist saga state with a timestamp and alert on anything in a non-terminal state past a threshold. Without that, stuck sagas are invisible until a customer complains. |
| Is there any case for 2PC? | Within one database across tables, or across resources that support XA and where you control both and availability is not paramount. Being able to say when it IS right is what separates a real answer from a memorised one. |

**What sinks candidates here:**

- Not knowing the dual-write problem.
- Describing a saga with no compensation for a step that cannot be undone.
- Choreography for a six-step flow, with no way to see the current state.

---

### SD 18 · Multi-region & disaster recovery  *(week 18)*

**Who asks it.** JP MORGAN · AMEX (regulatory DR requirements are real) · Apple  
**Case-study anchor.** AWS multi-AZ vs multi-region · bank DR requirements

**Asked as:**

- Make your design multi-region.
- A whole region goes down. What happens?
- What is your RPO and RTO?
- How do you serve European and US users with one system?

**Clarify in the first three minutes:**

- Is this for latency (users near data) or for disaster recovery? (different designs)
- What is the acceptable data loss — zero, or a few seconds?
- Are there data residency rules? (GDPR means EU data may not leave)
- Active-active, or active-passive with failover?

**Back of the envelope.** Cross-region RTT is ~80-150ms. A synchronous cross-region write costs you that on every write. That single number decides active-active vs active-passive more than anything else.

**Terms you must own**

| Term | In one sentence |
|---|---|
| **RPO** | Recovery point objective — how much data you may lose. Async replication means RPO > 0, always. |
| **RTO** | Recovery time objective — how long until you are back. Manual failover means RTO is measured in people, not machines. |
| **Active-passive** | One region serves; the other stands by. Simple, wasteful, and failover is a real event you must rehearse. |
| **Active-active** | Both serve. No wasted capacity, and you now own conflict resolution. |
| **Conflict resolution** | LWW · CRDT · application-level merge. Needed the moment two regions accept writes for the same data. |
| **Data residency** | Legal requirement that data stays in a jurisdiction. Changes the sharding key to region. |
| **Geo-DNS / anycast** | Routing users to the nearest healthy region. |
| **Split brain** | Both regions believing they are primary during a partition. |
| **Failover drill** | Actually practising it. An untested failover plan is a hypothesis. |

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Active-active vs active-passive** | — | Active-passive unless you genuinely need write latency in both regions. Active-active means conflict resolution, and most teams underestimate that cost by an order of magnitude. |
| **Replication** | sync · async | Async across regions — sync means every write pays 150ms. If RPO must be zero, you need synchronous quorum, and you must accept the latency. State the trade explicitly. |
| **Partitioning by region** | — | If data residency applies, region becomes part of the partition key and cross-region reads become a product decision, not a technical one. |
| **Failover** | automatic · manual | Manual with a well-rehearsed runbook is often BETTER than automatic — automatic failover on a network blip causes split brain. Say this; it is a mature position. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| What is your RPO with async replication? | Non-zero, equal to the replication lag at the moment of failure — typically seconds. If the business needs zero, async is off the table and you pay the latency. |
| Both regions accept writes for the same user record. Then what? | Conflict. Last-write-wins loses data silently. Options: partition users to a home region so conflicts cannot occur, use CRDTs for mergeable data, or resolve in the application with business rules. |
| The network between regions partitions. Both think they are primary. | Split brain. Prevented with a quorum across three locations (two regions plus a witness) so a minority cannot promote itself. |
| How do you test the failover? | Scheduled game days that actually fail a region over in production. If you have never tested it, your RTO is a guess — say that plainly. |
| GDPR says EU data stays in the EU. What changes? | Region becomes a partition key. Users have a home region; cross-region features either aggregate anonymously or do not exist. This is a product constraint, not just infrastructure. |
| Cost of active-active? | Double the capacity, double the operational surface, plus conflict resolution engineering. Justify it with a requirement — latency or regulatory — not with "it is more resilient". |
| A deploy takes down region A. Does failover help? | No — the bad code follows you. Regional failover protects against infrastructure failure, not bad releases. That is what canary and rollback are for. Making that distinction is a strong answer. |

**What sinks candidates here:**

- Claiming zero RPO with async replication.
- Active-active with no conflict-resolution story.
- Never having considered that failover must be rehearsed.

---

### SD 19 · Recorded mock ×2  *(week 19)*

**Who asks it.** Unseen prompt. No preparation, no notes, 45 minutes, recorded.  

**Asked as:**

- Design a ride-sharing service for airports only.
- Design a system to detect fraudulent transactions in real time.
- Design a collaborative document editor.
- Design a leaderboard for a game with 50M players.
- Design an ad-click aggregation pipeline.
- Design a distributed cron scheduler.

**Clarify in the first three minutes:**

- Restate the problem in your own words before anything else.
- Ask about scale in the first three minutes. Every time.
- Get agreement on the functional scope before drawing a single box.
- Say your assumptions out loud and write them down.

**Back of the envelope.** Follow the framework in order. The most common mock failure is jumping to boxes and arrows before establishing requirements and estimates.

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Pick your own deep dive** | — | At minute 30, choose the interesting component and go deep before they ask. Choosing well is scored — it shows judgement about where the difficulty is. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Watch the recording and count these | Dead-air gaps over 20 seconds · times you drew before agreeing requirements · trade-offs you asserted without naming the alternative · follow-ups you fumbled. |
| Did you state peak vs average? | If not, every capacity number you gave was ambiguous. |
| Did you name the alternative you rejected? | "I would use Kafka" is weak. "Kafka over SQS because we need replay and per-key ordering" is the same sentence with the signal added. |
| Would you hire you? | Be honest. Then write down the one thing you would fix and drill only that before the next mock. |

**What sinks candidates here:**

- Drawing before agreeing on requirements.
- Waiting to be asked the follow-up instead of raising it yourself.
- Running out of time because you spent 20 minutes on the data model.

---

### SD 20 · Recorded mock ×2  *(week 20)*

**Who asks it.** Unseen prompt. Different domain from last week.  

**Asked as:**

- Design a hotel booking system.
- Design a stock trading matching engine.
- Design a web crawler.
- Design an API gateway.
- Design a feature-flag service.
- Design a system for real-time analytics dashboards.

**Clarify in the first three minutes:**

- Same discipline. Restate, scope, scale, then design.
- For anything with money or inventory, raise idempotency and races unprompted.

**Back of the envelope.** By now the estimation should take under four minutes and feel automatic. If it does not, that is the thing to drill.

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Deliberately practise the pushback** | — | Have the interviewer (or you, playing them) reject your first design choice. Practise defending it, then practise conceding gracefully and adapting. Both are scored. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Did you survive all six categories? | Failure · scale · consistency · cost · change · justify. Write the answers down afterwards for whichever you fumbled. |
| Was your deep dive the interesting part? | If you deep-dived the part you found easy, you dodged. That is visible. |

**What sinks candidates here:**

- Repeating the same architecture regardless of the problem.
- Not adapting when a requirement is added mid-round.

---

### SD 21 · Recorded mock ×2  *(week 21)*

**Who asks it.** Unseen prompt, under fatigue — run these back-to-back with a 15-minute break.  

**Asked as:**

- Design a multi-tenant SaaS billing system.
- Design a content moderation pipeline.
- Design a service that emails 50M users a daily digest.
- Design an online judge (like LeetCode) that runs untrusted code.
- Design a URL safety checker at browser scale.
- Design an event-sourced order system.

**Clarify in the first three minutes:**

- Same framework, tired. That is the point of this week.

**Back of the envelope.** Stamina test. Round 2 should be within 15% of round 1 in quality.

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **Second round is the real test** | — | Everyone is good in round 1. Compare the recordings and find what degrades — usually narration first, then edge cases, then complexity precision. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| What degraded between round 1 and round 2? | Name it specifically. That is what to shore up before the real loop. |

**What sinks candidates here:**

- Treating the second round as optional. It is the one that predicts your real onsite.

---

### SD 22 · Final mock + rebuild the vocabulary from memory  *(week 22)*

**Who asks it.** You, alone, with a blank page.  

**Asked as:**

- Reproduce the requirement→building-block table from memory.
- Reproduce the six cross-question categories and one example of each.
- Reproduce the latency numbers and the estimation anchors.
- One final recorded mock on an unseen prompt.

**Clarify in the first three minutes:**

- No notes. What you cannot reproduce is what you have not learned.

**Back of the envelope.** Target: 85% of the trigger table reproduced from memory.

**Decision points**

| Decision | Options | Verdict, and why |
|---|---|---|
| **What to do with the gaps** | — | Whatever you could not reproduce goes on a physical index card you carry and review daily until the loop. Do not try to re-learn it from scratch this late. |

**Cross-questions** — cover the right column and say it out loud

| They ask | The answer's spine |
|---|---|
| Can you name the building block for every requirement phrase? | If yes, you have the vocabulary. If no, drill only the misses — not the whole table. |

**What sinks candidates here:**

- Learning something new on the last day. Consolidate; do not expand.

---
# PART III — LLD / OOD / MACHINE CODING

**Three different rounds wear this name**, and confusing them is how people lose it before writing a line.

| Flavour | Who | Format | What scores |
|---|---|---|---|
| **Whiteboard OOD** | Amazon · Adobe · Microsoft · JPM | 45–60 min, class diagram plus key methods | Entities, relationships, extensibility. SOLID applied, never recited. You are scored on whether a new requirement slots in without rewriting. |
| **Machine coding** | Uber · Flipkart · Swiggy | 60–90 min, RUNNABLE and TESTED code | FINISHING. An unfinished elegant design scores below a finished plain one. Ship a working skeleton in 20 minutes, then enrich. |
| **Amazon hybrid** | Amazon | 60 min: design PLUS working code PLUS an algorithmic core | Doing all three under one clock. Most candidates over-invest in the diagram and never run the code. |

**13 problems · 33 code patterns · 65 cross-questions.**

---

## THE 60-MINUTE SCRIPT

| Clock | Phase | What you actually do |
|---|---|---|
| 0:00–5:00 | **Clarify and scope** | Restate. Ask 4–6 questions. Write the scope on the board and get explicit agreement: "so we are building X and Y, not Z — agreed?" Scope creep later is then their choice, not your failure. |
| 5:00–12:00 | **Entities and relationships** | Nouns become classes, verbs become methods. Draw cardinality on every line (1..*, 0..1). Enums for closed sets. Say "I am deliberately keeping this in memory." |
| 12:00–20:00 | **Interfaces and the extension axes** | Name the things that will change — pricing, scheduling, notification channel — and put an interface on each. This is where the round is actually won. |
| 20:00–40:00 | **Implement the core** | Not every class. The one flow that proves the design: park a vehicle, book a seat, dispense an item. Real method bodies, not pseudocode. |
| 40:00–50:00 | **Concurrency and edge cases** | Say where two users collide and how you resolve it, before being asked. This is the single biggest separator at Amazon. |
| 50:00–60:00 | **Show one extension** | "Here is how a new vehicle type slots in — one enum value and one strategy, no existing class changes." The highest-scoring thirty seconds of the round. |

## REQUIREMENT → PATTERN

| You hear | Reach for | Where it shows up |
|---|---|---|
| "support multiple algorithms for X, swappable" | **Strategy** | Parking pricing, elevator scheduling, ride matching, payment methods, notification channel |
| "create objects without naming the concrete class" | **Factory / Abstract Factory** | Vehicle types, chess pieces, notification senders, document parsers |
| "notify N things when this changes" | **Observer** | Bidding, order status, stock ticker, elevator display panels |
| "behaves differently depending on its mode" | **State — NOT a switch over an enum** | Vending machine, ATM, elevator, order lifecycle, chess game phase |
| "undo / redo / a queue of operations" | **Command** | Chess moves, text editor, job scheduler, remote control |
| "add behaviour without a subclass explosion" | **Decorator** | Pizza toppings, coffee add-ons, middleware, discount stacking |
| "lots of optional constructor parameters" | **Builder** | Complex config, pizza order, HTTP request objects |
| "exactly one of these, globally" | **Singleton — and say when it is a mistake** | Config, connection pool, id generator. Usually dependency injection is better and more testable. |
| "two users grab the same resource" | **Optimistic vs pessimistic locking — say WHICH and WHY** | Booking a seat, claiming a parking spot, decrementing inventory |
| "make it extensible" | **Depend on an interface, not a concrete class** | Every LLD round, always |
| "the object is expensive to create" | **Object pool / Flyweight** | Connections, threads, game sprites, chess piece images |
| "one simple interface over several subsystems" | **Facade** | A service layer over repositories, an order facade over payment plus inventory plus shipping |
| "walk a structure without knowing its concrete types" | **Visitor** | Tax calculation over item types, AST evaluation |
| "a chain of handlers, first one that can, handles it" | **Chain of Responsibility** | ATM note dispensing, approval workflows, middleware, logging levels |
| "wrap an incompatible interface" | **Adapter** | Third-party payment gateway, legacy service |

## SOLID AS REFACTORS

### S · Single responsibility

A class that both computes a total AND writes it to the database.

```java
// VIOLATION
class Order {
    BigDecimal total() { ... }
    void saveToDb(Connection c) { ... }   // second reason to change
    String toJson() { ... }               // third
}

// FIX - one reason to change each
class Order            { BigDecimal total() { ... } }
class OrderRepository  { void save(Order o) { ... } }
class OrderSerializer  { String toJson(Order o) { ... } }
```

### O · Open/closed

A switch you must edit every time a new type appears.

```java
// VIOLATION - every new vehicle edits this method
BigDecimal fee(Vehicle v, Duration d) {
    switch (v.type()) {
        case CAR:  return d.toHours() * 20;
        case BIKE: return d.toHours() * 10;
    }
}

// FIX - open for extension, closed for modification
interface PricingStrategy { BigDecimal fee(Duration d); }
class CarPricing  implements PricingStrategy { ... }
class BikePricing implements PricingStrategy { ... }
// new vehicle type = one new class, zero edits
```

### L · Liskov substitution

A subclass that throws on a method it inherited.

```java
// VIOLATION
class Bird { void fly() { ... } }
class Penguin extends Bird {
    void fly() { throw new UnsupportedOperationException(); }  // breaks callers
}

// FIX - model the capability, not the taxonomy
interface Bird {}
interface Flying { void fly(); }
class Sparrow implements Bird, Flying { ... }
class Penguin implements Bird { ... }
```

### I · Interface segregation

A fat interface forcing empty implementations.

```java
// VIOLATION
interface Worker { void work(); void eat(); }
class Robot implements Worker {
    public void work() { ... }
    public void eat()  { }        // meaningless, forced to exist
}

// FIX
interface Workable { void work(); }
interface Feedable { void eat(); }
class Robot implements Workable { ... }
```

### D · Dependency inversion

new ConcreteThing() buried inside business logic.

```java
// VIOLATION - untestable, cannot swap
class OrderService {
    private final MySqlOrderRepo repo = new MySqlOrderRepo();
}

// FIX - depend on the abstraction, inject the concrete
class OrderService {
    private final OrderRepository repo;
    OrderService(OrderRepository repo) { this.repo = repo; }
}
```

## CONCURRENCY IN LLD

The single biggest separator at Amazon. Raise the race before they ask.

| The race | How you close it |
|---|---|
| **Two users claim the same seat / spot / last item** | An atomic conditional transition, not read-then-write. In memory: AtomicReference.compareAndSet or a synchronized block on the specific resource. In a database: UPDATE ... WHERE status = AVAILABLE, and check rows-affected. Whoever gets zero rows loses cleanly. |
| **A hold expires while the user is paying** | Reservation with a TTL, plus a decision you must state: refuse the payment, or extend the hold once. Silently taking payment for released stock is the failure everyone ships. |
| **Two threads read a balance, both compute, both write** | Lost update. Fix with an atomic operation (balance.addAndGet), a version field with retry, or a lock scoped to the account. |
| **Locking the whole system to make one thing safe** | A single global lock is correct and useless. Lock per resource - per spot, per seat, per account - so unrelated operations do not serialise. Interviewers probe this the moment you write synchronized on a method. |
| **Two locks taken in opposite order** | Deadlock. Impose a global ordering (always lock the lower id first), or use tryLock with a timeout and retry. |
| **A collection mutated while another thread iterates it** | ConcurrentModificationException. Use ConcurrentHashMap, CopyOnWriteArrayList for read-heavy, or copy before iterating. |
| **Optimistic vs pessimistic — how to choose out loud** | Low contention and cheap retry: optimistic (version check, retry). High contention on a specific named unit like seat 14A: pessimistic (lock the row). Say the contention assumption you are making — that is the scored part. |

## CLASS DESIGN CHECKLIST

| Check | Why |
|---|---|
| **Nouns to classes, verbs to methods** | Extract them from the requirements out loud so the interviewer sees the derivation. |
| **Enums for every closed set** | VehicleType, SpotSize, OrderStatus, Direction. Never magic strings. |
| **Cardinality on every relationship** | A Lot has 1..* Floors; a Floor has 1..* Spots; a Spot has 0..1 Ticket. Draw it. |
| **An interface on every axis of change** | Pricing, allocation, scheduling, notification. One interface per axis, not fifteen. |
| **Immutable value objects** | Money, TimeSlot, Coordinates. Records are ideal. Prevents a whole class of bugs. |
| **A single entry-point facade** | ParkingLotService, BookingService. The interviewer should see one obvious place to start reading. |
| **No database, no framework** | In-memory collections unless asked. Say "in-memory for now, the repository interface is the seam." |
| **Say what you are NOT building** | Auth, persistence, UI. Naming the exclusions shows judgement rather than omission. |

## MACHINE-CODING RULES

1. Ship a working skeleton in the first 20 minutes, then enrich. Never design for 60 and code for 30.
2. In-memory only unless asked. No database, no framework, no build tooling.
3. Write main() with a demo run early - it proves it works and prevents you being unfinished.
4. Two or three tests beat ten. Add them as you go, not at the end.
5. One interface per axis of change. Do not create fifteen.
6. Say your assumptions out loud and write them as comments.
7. When you run out of time, say what you would do next and why. A stated plan scores; silence does not.

---

## BLOCK B · TIER 1–2 — Amazon · Adobe · Microsoft · JPM

### Parking Lot  *(OOD, 45 min)*

**Who asks it.** Amazon · Microsoft · Adobe · JPM. The most-asked LLD problem there is.

**Asked as:**

- Design a parking lot.
- Design a multi-floor parking system with different vehicle sizes and pricing.
- How do you allocate the nearest available spot?
- Two cars arrive at the same instant and one spot is left. What happens?

**Clarify before you draw anything:**

- How many floors, and are spot sizes fixed per floor?
- Vehicle types — bike, car, truck? Can a car take a truck spot?
- Pricing: flat hourly, or per vehicle type, or slab-based?
- Do we need entry and exit gates as first-class objects, or just park/unpark?
- Payment: cash, card, both? Is payment in scope at all?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **ParkingLot** | class | The facade. Holds floors, exposes park() and unpark(). |
| **ParkingFloor** | class | Holds spots, knows its own availability counts per size. |
| **ParkingSpot** | class | id, size, occupied flag, current vehicle. The unit of contention. |
| **Vehicle** | abstract class | licensePlate, VehicleType. Car / Bike / Truck extend it. |
| **VehicleType** | enum | BIKE, CAR, TRUCK — with the spot sizes each may occupy. |
| **SpotSize** | enum | SMALL, MEDIUM, LARGE. |
| **Ticket** | class | id, spot, vehicle, entryTime, exitTime. Immutable except exit. |
| **PricingStrategy** | interface | fee(Ticket) — the first axis of change. |
| **SpotAllocationStrategy** | interface | findSpot(VehicleType) — nearest, first-free, per-floor. |
| **PaymentProcessor** | interface | Optional. Say if you are excluding it. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | PricingStrategy and SpotAllocationStrategy — the two things that always change. |
| **Factory** | VehicleFactory creating Car/Bike/Truck from a type, so callers never name concretes. |
| **Singleton** | ParkingLot itself, arguably. Say out loud that injection is usually better and more testable. |
| **Observer** | Optional: display boards subscribing to availability changes. |

**The extension axis that wins the round**

```java
public interface PricingStrategy {
    BigDecimal fee(Ticket ticket);
}

public class HourlyPricing implements PricingStrategy {
    private final Map<VehicleType, BigDecimal> ratePerHour;
    public BigDecimal fee(Ticket t) {
        long hours = Math.max(1, Duration.between(t.entry(), t.exit()).toHours());
        return ratePerHour.get(t.vehicle().type()).multiply(BigDecimal.valueOf(hours));
    }
}

// weekend pricing, EV discount, first-hour-free: a new class, zero edits
```

> When they say "now add weekend pricing", you add one class. If pricing were a switch inside ParkingLot, you would be editing the core class - which is the Open/Closed violation they are testing for.

**Allocation without a race**

```java
public class ParkingLot {
    private final SpotAllocationStrategy allocator;

    public Optional<Ticket> park(Vehicle v) {
        for (ParkingSpot spot : allocator.candidates(v.type())) {
            if (spot.tryOccupy(v)) {                 // atomic - see below
                return Optional.of(new Ticket(spot, v, Instant.now()));
            }
        }
        return Optional.empty();                     // lot full
    }
}

public class ParkingSpot {
    private final AtomicReference<Vehicle> occupant = new AtomicReference<>();

    public boolean tryOccupy(Vehicle v) {
        return occupant.compareAndSet(null, v);      // exactly one winner
    }
    public void release() { occupant.set(null); }
}
```

> Note there is NO global lock. Contention is per spot, so two cars heading for different spots never block each other. compareAndSet means the loser simply tries the next candidate instead of failing the request.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two cars, one remaining spot | compareAndSet on the spot. One wins; the loser continues the loop to the next candidate, and only reports "full" after exhausting all of them. |
| synchronized on park() — why it is wrong | It is correct and it serialises the entire lot. A thousand-spot lot would process one car at a time. Lock the spot, not the lot. |
| Availability counters drifting | If you cache a per-floor free count, it must be updated atomically with occupation, or use an AtomicInteger and accept that reads are a hint, not a guarantee. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Now add electric vehicles with charging spots" | A new SpotSize or a Boolean capability on the spot, a new VehicleType, and an allocation strategy that prefers charging spots for EVs. No existing class changes. |
| "Now support monthly pass holders" | A new PricingStrategy returning zero, plus a reserved-spot allocation strategy. Say this out loud — it demonstrates the design holds. |
| "Now make it multi-lot across a city" | ParkingLot becomes one node; add a LotDirectory keyed by location. The spot-level locking still holds because contention is local. |
| "Show me the display board at the entrance" | Observer: the board subscribes to spot occupation events. Do not have the board poll. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why an interface for pricing rather than a method? | Because pricing is the requirement most likely to change, and it changes for reasons unrelated to parking. Separating it means a pricing change never risks the allocation code. |
| How do you find the NEAREST spot? | That is the allocation strategy. Keep a per-floor sorted structure or a priority queue keyed by distance from the entrance. Swapping to "first free" is then a one-line change. |
| What if the ticket is lost? | A business rule, not a design problem — flat penalty fee, look up by licence plate. Say that you would confirm the rule rather than invent it. |
| Where would this break at scale? | The in-memory spot map. In a real system the spot state lives in a database and tryOccupy becomes UPDATE ... WHERE occupied = false, checking rows-affected. The design shape is identical; only the atomic primitive changes. |
| Would you use a Singleton for ParkingLot? | I would inject it instead. Singleton makes testing painful and hides the dependency. If they push, implement it — but state the trade-off. |

**What sinks candidates here:**

- A switch over vehicle type inside the pricing method. This is the exact Open/Closed violation being tested.
- synchronized on the whole park() method.
- Forgetting the "lot is full" path entirely.
- Modelling Ticket as mutable everywhere, so the entry time can be changed after the fact.
- Spending 30 minutes on class diagrams and never writing an allocation method.

---

### Elevator System  *(OOD, 50 min)*

**Who asks it.** Amazon · Microsoft · Adobe. The scheduling discussion is the whole round.

**Asked as:**

- Design an elevator system.
- Design elevators for a 50-floor building with 4 cars.
- Someone presses 5 while the lift is going up from 2 to 8. What happens?
- How would you change the scheduling algorithm without touching the elevator class?

**Clarify before you draw anything:**

- How many elevators and how many floors?
- Are there external (floor) and internal (car) buttons? They behave differently.
- Any special modes — express, service, fire?
- Optimising for average wait time, or for throughput?
- Do we simulate time, or is this event-driven?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **ElevatorSystem** | class | The facade. Receives requests, delegates to the dispatcher. |
| **Elevator (Car)** | class | id, currentFloor, Direction, State, the set of target floors. |
| **Direction** | enum | UP, DOWN, IDLE. |
| **ElevatorState** | interface | Moving / Stopped / DoorsOpen / Maintenance — the State pattern. |
| **Request** | class | sourceFloor, destinationFloor, direction, timestamp. |
| **ExternalRequest / InternalRequest** | class | Hall call versus car call. Different routing rules. |
| **SchedulingStrategy** | interface | chooseElevator(Request, List<Elevator>) — the axis of change. |
| **Door** | class | Optional but shows care: open, close, obstruction. |
| **DisplayPanel** | class | Observer on elevator state. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | SchedulingStrategy — FCFS, nearest-car, SCAN/LOOK. The interviewer will ask you to swap it. |
| **State** | Elevator behaviour differs by state. Moving ignores door-open; DoorsOpen ignores movement. A switch over an enum is the wrong answer here. |
| **Observer** | Display panels and floor indicators subscribe to elevator movement. |
| **Command** | Optional: requests as command objects, queued and cancellable. |

**State, not a switch over an enum**

```java
public interface ElevatorState {
    void openDoors(Elevator e);
    void move(Elevator e);
    default String name() { return getClass().getSimpleName(); }
}

public class MovingState implements ElevatorState {
    public void openDoors(Elevator e) {
        throw new IllegalStateException("cannot open doors while moving");
    }
    public void move(Elevator e) { e.stepTowardsNextTarget(); }
}

public class DoorsOpenState implements ElevatorState {
    public void openDoors(Elevator e) { /* already open, no-op */ }
    public void move(Elevator e) { e.setState(new MovingState()); e.stepTowardsNextTarget(); }
}
```

> Illegal transitions become impossible by construction rather than by an if-check someone forgets. When they ask "what if the doors are told to open mid-travel", the answer is already in the type system.

**The SCAN scheduler — keep going, serve on the way**

```java
public class LookScheduling implements SchedulingStrategy {

    public Elevator choose(Request r, List<Elevator> cars) {
        return cars.stream()
            .filter(e -> e.canServe(r))          // moving toward r, or idle
            .min(Comparator.comparingInt(e -> Math.abs(e.currentFloor() - r.source())))
            .orElse(leastBusy(cars));
    }
}

// inside Elevator
public boolean canServe(Request r) {
    if (direction == IDLE) return true;
    if (direction == UP)   return r.source() >= currentFloor && r.direction() == UP;
    return r.source() <= currentFloor && r.direction() == DOWN;
}
```

> canServe is where the "press 5 while going 2 to 8" question is answered: the request is on the path and in the same direction, so it is absorbed into the current sweep rather than queued for later.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two floors call simultaneously | The dispatcher is the single point of assignment. Make choose-and-assign atomic (synchronized on the dispatcher, or a single-threaded request queue) so one elevator is not double-assigned. |
| Request arrives while the elevator is mid-move | Target floors live in a thread-safe sorted set. Adding a floor already on the path is idempotent. |
| The event loop | A common clean answer: one thread per elevator consuming from a BlockingQueue of commands. Say it — it removes most locking questions at a stroke. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Now optimise for average wait instead of throughput" | A different SchedulingStrategy. The Elevator and Request classes do not change. That is the payoff of putting scheduling behind an interface. |
| "Add an express elevator serving only floors above 30" | A capability on the elevator plus a filter in canServe. No change to the dispatcher. |
| "Fire mode: all cars to the ground floor and stop" | A new state, plus a system-level mode that overrides the scheduler. Show it as a state transition, not a boolean flag. |
| "How would you test this?" | Simulate time with an injected clock and step the system tick by tick. Saying that you would inject the clock is a strong signal. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why State rather than an if/switch on a status field? | Because the number of illegal transitions grows quadratically with states, and each one becomes a forgotten if. With State the compiler and the object structure carry the rules. |
| Press 5 while going from 2 to 8 — walk me through it. | 5 is above the current floor and the direction matches, so canServe is true. Insert 5 into the sorted target set; the sweep stops there naturally on the way to 8. |
| What if someone presses down on floor 5 while the car is going up? | It is not absorbed into this sweep. It stays in the pending pool and is served on the downward pass, or assigned to another car. Say why: absorbing it would make an upward passenger travel down. |
| How do you avoid starvation on a busy building? | Age the requests — after a threshold, promote a waiting request so a sweep must serve it. Mention it unprompted; it shows you thought past the happy path. |
| Four elevators, one request. How do you pick? | That is the strategy. Nearest suitable car by default; the real answer names the objective — minimising wait versus minimising total travel — and says they give different algorithms. |

**What sinks candidates here:**

- A switch over an ElevatorStatus enum instead of the State pattern.
- Hard-coding the scheduling algorithm inside Elevator.
- Not distinguishing external (hall) from internal (car) requests.
- No answer for direction-mismatched requests.
- Ignoring starvation entirely.

---

### Vending Machine  *(OOD, 40 min)*

**Who asks it.** Amazon · Adobe · Microsoft. The canonical State-pattern question.

**Asked as:**

- Design a vending machine.
- Design a vending machine that handles coins, refunds and out-of-stock.
- The user presses the button before inserting money. What happens?
- How do you dispense the right change?

**Clarify before you draw anything:**

- Cash only, or card as well?
- Do we need to return change, and with which denominations?
- What happens on a mid-transaction cancel?
- Can the machine be restocked while a transaction is in flight?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **VendingMachine** | class | Context object. Holds current state, inventory, and inserted amount. |
| **VendingState** | interface | idle / hasMoney / dispensing / outOfService. The State pattern. |
| **Inventory** | class | Map<Slot, ItemStack>. Knows counts, not prices. |
| **Item** | class | code, name, price. |
| **Slot** | class | A physical position holding one item type. |
| **Coin / Note** | enum | Denominations, with values. Enums make change-making trivial. |
| **CashRegister** | class | Tracks denominations available for change. |
| **ChangeStrategy** | interface | makeChange(amount) — greedy or exact-DP. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **State** | THE point of this problem. IdleState, HasMoneyState, DispensingState, OutOfServiceState. |
| **Strategy** | ChangeStrategy — greedy by default, exact-change DP if they push. |
| **Singleton** | The machine itself, arguably. |
| **Command** | Optional: each user action as a command, giving you a transaction log for free. |

**State handles what is legal, not the machine**

```java
public interface VendingState {
    void insertCoin(VendingMachine m, Coin c);
    void selectItem(VendingMachine m, String code);
    void dispense(VendingMachine m);
    void cancel(VendingMachine m);
}

public class IdleState implements VendingState {
    public void insertCoin(VendingMachine m, Coin c) {
        m.addToBalance(c.value());
        m.setState(new HasMoneyState());
    }
    public void selectItem(VendingMachine m, String code) {
        throw new IllegalStateException("insert money first");   // the classic question
    }
    public void dispense(VendingMachine m) { throw new IllegalStateException("nothing selected"); }
    public void cancel(VendingMachine m)   { /* nothing to refund */ }
}
```

> "The user presses the button before inserting money" is answered by the state, not by a guard clause scattered through the machine. Every state implements all four actions, so no transition is accidentally unhandled.

**Change-making, and being honest about greedy**

```java
public class GreedyChange implements ChangeStrategy {
    public Optional<List<Coin>> make(int amount, Map<Coin,Integer> available) {
        List<Coin> out = new ArrayList<>();
        for (Coin c : Coin.descending()) {
            while (amount >= c.value() && available.get(c) > 0) {
                out.add(c); amount -= c.value();
                available.merge(c, -1, Integer::sum);
            }
        }
        return amount == 0 ? Optional.of(out) : Optional.empty();  // cannot make change
    }
}
```

> Greedy is correct for canonical currency systems and WRONG in general - with coins {1, 3, 4} making 6 greedily gives 4+1+1 instead of 3+3. Saying that unprompted, and noting the DP alternative, is a genuine differentiator on this question.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two users on one machine | Physically impossible, so say so — but if they push, the machine is a single-threaded state machine and actions are serialised through one queue. |
| Restocking during a transaction | Inventory updates must be atomic against the dispense check. A synchronized inventory or a ConcurrentHashMap with atomic decrement. |
| Dispense succeeds, change fails | Decide the policy: refuse the sale up front if change cannot be made. Checking change availability BEFORE dispensing is the correct order and interviewers look for it. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add card payment" | A PaymentMethod interface with Cash and Card implementations. The states stay the same; only how balance is credited changes. |
| "Machine runs out of change" | A pre-check before accepting a selection, plus an exact-change-only mode as a state or a flag on the machine. |
| "Add a maintenance mode" | A new state. It rejects every user action and allows restocking. That is the whole change. |
| "Log every transaction" | Observer on state transitions, or Command objects appended to a log. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why State and not a switch on an enum? | Because each state must answer all four actions, so a new state forces you to decide every case. A switch lets you silently forget one, and that is exactly how the "press before paying" bug ships. |
| Is greedy change always correct? | No. It is correct for canonical denominations like INR or USD, and wrong for arbitrary sets. With {1,3,4} making 6, greedy gives three coins where two suffice. The general solution is coin-change DP. |
| User cancels after inserting money. | The cancel action on HasMoneyState refunds the balance and returns to Idle. Every state defines cancel, which is why nothing is missed. |
| Item is out of stock but money is in. | Reject the selection, keep the balance, stay in HasMoneyState so the user can choose something else or cancel. |
| How would you unit test this? | Drive the state machine directly: assert that selectItem on IdleState throws, that insertCoin moves to HasMoneyState. State objects are trivially testable in isolation, which is another argument for the pattern. |

**What sinks candidates here:**

- A giant switch statement over a status enum. This problem exists to test the State pattern.
- Dispensing before verifying change can be made.
- Claiming greedy change is universally correct.
- No cancel or refund path.
- Prices stored on the slot AND the item, so they can disagree.

---

### Movie Booking (BookMyShow)  *(OOD + concurrency, 50 min)*

**Who asks it.** AMAZON favourite · Adobe · Expedia (rooms) · Flipkart. Chosen specifically because of the race condition.

**Asked as:**

- Design BookMyShow / Ticketmaster.
- Design seat booking for a cinema.
- Two users click the same seat at the same instant. Walk me through it.
- The user holds seats and then abandons the payment. What happens?

**Clarify before you draw anything:**

- Can a user hold seats before paying, and for how long?
- Is overbooking ever acceptable? (for cinemas, no)
- Multiple screens per cinema, multiple shows per screen — how far do we model?
- Seat categories and dynamic pricing in scope?
- What happens if payment fails after the hold?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **City / Cinema / Screen** | class | The location hierarchy. Cinema has 1..* Screens. |
| **Movie** | class | id, title, duration, language. |
| **Show** | class | movie, screen, startTime. THE unit that owns seat availability. |
| **Seat** | class | row, number, SeatCategory. Physical, belongs to a Screen. |
| **ShowSeat** | class | seat + show + SeatStatus. The unit of contention — NOT Seat itself. |
| **SeatStatus** | enum | AVAILABLE, HELD, BOOKED. |
| **SeatHold** | class | showSeats, userId, expiresAt. The TTL lives here. |
| **Booking** | class | id, user, showSeats, amount, BookingStatus. |
| **BookingService** | class | The facade: hold, confirm, release. |
| **PricingStrategy** | interface | Category-based, time-based, demand-based. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | PricingStrategy — weekday vs weekend, premium seats, dynamic pricing. |
| **State** | Booking lifecycle: CREATED, HELD, PAID, CONFIRMED, CANCELLED, EXPIRED. |
| **Observer** | Notify the user on confirmation; notify the screen display on availability change. |
| **Factory** | Optional, for creating ShowSeats when a Show is scheduled. |

**ShowSeat is the unit of contention — this is the key modelling insight**

```java
// WRONG: Seat holds the status. Seat 14A is shared across every show,
// so booking it for the 6pm show would mark it taken for the 9pm show too.

// RIGHT: status belongs to (seat, show)
public class ShowSeat {
    private final Seat seat;
    private final Show show;
    private final AtomicReference<SeatStatus> status =
            new AtomicReference<>(SeatStatus.AVAILABLE);
    private volatile String heldBy;
    private volatile Instant holdExpiry;

    public boolean tryHold(String userId, Duration ttl) {
        if (status.compareAndSet(SeatStatus.AVAILABLE, SeatStatus.HELD)) {
            heldBy = userId;
            holdExpiry = Instant.now().plus(ttl);
            return true;
        }
        return releaseIfExpiredThenRetry(userId, ttl);   // lazy expiry, see below
    }
}
```

> Putting status on Seat instead of ShowSeat is the single most common modelling error on this question, and it is invisible until the interviewer asks about a second show.

**All-or-nothing hold across several seats**

```java
public Optional<SeatHold> hold(List<ShowSeat> requested, String userId) {
    List<ShowSeat> acquired = new ArrayList<>();
    // deterministic order prevents deadlock between two overlapping requests
    requested.sort(Comparator.comparing(ShowSeat::id));

    for (ShowSeat s : requested) {
        if (s.tryHold(userId, HOLD_TTL)) {
            acquired.add(s);
        } else {
            acquired.forEach(ShowSeat::release);   // roll back partial holds
            return Optional.empty();
        }
    }
    return Optional.of(new SeatHold(acquired, userId, Instant.now().plus(HOLD_TTL)));
}
```

> Two things interviewers look for: the rollback of partial holds (otherwise you strand seats nobody can book), and the deterministic sort (otherwise two users each holding one of the other pair deadlock).

**Expiry: lazy plus sweeper, not sweeper alone**

```java
// lazy - checked on every access, so an expired hold never blocks a sale
private boolean releaseIfExpiredThenRetry(String userId, Duration ttl) {
    if (status.get() == SeatStatus.HELD && Instant.now().isAfter(holdExpiry)) {
        if (status.compareAndSet(SeatStatus.HELD, SeatStatus.AVAILABLE)) {
            return tryHold(userId, ttl);
        }
    }
    return false;
}

// sweeper - so seats free up for BROWSING users too
@Scheduled(fixedDelay = 30_000)
public void sweepExpiredHolds() { ... }
```

> A sweeper alone leaves a window where an expired hold still blocks a sale. Lazy alone means the seat looks taken to anyone browsing. You need both, and saying so is the mature answer.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two users click seat 14A simultaneously | compareAndSet from AVAILABLE to HELD. Exactly one wins; the other gets a clean "seat no longer available". Never read-then-write. |
| Partial hold on a multi-seat request | Roll back everything acquired so far. Otherwise seats sit HELD with no owner until the TTL expires. |
| Two users request overlapping seat sets in opposite order | Deadlock risk. Sort by seat id before acquiring so every request takes locks in the same order. |
| Hold expires mid-payment | State the policy. Either fail the payment with a clear message, or extend the hold once when payment begins. Silently charging for a released seat is the failure that ships. |
| At database scale | The same shape: UPDATE show_seat SET status = HELD WHERE id = ? AND status = AVAILABLE, then check rows-affected. Or SELECT ... FOR UPDATE if you need to hold several rows. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Now add dynamic pricing based on demand" | A new PricingStrategy reading the current occupancy ratio. Booking and seat classes untouched. |
| "Support seat maps with couple seats and wheelchair spaces" | SeatCategory plus a capability flag; the allocation and validation rules read the flag. |
| "Handle a whole show being cancelled" | A state transition on Show that cascades to bookings, plus refund events. Show it as a state machine, not a boolean. |
| "Ten thousand users hitting one popular show" | That single Show becomes the hot object. Shard holds by seat id, or admit users through a queue. Say that the design is unchanged; only the contention management moves. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why ShowSeat rather than putting status on Seat? | Because a seat exists in the cinema, but availability exists per show. Status on Seat would make booking 14A at 6pm also book it at 9pm. |
| Optimistic or pessimistic here? | For a specific named seat under high contention, pessimistic — a compare-and-set or a row lock on that seat. Optimistic retry thrashes when everyone wants the same seat. |
| What if the payment gateway times out and you do not know the outcome? | Do not release the hold. Mark the booking PENDING, reconcile against the gateway, and make the confirm operation idempotent so a retry does not double-book. |
| How do you stop one user holding every seat? | A per-user hold limit and a rate limit. A design question worth raising unprompted — it shows product thinking. |
| Where does this design break first? | The in-memory ShowSeat map. Move it to a database with a conditional update; the concurrency argument transfers unchanged. |

**What sinks candidates here:**

- Status on Seat instead of ShowSeat.
- Read-then-write on availability — the exact race being tested.
- No rollback of partial holds.
- No answer for payment failing after the hold.
- A global lock on the show, which serialises every booking in the cinema.

---

### Splitwise  *(OOD + algorithm, 45 min)*

**Who asks it.** Amazon · Uber · Flipkart. The settlement algorithm is the hybrid element.

**Asked as:**

- Design Splitwise.
- Design an expense sharing app with equal, exact and percentage splits.
- How do you minimise the number of transactions to settle a group?
- Show me the balance sheet for a user.

**Clarify before you draw anything:**

- Split types — equal, exact amounts, percentages, shares?
- Do we settle within groups only, or globally across all friends?
- Multi-currency?
- Do we need simplified debts (A owes C directly instead of A→B→C)?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **User** | class | id, name, email. |
| **Group** | class | name, members. Optional but usually asked for. |
| **Expense** | class | paidBy, amount, description, SplitStrategy, participants. |
| **Split** | abstract class | user + amount owed. EqualSplit / ExactSplit / PercentSplit. |
| **SplitStrategy** | interface | validate() and computeSplits(amount, participants). |
| **BalanceSheet** | class | Map<userA, Map<userB, amount>> — who owes whom. |
| **ExpenseService** | class | The facade: addExpense, settleUp, showBalances. |
| **SettlementStrategy** | interface | Minimise transactions, or simple pairwise netting. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | SplitStrategy for the split types; SettlementStrategy for simplification. |
| **Factory** | SplitFactory creating the right Split from a type. |
| **Observer** | Notify members when an expense is added or settled. |
| **Command** | Optional: expenses as commands, giving undo for free. |

**Split types behind one interface, with validation**

```java
public interface SplitStrategy {
    List<Split> split(BigDecimal total, List<User> participants, List<BigDecimal> args);
}

public class PercentSplit implements SplitStrategy {
    public List<Split> split(BigDecimal total, List<User> users, List<BigDecimal> pcts) {
        BigDecimal sum = pcts.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.compareTo(new BigDecimal("100")) != 0)
            throw new IllegalArgumentException("percentages must total 100");
        // ... and the rounding problem below
    }
}
```

> Validation belongs in the strategy, because each split type has a different invariant: exact must sum to the total, percent must sum to 100, equal has none.

**The rounding trap nobody mentions**

```java
// 100.00 split equally three ways = 33.333...
// naive rounding gives 33.33 x 3 = 99.99. One cent has vanished.

public List<Split> splitEqually(BigDecimal total, List<User> users) {
    int n = users.size();
    BigDecimal each = total.divide(BigDecimal.valueOf(n), 2, RoundingMode.DOWN);
    BigDecimal remainder = total.subtract(each.multiply(BigDecimal.valueOf(n)));

    List<Split> out = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        BigDecimal amt = each;
        if (remainder.compareTo(BigDecimal.ZERO) > 0) {   // give the odd cents away
            amt = amt.add(new BigDecimal("0.01"));
            remainder = remainder.subtract(new BigDecimal("0.01"));
        }
        out.add(new Split(users.get(i), amt));
    }
    return out;
}
```

> Raising this unprompted is a strong signal. It also settles the "why BigDecimal and never double" question before it is asked - floating point cannot represent 0.1 and money must balance exactly.

**Debt simplification — the algorithmic core**

```java
// net every user to a single figure, then greedily match
public List<Transaction> simplify(Map<User, BigDecimal> net) {
    PriorityQueue<Entry> creditors = new PriorityQueue<>(byAmountDesc);
    PriorityQueue<Entry> debtors   = new PriorityQueue<>(byAmountDesc);
    net.forEach((u, amt) -> {
        if (amt.signum() > 0) creditors.add(new Entry(u, amt));
        else if (amt.signum() < 0) debtors.add(new Entry(u, amt.negate()));
    });

    List<Transaction> out = new ArrayList<>();
    while (!creditors.isEmpty() && !debtors.isEmpty()) {
        Entry c = creditors.poll(), d = debtors.poll();
        BigDecimal settled = c.amount.min(d.amount);
        out.add(new Transaction(d.user, c.user, settled));
        if (c.amount.compareTo(settled) > 0) creditors.add(c.minus(settled));
        if (d.amount.compareTo(settled) > 0) debtors.add(d.minus(settled));
    }
    return out;
}
```

> This greedy heap approach gives at most n-1 transactions and is what you should write. Be honest that MINIMUM transactions is NP-hard (it is LC 465, solved with bitmask DP for small n) - knowing the distinction is the differentiator.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two expenses added to the same group simultaneously | Balance updates must be atomic. Lock per group, or make the balance sheet an append-only ledger of expenses with balances derived on read. |
| Derived versus stored balances | Storing a running balance is fast and can drift. Deriving from the expense list is always correct and slower. The mature answer: store expenses as the source of truth, cache the balance, and rebuild on demand. |
| Settle-up racing an expense | Settlement should record the balance it settled against, so a concurrent expense does not silently vanish. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Now support multi-currency" | Money becomes a value object of amount plus currency; expenses store the FX rate used AT THE TIME. Never recompute historic amounts at today rate. |
| "Add group-level simplification" | SettlementStrategy already isolates this. Swap greedy netting for a per-group variant. |
| "Show a per-user activity feed" | Observer on expense events, or derive it from the append-only expense log. |
| "Support recurring expenses" | A scheduled job creating expenses from a template. Say it does not change the core model. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why BigDecimal and not double? | Floating point cannot represent 0.1 exactly, so sums drift. Money must balance to the cent, and BigDecimal with an explicit RoundingMode makes rounding a decision rather than an accident. |
| 100 split three ways — where does the extra cent go? | Somebody gets 33.34. Choose a deterministic rule — the payer, or the first participant — and apply it consistently so the total always reconciles. |
| Is your simplification optimal? | No. Greedy netting gives at most n-1 transactions, which is good and fast. The true minimum is NP-hard; for small groups you could use bitmask DP, which is LC 465. |
| A owes B, B owes C, C owes A, all £10. What happens? | It nets to zero. Simplification removes the cycle entirely and produces no transactions, which is the whole value of the feature. |
| Where does the balance sheet live? | I would treat expenses as the source of truth and the balance as a derived, cached view — so a bug in balance maintenance is recoverable by recomputation. |

**What sinks candidates here:**

- Using double for money.
- Ignoring the rounding remainder so totals do not reconcile.
- Claiming greedy settlement is optimal.
- A single balance field per user instead of pairwise balances, losing who owes whom.
- Validation logic duplicated across split types instead of living in each strategy.

---

### Tic-Tac-Toe & Chess  *(OOD + algorithm, 45 min)*

**Who asks it.** Microsoft · Amazon (hybrid) · Adobe. Tic-tac-toe is the warm-up; chess is the extensibility test.

**Asked as:**

- Design tic-tac-toe. Now make the win-check O(1).
- Design a chess game.
- Add undo and redo.
- How do you make it n-by-n, or support four players?

**Clarify before you draw anything:**

- Board size — fixed 3x3, or n-by-n with k-in-a-row?
- Two players only, or more?
- Do we need undo/redo, move history, replay?
- Is an AI opponent in scope? (usually say no, then offer minimax if pushed)

**Entities**

| Class | Kind | Role |
|---|---|---|
| **Game** | class | The facade. Holds board, players, turn, GameState. |
| **Board** | class | The grid plus win detection. |
| **Cell** | class | position and occupant. For chess, holds a Piece. |
| **Player** | class | id, name, Symbol or Colour. |
| **GameState** | enum / interface | IN_PROGRESS, WIN, DRAW. State pattern if the phases have behaviour. |
| **Move** | class | from, to, player, captured. The Command object. |
| **Piece** | abstract class | (Chess) King, Queen, Rook... each with its own movement rule. |
| **MoveValidator** | interface | (Chess) The axis of change per piece type. |
| **WinStrategy** | interface | Row/column/diagonal for TTT; checkmate detection for chess. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | Movement rules per piece; win-condition per game variant. |
| **Factory** | PieceFactory creating pieces from a type character. |
| **Command** | Move objects with execute and undo. This is how you get undo/redo for free. |
| **State** | Game phase: in-progress, check, checkmate, stalemate. |
| **Observer** | Optional: UI or move log subscribing to board changes. |

**O(1) win check — the point of LC 348**

```java
public class TicTacToe {
    private final int[] rows, cols;
    private int diag, antiDiag;
    private final int n;

    // player 1 adds +1, player 2 adds -1. |count| == n means a win.
    public int move(int r, int c, int player) {
        int delta = (player == 1) ? 1 : -1;
        rows[r] += delta;
        cols[c] += delta;
        if (r == c)         diag     += delta;
        if (r + c == n - 1) antiDiag += delta;

        if (Math.abs(rows[r]) == n || Math.abs(cols[c]) == n
         || Math.abs(diag)    == n || Math.abs(antiDiag) == n) return player;
        return 0;
    }
}
```

> The naive answer scans the board after every move, O(n^2). This is O(1) per move with O(n) space, and it is exactly what the Amazon hybrid round wants: a clean design PLUS the algorithmic insight.

**Command gives you undo and redo**

```java
public interface GameCommand {
    void execute(Board b);
    void undo(Board b);
}

public class MoveCommand implements GameCommand {
    private final Position from, to;
    private Piece captured;              // remembered so undo can restore it

    public void execute(Board b) {
        captured = b.pieceAt(to);
        b.place(to, b.remove(from));
    }
    public void undo(Board b) {
        b.place(from, b.remove(to));
        if (captured != null) b.place(to, captured);
    }
}

// Deque<GameCommand> undoStack, redoStack
```

> Remembering the captured piece inside the command is what makes undo correct. Interviewers ask "now add undo" precisely to see whether your move representation is rich enough - a plain from/to pair is not.

**Piece movement as a strategy, not a switch**

```java
public abstract class Piece {
    protected final Colour colour;
    public abstract boolean canMove(Board b, Position from, Position to);
}

public class Rook extends Piece {
    public boolean canMove(Board b, Position from, Position to) {
        if (from.row() != to.row() && from.col() != to.col()) return false;
        return b.isPathClear(from, to) && !b.hasOwnPiece(to, colour);
    }
}
```

> Adding a new piece is a new class. A switch over a piece-type enum inside Board is the Open/Closed violation this problem is designed to surface.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two players moving at once | Turn-based by definition, so enforce it: reject a move from the player whose turn it is not. That check IS the concurrency control. |
| Online multiplayer | Moves go through a single queue per game, applied in order. The game object is single-threaded; the network layer is not. |
| Shared game state | If several viewers observe, use an immutable board snapshot per move so readers never see a half-applied move. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Make it n-by-n with k-in-a-row" | The counter trick generalises for k == n. For k < n you need a directional scan from the last move — O(k) rather than O(1). Say that honestly; the naive claim that it still works is a trap. |
| "Add undo and redo" | Command objects plus two stacks. If your Move already stores the captured piece, this is nearly free — which is the reason to model it that way from the start. |
| "Add an AI opponent" | Minimax with alpha-beta pruning behind a Player interface, so a human and an AI are interchangeable. |
| "Support four players" | Symbol becomes a player id and the counters become per-player. Say what breaks: the +1/-1 trick only works for two. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| How do you check a win in O(1)? | Maintain per-row, per-column and two diagonal counters, incrementing by +1 or -1 by player. A magnitude equal to n means a win. O(1) per move. |
| Does that generalise to k-in-a-row on an n board? | No. Counters assume a full line. For k < n you scan the four directions outward from the last move, which is O(k) — still far better than rescanning the board. |
| Where does the movement rule for a piece live? | On the piece. A switch inside Board means every new piece edits Board, which is the violation being tested. |
| How would you detect checkmate? | King is in check AND no legal move removes the check. Generate legal moves, apply each to a copy, and test. Say it is expensive and that real engines optimise heavily. |
| What makes this design extensible? | Piece movement, win condition and player type each sit behind their own abstraction, so a variant like Chess960 or four-player changes one place each. |

**What sinks candidates here:**

- Rescanning the whole board after every move, then having no better answer when asked.
- A switch over piece type inside Board.
- A Move that stores only from and to, so undo cannot restore a capture.
- Claiming the O(1) counter trick works for arbitrary k-in-a-row.
- No turn validation.

---

### Notification System  *(OOD, 45 min)*

**Who asks it.** Amazon · Microsoft · Adobe. Bridges directly into the system design track.

**Asked as:**

- Design a notification service supporting email, SMS and push.
- How do you stop a user receiving 200 notifications in a minute?
- One channel provider goes down. What happens to the others?
- How do you add a new channel without touching existing code?

**Clarify before you draw anything:**

- Which channels, and is the set fixed or extensible?
- Do users have per-channel and per-category preferences?
- Priority levels — does an OTP jump the queue ahead of marketing?
- Delivery guarantees: at-least-once, and do we need read receipts?
- Templating and localisation in scope?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **NotificationService** | class | The facade: send(Notification). |
| **Notification** | class | recipient, category, priority, payload, template id. |
| **Channel** | interface | send(Notification) — Email, Sms, Push, InApp. |
| **ChannelFactory** | class | Resolves a channel from a type. |
| **UserPreferences** | class | Per-category, per-channel opt-in plus quiet hours. |
| **RateLimiter** | interface | Per-user, per-category throttling. |
| **TemplateEngine** | interface | Renders payload into channel-specific content. |
| **RetryPolicy** | class | Attempts, backoff, and when to give up. |
| **DeadLetterQueue** | class | Where a permanently failing notification goes. |
| **NotificationStatus** | enum | PENDING, SENT, DELIVERED, FAILED, SUPPRESSED. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | One implementation of Channel per delivery mechanism. |
| **Factory** | ChannelFactory, so callers never name a concrete channel. |
| **Observer** | Subscribers to domain events that trigger notifications. |
| **Decorator** | Stacking cross-cutting behaviour: retry wraps rate-limit wraps the raw channel. |
| **Chain of Responsibility** | The pre-send pipeline: preferences, then quiet hours, then rate limit, then dedup. |
| **Builder** | Notification has many optional fields — a natural Builder. |

**Channel as the extension point**

```java
public interface Channel {
    ChannelType type();
    DeliveryResult send(Notification n);
    boolean supports(Notification n);     // e.g. SMS rejects rich payloads
}

public class EmailChannel implements Channel {
    private final EmailClient client;
    private final TemplateEngine templates;

    public DeliveryResult send(Notification n) {
        String body = templates.render(n.templateId(), n.payload());
        return client.send(n.recipient().email(), n.subject(), body);
    }
}

// adding WhatsApp = one class + one enum value. Nothing else changes.
```

> This is the answer to "add a new channel without touching existing code", and it is why the interviewer asks the question.

**The pre-send pipeline as a chain**

```java
public interface SendFilter {
    // returns empty to continue, or a reason to suppress
    Optional<String> reject(Notification n, UserPreferences prefs);
}

List<SendFilter> pipeline = List.of(
    new OptOutFilter(),        // user turned this category off
    new QuietHoursFilter(),    // 22:00-08:00, unless priority == CRITICAL
    new RateLimitFilter(),     // max N per user per window
    new DedupFilter()          // same content within the aggregation window
);

for (SendFilter f : pipeline) {
    Optional<String> reason = f.reject(n, prefs);
    if (reason.isPresent()) return DeliveryResult.suppressed(reason.get());
}
```

> Each rule is independently testable and reorderable, and a new rule is a new class. Note the CRITICAL override on quiet hours: an OTP must ignore them, and saying so shows product judgement.

**Per-channel isolation so one provider cannot sink the rest**

```java
// separate queue and thread pool per channel
Map<ChannelType, ExecutorService> pools = Map.of(
    EMAIL, boundedPool(8, 500),
    SMS,   boundedPool(4, 200),
    PUSH,  boundedPool(16, 1000)
);

pools.get(n.channel()).submit(() -> {
    try {
        retry.execute(() -> channel.send(n));
    } catch (PermanentFailure e) {
        dlq.publish(n, e);
    }
});
```

> This is the bulkhead pattern applied at the LLD level. One queue for all channels means a slow SMS provider stalls every email too - which is the exact failure the interviewer is probing for.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| One slow provider blocking everything | Separate bounded queue and thread pool per channel. Bulkhead isolation. |
| Duplicate sends on retry | Every notification carries an idempotency key; the channel or the provider dedupes on it. At-least-once delivery makes duplicates inevitable. |
| Rate-limit counters across threads | An atomic counter per user per window, or a token bucket with compare-and-set. Not a plain HashMap increment. |
| Aggregation window | Buffer per user, flush on a timer or on count. Needs a thread-safe buffer and a single flusher to avoid double-sending. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add WhatsApp" | One Channel implementation plus an enum value. Say it out loud — this is the demonstration that the design holds. |
| "Digest 50 likes into one notification" | A DedupFilter plus an aggregation buffer keyed by user and category, flushed on a window. |
| "Guarantee OTPs are never delayed" | Priority queues per channel, and a CRITICAL priority that bypasses quiet hours and rate limits. |
| "Scale to millions per hour" | This is where LLD hands off to system design: the in-process queue becomes Kafka, the pools become consumer groups. The interfaces do not change. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| How do you add a channel without changing existing code? | Implement Channel and register it in the factory. Nothing that already exists is edited — that is Open/Closed in practice. |
| A user gets 200 notifications in a minute. Fix it. | Rate-limit filter per user per category, plus an aggregation window that digests repeats, plus quiet hours. And an unsubscribe path — a notification system without one is a product bug. |
| SMS provider is down. What happens to email? | Nothing, if each channel has its own queue and pool. If they share one, email backs up behind SMS — that is the bulkhead argument. |
| At-least-once means duplicates. How do you handle that? | An idempotency key on each notification, deduplicated at the channel or by the provider. |
| Where does this stop being an LLD problem? | When volume forces a real broker and horizontal workers. The Channel and filter interfaces survive the transition unchanged, which is a good sign about the design. |

**What sinks candidates here:**

- A switch over channel type instead of a Channel interface.
- One shared queue for all channels.
- No user preferences or opt-out.
- No retry, or retry with no cap and no DLQ.
- Quiet hours applied to OTPs.

---

### ATM  *(OOD, 40 min)*

**Who asks it.** JPM · Amex · Amazon. State plus a small algorithm, and money makes the edge cases real.

**Asked as:**

- Design an ATM.
- How do you dispense 3,700 with the notes you have?
- The cash is dispensed but the network drops before the balance updates. What happens?
- Card is inserted but the user walks away. What then?

**Clarify before you draw anything:**

- Which operations — withdraw, deposit, balance, transfer?
- Which note denominations, and must we minimise the note count?
- Is the bank backend in scope, or do we stub it?
- Do we handle card retention after three wrong PINs?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **ATM** | class | Context. Holds state, cash dispenser, card reader. |
| **AtmState** | interface | Idle / CardInserted / Authenticated / Dispensing / OutOfService. |
| **Card** | class | number, expiry. No PIN — that is verified by the bank. |
| **Account** | class | id, balance. Lives behind the BankService, not in the ATM. |
| **Transaction** | abstract class | Withdraw / Deposit / BalanceEnquiry / Transfer. |
| **CashDispenser** | class | Holds note inventory; the Chain of Responsibility root. |
| **NoteDispenser** | abstract class | Handler per denomination, chained largest to smallest. |
| **BankService** | interface | The external boundary. Stub it and say so. |
| **ReceiptPrinter** | class | Optional but shows completeness. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **State** | ATM behaviour by phase. Ejecting a card mid-dispense must be impossible. |
| **Chain of Responsibility** | Note dispensing: the 2000 handler takes what it can, passes the rest down. |
| **Strategy** | Optional: note-selection algorithm, greedy versus exact DP. |
| **Template Method** | Transaction defines the skeleton — validate, execute, record, print. |

**Chain of Responsibility for note dispensing**

```java
public abstract class NoteDispenser {
    private NoteDispenser next;
    private final int denomination;
    private int count;

    public void dispense(int amount, Map<Integer,Integer> out) {
        int give = Math.min(amount / denomination, count);
        if (give > 0) {
            out.put(denomination, give);
            count -= give;
            amount -= give * denomination;
        }
        if (amount > 0) {
            if (next == null) throw new InsufficientNotesException(amount);
            next.dispense(amount, out);
        }
    }
}
// chain: 2000 -> 500 -> 200 -> 100
```

> Adding a 200-rupee note is one new handler inserted into the chain. Note the failure path: if the remainder cannot be made, throw BEFORE anything physically leaves the machine.

**Check first, dispense second — the ordering that matters**

```java
public void withdraw(int amount) {
    // 1. can we physically make this amount?
    Map<Integer,Integer> plan = dispenser.plan(amount);   // throws if not
    // 2. does the account allow it?
    bank.debit(account, amount);                          // throws if insufficient
    // 3. only now move physical cash
    dispenser.commit(plan);
    printer.print(receipt(amount));
}
```

> Getting this order wrong is the classic failure: debiting the account and then discovering you cannot make 3,700 from the notes you hold. Plan, then debit, then dispense.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Cash dispensed, network drops before the debit | This is the real question. Dispense LAST, after the debit succeeds. If the debit succeeds and dispensing then fails physically, you need a reversal — record the transaction as PENDING and reconcile. |
| Two ATMs, one account | The balance check and debit must be atomic at the bank, not the ATM. Say the ATM is not where the invariant lives. |
| Note inventory | Decrement atomically with the dispense commit; a plan that is not committed must not reserve notes indefinitely. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add a 200-rupee note" | One handler in the chain. Nothing else changes. |
| "Minimise the number of notes" | Greedy works for canonical denominations and fails in general. The exact answer is coin-change DP. Same distinction as the vending machine. |
| "Support deposits" | A new Transaction subclass; the template method skeleton already fits. |
| "Card retention after three wrong PINs" | A counter on the session plus a state transition to CardRetained. Show it in the state machine. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Where does the PIN get verified? | At the bank, never on the ATM. The ATM forwards an encrypted PIN block. Saying this shows you understand the trust boundary. |
| Dispense then debit, or debit then dispense? | Debit then dispense. If dispensing fails you can reverse a debit; you cannot un-dispense cash. |
| Why Chain of Responsibility rather than a loop? | A loop works. The chain makes each denomination independently testable and lets you insert or retire a denomination without touching the others. If they push back, concede the loop is fine — the reasoning is what is scored. |
| User walks away mid-session. | A session timeout state transition that ejects the card and returns to Idle. Every state must define it. |
| Is greedy note selection always right? | No — same caveat as change-making. It is correct for real currency systems, wrong for arbitrary denominations. |

**What sinks candidates here:**

- Debiting before checking whether the amount can be physically made.
- Storing the balance on the ATM instead of behind the bank service.
- Verifying the PIN locally.
- A switch over an ATM status enum instead of the State pattern.
- No session timeout.

---

### Order & Inventory (Amazon)  *(OOD + concurrency, 50 min)*

**Who asks it.** AMAZON specifically · Flipkart · Expedia. The oversell race is the point.

**Asked as:**

- Design the order management system for an e-commerce site.
- Two customers buy the last item at the same instant. What happens?
- Design inventory across multiple warehouses.
- Walk me through the order lifecycle and what can fail at each step.

**Clarify before you draw anything:**

- Is overselling ever acceptable? (for physical goods, no)
- Single warehouse or many? Multi-warehouse turns this into allocation.
- Is payment synchronous, or do we reserve then charge?
- Do we support cancellation and partial refunds?
- Cart in scope, or start at checkout?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **Order** | class | id, customer, lineItems, OrderStatus, total. |
| **OrderStatus** | enum / State | CREATED, RESERVED, PAID, CONFIRMED, SHIPPED, DELIVERED, CANCELLED. |
| **OrderLine** | class | sku, quantity, unitPrice at time of order. |
| **Inventory** | class | Per-SKU available and reserved counts. The unit of contention. |
| **Reservation** | class | sku, quantity, orderId, expiresAt. |
| **Warehouse** | class | Location plus its own inventory. |
| **AllocationStrategy** | interface | Which warehouse fulfils this line. |
| **PaymentService** | interface | External boundary; charge and refund, both idempotent. |
| **OrderSaga** | class | Orchestrates reserve → charge → confirm, with compensations. |
| **PricingStrategy** | interface | Base price, discounts, promotions. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **State** | The order lifecycle, with explicitly allowed transitions. |
| **Saga / orchestration** | Reserve, charge, confirm — with a compensating action per step. |
| **Strategy** | Allocation across warehouses; pricing and discounting. |
| **Observer** | Order status changes triggering notifications. |
| **Command** | Optional: each lifecycle step as an executable, compensatable command. |

**The oversell race, closed properly**

```java
// WRONG - the classic read-then-write race
if (inventory.get(sku) > 0) {
    inventory.put(sku, inventory.get(sku) - 1);   // two threads both pass the check
}

// RIGHT (in memory) - atomic conditional decrement
public boolean tryReserve(String sku, int qty) {
    AtomicInteger available = stock.get(sku);
    while (true) {
        int current = available.get();
        if (current < qty) return false;
        if (available.compareAndSet(current, current - qty)) return true;
    }
}

// RIGHT (in a database) - one statement, no read-modify-write
// UPDATE inventory SET available = available - :qty
//  WHERE sku = :sku AND available >= :qty
// then check rowsAffected == 1
```

> The database form is the one to write on the board. Check rows-affected: one means you got it, zero means you did not, and there is no window between the check and the decrement.

**State machine with explicit legal transitions**

```java
public enum OrderStatus {
    CREATED   { public Set<OrderStatus> next() { return Set.of(RESERVED, CANCELLED); } },
    RESERVED  { public Set<OrderStatus> next() { return Set.of(PAID, CANCELLED, EXPIRED); } },
    PAID      { public Set<OrderStatus> next() { return Set.of(CONFIRMED, REFUNDED); } },
    CONFIRMED { public Set<OrderStatus> next() { return Set.of(SHIPPED, CANCELLED); } },
    SHIPPED   { public Set<OrderStatus> next() { return Set.of(DELIVERED); } },
    DELIVERED { public Set<OrderStatus> next() { return Set.of(); } },
    CANCELLED { public Set<OrderStatus> next() { return Set.of(); } };

    public abstract Set<OrderStatus> next();
    public void checkTransition(OrderStatus to) {
        if (!next().contains(to))
            throw new IllegalStateException(this + " -> " + to + " not allowed");
    }
}
```

> Interviewers deliberately ask about illegal transitions — "can a DELIVERED order be cancelled?". Encoding the graph makes the answer structural instead of a scattered if.

**Saga with compensation**

```java
public Order place(Cart cart, String idempotencyKey) {
    return idempotency.runOnce(idempotencyKey, () -> {
        Order order = Order.create(cart);
        List<Runnable> compensations = new ArrayList<>();
        try {
            inventory.reserve(order);
            compensations.add(() -> inventory.release(order));

            payments.charge(order, idempotencyKey);
            compensations.add(() -> payments.refund(order, idempotencyKey));

            order.transitionTo(CONFIRMED);
            return order;
        } catch (Exception e) {
            Collections.reverse(compensations);
            compensations.forEach(Runnable::run);   // undo in reverse
            order.transitionTo(CANCELLED);
            throw e;
        }
    });
}
```

> Three things being tested at once: the idempotency key wrapping the whole operation, compensation in reverse order, and the fact that a refund is a business undo rather than a rollback.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two customers, one item left | Atomic conditional decrement. Exactly one succeeds; the other gets a clean out-of-stock. Never read-then-write. |
| Payment fails after reservation | Compensate by releasing the reservation, and rely on the TTL as a backstop if the compensation itself fails. |
| User double-clicks Place Order | Idempotency key on the request. The same key returns the same order rather than creating a second. |
| A flash sale on one SKU | That row becomes a single lock. Options: shard the stock into N buckets and decrement a random one, serialise through a queue, or use a virtual waiting room. Say which and why. |
| Three warehouses | Do NOT sum three counters and decrement one — that races. Either one logical counter with allocation deciding the warehouse afterwards, or per-warehouse reservation naming the warehouse. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add partial cancellation of one line" | Line-level status rather than order-level only, with the order status derived from its lines. |
| "Support pre-orders with no stock" | A reservation type that does not decrement available stock, and an allocation step when stock arrives. |
| "Add promotions and coupons" | PricingStrategy composition — Decorator stacks discounts without a combinatorial explosion of pricing classes. |
| "Make it eventually consistent for display" | Split the read model: "only 3 left" can be stale, the reservation cannot. Separating those two is the mature answer. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Two customers buy the last item. Exactly what happens? | One atomic conditional update succeeds and affects one row; the other affects zero rows and receives an out-of-stock response. There is no window in which both pass a check. |
| Is eventual consistency ever acceptable for inventory? | For DISPLAY, yes. For the reservation, never. Distinguishing them is the answer they want. |
| Can a delivered order be cancelled? | Not by the state machine — that becomes a return, which is a different flow with its own states. Saying that shows you modelled the domain and not just the happy path. |
| Why saga rather than a distributed transaction? | 2PC holds locks across services for the duration of network calls and its coordinator is a single point of failure. A saga trades atomicity for availability and uses compensations. |
| What if the refund compensation fails? | Retry with backoff, then dead-letter and alert. Some failures need a human — pretending everything auto-resolves is not credible. |

**What sinks candidates here:**

- Read-then-write on stock. This is the exact race being tested.
- No idempotency on order placement.
- An order status field with no transition rules.
- Summing stock across warehouses then decrementing one.
- No compensation path when payment fails after reservation.

---

## BLOCK C · TOP TIER — Amazon hybrid · Uber / Flipkart machine coding

### LRU / LFU Cache  *(Amazon hybrid, 40 min)*

**Who asks it.** AMAZON hybrid · Microsoft · Uber. Design plus the data-structure insight, in one round.

**Asked as:**

- Design an LRU cache with O(1) get and put.
- Now make it LFU.
- Add a TTL per entry.
- Make it thread-safe. Now make it thread-safe without one global lock.

**Clarify before you draw anything:**

- Fixed capacity, or memory-bounded?
- Do we need TTL as well as capacity eviction?
- Thread-safe? Single writer or many?
- Do we need statistics — hit rate, evictions?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **Cache<K,V>** | interface | get, put, remove. The seam that lets you swap policies. |
| **EvictionPolicy** | interface | recordAccess(key), evictCandidate(). LRU / LFU / FIFO. |
| **Node<K,V>** | class | key, value, prev, next. The doubly linked list node. |
| **DoublyLinkedList** | class | With sentinel head and tail so there are no null checks. |
| **CacheStats** | class | hits, misses, evictions. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | EvictionPolicy — this is what turns "write an LRU" into a design answer rather than a LeetCode answer. |
| **Decorator** | TTL, stats and thread-safety as wrappers around a plain cache. |
| **Template Method** | Optional: shared get/put skeleton with policy hooks. |

**LRU: hashmap plus doubly linked list, sentinels included**

```java
public class LruCache<K,V> {
    private final Map<K, Node<K,V>> map = new HashMap<>();
    private final Node<K,V> head = new Node<>(null, null);   // sentinels remove
    private final Node<K,V> tail = new Node<>(null, null);   // every null check
    private final int capacity;

    { head.next = tail; tail.prev = head; }

    public V get(K key) {
        Node<K,V> n = map.get(key);
        if (n == null) return null;
        moveToFront(n);
        return n.value;
    }

    public void put(K key, V value) {
        Node<K,V> n = map.get(key);
        if (n != null) { n.value = value; moveToFront(n); return; }
        if (map.size() == capacity) {
            Node<K,V> lru = tail.prev;
            remove(lru);
            map.remove(lru.key);            // remove from BOTH structures
        }
        Node<K,V> fresh = new Node<>(key, value);
        map.put(key, fresh);
        addFront(fresh);
    }
}
```

> The two bugs interviewers watch for: forgetting to remove the evicted key from the map (a slow leak), and hand-rolling null checks instead of using sentinels.

**LFU: the frequency-bucket trick**

```java
// key -> node, key -> freq, freq -> doubly linked list of keys at that freq
private final Map<K, V> values = new HashMap<>();
private final Map<K, Integer> freq = new HashMap<>();
private final Map<Integer, LinkedHashSet<K>> buckets = new HashMap<>();
private int minFreq;

private void touch(K key) {
    int f = freq.get(key);
    buckets.get(f).remove(key);
    if (buckets.get(f).isEmpty() && minFreq == f) minFreq++;   // the whole trick
    freq.put(key, f + 1);
    buckets.computeIfAbsent(f + 1, x -> new LinkedHashSet<>()).add(key);
}
```

> Tracking minFreq is what keeps eviction O(1) — otherwise you scan for the minimum. LinkedHashSet within a bucket breaks frequency ties by recency, which is the standard tie-break.

**Thread safety without one global lock**

```java
// Level 1 - correct, and it serialises everything
public synchronized V get(K key) { ... }

// Level 2 - segment the cache, lock per segment
private final LruCache<K,V>[] segments;   // key.hashCode() % n
public V get(K key) { return segmentFor(key).get(key); }

// Level 3 - what real caches do: approximate LRU
// Caffeine buffers reads in a ring and applies them in batches, so the
// hot path never contends on the linked list at all.
```

> Interviewers push here. Level 1 is the honest starting point; being able to name segmentation and then approximate LRU is what separates a memorised LeetCode answer from a design answer.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Every get mutates the recency list | That is why a plain LRU cannot be lock-free — a read is a write. Say this; it is the insight the question is built on. |
| Segmenting | Partition by key hash, lock per segment. Eviction becomes per-segment, so the policy is approximate globally — an acceptable trade you should name. |
| Read buffering | Production caches (Caffeine) record accesses into a buffer and replay them in batches, keeping reads contention-free. |
| TTL expiry | Lazy on read plus a periodic sweeper, the same pairing as the seat hold. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add TTL" | A Decorator wrapping the cache: check expiry on read, and sweep periodically. The eviction policy is untouched. |
| "Make it LFU" | Swap the EvictionPolicy implementation. If your first answer put the linked list inside the cache class, this is a rewrite — which is why the policy is an interface. |
| "Add hit-rate statistics" | Another decorator. Do not thread counters through the core class. |
| "Make it distributed" | This is where it becomes a system design question: consistent hashing, invalidation, and the fact that per-node LRU no longer gives global LRU. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why a doubly linked list rather than singly? | Eviction and promotion both need O(1) removal of a node given only that node, which requires the previous pointer. |
| Why not just LinkedHashMap with accessOrder? | You can, and for a real answer say so — override removeEldestEntry and it is five lines. Interviewers usually want the hand-rolled version to see the pointer work. |
| Why can a read not be lock-free? | Because get() reorders the recency list, so a read mutates shared state. That is the whole reason production caches buffer reads. |
| LFU eviction in O(1) — how? | Frequency buckets plus a tracked minFreq. Increment moves the key up a bucket; if the min bucket empties, minFreq increases by one. |
| Which would you actually use in production? | Caffeine. It uses a W-TinyLFU admission policy that beats both plain LRU and plain LFU on real workloads. Naming it signals you have used caches rather than only implemented them. |

**What sinks candidates here:**

- Forgetting to remove the evicted key from the hashmap.
- Singly linked list, so eviction is O(n).
- Putting the eviction policy inside the cache class, so LFU means a rewrite.
- Claiming get() can be lock-free.
- No sentinel nodes, then drowning in null checks under time pressure.

---

### In-Memory File System  *(Amazon hybrid, 45 min)*

**Who asks it.** AMAZON · Google · Microsoft. A tree problem wearing a design costume.

**Asked as:**

- Design an in-memory file system.
- Implement ls, mkdir, addContentToFile, readContentFromFile.
- Add search with wildcards.
- How would you add permissions?

**Clarify before you draw anything:**

- Do we need permissions, symlinks, or just files and directories?
- Is ls sorted? Does ls on a file return just that file?
- Are paths always absolute?
- Thread-safe?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **FileSystem** | class | The facade holding the root node. |
| **FsNode** | abstract class | name, parent, createdAt. The Composite base. |
| **Directory** | class | extends FsNode, holds Map<String, FsNode> children. |
| **File** | class | extends FsNode, holds content. |
| **Path** | value object | Parsing and normalising, so string handling is not scattered. |
| **Permission** | class | Optional extension: owner, mode bits. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Composite** | THE pattern here. Directory and File share a base type so a directory holds either. |
| **Visitor** | Optional: traversal operations like search, du, find, without editing the node classes. |
| **Facade** | FileSystem hiding traversal from callers. |
| **Iterator** | Walking the tree lazily. |

**Composite — the whole design in one shape**

```java
public abstract class FsNode {
    protected final String name;
    protected Directory parent;
    protected FsNode(String name) { this.name = name; }
    public abstract boolean isDirectory();
    public abstract int size();          // recursive for directories
}

public class Directory extends FsNode {
    private final Map<String, FsNode> children = new TreeMap<>();  // TreeMap = ls sorted free
    public boolean isDirectory() { return true; }
    public int size() {
        return children.values().stream().mapToInt(FsNode::size).sum();
    }
}

public class File extends FsNode {
    private final StringBuilder content = new StringBuilder();
    public boolean isDirectory() { return false; }
    public int size() { return content.length(); }
}
```

> TreeMap rather than HashMap is a small choice worth stating out loud: ls must return lexicographic order, and TreeMap gives it for free instead of sorting on every call.

**Path traversal with mkdir -p semantics**

```java
private Directory traverse(String path, boolean createMissing) {
    Directory cur = root;
    for (String part : path.split("/")) {
        if (part.isEmpty()) continue;             // leading slash, double slash
        FsNode next = cur.child(part);
        if (next == null) {
            if (!createMissing) throw new NoSuchFileException(path);
            next = cur.addChild(new Directory(part));
        }
        if (!next.isDirectory()) throw new NotADirectoryException(part);
        cur = (Directory) next;
    }
    return cur;
}
```

> One traversal method with a flag serves mkdir, ls, and read. Writing three near-identical walkers is the duplication interviewers notice.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two threads creating the same directory | computeIfAbsent on the children map makes creation atomic. Check-then-put races. |
| Reading while another thread writes a file | Either a lock per file, or copy-on-write content so readers always see a consistent snapshot. |
| Locking granularity | A lock on the whole filesystem is correct and useless. Lock the directory being mutated, and take locks in path order to avoid deadlock. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add permissions" | A Permission on FsNode plus a check in the facade before every operation. Composite means one check point covers files and directories alike. |
| "Add symlinks" | A third FsNode subtype holding a target path, with cycle detection during traversal. Say the cycle detection out loud. |
| "Add search with wildcards" | A Visitor walking the tree with a matcher. Do not add a search method to every node class. |
| "Compute directory size" | Already there — the recursive size() falls straight out of Composite, which is why the pattern earns its place. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Why Composite here? | Because a directory contains files AND directories, and callers should not care which. One base type makes recursion natural — size, search and delete are all one method. |
| Why TreeMap for children? | ls must be sorted. TreeMap keeps that invariant instead of sorting on every listing. |
| How do you avoid three copies of path parsing? | One traverse method with a create-missing flag, plus a Path value object owning the parsing. String splitting scattered across methods is where the bugs live. |
| ls on a file rather than a directory? | Returns just that file name. An edge case explicitly worth confirming during clarification — it is the one LC 588 tests. |
| How would you persist this? | Serialise the tree, or keep a write-ahead log of operations and replay. The in-memory design does not change; a Repository interface is the seam. |

**What sinks candidates here:**

- Separate unrelated File and Directory classes with no shared base, forcing instanceof everywhere.
- Path parsing duplicated in every method.
- HashMap for children, then forgetting ls must be sorted.
- No handling of intermediate directories in mkdir.
- Adding a search method to every node class instead of using a visitor.

---

### Ride-Hailing (machine coding)  *(Machine coding, 90 min, 90 min)*

**Who asks it.** UBER — their actual round · Flipkart · Ola. You must FINISH.

**Asked as:**

- Build a ride-hailing service: riders, drivers, matching, trip lifecycle.
- Runnable, tested code in 90 minutes.
- Add surge pricing.
- A driver declines. What happens next?

**Clarify before you draw anything:**

- How is a driver matched — nearest, or first to accept?
- Can a driver decline? (that turns matching into an offer loop, not one decision)
- Do we model real geography, or is a 2D grid acceptable? (say grid, and say why)
- Is payment in scope? (usually stub it)
- How much do we need to persist? (nothing — in memory)

**Entities**

| Class | Kind | Role |
|---|---|---|
| **RideService** | class | The facade: requestRide, acceptRide, startTrip, endTrip. |
| **Rider / Driver** | class | id, name, current Location, status. |
| **DriverStatus** | enum | OFFLINE, AVAILABLE, OFFERED, ON_TRIP. |
| **Trip** | class | rider, driver, source, destination, TripStatus, fare. |
| **TripStatus** | enum / State | REQUESTED, MATCHED, STARTED, COMPLETED, CANCELLED. |
| **Location** | record | lat, lng — or grid x, y for a machine-coding round. |
| **MatchingStrategy** | interface | nearest, highest-rated, batched. |
| **PricingStrategy** | interface | base plus distance, with a surge multiplier. |
| **DriverIndex** | class | Spatial lookup. A grid of buckets is enough; say H3 is what production uses. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | Matching and pricing — the two things they will ask you to swap. |
| **State** | Trip lifecycle with legal transitions. |
| **Observer** | Notifying rider and driver on status changes. |
| **Factory** | Optional, for creating trips. |

**Ship this skeleton in the first 20 minutes**

```java
public class RideService {
    private final DriverIndex index;
    private final MatchingStrategy matcher;
    private final PricingStrategy pricing;
    private final Map<String, Trip> trips = new ConcurrentHashMap<>();

    public Trip requestRide(Rider rider, Location from, Location to) {
        List<Driver> nearby = index.within(from, RADIUS_KM);
        Driver chosen = matcher.choose(nearby, from)
                .orElseThrow(() -> new NoDriverAvailableException(from));
        if (!chosen.tryOffer()) return requestRide(rider, from, to);  // someone beat us
        Trip trip = new Trip(rider, chosen, from, to, pricing.quote(from, to));
        trips.put(trip.id(), trip);
        return trip;
    }
}

// then main() with a demo run, THEN enrich
```

> In a machine-coding round the order matters more than the design. A running end-to-end path at minute 20 beats a beautiful class diagram at minute 85.

**The double-assignment race**

```java
public class Driver {
    private final AtomicReference<DriverStatus> status =
            new AtomicReference<>(DriverStatus.AVAILABLE);

    public boolean tryOffer() {
        return status.compareAndSet(AVAILABLE, OFFERED);
    }
    public boolean accept() {
        return status.compareAndSet(OFFERED, ON_TRIP);
    }
    public void decline() {
        status.compareAndSet(OFFERED, AVAILABLE);   // back in the pool
    }
}
```

> Two riders must never be matched to one driver. compareAndSet on the driver status is the whole answer, and it is the correctness question the round is built around.

**Spatial lookup without over-engineering**

```java
public class GridIndex implements DriverIndex {
    private final double cell;   // e.g. 1 km
    private final Map<Cell, Set<Driver>> buckets = new ConcurrentHashMap<>();

    public List<Driver> within(Location l, double km) {
        // own cell plus neighbours - never scan every driver
        return cellsAround(l, km).stream()
                .flatMap(c -> buckets.getOrDefault(c, Set.of()).stream())
                .filter(d -> d.location().distanceTo(l) <= km)
                .toList();
    }
}
```

> A grid is entirely acceptable in a 90-minute round. Say the production answer is H3 or S2, and that you are choosing a grid deliberately for time — that reads as judgement, not ignorance.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Two riders matched to one driver | compareAndSet on driver status. Exactly one offer wins. |
| Driver never responds to the offer | Timeout, say 15 seconds, then compareAndSet OFFERED back to AVAILABLE and offer the next candidate. The offer loop is the product. |
| Location updates at high frequency | A ConcurrentHashMap of buckets with the driver moved between cells on update. Do not persist every ping. |
| Trip state transitions | Guard them so endTrip cannot fire before startTrip. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Add surge pricing" | A PricingStrategy reading the supply/demand ratio for the cell. Smoothed over a window, or the price flaps and riders revolt. |
| "Add ride pooling" | Trip gains multiple riders and an ordered list of waypoints; matching becomes a route-compatibility check. Say it is a genuinely harder problem. |
| "Add driver ratings into matching" | A different MatchingStrategy. Nothing else changes — that is the payoff. |
| "Scale to a city" | Hand-off to system design: the grid becomes H3, the in-memory index becomes Redis, matching becomes batched every few seconds rather than greedy per request. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| How do you find nearby drivers without scanning everyone? | Bucket drivers into grid cells and query the cell plus its neighbours. Production uses H3 hexagons because neighbour distance is uniform. |
| Two riders request at the same instant and one driver is nearest. | compareAndSet on the driver status. The loser re-runs matching against the remaining pool. |
| The driver does not accept. | A timeout returns them to AVAILABLE and the next candidate is offered. Matching is a sequence of offers, not a single decision — modelling it as one decision is the common mistake. |
| Why a grid and not a quadtree? | Uniform cells are simpler and adequate at this time budget. A quadtree adapts to density, which matters when a city centre is a thousand times denser than the suburbs. Naming the trade-off is the point. |
| You have 15 minutes left and pooling is not done. | Say so, state what you would do, and make sure what exists runs and is tested. A finished subset beats an unfinished superset in this round, always. |

**What sinks candidates here:**

- Designing for 60 minutes and coding for 30. This round is scored on finishing.
- Scanning every driver to find the nearest.
- No answer for the double-assignment race.
- Modelling matching as one decision rather than an offer loop with timeouts.
- Building persistence nobody asked for.

---

### Rate Limiter / Logger (as objects)  *(Amazon hybrid, 35 min)*

**Who asks it.** Amazon · Uber · Google. The LLD half of the system design session.

**Asked as:**

- Design a rate limiter as a class.
- Implement a token bucket.
- Design a logger that accepts a message at most once every 10 seconds.
- Now make it work across 50 servers.

**Clarify before you draw anything:**

- Per user, per IP, per API key?
- Must it be exact, or is approximate acceptable?
- Single process, or distributed?
- What do we do when the limit is hit — reject, queue, or throttle?

**Entities**

| Class | Kind | Role |
|---|---|---|
| **RateLimiter** | interface | tryAcquire(key) — the seam that lets you swap algorithms. |
| **TokenBucketLimiter** | class | capacity, refillRate, lastRefill per key. |
| **SlidingWindowLimiter** | class | Weighted previous and current window counts. |
| **FixedWindowLimiter** | class | The naive one. Implement it to show you know why it is wrong. |
| **Bucket** | class | Per-key state. The unit of contention. |
| **ClockSource** | interface | Injected so tests are not slow and flaky. |

**Patterns, and exactly where**

| Pattern | Applied to |
|---|---|
| **Strategy** | RateLimiter implementations behind one interface. |
| **Decorator** | Layering a limiter over any service call. |
| **Factory** | Choosing a limiter per endpoint or per tier. |

**Token bucket with lazy refill**

```java
public class TokenBucket {
    private final long capacity;
    private final double refillPerSecond;
    private double tokens;
    private long lastRefillNanos;
    private final Clock clock;                     // INJECTED - testability

    public synchronized boolean tryAcquire(int permits) {
        refill();
        if (tokens >= permits) { tokens -= permits; return true; }
        return false;
    }

    private void refill() {
        long now = clock.nanoTime();
        double add = (now - lastRefillNanos) / 1e9 * refillPerSecond;
        tokens = Math.min(capacity, tokens + add);   // lazy: no background thread
        lastRefillNanos = now;
    }
}
```

> Lazy refill on access, not a scheduled thread topping up a million buckets. Injecting the clock means a test can assert refill behaviour without sleeping — mention it, because interviewers notice untestable time handling.

**Why fixed window is wrong, in code**

```java
// FIXED WINDOW: limit 100/min
// 100 requests at 11:00:59 and 100 more at 11:01:00
// = 200 in one second, and every one is "legal"

// SLIDING WINDOW COUNTER - weighted blend, tiny memory
public boolean allow(String key) {
    long now = clock.millis();
    long windowStart = now - (now % windowMs);
    double elapsed = (now - windowStart) / (double) windowMs;
    Counts c = counts.get(key);
    double estimate = c.previous * (1 - elapsed) + c.current;
    if (estimate >= limit) return false;
    c.current++;
    return true;
}
```

> Being able to state the boundary-burst problem AND write the fix is what separates this from a memorised definition.

**Concurrency** — raise these before you are asked

| The race | How you close it |
|---|---|
| Many threads hitting one key | synchronized on the bucket, not on the limiter. Per-key locking keeps unrelated users independent. |
| A map of millions of buckets | Use ConcurrentHashMap with computeIfAbsent, and evict idle buckets or you leak memory forever. Interviewers ask about this. |
| Distributed across 50 servers | Central Redis with an atomic INCR and expiry, or a Lua script for the token bucket. Local counters with periodic sync are approximate but survive Redis being down. |
| Fail-open | If the limiter itself fails, let traffic through with a conservative local fallback. A limiter that causes an outage is worse than no limiter. |

**"Now add X"** — the highest-scoring thirty seconds

| They ask for | You answer |
|---|---|
| "Different limits per API tier" | Configuration keyed by tier, resolved by the factory. No code change to add a tier. |
| "Expensive endpoints cost more" | Weighted permits — tryAcquire(10) for a heavy call. The bucket already supports it. |
| "Make it distributed" | Redis INCR with TTL, or a Lua script for atomic token-bucket refill-and-take. Name the extra round trip as the cost. |
| "Add a logger that rate-limits identical messages" | LC 359: a map of message to next-allowed timestamp. Same shape, and mention the memory leak if you never evict. |

**Cross-questions**

| They ask | The answer spine |
|---|---|
| Fixed window — show me the flaw. | A 100-per-minute limit permits 200 in one second across the boundary: 100 at 11:00:59 and 100 at 11:01:00. That is why sliding window or token bucket exists. |
| Why lazy refill rather than a scheduler? | A background thread refilling a million buckets is enormous waste. Computing elapsed time on access is exact and free. |
| Where do you put the lock? | On the bucket, one per key. Locking the limiter serialises every user against every other user. |
| Millions of keys — what breaks? | Unbounded memory. Evict idle buckets with an LRU or a TTL. This is the follow-up people miss. |
| What if Redis is down in the distributed version? | Fail open with a conservative local limit. State it explicitly — availability of your API matters more than perfect enforcement. |

**What sinks candidates here:**

- Answering with fixed window and not knowing the boundary burst.
- A background refill thread per bucket.
- Locking the whole limiter instead of the bucket.
- Unbounded bucket map with no eviction.
- Using System.currentTimeMillis() directly, making the class untestable.

---

## AMAZON LEADERSHIP PRINCIPLES

LP is roughly half of Amazon's signal and the bar-raiser can reject you on it alone. It is the single most common way strong coders fail Amazon. Two stories per Sunday from week 2, reaching 15 by week 13. Each with real numbers, each rehearsed to under two minutes, each saying "I" not "we" — Amazon scores your actions, not your team's.

- **LP stories 1–3 — ownership · dive deep · deliver results** — Real numbers. Written down, not remembered.
- **LP stories 4–6 — customer obsession · invent and simplify · bias for action**
- **LP stories 7–9 — earn trust · have backbone and disagree · learn and be curious**
- **LP stories 10–12 — hire and develop · frugality · think big**
- **LP stories 13–15 — highest standards · are right a lot · best employer**
- **LP: "your biggest failure" — rehearsed cold** — This one catches people. Prepare it specifically.
- **LP: "when you disagreed with a manager" — rehearsed cold** — So does this one.
- **LP full rehearsal — all 15 under two minutes each, "I" not "we"** — Record it. Count how often you say "we".
# PART IV — TECH (Java · Spring · Postgres · Kafka · K8s · microservices)

**The gradient inverts here.** The deepest tech questioning is at the **bottom** of your ladder — JP Morgan and Amex will go far deeper on `@Transactional`, thread pools and index plans than Google ever will. Google asks none of it. So Block B is the heavy one, and this whole track is front-loaded into Phase 1.

**13 modules · ~115 hours · 34 code patterns · 197 Q&A rows.**

Every Q&A row is **question → the answer's spine → the follow-up they will actually ask.** Learn the follow-up; anyone can answer the first question.

---

## §22 · MODULE 1 — Java core & collections  *(phase 1, 9h)*

**How the interview opens:**

- Walk me through what happens when you put an object in a HashMap.
- Why is String immutable?
- ArrayList or LinkedList here, and why?
- How would you find a memory leak in production?

### Patterns you must be able to write

**equals / hashCode done correctly**

```java
@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Order other)) return false;   // pattern matching, Java 16+
    return Objects.equals(id, other.id);             // ONLY immutable identity fields
}
@Override public int hashCode() { return Objects.hash(id); }
```

> The contract: equal objects MUST have equal hashcodes. Use only fields that never change after construction, or the object gets lost in its own HashMap.

**Safe iteration and removal**

```java
// WRONG - ConcurrentModificationException
for (Order o : orders) if (o.isCancelled()) orders.remove(o);

// right, single-threaded
orders.removeIf(Order::isCancelled);

// right, explicit iterator
Iterator<Order> it = orders.iterator();
while (it.hasNext()) if (it.next().isCancelled()) it.remove();
```

> removeIf is the modern answer. Knowing WHY the enhanced for-loop throws is the interview.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Why is String immutable?** | Security (class loading, file paths cannot be mutated after a check), hashcode caching, safe sharing in the string pool, and thread safety with no synchronisation. | Then how does StringBuilder differ, and when does the compiler use it for you? (String concatenation in a loop is the classic waste.) |
| **The equals/hashCode contract** | Equal objects must have equal hashcodes; unequal objects may collide. Override both or neither. | You put a mutable object in a HashSet then mutate the field used in hashCode. What happens? => the bucket no longer matches, contains() returns false, and the object is unreachable but still consuming memory. |
| **HashMap internals** | Array of buckets; each bucket a linked list; treeified into a red-black tree at 8 nodes (Java 8+); resize doubles capacity at load factor 0.75 and rehashes. | Why treeify? => it caps worst-case lookup at O(log n) and defends against hash-collision denial-of-service attacks. |
| **HashMap vs LinkedHashMap vs TreeMap** | Unordered / insertion or access order / sorted by comparator. | Which one gives you an LRU cache almost for free? => LinkedHashMap with accessOrder=true and removeEldestEntry overridden. |
| **ArrayList vs LinkedList** | Contiguous array with O(1) random access and cache-friendly iteration, versus node chasing with O(1) insert once you already hold the node. | Why does LinkedList lose even for middle insertion? => you still pay O(n) to walk there, and every node is a cache miss. |
| **Array vs ArrayList** | Fixed size, can hold primitives, covariant. ArrayList grows, boxes primitives, is invariant with generics. | Why does new List<int>() not compile? => generics do not accept primitives; erasure requires reference types. |
| **Heap vs stack** | Objects and their fields on the heap; frames, locals and references on the stack. Each thread has its own stack. | Where does a String literal live? => the string pool, which sits in the heap since Java 7. |
| **Garbage collection** | Generational hypothesis: most objects die young. Young generation collected often and cheaply; old generation rarely and expensively. G1 splits the heap into regions and collects the emptiest first. | What is a stop-the-world pause and how do you reduce it? => smaller heaps, region-based collectors, avoiding huge object graphs, and tuning pause targets. |
| **Memory leak in a garbage-collected language** | Unbounded caches, listeners that are never deregistered, ThreadLocal in a pooled thread, static collections that only grow, and unclosed resources. | How would you find one? => heap dump, then the dominator tree in a tool like Eclipse MAT to find who is holding the retained set. |
| **final, finally, finalize** | A binding or class that cannot change / a block that always runs / a deprecated pre-collection hook you must never use. | Does finally always run? => not on System.exit, a JVM crash, or an infinite loop in try. And a return in finally silently swallows exceptions. |
| **Checked vs unchecked exceptions** | Checked = the caller can plausibly recover. Unchecked = a programming error. | Why do many modern codebases avoid checked exceptions? => they leak through abstraction layers, do not compose with lambdas, and get swallowed with empty catch blocks. |
| **Generics and type erasure** | Generic types exist at compile time only; the runtime sees raw types plus synthetic casts. | Why can you not write new T[]? => the runtime has no idea what T is, so it cannot create the array. |
| **== vs equals for boxed types** | == compares references. Integer caches -128 to 127, so small values appear to work. | Why does Integer a = 128, b = 128; a == b evaluate false? => outside the cache range, two distinct objects. |
| **Comparable vs Comparator** | Natural ordering inside the class versus an external ordering strategy. | Your comparator is inconsistent with equals. What breaks? => TreeSet and TreeMap silently treat distinct objects as duplicates. |
| **String pool and interning** | Literals are pooled; new String() is not. | What does intern() do, and why is it usually a mistake? => forces pooling, and on hot paths it becomes a contended bottleneck. |

**Traps that bite:**

- Overriding equals but not hashCode. Interviewers check this constantly.
- Using a mutable field in hashCode.
- Concatenating strings in a loop instead of StringBuilder.
- Assuming ArrayList.remove(int) and remove(Object) do the same thing on a List<Integer>. They do not.

---

## §23 · MODULE 2 — Modern Java (8 to 21)  *(phase 1, 5h)*

**How the interview opens:**

- Rewrite this loop with the Streams API.
- When is a parallel stream a bad idea?
- What are records for?
- How do you avoid null without Optional everywhere?

### Patterns you must be able to write

**Streams: grouping and summarising**

```java
Map<Status, List<Order>> byStatus = orders.stream()
        .collect(Collectors.groupingBy(Order::getStatus));

Map<Status, BigDecimal> totals = orders.stream()
        .collect(Collectors.groupingBy(Order::getStatus,
                 Collectors.reducing(BigDecimal.ZERO, Order::getAmount, BigDecimal::add)));

Optional<Order> largest = orders.stream()
        .max(Comparator.comparing(Order::getAmount));
```

> groupingBy with a downstream collector is the single most useful thing in the Streams API, and the one candidates most often fumble.

**Record as a DTO or value object**

```java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        if (amount.signum() < 0) throw new IllegalArgumentException("negative");
    }
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("mixed currency");
        return new Money(amount.add(other.amount), currency);
    }
}
```

> Records give you a final class, equals, hashCode, toString and accessors. The compact constructor is where validation goes. Ideal for DTOs and value objects; wrong for JPA entities, which need a no-arg constructor and mutability.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Streams: lazy or eager?** | Lazy. Intermediate operations build a pipeline; nothing runs until a terminal operation. | A stream with no terminal operation - what happens? => nothing at all, and it is a silent bug. |
| **When is a parallel stream slower?** | Small collections, cheap per-element work, non-splittable sources like LinkedList, or any blocking IO inside the lambda. | Which thread pool does it use? => the common ForkJoinPool, shared process-wide, so one slow parallel stream starves everything else. |
| **Optional: correct use** | A return type for a value that may legitimately be absent. | Why not as a field or a method parameter? => it is not Serializable, it adds an allocation, and an overload or null check is clearer for parameters. |
| **orElse vs orElseGet** | orElse always evaluates its argument; orElseGet only on absence. | So what is wrong with orElse(expensiveCall())? => the expensive call runs even when the value is present. |
| **Records vs Lombok @Data** | Records are a language feature: final, immutable, no setters. @Data generates mutable boilerplate. | Can you use a record as a JPA entity? => no. JPA needs a no-arg constructor and non-final fields for proxies. |
| **Sealed interfaces** | Restricts which types may implement, so the compiler can check exhaustiveness in a switch. | Where does that help? => modelling a closed set of states or events, with no default branch hiding a missing case. |
| **var** | Local type inference; the type is still static and fixed. | When does it hurt readability? => when the right-hand side does not make the type obvious. |
| **CompletableFuture vs Stream** | Async composition versus data transformation. Different axes. | How do you run 10 HTTP calls in parallel and collect the results? => a list of CompletableFutures, then allOf(...).join(), then map to join each. |
| **Text blocks** | Multi-line string literals. Useful for SQL and JSON in tests. | Any runtime cost? => none, resolved at compile time. |
| **Virtual threads (21)** | Lightweight threads scheduled by the JVM; blocking is cheap so thread-per-request scales. | When do they NOT help? => CPU-bound work, and code pinned by synchronized blocks holding the carrier thread. |

**Traps that bite:**

- Side effects inside a stream lambda (mutating an external list). Use a collector.
- Reusing a stream after a terminal operation. It throws.
- Optional.get() without isPresent. That is just a nullcheck with extra steps.
- Parallel streams on anything doing IO.

---

## §24 · MODULE 3 — Concurrency  *(phase 1, 12h)*

> JPM and Amex go deep here. Your custom event-driven components make this a natural question, so expect it.

**How the interview opens:**

- What is the difference between volatile and synchronized?
- How do you size a thread pool?
- Write a thread-safe counter. Now make it faster.
- Reproduce a deadlock, then fix it.

### Patterns you must be able to write

**Thread pool with a bounded queue and a rejection policy**

```java
@Bean("taskExecutor")
public ThreadPoolTaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
    ex.setCorePoolSize(8);
    ex.setMaxPoolSize(16);
    ex.setQueueCapacity(500);                       // BOUNDED - unbounded means OOM
    ex.setThreadNamePrefix("evt-");                 // shows up in thread dumps
    ex.setRejectedExecutionHandler(
        new ThreadPoolExecutor.CallerRunsPolicy()); // backpressure onto the caller
    ex.setWaitForTasksToCompleteOnShutdown(true);
    ex.setAwaitTerminationSeconds(30);
    return ex;
}
```

> Three interview points in one bean: the queue is bounded, the rejection policy applies backpressure instead of dropping, and shutdown drains. The default Spring executor does none of this.

**Deadlock, and the fix**

```java
// DEADLOCK: two threads take the locks in opposite order
void transfer(Account a, Account b, BigDecimal amt) {
    synchronized (a) { synchronized (b) { a.debit(amt); b.credit(amt); } }
}

// FIX: impose a global lock ordering
void transfer(Account a, Account b, BigDecimal amt) {
    Account first  = a.getId() < b.getId() ? a : b;
    Account second = a.getId() < b.getId() ? b : a;
    synchronized (first) { synchronized (second) { a.debit(amt); b.credit(amt); } }
}
```

> Lock ordering is the standard answer. The alternative is tryLock with a timeout and retry. Be able to write both.

**Parallel calls with CompletableFuture**

```java
List<CompletableFuture<Quote>> futures = vendors.stream()
    .map(v -> CompletableFuture.supplyAsync(() -> client.quote(v), taskExecutor)
                 .orTimeout(2, TimeUnit.SECONDS)
                 .exceptionally(ex -> Quote.unavailable(v)))
    .toList();

CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
List<Quote> quotes = futures.stream().map(CompletableFuture::join).toList();
```

> Note the explicit executor (never the common pool for IO), the per-call timeout, and the fallback. Without those three this pattern hangs your request thread.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **volatile vs synchronized** | volatile gives visibility and ordering, no atomicity. synchronized gives mutual exclusion plus visibility. | Is count++ safe on a volatile int? => no. It is read-modify-write, three operations. Use AtomicInteger. |
| **The happens-before relationship** | The JMM rule that makes one thread writes visible to another: unlock before lock, volatile write before volatile read, thread start, thread join. | Why is double-checked locking broken without volatile? => the reference can be published before the constructor finishes, so another thread sees a partially built object. |
| **Thread pool sizing** | CPU-bound is roughly cores + 1. IO-bound is roughly cores x (1 + waitTime/serviceTime). | What if the queue is unbounded and producers outpace consumers? => memory grows until OutOfMemoryError. Bound the queue and choose a rejection policy. |
| **ExecutorService shutdown** | shutdown stops accepting and drains; shutdownNow interrupts; awaitTermination blocks for the drain. | Your application will not exit. Why? => non-daemon pool threads still alive because nothing called shutdown. |
| **ConcurrentHashMap** | Locks at the bin level using CAS plus synchronized on the bin head, not the whole map. | Is if (map.get(k) == null) map.put(k, v) safe? => no, it is check-then-act. Use computeIfAbsent or putIfAbsent. |
| **computeIfAbsent pitfall** | Atomic per key, but the mapping function must not modify the same map. | What happens if it does? => in Java 9+ a ConcurrentModificationException; before that, a corrupted map or an infinite loop. |
| **CompletableFuture composition** | thenApply transforms; thenCompose flattens a nested future; thenCombine joins two. | Which executor runs your callback if you do not pass one? => the one that completed the previous stage, or the common ForkJoinPool. Always pass your own for IO. |
| **Deadlock** | Four Coffman conditions: mutual exclusion, hold and wait, no pre-emption, circular wait. Break any one. | How do you detect one in production? => a thread dump shows "Found one Java-level deadlock" explicitly. |
| **Livelock and starvation** | Threads keep responding to each other and make no progress; or a thread never gets scheduled. | How is livelock different from deadlock? => the threads are running, which makes it harder to spot. |
| **Optimistic vs pessimistic locking** | Compare-and-set or a version column, versus holding a lock. | Which for a high-contention seat booking, and why? => pessimistic, or an atomic conditional update. Optimistic retries thrash under contention. |
| **ThreadLocal** | Per-thread storage. Must be removed in a pooled thread. | What leaks if you do not? => the value stays bound to the pooled thread and is visible to the next unrelated request. A correctness bug as well as a leak. |
| **Atomics and LongAdder** | AtomicInteger is a CAS loop. LongAdder spreads across cells and sums on read. | When does LongAdder beat AtomicLong? => high write contention with infrequent reads, like a metrics counter. |
| **Producer-consumer** | BlockingQueue with bounded capacity gives you backpressure for free. | Bounded or unbounded, and what breaks with each? => unbounded risks OOM; bounded blocks the producer, which is usually what you want. |
| **synchronized method vs block** | Method locks this (or the class for static); a block locks whatever monitor you name. | Can two synchronized methods on the same object run concurrently? => no, they share the same monitor. |
| **Virtual threads (Java 21)** | Cheap, blocking-friendly, scheduled on carrier threads. | What is pinning? => a virtual thread inside a synchronized block cannot unmount, so it holds the carrier. Use ReentrantLock instead. |
| **Immutability as a concurrency strategy** | No shared mutable state means no synchronisation needed. | What is the cheapest way to make a class thread-safe? => make it immutable. Say this before reaching for locks. |

**Traps that bite:**

- Unbounded queues in thread pools. The classic production OutOfMemoryError.
- ThreadLocal not removed in a pooled thread - leaks data across requests.
- Using the common ForkJoinPool for blocking IO.
- Assuming synchronized collections are enough for compound operations. Collections.synchronizedList still needs external locking for check-then-act.

---

## §25 · MODULE 4 — Spring core & DI  *(phase 1, 9h)*

**How the interview opens:**

- How does dependency injection actually work in Spring?
- Why does @Transactional not work when I call the method from the same class?
- Explain the bean lifecycle.
- Constructor or field injection, and why?

### Patterns you must be able to write

**Constructor injection, the way it should be written**

```java
@Service
public class OrderService {
    private final OrderRepository repo;
    private final PaymentClient payments;

    // no @Autowired needed since Spring 4.3 for a single constructor
    public OrderService(OrderRepository repo, PaymentClient payments) {
        this.repo = repo;
        this.payments = payments;
    }
}
```

> Final fields, immutable, trivially unit-testable with new OrderService(mock, mock), and circular dependencies fail loudly at startup instead of silently at runtime.

**The self-invocation trap and three fixes**

```java
@Service
public class OrderService {

    public void placeAll(List<Order> orders) {
        orders.forEach(this::place);   // BUG: bypasses the proxy, NO transaction
    }

    @Transactional
    public void place(Order o) { ... }
}

// FIX 1 - inject self (Spring resolves the proxy)
@Autowired @Lazy private OrderService self;
orders.forEach(self::place);

// FIX 2 - move the transactional method to another bean (preferred)

// FIX 3 - programmatic
transactionTemplate.executeWithoutResult(status -> place(o));
```

> THE most-asked Spring question. AOP works through a proxy; this.method() never touches it. Fix 2 is the one to name first because it fixes the design, not just the symptom.

**Transaction propagation that actually matters**

```java
@Transactional                                     // joins the caller transaction
public void placeOrder(Order o) {
    repo.save(o);
    audit.record(o);      // REQUIRES_NEW - commits even if placeOrder rolls back
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void record(Order o) { auditRepo.save(new AuditEntry(o)); }
```

> REQUIRES_NEW suspends the outer transaction and starts its own on a separate connection. Audit logging is the canonical legitimate use. It also means you now hold two connections, which is how pools get exhausted.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Inversion of control** | The container owns construction and wiring; your class declares what it needs. | Constructor or field injection? => constructor: immutability, testability without reflection, and fail-fast on cycles. |
| **Bean scopes** | singleton (default, one per context), prototype (new each injection), request, session. | A singleton bean holding mutable state - what happens? => shared across every request thread. Either make it stateless or synchronise. |
| **Bean lifecycle** | instantiate, populate dependencies, *Aware callbacks, BeanPostProcessor before, @PostConstruct, BeanPostProcessor after, ready, @PreDestroy. | Where would you hook to modify every bean of a type? => a BeanPostProcessor. That is also how @Transactional and @Async wrap your beans. |
| **@Component vs @Bean** | Class-level, found by component scan, versus a factory method inside @Configuration. | How do you register a bean from a third-party library you cannot annotate? => @Bean in a @Configuration class. |
| **AOP and proxies** | JDK dynamic proxy when the bean implements an interface, CGLIB subclass otherwise. Advice wraps the join point. | Why does the aspect not fire on a private method or a self-invocation? => the call never leaves the object, so the proxy is not involved. |
| **@Transactional self-invocation** | this.method() bypasses the proxy, so no transaction, no retry, no cache. | How do you fix it? => move the method to another bean (best), self-inject with @Lazy, or use TransactionTemplate. |
| **Propagation** | REQUIRED joins or creates; REQUIRES_NEW suspends and starts a new one; NESTED uses a savepoint; MANDATORY throws if none exists. | The outer transaction rolls back - does the REQUIRES_NEW inner also roll back? => no, it already committed independently. |
| **Rollback rules** | Rolls back on RuntimeException and Error by default; checked exceptions need rollbackFor. | You caught the exception inside the method - does it still roll back? => no. The proxy never sees it. This silently loses data. |
| **Isolation** | READ_COMMITTED is the Postgres default; REPEATABLE_READ prevents non-repeatable reads; SERIALIZABLE prevents phantoms. | Give a concrete anomaly each level allows. |
| **readOnly = true** | A hint: Hibernate skips dirty checking and the driver may route to a replica. | Does it prevent writes? => not reliably. It is an optimisation, not a guarantee. |
| **Circular dependencies** | Constructor cycles fail at startup; setter or @Lazy can break them. | Why is failing the RIGHT behaviour? => a cycle is a design smell. Spring Boot 2.6+ disallows it by default. |
| **@Qualifier and @Primary** | Disambiguate when several beans satisfy one type. | Two implementations of an interface and no qualifier - what happens? => NoUniqueBeanDefinitionException at startup. |
| **@Profile and conditional beans** | Register beans only under a profile or a condition. | How do you swap a real client for a stub in tests? => a @Profile("test") bean, or @TestConfiguration. |
| **Spring MVC request flow** | DispatcherServlet, HandlerMapping, HandlerAdapter, your controller, then a message converter or view resolver. | Where does @ControllerAdvice fit? => it wraps handler invocation to translate exceptions into responses centrally. |
| **@ControllerAdvice** | Centralised exception handling and response shaping. | Why is it better than try/catch in every controller? => one error contract, no duplication, and it also catches exceptions from validation and converters. |

**Traps that bite:**

- Self-invocation silently disabling @Transactional, @Async, @Cacheable and @Retryable.
- Catching an exception inside a transactional method and expecting a rollback.
- Field injection, which hides cycles and makes unit tests need a Spring context.
- Mutable state in a singleton bean.

---

## §26 · MODULE 5 — Spring Boot & configuration  *(phase 1, 5h)*

**How the interview opens:**

- How does auto-configuration decide what to configure?
- How do you override an auto-configured bean?
- How do you inject secrets without putting them in the image?
- What does Actuator expose, and what must never be public?

### Patterns you must be able to write

**Typed configuration with validation**

```java
@ConfigurationProperties(prefix = "payments")
@Validated
public record PaymentProps(
        @NotBlank String apiUrl,
        @Positive int timeoutMs,
        @DefaultValue("3") int maxRetries) {}

// application.yml
// payments:
//   api-url: https://...
//   timeout-ms: 2000
```

> Typed, validated at startup, and a bad config fails the deploy instead of failing the first request at 3am. Far better than scattering @Value strings.

**Health checks mapped to Kubernetes probes**

```java
management:
  endpoint:
    health:
      probes:
        enabled: true          # exposes /health/liveness and /health/readiness
  endpoints:
    web:
      exposure:
        include: health,info,prometheus     # NOT env, NOT heapdump

server:
  shutdown: graceful           # drain in-flight requests
spring:
  lifecycle:
    timeout-per-shutdown-phase: 25s
```

> Liveness must not check downstreams or a slow database takes your pods down in a restart loop. Readiness should. Graceful shutdown plus a preStop hook is what actually gives zero-downtime rollouts.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Auto-configuration** | @EnableAutoConfiguration loads candidates from AutoConfiguration.imports, each guarded by @ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty. | How do you stop one applying? => exclude it, or simply define your own bean, since most are @ConditionalOnMissingBean. |
| **Debugging auto-configuration** | Run with --debug for the condition evaluation report showing what matched and what did not. | A bean you expected is missing. What is your first move? => read that report before changing any code. |
| **Starters** | Curated transitive dependency sets. No code of their own. | What is actually in spring-boot-starter-web? => Spring MVC, Jackson, validation, and embedded Tomcat. |
| **Config precedence** | Command line, then OS env, then application-{profile}.yml, then application.yml, then defaults. | How do you inject a secret without baking it into the image? => environment variable from a Kubernetes Secret, or a mounted file, never the jar. |
| **Profiles** | @Profile on beans, spring.profiles.active to select. | How do your Kubernetes manifests set it? => SPRING_PROFILES_ACTIVE as an env var. Relaxed binding maps it automatically. |
| **Relaxed binding** | api-url, api_url, API_URL and apiUrl all bind to the same property. | Why does that matter in containers? => environment variables cannot contain dots or dashes. |
| **Actuator** | /health, /info, /metrics, /prometheus, /env, /threaddump, /heapdump. | Which must never be public? => env, heapdump and threaddump leak secrets and internals. Bind Actuator to a separate management port. |
| **Liveness vs readiness in Boot** | Health groups map to the two Kubernetes probes. | What must liveness NOT check? => downstream dependencies. A slow database would restart every pod at once. |
| **Embedded server and thread model** | Tomcat by default, thread per request, default 200 threads. | How many concurrent requests can it handle, and what do you tune? => server.tomcat.threads.max, and remember every thread also holds a DB connection under load. |
| **WebFlux vs MVC** | Event loop and backpressure versus thread per request. | When is WebFlux the wrong choice? => any blocking JDBC in the chain. One blocking call poisons the event loop. |
| **Graceful shutdown** | Stop accepting, drain in-flight, then exit. | How does that interact with a rolling update? => needs a preStop sleep so the Service stops routing before the process starts draining, plus a long enough terminationGracePeriodSeconds. |
| **@SpringBootTest vs slices** | Full context versus @WebMvcTest or @DataJpaTest. | Why prefer a slice? => seconds instead of minutes, and a failure points at one layer. |

**Traps that bite:**

- Exposing all Actuator endpoints. management.endpoints.web.exposure.include=* in production is a real breach.
- Liveness probes that call the database.
- Secrets in application.yml committed to git.
- No graceful shutdown, so every deploy drops in-flight requests.

---

## §27 · MODULE 6 — Spring event-driven & async  *(phase 1, 9h)*

> YOUR DAILY WORK. You build custom event-driven components in Spring Boot, so expect an interviewer to pull hard on this thread. It is also the bridge to the Kafka module: the same problems, solved in-process first.

**How the interview opens:**

- You said your components are event-driven. Show me how that works.
- How do you publish an event only after the transaction commits?
- What happens to an exception thrown inside an @Async method?
- When would you move from Spring events to Kafka?

### Patterns you must be able to write

**Publishing and handling an in-process event**

```java
// 1. the event - a record, immutable, past tense name
public record OrderPlaced(String orderId, BigDecimal amount, Instant at) {}

// 2. publish
@Service
@RequiredArgsConstructor
public class OrderService {
    private final ApplicationEventPublisher events;

    @Transactional
    public void place(Order order) {
        repo.save(order);
        events.publishEvent(new OrderPlaced(order.getId(), order.getAmount(), Instant.now()));
    }
}

// 3. handle
@Component
public class InvoiceListener {
    @EventListener
    public void on(OrderPlaced e) { invoices.create(e.orderId()); }
}
```

> By default @EventListener is SYNCHRONOUS and runs in the publisher thread, inside the same transaction. That surprises people: publishEvent is a method call, not a queue.

**@TransactionalEventListener - the one that matters**

```java
@Component
public class EmailListener {

    // runs ONLY after the transaction commits successfully
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void on(OrderPlaced e) {
        mailer.sendConfirmation(e.orderId());
    }

    // and the compensating side
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void onFailure(OrderPlaced e) {
        metrics.increment("order.failed");
    }
}
```

> Without AFTER_COMMIT you email the customer, then the transaction rolls back, and you have confirmed an order that does not exist. This is the single most valuable annotation in the module. Note the trap: a plain @Transactional handler at AFTER_COMMIT will NOT persist, because the transaction is already finished - you need REQUIRES_NEW.

**Async handling with a real executor**

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override public Executor getAsyncExecutor() { return taskExecutor(); }

    // exceptions in void @Async methods are otherwise SILENTLY SWALLOWED
    @Override public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
            log.error("async failure in {}", method.getName(), ex);
    }
}

@Component
public class ReportListener {
    @Async("taskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void on(OrderPlaced e) { reports.rebuild(e.orderId()); }
}
```

> Three things candidates miss: @Async needs @EnableAsync; a void @Async method swallows exceptions unless you register the handler; and the async thread has NO transaction, NO security context and NO MDC unless you propagate them.

**The outbox - when losing an event is not acceptable**

```java
@Transactional
public void place(Order order) {
    repo.save(order);
    outbox.save(new OutboxEvent("OrderPlaced", toJson(order)));  // SAME transaction
}

@Scheduled(fixedDelay = 1000)
@Transactional
public void relay() {
    for (OutboxEvent e : outbox.findUnpublished(100)) {
        broker.publish(e.type(), e.payload());   // at-least-once
        e.markPublished();
    }
}
```

> In-process events die with the JVM. If the process crashes between commit and handler, the event is gone forever and nothing will ever retry it. The outbox makes the event as durable as the row. This is the answer to "what happens if the service crashes mid-handler".

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **How does publishEvent actually work?** | ApplicationEventMulticaster looks up listeners by event type and invokes them. By default synchronously, on the caller thread, inside the caller transaction. | So is it a queue? => no. It is an in-process observer pattern. Nothing is persisted and nothing is retried. |
| **@EventListener vs @TransactionalEventListener** | The first fires when publishEvent is called; the second binds to a transaction phase. | You email the customer from a plain @EventListener and the transaction then rolls back. What did the customer get? => a confirmation for an order that does not exist. |
| **The transaction phases** | BEFORE_COMMIT, AFTER_COMMIT (default), AFTER_ROLLBACK, AFTER_COMPLETION. | Your AFTER_COMMIT handler writes to the database and nothing is saved. Why? => the transaction is already committed, so there is no active one. Use @Transactional(propagation = REQUIRES_NEW). |
| **@Async requirements** | @EnableAsync plus a proxied call from another bean. | Why does calling an @Async method from within the same class run synchronously? => self-invocation. Same proxy problem as @Transactional. |
| **@Async exception handling** | A method returning void swallows exceptions unless you register an AsyncUncaughtExceptionHandler. A method returning CompletableFuture surfaces them on join. | Which return type should you prefer, and why? => CompletableFuture, so failures are visible to the caller. |
| **Context propagation** | The async thread has no transaction, no SecurityContext and no MDC by default. | How does your correlation id survive the hop? => a TaskDecorator that copies the MDC onto the worker thread. Without it your logs lose the trace id at the async boundary. |
| **Ordering listeners** | @Order or Ordered on the listener. | Should you rely on listener ordering? => no. Order-dependent handlers mean the events are really a workflow, and should be modelled as one. |
| **Conditional listeners** | @EventListener(condition = "#e.amount > 1000") using SpEL. | Why is that risky? => the logic is in a string, unchecked by the compiler and invisible to refactoring. |
| **Failure inside a synchronous listener** | It propagates to the publisher and rolls back the transaction. | Is that good or bad? => it depends. A failing email should not roll back an order. That is the argument for AFTER_COMMIT plus async. |
| **What happens if the JVM dies mid-handler?** | The event is lost. There is no persistence and no redelivery. | So how do you make it durable? => the outbox pattern, or a real broker. This is exactly the gap Kafka fills. |
| **Spring events vs Kafka** | In-process, synchronous by default, no durability, single JVM. Kafka is durable, replayable, cross-process, with consumer groups and per-key ordering. | When do you move? => when another service needs the event, when you need replay, or when losing an event is unacceptable. |
| **@Scheduled in a multi-instance deployment** | Every instance runs it. Three pods means three executions. | How do you fix it? => a distributed lock such as ShedLock, or move the job to a single leader. |
| **Backpressure in an async pipeline** | A bounded queue plus CallerRunsPolicy pushes back onto the producer. | What does an unbounded queue give you? => the appearance of working, until an OutOfMemoryError. |
| **Testing event-driven code** | ApplicationEvents in @RecordApplicationEvents, or a test listener capturing published events. | How do you test an AFTER_COMMIT listener? => it will not fire in a rolled-back test transaction. Use @Commit or TestTransaction, otherwise the test silently passes without ever running the handler. |
| **Event naming and payload** | Past tense, immutable, carry ids rather than whole entities. | Why not put the JPA entity in the event? => it may be detached or lazily initialised by the time the handler runs, and it couples the consumer to your schema. |

**Traps that bite:**

- Assuming @EventListener is asynchronous. It is not.
- Sending email or calling an external system from a plain @EventListener inside a transaction.
- A void @Async method with no exception handler - failures vanish silently.
- Publishing a JPA entity as the event payload, then hitting LazyInitializationException in the handler.
- @Scheduled running on every pod because nobody added a lock.

---

## §28 · MODULE 7 — JPA & Hibernate  *(phase 1, 11h)*

> The single richest source of "how does this actually work" questions at tier 1, because everyone claims it on a CV and few can explain the persistence context.

**How the interview opens:**

- What is the persistence context, and when does it flush?
- What is the N+1 problem and how do you detect it?
- You changed a field and never called save. Was it persisted?
- When does LazyInitializationException happen, and what is the right fix?

### Patterns you must be able to write

**The N+1 problem and three fixes**

```java
// N+1: one query for orders, then one per order for items
List<Order> orders = orderRepo.findAll();
orders.forEach(o -> o.getItems().size());     // N extra queries

// FIX 1 - JOIN FETCH (best for a bounded result set)
@Query("select distinct o from Order o join fetch o.items where o.status = :s")
List<Order> findWithItems(@Param("s") Status s);

// FIX 2 - entity graph, declarative
@EntityGraph(attributePaths = "items")
List<Order> findByStatus(Status status);

// FIX 3 - batch fetching, best when combined with pagination
@BatchSize(size = 50)   // on the collection
private List<OrderItem> items;
```

> Know all three and when each applies. JOIN FETCH plus pagination is a trap: Hibernate cannot paginate a fetched collection in SQL, so it silently loads everything into memory and pages in Java. @BatchSize is the correct answer there.

**Dirty checking - the thing that surprises people**

```java
@Transactional
public void rename(Long id, String name) {
    Order order = repo.findById(id).orElseThrow();
    order.setName(name);
    // no save() call - and it is still persisted
}
```

> Inside a transaction the entity is MANAGED. At commit, Hibernate compares it against the snapshot taken at load and issues an UPDATE. This is why an accidental setter inside a transaction writes to the database.

**Optimistic locking**

```java
@Entity
public class Order {
    @Id private Long id;
    @Version private Long version;      // Hibernate manages this
}

// UPDATE orders SET ..., version = 3 WHERE id = ? AND version = 2
// zero rows affected -> OptimisticLockException

@Retryable(retryFor = OptimisticLockingFailureException.class, maxAttempts = 3)
@Transactional
public void applyDiscount(Long id, BigDecimal pct) { ... }
```

> The version column turns a lost update into a detectable failure. Pair it with a retry, because the whole point is that a conflict is expected and recoverable.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **The persistence context** | A first-level cache and unit of work, scoped to the transaction. Entities inside it are managed. | Two findById calls for the same id in one transaction - how many queries? => one. The second is served from the persistence context. |
| **Entity states** | Transient, managed, detached, removed. | What is a detached entity, and what breaks with one? => loaded in a transaction that has ended. Lazy fields throw, and save() will merge rather than update. |
| **Dirty checking** | At flush, Hibernate diffs each managed entity against its load-time snapshot and generates UPDATEs. | You changed a field and never called save. Persisted? => yes, if inside a transaction. This is the most surprising JPA behaviour for newcomers. |
| **When does flush happen?** | Before a query that might read affected tables, and at commit. FlushMode.AUTO by default. | Why might your INSERT appear earlier than you expected? => a query triggered an automatic flush. |
| **save vs saveAndFlush** | save schedules; saveAndFlush forces SQL immediately. | When do you actually need saveAndFlush? => rarely. Usually when you need a generated id or a constraint violation before the transaction ends. |
| **The N+1 problem** | One query for parents, then one per parent for the association. | How do you DETECT it? => enable hibernate statistics or datasource-proxy, or count queries in an integration test. Do not rely on spotting it in code review. |
| **LazyInitializationException** | Touching a lazy association after the persistence context has closed. | What is the RIGHT fix? => fetch what you need inside the transaction with JOIN FETCH or an entity graph, or map to a DTO. Not open-in-view. |
| **open-in-view** | Spring Boot keeps the persistence context open for the whole request. On by default. | Why is it harmful? => it holds a database connection for the entire request including view rendering, hides N+1 behind lazy loads, and exhausts the pool under load. Set spring.jpa.open-in-view=false and fix what breaks. |
| **FetchType.LAZY vs EAGER** | Lazy by default for collections, eager for @ManyToOne and @OneToOne. | Why is eager on @ManyToOne a problem? => every load drags in the parent graph, and two eager collections produce a cartesian product. |
| **Cascade types** | PERSIST, MERGE, REMOVE, ALL, plus orphanRemoval. | Why is CascadeType.ALL on @ManyToOne dangerous? => removing a child can delete the shared parent. |
| **orphanRemoval vs CascadeType.REMOVE** | Orphan removal deletes a child removed from the collection; cascade remove deletes children when the parent is deleted. | Which one deletes on collection.remove(child)? => orphanRemoval. |
| **@OneToMany owning side** | The side with the foreign key owns the relationship; use mappedBy on the inverse side. | You added to the collection and nothing persisted. Why? => you updated the inverse side only. Set both directions, or make the child set the parent. |
| **Optimistic locking with @Version** | Version compared in the WHERE clause; zero rows affected means a conflict. | Two users edit the same row - walk me through it. => both read version 2, first commits and bumps to 3, second updates WHERE version = 2, affects zero rows, gets OptimisticLockException, retries. |
| **Pessimistic locking** | @Lock(LockModeType.PESSIMISTIC_WRITE) issues SELECT FOR UPDATE. | When over optimistic? => high contention, where retrying would thrash. |
| **Entity equals/hashCode** | Generated ids are null before persist, so identity changes after save. | Why does using the id in hashCode break a HashSet? => the object was added while transient with a null id, then the id changed. Use a natural key or a UUID assigned in the constructor. |
| **DTO projections** | Select only the fields you need, via a constructor expression or an interface projection. | Why prefer this for read paths? => no persistence context overhead, no lazy loading surprises, and far less data over the wire. |
| **Second-level cache** | Shared across transactions, opt-in per entity, needs a provider. | When is it a bad idea? => write-heavy entities, or a clustered deployment where invalidation is now a distributed problem. |
| **@Transactional(readOnly = true)** | Skips dirty-check snapshots and may route to a replica. | Is it enforced? => no. It is an optimisation hint, not a guarantee. |
| **Spring Data derived queries** | Method names parsed into queries: findByStatusAndCreatedAtAfter. | When do you stop using them? => once the name gets unreadable. Switch to @Query or a Specification. |

**Traps that bite:**

- open-in-view left on, hiding N+1 and holding connections for the whole request.
- JOIN FETCH combined with pagination - silently loads everything into memory.
- Bidirectional relationship updated on one side only.
- Entity id used in hashCode before it is generated.
- CascadeType.ALL applied without thinking about deletes.

---

## §29 · MODULE 8 — PostgreSQL  *(phase 1, 9h)*

> You are in DBeaver against upstream data daily, so this is claimed expertise and interviewers will test it.

**How the interview opens:**

- Read me this EXPLAIN plan.
- This query got slow after the table grew. Diagnose it.
- Why is your index not being used?
- Give me a lost update at READ COMMITTED.

### Patterns you must be able to write

**Reading a plan and fixing the index**

```java
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE status = 'PENDING' AND created_at > now() - interval '7 days';

-- Seq Scan on orders  (cost=0.00..18234 rows=100 width=64)
--   (actual time=812ms rows=94512 loops=1)      <-- estimate 100, actual 94512

-- equality column FIRST, range column SECOND
CREATE INDEX CONCURRENTLY idx_orders_status_created
    ON orders (status, created_at);

ANALYZE orders;   -- refresh the statistics the planner uses
```

> A large gap between estimated and actual rows means stale statistics, not a missing index. CONCURRENTLY avoids taking an exclusive lock on a live table - forgetting it is how people cause an outage.

**Queue in a table, done correctly**

```java
SELECT * FROM jobs
 WHERE status = 'READY'
 ORDER BY created_at
 LIMIT 10
   FOR UPDATE SKIP LOCKED;
```

> SKIP LOCKED lets N workers pull disjoint batches without blocking each other. Without it every worker queues behind the first, and your throughput is one worker regardless of how many you deploy.

**Zero-downtime column change**

```java
-- expand
ALTER TABLE orders ADD COLUMN total_cents BIGINT;          -- nullable, instant
-- migrate: backfill in batches, never one statement
UPDATE orders SET total_cents = (total * 100)::bigint
 WHERE id BETWEEN ? AND ? AND total_cents IS NULL;
-- dual-write from the app, switch reads, then
-- contract
ALTER TABLE orders DROP COLUMN total;
```

> Expand-migrate-contract. A single blocking ALTER on a 500M-row table takes an exclusive lock and stops the application. This is also why you cannot roll back a deploy that dropped a column.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **B-tree index** | Sorted and balanced. Supports equality, ranges, ordering, and the leftmost prefix of a composite. | Why does index column order matter? => leftmost-prefix. An index on (a,b) serves a and a+b, never b alone. |
| **Composite index design** | Equality columns first, then the range column. | You have (status, created_at). Does a query on created_at alone use it? => not as a normal index scan. |
| **Covering / index-only scan** | All required columns are in the index and the page is visible in the visibility map. | Why does VACUUM matter for index-only scans? => a stale visibility map forces a heap fetch and you lose the benefit. |
| **EXPLAIN ANALYZE** | Actually runs the query. Compare estimated versus actual rows, and look at the node types. | Estimate says 10, actual is 94,512. What do you do? => ANALYZE, raise the statistics target, or rewrite a predicate the planner cannot estimate. |
| **When a sequential scan is correct** | Low selectivity or a small table. Reading 40% of rows via an index is slower than a scan. | So why is an index sometimes slower? => random heap access plus index traversal beats a sequential read only when few rows match. |
| **MVCC** | Every write creates a new row version; readers never block writers and writers never block readers. | Where do dead tuples go? => VACUUM reclaims them. If it cannot keep up you get bloat and the table grows without more data. |
| **Isolation levels** | READ COMMITTED is the default; REPEATABLE READ gives a stable snapshot; SERIALIZABLE uses SSI and can abort transactions. | Give me a lost update at READ COMMITTED. => two transactions read balance 100, both compute 90, both write. One update is silently gone. Fix with an atomic UPDATE, SELECT FOR UPDATE, or a version column. |
| **SELECT FOR UPDATE** | Row-level pessimistic lock held until the transaction ends. | What is SKIP LOCKED for? => queue workers pulling disjoint batches without blocking each other. |
| **Deadlocks** | Two transactions acquiring the same rows in opposite order. Postgres detects and kills one. | How do you find and fix them? => the server log names both statements. Fix by ordering access consistently and shortening transactions. |
| **Connection pooling** | HikariCP. Pool size around cores x 2, not hundreds. | The pool exhausted. Diagnose. => long transactions, leaked connections, N+1, open-in-view, or missing statement timeouts. A bigger pool usually makes it worse. |
| **Partial and expression indexes** | CREATE INDEX ... WHERE status = 'ACTIVE', or on lower(email). | Why does an index on email not help WHERE lower(email) = ? => the expression does not match the index. Index the expression. |
| **JSONB** | Flexible documents with GIN indexing. | When does it become a mistake? => when you start querying and joining inside it. That is a schema asking to exist. |
| **Partitioning** | Splitting one table by range or list within one database. | How is it different from sharding? => partitioning is one machine; sharding is many. Partitioning helps pruning and bulk deletes. |
| **CTEs and materialisation** | Since Postgres 12 CTEs inline by default; MATERIALIZED forces the old behaviour. | Why did an old CTE query suddenly get faster on upgrade? => it stopped being an optimisation fence. |
| **Transaction length** | Long transactions block VACUUM and hold connections. | Why is a transaction spanning an HTTP call to a third party a bug? => you hold a database connection and an MVCC snapshot for the duration of someone else network. |
| **UPSERT** | INSERT ... ON CONFLICT (key) DO UPDATE. | Why is that better than check-then-insert? => check-then-insert is a race. ON CONFLICT is atomic. |

**Traps that bite:**

- Building an index without CONCURRENTLY on a live table.
- Wrapping a column in a function and losing the index.
- A blocking ALTER TABLE on a large table during business hours.
- Assuming a bigger connection pool fixes exhaustion.
- Long transactions that hold snapshots and block VACUUM.

---

## §30 · MODULE 9 — REST, API design & auth  *(phase 2, 7h)*

**How the interview opens:**

- Design the API for this feature.
- Make this POST endpoint idempotent.
- How do you revoke a JWT?
- Your client retried and the customer was charged twice. Fix it.

### Patterns you must be able to write

**Idempotent POST**

```java
@PostMapping("/payments")
public ResponseEntity<PaymentResponse> pay(
        @RequestHeader("Idempotency-Key") String key,
        @Valid @RequestBody PaymentRequest req) {

    return idempotency.findByKey(key)
        .map(prev -> ResponseEntity.ok(prev.response()))     // replay the stored result
        .orElseGet(() -> {
            PaymentResponse res = payments.charge(req);
            idempotency.save(key, res);   // UNIQUE constraint on key
            return ResponseEntity.status(CREATED).body(res);
        });
}
```

> The unique constraint is what makes this correct under CONCURRENT retries - two simultaneous requests race, one insert wins, the other gets a constraint violation and can then read the winner result. A plain if-absent check is a race.

**Consistent error responses**

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail onValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(BAD_REQUEST);
        pd.setTitle("Validation failed");
        pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
                .collect(toMap(FieldError::getField, FieldError::getDefaultMessage)));
        return pd;
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    ProblemDetail onConflict(Exception ex) {
        return ProblemDetail.forStatusAndDetail(CONFLICT, "Resource was modified, retry");
    }
}
```

> One error contract for the whole API. ProblemDetail (RFC 7807) is built into Spring 6 and is the answer if asked how you standardise errors.

**Cursor pagination**

```java
// offset: drifts when rows are inserted, and gets slower page by page
GET /orders?page=5000&size=20

// cursor: stable and O(log n) regardless of depth
GET /orders?after=2026-08-27T10:00:00Z_01H9X&size=20

SELECT * FROM orders
 WHERE (created_at, id) < (:afterTs, :afterId)   -- tuple comparison
 ORDER BY created_at DESC, id DESC
 LIMIT 20;
```

> Offset 100,000 makes the database count and discard 100,000 rows. The tuple comparison with a tiebreaker id is what makes the cursor deterministic.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Idempotency** | The same request applied twice has the same effect as once. PUT and DELETE yes by definition, POST no. | How do you make POST idempotent? => a client-supplied Idempotency-Key with a unique constraint and a stored response, with a TTL. |
| **Status codes** | 201 with Location, 202 for accepted-async, 400 malformed, 422 semantically invalid, 409 conflict, 429 rate limited. | What do you return when processing is asynchronous? => 202 plus a status URL the client can poll. |
| **Pagination** | Offset is simple but drifts and degrades; cursor is stable and fast. | Page 10,000 with offset - what is wrong? => the database materialises and discards everything before it. |
| **Versioning** | URL path, custom header, or content negotiation. | How do you retire v1? => announce, measure usage per client, deprecation headers, then sunset. The hard part is organisational. |
| **PUT vs PATCH** | Full replacement versus partial update. | Why is PATCH harder to get right? => merge semantics, null meaning "clear" versus "unchanged", and it is not naturally idempotent. |
| **OAuth2 flows** | Authorization code with PKCE for user-facing apps; client credentials for service-to-service. | Why is the implicit flow deprecated? => the token is exposed in the URL fragment and there is no client authentication. |
| **JWT structure** | header.payload.signature, base64url. Signed, not encrypted - anyone can read the payload. | So what must never go in a JWT? => anything secret. It is readable by the client. |
| **JWT revocation** | You cannot revoke a stateless token before it expires. | So how do you handle logout? => short-lived access tokens plus a refresh token you can revoke, and a denylist of token ids for emergencies. |
| **Access vs refresh tokens** | Short-lived credential versus long-lived means to obtain a new one. | Where do you store them in a browser? => refresh token in an httpOnly SameSite cookie; keeping either in localStorage exposes it to XSS. |
| **CORS** | Browser-enforced preflight based on origin. | Does it protect your API? => no. It restricts browsers only. curl ignores it entirely. |
| **Rate limiting placement** | At the gateway, before your service does work. | Per user or per IP? => both, at different tiers. Per IP alone punishes everyone behind a corporate NAT. |
| **Retries and backoff** | Exponential with jitter, capped, only for idempotent operations. | What does retrying without jitter cause? => a thundering herd that keeps the downstream down. |
| **Timeouts** | Every remote call needs one, and the budget must shrink down the chain. | Downstream p99 is 3s and your timeout is 5s. What happens under load? => your threads all block on the slow dependency and you fall over with it. |
| **Validation** | Bean Validation annotations plus @Valid, handled centrally in @RestControllerAdvice. | Why validate in the DTO rather than the entity? => the API contract and the persistence model change for different reasons. |
| **API contract testing** | OpenAPI spec generated or hand-written, plus contract tests. | How do you stop a breaking change reaching production? => compare the generated spec against the previous version in CI. |

**Traps that bite:**

- A check-then-insert idempotency implementation, which races under concurrent retries.
- Returning 200 for everything, including errors.
- Leaking stack traces in error responses.
- Assuming CORS is a security control.
- No timeout on an outbound call.

---

## §31 · MODULE 10 — Kafka  *(phase 2, 13h)*

> NEW KNOWLEDGE for you. Hands-on artefact required: Docker Compose with Kafka, a Spring Boot producer and consumer, a topic with 3 partitions, a consumer group of 2 - then KILL ONE CONSUMER and watch the rebalance, and REPLAY from an earlier offset. Reading about Kafka does not survive the follow-up column. Your custom Spring event components are the bridge: same problems, in-process.

**How the interview opens:**

- Where does Kafka actually guarantee ordering?
- Your consumer dies halfway through a batch. What happens?
- Kafka or RabbitMQ or SQS for this? Defend it.
- You built event-driven components yourself. Why not Kafka?

### Patterns you must be able to write

**Consumer with manual acknowledgement and a DLQ**

```java
@KafkaListener(topics = "orders", groupId = "invoicing",
               containerFactory = "manualAckFactory")
public void onOrder(ConsumerRecord<String, OrderEvent> rec, Acknowledgment ack) {
    try {
        // MUST be idempotent - at-least-once means this can run twice
        invoices.createIfAbsent(rec.value().orderId(), rec.value());
        ack.acknowledge();                 // commit only after success
    } catch (TransientException e) {
        throw e;                           // let the error handler retry
    }
}

@Bean
DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
    var recoverer = new DeadLetterPublishingRecoverer(template);   // -> orders.DLT
    return new DefaultErrorHandler(recoverer,
            new ExponentialBackOffWithMaxRetries(3));
}
```

> Commit AFTER processing, not before - that is the difference between at-least-once and at-most-once. The DLQ stops one poison message blocking the whole partition forever.

**Partition key controls ordering**

```java
// ordering is guaranteed PER PARTITION only
kafkaTemplate.send("orders", order.customerId(), event);
//                            ^^^^^^^^^^^^^^^^^ key -> partition

// all events for one customer land on one partition, so they stay ordered
// events for DIFFERENT customers may be processed out of order - usually fine
```

> If you need per-entity ordering, the entity id is the key. And note the trap: adding partitions later changes the hash mapping, so existing keys move and ordering breaks across the boundary.

**Idempotent producer and transactions**

```java
spring:
  kafka:
    producer:
      acks: all                        # wait for min.insync.replicas
      enable-idempotence: true         # no duplicates on producer retry
      transaction-id-prefix: tx-       # enables exactly-once within Kafka
    consumer:
      isolation-level: read_committed
      enable-auto-commit: false        # you commit, not a timer
      max-poll-records: 100
```

> acks=all plus min.insync.replicas=2 is the durability setting for anything financial. Auto-commit is the default and it is wrong for almost everything - it commits on a timer regardless of whether you processed the record.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Topic, partition, offset** | A topic is split into partitions; each partition is an ordered append-only log; consumers track an offset per partition. | Why partitions at all? => parallelism. Consumer parallelism is capped at the partition count. |
| **Ordering guarantee** | Within a partition only. Never across a topic. | So how do you get per-user ordering? => partition key = user id. What breaks if you add partitions later? => the hash mapping changes and existing keys move. |
| **Consumer groups** | Each partition is assigned to exactly one consumer within a group. Different groups each get everything. | 3 partitions and 5 consumers in one group? => two sit idle. Adding consumers past the partition count buys nothing. |
| **Rebalancing** | Any membership change reassigns partitions; processing pauses during it. | How do you avoid a rebalance storm? => raise max.poll.interval.ms if processing is slow, tune session timeout and heartbeats, and use the cooperative-sticky assignor. |
| **Consumer dies mid-batch** | Offsets were not committed, so records are redelivered from the last commit. | So your consumer must be what? => idempotent. Say this before being asked. |
| **Delivery semantics** | At-most-once commits first. At-least-once processes first - the default choice. Exactly-once needs the idempotent producer plus transactions. | Is exactly-once real? => within Kafka, yes. End to end, no - the moment you write to an external system you need idempotency there. |
| **auto-commit** | Commits offsets on a timer whether or not you finished processing. | Why is enable.auto.commit=true dangerous? => a crash after the timer fires but before processing completes loses the record silently. |
| **Retention vs compaction** | Retention deletes by time or size. Compaction keeps the latest value per key forever. | When do you compact? => changelog and state topics, where you want the current value of every key. |
| **Poison message** | A record that always fails. Without handling it blocks its partition indefinitely. | Fix? => retry with backoff, then publish to a DLQ so the offset advances. Then a process to inspect and replay. |
| **Consumer lag** | Log end offset minus committed offset. | Lag is growing. Name four causes. => slow processing, too few partitions, frequent rebalances, a slow downstream. Note CPU may look fine throughout. |
| **Kafka vs RabbitMQ vs SQS** | Kafka is a durable replayable log with per-key ordering and consumer groups. RabbitMQ is a broker with rich routing and per-message ack. SQS is a managed queue with minimal operations. | Pick one for your event-driven components and defend it. => this is the question your background sets up. |
| **acks and min.insync.replicas** | acks=0 fire and forget, acks=1 leader only, acks=all waits for the in-sync set. | Which for money? => acks=all with min.insync.replicas=2, and accept the latency. |
| **Schema evolution** | A schema registry with backward and forward compatibility rules. | You add a required field. Who breaks? => existing consumers that do not know it. Add optional fields with defaults instead. |
| **Rebalance listeners** | ConsumerRebalanceListener lets you commit before losing a partition. | Why does it matter? => without it, in-flight work on a revoked partition is redone by the new owner. |
| **Kafka Streams vs a plain consumer** | Streams gives stateful processing, joins and windowing with a changelog-backed store. | When is a plain consumer enough? => stateless transformation and forwarding, which is most cases. |
| **From Spring events to Kafka** | Spring events are in-process, synchronous by default, and lost on crash. Kafka is durable, replayable and cross-service. | When do you migrate? => when another service needs the event, when you need replay, or when losing one is unacceptable. The outbox is the migration path. |

**Traps that bite:**

- Leaving auto-commit on.
- Assuming topic-wide ordering.
- No DLQ, so one bad record halts a partition forever.
- Adding partitions to a keyed topic without thinking about ordering.
- A non-idempotent consumer under at-least-once delivery.

---

## §32 · MODULE 11 — Microservices & resilience  *(phase 2, 9h)*

> NEW KNOWLEDGE for you - you run a monolith. That is an ASSET here, not a gap: most candidates parrot microservices without ever having felt the pain. Being able to argue both sides is the strongest position in the room.

**How the interview opens:**

- Where would you split your monolith first, and why have you not?
- A downstream service is slow but not failing. What protects you?
- How do you keep a transaction consistent across two services?
- Argue against microservices.

### Patterns you must be able to write

**Circuit breaker, bulkhead, timeout and fallback**

```java
@CircuitBreaker(name = "pricing", fallbackMethod = "cachedPrice")
@Bulkhead(name = "pricing")            // isolates the thread pool
@TimeLimiter(name = "pricing")
@Retry(name = "pricing")               // ONLY because this call is idempotent
public CompletableFuture<Price> price(String sku) {
    return CompletableFuture.supplyAsync(() -> pricingClient.get(sku));
}

private CompletableFuture<Price> cachedPrice(String sku, Throwable t) {
    return CompletableFuture.completedFuture(cache.lastKnown(sku));
}

# resilience4j.circuitbreaker.instances.pricing:
#   failureRateThreshold: 50
#   waitDurationInOpenState: 10s
#   permittedNumberOfCallsInHalfOpenState: 3
```

> The order matters: Retry wraps CircuitBreaker wraps TimeLimiter wraps Bulkhead. A breaker without a timeout is useless, because a hang never counts as a failure - it just consumes threads.

**Strangler fig - how you actually split**

```java
// 1. put a facade in front of the monolith module
interface PricingGateway { Price price(String sku); }

// 2. implementation still calls in-process
class InProcessPricing implements PricingGateway { ... }

// 3. new implementation calls the extracted service
class RemotePricing implements PricingGateway { ... }

// 4. route by feature flag, percentage first, and compare outputs
@Bean PricingGateway pricing(FeatureFlags flags) {
    return flags.enabled("pricing.remote") ? remote : inProcess;
}

// 5. move the DATA last, once the seam has held for weeks
```

> The interface comes first, the network call second, the data migration last. Teams that move the data first end up with a distributed monolith and no way back.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **When NOT to use microservices** | Small team, shared data model, unclear boundaries. They buy independent deploy and scale; they cost you a distributed system. | Argue against microservices. => answering this well is worth more than any architecture diagram. Distributed transactions, network partitions, versioned contracts, and debugging across five services. |
| **Splitting a monolith** | Find a bounded context with few writes crossing the seam. Strangler-fig behind a facade. Move data last. | Which seam would you split first in YOUR system, and why have you not? => have a real answer ready. |
| **Distributed monolith** | Services that must be deployed together. All the cost, none of the benefit. | How do you spot one? => a change requires coordinated releases, or one service being down takes all of them down. |
| **Service discovery** | A registry, or Kubernetes Services plus DNS. | How does a caller find a healthy instance? => the Service only routes to pods passing readiness. That is discovery and health in one. |
| **API gateway** | A single edge for auth, rate limiting, routing and aggregation. | The risk? => it accumulates business logic and becomes a deployment bottleneck. |
| **Circuit breaker** | Closed, then open above a failure threshold, then half-open to probe. | A downstream is SLOW but not failing. What protects you? => a timeout first, then a bulkhead so it cannot exhaust your threads, then the breaker. A breaker alone never trips on slowness. |
| **Bulkhead** | Isolate a thread pool or connection pool per dependency. | Why is a timeout not enough? => without isolation, enough slow calls still consume every request thread before any of them time out. |
| **Retries** | Exponential backoff with jitter, only for idempotent operations. | You retried a payment. Now what? => a double charge, unless the endpoint takes an idempotency key. |
| **Saga** | Local transactions plus compensating actions. Choreography (events) or orchestration (a coordinator). | Why not 2PC? => it holds locks across services for the duration of network calls and the coordinator is a single point of failure. |
| **Compensating transaction** | A business-level undo, such as a refund - not a database rollback. | What if the step cannot be undone, like a sent email? => order the workflow so irreversible steps come last. |
| **Outbox** | Write the row and the event in one local transaction; a relay publishes. | Why not write to the DB then publish? => the dual-write problem. If the publish fails, the systems silently diverge. |
| **Distributed tracing** | A trace id propagated in headers, with a span per operation. | How does the id survive an async hop or a Kafka message? => a TaskDecorator copying the MDC, and trace headers on the Kafka record. |
| **Config and secrets** | A config server, or Kubernetes ConfigMaps and Secrets. | How do you rotate a secret with zero downtime? => mounted files can be re-read; env vars require a restart. Design for the first. |
| **Data per service** | Each service owns its store. No cross-service joins. | So how do you build a report spanning three services? => CQRS with a read model, an event-driven projection, or a warehouse. Not a shared database. |
| **Versioning service contracts** | Additive changes only; never remove a field consumers still read. | How do you know who still reads it? => you instrument the field, or you cannot safely remove anything. |
| **Idempotency across services** | Keys plus a dedup store, at every consumer. | Why is this non-negotiable? => at-least-once delivery means every handler runs twice eventually. |

**Traps that bite:**

- A circuit breaker with no timeout - slowness never trips it.
- Retrying non-idempotent operations.
- Splitting the data before the interface.
- A shared database between services, which is a distributed monolith.
- No distributed tracing, so a cross-service latency problem is unfindable.

---

## §33 · MODULE 12 — Docker & Kubernetes  *(phase 1, 11h)*

> YOUR PRODUCTION EDGE. You run frontend and backend pods. Most candidates recite Kubernetes; you have been paged by it. Lead with a real incident.

**How the interview opens:**

- Your Java pod is OOMKilled. Walk me through it.
- What breaks if you swap liveness and readiness?
- Walk me through debugging CrashLoopBackOff.
- How do you deploy with genuinely zero downtime?

### Patterns you must be able to write

**Multi-stage build with a container-aware JVM**

```java
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline        # cached layer - deps before source
COPY src ./src
RUN mvn -q clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app   # do not run as root
USER app
COPY --from=build /app/target/*.jar app.jar
# the JVM must be told about the container limit
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-jar","/app.jar"]
```

> Dependencies before source is what makes the layer cache work. MaxRAMPercentage is what stops the JVM sizing its heap from the NODE memory and getting OOMKilled.

**The deployment spec that actually gives zero downtime**

```java
spec:
  strategy:
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  template:
    spec:
      terminationGracePeriodSeconds: 45
      containers:
      - name: api
        resources:
          requests: { memory: "512Mi", cpu: "250m" }   # scheduler reserves
          limits:   { memory: "1Gi" }                  # hard cap; NO cpu limit
        readinessProbe:                                 # gates traffic
          httpGet: { path: /actuator/health/readiness, port: 8080 }
          periodSeconds: 5
        livenessProbe:                                  # RESTARTS the container
          httpGet: { path: /actuator/health/liveness, port: 8080 }
          periodSeconds: 10
          failureThreshold: 3
        startupProbe:                                   # slow boot protection
          httpGet: { path: /actuator/health/liveness, port: 8080 }
          failureThreshold: 30
        lifecycle:
          preStop: { exec: { command: ["sh","-c","sleep 10"] } }
```

> The preStop sleep is the piece almost everyone omits: endpoint removal and SIGTERM race, so without it the Service still routes to a pod that has started shutting down. Note also no CPU limit - requests for scheduling, limits only on memory, to avoid throttling.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Image layers** | Copy-on-write layers; the cache invalidates from the first changed layer down. | How do you order a Dockerfile for cache hits? => dependencies before source, since source changes every build. |
| **Multi-stage builds** | Build in a full image, copy only the artefact into a slim runtime. | Why does this matter beyond size? => attack surface. No compiler, no build tools, no shell in the shipped image. |
| **Pod vs container** | A pod is the scheduling unit; containers in it share a network namespace and volumes. | When do two containers belong in one pod? => a sidecar tightly coupled in lifecycle, like a log shipper or a proxy. |
| **Deployment and ReplicaSet** | You declare desired state; a controller reconciles continuously. | You deleted a pod. What happens? => the ReplicaSet creates a replacement. Deleting pods is not how you scale down. |
| **Service and Ingress** | A Service is a stable virtual IP plus a label selector; Ingress is L7 routing into the cluster. | Walk me from a browser to a pod. => DNS, ingress controller, Service, kube-proxy or IPVS rules, pod IP. |
| **Liveness vs readiness vs startup** | Liveness RESTARTS. Readiness REMOVES FROM ENDPOINTS. Startup delays liveness for slow boots. | What breaks if you swap them? => a pod that is briefly busy or waiting on a dependency gets killed instead of temporarily drained. Under load that becomes a cluster-wide restart loop. |
| **What liveness must not check** | Downstream dependencies. | Why? => if the database is slow, every pod fails liveness and restarts simultaneously, turning a degradation into an outage. |
| **Requests vs limits** | Requests are reserved by the scheduler; limits are the hard cap. | Set only limits - what happens? => requests default to limits, bin-packing gets worse and you waste capacity. |
| **OOMKilled** | The container exceeded its memory limit; the kernel kills it. Exit code 137. | Your Java pod OOMKills. What do you change? => set MaxRAMPercentage so the heap respects the container, account for metaspace, thread stacks and direct buffers on top of heap, then take a heap dump and actually find the leak. |
| **CPU throttling** | A CPU limit throttles via CFS quota rather than killing. | Latency spikes but memory is fine. What do you check? => container_cpu_cfs_throttled_seconds. Many teams remove CPU limits entirely and keep requests. |
| **CrashLoopBackOff** | The container keeps exiting; restart delay grows exponentially. | Walk me through debugging it. => kubectl describe pod for events (image pull, mount, probe failures), then logs --previous for the last crash, then the exit code, then check config and secrets exist. |
| **Rolling update** | maxSurge and maxUnavailable control the pace; readiness gates progress. | How do you get TRULY zero downtime? => readiness plus graceful shutdown plus a preStop drain plus backward-compatible schema. Missing any one drops requests. |
| **HPA** | Scales replica count on CPU, memory or a custom metric. | You added HPA and it did not help. Why? => the bottleneck was the database, a connection pool or a single Kafka partition. More pods made it worse. |
| **ConfigMap vs Secret** | Non-sensitive config versus base64-encoded values, which are NOT encrypted at rest by default. | How do you rotate without a restart? => mounted files update after a delay and can be re-read; env vars cannot change in a running process. |
| **StatefulSet** | Stable network identity and per-pod persistent storage, ordered rollout. | Why not run Postgres in a Deployment? => no stable identity, no ordered startup, and volumes can attach to the wrong replica. |
| **Resource QoS classes** | Guaranteed, Burstable, BestEffort - decided by your requests and limits. | Which pods get evicted first under node pressure? => BestEffort, then Burstable. Set requests if you want to survive. |
| **Init containers** | Run to completion before app containers start. | A legitimate use? => waiting for a migration to complete, or fetching a config bundle. |

**Traps that bite:**

- A JVM with no MaxRAMPercentage sizing its heap from node memory.
- Liveness probes that call the database.
- No preStop hook, so rolling updates drop in-flight requests.
- CPU limits causing invisible throttling.
- Treating Secrets as encrypted. They are base64 by default.

---

## §34 · MODULE 13 — Observability, testing & CI/CD  *(phase 2, 6h)*

**How the interview opens:**

- How do you know this is broken before a customer tells you?
- How do you test a Kafka consumer?
- Why not H2 for integration tests?
- How do you roll back a bad deploy that included a schema change?

### Patterns you must be able to write

**Testcontainers - the real database in a test**

```java
@SpringBootTest
@Testcontainers
class OrderRepositoryTest {

    @Container
    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
    }
}
```

> The container is static, so it starts once for the whole class rather than per test. H2 accepts SQL Postgres rejects and lacks JSONB, window function edge cases and real locking behaviour - so H2-green, production-red is a familiar failure.

**Correlation id that survives an async hop**

```java
@Bean
public TaskDecorator mdcDecorator() {
    return runnable -> {
        Map<String, String> ctx = MDC.getCopyOfContextMap();   // captured on the caller
        return () -> {
            if (ctx != null) MDC.setContextMap(ctx);
            try { runnable.run(); } finally { MDC.clear(); }
        };
    };
}
// then: executor.setTaskDecorator(mdcDecorator());
```

> Without this, every log line written on an @Async thread loses the trace id, and a cross-thread latency problem becomes unfindable. The finally clear matters because the thread is pooled.

### Question → spine → follow-up

| Question | The answer's spine | The follow-up |
|---|---|---|
| **Logs vs metrics vs traces** | Discrete events, aggregated numbers, and the causal path of one request. | App is slow and you have all three. What first? => metrics to localise (which service, which endpoint, p99 vs p50), then traces for where the time went, then logs for the specific request. Cheapest to most expensive. |
| **Structured logging** | JSON with consistent fields, including a correlation id. | How does the id survive an async hop or a Kafka message? => a TaskDecorator copying MDC, and trace headers on the record. |
| **What to alert on** | User-visible symptoms and SLO burn rate. | Why is CPU above 80 percent a bad alert? => it is a cause, not a symptom, and it is often completely fine. Alerts that fire without user impact get ignored. |
| **Cardinality** | The number of distinct label combinations on a metric. | Someone adds user_id as a Prometheus label. What happens? => one time series per user; memory and index blow up and the metrics system falls over. |
| **p50 vs p99** | Median versus tail. Averages hide the tail entirely. | Why does p99 matter more? => on a page making 10 calls, a 1 percent tail affects roughly 10 percent of page loads. |
| **Test pyramid** | Many fast unit tests, fewer integration, very few end-to-end. | Where do you test a repository query? => an integration test with a real database, via Testcontainers. |
| **Mockito** | Mock collaborators, never the class under test. | When is mocking a smell? => mocking value objects, or asserting on interactions so specifically that any refactor breaks the test. |
| **Testcontainers vs H2** | A real Postgres in Docker versus an in-memory imitation. | Why not H2? => dialect drift. H2 accepts SQL Postgres rejects, and lacks JSONB and real lock semantics, so tests pass and production fails. |
| **Testing a Kafka consumer** | Testcontainers Kafka or an embedded broker for the wiring; call the handler directly for the logic. | What must you assert beyond the happy path? => that processing the same record twice is safe, since at-least-once guarantees it will happen. |
| **Testing @Transactional and events** | Test transactions roll back by default, so AFTER_COMMIT listeners never fire. | So what happens to that test? => it silently passes without executing the handler. Use @Commit or TestTransaction. |
| **Flaky tests** | Time, ordering, shared state, real network calls. | What do they cost? => the team stops trusting the suite, then stops reading failures, then ships the real bug. |
| **CI pipeline stages** | Compile, unit, integration, build image, scan, deploy to staging, smoke, promote. | What should block a merge? => tests, coverage direction, and a dependency vulnerability scan. |
| **Blue-green vs canary** | Two full environments with a switch, versus a percentage rollout. | Which for a schema change? => neither on its own. Schema needs expand-migrate-contract regardless of deployment strategy. |
| **Rollback** | Redeploy the previous image. Schema changes must be backward compatible for that to work. | You dropped a column and need to roll back. Now what? => you cannot. Which is why contract is a separate later release from expand. |
| **Feature flags** | Decouple deploy from release; roll out by percentage. | What is the hidden cost? => every flag is a branch in production, and stale flags accumulate into untested combinations. |

**Traps that bite:**

- Alerting on causes instead of symptoms.
- High-cardinality metric labels.
- H2 in tests, Postgres in production.
- Tests that never exercise duplicate message delivery.
- Dropping a column in the same release that stops writing it.

---

## TECH TRIGGERS

Drill this the way you drill the DSA pattern tables.

| You hear | Reach for |
|---|---|
| "our consumers keep falling behind" | **Consumer lag · partition count · per-message processing time · rebalance frequency** |
| "the pod restarts under load" | **Memory limit vs JVM heap · OOMKilled · MaxRAMPercentage · liveness probe too aggressive** |
| "it is slow but only sometimes" | **GC pause · CPU throttling · connection-pool wait · p99 vs mean** |
| "the query got slow after the table grew" | **Index column order · EXPLAIN · seq scan · stale statistics · bloat** |
| "the retry made it worse" | **Thundering herd · no jitter · no circuit breaker · non-idempotent operation** |
| "the same request was processed twice" | **At-least-once delivery · missing idempotency key · consumer died before commit** |
| "it works on my machine" | **Image layers · env config · Testcontainers vs H2** |
| "two users overwrote each other" | **Lost update · optimistic locking with @Version · isolation level** |
| "the transaction did not roll back" | **Self-invocation · checked exception · caught and swallowed · wrong propagation** |
| "we cannot deploy without downtime" | **Readiness probe · graceful shutdown · preStop · backward-compatible schema** |
| "the whole app went down because one service was slow" | **Circuit breaker · bulkhead · timeout budget** |
| "we need to add a new consumer of this data" | **Log-based stream over a queue · replay · compaction** |
# PART V — HOW THIS SHEET MAPS TO THE 154 DAYS

| Phase | Days | What you work in this sheet |
|---|---|---|
| **1 · JPM / Amex / Expedia** | 1–42 | DSA **§1–§9 block A + block B** · SD **§18, §19, sessions 1–6** · LLD **§21A + parking/elevator/vending/ATM/library** · **Tech modules 1–5, 7, 9** — the heaviest tech load in the plan |
| **2 · Amazon / Microsoft / Adobe** | 43–91 | DSA **§10–§15 block A + block B** · SD **sessions 7–13 + all six cross-question categories** · LLD **booking, Splitwise, hybrids ×3, LP stories** · **Tech modules 6, 8, 10** |
| **3 · Google / Uber** | 92–154 | **Every block C in Part I** · SD **sessions 14–22** · LLD **machine-coding drills and the Uber simulation** · Tech: maintenance only |

**The reading order inside any section is always the same:** block A first (drill the disguises), then block B (solve), then block C (Phase 3). Never start with the questions.

---

# PART VI — MAKING THIS YOURS

This document is deliberately unfinished in one specific way: **the disguise column is written in my words, not yours.**

Recognition is personal. The phrase that makes *you* think "monotonic stack" is not necessarily "nearest greater element" — it might be a specific problem you got wrong once. So:

1. **When you fail a question, add its disguise to block A.** Not the solution — the *phrase in the problem statement that should have tipped you off.* One line.
2. **When a question fits no row, add a row.** That is the sheet earning its keep.
3. **Every Sunday, cover the right column of one section's block A and recite it.** Under five seconds per row, or it is not learned.
4. **Every rehearsal that produces "I have seen this but I can't remember how" means the pattern is memorised as a *problem*, not as *machinery*.** Go back to block A and re-derive.

The exit test for this whole document, on day 154:

> Open a random Hard you have never seen. Read it once. Say out loud, within 60 seconds: **which section, which row of block A, and what the state or the key insight is.** You do not have to solve it in 60 seconds. You have to *place* it.

Hit that on 7 of 10 and nothing in a Google, Uber, Amazon or JP Morgan interview will look strange to you.

---

*Companion to `PLAN.md`. Premium-marked problems can be substituted freely from the same block-A row.*
