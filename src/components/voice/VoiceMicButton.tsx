import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface VoiceMicButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export default function VoiceMicButton({ isListening, isProcessing, onMouseDown, onMouseUp }: VoiceMicButtonProps) {
  return (
    <motion.button
      type="button"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      disabled={isProcessing}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 ${
        isListening
          ? 'bg-red-500/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
          : 'bg-accent/20 text-accent hover:bg-accent/30'
      }`}
    >
      {/* Pulsing ring when listening */}
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-red-400/60"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-xl border border-red-300/40"
            animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
      {isListening ? (
        <Mic className="w-4 h-4 relative z-10" />
      ) : (
        <MicOff className="w-4 h-4 relative z-10" />
      )}
    </motion.button>
  );
}
