import { motion } from 'framer-motion';
import pbLogo from '@/assets/pb-logo.png';

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
      <img
        src={pbLogo}
        alt="PB Logo"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
}
