/* Round 11 — TICKET 10, the index surface. Same harness pattern as round 10: a FRESH LOAD for
   every phase, real rAF ticks between instant scrolls, nothing believed that a probe or a
   screenshot did not say, and a --slow mode that holds every image so localhost stops hiding the
   network. Run alongside sweep10.mjs, which re-runs the piece's own 39.

   The one structural difference from round 10's sweep: the shelf is DOM over CSS, not DOM over a
   canvas, so there is no getImageData to read a word's background out of. Contrast is therefore
   measured off a REAL SCREENSHOT — the text is hidden, the frame is captured, and the page decodes
   its own PNG back into a canvas so the composited pixel under every word can be sampled. Same
   method as 06 item 5, different source. */
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const BASE = 'http://127.0.0.1:8812';
const URL = BASE + '/index.html';
const OUT = process.argv.find(a => a.endsWith('.json')) || null;
const SLOW = process.argv.includes('--slow');
const results = [];
const ok = (n, pass, note) => { results.push({ n, pass, note }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${n}  ${note ?? ''}`); };

const browser = await chromium.launch();
let page, errors = [];

async function newPage(w = 1440, h = 900) {
  if (page) await page.close();
  page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  /* "Failed to load resource: 404" does not say WHICH resource, and a gate that reports a number
     without the thing it measured costs a round to chase. The URL comes off the response. */
  page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  page.on('pageerror', e => errors.push(String(e)));
  if (SLOW) await page.route('**/{img,thumb}/*.webp', async route => {
    await new Promise(r => setTimeout(r, 40 + Math.floor(Math.random() * 300)));
    await route.continue();
  });
}

const tick = async (n = 3) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise(requestAnimationFrame)); };
const to = async (y, n = 3) => { await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await tick(n); };
const fresh = async (w = 1440, h = 900) => {
  await newPage(w, h);
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hh && window.__hh.index, null, { timeout: 90000 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);
};
/* every lazy thumbnail asked for, so a gate never reads a shelf that is still arriving */
const walkShelf = async () => {
  const I = await page.evaluate(() => window.__hh.index());
  const h = await page.evaluate(() => innerHeight);
  for (let y = I.top - h; y < I.top + I.height; y += h * 0.6) { await to(y, 1); await page.waitForTimeout(SLOW ? 130 : 55); }
  await page.waitForFunction(() => [...document.querySelectorAll('.icell img')].every(i => i.complete),
                             null, { timeout: 120000 });
  return I;
};

/* --------------------------------------------------------------- the composited-pixel reader

   Hide the surface's text, screenshot, hand the PNG back to the page, decode it into a canvas,
   and sample. What comes out is the real pixel a word is sitting on, after every gradient, every
   opacity and the baked strip have composited — not a colour this harness computed. */
async function background(hideCells = false) {
  /* ROUND 9's LESSON, REPEATED HERE BEFORE IT COST ANYTHING. Two of that round's sky gates read
     a falling photograph as sky and reported a difference that was one sprite's edges. A probe
     of this shelf did the same thing louder: sampling the sky band at mid-height returned 255 on
     any row holding a gold artifact. Every reading of the air is therefore taken with the
     objects out of the frame. */
  await page.addStyleTag({ content: '.ispan,.iopen{visibility:hidden!important}' +
    (hideCells ? '.icell{visibility:hidden!important}' : '') });
  await tick(2);
  const b64 = (await page.screenshot()).toString('base64');
  await page.evaluate(() => document.querySelectorAll('style').forEach(s => {
    if (s.textContent.includes('.ispan,.iopen{visibility:hidden')) s.remove();
  }));
  await tick(2);
  await page.evaluate(async b => {
    const im = new Image();
    im.src = 'data:image/png;base64,' + b;
    await im.decode();
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    c.getContext('2d').drawImage(im, 0, 0);
    window.__bg = c.getContext('2d');
  }, b64);
}
const CONTRAST = `
  var lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v+0.055)/1.055, 2.4); };
                     return 0.2126*f(c[0]) + 0.7152*f(c[1]) + 0.0722*f(c[2]); };
  var ratio = (a, b) => { var l1 = lum(a), l2 = lum(b);
                            return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };`;

/* =============================================================== phase 1 — the arithmetic */
await fresh();
let I = await page.evaluate(() => window.__hh.index());
const H0 = await page.evaluate(() => innerHeight);
const TOTAL = await page.evaluate(() => window.__hh.TOTAL);
console.log(`\nindex top ${I.top}  height ${I.height}px (${(I.height / H0).toFixed(1)} screens)  ${I.rows} rows  ${I.cells} cells`);
console.log(`thumb ${I.THUMB_H} css (cap ${I.THUMB_MAX} x dpr ${I.DPR_CAP} = ${I.THUMB_MAX * I.DPR_CAP})  contour ±${I.amp.toFixed(2)} vs AMP_MAX ${I.AMP_MAX}\n`);

ok('amp_is_measured_not_asserted', I.amp <= I.AMP_MAX && I.AMP_MAX - I.amp < 1,
   `contour reaches ±${I.amp.toFixed(2)}px, geometry built on ±${I.AMP_MAX}`);

/* the whole set is laid out; nothing was dropped by the wrap */
const laid = await page.evaluate(() => ({
  cells: document.querySelectorAll('.icell').length,
  imgs: document.querySelectorAll('.icell img').length,
  items: window.ITEMS.length
}));
ok('every_item_is_on_the_shelf', laid.cells === laid.items && laid.imgs === laid.items,
   `${laid.cells} cells for ${laid.items} items`);

/* =============================================================== phase 2 — the second bake */
await fresh();
I = await walkShelf();
const bake = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('.icell img')];
  let px = 0, tallest = 0, overdrawn = 0, notThumb = 0, broken = 0;
  const H = window.__hh.index();
  for (const i of imgs) {
    if (!i.naturalWidth) { broken++; continue; }
    px += i.naturalWidth * i.naturalHeight;
    tallest = Math.max(tallest, i.naturalHeight);
    if (i.getBoundingClientRect().height > H.THUMB_H + 0.6) overdrawn++;
    if (!/\/thumb\//.test(i.src)) notThumb++;
  }
  return { px, tallest, overdrawn, notThumb, broken, n: imgs.length,
           sprites: window.__hh.held().length, peakSprite: window.__hh.peakHeld() };
});
const MB = b => b / 1048576;
const decMB = MB(bake.px * 4);

ok('index_is_a_second_bake', bake.notThumb === 0 && bake.broken === 0,
   bake.notThumb ? `${bake.notThumb} cells point at the sprite bake` : `all ${bake.n} cells load from thumb/, none broken`);

ok('thumb_never_exceeds_its_draw', bake.tallest <= I.THUMB_MAX * I.DPR_CAP && bake.overdrawn === 0,
   `tallest file ${bake.tallest}px against the ${I.THUMB_MAX * I.DPR_CAP}px cap; ${bake.overdrawn} drawn taller than ${I.THUMB_H}`);

ok('index_decoded_under_the_gate', decMB < 80,
   `${decMB.toFixed(1)}MB with all ${bake.n} resident, against an 80MB gate ` +
   `(${(decMB * 400 / bake.n).toFixed(1)}MB at 01's 400-item ceiling; ${MB(65.8 * 1048576).toFixed(1)}MB if it had pointed at the sprites)`);

ok('index_never_holds_a_sprite', bake.sprites === 0,
   `${bake.sprites} of the piece's photographs resident on the shelf`);

/* =============================================================== phase 3 — no collision */
async function collide(w, h) {
  await fresh(w, h);
  const II = await walkShelf();
  await to(II.top + 1200, 3);
  const r = await page.evaluate(() => {
    const boxes = [];
    const push = (e, kind) => {
      const b = e.getBoundingClientRect();
      if (b.width < 0.5 || b.height < 0.5) return;
      boxes.push({ x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height, kind,
                   id: e.dataset?.i ?? e.textContent.slice(0, 18) });
    };
    document.querySelectorAll('.icell').forEach(e => push(e, 'cell'));
    document.querySelectorAll('.ispan').forEach(e => push(e, 'span'));
    let hits = 0; const first = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 &&
          a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) {
        hits++; if (first.length < 3) first.push(`${a.kind}:${a.id} × ${b.kind}:${b.id}`);
      }
    }
    return { n: boxes.length, hits, first };
  });
  ok(`no_cell_collision_${w}`, r.hits === 0,
     r.hits ? r.first.join(' | ') : `0 overlaps over ${r.n} boxes — every cell and every row span`);

  /* the shelf is laid to the viewport, so nothing on it may push the document sideways */
  let over = 0;
  for (const y of [II.top - 200, II.top + 400, II.top + II.height * 0.4, II.top + II.height - 900]) {
    await to(y, 2);
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) over++;
  }
  ok(`index_no_h_overflow_${w}`, over === 0, `${over} of 4 shelf positions overflow horizontally`);
  return II;
}
await collide(1440, 900);
const Im = await collide(390, 844);
console.log(`  phone: ${Im.rows} rows, ${(Im.height / 844).toFixed(1)} screens, thumb ${Im.THUMB_H}px\n`);

