import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${sizes[size]} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="currentColor"
          className="text-foreground"
        />
        
        {/* Letter P */}
        <path
          d="M28 25h16c8 0 14 6 14 14s-6 14-14 14H38v22h-10V25z"
          fill="currentColor"
          className="text-background"
        />
        <path
          d="M38 33h6c3.5 0 6 2.5 6 6s-2.5 6-6 6h-6V33z"
          fill="currentColor"
          className="text-foreground"
        />
        
        {/* Letter B */}
        <path
          d="M52 25h14c7 0 12 4.5 12 11 0 4-2 7-5 9 4 1.5 7 5.5 7 10 0 7-5.5 12-13 12H52V25z"
          fill="currentColor"
          className="text-background"
        />
        <path
          d="M62 33h4c2.5 0 4 1.5 4 4s-1.5 4-4 4h-4V33z"
          fill="currentColor"
          className="text-foreground"
        />
        <path
          d="M62 49h5c3 0 5 2 5 5s-2 5-5 5h-5V49z"
          fill="currentColor"
          className="text-foreground"
        />
      </svg>
    </motion.div>
  );
}
