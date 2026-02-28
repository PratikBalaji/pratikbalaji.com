import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { TerminalLog } from '@/hooks/useEdgeLLM';

interface EdgeTerminalProps {
  logs: TerminalLog[];
  tokensPerSec: number | null;
  isLoading: boolean;
}

const typeColors: Record<TerminalLog['type'], string> = {
  info: 'text-blue-400',
  progress: 'text-yellow-400',
  success: 'text-green-400',
  error: 'text-red-400',
  metric: 'text-cyan-400',
};

export default function EdgeTerminal({ logs, tokensPerSec, isLoading }: EdgeTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mx-3 mb-2 rounded-lg border border-green-500/30 bg-black/90 overflow-hidden font-mono text-[10px] leading-relaxed"
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-green-500/20 bg-green-500/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/80" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <span className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <span className="text-green-400/60 text-[9px]">edge-runtime</span>
        {tokensPerSec !== null && (
          <span className="text-cyan-400 text-[9px] font-bold">{tokensPerSec.toFixed(1)} tok/s</span>
        )}
      </div>

      {/* Log output */}
      <div ref={scrollRef} className="max-h-[120px] overflow-y-auto p-2 space-y-0.5 no-scrollbar">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`${typeColors[log.type]} whitespace-pre-wrap break-all`}
          >
            <span className="text-green-600/50 select-none">$ </span>
            {log.text}
          </motion.div>
        ))}
        {isLoading && (
          <div className="text-green-400 animate-pulse">
            <span className="text-green-600/50 select-none">$ </span>
            <span className="inline-block w-2 h-3 bg-green-400/80 animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
