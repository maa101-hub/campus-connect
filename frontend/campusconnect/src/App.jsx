import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CampusConnectHero from './components/CampusConnectHero';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';
import useAuthStore from './store/authStore';
import { ToastProvider } from './components/ui/Toast';

// ─── Page load splash screen ──────────────────────────────────────────────────
const Splash = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0a0010',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
      }}
    >
      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}
      >
        <motion.div
          animate={{ boxShadow: ['0 0 30px rgba(151,25,253,0.4)', '0 0 70px rgba(151,25,253,0.9)', '0 0 30px rgba(151,25,253,0.4)'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #9719fd 0%, #7b2ff7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ margin: 0, fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '26px', color: '#fff', letterSpacing: '0.01em' }}
        >
          <span style={{ color: '#9d4edd' }}>Campus</span>Connect
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '140px' }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{ height: '3px', borderRadius: '3px', background: 'linear-gradient(90deg, #9719fd, #c77dff)', boxShadow: '0 0 10px rgba(151,25,253,0.7)' }}
      />
    </motion.div>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [ready, setReady] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!ready) {
    return <Splash key="splash" onDone={() => setReady(true)} />;
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AnimatePresence mode="wait">
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', minHeight: '100vh' }}
            >
              <Routes>
                <Route path="/" element={<CampusConnectHero />} />
                <Route 
                  path="/dashboard" 
                  element={
                    isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;