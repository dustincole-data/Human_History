/* index.js — THE INDEX SURFACE. Ticket 10.

   01 ruled the piece ends with "a quiet stop into a browsable index" and made this the ONLY
   second surface: no year input, no filtering, no search. It is what makes a 230-item content
   bill pay for itself twice. It is a second layout, not a footer — everything the scroll must
   satisfy, this must satisfy too.

   ------------------------------------------------------------------------------------------
   THE INVERSION, which is what the surface is for.

   The scroll is twelve thousand years of things being destroyed. Every object falls, breaks,
   breaks again and goes under the earth; its name dies at the impact and its citation dies with
   the last speck. Nothing in the piece survives being looked at.

   HERE NOTHING IS BROKEN. The same ground continues past the last arrival and all 230 are
   standing on it, whole, in order. That is the reward 12 said fun needs, delivered without a
   crescendo — which keeps 01's "no finale" rather than breaking it. The visitor does not get a
   finale; they get everything back.

   ------------------------------------------------------------------------------------------
   THE FOUR DECISIONS 10 ASKS FOR.

   1. ORGANISED BY: chronology, wrapped into rows, one height. 10 suspected a plain grid would
      flatten the mechanism and asked whether an arrangement by MOMENT would echo it instead.
      It would, and it costs too much: the co-occurrence window is a SLIDING one (04's W_YEARS),
      so cutting it into rows draws boundaries that are not there and splits pairs that are — and
      through the deep head it produces forty rows holding one object each, which fails 01's
      judgment test on its first clause.

      What survives from that idea is its honest half. A row is not a grid line, it is a WRAP: it
      holds as many objects as fit at one height, so a row in the present covers three years and a
      row in the deep head covers three thousand. THE ROW'S OWN SPAN IS PRINTED IN THE GUTTER, and
      that is density made visible for nothing — no chart, no asserted era, nothing claimed that
      the dates do not already say. Contemporaries land next to each other because time is the
      order, which is the mechanism kept.

   2. A CELL SHOWS: the object. Nothing else. This is the density-vs-legibility trade at the
      highest density on the site, and it is settled by 06's size grammar rather than by taste —
      the piece draws every photograph at ONE height; one height with a name under it needs a
      fixed column; and a fixed column turns a shelf of real things at their true relative widths
      into a contact sheet with captions. So the shelf carries no text, and the words come back
      complete on focus or tap instead of truncated under every cell. The credits roll below the
      shelf is the readable half of the same index (decision 4).

      NO HOVER STATE, deliberately. Mobile is a ship gate; an affordance half the visitors cannot
      reach is not an affordance. Tap, click and keyboard focus all do the same one thing.

   3. ENTERED by scrolling to the end and by nothing else — same document, same scrollbar, no
      route change, no scrolljack (12). LEFT by scrolling back up. Tapping a cell OPENS IT IN
      PLACE: the object stays where it is, its name, date and full citation are written on the
      soil under it, and everything that was standing within eighty years of it stays lit while
      the rest of the shelf goes down. That is 01's ambient engine at index density — the thing
      06 item 1 said had to be prototyped here and never was.

      A JUMP BACK INTO THE SCROLL IS RULED OUT, and the reason is a ruling rather than a
      difficulty. Decay is one-way (13, and 04's latch): once an object has broken there is no
      scroll position that shows it whole again, so "jump back to item 57" can only mean reloading
      the page — and a reload is a new visit, not a jump. Rather than dress a reload up as
      navigation, the index does what the scroll structurally cannot: it holds every object
      intact, named and cited, for as long as you look at it.

   4. CARRIES THE CREDITS: yes, and that closes 06 item 6. The opened cell prints one citation in
      full; THE ROLL UNDER THE SHELF PRINTS ALL 230, in order, as real text lying in the earth.
      Every item carries its attribution without being touched, the roll is what a browser's find
      lands in, and 06 is not left holding two hundred credits with nowhere to put them.

   ------------------------------------------------------------------------------------------
   WHAT HOLDS THE LOOK TOGETHER AT THIS DENSITY — 06 item 1, tested where it never was.

   The unifying device is 11's: the ground, plus the cut-out grammar, plus no treatment on the
   photographs. All three survive the density change intact.

     · ONE HEIGHT. Every object is drawn THUMB_H tall, exactly as the scroll draws every object
       DRAW_H tall. Widths are whatever the real thing is, so a musket runs five cells wide and a
       kouros is a sliver — which is what makes the shelf read as objects rather than as tiles.
     · NOTHING HAS AN EDGE BUT THE THING ITSELF. No card, no frame, no column rule, no crop. A
       row's right edge is ragged because that is where the objects stopped.
     · THE SAME LAND. The soil is baked from burial.js's own tile and mottle over the same
       contour function gravity.js bakes its surface from — same material, same four-value
       palette — and it is gated as byte-identical earth against the piece's. Its amplitude is
       scaled: the shelf is that land seen from far enough back to hold twelve thousand years,
       and the piece's own wander under an 80px object turns a row into a wave.
     · THE LIGHT IS STILL THE DATED SYSTEM (06 round 9). Each row is lit by the light of its own
       years, reach on the same smooth logistic and never a step per lamp, so the deep head sits
       under near-black and the last rows under a lit sky. THE EARTH NEVER TAKES IT — the soil
       strip is opaque and identical in every row, which is 13's frozen ground, gated. It is also
       12's flatness rule paid on this surface: row 1 and row 18 are not one picture in two tints.

   Two things the piece has that are deliberately NOT here, both because the geometry changed and
   not because they were dropped: the STARS (110px of sky reads a star field as noise rather than
   as a night) and THE TIE (a hairline between two objects says something when they are the only
   two things on a screen; between neighbours on a shelf where everything is already adjacent in
   time it says nothing, so co-occurrence is carried by the lighting instead).

   ------------------------------------------------------------------------------------------
   THE MEMORY ARITHMETIC, which 03 round 10 did before this file existed.

   This is the one screen that may hold every image at once, and decoded cost is `w x h x 4` off
   INTRINSIC dimensions — CSS SCALING DOES NOT REDUCE IT. So the index may not point at the
   scroll's sprites and shrink them in a stylesheet: it is A SECOND BAKE. `bake_index.py` writes
   ../webgl/thumb/ capped at THUMB_H x DPR_CAP = 160 device px, and all 230 resident measure
   26.2 MB against the 80 MB gate (45.6 MB at 01's 400-item ceiling). The next step up, 96 CSS
   px, is 66.8 MB at 400 items and leaves nothing for the scroll's own peak. */

