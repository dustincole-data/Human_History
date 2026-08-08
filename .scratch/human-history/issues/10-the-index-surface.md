# 10 — The index surface

Type: prototype
Status: open
Blocked by: 05, 06
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What is the index, and how does someone use it?**

Created by [01](01-the-fun-thesis.md), which ruled the site ends with **a quiet stop into a browsable index** — no finale — and made the index the **only** surface besides the scroll. It is what makes a 200–400 item content bill pay for itself twice, and it is what turns a one-pass visit into a place worth returning to.

It is a second layout, not a footer. Everything the scroll must satisfy, this must satisfy too.

Decide:

1. **What it is organized by.** Chronological grid is the obvious default and may be the wrong one — the site's engine is co-occurrence, so an index arranged by *moment* rather than by *item* would echo the mechanism instead of flattening it. Rule between: a plain chronological grid, era-clustered, or grouped by the contemporaries-clusters the scroll already establishes.
2. **What a cell shows.** Image alone, image + name, image + name + date. This is a direct density-vs-legibility trade under [01](01-the-fun-thesis.md)'s judgment test, at the highest density on the site.
3. **How it is entered and left.** Reached only by scrolling to the end, or available throughout? Does tapping a cell jump back into the scroll at that item, open it in place, or do nothing? A jump-back is the feature that earns the index; it is also the one most likely to break scroll position on mobile.
4. **Whether it carries the credits.** [06](06-visual-treatment.md) item 6 must place 200–400 attributions somewhere. The index is the natural home for a credits view — decide here whether it is, so 06 is not left holding it.

Hard inputs:

- **The decoded-memory ceiling from [03](03-engine-reuse-or-clean-build.md) binds hardest here.** This is the one screen that may hold every image at once. Decoded cost is `w × h × 4` regardless of encoding, so index thumbnails must be *separately derived assets at index size*, never the full-resolution files scaled down in CSS. Confirm the arithmetic before prototyping; a naive index blows the budget on its own.
- **The no-collision contract applies.** The scroll sweep asserting zero rectangle intersections is a ship gate on this surface too.
- **Mobile is a ship gate**, same as everywhere. A dense grid is the most likely place a phone falls over.

**Deliverable:** a working prototype linked from this ticket over the real set, the organizing principle stated, the cell anatomy fixed, the entry/exit behaviour specified, and its measured decoded-memory cost at full index density.
