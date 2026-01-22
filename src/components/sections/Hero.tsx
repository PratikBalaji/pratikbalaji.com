import { motion } from 'framer-motion';
import { Suspense, lazy, useState, useEffect } from 'react';
import WebGLFallback from '@/components/3d/WebGLFallback';

const FloatingShapes = lazy(() => import('@/components/3d/FloatingShapes'));

export default function Hero() {
  const [useWebGL, setUseWebGL] = useState(false);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setUseWebGL(!!gl);
    } catch {
      setUseWebGL(false);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background with fallback */}
      {useWebGL ? (
        <Suspense fallback={<WebGLFallback className="absolute inset-0 -z-10" variant="hero" />}>
          <FloatingShapes />
        </Suspense>
      ) : (
        <WebGLFallback className="absolute inset-0 -z-10" variant="hero" />
      )}
      
      {/* Content */}
      <div className="container-tight relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base font-medium text-muted-foreground mb-4 uppercase tracking-widest"
          >
            Software Developer & Problem Solver
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6"
          >
            Pratik Balaji
            <br />
            <span className="text-gradient">builds digital</span>
            <br />
            experiences.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            A passionate software developer specializing in creating elegant solutions
            and building innovative applications that push boundaries.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all hover:scale-105"
            >
              View My Work
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-border font-medium rounded-full hover:bg-secondary transition-all hover:scale-105"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
    </section>
  );
}
