import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Folder, FolderOpen, ExternalLink } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import whitehatjrLogo from '@/assets/whitehatjr-logo.png';
import santanderLogo from '@/assets/santander-logo.png';
import googleLogo from '@/assets/google-logo.png';
import databricksLogo from '@/assets/databricks-logo.png';
import outskillLogo from '@/assets/outskill-logo.png';
import linkedinLogo from '@/assets/linkedin-logo.png';
import jpmorganLogo from '@/assets/jpmorgan-logo.png';
import anthropicLogo from '@/assets/anthropic-logo.png';

type Category = 'AI' | 'Development' | 'Data Science' | 'Database' | 'Finance';

interface Certification {
  title: string;
  issuer: string;
  logo: string;
  category: Category;
  credentialUrl?: string;
}

const certifications: Certification[] = [
  { title: 'Android/iOS Development', issuer: 'White Hat Jr', logo: whitehatjrLogo, category: 'Development' },
  { title: 'Game Development', issuer: 'White Hat Jr', logo: whitehatjrLogo, category: 'Development' },
  { title: 'Python Certification', issuer: 'Santander', logo: santanderLogo, category: 'Development' },
  { title: 'Intro to Data Science', issuer: 'Santander', logo: santanderLogo, category: 'Data Science' },
  { title: 'AI & Productivity', issuer: 'Google', logo: googleLogo, category: 'AI' },
  { title: 'Generative AI', issuer: 'Santander', logo: santanderLogo, category: 'AI' },
  { title: 'Gen AI Fundamentals', issuer: 'Databricks', logo: databricksLogo, category: 'AI' },
  { title: 'AI Agent Fundamentals', issuer: 'Databricks', logo: databricksLogo, category: 'AI' },
  { title: 'Generative AI Mastermind Certificate', issuer: 'Outskill', logo: outskillLogo, category: 'AI' },
  { title: 'SQL Essential Training', issuer: 'LinkedIn', logo: linkedinLogo, category: 'Database' },
  { title: 'Quantitative Research', issuer: 'J.P. Morgan (Forage)', logo: jpmorganLogo, category: 'Finance' },
  { title: 'Software Engineering', issuer: 'J.P. Morgan (Forage)', logo: jpmorganLogo, category: 'Development' },
  { title: 'Claude Code In Action', issuer: 'Anthropic', logo: anthropicLogo, category: 'AI' },
];

function CertificationCard({ certification, index }: { certification: Certification; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
        <div className="rounded-xl p-4 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
            <img src={certification.logo} alt={`${certification.issuer} logo`} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight mb-0.5 text-foreground group-hover:text-accent transition-colors truncate">
              {certification.title}
            </h4>
            <p className="text-muted-foreground text-xs">{certification.issuer}</p>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Credential
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CertificationFolder({ category, certs }: { category: Category; certs: Certification[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.div
        animate={{ scale: isOpen ? 1.02 : 1, y: isOpen ? -5 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative cursor-pointer"
      >
        <div className="absolute -top-3 left-4 w-24 h-5 bg-accent rounded-t-lg" />
        
        <div className="relative rounded-xl p-6 min-h-[180px] transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ rotateY: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <FolderOpen className="w-16 h-16 text-accent mb-3" />
              ) : (
                <Folder className="w-16 h-16 text-muted-foreground mb-3" />
              )}
            </motion.div>
            <h3 className="font-display text-xl font-bold text-center [text-shadow:0_0_10px_hsl(var(--accent)/0.5),0_0_25px_hsl(var(--accent)/0.2)] text-foreground">{category}</h3>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 z-50 pt-4"
          >
            <div className="backdrop-blur-xl rounded-xl p-4 space-y-3">
              {certs.map((cert, index) => (
                <CertificationCard key={cert.title} certification={cert} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Certifications() {
  const ref = useRef(null);
  const categories: Category[] = ['AI', 'Development', 'Data Science', 'Database', 'Finance'];
  const getCertsByCategory = (category: Category) => certifications.filter(cert => cert.category === category);

  return (
    <section id="certifications" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
            Professional Development
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Certifications
          </h2>
          <p className="text-muted-foreground">Hover over a folder to explore certificates</p>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {categories.map((category, index) => (
            <ScrollReveal key={category} delay={index * 0.15}>
              <CertificationFolder category={category} certs={getCertsByCategory(category)} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
