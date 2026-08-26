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

**The recognition goal here is different.** In DSA you recognise *which algorithm*. In system design you recognise **which requirement implies which building block** — and then you survive the cross-question. Nobody fails an SD round for not knowing what a CDN is. They fail it for hand-waving the follow-up.

**Tier note:** the gradient does **not** run to Google. Google L4 has little or no system design. The heavy SD rounds are **JP Morgan, Amex, Expedia, Amazon and Uber** — so Block B here is the big one and Block C means "Uber / Apple / Amazon-senior depth", not "Google".

---

## §18 · THE FRAMEWORK — memorise this, use it every single time

| Step | Minutes | What you actually do |
|---|---|---|
| **1 · Requirements** | 3–5 | Functional (3–5 bullets) and non-functional (scale, latency, consistency, availability). **Ask about scale every time** — it drives every later decision and asking it is scored signal |
| **2 · Estimation** | 3–5 | DAU → QPS → storage → bandwidth. Out loud, rounded, no calculator |
| **3 · API** | 3–5 | 3–6 endpoints with signatures. This forces the data model |
| **4 · Data model** | 5 | Entities, keys, and **the shard key** — plus why it does not create a hot partition |
| **5 · High-level design** | 10 | Boxes and arrows. Client → LB → service → cache → DB → queue → worker |
| **6 · Deep dive + bottlenecks** | 15 | **Pick the interesting part yourself.** Then defend it against the six cross-question categories |

**Numbers to have memorised:** L1 ~1ns · RAM ~100ns · SSD random read ~100µs · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent RTT ~150ms · 1M req/day ≈ 12 QPS · 86,400 s/day.

---

## §19 · REQUIREMENT → BUILDING BLOCK

This is the SD equivalent of the DSA pattern table. **Drill it the same way.**

| You hear | Reach for | The cross-question that follows |
|---|---|---|
| Read-heavy, same data repeatedly | **Cache** — decide placement, eviction, invalidation | "The cache expires and 10k requests hit at once" ⇒ stampede: request coalescing, early/jittered expiry, or a lock |
| Nodes join and leave the cluster | **Consistent hashing + virtual nodes** | "Why virtual nodes?" ⇒ even distribution when a node dies |
| Data outgrows one machine | **Sharding** | "Defend your shard key" ⇒ hot partitions, resharding, cross-shard queries |
| Write-heavy, append-mostly | **LSM-tree store**, not a B-tree | "What does compaction cost you?" |
| Read-heavy, complex queries, joins | **Relational + read replicas** | "Replication lag — what does the user see?" |
| Slow work must not block the request | **Queue + async worker + DLQ** | "The queue backs up" ⇒ backpressure, autoscaling, shedding |
| "What if the client retries?" | **Idempotency key** | "Exactly-once = at-least-once + idempotency." Where is the key stored? What TTL? What about two concurrent retries? |
| Write to DB *and* publish an event | **Outbox pattern** | "Why not just do both?" ⇒ the dual-write problem |
| Limit requests per user | **Token bucket**, distributed via Redis | "What if Redis goes down?" ⇒ local fallback, fail-open vs fail-closed |
| Feed with a few very popular producers | **Hybrid fan-out** | "Pure fan-out-on-write breaks on celebrities" — say this unprompted |
| Persistent bidirectional connection | **WebSockets + a connection registry** | "How does node A reach a user connected to node B?" |
| "Find things near me" | **Geohash / quadtree / S2 / H3** | "Why not a bounding-box scan?" |
| Multi-service transaction involving money | **Saga + compensating transactions** | "Why not 2PC?" ⇒ availability, lock duration, coordinator failure |
| Two customers buy the last item | **Reservation with TTL**, or optimistic decrement | "What if payment fails after the hold?" |
| Money must be auditable | **Double-entry ledger, append-only** | **JPM/Amex core.** "How do you correct a mistake?" ⇒ a reversing entry, never an update |
| "Users in Europe and the US" | **Multi-region** | "Active-active or active-passive? What is your RPO and RTO?" |
| Search box that completes as you type | **Trie / inverted index + ranking** | "How do you update the index?" |
| Uploads, images, video | **Object store + CDN + presigned URLs** | "Why not through your service?" |
| Something must run exactly once daily | **Scheduler + distributed lock/lease** | "Two schedulers fire at once" |
| "How do you know it's broken?" | **Metrics, logs, traces + alerting on SLO** | "What do you alert on?" ⇒ symptoms, not causes |
| Deploy without downtime | **Rolling / blue-green / canary** | "How do you roll back a schema change?" ⇒ expand-migrate-contract |

