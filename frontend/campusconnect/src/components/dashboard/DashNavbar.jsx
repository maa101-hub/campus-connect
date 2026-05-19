import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, MessageSquare, Sun, Moon, ChevronDown, LogOut, User, Settings, X, FileText, Users, Loader } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import postService from '../../api/postService';
import userService from '../../api/userService';
import notificationService from '../../api/notificationService';

const DashNavbar = ({ user, onLogout, onNavigate }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'SC';

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoadingNotifs(true);
    try {
      const res = await notificationService.getNotifications(user.id);
      if (res.success) setNotifications(res.data || []);
    } catch {
      // Silently fail — notifications are non-critical
    } finally {
      setLoadingNotifs(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const res = await notificationService.getUnreadCount(user.id);
      if (res.success) setUnreadCount(res.data?.count || 0);
    } catch {
      // silent
    }
  };

  // Fetch notifications on mount and periodically
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      fetchUnreadCount();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const timeAgoNotif = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length < 2) {
      setSearchResults({ posts: [], users: [] });
      setShowSearch(false);
      return;
    }

    setShowSearch(true);
    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Search posts from feed
        const postRes = await postService.getFeed(user?.id, 0, 50);
        const allPosts = postRes.success ? (postRes.data?.content || []) : [];
        const filteredPosts = allPosts.filter(p =>
          p.content?.toLowerCase().includes(query.toLowerCase()) ||
          p.username?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        // Search users from college directory
        let filteredUsers = [];
        if (user?.collegeName) {
          try {
            const userRes = await userService.getCollegeUsers(user.collegeName);
            const allUsers = userRes.success ? (userRes.data || []) : [];
            filteredUsers = allUsers.filter(u =>
              u.name?.toLowerCase().includes(query.toLowerCase()) ||
              u.username?.toLowerCase().includes(query.toLowerCase()) ||
              u.major?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 4);
          } catch {
            // silently fail user search
          }
        }

        setSearchResults({ posts: filteredPosts, users: filteredUsers });
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults({ posts: [], users: [] });
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ posts: [], users: [] });
    setShowSearch(false);
  };

  const hasResults = searchResults.posts.length > 0 || searchResults.users.length > 0;

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

      {/* Search with Dropdown */}
      <div ref={searchRef} style={{ position: 'relative', flex: '0 1 420px' }}>
        <div className="dash-nav-search" style={{ width: '100%' }}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Search posts, people, topics..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { if (searchQuery.trim().length >= 2) setShowSearch(true); }}
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearSearch}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex' }}
            >
              <X size={14} />
            </motion.button>
          )}
          {isSearching && <Loader size={14} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
                borderRadius: 14, background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden', zIndex: 200, maxHeight: 420, overflowY: 'auto'
              }}
            >
              {isSearching ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  Searching...
                </div>
              ) : !hasResults ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  <Search size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <p style={{ margin: 0 }}>No results for "<strong>{searchQuery}</strong>"</p>
                </div>
              ) : (
                <>
                  {/* Users Results */}
                  {searchResults.users.length > 0 && (
                    <div>
                      <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={12} /> People
                      </div>
                      {searchResults.users.map(u => (
                        <div
                          key={u.id}
                          onClick={() => { clearSearch(); onNavigate('college'); }}
                          style={{
                            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
                            cursor: 'pointer', transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--accent)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 800
                          }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              @{u.username} {u.major && `· ${u.major}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Posts Results */}
                  {searchResults.posts.length > 0 && (
                    <div>
                      <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6, borderTop: searchResults.users.length > 0 ? '1px solid var(--border-light)' : 'none' }}>
                        <FileText size={12} /> Posts
                      </div>
                      {searchResults.posts.map(post => (
                        <div
                          key={post.id}
                          onClick={() => { clearSearch(); onNavigate('home'); }}
                          style={{
                            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
                            cursor: 'pointer', transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--bg-tertiary)', color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <FileText size={16} />
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {post.content?.slice(0, 60)}...
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              by @{post.username} · {post.likeCount || 0} likes
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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

        <button className="nav-icon-btn" onClick={() => onNavigate('messages')}>
          <MessageSquare size={18} />
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="nav-icon-btn" 
            onClick={() => { setShowNotifs(!showNotifs); setShowDropdown(false); if (!showNotifs) fetchNotifications(); }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
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
                  <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Mark all as read</button>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {loadingNotifs ? (
                    <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      You're all caught up!
                    </div>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div key={n.id} style={{ 
                        padding: '12px 16px', borderBottom: '1px solid var(--border-light)', 
                        display: 'flex', gap: 12, cursor: 'pointer', transition: 'background 0.2s',
                        background: n.isRead ? 'transparent' : 'var(--accent-light)'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'var(--accent-light)'}
                      >
                        <div style={{ 
                          width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', 
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: 'bold', fontSize: 14, flexShrink: 0 
                        }}>
                          {(n.actorName || 'S').charAt(0)}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            <strong>{n.actorName || 'System'}</strong> {n.message}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{timeAgoNotif(n.createdAt)}</p>
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
                  }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
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
