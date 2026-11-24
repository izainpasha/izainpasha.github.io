// One particle engine, two scroll stories.
//  - "hero": a sea of points rolls and lifts under the pointer. As the reader scrolls, the sea
//    settles into a grid of 288 small tiles (six points each) — one per project shipped —
//    and the camera swings from a low angle to look straight down on it.
//  - "morph": the process story. The same points re-form for each step:
//    a loose cloud (scope) → a lattice (build) → a sphere (QA) → a rising helix (launch) → a ring (support).
// Loaded with a dynamic import, so three.js never blocks the first paint.
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  NormalBlending,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

const COUNT = 1728; // 12³ for the lattice, 48 × 36 for the sea, 288 tiles × 6 for the grid
const TILE = { sx: 0.8, sz: 1.0, cols: 24, rows: 12 };

// Small seeded RNG so the shapes look the same on every visit.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shapes = {
  sea() {
    const out = new Float32Array(COUNT * 3), cols = 48, rows = 36;
    for (let i = 0; i < COUNT; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      out.set([(c / (cols - 1) - 0.5) * 22, 0, (r / (rows - 1) - 0.5) * 16], i * 3);
    }
    return out;
  },
  // 288 storefront tiles: 24 × 12 on landscape screens, 12 × 24 on portrait ones.
  tiles(portrait) {
    const out = new Float32Array(COUNT * 3);
    const cols = portrait ? TILE.rows : TILE.cols, rows = portrait ? TILE.cols : TILE.rows;
    const dots = [[-0.16, -0.26], [0.16, -0.26], [-0.16, 0], [0.16, 0], [-0.16, 0.26], [0.16, 0.26]];
    for (let t = 0; t < 288; t++) {
      const cx = ((t % cols) - (cols - 1) / 2) * TILE.sx;
      const cz = (Math.floor(t / cols) - (rows - 1) / 2) * TILE.sz;
      dots.forEach(([dx, dz], k) => out.set([cx + dx, 0, cz + dz], (t * 6 + k) * 3));
    }
    return out;
  },
  cloud() {
    const r = rng(7), out = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const u = r() * 2 - 1, a = r() * Math.PI * 2, d = 4.6 * Math.cbrt(r());
      const s = Math.sqrt(1 - u * u);
      out.set([d * s * Math.cos(a) * 1.25, d * u * 0.8, d * s * Math.sin(a)], i * 3);
    }
    return out;
  },
  lattice() {
    const out = new Float32Array(COUNT * 3), n = 12, step = 0.56, half = ((n - 1) * step) / 2;
    for (let i = 0; i < COUNT; i++) {
      const x = i % n, y = Math.floor(i / n) % n, z = Math.floor(i / (n * n));
      out.set([x * step - half, y * step - half, z * step - half], i * 3);
    }
    return out;
  },
  sphere() {
    const out = new Float32Array(COUNT * 3), golden = Math.PI * (3 - Math.sqrt(5)), R = 3.5;
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2, rad = Math.sqrt(1 - y * y), t = golden * i;
      out.set([Math.cos(t) * rad * R, y * R, Math.sin(t) * rad * R], i * 3);
    }
    return out;
  },
  helix() {
    const r = rng(11), out = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT, a = t * Math.PI * 12 + (i % 2) * Math.PI;
      const rad = 1.3 + (1 - t) * 1.4 + (r() - 0.5) * 0.35;
      out.set([Math.cos(a) * rad, (t - 0.5) * 7.4, Math.sin(a) * rad], i * 3);
    }
    return out;
  },
  ring() {
    const r = rng(23), out = new Float32Array(COUNT * 3), R = 3.3;
    for (let i = 0; i < COUNT; i++) {
      const u = r() * Math.PI * 2, v = r() * Math.PI * 2, tube = 0.55 + r() * 0.25;
      out.set([(R + tube * Math.cos(v)) * Math.cos(u), tube * Math.sin(v), (R + tube * Math.cos(v)) * Math.sin(u)], i * 3);
    }
    return out;
  },
};

const MORPH_SHAPES = ["cloud", "lattice", "sphere", "helix", "ring"];

const vertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aRand;
  uniform float uMix;
  uniform float uTime;
  uniform float uSea;
  uniform vec2 uPointer;
  uniform float uSize;
  uniform float uGrow;
  uniform float uPixelRatio;
  varying float vRand;
  varying float vGlow;

  void main() {
    // Each point leaves a little later than its neighbour, so shapes dissolve rather than snap.
    float t = clamp(uMix * 1.35 - aRand * 0.35, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(position, aTarget, t);

    float glow = 0.0;
    if (uSea > 0.5) {
      // The sea calms as each point finds its tile.
      float calm = 1.0 - t;
      p.y += (sin(p.x * 0.42 + uTime * 0.6) * 0.45 + cos(p.z * 0.55 + uTime * 0.45) * 0.35) * calm;
      glow = smoothstep(3.2, 0.0, distance(p.xz, uPointer)) * calm;
      p.y += glow * 1.2;
    } else {
      // A slow breath so a held shape still feels alive.
      p += normalize(p + 0.001) * sin(uTime * 0.8 + aRand * 6.2831) * 0.06;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uGrow * uPixelRatio * (0.65 + aRand * 0.7 + glow * 0.8) / -mv.z;
    vRand = aRand;
    vGlow = glow;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uAlpha;
  varying float vRand;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.2, d);
    vec3 col = mix(uColorA, uColorB, step(0.82, vRand) + vGlow * 0.6);
    gl_FragColor = vec4(col, edge * uAlpha * (0.55 + vRand * 0.45 + vGlow * 0.4));
  }
`;

function readColors() {
  const css = getComputedStyle(document.documentElement);
  return [new Color(css.getPropertyValue("--accent").trim() || "#0e6b47"), new Color(css.getPropertyValue("--text").trim() || "#16160f")];
}

export function createField(canvas, { mode = "hero" } = {}) {
  const hero = mode === "hero";
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new Scene();
  const camera = new PerspectiveCamera(hero ? 42 : 38, 1, 0.1, 120);
  if (!hero) camera.position.set(0, 0, 13);

  let portrait = canvas.clientHeight > canvas.clientWidth;
  const seq = hero ? [shapes.sea(), shapes.tiles(portrait)] : MORPH_SHAPES.map((s) => shapes[s]());

  const geometry = new BufferGeometry();
  const rand = new Float32Array(COUNT);
  const r = rng(3);
  for (let i = 0; i < COUNT; i++) rand[i] = r();
  geometry.setAttribute("position", new BufferAttribute(seq[0].slice(), 3));
  geometry.setAttribute("aTarget", new BufferAttribute(seq[1].slice(), 3));
  geometry.setAttribute("aRand", new BufferAttribute(rand, 1));

  const [colorA, colorB] = readColors();
  const uniforms = {
    uMix: { value: 0 },
    uTime: { value: 0 },
    uSea: { value: hero ? 1 : 0 },
    uPointer: { value: new Vector2(99, 99) },
    uSize: { value: hero ? 64 : 58 },
    uGrow: { value: 1 },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uColorA: { value: colorA },
    uColorB: { value: colorB },
    uAlpha: { value: hero ? 0.8 : 0.9 },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
  });
  const points = new Points(geometry, material);
  scene.add(points);

  // Hero camera: how far above the grid it must sit for the whole grid to fit the frame.
  let overhead = 18;
  const fitOverhead = () => {
    const w = (portrait ? TILE.rows : TILE.cols) * TILE.sx, d = (portrait ? TILE.cols : TILE.rows) * TILE.sz;
    const tan = Math.tan(MathUtils.degToRad(camera.fov / 2));
    overhead = Math.max((w * 1.12) / (2 * tan * camera.aspect), (d * 1.12) / (2 * tan)) + 0.5;
  };

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (hero) {
      // Turning a phone (or resizing a window) between portrait and landscape re-lays the grid.
      const nowPortrait = h > w;
      if (nowPortrait !== portrait) {
        portrait = nowPortrait;
        seq[1] = shapes.tiles(portrait);
        geometry.attributes.aTarget.array.set(seq[1]);
        geometry.attributes.aTarget.needsUpdate = true;
      }
      fitOverhead();
    }
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Theme switches (light/dark) recolour the points.
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => {
    const [a, b] = readColors();
    uniforms.uColorA.value.copy(a);
    uniforms.uColorB.value.copy(b);
  };
  scheme.addEventListener("change", onScheme);

  // State driven from outside, eased toward every frame.
  let segment = 0;
  let mixTarget = 0;
  let camTarget = 0;
  let cam = 0;
  let spin = 0;
  const pointer = { x: 0, y: 0, active: false };
  const smoothPointer = new Vector2(99, 99);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const hit = new Vector3();
  const ndc = new Vector2();

  const setSegment = (s) => {
    if (s === segment) return;
    segment = s;
    geometry.attributes.position.array.set(seq[s]);
    geometry.attributes.aTarget.array.set(seq[Math.min(s + 1, seq.length - 1)]);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aTarget.needsUpdate = true;
  };

  let raf = 0;
  let last = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    uniforms.uTime.value += dt;
    uniforms.uMix.value += (mixTarget - uniforms.uMix.value) * 0.12;

    if (hero) {
      cam += (camTarget - cam) * 0.1;
      const k = cam * cam * (3 - 2 * cam);
      camera.position.set(pointer.x * 1.2 * (1 - k), MathUtils.lerp(6.2, overhead, k), MathUtils.lerp(11.5, 0.6, k));
      camera.lookAt(0, -0.6 * (1 - k), 0);
      uniforms.uGrow.value = 1 + k * 0.5;
      if (pointer.active && k < 0.95) {
        ndc.set(pointer.x, pointer.y);
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(plane, hit)) {
          if (smoothPointer.x > 90) smoothPointer.set(hit.x, hit.z);
          smoothPointer.lerp(ndc.set(hit.x, hit.z), 0.08);
        }
      }
      uniforms.uPointer.value.copy(smoothPointer);
    } else {
      spin += dt * 0.12;
      points.rotation.y = spin;
      points.rotation.x = Math.sin(spin * 0.7) * 0.18;
    }
    renderer.render(scene, camera);
  };

  return {
    // Hero: 0 (sea) → 1 (grid). Morph: 0 → 4, fractions blend between neighbouring shapes.
    setProgress(p) {
      const max = seq.length - 1;
      const clamped = Math.max(0, Math.min(max, p));
      const s = Math.min(Math.floor(clamped), max - 1);
      // Jumping segments (fast scroll): start the blend at the new segment so nothing flies.
      if (s !== segment) {
        uniforms.uMix.value = s > segment ? 0 : 1;
        setSegment(s);
      }
      mixTarget = clamped - s;
      camTarget = clamped / max;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    },
    start() {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    destroy() {
      this.stop();
      ro.disconnect();
      scheme.removeEventListener("change", onScheme);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
