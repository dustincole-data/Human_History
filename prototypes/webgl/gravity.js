/* Human History — the piece. One page, one path, no flags.

   GRAVITY / SHATTER, picked outright in ticket 13 after five rounds. Round 8 (ticket 06) deleted
   the four motion directions and the three burial renderings that rounds 6 and 7 had wrongly kept
   alive next to it. There is no `?v=`, no `?b=`, no launcher and no compare page. When a direction
   is picked the losers go in the same commit.

   Verbatim, the sentence the whole file serves: "objects break into pieces when they hit the
   ground, and the text goes away. As time goes on they break down into smaller and smaller pieces
   until they disintegrate into the ground. Don't have the ground change or build up over time. It
   can just remain still."

   THREE RULINGS FROM 13, ALL STILL BINDING:

   1. CITATION. The name and the date die at impact. A credit line — source · licence · credit —
      stays where the object fell and lives for exactly as long as one fragment of that object
      does. It dies with the last speck. Nothing is ever on screen without its attribution, and
      nothing carries attribution after it is gone.

   2. SHATTERING A PHOTOGRAPH IS A CUT, NOT A GRADE — therefore legal. Every fragment is the
      source image drawn through an alpha clip; each surviving pixel keeps its exact original RGB.
      Same operation class as the cut-outs the set already ships. Dust specks take their colour by
      sampling the photograph's own pixels. No tint, no duotone, no grade, ever.

   3. THE GROUND IS STILL, AND SO IS ITS COLOUR. One material, one level, baked once and never
      touched. The era's colour is the LIGHT, painted before the opaque earth goes down over it.

   ------------------------------------------------------------------------------------------
   ROUND SIX — ticket 04. THE FALL IS SCROLL-DRIVEN, NOT GRAVITY-DRIVEN.

   Dustin, after seeing the 230-item set run: "if somebody lets up on the arrow when something
   is in mid-fall, it shouldn't continue falling. Scrolling down is what should make the item
   hit the ground, not actual gravity."

   So an object's height is a pure function of scroll position. Let up, and it hangs — not
   because anything was paused, but because there is no clock to pause. THE SCROLL IS THE ONLY
   CLOCK IN THIS FILE. Nothing anywhere advances on wall time: not the fall, not the shard
   scatter, not the impact dust, not the era's light, and as of round 8 not one word of text.
   Stop scrolling and the whole frame is frozen.

   What that deleted: matter.js entirely (a scroll-mapped height needs no solver, and "drag to
   throw" went with it); the 880 ms drop floor and the queue behind it (spacing is scroll distance
   alone, so exactly one object is ever in the air by construction); and per-frame collision
   testing (the landing offset is solved once, before the fall starts, from the object's real
   silhouette at the exact angle it will be tumbling at when it arrives).

   ------------------------------------------------------------------------------------------
   ROUND NINE — ticket 04. THE BREAK REVERSES TOO, and round 6's line is struck.

   Round 6 ruled "the fall reverses, the break does not", on the grounds that a position runs both
   ways and an event does not. Dustin asked for the other half: "when I scroll up the items should
   reverse." Round 8 priced it, found the memory objection was worth 7.7MB against an 80MB gate,
   and ruled the full rewind — dust re-condenses, shards reassemble, dead objects resurrect.

   What made the break irreversible was never the concept. It was three wall clocks: `Math.random`
   in the dust, a 4ms cut budget that decided which generation got drawn, and a one-way integrator
   under a monotonic `age`. All three are gone. NOTHING IN THIS FILE LATCHES ANY MORE — `down`,
   `age`, `splits`, `dusted` and `gone` are predicates read off the scrollbar, not flags something
   set, and the only remaining question at any scroll position is what the tables say.

   HOW THE BREAK RUNS BACKWARDS, given a forward-only integrator. It does not: the SCROLL runs
   backwards and the integrator always runs forwards. Each generation of shards is born once, at a
   scroll position the tables fix, and keeps the pose it was born in; the pose drawn at scroll y is
   that birth integrated forward by `floor((y - born) * MS_PER_PX / SUB)` whole steps. Walking down
   adds a step, walking up rewinds to birth and re-runs. Same arithmetic either way, so the same
   scroll position is the same frame however the visitor got there.

   AND A SETTLED GENERATION IS NEVER REPLAYED. Measured before this was built, on the six-object
   frame ruling 8b named: replaying every live object from birth every frame is 0.2–0.6ms here but
   p95 22.4ms on a 6x-throttled CPU, which is over the budget on the phone that is a ship gate.
   Stopping at rest is what makes it free — a piece at rest is at rest for the remainder of its
   generation, so `restN` is recorded the first time the whole field stops and the pose above it is
   a constant. That is not an optimisation; it is the reason the ruling is affordable. */

import { ITEMS, lightFor, shortCred, setHud, setIntro, fadeIntro, done, hash, REDUCED } from './shell.js';
import { hexA, rng, noise1, impactDust, breathDust, stampDust, rewindDust, stepDust, drawDust,
         tileFor, mottle, restProfile } from './burial.js';
import { sites, voronoi, cutPiece, avgColor, makePiece, stamp, stepPieces, drawPieces,
         rewindPieces } from './decay.js';
import * as INDEX from './index.js';

/* THE VOICE (07): the world states its own rules, in the present tense, and the only time the page
   says "you" is an instruction. Three sentences, three rules — the scroll, the decay, the
   co-occurrence — and none of them says what any of it means. The register was picked over Deep
   Time's captioner because the site now has a name that sits beside Deep Time, and it is the one
   place the sibling would otherwise read as a sequel; the hint below was already written in it and
   is the line the rest of the copy was brought into line with.

   It does not print the site's own name. `Everything that lands breaks` was the draft, and with the
   title reading EVERYTHING BREAKS it was the same phrase twice on one screen. */
setIntro(
  'Things drop when you scroll and hang when you stop. What lands comes apart, and the pieces ' +
  'come apart, until the ground has taken all of it. Whatever is still lying there was standing ' +
  'at the same time.',
  'scroll to drop it · stop and it hangs');

/* ------------------------------------------------------------------ the world

   There is no camera. The ground sits at a fixed screen y and stays there, so world space and
   screen space are the same thing. There is no physics engine either — the only integrator left
   in the piece is decay.js's debris stepper, and even that is fed scroll. */

const host = document.getElementById('gl');
const cvs = document.createElement('canvas');
cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';
host.appendChild(cvs);
const ctx = cvs.getContext('2d');

// the ground is static, so it is drawn ONCE into its own canvas and blitted every frame
const gcvs = document.createElement('canvas');
const gctx = gcvs.getContext('2d');

/* one fixed soil. Dark and neutral on purpose: the era colour is a light, and a light needs
   something unlit to be a light against. */
const SOIL = { m: '#2b2620', d: '#4c4438', k: '#171410', l: '#5c5344' };

let W = 0, H = 0, dpr = 1;
let surf = new Float32Array(1), COLW = 4, PAD = 80, NCOL = 1;
const groundY = () => H * (W < 720 ? 0.64 : 0.71);
const idx = x => Math.max(0, Math.min(NCOL - 1, Math.round((x + PAD) / COLW)));
const xAt = i => i * COLW - PAD;
const surfAt = x => surf[idx(x)];
/* the slope of the land at x, in radians — every word of text lies down on it */
const slopeAt = x => Math.atan2(surfAt(x + 10) - surfAt(x - 10), 20);

function bakeSurface() {
  NCOL = Math.ceil((W + PAD * 2) / COLW) + 1;
  surf = new Float32Array(NCOL);
  const gy = groundY();
  for (let i = 0; i < NCOL; i++) {
    const x = xAt(i);
    surf[i] = gy +
      (noise1(x * 0.0012) - 0.5) * 44 +
      (noise1(x * 0.0064 + 11) - 0.5) * 15 +
      (noise1(x * 0.047 + 31) - 0.5) * 4;
  }
}

/* everything below the surface contour, as a path — the only shape the earth is ever drawn as */
function region(c, off, step = 4) {
  c.beginPath();
  c.moveTo(-8, surf[idx(-8)] + off);
  for (let x = -8; x <= W + 8; x += step) c.lineTo(x, surf[idx(x)] + off);
  c.lineTo(W + 8, H + 8);
  c.lineTo(-8, H + 8);
  c.closePath();
}

/* Baked once per resize and never again. Grain, inclusions and micro-bedding from burial.js. */
function bakeGround() {
  gcvs.width = Math.round(W * dpr); gcvs.height = Math.round(H * dpr);
  gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gctx.clearRect(0, 0, W, H);

  const tile = tileFor(SOIL, 3);
  gctx.fillStyle = gctx.createPattern(tile, 'repeat');
  region(gctx, 0);
  gctx.fill();

  gctx.globalCompositeOperation = 'source-atop';

  const mt = mottle();
  gctx.fillStyle = gctx.createPattern(mt, 'repeat');
  gctx.fillRect(0, 0, W, H);

  // the top few inches take the sky. Fixed, not era-driven — the ground's colour never moves.
  gctx.fillStyle = 'rgba(255,236,208,.016)';
  for (let k = 0; k < 9; k++) { region(gctx, k * 7, 8); gctx.fill(); }

  // light dies with depth, measured from the local surface so the darkening bends with the land
  gctx.fillStyle = 'rgba(5,5,7,.055)';
  for (let k = 0; k < 26; k++) { region(gctx, k * 40, 12); gctx.fill(); }

  gctx.globalCompositeOperation = 'source-over';

  // loose debris straddling the line, so the eye can never trace one continuous edge
  const r = rng(9001);
  for (let i = 0; i < NCOL; i += 2) {
    const q = r();
    if (q > 0.4) continue;
    const x = xAt(i), y = surf[i] + (q - 0.2) * 24;
    const s = q < 0.05 ? 2 + q * 44 : 1 + q * 2;
    gctx.fillStyle = hexA(q < 0.2 ? SOIL.k : SOIL.l, 0.3 + q);
    gctx.fillRect(x + q * 4, y, s, s * 0.8);
  }
}

/* ------------------------------------------------------------------ the sky

   06 item 4, and Dustin's second ask of 2026-08-08: "we're probably also going to have to come
   up with a realistic background that changes based on the time."

   THIS IS THE LIGHT, NOT A NEW GROUND. 13 froze the earth and put the dated colour system in the
   light. The backdrop is the air ABOVE the ground line — a different surface — and nothing here
   touches one pixel of the earth below it, which is gated (`ground_never_dates`). The other two
   readings were ruled out rather than chosen against: a depicted scene behind the objects needs
   generated or modern-illustrated imagery, which the map forbids outright, and a backdrop plate
   has an edge, which 11 forbids; and an earth that changes colour is 13's to reopen, not this
   ticket's — it would also reopen 06's own item 5, which closed precisely because the soil's
   value never changes.

   What is dated — and what makes this a light rather than a hue on a gradient — is REACH: how far
   the light people actually had got. A flame lights a few metres and the sky over it is black and
   full of stars. Gas, then arc, then filament lighting push a glow up off the horizon until the
   sky itself is the lit thing and the stars are gone. That is real, dated and measurable, and it
   is why item 6 and item 226 no longer have the same backdrop with a different tint on it.

   REACH IS A SMOOTH FUNCTION OF THE YEAR, NOT A STEP PER LAMP — deliberately. 11 warned that a
   dated backdrop asserts era boundaries and that periodization is regional; a step at 1820 would
   print "the world had gaslight in 1820" as a visual fact. A continuous curve claims only that
   artificial light got stronger over time, which is true everywhere. Nothing is written. The
   HUD's lamp name is the only disclosure and it was already there. */

const REACH_MID = 1920, REACH_W = 45;                 // the electrification decades, softened
const logistic = y => 1 / (1 + Math.exp(-(y - REACH_MID) / REACH_W));
const REACH_TOP = logistic(2030);
const reachFor = y => Math.min(1, logistic(y) / REACH_TOP);
const STAR_OUT = 0.72;                                // reach at which the last star is gone
const starAlpha = r => Math.pow(Math.max(0, 1 - r / STAR_OUT), 1.2);

/* THE BACKDROP IS CACHED, and the reason is measured. It is four large fills a frame — a
   full-canvas gradient, a star field, a radial pool and a lit band — and on a canvas Chromium has
   demoted out of GPU acceleration (which a page read this often gets) they cost 3–6ms. Drawn
   straight, the sweep's frame gate ran 21–27ms against a 25ms budget and went red once, while the
   round-8 build it replaces sat at 18.3–19.1ms in the same window.

   But every one of those fills is a pure function of (reach, the era's colour, the viewport) —
   the same property that makes the whole file scroll-driven. So it is drawn into one canvas and
   redrawn only when that key changes, and the frame pays one opaque blit. The key quantises reach
   to 1/256 and the colour to two units, which is a change of a fifth of one channel value in the
   sky: below anything a screen can show, and it takes the redraw from every frame to about one in
   five. This is a cache of a pure function, not an easing or a smoothing — the value drawn at a
   scroll position is the value that position asks for, which is what `backdrop_is_scroll_only`
   is standing there to check. */
const bcvs = document.createElement('canvas');
const bctx = bcvs.getContext('2d');
let bkey = '';

/* The stars, drawn straight into the backdrop. Deterministic and completely still: there is no
   wall clock in this file and a twinkle would be one. */