/* =============================================================== phase 4 — opening one

   The lit set is checked against THE DATES, not against anything the page stores about itself.
   06 round 8 lost two gates to exactly that: a gate that asks the page whether it agrees with
   the page is a tautology, and corrupting the stored value moves both sides together. */
await fresh();
I = await walkShelf();
const SAMPLES = [8, 60, 120, 176, 214];
const litBad = [], boxBad = [];
let checked = 0, litTotal = 0;
for (const i of SAMPLES) {
  await page.evaluate(n => window.__hh.indexOpen(n), i);
  await page.waitForTimeout(300); await tick(2);
  const r = await page.evaluate(n => {
    const years = window.ITEMS.map(t => t.y), y0 = years[n];
    const want = new Set(years.map((y, j) => Math.abs(y - y0) <= 80 ? j : -1).filter(j => j >= 0));
    const got = new Set([...document.querySelectorAll('.icell.lit')].map(e => +e.dataset.i));
    const miss = [...want].filter(j => !got.has(j)), extra = [...got].filter(j => !want.has(j));
    const self = [...document.querySelectorAll('.icell.self')].map(e => +e.dataset.i);
    const box = document.getElementById('iopen').getBoundingClientRect();
    const cell = document.querySelector(`.icell[data-i="${n}"]`);
    const row = cell.parentElement.getBoundingClientRect();
    const H = window.__hh.index();
    const soil = row.top + H.skyH + H.AMP_MAX;         // the deepest the contour can put the line
    return { want: want.size, miss: miss.length, extra: extra.length, self,
             above: box.top < soil - 0.5, below: box.bottom > row.bottom + 0.5,
             gutter: box.left < H.pad + H.gut - 0.5, right: box.right > innerWidth - 0.5,
             text: document.getElementById('iopen').textContent.slice(0, 40),
             spansHidden: [...document.querySelectorAll('.ispan')].every(s => getComputedStyle(s).opacity === '0') };
  }, i);
  checked++; litTotal += r.want;
  if (r.miss || r.extra || r.self.length !== 1 || r.self[0] !== i)
    litBad.push(`item ${i}: ${r.miss} missing, ${r.extra} extra, self=${r.self}`);
  if (r.above || r.below || r.gutter || r.right)
    boxBad.push(`item ${i}: ${[r.above && 'above its soil', r.below && 'past its row', r.gutter && 'in the gutter', r.right && 'off the right'].filter(Boolean).join(', ')}`);
  if (!r.spansHidden) boxBad.push(`item ${i}: row readouts still on`);
}
ok('open_lights_the_contemporary_window', litBad.length === 0,
   litBad.length ? litBad.slice(0, 2).join(' | ')
                 : `${checked} items opened, ${litTotal} lit cells, every one within 80 years by the dates`);
