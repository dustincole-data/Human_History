/* decay.js — the material of round five: things break, and the pieces break.

   Round 4's accumulating ground was rejected outright — not its execution, the concept. Verbatim:
   "don't really love any of them." So decay moved out of the earth and into the object:

     objects break into pieces when they hit the ground, and the text goes away. As time goes on
     they break down into smaller and smaller pieces until they disintegrate into the ground.
     Don't have the ground change or build up over time. It can just remain still.

   Everything here serves that one sentence. The ground is not in this file at all.

   THE LEGAL BASIS, ruled before a line was written. Cutting a photograph is a CUT, not a grade.
   Every piece is the source image drawn through an alpha clip: every surviving pixel keeps its
   exact original RGB. That is the same operation class as the cut-outs the set already ships —
   the matte IS a destructive cut. Nothing is tinted, duotoned or graded at any stage, and the
   dust specks take their colour by SAMPLING THE PHOTOGRAPH'S OWN PIXELS, never a palette. */

import { rng } from './burial.js';

/* ---------------------------------------------------------------- seeds and cells */

/* blue-noise-ish sites, so cells come out similar in size instead of a few slivers and one slab */
export function sites(w, h, n, seed) {
  const r = rng(seed);
  const out = [];
  const min = Math.min(w, h) * (0.72 / Math.sqrt(n));
  for (let guard = 0; out.length < n && guard < n * 60; guard++) {
    const p = [r() * w, r() * h];
    if (out.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > min)) out.push(p);
  }
  return out;
}

/* keep the side of the bisector nearest this site — Sutherland–Hodgman, one half-plane at a time */
function clipHalf(poly, mx, my, dx, dy) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = (a[0] - mx) * dx + (a[1] - my) * dy;
    const db = (b[0] - mx) * dx + (b[1] - my) * dy;
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

/* Voronoi over the sprite's box. Straight edges — this is what a brittle break looks like. */
export function voronoi(w, h, pts, pad = 2) {
  return pts.map((s, i) => {
    let poly = [[-pad, -pad], [w + pad, -pad], [w + pad, h + pad], [-pad, h + pad]];
    for (let j = 0; j < pts.length && poly.length; j++) {
      if (j === i) continue;
      const o = pts[j];
      poly = clipHalf(poly, (s[0] + o[0]) / 2, (s[1] + o[1]) / 2, o[0] - s[0], o[1] - s[1]);
    }
    return { poly, site: s };
  }).filter(c => c.poly.length > 2);
}

/* ---------------------------------------------------------------- cutting

   Draw the source through the polygon, then trim to the pixels that actually survived. Trimming
   is what keeps 100+ live fragments cheap: a piece canvas is only as big as its own ink, and a
   polygon that landed entirely on transparent background returns null instead of a blank canvas. */

function trim(c) {
  const g = c.getContext('2d');
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;
  const tw = x1 - x0 + 1, th = y1 - y0 + 1;
  if (tw === c.width && th === c.height) return { cv: c, dx: 0, dy: 0 };
  const t = document.createElement('canvas');
  t.width = tw; t.height = th;
  t.getContext('2d').drawImage(c, -x0, -y0);
  return { cv: t, dx: x0, dy: y0 };
}

/* src is drawn at (0,0,w,h); poly is in that same space. Returns the piece plus its centre,
   measured from the sprite's centre, so it can be placed exactly where it used to be. */
export function cutPiece(src, w, h, poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0));
  x1 = Math.min(w, Math.ceil(x1)); y1 = Math.min(h, Math.ceil(y1));
  const cw = x1 - x0, ch = y1 - y0;
  if (cw < 1 || ch < 1) return null;

  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const g = c.getContext('2d');
  g.translate(-x0, -y0);
  g.beginPath();
  g.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) g.lineTo(poly[i][0], poly[i][1]);
  g.closePath();
  g.clip();
  g.drawImage(src, 0, 0, w, h);

  const t = trim(c);
  if (!t) return null;
  return {
    cv: t.cv,
    cx: x0 + t.dx + t.cv.width / 2 - w / 2,     // centre, relative to the sprite's centre
    cy: y0 + t.dy + t.cv.height / 2 - h / 2,
    w: t.cv.width, h: t.cv.height
  };
}

