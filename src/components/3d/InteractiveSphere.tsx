import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const scaleFactor = Math.min(viewport.width, viewport.height) * 0.35;

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh 
        ref={meshRef} 
        scale={scaleFactor}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#1a1a1a"
          roughness={0.1}
          metalness={0.9}
          distort={hovered ? 0.4 : 0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function BackgroundSpheres() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4;
        return (
          <Float key={i} speed={1 + i * 0.2} floatIntensity={0.5}>
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.5,
                Math.sin(angle) * radius,
              ]}
              scale={0.15}
            >
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.3} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function InteractiveSphere() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        
        <AnimatedSphere />
        <BackgroundSpheres />
      </Canvas>
    </div>
  );
}
