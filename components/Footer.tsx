import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-deepCharcoal text-white pt-24 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Ready to experience the future of care?</h2>
            <button className="group relative px-8 py-4 bg-white text-deepCharcoal rounded-full font-medium overflow-hidden">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Access SEHAT Platform</span>
              <div className="absolute inset-0 bg-trustBlue transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm text-slate-400">
            <div className="flex flex-col gap-4">
              <span className="text-white font-medium mb-2">Platform</span>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API Status</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white font-medium mb-2">Legal</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Compliance</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-6">
                 {/* Footer Logos in Grayscale/White */}
                 <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" 
                    alt="Emblem of India" 
                    className="h-8 w-auto opacity-50 grayscale"
                />
                 <img 
                    src="https://janaushadhi.gov.in/img/logo.png" 
                    alt="PMBJP" 
                    className="h-8 w-auto opacity-50 grayscale brightness-200"
                />
            </div>

            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>SYSTEM ONLINE</span>
                <span className="mx-2">|</span>
                <span>{time} IST</span>
            </div>
            
            <span>© 2024 SEHAT. Government of India Initiative.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;