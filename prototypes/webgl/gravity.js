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

   THE RULING ON SCROLLING BACK UP — the fall reverses, the break does not. Height is a function
   of scroll, so scrolling up mid-fall lifts the object back out of frame. But contact LATCHES:
   the instant an object touches down it is broken, and no amount of scrolling back up reassembles
   it. The line is between a position and an event. A position is a function of where you are and
   is free to run either way; an event happened, and scrolling up is not a time machine. */

import { ITEMS, lightFor, shortCred, setHud, setIntro, fadeIntro, done, hash, REDUCED } from './shell.js';
import { hexA, rng, noise1, Dust, tileFor, mottle, restProfile } from './burial.js';
import { sites, voronoi, cutPiece, avgColor, makePiece, stepPieces, drawPieces } from './decay.js';

setIntro(
  'Everything here hit the ground once. It broke, and then the pieces broke, and the pieces of ' +
  'those broke, until there was nothing left the ground could not take.',
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
    for (const p of d.pieces) p.rest = false;     // re-settle onto the new land
    if (!d.down) d.prepped = false;               // the landing solve is against a surface that moved
    if (d.atoms) { if (flip) rebuild(d); else d.laid = false; }
  }
}

/* ------------------------------------------------------------------ the objects */

const labelLayer = document.getElementById('labels');
const drops = ITEMS.map((it, i) => ({
  it, im: null, i, ar: 1, light: lightFor(it.y), loading: null,
  /* the fall, as pure scroll geometry. prepped once; t is where the scrollbar is inside it. */
  prepped: false, t: -1, air: false,
  x: 0, w: 0, h: 0, a0: 0, spin: 0, ySpawn: 0, yLand: 0, dxLow: 0,
  down: false, px: 0, py: 0, angle: 0, landScroll: 0, age: 0, splits: 0,
  pieces: [], specks: [], dusted: false, credX: 0, gone: false,
  /* the words. Built on the way down, taken apart on the ground, removed at death. */
  atoms: null, cred: null, srEl: null, laid: false, blown: false, tie: null
}));

const dust = new Dust();
const queue = [];                                   // deferred cutting, so a split never drops a frame
const landed = [];                                  // whatever hit the ground this frame

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
    if (!ok || d.down || d.gone) return;         // its whole life went by while it was in the air
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
    if (d.down || d.gone) release(d);              // shattered, or passed: its pixels are spent
    else {
      const rel = y - START[d.i];
      if (rel > -AHEAD && rel - FALL < LIFE[d.i]) want(d); else release(d);
    }
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
   over ~110px of scroll, and freezes mid-air the instant the visitor stops. */
const MS_PER_PX = 3.0;
const SUB = 50;                                     // integrator step ceiling, ms
const MAX_STEP = 240;                               // ms of debris advanced in one frame, max

let prevScroll = 0, live = 0;
let lightRGB = [255, 122, 26];
let reach = 0;                                        // how far the light of the age gets, 0..1

fit();
addEventListener('resize', fit);
document.getElementById('spacer').style.height = (TOTAL + innerHeight) + 'px';

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

   The one irreversible line in the file. Everything above it is a position and runs both ways;
   everything below it happened. Once `down` is set nothing clears it — scroll back up and you
   are looking at a broken thing, not at an unbroken one. */

function land(d) {
  d.down = true; d.air = false; d.t = 1;
  d.angle = d.a0 + d.spin;
  d.px = d.x; d.py = d.yLand;
  d.landScroll = LAND[d.i];                         // exact, not observed
  const cx = d.x + d.dxLow, cy = surfAt(cx);

  if (!REDUCED) {
    const n = Math.min(34, 14 + Math.round(IMPACT * 1.6));
    dust.impact(cx - d.w * 0.28, cy, n, SOIL);
    dust.impact(cx + d.w * 0.28, cy, n, SOIL);
    dust.breath(cx, cy, 12, SOIL);
  }

  d.blown = true;                                    // the name and date break; see `place()`
  d.credX = Math.max(W * 0.15, Math.min(W * 0.85, cx));

  /* the tie is armed here rather than drawn from the tables directly, because it needs the
     partner's real fall point — which only exists once that partner has actually landed. If the
     visitor jumped past it, there is no line: nothing is asserted about a thing that never fell. */
  const j = TIE[d.i];
  if (j >= 0 && drops[j].down && !drops[j].gone) d.tie = { j, gap: d.it.y - ITEMS[j].y, on: false };

  if (d.im) shatterNow(d, cx, cy, IMPACT);
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
    d.pieces.push(pc);
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
    d.specks.push({
      x: p.x + (r() - 0.5) * p.w * 1.5,
      y: p.y - p.h * 0.45 + (r() - 0.5) * p.h * 0.6,
      depth: 10 + r() * 26, drift: (r() - 0.5) * 26,
      r: 1 + r() * 1.6, col, t0: DUST_AT
    });
  }
}