import { ITEMS, lightFor, shortCred, fmt, unit } from './shell.js';
import { tileFor, mottle, hexA, noise1, rng } from './burial.js';

/* THE SHELF'S HEIGHT, and the two numbers bake_index.py derives its cap from. Moving either
   without re-baking is a red gate (`thumb_never_exceeds_its_draw`), not a silent forty megabytes.

   It is 80 on a wide screen and 64 on a phone, which is one number per viewport class rather than
   a constant — the same adaptation 06 already makes for the credit's type size and 04 makes for
   how many ties are drawn, and for the same reason. At 390px the shelf holds 2.8 objects a row at
   80px and 3.4 at 64px, which is 16 items a screen against 21 and twenty-nine screens of index
   against thirteen. 01's judgment test rules that directly: more things a stranger recognises on
   one screen wins, until an item is below the size where the photograph stops being enjoyable,
   and a 64px cut-out held at phone distance is not.

   THE BAKE CAP IS THE TALLEST OF THEM, once: 80 x dpr 2 = 160 device px, everywhere. A phone
   decodes 160 rows to draw 112 and that is waste rather than breach — the resident total is the
   same 26.2 MB either way, and a second narrow bake would be a second asset tree to keep true. */
const THUMB_WIDE = 80, THUMB_NARROW = 64;
export const THUMB_MAX = THUMB_WIDE;
export const DPR_CAP = 2;
let THUMB_H = THUMB_WIDE;

