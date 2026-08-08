/* burial.js — the material the three burial renderings are made of.

   Built after the first burial was rejected: "It looks nothing like the earth is swallowing it.
   It looks like cheap absolute dog shit... that looks fake as hell."

   The diagnosis: the earth was one linear gradient filled as one full-width rect, painted OVER
   the objects at 12%→97% alpha, with a 1px white line for the ground. So it read as fog with a
   ruler across it. Everything in this file exists to defeat that, and the rules are absolute:

     · THE EARTH IS OPAQUE, always, everywhere it exists. Visibility below the surface is earned
       by geometry — a hole, a protrusion, a cut face — never by transparency.
     · A stratum is never a hex. It is a four-value ramp with grain, inclusions and micro-bedding.
     · The surface is a heightfield — landform, undulation, grit, mounds — never a straight line.
     · Objects get a real silhouette profile sampled at their RESTING ANGLE, so ground can bank
       against them, grains can rest on them, and the burial line can follow their true edge.

   Nothing here touches a photograph's pixels. Marks are drawn in FRONT of the photo (occlusion)
   or the earth is drawn OVER it (also occlusion). No tint, no duotone, no grade, ever. */

/* ---------------------------------------------------------------- strata

   The same seven dated layers as before — they are the spine of the piece — but each is now a
   ramp: matrix, dust (dry dust is lighter than the matrix it came from), dark fleck, light fleck.
   Values run darker with time, and underground always runs darker than the sky above it. */

export const STRATA = [
  [-99999, 'EARTH',    { m: '#5a3f28', d: '#8a6b47', k: '#3a2817', l: '#9c8259' }],
  [-3000,  'SILT',     { m: '#6d5a3c', d: '#9c8560', k: '#46351f', l: '#ab9670' }],
  [-500,   'STONE',    { m: '#786d5a', d: '#a2977f', k: '#4e4636', l: '#b0a690' }],
  [1500,   'CLAY',     { m: '#52493c', d: '#7d7159', k: '#332c22', l: '#8a7f66' }],
  [1800,   'SOOT',     { m: '#38312a', d: '#5e5347', k: '#201b16', l: '#6b6053' }],
  [1900,   'ASH',      { m: '#2e2b28', d: '#55504a', k: '#1a1816', l: '#625d56' }],
  [1970,   'CONCRETE', { m: '#26272b', d: '#4c4e54', k: '#151619', l: '#585b62' }]
];

export const stratumIndex = y => { let i = 0; STRATA.forEach((s, j) => { if (y >= s[0]) i = j; }); return i; };
export const stratumFor = y => STRATA[stratumIndex(y)];

export const hexA = (h, a) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
  return `rgba(${r},${g},${b},${a})`;
};

/* deterministic noise, so a reload is the same landform */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const hash1 = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export const noise1 = x => {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return hash1(i) * (1 - u) + hash1(i + 1) * u;
};

/* ---------------------------------------------------------------- texture

   Smooth is fog. Grainy is ground. Each stratum gets a tile carrying the three things the eye
   actually reads in a soil profile photograph: speckle at grain scale, discrete inclusions
   (stones, charcoal flecks, shell), and faint horizontal micro-bedding — sediment beds flat. */

const tileCache = new Map();

export function tileFor(pal, seed = 0, size = 320) {
  const key = pal.m + ':' + seed;
  if (tileCache.has(key)) return tileCache.get(key);

  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = rng(seed * 7919 + 13);

  g.fillStyle = pal.m;
  g.fillRect(0, 0, size, size);

  // micro-bedding — the faint horizontal laminations that say "this was laid down, not painted"
  for (let i = 0; i < 5; i++) {
    const y0 = r() * size;
    g.strokeStyle = hexA(r() < 0.5 ? pal.k : pal.l, 0.07 + r() * 0.05);
    g.lineWidth = 1 + r();
    g.beginPath();
    for (let x = 0; x <= size; x += 8) g.lineTo(x, y0 + Math.sin(x * 0.021 + i * 2.3) * 3.5);
    g.stroke();
  }

  // grain speckle
  for (let i = 0; i < 2600; i++) {
    const x = r() * size, y = r() * size, w = 1 + r() * 1.5;
    g.fillStyle = hexA(r() < 0.52 ? pal.k : pal.d, 0.07 + r() * 0.20);
    g.fillRect(x, y, w, w * (0.6 + r() * 0.7));
  }

  // inclusions — drawn wrapped, so the tile has no seam the eye can lock onto
  for (let i = 0; i < 70; i++) {
    const x = r() * size, y = r() * size, rad = 1.6 + r() * 3.8;
    const rot = r() * 6.283, sq = 1 + r() * 0.9;
    g.fillStyle = hexA(r() < 0.55 ? pal.k : pal.l, 0.22 + r() * 0.34);
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
      g.beginPath();
      g.ellipse(x + dx, y + dy, rad * sq, rad * 0.62, rot, 0, 6.283);
      g.fill();
    }
  }

  tileCache.set(key, c);
  return c;
}

