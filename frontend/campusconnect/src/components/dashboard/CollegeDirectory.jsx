import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, MessageSquare, MapPin } from 'lucide-react';
import userService from '../../api/userService';

const CollegeDirectory = ({ user, onMessageUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.collegeName) {
      fetchCollegeUsers();
    }
  }, [user]);

  const fetchCollegeUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getCollegeUsers(user.collegeName);
      if (res.success) {
        // Filter out current user
        setUsers(res.data.filter(u => u.id !== user.id));
      }
    } catch (err) {
      console.error('Failed to fetch college users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      className="dash-feed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '24px' }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          Campus Directory
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Discover and connect with fellow students at <strong>{user?.collegeName}</strong>.
        </p>
      </div>

      <div className="dash-nav-search" style={{ width: '100%', maxWidth: '100%', marginBottom: 24 }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input 
          placeholder="Search by name or username..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="animate-spin" style={{ width: 30, height: 30, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredUsers.map((u, i) => (
            <motion.div
              key={u.id}
              className="post-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ padding: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 50, height: 50, borderRadius: 16, 
                  background: 'var(--bg-accent)', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{u.name}</h4>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>@{u.username}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <MapPin size={14} />
                <span>Verified Student</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    flex: 1, padding: '8px 0', borderRadius: 10, 
                    background: 'var(--accent-light)', color: 'var(--accent)',
                    border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <UserPlus size={16} /> Connect
                </motion.button>
                <motion.button
                  onClick={() => onMessageUser(u)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    flex: 1, padding: '8px 0', borderRadius: 10, 
                    background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                    border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <MessageSquare size={16} /> Message
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
          <p style={{ fontWeight: 600 }}>No students found matching your search.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CollegeDirectory;
