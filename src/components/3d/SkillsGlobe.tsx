import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
  'React', 'TypeScript', 'Python', 'Node.js', 'Three.js',
  'TailwindCSS', 'PostgreSQL', 'AWS', 'Docker', 'Git',
  'GraphQL', 'REST APIs', 'MongoDB', 'Redis', 'CI/CD'
];

function SkillNode({ skill, position, index }: { skill: string; position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      const t = state.clock.elapsedTime + index * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.1;
      textRef.current.position.y = position[1] + Math.sin(t) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group>
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
        <Text
          ref={textRef}
          position={[position[0], position[1] - 0.35, position[2]]}
          fontSize={0.18}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Medium.woff"
        >
          {skill}
        </Text>
      </group>
    </Float>
  );
}

function SkillsCloud() {
  const groupRef = useRef<THREE.Group>(null);
  
  const positions = useMemo(() => {
    return skills.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const radius = 2.5;
      
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ] as [number, number, number];
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <SkillNode key={skill} skill={skill} position={positions[i]} index={i} />
      ))}
    </group>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const numLines = 30;
    
    for (let i = 0; i < numLines; i++) {
      const phi1 = Math.random() * Math.PI * 2;
      const theta1 = Math.random() * Math.PI;
      const phi2 = Math.random() * Math.PI * 2;
      const theta2 = Math.random() * Math.PI;
      const r = 2.5;
      
      positions.push(
        r * Math.sin(theta1) * Math.cos(phi1),
        r * Math.sin(theta1) * Math.sin(phi1),
        r * Math.cos(theta1),
        r * Math.sin(theta2) * Math.cos(phi2),
        r * Math.sin(theta2) * Math.sin(phi2),
        r * Math.cos(theta2)
      );
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#e0e0e0" transparent opacity={0.3} />
    </lineSegments>
  );
}

export default function SkillsGlobe() {
  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        <SkillsCloud />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
