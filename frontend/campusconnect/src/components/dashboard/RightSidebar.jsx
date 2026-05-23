import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Users, GraduationCap } from 'lucide-react';
import { useToast } from '../ui/Toast';

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

// eslint-disable-next-line no-unused-vars
const RightSidebar = ({ user }) => {
  // eslint-disable-next-line no-unused-vars
  const [connectedIds, setConnectedIds] = useState([]);
  const toast = useToast();

  const handleConnect = async () => {
    // This is placeholder since suggestions are static — in real app would use user IDs
    toast.info(`Connection feature works from the Campus Directory page for real users.`);
  };

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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} style={{ color: 'var(--accent)' }} /> Trending
          </span>
          <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 500, color: 'var(--accent)', cursor: 'pointer' }}>See all</button>
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} style={{ color: 'var(--accent)' }} /> Upcoming Events
          </span>
          <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 500, color: 'var(--accent)', cursor: 'pointer' }}>View all</button>
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} style={{ color: 'var(--accent)' }} /> Students to Connect
          </span>
          <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 500, color: 'var(--accent)', cursor: 'pointer' }}>See more</button>
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
                <p><GraduationCap size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{s.college}</p>
              </div>
              <motion.button
                className="connect-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleConnect(s.name)}
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
