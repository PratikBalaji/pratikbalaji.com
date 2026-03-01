import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import SafeCanvas from './SafeCanvas';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import CoffeeChatScheduler from '@/components/sections/CoffeeChatScheduler';
import { toast } from 'sonner';

/* ── Copyable HUD Field ── */
function HudField({ label, value }: { label: string; value: string }) {
  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast('Copied!', { duration: 1500 });
  }, [value]);

  return (
    <button onClick={handleCopy} className="text-left group/field">
      <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 leading-none mb-0.5">{label}</p>
      <p className="text-[13px] font-mono text-white group-hover/field:text-purple-400 transition-colors leading-tight">{value}</p>
    </button>
  );
}

/* ── Live EST Clock ── */
function EstClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono">{time}</span>;
}

/* ── Front face HTML ── */
function CardFront({ visible, onFlip }: { visible: boolean; onFlip: () => void }) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0, 0.12]}
      distanceFactor={4.2}
      style={{
        width: 720,
        height: 440,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div
        onClick={onFlip}
        className="w-[600px] h-[440px] max-w-full overflow-hidden rounded-2xl flex flex-col justify-between relative mx-auto cursor-pointer select-none text-white font-sans px-12 py-8"
      >
        {/* Header */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-purple-300/60 mb-1">AI/ML+Data Scientist</p>
          <h2 className="text-2xl font-bold tracking-tight leading-[1.15]">
            Pratik<br />Balaji
          </h2>
        </div>

        {/* HUD Data Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <HudField label="PERSONAL EMAIL" value="balajipratik8@gmail.com" />
          <HudField label="ACADEMIC EMAIL" value="pratik.balaji@temple.edu" />
          <HudField label="DIRECT LINE" value="(346) 446-8717" />
        </div>

        {/* Telemetry Bar */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            <span>PHILADELPHIA // 39.9526° N, 75.1652° W</span>
          </div>
          <span className="text-gray-500">LOCAL: <EstClock /></span>
        </div>
      </div>
    </Html>
  );
}

/* ── Back face HTML (Coffee Chat Scheduler) ── */
function CardBack({ visible, onFlip }: { visible: boolean; onFlip: () => void }) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0, -0.07]}
      rotation={[0, Math.PI, 0]}
      distanceFactor={4.2}
      style={{
        width: 720,
        height: 440,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div className="w-[600px] h-[440px] max-w-full overflow-hidden rounded-2xl flex flex-col relative mx-auto">
        <CoffeeChatScheduler onFlipBack={onFlip} />
      </div>
    </Html>
  );
}

/* ── Glass Card Mesh ── */
function GlassCard({ isFlipped, onFlip }: { isFlipped: boolean; onFlip: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  const flipTarget = useRef(0);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    targetRotation.current.x = pointer.y * 0.12;
    targetRotation.current.y = pointer.x * 0.15;
    flipTarget.current = isFlipped ? Math.PI : 0;

    const g = groupRef.current.rotation;
    g.x = THREE.MathUtils.lerp(g.x, targetRotation.current.x, 0.06);
    g.y = THREE.MathUtils.lerp(g.y, flipTarget.current + targetRotation.current.y, 0.06);
  });

  const scale = Math.min(viewport.width / 7, 1.15);

  return (
    <group ref={groupRef} scale={scale}>
      <RoundedBox args={[6, 3.6, 0.12]} radius={0.15} smoothness={4}>
        <meshPhysicalMaterial
          color="#1a0a2e"
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.7}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
          sheen={0.5}
          sheenColor={new THREE.Color('#a855f7')}
        />
      </RoundedBox>

      <CardFront visible={!isFlipped} onFlip={onFlip} />
      <CardBack visible={isFlipped} onFlip={onFlip} />
    </group>
  );
}

/* ── Lighting ── */
function CardLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight color="#a855f7" intensity={30} position={[3, 2, 4]} distance={15} decay={2} />
      <pointLight color="#60a5fa" intensity={15} position={[-3, -1, 3]} distance={12} decay={2} />
      <pointLight color="#f472b6" intensity={10} position={[0, 3, 2]} distance={10} decay={2} />
    </>
  );
}

/* ── Main Export ── */
export default function BusinessCard3D({ isFlipped, onFlip }: { isFlipped: boolean; onFlip: () => void }) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
      fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">3D card unavailable</div>}
    >
      <CardLighting />
      <GlassCard isFlipped={isFlipped} onFlip={onFlip} />
    </SafeCanvas>
  );
}