function drawStars(c, alpha) {
  const r = rng(4711), gy = groundY();
  const n = Math.round(W * gy / 2900);                // ~320 at 1440×900, ~70 on a phone
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * gy, q = r(), t = r();
    // thinner and dimmer toward the horizon, the way real atmosphere takes them
    const alt = 1 - y / gy;
    if (alt < 0.12 && q > alt * 3) continue;
    const a = (0.09 + q * q * q * 0.60) * (0.34 + alt * 0.66) * alpha;
    const s = q > 0.988 ? 1.7 : q > 0.90 ? 1.2 : 1;
    const col = t < 0.15 ? [255, 226, 190] : t < 0.29 ? [206, 222, 255] : [244, 246, 252];
    c.fillStyle = `rgba(${col.join(',')},${a.toFixed(3)})`;
    c.fillRect(x, y, s, s);
  }
}

/* TICKET 03 — the two numbers that decide how many pixels this page may ever hold.

   Every sprite is drawn DRAW_H CSS px tall, at every viewport and on every device; the canvas is
   rasterised at DPR_CAP density at most. Their product, 264 device px, is therefore the largest
   height any photograph is ever put on a screen at, at any zoom. A source row above that is
   fetched, decoded, held for the life of the page, and then discarded by the resampler on its
   way to the glass. `bake_sprites.py` caps the shipped files at exactly this product and the
   sweep asserts the relationship, so moving either number here without re-baking is a red gate
   rather than a silent 300 MB. */
const DRAW_H = 132;
const DPR_CAP = 2;

let wasNarrow = false;
function fit() {
  W = innerWidth; H = innerHeight;
  dpr = Math.min(devicePixelRatio, DPR_CAP);
  cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  bakeSurface();
  bakeGround();
  bkey = '';                                          // the backdrop is sized to the viewport too
  const flip = wasNarrow !== (W < 720);
  wasNarrow = W < 720;
  for (const d of drops) {
    /* re-settle onto the new land. Round 9: clearing `rest` is no longer enough, because a pose is
       now the count of steps taken from a birth and that count was reached against the OLD
       surface. Every generation goes back to its birth and the next frame re-runs it; `restN` goes
       with it, or the field would be pinned to a rest position on a contour that no longer exists. */
    if (d.gens) for (const G of d.gens) { rewindPieces(G.pieces); G.n = 0; G.restN = null; }
    if (d.dust) { rewindDust(d.dust); d.dustN = 0; d.dustRest = null; }
    if (!d.down) d.prepped = false;               // the landing solve is against a surface that moved
    if (d.atoms) { if (flip) rebuild(d); else d.laid = false; }
  }
  /* The shelf wraps against the viewport, so it is laid out again — but only once it exists;
     fit() runs during module init, before there is a TOTAL to hang it under. The spacer is
     re-set here too: its height is a function of innerHeight, so a resize that did not move it
     would leave the piece's own runway and the shelf's top disagreeing about where TOTAL is. */
  if (indexBuilt) { setSpacer(); INDEX.build(indexTop()); }
}
let indexBuilt = false;

/* ------------------------------------------------------------------ the objects */

const labelLayer = document.getElementById('labels');
/* one shared empty, so "this object has no fragments right now" costs no allocation and no branch
   at any of the six places that read `d.pieces`. Never written to. */
const NONE = [];
const drops = ITEMS.map((it, i) => ({
  it, im: null, i, ar: 1, light: lightFor(it.y), loading: null,
  /* the fall, as pure scroll geometry. prepped once; t is where the scrollbar is inside it. */
  prepped: false, t: -1, air: false,
  x: 0, w: 0, h: 0, a0: 0, spin: 0, ySpawn: 0, yLand: 0, dxLow: 0,
  down: false, px: 0, py: 0, angle: 0, landScroll: 0, age: 0, splits: 0,
  /* the wreck. `built` says it exists; `gens` holds every generation of it, each with the pose it
     was born in, so a scroll-up rewinds rather than re-cuts. `pieces` is whichever generation the
     scrollbar is currently inside — a reference, re-pointed each frame, so everything downstream
     that reads `d.pieces` keeps reading the one true answer. */
  built: false, gens: null, stage: null, queued: false, pieces: NONE, specks: NONE, speckSet: null, dust: null,
  dustN: 0, dustRest: null, dusted: false, credX: 0, gone: false,
  /* the words. Built on the way down, taken apart on the ground, removed at death. */
  atoms: null, cred: null, srEl: null, laid: false, blown: false, tie: null, slot: null
}));

/* PAINT ORDER IS DOM ORDER, SO DOM ORDER HAS TO BE A FUNCTION OF THE INDEX. The words used to be
   appended straight to the layer as each object built them, which was in index order for as long
   as the only way to reach an object was to scroll down to it. Under the rewind the window
   re-admits arrivals NEWEST-first, so the same six citations came back in the opposite order and
   the layer painted them in it.

   Nothing overlapped — the collision contract held — but the glyphs still rasterised differently
   against what was behind them, and two walks to the same scroll position produced screenshots
   that differed on 27,817 pixels by one unit each. That is invisible and it is still a page whose
   pixels depend on the route taken, which is the whole of ruling 8b. One static slot per arrival,
   made once and never moved: the layer's order is now the set's order, whatever the visitor did.
   The slots are `div`s so that `#labels span` — what the collision gate walks — is unaffected. */
for (const d of drops) {
  d.slot = document.createElement('div');
  labelLayer.appendChild(d.slot);
}

const queue = [];                                   // deferred cutting, so a split never drops a frame

/* ------------------------------------------------------------------ the texture window

   TICKET 03, the second half. Capping the shipped sprite at its own draw height takes 230
   photographs from 301 MB decoded to 66 MB, which clears the 80 MB gate — but only for 230.
   A count is not a ceiling: 01 put the set at 200–400, and the same cap at 400 items is 114 MB
   and over. So residency is bounded instead of the number being small.

   A sprite is read in exactly three places and all three sit inside one arrival: prep() solves
   the landing height off its silhouette, the fall draws it, and land() cuts it into fragments.
   After the impact the object's pixels live in its own fragment canvases and the photograph is
   never touched again — `d.im` is dead the instant it has been shattered. Before its start it is
   not needed either. So the resident set is the handful of arrivals in flight, whatever N is.

   ONE INVARIANT HOLDS THIS UP: no pixels, no fall. prep() solves the exact height of contact
   from the real outline, so an object prepped from its bounding box would land somewhere else —
   and then the same scroll position would draw two different frames depending on what had
   finished loading. An arrival whose sprite has not arrived is therefore in exactly the state it
   is in above its own start: not here yet. It falls when its pixels do, from the same tables,
   onto the same latched landing position. */

const AHEAD = 4000;                // px of scroll a sprite is fetched ahead of its own start
/* 04 ROUND 9. The window was one-ended because the piece was: an object was finished the moment
   its life ran out and nothing could ever ask for it again. The rewind makes the scrollbar able to
   walk back into a life that has already ended, so the window gets the matching end — a wreck and
   its photograph are kept for BACK px past the object's own death, and only beyond that is it
   taken apart. Beyond it the rebuild is exact rather than remembered, because every cut is seeded.
   Named beside AHEAD and equal to it on purpose: ruling 8a costed a 4,000px SYMMETRIC window at
   7.7MB against an 80MB gate, and the bound must stay a window — unbounded residency is 65.8MB at
   230 items and 114.4MB at 400, which is over. */
const BACK = 4000;                 // …and how far past its own death it is kept
let inFlight = 0, solvedBlind = 0, peakHeld = 0;

function want(d) {
  if (d.im || d.loading) return d.loading;
  inFlight++;
  const im = new Image();
  im.decoding = 'async';
  im.src = `img/${d.it.k}.webp`;
  /* decode() rather than onload: the first draw of an undecoded image blocks the frame it lands
     on, which is the one frame in this object's life that is already the busiest. */
  const settle = ok => {
    inFlight--; d.loading = null;
    /* ROUND 9: `built`, not `down`. `down` is now a predicate on the scrollbar, so it is already
       true for an arrival whose photograph is still in flight — the exact arrival this callback
       exists to serve. Dropping it here would leave the object permanently unbuilt. What is still
       thrown away is a photograph whose wreck has already been cut, or one for an object the
       window has since demolished. */
    if (!ok || d.built) return;
    d.im = im; d.ar = im.naturalWidth / im.naturalHeight;
  };
  d.loading = (im.decode ? im.decode() : new Promise((res, rej) => { im.onload = res; im.onerror = rej; }))
    .then(() => settle(true), () => settle(false));
  return d.loading;
}

function release(d) {
  if (!d.im) return;
  d.im.removeAttribute('src');                   // hand the decoded buffer back, not just the ref
  d.im = null;
}

/* Which sprites may be resident at this scroll position. An arrival that is going to be retired
   unfallen — the whole page above a scrollbar drag — is never fetched at all, which is why a
   jump costs the seven landings it shows and not the two hundred it passed. */
function texture(y) {
  let held = 0, px = 0;
  for (const d of drops) {
    /* 14 — the last object has no life to run out, so the upper bound does not apply to it.
       This was found by the ending simply never happening: the window released its photograph
       at `rel - FALL >= LIFE`, "no pixels, no fall" then held it in the air, and the piece ended
       on an object that was still falling. It costs nothing — the release on `d.built` below
       fires the instant it lands, exactly as it does for the other 229. */
    const rel = y - START[d.i];
    if (!(rel > -AHEAD && (d.i === LAST || rel - FALL < LIFE[d.i] + BACK))) {
      release(d); demolish(d);                     // out of the window at either end
    } else if (d.built) {
      /* its pixels live in its fragment canvases now and the photograph is spent. ROUND 9 MOVED
         THIS OFF `d.down` AND ONTO THE WRECK, which is the thing that actually holds the pixels.
         `down` is a predicate on the scrollbar now: it is already true of an arrival whose sprite
         is still in flight, and releasing on it dropped the sprite the landing was waiting for.
         Keying on the wreck also gets the two hard cases right for free — an object back in the
         air has no wreck, so it is re-fetched rather than falling invisibly, and an object the
         window has re-admitted on a scroll-up has no wreck either, so its photograph arrives in
         time to rebuild one. */
      release(d);
    } else want(d);
    /* counted over EVERY drop still holding a reference, not only the ones this frame meant to
       keep. The first version tallied inside the branch above and skipped anything already down,
       so a release that had quietly stopped working read as a flat 15MB while the page sat on all
       230 photographs — the counter agreed with the intention instead of measuring the holdings.
       The leak gate caught it; this is what it is now allowed to see. */
    if (d.im) { held++; px += d.im.naturalWidth * d.im.naturalHeight; }
  }
  if (px > peakHeld) peakHeld = px;
  return held;
}

/* ------------------------------------------------------------------ the scroll budget

   Every number here is a distance. There is not a millisecond anywhere in the mechanic.

   ROUND SEVEN. 13's two spacing constants — 1,000px per arrival and a 4,200px decay life — were
   both uniform, and that is what produced a 235,100px scroll and a deep head costing exactly as
   much wheel per item as the crowded present while having nothing on the ground to look at.

   Both become functions of one quantity: `co`, how many things were already standing when this
   one arrived — items within W_YEARS behind it. That number is 0–3 through the deep head and
   saturates by the Roman era, so the head and the body differ everywhere without a boundary
   between them. Nothing is announced. Same rule, all the way down.

     the fall     constant. The era may not change how heavy a thing is.
     the beat     grows with `co` — the pause after impact is for reading the ground, and an
                  empty ground needs no pause.
     the life     is the contemporary window itself: an object stays on the ground until the
                  counter has moved W_YEARS past its own date. So what is lying on the ground at
                  any scroll position is, within the clamps below, exactly the set of things that
                  were standing within eighty years of each other. That is 01's ambient engine —
                  not a caption about co-occurrence, the ground IS the co-occurrence.

   The two clamps are honest compromises and are named as such: LIFE_MIN keeps a lone object
   around long enough for the break to read, and LIFE_MAX caps how much can be on the ground at
   once, for the credit-collision contract and for memory. Inside the clamps the ground is true;
   at the clamps it is bounded. */

const W_YEARS  = 80;                                // "standing at the same time", in years
const FALL     = 460;                               // px the fall spends — constant everywhere
const BEAT_MIN = 60;                                // beat after impact on an empty ground
const BEAT_MAX = 200;                               // …and on a crowded one
const BEAT_AT  = 5;                                 // `co` at which the beat is fully open
const LIFE_MIN = 1400;                              // floor: the break has to be readable
const LIFE_MAX = 4200;                              // ceiling: 13's number, now the cap not the rule
const SPLITS = REDUCED ? [0.34] : [0.30, 0.56];
const DUST_AT = REDUCED ? 0.62 : 0.76;

/* Everything about where an arrival sits is solved here, once, from the dates alone. The whole
   page is a lookup into these four arrays, so a scroll position resolves to the same frame no
   matter how the visitor got there. */
