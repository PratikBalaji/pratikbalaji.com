import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type AgentStep = {
  type: 'thought' | 'action' | 'observation' | 'error';
  content: string;
  tool?: string;
  args?: Record<string, string>;
  timestamp: number;
};

interface ChainOfThoughtTerminalProps {
  steps: AgentStep[];
  isActive: boolean;
}

const STEP_CONFIG: Record<AgentStep['type'], { prefix: string; color: string }> = {
  thought: { prefix: 'THOUGHT', color: 'text-yellow-400' },
  action: { prefix: 'ACTION', color: 'text-cyan-400' },
  observation: { prefix: 'OBSERVATION', color: 'text-green-400' },
  error: { prefix: 'ERROR', color: 'text-red-400' },
};

export default function ChainOfThoughtTerminal({ steps, isActive }: ChainOfThoughtTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!collapsed) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [steps, collapsed]);

  if (steps.length === 0 && !isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="mx-3 mb-2 rounded-lg border border-emerald-500/30 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(0,10,0,0.95) 0%, rgba(0,5,0,0.98) 100%)' }}
    >
      {/* Terminal header bar — clickable to collapse */}
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="w-full flex items-center justify-between px-3 py-1.5 border-b border-emerald-500/20 hover:bg-emerald-500/5 transition-colors cursor-pointer"
        style={{ background: 'rgba(0,255,65,0.03)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/80" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <span className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <span className="text-emerald-400/60 text-[9px] font-mono tracking-wider uppercase">
            Agent Chain-of-Thought
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500/40 text-[9px] font-mono">{steps.length} steps</span>
          {collapsed ? (
            <ChevronDown className="w-3 h-3 text-emerald-500/50" />
          ) : (
            <ChevronUp className="w-3 h-3 text-emerald-500/50" />
          )}
        </div>
      </button>

      {/* Collapsible log output */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div ref={scrollRef} className="max-h-[180px] overflow-y-auto p-2.5 space-y-1 no-scrollbar font-mono text-[10px] leading-[1.6]">
              <div className="text-emerald-600/40 whitespace-pre text-[8px] mb-1 select-none">
{`╔══════════════════════════════════════╗
║  AUTONOMOUS AGENT · REASONING LOG   ║
╚══════════════════════════════════════╝`}
              </div>

              <AnimatePresence mode="popLayout">
                {steps.map((step, i) => {
                  const config = STEP_CONFIG[step.type];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="flex gap-1.5"
                    >
                      <span className="text-emerald-700/50 select-none shrink-0">
                        {new Date(step.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className={`${config.color} shrink-0 font-bold`}>
                        [{config.prefix}]
                      </span>
                      <span className="text-emerald-200/80 break-all">
                        {step.type === 'action' ? (
                          <span className="text-cyan-300">{step.content}</span>
                        ) : step.type === 'observation' ? (
                          <span className="text-green-300/70 italic">{step.content}</span>
                        ) : (
                          step.content
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  className="flex gap-1.5 items-center"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <span className="text-emerald-700/50 select-none">
                    {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-emerald-400 font-bold">[AGENT]</span>
                  <span className="inline-block w-2 h-3 bg-emerald-400/80" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
