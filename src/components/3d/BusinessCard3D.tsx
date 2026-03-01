import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Front face HTML ── */
function CardFront({ visible }: { visible: boolean }) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0, 0.062]}
      scale={0.135}
      style={{
        width: 520,
        height: 320,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div className="select-none w-full h-full flex flex-col justify-between p-8 text-white font-sans">
        {/* Top row */}
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-purple-300/70 mb-1">Software Engineer</p>
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            Pratik<br />Balaji
          </h2>
        </div>

        {/* Bottom row */}
        <div className="space-y-1.5 text-sm text-purple-100/80">
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            balajipratik8@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            pratik.balaji@temple.edu
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            (346) 446-8717
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
            Philadelphia, PA
          </p>
        </div>

        {/* Decorative accent line */}
        <div className="absolute top-6 right-8 w-16 h-16 border border-purple-400/20 rounded-full" />
        <div className="absolute top-10 right-12 w-8 h-8 border border-purple-400/10 rounded-full" />
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
      position={[0, 0, -0.062]}
      rotation={[0, Math.PI, 0]}
      scale={0.135}
      style={{
        width: 520,
        height: 320,
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <div className="select-none w-full h-full flex flex-col p-6 text-white font-sans">
        <p className="text-xs uppercase tracking-[0.35em] text-purple-300/70 mb-3">Send a Message</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-2.5 flex-1">
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              maxLength={100}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 transition-colors"
            />
            {errors.name && <p className="text-red-400 text-[10px] mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
              maxLength={255}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 transition-colors"
            />
            {errors.email && <p className="text-red-400 text-[10px] mt-0.5">{errors.email}</p>}
          </div>
          <div className="flex-1">
            <textarea
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              placeholder="What's on your mind?"
              maxLength={1000}
              rows={3}
              className="w-full h-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 transition-colors resize-none"
            />
            {errors.message && <p className="text-red-400 text-[10px] mt-0.5">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-500/80 hover:bg-purple-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

  // Track mouse for tilt
  useFrame(({ pointer }) => {
    if (!groupRef.current) return;

    // Mouse tilt (subtle)
    targetRotation.current.x = pointer.y * 0.15;
    targetRotation.current.y = pointer.x * 0.2;

    // Flip target
    flipTarget.current = isFlipped ? Math.PI : 0;

    // Lerp to targets
    const g = groupRef.current.rotation;
    g.x = THREE.MathUtils.lerp(g.x, targetRotation.current.x, 0.06);
    g.y = THREE.MathUtils.lerp(g.y, flipTarget.current + targetRotation.current.y, 0.06);
  });

  // Responsive scale
  const scale = Math.min(viewport.width / 8, 1);

  return (
    <group ref={groupRef} scale={scale}>
      {/* Glass card body */}
      <RoundedBox args={[5.2, 3.2, 0.12]} radius={0.15} smoothness={8}>
        <meshPhysicalMaterial
          color="#1a0a2e"
          metalness={0.3}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Subtle edge highlight */}
      <RoundedBox args={[5.22, 3.22, 0.01]} radius={0.15} smoothness={8} position={[0, 0, 0.06]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.05} />
      </RoundedBox>

      {/* Front content */}
      <CardFront visible={!isFlipped} />

      {/* Back content */}
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

/* ── Lighting ── */
function CardLighting() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock, pointer }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime();
    // Sweeping specular: follows mouse + slow oscillation
    lightRef.current.position.x = pointer.x * 3 + Math.sin(t * 0.5) * 2;
    lightRef.current.position.y = pointer.y * 2 + Math.cos(t * 0.3) * 1;
    lightRef.current.position.z = 4;
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight
        ref={lightRef}
        color="#a855f7"
        intensity={40}
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-4, -2, 3]}
        color="#7c3aed"
        intensity={15}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[0, 0, -4]}
        color="#6d28d9"
        intensity={10}
        distance={10}
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
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <CardLighting />
      <Environment preset="night" />
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