ok('open_words_lie_in_their_own_earth', boxBad.length === 0,
   boxBad.length ? boxBad.slice(0, 2).join(' | ')
                 : `${checked} clusters, all below their own soil line, inside their row, clear of the gutter`);

const closed = await page.evaluate(() => {
  window.__hh.indexClose();
  return { lit: document.querySelectorAll('.icell.lit,.icell.self').length,
           box: getComputedStyle(document.getElementById('iopen')).display,
           txt: document.getElementById('iopen').textContent };
});
ok('close_puts_the_shelf_back', closed.lit === 0 && closed.box === 'none' && closed.txt === '',
   `${closed.lit} cells left lit, cluster display:${closed.box}`);

/* =============================================================== phase 5 — attribution */
await fresh();
const roll = await page.evaluate(() => {
  const li = [...document.querySelectorAll('.iroll li')];
  const items = window.ITEMS;
  let bad = 0, first = '';
  li.forEach((e, k) => {
    const t = e.textContent, it = items[k];
    if (!it || !t.includes(it.n) || !t.includes(it.disp) || !t.includes(it.src) || !t.includes(it.lic)) {
      bad++; if (!first) first = `${it ? it.k : k}: "${t.slice(0, 60)}"`;
    }
  });
  const labels = [...document.querySelectorAll('.icell')]
    .filter(b => !b.getAttribute('aria-label')?.includes(items[+b.dataset.i].n)).length;
  return { n: li.length, want: items.length, bad, first, labels };
});
ok('every_item_carries_its_attribution', roll.n === roll.want && roll.bad === 0 && roll.labels === 0,
   roll.bad ? roll.first : `${roll.n} credits in the roll, each with name, date, source and licence; ${roll.labels} cells without a name`);

