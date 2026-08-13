# 06 — Visual treatment: one system from many sources

Type: prototype
Status: CLOSED - items 1, 2, 3, 5 and 6 in round 8; item 4, the dated backdrop, in round 9
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

## Round 9, 2026-08-09 — the dated backdrop. It is the LIGHT. 06 closes.

Item 4, Dustin's second ask of 2026-08-08: *"we're probably also going to have to come up with
a realistic background that changes based on the time."*

### Ruling 1 — it is the LIGHT, and the other two readings were not close

Stated before building, because this ticket's own input said to. Three readings, one legal:

| reading | verdict |
|---|---|
| the air above the ground line **is the era's light** | **legal under [13](13-visual-direction-v2.md)**, which put the dated colour system in the light and froze the earth. A different surface from the ground. |
| a depicted scene behind — cave wall, street, skyline | **dead on two constraints that are not 13.** It needs generated or modern-illustrated imagery, which the map forbids outright; and a backdrop plate has an edge, which [11](11-visual-anchor.md) forbids. Not a reopen — out. |
| the **earth** changes colour by era | **reopens 13, and reopens 06's own item 5** — the legibility gate closed single-ended precisely because the soil's value never changes. Dustin's, not a ticket's. Untouched. |

**Nothing here touches one pixel of the earth**, and that is a gate rather than a claim:
`ground_never_dates` samples 30 composited earth pixels at five eras and demands they be
byte-identical. They are.

### Ruling 2 — what is dated is REACH, and it is a smooth function of the year

A hue on a gradient is not a light. What makes this realistic is **how far the light people
actually had got**: a flame lights a few metres and the sky over it is black and full of stars;
gas, then arc, then filament lighting push a glow up off the horizon until the sky itself is the
lit thing and the stars are gone. Real, dated, and measurable — it is what the Bortle scale
measures.

**Reach is a logistic on the year centred on 1920, not a step per lamp — deliberately.**
[11](11-visual-anchor.md) warned that a dated backdrop asserts era boundaries and that
periodization is regional. A step at 1820 prints *"the world had gaslight in 1820"* as a visual
fact. A continuous curve claims only that artificial light got stronger over time, which is true
everywhere. **Nothing is written**; the HUD's lamp name is the only disclosure and it was already
there. 13's colour ramp is untouched — reach drives value, the ramp still drives hue.

Four layers, all functions of reach and therefore of the scrollbar: the unlit night · a baked
star field, erased by skyglow and gone by reach 0.72 (~1950) · the lit pool, which at firelight
is small, bright and low and at LED is the whole frame and nearly even · the lit air on the land.
**The pool's shape changes, not just its colour** — which is [12](12-scrollytelling-craft.md)'s
flatness rule paid: item 6 and item 226 are not the same picture in a different tint.

### The backdrop is cached, and the cache is a cache of a pure function

