/* Shared bits for the four motion demos. Data, era light colours, the HUD, and the
   DOM label layer — because the facts must stay crisp text over the canvas, never
   drawn into it (ticket 12, finding 4). */

export const ITEMS = window.ITEMS;
export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The light people actually had. Kept from direction B, which is the one Dustin picked
   when forced — dark, lit, cinematic. Here it becomes a real light, not a CSS gradient. */
export const LIGHTS = [
  [-99999, '#ff7a1a', 'FIRELIGHT'],
  [-3000,  '#ffa33c', 'OIL LAMP'],
  [-500,   '#ffcf85', 'CANDLE'],
  [1780,   '#ffe4ae', 'ARGAND LAMP'],
  [1820,   '#c9f79c', 'GASLIGHT'],
  [1880,   '#ffb45c', 'CARBON FILAMENT'],
  [1910,   '#fff0cf', 'TUNGSTEN'],
  [1940,   '#cfffe8', 'FLUORESCENT'],
  [1965,   '#6cffb8', 'PHOSPHOR'],
  [1985,   '#9fd0ff', 'LED']
];
export const lightFor = y => LIGHTS.filter(l => y >= l[0]).pop();

export const fmt = y => (y < 0 ? Math.abs(y).toLocaleString('en-US') : String(y));
export const unit = y => (y < 0 ? 'BCE' : 'CE');
export const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255);

/* deterministic per-item scatter, so a reload looks identical */
export function hash(str, salt = 0) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}

/* soft radial sprite, generated rather than shipped */
export function radialCanvas(inner = 'rgba(255,255,255,1)', mid = 'rgba(255,255,255,.22)', size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner); grd.addColorStop(0.35, mid); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  return c;
}

const hudNum = document.querySelector('#hud .num');
const hudUnit = document.querySelector('#hud .unit');
const hudEra = document.querySelector('#hud .era');
const root = document.documentElement;

export function setHud(year, eraName, spot) {
  hudNum.textContent = fmt(year);
  hudUnit.textContent = unit(year);
  hudEra.textContent = eraName;
  root.style.setProperty('--spot', spot);
}

export function setIntro(text, hint) {
  document.getElementById('introp').textContent = text;
  document.getElementById('hint').textContent = hint;
}
export function fadeIntro(t) {                 // t 0..1 of how far in the visitor is
  const o = Math.max(0, 1 - t * 4);
  document.getElementById('intro').style.opacity = o;
  document.getElementById('hint').style.opacity = 0.4 * o;
}
export const done = () => document.getElementById('loading').classList.add('gone');

/* One reusable DOM label per item. Positioned from 3D/2D each frame by the demo. */
export function makeLabels(items) {
  const layer = document.getElementById('labels');
  return items.map(it => {
    const el = document.createElement('div');
    el.className = 'lab';
    el.style.opacity = 0;
    el.innerHTML = `<div class="n">${it.n}</div><div class="y">${it.disp}</div>
      <div class="c">${it.src} · ${it.lic} · ${it.cred}</div>`;
    layer.appendChild(el);
    return el;
  });
}