/* =============================================================== TICKET 14 — the signature

   Both halves of ruling B, each checked where it actually lives. The pill rides the piece and goes
   out with the seam; the colophon carries the mark again plus the one link off this site. The
   failure this is aimed at is the obvious one — two copies of the same mark on screen together
   once the roll comes up — and the less obvious one, a colophon that quietly loses the link. */
const sig = await page.evaluate(() => {
  const pill = document.getElementById('mark');
  const colo = document.querySelector('.icolo');
  const mk = colo && colo.querySelector('.dcd-mark');
  const out = colo && colo.querySelector('a.out');
  return {
    pill: !!pill, pillHref: pill && pill.getAttribute('href'),
    pillLabel: pill && pill.getAttribute('aria-label'),
    dot: !!(pill && pill.querySelector('.dcd-mark-dot')),
    dotFill: pill && getComputedStyle(pill.querySelector('.dcd-mark-dot')).fill,
    coloMark: !!mk, coloIds: document.querySelectorAll('#mark').length,
    outHref: out && out.getAttribute('href'), outText: out && out.textContent
  };
});
ok('signature_is_the_shared_mark', sig.pill && sig.coloMark && sig.coloIds === 1 &&
   sig.pillHref === 'https://dustincoledata.com' && sig.dot && sig.dotFill === 'rgb(138, 160, 255)',
   sig.coloIds !== 1 ? `${sig.coloIds} elements carry id="mark"`
     : `pill + colophon, one id, ${sig.pillHref}, brand-blue period ${sig.dotFill}`);
ok('colophon_links_to_deep_time', sig.outHref === 'https://deeptime.dustincoledata.com' && !!sig.outText,
   sig.outHref ? `${sig.outHref} — "${sig.outText}"` : 'no outbound link in the colophon');

/* on the piece, and gone by the shelf — measured at three positions, not asserted */
{
  const opacityAt = async y => { await to(y, 4);
    return page.evaluate(() => { const c = getComputedStyle(document.getElementById('mark'));
      return { o: +c.opacity, v: c.visibility }; }); };
  const I2 = await page.evaluate(() => window.__hh.index());
  const onPiece = await opacityAt(Math.round(await page.evaluate(() => window.__hh.TOTAL) * 0.5));
  const midSeam = await opacityAt(I2.top - 1400);
  const onShelf = await opacityAt(I2.top + 1400);
  ok('signature_goes_out_with_the_piece',
     onPiece.o > 0.5 && onPiece.v === 'visible' &&
     midSeam.o < onPiece.o && midSeam.o > 0 &&
     onShelf.o === 0 && onShelf.v === 'hidden',
     `opacity ${onPiece.o} on the piece → ${midSeam.o.toFixed(3)} mid-seam → ${onShelf.o} (${onShelf.v}) on the shelf`);
}