Four large fills a frame cost 3–6ms on a canvas Chromium has demoted out of GPU acceleration.
Every one of them is a pure function of (reach, the era's colour, the viewport), so the backdrop
is drawn into its own canvas and redrawn only when that key changes; the frame pays one opaque
blit. The key quantises reach to 1/256 and the colour to two units — a fifth of one channel
value, below what a screen can show — which takes the redraw from every frame to about one in
five. **This is not an easing.** The value drawn at a scroll position is the value that position
asks for, and `backdrop_is_scroll_only` stands there to check it.

**It caught the cache's first version**, which keyed on the rounded reach but baked from the raw
one: two positions inside one bucket shared a key and not a value, so the sky you got was
whichever edge of the bucket you entered from — the same scroll position drawing two different
skies depending on whether you came down to it or up to it.

### One real defect, found by a pixel scan and not by the eye

The first sky fill covered the canvas only down to the ground line. The soil contour wanders
±32px either side of it, so the sliver above every dip was a band **nothing cleared** — the haze
composited over itself every frame and saturated to the era's colour at full opacity, printing a
lit hairline tracing the whole horizon. A stroke, which is the one thing 11 says nothing on this
page has. The fill now covers the whole canvas, and the haze ramp reaches its value 40px above
the ground line and holds it flat through the contour zone, so a dip and a rise are the same
value and the horizon is a value step.

### What the sweep says — 34 gates, 34 green

All 29 of round 8's re-run green, including `credit_contrast` at **5.16:1** over 455 composited
samples and `no_text_collision` at **0** over 290 stops at 1440×900 **and** 390×844. Five new:

| gate | result |
|---|---|
| `backdrop_is_dated` | sky value tracks reach at every step; **×10.8** firelight → LED. Where the lamp does not change — 3500 BCE to 100 BCE — the sky is identical, which is the honest half. |
| `ground_never_dates` | **30 earth pixels byte-identical across all five eras** |
| `stars_go_out` | 165 → 165 → 64 → 0 → 0 |
| `hud_contrast` | worst **9.54:1** over the HUD number and era name at every era |
| `backdrop_is_scroll_only` | same position, two paths, plus 2s of wall clock — identical |
| `frame_budget` | warm median **16.7ms**, p95 floor **19.0ms** |

**Teeth — six perturbations, six reds, six reverts, file restored byte-identical.** Freezing
reach, tinting the earth by era, keeping the stars lit through electrification, lifting the sky
until the HUD stops reading, easing reach toward its target, and putting the cache's raw-value
bake back. Two reddened a second gate as well, and both follow: a frozen reach also stops the
stars going out, and an eased reach also stops the sky tracking reach.

**Two of the new gates were wrong before the page was**, which is round 8's pattern repeating.
Both read falling-object pixels as sky: `stars_go_out` counted 1,775 stars at one era and 1,362
at another whose star field is *identical*, and the difference was one sprite's edges. Every sky
reading is now taken with nothing in the air.

### Frames

`prototypes/webgl/verify9/` — named by the lamp, `00` firelight through `08` LED, `09`–`11` the
same on a phone. The `-sky` crops are the backdrop band, which is where this round's work is.

### Still open in 06

- ~~**The texture window.**~~ **Spent by [03](03-engine-reuse-or-clean-build.md) round 10.**
  The sprites are baked at the height they are drawn and released once shattered: 301.2 MB → a
  **3.1 MB** measured peak. Nothing about the treatment changed — master and bake are
  indistinguishable at 1:1 (`prototypes/webgl/verify10/sprite-master-vs-bake.png`), and every one
  of this round's 34 gates re-ran green, twice.
- **The index surface.** [10](10-the-index-surface.md) has not been prototyped against this
  treatment, which item 1 said it must be. 03 has budgeted it: thumbnails must be a **second
  bake**, because CSS scaling does not reduce decoded cost.
- **A handful of credits are bare URLs** (`https://commons.wikimedia.org/wi…`), which read badly
  as scattered words. That is the record, not the treatment —
  [05](05-arrival-set.md)/[07](07-copy-voice-and-name.md).

## Round 10, 2026-08-12 — attribution moves to the END. Most of round 8's build is deleted.

Three changes, put in front of Dustin as options before anything was built — he picked
GRAVITY/SHATTER and the name that way both times, and these interlock too hard to guess at.
He picked **a wordless ground · one ground line at 0.78 · NAME_OUT 0.05**.

### Ruling 1 — the citation comes off the piece

The credits roll under the shelf already discharges every licence in the record: **CC BY 4.0
3(a)(2)** says the conditions may be satisfied by *linking* a resource that carries the required
information, and the roll links each source to its own file page. Round 8's own comment had
already conceded the other half — *"a link riding a word that is about to be thrown across the
soil is unreachable"* — so the piece was carrying the obligation in the one form that could not
discharge it, while the roll carried it in the form that could.

**Deleted with it:** the three-state spread (whole → three groups → single words), the
wreckage-span readout, the per-word type-and-ink decay ramp, the cluster row search, `credTokens`,
`CRED_PX`, `CRED_LO`, `INK_LO`, `INK_HI`, `TILT`, `GAPP`, `brk`, `slopeAt`, the `g`/`p` layouts,
and the whole ink parameter through `put`/`draw`. **289 lines out of `gravity.js`.**

**Kept, deliberately:** the per-object visually-hidden `sr` span carrying the full citation. The
roll is where the licence is discharged; that span is the same information reaching someone who
never sees the roll's layout, and removing it would have been a regression dressed as a deletion.
Whether 236 spoken citations is the right shape for a screen reader is [08](08-accessibility-and-mobile.md)'s.

**Nothing recognisable was taken away, and this is why the change is cheap rather than brave.**
What lay on the soil was `source · licence · credit` — the SOURCE, never the object's name. The
name already died at impact. So no heap lost the thing a visitor could identify it by; what left
the ground was the attribution, which is now at the end where the visitor has stopped.

### Ruling 2 — the ground drops, to ONE line

`groundY` was `H * (W < 720 ? 0.64 : 0.71)`. It is now `H * 0.78` at every width.

**The split was never a look.** It was round 8 buying a 390px phone 245px of soil to pack six
citations into — the same round that raised the phone's ground line records exactly that reason.
Ruling 1 deleted the reason, so the split went with it rather than being re-tuned. What the band
below the line still has to hold is the contour's own wander (±32px), the tie band (24px) and the
ending's standing cluster; 186px on a phone and 198px on a desktop clears that with room.

Objects fall **+22% further on a phone** (540 → 658) and **+10% on a desktop** (639 → 702).

### Ruling 3 — the words go quicker, and most of that was ruling 1

`NAME_OUT` 0.07 → 0.05. **The larger half had already happened**: the citation lived the object's
whole life, 1,400–4,200px of scroll, and the name lives 0.05 of it — 70–210px. Taking the citation
off cut on-ground text time by ~93% before this constant was touched.

**`SPLITS` and `DUST_AT` are untouched.** The round's input named them as a lever for word
lifetime, and they are not one any more: they are 13's *object* schedule, and with no text keyed
to them, moving them would be reopening 13's shatter grammar to change nothing about words.

### Five gates were re-aimed, not four — and the fifth is the one that mattered

| round 8 | round 10 | claims |
|---|---|---|
| `credit_lives_with_the_last_fragment` | `attribution_is_only_at_the_end` | no `.c` node **and** no licence string printed on the piece, at 1,071 stops |
| `credit_never_outlives_it` | `no_orphaned_words` | no word left by an object that is neither up nor down |
| `credit_is_one_line_until_it_breaks` | `label_is_one_line_until_impact` | 0 of 748 airborne labels wider than the 330px wrap |
| `credit_spreads_with_its_wreckage` | `the_ground_carries_no_words` | 0 words over the soil past `NAME_OUT`, across 5,288 landed-and-broken readings |
| `credit_contrast` | `label_contrast` | **worst 7.81:1** over 195 samples at 14 arrivals, firelight → LED |

The ticket's brief said four `credit_*` gates. **There are five**, and `credit_contrast` was the
one that lost its subject completely — it sampled `d.cred` and nothing else.

**Two of them were rewritten to stop being tautologies rather than ported.**
`label_is_one_line_until_impact` compares the label's **rendered rects** against a wrap width the
harness computes **itself** from the viewport, so a build that widened its own wrap cannot widen
the bound it is tested against — which is precisely how round 8's two tautologies failed.
`attribution_is_only_at_the_end` reads the record's **licence vocabulary out of the data**, so a
re-implementation that put the credit back under a different class name cannot slip past a `.c`
count. Both halves have their own perturbation.

**`label_is_one_line_until_impact` is measured IN THE AIR**, which is the only place the claim
means anything now: the break throws the words ±95px on purpose, so a span test over a landed
object would be testing the break, not the line.

`only_the_last_one_survives` follows the same rule — 14's ending keeps **every** word it was built
with (`wordVis === wordTotal`), there are simply fewer of them.

### The risk the round was opened knowing about, and it did not land

Round 8 solved legibility **single-ended** and could: the citation only ever lay on the baked
earth, which 13 froze, so there was one worst case and `INK_LO` was picked against it. The label
rides under a falling object over the **dated sky** and sometimes over the photograph — the two
surfaces round 8 says explicitly it was not solved against, and which nothing on this project had
ever measured. That was flagged to Dustin before building as the thing that could turn a cheap
round into a long one.

**Measured: 7.81:1 against a 4.5 gate**, sampling every ~17th arrival so firelight through LED is
covered rather than four stops in the crowded body.

**And the worst case is the opposite end from the one that was feared.** It is a *date* word — ink
`rgb(255,122,26)`, the era's own spot colour — over a **black** firelight sky, not a near-white
name over a lit LED one. The bright end is comfortable because the label is near-white and round
9's LED sky tops out at value 132.

**The `text-shadow` is deliberately not counted.** `#labels span` carries
`0 1px 4px rgba(0,0,0,.95)`, which is a real legibility device and is part of why this text reads
on any sky — but WCAG's ratio has no term for it, and giving it an allowance here would be marking
the round's own homework. The number reported is the raw ink-to-pixel ratio.

### `no_text_collision_390` is closed, and the 8 overlaps are attributed rather than assumed

Ticket 15 recorded the red as *"almost all credit words"*. **It was 8 of 8** — every overlap was a
credit word against another credit word, across three stops in the crowded tail:

```
y=92500  "Armour through the Ant…" x "Jonathan Cardy" / "Wikimedia Commons" / "Damian B Oh"
y=97500  "Osama Shukir Muhammed"   x "Richard L. Chilton" / "Public domain" / "Wikimedia Commons"
         "Richard L. Chilton"      x "Wikimedia Commons"
y=99000  "Gift of Mr. and Mrs."    x "CC BY-SA 3.0"
```

The same probe over the same 321 stops now returns **0**, and **the maximum words on screen went
33 → 7**. The gate did not get easier to pass by luck; what had been competing for the soil band
was the soil band's own contents.

That 33 → 7 is also the round's one gate-quality worry, so it gets its own perturbation rather
than a reassurance: *a gate with seven boxes to compare may no longer be able to catch anything.*

### The roll's gate is now load-bearing, and it was checking the wrong thing

`every_item_carries_its_attribution` (sweep11i) checked that each row's **text** carried name,
date, source and licence. It did not check that the source was a **link** — and the entire legal
basis for ruling 1 is CC BY 4.0 3(a)(2), which is discharged *by linking*. With the piece's
citation gone, a roll with complete text and no anchors would be a licence breach that the gate
called green. **It now requires an http(s) link per row**; 236/236.

### The harness cost, and an old lesson paying for itself

- **A perturbation run was killed mid-sweep by a 10-minute tool timeout and left its patch in
  `gravity.js`.** The README's rule held: the file was restored by **replacing the exact bytes**,
  not by `git checkout`, which would have discarded the entire round. Round 14 lost an afternoon
  learning that; round 10 paid nothing. The teeth then ran backgrounded, and **the round was
  committed before they started** — the same README rule from the other side, since
  tracked-and-committed is the only state that survives a careless command.
- **A disposable smoke probe reported the ending with 0 words** and the page was fine: the probe
  waited 6 rAF and not on `pending()`, so it read a page whose last photograph had not arrived.
  Sixth time this project that the instrument was wrong and the page was not — and the first time
  it cost nothing, because a gate that *does* wait had already said otherwise in the same session.
- **`site/httpd.log` was one commit from being publicly served.** The harness README tells you to
  redirect the static server's output into the directory it serves; ticket 15 made `site/` the
  deploy root. Now gitignored, with the reason written next to it.

### Teeth — nine perturbations, and they found a decoration in this round's own work

| perturbation | expected | result |
|---|---|---|
| the citation comes back onto the piece | `attribution_is_only_at_the_end` | **RED**, 2,093 stops |
| …comes back under a DIFFERENT class | `attribution_is_only_at_the_end` | **RED** — caught by the licence string, `{"y":140,"lic":"CC BY-SA 4.0"}` |
| the ground keeps its words | `the_ground_carries_no_words` + `name_dies_at_impact` | **RED**, both, 5,282 objects |
| the label's ink matches the sky | `label_contrast` | **RED** at **1.01:1** |
| the ending drops one word | `only_the_last_one_survives` | **RED** — `wordVis 3, wordTotal 4` |
| words stop reserving their ground | `no_text_collision_390` | **RED**, **51 overlaps** |
| the roll loses its link | `every_item_carries_its_attribution` | **RED**, all 236 rows |
| the label stops being one line | `label_is_one_line_until_impact` | **NOTHING. The gate was a decoration.** |
| *(control)* the ground does not drop | nothing | **RED** — and the answer is better than the question |

**The two halves of `attribution_is_only_at_the_end` are separately proven**, which is the whole
reason it was built with two. Case 1 is caught by the `.c` node count; case 2 puts the credit back
under `.n` and only the licence-vocabulary read sees it. Either half alone would have shipped a hole.

**`no_text_collision_390` survived the round with teeth**, which was the open worry: the round took
it from 33 boxes to 7, and a gate with seven things to compare is the prime suspect for a green by
emptiness. Deleting the word reservation gives it **51 overlaps** at 390 and 56 at 1440. It is a
guard, not a decoration — and note it is now *more* reliable than ticket 15 recorded it, which found
the same perturbation a knife-edge that caught the defect on one run in two at 33 boxes.

#### The decoration, found in this round's own re-aim

`label_is_one_line_until_impact` asserted the airborne label was no wider than `lay()`'s
`min(W * 0.42, 330)` wrap. **Widening the page's own wrap to four viewports reddened nothing.** A
name and a date are three to five short words: the widest label on the site runs **230px against
the 330px bound — 100px of headroom** — so the bound cannot bind and the gate could not fail. 748
airborne labels, none wider, and none that ever could be.

That is round 12's lesson arriving inside the round that quoted it, and it is the second time in
this project that a gate counted green in a table was structurally incapable of failing.

**Replaced by `label_rides_with_its_object`**, which carries the claim that has teeth: every
airborne label is centred on **its own object's x** within 4px, arithmetic the harness repeats from
the object's position rather than reading the page's answer. Round 5's scar is the real risk it
guards — a label that stopped tracking its object was once clamped 84px off the surface and printed
across the photograph on every arrival. Its perturbation pins the cluster to the middle of the
screen. **And the slack half is now REPORTED rather than asserted**: the gate prints the widest
label against the wrap and the headroom between them, so if the wrap ever stops being what holds
the label together, the number says so instead of a green.

#### The control case, and the two changes are not independent after all

`the_ground_does_not_drop` reverts ruling 2 and was written to redden **nothing** — the ground line
is a look, and a red would mean a gate had been silently pinned to a number Dustin chose.

It reddened `signature_keeps_its_corner_clear`, and the reason is the good kind.
[14](14-the-ending-and-the-frame.md) built that gate to fail **both** ways: on an overlap, and on a
corner **nothing ever reaches**, because zero overlaps over a corner no word can touch proves
nothing. At the old 0.64/0.71 ground line, with the citation gone, **no word comes within 24px of
the pill across 258 phone stops and the gate declares itself a decoration.**

So: **ruling 1 emptied the soil band, and ruling 2 is what puts words back near the signature.**
Without the ground drop this round would have quietly retired 14's corner gate. The margin is
genuinely thin and is recorded rather than smoothed — at 0.78 the nearest approach is **2.2px**,
with 8 stops putting a word inside 24px. It passes, and it has no room.

#### And the harness was wrong twice, in the round's own tooling

- **A crashed sweep reported as "no gate went red".** The round-9 sky probe gives up finding a frame
  with nothing in the air when the machine is loaded — and a teeth suite *is* a loaded machine — so
  three runs died **after** printing their gate results, leaving no `FAILED:` summary line to parse.
  The harness read that as "did not go red" and accused the page of a fault that was its own: all
  three had in fact reddened exactly their gate. **The FAIL lines are now the primary source and the
  summary is the shortcut.** Seventh time this project that the instrument was wrong and the page
  was not, and the first time the instrument's fault was a **false MISS** rather than a false green.
- **`frame_budget` went red in six of nine cases, and it is the machine.** Warm p95 25.1 / 29.3 /
  35.7 / 44.7 / 46.8ms while a perturbation suite ran, against **19.7ms and 21.4ms idle on the same
  build**. That is direct evidence for the question [15](15-deploy-and-the-card.md) left open: its
  production red (p95 25.7ms, worst 47.1ms) was measured on a machine running several other
  sessions, and load reproduces that number here without a CDN anywhere in it.

### Against production — the sweep FINISHED there, and `frame_budget` is settled

[15](15-deploy-and-the-card.md) left the piece unverified against production: `sweep10` did not
finish there, `frame_budget` was red and unattributed, the round-9 sky probe crashed on
`era 196`, and **7 of 43 gates had never run against the deployed origin at all.**

**The sweep now finishes against production**, and both of 15's mysteries were the machine.

#### `frame_budget` — the back-to-back, on an idle laptop

| origin | warm median | p95 floor | worst pass |
|---|---|---|---|
| `time-takes-all.vercel.app` (real CDN) | 16.5 ms | **20.6 ms** | 26.5 ms |
| `127.0.0.1`, minutes later, same build | 16.6 ms | **20.5 ms** | 33.1 ms |

**Indistinguishable — and localhost was the worse of the two on the worst pass.** 15 measured
**p95 25.7 ms and a worst of 47.1 ms** against the same CDN and recorded, correctly, that the
machine had been running several other sessions and that load was a live alternative explanation.
It was load.

**The teeth say the same thing independently**, which is what makes this an attribution rather than
a second reading: `frame_budget` went red in **six of nine perturbation cases** — warm p95 25.1,
29.3, 32.3, 35.7, 44.7, 46.8 ms — every one of them measured while a sweep suite was running, and
green at 19.7–21.4 ms idle on the same build. **The CDN never moved this number; the machine moves
it by 25 ms.**

The round-9 sky probe crash (`era 196: never found an empty sky`) is the same story: it did not
recur against production on a quiet machine, and it *did* recur three times during the teeth suite.
`settle()` gives up when the machine is loaded, not when the network is far away.

#### An EIGHTH instrument fault, and only a real network could ever have found it

`contact_is_a_position` went red against production and nowhere else — **on the first sweep that
ever finished there.** It takes three readings of the probe object (landed at `LAND+30`, airborne
200px back up, and airborne at the same pixel on a page that has never been past it) and every one
of them assumed the object was present to be read. **It is not, until its photograph arrives.**
"No pixels, no fall" ([03](03-engine-reuse-or-clean-build.md)) is the page behaving correctly; on
127.0.0.1 the photograph is always there inside four ticks, so the assumption had never cost
anything.

`fall_is_a_pure_function`, **twenty lines above it in the same file**, learned this exact lesson in
round 9 and was given a bounded wait. This gate has the same shape and was never exposed.

**Guarding one read moved the failure to the next one** — the first fix waited for `virgin` and the
re-run failed on `backUp` instead, which is the honest way to discover that the fault was the
pattern and not the line. All three now go through one bounded `waitFor`, and it is bounded for the
reason round 9 wrote down: **a photograph that never arrives is still a red, not a hang.**

This is what 15 said the production run was *for*. Its own words: three of round 10's gates were
green with their own code deleted because localhost is never late.

#### Still open, and named rather than chased

- **`stars_go_out` read 1,624 stars at one era against production** where the same era reads 177 on
  localhost. It **passed on the first production sweep and then failed identically (1,624) on the
  next two** — so it is not noise, and it is not a property of the CDN either; the most likely
  difference between the first run and the rest is a warm edge cache changing when sprites arrive.
  This is **round 9's finding arriving for the third time** — a sky probe counting a photograph's
  bright pixels as stars — now through the latency door: `settle()` returns a frame it believes has
  nothing in the air, and over a real network something is still being painted into it. Round 9
  fixed this by taking every sky reading with nothing in the air; that precaution is correct and is
  **not sufficient when the arrival of pixels is not synchronous with the scroll position.**
  **The page is not implicated** — `ground_never_dates`, `backdrop_is_dated` and `hud_contrast` all
  pass against production in the same run — and no ruling depends on it. It is a harness fault,
  it belongs to whoever next touches the sky probes, and it is written down rather than patched at
  the end of a long session.

### The CNAME landed

`timetakesall.dustincoledata.com` resolved during this round — Dustin's one open step from
[15](15-deploy-and-the-card.md). **200 on the real domain, serving this build** (`H * 0.78`,
`NAME_OUT = 0.05`, zero occurrences of `credTokens`). Push-auto-deploys held for the third time.
