
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 bg-porcelain">
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-trustBlue/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-healingTeal/10 rounded-full blur-[140px]" 
        />
      </div>

      <motion.div 
        style={{ scale: textScale, y: textY }}
        className="relative z-10 text-center px-4"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center overflow-hidden"
        >
          {["S", "E", "H", "A", "T"].map((letter, idx) => (
            <motion.span 
              key={idx}
              variants={letterVariants}
              className="text-[18vw] leading-[0.85] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-deepCharcoal to-slate-400 select-none inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
          className="mt-12 text-lg md:text-xl text-slate-500 max-w-lg mx-auto font-light tracking-wide"
        >
          One platform. Multiple intelligent healthcare agents.
        </motion.p>
      </motion.div>

      {/* Gradient Veil */}
      <motion.div 
        style={{ opacity: veilOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-porcelain/0 via-porcelain/50 to-porcelain pointer-events-none z-20"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.span 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] tracking-widest uppercase text-slate-400"
        >
          Scroll to Explore
        </motion.span>
        <div className="w-px h-8 bg-slate-300"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
