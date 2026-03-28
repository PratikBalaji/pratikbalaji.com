import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Education from '@/components/sections/Education';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications';
import Skills from '@/components/sections/Skills';
import GitHub from '@/components/sections/GitHub';
import LinkedInPosts from '@/components/sections/LinkedInPosts';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

const SECTION_IDS = ['about', 'education', 'experience', 'certifications', 'skills', 'github', 'linkedin', 'contact'];

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const activeSectionRef = useRef('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry;
          }
        }
        if (best) {
          const id = best.target.id || 'hero';
          if (id !== activeSectionRef.current) {
            activeSectionRef.current = id;
            setActiveSection(id);
          }
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-10% 0px -10% 0px' }
    );

    // Small delay to let sections mount
    const timer = setTimeout(() => {
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Certifications />
      <Skills />
      <GitHub />
      <LinkedInPosts />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
