/* Shared bits: the data, the era light colours, the HUD and the intro. The facts stay crisp
   text over the canvas and are never drawn into it (ticket 12, finding 4); gravity.js owns how
   they are placed, because as of ticket 06 a fact is a field of individually positioned words
   rather than a block of text. */

export const ITEMS = window.ITEMS;
export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The light people actually had. Kept from direction B, which is the one Dustin picked
   when forced — dark, lit, cinematic. Here it becomes a real light, not a CSS gradient.

   ART PASS · DARK — the ramp re-anchored on what each lamp actually put into the sky, and one
   entry replaced: PHOSPHOR (a screen lit rooms, but it never lit the sky) gives its slot to
   SODIUM VAPOUR, the orange blanket that WAS the night sky from the fifties to the nineties and
   the one colour beat the old ramp skipped — the ramp ran warm → mint → blue and the century
   everyone alive remembers as orange never happened. Now the last three moves are the real ones:
   the fluorescent pallor, the sodium decades, and LED scrubbing the orange out. Gaslight is
   pulled off acid lime toward the pale lime-white a mantle burns at; tungsten warms back toward
   an actual filament. Every value stays light enough to clear 4.5:1 as the HUD era name and as
   a date word over its own era's sky — the two gates that bind this table. */
export const LIGHTS = [
  [-99999, '#ff8226', 'FIRELIGHT'],
  [-3000,  '#ffa848', 'OIL LAMP'],
  [-500,   '#ffd282', 'CANDLE'],
  [1780,   '#ffe9bc', 'ARGAND LAMP'],
  [1820,   '#dcedb6', 'GASLIGHT'],
  [1880,   '#ffb254', 'CARBON FILAMENT'],
  [1910,   '#ffe2a4', 'TUNGSTEN'],
  [1940,   '#d9f4e4', 'FLUORESCENT'],
  [1958,   '#ffa53a', 'SODIUM VAPOUR'],
  [1993,   '#b7d7ff', 'LED']
];
export const lightFor = y => LIGHTS.filter(l => y >= l[0]).pop();

/* ------------------------------------------------------------------ the context line

   Dustin's third ask of the environment pass: "sprinkle in events during certain periods so
   people understand what time frame they are looking at."

   A COUNTER IS NOT AN ANCHOR. `1831` is a number; *Britain abolishes slavery in its colonies* is a
   place in history, and the piece's whole subject is what was standing next to what. The counter
   has always said WHEN and never once said WHAT ELSE.

   IT RIDES THE HUD, AND THAT IS THE ONLY PLACE IT COULD GO. 06 round 10 ruled the ground wordless
   and Dustin rejected a caption on the soil outright; the sky carries the falling object's own
   name and date. The HUD is the site's one disclosure surface, it already answers "when", and it
   is furniture the collision list can reserve. Nothing else on the page had room that did not
   belong to something.

   THESE ARE NOT ARRIVALS. 05's ruling R1 — *an arrival is always a made object with a body* — is
   untouched: none of these falls, none of them is drawn, none of them is in the set. They are a
   caption on the counter. Where a conventional date is approximate it is written `c.`, which is
   the same hedge the arrivals use, and no date here is contested at the century scale.

   IT IS SPRINKLED, and the gaps are the point. Each line is up only near its own year — half the
   distance to its neighbours, times 0.66 — so roughly a third of the scroll has no context line at
   all and one arriving is an event rather than a permanent field. */
export const EVENTS = [
  [-9600, 'c.', 'Göbekli Tepe raised'],
  [-8000, 'c.', 'Farming spreads through the Fertile Crescent'],
  [-6500, 'c.', 'Rice farmed along the Yangtze'],
  [-3200, 'c.', 'Writing begins in Sumer'],
  [-3100, 'c.', 'Egypt unified'],
  [-2560, 'c.', 'The Great Pyramid finished'],
  [-1754, '',   'Hammurabi’s laws set down'],
  [-1200, 'c.', 'The Bronze Age collapses in the east Mediterranean'],
  [-776,  '',   'The first recorded Olympic games'],
  [-551,  'c.', 'Confucius born'],
  [-221,  '',   'China unified under the Qin'],
  [-27,   '',   'Rome becomes an empire'],
  [105,   '',   'Papermaking recorded in Han China'],
  [476,   '',   'The western Roman empire ends'],
  [622,   '',   'The Hijra, and the Islamic calendar begins'],
  [762,   '',   'Baghdad founded'],
  [1040,  'c.', 'Movable type in Song China'],
  [1206,  '',   'The Mongol empire begins'],
  [1347,  '',   'Plague reaches Europe'],
  [1440,  'c.', 'Printing with movable type at Mainz'],
  [1492,  '',   'Columbus crosses the Atlantic'],
  [1687,  '',   'Newton publishes the Principia'],
  [1789,  '',   'Revolution in France'],
  [1804,  '',   'Haiti wins its independence'],
  [1833,  '',   'Britain abolishes slavery in its colonies'],
  [1869,  '',   'The Suez canal opens'],
  [1885,  '',   'Europe partitions Africa at Berlin'],
  [1914,  '',   'The First World War begins'],
  [1929,  '',   'Wall Street crashes'],
  [1939,  '',   'The Second World War begins'],
  [1947,  '',   'India and Pakistan become independent'],
  [1969,  '',   'Apollo 11 lands on the Moon'],
  [1989,  '',   'The Berlin wall opens'],
  [1991,  '',   'The first web page goes up'],
  [2008,  '',   'The financial crisis']
];

