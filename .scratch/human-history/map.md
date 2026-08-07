# Human History — Wayfinder Map

Labels: `wayfinder:map`

## Destination

A scroll-driven data toy telling **~12,000 years of everything humans built**, from Göbekli Tepe to now — built entirely from real, cited, public-domain artifacts and photographs — **live on its own subdomain** with a card on dustincoledata.com/projects.

Sibling to [Deep Time](https://deeptime.dustincoledata.com), not a sequel to it.

**Execution is in scope.** Dustin, verbatim: *"I want you to pretty much take over the project and get it built out."* This overrides wayfinder's default plan-don't-do. The locked spec at `.claude/plans/human-history-spec.md` is the **mid-point milestone**, not the destination — the destination is the shipped site.

## Notes

**Domain:** a dustincoledata data-toy. New repo `Projects/Human_History`, own subdomain, project card. Same pattern as Deep Time, Namesake, Cascade.

**Skills every session should consult:** `/impeccable` (visual craft), `/intent:*` (UX), `/prototype` (cheap artifacts to react to), `/grilling` + `/domain-modeling` (default), `/dataviz` if any chart appears.

### Hard constraints

- **Fun is the payoff, not awe.** Dustin, verbatim: *"I dont care about scale shock. i want it to be fun to the users."* Deep Time's currency was awe at emptiness. This site's currency is enjoyment — recognition, surprise, density of real things. **Every decision is judged by whether a stranger enjoys scrolling it.** Any argument that reaches for "but it's profound" has lost.
- **True scale is no longer a given.** The original brief asked for Deep Time's true-scale discipline; the fun ruling above supersedes it as a *goal*. True scale survives only if [04](issues/04-scroll-mechanic.md) shows it makes the site more fun, not less. Honesty about dates is still absolute — that is a separate constraint and it does not bend.
- **Citation rigor equals Deep Time's.** Every arrival carries source, licence, credit. No fabricated or unsourced date. Contested dates are hedged in notation, not prose.
- **Real artifacts and photographs only. No generated imagery, anywhere.** Dustin's brief: *"no AI-slop visuals."* This is now fully achievable — the entire span sits inside the artifact record. Any ticket that proposes generating a subject has misread the project.
- **Global, not America-specific.** The set must not read as a Western canon with tokens attached. This is an editorial requirement on [05](issues/05-arrival-set.md), not a nice-to-have.
- **Mobile is first-class.** Real-device phone test is a ship gate. Prior scars: iOS first-tap-is-hover, iOS URL-bar canvas squash, canvas must re-sync from its own box via ResizeObserver.
- **Decoded memory is the hard ceiling, and it is the #1 technical risk.** Decoded cost is `w × h × 4` regardless of encoding. Deep Time shipped **51 assets = 3.34 MB transfer / 75.56 MB decoded**, against an 80 MB gate. This site's images are the *content*, not decoration, and there will be more of them at larger sizes. Naive reuse blows the budget outright. See [03](issues/03-engine-reuse-or-clean-build.md).
- **Nothing overlaps, anywhere, ever.** Deep Time's no-collision layout contract (reserved zones, non-overlapping slot grid, each arrival one self-contained box, verified by a scroll sweep asserting zero rectangle intersections) is proven and reusable. The sweep is a **ship gate**, not a review note.
- **Anchor before mocks:** lock a loved reference + honest positioning before building any mock.
- **Copy is never corny, never sales-pitchy.** Flat declarative. No parallel triads, no feel-something clauses.

### The premise, and what may still challenge it

The span (**~12,000 years, agriculture to now, global**) was settled with Dustin this session, against three alternatives:

- *300,000 years of Homo sapiens* — rejected: ~95% predates artifacts, so it needs generated art for a stretch that is by definition empty. Pays Deep Time's full art bill to rebuild Deep Time's Boring Billion.
- *US 250 years* — rejected: US-only, and Dustin leaned global.
- *Kentucky* — rejected: audience too small.

[01 — The fun thesis](issues/01-the-fun-thesis.md) is **permitted to reopen the span** if the delight mechanism it lands on demands a different one. Nothing downstream may.

### Inherited from Deep Time — what actually transfers

`Projects/Deep_Time/src/data/record.json` → `flood[]`, **58 entries**, Göbekli Tepe (11,500 ya) → The COVID-19 Vaccine. Each carries `id`, `yearsAgo`, `name`, `source`, `licence` (PD or CC0), `credit`.

**What transfers:** the sourcing and citation work. Every entry is already researched, licence-cleared and credited. That is the expensive half of a data toy, done.

**What does NOT transfer — verified, not assumed:**

1. **The pixels.** `Projects/Deep_Time/public/art/record/*.webp` — all 58 exist, but **max dimension 160 px, 372 KB for the entire set.** They are specks in Deep Time's finale heap. As hero content here they are unusable; every image must be **re-sourced at full resolution** from its cited origin.
2. **The dates.** `yearsAgo` uses **two different epochs.** Entries 0–49 are computed from **2000** (Trinity Test `55` → 1945 ✓, Apollo 11 `31` → 1969 ✓, ENIAC `53` → 1946 ✓). Entries 50–57, the batch appended later, are computed from **2026** (March on Washington `63` → 1963 ✓, COVID vaccine `6` → 2020 ✓). The array is consequently **out of chronological order** at the tail. Normalize to absolute years with a stated epoch before any use. **Fix in the copy — do not edit Deep Time's file.**

## Decisions so far

<!-- one line per closed ticket: gist + link -->

*(none yet — map charted 2026-08-07)*

## Not yet specified

- **The build phase.** Everything after [09 — Spec assembly](issues/09-spec-assembly.md): scaffold, data pipeline, image acquisition and processing, layout, the collision/contrast/memory gates, deploy, subdomain, project card. Graduates into tickets once the spec exists — charting it now would be guessing at a shape [04](issues/04-scroll-mechanic.md) and [06](issues/06-visual-treatment.md) haven't decided.
- **Whether the site has an ending beat at all.** Deep Time's whole architecture served one final moment. If fun rather than awe is the currency, the ending may be a quiet stop, a shareable artifact, or an index. Blocked on [01](issues/01-the-fun-thesis.md) — until the delight mechanism is named there is nothing to shape an ending around.
- **Whether anything beyond scroll is interactive.** Filtering, search, a "what happened in your lifetime" input, tap-to-expand. Depends entirely on [01](issues/01-the-fun-thesis.md); listing options now would pre-slice fog.
- **The share artifact and social card.** Deep Time rendered its finale fan as a build-time still. Shape here is unknown until the ending is.

## Out of scope

- **Deep Time itself.** Its `record.json` epoch defect is inherited as a *copy* to normalize. Do not edit, rebake or re-source anything under `Projects/Deep_Time`.
- **The 300,000-year and 2.8-million-year spans.** Ruled out this session; they would be a different effort with a different art economy.
- **Any single-nation or single-state history** (US, Kentucky). Ruled out this session on audience and scope.
- **Forward/future timelines.** Past to present only, as with Deep Time.
