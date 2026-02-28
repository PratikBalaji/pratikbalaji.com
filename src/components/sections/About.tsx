import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { Brain, Music, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// ── Animated ticker number ──────────────────────────────────────────────
function TickerNumber({ value, duration = 2000 }: {value: number;duration?: number;}) {
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

// ── Spotify hook ────────────────────────────────────────────────────────
interface SpotifyTrack {
  title: string;
  artist: string;
  playing: boolean;
  albumArt?: string;
}

function useSpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack>({
    title: 'Not Playing',
    artist: '—',
    playing: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('spotify-now-playing');
        if (error) throw error;
        if (data?.is_playing && data?.item) {
          setTrack({
            title: data.item.name,
            artist: data.item.artists?.map((a: any) => a.name).join(', ') || 'Unknown',
            playing: true,
            albumArt: data.item.album?.images?.[0]?.url
          });
        } else {
          setTrack({
            title: data?.item?.name || 'Not Playing',
            artist: data?.item?.artists?.map((a: any) => a.name).join(', ') || '—',
            playing: false,
            albumArt: data?.item?.album?.images?.[0]?.url
          });
        }
      } catch (err) {
        console.error('Spotify fetch error:', err);
        setTrack({ title: 'Offline', artist: 'Connect Spotify', playing: false });
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return { track, loading };
}

// ── Simulated focus data ────────────────────────────────────────────────
function useFocusTelemetry() {
  const [data, setData] = useState({ focusMode: 'Deep Work', focusScore: 87 });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        focusScore: Math.max(40, Math.min(99, prev.focusScore + Math.floor(Math.random() * 5) - 2))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

// ── Vinyl record ────────────────────────────────────────────────────────
function VinylRecord({ track }: {track: SpotifyTrack;}) {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        className="relative w-16 h-16 flex-shrink-0"
        animate={track.playing ? { rotate: 360 } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>

        {track.albumArt ?
        <div className="w-full h-full rounded-full overflow-hidden border border-border shadow-[0_0_15px_hsl(var(--accent)/0.15)]">
            <img src={track.albumArt} alt="Album art" className="w-full h-full object-cover" />
            <div className="absolute inset-[22px] rounded-full bg-background/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
          </div> :

        <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary via-muted to-secondary border border-border shadow-[0_0_15px_hsl(var(--accent)/0.15)]">
            <div className="absolute inset-2 rounded-full border border-muted-foreground/10" />
            <div className="absolute inset-3.5 rounded-full border border-muted-foreground/10" />
            <div className="absolute inset-5 rounded-full border border-muted-foreground/10" />
            <div className="absolute inset-[22px] rounded-full bg-accent/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-background" />
            </div>
          </div>
        }
        <div className="absolute -inset-1 rounded-full border border-accent/20 animate-pulse" />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {[...Array(5)].map((_, i) =>
          <motion.div
            key={i}
            className="w-0.5 bg-accent rounded-full"
            animate={{ height: track.playing ? [4, 12, 6, 14, 4] : [4, 4, 4, 4, 4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} />

          )}
          <span className="text-[10px] text-accent font-mono ml-1">{track.playing ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </div>
    </div>);

}

// ── Main section ────────────────────────────────────────────────────────
export default function About() {
  const { track, loading } = useSpotifyNowPlaying();
  const focus = useFocusTelemetry();

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4 font-mono">
            <Zap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-accent">About Me

          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Real-time mission control. Live data streams from my daily workflow.
          </p>
        </ScrollReveal>

        {/* Two-column: Now Playing + Focus Mode */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Now Playing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
            className="relative group">

            <div className="absolute -inset-px rounded-2xl bg-accent/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Music className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Now Playing</span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-accent ml-auto"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }} />

              </div>
              {loading ?
              <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div> :

              <VinylRecord track={track} />
              }
            </div>
          </motion.div>

          {/* Focus Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="relative group">

            <div className="absolute -inset-px rounded-2xl bg-accent/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Focus Mode</span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-accent ml-auto"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }} />

              </div>
              <p className="text-lg font-display font-bold text-foreground">{focus.focusMode}</p>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                  <span>Focus Score</span>
                  <span className="text-accent"><TickerNumber value={focus.focusScore} duration={1000} />%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${focus.focusScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }} />

                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
    </section>);

}