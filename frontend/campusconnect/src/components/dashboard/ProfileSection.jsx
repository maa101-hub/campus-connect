import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, GraduationCap, Calendar, Edit3, Settings, Grid, 
  Bookmark, MessageSquare, Heart, X, Check, Award, Briefcase, 
  Code, Coffee, Globe, ShieldCheck, Zap, CodeXml, SendHorizontal
} from 'lucide-react';
import postService from '../../api/postService';
import userService from '../../api/userService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ProfileSection = ({ user: currentUser, targetUser: initialTargetUser }) => {
  const [targetUser, setTargetUser] = useState(initialTargetUser || currentUser);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...targetUser });
  const [saving, setSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(targetUser?.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(targetUser?.followerCount || 0);
  const updateUserStore = useAuthStore(state => state.updateUser);

  const isOwnProfile = !initialTargetUser || initialTargetUser.id === currentUser.id;
  const trustLevel = targetUser?.trustLevel || 85;
  const xp = targetUser?.xp || 1250;
  const isVerified = targetUser?.isVerified || false;
  const interestList = targetUser?.interests ? targetUser.interests.split(',').map(i => i.trim()) : ['AI', 'Development', 'Design'];

  useEffect(() => {
    if (initialTargetUser) {
      setTargetUser(initialTargetUser);
      setIsFollowing(initialTargetUser.isFollowing);
      setFollowerCount(initialTargetUser.followerCount);
    } else {
      setTargetUser(currentUser);
    }
  }, [initialTargetUser, currentUser]);

  useEffect(() => {
    if (targetUser?.id) {
      fetchUserPosts();
      if (isOwnProfile) {
        setEditData({ ...targetUser });
      }
    }
  }, [targetUser]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getUserPosts(targetUser.id, currentUser.id);
      if (res.success) {
        setPosts(res.data?.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(targetUser.id);
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        toast.success(`Unfollowed @${targetUser.username}`);
      } else {
        await userService.followUser(targetUser.id);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`Following @${targetUser.username}`);
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile(editData);
      if (res.success) {
        updateUserStore(res.data);
        setTargetUser(res.data);
        setIsEditing(false);
        toast.success('Profile updated!');
      }
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Trust Score', value: `${trustLevel}%`, icon: <ShieldCheck size={16} /> },
    { label: 'Campus XP', value: xp, icon: <Zap size={16} /> },
    { label: 'Projects', value: posts.length, icon: <Grid size={16} /> },
  ];

  const skillList = useMemo(() => {
    return targetUser?.skills ? targetUser.skills.split(',').map(s => ({ name: s.trim(), endorsements: Math.floor(Math.random() * 20) + 5 })) : [
      { name: 'React', endorsements: 12 },
      { name: 'Java', endorsements: 8 },
      { name: 'UI Design', endorsements: 15 }
    ];
  }, [targetUser?.skills]);

  return (
    <motion.div 
      className="dash-feed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '0 0 40px 0' }}
    >
      {/* Profile Header: Premium Mesh Gradient */}
      <div style={{ 
        height: 220, 
        background: isVerified 
          ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' 
          : 'linear-gradient(135deg, #1e293b, #334155)',
        position: 'relative', borderRadius: '0 0 32px 32px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Floating Abstract Shapes */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }} />
        
        <div style={{
          position: 'absolute', bottom: -70, left: 40,
          display: 'flex', alignItems: 'flex-end', gap: 24
        }}>
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            background: 'var(--bg-primary)', border: '6px solid rgba(255,255,255,0.3)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 56, fontWeight: 900, color: '#6366f1',
            position: 'relative', overflow: 'hidden'
          }}>
            {targetUser?.name?.charAt(0).toUpperCase()}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(99, 102, 241, 0.05))' }} />
          </div>
          <div style={{ marginBottom: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>{targetUser?.name}</h2>
              {isVerified && (
                <div title="Verified Excellence" style={{ color: '#fff', background: '#6366f1', padding: 6, borderRadius: '50%', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)' }}>
                  <ShieldCheck size={20} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 4 }}>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: 600, fontSize: 16 }}>@{targetUser?.username}</p>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-color)' }} />
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{followerCount}</span> Followers
              </p>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-color)' }} />
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{targetUser?.followingCount || 0}</span> Following
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 20, right: 30, display: 'flex', gap: 12 }}>
          {isOwnProfile ? (
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              style={{ 
                padding: '12px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <Edit3 size={18} /> Edit Profile
            </motion.button>
          ) : (
            <>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                onClick={handleFollowToggle}
                style={{ 
                  padding: '12px 28px', borderRadius: 16, 
                  background: isFollowing ? 'rgba(255,255,255,0.15)' : '#fff',
                  backdropFilter: 'blur(15px)', border: isFollowing ? '1px solid rgba(255,255,255,0.25)' : 'none',
                  color: isFollowing ? '#fff' : '#4f46e5', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                {isFollowing ? <Check size={18} /> : <Zap size={18} />}
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ 
                  padding: '12px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                <MessageSquare size={18} />
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 100, padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
        {/* Left Content: Bio & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Bio Card */}
          <div className="post-card" style={{ padding: 32, margin: 0, borderRadius: 24 }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 800 }}>About Me</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 16 }}>
              {targetUser?.bio || "Passionate student explorer at Campus Connect. Building the future one post at a time!"}
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 24, borderTop: '1px solid var(--border-light)', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>
                    <div style={{ padding: 8, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: 10 }}><Briefcase size={16} /></div>
                    <span>{targetUser?.major || 'Computer Science'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>
                    <div style={{ padding: 8, background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: 10 }}><GraduationCap size={16} /></div>
                    <span>{targetUser?.yearOfStudy || 'Sophomore'}</span>
                </div>
            </div>
          </div>

          {/* Skills & Endorsements (LinkedIn Style) */}
          <div className="post-card" style={{ padding: 32, margin: 0, borderRadius: 24 }}>
            <h4 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Award size={20} style={{ color: '#6366f1' }} /> Skills & Endorsements
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {skillList.map(skill => (
                    <motion.div 
                      key={skill.name} 
                      whileHover={{ y: -5 }}
                      style={{ 
                        padding: '16px 20px', borderRadius: 20, background: 'var(--bg-tertiary)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800 }}>{skill.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{skill.endorsements} endorsements</div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          style={{
                            width: 32, height: 32, borderRadius: 10, background: '#6366f1',
                            color: '#fff', border: 'none', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          +
                        </motion.button>
                    </motion.div>
                ))}
            </div>
          </div>

          {/* Activity Tabs */}
          <div>
            <div style={{ 
              display: 'flex', gap: 40, borderBottom: '1px solid var(--border)',
              marginBottom: 24, paddingLeft: 10
            }}>
              {['Projects', 'Saved', 'Activity'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  style={{
                    padding: '12px 0', background: 'none', border: 'none',
                    fontSize: 15, fontWeight: 800, color: activeTab === tab.toLowerCase() ? '#6366f1' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.toLowerCase() ? '3px solid #6366f1' : '3px solid transparent',
                    cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading projects...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40 }}>📭</p>
                <p>No projects shared yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="post-card"
                    style={{ 
                      padding: 0, overflow: 'hidden', margin: 0,
                      display: 'flex', flexDirection: 'column', height: '100%',
                      borderRadius: 20
                    }}
                  >
                    {post.imageUrl ? (
                      <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:8095'}${post.imageUrl}`} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ 
                        height: 200, background: 'linear-gradient(45deg, #1e1b4b, #312e81)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 30, textAlign: 'center', fontSize: 14, color: '#fff',
                        fontWeight: 600
                      }}>
                        "{post.content.slice(0, 80)}..."
                      </div>
                    )}
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', gap: 15, color: 'var(--text-muted)', fontSize: 13 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Heart size={16} /> {post.likeCount}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MessageSquare size={16} /> {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Stats & Interests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Detailed Info Card */}
          <div className="post-card" style={{ padding: 28, margin: 0, borderRadius: 24 }}>
            <h4 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800 }}>Stats & Trust</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {stats.map(stat => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 14, background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1'
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="post-card" style={{ padding: 24, margin: 0 }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code size={18} /> Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skillList.map(skill => (
                    <span key={skill.name} style={{ 
                        padding: '6px 12px', borderRadius: 8, background: 'var(--bg-tertiary)',
                        fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)'
                    }}>
                        {skill.name}
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
              <motion.a whileHover={{ y: -3, color: '#6366f1' }} href="#" style={{ color: 'var(--text-muted)' }} title="Github"><CodeXml size={20} /></motion.a>
              <motion.a whileHover={{ y: -3, color: '#0ea5e9' }} href="#" style={{ color: 'var(--text-muted)' }} title="Twitter"><SendHorizontal size={20} /></motion.a>
              <motion.a whileHover={{ y: -3, color: '#2563eb' }} href="#" style={{ color: 'var(--text-muted)' }} title="LinkedIn"><Globe size={20} /></motion.a>
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