/* large soft value blobs, laid over the grain so the 320px tile never reads as a repeat */
let mottleTile = null;
export function mottle() {
  if (mottleTile) return mottleTile;
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = rng(4242);
  for (let i = 0; i < 34; i++) {
    const x = r() * size, y = r() * size, rad = 60 + r() * 190;
    const dark = r() < 0.5;
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
      const grd = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rad);
      grd.addColorStop(0, dark ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.09)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.fillRect(x + dx - rad, y + dy - rad, rad * 2, rad * 2);
    }
  }
  mottleTile = c;
  return c;
}

/* ---------------------------------------------------------------- silhouette profiles

   The single most important move in the whole direction: the alpha channel IS the asset.
   Sampled at the object's RESTING ANGLE, in world columns, so everything downstream — ash
   banking against a flank, grains resting on an up-facing edge, the ground gripping a rim —
   follows the true edge of the real photograph instead of a bounding box. */

export function restProfile(img, w, h, angle, colW = 4) {
  const cs = Math.abs(Math.cos(angle)), sn = Math.abs(Math.sin(angle));
  const bw = Math.ceil(w * cs + h * sn), bh = Math.ceil(h * cs + w * sn);
  const c = document.createElement('canvas');
  c.width = Math.max(1, bw); c.height = Math.max(1, bh);
  const g = c.getContext('2d');
  g.translate(bw / 2, bh / 2);
  g.rotate(angle);
  g.drawImage(img, -w / 2, -h / 2, w, h);

  const d = g.getImageData(0, 0, c.width, c.height).data;
  const n = Math.ceil(c.width / colW);
  const top = new Float32Array(n).fill(NaN);
  const bot = new Float32Array(n).fill(NaN);
  for (let y = 0; y < c.height; y++) {
    const row = y * c.width;
    for (let x = 0; x < c.width; x++) {
      if (d[(row + x) * 4 + 3] > 90) {
        const ci = (x / colW) | 0;
        if (Number.isNaN(top[ci])) top[ci] = y;
        bot[ci] = y;
      }
    }
  }
  // world offsets: profile column ci spans x = cx - bw/2 + ci*colW, y measured from cy - bh/2
  return { top, bot, n, colW, bw, bh, ox: -bw / 2, oy: -bh / 2 };
}

/* topmost opaque world-y of this object at world x, or null if the silhouette misses x */
export function profileTop(d, x) {
  const p = d.prof; if (!p) return null;
  const ci = Math.round((x - (d.body.position.x + p.ox)) / p.colW);
  if (ci < 0 || ci >= p.n || Number.isNaN(p.top[ci])) return null;
  return d.body.position.y + p.oy + p.top[ci];
}

/* ---------------------------------------------------------------- landing dust

   Soil does not splash upward, it squirts out sideways. Cone is measured from HORIZONTAL. */

export class Dust {
  constructor(max = 1200) { this.p = []; this.max = max; }

  impact(x, y, n, pal) {
    for (let i = 0; i < n && this.p.length < this.max; i++) {
      const dir = i % 2 ? 1 : -1;
      const a = (Math.random() * 34 - 17) * Math.PI / 180;      // ±17° from horizontal
      const s = 60 + Math.random() * 120;
      this.p.push({
        x, y, vx: Math.cos(a) * s * dir, vy: Math.sin(a) * s - 8, g: 300,
        r: 1 + Math.random() * 2, t: 0, life: 500 + Math.random() * 400,
        c: Math.random() < 0.62 ? pal.d : pal.l
      });
    }
  }

