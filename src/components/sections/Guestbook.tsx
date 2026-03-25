import { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, LogIn, LogOut, MessageSquare, User } from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';
import { sanitizeInput, containsScriptInjection } from '@/lib/sanitize';

type GuestbookEntry = {
  id: string;
  message: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

export default function Guestbook() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [user, setUser] = useState<SupaUser | null>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', displayName: '' });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('id, message, created_at, profiles(display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setEntries(data as unknown as GuestbookEntry[]);
    }
    setIsLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: { display_name: authForm.displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: '📧 Check your email!', description: 'Please verify your email to sign in.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
        setShowAuth(false);
        toast({ title: '👋 Welcome back!' });
      }
    } catch (err: any) {
      toast({ title: 'Auth error', description: err.message, variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: 'Signed out' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    if (message.trim().length > 100) {
      toast({ title: 'Too long', description: 'Keep it under 100 characters!', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('guestbook').insert({
        user_id: user.id,
        message: message.trim(),
      });
      if (error) throw error;
      setMessage('');
      await fetchEntries();
      toast({ title: '🎉 Endorsement added!' });
    } catch {
      toast({ title: 'Error', description: 'Could not post. Try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <section id="guestbook" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">Community</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Guestbook & Endorsements
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sign in and leave an endorsement. A full-stack authenticated CRUD feature.
            </p>
          </ScrollReveal>
        </div>

        {/* Auth + Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12"
        >
          {user ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {getInitials(user.user_metadata?.display_name || user.email)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.user_metadata?.display_name || user.email}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                </div>
                <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Leave an endorsement (100 chars max)..."
                  maxLength={100}
                  className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-[var(--electric-glow)] disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </motion.button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-right">{message.length}/100</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6">
              {!showAuth ? (
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 text-accent mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">Sign in to leave an endorsement</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAuth(true)}
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-xl hover:shadow-[var(--electric-glow)] transition-all"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </motion.button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'login' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'signup' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    >
                      Sign Up
                    </button>
                  </div>
                  <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">Display Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={authForm.displayName}
                            onChange={e => setAuthForm(p => ({ ...p, displayName: e.target.value }))}
                            className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                            placeholder="Your name"
                            required
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Email</label>
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Password</label>
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={authLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-3 rounded-xl hover:shadow-[var(--electric-glow)] transition-all disabled:opacity-50"
                    >
                      {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </motion.button>
                    <button type="button" onClick={() => setShowAuth(false)} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Entries Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse break-inside-avoid">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            ))
          ) : entries.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No endorsements yet. Be the first!</p>
            </div>
          ) : (
            <AnimatePresence>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.05 }}
                  className="break-inside-avoid bg-card border border-border rounded-2xl p-5 hover:border-accent/30 hover:shadow-[var(--electric-glow)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                      {getInitials(entry.profiles?.display_name ?? null)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.profiles?.display_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(entry.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed">{entry.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
