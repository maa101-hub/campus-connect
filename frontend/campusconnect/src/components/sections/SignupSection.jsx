import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import girl3Img from '../../assets/image3.png';
import useAuthStore from '../../store/authStore';

// ─── Floating left decorations ────────────────────────────────────────────────
const floatingBadges = [
  { id: 1, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>, label: 'Live Campus Feed', top: '20%', left: '4%',  delay: 0.4, anim: 'card-float-1' },
  { id: 2, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>, label: 'Trending Feed',    top: '38%', left: '2%',  delay: 0.6, anim: 'card-float-2' },
];
const floatingIcons = [
  { id: 1, emoji: '❤️', bg: '#3b82f6', top: '24%', left: '46%', size: 46, delay: 0.5, anim: 'card-float-2' },
  { id: 2, emoji: '🔔', bg: '#ef4444', top: '48%', left: '43%', size: 44, delay: 0.7, anim: 'card-float-3' },
  { id: 3, emoji: '❤️', bg: '#ef4444', top: '66%', left: '38%', size: 52, delay: 0.9, anim: 'card-float-1' },
];

// ─── Mini particles for left panel ───────────────────────────────────────────
const MINI_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: `${(i * 9 + 5) % 90}%`,
  y: `${(i * 11 + 8) % 85}%`,
  size: (i % 2) + 2,
  dur: (i % 3) + 4,
  delay: i * 0.4,
  color: i % 3 === 0 ? '#9d4edd' : i % 3 === 1 ? '#ff6a00' : '#00c973',
}));

