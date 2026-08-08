# 13 — Visual direction, take two

Type: prototype
Status: in progress
Assignee: dustin
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

---

## Built 2026-08-08 — three directions, side by side, nothing picked

**This ticket stays open.** It is a prototype ticket: it resolves when Dustin picks, not when the
prototype exists. Standing instruction, verbatim: *"do NOT pick one for me, and do not iterate mocks blind."*

**Where:** `prototypes/directions/` — `README.md` has the full comparison table and the run command.
Side by side at `compare.html`, one at a time at `index.html?v=A|B|C`.

**Material.** 36 real, cited, licence-clean cut-outs (`data.js`, `sourced.json`), sourced by
**naming the specific artifact**, not a search term — the fix [02](02-image-supply.md) prescribed
after the salt-and-pepper-shaker batch. Every one matted with rembg/isnet and **verified by eye on a
contact sheet** (`sheet.png`); six were thrown out as wrong or unrecognisable subjects (Göbekli Tepe,
Sputnik, Antikythera, moai, a toy sewing-machine box, a Roman glass tube). Global by construction:
'Ain Ghazal, Jōmon, Olmec, Nebra, Tutankhamun, Terracotta Army, Gandhara, Moche, Ming, Benin, Gusoku.
Metadata for the eight best existing `img-ml/` cut-outs was re-fetched because `matte.py`'s `ml.json`
never survived, and citation rigor is not optional.

**What is held constant** so the comparison is only about the look: cut-outs unframed, photographs
untouched, native scroll 1:1, one HUD, citation on every item, density spacing, the same five
movements (`deep · spread · trade · machine · now`, 1 → 5 abreast), quiet stop, no finale.

**The three, and what each answers item 2 (*where the colour lives*) with:**

| | A · STRATA | B · NIGHTFALL | C · PRESS |
|---|---|---|---|
| Colour lives in | the **ground** | the **light** | the **ink and type** |
| The dated system | the colour people could **make** — ochre → Egyptian blue → Tyrian purple → vermilion → verdigris → ultramarine → lead-tin yellow → Prussian blue → mauveine → cadmium → Day-Glo | the light people **had** — firelight → oil lamp → candle → argand → gaslight → carbon filament → tungsten → fluorescent → phosphor → LED | how the moment could **print** — incised clay → woodblock → letterpress + spot → four-stone chromolitho out of register → screen RGB |
| Changes | 11 hard seams | 10 light changes, dark lifting continuously | 5 total grammar changes |
| Motion (item 3) | objects rise out of the layer below | objects come out of the dark on approach | year / sheet / objects separate into layers |
| Reward (item 4) | the seam crossing | the reveal | the grammar flip + objects breaking the sheet |
| Contemporaries | share a layer | share a pool of light | share a sheet |
| Ends on | acid Day-Glo | full blaze | white RGB |

Each system is **dated and real**, which is what stops "make it pop" from becoming decoration:
mauveine genuinely did not exist before 1856, and gaslight genuinely did change what a street looked
like. Embellishment licensed by evidence ([12](12-scrollytelling-craft.md) finding 3), not by taste.

**Item 5 (mobile) is answered but not settled.** All three run the same reduced-motion path —
everything lit, nothing translating — and all three were swept at 390×844. Whether *phones get the
reduced path by default*, per NN/g, is [08](08-accessibility-and-mobile.md)'s ruling to make against
the winner, not a thing to decide across three candidates.

**Verified, not asserted.** Headless sweep, 1440×900 and 390×844, every 0.6 viewport, all three:
zero rectangle intersections, zero horizontal overflow, no console errors.

**Named limits** (full list in the README): 36 items is not 200–400, so the final density does not
exist yet; the set is not [05](05-arrival-set.md)'s set; the pigment/lamp/press copy is written from
general knowledge and would need arrival-grade citation before shipping; and this is **not**
[06](06-visual-treatment.md)'s measured contrast gate — a pale artifact on Day-Glo and a dark artifact
on black are both still unsolved.

### What resolves this ticket

Dustin picks — or takes the ground from one and the motion from another, which is the normal outcome
and a legitimate answer. Record the pick in the README's Verdict and here, then close.

---

## Round 2, 2026-08-08 — all three flat directions rejected; four real-time ones built

**Verdict on round 1, verbatim:** *"if I had to pick one, I would pick B, but I honestly hate all of
them… they just look like really old sites… you are not using any design skills or 3D WebGL or
anything to make this beautiful."*

**He is right, and the miss is nameable.** I read [12](12-scrollytelling-craft.md)'s *no scrolljacking*
as *no depth*, and built flat CSS sections. **Nothing in the map bans WebGL.** The ban is on
*generated imagery* — on inventing a subject — not on rendering technique. A real-time lit scene made
of real photographs breaches nothing, and [12](12-scrollytelling-craft.md)'s own finding 2 (cinematic
camera, depth, naturally moving elements, direct manipulation) explicitly licensed it. Round 1 left
the strongest evidenced lever on the table.

