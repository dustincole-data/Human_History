/* READ-ONLY probe. Touches no source file. Measures, over a real walk of the piece:
     - the fragment canvases actually resident (sum of cv.w*cv.h*4 over every live piece)
     - the photographs resident, to reconfirm 03's 3.1MB peak from a second instrument
     - what one object's fragments cost across its whole life, which is the price of KEEPING
       them instead of re-cutting them if the break has to run backwards.                     */
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:8812/webgl/index.html';
const MB = 1024 * 1024;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));

const settle = async (n = 6) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise(requestAnimationFrame)); };
const go = async y => { await page.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y); await settle(); };

const read = () => page.evaluate(() => {
  const h = window.__hh;
  let fragBytes = 0, fragN = 0, alive = 0, specks = 0;
  for (const d of h.drops) {
    if (!d.pieces || !d.pieces.length) continue;
    let live = 0;
    for (const p of d.pieces) { if (p.dead) continue; live++; fragBytes += p.cv.width * p.cv.height * 4; }
    if (live) { alive++; fragN += live; }
    specks += (d.specks ? d.specks.length : 0);
  }
  const im = h.held();
  return { fragBytes, fragN, alive, specks,
           imBytes: im.reduce((a, d) => a + d.w * d.h * 4, 0), imN: im.length,
           y: window.scrollY };
});

await page.goto(URL, { waitUntil: 'load' });
await settle(30);

/* one continuous walk — every gate in this repo learned the hard way that contact latches, so a
   walk and a jump are different pages. This is the walk. */
const TOTAL = await page.evaluate(() => window.__hh.TOTAL);
let peakFrag = 0, peakFragAt = 0, peakFragN = 0, peakIm = 0, peakAlive = 0;
const rows = [];
for (let y = 0; y <= TOTAL; y += 200) {
  await go(y);
  const r = await read();
  if (r.fragBytes > peakFrag) { peakFrag = r.fragBytes; peakFragAt = y; peakFragN = r.fragN; }
  if (r.imBytes > peakIm) peakIm = r.imBytes;
  if (r.alive > peakAlive) peakAlive = r.alive;
  if (y % 20000 === 0) rows.push({ y, ...r });
}

console.log('walked', TOTAL.toLocaleString(), 'px in 200px steps, errors:', errs.length);
console.log();
console.log('sample stops:');
console.log('        y   fragMB  pieces  objects  specks   imgMB  imgs');
for (const r of rows)
  console.log(`${String(r.y).padStart(9)}  ${(r.fragBytes / MB).toFixed(3).padStart(6)}  ${String(r.fragN).padStart(6)}  ${String(r.alive).padStart(7)}  ${String(r.specks).padStart(6)}  ${(r.imBytes / MB).toFixed(3).padStart(6)}  ${String(r.imN).padStart(4)}`);
console.log();
console.log(`PEAK fragments resident : ${(peakFrag / MB).toFixed(2)} MB  (${peakFragN} pieces, at y=${peakFragAt.toLocaleString()})`);
console.log(`PEAK objects on ground  : ${peakAlive}`);
console.log(`PEAK photographs resident: ${(peakIm / MB).toFixed(2)} MB   (03 round 10 measured 3.1 MB)`);

/* what ONE object's fragments weigh at each stage of its own life — the unit price of retention */
await page.goto(URL, { waitUntil: 'load' });
await settle(20);
const probe = async i => {
  const t = await page.evaluate(k => {
    const h = window.__hh; const d = h.drops[k];
    return { land: d.landScroll ?? null };
  }, i);
  return t;
};
// walk item 150 through its life, sampling its own fragment bytes
await go(0);
const one = [];
const target = 150;
const LANDY = await page.evaluate(k => {
  // START/LAND are not exported; derive from the drop once it is down
  return null;
}, target);
for (let y = 0; y <= TOTAL; y += 100) {
  await go(y);
  const r = await page.evaluate(k => {
    const d = window.__hh.drops[k];
    if (!d.pieces || !d.pieces.length) return null;
    let b = 0, n = 0;
    for (const p of d.pieces) { if (p.dead) continue; n++; b += p.cv.width * p.cv.height * 4; }
    return { b, n, sp: d.specks ? d.specks.length : 0, down: !!d.down, gone: !!d.gone };
  }, target);
  if (r && (r.n || r.sp)) one.push({ y, ...r });
}
if (one.length) {
  const first = one[0], mx = one.reduce((a, r) => r.b > a.b ? r : a, one[0]), last = one[one.length - 1];
  console.log();
  console.log(`item ${target} alone, across its whole life on the ground:`);
  console.log(`  lands at y=${first.y.toLocaleString()}  -> ${first.n} pieces, ${(first.b / 1024).toFixed(0)} KB`);
  console.log(`  heaviest  y=${mx.y.toLocaleString()}    -> ${mx.n} pieces, ${(mx.b / 1024).toFixed(0)} KB`);
  console.log(`  last seen y=${last.y.toLocaleString()}  -> ${last.n} pieces, ${(last.b / 1024).toFixed(0)} KB`);
  console.log(`  life on screen: ${(last.y - first.y).toLocaleString()} px`);
}

await browser.close();
