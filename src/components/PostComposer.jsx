import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  Key, 
  Send,
  Hash,
  EyeOff
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { 
  encryptPostText, 
  computeSha256, 
  sanitizeContent, 
  stripImageMetadata 
} from '../utils/crypto';

export default function PostComposer({ onPostCreated, onShowToast, ghostMode }) {
  const [content, setContent] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [ttlMinutes, setTtlMinutes] = useState('off');
  const [mediaData, setMediaData] = useState(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [sanitizationAudit, setSanitizationAudit] = useState(null);

  const fileInputRef = useRef(null);
  const MAX_CHARS = 280;

  // Real-time analysis of potential malicious payloads
  useEffect(() => {
    if (content.length > 0) {
      const audit = sanitizeContent(content);
      if (audit.isSanitized) {
        setSanitizationAudit(audit);
      } else {
        setSanitizationAudit(null);
      }
    } else {
      setSanitizationAudit(null);
    }
  }, [content]);

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingMedia(true);
      const cleaned = await stripImageMetadata(file);
      setMediaData(cleaned);
      onShowToast({
        type: 'shield',
        title: 'Metadata Dihapus Otomatis',
        message: 'Tag EXIF, koordinat GPS, dan identitas kamera berhasil dibersihkan dari gambar.',
      });
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Gagal Memproses Gambar',
        message: err.message,
      });
    } finally {
      setIsProcessingMedia(false);
    }
  };

  const handleRemoveMedia = () => {
    setMediaData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !mediaData) {
      onShowToast({
        type: 'warning',
        title: 'Konten Kosong',
        message: 'Tuliskan pesan atau lampirkan gambar aman sebelum mengirim.',
      });
      return;
    }

    if (isEncrypted && (!passphrase || passphrase.length < 4)) {
      onShowToast({
        type: 'warning',
        title: 'Kunci Sandi Diperlukan',
        message: 'Masukkan kunci sandi enkripsi minimal 4 karakter untuk mengunci postingan.',
      });
      return;
    }

    try {
      // 1. Sanitize text client-side
      const sanitizationResult = sanitizeContent(content);
      const safeText = sanitizationResult.safeText;

      let postPayload = safeText;
      let isActuallyEncrypted = false;

      // 2. Client-side End-to-End Encryption if toggled
      if (isEncrypted) {
        postPayload = await encryptPostText(safeText, passphrase);
        isActuallyEncrypted = true;
      }

      // 3. Compute Cryptographic SHA-256 Hash for Tamper Detection
      const integrityHash = await computeSha256(postPayload);

      // 4. Assemble post object
      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          id: ghostMode ? 'usr_ghost_anon' : CURRENT_USER.id,
          name: ghostMode ? 'Peneliti Anonim (Ghost)' : CURRENT_USER.name,
          handle: ghostMode ? 'masked_identity' : CURRENT_USER.handle,
          avatar: ghostMode 
            ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' 
            : CURRENT_USER.avatar,
          isVerified: !ghostMode,
          roleBadge: ghostMode ? 'Identitas Terenkripsi' : 'Pengguna Terverifikasi',
        },
        content: postPayload,
        plainTextMock: isActuallyEncrypted ? safeText : null,
        demoPassphrase: isActuallyEncrypted ? passphrase : null,
        timestamp: 'Baru saja',
        createdAt: Date.now(),
        likes: 0,
        retweets: 0,
        replies: 0,
        isLiked: false,
        isBookmarked: false,
        isEncrypted: isActuallyEncrypted,
        isDecrypted: false,
        integrityHash,
        sanitized: sanitizationResult.isSanitized,
        interceptedTokens: sanitizationResult.interceptedTokens,
        mediaUrl: mediaData?.cleanUrl || null,
        mediaMetadataCleaned: !!mediaData,
        securityTags: selectedTag ? [selectedTag] : ['#CipherX', '#ClientSecured'],
        ttlMinutes: ttlMinutes !== 'off' ? parseInt(ttlMinutes, 10) : null,
        repliesList: [],
      };

      onPostCreated(newPost);

      // Reset form
      setContent('');
      setIsEncrypted(false);
      setPassphrase('');
      setMediaData(null);
      setSelectedTag('');
      setTtlMinutes('off');
      if (fileInputRef.current) fileInputRef.current.value = '';

      onShowToast({
        type: isActuallyEncrypted ? 'shield' : 'success',
        title: isActuallyEncrypted ? 'Terenkripsi E2EE' : 'Postingan Diterbitkan',
        message: isActuallyEncrypted
          ? 'Postingan dienkripsi di peramban dengan AES-256-GCM sebelum diterbitkan.'
          : 'Postingan aman berhasil dipublikasikan dengan tanda tangan SHA-256.',
      });

    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Kesalahan Enkripsi',
        message: err.message,
      });
    }
  };

  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm transition-all mb-6">
      <div className="flex gap-3.5">
        
        {/* User Avatar */}
        <div className="shrink-0 pt-1">
          <img
            src={ghostMode ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' : CURRENT_USER.avatar}
            alt="Profil"
            className="w-10 h-10 rounded-full object-cover border border-white/15"
          />
        </div>

        {/* Input & Controls */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isEncrypted 
                  ? "Tulis pesan rahasia... teks akan otomatis dienkripsi dengan AES-256-GCM di sisi klien."
                  : "Apa temuan keamanan atau pemikiran aman Anda hari ini?"
              }
              className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
            />

            {/* Live XSS/Injection Sanitization Warning */}
            {sanitizationAudit && (
              <div className="mb-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pertahanan Proaktif: </span>
                  Input mengandung vektor tidak aman (
                  {sanitizationAudit.interceptedTokens.map(t => t.desc).join(', ')}
                  ). Sistem akan menetralkannya secara otomatis saat diterbitkan.
                </div>
              </div>
            )}

            {/* Media Preview Box */}
            {mediaData && (
              <div className="relative mb-3 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/60 max-w-sm">
                <img
                  src={mediaData.cleanUrl}
                  alt="Lampiran Bersih"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>EXIF & GPS Dihapus</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-white border border-white/10 transition-colors"
                  title="Hapus Gambar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* E2EE Passphrase Drawer */}
            {isEncrypted && (
              <div className="mb-3 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-cyan-400" />
                    Kunci Sandi Enkripsi E2EE (Passphrase)
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300">
                    PBKDF2 + AES-256
                  </span>
                </div>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Masukkan kunci sandi untuk membuka pesan ini (cth: rahasia123)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-xs"
                />
                <p className="text-[10px] text-slate-400">
                  Hanya pembaca yang mengetahui kunci sandi ini yang dapat mendekripsi dan membaca pesan asli Anda.
                </p>
              </div>
            )}

            {/* Bottom Toolbar & Action Bar */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              
              {/* Media, Encrypt, Timer Toggles */}
              <div className="flex items-center gap-1 sm:gap-2">
                
                {/* Image Upload Button */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-uploader"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl hover:bg-slate-800/60 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-xs"
                  title="Lampirkan Gambar (Metadata EXIF akan otomatis dibersihkan)"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs text-slate-300">Foto Bersih</span>
                </button>

                {/* E2EE Encrypt Toggle */}
                <button
                  type="button"
                  onClick={() => setIsEncrypted(!isEncrypted)}
                  className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                    isEncrypted
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'border-white/10 text-slate-300 hover:bg-slate-800/60'
                  }`}
                  title="Aktifkan Enkripsi End-to-End di sisi browser"
                >
                  {isEncrypted ? <Lock className="w-3.5 h-3.5 text-cyan-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isEncrypted ? 'E2EE: Aktif' : 'E2EE: Publik'}</span>
                </button>

                {/* Ephemeral Timer Selector */}
                <div className="relative flex items-center gap-1 text-xs text-slate-300 px-2 py-1.5 rounded-xl border border-white/10 bg-slate-950/30">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={ttlMinutes}
                    onChange={(e) => setTtlMinutes(e.target.value)}
                    className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="off" className="bg-slate-900 text-slate-200">Hangus: Mati</option>
                    <option value="1" className="bg-slate-900 text-slate-200">1 Menit (Demo)</option>
                    <option value="5" className="bg-slate-900 text-slate-200">5 Menit</option>
                    <option value="60" className="bg-slate-900 text-slate-200">1 Jam</option>
                    <option value="1440" className="bg-slate-900 text-slate-200">24 Jam</option>
                  </select>
                </div>

                {/* Quick Tag Selector */}
                <div className="hidden lg:flex items-center gap-1 text-xs text-slate-300 px-2 py-1.5 rounded-xl border border-white/10 bg-slate-950/30">
                  <Hash className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-200">Pilih Topik</option>
                    <option value="#ZeroKnowledge" className="bg-slate-900 text-slate-200">#ZeroKnowledge</option>
                    <option value="#AES256GCM" className="bg-slate-900 text-slate-200">#AES256GCM</option>
                    <option value="#ThreatIntel" className="bg-slate-900 text-slate-200">#ThreatIntel</option>
                    <option value="#PrivacyFirst" className="bg-slate-900 text-slate-200">#PrivacyFirst</option>
                  </select>
                </div>

              </div>

              {/* Character counter & Submit Button */}
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono ${isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {remainingChars}
                </span>

                <button
                  type="submit"
                  disabled={isOverLimit || (!content.trim() && !mediaData) || isProcessingMedia}
                  className="px-4 py-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
