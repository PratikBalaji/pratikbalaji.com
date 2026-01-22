import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const skillCategories = [
  {
    title: 'Programming Languages',
    skills: ['Python', 'Java', 'SQL', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Frontend & Backend',
    skills: ['React', 'Next.js', 'TailwindCSS', 'Node.js', 'MongoDB', 'PostgreSQL'],
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git', 'Docker', 'AWS', 'Microsoft Office Suite', 'Customer Service Tools'],
  },
  {
    title: 'Core Competencies',
    skills: ['Leadership', 'Decision Making', 'Time Management', 'Team Collaboration', 'Problem-solving'],
  },
  {
    title: 'Languages',
    skills: ['Tamil (Fluent)', 'English (Fluent)', 'Hindi (Fluent)', 'Spanish (Novice)'],
  },
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const displayedSkills = selectedCategory !== null 
    ? skillCategories[selectedCategory].skills 
    : [];

  return (
    <section id="skills" className="section-padding bg-secondary/30">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Technical Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Skills & Technologies
          </h2>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Rotating rings */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <div className="absolute inset-0 border-2 border-foreground/20 rounded-full" />
              </motion.div>
              <motion.div
                animate={{ rotateX: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8"
              >
                <div className="w-full h-full border border-foreground/15 rounded-full" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16"
              >
                <div className="w-full h-full border border-foreground/10 rounded-full" />
              </motion.div>
              
              {/* Skill nodes orbiting - only show when a category is selected */}
              <AnimatePresence mode="wait">
                {displayedSkills.length > 0 && (
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {displayedSkills.map((skill, i) => {
                      const angle = (i / displayedSkills.length) * 360;
                      const radius = 130;
                      return (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1, rotate: 360 }}
                          transition={{ 
                            opacity: { duration: 0.3, delay: i * 0.05 },
                            scale: { duration: 0.3, delay: i * 0.05 },
                            rotate: { duration: 30 + i * 2, repeat: Infinity, ease: "linear" }
                          }}
                          className="absolute top-1/2 left-1/2"
                          style={{ 
                            width: radius * 2,
                            height: radius * 2,
                            marginLeft: -radius,
                            marginTop: -radius
                          }}
                        >
                          <div 
                            className="absolute px-3 py-1.5 bg-background border border-border rounded-full text-xs font-medium shadow-sm whitespace-nowrap"
                            style={{
                              top: '50%',
                              left: '50%',
                              transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg) translate(-50%, -50%)`
                            }}
                          >
                            {skill}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Center core with prompt text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center"
                >
                  {selectedCategory === null && (
                    <span className="text-background text-[10px] font-medium text-center px-1">
                      Click a category
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Skills List */}
          <div className="order-1 lg:order-2 space-y-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 + catIndex * 0.15 }}
                onClick={() => setSelectedCategory(selectedCategory === catIndex ? null : catIndex)}
                className={`cursor-pointer p-4 -m-4 rounded-xl transition-all duration-300 ${
                  selectedCategory === catIndex 
                    ? 'bg-foreground/5 ring-2 ring-foreground/20' 
                    : 'hover:bg-foreground/5'
                }`}
              >
                <h3 className={`font-display text-xl font-bold mb-4 transition-colors ${
                  selectedCategory === catIndex ? 'text-foreground' : ''
                }`}>
                  {category.title}
                  {selectedCategory === catIndex && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">(active)</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + catIndex * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`px-4 py-2 bg-background border rounded-full text-sm font-medium shadow-soft cursor-pointer transition-all hover:shadow-medium ${
                        selectedCategory === catIndex 
                          ? 'border-foreground/30' 
                          : 'border-border'
                      }`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