**Three of [11](11-visual-anchor.md)'s §6 rulings are what produced the museum look and should be
struck when this ticket closes:** *flat colour fields, no texture* · *one grammar everywhere* · *the
ground is a colour*. A live shader ground is not a skeuomorphic paper grain, which is what that rule
was actually aimed at.

**Asked which of four lanes to build; answer:** *"I don't know what those mean. I would need to see
them."* So all four were built rather than described. `prototypes/webgl/`, launcher at
`launcher.html`, one at a time at `index.html?v=1..4`.

| | 1 · DEPTH | 2 · GRAVITY | 3 · MATERIAL | 4 · ATLAS |
|---|---|---|---|---|
| What it is | direction B as an actual volume; the scroll flies the camera through it | everything has mass and piles up; you can throw it | the ground is a running shader, not a colour | the span as a place you steer through |
| Tech | three.js, bloom, exponential haze, additive shafts, dust | matter.js physics, custom canvas draw, mouse constraint | GLSL domain-warped fbm, cursor drag, scroll-velocity turbulence | three.js, orbit + dolly, era glow clouds |
| Scroll | native 1:1 | native 1:1 (releases objects) | native 1:1 | **none — breaks the rule on purpose** |
| Density contour | 1 object alone in the dark → a crowd you pass through | the heap grows all the way down | rows widen, ground churns harder | thin thread → cloud, visible from outside |

**Constraints held in all four.** Photographs are `MeshBasicMaterial` / raw `drawImage` — never lit,
never tinted; the era's colour lives in haze, shafts, halo, ground and glow. Facts stay crisp DOM over
the canvas, never drawn into it ([12](12-scrollytelling-craft.md) finding 4). Screen-space label
collision test in 1 and 4, so the no-collision contract survives in 3D. Textures downscaled to 440 px
→ **18.6 MB decoded**, against Deep Time's 75.6 MB and the 80 MB gate.

**Open risks, named:** 4 breaks native scroll and NN/g says that hurts most on mobile; 1 and 4 both
need a real texture/LOD strategy at 200–400 objects rather than 36; 2's pile has no answer yet for
what the *index* is; none of the four has been tested on a real phone.

**Still open.** Same rule: he picks, or mixes.

---

## Round 3, 2026-08-08 — GRAVITY picked, and it gained a mechanic

**Verdict, verbatim:** *"I think I like the idea of gravity the most, but it's all piling up too
quickly… four of them fell at once, but only one was labeled. They fell so fast that I couldn't even
read the one that was labeled. Also, they're going to need to be buried over time as the new items
come in… maybe the Earth overlays it, and time kind of buries all the objects. We're going to need a
lot more images, but I'm starting to kind of like the concept."*

**The burial is his idea and it is a better one than the heap.** It converts a pile into a
**sediment**, and in doing so it quietly solves three separate problems the flat round could not:

- it gives the piece a **designed shape with movements** ([12](12-scrollytelling-craft.md), finding 1)
  without a single grammar change — the *ground level itself* is the movement;
- it gives **reward** (finding 6): things are covered, and you can still half-see them down there;
- it reconciles GRAVITY with what STRATA was reaching for. The strata are dated earth — earth, silt,
  stone, clay, soot, ash, concrete — laid down at the moment each object lands. **Directions 2 and A
  are the same idea; the burial is the join.**

**Built this round:**

| Complaint | Fix |
|---|---|
| piles up too quickly | 1,000 px of scroll per object, and a hard 880 ms floor between drops — a fast scroll **queues**, it never dumps |
| four at once | one at a time, always |
| too fast to read | gravity 0.52 with air friction; a fall now takes seconds, from a spawn point 0.72 viewports up |
| only one labelled | **every** object carries its own label from the moment it appears, and the label fades only as the earth covers it |
| needs many more images | 36 → **72** |

Plus: the camera tracks the top of the pile, so you are always standing on the present; museum credit
lines are truncated to the attribution (a Met credit ran six lines on a label).

**Sourcing pass 4** (`source4.py`, chunked so rembg cannot exhaust memory): 48 more named artifacts,
Met CC0 first. **Eight thrown out on the contact sheet, and one of those matters** — a "Space Shuttle"
hit was a *Smithsonian 3D model render*, which is a **constraint breach, not merely a wrong result**.
That is the trap [02](02-image-supply.md) named, caught by eye, and it is the argument for never
letting an automated pass write straight into the set. Seven more were renamed to what they actually
are (a "Nataraja" was an Ardhanarishvara; a "PlayStation" was a Vita).

