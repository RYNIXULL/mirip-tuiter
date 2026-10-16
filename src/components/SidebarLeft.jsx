import React from 'react';
import { 
  Home, 
  Lock, 
  ShieldCheck, 
  Bookmark, 
  User, 
  PenLine, 
  KeyRound, 
  Check, 
  Hash,
  Terminal
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

export default function SidebarLeft({ 
  activeView, 
  setActiveView, 
  onOpenComposer,
  ghostMode,
  postCount = 0
}) {
  const navItems = [
    { id: 'feed', label: 'Beranda Aman', icon: Home },
    { id: 'vault', label: 'Brankas Terenkripsi', icon: Lock, badge: 'E2EE' },
    { id: 'security', label: 'Pusat Keamanan & Audit', icon: ShieldCheck, badge: 'A+' },
    { id: 'bookmarks', label: 'Tersimpan', icon: Bookmark },
    { id: 'profile', label: 'Profil Kriptografis', icon: User },
  ];

  return (
    <aside className="w-64 xl:w-72 shrink-0 hidden md:flex flex-col justify-between py-4 pr-4 border-r border-white/10 min-h-[calc(100vh-4rem)] sticky top-16">
      
      {/* Navigation Links */}
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-300 hover:bg-slate-800/40 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isActive 
                    ? 'bg-cyan-400 text-slate-950' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Action Button: Post Securely */}
        <div className="pt-4">
          <button
            onClick={onOpenComposer}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <PenLine className="w-4 h-4 text-slate-950" />
            <span>Posting Aman</span>
          </button>
        </div>

        {/* Security Quick Status Box */}
        <div className="mt-6 p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              Kunci Klien Lokal
            </span>
            <span className="text-emerald-400 text-[11px] font-mono">Aktif</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-950/50 p-2 rounded-xl border border-white/5 truncate">
            Fingerprint: {ghostMode ? '0xMASKED_ANON' : CURRENT_USER.fingerprint}
          </div>
        </div>
      </div>

      {/* User Identity Profile Card at bottom */}
      <div className="pt-4">
        <div className="p-3 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="relative shrink-0">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white truncate">
                  {ghostMode ? 'Anonim (Ghost Mode)' : CURRENT_USER.name}
                </span>
                {!ghostMode && (
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">
                @{ghostMode ? 'masked_identity' : CURRENT_USER.handle}
              </p>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
