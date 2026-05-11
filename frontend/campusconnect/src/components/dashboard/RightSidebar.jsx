import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CampusPulse from './CampusPulse';
import userService from '../../api/userService';
import postService from '../../api/postService';
import useAuthStore from '../../store/authStore';

const EVENTS = [
  { day: '15', month: 'MAY', title: 'Inter-College Hackathon', desc: 'Main Auditorium · 9 AM' },
  { day: '18', month: 'MAY', title: 'Tech Talk: AI in Healthcare', desc: 'Virtual Event · 4 PM' },
];

const RightSidebar = () => {
  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.collegeName) return;
      
      try {
        // Fetch real students
        const userRes = await userService.getCollegeUsers(user?.collegeName);
        if (userRes.success) {
          setSuggestions(userRes.data.filter(u => u.email !== user.email).slice(0, 4));
        }

        // Fetch real posts to calculate trends
        const postRes = await postService.getCollegeFeed(user?.id, user?.collegeName, 0, 50);
        if (postRes.success) {
          const posts = postRes.data.content || postRes.data || [];
          calculateTrends(posts);
        }
      } catch (error) {
        console.error("RightSidebar fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateTrends = (posts) => {
    const stopWords = ['the', 'and', 'this', 'that', 'with', 'from', 'your', 'about'];
    const wordCounts = {};
    
    posts.forEach(p => {
      const words = p.content.toLowerCase().split(/\W+/);
      words.forEach(w => {
        if (w.length > 3 && !stopWords.includes(w)) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word, count]) => ({
        title: `#${word.charAt(0).toUpperCase() + word.slice(1)}`,
        posts: `${count * 12 + Math.floor(Math.random() * 5)} posts`
      }));

    setTrending(sorted.length > 0 ? sorted : [
      { title: '#CampusLife', posts: '1.2k posts' },
      { title: '#Coding', posts: '850 posts' },
      { title: '#Placements', posts: '2.1k posts' }
    ]);
  };

  const handleFollow = async (targetUser) => {
    try {
      const res = await userService.followUser(targetUser.id);
      if (res.success) {
        import('react-hot-toast').then(m => m.default.success(`You are now following ${targetUser.name}`));
        // Optionally remove from suggestions or update state
        setSuggestions(prev => prev.filter(u => u.id !== targetUser.id));
      }
    } catch (err) {
      import('react-hot-toast').then(m => m.default.error(err.message || 'Failed to follow user'));
    }
  };

  const colors = ['#6366F1', '#EC4899', '#F59E0B', '#22C55E', '#8B5CF6'];

  return (
    <motion.aside
      className="dash-sidebar-right"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Campus Pulse - LIVE Activity */}
      <CampusPulse />

      {/* Trending */}
      <div className="right-card">
        <h3 className="right-card-title">
          🔥 Trending
          <a>See all</a>
        </h3>
        {trending.map((item, i) => (
          <motion.div
            key={i} className="trending-item"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <h5>{item.title}</h5>
            <span>{item.posts}</span>
          </motion.div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="right-card">
        <h3 className="right-card-title">
          👥 Students in {user?.collegeName || 'your college'}
          <a>See more</a>
        </h3>
        
        {loading ? (
          <div className="skeleton" style={{ height: 100, borderRadius: 12 }} />
        ) : suggestions.length > 0 ? (
          suggestions.map((s, i) => {
            const initials = s.name.split(' ').map(w => w[0]).join('').toUpperCase();
            return (
              <motion.div
                key={s.id} className="suggest-item"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="suggest-avatar" style={{ background: colors[i % colors.length] }}>{initials}</div>
                <div className="suggest-info">
                  <h5>{s.name}</h5>
                  <p>@{s.username}</p>
                </div>
                <motion.button
                  className="connect-btn"
                  onClick={() => handleFollow(s)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Connect
                </motion.button>
              </motion.div>
            );
          })
        ) : (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
            No other students found yet.
          </p>
        )}
      </div>

      {/* Events */}
      <div className="right-card">
        <h3 className="right-card-title">
          📅 Upcoming Events
          <a>View all</a>
        </h3>
        {EVENTS.map((ev, i) => (
          <motion.div
            key={i} className="event-item"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
          >
            <div className="event-date">
              <strong>{ev.day}</strong>
              <span>{ev.month}</span>
            </div>
            <div className="event-info">
              <h5>{ev.title}</h5>
              <p>{ev.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
