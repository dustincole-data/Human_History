# Human History — Wayfinder Map

Labels: `wayfinder:map`

## Destination

A scroll-driven data toy telling **~12,000 years of everything humans built**, from Göbekli Tepe to now — built entirely from real, cited, public-domain artifacts and photographs — **live on its own subdomain** with a card on dustincoledata.com/projects.

Sibling to [Deep Time](https://deeptime.dustincoledata.com), not a sequel to it.

**Execution is in scope.** Dustin, verbatim: *"I want you to pretty much take over the project and get it built out."* This overrides wayfinder's default plan-don't-do. The locked spec at `.claude/plans/human-history-spec.md` is the **mid-point milestone**, not the destination — the destination is the shipped site.

## Notes

**Domain:** a dustincoledata data-toy. New repo `Projects/Human_History`, own subdomain, project card. Same pattern as Deep Time, Namesake, Cascade.

**Skills every session should consult:** `/impeccable` (visual craft), `/intent:*` (UX), `/prototype` (cheap artifacts to react to), `/grilling` + `/domain-modeling` (default), `/dataviz` if any chart appears.

### Hard constraints

- **Fun is the payoff, not awe.** Dustin, verbatim: *"I dont care about scale shock. i want it to be fun to the users."* Deep Time's currency was awe at emptiness. This site's currency is enjoyment — recognition, surprise, density of real things. **Every decision is judged by whether a stranger enjoys scrolling it.** Any argument that reaches for "but it's profound" has lost.
- **True scale is dead as the global spine — settled by [01](issues/01-the-fun-thesis.md) on evidence, not argument.** A 1px = 1 year demo over the real set was ~11,500 px of near-emptiness followed by every recognizable item crushed into the final inch. **Scroll distance is spaced by density, not by time.** [04](issues/04-scroll-mechanic.md) chooses the exact function, not whether to warp. Honesty about dates is absolute and unaffected — warping distance is a design choice, misstating a date is not.
- **Citation rigor equals Deep Time's.** Every arrival carries source, licence, credit. No fabricated or unsourced date. Contested dates are hedged in notation, not prose.
- **Real artifacts and photographs only. No generated imagery, anywhere.** Dustin's brief: *"no AI-slop visuals."* This is now fully achievable — the entire span sits inside the artifact record. Any ticket that proposes generating a subject has misread the project.
  - **Boundary ruled 2026-08-08.** **IN:** photographs of real objects, **plus engravings, prints, diagrams and illustrations made in the period** — those are themselves real historical artifacts, and they cut out cleanly. **OUT:** modern 3D renders and modern vector illustration, as firmly as AI generation. The claim the site defends is *"every image is a real artifact, or was made at the time."* This matters at sourcing time: a search for a historical object frequently surfaces a **modern render** that cuts out beautifully — it is a constraint breach, not a lucky find. See [02](issues/02-image-supply.md).
- **Global, not America-specific.** The set must not read as a Western canon with tokens attached. This is an editorial requirement on [05](issues/05-arrival-set.md), not a nice-to-have.
- **Mobile is first-class.** Real-device phone test is a ship gate. Prior scars: iOS first-tap-is-hover, iOS URL-bar canvas squash, canvas must re-sync from its own box via ResizeObserver.
- **Decoded memory is the hard ceiling, and it is the #1 technical risk.** Decoded cost is `w × h × 4` regardless of encoding. Deep Time shipped **51 assets = 3.34 MB transfer / 75.56 MB decoded**, against an 80 MB gate. This site's images are the *content*, not decoration, and there will be more of them at larger sizes. Naive reuse blows the budget outright. See [03](issues/03-engine-reuse-or-clean-build.md).
- **Nothing overlaps, anywhere, ever.** Deep Time's no-collision layout contract (reserved zones, non-overlapping slot grid, each arrival one self-contained box, verified by a scroll sweep asserting zero rectangle intersections) is proven and reusable. The sweep is a **ship gate**, not a review note.
- **The anchor references are locked; the sober register is dead.** References ([11](issues/11-visual-anchor.md)): **Neal Agarwal's [The Deep Sea](https://neal.fun/deep-sea/)** (a changing ground, unframed objects, one counter as the whole UI) and **Deep Time** (the same hand). Positioning: *"Twelve thousand years of things people built, and what was standing next to each one."* **Not a chart** — Dustin's word. But [11](issues/11-visual-anchor.md)'s sober, canon-off *register* was built and **rejected outright** — *"complete garbage"* — and [12](issues/12-scrollytelling-craft.md) reversed it on evidence. **[13](issues/13-visual-direction-v2.md) settled the replacement: GRAVITY / SHATTER** — real-time physics over a still ground, objects breaking down into it. Note the one thing The Deep Sea lends that no longer applies: its *changing* ground. Here the ground is the fixed thing and the objects are what change.
- **Flatness is the failure mode — settled by [12](issues/12-scrollytelling-craft.md).** The Pudding's rule: a piece works when it has *"variety in their shape and… change as the story progressed — it wasn't just a flat line."* **A treatment that looks the same at item 5 and item 300 has already failed.** The site needs a designed shape with movements, not one grammar repeated 300 times.
- **Embellishment is licensed by evidence, not taste — [12](issues/12-scrollytelling-craft.md).** Bateman's *Useful Junk?*: embellished charts were recalled significantly better after 2–3 weeks, at no cost to accuracy, and were strongly preferred. **The Visual Cinnamon canon governs after all**; colour lives in the ground, light, marks and type — never as a tint on the photographs.
- **No scrolljacking, ever — [12](issues/12-scrollytelling-craft.md).** NN/g found most users disoriented, fighting for control, and every problem worse on mobile. All motion rides **native scroll 1:1**: no pinning, no timed animation the visitor waits on, no direction change. This is the main way "cinematic" gets itself into trouble.
- **Cut out everything, and it filters the set — settled by [11](issues/11-visual-anchor.md).** Nothing on the page has an edge except the thing itself. *If a thing cannot be cut out of its photograph and still be recognized, it does not go in.* A page half-contained and half-floating reads as search results. Hard admission test on [05](issues/05-arrival-set.md); a per-image pipeline cost at 200–400 items.
- **The ground never moves and never changes — settled by [13](issues/13-visual-direction-v2.md), which reverses [11](issues/11-visual-anchor.md) here.** One fixed soil, baked once, with real grain and texture. **The dated colour system is the LIGHT**, not the earth — firelight → oil lamp → candle → argand → gaslight → carbon filament → tungsten → fluorescent → phosphor → LED. Three of [11](issues/11-visual-anchor.md)'s §6 rulings are struck with this ticket's close, as round 2 flagged: *flat colour fields, no texture* · *one grammar everywhere* · *the ground is a colour*. Also struck: the earth → stone → parchment → iron → paper → screen ramp, and the accumulating/burial ground from rounds 3–4 (rejected as a concept, not an execution). Photographs themselves stay **untouched** — no tint, no duotone, no grade; **cutting one into fragments is a cut, not a grade, and is legal** on the same basis as the cut-outs. Exact values are [06](issues/06-visual-treatment.md)'s against real images.
- **When a direction is picked, the losers go in the same commit — standing rule, set 2026-08-09.**
  13 picked GRAVITY / SHATTER and rounds 6 and 7 kept the other two burial renderings, the other
  three motion demos, a switcher bar, a launcher and a compare page alive next to it, so every
  change since was paid for five times. [06](issues/06-visual-treatment.md) round 8 deleted all
  of it. **One page, one path, no query flags.**
- **Copy is never corny, never sales-pitchy.** Flat declarative. No parallel triads, no feel-something clauses.

### New from Dustin, 2026-08-08 — after seeing the 230-item set run

Five asks, filed where they belong rather than as a loose list. **One of them changes something
[13](issues/13-visual-direction-v2.md) shipped.**

- **The fall is scroll-driven, not gravity-driven** -> [04](issues/04-scroll-mechanic.md). Verbatim:
  *"if somebody lets up on the arrow when something is in mid-fall, it shouldn't continue falling.
  Scrolling down is what should make the item hit the ground, not actual gravity."* This deletes
  13's 880 ms floor and its queue, and may delete most of matter.js with them. Nothing else in 13
  is reopened.
- ~~**The name shatters with the object**~~ **-> done, [06](issues/06-visual-treatment.md) round 8.**
  Its words are thrown up and out with the shards at impact and are gone within 7% of the
  object's life.
- **A background that changes with the era** -> [06](issues/06-visual-treatment.md). **Still open
  after round 8 — the one thing on this list not built.** Sits right next to a closed ruling: 13
  froze the ground and put the dated colour system in the *light*. A changing backdrop is legal
  if it IS the light; a changing earth is a reopen of 13, and only Dustin does that.
- **The set must reach 2026** -> [05](issues/05-arrival-set.md), reopened *scoped to that tail
  only*. Newest entry today is 2022.
- **The name of the project** -> [07](issues/07-copy-voice-and-name.md). 05's R1 made this a real
  problem: the piece is objects only, so *Human History* oversells it. His candidates, verbatim:
  *Time · Humans in Time · Human Objects in Time · Human Objects and Decay* - and *"I don't know
  what would be best."*
- **The ending, the Deep Time kick-over, and the signature logo** -> new ticket
  [14](issues/14-the-ending-and-the-frame.md). The ending **reopens 01's no-finale line**; the
  cross-link is genuinely good (Deep Time's last sliver *is* this whole site) but its Deep-Time
  half is **out of scope by the rule below** and is Dustin's call, not a ticket's.

### The premise, and what may still challenge it

The span (**~12,000 years, agriculture to now, global**) was settled with Dustin this session, against three alternatives:

- *300,000 years of Homo sapiens* — rejected: ~95% predates artifacts, so it needs generated art for a stretch that is by definition empty. Pays Deep Time's full art bill to rebuild Deep Time's Boring Billion.
- *US 250 years* — rejected: US-only, and Dustin leaned global.
- *Kentucky* — rejected: audience too small.

[01 — The fun thesis](issues/01-the-fun-thesis.md) is **permitted to reopen the span** if the delight mechanism it lands on demands a different one. Nothing downstream may.

### Inherited from Deep Time — what actually transfers

`Projects/Deep_Time/src/data/record.json` → `flood[]`, **58 entries**, Göbekli Tepe (11,500 ya) → The COVID-19 Vaccine. Each carries `id`, `yearsAgo`, `name`, `source`, `licence` (PD or CC0), `credit`.

**What transfers:** the sourcing and citation work. Every entry is already researched, licence-cleared and credited. That is the expensive half of a data toy, done.

**What does NOT transfer — verified, not assumed:**

1. **The pixels.** `Projects/Deep_Time/public/art/record/*.webp` — all 58 exist, but **max dimension 160 px, 372 KB for the entire set.** They are specks in Deep Time's finale heap. As hero content here they are unusable; every image must be **re-sourced at full resolution** from its cited origin.
2. **The dates.** `yearsAgo` uses **two different epochs.** Entries 0–49 are computed from **2000** (Trinity Test `55` → 1945 ✓, Apollo 11 `31` → 1969 ✓, ENIAC `53` → 1946 ✓). Entries 50–57, the batch appended later, are computed from **2026** (March on Washington `63` → 1963 ✓, COVID vaccine `6` → 2020 ✓). The array is consequently **out of chronological order** at the tail. Normalize to absolute years with a stated epoch before any use. **Fix in the copy — do not edit Deep Time's file.**

## Decisions so far

<!-- one line per closed ticket: gist + link -->

- [01 — The fun thesis](issues/01-the-fun-thesis.md) — **simultaneity surprise** is the mechanism, fed by recognition density; delivered as **ambient contemporaries** on every item plus 10–15 planted callouts. True scale killed as the global spine; axis spaced by density. Span stays 12k with the sparse head as a fast prologue. Quiet stop → browsable index; body is scroll-only. **Cost: a 4–6× content bill — 200–400 items, not 58.** Judgment test: *more things a stranger recognizes on the same screen as each other, without shrinking any item below enjoyable.*
- [11 — Visual anchor & positioning](issues/11-visual-anchor.md) — **"not a chart. scrolly telling like deep time and neil deep sea."** Two anchored references (not the 3–5 asked for), a positioning line, an eleven-entry NOT list, and the sibling-not-sequel ruling made concrete: shared = Archivo/HUD/citation/no-collision; different = **changing ground, real photographs, crowded on purpose, no finale**. Brand's VC canon **ruled off** (scoped exception, not a repeal). Two consequences that bind other tickets: **cut out everything** (a hard filter on [05](issues/05-arrival-set.md)) and **the ground is the material of the age** — the latter now **struck by [13](issues/13-visual-direction-v2.md)**, along with §6's *flat colour fields, no texture* · *one grammar everywhere* · *the ground is a colour*; the contrast gate is consequently one-ended, not two. Deep Time's `1 px = N years` honesty line **cannot** be printed here — the era name and the counter's uneven rate replace it.

- [12 — How scrollytelling actually works](issues/12-scrollytelling-craft.md) — researched at Dustin's instruction after the [11](issues/11-visual-anchor.md) preview was rejected. Six evidenced findings: **flatness is the failure mode** (Pudding); **spatial immersion raises interest but not comprehension** (arXiv 2411.18049); **embellishment measurably improves recall** and is preferred (Bateman) — which **reverses [11](issues/11-visual-anchor.md)'s canon-off ruling**; **scrolljacking reliably ruins it** (NN/g), so native scroll only; the **martini glass** structure [01](issues/01-the-fun-thesis.md) already picked is a known-good named pattern; and **fun needs reward**, which the preview had none of. Direction re-opened as [13](issues/13-visual-direction-v2.md).
- [13 — Visual direction, take two](issues/13-visual-direction-v2.md) — **GRAVITY / SHATTER**, picked outright after five rounds. A ground that never moves or changes colour; objects fall in one at a time, break into shards on impact, the shards break twice more, and the dust sinks under the earth. Time reads as fragmentation *in the object*, not accumulation in the earth (round 3–4's burial is dead — concept, not execution). Three rulings bind everything downstream: **the credit decays with the object** (name/date die at impact, `source · licence · credit` lives exactly as long as one fragment); **shattering a photograph is a cut, not a grade**, so it is legal on the same basis as the cut-outs; and **the ground's colour is frozen — the dated colour system is the light**, not the earth. Also settled: 1,000px/arrival, 880ms drop floor, 4,200px decay life, fixed camera. Measured 60fps at 1440×900 and 390×844, peak 2–3 physics bodies, +0.44MB fragments.
- [05 — The arrival set](issues/05-arrival-set.md) — **230 items, live and measured.** Six rulings written before selection (R1 *an arrival is always a made object with a body* — no events, no sites, no human remains, no identifiable person as the falling object; R2 13's fragment test **made measurable** as `frag`; R3 recognisability as a *number*; R4/R5 region and era targets fixed in advance). Pipeline: `catalog.py` (288 named artifacts) → `source5.py` → `build_data.py` → `data.js`, with `measure.py --live` regenerating every table. **The targets did their job twice**: the first catalog draft measured 50% Western against a 34% cap, so 35 Western rows were cut and 80 non-Western authored; the finished set overshot by 0.6 pp and four more Western entries went. Final Western 33.8%, and **every era band clears its non-Western floor**. 131 dropped, all named with a reason — a Scythian *reproduction*, a *counterfeit* N95, a snare drum sold as a Đông Sơn drum, Stonehenge as a 40 px strip. Dates checked against the holding institution: 22 disagreed, 16 redated (the institution wins), 5 dropped when the identity went with the date. **Three findings for other tickets: [01](issues/01-the-fun-thesis.md)'s per-screen recognition floor is unreachable at the strict reading (70/228 fail; at "A or B" only 5 fail) and only Dustin closes that; 230 sprites decode to 111.4 MB against the 80 MB gate, so [03](issues/03-engine-reuse-or-clean-build.md)/[06](issues/06-visual-treatment.md) need a texture window, not a smaller set; and [07](issues/07-copy-voice-and-name.md) owns the one-line descriptions, deliberately unwritten because the voice does not exist yet.**
- [04 — The scroll mechanic](issues/04-scroll-mechanic.md) — **SETTLED, in two rounds.** *Round 6:* the fall is a pure function of scroll — height is `arc(t)` of the way down and contact happens at t=1 exactly because the landing offset is solved from the real silhouette before the fall starts. Three rulings: *matter.js deleted entirely* (the 880ms floor, the queue and "drag to throw" went with it; one-at-a-time is true by construction); *the fall reverses, the break does not* (a position runs both ways, an event does not); *the scroll is the only clock*. *Round 7:* **one quantity — how many things were already standing within 80 years — settles all three remaining items at once.** Four more rulings. (a) *The ground IS the co-occurrence*: decay life stopped being a distance and became the contemporary window, so what lies on the ground at any scroll position is exactly what was standing within 80 years of it — gated at zero violations, with both clamps named. (b) *The seam is dissolved, not crossed*: the head runs 3 fields and near-bare ground, the body 6 fields and 5 ties, continuously and with nothing announced. (c) *The tie* — 01's engine, drawn: a hairline on the soil between an arrival and the thing it landed next to, with the miss on it (`SAME YEAR` · `40 YEARS APART`); fires on **203 of 230**, 196 cross-region, median miss 2 years, dies with the first of its two ends, never outranks a citation, newest-only on a phone. (d) *Length*: **235,100px → 144,632px**, 1.13× Deep Time carrying 4× the items. **59 of 60 gates green across all three modes, and the harness was wrong before the page was** — round 6's sweep probed item 60 before sweeping, and contact latches, so the deep head had already turned to dust and was never tested; one false green fell out when that was fixed. Round 6's "one surviving wall clock" is also gone. **Handed off with a measured lever:** the 301 MB decode is also the frame spike, and a 396px sprite downscale makes `prep` 12× cheaper (302ms → 25ms) at 163 MB — that is [03](issues/03-engine-reuse-or-clean-build.md)/[06](issues/06-visual-treatment.md)'s texture window, now a number instead of a guess.
- [06 — Visual treatment](issues/06-visual-treatment.md) — **the citation half closed in round 8; only the dated backdrop is left open.** **THE WORD IS THE UNIT**: a name, a date and a citation are built as individually positioned words, so text can do what 13 asked the objects to do — come apart. A credit is one line until its object's first split, three groups after it, single words after the second, and it is exactly as wide as its own wreckage at every moment because its spread is read off the live fragment positions. Type scales 1.00 -> 0.82 and ink runs 238 -> 188 with the object's age, which is what stops six of them reading as a list. **13's lifetime ruling is untouched** — it dies with the last speck. The name shatters at impact too. **The miss caption is deleted and the line is cut once per year of miss** — same year is one unbroken hairline, forty years is forty breaks, and ties rank by recency into the soil so five of them do not merge into one stroke. **Legibility is now structural, not a battle**: the credit only ever lies on the baked earth, the one surface whose value never changes, so the worst case is single-ended — measured **5.16:1** off composited pixels. **All four motion demos, both other burial renderings, the switcher, the launcher, the compare page and the flat directions pages are deleted**, which is where the map's new standing rule comes from. 29 gates green, ten perturbations red-then-reverted, two of the gates rewritten after they turned out to be tautologies.
- **Matting solved, and it relaxes a filter** — `prototypes/anchor-preview/matte.py` (rembg + isnet, local, free) cut **9 of the 10** subjects that defeated the hand-rolled flood fill, including **Aldrin out of the visor photo** and **Sputnik's antennas**. [05](issues/05-arrival-set.md)'s cut-out admission test is therefore far weaker than [11](issues/11-visual-anchor.md) assumed: famous *moments* can become objects.

### New from Dustin, 2026-08-09 — after seeing round 7 run

- **The sources shatter with the piece.** Verbatim: *"I would like the sources to shatter with
  the peace and not just stack up on the ground."* -> [06](issues/06-visual-treatment.md) round
  8, **done**.
- **The miss-in-years caption is rejected.** `SAME YEAR` / `50 YEARS APART` — his word: *sucks*.
  The tie and what it means survive; the printed phrase does not. ->
  [06](issues/06-visual-treatment.md) round 8, **done**: the line is cut once per year of miss.

## Not yet specified

- **The build phase.** Everything after [09 — Spec assembly](issues/09-spec-assembly.md): scaffold, data pipeline, image acquisition and processing, layout, the collision/contrast/memory gates, deploy, subdomain, project card. Graduates into tickets once the spec exists — charting it now would be guessing at a shape [04](issues/04-scroll-mechanic.md) and [06](issues/06-visual-treatment.md) haven't decided.
- **The share artifact and social card.** Deep Time rendered its finale fan as a build-time still. [01](issues/01-the-fun-thesis.md) settled that there is no finale to render and that the sendable unit is a planted callout line, not an image — so the card is probably a treated arrival or an index still. Not sharp enough to ticket until [06](issues/06-visual-treatment.md) sets the visual system.
- ~~**The prologue↔body seam.**~~ **Closed by [04](issues/04-scroll-mechanic.md) round 7** — structural, and produced by the same rule that delivers the contemporaries. No transition to design, no ticket needed.

## Out of scope

- **Deep Time itself.** Its `record.json` epoch defect is inherited as a *copy* to normalize. Do not edit, rebake or re-source anything under `Projects/Deep_Time`.
- **The 300,000-year and 2.8-million-year spans.** Ruled out this session; they would be a different effort with a different art economy.
- **Any single-nation or single-state history** (US, Kentucky). Ruled out this session on audience and scope.
- **Forward/future timelines.** Past to present only, as with Deep Time.
