import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  once?: boolean;
}

const directionMap = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  duration,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });

  const dir = directionMap[direction];
  const axis = 'x' in dir ? 'x' : 'y';
  const offset = dir[axis as 'x' | 'y']! * distance;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, [axis]: offset }}
      animate={isInView ? { opacity: 1, [axis]: 0 } : { opacity: 0, [axis]: offset }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay,
        ...(duration ? { duration } : {}),
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
