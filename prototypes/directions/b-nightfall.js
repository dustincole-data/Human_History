/* B — NIGHTFALL. Colour lives in the light, never on the photograph.
   Each stretch is lit by the light people actually had, and the whole scroll runs from
   one small fire in total darkness to a present with no darkness left in it. */

(function () {
  const I = window.ITEMS, MV = window.MOVEMENTS;

  // from-year, light colour, what it was, one line of why
  const LIGHTS = [
    [-99999, '#ff7a1a', 'FIRELIGHT',       'open flame, and nothing else, for most of this page'],
    [-3000,  '#ffa33c', 'OIL LAMP',        'a wick floating in animal fat'],
    [-500,   '#ffcf85', 'CANDLE',          'beeswax if you were rich, tallow if you were not'],
    [1780,   '#ffe4ae', 'ARGAND LAMP',     'the first real improvement in two thousand years'],
    [1820,   '#c9f79c', 'GASLIGHT',        'piped flame — cities stop closing at dusk'],
    [1880,   '#ffb45c', 'CARBON FILAMENT', 'light with no fire in it'],
    [1910,   '#fff0cf', 'TUNGSTEN',        'cheap enough to leave switched on'],
    [1940,   '#cfffe8', 'FLUORESCENT',     'the colour of every room people work in'],
    [1965,   '#6cffb8', 'PHOSPHOR',        'the room is now lit by the thing you are looking at'],
    [1985,   '#9fd0ff', 'LED',             'white that is really blue, everywhere, all night']
  ];
  const lightFor = y => LIGHTS.filter(l => y >= l[0]).pop();
  const glow = (hex, a) => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16));
    return `rgba(${r},${g},${b},${a})`;
  };

  // the darkness lifts across the scroll: t0/t1 are the stage tones for each movement
  const TONE = {
    deep:    ['#04050a', '#05060c'],
    spread:  ['#05060c', '#07090f'],
    trade:   ['#07090f', '#0a0d14'],
    machine: ['#0a0d14', '#10141d'],
    now:     ['#10141d', '#191f2b']
  };
  //                  img height, pool w,  pool h, pool alpha
  const SIZE = { deep:    [46, '78vw', '86vh', .30],
                 spread:  [34, '86vw', '72vh', .26],
                 trade:   [27, '96vw', '64vh', .24],
                 machine: [22, '110vw','58vh', .22],
                 now:     [18, '130vw','56vh', .21] };

  const byKey = k => I.find(x => x.k === k);
  const PLANT = [['tutmask', 'nebra'], ['astrolabe', 'terracotta'], ['walkman', 'flyer']];
  const plantAt = {};
  PLANT.forEach(([a, b]) => {
    const A = byKey(a), B = byKey(b); if (!A || !B) return;
    plantAt[a] = `${A.n} was made <b>${Math.abs(A.y - B.y).toLocaleString('en-US')} years</b> after ${B.n}.`;
  });

  const rows = HH.rows(I, MV);
  const app = document.getElementById('app');
  app.className = 'night';

  let html = `<header class="intro">
      <h1>Twelve thousand years of things people built, and what was standing next to each one.</h1>
      <p>Everything here is lit by the light of its own moment — firelight, tallow, gaslight,
         filament, fluorescent, phosphor. The photographs are untouched; only the room changes.
         Scroll and things come out of the dark.</p>
    </header>`;

  let lastMv = null, lastLight = null, prevYear = null;
  rows.forEach(row => {
    const y0 = row.items[0].y;
    const L = lightFor(y0);
    const [h, pw, ph, pa] = SIZE[row.mv.id];

    if (row.mv !== lastMv) {
      if (lastMv) html += `</section>`;
      const t = TONE[row.mv.id];
      html += `<section class="mv" data-id="${row.mv.id}" style="--t0:${t[0]};--t1:${t[1]}">`;
      lastMv = row.mv; lastLight = null;
    }
    if (L !== lastLight) {
      html += `<div class="lamp" style="--light:${L[1]}"><b>${L[2]}</b><span>${L[3]}</span></div>`;
      lastLight = L;
    }

    const gapPx = HH.spaceFor(prevYear === null ? 0 : y0 - prevYear);
    html += `<div class="row" data-year="${y0}" data-era="${L[2]}" data-light="${L[1]}"
        style="margin-top:${gapPx}px;--h:${h}vh;--light:${L[1]};--glow:${glow(L[1], pa)};
               --pw:${pw};--ph:${ph};--gap:${row.mv.per > 3 ? '2.6vw' : '5vw'}">`;
    row.items.forEach(it => {
      html += `<figure class="item">
          <div class="pic"><img src="img/${it.k}.webp" alt="${it.n}" decoding="async" loading="lazy"></div>
          <figcaption class="cap">
            <div class="name">${it.n}</div>
            <div class="yr">${it.disp}</div>
            <div class="also">${HH.also(it, row, I)}</div>
            ${HH.cite(it)}
          </figcaption>
        </figure>`;
    });
    html += `</div>`;

    const plant = row.items.map(i => plantAt[i.k]).find(Boolean);
    if (plant) html += `<div class="callout" style="--light:${L[1]}">${plant}</div>`;
    prevYear = row.items[row.items.length - 1].y;
  });

  html += `</section>
    <footer class="stop">
      <h2>It stops here.</h2>
      <p>No finale. The browsable index would follow — every object, sortable, with its source.</p>
    </footer>
    <div id="hud"><b class="num">7,000</b><span class="unit">BCE</span><span class="era">FIRELIGHT</span></div>`;

  app.innerHTML = html;

  document.querySelectorAll('.row, .item, .callout').forEach(el => HH.track(el));

  const num = document.querySelector('#hud .num'), un = document.querySelector('#hud .unit'),
        era = document.querySelector('#hud .era'), hud = document.getElementById('hud');
  HH.hud(() => {
    const r = HH.currentRow('.row');
    if (!r) return;
    const y = +r.dataset.year;
    num.textContent = HH.fmt(y);
    un.textContent = HH.unit(y);
    era.textContent = r.dataset.era;
    hud.style.setProperty('--glow', glow(r.dataset.light, .5));
    hud.style.setProperty('--glow-solid', r.dataset.light);
  });
  HH.onScroll();
})();
