
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Philosophy: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.2"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4], [40, 0]);

  return (
    <section id="philosophy" ref={targetRef} className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:w-1/3 pt-4"
        >
          <h2 className="text-sm font-semibold tracking-widest uppercase text-trustBlue mb-4">The Philosophy</h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-trustBlue"
          ></motion.div>
        </motion.div>
        
        <div className="md:w-2/3">
          <motion.h3 
            style={{ opacity, y }}
            className="text-4xl md:text-6xl font-serif leading-tight text-deepCharcoal"
          >
            Healthcare that <span className="text-trustBlue italic">listens</span>, <span className="text-healingTeal italic">reasons</span>, and <span className="text-deepCharcoal italic">responds</span> — intelligently.
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 text-xl text-slate-500 font-light leading-relaxed max-w-2xl"
          >
            We believe in a future where medical technology isn't just a tool, but a calm, reliable partner. SEHAT unifies complex healthcare workflows with human-centric design.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
