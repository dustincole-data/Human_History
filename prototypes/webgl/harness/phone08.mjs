/* phone08.mjs — TICKET 08's phone pass, the half a headless browser can actually take.
 *
 * READ-ONLY. It measures the page; it perturbs nothing and touches no source file.
 *
 * The three scars this project family carries are named in the map, and only ONE of them is a
 * thing a real device has to be holding to find. The other two are decidable here, and this is
 * what each of them actually is:
 *
 *   1. iOS URL-BAR COLLAPSE. Not a rendering bug — a RESIZE EVENT. Safari fires `resize` every
 *      time the bar hides or shows, which on a scroll-driven page happens constantly. This page
 *      binds `fit()` to it, and `fit()` re-bakes the surface and the ground, rewinds every
 *      generation of every wreck, and rebuilds all 236 shelf cells with two soil bakes to data
 *      URLs. Cost is measured below. Worse than cost: `setSpacer()` sizes the runway as
 *      `TOTAL + innerHeight * 2`, so THE DOCUMENT'S OWN HEIGHT IS A FUNCTION OF THE URL BAR —
 *      and on a page where the scrollbar is the only clock, a runway that changes underneath the
 *      visitor moves what is drawn at a scroll position they have not moved from.
 *
 *   2. RESIZEOBSERVER vs `resize`. The map's rule is that a fixed canvas re-syncs from ITS OWN
 *      BOX. This one re-syncs from `innerWidth/innerHeight`, which is the thing iOS lies about.
 *
 *   3. FIRST-TAP-IS-HOVER. WebKit swallows the first tap's click on any element whose `mouseenter`
 *      mutates the DOM. No emulator reproduces it — Playwright's touch emulation is not WebKit's
 *      event model — so this file only ENUMERATES the elements at risk and hands the list to the
 *      real-device pass. 10 ruled the shelf has no hover state for exactly this reason; what is
 *      at risk is the furniture and, as of 07 round 2, the 236 links in the credits roll.
 *
 *     node phone08.mjs [out.json]
 */
import { createRequire } from 'module';
import fs from 'fs';
// same resolution as the sweeps: there is no install here (harness/README.md)
const { chromium } = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json')('playwright');

