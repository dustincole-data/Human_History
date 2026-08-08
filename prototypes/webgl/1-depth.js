/* 1 — DEPTH. Direction B made real: the objects are not on a page, they are in a volume,
   and the scroll flies the camera through it. The era's light is an actual light in actual
   air — coloured haze, shafts, drifting dust, bloom — so the colour is in the room and the
   photograph itself is never touched. Native scroll 1:1: no pin, no hijack, no timer.

   Contemporaries sit at the SAME depth, spread across your field of view, so the deep past
   is one object alone in the dark and the present is a crowd you fly straight through. */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ITEMS, REDUCED, lightFor, hash, radialCanvas, setHud, setIntro, fadeIntro, done, makeLabels }
  from './shell.js';

setIntro('Everything is lit by the light of its own moment — firelight, oil lamp, gaslight, filament, phosphor. Scroll and you fly through it.',
         'scroll to fly');

const MV = window.MOVEMENTS;
const mvFor = y => MV.find(m => y >= m.from && y <= m.to) || MV[0];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.5, 700);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('gl').appendChild(renderer.domElement);

scene.fog = new THREE.FogExp2(0x05060a, 0.0042);
scene.background = new THREE.Color(0x05060a);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.6, 0.82);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const glowTex = new THREE.CanvasTexture(radialCanvas());
glowTex.colorSpace = THREE.SRGBColorSpace;

/* ---- layout: contemporaries share a depth ---- */
const groups = [];
MV.forEach(mv => {
  const inMv = ITEMS.filter(i => i.y >= mv.from && i.y <= mv.to);
  for (let i = 0; i < inMv.length; i += mv.per) groups.push({ mv, items: inMv.slice(i, i + mv.per) });
});

/* Per movement: how far apart in depth, how big, how wide across your view.
   This IS the density contour — one huge object alone in the dark, then a crowd you fly through. */
const STEP  = { deep: 52, spread: 38, trade: 28, machine: 21, now: 15 };
const HGT   = { deep: 14, spread: 10.5, trade: 8, machine: 6.4, now: 5.4 };
const SPANX = { deep: 0,  spread: 7,    trade: 10, machine: 13, now: 15 };
const SPANY = { deep: 2,  spread: 4,    trade: 6,  machine: 7,  now: 8 };

const nodes = [];
let z = -34;
groups.forEach(g => {
  z -= STEP[g.mv.id];
  const y0 = g.items[0].y, n = g.items.length;
  g.items.forEach((it, i) => {
    const off = n === 1 ? 0 : (i / (n - 1) - 0.5) * 2;       // -1 .. 1 across the group
    const h = HGT[g.mv.id];
    let x = off * SPANX[g.mv.id] + (hash(it.k, 1) - 0.5) * 3;
    let y = (hash(it.k, 2) - 0.5) * SPANY[g.mv.id];
    // keep a clear corridor down the middle: you fly PAST things, never through them.
    const need = h * 0.52 + 3.4, r = Math.hypot(x, y);
    if (r < need) {
      const a = hash(it.k, 4) * Math.PI * 2;
      x = Math.cos(a) * need; y = Math.sin(a) * need * 0.6;
    }
    nodes.push({
      it, z: z + (hash(it.k, 3) - 0.5) * 5, x, y, h,
      light: lightFor(it.y), groupYear: y0
    });
  });
});
const zEnd = z - 60;

/* ---- one soft shaft per change of light; you fly straight through them ---- */
let lastL = null;
nodes.forEach(n => {
  if (n.light === lastL) return;
  lastL = n.light;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: new THREE.Color(n.light[1]), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.15, fog: false
  }));
  s.scale.set(96, 96, 1);
  s.position.set(n.x * 0.3, n.y * 0.3 + 1.5, n.z + 16);
  scene.add(s);
});

/* ---- dust: what makes the air read as air ---- */
{
  const N = 2200, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 100;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 66;
    pos[i * 3 + 2] = -Math.random() * 260;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(g, new THREE.PointsMaterial({
    map: new THREE.CanvasTexture(radialCanvas('rgba(255,255,255,1)', 'rgba(255,255,255,.28)', 64)),
    size: 0.34, transparent: true, opacity: 0.38, depthWrite: false,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: true
  }));
  scene.add(dust);
  scene.userData.dust = dust;
}

