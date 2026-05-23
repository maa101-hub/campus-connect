import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Reusable inline error state for API failures.
 * @param {string} message - Error message to display
 * @param {function} onRetry - Callback to retry the failed action
 */
const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ ease: [0.23, 1, 0.32, 1] }}
    style={{
      textAlign: 'center',
      padding: '50px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
    }}
  >
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: 'rgba(239, 68, 68, 0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <AlertTriangle size={26} style={{ color: '#EF4444' }} />
    </div>
    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
      {message}
    </p>
    {onRetry && (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRetry}
        style={{
          marginTop: 8,
          padding: '9px 20px',
          borderRadius: 10,
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <RefreshCw size={14} /> Try again
      </motion.button>
    )}
  </motion.div>
);

export default ErrorState;
