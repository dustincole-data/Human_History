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
