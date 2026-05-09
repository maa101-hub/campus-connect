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
      default:
        return <FeedSection user={user} />;
    }
  };

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
        {renderContent()}
        <RightSidebar />
      </div>

      <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </motion.div>
  );
};

export default Dashboard;
