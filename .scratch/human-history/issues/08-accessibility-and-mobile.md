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

---

## Round 1, 2026-08-11 — the half a headless browser can take, and it went red twice

**Not the ship gate.** The ship gate is a real device in Dustin's hand and it has still not been run.
What this round establishes is that **two of the three named scars are decidable without one, and
both are live** — so the real-device pass now has two known defects to confirm rather than a blank
page to hunt over. `harness/phone08.mjs`, read-only, 390×844 at dpr 3 with touch. **5 of 8.**

### RED 1 — the URL bar changes the length of the document

`setSpacer()` sizes the runway as `TOTAL + innerHeight * 2`, so **the document's own height is a
function of the URL bar.** Measured: the bar hides, `innerHeight` goes 844 → 745, and the runway
goes **172,415 → 172,217 px — it loses exactly 198px, which is the 99px bar counted twice.**

The piece itself survives this and that is worth stating precisely, because it bounds the defect:
`urlbar_does_not_move_the_moment` **passed** — the counter reads `1650 CE` at the same `scrollY`
before and after — because [04](04-scroll-mechanic.md)'s tables hang off `TOTAL`, which does not
depend on `innerHeight`. **What moves is everything downstream of it**: `indexTop()` is
`TOTAL + innerHeight * 2`, so **the shelf's top slides 198px under the visitor**, and it slides on
a surface [10](10-the-index-surface.md) laid out as absolute arithmetic precisely so nothing would
race. On iOS the bar hides and shows on ordinary scrolling, so this is not an edge case, it is the
normal gesture.

### RED 2 — and each of those is 563ms of work

`fit()` is bound to window `resize`, and `fit()` re-bakes the surface **and** the ground, rewinds
every generation of every wreck, and rebuilds **all 236 shelf cells with two soil bakes to WebP data
URLs**. Measured cost of one bar collapse: **563 ms** against a 250 ms budget. Safari fires that
event every time the bar moves.

**This is the map's third scar, arriving through the door the map named.** The rule is that a fixed
canvas re-syncs from **its own box** via `ResizeObserver`; this one re-syncs from
`innerWidth/innerHeight`, which is the number iOS lies about. `canvas_follows_its_box` passed only in
the trivial sense — the canvas did follow, at 563ms a go.

**Not patched tonight, deliberately.** The fix is a ruling, not an edit: the canvas has to stop being
sized from `innerHeight` (largest-height-seen, `visualViewport`, or `dvh`), and the runway has to
stop being measured in viewports — and both land on `bakeGround`/`bakeSurface` ([06](06-visual-treatment.md)),
the seam arithmetic and `INDEX_TOP` ([10](10-the-index-surface.md)), and the collision contract
([11](11-visual-anchor.md)). Improvising it into a file [04](04-scroll-mechanic.md) settled the same
week is how 43 green gates go quietly wrong. **It is this ticket's next round.**

### The 2.5.8 question, answered with the counts split

The raw number is alarming and almost all of it is the standard exception. Split:

| what | under 24px | ruling |
|---|---|---|
| shelf cells | **11 of 236** (min width 17px, median 63px, all 64px tall) | **Essential.** [10](10-the-index-surface.md) draws every object at one height and its own true width — *"a musket runs five cells wide and a kouros is a sliver"* — so the size **is** the information. Claimed under 2.5.8's *essential* exception, and this is the justification the ticket asked to be written down. Cells are 12px apart, so the *spacing* exception is not available and is not claimed. |
| credits-roll links | 248 of 250 (111 × 11 px) | **Inline.** They sit in a line of text; 2.5.8 exempts targets in a sentence or block of text. Clean, no argument needed. |
| colophon links | 13 (inline in the fine print) | same |
| the signature pill | 2 | the one target that is neither essential nor inline — **check it on the device.** |

### The first-tap-is-hover scar is the one no emulator can settle

Enumerated rather than tested, which is all a Chromium harness can honestly do: **three `:hover`
rules a finger can reach** — `.dcd-mark:hover`, `.iroll a:hover`, `.icolo a.out:hover`. All three
change *style* only; the WebKit scar fires on a `mouseenter` handler that **mutates the DOM**, and
there is none on this page. [10](10-the-index-surface.md) ruled the shelf has no hover state for
exactly this reason and that ruling held. Note `.iroll a:hover` is **new as of
[07](07-copy-voice-and-name.md) round 2** and now sits on 236 links — the largest tappable surface
on the site, added the same day, untested on glass.

