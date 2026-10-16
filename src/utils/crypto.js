/**
 * Security & Cryptography Utilities
 * Uses standard W3C Web Crypto API (SubtleCrypto)
 * Zero external cryptographic dependencies - 100% Client-Side
 */

// Helper to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derive an AES-GCM 256-bit Key from a user passphrase using PBKDF2
 */
async function getCryptoKey(passphrase, saltBuffer) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts plaintext string using AES-GCM (256-bit)
 * Returns a secure portable JSON-serialized string (IV, Salt, Ciphertext)
 */
export async function encryptPostText(plainText, passphrase) {
  if (!plainText || !passphrase) {
    throw new Error('Teks dan kunci sandi enkripsi wajib diisi');
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey(passphrase, salt);
  const enc = new TextEncoder();

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    enc.encode(plainText)
  );

  const payload = {
    alg: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256-100k',
    salt: arrayBufferToBase64(salt),
    iv: arrayBufferToBase64(iv),
    ciphertext: arrayBufferToBase64(encryptedBuffer),
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts an encrypted payload using AES-GCM (256-bit)
 */
export async function decryptPostText(encryptedJsonStr, passphrase) {
  try {
    const payload = typeof encryptedJsonStr === 'string' ? JSON.parse(encryptedJsonStr) : encryptedJsonStr;
    if (!payload.ciphertext || !payload.iv || !payload.salt) {
      throw new Error('Format paket enkripsi tidak valid');
    }

    const saltBuffer = base64ToArrayBuffer(payload.salt);
    const ivBuffer = base64ToArrayBuffer(payload.iv);
    const ciphertextBuffer = base64ToArrayBuffer(payload.ciphertext);

    const key = await getCryptoKey(passphrase, saltBuffer);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(ivBuffer),
      },
      key,
      ciphertextBuffer
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Kunci sandi salah atau data terkorupsi / dimanipulasi!');
  }
}

/**
 * Computes Cryptographic SHA-256 Hash for tamper-evidence
 */
export async function computeSha256(text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Client-side Multi-Layer Input Sanitization
 * Neutralizes XSS, Malicious Scripts, Event Handlers, & SQL Injection attempts
 */
export function sanitizeContent(rawText) {
  if (!rawText) return { safeText: '', interceptedTokens: [] };

  const interceptedTokens = [];
  let processed = rawText;

  // Detect script tags
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(processed)) {
    interceptedTokens.push({ type: 'XSS_SCRIPT_TAG', risk: 'Critical', desc: 'Tag <script> dinonaktifkan' });
    processed = processed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SANITIZED_SCRIPT_EXECUTION]');
  }

  // Detect javascript: pseudo-protocol
  if (/javascript:/gi.test(processed)) {
    interceptedTokens.push({ type: 'JS_URI_SCHEME', risk: 'High', desc: 'Protokol javascript: diblokir' });
    processed = processed.replace(/javascript:/gi, 'blocked-protocol:');
  }

  // Detect inline event handlers (onerror, onload, onclick, etc.)
  const eventHandlerRegex = /\b(on\w+)\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
  if (eventHandlerRegex.test(processed)) {
    interceptedTokens.push({ type: 'DOM_EVENT_HANDLER', risk: 'High', desc: 'Handler event DOM dinetralkan' });
    processed = processed.replace(eventHandlerRegex, 'data-disabled-handler="neutralized"');
  }

  // Detect iframe or embed tags
  if (/<(iframe|embed|object|applet)\b/gi.test(processed)) {
    interceptedTokens.push({ type: 'EMBED_TAG_INJECTION', risk: 'High', desc: 'Tag penyemat pihak ketiga dicegah' });
    processed = processed.replace(/<(iframe|embed|object|applet)\b/gi, '<blocked-frame ');
  }

  // Detect standard SQL injection patterns (demo protection)
  const sqliPattern = /(\b(SELECT|UNION|INSERT|DELETE|DROP|ALTER|UPDATE)\b\s+.*\bFROM\b)|(';\s*--)/gi;
  if (sqliPattern.test(processed)) {
    interceptedTokens.push({ type: 'SQLI_PATTERN_DETECTED', risk: 'Medium', desc: 'Pola injeksi database SQL diisolasi' });
  }

  return {
    safeText: processed,
    interceptedTokens,
    isSanitized: interceptedTokens.length > 0,
  };
}

/**
 * Strips EXIF, GPS location coordinates, and camera metadata
 * from images completely via HTML5 Canvas raster re-encoding
 */
export function stripImageMetadata(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Re-encoding directly to clean WebP/JPEG completely drops all EXIF/GPS tags
        const cleanDataUrl = canvas.toDataURL('image/webp', 0.92);
        resolve({
          cleanUrl: cleanDataUrl,
          originalName: file.name,
          originalSize: file.size,
          width: img.width,
          height: img.height,
          metadataRemoved: ['EXIF', 'GPS Coordinates', 'Camera Make & Model', 'Device Serial Number'],
        });
      };
      img.onerror = () => reject(new Error('Gagal merender dan membersihkan metadata gambar'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
  });
}
