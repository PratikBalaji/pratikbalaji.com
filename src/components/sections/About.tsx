import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function About() {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Animated sphere */}
          <ScrollReveal direction="left" delay={0.2}
            className="aspect-square max-w-md mx-auto lg:max-w-none flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 border border-border rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 border border-accent/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-40 h-40 border border-border rounded-full"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 60px hsl(270 100% 64% / 0.1)',
                    '0 0 80px hsl(270 100% 64% / 0.2)',
                    '0 0 60px hsl(270 100% 64% / 0.1)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 bg-gradient-to-br from-accent to-accent/60 rounded-full"
              />
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent/60 rounded-full" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-80 h-80"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-muted-foreground rounded-full" />
              </motion.div>
            </div>
          </ScrollReveal>
          
          <div>
            <ScrollReveal delay={0.1}>
              <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
                About Me
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                Bridging data science and AI to build intelligent solutions.
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <p className="text-lg text-muted-foreground mb-6">
                I'm a student at Temple University's College of Science and Technology, 
                pursuing a degree in Data Science with a specialization in Computational 
                Analytics. My passion lies at the intersection of data and artificial intelligence.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.4}>
              <p className="text-lg text-muted-foreground mb-8">
                As an aspiring AI Generalist, I'm eager to work closely with machine learning 
                and AI technologies—exploring everything from generative models to intelligent 
                agents. I thrive on turning complex data into actionable insights and innovative applications.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.5} className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-card rounded-full border border-border hover:border-accent transition-colors">
                <span className="font-display font-semibold text-foreground">AI/ML</span>
                <span className="text-muted-foreground ml-2">Focused</span>
              </div>
              <div className="px-6 py-3 bg-card rounded-full border border-border hover:border-accent transition-colors">
                <span className="font-display font-semibold text-foreground">Data Science</span>
                <span className="text-muted-foreground ml-2">Major</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
