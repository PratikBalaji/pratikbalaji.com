import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Animated sphere fallback - no WebGL */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-square max-w-md mx-auto lg:max-w-none flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Animated rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 border-2 border-foreground/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 border border-foreground/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-40 h-40 border border-foreground/10 rounded-full"
              />
              
              {/* Center sphere */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 60px rgba(0,0,0,0.1)',
                    '0 0 80px rgba(0,0,0,0.15)',
                    '0 0 60px rgba(0,0,0,0.1)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 bg-gradient-to-br from-foreground to-foreground/80 rounded-full"
              />
              
              {/* Orbiting dots */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground/60 rounded-full" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-80 h-80"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/40 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
            >
              About Me
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Crafting solutions through strategic thinking and clean code.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground mb-6"
            >
              As a dedicated software developer, I collaborate closely with teams 
              to build seamless, user-centered applications. I serve as a reliable 
              partner in bringing innovative ideas to life through technology.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground mb-8"
            >
              With expertise in full-stack development, I specialize in creating 
              scalable applications using modern technologies. My approach combines 
              technical excellence with a deep understanding of user needs.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
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
