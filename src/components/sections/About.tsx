import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, Suspense, lazy } from 'react';

const InteractiveSphere = lazy(() => import('@/components/3d/InteractiveSphere'));

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 3D Element */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-square max-w-md mx-auto lg:max-w-none"
          >
            <Suspense fallback={
              <div className="w-full h-full bg-gradient-to-br from-secondary to-background rounded-3xl animate-pulse" />
            }>
              <InteractiveSphere />
            </Suspense>
          </motion.div>
          
          {/* Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
            >
              About Me
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Crafting solutions through strategic thinking and clean code.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground mb-6"
            >
              As a dedicated software developer, I collaborate closely with teams 
              to build seamless, user-centered applications. I serve as a reliable 
              partner in bringing innovative ideas to life through technology.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground mb-8"
            >
              With expertise in full-stack development, I specialize in creating 
              scalable applications using modern technologies. My approach combines 
              technical excellence with a deep understanding of user needs.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <div className="px-6 py-3 bg-background rounded-full shadow-soft border border-border">
                <span className="font-display font-semibold">5+</span>
                <span className="text-muted-foreground ml-2">Projects Completed</span>
              </div>
              <div className="px-6 py-3 bg-background rounded-full shadow-soft border border-border">
                <span className="font-display font-semibold">3+</span>
                <span className="text-muted-foreground ml-2">Years Experience</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
