import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { ExternalLink, Linkedin } from 'lucide-react';

const embeds = [
  {
    id: '1',
    src: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7441918594923458560',
    title: 'Embedded post',
    height: 880,
  },
  {
    id: '2',
    src: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7434368685231738881',
    title: 'Embedded post',
    height: 880,
  },
];

export default function LinkedInPosts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="linkedin" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              Latest Updates
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              LinkedIn Highlights
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recent milestones, projects, and professional updates from my journey.
            </p>
          </ScrollReveal>
        </div>

        {/* Embedded LinkedIn Posts */}
        <div className="flex flex-col md:flex-row md:justify-center items-center gap-8 mb-12">
          {embeds.map((embed, i) => (
            <motion.div
              key={embed.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
                delay: 0.3 + i * 0.15,
              }}
              className="w-full max-w-[504px] rounded-xl overflow-hidden border border-accent/40 shadow-[0_0_30px_-5px_hsl(var(--accent)/0.3)]"
            >
              <iframe
                src={embed.src}
                height={embed.height}
                width={504}
                frameBorder="0"
                allowFullScreen
                title={embed.title}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}
          className="text-center"
        >
          <a
            href="https://www.linkedin.com/in/pratikbalaji/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-xl hover:shadow-[var(--electric-glow)] transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <Linkedin className="w-4 h-4" />
            View All Posts on LinkedIn
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}