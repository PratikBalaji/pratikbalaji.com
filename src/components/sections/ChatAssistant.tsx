import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, X, User, Square, Cloud, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AudioVisualizer from '@/components/voice/AudioVisualizer';
import VoiceMicButton from '@/components/voice/VoiceMicButton';
import TTSWaveform from '@/components/voice/TTSWaveform';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useEdgeLLM } from '@/hooks/useEdgeLLM';
import RAGVisualization from '@/components/chat/RAGVisualization';
import EdgeTerminal from '@/components/chat/EdgeTerminal';
import ChainOfThoughtTerminal, { type AgentStep } from '@/components/chat/ChainOfThoughtTerminal';
import { Switch } from '@/components/ui/switch';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;
const INITIAL_MSG: Msg = { role: 'assistant', content: "Hi! I'm Pratik's AI Resume Assistant. Ask me about his skills, experience, projects — or just hold the mic and talk to me!" };
const IDLE_RESET_MS = 2 * 60 * 1000;

// Keywords that trigger agent mode for complex queries
const AGENT_TRIGGERS = ['compare', 'analyze', 'email', 'summarize', 'contrast', 'vs', 'versus', 'difference between', 'send', 'generate report', 'deep dive', 'breakdown'];

function isComplexQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return AGENT_TRIGGERS.some(t => lower.includes(t));
}

