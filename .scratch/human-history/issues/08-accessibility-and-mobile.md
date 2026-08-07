# 08 — Accessibility & mobile contract

Type: grilling
Status: open
Blocked by: 04, 06
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What is the accessibility and mobile contract, and which parts of it are build gates?**

Blocked by [04](04-scroll-mechanic.md) (the motion and distance model) and [06](06-visual-treatment.md) (the contrast device).

Deep Time shipped a strong contract and much of it transfers, but each piece must be re-ruled against this site's different mechanic and its **photographic** content:

- **Reduced motion.** Deep Time's rule was *remove motion, never distance* — particles became a function of `scrollY` rather than time, which put the site outside WCAG 2.2.2 entirely and made frames deterministic. Confirm this holds if [04](04-scroll-mechanic.md) chose a warped or arrival-driven mechanic.
- **Alt text at volume.** The real cost centre, and it has no Deep Time answer: Deep Time reused its per-subject analogy clause so alt text was free. Here every image is a distinct real photograph or artifact and needs genuine description. Decide the standard, who writes it, and whether the description line from [07](07-copy-voice-and-name.md) can legitimately serve — usually it cannot, since a caption and an alt text do different jobs.
- **Contrast**, inheriting [06](06-visual-treatment.md)'s measured device. Deep Time's finding stands as a warning: over varied imagery the best single text colour reached **1.88:1** in the worst frame, so text never sat on the field and every box took a solved scrim.
- **Keyboard.** Deep Time gave instant jumps that *announce what they skipped*. Decide the equivalent, plus focus order and whether any region is `inert`.
- **Screen reader.** The structure a non-visual visitor receives. Deep Time deliberately gave its scale argument at three fixed points rather than on every card — the analogous ruling here is what the list of arrivals *is* semantically.
- **Touch targets** and the 2.5.8 question, if anything is tappable.
- **200% text**, which broke layout on Deep Time twice and needed explicit rulings.
- **Real-device phone pass** — a ship gate, not a review note. Known scars: iOS first-tap-is-hover (WebKit swallows the first tap's click on any element whose `mouseenter` mutates the DOM), iOS URL-bar collapse squashing a fixed canvas, canvas re-sync via `ResizeObserver` on its own box with a synchronous repaint.

State the target explicitly (**WCAG 2.2 AA** unless argued otherwise) and name any criterion claimed under an exception, with the justification written down.

**Deliverable:** the contract, each item marked **gate** or **guidance**, with the gates expressed as assertions a build script can actually run.
