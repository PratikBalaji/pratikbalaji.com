import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
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
    description: 'Maintained a high level of engagement across diverse academic and extracurricular platforms. As an active member of FBLA and Student Council, developed foundational skills in professional communication, project coordination, and peer advocacy. Commitment to versatility demonstrated through participation in Track and Field, cultivating creative collaboration.',
    highlights: ['FBLA', 'Student Council', 'Track and Field'],
    logo: downingtownLogo,
  },
];

function EducationCard({ edu, index }: { edu: typeof education[0]; index: number }) {
  return (
    <ScrollReveal delay={index * 0.15}>
      <TiltCard className="relative rounded-2xl">
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-accent/40 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {edu.logo ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-muted flex items-center justify-center p-2 border border-border">
                  <img src={edu.logo} alt={`${edu.institution} logo`} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {edu.period && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{edu.period}</span>
                </div>
              )}
              
              <h3 className="font-display text-xl md:text-2xl font-bold mb-1 text-foreground">
                {edu.degree}
              </h3>
              
              {edu.concentration && (
                <p className="text-accent font-medium mb-2">
                  {edu.concentration}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-accent" />
                  <span>{edu.institution}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{edu.location}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{edu.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {edu.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1 bg-secondary text-muted-foreground text-sm rounded-full border border-border"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </ScrollReveal>
  );
}

export default function Education() {
  return (
    <section id="education" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
            Academic Background
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Education
          </h2>
        </ScrollReveal>
        
        <div className="space-y-8">
          {education.map((edu, index) => (
            <EducationCard key={edu.institution} edu={edu} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
