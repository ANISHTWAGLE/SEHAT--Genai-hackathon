import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CAPABILITIES } from '../constants';
import { Plus } from 'lucide-react';

const Capabilities: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>('cap-1');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-12 text-center">System Capabilities</h2>
        
        <div className="space-y-4">
          {CAPABILITIES.map((cap) => (
            <div 
              key={cap.id}
              className="border-b border-hairline last:border-0 pb-4"
            >
              <button 
                onClick={() => setActiveId(activeId === cap.id ? null : cap.id)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className={`text-2xl md:text-3xl font-serif transition-colors ${activeId === cap.id ? 'text-trustBlue' : 'text-deepCharcoal group-hover:text-slate-600'}`}>
                  {cap.title}
                </span>
                <motion.div 
                  animate={{ rotate: activeId === cap.id ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="text-slate-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeId === cap.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-500 pb-8 text-lg font-light leading-relaxed max-w-2xl">
                      {cap.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;