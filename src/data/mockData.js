/**
 * Mock Data for CipherX
 * Strictly complies with security guidelines: all identities and posts are dummy/mock data.
 * Zero personal or real-world credentials.
 * Emojis are strictly omitted in favor of modern SVG icons.
 */

export const CURRENT_USER = {
  id: 'usr_secure_9921',
  name: 'Budi Santoso',
  handle: 'budisantoso_sec',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Cybersecurity Analyst & Cryptography Enthusiast. Focused on zero-trust architectures and client-side encryption.',
  joined: 'Oktober 2024',
  following: 142,
  followers: 1890,
  isVerified: true,
  securityLevel: 'Maximum (E2EE Active)',
  fingerprint: '0x9E82...B41A',
};

export const INITIAL_TWEETS = [
  {
    id: 'post-101',
    author: {
      id: 'usr_sarah_77',
      name: 'Sarah Rahmawati',
      handle: 'sarah_infosec',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      roleBadge: 'Security Researcher',
    },
    content: 'Pentingnya implementasi Web Crypto API langsung di client: data dienkripsi dengan AES-256-GCM sebelum menyentuh jaringan. Server sekalipun tidak bisa mengintip plaintext pengguna. Ini pondasi zero-knowledge architecture.',
    timestamp: '15m yang lalu',
    createdAt: Date.now() - 15 * 60 * 1000,
    likes: 42,
    retweets: 18,
    replies: 7,
    isLiked: false,
    isBookmarked: true,
    isEncrypted: false,
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sanitized: false,
    securityTags: ['#Cryptography', '#WebCrypto', '#ZeroKnowledge'],
    repliesList: [
      {
        id: 'rep-1',
        author: {
          name: 'Rian Pratama',
          handle: 'rian_devsec',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        content: 'Betul sekali, ditambah PBKDF2 dengan 100.000 iterasi untuk mitigasi serangan brute-force dictionary pada kunci derivasi.',
        timestamp: '10m yang lalu',
      }
    ],
  },
  {
    id: 'post-102',
    author: {
      id: 'usr_cipher_bot',
      name: 'Cyber Sentinel',
      handle: 'sentinel_shield',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      roleBadge: 'Automated Defense System',
    },
    content: '{"alg":"AES-256-GCM","kdf":"PBKDF2-SHA256-100k","salt":"X7k92MqpL91zW0vb==Xq","iv":"m8N7xKlP2A1w","ciphertext":"F73xL9N01xPqQ89wRtZKm123oPqX99aaBvcLmn01kLopQrStUv=="}',
    plainTextMock: 'Laporan Intelijen Ancaman: 12 upaya injeksi XSS dan eksfiltrasi session cookies berhasil dinetralkan secara otomatis oleh filter client-side Content Security Policy kami.',
    passphraseHint: 'Kunci demonstrasi default: rahasia123',
    demoPassphrase: 'rahasia123',
    timestamp: '1 jam yang lalu',
    createdAt: Date.now() - 60 * 60 * 1000,
    likes: 89,
    retweets: 34,
    replies: 12,
    isLiked: true,
    isBookmarked: false,
    isEncrypted: true,
    isDecrypted: false,
    integrityHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    sanitized: false,
    securityTags: ['#Confidential', '#ThreatIntel', '#E2EE'],
    repliesList: [],
  },
  {
    id: 'post-103',
    author: {
      id: 'usr_dewi_auditor',
      name: 'Dewi Lestari',
      handle: 'dewi_auditsec',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      roleBadge: 'Lead Security Auditor',
    },
    content: 'Hasil audit keamanan metadata media: Saat pengguna mengunggah foto ke CipherX, seluruh tag EXIF (termasuk koordinat GPS presisi dan serial kamera) di-raster ulang via Offscreen Canvas secara lokal. Privasi lokasi Anda 100% terlindungi.',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    mediaMetadataCleaned: true,
    timestamp: '3 jam yang lalu',
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    likes: 120,
    retweets: 51,
    replies: 9,
    isLiked: false,
    isBookmarked: true,
    isEncrypted: false,
    integrityHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    sanitized: false,
    securityTags: ['#MetadataStripping', '#PrivacyProtection', '#EXIFPurge'],
    repliesList: [],
  },
];

export const WHO_TO_FOLLOW = [
  {
    name: 'Dimas Kurniawan',
    handle: 'dimas_crypto',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Zero-Knowledge Cryptographer',
    isVerified: true,
  },
  {
    name: 'Kezia Anggraini',
    handle: 'kezia_redteam',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Penetration Tester & AppSec',
    isVerified: true,
  },
  {
    name: 'Open Privacy Lab',
    handle: 'privacy_lab',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&auto=format&fit=crop&q=80',
    bio: 'Open Source Security Research',
    isVerified: true,
  },
];

export const TRENDING_SECURITY_TOPICS = [
  { tag: '#ZeroKnowledgeProofs', postsCount: '14.2K postingan', category: 'Kriptografi' },
  { tag: '#AES256GCM', postsCount: '8.9K postingan', category: 'Standar Enkripsi' },
  { tag: '#ContentSecurityPolicy', postsCount: '5.1K postingan', category: 'Web Application Security' },
  { tag: '#ExifMetadataStripping', postsCount: '3.4K postingan', category: 'Privasi Pengguna' },
  { tag: '#AntiXSSDefense', postsCount: '2.8K postingan', category: 'Vulnerability Defense' },
];
