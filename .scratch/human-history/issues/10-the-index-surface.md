# 10 — The index surface

Type: prototype
Status: CLOSED — all four decisions ruled and built, 2026-08-09
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

---

## Round 11, 2026-08-09 — THE SHELF. 10 closes, and 06 item 6 with it.

Built on the one live page, `prototypes/webgl/index.html`, as the next thing in the document flow
after the piece's own spacer. One new module (`index.js`), one new bake (`bake_index.py` →
`webgl/thumb/` + `webgl/thumbs.js`), no new page, no route, no flags.

### The surface, in one sentence

**The scroll is twelve thousand years of things being destroyed; the index is the same ground
carrying all 230 of them standing whole.**

Every object in the piece falls, breaks, breaks again and goes under the earth. Its name dies at
the impact, its citation dies with the last speck. Nothing survives being looked at. Past the last
arrival the ground keeps going and everything is back, intact, in order, named on demand and cited
in full. That is the reward [12](12-scrollytelling-craft.md) said fun needs, delivered without a
crescendo — which **keeps [01](01-the-fun-thesis.md)'s "no finale" rather than breaking it**. The
visitor does not get a finale, they get everything back.

### Ruling 1 — organised by chronology, wrapped into rows. The row's span is a READOUT.

10 suspected a plain chronological grid would flatten the mechanism and asked whether an
arrangement by *moment* would echo it. It would, and it costs too much to buy: the co-occurrence
window is a **sliding** one ([04](04-scroll-mechanic.md)'s `W_YEARS`), so cutting it into rows
draws boundaries that are not there and splits the pairs that are — and through the deep head it
produces forty rows holding one object each, which fails [01](01-the-fun-thesis.md)'s judgment
test on its first clause before anything else is weighed.

What survives from that idea is its honest half. **A row is not a grid line, it is a wrap.** It
holds as many objects as fit at one height, so at 1440×900 the first row is `7,000–1,754 BCE` with
17 objects on it and the last is `2011–2022 CE` with 7. **The row's own span is printed in the
gutter**, and that is 01's density spacing made visible for nothing: no chart, no asserted era,
nothing claimed that the dates do not already say. Contemporaries end up adjacent because time is
the order, which is the mechanism kept rather than echoed.

Era-clustering was not weighed for long: it re-asserts exactly the periodization
[11](11-visual-anchor.md) warned about and [06](06-visual-treatment.md) round 9 paid a whole
ruling to avoid.

### Ruling 2 — a cell shows the OBJECT. Nothing else.

The density-vs-legibility trade at the highest density on the site, and it is settled by
[06](06-visual-treatment.md)'s size grammar rather than by preference. The piece draws every
photograph at one height; one height with a name under it needs a fixed column; and a fixed column
turns a shelf of real things at their true relative widths into a contact sheet with captions. So
the shelf carries no text at all, and **the words come back complete on focus or tap instead of
truncated under every cell**. A musket runs five cells wide and a kouros is a sliver, which is
what makes it read as objects rather than as tiles.

**No hover state, deliberately.** Mobile is a ship gate; an affordance half the visitors cannot
reach is not an affordance. Tap, click and keyboard focus all do the same one thing.

### Ruling 3 — entered by the scrollbar, opened in place. THE JUMP BACK IS RULED OUT.

Entered by scrolling to the end and by nothing else: same document, same scrollbar, no route
change, no scrolljack ([12](12-scrollytelling-craft.md)). Left by scrolling back up. Tapping a
cell **opens it in place** — the object stays where it is, its name, date and full citation are
written on the soil under it, and **everything standing within eighty years of it stays lit while
the rest of the shelf goes down**. That is 01's ambient engine at index density, which is the
thing [06](06-visual-treatment.md) item 1 said had to be prototyped here and never was.

10 called the jump back "the feature that earns the index". **It is ruled out, and the reason is a
ruling rather than a difficulty.** Decay is one-way ([13](13-visual-direction-v2.md), and 04's
latch): once an object has broken there is no scroll position that shows it whole again, so "jump
back to item 57" can only mean reloading the page — and a reload is a new visit, not a jump.
Rather than dress a reload up as navigation, the index does what the scroll structurally *cannot*:
it holds every object intact, named and cited, for as long as you look at it.

### Ruling 4 — the index carries the credits. 06 item 6 closes here.

The opened cell prints one citation in full; **the roll under the shelf prints all 230**, in
order, as real text lying in the earth. Every item carries its attribution without being touched,
the roll is what a browser's find lands in, and 06 is not left holding two hundred credits with
nowhere to put them. `every_item_carries_its_attribution` checks all 230 lines against the record
for name, date, source and licence, and every cell for an accessible name.

### 06 item 1, tested where it was never tested

The unifying device is 11's — the ground, the cut-out grammar, no treatment on the photographs —
and all three survive the density change. One height everywhere; no card, frame, column rule or
crop, so a row's right edge is ragged because that is where the objects stopped; and the soil is
burial.js's own tile and mottle over the same contour function `gravity.js` bakes its surface
from, gated as byte-identical earth. The contour's amplitude is scaled — the shelf is that land
seen from far enough back to hold twelve thousand years — and **the amplitude is measured off the
function rather than asserted beside it**: the first version carried a hand-picked 16 against a
real 10.4, which is 6px of dead air in every row, twenty times over.

**The light is still the dated system.** Each row is lit by the light of its own years, reach on
the same smooth logistic, so the deep head sits under near-black and the last rows under a lit
sky — 12's flatness rule paid here too. The lamp's pool is at 0.62 of the piece's alpha on
purpose: the piece shows one at a time, the shelf shows six stacked. **The earth never takes it**,
which is 13's frozen ground, and it is gated.

Two things the piece has that are deliberately **not** here, both because the geometry changed and
not because they were dropped: **the stars** (110px of sky reads a star field as noise, not as a
night) and **the tie** (a hairline between two objects means something when they are the only two
on a screen; between neighbours on a shelf where everything is already adjacent in time it means
nothing, so co-occurrence is carried by the lighting instead).

### The memory arithmetic — 03 budgeted it, and the budget held

**A second bake, not a second window.** Decoded cost is `w × h × 4` off intrinsic dimensions and
CSS scaling does not reduce it, so the index owns assets cut at its own size. The cap is derived
the way the sprite cap is: `THUMB_MAX 80 CSS × DPR_CAP 2 = 160` device px, the tallest any object
is drawn at on any viewport.

| | |
|---|---|
| all 230 resident, measured | **26.2 MB** against the 80 MB gate |
| at 01's 400-item ceiling | 45.6 MB |
| if it had pointed at the sprites | 65.8 MB — and 114 MB at 400 |
| transfer | 3.1 MB, fetched lazily 100,000px past the first screen |
| the piece's sprites resident on the shelf | **0** |

80 CSS px is the number because the step up, 96, is 66.8 MB at 400 items and leaves nothing for
the scroll's own peak. A phone draws 64 — one number per viewport class, the same adaptation 06
already makes for credit type and 04 for how many ties are drawn — and 01's judgment test rules it
directly: 21 items a screen against 16, and thirteen screens of shelf against twenty-nine.

### What the sweep says — 24 gates, 24 green, twice, and the piece's 39 still green

`sweep11i.mjs`, round 10's pattern: fresh load per phase, real rAF ticks between instant scrolls,
and a `--slow` mode holding every image 40–340ms at random. **24 green on a normal network and 24
green under `--slow`; `sweep10.mjs`'s 39 re-run green both ways.**

| gate | result |
|---|---|
| `index_is_a_second_bake` | all 230 cells load from `thumb/`, none from the sprite bake |
| `thumb_never_exceeds_its_draw` | tallest file 160px against the 160px cap; 0 drawn taller than 80 |
| `index_decoded_under_the_gate` | **26.2 MB** all resident, against 80 MB |
| `index_never_holds_a_sprite` | 0 of the piece's photographs resident on the shelf |
| `no_cell_collision_1440` · `_390` | **0** overlaps over 250 and 308 boxes — every cell, every row span |
| `index_no_h_overflow_1440` · `_390` | 0 of 4 shelf positions overflow |
| `open_lights_the_contemporary_window` | 5 items opened, 191 lit cells, every one within 80 years **by the dates** |
| `open_words_lie_in_their_own_earth` | 5 clusters, all below their own soil line, inside their row, clear of the gutter |
| `close_puts_the_shelf_back` | 0 cells left lit, cluster removed from the DOM |
| `every_item_carries_its_attribution` | 230 credits, each with name, date, source and licence; 0 cells unnamed |
| `piece_is_gone_before_the_shelf` | fade 0 at TOTAL−1, 1.00 before the first row enters the viewport |
| `the_piece_leaves_nothing_on_the_shelf` | canvas hidden, HUD hidden, **0** of the piece's words still printed |
| `seam_is_scroll_only` | 0.477 → 0.477 → 0.477 mid-fade, two paths plus 2s of wall clock |
| `index_frozen_when_idle` | byte-identical after 2s of wall clock |
| `index_light_is_dated` | upper sky **10 → 37 (×3.7)** across all 20 rows, never backwards, every pair at equal reach identical |
| `index_ground_never_dates` | 4 stretches of strip **byte-identical across all 20 rows**, 7000 BCE to 2022 CE |
| `index_contrast` | worst **5.29:1** over 1,342 composited-pixel samples |
| `index_frame_budget` | warm median 16.6/16.7ms, p95 floor 18.0ms while scrolling the shelf |
| `amp_is_measured_not_asserted` | contour reaches ±15.54px, geometry built on ±16 |
| `every_item_is_on_the_shelf` | 230 cells for 230 items |
| `shelf_layout_does_not_wait_for_pixels` | 230 boxes identical across two loads with every image held back (`--slow` only) |

**Contrast had to be measured differently, and the method is stated.** The shelf is DOM over CSS,
not DOM over a canvas, so there is no `getImageData` to read a word's background out of. The
harness hides the text, screenshots the frame, hands the PNG back to the page to decode into a
canvas, and samples the composited pixel under every word — same method as 06 item 5, different
source.

### Five defects, each found by a gate or a frame rather than by reasoning

1. **The seam printed a hard horizontal edge across the frame.** The shelf is in the document flow
   and paints *over* the fixed canvas, so a fade still running when the first row rose into the
   viewport drew a stroke where the two met — the one thing 11 says nothing on this page has. Fixed
   by giving the stop its own screen: the spacer is now `TOTAL + 2 × 100lvh`, the fade opens at
   TOTAL and shuts before the shelf arrives, and what lies between them is one screen of nothing.
2. **Three of the piece's citations were stranded on the shelf, permanently.** The frame returned
   early once the fade completed — above the update loop — so any object still holding words never
   reached its own `unbuild()`, and its credit stayed printed in the fixed label layer for the rest
   of the page. The return now sits **below** the update loop: state always advances, only the
   pixels stop.
3. **A vertical seam ran down the earth of every row.** One strip the width of the viewport has to
   be tiled to survive its offset, and while the contour can be made periodic by cross-fading its
   ends, burial.js's 320px grain and 512px mottle cannot — their phase jumps at the wrap. Plainly
   visible at 390px. Baked at double width and laid rather than tiled, so nothing ever wraps.
4. **The credits roll's earth was a lighter value than the shelf's**, printing a step across the
   full width where the two met. The roll's field is now matched to the bottom of the strip's own
   depth ramp (ten passes of `rgba(5,5,7,.055)` = 43%) rather than picked.
5. **The opened citation ran out of its own earth band** into the next row's sky, which is the one
   surface the contrast gate is not solved against. Three stacked lines became two — name and date
   share a line, as they do in the piece — and the band is now gated.

### Three things were wrong in the harness before they were wrong in the page

Round 8's and round 9's pattern, repeating, and worth writing down because it keeps repeating.

- **`index_light_is_dated` tested nothing and reported a pass.** It read the five rows visible on
  one screen at the top of the shelf — all five in the deep head, all five at reach 0 — and printed
  `sky value 4 → 4 → 4 → 4 → 4` as green. It walks all twenty rows now. A gate about a *dated*
  backdrop has to take its reading where the thing being claimed actually varies.
- **A sky probe read gold artifacts as sky**, returning 255 on any row holding one. That is round
  9's finding verbatim — "both counted a falling photograph as sky" — arriving again through a
  different door. Every reading of the air is now taken with the objects out of the frame.
- **The ×4 threshold was copied from the piece and was really measuring the piece's geometry.**
  `backdrop_is_dated` demands ×4 and gets ×10.8 — over 640px of sky, read at the top, where the
  skyglow has the whole height to build. A row band is 110px and its top is far nearer the horizon,
  so the identical curve necessarily reports less. The gate now checks the three things actually
  being claimed — never backwards, equal reach means byte-identical, the ends differ by more than
  2× — and **reports the measured ×3.7 rather than hiding it behind a threshold**.

Also, and less interestingly: `const` inside `eval()` is block-scoped to the eval, so the contrast
helpers never reached their caller; and two gates first failed on harness timing rather than on the
page (the row readouts fade on a 0.18s transition, and `INDEX_TOP − 600` is past the end of the
fade window rather than inside it).

### Teeth — 9 of 16 run, 9 red, and the one that did not go red is the finding

`teeth11.mjs`; log at `prototypes/webgl/verify11/teeth11-partial.log`. Each perturbation breaks one
claim on purpose and must turn exactly its own gate red; the files are restored afterwards and
verified byte-identical.

Red as designed: a master cut-out copied over a baked thumbnail · the piece's sprites never
released, so they follow you onto the shelf · the shelf advancing by less than each object's width
· the lit set widened past the contemporary window · the opened citation printed above its own
soil line (which reddened `index_contrast` as well, and that follows — a word on the next row's
sky is on the one surface the gate is not solved against) · the roll dropping the licence · the
quiet stop's runway taken back out.

**And the one that did not.** Pointing the index at the piece's sprites and shrinking them in CSS
— the exact failure 03 budgeted this surface against — leaves **`index_decoded_under_the_gate`
green**. The sprite bake is capped at 264px, so all 230 decode to 65.8 MB, under the 80 MB gate.
**At 230 items the memory gate would have let that ship.** What catches it is the assertion that
the cells come from the second bake at all, plus the draw-height cap. It only becomes a memory
failure at 01's 400 (114 MB), which is far too late to be the thing relied on — 03's "a count is
not a ceiling", arriving from the other direction. The expectation was corrected rather than the
gate, and a second case (`masters_on_the_shelf`, pointing at the 301 MB masters) was added to move
the memory gate properly.

**Still to run, next session:** `masters_on_the_shelf` · `return_before_the_teardown` (the
stranded-citations defect, re-broken) · `seam_on_a_clock` · `light_is_frozen` ·
`earth_takes_the_light` · `ink_below_the_floor` · `amp_asserted` · `layout_waits_for_pixels`
(`--slow`). The run was stopped mid-case to close the session and **left its perturbation in
`index.js`**; it was removed by hand and the 23 gates re-run green before committing. A perturbation
harness that mutates an untracked file has no git to fall back on — worth knowing before the next
one is started.

### Findings for other tickets

- **[05](05-arrival-set.md) — one item is two objects.** `funangold`, the Óc Eo gold plaque, is
  5.79:1 and its photograph holds **two separate ornaments with empty space between them**. In the
  piece it is one wide arrival and reads as one; on the shelf, where a row is a line of objects at
  one height, it reads as a hole. 05's R1 says an arrival is *a* made object with *a* body.
- **[14](14-the-ending-and-the-frame.md) — the ending now has a place to land.** Two screens of
  runway sit between TOTAL and the shelf: the piece goes out over the first and the second is
  empty. 14 owns what happens in that gap and nothing here fills it. The outbound Deep Time link
  and the signature also have an obvious home in the roll's colophon, which this ticket has not
  written.
- **[08](08-accessibility-and-mobile.md) — keyboard focus opens a cell** (`:focus-visible`, so a
  mouse click does not open twice) and every cell carries an accessible name. Arrow-key navigation
  across the shelf, and `inert` on the piece while the shelf is up, are **not built**.
- **[07](07-copy-voice-and-name.md) — the roll's heading is the only new copy on the site**
  ("Every image, and where it came from") and it is placeholder-grade. The bare-URL credits 06
  round 9 flagged now have a second place they read badly.
