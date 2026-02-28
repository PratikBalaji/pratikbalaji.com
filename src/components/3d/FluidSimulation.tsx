import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseVelocity;
  
  varying vec2 vUv;
  
  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.1;
      w *= 0.5;
    }
    return f;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = uv * aspect;
    float t = uTime * 0.15;
    
    // Mouse interaction - cursor as physical force
    vec2 mouse = uMouse * aspect;
    float dist = length(p - mouse);
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * (0.3 + uMouseVelocity * 0.7);
    
    // Ripple rings from cursor
    float ripple = sin(dist * 25.0 - uTime * 3.0) * mouseInfluence * 0.15;
    float ripple2 = sin(dist * 15.0 - uTime * 2.2) * mouseInfluence * 0.08;
    
    // Domain warping for fluid feel
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + t * 0.4),
      fbm(p + vec2(5.2, 1.3) + t * 0.3)
    );
    
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.25 + ripple),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.2 + ripple2)
    );
    
    float f = fbm(p + 4.0 * r + mouseInfluence * 0.5);
    
    // Deep dark metallic base - rich violets and blacks
    vec3 col = vec3(0.03, 0.01, 0.06); // near-black violet base
    
    // Layer 1: deep violet undertone
    col = mix(col, vec3(0.12, 0.03, 0.22), clamp(f * f * 2.5, 0.0, 1.0));
    
    // Layer 2: rich purple mid-tones
    col = mix(col, vec3(0.2, 0.06, 0.35), clamp(length(q) * 1.0, 0.0, 1.0));
    
    // Layer 3: dark blue-violet depth
    col = mix(col, vec3(0.08, 0.04, 0.25), clamp(length(r.x) * 0.8, 0.0, 1.0));
    
    // Neon highlights catching the "light" on wave peaks
    float highlight = smoothstep(0.2, 0.8, f + ripple * 2.0);
    vec3 neonPurple = vec3(0.6, 0.2, 1.0); // bright neon purple
    vec3 neonBlue = vec3(0.3, 0.5, 1.0);
    vec3 neonPink = vec3(1.0, 0.3, 0.9);
    
    col += neonPurple * highlight * 0.4;
    col += neonBlue * smoothstep(0.4, 0.9, f) * 0.25;
    col += neonPink * mouseInfluence * 0.5 * highlight;
    
    // Metallic specular-like sheen
    float spec = pow(max(0.0, f + ripple), 3.0) * 0.6;
    col += vec3(0.7, 0.5, 1.0) * spec;
    
    // Chromatic aberration on cursor interaction
    float caStrength = mouseInfluence * 0.012;
    vec2 caOffset = normalize(p - mouse + 0.001) * caStrength;
    
    vec2 q_r = vec2(fbm(p + caOffset + t * 0.4), fbm(p + caOffset + vec2(5.2, 1.3) + t * 0.3));
    vec2 q_b = vec2(fbm(p - caOffset + t * 0.4), fbm(p - caOffset + vec2(5.2, 1.3) + t * 0.3));
    float f_r = fbm(p + caOffset + 4.0 * r + mouseInfluence * 0.5);
    float f_b = fbm(p - caOffset + 4.0 * r + mouseInfluence * 0.5);
    
    col.r += (f_r - f) * mouseInfluence * 3.0;
    col.b += (f_b - f) * mouseInfluence * 3.0;
    
    // Vignette
    float vig = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.8);
    col *= vig;
    
    // Subtle grain for metallic feel
    float grain = fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.015;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function FluidPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0, prevX: 0.5, prevY: 0.5 });
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseVelocity: { value: 0 },
  }), []);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      mouseRef.current.vx = x - mouseRef.current.prevX;
      mouseRef.current.vy = y - mouseRef.current.prevY;
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += delta;
    
    // Smooth mouse interpolation
    const curr = mat.uniforms.uMouse.value;
    curr.x += (mouseRef.current.x - curr.x) * 0.08;
    curr.y += (mouseRef.current.y - curr.y) * 0.08;
    
    const vel = Math.sqrt(
      mouseRef.current.vx * mouseRef.current.vx +
      mouseRef.current.vy * mouseRef.current.vy
    ) * 15;
    mat.uniforms.uMouseVelocity.value += (Math.min(vel, 1.0) - mat.uniforms.uMouseVelocity.value) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function FluidSimulation() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
