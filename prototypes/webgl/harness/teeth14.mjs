/* Do ticket 14's gates have teeth? Each perturbation breaks one claim of the ending or the
   signature on purpose and must turn exactly its own gate red. Files are restored afterwards and
   verified byte-identical.

   Cases name their own sweep: the ending is the piece's (sweep10), the signature's two halves are
   the piece's and the shelf's (sweep11i).

     node teeth14.mjs [name]
*/
import fs from 'fs';
import { execSync } from 'child_process';

const REPO = 'C:/Users/dusti/Projects/Human_History';
const F = {
  grav: REPO + '/site/gravity.js',
  idx: REPO + '/site/index.js',
  html: REPO + '/site/index.html'
};
const good = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, fs.readFileSync(p)]));
const text = Object.fromEntries(Object.entries(good).map(([k, b]) => [k, b.toString('utf8')]));

const patch = (which, ...pairs) => {
  const out = pairs.reduce((s, [from, to]) => {
    if (!s.includes(from)) throw new Error(`anchor missing in ${which}: ` + from.slice(0, 70));
    return s.replace(from, to);
  }, text[which]);
  fs.writeFileSync(F[which], out);
};

const CASES = {
  /* THE ENDING IS DELETED: the last object shatters like the other 229.

     EXPECTATION CORRECTED, NOT THE GATE. This first expected `name_dies_at_impact` to redden too,
     and it stayed green — correctly. The cut and the name exemption are two different touch points:
     removing the cut leaves `d.blown = d.i !== LAST` in place, so the last name still outlives
     impact and the survivor set is still exactly {229}, which is all that gate claims. The case
     that moves it is `two_of_them_survive`. */
  the_last_one_breaks_too: {
    sweep: 'sweep10', expect: ['only_the_last_one_survives'],
    apply: () => patch('grav', ['  if (d.im) { if (d.i === LAST) keepWhole(d); else shatterNow(d, cx, cy, IMPACT); }',
                                '  if (d.im) shatterNow(d, cx, cy, IMPACT);']),
  },
  /* IT BREAKS, JUST LATER — the shape a tolerance-shaped gate would wave through. It keeps its one
     whole piece and then splits and dusts on schedule. */
  the_ending_breaks_late: {
    sweep: 'sweep10', expect: ['only_the_last_one_survives'],
    apply: () => patch('grav', ['  if (d.i === LAST) return;             // 14: it never breaks, so it never splits and never dusts',
                                '  if (d.i === LAST && d.age < 0.5) return;']),
  },
  /* THE EXEMPTION WIDENS BY ONE. This is the case the re-aim exists for: a gate that merely skipped
     index N-1 would stay green here, because it would never look at N-2. */
  two_of_them_survive: {
    sweep: 'sweep10', expect: ['name_dies_at_impact'],
    apply: () => patch('grav', ['  d.blown = d.i !== LAST;                            // the name and date break; see `place()`',
                                '  d.blown = d.i < LAST - 1;']),
  },
  /* THE TEXTURE WINDOW TAKES THE ENDING BACK. 03's upper bound restored for the last object, which
     is the defect that shipped for twenty minutes this round: the window released its photograph
     before it landed, "no pixels, no fall" held it in the air, and the piece ended mid-fall. */
  the_ending_never_lands: {
    sweep: 'sweep10', expect: ['only_the_last_one_survives'],
    apply: () => patch('grav', ['      if (rel > -AHEAD && (d.i === LAST || rel - FALL < LIFE[d.i])) want(d); else release(d);',
                                '      if (rel > -AHEAD && rel - FALL < LIFE[d.i]) want(d); else release(d);']),
  },
  /* THE SIGNATURE FOLLOWS YOU ONTO THE SHELF, next to the colophon's copy of itself. */
  signature_follows_you_in: {
    sweep: 'sweep11i', expect: ['signature_goes_out_with_the_piece'],
    apply: () => patch('grav',
      ['    markEl.style.opacity = (MARK_REST * (1 - fade)).toFixed(3);', ''],
      ["    markEl.style.visibility = fade >= 1 ? 'hidden' : 'visible';", '']),
  },
  /* ITS FADE GOES BACK ON A WALL CLOCK — a 200ms ease on a value the scrollbar owns. */
  signature_on_a_clock: {
    sweep: 'sweep11i', expect: ['signature_goes_out_with_the_piece'],
    apply: () => patch('html', ['            transition:transform .2s ease,border-color .2s ease}',
                                '            transition:opacity .2s ease,transform .2s ease,border-color .2s ease}']),
  },
  /* THE COLOPHON LOSES THE ONE LINK OFF THIS SITE. */
  colophon_drops_the_link: {
    sweep: 'sweep11i', expect: ['colophon_links_to_deep_time'],
    apply: () => patch('idx', ["  out.href = 'https://deeptime.dustincoledata.com';",
                               "  out.href = '#';"]),
  },
  /* THE MARK STOPS BEING FURNITURE THE WORDS RESPECT — 11's contract, with the pill exempt.

     EXPECTATION CORRECTED. This expected both viewports and only the phone went red: **1 overlap
     over 290 stops at 390, none at 1440**. That is the honest result rather than a weak gate — at
     1440 the soil is wide, the citations sit centrally and the bottom-right corner is genuinely
     empty most of the way down, so the desktop sweep can pass with the reservation deleted. The
     phone is what proves the reservation is load-bearing, and it is the viewport where a fixed
     pill and a credit are actually competing for the same corner. Worth knowing before anyone
     reads a green 1440 as evidence the pill is out of the way. */
  signature_ignores_the_words: {
    sweep: 'sweep10', expect: ['signature_keeps_its_corner_clear'],
    apply: () => patch('grav', ['  if (markEl.style.visibility !== \'hidden\') {',
                                '  if (false) {']),
  },
};