---

## §20 · THE TWENTY-TWO SESSIONS

Each Saturday: **terms (45m) → the design (90m, timed, recorded) → case study (45m) → cross-questions (60m, written)**.

### Block B — tier 1–2 (JPM · Amex · Expedia · Amazon · Microsoft · Adobe)

| # | Session | Terms you must own | The design | Case anchor |
|---|---|---|---|---|
| 1 | Fundamentals & estimation | latency table, QPS, CAP, PACELC, consistency models, availability nines, SLA/SLO/SLI | *(estimation drills only)* | — |
| 2 | Caching | write-through / write-back / write-around, TTL, LRU/LFU, stampede, coalescing, consistent hashing, CDN edge | Design a caching layer for a read-heavy API | Facebook memcache leases |
| 3 | Databases | B-tree vs LSM, index selectivity, covering index, isolation levels, MVCC, normalisation | Pick and defend a store for three products | **Postgres internals — your stack** |
| 4 | Sharding & replication | range/hash/directory sharding, hot partition, leader-follower, multi-leader, quorum R+W>N, read-your-writes | Shard a 10 TB table | Discord: Cassandra → ScyllaDB |
| 5 | Queues & async | at-most/at-least/exactly-once, idempotency, DLQ, backpressure, outbox, ordering | Design an async job pipeline | **Kafka vs SQS vs RabbitMQ** |
| 6 | **Kubernetes as a design primitive** | pod, service, ingress, probes, HPA, requests vs limits, rolling update, sidecar | Deploy and scale a 2-tier app; survive a node failure | **Your production cluster** |
| 7 | URL shortener + Pastebin | base62, collision, custom alias, expiry, redirect 301 vs 302 | Design TinyURL | — |
| 8 | Rate limiter | fixed window, sliding log, sliding counter, token bucket, leaky bucket | Distributed rate limiter | Stripe |
| 9 | News feed | fan-out on write vs read, hybrid, ranking, pagination cursors | Design a timeline | Twitter's celebrity problem |
| 10 | Chat | WebSocket, presence, delivery receipts, message ordering, offline queue | Design WhatsApp-lite | Discord message store |
| 11 | **Payments & ledger** | double-entry, idempotency key, reconciliation, settlement, PCI scope, eventual consistency of money | Design a payment service | **JPM / Amex core topic** |
| 12 | Orders & inventory | reservation with TTL, optimistic locking, saga, oversell | Design Amazon checkout | Amazon inventory holds |
| 13 | Search & notifications | inverted index, typeahead, fan-out, user preferences, dedup | Design typeahead + a notification service | — |

### Block C — top tier (Uber · Apple · Amazon-senior)

| # | Session | Why it is up here | Case anchor |
|---|---|---|---|
| 14 | **Uber ride matching, geo indexing** | Real-time matching, supply/demand, geospatial indexing, driver location at high write volume | **Uber H3** |
| 15 | Metrics & observability at scale | Time-series storage, cardinality explosion, downsampling, pull vs push | Prometheus |
| 16 | File storage, CDN, video streaming | Chunking, adaptive bitrate, presigned URLs, edge caching | Netflix Open Connect |
| 17 | **Distributed transactions** | Saga vs 2PC, compensations, isolation without locks, the outbox | — |
| 18 | **Multi-region & disaster recovery** | Active-active vs active-passive, conflict resolution, RPO/RTO, data residency | **JPM/Amex care deeply** |
| 19–21 | Recorded mocks ×2 each | Unseen prompt, 45 min, narrated, then watch it back | — |
| 22 | Final mock + rebuild the vocabulary from memory | If you cannot reproduce §19 from memory, you have not learned it | — |

### The six cross-question categories — answer all six, in writing, for every design

| Category | Shape | Examples |
|---|---|---|
| **Failure** | "What happens when X dies?" | Cache dies · leader dies mid-write · queue backs up · a region goes dark |
| **Scale** | "10× traffic — what breaks first?" | Hot partition · fan-out · connection pool · a single-threaded consumer |
| **Consistency** | "Two users, same instant" | Double-booking · double-charge · lost update · read-your-writes after a write |
| **Cost** | "Where is the money going?" | Cross-AZ egress · retaining every event forever · over-provisioned pods · a chatty N+1 |
| **Change** | "Now add this" | Multi-region · GDPR delete · an audit trail · a new consumer of the same events |
| **Justify** | "Why not the other one?" | Kafka not SQS · Postgres not Cassandra · cache not replica · a cron job not a queue |

---

# PART III — LLD / OOD / MACHINE CODING