const GAP = 12;                        // between two objects on a shelf
const GUTTER_W = 92, GUTTER_N = 56;    // the reserved lane the row's span is printed in
const PAD = 18;
const AMP = 0.62;                      // the contour, seen from further back
const SKY_PAD = 14;                    // headroom over an object standing on a rise
/* earth under the lowest point of the contour, and it is not a look: it is the band an opened
   item's two lines of words have to fit inside. A cluster that runs past it is printed over the
   NEXT row's sky, which is the one surface the contrast gate is not solved against — the same
   rule 06 item 5 fell out of, and the harness holds it to it. */
const EARTH = 46;
const SOIL = { m: '#2b2620', d: '#4c4438', k: '#171410', l: '#5c5344' };
const W_YEARS = 80;                    // 04's contemporary window, unchanged

const THUMBS = window.THUMBS || {};
const el = document.getElementById('index');

/* the same three octaves gravity.js bakes its surface from, at the same frequencies, scaled */
const contour = x => AMP * (
  (noise1(x * 0.0012) - 0.5) * 44 +
  (noise1(x * 0.0064 + 11) - 0.5) * 15 +
  (noise1(x * 0.047 + 31) - 0.5) * 4);

/* ONE strip, baked at TWICE the viewport's width, and every row is laid at a different offset
   into it so no two rows stand on the same stretch of land.

   The doubling is not slack, it is the fix for a real seam. A strip exactly one viewport wide has
   to be tiled to survive an offset, and while the CONTOUR can be made periodic by cross-fading
   its ends, THE TEXTURE CANNOT: burial.js's 320px grain tile and 512px mottle are laid from x=0,
   so at the wrap their phase jumps and a vertical edge runs down the earth of every row. It was
   plainly visible at 390px, where the offset put it a third of the way across. Baked double, the
   window [off, off+W] never reaches the end, nothing wraps, and the contour needs no cross-fade
   either — which is one fewer thing pretending to be the land. */
let SW = 1440, STRIP_W = 2880;
let AMP_MAX = 12;                      // measured off the contour in measure(), not asserted here
let SOIL_TOP = AMP_MAX + 2;            // the nominal line, inside the strip
let STRIP_H = SOIL_TOP + AMP_MAX + EARTH;

let rows = [], cells = [], W = 0, contentW = 0, openIdx = -1;
let INDEX_TOP = 0, HEIGHT = 0, GEO = { skyH: 0, rowH: 0, gut: GUTTER_W };

/* ------------------------------------------------------------------ the ground, baked twice

   Once as a strip with a contour on it, which is the shelf every row stands on, and once as a
   flat field, which is what the credits roll lies in. Both are the SAME material: burial.js's
   tile and mottle over the same four-value palette, blitted opaque, taking no light. */

function bakeSoil(dpr) {
  const c = document.createElement('canvas');
  c.width = Math.round(STRIP_W * dpr); c.height = Math.round(STRIP_H * dpr);
  const g = c.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);

  const path = (off, step = 3) => {
    g.beginPath();
    g.moveTo(0, SOIL_TOP + contour(0) + off);
    for (let x = 0; x <= STRIP_W; x += step) g.lineTo(x, SOIL_TOP + contour(x) + off);
    g.lineTo(STRIP_W, STRIP_H); g.lineTo(0, STRIP_H); g.closePath();
  };

  g.fillStyle = g.createPattern(tileFor(SOIL, 3), 'repeat');
  path(0); g.fill();

  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = g.createPattern(mottle(), 'repeat');
  g.fillRect(0, 0, STRIP_W, STRIP_H);
  g.fillStyle = 'rgba(255,236,208,.016)';
  for (let k = 0; k < 9; k++) { path(k * 7, 6); g.fill(); }
  g.fillStyle = 'rgba(5,5,7,.055)';
  for (let k = 0; k < 10; k++) { path(k * 12, 10); g.fill(); }
  g.globalCompositeOperation = 'source-over';

  const r = rng(9001);                              // loose debris straddling the line
  for (let x = 0; x < STRIP_W; x += 2) {
    const q = r();
    if (q > 0.4) continue;
    const y = SOIL_TOP + contour(x) + (q - 0.2) * 12;
    const s = q < 0.05 ? 2 + q * 30 : 1 + q * 2;
    g.fillStyle = hexA(q < 0.2 ? SOIL.k : SOIL.l, 0.3 + q);
    g.fillRect(x + q * 4, y, s, s * 0.8);
  }
  return c;
}

