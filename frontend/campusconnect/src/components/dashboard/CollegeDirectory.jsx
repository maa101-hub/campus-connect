import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, MessageSquare, MapPin, Check, Clock, UserMinus } from 'lucide-react';
import userService from '../../api/userService';
import connectionService from '../../api/connectionService';
import { useToast } from '../ui/Toast';

const CollegeDirectory = ({ user, onMessageUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [connectionIds, setConnectionIds] = useState({});
  const [pendingActions, setPendingActions] = useState({});
  const toast = useToast();

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
        const otherUsers = res.data.filter(u => u.id !== user.id);
        setUsers(otherUsers);
        fetchAllStatuses(otherUsers);
      }
    } catch (err) {
      console.error('Failed to fetch college users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStatuses = async (usersList) => {
    const statuses = {};
    const ids = {};
    for (const u of usersList) {
      try {
        const res = await connectionService.getStatus(user.id, u.id);
        if (res.success) {
          statuses[u.id] = res.data.status;
          ids[u.id] = res.data.connectionId;
        }
      } catch (err) {
        statuses[u.id] = 'NONE';
      }
    }
    setConnectionStatuses(statuses);
    setConnectionIds(ids);
  };

  const handleConnect = async (targetUserId) => {
    setPendingActions(prev => ({ ...prev, [targetUserId]: true }));
    try {
      const res = await connectionService.sendRequest(user.id, targetUserId);
      if (res.success) {
        // Instant UI update
        setConnectionStatuses(prev => ({ ...prev, [targetUserId]: 'PENDING_SENT' }));
        toast.success('Connection request sent!');
      } else {
        toast.error(res.message || 'Failed to send request');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally {
      setPendingActions(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleAccept = async (targetUserId) => {
    const connId = connectionIds[targetUserId];
    if (!connId) {
      toast.error('Connection ID not found');
      return;
    }
    setPendingActions(prev => ({ ...prev, [targetUserId]: true }));
    try {
      const res = await connectionService.acceptRequest(connId, user.id);
      if (res.success) {
        // Instant UI update
        setConnectionStatuses(prev => ({ ...prev, [targetUserId]: 'ACCEPTED' }));
        toast.success('Connection accepted!');
      } else {
        toast.error(res.message || 'Failed to accept');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to accept');
    } finally {
      setPendingActions(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleButtonClick = (targetUserId) => {
    const status = connectionStatuses[targetUserId];
    if (status === 'PENDING_RECEIVED') {
      handleAccept(targetUserId);
    } else {
      handleConnect(targetUserId);
    }
  };

  const getButtonConfig = (targetUserId) => {
    const status = connectionStatuses[targetUserId];
    switch (status) {
      case 'ACCEPTED':
        return { label: 'Connected', icon: Check, bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', disabled: true };
      case 'PENDING_SENT':
        return { label: 'Pending', icon: Clock, bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', disabled: true };
      case 'PENDING_RECEIVED':
        return { label: 'Accept', icon: UserPlus, bg: 'var(--accent)', color: '#fff', disabled: false };
      default:
        return { label: 'Connect', icon: UserPlus, bg: 'var(--accent-light)', color: 'var(--accent)', disabled: false };
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.major && u.major.toLowerCase().includes(search.toLowerCase()))
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
          placeholder="Search by name, username, or major..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="post-card" style={{ padding: 16, margin: 0 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div className="skeleton" style={{ width: 50, height: 50, borderRadius: 16 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: '40%', height: 12 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '100%', height: 36, borderRadius: 10 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredUsers.map((u, i) => {
            const btnConfig = getButtonConfig(u.id);
            const isPending = pendingActions[u.id];
            const BtnIcon = btnConfig.icon;

            return (
              <motion.div
                key={u.id}
                className="post-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> Verified
                  </span>
                  {u.major && (
                    <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--bg-tertiary)', fontSize: 11 }}>
                      {u.major}
                    </span>
                  )}
                  {u.yearOfStudy && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {u.yearOfStudy}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <motion.button
                    whileHover={!btnConfig.disabled ? { scale: 1.02 } : {}}
                    whileTap={!btnConfig.disabled ? { scale: 0.98 } : {}}
                    onClick={() => !btnConfig.disabled && handleButtonClick(u.id)}
                    disabled={btnConfig.disabled || isPending}
                    style={{ 
                      flex: 1, padding: '9px 0', borderRadius: 10, 
                      background: btnConfig.bg, color: btnConfig.color,
                      border: 'none', fontSize: 13, fontWeight: 600,
                      cursor: btnConfig.disabled ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      opacity: isPending ? 0.6 : 1, transition: 'all 0.2s'
                    }}
                  >
                    <BtnIcon size={15} />
                    {isPending ? 'Sending...' : btnConfig.label}
                  </motion.button>
                  <motion.button
                    onClick={() => onMessageUser(u)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      flex: 1, padding: '9px 0', borderRadius: 10, 
                      background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                      border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <MessageSquare size={15} /> Message
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
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