Also green here: a tap opens a cell and a second tap closes it (2 lit within eighty years), and the
opened cluster stays inside the shelf's lane at 390 — worst right overhang **0.0px**.

### The real-device pass — what only Dustin can run

Everything above is a Chromium approximation. On an actual iPhone, in this order:

1. **Scroll down, then up, repeatedly, in the middle of the piece.** Watch for the runway moving as
   the bar hides (RED 1) and for the frame hitching (RED 2). These are the two the harness already
   found; confirm them and say how bad they *feel*, which is the only measurement that decides how
   much the fix is worth.
2. **The seam.** Scroll from the last object into the shelf and back up, with the bar showing and
   with it hidden. The 198px is largest exactly here.
3. **First tap.** Tap a credits-roll source link cold — does the link open on the first tap, or does
   the first tap only light it?
4. **Tap a sliver.** Find one of the 11 cells under 24px wide and try to open it with a thumb.
5. **200% text** (Settings → Display → Larger Text) on the shelf and on the opened cell.
6. **VoiceOver** past the seam: is the roll a list, and does a cell announce its name and date?

**It needs a URL a phone can open, and there is not one** — the piece is on `localhost:8812`. That
is why [15](15-deploy-and-the-card.md) says deploy does not wait on this ticket: shipping first turns
step 1 into opening a link.

## What 06 round 10 took off this ticket's next round, 2026-08-12

**`no_text_collision_390` is closed and it is not 08's any more.** [15](15-deploy-and-the-card.md)
ruled it here alongside the two URL-bar reds because all three land on the same surfaces, and the
three fixes it listed were *drop a citation, change the band, or shrink the type*.
[06](06-visual-treatment.md) round 10 took a fourth route neither ticket had: it took the citation
off the piece entirely, on the licence argument that the credits roll already discharges CC BY 4.0
3(a)(2) by linking. The phone's soil band stopped being contested — max words on screen 33 → 7, and
0 overlaps over the same 321 stops.

**The two URL-bar reds are untouched and are still this ticket's next round.** Nothing in round 10
went near `setSpacer()`, `fit()` or `indexTop()`. One thing did move under them and should be read
before that round starts: **the ground line is now `H * 0.78` at every width** rather than
0.64/0.71, so any fix that stops sizing the canvas from `innerHeight` is working against one
constant instead of two.

---

## Round 2, 2026-08-13 — the two URL-bar reds. CLOSED, and they were one defect

`88a6db8` (the page) and `43f468a` (the gates), pushed and live.

**The page called `innerHeight` "a screen", and iOS changes that on an ordinary scroll gesture.**
Both reds hung off that one sentence, and taking the options to Dustin was worth it because the
measurement moved the argument before the ruling did.

### What round 1 got right, and the one number it got wrong

Measured first, at a scroll position the visitor had not left:

| | round 1 | round 2 |
|---|---|---|
| runway | −198 px | **−198 px** ✓ |
| the shelf's real document top | not read | **89,924 → 89,726 — it slides 198px under the reader** |
| **the ground line** | **not read** | **658.3 → 581.1. Seventy-seven pixels.** |
| an object in the air | not read | **jumps 29.7px** at an unchanged scroll position |
| counter at that scrollY | unchanged | unchanged ✓ |
| handler cost | **563 ms** | **157–229 ms, median 179** over six collapses, idle laptop — under the 250 budget |

**The 563ms did not reproduce, and the number nobody had read was the one that mattered.** [13](13-visual-direction-v2.md)
says *the ground never moves and never changes*; the URL bar was moving it 77px, on every gesture,
on the surface [06](06-visual-treatment.md) round 10 had just reduced to **one** constant. So RED 2
was mostly not a performance defect — it was 13 being broken by a browser chrome, and the cost was
the machine, which is [15](15-deploy-and-the-card.md)'s `frame_budget` lesson arriving on a second
gate.

### The ruling — one number, read off the box

Put to Dustin as three forks with the costs measured, and he took the recommendation on all three.

1. **The unit is `100lvh`, read off the canvas's own box.** On iOS a bar move does not change that
   box, so `fit()` does not run and the ground, the runway and the canvas all stay still. On a
   desktop `lvh` **is** the window, so the behaviour there is exactly what it was. **No branch and
   no platform test** — which is the whole reason to choose the unit rather than the reader. The
   two alternatives were priced and are recorded rather than hidden: a largest-height-seen JS latch
   is provable headless but puts the ground line below the fold when a desktop window is dragged
   shorter, and leaving the unit alone fixes neither red.