function bakeDeep(dpr) {
  const s = 300;
  const c = document.createElement('canvas');
  c.width = c.height = Math.round(s * dpr);
  const g = c.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.fillStyle = g.createPattern(tileFor(SOIL, 3), 'repeat');
  g.fillRect(0, 0, s, s);
  g.globalCompositeOperation = 'source-atop';
  /* matched to the BOTTOM of the shelf strip, not picked: the strip lays ten passes of
     rgba(5,5,7,.055) over its depth, which is 1 - 0.945^10 = 43% of the way to black. A lighter
     field here prints a value step across the whole width where the shelf ends and the roll
     begins — the same hairline-along-the-horizon failure, turned ninety degrees. */
  g.fillStyle = 'rgba(5,5,7,.43)';
  g.fillRect(0, 0, s, s);
  return c;
}

/* ------------------------------------------------------------------ the era's light, per row

   The same curve as the piece: reach is a logistic on the year, never a step per lamp, so no era
   boundary is asserted (11's periodization warning). It paints the AIR over the row's soil and
   nothing else — the strip goes down over it, opaque. */

const REACH_MID = 1920, REACH_W = 45;
const logistic = y => 1 / (1 + Math.exp(-(y - REACH_MID) / REACH_W));
const REACH_TOP = logistic(2030);
export const reachFor = y => Math.min(1, logistic(y) / REACH_TOP);

function sky(year, skyH, w) {
  const L = [1, 3, 5].map(i => parseInt(lightFor(year)[1].substr(i, 2), 16));
  const lit = a => `rgba(${L.join(',')},${a})`;
  const r = reachFor(year);
  const stop = t => {
    const amt = (0.12 + 0.34 * t) * r * 0.24, dark = 4 + 2 * t;
    return `rgb(${L.map(v => Math.round(dark + v * amt)).join(',')})`;
  };
  /* THE POOL — the lamp itself, and the layer that actually makes this dated. Without it the
     shelf's sky moved ×3 from firelight to LED against the piece's ×10.8, because in the piece
     almost all of that range is the pool and not the gradient. Same geometry as gravity.js: a
     radius that grows with reach, centred on the soil line, so at firelight it is a small bright
     patch with dark ends to the row and at LED it is the whole width and nearly even. That shape
     change is 12's flatness rule paid on this surface — row 1 and row 20 are not one picture in
     two tints.

     At 0.62 of the piece's alpha, deliberately. The piece shows ONE of these at a time; the shelf
     shows five or six stacked, and at full strength six pools in a column is its own kind of
     flatness. */
  const R = Math.round(w * (0.34 + 0.86 * r));
  const K = 0.62;
  const a = (0.075 + 0.05 * r).toFixed(3);
  return {
    /* Stacked the way the piece stacks them: lit air lying on the land, then the lamp's pool,
       then the night graded to the horizon. */
    image: `linear-gradient(to bottom, ${lit(0)} 54%, ${lit(a)} 100%),` +
           `radial-gradient(${R}px ${R}px at 50% ${skyH}px, ` +
             `${lit(((0.30 - 0.11 * r) * K).toFixed(3))} 0%, ` +
             `${lit(((0.045 + 0.055 * r) * K).toFixed(3))} ${Math.round(34 + 28 * r)}%, ` +
             `${lit(0)} 100%),` +
           `linear-gradient(to bottom, ${stop(0)} 0, ${stop(0.55)} 55%, ${stop(1)} 100%)`,
    /* THE BASE COLOUR IS NOT A NICETY. The gradients are sized to the sky band, and the soil
       contour rises as much as AMP_MAX above the line — so without a base, the sliver above every
       dip is a band nothing clears and the row's own black shows through as a hairline along the
       horizon. That is exactly the defect 06 round 9's pixel scan found in the piece, and this is
       the same fix: everything below the gradient clamps to its horizon stop. */
    base: stop(1)
  };
}

