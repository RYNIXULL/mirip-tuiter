import React, { useState } from 'react';
import { 
  Heart, 
  Repeat2, 
  MessageCircle, 
  Bookmark, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Key, 
  Search, 
  Check, 
  Clock, 
  FileCheck,
  Share2
} from 'lucide-react';
import { decryptPostText } from '../utils/crypto';

export default function TweetCard({ 
  post, 
  onLike, 
  onRetweet, 
  onBookmark, 
  onOpenReply, 
  onOpenInspect, 
  onDecrypted,
  onShowToast 
}) {
  const [inlinePassphrase, setInlinePassphrase] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showDecryptDrawer, setShowDecryptDrawer] = useState(false);

  const handleInlineDecrypt = async (e) => {
    e.preventDefault();
    if (!inlinePassphrase) {
      onShowToast({
        type: 'warning',
        title: 'Kunci Sandi Diperlukan',
        message: 'Masukkan kunci sandi untuk mendekripsi ciphertext ini.',
      });
      return;
    }

    try {
      setIsDecrypting(true);
      let decryptedText = '';

      // Check if it's the mock post with demo passphrase or genuine WebCrypto encrypted payload
      if (post.demoPassphrase && inlinePassphrase === post.demoPassphrase) {
        decryptedText = post.plainTextMock;
      } else {
        // Run standard AES-GCM SubtleCrypto decryption
        decryptedText = await decryptPostText(post.content, inlinePassphrase);
      }

      onDecrypted(post.id, decryptedText);
      setShowDecryptDrawer(false);
      setInlinePassphrase('');
      onShowToast({
        type: 'success',
        title: 'Dekripsi Berhasil',
        message: 'Ciphertext berhasil didekripsi menjadi plaintext melalui Web Crypto API.',
      });
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Dekripsi Gagal',
        message: 'Kunci sandi tidak cocok atau integritas ciphertext rusak.',
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(post.integrityHash);
    onShowToast({
      type: 'shield',
      title: 'Hash Disalin',
      message: 'Hash integritas SHA-256 disalin ke clipboard untuk verifikasi independen.',
    });
  };

  return (
    <article className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all shadow-sm mb-4">
      <div className="flex gap-3 sm:gap-4">
        
        {/* Author Avatar with role badge */}
        <div className="shrink-0">
          <div className="relative">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-11 h-11 rounded-full object-cover border border-white/15"
            />
            {post.author.isVerified && (
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-cyan-500/40 text-cyan-400">
                <Check className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
        </div>

        {/* Post Content Body */}
        <div className="flex-1 min-w-0">
          
          {/* Header metadata */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                {post.author.name}
              </span>
              <span className="text-xs text-slate-400">
                @{post.author.handle}
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs text-slate-400">
                {post.timestamp}
              </span>
            </div>

            {/* Cryptographic SHA-256 seal tag */}
            <button
              onClick={copyHash}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
              title="Klik untuk menyalin SHA-256 Integrity Hash"
            >
              <FileCheck className="w-3 h-3 text-cyan-400" />
              <span>SHA-256: {post.integrityHash ? post.integrityHash.slice(0, 8) : 'VERIFIED'}...</span>
            </button>
          </div>

          {/* Role badge if available */}
          {post.author.roleBadge && (
            <div className="mb-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 border border-white/5">
                {post.author.roleBadge}
              </span>
            </div>
          )}

          {/* Self-Destruct Timer Badge if configured */}
          {post.ttlMinutes && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-medium">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Pesan Hangus Otomatis Aktif ({post.ttlMinutes}m)</span>
            </div>
          )}

          {/* Main Post Content Body */}
          {post.isEncrypted && !post.isDecrypted ? (
            
            /* Encrypted Lock State */
            <div className="my-3 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Konten Terenkripsi End-to-End (AES-256-GCM)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                  Zero-Knowledge Cipher
                </span>
              </div>

              {/* Ciphertext Preview */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] font-mono text-cyan-200/70 break-all select-all">
                {post.content.length > 120 ? `${post.content.slice(0, 120)}... [AES_CIPHERTEXT_LOCKED]` : post.content}
              </div>

              {/* Demo Passphrase Hint if present */}
              {post.passphraseHint && (
                <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                  {post.passphraseHint}
                </div>
              )}

              {/* Unlock Action */}
              {!showDecryptDrawer ? (
                <button
                  onClick={() => setShowDecryptDrawer(true)}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Kunci Enkripsi (Dekripsi di Sisi Klien)</span>
                </button>
              ) : (
                <form onSubmit={handleInlineDecrypt} className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Masukkan kunci sandi enkripsi..."
                      value={inlinePassphrase}
                      onChange={(e) => setInlinePassphrase(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-cyan-500/40 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isDecrypting}
                      className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Unlock className="w-3 h-3" />
                      <span>{isDecrypting ? 'Membuka...' : 'Buka'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDecryptDrawer(false)}
                      className="px-2 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>

          ) : (

            /* Normal or Decrypted Content Display */
            <div className="space-y-2 my-2">
              {post.isDecrypted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>Berhasil Didekripsi Secara Lokal</span>
                </div>
              )}

              {/* Post Text */}
              <p className="text-sm sm:text-base text-slate-100 whitespace-pre-wrap leading-relaxed break-words">
                {post.decryptedContent || post.content}
              </p>

              {/* Security tags */}
              {post.securityTags && post.securityTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.securityTags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attached Media */}
          {post.mediaUrl && (
            <div className="mt-3 relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40 max-h-96">
              <img
                src={post.mediaUrl}
                alt="Lampiran Postingan"
                className="w-full object-cover"
              />
              {post.mediaMetadataCleaned && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Metadata EXIF & GPS Dibersihkan</span>
                </div>
              )}
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-slate-400 text-xs">
            
            {/* Reply */}
            <button
              onClick={() => onOpenReply(post)}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors p-1 rounded-lg group cursor-pointer"
              title="Balas Postingan"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{post.repliesList?.length || post.replies || 0}</span>
            </button>

            {/* Retweet */}
            <button
              onClick={() => onRetweet(post.id)}
              className={`flex items-center gap-1.5 transition-colors p-1 rounded-lg group cursor-pointer ${
                post.isRetweeted ? 'text-emerald-400' : 'hover:text-emerald-400'
              }`}
              title="Retweet / Bagikan Aman"
            >
              <Repeat2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{post.retweets || 0}</span>
            </button>

            {/* Like */}
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 transition-colors p-1 rounded-lg group cursor-pointer ${
                post.isLiked ? 'text-rose-400' : 'hover:text-rose-400'
              }`}
              title="Sukai"
            >
              <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${post.isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{post.likes || 0}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onBookmark(post.id)}
              className={`flex items-center gap-1.5 transition-colors p-1 rounded-lg group cursor-pointer ${
                post.isBookmarked ? 'text-purple-400' : 'hover:text-purple-400'
              }`}
              title="Simpan ke Brankas"
            >
              <Bookmark className={`w-4 h-4 group-hover:scale-110 transition-transform ${post.isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
            </button>

            {/* Security Inspect Modal Trigger */}
            <button
              onClick={() => onOpenInspect(post)}
              className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-cyan-500/10 transition-all cursor-pointer"
              title="Audit Kriptografi & Integritas"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit</span>
            </button>

          </div>

        </div>

      </div>
    </article>
  );
}
