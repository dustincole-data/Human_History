/* TICKET 14 smoke: does the last object arrive, stay whole, keep its words, and go out with the
   seam? Read off the live objects, never off a flag the page keeps about itself. */
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:8812/webgl/index.html';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => window.__hh && window.__hh.index, null, { timeout: 90000 });

const tick = async (n = 4) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise(requestAnimationFrame)); };
const to = async (y, n = 5) => { await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await tick(n); };

const T = await page.evaluate(() => ({ TOTAL: window.__hh.TOTAL, N: window.__hh.drops.length,
                                       top: window.__hh.index().top, h: innerHeight }));
const read = () => page.evaluate(() => {
  const d = window.__hh.drops[window.__hh.drops.length - 1];
  return { down: d.down, gone: d.gone, pieces: d.pieces.length, specks: d.specks.length,
           splits: d.splits, age: +d.age.toFixed(3), atoms: d.atoms ? d.atoms.length : 0,
           nameVis: d.atoms ? d.atoms.filter(a => a.cls !== 'c' && +a.el.style.opacity > 0.02).length : 0,
           credVis: d.cred ? d.cred.filter(a => +a.el.style.opacity > 0.02).length : 0,
           credTotal: d.cred ? d.cred.length : 0, blown: d.blown };
});

console.log(`N=${T.N}  TOTAL=${T.TOTAL}  indexTop=${T.top}\n`);
for (const [label, y] of [['just landed', T.TOTAL - 3800], ['mid', T.TOTAL - 2000],
                          ['at TOTAL', T.TOTAL], ['+1 screen', T.TOTAL + T.h],
                          ['shelf edge', T.top - 40], ['on the shelf', T.top + 1400]]) {
  await to(y);
  console.log(label.padEnd(14), JSON.stringify(await read()));
}
await to(T.TOTAL - 2000);
console.log('back up      ', JSON.stringify(await read()));
const stranded = await page.evaluate(() => document.querySelectorAll('#labels span:not(.sr)').length);
await to(T.top + 1400);
const strandedShelf = await page.evaluate(() => document.querySelectorAll('#labels span:not(.sr)').length);
console.log(`\nlabel nodes: mid-piece ${stranded}, on the shelf ${strandedShelf}`);
console.log('errors:', errs.length ? errs.slice(0, 3) : 'none');
await browser.close();
