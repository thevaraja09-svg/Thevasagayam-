import React, { useEffect, useState } from 'react';
import { DigiHubLogo } from './DigiHubLogo';
import { ShieldCheck, Wifi, Activity, ArrowRight, Zap } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onDismiss, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none"
      id="splash-screen"
    >
      {/* Background Tech Mesh & Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-sky-600/30 via-cyan-500/20 to-purple-600/20 blur-3xl rounded-full pointer-events-none animate-pulse" />

      {/* Main Brand Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl shadow-sky-950/40">
        {/* Glowing Logo Circle */}
        <div className="mb-6 relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-inner">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-3xl blur-md opacity-30 animate-pulse pointer-events-none" />
          <DigiHubLogo size="xl" variant="white" />
        </div>

        <p className="text-sm font-semibold text-slate-300 mt-1 tracking-wide font-sans leading-relaxed">
          "Secure Homes | Safe Businesses | Stronger Connections"
        </p>

        {/* Capability Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full shadow-sm font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            4K Surveillance
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full shadow-sm font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            Enterprise Wi-Fi
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full shadow-sm font-medium">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            24/7 AI Health
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs mt-8">
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 ease-out glow-sky-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2.5 px-1 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-400 animate-pulse" /> System Handshake
            </span>
            <span className="font-bold text-sky-400">{progress}%</span>
          </div>
        </div>

        {/* Enter Workspace CTA */}
        <button
          onClick={onDismiss}
          className="mt-6 group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs transition-all shadow-lg shadow-sky-600/30 glow-sky-sm active:scale-95"
        >
          <span>Launch Workspace</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-6 text-center text-[10px] text-slate-500 font-mono tracking-wider">
        DIGI HUB SECURITY SYSTEMS &bull; ENTERPRISE PLATFORM V4.0
      </div>
    </div>
  );
};

