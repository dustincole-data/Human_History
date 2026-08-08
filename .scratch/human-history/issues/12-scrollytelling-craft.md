# 12 — How scrollytelling actually works

Type: research
Status: closed
Assignee: dustin
Resolved: 2026-08-08
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What does the evidence say makes a scroll-driven story interesting, informative and fun — and what does that mean for this site specifically?**

Raised by Dustin after the [11](11-visual-anchor.md) anchor preview was rejected: *"this is complete garbage… We need to come up with a cooler way to tell the history, to keep people interested and make it really pop and come to life."* His instruction was explicit — **research it, don't guess again.**

The preview failed for a reason worth naming precisely rather than re-decorating: it was a **museum catalogue**. Twelve muted objects, evenly spaced, one treatment repeated, on a beige gradient, with no motion and no colour. The anchor ([11](11-visual-anchor.md)) had ruled the brand's Visual Cinnamon canon *off* and gone deliberately sober — and sober is what got rejected.

---

## Resolution

Six findings, each with a source, and each with what it changes here.

### 1. Flatness is the failure mode — and it is exactly what shipped

The Pudding's Russell Goldenberg, on what separates their pieces that work from the ones that don't: successful pieces have **"variety in their shape and there was change as the story progressed — it wasn't just a flat line."** They deliberately design a *story shape* per piece — one described as a symmetrical V narrowing to a focal point then reopening, another as a lopsided inverted V.

**This is the diagnosis.** The preview was a flat line: identical treatment, identical rhythm, identical scale, start to finish. Adding colour or motion *uniformly* would produce a prettier flat line and would fail again.

> **Consequence: this site needs a designed shape — movements that behave differently — not one grammar repeated 300 times.**

### 2. Spatial immersion measurably raises interest — but not comprehension

A 2024 study analysed 23 data stories, extracted six design patterns for "spatial immersion", and tested **static vs animated vs immersive** builds. Result: immersive stories were **more interesting and more persuasive** than both static and animated ones. Crucially, immersive did **not** beat the others on **comprehension or credibility**.

The six patterns: cinematic camera shots and transitions · intuitive data representations · realism · naturally moving elements · direct manipulation of the camera/visualisation · dynamic dimension.

> **Consequence: "come to life" is a real, evidenced lever — use motion, depth and camera. But it buys *interest*, not understanding, so the dates and facts must stay plainly legible on their own. Do not let immersion carry the information.**

### 3. Embellishment is not decoration — it is memory

Bateman et al., *Useful Junk?* (CHI 2010), tested embellished charts against plain ones. Findings: comprehension accuracy **no worse**; recall after **2–3 weeks significantly better** in every category; participants **overwhelmingly preferred** the embellished versions; and although ~**40% of viewing time** went to the embellishment, it cost nothing in accuracy or speed.

> **Consequence: the sober minimalism I applied was not the safe choice — it was the forgettable one. "Make it pop" is supported by evidence, not just taste. This also reverses [11](11-visual-anchor.md)'s ruling that the Visual Cinnamon canon is inapplicable: the canon was right, my application of it was wrong.**

### 4. Scrolljacking is the one thing that reliably ruins it

Nielsen Norman Group's usability testing found the **majority of participants experienced mild to severe disorientation**; users fought to regain control by scrolling back and forth, grabbing the scrollbar, refreshing, or leaving. One participant: *"That was a full swipe, and it moved nowhere… I would get severely agitated."* Reading text inside a scrolljacked animation caused severe cognitive strain. **Every problem intensified on mobile.**

Their recommendations: only ever to progressively disclose genuinely valuable information; keep scroll rate near-native; never change scroll direction; **limit text inside scroll-driven sections**; keep an escape hatch; and **avoid it on mobile entirely**.

> **Consequence: all motion here rides NATIVE scroll — parallax, reveals and camera moves that track scroll position 1:1. Nothing pins the viewport, nothing animates on a timer while the user waits, nothing changes scroll direction. This is a hard constraint, and it is the main way "cinematic" gets itself into trouble.**

