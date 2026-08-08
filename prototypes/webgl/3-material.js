/* 3 — MATERIAL. The ground is not a colour, it is a running simulation: domain-warped
   flow that morphs through the material of the age — wet clay, molten metal, ink in water,
   plasma. It reacts to the cursor and to how fast you are scrolling, and the objects leave
   a wake in it as they pass. The photographs sit on top, untouched, as crisp DOM. */

import * as THREE from 'three';
import { ITEMS, lightFor, hex2rgb, setHud, setIntro, fadeIntro, done, REDUCED } from './shell.js';

setIntro('The ground is alive — clay, then molten metal, then ink in water, then plasma. Move the cursor through it.',
         'scroll · move the cursor');

/* material of the age: three colours per era, morphed continuously */
const MATS = [
  [-99999, ['#2a1206', '#8a3a1c', '#d98b3a'], 'WET CLAY'],
  [-2000,  ['#0b1c22', '#1f6e63', '#7fd6b0'], 'OXIDISED COPPER'],
  [200,    ['#12061e', '#4b1b6b', '#c46ad6'], 'GROUND PIGMENT'],
  [1450,   ['#06121f', '#12457a', '#5fb6e8'], 'INK IN WATER'],
  [1800,   ['#1a0703', '#8c2708', '#ffb03a'], 'MOLTEN IRON'],
  [1900,   ['#150a20', '#7a1f6a', '#ff5bd0'], 'ANILINE DYE'],
  [1965,   ['#02120c', '#0a6e4a', '#66ffc2'], 'PHOSPHOR'],
  [1990,   ['#04060f', '#1b3fbf', '#7fd0ff'], 'PLASMA']
];
const matFor = y => MATS.filter(m => y >= m[0]).pop();

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
document.getElementById('gl').appendChild(renderer.domElement);
renderer.domElement.style.cssText = 'position:fixed;inset:0';

const uni = {
  uTime: { value: 0 }, uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uVel: { value: 0 },
  uA: { value: new THREE.Color(MATS[0][1][0]) },
  uB: { value: new THREE.Color(MATS[0][1][1]) },
  uC: { value: new THREE.Color(MATS[0][1][2]) }
};

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
  uniforms: uni,
  vertexShader: `void main(){ gl_Position = vec4(position,1.0); }`,
  fragmentShader: `
    precision highp float;
    uniform vec2 uRes, uMouse; uniform float uTime, uVel; uniform vec3 uA,uB,uC;

    vec2 hash2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
                        return -1.0 + 2.0*fract(sin(p)*43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(dot(hash2(i+vec2(0,0)), f-vec2(0,0)), dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
                 mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)), dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for(int i=0;i<6;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
      return v;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes.xy;
      vec2 p = uv * vec2(uRes.x/uRes.y, 1.0) * 2.4;
      float t = uTime * 0.055;

      // the cursor drags the material around
      vec2 m = uMouse * vec2(uRes.x/uRes.y, 1.0) * 2.4;
      float d = length(p - m);
      vec2 push = normalize(p - m + 1e-4) * exp(-d*2.4) * 0.55;

      // domain warping — this is what makes it look like a fluid and not like noise
      vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2,1.3) - t*0.7));
      vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7,9.2) + t*0.4 + push),
                    fbm(p + 3.0*q + vec2(8.3,2.8) - t*0.3 + push));
      float f = fbm(p + 3.4*r + uVel*0.6);

      vec3 col = mix(uA, uB, clamp(f*1.9+0.42, 0.0, 1.0));
      col = mix(col, uC, clamp(pow(length(r), 2.4)*1.5, 0.0, 1.0));
      col += uC * exp(-d*3.2) * 0.22;                       // the cursor glows through it
      col *= 1.0 - 0.36*pow(length(uv-0.5)*1.5, 2.0);        // vignette
      gl_FragColor = vec4(col, 1.0);
    }`
}));
scene.add(mesh);

