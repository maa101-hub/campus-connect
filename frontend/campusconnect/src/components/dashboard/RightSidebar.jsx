import { motion } from 'framer-motion';

const TRENDING = [
  { title: 'Campus Hackathon 2026 — Registration Open', posts: '2.3k posts' },
  { title: 'Placement Season Tips & Interview Prep', posts: '1.8k posts' },
  { title: 'Best Coding Resources for Students', posts: '1.5k posts' },
  { title: 'Summer Internship Experiences', posts: '1.2k posts' },
];

const EVENTS = [
  { day: '15', month: 'MAY', title: 'Inter-College Hackathon', desc: 'Main Auditorium · 9 AM' },
  { day: '18', month: 'MAY', title: 'Tech Talk: AI in Healthcare', desc: 'Virtual Event · 4 PM' },
  { day: '22', month: 'MAY', title: 'Cultural Fest Rehearsals', desc: 'Open Ground · All Day' },
];

const SUGGESTIONS = [
  { name: 'Ananya Roy', college: 'NIT Trichy', color: '#6366F1' },
  { name: 'Vikram Singh', college: 'IIT Delhi', color: '#EC4899' },
  { name: 'Meera Joshi', college: 'BITS Pilani', color: '#F59E0B' },
  { name: 'Karthik R.', college: 'VIT Vellore', color: '#22C55E' },
];

const RightSidebar = () => {
  return (
    <motion.aside
      className="dash-sidebar-right"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Trending */}
      <div className="right-card">
        <h3 className="right-card-title">
          🔥 Trending
          <a>See all</a>
        </h3>
        {TRENDING.map((item, i) => (
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

      {/* Suggestions */}
      <div className="right-card">
        <h3 className="right-card-title">
          👥 Students to Connect
          <a>See more</a>
        </h3>
        {SUGGESTIONS.map((s, i) => {
          const initials = s.name.split(' ').map(w => w[0]).join('');
          return (
            <motion.div
              key={i} className="suggest-item"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <div className="suggest-avatar" style={{ background: s.color }}>{initials}</div>
              <div className="suggest-info">
                <h5>{s.name}</h5>
                <p>🎓 {s.college}</p>
              </div>
              <motion.button
                className="connect-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
