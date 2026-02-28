import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { Slider } from '@/components/ui/slider';
import { Bot, Package, CheckCircle2, Loader2, Zap, Copy } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────
interface Order {
  id: string;
  label: string;
  status: 'queued' | 'processing' | 'completed';
  x: number;
  y: number;
  assignedTo?: string;
  progress: number;
}

interface Agent {
  id: string;
  name: string;
  type: 'Parser' | 'Kitchen Sync' | 'Notifier';
  x: number;
  y: number;
  busy: boolean;
  color: string;
  isClone: boolean;
  targetOrder?: string;
}

const AGENT_COLORS: Record<string, string> = {
  Parser: 'hsl(270 100% 64%)',       // accent purple
  'Kitchen Sync': 'hsl(160 80% 50%)', // green
  Notifier: 'hsl(200 90% 55%)',       // blue
};

const QUEUE_X = 80;
const QUEUE_Y_START = 80;
const QUEUE_SPACING = 52;
const COMPLETED_X = 720;
const COMPLETED_Y_START = 80;
const AGENT_HOME: Record<string, { x: number; y: number }> = {
  Parser: { x: 350, y: 100 },
  'Kitchen Sync': { x: 400, y: 220 },
  Notifier: { x: 350, y: 340 },
};

let orderCounter = 0;
function makeOrder(): Order {
  orderCounter++;
  const labels = ['Biryani', 'Dosa', 'Paneer', 'Naan Set', 'Thali', 'Chai', 'Samosa', 'Curry'];
  return {
    id: `order-${orderCounter}`,
    label: labels[Math.floor(Math.random() * labels.length)],
    status: 'queued',
    x: -40,
    y: QUEUE_Y_START,
    progress: 0,
  };
}

// ── Agent Node ─────────────────────────────────────────────────────────
function AgentNode({ agent }: { agent: Agent }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center pointer-events-none"
      animate={{ x: agent.x - 24, y: agent.y - 24 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{ zIndex: 20 }}
    >
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg"
        style={{
          borderColor: agent.busy ? agent.color : 'hsl(var(--border))',
          background: agent.busy
            ? `linear-gradient(135deg, ${agent.color}22, ${agent.color}08)`
            : 'hsl(var(--card))',
          boxShadow: agent.busy ? `0 0 20px ${agent.color}40` : 'none',
        }}
      >
        {agent.busy ? (
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: agent.color }} />
        ) : (
          <Bot className="w-5 h-5 text-muted-foreground" />
        )}
        {agent.isClone && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
            <Copy className="w-2.5 h-2.5 text-accent-foreground" />
          </div>
        )}
      </div>
      <span className="text-[10px] font-mono mt-1 whitespace-nowrap" style={{ color: agent.color }}>
        {agent.name}
      </span>
    </motion.div>
  );
}

