import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import CoffeeChatScheduler from '@/components/sections/CoffeeChatScheduler';

/* ── Front face HTML ── */
function CardFront({ visible, onFlip }: { visible: boolean; onFlip: () => void }) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0, 0.07]}
      distanceFactor={4.2}
      style={{
        width: 720,
        height: 440,
        overflow: 'hidden',
        borderRadius: 16,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div
        onClick={onFlip}
        className="cursor-pointer select-none w-full h-full flex flex-col justify-between p-6 text-white font-sans"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-purple-300/60 mb-1">Software Engineer</p>
          <h2 className="text-2xl font-bold tracking-tight leading-[1.15]">
            Pratik<br />Balaji
          </h2>
        </div>
        <div className="space-y-1 text-xs text-purple-100/75">
          <p className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            balajipratik8@gmail.com
          </p>
          <p className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            pratik.balaji@temple.edu
          </p>
          <p className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            (346) 446-8717
          </p>
          <p className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            Philadelphia, PA
          </p>
        </div>
        <p className="text-[9px] text-purple-300/35">Tap to schedule a coffee chat →</p>
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
      <div className="w-[720px] h-[440px] max-w-full overflow-hidden rounded-2xl flex flex-col relative">
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
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.7}
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
      <ambientLight intensity={0.4} />
      <pointLight color="#a855f7" intensity={25} position={[3, 2, 4]} distance={15} decay={2} />
    </>
  );
}

/* ── Main Export ── */
export default function BusinessCard3D({ isFlipped, onFlip }: { isFlipped: boolean; onFlip: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <CardLighting />
      <GlassCard isFlipped={isFlipped} onFlip={onFlip} />
    </Canvas>
  );
}
