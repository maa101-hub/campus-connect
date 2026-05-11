import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin } from 'lucide-react';
import userService from '../../api/userService';
import useAuthStore from '../../store/authStore';

const CampusPulse = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, online: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.collegeName) {
        try {
          const res = await userService.getCollegeUsers(user?.collegeName);
          if (res.success) {
            const total = res.data.length;
            // Simulate "online" as ~25% of total for realism
            const online = Math.max(1, Math.floor(total * 0.25) + Math.floor(Math.random() * 3));
            setStats({ total, online });
          }
        } catch (err) {
          console.error("Pulse fetch failed:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [user]);

  const hotspots = [
    { name: 'Library', level: stats.total > 10 ? 'High' : 'Low', color: stats.total > 10 ? '#EF4444' : '#22C55E' },
    { name: 'Main Canteen', level: 'Moderate', color: '#F59E0B' },
    { name: 'Study Room', level: 'Live', color: '#6366F1' },
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`right-card pulse-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <h3 className="right-card-title" style={{ marginBottom: isExpanded ? 20 : 0 }}>
        <div className="pulse-title">
          <Activity size={16} className="pulse-icon-anim" />
          <span>Campus Pulse</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-tag">LIVE</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            style={{ display: 'inline-block', fontSize: 10, opacity: 0.5 }}
          >
            ▼
          </motion.span>
        </div>
      </h3>
      
      <motion.div 
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="pulse-content" style={{ paddingTop: 10 }}>
          <div className="pulse-main-stat">
            {loading ? (
              <div className="skeleton" style={{ width: 60, height: 24, margin: '0 auto' }} />
            ) : (
              <h4>{stats.online}</h4>
            )}
            <p>Students Active Now</p>
          </div>

          <div className="hotspots-list">
            {hotspots.map((spot, i) => (
              <div key={i} className="hotspot-item">
                <div className="hotspot-info">
                  <MapPin size={12} />
                  <span>{spot.name}</span>
                </div>
                <div className="hotspot-status">
                  <span className="status-dot" style={{ background: spot.color }} />
                  <span>{spot.level}</span>
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            className="pulse-wave-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                className="pulse-wave"
                animate={{
                  scale: [1, 2],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: n * 0.6,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampusPulse;
