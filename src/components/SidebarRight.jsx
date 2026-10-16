import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  UserCheck, 
  UserPlus, 
  ShieldAlert, 
  Cpu, 
  FileCheck,
  Lock,
  Check
} from 'lucide-react';
import { WHO_TO_FOLLOW, TRENDING_SECURITY_TOPICS } from '../data/mockData';

export default function SidebarRight({ 
  onSelectTag, 
  blockedAttacksCount = 14,
  onShowToast 
}) {
  const [followingMap, setFollowingMap] = useState({});
  const [autoStripExif, setAutoStripExif] = useState(true);
  const [strictXssFilter, setStrictXssFilter] = useState(true);

  const toggleFollow = (handle) => {
    setFollowingMap((prev) => {
      const next = !prev[handle];
      onShowToast({
        type: next ? 'success' : 'info',
        title: next ? 'Peneliti Diikuti' : 'Batal Mengikuti',
        message: next 
          ? `Kunci publik dan feed terenkripsi @${handle} telah ditambahkan.`
          : `Anda tidak lagi mengikuti @${handle}.`,
      });
      return { ...prev, [handle]: next };
    });
  };

  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-5 py-4 pl-4 border-l border-white/10 min-h-[calc(100vh-4rem)]">
      
      {/* Real-time Defense Radar Widget */}
      <div className="p-4 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Radar Pertahanan Siber
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Aktif
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-3">
          <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/5">
            <div className="text-[10px] text-slate-400">Algoritma Kunci</div>
            <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">AES-256-GCM</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/5">
            <div className="text-[10px] text-slate-400">Payload Dinetralkan</div>
            <div className="text-xs font-bold text-emerald-300 font-mono mt-0.5">{blockedAttacksCount} Terdeteksi</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/5">
            <div className="text-[10px] text-slate-400">Pembersihan EXIF</div>
            <div className="text-xs font-bold text-purple-300 font-mono mt-0.5">100% Canvas</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/5">
            <div className="text-[10px] text-slate-400">Hash Integritas</div>
            <div className="text-xs font-bold text-blue-300 font-mono mt-0.5">SHA-256 Valid</div>
          </div>
        </div>

        {/* Quick Security Toggles */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-[11px] text-slate-300">Auto-Strip Metadata Foto</span>
            <input
              type="checkbox"
              checked={autoStripExif}
              onChange={(e) => {
                setAutoStripExif(e.target.checked);
                onShowToast({
                  type: 'shield',
                  title: 'Konfigurasi Metadata',
                  message: e.target.checked 
                    ? 'Pembersihan otomatis EXIF dan koordinat GPS diaktifkan.'
                    : 'Pembersihan metadata dinonaktifkan.',
                });
              }}
              className="accent-cyan-400 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-[11px] text-slate-300">Strict Anti-XSS Sanitizer</span>
            <input
              type="checkbox"
              checked={strictXssFilter}
              onChange={(e) => {
                setStrictXssFilter(e.target.checked);
                onShowToast({
                  type: 'shield',
                  title: 'Filter Injeksi XSS',
                  message: e.target.checked 
                    ? 'Filter anti-injeksi script level ketat diaktifkan.'
                    : 'Filter script berada pada mode standar.',
                });
              }}
              className="accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Verified Security Researchers (Who to follow) */}
      <div className="p-4 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Peneliti Keamanan Terverifikasi
        </h3>

        <div className="space-y-3">
          {WHO_TO_FOLLOW.map((researcher) => {
            const isFollowing = followingMap[researcher.handle];

            return (
              <div 
                key={researcher.handle}
                className="flex items-center justify-between gap-2 p-2 rounded-2xl hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={researcher.avatar}
                    alt={researcher.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {researcher.name}
                      </span>
                      <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      @{researcher.handle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(researcher.handle)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 border border-white/10 hover:border-rose-500/50 hover:text-rose-300'
                      : 'bg-white text-slate-950 hover:bg-cyan-200'
                  }`}
                >
                  {isFollowing ? 'Mengikuti' : 'Ikuti'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-4 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Tren Kriptografi & Keamanan
        </h3>

        <div className="space-y-3">
          {TRENDING_SECURITY_TOPICS.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => onSelectTag(topic.tag)}
              className="group cursor-pointer p-2 rounded-2xl hover:bg-slate-800/40 transition-colors"
            >
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>{topic.category}</span>
                <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Lihat
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {topic.tag}
              </div>
              <div className="text-[10px] text-slate-400">{topic.postsCount}</div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
