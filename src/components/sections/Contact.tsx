import { useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import BusinessCard3D from '@/components/3d/BusinessCard3D';
import githubLogo from '@/assets/google-logo.png';
import linkedinLogo from '@/assets/linkedin-logo.png';

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

        {/* Social links with logos and glassy style */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="https://github.com/PratikBalaji"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 rounded-2xl transition-all hover:shadow-[0_0_20px_hsl(270_100%_64%/0.12)]"
          >
            <svg className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/pratikbalaji"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md transition-all hover:border-accent/40 hover:bg-card/50 hover:shadow-[0_0_20px_hsl(270_100%_64%/0.12)]"
          >
            <svg className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