/* ------------------------------------------------------------------ the layout

   Pure arithmetic over the BAKED dimensions, decided before one photograph is fetched. Rows and
   cells are absolutely positioned out of it, so there is no reflow to race and the no-collision
   contract is a sum rather than a hope. */

function measure() {
  W = innerWidth;
  const narrow = W < 720;
  THUMB_H = narrow ? THUMB_NARROW : THUMB_WIDE;
  const gut = narrow ? GUTTER_N : GUTTER_W;
  contentW = Math.max(120, W - PAD * 2 - gut);
  SW = Math.max(360, Math.round(W));
  STRIP_W = SW * 2;

  /* MEASURED off the contour rather than asserted next to it. Every vertical constant below is a
     function of how far the land actually wanders, and the previous version carried a hand-picked
     16 against a real 10.4 — 6px of dead air in every row, twenty times over. Sampled at 1px,
     which is the resolution the strip is drawn at, and the harness re-derives it. */
  AMP_MAX = 0;
  for (let x = 0; x <= STRIP_W; x++) AMP_MAX = Math.max(AMP_MAX, Math.abs(contour(x)));
  AMP_MAX = Math.ceil(AMP_MAX);
  SOIL_TOP = AMP_MAX + 2;
  STRIP_H = SOIL_TOP + AMP_MAX + EARTH;

  const skyH = THUMB_H + AMP_MAX + SKY_PAD;
  const rowH = skyH + AMP_MAX + EARTH;

  rows = [];
  let cur = null;
  cells = ITEMS.map((it, i) => {
    const d = THUMBS[it.k] || [THUMB_H * DPR_CAP, THUMB_H * DPR_CAP];
    let w = THUMB_H * d[0] / d[1], h = THUMB_H;
    // a thing wider than the shelf is the one place one height cannot hold: it comes down to fit
    if (w > contentW) { h = THUMB_H * (contentW / w); w = contentW; }
    return { it, i, w: Math.round(w), h: Math.round(h), x: 0, y: 0, row: 0, el: null };
  });

  for (const c of cells) {
    if (!cur || cur.w + c.w > contentW) {
      cur = { items: [], w: 0, i: rows.length, off: (rows.length * 977) % SW };
      rows.push(cur);
    }
    c.x = cur.w; c.row = cur.i;
    cur.w += c.w + GAP;
    cur.items.push(c);
  }
  for (const r of rows) {
    r.w -= GAP;
    r.y = r.i * rowH;
    r.years = r.items.map(c => c.it.y);
    r.year = r.years[r.years.length >> 1];
    r.lo = Math.min(...r.years); r.hi = Math.max(...r.years);
  }
  for (const c of cells) {
    // standing on the land: the foot sits on the local contour, not on a ruler
    c.y = skyH - c.h + contour(c.x + c.w / 2 + rows[c.row].off);
  }
  GEO = { skyH, rowH, gut };
  return GEO;
}

/* ------------------------------------------------------------------ building it */

