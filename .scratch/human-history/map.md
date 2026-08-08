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
- **True scale is dead as the global spine — settled by [01](issues/01-the-fun-thesis.md) on evidence, not argument.** A 1px = 1 year demo over the real set was ~11,500 px of near-emptiness followed by every recognizable item crushed into the final inch. **Scroll distance is spaced by density, not by time.** [04](issues/04-scroll-mechanic.md) chooses the exact function, not whether to warp. Honesty about dates is absolute and unaffected — warping distance is a design choice, misstating a date is not.
- **Citation rigor equals Deep Time's.** Every arrival carries source, licence, credit. No fabricated or unsourced date. Contested dates are hedged in notation, not prose.
- **Real artifacts and photographs only. No generated imagery, anywhere.** Dustin's brief: *"no AI-slop visuals."* This is now fully achievable — the entire span sits inside the artifact record. Any ticket that proposes generating a subject has misread the project.
  - **Boundary ruled 2026-08-08.** **IN:** photographs of real objects, **plus engravings, prints, diagrams and illustrations made in the period** — those are themselves real historical artifacts, and they cut out cleanly. **OUT:** modern 3D renders and modern vector illustration, as firmly as AI generation. The claim the site defends is *"every image is a real artifact, or was made at the time."* This matters at sourcing time: a search for a historical object frequently surfaces a **modern render** that cuts out beautifully — it is a constraint breach, not a lucky find. See [02](issues/02-image-supply.md).
- **Global, not America-specific.** The set must not read as a Western canon with tokens attached. This is an editorial requirement on [05](issues/05-arrival-set.md), not a nice-to-have.
- **Mobile is first-class.** Real-device phone test is a ship gate. Prior scars: iOS first-tap-is-hover, iOS URL-bar canvas squash, canvas must re-sync from its own box via ResizeObserver.
- **Decoded memory is the hard ceiling, and it is the #1 technical risk.** Decoded cost is `w × h × 4` regardless of encoding. Deep Time shipped **51 assets = 3.34 MB transfer / 75.56 MB decoded**, against an 80 MB gate. This site's images are the *content*, not decoration, and there will be more of them at larger sizes. Naive reuse blows the budget outright. See [03](issues/03-engine-reuse-or-clean-build.md).
- **Nothing overlaps, anywhere, ever.** Deep Time's no-collision layout contract (reserved zones, non-overlapping slot grid, each arrival one self-contained box, verified by a scroll sweep asserting zero rectangle intersections) is proven and reusable. The sweep is a **ship gate**, not a review note.
- **The anchor references are locked; the sober register is dead.** References ([11](issues/11-visual-anchor.md)): **Neal Agarwal's [The Deep Sea](https://neal.fun/deep-sea/)** (a changing ground, unframed objects, one counter as the whole UI) and **Deep Time** (the same hand). Positioning: *"Twelve thousand years of things people built, and what was standing next to each one."* **Not a chart** — Dustin's word. But [11](issues/11-visual-anchor.md)'s sober, canon-off *register* was built and **rejected outright** — *"complete garbage"* — and [12](issues/12-scrollytelling-craft.md) reversed it on evidence. Direction is re-opened as **[13](issues/13-visual-direction-v2.md)**.
- **Flatness is the failure mode — settled by [12](issues/12-scrollytelling-craft.md).** The Pudding's rule: a piece works when it has *"variety in their shape and… change as the story progressed — it wasn't just a flat line."* **A treatment that looks the same at item 5 and item 300 has already failed.** The site needs a designed shape with movements, not one grammar repeated 300 times.
- **Embellishment is licensed by evidence, not taste — [12](issues/12-scrollytelling-craft.md).** Bateman's *Useful Junk?*: embellished charts were recalled significantly better after 2–3 weeks, at no cost to accuracy, and were strongly preferred. **The Visual Cinnamon canon governs after all**; colour lives in the ground, light, marks and type — never as a tint on the photographs.
- **No scrolljacking, ever — [12](issues/12-scrollytelling-craft.md).** NN/g found most users disoriented, fighting for control, and every problem worse on mobile. All motion rides **native scroll 1:1**: no pinning, no timed animation the visitor waits on, no direction change. This is the main way "cinematic" gets itself into trouble.
- **Cut out everything, and it filters the set — settled by [11](issues/11-visual-anchor.md).** Nothing on the page has an edge except the thing itself. *If a thing cannot be cut out of its photograph and still be recognized, it does not go in.* A page half-contained and half-floating reads as search results. Hard admission test on [05](issues/05-arrival-set.md); a per-image pipeline cost at 200–400 items.
- **The ground is the material of the age — settled by [11](issues/11-visual-anchor.md).** Earth → stone → parchment → iron → paper → screen, blended continuously; flat colour fields, no texture. Photographs themselves stay **untouched** — no tint, no duotone, no grade. Exact values are [06](issues/06-visual-treatment.md)'s against real images.
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

