import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0010',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Manrope', sans-serif",
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: 460 }}
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: 120, fontWeight: 900, lineHeight: 1,
            background: 'linear-gradient(135deg, #9719fd, #c77dff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 16,
          }}
        >
          404
        </motion.div>

        {/* Title */}
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: '#fff',
          margin: '0 0 12px',
        }}>
          Page Not Found
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6, margin: '0 0 32px',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to campus!
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px', borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px', borderRadius: 12,
              background: 'linear-gradient(135deg, #9719fd, #7b2ff7)',
              border: 'none',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(151,25,253,0.4)',
            }}
          >
            <Home size={16} /> Home Page
          </motion.button>
        </div>

        {/* Decorative element */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '15%', right: '10%',
            width: 200, height: 200, borderRadius: '50%',
            border: '1px solid rgba(151,25,253,0.15)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  );
};

export default NotFound;
