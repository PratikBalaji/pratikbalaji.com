import { createContext, useContext, useState, useEffect, useRef } from 'react';

const SECTION_IDS = ['about', 'education', 'experience', 'certifications', 'skills', 'github', 'linkedin', 'contact'];

export const ActiveSectionContext = createContext<string>('hero');

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

export function useActiveSectionTracker() {
  const [activeSection, setActiveSection] = useState('hero');
  const activeSectionRef = useRef('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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

  return activeSection;
}
