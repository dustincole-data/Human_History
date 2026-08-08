# 03 — Reuse Deep Time's engine, or clean build

Type: research
Status: open
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What of Deep Time's implementation is worth carrying, and what must be built fresh — and does the memory budget survive either way?**

Dustin raised this explicitly as open. Unblocked because it is an audit of code that already exists.

Audit `Projects/Deep_Time` and rule on each piece — **carry / adapt / discard**, with a reason:

- Astro 5 static scaffold and build config
- the single 2D canvas + single `requestAnimationFrame` loop reading native scroll (measured 59.7 fps at 390×844 under 4× CPU throttle, zero frames over 50 ms)
- the no-collision layout contract and its scroll-sweep gate (incl. the later glyph-level and portrait-dwell checks)
- the build-time halo/scrim baker (blur at runtime cost 10 fps; baked instead)
- the contrast gate (3:1 across a subject's own boundary, WCAG 2.2 SC 1.4.11) and the build-time scrim solver at 4.5:1
- the accessibility contract: reduced-motion as `scrollY`-driven rather than time-driven, keyboard milestone jumps that announce what they skipped, `inert` regions
- the image pipeline: WebP over AVIF (measured better at matched quality, exact alpha), the duplicate-manifest-ID assertion, sizing from the opaque subject rather than transparent padding
- browser-coverage assertion harness (CDP), and the `+ 100lvh` document padding fix

Then answer the two questions that actually decide this:

1. **Does the canvas exist here at all?** Deep Time's canvas drew a *code-generated field* — a synthetic environment behind cut-out subjects. This site's content is **photographs**, and there may be no field to draw. If there is no field, the canvas, the field keyframes and much of the halo machinery are dead weight, and the honest answer is "DOM and CSS, no canvas." Do not carry the architecture out of familiarity.
2. **Does the memory budget survive?** This is the project's #1 technical risk and it is arithmetic, not opinion. Decoded cost is `w × h × 4` independent of encoding. Deep Time: **51 assets, 3.34 MB transfer, 75.56 MB decoded**, against an 80 MB gate — and its assets were small cut-outs. Here the images *are* the content and want to be large. Compute the ceiling honestly for a plausible set size from [02](02-image-supply.md), and if a naive all-resident approach exceeds it, **state the mechanism that fixes it** — decode-on-demand, windowed mount/unmount, capped display dimensions, `content-visibility`, or a smaller set. Only fewer resident pixels fixes resident memory.

Note the ordering trap: [04](04-scroll-mechanic.md) can propose a mechanic this ticket's memory ceiling forbids. Publish the ceiling as a **number with an explicit assumption set**, so 04 can design against it rather than around it.

**Deliverable:** a carry/adapt/discard table with reasons, a stated stack, and a decoded-memory ceiling expressed as *max simultaneously-resident image pixels* plus the mechanism that holds the site under it.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

- **Compute the ceiling against 200–400 items**, not 58. That is now the set size the mechanism requires.
- **Two surfaces to budget, not one.** [01](01-the-fun-thesis.md) added a browsable index ([10](10-the-index-surface.md)) — the one screen that may want *every* item resident at once. Budget it separately and state whether index thumbnails must be independently derived assets rather than the full-resolution files scaled in CSS. (Decoded cost is `w × h × 4` from intrinsic dimensions; CSS scaling does not reduce it.)
- **The mechanic will push against you.** [01](01-the-fun-thesis.md)'s judgment test rewards putting *more* recognizable items on one screen at once, so [04](04-scroll-mechanic.md) is now actively incentivized toward the densest screens the arithmetic allows. Publishing the ceiling as a hard number with its assumption set is therefore more load-bearing than when this ticket was written — 04 will design right up to it.