const URL = 'http://localhost:8812/webgl/index.html';
const PHONE = { width: 390, height: 844 };      // iPhone 14/15 CSS viewport
const COLLAPSED = 745;                          // the same phone with the URL bar hidden
const out = [];
const rec = (name, ok, msg) => {
  out.push({ name, ok, msg });
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(34)} ${msg}`);
};

(async () => {
  const browser = await chromium.launch();

  /* ---------------------------------------------------------------- 1. the resize cost */
  {
    const p = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 3, hasTouch: true,
                                      isMobile: true });
    await p.goto(URL, { waitUntil: 'load' });
    await p.waitForTimeout(3000);

    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), Math.round(total * 0.35));
    await p.waitForTimeout(600);

    const before = await p.evaluate(() => ({
      docH: document.documentElement.scrollHeight,
      y: scrollY,
      hud: document.querySelector('#hud .num').textContent + ' ' +
           document.querySelector('#hud .unit').textContent,
      canvas: [document.getElementById('gl').querySelector('canvas').width,
               document.getElementById('gl').querySelector('canvas').height],
    }));

    // the URL bar hides. Time the handler the page has bound to it.
    const t0 = Date.now();
    await p.setViewportSize({ width: PHONE.width, height: COLLAPSED });
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const cost = Date.now() - t0;

    const after = await p.evaluate(() => ({
      docH: document.documentElement.scrollHeight,
      y: scrollY,
      hud: document.querySelector('#hud .num').textContent + ' ' +
           document.querySelector('#hud .unit').textContent,
      canvas: [document.getElementById('gl').querySelector('canvas').width,
               document.getElementById('gl').querySelector('canvas').height],
    }));

    rec('urlbar_does_not_move_the_runway', before.docH === after.docH,
        `runway ${before.docH} -> ${after.docH} px (${after.docH - before.docH >= 0 ? '+' : ''}` +
        `${after.docH - before.docH}) when the bar hides`);
    rec('urlbar_does_not_move_the_moment', before.hud === after.hud,
        `counter ${before.hud} -> ${after.hud} at scrollY ${before.y} -> ${after.y}`);
    rec('urlbar_resize_is_affordable', cost < 250, `${cost}ms of work on one bar collapse`);
    rec('canvas_follows_its_box',
        after.canvas[1] !== before.canvas[1],
        `canvas ${before.canvas.join('x')} -> ${after.canvas.join('x')}`);
    await p.close();
  }

  /* ---------------------------------------------------------------- 2. what a tap has to reach */
  {
    const p = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 3, hasTouch: true,
                                      isMobile: true });
    await p.goto(URL, { waitUntil: 'load' });
    await p.waitForTimeout(3000);
    await p.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight - innerHeight,
                                      behavior: 'instant' }));
    await p.waitForTimeout(1200);

    /* 2.5.8 target size: everything a finger must hit, measured. The shelf's cells are the piece's
       own objects at their true widths, so a sliver IS the object — reported, not asserted away. */
    const targets = await p.evaluate(() => {
      const small = [];
      for (const el of document.querySelectorAll('.icell, .iroll a, .icolo a, .dcd-mark')) {
        const r = el.getBoundingClientRect();
        if (r.width && (r.width < 24 || r.height < 24))
          small.push({ cls: el.className || el.tagName, w: +r.width.toFixed(1),
                       h: +r.height.toFixed(1) });
      }
      return { small, cells: document.querySelectorAll('.icell').length,
               links: document.querySelectorAll('.iroll a').length };
    });
    rec('touch_targets_24px', targets.small.length === 0,
        `${targets.small.length} of ${targets.cells + targets.links} tappable things under 24px` +
        (targets.small.length ? ` — smallest ${JSON.stringify(targets.small.slice(0, 4))}` : ''));

    /* the first-tap-is-hover risk list: anything with a :hover rule that a finger can reach. This
       does not test the scar — no emulator can — it hands the real-device pass its checklist. */
    const hoverRisk = await p.evaluate(() => {
      const sels = [];
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const r of rules || []) {
          if (r.selectorText && /:hover/.test(r.selectorText) &&
              !/:focus|@media/.test(r.selectorText)) sels.push(r.selectorText);
        }
      }
      return sels;
    });
    rec('hover_rules_enumerated', true,
        `${hoverRisk.length} :hover rules a finger can reach — ${hoverRisk.join(' | ')}`);

    /* a tap opens a cell, and a second tap on the same cell closes it. Not the WebKit scar, but it
       is the one interaction the whole shelf has and it should be exercised somewhere. */
    const tap = await p.evaluate(async () => {
      const c = document.querySelectorAll('.icell')[3];
      c.scrollIntoView({ block: 'center' });
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      c.click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const box = document.getElementById('iopen');
      const opened = getComputedStyle(box).display !== 'none' && box.textContent.trim().length > 0;
      const lit = document.querySelectorAll('.icell.lit').length;
      c.click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const closed = getComputedStyle(box).display === 'none';
      return { opened, closed, lit, text: box.textContent.trim().slice(0, 60) };
    });
    rec('tap_opens_and_closes_a_cell', tap.opened && tap.closed,
        `opened=${tap.opened} closed=${tap.closed}, ${tap.lit} lit within 80 years`);

    /* the opened cluster must not run off the right edge or into the gutter — 06 item 5's rules,
       on the viewport where they are tightest. */
    const clamp = await p.evaluate(async () => {
      const cells = [...document.querySelectorAll('.icell')];
      let worstR = 0, worstL = 1e9;
      for (const i of [0, 1, cells.length - 1, cells.length - 2, (cells.length >> 1)]) {
        cells[i].click();
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        const b = document.getElementById('iopen').getBoundingClientRect();
        worstR = Math.max(worstR, b.right - innerWidth);
        worstL = Math.min(worstL, b.left);
      }
      document.getElementById('iopen').style.display = 'none';
      return { worstR, worstL };
    });
    rec('opened_cluster_stays_on_screen', clamp.worstR <= 0.5 && clamp.worstL >= 0,
        `worst right overhang ${clamp.worstR.toFixed(1)}px, worst left ${clamp.worstL.toFixed(1)}px`);

    await p.close();
  }

  const bad = out.filter(r => !r.ok).length;
  console.log(`\n${out.length - bad}/${out.length}`);
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
  browser.close().catch(() => {});
  setTimeout(() => process.exit(0), 1200);
})();
