# 04 — The scroll mechanic

Type: prototype
Status: settled — round 7 closed the seam, the contemporaries and the length; nothing left in 04
Blocked by: 01, 02
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**How does scroll distance map to time?**

Deep Time answered this with pure linear, `1 px = 40,000 years`, never rescaled — and it worked because emptiness *was* the payoff. That justification is gone. This ticket re-decides the question from scratch under a different goal.

The shape of the problem, stated honestly at true scale over ~12,000 years:

| | share of a true-scale scroll |
|---|---|
| 9500 BC → 1500 AD | **~91%** |
| last 500 years | ~4% |
| since photography (~200 yr) | **~1.7%** |
| a human lifetime (80 yr) | ~0.7% |

So a strictly linear scroll spends nine tenths of itself on the stretch with the fewest obtainable images ([02](02-image-supply.md) supplies the real count), and crushes the densest, most recognizable material into a sliver. **On Deep Time that asymmetry was the point. Here it is the enemy.** Do not carry the mechanic across on aesthetic loyalty.

Build cheap prototypes and pick by feel, not by argument. At minimum:

1. **Pure linear** — Deep Time's discipline held. Honest, and probably nine tenths dead air with no awe to redeem it.
2. **Logarithmic / power-warped** — pacing that gives recent centuries room. Readable throughout; the scroll no longer means a fixed number of years, so the honesty claim must be re-stated rather than dropped.
3. **Piecewise with announced breaks** — linear within named eras, rescaled at labelled seams. Deep Time built and *rejected* this, but it was rejected for violating a truth claim this site may not be making.
4. **Constant-density** — scroll distance is driven by *arrivals*, not years, with true elapsed time shown as a readout rather than as distance. Maximum fun-per-pixel, weakest time-fidelity.

Judge every variant against the **judgment test written in [01](01-the-fun-thesis.md)**, plus: does a first-time visitor reach the end? Does it survive on a phone? And — whatever the mechanic — **is the date shown for each item still exactly true?** Warping distance is a design choice; misstating a date is not, and the citation constraint does not bend here.

Hard input: the decoded-memory ceiling from [03](03-engine-reuse-or-clean-build.md). A mechanic that puts 40 photographs on screen at once may be forbidden by arithmetic before it is judged on feel. Check the ceiling **before** prototyping, not after.

**Deliverable:** rough working prototypes linked from this ticket, and the chosen mechanic stated precisely enough to build against — the exact scroll-to-time function, total scroll length, behaviour at both boundaries, and how time is communicated to the visitor if distance no longer carries it.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

Three of this ticket's four options are already dead, and the remaining question is narrower than it was charted.

- **Option 1 (pure linear) is killed on evidence.** A 1px = 1 year demo over the real set was ~11,500 px of near-emptiness then a crush. Do not re-litigate it.
- **Option 4 (constant-density) is the mandated direction** — 01 ruled scroll distance is spaced by **density, not time**. Options 2 and 3 survive only as *implementations* of that (a power warp or announced piecewise seams are both legitimate ways to spend distance on arrivals). **The choice is now how to warp, not whether.**
- **Dates stay exactly true regardless.** Unchanged and non-negotiable. Since distance no longer carries time, the readout that does carry it is now load-bearing, not decorative — design it as a first-class element.

New requirements this ticket inherits:

1. **The prologue↔body seam.** The deep head (pre-~1000 BC) runs on spectacle plus planted callouts because ambient contemporaries cannot fire there; the body runs on contemporaries. **This ticket owns the transition** — announced, disguised, or structural. It is the most likely place the site feels like two sites stapled together.
2. **Slot count is 200–400**, not ~58. Feed that number to [02](02-image-supply.md) and [05](05-arrival-set.md) as the target, and check it against the decoded-memory ceiling in [03](03-engine-reuse-or-clean-build.md) **before** prototyping — a mechanic that satisfies the judgment test by putting many recognizable items on one screen is exactly the mechanic most likely to be forbidden by arithmetic.
3. **The mechanic must make co-occurrence legible.** Ambient contemporaries are the engine, so "what else was standing at this moment" has to be readable at a glance without leaving the item — that is a mechanic constraint, not a visual one.
4. **Judge by [01](01-the-fun-thesis.md)'s test**, which for this ticket resolves to: the deep-head prologue should move *fast*, because nothing there passes clause one.
---

