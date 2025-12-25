import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-porcelain/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
    >
      <div className="w-full h-full md:h-auto md:max-w-6xl md:aspect-[16/9] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-white/50">
        
        {/* Close Button Mobile/Desktop */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all md:text-white text-deepCharcoal md:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Left Panel - Branding */}
        <div className="w-full md:w-5/12 bg-deepCharcoal relative p-12 flex flex-col justify-between overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'radial-gradient(#3A7DFF 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }}>
            </div>
            
            <div className="relative z-10 pt-12 md:pt-0">
               <h2 className="text-3xl font-serif text-white font-bold tracking-tight">SEHAT</h2>
               <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Government of India Initiative</p>
            </div>

            <div className="relative z-10 my-12 md:my-0">
                <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                    "Secure, unified access to India's digital health infrastructure."
                </h3>
            </div>

            <div className="relative z-10 flex items-center gap-6 opacity-80">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" 
                    alt="Emblem of India" 
                    className="h-12 w-auto object-contain grayscale brightness-200 contrast-125"
                />
                 <div className="w-px h-8 bg-white/20"></div>
                 <img 
                    src="https://janaushadhi.gov.in/img/logo.png" 
                    alt="PMBJP" 
                    className="h-10 w-auto object-contain grayscale brightness-200 contrast-125"
                />
            </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center overflow-y-auto relative">
             <div className="max-w-md mx-auto w-full">
                <div className="flex gap-8 mb-12 border-b border-slate-100">
                    <button 
                        onClick={() => setIsSignUp(false)}
                        className={`pb-4 text-sm font-medium transition-all relative ${!isSignUp ? 'text-trustBlue' : 'text-slate-400 hover:text-deepCharcoal'}`}
                    >
                        Sign In
                        {!isSignUp && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-trustBlue" />}
                    </button>
                    <button 
                        onClick={() => setIsSignUp(true)}
                        className={`pb-4 text-sm font-medium transition-all relative ${isSignUp ? 'text-trustBlue' : 'text-slate-400 hover:text-deepCharcoal'}`}
                    >
                        Create ABHA Account
                         {isSignUp && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-trustBlue" />}
                    </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {isSignUp && (
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="First Name" type="text" placeholder="Aditya" />
                            <InputGroup label="Last Name" type="text" placeholder="Sharma" />
                        </div>
                    )}
                    
                    <InputGroup label={isSignUp ? "Mobile Number (Aadhaar Linked)" : "ABHA Number / Mobile"} type="text" placeholder="+91 98765 43210" />
                    
                    {isSignUp && (
                         <InputGroup label="Aadhaar Number" type="text" placeholder="XXXX XXXX XXXX" />
                    )}

                    <InputGroup label="Password" type="password" placeholder="••••••••" />

                    {!isSignUp && (
                        <div className="flex justify-between items-center text-xs">
                             <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                                <input type="checkbox" className="rounded border-slate-300 text-trustBlue focus:ring-trustBlue" />
                                Remember me
                             </label>
                             <a href="#" className="text-trustBlue hover:underline">Forgot ABHA Password?</a>
                        </div>
                    )}

                    <button className="w-full bg-deepCharcoal text-white py-4 rounded-xl font-medium hover:bg-black transition-all shadow-lg shadow-deepCharcoal/20 flex items-center justify-center gap-2">
                        {isSignUp ? 'Verify Aadhaar via OTP' : 'Access Health Portal'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">
                        By continuing, you agree to the <a href="#" className="underline">NDHM Privacy Policy</a> and <a href="#" className="underline">Terms</a>.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100 text-green-700 text-xs font-medium">
                        <CheckCircle2 size={14} />
                        100% HIPAA & GDPR Compliant Security
                    </div>
                </div>
             </div>
        </div>
      </div>
    </motion.div>
  );
};

const InputGroup = ({ label, type, placeholder }: { label: string, type: string, placeholder: string }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-deepCharcoal uppercase tracking-wider">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder}
            className="w-full p-4 bg-porcelain border border-transparent rounded-xl focus:bg-white focus:border-trustBlue focus:ring-4 focus:ring-trustBlue/10 transition-all outline-none text-deepCharcoal placeholder:text-slate-400 font-medium"
        />
    </div>
);

export default Login;