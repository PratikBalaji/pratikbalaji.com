import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, Send, Github, Linkedin, Instagram } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const socials = [
    { icon: Github, href: 'https://github.com/PratikBalaji', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/pratikbalaji', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/pratik_balaji/', label: 'Instagram' },
  ];

  return (
    <section id="contact" className="section-padding bg-primary text-primary-foreground" ref={ref}>
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm font-medium text-primary-foreground/60 uppercase tracking-widest mb-4"
            >
              Get in Touch
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Let's work together on something great.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-primary-foreground/70 mb-8"
            >
              I'm always excited to connect with new people and explore opportunities.
              Whether you have a project in mind or just want to say hello, feel free to reach out.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:balajipratik8@gmail.com" className="hover:underline">
                  balajipratik8@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+13464468717" className="hover:underline">
                  (346) 446-8717
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4"
            >
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>
          
          {/* Right side - Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-primary-foreground/5 backdrop-blur rounded-2xl p-6 md:p-8"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg focus:outline-none focus:border-primary-foreground/40 transition-colors placeholder:text-primary-foreground/40"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg focus:outline-none focus:border-primary-foreground/40 transition-colors placeholder:text-primary-foreground/40"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg focus:outline-none focus:border-primary-foreground/40 transition-colors placeholder:text-primary-foreground/40 resize-none"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-foreground text-primary font-medium rounded-lg hover:bg-primary-foreground/90 transition-colors"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
