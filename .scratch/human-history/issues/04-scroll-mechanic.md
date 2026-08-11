# 04 — The scroll mechanic

Type: prototype
Status: **REOPENED at round 8** by Dustin's ruling that the break reverses too. Round 6's ruling 2
is half struck; the mechanism is stated below and is **not built**. Rounds 6 and 7 otherwise stand.
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

---

## Round 8, 2026-08-10 — the break reverses. Ruled by Dustin. Nothing built yet.

Dustin: *"when I scroll up the items should reverse."* Round 6 ruling 2 had already split that
sentence in half — the fall reverses, the break does not, *a position runs both ways and an event
does not* — so the round opened by establishing which half he meant rather than by building. He
was shown three readings priced against each other and picked **the full rewind**.

**But the round found something before it asked, and that finding is why the question was worth
putting to him at all: neither half is what the page actually does on a scroll-up.**

### The scroll-up is a live defect, and 41 green gates say it is fine

The fall does reverse — confirmed live, not merely inherited: at `y=55,020` the Engraved shell
gorget sits mid-fall at `py=84`; 150 px back up it is at `py=-45`; 300 px back up it is above its
own start and not here yet. Round 6 ruling 1 holds exactly as written.

**The ground does neither.** It does not reverse and it does not clear. It **freezes at the age it
reached and rides all the way home with the visitor**, while the counter keeps running backwards:

| walked to 100,000, then scrolled up | the counter reads | newest thing still lying on the soil |
|---|---|---|
| 0 | 1934 CE · TUNGSTEN | Coupé utility, 1934 |
| 6,000 | 1903 CE · CARBON FILAMENT | Coupé utility, 1934 |
| 25,000 | 1800 CE · ARGAND LAMP | Coupé utility, 1934 |
| 50,000 | 1500 CE · CANDLE | Coupé utility, 1934 |
| **100,000 — the top of the page** | **7,000 BCE · FIRELIGHT** | **Coupé utility, 1934** |

The five ages are byte-identical at every stop (`0.754 · 0.597 · 0.44 · 0.283 · 0.126`) because
`d.age` is clamped monotonic on purpose. So the ground stops answering the scrollbar while the
counter does not, and the piece ends up printing a Neolithic year over a heap of twentieth-century
wreckage — a red car, a Bakelite radio, and their `SCIENCE MUSEUM / LONDON` credits — **directly
underneath its own opening sentence, *"Whatever is still lying there was standing at the same
time."*** Frame: `prototypes/webgl/verify04r8/04-top-still-1934.png`.

**Round 7 ruling 4 is therefore false in one direction.** *"What lies on the ground at any scroll
position is exactly what was standing within eighty years of it"* is true walking down and false
walking up, by 8,934 years at the worst stop measured.

**No gate could have caught it, and that is the finding worth keeping.**
`ground_is_the_moment` is **one-ended**: it asks only whether a field is more than 80 years
*older* than the last thing to land. A field 8,934 years *newer* than the counter cannot fail it,
at any threshold. It also sweeps forward, *"on a page nobody has touched"* — which is round 7's
own words for the one visitor it was built to model. **`sweep10` was run against this defect
unmodified and returned 41/41 green.** This is the **fourth** round in this project where the
instrument was aimed one way and the page was wrong in the other, and the first where the gate was
wrong about a *direction* rather than about a stride, a sample or a measurement.

### The cost in MB, as instructed — and the premise being tested was wrong

The instruction was to price the rewind before designing it, because *"a sprite is released the
instant it shatters"* is what holds 03's texture window under the 80 MB gate. Priced two ways: an
exact residency sweep over the real 230-item tables (`START`/`LAND`/`LIFE` recomputed from
`data.js`, decoded cost `w × h × 4` off the real baked sprite dimensions), and a live in-page probe
walking all 144,632 px. **The method reproduces 03 round 10's published figures exactly** — 65.8 MB
all-resident, 26.2 MB of thumbnails, and a 3.08 MB measured peak against its 3.1 MB — so the new
rows are read on a validated instrument.