**Three different rounds wear this name**, and confusing them is how people lose the round:

| Flavour | Who | Clock | What scores |
|---|---|---|---|
| **Whiteboard OOD** | Amazon · Adobe · Microsoft · JPM | 45–60 min | Entities, relationships, extensibility. SOLID **applied**, not recited |
| **Machine coding** | Uber · Flipkart | 60–90 min | **Finishing.** Runnable, tested code. An unfinished elegant design scores below a finished plain one |
| **Amazon hybrid** | Amazon | 60 min | Design **plus** working code **plus** an algorithmic core, under one clock |

---

## §21 · A · THE PATTERN TABLE

Only about eight of the 23 GoF patterns appear. Learn these cold and stop.

| You hear | Reach for | Where it shows up |
|---|---|---|
| "support multiple algorithms for X, swappable" | **Strategy** | Parking pricing, elevator scheduling, ride matching, payment methods |
| "create objects without naming the concrete class" | **Factory / Abstract Factory** | Vehicle types, chess pieces, notification channels |
| "notify N things when this changes" | **Observer** | Bidding, notifications, order status, stock ticker |
| "the object behaves differently depending on its mode" | **State** — **not** a switch over an enum | Vending machine, ATM, elevator, order lifecycle |
| "undo / redo / a queue of operations" | **Command** | Chess moves, text editor, job scheduler |
| "add behaviour without a subclass explosion" | **Decorator** | Pizza toppings, coffee, middleware |
| "lots of optional constructor parameters" | **Builder** | Complex config, request objects |
| "exactly one of these, globally" | **Singleton** — and say when it is a mistake | Config, connection pool. Usually DI is better |
| "two users grab the same resource" | **Optimistic vs pessimistic locking** — say which and why | Booking, parking spot, inventory |
| "make it extensible" | **Depend on an interface, not a concrete class** | Every LLD round, always |
| "the object is expensive to create" | **Object pool / flyweight** | Connections, threads, game sprites |
| "one interface over several subsystems" | **Facade** | Service layer over repositories |

**SOLID, as a refactor rather than a definition** — for each letter be able to show a 10-line violation and its fix:
**S** a class that both computes and persists · **O** a switch you must edit for each new type · **L** a subclass that throws on an inherited method · **I** a fat interface forcing empty implementations · **D** `new ConcreteThing()` inside business logic.

**The framework:** clarify requirements → identify entities → relationships and cardinality → define interfaces → implement the core → **show one extension** ("here is how a new vehicle type slots in"). That last step is the highest-scoring thirty seconds of the round.

---

## §21 · B · TIER 1–2 PROBLEMS

| Problem | Flavour | The hard part |
|---|---|---|
| **Parking lot** | OOD | The "two sum" of LLD. Pricing strategy, spot allocation, **concurrency on allocation** |
| **Elevator system** | OOD | Scheduling strategy + State. Multiple cars is the follow-up |
| **Vending machine** | OOD | **State pattern.** If you wrote a switch over an enum, you failed the point |
| **ATM** | OOD | State + transaction integrity + note dispensing (a small greedy/DP) |
| **Library / inventory management** | OOD | Deliberately boring. JPM-flavoured. Get the entities clean |
| **Booking system (BookMyShow)** | OOD | **The race condition is the interview.** Seat hold with TTL, optimistic vs pessimistic, what happens if payment fails after the hold |
| **Splitwise** | OOD | Balance simplification (LC 465 is the algorithmic core) |
| **Tic-tac-toe / chess** | OOD | Command for undo; efficient win-check (LC 348) |
| **Notification system** | OOD | Strategy per channel, Observer for subscribers, retry with backoff |
| **Rate limiter / logger / cache as objects** | OOD | Bridges into system design; LRU is the classic |
| **Design an ordering system** | OOD | **Amazon.** Order state machine, inventory reservation |

---

## §21 · C · TOP TIER — Amazon hybrid & Uber/Flipkart machine coding

| Problem | Flavour | Why it is up here |
|---|---|---|
| **Ride-hailing (driver matching)** | Machine, 90 min | **Uber's actual round.** Matching strategy, state machine, geo lookup — and you must *finish* |
| **Food delivery / cart & checkout** | Machine | Flipkart flavour. Many entities, tight clock |
| **Snake / game simulation** | Machine | Tick loop, collision, growth. Tests plain execution speed |
| **In-memory key-value store with TTL** | Machine | Expiry strategy: lazy vs active sweep |
| **In-memory file system** | Hybrid | LC 588. Tree + design + path parsing |
| **Design Tic-Tac-Toe (efficient)** | Hybrid | LC 348. Design *plus* the O(1) win-check |
| **LRU / LFU cache** | Hybrid | LC 146 / 460. Design *plus* the data-structure insight |
| **Max frequency stack** | Hybrid | LC 895. **Uber** |
| **Exam room** | Hybrid | LC 855. **Uber.** Design + ordered set |
| **Snapshot array / versioned store** | Hybrid | LC 1146 / 981 |
| **Splitwise balance settlement** | Hybrid | LC 465 — design *plus* bitmask DP |
| **Text editor with undo/redo** | Machine | Command + a rope or gap buffer if pushed |