const N = ITEMS.length;
const CO = new Int32Array(N), PER = new Float64Array(N);
const START = new Float64Array(N), LAND = new Float64Array(N), LIFE = new Float64Array(N);
{
  let lo = 0;
  for (let i = 0; i < N; i++) {
    while (ITEMS[i].y - ITEMS[lo].y > W_YEARS) lo++;   // both sorted, so this only moves forward
    CO[i] = i - lo;
    PER[i] = FALL + BEAT_MIN + (BEAT_MAX - BEAT_MIN) * Math.min(1, CO[i] / BEAT_AT);
  }
  for (let i = 1; i < N; i++) START[i] = START[i - 1] + PER[i - 1];
  for (let i = 0; i < N; i++) LAND[i] = START[i] + FALL;
  for (let i = 0; i < N; i++) {
    let end = START[N - 1] + PER[N - 1];
    for (let j = i + 1; j < N; j++) if (ITEMS[j].y > ITEMS[i].y + W_YEARS) { end = LAND[j]; break; }
    LIFE[i] = Math.max(LIFE_MIN, Math.min(LIFE_MAX, end - LAND[i]));
  }
}
const TOTAL = START[N - 1] + PER[N - 1] + LIFE[N - 1];

/* ---- TICKET 14, THE ENDING. The last object never breaks. ----

   Every one of the 229 before it falls, shatters, breaks twice more and goes under the earth. This
   one falls and then does nothing: no cut, no splits, no dust, and its name and its citation stay
   whole for as long as it is on the screen.

   It is not a reversal of 13's one-way decay — nothing here is un-broken, and scrolling back still
   shows a broken thing broken. It is the ABSENCE of decay, which is the only true thing to say
   about an object made four years ago: the piece's subject is time taking things, and this is the
   one it has not taken. That is also why it is not a finale (01) — no crescendo, no reveal, no new
   grammar. It is the existing grammar declining to fire once, which is the one shape change a
   treatment repeated 230 times can still make (12).

   Seven places in this file know about it, and they are all guarded on this one index. Nothing else
   in the piece is special-cased, and `only_the_last_one_survives` gates that the exempt set is
   exactly {LAST} — "the last one is different" is otherwise a hole any later defect walks through. */
const LAST = N - 1;
const idxAt = s => {                                 // which arrival owns this scroll position
  let a = 0, b = N - 1;
  while (a < b) { const m = (a + b + 1) >> 1; if (START[m] <= s) a = m; else b = m - 1; }
  return a;
};

/* ------------------------------------------------------------------ the tie

   01's engine, stated: "every item surfaces what else was standing at that moment, and by how
   much they miss each other." The ground already carries the first half. This is the second — one
   line laid on the soil between an arrival and the thing it landed next to.

   The partner is chosen from the tables, not from what happens to be alive at the time, so a
   scrollbar drag and a slow scroll pick the same one. Preference is for a DIFFERENT REGION —
   two pots from the same workshop being contemporaries is not a surprise, a Benin plaque and a
   Dutch flintlock is — then for the smallest miss. If nothing was standing there, nothing is
   drawn, which is the whole of the deep head and is the point. */
const TIE = new Int32Array(N).fill(-1);
for (let i = 0; i < N; i++) {
  let best = -1, bestGap = Infinity, bestCross = false;
  for (let j = i - 1; j >= 0; j--) {
    const gap = ITEMS[i].y - ITEMS[j].y;
    if (gap > W_YEARS) break;
    if (LAND[i] - LAND[j] >= LIFE[j]) continue;      // already gone from the ground by then
    const cross = ITEMS[j].b !== ITEMS[i].b;
    if ((cross && !bestCross) || (cross === bestCross && gap < bestGap)) {
      best = j; bestGap = gap; bestCross = cross;
    }
  }
  TIE[i] = best;
}

/* The arc. Not a simulation of gravity — a curve shaped like one. A straight line reads as a
   lift descending; pure t² spends so long easing out of the top edge that the object is barely
   on screen for half its budget. This starts moving immediately and is still accelerating hard
   when it arrives, which is the part of a fall the eye actually reads as weight. */
const ENTER = 0.30, TAIL = 2.6;
const arc = t => ENTER * t + (1 - ENTER) * Math.pow(t, TAIL);

/* One impact speed for every object, because the fall is now geometry rather than a simulation:
   nothing about how fast the visitor scrolled may change how hard a thing breaks, or the same
   scroll position would not look the same twice. Roughly what the old solver delivered. */
const IMPACT = 12;

/* Debris still has to settle somewhere, and settling takes integration. It is fed SCROLL, not
   time: this many ms of shard flight per px of downward scroll. A shard therefore comes to rest
   over ~110px of scroll, and freezes mid-air the instant the visitor stops.

   ROUND 9 MADE SUB A QUANTUM RATHER THAN A CEILING, and that is what turns the debris into a
   lookup. It used to be the largest step the integrator would take, with the actual step being
   whatever the frame's own scroll delta came to — so a shard's trajectory depended on how fast
   the visitor was moving, and the same scroll position genuinely did not look the same twice. A
   pose is now a whole number of SUB steps from the generation's birth, which is a function of the
   scrollbar alone. `MAX_STEP` went with the change: it capped how much debris one frame would
   advance, and nothing is advanced per frame any more. */
const MS_PER_PX = 3.0;
const SUB = 50;                                     // ms of shard flight in one step — the quantum

let live = 0;
let lightRGB = [255, 122, 26];
let reach = 0;                                        // how far the light of the age gets, 0..1

/* TICKET 10 — THE QUIET STOP, and it costs one screen.

   The piece's runway has always been `TOTAL + 100lvh`: the last object's life ends at TOTAL and
   the extra screen is what lets the scrollbar get there. The shelf is the next thing in the
   document flow, so with that runway alone its first row would rise into the viewport at exactly
   scrollY = TOTAL — the same pixel the last object dies on, with nowhere for the piece to go out.

   So there is a SECOND screen between them, and it is the stop itself: the last thing breaks, the
   piece goes out over the screen that follows, and then there is one screen of nothing before the
   shelf. 01 asked for a quiet stop rather than a finale, and a screen of dark ground is what one
   is. */
const spacerEl = document.getElementById('spacer');
const setSpacer = () => { spacerEl.style.height = (TOTAL + innerHeight * 2) + 'px'; };
const indexTop = () => TOTAL + innerHeight * 2;

fit();
addEventListener('resize', fit);
setSpacer();

/* Reached by this same scrollbar and by nothing else: no route, no click, no transition to wait
   on. The whole layout is built here, out of the baked thumbnail dimensions, before a single
   photograph of it is fetched. */
INDEX.build(indexTop());
indexBuilt = true;
const glEl = document.getElementById('gl'), hudEl = document.getElementById('hud');
const markEl = document.getElementById('mark');    // 14 — the signature, on the piece
/* 07 — the intro's own words, and the hint. Furniture, like the signature, and the only furniture
   on this page that is BIG. The INK is held rather than `#intro`, which carries 8vh of bottom
   padding and up to 60px at its sides; reserving that box would push citations out of soil they
   never touched. */
const introEl = document.getElementById('intro');
const introInk = [introEl.querySelector('h1'), document.getElementById('introp')];
const hintEl = document.getElementById('hint');
/* fadeIntro writes the opacity as an inline style; before its first frame there is none, and the
   stylesheet's value is what is on screen. `|| default` cannot be used — a faded-out "0" is falsy
   and would restore the reservation exactly when the words are gone. */
const styleO = (el, dflt) => (el.style.opacity === '' ? dflt : parseFloat(el.style.opacity));
const MARK_REST = 0.7;                             // its resting opacity, from the stylesheet
let faded = -1;

/* The overlay used to wait on all 230 photographs, because all 230 were fetched before the first
   frame existed. It now waits on the ones the first screen can actually use — everything the
   texture window would want at scroll 0 — and the rest arrive ahead of the scrollbar. */
await Promise.all(drops.filter(d => START[d.i] < AHEAD).map(want));
done();

/* ------------------------------------------------------------------ the fall, solved once

   Nothing about an arrival is discovered during the fall. Its x, its tumble, the exact angle it
   will be at when it arrives, and therefore the exact height at which its real silhouette meets
   the real surface, are all fixed before it appears. Contact then happens at t = 1 and nowhere
   else, which is what makes the landing scroll position exact rather than emergent. */

function prep(d) {
  /* The tripwire under the texture window's one invariant. Solving this without the photograph
     means solving it against a bounding box, which puts the object down at a different height —
     so the same scroll position would draw two frames depending on what had loaded. The caller
     already refuses to get here; this counts the day it stops. */
  if (!d.im) { solvedBlind++; return; }
  const i = d.i, hh = DRAW_H;
  d.w = hh * d.ar; d.h = hh;
  d.x = W * (0.18 + 0.64 * ((i * 0.618034) % 1));
  d.a0 = (hash(d.it.k, 7) - 0.5) * 0.34;            // deterministic: a reload looks identical
  d.spin = (hash(d.it.k, 21) - 0.5) * 0.5;          // the whole tumble, over the whole fall
  d.ySpawn = -d.h * 0.62;

  /* restProfile sampled unrotated gives the sprite's TRUE outline, not its box. Rotated by the
     angle it will land at, the lowest of those points is the corner that actually touches. */
  let hull = [[0, d.h / 2]];
  if (d.im) {
    const p = restProfile(d.im, d.w, d.h, 0, Math.max(4, d.w / 12));
    const pts = [];
    for (let ci = 0; ci < p.n; ci++) {
      if (Number.isNaN(p.bot[ci])) continue;
      pts.push([p.ox + ci * p.colW + p.colW / 2, p.oy + p.bot[ci]]);
    }
    if (pts.length) hull = pts;
  }
  const a1 = d.a0 + d.spin, c = Math.cos(a1), s = Math.sin(a1);
  let bestY = -Infinity, bestX = 0;
  for (const [lx, ly] of hull) {
    const y = lx * s + ly * c;
    if (y > bestY) { bestY = y; bestX = lx * c - ly * s; }
  }
  d.dxLow = bestX;
  d.yLand = surfAt(d.x + bestX) - bestY;            // centre height at the instant of contact
  d.prepped = true;
}

const toWorld = (d, lx, ly) => {
  const c = Math.cos(d.angle), s = Math.sin(d.angle);
  const x = lx - d.w / 2, y = ly - d.h / 2;
  return [d.px + x * c - y * s, d.py + x * s + y * c];
};

/* ------------------------------------------------------------------ impact

   ROUND 9 STRUCK THE ONE IRREVERSIBLE LINE IN THIS FILE. It used to read: everything above is a
   position and runs both ways, everything below happened. It does not any more — this builds the
   wreck, and building it is a pure function of the arrival's index, so `demolish` can throw the
   whole thing away and this can put back something byte-for-byte identical. What it is NOT is a
   thing that happens once: it is the constructor for a state the tables already imply. */

function land(d) {
  /* NO PIXELS, NO FALL (03) — restated here as a guard rather than left to the caller. The old
     version set its flags first and cut only `if (d.im)`, which was harmless while `down` latched
     and is not now: an object marked built with nothing in it would never be fetched again, and
     the window would have quietly deleted it from the page. */
  if (!d.im) return;
  d.built = true;
  d.angle = d.a0 + d.spin;
  d.px = d.x; d.py = d.yLand;
  d.landScroll = LAND[d.i];                         // exact, not observed
  const cx = d.x + d.dxLow, cy = surfAt(cx);

  /* seeded off the index and off nothing else — see burial.js. The two impact sprays and the
     breath get their own streams so that changing the count of one never shifts the others. */
  if (!REDUCED) {
    const n = Math.min(34, 14 + Math.round(IMPACT * 1.6));
    d.dust = stampDust([
      ...impactDust(cx - d.w * 0.28, cy, n, SOIL, d.i * 7717 + 1),
      ...impactDust(cx + d.w * 0.28, cy, n, SOIL, d.i * 7717 + 2),
      ...breathDust(cx, cy, 12, SOIL, d.i * 7717 + 3)
    ]);
    d.dustN = 0; d.dustRest = null;
  }

  d.blown = d.i !== LAST;                            // the name and date break; see `place()`
                                                     // — except the last one's, which never does
  d.credX = Math.max(W * 0.15, Math.min(W * 0.85, cx));

  /* THE RELATION COMES FROM THE TABLES; WHETHER IT IS DRAWN IS A PREDICATE. Round 7 armed the tie
     here only if the partner was already down, on the rule that nothing is asserted about a thing
     that never fell — and that was a latch taken at build time, so it depended on the ORDER the
     two ends were built in. Walking down, partners build oldest-first and the tie arms. Walking
     up, the window re-admits arrivals NEWEST-first, so every tie found its partner missing and
     five of them silently stopped existing. Round 10's no-overtaking defect, arriving through the
     door the rewind opened.

     So the relation is unconditional and `tieLive` at draw time carries the ruling instead: both
     ends have to be built and on the ground for the line to appear, and it is re-decided every
     frame rather than once. A jump still asserts nothing about a thing that never fell. */
  const j = TIE[d.i];
  d.tie = j >= 0 ? { j, gap: d.it.y - ITEMS[j].y, on: false } : null;

  /* generation zero. Everything after it is cut from it, and every generation keeps the pose it
     was born in — see `poseTo`. */
  d.gens = [{ pieces: [], born: LAND[d.i], n: 0, restN: null }]; d.stage = null;
  if (d.i === LAST) keepWhole(d); else shatterNow(d, cx, cy, IMPACT);
  d.pieces = d.gens[0].pieces;
}

/* The window took the wreck out of range, at either end. Nothing here is remembered, because
   nothing here has to be: `land()` rebuilds all of it from the index and the tables. This is the
   only place a fragment canvas is ever dropped, and it is what keeps the rewind a WINDOW rather
   than a page's worth of retained debris. */
