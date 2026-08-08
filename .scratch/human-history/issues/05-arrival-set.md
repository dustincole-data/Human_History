# 05 — The arrival set & verified dates

Type: research
Status: open
Blocked by: 02, 04
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What appears, in what order, on what date, with what source — and what is deliberately left out?**

The content spine. Blocked by [02](02-image-supply.md) (what can be obtained) and [04](04-scroll-mechanic.md) (how many slots exist and how far apart they can sit).

Produce the merged, verified set:

- **Start from the inherited 58**, normalized. `record.json`'s `yearsAgo` carries **two epochs** — entries 0–49 from 2000, entries 50–57 from 2026 — leaving the tail out of chronological order. Convert everything to **absolute years with a stated epoch** and re-derive. Fix in the copy; Deep Time's file is out of scope.
- **Extend to the target count** set by [04](04-scroll-mechanic.md), weighted toward wherever the mechanic leaves gaps. On any warped or constant-density mechanic that means the thin pre-1500 stretch needs the most new work, and [02](02-image-supply.md) has already measured whether the images exist.
- **Every entry carries** `id`, absolute date, date-confidence, name, one-line description, source, licence, credit, and image provenance. No entry ships without all of them.
- **Contested dates are hedged in notation, not prose** — Deep Time's rule, and it survives: doubt goes in the number (`c.`, ranges, `≥`), identity doubt goes in the name.

Then apply the two editorial tests that decide quality:

1. **Global balance.** The set must not be a Western canon with tokens attached. Set an explicit target for regional and cultural coverage *before* selecting, then measure the finished set against it. [02](02-image-supply.md) will have reported how deep licence-clean non-Western coverage actually goes; where supply is genuinely shallow, say so in the record rather than quietly skewing the set.
2. **The admission test from [01](01-the-fun-thesis.md).** If the mechanism is recognition, unknown items are ballast. If it is discovery, canon items are ballast. These pull in opposite directions and the ratio must be a **stated number**, not a vibe — the one thing most likely to be silently fudged.

Also rule on: whether "built" is literal (objects, buildings, artifacts) or includes events, ideas and documents — the inherited 58 already mixes them (Trinity Test, the Human Genome Project, the March on Washington). An unstated definition here produces an incoherent set.

**Deliverable:** the complete set as a data file in the repo, every field populated, with a coverage table (by era and by region) and an explicit list of **notable things deliberately excluded and why** — the exclusions are what prove the set was edited rather than accumulated.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

**Target: 200–400 items.** This is the project's main cost and it lands here.

The **admission test** this ticket asked for is now settled, and it is neither pure recognition nor pure discovery:

> An item is admissible **as a neighbour of a famous one**, never as a screen's headline. Every screen must carry at least one thing a stranger recognizes; obscure items earn their place by being *next to* it in time.

That resolves the recognition-vs-discovery tension the ticket flagged as most likely to be fudged — the ratio is not a global percentage, it is a **per-screen floor**. State it as: *no screen ships without a recognizable anchor.* Measure the finished set against that, screen by screen, once [04](04-scroll-mechanic.md) fixes what a screen holds.

Two more consequences:

- **Weight the new work post-1500.** The earlier instruction to weight toward the thin pre-1500 stretch is **superseded**. 01 ruled the deep head is a fast prologue of ~a dozen spectacle items; the density the mechanism eats is in 1500 → now. Pre-1500 needs *strength*, not volume.
- **Contemporaries are a selection criterion, not just an output.** Items are chosen partly for who they sit beside. An item with no interesting neighbour in time is weaker than a lesser item that creates a real double-take — record the intended adjacency alongside each entry so [04](04-scroll-mechanic.md) and [06](06-visual-treatment.md) can build to it.
- **Global balance is unchanged and still binding.** The per-screen recognisability floor must not quietly become a Western-canon floor; where non-Western supply is shallow ([02](02-image-supply.md) measures it), say so in the record rather than skewing the set.

---

## Input from [11](11-visual-anchor.md) (closed 2026-08-08)

**A second admission test, and this one is a hard filter applied before 01's:**

> **If a thing cannot be cut out of its photograph and still be recognized, it does not go in the site.**

The site's grammar is unframed objects floating on a ground — nothing has an edge except the thing itself. A subject that needs a container to make sense (a crowd, an aerial site view, an event) breaks that grammar, and a page that is half-contained and half-floating reads as a search-results page.

**Apply it as a rewrite instruction, not just a reject.** The subject is *things people built*, so most entries have an object hiding inside an event: Apollo 11 → the lander; Trinity → the cloud; Göbekli Tepe → a single carved pillar, not the aerial shot. Record the **object** as the entry, with the event as context.

> **RELAXED 2026-08-08 — the filter is much weaker than it looked.** 11 assumed cut-out meant "sourced on
> a clean museum sweep", because a flood fill was all that had been tried. With a real matting model
> (`prototypes/anchor-preview/matte.py`, rembg + isnet, local and free), **nine of the ten subjects that
> completely defeated the old method cut cleanly** — including **Buzz Aldrin lifted out of the visor
> photograph** and **Sputnik with its antennas intact**. A person *can* be cut out of a scene.
> **So famous moments can become objects after all**, and the drops predicted below should be far rarer.
> Still assume nothing: run a candidate through the model before ruling it in or out. The Lunar Module on
> the lunar surface still failed, so the filter is real — just much narrower.

**Where it genuinely can't be done, the item drops.** That is a real hit on 01's recognition substrate and it was accepted with eyes open — but it means the per-screen recognisability floor above is now harder to hit, because some of the most recognizable moments in the set are crowds. **Flag any item you drop for this reason**; if the count gets large, that is evidence to reopen the grammar, and evidence is the only thing that reopens it.

Two smaller consequences:

- **Cut-out difficulty is a sourcing criterion.** It pushes [02](02-image-supply.md) toward museum-sweep and isolated-object photography over in-situ scene photography, for the same artifact. Note it against each candidate.
- **Global balance interacts with this.** Non-Western material is disproportionately documented as *sites and scenes* rather than object photography in some collections. If this filter is quietly skewing the set Western, say so in the record rather than absorbing it.