2. **The trigger is a ResizeObserver on that box**, and the work splits by what changed. `measure()`
   reads a width and never a height, so a height change had been rebuilding **236 cells and
   re-encoding two soil textures to WebP data URLs — 56ms of the 179 — to arrive at byte-identical
   markup.** It gets `INDEX.setTop`, which is a number. `window.resize` is kept as the one thing
   that fires on a device-pixel-ratio change, and it is guarded by the box like everything else.
3. **The gates are re-aimed, and the device claim stays a device claim.**

**What it costs, stated rather than discovered later:** when the bar is showing it covers the bottom
99px of a canvas drawn to the tall height. The ground line is at `0.78 × 844 = 658` and the shortest
viewport is 745, so **86.7px of soil is still visible below the line** and what the bar covers is
deep soil and nothing else. The furniture deliberately does **not** follow this rule — `#intro`,
`#hint` and the signature stay bottom-anchored to the viewport, because a control has to stay
reachable while the world stays still.

### The gate was a decoration, and three tries at a clock is how that got found

Round 1's two assertions were testing the wrong event. **`setViewportSize` is a genuine viewport
change — a rotation — and every unit moves with it, `lvh` included.** A bar move is the opposite:
`resize` fires and the large viewport does not change. Verified: in headless Chromium
`lvh === svh === dvh` and a viewport resize moves all three.

So `resize_with_an_unchanged_box_does_nothing` was written for that condition — and **as first
written it stayed GREEN with the fix backed out.** In a browser with no chrome in it `innerHeight`
*is* the box, so a page that re-reads the window re-derives the same numbers and lands on the same
ground line, having done every bit of the work. That is round 12's finding through a new door: an
assertion that could not fail for the reason it was written.

Three attempts to catch it on a clock, each wrong in a different way, and all three the same
mistake — inferring from a duration a fact the page will state outright:

- timing the two frames: **30ms idle, 120ms on the same code with the machine busy, 255ms
  perturbed.** Noise four times the signal.
- timing the dispatch loop alone: **1.8ms clean against 14.6ms for eight full re-bakes** — nowhere
  near their true cost, because canvas fills are queued and the handler returns before the work is
  done.
- control-and-floor, the method round 9 used to fix `frame_budget`: separated them by 40ms, against
  a budget the perturbation still passed.

**So the bar is simulated instead of inferred, and it is two lines.** iOS changes `innerHeight`
while the large viewport stays put — shadow `innerHeight` with a getter, leave the box alone, fire
`resize`. Perturbed, the gate now reproduces **round 1's exact numbers in a headless browser —
ground 658.32 → 581.1, runway 172,446 → 172,248** — and clean it does not move. No clock, no budget,
no load sensitivity. **Round 1 said only a device could settle this. It needed the right simulation,
not a phone** — what the phone still owns is how it *feels*.

### The teeth — five perturbations, four red at their target, one control

| perturbation | result |
|---|---|
| read the window instead of the box | `resize_with_an_unchanged_box_does_nothing` **RED** (77px, −198) |
| always `INDEX.build` | `height_change_does_not_rebuild_the_shelf` **RED**, and 634ms |
| `indexTop()` back on `innerHeight` | `runway_matches_the_shelf` **RED** — 150,280 vs 150,082 |
| backing store without `dpr` | `canvas_is_its_own_box` **RED** |
| delete `addEventListener('resize', fit)` | **all green — the ResizeObserver is live and load-bearing**, and `resize` really is only the dpr backstop |

### Where it stands

**phone08 9/10.** The one red is round 1's own `touch_targets_24px`, unchanged and already ruled in
the 2.5.8 table above — 11 essential cells and 248 inline links, each claimed under a written
exception. **`sweep11i` 26/26. `sweep10` 42/43 on localhost AND 42/43 against production**, the
same single red in both places and the same one [15](15-deploy-and-the-card.md) hit: `frame_budget`.

**It is the machine again, and this round has the cleanest evidence yet for that.** The gate reads
the p95 floor, and it is the p95 that moves; the **median floor does not**: 16.5ms localhost, 17.0ms
against the real CDN. An interleaved A/B against HEAD — arms alternating in one window, so drift is
shared — floored both builds at **17.0/16.5 and 17.2/17.1ms median, with HEAD's p95 worse than this
build's.** A regression raises the floor and this raises neither. That is
[06](06-visual-treatment.md) round 10's finding for a third time, on a round that does not touch the
frame loop at all. **Recorded rather than smoothed: the round did not clear 43/43 on either origin,
and 43/43 has not been seen on this laptop since the machine got busy.**