| what has to be resident | peak decoded, real 230 set | 80 MB gate |
|---|---|---|
| shipped today — released the instant it shatters | **3.1 MB** | ✓ |
| the ground merely stops lying (release, don't retain) | ≤ 3.1 MB — it goes **down** | ✓ |
| the break rewinds inside each object's own life | ~5 MB (fragments peak **0.92 MB**, 297 pieces) | ✓ |
| **+ dead objects resurrect, 4,000 px symmetric window** | **7.7 MB**, 20 photographs | ✓ **10× under** |
| unbounded — a pure function of scroll over the whole page | 65.8 MB, all 230 | ✓ barely |
| unbounded, at 01's 400-item upper bound | **114.4 MB** | ✗ **over** |

**Ruling 8a — memory does not forbid the rewind, and the objection it was expected to raise is
withdrawn.** 7.7 MB is 2.5× the shipped peak and an order of magnitude under the gate; 03 round 10's
*"at most ten resident"* simply becomes *at most twenty*, and it still does not move when the set
grows to 400, because it is bounded by a scroll window and not by a count. **Only the unbounded
reading is expensive, and only at 400 items** — so the window stays a window and `BACK` is a named
constant beside `AHEAD`, not an absence of one.

### What it does cost — three wall clocks, all of them in the post-impact half

The reason the break does not reverse is not memory and never was. It is that **the state after
impact is not a function of scroll at all**, in three places, each already named in an earlier
ticket and each now load-bearing:

1. **The dust is seeded by `Math.random`** — seven call sites, all in `burial.js`. 03 round 10 hit
   this and had to abandon a screenshot comparison over it: *"a screenshot comparison of two first
   visits cannot be green on this page."*
2. **The deferred cut decides which state is drawn.** Cutting gets a 4 ms/frame budget, so whether
   the newest arrival's shards split before or after they fly depends on what else the frame was
   doing. The same age can draw two different generations.
3. **`stepPieces` is one-way by construction** — forward Euler with a bounce branch and a
   `p.rest = true` latch, fed `Math.max(0, dScroll)`. It cannot be run backwards, and `d.age` is
   deliberately clamped monotonic on top of it.

### Ruling 8b — the mechanism. Everything is a lookup, the break included.

Stated precisely enough to build against, which is all this round does.

| at scroll `y`, for arrival `i` | |
|---|---|
| `rel` | `y − START[i]` |
| state | `rel < 0` not here yet · `rel < FALL` in the air at `t = rel/FALL` · else down |
| `age` | `clamp((y − LAND[i]) / LIFE[i], 0, 1)` — **no longer monotonic**, and `down`/`gone` stop being flags and become predicates |
| generation | the count of `SPLITS` at or below `age`; dusted at `age ≥ DUST_AT` |
| flight | `(y − LAND[i]) × MS_PER_PX`, less what earlier generations already spent — the same quantity round 10's landing repair already computes, promoted from a repair to the definition |
| shard pose | replayed from that generation's own birth state for `flight`, substepped at `SUB` |

Three consequences, and the third is the only real risk:

- **The dust must be seeded.** `Math.random` → the file's own `rng`, seeded off `d.i`. This hands 03
  round 10 its abandoned measurement back: once seeded, two first visits *can* be compared as
  pixels, and the gate that round had to weaken to a structural claim becomes available in full.
- **The queue may decide when work is done, never what is drawn.** The generation is read off `age`;
  the 4 ms budget survives only as scheduling.
- **Replay is bounded by rest, not by life.** `stepPieces` no-ops on a resting piece, so a
  generation costs only its flight up to rest — and every settled generation can be cached as a
  pose and never replayed again. **Nobody has measured the worst case**: a scroll-up across six
  objects, up to **115 pieces** on one of them (item 150, measured), on the frame the visitor
  reverses. **That number is the only thing that can still veto this ruling, and it is milliseconds,
  not megabytes.** Measure it before writing the frame loop, exactly as the MB was measured before
  designing the window.

### What round 8 reopens, and what it does not

- **Round 6 ruling 2 is half struck.** *A position runs both ways, an event does not* was the whole
  of it; the event now runs both ways too. **Ruling 1 (the fall) and ruling 3 (the scroll is the
  only clock) are untouched — 8b is ruling 3 finally applied to the half of the piece that never
  got it.** `frozen_when_idle` gets stronger under this ruling, not weaker.
- **13's one-way decay is struck for the scroll direction only.** Nothing about the forward grammar
  changes: things still fall, shatter, split twice and sink. What is deleted is the latch.
- **[10](10-the-index-surface.md)'s jump-back was ruled out *because* decay is one-way. That reason
  is gone.** The shelf could re-enter the piece at an item. Not this ticket's to decide — 10 is owed
  the news, and it is a gain rather than a cost.
- **Round 7 ruling 4 must be re-gated with a second end** — a field newer than the counter is now
  the failure mode, and it was never checkable before.
- **`contact_latches` and `decay_one_way` now assert the opposite of the ruling.** Re-aim them, do
  not delete them: what survives is *the forward grammar is unchanged*, which is still worth a gate.
- **[14](14-the-ending-and-the-frame.md) is untouched.** The last object never breaks, in either
  direction.

### Verified, not asserted

Every number above is measured, and nothing in the repo was modified to get it — no source file was
patched, and the sweep was run against HEAD. Frames at `prototypes/webgl/verify04r8/`: `01-midfall` /
`02-up-150` are the fall reversing, `03-deep-1934` is the piece behaving, and
`04-top-still-1934` is the defect. `sweep10` 41/41 green with that defect live, which is the
round's one durable lesson restated: **a gate has a direction, and a gate that only ever walks
forward has only ever tested forward.**

## Round 9, 2026-08-10 — the break reverses. Built.

Ruling 8b, built. The three wall clocks named in round 8 are gone and **nothing in the piece
latches any more**: `down`, `age`, `splits`, `dusted` and `gone` are predicates read off the
scrollbar, not flags something set. The forward grammar is untouched — things fall, shatter, split
twice and sink, in that order, at the same scroll positions as before.

### First, the number that could have vetoed it

Measured before a line of the frame loop was written, exactly as instructed, on the real 230-item
set with real fragment canvases and the real `surfAt`. Harness: `harness/bench04r8.mjs`, read-only.

| the reverse frame, 40 timed reps per position | cold | median | p95 | worst |
|---|---|---|---|---|
| **A** every live object replayed from birth, full flight | 0.1–2.7 ms | **0.2–0.6 ms** | 0.3–3.0 ms | **3.3 ms** |
| **B** the same, stopped at rest | 0.1–1.5 ms | 0.1–0.2 ms | — | 1.6 ms |
| **A, on a 6× throttled CPU** | 3.3 ms | 1.3 ms | **22.4 ms** | **33.3 ms** |

Against a 25 ms frame budget. **Not a veto — but the throttled row is why the pose cache is not an
optimisation.** Replaying every generation from birth on every frame is free on this laptop and
over budget on the phone that is a ship gate, so `restN` — the step at which a field has entirely
come to rest, above which the pose is a constant — is load-bearing. Ruling 8b's *"every settled
generation can be cached as a pose and never replayed again"* is the reason the ruling is
affordable, not a footnote to it.

Two things fell out of the measurement before it measured anything. **The heaviest frame is not the
one with the most work**: 18,219 piece-substeps across seven objects timed 1.10 ms while 11,785
across seven timed 3.30, because cost is pieces still in flight and a settled field is a `p.rest`
scan. And **the census disagreed with the tables** — a 200px walk found 5 objects carrying pieces
where the arithmetic over `LAND`/`LIFE` says 6, and a second walk found 7, one more than the tables
permit, because the 4 ms cut queue had not dusted an object whose `age` was already past `DUST_AT`.
Two walks over one page disagreeing about what is on the ground is the wall clock 8b deletes,
turning up as a side effect of trying to measure something else.

### The mechanism, as built

A forward-only integrator is kept and the SCROLL is what runs backwards. Each generation of shards
is born once at a scroll position the tables fix, keeps the pose it was born in, and the pose drawn
at `y` is that birth integrated forward by `floor((y − born) × MS_PER_PX / SUB)` whole steps.
Walking down adds a step; walking up rewinds to birth and re-runs. Same arithmetic either way.

- **`SUB` became a quantum, not a ceiling.** It was the largest step the integrator would take,
  with the real step being the frame's own scroll delta — so a shard's trajectory depended on how
  fast the visitor was moving. `MAX_STEP` went with it: nothing is advanced per frame any more.
- **Generation g is cut from g−1 at rest.** Not a convenience — a split happens at 0.30 of a life,
  ≥420px after landing, and a field settles inside 110px, so at rest is where the parent has always
  been. Pinning it makes the child's birth a function of the tables.
- **The dust is seeded off `d.i`** (7 sites, all in `burial.js`, none anywhere else) and particles
  keep their birth state and are never spliced out; death is `t >= life`, a predicate read at draw.
- **The queue decides when, never what.** It pre-cuts the next generation before `age` reaches it;
  if it is behind, the frame cuts synchronously and pays. A late frame is a frame; a frame showing
  the wrong generation is a lie.
- **`BACK = 4000` beside `AHEAD`.** A photograph is held for `BACK` past its own landing and a
  wreck for `BACK` past its object's death; beyond that both go, and the rebuild is exact rather
  than remembered because every cut is seeded.

### Six defects, and two of them are older than this round

1. **A falling object with no photograph.** An arrival back in the air was still flagged built, so
   the texture window had released its pixels — 17,053 canvas pixels of a Coca-Cola bottle missing
   from the sky. The wreck now exists exactly while the object is on the ground.
2. **The tie depended on scroll direction.** Round 7 armed it at build time if the partner was
   already down. The window re-admits arrivals **newest-first** on the way up, so every tie found
   its partner missing and five of them silently stopped existing. The relation now comes from the
   tables unconditionally and `tieLive` carries the ruling at draw time — round 10's no-overtaking
   defect, arriving through the door the rewind opened.
3. **`build()` never cleared `d.laid`** — so rebuilt words were never measured, every offset read
   `undefined`, `tx` went NaN, the transform string was invalid, and the browser dropped it: the
   whole citation at the top-left corner at full opacity. **Older than this ticket.** The only
   previous route to a rebuild was `fit()` crossing 720px, which does not clear it either, so
   resizing past the breakpoint has always done this.
4. **The name's last frame was a special case.** `nu < 1` positioned it, `else` only set opacity 0 —
   so a name rebuilt already dead had an opacity and no transform. Invisible, and it still moved
   the page: an element with a transform composites differently from one without, so fifteen dead
   name-words changed how the *live* citations antialiased. Now one expression all the way to 1.
5. **Paint order was build order.** Words were appended as each object built them, which was index
   order only while the sole way to reach an object was to scroll down to it. Now one static slot
   per arrival, made once and never moved.
6. **A draw call that deleted what it drew** — the specks array was emptied inside the draw loop
   once `age` passed 1. The window drops them now, with everything else the object owns.

### What a screenshot can and cannot be gated on — measured, not assumed

`window_is_not_a_clock` **is a pixel comparison again**, which is 03 round 10's abandoned
measurement handed back: two first visits are now byte-identical PNGs. That round could not have
it, and named why — the unseeded dust and the cut budget — and both are gone.

The **widened `pure_function` is not a screenshot**, and the reason is a measurement rather than a
preference. After a 105,000px round trip the composite differs from the direct walk by one RGB unit
on ~27,800 glyph pixels — while the canvas is pixel-identical, the label layer's HTML is
byte-identical, and all 87 in-viewport elements match on rect, opacity, transform, colour and font.
**Hiding either layer makes the two screenshots identical and hiding neither does not**, which
places the difference in Chromium's compositor and not in anything the page decides. So the gate
reads the canvas and the DOM — what the page controls — at four positions, comparing every
fragment, speck and dust particle, walked to directly and again from 9,000px below.

### The frame budget was the fight, and here is what it cost

Publishing a generation whole is what ruling 8b buys and it is also what it costs. The old build
queued one cut job PER PIECE, so the 4 ms budget could stop half way through a split and the object
was drawn as a mixture of parents and children — cheap, and exactly the "same age draws two
different generations" defect the ruling outlaws. Taking the mixture away put the cost back on the
frame. Measured against the shipped build served side by side from the same machine in the same
window (`_h_*.js` copies, deleted after):

| floor of 4 warm passes, 380 frames at 55px/frame | median | p95 |
|---|---|---|
| HEAD, shipped | 16.6 ms | **17.9 ms** |
| round 9, first build | 16.2 ms | **26.1 ms** — over the 25 ms ceiling |
| round 9, shipped here | 16.3 ms | **23.0 ms** |

Three things bought it back, and none of them touches what is drawn. The cut is **sliced into a
staging array nothing reads from**, so `d.gens` only ever gains a generation that is complete.
`CUT_MS` and `SLICE_MS` are named constants — 2.5 ms of cutting a frame, and the most one job may
overrun it by — chosen against measurement rather than taste. And **the window's runway is spent
instead of idled**: an object re-admitted on a scroll-up is `gone` for the next `BACK` px and used
to do nothing with them, then pay for the impact cut and both splits on the frame `age` fell under
1. Late synchronous cuts over a full page down and back: **364 → 13**.

**The margin is 2.0 ms where HEAD had 7.1 ms, and that is the honest cost of the ruling.** It is
inside the budget the project set and it is not comfortable; a future round that adds per-frame work
will find this gate first.

### Verified, not asserted

**`sweep10` 43/43 green** — 41 gates carried over, `wreck_window_does_not_leak` added, and
`contact_latches` / `decay_one_way` re-aimed rather than deleted into `contact_is_a_position` and
`decay_runs_both_ways`, which assert the forward grammar AND the rewind.

Memory, both halves of it, measured on the built page rather than estimated: **4.4 MB of
photographs and 4.61 MB of fragment canvases (1,873 pieces across every generation of every live
object) — 9.0 MB against the 80 MB gate.** Round 8 priced the rewind at 7.7 MB and undercounted,
because it did not count that a rewind across a split needs the PARENT generation back, so every
generation is retained. Both are windows and both are gated.

### Two more defects, from the index sweep — and two gates that were timing the loading

`sweep11i` found the seam defect this round created. **The ending's words came back after the
piece went out.** Ticket 10's rule is that the piece leaves nothing on the shelf, and the seam
unbuilds the ending's citation the moment the fade completes; moving `build()` into the drawable
branch put the two in a loop and the update loop rebuilt them on the same frame. Seven span nodes
over the shelf for the rest of the page, at opacity 0 — and the gate demands zero NODES rather than
zero visible, which is the only reason it was seen.

Then two gates had to be re-aimed, and both are round 9's doing because the rewind widened the
window. Neither is a weakening and both are measured:

- **`pure_function` under `--slow`** read ten built objects walking to y=12,000 and nine coming
  back, and called the page route-dependent. The missing one was item 12 — `gone`, no fragments,
  drawing nothing, canvas byte-identical — re-admitted by the window with its photograph still in
  flight. That is *no pixels, no fall* (03), a transient rather than a state. Reproduced in
  isolation: **9-vs-10 without a quiescence wait, 10-vs-10 with one.**
- **`index_frozen_when_idle`** shoots immediately after a jump on purpose — round 12 removed a
  fixed sleep that had been finishing an ease before the first frame. But a jump to the seam now
  fetches `AHEAD + FALL + BACK` and builds the wrecks of objects already passed, so the page takes
  **~84 frames to finish assembling** where it used to take a handful. It waits on `pending()` and
  `queue.length` now — an ease is neither, so the thing the gate was written for still runs
  straight through the wait.

**That settle time is a real cost of the ruling and is recorded as one.** The page converges to the
identical picture and freezes there, and it is what the piece pays so that scrolling back up costs
nothing.

### Gates

| run | result |
|---|---|
| `sweep10` | **43/43 green** |
| `sweep11i` | **26/26 green** |
| `sweep10 --slow` | 42/43 before the quiescence fix; its one failure was the instrument. **Re-run owed.** |
| `sweep11i --slow` | **not run** |
| `teeth04r9` | six cases written; **see the table at the close of the round for which ran** |

Also fixed in the harness: the `--slow` up walk no longer waits for photographs at all 1,034 stops
— it compares `T.years[i]` from the tables, so an unarrived sprite can still fail it, and the wait
put that one phase on a two-hour path for nothing. And `no_console_errors` now names the URL.

### The teeth — 6/6, and three of them only bite because the instrument was repaired first

`teeth04r9.mjs`, one case at a time, each putting back a latch or a wall clock the rewind deleted.

| case | reddens | the claim it protects |
|---|---|---|
| `contact_latches_again` | `contact_is_a_position` + `ground_is_the_moment` | round 8's exact defect, restored |
| `decay_one_way_again` | `decay_runs_both_ways` | `age 0.45 -> 0.45 on the way back up` |
| `pose_never_rewinds` | `pure_function`, and nothing else | the pose inside a generation |
| `dust_unseeded_again` | `window_is_not_a_clock` + `pure_function` | 03 round 10's pixel comparison |
| `queue_decides_the_generation` | `frozen_when_idle` | the queue schedules, never chooses |
| `back_is_unbounded` | `sprite_window_does_not_leak` | the window stays a window |

**The first run was 3/6, and the three misses were all instruments rather than pages.** Round 12's
lesson, arriving on this round's own work: *a gate that cannot go red is a decoration, and only a
perturbation aimed at it finds one.*

1. **`sprite_window_does_not_leak` was a tautology in `BACK`.** It derived its allowance from
   `AHEAD + FALL + BACK`, so raising `BACK` raised the bound with it — set to 400,000, retaining the
   entire page, and **nothing went red**. The memory gates could not save it either: all 230 sprites
   decode to 65.8 MB, under the 80 MB ceiling, which is exactly 03 round 10's *"a count is not a
   ceiling"* — at 01's 400-item bound the same page is 114 MB and over. The gate now holds the page
   to **ruling 8a's 4,000px**, and asserts `BACK` itself, so changing the constant is the red.
2. **The reclaimed pixel gate sampled where there is no dust.** At y=96,000 every live object landed
   hundreds of pixels ago and its spray is spent, so `window_is_not_a_clock` stayed green with
   `Math.random` back in the dust — blind to the very wall clock it was reclaimed for. It now also
   shoots 120px past a landing, and reports *"two first visits agree on all 6 arrivals structurally
   and STILL differ as pixels"* when broken.
3. **The teeth harness read only the summary line.** `back_is_unbounded` reddened its gate exactly
   as designed and was reported as `nothing`, because retaining every wreck also means the sky is
   never empty, so a later phase threw `era 226: never found an empty sky` and the sweep died before
   printing `FAILED:`. **A perturbation violent enough to abort the suite is the one where you most
   need to know which gates fired**, so the FAIL lines are now the fallback.

One `expect` was wrong rather than one gate: `queue_decides_the_generation` reddens
`frozen_when_idle`, not the two-first-visits gate — both visits are equally late and both settle
before the shot, so they agree with each other. *The picture changing while nobody is scrolling* is
the stronger statement of the same defect, and it is the one that fired.

## Round 10, 2026-08-11 — the frame budget. The cut moves into the fall.

Round 9's one red gate. **The regression was reproduced before a line was changed**, as instructed:
HEAD at `034ff7e` served beside the shipped build from `_h_*.js` copies, one browser, one page, the
arms alternating so machine drift is shared. Floor of the warm passes, which is the gate's own
reading.

| interleaved, 380 frames at 55px, floor of warm passes | median | p95 |
|---|---|---|
| HEAD `034ff7e` | 16.7 ms | **18.7 ms** |
| round 9 | 16.4 ms | **29.6 ms** — over the 25 ms ceiling |
| round 10 | 16.5 ms | **20.4 ms** |

**Two tabs are not an A/B.** The first harness left both builds loaded and timed them in turn —
and in headless chromium a backgrounded tab is still `visible` and still ticks rAF: 60 frames on the
back tab took 1337 ms against the front tab's 1293. Every reading was each build timed against the
other one painting. One page at a time, alternating loads.

### Where the time was, measured rather than reasoned

The medians were identical — 16.4 vs 16.7 — so nothing was a steady tax and all of it was in the
tail. Frames were then labelled from the TABLES rather than from the page: an object lands on the
first frame whose y crosses `START[i] + FALL`, which is arithmetic a harness can do itself.

| frames in one 380-frame pass | n | median | p95 |
|---|---|---|---|
| a landing | 39 (1 in 9.7) | **26.2 ms** | 42.5 |
| a late cut | ~33 | **29.2 ms** | 63.2 |
| neither | 305 | 17.6 ms | 30.7 |

**A landing is 1 frame in 10 and p95 is 1 frame in 20, so landings alone can hold the 95th
percentile.** And the arithmetic underneath: arrivals are ~630px apart, the cut budget is `CUT_MS` a
frame, so an arrival gets ~29ms of budget and needs ~35ms of cutting. The queue could not win. It
fell behind, and `ensureGen` bought whole generations synchronously on the frame that needed them.

### The fix: a cut is not a landing

**`shatterNow` and `splitPiece` had the cut welded to the placement.** A cut is `getImageData`,
`trim` and `getContext` over a polygon — it depends on the photograph and the seed. Where a piece is
PUT depends on the landing. Round 9 made every cut wait for a landing that told it nothing it needed.

Unwelded, the whole cut tree of an object is a pure function of its photograph and its index, so it
is built during the FALL — 460px, about eight frames, that were spent idle. `d.tree` holds every
canvas the object will ever be; `land()` and `stepBuild` place them. That takes the ~29ms per
arrival to ~50ms. **Late cuts over a warm pass: 33 → 0.**

Nothing about what is drawn moves, and that is checked rather than claimed: the seeds, the order and
the carry-over of a parent nothing survives from are identical, and the rng streams are still drawn
in the placement, in the same order, only for pieces that exist.

### A second defect, found by the equivalence walk and older than this round

**A retained generation was left wherever the queue stopped.** `stepBuild` settles a parent so its
children can be cut from where it actually lies — the only reader that pose has — and then left it
settled. So a generation that is *not on screen* held a pose that depended on when the queue got
round to it. Round 9 deleted exactly this in `blank()` for objects that draw nothing and missed the
same claim for a drawn object's other generations. **Nothing could see it** — the canvas is
pixel-identical at every stop either way. It is still a cache whose contents depend on how the
visitor arrived, which is what 8b exists to delete. The parent goes back to its birth unless it is
the one on screen.

### Verified — and what is not

The fixed build and round 9 as committed, walked to six positions, **waiting on `queue.length` and
not only on `pending()`** — the first version of this harness did not, caught the page mid-assembly,
and reported a page that had not finished as a page that disagreed. Round 9's own quiescence lesson,
arriving on the harness written to check round 9's successor.

- **6,852 cuts identical.** No generation, drawn or retained, differs in piece count, size or canvas
  bytes. This is the claim the whole round rests on.
- **565 drawn fragments identical**, and the canvas and the label layer identical at all six stops.
- **113 retained generations at birth.** The 7 that are not are structural, not scheduling: six are a
  dusted object's last generation, which `ensureSpecks` settles on purpose because the specks are
  made from that pose, and one is a single carried-over piece that IS the same object as a piece in
  the drawn generation.

**The gate suite has NOT been run** — `sweep10` + `--slow`, `sweep11i`, `teeth04r9` are ~1–2 hours of
a busy machine and are deferred to a quiet one at Dustin's instruction. `frame_budget` is measured
green by its own method; the other 42 are unrun since the change.
