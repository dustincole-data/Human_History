# 06 — Visual treatment: one system from many sources

Type: prototype
Status: open - items 1, 2, 3, 5 and 6 resolved in round 8; item 4 (a dated backdrop) still open
Blocked by: 01, 02, 11
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**How do a hundred-plus wildly heterogeneous real images become one site that looks designed?**

The central visual risk, and it is the exact inverse of Deep Time's. Deep Time generated every subject into a single locked style, so coherence was free and accuracy was expensive. Here accuracy is free and **coherence is the expensive part** — the source material is a photograph of a pot on a white museum sweep, a 19th-century engraving, a grainy black-and-white press photo, a saturated modern NASA frame, and a faded tapestry, and they must sit in one scroll without looking like a search-results page.

Decide:

1. **The unifying device.** What makes them one system — a shared frame or card, a consistent knockout/cut-out treatment, a controlled tint or duotone, a common ground, a fixed size grammar? Note the tension: **heavy treatment buys coherence and costs authenticity**, and authenticity is most of this site's claim. A duotone that makes everything match also makes everything look processed. Find the least treatment that achieves coherence, and state where the line is.
2. **Cut out or leave whole.** Deep Time cut out every subject. Cut-outs unify strongly but destroy context and are per-image manual work at this volume — and a cut-out of a *photograph* reads differently from a cut-out of a painted plate. Rule per-category if a single rule doesn't hold.
3. **Type and layout grammar.** Typeface, scale, the card/label anatomy, how date and credit sit. Deep Time used Archivo only with tabular figures; inherit or re-decide deliberately.
4. **Background and ground.** Whether there is a field behind the images at all — see [03](03-engine-reuse-or-clean-build.md); if there is no canvas, this is a CSS question, and if there is, it is a drawing question.
5. **Legibility as a measured gate, not a review note.** Deep Time proved unaided contrast over varied imagery bottoms out near 1:1 and that blurred-copy glows are worth nothing; its build-time solved scrim reached 3.02:1 and its text scrim solves to 4.5:1. Whatever device is chosen here must clear an equivalent **measured** gate over real source images, including the worst case (pale artifact on pale ground).
6. **Attribution as design.** Every image needs a credit. At this volume credits are a visible, recurring design element, not an afterthought — decide whether they sit on the card, in a hover, or in a credits view, and make it look intentional.

**Anchor before mocks:** the anchor is no longer this ticket's first step — it is [11](11-visual-anchor.md), split out and unblocked so the direction is locked early rather than discovered late. **This ticket does not start until 11 is closed**, and every prototype it produces is checked against 11's references and NOT list. Then prototype on **real sourced images spanning the worst-case range** ([02](02-image-supply.md) supplies them) — a treatment that works on five hand-picked images and fails on an engraving is a false pass.

**Deliverable:** a working prototype on a representative sample linked from this ticket, the treatment stated precisely enough to build a pipeline against, and its measured contrast result over the worst-case sample.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

- **Volume is 200–400 images, not ~100.** Any treatment requiring per-image manual work (notably the cut-out decision, item 2) must be costed at that number before it is chosen. A rule that needs a human eye per image is probably disqualified by arithmetic.
- **[01](01-the-fun-thesis.md)'s judgment test governs the size grammar:** favour density over hero-scale, *until the photograph stops being enjoyable* — that lower bound is this ticket's to find and state as a number. It is the brake that stops "more per screen" becoming a contact sheet, and it is the direct trade-off against item 5's legibility gate.
- **Co-occurrence must be visible in the layout.** The engine is ambient contemporaries, so the card anatomy (item 3) has to carry not just name/date/credit but *what else was standing then and by how much it missed*. That is a real slot in the design, not a caption afterthought.
- **The index is a second surface with the same rules.** See [10](10-the-index-surface.md) — whatever unifying device is chosen here must also hold at index density, where many more items sit on one screen at once. Prototype it there too, or the treatment will be re-decided late.

---

