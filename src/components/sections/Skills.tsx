import { motion } from 'framer-motion';

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
];

const allSkills = skillCategories.flatMap(cat => cat.skills);

export default function Skills() {
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
          {/* Animated Globe Fallback - CSS only */}
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
              
              {/* Skill nodes orbiting */}
              {allSkills.slice(0, 8).map((skill, i) => {
                const angle = (i / 8) * 360;
                const radius = 130;
                return (
                  <motion.div
                    key={skill}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30 + i * 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2"
                    style={{ 
                      width: radius * 2,
                      height: radius * 2,
                      marginLeft: -radius,
                      marginTop: -radius
                    }}
                  >
                    <div 
                      className="absolute px-3 py-1.5 bg-background border border-border rounded-full text-xs font-medium shadow-sm"
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
              
              {/* Center core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-foreground rounded-full"
                />
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
              >
                <h3 className="font-display text-xl font-bold mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + catIndex * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 bg-background border border-border rounded-full text-sm font-medium shadow-soft cursor-default transition-shadow hover:shadow-medium"
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