/* ---- the objects ---- */
const loader = new THREE.TextureLoader();
let pending = nodes.length;
nodes.forEach(n => {
  loader.load(`img/${n.it.k}.webp`, tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const h = n.h, w = h * (tex.image.width / tex.image.height);
    n.w = w;
    // MeshBasic, deliberately: a lit material would tint the photograph, which is banned.
    // The light lives in the haze, the shafts and the halo behind — never on the artifact.
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02,
                                    depthWrite: false, fog: true })
    );
    m.position.set(n.x, n.y, n.z);
    m.renderOrder = 2;
    scene.add(m);
    n.mesh = m;

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color(n.light[1]), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.4, fog: false
    }));
    halo.scale.set(Math.max(w, h) * 2.1, Math.max(w, h) * 2.1, 1);
    halo.position.set(n.x, n.y, n.z - 0.8);
    scene.add(halo);
    n.halo = halo;

    if (--pending === 0) start();
  }, undefined, () => { if (--pending === 0) start(); });
});

const labels = makeLabels(nodes.map(n => n.it));
const proj = new THREE.Vector3();
const vis = [], taken = [];
const fogCol = new THREE.Color(0x05060a);
const tmp = new THREE.Color(), dark = new THREE.Color(0x04050a);
let mx = 0, my = 0, tmx = 0, tmy = 0;

addEventListener('pointermove', e => {
  tmx = (e.clientX / innerWidth - 0.5) * 2;
  tmy = (e.clientY / innerHeight - 0.5) * 2;
}, { passive: true });

function start() {
  document.getElementById('spacer').style.height = Math.round(Math.abs(zEnd) * 17) + 'px';
  done();
  renderer.setAnimationLoop(frame);
}

function frame(t) {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
  const camZ = 16 + p * (zEnd - 16);

  mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
  camera.position.set(mx * 2.6, -my * 1.8, camZ);
  camera.lookAt(mx * 1.3, -my * 0.9, camZ - 24);

  // whichever group the camera is closest to owns the light, the haze and the HUD
  let cur = nodes[0], best = 1e9;
  for (const n of nodes) { const d = Math.abs(n.z + 8 - camZ); if (d < best) { best = d; cur = n; } }
  tmp.set(cur.light[1]).multiplyScalar(0.085).lerp(dark, 0.5);
  fogCol.lerp(tmp, 0.035);
  scene.fog.color.copy(fogCol);
  scene.background.copy(fogCol);
  setHud(cur.groupYear, cur.light[2], cur.light[1]);
  fadeIntro(p);

  const dust = scene.userData.dust;
  dust.position.z = Math.round(camZ / 260) * 260;
  dust.rotation.z = t * 0.00001;

  // soft in/out at the very edges of the corridor so nothing pops
  for (const n of nodes) {
    if (!n.mesh) continue;
    const dz = camZ - n.z;
    const o = Math.min(1, Math.max(0, (dz + 4) / 7));
    n.mesh.material.opacity = o;
    if (n.halo) n.halo.material.opacity = 0.4 * o;
  }

  /* Labels: crisp DOM over the canvas. dz > 0 means the object is still ahead of you.
     Nearest first, and any label whose box would land on one already placed is dropped —
     "nothing overlaps, ever" is a ship gate, and it has to hold in screen space too. */
  vis.length = 0;
  for (let i = 0; i < nodes.length; i++) {
    const dz = camZ - nodes[i].z;
    if (nodes[i].mesh && dz <= 88 && dz >= -6) vis.push({ i, dz });
  }
  vis.sort((a, b) => a.dz - b.dz);
  taken.length = 0;
  const shown = new Set();
  for (const v of vis) {
    if (taken.length >= 5) break;
    const n = nodes[v.i], el = labels[v.i];
    proj.set(n.x, n.y - n.h / 2 - 0.9, n.z).project(camera);
    if (proj.z > 1) continue;
    const sx = (proj.x * 0.5 + 0.5) * innerWidth, sy = (-proj.y * 0.5 + 0.5) * innerHeight;
    if (sx < -160 || sx > innerWidth + 160 || sy < -40 || sy > innerHeight + 40) continue;
    const w = Math.min(innerWidth * 0.44, 330), h = 76;
    if (taken.some(r => Math.abs(r.x - sx) < (r.w + w) / 2 - 8 && Math.abs(r.y - sy) < h - 6)) continue;
    taken.push({ x: sx, y: sy, w });
    const inn = Math.min(1, Math.max(0, (v.dz + 6) / 18));    // fades in as you approach
    const out = Math.min(1, Math.max(0, (88 - v.dz) / 30));   // and out as it recedes ahead
    el.style.transform = `translate(-50%,0) translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`;
    el.style.opacity = (inn * out).toFixed(3);
    el.style.setProperty('--spot', n.light[1]);
    shown.add(v.i);
  }
  for (let i = 0; i < labels.length; i++)
    if (!shown.has(i) && labels[i].style.opacity !== '0') labels[i].style.opacity = '0';

  composer.render();
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  bloom.setSize(innerWidth, innerHeight);
});

if (REDUCED) bloom.strength = 0.4;
