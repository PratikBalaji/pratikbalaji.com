import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import SafeCanvas from './SafeCanvas';
import * as THREE from 'three';

// ─── Starfield ────────────────────────────────────────────────
function Starfield({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return [pos, sz];
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.008;
    ref.current.rotation.x += delta * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c4b5fd"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Volumetric Fog Plane ─────────────────────────────────────
const fogVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    // mouse influence
    vec2 mouseOff = (uMouse - 0.5) * 0.15;
    uv += mouseOff;

    float n = fbm(uv * 3.0 + uTime * 0.08);
    float n2 = fbm(uv * 5.0 - uTime * 0.05 + 3.0);

    // horizon band
    float horizon = smoothstep(0.55, 0.45, abs(uv.y - 0.5));

    float intensity = (n * 0.6 + n2 * 0.4) * horizon;

    // deep purple glow
    vec3 color = mix(
      vec3(0.08, 0.0, 0.15),
      vec3(0.35, 0.1, 0.55),
      intensity
    );

    // accent highlight
    color += vec3(0.5, 0.2, 0.8) * pow(intensity, 3.0) * 0.4;

    float alpha = intensity * 0.6;
    gl_FragColor = vec4(color, alpha);
  }
`;

function VolumetricFog() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.lerp(mouse.current, 0.05);
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[40, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={fogVertexShader}
        fragmentShader={fogFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Metallic Shard ───────────────────────────────────────────
function MetallicShard({
  position,
  scale = 1,
  rotationSpeed = [0.1, 0.15, 0.05],
}: {
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * rotationSpeed[0];
    ref.current.rotation.y = t * rotationSpeed[1];
    ref.current.rotation.z = t * rotationSpeed[2];
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + position[0]) * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#0a0a0f"
        metalness={0.95}
        roughness={0.08}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────
function Scene() {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#c4b5fd" />
      <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#7c3aed" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#8b5cf6" distance={20} />

      <Starfield count={2500} />
      <VolumetricFog />

      <MetallicShard position={[-5, 1.5, -3]} scale={0.7} rotationSpeed={[0.12, 0.18, 0.06]} />
      <MetallicShard position={[4.5, -1, -2]} scale={0.5} rotationSpeed={[0.08, 0.1, 0.14]} />
      <MetallicShard position={[1, 2.5, -4]} scale={0.9} rotationSpeed={[0.05, 0.12, 0.08]} />
      <MetallicShard position={[-2.5, -2, -1.5]} scale={0.4} rotationSpeed={[0.15, 0.07, 0.1]} />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function DarkSpaceBackground() {
  const [hasError, setHasError] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(!!gl);
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  if (isWebGLSupported === null) return null;
  if (!isWebGLSupported || hasError) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      <SafeCanvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onError={() => setHasError(true)}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </SafeCanvas>
    </div>
  );
}
