import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Heart, MessageCircle, Trash2, FolderOpen, Clock, Search, Filter, BookmarkCheck, X } from 'lucide-react';

// Skeleton loader (declared outside component to avoid re-creation on render)
const SavedSkeleton = () => (
  <div className="post-card" style={{ padding: 20, margin: 0, display: 'flex', gap: 16 }}>
    <div className="skeleton" style={{ width: 100, height: 80, borderRadius: 12, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div className="skeleton" style={{ width: '80%', height: 14, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 12 }} />
      <div className="skeleton" style={{ width: '40%', height: 10 }} />
    </div>
  </div>
);

const SavedPostsSection = ({ user }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Saved', icon: <Bookmark size={13} /> },
    { id: 'articles', label: 'Text Posts', icon: <Filter size={13} /> },
    { id: 'media', label: 'With Media', icon: <BookmarkCheck size={13} /> },
  ];

  // Load saved posts from localStorage (future: backend API)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        const stored = localStorage.getItem(`saved_posts_${user?.id}`);
        if (stored) {
          setSavedPosts(JSON.parse(stored));
        }
      } catch {
        // silently fail
      }
      setLoading(false);
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [user?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleRemoveSaved = (postId) => {
    setRemovingId(postId);
    setTimeout(() => {
      const updated = savedPosts.filter(p => p.id !== postId);
      setSavedPosts(updated);
      localStorage.setItem(`saved_posts_${user?.id}`, JSON.stringify(updated));
      setRemovingId(null);
    }, 200);
  };

  // Filter posts based on active tab and search
  const filteredPosts = savedPosts.filter(post => {
    const matchesTab = activeTab === 'all'
      || (activeTab === 'media' && post.imageUrl)
      || (activeTab === 'articles' && !post.imageUrl);
    const matchesSearch = !searchQuery
      || post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      || post.username?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Time ago helper
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'recently';
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Avatar color from username
  const avatarColor = (name) => {
    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#22C55E', '#06B6D4', '#EF4444'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <motion.div
      className="dash-feed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{ padding: '0 24px 40px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.02em' }}>
            <Bookmark size={24} style={{ color: 'var(--accent)' }} />
            Saved Posts
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            {savedPosts.length > 0
              ? `${savedPosts.length} post${savedPosts.length !== 1 ? 's' : ''} bookmarked for later`
              : 'Posts you bookmark will appear here'}
          </p>
        </div>

        {/* Count badge */}
        {savedPosts.length > 0 && (
          <div style={{
            padding: '8px 16px', borderRadius: 12,
            background: 'var(--accent-light)', color: 'var(--accent)',
            fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <BookmarkCheck size={14} />
            {savedPosts.length} saved
          </div>
        )}
      </div>

      {/* Search + Tabs */}
      {savedPosts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 12,
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s',
          }}>
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search saved posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex' }}
              >
                <X size={14} />
              </motion.button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
            {tabs.map(tab => {
              const count = tab.id === 'all' ? savedPosts.length
                : tab.id === 'media' ? savedPosts.filter(p => p.imageUrl).length
                : savedPosts.filter(p => !p.imageUrl).length;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '7px 14px', borderRadius: 9,
                    background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                    border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  <span style={{
                    padding: '1px 6px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                    color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SavedSkeleton />
          <SavedSkeleton />
          <SavedSkeleton />
        </div>
      )}

      {/* Empty State */}
      {!loading && savedPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: [0.23, 1, 0.32, 1] }}
          className="post-card"
          style={{
            padding: '80px 40px', margin: 0, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 88, height: 88, borderRadius: 24,
              background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, border: '1px solid var(--border-color)',
            }}
          >
            <FolderOpen size={38} style={{ color: 'var(--accent)' }} />
          </motion.div>
          <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>No saved posts yet</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, maxWidth: 340, lineHeight: 1.6 }}>
            When you bookmark a post from your feed, it will appear here for easy access later.
          </p>

          {/* How-to hint */}
          <div style={{
            marginTop: 28, padding: '14px 22px', borderRadius: 14,
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            fontSize: 13, color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bookmark size={15} style={{ color: 'var(--accent)' }} />
            </div>
            <span>Tap the <strong>bookmark icon</strong> on any post to save it here</span>
          </div>
        </motion.div>
      )}

      {/* No results from search/filter */}
      {!loading && savedPosts.length > 0 && filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="post-card"
          style={{
            padding: '50px 30px', margin: 0, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
          <Search size={32} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.5 }} />
          <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>No matching posts</h4>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>
            Try a different search term or filter
          </p>
        </motion.div>
      )}

      {/* Saved Posts List */}
      {!loading && filteredPosts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: removingId === post.id ? 0.4 : 1, y: 0, scale: removingId === post.id ? 0.97 : 1 }}
                exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                className="post-card"
                style={{
                  padding: 18, margin: 0, display: 'flex', gap: 14,
                  cursor: 'pointer', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {/* Thumbnail or avatar */}
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl.startsWith('/') ? `http://localhost:8095${post.imageUrl}` : post.imageUrl}
                    style={{
                      width: 96, height: 76, objectFit: 'cover', borderRadius: 12,
                      flexShrink: 0, background: 'var(--bg-tertiary)',
                    }}
                    alt="Post thumbnail"
                    loading="lazy"
                  />
                ) : (
                  <div style={{
                    width: 96, height: 76, borderRadius: 12, flexShrink: 0,
                    background: avatarColor(post.username),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 20, opacity: 0.8,
                  }}>
                    {(post.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: '0 0 8px', fontSize: 14, lineHeight: 1.5,
                    color: 'var(--text-primary)', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {post.content}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>@{post.username}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontVariantNumeric: 'tabular-nums' }}>
                      <Heart size={12} /> {post.likeCount || 0}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontVariantNumeric: 'tabular-nums' }}>
                      <MessageCircle size={12} /> {post.commentCount || 0}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {timeAgo(post.savedAt || post.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <motion.button
                  whileHover={{ scale: 1.1, color: '#EF4444' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); handleRemoveSaved(post.id); }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', padding: 8, borderRadius: 8,
                    transition: 'color 0.2s',
                    alignSelf: 'center', flexShrink: 0,
                  }}
                  aria-label="Remove from saved"
                >
                  <Trash2 size={17} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default SavedPostsSection;
