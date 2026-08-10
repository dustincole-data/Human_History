/* Do the round-11 gates have teeth? Each perturbation breaks one claim of the index surface on
   purpose and must turn exactly its own gate red. Every file is restored afterwards and verified
   byte-identical.

     node teeth11.mjs [name]
*/
import fs from 'fs';
import { execSync } from 'child_process';

const REPO = 'C:/Users/dusti/Projects/Human_History';
const F = {
  idx: REPO + '/prototypes/webgl/index.js',
  grav: REPO + '/prototypes/webgl/gravity.js',
  html: REPO + '/prototypes/webgl/index.html'
};
const good = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, fs.readFileSync(p)]));
const text = Object.fromEntries(Object.entries(good).map(([k, b]) => [k, b.toString('utf8')]));

/* Single-line anchors only, and every one asserted — a multi-line anchor has to reproduce
   trailing comments and line endings exactly, and when it does not it fails as "anchor missing",
   which reads like the code moved rather than like the anchor was written wrong. */
const patch = (which, ...pairs) => {
  const out = pairs.reduce((s, [from, to]) => {
    if (!s.includes(from)) throw new Error(`anchor missing in ${which}: ` + from.slice(0, 70));
    return s.replace(from, to);
  }, text[which]);
  fs.writeFileSync(F[which], out);
};

