import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useNotificationStore from '../store/notificationStore';

import DashNavbar from '../components/dashboard/DashNavbar';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import FeedSection from '../components/dashboard/FeedSection';
import RightSidebar from '../components/dashboard/RightSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import CollegeDirectory from '../components/dashboard/CollegeDirectory';
import MessagingSection from '../components/dashboard/MessagingSection';
import ProfileSection from '../components/dashboard/ProfileSection';
import CollabHub from '../components/dashboard/CollabHub';
import CampusMap from '../components/dashboard/CampusMap';
import SettingsSection from '../components/dashboard/SettingsSection';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { initTheme } = useThemeStore();
  const { receiveMessage, addNotification, setTyping, setReadReceiptTrigger } = useNotificationStore();
  
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isConfessionMode, setIsConfessionMode] = useState(false);
  
  const activeNavRef = useRef(activeNav);
  useEffect(() => { activeNavRef.current = activeNav; }, [activeNav]);

  useEffect(() => { initTheme(); }, [initTheme]);

  // Global WebSocket Connection
  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem('token');
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8095/ws';
    const socket = new SockJS(`${wsUrl}?token=${token}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Global WebSocket Connected');
        
        // Messages subscription
        stompClient.subscribe(`/topic/messages/${user.id}`, (msg) => {
          if (msg.body) {
            const incomingMessage = JSON.parse(msg.body);
            receiveMessage(incomingMessage);
            if (activeNavRef.current !== 'messages') {
              addNotification({
                id: Date.now(),
                user: 'Someone',
                action: 'sent you a new message!',
                time: 'Just now'
              });
            }
          }
        });

        // Typing subscription
        stompClient.subscribe(`/topic/typing/${user.id}`, (msg) => {
          if (msg.body) {
            const event = JSON.parse(msg.body);
            const typingState = event.typing !== undefined ? event.typing : event.isTyping;
            setTyping(event.senderId, typingState);
          }
        });

        // Read receipt subscription
        stompClient.subscribe(`/topic/read/${user.id}`, (msg) => {
          if (msg.body) {
            const readerId = parseInt(msg.body);
            setReadReceiptTrigger(readerId);
          }
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
    return () => stompClient.deactivate();
  }, [user, receiveMessage, addNotification, setTyping]);

  const sendTyping = (recipientId, isTyping) => {
    if (stompClientRef.current?.connected && user?.id) {
      stompClientRef.current.publish({
        destination: '/app/typing',
        body: JSON.stringify({
          senderId: user.id,
          recipientId: recipientId,
          typing: isTyping,
          isTyping: isTyping
        })
      });
    }
  };

  const stompClientRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNav = (navId) => {
    if (navId === 'profile') {
      setSelectedProfile(null);
    }
    setActiveNav(navId);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'home':
        return <FeedSection user={user} isConfessionMode={isConfessionMode} />;
      case 'college':
        return <CollegeDirectory 
          user={user} 
          onMessageUser={(u) => {
            setSelectedRecipient(u);
            setActiveNav('messages');
          }}
          onViewProfile={(u) => {
            setSelectedProfile(u);
            setActiveNav('profile');
          }}
        />;
      case 'messages':
        return <MessagingSection user={user} initialRecipient={selectedRecipient} sendTyping={sendTyping} />;
      case 'collab':
        return <CollabHub user={user} />;
      case 'map':
        return <CampusMap />;
      case 'profile':
        return <ProfileSection user={user} targetUser={selectedProfile} />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <FeedSection user={user} />;
    }
  };

  return (
    <motion.div
      className={`dash-root ${isConfessionMode ? 'confession-mode' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <DashNavbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={handleNav} 
        onViewProfile={(u) => {
          setSelectedProfile(u);
          setActiveNav('profile');
        }}
        isConfessionMode={isConfessionMode}
        setIsConfessionMode={setIsConfessionMode}
      />

      <div className="dash-layout">
        <LeftSidebar
          user={user}
          activeNav={activeNav}
          setActiveNav={handleNav}
          onLogout={handleLogout}
          isConfessionMode={isConfessionMode}
          setIsConfessionMode={setIsConfessionMode}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav + (selectedProfile?.id || '')}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, minWidth: 0 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        <RightSidebar />
      </div>

      <MobileBottomNav activeNav={activeNav} setActiveNav={handleNav} />
    </motion.div>
  );
};

export default Dashboard;