function demolish(d) {
  if (!d.built) return;
  d.built = false;
  d.gens = null; d.stage = null; d.pieces = NONE; d.specks = NONE; d.speckSet = null;
  d.dust = null; d.dustN = 0; d.dustRest = null;
  d.tie = null; d.splits = 0; d.dusted = false;
  unbuild(d);
}

/* THE ENDING (14). Cut as ONE piece and left standing exactly where it landed.

   Not "skip the cut". Both the draw path and 03's memory rule key off `d.pieces`: `release(d)`
   drops the photograph the instant the object is down, so an object that keeps no fragment keeps
   nothing to draw and would vanish at the moment it arrived. One fragment is the same pipeline,
   the same bound, and pixel-coincident with the sprite it replaces — the piece is placed from the
   sprite's own centre, exactly as `shatterNow` places its thirteen.

   `rest` is set here rather than earned by falling: there is no velocity to settle and no bounce
   to spend. */
function keepWhole(d) {
  const p = cutPiece(d.im, d.w, d.h, [[0, 0], [d.w, 0], [d.w, d.h], [0, d.h]]);
  if (!p) return;
  const [wx, wy] = toWorld(d, p.cx + d.w / 2, p.cy + d.h / 2);
  const pc = makePiece(p, wx, wy, 0, 0, 0, d.angle);
  pc.rest = true;
  /* Bedded into the surface, not perched on it — `shatterNow` states that rule for every shard and
     it applies here for the first time to a whole object. The landing solve is exact: it puts the
     lowest point of the silhouette ON the contour at the contact point, which is right for a thing
     that is about to break and wrong for a thing that is going to stand there. Exact contact at a
     single point, with no shard and no shadow under it, reads as hovering — the frames showed a
     car apparently floating over the soil. Three pixels is the shards' own floor. */
  pc.sink = 3;
  pc.y += pc.sink;
  stamp(pc);                                         // bedded BEFORE its birth is recorded
  d.gens[0].pieces.push(pc);
  d.gens[0].restN = 0;                               // nothing to settle: it is already at rest
}

/* everything separates at once, on straight brittle edges */
function shatterNow(d, cx, cy, speed) {
  const n = REDUCED ? 8 : 13;
  const cells = voronoi(d.w, d.h, sites(d.w, d.h, n, d.i * 131 + 7));
  const r = rng(d.i * 37 + 3);
  for (const cell of cells) {
    const p = cutPiece(d.im, d.w, d.h, cell.poly);
    if (!p) continue;
    const [wx, wy] = toWorld(d, p.cx + d.w / 2, p.cy + d.h / 2);
    const away = wx - cx;
    const pc = makePiece(p, wx, wy,
      away * 1.7 + (r() - 0.5) * 80,
      -30 - r() * 70 - speed * 6,
      (r() - 0.5) * 4, d.angle);
    pc.sink = 2 + r() * 6;                           // it beds INTO the surface, it does not perch on it
    d.gens[0].pieces.push(pc);
  }
}

/* ------------------------------------------------------------------ breaking down

   Cutting is the only expensive thing in the frame, so every cut goes through a queue and gets a
   time budget. A split of 40 pieces spreads over three frames and never shows. */

function splitPiece(d, p, seed) {
  const cells = voronoi(p.w, p.h, sites(p.w, p.h, 3, seed));
  const r = rng(seed + 17);
  const out = [];
  for (const cell of cells) {
    const q = cutPiece(p.cv, p.w, p.h, cell.poly);
    if (!q) continue;
    const c = Math.cos(p.rot), s = Math.sin(p.rot);
    // children push away from their parent, so the field spreads as it breaks down instead of
    // becoming a denser and denser heap in exactly the same footprint
    const np = makePiece(q, p.x + q.cx * c - q.cy * s, p.y + q.cx * s + q.cy * c,
      q.cx * 2.4 + (r() - 0.5) * 36, -6 - r() * 20, (r() - 0.5) * 1.6, p.rot);
    np.sink = 1.5 + r() * 5;
    out.push(np);
  }
  return out.length ? out : null;
}

/* The last visible state of a real photograph. A piece resting in the surface is already half
   under it, so specks are spawned a little PROUD of where the piece sat — otherwise the ground
   swallows the dust the instant it exists and the final beat never happens. */
function toSpecks(d, p, seed) {
  const col = avgColor(p.cv);
  if (!col) return;
  const r = rng(seed);
  const n = Math.max(3, Math.min(9, Math.round(p.w * p.h / 26)));
  for (let k = 0; k < n; k++) {
    d.speckSet.push({
      x: p.x + (r() - 0.5) * p.w * 1.5,
      y: p.y - p.h * 0.45 + (r() - 0.5) * p.h * 0.6,
      depth: 10 + r() * 26, drift: (r() - 0.5) * 26,
      r: 1 + r() * 1.6, col, t0: DUST_AT
    });
  }
}

/* ------------------------------------------------------------------ the break, as a lookup

   RULING 8b. The generation drawn is read off `age`, the pose is read off the scroll distance
   since that generation was born, and neither of them asks what frame it is or how the visitor
   got here. What used to live here was `advance()`: a one-way walk that pushed cut jobs onto the
   4ms queue as `age` crossed each split. Three things were wrong with it under the new ruling and
   only the third was obvious — it could not run backwards; it left `d.splits` and `d.dusted` as
   latches; and THE QUEUE DECIDED WHAT WAS DRAWN, because whether a field had split yet depended
   on how much budget the frame had left. Two walks over the same page disagreed about how many
   objects were carrying fragments, which is how that last one was finally seen. */

const genBorn = (i, g) => LAND[i] + (g > 0 ? SPLITS[g - 1] * LIFE[i] : 0);
const genAt = age => { let g = 0; while (g < SPLITS.length && age >= SPLITS[g]) g++; return g; };

/* A shard rests once and then rests forever, so the first step at which the whole field has
   stopped is recorded and the pose above it is a constant. This is what makes the rewind free:
   measured before it was built, replaying every live object from birth on every frame is p95
   22.4ms on a 6x-throttled CPU and 0.2ms with this. REST_CAP is a termination guard and nothing
   else — a field settles in about eleven steps and the cap is two hundred. */
const REST_CAP = 200;

/* THE CUTTING BUDGET, and the slice inside it. Both are frame-cost numbers rather than mechanic
   numbers — they decide how long the page takes to get somewhere, never what it draws when it
   arrives. Measured against the shipped build on the same machine in the same window: HEAD runs a
   17.9ms p95 and the first round-9 build ran 26.1ms against a 25ms ceiling, because publishing a
   generation whole means the cut can no longer be hidden behind a half-broken object. Lowering the
   budget is what buys that back, and it is affordable because the cut now starts at the landing
   instead of at the split — there is far more runway to spend it over. */
const CUT_MS = 2.5;                                 // ms of cutting a frame may spend
const SLICE_MS = 0.6;                               // …and the most one job may overrun it by

function poseTo(G, want) {
  if (G.restN != null && want > G.restN) want = G.restN;
  if (want === G.n) return;
  if (want < G.n) { rewindPieces(G.pieces); G.n = 0; }   // the scroll ran back: start from birth
  while (G.n < want && G.n < REST_CAP) {
    stepPieces(G.pieces, SUB, surfAt);
    G.n++;
    if (G.restN == null && G.pieces.every(p => p.rest)) { G.restN = G.n; break; }
  }
  if (G.restN == null && G.n >= REST_CAP) G.restN = G.n;
}

const settleGen = G => poseTo(G, G.restN != null ? G.restN : REST_CAP);

/* Generation g is cut from generation g-1 AT REST. That is not a convenience: a split happens at
   0.30 of a life, which is at least 420px of scroll after the parent landed, and a parent settles
   inside 110px — so at rest is where the parent has always been when it broke. Pinning it makes
   the child's birth position a function of the tables instead of a function of when the cut ran. */
/* CUT A FEW PARENTS AT A TIME, PUBLISH THE GENERATION WHOLE. Cutting is the only expensive thing
   in the frame — the profile is `getImageData`, `trim` and `getContext`, all of it in here — and
   the old build hid that by queueing one job PER PIECE, so the budget could stop half way and the
   object was drawn as a mixture of parents and children. That is the "same age draws two different
   generations" defect 8b outlaws, so the mixture is no longer available as a way to be cheap.

   What replaces it: the work is sliced across frames exactly as before, but into a STAGING array
   that nothing draws from. `d.gens` only ever gains a generation that is complete, so what is on
   screen is still `genAt(age)` and nothing else. `ms < 0` means finish it now — the path taken when
   the scrollbar has arrived at a generation the queue has not reached yet, which is a frame that is
   late rather than a frame that lies.

   `settleGen` at the top of every slice, not just the first: a parent's pose is rewound whenever
   its object goes off screen, and children cut from a rewound parent would be born in mid-air. */
function stepBuild(d, ms) {
  const t0 = performance.now();
  while (d.gens.length <= SPLITS.length) {
    const at = d.gens.length - 1, from = d.gens[at];
    settleGen(from);
    if (!d.stage || d.stage.at !== at) d.stage = { at, k: 0, out: [] };
    const st = d.stage;
    while (st.k < from.pieces.length) {
      const kids = splitPiece(d, from.pieces[st.k], d.i * 999 + at * 71 + st.k);
      /* a piece too small to break again survives whole, rather than vanishing. The old queue did
         the same by leaving it in place when `splitPiece` returned null. */
      if (kids) st.out.push(...kids); else st.out.push(from.pieces[st.k]);
      st.k++;
      if (ms >= 0 && performance.now() - t0 > ms) return false;
    }
    d.gens.push({ pieces: st.out, born: genBorn(d.i, d.gens.length), n: 0, restN: null });
    d.stage = null;
  }
  return true;
}

/* HOW OFTEN THE SCROLLBAR ARRIVED SOMEWHERE THE QUEUE HAD NOT REACHED. Every increment is a frame
   that paid for a whole generation at once, which is the one case where ruling 8b's "the queue may
   decide when work is done" costs a dropped frame. Correctness is not negotiable — the alternative
   is drawing a generation the age does not call for — so this is a diagnostic on the SCHEDULING,
   and a walk that never trips it is a walk where the budget was never overridden. */
let lateCuts = 0;

function ensureGen(d, g) {
  if (d.gens.length <= g) lateCuts++;
  while (d.gens.length <= g) stepBuild(d, -1);
}

/* The last visible state, and it is built from the last generation's SETTLED pose — so the specks
   sit where the fragments actually came to rest, whatever route the scrollbar took to get here.

   BUILT ONCE AND KEPT, then shown or hidden. The first version rebuilt them every time `age` came
   back down past DUST_AT and dropped them every time it went up, which is correct and expensive:
   `toSpecks` calls `avgColor`, and `avgColor` is a `getImageData` per fragment — a hundred and
   twelve of them on one object. Scrubbing across the end of a life is exactly what the rewind
   invites, so the one operation in the wreck that reads pixels must not be on that path. */
function ensureSpecks(d) {
  if (d.speckSet) return;
  ensureGen(d, SPLITS.length);
  const G = d.gens[SPLITS.length];
  settleGen(G);
  d.speckSet = [];
  G.pieces.forEach((p, k) => toSpecks(d, p, d.i * 131 + k));
}

/* Nothing of the wreck is on screen at this scroll position. The wreck itself is untouched — it
   is kept until the window demolishes it — but every readout goes back to what it says before the
   object landed, because a stale one is a claim about the page that is not true. Round 9 found
   both halves of that the same way: `pieces` still pointing at a generation drew a falling
   photograph through its own fragments, and `splits` still reading 2 told the sweep an object
   above its own start had broken twice. */
function blank(d) {
  d.pieces = NONE; d.specks = NONE; d.splits = 0; d.dusted = false;
  /* AND THE WRECK GOES BACK TO ITS BIRTH. The window keeps a wreck for BACK px past its object's
     death and AHEAD px above its start, so at any moment a dozen of them are retained and not
     drawn — and their poses were left wherever the last frame that DID draw them stopped. Nothing
     could see it, which is not the same as it not being there: `pure_function` compares every
     fragment of every built object and found ten to thirteen of them differing by route. A cache
     whose contents depend on how the visitor arrived is the thing this round exists to delete, so
     an object that is not on screen holds its generations at step zero. Guarded on `G.n` so it is
     a comparison and not a rewind on every frame. */
  if (d.gens) for (const G of d.gens) if (G.n) { rewindPieces(G.pieces); G.n = 0; }
  if (d.dust && d.dustN) { rewindDust(d.dust); d.dustN = 0; }
}

/* Everything an object's wreck is doing at scroll y, resolved from the tables. */
function pose(d, y) {
  const g = genAt(d.age);
  /* 14: the ending never breaks, so its generation is 0 whatever its age says. `splits` is a
     readout rather than a counter now, and a readout taken from the wrong quantity is how
     `only_the_last_one_survives` caught this: one piece, no specks — and splits reading 1. */
  d.splits = d.i === LAST ? 0 : g;
  d.dusted = d.i !== LAST && d.age >= DUST_AT;
  if (d.dusted) { ensureSpecks(d); d.pieces = NONE; d.specks = d.speckSet; }
  else {
    ensureGen(d, d.i === LAST ? 0 : g);              // 14: it never breaks, so it never leaves gen 0
    const G = d.gens[d.i === LAST ? 0 : g];
    poseTo(G, Math.max(0, Math.floor((y - G.born) * MS_PER_PX / SUB)));
    d.pieces = G.pieces;
    d.specks = NONE;                                 // back above DUST_AT: the dust re-condenses
  }
  if (d.dust) {
    let want = Math.max(0, Math.floor((y - LAND[d.i]) * MS_PER_PX / SUB));
    if (d.dustRest != null && want > d.dustRest) want = d.dustRest;
    if (want !== d.dustN) {
      if (want < d.dustN) { rewindDust(d.dust); d.dustN = 0; }
      while (d.dustN < want && d.dustN < REST_CAP) {
        stepDust(d.dust, SUB);
        d.dustN++;
        if (d.dustRest == null && d.dust.every(q => q.t >= q.life)) { d.dustRest = d.dustN; break; }
      }
      if (d.dustRest == null && d.dustN >= REST_CAP) d.dustRest = d.dustN;
    }
  }
}