/* =============================================================== phase 6 — the seam */
await fresh();
const seam = await page.evaluate(() => {
  const H = window.__hh, I = H.index(), h = innerHeight;
  return { atTotal: H.fadeAt(H.TOTAL), atShelfEdge: H.fadeAt(I.top - h),
           beforeTotal: H.fadeAt(H.TOTAL - 1), top: I.top, TOTAL: H.TOTAL, h };
});
ok('piece_is_gone_before_the_shelf', seam.atShelfEdge >= 1 && seam.beforeTotal === 0,
   `fade 0 at TOTAL-1, ${seam.atShelfEdge.toFixed(2)} by the time the first row enters the viewport ` +
   `(${seam.top - seam.TOTAL}px of runway, ${(seam.top - seam.TOTAL) / seam.h} screens)`);

/* THE DEFECT THIS GATE WAS WRITTEN FOR. The first build returned out of the frame before the
   update loop, so any object still holding words when the fade completed never reached its own
   unbuild() — three citations stayed printed in the fixed label layer, over the shelf, for the
   rest of the page. */
await to(I.top + 1400, 6);
const stopped = await page.evaluate(() => ({
  gl: getComputedStyle(document.getElementById('gl')).visibility,
  hud: getComputedStyle(document.getElementById('hud')).visibility,
  words: [...document.querySelectorAll('#labels span:not(.sr)')].filter(s => +s.style.opacity > 0.02).length,
  nodes: document.querySelectorAll('#labels span:not(.sr)').length
}));
ok('the_piece_leaves_nothing_on_the_shelf',
   stopped.gl === 'hidden' && stopped.hud === 'hidden' && stopped.words === 0 && stopped.nodes === 0,
   `canvas ${stopped.gl}, hud ${stopped.hud}, ${stopped.words} of the piece's words still printed (${stopped.nodes} nodes)`);

/* the seam is a position, so it runs both ways and it does not drift on a clock */
await to(0, 3);
await to(I.top - 1400, 5);
const f1 = await page.evaluate(() => +getComputedStyle(document.getElementById('gl')).opacity);
await to(I.top + 40000, 3); await to(0, 3); await to(I.top - 1400, 5);
const f2 = await page.evaluate(() => +getComputedStyle(document.getElementById('gl')).opacity);
await page.waitForTimeout(2000); await tick(4);
const f3 = await page.evaluate(() => +getComputedStyle(document.getElementById('gl')).opacity);
ok('seam_is_scroll_only', f1 === f2 && f2 === f3 && f1 > 0 && f1 < 1,
   `opacity ${f1} → ${f2} → ${f3} mid-fade, two paths plus 2s of wall clock`);

/* ROUND 12 REWROTE THIS GATE. It used to shoot where the seam gate above left off — which is
   2000ms of waitForTimeout plus four ticks after the last scroll — so the page had already been
   given two seconds to settle before the FIRST screenshot. Any clock that converges inside two
   seconds was therefore finished before shot A, and the gate compared two identical stills of a
   page that had in fact been moving the whole time: `seam_on_a_clock` drove the real opacity off
   an 8%-per-frame ease, `seam_is_scroll_only` caught it 0.632 → 0.561 → 0.478, and this gate
   reported green beside it. It now does its own scroll and shoots IMMEDIATELY, so the two seconds
   of wall clock fall BETWEEN the frames rather than before them, which is what "stop scrolling
   and everything stops" actually claims. */
await to(0, 3);
await to(I.top - 1400, 2);
/* 04 ROUND 9 ADDS ONE WAIT, AND IT IS NOT ROUND 12'S WAIT COMING BACK. What round 12 removed was
   a fixed 2000ms sleep, which finished any ease before the first shot and hid it. This waits on
   `pending()` and `queue.length` — assets in flight and cuts not yet made — and an ease is neither,
   so a value drifting on a clock still runs straight through it and the A/B across two seconds
   still catches it.

   It is needed because the rewind widened the window. A jump to the seam now fetches photographs
   for AHEAD + FALL + BACK and builds the wrecks of objects the visitor has already passed, so the
   page takes about 84 frames to finish assembling where it used to take a handful — measured, and
   frozen the moment it is done. That is "no pixels, no fall" (03) at the size the rewind made it,
   and it is what the piece pays so that scrolling back up costs nothing. */
