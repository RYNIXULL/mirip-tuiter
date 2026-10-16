import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  X 
} from 'lucide-react';

/**
 * Aesthetic Glassmorphic Toast Notification Component
 * Strictly replaces native alert() with sleek visual feedback.
 * No emojis used; pure modern SVG icons.
 */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/40 text-rose-100';
      case 'shield':
        return 'border-cyan-500/40 bg-cyan-950/40 text-cyan-100';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/40 text-amber-100';
      default:
        return 'border-blue-500/40 bg-blue-950/40 text-blue-100';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div 
        className={`backdrop-blur-md rounded-2xl p-4 shadow-2xl border ${getBorderColor()} flex items-start gap-3 relative overflow-hidden`}
        style={{
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 15px 0 rgba(6, 182, 212, 0.15)',
        }}
      >
        <div className="pt-0.5">{getIcon()}</div>
        <div className="flex-1 pr-2">
          {toast.title && (
            <h4 className="text-sm font-semibold tracking-wide text-white mb-0.5">
              {toast.title}
            </h4>
          )}
          <p className="text-xs text-slate-200 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Tutup Notifikasi"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar line */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-60 animate-pulse w-full"
        />
      </div>
    </div>
  );
}
