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
