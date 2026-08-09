# 04 — The scroll mechanic

Type: prototype
Status: open — the fall is built and settled; the prologue seam and co-occurrence are not
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

### What this does NOT settle — 04 stays open

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
