import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Experience', href: '#experience' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#github' },
    { label: 'LinkedIn', href: '#linkedin' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="relative">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-transparent" />
        
        <div className="container-tight relative">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center">
              <Logo size="lg" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-[15px] font-medium italic tracking-wide text-white hover:text-accent transition-all duration-300 link-underline normal-case"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    textShadow: '0 0 10px hsl(270 100% 64% / 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.textShadow = '0 0 8px hsl(270 100% 64% / 0.6), 0 0 20px hsl(270 100% 64% / 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.textShadow = 'none';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-white text-xs font-medium" style={{ textShadow: '0 0 10px hsl(270 100% 64% / 0.3)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Philadelphia, PA
              </div>
              
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    className="md:hidden w-10 h-10 rounded-full bg-card/40 backdrop-blur-xl border border-white/10 hover:border-accent/40 flex items-center justify-center transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-card border-border">
                  <SheetHeader>
                    <SheetTitle className="text-left text-foreground">Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => scrollToSection(item.href)}
                        className="text-lg font-medium italic tracking-wide text-white hover:text-accent transition-all duration-300 text-left py-2 normal-case"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                      </span>
                      Philadelphia, PA
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
