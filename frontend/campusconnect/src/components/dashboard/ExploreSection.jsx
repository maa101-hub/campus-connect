import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Search, Users, TrendingUp, Hash, Filter } from 'lucide-react';
import postService from '../../api/postService';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'tech', label: 'Technology', icon: Hash },
  { id: 'events', label: 'Events', icon: Hash },
  { id: 'academics', label: 'Academics', icon: Hash },
  { id: 'sports', label: 'Sports', icon: Hash },
  { id: 'clubs', label: 'Clubs', icon: Users },
];

const DISCOVER_COLLEGES = [
  { name: 'IIT Delhi', students: 1240, color: '#4F46E5' },
  { name: 'NIT Trichy', students: 890, color: '#7C3AED' },
  { name: 'BITS Pilani', students: 1050, color: '#EC4899' },
  { name: 'VIT Vellore', students: 760, color: '#F59E0B' },
  { name: 'DTU Delhi', students: 620, color: '#22C55E' },
  { name: 'IIIT Hyderabad', students: 540, color: '#06B6D4' },
];

const ExploreSection = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExplorePosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getFeed(user?.id, 0, 12);
      if (res.success) {
        setPosts(res.data?.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch explore posts:', err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchExplorePosts();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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
          <Compass size={24} style={{ display: 'inline', marginRight: 10, color: 'var(--accent)' }} />
          Explore
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Discover posts, students, and communities across all campuses
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 18px', background: 'var(--bg-tertiary)',
        borderRadius: 14, marginBottom: 24, border: '1px solid var(--border-color)'
      }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, hashtags, or people..."
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontSize: 14, color: 'var(--text-primary)'
          }}
        />
        <Filter size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              background: activeCategory === cat.id ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
              border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <cat.icon size={14} />
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Discover Colleges */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} style={{ color: 'var(--accent)' }} />
          Top Colleges on CampusConnect
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {DISCOVER_COLLEGES.map((college, i) => (
            <motion.div
              key={college.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="post-card"
              style={{
                padding: 18, margin: 0, cursor: 'pointer',
                textAlign: 'center', borderTop: `3px solid ${college.color}`
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, margin: '0 auto 10px',
                background: `${college.color}20`, color: college.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800
              }}>
                {college.name.charAt(0)}
              </div>
              <h5 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>{college.name}</h5>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>
                {college.students} students
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explore Posts Grid */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
          Popular Posts
        </h3>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="post-card" style={{ padding: 16, margin: 0 }}>
                <div className="skeleton" style={{ width: '100%', height: 120, borderRadius: 10, marginBottom: 12 }} />
                <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '50%', height: 12 }} />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 40 }}>🔍</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>No posts to explore yet</p>
            <p style={{ fontSize: 13 }}>Be the first to share something amazing!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="post-card"
                style={{ padding: 0, margin: 0, overflow: 'hidden', cursor: 'pointer' }}
              >
                {post.imageUrl ? (
                  <img
                    src={`http://localhost:8095${post.imageUrl}`}
                    style={{ width: '100%', height: 140, objectFit: 'cover' }}
                    alt=""
                  />
                ) : (
                  <div style={{
                    height: 140, background: 'var(--bg-tertiary)', padding: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic',
                    textAlign: 'center', lineHeight: 1.5
                  }}>
                    "{post.content?.slice(0, 80)}..."
                  </div>
                )}
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 8,
                      background: 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700
                    }}>
                      {post.username?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{post.username}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>❤️ {post.likeCount || 0}</span>
                    <span>💬 {post.commentCount || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExploreSection;