## Input from [11](11-visual-anchor.md) (closed 2026-08-08)

**Read 11's resolution in full before starting.** It is the direction this ticket executes; every prototype is checked against its two references and its NOT list. Headlines:

**Items 1, 2 and 4 above are now pre-decided.** Do not re-open them without evidence.

- **Item 2 — cut out or leave whole: decided. Cut out, always.** Unframed objects on a ground; nothing has an edge except the thing itself. This is no longer a design question — it is a **pipeline cost at 200–400 images** for [03](03-engine-reuse-or-clean-build.md) and the build phase. Automated matting is masking, not generation, so it clears the no-generated-imagery constraint; **edge quality on hair, smoke, glass and engravings is now a live build risk** and this ticket should look at the worst of them.
- **Item 4 — the ground: decided, and it changes.** The ground is the material of the age, blending continuously: earth `#6b5240` → stone `#8d8577` → parchment `#e6dcc4` → iron/soot `#3a3a3c` → paper `#f4f1ea` → screen `#0a0c10`. **Those values are indicative — setting them against real images is this ticket's job.** Flat colour fields only; no grain, no texture, no skeuomorphism.
- **Item 1 — the unifying device: decided.** It is the ground plus the cut-out grammar, not a treatment applied to the images. **The photographs are untouched** — no tint, no duotone, no colour grade. Authenticity is the site's whole claim, and 11 ruled the brand's Visual Cinnamon canon inapplicable here precisely because there is no drawn layer to make colourful.

**Item 5 — the legibility gate just got harder, and it is the main thing this ticket must measure.** A changing ground means there is no single worst case. A cut-out on iron `#3a3a3c` and a cut-out on paper `#f4f1ea` are two different problems on one page, and the pale-on-pale worst case now has a mirror in dark-on-dark. Measure both ends of the ramp, not one.

**Item 3 — type is inherited, not re-decided.** Archivo, small, tabular figures, never a display hero. The fixed HUD is inherited from Deep Time (`#hud-num` + `#hud-era`), with one change: **Deep Time's `1 px = N years` line cannot be printed here** — distance is density-warped, so the line would be a lie. The era name carries "where am I"; the counter's own uneven rate is the honesty.

**A new editorial requirement this ticket owns.** A ground that changes by era **asserts era boundaries**, and periodization is contested and regional — the Bronze Age arrives millennia apart in different places. Against the map's absolute date-honesty constraint and its global-not-Western-canon requirement, an unexamined ramp smuggles in a Eurocentric periodization as a visual fact. **Decide how boundaries are defined and how that is disclosed** — a continuous blend with no named thresholds is one legitimate answer, and probably the cheapest.

**The one thing 11 could not settle:** it produced **two** anchored references, not the 3–5 asked for — Deep Sea and Deep Time, both with specific stated reasons. If prototypes here turn out unjudgeable against two, that is grounds to reopen 11 rather than to guess.

**A look preview already exists — read it before starting.** `prototypes/anchor-preview/` (with its
`README.md`) executes 11's rulings on 12 real cut-outs: the six-ground ramp, the cut-out grammar, four
abreast, the HUD without the `1 px = N years` line. It is **not** a pass on this ticket's gate — it is
hand-picked images on a hand-picked span, which this ticket calls a false pass. It does carry seven
findings that cost real time, and it ships the gradient-aware `knockout.py`. Four that bear directly
on the items above:

