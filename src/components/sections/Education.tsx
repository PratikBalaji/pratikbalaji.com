import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import templeLogo from '@/assets/temple-logo.png';
import downingtownLogo from '@/assets/downingtown-logo.png';

const education = [
  {
    degree: 'Data Science BS',
    concentration: 'Computational Analytics',
    institution: 'Temple University',
    location: 'Philadelphia, PA',
    period: 'Present',
    description: 'Data science undergraduate at Temple University with a concentration in Computational Analytics. Technically proficient in leveraging statistical methods and algorithmic approaches to derive insights from complex datasets. A collaborative team player with strong communication skills developed through competitive participation in the Research Scholar Club and the Badminton Club. Eager to apply analytical rigor and computational skills to solve real-world data challenges.',
    highlights: ['Statistical Methods', 'Algorithmic Approaches', 'Data Analysis', 'Research Scholar Club', 'Badminton Club'],
    logo: templeLogo,
  },
  {
    degree: 'High School Diploma',
    concentration: null,
    institution: 'Downingtown East High School',
    location: 'Downingtown, PA',
    period: null,
    description: 'Maintained a high level of engagement across diverse academic and extracurricular platforms. As an active member of FBLA and Student Council, developed foundational skills in professional communication, project coordination, and peer advocacy. Commitment to versatility demonstrated through participation in Track and Field and Guitar Club, cultivating creative collaboration.',
    highlights: ['FBLA', 'Student Council', 'Track and Field'],
    logo: downingtownLogo,
  },
];

function EducationCard({ edu, index }: { edu: typeof education[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-background rounded-2xl p-6 md:p-8 shadow-soft border border-border hover-lift"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo box */}
        <div className="flex-shrink-0">
          {edu.logo ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white flex items-center justify-center p-2 border border-border">
              <img src={edu.logo} alt={`${edu.institution} logo`} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center hover:border-primary/50 transition-colors">
              <GraduationCap className="w-10 h-10 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          {edu.period && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>{edu.period}</span>
            </div>
          )}
          
          <h3 className="font-display text-xl md:text-2xl font-bold mb-1">
            {edu.degree}
          </h3>
          
          {edu.concentration && (
            <p className="text-primary font-medium mb-2">
              {edu.concentration}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>{edu.institution}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{edu.location}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">
            {edu.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {edu.highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="section-padding bg-muted/30" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Academic Background
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Education
          </h2>
        </motion.div>
        
        <div className="space-y-8">
          {education.map((edu, index) => (
            <EducationCard key={edu.institution} edu={edu} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
