import { useState, useRef, useMemo, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Compass } from 'lucide-react';
import { RESUME_CHUNKS, findNearestChunks } from '@/data/resumeChunks';
import { useWebGL } from '@/hooks/useWebGL';

// ── Node data with 3D positions ────────────────────────────────────────
interface LatentNode {
  id: string;
  label: string;
  summary: string;
  sectionId: string;
  position: [number, number, number];
  keywords: string[];
  category: 'skill' | 'experience' | 'education' | 'project' | 'certification' | 'contact';
}

const CATEGORY_COLORS: Record<string, string> = {
  skill: '#a855f7',
  experience: '#3b82f6',
  education: '#22c55e',
  project: '#f59e0b',
  certification: '#ec4899',
  contact: '#06b6d4',
};

const LATENT_NODES: LatentNode[] = RESUME_CHUNKS.map(chunk => {
  const cat = chunk.id.startsWith('skills') ? 'skill'
    : chunk.id.startsWith('exp') ? 'experience'
    : chunk.id.startsWith('proj') ? 'project'
    : chunk.id === 'edu' ? 'education'
    : chunk.id === 'certs' ? 'certification'
    : 'contact';

  return {
    id: chunk.id,
    label: chunk.label,
    summary: chunk.summary,
    sectionId: chunk.id.startsWith('skills') ? 'skills'
      : chunk.id.startsWith('exp') ? 'experience'
      : chunk.id.startsWith('proj') ? 'github'
      : chunk.id === 'edu' ? 'education'
      : chunk.id === 'certs' ? 'certifications'
      : 'contact',
    position: [chunk.x * 1.2, chunk.y * 1.2, (Math.sin(chunk.x * 3) + Math.cos(chunk.y * 2)) * 2],
    keywords: chunk.keywords,
    category: cat,
  };
});

// ── Floating Node ──────────────────────────────────────────────────────
function GlowNode({
  node,
  isHighlighted,
  isFaded,
  onClick,
}: {
  node: LatentNode;
  isHighlighted: boolean;
  isFaded: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = CATEGORY_COLORS[node.category];
  const baseScale = isHighlighted ? 1.4 : isFaded ? 0.4 : 0.8;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = node.position[1] + Math.sin(t * 0.5 + node.position[0]) * 0.15;
    
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isHighlighted ? 0.3 + Math.sin(t * 2) * 0.1 : isFaded ? 0.02 : 0.1;
    }
  });

  return (
    <group position={[node.position[0], node.position[1], node.position[2]]}>
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={baseScale * 2.5}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        scale={baseScale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 1.5 : isFaded ? 0.1 : 0.5}
          transparent
          opacity={isFaded ? 0.15 : 1}
        />
      </mesh>

      {/* Label */}
      {!isFaded && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={isHighlighted ? 0.22 : 0.16}
          color={isHighlighted ? '#ffffff' : '#888888'}
          anchorX="center"
          anchorY="top"
          font="/fonts/Inter-Regular.woff"
          maxWidth={3}
        >
          {node.label}
        </Text>
      )}
    </group>
  );
}

// ── Connections between nearby nodes ───────────────────────────────────
function Connections({ nodes, highlightedIds }: { nodes: LatentNode[]; highlightedIds: Set<string> }) {
  const lines = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3; highlighted: boolean }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = new THREE.Vector3(...nodes[i].position);
        const b = new THREE.Vector3(...nodes[j].position);
        if (a.distanceTo(b) < 4) {
          const bothHighlighted = highlightedIds.has(nodes[i].id) && highlightedIds.has(nodes[j].id);
          result.push({ start: a, end: b, highlighted: bothHighlighted });
        }
      }
    }
    return result;
  }, [nodes, highlightedIds]);

  return (
    <>
      {lines.map((line, i) => {
        const points = [line.start, line.end];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive key={i} object={new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({
              color: line.highlighted ? '#a855f7' : '#333333',
              transparent: true,
              opacity: line.highlighted ? 0.5 : 0.08,
            })
          )} />
        );
      })}
    </>
  );
}

// ── Camera controller ──────────────────────────────────────────────────
function CameraController({ target, active }: { target: THREE.Vector3 | null; active: boolean }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 12));

  useEffect(() => {
    if (target && active) {
      targetRef.current.copy(target).add(new THREE.Vector3(0, 0, 5));
    } else {
      targetRef.current.set(0, 0, 12);
    }
  }, [target, active]);

  useFrame(() => {
    camera.position.lerp(targetRef.current, 0.03);
    camera.lookAt(target && active ? target : new THREE.Vector3(0, 0, 0));
  });

  return null;
}