for (let i = 0; i < 60; i++) {
  const q = await page.evaluate(() => ({ p: window.__hh.pending(), q: window.__hh.queue.length }));
  if (!q.p && !q.q) break;
  await tick(3);
}
await tick(8);
const shotA = await page.screenshot();
await page.waitForTimeout(2000);
const shotB = await page.screenshot();
ok('index_frozen_when_idle', Buffer.compare(shotA, shotB) === 0,
   'byte-identical across 2s of wall clock, both frames taken after the scroll stopped');

/* =============================================================== phase 7 — light and earth

   THE FIRST VERSION OF THIS PHASE TESTED NOTHING. It read the five rows visible on one screen at
   the top of the shelf — all five in the deep head, all five at reach 0 — and reported "sky value
   4 → 4 → 4 → 4 → 4" as a pass. Every row is walked now, firelight to LED, which is the only way
   a gate about a DATED backdrop can be about anything. Same lesson as round 9's two sky gates:
   the reading has to be taken where the thing being claimed actually varies. */
await fresh();
I = await walkShelf();
const era = [];
for (let k = 0; k < I.rows; k++) {
  const rowY = await page.evaluate(n => {
    const r = document.querySelectorAll('.irow')[n];
    return r.getBoundingClientRect().top + scrollY;
  }, k);
  await to(Math.max(0, rowY - 200), 3);
  await background(true);
  const r = await page.evaluate(n => {
    const H = window.__hh.index(), g = window.__bg;
    const row = document.querySelectorAll('.irow')[n];
    const b = row.getBoundingClientRect();
    const px = (x, y) => { const d = g.getImageData(Math.round(x), Math.round(y), 1, 1).data; return [d[0], d[1], d[2]]; };
    /* THE UPPER SKY, which is where reach reads and where the piece's own gate reads it too
       (round 9 samples the top 45%). Lower down, the lamp's pool and the haze dominate and a
       firelight pool is genuinely as bright as an LED sky — that is what firelight is, not a
       flaw, and measuring there would report a ratio of one on a backdrop that plainly changes. */
    const sky = Math.max(...[10, 220, 430, 900, 1300].filter(x => x < innerWidth - 4)
                                                     .map(x => Math.max(...px(x, b.top + 4))));
    /* the earth, sampled in STRIP coordinates so two rows laid at different offsets are compared
       at the SAME stretch of land. A light that had reached the soil would show here and nowhere
       else — 13's frozen ground, on the shelf. */
    const soil = [];
    for (const u of [140, 300, 520, 760]) {
      const x = u - H.rowOff[n];
      soil.push(x < 2 || x > innerWidth - 2 ? null : px(x, b.bottom - 14).join('/'));
    }
    return { sky, soil };
  }, k);
  const meta = I.spans[k];
  era.push({ k, year: meta.year, reach: +(await page.evaluate(y => window.__hh.index() && y, 0), 0),
             sky: r.sky, soil: r.soil });
}
{
  const R = await page.evaluate(ys => ys.map(y => Math.round(1000 / (1 + Math.exp(-(y - 1920) / 45)) / (1 / (1 + Math.exp(-(2030 - 1920) / 45))))),
                                era.map(e => e.year));
  era.forEach((e, i) => { e.reach = R[i]; });
}
/* THE GATE IS THE CLAIM, AND THE CLAIM IS NOT THE PIECE'S NUMBER. The piece's own
   `backdrop_is_dated` demands ×4 and measures ×10.8 — but it has 640px of sky and reads the top
   of it, where the skyglow has the whole height to build. A row band is 110px and its top is much
   nearer the horizon, so the identical curve necessarily reports a smaller ratio. Copying ×4 over
   here would be gating this surface on the other surface's geometry.

   What is actually being claimed is three things, and all three are checked: the sky NEVER goes
   backwards as the years run forward; two rows whose lamp-reach is the same are byte-identical,
   which is the honest half and the thing that would catch a decorative tint; and the two ends
   differ by more than a factor of two, which is far above anything a screen could call the same
   value. The measured span is reported rather than hidden behind the threshold. */
