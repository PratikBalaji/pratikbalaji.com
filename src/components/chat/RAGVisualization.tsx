import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, Cell, ResponsiveContainer, ReferenceDot } from 'recharts';
import { RESUME_CHUNKS, findNearestChunks } from '@/data/resumeChunks';
import { Search, Cpu, Database, Zap } from 'lucide-react';

interface Props {
  query: string;
  onComplete: () => void;
}

const STEPS = [
  { icon: Cpu, label: 'Encoding query vector…', duration: 800 },
  { icon: Search, label: 'Searching vector space…', duration: 1400 },
  { icon: Database, label: 'Retrieving nearest chunks…', duration: 1200 },
  { icon: Zap, label: 'Injecting into LLM context…', duration: 800 },
];

export default function RAGVisualization({ query, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const nearest = useMemo(() => findNearestChunks(query, 3), [query]);
  const nearestIds = useMemo(() => new Set(nearest.map(n => n.chunk.id)), [nearest]);

  // Simulated query embedding point (center of nearest chunks)
  const queryPoint = useMemo(() => {
    const avg = nearest.reduce(
      (acc, n) => ({ x: acc.x + n.chunk.x / 3, y: acc.y + n.chunk.y / 3 }),
      { x: 0, y: 0 }
    );
    return avg;
  }, [nearest]);

  useEffect(() => {
    let elapsed = 0;
    const timers = STEPS.map((s, i) => {
      elapsed += s.duration;
      return setTimeout(() => setStep(i + 1), elapsed);
    });
    const finalTimer = setTimeout(() => onComplete(), elapsed + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  const chartData = RESUME_CHUNKS.map(c => ({ ...c, name: c.label }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-border bg-background/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Pipeline Steps */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          RAG Pipeline
        </p>
        <div className="flex gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <motion.div
                key={i}
                className={`flex-1 flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-mono transition-colors ${
                  active
                    ? 'bg-accent/20 text-accent'
                    : done
                    ? 'bg-accent/10 text-accent/70'
                    : 'bg-muted/30 text-muted-foreground/50'
                }`}
                animate={active ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span className="hidden sm:inline truncate">{i + 1}</span>
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 font-mono">
          {step > 0 && step <= STEPS.length ? STEPS[step - 1].label : 'Initializing…'}
        </p>
      </div>

      {/* Vector Space Scatter Plot */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-2"
          >
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[-4.5, 5]}
                    tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    label={{ value: 'dim₁', position: 'insideBottom', offset: -2, style: { fontSize: 8, fill: 'hsl(var(--muted-foreground))' } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[-4.5, 5.5]}
                    tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    label={{ value: 'dim₂', angle: -90, position: 'insideLeft', offset: 30, style: { fontSize: 8, fill: 'hsl(var(--muted-foreground))' } }}
                  />
                  <Scatter data={chartData} isAnimationActive={true} animationDuration={600}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={
                          step >= 3 && nearestIds.has(entry.id)
                            ? 'hsl(var(--accent))'
                            : 'hsl(var(--muted-foreground) / 0.35)'
                        }
                        r={step >= 3 && nearestIds.has(entry.id) ? 6 : 4}
                      />
                    ))}
                  </Scatter>
                  {/* Query embedding point */}
                  {step >= 2 && (
                    <ReferenceDot
                      x={queryPoint.x}
                      y={queryPoint.y}
                      r={5}
                      fill="hsl(var(--accent))"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      isFront
                    >
                    </ReferenceDot>
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Chunk labels on scatter */}
            {step >= 3 && (
              <div className="flex flex-wrap gap-1 px-2 pb-1">
                {chartData.map(c => (
                  <span
                    key={c.id}
                    className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                      nearestIds.has(c.id)
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted/20 text-muted-foreground/40'
                    }`}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retrieved Chunks with Similarity Scores */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-3"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 mt-1">
              Top {nearest.length} Nearest Neighbors
            </p>
            <div className="space-y-1.5">
              {nearest.map((n, i) => (
                <motion.div
                  key={n.chunk.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-start gap-2 bg-accent/5 border border-accent/20 rounded-lg px-2.5 py-1.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-accent">
                        #{i + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {n.chunk.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
                      {n.chunk.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold text-accent">
                      {n.score.toFixed(2)}
                    </span>
                    <span className="text-[8px] font-mono text-muted-foreground">
                      cosine
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context injection indicator */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-3"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-accent">
              <Zap className="w-3 h-3" />
              <span>Context injected → generating response…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
