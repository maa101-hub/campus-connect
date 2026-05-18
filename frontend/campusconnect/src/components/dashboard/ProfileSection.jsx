import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, GraduationCap, Calendar, Edit3, Settings, Grid, 
  Bookmark, MessageSquare, Heart, X, Check, Award, Briefcase, 
  Code, Coffee, Globe
} from 'lucide-react';
import postService from '../../api/postService';
import userService from '../../api/userService';
import useAuthStore from '../../store/authStore';
import { useToast } from '../ui/Toast';

const ProfileSection = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const updateUserStore = useAuthStore(state => state.updateUser);
  const toast = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
      setEditData({ ...user });
    }
  }, [user]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getUserPosts(user.id, user.id);
      if (res.success) {
        setPosts(res.data?.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile(editData);
      if (res.success) {
        updateUserStore(res.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Posts', value: posts.length, icon: <Grid size={16} /> },
    { label: 'Followers', value: user?.followerCount ?? 0, icon: <User size={16} /> },
    { label: 'Following', value: user?.followingCount ?? 0, icon: <User size={16} /> },
  ];

  const skillList = user?.skills ? user.skills.split(',').map(s => s.trim()) : ['React', 'Java', 'UI Design'];
  const interestList = user?.interests ? user.interests.split(',').map(i => i.trim()) : ['AI', 'Startups', 'Coffee'];

  return (
    <motion.div 
      className="dash-feed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '0 0 40px 0' }}
    >
      {/* Profile Header / Banner */}
      <div style={{ 
        height: 180, background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
        position: 'relative', borderRadius: '0 0 24px 24px'
      }}>
        <div style={{
          position: 'absolute', bottom: -60, left: 40,
          display: 'flex', alignItems: 'flex-end', gap: 20
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: 32,
            background: 'var(--bg-primary)', border: '6px solid var(--bg-primary)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, fontWeight: 800, color: 'var(--accent)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{user?.name}</h2>
              <div title="Verified Student" style={{ color: 'var(--accent)', background: 'var(--bg-tertiary)', padding: 4, borderRadius: '50%' }}>
                <Award size={18} fill="currentColor" fillOpacity={0.2} />
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>@{user?.username}</p>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 20, right: 30, display: 'flex', gap: 12 }}>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            style={{ 
              padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <Edit3 size={16} /> Edit Profile
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ 
              padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff'
            }}
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>

      <div style={{ marginTop: 80, padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40 }}>
        {/* Left Content: Bio & Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Bio Section */}
          <div className="post-card" style={{ padding: 24, margin: 0 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700 }}>Bio</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>
              {user?.bio || "No bio added yet. Tell your campus community a bit about yourself!"}
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14 }}>
                    <Briefcase size={16} /> <span>{user?.major || 'Undecided'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14 }}>
                    <Calendar size={16} /> <span>{user?.yearOfStudy || 'Student'}</span>
                </div>
            </div>
          </div>

          {/* Activity Tabs */}
          <div>
            <div style={{ 
              display: 'flex', gap: 40, borderBottom: '1px solid var(--border)',
              marginBottom: 24
            }}>
              {['posts', 'saved', 'media'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 0', background: 'none', border: 'none',
                    fontSize: 14, fontWeight: 700, color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                    borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                    cursor: 'pointer', textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading posts...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40 }}>📭</p>
                <p>You haven't posted anything yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="post-card"
                    style={{ 
                      padding: 0, overflow: 'hidden', margin: 0,
                      display: 'flex', flexDirection: 'column', height: '100%'
                    }}
                  >
                    {post.imageUrl ? (
                      <img src={`http://localhost:8095${post.imageUrl}`} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ 
                        height: 180, background: 'var(--bg-tertiary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 30, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)',
                        fontStyle: 'italic'
                      }}>
                        "{post.content.slice(0, 100)}..."
                      </div>
                    )}
                    <div style={{ padding: 16 }}>
                      <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted)', fontSize: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Heart size={14} /> {post.likeCount}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MessageSquare size={14} /> {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: About & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Detailed Info */}
          <div className="post-card" style={{ padding: 24, margin: 0 }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700 }}>Quick Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <Mail size={18} style={{ color: 'var(--accent)' }} />
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
                <span>{user?.collegeName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <Globe size={18} style={{ color: 'var(--accent)' }} />
                <span>India, Remote</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {stats.map(stat => (
              <div key={stat.label} className="post-card" style={{ 
                padding: '16px 8px', margin: 0, textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
              }}>
                <div style={{ color: 'var(--accent)', marginBottom: 2 }}>{stat.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Skills & Interests */}
          <div className="post-card" style={{ padding: 24, margin: 0 }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code size={18} /> Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skillList.map(skill => (
                    <span key={skill} style={{ 
                        padding: '6px 12px', borderRadius: 8, background: 'var(--bg-tertiary)',
                        fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)'
                    }}>
                        {skill}
                    </span>
                ))}
            </div>

            <h4 style={{ margin: '24px 0 16px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Coffee size={18} /> Interests
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {interestList.map(interest => (
                    <span key={interest} style={{ 
                        padding: '6px 12px', borderRadius: 8, background: 'rgba(var(--accent-rgb), 0.1)',
                        fontSize: 12, fontWeight: 600, color: 'var(--accent)'
                    }}>
                        {interest}
                    </span>
                ))}
            </div>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: 10 }}>
              <motion.a whileHover={{ y: -3, color: 'var(--accent)' }} href="#" style={{ color: 'var(--text-muted)' }}><Globe size={20} /></motion.a>
              <motion.a whileHover={{ y: -3, color: 'var(--accent)' }} href="#" style={{ color: 'var(--text-muted)' }}><Globe size={20} /></motion.a>
              <motion.a whileHover={{ y: -3, color: 'var(--accent)' }} href="#" style={{ color: 'var(--text-muted)' }}><Globe size={20} /></motion.a>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%', maxWidth: 500, background: 'var(--bg-primary)',
                borderRadius: 24, boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
              }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Update Profile</h3>
                <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, maxHeight: '70vh', overflowY: 'auto' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Display Name</label>
                  <input 
                    className="auth-input" value={editData.name} 
                    onChange={e => setEditData({...editData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Bio</label>
                  <textarea 
                    className="auth-input" style={{ height: 80, padding: 12, resize: 'none' }}
                    value={editData.bio || ''} 
                    onChange={e => setEditData({...editData, bio: e.target.value})} 
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Major</label>
                        <input 
                            className="auth-input" value={editData.major || ''} 
                            onChange={e => setEditData({...editData, major: e.target.value})} 
                            placeholder="e.g. Computer Science"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Year</label>
                        <select 
                            className="auth-input" value={editData.yearOfStudy || ''} 
                            onChange={e => setEditData({...editData, yearOfStudy: e.target.value})}
                        >
                            <option value="">Select Year</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Masters">Masters</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Skills (comma separated)</label>
                  <input 
                    className="auth-input" value={editData.skills || ''} 
                    onChange={e => setEditData({...editData, skills: e.target.value})} 
                    placeholder="e.g. React, Python, UI Design"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Interests (comma separated)</label>
                  <input 
                    className="auth-input" value={editData.interests || ''} 
                    onChange={e => setEditData({...editData, interests: e.target.value})} 
                    placeholder="e.g. AI, Chess, Football"
                  />
                </div>
              </div>

              <div style={{ padding: '24px 32px', background: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button 
                  onClick={() => setIsEditing(false)} 
                  style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSave} disabled={saving}
                  style={{ 
                    padding: '10px 24px', borderRadius: 12, background: 'var(--accent)', 
                    color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  {saving ? 'Saving...' : <><Check size={18} /> Save Changes</>}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileSection;
