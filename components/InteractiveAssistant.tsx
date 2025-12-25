import React from 'react';
import { motion } from 'framer-motion';

const InteractiveAssistant: React.FC = () => {
  return (
    <section id="interactive-assistant" className="py-24 px-6 md:px-12 bg-white border-b border-hairline">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-trustBlue mb-4">Interactive Assistant</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-deepCharcoal mb-6">Experience SEHAT Intelligence</h3>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
            Engage with our real-time medical reasoning engine. Ask questions, describe symptoms, or explore healthcare insights through our multimodal interface.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[650px] bg-porcelain rounded-3xl overflow-hidden shadow-2xl shadow-trustBlue/5 border border-hairline"
        >
          {/* Container for the iframe agent */}
          <div id="agent-container" className="w-full h-full">
            <iframe 
              src="https://bey.chat/655d8428-3dab-4be4-bbcd-98ef3cbcfd1d"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="camera; microphone; fullscreen"
              allowFullScreen={true}
              title="SEHAT Interactive Agent"
            />
          </div>
          
          {/* Subtle decoration overlay */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-hairline text-[10px] font-mono font-bold text-trustBlue uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-trustBlue animate-pulse" />
              Live Session
            </div>
          </div>
        </motion.div>
        
        <div className="mt-8 flex justify-center gap-8 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                Voice Enabled
            </div>
            <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                Vision Capable
            </div>
            <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                Secure & Private
            </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveAssistant;