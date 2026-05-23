import { motion } from 'framer-motion';
import { Home, Building2, Compass, Bookmark, UserCircle, Settings, LogOut, TrendingUp, Calendar, GraduationCap } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home Feed' },
  { id: 'college', icon: Building2, label: 'My College' },
  { id: 'events', icon: Calendar, label: 'Events' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'trending', icon: TrendingUp, label: 'Trending' },
  { id: 'saved', icon: Bookmark, label: 'Saved Posts' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const LeftSidebar = ({ user, activeNav, setActiveNav, onLogout }) => {
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
      {/* Profile Card — real user data */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-avatar">{initials}</div>
        <div className="sidebar-profile-info">
          <h4>{user?.name || 'Loading...'}</h4>
          <p>@{user?.username || '...'}</p>
          {user?.collegeName && (
            <p style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <GraduationCap size={12} /> {user.collegeName}
            </p>
          )}
        </div>
      </div>

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
        style={{ color: '#EF4444' }}
        whileHover={{ x: 4 }}
      >
        <LogOut size={18} />
        Log Out
      </motion.button>
    </motion.aside>
  );
};

export default LeftSidebar;