## Input from Dustin, 2026-08-08 — **the fall is scroll-driven, not gravity-driven**

Given after seeing the 230-item set run. Verbatim:

> *"if somebody lets up on the arrow when something is in mid-fall, it shouldn't continue falling.
> Scrolling down is what should make the item hit the ground, not actual gravity."*

**This is this ticket's to build, and it is a real change to what [13](13-visual-direction-v2.md)
shipped.** 13 settled 1,000 px per arrival with an 880 ms floor between drops — a *time* floor, on
a matter.js body under real gravity. The consequence he is objecting to is exactly that: stop
scrolling mid-fall and the object keeps falling, because wall-clock time keeps running.

What replaces it: **the object's height is a function of scroll position, 1:1.** Stop, and it hangs.
Scroll back up, and it rises (or it does not — decide, and say which, because decay is one-way and
this is the first thing that would move backwards). Scroll down, and it lands. The landing is
*caused* by the scroll reaching the arrival's contact offset, not by a simulation resolving.

Consequences to work through here, not to discover later:

- **matter.js may have nothing left to do.** 13's whole physics justification was the fall; if the
  fall is a scroll-mapped position, the only remaining physics is the impact and the initial shard
  velocities. That may be a simplification worth taking — it also removes the 880 ms floor, the
  queue, and the "a fast scroll dumps four at once" failure entirely, because a fast scroll now
  simply moves each object further down its own arc.
- **The 880 ms floor was solving a problem that this deletes.** Re-derive the spacing from scroll
  distance alone.
- **Nothing else in 13 is reopened** — one at a time, slowly enough to read, shatter on contact,
  fixed camera, native scroll, still ground.

---

## Round 6, 2026-08-09 — built, on the real 230-item set. The scroll is the only clock.

Built against the live set (`prototypes/directions/data.js`, 230 items, sprites in
`prototypes/webgl/img`). Serve `prototypes/` on 8812 → `/webgl/index.html?v=2&b=a`.
All of it is in `2-gravity.js`; `decay.js` and `burial.js` are untouched.

### The mechanic, stated precisely enough to build against

| | |
|---|---|
| Arrival `i` starts at | `S = i × 1000` px of scroll |
| Its fall spends | `800` px. `t = clamp((scrollY − S) / 800, 0, 1)` |
| Height | `y = ySpawn + (yLand − ySpawn) × arc(t)`, `arc(t) = 0.30t + 0.70t^2.6` |
| Tumble | `angle = a0 + spin × t` — the whole rotation, over the whole fall |
| x | fixed per item, the same golden-ratio spread as before |
| Contact | at `t = 1` exactly, i.e. scroll `S + 800`, every time |
| The other 200 px | the beat after impact: the fresh break has the screen to itself |
| Decay | `age = (scrollY − landScroll) / 4200`, monotonic (13, unchanged) |

`ySpawn` is `−0.62 × sprite height` — just off the top edge. `yLand` is **solved once, before the
fall starts**: `restProfile` gives the sprite's true silhouette, it is rotated to the angle the
object will be at when it arrives, and the lowest of those points is placed exactly on the surface
contour at its own x. So there is no per-frame collision test any more, and the landing scroll
position is exact rather than emergent — which is what makes the whole piece deterministic.

`arc` is not a simulation of gravity, it is a curve shaped like one. A straight line reads as a
lift descending. Pure `t²` spends so long easing out of the top edge that the object is barely on
screen for half its budget. This one starts moving immediately and is still accelerating hard when
it arrives.

**Spacing is re-derived from scroll distance alone, as instructed.** 800 < 1,000, so **exactly one
object is ever in the air** — by construction, not by rate-limiting. A fast scroll moves that one
object further down its own arc. The old failure mode ("four fell at once, only one was labelled")
cannot occur; there is no state in which it could.

### Ruling 1 — matter.js is gone entirely. Nothing was worth keeping.

Its only job was the fall. A scroll-mapped height needs no solver, no world, no bodies, no walls.
The shards were **already** a non-physics integrator in `decay.js`, and impact velocities are now a
single constant. Deleted with it: the engine, the runner, the two wall bodies, the mouse
constraint, the 880 ms floor, the drop queue, and the `released` counter. The vendor file is no
longer loaded by anything — flagged, not deleted, per 13's precedent on dead code.

