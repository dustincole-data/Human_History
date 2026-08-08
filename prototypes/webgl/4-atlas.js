/* 4 — ATLAS. Not a scroll at all. Twelve thousand years laid out as a place you steer
   through: drag to turn, wheel to fly in and out. Zoom out and you see the whole shape of
   it — a thin thread that thickens into a cloud. Zoom in and single objects name themselves.

   This deliberately breaks the native-scroll rule, which is the trade to weigh: it is the
   most "cool site" of the four and the one NN/g would like least on a phone. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls-OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ITEMS, lightFor, hash, radialCanvas, setHud, setIntro, fadeIntro, done, makeLabels, REDUCED }
  from './shell.js';

setIntro('Twelve thousand years as a place. Drag to turn it, wheel to fly in. It starts as one thin thread and ends as a cloud.',
         'drag to turn · wheel to fly');
document.body.style.overflow = 'hidden';
document.getElementById('spacer').style.height = '0';

const MV = window.MOVEMENTS;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04050a);
scene.fog = new THREE.FogExp2(0x04050a, 0.0032);
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.5, 3000);
camera.position.set(120, 60, 210);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('gl').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.06;
controls.minDistance = 12; controls.maxDistance = 900;
controls.target.set(0, 0, -160);
controls.autoRotate = !REDUCED; controls.autoRotateSpeed = 0.22;
renderer.domElement.addEventListener('pointerdown', () => { controls.autoRotate = false; });

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.75, 0.7, 0.78);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const glowTex = new THREE.CanvasTexture(radialCanvas());
glowTex.colorSpace = THREE.SRGBColorSpace;

/* ---- layout: a thread that thickens. time runs along -z, spread grows with density ---- */
const nodes = [];
let z = 0, prev = null;
ITEMS.forEach(it => {
  const mv = MV.find(m => it.y >= m.from && it.y <= m.to) || MV[0];
  const d = (mv.per - 1) / 4;
  const gap = prev === null ? 0 : it.y - prev; prev = it.y;
  z -= 5 + 0.06 * Math.min(400, 40 + 132 * Math.log10(1 + Math.abs(gap) / 9));
  const a = hash(it.k, 7) * Math.PI * 2, rad = (0.4 + hash(it.k, 8)) * (2 + d * 40);
  nodes.push({
    it, x: Math.cos(a) * rad, y: Math.sin(a) * rad * 0.55, z,
    h: 9 - d * 4.4, light: lightFor(it.y)
  });
});

/* era clouds — a soft glow per light change, so the shape reads even from far out */
let lastL = null;
nodes.forEach(n => {
  if (n.light === lastL) return; lastL = n.light;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: new THREE.Color(n.light[1]), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.16, fog: false
  }));
  s.scale.set(120, 120, 1); s.position.set(0, 0, n.z);
  scene.add(s);
});

{ // star-free dust so the volume has a floor of texture
  const N = 3000, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 420;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 240;
    pos[i * 3 + 2] = -Math.random() * Math.abs(z) - 40;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    map: new THREE.CanvasTexture(radialCanvas('rgba(255,255,255,1)', 'rgba(255,255,255,.3)', 64)),
    size: 0.7, transparent: true, opacity: 0.3, depthWrite: false,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: true
  })));
}

const loader = new THREE.TextureLoader();
let pending = nodes.length;
nodes.forEach(n => {
  loader.load(`img/${n.it.k}.webp`, tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const h = n.h, w = h * (tex.image.width / tex.image.height);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, depthWrite: false }));
    m.position.set(n.x, n.y, n.z);
    scene.add(m); n.mesh = m; n.w = w;
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color(n.light[1]), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.34, fog: false
    }));
    halo.scale.set(Math.max(w, h) * 2.2, Math.max(w, h) * 2.2, 1);
    halo.position.set(n.x, n.y, n.z - 0.5);
    scene.add(halo);
    if (--pending === 0) { done(); }
  }, undefined, () => { if (--pending === 0) done(); });
});

const labels = makeLabels(nodes.map(n => n.it));
const proj = new THREE.Vector3(), camPos = new THREE.Vector3(), taken = [];

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
});

fadeIntro(0);
let introOut = false;
renderer.setAnimationLoop(() => {
  controls.update();
  camera.getWorldPosition(camPos);

  // the objects always face you — this is a place, not a wall of cards
  for (const n of nodes) if (n.mesh) n.mesh.quaternion.copy(camera.quaternion);

  // nearest object to the camera owns the HUD
  let cur = nodes[0], best = 1e9;
  for (const n of nodes) { const d = camPos.distanceTo(n.mesh ? n.mesh.position : camPos); if (d < best) { best = d; cur = n; } }
  setHud(cur.it.y, cur.light[2], cur.light[1]);
  if (!introOut && controls.getDistance() < 200) { introOut = true; fadeIntro(1); }

  // labels only when you are actually close enough to read one thing at a time
  taken.length = 0;
  const order = nodes.map((n, i) => ({ i, d: n.mesh ? camPos.distanceTo(n.mesh.position) : 1e9 }))
                     .sort((a, b) => a.d - b.d);
  const shown = new Set();
  for (const o of order) {
    if (taken.length >= 6 || o.d > 105) break;
    const n = nodes[o.i], el = labels[o.i];
    proj.set(n.x, n.y - n.h / 2 - 0.8, n.z).project(camera);
    if (proj.z > 1) continue;
    const sx = (proj.x * .5 + .5) * innerWidth, sy = (-proj.y * .5 + .5) * innerHeight;
    if (sx < 0 || sx > innerWidth || sy < 0 || sy > innerHeight) continue;
    const w = Math.min(innerWidth * 0.4, 300);
    if (taken.some(r => Math.abs(r.x - sx) < (r.w + w) / 2 - 8 && Math.abs(r.y - sy) < 70)) continue;
    taken.push({ x: sx, y: sy, w });
    el.style.transform = `translate(-50%,0) translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`;
    el.style.opacity = Math.min(1, (105 - o.d) / 45).toFixed(3);
    el.style.setProperty('--spot', n.light[1]);
    shown.add(o.i);
  }
  for (let i = 0; i < labels.length; i++)
    if (!shown.has(i) && labels[i].style.opacity !== '0') labels[i].style.opacity = '0';

  composer.render();
});
