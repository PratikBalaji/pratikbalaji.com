import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { ExternalLink, Linkedin, Briefcase, TrendingUp } from 'lucide-react';

type LinkedInPost = {
  id: string;
  title: string;
  snippet: string;
  icon: 'briefcase' | 'trending';
  date: string;
};

const posts: LinkedInPost[] = [
  {
    id: '1',
    title: 'J.P. Morgan Quantitative Research Simulation',
    snippet:
      'Wrapped up the J.P. Morgan Quantitative Research job simulation on Forage — built Python models to assess credit risk, estimated default probabilities on a massive loan book, and used dynamic programming to bucket FICO scores into risk categories.',
    icon: 'trending',
    date: 'Recent',
  },
  {
    id: '2',
    title: 'Accepted Offer — Auxilior Capital Partners',
    snippet:
      "Excited to share that I've officially accepted an offer for the 2026 Intern Program at Auxilior Capital Partners as an IT intern, applying data science and machine learning to real-world financial tech solutions.",
    icon: 'briefcase',
    date: 'Recent',
  },
];

const iconMap = {
  briefcase: Briefcase,
  trending: TrendingUp,
};

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

        {/* Post Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {posts.map((post, i) => {
            const Icon = iconMap[post.icon];
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: 0.3 + i * 0.15,
                }}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-accent/30 hover:shadow-[var(--electric-glow)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1.5">{post.date}</p>
                    <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {post.snippet}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