// ── Order Node ─────────────────────────────────────────────────────────
function OrderNode({ order }: { order: Order }) {
  const bg =
    order.status === 'queued'
      ? 'bg-secondary border-border'
      : order.status === 'processing'
      ? 'bg-accent/10 border-accent/50'
      : 'bg-accent/5 border-accent/30';

  return (
    <motion.div
      className={`absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${bg}`}
      initial={{ x: -40, y: order.y, opacity: 0, scale: 0.6 }}
      animate={{
        x: order.x,
        y: order.y,
        opacity: 1,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 100, damping: 16 }}
      style={{ zIndex: 10 }}
    >
      {order.status === 'queued' && <Package className="w-3 h-3 text-muted-foreground" />}
      {order.status === 'processing' && <Loader2 className="w-3 h-3 text-accent animate-spin" />}
      {order.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-accent" />}
      <span className={order.status === 'completed' ? 'text-accent' : 'text-foreground'}>{order.label}</span>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function AgenticSwarm() {
  const [traffic, setTraffic] = useState(30);
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'parser-1', name: 'Parser', type: 'Parser', ...AGENT_HOME.Parser, busy: false, color: AGENT_COLORS.Parser, isClone: false },
    { id: 'kitchen-1', name: 'Kitchen Sync', type: 'Kitchen Sync', ...AGENT_HOME['Kitchen Sync'], busy: false, color: AGENT_COLORS['Kitchen Sync'], isClone: false },
    { id: 'notifier-1', name: 'Notifier', type: 'Notifier', ...AGENT_HOME.Notifier, busy: false, color: AGENT_COLORS.Notifier, isClone: false },
  ]);
  const [completed, setCompleted] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  // Spawn orders based on traffic
  useEffect(() => {
    const interval = Math.max(300, 3000 - traffic * 25);
    tickRef.current = setInterval(() => {
      setOrders(prev => {
        if (prev.filter(o => o.status === 'queued').length >= 8) return prev;
        const o = makeOrder();
        const queuedCount = prev.filter(p => p.status === 'queued').length;
        o.x = QUEUE_X;
        o.y = QUEUE_Y_START + queuedCount * QUEUE_SPACING;
        return [...prev, o];
      });
    }, interval);
    return () => clearInterval(tickRef.current);
  }, [traffic]);

  // Auto-scale agents at high traffic
  useEffect(() => {
    if (traffic >= 80) {
      setAgents(prev => {
        const types: Array<'Parser' | 'Kitchen Sync' | 'Notifier'> = ['Parser', 'Kitchen Sync', 'Notifier'];
        const needed: Agent[] = [];
        for (const t of types) {
          const existing = prev.filter(a => a.type === t);
          if (existing.length < 2) {
            const home = AGENT_HOME[t];
            needed.push({
              id: `${t.toLowerCase().replace(' ', '-')}-clone-${Date.now()}`,
              name: `${t} ²`,
              type: t,
              x: home.x + 60,
              y: home.y + 40,
              busy: false,
              color: AGENT_COLORS[t],
              isClone: true,
            });
          }
        }
        return needed.length > 0 ? [...prev, ...needed] : prev;
      });
    } else {
      setAgents(prev => prev.filter(a => !a.isClone || a.busy));
    }
  }, [traffic]);

  // Processing loop — assign idle agents to queued orders
  useEffect(() => {
    const processInterval = setInterval(() => {
      setOrders(prevOrders => {
        setAgents(prevAgents => {
          const newAgents = [...prevAgents];
          const newOrders = [...prevOrders];
          
          for (const agent of newAgents) {
            if (agent.busy) {
              // Check if the assigned order is done
              const target = newOrders.find(o => o.id === agent.targetOrder);
              if (target && target.progress >= 100) {
                // Move to completed
                target.status = 'completed';
                const completedCount = newOrders.filter(o => o.status === 'completed').length;
                target.x = COMPLETED_X;
                target.y = COMPLETED_Y_START + (completedCount % 6) * QUEUE_SPACING;
                agent.busy = false;
                agent.targetOrder = undefined;
                const home = AGENT_HOME[agent.type];
                agent.x = home.x + (agent.isClone ? 60 : 0);
                agent.y = home.y + (agent.isClone ? 40 : 0);
                setCompleted(c => c + 1);
              } else if (target) {
                target.progress += 20;
                agent.x = target.x + 50;
                agent.y = target.y;
              }
              continue;
            }

            // Find a queued order
            const queued = newOrders.find(o => o.status === 'queued' && !newAgents.some(a => a.targetOrder === o.id));
            if (queued) {
              agent.busy = true;
              agent.targetOrder = queued.id;
              queued.status = 'processing';
              agent.x = queued.x + 50;
              agent.y = queued.y;
            }
          }

          return newAgents;
        });

        // Clean old completed orders
        return prevOrders.filter(o => {
          if (o.status === 'completed' && o.progress >= 100) {
            // Keep for a while then remove
            return true;
          }
          return true;
        }).slice(-20); // limit total
      });
    }, 600);

    return () => clearInterval(processInterval);
  }, []);

  // Clean up old completed orders
  useEffect(() => {
    const cleanup = setInterval(() => {
      setOrders(prev => {
        const completedOrders = prev.filter(o => o.status === 'completed');
        if (completedOrders.length > 5) {
          const toRemove = completedOrders.slice(0, completedOrders.length - 5).map(o => o.id);
          return prev.filter(o => !toRemove.includes(o.id));
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(cleanup);
  }, []);

  const queuedCount = orders.filter(o => o.status === 'queued').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const activeAgents = agents.length;

  return (
    <section id="agentic-swarm" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4 font-mono">
            <Zap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Live Simulation
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Agentic Swarm
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            Watch AI agents from my <span className="text-accent font-semibold">AROMA</span> project autonomously parse, cook, and notify — scaling dynamically under load.
          </p>
        </ScrollReveal>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground">
            <span>Queued: <span className="text-foreground font-semibold">{queuedCount}</span></span>
            <span>Processing: <span className="text-accent font-semibold">{processingCount}</span></span>
            <span>Completed: <span className="text-accent font-semibold">{completed}</span></span>
            <span>Agents: <span className="text-foreground font-semibold">{activeAgents}</span></span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-64">
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">Traffic</span>
            <Slider
              value={[traffic]}
              onValueChange={([v]) => setTraffic(v)}
              min={10}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-xs font-mono text-accent w-8 text-right">{traffic}%</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative w-full h-[420px] rounded-2xl border border-border bg-card overflow-hidden">
          {/* Zone labels */}
          <div className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
            Order Queue
          </div>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
            Processing
          </div>
          <div className="absolute top-3 right-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
            Completed
          </div>

          {/* Zone dividers */}
          <div className="absolute top-0 bottom-0 left-[200px] w-px bg-border/30" />
          <div className="absolute top-0 bottom-0 right-[200px] w-px bg-border/30" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          {/* Agents */}
          {agents.map(agent => (
            <AgentNode key={agent.id} agent={agent} />
          ))}

          {/* Orders */}
          <AnimatePresence>
            {orders.map(order => (
              <OrderNode key={order.id} order={order} />
            ))}
          </AnimatePresence>

          {/* High traffic warning */}
          <AnimatePresence>
            {traffic >= 80 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-[10px] font-mono text-accent flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                Auto-scaling: Spawning clone agents
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