/* ---------------------------------------------------------------- the photograph's own colour

   A speck is the last thing left of a real photograph, so it is coloured by that photograph:
   the alpha-weighted mean of the pixels it was cut from. Never the ground palette, never a
   tint — sampling is reading, and reading is not grading. */

export function avgColor(cv) {
  const g = cv.getContext('2d');
  const d = g.getImageData(0, 0, cv.width, cv.height).data;
  let r = 0, gr = 0, b = 0, a = 0;
  for (let i = 0; i < d.length; i += 16) {
    const al = d[i + 3];
    if (al < 24) continue;
    r += d[i] * al; gr += d[i + 1] * al; b += d[i + 2] * al; a += al;
  }
  if (!a) return null;
  return [Math.round(r / a), Math.round(gr / a), Math.round(b / a)];
}

/* ---------------------------------------------------------------- the debris integrator

   NOT physics bodies. This is the whole answer to the fragment-count risk: matter.js only ever
   simulates the one object currently in the air. The instant it touches ground its body is
   destroyed and everything after that is these — a position, a velocity, a canvas, and a flag
   that says it has stopped. A resting piece costs one drawImage and zero maths. */

export function makePiece(p, x, y, vx, vy, vrot, rot = 0) {
  return stamp({ cv: p.cv, w: p.w, h: p.h, x, y, vx, vy, rot, vrot,
                 rest: false, bounce: 1, sink: 0, born: 0, dead: false });
}

/* 04 ROUND 9 — THE POSE A REPLAY STARTS FROM. `stepPieces` is forward Euler with a latch, so it
   cannot be run backwards; what runs backwards is the scroll position, and the way to honour that
   is to keep the state the piece was BORN in and integrate to wherever the scrollbar now is. Every
   piece therefore carries its own birth, and a generation is rewound rather than reversed.

   Re-stamped by any caller that moves a piece after making it — `keepWhole` beds the ending into
   the surface, and a birth that predates that would put the ending three pixels high on the first
   rewind. */
export function stamp(p) {
  p.b = { x: p.x, y: p.y, vx: p.vx, vy: p.vy, rot: p.rot, vrot: p.vrot };
  return p;
}

export function rewindPieces(list) {
  for (const p of list) {
    const b = p.b;
    p.x = b.x; p.y = b.y; p.vx = b.vx; p.vy = b.vy; p.rot = b.rot; p.vrot = b.vrot;
    p.rest = false; p.bounce = 1;
  }
}

export function stepPieces(list, dt, surfAt) {
  const s = Math.min(0.05, dt / 1000);
  for (const p of list) {
    if (p.rest) continue;
    p.vy += 1500 * s;
    p.x += p.vx * s;
    p.y += p.vy * s;
    p.rot += p.vrot * s;
    p.vx *= 0.995;
    const half = p.h * 0.40;
    const gy = surfAt(p.x);
    if (p.y + half >= gy) {
      p.y = gy - half;
      // one small bounce if it arrived fast, then it is inert soil-bound debris for good
      if (p.vy > 260 && p.bounce > 0) {
        p.bounce--;
        p.vy = -p.vy * 0.24; p.vx *= 0.55; p.vrot *= 0.4;
      } else {
        p.rest = true; p.vx = p.vy = p.vrot = 0;
        p.y = gy - half + p.sink;
      }
    }
  }
}

export function drawPieces(ctx, list) {
  for (const p of list) {
    if (p.dead) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.rot) ctx.rotate(p.rot);
    ctx.drawImage(p.cv, -p.w / 2, -p.h / 2);
    ctx.restore();
  }
}

/* Specks are the end state and they are driven straight off the scroll clock, not integrated —
   see the speck block in gravity.js. They sink until the opaque earth is over them, which is
   how a thing disappears here: geometry, never a fade to nothing. */