**Machine-coding rules that decide the round:**

1. **Ship a working skeleton in the first 20 minutes**, then enrich. Never design for 60 minutes and code for 30.
2. In-memory only unless asked. No database, no framework, no build tooling.
3. Write `main()` with a demo run early — it proves it works and it prevents you from being unfinished.
4. Two or three tests beat ten. Add them as you go, not at the end.
5. One interface per axis of change. Do not create fifteen.
6. Say your assumptions out loud and write them as comments.

---

# PART IV — TECH (Java · Spring · Postgres · Kafka · K8s · microservices)

**The gradient inverts here.** The deepest tech questioning is at the **bottom** of your ladder — JP Morgan and Amex will go far deeper on `@Transactional`, thread pools and index plans than Google ever will. Google asks none of it. So Block B is the heavy one and Block C is "the parts only a staff-flavoured or infra-flavoured round reaches."

**Format:** every entry is **question → the answer's spine → the follow-up they will actually ask.** Learn the follow-up; anyone can answer the first question.

---

## §22 · MODULE 1 — Java core & JVM

| Question | Answer spine | The follow-up |
|---|---|---|
| Why is `String` immutable? | Security, hashcode caching, string-pool sharing, thread safety | "Then how does `StringBuilder` differ, and when does the compiler use it for you?" |
| `equals`/`hashCode` contract | Equal objects must have equal hashcodes; unequal may collide | "You put a mutable object in a HashMap then mutate the key field. What happens?" |
| HashMap internals | Array of buckets, linked list, **treeify at 8 nodes** (Java 8+), resize doubles and rehashes | "Why treeify? What attack does it defend against?" |
| ArrayList vs LinkedList | Contiguous + O(1) random access vs pointer-chasing; LinkedList is almost always worse in practice | "Why does LinkedList lose even for insertion in the middle?" |
| Heap vs stack | Objects on the heap, frames and primitives-in-frames on the stack | "Where does a `String` literal live? Where does an `int[]` live?" |
| GC | Generational hypothesis, young/old, minor vs major, G1 regions | "What is a stop-the-world pause and how do you reduce it?" |
| Memory leak in a GC language | Unbounded caches, listeners never removed, `ThreadLocal` in a pool, static collections | "How would you find one in production?" ⇒ heap dump + dominator tree |
| `final`, `finally`, `finalize` | Immutability / cleanup block / deprecated hook | "Does `finally` always run?" ⇒ `System.exit`, JVM crash |
| Checked vs unchecked exceptions | Recoverable vs programming error | "Why do many modern codebases avoid checked exceptions?" |
| Generics erasure | Types are erased at runtime; bridge methods; no `new T[]` | "Why can't you have `List<int>`?" |
| `Optional` | Return type for maybe-absent, not a field type | "Why not use it as a method parameter?" |
| Streams | Lazy, single-use pipeline; terminal op triggers | "When is a parallel stream actually slower?" |
| `==` vs `equals` for boxed types | Integer cache −128..127 | "Why does `128 == 128` fail for `Integer`?" |

## §23 · MODULE 2 — Concurrency *(JPM/Amex love this)*

