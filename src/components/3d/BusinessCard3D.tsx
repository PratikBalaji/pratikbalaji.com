import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ── Front face HTML ── */
function CardFront({ visible }: { visible: boolean }) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0, 0.07]}
      distanceFactor={5}
      style={{
        width: 640,
        height: 400,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div className="select-none w-full h-full flex flex-col justify-between p-10 text-white font-sans">
        <div>
          <p className="text-base uppercase tracking-[0.35em] text-purple-300/70 mb-2">Software Engineer</p>
          <h2 className="text-5xl font-bold tracking-tight leading-tight">
            Pratik<br />Balaji
          </h2>
        </div>
        <div className="space-y-2.5 text-lg text-purple-100/80">
          <p className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
            balajipratik8@gmail.com
          </p>
          <p className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
            pratik.balaji@temple.edu
          </p>
          <p className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
            (346) 446-8717
          </p>
          <p className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
            Philadelphia, PA
          </p>
        </div>
        <div className="absolute top-8 right-10 w-20 h-20 border border-purple-400/20 rounded-full" />
      </div>
    </Html>
  );
}

/* ── Back face HTML (Contact Form) ── */
function CardBack({
  visible,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  isSuccess,
  errors,
}: {
  visible: boolean;
  formData: { name: string; email: string; message: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
}) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0, -0.07]}
      rotation={[0, Math.PI, 0]}
      distanceFactor={5}
      style={{
        width: 640,
        height: 400,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div className="select-none w-full h-full flex flex-col p-8 text-white font-sans">
        <p className="text-base uppercase tracking-[0.35em] text-purple-300/70 mb-4">Send a Message</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 flex-1">
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              maxLength={100}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 transition-colors"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
              maxLength={255}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 transition-colors"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="flex-1">
            <textarea
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              placeholder="What's on your mind?"
              maxLength={1000}
              rows={4}
              className="w-full h-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 transition-colors resize-none"
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-500/80 hover:bg-purple-500 text-white text-base font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : isSuccess ? '✓ Sent!' : 'Send Message'}
          </button>
        </form>
      </div>
    </Html>
  );
}

/* ── Glass Card Mesh ── */
function GlassCard({
  isFlipped,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  isSuccess,
  errors,
}: {
  isFlipped: boolean;
  formData: { name: string; email: string; message: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  const flipTarget = useRef(0);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    targetRotation.current.x = pointer.y * 0.15;
    targetRotation.current.y = pointer.x * 0.2;
    flipTarget.current = isFlipped ? Math.PI : 0;

    const g = groupRef.current.rotation;
    g.x = THREE.MathUtils.lerp(g.x, targetRotation.current.x, 0.06);
    g.y = THREE.MathUtils.lerp(g.y, flipTarget.current + targetRotation.current.y, 0.06);
  });

  const scale = Math.min(viewport.width / 8, 1);

  return (
    <group ref={groupRef} scale={scale}>
      <RoundedBox args={[5.2, 3.2, 0.12]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Subtle edge glow */}
      <RoundedBox args={[5.24, 3.24, 0.01]} radius={0.15} smoothness={4} position={[0, 0, 0.065]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.06} />
      </RoundedBox>

      <CardFront visible={!isFlipped} />
      <CardBack
        visible={isFlipped}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        errors={errors}
      />
    </group>
  );
}

/* ── Lighting (2 lights only) ── */
function CardLighting() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock, pointer }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime();
    lightRef.current.position.x = pointer.x * 3 + Math.sin(t * 0.5) * 2;
    lightRef.current.position.y = pointer.y * 2 + Math.cos(t * 0.3) * 1;
    lightRef.current.position.z = 4;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        ref={lightRef}
        color="#a855f7"
        intensity={35}
        distance={15}
        decay={2}
      />
    </>
  );
}

/* ── Main Export ── */
export default function BusinessCard3D({
  isFlipped,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  isSuccess,
  errors,
}: {
  isFlipped: boolean;
  formData: { name: string; email: string; message: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <CardLighting />
      <GlassCard
        isFlipped={isFlipped}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        errors={errors}
      />
    </Canvas>
  );
}
