import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash, Flame, ArrowUp, Clock, BarChart3 } from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: '#CampusHackathon2026', posts: 2340, growth: '+45%', category: 'Technology' },
  { tag: '#PlacementSeason', posts: 1870, growth: '+32%', category: 'Career' },
  { tag: '#SummerInternship', posts: 1540, growth: '+28%', category: 'Career' },
  { tag: '#CodingChallenge', posts: 1200, growth: '+22%', category: 'Technology' },
  { tag: '#CulturalFest', posts: 980, growth: '+18%', category: 'Events' },
  { tag: '#ExamPrep', posts: 860, growth: '+15%', category: 'Academics' },
  { tag: '#AIProjects', posts: 740, growth: '+38%', category: 'Technology' },
  { tag: '#StartupIdeas', posts: 620, growth: '+12%', category: 'Entrepreneurship' },
  { tag: '#SportsDay', posts: 550, growth: '+10%', category: 'Sports' },
  { tag: '#OpenSource', posts: 480, growth: '+25%', category: 'Technology' },
];

const HOT_DISCUSSIONS = [
  { title: 'Best resources to crack FAANG interviews?', replies: 124, author: 'Priya Sharma', college: 'IIT Delhi', time: '2h ago' },
  { title: 'Is DSA enough or should we focus on System Design too?', replies: 98, author: 'Rahul Verma', college: 'NIT Trichy', time: '4h ago' },
  { title: 'Which hackathon are you participating in this month?', replies: 76, author: 'Ananya Roy', college: 'BITS Pilani', time: '6h ago' },
  { title: 'Suggestions for final year project ideas in AI/ML', replies: 63, author: 'Karthik R.', college: 'VIT Vellore', time: '8h ago' },
  { title: 'Anyone else finding the new semester schedule tough?', replies: 54, author: 'Meera Joshi', college: 'DTU Delhi', time: '12h ago' },
];

const FILTERS = ['Today', 'This Week', 'This Month'];

const TrendingSection = () => {
  const [activeFilter, setActiveFilter] = useState('Today');

  return (
    <motion.div
      className="dash-feed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '0 24px 40px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px 0' }}>
            <Flame size={24} style={{ display: 'inline', marginRight: 10, color: '#F59E0B' }} />
            Trending Now
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            What students are talking about across campuses
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '6px 14px', borderRadius: 10,
                background: activeFilter === filter ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: activeFilter === filter ? '#fff' : 'var(--text-muted)',
                border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="post-card" style={{ padding: 24, margin: '0 0 28px 0' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
          Top Hashtags
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TRENDING_TOPICS.map((topic, i) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                borderBottom: i < TRENDING_TOPICS.length - 1 ? '1px solid var(--border-light)' : 'none'
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--bg-tertiary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: 'var(--text-muted)'
              }}>
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
                  {topic.tag}
                </h5>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                  {topic.posts.toLocaleString()} posts · {topic.category}
                </p>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: 8,
                background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E',
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3
              }}>
                <ArrowUp size={12} /> {topic.growth}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hot Discussions */}
      <div className="post-card" style={{ padding: 24, margin: 0 }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} style={{ color: '#F59E0B' }} />
          Hot Discussions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {HOT_DISCUSSIONS.map((disc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
              style={{
                padding: '16px 12px', borderRadius: 12, cursor: 'pointer',
                borderBottom: i < HOT_DISCUSSIONS.length - 1 ? '1px solid var(--border-light)' : 'none'
              }}
            >
              <h5 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>{disc.title}</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{disc.author}</span>
                <span>🎓 {disc.college}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  💬 {disc.replies} replies
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {disc.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingSection;
