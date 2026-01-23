import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import whitehatjrLogo from '@/assets/whitehatjr-logo.png';
import santanderLogo from '@/assets/santander-logo.png';
import googleLogo from '@/assets/google-logo.png';
import databricksLogo from '@/assets/databricks-logo.png';
import outskillLogo from '@/assets/outskill-logo.png';

const certifications = [
  {
    title: 'Android/iOS Development',
    issuer: 'White Hat Jr',
    year: '2020',
    credentialId: 'WHJ-AID-2020-XXXX',
    logo: whitehatjrLogo,
  },
  {
    title: 'Game Development',
    issuer: 'White Hat Jr',
    year: '2020',
    credentialId: 'WHJ-GD-2020-XXXX',
    logo: whitehatjrLogo,
  },
  {
    title: 'Python Certification',
    issuer: 'Santander',
    year: '2024',
    credentialId: 'SAN-PY-2024-XXXX',
    logo: santanderLogo,
  },
  {
    title: 'Intro to Data Science',
    issuer: 'Santander',
    year: '2024',
    credentialId: 'OA-2024-1204000684994',
    logo: santanderLogo,
  },
  {
    title: 'AI & Productivity',
    issuer: 'Google',
    year: '2024',
    credentialId: 'OA-2025-0205000790283',
    logo: googleLogo,
  },
  {
    title: 'Generative AI',
    issuer: 'Santander',
    year: '2025',
    credentialId: 'SAN-GAI-2025-XXXX',
    logo: santanderLogo,
  },
  {
    title: 'Gen AI Fundamentals',
    issuer: 'Databricks',
    year: '2025',
    credentialId: 'DBX-GAI-2025-XXXX',
    logo: databricksLogo,
  },
  {
    title: 'Generative AI Mastermind Certificate',
    issuer: 'Outskill',
    year: '2025',
    credentialId: 'OSK-GAIM-2025-XXXX',
    logo: outskillLogo,
  },
];

function CertificationCard({ certification, index }: { certification: typeof certifications[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-background rounded-2xl p-6 shadow-soft border border-border hover-lift h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
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

  return (
    <section id="certifications" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Professional Development
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Certifications
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certifications.map((certification, index) => (
            <CertificationCard key={certification.title + certification.issuer} certification={certification} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
