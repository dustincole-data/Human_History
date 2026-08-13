/* Gates for the 02 review surface. Needs `python review02.py --serve` already running.
     node review02.verify.mjs              # assertions only
     node review02.verify.mjs C:/tmp/      # …and four screenshots into that directory
   The playwright install is Deep_Time's, same as every sweep in prototypes/webgl/harness. */
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');
const OUT = process.argv[2] ? process.argv[2].replace(/\/?$/, '/') : null;
const URL = (process.env.HH_REVIEW || 'http://127.0.0.1:8813') + '/review02.html';
const R = [];
const ok = (n, p, note) => { R.push([n, p]); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}  ${note ?? ''}`); };

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const cells = await page.locator('.cell').count();
ok('all 236 cells render', cells === 236, `${cells}`);

// images actually decode
await page.waitForTimeout(1500);
const decoded = await page.$$eval('.cell img', els =>
  els.slice(0, 20).filter(i => i.complete && i.naturalWidth > 0).length);
ok('first 20 sprites decode', decoded === 20, `${decoded}/20`);

// sort actually reorders
const first = () => page.$eval('.cell', e => e.dataset.k);
const a0 = await first();
await page.selectOption('#sort', 'suspect_ate'); await page.waitForTimeout(200);
const a1 = await first();
await page.selectOption('#sort', 'y'); await page.waitForTimeout(200);
const a2 = await first();
ok('sort reorders', a0 !== a1 && a1 !== a2, `${a0} -> ${a1} -> ${a2}`);

// year sort desc puts the newest first, asc the oldest
await page.click('#dir'); await page.waitForTimeout(150);
const oldest = await first();
ok('year asc = oldest first', oldest === 'ainghazal', oldest);
await page.click('#dir'); await page.waitForTimeout(150);

// range filter
await page.selectOption('#sort', 'cov');
await page.fill('#lo', '0.85'); await page.waitForTimeout(250);
const n1 = await page.locator('.cell').count();
const allAbove = await page.$$eval('.nums', els => els.every(e => {
  const m = e.textContent.match(/cov([\d.]+)/); return m && parseFloat(m[1]) >= 0.845; }));
ok('range filter cuts the set', n1 > 0 && n1 < 236 && allAbove, `${n1} cells, all cov>=0.85 ${allAbove}`);
await page.fill('#lo', ''); await page.waitForTimeout(250);

// text search
await page.fill('#q', 'torch'); await page.waitForTimeout(250);
const n2 = await page.locator('.cell').count();
ok('text search', n2 > 0 && n2 < 10, `${n2} hits`);
await page.fill('#q', ''); await page.waitForTimeout(250);

// grounds
for (const g of ['white', 'black', 'soil', 'check']) {
  await page.click(`[data-g="${g}"]`);
  const cls = await page.$eval('.box', e => e.className);
  ok(`ground ${g}`, cls.includes('g-' + g), cls);
}
// the ground is really painted, not just a class
await page.click('[data-g="white"]');
const bgw = await page.$eval('.box', e => getComputedStyle(e).backgroundColor);
await page.click('[data-g="soil"]');
const bgs = await page.$eval('.box', e => getComputedStyle(e).backgroundColor);
ok('grounds paint different pixels', bgw === 'rgb(255, 255, 255)' && bgs === 'rgb(43, 38, 32)', `${bgw} / ${bgs}`);

// silhouette
await page.keyboard.press('s');
const fil = await page.$eval('.box img', e => getComputedStyle(e).filter);
ok('silhouette filter applies', fil !== 'none' && fil.includes('brightness'), fil);
await page.keyboard.press('s');

// flag + persistence
await page.click('[data-g="check"]');
const k = await first();
await page.click(`.cell[data-k="${k}"] [data-f="ate"]`);
await page.click(`.cell[data-k="${k}"] [data-f="bg"]`);
const stored = await page.evaluate(() => localStorage.getItem('hh02.flags'));
ok('flag writes localStorage', stored && stored.includes(k), stored);
await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(500);
const cls2 = await page.$eval(`.cell[data-k="${k}"]`, e => e.className);
ok('flag survives reload', cls2.includes('ate') && cls2.includes('bg'), cls2);

// flagged-only
await page.click('#onlyflag'); await page.waitForTimeout(200);
const n3 = await page.locator('.cell').count();
ok('flagged-only filter', n3 === 1, `${n3}`);
await page.click('#onlyflag'); await page.waitForTimeout(200);

// copy keys — read the text the button puts on the clipboard
await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
await page.click('#copy'); await page.waitForTimeout(300);
const clip = await page.evaluate(() => navigator.clipboard.readText());
ok('copy keys yields both lists', clip.includes('ate (1)') && clip.includes('bg (1)') && clip.includes(k),
   JSON.stringify(clip));

// zoom + keyboard walk
await page.click('.cell .box'); await page.waitForTimeout(400);
ok('zoom opens', await page.locator('#zoom.open').count() === 1);
const z0 = await page.$eval('#zk', e => e.textContent);
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
const z1 = await page.$eval('#zk', e => e.textContent);
ok('zoom walks with arrows', z0 !== z1, `${z0} -> ${z1}`);
await page.keyboard.press('1'); await page.waitForTimeout(150);
const zf = await page.$eval('#za', e => e.className);
ok('zoom key 1 flags ate', zf.includes('on'), zf);
const zimg = await page.$eval('#zimg', e => [e.complete, e.naturalWidth]);
ok('zoom image decodes', zimg[0] && zimg[1] > 0, JSON.stringify(zimg));
// asserted on the RENDERED BOX, not the class — the class was right while the pane was
// visible anyway, because `#zstage > div` outranked the id's own display:none.
// `refetch02.py` has run, so this reads the REAL original rather than the cut-out pointed at
// itself: a pane that splits while decoding nothing is the failure only a fetch pass can cause,
// and it is invisible to a width assertion.
await page.waitForTimeout(500);
const [ow, cw, zo] = await page.evaluate(() => {
  const o = document.querySelector('#zorig');
  return [o.offsetParent === null ? 0 : document.querySelector('#zorigwrap').offsetWidth,
          document.querySelector('#zcutwrap').offsetWidth,
          [o.complete, o.naturalWidth, o.getAttribute('src')]];
});
ok('originals pane splits the stage and the original decodes',
   ow > 100 && Math.abs(ow - cw) < 4 && zo[0] && zo[1] > 0 && /^orig\//.test(zo[2]),
   `orig ${ow}px vs cut ${cw}px, ${zo[2]} at ${zo[1]}px`);