  /* fine dust hangs — the secondary breath, ~150ms after the hit */
  breath(x, y, n, pal) {
    for (let i = 0; i < n && this.p.length < this.max; i++) {
      this.p.push({
        x: x + (Math.random() - 0.5) * 70, y, vx: (Math.random() - 0.5) * 12,
        vy: -10 - Math.random() * 10, g: -2, r: 0.8 + Math.random() * 1.1,
        t: 0, life: 1500 + Math.random() * 1000, c: pal.d
      });
    }
  }

  step(dt) {
    for (let i = this.p.length - 1; i >= 0; i--) {
      const q = this.p[i];
      q.t += dt;
      if (q.t >= q.life) { this.p.splice(i, 1); continue; }
      q.vy += q.g * dt / 1000;
      q.x += q.vx * dt / 1000;
      q.y += q.vy * dt / 1000;
    }
  }

  draw(ctx, camY) {
    for (const q of this.p) {
      const k = q.t / q.life;
      const a = k > 0.7 ? (1 - k) / 0.3 : 1;
      ctx.fillStyle = hexA(q.c, 0.5 * a);
      ctx.fillRect(q.x, q.y - camY, q.r, q.r);
    }
  }
}

/* ---------------------------------------------------------------- the ground

   One heightfield, shared by all three renderings, sampled every 4px across the viewport and
   padded past both edges. Composed of: a landform that slowly becomes a different landform,
   an undulation, grit, and a mound for every object ever buried — because a fresh burial is a
   visible heap and a thousand-year-old one is a flat memory. That decay is what a tell IS. */

export class Ground {
  constructor() { this.colW = 4; this.pad = 80; this.resize(innerWidth); }

  resize(W) {
    this.W = W;
    this.n = Math.ceil((W + this.pad * 2) / this.colW) + 1;
    this.noise = new Float32Array(this.n);
    this.mound = new Float32Array(this.n);
    this.ash = new Float32Array(this.n);
    this.buried = [];                                  // everything the ground has taken
    this.marks = 0;                                    // stratum contacts laid down so far
    this.drift = 0;
    this.bake();
  }

  xAt(i) { return i * this.colW - this.pad; }
  idx(x) { return Math.max(0, Math.min(this.n - 1, Math.round((x + this.pad) / this.colW))); }

  /* landform · undulation · grit — three octaves, so the horizon is never traceable as one edge */
  bake() {
    for (let i = 0; i < this.n; i++) {
      const x = this.xAt(i);
      this.noise[i] =
        (noise1(x * 0.0011 + this.drift) - 0.5) * 90 +
        (noise1(x * 0.006 + this.drift * 2.1) - 0.5) * 26 +
        (noise1(x * 0.045 + this.drift * 4.7) - 0.5) * 5;
    }
  }

  /* the land itself has a history: each era is a different profile, crossfaded in */
  setDrift(d) { if (Math.abs(d - this.drift) > 0.001) { this.drift = d; this.bake(); } }

  gauss(arr, x, sigma, amp) {
    const i0 = this.idx(x - sigma * 3), i1 = this.idx(x + sigma * 3);
    for (let i = i0; i <= i1; i++) {
      const dx = this.xAt(i) - x;
      arr[i] += amp * Math.exp(-(dx * dx) / (2 * sigma * sigma));
    }
  }

  /* the swallow takes the deepest bite, it does not add them up — summing overlapping objects
     builds a mountain instead of a ground */
  gaussMax(arr, x, sigma, amp) {
    const i0 = this.idx(x - sigma * 3), i1 = this.idx(x + sigma * 3);
    for (let i = i0; i <= i1; i++) {
      const dx = this.xAt(i) - x;
      const v = amp * Math.exp(-(dx * dx) / (2 * sigma * sigma));
      if (v > arr[i]) arr[i] = v;
    }
  }