/* ---- the objects: ordinary crisp DOM over the living ground ---- */
const MV = window.MOVEMENTS;
const flow = document.getElementById('spacer');
flow.style.pointerEvents = 'auto';
flow.innerHTML = '<div style="height:78vh"></div>' + (() => {
  let out = '', prev = null;
  MV.forEach(mv => {
    const inMv = ITEMS.filter(i => i.y >= mv.from && i.y <= mv.to);
    for (let i = 0; i < inMv.length; i += mv.per) {
      const row = inMv.slice(i, i + mv.per);
      const gap = prev === null ? 0 : row[0].y - prev;
      prev = row[row.length - 1].y;
      const sp = Math.min(340, Math.round(50 + 120 * Math.log10(1 + Math.abs(gap) / 9)));
      const h = 46 - (mv.per - 1) * 7;
      out += `<div class="mrow" data-year="${row[0].y}" style="margin-top:${sp}px;--h:${h}vh">` +
        row.map(it => `<figure class="mitem">
            <img src="img/${it.k}.webp" alt="${it.n}" loading="lazy">
            <figcaption><b>${it.n}</b><span>${it.disp}</span>
              <em>${it.src} · ${it.lic} · ${it.cred}</em></figcaption>
          </figure>`).join('') + '</div>';
    }
  });
  return out + '<div style="height:60vh"></div>';
})();

const css = document.createElement('style');
css.textContent = `
  #spacer{position:relative;z-index:2}
  .mrow{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:center;
        gap:clamp(18px,4vw,64px);padding:0 clamp(14px,4vw,56px)}
  .mitem{max-width:42vw;text-align:center}
  .mitem img{max-height:var(--h);width:auto;max-width:38vw;
             filter:drop-shadow(0 18px 34px rgba(0,0,0,.6))}
  .mitem figcaption{margin-top:14px;text-shadow:0 2px 14px rgba(0,0,0,.85)}
  .mitem b{display:block;font-size:clamp(12px,1.3vw,15px);font-weight:700}
  .mitem span{display:block;font-size:clamp(11px,1.1vw,13px);font-weight:600;margin-top:.25em;
              color:var(--spot,#fff);font-variant-numeric:tabular-nums}
  .mitem em{display:block;font-style:normal;font-size:9.5px;font-weight:500;letter-spacing:.06em;
            text-transform:uppercase;opacity:.5;margin-top:.6em;line-height:1.5}`;
document.head.appendChild(css);

const A = new THREE.Color(), B = new THREE.Color(), C = new THREE.Color();
let vel = 0, lastY = scrollY;
addEventListener('pointermove', e => {
  uni.uMouse.value.set(e.clientX / innerWidth, 1 - e.clientY / innerHeight);
}, { passive: true });
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  uni.uRes.value.set(innerWidth, innerHeight);
});

done();
renderer.setAnimationLoop(t => {
  uni.uTime.value = REDUCED ? 0 : t * 0.001;
  const dy = scrollY - lastY; lastY = scrollY;
  vel += (Math.min(1.6, Math.abs(dy) * 0.02) - vel) * 0.08;
  uni.uVel.value = vel;

  const max = document.documentElement.scrollHeight - innerHeight;
  fadeIntro(Math.min(1, scrollY / Math.max(1, max)));

  let cur = null, best = 1e9, mid = innerHeight * 0.45;
  document.querySelectorAll('.mrow').forEach(el => {
    const r = el.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
    if (d < best) { best = d; cur = el; }
  });
  if (cur) {
    const y = +cur.dataset.year, m = matFor(y), l = lightFor(y);
    A.set(m[1][0]); B.set(m[1][1]); C.set(m[1][2]);
    uni.uA.value.lerp(A, 0.03); uni.uB.value.lerp(B, 0.03); uni.uC.value.lerp(C, 0.03);
    setHud(y, m[2], m[1][2]);
  }
  renderer.render(scene, camera);
});
