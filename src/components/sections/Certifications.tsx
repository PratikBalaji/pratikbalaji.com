import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import whitehatjrLogo from '@/assets/whitehatjr-logo.png';
import santanderLogo from '@/assets/santander-logo.png';
import googleLogo from '@/assets/google-logo.png';
import databricksLogo from '@/assets/databricks-logo.png';
import outskillLogo from '@/assets/outskill-logo.png';

type Category = 'All' | 'AI' | 'Development' | 'Data Science';

const categories: Category[] = ['All', 'AI', 'Development', 'Data Science'];

const certifications = [
  {
    title: 'Android/iOS Development',
    issuer: 'White Hat Jr',
    logo: whitehatjrLogo,
    category: 'Development' as Category,
  },
  {
    title: 'Game Development',
    issuer: 'White Hat Jr',
    logo: whitehatjrLogo,
    category: 'Development' as Category,
  },
  {
    title: 'Python Certification',
    issuer: 'Santander',
    logo: santanderLogo,
    category: 'Development' as Category,
  },
  {
    title: 'Intro to Data Science',
    issuer: 'Santander',
    logo: santanderLogo,
    category: 'Data Science' as Category,
  },
  {
    title: 'AI & Productivity',
    issuer: 'Google',
    logo: googleLogo,
    category: 'AI' as Category,
  },
  {
    title: 'Generative AI',
    issuer: 'Santander',
    logo: santanderLogo,
    category: 'AI' as Category,
  },
  {
    title: 'Gen AI Fundamentals',
    issuer: 'Databricks',
    logo: databricksLogo,
    category: 'AI' as Category,
  },
  {
    title: 'Generative AI Mastermind Certificate',
    issuer: 'Outskill',
    logo: outskillLogo,
    category: 'AI' as Category,
  },
];

function CertificationCard({ certification, index }: { certification: typeof certifications[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <div className="bg-background rounded-2xl p-6 shadow-soft border border-border hover-lift h-full flex flex-col">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white flex items-center justify-center p-2 border border-border overflow-hidden">
            <img 
              src={certification.logo} 
              alt={`${certification.issuer} logo`} 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Title and Issuer */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">
              {certification.title}
            </h3>
            <p className="text-muted-foreground text-sm">{certification.issuer}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredCertifications = activeCategory === 'All' 
    ? certifications 
    : certifications.filter(cert => cert.category === activeCategory);

  return (
    <section id="certifications" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Professional Development
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Certifications
          </h2>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCertifications.map((certification, index) => (
              <CertificationCard 
                key={certification.title + certification.issuer} 
                certification={certification} 
                index={index} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
