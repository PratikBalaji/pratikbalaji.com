import { motion } from 'framer-motion';

interface TTSWaveformProps {
  isActive: boolean;
  className?: string;
}

export default function TTSWaveform({ isActive, className = '' }: TTSWaveformProps) {
  if (!isActive) return null;

  const bars = 5;

  return (
    <div className={`flex items-center gap-[3px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-accent"
          animate={{
            height: ['8px', '20px', '12px', '24px', '8px'],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
