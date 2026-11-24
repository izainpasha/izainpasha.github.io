// One particle engine, two jobs.
//  - "wave": the hero. A field of points rolls like a slow sea and lifts around the pointer.
//  - "morph": the process story. The same points re-form for each step as the reader scrolls:
//    a loose cloud (scope) → a lattice (build) → a sphere (QA) → a rising helix (launch) → a ring (support).
// Loaded with a dynamic import, so three.js never blocks the first paint.
import {
  BufferAttribute,
  BufferGeometry,
  Color,
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

const COUNT = 1728; // 12³, so the lattice is a whole cube

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
  wave() {
    const out = new Float32Array(COUNT * 3);
    const cols = 48, rows = 36; // 48 × 36 = COUNT
    for (let i = 0; i < COUNT; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      out[i * 3] = (c / (cols - 1) - 0.5) * 22;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = (r / (rows - 1) - 0.5) * 16;
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
      const t = i / COUNT, strand = i % 2, a = t * Math.PI * 12 + strand * Math.PI;
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

export const MORPH_SHAPES = ["cloud", "lattice", "sphere", "helix", "ring"];

const vertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aRand;
  uniform float uMix;
  uniform float uTime;
  uniform float uWave;
  uniform float uLift;
  uniform vec2 uPointer;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vRand;
  varying float vGlow;

  void main() {
    // Each point leaves a little later than its neighbour, so shapes dissolve rather than snap.
    float t = clamp(uMix * 1.35 - aRand * 0.35, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(position, aTarget, t);

    float glow = 0.0;
    if (uWave > 0.5) {
      p.y += sin(p.x * 0.42 + uTime * 0.6) * 0.45 + cos(p.z * 0.55 + uTime * 0.45) * 0.35;
      float d = distance(p.xz, uPointer);
      glow = smoothstep(3.2, 0.0, d);
      p.y += glow * (1.1 + uLift);
    } else {
      // A slow breath so a held shape still feels alive.
      p += normalize(p + 0.001) * sin(uTime * 0.8 + aRand * 6.2831) * 0.06;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.65 + aRand * 0.7 + glow * 0.8) / -mv.z;
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
  const accent = css.getPropertyValue("--accent").trim() || "#0e6b47";
  const text = css.getPropertyValue("--text").trim() || "#16160f";
  return [new Color(accent), new Color(text)];
}

export function createField(canvas, { mode = "wave" } = {}) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new Scene();
  const camera = new PerspectiveCamera(mode === "wave" ? 42 : 38, 1, 0.1, 100);
  if (mode === "wave") camera.position.set(0, 6.2, 11.5);
  else camera.position.set(0, 0, 13);
  camera.lookAt(0, mode === "wave" ? -0.6 : 0, 0);

  const geometry = new BufferGeometry();
  const seq = mode === "wave" ? [shapes.wave()] : MORPH_SHAPES.map((s) => shapes[s]());
  const rand = new Float32Array(COUNT);
  const r = rng(3);
  for (let i = 0; i < COUNT; i++) rand[i] = r();
  geometry.setAttribute("position", new BufferAttribute(seq[0].slice(), 3));
  geometry.setAttribute("aTarget", new BufferAttribute((seq[1] || seq[0]).slice(), 3));
  geometry.setAttribute("aRand", new BufferAttribute(rand, 1));

  const [colorA, colorB] = readColors();
  const uniforms = {
    uMix: { value: 0 },
    uTime: { value: 0 },
    uWave: { value: mode === "wave" ? 1 : 0 },
    uLift: { value: 0 },
    uPointer: { value: new Vector2(99, 99) },
    uSize: { value: mode === "wave" ? 64 : 58 },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uColorA: { value: colorA },
    uColorB: { value: colorB },
    uAlpha: { value: mode === "wave" ? 0.75 : 0.9 },
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

  // Size to the canvas box.
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
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

  // State driven from outside.
  let segment = 0;
  let mixTarget = 0;
  let spin = 0;
  const pointer = { x: 0, y: 0, active: false };
  const smoothPointer = new Vector2(99, 99);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const hit = new Vector3();

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

    if (mode === "wave") {
      if (pointer.active) {
        raycaster.setFromCamera(new Vector2(pointer.x, pointer.y), camera);
        if (raycaster.ray.intersectPlane(plane, hit)) {
          if (smoothPointer.x > 90) smoothPointer.set(hit.x, hit.z);
          smoothPointer.lerp(new Vector2(hit.x, hit.z), 0.08);
        }
      }
      uniforms.uPointer.value.copy(smoothPointer);
      camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03;
      camera.lookAt(0, -0.6, 0);
    } else {
      uniforms.uMix.value += (mixTarget - uniforms.uMix.value) * 0.12;
      spin += dt * 0.12;
      points.rotation.y = spin;
      points.rotation.x = Math.sin(spin * 0.7) * 0.18;
    }
    renderer.render(scene, camera);
  };

  return {
    // Morph progress, 0 → shapes.length - 1. Fractions blend between neighbouring shapes.
    setProgress(p) {
      const max = seq.length - 1;
      const clamped = Math.max(0, Math.min(max, p));
      const s = Math.min(Math.floor(clamped), max - 1);
      // Jumping segments (fast scroll): snap the blend to the new start so nothing flies.
      if (s !== segment) {
        uniforms.uMix.value = s > segment ? 0 : 1;
        setSegment(s);
      }
      mixTarget = clamped - s;
    },
    setLift(v) {
      uniforms.uLift.value = v;
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
