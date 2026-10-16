import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageCircle, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { sanitizeContent } from '../utils/crypto';

export default function ReplyModal({ targetPost, onClose, onReplySubmitted, onShowToast, ghostMode }) {
  const [replyText, setReplyText] = useState('');

  if (!targetPost) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const sanitized = sanitizeContent(replyText);

    const newReply = {
      id: `rep-${Date.now()}`,
      author: {
        name: ghostMode ? 'Peneliti Anonim (Ghost)' : CURRENT_USER.name,
        handle: ghostMode ? 'masked_identity' : CURRENT_USER.handle,
        avatar: ghostMode 
          ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' 
          : CURRENT_USER.avatar,
      },
      content: sanitized.safeText,
      timestamp: 'Baru saja',
    };

    onReplySubmitted(targetPost.id, newReply);
    onClose();
    onShowToast({
      type: 'success',
      title: 'Balasan Terkirim',
      message: 'Balasan terenkripsi Anda berhasil ditambahkan ke utas.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl overflow-hidden p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Balas Postingan Terverifikasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Post Quote */}
        <div className="my-4 p-3 rounded-2xl bg-slate-950/50 border border-white/5 flex gap-3 text-xs">
          <img
            src={targetPost.author.avatar}
            alt={targetPost.author.name}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-white truncate">
              {targetPost.author.name} <span className="font-normal text-slate-400">@{targetPost.author.handle}</span>
            </div>
            <p className="text-slate-300 line-clamp-2 mt-0.5">
              {targetPost.decryptedContent || (targetPost.isEncrypted ? '[Pesan Terenkripsi AES-256]' : targetPost.content)}
            </p>
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Tulis balasan yang aman dan terverifikasi..."
            className="w-full p-3 text-sm rounded-2xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            autoFocus
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Sanitasi Klien Aktif
            </span>

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Balasan</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