**And `stars_go_out` moved without being touched.** The first production run **crashed** —
`era 40: never found an empty sky`, the round-9 sky probe reading a photograph as sky, the fourth
occurrence and the first that aborted the sweep instead of miscounting inside it. A straight re-run
on the same build **passed it, reading 177 → 177 → 74 → 0 → 0, identical to localhost**, with the
1,624-star reading the map records nowhere in it. So the open item is now better characterised than
it was: **it is intermittent and latency-dependent, it is the instrument and not the page, and its
failure mode includes taking the whole sweep down.** Still not this ticket's, and still open.

**Still 08's, and still open:**

- **The real-device pass — the ship gate, and only Dustin can run it.** Steps 1 and 2 of the six
  above now have a specific claim to confirm rather than a defect to find: *the ground line and the
  shelf must not move at all when the bar hides, and there must be no hitch.* Steps 3–6 (first tap,
  the sliver, 200% text, VoiceOver) are untouched by this round.
- Alt text at volume, screen-reader structure, reduced motion and 200% text — round 1 did not reach
  them and neither did this one.

---

## Round 3, 2026-08-13 — the sky reads pixels, production finishes, and the teeth had no teeth

`1b41d0e` landed the code and not the verification. This round is the verification, and it changes
two of the round's own claims: one is confirmed harder than it was stated, and one was never tested
at all.

### The three runs, and production finished for the first time

| | localhost | production (`time-takes-all.vercel.app`) |
|---|---|---|
| `sweep10` | **43/43** | **43/43 — and it FINISHED** |
| `sweep11i` | **26/26** | not run — localhost only this round |

Two prior production attempts died on playwright's default 30s `goto` budget, at 610 gates in and
then at 751. **The `arrive()` retry never fired** — there is no retry line anywhere in the log — so
the 90s budget alone carried it and the retry is unspent insurance. That is worth stating precisely
because it characterises the fault: the old browser is **slow to navigate, not broken**, and one
budget the size of the fault was the whole fix. No third navigation site, no ceiling.

**`stars_go_out` reads identically on both origins: 177 → 177 → 74 → 0 → 0**, longest run
3 / 3 / 2 / 0 / 0 px against a 12px bar. The 1,624-star reading and `era 40: never found an empty
sky` are both gone, and gone **at the origin that produced them**, which is the only place that
counts. The gap between `snap()` and `getImageData` was the whole of it.

**And `frame_budget` was green on both origins, for the first time since the machine got busy.**
Median floor **16.5ms on both**; p95 floor 19.9 localhost / 19.6 production; worst pass 20.2 / 20.1.
Nothing in this round goes near the frame loop, and round 2's floors were 16.5 / 17.0 against this
round's 16.5 / 16.5. **The number that moved is the laptop, not the page** — which is what round 2,
[06](06-visual-treatment.md) round 10 and [15](15-deploy-and-the-card.md) each concluded from the
other side. Recorded as the fourth piece of evidence for that reading, **not as a fix**, because
nothing was fixed.

### The one thing production still says differently, and it is a sample set

Six numbers differ between the two logs. Five are noise — `the_ground_carries_no_words` 5,282 vs
5,283 readings, decoded peak 5.8 vs 4.3 MB, fragment peak 3.90 vs 3.98 MB, dust cleared 478/475/479
vs 156/78/78. The sixth is not.

**`label_contrast` took 195 samples on localhost and 20 against production, and reported the same
worst value — 7.81:1 — from both.** Measured rather than inferred, at the gate's own 14 stops:

| | localhost | production |
|---|---|---|
| arrivals contributing a label | **14 of 14** | **1 of 14** |
| photographs still in flight at a dead stop | 0 | **12–18** |

The gate skips `!d.atoms || !d.air`, and *no pixels, no fall* is the page being **right**: an arrival
whose photograph has not landed is not in the air, so there is no label to measure. The worst value
survives only because the one readable stop is **item 4 — the head**, whose photograph is in the
first-load batch of eight and which happens to be the firelight case that produces the worst reading
anyway. That is luck, not design.

