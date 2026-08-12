/* Do ticket 07's claims have teeth? Every case here breaks one thing the copy round changed and
   must turn exactly its own gate red. Files are restored afterwards and verified byte-identical.

   07 changed no mechanic — it changed strings, and then a longer paragraph exposed that the intro
   had never been inside any collision gate on this site. These are the perturbations for what came
   out of that: the furniture is in `boxes()` now, so `no_text_collision_*` is the gate that owns
   all of it.

     node teeth07.mjs [name]
*/
import fs from 'fs';
import { execSync } from 'child_process';

const REPO = 'C:/Users/dusti/Projects/Human_History';
const F = {
  grav: REPO + '/site/gravity.js',
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
  /* THE INTRO OUTLIVES THE FIRST LANDING — the state the page shipped in for two rounds. The frame
     ran to the eighth arrival, so the first object's date was printed across the headline. */
  intro_outlives_the_first_landing: {
    sweep: 'sweep10', expect: ['no_text_collision_1440'],
    apply: () => patch('grav', ['  fadeIntro(Math.min(1, scrollY / (START[0] + FALL)));',
                                '  fadeIntro(Math.min(1, scrollY / START[8]));']),
  },
  /* THE FADE GOES BACK ON A WALL CLOCK. 14 struck this off the signature and it was still on the
     intro. The gate has to be able to see a value that lags the scrollbar, not only one that is
     wrong at rest — a scrollbar drag paints the intro for half a second after the scroll position
     says it is gone. */
  intro_fade_on_a_clock: {
    sweep: 'sweep10', expect: ['no_text_collision_1440'],
    apply: () => patch('html', ['         max-width:min(46ch,80vw);pointer-events:none}',
                                '         max-width:min(46ch,80vw);pointer-events:none;transition:opacity .5s ease}']),
  },
  /* THE PHONE'S BOTTOM EDGE GOES BACK TO ONE LINE — the hint and the signature on the same 22px,
     92px of them the same pixels. Pre-existing since 14, invisible until furniture entered a gate. */
  hint_sits_on_the_signature: {
    sweep: 'sweep10', expect: ['no_text_collision_390'],
    apply: () => patch('html', ['  @media (max-width:640px){ #intro{padding-bottom:112px} #hint{bottom:64px} }', '']),
  },
  /* THE INTRO STOPS BEING FURNITURE THE WORDS RESPECT. Kept separate from the fade rule on purpose:
     the fade makes the conflict structural after contact, and this is the only thing standing
     between a label riding a falling object and the headline BEFORE contact. */
  intro_is_not_furniture: {
    sweep: 'sweep10', expect: ['no_text_collision_1440'],
    apply: () => patch('grav', ['  if (introO > 0.05) for (const el of introInk) {',
                                '  if (false) for (const el of introInk) {']),
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
      notes = (e.stdout || '').split('\n').filter(l => /^FAIL\s|first overlap/.test(l)).map(l => '    ' + l.trim());
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