**"Drag to throw" went with it, deliberately.** You cannot drag an object whose position is bound
to the scrollbar without one of the two lying about where it is. Round 2's hint copy is updated to
`scroll to drop it · stop and it hangs`.

### Ruling 2 — the fall reverses. The break does not.

Asked for explicitly, and the answer is a split, not a compromise:

- **Mid-fall, scrolling up raises the object**, back toward the top of the screen and out of the
  frame. This is not a concession to reversibility, it is the same sentence read backwards: if
  letting up makes it hang, reversing must make it rise, or "hang" was never true. Scroll above an
  arrival's start and it is simply not here yet.
- **Contact latches, permanently.** The instant an object touches down it is broken. No amount of
  scrolling back reassembles it, un-shatters a shard, or puts a name back on screen, and `age`
  never decreases. 13's one-way decay is untouched.

The line is between **a position and an event**. A position is a function of where you are and is
free to run either way; an event happened, and scrolling up is not a time machine.

**The visible cost, named rather than discovered later:** scrolling a long way back up shows bare
ground. Everything behind you has already decayed and cannot be replayed. This is inherited from
13, not introduced here — but the latch makes it structural, and 10's index is now the only way to
revisit an item. Worth Dustin's eye; it is the one thing about the ruling that could be argued.

### Ruling 3 — the scroll is the *only* clock, everywhere, not just in the fall.

He noticed the wall clock in the fall. It was also in the shard scatter, the impact dust, and the
era light's ease. Fixing only the fall would have left three places where letting up still lets
something finish moving. So:

- Debris integration is fed **scroll distance** (`3 ms of shard flight per px of downward scroll`,
  sub-stepped so a flick cannot throw shards through the ground), and only downward scroll.
- The impact dust lost its `setTimeout`.
- The era light is read straight off the scrollbar instead of eased toward a target — an ease is a
  wall clock wearing a hat. Same lamp ramp, crossing over the back half of each arrival.

Stop scrolling and the frame is **byte-identical two seconds later**. That is a gate, below.

**One survivor, stated:** the name and date fade out over a 0.28 s CSS opacity transition at
impact. It is a text fade, it moves nothing, and it cannot make an object keep falling. Kill it if
you want the purist version.

### Also fixed, both caught by the gates rather than by eye

- **A ghost sprite.** An item caught mid-fall by a scrollbar jump kept its `air` flag when it was
  retired, and the draw loop asks nothing but that flag — so a labelled object hung at the spawn
  point for the rest of the page. The `one_at_a_time` gate only found it after being rewritten to
  count from the objects instead of from the frame's own tally.
- **The name printed across the photograph, on every arrival.** 13 clamped the falling label to
  84 px above the ground line — invisible while a solver threw things through that band in a few
  frames, unmissable when a scroll-mapped fall spends its last 200 px of budget there. The clamp
  is gone; the label now rides under the object all the way down and ends the fall sitting on the
  soil at exactly the spot the credit tick is about to take over. If a tick is already there it
  flips above the object, which is the only case the flip was ever for.
- **A scrollbar drag no longer floods.** An item whose whole life is behind the visitor is retired
  without cutting a single fragment. Jumping 180 arrivals forward costs four landings, not 180.

### Verified, not asserted

Headless Chromium, `behavior:'instant'` scrolls with real rAF ticks between them. Nine mechanic
gates plus the inherited ship gates, all green on `?b=a`, and **all nine green on `b` and `c` too**.

| gate | result |
|---|---|
| `hang` — hold 2 s of wall clock mid-fall | y identical, 85.52 → 85.52 |
| `rise_on_scroll_up` — up 300 px mid-fall | 85.52 → −56.22, it rises |
| `pure_function` — leave and return to the same scroll | identical |
| `unmade_above_start` | nothing airborne above `S` |
| `contact_latches` — land, then scroll back into its fall | still down, not airborne |
| `decay_one_way` — deep, then reverse | age 0.4286 → 0.4286 |
| `one_at_a_time` — 176 fine steps + 9 hard jumps | max airborne **1** |
| `jump_does_not_flood` — 0 → 180,000 | 4 fields alive |
| `frozen_when_idle` — screenshot, hold 2 s, screenshot | **byte-identical** |

