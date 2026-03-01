import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addDays, format, isSameDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Coffee, ChevronLeft, Check, ArrowLeft } from 'lucide-react';

const AVAILABLE_TIMES = ['10:00 AM EST', '11:30 AM EST', '2:00 PM EST', '3:30 PM EST', '5:00 PM EST'];

export default function CoffeeChatScheduler({ onFlipBack }: { onFlipBack: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'date' | 'details'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i + 1));
  }, []);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('meeting_requests').insert({
        name: name.trim(),
        email: email.trim(),
        requested_date: format(selectedDate, 'yyyy-MM-dd'),
        requested_time: selectedTime,
      });
      if (error) throw error;
      setIsDone(true);
      toast({ title: '☕ Meeting Requested!', description: "I'll confirm your slot via email." });
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mb-4"
        >
          <Check className="w-8 h-8 text-green-400" />
        </motion.div>
        <p className="text-xl font-semibold mb-1">You're all set!</p>
        <p className="text-sm text-purple-200/60 text-center">
          {format(selectedDate!, 'MMM d')} at {selectedTime}
        </p>
        <button
          onClick={onFlipBack}
          className="mt-6 text-xs text-purple-300/50 hover:text-purple-300/80 transition-colors"
        >
          ← Back to card
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col text-white font-sans overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="w-full max-w-[560px] mx-auto px-6 pt-4 flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {step === 'details' && (
            <button onClick={() => setStep('date')} className="text-purple-300/60 hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300/80">Book a Coffee Chat</p>
        </div>
        <button
          onClick={onFlipBack}
          className="flex items-center gap-1 text-[10px] text-purple-300/40 hover:text-purple-300/70 transition-colors"
        >
          <ChevronLeft className="w-3 h-3" /> Back
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 'date' ? (
          <motion.div
            key="date-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Date row */}
            <p className="w-full max-w-[560px] mx-auto text-[10px] text-purple-200/50 mb-1.5 px-6">Pick a day</p>
            <div className="flex w-full max-w-[560px] mx-auto overflow-x-auto gap-2 pb-2 scrollbar-hide px-6 snap-x items-stretch justify-start">
              {dates.map((d) => {
                const active = selectedDate && isSameDay(d, selectedDate);
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => setSelectedDate(d)}
                    className={`flex-shrink-0 w-16 min-w-[64px] p-2 text-xs snap-center rounded-md transition-all text-center flex flex-col items-center justify-center ${
                      active
                        ? 'bg-purple-500/30 border border-purple-400/50 shadow-[0_0_8px_hsl(270_100%_64%/0.2)]'
                        : 'bg-white/5 border border-white/10 hover:border-purple-400/30'
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider text-purple-200/50">{format(d, 'EEE')}</span>
                    <span className="text-sm font-semibold leading-tight">{format(d, 'd')}</span>
                    <span className="text-[8px] text-purple-200/40">{format(d, 'MMM')}</span>
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden mt-3"
                >
                  <p className="text-[10px] text-purple-200/50 mb-1.5">Available times</p>
                  <div className="grid grid-cols-3 gap-1">
                    {AVAILABLE_TIMES.map((time) => {
                      const active = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-2 py-2 rounded-lg text-xs transition-all font-mono ${
                            active
                              ? 'bg-purple-500/30 border border-purple-400/50 text-white shadow-[0_0_10px_hsl(270_100%_64%/0.15)]'
                              : 'bg-white/5 border border-white/10 text-purple-100/70 hover:border-purple-400/30'
                          }`}
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next */}
            {selectedDate && selectedTime && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStep('details')}
                className="mt-auto bg-purple-500/80 hover:bg-purple-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Continue →
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="details-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 min-h-0"
          >
            <p className="text-xs text-purple-200/50 mb-1">
              {selectedDate && format(selectedDate, 'EEEE, MMM d')} · <span className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selectedTime}</span>
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-400/50 transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={255}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-400/50 transition-colors"
              />
            </div>
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !email.trim()}
              whileTap={{ scale: 0.97 }}
              className="mt-auto flex items-center justify-center gap-2 bg-purple-500/80 hover:bg-purple-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Coffee className="w-4 h-4" />
                </motion.div>
              ) : (
                <>
                  <Coffee className="w-4 h-4" />
                  Initiate Meeting Request
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
