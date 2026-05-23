import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ─── Assets ──────────────────────────────────────────────────────────────────
import perspectiveGrid from '../../assets/perspective-grid.png';
import heroImage       from '../../assets/image.png';

// ─── Animation variants ───────────────────────────────────────────────────────
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const slideUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

// ─── Floating particles config ────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: `${(i * 9.5 + 5) % 95}%`,
  y: `${(i * 11 + 8) % 85}%`,
  size: (i % 3) + 2,
  duration: (i % 4) + 6,
  delay: (i % 5) * 1,
  color: i % 3 === 0 ? '#9d4edd' : i % 3 === 1 ? '#ff6a00' : '#00c973',
}));

// ─── Stat badges ─────────────────────────────────────────────────────────────
const statBadges = [
  { 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, 
    label: '50k+ Students' 
  },
  { 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17"/></svg>, 
    label: '200+ Colleges'  
  },
  { 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>, 
    label: '1M+ Messages'   
  },
];

const HeroSection = ({ onOpenSignup }) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  // Mouse parallax for girl image
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]),  springConfig);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top)  / rect.height;
    mx.set(relX - 0.5);
    my.set(relY - 0.5);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-labelledby="hero-heading"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        background: '#0a0010',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <style>{`
        @media (max-width: 991px) {
          .hero-main-grid { 
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .hero-cta-wrapper {
            justify-content: center !important;
          }
          .hero-girl-img {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            opacity: 0.15 !important;
            z-index: 1 !important;
            object-fit: cover !important;
          }
        }
      `}</style>

      {/* ── Mouse-following spotlight glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: mousePos.x - 200,
          top:  mousePos.y - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151,25,253,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'left 0.1s ease, top 0.1s ease',
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          animate={{
            y: ['0px', '-28px', '0px'],
            opacity: [0.25, 1, 0.25],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* ── Ambient purple orb (right) — breathing ── */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 'clamp(500px, 55vw, 900px)',
          height: 'clamp(500px, 55vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151,25,253,0.35) 0%, rgba(157,78,221,0.15) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Secondary orb (bottom-left) — breathing offset ── */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 'clamp(300px, 30vw, 500px)',
          height: 'clamp(300px, 30vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157,78,221,0.2) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Perspective grid (left half) ── */}
      <motion.img
        src={perspectiveGrid}
        alt=""
        aria-hidden="true"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '55%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.55,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent 100%)',
        }}
      />

      {/* ── Girl image — fade in + mouse parallax ── */}
      <motion.img
        src={heroImage}
        className="hero-girl-img"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, x: 40 }}
        animate={{ 
          opacity: 0.9, 
          x: 0,
          rotateX,
          rotateY,
        }}
        transition={{ 
          duration: 1.1, 
          ease: [0.25, 0.46, 0.45, 0.94],
          rotateX: { type: 'spring', damping: 25, stiffness: 120 },
          rotateY: { type: 'spring', damping: 25, stiffness: 120 },
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: '-5%',
          left: '40%',
          width: '62%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'left center',
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 30%, transparent 100%)',
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 0 40px rgba(151,25,253,0.2))',
        }}
      />

      {/* ── Main layout grid ── */}
      <div
        className="hero-main-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(100px, 10vh, 140px) clamp(24px, 8vw, 120px) clamp(60px, 8vh, 100px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* LEFT CONTENT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
        >

          {/* Badge pill with pulsing dot */}
          <motion.div variants={slideUp}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '30px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                width: 'fit-content',
              }}
            >
              {/* Pulsing dot */}
              <motion.span
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#9d4edd', display: 'inline-block',
                  boxShadow: '0 0 10px #9d4edd', flexShrink: 0,
                }}
              />
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600, fontSize: '15px',
                color: 'rgba(255,255,255,0.7)', margin: 0,
              }}>
                #1 in the world of campus connection
              </p>
            </motion.div>
          </motion.div>

          {/* Headline — "College" has animated shimmer gradient */}
          <motion.h1
            id="hero-heading"
            variants={slideUp}
            style={{ margin: 0, lineHeight: 1.05 }}
          >
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(38px, 4.5vw, 58px)',
              color: '#ffffff',
              display: 'block',
            }}>
              Your{' '}
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  fontFamily: "var(--font-baloo)",
                  fontSize: 'clamp(52px, 6.5vw, 84px)',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7C3AED, #9719fd, #ff6a00, #7C3AED)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                College
              </motion.span>{' '}
              Network,
            </span>
            <span style={{
              fontFamily: "var(--font-baloo)",
              fontSize: 'clamp(52px, 6.5vw, 84px)',
              fontWeight: 800,
              display: 'block',
              marginTop: '4px',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #9719fd 60%, #c77dff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Reimagined
              </span>
              <span style={{ color: '#ffffff' }}>.</span>
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={slideUp}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(15px, 1.5vw, 19px)',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              maxWidth: '480px',
              lineHeight: 1.65,
            }}
          >
            Join your verified college network to share ideas and connect with
            students around you. Real connections, real campus life.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={slideUp}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            {/* Primary CTA — opens signup overlay */}
            <motion.button
              id="hero-cta-primary"
              onClick={onOpenSignup}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(151,25,253,0.7)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 30px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #9719fd 0%, #7b2ff7 100%)',
                color: '#ffffff',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
                fontSize: '17px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(151,25,253,0.35)',
                transition: 'box-shadow 0.3s ease',
              }}
              aria-label="Get Started with CampusConnect"
            >
              Get Started
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'flex' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.a
              href="#team"
              id="hero-cta-secondary"
              whileHover={{ scale: 1.04, background: 'rgba(157,78,221,0.12)', borderColor: 'rgba(157,78,221,0.7)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 30px',
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: '17px',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s ease',
              }}
              aria-label="Meet our team"
            >
              Our Team
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Stat badges — glow on hover */}
          <motion.div
            variants={slideUp}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}
          >
            {statBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -3, scale: 1.04, boxShadow: '0 0 18px rgba(157,78,221,0.5)' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'rgba(157,78,221,0.08)',
                  border: '1px solid rgba(157,78,221,0.25)',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: '13px',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <span>{badge.icon}</span>
                {badge.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT: placeholder — girl is absolute */}
        <div />
      </div>

      {/* ── Bottom marquee strip ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: 'rgba(157,78,221,0.08)',
          borderTop: '1px solid rgba(157,78,221,0.2)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', paddingLeft: '48px', minWidth: 'max-content' }}
        >
          {Array.from({ length: 3 }).flatMap(() => [
            'Verified Colleges', '✦', 'Real Students', '✦', 'Secure Network', '✦',
            'Academic Communities', '✦', 'Campus Events', '✦', 'Study Groups', '✦',
          ]).map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: text === '✦' ? 700 : 500,
                fontSize: text === '✦' ? '10px' : '14px',
                color: text === '✦' ? '#9d4edd' : 'rgba(255,255,255,0.4)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Seamless bottom gradient bridge ── */}
      <div className="section-bridge-bottom" aria-hidden="true" />

      {/* ── Scroll indicator ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '68px',
          left: '50%',
          animation: 'scroll-bounce 2s ease-in-out infinite',
          zIndex: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(157,78,221,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

    </section>
  );
};

export default HeroSection;
