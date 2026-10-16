import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Key, 
  Lock, 
  Calendar, 
  Check, 
  Copy, 
  Fingerprint,
  FileCheck
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import TweetCard from './TweetCard';

export default function ProfileView({ 
  userPosts, 
  onLike, 
  onRetweet, 
  onBookmark, 
  onOpenReply, 
  onOpenInspect, 
  onDecrypted,
  onShowToast,
  ghostMode 
}) {
  const [activeTab, setActiveTab] = useState('posts');

  const copyFingerprint = () => {
    navigator.clipboard.writeText(CURRENT_USER.fingerprint);
    onShowToast({
      type: 'shield',
      title: 'Fingerprint Disalin',
      message: 'Fingerprint sesi kriptografi disalin ke clipboard.',
    });
  };

  const myPosts = userPosts.filter(p => p.author.handle === CURRENT_USER.handle || (ghostMode && p.author.handle === 'masked_identity'));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm overflow-hidden">
        
        {/* Banner with subtle geometric gradient */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 relative border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
            <span>{ghostMode ? 'MASKED_IDENTITY' : CURRENT_USER.fingerprint}</span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-4">
            
            {/* Avatar */}
            <div className="relative">
              <img
                src={ghostMode ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' : CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-900 bg-slate-950 shadow-xl"
              />
              {!ghostMode && (
                <div className="absolute bottom-1 right-1 p-1 rounded-full bg-cyan-400 text-slate-950">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyFingerprint}
                className="px-4 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salin Sidik Jari Sesi</span>
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {ghostMode ? 'Peneliti Anonim (Ghost Mode)' : CURRENT_USER.name}
                {!ghostMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Terverifikasi
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                @{ghostMode ? 'masked_identity' : CURRENT_USER.handle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {CURRENT_USER.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Bergabung {CURRENT_USER.joined}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tingkat Keamanan: {CURRENT_USER.securityLevel}</span>
              </div>
            </div>

            {/* Following & Followers count */}
            <div className="flex items-center gap-4 text-xs pt-2">
              <div>
                <span className="font-bold text-white">{CURRENT_USER.following}</span>{' '}
                <span className="text-slate-400">Mengikuti</span>
              </div>
              <div>
                <span className="font-bold text-white">{CURRENT_USER.followers}</span>{' '}
                <span className="text-slate-400">Pengikut</span>
              </div>
              <div>
                <span className="font-bold text-cyan-400">{myPosts.length}</span>{' '}
                <span className="text-slate-400">Postingan Aman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-white/10 px-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'posts'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Postingan Saya ({myPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'keys'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Kunci & Sertifikat Kriptografi
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' ? (
        <div>
          {myPosts.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-white/10 text-slate-400 text-xs">
              Belum ada postingan yang dipublikasikan oleh akun ini. Gunakan fitur "Posting Aman" di atas untuk memulai!
            </div>
          ) : (
            myPosts.map((post) => (
              <TweetCard
                key={post.id}
                post={post}
                onLike={onLike}
                onRetweet={onRetweet}
                onBookmark={onBookmark}
                onOpenReply={onOpenReply}
                onOpenInspect={onOpenInspect}
                onDecrypted={onDecrypted}
                onShowToast={onShowToast}
              />
            ))
          )}
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Kunci Publik & Parameter Kriptografis Klien
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400">Algoritma Enkripsi Standar:</span>
              <div className="font-mono text-cyan-300 font-bold">AES-256-GCM (W3C Web Crypto)</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400">Key Derivation Function:</span>
              <div className="font-mono text-emerald-300 font-bold">PBKDF2-HMAC-SHA256 &bull; 100.000 Iterasi &bull; Garam Dinamis 16-Byte</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400">Fingerprint Identitas Klien:</span>
              <div className="font-mono text-slate-300 break-all select-all">{CURRENT_USER.fingerprint} (Active Session Token)</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
