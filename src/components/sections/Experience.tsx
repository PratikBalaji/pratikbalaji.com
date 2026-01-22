import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import yanItLogo from '@/assets/yan-it-logo.png';
import regalLogo from '@/assets/regal-logo.png';

const experiences = [
  {
    title: 'IoT Data Solutions Developer',
    company: 'Yan IT Solution',
    location: 'Remote',
    period: 'July 2025 – September 2025',
    description: 'Built Python pipelines to process IoT sensor data from MongoDB, monitor device health, and predict refill needs with machine learning (Linear Regression). Developed a FastAPI-based web service and dashboard (Chart.js) for real-time health status and refill trend visualization. Deployed solutions to Azure App Services with secure configuration and scalable design.',
    highlights: ['Python', 'MongoDB', 'FastAPI', 'Chart.js', 'Azure', 'Machine Learning'],
    logo: yanItLogo,
  },
  {
    title: 'Customer Service Associate',
    company: 'Regal Cinemas',
    location: 'Downingtown, PA',
    period: 'Aug 2023 – May 2024',
    description: 'Operated registers for ticket and concession sales, maintaining accuracy and speed during peak hours. Prepared and served food while following strict health and safety regulations. Conducted theater inspections to maintain cleanliness, guest comfort, and safety standards.',
    highlights: ['Customer Service', 'POS Systems', 'Food Safety', 'Team Collaboration'],
    logo: regalLogo,
  },
];

function ExperienceCard({ experience, index }: { experience: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block" style={{ left: '50%' }} />
      
      <div className={`lg:grid lg:grid-cols-2 lg:gap-12 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
        {/* Content */}
        <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:pl-12'}`}>
          <div className="bg-background rounded-2xl p-6 md:p-8 shadow-soft border border-border hover-lift">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo box */}
              <div className="flex-shrink-0">
                {experience.logo ? (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white flex items-center justify-center p-2 border border-border">
                    <img src={experience.logo} alt={`${experience.company} logo`} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center hover:border-primary/50 transition-colors">
                    <Briefcase className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{experience.period}</span>
                </div>
                
                <h3 className="font-display text-xl md:text-2xl font-bold mb-1">
                  {experience.title}
                </h3>
                
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{experience.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{experience.location}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {experience.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {experience.highlights.map((highlight) => (
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
          </div>
        </div>
        
        {/* Timeline dot */}
        <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="section-padding" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Career Journey
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Work Experience
          </h2>
        </motion.div>
        
        <div className="space-y-8 lg:space-y-12 relative">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.title} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
