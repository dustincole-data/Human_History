/* phone08.mjs — TICKET 08's phone pass, the half a headless browser can actually take.
 *
 * READ-ONLY. It measures the page; it perturbs nothing and touches no source file.
 *
 * The three scars this project family carries are named in the map, and only ONE of them is a
 * thing a real device has to be holding to find. The other two are decidable here, and this is
 * what each of them actually is:
 *
 *   1. iOS URL-BAR COLLAPSE. Not a rendering bug — a RESIZE EVENT. Safari fires `resize` every
 *      time the bar hides or shows, which on a scroll-driven page happens constantly.
 *
 *      ROUND 2 FIXED THIS AND RE-AIMED THE GATES THAT MEASURED IT, because round 1's two were
 *      testing the wrong event. `setViewportSize` is a GENUINE viewport change — a rotation, or a
 *      window drag — and every viewport unit moves with it, `lvh` included. A URL-bar move is the
 *      opposite: `resize` fires and the LARGE viewport does not change. So the page is now held at
 *      `100lvh` and re-syncs from its own box, and the checkable claim is
 *      `resize_with_an_unchanged_box_does_nothing` — which is the bar move exactly, and which
 *      round 1's setViewportSize could not produce at all.
 *
 *      What round 1 found still stands and is what forced the ruling: the runway was
 *      `TOTAL + innerHeight * 2`, so THE DOCUMENT'S OWN HEIGHT WAS A FUNCTION OF THE URL BAR, and
 *      the GROUND LINE was `innerHeight * 0.78`, so the bar moved the ground 77px on a page whose
 *      13 says the ground never moves. Round 1's 563ms did not reproduce (157–229ms over six
 *      collapses on an idle laptop) — the cost was the machine and the MOVEMENT was the defect.
 *
 *   2. RESIZEOBSERVER vs `resize`. The map's rule is that a fixed canvas re-syncs from ITS OWN
 *      BOX. Round 1 found this one re-syncing from `innerWidth/innerHeight`, which is the thing
 *      iOS lies about; round 2 moved it onto the box and `canvas_is_its_own_box` asserts the
 *      relationship rather than the fix.
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

const URL = 'http://localhost:8812/index.html';
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

    /* THE BAR MOVE, and it is the one case setViewportSize cannot produce. `resize` fires and the
       large viewport does not change; the page's box therefore does not change; nothing may
       happen. Eight of them in a row, because on iOS that is one scroll gesture. */
    const bar = await p.evaluate(async () => {
      const st = () => ({
        gy: window.__hh.groundY(), docH: document.documentElement.scrollHeight,
        top: window.__hh.index().top, canvas: document.querySelector('#gl canvas').height,
        cell: document.querySelector('.icell')
      });
      const before = st();
      const t0 = performance.now();
      for (let k = 0; k < 8; k++) dispatchEvent(new Event('resize'));
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const cost = performance.now() - t0;
      const after = st();
      return { cost, same: before.gy === after.gy && before.docH === after.docH &&
                           before.top === after.top && before.canvas === after.canvas &&
                           before.cell === after.cell,
               gy: [before.gy, after.gy], docH: [before.docH, after.docH] };
    });
    rec('resize_with_an_unchanged_box_does_nothing', bar.same,
        `8 bar moves in ${bar.cost.toFixed(1)}ms — ground ${bar.gy[0]} -> ${bar.gy[1]}, ` +
        `runway ${bar.docH[0]} -> ${bar.docH[1]}`);

    const shot = () => ({
      docH: document.documentElement.scrollHeight,
      y: scrollY,
      hud: document.querySelector('#hud .num').textContent + ' ' +
           document.querySelector('#hud .unit').textContent,
      canvas: [document.querySelector('#gl canvas').width,
               document.querySelector('#gl canvas').height],
      box: [document.querySelector('#gl canvas').clientWidth,
            document.querySelector('#gl canvas').clientHeight],
      dpr: Math.min(devicePixelRatio, window.__hh.index().DPR_CAP),
      // where the shelf's arithmetic SAYS it starts, against where it actually does
      top: window.__hh.index().top,
      real: Math.round(document.getElementById('index').getBoundingClientRect().top + scrollY)
    });

    const before = await p.evaluate(shot);
    // stamp a cell, so a rebuild can be told from a no-op by node identity rather than by count
    await p.evaluate(() => { document.querySelector('.icell').dataset.stamp = '1'; });

    /* A GENUINE viewport height change — a rotation, not a bar move. The shelf's layout is a pure
       function of the WIDTH, so none of it may be rebuilt; only where it starts moves. */
    const t0 = Date.now();
    await p.setViewportSize({ width: PHONE.width, height: COLLAPSED });
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const cost = Date.now() - t0;

    const after = await p.evaluate(shot);
    const kept = await p.evaluate(() => document.querySelector('.icell').dataset.stamp === '1');

    rec('urlbar_does_not_move_the_moment', before.hud === after.hud,
        `counter ${before.hud} -> ${after.hud} at scrollY ${before.y} -> ${after.y}`);
    rec('height_change_does_not_rebuild_the_shelf', kept,
        `236 cells and two WebP soil bakes ${kept ? 'reused' : 'REBUILT'} for a height-only change`);
    rec('height_change_is_affordable', cost < 250,
        `${cost}ms of work on one genuine viewport height change`);
    rec('runway_matches_the_shelf',
        before.top === before.real && after.top === after.real,
        `indexTop() vs the shelf's real document offset: ${before.top}/${before.real} -> ` +
        `${after.top}/${after.real}`);
    /* THE MAP'S RULE, ASSERTED AS A RELATIONSHIP. Not "did the canvas change" — that passed in
       round 1 at 563ms a go — but "is the canvas exactly its own box at the page's density",
       which is false the moment anything sizes it from a window number again. */
    rec('canvas_is_its_own_box',
        after.canvas[0] === Math.round(after.box[0] * after.dpr) &&
        after.canvas[1] === Math.round(after.box[1] * after.dpr) &&
        before.canvas[1] === Math.round(before.box[1] * before.dpr),
        `canvas ${after.canvas.join('x')} = box ${after.box.join('x')} x dpr ${after.dpr}`);
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

  /* THE HALF THAT IS NOT A GATE HERE AND CANNOT BE. Everything above runs in Chromium with no
     browser chrome in it, so `lvh`, `svh` and `dvh` are all the same number and a viewport resize
     moves all three — the fix is invisible to this file by construction, and the two assertions
     that look like they cover it (`resize_with_an_unchanged_box_does_nothing`, `canvas_is_its_own
     _box`) cover the MECHANISM, not the device. Ruled with Dustin in round 2: the device claim is
     his pass, stated as one, rather than faked here. */
  console.log('\n-- device gate, not asserted here: on a real iPhone, scrolling the bar in and out\n' +
              '   mid-piece must move neither the ground line nor the shelf, and must not hitch.');

  const bad = out.filter(r => !r.ok).length;
  console.log(`\n${out.length - bad}/${out.length}`);
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
  browser.close().catch(() => {});
  setTimeout(() => process.exit(0), 1200);
})();