function PBLogo({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-accent/30 blur-md animate-pulse" />
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent via-accent/80 to-accent/60 flex items-center justify-center border border-accent/40 shadow-[0_0_15px_hsl(var(--accent)/0.4)]">
        <span className="font-display font-black text-accent-foreground tracking-tighter" style={{ fontSize: '60%' }}>PB</span>
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragQuery, setRagQuery] = useState<string | null>(null);
  const [edgeMode, setEdgeMode] = useState(false);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastClosedRef = useRef<number>(Date.now());
  const pendingSendRef = useRef<Msg[] | null>(null);

  const { isListening, isProcessing, isSpeaking, analyser, startListening, stopListening, stopSpeaking } = useVoiceAgent(messages, setMessages, setIsLoading);
  const { isModelLoaded, isModelLoading, logs, tokensPerSec, loadModel, unloadModel, chat: edgeChat } = useEdgeLLM();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, ragQuery, agentSteps]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (edgeMode && !isModelLoaded && !isModelLoading) loadModel();
  }, [edgeMode, isModelLoaded, isModelLoading, loadModel]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      stopSpeaking();
      lastClosedRef.current = Date.now();
    } else {
      if (Date.now() - lastClosedRef.current > IDLE_RESET_MS) {
        setMessages([INITIAL_MSG]);
        setRagQuery(null);
        setAgentSteps([]);
      }
    }
    setIsOpen(prev => !prev);
  }, [isOpen, stopSpeaking]);

  const handleEdgeToggle = useCallback((checked: boolean) => {
    setEdgeMode(checked);
  }, []);

  // === CLOUD STREAMING (simple mode) ===
  const streamCloudResponse = useCallback(async (allMessages: Msg[]) => {
    setIsLoading(true);
    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.filter((_, i) => i > 0).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length > 1) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { /* partial chunk */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // === AGENT MODE (chain-of-thought) ===
  const streamAgentResponse = useCallback(async (allMessages: Msg[]) => {
    setIsLoading(true);
    setIsAgentActive(true);
    setAgentSteps([]);
    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.filter((_, i) => i > 0).map(m => ({ role: m.role, content: m.content })),
          agent_mode: true,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Agent stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.type === 'thought' || parsed.type === 'action' || parsed.type === 'observation' || parsed.type === 'error') {
              setAgentSteps(prev => [...prev, {
                type: parsed.type,
                content: parsed.content || '',
                tool: parsed.tool,
                args: parsed.args,
                timestamp: Date.now(),
              }]);
            } else if (parsed.type === 'answer_delta') {
              assistantSoFar += parsed.content || '';
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length > 1) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            } else if (parsed.type === 'done') {
              // Agent finished
            }
          } catch { /* partial */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Agent encountered an error. Try again!' }]);
    } finally {
      setIsLoading(false);
      setIsAgentActive(false);
    }
  }, []);

  // === EDGE MODE ===
  const streamEdgeResponse = useCallback(async (allMessages: Msg[]) => {
    setIsLoading(true);
    let assistantSoFar = '';
    const systemMsg = { role: 'system' as const, content: "You are Pratik Balaji's AI resume assistant. Answer questions about his skills, experience, and projects concisely." };
    const chatMessages = [systemMsg, ...allMessages.filter((_, i) => i > 0).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))];

    await edgeChat(
      chatMessages,
      (delta) => {
        assistantSoFar += delta;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && prev.length > 1) {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { role: 'assistant', content: assistantSoFar }];
        });
      },
      () => setIsLoading(false),
    );
  }, [edgeChat]);

  const send = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || ragQuery) return;

    const userMsg: Msg = { role: 'user', content: trimmed };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');

    if (edgeMode) {
      streamEdgeResponse(allMessages);
    } else if (isComplexQuery(trimmed)) {
      // Complex query → agent mode with chain-of-thought
      streamAgentResponse(allMessages);
    } else {
      // Simple query → RAG visualization then cloud stream
      pendingSendRef.current = allMessages;
      setRagQuery(trimmed);
    }
  }, [input, isLoading, ragQuery, messages, edgeMode, streamEdgeResponse, streamAgentResponse]);

  const handleRAGComplete = useCallback(() => {
    setRagQuery(null);
    if (pendingSendRef.current) {
      streamCloudResponse(pendingSendRef.current);
      pendingSendRef.current = null;
    }
  }, [streamCloudResponse]);

  const renderLink = useCallback(({ href, children }: { href?: string; children?: React.ReactNode }) => {
    let finalHref = href || '';
    if (finalHref.includes('PratikBalaji-Resume.pdf')) finalHref = '/PratikBalaji-Resume.pdf';
    return (
      <a href={finalHref} target="_blank" rel="noopener noreferrer"
        onClick={(e) => { e.preventDefault(); window.open(finalHref, '_blank', 'noopener,noreferrer'); }}
        className="cursor-pointer">{children}</a>
    );
  }, []);

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-[72px] h-[72px] rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              className="w-[64px] h-[64px] rounded-full bg-card/60 backdrop-blur-xl border border-white/15 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <X className="w-7 h-7 text-foreground" />
            </motion.div>
          ) : (
            <motion.div key="logo" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative">
              <div className="absolute -inset-1 rounded-full bg-accent/15 blur-lg animate-pulse" />
              <div className="relative w-[64px] h-[64px] rounded-full border border-accent/30 bg-accent/20 backdrop-blur-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_20px_hsl(var(--accent)/0.3)]">
                <span className="font-display font-black text-accent text-lg tracking-tighter">PB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[560px] max-h-[75vh] bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
              <PBLogo className="w-9 h-9" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-foreground">JARVIS · AI Agent</p>
                <p className="text-xs text-muted-foreground truncate">
                  {isAgentActive ? (
                    <span className="text-accent font-mono text-[10px] animate-pulse">⚙ Agent reasoning...</span>
                  ) : ragQuery ? (
                    <span className="text-accent font-mono text-[10px]">RAG Pipeline active…</span>
                  ) : isListening ? (
                    <span className="text-accent animate-pulse">● Listening...</span>
                  ) : isProcessing ? (
                    <span className="text-accent">Processing voice...</span>
                  ) : isSpeaking ? (
                    <span className="text-accent">● Speaking...</span>
                  ) : edgeMode ? (
                    <span className="font-mono text-[10px]">{isModelLoaded ? '🟢 Edge ready' : isModelLoading ? '⏳ Loading model...' : '⚡ Edge Compute'}</span>
                  ) : (
                    'Type or hold mic to speak'
                  )}
                </p>
              </div>
              <AnimatePresence>
                {isSpeaking && (
                  <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    onClick={stopSpeaking}
                    className="w-8 h-8 rounded-lg bg-destructive/15 hover:bg-destructive/25 border border-destructive/30 flex items-center justify-center transition-colors"
                    title="Stop speaking">
                    <Square className="w-3.5 h-3.5 text-destructive fill-destructive" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Compute Mode Toggle */}
            <div className="flex items-center justify-between px-5 py-2 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2 text-xs">
                <Cloud className={`w-3.5 h-3.5 ${!edgeMode ? 'text-accent' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${!edgeMode ? 'text-foreground' : 'text-muted-foreground'}`}>Cloud</span>
              </div>
              <Switch checked={edgeMode} onCheckedChange={handleEdgeToggle} className="data-[state=checked]:bg-accent" />
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-medium ${edgeMode ? 'text-foreground' : 'text-muted-foreground'}`}>Edge</span>
                <Cpu className={`w-3.5 h-3.5 ${edgeMode ? 'text-accent' : 'text-muted-foreground'}`} />
              </div>
            </div>

            {/* Edge Terminal */}
            <AnimatePresence>
              {edgeMode && logs.length > 0 && (
                <EdgeTerminal logs={logs} tokensPerSec={tokensPerSec} isLoading={isModelLoading} />
              )}
            </AnimatePresence>

            {/* Chain of Thought Terminal (Agent Mode) */}
            <AnimatePresence>
              {(isAgentActive || agentSteps.length > 0) && !edgeMode && (
                <ChainOfThoughtTerminal steps={agentSteps} isActive={isAgentActive} />
              )}
            </AnimatePresence>

            {/* Voice Visualizer Overlay */}
            <AnimatePresence>
              {isListening && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 160 }} exit={{ opacity: 0, height: 0 }}
                  className="relative flex items-center justify-center bg-background/40 backdrop-blur-sm border-b border-white/10 overflow-hidden">
                  <AudioVisualizer analyser={analyser} isActive={isListening} className="w-[160px] h-[160px]" />
                  <motion.p className="absolute bottom-2 text-xs text-muted-foreground" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                    Release to send
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TTS Playback Waveform */}
            <AnimatePresence>
              {isSpeaking && !isListening && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 48 }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center gap-3 bg-accent/5 border-b border-white/10 overflow-hidden">
                  <TTSWaveform isActive={isSpeaking} />
                  <span className="text-xs text-accent font-medium">Speaking...</span>
                  <TTSWaveform isActive={isSpeaking} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <PBLogo className="w-7 h-7 flex-shrink-0 mt-0.5" />}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent/80 backdrop-blur-sm text-accent-foreground rounded-br-md whitespace-pre-wrap'
                      : 'bg-white/[0.08] backdrop-blur-sm text-foreground rounded-bl-md prose prose-sm prose-invert max-w-none [&_a]:text-accent [&_a]:underline [&_a]:font-medium [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown components={{ a: renderLink }}>{msg.content}</ReactMarkdown>
                    ) : msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* RAG Visualization (cloud simple mode only) */}
              <AnimatePresence>
                {ragQuery && !edgeMode && (
                  <RAGVisualization query={ragQuery} onComplete={handleRAGComplete} />
                )}
              </AnimatePresence>

              {/* Loading dots */}
              {isLoading && !ragQuery && !isAgentActive && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-2">
                  <PBLogo className="w-7 h-7 flex-shrink-0" />
                  <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input with mic button */}
            <div className="px-4 py-3 border-t border-white/10 bg-white/[0.03]">
              <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={edgeMode ? 'Ask locally (no network)...' : 'Ask about Pratik...'}
                  className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm transition-all"
                  maxLength={500}
                  disabled={isLoading || isListening || !!ragQuery || (edgeMode && isModelLoading)}
                />
                <VoiceMicButton isListening={isListening} isProcessing={isProcessing} onMouseDown={startListening} onMouseUp={stopListening} />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim() || isListening || !!ragQuery || (edgeMode && !isModelLoaded)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-50 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
