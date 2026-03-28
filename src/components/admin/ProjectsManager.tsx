import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Save, FolderGit2, GripVertical, ExternalLink } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  id: string;
  name: string;
  description: string;
  url: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number | null;
  forks_count: number | null;
  topics: string[] | null;
  sort_order: number | null;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ name: 'New Project', description: 'Project description', sort_order: projects.length })
      .select()
      .single();
    if (error) { toast.error('Failed to add project'); return; }
    if (data) setProjects([...projects, data]);
    toast.success('Project added');
  };

  const handleUpdate = async (project: Project) => {
    setSaving(project.id);
    const { error } = await supabase
      .from('projects')
      .update({
        name: project.name,
        description: project.description,
        url: project.url,
        homepage: project.homepage,
        language: project.language,
        stargazers_count: project.stargazers_count,
        forks_count: project.forks_count,
        topics: project.topics,
        sort_order: project.sort_order,
      })
      .eq('id', project.id);
    setSaving(null);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Project saved');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted');
  };

  const updateField = (id: string, field: keyof Project, value: unknown) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Projects</p>
            <p className="text-xs text-muted-foreground">{projects.length} projects</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8 text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add
        </Button>
      </div>

      {projects.map((project) => (
        <Card key={project.id} className="border-border/20 bg-card/40 backdrop-blur-xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripVertical className="w-3.5 h-3.5" />
                <Input
                  value={project.sort_order ?? 0}
                  onChange={(e) => updateField(project.id, 'sort_order', parseInt(e.target.value) || 0)}
                  className="w-14 h-7 text-xs bg-background/50 border-border/30 text-center"
                  type="number"
                />
              </div>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" onClick={() => handleUpdate(project)} disabled={saving === project.id} className="h-7 px-2 text-xs">
                  <Save className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="h-7 px-2 text-xs text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Input
              value={project.name}
              onChange={(e) => updateField(project.id, 'name', e.target.value)}
              className="h-8 bg-background/50 border-border/30 text-sm font-medium"
              placeholder="Project name"
            />
            <Textarea
              value={project.description}
              onChange={(e) => updateField(project.id, 'description', e.target.value)}
              className="min-h-[60px] bg-background/50 border-border/30 text-xs resize-y"
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={project.url ?? ''}
                onChange={(e) => updateField(project.id, 'url', e.target.value || null)}
                className="h-7 bg-background/50 border-border/30 text-xs"
                placeholder="GitHub URL"
              />
              <Input
                value={project.homepage ?? ''}
                onChange={(e) => updateField(project.id, 'homepage', e.target.value || null)}
                className="h-7 bg-background/50 border-border/30 text-xs"
                placeholder="Live URL"
              />
              <Input
                value={project.language ?? ''}
                onChange={(e) => updateField(project.id, 'language', e.target.value || null)}
                className="h-7 bg-background/50 border-border/30 text-xs"
                placeholder="Language"
              />
              <Input
                value={project.topics?.join(', ') ?? ''}
                onChange={(e) => updateField(project.id, 'topics', e.target.value ? e.target.value.split(',').map(t => t.trim()) : null)}
                className="h-7 bg-background/50 border-border/30 text-xs"
                placeholder="Topics (comma-separated)"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={project.stargazers_count ?? 0}
                onChange={(e) => updateField(project.id, 'stargazers_count', parseInt(e.target.value) || 0)}
                className="h-7 bg-background/50 border-border/30 text-xs"
                placeholder="Stars"
                type="number"
              />
              <Input
                value={project.forks_count ?? 0}
                onChange={(e) => updateField(project.id, 'forks_count', parseInt(e.target.value) || 0)}
                className="h-7 bg-background/50 border-border/30 text-xs"
                placeholder="Forks"
                type="number"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
