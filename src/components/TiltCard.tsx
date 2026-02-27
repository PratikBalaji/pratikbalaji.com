import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glowOnHover?: boolean;
}

export default function TiltCard({ children, className = '', tiltAmount = 8, glowOnHover = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -tiltAmount);
    setRotateY(((x - centerX) / centerX) * tiltAmount);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={`${className} ${glowOnHover && isHovered ? 'shadow-[0_0_30px_hsl(270_100%_64%/0.15)]' : ''}`}
    >
      {children}
      {/* Glowing border on hover */}
      {glowOnHover && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none border border-transparent"
          animate={{
            borderColor: isHovered ? 'hsl(270 100% 64% / 0.4)' : 'transparent',
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