`data.js` is now **generated** by `build_data.py` from `sourced.json` — hand-maintaining it stopped
being safe past three dozen, and the drops and renames now live in one visible place.

Decoded texture cost at 72 objects: **34.8 MB** against the 80 MB gate.

---

## Round 4, 2026-08-08 — the burial rendering rebuilt three ways (Fable on the creative pass)

**Verdict on round 3's burial, verbatim:** *"It looks nothing like the earth is swallowing it. It
looks like cheap absolute dog shit... that looks fake as hell."* GRAVITY itself stands; only the
picture of the burial was rejected. Fable was brought in for the creative pass on this specifically.

**The sin was structural, not cosmetic.** The earth was one `createLinearGradient` filled as one
full-width `fillRect`, painted *over* the objects at 12%→97% alpha, plus a 1px white line for the
ground. So: a dead-straight horizon across the viewport, buried objects fully legible as luminous
ghosts (it read as layer opacity because it *was* layer opacity), zero grain, and nothing ever
pressed into anything.

**The rule that replaces it, and it is absolute:** *the earth is opaque, always, everywhere it
exists. Visibility below the surface is earned by geometry — a hole, a protrusion, a cut face —
never by transparency.* Every translucent pass over object pixels is gone.

**References named before anything was built** (Fable, on what the eye actually reads): San Clemente
and the fact that Rome's street level rose ~9m — a site like this *is* a tell; Terracotta Pit 1, where
a warrior is 30% crisp and 70% simply absent behind a torn edge; Pompeii and Mount St Helens for
ash landing on every up-facing surface and no vertical one; Kolmanskop for sand entering at the
angle of repose; Sutton Hoo for the ground taking an impression; and soil-profile sections for
layers that are wavy, compacted, mottled, and **deformed around whatever is buried under them**.

**Shared material** (`burial.js`), used by all three: strata are four-value ramps (matrix · dust ·
dark fleck · light fleck) with procedurally drawn grain, inclusions and horizontal micro-bedding —
never a hex; the surface is a heightfield (landform + undulation + grit + a mound per burial that
decays with scroll); depth darkening follows the *local* surface as stacked contour bands, not a
global mean; and every object gets a **silhouette profile sampled at its resting angle**, which is
what lets ash bank against a real flank, grains rest on a real up-facing edge, and the ground grip a
real rim. The landing is a four-beat sequence — crater + berm, dust squirting *sideways* (soil does
not splash up), a permanent dent because soil is inelastic, and the first grains of the object's own
burial already on it.

**The three, at `index.html?v=2&b=a|b|c`** (switcher in the prototype bar):

| | a · ASHFALL | b · SECTION | c · SWALLOW |
|---|---|---|---|
| Burial is | weather | the cut face | the ground taking it |
| Mechanism | sediment falls as real particles, lands on up-facing surfaces, banks against flanks at 33° repose | below the line the screen is a trench wall; each buried object is a ragged excavation window | matrix rides the burial front, climbs the sides, closes over from the flanks in |
| Half-see | most things are half-buried most of the time; scroll back and it uncovers | a crisp fragment of the real photograph, held in opaque earth | protrusion — a blade, a telescope, a rim still out |
| Occlusion by | the heightfield's opaque fill | `destination-out` mask clipped to the sprite's own alpha, rimmed with a cut shadow | the opaque fill plus a meniscus that grips the edge |

**Verified, not asserted.** 1440×900, all three swept to 46% depth: **zero console errors**, no
horizontal overflow, **60fps median (16.7ms), 33ms p95**. Photographs are still `drawImage` raw —
never tinted, never graded; the only things ever drawn on them are grains, in front, which is
occlusion. Native scroll 1:1 untouched. Every object keeps source · licence · credit.

**Named limits.** Labels now go out when the earth genuinely takes an object, which means **credit
for a fully-buried object has no home yet** — Fable's proposal is a core-sample ledger down the
right edge (era bands at true thickness, a tick per object at true depth); that overlaps
[10](10-the-index-surface.md) and was deliberately not built here. The cut-outs' own matte fringe
still shows as a faint pale outline on a few sprites (eroded 2px inside the window in `b`, untreated
in `a`/`c`) — a source-asset issue, not a rendering one. Strata drape is analytic rather than a
replay of real accumulation history. Still 72 objects, still 1440×900 only, still no real phone.

### Still open on GRAVITY

- **The set.** 72 is not 200–400. [05](05-arrival-set.md) still owns the real one.
- **What the index is.** The martini glass needs a bowl; a buried pile has no obvious one. Possibly
  digging back down — which the burial makes literal, and which nothing else has offered.
- **Mobile.** Untested on a real device. A physics sim plus a tall page is the riskiest of the four.
- **Whether the strata should be the pigment ramp** from direction A rather than plain earth tones.