// the ground still reaches the zoom, and setting it does not wipe the pane's own state
await page.keyboard.press('b');
ok('zoom pane keeps its ground and its state', await page.evaluate(() =>
  document.querySelector('#zcutwrap').className.includes('g-') &&
  document.querySelector('#zorigwrap').offsetWidth > 100));
// all 236 have an original now, so the EMPTY case is the one that has to be faked or the hide
// rule becomes a decoration — and that rule is the whole reason `#zstage > #zorigwrap` is
// written at the specificity it is.
await page.evaluate(() => { view[zi].o = 0; openZoom(zi); });
await page.waitForTimeout(300);
const [ow2, cw2, sw2] = await page.evaluate(() => [
  document.querySelector('#zorigwrap').offsetWidth,
  document.querySelector('#zcutwrap').offsetWidth,
  document.querySelector('#zstage').offsetWidth]);
ok('no originals pane when an item has none', ow2 === 0 && cw2 === sw2, `orig ${ow2}px, cut ${cw2}/${sw2}`);
await page.evaluate(() => { view[zi].o = 1; openZoom(zi); });

await page.keyboard.press('Escape'); await page.waitForTimeout(200);
ok('zoom closes', await page.locator('#zoom.open').count() === 0);

// clean up the test flags so he opens a clean board
await page.evaluate(() => localStorage.removeItem('hh02.flags'));

ok('no page errors', errs.length === 0, errs.join(' | ').slice(0, 300));

// screenshots
if (!OUT) { console.log(`\n${R.filter(r => r[1]).length}/${R.length}`); await b.close(); process.exit(0); }
await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
await page.selectOption('#sort', 'suspect_bg'); await page.waitForTimeout(2000);
await page.screenshot({ path: OUT + 'r02-check.png' });
await page.click('[data-g="white"]'); await page.waitForTimeout(600);
await page.screenshot({ path: OUT + 'r02-white.png' });
await page.click('[data-g="soil"]'); await page.keyboard.press('s'); await page.waitForTimeout(600);
await page.screenshot({ path: OUT + 'r02-sil.png' });
await page.click('[data-g="check"]'); await page.keyboard.press('s');
await page.selectOption('#sort', 'suspect_ate'); await page.waitForTimeout(2000);
await page.click('.cell .box'); await page.waitForTimeout(1200);
await page.screenshot({ path: OUT + 'r02-zoom.png' });

console.log(`\n${R.filter(r => r[1]).length}/${R.length}`);
await b.close();
