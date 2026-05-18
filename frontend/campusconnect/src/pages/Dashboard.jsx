import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import DashNavbar from '../components/dashboard/DashNavbar';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import FeedSection from '../components/dashboard/FeedSection';
import RightSidebar from '../components/dashboard/RightSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import CollegeDirectory from '../components/dashboard/CollegeDirectory';
import MessagingSection from '../components/dashboard/MessagingSection';
import ProfileSection from '../components/dashboard/ProfileSection';
import ExploreSection from '../components/dashboard/ExploreSection';
import TrendingSection from '../components/dashboard/TrendingSection';
import SavedPostsSection from '../components/dashboard/SavedPostsSection';
import SettingsSection from '../components/dashboard/SettingsSection';
import EventsSection from '../components/dashboard/EventsSection';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { initTheme } = useThemeStore();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  useEffect(() => { initTheme(); }, [initTheme]);

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
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        {showRightSidebar && <RightSidebar user={user} />}
      </div>

      <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </motion.div>
  );
};

export default Dashboard;