function advance(d) {
  /* The shards shatter again, twice. Each piece is replaced IN PLACE by its children — clearing
     the array first and refilling it from the queue blanks the object for a frame, which reads
     as a flicker. */
  while (d.splits < SPLITS.length && d.age >= SPLITS[d.splits]) {
    const at = d.splits++;
    d.pieces.slice().forEach((p, k) => queue.push(() => {
      if (d.gone) return;
      const j = d.pieces.indexOf(p);
      if (j < 0) return;
      const out = splitPiece(d, p, d.i * 999 + at * 71 + k);
      if (out) d.pieces.splice(j, 1, ...out);
    }));
  }

  if (!d.dusted && d.age >= DUST_AT) {
    d.dusted = true;
    d.pieces.slice().forEach((p, k) => queue.push(() => {
      if (d.gone) return;
      const j = d.pieces.indexOf(p);
      if (j >= 0) d.pieces.splice(j, 1);
      toSpecks(d, p, d.i * 131 + k);
    }));
  }
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
    labelLayer.appendChild(el);
  });
  d.cred = d.atoms.filter(a => a.cls === 'c');
  d.cred.forEach((a, k) => { a.u = d.cred.length > 1 ? k / (d.cred.length - 1) : 0.5; });
  /* the screen reader gets the citation as one unbroken string. The words on the soil are the
     picture of the credit; this is the text of it, and it never comes apart. */
  const sr = document.createElement('span');
  sr.className = 'sr';
  sr.textContent = `${it.n}, ${it.disp}. ${it.src} · ${it.lic} · ${shortCred(it.cred)}`;
  labelLayer.appendChild(sr);
  d.srEl = sr;
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

  /* ---- the name, breaking. Up and out with the shards, and gone. ---- */
  const nu = Math.min(1, d.age / NAME_OUT);
  if (d.blown && nu < 1) {
    const cx = d.credX;
    const top = surfAt(cx) - d.h * 0.55;
    for (const a of d.atoms) {
      if (a.cls === 'c') continue;
      put(a, cx + a.ax + a.vx * nu, top + a.ay + a.vy * nu + 300 * nu * nu,
          1, a.vr * nu, 1 - nu * nu, null);
    }
  } else if (d.blown) {
    for (const a of d.atoms) if (a.cls !== 'c' && a.el.style.opacity !== '0') a.el.style.opacity = '0';
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
  const dScroll = scrollY - prevScroll; prevScroll = scrollY;
  const fwd = Math.max(0, dScroll);                  // only downward scroll advances anything

  // the intro goes with the first two objects. Against the FULL page height it would still be
  // legible 19,000px in, which is how it ended up printed across the third burial field.
  fadeIntro(Math.min(1, scrollY / START[8]));

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
    if (d.gone) continue;
    const rel = scrollY - START[d.i];

    if (!d.down) {
      if (rel >= FALL && rel - FALL >= LIFE[d.i]) {   // its whole life is behind us: skip it entire
        // clearing `air` is not housekeeping. An item caught mid-fall by a scrollbar jump is
        // still flagged airborne, and the draw loop asks nothing but that flag — leave it set
        // and the sprite hangs at its spawn point, labelled, for the rest of the page.
        // This branch runs BEFORE the two that need pixels, so the two hundred arrivals a
        // scrollbar drag passes are retired without ever being fetched.
        d.gone = true; d.air = false; d.t = -1; unbuild(d);
        continue;
      }
      if (rel >= 0 && !d.im) waiting = true;           // due, and its photograph is not here
      if (rel < 0 || !d.im || waiting) {
        // above its start; or its own photograph has not arrived; or an earlier arrival's has
        // not. All three are the same state and are drawn as it: not here yet.
        d.t = -1; d.air = false;
        if (d.atoms) unbuild(d);
      } else if (rel >= FALL) {
        if (!d.prepped) prep(d);
        if (!d.atoms) build(d);
        land(d);
        landed.push(d);                              // owed the flight its own impact already paid for
      } else {
        if (!d.prepped) prep(d);
        if (!d.atoms) build(d);
        d.t = rel / FALL;
        d.air = true; airborne++;
        d.px = d.x;
        d.py = d.ySpawn + (d.yLand - d.ySpawn) * arc(d.t);
        d.angle = d.a0 + d.spin * d.t;
      }
    }

    // decay is one-way: scrolling back shows what is already broken, it never un-breaks it
    if (d.down) {
      const a = Math.min(1, (scrollY - d.landScroll) / LIFE[d.i]);
      if (a > d.age) { d.age = a; advance(d); }
      if (d.age >= 1) {
        d.gone = true;                               // every canvas it held is dropped here
        d.pieces.length = 0; d.specks.length = 0;
        unbuild(d);                                  // and the citation goes with the last speck
      }
    }
  }
  live = airborne;

  // Cutting is the only expensive thing in the frame, so it gets a time budget rather than a
  // count. A fixed twelve cuts hit 83ms p95 on the frames where a whole field split at once.
  const budget = performance.now() + 4;
  while (queue.length && performance.now() < budget) queue.shift()();

  /* Debris settles on scroll too. A shard's flight is real integration — it has to arc and bed
     into the surface — but what is being integrated is distance travelled by the scrollbar, so
     a stopped scroll is a stopped frame. Substepped, because a flick worth 900px would otherwise
     ask for 2.7 seconds in one go and throw shards straight through the ground. */
  const ms = Math.min(MAX_STEP, fwd * MS_PER_PX);
  for (let left = ms; left > 0; left -= SUB) {
    const step = Math.min(SUB, left);
    for (const d of drops) if (d.pieces.length) stepPieces(d.pieces, step, surfAt);
    dust.step(step);
  }

  /* ROUND 10, and the texture window forced it. The step above is fed the delta of the frame the
     shards happen to be alive in, which is fine while the visitor is scrolling and degenerate the
     moment an object lands on a frame with no forward scroll. Dragging the scrollbar used to land
     everything on the same frame as the jump — one 240 ms step, paid by the jump's own delta.
     A windowed sprite arrives a frame or two after that, into `fwd = 0`, and its shards then sit
     exactly where the cut left them: a shattered object that looks whole.

     So an object that has just landed is given the flight the scroll between its own impact and
     here has already paid for, less whatever the frame above already gave it. On a walk that
     difference is zero — an object lands within one frame's scroll of its own landing position —
     and on an all-resident jump it is zero too, because there the jump's own delta had already
     maxed the step out. It is a repair for exactly the case the window created and for no other. */
  let most = 0;
  for (const d of landed) {
    let owed = Math.min(MAX_STEP, Math.max(0, scrollY - d.landScroll) * MS_PER_PX) - ms;
    if (owed <= 0) continue;
    if (owed > most) most = owed;
    for (; owed > 0; owed -= SUB) stepPieces(d.pieces, Math.min(SUB, owed), surfAt);
  }
  // the impact spray is spawned by the same landing and is owed the same flight, once
  for (let left = most; left > 0; left -= SUB) dust.step(Math.min(SUB, left));
  landed.length = 0;

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
    if (d.specks.length) {
      const t = Math.max(0, (d.age - DUST_AT) / (1 - DUST_AT));
      for (const q of d.specks) {
        const kk = Math.max(0, (d.age - q.t0) / Math.max(0.01, 1 - q.t0));
        ctx.fillStyle = `rgba(${q.col[0]},${q.col[1]},${q.col[2]},${(1 - kk * 0.55).toFixed(3)})`;
        ctx.fillRect(q.x + q.drift * kk, q.y + q.depth * kk, q.r, q.r);
      }
      if (t >= 1) d.specks.length = 0;
    }
  }

  /* ---- the earth, opaque, laid over everything. Nothing below it is visible, ever. ---- */
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(gcvs, 0, 0);
  ctx.restore();

  if (!REDUCED) dust.draw(ctx, 0);

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
  if (W < 720) for (const d of drops)
    if (d.tie && d.down && !d.gone && drops[d.tie.j].down && !drops[d.tie.j].gone) newest = d.i;

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
    T.on = d.down && !d.gone && p.down && !p.gone && (newest < 0 || d.i === newest);
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
  DRAW_H, DPR_CAP, AHEAD,
  held: () => drops.filter(d => d.im).map(d => ({ i: d.i, k: d.it.k, air: d.air, down: d.down,
                                                  w: d.im.naturalWidth, h: d.im.naturalHeight })),
  peakHeld: () => peakHeld, pending: () => inFlight, blind: () => solvedBlind,
  /* the backdrop, for the round-9 gates. `reach` is read live off the frame; `reachFor` and
     `starAlpha` are the curves themselves, so a gate can check the drawn pixels against the
     function rather than against another copy of the page's own opinion. */
  STAR_OUT, reachFor, starAlpha, reach: () => reach, groundY, dust,
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
