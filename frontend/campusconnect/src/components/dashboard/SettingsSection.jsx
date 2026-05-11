import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Save, Moon, Sun, Shield, LogOut, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import userService from '../../api/userService';
import toast from 'react-hot-toast';

const SettingsSection = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    major: user?.major || '',
    yearOfStudy: user?.yearOfStudy || '',
    skills: user?.skills || '',
    interests: user?.interests || ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile(profileData);
      if (res.success) {
        updateUser(res.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setLoading(true);
    try {
      const res = await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (res.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="settings-container" style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your account settings and preferences</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px' }}>
        {/* Sidebar Tabs */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <tab.icon size={18} />
              <span style={{ flex: 1 }}>{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={16} />}
            </button>
          ))}
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '16px 0' }} />
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: '#EF4444',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Content Area */}
        <main style={{ background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          {activeTab === 'profile' && (
            <motion.form 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              onSubmit={handleProfileUpdate}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Public Profile</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={e => setProfileData({...profileData, username: e.target.value})}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={e => setProfileData({...profileData, bio: e.target.value})}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  style={{ ...inputStyle, resize: 'none', height: 'auto' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Major</label>
                  <input
                    type="text"
                    value={profileData.major}
                    onChange={e => setProfileData({...profileData, major: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Year of Study</label>
                  <input
                    type="text"
                    value={profileData.yearOfStudy}
                    onChange={e => setProfileData({...profileData, yearOfStudy: e.target.value})}
                    placeholder="e.g. 3rd Year"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Skills (comma separated)</label>
                <input
                  type="text"
                  value={profileData.skills}
                  onChange={e => setProfileData({...profileData, skills: e.target.value})}
                  placeholder="React, Spring Boot, UI Design..."
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={primaryBtnStyle}
              >
                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </motion.form>
          )}

          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Change Password</h2>
                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={primaryBtnStyle}>
                    {loading ? 'Updating...' : <><Lock size={18} /> Update Password</>}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Theme Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Select your preferred theme for the dashboard.</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div 
                    onClick={() => setTheme('light')}
                    style={{ 
                      flex: 1, padding: '20px', borderRadius: '16px', border: `2px solid ${theme === 'light' ? 'var(--accent)' : 'var(--border-color)'}`,
                      background: '#FFFFFF', color: '#0F172A', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                    }}
                  >
                    <Sun size={32} style={{ marginBottom: '12px', color: theme === 'light' ? 'var(--accent)' : '#94A3B8' }} />
                    <div style={{ fontWeight: 700 }}>Light Mode</div>
                  </div>
                  <div 
                    onClick={() => setTheme('dark')}
                    style={{ 
                      flex: 1, padding: '20px', borderRadius: '16px', border: `2px solid ${theme === 'dark' ? 'var(--accent)' : 'var(--border-color)'}`,
                      background: '#0B1120', color: '#F1F5F9', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                    }}
                  >
                    <Moon size={32} style={{ marginBottom: '12px', color: theme === 'dark' ? 'var(--accent)' : '#64748B' }} />
                    <div style={{ fontWeight: 700 }}>Dark Mode</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { id: 'email_notif', label: 'Email Notifications', desc: 'Receive daily digests and important updates via email' },
                  { id: 'push_notif', label: 'Push Notifications', desc: 'Get real-time alerts for messages and mentions' },
                  { id: 'activity_notif', label: 'Activity Updates', desc: 'Notify me when people like or comment on my posts' }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <div style={{ width: '44px', height: '24px', background: 'var(--accent)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', right: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  width: '100%',
  fontFamily: 'inherit'
};

const primaryBtnStyle = {
  padding: '14px 24px',
  borderRadius: '12px',
  background: 'var(--bg-accent)',
  color: '#fff',
  border: 'none',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '8px',
  transition: 'opacity 0.2s'
};

export default SettingsSection;