**Ninth instrument fault of this shape, and the second of this exact one** —
[06](06-visual-treatment.md) round 10's `contact_is_a_position` was three reads that each assumed
the probe object was present. **A green gate is only as wide as its sample set, and this one is 10×
narrower on the origin that matters.** Named and measured, **not chased**: no ruling depends on it,
it is green on both origins, and the fix is round 10's bounded `waitFor` pointed at a new subject.

### The teeth had no teeth, and 03's memory ceiling is why

The first run came back **2 of 3, and the miss was case 1 — the case the file exists for.** The
parked photograph left all 43 gates green.

**It was never drawn.** `teeth08r3` grabbed the page's own `Image` element and this comment said so
in prose: *"held by the harness's own reference so the texture window releasing it cannot take the
perturbation away."* It can. [03](03-engine-reuse-or-clean-build.md)'s `release()` is
`d.im.removeAttribute('src')`, and its own comment reads *"hand the decoded buffer back, not just
the ref"* — **the element survives and its pixels do not**, and `drawImage` of a 0×0 image draws
nothing and throws nothing. Measured: captured at scrollY 0 as `ainghazal.webp` 89×264, and by the
time era 6's walk begins at 4,028 the same object reads `src ""`, `naturalWidth 0`. So the
perturbation was a **silent no-op**, and the control passed because nothing was ever drawn anywhere.
**03's memory ceiling ate the teeth aimed at 08's sky probe.**

This is round 12's rule one level up. Round 12 said a gate that cannot go red is a decoration; this
was a **test of a gate** that could not go red, and it read as a pass in a file whose entire purpose
is to catch that.

**And it corrects the round's own headline.** `1b41d0e`'s message claims the parked photograph
*"only reads 4,661 → 177 → 74 → 0 → 0 … and PASSES the old probe."* The parked photograph cannot
have produced 4,661 stars, because the parked photograph was never on the canvas. The only thing in
the rectangle was **the page's own falling object** — which is the fault the round repaired,
arriving through the honest door. Right about the phenomenon, wrong about its cause.

**How it was found, which is the reusable half.** A sweep per attempt is twelve minutes, so the
sky walk was re-implemented standalone with every step printed, and it answered in one. The first
reading showed runs of 107 → 108 → 44 → 3 px with the row index marching *down* the rectangle —
that is the real falling object leaving the sky, detected correctly and walked past correctly, which
is exactly what the walk is for. **The stuck photograph appeared at no step at all**, and that
absence is what named the fault. Repaired by copying the photograph into a canvas the page has no
handle on, then verified before spending a sweep on it: **240px run at every one of the 40 steps**,
20× the bar, stars 7,332–10,199 against the honest 177.

| perturbation | first run | repaired |
|---|---|---|
| photograph parked in the star rectangle, era 6 | **43/43 green — the false green the file exists to delete** | **39/43** — `backdrop_is_dated`, `ground_never_dates`, `stars_go_out` and `hud_contrast` all red on *"era 6: no photograph-free sky in 702px of walk — worst run 240px at y=100 (bar 12)"*, **and the run printed its table** |
| the same photograph parked at 60,000px, where no era walks | green — but trivially, nothing was drawn | **green, and now a real control** |
| `STAR_OUT` 0.72 → 9 | **red** — 177 → 177 → 167 → 147 → 145 | red, unchanged |

**3/3 as designed, files restored byte-identical.** Both of round 3's claims are now proven rather
than asserted: **a photograph in the rectangle cannot satisfy the count**, and **a probe that cannot
read its subject reports four named reds instead of taking the other 39 gates down with it.** The
four-red result is the design, not a spill — all four gates are claims *across* five eras, so an
unreadable era fails all four rather than quietly passing on the remaining four.

### Where it stands

**`stars_go_out` is CLOSED.** Open since [06](06-visual-treatment.md) round 10, carried through
[15](15-deploy-and-the-card.md) and round 2 as "intermittent, latency-dependent, the instrument and
not the page" — all three of which were right. It now reads identically on both origins and its
teeth are green.

**Nothing in this round touched the page.** `site/` is byte-identical to `1b41d0e`; the only change
is `teeth08r3.mjs`.

**Still 08's, and still open — unchanged by this round:** the real-device phone pass (the ship gate,
only Dustin), alt text at volume, screen-reader structure, reduced motion and 200% text. Also open
and **not 08's**: `label_contrast`'s production sample set, and the intro's title-echo copy line
([07](07-copy-voice-and-name.md)).
