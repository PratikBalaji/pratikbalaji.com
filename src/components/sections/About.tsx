import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { Activity, Coffee, Code, Brain, Music, Zap } from 'lucide-react';

// ── Animated ticker number ──────────────────────────────────────────────
function TickerNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = ref.current;
    const diff = value - from;
    startRef.current = null;

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + diff * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ref.current = value;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

// ── Simulated live data hook ────────────────────────────────────────────
function useLiveTelemetry() {
  const [data, setData] = useState({
    linesOfCode: 1247,
    heartRate: 72,
    coffeeCount: 2,
    focusMode: 'Deep Work',
    focusScore: 87,
    currentTrack: { title: 'Interstellar Main Theme', artist: 'Hans Zimmer', playing: true },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        linesOfCode: prev.linesOfCode + Math.floor(Math.random() * 8) + 1,
        heartRate: Math.max(60, Math.min(100, prev.heartRate + Math.floor(Math.random() * 7) - 3)),
        coffeeCount: prev.coffeeCount + (Math.random() > 0.97 ? 1 : 0),
        focusScore: Math.max(40, Math.min(99, prev.focusScore + Math.floor(Math.random() * 5) - 2)),
      }));
    }, 3000);

    // Rotate tracks
    const tracks = [
      { title: 'Interstellar Main Theme', artist: 'Hans Zimmer', playing: true },
      { title: 'Strobe', artist: 'deadmau5', playing: true },
      { title: 'Resonance', artist: 'HOME', playing: true },
      { title: 'Intro', artist: 'The xx', playing: true },
      { title: 'Midnight City', artist: 'M83', playing: true },
    ];
    let trackIdx = 0;
    const trackInterval = setInterval(() => {
      trackIdx = (trackIdx + 1) % tracks.length;
      setData(prev => ({ ...prev, currentTrack: tracks[trackIdx] }));
    }, 15000);

    return () => { clearInterval(interval); clearInterval(trackInterval); };
  }, []);

  return data;
}

// ── Glowing stat card ───────────────────────────────────────────────────
function TelemetryCard({ icon: Icon, label, children, delay = 0, glowColor = 'accent' }: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  delay?: number;
  glowColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
      className="relative group"
    >
      {/* Glow */}
      <div className="absolute -inset-px rounded-2xl bg-accent/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 h-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent ml-auto"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// ── Vinyl record ────────────────────────────────────────────────────────
function VinylRecord({ track, isPlaying }: { track: { title: string; artist: string }; isPlaying: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        className="relative w-16 h-16 flex-shrink-0"
        animate={isPlaying ? { rotate: 360 } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        {/* Vinyl disc */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary via-muted to-secondary border border-border shadow-[0_0_15px_hsl(var(--accent)/0.15)]">
          {/* Grooves */}
          <div className="absolute inset-2 rounded-full border border-muted-foreground/10" />
          <div className="absolute inset-3.5 rounded-full border border-muted-foreground/10" />
          <div className="absolute inset-5 rounded-full border border-muted-foreground/10" />
          {/* Center label */}
          <div className="absolute inset-[22px] rounded-full bg-accent/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-background" />
          </div>
        </div>
        {/* Glow ring */}
        <div className="absolute -inset-1 rounded-full border border-accent/20 animate-pulse" />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 bg-accent rounded-full"
              animate={{ height: isPlaying ? [4, 12, 6, 14, 4] : [4, 4, 4, 4, 4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <span className="text-[10px] text-accent font-mono ml-1">{isPlaying ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </div>
    </div>
  );
}

// ── Mini heart rate sparkline ───────────────────────────────────────────
function HeartRateWave() {
  return (
    <svg viewBox="0 0 120 30" className="w-full h-8 mt-2" preserveAspectRatio="none">
      <motion.path
        d="M0,15 L10,15 L15,15 L20,5 L25,25 L30,10 L35,20 L40,15 L50,15 L55,15 L60,5 L65,25 L70,10 L75,20 L80,15 L90,15 L95,15 L100,5 L105,25 L110,10 L115,20 L120,15"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

// ── Main section ────────────────────────────────────────────────────────
export default function About() {
  const telemetry = useLiveTelemetry();

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4 font-mono">
            <Zap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Live Telemetry
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Quantified Self
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Real-time mission control. Simulated live data streams from my daily workflow.
          </p>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lines of Code */}
          <TelemetryCard icon={Code} label="Lines Today" delay={0.1}>
            <p className="text-3xl font-display font-bold text-foreground tabular-nums">
              <TickerNumber value={telemetry.linesOfCode} />
            </p>
            <p className="text-xs text-accent font-mono mt-1">+{Math.floor(Math.random() * 30 + 10)} last hour</p>
          </TelemetryCard>

          {/* Heart Rate */}
          <TelemetryCard icon={Activity} label="Heart Rate" delay={0.2}>
            <p className="text-3xl font-display font-bold text-foreground tabular-nums">
              <TickerNumber value={telemetry.heartRate} duration={800} />
              <span className="text-sm text-muted-foreground ml-1">bpm</span>
            </p>
            <HeartRateWave />
          </TelemetryCard>

          {/* Coffee */}
          <TelemetryCard icon={Coffee} label="Coffee Intake" delay={0.3}>
            <p className="text-3xl font-display font-bold text-foreground tabular-nums">
              <TickerNumber value={telemetry.coffeeCount} duration={500} />
              <span className="text-sm text-muted-foreground ml-1">cups</span>
            </p>
            <div className="flex gap-1 mt-2">
              {[...Array(telemetry.coffeeCount)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-accent text-sm"
                >☕</motion.div>
              ))}
            </div>
          </TelemetryCard>

          {/* Focus Mode */}
          <TelemetryCard icon={Brain} label="Focus Mode" delay={0.4}>
            <p className="text-lg font-display font-bold text-foreground">{telemetry.focusMode}</p>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                <span>Focus Score</span>
                <span className="text-accent"><TickerNumber value={telemetry.focusScore} duration={1000} />%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  animate={{ width: `${telemetry.focusScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </TelemetryCard>
        </div>

        {/* Now Playing - full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
          className="mt-4 relative group"
        >
          <div className="absolute -inset-px rounded-2xl bg-accent/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Music className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Now Playing</span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-accent ml-auto"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <VinylRecord track={telemetry.currentTrack} isPlaying={telemetry.currentTrack.playing} />
          </div>
        </motion.div>

        {/* About text */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <ScrollReveal delay={0.2}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Bridging data science and AI to build intelligent solutions.
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              I'm a student at Temple University's College of Science and Technology,
              pursuing a degree in Data Science with a specialization in Computational
              Analytics. My passion lies at the intersection of data and artificial intelligence.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-muted-foreground leading-relaxed mb-6">
              As an aspiring AI Generalist, I'm eager to work closely with machine learning
              and AI technologies—exploring everything from generative models to intelligent
              agents. I thrive on turning complex data into actionable insights and innovative applications.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-card rounded-full border border-border hover:border-accent/40 transition-colors">
                <span className="font-display font-semibold text-foreground text-sm">AI/ML</span>
                <span className="text-muted-foreground text-sm ml-2">Focused</span>
              </div>
              <div className="px-4 py-2 bg-card rounded-full border border-border hover:border-accent/40 transition-colors">
                <span className="font-display font-semibold text-foreground text-sm">Data Science</span>
                <span className="text-muted-foreground text-sm ml-2">Major</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
