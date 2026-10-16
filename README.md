# CipherX — Ultra-Secure Zero-Knowledge Social Network

A high-security, end-to-end encrypted Twitter/X-style web application built with modern glassmorphism aesthetics, browser-native Web Crypto API, client-side payload sanitization, and automatic EXIF/GPS telemetry stripping.

---

## Fitur Utama Keamanan (Security Pillars)

1. **Client-Side End-to-End Encryption (E2EE)**
   - Algoritma standar: **AES-GCM (256-bit)** menggunakan W3C Web Crypto API native.
   - Derivasi Kunci: **PBKDF2-HMAC-SHA256** dengan 100.000 iterasi dan garam (salt) acak 16-byte untuk mitigasi serangan kamus/brute force.
   - Data pesan dienkripsi secara lokal sebelum menyentuh jaringan; server tidak pernah memiliki akses ke plaintext pesan pengguna.

2. **Segel Integritas Kriptografis (SHA-256 Anti-Tamper)**
   - Setiap postingan menghasilkan tanda tangan hash integritas SHA-256 secara langsung di peramban. Jika data dimodifikasi di transit, status verifikasi langsung gagal.

3. **Pembersihan Metadata Media Otomatis (EXIF & GPS Purge)**
   - Setiap unggahan foto diproses ulang via offscreen Canvas raster lokal, menghapus 100% tag EXIF, koordinat GPS presisi, model kamera, dan serial nomor perangkat sebelum ditampilkan atau dikirim.

4. **Pertahanan Proaktif Terhadap XSS & Injeksi**
   - Sanitizer multi-layer client-side mendeteksi dan menetralkan tag `<script>`, atribut event DOM inline (`onerror`, `onload`), dan skema URI berbahaya (`javascript:`).

5. **Aesthetic Glassmorphism & Modern UI**
   - Menggunakan perpaduan `backdrop-blur-md`, `bg-slate-900/60`, `border-white/10`, dan bayangan halus untuk menciptakan antarmuka *frosted glass* yang elegan.
   - Menggantikan seluruh `alert()` bawaan dengan **Custom Glassmorphic Toast Notification** dan Modal interaktif.
   - 100% bebas emotikon grafis kasual, menggunakan ikon vektor modern (Lucide SVG).

6. **Pusat Keamanan & Simulator Uji Ketahanan (Security Center)**
   - Dilengkapi tool simulator untuk menguji ketahanan input terhadap payload XSS dan SQLi secara real-time.
   - Menampilkan skor keamanan (100/100 A+) dan catatan audit event kriptografis.

---

## Panduan Menjalankan Aplikasi

Pastikan Node.js (v18+) sudah terpasang di komputer Anda.

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev
```

Buka peramban di `http://localhost:5173/`.

---

## Konfigurasi Lingkungan

Salin file `.env.example` menjadi `.env` jika diperlukan:

```bash
cp .env.example .env
```

> **Catatan Keamanan**: File `.env` tidak pernah di-commit ke repositori git sesuai standar keamanan GitHub.
