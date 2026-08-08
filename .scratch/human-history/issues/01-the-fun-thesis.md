# 01 — The fun thesis

Type: grilling
Status: closed
Assignee: dustin
Resolved: 2026-08-07
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What, precisely, is the mechanism of enjoyment?**

This is the spine ticket. Dustin ruled out the payoff Deep Time was built around — *"I dont care about scale shock. i want it to be fun to the users"* — and nothing has replaced it yet. Until this is named, every downstream decision is unanchored: the mechanic ([04](04-scroll-mechanic.md)) has no target, the visual treatment ([06](06-visual-treatment.md)) has no tone, and the set ([05](05-arrival-set.md)) has no admission test.

"Fun" is not an answer. The deliverable is a **stated mechanism** — the specific thing that happens in a visitor's head that makes them keep scrolling and send the link to someone.

Candidate mechanisms, to be argued and narrowed, not accepted as a menu:

1. **Recognition density** — a real photograph of a thing you know, then another, then another. The pleasure is the parade. Demands maximum items-per-screen and a fast rhythm.
2. **Simultaneity surprise** — "these happened at the same time." Cleopatra to the Moon landing is shorter than Cleopatra to the pyramids. The pleasure is the double-take. Demands a shared line and explicit adjacency.
3. **Acceleration felt in the hand** — arrivals go from one per 500 years to several per year. The pleasure is physical: the scroll gets busier under your thumb. Closest to Deep Time's DNA without borrowing its emotion.
4. **Personal anchoring** — your birth year drawn on the same line as everything else. The pleasure is location. Requires input, which means the site is no longer scroll-only.
5. **Discovery** — most items are things the visitor has never heard of and is glad to meet. The pleasure is learning. Demands editorial reach well past the canon and puts pressure on [05](05-arrival-set.md).

These are not exclusive, but they are not free either: 1 and 5 pull in opposite directions on the set, and 4 breaks scroll-only. **Pick a primary and at most one secondary,** and state what each costs.

Also settle here:

- **Does the site have an ending, and what kind?** Deep Time's architecture served one final moment. A fun site may deserve a quiet stop, a shareable still, or an index instead. (Currently in the map's fog.)
- **Is anything interactive beyond scroll?** Falls out of the mechanism, particularly if 4 wins. (Currently in the map's fog.)
- **Sanity-check the span.** This ticket alone is permitted to reopen the ~12,000-year premise. If the chosen mechanism works better over a different range, say so now — not later.

**Deliverable:** the primary mechanism stated in one sentence, its cost stated plainly, the ending's shape, an interaction ruling, and a **judgment test** the later tickets can actually apply — a sentence of the form "this decision is better than that one if ___", concrete enough to settle an argument without Dustin in the room.

---

## Resolution

Settled with Dustin 2026-08-07, grilling session, four rulings.

### The mechanism

> **The visitor keeps scrolling because they keep meeting things they recognize standing next to each other in time, and they send the link because at some point that adjacency is one they did not believe.**

**Primary: simultaneity surprise.** The double-take — "these existed at the same time" — is the payoff, and it is the sendable unit.
**Secondary: recognition density.** Not a co-equal; recognition is the *substrate* the primary runs on. A surprise between two things the visitor has never heard of is not a surprise, it is a fact sheet.

Rejected as primary: acceleration-in-the-hand (Deep Time's emotion in a new coat), personal anchoring (breaks scroll-only and makes the site about the visitor), discovery (starves the primary of recognition).

### How the surprise is delivered — SEEN ambiently, TOLD occasionally

- **Engine: ambient contemporaries.** Every item surfaces what else was standing at that moment, and by how much they miss each other. Simultaneity is available at *every* item, not at fifteen staged ones.
- **Seasoning: 10–15 planted callouts.** An editor states outright the pairs too good to risk the visitor missing. These are the sendable lines.
- **Killed: true scale as the global spine.** Not on argument — on evidence, see below.

### The evidence

A throwaway three-column demo was built on the real inherited 58 (normalized to absolute years), rendering the same items three ways — ambient contemporaries, true scale at 1px = 1 year, and a plain parade with planted callouts. Deliberately unstyled; it tested mechanism, not design. It is spent and not preserved. Two findings, both durable:

1. **True scale over 12,000 years is unscrollable here.** ~11,500 px of near-emptiness, then every recognizable item crushed into the final inch. On Deep Time that asymmetry was the payoff; here it destroys both the primary and the secondary at once.
2. **The ambient engine cannot fire on a sparse set.** At 58 items, "nearest in time" reads *1,500 years apart* — sparseness, not simultaneity. Measured density of the inherited set:

| Era | Span | Items | Density |
|---|---|---|---|
| 9500–3000 BC | 6,500 yr | 7 | 1 per **928 yr** |
| 3000 BC–1000 AD | 4,000 yr | 16 | 1 per 250 yr |
| 1000–1800 AD | 800 yr | 11 | 1 per 73 yr |
| 1800–now | 226 yr | 24 | 1 per **9 yr** |

### The cost, stated plainly

**This is a 4–6× content bill: 200–400 items, not 58.** Each needs a full-resolution licence-clean image, a cited date, and credit. The mechanism does not work at the inherited scale, and no design decision downstream can rescue a set too thin to have contemporaries. **This is now the single biggest thing between here and shipped**, and it lands on [02](02-image-supply.md) and [05](05-arrival-set.md).

### Span — 12,000 years stays, the axis does not

Span confirmed, **premise not reopened**. But the engine provably cannot fire in the first ~8,000 years — even at 6× density that opening is one item per ~155 years, and recognition collapses there for a general visitor regardless of density.

Therefore: **scroll distance is spaced by density, not by time.** The deep head is a **fast prologue** — a dozen spectacle items carried by planted callouts — and the body of the site begins where things start coexisting. Accepted cost: the first ~20% runs a different engine than the rest, and that **seam is a real design problem [04](04-scroll-mechanic.md) must solve rather than inherit.**

Dates remain exactly true throughout. Warping distance is a design choice; misstating a date is not.

### The ending, and interaction

- **No built finale.** A crescendo is the awe currency that was explicitly ruled out, and the ending does not need to carry sharing — the planted callouts already do that mid-scroll.
- **Quiet stop → a browsable index.** The last item lands without ceremony, then the whole set as a grid the visitor can scan and jump back into. This is what makes a 200–400 item bill pay for itself twice, and it turns a one-scroll visit into a place worth returning to.
- **Interaction ruling: the body is scroll-only.** Tap an item for its source and credit. The index is the **only** second surface. No year input, no filtering, no search. (Reconsider only if a later ticket produces evidence, not appetite.)
- The index must hold the no-collision contract and the mobile gate like any other surface — it is a second layout, not a footer.

### The judgment test

> **A decision is better if it puts more things a stranger recognizes onto the same screen as each other. It is worse if it shrinks any single item below the size where the photograph is still enjoyable.**
>
> **Tiebreaker:** when two options score equal, prefer the one that produces a sentence someone would text.

First clause encodes all three rulings at once — density, recognition, coexistence. Second clause is the brake, so "more per screen" cannot run away into a contact sheet.

Test-fired against the live tickets: it tells [05](05-arrival-set.md) an obscure item is admissible *as a neighbour of a famous one* but never as a screen's headline; it tells [06](06-visual-treatment.md) to favour density over hero-scale until the photograph stops reading; it tells [04](04-scroll-mechanic.md) the deep-head prologue should move fast, because nothing there passes clause one.
