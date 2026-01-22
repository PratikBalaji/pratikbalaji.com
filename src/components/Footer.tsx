import { motion } from 'framer-motion';

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
          <p className="text-sm text-muted-foreground">
            © {currentYear} Pratik. All rights reserved.
          </p>
          
          <p className="text-sm text-muted-foreground">
            Built with <span className="text-foreground">React</span> & <span className="text-foreground">Three.js</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