/* The queue survives, and it survives as SCHEDULING AND NOTHING ELSE. Its job is to have the next
   generation cut before the scrollbar asks for it, so `ensureGen` above never has to do the work
   on the frame that needs it. If it is behind — a scrollbar drag into the middle of a life — the
   frame cuts synchronously and pays for it, because a frame that is late is a frame, and a frame
   showing the wrong generation is a lie. */
function prebuild(d) {
  /* EVERY generation, from the moment the object lands, not one ahead of where it is. Cutting 39
     fragments into 117 is the expensive one, and queueing it only once the first split has already
     happened leaves the budget about seven frames to do it in — it did not fit, `ensureGen` ran
     synchronously on the frame the split was due, and `frame_budget` went to a 27.9ms p95 against
     a 25ms ceiling. Queued at landing instead, both cuts have the whole pre-split runway. Every
     generation is kept anyway, so building them early costs nothing that is not already spent. */
  if (d.i === LAST || d.queued || d.gens.length > SPLITS.length) return;
  /* THE SLICE IS SMALL AND THE JOB RE-QUEUES ITSELF, which is not the same as a big slice. The
     frame's cutting budget is 4ms and the queue checks the clock BETWEEN jobs, so one job can only
     ever overrun by its own slice — a 3ms slice therefore put the worst frame at 4 + 3 and the p95
     at 24.9ms against a 25ms ceiling, which is not a pass, it is a coin toss. At 1ms the object
     still gets the whole 4ms if the frame has it, because finishing a slice puts the next one back
     on the queue immediately; what changes is that the overrun is a millisecond. */
  const slice = () => {
    d.queued = false;
    if (!d.built) return;
    if (!stepBuild(d, SLICE_MS)) { d.queued = true; queue.push(slice); }
  };
  d.queued = true;
  queue.push(slice);
}

/* ------------------------------------------------------------------ the words

   TICKET 06. Dustin, after round 7: "I would like the sources to shatter with the peace and not
   just stack up on the ground."

   What was there: the citation was one two-line block of DOM text parked below the ground line
   and packed into whatever row was free. Six of them at once, identical size, identical grey,
   sharing a handful of baselines behind a debris field they were attached to by nothing at all.
   A filing cabinet.

   What replaces it: THE WORD IS THE UNIT. A name, a date and a citation are all built as
   individually positioned words, because text made of one box cannot do the thing 13 asked the
   objects to do — come apart. 13's lifetime ruling is untouched and still binds: the credit
   lives exactly as long as one fragment of its object and dies with the last speck. This changes
   how the credit is CARRIED, not how long it lives.

   THE NAME. It breaks at the impact, exactly like the object does: its words are thrown up and
   out along with the shards and are gone within NAME_OUT of the object's life. Round 7 made it
   vanish instantly and named this ticket as the owner of the replacement; 13 said the name goes
   out at impact, and a break that starts at the impact is the more faithful reading of it.

   THE CREDIT. Three states, all keyed to the object's own decay and all pure functions of scroll:

     whole      one line of words, riding under the object as it falls, then lying where it fell
     level 1    at the object's FIRST split the line breaks at its separators into three groups,
                and the groups move apart across the width its own debris has reached
     level 2    at the SECOND split the groups break into single words, scattered across it

   And the whole time it decays with the thing it belongs to: the type gets smaller, the ink gets
   duller, and every word lies down on whatever slope of soil it landed on. A fresh citation is
   the brightest text on the page and a spent one is a scatter of grey a shade above the earth.
   That gradient is what stops six of them reading as a list — no two share a baseline, no two
   share a weight, and each one is as wide as its own wreckage.

   THE INK HAS A FLOOR AND IT IS MEASURED. 06 item 5 asks for legibility as a gate, not a note.
   The credit always lies on the baked earth, which is the only surface in the piece whose value
   never changes — the era's colour is a light and the light is painted BEFORE the opaque earth
   goes down over it. So the worst case is single-ended and solvable once: INK_LO is the dullest
   grey that still measures 4.5:1 against that soil, and the sweep measures it off the rendered
   pixels rather than off this comment. */

const NAME_OUT = 0.07;                 // fraction of a life over which the broken name is taken
const CRED_PX = 10.2;                  // credit type at its freshest; it only ever scales down
const CRED_LO = 0.82;                  // …to this much of it, at the end of the object's life
const INK_HI = [238, 242, 247];
const INK_LO = [188, 190, 194];        // the dullest ink that still clears the contrast gate
const TILT = 0.085;                    // ~5°, the most a word may lie over past the soil's slope
const GAPX = 5;                        // between two words of one line
const GAPP = 13;                       // …and between two parts of the citation, in place of a dot
const GAPY = 3;                        // between two rows of one citation

function chunk(text, max) {
  const words = [];
  for (const w of String(text).trim().split(/\s+/)) {
    if (!w) continue;
    // a credit is sometimes a bare URL with nothing to break on, and a 200px unbreakable word
    // is a collision box no search can step off. Split it on characters instead.
    for (let i = 0; i < w.length; i += max) words.push(w.slice(i, i + max));
  }
  const out = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out;
}

/* The citation as words. Never truncated to make it fit — all three parts are always all there,
   in order, separators included; only how many words they are set as changes. */
function credTokens(it) {
  const parts = [it.src, it.lic, shortCred(it.cred)];
  const narrow = W < 720;
  const cap = narrow ? 5 : 7;
  let out = [];
  for (const max of (narrow ? [21, 26, 32, 999] : [16, 24, 34, 999])) {
    out = [];
    parts.forEach((p, pi) => {
      for (const c of chunk(p, max)) out.push({ t: c, cls: 'c', part: pi, lead: false });
      out[out.length - chunk(p, max).length].lead = pi > 0;   // first word of a new part
    });
    if (out.length <= cap) break;
  }
  return out;
}

function build(d) {
  const it = d.it;
  const name = chunk(it.n, 14).map(t => ({ t, cls: 'n', part: -2 }));
  const date = chunk(it.disp, 14).map((t, k) => ({ t, cls: 'y', part: -1, row: k === 0 }));
  const cred = credTokens(it);
  d.atoms = [...name, ...date, ...cred];
  cred[0].row = true;                                // the citation always starts its own row
  const spot = d.light[1];
  d.atoms.forEach((a, k) => {
    const el = document.createElement('span');
    el.className = a.cls;
    el.textContent = a.t;
    el.style.opacity = '0';
    if (a.cls === 'y') el.style.color = spot;
    a.el = el;
    /* where this word ends up once the object is dust: a share of the debris field's width, off
       the strict share by a deterministic wobble so eight words never read as a ruler */
    a.jx = (hash(it.k, 300 + k) - 0.5) * 0.16;
    a.jy = hash(it.k, 400 + k) * 22;
    a.jr = (hash(it.k, 500 + k) - 0.5) * 2;
    // the impulse this word takes if it is part of the name, thrown with the shards
    a.vx = (hash(it.k, 600 + k) - 0.5) * 190;
    a.vy = -70 - hash(it.k, 700 + k) * 90;
    a.vr = (hash(it.k, 800 + k) - 0.5) * 1.0;
    d.slot.appendChild(el);
  });
  d.cred = d.atoms.filter(a => a.cls === 'c');
  d.cred.forEach((a, k) => { a.u = d.cred.length > 1 ? k / (d.cred.length - 1) : 0.5; });
  /* the screen reader gets the citation as one unbroken string. The words on the soil are the
     picture of the credit; this is the text of it, and it never comes apart. */
  const sr = document.createElement('span');
  sr.className = 'sr';
  sr.textContent = `${it.n}, ${it.disp}. ${it.src} · ${it.lic} · ${shortCred(it.cred)}`;
  d.slot.appendChild(sr);
  d.srEl = sr;
  /* THESE WORDS HAVE NEVER BEEN MEASURED. `lay()` writes every offset `place()` reads — `ax/ay`,
     `gx/gy`, `px/py` — onto the atom objects, and the ones made above are new objects with none
     of them. Leaving `laid` set from a previous incarnation means `place()` skips the measure and
     every offset reads `undefined`, which makes `tx` NaN, which makes the transform string
     invalid, which the browser silently drops — so the whole citation renders at the top-left
     corner at full opacity.

     THIS IS OLDER THAN ROUND 9 AND IT SHIPPED. The only route to a rebuild used to be `fit()`
     crossing 720px, which calls `rebuild()` and does not clear the flag either, so resizing a
     phone-width window past the breakpoint has always done this. Round 9 found it because
     demolish-and-rebuild became a thing that happens on every scroll-up rather than a thing that
     happens when someone drags a window edge. It belongs here rather than at either call site:
     the function that makes unmeasured atoms is the function that knows they are unmeasured. */
  d.laid = false;
}

// crossing 720px changes the split, so the words are thrown away and cut again
function rebuild(d) { unbuild(d); build(d); }

function unbuild(d) {
  if (!d.atoms) return;
  for (const a of d.atoms) a.el.remove();
  d.srEl.remove();
  d.atoms = null; d.cred = null; d.srEl = null;
}

/* one line of words, wrapped: writes each word's centre offset from the cluster's centre-top */
function layout(atoms, maxW, key) {
  const rows = [];
  let row = null;
  for (const a of atoms) {
    const gap = a.lead ? GAPP : GAPX;
    if (row && (a.row || row.w + gap + a.w > maxW)) row = null;
    if (!row) { row = { items: [], w: 0, h: 0 }; rows.push(row); }
    row.w += (row.items.length ? gap : 0) + a.w;
    row.h = Math.max(row.h, a.h);
    row.items.push(a);
  }
  let y = 0, cw = 0;
  for (const r of rows) {
    let x = -r.w / 2;
    for (const a of r.items) {
      a[key + 'x'] = x + a.w / 2; a[key + 'y'] = y + r.h / 2;
      x += a.w + (a.lead ? GAPP : GAPX);
    }
    y += r.h + GAPY;
    cw = Math.max(cw, r.w);
  }
  return { w: cw, h: Math.max(0, y - GAPY) };
}

/* Measured once per word, at scale 1, and never again: the size ramp is a transform scale, so
   every box downstream is exactly `w * s` rather than a guess at how a font reflows. */
function lay(d) {
  for (const a of d.atoms) {
    a.el.style.fontSize = (a.cls === 'n' ? Math.max(12, Math.min(15, W * 0.0125))
                         : a.cls === 'y' ? Math.max(11, Math.min(13, W * 0.0105))
                         : W < 720 ? CRED_PX * 0.84 : CRED_PX).toFixed(2) + 'px';
  }
  for (const a of d.atoms) {                        // every write above, then every read — one layout
    const r = a.el.getBoundingClientRect();
    a.w = r.width; a.h = r.height;
  }
  const maxW = Math.min(W * 0.42, 330);
  d.boxAir = layout(d.atoms, maxW, 'a');            // name, date and credit, riding the fall
  d.boxGnd = layout(d.cred, maxW, 'g');             // the citation alone, lying where it fell
  for (let p = 0; p < 3; p++) layout(d.cred.filter(a => a.part === p), maxW, 'p');
  d.laid = true;
}

/* ------------------------------------------------------------------ placing the words

   Two overlap contracts, and they are not the same contract. A credit is the citation and must
   be drawn even if the ground is full; the collision search is what stops that ever being
   needed. Boxes are the ROTATED bounding box, because a word lying at five degrees is what the
   sweep measures with getBoundingClientRect and a flat w×h would quietly under-report it. */

const taken = [];
// ROW_TOP clears the tie band: six ties stacked 3.4px apart reach 19px into the soil
const ROW_TOP = 24, ROW_STEP = 8;
const rowBot = () => Math.min(210, H - groundY() - 44);
/* One pixel of slack, because every box is placed with `translate(…toFixed(1)px)` and what
   renders can sit a fraction off the box this test was given. */
const SLACK = 1;
function hits(x, y, w, h) {
  for (let i = 0; i < taken.length; i++) {
    const t = taken[i];
    if (x - w / 2 - SLACK < t.x + t.w / 2 && t.x - t.w / 2 < x + w / 2 + SLACK &&
        y - SLACK < t.y + t.h && t.y < y + h + SLACK) return true;
  }
  return false;
}
const qz = (v, step) => Math.round(v / step) * step;
const aabbW = (w, h, r) => w * Math.abs(Math.cos(r)) + h * Math.abs(Math.sin(r));
const aabbH = (w, h, r) => w * Math.abs(Math.sin(r)) + h * Math.abs(Math.cos(r));

/* a break, smoothed over 0.05 of a life so the object and its citation come apart together
   rather than the text snapping a frame before the shards do */
