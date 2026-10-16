import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import PostComposer from './components/PostComposer';
import TweetCard from './components/TweetCard';
import Toast from './components/Toast';
import SecurityInspectModal from './components/SecurityInspectModal';
import ReplyModal from './components/ReplyModal';
import SecurityCenterView from './components/SecurityCenterView';
import ProfileView from './components/ProfileView';
import { INITIAL_TWEETS } from './data/mockData';
import { 
  Home, 
  Lock, 
  ShieldCheck, 
  Bookmark, 
  User, 
  Search, 
  Filter,
  CheckCircle2,
  Unlock,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState(INITIAL_TWEETS);
  const [activeView, setActiveView] = useState('feed'); // 'feed' | 'vault' | 'security' | 'bookmarks' | 'profile'
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'encrypted' | 'safe'
  const [searchQuery, setSearchQuery] = useState('');
  const [ghostMode, setGhostMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [inspectingPost, setInspectingPost] = useState(null);
  const [replyingPost, setReplyingPost] = useState(null);
  const [blockedAttacksCount, setBlockedAttacksCount] = useState(14);

  // Toast Notification helper (Strictly replaces native alert)
  const showToast = ({ type = 'info', title, message, duration = 4500 }) => {
    setToast({ type, title, message, duration });
  };

  // Add newly created post
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    if (newPost.sanitized) {
      setBlockedAttacksCount(prev => prev + 1);
    }
  };

  // Toggle Like
  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
        };
      }
      return p;
    }));
  };

  // Toggle Retweet
  const handleRetweet = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextRetweeted = !p.isRetweeted;
        return {
          ...p,
          isRetweeted: nextRetweeted,
          retweets: nextRetweeted ? (p.retweets || 0) + 1 : Math.max(0, (p.retweets || 0) - 1),
        };
      }
      return p;
    }));
    showToast({
      type: 'success',
      title: 'Dibagikan secara Aman',
      message: 'Postingan telah disebarkan ke jaringan terverifikasi Anda.',
    });
  };

  // Toggle Bookmark
  const handleBookmark = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextState = !p.isBookmarked;
        showToast({
          type: nextState ? 'shield' : 'info',
          title: nextState ? 'Disimpan ke Brankas' : 'Dihapus dari Simpanan',
          message: nextState 
            ? 'Postingan dienkripsi dan disimpan ke brankas lokal peramban Anda.'
            : 'Postingan dikeluarkan dari brankas tersimpan.',
        });
        return { ...p, isBookmarked: nextState };
      }
      return p;
    }));
  };

  // Save Decrypted Content to local post state
  const handleDecrypted = (postId, decryptedText) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isDecrypted: true,
          decryptedContent: decryptedText,
        };
      }
      return p;
    }));
  };

  // Append Reply to post
  const handleReplySubmitted = (postId, newReply) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedList = [...(p.repliesList || []), newReply];
        return {
          ...p,
          replies: updatedList.length,
          repliesList: updatedList,
        };
      }
      return p;
    }));
  };

  // Filter posts based on view, feed filter, and search
  const filteredPosts = posts.filter(post => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (post.decryptedContent || post.content || '').toLowerCase().includes(q);
      const matchAuthor = (post.author.name || '').toLowerCase().includes(q) || (post.author.handle || '').toLowerCase().includes(q);
      const matchTag = post.securityTags?.some(t => t.toLowerCase().includes(q));
      if (!matchText && !matchAuthor && !matchTag) return false;
    }

    // 2. View specific filters
    if (activeView === 'vault') {
      return post.isEncrypted;
    }
    if (activeView === 'bookmarks') {
      return post.isBookmarked;
    }

    // 3. Tab filter in main feed
    if (activeView === 'feed') {
      if (feedFilter === 'encrypted') return post.isEncrypted;
      if (feedFilter === 'safe') return !post.isEncrypted;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Notification (No alert() used) */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Security Modals */}
      {inspectingPost && (
        <SecurityInspectModal
          post={inspectingPost}
          onClose={() => setInspectingPost(null)}
          onShowToast={showToast}
        />
      )}

      {replyingPost && (
        <ReplyModal
          targetPost={replyingPost}
          onClose={() => setReplyingPost(null)}
          onReplySubmitted={handleReplySubmitted}
          onShowToast={showToast}
          ghostMode={ghostMode}
        />
      )}

      {/* Top Glassmorphic Navigation Bar */}
      <Navbar
        securityScore={100}
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        ghostMode={ghostMode}
        setGhostMode={setGhostMode}
        onShowToast={showToast}
      />

      {/* Main 3-Column Twitter Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full flex-1 flex justify-center gap-0 lg:gap-6">
        
        {/* Left Sidebar Navigation */}
        <SidebarLeft
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenComposer={() => {
            setActiveView('feed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          ghostMode={ghostMode}
          postCount={posts.length}
        />

        {/* Center Main Feed Column */}
        <main className="flex-1 max-w-2xl min-w-0 py-4 px-2 sm:px-0">
          
          {/* Security Center Full View */}
          {activeView === 'security' && (
            <SecurityCenterView
              onShowToast={showToast}
              blockedAttacksCount={blockedAttacksCount}
            />
          )}

          {/* Profile View */}
          {activeView === 'profile' && (
            <ProfileView
              userPosts={posts}
              onLike={handleLike}
              onRetweet={handleRetweet}
              onBookmark={handleBookmark}
              onOpenReply={(post) => setReplyingPost(post)}
              onOpenInspect={(post) => setInspectingPost(post)}
              onDecrypted={handleDecrypted}
              onShowToast={showToast}
              ghostMode={ghostMode}
            />
          )}

          {/* Feeds View (Main, Vault, Bookmarks) */}
          {activeView !== 'security' && activeView !== 'profile' && (
            <div className="space-y-4">
              
              {/* Header Title for specific views */}
              {activeView === 'vault' && (
                <div className="p-4 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h2 className="text-sm font-bold text-white">Brankas Terenkripsi (E2EE Vault)</h2>
                      <p className="text-[11px] text-slate-400">Hanya menampilkan postingan dengan enkripsi AES-256-GCM klien.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-full">
                    {filteredPosts.length} Terkunci
                  </span>
                </div>
              )}

              {activeView === 'bookmarks' && (
                <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-5 h-5 text-purple-400" />
                    <div>
                      <h2 className="text-sm font-bold text-white">Postingan Tersimpan (Bookmarks)</h2>
                      <p className="text-[11px] text-slate-400">Daftar postingan penting yang diamankan di brankas peramban Anda.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full">
                    {filteredPosts.length} Item
                  </span>
                </div>
              )}

              {/* Feed Compose Box (Active on 'feed') */}
              {activeView === 'feed' && (
                <PostComposer
                  onPostCreated={handlePostCreated}
                  onShowToast={showToast}
                  ghostMode={ghostMode}
                />
              )}

              {/* Feed Filter Tabs (Home Feed Only) */}
              {activeView === 'feed' && (
                <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 mb-4 text-xs font-bold">
                  <button
                    onClick={() => setFeedFilter('all')}
                    className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                      feedFilter === 'all'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua Feed ({posts.length})
                  </button>
                  <button
                    onClick={() => setFeedFilter('encrypted')}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      feedFilter === 'encrypted'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Terenkripsi E2EE</span>
                  </button>
                  <button
                    onClick={() => setFeedFilter('safe')}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      feedFilter === 'safe'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Publik Terverifikasi</span>
                  </button>
                </div>
              )}

              {/* Search Active Filter Indicator */}
              {searchQuery && (
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>Hasil pencarian untuk: <strong className="text-cyan-300">"{searchQuery}"</strong></span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    Hapus Filter
                  </button>
                </div>
              )}

              {/* Tweets List */}
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 text-slate-400 text-xs space-y-2">
                  <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="font-semibold text-slate-300">Tidak ada postingan yang sesuai filter saat ini.</p>
                  <p>Coba ubah kata kunci pencarian atau buat postingan baru.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <TweetCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onRetweet={handleRetweet}
                    onBookmark={handleBookmark}
                    onOpenReply={(p) => setReplyingPost(p)}
                    onOpenInspect={(p) => setInspectingPost(p)}
                    onDecrypted={handleDecrypted}
                    onShowToast={showToast}
                  />
                ))
              )}

            </div>
          )}

        </main>

        {/* Right Sidebar (Defense Stats & Trends) */}
        <SidebarRight
          onSelectTag={(tag) => {
            setSearchQuery(tag);
            setActiveView('feed');
          }}
          blockedAttacksCount={blockedAttacksCount}
          onShowToast={showToast}
        />

      </div>

      {/* Mobile Bottom Navigation Bar (Glassmorphic) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-t border-white/10 py-2 px-6 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveView('feed')}
          className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
            activeView === 'feed' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Beranda</span>
        </button>
        <button
          onClick={() => setActiveView('vault')}
          className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
            activeView === 'vault' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px]">Brankas</span>
        </button>
        <button
          onClick={() => setActiveView('security')}
          className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
            activeView === 'security' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Keamanan</span>
        </button>
        <button
          onClick={() => setActiveView('profile')}
          className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
            activeView === 'profile' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </button>
      </nav>

    </div>
  );
}
