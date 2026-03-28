import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogOut, Shield, MapPin, Briefcase, Save, Settings, ArrowLeft, Bot, Rocket, Activity, Cpu, Wand2, Palette, Eye, EyeOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsManager from '@/components/admin/ProjectsManager';
import SkillsManager from '@/components/admin/SkillsManager';
import { applyAccentColor } from '@/hooks/useSiteSettings';
import type { Session } from '@supabase/supabase-js';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to site
        </Link>
      </div>
      <Card className="w-full max-w-sm border-border/30 bg-card/50 backdrop-blur-2xl shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">Admin Access</CardTitle>
          <CardDescription className="text-xs">Authenticate to manage site settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 bg-background/50 border-border/40 text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-9 bg-background/50 border-border/40 text-sm"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full h-9 text-sm mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const [isOpenToWork, setIsOpenToWork] = useState(true);
  const [location, setLocation] = useState('Philadelphia, PA');
  const [currentStatus, setCurrentStatus] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [enableHeavy3D, setEnableHeavy3D] = useState(true);
  const [enableEasterEggs, setEnableEasterEggs] = useState(true);
  const [accentColor, setAccentColor] = useState('#7C3AED');
  const [livePreview, setLivePreview] = useState(false);
  const savedColorRef = useRef('#7C3AED');
  const [saving, setSaving] = useState(false);
  const [deployingPrompt, setDeployingPrompt] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data) {
        data.forEach((row) => {
          if (row.key === 'is_open_to_work') setIsOpenToWork(row.value === 'true');
          if (row.key === 'current_location') setLocation(row.value);
          if (row.key === 'current_status') setCurrentStatus(row.value);
          if (row.key === 'system_prompt') setSystemPrompt(row.value);
          if (row.key === 'enable_heavy_3d') setEnableHeavy3D(row.value === 'true');
          if (row.key === 'enable_easter_eggs') setEnableEasterEggs(row.value === 'true');
          if (row.key === 'primary_accent_color') {
            setAccentColor(row.value);
            savedColorRef.current = row.value;
          }
        });
      }
      setLoaded(true);
    };
    fetchSettings();
  }, []);

  // Live preview: apply accent color to CSS vars in real-time
  useEffect(() => {
    if (livePreview && /^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
      applyAccentColor(accentColor);
    }
  }, [accentColor, livePreview]);

  // Revert color when disabling live preview without saving
  useEffect(() => {
    if (!livePreview && savedColorRef.current) {
      applyAccentColor(savedColorRef.current);
    }
  }, [livePreview]);

  const handleSave = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const results = await Promise.all([
      supabase.from('site_settings').update({ value: String(isOpenToWork), updated_at: now }).eq('key', 'is_open_to_work'),
      supabase.from('site_settings').update({ value: location, updated_at: now }).eq('key', 'current_location'),
      supabase.from('site_settings').update({ value: currentStatus, updated_at: now }).eq('key', 'current_status'),
      supabase.from('site_settings').update({ value: String(enableHeavy3D), updated_at: now }).eq('key', 'enable_heavy_3d'),
      supabase.from('site_settings').update({ value: String(enableEasterEggs), updated_at: now }).eq('key', 'enable_easter_eggs'),
      supabase.from('site_settings').update({ value: accentColor, updated_at: now }).eq('key', 'primary_accent_color'),
    ]);
    setSaving(false);
    if (results.some((r) => r.error)) {
      toast.error('Failed to save settings');
    } else {
      savedColorRef.current = accentColor;
      toast.success('Settings updated successfully');
    }
  };

  const handleDeployPrompt = async () => {
    setDeployingPrompt(true);
    const now = new Date().toISOString();
    const { error } = await supabase.from('site_settings').update({ value: systemPrompt, updated_at: now }).eq('key', 'system_prompt');
    setDeployingPrompt(false);
    if (error) {
      toast.error('Failed to deploy prompt');
    } else {
      toast.success('AI prompt deployed! Your chatbot is now updated.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/20 bg-card/30 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Settings className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground tracking-tight">Admin Panel</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-muted-foreground hover:text-foreground h-8 px-3">
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pt-8 space-y-4">
        {/* Open to Work toggle */}
        <Card className="border-border/20 bg-card/40 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Open for Opportunities</p>
                  <p className="text-xs text-muted-foreground">Display availability badge on hero</p>
                </div>
              </div>
              <Switch
                checked={isOpenToWork}
                onCheckedChange={setIsOpenToWork}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-border/20 bg-card/40 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Current Location</p>
                <p className="text-xs text-muted-foreground">Shown in navbar and hero section</p>
              </div>
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 bg-background/50 border-border/30 text-sm"
              placeholder="City, State"
            />
          </CardContent>
        </Card>

        {/* Current Activity */}
        <Card className="border-border/20 bg-card/40 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Current Activity</p>
                <p className="text-xs text-muted-foreground">Live status on your 3D business card</p>
              </div>
            </div>
            <Input
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="h-9 bg-background/50 border-border/30 text-sm font-mono"
              placeholder="Training ML Models"
            />
          </CardContent>
        </Card>

        {/* Theme Engine */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border/20" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Theme</span>
          <div className="h-px flex-1 bg-border/20" />
        </div>

        <Card className="border-border/20 bg-card/40 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Palette className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Global Accent Color</p>
                <p className="text-xs text-muted-foreground">Changes all glows, buttons, hover states &amp; 3D lighting</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-border/30 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={accentColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setAccentColor(v);
                  }}
                  className="h-8 bg-background/50 border-border/30 text-sm font-mono uppercase"
                  placeholder="#7C3AED"
                  maxLength={7}
                />
                <div className="flex gap-1.5">
                  {['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: accentColor === c ? 'white' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                className="w-20 h-12 rounded-lg border border-border/20"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                  boxShadow: `0 0 30px ${accentColor}40`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border/20" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Feature Flags</span>
          <div className="h-px flex-1 bg-border/20" />
        </div>

        <Card className="border-border/20 bg-card/40 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Heavy 3D Background</p>
                  <p className="text-xs text-muted-foreground">WebGL space particles &amp; floating shapes. Falls back to CSS gradient when off.</p>
                </div>
              </div>
              <Switch checked={enableHeavy3D} onCheckedChange={setEnableHeavy3D} />
            </div>
            <div className="h-px bg-border/10" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Easter Eggs</p>
                  <p className="text-xs text-muted-foreground">AI chat assistant and hidden developer tools</p>
                </div>
              </div>
              <Switch checked={enableEasterEggs} onCheckedChange={setEnableEasterEggs} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full h-10 text-sm gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Site Settings'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border/20" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">AI Agent</span>
          <div className="h-px flex-1 bg-border/20" />
        </div>

        {/* System Prompt */}
        <Card className="border-border/20 bg-card/40 backdrop-blur-xl shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI System Prompt</p>
                <p className="text-xs text-muted-foreground">Control your chatbot's personality and behavior</p>
              </div>
            </div>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[200px] bg-background/50 border-border/30 text-sm font-mono leading-relaxed resize-y"
              placeholder="You are a helpful AI assistant..."
            />
            <p className="text-xs text-muted-foreground mt-2">{systemPrompt.length} characters</p>
          </CardContent>
        </Card>

        <Button onClick={handleDeployPrompt} disabled={deployingPrompt} className="w-full h-10 text-sm gap-2 bg-accent hover:bg-accent/90">
          <Rocket className="w-4 h-4" />
          {deployingPrompt ? 'Deploying…' : 'Deploy New Prompt'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border/20" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Content</span>
          <div className="h-px flex-1 bg-border/20" />
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full bg-card/40 border border-border/20">
            <TabsTrigger value="projects" className="flex-1 text-xs">Projects</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 text-xs">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-4">
            <ProjectsManager />
          </TabsContent>
          <TabsContent value="skills" className="mt-4">
            <SkillsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return session ? <AdminDashboard /> : <LoginForm />;
}