const brk = (age, at) => Math.max(0, Math.min(1, (age - at) / 0.05));

/* One word, placed and reserved. The nudge is the second half of the collision contract and it
   is the half a per-cluster row search cannot do: two words of the SAME citation, scattered by
   their own wobble, land on each other with nothing between them to push against. So each word
   steps off its own resting line, nearest clear offset first, and takes the ground it finds.
   If nothing within a word's height is clear it prints where it was — a credit is the contract,
   and an overlap is a bad frame while a missing citation is a breach. */
function put(a, x, y, s, r, o, ink, bounds) {
  /* the box is computed from the QUANTISED transform, not the exact one — what the sweep
     measures with getBoundingClientRect is what was written to the element, and a box derived
     from a value the element never received is a box the gate can disagree with */
  s = qz(s, 0.02); r = qz(r, 0.012);
  const bw = aabbW(a.w * s, a.h * s, r), bh = aabbH(a.w * s, a.h * s, r);
  const step = Math.max(6, bh * 0.55);
  let ty = y;
  if (o > 0.02) {
    /* Bounds are the band a citation is allowed to occupy: never above its own soil line —
       that is the one surface the contrast gate is solved against — and never below the fold,
       because a citation off the bottom of the screen is a citation that is not on screen.
       Inside that band the word walks all the way DOWN first and only then all the way back
       up. Down-first is what leaves clear soil for the clusters placed after it; searching the
       whole band is what a phone needs, where the oldest citation is already at the bottom of
       245px of soil and has three steps of room left under it. */
    const lo = bounds ? bounds[0] + bh / 2 : y - step * 7, hi = bounds ? bounds[1] - bh / 2 : y + step * 8;
    ty = Math.max(lo, Math.min(Math.max(lo, hi), y));
    let free = false;
    for (let c = ty; c <= hi && !free; c += step) if (!hits(x, c - bh / 2, bw, bh)) { ty = c; free = true; }
    for (let c = ty - step; c >= lo && !free; c -= step) if (!hits(x, c - bh / 2, bw, bh)) { ty = c; free = true; }
  }
  draw(a, x, ty, s, r, o, ink);
  if (o > 0.02) taken.push({ x, y: ty - bh / 2, w: bw, h: bh });
}

function place(d) {
  if (!d.atoms) return;
  if (!d.laid) lay(d);

  /* ---- in the air: the whole label rides under the object ---- */
  if (d.air) {
    const cx = Math.max(W * 0.15, Math.min(W * 0.85, d.px));
    /* The label is NOT held off the ground line. Round 5 clamped it 84px above the surface,
       which was invisible while a solver threw things through that band in a few frames; a
       scroll-mapped fall spends its last 200px of budget there, so the clamp printed the name
       across the photograph on every arrival. Unclamped it simply follows, and ends the fall
       sitting on the soil at exactly the spot the credit is about to take over. */
    const below = d.py + d.h / 2 + 12;
    const above = d.py - d.h / 2 - d.boxAir.h - 12;
    let top = below;
    for (const cand of [below, above, below + d.boxAir.h + 6, above - d.boxAir.h - 6]) {
      top = cand;
      if (!hits(cx, top, d.boxAir.w, d.boxAir.h)) break;
    }
    const o = top > 4 ? 1 : 0;
    for (const a of d.atoms) put(a, cx + a.ax, top + a.ay, 1, 0, o, a.cls === 'c' ? INK_HI : null);
    return;
  }
  if (!d.down || d.gone) return;

  /* ---- TICKET 14, the ending. It never broke, so its words never came apart. ----

     Name, date and citation stay the one cluster they rode down as, standing on the soil beside
     the object. This is 06's rule rather than an exception to it — "a credit is one line until its
     object's FIRST SPLIT" — and this object has no first split. The ink stays fresh for the same
     reason: 13 ruled the credit decays with the object, and nothing here is decaying.

     Clamped as a CLUSTER, not word by word. `credX` is only held to 15–85% of the width, which on
     a 390px phone hangs an eighty-pixel half-cluster off the right edge — the frame showed a credit
     reading "ALEXANDER MIG". Clamping each word instead would keep them all on screen and pile
     them against the margin; the thing that has to stay whole here is the shape.

     It goes in the soil band like every other citation, so the contrast problem stays solved
     against the one surface whose value never changes. */
  if (d.i === LAST) {
    const half = d.boxAir.w / 2;
    const cx = Math.max(14 + half, Math.min(W - 14 - half, d.credX));
    let row = ROW_TOP;
    const BOT = rowBot();
    for (; row <= BOT; row += ROW_STEP)
      if (!hits(cx, surfAt(cx) + row, d.boxAir.w, d.boxAir.h)) break;
    const top = surfAt(cx) + Math.min(row, BOT);
    for (const a of d.atoms)
      put(a, cx + a.ax, top + a.ay, 1, 0, 1, a.cls === 'c' ? INK_HI : null,
          [surfAt(cx + a.ax) + 8, H - 5]);
    return;
  }

  /* ---- the name, breaking. Up and out with the shards, and gone. ---- */
  /* ONE EXPRESSION, ALL THE WAY TO nu = 1. This used to stop at `nu < 1` and then just set the
     opacity to zero, leaving the name where the last frame of the break had put it — which was
     fine while the only way to reach `nu = 1` was to have scrolled through the break. Under the
     rewind a name can be rebuilt already dead, and then it had an opacity and NO transform.

     Invisible, and it still moved the page: an element with a transform composites differently
     from one without, so the presence of fifteen dead name-words changed how the LIVE citations
     antialiased against the soil. Two walks to the same position differed on 27,817 pixels by one
     unit each, with the canvas byte-identical and every visible word in the same place — found by
     hiding one layer at a time until the composite was the only thing left that disagreed.
     `put` already writes nothing to the collision list below 0.02 opacity, so running the last
     frame of the break every frame costs a transform string and buys a page that has no memory. */
  const nu = Math.min(1, d.age / NAME_OUT);
  if (d.blown) {
    const cx = d.credX;
    const top = surfAt(cx) - d.h * 0.55;
    for (const a of d.atoms) {
      if (a.cls === 'c') continue;
      put(a, cx + a.ax + a.vx * nu, top + a.ay + a.vy * nu + 300 * nu * nu,
          1, a.vr * nu, 1 - nu * nu, null);
    }
  }

  /* ---- the citation, coming apart with its object ---- */
  const k1 = brk(d.age, SPLITS[0]);
  const k2 = SPLITS.length > 1 ? brk(d.age, SPLITS[1]) : 0;
  const s = 1 - (1 - CRED_LO) * d.age;
  const ink = INK_HI.map((v, j) => Math.round(v + (INK_LO[j] - v) * d.age));
  const o = d.age > 0.9 ? Math.max(0, (1 - d.age) / 0.1) : 1;

  /* how wide its own wreckage has got. The words spread exactly that far and no further, which
     is the whole of "the source shatters with the piece" — it is not a separate animation, it
     is a readout of where the fragments actually are. */
  let lo = Infinity, hi = -Infinity;
  for (const p of d.pieces) { if (p.x < lo) lo = p.x; if (p.x > hi) hi = p.x; }
  for (const q of d.specks) { if (q.x < lo) lo = q.x; if (q.x > hi) hi = q.x; }
  if (lo > hi) { lo = d.credX - d.w / 2; hi = d.credX + d.w / 2; }
  const fieldC = (lo + hi) / 2;
  // 70px is a floor, not a look: a field that has not spread yet must not stack its own words
  const half = Math.max((hi - lo) / 2, W < 720 ? (W - 28) / 2 : 70);
  const x0 = Math.max(14, fieldC - half), x1 = Math.min(W - 14, fieldC + half);

  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  for (const a of d.cred) {
    const gc = x0 + (x1 - x0) * (a.part + 0.5) / 3;
    const hx = d.credX + a.gx;                                   // whole
    const px = gc + a.px;                                        // three groups
    const sx = x0 + (x1 - x0) * Math.max(0, Math.min(1, a.u + a.jx));  // single words
    a.tx = hx + (px - hx) * k1 + (sx - (hx + (px - hx) * k1)) * k2;
    a.ty = a.gy * (1 - k1) + a.py * k1 * (1 - k2) + a.jy * k2;
    a.tx = Math.max(a.w * s / 2 + 6, Math.min(W - a.w * s / 2 - 6, a.tx));
    /* Lying down on the land is worth a few degrees and no more. The collision box is the
       ROTATED one, so every degree makes a long word taller: a 103px citation word on one of
       the steeper stretches of soil measured 15 degrees and a 22px-tall box, and two of those
       in one column will not fit a phone's band however hard the search works. */
    const lie = W < 720 ? 0.05 : 0.09;
    a.tr = Math.max(-lie, Math.min(lie, slopeAt(a.tx) + TILT * a.jr * Math.max(k1, k2)));
    a.bw = aabbW(a.w * qz(s, 0.02), a.h * qz(s, 0.02), qz(a.tr, 0.012));
    a.bh = aabbH(a.w * qz(s, 0.02), a.h * qz(s, 0.02), qz(a.tr, 0.012));
    const ry = surfAt(a.tx) + a.ty;                  // before the row offset, which shifts all of it
    bx0 = Math.min(bx0, a.tx - a.bw / 2); bx1 = Math.max(bx1, a.tx + a.bw / 2);
    by0 = Math.min(by0, ry - a.bh / 2);  by1 = Math.max(by1, ry + a.bh / 2);
  }

  /* The cluster drops row by row until every one of its words is clear. Its own bounding box is
     tried first: when the box is clear the whole cluster is clear, and that settles most rows in
     one comparison instead of eight. */
  let row = ROW_TOP;
  const BOT = rowBot();
  if (k1 >= 1) row = ROW_TOP;
  else for (row = ROW_TOP; row <= BOT; row += ROW_STEP) {
    if (!hits((bx0 + bx1) / 2, by0 + row, bx1 - bx0, by1 - by0)) break;
    let clash = false;
    for (const a of d.cred) {
      const y = surfAt(a.tx) + row + a.ty;
      if (hits(a.tx, y - a.bh / 2, a.bw, a.bh)) { clash = true; break; }
    }
    if (!clash) break;
  }
  row = Math.min(row, BOT);

  for (const a of d.cred)
    put(a, a.tx, surfAt(a.tx) + row + a.ty, s, a.tr, o, ink, [surfAt(a.tx) + 8, H - 5]);
}

function draw(a, x, y, s, r, o, ink) {
  const sq = qz(s, 0.02), rq = qz(r, 0.012);
  const t = `translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px)` +
            (sq !== 1 ? ` scale(${sq.toFixed(2)})` : '') +
            (rq ? ` rotate(${rq.toFixed(3)}rad)` : '');
  if (a.el.style.transform !== t) a.el.style.transform = t;
  const os = o.toFixed(2);
  if (a.el.style.opacity !== os) a.el.style.opacity = os;
  if (ink) {
    const c = `rgb(${qz(ink[0], 6)},${qz(ink[1], 6)},${qz(ink[2], 6)})`;
    if (a.el.style.color !== c) a.el.style.color = c;
  }
}

/* ------------------------------------------------------------------ the frame */