| Question | Answer spine | The follow-up |
|---|---|---|
| `volatile` vs `synchronized` | volatile = visibility + ordering, no atomicity. synchronized = mutual exclusion + visibility | "Is `count++` safe on a volatile int?" ⇒ no, it is read-modify-write |
| Happens-before | The JMM ordering guarantee: unlock→lock, volatile write→read, thread start, thread join | "Why is double-checked locking broken without volatile?" |
| Thread pool sizing | CPU-bound ≈ cores + 1. IO-bound ≈ cores × (1 + wait/service) | "What happens when the queue is unbounded and producers outpace consumers?" ⇒ OOM |
| `ExecutorService` shutdown | `shutdown` vs `shutdownNow` vs `awaitTermination` | "Your app won't exit. Why?" ⇒ non-daemon pool threads |
| `ConcurrentHashMap` | Bucket-level (CAS + synchronized on bin head) not whole-map locking | "Is `map.get(k) == null ? map.put(...)` safe?" ⇒ no, use `computeIfAbsent` |
| `CompletableFuture` | Composable async; `thenApply` vs `thenCompose` vs `thenCombine` | "Which executor runs your callback if you don't pass one?" |
| Deadlock | Four Coffman conditions; fix by lock ordering or timeout | "Reproduce one, then fix it without a global lock" |
| Optimistic vs pessimistic locking | CAS/version column vs SELECT FOR UPDATE | "Which for a high-contention seat booking, and why?" |
| `ThreadLocal` | Per-thread storage; **must be removed in a pooled thread** | "What leaks if you don't?" |
| Atomics | CAS loop, `AtomicInteger`, `LongAdder` under contention | "When does `LongAdder` beat `AtomicLong`?" |
| Producer–consumer | `BlockingQueue`; bounded for backpressure | "Bounded or unbounded, and what breaks with each?" |
| `synchronized` on a method vs a block | Locks `this` vs a chosen monitor | "Two synchronized methods on the same object — can they run concurrently?" |
| Virtual threads (Java 21) | Cheap, blocking-friendly; pinning on synchronized | "When do they *not* help?" ⇒ CPU-bound work |

## §24 · MODULE 3 — Spring core

| Question | Answer spine | The follow-up |
|---|---|---|
| IoC / DI | The container owns construction and wiring | "Constructor or field injection?" ⇒ **constructor**: immutability, testability, fail-fast on cycles |
| Bean scopes | singleton (default), prototype, request, session | "A singleton holding mutable state — what happens?" |
| Bean lifecycle | instantiate → populate → aware → `BeanPostProcessor` before → `@PostConstruct`/`InitializingBean` → after → ready → `@PreDestroy` | "Where would you hook to modify every bean of a type?" |
| `@Component` vs `@Bean` | Class-level scan vs method-level factory in `@Configuration` | "How do you register a bean from a third-party library?" |
| AOP & proxies | JDK dynamic proxy (interface) or CGLIB (subclass); advice around a join point | "Why doesn't the aspect fire on a private or self-invoked method?" |
| **`@Transactional` self-invocation** | Calling `this.method()` bypasses the proxy, so no transaction | **The single most-asked Spring question.** "How do you fix it?" ⇒ self-inject, split the class, or `TransactionTemplate` |
| Propagation | REQUIRED (join), REQUIRES_NEW (suspend + new), NESTED (savepoint), MANDATORY, SUPPORTS, NEVER | "Outer rolls back — does the REQUIRES_NEW inner also roll back?" ⇒ no |
| Isolation | READ_COMMITTED default in Postgres; REPEATABLE_READ; SERIALIZABLE | "Give a concrete anomaly each level allows" |
| Rollback rules | Rolls back on unchecked by default; checked needs `rollbackFor` | "You caught the exception inside the method — does it still roll back?" |
| Circular dependencies | Constructor cycles fail; setter/`@Lazy` can resolve | "Why is failing the *right* behaviour?" |
| `@Qualifier` / `@Primary` | Disambiguating multiple candidates | — |
| Spring MVC request flow | DispatcherServlet → HandlerMapping → Controller → ViewResolver / message converter | "Where does `@ControllerAdvice` fit?" |

## §25 · MODULE 4 — Spring Boot

| Question | Answer spine | The follow-up |
|---|---|---|
| Auto-configuration | `@EnableAutoConfiguration` → `spring.factories` / `AutoConfiguration.imports` → `@ConditionalOnClass/Bean/Property` | "How do you *stop* one from applying?" ⇒ `exclude`, or define your own bean |
| Starters | Curated dependency sets, no code | "What is in `spring-boot-starter-web`?" |
| Config precedence | CLI args > env > `application-{profile}.yml` > `application.yml` > defaults | "How do you inject a secret without putting it in the image?" |
| Profiles | `@Profile`, `spring.profiles.active` | "How do your K8s manifests set it?" |
| Actuator | `/health`, `/metrics`, `/info`, `/env`, `/threaddump` | "**Which must never be public**, and how do you secure them?" |
| Health checks | Liveness vs readiness groups | "Map these to K8s probes" — see module 9 |
| Embedded server | Tomcat by default; thread-per-request | "How many concurrent requests can it take, and what do you tune?" |
| WebFlux vs MVC | Event-loop, non-blocking, backpressure vs thread-per-request | "When is WebFlux the *wrong* choice?" ⇒ blocking JDBC in the chain |
| `@ConfigurationProperties` vs `@Value` | Typed binding vs single value | — |
| Graceful shutdown | Stop accepting, drain in-flight, then exit | "How does that interact with a K8s rolling update?" ⇒ `preStop` + `terminationGracePeriodSeconds` |

