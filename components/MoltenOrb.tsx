"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

// Keyframes across the page: hero → services → work → about → cta
const KEYS = {
  x: [0, 1.1, 0, -1.1, 0],
  y: [0, -0.15, 0.1, 0, 0],
  scale: [1, 0.9, 0.72, 0.9, 1.55],
  amp: [0.28, 0.38, 0.52, 0.32, 0.8],
};

function sample(arr: readonly number[], t: number): number {
  const seg = (arr.length - 1) * Math.min(Math.max(t, 0), 1);
  const i = Math.min(Math.floor(seg), arr.length - 2);
  return arr[i] + (arr[i + 1] - arr[i]) * (seg - i);
}

const vertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform vec2 uMouse;
varying vec3 vNormal;
varying float vNoise;

// Simplex 3D noise (Ashima Arts / Stefan Gustavson, MIT)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  float t = uTime * 0.25;
  float n = snoise(normal * 1.8 + vec3(t)) * 0.6
          + snoise(normal * 4.2 - vec3(t * 1.5)) * 0.25;
  vec3 mdir = normalize(vec3(uMouse * 1.2, 1.0));
  float bulge = pow(max(dot(normalize(position), mdir), 0.0), 3.0) * 0.35 * length(uMouse);
  vec3 p = position + normal * (n * uAmp + bulge);
  vNoise = n;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `
uniform float uScroll;
varying vec3 vNormal;
varying float vNoise;

void main() {
  float fres = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
  vec3 deep   = vec3(0.10, 0.03, 0.01);
  vec3 orange = vec3(0.988, 0.384, 0.125); /* #FC6220 */
  vec3 hot    = vec3(1.0, 0.667, 0.188);   /* #FFAA30 */
  vec3 col = mix(deep, orange, clamp(fres * 1.25 + vNoise * 0.35 + uScroll * 0.15, 0.0, 1.0));
  col = mix(col, hot, pow(fres, 3.0) * (0.45 + uScroll * 0.55));
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function MoltenOrb({ detail }: { detail: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const smooth = useRef({ x: 0, y: 0, progress: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: KEYS.amp[0] },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    const s = smooth.current;
    // low-pass filter so motion feels liquid, not twitchy
    s.x += (scrollState.mouse.x - s.x) * 0.05;
    s.y += (scrollState.mouse.y - s.y) * 0.05;
    s.progress += (scrollState.progress - s.progress) * 0.08;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = s.progress;
    uniforms.uAmp.value = sample(KEYS.amp, s.progress);
    uniforms.uMouse.value.set(s.x, s.y);

    const m = mesh.current;
    m.position.x = sample(KEYS.x, s.progress);
    m.position.y = sample(KEYS.y, s.progress);
    const sc = sample(KEYS.scale, s.progress);
    m.scale.setScalar(sc);
    m.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}
