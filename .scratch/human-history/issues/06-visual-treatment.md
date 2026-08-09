# 06 — Visual treatment: one system from many sources

Type: prototype
Status: open
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