function frame() {
  /* ---- TICKET 10, the seam. The piece goes out over the screen before the shelf, on the
          scrollbar and on nothing else — stop moving and the fade stops with you, same as
          everything else in this file. Past it the canvas is not drawn at all: the last object
          died at TOTAL, so there is nothing down there to draw, and a hidden canvas that is
          still being painted every frame is a cost the index would pay for nothing. ---- */
  const fade = INDEX.fadeAt(scrollY, H);
  if (fade !== faded) {
    faded = fade;
    glEl.style.opacity = hudEl.style.opacity = (1 - fade).toFixed(3);
    glEl.style.visibility = hudEl.style.visibility = fade >= 1 ? 'hidden' : 'visible';
    /* 14 — the signature is the piece's furniture, so it goes out with the piece. Without this it
       would still be sitting over the shelf when the credits roll brought up the colophon's copy
       of the same mark, twice on one screen. */
    markEl.style.opacity = (MARK_REST * (1 - fade)).toFixed(3);
    markEl.style.visibility = fade >= 1 ? 'hidden' : 'visible';
  }

  /* ---- TICKET 14. The ending is taken off the page by the SEAM, not by a life. ----

     The last object never decays, so nothing in the update loop below ever reaches its `unbuild()`
     — and a citation with no death of its own is exactly the stranded-credit defect round 10 found,
     arriving through the one door that defect's fix left open. The fade is what ends it, which is
     also the honest reading: the object is not destroyed, the light goes off it.

     It runs both ways, because the seam is a position like everything else in this file. Scroll
     back up and the words are rebuilt; `place()` at the foot of the frame puts them back on the
     soil they were on. */
  const end = drops[LAST];
  if (end && end.down && !end.gone) {
    if (fade >= 1) { if (end.atoms) unbuild(end); }
    else if (!end.atoms) build(end);
  }

  /* THE FRAME IS UP UNTIL THE FIRST THING LANDS, and then it is not. Against the FULL page height
     the intro would still be legible 19,000px in, which is how it once ended up printed across the
     third burial field; against the eighth arrival it outlived the first landing by 580px, and the
     first date printed across the headline at 1440 (07, measured — one overlap, at y=500).

     Ending it on `START[0] + FALL` is a scroll position tied to something that happens on screen
     rather than a chosen number, and it makes the conflict structural rather than something the
     collision search has to win: after contact there is no intro, and before contact the only words
     in the air are riding the object, where `place()` has four candidate boxes to find a clear
     one. */
  fadeIntro(Math.min(1, scrollY / (START[0] + FALL)));

  /* ---- the fall. Height is a function of the scrollbar and of nothing else. ----

       t < 0      not here yet — and scrolling back past its start returns it to this
       0 ≤ t < 1  in the air, arc(t) of the way down. Scroll up, t drops, it rises.
       t = 1      down. Latched. Nothing ever sets `down` back to false.

     The retire branch is what makes a scrollbar drag survivable: an item whose whole life is
     already behind the visitor is dropped without ever cutting a fragment, so jumping two
     hundred arrivals forward costs four landings, not two hundred. */
  texture(scrollY);                                  // which photographs may be in memory here

  /* THE WINDOW MAY DELAY AN ARRIVAL. IT MAY NEVER RE-ORDER ONE.

     `drops` is walked in index order, which is date order, so in an all-resident build the thing
     an arrival ties to has always landed before it — TIE[i] is some j < i and LAND is increasing.
     land() reads that: it arms the tie only if the partner is already down, on 04's ruling that
     nothing is asserted about a thing that never fell.

     A window breaks it. If arrival 190's photograph comes back before 188's, 190 lands first,
     finds its partner still in the air, and draws no line — and which of the two arrives first is
     the network's business, so the same scroll position drew a different set of ties on two
     first visits. `window_is_not_a_clock` caught exactly this and it is the only thing it caught.

     So a stalled arrival stalls everything behind it. Anything already retired is unaffected — it
     needs no pixels and is skipped above — so a scrollbar drag still costs what it shows. */
  let waiting = false;

  let airborne = 0;
  for (const d of drops) {
    const rel = scrollY - START[d.i];

    /* ROUND 9. Every one of these is a predicate on the scrollbar. There is no branch here that
       asks what state the object was left in, because there is no state to be left in: the object
       is wherever `rel` says it is, and the same `rel` gives the same answer on the way back up.

       `gone` is what the object's own life running out looks like, and it is no longer a burial —
       the wreck stays until the WINDOW takes it (`texture` -> `demolish`), which is BACK px later
       and reversible. Scroll up into the life again and everything comes back. */
    d.down = rel >= FALL;
    d.age = d.down ? Math.min(1, Math.max(0, (scrollY - LAND[d.i]) / LIFE[d.i])) : 0;
    d.gone = d.down && d.age >= 1 && d.i !== LAST;

    if (rel < 0 || d.gone) {
      /* above its own start, or its life is behind us. Neither draws, and neither is remembered.
         This runs BEFORE anything that needs pixels, so the two hundred arrivals a scrollbar drag
         passes still cost nothing — they are never fetched and never cut. */
      d.t = -1; d.air = false; blank(d);
      if (d.atoms) unbuild(d);
      /* AND THIS IS WHERE THE RUNWAY IS. An object re-admitted by the window on a scroll-up is
         still `gone` for the next BACK px, and it used to spend all of them doing nothing — then
         `age` dropped below 1, the frame needed its deepest generation, and the whole cut tree was
         built at once. 144 late cuts on a walk down and 364 by the end of a walk back up. The
         window exists precisely so there is time; this is what spends it. */
      /* REBUILD IT NOW, WHILE THERE IS STILL TIME. The window re-admits an object BACK px before
         the scrollbar reaches the end of its life, and until this line that runway was spent
         doing nothing: the object stayed unbuilt until `age` fell under 1, and then one frame paid
         for the impact cut and both splits at once. Building the wreck the moment the pixels are
         here turns the whole window into runway — 364 late cuts over a walk down and back became
         two. Nothing is drawn: the object is `gone` and `blank()` has already emptied it. */
      if (d.gone && !d.built && d.im) { if (!d.prepped) prep(d); land(d); }
      if (d.built) prebuild(d);
      continue;
    }

    if (!d.built) {
      if (!d.im) waiting = true;                     // due, and its photograph is not here
      if (!d.im || waiting) {
        // its own photograph has not arrived, or an earlier arrival's has not. Both are the same
        // state and are drawn as it: not here yet.
        d.t = -1; d.air = false; blank(d);
        if (d.atoms) unbuild(d);
        continue;
      }
      if (!d.prepped) prep(d);
      if (d.down) land(d);
    }

    if (d.down) {
      /* THE WORDS ARE NOT PART OF THE WRECK, and putting them together was a bug this round made
         and then found. `build()` used to sit under `if (!d.built)`, which was the same thing as
         "is drawable" for as long as a wreck could only be made at the moment it became visible.
         The window now builds a wreck BACK px early, while the object is still `gone` — so `built`
         was already true by the time the object came into view, the branch was skipped, and every
         citation the visitor scrolled back up into was missing. The label layer went from 13,016
         characters to 3,886 and nothing else noticed. */
      /* …but not past the seam. Ticket 10's rule is that the piece leaves NOTHING on the shelf,
         and the ending block above enforces it for the one object whose words outlive their own
         decay — it unbuilds them the moment the fade completes. Moving `build()` here put the two
         in a loop: the seam took the ending's words down and the update loop put them straight
         back, seven span nodes over the shelf for the rest of the page. */
      if (!d.atoms && fade < 1) build(d);
      d.air = false; d.t = 1;
      pose(d, scrollY);                              // the whole wreck, resolved from the tables
      prebuild(d);                                   // and the next generation, cut before it is due
    } else {
      /* AN OBJECT BACK IN THE AIR IS NOT ALSO ON THE GROUND. The wreck exists exactly while the
         object is down, so walking back above a landing takes it apart again — and it can be
         taken apart safely because putting it back is a seeded, deterministic rebuild. Without
         the demolish the object was still flagged built, which cost it its photograph in the
         texture window and dropped it out of the sky; without the blank the smoke walk drew a
         falling photograph through the thirty-eight fragments of its own second break. */
      if (d.built) demolish(d);
      if (!d.atoms) build(d);
      blank(d);
      d.t = rel / FALL;
      d.air = true; airborne++;
      d.px = d.x;
      d.py = d.ySpawn + (d.yLand - d.ySpawn) * arc(d.t);
      d.angle = d.a0 + d.spin * d.t;
    }
  }
  live = airborne;

  /* Cutting is still the only expensive thing in the frame and it still gets a time budget rather
     than a count — a fixed twelve cuts hit 83ms p95 on the frames where a whole field split at
     once. What changed in round 9 is what the budget is ALLOWED TO DECIDE. It runs work early; it
     never decides which generation is on screen, because `pose()` above has already resolved that
     off `age` and cut synchronously if it had to. The budget is now a way to make sure that never
     happens, not a way of choosing.

     ROUND 10'S LANDING REPAIR IS GONE FROM HERE, and not because it was wrong. It computed the
     flight an object was owed between its own impact and the current scroll position, to fix
     shards that sat where the cut left them when a windowed sprite arrived on a frame with no
     forward scroll. That quantity is now the DEFINITION of a shard's pose rather than a repair
     applied to it — `poseTo` asks for exactly `floor((y - born) * MS_PER_PX / SUB)` steps every
     frame, whatever happened on the frames before it — so the case it repaired cannot arise. */
  const budget = performance.now() + CUT_MS;
  while (queue.length && performance.now() < budget) queue.shift()();

  /* TICKET 10 — the drawing stops here on the index, and NOT ONE LINE EARLIER.

     Past the seam the canvas is hidden, so there is nothing to see and a canvas that is invisible
     but still taking four full-frame fills is a cost the shelf pays for nothing. (Ticket 14 made
     the old reason for this — "the last object died long ago" — false: the last object is still
     standing at the seam. The return is still right, but it is now the hidden canvas that makes it
     right, not an empty one.) The return sits BELOW the update loop rather than at the top of the frame,
     and that placement is the whole of the fix: with it at the top, any drop still holding words
     when the fade completed never reached its own `unbuild()`, and its citation stayed printed in
     the fixed label layer — over the shelf, for the rest of the page. Three of them were on the
     first frame taken of this surface. State always advances; only the pixels stop. */
  if (fade >= 1) { requestAnimationFrame(frame); return; }

  /* The era's light, read straight off the scrollbar rather than eased toward a target — an
     ease is a wall clock wearing a hat. It crosses over the back half of each arrival's budget,
     so a new lamp still arrives rather than switches. The ramp itself is 13's, untouched. */
  const i0 = idxAt(Math.max(0, scrollY));
  const i1 = Math.min(N - 1, i0 + 1);
  const k = Math.min(1, Math.max(0, ((scrollY - START[i0]) / PER[i0] - 0.55) / 0.45));
  const cur = drops[i0];
  const rgbOf = h => [1, 3, 5].map(j => parseInt(h.substr(j, 2), 16));
  const c0 = rgbOf(cur.light[1]), c1 = rgbOf(drops[i1].light[1]);
  for (let j = 0; j < 3; j++) lightRGB[j] = c0[j] + (c1[j] - c0[j]) * k;
  // reach crosses on exactly the clock the colour does, which is the scrollbar and nothing else
  reach = reachFor(cur.it.y) + (reachFor(drops[i1].it.y) - reachFor(cur.it.y)) * k;
  setHud(cur.it.y, cur.light[2], cur.light[1]);

  /* ---- sky and the era's light. This is where every bit of colour on the page lives, and as
         of round 9 it is also where the only dated surface on the page lives. Four layers, all
         functions of `reach` and therefore of the scrollbar:

           the night     the unlit sky the light is a light against. Near black, always there.
           the stars     baked once; erased as the skyglow comes up, gone by reach 0.72.
           the pool      the lamp itself. At reach 0 it is small, bright and low — a fire lights
                         a few metres. At reach 1 it is the whole frame and nearly even, which is
                         what a lit night actually looks like and is the shape change 12 asked
                         for: item 6 and item 226 are not the same picture in a different colour.
           the haze      lit air lying on the land, growing with the pool.

         The earth is blitted opaque OVER all of it, further down. Nothing here reaches it. ---- */
  const gy = groundY();
  /* Quantised FIRST, and the bake reads only the quantised values. Baking from the raw `reach`
     while keying on the rounded one made the cache path-dependent: two scroll positions inside one
     bucket share a key but not a value, so the pixels you got were whichever edge of the bucket
     you happened to enter from, and the same scroll position drew two different skies depending on
     whether you had come down to it or up to it. `backdrop_is_scroll_only` caught it. */
  const rq = Math.round(reach * 256) / 256;
  const L = lightRGB.map(v => Math.round(v / 2) * 2);
  const key = `${W}x${H}@${dpr}|${rq}|${L.join(',')}`;
  if (key !== bkey) {
    bkey = key;
    const lit = `rgba(${L.join(',')},`;
    bcvs.width = Math.round(W * dpr); bcvs.height = Math.round(H * dpr);
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sky = bctx.createLinearGradient(0, 0, 0, gy);
    for (const t of [0, 0.55, 1]) {
      const amt = (0.12 + 0.34 * t) * rq * 0.24;      // how much of the age's light is in the air
      const dark = 4 + 2 * t;                         // the night under it
      sky.addColorStop(t, `rgb(${L.map(v => Math.round(dark + v * amt)).join(',')})`);
    }
    /* the whole canvas, not just down to the ground line. The earth is opaque over most of what
       is below gy, but the soil contour rises as much as 32px above it, and any band this fill
       does not reach is a band nothing clears. The gradient clamps to its horizon stop below gy,
       which is the right value for the sliver that shows. */
    bctx.fillStyle = sky;
    bctx.fillRect(0, 0, W, H);

    const sa = starAlpha(rq);
    if (sa > 0.004) drawStars(bctx, sa);

    const R = Math.max(W, H) * (0.34 + 0.86 * rq);
    const glow = bctx.createRadialGradient(W / 2, gy, 0, W / 2, gy, R);
    glow.addColorStop(0, lit + (0.30 - 0.11 * rq).toFixed(3) + ')');
    glow.addColorStop(0.34 + 0.28 * rq, lit + (0.045 + 0.055 * rq).toFixed(3) + ')');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    bctx.fillStyle = glow;
    bctx.fillRect(0, 0, W, H);

    /* A low band of lit air sitting on the land — the light has somewhere to land. The ramp rises
       to its value 40px ABOVE the ground line and then HOLDS it flat all the way down. That is
       not a nicety: the soil contour wanders ±32px either side of gy, so a ramp still climbing at
       the ground line is brightest exactly where the land dips, and it printed a lit hairline
       tracing the whole contour — a stroke, which is the one thing 11 said nothing on this page
       has. Held flat, every dip and every rise is the same value and the horizon is a value step. */
    const hz = 120 + 190 * rq, a = 0.075 + 0.05 * rq;
    const haze = bctx.createLinearGradient(0, gy - hz, 0, gy - 40);
    haze.addColorStop(0, 'rgba(0,0,0,0)');
    haze.addColorStop(1, lit + a.toFixed(3) + ')');
    bctx.fillStyle = haze;
    bctx.fillRect(0, gy - hz, W, hz - 40);
    bctx.fillStyle = lit + a.toFixed(3) + ')';
    bctx.fillRect(0, gy - 40, W, 100);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(bcvs, 0, 0);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  /* ---- the photographs and their fragments, raw. Never lit, never tinted, never graded. ---- */
  for (const d of drops) {
    if (d.air && d.im) {
      ctx.save();
      ctx.translate(d.px, d.py);
      ctx.rotate(d.angle);
      ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10;
      ctx.drawImage(d.im, -d.w / 2, -d.h / 2, d.w, d.h);
      ctx.restore();
    }
    if (d.pieces.length) drawPieces(ctx, d.pieces);
    /* the specks were already a pure readout of `age` — position, drift and depth are all read
       off it — so they came back for free. What had to go was the line under this loop that
       emptied the array once `age` passed 1: a draw call that deletes the thing it draws, which
       is the last place in the file where looking at a frame changed it. The window drops them
       now, in `demolish`, along with everything else the object owns. */
    for (const q of d.specks) {
      const kk = Math.max(0, (d.age - q.t0) / Math.max(0.01, 1 - q.t0));
      ctx.fillStyle = `rgba(${q.col[0]},${q.col[1]},${q.col[2]},${(1 - kk * 0.55).toFixed(3)})`;
      ctx.fillRect(q.x + q.drift * kk, q.y + q.depth * kk, q.r, q.r);
    }
  }

  /* ---- the earth, opaque, laid over everything. Nothing below it is visible, ever. ---- */
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(gcvs, 0, 0);
  ctx.restore();

  /* the spray belongs to the impact, so it is on screen exactly while its own object is on the
     ground. The wreck outlives that by BACK px — the window keeps it so a scroll-up costs nothing
     — and without this test an arrival the visitor has scrolled back ABOVE goes on throwing soil
     into the air over an empty field. Seven of them were doing it, 4,000px up the page. */
  if (!REDUCED) for (const d of drops) if (d.dust && d.down && !d.gone) drawDust(ctx, d.dust);

  /* ---- the tie. 01's engine, drawn: a line laid along the soil between two things that were
         standing at the same time. 04 ruling 6 built it and printed the miss on it — `SAME YEAR`
         · `40 YEARS APART` — and the caption was rejected outright. The line and what it means
         stay; the words do not.

         THE LINE IS CUT ONCE PER YEAR OF MISS. Two things that arrived in the same year share
         one unbroken hairline. Two that missed by forty have forty breaks in theirs. Nothing is
         written and nothing has to be read, and the encoding is exact rather than relative: the
         number of segments is the number of years plus one, and the sweep counts them off the
         dash pattern. Where the span is too short to hold that many breaks the line degrades to
         a dotted trace, which still says the only thing that matters at eighty years — that
         these two barely overlapped. A tie dies with the FIRST of its two ends, because a
         relation cannot outlive either party. ---- */
  let newest = -1;
  /* On a phone the whole spread is about 250px of soil, and five ties laid across it are five
     hairlines in the space one belongs in — no collision, and unreadable anyway, which is the
     kind of thing a collision gate is structurally unable to catch. So narrow draws only the
     newest: the tie that answers "what was THIS standing next to". */
  /* `built` joins the test in round 9. `down` and `gone` are predicates on the scrollbar now, so
     they are both already true of an arrival whose photograph has not come back — and a tie drawn
     to an end that is not on the ground reads its partner's `credX` from the last time it was,
     which after a demolish is a line to a place nothing is lying. */
  const tieLive = d => d.built && d.down && !d.gone;
  if (W < 720) for (const d of drops)
    if (d.tie && tieLive(d) && tieLive(drops[d.tie.j])) newest = d.i;

  /* Newest first, and each tie sits a little deeper in the soil than the one above it. That is
     not decoration: five ties drawn on one contour merge into a single unbroken stroke and the
     cut count — the whole encoding — becomes unreadable. Ranking them by recency means the
     newest lies on the surface and older relations settle under it, which is the same thing
     everything else in the piece does with age. */
  let rank = 0;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    const T = d.tie;
    if (!T) continue;
    const p = drops[T.j];
    T.on = tieLive(d) && tieLive(p) && (newest < 0 || d.i === newest);
    if (!T.on) continue;

    const age = Math.max(d.age, p.age);
    const o = age > 0.9 ? Math.max(0, (1 - age) / 0.1) : 1;
    const off = 2.5 + Math.min(rank++, 5) * 3.4;
    const x0 = Math.min(d.credX, p.credX), x1 = Math.max(d.credX, p.credX);

    let len = 0, prevX = x0, prevY = surfAt(x0) + off;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    for (let x = x0 + 4; x <= x1; x += 4) {
      const y = surfAt(x) + off;
      len += Math.hypot(x - prevX, y - prevY); prevX = x; prevY = y;
      ctx.lineTo(x, y);
    }
    const yEnd = surfAt(x1) + off;
    len += Math.hypot(x1 - prevX, yEnd - prevY);
    ctx.lineTo(x1, yEnd);

    /* The cut is capped at 16px and otherwise takes a fixed 40% of the line between them, which
       is the curve that makes the count readable at both ends: one miss is a single obvious
       break, five are five countable ones, and eighty is a dotted trace — which still says the
       only thing eighty years has to say, that these two barely overlapped.
       seg × (gap+1) + cut × gap = len, exactly, so the last segment ends on the far tick and
       the count on the glass is the count in the table. */
    let seg = len, cut = 0;
    if (T.gap > 0) {
      cut = Math.min(16, (len * 0.40) / T.gap);
      seg = (len - cut * T.gap) / (T.gap + 1);
      if (seg < 1.2) { seg = 1.2; cut = Math.max(0.25, (len - seg * (T.gap + 1)) / T.gap); }
    }
    T.len = len; T.seg = seg; T.cut = cut;

    ctx.save();
    ctx.strokeStyle = `rgba(${lightRGB.map(Math.round).join(',')},${(0.46 * o).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.setLineDash(T.gap > 0 ? [seg, cut] : []);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();                                 // a tick at each end, so the line has owners
    for (const x of [x0, x1]) { ctx.moveTo(x, surfAt(x) + off); ctx.lineTo(x, surfAt(x) + off - 7); }
    ctx.stroke();
    ctx.restore();
  }

  /* ---- the words. Newest first, so the thing that just landed gets the ground it fell on and
         everything older packs around it. ---- */
  taken.length = 0;
  /* 14 — the signature is reserved BEFORE any word is placed, in the same list every citation is
     placed against. 11's no-collision contract has no furniture exemption in it, and a fixed pill
     in the bottom-right corner sits exactly in the soil band the newest credits are written in.
     Read off the element rather than computed from the stylesheet, so a padding change cannot
     quietly stop reserving the right box. */
  if (markEl.style.visibility !== 'hidden') {
    const b = markEl.getBoundingClientRect();
    if (b.width > 1) taken.push({ x: b.x + b.width / 2, y: b.y, w: b.width, h: b.height });
  }
  /* 07 — and the intro, for the same reason, found while measuring a longer paragraph rather than
     reasoned about. It was NEVER reserved, and the headline sits in the lower left, which is the
     soil band the first credits are written in.

     THIS IS THE ONLY THING HOLDING THE PRE-CONTACT WINDOW. After the first landing the intro is
     gone and the conflict cannot happen; before it, the label rides the falling object straight
     down past the headline. Deleted, that prints through it at 2 of 24 stops at 1440 over a 20px
     walk of the window, first at y=400 — measured, and not visible to the collision gate until the
     gate's stride was fixed in the same round.

     If a word finds nothing clear it prints where it was (`put`), so this can cost a bad frame and
     can never cost a citation. */
  const introO = styleO(introEl, 1);
  if (introO > 0.05) for (const el of introInk) {
    const b = el.getBoundingClientRect();
    if (b.width > 1) taken.push({ x: b.x + b.width / 2, y: b.y, w: b.width, h: b.height });
  }
  if (styleO(hintEl, 0.4) > 0.05) {
    const b = hintEl.getBoundingClientRect();
    if (b.width > 1) taken.push({ x: b.x + b.width / 2, y: b.y, w: b.width, h: b.height });
  }
  for (let i = drops.length - 1; i >= 0; i--) place(drops[i]);

  requestAnimationFrame(frame);
}

/* read by the headless sweep only; nothing in the page touches it. `air` is the gate that says
   the mechanic held — it must never exceed 1, at any scroll position, at any scroll speed. */
window.__hh = {
  drops, queue, surfAt, FALL, TOTAL, W_YEARS, SPLITS, DUST_AT, NAME_OUT, INK_LO,
  /* the texture window, for the round-10 gates. DRAW_H x DPR_CAP is the claim the shipped files
     are baked against; `held` is the resident set counted off the live references rather than
     off any tally the page keeps, and `blind` is the tripwire on a landing solved without its
     own photograph. */
  DRAW_H, DPR_CAP, AHEAD, BACK,
  held: () => drops.filter(d => d.im).map(d => ({ i: d.i, k: d.it.k, air: d.air, down: d.down,
                                                  w: d.im.naturalWidth, h: d.im.naturalHeight })),
  peakHeld: () => peakHeld, pending: () => inFlight, blind: () => solvedBlind, lateCuts: () => lateCuts,
  /* 04 round 9. The rewind keeps a wreck for BACK px past its object's death and keeps EVERY
     generation of it, because a parent is what its children are cut from and a rewind across a
     split needs the parent back. That is a second resident set beside the photographs and it is
     the one the ruling grew, so it is measured rather than assumed. Summed off the live canvases,
     not off any tally the page keeps about its own intentions — 03 round 10's leak was a counter
     that agreed with the intention while the page sat on all 230 photographs. */
  fragBytes: () => { let b = 0, n = 0;
    for (const d of drops) { if (!d.gens) continue;
      for (const G of d.gens) for (const q of G.pieces) { b += q.cv.width * q.cv.height * 4; n++; } }
    return { bytes: b, pieces: n }; },
  /* the backdrop, for the round-9 gates. `reach` is read live off the frame; `reachFor` and
     `starAlpha` are the curves themselves, so a gate can check the drawn pixels against the
     function rather than against another copy of the page's own opinion. */
  STAR_OUT, reachFor, starAlpha, reach: () => reach, groundY,
  /* the impact spray lives on the arrivals now, one seeded list each, so there is no global pool
     to reach for. The round-9 sky probes clear it to read the air behind it; clearing the lists is
     enough, because nothing respawns them — dust is made at impact and an impact is a rebuild. */
  clearDust: () => { for (const d of drops) if (d.dust) d.dust.length = 0; },
  dustN: () => drops.reduce((s, d) => s + (d.dust ? d.dust.filter(q => q.t < q.life).length : 0), 0),
  /* bgAt one pixel at a time is a GPU readback each call, which is fine for a few hundred words
     and useless for counting stars over a third of the screen. Same read, one rectangle. */
  px: (x, y, w, h) => ctx.getImageData(Math.round(x * dpr), Math.round(y * dpr),
                                       Math.round(w * dpr), Math.round(h * dpr)),
  /* the composited pixel a word is sitting on, read straight off the canvas. 06 item 5 wanted
     legibility measured rather than asserted, and this is the honest way to do it: the text is
     DOM over a canvas, so the background under any word is exactly one getImageData away. */
  bgAt: (x, y) => {
    const p = ctx.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data;
    return [p[0], p[1], p[2]];
  },
  /* ticket 10's surface, for the index gates. `probe` is the shelf's own arithmetic; `fade` is
     the seam read at a scroll position rather than off a stored flag. */
  index: INDEX.probe, indexOpen: INDEX.openAt, indexClose: INDEX.close,
  fadeAt: y => INDEX.fadeAt(y, H),
  PER: Array.from(PER), START: Array.from(START), LAND: Array.from(LAND),
  LIFE: Array.from(LIFE), CO: Array.from(CO), TIE: Array.from(TIE),
  snap: () => ({
    // counted off the drops themselves, not off the frame's own tally: a stale flag is exactly
    // the kind of thing this gate exists to catch, and it cannot catch it from its own counter
    scroll: scrollY, air: drops.filter(d => d.air).length, counted: live,
    ties: drops.filter(d => d.tie && d.tie.on).length,
    /* every tie currently on the soil, with the dash it was drawn with — the gate divides the
       path length by the dash period and demands `gap + 1` segments */
    tieDash: drops.filter(d => d.tie && d.tie.on).map(d => ({
      i: d.i, gap: d.tie.gap, len: d.tie.len, seg: d.tie.seg, cut: d.tie.cut,
      segments: d.tie.gap > 0 ? Math.round((d.tie.len + d.tie.cut) / (d.tie.seg + d.tie.cut)) : 1
    })),
    items: drops.filter(d => d.air || (d.down && !d.gone)).map(d => ({
      i: d.i, k: d.it.k, air: d.air, t: +d.t.toFixed(4),
      y: d.air ? +d.py.toFixed(2) : null,
      down: d.down, age: +d.age.toFixed(4), pieces: d.pieces.length, specks: d.specks.length,
      tie: d.tie ? d.tie.j : null, gap: d.tie ? d.tie.gap : null,
      // the citation contract, as numbers: how many of its words are on screen, and how wide
      // they have spread against how wide the whole line would be
      words: d.cred ? d.cred.filter(a => +a.el.style.opacity > 0.02).length : 0,
      credW: d.cred && d.cred.length
        ? Math.max(...d.cred.map(a => a.tx || 0)) - Math.min(...d.cred.map(a => a.tx || 0)) : 0,
      lineW: d.boxGnd ? d.boxGnd.w : 0,
      nameOn: d.atoms ? d.atoms.filter(a => a.cls !== 'c' && +a.el.style.opacity > 0.02).length : 0
    }))
  })
};

requestAnimationFrame(frame);
