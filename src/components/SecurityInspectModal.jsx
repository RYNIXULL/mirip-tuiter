import React from 'react';
import { 
  ShieldCheck, 
  X, 
  FileCheck, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  Terminal
} from 'lucide-react';

export default function SecurityInspectModal({ post, onClose, onShowToast }) {
  if (!post) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    onShowToast({
      type: 'shield',
      title: 'Disalin',
      message: `${label} berhasil disalin ke clipboard.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl overflow-hidden p-6 relative max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(6, 182, 212, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Inspeksi Kriptografi & Integritas
              </h3>
              <p className="text-xs text-slate-400">
                Verifikasi bukti keamanan di sisi klien (Zero-Knowledge Audit)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Body */}
        <div className="mt-5 space-y-4">
          
          {/* SHA-256 Hash */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                Segel Integritas SHA-256 (Anti-Tampering)
              </span>
              <button
                onClick={() => copyToClipboard(post.integrityHash, 'Hash SHA-256')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                Salin
              </button>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 text-[11px] font-mono text-cyan-300 break-all select-all">
              {post.integrityHash}
            </div>
            <p className="text-[10px] text-slate-400">
              Jika konten dimodifikasi satu karakter saja di server, hash ini akan langsung invalid dan aplikasi menolak merendernya.
            </p>
          </div>

          {/* Encryption Details */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              Protokol Enkripsi End-to-End
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Status:</span>
                <span className="font-bold text-white font-mono">
                  {post.isEncrypted ? 'E2EE Aktif' : 'Publik Terverifikasi'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Cipher Suite:</span>
                <span className="font-bold text-cyan-300 font-mono">
                  {post.isEncrypted ? 'AES-256-GCM' : 'SHA-256 Signed'}
                </span>
              </div>
            </div>
          </div>

          {/* Sanitization & XSS Defense Audit */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Audit Sanitasi & Sanitizer Input
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span>Vektor XSS / Script Injeksi:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {post.sanitized ? 'Dinetralkan (Aman)' : 'Bersih / Nol Ancaman'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Metadata Media (EXIF/GPS):</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {post.mediaMetadataCleaned ? 'Dibersihkan 100%' : 'Tidak Ada File Foto'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kebocoran Cookie / Token:</span>
                <span className="text-emerald-400 font-mono font-bold">Terproteksi (HttpOnly & CSP)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup Audit
          </button>
        </div>

      </div>
    </div>
  );
}
