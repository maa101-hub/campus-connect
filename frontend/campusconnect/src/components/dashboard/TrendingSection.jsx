import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Flame, ArrowUp, Clock, BarChart3, MessageCircle, GraduationCap, Hash, Sparkles } from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: '#CampusHackathon2026', posts: 2340, growth: '+45%', category: 'Technology', hot: true },
  { tag: '#PlacementSeason', posts: 1870, growth: '+32%', category: 'Career', hot: true },
  { tag: '#SummerInternship', posts: 1540, growth: '+28%', category: 'Career', hot: false },
  { tag: '#CodingChallenge', posts: 1200, growth: '+22%', category: 'Technology', hot: false },
  { tag: '#CulturalFest', posts: 980, growth: '+18%', category: 'Events', hot: false },
  { tag: '#ExamPrep', posts: 860, growth: '+15%', category: 'Academics', hot: false },
  { tag: '#AIProjects', posts: 740, growth: '+38%', category: 'Technology', hot: true },
  { tag: '#StartupIdeas', posts: 620, growth: '+12%', category: 'Entrepreneurship', hot: false },
  { tag: '#SportsDay', posts: 550, growth: '+10%', category: 'Sports', hot: false },
  { tag: '#OpenSource', posts: 480, growth: '+25%', category: 'Technology', hot: false },
];

const HOT_DISCUSSIONS = [
  { title: 'Best resources to crack FAANG interviews?', replies: 124, author: 'Priya Sharma', college: 'IIT Delhi', time: '2h ago' },
  { title: 'Is DSA enough or should we focus on System Design too?', replies: 98, author: 'Rahul Verma', college: 'NIT Trichy', time: '4h ago' },
  { title: 'Which hackathon are you participating in this month?', replies: 76, author: 'Ananya Roy', college: 'BITS Pilani', time: '6h ago' },
  { title: 'Suggestions for final year project ideas in AI/ML', replies: 63, author: 'Karthik R.', college: 'VIT Vellore', time: '8h ago' },
  { title: 'Anyone else finding the new semester schedule tough?', replies: 54, author: 'Meera Joshi', college: 'DTU Delhi', time: '12h ago' },
];

const FILTERS = ['Today', 'This Week', 'This Month'];

const CATEGORY_COLORS = {
  Technology: { bg: 'rgba(99, 102, 241, 0.1)', text: '#818CF8' },
  Career: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E' },
  Events: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
  Academics: { bg: 'rgba(6, 182, 212, 0.1)', text: '#06B6D4' },
  Entrepreneurship: { bg: 'rgba(236, 72, 153, 0.1)', text: '#EC4899' },
  Sports: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' },
};

const TrendingSection = () => {
  const [activeFilter, setActiveFilter] = useState('Today');
  const [activeTab, setActiveTab] = useState('topics');

  return (
    <motion.div
      className="dash-feed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{ padding: '0 24px 40px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.02em' }}>
            <Flame size={24} style={{ color: '#F59E0B' }} />
            Trending Now
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            What students are talking about across campuses
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12 }}>
          {FILTERS.map(filter => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '7px 16px', borderRadius: 9,
                background: activeFilter === filter ? 'var(--accent)' : 'transparent',
                color: activeFilter === filter ? '#fff' : 'var(--text-muted)',
                border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active Topics', value: '10', icon: <Hash size={16} />, color: 'var(--accent)' },
          { label: 'Total Posts', value: '11.2k', icon: <BarChart3 size={16} />, color: '#22C55E' },
          { label: 'Discussions', value: '415', icon: <MessageCircle size={16} />, color: '#F59E0B' },
          { label: 'Trending Up', value: '7', icon: <Sparkles size={16} />, color: '#EC4899' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            style={{
              padding: '16px 18px', borderRadius: 14,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${stat.color}15`, color: stat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
        {[
          { id: 'topics', label: 'Top Hashtags', icon: <Hash size={14} /> },
          { id: 'discussions', label: 'Hot Discussions', icon: <TrendingUp size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px', border: 'none', background: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'topics' ? (
          <motion.div
            key="topics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="post-card"
            style={{ padding: 0, margin: 0, overflow: 'hidden' }}
          >
            {TRENDING_TOPICS.map((topic, i) => {
              const catColor = CATEGORY_COLORS[topic.category] || { bg: 'var(--bg-tertiary)', text: 'var(--text-muted)' };
              return (
                <motion.div
                  key={topic.tag}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                  whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: i < TRENDING_TOPICS.length - 1 ? '1px solid var(--border-light)' : 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: i < 3 ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: i < 3 ? '#fff' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {i + 1}
                  </span>

                  {/* Tag info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {topic.tag}
                      </h5>
                      {topic.hot && (
                        <span style={{
                          padding: '2px 6px', borderRadius: 5, fontSize: 9, fontWeight: 700,
                          background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          HOT
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {topic.posts.toLocaleString()} posts
                      </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6,
                        background: catColor.bg, color: catColor.text,
                        fontSize: 10, fontWeight: 600,
                      }}>
                        {topic.category}
                      </span>
                    </div>
                  </div>

                  {/* Growth */}
                  <span style={{
                    padding: '5px 10px', borderRadius: 8,
                    background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E',
                    fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3,
                    fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                  }}>
                    <ArrowUp size={12} /> {topic.growth}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="discussions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="post-card"
            style={{ padding: 0, margin: 0, overflow: 'hidden' }}
          >
            {HOT_DISCUSSIONS.map((disc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
                style={{
                  padding: '18px 20px', cursor: 'pointer',
                  borderBottom: i < HOT_DISCUSSIONS.length - 1 ? '1px solid var(--border-light)' : 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                <h5 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>
                  {disc.title}
                </h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{disc.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <GraduationCap size={12} /> {disc.college}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontVariantNumeric: 'tabular-nums' }}>
                    <MessageCircle size={12} /> {disc.replies} replies
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {disc.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrendingSection;
