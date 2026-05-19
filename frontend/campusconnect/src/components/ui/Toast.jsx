import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

// ─── Toast Context ─────────────────────────────────────────────
const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ─── Toast Provider ────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// ─── Toast Container ───────────────────────────────────────────
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 99999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none', maxWidth: 380
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── Single Toast Item ─────────────────────────────────────────
const TOAST_STYLES = {
  success: {
    icon: CheckCircle,
    bg: 'linear-gradient(135deg, #065F46, #047857)',
    border: '#10B981',
    iconColor: '#34D399',
  },
  error: {
    icon: AlertCircle,
    bg: 'linear-gradient(135deg, #7F1D1D, #991B1B)',
    border: '#EF4444',
    iconColor: '#FCA5A5',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'linear-gradient(135deg, #78350F, #92400E)',
    border: '#F59E0B',
    iconColor: '#FCD34D',
  },
  info: {
    icon: Info,
    bg: 'linear-gradient(135deg, #1E3A5F, #1E40AF)',
    border: '#3B82F6',
    iconColor: '#93C5FD',
  },
};

const ToastItem = ({ toast, onClose }) => {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        pointerEvents: 'all',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px', borderRadius: 14,
        background: style.bg,
        border: `1px solid ${style.border}40`,
        boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${style.border}20`,
        backdropFilter: 'blur(10px)',
        color: '#fff', fontSize: 14, fontWeight: 500,
        minWidth: 280,
      }}
    >
      <Icon size={20} style={{ color: style.iconColor, flexShrink: 0 }} />
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          background: 'rgba(255,255,255,0.1)', border: 'none',
          color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
          borderRadius: 6, padding: 4, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <X size={14} />
      </motion.button>
    </motion.div>
  );
};

export default ToastProvider;
