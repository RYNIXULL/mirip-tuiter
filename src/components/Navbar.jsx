import React from 'react';
import { ShieldCheck, Lock, Activity, EyeOff, Search } from 'lucide-react';

export default function Navbar({ 
  securityScore = 100, 
  activeView, 
  setActiveView,
  searchQuery,
  setSearchQuery,
  ghostMode,
  setGhostMode,
  onShowToast
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/60 backdrop-blur-md border-b border-white/10 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Mobile Brand / Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">CipherX</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                E2EE Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Zero-Knowledge Network &bull; AES-256-GCM
            </p>
          </div>
        </div>

        {/* Center Search Input with Glassmorphic styling */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari postingan aman, tag kriptografi, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
          </div>
        </div>

        {/* Right Security Metrics & Toggles */}
        <div className="flex items-center gap-3">
          {/* Ghost Privacy Mode Toggle */}
          <button
            onClick={() => {
              const nextState = !ghostMode;
              setGhostMode(nextState);
              onShowToast({
                type: 'shield',
                title: nextState ? 'Mode Anonim Aktif' : 'Mode Anonim Nonaktif',
                message: nextState 
                  ? 'Fingerprint peramban dan metadata sesi Anda diacak.'
                  : 'Kembali ke mode identitas terverifikasi standar.',
              });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              ghostMode
                ? 'bg-purple-950/50 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/20'
                : 'bg-slate-800/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
            title="Sembunyikan jejak perangkat & IP"
          >
            <EyeOff className={`w-3.5 h-3.5 ${ghostMode ? 'text-purple-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{ghostMode ? 'Ghost: ON' : 'Ghost: OFF'}</span>
          </button>

          {/* Security Score Badge */}
          <div 
            onClick={() => setActiveView('security')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-colors"
            title="Klik untuk membuka Audit Keamanan Lengkap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold leading-tight text-white">
                Skor Keamanan: {securityScore}/100
              </span>
              <span className="text-[9px] text-emerald-400 leading-tight">
                Pertahanan Aktif (A+)
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
