import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { RotateCw } from 'lucide-react';
import BusinessCard3D from '@/components/3d/BusinessCard3D';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message must be under 1000 characters'),
});

export default function Contact() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
      });
      if (error) throw error;

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      toast({
        title: '✨ Message sent!',
        description: "Thanks for reaching out. I'll get back to you soon!",
      });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or email me directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-transparent relative">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-8">
          <ScrollReveal>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">Hire Me</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Let's Connect
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Interact with my digital business card. Flip it to send me a message.
            </p>
          </ScrollReveal>
        </div>

        {/* 3D Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className="w-full h-[420px] md:h-[480px] relative"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Loading card…
              </div>
            }
          >
            <BusinessCard3D
              isFlipped={isFlipped}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              errors={errors}
            />
          </Suspense>
        </motion.div>

        {/* Flip Button */}
        <div className="flex justify-center mt-6">
          <motion.button
            onClick={() => setIsFlipped((f) => !f)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/30 bg-card/50 backdrop-blur-sm text-foreground font-medium transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            <RotateCw className="w-4 h-4" />
            {isFlipped ? 'View Contact Info' : 'Send a Message'}
          </motion.button>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="https://github.com/PratikBalaji"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-foreground text-sm font-medium transition-all hover:border-accent/40 hover:shadow-[0_0_20px_hsl(270_100%_64%/0.15)]"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/pratikbalaji"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-foreground text-sm font-medium transition-all hover:border-accent/40 hover:shadow-[0_0_20px_hsl(270_100%_64%/0.15)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
