/* frames of the ending, at both viewports */
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const OUT = 'C:/Users/dusti/Projects/Human_History/prototypes/webgl/verify14';
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://127.0.0.1:8812/webgl/index.html';
const browser = await chromium.launch();

for (const [tag, w, h] of [['w', 1440, 900], ['m', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hh && window.__hh.index, null, { timeout: 90000 });
  const T = await page.evaluate(() => ({ TOTAL: window.__hh.TOTAL, top: window.__hh.index().top,
                                         S: window.__hh.START[window.__hh.drops.length - 1] }));
  const shots = [
    ['00-approach', T.TOTAL - 2600], ['01-mid-fall', T.TOTAL - 1800],
    ['02-standing', T.TOTAL - 900],  ['03-at-total', T.TOTAL],
    ['04-fading', T.TOTAL + 700],    ['05-quiet', T.top - 500],
  ];
  for (const [name, y] of shots) {
    await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y);
    for (let i = 0; i < 8; i++) await page.evaluate(() => new Promise(requestAnimationFrame));
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
  }
  console.log(`${tag}: TOTAL ${T.TOTAL}, last START ${T.S}`);
  await page.close();
}
await browser.close();
