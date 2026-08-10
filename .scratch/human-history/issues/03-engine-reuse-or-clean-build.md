# 03 — Reuse Deep Time's engine, or clean build

Type: research
Status: CLOSED — round 10, 2026-08-09
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What of Deep Time's implementation is worth carrying, and what must be built fresh — and does the memory budget survive either way?**

Dustin raised this explicitly as open. Unblocked because it is an audit of code that already exists.

Audit `Projects/Deep_Time` and rule on each piece — **carry / adapt / discard**, with a reason:

- Astro 5 static scaffold and build config
- the single 2D canvas + single `requestAnimationFrame` loop reading native scroll (measured 59.7 fps at 390×844 under 4× CPU throttle, zero frames over 50 ms)
- the no-collision layout contract and its scroll-sweep gate (incl. the later glyph-level and portrait-dwell checks)
- the build-time halo/scrim baker (blur at runtime cost 10 fps; baked instead)
- the contrast gate (3:1 across a subject's own boundary, WCAG 2.2 SC 1.4.11) and the build-time scrim solver at 4.5:1
- the accessibility contract: reduced-motion as `scrollY`-driven rather than time-driven, keyboard milestone jumps that announce what they skipped, `inert` regions
- the image pipeline: WebP over AVIF (measured better at matched quality, exact alpha), the duplicate-manifest-ID assertion, sizing from the opaque subject rather than transparent padding
- browser-coverage assertion harness (CDP), and the `+ 100lvh` document padding fix

Then answer the two questions that actually decide this:

1. **Does the canvas exist here at all?** Deep Time's canvas drew a *code-generated field* — a synthetic environment behind cut-out subjects. This site's content is **photographs**, and there may be no field to draw. If there is no field, the canvas, the field keyframes and much of the halo machinery are dead weight, and the honest answer is "DOM and CSS, no canvas." Do not carry the architecture out of familiarity.
2. **Does the memory budget survive?** This is the project's #1 technical risk and it is arithmetic, not opinion. Decoded cost is `w × h × 4` independent of encoding. Deep Time: **51 assets, 3.34 MB transfer, 75.56 MB decoded**, against an 80 MB gate — and its assets were small cut-outs. Here the images *are* the content and want to be large. Compute the ceiling honestly for a plausible set size from [02](02-image-supply.md), and if a naive all-resident approach exceeds it, **state the mechanism that fixes it** — decode-on-demand, windowed mount/unmount, capped display dimensions, `content-visibility`, or a smaller set. Only fewer resident pixels fixes resident memory.

Note the ordering trap: [04](04-scroll-mechanic.md) can propose a mechanic this ticket's memory ceiling forbids. Publish the ceiling as a **number with an explicit assumption set**, so 04 can design against it rather than around it.

**Deliverable:** a carry/adapt/discard table with reasons, a stated stack, and a decoded-memory ceiling expressed as *max simultaneously-resident image pixels* plus the mechanism that holds the site under it.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

- **Compute the ceiling against 200–400 items**, not 58. That is now the set size the mechanism requires.
- **Two surfaces to budget, not one.** [01](01-the-fun-thesis.md) added a browsable index ([10](10-the-index-surface.md)) — the one screen that may want *every* item resident at once. Budget it separately and state whether index thumbnails must be independently derived assets rather than the full-resolution files scaled in CSS. (Decoded cost is `w × h × 4` from intrinsic dimensions; CSS scaling does not reduce it.)
- **The mechanic will push against you.** [01](01-the-fun-thesis.md)'s judgment test rewards putting *more* recognizable items on one screen at once, so [04](04-scroll-mechanic.md) is now actively incentivized toward the densest screens the arithmetic allows. Publishing the ceiling as a hard number with its assumption set is therefore more load-bearing than when this ticket was written — 04 will design right up to it.

---

## Round 10, 2026-08-09 — the texture window. 03 closes.

The one live page, `prototypes/webgl/index.html`. 39 gates green on a normal network and 39 green
again with every photograph held back by a random 40–340 ms, six perturbations red-then-reverted,
and the file restored byte-identical.

### The lever was spent, and 04's number needed correcting first

04 handed over *"396px sprites make `prep` 12× cheaper (302 ms → 25 ms) at 163 MB"*. Reproducing it
found two things wrong with it, neither of them 04's fault — it was a probe, and it said so.

- **163 MB was an upscale.** The probe resampled every sprite to *exactly* 396 px tall, including
  the ones already shorter. A 396 px **cap** — never upscale — is **133.3 MB**. The 30 MB
  difference was pixels invented at run time.
- **The 12× was mostly image-vs-canvas.** The probe replaced each `HTMLImageElement` with a
  `<canvas>`, and Chromium draws from a canvas by a cheaper path. Measured against real files at
  the same sizes, everything else identical: **531 ms → 335 ms → 212 ms** for master → 396 → 264.
  Real, and 2.5×, not 12×.

### Ruling 1 — the cap is the height the page draws at, and it is derived, not chosen

`prep()` draws every sprite at `hh = 132` CSS px, at every viewport and on every device, and
`fit()` clamps the canvas to `dpr = min(devicePixelRatio, 2)`. **264 device px is therefore the
tallest any photograph is ever rasterised at, on any screen, at any zoom** — the clamp is what
makes it a ceiling rather than a guess, and browser zoom cannot get past it. A source row above
264 is fetched, decoded, held for the life of the page, and thrown away by the resampler on its
way to the glass.

Both numbers are now named constants (`DRAW_H`, `DPR_CAP`), `bake_sprites.py` reads the cap off
their product, and `sprite_never_exceeds_its_draw` asserts the relationship — so moving either
side without re-baking is a red gate rather than a silent 300 MB.

| | decoded, all 230 | transfer |
|---|---|---|
| the masters, as round 9 shipped them | **301.2 MB** | 14.2 MB |
| 04's probe (every sprite resampled to 396) | 163.3 MB | — |
| a 396 px cap | 133.3 MB | — |
| **the 264 px cap, shipped** | **65.8 MB** | **6.5 MB** |

**The photographs are re-encoded once more and it was measured, not waved at.** The masters are
already lossy WebP (q88), so the bake is a second pass over the site's central asset. At q90 that
cost up to 10% of a sprite's pixels a visible step inside the alpha mask; q95 halves it for +25%
bytes over a set that is now streamed a handful at a time. Shipped at q95, alpha lossless.

**Judged at 1:1, not under a magnifier.** A 3× zoom of master beside bake reads as a real softening
on silk and engraving, and that comparison is a lie about the viewing condition — the object is
132 CSS px tall and moving. At the size it is actually drawn the two are indistinguishable,
including the worst case in the set (a Qing silk robe, mean delta 12.3/255). Sheet:
`prototypes/webgl/verify10/sprite-master-vs-bake.png` — master left, bake right, six subjects at
1:1. The masters in `prototypes/directions/img/` are untouched; the bake is one `bake_sprites.py`
run away from any other cap.

### Ruling 2 — a count is not a ceiling. Residency is bounded instead.

65.8 MB clears the 80 MB gate for **230** items. 01 put the set at 200–400, and the same cap at
400 items is 114 MB and over. 03 asked for a ceiling expressed as *max simultaneously-resident
image pixels*, and a number that scales with N is not one.

A sprite is read in exactly three places and all three sit inside one arrival: `prep()` solves the
landing height off its silhouette, the fall draws it, `land()` cuts it into fragments. After the
impact the object's pixels live in its own fragment canvases and the photograph is never touched
again; before its start it is not needed either. So it is fetched when the scrollbar comes within
`AHEAD = 4000 px` of its start, and released the moment it has been shattered.

**The ceiling: at most `ceil(AHEAD / min(PER)) + 2` = 10 photographs resident, each at most 264 px
tall.** Over the real set the worst run of ten consecutive arrivals is **4.29 MB**; measured peak
over 1,043 stops including nine hard jumps is **3.1 MB**, against an 80 MB gate. It does not move
when the set grows.

Two consequences worth having on their own:

- **First load is 8 photographs, 0.20 MB, overlay gone in 835 ms.** Round 9 awaited all 230 —
  14.2 MB — before the first frame existed.
- **A scrollbar drag costs what it shows.** 0 → 120,000 px passes 188 arrivals and puts 7 on the
  ground: **21 photographs fetched**, because the retire branch runs before the two branches that
  need pixels and the other 188 are never asked for.

### Ruling 3 — no pixels, no fall; and the window may delay an arrival, never re-order one

`prep()` solves the exact height of contact from the real outline, so an object prepped from its
bounding box lands somewhere else — and the same scroll position would then draw two different
frames depending on what had finished loading. An arrival whose photograph has not arrived is
therefore in exactly the state it is in above its own start: not here yet. A counter inside
`prep()` is the tripwire (`landing_is_solved_from_the_silhouette`).

**A stalled arrival stalls everything behind it**, and that half was found by a gate rather than by
reasoning. `drops` is walked in index order, which is date order, so in an all-resident build the
thing an arrival ties to has always landed first — `land()` reads that and arms the tie only if
the partner is already down. With a window, whichever photograph came back first landed first, so
an arrival whose partner was still in flight drew no line, and **two first visits to the same
scroll position showed different ties**. Retired arrivals are unaffected: they need no pixels, so
a drag still costs what it shows.

### What the remaining 83 MB cost

Nothing that shows. The gap 04 left was never 83 MB of real pixels:

- **30 MB** of it was the probe upscaling sprites that were already smaller (163.3 → 133.3).
- **67 MB** more is rows above the height the page draws at, which no screen has ever displayed
  (133.3 → 65.8).
- **the rest, and then some**, is residency: 65.8 → **3.1 MB** measured peak.

Priced honestly, what it did cost: one build step (`bake_sprites.py`, ~9 minutes of encoding); a
second lossy encode of the photographs, measured and invisible at 1:1; and two rules in the engine
— *no pixels, no fall* and *no overtaking* — which on a slow network show as the ground filling in
a beat behind a scrollbar drag. Frame cost did not go up: the p95 floor went **21.0 → 18.4 ms** and
the worst warm pass **22.7 → 18.7 ms**.

### The audit — carry / adapt / discard

Retrospective rather than speculative: this is what actually happened to each piece across rounds
04–10.

| Deep Time piece | verdict | why |
|---|---|---|
| Astro 5 static scaffold + build config | **carry, not yet taken** | the prototype is one `index.html` and ES modules over `python -m http.server`. Astro buys the build-time bakers, the OG card and a deploy Vercel already understands. A build-phase move; nothing here resists it. |
| single 2D canvas + one rAF loop on native scroll | **carried — it is the whole engine** | 03 asked whether the canvas exists here at all. It does, for a reason Deep Time did not have: the photographs are **cut into pieces and redrawn every frame**. DOM and CSS cannot shatter a photograph. |
| the code-generated field (`field.ts`, field keyframes) | **discard** | there is no synthetic environment. What sits behind the objects is 06 round 9's *light* — four fills and a baked star field — not a field. |
| no-collision contract + scroll-sweep gate | **carried, rebuilt at word level** | 06 round 8 made the word the unit; the sweep asserts zero rectangle intersections over individually positioned words at 1440×900 **and** 390×844. |
| build-time halo/scrim baker | **adapt** | same conclusion reached independently and for the same reason: the surface, the earth, the star field and the backdrop are each baked once and blitted. Runtime fills cost 3–6 ms. |
| contrast gate (3:1 boundary) + 4.5:1 scrim solver | **carried, and it got easier** | 13 froze the ground, so the worst case is single-ended. Measured **5.21:1** off composited pixels, not asserted. |
| the accessibility contract | **partly carried; the rest is outstanding** | `REDUCED` is honoured (one split instead of two, 8 shards instead of 13) and every citation carries a visually-hidden unbroken string. Keyboard milestone jumps and `inert` regions are **not built** — [08](08-accessibility-and-mobile.md) owns them. |
| image pipeline: WebP over AVIF, exact alpha, size from the opaque subject | **carried** | 05's `source5.py` mattes and sizes from the subject; the bake keeps WebP with `alpha_quality=100`. |
| CDP assertion harness | **carried, and it is the discipline** | every round since 04 ships a headless sweep whose new gates were each broken on purpose first. |
| `+ 100lvh` document padding | **carried** | `spacer.style.height = TOTAL + innerHeight`. |
| `record.json`'s 58 entries | **discarded as data, carried as method** | 05 authored 230 fresh against written targets; the two-epoch defect never entered the copy. |
| `public/art/record/*.webp` (max 160 px) | **discarded** | re-sourced at full resolution by 05, then capped here at the height they are drawn. |

**The stack, stated:** one 2D canvas, one rAF loop reading `scrollY`, ES modules, DOM text over the
canvas for every word, no framework and no vendor tree (round 8 deleted three.js and matter.js).
Astro is the build-phase wrapper, not a runtime dependency.

### The index surface — budgeted, as 01 asked, and it needs its own assets

[10](10-the-index-surface.md) is the one screen that may want every item at once, and the
arithmetic is `w × h × 4` from intrinsic dimensions — **CSS scaling does not reduce it**, so the
index cannot point at these sprites and shrink them in a stylesheet. Independently derived
thumbnails, all 230 resident:

| thumbnail height | decoded |
|---|---|
| 64 px | 4.3 MB |
| 96 px | 9.6 MB |
| 128 px | 17.1 MB |

All three fit. At 400 items the 128 px row is 29.7 MB and still fits. **The index is a second bake,
not a second window.**

### What the sweep says — 39 gates, 39 green, twice

All 34 of round 9's re-run green, including `credit_contrast` at **5.21:1** over 455 composited
samples, `no_text_collision` at **0** over 290 stops at both sizes, and `ground_never_dates` at 30
byte-identical earth pixels across five eras. Six new, plus a moved frame budget:

| gate | result |
|---|---|
| `sprite_never_exceeds_its_draw` | 0 of 230 taller than 264 px (132 drawn × dpr 2) |
| `decoded_under_the_gate` | peak **3.1 MB** held, against 80 MB (65.8 MB if all were resident; 301.2 MB before) |
| `sprite_window_does_not_leak` | **0** held after 1,043 stops over the full 144,632 px, window bound 10 |
| `landing_is_solved_from_the_silhouette` | **0** landings solved without their own photograph |
| `jump_costs_what_it_shows` | **21** photographs fetched for a jump past 188 arrivals showing 7 |
| `window_is_not_a_clock` | two first visits agree on all 6 arrivals down — index, age, splits, dust, tie partner, fragments, specks, words, position |
| `frame_budget` | warm median **16.6 ms**, p95 floor **18.4 ms** (round 9: 21.0 ms) |

**Teeth — six perturbations, six reds, six reverts, file restored byte-identical.** A master
cut-out copied back over a baked one; `release()` disabled; round 9's residency restored in full
(all 230 masters, never let go — 301.2 MB, red); the landing solved without pixels; the window
wanting every sprite from the first frame; and the landing-order barrier removed.

### Three things were wrong before the page was

- **Two gates tested nothing on localhost.** A photograph comes back inside one frame on
  127.0.0.1, so the window is never late and nothing ever arrives out of order — *no pixels, no
  fall* and *no overtaking* both stayed green with their own code deleted. The sweep now has a
  `--slow` mode holding every sprite 40–340 ms, **randomised per request on purpose**, because a
  fixed delay preserves request order and out-of-order arrival is the failure mode. Both gates go
  red under it, and all 39 run green under it.
- **The residency counter agreed with the intention instead of measuring the holdings.** It tallied
  inside the branch that decides what to keep and skipped anything already landed, so a `release()`
  that had quietly stopped working read as a flat 15 MB while the page sat on all 230 photographs.
  It now counts every drop still holding a reference. The leak gate caught it.
- **A pixel diff of two builds measured nothing.** On Windows `glob` returns backslashes, so
  `f.replace('/A-','/B-')` paired every frame with itself and reported a perfect zero for a
  deliberately halved sprite set. Rewritten to pair on basename, with an assertion that the two
  paths differ.

And one measurement that had to be abandoned rather than fixed: **a screenshot comparison of two
first visits cannot be green on this page**, and that is not the window's doing. `Dust.impact` is
seeded by `Math.random`, and the deferred cut has a 4 ms/frame budget (06 round 8) that decides
whether the newest arrival's shards are split before or after they fly. **The shipped round-9 build
fails the same comparison** — checked on HEAD before this gate was written. So the gate compares
the structural state, which is where a window would show up, and the pixel claim is not made.

### One thing 04 left that this round had to repair

The debris integrator is fed the scroll delta of the frame the shards happen to be alive in, which
is fine while the visitor is scrolling and degenerate the moment an object lands on a frame with no
forward scroll. A scrollbar drag used to land everything on the same frame as the jump — one 240 ms
step paid by the jump's own delta — and a windowed sprite arrives a frame or two after that, into
`fwd = 0`, leaving its shards exactly where the cut left them: a shattered object that looks whole.
An arrival is now given the flight the scroll between its own impact and here has already paid for,
less whatever that frame already gave it. **On a walk the difference is zero, and on an
all-resident jump it is zero too** — it is a repair for the case the window created and for no
other. Measured against HEAD at the same stops: piece counts and spans match.

### Handed on

- **[10](10-the-index-surface.md)** gets the thumbnail table above and the rule that produced it:
  CSS scaling does not reduce decoded cost, so the index needs its own bake.
- **[08](08-accessibility-and-mobile.md)** still owns keyboard milestone jumps and `inert`, the
  only part of Deep Time's accessibility contract not carried. The **real-device phone test remains
  the project's ship gate** and no sweep replaces it — the window makes the first load 0.20 MB,
  which is the thing most worth checking on a real connection.
- **The build phase** inherits a stack that is already decided and a bake step already written.
  `bake_sprites.py` is the only place the sprite size is set.
