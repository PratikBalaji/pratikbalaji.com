import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Floating ambient particles
function AmbientParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.3) * 70;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.3) * 20;
      sz[i] = Math.random() * 0.08 + 0.02;
    }
    return [pos, sz];
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += delta * (0.15 + sizes[i] * 2);
      if (posArr[i * 3 + 1] > 14) posArr[i * 3 + 1] = -1;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff55"
        size={0.12}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionCityProps {
  contributions: ContributionDay[];
}

// Single building for a day
function Building({ position, height, count, date, maxCount }: {
  position: [number, number, number];
  height: number;
  count: number;
  date: string;
  maxCount: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const intensity = maxCount > 0 ? count / maxCount : 0;

  // Animate height on mount
  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetScale = height;
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, delta * 3);
    }
  });

  const color = useMemo(() => {
    if (count === 0) return '#1a1a2e';
    // Neon green gradient based on intensity
    const r = Math.floor(0 + intensity * 30);
    const g = Math.floor(80 + intensity * 175);
    const b = Math.floor(20 + intensity * 40);
    return `rgb(${r}, ${g}, ${b})`;
  }, [count, intensity]);

  const emissiveIntensity = count === 0 ? 0 : 0.15 + intensity * 0.85;

  const parsedDate = useMemo(() => {
    const [y, m, d] = date.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }, [date]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        scale={[1, 0.01, 1]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#00ff88' : color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : emissiveIntensity}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Glow effect for active buildings */}
      {count > 0 && (
        <pointLight
          position={[0, height * 0.5 + 0.5, 0]}
          color="#00ff55"
          intensity={intensity * 0.3}
          distance={2}
        />
      )}

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, height + 1.5, 0]} center distanceFactor={15}
          style={{ pointerEvents: 'none' }}>
          <div className="bg-black/90 backdrop-blur-md border border-emerald-500/40 rounded-lg px-3 py-2 shadow-[0_0_20px_rgba(0,255,85,0.2)] whitespace-nowrap">
            <p className="text-emerald-400 text-xs font-bold font-mono">{parsedDate}</p>
            <p className="text-white text-sm font-semibold">
              {count} contribution{count !== 1 ? 's' : ''}
            </p>
            <div className="w-full h-1 mt-1 rounded-full overflow-hidden bg-emerald-900/50">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                style={{ width: `${Math.max(intensity * 100, 5)}%` }} />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 20]} />
      <meshStandardMaterial
        color="#0a0a0f"
        metalness={0.95}
        roughness={0.05}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

// Grid lines on the ground
function GridLines() {
  return (
    <gridHelper
      args={[80, 80, '#00ff5520', '#00ff5508']}
      position={[0, 0.01, 0]}
    />
  );
}

// Camera auto-rotate on mount
function CameraAnimation() {
  const { camera } = useThree();
  const mounted = useRef(false);

  useFrame(() => {
    if (!mounted.current) {
      camera.position.set(30, 18, 20);
      camera.lookAt(26, 0, 3.5);
      mounted.current = true;
    }
  });

  return null;
}

function CityScene({ contributions }: { contributions: ContributionDay[] }) {
  const maxCount = useMemo(() => Math.max(...contributions.map(d => d.count), 1), [contributions]);

  // Arrange contributions in a grid: 7 rows (days) x ~52 columns (weeks)
  const buildings = useMemo(() => {
    const result: { day: ContributionDay; x: number; z: number; height: number }[] = [];
    let weekIndex = 0;
    let dayIndex = 0;

    for (let i = 0; i < contributions.length; i++) {
      const day = contributions[i];
      const height = day.count === 0 ? 0.15 : 0.3 + (day.count / maxCount) * 5;

      result.push({
        day,
        x: weekIndex * 1.1,
        z: dayIndex * 1.1,
        height,
      });

      dayIndex++;
      if (dayIndex >= 7) {
        dayIndex = 0;
        weekIndex++;
      }
    }
    return result;
  }, [contributions, maxCount]);

  return (
    <>
      <CameraAnimation />
      <ambientLight intensity={0.15} />
      <directionalLight position={[20, 30, 10]} intensity={0.3} color="#ffffff" />
      <pointLight position={[26, 10, 3.5]} intensity={0.5} color="#00ff55" distance={40} />
      <fog attach="fog" args={['#000000', 30, 70]} />

      <Ground />
      <GridLines />
      <AmbientParticles count={250} />

      {buildings.map(({ day, x, z, height }, i) => (
        <Building
          key={day.date}
          position={[x, 0, z]}
          height={height}
          count={day.count}
          date={day.date}
          maxCount={maxCount}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={60}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.1}
        target={[26, 0, 3.5]}
      />
    </>
  );
}

export default function ContributionCity({ contributions }: ContributionCityProps) {
  if (contributions.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border bg-black">
      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 100 }}
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          <CityScene contributions={contributions} />
        </Suspense>
      </Canvas>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 text-[10px] font-mono text-emerald-400/60">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className="w-3 h-3 rounded-sm"
            style={{
              background: level === 0 ? '#1a1a2e' :
                `rgb(${Math.floor(level * 7)}, ${Math.floor(80 + level * 44)}, ${Math.floor(20 + level * 10)})`,
              boxShadow: level > 0 ? `0 0 ${level * 3}px rgba(0,255,85,${level * 0.15})` : 'none',
            }}
          />
        ))}
        <span>More</span>
      </div>

      {/* Drag hint */}
      <div className="absolute top-3 right-3 z-20 text-[10px] font-mono text-emerald-400/40">
        Click + drag to orbit · Scroll to zoom
      </div>
    </div>
  );
}