export function build(top) {
  INDEX_TOP = top;
  const { skyH, rowH, gut } = measure();
  const dpr = Math.min(devicePixelRatio, DPR_CAP);
  /* WebP rather than PNG: the strip is 2,880 device px of grain and a base64 PNG of it is well
     over a megabyte of string. It is a texture, and a lossy texture is a texture. */
  const soilURL = bakeSoil(dpr).toDataURL('image/webp', 0.92);
  const deepURL = bakeDeep(dpr).toDataURL('image/webp', 0.92);

  el.innerHTML = '';

  for (const r of rows) {
    const s = sky(r.year, skyH, W);
    const row = document.createElement('div');
    row.className = 'irow';
    row.style.cssText =
      `top:${r.y}px;height:${rowH}px;background-color:${s.base};` +
      `background-image:url("${soilURL}"),${s.image};` +
      `background-repeat:no-repeat,no-repeat,no-repeat,no-repeat;` +
      `background-position:${-r.off}px bottom,0 0,0 0,0 0;` +
      `background-size:${STRIP_W}px ${STRIP_H}px,100% ${skyH}px,100% ${skyH}px,100% ${skyH}px;`;

    /* the row's own span, in the reserved lane. A READOUT, NOT A BOUNDARY: it says how much time
       this shelf happens to hold, which is "spaced by density, not by time" made visible. It lies
       IN THE EARTH — the one surface whose value never changes, which is where 06 item 5 solved
       the contrast problem once and for all. */
    const span = document.createElement('span');
    span.className = 'ispan';
    span.style.cssText = `left:${PAD}px;top:${skyH + AMP_MAX + 10}px;width:${gut - 12}px`;
    span.textContent = r.lo === r.hi ? `${fmt(r.lo)} ${unit(r.lo)}`
      : unit(r.lo) === unit(r.hi) ? `${fmt(r.lo)}–${fmt(r.hi)} ${unit(r.hi)}`
      : `${fmt(r.lo)} ${unit(r.lo)}–${fmt(r.hi)} ${unit(r.hi)}`;
    row.appendChild(span);

    for (const c of r.items) {
      const b = document.createElement('button');
      b.className = 'icell';
      b.type = 'button';
      b.dataset.i = c.i;
      b.style.cssText = `left:${PAD + gut + c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px`;
      b.setAttribute('aria-label', `${c.it.n}, ${c.it.disp}`);
      const im = document.createElement('img');
      im.src = `thumb/${c.it.k}.webp`;
      im.alt = '';
      im.loading = 'lazy';                          // the shelf is 100,000px past the first screen
      im.decoding = 'async';
      im.width = c.w; im.height = c.h;
      b.appendChild(im);
      row.appendChild(b);
      c.el = b;
    }
    el.appendChild(row);
    r.el = row;
  }

  const open = document.createElement('div');       // the opened item's words. One cluster, ever.
  open.className = 'iopen';
  open.id = 'iopen';
  el.appendChild(open);

  /* ---- the credits roll: all 230, lying in the earth under the shelf ---- */
  const rollTop = rows.length * rowH;
  const roll = document.createElement('div');
  roll.className = 'iroll';
  roll.style.cssText = `top:${rollTop}px;background-image:url("${deepURL}");background-size:300px 300px`;
  const h = document.createElement('p');
  h.className = 'irollh';
  h.textContent = 'Every image, and where it came from';
  roll.appendChild(h);
  const ol = document.createElement('ol');
  for (const it of ITEMS) {
    const li = document.createElement('li');
    const n = document.createElement('b'); n.textContent = it.n;
    const y = document.createElement('i'); y.textContent = it.disp;
    const s = document.createElement('span');
    s.textContent = `${it.src} · ${it.lic} · ${shortCred(it.cred)}`;
    li.append(n, y, s);
    ol.appendChild(li);
  }
  roll.appendChild(ol);
  el.appendChild(roll);

  HEIGHT = rollTop + roll.offsetHeight + 120;
  el.style.height = HEIGHT + 'px';
  return HEIGHT;
}

/* ------------------------------------------------------------------ opening one

   Everything within W_YEARS of it stays lit and the rest of the shelf goes down. That is the
   ambient engine at index density — the same quantity 04 spaced the whole scroll by, drawn as
   what is still standing rather than as what is on the ground.

   While one is open the row readouts go out. Not tidiness: the citation is the contract (06), and
   taking the only other text on the surface off the screen is what makes "this cluster of words
   overlaps nothing" true by construction rather than by a placement search. */

