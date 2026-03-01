import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import SafeCanvas from './SafeCanvas';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import WebGLFallback from './WebGLFallback';

function Torus({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <MeshTransmissionMaterial
          color="#ffffff"
          thickness={0.5}
          roughness={0}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.05}
          backside
        />
      </mesh>
    </Float>
  );
}

function Icosahedron({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Sphere({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          color="#f5f5f5"
          thickness={0.8}
          roughness={0}
          transmission={0.9}
          ior={2}
          chromaticAberration={0.03}
          backside
        />
      </mesh>
    </Float>
  );
}

function Octahedron({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#888888" transparent opacity={0.6} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <ParticleField />
      
      <Torus position={[-4, 1.5, -2]} scale={0.8} />
      <Icosahedron position={[4, -1, -1]} scale={0.9} />
      <Sphere position={[0, 0.5, 0]} scale={1.2} />
      <Octahedron position={[-3, -2, 1]} scale={0.6} />
      <Octahedron position={[5, 2, -3]} scale={0.5} />
    </>
  );
}

export default function FloatingShapes() {
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

  if (isWebGLSupported === null) {
    return <div className="absolute inset-0 -z-10" />;
  }

  if (!isWebGLSupported || hasError) {
    return <WebGLFallback className="absolute inset-0 -z-10" variant="hero" />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <SafeCanvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setHasError(true)}
        fallback={<WebGLFallback className="absolute inset-0 -z-10" variant="hero" />}
      >
        <Scene />
      </SafeCanvas>
    </div>
  );
}
