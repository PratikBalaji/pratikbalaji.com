import { useState, useRef, useCallback } from 'react';
import type { MLCEngine } from '@mlc-ai/web-llm';

export type TerminalLog = {
  timestamp: number;
  text: string;
  type: 'info' | 'progress' | 'success' | 'error' | 'metric';
};

const MODEL_ID = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

export function useEdgeLLM() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [tokensPerSec, setTokensPerSec] = useState<number | null>(null);
  const engineRef = useRef<MLCEngine | null>(null);

  const addLog = useCallback((text: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [...prev, { timestamp: Date.now(), text, type }]);
  }, []);

  const loadModel = useCallback(async () => {
    if (isModelLoaded || isModelLoading) return;
    setIsModelLoading(true);
    setLogs([]);
    addLog(`[edge] Initializing WebGPU runtime...`);

    try {
      // Dynamic import to avoid loading the library until needed
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
      addLog(`[edge] WebLLM runtime loaded`);
      addLog(`[edge] Model: ${MODEL_ID}`);
      addLog(`[edge] Fetching model weights from CDN...`, 'progress');

      const engine = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (progress) => {
          const msg = progress.text || '';
          // Show download and loading progress
          if (msg.includes('Loading model')) {
            addLog(`[vram] ${msg}`, 'progress');
          } else if (msg.includes('Fetching')) {
            addLog(`[net]  ${msg}`, 'progress');
          } else if (msg) {
            addLog(`[init] ${msg}`, 'progress');
          }
        },
      });

      engineRef.current = engine;
      setIsModelLoaded(true);
      addLog(`[edge] Model loaded into VRAM ✓`, 'success');
      addLog(`[edge] Ready for local inference — zero network requests`, 'success');
    } catch (err: any) {
      addLog(`[error] ${err.message || 'Failed to load model'}`, 'error');
      if (err.message?.includes('WebGPU')) {
        addLog(`[error] WebGPU not supported — try Chrome 113+`, 'error');
      }
    } finally {
      setIsModelLoading(false);
    }
  }, [isModelLoaded, isModelLoading, addLog]);

  const unloadModel = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.unload();
      engineRef.current = null;
    }
    setIsModelLoaded(false);
    setTokensPerSec(null);
    setLogs([]);
  }, []);

  const chat = useCallback(async (
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    onDelta: (text: string) => void,
    onDone: () => void,
  ) => {
    const engine = engineRef.current;
    if (!engine) {
      onDelta('Edge model not loaded.');
      onDone();
      return;
    }

    addLog(`[infer] Starting local generation...`, 'info');
    const startTime = performance.now();
    let tokenCount = 0;

    try {
      const completion = await engine.chat.completions.create({
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 512,
      });

      for await (const chunk of completion) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          onDelta(content);
          tokenCount++;
        }
      }

      const elapsed = (performance.now() - startTime) / 1000;
      const tps = tokenCount / elapsed;
      setTokensPerSec(tps);
      addLog(`[perf] ${tokenCount} tokens in ${elapsed.toFixed(2)}s → ${tps.toFixed(1)} tok/s`, 'metric');
      addLog(`[perf] Network requests: 0`, 'metric');
    } catch (err: any) {
      addLog(`[error] ${err.message || 'Generation failed'}`, 'error');
      onDelta('Sorry, local inference failed. Try Cloud mode.');
    }

    onDone();
  }, [addLog]);

  return {
    isModelLoaded,
    isModelLoading,
    logs,
    tokensPerSec,
    loadModel,
    unloadModel,
    chat,
  };
}
