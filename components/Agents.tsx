
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AGENTS } from '../constants';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Agents: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="agents" className="py-24 bg-coolMist/30 border-y border-hairline overflow-hidden">
      <div className="px-6 md:px-12 mb-12 flex justify-between items-end max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-deepCharcoal">SEHAT Core Agents</h2>
          <p className="text-slate-500 mt-2">Select an intelligent interface for your specific need.</p>
        </motion.div>
        <div className="hidden md:flex gap-2 text-sm text-slate-400">
          <span>Scroll</span> <ArrowRight size={16} />
        </div>
      </div>

      <motion.div 
        ref={scrollRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex gap-6 overflow-x-auto pb-12 px-6 md:px-12 hide-scrollbar snap-x snap-mandatory"
      >
        {AGENTS.map((agent, index) => (
          <motion.div 
            key={agent.id} 
            className="snap-center shrink-0"
          >
             <AgentCard agent={agent} />
          </motion.div>
        ))}
        {/* Spacer for right padding */}
        <div className="w-6 md:w-12 shrink-0"></div>
      </motion.div>
    </section>
  );
};

const AgentCard: React.FC<{ agent: typeof AGENTS[0] }> = ({ agent }) => {
  const isExternal = !!agent.url;
  const isDrSahab = agent.id === 'dr-sahab';
  
  // Hover Light Effect logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleScrollDown = () => {
    const section = document.getElementById('interactive-assistant');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      onMouseMove={onMouseMove}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-[300px] md:w-[400px] h-[520px] bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-slate-100 group cursor-pointer relative overflow-hidden"
    >
      {/* Follow Light Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(58, 125, 255, 0.06), transparent 40%)`
          ),
        }}
      />

      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${
        agent.id === 'medishop' ? 'from-emerald-600 to-transparent' :
        agent.id === 'medilocate' ? 'from-rose-500 to-transparent' :
        agent.id === 'dr-sahab' ? 'from-trustBlue to-transparent' :
        agent.id === 'scheduling-agent' ? 'from-indigo-500 to-transparent' :
        'from-slate-300 to-transparent'
      }`} />
      
      <div>
        <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ${agent.color}`}>
          <agent.icon size={24} />
        </div>
        <h3 className="text-2xl font-serif text-deepCharcoal mb-3 group-hover:text-trustBlue transition-colors">{agent.title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{agent.description}</p>
      </div>

      <div>
        <ul className="space-y-3 mb-8">
          {agent.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-trustBlue transition-colors" />
              {feature}
            </li>
          ))}
        </ul>
        
        {isDrSahab ? (
          <button 
            onClick={handleScrollDown}
            className="inline-flex items-center justify-between w-full px-6 py-3 rounded-xl bg-trustBlue/5 text-sm font-semibold text-trustBlue group-hover:bg-trustBlue group-hover:text-white transition-all shadow-sm"
          >
            <span>{agent.ctaText || 'Scroll Down'}</span>
            <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
          </button>
        ) : isExternal ? (
          <a 
            href={agent.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full px-6 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-deepCharcoal group-hover:bg-trustBlue group-hover:text-white transition-all shadow-sm"
          >
            <span>{agent.ctaText || 'Enter Agent'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        ) : (
          <div className="inline-flex items-center justify-between w-full px-6 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-deepCharcoal group-hover:bg-slate-100 transition-all shadow-sm">
            <span>{agent.ctaText || 'Enter Agent'}</span>
            <ArrowRight size={18} className="text-trustBlue group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Agents;
