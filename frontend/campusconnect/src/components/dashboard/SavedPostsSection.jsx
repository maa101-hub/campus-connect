import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Heart, MessageCircle, Trash2, FolderOpen, Clock } from 'lucide-react';

// For now saved posts are stored locally (future: backend support)
// eslint-disable-next-line no-unused-vars
const SavedPostsSection = ({ user }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Saved' },
    { id: 'articles', label: 'Articles' },
    { id: 'media', label: 'Media' },
  ];

  const handleRemoveSaved = (postId) => {
    setSavedPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <motion.div
      className="dash-feed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '0 24px 40px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px 0' }}>
          <Bookmark size={24} style={{ display: 'inline', marginRight: 10, color: 'var(--accent)' }} />
          Saved Posts
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Posts you've bookmarked for later reading
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: 12,
              background: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {savedPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="post-card"
          style={{
            padding: '80px 40px', margin: 0, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20
          }}>
            <FolderOpen size={36} style={{ color: 'var(--accent)' }} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>No saved posts yet</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, maxWidth: 320 }}>
            When you bookmark a post from your feed, it will appear here for easy access later.
          </p>
          <div style={{
            marginTop: 24, padding: '12px 20px', borderRadius: 12,
            background: 'var(--bg-tertiary)', fontSize: 13, color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Bookmark size={16} style={{ color: 'var(--accent)' }} />
            Tap the bookmark icon on any post to save it
          </div>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {savedPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="post-card"
                style={{ padding: 20, margin: 0, display: 'flex', gap: 16 }}
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 12 }}
                    alt=""
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5 }}>
                    {post.content?.slice(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>@{post.username}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Heart size={12} /> {post.likeCount}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MessageCircle size={12} /> {post.commentCount}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Saved 2d ago
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveSaved(post.id)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', padding: 8
                  }}
                  title="Remove from saved"
                >
                  <Trash2 size={18} />
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
