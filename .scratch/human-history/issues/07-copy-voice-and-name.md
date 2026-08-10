# 07 — Copy, voice & the site's name

Type: grilling
Status: PARTLY CLOSED — the name and the voice are ruled and built, 2026-08-10. Items 2, 3 and 7
        (the arrival line, the notation set, the attribution templates) are open.
Blocked by: 05
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What does the site say, in what voice — and what is it called?**

Blocked by [05](05-arrival-set.md): there is no copy deck until the set is final.

Decide:

1. **Voice.** Deep Time landed on *captioner, not narrator* — one factual third-person sentence, flat wit, no second-person address. That was tuned for awe. A site whose currency is fun may want more warmth or more wit — but **never corny, never sales-pitchy**: flat declarative, no parallel triads, no feel-something clauses. If the voice moves off Deep Time's, say exactly how and why.
2. **What each arrival must carry.** Name, date, and — decided here — whether a description line exists at all, and whether it is required or enrichment. Deep Time's forcing finding is worth re-testing: anything a visitor *must* receive has to survive on a phone, so it lives in the date or the name, and the extra line is desktop enrichment.
3. **Hedging.** Contested dates carry their doubt in notation (`c.`, ranges, `≥`), identity doubt goes in the name. Confirm the notation set and where a hedging sentence is genuinely required instead.
4. **The intro.** What the visitor is told before scrolling — the frame, the scale (if [04](04-scroll-mechanic.md) left one to explain), and the promise. Deep Time held a frame at scroll 0 quoting its own page height.
5. **The ending's words**, whatever shape [01](01-the-fun-thesis.md) gave it.
6. **The name and subdomain.** "Human History" is a folder name only. Needs a real name and a `*.dustincoledata.com` subdomain, checked against the existing set (deeptime, namesake, cascade, meaningmap, redraft, realprice, illusions, climatefingerprint, moves, byexample).
7. **Attribution copy.** Credit and licence lines at set volume — the exact rendered string per licence type, agreed with [06](06-visual-treatment.md)'s placement ruling.

**Deliverable:** the full copy deck — every arrival line, the intro, the ending, the HUD, and the credit string templates — plus the locked name and subdomain.
---

## Input from Dustin, 2026-08-08 — the name, now that the set exists

Given after seeing the 230-item set. Verbatim:

> *"it looks like we only did objects, so we probably we need to make sure we name the project
> something like 'Time,' something about time taking everything, or something like that, or
> 'Humans in Time' and/or 'Human Objects in Time' or 'Human Objects and Decay,' etc. I don't know
> what would be best."*

**The observation is correct and it is a ruling, not an accident.** [05](05-arrival-set.md)'s R1
settled that an arrival is *always a made object with a body* — events, ideas and institutions are
in only through the object they left. So the site is not "human history"; it is **the things people
made, and time taking them.** The name has to be honest about that, and "Human History" now
oversells what is on screen.

His four candidates, recorded as given: **Time · Humans in Time · Human Objects in Time · Human
Objects and Decay.** He explicitly does not know which — *"I don't know what would be best"* — so
this resolves by putting real options in front of him, not by picking.

Two things the name must survive, both now settled: the piece is **objects only**, and its subject
is **decay** — the object arrives, breaks, and goes into the ground. A name about *history* fights
both. A name about *time* or *what time does to things* fits both.

Note the working repo name is `Human_History` and the map's title is *Human History*; renaming the
repo is not implied and is not this ticket's call.

---

## Round 1 — the name and the voice, 2026-08-10

Resolved the way the ticket said it had to be: **seven names and three voices were built and put in
front of Dustin**, written on the real strings at their real size over a real frame, and he picked.
Nothing was chosen for him.

### The name: EVERYTHING BREAKS · everythingbreaks.dustincoledata.com

