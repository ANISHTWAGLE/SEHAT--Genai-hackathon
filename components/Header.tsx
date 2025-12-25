import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-porcelain/80 backdrop-blur-md border-b border-hairline flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        {/* Emblem of India */}
        <div className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity">
           <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" 
            alt="Emblem of India" 
            className="h-full w-auto object-contain"
          />
        </div>
        
        {/* PMBJP Logo (Representative URL) */}
        <div className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity hidden sm:block">
           <img 
            src="https://janaushadhi.gov.in/img/logo.png" 
            alt="Pradhan Mantri Bhartiya Janaushadhi Pariyojana" 
            className="h-full w-auto object-contain"
          />
        </div>

        <div className="w-px h-8 bg-hairline mx-2 hidden sm:block"></div>

        <div className="flex flex-col">
          <h1 className="text-xl font-serif font-bold text-deepCharcoal tracking-tight leading-none">SEHAT</h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-1">Smart Expert Healthcare Assistant Tool</span>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#agents" className="hover:text-trustBlue transition-colors">Agents</a>
        <a href="#philosophy" className="hover:text-trustBlue transition-colors">Philosophy</a>
      </nav>

      <div className="flex items-center gap-4">
        {/* External Redirect Actions */}
        <div className="hidden md:flex items-center gap-4 mr-2">
          <a 
            href="https://medishop-ai-85618371279.us-west1.run.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-deepCharcoal text-white text-sm font-semibold hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Go to MediShop
          </a>
          <a 
            href="https://medilocate-ai-85618371279.us-west1.run.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full border border-slate-300 bg-white/50 text-sm font-semibold hover:bg-white hover:border-trustBlue hover:text-trustBlue transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Medilocate AI
          </a>
        </div>

        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 rounded-full border border-slate-200 text-sm font-medium hover:bg-white hover:shadow-sm transition-all text-deepCharcoal bg-white/30 backdrop-blur-sm"
        >
          Login
        </button>
      </div>
    </motion.header>
  );
};

export default Header;