  /* every burial leaves a mound on the surface. It is a SURFACE feature, so it is capped and it
     decays — otherwise overlapping burials stack into a spike and the ground climbs off-screen. */
  noteBurial(x, w, h) {
    this.buried.push({ x, w, h, at: this.marks });
    this.gauss(this.mound, x, Math.max(18, 0.75 * w), 0.22 * h);
    for (let i = 0; i < this.n; i++) this.mound[i] = Math.min(this.mound[i], 120);
  }

  /* a fresh burial is a heap; a thousand-year-old one is a flat memory. That decay is what a
     barrow flattening into a tell actually is, so it runs continuously, against scroll. */
  weather(dScroll) {
    if (dScroll <= 0) return;
    const k = Math.max(0, 1 - dScroll * 0.0009);
    for (let i = 0; i < this.n; i++) this.mound[i] *= k;
  }

  /* a new stratum contact, draped over everything already buried under it — archaeologists
     find things by seeing strata bend, and each layer above flattens the bump a little more */
  newMark() {
    const d = new Float32Array(this.n);
    for (const b of this.buried) {
      this.gauss(d, b.x, Math.max(18, 0.75 * b.w), 0.35 * b.h * Math.pow(0.6, this.marks - b.at));
    }
    this.marks++;
    return d;
  }

  /* mounds flatten era by era — barrows becoming tells */
  decayMounds(k) { for (let i = 0; i < this.n; i++) this.mound[i] *= k; }

  /* ash deposits and then finds its angle of repose. This is the whole realism engine in A:
     deposits self-organise into drifts, cones and banks against obstacles, for free. */
  deposit(i, amt, obstacle) {
    this.ash[i] += amt;
    this.relax(i, obstacle);
  }

  relax(i0, obstacle) {
    const REPOSE = Math.tan(33 * Math.PI / 180) * this.colW;      // ~2.6px per column
    const stack = [i0];
    let guard = 0;
    while (stack.length && guard++ < 4000) {
      const i = stack.pop();
      for (const j of [i - 1, i + 1]) {
        if (j < 0 || j >= this.n) continue;
        // material will not flow uphill into a wall — an obstacle blocks the transfer,
        // which is what makes ash BANK against a flank instead of sliding past it
        if (obstacle && obstacle(j) > obstacle(i) + 6) continue;
        const d = this.ash[i] - this.ash[j];
        if (d > REPOSE) {
          const m = (d - REPOSE) * 0.5;
          this.ash[i] -= m; this.ash[j] += m;
          stack.push(i, j);
        }
      }
    }
  }
}

/* ---------------------------------------------------------------- the section's windows

   A ragged patch of cloud-blobs, then destination-in with the sprite's own alpha, so the hole
   can never leak outside the true silhouette. That coincidence of hole-edge and object-edge
   along part of its run is the Terracotta Pit 1 look: you see 35% of a thing crisply, not
   100% of it dimly. */

export function windowMask(img, w, h, frac, seed) {
  const c = document.createElement('canvas');
  c.width = Math.max(2, Math.round(w));
  c.height = Math.max(2, Math.round(h));
  const g = c.getContext('2d');
  const r = rng(seed);

  const ax = c.width * (0.2 + r() * 0.6), ay = c.height * (0.15 + r() * 0.6);
  const reach = Math.max(c.width, c.height) * (0.30 + frac * 0.55);
  const n = 22 + Math.floor(r() * 14);          // more, smaller lobes — a torn edge, not a lens
  g.fillStyle = '#fff';
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283, d = Math.pow(r(), 0.65) * reach;
    const rad = Math.max(5, reach * (0.09 + r() * 0.20));
    g.beginPath();
    g.ellipse(ax + Math.cos(a) * d, ay + Math.sin(a) * d, rad, rad * (0.65 + r() * 0.6), r() * 6.283, 0, 6.283);
    g.fill();
  }
  /* Clip to the sprite's own alpha — so the hole can never leak outside the true silhouette —
     and erode it by ~2px while doing it. Intersecting four shifted copies eats exactly the
     matte fringe the cut-out pipeline leaves behind, so the earth keeps that fringe covered
     instead of the window framing every fragment in a pale outline. */
  g.globalCompositeOperation = 'destination-in';
  for (const [dx, dy] of [[0, 0], [2, 0], [-2, 0], [0, 2], [0, -2]]) {
    g.drawImage(img, dx, dy, c.width, c.height);
  }
  return c;
}
