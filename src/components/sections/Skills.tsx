import { motion, useInView } from 'framer-motion';
import { useRef, Suspense, lazy } from 'react';

const SkillsGlobe = lazy(() => import('@/components/3d/SkillsGlobe'));

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Three.js'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL'],
  },
  {
    title: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux'],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
          {/* 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <Suspense fallback={
              <div className="w-full h-[500px] bg-gradient-to-br from-secondary to-background rounded-3xl animate-pulse flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-foreground/10 animate-pulse" />
              </div>
            }>
              <SkillsGlobe />
            </Suspense>
          </motion.div>
          
          {/* Skills List */}
          <div className="order-1 lg:order-2 space-y-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + catIndex * 0.15 }}
              >
                <h3 className="font-display text-xl font-bold mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
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