## §26 · MODULE 5 — PostgreSQL & JPA *(your daily stack — expect depth)*

| Question | Answer spine | The follow-up |
|---|---|---|
| B-tree index | Sorted structure; supports `=`, ranges, ordering, prefix of a composite | "Why does index column order matter?" ⇒ leftmost-prefix rule |
| Composite index order | Equality columns first, then the range column | "You have `(a,b)`. Does a query on `b` alone use it?" ⇒ no (barring index-only scans) |
| Covering / index-only scan | All needed columns in the index, plus a visible heap page | "Why does `VACUUM` matter for index-only scans?" |
| `EXPLAIN ANALYZE` | Seq scan vs index scan vs bitmap heap scan; estimated vs actual rows | "Estimate says 10, actual is 100,000 — what do you do?" ⇒ `ANALYZE`, stats target, rewrite |
| When a seq scan is right | Low selectivity, small table | "Why is an index sometimes *slower*?" |
| MVCC | Each write creates a new row version; readers never block writers | "Where do the dead tuples go?" ⇒ `VACUUM`, and bloat if it can't keep up |
| Isolation levels | Postgres default READ COMMITTED; REPEATABLE READ; SERIALIZABLE (SSI) | "Give me a lost update at READ COMMITTED, and two ways to prevent it" |
| Deadlocks | Two transactions grabbing rows in opposite order | "How do you find them?" ⇒ logs, `pg_locks`. "Fix?" ⇒ consistent ordering, shorter transactions |
| `SELECT FOR UPDATE` | Row-level pessimistic lock | "`FOR UPDATE SKIP LOCKED` — what is it for?" ⇒ queue-in-a-table workers |
| Connection pooling | HikariCP; pool size ≈ cores × 2 + spindles, not "hundreds" | "The pool exhausted. Diagnose." ⇒ long transactions, leaked connections, N+1, missing timeouts |
| **N+1 problem** | One query per parent row from lazy loading | "How do you fix it?" ⇒ `JOIN FETCH`, `@EntityGraph`, batch size. "How do you *detect* it?" |
| Lazy vs eager | Lazy by default for collections; eager causes cartesian blowups | "`LazyInitializationException` — why, and what is the *right* fix?" (not `open-in-view`) |
| JPA dirty checking | The persistence context flushes changes at commit | "You changed a field and never called `save()`. Was it persisted?" ⇒ yes, inside a transaction |
| Optimistic locking | `@Version` column | "Two users edit the same row — walk me through it" |
| Partitioning vs sharding | Within one DB vs across machines | "When do you reach for each?" |
| JSONB | Flexible fields, GIN index | "When does this become a mistake?" |

## §27 · MODULE 6 — REST, API design & auth

| Question | Answer spine | The follow-up |
|---|---|---|
| Idempotency | Same request twice = same result. PUT/DELETE yes, POST no by default | "Make POST idempotent" ⇒ client-supplied idempotency key + a stored result |
| Status codes | 201 + Location, 202 async, 400 vs 422, 409 conflict, 429 rate limit | "What do you return when the resource is being created asynchronously?" |
| Pagination | Offset is simple but drifts and gets slow; **cursor/keyset** is stable and fast | "Page 10,000 with offset — what is wrong?" |
| Versioning | URL path, header, or content negotiation | "How do you retire v1?" |
| OAuth2 flows | Authorization code + PKCE for apps; client credentials for service-to-service | "Why is implicit flow deprecated?" |
| JWT | header.payload.signature; stateless; **cannot be revoked** | "So how do you revoke one?" ⇒ short TTL + refresh token + a denylist |
| Where to rate limit | Gateway/edge, before your service | "Per user or per IP, and what breaks with each?" |
| CORS | Browser-enforced preflight | "Why does it not protect your API?" |
| Retries | Exponential backoff **with jitter** | "What does retrying without jitter cause?" ⇒ thundering herd |
| Timeouts | Every remote call needs one; budget them down the chain | "Downstream p99 is 3s and your timeout is 5s — what happens under load?" |

## §28 · MODULE 7 — Kafka *(new to you — hands-on required)*