/* The window each one holds, taken off its own neighbours rather than set — the deep head has
   millennia between lines and the last century has single years, and one fixed number cannot serve
   both. The ends are capped so the first and last do not run forever. */
const EV_W = EVENTS.map(([y], i) => {
  /* the two ends have one neighbour each, and the missing side is MIRRORED off the one they have
     rather than given a fixed cap. A fixed cap made the last line — the 2008 crisis — the standing
     caption for every year from 2002 to the end of the set, which is the opposite of sprinkled. */
  const back = i ? y - EVENTS[i - 1][0] : null;
  const fwd = i < EVENTS.length - 1 ? EVENTS[i + 1][0] - y : null;
  return [(back == null ? fwd : back) * 0.33, (fwd == null ? back : fwd) * 0.33];
});
export const eventFor = year => {
  for (let i = 0; i < EVENTS.length; i++)
    if (year >= EVENTS[i][0] - EV_W[i][0] && year <= EVENTS[i][0] + EV_W[i][1]) return EVENTS[i];
  return null;
};

export const fmt = y => (y < 0 ? Math.abs(y).toLocaleString('en-US') : String(y));
export const unit = y => (y < 0 ? 'BCE' : 'CE');
/* museum credit lines run to six lines on a label. keep the attribution, lose the endowment. */
export const shortCred = c => {
  const t = String(c || '').split(/,| Collection| Fund| Bequest| Gift of /)[0].trim();
  return (t.length > 46 ? t.slice(0, 44) + '…' : t) || String(c || '');
};

/* deterministic per-item scatter, so a reload looks identical */
export function hash(str, salt = 0) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}

const hudNum = document.querySelector('#hud .num');
const hudUnit = document.querySelector('#hud .unit');
const hudEra = document.querySelector('#hud .era');
const hudEv = document.querySelector('#hud .ev');
const hudEvY = document.querySelector('#hud .ev i');
const hudEvT = document.querySelector('#hud .ev span');
const root = document.documentElement;
let evAt = -1e9;

export function setHud(year, eraName, spot) {
  hudNum.textContent = fmt(year);
  hudUnit.textContent = unit(year);
  hudEra.textContent = eraName;
  /* written only when the line CHANGES. `setHud` runs every frame, and three text writes a frame
     into a fixed element is three style recalculations a frame for a string that moves about
     thirty times over 144,632px of scroll. */
  const ev = eventFor(year);
  const key = ev ? ev[0] : -1e9;
  if (key !== evAt) {
    evAt = key;
    hudEv.style.display = ev ? 'block' : 'none';
    if (ev) {
      hudEvY.textContent = `${ev[1] ? ev[1] + ' ' : ''}${fmt(ev[0])} ${unit(ev[0])}`;
      hudEvT.textContent = ev[2];
    }
  }
  root.style.setProperty('--spot', spot);
}

export function setIntro(text, hint) {
  document.getElementById('introp').textContent = text;
  document.getElementById('hint').textContent = hint;
}
/* t is 0..1 of the intro's OWN life, and the caller decides what that life is. It was `1 - t * 4`
   against a t measured out to the eighth arrival, which is two numbers doing one job and neither of
   them attached to anything on screen. Linear, and the caller names the event it ends on. */
export function fadeIntro(t) {
  const o = Math.max(0, 1 - t);
  document.getElementById('intro').style.opacity = o;
  document.getElementById('hint').style.opacity = 0.4 * o;
}
export const done = () => document.getElementById('loading').classList.add('gone');
