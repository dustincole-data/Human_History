# 11 — Visual anchor & positioning

Type: grilling
Status: closed
Assignee: dustin
Resolved: 2026-08-08
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What does this site look like, stated before anything is mocked?**

Split out of [06](06-visual-treatment.md) and **deliberately unblocked**. 06 cannot run until [02](02-image-supply.md) supplies real images to prototype on — but the *anchor* needs none, and holding it until then is the known failure mode: blind mock iteration late in the project, which has cost this workshop real tokens and real goodwill before (the Latent post-mortem).

Dustin has now twice reacted to a deliberately-ugly mechanism demo as though it were a design proposal. That is the signal: **the look is under-specified relative to how much he cares about it.** Fix that here, early, in words — so that when 06 runs, it is executing a direction rather than guessing at one.

Settle:

1. **The loved reference.** Not a moodboard — **3–5 specific existing pieces Dustin actually likes**, each with a stated reason *what specifically* is loved (the palette, the density, the type, the ground, the restraint). A reference without a reason is unusable downstream.
2. **The honest positioning statement.** One line: what this site is, in a way that would be true if a stranger read it. Flat declarative, never corny, never sales-pitchy — the standing copy rule, which applies to positioning as much as to on-page text.
3. **The explicit NOT list.** What this must not read as. Known entries already: *not a search-results page*, *not a Wikipedia timeline*, *not a moodboard*, *not Deep Time reskinned*. Extend it — the NOT list settles more arguments than the reference does.
4. **Relationship to Deep Time.** Sibling, not sequel — stated in the map. Make that visually concrete: what is deliberately shared (so it reads as the same hand) versus deliberately different (so it does not read as a retread). This is the question behind "it looks nothing like Deep Time," and it needs an answer either way.
5. **The brand canon input, confirmed not assumed.** dustincoledata's standing direction is Visual Cinnamon-grade data graphics — colourful, applied as a *range* of options rather than one derived law. Confirm whether that governs here, since this is a data toy on that brand, and note that a site made of real photographs constrains palette differently than a site made of drawn marks.

**This ticket produces no mocks.** It produces the sentence and the references that make mocks judgeable. If a mock is needed to choose between two references, that is [06](06-visual-treatment.md)'s job, on real images.

**Deliverable:** the 3–5 anchored references with reasons, the one-line positioning statement, the NOT list, and the shared-vs-different ruling against Deep Time — short enough to sit at the top of [06](06-visual-treatment.md) and be checked against every prototype it produces.

---

## Resolution

Settled with Dustin 2026-08-08, grilling session. His opening ruling reframed the ticket before the first question was answered:

> *"not a chart. this should be scrolly telling like deep time and neil deep sea"*

### 1. The anchored references

**Two, not 3–5.** Recorded honestly rather than padded — Dustin named these and stopped, and both carry specific stated reasons, which is what makes an anchor usable. If 06 finds two insufficient, that is a reason to reopen, not to invent a third now.