| Question | Answer spine | The follow-up |
|---|---|---|
| Topic / partition / offset | A topic is split into partitions; each is an ordered append-only log; consumers track offsets | "Why partitions at all?" ⇒ parallelism and scale-out |
| **Ordering guarantee** | Ordered **within a partition only** | "So how do you get per-user ordering?" ⇒ partition key = user id. "What breaks if you add partitions later?" |
| Consumer groups | Each partition goes to exactly one consumer in a group | "You have 3 partitions and 5 consumers — what happens?" ⇒ two idle |
| Rebalancing | Membership change triggers reassignment; processing pauses | "How do you avoid a rebalance storm?" ⇒ `max.poll.interval`, heartbeat tuning, cooperative-sticky |
| Consumer dies mid-batch | Offsets not committed ⇒ redelivery from the last commit | "So your consumer must be…?" ⇒ **idempotent** |
| Delivery semantics | at-most-once (commit first), at-least-once (process first — the default choice), exactly-once (transactions) | "Is exactly-once real?" ⇒ within Kafka, via idempotent producer + transactional writes; end-to-end still needs idempotency |
| Retention vs compaction | Time/size-based deletion vs keep the **latest value per key** | "When would you compact?" ⇒ changelog/state topics |
| Poison message | Retry with backoff, then route to a **DLQ** | "How do you replay from the DLQ safely?" |
| Consumer lag | Committed offset vs log end offset | "Lag is growing. Name four causes." ⇒ slow processing, too few partitions, rebalances, a downstream bottleneck |
| Kafka vs RabbitMQ vs SQS | Log with replay and ordering vs a broker with routing/ack semantics vs a managed queue | **"Pick one for your event-driven components and defend it"** |
| Producer acks | `acks=0/1/all` + `min.insync.replicas` | "Which for money?" ⇒ all |
| Schema evolution | Schema registry, backward/forward compatibility | "You add a required field — who breaks?" |

**Hands-on artefact (required):** Docker Compose with Kafka, a Spring Boot producer and consumer, a topic with 3 partitions, a consumer group of 2 — then **kill one consumer and watch the rebalance**, and **replay from an earlier offset.** Reading about Kafka does not survive the follow-up column.

## §29 · MODULE 8 — Microservices *(new to you)*

| Question | Answer spine | The follow-up |
|---|---|---|
| When **not** to | A monolith is right for small teams, shared data, and unclear boundaries. Microservices buy independent deploy and scale, and cost you a distributed system | **"Argue against microservices."** Answering this well is worth more than the architecture diagram |
| **Splitting a monolith** | Find a bounded context with few writes across the seam; strangler-fig it behind a facade; move data last | **Your question:** "Which seam would you split first in your system, and why haven't you?" |
| Service discovery | Registry, or K8s Services + DNS | "How does a caller find a healthy instance?" |
| API gateway | One edge for auth, rate limiting, routing, aggregation | "What is the risk?" ⇒ it becomes a distributed monolith |
| **Circuit breaker** | Closed → open on failure threshold → half-open probe. resilience4j | "A downstream is slow but not failing. What protects you?" ⇒ timeout + bulkhead + breaker |
| Bulkhead | Isolate thread pools/connections per dependency | "Why isn't a timeout enough?" |
| Retries | Backoff + jitter, and **only for idempotent operations** | "You retried a payment. Now what?" |
| Saga | Local transactions + compensating actions; choreography vs orchestration | "Why not 2PC?" ⇒ locks held across services, coordinator is a SPOF, hurts availability |
| Outbox | Write the row and the event in **one** local transaction; a relay publishes | "Why not write to the DB then publish?" ⇒ dual write; one can fail |
| Idempotency across services | Keys + dedup store | — |
| Distributed tracing | Trace id propagated through headers; spans | "A request is slow across five services — find it" |
| Config & secrets | Config server or K8s ConfigMap/Secret | "How do you rotate a secret with zero downtime?" |
| Data per service | Each service owns its store; no cross-service joins | "So how do you build a report spanning three services?" ⇒ CQRS, read model, or a warehouse |

## §30 · MODULE 9 — Docker & Kubernetes *(your production edge)*

