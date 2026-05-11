import { motion } from 'framer-motion';
import { Home, Building2, Compass, Bookmark, UserCircle, Settings, LogOut, TrendingUp, Briefcase, Map } from 'lucide-react';
import VerifiedBadgeCard from './VerifiedBadgeCard';
import PollWidget from './PollWidget';

const navItems = [
  { id: 'home', icon: Home, label: 'Home Feed' },
  { id: 'college', icon: Building2, label: 'My College' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'map', icon: Map, label: 'Campus Map' },
  { id: 'trending', icon: TrendingUp, label: 'Trending' },
  { id: 'collab', icon: Briefcase, label: 'Collab Hub' },
  { id: 'saved', icon: Bookmark, label: 'Saved Posts' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const LeftSidebar = ({ user, activeNav, setActiveNav, onLogout, isConfessionMode, setIsConfessionMode }) => {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SC';

  return (
    <motion.aside
      className="dash-sidebar-left"
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* 3D Verified Profile Card */}
      <VerifiedBadgeCard user={user} />

      {/* Campus Voice Poll */}
      <PollWidget />

      {/* Nav Items */}
      {navItems.map((item, i) => (
        <motion.button
          key={item.id}
          className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => setActiveNav(item.id)}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.05 * i }}
          whileHover={{ x: 4 }}
        >
          <item.icon size={18} />
          {item.label}
        </motion.button>
      ))}

      <div className="sidebar-divider" />

      <motion.button
        className="sidebar-nav-item"
        onClick={onLogout}
        style={{ color: '#EF4444', marginTop: 'auto' }}
        whileHover={{ x: 4 }}
      >
        <LogOut size={18} />
        Log Out
      </motion.button>

      {/* Confession Mode Quick Toggle */}
      <motion.div 
        className="post-card" 
        onClick={() => setIsConfessionMode(!isConfessionMode)}
        style={{ 
          marginTop: 20, padding: '12px 16px', 
          background: isConfessionMode ? 'linear-gradient(135deg, #7c3aed, #4c1d95)' : 'linear-gradient(135deg, #4c1d95, #1e1b4b)',
          border: isConfessionMode ? '1px solid #a78bfa' : '1px solid #7c3aed', 
          cursor: 'pointer', borderRadius: 16,
          boxShadow: isConfessionMode ? '0 0 15px rgba(124, 58, 237, 0.4)' : 'none'
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 6, background: isConfessionMode ? '#fff' : '#7c3aed', borderRadius: 8, color: isConfessionMode ? '#7c3aed' : '#fff' }}>
              <Compass size={16} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#fff' }}>Confession Mode</p>
              <p style={{ margin: 0, fontSize: 10, color: '#a78bfa' }}>{isConfessionMode ? 'Ghost active' : 'Post anonymously'}</p>
            </div>
          </div>
          <div style={{ 
            width: 32, height: 18, background: '#1e1b4b', borderRadius: 20, padding: 2, 
            display: 'flex', justifyContent: isConfessionMode ? 'flex-end' : 'flex-start' 
          }}>
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              style={{ width: 14, height: 14, background: isConfessionMode ? '#a78bfa' : '#7c3aed', borderRadius: '50%' }} 
            />
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default LeftSidebar;