- Museum sweeps are **gradients**; a fixed-tolerance flood halos every object (item 2's pipeline).
- A single global knockout rule cleared only ~⅔ of candidates; the rest needed per-image parameters —
  **the arithmetic this ticket says should disqualify a rule** (item 2).
- Some objects **cannot** be separated at any threshold when their own value matches the sweep. That is
  a **sourcing** criterion for [02](02-image-supply.md), not a processing one.
- Stone `#8d8577` measures **3.24:1 against cream and 4.95:1 against ink** — a mid-value ground is the
  worst case for *both* inks, and ink must flip **per row** or captions black out on the light grounds
  (item 5). This is the two-ended gate, demonstrated.
---

## Input from Dustin, 2026-08-08 — the label, and a background that moves with the era

Both given after seeing the 230-item set run.

**1. The name shatters with the object.** He worked through it out loud and landed on the last
version, verbatim:

> *"I think we want the names to go beneath the ground when the object hits the ground. We don't
> want the names to pop up on top of the ground like they are. And we probably actually never mind.
> I think we want the names to disappear right when they shatter. Or better yet, the name Shatter
> with them"*

**Take the last one: the name shatters with the object.** It does not fade, it does not sink, it
breaks the way the object breaks. This *refines* [13](13-visual-direction-v2.md)'s ruling rather
than reversing it — 13 said the name and date go out at impact and the `source · licence · credit`
line lives as long as one fragment; that stands, and this decides *how* the name goes out.

The complaint underneath it is live behaviour worth fixing regardless: **right now names sit above
the ground line and read as UI**, not as part of the object.

**2. A background that changes with the era.** Verbatim:

> *"we're probably also going to have to come up with a realistic background that changes based on
> the time."*

**Careful here — this sits right next to a closed ruling and must not quietly reverse it.**
[13](13-visual-direction-v2.md) settled that **the ground never moves and never changes colour**,
and that the dated colour system is **the light**, not the earth. A changing *backdrop* — the
air/sky behind the falling object — is a different surface from the earth, and reading it as *the
light* is consistent with 13. Reading it as *a new dated ground* is not.

State which one is being built before building it. If it turns out the honest version needs the
earth to change too, that is a reopen of 13 and only Dustin does that.

---

## Round 8, 2026-08-09 — the word is the unit. 06's citation half closes.

Three things, in the order Dustin gave them, built on the one live page
`prototypes/webgl/index.html` — **no `?v=`, no `?b=`, no launcher, no compare, no directions
demos.** Verified by a 29-gate headless sweep, and every gate this round added was broken on
purpose first and had to go red.

### Ruling 1 — the losers went in the same commit, and that is now the standing rule

[13](13-visual-direction-v2.md) picked GRAVITY / SHATTER outright. Rounds 6 and 7 nevertheless
kept `b=CRUMBLE`, `c=SIFT`, `v=1 DEPTH`, `v=3 MATERIAL`, `v=4 ATLAS`, a switcher bar,
`launcher.html`, `compare.html` and the three flat `directions/` pages alive alongside it — so
every change since has been paid for five times. All of it is deleted, with the code behind it:
`buildCore`, `detachCell`, `biteColumn`, `strips`, `punch`, `biteUp`, `jitter`, the `Ground`
class, `windowMask`, `STRATA`, and the whole `vendor/` tree including three.js and matter.js.
`2-gravity.js` is now `gravity.js` — the number was an option index and there are no options.
`directions/` is what it always actually was, [05](05-arrival-set.md)'s data pipeline, and its
README says so.

**Standing rule from here: when a direction is picked, the losers go in the same commit.**

### Ruling 2 — the source shatters with the piece. THE WORD IS THE UNIT.

Verbatim: *"I would like the sources to shatter with the peace and not just stack up on the
ground."*

What was there: one two-line block of DOM text per object, parked below the ground line and
packed into whatever row was free — six at once, identical size, identical grey, sharing a
handful of baselines behind a debris field they were attached to by nothing. A filing cabinet.

**A name, a date and a citation are now built as individually positioned words**, because text
made of one box cannot do the thing 13 asked the objects to do. **13's lifetime ruling is
untouched** — the credit lives exactly as long as one fragment and dies with the last speck.
This changed how it is carried, not how long it lives.

- **Whole** until the object's *first* split: one line of words, riding under the object as it
  falls and then lying where it fell.
- **At the first split** the line breaks at its own separators into three groups, and the groups
  move apart across the width the object's debris has reached.
- **At the second split** the groups break into single words, scattered across it.
- **Throughout**, the citation decays with its object: the type scales 1.00 → 0.82, the ink runs
  238 → 188, and every word lies down on the slope of soil it landed on. That gradient is what
  stops six of them reading as a list — no two share a baseline, no two share a weight, and each
  one is exactly as wide as its own wreckage.

The spread is not an animation. It is a **readout of where the fragments actually are**, taken
off the live piece positions every frame, and it is gated as one: the harness re-derives the
target span from the real fragment coordinates and demands the words match it.

**The name shatters too** — this ticket's own input item 1, handed here by 04 round 7 ("06 owns
replacing the pop with a shatter"). At impact its words are thrown up and out with the shards
and are gone within 7% of the object's life. Scroll-driven like everything else; there is still
no wall clock anywhere in the file.

**Accessibility:** every object carries one visually-hidden span with the citation as an
unbroken string, so a credit scattered as six words is still read as one line.

### Ruling 3 — the miss is CUT INTO the line. The caption is gone.

`SAME YEAR` / `40 YEARS APART` is dead — his word: *sucks*. 04 ruling 6's line stays and means
exactly what it meant.

**The line is cut once per year of miss.** Two things that arrived in the same year share one
unbroken hairline. Two that missed by forty have forty breaks in theirs. The cut is capped at
16px and otherwise takes a fixed 40% of the line between them, which is the curve that reads at
both ends: one miss is a single obvious break, five are five countable ones, and eighty is a
dotted trace — which still says the only thing eighty years has to say. Nothing is written,
nothing has to be read, and **the encoding is exact rather than relative**: segments = years + 1,
gated against the dates rather than against anything the page stores about itself.

Two things this needed that the caption had been hiding:

- **Ties are ranked by recency and each sits a little deeper than the one above it.** Five ties
  drawn on one contour merge into a single unbroken stroke and the count becomes unreadable.
  Older relations settling under newer ones is what everything else here does with age.
- **The exact gap is still recoverable** — both objects printed their dates on the way down and
  the counter is on screen throughout. The line answers *how tightly*, not *how many*, and a
  stranger picks the grammar up from the same-year pairs, which are 71 of 230. If that turns out
  not to land, [07](07-copy-voice-and-name.md) owns one line of onboarding — not a caption per
  tie.

### Item 5 — legibility, measured, and the answer turned out to be structural

06 asked for legibility as a gate rather than a review note, and [11](11-visual-anchor.md)
warned that a changing ground made it two-ended. **13 closed that by freezing the ground**, and
this round makes the consequence explicit: **the citation always lies on the baked earth, which
is the only surface in the piece whose value never changes** — the era's colour is a light, and
the light is painted *before* the opaque earth goes down over it. The worst case is therefore
single-ended and solvable once.

`INK_LO = rgb(188,190,194)` is the dullest ink that clears 4.5:1 against the lightest patch of
that soil. Not asserted — the sweep samples the **composited canvas pixel under each word**,
blends the word's own colour over it at its own opacity, and reports the worst of 455 samples:
**5.16:1**. The first attempt measured **4.38:1** against an ink floor picked from the soil's
flat matrix value, which is how the mottle's light blobs got found.

Two placement rules fell out of the same gate. A word may **never climb above its own soil
line** — above it is lit sky or a photograph, the two surfaces the gate is not solved against.
And a word may **never be placed below the fold**, because a citation off the bottom of the
screen is a citation that is not on screen.

### The phone is a different packing problem, and it needed four things

390×844 holds the same six citations in 245px of soil. Fewer, longer words (5 at most, against
7); type at 0.84; the ground line raised to 0.64 of the viewport instead of 0.71; and a
shattered citation taking the full width rather than the ~250px its own fragments happen to
span — the same adaptation the tie already makes on a phone, on the same grounds. Also capped:
how far a word may lie over. The collision box is the *rotated* one, and a 103px word on a steep
stretch of soil measured 15° and a 22px-tall box, which no search can step off.

### What the sweep says — 29 gates, 29 green

Fresh page load per phase (contact latches, so a page that has been anywhere is not a first
visit). Every round-7 gate re-runs green, plus:

| gate | result |
|---|---|
| `one_page_no_flags` · `query_flags_are_dead` | every other option 404s; `?v=1&b=c` renders the same one page |
| `no_miss_caption` | no year phrase in the DOM at any of 1,043 stops |
| `tie_cuts_are_true` | 0 ties whose drawn segment count is not `years + 1` |
| `credit_lives_with_the_last_fragment` | 0 objects with a fragment down and part of its citation missing |
| `credit_never_outlives_it` | 0 orphaned words in the DOM |
| `credit_is_one_line_until_it_breaks` | 0 of 1,618 un-split citations wider than their own line |
| `credit_spreads_with_its_wreckage` | 0 of 2,053 shattered citations not as wide as their debris |
| `name_dies_at_impact` | 0 names alive past 7% of a life; 254 caught mid-break |
| `credit_contrast` | worst **5.16:1** over 455 composited-pixel samples |
| `no_text_collision` | **0** overlaps over 290 stops, at 1440×900 **and** 390×844 |
| `frozen_when_idle` | byte-identical after 2 s of wall clock |
| `ground_is_the_moment` · `head_is_barer_than_body` | unchanged from round 7 |
| `frame_budget` | warm median **16.6 ms**, p95 **17.9 ms** |

**Teeth, proved — ten perturbations, ten reds, ten reverts.** Fixing the spread to a constant,
breaking the citation before the object does, killing it at the dust, leaking its nodes, cutting
the line three times too many, printing the phrase again, never retiring the name, dropping the
ink floor to 120, injecting a wall clock into the spread, and disabling the placement search:
each turns exactly its own gate red and nothing else.

**Two gates were tautologies on the first attempt, and the gates were rewritten rather than the
perturbations.** `credit_never_outlives_it` counted a leaked citation as expected, because it
summed the expected node count over every drop that still owned words. `tie_cuts_are_true` asked
whether the drawn dash agreed with the gap *the page had stored*, so corrupting the stored gap
moved both sides together. Both now check against the tables.

**One measurement changed, and it is named.** `frame_budget` used to time a single pass over a
page nobody had scrolled, which pays every one-time cost there is. Round 7 measured that and
happened to catch a quiet machine at 16.4 ms; the same code measured 27 ms today, and the
shipped round-7 build measured **21.5 ms** back to back against round 8's **20.2 ms** in the
same window. The gate now times three passes, gates the two warm ones, and **prints the cold
first pass** instead of pretending it is not there (cold 16.4/22.0 ms in the run above).

### Frames

`prototypes/webgl/verify8/` — `00`–`01` the bare head, `02` the seam at three fields, `03`–`06`
the body at six fields and five ties, `07`–`09` the same at 390×844. The `-ground` crops are the
soil band, which is where all of this round's work is.

### Still open in 06

- **Item 4, the dated backdrop.** Dustin's second ask of 2026-08-08 — *"a realistic background
  that changes based on the time"* — is **not built**. The era's light is still 13's radial glow
  and low haze. Building a backdrop means stating first whether it is the *light* (legal under
  13) or a new dated *ground* (a reopen of 13, and only Dustin does that).
- **The texture window.** 04 handed over a measured lever — 396px sprites make `prep` 12×
  cheaper at 163 MB decoded against an 80 MB gate. It runs in the sweep as a standing gate and
  is [03](03-engine-reuse-or-clean-build.md)'s to spend.
- **The index surface.** [10](10-the-index-surface.md) has not been prototyped against this
  treatment, which item 1 said it must be.
- **A handful of credits are bare URLs** (`https://commons.wikimedia.org/wi…`), which read badly
  as scattered words. That is the record, not the treatment —
  [05](05-arrival-set.md)/[07](07-copy-voice-and-name.md).
