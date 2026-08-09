# 04 — The scroll mechanic

Type: prototype
Status: open
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
