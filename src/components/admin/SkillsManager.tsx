import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Sparkles, GripVertical } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  sort_order: number | null;
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('category')
      .order('sort_order', { ascending: true });
    if (data) setSkills(data);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('skills')
      .insert({ name: 'New Skill', category: 'General', sort_order: skills.length })
      .select()
      .single();
    if (error) { toast.error('Failed to add skill'); return; }
    if (data) setSkills([...skills, data]);
    toast.success('Skill added');
  };

  const handleUpdate = async (skill: Skill) => {
    setSaving(skill.id);
    const { error } = await supabase
      .from('skills')
      .update({ name: skill.name, category: skill.category, icon: skill.icon, sort_order: skill.sort_order })
      .eq('id', skill.id);
    setSaving(null);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Skill saved');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    setSkills(skills.filter(s => s.id !== id));
    toast.success('Skill deleted');
  };

  const updateField = (id: string, field: keyof Skill, value: unknown) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Group skills by category
  const categories = [...new Set(skills.map(s => s.category))];

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Skills</p>
            <p className="text-xs text-muted-foreground">{skills.length} skills across {categories.length} categories</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8 text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add
        </Button>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">{category}</p>
          {skills.filter(s => s.category === category).map((skill) => (
            <Card key={skill.id} className="border-border/20 bg-card/40 backdrop-blur-xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <Input
                    value={skill.sort_order ?? 0}
                    onChange={(e) => updateField(skill.id, 'sort_order', parseInt(e.target.value) || 0)}
                    className="w-12 h-7 text-xs bg-background/50 border-border/30 text-center"
                    type="number"
                  />
                  <Input
                    value={skill.name}
                    onChange={(e) => updateField(skill.id, 'name', e.target.value)}
                    className="h-7 bg-background/50 border-border/30 text-xs flex-1"
                    placeholder="Skill name"
                  />
                  <Input
                    value={skill.category}
                    onChange={(e) => updateField(skill.id, 'category', e.target.value)}
                    className="h-7 bg-background/50 border-border/30 text-xs w-28"
                    placeholder="Category"
                  />
                  <Input
                    value={skill.icon ?? ''}
                    onChange={(e) => updateField(skill.id, 'icon', e.target.value || null)}
                    className="h-7 bg-background/50 border-border/30 text-xs w-20"
                    placeholder="Icon"
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleUpdate(skill)} disabled={saving === skill.id} className="h-7 px-2">
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)} className="h-7 px-2 text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