const CASES = {
  /* THE INDEX POINTS AT THE PIECE'S SPRITES AND SHRINKS THEM IN CSS — the exact thing 03 round 10
     budgeted this surface to stop, and the one that looks like it works.

     THE FINDING IS WHAT THIS DID *NOT* REDDEN. `index_decoded_under_the_gate` stayed green: the
     sprite bake is capped at 264px, so all 230 of them decode to 65.8 MB, which is under the 80 MB
     gate. At 230 items the memory gate would have let this ship. What catches it is the assertion
     that the cells come from the second bake at all, and the draw-height cap — which is 03's "a
     count is not a ceiling" arriving from the other direction. At 400 items it is 114 MB and the
     memory gate would finally notice, too late to be the thing relied on. */
  css_scaling_instead_of_a_bake: {
    expect: ['index_is_a_second_bake', 'thumb_never_exceeds_its_draw'],
    apply: () => patch('idx', ['im.src = `thumb/${c.it.k}.webp`;', 'im.src = `img/${c.it.k}.webp`;']),
  },
  /* ...and the version that does move the memory gate: the masters, 301 MB of them */
  masters_on_the_shelf: {
    expect: ['index_decoded_under_the_gate'],
    apply: () => patch('idx', ['im.src = `thumb/${c.it.k}.webp`;',
                               'im.src = `../directions/img/${c.it.k}.webp`;']),
  },
  /* a master cut-out re-copied over a baked thumbnail */
  master_thumb_slips_in: {
    expect: ['thumb_never_exceeds_its_draw'],
    keep: null,
    apply() {
      this.keep = fs.readFileSync(REPO + '/prototypes/webgl/thumb/kesi.webp');
      fs.copyFileSync(REPO + '/prototypes/directions/img/kesi.webp', REPO + '/prototypes/webgl/thumb/kesi.webp');
    },
    undo() { fs.writeFileSync(REPO + '/prototypes/webgl/thumb/kesi.webp', this.keep); },
  },
  /* the piece stops letting go of its photographs, so they are still resident on the shelf */
  sprites_follow_you_in: {
    expect: ['index_never_holds_a_sprite'],
    apply: () => patch('grav', ['function release(d) {', 'function release(d) {\n  return;']),
  },
  /* the shelf advances by less than each object's own width */
  cells_overlap: {
    expect: ['no_cell_collision_1440', 'no_cell_collision_390'],
    apply: () => patch('idx', ['cur.w += c.w + GAP;', 'cur.w += c.w + GAP - 22;']),
  },
  /* the lit set stops being the contemporary window */
  wrong_window: {
    expect: ['open_lights_the_contemporary_window'],
    apply: () => patch('idx', ['const W_YEARS = 80;', 'const W_YEARS = 130;']),
  },
  /* the opened citation is printed above its own soil line, over the next row's sky — the one
     surface the contrast gate is not solved against */
  words_climb_off_the_earth: {
    expect: ['open_words_lie_in_their_own_earth'],
    apply: () => patch('idx', ["box.style.top = (r.y + GEO.skyH + AMP_MAX + 4) + 'px';",
                               "box.style.top = (r.y + GEO.skyH - 34) + 'px';"]),
  },
  /* the roll drops the licence — 230 images still credited, none licensed */
  roll_drops_the_licence: {
    expect: ['every_item_carries_its_attribution'],
    apply: () => patch('idx', ['s.textContent = `${it.src} · ${it.lic} · ${shortCred(it.cred)}`;',
                               's.textContent = `${it.src} · ${shortCred(it.cred)}`;']),
  },
  /* the quiet stop is taken back out: the shelf rises into frame on the pixel the piece ends on */
  no_runway_for_the_seam: {
    expect: ['piece_is_gone_before_the_shelf'],
    apply: () => patch('grav',
      ["const setSpacer = () => { spacerEl.style.height = (TOTAL + innerHeight * 2) + 'px'; };",
       "const setSpacer = () => { spacerEl.style.height = (TOTAL + innerHeight) + 'px'; };"],
      ['const indexTop = () => TOTAL + innerHeight * 2;', 'const indexTop = () => TOTAL + innerHeight;']),
  },
  /* THE DEFECT THIS ROUND ACTUALLY SHIPPED ONCE. The frame returns before the update loop, so an
     object still holding words when the fade completes never reaches its own unbuild(). */
  return_before_the_teardown: {
    expect: ['the_piece_leaves_nothing_on_the_shelf'],
    apply: () => patch('grav',
      ['  if (fade >= 1) { requestAnimationFrame(frame); return; }', ''],
      ['  const fade = INDEX.fadeAt(scrollY, H);',
       '  const fade = INDEX.fadeAt(scrollY, H);\n  if (fade >= 1) { requestAnimationFrame(frame); return; }']),
  },
  /* the seam eased toward its target instead of read off the scrollbar — a wall clock in a hat.

     ROUND 12 REWROTE THIS CASE, AND THE REWRITE IS THE FINDING. The first version eased `faded`
     and left the two style writes reading `fade`, because it was written as though `faded` were
     the rendered value. It is not — it is a change-detector cache, the one thing in that block
     whose value never reaches a pixel. So the perturbation put a clock on nothing, both gates
     stayed green, and the log recorded a gate with no teeth when what it had was a tooth biting
     air. The clock now drives what is actually painted. */
  seam_on_a_clock: {
    expect: ['seam_is_scroll_only', 'index_frozen_when_idle'],
    apply: () => patch('grav',
      ['  if (fade !== faded) {', '  if (Math.abs(fade - faded) > 0.0005) {'],
      ['    faded = fade;', '    faded += (fade - faded) * 0.08;'],
      ['    glEl.style.opacity = hudEl.style.opacity = (1 - fade).toFixed(3);',
       '    glEl.style.opacity = hudEl.style.opacity = (1 - faded).toFixed(3);'],
      ["    glEl.style.visibility = hudEl.style.visibility = fade >= 1 ? 'hidden' : 'visible';",
       "    glEl.style.visibility = hudEl.style.visibility = faded >= 1 ? 'hidden' : 'visible';"]),
  },
  /* the row's light stops being the light of its own years */
  light_is_frozen: {
    expect: ['index_light_is_dated'],
    apply: () => patch('idx', ['    const s = sky(r.year, skyH, W);', '    const s = sky(-3000, skyH, W);']),
  },
  /* the earth takes the era's colour — 13's frozen ground, reopened by the back door */
  earth_takes_the_light: {
    expect: ['index_ground_never_dates'],
    apply: () => patch('idx',
      ['      `background-position:${-r.off}px bottom,0 0,0 0,0 0;` +',
       '      `background-position:${-r.off}px bottom,0 0,0 0,0 0;` +\n' +
       '      `background-blend-mode:screen,normal,normal,normal;` +']),
  },
  /* the ink dropped below the floor 06 item 5 measured against this exact soil */
  ink_below_the_floor: {
    expect: ['index_contrast'],
    apply: () => patch('html',
      ['font-variant-numeric:tabular-nums;color:rgb(188,190,194);',
       'font-variant-numeric:tabular-nums;color:rgb(96,96,99);']),
  },
  /* the contour's amplitude asserted rather than measured, so every row carries dead air */
  amp_asserted: {
    expect: ['amp_is_measured_not_asserted'],
    apply: () => patch('idx', ['  AMP_MAX = Math.ceil(AMP_MAX);', '  AMP_MAX = 34;']),
  },
  /* the shelf lays itself out from what has decoded rather than from the baked manifest: the wrap
     becomes a race, and the boxes it draws before its pixels arrive are not the ones it draws after.

     ROUND 12 REWROTE THIS CASE. The first version called `measure()` from an image's load handler
     and then re-applied styles — but `measure()` rebuilds `rows` and `cells` from scratch with
     `el: null`, and nothing rebound them to the DOM, so the first thumbnail to decode took
     `probe()` down with it (`r.el.querySelector` of null) and the sweep threw instead of reporting.
     A perturbation that crashes the page has not tested the gate; it has only proved the page can
     be crashed. The dimension source is now the decoded image rather than the baked manifest, and
     the shelf rebuilds itself through `build()`, which is the one path that keeps `rows[].el` and
     `cells[].el` true. Before a photograph decodes its cell is a square; after, it is the real
     thing — which is exactly what "waits for pixels" means. */
  layout_waits_for_pixels: {
    expect: ['shelf_layout_does_not_wait_for_pixels'],
    slow: true,
    apply: () => patch('idx',
      ['function measure() {', 'const DEC = {};\nlet queued = false;\nfunction measure() {'],
      ['    const d = THUMBS[it.k] || [THUMB_H * DPR_CAP, THUMB_H * DPR_CAP];',
       '    const d = DEC[it.k] || [THUMB_H * DPR_CAP, THUMB_H * DPR_CAP];'],
      ["      im.decoding = 'async';",
       "      im.decoding = 'async';\n" +
       "      im.addEventListener('load', () => {\n" +
       "        if (DEC[c.it.k] || !im.naturalWidth) return;\n" +
       "        DEC[c.it.k] = [im.naturalWidth, im.naturalHeight];\n" +
       "        if (queued) return;\n" +
       "        queued = true;\n" +
       "        requestAnimationFrame(() => { queued = false; build(INDEX_TOP); });\n" +
       "      });"]),
  },
};