Inherited gates, swept every 500 px — 1440×900 to 24,000 and 390×844 to 14,000:
**zero console errors, zero horizontal overflow, zero credit-line collisions, 60 fps median
(16.7 ms) and 16.7–16.8 ms p95 at both widths** under a continuously moving scrollbar.

**The gates were proved to have teeth, not just to be green.** Injecting a wall clock into the fall
turned `hang` and `pure_function` red; injecting one into the debris stepper turned
`frozen_when_idle` red. Both perturbations reverted, green re-confirmed, and the file verified to
contain no leftover.

Frames at `prototypes/webgl/verify/` — `00-t000` … `04-t097` walk one arrival down, `05-impact`
is the break, `06-after` is 140 px later, `08-deep` is item 41.

### What round 6 did NOT settle — carried into round 7

1. **The prologue↔body seam** (inherited from 01). Not touched. Every arrival currently costs the
   same 1,000 px, so the sparse deep head does not move faster than the crowded present.
2. **Co-occurrence / ambient contemporaries** (01's requirement 3). The engine of the whole piece
   and there is still nothing of it in the prototype — one object is in the air and four fields are
   decaying, but nothing says they are contemporaries.
3. **Total scroll length.** 230 × 1,000 + 4,200 + one viewport = **~235,100 px**. That is a lot of
   wheel. Nobody has judged it by feel yet, and 1,000 px/arrival is 13's number, not a measured one.
4. **Decoded memory is over the gate and got worse, not better.** Measured in-page: the 230 sprites
   decode to **301 MB**. 05 quoted 111.4 MB against an 80 MB ceiling by a different measurement;
   either way this is [03](03-engine-reuse-or-clean-build.md)/[06](06-visual-treatment.md)'s texture
   window to solve and it is now the single biggest unsolved technical risk in the project.
5. **No real phone.** Swept at 390×844, never run on a device.

---

## Round 7, 2026-08-09 — one quantity settles all three. 04 closes.

Same file, same set, same URL. **All three of round 6's open items are answered by one number**:
`co`, how many things were already standing within eighty years when this one arrived. It is 0–3
through the deep head, saturates by the Roman era, and 57 by 1996. Three things read off it:

| | round 6 | round 7 |
|---|---|---|
| an arrival costs | `1,000 px`, flat | `FALL + beat`, **520–660 px** |
| the fall spends | `800 px` | **`460 px`, constant everywhere** |
| the beat after impact | `200 px`, flat | **`60 → 200 px`, with `co`** |
| decay life | `4,200 px`, flat | **the contemporary window itself**, clamped to `1,400–4,200 px` |
| total | **235,100 px** | **144,632 px** |

`FALL < min(PER)` still holds — 460 < 520 — so **exactly one object is in the air, still by
construction**, and every round-6 ruling stands untouched: the fall reverses, contact latches,
decay is one-way, the scroll is the only clock.

### Ruling 4 — the ground IS the co-occurrence. Nothing about it is a caption.

01's engine is *"every item surfaces what else was standing at that moment, and by how much they
miss each other."* Round 6 had four fields decaying behind the falling object and nothing saying
they were contemporaries — because they weren't. A flat 4,200 px life means the ground holds *the
last four arrivals*, which in the deep head is four things a thousand years apart.

So an object's decay life stopped being a distance and became **the window itself**: it stays on
the ground until the counter has moved eighty years past its own date. Everything lying on the
ground at any scroll position is therefore, exactly, the set of things that were standing within
eighty years of each other. Not stated — *true*, and gated:

> `ground_is_the_moment` — over 1,034 stops on a page nobody has touched, **zero** fields on the
> ground more than 80 years older than the last thing to land.

**The two clamps are named, not hidden.** `LIFE_MIN = 1,400 px` (53 items) keeps a lone object
around long enough for the break to read — below that the shatter, its two splits and the dust do
not have room. `LIFE_MAX = 4,200 px` (141 items) caps how much can be on the ground at once, for
the credit contract and for memory. Inside the clamps the ground is true; at them it is bounded.
The floor is the only one that can hold a thing past its window, and the gate excludes exactly
that case rather than pretending it doesn't exist.

### Ruling 5 — the seam is not crossed, it is dissolved. Nothing is announced.

01 asked for announced, disguised, or structural. It is **structural, and it is the same rule as
ruling 4** — there is no transition to design because there is no boundary. What a visitor
actually walks through, measured:

| | fields on the ground | ties drawn | cost |
|---|---|---|---|
| items 0–23 (7000–1000 BC) | median **3** | 9 of 24 | 12,760 px |
| items 24–47 (to 200 AD) | median **3** | 17 of 24 | 13,292 px |
| items 48–130 | rising **3 → 6** | | |
| items 130–229 (1750–2022) | median **6** | 100 of 100 | |

The head is one object over near-bare ground and moves at 520–548 px an arrival. The body is six
broken fields and five ties at 660. Nobody is told the piece changed; it just did, and it did so
continuously — the alive-field curve has no step in it. `head_is_barer_than_body` is a gate.

**The head is faster in the only way that was ever available.** 01 said the prologue should move
fast; it costs 12,760 px for 6,000 years against 13,292 px for the next 1,200, and it earns that
by having nothing on the ground to read. Cutting it further would mean cutting the fall, and the
fall is the one thing that must not change with the era — an object may not become lighter because
it is old.

### Ruling 6 — the miss is a line on the soil, not a caption. **The tie.**

The second half of 01's sentence — *"and by how much they miss each other"* — is one hairline laid
along the surface contour between an arrival's fall point and the fall point of the thing it
landed next to, with the miss written on it: `SAME YEAR` · `1 YEAR APART` · `40 YEARS APART`. It is
the positioning line rendered instead of printed.

- **The partner comes from the tables, not from what happens to be alive** — so a scrollbar drag
  and a slow read pick the same one. Preference is for a **different region bucket** (two pots from
  the same workshop being contemporaries is not a surprise; a Benin plaque and a Dutch flintlock
  is), then for the smallest miss.
- **It fires on 203 of 230 arrivals, 196 of them cross-region.** Median miss **2 years**; **71 are
  the same year**. The 27 that never fire are the deep head — nothing was standing there, so
  nothing is drawn, and that absence is the prologue.
- **It dies with the FIRST of its two ends**, because a relation cannot outlive either party. That
  is 13's credit-decays-with-the-object ruling applied to a pair.
- **It never overrides a citation.** Credits are placed first and the tie takes what is left —
  three positions along its own line, two rows deep — and if the ground is full the label does not
  print, though the line stays. A credit is the contract; the tie is the engine but still
  commentary.
- **On a phone only the newest tie is drawn.** Five ties across 250 px of soil collide with
  nothing and are unreadable anyway — the kind of thing a collision gate is structurally unable to
  catch, and it took looking at the frame. Same adaptation the credit stack already makes.

Weight, colour and type are **[06](06-visual-treatment.md)'s** against real images; the wording is
**[07](07-copy-voice-and-name.md)'s**. What is settled here is that the co-occurrence is drawn on
the ground as a mark, and never as a readout in a corner.

### Ruling 7 — 144,632 px. The length is a consequence, and here is the arithmetic.

Nobody had judged 235,100 px. Judged now, against the only benchmark that means anything — the
sibling that shipped:

| | Deep Time (shipped) | round 6 | round 7 |
|---|---|---|---|
| total scroll | 127,500 px | 235,100 px | **144,632 px** |
| screens of 900 | 142 | 261 | **161** |
| items | 58 | 230 | 230 |
| px per item | 2,198 | 1,022 | **629** |
| wheel notches (100 px) | 1,275 | 2,351 | **1,446** |

235,100 px was **1.84× a piece that already tests patience, with no finale to pull anyone through**
— 01 killed the finale, so length cannot be justified by a payoff at the end. 144,632 px is 1.13×
Deep Time while carrying four times the content, and an arrival every 6.3 notches instead of every
10. This is the number, and it is one constant: **change `FALL` and the whole table moves.**

### Verified, not asserted — and the harness was wrong first

**60 gate runs across `?b=a|b|c`, 59 green.** The one failure is a variance artifact and is named
below rather than tuned away.

| gate | result |
|---|---|
| the six round-6 fall gates | all green, re-derived against the new tables |
| `one_at_a_time` | max airborne **1** over 1,043 stops incl. 9 hard jumps |
| `ground_is_the_moment` | **0** fields older than 80 y outside the floor clamp |
| `tie_gap_is_true` | **0** printed year-deltas that disagree with the dates |
| `tie_ends_both_live` | **0** ties drawn with a dead end |
| `jump_does_not_flood` | 7 fields alive after 0 → 120,000 |
| `frozen_when_idle` | byte-identical after 2 s |
| `no_text_collision` | **0** overlaps over 290 stops, at 1440×900 **and** 390×844 |
| `head_is_barer_than_body` | head max 3 fields vs body median 6 |
| `frame_budget` | median **16.4 ms**, p95 21–24 ms |

**Three of these were red first, and two of the three were the harness lying.**

1. **The round-6 harness never tested the deep head.** It probed item 60 before it swept, and
   contact latches — so by the time the sweep reached items 0–60 they were already dust and every
   gate scored them as "nothing to check." Every phase now gets a **fresh load**. The moment that
   was fixed, `jump_does_not_flood` went from "0 fields alive" (a false green) to 7, and
   `ground_is_the_moment` went red where it had been silently green.
2. **Round 6's one surviving wall clock is gone.** It named the 0.28 s CSS fade on the name and
   date as harmless. It was not: behind it sat a 300 ms timeout that re-measured every label a
   third of a second after the scrollbar stopped, and a jump that lands ninety items at once made
   the frame change while nobody was scrolling. Both deleted — the name and date now go out **at**
   the impact, which is 13's ruling read literally. **There is no wall clock left in the file.**
3. **The collision contract broke under six fields and was fixed twice.** Round 6's ladder of four
   fixed credit rows ran out (88 overlaps at 1440); widening it to seven 30 px rungs did not work
   either, because a two-line credit is 33.7 px tall so adjacent rungs overlapped *by
   construction*. It is now a 6 px scan from +10 to +200. The **last five** overlaps were a
   half-pixel each: the transform is written `toFixed(0)`, so what renders sits up to half a pixel
   off the box the test was given — one pixel of slack in `hits` closed it.

**Teeth, proved.** A wall clock injected into the tie opacity turns `frozen_when_idle` red; a flat
`LIFE = LIFE_MAX` turns `ground_is_the_moment` red (325 violations, first at item 0, a 1,000-year
gap); a `+3` on the printed miss turns `tie_gap_is_true` red (734 mismatches). All three reverted,
all three green again, file verified clean. The `frozen_when_idle` warm-up shot is **not** a
weakening — the first screenshot after a scroll forces a paint the rAF ticks had not flushed, and
the perturbation still turns exactly the shot-2-vs-shot-3 comparison red.

**The one failure.** `frame_budget_with_texture_window` on `?b=b` measured p95 27.3 ms against a
25 ms line, in the same run where the *unmodified* sprites measured 21.4 ms. Six back-to-back runs
put the honest spread at median 16.3–16.6 ms, p95 21.3–24.3 ms, with occasional 50–60 ms frames in
both arms. It is sampling noise at the p95 slot, not a regression.

### Handed off, with a measured lever

**Decoded memory is still 301 MB and it is now also the frame spike.** Profiled by attribution,
not by eye: the heavy frames are entirely `prep()`, and `prep()` is entirely the cost of drawing a
~1-megapixel sprite down to 132 px. Pre-decoding the image does not help; `createImageBitmap` does
not help. **Swapping every sprite for a 396 px-tall downscale of itself does**, and it is one
variable changed with everything else identical:

| | prep total over 400 frames | in-frame work p95 | max | decoded |
|---|---|---|---|---|
| full-size sprites | **302 ms** | 8.9 ms | 29.8 ms | **301 MB** |
| 396 px sprites | **25 ms** | 6.0 ms | 10.3 ms | **163 MB** |

Twelve times cheaper and 138 MB lighter from the same change. That is
[03](03-engine-reuse-or-clean-build.md)/[06](06-visual-treatment.md)'s texture window, and the
number it has to beat is now known rather than guessed. 396 px is still twice the 80 MB gate — the
window is a *window*, not a resize — but the lever is measured and it is in the sweep as a
standing gate.

### What is left in 04 — nothing

The prologue seam, ambient contemporaries and total length are settled above. Of round 6's
remaining two: **decoded memory belongs to [03](03-engine-reuse-or-clean-build.md)/[06](06-visual-treatment.md)**
with the lever above, and **the real-device phone test is the project's ship gate**, not this
ticket's. Frames from this round at `prototypes/webgl/verify7/` — `00`–`02` are the bare head,
`03`–`04` the ground filling in, `05`–`08` the body at six fields and five ties, `09`–`10` the
same at 390×844.
