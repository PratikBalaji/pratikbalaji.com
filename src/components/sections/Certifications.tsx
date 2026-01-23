import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Folder, FolderOpen, ExternalLink } from 'lucide-react';
import whitehatjrLogo from '@/assets/whitehatjr-logo.png';
import santanderLogo from '@/assets/santander-logo.png';
import googleLogo from '@/assets/google-logo.png';
import databricksLogo from '@/assets/databricks-logo.png';
import outskillLogo from '@/assets/outskill-logo.png';

type Category = 'AI' | 'Development' | 'Data Science';

interface Certification {
  title: string;
  issuer: string;
  logo: string;
  category: Category;
  credentialUrl?: string;
}

const certifications: Certification[] = [
  {
    title: 'Android/iOS Development',
    issuer: 'White Hat Jr',
    logo: whitehatjrLogo,
    category: 'Development',
  },
  {
    title: 'Game Development',
    issuer: 'White Hat Jr',
    logo: whitehatjrLogo,
    category: 'Development',
  },
  {
    title: 'Python Certification',
    issuer: 'Santander',
    logo: santanderLogo,
    category: 'Development',
  },
  {
    title: 'Intro to Data Science',
    issuer: 'Santander',
    logo: santanderLogo,
    category: 'Data Science',
  },
  {
    title: 'AI & Productivity',
    issuer: 'Google',
    logo: googleLogo,
    category: 'AI',
  },
  {
    title: 'Generative AI',
    issuer: 'Santander',
    logo: santanderLogo,
    category: 'AI',
  },
  {
    title: 'Gen AI Fundamentals',
    issuer: 'Databricks',
    logo: databricksLogo,
    category: 'AI',
  },
  {
    title: 'Generative AI Mastermind Certificate',
    issuer: 'Outskill',
    logo: outskillLogo,
    category: 'AI',
  },
];

const folderColors: Record<Category, { bg: string; accent: string; tab: string }> = {
  'AI': { 
    bg: 'from-violet-500/20 to-purple-600/20', 
    accent: 'border-violet-500/50',
    tab: 'bg-violet-500'
  },
  'Development': { 
    bg: 'from-emerald-500/20 to-teal-600/20', 
    accent: 'border-emerald-500/50',
    tab: 'bg-emerald-500'
  },
  'Data Science': { 
    bg: 'from-amber-500/20 to-orange-600/20', 
    accent: 'border-amber-500/50',
    tab: 'bg-amber-500'
  },
};

function CertificationCard({ certification, index }: { certification: Certification; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="bg-background rounded-xl p-4 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 border border-border overflow-hidden">
            <img 
              src={certification.logo} 
              alt={`${certification.issuer} logo`} 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Title and Issuer */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight mb-0.5 group-hover:text-primary transition-colors truncate">
              {certification.title}
            </h4>
            <p className="text-muted-foreground text-xs">{certification.issuer}</p>
          </div>
        </div>

        {/* Hover overlay with View Credential button */}
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
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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
  const colors = folderColors[category];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Folder */}
      <motion.div
        animate={{ 
          scale: isOpen ? 1.02 : 1,
          y: isOpen ? -5 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative cursor-pointer"
      >
        {/* Folder Tab */}
        <div className={`absolute -top-3 left-4 w-24 h-5 ${colors.tab} rounded-t-lg`} />
        
        {/* Folder Body */}
        <div className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm border-2 ${colors.accent} rounded-xl p-6 min-h-[180px] transition-all duration-300`}>
          {/* Folder Icon and Label */}
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ rotateY: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <FolderOpen className="w-16 h-16 text-foreground/70 mb-3" />
              ) : (
                <Folder className="w-16 h-16 text-foreground/70 mb-3" />
              )}
            </motion.div>
            <h3 className="font-display text-xl font-bold text-center">{category}</h3>
            <p className="text-sm text-muted-foreground mt-1">{certs.length} certificates</p>
          </div>

          {/* Decorative folder lines */}
          <div className="absolute top-4 right-4 w-8 h-1 bg-foreground/10 rounded" />
          <div className="absolute top-7 right-4 w-6 h-1 bg-foreground/10 rounded" />
        </div>
      </motion.div>

      {/* Popped out certifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 pt-4"
          >
            <div className="bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-2xl p-4 space-y-3">
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

  const categories: Category[] = ['AI', 'Development', 'Data Science'];
  
  const getCertsByCategory = (category: Category) => 
    certifications.filter(cert => cert.category === category);

  return (
    <section id="certifications" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Professional Development
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Certifications
          </h2>
          <p className="text-muted-foreground">Hover over a folder to explore certificates</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <CertificationFolder 
                category={category} 
                certs={getCertsByCategory(category)} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