const only = process.argv[2];
const out = [];
for (const [name, c] of Object.entries(CASES)) {
  if (only && only !== name) continue;
  console.log(`\n=== ${name}  (expect ${c.expect.join(' + ')} red) ===`);
  try {
    c.apply();
    let red = [], notes = [];
    try {
      execSync(`node sweep11i.mjs${c.slow ? ' --slow' : ''}`, { stdio: 'pipe', encoding: 'utf8', timeout: 900000 });
    } catch (e) {
      const m = (e.stdout || '').match(/FAILED: (.*)$/m);
      red = m ? m[1].split(', ') : [];
      if (!m) console.log('  (no FAILED line — sweep threw)\n' + (e.stdout || '').slice(-600) + (e.stderr || '').slice(-400));
      /* WHAT THE GATE MEASURED, not just that it moved. A binary red/green cannot tell a gate that
         caught the perturbation from a gate that fell over for some other reason, and it cannot
         report the number the case exists to produce (masters_on_the_shelf is only interesting
         because it says 301MB). */
      notes = (e.stdout || '').split('\n').filter(l => /^FAIL\s/.test(l)).map(l => '    ' + l.trim());
    }
    const hit = c.expect.every(x => red.includes(x));
    out.push({ name, expect: c.expect, red, hit, notes });
    console.log(hit ? `  RED as designed: ${red.join(', ')}` : `  *** DID NOT GO RED *** (red: ${red.join(', ') || 'none'})`);
    if (notes.length) console.log(notes.join('\n'));
  } catch (err) {
    out.push({ name, expect: c.expect, red: ['(perturbation failed: ' + err.message + ')'], hit: false });
    console.log('  *** ' + err.message);
  } finally {
    if (c.undo) c.undo.call(c);
    for (const [k, p] of Object.entries(F)) fs.writeFileSync(p, good[k]);
  }
}
for (const [k, p] of Object.entries(F)) fs.writeFileSync(p, good[k]);
const same = Object.entries(F).every(([k, p]) => Buffer.compare(good[k], fs.readFileSync(p)) === 0);
console.log(`\nfiles restored byte-identical: ${same}`);
console.log(out.map(o => `${o.hit ? 'OK  ' : 'MISS'} ${o.name} -> ${o.red.join(', ') || 'nothing'}`).join('\n'));
console.log(`\n${out.filter(o => o.hit).length}/${out.length} perturbations went red`);
