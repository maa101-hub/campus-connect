import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, MessageSquare, Sun, Moon, ChevronDown, LogOut, User, Settings, Ghost, X } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import useNotificationStore from '../../store/notificationStore';
import userService from '../../api/userService';

const DashNavbar = ({ user, onLogout, onNavigate, onViewProfile, isConfessionMode, setIsConfessionMode }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);
  
  const { notifications, unreadNotificationCount, unreadMessageCount, markNotificationsAsRead } = useNotificationStore();

  useEffect(() => {
    if (showCommandPalette && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [showCommandPalette]);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setSearching(true);
        try {
          const res = await userService.getCollegeUsers(user?.collegeName);
          let filtered = [];
          if (res.success && res.data) {
            filtered = res.data.filter(u => 
              (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              u.username.toLowerCase().includes(searchQuery.toLowerCase())) &&
              u.id !== user?.id
            ).slice(0, 5);
          }
          
          // DUMMY FALLBACK for demonstration if DB is empty
          if (filtered.length === 0) {
            const DUMMY_STUDENTS = [
              { id: 'd1', name: 'Alex Rivera', username: 'arivera' },
              { id: 'd2', name: 'Sam Chen', username: 'schen_dev' },
              { id: 'd3', name: 'Jordan Taylor', username: 'jtaylor' },
              { id: 'd4', name: 'Casey Smith', username: 'caseys' },
              { id: 'd5', name: 'Riley Jones', username: 'rileyj' }
            ];
            filtered = DUMMY_STUDENTS.filter(u => 
              u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              u.username.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5);
          }
          
          setSearchResults(filtered);
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user?.collegeName, user?.id]);

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'SC';

  const handleOpenNotifs = () => {
    setShowNotifs(!showNotifs);
    setShowDropdown(false);
    if (!showNotifs) markNotificationsAsRead();
  };

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

      {/* Search Trigger */}
      <div 
        onClick={() => setShowCommandPalette(true)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', 
          padding: '8px 16px', borderRadius: 20, cursor: 'pointer', width: '100%', maxWidth: 300, 
          border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: 14, 
          justifyContent: 'space-between', transition: 'border-color 0.2s', margin: '0 20px'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={16} />
          <span>Search CampusConnect...</span>
        </div>
        <kbd style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>⌘K</kbd>
      </div>

      {/* Command Palette Modal via Portal */}
      {createPortal(
        <AnimatePresence>
          {showCommandPalette && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', justifyContent: 'center', paddingTop: '12vh' }}>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 0 }}
                onClick={() => setShowCommandPalette(false)}
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{ 
                  position: 'relative', zIndex: 10, width: '90%', maxWidth: 600, background: 'var(--bg-primary)', 
                  borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '70vh'
                }}
              >
                {/* Search Input Area */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
                  <Search size={20} style={{ color: 'var(--accent)', marginRight: 12 }} />
                  <input 
                    ref={searchInputRef}
                    placeholder="Search students, professors, or clubs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      border: 'none', background: 'transparent', outline: 'none', 
                      width: '100%', fontSize: 16, color: 'var(--text-primary)' 
                    }}
                  />
                  <kbd style={{ background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)' }}>ESC</kbd>
                </div>

                {/* Results Area */}
                <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
                  {searchQuery.length > 1 && searchResults.length === 0 && !searching && (
                    <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No results found for "{searchQuery}"
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div>
                      <h4 style={{ margin: '8px 8px 12px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Students</h4>
                      {searchResults.map((result, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          key={result.id} 
                          onClick={() => { 
                            if (onViewProfile) {
                              onViewProfile(result);
                            } else {
                              onNavigate('profile');
                            }
                            setShowCommandPalette(false); 
                            setSearchQuery(''); 
                          }}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
                            borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s' 
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <div style={{ 
                            width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700
                          }}>
                            {result.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{result.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>@{result.username}</p>
                          </div>
                          <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: 'rotate(-90deg)' }} />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!searchQuery && (
                    <div style={{ padding: '20px 8px' }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Suggested Actions</h4>
                      <div 
                        onClick={() => { onNavigate('messages'); setShowCommandPalette(false); }}
                        style={{ padding: '10px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Open Messages</span>
                      </div>
                      <div 
                        onClick={() => { toggleTheme(); setShowCommandPalette(false); }}
                        style={{ padding: '10px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        {theme === 'light' ? <Moon size={16} style={{ color: 'var(--text-muted)' }} /> : <Sun size={16} style={{ color: 'var(--text-muted)' }} />}
                        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Toggle Theme</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

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

        <button 
          className={`nav-icon-btn ${isConfessionMode ? 'active-confession' : ''}`} 
          onClick={() => setIsConfessionMode(!isConfessionMode)}
          title="Toggle Confession Mode"
        >
          <Ghost size={18} />
          {isConfessionMode && <span className="confession-dot" />}
        </button>

        <button className="nav-icon-btn" onClick={() => onNavigate('messages')} style={{ position: 'relative' }}>
          <MessageSquare size={18} />
          {unreadMessageCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 14, height: 14, 
              borderRadius: '50%', background: '#EF4444', color: '#fff',
              fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>{unreadMessageCount}</span>
          )}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="nav-icon-btn" 
            onClick={handleOpenNotifs}
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
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
                        onClick={() => { setShowNotifs(false); onNavigate('messages'); }}
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
