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
