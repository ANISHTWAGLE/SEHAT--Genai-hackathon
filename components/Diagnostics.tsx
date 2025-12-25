import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ShieldCheck, Activity } from 'lucide-react';

const Diagnostics: React.FC = () => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  return (
    <section id="diagnostics" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-serif text-deepCharcoal mb-6">Diagnostic Intelligence Layer</h2>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed">
            A precision layer that supports clinical decision-making. Our models analyze dermatological imagery and radiological scans to surface patterns invisible to the naked eye.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
              <Scan className="text-trustBlue mt-1" />
              <div>
                <h4 className="font-semibold text-deepCharcoal">Computer Vision Analysis</h4>
                <p className="text-sm text-slate-500 mt-1">Real-time processing of X-rays and skin lesions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
              <ShieldCheck className="text-healingTeal mt-1" />
              <div>
                <h4 className="font-semibold text-deepCharcoal">Safety Guardrails</h4>
                <p className="text-sm text-slate-500 mt-1">AI intent verification and non-diagnostic support checks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Abstract Visual */}
        <div className="relative h-[500px] w-full bg-deepCharcoal rounded-2xl overflow-hidden flex items-center justify-center group">
          {/* Abstract Grid */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'linear-gradient(#3A7DFF 1px, transparent 1px), linear-gradient(90deg, #3A7DFF 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}>
          </div>
          
          {/* Radar effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-deepCharcoal via-transparent to-transparent z-10"></div>

          {/* Interactive Points */}
          {[1, 2, 3].map((point, i) => (
            <motion.button
              key={point}
              className="absolute w-4 h-4 bg-white rounded-full z-20 cursor-pointer"
              style={{ 
                top: `${30 + i * 20}%`, 
                left: `${20 + i * 25}%` 
              }}
              whileHover={{ scale: 1.5 }}
              onClick={() => setActivePoint(activePoint === i ? null : i)}
            >
              <span className="absolute inset-0 rounded-full bg-trustBlue animate-ping opacity-75"></span>
            </motion.button>
          ))}

          <AnimatePresence>
            {activePoint !== null && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-30 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl w-64 text-white"
                style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
              >
                <div className="flex items-center gap-2 mb-2 text-healingTeal">
                  <Activity size={16} />
                  <span className="text-xs font-mono uppercase">Anomaly Detected</span>
                </div>
                <h4 className="font-serif text-lg">Pattern Match: 98.4%</h4>
                <p className="text-xs text-slate-300 mt-2">This is a simulation of the diagnostic overlay presented to clinicians.</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute bottom-6 right-6 text-xs font-mono text-slate-500">
            SYS.DIAG.V4.2 // ONLINE
          </div>
        </div>
      </div>
    </section>
  );
};

export default Diagnostics;