const first = era[0], last = era[era.length - 1];
const span = last.sky / Math.max(1, first.sky);
const lightBad = [];
for (let k = 1; k < era.length; k++)
  if (era[k].sky < era[k - 1].sky - 1) lightBad.push(`row ${k} (${era[k].year}) darker than row ${k - 1}`);
const byReach = new Map();
for (const e of era) {
  if (byReach.has(e.reach) && byReach.get(e.reach) !== e.sky)
    lightBad.push(`rows at reach ${e.reach} disagree: ${byReach.get(e.reach)} vs ${e.sky}`);
  byReach.set(e.reach, e.sky);
}
const flat = era.filter(e => e.sky === first.sky).length;
ok('index_light_is_dated', lightBad.length === 0 && span > 2,
   lightBad.length ? lightBad[0]
     : `upper-sky value ${first.sky} → ${last.sky} (×${span.toFixed(1)}) across all ${era.length} rows, ` +
       `never backwards, and every pair at equal reach identical — ${flat} deep-head rows share one sky, ` +
       `which is the honest half (the piece reads ×10.8 over 640px of sky; this band is 110px)`);

const soilBad = [];
for (let j = 0; j < 4; j++) {
  const vals = era.map(r => r.soil[j]).filter(Boolean);
  if (vals.length > 1 && new Set(vals).size !== 1)
    soilBad.push(`strip col ${j}: ${[...new Set(vals)].slice(0, 3).join(' vs ')}`);
}
ok('index_ground_never_dates', soilBad.length === 0,
   soilBad.length ? soilBad.join(' | ')
     : `4 stretches of strip byte-identical across all ${era.length} rows, 7000 BCE to 2022 CE, ` +
       `while the sky over them went ×${span.toFixed(1)}`);

/* =============================================================== phase 8 — contrast */
await fresh();
I = await walkShelf();
const worst = { r: 99, note: '' };

/* ROUND 12 SPLIT THIS INTO TWO READINGS, AND THE SPLIT IS THE FINDING. The gate opened a cell and
   then sampled `.ispan` and `#iopen` together — but `#index.isopen .ispan{opacity:0}` takes every
   row readout to zero the moment a cell opens, and the loop skips anything under 0.05 opacity. So
   the readout was in the selector and never in the sample: 1,342 pixels, all of them the opened
   citation. The row's span is the ONLY text on this surface when nothing is open, it is printed
   in all twenty gutters, and it was the one piece of type here that no gate had ever read.
   `ink_below_the_floor` darkens exactly that rule and the gate stayed green. Both are measured
   now, each in the state it is actually seen in. */
const ink = async sel => {
  await background();
  const r = await page.evaluate(({ c, sel }) => {
    eval(c);
    const g = window.__bg, out = [];
    const els = [...document.querySelectorAll(sel)];
    for (const e of els) {
      const b = e.getBoundingClientRect();
      if (b.width < 2 || b.height < 2 || b.top < 0 || b.bottom > innerHeight) continue;
      if (getComputedStyle(e).visibility === 'hidden' || +getComputedStyle(e).opacity < 0.05) continue;
      const cs = getComputedStyle(e);
      const fg = cs.color.match(/\d+/g).slice(0, 3).map(Number);
      const op = +cs.opacity * (+getComputedStyle(e.parentElement).opacity || 1);
      /* every background pixel the word's box covers, not its centre: the earth is mottled and
         06 item 5's first attempt measured 4.38:1 against a flat value precisely because it
         missed the light blobs. */
      for (let x = b.left + 1; x < b.right - 1; x += 6)
        for (let y = b.top + 1; y < b.bottom - 1; y += 4) {
          const d = g.getImageData(Math.round(x), Math.round(y), 1, 1).data;
          const bg = [d[0], d[1], d[2]];
          const ink = fg.map((v, j) => v * op + bg[j] * (1 - op));
          out.push({ r: ratio(ink, bg), t: e.textContent.slice(0, 22), bg, fg });
        }
    }
    out.sort((a, b2) => a.r - b2.r);
    return { n: out.length, worst: out[0] };
  }, { c: CONTRAST, sel });
  if (r.worst && r.worst.r < worst.r) { worst.r = r.worst.r; worst.note = JSON.stringify(r.worst); }
  worst.n = (worst.n || 0) + r.n;
  return r;
};

let spanN = 0, openN = 0;
for (const at of [I.top + 40, I.top + I.height * 0.35, I.top + I.height * 0.62]) {
  await to(at, 4);
  spanN += (await ink('.ispan')).n;                 // nothing open: the readouts are the surface
  await page.evaluate(() => {
    const on = [...document.querySelectorAll('.icell')]
      .filter(b => { const r = b.getBoundingClientRect(); return r.top > 60 && r.bottom < innerHeight - 120; });
    if (on.length) window.__hh.indexOpen(+on[on.length >> 1].dataset.i);
  });
  await tick(3);
  openN += (await ink('#iopen span, #iopen b, #iopen i')).n;
  await page.evaluate(() => window.__hh.indexClose());
}
ok('index_contrast', worst.r >= 4.5,
   `worst ${worst.r.toFixed(2)}:1 over ${worst.n} composited-pixel samples ` +
   `(${spanN} on the row readouts with nothing open, ${openN} on the opened citation) — ${worst.note}`);

/* =============================================================== phase 9 — frame budget */
await fresh();
I = await walkShelf();
await to(I.top + 900, 6);
const fb = await page.evaluate(async () => {
  const pass = async () => {
    const t = [];
    let last = performance.now();
    for (let i = 0; i < 90; i++) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(); t.push(now - last); last = now;
      scrollBy(0, 9);
    }
    t.sort((a, b) => a - b);
    return { med: t[t.length >> 1], p95: t[Math.floor(t.length * 0.95)] };
  };
  await pass();
  return [await pass(), await pass()];
});
const worstP95 = Math.max(...fb.map(p => p.p95));
ok('index_frame_budget', worstP95 <= 25,
   `warm median ${fb.map(p => p.med.toFixed(1)).join('/')}ms, p95 floor ${worstP95.toFixed(1)}ms while scrolling the shelf`);

/* =============================================================== phase 10 — the wrap is not a race */
if (SLOW) {
  /* ROUND 12 REWROTE THIS GATE. It compared two loads at a moment when not one thumbnail had been
     REQUESTED — the shelf is lazy and 146,000px down, so both readings were taken before any pixel
     existed, and an implementation that lays itself out from what has decoded returns the same
     string twice exactly like one that does not. The --slow route the gate is named for was never
     exercised by it. It now reads the boxes cold, before a single pixel has arrived, and again
     warm, after all 230 have, on each of two loads: four readings that must be one string. */
  const BOXES = () => page.evaluate(() => [...document.querySelectorAll('.icell')]
    .map(b => `${b.dataset.i}:${b.style.left}|${b.style.top}|${b.style.width}|${b.style.height}`).join(','));
  const geom = async () => {
    await fresh();
    const II = await page.evaluate(() => window.__hh.index());
    const cold = await BOXES();
    const decoded = await page.evaluate(() =>
      [...document.querySelectorAll('.icell img')].filter(i => i.complete && i.naturalWidth).length);
    await walkShelf();
    const warm = await BOXES();
    return { rows: II.rows, cold, warm, decoded };
  };
  const g1 = await geom(), g2 = await geom();
  const same = g1.cold === g1.warm && g2.cold === g2.warm && g1.cold === g2.cold && g1.rows === g2.rows;
  ok('shelf_layout_does_not_wait_for_pixels', same,
     same ? `${g1.rows} rows, all ${laid.items} boxes identical cold and warm across two loads ` +
            `(${g1.decoded} of ${laid.items} thumbnails decoded when the cold reading was taken, ` +
            `every one held back 40–340ms)`
          : `${g1.cold !== g1.warm || g2.cold !== g2.warm ? 'the shelf moved when its pixels arrived'
                                                          : 'two loads disagree'}`);
}

ok('no_console_errors', errors.length === 0, errors.length ? errors.slice(0, 2).join(' | ') : 'clean');

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} green` + (failed.length ? `  —  FAILED: ${failed.map(f => f.n).join(', ')}` : ''));
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ results }, null, 1));
await browser.close();
process.exit(failed.length ? 1 : 0);
