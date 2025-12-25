
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Agents from './components/Agents';
import InteractiveAssistant from './components/InteractiveAssistant';
import Capabilities from './components/Capabilities';
import Knowledge from './components/Knowledge';
import Footer from './components/Footer';
import Login from './components/Login';

// Helper component to handle the custom element without TS errors
const ElevenLabsWidget: React.FC = () => {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: '<elevenlabs-convai agent-id="agent_7101kbq6s4wyfdws5gp7gnv13p7x"></elevenlabs-convai>' 
      }} 
    />
  );
};

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .group')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor hidden md:block"
      animate={{
        x: position.x - (isHovered ? 25 : 10),
        y: position.y - (isHovered ? 25 : 10),
        scale: isHovered ? 2.5 : 1,
        opacity: 0.8
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-porcelain font-sans selection:bg-trustBlue/20">
      <CustomCursor />
      
      {/* Top Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-trustBlue z-[100] origin-left"
        style={{ scaleX }}
      />

      <AnimatePresence>
        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </AnimatePresence>

      <Header onLoginClick={() => setShowLogin(true)} />
      
      <main>
        <Hero />
        <Philosophy />
        <Agents />
        <InteractiveAssistant />
        <Capabilities />
        <Knowledge />
      </main>
      
      <Footer />
      
      {/* Global AI Voice Assistant Widget */}
      <ElevenLabsWidget />
    </div>
  );
}

export default App;
