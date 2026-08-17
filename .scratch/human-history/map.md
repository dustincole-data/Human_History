# Human History — Wayfinder Map

Labels: `wayfinder:map`

## Destination

**TIME TAKES ALL** — renamed by Dustin 2026-08-12, superseding [07](issues/07-copy-voice-and-name.md)'s EVERYTHING BREAKS — a scroll-driven data toy telling **~12,000 years of everything humans built**, from Göbekli Tepe to now — built entirely from real, cited, public-domain artifacts and photographs. **SHIPPED 2026-08-12** ([15](issues/15-deploy-and-the-card.md)): live at `timetakesall.dustincoledata.com` (CNAME pending), card live on dustincoledata.com/projects.

Sibling to [Deep Time](https://deeptime.dustincoledata.com), not a sequel to it.

**COMPLETE 2026-08-16. 14 of 15 tickets closed; only [08](issues/08-accessibility-and-mobile.md)
is open and its remaining item is not a build task.** Production `sweep10` **finishes** on the real
domain at **43/44** — the sole red is `frame_budget`, now moved eleven times, always on this laptop
and never attributable to a change. `sweep11i` 26/26, `review02.verify.mjs` 26/26, 230 items,
`og.png` and the project card live.

Four ticket `Status:` lines were **reconciled** on this date and had been wrong for days — 04 said
*not built* five days after round 9 built it, 15 said *not built* four days after it shipped, 14
said open on work 07 had already closed, and 09 was still claiming a mid-point milestone for a
finished site. **This is the same defect [02](issues/02-image-supply.md) round 9 found in its own
"still open" line**, which had cost Dustin the same question six times. *A ticket's status is a
claim about the files and rots exactly like any other uncheck­ed claim — reconcile it against the
repo each round, never against the previous round's text.*

**What is genuinely left, and neither is a build task:**
- **The real-device phone pass** ([08](issues/08-accessibility-and-mobile.md)) — the map's own ship
  gate, Dustin's, and no emulator substitutes for it (iOS first-tap-is-hover).
- **The inbound link from Deep Time** — out of scope by this map's own ruling, Dustin's call on a
  separate shipped site. The outbound half works alone.
- Minor and unblocking nothing: 08's 200% text and screen-reader structure of the canvas.

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
- ~~**Decoded memory is the hard ceiling, and it is the #1 technical risk.**~~ **Settled by
  [03](issues/03-engine-reuse-or-clean-build.md) round 10.** Decoded cost is still `w × h × 4`
  regardless of encoding, and that is still the arithmetic — but the ceiling is no longer a count
  of the set. Sprites are baked at the height they are drawn (`132 × dpr 2 = 264`) and **released
  the instant they have been shattered**, so at most ten are resident: **3.1 MB measured peak
  against the 80 MB gate**, and it does not move when the set grows to 400. The two rules that hold
  it up bind anything built later: **no pixels, no fall** and **no overtaking**.
  **Amended by [04](issues/04-scroll-mechanic.md) round 8 and BUILT in round 9**, not reopened: the
  rewind makes a sprite live to `LAND + LIFE + BACK` instead of dying at impact. Round 8 priced that
  at 7.7 MB; the built page measures **4.9 MB of photographs plus 4.43 MB of fragment canvases —
  9.3 MB, 8.6× under the gate**, and the extra over the estimate is the half round 8 did not count:
  the rewind keeps EVERY GENERATION of a wreck, because a parent is what its children are cut from.
  Both are now gated (`decoded_under_the_gate`, `wreck_window_does_not_leak`) and both are windows,
  which is the thing that must not change: unbounded residency is 65.8 MB at 230 and **114.4 MB at
  400, over the gate.** *No pixels, no fall* and *no overtaking* survive untouched — and round 9
  added a third: **an object's wreck exists exactly while the object is on the ground**, which is
  what stops a thing back in the air being drawn as a heap.
- **Nothing overlaps, anywhere, ever** — and as of [10](issues/10-the-index-surface.md) that is
  held on **both** surfaces: zero rectangle intersections over every cell and every row readout on
  the index, at 1440×900 and 390×844, as well as over the piece's words. Deep Time's no-collision
  layout contract (reserved zones, non-overlapping slot grid, each arrival one self-contained box, verified by a scroll sweep asserting zero rectangle intersections) is proven and reusable. The sweep is a **ship gate**, not a review note.
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
- ~~**A background that changes with the era**~~ **-> done, [06](issues/06-visual-treatment.md)
  round 9.** Ruled **the LIGHT**, not a new dated ground: 13 stays closed and the earth is gated
  byte-identical across every era. What is dated is *reach* — how far the light of the age got —
  as a smooth function of the year rather than a step per lamp, so no era boundary is asserted.
- ~~**The set must reach 2026**~~ **-> done, [05](issues/05-arrival-set.md) round 2.** It does: the
  last object is a **2026 Olympic torch**, and [14](issues/14-the-ending-and-the-frame.md)'s ending
  inherits it without being asked to. Seven admitted from twenty-three candidates, the set is
  **236**, and the 78% loss rate in the tail is itself the finding.
- ~~**The name of the project**~~ **-> done, [07](issues/07-copy-voice-and-name.md) round 1.** It is
  **EVERYTHING BREAKS**, at `everythingbreaks.dustincoledata.com` (free; all ten shipped subdomains
  checked). Seven names in three families were put in front of Dustin and he picked. The repo keeps
  its `Human_History` folder name and this map keeps its title; renaming either was never implied.
- ~~**The ending, the Deep Time kick-over, and the signature logo**~~ **-> done,
  [14](issues/14-the-ending-and-the-frame.md) round 1.** The ending is *the last object never
  breaks*; the signature is in both places; the outbound link is in the colophon. The Deep-Time half
  of the cross-link remains **out of scope** and is Dustin's call, not a ticket's.

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
- [04 — The scroll mechanic](issues/04-scroll-mechanic.md) **round 8 — REOPENED and re-ruled by
  Dustin: the break reverses too.** The round asked which half of *"the items should reverse"* he
  meant before building anything, and **found that neither half is what the page does**: on a
  scroll-up the ground freezes and rides home, ending at **7,000 BCE with a 1934 car on the soil**,
  green across 41 gates because `ground_is_the_moment` can only fail a field that is too *old*.
  **The memory objection the ruling was expected to die on was withdrawn on measurement** — the
  rewind is **7.7 MB against an 80 MB gate** (shipped peak 3.1 MB; fragments are only 0.92 MB), on
  an instrument first validated against 03's own 65.8 / 26.2 / 3.1 MB. What actually blocks it is
  that the post-impact half is **not a function of scroll**: `Math.random` in the dust, a 4 ms cut
  budget that decides which generation is drawn, and a one-way integrator under a monotonic `age`.
  Mechanism specified (8b), **nothing built**, and the one number that could still veto it —
  worst-case replay ms on the frame the visitor reverses — is named and unmeasured.
- [06 — Visual treatment](issues/06-visual-treatment.md) — **the citation half closed in round 8; only the dated backdrop is left open.** **THE WORD IS THE UNIT**: a name, a date and a citation are built as individually positioned words, so text can do what 13 asked the objects to do — come apart. A credit is one line until its object's first split, three groups after it, single words after the second, and it is exactly as wide as its own wreckage at every moment because its spread is read off the live fragment positions. Type scales 1.00 -> 0.82 and ink runs 238 -> 188 with the object's age, which is what stops six of them reading as a list. **13's lifetime ruling is untouched** — it dies with the last speck. The name shatters at impact too. **The miss caption is deleted and the line is cut once per year of miss** — same year is one unbroken hairline, forty years is forty breaks, and ties rank by recency into the soil so five of them do not merge into one stroke. **Legibility is now structural, not a battle**: the credit only ever lies on the baked earth, the one surface whose value never changes, so the worst case is single-ended — measured **5.16:1** off composited pixels. **All four motion demos, both other burial renderings, the switcher, the launcher, the compare page and the flat directions pages are deleted**, which is where the map's new standing rule comes from. 29 gates green, ten perturbations red-then-reverted, two of the gates rewritten after they turned out to be tautologies.
- [06 — Visual treatment](issues/06-visual-treatment.md) **round 9 — CLOSED.** The dated backdrop
  is **the LIGHT**. The other two readings were not close: a *depicted* scene is out on the
  no-generated-imagery constraint and on 11's no-edges rule, and a dated *earth* reopens both 13
  and 06's own item 5 — so it was left alone. What is dated is **reach**, how far the light of the
  age got: a flame lights a few metres under a black star-filled sky, and gas → arc → filament
  push a glow up off the horizon until the sky is the lit thing and the stars are gone. **Reach is
  a smooth function of the year, not a step per lamp**, which is 11's periodization warning paid —
  a step at 1820 would print "the world had gaslight in 1820" as a visual fact. The pool's *shape*
  changes and not only its hue, which is 12's flatness rule paid. **34 gates green**, six
  perturbations red-then-reverted. `ground_never_dates` is the 13 guard and holds byte-identical
  earth pixels across five eras. One real defect found by a pixel scan: a sky fill that stopped at
  the ground line left the sliver above every dip uncleared, so the haze saturated to full opacity
  and printed a lit hairline along the whole horizon. **Two of the new gates were wrong before the
  page was** — both counted a falling photograph as sky — so every sky reading is now taken with
  nothing in the air.
- [03 — Reuse Deep Time's engine, or clean build](issues/03-engine-reuse-or-clean-build.md) — **the
  texture window. CLOSED, and the project's #1 technical risk with it.** 04's lever was spent after
  being corrected: its 163 MB was the probe *upscaling* every sprite to exactly 396 px, and its 12×
  was mostly image-vs-canvas (real figure 2.5×). **The cap is derived, not chosen** — `DRAW_H 132 ×
  DPR_CAP 2 = 264` device px is the tallest any photograph is ever rasterised at, so everything
  above it is decoded and thrown away: **301.2 MB → 65.8 MB**, transfer 14.2 → 6.5 MB, and
  indistinguishable at 1:1 (the 3× zoom that says otherwise is lying about the viewing condition).
  **But a count is not a ceiling** — 65.8 MB is under the gate for 230 and over it for 400 — so
  residency is bounded instead: a sprite is dead the instant it has been shattered, so **at most 10
  are resident, measured peak 3.1 MB against an 80 MB gate**, and the number does not move when the
  set grows. First load went from all 230 (14.2 MB) to **8 photographs, 0.20 MB, 835 ms**; a
  120,000 px drag fetches **21**, not 188. Two rules hold it up: **no pixels, no fall** (the landing
  is solved off the real silhouette, so a blind solve would draw two frames at one scroll position)
  and **no overtaking** (arrivals landed in fetch order, so an arrival whose tie partner was still
  in flight drew no line — caught by a gate, not by reasoning). 39 gates green on a normal network
  and 39 green again with every sprite held back 40–340 ms at random; six perturbations
  red-then-reverted. **Three things were wrong before the page was**, incl. two gates that stayed
  green with their own code deleted because localhost is never late. Also carries the audit 03 was
  opened for (carry/adapt/discard, the stated stack) and [10](issues/10-the-index-surface.md)'s
  thumbnail budget.
- [10 — The index surface](issues/10-the-index-surface.md) — **THE SHELF. Closed in one round, and
  it closes [06](issues/06-visual-treatment.md) item 6 with it.** The piece is twelve thousand
  years of things being destroyed; the index is *the same ground carrying all 230 of them standing
  whole* — which is the reward [12](issues/12-scrollytelling-craft.md) demanded, delivered without
  a crescendo, so [01](issues/01-the-fun-thesis.md)'s no-finale is kept rather than broken. Four
  rulings. **Chronology wrapped into rows at one height** — arranging by *moment* was tried and
  costs too much (the co-occurrence window slides, so rows would draw boundaries that are not
  there and the deep head becomes forty rows of one), and what survives is the honest half: a row
  is a WRAP, and **its own span printed in the gutter is 01's density spacing made visible** — the
  first row holds 5,246 years, the last holds 11. **A cell shows the object and nothing else**,
  because one height plus a name needs a fixed column and a fixed column is a contact sheet;
  words return complete on tap or focus, and there is no hover state because mobile is a ship
  gate. **Opened in place, and the jump back is RULED OUT on a ruling, not a difficulty** — decay
  is one-way, so re-entering the scroll at an item can only mean a reload, and a reload is a new
  visit; instead the shelf does what the scroll cannot and holds the thing intact, with everything
  standing within eighty years of it lit, which is **01's ambient engine at index density and the
  first time [06](issues/06-visual-treatment.md) item 1 was tested there**. **The credits live
  here**: one citation in full on the opened cell, all 230 in a roll lying in the earth below.
  03's budget held exactly — a **second bake** at `80 × dpr 2 = 160`, **26.2 MB** for all 230
  resident against the 80 MB gate (45.6 MB at 400), 0 sprites resident. **24 gates green normally
  and 24 under `--slow`, and the piece's 39 re-run green both ways.** Five defects found by frames
  and gates rather than by argument, incl. **three of the piece's citations stranded on the shelf
  forever** because the frame returned above its own teardown, and a hard horizontal edge at the
  seam that cost the stop a second screen of runway. **Three more harness faults than page
  faults** — one gate reported `4 → 4 → 4 → 4 → 4` as a pass because every row it sampled was the
  same era, and a probe read gold artifacts as sky, which is round 9's finding arriving again by
  another door.
- [10 — The index surface](issues/10-the-index-surface.md) **round 12 — the teeth finished, 16/16,
  and every fault was in the instrument.** The eight cases round 11 left unrun all turn their own
  gate red, and **the page needed no change to make that true: five faults, five in the harness,
  zero in the page.** Two gates were not imprecise but *structurally incapable of failing for the
  reason they were written*, and both had been counted green in round 11's table of 24 —
  `index_contrast` sampled `.ispan` only after opening a cell, which sets every readout to
  `opacity:0`, so **the shelf's only persistent text, printed in all twenty gutters, had never been
  read** (fixed: +468 samples, worst unchanged at 5.29:1); and
  `shelf_layout_does_not_wait_for_pixels` compared two loads at a moment when **0 of 230 thumbnails
  had been requested**, so it compared two cold readings and never exercised the `--slow` route it
  is named for (fixed: cold-vs-warm on each of two loads). Two perturbations were also wrong —
  one eased a change-detector cache that is never painted, the other crashed `probe()` instead of
  testing the gate. `masters_on_the_shelf` finally moves the memory gate: **301.2 MB**, the case
  round 11 added after `css_scaling_instead_of_a_bake` left it green. **A gate that cannot go red
  is not a weak gate, it is a decoration, and only a perturbation aimed at it finds one.**
- [14 — The ending, the cross-link and the signature](issues/14-the-ending-and-the-frame.md) —
  **built, on two rulings taken from Dustin before anything was made.** *The ending is that the last
  object never breaks*: the newest thing anyone made falls like the other 229 and then nothing
  happens to it — no cut, no splits, no dust — and its name and citation stand beside it until the
  seam takes the piece out. Nothing is un-broken, so 13's one-way decay holds; there is no new
  grammar, so [01](issues/01-the-fun-thesis.md)'s no-finale survives an ending; and *stopping* is
  the one shape change a treatment repeated 230 times can still make. **The plan named five touch
  points and there were six** — after all five, the ending still did not exist, because
  [03](issues/03-engine-reuse-or-clean-build.md)'s texture window releases a photograph at
  `rel - FALL >= LIFE`, the one object with no life to run out fell through that bound, and *no
  pixels, no fall* then held it in the air forever. **The two rules that hold the memory ceiling up
  had deleted the ending.** *The signature goes in both places*, Deep Time's treatment verbatim
  (brand-blue period included), riding the piece and going out with the seam so it and the
  colophon's copy are never on screen together; its box is reserved in the collision list, because
  11's contract has no furniture exemption. **Gates re-aimed, not narrowed**: `name_dies_at_impact`
  now claims *the set of names that outlive impact is exactly {229}*, which a skip-the-last-index
  gate could not. 40/40 and 26/26. **And the teeth found the blind spot that mattered** —
  `the_ending_never_lands` reddened nothing, because a continuous walk lands the object inside the
  window and only a *jump* to the end reproduces it, which is how a scrollbar drag arrives there.
  **Still open and not this ticket's:** the ending's words and the colophon's placeholder sentence
  ([07](issues/07-copy-voice-and-name.md)), and the inbound link from Deep Time (Dustin's, on a
  shipped site).
- [04 — The scroll mechanic](issues/04-scroll-mechanic.md) **round 9 — the break reverses. BUILT.**
  Ruling 8b, implemented: **nothing in the piece latches any more.** `down`, `age`, `splits`,
  `dusted` and `gone` are predicates read off the scrollbar; the forward grammar is untouched. The
  integrator still only runs forwards — what runs backwards is the SCROLL. Each generation of
  shards is born once at a position the tables fix, keeps its birth pose, and the pose drawn at `y`
  is that birth integrated forward by `floor((y − born) × MS_PER_PX / SUB)` whole steps, so walking
  up rewinds to birth and re-runs the same arithmetic. `SUB` stopped being a step CEILING and became
  a quantum, which is what made the shards stop depending on how fast the visitor was moving.
  **The veto number was measured first, as instructed, and did not veto** — 0.2–0.6ms median, 3.3ms
  worst against a 25ms budget — **but p95 22.4ms on a 6× throttled CPU**, which turns 8b's pose
  cache from an optimisation into the reason the ruling is affordable. **Eight defects, two older
  than the ticket**: `build()` never cleared `d.laid`, so every rebuilt citation rendered at the
  top-left corner — *resizing past 720px has always done that*; and the tie was armed at build time,
  so when the window re-admitted arrivals newest-first on a scroll-up, five ties silently stopped
  existing (round 10's no-overtaking defect through a new door). **Two costs recorded rather than
  smoothed**: the frame-budget margin went from 7.1ms to ~1.6ms (HEAD 17.9ms p95, round 9 23.4ms,
  measured A/B on one machine), and a jump now takes ~84 frames to finish assembling because the
  window fetches `AHEAD + FALL + BACK`. **03 round 10's abandoned pixel comparison is handed back**:
  two first visits are byte-identical PNGs, which the unseeded dust and the cut budget had made
  impossible. `sweep10` 43/43, `sweep11i` 26/26.

- [06 — Visual treatment](issues/06-visual-treatment.md) **round 10 — the citation comes OFF the
  piece, and most of round 8 goes with it.** Ruled by Dustin from options: a **wordless ground**, one
  ground line at 0.78, `NAME_OUT` 0.05. The licence argument is what makes it free — **CC BY 4.0
  3(a)(2)** is discharged by *linking*, the roll does that, and round 8's own comment had already
  conceded the piece could not (*"a link riding a word that is about to be thrown across the soil is
  unreachable"*). So the piece was carrying the obligation in the one form that cannot discharge it.
  **289 lines out of `gravity.js`**: the three-state spread, the wreckage-span readout, the ink ramp,
  the cluster row search and eleven now-orphaned constants. **Nothing recognisable was lost** — what
  lay on the soil was the SOURCE, never the object's name, and the name already died at impact.
  **Five gates re-aimed, not four** (the brief undercounted: `credit_contrast` lost its subject
  entirely), and **two were rewritten to stop being tautologies** — the label's span is now compared
  against a wrap width the *harness* computes from the viewport, and "is the citation back" is tested
  against the record's own **licence vocabulary** rather than a class name a re-implementation would
  change. **The named risk did not land**: legibility moved from frozen earth to the *dated sky*, the
  surface round 8 said it was not solved against and nothing had ever measured — **7.81:1** against a
  4.5 gate, and the worst case is a *date* word over a **black** firelight sky rather than a white
  one over lit LED. The `text-shadow` is deliberately not counted. **`no_text_collision_390` closed**
  (8 of 8 attributed, 33 -> 7 words on screen), and sweep11i's roll gate is now load-bearing so it
  checks the **link** as well as the text. 43/43 and 26/26 on localhost.
  **The teeth found a decoration in the round's own re-aim**: `label_is_one_line_until_impact` could
  not fail, because a name and a date are 3-5 short words and the widest label runs 230px against a
  330px wrap — replaced by `label_rides_with_its_object` (every airborne label centred on its own
  object within 4px), with the slack half now REPORTED instead of asserted. **And the control case
  proved the two changes are not independent**: reverting the ground line reddens
  `signature_keeps_its_corner_clear`, because ruling 1 emptied the soil band and **ruling 2 is what
  puts words back near the signature** — without the drop, 14's corner gate would have been quietly
  retired. Margin there is 2.2px, recorded rather than smoothed. `no_text_collision_390` survived
  with teeth (51 overlaps when the reservation is deleted, on 7 boxes — *more* reliable than the
  knife-edge 15 recorded at 33). **`frame_budget` red in six of nine cases, always under load,
  against 19.7/21.4ms idle on the same build — which is [15](issues/15-deploy-and-the-card.md)'s
  unattributed production red reproduced with no CDN in it.**
  **The piece is now VERIFIED AGAINST PRODUCTION** — 15 left it not: the sweep finishes there,
  `frame_budget` is **green on the real CDN (p95 20.2-20.6ms, worst 26.5ms)** against localhost's
  **20.5ms / 33.1ms** taken minutes later on the same idle laptop, so 15's red (25.7 / 47.1) was the
  machine and localhost is if anything the *worse* origin. The round-9 sky-probe crash did not recur
  either. **An eighth instrument fault, findable only over a real network**: `contact_is_a_position`
  takes three readings that each assume the probe object is present, and it is not until its
  photograph arrives — *no pixels, no fall* is the page being right. Guarding one read moved the
  failure to the next, which is how the fault was found to be the pattern; all three now share one
  bounded `waitFor`, and it passes against production reading identically to localhost.
  **One open, named not chased: `stars_go_out`** reads 1,624 stars at one era on production against
  177 on localhost — round 9's photograph-read-as-sky arriving a third time, through latency. No
  ruling depends on it, every other sky gate passes there, and localhost is 43/43.
- [08 — Accessibility & mobile](issues/08-accessibility-and-mobile.md) **round 2 — the two URL-bar
  reds. CLOSED, and they were one defect.** The page called `innerHeight` "a screen" and iOS changes
  that on an ordinary scroll gesture. **Measured before the options went to Dustin, and the
  measurement moved the argument**: round 1's headline 563ms handler **did not reproduce**
  (157–229ms over six collapses, median 179 against a 250 budget — the cost was the machine), while
  the number nobody had read was the one that mattered — **the ground line moved 77.2px on one bar
  collapse**, on a page whose [13](issues/13-visual-direction-v2.md) says the ground never moves,
  with an airborne object jumping 29.7px at a scroll position the visitor never left and the shelf's
  real document top sliding 89,924 → 89,726. Ruled by Dustin from three priced options: **the unit
  is `100lvh`, read off the canvas's own box** — on iOS a bar move does not change that box so
  nothing runs, on a desktop `lvh` IS the window so nothing changes, **no branch and no platform
  test**; the trigger is a **ResizeObserver on that box** with the work split, since `measure()`
  reads a width and never a height and a height change had been rebuilding 236 cells and
  re-encoding two WebP soil textures to reach byte-identical markup. **What it costs is stated:**
  the bar covers the bottom 99px of a canvas drawn to the tall height, which is deep soil — 86.7px
  of soil stays visible below the line — and the furniture deliberately does NOT follow the rule,
  because a control has to stay reachable while the world stays still.
  **The round's own new gate was a DECORATION and the teeth found it**: asserted against state it
  stayed green with the fix backed out, because a browser with no chrome in it has
  `innerHeight === the box`. **Three attempts to catch it on a clock all failed** — 30/120/255ms
  timing the frames, 1.8 vs 14.6ms timing the handler (canvas fills are queued), 40ms
  control-and-floor — every one of them inferring from a duration a fact the page will state
  outright. **So the bar is simulated instead: shadow `innerHeight`, leave the box alone, fire
  `resize`.** It now reproduces round 1's exact numbers headlessly. **Round 1 said only a device
  could settle this; it needed the right simulation, not a phone.** Five perturbations, four red at
  their target, and one control that stayed green and proved the ResizeObserver is load-bearing.
  42/43 localhost AND 42/43 production, the same `frame_budget` red in both, median floor unmoved
  (16.5 / 17.0) and an A/B flooring both arms — **43/43 was not reached on either origin.**
  `stars_go_out` **crashed the first production run** (`era 40: never found an empty sky`, the
  fourth occurrence, first time it took the sweep down) and **passed a straight re-run at 177 → 177
  → 74 → 0 → 0**: intermittent, latency-dependent, instrument not page. Still open, still not 08's.
- [08 — Accessibility & mobile](issues/08-accessibility-and-mobile.md) **round 3 — the sky reads
  pixels, PRODUCTION FINISHES, and `stars_go_out` is CLOSED.** The probe asked the page whether
  anything was in the air and then counted stars in a *second* evaluate; on localhost a photograph
  is never late so the gap is never spent, and against the real CDN it is — both production symptoms
  were that one gap from its two sides. One `getImageData` now answers both questions, so the
  emptiness proof and the star count are the same bytes; the discriminator is **run length**, which
  a photograph cannot fake. **43/43 localhost AND 43/43 production — the first time the sweep has
  ever finished there**, reading 177 → 177 → 74 → 0 → 0 identically on both. The two earlier
  production deaths were **playwright's default 30s `goto` budget on an old browser**, not the sky;
  every navigation now goes through one `arrive()` helper and **its retry never fired**, so the
  fault was slow, not broken. **`frame_budget` went green on both origins** with nothing near the
  frame loop touched — fourth independent finding that the red is the laptop, recorded as evidence
  and not as a fix. **And the teeth had no teeth**: the perturbation held the page's own `Image`,
  but [03](issues/03-engine-reuse-or-clean-build.md)'s `release()` does `removeAttribute('src')` —
  *"hand the decoded buffer back, not just the ref"* — so the element survived, its pixels did not,
  `drawImage` of a 0×0 image drew nothing silently, and the case the file exists for read 43/43
  green. **03's memory ceiling ate the teeth aimed at 08's sky probe.** Repaired by copying the
  photograph into a canvas the page has no handle on: 3/3 as designed, 240px run at every one of
  the 40 walk steps against a 12px bar. **A test of a gate can be a decoration too** — round 12's
  rule, one level up. One new open item, named not chased: **`label_contrast` takes 195 samples on
  localhost and 20 against production** (1 of 14 arrivals contributes there against 14 of 14 here,
  12–18 photographs still in flight) — *no pixels, no fall* is the page being right, and a green
  gate is only as wide as its sample set.
- [07 — Copy, voice & the name](issues/07-copy-voice-and-name.md) — **the name and the voice, and
  the furniture was outside every collision gate.** Resolved by building the options rather than
  picking: seven names in three families, all DNS-checked, and three voices written on the real
  strings at their real size over a real frame. **The four candidates were hiding a fork** — a name
  can carry the site's SUBJECT (decay, what Dustin noticed) or its PAYOFF (simultaneity,
  [01](issues/01-the-fun-thesis.md)'s fun mechanism) and not both, because a name that carries both
  is a sentence. **EVERYTHING BREAKS**, because it is the mechanic said flatly and because
  [14](issues/14-the-ending-and-the-frame.md)'s ending breaks the title in the last thousand pixels.
  *Time* died on the sibling-not-sequel rule (it reads as Deep Time's parent); *Humans in Time* on
  05's R1 (there are no humans in the piece). The voice is **the rules of the world** — present
  tense, "you" only in an instruction — picked because **the page was already in two voices** and
  the odd one out, `scroll to drop it · stop and it hangs`, was the best line on it. Both
  placeholders closed; **the arrival keeps no description line and the ending stays wordless**, both
  toward less copy. **A one-line-taller paragraph then found three defects, two older than this
  ticket**: a date printed through the headline, a `.5s` opacity ease that is a wall clock (14 struck
  the same one off the signature, and here it manufactured 21 collisions that do not exist), and the
  hint printed on top of the signature on every phone since 14. The frame's life is now a rule and
  not a number — **it is up until the first thing lands**. 41/41 and 41/41 `--slow`, 26/26 and 27/27,
  `teeth07` 4/4.
- [02 — Image supply & licence pipeline](issues/02-image-supply.md) — **CLOSED after nine rounds, and
  the last two were both about a ruling nobody had taken.** The seven flat artworks had been live as
  opaque rectangles since round 5 while four consecutive rounds copied *"await their ruling"*
  forward — **Dustin ruled they stay** (*"as they are live now with no editing"*), and the map's
  *nothing has an edge except the thing itself* survives on the reading that **for a flat artwork the
  sheet IS the thing**. They are the only 7 opaque masters in 230. The review surface built to ask
  the question **could not answer it**: both its columns resolved to `img/<k>.webp`, so after the
  promote it showed one file twice under a caption describing a defect neither picture had — round
  6's contrasting-ground lesson in general form, *a comparison whose two sides resolve to one file
  cannot fail*. **1940 Japan closes as a measured wall, not an unrun search**: Smithsonian, the Met,
  Cleveland, Commons/LOC and Wikidata all say the same thing from five sides — the corpus that
  **dates** Japanese objects stops at Meiji export ceramics, and the corpus that **has** the
  period-defining objects cannot date them. The 98-year hole stands, named and priced, and the real
  gap is **East Asia 1890–1948** rather than Japan alone.

- **The stride is part of the gate — [07](issues/07-copy-voice-and-name.md).** `no_text_collision`
  sampled every 500px across a 144,632px scroll, so the **460px prologue, where every piece of
  furniture on the site lives, got exactly one sample** — at y=0, before anything has fallen far
  enough to reach the words. A real defect sat at y=400 and the gate read 41/41 green. Walked at
  20px now. **Third ticket running where the instrument was wrong and the page was not**, and the
  first where it was the sampling rather than the measurement.
- **Matting solved, and it relaxes a filter** — `prototypes/anchor-preview/matte.py` (rembg + isnet, local, free) cut **9 of the 10** subjects that defeated the hand-rolled flood fill, including **Aldrin out of the visor photo** and **Sputnik's antennas**. [05](issues/05-arrival-set.md)'s cut-out admission test is therefore far weaker than [11](issues/11-visual-anchor.md) assumed: famous *moments* can become objects.

### New from Dustin, 2026-08-09 — after seeing round 7 run

- **The sources shatter with the piece.** Verbatim: *"I would like the sources to shatter with
  the peace and not just stack up on the ground."* -> [06](issues/06-visual-treatment.md) round
  8, **done**.
- **The miss-in-years caption is rejected.** `SAME YEAR` / `50 YEARS APART` — his word: *sucks*.
  The tie and what it means survive; the printed phrase does not. ->
  [06](issues/06-visual-treatment.md) round 8, **done**: the line is cut once per year of miss.

### New from Dustin, 2026-08-10 — **the break reverses too**

- **"When I scroll up the items should reverse."** Three readings were priced against each other and
  he picked **the full rewind** — dust re-condenses, shards reassemble, dead objects resurrect at
  the age their scroll position implies, and scrolling above an arrival's start puts it back in the
  air whole. -> [04](issues/04-scroll-mechanic.md) round 8 ruled and specified it; **round 9 BUILT
  it.** Nothing in the piece latches any more.
  - **Round 6's ruling 2 is half struck** (*a position runs both ways, an event does not*); its
    rulings 1 and 3 stand, and 8b is ruling 3 finally reaching the post-impact half.
  - **13's one-way decay is struck for the scroll direction only.** The forward grammar is unchanged.
  - **[10](issues/10-the-index-surface.md)'s jump-back was ruled out *because* decay is one-way.
    That reason is now gone** — the shelf could re-enter the piece at an item. 10's call, not 04's.
    **Still owed the news as of round 9's close.**
  - **The memory objection was withdrawn on measurement, not on argument:** 7.7 MB against an 80 MB
    gate. The real risk is **milliseconds** — replaying up to 115 pieces across six objects on the
    frame the visitor reverses — and it is unmeasured. Measure it before writing the frame loop.
- **A live defect found on the way to the ruling, and 41 green gates did not see it.** Scroll up
  today and the ground neither reverses nor clears — it **freezes and rides home with you**. At the
  top of the page the counter reads **7,000 BCE** with a **1934 car and a Bakelite radio lying on
  the soil**, under the site's own line *"Whatever is still lying there was standing at the same
  time."* Frame: `prototypes/webgl/verify04r8/04-top-still-1934.png`.
  - **`ground_is_the_moment` is one-ended** — it can only fail a field *older* than the counter, so
    one 8,934 years *newer* passes at any threshold — and it sweeps forward only. **A gate has a
    direction, and a gate that only ever walks forward has only ever tested forward.** Fourth round
    running where the instrument was wrong and the page was not; first where it was the *direction*.

### New from Dustin, 2026-08-12 — **the credit comes off the piece**

Three asks, taken as options before anything was built, and they interlock —
-> [06](issues/06-visual-treatment.md) round 10, **all three done**.

- **Attribution moves to the END.** The per-object citation is off the piece; the credits roll
  discharges every licence on its own (**CC BY 4.0 3(a)(2)** — the conditions are satisfied by
  *linking* a resource carrying the required information, and the roll links each source to its
  file page). This **deletes most of round 8's build** and the five gates that measured it were
  **re-aimed, not dropped**.
- **The ground drops** to one line at `H * 0.78`. The 0.64/0.71 phone-desktop split was never a
  look — it was round 8 buying the phone soil to pack six citations into, and ask 1 deleted its
  reason. Objects fall 22% further on a phone, 10% on a desktop.
- **The words go quicker**, `NAME_OUT` 0.07 -> 0.05 — though the larger half was ask 1: the citation
  lived 1,400-4,200px of scroll and the name lives 0.05 of it. `SPLITS`/`DUST_AT` were named as the
  other lever and are **untouched**: they are 13's object schedule, and with no text keyed to them
  moving them would reopen 13 to change nothing.

### The destination was reached, 2026-08-12 — [15](issues/15-deploy-and-the-card.md) round 1

- **Shipped.** `site/` is the deploy root, push auto-deploys (verified, not assumed), the card is
  live, and the sweeps were re-run **against the deployed origin** rather than localhost.
  **`sweep11i` 26/26 there; `sweep10` did not finish there** — 42/43 on localhost, but against the
  real CDN `frame_budget` goes red (p95 25.7ms, worst 47.1ms) and the round-9 sky probe crashes on
  `era 196: never found an empty sky`. **The shelf is verified against production and the piece is
  not**, and the frame-budget red is unattributed — the machine was loaded. One quiet back-to-back
  re-run settles it.
- **The name changed on the way out: TIME TAKES ALL.** Two copy consequences recorded, not acted on:
  [14](issues/14-the-ending-and-the-frame.md)'s ending was an argument for the old title, and the
  intro's last clause *"until the ground has taken all of it"* is now the title said twice — the
  exact defect 07 fixed in the other direction. Both are Dustin's.
- **ShareAlike ruled by Dustin: it reaches the CUT-OUT, under its own source's licence** — not the
  code, not the record, not the site. The only formulation that is right across all seven SA
  versions present, since the one CC BY-SA 1.0 entry has no later-version clause. One colophon
  sentence.
- ~~**A new red, and it is real: `no_text_collision_390`.**~~ **CLOSED by
  [06](issues/06-visual-treatment.md) round 10**, and not by 08 — taking the citation off the piece
  emptied the band the eight overlaps were competing for. Green at 230, red at 236 because the six
  new tail items filled the phone's soil; the round attributed all **8 of 8** as credit-word against
  credit-word (15 recorded it as *"almost all"*), and the same probe over the same 321 stops now
  returns 0 with the maximum words on screen down from 33 to 7.
- ~~**The CNAME.**~~ **Resolved 2026-08-12.** `timetakesall.dustincoledata.com` serves the piece on
  the real domain.
- **`no_text_collision_390` is the fifth time the number moved when the SET grew, not when the code
  changed** — and the harness cost four dead runs before it could be read at all: **a phase gets a
  new page, not a navigation.** A false green was caught in that fix before it ran, which is the
  same lesson from the other side.

## Not yet specified

- ~~**The build phase.**~~ **Built, and its last mile is now [15 — Deploy, the subdomain and the
  card](issues/15-deploy-and-the-card.md)**, scoped 2026-08-11 on Dustin's instruction to scope it
  before building. Seven decisions, one structural (**the site root** — the page lives two
  directories down and reads its data out of a sibling directory, and whichever layout wins, the
  harness's URL and the deployed URL have to become the same shape or 43 green gates stop meaning
  the site is green). Exactly one thing in it is genuinely undecided: **the social image**.
- **The share artifact and social card** — now the only open decision inside
  [15](issues/15-deploy-and-the-card.md). Deep Time rendered its finale fan as a build-time still. [01](issues/01-the-fun-thesis.md) settled that there is no finale to render and that the sendable unit is a planted callout line, not an image — so the card is probably a treated arrival or an index still. Not sharp enough to ticket until [06](issues/06-visual-treatment.md) sets the visual system.
- ~~**The prologue↔body seam.**~~ **Closed by [04](issues/04-scroll-mechanic.md) round 7** — structural, and produced by the same rule that delivers the contemporaries. No transition to design, no ticket needed.

## Out of scope

- **Deep Time itself.** Its `record.json` epoch defect is inherited as a *copy* to normalize. Do not edit, rebake or re-source anything under `Projects/Deep_Time`.
- **The 300,000-year and 2.8-million-year spans.** Ruled out this session; they would be a different effort with a different art economy.
- **Any single-nation or single-state history** (US, Kentucky). Ruled out this session on audience and scope.
- **Forward/future timelines.** Past to present only, as with Deep Time.