**A. [The Deep Sea](https://neal.fun/deep-sea/) (Neal Agarwal) — the primary anchor.** Four candidate reasons were put to him; he took the first three and rejected the fourth verbatim: *"all three at the top. Four, I don't care about."*

| Loved | What it means here |
|---|---|
| **One continuous ground that changes under you** | Deep Sea's water goes blue → black with depth. The ground itself tells you where you are, with no chart. This is the coherence device — it is what makes many unrelated subjects read as one site. |
| **Subjects float on the ground, unframed** | No cards, no boxes, no borders. A thing and its name. |
| **The counter is the entire UI** | One persistent readout, nothing else competing. |
| ~~Sparse stretches are a feature~~ | **Explicitly rejected.** Emptiness is a cost to be got through, not a pleasure to be savoured. Consistent with [01](01-the-fun-thesis.md)'s fast-prologue ruling — this is now independently confirmed from the *look* side, not just the mechanism side. |

**B. [Deep Time](https://deeptime.dustincoledata.com) — the same-hand anchor.** Supplies the craft register: type, citation rigour, the no-collision contract, the fixed HUD. Ruled shared-vs-different in §4.

**Not a moodboard, and no third reference was invented.** Dustin's standing rule — never generalise a designer's whole range from one piece — applies to him too: two pieces he actually named beat five assembled to hit a quota.

### 2. The positioning statement

> **Twelve thousand years of things people built, and what was standing next to each one.**

Chosen over a flatter title-only variant and a second-person variant. Flat declarative, no adjectives, no feel-something clause. Says what is in it *and* names the mechanism, so it doubles as the admission test read aloud.

### 3. The NOT list

The list settles more arguments than the reference does. Inherited entries kept, extended by this session:

- **Not a chart.** Dustin's word, unprompted, and the largest single ruling here. No legend, no axis, no annotation layer, no gridlines, no dataviz apparatus of any kind.
- **Not a Visual Cinnamon data-art piece.** See §5 — the brand canon was tested against this site and ruled off.
- **Not a search-results page.** The failure mode of heterogeneous images in rectangles. Structurally prevented by §6's cut-out rule.
- **Not a card grid.** No boxes, no frames, no borders, no drop shadows, anywhere.
- **Not a Wikipedia timeline.** Not a reference work; not exhaustive; not a list.
- **Not a museum wall.** Not beige, not hushed, not reverent. Reverence is the awe currency [01](01-the-fun-thesis.md) killed.
- **Not a contact sheet.** [01](01-the-fun-thesis.md)'s brake — density stops where the photograph stops being enjoyable.
- **Not Deep Time reskinned.** See §4 for what makes that concrete.
- **Not a moodboard.** Every image is a cited artifact doing a job.
- **Not a slideshow or a stepper.** Continuous scroll, no stages, no "next".
- **No generated imagery, anywhere.** Standing map constraint, restated because this ticket is where someone would be tempted.

### 4. Deep Time — shared vs different

Proposed in full and delegated: *"you decide."* Taken as ruled.

**Deliberately shared** — so it reads as the same hand:

- Archivo, small, tabular figures. Never a giant display hero.
- Cut-out subjects sitting on a ground.
- The fixed HUD: big number + era name. Deep Time already ships exactly this (`#hud`, `#hud-num`, `#hud-era`, `src/pages/index.astro:130-141`) — the counter is **inherited, not invented**, which is why anchors A and B agree on it.
- Citation on every item: source, licence, credit.
- The no-collision contract, verified by scroll sweep.

**Deliberately different** — so it is not a retread:

- **The ground changes** with the era; Deep Time's is one cream (`--paper: #f4f1ea`) start to finish.
- **Real photographs**, not generated art.
- **Crowded on purpose.** Deep Time shows one thing at a time in emptiness; this shows many things on one screen. This is the single most visible difference and it is [01](01-the-fun-thesis.md)'s judgment test made visual.
- **No finale.** Quiet stop, then the index.

**The HUD honesty problem, and its ruling.** Deep Time's HUD prints `1 px = N years` — an honesty device this site **cannot** print, because [01](01-the-fun-thesis.md) warped distance by density. Printing it would be a lie, and dropping it silently loses the honesty.

> **Ruling: the era name carries the "where am I", and the year counter's own uneven rate is the honesty.** It crawls through the stone age and sprints through the twentieth century. The warp is *felt*, not asserted. Dates themselves remain exactly true, as always.

### 5. The brand canon — tested and ruled OFF

dustincoledata's standing canon is Visual Cinnamon-grade data graphics, colourful, always. Put to Dustin as the opening question, because a site made of real photographs constrains palette differently than a site made of drawn marks: colour applied *to* photographs is a tint or duotone, and treatment costs the authenticity that is this site's entire claim.

He did not split the difference — he rejected the frame: *"not a chart."*

> **Ruling: the Visual Cinnamon / data-graphic canon does not govern this site.** It is a scrollytelling toy made of real photographs, not a data graphic. There is no legend, no annotation layer, no derived palette, no chart apparatus to make colourful.

**Colour still enters** — but through §6's ground, which is derived from real material history rather than chosen as decoration. The canon is not violated so much as inapplicable: there is no data graphic here for it to govern. **This is a scoped exception, not a repeal** — the canon still governs the project card, any social card, and any actual chart that appears anywhere on the brand.

### 6. Two rulings that constrain other tickets

These came out of the anchor and pre-decide open questions elsewhere. Recorded here because they are anchor consequences, not treatment choices.

**A. Cut out everything, and it becomes an admission test.**

Deep Sea's unframed-object grammar works because every subject is one creature. This set is not: a pot cuts out, but Göbekli Tepe is a site, the March on Washington is a crowd, Apollo 11 is a scene. Allowing scenes means containing them in a shape, and the instant half the page is contained and half floats, the site reads as search results — the exact failure this ticket exists to prevent.

Offered as one-grammar-filters-the-set versus two-grammars-keeps-the-moments. Ruled: **one grammar.**

> **If a thing cannot be cut out of its photograph and still be recognized, it does not go in the site.**

Nothing on the page has an edge except the thing itself. This survives better than it sounds because the subject is *things people built*, which are objects by definition — Apollo 11 becomes the lander, Trinity becomes the cloud, Göbekli Tepe becomes a single carved pillar rather than the aerial site shot.

**Cost, stated plainly:** it hands [05](05-arrival-set.md) a hard filter it did not have, and it will kill some items a stranger would recognize instantly — a direct hit on [01](01-the-fun-thesis.md)'s recognition substrate. Accepted, eyes open. It also removes [06](06-visual-treatment.md)'s item 2 from the table and converts it into a **pipeline cost at 200–400 images**, which is [03](03-engine-reuse-or-clean-build.md)'s and the build phase's problem, not a design question. Automated matting is masking, not generation — it does not breach the no-generated-imagery constraint, but its edge quality is now a build risk.

**B. The ground is the material of the age.**

Chosen over one flat cream throughout, and over a single dark→lit sweep (rejected as the obvious corny metaphor).

> **The ground is the stuff people were working in, blending continuously from one era to the next.** Indicative: earth `#6b5240` → stone `#8d8577` → parchment `#e6dcc4` → iron/soot `#3a3a3c` → paper `#f4f1ea` → screen `#0a0c10`.

Colours are **indicative, not final** — [06](06-visual-treatment.md) sets them against real sourced images and against its measured contrast gate, which this ruling makes materially harder: a cut-out on a dark iron ground and a cut-out on a paper-white ground are two different legibility problems on one page, and the worst case (pale artifact on pale ground) now has a mirror (dark artifact on dark ground).

**Flat colour fields only.** No paper grain, no fake texture, no skeuomorphism — texture is the AI-artifact tell.

**This ruling creates a new editorial problem, named here so it is not discovered late:** a ground that changes by era asserts *era boundaries*, and periodization is contested and regional — the Bronze Age arrives millennia apart in different places. Against the map's absolute date-honesty constraint and its global-not-Western-canon requirement, an unexamined ramp would smuggle in a Eurocentric periodization as a visual fact. Assigned to [06](06-visual-treatment.md) as a hard requirement.

### What this ticket did not produce

No mocks, by design. The next visual artifact is [06](06-visual-treatment.md)'s prototype on real sourced images, and it is now **executing a direction rather than guessing at one** — it is checked against the two references, the NOT list, and §6's two rulings.