export function openAt(i) {
  const c = cells[i];
  if (!c) return;
  openIdx = i;
  const it = c.it;
  el.classList.add('isopen');
  for (const o of cells) {
    o.el.classList.toggle('lit', Math.abs(o.it.y - it.y) <= W_YEARS);
    o.el.classList.toggle('self', o.i === i);
  }

  /* TWO LINES, not three: name and date share one, the citation takes the next. The earth band
     between a row's soil line and the next row's sky is 46px, and three stacked lines do not fit
     in it. The date rides with the name for the same reason it does in the piece — they are one
     fact and they die together at the impact (13). */
  const box = document.getElementById('iopen');
  box.innerHTML = '';
  const head = document.createElement('span');
  head.className = 'h';
  const n = document.createElement('b'); n.textContent = it.n;
  const y = document.createElement('i'); y.textContent = it.disp;
  head.append(n, y);
  const cr = document.createElement('span');
  cr.className = 'c';
  cr.textContent = `${it.src} · ${it.lic} · ${shortCred(it.cred)}`;
  box.append(head, cr);
  /* Clamped into the shelf's own lane: never into the gutter the readout owns, never off the
     right edge, and never above its own soil line — 06 item 5's three placement rules, kept on a
     surface whose contrast is solved against the same earth. */
  const r = rows[c.row];
  const bw = Math.min(contentW, 460);
  const want = PAD + GEO.gut + c.x + c.w / 2 - bw / 2;
  box.style.display = 'block';
  box.style.top = (r.y + GEO.skyH + AMP_MAX + 4) + 'px';
  box.style.left = Math.max(PAD + GEO.gut, Math.min(PAD + GEO.gut + contentW - bw, want)) + 'px';
  box.style.width = bw + 'px';
}

export function close() {
  openIdx = -1;
  el.classList.remove('isopen');
  for (const o of cells) o.el.classList.remove('lit', 'self');
  const box = document.getElementById('iopen');
  box.style.display = 'none';
  box.innerHTML = '';
}

/* ------------------------------------------------------------------ the seam

   01: the piece "stops quietly into" this. So there is no route, no click and no transition to
   wait on — the same scrollbar keeps going, the piece's canvas and HUD go out over the screen
   before the shelf, and the shelf is already there underneath. Scroll-driven like everything
   else in the file: stop, and the fade stops with you. */

/* Two ends, and both of them are hard edges if they are got wrong.

   IT MAY NOT START BEFORE THE PIECE IS OVER. The last object's life ends at TOTAL, which is
   INDEX_TOP - 2H, and a fade that has begun before then is dimming a live object mid-fall.

   IT MUST FINISH BEFORE THE SHELF IS ON SCREEN. The shelf is in the document flow and paints OVER
   the fixed canvas, so a fade still running when the first row rises into the viewport — which
   happens at INDEX_TOP - H — prints a hard horizontal edge straight across the frame where the
   two meet. A stroke, which is the one thing 11 says nothing on this page has.

   So: open at TOTAL, shut 0.15 of a screen before the shelf arrives. */
export const fadeAt = (y, H) =>
  Math.max(0, Math.min(1, (y - (INDEX_TOP - H * 2)) / (H * 0.85)));

export const top = () => INDEX_TOP;
export const height = () => HEIGHT;

/* read by the headless sweep only; nothing in the page touches it */
export const probe = () => ({
  top: INDEX_TOP, height: HEIGHT, rows: rows.length, cells: cells.length, open: openIdx,
  THUMB_H, THUMB_MAX, DPR_CAP, GAP, AMP_MAX, contentW, gut: GEO.gut, pad: PAD,
  strip: STRIP_W, sw: SW, rowOff: rows.map(r => r.off),
  skyH: GEO.skyH, rowH: GEO.rowH, earth: EARTH,
  // the claim AMP_MAX makes, checked against the function rather than against this comment
  amp: Math.max(...Array.from({ length: STRIP_W + 1 }, (_, x) => Math.abs(contour(x)))),
  spans: rows.map(r => ({ i: r.i, lo: r.lo, hi: r.hi, n: r.items.length, year: r.year,
                          text: r.el.querySelector('.ispan').textContent }))
});

/* ------------------------------------------------------------------ wiring */

el.addEventListener('click', e => {
  const b = e.target.closest('.icell');
  if (!b) { if (openIdx >= 0) close(); return; }
  const i = +b.dataset.i;
  if (i === openIdx) close(); else openAt(i);
});
addEventListener('keydown', e => { if (e.key === 'Escape' && openIdx >= 0) close(); });
/* keyboard focus opens, a mouse click does not open twice: :focus-visible is exactly the
   distinction, and without it a click opens on focus and then closes on click. */
el.addEventListener('focusin', e => {
  const b = e.target.closest('.icell');
  if (b && b.matches(':focus-visible')) openAt(+b.dataset.i);
});
