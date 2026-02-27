import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Education from '@/components/sections/Education';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications';
import Skills from '@/components/sections/Skills';
import GitHub from '@/components/sections/GitHub';
import Contact from '@/components/sections/Contact';
import Guestbook from '@/components/sections/Guestbook';
import Footer from '@/components/Footer';

const Index = () => {
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
      <Guestbook />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
