# 13 — Visual direction, take two

Type: prototype
Status: open
Blocked by: 12
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What does this site look and move like, now that the sober version has been tried and rejected?**

Supersedes [11](11-visual-anchor.md)'s register (not its references or its NOT list). [11](11-visual-anchor.md) produced a defensible direction that turned out to be wrong in practice: Dustin called the built preview *"complete garbage"* and asked for *"a cooler way to tell the history, to keep people interested and make it really pop and come to life."* [12](12-scrollytelling-craft.md) then established, from evidence, **why** it failed and what the fix has to satisfy.

**What carries over from [11](11-visual-anchor.md):**

- The two anchored references — [The Deep Sea](https://neal.fun/deep-sea/) and Deep Time — and the three loved things: a ground that changes under you, unframed objects, one counter as the whole UI.
- The NOT list, in full. Nothing on it has been rehabilitated.
- Cut out everything; nothing has an edge except the thing itself.
- Citation on every item.

**What is dead:**

- **The sober register.** [12](12-scrollytelling-craft.md) finding 3 — embellishment measurably improves recall and is strongly preferred, at no cost to accuracy. Minimalism here was the forgettable choice, not the safe one.
- **[11](11-visual-anchor.md)'s §5 ruling that the Visual Cinnamon canon is inapplicable.** Reversed. The canon governs; the earlier failure was applying it as *absence of colour* rather than finding where colour legitimately lives on a site made of photographs.
- **One uniform treatment end to end.** [12](12-scrollytelling-craft.md) finding 1 — flatness is *the* failure mode.

## What this ticket must produce

1. **The shape.** The scroll's contour, stated as movements that behave visibly differently — density, scale, colour, rhythm. A treatment that looks the same at item 5 and item 300 has already failed. [12](12-scrollytelling-craft.md) proposes a candidate contour (dark spectacle prologue → widening, brightening body → saturated crowded present → quiet stop → index); confirm, replace, or sharpen it.
2. **Where the colour lives.** The photographs stay untouched — that constraint is not negotiable, it is the site's whole claim. So colour has to live in the ground, the light, the connective marks and the type. Decide where, and how saturated. **Always colourful** is the standing brand rule.
3. **What moves, and how much.** Native scroll only — [12](12-scrollytelling-craft.md) finding 4 is a hard constraint, and it is precisely how "cinematic" gets itself into trouble. Parallax depth, arrival, scale change, all tracking scroll 1:1. No pinning, no hijack, no direction change.
4. **The reward.** [12](12-scrollytelling-craft.md) finding 6 — the preview had no discovery in it; everything was simply present. Decide what gets revealed, earned or uncovered, and guarantee at least one screenshot-worthy moment per movement.
5. **The mobile answer.** NN/g says avoid scroll-driven effects on mobile entirely; Dustin says make it pop; the map says mobile is a **ship gate**. These collide. Resolve it explicitly — a reduced-motion mobile build is a legitimate answer, silently shipping a worse phone experience is not.

## How to work it

**Do not iterate mocks blind** — that is the standing rule and it has now cost two rejections. Produce **N genuinely different directions on the same real objects**, put them in front of Dustin, and let him pick. That is the approach his own design canon prescribes: options spanning a range, never one derived law.

Images are no longer the blocker: matting now runs on a real model (`prototypes/anchor-preview/`), so subjects that could not previously be cut out are available.

**Deliverable:** the chosen direction, stated precisely enough for [06](06-visual-treatment.md) to build a pipeline against, plus the shape from item 1 written down as movements [04](04-scroll-mechanic.md) can build the mechanic against.
