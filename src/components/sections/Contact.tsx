import { useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import BusinessCard3D from '@/components/3d/BusinessCard3D';

export default function Contact() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  return (
    <section id="contact" className="section-padding bg-transparent relative">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-8">
          <ScrollReveal>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">Hire Me</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Let's Connect
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Tap the card to book a coffee chat.
            </p>
          </ScrollReveal>
        </div>

        {/* 3D Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className="w-full h-[440px] md:h-[520px] relative"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Loading card…
              </div>
            }
          >
            <BusinessCard3D isFlipped={isFlipped} onFlip={handleFlip} />
          </Suspense>
        </motion.div>

        {/* Social links */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="https://github.com/PratikBalaji"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-foreground text-sm font-medium transition-all hover:border-accent/40 hover:shadow-[0_0_20px_hsl(270_100%_64%/0.15)]"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/pratikbalaji"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-foreground text-sm font-medium transition-all hover:border-accent/40 hover:shadow-[0_0_20px_hsl(270_100%_64%/0.15)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