### 5. The martini glass — and [01](01-the-fun-thesis.md) already picked it

Segel & Heer's *Narrative Visualization* (2010, 2000+ citations) names three hybrid structures. The **martini glass**: a narrow author-driven stem (a single guided path) opening into a wide reader-driven bowl (free exploration). Also the drill-down story and the interactive slideshow.

[01](01-the-fun-thesis.md) independently landed on exactly this — an author-driven scroll that ends in a browsable index — without naming it.

> **Consequence: the structure is already right and is a known-good named pattern. Keep it. The stem is the scroll; the bowl is the index. This is the one part of the plan the research validates outright.**

### 6. Fun comes from curiosity, surprise and reward — not from polish

Across the practitioner sources: novelty that defies expectation, **surprise and "wow" moments that reward exploration**, and giving the visitor agency. Neal Agarwal's whole body of work is cited as the counter-example to sterile UX — web toys that prize artistic expression and whimsy.

> **Consequence: [01](01-the-fun-thesis.md)'s simultaneity surprise is the right engine. What the preview lacked was **reward** — nothing was ever revealed, uncovered, or earned. Every item was simply *there*, all at once, forever.**

---

## What this means for the site — the shape to build against

Not a proposal for a look. A set of constraints any look must satisfy, all traceable above.

1. **Design a shape with movements.** The scroll must change character as it goes — density, scale, colour, and rhythm all varying. Candidate shape, matching [01](01-the-fun-thesis.md)'s ruling: a **fast, dark, spectacle-driven prologue** through the sparse deep past → a **widening, brightening, accelerating body** as things start coexisting → a **crowded, saturated, overwhelming present** → the **quiet stop** → the index. That is a real contour, not a flat line.
2. **Motion on native scroll only.** Parallax depth, objects arriving, scale changes tied 1:1 to scroll offset. No pinning, no hijack, no direction change, and a plainer treatment on mobile.
3. **Embellish deliberately.** Colour, glow, ornament and texture around the objects — licensed by finding 3 and by the brand canon, and applied to the *apparatus*, never as a tint on the photographs.
4. **Keep the facts plain.** Date, name and credit stay legible and unanimated (findings 2 and 4).
5. **Build in reward.** Things revealed on approach, callouts that land as discoveries, at least one moment per movement worth a screenshot.
6. **Keep the martini glass.** Guided scroll → browsable index.

## Consequences for other tickets

- **[11](11-visual-anchor.md) is partially superseded.** Its §5 ruling — that the Visual Cinnamon canon does not govern here — is **reversed** by finding 3. The two anchored references and the NOT list stand; the sober register does not. **Re-opened as [13](13-visual-direction-v2.md).**
- **[06](06-visual-treatment.md)** gains the flatness test: a treatment that looks the same at item 5 and item 300 has already failed.
- **[04](04-scroll-mechanic.md)** gains a hard constraint (no scrolljacking, native scroll only) and the movements/shape requirement.
- **[08](08-accessibility-and-mobile.md)** gains NN/g's finding that every scroll problem intensifies on mobile, plus their advice to avoid scroll-driven effects there entirely — which collides with "make it pop" and must be resolved, not fudged.

## Sources

- [The Pudding — how they structure visual essays (Storybench)](https://www.storybench.org/pudding-structures-stories-visual-essays/)
- [Understanding the Impact of Spatial Immersion in Web Data Stories (arXiv 2411.18049)](https://arxiv.org/abs/2411.18049)
- [Bateman et al., *Useful Junk?* (CHI 2010)](https://dl.acm.org/doi/10.1145/1753326.1753716)
- [Nielsen Norman Group — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- [Segel & Heer, *Narrative Visualization: Telling Stories with Data* (2010)](https://sunzhida.github.io/reading_note/9.pdf)
- [Shorthand — scrollytelling examples and techniques](https://shorthand.com/the-craft/scrollytelling-examples/index.html)