// ─── Count-up hook ────────────────────────────────────────────────────────────
const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// ─── Eye toggle icon ──────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ─── FormInput with optional eye toggle ───────────────────────────────────────
const FormInput = ({ id, type = 'text', placeholder, value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <motion.input
        id={id}
        type={isPassword && showPwd ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          padding: `13px ${isPassword ? '48px' : '22px'} 13px 22px`,
          borderRadius: '50px',
          background: error
            ? 'rgba(255,80,80,0.07)'
            : 'rgba(255,255,255,0.07)',
          border: `1.5px solid ${
            error ? 'rgba(255,100,100,0.6)' :
            focused ? 'rgba(157,78,221,0.8)' :
            'rgba(255,255,255,0.1)'
          }`,
          color: '#ffffff',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '14px',
          fontWeight: 400,
          outline: 'none',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          boxShadow: error
            ? '0 0 0 3px rgba(255,80,80,0.12)'
            : focused ? '0 0 0 3px rgba(151,25,253,0.15)' : 'none',
          backdropFilter: 'blur(10px)',
          boxSizing: 'border-box',
        }}
      />
      {/* Eye toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPwd(p => !p)}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
          }}
          tabIndex={-1}
        >
          <EyeIcon open={showPwd} />
        </button>
      )}
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              margin: '4px 0 0 18px',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '11px',
              color: 'rgba(255,110,110,0.9)',
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SignupSection — fixed fullscreen modal ───────────────────────────────────
const SignupSection = ({ onClose }) => {
  const [tab, setTab] = useState('signup');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [signup, setSignup] = useState({ 
    name: '', 
    email: '', 
    username: '',
    password: '', 
    confirm: '',
    collegeName: '',
    collegeId: ''
  });
  const [login, setLogin]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const studentCount = useCountUp(200, 1800);

  // Mouse parallax for girl
  const leftPanelRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sc = { damping: 30, stiffness: 100 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), sc);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), sc);

  const handlePanelMouse = (e) => {
    const r = leftPanelRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetParallax = () => { mx.set(0); my.set(0); };

  const setS = (k) => (e) => setSignup(f => ({ ...f, [k]: e.target.value }));
  const setL = (k) => (e) => setLogin(f => ({ ...f, [k]: e.target.value }));

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape to close
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const validate = (currentStep = null) => {
    const e = {};
    if (tab === 'signup') {
      if (!currentStep || currentStep === 1) {
        if (!signup.name.trim())                      e.name     = 'Name is required';
        if (!signup.email.includes('@'))               e.email    = 'Enter a valid email';
        if (signup.username.length < 4)               e.username = 'Min 4 characters';
        if (signup.password.length < 8)               e.password = 'Min 8 characters';
        if (!/(?=.*[A-Z])(?=.*[0-9])/.test(signup.password)) e.password = 'Need uppercase & number';
        if (signup.confirm !== signup.password)        e.confirm  = 'Passwords do not match';
      }
      
      if (!currentStep || currentStep === 2) {
        if (!signup.collegeName.trim())               e.collegeName = 'College name required';
        if (!signup.collegeId)                        e.collegeId   = 'College ID required';
      }

      if (currentStep === 3) {
        if (otp.length < 6)                            e.otp = 'OTP must be 6 digits';
      }
    } else {
      if (!login.email.includes('@'))  e.lemail    = 'Enter a valid email';
      if (!login.password)             e.lpassword = 'Password required';
    }
    return e;
  };

  const { login: performLogin, signup: performSignup, verifyOtp: performVerify, isLoading: loading, error: authError } = useAuthStore();
  const navigate = useNavigate();

  const handleNext = () => {
    const e = validate(1);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async () => {
    const e = validate(2);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});

    try {
      if (tab === 'signup') {
        const submissionData = {
          ...signup,
          collegeId: parseInt(signup.collegeId, 10)
        };
        const res = await performSignup(submissionData);
        if (res.success) {
          setStep(3); // Go to OTP step
        } else {
          setErrors({ general: res.message || 'Signup failed' });
        }
      } else {
        const res = await performLogin(login);
        if (res.success) {
          setSuccess(true);
          setTimeout(() => { 
            setSuccess(false); 
            onClose(); 
            navigate('/dashboard'); 
          }, 1500);
        } else {
          setErrors({ general: res.message || 'Login failed' });
        }
      }
    } catch {
      setErrors({ general: 'Connection failed' });
    }
  };

  const handleVerifyOtp = async () => {
    const e = validate(3);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});

    try {
      const res = await performVerify(signup.email, otp);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => { 
          setSuccess(false); 
          setTab('login');
          setStep(1);
          setSignup({ name: '', email: '', username: '', password: '', confirm: '', collegeName: '', collegeId: '' });
          setOtp('');
        }, 1500);
      } else {
        setErrors({ general: res.message || 'Invalid OTP' });
      }
    } catch {
      setErrors({ general: 'Verification failed' });
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,0,15,0.85)', backdropFilter: 'blur(8px)', zIndex: 100 }}
      />

      {/* Panel wrapper */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'fixed', inset: 0, zIndex: 101, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
      >
        {/* Inner card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '92vw', maxWidth: '1100px',
            height: '88vh', maxHeight: '720px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #0f0025 0%, #0a0010 100%)',
            border: '1px solid rgba(157,78,221,0.25)',
            boxShadow: '0 32px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            pointerEvents: 'all',
          }}
        >
          {/* Close ✕ */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)', fontSize: 18,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, lineHeight: 1,
            }}
            aria-label="Close"
          >✕</motion.button>

          {/* Grid background */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(157,78,221,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(157,78,221,0.07) 1px, transparent 1px)`,
            backgroundSize: '55px 55px',
            maskImage: 'radial-gradient(ellipse 65% 80% at 25% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 80% at 25% 50%, black 30%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Orb */}
          <motion.div aria-hidden="true"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(151,25,253,0.28) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }}
          />

          {/* ══ LEFT SIDE ══ */}
          <div
            ref={leftPanelRef}
            onMouseMove={handlePanelMouse}
            onMouseLeave={resetParallax}
            style={{ position: 'relative', overflow: 'hidden' }}
          >

            {/* Girl — with mouse parallax tilt */}
            <motion.img
              src={girl3Img} alt="" aria-hidden="true"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'absolute', bottom: 0, left: '-5%',
                height: '90%', width: 'auto', maxWidth: '115%',
                objectFit: 'contain', objectPosition: 'bottom left',
                filter: 'drop-shadow(0 0 40px rgba(151,25,253,0.4))',
                zIndex: 3, pointerEvents: 'none',
                rotateX, rotateY,
                transformStyle: 'preserve-3d',
              }}
            />

            {/* Mini floating particles */}
            {MINI_PARTICLES.map(p => (
              <motion.div key={p.id} aria-hidden="true"
                animate={{ y: ['0px', '-20px', '0px'], opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: '50%', background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`, pointerEvents: 'none', zIndex: 1 }}
              />
            ))}

            {/* Hi text */}
            <motion.span
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ position: 'absolute', bottom: '6%', left: '6%', fontFamily: "'Sail', cursive", fontSize: 'clamp(44px, 5.5vw, 72px)', color: 'rgba(157,78,221,0.5)', zIndex: 4, pointerEvents: 'none', lineHeight: 1, userSelect: 'none' }}
            >Hi</motion.span>

            {/* Floating badges */}
            {floatingBadges.map(b => (
              <motion.div key={b.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: b.delay }}
                style={{ position: 'absolute', top: b.top, left: b.left, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 50, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', color: 'rgba(255,255,255,0.85)', fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 13, zIndex: 5, animation: `${b.anim} 4s ease-in-out infinite`, cursor: 'default' }}
              ><span>{b.icon}</span>{b.label}</motion.div>
            ))}

            {/* Floating icon bubbles */}
            {floatingIcons.map(ic => (
              <motion.div key={ic.id}
                initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: ic.delay }}
                style={{ position: 'absolute', top: ic.top, left: ic.left, width: ic.size, height: ic.size, borderRadius: '50%', background: ic.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: ic.size * 0.45, boxShadow: `0 0 18px ${ic.bg}88`, zIndex: 5, animation: `${ic.anim} ${3.5 + ic.id * 0.6}s ease-in-out infinite` }}
              >{ic.emoji}</motion.div>
            ))}

            {/* +200 Students card — with count-up */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              style={{ position: 'absolute', bottom: '18%', right: '-8%', padding: '10px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)', zIndex: 5, animation: 'card-float-3 5s ease-in-out infinite', whiteSpace: 'nowrap' }}
            >
              <p style={{ margin: 0, fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>+{studentCount} Students Joined</p>
              <p style={{ margin: '2px 0 0', fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>From Amone</p>
            </motion.div>

            {/* New Feature pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
              style={{ position: 'absolute', top: '60%', right: '0%', padding: '7px 14px', borderRadius: 50, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.7)', fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 12, zIndex: 5, animation: 'card-float-2 4.5s ease-in-out infinite' }}
            >New Feature ✨</motion.div>
          </div>

          {/* ══ RIGHT SIDE — form ══ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px,3.5vw,44px)', gap: 16, borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}
          >
            {/* Success state */}
            <AnimatePresence>
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,0,16,0.92)', zIndex: 20, borderRadius: 28 }}
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #9719fd, #7b2ff7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 22, color: '#fff', margin: 0 }}>Welcome aboard! 🎉</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '8px 0 0' }}>Redirecting you now…</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Heading */}
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-baloo)", fontWeight: 800, fontSize: 'clamp(22px, 2.5vw, 32px)', color: '#fff', lineHeight: 1.2 }}>
                Welcome To Campus Connect
              </h2>
              <p style={{ margin: '5px 0 0', fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                Join 50,000+ students on the campus network.
              </p>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 50, padding: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
              {['signup', 'login'].map(t => (
                <motion.button
                  key={t}
                  onClick={() => { setTab(t); setErrors({}); }}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 14,
                    background: tab === t ? 'linear-gradient(135deg, #9719fd, #7b2ff7)' : 'transparent',
                    color: tab === t ? '#fff' : 'rgba(255,255,255,0.45)',
                    boxShadow: tab === t ? '0 2px 14px rgba(151,25,253,0.4)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {t === 'signup' ? 'Sign Up' : 'Log In'}
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Sign Up fields */}
            <AnimatePresence mode="wait">
              {tab === 'signup' ? (
                <motion.div 
                  key={`signup-step-${step}`} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                      Step {step} of 3
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ width: 24, height: 4, borderRadius: 2, background: step >= 1 ? '#7C3AED' : 'rgba(255,255,255,0.1)' }} />
                      <div style={{ width: 24, height: 4, borderRadius: 2, background: step >= 2 ? '#7C3AED' : 'rgba(255,255,255,0.1)' }} />
                      <div style={{ width: 24, height: 4, borderRadius: 2, background: step >= 3 ? '#7C3AED' : 'rgba(255,255,255,0.1)' }} />
                    </div>
                  </div>

                  {step === 1 ? (
                    <>
                      <FormInput id="modal-name"     placeholder="Full Name"   value={signup.name}     onChange={setS('name')}     error={errors.name} />
                      <FormInput id="modal-email"    type="email"    placeholder="College Email"  value={signup.email}    onChange={setS('email')}    error={errors.email} />
                      <FormInput id="modal-username" placeholder="Choose Username" value={signup.username} onChange={setS('username')} error={errors.username} />
                      <FormInput id="modal-password" type="password" placeholder="Password (8+ chars, A-Z, 0-9)" value={signup.password} onChange={setS('password')} error={errors.password} />
                      <FormInput id="modal-confirm"  type="password" placeholder="Confirm Password"  value={signup.confirm}  onChange={setS('confirm')}  error={errors.confirm} />
                    </>
                  ) : step === 2 ? (
                    <>
                      <div style={{ padding: '8px 4px', marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Almost there! Tell us where you study.</p>
                      </div>
                      <FormInput id="modal-college"  placeholder="College Name" value={signup.collegeName} onChange={setS('collegeName')} error={errors.collegeName} />
                      <FormInput id="modal-college-id" type="number" placeholder="College ID Number" value={signup.collegeId} onChange={setS('collegeId')} error={errors.collegeId} />
                    </>
                  ) : (
                    <>
                      <div style={{ padding: '8px 4px', marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>We've sent an OTP to {signup.email}.</p>
                      </div>
                      <FormInput 
                        id="modal-otp" 
                        type="text" 
                        placeholder="Enter 6-digit OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        error={errors.otp} 
                      />
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                        Check your server logs to see the OTP for now!
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div key="login-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <FormInput id="modal-login-email"    type="email"    placeholder="Enter Your Email"  value={login.email}    onChange={setL('email')}    error={errors.lemail} />
                  <FormInput id="modal-login-password" type="password" placeholder="Enter Password"    value={login.password} onChange={setL('password')} error={errors.lpassword} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* General error display */}
            {(errors.general || authError) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  padding: '10px 16px', borderRadius: 12, 
                  background: 'rgba(255,80,80,0.1)', 
                  border: '1px solid rgba(255,80,80,0.3)',
                  color: '#ff8080', fontSize: '13px', fontFamily: "'Manrope', sans-serif"
                }}
              >
                {errors.general || authError}
              </motion.div>
            )}

            {/* Submit row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
              {tab === 'signup' && step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (tab === 'signup') {
                      setTab('login');
                    } else {
                      setTab('signup');
                      setStep(1);
                    }
                    setErrors({});
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: 0, textDecoration: 'underline', textUnderlineOffset: 3 }}
                >
                  {tab === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                </button>
              )}

              <motion.button
                id="modal-submit-btn"
                onClick={
                  tab === 'signup' 
                    ? (step === 1 ? handleNext : (step === 2 ? handleSubmit : handleVerifyOtp)) 
                    : handleSubmit
                }
                disabled={loading}
                whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(124,58,237,0.65)' }}
                whileTap={{ scale: 0.97 }}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 8, 
                  padding: '12px 28px', borderRadius: 50, 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #9719fd 100%)', 
                  color: '#fff', fontFamily: "'Manrope', sans-serif", 
                  fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', 
                  boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                    />
                    Wait...
                  </>
                ) : (
                  <>
                    {tab === 'signup' ? (step === 1 ? 'Next Step' : 'Create Account') : 'Log In'}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignupSection;
