import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/integrations/supabase/client';

type Skill = { id: string; category: string; name: string; sort_order: number };
type SkillCategory = { title: string; skills: string[] };

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order');

      if (!error && data) {
        const grouped: Record<string, string[]> = {};
        const order: string[] = [];
        (data as Skill[]).forEach(s => {
          if (!grouped[s.category]) { grouped[s.category] = []; order.push(s.category); }
          grouped[s.category].push(s.name);
        });
        setSkillCategories(order.map(cat => ({ title: cat, skills: grouped[cat] })));
      }
      setLoading(false);
    }
    fetchSkills();
  }, []);

  const displayedSkills = selectedCategory !== null ? skillCategories[selectedCategory]?.skills || [] : [];

  return (
    <section id="skills" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">Technical Expertise</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">Skills & Technologies</h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="order-2 lg:order-1 flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              <motion.div animate={{ rotateY: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
                <motion.div className="absolute inset-0 border-2 rounded-full transition-colors duration-500" style={{ borderColor: selectedCategory !== null ? 'hsl(330 90% 60%)' : 'hsl(0 0% 14%)', boxShadow: selectedCategory !== null ? '0 0 25px hsl(330 90% 60% / 0.3)' : 'none' }} />
              </motion.div>
              <motion.div animate={{ rotateX: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-8">
                <div className="w-full h-full border-2 rounded-full transition-colors duration-500" style={{ borderColor: selectedCategory !== null ? 'hsl(200 100% 55% / 0.7)' : 'hsl(0 0% 14%)' }} />
              </motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute inset-16">
                <div className="w-full h-full border-2 rounded-full transition-colors duration-500" style={{ borderColor: selectedCategory !== null ? 'hsl(160 80% 50% / 0.5)' : 'hsl(0 0% 14%)' }} />
              </motion.div>

              <AnimatePresence mode="wait">
                {displayedSkills.length > 0 && (
                  <motion.div key={selectedCategory} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="absolute inset-0">
                    {displayedSkills.map((skill, i) => {
                      const angle = (i / displayedSkills.length) * 360;
                      const radius = 130;
                      return (
                        <motion.div key={skill} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: 360 }}
                          transition={{ opacity: { duration: 0.3, delay: i * 0.05 }, scale: { type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 }, rotate: { duration: 30 + i * 2, repeat: Infinity, ease: "linear" } }}
                          className="absolute top-1/2 left-1/2" style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}>
                          <div className="absolute px-3 py-1.5 rounded-full text-xs font-medium text-foreground whitespace-nowrap"
                            style={{ top: '50%', left: '50%', transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg) translate(-50%, -50%)` }}>
                            {skill}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.1, 1] }}
                  transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    background: selectedCategory !== null
                      ? 'linear-gradient(135deg, hsl(330 90% 60%), hsl(270 100% 64%), hsl(200 100% 55%))'
                      : 'hsl(0 0% 92%)',
                    boxShadow: selectedCategory !== null
                      ? '0 0 35px hsl(270 100% 64% / 0.4), 0 0 15px hsl(330 90% 60% / 0.3), 0 0 15px hsl(200 100% 55% / 0.3)'
                      : 'none'
                  }}>
                  {selectedCategory === null && <span className="text-background text-[10px] font-medium text-center px-1">Click a category</span>}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Skills List */}
          <div className="order-1 lg:order-2 space-y-4">
            {loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="rounded-xl p-5 animate-pulse">
                  <div className="h-5 w-40 bg-muted rounded mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-7 w-20 bg-muted rounded-full" />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              skillCategories.map((category, catIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: catIndex * 0.08 }}
                  onClick={() => setSelectedCategory(selectedCategory === catIndex ? null : catIndex)}
                  className={`cursor-pointer p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                    selectedCategory === catIndex
                      ? 'shadow-[var(--electric-glow)]'
                      : ''
                  }`}
                >
                  <h3 className={`font-display text-lg font-bold mb-4 transition-colors ${selectedCategory === catIndex ? 'text-accent' : 'text-foreground'}`}>
                    {category.title}
                    {selectedCategory === catIndex && <span className="ml-2 text-xs font-normal text-muted-foreground">(active)</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: catIndex * 0.05 + skillIndex * 0.03 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`px-3 py-1.5 bg-secondary border rounded-full text-sm font-medium cursor-pointer transition-all hover:border-accent/40 ${
                          selectedCategory === catIndex ? 'border-accent/30 text-foreground' : 'border-border text-muted-foreground'
                        }`}>
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
