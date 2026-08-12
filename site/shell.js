/* Shared bits: the data, the era light colours, the HUD and the intro. The facts stay crisp
   text over the canvas and are never drawn into it (ticket 12, finding 4); gravity.js owns how
   they are placed, because as of ticket 06 a fact is a field of individually positioned words
   rather than a block of text. */

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
/* t is 0..1 of the intro's OWN life, and the caller decides what that life is. It was `1 - t * 4`
   against a t measured out to the eighth arrival, which is two numbers doing one job and neither of
   them attached to anything on screen. Linear, and the caller names the event it ends on. */
export function fadeIntro(t) {
  const o = Math.max(0, 1 - t);
  document.getElementById('intro').style.opacity = o;
  document.getElementById('hint').style.opacity = 0.4 * o;
}
export const done = () => document.getElementById('loading').classList.add('gone');