**The split the four candidates were hiding.** *Time · Humans in Time · Human Objects in Time ·
Human Objects and Decay* all describe the dataset, and every other project in the set is named for
the thing at its centre or for what it does. Underneath them is a narrower question, and it is a
real fork rather than a matter of taste: **the name can carry the site's SUBJECT or its PAYOFF, not
both.** The subject is decay, which is what Dustin noticed. The payoff is simultaneity, which is
what [01](01-the-fun-thesis.md) ruled the fun actually comes from. A name that carries both is a
sentence, which is what *Human Objects and Decay* already is.

So the options were built in three families — decay (*Everything Breaks · Made and Broken · Time
Takes Everything*), simultaneity (*Same Ground · Meanwhile*), and the object (*Object Permanence ·
Things People Built*) — and every one was checked against DNS. All seven free; the ten shipped
subdomains all resolve to Vercel, and `directed` is still un-CNAMEd.

**Picked: Everything Breaks.** It is the mechanic said flatly — impact, split, split, dust — and it
is true of 229 of the 230. **The 230th is [14](14-the-ending-and-the-frame.md)'s ending**, so the
title is a claim the piece spends twelve thousand years proving and then breaks in the last thousand
pixels, which no other candidate got for free. Runner-up was *Same Ground*, the better idea and the
worse name: it points at the surprise but says nothing about a thing being destroyed, which is the
specific dishonesty this ticket was opened to fix.

Why the four were dropped, in one line each: **Time** claims everything, says nothing, and reads as
the *parent* of Deep Time rather than its sibling — the map's sibling-not-sequel ruling fails at the
name. **Humans in Time** — there are no humans in the piece, since [05](05-arrival-set.md)'s R1 bars
identifiable people, so it is less honest than *Human History*, not more. The other two are catalog
records.

The `<title>` takes Deep Time's shape verbatim (`Name — one flat clause`):
*Everything Breaks — twelve thousand years of things people built*. **The repo is not renamed** and
that stays out of scope.

### The voice: THE RULES OF THE WORLD

**The finding that decided it, before any option was written: the page was already in two voices.**
Everything on it was Deep Time's captioner — the headline, the paragraph, the roll heading, the
colophon — except the hint, *"scroll to drop it · stop and it hangs"*, which is the best line on the
site and belongs to something else entirely. That mismatch is why none of it sounded like anything.

Ruled: **the world states its own rules, in the present tense, and the only time the page says
"you" is an instruction.** Picked over the captioner because the site now has a *name* that sits
beside Deep Time, and the voice is the one place the sibling would otherwise read as a sequel; and
over the counts variant (*"230 things people made"*) because a count in the copy makes adding an
object a copy edit as well as a data edit.

Three sentences, three rules — the scroll, the decay, the co-occurrence — and none of them says what
any of it means:

> Things drop when you scroll and hang when you stop. What lands comes apart, and the pieces come
> apart, until the ground has taken all of it. Whatever is still lying there was standing at the
> same time.

**The draft said `Everything that lands breaks`** and the title says EVERYTHING BREAKS; the same
phrase twice on one screen is what the rewrite was for. The headline is untouched —
[11](11-visual-anchor.md) locked it as the positioning line.

**Both placeholders are closed.** The roll heading is *"Everything that fell, and where the picture
came from"*; the colophon is *"Deep Time runs from the formation of the Earth to now."* + the link
*"All of this fits in its last sliver."*

### What a longer paragraph found: the furniture was outside every collision gate

The new paragraph is one line taller than the old one, so it was measured before it was believed.
**The intro had never been inside a collision gate on this site** — [14](14-the-ending-and-the-frame.md)
put the signature into `boxes()` on the argument that 11's contract has no furniture exemption, and
nobody made the identical argument for the words that are on screen at the same time as the first
citations. Putting the intro's ink and the hint into `boxes()` cost four lines and immediately said
three things, **two of them older than this ticket**:

1. **The first date printed across the headline at 1440**, at y=500 — `c. 7000 BCE` through the h1.
   Only the paragraph got longer and it sits *below* the headline, whose box is identical either
   way, so this one was already there. Inferred from the geometry rather than measured on the old
   copy: **the settled numbers here are all from the new copy**, because the first two probe runs
   were reading the transition described below and their old-vs-new comparison is worthless.
