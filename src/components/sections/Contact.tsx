import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, ArrowUpRight } from 'lucide-react';

// Official GitHub Logo Component
const GitHubLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Personal Email', 
      value: 'balajipratik8@gmail.com', 
      href: 'mailto:balajipratik8@gmail.com',
      color: 'from-rose-500 to-pink-600'
    },
    { 
      icon: Mail, 
      label: 'School Email', 
      value: 'tur47507@temple.edu', 
      href: 'mailto:tur47507@temple.edu',
      color: 'from-red-600 to-rose-700'
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: '(346) 446-8717', 
      href: 'tel:+13464468717',
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: 'Philadelphia, PA', 
      href: null,
      color: 'from-amber-500 to-orange-600'
    },
  ];

  const socials = [
    { 
      icon: GitHubLogo, 
      href: 'https://github.com/PratikBalaji', 
      label: 'GitHub',
      color: 'hover:bg-[#333] hover:border-[#333]',
      description: 'Check out my projects'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/in/pratikbalaji', 
      label: 'LinkedIn',
      color: 'hover:bg-[#0077B5] hover:border-[#0077B5]',
      description: 'Let\'s connect professionally'
    },
  ];

  return (
    <section id="contact" className="section-padding bg-black text-white" ref={ref}>
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4"
          >
            Get in Touch
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Let's Connect
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            I'm always excited to connect with new people and explore opportunities.
            Whether you have a project in mind or just want to say hello, feel free to reach out.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              {info.href ? (
                <a 
                  href={info.href}
                  className="block bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-white/60 mb-1">{info.label}</p>
                  <p className="font-semibold text-lg">{info.value}</p>
                </a>
              ) : (
                <div className="block bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4`}>
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-white/60 mb-1">{info.label}</p>
                  <p className="font-semibold text-lg">{info.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <h3 className="font-display text-2xl font-bold mb-8">Find Me Online</h3>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {socials.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/20 rounded-2xl transition-all duration-300 ${social.color} hover:text-white`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <social.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">{social.label}</p>
                  <p className="text-sm text-white/60 group-hover:text-white/70">{social.description}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -mr-1" />
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