// ── Particle field ─────────────────────────────────────────────────────
function ParticleField() {
  const count = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#555555" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────
function Scene({
  highlightedIds,
  selectedNode,
  onNodeClick,
  searchActive,
}: {
  highlightedIds: Set<string>;
  selectedNode: LatentNode | null;
  onNodeClick: (node: LatentNode) => void;
  searchActive: boolean;
}) {
  const cameraTarget = selectedNode
    ? new THREE.Vector3(...selectedNode.position)
    : highlightedIds.size > 0
    ? (() => {
        const center = new THREE.Vector3();
        let count = 0;
        LATENT_NODES.forEach(n => {
          if (highlightedIds.has(n.id)) {
            center.add(new THREE.Vector3(...n.position));
            count++;
          }
        });
        return count > 0 ? center.divideScalar(count) : null;
      })()
    : null;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />

      <ParticleField />
      <Connections nodes={LATENT_NODES} highlightedIds={highlightedIds} />

      {LATENT_NODES.map(node => (
        <GlowNode
          key={node.id}
          node={node}
          isHighlighted={highlightedIds.size === 0 || highlightedIds.has(node.id)}
          isFaded={highlightedIds.size > 0 && !highlightedIds.has(node.id)}
          onClick={() => onNodeClick(node)}
        />
      ))}

      <CameraController target={cameraTarget} active={searchActive || !!selectedNode} />
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        autoRotate={!searchActive && !selectedNode}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ── Fallback for no WebGL ──────────────────────────────────────────────
function FallbackNav({ onNavigate }: { onNavigate: (id: string) => void }) {
  const navItems = [
    { label: 'About', href: 'about' },
    { label: 'Education', href: 'education' },
    { label: 'Experience', href: 'experience' },
    { label: 'Skills', href: 'skills' },
    { label: 'Projects', href: 'github' },
    { label: 'Contact', href: 'contact' },
  ];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container-tight flex items-center justify-center gap-6 h-14">
        {navItems.map(item => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ─────────────────────────────────────────────────────────
export default function LatentSpaceExplorer() {
  const [query, setQuery] = useState('');
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<LatentNode | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isWebGL = useWebGL();

  // Semantic search
  useEffect(() => {
    if (query.trim().length < 2) {
      setHighlightedIds(new Set());
      return;
    }
    const timer = setTimeout(() => {
      const results = findNearestChunks(query, 4);
      const ids = new Set(results.filter(r => r.score > 0.78).map(r => r.chunk.id));
      setHighlightedIds(ids);
      setSelectedNode(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleNodeClick = useCallback((node: LatentNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setSelectedNode(null);
    setIsExpanded(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      setSelectedNode(null);
      inputRef.current?.blur();
    }
  }, []);

  if (isWebGL === false) {
    return <FallbackNav onNavigate={navigateToSection} />;
  }

  if (isWebGL === null) return null;

  return (
    <>
      {/* Search bar — always visible at top */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="bg-background/60 backdrop-blur-xl border-b border-border/30">
          <div className="container-tight flex items-center gap-3 h-14">
            {/* Expand toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-9 h-9 rounded-lg bg-card border border-border hover:border-accent/50 flex items-center justify-center transition-colors"
              aria-label="Toggle latent space"
            >
              <Compass className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onKeyDown={handleKeyDown}
                placeholder="Semantic search: 'Python cloud projects'…"
                className="w-full h-9 pl-9 pr-8 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 font-mono text-xs transition-colors"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setHighlightedIds(new Set()); setSelectedNode(null); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Quick nav links */}
            <div className="hidden md:flex items-center gap-1">
              {['about', 'experience', 'skills', 'github', 'contact'].map(id => (
                <button
                  key={id}
                  onClick={() => navigateToSection(id)}
                  className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground hover:text-accent transition-colors capitalize"
                >
                  {id === 'github' ? 'Projects' : id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Canvas — expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 420, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            className="fixed top-14 left-0 right-0 z-40 overflow-hidden border-b border-border/30 bg-background"
          >
            <Canvas camera={{ position: [0, 0, 12], fov: 55 }}>
              <Suspense fallback={null}>
                <Scene
                  highlightedIds={highlightedIds}
                  selectedNode={selectedNode}
                  onNodeClick={handleNodeClick}
                  searchActive={query.length > 1}
                />
              </Suspense>
            </Canvas>

            {/* Selected node info panel */}
            <AnimatePresence>
              {selectedNode && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-4 right-4 w-72 p-4 rounded-xl bg-card/90 backdrop-blur-lg border border-border shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: CATEGORY_COLORS[selectedNode.category] }}
                    />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      {selectedNode.category}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-foreground text-sm">{selectedNode.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedNode.summary}</p>
                  <button
                    onClick={() => navigateToSection(selectedNode.sectionId)}
                    className="mt-3 text-[10px] font-mono text-accent hover:underline"
                  >
                    Navigate to section →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute bottom-3 left-4 flex items-center gap-3">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[9px] font-mono text-muted-foreground capitalize">{cat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