| Question | Answer spine | The follow-up |
|---|---|---|
| Image layers | Copy-on-write layers; cache invalidates at the first changed layer | "Order your Dockerfile for cache hits" ⇒ deps before source |
| Multi-stage build | Build in a fat image, copy the artefact into a slim one | "Why does this matter beyond size?" ⇒ attack surface |
| Pod vs container | A pod is the scheduling unit; shares network namespace and volumes | "When do two containers belong in one pod?" ⇒ sidecar, tight coupling |
| Deployment / ReplicaSet | Declarative desired state; the controller reconciles | "You deleted a pod. What happens?" |
| Service / Ingress | Stable virtual IP + selector; Ingress is L7 routing | "How does traffic reach a pod, step by step?" |
| **Liveness vs readiness vs startup** | Liveness **restarts** the container. Readiness **removes it from the Service endpoints**. Startup gives slow boots time | **"What breaks if you swap liveness and readiness?"** ⇒ a briefly-busy pod gets killed in a restart loop |
| **Requests vs limits** | Request is what the scheduler reserves; limit is the hard cap | "Set only limits — what happens?" ⇒ request defaults to the limit; poor packing. "Exceed the memory limit?" ⇒ **OOMKilled** |
| **OOMKilled** | Container exceeded its memory limit | "Your Java pod OOMKills. What do you change?" ⇒ heap vs container limit, `MaxRAMPercentage`, off-heap and metaspace, then actually fix the leak |
| CPU throttling | CPU limits throttle via cfs quota rather than killing | "Latency spikes but memory is fine — what would you check?" |
| **CrashLoopBackOff** | Container exits repeatedly; backoff grows | "Walk me through debugging it" ⇒ `describe pod` (events), `logs --previous`, exit code, probe config, config/secret missing, image pull |
| Rolling update | maxSurge / maxUnavailable; readiness gates the rollout | "How do you get truly zero downtime?" ⇒ readiness + graceful shutdown + `preStop` drain |
| HPA | Scales replicas on metrics | "Why might HPA not help?" ⇒ the bottleneck is the DB or a single Kafka partition |
| ConfigMap vs Secret | Non-sensitive vs base64 (not encrypted at rest by default) | "How do you rotate without a restart?" |
| StatefulSet | Stable identity and storage | "Why not run Postgres in a Deployment?" |
| Namespaces, quotas, network policy | Isolation boundaries | — |

> **Say this out loud in your interviews:** you run frontend and backend pods in production. Most candidates recite Kubernetes; you have been paged by it. Lead with a real incident.

## §31 · MODULE 10 — Observability, testing, CI/CD

| Question | Answer spine | The follow-up |
|---|---|---|
| Logs vs metrics vs traces | Events / aggregates / causal request path | "You have all three and the app is slow. What do you look at first?" |
| Structured logging + correlation id | JSON logs, trace id propagated | "How does the id survive an async hop into Kafka?" ⇒ carry it in headers |
| What to alert on | Symptoms and SLO burn, not causes | "Why is 'CPU > 80%' a bad alert?" |
| Test pyramid | Many unit, fewer integration, very few E2E | "Where do you test a repository query?" |
| Mockito | Mock collaborators, not the class under test | "When is mocking a smell?" ⇒ mocking value objects or over-specifying interactions |
| **Testcontainers** | Real Postgres/Kafka in Docker for tests | "Why not H2?" ⇒ dialect drift; H2 passes what Postgres rejects |
| Testing a Kafka consumer | Embedded/Testcontainers Kafka, or test the handler directly | — |
| Flaky tests | Time, ordering, shared state, real network | "What is the cost?" ⇒ the team stops trusting the suite |
| Blue-green vs canary | Two full environments vs a percentage rollout | "Which for a schema change?" ⇒ neither alone — expand/migrate/contract |
| Rollback | Redeploy the previous image; **schema changes must be backward compatible** | "You cannot roll back a dropped column. So what is the process?" |

---

## §32 · TECH TRIGGERS — the recognition table

Drill this the way you drill §19 and the DSA pattern tables.

| You hear | Reach for |
|---|---|
| "our consumers keep falling behind" | Consumer lag · partition count · per-message processing time · rebalance frequency |
| "the pod restarts under load" | Memory limit vs JVM heap · OOMKilled · `MaxRAMPercentage` · liveness probe too aggressive |
| "it's slow but only sometimes" | GC pause · CPU throttling · connection-pool wait · p99 vs mean |
| "the query got slow after the table grew" | Index column order · EXPLAIN · seq scan · stale statistics · bloat |
| "the retry made it worse" | Thundering herd · no jitter · no circuit breaker · non-idempotent operation |
| "the same request was processed twice" | At-least-once delivery · missing idempotency key · consumer died before commit |
| "it works on my machine" | Image layers · env config · Testcontainers vs H2 |
| "two users overwrote each other" | Lost update · optimistic locking with `@Version` · isolation level |
| "the transaction didn't roll back" | Self-invocation · checked exception · caught and swallowed · wrong propagation |
| "we can't deploy without downtime" | Readiness probe · graceful shutdown · `preStop` · backward-compatible schema |
| "the whole app went down because one service was slow" | Circuit breaker · bulkhead · timeout budget |
| "we need to add a new consumer of this data" | Log-based stream over a queue · replay · compaction |
---

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
