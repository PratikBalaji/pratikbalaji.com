import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-background border-t border-border">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {currentYear} Pratik Balaji. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="mailto:balajipratik8@gmail.com" className="hover:text-foreground transition-colors">
              balajipratik8@gmail.com
            </a>
            <a href="tel:+13464468717" className="hover:text-foreground transition-colors">
              (346) 446-8717
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
