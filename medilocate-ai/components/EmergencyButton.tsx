import React from 'react';
import { AppStatus } from '../types';
import { AmbulanceIcon } from './Icons';

interface EmergencyButtonProps {
  status: AppStatus;
  onClick: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ status, onClick }) => {
  const isProcessing = status === AppStatus.LOCATING || status === AppStatus.THINKING;

  let label = "Find Nearest Hospital";
  let subLabel = "Use Current Location";

  if (status === AppStatus.LOCATING) {
    label = "Acquiring Location...";
    subLabel = "Please allow permission";
  } else if (status === AppStatus.THINKING) {
    label = "Searching Nearby...";
    subLabel = "Analyzing Maps Data";
  }

  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      className={`
        relative w-full max-w-sm group overflow-hidden rounded-2xl p-8 transition-all duration-300
        ${isProcessing ? 'bg-slate-100 cursor-wait' : 'bg-red-600 hover:bg-red-700 shadow-xl hover:shadow-2xl hover:-translate-y-1'}
      `}
    >
      {/* Background Pulse Effect for Emergency Feel */}
      {!isProcessing && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      )}

      {/* Loading Pulse */}
      {isProcessing && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className={`
          p-4 rounded-full mb-4 transition-colors duration-300
          ${isProcessing ? 'bg-white text-slate-400' : 'bg-white/20 text-white'}
        `}>
          <AmbulanceIcon className="w-10 h-10" />
        </div>
        
        <h2 className={`text-2xl font-bold mb-1 ${isProcessing ? 'text-slate-700' : 'text-white'}`}>
          {label}
        </h2>
        <p className={`text-sm font-medium ${isProcessing ? 'text-slate-500' : 'text-red-100'}`}>
          {subLabel}
        </p>
      </div>
    </button>
  );
};
