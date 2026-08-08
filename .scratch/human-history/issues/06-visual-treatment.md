# 06 — Visual treatment: one system from many sources

Type: prototype
Status: open
Blocked by: 01, 02
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

**Anchor before mocks:** lock a loved reference and an honest positioning statement before building anything. Then prototype on **real sourced images spanning the worst-case range** ([02](02-image-supply.md) supplies them) — a treatment that works on five hand-picked images and fails on an engraving is a false pass.

**Deliverable:** a working prototype on a representative sample linked from this ticket, the treatment stated precisely enough to build a pipeline against, and its measured contrast result over the worst-case sample.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

- **Volume is 200–400 images, not ~100.** Any treatment requiring per-image manual work (notably the cut-out decision, item 2) must be costed at that number before it is chosen. A rule that needs a human eye per image is probably disqualified by arithmetic.
- **[01](01-the-fun-thesis.md)'s judgment test governs the size grammar:** favour density over hero-scale, *until the photograph stops being enjoyable* — that lower bound is this ticket's to find and state as a number. It is the brake that stops "more per screen" becoming a contact sheet, and it is the direct trade-off against item 5's legibility gate.
- **Co-occurrence must be visible in the layout.** The engine is ambient contemporaries, so the card anatomy (item 3) has to carry not just name/date/credit but *what else was standing then and by how much it missed*. That is a real slot in the design, not a caption afterthought.
- **The index is a second surface with the same rules.** See [10](10-the-index-surface.md) — whatever unifying device is chosen here must also hold at index density, where many more items sit on one screen at once. Prototype it there too, or the treatment will be re-decided late.
