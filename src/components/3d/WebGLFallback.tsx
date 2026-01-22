import { motion } from 'framer-motion';

interface WebGLFallbackProps {
  className?: string;
  variant?: 'hero' | 'sphere' | 'globe';
}

export default function WebGLFallback({ className = '', variant = 'hero' }: WebGLFallbackProps) {
  const patterns = {
    hero: (
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-secondary to-muted rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 30, 0],
            y: [0, 80, -30, 0],
            scale: [1, 0.8, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-br from-muted to-secondary rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ 
            x: [0, 60, -40, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-border to-muted rounded-full blur-3xl opacity-50"
        />
        
        {/* Geometric shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-border/30 rounded-2xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-border/20"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
      </div>
    ),
    sphere: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background rounded-3xl">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-48 h-48 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-full shadow-2xl border border-border/50"
        />
      </div>
    ),
    globe: (
      <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-secondary to-background rounded-3xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative w-64 h-64"
        >
          <div className="absolute inset-0 border-2 border-border/30 rounded-full" />
          <div className="absolute inset-4 border border-border/20 rounded-full" />
          <div className="absolute inset-8 border border-border/10 rounded-full" />
          <div className="absolute inset-0 w-full h-0.5 bg-border/20 top-1/2" />
          <div className="absolute inset-0 w-0.5 h-full bg-border/20 left-1/2" />
        </motion.div>
      </div>
    ),
  };

  return (
    <div className={`relative ${className}`}>
      {patterns[variant]}
    </div>
  );
}
