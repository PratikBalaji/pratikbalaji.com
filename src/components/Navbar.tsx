import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
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
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-border/40" />
        
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
                  className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors duration-200 link-underline"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection('#contact')}
                className="hidden md:block px-5 py-2.5 text-sm font-medium rounded-full border border-border bg-card text-foreground hover:border-accent hover:text-accent hover:shadow-[var(--electric-glow)] transition-all duration-300"
              >
                Get in Touch
              </button>
              
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    className="md:hidden w-10 h-10 rounded-full bg-card border border-border hover:border-accent flex items-center justify-center transition-colors"
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
                        className="text-lg font-medium text-muted-foreground hover:text-accent transition-colors text-left py-2"
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className="mt-4 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-full hover:bg-accent/90 transition-colors"
                    >
                      Get in Touch
                    </button>
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
