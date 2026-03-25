import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { ExternalLink, Linkedin, ThumbsUp, MessageCircle, Repeat2, Send, Globe } from 'lucide-react';

type LinkedInPost = {
  id: string;
  title: string;
  body: string;
  date: string;
  likes: number;
  comments: number;
  reposts: number;
};

const posts: LinkedInPost[] = [
  {
    id: '1',
    title: 'J.P. Morgan Quantitative Research Simulation',
    body: `I just wrapped up the J.P. Morgan Quantitative Research job simulation on Forage, and it was a fantastic dive into the real-world challenges quants face every day.\n\nRather than just reading about financial modeling, I actually got to build tools to assess credit risk. One of the most interesting parts was taking a massive book of loans and writing a Python model to estimate the probability of a customer defaulting. I even used dynamic programming to group FICO scores into risk categories, which really showed me how much math and coding go into protecting a bank from financial risk.\n\nIt was an incredibly rewarding way to bridge the gap between classroom theory and real-world application.`,
    date: 'Recent',
    likes: 24,
    comments: 3,
    reposts: 1,
  },
  {
    id: '2',
    title: 'Accepted Offer — Auxilior Capital Partners',
    body: `I am excited to share that I have officially accepted an offer for the 2026 Intern Program at Auxilior Capital Partners, Inc.\n\nStarting this May, I will be joining as an IT intern, where I will have the opportunity to apply my background in data science and machine learning to real-world challenges in this role. I look forward to developing my technical skills and contributing to impactful financial tech solutions.\n\nI am incredibly grateful for this opportunity and excited to begin my journey at Auxilior Capital Partners, Inc.`,
    date: 'Recent',
    likes: 47,
    comments: 8,
    reposts: 2,
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

        {/* LinkedIn-style Post Cards */}
        <div className="flex flex-col gap-6 max-w-2xl mx-auto mb-12">
          {posts.map((post, i) => (
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
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Post header — mimics LinkedIn author row */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-lg shrink-0">
                  PB
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">Pratik Balaji</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                    Data Science & Machine Learning
                  </p>
                  <p className="text-xs text-muted-foreground/70 leading-tight mt-0.5 flex items-center gap-1">
                    {post.date} · <Globe className="w-3 h-3 inline" />
                  </p>
                </div>
              </div>

              {/* Post body */}
              <div className="px-5 pb-3">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed line-clamp-6">
                  {post.body}
                </p>
              </div>

              {/* Engagement counts */}
              <div className="flex items-center justify-between px-5 py-2 text-xs text-muted-foreground border-b border-border">
                <span className="flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]">👍</span>
                  {post.likes}
                </span>
                <span>
                  {post.comments} comments · {post.reposts} reposts
                </span>
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-around px-2 py-1.5">
                {[
                  { icon: ThumbsUp, label: 'Like' },
                  { icon: MessageCircle, label: 'Comment' },
                  { icon: Repeat2, label: 'Repost' },
                  { icon: Send, label: 'Send' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-colors cursor-default"
                    tabIndex={-1}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
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