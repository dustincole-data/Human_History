/* burial.js — what the earth is made of. Named for the accumulating ground of round 4, which
   was rejected as a concept; what survived it is the MATERIAL, and the material was the one
   thing that round got right.

   Built after the first earth was rejected: "It looks nothing like the earth is swallowing it.
   It looks like cheap absolute dog shit... that looks fake as hell."

   The diagnosis: the earth was one linear gradient filled as one full-width rect, painted OVER
   the objects at 12%→97% alpha, with a 1px white line for the ground. So it read as fog with a
   ruler across it. Everything in this file exists to defeat that, and the rules are absolute:

     · THE EARTH IS OPAQUE, always, everywhere it exists. Visibility below the surface is earned
       by geometry — a hole, a protrusion, a cut face — never by transparency.
     · Soil is never a hex. It is a four-value ramp with grain, inclusions and micro-bedding.
     · The surface is a heightfield — landform, undulation, grit — never a straight line.
     · Objects get a real silhouette profile sampled at their RESTING ANGLE, so the landing point
       is solved against the true edge of the photograph rather than against a bounding box.

   Nothing here touches a photograph's pixels. Marks are drawn in FRONT of the photo (occlusion)
   or the earth is drawn OVER it (also occlusion). No tint, no duotone, no grade, ever. */

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

/* ---------------------------------------------------------------- landing dust

   Soil does not splash upward, it squirts out sideways. Cone is measured from HORIZONTAL.

   04 ROUND 9 — SEEDED, AND BORN ONCE. Every value here used to come from `Math.random`: seven
   sites, and they were the largest of the three wall clocks left in the piece. The spray was
   therefore different on every visit to the same scroll position, which is why 03 round 10 had
   to abandon a pixel comparison of two first visits and settle for a structural one. The seed is
   the arrival's own index, so the spray is a function of WHICH OBJECT LANDED and of nothing else.

   A particle also keeps the state it was born with and is never spliced out of the list, because
   scrolling back up has to be able to put it back in the air. Death is `t >= life` — a predicate,
   read at draw time — rather than a removal, and the spray at any scroll position is the birth
   state integrated forward by the distance the scrollbar has covered since the impact. Exactly
   the treatment the shards get in decay.js, for exactly the same reason. */

function spark(r, x, y, i, pal) {
  const dir = i % 2 ? 1 : -1;
  const a = (r() * 34 - 17) * Math.PI / 180;                  // ±17° from horizontal
  const s = 60 + r() * 120;
  return { x, y, vx: Math.cos(a) * s * dir, vy: Math.sin(a) * s - 8, g: 300,
           r: 1 + r() * 2, t: 0, life: 500 + r() * 400,
           c: r() < 0.62 ? pal.d : pal.l };
}

export function impactDust(x, y, n, pal, seed) {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) out.push(spark(r, x, y, i, pal));
  return out;
}

/* fine dust hangs — the secondary breath, ~150ms after the hit */
export function breathDust(x, y, n, pal, seed) {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) out.push({
    x: x + (r() - 0.5) * 70, y, vx: (r() - 0.5) * 12,
    vy: -10 - r() * 10, g: -2, r: 0.8 + r() * 1.1,
    t: 0, life: 1500 + r() * 1000, c: pal.d
  });
  return out;
}

/* the pose a replay starts from, stamped once the whole spray exists */
export function stampDust(list) {
  for (const q of list) q.b = { x: q.x, y: q.y, vx: q.vx, vy: q.vy };
  return list;
}

export function rewindDust(list) {
  for (const q of list) { q.x = q.b.x; q.y = q.b.y; q.vx = q.b.vx; q.vy = q.b.vy; q.t = 0; }
}

export function stepDust(list, dt) {
  for (const q of list) {
    if (q.t >= q.life) continue;                              // spent, but still here
    q.t += dt;
    q.vy += q.g * dt / 1000;
    q.x += q.vx * dt / 1000;
    q.y += q.vy * dt / 1000;
  }
}

export function drawDust(ctx, list) {
  for (const q of list) {
    if (q.t >= q.life) continue;
    const k = q.t / q.life;
    const a = k > 0.7 ? (1 - k) / 0.3 : 1;
    ctx.fillStyle = hexA(q.c, 0.5 * a);
    ctx.fillRect(q.x, q.y, q.r, q.r);
  }
}