- [01 — The fun thesis](issues/01-the-fun-thesis.md) — **simultaneity surprise** is the mechanism, fed by recognition density; delivered as **ambient contemporaries** on every item plus 10–15 planted callouts. True scale killed as the global spine; axis spaced by density. Span stays 12k with the sparse head as a fast prologue. Quiet stop → browsable index; body is scroll-only. **Cost: a 4–6× content bill — 200–400 items, not 58.** Judgment test: *more things a stranger recognizes on the same screen as each other, without shrinking any item below enjoyable.*
- [11 — Visual anchor & positioning](issues/11-visual-anchor.md) — **"not a chart. scrolly telling like deep time and neil deep sea."** Two anchored references (not the 3–5 asked for), a positioning line, an eleven-entry NOT list, and the sibling-not-sequel ruling made concrete: shared = Archivo/HUD/citation/no-collision; different = **changing ground, real photographs, crowded on purpose, no finale**. Brand's VC canon **ruled off** (scoped exception, not a repeal). Two consequences that bind other tickets: **cut out everything** (a hard filter on [05](issues/05-arrival-set.md)) and **the ground is the material of the age** (pre-decides three of [06](issues/06-visual-treatment.md)'s six items and makes its contrast gate two-ended). Deep Time's `1 px = N years` honesty line **cannot** be printed here — the era name and the counter's uneven rate replace it.

- [12 — How scrollytelling actually works](issues/12-scrollytelling-craft.md) — researched at Dustin's instruction after the [11](issues/11-visual-anchor.md) preview was rejected. Six evidenced findings: **flatness is the failure mode** (Pudding); **spatial immersion raises interest but not comprehension** (arXiv 2411.18049); **embellishment measurably improves recall** and is preferred (Bateman) — which **reverses [11](issues/11-visual-anchor.md)'s canon-off ruling**; **scrolljacking reliably ruins it** (NN/g), so native scroll only; the **martini glass** structure [01](issues/01-the-fun-thesis.md) already picked is a known-good named pattern; and **fun needs reward**, which the preview had none of. Direction re-opened as [13](issues/13-visual-direction-v2.md).
- **Matting solved, and it relaxes a filter** — `prototypes/anchor-preview/matte.py` (rembg + isnet, local, free) cut **9 of the 10** subjects that defeated the hand-rolled flood fill, including **Aldrin out of the visor photo** and **Sputnik's antennas**. [05](issues/05-arrival-set.md)'s cut-out admission test is therefore far weaker than [11](issues/11-visual-anchor.md) assumed: famous *moments* can become objects.

## Not yet specified

- **The build phase.** Everything after [09 — Spec assembly](issues/09-spec-assembly.md): scaffold, data pipeline, image acquisition and processing, layout, the collision/contrast/memory gates, deploy, subdomain, project card. Graduates into tickets once the spec exists — charting it now would be guessing at a shape [04](issues/04-scroll-mechanic.md) and [06](issues/06-visual-treatment.md) haven't decided.
- **The share artifact and social card.** Deep Time rendered its finale fan as a build-time still. [01](issues/01-the-fun-thesis.md) settled that there is no finale to render and that the sendable unit is a planted callout line, not an image — so the card is probably a treated arrival or an index still. Not sharp enough to ticket until [06](issues/06-visual-treatment.md) sets the visual system.
- **The prologue↔body seam.** [01](issues/01-the-fun-thesis.md) established that the deep head runs on spectacle and planted callouts while the body runs on ambient contemporaries. Whether that transition is announced, disguised, or structural is [04](issues/04-scroll-mechanic.md)'s to decide, and it may spawn its own ticket once the mechanic exists.

## Out of scope

- **Deep Time itself.** Its `record.json` epoch defect is inherited as a *copy* to normalize. Do not edit, rebake or re-source anything under `Projects/Deep_Time`.
- **The 300,000-year and 2.8-million-year spans.** Ruled out this session; they would be a different effort with a different art economy.
- **Any single-nation or single-state history** (US, Kentucky). Ruled out this session on audience and scope.
- **Forward/future timelines.** Past to present only, as with Deep Time.
