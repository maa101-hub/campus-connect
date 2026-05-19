import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Shield, Palette, 
  Lock, Trash2, ChevronRight, Moon, Sun
} from 'lucide-react';
import useThemeStore from '../../store/themeStore';

const SettingsSection = ({ user }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('account');

  const sections = [
    { id: 'account', label: 'Account', icon: User, desc: 'Name, email, password' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Push, email alerts' },
    { id: 'privacy', label: 'Privacy', icon: Shield, desc: 'Visibility, blocking' },
    { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme, display' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings user={user} />;
      case 'notifications':
        return <NotificationSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'appearance':
        return <AppearanceSettings theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <AccountSettings user={user} />;
    }
  };

  return (
    <motion.div
      className="dash-feed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '0 24px 40px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px 0' }}>
          <Settings size={24} style={{ display: 'inline', marginRight: 10, color: 'var(--accent)' }} />
          Settings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Manage your account preferences and privacy
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        {/* Settings Nav */}
        <div className="post-card" style={{ padding: 12, margin: 0, height: 'fit-content' }}>
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12, border: 'none',
                background: activeSection === section.id ? 'var(--accent-light)' : 'transparent',
                color: activeSection === section.id ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
              }}
            >
              <section.icon size={18} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{section.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{section.desc}</div>
              </div>
              <ChevronRight size={14} style={{ opacity: activeSection === section.id ? 1 : 0.3 }} />
            </motion.button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="post-card" style={{ padding: 28, margin: 0 }}>
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Account Settings ─────────────────────────────────────────
const AccountSettings = ({ user }) => {
  return (
    <div>
      <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700 }}>Account Settings</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SettingField label="Display Name" value={user?.name || ''} />
        <SettingField label="Username" value={`@${user?.username || ''}`} disabled />
        <SettingField label="Email" value={user?.email || ''} />
        <SettingField label="College" value={user?.collegeName || ''} disabled />
        
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, marginTop: 8 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Lock size={14} style={{ display: 'inline', marginRight: 6 }} />
            Password
          </h4>
          <button style={{
            padding: '10px 20px', borderRadius: 10, background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)', fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}>
            Change Password
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, marginTop: 8 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#EF4444' }}>
            <Trash2 size={14} style={{ display: 'inline', marginRight: 6 }} />
            Danger Zone
          </h4>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-muted)' }}>
            Once you delete your account, there is no going back.
          </p>
          <button style={{
            padding: '10px 20px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: 13, fontWeight: 600,
            color: '#EF4444', cursor: 'pointer'
          }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Notification Settings ─────────────────────────────────────
const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    pushLikes: true,
    pushComments: true,
    pushMessages: true,
    pushConnections: true,
    emailDigest: false,
    emailMentions: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700 }}>Notification Preferences</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Push Notifications
        </h4>
        <ToggleRow label="Likes on your posts" checked={settings.pushLikes} onChange={() => toggleSetting('pushLikes')} />
        <ToggleRow label="Comments on your posts" checked={settings.pushComments} onChange={() => toggleSetting('pushComments')} />
        <ToggleRow label="New messages" checked={settings.pushMessages} onChange={() => toggleSetting('pushMessages')} />
        <ToggleRow label="Connection requests" checked={settings.pushConnections} onChange={() => toggleSetting('pushConnections')} />
        
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', margin: '24px 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Email Notifications
        </h4>
        <ToggleRow label="Weekly digest" checked={settings.emailDigest} onChange={() => toggleSetting('emailDigest')} />
        <ToggleRow label="When someone mentions you" checked={settings.emailMentions} onChange={() => toggleSetting('emailMentions')} />
      </div>
    </div>
  );
};

// ─── Privacy Settings ──────────────────────────────────────────
const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profilePublic: true,
    showEmail: false,
    showOnline: true,
    allowMessages: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700 }}>Privacy & Safety</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Profile Visibility
        </h4>
        <ToggleRow label="Public profile (visible to all students)" checked={settings.profilePublic} onChange={() => toggleSetting('profilePublic')} />
        <ToggleRow label="Show email on profile" checked={settings.showEmail} onChange={() => toggleSetting('showEmail')} />
        <ToggleRow label="Show online status" checked={settings.showOnline} onChange={() => toggleSetting('showOnline')} />
        <ToggleRow label="Allow messages from anyone" checked={settings.allowMessages} onChange={() => toggleSetting('allowMessages')} />
      </div>
    </div>
  );
};

// ─── Appearance Settings ───────────────────────────────────────
const AppearanceSettings = ({ theme, toggleTheme }) => {
  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
  ];

  return (
    <div>
      <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700 }}>Appearance</h3>
      
      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Theme
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {themes.map(t => (
          <motion.div
            key={t.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { if (theme !== t.id) toggleTheme(); }}
            style={{
              padding: 20, borderRadius: 14, cursor: 'pointer',
              background: theme === t.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
              border: theme === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              textAlign: 'center'
            }}
          >
            <t.icon size={28} style={{ color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)', marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── Reusable Components ───────────────────────────────────────
const SettingField = ({ label, value, disabled = false }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
      {label}
    </label>
    <input
      value={value}
      disabled={disabled}
      readOnly
      style={{
        width: '100%', padding: '10px 14px', borderRadius: 10,
        background: disabled ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
        border: '1px solid var(--border-color)', fontSize: 14,
        color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
        outline: 'none'
      }}
    />
  </div>
);

const ToggleRow = ({ label, checked, onChange }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid var(--border-light)'
  }}>
    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? 'var(--accent)' : 'var(--bg-tertiary)',
        border: checked ? 'none' : '1px solid var(--border-color)',
        position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', position: 'absolute', top: 3,
        left: checked ? 23 : 3, transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </div>
  </div>
);

export default SettingsSection;
