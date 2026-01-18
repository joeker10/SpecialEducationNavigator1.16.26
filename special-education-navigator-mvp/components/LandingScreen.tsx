
import React, { useState } from 'react';
import { MapPin, ShieldCheck, ChevronRight, Compass } from 'lucide-react';
import { US_STATES } from '../constants';
import { Button } from './Button';

interface LandingScreenProps {
  onStartSession: (state: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartSession }) => {
  const [selectedState, setSelectedState] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedState) {
      onStartSession(selectedState);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-black to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-2xl w-full bg-zinc-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-zinc-800/50 ring-1 ring-white/10">
        
        {/* Logo using Lucide Icon for robustness */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full" />
            <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center border border-blue-400/30 shadow-2xl">
              <Compass className="h-24 w-24 md:h-32 md:w-32 text-white animate-pulse" style={{ animationDuration: '4s' }} />
            </div>
          </div>
        </div>

        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Special Education Navigator
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-lg mx-auto">
            AI-powered guidance for IDEA laws, IEPs, and procedural safeguards. Grounded in official regulations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto relative z-10">
          <div className="space-y-2">
            <label htmlFor="state-select" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
              Select Jurisdiction
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-blue-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <select
                id="state-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="block w-full pl-11 pr-10 py-4 text-base bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-sm transition-all cursor-pointer appearance-none outline-none"
              >
                <option value="" disabled className="bg-zinc-900 text-zinc-500">Where does the student go to school?</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state} className="bg-zinc-900 text-white">{state}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                 <ChevronRight className="h-5 w-5 text-zinc-500 rotate-90 group-hover:text-zinc-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500/80" />
              <p className="text-xs text-zinc-500 font-medium">
                Verifies state-specific timelines & laws
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 text-lg group shadow-blue-900/20" 
            disabled={!selectedState}
          >
            Start Consultation
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-zinc-600 text-xs font-medium">
          Not legal advice • For informational purposes only
        </p>
      </div>
    </div>
  );
};