const only = process.argv[2];
const out = [];
for (const [name, c] of Object.entries(CASES)) {
  if (only && only !== name) continue;
  console.log(`\n=== ${name}  (${c.sweep}: expect ${c.expect.join(' + ')} red) ===`);
  let red = [], notes = [];
  try {
    c.apply();
    try {
      execSync(`node ${c.sweep}.mjs`, { stdio: 'pipe', encoding: 'utf8', timeout: 900000 });
    } catch (e) {
      const m = (e.stdout || '').match(/FAILED: (.*)$/m);
      red = m ? m[1].split(', ') : [];
      if (!m) console.log('  (no FAILED line — sweep threw)\n' + (e.stdout || '').slice(-500) + (e.stderr || '').slice(-400));
      notes = (e.stdout || '').split('\n').filter(l => /^FAIL\s/.test(l)).map(l => '    ' + l.trim());
    }
    const hit = c.expect.every(x => red.includes(x));
    out.push({ name, red, hit });
    console.log(hit ? `  RED as designed: ${red.join(', ')}` : `  *** DID NOT GO RED *** (red: ${red.join(', ') || 'none'})`);
    if (notes.length) console.log(notes.join('\n'));
  } catch (err) {
    out.push({ name, red: ['(perturbation failed: ' + err.message + ')'], hit: false });
    console.log('  *** ' + err.message);
  } finally {
    for (const [k, p] of Object.entries(F)) fs.writeFileSync(p, good[k]);
  }
}
for (const [k, p] of Object.entries(F)) fs.writeFileSync(p, good[k]);
console.log(`\nfiles restored byte-identical: ${Object.entries(F).every(([k, p]) => Buffer.compare(good[k], fs.readFileSync(p)) === 0)}`);
console.log(out.map(o => `${o.hit ? 'OK  ' : 'MISS'} ${o.name} -> ${o.red.join(', ') || 'nothing'}`).join('\n'));
console.log(`\n${out.filter(o => o.hit).length}/${out.length} perturbations went red`);
