import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import DashNavbar from '../components/dashboard/DashNavbar';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import FeedSection from '../components/dashboard/FeedSection';
import RightSidebar from '../components/dashboard/RightSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import './Dashboard.css';

// Lazy-loaded sections (code-split for performance)
const CollegeDirectory = lazy(() => import('../components/dashboard/CollegeDirectory'));
const MessagingSection = lazy(() => import('../components/dashboard/MessagingSection'));
const ProfileSection = lazy(() => import('../components/dashboard/ProfileSection'));
const ExploreSection = lazy(() => import('../components/dashboard/ExploreSection'));
const TrendingSection = lazy(() => import('../components/dashboard/TrendingSection'));
const SavedPostsSection = lazy(() => import('../components/dashboard/SavedPostsSection'));
const SettingsSection = lazy(() => import('../components/dashboard/SettingsSection'));
const EventsSection = lazy(() => import('../components/dashboard/EventsSection'));

// Section loading fallback
const SectionLoader = () => (
  <div style={{ padding: '60px 24px', textAlign: 'center' }}>
    <div style={{
      width: 40, height: 40, margin: '0 auto 16px',
      border: '3px solid var(--border-color)',
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading section...</p>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { initTheme } = useThemeStore();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  useEffect(() => { initTheme(); }, [initTheme]);

  // Scroll to top when switching sections
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeNav]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'home':
        return <FeedSection user={user} />;
      case 'college':
        return <CollegeDirectory user={user} onMessageUser={(u) => {
          setSelectedRecipient(u);
          setActiveNav('messages');
        }} />;
      case 'messages':
        return <MessagingSection user={user} initialRecipient={selectedRecipient} />;
      case 'profile':
        return <ProfileSection user={user} />;
      case 'explore':
        return <ExploreSection user={user} />;
      case 'events':
        return <EventsSection user={user} />;
      case 'trending':
        return <TrendingSection />;
      case 'saved':
        return <SavedPostsSection user={user} />;
      case 'settings':
        return <SettingsSection user={user} />;
      default:
        return <FeedSection user={user} />;
    }
  };

  // Sections that should hide the right sidebar for full-width layout
  const fullWidthSections = ['messages', 'settings', 'profile'];
  const showRightSidebar = !fullWidthSections.includes(activeNav);

  return (
    <motion.div
      className="dash-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <DashNavbar user={user} onLogout={handleLogout} onNavigate={setActiveNav} />

      <div className="dash-layout">
        <LeftSidebar
          user={user}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onLogout={handleLogout}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, minWidth: 0 }}
          >
            <Suspense fallback={<SectionLoader />}>
              {renderContent()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
        {showRightSidebar && <RightSidebar user={user} />}
      </div>

      <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </motion.div>
  );
};

export default Dashboard;
