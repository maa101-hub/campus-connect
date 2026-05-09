import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, MessageSquare, Sun, Moon, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import useThemeStore from '../../store/themeStore';

const DashNavbar = ({ user, onLogout, onNavigate }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, user: 'Priya Sharma', action: 'liked your post about the new library hours.', time: '2m ago' },
    { id: 2, user: 'Rahul Verma', action: 'commented: "This is super helpful, thanks!"', time: '1h ago' },
    { id: 3, user: 'Campus Admin', action: 'verified your student status.', time: '1d ago' },
  ]);
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'SC';

  return (
    <nav className="dash-nav">
      {/* Logo */}
      <a className="dash-nav-logo" href="/dashboard">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Campus</span>Connect
      </a>

      {/* Search */}
      <div className="dash-nav-search">
        <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input placeholder="Search posts, people, topics..." />
      </div>

      {/* Actions */}
      <div className="dash-nav-actions">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={18} />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button className="nav-icon-btn">
          <MessageSquare size={18} />
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="nav-icon-btn" 
            onClick={() => { setShowNotifs(!showNotifs); setShowDropdown(false); }}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 8, height: 8, 
                borderRadius: '50%', background: '#EF4444'
              }} />
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: '100%', right: -10, marginTop: 8,
                  width: 320, borderRadius: 14,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100,
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Notifications</h4>
                  <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Mark all as read</button>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      You're all caught up!
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ 
                        padding: '12px 16px', borderBottom: '1px solid var(--border-light)', 
                        display: 'flex', gap: 12, cursor: 'pointer', transition: 'background 0.2s' 
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{ 
                          width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', 
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: 'bold', fontSize: 14, flexShrink: 0 
                        }}>
                          {n.user.slice(0, 1)}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            <strong>{n.user}</strong> {n.action}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <div className="nav-avatar">{initials}</div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  width: 200, borderRadius: 14,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100,
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{user?.name || 'Student'}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{user?.email || 'student@campus.edu'}</p>
                </div>
                {[
                  { icon: <User size={15} />, label: 'Profile', id: 'profile' },
                  { icon: <Settings size={15} />, label: 'Settings', id: 'settings' },
                ].map(item => (
                  <button 
                    key={item.label} 
                    onClick={() => { onNavigate(item.id); setShowDropdown(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '10px 16px', border: 'none', background: 'none',
                      color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }} 
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border-light)' }}>
                  <button onClick={onLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 16px', border: 'none', background: 'none',
                    color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.15s',
                  }} onMouseEnter={e => e.target.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.target.style.background = 'none'}>
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default DashNavbar;
