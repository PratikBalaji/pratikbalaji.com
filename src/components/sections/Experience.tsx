import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, BarChart3, Code2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import yanItLogo from '@/assets/yan-it-logo.png';
import natarajBeatsLogo from '@/assets/nataraj-beats-logo.png';

type ViewMode = 'technical' | 'business';

const experiences = [
  {
    title: 'IoT Python Developer',
    company: 'Yan IT Solution',
    location: 'Remote',
    period: 'July 2025 – September 2025',
    technical: 'Built Python pipelines to process IoT sensor data from MongoDB, monitor device health, and predict refill needs with machine learning (Linear Regression). Developed a FastAPI-based web service and dashboard (Chart.js) for real-time health status and refill trend visualization. Deployed solutions to Azure App Services with secure configuration and scalable design.',
    business: 'Situation: IoT devices lacked centralized health monitoring. Task: Build a real-time monitoring and prediction system. Action: Designed end-to-end data pipelines and predictive dashboards. Result: Automated device monitoring, saving ~15 hours/week of manual checks and enabling proactive refill scheduling.',
    technicalHighlights: ['Python', 'MongoDB', 'FastAPI', 'Chart.js', 'Azure', 'Machine Learning'],
    businessHighlights: ['Process Automation', 'Cost Reduction', 'Predictive Analytics', 'Scalable Architecture'],
    logo: yanItLogo,
  },
  {
    title: 'DJ Assistant',
    company: 'Nataraj Beats',
    location: 'Philadelphia, PA',
    period: 'Mar 2025 – December 2025',
    technical: 'Supported live event setup, including sound system configuration, lighting, and playlist coordination. Assisted with mixing tracks and crowd engagement, enhancing the overall entertainment experience. Designed and launched a professional website for Nataraj Beats to showcase their services and enhance client engagement.',
    business: 'Situation: Business lacked online presence and professional branding. Task: Establish digital footprint and streamline event operations. Action: Built a responsive website and optimized event workflows. Result: Increased client engagement by 40% through web optimization and streamlined booking pipeline.',
    technicalHighlights: ['Live Events', 'Sound Systems', 'Web Development', 'Client Engagement'],
    businessHighlights: ['Client Growth +40%', 'Brand Development', 'Digital Transformation', 'Revenue Pipeline'],
    logo: natarajBeatsLogo,
    link: 'https://natarajbeats.com/',
  },
];

function RecruiterToggle({ mode, onToggle }: { mode: ViewMode; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-full px-2 py-1.5">
      <button
        onClick={mode === 'business' ? onToggle : undefined}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          mode === 'technical' ? 'bg-accent text-accent-foreground shadow-[var(--electric-glow)]' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Technical
      </button>
      <button
        onClick={mode === 'technical' ? onToggle : undefined}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          mode === 'business' ? 'bg-accent text-accent-foreground shadow-[var(--electric-glow)]' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Business Impact
      </button>
    </div>
  );
}

function ExperienceCard({ experience, index, mode }: { experience: typeof experiences[0]; index: number; mode: ViewMode }) {
  const description = mode === 'technical' ? experience.technical : experience.business;
  const highlights = mode === 'technical' ? experience.technicalHighlights : experience.businessHighlights;

  return (
    <ScrollReveal delay={index * 0.15} direction={index % 2 === 0 ? 'left' : 'right'} distance={40} className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block" style={{ left: '50%' }} />
      <div className={`lg:grid lg:grid-cols-2 lg:gap-12 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
        <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:pl-12'}`}>
          <TiltCard className="relative rounded-2xl">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-accent/40 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {experience.logo ? (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-muted flex items-center justify-center p-2 border border-border">
                      <img src={experience.logo} alt={`${experience.company} logo`} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{experience.period}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-1 text-foreground">{experience.title}</h3>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-accent" /><span>{experience.company}</span></div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent" /><span>{experience.location}</span></div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={mode}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className="text-muted-foreground mb-4"
                    >
                      {description}
                    </motion.p>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode + '-tags'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-wrap gap-2"
                    >
                      {highlights.map((highlight, i) => (
                        <motion.span
                          key={highlight}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 }}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            mode === 'business'
                              ? 'bg-accent/10 text-accent border-accent/30'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}
                        >
                          {highlight}
                        </motion.span>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
        <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background shadow-[var(--electric-glow)]" />
      </div>
    </ScrollReveal>
  );
}

export default function Experience() {
  const [mode, setMode] = useState<ViewMode>('technical');

  return (
    <section id="experience" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">Career Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">Experience</h2>
          <RecruiterToggle mode={mode} onToggle={() => setMode(m => m === 'technical' ? 'business' : 'technical')} />
        </ScrollReveal>

        <div className="space-y-8 lg:space-y-12 relative">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.title} experience={experience} index={index} mode={mode} />
          ))}
        </div>
      </div>
    </section>
  );
}