2. **`transition:opacity .5s ease` on `#intro` is a wall clock on a scroll-driven value** — the exact
   thing 14 struck off the signature, still on the intro. It cost real evidence before it cost
   anything else: a probe reading one frame after a jump saw the intro still painted at 0.06 more
   than 700px past the scroll position that had already taken it to zero, and reported **21
   collisions that do not exist**. Settled, there was **one**. A scrollbar drag reproduces the lag
   for half a second.
3. **On a phone the hint and the signature were printed on top of each other** — 195px of tracked
   capitals across the middle and a 169px pill hard against the right, both on the 22px line, 92px
   of them the same pixels. **Since 14 shipped**, invisible because furniture was in no gate.

Fixed, in that order. The transitions are gone from `#intro` and `#hint`. The intro is reserved in
`taken` off its **ink** and not off `#intro`, whose box is mostly padding. And the frame's life
became a rule instead of a number: **it is up until the first thing lands** (`START[0] + FALL`),
which is a scroll position tied to something that happens on screen, and which makes the conflict
structural — after contact there is no intro, and before contact the only words in the air are
riding the object, where `place()` has four candidate boxes. On the phone the three pieces of
furniture now sit in a column with real gaps: ink to 732, hint 756–780, pill 797–826.

### The gate was blind where all the furniture lives

`intro_is_not_furniture` **did not go red**, and the reservation looked like decoration. It is not:
a 20px walk of the pre-contact window with it deleted put the falling object's citation through the
headline at **2 of 24 stops at 1440**, first at y=400. **The gate was sampling every 500px, so the
entire 460px prologue got exactly one sample, at y=0, where nothing has fallen far enough to reach
the words.** A stride chosen for a 144,632px scroll cannot also be the stride for the 460px where
every piece of furniture on the site is. The prologue is now walked at 20px, the rest at 500, and
the case reddens with 11 overlaps.

**Same shape as [10](10-the-index-surface.md) round 12 and [14](14-the-ending-and-the-frame.md), for
the third ticket running: the page was right and the instrument was what needed correcting** — and
this time it was the *sampling*, not the measurement. A gate that cannot fail for the reason it was
written is a decoration; so is a gate that never looks where the defect is.

### Two rulings the voice made, both toward less copy

- **No description line on an arrival.** [05](05-arrival-set.md) left the slot empty. It stays
  empty: a description has to shatter with the object like every other word ([06](06-visual-treatment.md)),
  clear the no-collision contract at the crowded tail, and survive a phone — and the name, the date
  and the tie already carry the surprise. If the sentence is ever wanted, its honest home is the
  opened cell on the shelf, where nothing is falling.
- **The ending stays wordless.** 14 built it that way and left the call here. Any line there
  explains the one thing the piece has just demonstrated.

### Verified

`sweep10` **41/41** green and **41/41** under `--slow`; `sweep11i` **26/26** and **27/27** under
`--slow`. `teeth07` **4/4**, each reddening exactly its own gate, files restored byte-identical.

**A killed run stranded its perturbation in `gravity.js`** — the 10-minute wrapper timed out
mid-case, the `finally` never ran, and `git status` cannot tell a stranded patch from real work
because the file was already modified. Caught by checking the anchor rather than the status, and
undone by **restoring the exact bytes**, never `git checkout`. The harness README's rule earned
itself again, with the correction that *checking `git status` between cases is not sufficient on a
file you are also editing* — check the anchor.

### Still open on this ticket

Items **2** (does an arrival carry more than a name and a date — ruled *no* for the piece, but the
shelf's opened cell is unwritten), **3** (the notation set: 141 of 230 dates are hedged and the
notation is inherited from the institutions rather than agreed), and **7** (the exact rendered
credit string per licence type). None of them blocks anything now shipping.
